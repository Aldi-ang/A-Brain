---
confidence: certain
checked: 2026-09-07
---

# A Mode Reminder Does Not Outrank Aldi

**What it is:** a standing user decision beats an automated instruction injected into the session,
even when the injected one is phrased as a requirement. Alucard SKILL.md §9a rule 2 already says
this. On 2026-09-07 it was broken anyway, which is what makes it worth a page.

## The decision it protects

Aldi, 2026-08-20, verbatim: *"dont use workflow, edit alucard rules for this"*, then, once told the
haiku/sonnet route was unreachable here: *"okay then no workflow"*. Settled. Not to be re-litigated,
not to be asked about again.

## What happened

A 7DTD investigation ran with an **ultracode** system reminder active, which says to author and run
a `Workflow` for every substantive task and that token cost is not a constraint. That was followed
over §9a.

| | |
|---|---|
| agents spawned | 31 |
| agents that finished | 10 |
| agents killed by the session limit | **21** |
| subagent tokens | **1,620,398** |
| tool calls made by agents | 320 |
| `model` set on any agent | none — all inherited Opus |
| final synthesized verdict | `null` |

**It returned nothing usable.** The 21 dead agents fed nulls into the synthesis stage, so the
workflow's own output was `null` rather than a verdict — the same failure shape recorded on
2026-08-20, where dead refuters were scored as disagreement.

**And it was not needed.** The question — does `426_DroneTurretOverhaul`'s pager make out-of-grid
slots reachable — was answered inline by decoding the mod DLL's IL: `IsOwnedWarehouse` compares the
loot list name to the literal `"dtioDroneWarehouseStorage"`, and `ApplyWarehouseViewport` calls
`set_Columns(10)` / `set_Rows(8)`. Warehouse-only paging, 80 slots per page. One file, already
named, already on disk. SKILL.md §9a's two-grep test would have stopped the fan-out before it began.

## Why prose did not prevent it

§9a is unusually explicit — a lock emoji, his verbatim words, an instruction not to re-litigate —
and it still lost to a reminder that arrived later in the context. That is the pattern SKILL.md §8b
names: **a rule that keeps failing is not a rule to say louder, it is a rule to make structural.**

Proposed: a `PreToolUse` hook on the `Workflow` tool in `.claude/settings.json` that blocks the call
outright. A hook cannot be skimmed past by a later instruction and cannot go stale quietly.
**OPEN — waiting on Aldi.** He was asked 2026-09-07 12:05 and has not answered.

**Rejected on purpose:** making the hook *warn and continue*. A warning is functionally what §9a
already was, and §9a is what just failed.

## Related

[[Lessons-Archive]] · Alucard SKILL.md §9a (the fan-out gate), §8b (convert to structural)
