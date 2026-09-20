---
title: "Entities — Index"
description: Folder index for Wiki/Entities — specific things about the KPM app (systems, bugs, features). Added as part of PLAN-A-Brain-agentic-OS task 2.3.
type: index
created: 2026-07-27
updated: 2026-07-27
tags: [index, wiki, entities]
---

# Wiki/Entities

Specific, named things about the KPM app — as opposed to [[../Concepts/index|Concepts]],
which are recurring patterns. Per [[../../CLAUDE.md|CLAUDE.md]]'s vault map: "specific things:
Firestore Rules, Tier System, Multi-Tenant Architecture, specific bugs/features."

For the authoritative flat catalog, always check [[../Index]] first — this file is a
folder-level map, not a replacement for it.

## Pages here

- [[Firestore Rules]]
- [[Fleet Captain Permission Gap]]
- [[Git Worktrees]]
- [[Master Vault Gate]]
- [[Multi-Tenant Architecture]]
- [[Gudang Pusat (Master Vault)]]
- [[The Place Registry]]
- [[Rank Config and Achievement Badges]]
- [[EOD Per-Part Verification]]
- [[Terminal Tenant Path Split]]
- [[The Admin Agent Profile Id]]
- [[Tier System]]

## Adding a new entity

Per the `ingest` operation in [[../../CLAUDE.md|CLAUDE.md]]: give it frontmatter
(`title`, `description`, `created`, `updated`, `tags`), link it from here, from [[../Index]],
and from the right section of [[../MOC]]. A page missing from any of those three is an orphan.
- [[KPM Price Sheet]] — the canonical numbers for selling KPM: Rp 5 juta/bulan at 25-30 users, floor Rp 2 juta, perpetual Rp 250 juta, final PPh Rp 0. Read this for a price, not the Brainstorm notes.
- [[What Counts As Low]] — the one rule for "low stock" (own MIN. ALERT in Bks, else the company default of 3 Bal converted per product), the two settled answers (blank = company default; minStock is Bks), and the 2026-08-25→09-12 gap where the module shipped and four screens kept `|| 50` / `|| 5` — closed in `9b31bf0`.
- [[Creating a Store Is Not a Visit]] — the phantom `ANOTHER AGENT` banner on a store created today: the customer form stamped `lastVisit` without `lastVisitedBy`, and three screens read that as a visit; fixed at the writer in `8ed215f`, not at the banner.
- [[The Boss Is the Raw Firebase User]] — the owner got the field agent's camera lock on his own sales terminal: his `user` object is the raw Firebase auth user with no role, and one screen read the tier off it alone. The rule (tier comes from App as a prop, never from `user.*` alone), the guard, and the Stock Opname screen still open.
