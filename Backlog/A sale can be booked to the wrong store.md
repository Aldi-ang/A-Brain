---
title: A sale can be booked to the wrong store
description: The customer lookup accepts a partial name match and takes the first one it finds, so an exact match can lose to a different store whose name merely contains what was typed.
status: To Do
area: Sales
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# A sale can be booked to the wrong store

Found in the 2026-08-17 logic review.

## What happens, in simple English

When a sale is saved, the app looks up the store by name. It accepts any store whose name
**contains** what was typed, and it takes the **first one it finds** in the list.

So if you have a store called "Kios Melati" and another called just "Melati", and someone types
**Melati**, the app can pick "Kios Melati" — because that one sits earlier in the list and contains
the word. The store with the exact name never gets a chance.

The sale, the money and the unpaid balance all land on the wrong store's record.

## Why it matters more now

Each store's debt is calculated from its own transactions. A sale filed under the wrong name means
one store owes money it does not owe, and the other looks like it already paid. That is the same
ledger the new transfer-shortfall rule depends on, so a wrong match now feeds a wrong bounty.

## Where it is

`src/hooks/useTransactionEngine.js:329`

## Suggested fix, smallest version

Look for an exact name match first. Only fall back to a partial match when there is exactly **one**
partial match. If two or more stores match, ask instead of guessing.
