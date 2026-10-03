---
title: Map of Content
description: Start here. Every Wiki page, organized by topic instead of a flat list — the front door to this vault.
type: moc
created: 2026-07-27
updated: 2026-07-27
tags: [moc, meta]
---

# Map of Content

**Open this page first.** Everything below is a real page in this vault, sorted by what it's
*about* rather than when it was written. For a plain A-Z list instead, see [[Index|Wiki Index]].

New to this vault? Read `CLAUDE.md` in the vault root for the full rulebook — short version:
`Raw/` holds untouched original sources, `Wiki/` is the readable layer built from them, and
this Wiki is a snapshot of *understanding*, not a live status page. For "is this actually
fixed/deployed right now," always check the real `kpm-inventory` git repo, not this vault.

---

## 🔒 Security & Permissions
- [[Concepts/A Hijacked UID Is Not an Identity]] — the uid hijack meets any per-person key: 2026-09-07 privilege escalation, both guards, and what it deliberately did NOT break.
- [[Concepts/POV Changes the Id, Never the Email]] — the preview's one blind spot: email-first lookups. 2026-09-08 agent inventory, the second instance still open, and why rewriting the email is the wrong repair.
- [[Concepts/A Retry Must Land Where the First Try Landed]] — 2026-09-08: the offline duplicate, and why losing a sale is worse than duplicating one.

How KPM decides who can read or write what, and where that's gone wrong.

- [[Firestore Rules]] — the server-side file that actually enforces access, separate from the UI.
- [[Fleet Captain Permission Gap]] — the #1 recurring bug: a check that covers Area Admin but forgets Fleet Captain.
- [[Terminal Tenant Path Split]] — the sales terminal wrote IOUs and new outlets into the salesman's own vault while reading the boss's. Works on the owner's account, broken for everyone it was built for.
- [[UI-Says-Yes-Server-Says-No Pattern]] — the general bug shape behind that gap: a button that works in the UI but silently fails at the database.
- [[Rank Config and Achievement Badges]] — a feature with two bugs, one fixed, one still open — the closest thing in KPM to a real "escalation" vulnerability.
- [[Rank Config Cross-Tenant Gap]] — the summary that names that open vulnerability precisely: one company's settings shared by every company.
- [[Fleet Captain Rule Gaps — Batch 1 and 2]] — the two batches of fixes for the recurring gap above, and how they nearly got lost on an unmerged branch.
- [[Option B Region Lock]] — locking roster create/delete to an admin's own region, plus a real "don't trust old memory, re-check the code" lesson.
- [[Customer Directory Permission Tier]] — a 3-level edit permission for the Customer Directory. *(Also an [[#🚨 Incidents|incident]] — its first version was nearly lost.)*
- [[Dead Weight Cleanup and Rules-Deploy Gap]] — 2026-07-27 re-check: rules deploy still the top open gap; also removed two console.logs that leaked a privilege-bypass path to devtools. Update: the cleanup's dependency removal broke the production build (`react-is`), fixed 2026-07-28.

## 🧭 Process & Discipline
- [[Concepts/Web Research When the Search Tools Die]] — the research fallback when every search tool fails: DuckDuckGo HTML + one JS line in the built-in browser.
- [[Concepts/A Mode Reminder Does Not Outrank Aldi]] — a standing decision of Aldi's beats an instruction injected mid-session; the 31-agent, 1.62M-token workflow that proved it, and the hook proposed to stop the next one.

- [[n8n Automation Templates Archive]] — a parts bin of 347 prebuilt automations, archived
- [[Skill Repos Evaluated 2026-08-25]] — the verdict table, so the same 19 links are not re-read
  locally. Read before building any integration by hand.

The house rules this project follows so mistakes don't repeat.

- [[Anti-Recurrence Check]] — never say "committed" without checking `git show --stat` yourself.
- [[The Named Path Was Already Shut]] — guard the WRITE, not the control someone noticed.
- [[The Rule That Never Applied]] — the CSS-shaped version of the same discipline: a Tailwind class, source order and a filled animation each beat a correct rule in one day. Measure the computed value, don't grep the source.
- [[Lift the Dialog, Never Push the Rest Down]] — a z-index move crosses every layer between the old number and the new one. The toast-over-dialog fix, the five reports the obvious fix would have silenced, and the layer map.
- [[Looking at the App]] — measuring is not looking. How to render a real KPM screen without the HTTPS dev server or a Google login, and why a new measuring tool is itself unverified until one of its readings is confirmed independently.
- [[Concepts/Looking Inside the App]] — 2026-09-08: http dev mode, seeded emulator, the vault opened as data, and the five checks holding the dev door shut.
- [[Sounds Come From Aldi]] — the audio version of the same discipline, and the sharpest example of a written lesson failing to prevent its own repeat. Every sound is a file he picked; three rounds were spent proving that, the third one after rounds 1 and 2 were already recorded in the source file being edited. Audibility cannot be verified here at all — `playSound` is gated behind a real user gesture the preview pane cannot produce.
- [[Draft-Then-Deploy Discipline]] — a Firestore rule change is only a draft until a human deploys it by hand.
- [[Rules Draft Process]] — the summary this discipline was built from: document a blocked fix, don't silently skip it.
- [[The KPM Control System]] — the shared button/panel/record classes every KPM screen should spend, and the Lite-Mode contract they keep.
- [[Off-Token Colour Migration Map]] — how a KPM screen moves off hardcoded Tailwind colours onto the theme tokens, and what proves it landed.
- [[Ponytail Philosophy]] — the lazy-but-correct coding style that governs how Claude Code writes real code here.
- [[Ponytail Philosophy Ingest]] — where that page's content actually came from.
- [[Claude Code CLI Install — McAfee Download Freeze]] — the CLI install got silently blocked by McAfee scanning the download; how it was diagnosed and worked around, plus the non-interactive ponytail marketplace install.
- [[Lancelot the Tobacco Ledger Agent]] — the bookkeeper agent for Aldi's separate tobacco business: which connector can actually write to Google Sheets, the arithmetic checks that catch a misread nota, and why receipt images are Drive links rather than embedded objects.

## 🏗️ Architecture
- [[Concepts/A Stored Name Is Not the Name of Record]] — render the id, not the snapshot string; and a decision to stop denormalising creates readers that are now wrong.
- [[Concepts/Email Is a Document ID, Not a Field]] — a field that is a Firestore path segment cannot be made optional.

The shape of the app everything else sits on top of.

- [[Multi-Tenant Architecture]] — one shared database, every company's data kept apart via the `bossUid` pattern.
- [[Tier System]] — the six role levels, from Developer down to Rookie, and how delegation works.
- [[KPM Project Facts Reference]] — the one-page cheat sheet covering both of the above, plus reusable patterns worth knowing.
- [[Gudang Pusat (Master Vault)]] — the main warehouse. One name on screen and on paper, and the identically-spelled routing value that must not follow it.
- [[Quarantine Chest]] — where damaged stock waits: the yellow crate and the warehouse box's healthy/Quarantine switch, screen by screen, and the one shared piece they reuse.
- [[The Place Registry]] — every factory and warehouse is a record with a fixed address, and a delivery form that can no longer invent a place by being typed into.
- [[Logistics and Stock Movement]] — **topic hub**: the factory→HQ→branch→van→store chain, which note answers which question, and the locked rules. Start here for anything about shipping, restock, transfers or stock levels.
- [[One Pack Count, Many Screens]] — karton, bal, slop and bks: the one converter every screen must use, why the boxes are a calculator rather than a second unit on the line, and the two screens that still hardcode the rate and miscount today.
- [[What Counts As Low]] — the one rule for "low stock" (own MIN. ALERT in Bks, else the company default of 3 Bal converted per product), the two settled answers (blank = company default; minStock is Bks), and the 2026-08-25→09-12 gap where the module shipped and four screens kept `|| 50` / `|| 5` — closed in `9b31bf0`.
- [[Creating a Store Is Not a Visit]] — the phantom `ANOTHER AGENT` banner on a store created today: the customer form stamped `lastVisit` without `lastVisitedBy`, and three screens read that as a visit; fixed at the writer in `8ed215f`, not at the banner.
- [[The Boss Is the Raw Firebase User]] — the owner got the field agent's camera lock on his own sales terminal: his `user` object is the raw Firebase auth user with no role, and one screen read the tier off it alone. The rule (tier comes from App as a prop, never from `user.*` alone), the guard, and the Stock Opname screen still open.
- [[A Cache Saying No]] — why the app showed ACCESS DENIED to its own owner for twenty seconds: Firestore answering a lookup from the local cache, and the rule that a negative from the cache is not evidence while a positive still is.
- [[The Eight Warehouse Gaps]] — what big warehouse operations do that KPM does not, ranked, with the build order. **Read before proposing anything about stock movement.**
- [[HQ-Initiated Stock Push]] — how HQ could send stock to a branch on purpose instead of waiting for a request: the verified PENDING→IN_TRANSIT→DELIVERED lifecycle, four options, the courier-vs-consignee trap, and the in-transit hole. **BUILT 2026-08-27 as option A** (see the summary below).
- [[A Ratio of Sums Is Not a Rate]] — a total divided by a total is only a rate if the things are interchangeable. Sebaran Stok shipped a warehouse "348 days left" whose real cover was 20, past 632 green checks.
- [[Headquarters Is Not a Cabang]] — Headquarters IS the master vault, so anything posted there reads an empty branch warehouse forever. Bit the Tujuan form (20c4a0a) and the POV test agent (b1cdcaa).
- [[A Feature Is Not Done Until the Book Knows]] — his rule, 2026-08-30: a new panel gets its own Ponder scene, a new column gets beats on the existing one, both in the sidebar section they are printed in.
- [[A Check Points at a File, Not at a Behaviour]] — source-scan checks bind to a PATH. Move the code and they keep asserting against the file it left; two went red for four days and nobody saw it.
- [[Ponder Tutorial System]] — an in-app tutorial per component, modelled on Create mod's Ponder: scripted scenes over fixed demo data, never video and never a live spotlight. **Slice 1 built 2026-08-27; all four of his questions answered and encoded as checks.**
- [[What Create Mod's Ponder Actually Does]] — the mechanics read out of Create's own source: every control, why its pause is really "Identify", why scrubbing only stops at authored keyframes, and the mutable-world constraint KPM does not have.
- [[An Effect's Own Cleanup Can Cancel Its Frame]] — a requestAnimationFrame scheduled in a React effect and killed by that effect's own cleanup. Twice in one session it deleted a whole feature with every check green and nothing thrown.

## 🎨 Design & Interface

What the app looks like, and what Aldi wants it to feel like.

- [[Aldi's Design Taste]] — what he actually likes and rejects, built only from real screens he judged. **Read before designing anything for him.**
- [[The Player Card]] — the EOD review as one card per salesman (the profile's head, the handover one line per part); the three stages.
- [[EOD Per-Part Verification]] — the money path under it: each part credited on its own ✓, a ✕ goes back with a reason, the night's XP at the last approval.
- [[Light Ground and the Theme Lab]] — the night light mode was finished: why a screen whose every panel was already converted still read as broken, and the two colour families the app was carrying at once.
- [[Master Vault Gate]] — the master-password screen every session starts at; its locked numbers and its closed decisions.
- [[Silent Failure Disease]] — his first law as a bug class: a screen that acts without saying so reads as broken.
- [[A Network Is Not The Internet]] — the flag lies by saying yes; ask the probe, never the browser.
- [[The Admin Agent Profile Id]] — the identity behind the shell's profile picture, and why it falls back to the Google photo.

## 📱 Phone & Device

- [[Secure Context Requirement]] — why the app worked on his PC and did nothing on his phone for months.
- [[A Resize Mid-Unlock Wiped the Name]] — Samsung: the keyboard closing after Enter rebuilt the dot grid and the unlock name never formed (2026-10-01).
- [[Brainstorm/2026-09-17_customers-di-hp]] — the Customers screen measured at 375; three fixes and one question open.
- [[Brainstorm/2026-09-18_agent-inventory-di-hp]] — the Agent Inventory measured at 375; both boards decided, shipped and CONFIRMED on his phone.
- [[Brainstorm/2026-09-18_customers-look-dan-badge-karantina]] — the Customers look, the Quarantine count and the sideways swipe: all B, shipped; the control system grew .kpm-key / .kpm-well / .kpm-stamp / .kpm-plate / .kpm-led.
- [[Brainstorm/2026-09-18_stock-opname-di-hp]] — OPEN, four boards sent: Stock Opname at 375 as T5 and as the boss — title wraps, 9–10 px labels, 21 px reel arrows, the boss's four tabs overlap and slide, 17 px pickers, names cut.
- [[Brainstorm/2026-09-19_journey-plan-di-hp]] — DECIDED 2026-09-19 (B / B / YES, kpm 056d8e3), boards: Journey Plan at 375 as T5 and as the boss — the page slides sideways 12 px (path row + sector reel), 30 px / 13 px pickers at 10 px, 383 px store cards; board 1 top card A/B (fold), board 2 store card A/B (⋯ fold), board 3 path row YES/NO
- [[Brainstorm/2026-09-21_player-card-stage-b]] — 🔴 OPEN, two boards sent 2026-09-21: the player card's HEAD on the Agent Profile (board 1 — A: the head replaces the hero and the OMSET box, keys wrap at 44 / B: the box stays) and the XP gain on the salesman's EOD panel (board 2 — the nixie +51, then A the ladder bar / B the working rows / C the 5.614 → 5.665 figure). The profile measured at 375: the boss's key row slides the page 95 px sideways, a nested scroller, 20 labels at 10 px.
- [[Brainstorm/2026-09-22_pc-review-card-and-inventory-strip]] — ✅ DECIDED A + A 2026-09-22, shipped kpm 20aac21: the review card open on the PC and the Agent Inventory strip at xl.
- [[Brainstorm/2026-09-22_fleet-van-loading-shape]] — 🔴 OPEN, two boards sent 2026-09-22 (phone + PC): where the van-loading job lives — A a panel inside Fleet & Roster (recommended) / B its own sidebar segment; the same basket in both, and handleLoadCanvas / handleClearCanvas untouched either way.
- [[Brainstorm/2026-09-18_customers-round-two-phone]] — Customers round two: the boss's header is the sideways cause, DEL/EDIT behind ⋯, a hold that is not the pad's lamp; sideways gone (scrollWidth 521 → 375), desk unchanged.
- [[Brainstorm/2026-09-17_sales-terminal-di-hp]] — the Sales Terminal measured at 375 in the real shell; the two fixes on the table.
- [[Brainstorm/2026-10-02_phone-sweep-last-five]] — the phone sweep's last five screens (Reports, Leaderboard, Command Center, Map, Settings) measured at 390 and ranked; OPEN on his pick.
- [[Fat Documents in a Live Listener]] — why registering an outlet froze his phone and nothing on a desktop: a fat field plus a collection listener, and one write costs megabytes.
- [[Six Days — Gate, Phone Access, Quota Meter]] — the backfill covering 2026-08-04 → 2026-08-10, including how phone access was finally fixed.

## 🚨 Incidents

Real things that went wrong (or nearly did), and what was learned.

- [[Git Worktrees]] — the git feature behind three separate near-losses of finished work.
- [[Lost Work in Worktrees — Three Incidents]] — the full story of all three, back to back.
- [[Offline Login Lockout Fix]] — refreshing the page offline could show a real employee a false "Access Denied."
- [[Customer Directory Permission Tier]] — incident #1 of the three above: this feature's first landing attempt was the one that got lost.

---

## Elsewhere in this vault
- [[Summaries/Tembakau - Cara Kerja Pohon dan Cek Riset Gemini]] — tobacco plant physiology and a fact-check of Gemini's 2026 rajangan chat.
- [[Summaries/Tembakau Rajangan 2026 - Panas, Aroma Tipis, Imbon Molor]] — the family tobacco business: 2026 rajangan research (hot smoke, thin aroma, slow imbon), verified and drawn as a page.

- [[Index|Wiki Index]] and [[Log|Wiki Log]] — the flat catalog and the append-only build history, mainly for AI queries.
- [[Concepts/A Store Name Is Not a Store]] — identity vs label, and the hand-off it broke.
- [[Concepts/Ecer Is a Person, Not a Shop]] — Ecer is an individual; consignment is for registered shops only.
- [[Concepts/Ownership Moves, History Does Not]] — the transfer rule Aldi settled 2026-09-05: receiver view-only, seller keeps edit, both still see the store.
- `Backlog/` and `Brainstorm/` — a separate to-do board and scratch space for open work. Not part of this knowledge graph by design (see `CLAUDE.md`) — open `Backlog/` directly to see what's next.
- `PLAN-second-brain-integration.md` — why this vault exists and how it's meant to be maintained.
- [[Concepts/Where KPM Is Going]] — START HERE: the theme, every locked decision, and the direction.
- [[Concepts/A Meter That Exits Silently Is Not a Meter]] — why nothing stopped the session at 95%, the Stop hook that now guards both notes, and the decoy config file that hid the real fault until 2026-08-31.
- [[Concepts/The Shell Repaints Any White It Can Reach]] — a shell rule painted the printed nota fifteen per cent see-through; the harness that could not reproduce it was missing the ancestor.
- [[Concepts/A Smooth Scroll That Never Runs]] — the phone-only tutorial caption bug: the wrong diagnosis, the measurement that separated them, and why the bottom bar IS the phone layout.
- [[Summaries/The Camera Was Aimed at the Wrong Scroller]] — the sequel on the same call: one tutorial for both widths, why `block:'nearest'` stops too early, and which element actually owns sideways movement.
- [[Concepts/The Book as a Stack of Sheets]] — the Framer-model rebuild of the tutorial book, the arithmetic that put the chapters on the leaves, and the two width-specific faults a render caught.
- [[Brainstorm/2026-09-02_phone-tutorial-shell]] — 🔴 OPEN: four candidate phone shells for the tutorial, drafted for him to operate. The PC half is decided — keep the book, drop the riffle.
- [[Brainstorm/2026-09-15_nota-scan-dan-lacak-tanggal-produksi]] — 🔴 OPEN: two feature asks from the phone sweep. (1) Nota photo scanned CamScanner-style: A clean-up only (~80 lines, no dependency, recommended first) / B full straighten via OpenCV.js (~8 MB) / C cloud (rejected, offline rule). (2) Goods tracked by production date through HQ → branch → van → store: the batch is written at intake today and never travels; A full lot stock / B FIFO ledger on the paper / C the person records the date that left (recommended first). The shaping question: does the system decide which lot left, or the person?
- [[Brainstorm/2026-09-06_handoff-approval-region-matrix]] — 🔴 OPEN: who gets the hand-off approval bell, and for which regions. Three options priced; the data shape and the default are decided, the replace-vs-add question is his. The SENDING half already shipped (`dace958`).
- [[Brainstorm/2026-09-08_shipping-readiness]] — what "no bugs" has to mean before KPM is sold: the 30 September deadline, the fix order (money lies > data loss > branch leaks > day one > appearance), and what was ruled out.
- [[Brainstorm/2026-09-09_day-one-walk]] — 🔴 OPEN: the day-one customer walk on an empty tenant, desktop and phone. All seven onboarding paths complete; one money finding needs his answer (does a Titip placement count towards OMZET before the audit says it sold?), and the day-one list under it is ranked and unblocked.
- [[Concepts/Revenue Recognition — Titip waits for the cash]] — ✅ DECIDED and SHIPPED (`a6192b1`): a Titip placement books no omzet and no "sold Bks"; the store audit books what the shop actually paid for, and the receivable gets its own line beside the omzet. Also why the same rule existed correctly in one screen and wrongly in seven.
- [[Concepts/A sale is a closed contract — no cash goes back]] — ✅ DECIDED and SHIPPED: the company never refunds; a retur is the agent buying stock back with his own money. Buyback is off for everyone including the owner, Exchange stays. Explains why no company total moves on a retur, and why `returnTotal` is read by nothing.
- [[Concepts/Handoff Eligibility]] — who may receive a consignment store and who may approve the hand-off; the matrix key per branch, and why absence of a key must mean "tier default".
- [[Concepts/The Cross-Site Login Block]] — why Google sign-in worked on localhost and failed on every deployed address, and the three theories that died on the way.
- [[Concepts/A Named Import Can Shadow a Global]] — module scope beats the global object, and the failure is a blank screen rather than a red build.
- [[Summaries/Stock Count Trust Chain]] — how a count becomes trustworthy: tolerance, recount, cause, leak detection. The one open decision is naming the five shortage causes.
- [[Summaries/The Shorter List Was Never the Eligible One]] — a permission predicate and a too-long list looked like the same fix and were not, plus what a view filter must never be allowed to become.
- [[Summaries/The Panel That Never Reads a Transaction]] — a money mis-statement whose fix is nowhere near the screen that shows it, the trap waiting in every rollup month already written, and the day the app first went online for friends to see.
- [[capture=environment Is a Request, Not a Lock]] — the HTML attribute that looks like it forces a camera and is ignored on desktop; the tier rule for sale-proof photos built on top of it, and why the enforcement is that a field tier has no file input in the DOM at all.
- [[2026-09-09_pricing-kpm-for-the-first-customer]] — what KPM should cost in Indonesia, measured comps (Accurate, Mekari Jurnal, Badger Maps), what it costs to run, five pricing options for the uncle, the features no comparable product has, and the selling strategy. DECISION OPEN.
- [[2026-09-09_menjual-kpm-penjelasan-indonesia]] — the Indonesian explainer: three licence types, what maintenance covers and what it does not, 13 contract clauses, the 7-step sales process. Its legal half was marked unresearched and is now closed by the note below.
- [[2026-09-10_riset-hukum-menjual-kpm]] — the legal research, with a source per number: PT Perorangan (PP 8/2021, PNBP Rp 50.000), PPh 23 at 2% vs 15% and why the contract wording decides it, PP 20/2026 removing the 0,5% time limit, the Rp 4,8 miliar PKP threshold, UU 28/2014 Pasal 36/40/80/83, KUHPerdata 1247/1248/1249/1338 on liability caps, and escrow as penitipan under 1694–1696.
- [[2026-09-10_pricing-revisi-50-100-user]] — Aldi named the real user count, 50-100. That supersedes the Rp 2,5 juta figure, which was computed for 10-30. New bands (Rp 4/7/12 juta), perpetual licence at Rp 600 juta, and the arithmetic showing perpetual costs the BUYER more over five years.
- [[KPM Price Sheet]] — **the canonical numbers.** Rp 5 juta/bulan at 25-30 users, Rp 2,5 juta pilot, floor Rp 2 juta, perpetual Rp 250 juta, copyright Rp 5 miliar, final PPh Rp 0. Read this for a price; read the Brainstorm notes only for the reasoning, they carry superseded figures.
- [[2026-09-10_draft-13-pasal-kontrak-kpm]] — the 13 clauses written as real pasal, ready for a notaris to mark up. DRAF — not reviewed, do not sign.
