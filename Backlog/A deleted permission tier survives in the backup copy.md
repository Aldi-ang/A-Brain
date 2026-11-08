---
title: A deleted permission tier survives in the backup copy
description: The permission matrix is saved to two places - one replaced outright, one merged. A tier deleted from the first stays alive in the second, and the app falls back to the second when the first is missing.
status: Done
done: "kpm 363cea9, 2026-10-19"
area: Permissions / Settings
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# A deleted permission tier survives in the backup copy

Found in the 2026-08-17 logic review, fourth pass. **This one is about permissions, so the wording
below is deliberately exact rather than short.**

## What happens, in simple English

When you press Deploy on the permission matrix, the app saves it **twice**, to two different
documents:

- `settings/permission_matrix` — saved as a **full replacement**
- `appSettings/permission_matrix` — saved as a **merge**

A merge only adds and updates. It never removes. So anything you **delete** disappears from the
first copy and **stays alive in the second**.

When the app loads the matrix it reads the first document, and if that one is missing it falls back
to the second (`src/components/SettingsView.jsx:1362-1363`). On that fallback, a tier you deleted
comes back, with whatever permissions it had.

## What is and is not affected

- **Deleting a whole tier** — affected. The tier is removed from the matrix in memory
  (`:1541-1542`), so the full-replacement copy loses it and the merged copy keeps it.
- **Turning one permission off for a tier** — probably safe. That list is stored as an array, and a
  merge replaces an array outright rather than combining it.

I have not tested this against a live database, so treat the second line as likely rather than
certain. The first line follows directly from how a merge works.

## How bad is it

Not critical, because the database rules read the **first** document
(`firestore.rules:132`), which is the correct one. The stale copy only takes over if the first
document is missing or unreadable. But it is a stale copy of your access-control settings, sitting
in the database with no expiry, and the app is wired to fall back to it.

## A second, smaller problem in the same function

The two saves are two separate awaits, not one batch (`:1555-1556`). If the first succeeds and the
second fails, the two copies silently disagree — and the message the user sees still says
*"Deployed to Global Server"*.

## Where it is

`src/components/SettingsView.jsx:1548-1565`, read at `:1362-1363`

## Suggested fix, smallest version

Pick one document and delete the other. Two copies of your permission settings is not a backup — it
is a second answer to a question that must only have one.

If both must stay for now: write them in a single batch so they cannot diverge, and save the second
one as a **full replacement** too, so a deletion actually deletes.
