---
date: 2026-11-20
status: OPEN — waiting on Aldi (discuss after the Claude quota reset)
confidence: medium
checked: 2026-11-20
---

# General product packing (not cigarette-only)

## PROBLEM (his words)
*"packing bks dll should be redesign to make it more general right now the system we have on adding new product is still relate to cigarette we need to redesign it so that it fit with every type of product especially FMCG"*
Then: *"wait for this lets discuss first we can work it out after our quota reset because it is connecting with the calculation and stuff i want to be aware that this is critical update for this app"*

Screenshot: product form "Packing" = Bks per Slop / Slop per Bal / Bal per Karton, plus "sticks" per Bks.

## OPTIONS
| | A. Unit NAMES per product, same 4-level ladder | B. Rebuild the unit system |
|---|---|---|
| What | Same stored numbers (`sticksPerPack`, `packsPerSlop`, `slopsPerBal`, `balsPerCarton`); each product adds names (smallest unit + 3 pack names). Defaults Bks/Slop/Bal/Karton. Level = 1 -> hidden. | Any number of levels, any names, own base unit. |
| Stock + money maths | Unchanged (`convertToBks` and every counter stay) | Rewritten everywhere stock is counted |
| Risk | Low - mostly labels | High - old stock, sales, setoran could miscount |
| Size | Days | Weeks + every money path re-checked |

Example A: Pcs -> Box (12) -> Dus (4) -> Karton (1).

## COSTS / traps to check before deciding
- "Bks" is the money unit: prices are per Bks, setoran, EOD, van loading, reports all count Bks. Option A keeps Bks as the internal "level 1" and only renames it per product.
- "sticks" (`sticksPerPack`) drives sampling/promo pieces - a non-cigarette product may have no "pieces" level.
- Mixed carts: a total in "Bks" across milk + cigarettes means nothing to a reader; reports may need per-product units.
- First step either way: a read-only map of every place that shows or assumes Bks/Slop/Bal/Karton/sticks (label-only vs maths).

## DECISION
OPEN — waiting on Aldi. Nothing built, nothing queued to Antigravity.

## REJECTED ON PURPOSE
Nothing yet. Claude leans A (same maths, new names); B only if a product truly needs 5+ levels or a different base unit per place.

Models applied: Reversibility Test (data model), Second-Order Thinking (setoran / reports read the same numbers), Inversion (what breaks money if we change the ladder).

## ROUND 2 - 2026-11-21 (his answer: fully customizable)
His words: *"well no as default but i want the users or company to have their own steps ... cereal might only have packaging box and put it on bigger dus ... paper company might also sell their product on 1 rim = 500 papers or maybe some of them sell at per pieces or per lusin ... i want this to be fully customizable"*.
Proposal (Claude): per product = BASE UNIT (stock stored as whole base units) + LADDER of any length (each step = name + how many of the step below) + SELLING UNITS (any step ticked 'can sell', own price per tier) + COMPANY TEMPLATES (Rokok / Kertas / Sereal; pick then edit).
Trap: cigarettes keep Bks as the base so every stored stock number stays the same (Batang sits BELOW the base, samples only). Choosing Batang as base would multiply every old stock number by 16 = a data rewrite.
Visual: two diagrams shown in chat (mind map + 4 example ladders: Cereal Box>Dus x12; Paper Lembar>Rim x500>Box x5; Pens Pcs>Lusin x12>Dus x10; Rokok Batang>Bks x16 (base)>Slop x10>Bal x20>Karton x4).
OPEN question to Aldi: is a bigger unit's price set by itself (1 Lusin can be cheaper than 12 Pcs) or always the small price times the count?

## ROUND 3 - 2026-11-21 (own price per packaging + company feature switches)
His words: *"i want they to have their own pricing for each of their packaging. we are here to make everything customizable for the company, and for sampling do all products have sampling? is the sampling inside this app really necessary tho? what if there is some company that want to use our app but doesnt want sampling ... what if they also dont want hutang or consignment within their company all want cash how do we deal with those demands tho"*.
DECIDED: every sellable packaging step has its OWN price per tier (Retail/Grosir/Ecer).
Proposal (Claude): COMPANY FEATURE SWITCHES in company settings - Sampling, Hutang (credit), Consignment (titip), on/off per company. Off = menu hidden + saves refused by the rules (not only hidden - UI-Says-Yes-Server-Says-No) + reports skip it. KPM keeps all ON (nothing changes for him). Reuse the permission-matrix settings pattern, no new system.
Sampling becomes optional and general: on a product, 'can be sampled' + which step is given (Batang for rokok, Pcs for others).
Trap: switching OFF while money is open (unpaid hutang, unsold titip) would hide money owed. Claude: refuse the switch until settled.
Order (Claude): feature switches BEFORE the packing ladder - a cash-only company with sampling off needs far less packing logic, so switches shrink the packing job.
OPEN question to Aldi: open hutang when switching off - block until settled, or allow and keep a collect-only list?
Models applied: Chesterton's Fence (sampling exists for the tobacco trade - keep it, make it optional), Second-Order Thinking (setoran/EOD read consignment), Opportunity Cost (order of the two jobs).
