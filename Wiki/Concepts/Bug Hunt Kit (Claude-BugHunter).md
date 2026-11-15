---
title: Bug Hunt Kit (Claude-BugHunter)
description: His bug-hunting skill set for when the app is finished - stored, not installed; what the safety check found and how to use it on his own app only.
type: concept
confidence: high
checked: 2026-11-15
created: 2026-11-15
tags: [security, skills, bug-hunt]
---

# Bug Hunt Kit (Claude-BugHunter)

Aldi, 2026-11-15: *"btw i want u to have this skills with u when this app finishes https://github.com/elementalsouls/Claude-BugHunter.git"*.

**Stored, not installed:** `Skills-Library/claude-bughunter` (upstream commit 8ac4242, MIT, Sachin Sharma; 83 skills +
15 slash commands + a Python CLI; `.git`, `.github` and the image assets left out, 3.8 MB). Indexed: `node
automation/skill-find.mjs idor` finds `hunt-idor`. Installed in `~/.claude` its 83 auto-loading skills would ride in
every chat (see skill-index.mjs on the cost).

## Safety check (2026-11-15): caution

What was read: a pattern scan of all 274 text files (3.3 MB) for process execution, network calls, eval, secret paths,
installs, prompt-injection phrases and destructive commands; plugin.json; INSTALL.md's commands; the process and
network lines of cbh/cli.py and engine/recon.py; every prompt-injection hit. Not read line by line: the 83 SKILL.md
bodies.

- No hooks and no MCP servers: nothing runs when it is loaded.
- The "ignore previous instructions" hits are test payloads for hunting prompt-injection bugs in AI features, not
  orders to Claude.
- Its installer (`scripts/install.sh`, or the PowerShell one on Windows) puts a `hunt` script in `~/.claude/scripts` and
  adds it to the shell's startup files. Do not run it.
- Its skills and CLI install and run third-party scanners (gau, katana, curl, Burp) and send traffic to a target. That
  is a supply-chain risk and a legal one: only his own app, only on his word.

## How to use it when the app is finished

1. He names the target (his own app's addresses) and says go.
2. `skill-find` the bug class; load ONE SKILL.md at a time (each about 5k tokens).
3. Start with the code-reading hunts against the repo (IDOR, auth bypass, the Firestore rules) before any live scan;
   never scan the live app or its Firebase project without his OK (writes, quotas, his customers' data).

Links: [[Firestore Rules]] · [[Anti-Recurrence Check]] · [[Demo Guide on the Phone]]
