---
title: "Skill Audit — 2026-07-27"
description: Task 1.1 workflow audit via session mining. Table of repeated tasks found in available sessions, mapped to proposed skills.
type: audit
created: 2026-07-27
updated: 2026-07-27
tags: [meta, plan, skill-audit]
---

# Skill Audit — 2026-07-27

Task 1.1 from [[PLAN-A-Brain-agentic-OS]]: "pull real past sessions and identify repeated
tasks that aren't skills yet."

## Important limitation — read before trusting this audit

This audit only had access to **4 local Cowork sessions** via the `session_info` tool. It
does **not** cover Aldi's Claude Code CLI history, where most of the hard-won KPM lessons in
[[A-Brain-Project-Context]] actually happened (abandoned git worktrees, Firestore rules
incidents, etc.) — that history isn't reachable from this sandbox. Treat the findings below as
a real but partial sample, not a complete picture. Re-run this audit with CLI session access
when possible, per the plan's own instruction to use real data, not guesswork.

## Sessions mined

| Session | What happened |
|---|---|
| "KPM cowork" | QA-tested a merged PR against the live `cello-inventory-manager` Firebase app via browser automation. Found root cause (Storage not provisioned), refused to make a billing change himself, cleaned up test Firestore data, explicitly flagged a real-data side effect (real product's stock touched during testing). |
| "New skills safety check" | Reviewed 8 new Claude skills file-by-file for safety (shell exec, network calls, eval, exfiltration, prompt injection) before installing, gave a per-skill verdict. |
| "MLBB drafting phase app" | Iterative feature development on a single-file HTML web app (not KPM) — read/edit JS/CSS/HTML per a plain-language UI request, then ran headless behavioral verification (linkedom) before presenting the file. |
| "Mlbb draft assistant refresh" | A scheduled task (already automated, already a working example of plan item 1.4) that scrapes external sites for updated game stats, regex-parses them, validates before writing, and only touches specific data constants in an existing file. Worth noting as proof automations already work here, not a new pattern. |

## Findings: task → expected output → proposed skill

| Task | Expected output | Proposed skill | Tier (per [[PLAN-A-Brain-agentic-OS]] transferability split) |
|---|---|---|---|
| Test a PR/feature against the live Firebase/Firestore app | Pass/fail per test case, root cause traced to actual Firestore/Storage/console state (not UI appearance), test data safely cleaned up or explicitly flagged if it touched real records, no billing/infra changes made without asking | **`firebase-live-qa`** — built, see below | Stack-specific (Firebase) |
| Vet a new Claude skill before installing/using it | Per-skill verdict (safe/caution/unsafe) with specific reasoning, files actually read not just described | **`skill-safety-check`** — built, see below | Universal |
| Iterate on a single-file web app from plain-language UI requests, verify behavior before delivering | Working file with all requested changes, headless behavioral check run first, assumptions made explicitly flagged | Candidate: `single-file-app-iterate` — **not built yet**, only one occurrence in this sample, want a second real instance before codifying | Universal |
| Scheduled data-refresh of an existing single-file app from external sources | Updated data constants only, JSON-validated before write, existing logic untouched, summary of what changed | Already working (the MLBB refresh task itself). Worth writing up as a **reusable pattern doc**, not a new skill, since the skill is really "how to write a good scheduled-task prompt" — could fold into `delegate-coding-task` later | Universal |

## What was built this pass

Per the plan's own instruction ("not all at once... build the highest-frequency ones first,
validate they work, then expand"), only the two clearest, most immediately valuable candidates
were built now:

1. **`firebase-live-qa`** — directly encodes hard-won lessons already documented in
   [[A-Brain-Project-Context]] (verify against reality, never trust the UI alone, security/
   billing changes need Aldi present). High value because this exact pattern will almost
   certainly recur on KPM and future Firebase client apps.
2. **`skill-safety-check`** — general-purpose, low-risk to codify, and Aldi will keep
   discovering new skills over time, so this has a clear repeat use case even from a sample of
   one.

`single-file-app-iterate` and the scheduled-refresh pattern are logged here as candidates,
not built, pending a second real occurrence — consistent with the plan's warning against
building automations before they're validated as actually repeating.
