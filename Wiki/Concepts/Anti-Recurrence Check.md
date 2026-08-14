---
title: Anti-Recurrence Check
description: The rule born from 3 "it's committed" lies — never claim a save happened without checking git yourself.
type: concept
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
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

## A third shape: rebuilding the second layout instead of PORTING the solved one (2026-08-14)

**His complaint, and it is about workflow, not about the app:** *"u should know all this logic and
take notes of it when we doing the phone sidebar yesterday, looks like there is flaw in the
workflow of alucard that make them forgot what he did on the phone sidebar yesterday, because of
that i need to tell u twice, yesterday and today"*.

**The honest diagnosis is not amnesia — the notes existed and were found.** The failure was
building the desk navigation from a blank page instead of starting from the phone's already
signed-off answers. Four things he had decided during one night's work on 9–10 August had to be
asked for again on 2026-08-14: **two columns** (his words then: *"instead of 1 line of sidebar i
want it to be 2 colomn per row"*), **a label under the pointer** rather than nothing, **the music
player's pill shape**, and **the agent's own profile picture**. Every one was already solved,
tested, and sitting in the same file behind a different breakpoint.

**The rule: a component with two layouts has ONE set of decisions.** Before writing the second
layout, list what the solved one already answers — density, labels, spacing, states, what hides,
what expands — and port each answer, or say in one clause why this width genuinely differs. Never
open a blank page for a width whose sibling is finished. Cheapest way to run it: read the solved
layout's classes **and the audit checks that pin them** before the first edit, not after his
screenshot arrives.

**Cost when skipped:** a full re-specification round, plus a defect the solved width had never hit
— the desk strip was built at 88px, which clipped the logout button's 118px hover expansion, a
collision 176px on the phone could not produce.

Same lesson from the answering side — *name the width before saying a screen was done* — is in
[[The KPM Control System]] under **two layouts in one file**.

## A fourth shape: the check greps the source instead of measuring the result (2026-08-14)

The narrowest version of the same mistake, and it recurred three times in one day in `theme.css`:
an audit check that greps for a class or a value **proves it was typed, not that it applies**. A
`144px` check passed for a whole day over a value the browser never used, because a Tailwind class
on the same element carried the phone's `176px`. Full pattern and the other two occurrences:
[[The Rule That Never Applied]]. The fix is the same shape as `git show --stat` — read the real
result (`getComputedStyle`, `getBoundingClientRect`), not the source that was supposed to produce it.

## Related

- [[The Rule That Never Applied]] — the CSS-shaped instance of this discipline
- [[The KPM Control System]] — the two-layouts rule and the shell's current state
- [[Git Worktrees]] — the three incidents this rule was built from
- [[Draft-Then-Deploy Discipline]] — the same "verify, don't assume" spirit applied to rules
  deployment
- Summary: [[Lost Work in Worktrees — Three Incidents]]
- Summary: [[Dead Weight Cleanup and Rules-Deploy Gap]] — the dependency-removal instance of
  this same pattern
