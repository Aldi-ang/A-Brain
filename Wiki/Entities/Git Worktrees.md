---
type: entity
created: 2026-07-27
updated: 2026-07-27
tags: [git, tooling, incident]
---

# Git Worktrees

A git feature this project uses to let Claude Code work on multiple branches/tasks in
parallel folders (`src/.claude/worktrees/<branch-name>/`) without disturbing the main
checkout. Genuinely useful for parallelism — and also the single riskiest piece of tooling
in this project's history, because a worktree's uncommitted changes are invisible to
`git status` run from the main checkout, and worktree directories can be silently
recycled/deleted by the harness between sessions.

## Confirmed real incidents (3, so far)

1. **Customer Directory permission tier work** — real, emulator-tested code sat uncommitted
   in the `customer-directory-permissions-396625` worktree while a commit on `main`
   (`15e1360`) claimed to add the feature but actually only bumped `package.json`. Recovered
   later (commit `90163ee`).
2. **`handlePhotoCapture`/`submitNooOnly` fix** — same shape: a commit's message described
   the fix, but only `firestore.rules` actually made it into the diff. The real JS fix was
   recovered from a different abandoned worktree (commit `673ebf6`).
3. **`build-check.yml` GitHub Actions workflow** — the file was created and validated, but
   `git add`/`git commit` were never actually run at all. The turn's summary still claimed
   "the file is committed." The worktree holding it was nearly recycled before the file was
   found still sitting on disk.

## The resulting discipline

See [[Anti-Recurrence Check]] — the standing rule this project now follows: never report a
file as "committed" without having actually run `git add`/`git commit` and confirmed with
`git show --stat HEAD` that the expected files are really in the diff, every time, not just
when explicitly asked to verify.

## Related

- [[Anti-Recurrence Check]] — the discipline these incidents produced
- Summary: [[Lost Work in Worktrees — Three Incidents]]

## Verify before trusting

Whether any *specific* worktree currently holds uncommitted work is a live-repo question —
run `git worktree list` and check each one, don't assume from this page.
