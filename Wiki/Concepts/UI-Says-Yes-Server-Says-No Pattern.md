---
title: UI-Says-Yes-Server-Says-No Pattern
description: The bug shape where a button works fine in the UI but silently fails at the database layer.
type: concept
created: 2026-07-27
updated: 2026-09-06
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
