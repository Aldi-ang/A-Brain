---
title: "Raw: Claude Code CLI Install (McAfee Block) + Ponytail Marketplace Install"
description: Session transcript excerpt — installing the Claude Code CLI on Aldi's machine, diagnosing a silent download freeze caused by McAfee, then installing the ponytail plugin marketplace non-interactively.
type: raw-source
created: 2026-07-27
tags: [raw, tooling, environment]
---

Source: CCD session "Plugin marketplace DietrichGebert/ponytail"
(session_id local_4ab09dd8-80cc-459d-8301-e5da6b1be52d), branch
`claude/plugin-marketplace-ponytail-68e37f`, active 2026-07-26 10:01–10:46 UTC.
Captured via `list_events` transcript rendering during the 2026-07-27 scheduled ingest run —
paraphrased assistant summary preserved verbatim below, tool-call details compressed.

---

## What was freezing the PowerShell window

Not the internet connection or an outdated TLS setting — both checked out fine. The real
cause: **McAfee** (McAfee Framework Host + WebAdvisor were running on the machine). McAfee
intercepts and scans large HTTPS downloads. The Claude Code installer needs to download a
~253MB file; McAfee's scanning got stuck partway through, so the download would silently
freeze — no error, no output, nothing. The assistant reproduced this exact freeze twice (once
with the official install script, once with `winget`), confirmed not guessed.

## Workaround used

Switched to `curl` as the download tool, which pushed through slowly (~250KB/s) instead of
stalling completely. Verified the downloaded file's checksum against Anthropic's official
record before running the installer's setup step — matched exactly.

## Result

- `claude --version` → `2.1.220 (Claude Code)`, confirmed working.
- Binary installed to `C:\Users\ASUS\.local\bin\claude.exe` — that folder was not yet on
  Windows PATH at the time, so `claude` alone wouldn't resolve from a fresh PowerShell window
  until the user added it manually (Environment Variables → Path → add
  `C:\Users\ASUS\.local\bin`).

## Ponytail plugin marketplace — installed non-interactively

Discovered `claude` has real non-interactive subcommands for plugin management, not just the
interactive `/plugin` slash command:

```
claude plugin marketplace add DietrichGebert/ponytail
claude plugin install ponytail
```

Both succeeded without needing an interactive session. Final verification:

```
ponytail@ponytail
Version: 4.8.4
Status: enabled
```
