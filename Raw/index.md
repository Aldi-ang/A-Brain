---
title: "Raw — Index"
description: Folder index for Raw/ — immutable original sources. Added as part of PLAN-A-Brain-agentic-OS task 2.3.
type: index
created: 2026-07-27
updated: 2026-07-27
tags: [index, raw]
---

# Raw

Immutable original sources — session transcripts, reports, real commit messages. **Never
edited after creation** except for display-only frontmatter (title/description/tags), per
[[../CLAUDE.md|CLAUDE.md]]. If it's here, it's a primary source; every claim in
[[../Wiki/Summaries/index|Wiki/Summaries]] should trace back to one of these.

## Files here (as of 2026-07-27)

- `2026-07-24_source_offline-auth-lockout-fix.md`
- `2026-07-24_source_option-b-region-lock.md`
- `2026-07-24_source_rules-draft-process.md`
- `2026-07-25_source_customer-directory-permission-tier.md`
- `2026-07-25_source_noo-audits-fix-and-worktree-incident.md`
- `2026-07-26_source_batch1-permissions-fix.md`
- `2026-07-26_source_batch12-pr3-merged.md`
- `2026-07-26_source_batch2-unmerged-discovery.md`
- `2026-07-26_source_firestore-rules-excerpts.md`
- `2026-07-26_source_verify-before-claiming-committed.md`
- `2026-07-26_source_worktree-recovery-git-log.md`
- `2026-07-27_source_ponytail-rulebook-excerpt.md`
- `2026-07-source_kpm-inventory-facts-reference.md`

## Files here (added 2026-08-10)

- `2026-08-10_source_kpm-six-days-aug04-to-aug10.md` — the six-day backfill: 178 commits,
  Aldi's verbatim reports, the mistakes made, and the decisions he closed.

## Files here (added 2026-08-14)

- `2026-08-14_source_desk-rail-cascade-and-torch.md` — commit `9e975aa` verbatim plus the
  `.claude/PROGRESS.md` 13:20 WIB section: the filled-animation cascade trap, the torch/arch
  % + px overlap, and his open "more balance and more organic" design question.

## Files here (added 2026-08-15)

- `2026-08-15_source_header-dock-ship-webauthn.md` — commit log + `.claude/PROGRESS.md`
  00:00–08:15 WIB entries: the desk header/dock shipped and approved, the phone's duplicate-totem
  media-query gap, the `grid-auto-rows: minmax(0,1fr)` definite-height trap, and the WebAuthn
  hostname-lock explanation for biometric.

Naming convention observed: `YYYY-MM-DD_source_short-slug.md`. Keep using it for new sources
so files sort chronologically by filename.

## Adding a new source

Step 1 of the `ingest` operation in [[../CLAUDE.md|CLAUDE.md]]: save here untouched, then
write the paired [[../Wiki/Summaries/index|Summary]] page.
