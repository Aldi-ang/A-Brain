---
status: Done
area: Permissions & Bugfixes
priority: Critical
updated: 2026-07-26
---

# Merge Batch 1+2 fixes into main

**Done 2026-07-26** — merged via [PR #3](https://github.com/Aldi-ang/kpm-inventory/pull/3), merge commit `a8fc57c`. Re-verified live before merging (not just trusted from the old commit messages): 26/26 and 8/8 emulator tests re-run and passing, clean build, CI Build Check green on both the PR and the push to `main`.

Two full rounds of bug fixes from the July 26 review — previously sitting done, tested, and committed on branch `claude/critical-bugs-permissions-batch-c3371f` (commits `74a02d2` and `d3ec78f`) but never merged.

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
