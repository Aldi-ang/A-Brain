---
title: Deploy firestore.rules to production
description: Deployed 2026-07-28 to cello-inventory-manager. 34/34 rules-test emulator assertions passed pre-deploy; manual in-app smoke test (log in as each tier) still needed from the owner.
status: Done
area: Permissions & Bugfixes
priority: Critical
created: 2026-07-26
updated: 2026-07-28
---

# Deploy firestore.rules to production

**Deployed 2026-07-28** via `firebase deploy --only firestore:rules` to `cello-inventory-manager`. Ran the existing emulator suite first (`rules-test/test-batch1.mjs` + `test-batch2.mjs`, 26+8 = 34/34 passing) since no dedicated test file exists yet for the Customer Directory tier or Option B specifically. Baseline (`firestore.rules.deployed-baseline`) re-synced and committed (`b386ec7`) so it's an accurate rollback copy.

**Still needed from the owner** — the emulator suite doesn't substitute for this: log in as Tier 1, Tier 2, and a lower tier in the real app and confirm normal access, watch console for new `permission-denied` errors. See `SECURITY_RULES_DEPLOY_CHECKLIST.md`'s post-deploy section.


`firestore.rules` in this repo is a **draft-only file** — every rules change gets written and emulator-tested, but nothing goes live until the owner runs `firebase deploy --only firestore:rules` by hand. That's intentional (see the repo's rules-draft process), but it means a growing list of tested, correct fixes aren't actually protecting the live app yet:

- Rank Config / Achievement Badges rule
- `motorists` / `products` UPDATE fixes for Fleet Captains
- Option B region-lock (Area Admin / Fleet Captain roster create-delete)
- `pending_audits` widened rule
- Customer Directory permission tier (View Only / Own Region / Global)

## Depends on
[[Merge Batch 1+2 fixes into main]] should land first, so this is one deploy instead of several.

## Before deploying
Re-read `MANUAL_TEST_CHECKLIST.md` and `SECURITY_RULES_DEPLOY_CHECKLIST.md` in the kpm-inventory-main repo root — they exist specifically for this step.
