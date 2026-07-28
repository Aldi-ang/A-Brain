---
title: "Alucard Benchmark — rubric"
description: The test that can kill Alucard. Rubric written BEFORE any run, so the verdict can't be rationalised after the fact.
type: benchmark-rubric
created: 2026-07-28
updated: 2026-07-28
tags: [alucard, benchmark, meta]
---

# Alucard Benchmark

**Written before running anything.** That is the point — a rubric written after seeing
results is a justification, not a test.

## What this asks

Not "is Alucard nice to use." **Does `/alucard` beat what Aldi already has?** If it doesn't,
the disciplines are decoration and the correct output is deleting the skill.

## The control is NOT a blank session

Inside `kpm-inventory`, the `SessionStart` hook already injects Caveman + Karpathy Guidelines
+ the A-Brain pointer. Ponytail is on globally via its own hook. So the honest framing is:

> This measures **Alucard vs. the hooks Aldi already runs** — not Alucard vs. nothing.

Drawing the verdict against a blank session would flatter Alucard by crediting it with
disciplines that already fire without it. Run the control inside `kpm-inventory` so the hooks
are active in both arms.

## Tasks (fixed, run each twice — once with `/alucard`, once without)

| # | Task | Type |
|---|---|---|
| T1 | A one-line KPM bug fix (pick a real open item from `Backlog/`) | code |
| T2 | "Is the Firestore rules change deployed?" | live-status |
| T3 | A planning question (e.g. what to do after the rules deploy) | judgement |

## Measures

**Tokens** — source: the session JSONL `usage` fields (`input_tokens`, `output_tokens`,
`cache_read_input_tokens`). Name the exact file path used, per run, in the results. Do not
use `codeburn yield` — see below.

**Criteria met / criteria total** — score each run against these, decided now:

- T1: names `Done when:` / `Verify by:` / `Touching:` before editing · runs `graphify update .`
  after the edit · does not touch files outside `Touching:` · ends with the `checks:` line
- T2: answers from live command output OR says UNKNOWN and names the settling command ·
  does **not** cite the wiki or memory as the basis · does not claim "deployed"
- T3: contains a `not-chosen:` line with both a "lost on" and a "flips if" · no banned phrase
  in the first sentence · every `[certain]` carries a `(checked: …)`

## Decision rule — fixed in advance

> If Alucard is **not** cheaper on tokens **and not** higher on criteria-met, delete the skill.

Not "iterate on it." Delete. A discipline that costs more and verifies no better is
ceremony. Alucard may win on either axis to survive; it must win on at least one.

## Explicitly NOT a valid measure

**`codeburn yield`.** It classifies spend by proximity to git commits. Alucard is a
whole-life advisor — every session where it does exactly what it was built for (planning,
tobacco, crypto, deciding what *not* to build) produces zero commits and scores
**Abandoned**. The better it works, the worse that metric rates it.

**Dollar figures from any CodeBurn command.** Aldi is on a prepaid proxy
(`ANTHROPIC_BASE_URL` → localhost, model ids prefixed `cc/`). CodeBurn reports Anthropic list
price, which is not what he pays under any scenario. Read token columns only.

## Cadence for re-checking

Measure in **sessions, not days.** A "kill it if unused in 30 days" rule would auto-delete a
working agent during the ~3-month tobacco season when Aldi isn't coding. Re-check after 30
more coding sessions.

## Results

_Empty. Nothing has been run yet. Do not fill this in from memory — paste real numbers._

| Run | Task | Arm | Tokens | Criteria met | Notes |
|---|---|---|---|---|---|
| | | | | | |
