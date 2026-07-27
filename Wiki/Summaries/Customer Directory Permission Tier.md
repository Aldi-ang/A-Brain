---
title: Customer Directory Permission Tier
description: A 3-level edit permission (view only / own region / global) added for the Customer Directory.
type: summary
created: 2026-07-27
updated: 2026-07-27
tags: [ingest, feature, permissions]
source: "[[../../Raw/2026-07-25_source_customer-directory-permission-tier.md]]"
---

# Summary: Customer Directory Permission Tier

**Source**: the `project_kpm_customer_directory_permission_tier` memory, 2026-07-25.

## What it is

A third permission dimension added to the Permission Matrix specifically for editing
customers: `customers_edit_global` (default) / `customers_edit_own_region` /
`customers_view_only`. This is the feature whose first landing attempt is
[[Git Worktrees|incident #1 of the three worktree incidents]] — the real code was recovered
a day after a commit falsely claimed to include it.

## Scope decisions worth remembering

- Governs **editing** only — reading a customer stays fully unrestricted for everyone
  (every tier needs to sell to/look up any company customer; narrowing that would break the
  core sales workflow, not just a display nicety).
- New Outlet Onboarding (create) is only blocked for `view_only` — `own_region` is
  deliberately NOT region-locked on create, because NOO already has its own safety net
  (pending status + admin approval) and region-locking create would block a field agent
  onboarding a store they're physically standing in front of.

## A real, documented (not fixed) risk

`own_region` compares an employee's free-text branch/area label against a customer's
`region` field (a different taxonomy, forced uppercase). These aren't guaranteed to match —
only works if a company's branch names happen to equal their Kabupaten names. A durable fix
would need a dedicated per-employee Kabupaten field; not built yet.

## Ripple — pages this touches

- [[Tier System]] (a new permission dimension layered on the existing tier hierarchy)
- [[Git Worktrees]] (the incident this feature's first landing attempt caused)
