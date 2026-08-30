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
- [[A Check Points at a File, Not at a Behaviour]] — source-scan checks bind to a PATH. Move the code and they keep asserting against the file it left; two went red for four days and nobody saw it.
- [[Ponder Tutorial System]] — an in-app tutorial per component, modelled on Create mod's Ponder: scripted scenes over fixed demo data, never video and never a live spotlight. **Slice 1 built 2026-08-27; all four of his questions answered and encoded as checks.**
- [[What Create Mod's Ponder Actually Does]] — the mechanics read out of Create's own source: every control, why its pause is really "Identify", why scrubbing only stops at authored keyframes, and the mutable-world constraint KPM does not have.
- [[An Effect's Own Cleanup Can Cancel Its Frame]] — a requestAnimationFrame scheduled in a React effect and killed by that effect's own cleanup. Twice in one session it deleted a whole feature with every check green and nothing thrown.

- [[Logistics and Stock Movement]] — **topic hub**: the factory→HQ→branch→van→store chain, which note answers which question, and the locked rules. Start here for anything about shipping, restock, transfers or stock levels.
