---
title: "Ingest run — the boot-animation cascade trap"
skill: a-brain-session-ingest
date: 2026-08-14
outcome: one source ingested, one new Concept page, three ripples, one skill-file edit
tags: [runs, ingest, kpm, css]
---

# 2026-08-14 · scheduled ingest

## What was found

The vault is now largely self-maintaining — the working sessions and the "Vault gap curator"
runs write to it live (vault git log runs to 2026-08-14 12:11). So this pass was a gap hunt, not
a bulk import. **One real gap:** the KPM repo's 12:47 WIB commits `9e975aa` + `5d4f61f` landed
*after* the last vault write, and nothing in the vault covered them.

## Ingested

- `Raw/2026-08-14_source_desk-rail-cascade-and-torch.md` — commit message + PROGRESS section, verbatim.
- **New:** `Wiki/Concepts/The Rule That Never Applied.md` — three same-day occurrences of one
  shape (Tailwind class beats a stylesheet rule; source order at equal specificity; a filled
  `forwards` animation outranks a normal declaration). Three occurrences, so this is a pattern,
  not a codified sample of one.
- Rippled: `Concepts/The KPM Control System.md` (new section on the rail's two fighting arrivals),
  `Concepts/Anti-Recurrence Check.md` (fourth shape), `Wiki/Index.md`, `Wiki/MOC.md`,
  `Wiki/Concepts/index.md`, `Raw/index.md`, `Wiki/Log.md`.
- `Backlog/PC sidebar hover-expand and top panel redesign.md` — his open decision recorded
  verbatim and left **unanswered on purpose**: *"it just blank while its closed … i want more
  balance and more organic"*.

## Skipped, and why

- "WiFi performance on phone" (2026-08-14) — already in `Concepts/Secure Context Requirement`,
  written by that session itself.
- "Vault gap curator" sessions — vault maintenance, not user work; their writes are the vault.
- The untitled 2026-08-13 KPM session — its commits were self-ingested through 12:11.

## Deviation from CLAUDE.md worth naming

No `Wiki/Summaries/` page was written for this source. The substance is a reusable pattern, so it
went to a Concept page plus a `Wiki/Log.md` entry; a Summary would have been a third copy of the
same 300 words. Recent passes (2026-08-11, 2026-08-14 morning) did the same. **If a future pass
disagrees, write the Summary — don't argue with this note.**

## For Aldi's eyes

1. **Skill-file edit made** (the one allowed exception outside the vault):
   `~/.claude/skills/delegate-coding-task/references/kpm-inventory-facts.md` gained a
   `theme.css: greping for a class proves it was TYPED, not that it APPLIES` section. Every future
   delegated session starts knowing it.
2. **A claim in PROGRESS.md is environment-dependent, not a project fact.** It states seven design
   skills (`/impeccable`, `/ui-ux-pro-max`, `/emil-design-eng`, …) "do not exist" and cannot be
   installed. In *this* session six of the seven were listed as available. Skill availability
   varies by session/harness; it should not be written down as a standing fact about the project.
   Flagged in `Wiki/Log.md` and in the Raw source, not silently corrected.
3. **The CROWN PLAN session was still running** when this pass ran. Whatever it did after 13:20
   is not captured here.
4. No Alucard lesson candidates proposed this run.
