---
title: Anti-Recurrence Check
description: The rule born from 3 "it's committed" lies — never claim a save happened without checking git yourself.
type: concept
created: 2026-07-27
updated: 2026-07-27
tags: [pattern, discipline, git]
---

# Anti-Recurrence Check

The standing discipline this project adopted after the same failure happened **three
separate times**: a commit's message claimed to include a fix, but the commit's *actual*
diff didn't contain it — usually because the real work was still sitting uncommitted in a
[[Git Worktrees|git worktree]] that never got merged.

## The rule

Never report a file as "committed" or work as "saved" unless, in that same turn:
1. `git add`/`git commit` was actually run, and
2. `git show --stat HEAD` was checked to confirm the expected file is really in the diff.

This applies every time a task creates or edits a file meant to persist — proactively, not
just when someone is specifically asked to investigate whether something landed.

## Why it's called "anti-recurrence"

Each of the [[Git Worktrees|three incidents]] this rule comes from was independently
discovered — meaning the pattern wasn't caught by the rule the first two times, only by the
project owner manually checking GitHub later. The rule exists specifically to stop a
fourth occurrence, not just to explain the first three after the fact.

## Related concept: verify before claiming, generally

This project treats "I did X" and "X actually happened, verified" as two different claims
that must not be conflated — the same spirit shows up in
[[Draft-Then-Deploy Discipline|never assuming a rules draft is deployed]] and in this wiki's
own rule (see `CLAUDE.md`) to never answer "is this live right now" from Wiki content alone.

## A second shape of the same mistake: local checks that don't match real conditions

Not just "did the commit happen" — the same failure shape shows up whenever a check is
narrower than what actually gets exercised for real. 2026-07-28: `react-is` got removed as
"unused" because nothing in `src/` imports it directly — but `recharts` (a dependency being
kept) imports it internally, and the removal broke the real Vercel production build. The
local check (`grep src/`) looked sufficient; it wasn't. See
[[Dead Weight Cleanup and Rules-Deploy Gap]]'s 2026-07-28 update for the full incident —
fixed by actually running a production build before trusting the cleanup, not just the
narrower check.

## Related

- [[Git Worktrees]] — the three incidents this rule was built from
- [[Draft-Then-Deploy Discipline]] — the same "verify, don't assume" spirit applied to rules
  deployment
- Summary: [[Lost Work in Worktrees — Three Incidents]]
- Summary: [[Dead Weight Cleanup and Rules-Deploy Gap]] — the dependency-removal instance of
  this same pattern
