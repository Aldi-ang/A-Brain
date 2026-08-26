---
title: Logistics and Stock Movement
description: Topic hub — every note about how goods move between factory, HQ vault, branch warehouses, vans and stores. Read this first when the question is about logistics, shipping, restock, transfers or stock levels.
type: concept
created: 2026-08-26
updated: 2026-08-26
confidence: high
checked: 2026-08-26
tags: [logistics, shipping, warehouse, inventory, stock, transfer, restock, hub]
aliases: [Logistics, Shipping, Stock Movement, Warehouse, Restock, Transfer, Supply Chain]
---

# Logistics and Stock Movement

**This is a hub, not an answer.** It exists so the word *logistics* has somewhere to land — no
note was titled that, so recall for it returned nothing until 2026-08-26. Read the 1-3 notes below
that match the question, not all of them.

## The chain

**factory -> HQ master vault -> branch warehouse -> van -> store.** All internal — KPM makes what
it sells, so there is **no supplier**. A third-party **courier** does move goods between HQ and the
branches (`handleShipItems` demands a Logistic Company and a Nomor Resi), which is the one external
party in the chain.

## Read by question

| Question | Note |
|---|---|
| What do big operations do that KPM does not? What should we build next? | [[The Eight Warehouse Gaps]] — ranked gaps, build order, **rejected on purpose** list |
| How does HQ send stock to a branch on purpose? | [[HQ-Initiated Stock Push]] — lifecycle, 4 options, **decision OPEN** |
| Why is a count trusted over a claim? | [[Stock Count Trust Chain]] |
| Where is the whole app heading? | [[Where KPM Is Going]] |
| How do the screens connect? | [[The KPM Control System]] |

## Locked rules — do not re-litigate

- **The branch is credited what it COUNTED, never what HQ claimed to send.**
  `BranchWarehouseManager.jsx:505`. Double-credit guard at `:499`.
- **A courier status must never move stock.** Carrier-delivered is not consignee-accepted.
- **No supplier claim language.** Nothing is bought in — a shortage is an internal leak, unless the
  courier lost it.
- **Old stock is a money and reputation problem, not a legal one** — the excise band year is a
  freshness label the customer reads. See [[The Eight Warehouse Gaps]] G2.

## Open

- Which push option (D recommended), whether to build **"Dalam Perjalanan"** in-transit visibility,
  and link-vs-Cloud-Function for resi tracking — all in [[HQ-Initiated Stock Push]].
- Split Stok Kritis per warehouse with a per-warehouse minimum. Not started.

## The 2026-08-26 audit — what to add, what is broken, what to redesign

Read out of the working tree with file and line, on `phase0-solid-ground`. Published as the
artifact **Ark Lab Logistics** — https://claude.ai/code/artifact/dab76630-8f26-402b-8a41-f6dad8049000

### Missing from the regional warehouse, worst first

| Add | Why | Verified |
|---|---|---|
| a CAUSE on every damaged unit | damage ENTERS as a bare integer but LEAVES through a full ledger, so quarantine answers "what left and why" perfectly and "what is sitting here and why" not at all — and the cause decides who pays (RTV charges nobody, PENALTY charges the agent at retail) | BranchWarehouseManager.jsx:534 |
| its own minimum, and its own Stok Kritis | a full master hides an empty branch; master low = ORDER FROM FACTORY, branch low = MOVE FROM MASTER, so one merged list cannot name the action | App.jsx:1296 filters inventory alone |
| the batch number, carried across | batchNo appears **0 times** in the branch screen, so nothing downstream knows which packs are old. This is [[The Eight Warehouse Gaps]] G1+G2 | grep |
| an age flag on uncollected IN_TRANSIT | HQ stock is deducted at ship time; a branch that did not ask may never open the receive screen | no timer exists |
| an HQ send entry point | option D in the section above | 3 write paths traced |

### Broken today

- **"Low stock" means four different things.** Four screens carry their own fallback instead of
  calling the shared rule. Three say 50; StockOpnameView.jsx:1003 says **5**. The same product is
  critical on one screen and healthy on another. Also useTransactionEngine.js:270,
  MerchantSalesView.jsx:2423, ResidentEvilInventory.jsx:236.
- MapMissionControl.jsx:1551 and :1553 call getDoc without importing it, inside a try/catch — it
  has failed silently for months. Same shape as the bug that disabled the rank engine.
  See [[Silent Failure Disease]].
- Stock Opname, Fleet and Master Vault each open their own branch listeners for data already
  loaded as branchStock.
- The over-ship guard reads the screen's copy of stock, taken before the photo upload.

### ⚠️ Correction to the options section above

It said in-transit stock is "summed nowhere". **Wrong.** The branch reorder panel has always shown
**Di gudang / Di jalan / Keluar** per product, with a warning when the shelf runs dry before a
shipment ordered today could land (BranchWarehouseManager.jsx:1145). Only the **company-wide**
figure at HQ is missing. Written in place rather than deleted, because the wrong version was said
out loud first.

### Do we need more workflow? No.

The five states are already right. What is missing is **a door in** (HQ can start one), **a window**
(see the middle state) and **a field** (why is this damaged). A second collection would give the
branch two inboxes and copy the whole receive transaction for nothing.

### The redesign: one waybill, two directions

Factory→HQ and HQ→branch are the same object travelling opposite ways. Three parts defined once,
used on both screens and reusable elsewhere — which answers his standing ask that a control be
built so it works in another place too:

1. **Transit Strip** — three numbers, one line, never a card. Already exists per product; promote it.
2. **Count Sheet** — blind count. The shipped figure stays hidden until a number is typed so it
   cannot anchor the count. Damage takes its cause here, at the moment it is found.
3. **Waybill Row** — lamp, route, age. Replaces both order lists. Age is what turns a forgotten
   shipment into a visible one.

**Build order:** split Stok Kritis + per-warehouse minimum → route the four fallbacks through the
shared rule → HQ push (option D) → Transit Strip at HQ + age on the row → cause on damage →
carry the batch.


## 2026-08-26 — Restock Vault redesign v2: one form, two directions

Aldi asked one question — *"where is the tujuan textbox?"* — and the answer explained the whole
screen. Artifact: https://claude.ai/code/artifact/b7c1dd78-30f2-4061-a161-7cc08f4b52bf

### What the code actually holds (read out of the tree, file:line)

| Field | Where it lives | State |
|---|---|---|
| Asal | `RestockVaultView.jsx:1036` — free text `supplierName`, placeholder "e.g., KPM Malang" | no picker, so `KPM Malang` / `kpm malang` / `Pabrik Malang` all coexist |
| Tujuan | nowhere in the screen | intake silently means HQ |
| Shipment photo | DISPLAYED `RestockVaultView.jsx:409`, WRITTEN only `BranchWarehouseManager.jsx:690` | intake can show a photo it has no way to take |
| Nota / faktur | `RestockVaultView.jsx:94-121` `receiptFile` → `receiptUrl` | works, inbound only |
| No. Resi + kurir + sender | `:317` `:338` `:397` `:794` `trackingNo` | works, **outbound only** |
| Factory's own SJ number | nowhere — `:131` makes its own from `Date.now()` | paper and app can never be matched |

**The pattern:** every field exists somewhere, and which half of the screen you stand on decides
whether you can use it. That is not two features. It is one document cut in half.

### Decisions taken

- **One form, two directions.** `Asal → Tujuan` is the field that does it; the route derives the
  document type. Masuk and Kirim are the same pane with the route reversed — one tab, no new screen.
- **Free text loses, picker wins, but nothing is blocked.** The box searches a list like the sales
  terminal (`MerchantSalesView.jsx:2225` — one input, substring filter) and still accepts an unknown
  name, marking it `BARU` as you type. His own comment already argues this at
  `BranchWarehouseManager.jsx:26` — *"a hand-written list would spawn Cello Coffee and cello kopi"*.
- **Target keeps its data and loses its tab.** Production targets are legitimately measured against
  this ledger, but they answer one question and took a whole room. Demoted to a strip above the form;
  the freed tab becomes **Kirim** (the HQ push, option D).
- **Scanner: barcode only.** `BarcodeDetector` is native in Chrome/Android, ~40 KB fallback, offline,
  Rp 0 — reads the resi label and the product both. Printed-text OCR (Tesseract) is a later helper.
  Handwritten nota needs a cloud vision model, a Cloud Function and a per-scan fee — parked.
- **Motion menu.** Take: press-scale 3%, hover lights the left edge, money counts up, staggered rows,
  the swap button spins, the lamp breathes **only on IN_TRANSIT**, a completeness hairline, a save
  stamp. Reject: points / streaks / XP, sound, forever-spinners.

### Two laws that decided the motion list

1. **Lite Mode kills motion, never a hue** — so nothing may carry meaning through movement alone.
   The breathing lamp is legal only because its colour says the same thing.
2. **The completeness meter never blocks saving.** It counts real evidence and reports; a blocked
   save is a blocked dialog, and [[Dialog Gate]] already settled that a block explains nothing.

### Ranked additions for this screen

1. Kirim (HQ push) · 2. per-line price drift vs the last landed cost — a ledger lookup, no new data ·
3. *Belum sampai* (intake is instantaneous today; the factory leg has no in-transit state) ·
4. No. SJ pabrik · 5. sisa batch (the payoff for the batch plan) · 6. duplicate-nota guard.

### Verification, honestly

Seen: renders in dark, layout holds, `Rp 2.420.000` on one line, the completeness meter and status
line compute live (so the script runs clean — no console errors). **Not seen:** any interaction,
light mode, the Kirim tab. Chrome's renderer froze on `Page.captureScreenshot` twice, in two separate
tabs, exactly as it did the session before. That is a machine problem, not a page problem, but it
means the interactions are unproven.

See also: [[Anti-Recurrence Check]] · [[Silent Failure Disease]]
