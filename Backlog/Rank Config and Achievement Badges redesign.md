---
status: Parked
area: Feature Redesign
priority: Medium
updated: 2026-07-26
---

# Rank Config & Achievement Badges redesign

The Firestore rule *gap* for this feature is already fixed (see [[Merge Batch 1+2 fixes into main|Batch 1]]) — but that fix exposed a deeper design problem it deliberately did NOT solve:

`artifacts/cello-inventory-manager/settings/{achievements,rpg_ranks}` is **one single shared document for every company** in the whole Firestore project — not scoped per-company under `users/{bossUid}/settings/` like everything else. Right now, any company's owner can overwrite every other company's rank ladder and achievement badges.

Fixing this for real needs:
1. An app-code change to move these settings under each company's own `users/{bossUid}/settings/` path
2. Updates everywhere `AgentProfileView.jsx` reads/writes them (currently ~lines 140, 149, 208, 337)
3. A decision on migrating existing live data to the new per-company location

Parked because it's a real redesign, not a quick fix — needs deliberate thought before touching it.

See [[Rank Config redesign — early thoughts]] for brainstorming space.
