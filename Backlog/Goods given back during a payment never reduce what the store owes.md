---
title: Goods given back during a payment never reduce what the store owes
description: A consignment payment records returnTotal, the value of goods handed back. No debt calculation in the app ever reads it, so the store is still billed for goods it returned.
status: To Do
area: Consignment / Debt
priority: HIGH
created: 2026-08-17
updated: 2026-08-17
---

# Goods given back during a payment never reduce what the store owes

Found in the 2026-08-17 logic review. **This one overcharges your customers.**

## What happens, in simple English

When an agent audits a consignment store, the stock is split three ways
(`ConsignmentFinanceView.jsx:283-297`):

- **sold** — the store pays for these (`amountPaid`)
- **damaged** — handed back to the agent, and their value is saved as `returnTotal`
- **still on the shelf** — the store keeps them and still owes for them

The store's balance goes down by `amountPaid` only. **`returnTotal` is never subtracted anywhere.**

So a store that hands back Rp 500.000 of damaged stock still owes that Rp 500.000. The packs
themselves are removed from its shelf list — the app does subtract those — and they go back onto the
agent's van and into quarantine. The company takes the goods back **and** keeps billing for them.

The shelf goods keeping the balance up is correct: the store still holds that stock. The damaged
ones are the bug.

## Where it is

- The value is written here: `src/hooks/useTransactionEngine.js:448` (`returnTotal`)
- The physical items ARE subtracted: `src/ConsignmentFinanceView.jsx:206-211`
- But the money is not: `src/ConsignmentFinanceView.jsx:199` subtracts only `amountPaid`
- Same omission in the aging engine: `src/ConsignmentFinanceView.jsx:105`
- Same omission on the sales screen: `src/MerchantSalesView.jsx:114` and `:159`

`returnTotal` is written in one place and read by nothing that calculates money.

## Why it is easy to miss

A separate transaction type called `RETURN` **is** handled correctly everywhere — it is saved with a
negative total, so it subtracts itself. The broken case is only the return that happens *inside* a
payment visit, which is the common one.

## Suggested fix, smallest version

Wherever a consignment payment is subtracted from the debt, subtract
`amountPaid + returnTotal` instead of `amountPaid` alone.

Do this **after** the two duplicate debt calculators are merged into one — see
[[Two different debt numbers for the same store]] — otherwise this same fix has to be made in
three separate places and one of them will be missed.
