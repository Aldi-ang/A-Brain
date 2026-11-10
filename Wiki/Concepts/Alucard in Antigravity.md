---
title: "Alucard in Antigravity"
description: How Alucard, his Claude Code skills and A-Brain memory are loaded into every Google Antigravity chat - the a-brain plugin, what ports, what does not, and how to check it fired.
type: concept
created: 2026-11-10
updated: 2026-11-10
confidence: certain
checked: 2026-11-10
tags: [antigravity, alucard, skills, memory, setup]
---

# Alucard in Antigravity

**His ask, 2026-11-10:** *"i want all the skills and memory of A-Brain to be used inside antigravity at all time
and also i want alucard agent to be use there can we do that?"*

**Status:** live. The hook fired in a real chat at 2026-11-10 06:56 WIB (`last-fired.txt`: convo 27678e44,
kpm workspace, 60,706 bytes injected); the reply named itself Alucard, quoted PROGRESS correctly and ended with the
§11 closing line. Skills listing inside Antigravity is still unverified - only the absence of the path error proves it.

## Already there before this: the partner split (2026-11-08)

kpm-inventory-main has its own `GEMINI.md` (commits 1497ebe, 8f5e6ae, bae4cd3). His words, 2026-11-08: *"i want u
alucard on claude is the one who responsible for our app project and i want antigravity as your partner to do your
task"*, and on who puts work live, *"1 is safer so lets do that"*. So in that repo Antigravity takes one task at a time
from `.claude/ANTIGRAVITY-TASK.md`, commits locally, never pushes, and never edits `PROGRESS.md` or `NEXT-SESSION.md`.

This note's plugin was built without finding that file (no vault note carried it - the graph found nothing for
"antigravity"). The first live chat showed the clash: Alucard §11 tells it to write PROGRESS.md and NEXT-SESSION.md.
Fixed in the plugin rule: **a workspace's own role file outranks Alucard**, with the kpm split written out. Guarded by
`test.mjs` (run RED first).

**Decided 2026-11-10 07:00 WIB.** Asked "partner or full Alucard lead in kpm?", his answer: *"Keep partner"*. Do not
re-propose Antigravity as kpm lead (REJECTED ON PURPOSE: two writers on PROGRESS.md / NEXT-SESSION.md).

## What was built

| Piece | Path | Does |
| :-- | :-- | :-- |
| plugin | `C:/Users/ASUS/.gemini/config/plugins/a-brain/` | Antigravity's global customization root is `~/.gemini/config/` |
| always-on rule | `plugins/a-brain/rules/AGENTS.md` (~4 KB) | A-Brain path + memory protocol, Claude Code → Antigravity tool map, hard limits |
| SessionStart hook | `plugins/a-brain/hooks.json` → `session-start.mjs` | injects the FULL `~/.claude/skills/alucard/SKILL.md` into every new chat, plus lessons-health; in a kpm workspace also progress-head, session-start-context, vault-gap |
| skills | `C:/Users/ASUS/.gemini/config/skills.json` → `C:/Users/ASUS/.claude/skills` | all ~114 Claude Code skills, by name + description only (progressive disclosure) |
| copied skills | `plugins/a-brain/skills/{caveman,karpathy-guidelines,ponytail}` | the three Alucard §0/§6 needs that are NOT in `~/.claude/skills` (Claude app plugin / Skills-Library / ponytail plugin cache) |
| self-check | `plugins/a-brain/test.mjs` | 18 checks; `node test.mjs` from the plugin folder. The `~/`-path guard was run RED on the old value first |

**Single source on purpose:** Alucard's SKILL.md is read at every chat start, never copied, so an approved edit in
Claude Code reaches Antigravity on the next chat. The three copied skills are third-party and stable.

## Why a hook and not a rule

- Antigravity caps one rule file at **24,000 bytes** (truncated on line boundaries) and all always-on rules share a
  **20,000-token** budget. SKILL.md is 48 KB - as a rule it would lose §5 onward silently.
- An "always read SKILL.md first" rule depends on the model obeying, and his setting
  `nonWorkspaceFileAccessPolicy = ASK` would put a permission prompt on every chat.
- The SessionStart hook runs as a command (not an agent tool), so it reads the file without a prompt.
- No separate Alucard agent file: the hook makes EVERY chat Alucard, so there is nothing to pick.

Source for all of this: Antigravity's own builtin skill `~/.gemini/antigravity/builtin/skills/agy-customizations/`
(`docs/rules.md`, `skills.md`, `hooks.md`, `plugins.md`, `json_configs.md`) and `builtin/skills/plugin/SKILL.md`.

## The trap that was caught

The docs say `skills.json` paths starting with `~/` resolve to home. **On Windows they do not.** The language server
log said: `Failed to resolve absolute path "~/.claude/skills": ~/.claude/skills must be an absolute path`.
Fixed to `C:/Users/ASUS/.claude/skills`. Log: `C:/Users/ASUS/AppData/Roaming/Antigravity/logs/language_server.log` -
grep `customization.go` after any customization change. A wrong path here fails silently in the UI.

## What does NOT port (Claude Code hooks)

Stop hooks (check-progress, lessons-flush, wiki-graph-refresh, vault-push), PreToolUse gates (fanout-gate,
heredoc-gate, graphify-answer-hook) and UserPromptSubmit (context-watch, plan-quota) do not run in Antigravity.
The rule tells the agent to do them by hand and never claim one fired. Porting them means wrapping each in
Antigravity's JSON contract (`decision` for PreToolUse, `decision: "continue"` for Stop) - not done; vault-push
in particular would push from a second tool and needs his own yes.

## Conflicts to know

- Antigravity's **firebase** plugin ships a subagent `firestore-rules-author` marked "MANDATORY" for any
  `firestore.rules` change. Alucard §9a (no subagents unless he says yes) wins; the rule says so by name.
- Claude Code and Antigravity write the same `lessons.md`, `PROGRESS.md` and vault files. Same two-track rule:
  add, never rewrite, re-read before edit.
- Cost: a kpm-workspace chat starts with ~61 KB injected (~15k tokens, [likely]); other workspaces ~49 KB. That is
  Antigravity's (Google) quota, not the Claude plan.

## What to hand it - thinking, never clicking (his call, 2026-11-10)

Aldi, after its round-4 media run (AI Studio voice takes + Flow clips) went slow and asked him for permission over
and over: *"next time we just give antigravity job thats need thinking, not physical like this, it takes so much time,
and its job is really inefficient, i rather ask u make the prompt and give me the step to input inside google flow or
ai studio to work faster"*.

- Give it: read-only audits (the 38-findings sweep), research, reviews, self-contained code fixes.
- Never give it: driving a browser or clicking through a website (AI Studio, Flow, test walks). Each new browser action
  asked him once, the sign-in had to be his, and its first try made nothing at all.
- Media from Google tools: Claude writes the exact prompts and click steps; Aldi pastes them into Flow / AI Studio
  himself and drops the files in a folder. Faster for him, no quota for either agent.
- Same rule lives in the app's `CLAUDE.md` (Antigravity section).

## How to check it fired

1. Fully close Antigravity, reopen (skills.json was fixed after it started), open any new chat.
2. `C:/Users/ASUS/.gemini/config/plugins/a-brain/last-fired.txt` now holds time, conversation id, `inKpm`, bytes,
   workspace. Only a real Antigravity payload (it carries `conversationId`) writes it - `test.mjs` never does.
3. Ask the chat "who are you?" - the answer should come from Alucard, caveman-terse.

`agentapi new-conversation` cannot be used from outside Antigravity: it needs the language server's CSRF token,
which was deliberately not extracted.
