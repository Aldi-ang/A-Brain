---
title: "Lessons Archive"
description: Where Alucard's retired lessons go when its 5-entry cap is hit. Append-only, never loaded into context — this is the pressure-release valve that keeps the live lessons file small.
type: archive
created: 2026-07-28
updated: 2026-07-28
tags: [alucard, lessons, archive, meta]
---

# Lessons Archive

Retired entries from `~/.claude/skills/alucard/lessons.md`.

**Never loaded into context.** That is the entire point. Alucard's live lessons file is
capped at 5 entries; when it hits the cap, the oldest entry with **zero recorded fires** is
moved here rather than the cap being raised. All growth pressure routes to this file, so the
per-invocation cost of the learning loop stays flat no matter how long it runs.

An entry arriving here with zero fires is not a failure to be embarrassed about — it is the
loop working. A lesson that never fired was a hypothesis that didn't pay off, and saying so
plainly is more useful than keeping it around to pad the file.

## Rules

- Append only. Never edit or delete an archived entry.
- Keep the original date and the `Fired:` line as-is, so the record of "this never fired"
  survives.
- If an archived lesson later turns out to matter, do **not** move it back — write a fresh
  entry in the live file and link back here.

---

<!-- archived entries below this line -->
