---
title: Chunk handleAdminApproveTransfer
description: The transaction-reassignment loop writes one doc at a time instead of using commitInChunks like the rest of the app.
status: To Do
area: Permissions & Bugfixes
priority: Low
created: 2026-07-26
updated: 2026-07-26
---

# Chunk handleAdminApproveTransfer's reassignment loop

`App.jsx` ~line 1497, `handleAdminApproveTransfer` — the transaction-reassignment loop writes one doc at a time instead of using `commitInChunks` like the rest of the app's bulk-write paths.

Not urgent: it's bounded today by the 7-day transaction window, not a hard cap, so it can't (yet) run away on unbounded data. Same pattern as everything else fixed in [[Merge Batch 1+2 fixes into main|Batch 2]] — just didn't make that batch.
