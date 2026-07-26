---
status: Ready to Deploy
area: Permissions & Bugfixes
priority: Critical
updated: 2026-07-26
---

# Deploy firestore.rules to production

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
