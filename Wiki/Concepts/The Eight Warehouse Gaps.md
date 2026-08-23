---
title: The Eight Warehouse Gaps
description: What large warehouse operations do that KPM does not, ranked by money at risk over effort, with the dependency order and the one question that has to be answered before any of it is built.
type: concept
created: 2026-08-23
updated: 2026-08-23
confidence: high
checked: 2026-08-23
tags: [inventory, warehouse, logistics, roadmap, research]
---

# The Eight Warehouse Gaps

Researched 2026-08-23 on Aldi's instruction: *"deep research on how to have a good inventory and
shipping system and storage system ... implemented by biggest storage or logistic company all
around the world"*.

📄 **The readable version is the artifact "Eight Holes in the Warehouse"** —
`https://claude.ai/code/artifact/2a94825e-e349-42a7-bf52-9404d0c19c2c`. This note is the durable
copy of the conclusions; the artifact is the presentation.

## The five practices that matter at any size

1. **Verify before you sign.** OS&D — Over, Short & Damaged — filed *before* the receipt is
   signed, or the claim is dead. Blind receiving hides the expected number so it cannot anchor
   the count. **KPM has this now** — see [[Arrival Check]] work committed 2026-08-23.
2. **The record is the batch, not the product.** Batch identity travels supplier → shelf → store.
   Buys FEFO, expiry warnings, and one-query recall.
3. **The reorder point is arithmetic.** `avg daily sales × lead time + safety stock`. Every term
   already exists in the sales history.
4. **Location is data.** Only pays off when finding an item costs real time. **Rejected for KPM.**
5. **Anything unmeasured drifts.** Inventory accuracy 99%+, shrinkage under 1%, receiving accuracy
   99%+, dock-to-stock under 24h, perfect order rate 95%+.

## The gaps, worst first

| # | Gap | Severity | Blocked by |
|---|---|---|---|
| G1 | batch identity dies at the HQ door — `batchNo` is on the PO only, never on branch/van stock | high | — |
| G2 | nothing knows what expires first — one `expiryDate` per whole PO, no FEFO, no alert | high | G1 |
| G3 | reordering is a guess — `minStock` is a flat number (default 50), no velocity, no lead time | high | G7 |
| G4 | records joined by name, not id — a spelling fix silently splits one thing into two | high | — |
| G5 | accuracy and shrinkage are never calculated, though the raw numbers now exist | medium | G7, G4 |
| G6 | damaged stock has no route home — `damagedStock` only ever goes up | medium | — |
| G7 | the clock is wrong twice — day rolls at 7am, `getCurrentDate()` is UTC in 26 places | medium | — |
| G8 | excise bands tracked per agent, not per stock | **unknown** | the question below |

## Build order — dependencies decide it, not appetite

**G7 → G6 → G3 → G5 → G1 → G2 → G4**

G7 is first because everything measured per day is wrong until it lands, and it is the smallest
job on the list. G4 is last not because it is unimportant but because it is large and invisible
from outside.

## 🔴 The one question that must be answered before G8 exists

**Do old-year excise bands (pita cukai) have a legal cut-off after which the stock cannot be
sold?** Nothing was assumed. Aldi must confirm with his supplier or Bea Cukai. If yes, that
deadline behaves exactly like an expiry date and folds into G1 and G2. If no, G8 is not a gap at
all.

## Rejected on purpose — do not re-propose

Bin/rack locations (no payoff at one warehouse per branch) · barcode scanning (no barcodes on the
products, settled) · cycle counting (a full count takes under 30 minutes, settled) · demand
forecasting (G3's arithmetic captures most of it, and forecasting on name-joined records would be
confident nonsense) · **automatic** reordering — suggest the quantity, let a person send it.

See also: [[Where KPM Is Going]] · [[Silent Failure Disease]] · [[Anti-Recurrence Check]]
