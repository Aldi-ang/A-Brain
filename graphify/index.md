---
title: "Graphify — Index"
description: Scaffolded home for Graphify's Obsidian export (one note per code function/module). Added 2026-07-27 per the community Graphify+Obsidian+Claude Code pattern.
type: index
created: 2026-07-27
updated: 2026-07-27
tags: [index, graphify, code-graph]
---

# graphify/

Home for Graphify's Obsidian export — auto-generated notes mapping the KPM codebase's
structure (functions, modules, calls, imports) so they're browsable in Obsidian's graph view
alongside the knowledge Wiki. See [[../Automation-Setup]] section 3 for the exact command.

## Status as of 2026-07-27

Empty scaffolding. Nothing exported yet — Aldi needs to run
`/graphify . --obsidian --obsidian-dir ".../graphify/kpm-inventory"` from inside the
`kpm-inventory` repo first.

## Convention

- `kpm-inventory/` — code graph notes for the KPM app (once exported)
- Future projects get their own subfolder the same way
- **Auto-generated — do not hand-edit.** Re-run the export command after structural code
  changes to refresh; don't manually fix notes in here.
