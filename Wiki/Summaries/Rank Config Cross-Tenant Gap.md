---
title: Rank Config Cross-Tenant Gap
description: The closest thing in KPM to a real "security escalation" bug — one company's settings shared by every company.
type: summary
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
tags: [ingest, incident, security, firestore, multi-tenant]
source: "[[../../Raw/2026-07-26_source_firestore-rules-excerpts.md]], [[../../Raw/2026-07-26_source_batch1-permissions-fix.md]]"
---

# Summary: Rank Config Cross-Tenant Gap

**Sources**: the exact `[CHANGE 7]` comment block in `firestore.rules`, plus the
`project_kpm_batch1_permissions_fix_2026_07_26` memory that first fixed and documented it.

## Framing note

The task that produced this ingest pass asked specifically for "the Firestore Security
Rules escalation vulnerability and its fix." The closest genuinely real match to that
description in this codebase is this gap — not a case of one user account gaining more
privilege than intended *within* their own company, but a **tenant-isolation boundary**
that never existed for one specific settings path. Named accurately here rather than forcing
a different incident to fit the word "escalation."

## The gap

`artifacts/cello-inventory-manager/settings/{achievements,rpg_ranks}` — the Rank Config /
Achievement Badges settings — is one document, **shared by every company** in the whole
Firestore project, unlike every other settings doc which is properly nested under
`users/{bossUid}/...` (see [[Multi-Tenant Architecture]]). Any company's
`COMPANY_OWNER`/`ADMIN` can write to it, and every other company reads the same document.

## Two layers, two different fixes

1. **The rule itself had zero coverage at all** — so before any fix, the feature silently
   failed for every real customer (wrapped in try/catch, no visible error). This layer was
   fixed: read open to any authenticated employee, write restricted to
   `COMPANY_OWNER`/`ADMIN`, matching the UI's own gate. Verified via Firestore Rules
   emulator across all tiers plus a cross-company write attempt.
2. **The cross-tenant sharing itself is NOT fixed** — a rules-only change can restrict *who*
   can write, but can't change *where* the data lives. A real fix means moving this data
   under `users/{bossUid}/settings/` in the app code. Documented as a known limitation
   directly in the rules file, per [[Draft-Then-Deploy Discipline]]'s
   document-don't-silently-half-fix convention — not silently patched over.

## Ripple — pages this touches

- [[Rank Config and Achievement Badges]] (the entity this incident is about)
- [[Multi-Tenant Architecture]] (the isolation boundary this gap violates)
- [[Firestore Rules]]
- [[Draft-Then-Deploy Discipline]]
