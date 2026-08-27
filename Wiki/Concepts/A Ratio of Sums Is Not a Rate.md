---
title: A Ratio of Sums Is Not a Rate
description: A total divided by a total is only a rate if the things are interchangeable. Sebaran Stok shipped "348 days left" for a warehouse whose real cover was 20 days — 17x too comfortable, past 632 green checks, caught by Aldi on screen.
type: concept
created: 2026-08-27
updated: 2026-08-27
confidence: high
checked: 2026-08-27
tags: [correctness, statistics, inventory, checks, testing, kpm, lesson]
aliases: [Ratio of Sums, Simpson's Trap, Days Left, Sisa Hari, Aggregate Rate]
---

# A Ratio of Sums Is Not a Rate

**The rule.** A total divided by a total is a rate **only if the numerator and the denominator
describe the same fungible good**. Add across products and you get a real quantity; divide across
products and you get a number with no question behind it.

## What happened (2026-08-27)

Sebaran Stok printed an **Est. days left** per warehouse: total shelf divided by total sales rate.
Master Vault read **348 days**.

That entire rate — 500 packs a week — was **one** product, Cello Chocolate. The other four sold
nothing at all. Chocolate's own cover, sitting one row down inside the drawer, was **20 days**.

So 348 silently answered *"how long until everything is gone, if any product could satisfy demand
for any other"* — which is not a question anybody has. **Nobody sells Cello Mmrapi to a customer
who came in for Chocolate.**

The direction of the error is the worst part: **17x too comfortable**, on the one panel whose
entire job is *"which warehouse do I restock first"*.

Aldi caught it by looking at the screen: *"u cant just divide total with the average goods like
that, these are different goods should have their own depleted number."*

## Why no check caught it

- Build green. **632/632 checks passing.**
- The arithmetic was verified on screen **twice** and was correct every time: 24.921 divided by
  (500 / 7) really is 348.

**A check tests whether a number computes, not whether it means anything.** No check that could
have been written would have caught this, because nothing about the computation was broken. This
is the sharpest counter-example the project has to a green suite meaning a working screen — the
sibling of [[Looking at the App]] and of the 2026-08-21 lesson that *a green suite is not a working
screen*.

## The fix, and the part of it worth copying

- The **totals stayed**: shelf, sold and per-month all add across products, so a total pack count
  is a real quantity. Only the **division** was invalid.
- The cell now says **"per item"**, or **"below"** once the warehouse is open.
- It deliberately does **not** say an em-dash — that already means *"no sales, so no rate"* on the
  item rows. Reusing it would claim the warehouse has no rate, when the truth is that **the
  question has no warehouse-level answer at all**. Saying *"I cannot answer this here"* and saying
  *"the answer is zero"* are different statements and must not share a glyph.
- Check 632 pins it shut: no computed `daysLeft` on the warehouse row, and the footnote must keep
  explaining why there isn't one.

## Where else to look for this shape in KPM

Anywhere an aggregate is divided by an aggregate across non-interchangeable things:

- days-of-cover, burn rate or reorder point computed per **warehouse**, per **region** or
  company-wide rather than per product
- an average margin over a mixed basket
- "average price per pack" across products with different `sticksPerPack`
- any weekly figure divided by a rate derived from a **different** window (see the seven-day
  transactions cap in [[../Summaries/Surat Jalan Desk and Sebaran Stok]])

## The generalised lesson

> **Before dividing, ask what one unit of the numerator and one unit of the denominator have to
> have in common for the quotient to name anything.** If the answer is "they'd have to be
> substitutable", and they are not, there is no aggregate-level number to print — the honest
> output is a pointer to the level where the question does have an answer.

Source: [[../Summaries/Surat Jalan Desk and Sebaran Stok]] (commit `f7800f5`).

See also: [[Anti-Recurrence Check]] · [[Silent Failure Disease]] · [[Looking at the App]] ·
[[Logistics and Stock Movement]]
