---
title: Two different debt numbers for the same store
description: MerchantSalesView calculates a store's unpaid balance twice, in two different ways, and shows both on the same screen. Returned goods reduce one number and not the other.
status: Done
done: "2dbfc66 (2026-08-18"
area: Sales / Debt
priority: HIGH
created: 2026-08-17
updated: 2026-08-17
---

# Two different debt numbers for the same store

Found in the 2026-08-17 logic review.

## What happens, in simple English

The sales screen works out how much a store owes **twice**, using two separate pieces of code, and
then shows both on screen at the same time. They do not agree.

- The red "OWES" warning uses the first calculation.
- The orange "Unpaid titip" panel uses the second one.

If a store gave goods back, the first number goes down and **the second one does not**. So the same
store can be shown owing two different amounts, on one screen, at the same moment.

## The three ways they disagree

1. **Returns.** The first calculation subtracts returned goods. The second one ignores returns
   completely, so returned goods never reduce what the store appears to owe.
2. **What counts as debt.** The first only counts a proper consignment sale. The second counts
   *any* record marked "Titip", including record types that are not sales.
3. **The name match.** The first trims spaces off the store name before comparing. The second does
   not. A store name saved with a space on the end is treated as a different store by one and the
   same store by the other.

## Why it matters more now

The new transfer-shortfall rule says a missing transfer becomes the **customer's unpaid bill**. That
bill is read from this calculation. If the app cannot state one number for what a store owes, it
cannot fairly decide what the store still has to pay — and the agent's bounty is decided by the same
comparison.

## Where it is

- First calculation (FIFO, handles returns): `src/MerchantSalesView.jsx:102-143`
- Second calculation (ignores returns): `src/MerchantSalesView.jsx:145-164`
- Both shown on screen: `src/MerchantSalesView.jsx:1622` and `src/MerchantSalesView.jsx:1765`

## Suggested fix, smallest version

Keep the first calculation, delete the second, and point both panels at the one that is left. Two
answers to one question is not a display problem — it means the app does not know the answer.

Whichever survives should live in one small file of its own with a self-check, the same way the
other money maths in this project already does, so a third copy cannot appear later.
