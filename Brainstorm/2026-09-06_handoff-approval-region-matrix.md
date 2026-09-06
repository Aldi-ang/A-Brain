# Hand-off approval: who gets the bell, and for which regions

**Status: OPEN — waiting on Aldi.** Written 2026-09-06, before his answer, so the options survive a
`/clear`. Related: [[Ownership Moves, History Does Not]], [[UI Says Yes, Server Says No Pattern]].

## The problem, in his words

> "regarding the approval for the consignment there should be option in the matrix for what tier
> that can receive and approve the consignment and also which is the region selected to receive
> from this way it would increase flexibility for who can have the power of the approval for
> specific area or areas, but on default their own regional admin is the only one who can do that,
> if we put this power towards the upper tier for all region then there will be massive loads of
> approval notification bells coming to the upper tier, thats why i think regional selecting is
> important in this matter"

And on the data shape, refusing the cheap version:

> "no i want all the region the be registered on the matrix, because if there is only 2 option all
> or own regional approval means that there are only 2 option to choose floods or drip of water,
> the system that i want to make is to have power to choose 1,2,3,4 or whatever regional number
> that i want to receive notification and approval from"

## What the app does today

- `App.jsx handleAgentAcceptTransfer` writes the approval bell with `agentId: 'ADMIN'`. One
  recipient, always, whatever the store's region.
- `ConsignmentFinanceView.jsx:326` `adminPend` lists every `PENDING_ADMIN` request with no filter
  on who is looking; the Authorize/Reject buttons at `:1080-1081` sit inside the admin block.
- So the approver is Aldi, for every hand-off in the company. That is the "flood" end of his own
  metaphor, and it is what he wants to be able to delegate.

## Option A — the configured tier REPLACES the admin as approver

The bell goes to the tier(s) he named for that store's region, and to nobody else.

| | |
|---|---|
| Costs | he stops seeing hand-off approvals for any region he has delegated |
| Risk | a delegated region whose approver never logs in leaves hand-offs stuck with nobody told |
| Fits | his stated reason — the whole point was to stop bells reaching the upper tier |

## Option B — the configured tier is ADDED to the admin

Both get the bell; either can authorise.

| | |
|---|---|
| Costs | he keeps every bell he has now, so nothing is actually taken off his pile |
| Risk | two people can authorise the same request; needs a "someone already did this" guard |
| Fits | safer, but it does not solve the load problem he described |

## Option C — replace, with the admin kept as a fallback after a delay

Bell to the regional approver; if it is still `PENDING_ADMIN` after N days, it also reaches him.

| | |
|---|---|
| Costs | needs a timer or an on-open sweep; the most code of the three |
| Risk | the delay is a number nobody has picked, and a wrong one is invisible |
| Fits | solves both the flood and the stuck-forever case |

## The data shape — decided by me, open to his overrule

Store the per-tier region subset as one array entry per region inside the existing
`ROLE_PERMISSIONS[tier]` string array, prefixed: `handoff_region:JAKARTA`,
`handoff_region:BANDUNG`.

He refused `approve_consignment_own_region` because it offers only two settings — "floods or drip
of water". One entry PER REGION is not that flag; it is exactly the arbitrary subset he asked for,
and he can pick 1, 2, 3, 4 or all of them.

Why this carrier and not a new top-level field: `ROLE_PERMISSIONS` maps each tier to a flat array
of strings and every reader in the app assumes that shape. `injectDynamicPermissions` merges it,
`hasClearance` reads it, and the Settings save path already writes it. A new field beside it means
teaching the Firebase document, the settings screen and every reader a second shape for no gain.

⚠️ The region list is DATA, not a constant. `ConsignmentFinanceView.jsx:29-32` derives the regions
from the motorists' `location`, upper-cased and trimmed, with `UNASSIGNED` as a real value. The
matrix must enumerate the regions that actually exist, pick up a new one the moment an agent is
given a new location, and cope with a saved list naming a region nobody works in any more. A
hardcoded region list looks right on the day it is written and rots silently.

`PermissionMatrixEditor` currently receives only `{db, appId, userRole, userId}`, so the live region
list has to be passed down to it.

## Default when he has configured nothing

His words: "on default their own regional admin is the only one who can do that". That is a
PER-PERSON region match, not a tier-wide grant — a T4 REGIONAL ADMIN approves requests whose store
is in their own `location`, and no other region.

Tier 1 always approves everything, so his own live flow is untouched until he configures a region.

## REJECTED ON PURPOSE — do not re-propose

- **A two-value setting** (`all regions` vs `own region`). His exact refusal: "only 2 option to
  choose floods or drip of water".
- **A hardcoded region list** in the matrix UI. Regions come from agents' locations and change.
- **Gating only the Authorize button.** Hiding a control leaves the handler open — the pattern
  already named in this vault, and already the reason the delete guard exists. Whatever is chosen
  has to refuse in `handleAdminApproveTransfer` too.

## What is already built (2026-09-06, commit `dace958`)

The SENDING half is done and green: `handoffEligibility` in `src/config/permissions.js` refuses the
wrong receiver in both the picker and the write. Cross-branch sending is already a matrix key,
`handoff_cross_region`, defaulting to tiers 1-3 with the absence-means-tier-default shape. The
APPROVING half in this note is what remains.
