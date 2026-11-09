---
title: "Alucard in Antigravity"
description: How Alucard, his Claude Code skills and A-Brain memory are loaded into every Google Antigravity chat - the a-brain plugin, what ports, what does not, and how to check it fired.
type: concept
created: 2026-11-10
updated: 2026-11-10
confidence: likely
checked: 2026-11-10
tags: [antigravity, alucard, skills, memory, setup]
---

# Alucard in Antigravity

**His ask, 2026-11-10:** *"i want all the skills and memory of A-Brain to be used inside antigravity at all time
and also i want alucard agent to be use there can we do that?"*

**Status:** built and self-checked; the live load inside Antigravity is UNVERIFIED until one new chat is opened
and `last-fired.txt` (below) exists. `confidence: likely` until then.

## What was built

| Piece | Path | Does |
| :-- | :-- | :-- |
| plugin | `C:/Users/ASUS/.gemini/config/plugins/a-brain/` | Antigravity's global customization root is `~/.gemini/config/` |
| always-on rule | `plugins/a-brain/rules/AGENTS.md` (~4 KB) | A-Brain path + memory protocol, Claude Code → Antigravity tool map, hard limits |
| SessionStart hook | `plugins/a-brain/hooks.json` → `session-start.mjs` | injects the FULL `~/.claude/skills/alucard/SKILL.md` into every new chat, plus lessons-health; in a kpm workspace also progress-head, session-start-context, vault-gap |
| skills | `C:/Users/ASUS/.gemini/config/skills.json` → `C:/Users/ASUS/.claude/skills` | all ~114 Claude Code skills, by name + description only (progressive disclosure) |
| copied skills | `plugins/a-brain/skills/{caveman,karpathy-guidelines,ponytail}` | the three Alucard §0/§6 needs that are NOT in `~/.claude/skills` (Claude app plugin / Skills-Library / ponytail plugin cache) |
| self-check | `plugins/a-brain/test.mjs` | 17 checks; `node test.mjs` from the plugin folder. The `~/`-path guard was run RED on the old value first |

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

## How to check it fired

1. Fully close Antigravity, reopen (skills.json was fixed after it started), open any new chat.
2. `C:/Users/ASUS/.gemini/config/plugins/a-brain/last-fired.txt` now holds time, conversation id, `inKpm`, bytes,
   workspace. Only a real Antigravity payload (it carries `conversationId`) writes it - `test.mjs` never does.
3. Ask the chat "who are you?" - the answer should come from Alucard, caveman-terse.

`agentapi new-conversation` cannot be used from outside Antigravity: it needs the language server's CSRF token,
which was deliberately not extracted.
