---
title: "Firestore Rules Excerpts (raw source)"
description: Verbatim excerpts pulled directly from firestore.rules, including the Rank Config cross-tenant gap comment.
created: 2026-07-27
updated: 2026-07-27
tags: [raw, source, firestore, security]
source-type: firestore-rules-verbatim-excerpt
retrieved: 2026-07-27
repo: kpm-inventory
file: firestore.rules
---

Verbatim excerpts pulled directly from `firestore.rules` in the repo. Not paraphrased.

## File header (top of firestore.rules)

```
// =============================================================================
// RECONCILED DRAFT — NOT DEPLOYED. Awaiting owner review + manual
//   firebase deploy --only firestore:rules
//
// Baseline: firestore.rules.deployed-baseline (the rules currently LIVE in the
// Firebase Console as of 2026-07-23). This file is that baseline with ONE
// deliberate security change (marked [CHANGE 1] below) plus comments.
//
// Everything else is intentionally byte-for-byte the live behavior. An earlier
// draft in this repo rewrote these rules from scratch on the false premise that
// no rules existed; that draft has been discarded because several of its changes
// would have broken the live app (see [WHY NOT] notes below).
// =============================================================================
```

## [CHANGE 7] — the Rank Config / Achievement Badges cross-tenant gap

This is the closest real match in this codebase to a Firestore rules "escalation"-shaped
vulnerability: not a single account gaining more privilege than it should within its own
company, but one company's owner being able to write into data every OTHER company also
reads — a tenant-isolation boundary failure.

```
// [CHANGE 7 — RANK CONFIG / ACHIEVEMENT BADGES RULE, gap fix] AgentProfileView.jsx
// reads/writes artifacts/cello-inventory-manager/settings/{achievements,rpg_ranks}
// (~lines 140, 149, 208, 337) but this path never had a dedicated rule — it fell
// through to the top-level isSuperAdmin()-only catch-all, so no real customer
// could ever configure OR even READ Rank Config / Achievement Badges. The
// failure was silent (wrapped in try/catch), so nobody had seen an error — the
// feature just quietly did nothing for every company, including the
// COMPANY_OWNER it's built for (edit_rank_config's default tier).
//
// NOTE ON SCOPE: unlike every other settings doc in this file, this path is NOT
// nested under users/{bossUid} — AgentProfileView.jsx reads/writes it at
// artifacts/cello-inventory-manager/settings/*, the same top-level as
// employee_directory. That makes it a single doc SHARED BY EVERY COMPANY in this
// Firestore project, not scoped per tenant — a pre-existing app design choice,
// not something a rules-only fix can correct. Any company's COMPANY_OWNER/ADMIN
// can overwrite the rank ladder / badge list that every OTHER company also sees.
// A real per-tenant fix would mean moving this data under
// users/{bossUid}/settings/ in the app code — out of scope here. Flagged per
// this project's standing "document, don't silently half-fix" convention.
//
// READ: any authenticated employee, any tier — AgentProfileView's own
// useEffects fetch both docs unconditionally for whoever is viewing their
// profile page, so every tier (down to Rookie) needs read access to see their
// own rank/badges.
//
// WRITE: restricted to the same roles the UI itself gates the config modals
// behind (showRankConfig / showBadgeConfig both check
// `userRole === 'ADMIN' || userRole === 'COMPANY_OWNER'`).
//
// Verified via Firestore Rules emulator:
//  - COMPANY_OWNER -> read ALLOWED, write ALLOWED
//  - ADMIN (distributor admin) -> read ALLOWED, write ALLOWED
//  - AREA_ADMIN / FLEET_CAPTAIN / FIELD_OPERATIVE / ROOKIE -> read ALLOWED (so
//    their own profile page still renders rank/badges), write DENIED
//  - Unauthenticated -> read and write DENIED
```
