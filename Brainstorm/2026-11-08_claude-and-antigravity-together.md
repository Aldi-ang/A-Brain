---
title: "Claude and Antigravity on one project, one brain"
type: brainstorm
created: 2026-11-08
status: BUILT (GEMINI.md, kpm repo) · OPEN — who puts Antigravity's work live (🔴 asked) · skill links need Aldi's one PowerShell line
tags: [kpm, tooling, antigravity, a-brain, workflow]
---

# Claude and Antigravity on one project, one brain

## The problem (his words, 2026-11-08 09:33)
*"how do we do to get claude and google antigravity working together for this task without losing our ability, skills
and experience from the A-Brain this way i want the effectiveness and efficiency will be kept"*

## What was checked (live, 2026-11-08 09:35, antigravity.google/docs/rules and /docs/skills)
- Antigravity loads `AGENTS.md` or `GEMINI.md` at the workspace root, always on, no frontmatter. `@[label](path)` pastes
  another file in (frontmatter stripped). 24,000 bytes per rule file after includes; 20,000 tokens for all always-on rules.
- `.agents/rules/*.md` need YAML frontmatter with a valid `trigger`, or they are dropped **silently**.
- Skills use the same `SKILL.md` standard as Claude. Antigravity App: workspace `.agents/skills/<name>/`, global
  `~/.gemini/config/skills/<name>/`.
- His PC: the Antigravity App is installed (`~/.gemini/config` has plugins canva, context7, firebase, notion). Its project
  "A-Brain+kpm-inventory-main" holds both folders, **with `main` as the default branch** — the live branch is
  `phase0-solid-ground`, so work branched there would start from code that is not live.

## Options
| Option | What it is | Cost |
|---|---|---|
| **A. One brain, two hands (built)** | `GEMINI.md` pastes in CLAUDE.md and Personal-Context.md; the same NEXT-SESSION / PROGRESS / A-Brain; one writer at a time; Antigravity commits, Claude pushes | one short Claude turn per Antigravity change |
| B. Copy the rules and skills into Antigravity | separate files for each tool | the copies drift: a lesson learned on one side never reaches the other |
| C. Both edit at once, on two branches | parallel work | merge conflicts in the same big files (StockOpnameView is 2,000+ lines); a bad merge can quietly undo a fix |
| D. Antigravity pushes by itself | faster | a change goes live without the 89 lessons, the hooks or a second look |

**The split by strength (default):** Claude — `firestore.rules`, money and permission code, design calls, filing A-Brain's
Wiki, pushing. Antigravity — walking the app in its browser (✅ TESTs, frames), read-only research, long mechanical sweeps;
it runs on Google's quota, not his Claude 5-hour window.

## Decision
Built: option A, `GEMINI.md` at the kpm repo root (Claude Code does not read it). Antigravity's private memory ("brain",
Knowledge) is a scratchpad; its results go to `.claude/PROGRESS.md` (🔵 ANTIGRAVITY entries) and `Raw/` here.

OPEN — asked (verbatim): **🔴 DECIDE: When Antigravity finishes a change, who puts it live? 1 Antigravity saves it on your
PC only, then Claude checks it and puts it live (safer; one short Claude turn each time). 2 Antigravity puts it live
itself after the same three checks (faster; nobody looks again before your users see it).** Recommended 1. Built as 1.

Not done: linking 8 of Claude's skills into `~/.gemini/config/skills` (junctions, one copy for both tools). Claude Code's
safety check refused that write; Aldi was given the one PowerShell line.

## Rejected on purpose
- B (copied rules and skills): two copies drift; the lessons file must stay one file.
- C (two writers at once): same files, a push is the live app.
- `.agents/rules/` files: a typo in the frontmatter makes the rule vanish without an error; one `GEMINI.md` cannot.
- `AGENTS.md` as the name: other agent tools read it too; `GEMINI.md` reaches only Gemini.

Models applied: Inversion (how would two agents lose what A-Brain knows: private memories, copied rules, a branch cut
from `main`), Second-Order Thinking (who pushes, and what a push does to his users).
