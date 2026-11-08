---
title: Approving a stock count erases everything that happened since the count
description: HQ approval writes the counted number straight over current stock. Every sale, restock and EOD return between the count and the approval is silently undone.
status: Done
done: "5c4d3c7 (2026-08-18"
area: Stock Opname
priority: HIGH
created: 2026-08-17
updated: 2026-08-17
---

# Approving a stock count erases everything that happened since the count

Found in the 2026-08-17 logic review.

## What happens, in simple English

The branch counts its stock in the morning and sends the count to HQ. HQ looks at it and approves
it later — maybe that evening, maybe the next day.

When HQ approves, the app writes the **morning's number** straight over the stock as it is **now**.

Everything that happened in between disappears: sales made during the day, goods returned at EOD,
a delivery from the warehouse. None of it survives.

## A real example

- 08:00 — the branch counts **100** packs and submits.
- During the day — **30** are sold.
- 18:00 — an agent returns **20** at EOD.
- Real stock is now **90**.
- 20:00 — HQ approves the morning count. Stock is set to **100**.

Ten packs appear out of nowhere, and the whole day's movement is undone. Nobody is told.

## Why this is easy to miss

The confirmation message says *"This will permanently overwrite the inventory"*, so it looks
deliberate. Overwriting is correct at the moment of counting — a physical count should beat the
system's belief. It is only wrong **later**, because by then the count is out of date.

## Where it is

- Approval writes the counted number: `src/StockOpnameView.jsx:281` and `:283`
- The count is snapshotted at submit: `src/StockOpnameView.jsx:220-236`

## Suggested fix, smallest version

The audit already stores `expectedStock` — what the system believed at the moment of counting. So
the app already knows the difference the counter actually found.

Apply the **difference**, not the number:

```
new stock = stock right now + (what was counted - what the system expected at count time)
```

Then a day's sales still count, and the counter's correction still lands.

If you would rather be strict: when approving, compare the current stock to `expectedStock`, and if
they no longer match, refuse and ask for a fresh count. Either is fine — silently overwriting is
not.
