---
title: Claude Code CLI Install — McAfee Download Freeze
description: Installing the Claude Code CLI on Aldi's Windows machine silently froze; root cause was McAfee intercepting the ~253MB HTTPS download. Also covers the non-interactive ponytail plugin marketplace install.
type: summary
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
tags: [ingest, environment, tooling]
source: "[[../../Raw/2026-07-26_source_claude-cli-install-mcafee-ponytail-marketplace.md]]"
---

# Summary: Claude Code CLI Install — McAfee Download Freeze

**Source**: session "Plugin marketplace DietrichGebert/ponytail", 2026-07-26.

## What happened

Installing the Claude Code CLI on Aldi's Windows machine kept silently freezing mid-download
— no error, just a stuck PowerShell window. Ruled out internet connection and TLS config.
Root cause, confirmed by reproducing it twice: **McAfee** (Framework Host + WebAdvisor)
intercepts and scans large HTTPS downloads, and got stuck partway through the installer's
~253MB file.

**Workaround:** downloaded via `curl` instead (throttled to ~250KB/s but didn't stall),
verified the checksum against Anthropic's official record before running install. Result:
`claude --version` → `2.1.220`, binary at `C:\Users\ASUS\.local\bin\claude.exe` (needed a
manual PATH addition — not automatic).

## Ponytail plugin — installed non-interactively

`claude plugin marketplace add <owner>/<repo>` and `claude plugin install <name>` work as
plain non-interactive CLI subcommands, not just the interactive `/plugin` slash command.
Used to install `DietrichGebert/ponytail` → `ponytail@ponytail` v4.8.4, enabled. Same
ponytail plugin now governs how [[../../CLAUDE.md|this vault's own maintainer]] and the real
`kpm-inventory` repo write code — see [[Ponytail Philosophy]].

## Why this is worth keeping

Environment-level, not KPM-specific — transferable to any future large download/install on
this same machine. If a future install silently hangs, check McAfee/antivirus interception
before assuming a network problem.

## Ripple — pages this touches

- [[Ponytail Philosophy]] — noted the actual install mechanism behind the plugin now in use.
