---
title: UI-Says-Yes-Server-Says-No Pattern
description: The bug shape where a button works fine in the UI but silently fails at the database layer.
type: concept
created: 2026-07-27
updated: 2026-09-17
confidence: high
checked: 2026-09-06
tags: [pattern, permissions, bug-class]
---

# UI-Says-Yes-Server-Says-No Pattern

A recurring bug shape across this codebase: the client UI shows a control (a button, an
Edit action) to a user because the app's *intent* clearly includes them — but the
[[Firestore Rules|server-side rule]] guarding the actual write was never updated to match.
The user clicks the button, the UI says yes, and the write silently fails at the database
layer.

## Why this is worse than an obviously-broken feature

These bugs are quiet. The UI doesn't show an error until the user actually tries the action
— sometimes not even then, if the failure is caught and swallowed (see the Rank Config bug
in [[Rank Config and Achievement Badges]], wrapped in a try/catch that hid it completely).
A feature can look fully built and simply not work for the exact users it was built for.

## The sharpest instance: Fleet Captain

[[Fleet Captain Permission Gap]] is this pattern recurring at least 5 separate times with
the same specific cause: `isAreaAdmin()` checking only the literal `'AREA_ADMIN'` string
while the UI (correctly) also shows the same controls to a delegated `FLEET_CAPTAIN`.

## The version where the server check did not exist at all (2026-09-06)

`handleRequestTransfer` in `App.jsx` created the `account_transfers` document with **no
eligibility check of any kind** — not an incomplete one, an absent one. A field agent could hand a
store to somebody on the other side of the company. The picker was the only thing standing between
the app and that write, and a picker is not a boundary.

The fix is the shape to copy: **one predicate, `handoffEligibility` in `src/config/permissions.js`,
called in both places.** Not a duplicated condition in two files that can drift — one exported
function, one truth, refused at the picker for the human and at the write for everything else. The
commit named this pattern by name as the reason.

A follow-on from the same day sharpens the rule further: when the picker was later reversed to
*hide* other branches instead of greying them out, the checkbox that reveals them widens the
**view** and never the permission. A Tier 5 who ticks nothing and a Tier 5 who could tick it both
still cannot cross, because the predicate decides. Source:
[[../Summaries/The Shorter List Was Never the Eligible One]].

## The inverse shape: the server check was RIGHT, and a decision changed only the UI (2026-09-08)

Every instance above is a server rule that was never correct. This one was correct when it shipped
and went **stale**, which is harder to see and reaches production the same way.

`ad4f18b` carried Aldi's call that a branch approver may authorise a store handed to them — *"yeah
they should be able to confirm their own request"*. It landed in the QUEUE
(`ConsignmentFinanceView.jsx`, which dropped the sender only and then deferred to
`canApproveHandoffFrom`) and not in the WRITE (`handleAdminApproveTransfer` in `App.jsx`, still
refusing `toAgentId === agentProfileId || fromAgentId === agentProfileId`). The queue drew the
Authorize button; the write refused the press.

He found it the day after, as the one person who could: KALDI is Bandung's only account, its named
approver, and was the receiver — so both bells rang for him and the button did nothing. *"kaldi
receive both bells for handsoff request and its approval, but cant approve it"*.

**Which half is stale is a decision, not a detail.** Making the LIST match the WRITE is the
smaller-looking diff and it silently reverses his own call — a fix that reads as green and undoes a
decision. Fixed in `d84bc4c` by deleting the receiver clause from the write, with the reasoning
written above the guard because the next reader will see it as a missing check.

**The rule this adds:** a decision that changes who may do something has to name every place that
answers the question, before the first edit. Two answers to one question is the pattern whatever
the reason for the split — a rule that was never written, or one written once and later half
changed. See [[Anti-Recurrence Check]].

**A guard against a guard needs the comments stripped.** The self-check asserting the clause is
gone failed on its own warning comment, which quotes the clause it tells you not to restore. Scope
to `code()`, never to a raw grep of a file that also discusses the code.

## The UI said NO before the server had spoken — a stale verdict beside a fresh identity (2026-09-16)

Aldi's first open on a new address, his own tier-1 account: *"access denied that took too long
on recognizing my tier 1 account, it said im not part of the employee"*. Then the vault gate,
then the app; never again on later opens. Shipped as kpm `af4d5e2`.

**The trap in the diagnosis.** The red *Access Denied* panel renders when `user` is set AND
`userRole === 'UNAUTHORIZED'`. Inside the sign-in listener his email has a bypass in both the
try and the catch, so the first answer was "unreachable for your account" — and it was wrong.
The two halves of the condition have DIFFERENT writers: the role was left at UNAUTHORIZED by
the page's very first `onAuthStateChanged(null)` (the sign-out branch), and `user` was set by
`handleLogin` the instant the Google popup resolved — a second writer, outside the listener.
Set together, they painted a verdict left over from a sign-out while the listener's four serial,
server-first reads were still running on a cold connection. Later opens have a warm connection
and no popup path, so the same two writes never overlapped again.

**Rule for the next "that state is unreachable":** grep every WRITER of each half of the
condition, not just the code path you are reading. A state is reachable if any pair of writers
can leave both halves true at the same time, whatever function each lives in.

**The fix shape** (the honest one, not the fast one): the listener owns `user`; the first thing it
says is a STATUS ("Checking your account", the account named, a way out) and `user` stays null
until the role is known — so nothing keyed on `user` starts under a role about to change; the
independent reads go out in one `Promise.all`; `finally` clears the status on every exit. The
same session also stopped OPEN THE VAULT from awaiting a bookkeeping write (the strike reset)
before its animation — a server round trip between the right password and the first frame.

## The general lesson

Whenever a UI shows a control gated on tier/role/permission, the matching server-side rule
needs to be checked against the *same* set of roles the UI actually uses — not assumed to
already cover it because the function name sounds right.

## Related

- [[Fleet Captain Permission Gap]]
- [[Firestore Rules]]
- [[Tier System]]
- Summaries: [[Fleet Captain Rule Gaps — Batch 1 and 2]], [[Rank Config Cross-Tenant Gap]],
  [[The Shorter List Was Never the Eligible One]]

### The morning after: the test passed, and the next wait was named (2026-09-17)

*"i tested it on incognito and relog to my account tier 1 and there is no access denied panel, it
give me straigh to the master vault panel instead which is good"* — `af4d5e2` confirmed. Then:
*"the password press still took some time to submit and react"*. That wait was
`handlePinLogin`'s first line of work, `await getDoc(settings/admin)`, one cold round trip
before anything on screen moved. Shipped as kpm `dfc2392`: the profile is fetched into
`adminProfileRef` the moment the gate is SHOWN (he spends seconds typing — that is the round
trip), the press uses it or falls back to a live read, a failed attempt re-arms the fetch AFTER its
own strike write so the next press never reads a pre-strike copy, and `pinChecking` puts
"Checking…" with the spinning arrows on the button and disables it until the answer is back. The
same shape as the first-open fix: name the exact await between the press and the first pixel,
move it earlier, and say something on screen while whatever is left runs.

Confirmed on his phone at 09:05: *"t1 approve, t 2 approve, t3 i just tried to close the incognito and open it again after that i manual google login , master vault panel shows up enter password and it instantly let me in after press so i havent be able to see the processing animation tho"*. The spinner was never seen because the read it covers was
already back — the faster path won and the report path stayed as insurance for a slow signal.
