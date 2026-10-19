---
title: Excise and shipping costs are printed but never counted as cost
description: Every production batch records a true landed cost including cukai, shipping and labour. Three screens display it. No profit calculation in the app reads it, so every margin is overstated.
status: Done — by design (his call 2026-10-19)
area: Procurement / Reporting
priority: Medium
created: 2026-08-18
updated: 2026-10-19
---

# Excise and shipping costs are printed but never counted as cost

**CLOSED 2026-10-19 — by design, not a bug.** His words: *"we have nothing to do with the product cost it is outside of this app, we just have their prices, for distributor, ecer, grosir retail, for the shipping cost and pita cukai is outside this app"*. Profit stays on `priceDistributor`. The intake desk keeps Shipping, Excise and Labour and the receipt keeps "Total Landed Value" AS NOTES ONLY - his ~14:35 *"just keep those total landed value as notes only"*; the code already only displays them.

Found by the review workflow, 2026-08-17. **Verified** — survived a skeptic, which downgraded it
from HIGH to MEDIUM because it distorts reporting rather than moving stock.

## 🔄 THE CORRECTION BELOW WAS ITSELF OVERTURNED — read this first (2026-08-18, third check)

**A third check reversed the reversal. This IS a real defect. Priority back to HIGH.**

Two runs of the same model on the same claim reached **opposite verdicts**, and the later one won
because it found one fact the earlier one missed:

> **`priceDistributor` is dual-purpose.** `src/App.jsx:2947` — `if (tier === 'Distributor') base =
> prod.priceDistributor || 0;` — uses that same field as the **selling price** to Distributor-tier
> customers. So the obvious workaround, hand-raising `priceDistributor` to the true landed
> Rp 14.400, **would simultaneously reprice every distributor sale.**

That is what makes it a defect rather than a preference. The "just type the right number into
DISTRIBUTOR (MODAL)" escape hatch — the entire basis of the refutation below — **does not exist.**
Also confirmed: `StockOpnameView.jsx:327` falls back to `hpp || costPrice`, but **neither field is
ever written anywhere in the app**, so those fallbacks are dead and `priceDistributor` is always the
value used.

**Two parts of your original write-up are wrong and should be edited out:**
- ❌ *"every EOD"* — **false.** `EODReconciliationView.jsx` computes no profit and no COGS at all.
  Landed cost cannot distort it.
- ❌ *"every damaged-stock write-off is overstated"* — **direction inverted.** `StockOpnameView.jsx:327`
  and `:770` value damaged stock at Rp 8.000 instead of Rp 14.400, so the **loss figure is
  UNDERSTATED**. Profit is overstated; the loss number is understated. Two different errors, opposite
  signs.

**So the real blast radius is: sale margin, and damaged-stock valuation.** Not EOD. The Rp 6.400/pack
arithmetic itself checks out exactly against `RestockVaultView.jsx:90`.

**Your question below still stands** — it decides whether the fix is "roll landed cost into a
weighted-average cost" or "stop calling it TOTAL LANDED VALUE" — but the item is no longer optional
polish.

<details>
<summary>The overturned correction, kept for the record</summary>

## ✏️ CORRECTION — added 2026-08-18, second sweep *(OVERTURNED, see above)*

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

</details>

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
