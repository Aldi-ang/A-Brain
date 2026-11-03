---
title: LOW badge on the Sales Terminal
created: 2026-11-03
status: OPEN — waiting on Aldi
tags: [kpm, sales-terminal, stock-threshold, brainstorm]
---

# LOW badge on the Sales Terminal

**Problem, his words (2026-11-03, with a terminal screenshot "LOW · 10 Slop" and "LOW · 1 Slop"):** *"i see bugs 10 slop
is not a low amount btw, i want to know what this low notification based on"*.

**What it is based on (code, checked):** `src/utils/stockThreshold.js:50` — LOW when the card's stock (Bks) is at or
under `minStockBks`: the product's own `minStock` (Bks) if set, else the company default (`defaultMinStockQty` +
`defaultMinStockUnit`), else **3 Bal** (`DEFAULT_MIN_QTY` / `DEFAULT_MIN_UNIT`, :33-34). 10 Slop is far under 3 Bal, so
the badge is the rule working, not a sum gone wrong. The threshold was made for the WAREHOUSE early warning ("Stok
Menipis" -> ask the Gudang Pusat for stock, presentation slide 20); the terminal (MerchantSalesView ~2791
`isLowStock(item, appSettings)`) reuses that same line on the card it shows.

| Option | What he sees | Cost |
|---|---|---|
| A. No LOW on the terminal | LOW only on the warehouse screens, where restocking happens | smallest; the salesman loses a "running out" hint |
| B. Own terminal line | LOW on the terminal only under a small van-sized amount (e.g. 2 Slop), one setting | a new setting + a check |
| C. Keep it | lower the product's Min stock / the company default | no code; the warehouse warning moves with it |

**Decision (2026-11-03, his words):** *"1 slop and below is considered as low"* = option B with the line fixed at 1 Slop
(no setting - he gave the number). Built kpm `43dfd19`: `isLowOnTerminal` in utils/stockThreshold.js; the warehouse
warning keeps `isLowStock` (3 Bal default).
**Rejected on purpose:** A (no LOW on the terminal) and C (lower Min stock - would have dragged the warehouse warning down).
