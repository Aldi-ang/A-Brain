---
title: Batch 2 - the amber boxes app-wide, Global Receivables, softer press sounds, the A4 receipt + its format editor
status: OPEN - queued for the next session (design first, his picks)
tags: [kpm, design, palette, sound, receipt, permissions, brainstorm]
---

# Batch 2 (2026-10-12 ~18:00)

**His words, verbatim:**
- *"this is on the reports sc1 , setting sc2, stock opname  sc3. eod verification sc4 all the textbox need to be changed it hurts the user eyes and i want all that kind of box color to be changed"* - his shots: Reports "PULL ARCHIVE" + "CONTEXT ANALYTICS" (solid amber buttons), Settings FULL / LITE (the active half solid amber), Stock Opname tabs (MONITOR active = solid amber), EOD verification tabs (HQ VERIFICATION active = solid amber).
- *"i want u to redesign the buttons and box on this global receivable inside consignment as well and i want the all regions textbox option to be the regional team name instead and also redesign the text and button and make it more in theme and add some smooth elegant animation on that"* - his shot: GLOBAL RECEIVABLES header, the region select ("ALL REGIONS" with a globe emoji), the search box, the A/R FINANCIALS / PHYSICAL STOCK / HAND-OFFS tabs.
- *"i want the click sound for dismissing the notification and any other same press SFX to be softer and satisfying in ear but elegant"*
- *"i found another problem the format for the A4 receipt is not right on the pc here it is so big and some box is collapsing with one another i want u to check that one as well later, great if there is option to edit the receipt format but for tier 1 and 2 only at default and also add that power inside the matrix inside the setting"* - his shot: the sales terminal's A4 nota (NOTA PENJUALAN / CUSTOMER COPY) on PC: huge type, the SALES / AGENT and METODE BAYAR labels wrap into the values, the KEPADA YTH box tall and empty.

**Measured (2026-10-12 18:00, live code):** `bg-[var(--gold)]` (solid amber fill) sits in 10 files, 56 places - StockOpnameView 12, FleetCanvasManager 12, HistoryReportView 8 (Pull Archive ~416, Context Analytics ~453), CustomerManager 8 (the ones left after his buttons-A), EODReconciliationView 5, SamplingManager 3, PlayerCard / EODLetter / EODCardDeck / AuditVaultView 2 each. The Settings FULL/LITE switch: src/components/SettingsView.jsx ~298-309. Global Receivables: src/ConsignmentFinanceView.jsx (region select ~954 `🌍 All Regions`). The terminal's A4 nota: src/MerchantSalesView.jsx (~3225 area) - NOT the shared SaleReceipt.jsx (Reports / Day Replay), which has its own A4.

**Known so far:** his rule from the hub + buttons-A - *a gold EDGE on the dark plate, never an amber fill*; `.kpm-edgebtn` (theme.css) already exists for BUTTONS. An ACTIVE TAB / the on half of a switch is a different object (a state, not an action) and needs its own look - that is the design question. Sounds: the studio + baker pattern (A-Brain `Tools/sound-studio/`, his saves in `sfx/settings`); his rule *Sounds come from Aldi* (vault concept) - candidates from recordings, never synthesis; the notification dismiss + "same press SFX" first need a list of every place that plays that sound (src/hooks/useSound.js callers).

**Decision:** OPEN - each design item gets frames on the real page (his rule: a design decision is an image), his pick, then the build.

**Rejected on purpose:** sweeping all 56 amber fills to `.kpm-edgebtn` blindly - a tab's active state and a button are different things; a button style on an active tab would read as "press me" on the thing already pressed.

**Also found:** src/config/undef.check.mjs is RED on `__BUILD_ID__` (src/components/UpdateStatus.jsx:5, a Vite define) - so it was not run, and it would have caught the `userId` save bug (fixed kpm `2490f5a`). Teach it the build-time globals so it can guard again.

## Done the same evening (his *"just push later do the fix first"*, 18:05)

- **WhatsApp save** - kpm `2490f5a`: the saver used `userId` (not in scope in MerchantSalesView); now `dataOwnerId`.
- **undef.check green** - kpm `78919af`: UpdateStatus.jsx's `__BUILD_ID__` pinned like App.jsx's; the check is clean and must run with logicFixes + audit from now on.
- **A4 nota layout** - kpm `78919af`, BOTH copies (SaleReceipt.jsx for Reports / Day Replay, MerchantSalesView.jsx for the terminal): measured before - "SALES / AGENT" and "TIPE TRANSAKSI" wrapped onto two lines, KEPADA YTH box 152 px around 44 px of words, 267 px empty between; after - 0 wrapped labels at 960 and 1280, box 76 px, gap 32 px, company name 24 px (was 30), customer 18 px (was 20). Frames: `Raw/2026-10-12-a4-nota/a4-before-1280.png`, `a4-after-1280.png`.
- **FOUND, NOT FIXED (queued in item 4):** the Reports / Day Replay A4 (SaleReceipt.jsx) colours its text with the app's theme tokens (`--ink`, `--line`, `--accent-edge`) on a WHITE sheet - in the dark theme the company name, the values and the item rows are cream on white, nearly unreadable (see the after frame). The terminal's copy uses fixed company blue / slate and reads fine. His rule: the nota keeps KPM company blue; the palette law stops at the print block - so the fix is the terminal's fixed colours, not theme tokens.
- Still owed in item 4: the "edit the receipt format" power (T1 + T2 by default, in the Settings permission matrix) - ask him with a picture what "format" covers first.

## Added 18:10 - four more, his words verbatim (phone screenshot: AGENT PROFILE on iPhone Safari, kpm-ang.vercel.app)

*"the access granted on lite mode is also the old one u need to change that , and i want the sidebar on phone to be more reactive on drag, last time when my phone is hot or low battery it is unresponsive . i found another bug when using my iphone, i open the kpm page on the safari and on the agent profile and for some reason my profile picture is cutted and other profile picture is fine tho i dont know why and also the bottom map button on the safari also cutted as well when i  open the map system on the iphone safari"*

| # | Report | Where to start (located 18:10, not yet diagnosed) |
|---|---|---|
| 5 | Lite Mode still shows the OLD "access granted" | the words live in src/App.jsx, src/components/VaultGate.jsx, src/components/BiohazardTheme.jsx - find the Lite branch that still draws the old screen; compare with the full-mode one he approved |
| 6 | the phone sidebar drag is unresponsive when the phone is hot / low battery | the drag handlers in src/components/BiohazardTheme.jsx (touch / pointer move): look for setState per move, layout reads per frame, non-passive listeners; measure with CPU throttle (CDP Emulation.setCPUThrottlingRate 4-6x) before and after |
| 7 | iPhone Safari: HIS profile picture is cut on Agent Profile, other agents' pictures are fine | his card: Mythic rank frame (src/components/PlayerCard.jsx frame + AgentProfileView.jsx:112 img object-cover). His shot shows a tan band across the top of the frame and the picture pushed down - suspect a WebKit-only sizing rule on the Mythic frame (aspect-ratio / % height / clip-path); compare his tier's frame with a lower tier's. Chrome cannot show a WebKit-only bug: ask him for one more shot if needed, or test in a WebKit build |
| 8 | iPhone Safari: the Map's bottom button is cut | src/MapMissionControl.jsx bottom dock / sheet (fixed bottom-0 ~1323) - Safari's bottom toolbar: suspect 100vh instead of 100dvh, or no env(safe-area-inset-bottom) |

Also in his shot: the Agent Profile LEADERBOARD tab is a solid amber active tab - same family as item 1.
