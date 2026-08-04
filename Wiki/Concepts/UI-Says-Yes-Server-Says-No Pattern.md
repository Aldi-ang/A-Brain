---
title: UI-Says-Yes-Server-Says-No Pattern
description: The bug shape where a button works fine in the UI but silently fails at the database layer.
type: concept
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
tags: [pattern, permissions, bug-class]
---

# UI-Says-Yes-Server-Says-No Pattern

A recurring bug shape across this codebase: the client UI shows a control (a button, an
Edit action) to a user because the app's *intent* clearly includes them — but the
[[Firestore Rules|server-side rule]] guarding the actual write was never updated to match.
The user clicks the button, the UI says yes, and the write silently fails at the database
layer.

## Why this is worse than an obviously-broken feature

These bugs are quiet. The UI doesn't show an error until the user actually tries the action
— sometimes not even then, if the failure is caught and swallowed (see the Rank Config bug
in [[Rank Config and Achievement Badges]], wrapped in a try/catch that hid it completely).
A feature can look fully built and simply not work for the exact users it was built for.

## The sharpest instance: Fleet Captain

[[Fleet Captain Permission Gap]] is this pattern recurring at least 5 separate times with
the same specific cause: `isAreaAdmin()` checking only the literal `'AREA_ADMIN'` string
while the UI (correctly) also shows the same controls to a delegated `FLEET_CAPTAIN`.

## The general lesson

Whenever a UI shows a control gated on tier/role/permission, the matching server-side rule
needs to be checked against the *same* set of roles the UI actually uses — not assumed to
already cover it because the function name sounds right.

## Related

- [[Fleet Captain Permission Gap]]
- [[Firestore Rules]]
- [[Tier System]]
- Summaries: [[Fleet Captain Rule Gaps — Batch 1 and 2]], [[Rank Config Cross-Tenant Gap]]
