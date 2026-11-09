---
title: Demo build - many things not working
description: Walked by Claude 2026-11-08 (phone first, then PC, all five logins + the 8-step mission played on the phone) - 15 findings, mission stops at step 3 and step 6, 14 of 21 lessons not built; waiting on his ranking
status: Waiting
area: Demo
priority: High
created: 2026-11-03
updated: 2026-11-09
progress: 2026-11-09 his "continue your work from your list" - #11 and #2 fixed + pushed (da8cad3, ac00398); #4 and #2's cause = rules drafts CHANGE 25 + 26 waiting for his publish in BOTH projects; #1, #3, guide, lessons, wording next
---

# Demo build - many things not working

His words, 2026-11-03 09:48 WIB: *"at last remind me to continue working with the demo if we have many quota left because there is so many stuff that is not working well in there"*.
His words, 2026-11-08: *"i want u to check it yourself, not just pc POV but mainly on phone POV, as i remember there is one problem on the tutorial that is viewed from the phone, and also that demo doesnt have full tutorial to show all the main features inside that app"*.

## How it was walked (2026-11-08, Claude)

Local emulator only (launch `demo-emulator` + `demo-api-emulator` + `demo-app-emulator`, `node tools/demo-reset-emulator.mjs` 33/33), real `firestore.rules`, an invited guest Google account -> picker -> vault gate, like a visitor.
Phone = headless Chrome 390x844, touch + coarse pointer, REAL touch taps (CDP). PC = 1280x800.
Scripts + every frame: `Raw/2026-11-08-demo-walk/` (`walk.mjs` = every sidebar screen + book + lessons per login; `drive.mjs` + `m/*.js` = the mission played tap by tap). **The board: `Raw/2026-11-08-demo-walk/DEMO-BOARD.png`** (numbers below = numbers on the board).
No page overflowed sideways on any screen, phone or PC (scrollWidth = width everywhere).

## The mission (8 steps) played on the phone

| Step | Who | Result |
|---|---|---|
| 1 Terima di Master Vault | T2 | **STUCK** until the owner presses UNLOCK SYSTEM + admin123 - the capybara never says so (#1). After unlock: pass |
| 2 Kirim ke gudang wilayah | T2 | pass (300 Bks to BANDUNG) |
| 3 Muat tas Dika | T4 | **FAILS** - database refuses the load (#2) |
| 4 Jual ke toko | T6 | pass, but the guide points off screen twice (#5, #6) |
| 5 Retur barang rusak | T6 | pass, but the receipt hides the next press (#7) and the reason box is off screen (#5) |
| 6 Kirim EOD | T6 | **DEAD END** - Dika has no EOD Setoran in his menu (#3) |
| 7 Setujui EOD | T2 | not reachable (needs 6) |
| 8 Stock Opname | T2 | pass (after a second UNLOCK - every SWITCH back to the owner locks again) |

Steps 3 and 6 were marked done by hand in the test browser to reach 4-8. A real visitor stops at step 1 (or 3 after unlocking).

## Findings (phone unless marked; frame = file in Raw/2026-11-08-demo-walk/)

1. **Owner lands locked** (phone + PC). T2 opens on "RESTRICTED ACCESS / UNLOCK SYSTEM"; Restock Vault shows the branch desk ("Nothing on the way to UNASSIGNED"), Master Vault stock shows `**`, EOD is blank. Mission step 1 loops on "Buka menu, lalu pilih Restock Vault". The guide also switches itself off during the unlock, and every SWITCH back to T2 locks again. Why: App.jsx entry gate skips T1/T2 (`entryLocked` needs `!holdsVault`), so the owner meets no gate and stays `isAdmin=false`. Frame `phone-T2-2-home.png`, `mission-06-tap2.png`.
2. **Step 3 van load refused** (T4 Hendra). Toasts "Tidak ada yang tercatat / 1 gagal", and the **raw rules error is printed on the screen** ("Gagal: false for 'update' @ L44, evaluation error at L539:31 ..."). Likely cause [likely]: the van record update (rules `motorists`, ~L830) needs `isAuthorizedAreaAdmin` = FLEET_CAPTAIN **with `canEditRoster: true`**; the demo's Hendra record has no `canEditRoster`. Demo data - but the app offers Muat van to a T4 the rules will refuse (the UI-says-yes pattern). Frame `mission-38-why.png`.
3. **Step 6 dead end**: T6 (ROOKIE) default rights have no `view_eod` (permissions.js TIER_6), so Dika's menu has no EOD Setoran; the guide says "Buka EOD Setoran dari menu" with nothing to point at. Frame `mission-73-eod-menu-open.png`.
4. **T3 Restock Vault kills the app** (phone + PC). "Places listener: permission-denied", then Firestore `INTERNAL ASSERTION FAILED (ID: ca9 / b815)`; every screen after it is black until a reload. Probably live too (same code, same rules, nothing special in the demo's T3) - not yet proven on the real app. Frames `phone-T3-s-restock_vault.png`, `phone-T3-s-sales.png`.
5. **Guide points into the closed order drawer** (Sales Terminal, steps 4 and 5): "Pilih toko", "Tekan Auto handover photo", "Pilih alasan rusaknya" ring an element at x = -329 / -169 (inside the shut PESANAN drawer). Whole screen dimmed, nothing lit, no hint to open the drawer. Frame `mission-42-s4-3.png`.
6. **Drawer stays open over the + buttons** after the shop is picked; the square is drawn round the product list but the drawer covers it, so it frames the payment form. Frame `mission-51-photo.png`.
7. **Receipt covers the next press**: after MAKE DEAL the nota opens; step 5 rings "Retur Mode" behind it and blurs the receipt; never says "close the receipt". Frame `mission-60-r2.png`.
8. **Asal list opens below the screen** (step 1): the field sits at the bottom edge, its one option at y 849-902 on an 844 screen; visitor sees only "cari...". Frame `mission-13-s1.png`.
9. **Lesson Shipment Plan on the phone**: the camera centres the highlighted column, so the product-name column is scrolled off the left - numbers with no names. Frame `phone-T2-L-restock_vault-ShipmentPlan-a.png`. (PonderOverlay.jsx centreIn, his 2026-09-01 "screen moves with the highlight" choice; a sticky name column would keep both.)
10. **Lesson Stock by Warehouse on the phone**: same - warehouse names gone, AGENT INVENTORY column cut at the right edge ("18(", "22("). Frame `phone-T2-L-restock_vault-StockbyWarehou-a.png`.
11. **Reports refused for T4/T5/T6** (phone + PC): Product Performance says "The sales figures could not be read" (`Sales stats read failed: permission-denied`). Probably live too (same rules). Frame `phone-T4-s-transactions.png`.
12. **Book: 14 of 21 lessons are "Segera"** (coming soon); see coverage below. Frame `phone-T2-b-sales.png`.
13. Small: step 3 load sheet's top (which product) is hidden under the DEMO bar (`mission-32-slot.png`); "Muat van" button half below the screen bottom; Dika's card can sit off screen after the card row is swiped (`mission-29-s3-3.png`).
14. Small, wording: guide says "MAKE DEAL" but the button reads "SIMPAN TRANSAKSI"; "Auto handover photo" vs the button "Foto serah terima otomatis (demo)"; "Klik barang" on a phone (Ketuk). Two book entries say "kamu" (sections.js: "Angka kamu dibandingkan", "uang kamu") - his never-kamu rule.
15. Small: a USB-backup alert ("PROTOCOL ALERT: TIME FOR USB SAFE BACKUP!") greets a T6 salesman in the demo; Auto-Promoter fails silently for T6 (open sweep finding #15).

## What the mission + tutorial do NOT show (his "doesnt have full tutorial")

Mission covers: Restock Vault MASUK/KIRIM, Fleet van load, one cash sale, one damaged retur, EOD send + approve, Stock Opname New Count.
Lessons built (7 of 21): Goods Received, Stock by Warehouse, Shipment Plan, Regional Warehouse, Agent Chest, Loading Bay, Product Performance.

Not shown anywhere (no mission step, lesson only "Segera"):
- Command Center (dashboard, targets)
- Master Vault (products, prices)
- Sales Terminal beyond one cash sale: titip / consignment, IOU / hutang, promo, samples, printing the nota
- Receivables & Consignment (piutang, collecting titip, hand-offs)
- Stock Opname beyond New Count: Quarantine (Sell Again, RTV), HQ Audits, blind count
- EOD has no lesson (only the mission, which breaks at 6)
- Journey Plan, Map System, Customers (add a shop, folders, hand-off), Sampling
- Agent Profile (XP, ranks, leaderboard), Audit Logs, Settings (tiers + permissions, language, Lite Mode)
- People: T3 (HQ Sales Manager) and T5 (Sales Canvas) have no mission step at all - 2 of the 5 demo logins do nothing in the story.

## 2026-11-09 — worked in my order (his "continue your work from your list", no ranking)

| # | Result |
|---|---|
| 4 | **Not live.** T3/T4/T5/T6 are refused `places` (warehouse list) by the PUBLISHED rules - only the owner/T1/T2 catch-all covered it. The black screen is DEV-ONLY: React StrictMode subscribes twice + the Firestore multi-tab cache asserts (ca9); with StrictMode removed the refusal stays and nothing crashes. Draft **CHANGE 25** (every login reads places). rules-test/test-places-read.mjs. |
| 11 | **Fixed, live da8cad3.** Product Performance now mounts only for T1/T2 (permissions.js canReadSalesTotals) - the rules keep sales totals an office screen. Demo: T3/T4 no error, T2 the panel. |
| 2 | **Fixed, live ac00398** (the screen part): helpers.js plainSaveError - "Gagal: Ditolak: login ini tidak punya izin untuk menyimpan ini", never rules text. The cause: the motorists rule wanted canEditRoster for ANY card change; draft **CHANGE 26** lets a T3 anywhere / a T4 in region change only the van lists. Demo on the draft: Hendra loaded 50 Bks into Dika's van. rules-test/test-van-load.mjs. |

Rules publish needed in TWO places: the KPM project and the demo project kpm-demo-f4d74 (its rules were last published 2026-10-13).
Proof: Raw/2026-11-09-badge-test/ (scripts: seed.mjs, test.mjs, vanload.mjs, whois.mjs).

## Next

Waiting on his ranking of the board. No app code before it (his diagnose-first rule). TRAP: never touch the live demo project (kpm-demo-f4d74 / Vercel kpm-demo); fixes go through the emulator + the normal push; demo data fixes live in `api/_demoCompany.js` (the nightly reset rewrites the demo from it).

## 2026-11-09 evening - his call: fix logic, permission and wording here; LOOK-only items move to the professional edition

| # | Result |
|---|---|
| 3 | **Fixed, live 3249fe7.** T6 default rights gain view_eod (permissions.js TIER_6 + the fallback list). A company with a saved tier matrix ticks it in Settings. |
| 14 | **Fixed, live 3249fe7.** Guide words match the buttons; the lesson book's two "kamu" lines say "Anda". |
| 15 | Half fixed, live 3249fe7: the USB reminder needs the unlocked vault. Still open: Auto-Promoter fails silently for T6 (customer lastVisit/tier update refused). |
| 5-8, 9-10, 13 | Moved to the professional edition (screens get redrawn there). See Brainstorm/2026-11-09_professional-edition.md. |
| 1 | **Fixed, live (this push).** The guide starts the owner's vault steps (1, 2, 7) with the unlock: it points at UNLOCK SYSTEM (or the menu's Unlock Vault) and gives admin123; it stays on after the unlock. Walked on the demo emulator: Raw/2026-11-09-demo-unlock. |
| 12 | Open: needs his choice of lessons. |
