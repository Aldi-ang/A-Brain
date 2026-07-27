---
title: Firestore Rules
description: The server-side rule file that actually decides who can read or write what — separate from whatever the UI shows.
type: entity
created: 2026-07-27
updated: 2026-07-27
tags: [firestore, security, rules]
---

# Firestore Rules

The `firestore.rules` file in the `kpm-inventory` repo is the server-side enforcement layer
for [[Multi-Tenant Architecture]] and [[Tier System]] — the actual gate that decides whether
a Firestore read/write is allowed, independent of whatever the UI shows.

## It's a draft, not the live rules

See [[Draft-Then-Deploy Discipline]] — this is important enough to be its own Concept page,
but the short version: `firestore.rules` in the repo is explicitly headed
"RECONCILED DRAFT — NOT DEPLOYED," reconciled against `firestore.rules.deployed-baseline`
(a frozen copy of what's actually live). Nothing in this file protects the real app until
the project owner manually runs `firebase deploy --only firestore:rules`.

## The recurring failure mode

The single most common way this file goes wrong: a role-check function tests for one exact
literal role string and silently omits another role the UI (or business intent) clearly
includes. See [[Fleet Captain Permission Gap]] for the specific, repeatedly-recurring
instance of this (`isAreaAdmin()` never covering `'FLEET_CAPTAIN'`). This is a special case
of the broader [[UI-Says-Yes-Server-Says-No Pattern]].

## The one confirmed tenant-isolation failure

[[Rank Config and Achievement Badges]] — a settings document NOT nested under
`users/{bossUid}/...` like everything else, so it's shared by every company in the Firestore
project rather than scoped per tenant. The closest real thing in this codebase to a
"security escalation" bug: not one account gaining more privilege than intended, but one
company able to overwrite data every other company also depends on. Documented and left as
a known limitation (a rules-only fix can't move data to a new path — that needs an app-code
change), per this project's [[Draft-Then-Deploy Discipline|document-don't-silently-half-fix]]
convention.

## Re-confirmed still-undeployed, 2026-07-27

A `/ponytail:ponytail ultra` review re-checked the repo against the last two fix batches and
confirmed this is still the single highest-leverage open item: every fix in both batches
exists only as a draft. See [[Dead Weight Cleanup and Rules-Deploy Gap]] — that session did
an unrelated dead-code/hygiene cleanup instead, deliberately leaving the actual
`firebase deploy --only firestore:rules` step for the project owner to run by hand.

## Related

- [[Draft-Then-Deploy Discipline]]
- [[Fleet Captain Permission Gap]]
- [[Rank Config and Achievement Badges]]
- [[UI-Says-Yes-Server-Says-No Pattern]]
- Summaries: [[Rank Config Cross-Tenant Gap]], [[Fleet Captain Rule Gaps — Batch 1 and 2]],
  [[Dead Weight Cleanup and Rules-Deploy Gap]]

## Verify before trusting

Whether a specific rule is currently correct — or currently *deployed* — is exactly the kind
of thing this wiki should never answer on its own. Check `firestore.rules` (drafted) versus
`firestore.rules.deployed-baseline` (live) in the real repo.
