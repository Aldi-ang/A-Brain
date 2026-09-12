---
title: What Counts As Low
description: The one rule for "low stock" — own MIN. ALERT in Bks if set, else the company default (qty + unit, 3 Bal) converted per product — and the two-week gap between the rule shipping (2026-08-25) and every screen using it (2026-09-12).
type: entity
created: 2026-09-12
updated: 2026-09-12
confidence: high
checked: 2026-09-12
tags: [inventory, stock, threshold, dashboard, merchant-sales, adoption-gap]
---

# What Counts As Low

**The rule** (`src/utils/stockThreshold.js`, Aldi's decision 2026-08-25): a product is low when its
stock reaches its own **MIN. ALERT** if one is set, otherwise the **company default**, which is a
quantity plus a unit (`defaultMinStockQty` + `defaultMinStockUnit`, default **3 Bal**) converted
into Bks using that product's own packing. Two products packed differently get different Bks
thresholds from the same "3 Bal" — that is why the setting stores a unit, not a number.

His words: *"few bal is considered as low not BKS bruh, but we should add option and setting to
edit what considered as low to the company"*.

**Two things that are settled and must not be re-decided:**

| question | answer | why |
|---|---|---|
| what does a BLANK MIN. ALERT mean? | "use the company default" | zero and blank both fall through; "never warn me" is not an option |
| what unit is `product.minStock`? | **Bks**, always | it is compared to `product.stock`, which is Bks; reinterpreting it would silently move every threshold users already typed |

## The adoption gap — a module that shipped and was not used

`stockThreshold.js` was written because the fallback number was typed into **seven** files and had
drifted: `50` in four of them, `5` in two. Its own header says so. On 2026-08-25 only `App.jsx`
(`lowStockItems`) and `DashboardView.jsx` were switched over. The other four kept their number for
two and a half weeks:

| call site | kept | meaning for a 10×20 product |
|---|---|---|
| `ResidentEvilInventory.jsx:236` | `item.minStock \|\| 50` | low only under a quarter of one Bal |
| `useTransactionEngine.js:317` | `prodData.minStock \|\| 50` | same, on the post-sale alert |
| `MerchantSalesView.jsx:2472` | `item.minStock \|\| 50` | same, on the LOW badge |
| `StockOpnameView.jsx:1007` | `p.minStock \|\| 5` | five packs — ten times quieter still |

**Reproduced by Aldi, 2026-09-10 19:49.** Product `coba baru`, MIN. ALERT blank, 1 Bal (200 Bks)
on the shelf. Dashboard STOK KRITIS: **LOW**, `ambang 3 bal`. Merchant Sales in Boss Car / Master
Vault mode: **no badge**. One product, two answers, because 200 is comfortably above 50 and
comfortably below 600.

**Closed 2026-09-12, `9b31bf0`.** All four call `isLowStock(product, appSettings)`. The two sites
that compare something other than `product.stock` (the post-sale `newStock`, and `stat.vault` in
Stock Opname) spread the product and override `stock` — the shape `App.jsx:2163` already used.
`appSettings` had to be threaded into two places that never had it: a prop from `App.jsx` into
ResidentEvilInventory, and an option into `useTransactionEngine`.

## The guard

`src/config/stockThreshold.selfcheck.mjs` section 7: each of the four files must not inline
`minStock || <number>` and must import from `utils/stockThreshold`; plus the `coba baru` case itself
(blank MIN. ALERT, 200 Bks, 3 Bal default → LOW; the old `|| 50` rule → not low). Run before the
edits with sources untouched: **8 FAIL**. After: **36/36**.

## The lesson, which is the same lesson as [[One Pack Count, Many Screens]]

A shared rule is not adopted when it is written; it is adopted when the last caller is switched and
a check pins it there. The header comment listed all seven sites on the day the module shipped, and
that list was the only thing that recorded four of them were still open. A comment cannot fail. The
section-6 guard that shipped with the module covered only the two files that had been switched, so
for two and a half weeks the check was green while the rule was ignored on four screens.

**Related:** [[One Pack Count, Many Screens]] (the converter this rule uses), [[Logistics and Stock
Movement]] (hub), `A-Brain/Wiki/Concepts/UI-Says-Yes-Server-Says-No Pattern` (the two-answers
symptom, a different mechanism).
