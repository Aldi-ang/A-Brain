---
title: Gudang Pusat (Master Vault)
description: The one name for the main warehouse, decided 2026-08-31. It had four spellings at once, and the string 'MASTER' beside it is a routing value that must never follow the rename.
type: entity
created: 2026-08-31
updated: 2026-08-31
confidence: high
checked: 2026-08-31
tags: [logistics, naming, warehouse, restock]
---

# Gudang Pusat (Master Vault)

The main warehouse. Everything ships **from** here to the regional branches, so it is the origin of
the chain described in [[Logistics and Stock Movement]] and it never shows a "days of cover" figure
of its own.

## The name, and who decided it

Aldi, 2026-08-31, reading his own surat jalan screenshot:

> *"our name for the main warehouse is master vault isnt?"*

and then, given the three spellings the code held:

> *"gudang pusat is okay but add "(master vault)" because the components name is master vault right
> for the gudang pusat HQ."*

So the displayed name is **`Gudang Pusat (Master Vault)`** — the Indonesian name he uses on paper,
carrying the name the app's own screen has always used, so the surat jalan and the Master Vault
screen stop looking like two different places.

## It was spelled FOUR ways, not three

The brief listed three. The fourth was found by the guard written to enforce the decision, not by
reading — which is the argument for writing the check before believing the inventory.

| Where | Was | Now |
|---|---|---|
| `src/utils/supply.js` | `MASTER = 'MASTER'` | the one declaration |
| `src/RestockVaultView.jsx` | `HQ_NAME = 'Gudang Pusat (HQ)'` | `HQ_NAME = MASTER` |
| `src/ponder/stages/GoodsReceivedStage.jsx` | hardcoded `"Gudang Pusat (HQ)"` | `value={MASTER}` |
| `src/StockOpnameView.jsx` ×4 options + the audit banner | `Master Vault (HQ)` | `{HQ_LABEL}` |

## ⚠️ The trap — `'MASTER'` is also a routing value

In `StockOpnameView.jsx` the bare string `'MASTER'` is a `<select>` **value**, and the code branches
on it to choose a Firestore path:

```js
targetFacility === 'MASTER'
  ? doc(db, `artifacts/${appId}/users/${masterId}/products`, id)
  : doc(db, `artifacts/${appId}/users/${masterId}/branches/${targetFacility}/inventory`, id)
```

Renaming that would not relabel a screen, it would move documents. So the file imports the name as
`HQ_LABEL` — same constant, deliberately different local name, so the two jobs cannot be confused
by the next person to read it.

The rename was safe in `supply.js` for the mirror-image reason: `MASTER` there is a **computed
bucket label**, rebuilt by `warehouseList()` on every render, and `HQ_LOCATIONS` maps whatever
Firestore actually stores (`'Headquarters'`, or empty) onto it. **No saved document contains it, so
no saved document moved.**

## What this does NOT settle

Records written before today keep whatever was typed into them. Aldi closed that question himself
on 2026-08-31: *"we can leave the old record thats okay all the record is still on trials and error
anyway."* No migration, no reconciliation prompt — which is what makes the registered-places job
([[The Eight Warehouse Gaps]]) a one-day change rather than two.

The name is also **longer** than what it replaced, and
[[Concepts/A Smooth Scroll That Never Runs|the phone-width work]] already found the warehouse table
truncating names at 375px. Re-measure that table before assuming it still fits.

Shipped in `7ca7b03`, pinned by checks D13 in `src/config/logicFixes.selfcheck.mjs` — one for the
single declaration, one scanning every app file for the old spellings, and one proving the scanner
still fires on a hardcoded name.
