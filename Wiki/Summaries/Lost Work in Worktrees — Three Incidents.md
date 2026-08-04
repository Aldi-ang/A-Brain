---
title: Lost Work in Worktrees — Three Incidents
description: Three separate times finished work almost vanished because of how git worktrees behave.
type: summary
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
tags: [ingest, incident, git]
source: "[[../../Raw/2026-07-26_source_verify-before-claiming-committed.md]], [[../../Raw/2026-07-25_source_noo-audits-fix-and-worktree-incident.md]], [[../../Raw/2026-07-26_source_worktree-recovery-git-log.md]]"
---

# Summary: Lost Work in Worktrees — Three Incidents

**Sources**: the `feedback_verify_before_claiming_committed` memory (which names all three
incidents together), the NOO/audits fix session record (incident #2 in full detail), and
verbatim git log for the two recovery commits.

## The three incidents

1. **2026-07-25 — Customer Directory permission tier.** Real, emulator-tested code (a whole
   permission tier: view_only/own_region/global) sat uncommitted in the
   `customer-directory-permissions-396625` worktree. A commit on `main` (`15e1360`) claimed
   to add the feature — its actual diff was only a `package.json` version bump. Recovered
   the next day via commit `90163ee`, after diffing every file in the worktree against
   current `main` to rule out unrelated drift.
2. **2026-07-25 — `handlePhotoCapture`/`submitNooOnly`.** Same shape: a commit's message
   described a crash fix for the "Register New Outlet" flow, but only `firestore.rules`
   actually landed — the JS fix that mattered was still in a different abandoned worktree.
   The live site kept crashing with the exact same error after the "fixing" commit deployed.
   Recovered via commit `673ebf6`.
3. **2026-07-26 — `build-check.yml`.** The simplest and most alarming version: the file was
   created and its YAML validated, but `git add`/`git commit` were never run at all. The
   session's own summary still claimed "the file is committed." The worktree holding it was
   nearly recycled by the harness before the file was found still sitting on disk,
   uncommitted.

## The pattern across all three

Each was independently discovered by the project owner manually checking GitHub — none were
caught by the AI session itself in the moment. This is exactly what produced
[[Anti-Recurrence Check]].

## Ripple — pages this touches

- [[Git Worktrees]] (the entity describing the mechanism and all three incidents)
- [[Anti-Recurrence Check]] (the discipline these incidents produced)
