---
title: A Rollup Is a Cache, Not a Ledger
description: The sales rollup answers "what sold" for one document read instead of thousands, and the property that makes it safe is that it can always be rebuilt from the transactions.
type: concept
created: 2026-08-30
updated: 2026-09-05
confidence: high
checked: 2026-09-05
tags: [kpm, sales, firestore, cost, reporting, data-integrity]
---

# A Rollup Is a Cache, Not a Ledger

Aldi, 2026-08-30: *"the total performance per day per week/ month or year for products right, like
how many product is actually sold per timeframe specific for each of the product? well basically
the performance for each product in overall through all region"*.

Answering that from `transactions` reads every receipt in the range. For a year that is thousands
of documents, on his Firestore bill, every time the screen opens. He worked out the alternative
before the explanation finished:

> *"we should use older data to avoid high cost right, we just need to see the data thats auto
> update for every sales so we can see the latest sales and have all the number isnt? btw right
> just do whatever to save cost, u know the method better"*

That is a running total, and it is the right answer.

## What shipped

One document per month, `sales_stats/{YYYY-MM}`, holding `byProduct` for the whole month and
`byDay` inside it.

| Range | Documents read |
|---|---|
| a day | 1 |
| a week | 1 or 2 |
| a month | 1 |
| a year | 12 |

## The property that makes it safe

**`transactions` is the truth. The rollup is a copy that can always be thrown away.** Settings ›
Company · 07 recomputes every month from the receipts themselves. So a bug in the counter costs a
rebuild, never data — and nothing in the app may read a number out of `sales_stats` and write it
back into stock, money or a nota.

That single property is what turns "a denormalised counter" from a liability into an obvious call.
Without a rebuild it would be a second ledger that can silently disagree with the first.

## The counter was the easy half

The hard half is every path that changes a sale **after** it was counted. There were three, and one
of them does not look destructive at all:

| Path | What it must apply |
|---|---|
| online sale | +1, inside the batch that writes the receipt |
| offline drain | +1, in the same commit as the queued receipt |
| delete, delete-folder, consignment delete | −1, through **one** shared helper |
| history **edit** | −1 of what stood before, **and** +1 of what was saved |

**An edit is not "a sale that changed."** To a running total it is one sale removed and a different
one added. Applying only the +1 double-counts; applying neither leaves the totals describing a
receipt that no longer exists. And a delete at least looks destructive — changing a quantity looks
like tidying.

Three hand-written negatives would be three chances to get a sign backwards, so all of them route
through one function that takes a sign. `salesDelta(tx, products, -1)` is exactly the negative of
`salesDelta(tx, products, 1)`, and a check holds it to that.

## Four details that would each have been a silent wrong number

1. **A queued sale is filed on the day it was MADE.** The offline drain overwrites `timestamp` with
   `serverTimestamp()` so receipts sort correctly, but `date` still carries the original day and the
   tally reads `date` first. A week of offline sales landing at once must not pile onto the Monday
   somebody finally got signal.
2. **Revenue is quantity × price, never multiplied by the pack size.** The quantity converts to Bks;
   the money does not. Getting that backwards inflates revenue by exactly the conversion factor —
   the same shape as the 17× error in [[A Ratio of Sums Is Not a Rate]].
3. **Nested object literals under `merge`, never dotted field paths.** `'byProduct.abc.qty'` reads
   `abc` as a path segment, so a product id containing a dot writes to the wrong place and never
   errors.
4. **A missing month is not a zero month.** The reader counts how many months in the range have no
   document and the panel says so, rather than printing a total that is quietly short.
5. **The edit snapshots the record when the editor OPENS.** `transactions` only holds seven days, so
   a historical record pulled through the Time Machine would not be found at save time.

## What made this checkable

The arithmetic lives in `src/utils/salesRollup.js` and **imports nothing from Firebase**, so the
self-checks run it in plain node against real numbers — 27 of them, including the invariant that a
month total always equals the sum of its own days. Four were mutation-tested.

Ten more checks scan the wiring, because nothing except a scan can prove all four call sites still
exist. Lose one and the totals drift with every check still green — which is
[[Silent Failure Disease]] exactly.

## 2026-09-05: the dimension that was never recorded

The rebuild property makes a *wrong* rollup cheap to fix. It does nothing about a rollup that
is right and **too narrow** — and that is the harder failure, because it surfaces as a bug in a
screen that is innocent.

Product Performance was showing unpaid `Titip` consignment as revenue. That is a real money
mis-statement, and no amount of work in `ProductPerformancePanel.jsx` can fix it: the panel
reads `sales_stats`, and `salesDelta` accumulates `{ qty, revenue }` with **no `paymentType`
dimension at all**. Receivable and finished sales were merged before the writer ever saw them.
**A panel cannot render a distinction its source never recorded.**

Two consequences worth carrying:

1. **Adding a dimension is a write-path change, not a read-path change** — the delta, the
   writer, `sumRange`, and every renderer. Five files, which is exactly why it was scoped and
   named rather than started.
2. **Historical documents will answer the new question anyway, and answer it wrong.** Every
   month already in `sales_stats` holds only `{ qty, revenue }`. Ship the split without a
   decision and past months report *zero receivable, 100% finished sales* — confidently, with
   no error. That is [[Silent Failure Disease]] living in the data instead of the code. Either
   backfill from `transactions` or label pre-change months as "not separated"; do not let old
   documents answer a question they were never asked.

Unverified as of 2026-09-05: whether a later `CONSIGNMENT_PAYMENT` also enters the rollup
(`SALE_TYPES`, `salesRollup.js:42-46`). If a Titip sale books revenue at placement *and* its
payment books it again, the totals double-count today — a bigger bug than the split, and it
must be settled first. See [[../Summaries/The Panel That Never Reads a Transaction]].

See also: [[../Summaries/The Panel That Never Reads a Transaction]] ·
[[A Ratio of Sums Is Not a Rate]] · [[Silent Failure Disease]] ·
[[A Check Points at a File, Not at a Behaviour]] · [[The Eight Warehouse Gaps]]
