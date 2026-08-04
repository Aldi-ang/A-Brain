---
title: Option B Region Lock
description: Locking Area Admin/Fleet Captain roster changes to their own region, plus a real stale-memory lesson.
type: summary
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
tags: [ingest, incident, permissions, firestore]
source: "[[../../Raw/2026-07-24_source_option-b-region-lock.md]]"
---

# Summary: Option B Region Lock

**Source**: the `project_kpm_option_b_region_lock` memory, 2026-07-24 through 2026-07-26.

## What it fixed

Previously, a delegated Area Admin could create or delete a `motorists` (field agent) doc in
**any** region for their company via a direct SDK call — the UI already restricted this to
their own region, but the [[Firestore Rules|Firestore rule]] didn't. "Option B" locks
`create`/`delete` on `motorists` to the admin's own `location`.

## The blocking question, resolved

Would this break the agent-transfer-to-a-different-branch feature? No — that feature edits
an *existing* agent's location field (an `update`), not a create+delete, and Option B only
touches `create`/`delete`. Confirmed via reading `FleetCanvasManager.jsx`'s actual transfer
code before shipping the lock, not assumed.

## Extended to Fleet Captain — and a real "stale memory" lesson

Later confirmed the "Allow Roster Management" toggle is meant for delegated Fleet Captains
too, not just Area Admins — but `isAuthorizedAreaAdmin()` only recognized the literal
`'AREA_ADMIN'` role (see [[Fleet Captain Permission Gap]]). Broadened it. **Then, a day
later, a different session found the broadening MISSING** in a fresh worktree check — either
a different unmerged branch, or a genuine revert. Re-verified again on 2026-07-26 and
confirmed present and correct on that session's branch.

This double-check-because-memory-said-so-but-verify-anyway moment is a real, lived instance
of exactly what this wiki's own rules require (see `CLAUDE.md`): never trust a memory's
claim about current code state without checking the real repo first.

## Ripple — pages this touches

- [[Fleet Captain Permission Gap]] (this fix's Fleet Captain broadening is one of the
  confirmed recurrences)
- [[Tier System]] (the `canEditRoster` delegation mechanism)
