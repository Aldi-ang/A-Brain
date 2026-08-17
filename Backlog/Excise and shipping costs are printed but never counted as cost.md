---
title: Excise and shipping costs are printed but never counted as cost
description: Every production batch records a true landed cost including cukai, shipping and labour. Three screens display it. No profit calculation in the app reads it, so every margin is overstated.
status: To Do
area: Procurement / Reporting
priority: Medium
created: 2026-08-18
updated: 2026-08-18
---

# Excise and shipping costs are printed but never counted as cost

Found by the review workflow, 2026-08-17. **Verified** — survived a skeptic, which downgraded it
from HIGH to MEDIUM because it distorts reporting rather than moving stock.

## ✏️ CORRECTION — added 2026-08-18, second sweep

**A second, independent checker killed this as a *defect*.** Its reasoning, and why it matters:

The "TOTAL LANDED VALUE" field is **doing its job** — it is a document total for the ledger card and
the printed GRN, and nothing in the code ever presents it as a per-unit cost. The app's cost basis is
a different field that **you type in by hand**, labelled "DISTRIBUTOR (MODAL)" on the product form
(*modal* = capital/cost). Every cost calculation in the app reads that one field, consistently.

So **no code path computes a wrong number.** The Rp 6.400/pack understatement below is real **only if
the number you typed into DISTRIBUTOR (MODAL) excludes the cukai** — which is an assumption about your
data, not a fact about the code.

**Reframed: this is a missing feature (rolling landed cost into a weighted-average cost price), not a
logic bug.** That does not make it unimportant — a missing feature that silently overstates every
margin is worth building. It changes *how* it gets fixed: this is a design decision for you, not a
one-line repair.

**The question below is now the whole item.** Answer it first; the fix depends entirely on the answer.

## What happens, in simple English

When you record a production batch, the app carefully adds up the **true landed cost**: the base
price, plus excise (pita cukai), plus shipping, plus labour. It stores that on the batch and prints
it on the goods-received note as **"TOTAL LANDED VALUE"**.

Then every profit figure in the app ignores it.

Margins are worked out from `priceDistributor` on the product — a separate, manually maintained
number. And the batch screen fills the base price **from** `priceDistributor` first, then adds the
excise on top. So by design, **excise is never part of the cost the profit maths uses.**

## What that costs you on one batch

- 1,000 packs, base Rp 8.000 each → Rp 8.000.000
- Excise Rp 6.000.000, shipping and labour Rp 400.000
- **Real cost per pack: Rp 14.400.** The product still says **Rp 8.000**.

Every profit number for those 1,000 packs — the sale margin, the EOD, the write-off value when
stock is damaged — understates cost by **Rp 6.400 per pack**. That is **Rp 6.400.000 of imaginary
profit on one batch.**

## Where it is

- Computed: `src/RestockVaultView.jsx:90` · stored `:118` · recomputed on edit `:289`
- Read **only** by three display calls: `:559`, `:594`, `:846`
- What the profit maths actually uses instead: `src/hooks/useTransactionEngine.js:62` and `:179`,
  `src/StockOpnameView.jsx:327`, `src/AgentInventoryView.jsx:124`, `src/App.jsx:2947`

## Suggested fix, smallest version

In the same save that already updates stock (`RestockVaultView.jsx:111-114`), also write the batch's
true unit cost onto the product:

```
batch.update(prodRef, { stock: increment(qtyToAdd), priceDistributor: trueLandedTotal / totalItemsReceived })
```

`StockOpnameView.jsx:327` already falls back to a field called `hpp`, so a dedicated `hpp` field
would work too and would leave `priceDistributor` meaning "what the supplier charged".

🔴 **One question only you can answer:** should excise count as part of your cost of goods, or do you
deliberately track it separately? If it is deliberate, nothing here is a bug — but the printed note
should stop calling that number "TOTAL LANDED VALUE" when the books do not use it.
