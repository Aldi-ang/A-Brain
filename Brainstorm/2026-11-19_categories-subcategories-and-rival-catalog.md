---
date: 2026-11-19
status: DECIDED 2026-11-19 08:25 (pictures next)
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

## 2026-11-19 07:11 - his new direction: Competitors becomes its own screen

> *"i dont think that our competitor will give different price for each of their retailer, they may also set their price according to the customer type so this way i think that we make the competitor segment as its own segment and the competitor inside each of the stores is just some comparison, data taken from the competitor own segment just to see if that product is perform the best in that stores compare to other, all the option to see competitor as a whole, adding or seeing all the competitors just available inside the competitor segment this should be outside of each stores for the main global competitor one, but there should be some different what tier 3 and tier 4 can see, tier 4 can only see the price difference within his own region because some region might have different price for the competitor price while the tier 3 and above as default can see all of the prices between region for our competitors, yea wel salesman should give us information towards the product to the admin through the app and admin approve and add it to global competitor screen"*

Design that follows (pictures = Antigravity Tasks 78 + 76):
- **Competitors screen (global, outside the shops)**: rival products by Category › Sub; a price per REGION x CUSTOMER TYPE; compare any of ours with any rival; manage the list; the approval queue.
- **Shop tab**: read-only comparison using the region price for that shop's customer type, plus "how it sells here vs other shops in the region", plus "Report a rival" (goes to approval).
- **Flow**: salesman reports -> admin (T4 for his region, T3+ anywhere) approves -> region price updated or kept as a note.
- **Visibility**: T4 sees only his region's prices; T3 and above all regions (matrix default, changeable).
- This replaces the earlier "admin current price per product" (one price) and the per-shop price log as the source of truth.

Open questions: is "customer type" Retail / Grosir / Ecer? Who approves? Does approving overwrite the region price?
Models applied (this section): Second-Order Thinking (an unapproved report must not move the comparison), Inversion (what if a T4 edits another region's price -> rules must stop it).

## DECISION (partial), 2026-11-19 08:03

> *"answer 1 yes correct that is the customer type that i mean, salesman report approval is tier 4 job to do and tier 3 and above can approve any region, q3 choice B"*

- Customer type = Retail / Grosir / Ecer (the price types the app already has).
- Approval: T4 approves salesman reports for his own region; T3 and above can approve any region.
- A report with a different price: the approver chooses "Update the region price" or "Keep as a note only".
- Still OPEN: two fixed levels (Category › Sub) + one list shared by our products and rivals.
- 08:25 DECIDED: *"well just add features to have 2 options add to the existing category or add new category for that competitor products"* -> one list shared by our products and rivals; adding a rival product (or approving a salesman's "new product" report) offers "Add to an existing category" or "Add a new category". A category made from the competitor side shows in Master Vault tagged "competitors only · 0 of ours". Two levels (Category › Sub) kept. Status: DECIDED - pictures with Antigravity (Tasks 76-78).
