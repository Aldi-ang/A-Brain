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

`canApproveHandoffFrom(userRole, approverRegion, storeRegion)`.

- Tier 1 always, whatever else is configured. **Option B: he can never be locked out or lose a bell.**
- Configured: the tier's `handoff_region:<BRANCH>` entries must contain the store's branch.
  `approverRegion` is ignored here — the branch comes from the config, not from where the approver
  personally sits. That is his "power to choose 1,2,3,4 or whatever regional number".
- Default (nothing configured anywhere): T4 REGIONAL ADMIN standing in that same branch.

**The branch of a hand-off is the RECEIVING agent's.** `handoffEligibility` guarantees a receiver
has a real branch; the sender may be an admin with none. And the question being approved is whether
that branch may take this store.

`handoffApprovers(roster, storeRegion, excludeIds)` returns who else to ring. It leaves out every
Tier 1 (the `agentId: 'ADMIN'` notification already reaches them, and a Tier 1 matches every region
rule — this is what stops Aldi being told twice), the receiver, and the sender.

## What Option B cost, and where it is paid

Two people hold the Authorize button now, so:

1. **The request is re-read from Firestore at the moment of the write.** The rendered copy predates
   the other person's press. Without the re-read, a second press re-runs the whole approval: a
   second `handoffs` entry on the customer, a second round of notifications, and an already-APPROVED
   request flipped to REJECTED after the fact.
2. **Nobody authorises a hand-off they asked for or are receiving.** Otherwise the three-key
   protocol is a one-key protocol wearing three keys.

## The absence-means-tier-default shape — do not "fix" it

Both keys read a MISSING key as "use the tier default", never as "no". `injectDynamicPermissions`
replaces a saved tier's list wholesale, so a brand-new key is simply absent from the matrix Aldi
already deployed to Firebase. Read as a plain missing permission it means "no", and the feature
looks broken for every tier at once while the code is right. Six keys in that file now do this.

The moment the key appears anywhere in his saved matrix, his switch wins in **both** directions —
including taking the default away from T4.

## ⚠️ The branch list is DATA

`ConsignmentFinanceView.jsx:29-32` derives branches from the motorists' `location`, upper-cased and
trimmed. The Settings matrix enumerates the live branches **unioned with the ones already saved** —
without that union, a branch he granted vanishes from the screen the day its last agent moves away,
while the permission stays live in Firebase with no way to take it back.

A hardcoded branch list looks right on the day it is written and rots silently.

## Display

The picker **hides** everyone outside the regional team rather than greying them out — his reversal
on 2026-09-06, recorded in [[Aldi's Design Taste]]. Tiers 1-3 get a "Show other branches" checkbox,
off by default, or their cross-branch right would be live at the write and unreachable on screen.

## Live behaviour change on first deploy

With nothing configured, T4 REGIONAL ADMINs begin receiving approval bells and can authorise. That
is his stated default, not a side effect — but it happens without him opening Settings.

Related: [[Ownership Moves, History Does Not]] · [[Fleet Captain Permission Gap]] ·
[[Brainstorm/2026-09-06_handoff-approval-region-matrix]]
