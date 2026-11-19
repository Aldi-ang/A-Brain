---
date: 2026-11-19
status: OPEN — waiting on Aldi
confidence: medium
checked: 2026-11-19 (permissions.js tiers, MerchantSalesView.jsx:1690 category list, StockOpnameView.jsx:950 product fields)
---

# Categories + sub-categories (Master Vault and rivals) and the rival catalog

## PROBLEM (his words, 2026-11-19)

> *"i think only tier 4 as default who can edit that and add that ability inside the matrix. i want freedom on using this app, therefore it is better when u put category in each comparison section but it is free for us to compare between category well since the update only done by admin make sure that admin edit the newest price for the product and make sure this app can notify if there is some duplicates. and dont add price per batang, since we are going to make this app very general i rather have a product with category and sub category, this way if there is some milk company use my product they can also add their category for milk for example milk for kid, adult or elder people, and each of the category have their own category for example kid silver, kid bronze and kid gold, then adult chocolate, adult vanilla, adult banana choco for example lets discuss on how we are going to design this, this update should also applied on each of our inventory or master vault dont forget about that"*

What the app does today:
- A product has ONE level of grouping, `type`. The sales terminal builds its tabs from it: `["ALL", ...new Set(inventory.map(i => i.type || "MISC"))]` (`src/MerchantSalesView.jsx:1690`). So a category exists only while some product uses it.
- Tiers (`src/config/permissions.js:45-49`): T2 Owner, T3 HQ Sales Manager, T4 Regional Admin, T5 Sales Canvas, T6 Sales Motorist. A permission matrix editor exists (`PermissionMatrixEditor`, `src/components/SettingsView.jsx:1664`).
- Products already carry `sticksPerPack` (`src/StockOpnameView.jsx:950`), but he does NOT want a per-stick price (the app must stay general).

## OPTIONS

| # | Option | Buys | Costs |
|---|---|---|---|
| A | **Two fixed levels: Category > Sub-category**, one shared list for our products and rivals, stored as its own list (not derived from products) | Simple chips on every screen (two rows), fits his milk example (Kid > Kid Gold), an empty category can exist (rivals only) | Old `type` must become a category; every screen that reads `type` changes |
| B | Unlimited tree (Category > Sub > Sub-sub ...) | Fits any company | Every picker becomes a tree; heavy on the phone; nobody asked for level 3 |
| C | Keep `type`, add a free-text `subType` | Smallest change | Typos make duplicates ("Kid gold" vs "KID GOLD"); no place to manage the list; rivals cannot share it |
| D | Separate category lists for rivals and for our products | Rival categories cannot clutter Master Vault | Comparing by category needs a mapping between two lists |

Rival catalog (all options): each rival product = name, category, sub-category, **current price edited by admin** (with who + when), the Cello product we pair it with. Cross-category comparison ALLOWED (his "freedom"); the screen shows each side's category and marks when they differ.

Permission: a new matrix row "Edit rival list, categories and pairs", default ON for T1-T4, OFF for T5-T6.

Duplicates: on add, compare the name after lower-casing and removing spaces/punctuation; a near-match warns before saving; a "Possible duplicates" list (Merge / Not duplicates) like the shop duplicates tool. Applies to rival products and to categories.

## COSTS

- Data change: new collections (category list, rival catalog) and new fields on products (`categoryId`, `subCategoryId`) -> `firestore.rules` lines published in the Console FIRST.
- Migration: each existing `type` becomes a category with no sub-category; nothing is lost; old screens keep working only if `type` is still written during the change-over.
- Sales terminal tabs change (second row of chips for sub-categories) - the money screen, so it needs its own check.
- Second-order: once rivals have a current admin price, salesmen stop logging shop prices unless we keep that form - decide which price the side-by-side uses.

## DECISION

OPEN — waiting on Aldi. Claude recommends A + shared list + cross-category allowed + T1-T4 default in the matrix + duplicate warning on add.

## REJECTED ON PURPOSE

- Price per stick (his "dont add price per batang").
- Locking comparisons to the same category (the v4 picture did this; he wants freedom).
- B (unlimited tree): nobody needs level 3; flips if a tenant shows one.

Models applied: Second-Order Thinking (who stops logging prices), Reversibility Test (keep writing `type` during the change-over), Opportunity Cost (Master Vault first, Customers after).
