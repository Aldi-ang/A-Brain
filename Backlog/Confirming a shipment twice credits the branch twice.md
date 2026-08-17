---
title: Confirming a shipment twice credits the branch twice
description: The receipt step never checks whether the shipment was already confirmed, so a double press or a retry adds the same stock again while HQ is only debited once.
status: To Do
area: Branch warehouse
priority: HIGH
created: 2026-08-18
updated: 2026-08-18
---

# Confirming a shipment twice credits the branch twice

Found by the review workflow, 2026-08-17. **Verified** — survived an agent whose job was to kill it,
which also downgraded it from HIGHEST to HIGH.

## What happens, in simple English

When a branch receives a shipment, someone presses **KONFIRMASI TERIMA BARANG**. The app then adds
that quantity to the branch's stock and marks the order delivered.

It never checks whether the order was **already** delivered.

So if the same shipment is confirmed twice, the stock is added twice. HQ is only ever debited once.

## How it happens in practice

Two people at the same branch both press the button at nearly the same moment. The button is only
disabled by a local flag that is not set until **after** the confirmation dialog is answered, so a
second press while the dialog is open is live too.

- Shipment of **100** packs to SEMARANG.
- First confirmation: branch stock 0 → **100**, order marked delivered.
- Second confirmation retries, re-reads a branch that now says 100, sees no reason to stop, and
  writes **200**.

SEMARANG now claims 100 packs that were never shipped.

## ✅ Your app already does this correctly somewhere else

`src/App.jsx:1788-1791` performs the identical read on an EOD report and **does** guard it:

```
if (eodSnap.data().status === 'VERIFIED') throw ...
```

with a comment saying that without it, stock gets double-credited. **The same guard was never copied
to the branch receipt.** This is the pattern behind most of the flaws found in this review: the fix
exists, in this codebase, one file over.

## Where it is

`src/components/BranchWarehouseManager.jsx:152-154` — reads the order and never checks its status.
`:174` — adds the quantity. `:189` — marks it delivered.
`:141-142` — why a double press gets through: the busy flag is set after the dialog, not before.

## Suggested fix, smallest version

One line, straight after `:154`:

```
if (orderData.status !== 'IN_TRANSIT') throw new Error('Pesanan ini sudah dikonfirmasi.');
```

The order document is already being read inside the transaction, so this costs nothing extra.

## Why it was downgraded

It needs two people at one branch pressing at almost the same time, and the button disappears once
the screen sees the order as delivered — so the window is short. Short is not zero, and the cost is
phantom stock in a regional warehouse.
