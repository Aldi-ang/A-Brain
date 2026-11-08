---
title: Consignment hand-off has no eligibility rule
description: A store can be offered to the agent who already owns it, and to any agent in any region. Aldi gave the rule on 2026-09-05; one half of it still needs clarifying.
status: Done
done: "dace958 + 43cd4f3 + 8731c2b (2026-09-06): the wrong receiver is refused in the picker and at the write; approval by matrix and region, his 2026-09-05 rule"
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

### 🔒 The data shape — DECIDED 2026-09-05, do not re-propose the cheap version

Offered string flags (`approve_consignment_own_region` / `_all_regions`) as the encoding that fits
the existing shape with no reader changes, he refused it and named the flaw better than the offer did:

> *"no i want all the region the be registered on the matrix, because if there is only 2 option all
> or own regional approval means that there are only 2 option to choose floods or drip of water, the
> system that i want to make is to have power to choose 1,2,3,4 or whatever regional number that i
> want to receive notification and approval from"*

**Every region is registered in the matrix; a tier holds an arbitrary subset of them.** Flags are
refused outright — own-versus-all is precisely the binary he is escaping, and a cheap encoding that
only offers the two extremes is not a smaller version of this feature, it is a different one.

The cost is accepted: `ROLE_PERMISSIONS` maps each tier to a flat array of strings today and every
reader assumes that, so the Firebase document, the settings screen and every reader have to agree on
a new per-tier field.

**⚠️ The trap that would make a lazy build wrong.** The region list is DATA, not a constant.
`ConsignmentFinanceView.jsx:29-32` derives `uniqueLocations` from the motorists' `location` field,
upper-cased and trimmed, with `UNASSIGNED` a real value rather than an absence. So the matrix must
enumerate the regions that actually exist, pick up a new one the moment an agent is given that
location, and cope with a tier whose saved list names a region nobody is in any more. A hardcoded
region list looks correct on the day it is written and rots silently afterwards.

**Worth keeping as a shape:** twice in one conversation the cheaper encoding was the one that
quietly delivered less than was asked. Offering it is fine; shipping it because it fits the existing
structure is how a feature arrives looking complete and doing half the job.

## Related


[[Ownership Moves, History Does Not]] · [[Deploy the store hand-off write rule]]
