---
title: Tier System
description: The six role levels in KPM, from Developer down to Rookie, and how delegated permissions work.
type: entity
created: 2026-07-27
updated: 2026-09-06
confidence: high
checked: 2026-09-06
tags: [architecture, roles, permissions]
---

# Tier System

KPM's role hierarchy, six tiers, each nested inside a company under
[[Multi-Tenant Architecture]]:

| Tier | Role literal | Nickname |
|---|---|---|
| 1 | `DEVELOPER` | Architect / platform owner |
| 2 | `COMPANY_OWNER` | Company owner |
| 3 | `AREA_ADMIN` | Area Admin |
| 4 | `FLEET_CAPTAIN` | Fleet Captain |
| 5 | `FIELD_OPERATIVE` | Field Operative |
| 6 | `ROOKIE` | Rookie |

## Sharp edge: legacy string overlap

`'ADMIN'` and `'DEVELOPER'` both mean Tier 1 in some older code paths. **Always confirm
which literal string a given check actually uses — never assume.** This kind of
string-literal mismatch is the root cause of [[Fleet Captain Permission Gap]], the single
most-recurring bug class in this codebase.

## Delegation: canEditRoster

Tier 3 (Area Admin) and Tier 4 (Fleet Captain) can both be *delegated* roster-management
authority via a `canEditRoster` flag on their employee profile — this is how a Fleet
Captain, normally below Area Admin, ends up with Area-Admin-shaped permissions for hiring/
firing/editing agents in their own region. See [[Option B Region Lock]] for how this
delegation is actually enforced server-side.

## A brand-new matrix key is ABSENT, not "no" (2026-09-06)

Delegated permissions live as array entries in `ROLE_PERMISSIONS`, and Aldi's saved matrix is
stored in Firebase. That means **a permission key added by new code does not exist in the deployed
matrix yet.** Reading that absence as "denied" would break the feature for every tier at once
while the code itself was perfectly correct.

The established shape — `view_expected_count`, `handle_delivery`, `manage_registry`, and now
`handoff_cross_region` (2026-09-06) — is **absence means the tier default**. The code ships with a
default set of tiers; the moment the key appears in the saved matrix, Aldi's switch wins in both
directions. For `handoff_cross_region` the default is tiers 1-3, stopping above T4 REGIONAL ADMIN.

Related, from the same fix: `UNASSIGNED` is the fallback string for a missing `location` field,
**not a region**. Two agents both missing a location are not "in the same branch" — treating them
as matching would let the emptiest record grant the widest reach. Source:
[[../Summaries/The Shorter List Was Never the Eligible One]].

## Related

- [[Multi-Tenant Architecture]] — the per-company structure tiers sit inside
- [[Firestore Rules]] — where tier checks are actually enforced (or missed)
- [[Fleet Captain Permission Gap]] — the recurring bug born from this system's string-literal
  role checks
- [[UI-Says-Yes-Server-Says-No Pattern]] — the general shape of what goes wrong when a tier
  check is incomplete
- Summary: [[KPM Project Facts Reference]], [[The Shorter List Was Never the Eligible One]]

## Verify before trusting

Tier literals and the delegation flag are stable architecture, unlikely to have changed. A
specific rule's current tier coverage should still be checked against live `firestore.rules`
before relying on it.
