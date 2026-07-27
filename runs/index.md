---
title: "Runs — Index"
description: Log folder where automations and skills record what they actually did. Added 2026-07-27 as PLAN-A-Brain-agentic-OS task 2.4, required before any loop engineering (1.5) can work.
type: index
created: 2026-07-27
updated: 2026-07-27
tags: [index, runs, automation]
---

# runs/

Where skills and automations record what they actually did, each time they run. Required
groundwork for [[../PLAN-A-Brain-agentic-OS]] task 1.5 (loop engineering) — a skill can't read
its own past runs to improve if nothing is ever logged.

## Status as of 2026-07-27

Empty. No skill currently writes here — this folder is scaffolding, created ahead of need.
The two skills built so far ([[../Skill-Audit-2026-07-27|firebase-live-qa and
skill-safety-check]]) do not yet log their runs here; that's a reasonable next enhancement
once they've been used a few times manually and are worth improving in a loop.

## Convention (proposed, not yet exercised)

One file per run, named `YYYY-MM-DD_skill-name_short-note.md`, containing at minimum:
frontmatter (`skill`, `date`, `outcome`), and a short body: what was attempted, what happened,
anything that should change next time. Keep entries short — this is a log, not a report.

Revisit this convention once a real skill actually starts logging here; don't treat it as
fixed until proven useful in practice.
