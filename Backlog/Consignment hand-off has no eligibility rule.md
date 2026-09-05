---
title: Consignment hand-off has no eligibility rule
description: A store can be offered to the agent who already owns it, and to any agent in any region. Aldi gave the rule on 2026-09-05; one half of it still needs clarifying.
status: To Do
area: Store transfers
priority: HIGH
created: 2026-09-05
updated: 2026-09-05
---

# Consignment hand-off has no eligibility rule

Found by Aldi running the flow on the real app, 2026-09-05, right after
[[Handing a store to another agent rewrites sales history]] was fixed.

## What he hit

> *"i dont know why but i can ask for handsoff request to the people that own the responsibility for
> that stores, where it shouldnt be do that, and due to double profile for tier 1, i just tried to
> send the responsibility to tier 1 mobil pak boss it couldnt do that"*

Two separate things in one sentence:

1. **The current owner is offerable.** Nothing removes him from the target list.
2. **"mobil pak boss" was unpickable** — that profile has `userRole === 'ADMIN'` and the dropdown
   drops every admin profile. Working as written, but Tier 1 carrying two profiles means one of them
   silently disappears with no explanation, which reads as a bug even though it is not one.

## The rule he gave

> *"consignment should only be transferred between regional team member only, and only tier 1,2,3 is
> the one who can transfer consignment between regional area personnel"*

- **(a) Same region by default.** A hand-off stays inside one regional team.
- **(b) Tiers 1–3 cross regions.** ⚠️ **Ambiguous and NOT to be guessed.** It can mean those tiers
  may *send* a store to another region, or that a cross-region hand-off may be *requested* by anyone
  and only *approved* by them. Ask before building; the two are different permission models and the
  wrong one is a hole, not a cosmetic error.

## Where it lives

- `src/ConsignmentFinanceView.jsx:36-52` — `dropdownAgents`, the target list. Filters admins out,
  filters by region only when the admin region control is set, then by the search box.
- `src/App.jsx` `handleRequestTransfer` — writes the request with no eligibility check at all.

## The shape

One predicate used in BOTH places. The dropdown hides ineligible targets; the handler refuses them.
Dropdown-only is the [[UI-Says-Yes-Server-Says-No Pattern]], which is already why the delete guard
in `handleDeleteConsignmentData` exists.

Exclude the current owner via `ownerAgentId` on the customer document — added by the hand-off work,
`39cd90d`. **Not `mappedBy`**: that records who first registered the store, and
`handleRequestTransfer` still reads it to tell two same-named shops apart.

Region is `location` on the motorist, upper-cased and trimmed at `ConsignmentFinanceView.jsx:29-32`.
`UNASSIGNED` is a real value rather than an absence — decide explicitly whether such an agent can
receive anything.

## Related

[[Ownership Moves, History Does Not]] · [[Deploy the store hand-off write rule]]
