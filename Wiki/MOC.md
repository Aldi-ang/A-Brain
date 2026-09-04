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

- [[n8n Automation Templates Archive]] — a parts bin of 347 prebuilt automations, archived
- [[Skill Repos Evaluated 2026-08-25]] — the verdict table, so the same 19 links are not re-read
  locally. Read before building any integration by hand.

The house rules this project follows so mistakes don't repeat.

- [[Anti-Recurrence Check]] — never say "committed" without checking `git show --stat` yourself.
- [[The Named Path Was Already Shut]] — guard the WRITE, not the control someone noticed.
- [[The Rule That Never Applied]] — the CSS-shaped version of the same discipline: a Tailwind class, source order and a filled animation each beat a correct rule in one day. Measure the computed value, don't grep the source.
- [[Looking at the App]] — measuring is not looking. How to render a real KPM screen without the HTTPS dev server or a Google login, and why a new measuring tool is itself unverified until one of its readings is confirmed independently.
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

The shape of the app everything else sits on top of.

- [[Multi-Tenant Architecture]] — one shared database, every company's data kept apart via the `bossUid` pattern.
- [[Tier System]] — the six role levels, from Developer down to Rookie, and how delegation works.
- [[KPM Project Facts Reference]] — the one-page cheat sheet covering both of the above, plus reusable patterns worth knowing.
- [[Gudang Pusat (Master Vault)]] — the main warehouse. One name on screen and on paper, and the identically-spelled routing value that must not follow it.
- [[The Place Registry]] — every factory and warehouse is a record with a fixed address, and a delivery form that can no longer invent a place by being typed into.
- [[Logistics and Stock Movement]] — **topic hub**: the factory→HQ→branch→van→store chain, which note answers which question, and the locked rules. Start here for anything about shipping, restock, transfers or stock levels.
- [[One Pack Count, Many Screens]] — karton, bal, slop and bks: the one converter every screen must use, why the boxes are a calculator rather than a second unit on the line, and the two screens that still hardcode the rate and miscount today.
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
- [[Light Ground and the Theme Lab]] — the night light mode was finished: why a screen whose every panel was already converted still read as broken, and the two colour families the app was carrying at once.
- [[Master Vault Gate]] — the master-password screen every session starts at; its locked numbers and its closed decisions.
- [[Silent Failure Disease]] — his first law as a bug class: a screen that acts without saying so reads as broken.
- [[A Network Is Not The Internet]] — the flag lies by saying yes; ask the probe, never the browser.
- [[The Admin Agent Profile Id]] — the identity behind the shell's profile picture, and why it falls back to the Google photo.

## 📱 Phone & Device

- [[Secure Context Requirement]] — why the app worked on his PC and did nothing on his phone for months.
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

- [[Index|Wiki Index]] and [[Log|Wiki Log]] — the flat catalog and the append-only build history, mainly for AI queries.
- [[Concepts/A Store Name Is Not a Store]] — identity vs label, and the hand-off it broke.
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
- [[Concepts/A Named Import Can Shadow a Global]] — module scope beats the global object, and the failure is a blank screen rather than a red build.
- [[Summaries/Stock Count Trust Chain]] — how a count becomes trustworthy: tolerance, recount, cause, leak detection. The one open decision is naming the five shortage causes.
