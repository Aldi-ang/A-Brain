---
title: "The Shorter List Was Never the Eligible One"
description: Hand-off eligibility shipped as one predicate guarding both the picker and the write; a day later the display was reversed from greying out to hiding, and the fix that shortened the list was regional team, not eligibility.
type: summary
created: 2026-09-06
updated: 2026-09-06
tags: [kpm, handoff, permissions, tier-system, vercel, summary]
source: "[[../../Raw/2026-09-06_source_kpm-handoff-eligibility-and-demo-blockers]]"
---

# The Shorter List Was Never the Eligible One

Source: [[../../Raw/2026-09-06_source_kpm-handoff-eligibility-and-demo-blockers]] — KPM commits
`dace958` -> `dd5639a`, 2026-09-06 07:22 -> 08:02 WIB.

## What shipped

**`dace958` — `handoffEligibility` in `src/config/permissions.js`.** One predicate, called in the
hand-off picker *and* in `handleRequestTransfer`. Before it, `handleRequestTransfer` created the
`account_transfers` document with no eligibility check of any kind — a field agent could hand a
store to somebody on the other side of the company. Textbook
[[../Concepts/UI-Says-Yes-Server-Says-No Pattern]], and it was named as such in the commit: hiding
a name in a dropdown leaves the handler open, so the write refuses too.

Rules, in the order they run: an agent off the roster is refused; an owner account is not a
target; the current owner is not offered the store they already hold, not even to an admin; no
branch on file at either end is a refusal; same branch always allowed; different branch allowed
only for tiers 1-3 — the line [[../Concepts/Aldi's Design Taste|Aldi]] drew on 2026-09-05.

**`43cd4f3` — the display decision was reversed the next morning.** Aldi: *"i dont want the list
to be greyed out, but just hide personnel that is not on regional team on default."*

## The thing worth carrying

**Eligibility alone would not have fixed his complaint.** He is Tier 1 — every agent in the
company is eligible *for him*. Hiding the ineligible would have hidden nobody from the one person
complaining, and the dropdown would have been exactly as long. The filter that actually shortens
it is the **regional team**: the sender's own branch, or, when they have none, the branch of the
agent who holds this store today. A correct permission predicate and the fix for a
too-long-list complaint were two different filters that happened to look like one.

The reversal kept two obligations:

- **A view filter must never become a permission.** Tiers 1-3 *may* cross branches
  (`handoff_cross_region`). Hiding other branches with no way back would leave that right live at
  the write and unreachable through the screen. So a "Show other branches" checkbox appears for
  exactly those tiers, off by default. It widens the view and never the permission —
  `handoffEligibility` still decides, not the checkbox. Flipping it clears the chosen target, or
  Confirm would send to a person no longer on screen.
- **The one case where hiding still reads as broken has to speak.** An empty list now says
  *"Nobody in JAKARTA can receive this store"*, or points at Fleet when nobody has a branch at
  all. Hiding names is what made this screen read as broken in the first place.

## Two decisions made inside the fix, both flagged rather than assumed

- **UNASSIGNED is not a region, at either end.** It is the fallback string for a missing
  `location` field. Two agents both missing a location are not "in the same branch" — they are
  both unplaced, and treating them as matching would let the emptiest possible record grant the
  widest possible reach. Each refusal names what to fix.
- **`senderIsCompanyWide` is a separate flag, not an absent `senderRegion`.** An owner acting for
  the company has no branch; so does an agent whose location was never filled in. Overloading one
  to mean the other reopens the hole above. The first draft did overload it — the self-check
  catches the regression.

## The new matrix key, and why absence must not mean "no"

`handoff_cross_region` is a `ROLE_PERMISSIONS` matrix key with the same
**absence-means-tier-default** shape as `view_expected_count`, `handle_delivery` and
`manage_registry`. A brand-new key is simply missing from the matrix already saved in Firebase, so
reading that absence as "no" would break the feature for every tier at once while the code was
right. Default is tiers 1-3; once the key appears in Aldi's saved matrix his switch wins in both
directions. See [[../Entities/Tier System]].

## The brief named the wrong list

The job brief said `dropdownAgents` (`ConsignmentFinanceView.jsx:36`) was the target list. It is
not — that is the admin's own region/search filter for *viewing*. Editing it would have changed
who an admin can look at while leaving the real picker wide open. The hand-off picker builds its
own list inline in the `transferMode` block. The self-check now anchors on the picker's own text
so the two cannot be confused again, and `fd0166c` corrected the brief in place.

## The demo nobody could open

`952b0ca` records what a `curl` actually showed: **`kpm-ang.vercel.app` answers 302 to
`vercel.com/sso-api`.** Vercel Deployment Protection has been bouncing every visitor not signed
into Aldi's Vercel team. That — not the Firebase screenshot he was looking at — is why his friends
saw nothing. Both blockers are settings, neither is code, and both are his to flip.

It also killed three rejected options: **no demo account was ever needed.** Fleet & Canvas already
requires a Google account email when adding personnel, and `App.jsx` reads that
`employee_directory` doc on login. Real accounts already work.

## Verification, and its ceiling

25 new checks in `logicFixes.selfcheck.mjs` for `dace958` (1035 -> 1060), then 1060 -> 1073 for the
picker reversal; all green, build green, `integration.audit.mjs` 722/722. Both changes were
**trialled red before green** — source files restored from a copy rather than a stash, so the check
file could never be reverted along with them ([[../Concepts/Anti-Recurrence Check]]).

**Not verified visually, in both commits:** the picker sits behind Firebase auth inside a selected
consignment store. Everything above is proven by checks, not by anyone seeing the dropdown.

## Still open

The **approving** half. Aldi answered on 2026-09-06: **Option B** — a delegated tier is *added*
beside him, never replacing him, *"both still get the bells of course"*. That choice creates two
obligations recorded in `NEXT-SESSION.md`: a double-authorise guard, and no doubled bell for a
Tier 1 who matches every region. See
[[../../Brainstorm/2026-09-06_handoff-approval-region-matrix]].
