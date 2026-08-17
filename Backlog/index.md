---
title: "Backlog — Index"
description: Folder index for Backlog/ — Kanban board of KPM tasks via Obsidian Bases. Pre-existing, separate from the Wiki ingest system. Added as part of PLAN-A-Brain-agentic-OS task 2.3.
type: index
created: 2026-07-27
updated: 2026-07-27
tags: [index, backlog]
---

# Backlog

Kanban-style task tracking for KPM work, viewed through `Backlog.base` (an Obsidian Base with
To Do / Ready to Deploy / Parked / Done views, filtered on each note's `status` field). Per
[[../CLAUDE.md|CLAUDE.md]], this is "separate, pre-existing, unrelated to [the Wiki ingest]
system" — it's a task tracker, not a knowledge page, so it doesn't go through `ingest`.

## Items here (as of 2026-07-27)

| Item | Status |
|---|---|
| Add production_targets Firestore rule | (see file) |
| Business and UX improvement testing session | To Do — scheduled 2026-07-28 |
| Chunk handleAdminApproveTransfer | To Do |
| Crown Transfer (Option A) | Parked — waiting on a conversation with the company boss |
| Deploy firestore.rules to production | Ready to Deploy |
| Merge Batch 1+2 fixes into main | Done |
| NOO approval notification fix | Done |
| NOO registration crash fixes | Done |
| Offline auth lockout fix | Done |
| Rank Config and Achievement Badges redesign | Parked |
| Remove unused code and dependencies | Ready to Deploy — PR open, react-is regression fixed |
| Top panel background and UI redesign | To Do — added 2026-08-14. Same file also holds the record of the PC sidebar, which SHIPPED as `16c8ff9` after the video reference was read frame by frame |
| Phone ribbon position must survive logout | To Do — added 2026-08-14; already in localStorage, so find what clears it |
| **Offline sales never reduce the van stock** | **To Do — HIGH**, added 2026-08-17 from the logic review. Costs stock AND blames the agent |
| **Returning consignment goods can corrupt the stock count** | **To Do — HIGH**, added 2026-08-17. Unit not converted: 2 Slop adds 2 packs |
| A sale can be booked to the wrong store | To Do — Medium, added 2026-08-17. Partial name match wins over the exact one |
| **Two different debt numbers for the same store** | **To Do — HIGH**, added 2026-08-17. Both shown on one screen; returns reduce only one |
| **Approving a stock count erases everything since the count** | **To Do — HIGH**, added 2026-08-17. HQ approval overwrites today's sales and EOD returns |
| **Goods given back during a payment never reduce what the store owes** | **To Do — HIGH**, added 2026-08-17. `returnTotal` is written and never read — customers are overcharged |
| **The pack-size maths is copy-pasted in six places and they disagree** | **To Do — HIGH**, added 2026-08-17. Root cause behind several stock bugs; two of the six copies are wrong |
| **Clear Canvas can create stock out of thin air** | **To Do — HIGH**, added 2026-08-17 second pass. Credits the warehouse from the admin's stale screen data |
| **Everything is linked by name instead of by id** | **To Do — HIGH**, added 2026-08-17 second pass. Root cause under three other flaws; step 1 of the fix is cheap and stops it growing |
| Some failures are hidden from the user completely | To Do — Medium, added 2026-08-17 second pass. Two empty catches after an optimistic screen update |
| Finish the logic review — screens not checked yet | To Do — Medium, added 2026-08-17. Journey, Map, Customers still unread. Fleet Canvas now done — it held 2 flaws |
| Check every UI permission against the database rules | To Do — Medium, added 2026-08-17. A check to run, not a bug found — the rules are a mixture of matrix-driven and role-locked |

This table is a snapshot, not live — open `Backlog.base` in Obsidian for current status, since
items here move between columns over time and this index won't auto-update.

## Relationship to the Wiki

Some Backlog items correspond to real Wiki pages once resolved — e.g. the merged Batch 1+2 fix
is documented in [[../Wiki/Summaries/Fleet Captain Rule Gaps — Batch 1 and 2]] and
[[../Wiki/Entities/Fleet Captain Permission Gap]]. Backlog tracks the doing; the Wiki captures
the understanding after the fact.
