---
title: A Meter That Exits Silently Is Not a Meter
description: The 5-hour plan-quota hook warned at 70/85/95 and said nothing for weeks. Fixed 2026-08-31 — the sessions were editing a decoy file one folder away from the one the hook reads, and the meter under-reported a spent bucket as 1%.
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

`connId` is read from an id file beside the cookie. **The path written here on 2026-08-31 morning
was wrong, and that error is the whole story — see the Resolution below.** The hook reads
`C:/Users/ASUS/.claude/9router-claude-id.txt`, with `.claude/` in it. Every session that "checked
whether the file exists" checked `C:/Users/ASUS/9router-claude-id.txt`, one folder up, which the
program never opens.

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

## Resolution — 2026-08-31 evening, commit `7ca7b03`

**Nobody was ever guessing the right thing.** Four connection uuids were tried across several
sessions, each one written into `C:/Users/ASUS/9router-claude-id.txt` — a file the program does not
read. The hook loads `C:/Users/ASUS/.claude/9router-claude-id.txt`. The decoy still exists; it is
harmless and it is inert, and the next-session brief now names the real path so this cannot repeat.

Working connection: `76c7cf4f-4c24-4984-aada-3aa91f53a148`. The other three answer 200 as well and
are the wrong accounts — one exposes only `On-demand`, one only `credit`, one an empty `quotas`
object. **A 200 is not the same as the right connection.**

Two further bugs surfaced the moment it could answer at all:

1. **The route returns TWO buckets** — `session (5h)` and `weekly (7d)` — and only the session was
   read. A 7-day lockout would have arrived in total silence. The worse of the two now drives the
   thresholds.
2. **`used` was read as a percentage when it is a count.** An `On-demand` connection answers
   `used:1 total:1` — completely spent — and the meter reported **1% used**, which is under every
   threshold and therefore printed nothing. `remainingPercentage` is now read first, and a raw
   count is divided by its own total. Proved by pointing the hook at that exact connection and
   watching the same input print 100%.

Pinned by checks D12 in `logicFixes.selfcheck.mjs`, including a positive case so the guard is known
to be able to fail.

## The general rule

**A check that cannot fail is not a check, and a check that exits silently when unconfigured
cannot fail.** Any monitor whose whole job is to interrupt must be loud about being blind — the one
message it can never skip is "I am not measuring anything."

**And two corollaries this incident added.** Before iterating on a config file's *contents*, read
the program and confirm which path it opens — days were spent editing the right kind of file in the
wrong place, and every failure looked like a wrong value. Then: a monitor that reports a number is
making a claim about units. A count and a percentage look identical when the total happens to be
100, and the first bucket where it is not is where the meter quietly lies in the safe direction.

Related: [[Anti-Recurrence Check]] · [[A Check Points at a File, Not at a Behaviour]]
