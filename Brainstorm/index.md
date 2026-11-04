---
title: "Brainstorm — Index"
description: Folder index for Brainstorm/ — scratch space for undecided things. Pre-existing, separate from the Wiki ingest system. Added as part of PLAN-A-Brain-agentic-OS task 2.3.
type: index
created: 2026-07-27
updated: 2026-07-27
tags: [index, brainstorm]
---

# Brainstorm

Scratch space for things that aren't decided yet — early thoughts, options being weighed,
open questions. Per [[../CLAUDE.md|CLAUDE.md]], this is "separate, pre-existing, unrelated to
[the Wiki ingest] system" — undecided material stays here rather than being written into the
Wiki as if it were settled knowledge.

## Files here (as of 2026-07-27)

- `Crown Transfer — options.md` — waiting on a conversation with the company boss; see also
  [[../Backlog/index|Backlog: Crown Transfer (Option A)]], parked there too.
- `Rank Config redesign — early thoughts.md` — open questions, not yet a spec; see also
  [[../Backlog/index|Backlog: Rank Config and Achievement Badges redesign]].

## When something graduates out of here

Once a brainstorm resolves into a real decision, it should either become a
[[../Wiki/Entities/index|Wiki Entity]]/[[../Wiki/Concepts/index|Concept]] page (if it's
knowledge worth keeping) or move into [[../Backlog/index|Backlog]] as an actionable item — not
sit here indefinitely once it's actually decided.
- [[2026-09-02_phone-tutorial-shell]] — the book is clunky on a phone because a phone cannot show a spread; four candidate shells drafted as a live artifact. **OPEN — waiting on Aldi.** PC already decided: keep the book, drop the riffle.
- [[2026-09-03_tutorial-icon-candidates]] — the top bar still shows a leather book for a panel that is now a field terminal. **DECIDED: the display**, plus its CRT intro and outro, both built. Three jobs still queued: the amber swap on the panel, the icon into the app, and phone sizing.
- [[2026-09-03_panel-arrival-animation]] — how the phone tech pad opens when you press the tutorial icon and closes when you press the X. **DECIDED: Scan in + Deploy's exit, both slowed, pace dial at 1,90×.** Design phase closed; implementation is next.
- [[2026-09-04_next-job-four-candidates]] — the tutorial work closed with nothing queued behind it; four open Backlog items re-verified against today's code and offered as the next job. **OPEN — waiting on Aldi.** Recommended A (Journey Plan's silent reassign), with D (the one-line bounty guard) alongside.
- [[2026-09-06_handoff-approval-region-matrix]] — who gets the hand-off approval bell, and for which regions. **OPEN — waiting on Aldi**: does a configured tier REPLACE him as approver, or get added beside him? Data shape and default already decided inside.
- [[2026-09-08_shipping-readiness]] — what "no bugs" has to mean before KPM is sold. **PARTLY ANSWERED**: the 30 September deadline and the fix order are agreed; the emulator question is closed (built in `37f34ee`).
- [[2026-09-09_day-one-walk]] — the seven onboarding paths walked on an empty tenant, desktop and 375px, fixing nothing. **OPEN — waiting on Aldi**: does a Titip placement count towards OMZET before the store audit says it sold? Everything else is ranked inside.
- [[2026-09-09_pricing-kpm-for-the-first-customer]] — what KPM should cost in Indonesia, measured comps (Accurate, Mekari Jurnal, Badger Maps), what it costs to run, five pricing options for the uncle, the features no comparable product has, and the selling strategy. DECISION OPEN.
- [[2026-09-09_menjual-kpm-penjelasan-indonesia]] — the Indonesian explainer: three licence types, what maintenance covers and what it does not, 13 contract clauses, the 7-step sales process. Its legal half was marked unresearched and is now closed by the note below.
- [[2026-09-15_nota-scan-dan-lacak-tanggal-produksi]] — 🔴 OPEN: two feature asks from the phone sweep. (1) Nota photo scanned CamScanner-style: A clean-up only (~80 lines, no dependency, recommended first) / B full straighten via OpenCV.js (~8 MB) / C cloud (rejected, offline rule). (2) Goods tracked by production date through HQ → branch → van → store: the batch is written at intake today and never travels; A full lot stock / B FIFO ledger on the paper / C the person records the date that left (recommended first). The shaping question: does the system decide which lot left, or the person?
- [[2026-09-18_customers-look-dan-badge-karantina]] — DECIDED all B + shipped (kpm `832ea7c`): Customers rows and cards as key caps (.kpm-key, no shadows — audit G30 refused the drawn version), the shop page's competitor table stacks under lg, the Quarantine count is an LED with rolling digits; his rule "sideways swipe is inconvenience for phone" is now the SIDEWAYS RATCHET guard.
- [[2026-09-18_stock-opname-di-hp]] — OPEN, four boards sent: Stock Opname at 375 as T5 and as the boss — title wraps, 9–10 px labels, 21 px reel arrows, the boss's four tabs overlap and slide, 17 px pickers, names cut.
- [[2026-09-19_journey-plan-di-hp]] — DECIDED 2026-09-19 (B / B / YES, kpm 056d8e3), boards: Journey Plan at 375 as T5 and as the boss — the page slides sideways 12 px (path row + sector reel), 30 px / 13 px pickers at 10 px, 383 px store cards; board 1 top card A/B (fold), board 2 store card A/B (⋯ fold), board 3 path row YES/NO
- [[2026-09-22_fleet-van-loading-shape]] — 🔴 OPEN, two boards sent 2026-09-22 (phone 518 + PC 2000x1000): where the van-loading job lives — A a panel inside Fleet & Roster (recommended, ~1 session) / B its own segment in the sidebar (~2 sessions). Both carry the same basket (many products, mixed units, one press, one surat jalan); today is one product per press and the loading box sits 1001 px down the phone. The two stock transactions stay untouched in both.
- [[2026-09-21_player-card-stage-b]] — 🔴 OPEN, two boards sent 2026-09-21: the player card's HEAD on the Agent Profile (board 1 — A: the head replaces the hero and the OMSET box, keys wrap at 44 / B: the box stays) and the XP gain on the salesman's EOD panel (board 2 — the nixie +51, then A the ladder bar / B the working rows / C the 5.614 → 5.665 figure). The profile measured at 375: the boss's key row slides the page 95 px sideways, a nested scroller, 20 labels at 10 px.
- [[2026-09-22_pc-review-card-and-inventory-strip]] — ✅ DECIDED A + A 2026-09-22 ("make the Profile picture bigger as big as B minimum"), shipped kpm 20aac21: the review card open on the PC is 880 px on a 1000 px screen (board 1 — A compact head + two columns 619 px, B two columns 737 px); the Agent Inventory MODAL number and CASH coin cross their 149 px boxes at xl (board 2 — A full-width row, B one panel like PROJECTED VALUE). 
- [[2026-09-18_customers-round-two-phone]] — DECIDED A / A / A + shipped (kpm `5d7a9d0`): his four asks after the Customers test (header buttons, the sideways move = the boss's no-wrap header row, DEL/EDIT behind a ⋯ key, a hold that is not the pad's lamp). sideways gone (scrollWidth 521 → 375), desk unchanged.
- [[2026-09-18_agent-inventory-di-hp]] — CONFIRMED on his phone 10:00 (kpm `8b9b3f9`): the Agent Inventory (the salesman's van) at 375 — one scroller instead of two, toggle 44, names wrap, 10 px labels 11, the Projected Value box folds behind a 44 px SHOW row (his B); header 424 → 294.
- [[2026-09-17_customers-di-hp]] — CONFIRMED on his phone 2026-09-18 (kpm `a9822ff`): Customers at 375 — form folds behind a button, every box 44 and theme-coloured, folder rows, shops A→Z; the folder tree stays (his NO).
- [[2026-09-17_sales-terminal-di-hp]] — CONFIRMED on his phone (kpm `4ba6563`): the Sales Terminal measured at 375 inside the real shell; his pick was B (picture 64, − + 44, shorter rows) and YES on the sheet (every control 44, labels 11). The table of what measured, and what was left alone, stays in the note.
- [[2026-09-10_riset-hukum-menjual-kpm]] — the legal research, with a source per number: PT Perorangan (PP 8/2021, PNBP Rp 50.000), PPh 23 at 2% vs 15% and why the contract wording decides it, PP 20/2026 removing the 0,5% time limit, the Rp 4,8 miliar PKP threshold, UU 28/2014 Pasal 36/40/80/83, KUHPerdata 1247/1248/1249/1338 on liability caps, and escrow as penitipan under 1694–1696.
- [[2026-09-10_pricing-revisi-50-100-user]] — Aldi named the real user count, 50-100. That supersedes the Rp 2,5 juta figure, which was computed for 10-30. New bands (Rp 4/7/12 juta), perpetual licence at Rp 600 juta, and the arithmetic showing perpetual costs the BUYER more over five years.
- [[2026-09-10_draft-13-pasal-kontrak-kpm]] — the 13 clauses written as real pasal, ready for a notaris to mark up. DRAF — not reviewed, do not sign.

- [[2026-09-24_roster-as-a-game-community]] — roster as a game community (State of Decay 2 / FUT / XCOM); OPEN, recommendation A
- [[2026-09-28_master-vault-password-incident]] — the vault password "wrong" everywhere after two resets; likely the vault box (15 characters) vs the reset box (25); OPEN, his count owed
- [[2026-09-28_vault-password-per-account]] — one vault password per company (shared by T1+T2) or one per person; A own password + roster reset (recommended) / B owner only / C keep shared; DECIDED A, built kpm 7b85941 + reset/lock 56801d9
- [[2026-09-29_biohazard-box-looks]] — the quarantine crate's box in three biohazard looks (A tape rim / B inside the crate / C taped label); DECIDED C, the tape band with no word (v14)
- [[2026-09-30_quarantine-chest-warehouse-and-opname]] — the chest on the regional warehouse (A: today's cards + the switch / B: the stone box) and on Stock Opname (A: a crate per warehouse replaces the facility list / B: the crate's box); drawn as prototype v22; OPEN
- [[2026-09-29_warehouse-quarantine-and-account-move]] — a quarantine chest for the regional warehouse in Fleet & Roster, a "sell to a customer" exit, T2 moving a person to a new Gmail (the Edit-email move already exists); no wipe on lock; OPEN
- [[2026-09-29_live-rules-review]] — his live Firestore rules == the repo baseline; our draft loses nothing; 3 live gaps (directory listable, self-approvals, T2 blocked); OPEN
- [[2026-09-29_fleet-roster-quarantine-chests]] — Fleet & Roster quarantine chests beside the ender chest: A ender→quarantine / B two boxes per chest / C four loose / DECIDED 12:05: the ender chest holds two boxes, the van two chests
- [[2026-09-30_customer-showcase]] - the customer presentation: 11 live scenes in Indonesian, Day Replay = scene 03; PUBLISHED 2026-10-06 https://claude.ai/artifact/AJQ36jBJr4jkkn6ZUnRN4A
- [[2026-09-30_app-feels-heavy]] - the app feels heavy on the phone: 5 findings; BUILT 2026-09-30 18:25 (5 commits, local), 5c tutorial-book split open
- [[2026-09-30_potato-phone-audit]] - cheap-phone audit in full animation mode; fixes 1-5 BUILT 2026-10-01 (local), 6 skipped (measured 2 pts); OPEN: coin spin, Restock rest churn, EOD/Agent Profile 22%
- [[2026-10-01_google-signin-opens-gmail]] - Samsung: choosing a Google account sometimes opens the Gmail app; KPM never links there; options A-D, OPEN (his History observation first)
- [[2026-10-01_intro-name-for-every-tier]] - the unlock intro + name only reaches T1/T2 (vault holders); options A as is / B same intro after sign-in / C short box, OPEN
- [[2026-10-01_version-check-on-open]] - "is the app on the latest version?" A stamp only / B stamp + the app checks and updates itself before login (my pick) / C B + buttons wait - DECIDED B, built 9d276db
- [[2026-10-02_expedition-map]] - salesmen roaming on the map with their own destination progress (his "survivors on an expedition"): what exists (GPS on every sale, blue dot, next shop computed, trail saved and never read or trimmed); order A app first / B showcase first; OPEN, my pick A
- [[2026-10-02_master-vault-phone]] - Master Vault on the phone: measured (a finger turns nothing - 3D box and photo cropper are mouse-only), layouts A same order / B box first / C list then product (my pick) + one cropper design - DECIDED C + cropper, built 12b736f
- [[2026-10-02_phone-sweep-last-five]] - the phone sweep's last five screens measured at 390 + 1440 and ranked - DECIDED "1 and 2 first then continue", built kpm 9fb557f + 5f9d5c7 (1-4); 5 = his C (names stay), pushed 5f9d5c7
- [[2026-10-02_double-notification]] - the same message in the capybara bubble and the top panel (triggerCapy also notifies on isFailure); A top panel only for bad news (my pick) / B panel only when the bubble cannot be seen / C capybara only, OPEN
- [[2026-10-04_journey-day-replay]] - replay a salesman's day on Journey Plan (his "chain of events is replay able"): what is recorded (sales + RETUR timed; visit reasons only as an audit-log sentence; the walk is not tracked), the Ponder player reused, Day Log -> map replay -> scenes - DRAWN v1 https://claude.ai/artifact/WnjonLSqjNZYpoMBbXSdSz, his pick owed (camera)
- [[2026-10-04_visit-signs]] - clearer visit signs (his 17:10 "more clear to understand and memorize"): he picked C (objects + word), BUILT kpm bcae573; round 2: the open-request "!" (his B), BUILT kpm 635c62e
- [[2026-10-05_map-system-redesign]] - Map System redesign for its job (analyze stores, areas, levels): today vs PC A/B and phone A/B drawn (https://claude.ai/artifact/WxW6xpYd3dhLhyEwZ6Gn8u); DECIDED: phone A (dock), PC B (full map) - build next
- [[2026-10-06_public-demo]] - a demo he and other people can try: A publish the lab / B demo mode (no login, sample data, saves until refresh) / C demo company on a real backend; OPEN, my pick B · 2026-10-13: front door + switch DECIDED (phone A / PC B, bar A) + BUILT 914d17d
- [[2026-10-10_product-save-device-only]] - "on this device only" after saving a product description: the save waits only 1.5 s and re-sends the photos each time; fixes A wait longer / B "Saving..." then "Saved" (my pick) / C stop re-sending photos; OPEN
- [[2026-10-10_sfx-message-capybara-intro]] - new sounds for the message strip (today = the SALE sound commit), the capybara (crisper, less bass) and the intro; Kenney CC0 packs asked, then a studio he edits; OPEN

- [[2026-10-12_hub-symbol]] - the wholesale HUB pin: roof 3.5 px off-centre + "more recognizable"; A / B / C OPEN

- [[2026-10-12_gold-buttons]] - the solid amber buttons (Customer Directory, Sampling) - A / B / C OPEN; + the bell dates built, the music knob answered

- [[2026-10-12_whatsapp-receipt]] - the receipt to ANY WhatsApp number (A: number in the link / B: Meta API) OPEN; + two Restock Vault layout bugs

- [[2026-10-14_voice-without-mascot]] - the capybara heard as 1-2 words: a hidden tab bunches the syllable timers - FIXED kpm 9ad5d33 (A/B/C phone-terminal options rejected: appearing is not his problem)

- [[2026-10-14_cloud-sessions]] - cloud sessions do not know Alucard or the app (skill + memory PC-only, A-Brain GitHub copy 674 commits stale, hooks on D:/ paths); BOTH repos public - DECIDED B, repos private, build plan inside

- [[2026-10-15_lite-button-peek]] - Lite Mode button in the top bar that hides and peeks for a few seconds: A sliver (12 px) / B pull-tab (0 px) / C the "System Active" line decodes (0 px); live mock-up linked; OPEN - his pick + how often it peeks

- [[2026-10-18_presentation-cloud-rounds]] - customer presentation v16-v26 from the cloud rounds (catch-up, the cloud could not reach A-Brain): every round with his words, the 14 skills, the slide-menu review, his workflow rule re-confirmed; OPEN - wording for slides 22-23
- [[2026-10-18_model-switcher]] - DROPPED: a mod that changes the AI model by job difficulty; A start-of-session pick / B one Haiku grade at start (my pick) / C switch every message (cache re-read each switch). His "if its cost more then forget it".
- [[2026-10-19_app-bugs-and-100-users-check]] - OPEN: back to the app; 7 ranked findings (everyone downloads everyone's sales + photos, van cargo overwrite, HQ stock overwrite, excise, tier backup, hot tally doc, double notifications); waiting on his pick + Spark/Blaze
- [[2026-10-19_logout-autologin-and-multi-tab]] - OPEN: side-menu logout reloads before signOut finishes (auto sign-in), vault screen has no "use another account"; one login per browser is Firebase design (use a 2nd profile / Incognito)
- [[2026-10-20_terminal-card-count-and-whatsapp-autofill]] - OPEN: the terminal card shows no pack count (removed on purpose in a181c9a, he calls it a bug); the WhatsApp box asks even though the code already uses a saved shop number; A "16 Bks left" / B "1 Slop 6 Bks"
- [[2026-10-20_customer-access-by-folder]] - OPEN: regional admins see only the folders Tier 1 ticks for them (view / edit), team inherits, NOO confirmed by the admin into his folders, area auto-filled from the pin + borders; P1 clean areas -> P2 access + rules -> P3 NOO confirm -> P4 change history; 5 questions
- [[2026-10-20_vault-screen-map-keys-on-top]] - DONE A (kpm 50ae2e0): the Journey map toolbar (and six other high layers) can paint over the Master Vault screen - same z 9999; A hide the app behind the gate (recommended) / B raise the gate above every number.
- [[2026-10-21_shop-card-lines]] - DONE A (kpm d3dfe63): Customer Directory shop cards get visible lines (today --line 1.3:1, invisible); A Bands (+8 px) / B Spec sheet (+33 px); both fix the ⋯ key pushed out by a long name.
- [[2026-10-23_presentation-experience-the-app]] - DECIDED A (guided mission in the real demo); 2026-10-24 step card OPEN: A corner card / B one line under the DEMO bar (recommended), board in Raw/2026-10-24-mission-card
- [[2026-10-31_terminal-arrival-flow]] - OPEN: status on arrival (reuse VISIT_TAGS), ORDER opens the terminal, Manifest slides from the left; closing = order (answered)
- [[2026-10-28_seat-limit-and-simplidots-gaps]] - DECIDED (owner = seat, locked keeps seat, extra Rp 400 rb), build next: seat limit per company (numbered seats enforced in rules, his landlord screen sets it); 3 seat questions; SimpliDOTS gaps ranked; price not re-opened
- [[2026-10-27_100-user-scale-fix-options]] - A LIVE 2026-10-27 18:5x (built kpm 740d614, Blaze on, his test passed): photos are ~93% of the bill; A (photos as files) Rp 76 rb/month at Cello's 25 users vs A+B Rp 16 rb; Blaze needed either way; corrects the 1.000-user figure to ~Rp 43,5 jt
- [[2026-10-24_pricing-and-b2b-engineering-business]] - OPEN: first customer = class 3 factory (Cello / Tawang); local public prices Rp 150-250 rb/user (Distri), Consensus: no paper has real prices; draft Rp 200 rb/user + pilot + setup; waiting on A/B/C + user count
- [[2026-10-28_kpm-vs-distri]] - OPEN: KPM vs Distri (distri.id) for Cello's 25 people, board https://claude.ai/artifact/DsChMVhYN8JZjcSQ6Cb1X1; Distri wider on the office (invoices, e-faktur, 50+ reports, ISO 27001), KPM deeper on the kretek van day (Bal/Slop/Bks, pita cukai, EOD fines, promo goods); Rp 10 jt = +Rp 45 jt/yr vs Distri Pro; 7 fixes ranked by money (Indonesian salesman words, safety sheet, factory view first)
- [[2026-11-02_salesman-today-rail]] - DECIDED A, BUILT kpm 1a1ca16: the Sales Terminal TODAY box (PC) adds every salesman's sales - a T5 paid Rp 750.000 sees Rp 4.780.000; A = only his own (recommended), B = rename "TEAM TODAY", board in Raw/2026-11-02-today-rail
- [[2026-11-02_beat-distri-simplidots]] - DECIDED A + B (C: more talk); A round 1 words board sent: one ranked list vs Distri + SimpliDOTS (A Indonesian salesman screens - recommended, B effective call + target per salesman, C factory sees its distributors; D-H smaller); fake-GPS corrected (a web app cannot see the mock flag); board in Raw/2026-11-02-beat-rivals
- [[2026-11-03_seven-reports-after-round-1b]] - OPEN (his rank): 7 reports diagnosed, no code - test account place (rack default HQ + frozen place), sidebar Utang (same-day payment thrown away), Journey chests (expedition.css shorthand), quarantine move (built refused), EOD seal 0.9 s, EXP after EOD, photo button -> paper
- [[2026-11-03_quarantine-way-out]] - OPEN (full or cheaper price?): way out #1 (convert -> promo -> van -> GIVE PROMO) already built end to end; #2 sell again = A regional Repair (full price, small) vs B a damaged-sellable stock lot (cheaper price, ~6 money screens); pita cukai caution
- [[2026-11-04_master-vault-and-three-bugs]] - C DONE kpm df7f807; OPEN: rank rule 1 or 2, then his Master Vault setting (S1), then A - C the Edit form saved HEADQUARTERS and every HQ test is exact-match, so his van reads an empty fake warehouse; B T1-T4 use the Master Vault wherever posted (no hardcoded Bandung); A the fill is old, SIMPAN TRANSAKSI wraps. Then the rank rule (R0-R2) and his Master Vault setting (S0-S2)
