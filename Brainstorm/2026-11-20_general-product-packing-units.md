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
