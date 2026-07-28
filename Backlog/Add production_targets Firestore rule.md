---
title: Add production_targets Firestore rule
description: Explicit rule drafted and committed, matches existing catch-all exactly — no behavior change. Draft only, needs its own deploy or can ride along with the next rules deploy.
status: Ready to Deploy
area: Permissions & Bugfixes
priority: Low
created: 2026-07-26
updated: 2026-07-28
---

# Add production_targets Firestore rule

**Corrected 2026-07-28**: re-checked — this collection was never actually ungated at the rules level. `firestore.rules`'s `users/{bossUid}` block has a recursive `match /{document=**}` catch-all (`isVaultOwner(bossUid) || isDistributorAdmin(bossUid)`) that already covers any subcollection with no dedicated rule, `production_targets` included — same as `procurement`/`appSettings`/`mapBorders`/`canvas`. So the original "no protection, UI-gated only" framing below was wrong; it was rules-gated too, just implicitly.

Added an explicit named `production_targets` block anyway (`3231f21`) — pure documentation/defense-in-depth, identical permission to the catch-all it replaces, verified with the existing 34/34 emulator suite (no regressions, this collection isn't covered by those tests directly but the surrounding rules are unchanged).

**Committed to the draft file, not yet deployed** — low priority, no urgency, no behavior change either way. Fine to sit until the next real rules change and deploy together, per [[Deploy firestore.rules to production]]'s "one deploy instead of several" reasoning.

## Original text (2026-07-26), kept for the record — the "no rules coverage" claim was imprecise

`production_targets` (read/written by `RestockVaultView.jsx`) has no explicit `firestore.rules` coverage — same missing-rule pattern as other gaps found this project.

**Currently safe**: the whole `RestockVaultView` screen is gated behind the owner-only `isAdmin` flag at the `App.jsx` level, so nothing reachable today actually exploits the gap.
