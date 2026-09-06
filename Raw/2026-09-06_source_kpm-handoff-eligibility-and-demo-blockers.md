---
title: "Source — KPM hand-off eligibility, the picker reversal, and the demo blockers (2026-09-06)"
description: The five KPM commit messages of 2026-09-06 morning, unedited — handoffEligibility shipped, the greyed-out picker reversed to hiding, and the two settings blocking the public demo link.
type: raw-source
created: 2026-09-06
updated: 2026-09-06
tags: [raw, kpm, handoff, permissions, vercel]
---

# Source: KPM commits 2026-09-06 07:22 -> 08:02 WIB

Captured by the `a-brain-session-ingest` scheduled task on 2026-09-06. Commit messages exactly as
written in the `kpm-inventory` repo (branch `phase0-solid-ground`), `dace958` -> `dd5639a`. Body
text below is untouched.

## dace958 — 2026-09-06 07:22 WIB

**Hand-off eligibility: refuse the wrong receiver in the picker AND at the write**

```
Aldi, 2026-09-05: "consignment should only be transferred between regional team
member only, and only tier 1,2,3 is the one who can transfer consignment between
regional area personnel".

Two separate faults, and they were not the same fault:

1. The picker offered the agent who ALREADY held the store. That is the one he hit
   first - he could send a hand-off request to its current owner, and the write
   accepted it, producing a request that moves nothing.
2. Nothing anywhere compared branches. `handleRequestTransfer` in App.jsx created the
   account_transfers document with no eligibility check of any kind, so a field agent
   could hand a store to somebody on the other side of the company.

THE FIX is one predicate, `handoffEligibility` in src/config/permissions.js, called in
both places. Hiding a name in a dropdown leaves the handler open - the "UI Says Yes,
Server Says No" pattern already named in the vault - so the write refuses too.

Rules, in order: an agent no longer on the roster is refused; an owner account is not a
hand-off target; the current owner cannot be offered the store they already hold, not
even by an admin; a receiver with no branch on file cannot receive; a sender with no
branch on file cannot send; same branch is always allowed; a different branch is allowed
only for tiers 1-3, which is the line he drew.

DECISIONS MADE HERE, both flagged to him:

- UNASSIGNED is not a region, at either end. It is the fallback string for a missing
  `location` field, not a place. Two agents both missing a location are not "in the same
  branch", they are both unplaced, and treating them as matching would mean the emptiest
  possible record grants the widest possible reach. Each refusal names what to fix.
- `senderIsCompanyWide` is a separate flag rather than an absent `senderRegion`. An owner
  acting for the company has no branch; so does an agent whose location was never filled
  in. Overloading one to mean the other reopens exactly the hole above. The first draft
  of this predicate did overload it; the self-check below catches that regression.

Cross-branch authority is a matrix key, `handoff_cross_region`, with the same
absence-means-tier-default shape as view_expected_count, handle_delivery and
manage_registry: a brand-new key is simply missing from the matrix already deployed to
Firebase, and reading that absence as "no" would break the feature for every tier at once
while the code was right. Once the key appears in his saved matrix his switch wins in both
directions. Default is tiers 1-3, stopping above T4 REGIONAL ADMIN.

The brief for this job said `dropdownAgents` (ConsignmentFinanceView.jsx:36) was the
target list. It is not - that is the admin's own region/search filter for viewing, and
editing it would have changed who an admin can look at while leaving the real picker
wide open. The hand-off picker builds its own list inline in the transferMode block.
The self-check anchors on the picker's own text so the two cannot be confused again.

An ineligible agent is drawn greyed out carrying the reason, not deleted from the list.
A name that silently vanishes is what made this screen read as broken in the first place.

Ownership is resolved from the customer document's `ownerAgentId`, falling back to the
agent stamped on the store's newest row. Not `mappedBy` - that records who first
registered the shop and handleRequestTransfer still reads it to tell two same-named
shops apart.

Checks: 25 new in logicFixes.selfcheck.mjs (1035 -> 1060, all green). Trialled red twice
before green, source files restored from a copy rather than a stash so the check file
itself could never be reverted with them:
  - wiring reverted, predicate kept: 6 FAIL (both imports, both write-path guards, both
    picker guards)
  - predicate regressed to the two real bugs: 3 FAIL (current owner offered again;
    admin offered the current owner; unplaced sender granted company-wide reach)
Build green, integration.audit.mjs 722/722.

NOT verified visually: the greyed-out option needs a signed-in session with real
motorists inside a selected consignment store, which is behind Firebase auth.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

## fd0166c — 2026-09-06 07:26 WIB

**Notes: hand-off sending half shipped; the approving half owes one answer**

```
PROGRESS gets the dace958 entry and the open question verbatim. NEXT-SESSION is
rewritten as a QUESTION rather than an instruction, because the replace-vs-add answer
changes the notification target and the button gating - a brief that promised an edit
here would be promising the wrong one half the time.

Also corrects the previous brief in place: it named dropdownAgents as the hand-off
target list. It is the admin's own view filter. The picker builds its own list inline.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

## 48f5b10 — 2026-09-06 07:27 WIB

**graphify update after the hand-off eligibility change**

```
AST-only rebuild, no API cost. 1461 nodes, 2593 edges, 84 communities.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

## 43cd4f3 — 2026-09-06 07:59 WIB

**Hand-off picker: hide personnel outside the regional team instead of greying them out**

```
Aldi, 2026-09-06: "i dont want the list to be greyed out, but just hide personnel that
is not on regional team on default, so that there will be less personel list when the
dropdown is opened".

This reverses the display decision shipped yesterday in dace958, which drew an
ineligible agent greyed out with the reason beside the name. His call, and his reason is
list length. The two self-check assertions that pinned the greyed-out row are replaced
rather than deleted, so the new behaviour is pinned just as hard.

WHY ELIGIBILITY ALONE WOULD NOT HAVE FIXED HIS COMPLAINT. He is Tier 1, so every agent
in the company is eligible for him - hiding only the ineligible would have hidden nobody
from the one person who complained, and the dropdown would have stayed exactly as long.
The filter that actually shortens it is the REGIONAL TEAM: the sender's own branch when
they have one, and otherwise the branch of the agent who holds this store today, which
is what an admin means by "this store's team".

THE TOGGLE IS NOT A NICETY. Tiers 1-3 are permitted to hand a store to another branch
(handoff_cross_region, added yesterday). Hiding other branches with no way back would
leave that permission live at the write and unreachable through the screen - a right
that exists and cannot be used. So a "Show other branches" checkbox appears for exactly
those tiers, off by default, which is the default he asked for. It widens the VIEW and
never the permission: a Tier 5 who ticks nothing and a Tier 5 who could tick it both
still cannot cross, because handoffEligibility decides that, not the checkbox.

Flipping the toggle clears the chosen target. Picking somebody in another branch and
then hiding that branch again would otherwise leave their id sitting in state, and
Confirm would send a hand-off to a person no longer on screen.

An empty list now says so - "Nobody in JAKARTA can receive this store", or, when nobody
has a branch at all, a line pointing at Fleet. Hiding names is what made this screen
read as broken in the first place; the one case where hiding still bites has to speak.

HANDOFF_BLOCK_SHORT is removed - this change orphaned it, nothing else read it.

Checks: 1060 -> 1073, all green. Trialled red first: reverting only the picker (the
check file and permissions.js kept, restored from a copy rather than a stash) fails 9,
including the anchor guard on the new memo. Build green, integration.audit.mjs 722/722.
A pre-existing `visibleTo` at logicFixes.selfcheck.mjs:4338 collided with the new
helper; renamed to `pickerShows`, which the ESM parse caught immediately.

NOT verified visually: the picker is behind Firebase auth inside a selected consignment
store, and signing in is not something I do.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

## 952b0ca — 2026-09-06 08:02 WIB

**Notes: the picker hides now, Option B is chosen, and the demo link has two blockers**

```
PROGRESS records what the curl actually showed - kpm-ang.vercel.app answers 302 to
vercel.com/sso-api, so Deployment Protection has been bouncing every visitor who is not
signed into Aldi's Vercel team. That, not the Firebase screenshot, is why his friends saw
nothing. Both settings are his to flip; neither is code.

It also records the thing that made his three rejected options unnecessary: Fleet & Canvas
already requires a Google account email when adding personnel, and App.jsx reads that
employee_directory doc on login. Real accounts already work. No demo account was ever
needed.

NEXT-SESSION flips from a question to a build, because he answered: Option B, both get the
bells. The job block carries the two obligations that choice creates and keeps the queue
underneath untouched.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

## dd5639a — 2026-09-06 08:02 WIB

**graphify update after the picker change**

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

