---
title: "Dead Weight Cleanup and Rules-Deploy Gap"
description: Ponytail-ultra review found batch 1+2 fixes fully merged but Firestore rules still undeployed; separately, dead code/deps/assets and a leaked debug console.log ("GOD MODE DETECTED") got cleaned up in commit ce3b001.
type: summary
created: 2026-07-27
updated: 2026-07-27
tags: [kpm, cleanup, ponytail, firestore-rules, security]
---

# Dead Weight Cleanup and Rules-Deploy Gap

Source: [[../../Raw/2026-07-27_full-app-review-and-dead-weight-cleanup|Raw transcript]],
session "Full app review and git integrity audit," 2026-07-27.

## What happened

A `/ponytail:ponytail ultra` review re-checked `kpm-inventory` against the last two fix
batches instead of re-running a full audit from scratch — everything from those batches
([[Fleet Captain Rule Gaps — Batch 1 and 2]]) was confirmed already merged to `main` and the
build was clean. Three things were still open, ranked by leverage:

1. **[[../Entities/Firestore Rules|Firestore rules]] still not deployed** — every fix from
   both batches (Fleet Captain gaps, rank-config coverage, `pending_audits`) exists only as a
   verified draft in `firestore.rules`. Still the single highest-leverage item outstanding —
   see [[../Concepts/Draft-Then-Deploy Discipline]].
2. **Dead weight**: `src/Duke3D.jsx` (unused, referenced a nonexistent `.glb`), 6 now-unused
   npm packages (`@react-three/drei`, `@react-three/fiber`, `three`, `clsx`, `tailwind-merge`,
   `react-is`), and an unreferenced 189KB `monalisa.jpg`.
3. **Small hygiene**: a stale dev pinpoint-comment with a wrong line number, a duplicated
   `'THE_OWNER_EMAIL@gmail.com' // Replace later` placeholder in the VIP-email list (two
   copies, already drifted into different comments), a Firebase CLI cache file
   (`.firebase/hosting.ZGlzdA.cache`) tracked in git by mistake, and 5 leftover debug
   `console.log`s.

The project owner asked for items 2 and 3 only (rules deploy is a manual `firebase deploy`
step, left for him to run). Executed on branch `cleanup-dead-weight-hygiene`, committed as
`ce3b001` — 7 files changed, 20 insertions(+), 694 deletions(-). Verified via `git show
--stat` per [[../Concepts/Anti-Recurrence Check]], not just the commit message. Not pushed /
no PR opened yet.

## Why it's worth remembering

- **Security-relevant console.logs, not just noise.** Two of the five removed `console.log`s
  ("GOD MODE DETECTED" / "OFFLINE GOD MODE ENGAGED") were announcing a privilege-bypass path
  to anyone with devtools open — a real, if minor, information-disclosure issue, not just
  clutter. See [[../Entities/Fleet Captain Permission Gap]] for the broader pattern of
  privilege-check code being where this app's real bugs cluster.
- **The VIP-email check had silently forked into two copies** (try block vs. catch block)
  that had already drifted into different comments — an instance of the same "duplicated
  logic quietly diverges" risk this project has hit before with `formatRupiah` /
  `compressImageToBase64` before those were consolidated.
- **Firestore rules deploy remains the standing gap.** This session re-confirms — as of
  2026-07-27 — that all the permission fixes tracked across [[Rank Config Cross-Tenant Gap]]
  and [[Fleet Captain Rule Gaps — Batch 1 and 2]] are still code-only. Nothing here changes
  that status; it's an independent re-verification.

## Related

- [[../Entities/Firestore Rules]]
- [[../Concepts/Draft-Then-Deploy Discipline]]
- [[../Concepts/Ponytail Philosophy]]
- [[../Concepts/Anti-Recurrence Check]]
- [[Fleet Captain Rule Gaps — Batch 1 and 2]]

## Verify before trusting

Whether `ce3b001` has since been pushed, PR'd, or merged to `main` is exactly the kind of
live-status question this wiki doesn't answer — check the real `kpm-inventory` repo (`git
log`, `git branch -r`) directly.
