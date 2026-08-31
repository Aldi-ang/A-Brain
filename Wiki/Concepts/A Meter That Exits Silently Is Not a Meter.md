---
title: A Meter That Exits Silently Is Not a Meter
description: The 5-hour plan-quota hook has warned at 70/85/95 since the day it was written, and has never once run — two config files it needs have never existed.
type: concept
created: 2026-08-31
updated: 2026-08-31
confidence: high
checked: 2026-08-31
tags: [quota, hooks, cost, discipline]
---

# A Meter That Exits Silently Is Not a Meter

## What happened

The 2026-08-30 session ran to **95% of the 5-hour plan quota** with work still going. Aldi
interrupted it himself. The notes that came back were partial: a PROGRESS entry landed, but the
prompt for the next session did not. His words, 2026-08-31:

> *"you need to fix your habit, last session reach 95% quota and the work keep going, make sure
> that its not happening again, notes is not build until i interrupt at 95% quota but it still
> failed to write the full prompt and notes for the next session update"*

It reads like a discipline failure. It is not one.

## The root cause

`.claude/plan-quota.mjs` is wired as a `UserPromptSubmit` hook and it is **correct**. It reads the
5-hour window off 9router and speaks in three tiers:

| Used | What it prints |
|---|---|
| ≥70% | one line, judge this request against what is left |
| ≥85% | finish and commit only what fits, write PROGRESS.md before the turn ends |
| ≥95% | a full STOP: write the notes first, reply with one line, start nothing |

The 95% branch already contains, word for word, the behaviour Aldi asked for.

**It has never reached that code.** Line 50:

```js
if (!connId) process.exit(0);
```

`connId` is read from `C:/Users/ASUS/9router-claude-id.txt`. That file does not exist, and neither
does `9router-cookie.txt` beside it — checked with `fs.existsSync` on both, 2026-08-31. So the hook
exits on its second line on every message Aldi types, at every percentage, and always has.

The silence was deliberate — its own comment says nagging about unconfigured tooling "would cost
tokens forever." That reasoning is sound for a feature nobody asked for. It is wrong for the one
meter that is supposed to stop the session.

## Why it was never noticed

`[context-watch]` DOES work, fires at 55/80/93, and looks like a quota warning. It measures a
different thing: the **context window**, which `/clear` empties for free. The plan quota is a
5-hour rolling budget that `/clear` does nothing for. Seeing one meter speak is what made the other
one's silence read as "quota is fine."

**A silent hook and a healthy hook are the same observation.** Nothing distinguishes them from
inside the session.

## What changed

`.claude/check-progress.mjs` (Stop hook) compared only `PROGRESS.md` against the newest source
edit. A brief three sessions old passed it. It now gates on the **older of `PROGRESS.md` and
`NEXT-SESSION.md`**, blocks when either is missing, names which one is stale, and says to write
`NEXT-SESSION.md` first — because the comparison is on modification time and touching PROGRESS
first re-blocks the next turn. Mutation-tested in both directions on 2026-08-31, commit `8df0d2a`.

That closes the notes half without depending on the meter at all. **This is the part that matters:**
the discipline was made structural rather than promised again.

## Still open — only Aldi can close it

The two files must be created by hand from the Quota Tracker at `localhost:20128`. The cookie is a
credential and is never pasted into the repo, never into chat, and never into a file Claude writes.

## The general rule

**A check that cannot fail is not a check, and a check that exits silently when unconfigured
cannot fail.** Any monitor whose whole job is to interrupt must be loud about being blind — the one
message it can never skip is "I am not measuring anything."

Related: [[Anti-Recurrence Check]] · [[A Check Points at a File, Not at a Behaviour]]
