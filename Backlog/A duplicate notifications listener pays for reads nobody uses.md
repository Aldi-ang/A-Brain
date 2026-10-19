---
title: A duplicate notifications listener pays for reads nobody uses
description: Two listeners watch the notifications collection. The one inside useDatabaseSync filters every document away using two fields that do not exist, and its result is never read. Delete it.
status: Done (kpm 363cea9, 2026-10-19)
area: Performance / cleanup
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# A duplicate notifications listener pays for reads nobody uses

Found in the 2026-08-17 logic review, fifth pass.

## ✅ First, what is NOT broken

The notification bell works. I nearly reported that it never shows anything, and that would have
been wrong — `src/App.jsx:320-336` has a second, deliberately permissive listener whose comment says
it *"bypasses the useDatabaseSync hook which was completely blind to this collection"*. The bell
reads that one. Checked before writing this up.

## What is actually wrong

There are **two** listeners on the same notifications collection, on every session, for every user.

The one inside `src/hooks/useDatabaseSync.js:112-119` downloads the last seven days of
notifications and then filters them like this:

```
if (userRole === 'ADMIN' && n.targetRole === 'ADMIN') return true;
if (agentProfileId && n.targetId === agentProfileId) return true;
return false;
```

**Neither `targetRole` nor `targetId` exists on a notification document.** Every write in the app
sets `agentId` instead. Confirmed with a control search: those two names appear nowhere in `src/` as
a notification field — only in this filter, in the warning comment above it, and as unrelated local
variables in other files.

So the filter always returns `false`, the array is always empty, and `notifications` is destructured
at `src/App.jsx:344` and **never used** — the UI is handed `combinedNotifications` instead.

## The irony worth noticing

The comment directly above that filter warns *"DO NOT server-side filter this on
targetRole/targetId. Those fields DO NOT EXIST"* — and then the client-side filter three lines below
does exactly that. The warning was written about the query and never applied to the filter under it.

## What it costs

Every phone, on every cold start, downloads a week of notification documents twice and throws one
copy away. This codebase already gates the `audit_logs` and `procurement` listeners to ADMIN for
precisely this reason (`useDatabaseSync.js:83` and `:92`, both with comments about salesmen's phones
paying for reads they cannot use).

## Suggested fix, smallest version

Delete the listener at `useDatabaseSync.js:112-119`, drop `notifications` and `setNotifications`
from the hook's return, and remove them from the destructure at `src/App.jsx:344`.

**Do not "fix" the filter instead.** A working second copy of a listener the app already has is
still a second copy.
