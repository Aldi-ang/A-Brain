---
title: The Eight Warehouse Gaps
description: What large warehouse operations do that KPM does not, ranked by money at risk over effort, corrected on 2026-08-23 once Aldi explained there is no supplier and what the excise band actually signals.
type: concept
created: 2026-08-23
updated: 2026-08-23
confidence: high
checked: 2026-08-23
tags: [inventory, warehouse, logistics, roadmap, research, freshness]
---

# The Eight Warehouse Gaps

Researched 2026-08-23 on Aldi's instruction: *"deep research on how to have a good inventory and
shipping system and storage system ... implemented by biggest storage or logistic company all
around the world"*.

📄 Readable version: artifact **"Eight Holes in the Warehouse"** —
`https://claude.ai/code/artifact/2a94825e-e349-42a7-bf52-9404d0c19c2c`.

## ⚠️ TWO FACTS THAT CHANGE THE WHOLE PICTURE — his words, 2026-08-23

**1 · There is no supplier. KPM makes what it sells.**
*"there is no supplier between this restock, because goods is made by company own factory and we
sell our product ourself"*.

The chain is **factory → HQ vault → branch warehouse → van → store**, all internal, end to end.
Nothing here is bought in. So:

- Standard OS&D language about claiming against a supplier or a carrier **does not apply**. There
  is no third party to bill. A shortage is not a claim, it is an **internal leak**, and the only
  question is which of your own steps lost it.
- The [[Arrival Check]] built for HQ → branch is still exactly right — it is the internal version:
  the branch is credited what it counted, and the difference is HQ's to explain.
- `RestockVaultView` already knows this — it says *Internal Factory*, *FACTORY PRODUCTION*,
  *Source Factory*. The word "supplier" survives only as a field name.

**2 · The excise band is not a legal deadline. It is a freshness label the customer reads.**
*"pita cukai is bought by company and company are be able to sell the product with it, and if its
expired it is still cant be sell and there is no problem with our government ... the problem is
with our customer, when the customer see old pita cukai on the product means that the cigarette is
old and they assume this product is tidak laku or tidak enak ... on the cigarette it have some
sauce that put into the product and it causing the new fresh sauced cigarette to taste better than
the old one"*.

So **gap G8 does not exist** — there is no compliance problem, and no government angle at all.
But this makes the batch work MORE valuable, not less, and it changes what is tracked:

- The thing to track is **age**, not an expiry date. There is no expiry date to hold.
- Old stock has two costs, both real: **the sauce degrades so it genuinely tastes worse**, and
  **the band year is printed on the pack where the customer can see it** — an old year reads as
  *tidak laku*, which damages the brand at the point of sale.
- So "oldest leaves first" is not hygiene. It is **margin and reputation**, and it is the single
  most valuable thing on this whole list.

## The five practices that survive at this size

1. **Verify before you sign.** Count on arrival, file the difference before accepting. Blind
   receiving hides the expected number so it cannot anchor the count. **Built 2026-08-23** for
   HQ → branch.
2. **The record is the batch, not the product.** Batch identity travels factory → store. Here it
   buys oldest-out-first and an age warning — see the freshness note above.
3. **The reorder point is arithmetic.** `avg daily sales × lead time + safety stock`. Every term
   is already in the sales history.
4. **Location is data.** Only pays off when finding an item costs real time. **Rejected for KPM.**
5. **Anything unmeasured drifts.** Inventory accuracy 99%+, shrinkage under 1%, receiving accuracy
   99%+, dock-to-stock under 24h, perfect order rate 95%+.

## The gaps, worst first — corrected

| # | Gap | Severity | Blocked by |
|---|---|---|---|
| G1 | batch identity dies at the HQ door — `batchNo` is captured at factory intake and never travels onto branch or van stock | high | — |
| G2 | **nothing knows which stock is OLD** — no production date, no band year on stock, no oldest-out-first rule, no ageing warning | **highest value** | G1 |
| G3 | reordering is a guess — `minStock` is a flat number (default 50), no velocity, no lead time | high | G7 |
| G4 | records joined by name, not id — a spelling fix silently splits one thing into two | high | — |
| G5 | accuracy and shrinkage are never calculated, though the raw numbers now exist | medium | G7, G4 |
| G6 | damaged stock has no route home — `damagedStock` only ever goes up | medium | — |
| G7 | the clock is wrong twice — day rolls at 7am, `getCurrentDate()` is UTC in 26 places | medium | — |
| ~~G8~~ | ~~excise bands~~ | **DELETED** | answered — no government angle |

### G1 is cheaper than it looked

Half of it already exists. `RestockVaultView` has a **Batch / Serial No.** input on every intake
line, and the batch is shown on the acceptance record. What is missing is only that the batch never
gets copied onto `branches/{location}/inventory/{productId}`, which holds a single `stock` number.
The work is **carrying** the batch, not inventing it.

### G2, restated in his terms

Not "expiry". **Age.** A batch needs a production date (or its band year) at intake, stock needs to
be held per batch rather than as one pile, and the rules that follow are: **oldest ships first**,
and **warn when a batch has been sitting too long** — the threshold being a number Aldi sets,
because only he knows when a kretek starts tasting old.

## Build order

**G7 clock → G6 damaged route home → G3 suggested order qty → G5 accuracy panel → G1 batch
identity → G2 age & oldest-first → G4 ids instead of names**

G7 is first because everything measured per day is wrong until it lands, and it is the smallest job
on the list. **If Aldi wants the money item first, G1 + G2 are one job and can jump the queue** —
they do not depend on the clock.

## Rejected on purpose — do not re-propose

Bin/rack locations (no payoff at one warehouse per branch) · barcode scanning (no barcodes on the
products, settled) · cycle counting (a full count takes under 30 minutes, settled) · demand
forecasting (G3's arithmetic captures most of it) · **automatic** reordering — suggest the
quantity, let a person send it · anything framed around a supplier or a carrier claim: **there is
no third party in this chain**.

See also: [[Where KPM Is Going]] · [[Silent Failure Disease]] · [[Anti-Recurrence Check]]
