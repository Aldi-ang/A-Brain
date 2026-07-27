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

This table is a snapshot, not live — open `Backlog.base` in Obsidian for current status, since
items here move between columns over time and this index won't auto-update.

## Relationship to the Wiki

Some Backlog items correspond to real Wiki pages once resolved — e.g. the merged Batch 1+2 fix
is documented in [[../Wiki/Summaries/Fleet Captain Rule Gaps — Batch 1 and 2]] and
[[../Wiki/Entities/Fleet Captain Permission Gap]]. Backlog tracks the doing; the Wiki captures
the understanding after the fact.
