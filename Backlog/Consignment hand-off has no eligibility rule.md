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
- **(b) Tiers 1–3 cross regions.** Asked whether that meant *sending* or *approving*, he rejected
  both readings and gave a third design — see below. That is the one to build.

## ✅ ALDI DECIDED — 2026-09-05. Approval authority is a matrix option, scoped by region.

> *"regarding the approval for the consignment there should be option in the matrix for what tier
> that can receive and approve the consignment and also which is the region selected to receive from
> this way it would increase flexibility for who can have the power of the approval for specific area
> or areas, but on default their own regional admin is the only one who can do that, if we put this
> power towards the upper tier for all region then there will be massive loads of approval
> notification bells coming to the upper tier, thats why i think regional selecting is important in
> this matter"*

Two things become configurable per tier: **who may receive and approve a consignment hand-off**, and
**which regions they may do it for**. Default is the agent's own regional admin and nobody else.

**His reason is operational load, not policy** — an upper tier holding approval for every region
drowns in approval notifications. Worth keeping as a general shape: *a permission granted too widely
is not only a security question, it is a workload question*, and the bell is the surface where that
cost lands. The bell fault fixed earlier the same day (`4bb9ad7`) is what made this visible to him
at all — once notifications actually opened, their volume became a design constraint.

### The matrix is already runtime-editable — this is smaller than it looks

`src/config/permissions.js:109` is `export let ROLE_PERMISSIONS`, a mutable binding, and
`src/App.jsx:467` downloads custom permissions from Firebase at startup and overwrites it. So this
is new keys plus a region scope, not a new configuration system.

### The data shape is a real decision — do not settle it quietly

Every tier maps to a flat ARRAY OF STRINGS and every reader assumes that shape.

| Option | Expresses | Cost |
|---|---|---|
| String flags — `approve_consignment_own_region` / `_all_regions` | own vs all | fits perfectly, no reader changes — but **cannot say "regions X and Y"**, which is what he asked for |
| Per-tier region map beside the array | exactly what he described | matrix stops being one uniform shape; Firebase doc, settings screen and every reader must agree |

He described the second. Shipping the first because it is easier would quietly deliver less than he
asked for — propose it explicitly if proposing it at all.

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
