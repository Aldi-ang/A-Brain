---
title: Confirming a shipment twice credits the branch twice
description: The receipt step never checks whether the shipment was already confirmed, so a double press or a retry adds the same stock again while HQ is only debited once.
status: Done
area: Branch warehouse
priority: HIGH
created: 2026-08-18
updated: 2026-09-22
---

# Confirming a shipment twice credits the branch twice

Found by the review workflow, 2026-08-17. **Verified** — survived an agent whose job was to kill it,
which also downgraded it from HIGHEST to HIGH.

## What happens, in simple English

When a branch receives a shipment, someone presses **KONFIRMASI TERIMA BARANG**. The app then adds
that quantity to the branch's stock and marks the order delivered.

It never checks whether the order was **already** delivered.

So if the same shipment is confirmed twice, the stock is added twice. HQ is only ever debited once.

## ✏️ SECOND CORRECTION — 2026-08-18, third check. **Priority drops to LOW.**

A third check found **another** guard the first two both missed:

> The KONFIRMASI button is only **rendered** when `order.status === 'IN_TRANSIT'`
> (`BranchWarehouseManager.jsx:414` and `:452`), and the order comes from a live listener. The moment
> the first confirmation sets status DELIVERED at `:189`, the button vanishes from every screen and is
> replaced by an inert "Barang Sudah Diterima Branch" block at `:458-462`.

**So a status check does exist — it is just in the screen, not in the transaction.** The two-user race
needs both people to press inside the split second before the update reaches the second screen.

**Real, still worth fixing, but LOW.** The one-line guard below costs nothing and closes it properly.
Nothing can re-arm a delivered order from the UI either — there is no path that sets DELIVERED back to
IN_TRANSIT.

## ✏️ FIRST CORRECTION — added 2026-08-18, second sweep

**The single-person double-press path was REFUTED.** The confirmation dialog renders as a
full-screen overlay covering the whole window, so the button underneath **cannot** be pressed while
the dialog is open. The "busy flag is set too late" reasoning below is wrong and should not be used
to justify the fix.

**The two-person path survives and is the real one:** the request list is filtered only by branch,
so every Tier-3 user at that branch sees the same live button on their own screen. Two humans within
the same second is what it takes.

The one-line fix below is unchanged and still correct.

## How it happens in practice

Two people at the same branch both press the button at nearly the same moment — each on their own
device, each seeing the same order in their own list.

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

## ✅ DONE 2026-09-22

Found already fixed on 2026-09-22's check: `src/components/BranchWarehouseManager.jsx:782-797` confirms inside `runTransaction`, reads the order's status there and throws "Kiriman ini sudah diterima. Stok tidak ditambah dua kali." on DELIVERED / DISPUTED — the one-line guard this note asked for, in the transaction.
