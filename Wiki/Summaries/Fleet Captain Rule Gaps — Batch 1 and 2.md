---
title: Fleet Captain Rule Gaps — Batch 1 and 2
description: Two batches of permission fixes, their scary unmerged-branch moment, and their eventual real PR merge.
type: summary
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
tags: [ingest, incident, permissions, firestore]
source: "[[../../Raw/2026-07-26_source_batch1-permissions-fix.md]], [[../../Raw/2026-07-26_source_batch2-unmerged-discovery.md]], [[../../Raw/2026-07-26_source_batch12-pr3-merged.md]]"
---

# Summary: Fleet Captain Rule Gaps — Batch 1 and 2

**Sources**: three memory records tracking the same branch across its full lifecycle — from
"fixed and committed" through "discovered unmerged months later" through "merged via a real
PR, re-verified live."

## Batch 1 (commit `74a02d2`)

Fixed 2 Critical + 2 High findings from a July 26 fresh review:
- The [[Rank Config and Achievement Badges]] zero-rule-coverage gap.
- 11 missing `onSnapshot` error handlers in `useDatabaseSync.js` (a permission-denied read
  was failing completely silently, leaving core app data empty with no console trace).
- `motorists` UPDATE rule extended to delegated Fleet Captains, region-locked — matching
  [[Option B Region Lock]]'s existing create/delete pattern.
- `products` UPDATE rule extended to Fleet Captains reaching Master Vault.

## Batch 2 (commit `d3ec78f`)

Everything Batch 1 didn't cover from the same review:
- `commitInChunks` applied to the remaining unchunked bulk writes.
- 11 more missing listener error handlers.
- `pending_audits` rule widened to match the Stock Opname screen's own gating.
- Dark mode toggle and inventory search box — were dead, unwired state; now real controls.
- Logistics notification read-state actually persists now.
- Duplicated `formatRupiah`/`compressImageToBase64`/legacy-role-translation logic
  consolidated.

## The gap this project almost repeated

Both batches were fully committed and tested — and then sat **unmerged on a branch for
about a day**, discovered only when a later session happened to check
`git merge-base --is-ancestor main <branch>`. Not one of the [[Git Worktrees|three worktree incidents]]
exactly (the commits were real and on a real branch, not lost in an uncommitted
worktree) — but the same underlying lesson from [[Anti-Recurrence Check]] applies: "fixed
and committed" is not the same claim as "on `main`," and the two must be checked
separately, every time.

## Resolution

Pushed, opened as a real GitHub PR (not a raw command-line merge), tests re-run live
(26/26 and 8/8, matching the original claims), CI build-check confirmed green on both the
PR and the resulting push to `main`, then merged (commit `a8fc57c`). The
[[Firestore Rules]] changes are merged into the repo but — per
[[Draft-Then-Deploy Discipline]] — still NOT deployed to live Firebase as of this writing.

## Ripple — pages this touches

- [[Fleet Captain Permission Gap]] (this batch fixes several of its confirmed recurrences)
- [[Rank Config and Achievement Badges]] (Bug 1 fixed here)
- [[Firestore Rules]]
- [[Draft-Then-Deploy Discipline]]
- [[Anti-Recurrence Check]]
- [[UI-Says-Yes-Server-Says-No Pattern]]
