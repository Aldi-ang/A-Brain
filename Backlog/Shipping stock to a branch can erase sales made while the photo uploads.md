---
title: Shipping stock to a branch can erase sales made while the photo uploads
description: The HQ vault is written using a stock number the admin's screen cached before the package photo was compressed and uploaded. Any sale during that gap is silently undone.
status: To Do
area: Branch warehouse
priority: HIGHEST
created: 2026-08-18
updated: 2026-08-18
---

# Shipping stock to a branch can erase sales made while the photo uploads

Found by the review workflow, 2026-08-17. **Verified** — a second agent was told to try to kill this
finding and could not.

## What happens, in simple English

When HQ ships stock to a branch, the app works out the new HQ total like this:

```
new HQ stock = (the number my screen was showing) - (the quantity I am shipping)
```

The number the screen was showing is read **before** the package photo is compressed and uploaded.
On a phone that is seconds, sometimes minutes.

Anything that happens in that gap is wiped out.

## A real example

- HQ Vault holds **500** packs of Cello. The admin opens "Siapkan Pengiriman" — the screen caches 500.
- The admin picks a package photo. The app compresses it and uploads it. This takes a while.
- Meanwhile a salesman sells **120**. The real vault is now **380**.
- The shipment saves: `500 - 100 = 400`.

**The 120 sold packs come back from the dead, and the vault is overstated by 120 forever.** Nothing
downstream corrects it — the branch receipt step only touches branch stock, never the master product.

The safety check that is supposed to stop over-shipping reads the same stale number, so it cannot
catch this either.

## Where it is

`src/components/BranchWarehouseManager.jsx:294` — the write.
`:280` — the guard, reading the same stale array.
`:287` and `:289` — the two long waits that open the gap.

## ✅ The fix is one line, and the correct pattern is already in your app

`src/RestockVaultView.jsx:113` does it the safe way:

```
batch.update(prodRef, { stock: increment(qtyToAdd) })
```

`increment` tells the database *"subtract 100 from whatever the number is right now"*, so it cannot
be wrong no matter how long the upload took. Change line 294 to `increment(-Number(item.qty))`.

⚠️ **One correction the checker made, worth keeping:** other places in the app also work out stock by
hand rather than using `increment` — `App.jsx:3084`, `FleetCanvasManager.jsx:312`,
`MerchantSalesView.jsx:891`, `useTransactionEngine.js:209`. Those are **fine**, because every one of
them reads the real number from the database immediately before writing. Line 294 is the only one
whose starting number comes from the screen.

After the fix, the guard at `:280` is advisory only — it still cannot prevent stock going negative,
which would need a transaction. But the write itself stops inventing units, which is the bug.
