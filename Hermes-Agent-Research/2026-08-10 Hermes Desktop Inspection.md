---
title: "2026-08-10 Hermes Desktop Inspection"
description: First read-through of Hermes Agent's installed source (Electron shell + Python backend) — architecture, agent loop, and what looks portable to alucard.
type: note
created: 2026-08-10
updated: 2026-08-10
confidence: medium
checked: 2026-08-10
tags: [hermes, ai-agents, architecture, alucard-candidate]
---

# 2026-08-10 — Hermes Desktop Inspection

Aldi's ask: read everything in his installed Hermes Agent, understand how its "agentic" parts
work, report back — no changes yet, no porting yet.

## What Hermes Agent is

Open-source (MIT) personal AI agent by Nous Research. `productName: Hermes`, desktop app
version 0.17.0. One agent core reused across five surfaces: CLI, TUI (terminal UI), an Electron
desktop chat app, a web dashboard, and a messaging gateway (Telegram/Discord/Slack/WhatsApp/
Signal/~20 platforms). Not tied to one model — works with any provider (Anthropic, OpenAI,
OpenRouter, a first-party "Nous Portal" that bundles model + web search + image gen + TTS +
cloud browser under one subscription).

## What was actually on the machine

The installed desktop app (`%LOCALAPPDATA%\hermes\hermes-agent\apps\desktop\release\win-unpacked`)
is just an Electron **shell** — it does not contain the agent itself. Its `resources/app.asar`
(extracted with `npx asar extract`) is ~330 minified JS bundles for the renderer plus one
readable `electron-main.mjs` (~21.6k lines, un-minified variable structure, esbuild output).

Reading `electron-main.mjs` showed the real pattern: on first run the desktop app **bootstraps
a separate Python backend** (`hermes_cli` package, installed via a managed `uv`-created venv)
and spawns it as a child process: `<hermes> --profile <name> serve --host 127.0.0.1 --port 0`.
The Electron app then talks to that local backend over HTTP + a token-authed WebSocket
(`ws://127.0.0.1:<port>/api/ws`). Multiple "profiles" run as separate pooled backend processes
with LRU idle eviction. This backend process **is** the actual agent — tool loop, model calls,
memory, everything. The desktop app is a thin, swappable UI on top of it (so is the CLI, the
TUI, and the messaging gateway — same backend, four fronts).

Because it had actually been installed and used (last run 2026-08-07), the real backend source
was sitting on disk at `%LOCALAPPDATA%\hermes\hermes-agent\` — a full git checkout, not a
compiled blob. That's what the rest of this note is read from: `README.md` and `AGENTS.md`
(the project's own dev-guide, written *for* AI coding assistants working on it — see
`AGENTS.md:1-3`), plus the top-level layout of `agent/`, `gateway/`, `tools/`, `plugins/`.

**Not read:** `.env`, `.anthropic_oauth.json`, `auth.json` — his real credentials for this app.
Structural existence only, no values, per the standing rule against handling secrets.

## The agent loop itself

`run_agent.py` → `AIAgent` class (~12k LOC), core loop lives in `run_conversation()`. Per
`AGENTS.md:350-367`, it's a plain synchronous loop, nothing exotic:

```python
while (api_call_count < self.max_iterations and self.iteration_budget.remaining > 0) \
        or self._budget_grace_call:
    if self._interrupt_requested: break
    response = client.chat.completions.create(model=model, messages=messages, tools=tool_schemas)
    if response.tool_calls:
        for tool_call in response.tool_calls:
            result = handle_function_call(tool_call.name, tool_call.args, task_id)
            messages.append(tool_result_message(result))
        api_call_count += 1
    else:
        return response.content
```

Default `max_iterations=500`. Messages are plain OpenAI-format role turns. Nothing here is
more sophisticated than what Claude Code itself does — the interesting design is everywhere
*around* this loop, not in it.

## Tools: a deliberately narrow core, everything else pushed to the edges

`tools/registry.py` — zero-dependency registry that every `tools/*.py` file self-registers
into at import time (`registry.register(name, toolset, schema, handler, check_fn, ...)`).
`toolsets.py` decides which registered tools actually get exposed to a given agent instance
(auto-discovery ≠ automatic exposure — a tool can be imported and still invisible to the model
unless it's in a toolset).

The load-bearing design rule (`AGENTS.md:16-27`): **every tool schema is sent on every single
API call**, so a new *core* tool is treated as expensive, permanent surface. They wrote down a
strict escalation order before adding anything new (`AGENTS.md:182-211`, "The Footprint
Ladder"):

1. Extend existing code — zero new surface.
2. CLI command + skill (agent runs `hermes <subcommand>`, guided by a skill doc) — zero
   model-tool footprint. Default choice.
3. Service-gated tool (`check_fn` — only appears in the schema when a prerequisite, e.g. an API
   key, is configured).
4. Plugin (`~/.hermes/plugins/`, discovered at runtime, not shipped in core).
5. MCP server, added to a catalog — reusable by any MCP host, zero core-schema cost.
6. New core tool — last resort, only for something fundamental and broadly useful
   (terminal, read_file, web_search, browser_navigate are their examples).

This is the same instinct as [[Ponytail Philosophy]]'s ladder, aimed specifically at *tool
schema bloat* rather than code bloat — worth stealing as a naming/discipline, not as code.

## Prompt caching discipline

Called out twice as one of two things that "shape almost every design decision"
(`AGENTS.md:16-23`): the system prompt must be **byte-stable for the life of a conversation**,
and nothing may swap toolsets or rebuild the prompt mid-conversation (breaks a cached prefix,
multiplies the user's real API cost). Strict message role alternation is enforced for the same
reason (never two same-role messages in a row; never a synthetic user message injected
mid-loop). The one allowed exception is context compression.

## The self-improving skill loop — the standout feature

This is the part of Hermes that doesn't have a KPM/alucard equivalent yet. Two pieces:

- **`tools/skill_manager_tool.py`** — the agent itself can create, edit, patch, and delete
  skills (`~/.hermes/skills/<name>/SKILL.md` + supporting files) as it works. Skills are framed
  explicitly as *procedural* memory ("how to do a specific type of task") vs. `MEMORY.md`/
  `USER.md` which are *declarative* memory (facts about the user). New skills get written from
  successful approaches mid-task.
- **`agent/curator.py`** — a background maintenance job, **not** a cron daemon: it fires only
  when the agent goes idle and the last curator run was longer than `interval_hours` ago
  (`config.yaml: curator.*`). It spawns a second, forked `AIAgent` instance on a cheaper
  auxiliary model to review every agent-created skill and pin / archive / consolidate / patch
  them. Hard invariants documented at the top of the file: only ever touches agent-created
  skills, **never auto-deletes — only archives** (recoverable), pinned skills are exempt from
  all auto-transitions, and it uses a separate auxiliary client so it never touches — and can
  never invalidate — the main session's cached prompt.

Read together with `SOUL.md` (the persona seed, one short paragraph,
`%LOCALAPPDATA%\hermes\SOUL.md`) this is a genuinely different shape from how `alucard` works
today: alucard's `lessons.md` is hand-curated by the *same* agent instance during the *same*
session, capped at 5 entries, archived manually. Hermes runs skill maintenance as a **separate
agent, on a separate model, on its own schedule**, so it never costs anything against the live
conversation's cache or budget.

## Other pieces worth knowing about, briefly

- **Delegation** (`tools/delegate_tool.py`, `agent/subagent_lifecycle.py`,
  `agent/async_delegation.py`) — spawns isolated subagents for parallel workstreams, and can
  write plain Python scripts that call tools via RPC to collapse multi-step pipelines into a
  single turn. **Directly conflicts with alucard's own "never spawn subagents" rule** — noted
  as a difference, not a recommendation to copy.
- **Memory** — agent-curated `MEMORY.md`/`USER.md` with periodic self-nudges to persist new
  facts, FTS5 full-text session search (`hermes_state.py` — SQLite + FTS5) with LLM
  summarization for cross-session recall, and optional "Honcho" dialectic user modeling (a
  continuously-updated model of who the user is, built automatically). alucard already does
  the user-modeling piece by hand (`Aldi's Design Taste.md`, `Personal-Context.md`) — this is
  the same idea, automated.
- **Terminal backends** — seven of them (local, Docker, SSH, Singularity, Modal, Daytona,
  Vercel Sandbox), so the same agent can run against a local shell or a serverless sandbox that
  hibernates when idle. Not relevant to alucard's use case (KPM/personal advisor, no remote
  execution need).
- **Security defaults** — secret redaction is on by default: strings that look like API keys/
  tokens/passwords get masked in tool output, logs, and chat responses *before* the model or
  user sees them (`config.yaml:164-169`). Worth a look for KPM's own logging/error paths
  separately — not evaluated here.
- **Config split** — `config.yaml` for all behavioral settings, `.env` for secrets only,
  enforced as a contribution rule (`AGENTS.md:102-107`): a PR that tells a user to "set X in
  your `.env`" for a non-secret gets rejected outright. Clean separation, easy rule to state.

## What looks portable to `alucard` (not yet done — Aldi's call)

1. **Footprint Ladder framing** for deciding when a new standing rule/lesson in `alucard`'s own
   SKILL.md earns a permanent slot vs. staying a one-off note — same spirit as
   [[Ponytail Philosophy]], different target (prompt/rule bloat instead of code bloat).
2. **A separate, scheduled lessons-maintenance pass** instead of manual archiving at cap —
   the curator pattern (idle-triggered, auxiliary model, archive-never-delete, pinned entries
   exempt) could replace alucard's current "cap 5, archive oldest with zero fires" manual step.
   Would need a scheduling mechanism alucard doesn't have today (no idle-trigger, no auxiliary
   model call available to a skill).
3. **Byte-stable prompt discipline, named explicitly** — alucard's "load only what the task
   needs" already avoids most of this, but Hermes' AGENTS.md states the *reason* (cache
   invalidation cost) as a first-class design law, worth stating the same way rather than
   leaving it implicit.

Not recommended to copy: subagent delegation (explicitly against alucard's existing rule),
multi-platform gateway/messaging surfaces (no use case here), remote terminal backends (no use
case here).

## Sources

- `%LOCALAPPDATA%\hermes\hermes-agent\` — full git checkout, real backend source (README.md,
  AGENTS.md, `agent/`, `gateway/`, `tools/`, `plugins/`, `toolsets.py`, `run_agent.py`).
- `%LOCALAPPDATA%\hermes\hermes-agent\apps\desktop\release\win-unpacked\resources\app.asar` —
  extracted with `npx asar extract` into the session scratchpad (not kept — scratchpad is
  session-temp).
- `%LOCALAPPDATA%\hermes\SOUL.md`, `config.yaml` (scanned for secrets before reading — none
  found, redaction-related comments only).
