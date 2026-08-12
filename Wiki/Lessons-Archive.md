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

## Retired 2026-08-10 — the first archive, and the first one retired WITH fires

The cap rule assumed the archive candidate would always have zero fires. On 2026-08-10 all five
entries had fired, so there was no candidate and "or don't write" was the only branch left —
Alucard had silently lost the ability to learn anything new. Aldi chose to archive a fired entry
anyway: *"i think i choose A because lesson is part of experience that alucard can use to be wiser
in the future right, memories also important for AI not just human"*.

**Which entry, and why not the oldest.** Four entries shared the oldest date (2026-07-29). The one
below was picked instead of the first-listed because earlier the same day, seven rules ported from
Hermes Agent added this to `SKILL.md` §8:

> Never a Lesson that a tool, API or environment is broken — "X does not work" outlives the fix
> and you will cite it against yourself. Record the FIX (command, flag, config), or nothing.

This entry is exactly that shape — a negative claim about a tool, unverifiable now, and one that
fires every time its trigger comes up, so it would otherwise have been the last thing ever
archived. It was written before the rule existed. Retiring it applies the rule retroactively, once.

The useful half survives as a fact rather than a verdict: **`agent-browser` ships a CLI binary
taking the same commands as its MCP tools** (`agent-browser open/click/eval/...`, same daemon,
same session). Whether the MCP path still hangs is **unknown** — re-test, do not assume.

### 2026-07-29 — agent-browser MCP tools hang; the CLI binary doesn't
**Trigger:** before retrying a hung `mcp__agent-browser__*` call a second time, or before
reporting the tools as unusable.
**Lesson:** one retry max, then drop to the `agent-browser` CLI directly via Bash (same daemon,
same session — `agent-browser open/click/eval/...`) instead of retrying the MCP tool again.
**Would have prevented:** `mcp__agent-browser__agent_browser_open` hung silently for 30 min,
retried once, hung another 30 min — 60 min dead with zero progress. The CLI form of the exact
same command (`agent-browser open <url>`) worked instantly on the first try right after.
Seen: 2026-07-29
Fired: 2026-07-29 (this session — switched to CLI after 2nd MCP hang, rest of both Phase 0 tests ran through it)

### 2026-08-11 — a fixed element anchored to a resizable container must be checked at EVERY size
*Archived 2026-08-12 at cap, zero fires. Still true; it just never got a chance to fire.*
**Trigger:** before a completion claim on any `position: fixed` element whose offset is computed
from a container that the user can drag, snap or animate to another size.
**Lesson:** evaluate the offset arithmetic at each snap point, not just the resting one, and say
which sizes were checked. If any size pushes it past a viewport edge, pick the direction per size.
**Would have prevented:** shipped and committed `237bf6f` with the customer suggestion list pinned
`bottom: calc(var(--drawer-h) + 8px)`. Correct at the 96px and 55% snaps, but the drawer also snaps
to 92% of the screen, where the 192px list renders ~200px above the top edge — invisible, and no
customer selectable at all. Caught 20 minutes later by re-reading the geometry, in a second commit.
Seen: 2026-08-11
Fired: never
