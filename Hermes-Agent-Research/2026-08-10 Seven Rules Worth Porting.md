---
title: "2026-08-10 Seven Rules Worth Porting"
description: Output of the 16-agent Hermes sweep — 7 rules that survived an adversarial cut against alucard's SKILL.md, and the 12 that did not.
type: note
created: 2026-08-10
updated: 2026-08-10
confidence: high
checked: 2026-08-10
tags: [hermes, alucard, rules, awaiting-approval]
---

# 2026-08-10 — Seven Rules Worth Porting

Follow-up to [[2026-08-10 Hermes Desktop Inspection]]. Aldi's objective, his words:
*"integrate hermes to alucard so basically just hermes in the persona of alucard and A-Brain
memory"* — so the persona layer stays alucard, the memory layer stays A-Brain, and what gets
ported is Hermes' **rules and loops**.

## Method

16 agents. Eight readers, one per Hermes subsystem that maps onto an alucard section
(verification, learning, memory, context/caching, delegation, the unread half of `AGENTS.md`,
skill format, turn-closing). Each reader's proposals then went to a **second agent whose default
was reject** — a proposal survived only if it was genuinely absent from `SKILL.md`, fired at a
named checkpoint, prevented a cost real to Aldi's actual work, and was worth permanent context
rent on a file that loads every invocation.

19 proposals in, **7 out**. 1.12M subagent tokens. First run died at the plan quota with 8 of 11
agents dead; the resume replayed the 3 completed ones free.

**Nothing has been applied.** Alucard §8 forbids editing `SKILL.md` without Aldi approving the
wording. These are proposals.

## The seven

### 1. §3 — "this session" is the wrong freshness window
`(checked: ...)` receipts go stale the moment you edit again. Hermes marks evidence `stale` when
`last_edit_at > evidence.created_at` (`agent/verification_evidence.py:639-641`). Alucard's line
says *"[certain] needs a check run this session"* — and a session runs hours across many edits,
so the line **licenses** the stale receipt rather than blocking it.

> **[certain] needs a check run AFTER your last edit**, not just this session. Append
> `(checked: <command|file:line|output>)`. Nothing to put there -> [likely]. No exceptions for
> feeling sure.

In-place replacement. **Zero net lines.**

### 2. §8 — never write a Lesson saying something is broken
Hermes bans negative claims about tools from its learning store outright: *"These harden into
refusals the agent cites against itself"* (`agent/background_review.py:278-281`). Alucard's §8
gate **admits** this shape — "on phone, `crypto.subtle` is unavailable, don't use it" passes all
five clauses. Cost is in this repo's own log: `0aabb81` records that root cause, `b1aee4e` fixes
it one day later. A sentence true one night, false the next commit — and a stale negative fires
*every* time its trigger comes up, so it is the last thing archived.

> Never a Lesson that a tool, API or environment is broken — "X does not work" outlives
> the fix and you will cite it against yourself. Record the FIX (command, flag, config), or nothing.

### 3. §10 — name the return shape when spawning
Only a subagent's final text survives, so the prompt is the only lever. Every other alucard rule
governs what may be *claimed afterward* — too late, the run is already paid for.

> Spawning one -> name the return shape in the prompt: verdict first, `file:line` per claim, then
> `could not check: <what>`. No citable line comes back = you cannot fill `(checked: ...)`, and
> the run is spent.

### 4. §3 — merge to main needs a check AFTER, not just before
§3 calls merge-to-main irreversible but every check it demands is pre-action. A branch behind
`main` silently reverts fixes it never touched — no error, no failing check. Aldi runs long-lived
branches (`phase0-solid-ground` now) and commits generated artifacts (`graphify-out/`), which are
exactly the files a stale branch overwrites without conflicting.

> **Merge to main: one check before, one AFTER.** Before -> `git log main ^HEAD` (branch behind
> main = rebase first). After -> `git diff HEAD~1..HEAD`; account for every deleted line. The
> after-check is the only one that catches a stale branch un-fixing something already fixed on
> main. One deletion you cannot name -> stop, name the fix that vanished, do not push.

### 5. §3 — a check that could not have failed proves nothing
From Hermes' bundled `systematic-debugging` skill: *"a tight command that can go red on the
user's exact symptom."* Alucard's verification rules all govern *quantity* and *independence*,
never *falsifiability*. This is the exact shape of the vault's
[[../Wiki/Concepts/UI-Says-Yes-Server-Says-No Pattern|UI-Says-Yes-Server-Says-No]] bug class — a
check passing on the path that was never broken.

> **A check that could not have failed proves nothing.** Fixing a bug -> run the check BEFORE the
> edit and see it go red, or the claim is [likely], never [certain]. Cannot name the output that
> would have meant broken -> it counts 0 in `checks: N run`.

### 6. §6 — third failed fix = stop
Hermes auto-blocks a task after 2 consecutive failures to prevent spin loops
(`AGENTS.md:1123-1125`). Alucard has two three-counters already — files touched (§6) and graphify
misses (§2) — but nothing counts failed **attempts** at the same bug. Thrashing on fix #4 is the
one burn that *looks* like progress, so no existing threshold fires on it.

> KPM: more than 3 files touched for a bug fix -> stop, name each file and why, before continuing.
> Same counter on attempts: **third failed fix = stop, not fix #4.** At three the wrong thing is
> your model of the bug or the architecture, not the patch — say which, name the assumption all
> three attempts shared, ask Aldi before touching code again.

Replaces the existing §6 line in full.

### 7. §11 — a failed edit is a line item
Hermes appends a failure footer when writes fail mid-batch, because *"the model summarises the
turn claiming every file was edited. The user then has to manually run `git status` to catch the
lie"* (`agent/turn_finalizer.py:459-482`). Alucard's anti-over-claim wall gates commit-words and
wrong-content, never never-written. **This failure happened in the very session that found it** —
an `index.md` edit errored with "File has not been read yet" and only luck surfaced it.

> **A failed edit is a line item, not an omission.** One `old_string` miss inside a batch of five
> is invisible in the prose above it. Closing line gains `edits: N ok, N failed (<path> — <error>)`.
> `0 failed` is a [certain] claim — re-read the tool results before writing it. Aldi's
> `git status` is not your check.

**Net cost: ~+16 lines on 263.**

## What was rejected, and why it matters

Twelve proposals died. The pattern in the rejections is the more useful finding: **alucard
already covers most of what Hermes enforces in code.** Representative kills —

- *Fence recalled memory as untrusted data* — rejected: Hermes needs it because memory is
  auto-injected from a shared store; A-Brain is a single-author vault loaded deliberately per
  task, and the one catastrophic imperative ("deploy the rules") is denied at the settings level.
- *Abort a write when the read failed* — rejected: the Write tool already refuses to overwrite an
  unread file, §1 already covers wrong paths, and A-Brain is a git repo.
- *Inject a "compaction ate this file" marker* — rejected as **self-defeating**: the guard would
  live inside the file the compaction deletes, so it can only fire when it was not needed. Hermes
  gets this right only because its compressor injects from outside the model. Genuinely
  un-portable, and the sharpest thing the sweep learned about the prompt-vs-program boundary.
- *A source-text match is not behavior evidence* — rejected as a restatement of alucard's existing
  *"Edit success proves text was written, not that it is right."*
- *Never end a turn on a narrated intention* — rejected: §11a, §10 and §2 each already forbid the
  deferral at the same checkpoint.

## Status

**Awaiting Aldi's approval on all seven.** Nothing applied. Three earlier edits from
[[2026-08-10 Hermes Desktop Inspection]] are in `SKILL.md` already (prompt-cache reason, session
search, the subagent rule carrying his *"allow parents write is my best pick"*) and he was
offered a revert he has not answered.
