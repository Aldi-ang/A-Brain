---
status: To Do
area: Permissions & Bugfixes
priority: Low
updated: 2026-07-26
---

# Add production_targets Firestore rule

`production_targets` (read/written by `RestockVaultView.jsx`) has no explicit `firestore.rules` coverage — same missing-rule pattern as other gaps found this project.

**Currently safe**: the whole `RestockVaultView` screen is gated behind the owner-only `isAdmin` flag at the `App.jsx` level, so nothing reachable today actually exploits the gap.

Worth an explicit rule anyway as defense-in-depth, in case the UI gate ever changes.
