---
status: Ready to Deploy
area: Permissions & Bugfixes
priority: Critical
updated: 2026-07-26
---

# Merge Batch 1+2 fixes into main

Two full rounds of bug fixes from the July 26 review are sitting **done, tested, and committed** — but never merged into `main`. They live only on branch `claude/critical-bugs-permissions-batch-c3371f` (commits `74a02d2` and `d3ec78f`).

Confirmed 2026-07-26: `main` is a strict ancestor of this branch, so it's a **clean fast-forward merge** — no conflicts.

## What's in Batch 1 (`74a02d2`)
- Rank Config / Achievement Badges Firestore rule gap (was completely unprotected)
- 11 missing `onSnapshot` error handlers in `useDatabaseSync.js`
- `motorists` UPDATE rule fixed for delegated Fleet Captains
- `products` UPDATE rule fixed for Fleet Captains reaching Master Vault

## What's in Batch 2 (`d3ec78f`)
- `commitInChunks` applied to `handleWipeAll`, `handleRenameFolder`, `handleDeleteFolder`, `runDataCleanse`, `applyChanges`, `handleDeleteConsignmentData`
- 11 more missing listener error handlers (customer sync, own profile, notifications, stock requests, fleet roster, branch stock, gps_bypasses, restock requests, branch inventory)
- `pending_audits` rule widened from Area-Admin-only to any authorized submitting role
- Dark mode toggle and inventory search box — were dead state, now real working UI controls
- Logistics notification read-state now actually persists
- `formatRupiah` and `compressImageToBase64` de-duplicated into `utils/helpers.js`
- `permissions.js` legacy-role-translation logic de-duplicated

Both batches emulator-tested (26/26 and 8/8 assertions passing).

## Next step
Merge (or fast-forward) `claude/critical-bugs-permissions-batch-c3371f` into `main`. See [[Deploy firestore.rules to production]] for what has to happen after that.
