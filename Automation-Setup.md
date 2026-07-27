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

## 1. Live now — Cowork session auto-ingest (unchanged, still good)

A daily scheduled task, `a-brain-session-ingest`, runs at 9:02 PM local time, mining recent
Cowork sessions and `Inbox/` and running the same `ingest` procedure [[CLAUDE.md]] defines.
Scope: Cowork sessions only — this is the one surface this sandbox can actually reach.

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
| Cowork daily ingest task | **Live** |
| `graphify/` folder scaffold in vault | **Done** (this pass) |
| `/save`, `/resume` slash commands | Drafted above — needs Aldi to save the files to `%USERPROFILE%\.claude\commands\` |
| `SessionEnd` safety-net hook | Drafted in git history of this doc — needs install + verification |
| `graphify claude install` | One command — needs Aldi to run it inside `kpm-inventory` |
| 3-layer CLAUDE.md rule for KPM repo | Text ready above — needs Aldi to paste it (or connect that repo folder here) |
| Web chat export extension | Needs Aldi to install the browser extension and do exports himself |

## Rename (2.1) sequencing — unchanged

Per Aldi's instruction: rename the vault/repo only after this automation is actually in place,
not before. Still blocked on the items in the table above that need Aldi's own machine.
