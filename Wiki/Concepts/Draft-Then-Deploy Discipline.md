---
title: Draft-Then-Deploy Discipline
description: Firestore rule changes are always a draft in the repo until a human manually deploys them — never automatic.
type: concept
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
tags: [pattern, discipline, firestore, deployment]
---

# Draft-Then-Deploy Discipline

The standing process this project follows for every [[Firestore Rules]] change: the
`firestore.rules` file in the repo is always treated as a **draft**, never assumed to be
what's actually live. The real live rules are a separate, frozen file
(`firestore.rules.deployed-baseline`), and moving a draft change to production is always a
manual, deliberate step the project owner performs themselves —
`firebase deploy --only firestore:rules` — never something an AI session does
automatically.

## Why

The project owner wants a paper trail of "we looked at this, here's exactly why it's blocked
or here's exactly what changed" rather than silent gaps or half-applied fixes that could
break the live app. A rules change that looks correct but hasn't been tested against a real
Firestore emulator, or hasn't been reviewed by a human before going live, is exactly the
kind of mistake this discipline exists to prevent.

## The "document, don't silently half-fix" convention

When a security or scoping question is investigated and found to be NOT safely fixable
without a larger change, the finding gets documented as a comment block directly in
`firestore.rules`, right above the relevant rule — explaining what was checked, why it can't
be done today, and what a real fix would require. No functional change, no `allow` line
touched — just an honest, visible paper trail. [[Rank Config and Achievement Badges]]'s
open cross-tenant gap is a real example of this in practice.

## Related process: the deploy checklist

`SECURITY_RULES_DEPLOY_CHECKLIST.md` in the repo covers the actual deploy steps: pre-deploy
checks, running the deploy command while physically present (not walking away), post-deploy
verification across multiple tiers, and a rollback procedure (redeploy the baseline, don't
panic-edit live rules).

## Related

- [[Firestore Rules]]
- [[Anti-Recurrence Check]] — same "verify, don't assume" spirit
- [[Rank Config and Achievement Badges]] — a real example of the "document, don't
  half-fix" convention
- Summaries: [[Fleet Captain Rule Gaps — Batch 1 and 2]], [[Rank Config Cross-Tenant Gap]]
