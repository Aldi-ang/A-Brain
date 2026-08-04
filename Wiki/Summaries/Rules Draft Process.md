---
title: Rules Draft Process
description: The house rule — document a blocked security fix in a comment, never silently skip it or fake-fix it.
type: summary
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
tags: [ingest, process, firestore]
source: "[[../../Raw/2026-07-24_source_rules-draft-process.md]]"
---

# Summary: Rules Draft Process

**Source**: the `project_kpm_rules_draft_process` memory, 2026-07-24.

## What it establishes

`firestore.rules` in the repo is a **draft**, headed explicitly
"RECONCILED DRAFT — NOT DEPLOYED." The actual live rules are a separate frozen file,
`firestore.rules.deployed-baseline`, and moving a draft to production is a manual step the
project owner performs themselves. This is the source material behind
[[Draft-Then-Deploy Discipline]].

## The documentation convention

When a security/scoping question is investigated and found blocked (not safely fixable
without a larger change), the finding becomes a comment block directly above the relevant
rule — no functional change, just an honest paper trail explaining what was checked and why
it's blocked. First established for the `transactions` collection, repeated for
`customers`/`notifications`, and again for [[Rank Config and Achievement Badges]]'s
cross-tenant gap.

## Ripple — pages this touches

- [[Draft-Then-Deploy Discipline]] (this is that concept's primary source)
- [[Firestore Rules]]
