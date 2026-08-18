---
title: Sale Is Final — no refund, no credit
description: Aldi's locked business rule. Once goods are sold the contract is done; the company carries no responsibility, gives no cash back and issues no credit. Goods-for-goods exchange is the only thing that survives.
type: concept
created: 2026-08-18
tags: [decision, locked, money, retur]
---

# Sale Is Final — no refund, no credit

**Locked 2026-08-18. Do not re-litigate.** Aldi, verbatim, when offered a store-credit design:

> *"no there is no credit, contract is done its nothing, no responsibility, no credit"*

And earlier, giving the reason:

> *"the factory usualy didnt affect refund by cash, because when selling happen, it is contract
> done and factory have no responsibility of that items anymore"*

## What the rule is

Once goods leave and are paid for, **the company owes the store nothing**. Not cash, not credit,
not a voucher, not a balance. There is no instrument that carries value backwards from the
company to a store.

## What this kills

- ❌ **Store credit / credit note / voucher.** Proposed and **rejected**. It was the standard
  distribution answer to "refund without moving cash", and it is the wrong answer *here* —
  it is still a liability the company carries, which is the exact thing that does not exist.
- ❌ **Cash refunds as a company act.** The company does not fund them.
- ❌ Any "balance owed to customer" field. There is no such state.

## What survives, and why

**Goods-for-goods exchange.** The store already paid; we take their item and hand over another.
Nothing is owed in either direction — Aldi's words: *"it is considered as paid item"*.

- **Damaged → same product.** Quality replacement, no money.
- **Healthy → different product** (*tukar barang*, his point 4). Money only ever flows **towards
  the company**: if the new goods cost more, the customer pays the difference.
  **If the new goods cost less, nothing comes back.** That falls straight out of this rule, and it
  makes the feature far simpler than the version that needed a refund path.

## The consequence nobody should forget

This makes **Retur → Buyback (Refund by cash)** an odd feature to have in the app at all. It is
not a company obligation, so if an agent uses it he is spending his own money on something the
company never promised. Open question with Aldi: remove it, or gate it behind a permission that
is off by default.

## Why this is recorded

A store-credit or refund mechanism will look like the "obvious" fix again the next time someone
reads the returns code — it is what most distribution software does. It is wrong for KPM.
The reason is contractual, not technical, so it cannot be inferred from the codebase.

Related: [[Aldi's Design Taste]] · Backlog `SWEEP - the sales terminal.md` (items 3, 4, 5)
