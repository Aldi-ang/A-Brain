---
status: DECIDED B 2026-10-14 (real cloud setup) - build next session; repos private 22:20
date: 2026-10-14
confidence: certain (each cause measured 21:56 WIB)
checked: GitHub API without login (both repos 200, "visibility": "public"); git -C A-Brain rev-list origin/main..HEAD = 674; kpm .claude/settings.json hook commands; ~/.claude/skills/alucard; ccd settings connect_new_sessions_to_remote_control = On
---

# Cloud sessions do not know Alucard or the app

## The problem, in his words

2026-10-14 21:5x: *"i have another session in the cloud but looks like that session cant recognize alucard and also didnt have enough knowledge about our app even when it already access the A-Brain why is that and how to fix that tho so that i can use cloud and all this features and skill that we have right now is still working there"*

## Why (all measured)

A cloud session runs on a fresh Linux machine with a clone of the GitHub repos. Only what is on GitHub goes with it.

| What | Where it lives | In the cloud |
|---|---|---|
| Alucard (SKILL.md + lessons.md) | `C:/Users/ASUS/.claude/skills/alucard` on his PC | missing |
| CC memory (MEMORY.md + files) | `C:/Users/ASUS/.claude/projects/.../memory` | missing |
| A-Brain | GitHub copy is from 2026-08-04; 674 commits on the PC were never pushed | 2.5 months stale |
| The 14 hooks (PROGRESS print, lessons, graphify, gates) | kpm `.claude/settings.json`, every command a `D:/...` Windows path | all fail |
| graphify | `C:/Users/ASUS/.local/bin/graphify` | missing |

## PRIVACY - found on the way

Both `Aldi-ang/A-Brain` and `Aldi-ang/kpm-inventory` are PUBLIC on GitHub. A-Brain's public copy holds `Personal-Context.md` and `Crypto-Learning/`. Pushing the 674 commits to "fix the cloud" would publish 2.5 months more. Step one of ANY fix: he makes A-Brain private himself (GitHub -> A-Brain -> Settings -> Danger Zone -> Change visibility).

## Options

| | What he gets | Cost |
|---|---|---|
| A | Remote Control: the session runs on his PC, he drives it from claude.ai/code or the phone. Everything works as now. Already ON for every new session on this PC | the PC must be on and online |
| B | A real cloud session that knows everything: A-Brain private + pushed, Alucard + lessons + memory copied into A-Brain, a cloud-only start-up step that clones A-Brain and installs graphify, the 14 hooks rewritten to work on both machines | about one session to build; two copies of the skill to keep in sync; A-Brain must be pushed at the end of every session from then on |

## Decision

2026-10-14 22:2x - DECIDED B. His words: *"both is private now kpm inventory and A brain, well i want real cloud setup so that i can use all the skills and agent without having my pc on but this cloud is paid isnt?"* Checked 22:20: both repos answer 404 without login (private).

**Price (Anthropic docs, code.claude.com/docs/en/claude-code-on-the-web, read 22:2x):** cloud sessions come with Pro / Max / Team; *"It counts toward your plan's usage limits ... there's no separate charge for the cloud VM."* So no extra money - but PC and cloud sessions burn the SAME quota.

**What the docs say reaches a cloud session** (code.claude.com/docs/en/cloud-environments, "What carries over"): the repo's CLAUDE.md, `.claude/settings.json` hooks (ONLY in a one-repo session), `.claude/skills/`, `.claude/agents/`, `.claude/commands/`, `.claude/rules/`; skills enabled on claude.ai. NOT: `~/.claude/*` (skills, agents, CLAUDE.md, settings), plugins (ponytail will not load), local MCP servers. A session with several repos loads NO repo hooks. Network "Trusted" (default) allows pypi + npm + GitHub (through a proxy that signs in for him). Setup script = Bash as root on Ubuntu 24.04, cached if under ~5 min. `CLAUDE_CODE_REMOTE=true` only in the cloud.

**The build (next session, one job):**
1. His step: the Claude GitHub App must reach both private repos (github.com/apps/claude -> Configure -> Repository access).
2. Alucard + lessons -> kpm `.claude/skills/alucard/` (repo is private now); on the PC `~/.claude/skills/alucard` becomes a junction to it - ONE copy. Same for `~/.claude/agents/lancelot.md` -> kpm `.claude/agents/`.
3. SKILL.md names A-Brain by its `D:\...` path - on the cloud machine Alucard would stop. Needs HIS approval of the new wording ("A-Brain = the folder A-Brain next to the app folder") - his settings `ask` rule, never edit it silently.
4. The 14 hooks: `D:/...` -> `$CLAUDE_PROJECT_DIR/...` and `$CLAUDE_PROJECT_DIR/../A-Brain/...`; PC-only ones (plan-quota / 9Router) exit early when `CLAUDE_CODE_REMOTE=true`. 7 A-Brain automation scripts carry hard paths (export-app-for-sale, graphify-answer-hook, lessons-flush, lessons-health, skill-find, skill-index, vault-gap) - make them relative to their own folder.
5. One new cloud-only SessionStart hook: clone A-Brain next to the repo (GitHub proxy), `pip install graphifyy==0.9.26`, print `.claude/memory/MEMORY.md`.
6. CC memory -> kpm `.claude/memory/` with a PC junction (one copy).
7. A-Brain: push the 674 commits (private now). Then it must be pushed at every session end, or the cloud reads stale notes - his call whether a Stop hook does it.
8. Prove it: one real cloud session that runs `/alucard`, answers a vault question from A-Brain, and runs `graphify query`.

Will still be PC-only after the build: the browser pane on his screen, 9Router, the ponytail plugin, the Firebase emulator unless the setup script installs Java.

## Rejected on purpose

Putting Alucard or any personal file in kpm-inventory - the repo is public.

Models applied: Inversion (what has to be true for the cloud to know what this PC knows - every file it reads must be on GitHub, and nothing private may be), Opportunity Cost (B costs a session to rebuild what Remote Control already gives).
