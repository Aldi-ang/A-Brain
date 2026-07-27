---
title: Wiki Index
description: Flat A-Z catalog of every Wiki page — the reference list. For browsing by topic, start at Wiki/MOC.md instead.
type: index
created: 2026-07-27
updated: 2026-07-27
---

# Wiki Index

A flat catalog of every page, grouped by type — good for "does a page on X exist?" lookups
and for AI queries (see `CLAUDE.md`). **New here? Start at [[MOC|the Map of Content]]
instead** — it's the same pages, organized by topic instead of by list. Reminder: this
catalog describes *understanding*, not current live status. For "is X actually
deployed/fixed right now," check the real `kpm-inventory` git repo, not this page.

## Entities (specific things)

- [[Multi-Tenant Architecture]] — the `bossUid` per-company data pattern
- [[Tier System]] — the six-tier role hierarchy (`DEVELOPER` → `ROOKIE`)
- [[Firestore Rules]] — the server-side enforcement layer, and its draft-vs-live split
- [[Fleet Captain Permission Gap]] — the #1 most recurring bug class (`isAreaAdmin()` never
  covering `FLEET_CAPTAIN`)
- [[Rank Config and Achievement Badges]] — a feature with two distinct real bugs: zero rule
  coverage (fixed), and a cross-tenant shared document (open, documented)
- [[Git Worktrees]] — the tool behind three real lost-work incidents

## Concepts (recurring patterns)

- [[UI-Says-Yes-Server-Says-No Pattern]] — a UI control shown without a matching server rule
- [[Anti-Recurrence Check]] — never claim "committed" without `git show --stat` proof
- [[Draft-Then-Deploy Discipline]] — rules changes are always draft until manually deployed
- [[Ponytail Philosophy]] — the minimal-code discipline governing how the real repo gets
  edited

## Summaries (one per ingested source, newest ingest pass first)

- [[KPM Project Facts Reference]] — the delegate-coding-task skill's KPM facts doc
- [[Fleet Captain Rule Gaps — Batch 1 and 2]] — two batches of fixes, their unmerged-branch
  scare, and their eventual real-PR merge
- [[Rank Config Cross-Tenant Gap]] — the closest real match to a rules "escalation"
  vulnerability in this codebase
- [[Lost Work in Worktrees — Three Incidents]] — Customer Directory, NOO fix, build-check.yml
- [[Customer Directory Permission Tier]] — the feature behind worktree incident #1
- [[Offline Login Lockout Fix]] — false Access Denied on offline refresh
- [[Option B Region Lock]] — Area Admin/Fleet Captain roster region-locking, plus a real
  stale-memory lesson
- [[Rules Draft Process]] — the source behind Draft-Then-Deploy Discipline
- [[Ponytail Philosophy Ingest]] — the source behind Ponytail Philosophy

## Known gaps (honest, not filled in yet)

- No Entity page for offline/PWA behavior generally — [[Offline Login Lockout Fix]] didn't
  cleanly fit any existing Entity. Worth an "Offline & PWA Behavior" page in a future ingest
  pass if more offline-related material comes in.
- This first pass focused on permissions/Firestore-rules material (where this project's real
  incident history is richest) and the worktree/process incidents. Feature-level knowledge
  (how Fleet & Canvas, Stock Opname, EOD Reconciliation etc. actually work end-to-end) isn't
  covered yet — a good candidate for the next ingest pass.
