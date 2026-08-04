---
title: Rank Config and Achievement Badges
description: A profile feature with two bugs — one fixed rule gap, and one still-open cross-company data leak.
type: entity
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
tags: [firestore, security, multi-tenant, bug]
---

# Rank Config and Achievement Badges

A profile-page feature (`AgentProfileView.jsx`) letting a company configure a rank ladder
and achievement badges for their employees. Notable for being the source of two distinct,
real bugs at two different layers.

## Bug 1 (fixed): zero rule coverage

`artifacts/cello-inventory-manager/settings/{achievements,rpg_ranks}` had no dedicated
[[Firestore Rules|Firestore rule]] at all — it fell through to the superadmin-only
catch-all, so no real customer could configure OR even read Rank Config / Achievement
Badges. Silent failure (wrapped in try/catch), so nobody had seen an error; the feature just
quietly did nothing for every company, including the `COMPANY_OWNER` it's built for. Fixed
in [[Fleet Captain Rule Gaps — Batch 1 and 2|Batch 1]] with a dedicated rule: read open to
any authenticated employee, write restricted to `COMPANY_OWNER`/`ADMIN`.

## Bug 2 (open, documented not fixed): cross-tenant shared document

Fixing bug 1 surfaced a deeper problem the fix deliberately did NOT solve: this settings
path is **not** nested under `users/{bossUid}/...` like every other per-company setting in
this app — see [[Multi-Tenant Architecture]]. It's a single document shared by **every
company** in the Firestore project. Any company's `COMPANY_OWNER`/`ADMIN` can currently
overwrite the rank ladder / badge list that every other company also sees.

This is the closest thing in this codebase to a Firestore rules "escalation" vulnerability —
not one account gaining excess privilege within its own company, but a tenant-isolation
boundary that was never built for this one path. A real fix needs an app-code change (move
the data under `users/{bossUid}/settings/`), which is out of scope for a rules-only patch —
documented as a known limitation rather than silently half-fixed, per
[[Draft-Then-Deploy Discipline]]'s "document, don't silently half-fix" convention.

## Related

- [[Firestore Rules]]
- [[Multi-Tenant Architecture]]
- Summary: [[Rank Config Cross-Tenant Gap]]

## Verify before trusting

Bug 1's rule fix status depends on whether [[Fleet Captain Rule Gaps — Batch 1 and 2|Batch 1+2]]
has been merged AND deployed — check the real repo. Bug 2 is architectural and, as of
the last real check, still open.
