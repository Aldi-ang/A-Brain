---
title: Phase 1 follow-up notes
description: Minor items noticed while executing Phase 1 (performance pass). None block Phase 1 or later phases. Raise after other current work is done.
status: Parked
area: Trophy Room / Phase 1
priority: Low
created: 2026-07-29
updated: 2026-07-29
---

# Phase 1 follow-up notes

Written after shipping Phase 1 (items 1, 2, 3, 4, 5, 8, 11, 16, 17 from the design doc's §6 table)
on `phase0-solid-ground`. Build succeeds, precache dropped to 55 entries / 2,439.87 KiB (doc estimated
~2.4 MB — matches almost exactly), no leftover references to anything deleted. One real deviation
from the doc's literal wording — see below, not a loose end, already resolved correctly.

- [x] **Item 5 deviated from the doc on purpose — resolved, not open.** The doc said delete the
  `notifications` listener as a duplicate of the hook's gated one. Reading the code first showed the
  hook's version has a stricter filter that a prior fix (comment at `App.jsx:396`) deliberately routed
  around because it was dropping notifications it shouldn't have. Shipped a time-gate on the existing
  permissive listener instead of switching to the hook's filtered one — same performance win, no
  regression. Recorded here for the paper trail, not because it needs another look.
- [ ] **`initializeApp` (from `firebase/app`) is imported but never called in `App.jsx`.** Separate
  from the `getAnalytics` duplicate that got cleaned up (that one was deleted since it's literally
  item 17's own fix, just a second undetected copy). This one's just a stray unused import, pre-existing,
  unrelated to anything Phase 1 touched — left alone per "don't remove dead code you didn't orphan."
  One-line delete whenever someone's in that file next.
- [ ] **A pre-existing Tailwind arbitrary-value warning surfaces on every build**, unrelated to Phase 1:
  `AgentProfileView.jsx:1131` — `` shadowClass={`shadow-[0_0_15px_${badge.hex}40]`} `` — the build tool
  reads the trailing `40` (alpha suffix) as invalid CSS syntax. Doesn't break the build or the visual
  (esbuild just warns and moves on), but worth a real look — likely needs `shadow-[0_0_15px_${badge.hex}40]`
  reformatted so the templated hex+alpha isn't inside the bracket literal, or moved to inline `style`.
- [ ] **`AgentProfileView.jsx`'s duplicate `AchievementCard` cleanup (item 11) has a small visual side
  effect.** The deleted component-scoped copy and the kept module-scope copy weren't byte-identical —
  icon circle went from 48px to 40px, badge background opacity from `40` to `30` (hex alpha suffix),
  progress-bar shadow style changed from `shadow-inner` to an explicit `shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]`.
  Cosmetic only, matches what the design doc called "already correct," but worth a glance next time
  you're on the profile screen in case the smaller icon reads as a regression rather than a fix.
