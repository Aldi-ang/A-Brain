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

## Caught in time, 2026-08-31 — the first one that did NOT ship

Worth recording precisely because nothing broke. Aldi specified a new rule in his own words:
*"tier 4/ regional admin and above is automatically registered to have power to send or receive
package, while lower tier cant do that"*.

**In his vocabulary T4 is "Regional Admin". In `permissions.js` T4's id is the string
`FLEET_CAPTAIN`.** So the rule he stated is, literally, "Fleet Captain and above" — and
`isAreaAdmin()`, whose name reads like exactly this check, covers only `AREA_ADMIN` and would have
silently dropped the one tier he actually named. Reaching for the obvious helper would have shipped
recurrence number seven, with the UI offering the feature and the boundary quietly wrong.

**What was done instead:** a permission key, `handle_delivery`, defaulting to T1–T4 with
`CORPORATE_TIERS.TIER_4` named explicitly in the fallback, and absence-means-tier-default so a key
his saved Firebase matrix has never seen does not read as "no". Check D16 in
`logicFixes.selfcheck.mjs` runs the real function from **both** sides — T1–T4 true, T5 and T6 false,
unknown role false — because a boundary is only proved by the side that must be refused.

**The transferable part:** the danger is not the role string, it is that *his* tier vocabulary and
*the code's* tier ids disagree at exactly T4. Whenever he specifies a rule by tier NUMBER, map the
number to the id before writing the check, and never trust a helper whose name matches his word.

Related: [[The Place Registry]]
