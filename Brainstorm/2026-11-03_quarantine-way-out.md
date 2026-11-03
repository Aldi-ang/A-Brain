---
type: brainstorm
status: OPEN — waiting on Aldi (full price or cheaper?)
date: 2026-11-03
---

# Every quarantine pack needs a way out

## The problem, his words

*"regarding quarantine item in the fleet and roster but we cant move it, i dont even know why i put that quarantine item when i cant move it there tbh i forgot my own reasons but, since we can convert damaged goods into sampling i can see 2 ways here how to deal with the quarantine items, either convert into sample and give them away for free and another option is to sell it again but still having the damaged goods icon on the goods and still put it on the quarantine and we can move these selleable quarantine goods from regional warehouse to the agent inventory how does it sound?, this way everything will have a wayout isnt,"*

Why the bay shows quarantine but refuses a move (his forgotten reason, from the code): the loading bay SHOWS a warehouse's damaged stock so whoever loads a van sees it; fixing it is Stock Opname's job (LoadingBay.jsx:493 "THE WAREHOUSE'S QUARANTINE ONLY TELLS"), and the van's own damaged crate means "came back damaged today, hand in at EOD" (:952).

## What already exists

| Way out | Where | Status |
|---|---|---|
| Convert to Sample -> "CELLO GREEN 16 · RUSAK" promo goods in that warehouse | Stock Opname, regional + Master Vault | built `6db6916` |
| Those promo goods load into a van (bay PROMO hatch, `displayPromo` reads the branch's promo stock) and leave free with GIVE PROMO | Fleet & Roster -> Sales Terminal | built - his way out #1 is already end to end |
| Repair (damaged Bks back to good stock, sold at full price) | Master Vault crates ONLY | built `6db6916` |
| RTV (back to the factory), Penalty | Stock Opname | built |

## Options for way out #2 ("sell it again")

| Option | What it is | Cost |
|---|---|---|
| A (recommended if full price) | Repair on REGIONAL crates too - a checked pack goes back to normal stock, loads and sells like any pack | small: one existing button on one more crate; no new price, no new stock state; the damaged mark does not follow the pack |
| B (his idea, needed if cheaper) | a third stock state "damaged, sellable": keeps the hazard mark, loads into the van as its own lot, sells at a damaged price, EOD counts it apart | big: a new stock field in warehouse + van + terminal + EOD + Stock Opname, a damaged price per product, ~6 screens on money paths; and the van's damaged crate would hold two kinds (sell these / hand those in) - EOD cannot tell them apart unless they are separate lots |

Cost not yet priced by him: a pack whose pita cukai (excise stamp) is torn may not be sellable at all [likely] - "Torn/Crushed" and "Water Damage" are exactly the reasons that tear it. Repair (A) lets a person look first; B sells whatever is in the crate.

## Decision

OPEN — asked: *"When a damaged pack is sold again, does the shop pay the full price or a cheaper price?"* Full -> A. Cheaper -> B.

## Rejected on purpose

- Moving raw quarantine packs into the van's damaged crate as they are: that crate means "hand in at EOD", so sellable and returned packs would mix.

Models applied: Opportunity Cost (way out #1 already built - nothing to pay for), Second-Order Thinking (the van crate's meaning collides with EOD), Chesterton's Fence (why the bay only shows quarantine).
