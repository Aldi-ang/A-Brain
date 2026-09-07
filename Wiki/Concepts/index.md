---
title: "Concepts — Index"
description: Folder index for Wiki/Concepts — recurring patterns seen across the KPM app. Added as part of PLAN-A-Brain-agentic-OS task 2.3.
type: index
created: 2026-07-27
updated: 2026-08-27
tags: [index, wiki, concepts]
---

# Wiki/Concepts

Recurring patterns, as opposed to [[../Entities/index|Entities]], which are specific named
things. Per [[../../CLAUDE.md|CLAUDE.md]]'s vault map: "recurring patterns:
UI-Says-Yes-Server-Says-No Pattern, Anti-Recurrence Check, Ponytail Philosophy."

For the authoritative flat catalog, always check [[../Index]] first.

## Pages here

- [[A CSS Animation Outranks Your Inline Style]]
- [[A Rect Is Painted, Not Laid Out]]
- [[Aldi's Design Taste]]
- [[Anti-Recurrence Check]]
- [[Draft-Then-Deploy Discipline]]
- [[Fat Documents in a Live Listener]]
- [[Lancelot the Tobacco Ledger Agent]]
- [[Looking at the App]]
- [[Off-Token Colour Migration Map]]
- [[Ponytail Philosophy]]
- [[The KPM Control System]]
- [[The Rule That Never Applied]]
- [[Secure Context Requirement]]
- [[Silent Failure Disease]]
- [[UI-Says-Yes-Server-Says-No Pattern]]
- [[A Store Name Is Not a Store]] — several shops share a name 14.5 km apart; a name is a label, never a selector.

## Why these matter beyond KPM

Several of these are flagged in [[../../PLAN-A-Brain-agentic-OS|PLAN-A-Brain-agentic-OS]]'s
transferability split as **Universal** — they're the kind of lesson worth carrying into any
future project, not just KPM. Worth checking this folder first when starting work on a
different app.

## Adding a new concept

Same three-place rule as [[../Entities/index|Entities]]: frontmatter, link here, link in
[[../Index]], link in the right section of [[../MOC]].

- [[The Named Path Was Already Shut]] — a brief named one submit button; the two it did not name were the actual double-submit.
- [[A Network Is Not The Internet]] — navigator.onLine says a network exists, not that packets arrive; it froze a completed sale.
- [[Concepts/Where KPM Is Going]] — START HERE: the theme, every locked decision, and the direction.

- [[The Eight Warehouse Gaps]] — what big warehouse operations do that KPM does not, ranked, with the build order. **Read before proposing anything about stock movement.**
- [[HQ-Initiated Stock Push]] — how HQ could send stock to a branch on purpose instead of waiting for a request: the verified PENDING→IN_TRANSIT→DELIVERED lifecycle, four options, the courier-vs-consignee trap, and the in-transit hole. **BUILT 2026-08-27 as option A** (see the summary below).
- [[A Ratio of Sums Is Not a Rate]] — a total divided by a total is only a rate if the things are interchangeable. Sebaran Stok shipped a warehouse "348 days left" whose real cover was 20, past 632 green checks.
- [[Headquarters Is Not a Cabang]] — Headquarters IS the master vault, so anything posted there reads an empty branch warehouse forever. Bit the Tujuan form (20c4a0a) and the POV test agent (b1cdcaa).
- [[A Feature Is Not Done Until the Book Knows]] — his rule, 2026-08-30: a new panel gets its own Ponder scene, a new column gets beats on the existing one, both in the sidebar section they are printed in.
- [[A Check Points at a File, Not at a Behaviour]] — source-scan checks bind to a PATH. Move the code and they keep asserting against the file it left; two went red for four days and nobody saw it.
- [[Ponder Tutorial System]] — an in-app tutorial per component, modelled on Create mod's Ponder: scripted scenes over fixed demo data, never video and never a live spotlight. **Slice 1 built 2026-08-27; all four of his questions answered and encoded as checks.**
- [[What Create Mod's Ponder Actually Does]] — the mechanics read out of Create's own source: every control, why its pause is really "Identify", why scrubbing only stops at authored keyframes, and the mutable-world constraint KPM does not have.
- [[An Effect's Own Cleanup Can Cancel Its Frame]] — a requestAnimationFrame scheduled in a React effect and killed by that effect's own cleanup. Twice in one session it deleted a whole feature with every check green and nothing thrown.
- [[A Meter That Exits Silently Is Not a Meter]] — the 5-hour plan-quota hook warned at 70/85/95 and said nothing for weeks. **Fixed 2026-08-31**: every session was editing a decoy config file one folder away from the one the hook opens, and the meter itself reported a fully spent bucket as "1% used".
- [[The Shell Repaints Any White It Can Reach]] — the surat jalan printed fifteen per cent see-through because one rule in the app shell darkens every plain `.bg-white` under it. Plus the two harness traps — a missing ancestor, and a preview pane with a frozen clock — that made the report unreproducible.
- [[A Smooth Scroll That Never Runs]] — six Ponder beats covered the row they explained at 375px. It looked like a missing clamp for a whole session; `scrollIntoView` with `behavior:'smooth'` was moving the stage by zero. **Fixed 2026-08-31, 78 beat renders clean.**

- [[Logistics and Stock Movement]] — **topic hub**: the factory→HQ→branch→van→store chain, which note answers which question, and the locked rules. Start here for anything about shipping, restock, transfers or stock levels.
- [[One Pack Count, Many Screens]] — karton, bal, slop and bks: the one converter every screen must use, why the boxes are a calculator rather than a second unit on the line, and the two screens that still hardcode the rate and miscount today.
- [[A Cache Saying No]] — why the app showed ACCESS DENIED to its own owner for twenty seconds: Firestore answering a lookup from the local cache, and the rule that a negative from the cache is not evidence while a positive still is.
- [[The Book as a Stack of Sheets]] — the tutorial book rebuilt on the Framer interactive-book technique: the four things that make a page a sheet, why the leaves had to become the chapters, and why a phone turns to -90 instead of -180. **Built 2026-09-01, his judgement still owed.**
- [[A Named Import Can Shadow a Global]] — `new Map()` built a lucide icon instead of a hash map. Green build, 1,693 checks green, black screen.
- [[Sounds Come From Aldi]] — every sound in KPM is a file he picked. Three rounds have been lost to inventing one instead, the third *after* the first two were written down in the file that was open. Also the ffmpeg method that works, and why audibility can never be proven from here.

- [[Ownership Moves, History Does Not]] — a store hand-off used to overwrite the seller on every past sale to move the debt. The rows keep their author now; ownership moved to the store record instead. Includes why the rewrite could not just be deleted.
- [[Handoff Eligibility]] — who may receive a consignment store, who may approve it, and the branch-per-tier matrix behind both.
- [[The Cross-Site Login Block]] — sign-in worked on localhost, failed deployed; the app and the auth handler were two different sites.
- [[Concepts/A Mode Reminder Does Not Outrank Aldi]] — a standing decision of Aldi's beats an instruction injected mid-session; the 31-agent, 1.62M-token workflow that proved it, and the hook proposed to stop the next one.

- [[A Stored Name Is Not the Name of Record]] — a transaction freezes the Google account name; Fleet & Roster is the name of record, and the agent id on the row is the only way back to it. Also why the hand-off left every "who manages this" reader naming the previous agent.
- [[Email Is a Document ID, Not a Field]] — which required fields are structural and which are tidiness, and the duplicate check that silently breaks when you relax one.
