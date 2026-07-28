---
title: Chunk handleAdminApproveTransfer
description: Converted to commitInChunks, matches the rest of the app's bulk-write paths. Merged and pushed to main.
status: Done
area: Permissions & Bugfixes
priority: Low
created: 2026-07-26
updated: 2026-07-28
---

# Chunk handleAdminApproveTransfer's reassignment loop

**Done 2026-07-28** (`3231f21`). `App.jsx`'s `handleAdminApproveTransfer` built a single unbounded `writeBatch` (request doc + every matching transaction + customer doc) instead of using `commitInChunks` like the rest of the app's bulk-write paths — same pattern fixed everywhere else in [[Merge Batch 1+2 fixes into main|Batch 2]], just missed that batch. Converted to the `operations` array + `commitInChunks(db, writeBatch, operations)` pattern. Build passes, no new lint errors from the change.
