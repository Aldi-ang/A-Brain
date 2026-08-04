---
title: Fleet Captain Permission Gap
description: The #1 most recurring bug in KPM — a permission check that covers Area Admin but keeps forgetting Fleet Captain.
type: entity
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
tags: [bug-pattern, firestore, permissions, fleet-captain]
---

# Fleet Captain Permission Gap

**The single most recurring bug class in the KPM codebase.** A [[Firestore Rules|Firestore rule]]
function checks a role by its exact literal string, and the check simply omits a role
that the client UI (or business intent) clearly includes — specifically, `isAreaAdmin()`
only ever checks for the literal `'AREA_ADMIN'` string. It has never covered
`'FLEET_CAPTAIN'`, even in places where a delegated Fleet Captain is meant to have
Area-Admin-shaped authority (see [[Tier System]] and [[Option B Region Lock]]).

## Confirmed recurrences (independently, at least 5 times)

1. `procurement`/canvas listeners
2. The fleet paintbrush (`mapSettings`)
3. Roster create/delete (`motorists`) — fixed via [[Option B Region Lock]]
4. `motorists` UPDATE (a separate rule from create/delete — missed in the first pass, fixed
   in [[Fleet Captain Rule Gaps — Batch 1 and 2|Batch 1]])
5. `products` UPDATE (Fleet Captains reaching Master Vault) — also fixed in Batch 1
6. `pending_audits` create — widened in
   [[Fleet Captain Rule Gaps — Batch 1 and 2|Batch 2]], though that particular widening
   covers more than just Fleet Captain (matches the Stock Opname screen's own gating)

## Why it keeps happening

Every one of these is the same shape: the UI already shows a delegated Fleet Captain a
control (an Edit button, a Load Canvas action) because the *business logic* clearly intends
them to have access — but the Firestore rule guarding the actual write was never updated to
match. This is the [[UI-Says-Yes-Server-Says-No Pattern]] specifically instantiated with one
role string.

## The standing lesson

When touching any tier-gated rule in this codebase, explicitly check whether Fleet Captain
(and any other plausible tier) should also be included — don't assume one role-check
function covers what its name suggests it should.

## Related

- [[Tier System]] — where the role strings come from
- [[Firestore Rules]] — the enforcement layer where this keeps recurring
- [[UI-Says-Yes-Server-Says-No Pattern]] — the general pattern this is one instance of
- [[Option B Region Lock]] — the create/delete fix and its region-lock extension to Fleet
  Captain
- Summary: [[Fleet Captain Rule Gaps — Batch 1 and 2]]

## Verify before trusting

This page describes a *pattern* that has recurred historically — it does not mean every
instance is currently fixed or currently broken. Check current `firestore.rules` for the
specific collection in question.
