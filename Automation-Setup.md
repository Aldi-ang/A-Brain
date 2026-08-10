---
title: "Automation Setup — Session Capture into A-Brain"
description: What's live, what's drafted-but-not-installed, and what's out of reach, for automatically getting work from chat/Claude Code/Cowork into the vault, plus cutting token burn. Revised 2026-07-27 after researching the community Graphify+Obsidian+Claude Code pattern Aldi found.
type: automation-doc
created: 2026-07-27
updated: 2026-07-27
tags: [meta, automation, plan, graphify]
---

# Automation Setup — Session Capture into A-Brain

**Revision note (2026-07-27, later same day):** the first version of this doc was written
before researching four videos Aldi found (Chase AI's Graphify/Obsidian series, plus two
general "Claude + Obsidian" videos). That research surfaced an established community pattern
— documented in detail at
[lucasrosati/claude-code-memory-setup](https://github.com/lucasrosati/claude-code-memory-setup)
(845 stars) and [graphify.net's official Claude Code integration
docs](https://graphify.net/graphify-claude-code-integration.html) — that's simpler and more
reliable than my original from-scratch hook design in several places. This revision keeps what
still holds up and replaces what doesn't, per the vault's own "never silently revise" rule.
**One correction to my earlier claim:** I said claude.ai web chat was completely out of reach.
That's not quite right — see section 4.

Aldi's original ask, unchanged: (1) auto-capture whatever he does in chat/Claude
Code/Cowork into the vault without manually asking each time, (2) direct vault access so
Claude Code doesn't burn tokens re-deriving context, especially building apps.

---

## 1. Live now — scheduled session auto-ingest (upgraded 2026-07-27)

A daily scheduled task, `a-brain-session-ingest`, runs at 9:02 PM local time, mining recent
sessions and `Inbox/` and running the same `ingest` procedure [[CLAUDE.md]] defines.

**Was Cowork-only, now broader.** The original version of this task ran inside a Cowork
sandbox and could only see ~4 Cowork sessions. It was deleted and replaced with a task of
the same name created from a Claude Code session — its first real run mined 14 actual
sessions via `list_sessions`/`list_events`, correctly told apart what was genuinely new
from what was already covered. See `runs/2026-07-27_a-brain-session-ingest_first-run.md`.

### 🔴 2026-08-10 — this task has recorded NOTHING since 2026-07-28

Found while testing a new detector, not by the task reporting a problem. Three artifacts agree:

- `runs/session-ingest-state.md` — last row dated **2026-07-28**.
- `runs/` — last ingest run log dated **2026-07-28**. Step 4 of the task's own prompt requires
  a run log every run.
- The scheduler reports `lastRunAt: 2026-08-09`. So it fires; it just records nothing.

**It also passed straight through the failure it exists to prevent.** 178 commits landed in
`kpm-inventory` between 2026-08-04 and 2026-08-10 with nothing written to this vault. That gap
was found and closed by hand on 2026-08-10 (`a5921e6`), not by this task.

**Cause — CONFIRMED 2026-08-10, and it is not what was first guessed.** The first write-up of this
page said [likely] the task could not see session history from a scheduled context. **That was
wrong**, and it is left here rather than deleted because the correction is the useful part: the
guess was plausible, cheap to believe, and would have sent a repair at completely the wrong
target. Reading the actual run transcripts settled it in one step.

The task is **dead on arrival**. Every run consists of exactly two messages — the prompt, then:

> There's an issue with the selected model (cc/claude-sonnet-5). It may not exist or you may not
> have access to it.

Identical on the 2026-08-03 and 2026-08-09 runs. It never reaches Step 0. `list_sessions` works
fine, and a run session exists for every single day (Aug 3-10, no gaps) — so it fires reliably and
dies instantly.

`cc/claude-sonnet-5` **does exist** on 9router (checked `/v1/models`: 57 models, 4 under the `cc/`
prefix). So it is the *"may not have access"* half — authentication. `/v1/chat/completions`
returns `{"error":{"message":"Missing API key"}}`, and 9router has had no usable credential.
Aldi generated one on 2026-08-10 and installed it himself.

It is still [[Wiki/Concepts/Silent Failure Disease|Silent Failure Disease]] in shape — a daily job
failing for two weeks with nobody told — but the mechanism is a locked door, not a blind one.

**How it was found:** not by the task reporting anything, and not by inspecting it. A new detector
was built for an unrelated reason, and testing *that* is what exposed it. Nothing in the system
was watching the watcher.

**What now covers it:** `.claude/vault-gap.mjs` in the kpm repo counts commits since the last
vault commit — pure git, always readable, no session history needed — and the `vault-gap-curator`
task (daily 19:13) reports when the number climbs. It only detects; it never writes. Deciding
whether to repair this ingest task or move the writing job elsewhere is **still open for Aldi**.

---

## 2. Claude Code CLI capture — revised recommendation

**Old plan:** a `SessionEnd` hook alone, dumping a raw transcript tail into `Inbox/`.

**Better, per the community pattern:** a `/save` slash command as the primary mechanism, with
the hook kept only as a safety net for sessions where Aldi forgets to run it. Reasoning: a
hook can only run a dumb script — it can't judge what's actually worth keeping. A slash
command runs *through Claude itself*, so it can write a real, judged summary (decisions made,
what's left, why), not just a raw log dump. Typing `/save` is a two-second habit, not "manually
asking the chat to do it" in the way Aldi wants to avoid — it's the same ask, just a fixed
one-word trigger instead of a paragraph each time.

### `/save` — install at `%USERPROFILE%\.claude\commands\save.md` (global, works in any project)

```markdown
---
description: Save this session's progress to the A-Brain vault
---

Write a session log to the A-Brain vault at
`D:\APP DEVELOPMENT\kpm inventory main FILES\A-Brain\runs\` (or the project's own
`logs/` subfolder if this is KPM work specifically — check [[../../index|the vault's root
index]] for the right domain).

1. Create a note named `YYYY-MM-DD_claude-code_<short-slug>.md` with frontmatter (`title`,
   `created`, `tags`) and body covering: what was actually done this session, decisions made
   and why, what's left / next steps, anything that surprised you or contradicts existing
   vault pages.
2. Add wikilinks to any existing vault pages this session touched or should update.
3. If this session's work should update an existing Wiki/Entity/Concept page (per
   [[../../CLAUDE.md|CLAUDE.md]]'s ingest rules), do that now rather than leaving it for a
   later pass.
4. If in a git repository, run `git add -A && git commit` with a message describing the
   change (do not push without being asked).
5. Report back in 2-3 sentences what got saved.
```

### `/resume` — install at `%USERPROFILE%\.claude\commands\resume.md`

```markdown
---
description: Load recent A-Brain vault context before starting work
---

Before doing anything else this session:

1. Read the 3 most recent files in
   `D:\APP DEVELOPMENT\kpm inventory main FILES\A-Brain\runs\` (or the relevant
   project's `logs/`, if one exists).
2. If this is KPM work, also skim `Wiki/Index.md` in that same vault for anything relevant to
   what's about to be worked on.
3. Summarize: what was done recently, what decisions are standing, what's left — in under 150
   words — before starting the actual task.
```

### Safety net — `SessionEnd` hook (kept, demoted to backup role)

Still worth installing so nothing is silently lost on sessions where Aldi forgets `/save`.
Same script and settings.json entry as before — see the version-controlled copy of this
section in git history if needed, or ask to have it re-drafted. It writes a raw transcript
tail into `Inbox/`, which the daily Cowork ingest task (section 1) then processes into real
content later — lower quality than `/save`, but zero-touch.

---

## 3. Token burn / direct access — revised recommendation (Graphify + 3-layer rule)

The community pattern splits this into two separate problems, matching what I'd already
identified, but with a concrete third piece I hadn't found before: **Graphify itself has an
official one-command Claude Code integration** that's simpler than hand-writing a CLAUDE.md
pointer.

### Step 1 — Wire Graphify into the KPM repo properly

Since Graphify is already installed as a Claude Code plugin, run this from inside the
`kpm-inventory` repo (not from here — that repo isn't connected to this sandbox):

```
graphify claude install
```

This one command does two things automatically: writes a `CLAUDE.md` section telling Claude
to read `graphify-out/GRAPH_REPORT.md` before answering architecture questions, and installs a
`PreToolUse` hook that fires before every `Glob`/`Grep` call, nudging Claude to check the
knowledge graph before grepping raw files. No manual CLAUDE.md editing needed for the code
side — Graphify's installer does it.

### Step 2 (optional) — Export the code graph into the vault as Obsidian notes

This is the part the Graphify+Obsidian videos specifically show. From inside the KPM repo, in
a Claude Code session:

```
/graphify . --obsidian --obsidian-dir "D:\APP DEVELOPMENT\kpm inventory main FILES\A-Brain\graphify\kpm-inventory"
```

This generates one note per function/module and drops them into a `graphify/kpm-inventory/`
folder inside the vault (scaffolded and ready — see below), so the code structure shows up
in Obsidian's graph view alongside the knowledge Wiki. Auto-generated notes — per the
community pattern, don't hand-edit them; re-run `/graphify . --update --obsidian` after
structural changes to refresh.

### Step 3 — Add the 3-layer query rule to the KPM repo's CLAUDE.md

This is the actual fix for the token-burn problem — a cheap rule, not a full vault load.
Append this to `kpm-inventory`'s own `CLAUDE.md` (can't do this myself — that repo isn't
connected here):

```markdown
## Context Navigation (3-layer rule)

1. **First:** query `graphify-out/graph.json` or `GRAPH_REPORT.md` for code structure and
   connections — Graphify's PreToolUse hook already nudges toward this.
2. **Second:** check the A-Brain vault for decisions, past incidents, and lessons learned —
   `D:\APP DEVELOPMENT\kpm inventory main FILES\A-Brain\Wiki\Index.md`. Especially
   worth checking for recurring-looking bugs: [[UI-Says-Yes-Server-Says-No Pattern]] and
   [[Anti-Recurrence Check]].
3. **Third:** only read raw code files when editing, or when layers 1-2 don't have the
   answer.

Don't re-read the whole codebase or the whole vault by default — both are structured
precisely so you don't have to.
```

**Reality check on the numbers:** the write-ups researched here cite figures like "71.5x fewer
tokens" and "499x token reduction," measured on a specific 126-file TypeScript project. Treat
the direction (structure-first navigation beats re-reading files) as solid — it's corroborated
across several independent sources — but not the exact multiplier, which will depend on KPM's
actual size and how often the graph needs rebuilding.

---

## 4. Claude.ai web chat — correction to my earlier claim

I previously said this surface was completely out of reach. That's not quite right: the
community pattern uses a **browser extension** ("Export Claude Chat to Markdown," Chrome/Edge)
to bulk-export claude.ai web conversations as markdown files, which then get dropped into
`Inbox/` for the daily Cowork ingest task to process — same destination as everything else.
It's a manual export step (not push-button automatic), but it's a real, working path, not a
dead end. Worth doing periodically if meaningful KPM discussion happens on claude.ai web
specifically, separate from Claude Code or Cowork.

---

## 5. "Dispatch" — likely resolved

Re-reading the Graphify docs: several platforms (Factory Droid, and Claude Code itself) use a
`Task` tool for **subagent dispatch** — spawning sub-conversations within one session. If
that's what "dispatch" meant, it's already covered: subagent activity lives inside the same
parent session transcript, so `/save`/`/resume` and the `SessionEnd` hook both already capture
it without anything extra. Flag if this guess is wrong.

---

## What's actually installed vs. still needs Aldi

| Piece | Status |
|---|---|
| Scheduled daily ingest task | **Live**, upgraded 2026-07-27 — real session mining (`list_sessions`/`list_events`), not Cowork-only anymore. Ran once, worked correctly. |
| `graphify/` folder scaffold in vault | **Done** |
| `/save`, `/resume` slash commands | **Installed** 2026-07-27 — `C:\Users\ASUS\.claude\commands\save.md` and `resume.md` |
| `SessionEnd` safety-net hook | **Not built — now an open question, not just a to-do.** The new ingest task already mines real session history directly, which may make this redundant. Watching a few more days of real runs before deciding either way. |
| `graphify claude install` (kpm-inventory) | **Done** 2026-07-27 — wrote `CLAUDE.md` + `.claude/settings.json` PreToolUse hooks, committed `c06ef7b`, pushed to `main`, CI build-check green |
| Initial graph build (kpm-inventory) | **Done** — `graphify update .`: 294 nodes, 509 edges, 21 communities. Sanity-queried against the known Fleet Captain permission pattern, returned correct results |
| Graphify wired into A-Brain itself | **Done** 2026-07-27 — 1356 nodes, 1715 edges, 168 communities across the whole vault |
| 3-layer CLAUDE.md rule for KPM repo | **Done** 2026-07-27, same commit as the graph build |
| Web chat export extension | Needs Aldi to install the browser extension and do exports himself |
| Obsidian → code-graph export (`/graphify . --obsidian`) | **Done** 2026-07-27 — 315 notes + a graph.canvas, committed |
| Vault + repo rename (2.1) | **Done** — folder, GitHub repo, and Obsidian's vault pointer all confirmed switched to A-Brain. Full detail: [[PLAN-A-Brain-agentic-OS]] task 2.1. |
| **Alucard** (`/alucard`) | **Built 2026-07-28** as a SKILL at `~/.claude/skills/alucard/`, not a subagent — see the reversal note below. 9,098 B, under its own 9,216 B cap. |
| `/godmode` | **Built 2026-07-28** — `~/.claude/commands/godmode.md`, 45 lines. Effort dial, explicitly NOT a permission dial. |
| Alucard self-edit guard | **Live and tested** — `permissions.deny` on `Edit(//c/Users/ASUS/.claude/skills/alucard/SKILL.md)` in user settings. Verified by attempting a real edit (blocked) and a real `lessons.md` edit (allowed). |
| Alucard learning loop | **Untested.** `lessons.md` seeded empty. Do not describe Alucard as "learning" until an entry has been written AND fired. Gate: [[runs/alucard-benchmark]]. |

## Why Alucard is a skill, not a subagent (2026-07-28 reversal)

Four planning rounds hardened a Communication Contract for a subagent. Then someone asked who
actually reads the output: **a subagent's final report is not shown to Aldi** — the parent
session relays what matters. So every contract-shaped sentence (the challenging first line,
the `[certain]` tags, the `not-chosen:` opportunity cost) would be paraphrased by a parent
agent that is not running the contract. The persona gets filtered out before he reads it.

A skill's instructions load into the **main** session. The main agent becomes Alucard and
talks to Aldi directly. Contract applies verbatim, no relay.

**The reversal fixed a second problem nobody named at the time:** the learning loop's capture
path. As a subagent, Alucard's conversation might not appear in the session transcript the
nightly ingest task reads (subagent-internal turns are neither user nor top-level assistant
messages) — the loop could have silently never captured anything. As a skill, its
conversations are ordinary main-session turns, and those are demonstrably captured (the
2026-07-28 third ingest run read real sessions via `list_sessions` and correctly reconciled
them). Verified, not assumed.

**not-chosen:** the subagent. It wins on context isolation and parallel dispatch. It lost
because Alucard's whole value is how it talks and what it challenges, and the subagent
boundary destroys exactly that. **Flips if** `/alucard`'s context load starts crowding out
real work in long sessions — then keep the skill as the advisor and add a thin worker
subagent with no contract.
