---
confidence: high
checked: 2026-09-06
---

# Hand-off eligibility

Who may **receive** a consignment store, and who may **approve** the hand-off. Two halves of one
feature, built 2026-09-06 across three commits on `phase0-solid-ground`. Both halves refuse in the
UI **and** at the write, because [[UI Says Yes, Server Says No Pattern]].

Everything here lives in `src/config/permissions.js`. Nothing in it is a constant that a future
session may hardcode — see the branch-list warning at the bottom.

## The rules, in his words

> "consignment should only be transferred between regional team member only, and only tier 1,2,3 is
> the one who can transfer consignment between regional area personnel" — 2026-09-05

> "there should be option in the matrix for what tier that can receive and approve the consignment
> and also which is the region selected to receive from ... but on default their own regional admin
> is the only one who can do that, if we put this power towards the upper tier for all region then
> there will be massive loads of approval notification bells coming to the upper tier" — 2026-09-05

> "both still get the bells of course" — 2026-09-06, choosing ADD over REPLACE

## Half one — who may receive

`handoffEligibility({ toAgent, senderRole, senderRegion, senderIsCompanyWide, currentOwnerId })`
returns `{ ok, code, reason }`. Never a bare `false`: every refusal carries a sentence, because
[[Every Action Must Report]].

Refusal order: gone from the roster · owner account · already holds this store · receiver has no
branch · sender has no branch · other branch without the cross-branch right.

Cross-branch sending is the matrix key `handoff_cross_region`, default tiers 1-3.

⚠️ **`senderIsCompanyWide` is a separate flag, not an absent `senderRegion`.** The first draft
overloaded one variable for both "acts for the whole company" and "location never filled in", which
would have given every unplaced agent company-wide reach — the exact hole the predicate exists to
close. Caught before any check could have failed on it.

⚠️ **UNASSIGNED is not a branch, at either end.** It is the fallback for a missing `location`. Two
agents both missing one are not "the same branch", they are both unplaced.

## Half two — who may approve

`canApproveHandoffFrom(profile, storeRegion, roster)`. It takes a PERSON, not a tier.

- **Tier 1 always**, whatever anybody is named for. Option B: he can never be locked out or lose a
  bell.
- **Named**: the person's `approvalRegions` array must contain the store's branch. Where that person
  personally stands is irrelevant — an agent in Surabaya can answer for Bandung.
- **Not named**: the branch falls to its own T4 REGIONAL ADMIN — *unless somebody has been named for
  that branch*, in which case the default is displaced. See below.

`approvalRegions` lives on the employee record and is edited in **Fleet & Canvas → add/edit
personnel → Hand-off approval branches**, beside allowed payments and allowed price tiers.

### ⚠️ It was built on the TIER first, and that was wrong

For about an hour on 2026-09-06 this was a row per branch in the **permission matrix**, keyed by
tier. Aldi killed it on sight:

> "there is so flaw in the matrix system if u build it that way, i want the approval power to be
> given on specific person inside the fleet and canvas manager, because if u put it on each tier
> like this then, all the regional admin if tick, will see every single approval for every regional
> location as well, where i only want this 1 account to have the power for approval in bandung only"

He was right. Ticking BANDUNG against T4 handed Bandung to **every T4 in the company** — the control
built to stop the approval flood caused it. The permission matrix answers *what may this RANK do*;
*which branches does THIS PERSON answer for* was never a rank question. A self-check now asserts the
matrix carries no per-branch rows, so this cannot come back quietly.

### A grant displaces the default, for that branch only

His sentence carried "only" at both ends — one account, one branch. So naming anybody for BANDUNG
takes Bandung off Bandung's regional admin; Jakarta is untouched and still falls to its own.

That is also the whole revocation story. He grants, and the grant displaces, which is why there is
no separate "remove approval" switch.

### `null`, never `[]`

Absent or `null` means *not named* and the default applies. An empty array means *named for no
branches at all*. If the Fleet form wrote `[]` on every save, editing somebody's phone number would
silently strip a regional admin's default. Both the create and the edit path write `null` when
nothing is ticked, and a check asserts both paths.

### The bell

`handoffApprovers(roster, storeRegion, excludeIds)` returns who else to ring beside the owner. It
leaves out every Tier 1 (the `agentId: 'ADMIN'` notification already reaches them, and a Tier 1
matches every rule — this is what stops Aldi being told twice), the receiver, and the sender.

## What Option B cost, and where it is paid

Two people hold the Authorize button now, so:

1. **The request is re-read from Firestore at the moment of the write.** The rendered copy predates
   the other person's press. Without the re-read, a second press re-runs the whole approval: a
   second `handoffs` entry on the customer, a second round of notifications, and an already-APPROVED
   request flipped to REJECTED after the fact.
2. **Nobody authorises a hand-off they asked for or are receiving.** Otherwise the three-key
   protocol is a one-key protocol wearing three keys.

## The absence-means-tier-default shape — do not "fix" it

(This governs `handoff_cross_region`, the SENDING key. Approval no longer uses the matrix at all.)

The key reads a MISSING key as "use the tier default", never as "no". `injectDynamicPermissions`
replaces a saved tier's list wholesale, so a brand-new key is simply absent from the matrix Aldi
already deployed to Firebase. Read as a plain missing permission it means "no", and the feature
looks broken for every tier at once while the code is right. Five keys in that file do this.

The moment the key appears anywhere in his saved matrix, his switch wins in **both** directions —
including taking the default away from T4.

## ⚠️ The branch list is DATA

`ConsignmentFinanceView.jsx:29-32` derives branches from the motorists' `location`, upper-cased and
trimmed. The Fleet & Canvas control enumerates the live branches **unioned with the ones already
granted to somebody** — without that union, a branch he granted vanishes from the control the day
its last agent moves away, while the grant stays live in the database with no way to take it back.

A hardcoded branch list looks right on the day it is written and rots silently.

## Display

The picker **hides** everyone outside the regional team rather than greying them out — his reversal
on 2026-09-06, recorded in [[Aldi's Design Taste]]. Tiers 1-3 get a "Show other branches" checkbox,
off by default, or their cross-branch right would be live at the write and unreachable on screen.

## Live behaviour change on first deploy

With nobody named, T4 REGIONAL ADMINs begin receiving approval bells for their own branch and can
authorise them. That is his stated default, not a side effect — but it happens without him opening
Fleet & Canvas.

## 2026-09-07 — the receiver may now authorise their own incoming store

**Aldi's call, and it reverses one third of the three-key protocol.** He handed a store to a Tier 4
regional admin, who could accept it but not authorise it, and said *"cant approve it themself can u
fix this"*. He was told plainly that this was the second key, and that his own Tier 1 account could
already approve it, so nothing was stuck. He decided anyway: *"yeah they should be able to confirm
their own request"*. Shipped in `ad4f18b`.

**Implemented narrowly, and the narrowness is the whole safety of it.** Only the receiver exclusion
was dropped. `canApproveHandoffFrom` still runs on every candidate, so:

| who | may authorise a store handed to them |
|---|---|
| a branch approver (named, or the branch's own T4 by default) | **yes — new** |
| an ordinary Tier 5 / Tier 6 agent | no, unchanged |
| the SENDER | no, unchanged — asking for a store and granting it yourself is one person doing everything |

The bell fan-out moved with the button: `handoffApprovers` is called with only the sender in
`excludeIds`. A button with no notification behind it is the same fault as the notification with no
button that `5973fc2` fixed hours earlier.

⚠️ `MANUAL_TEST_CHECKLIST.md` Round 7 Section C item 4 said the receiver never gets an approval
bell. It was rewritten the same day. **Do not "restore" this behaviour as if it were a regression** —
it is a decision, and it is his.

## 2026-09-07 — and the approval queue was invisible to the very people it was for

Separately the same day, `5973fc2`. `pendingAdminRequests` was correct — three RENDER sites then
threw it away unless `isAdmin`, which in this app is not "is an admin" but the vault-unlock flag,
and POV forces it false. A real Tier 4 with granted approval power got the bell and a panel reading
"No pending action required." The memo's deps also omitted `motorists`/`myProfile`, so the queue
was computed once against a roster that had not loaded — a permission bug and a staleness bug
wearing one symptom.

Related: [[Ownership Moves, History Does Not]] · [[Fleet Captain Permission Gap]] ·
[[A Hijacked UID Is Not an Identity]] · [[A Stored Name Is Not the Name of Record]] ·
[[Brainstorm/2026-09-06_handoff-approval-region-matrix]]
