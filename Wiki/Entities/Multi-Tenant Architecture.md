---
title: Multi-Tenant Architecture
description: How one shared database keeps every company's data separate from every other company's, via the bossUid pattern.
type: entity
created: 2026-07-27
updated: 2026-07-27
tags: [architecture, firestore, multi-tenant]
---

# Multi-Tenant Architecture

KPM Inventory is a multi-tenant B2B SaaS app: **one shared Firebase project**
(`cello-inventory-manager`) hosts every customer company's data side by side, not a
separate Firebase project per company.

## The bossUid pattern

- Every piece of a company's data lives under `artifacts/{appId}/users/{masterUid}/...`.
- `masterUid` is that company's Tier 1/2 owner's UID — every employee of that company
  reaches their own company's data via a `bossUid` field pointing back to it.
- In app code, `userId` resolves as `bossUid || user?.uid || user?.id || 'default'` — this
  is the standard, repeated pattern for scoping any per-tenant Firestore path. If you see
  this exact expression, it's tenant-scoping, not a random fallback chain.
- `employee_directory` is keyed by **email**, not UID, as the authoritative record (written
  by admins). A UID-keyed copy exists only for the Company Owner's own migrated record,
  covered separately by `isVaultOwner()`. Don't assume dual-keying elsewhere without
  checking — this has caused confusion before.

## Where tenant isolation has actually failed

Not every path in the app respects the `users/{bossUid}/...` boundary. See
[[Rank Config and Achievement Badges]] for the one confirmed real gap: a shared,
NOT-per-tenant settings document that any company's owner can overwrite, visible to every
other company. That's the sharpest illustration of why this pattern matters — the moment a
path skips nesting under `users/{bossUid}`, tenant isolation is gone by default, not by
exception.

## Related

- [[Tier System]] — the role hierarchy that sits on top of this per-tenant structure
- [[Firestore Rules]] — how tenant isolation is actually enforced (or fails to be) at the
  database layer
- Summary: [[KPM Project Facts Reference]]

## Verify before trusting

This describes the *pattern*, which is architectural and slow-changing. For whether a
*specific* collection or feature currently follows it correctly, check the real
`firestore.rules` in the `kpm-inventory` repo — don't assume from this page alone.
