---
title: Phase 0 follow-up notes
description: Minor items noticed while verifying Phase 0 (offline flush + EOD double-verify) against a live emulator. None block Phase 0 or Phase 1. Raise after other current work is done.
status: Parked
area: Trophy Room / Phase 0
priority: Low
created: 2026-07-29
updated: 2026-07-29
---

# Phase 0 follow-up notes

Written after verifying `47a26ef`/`dc6561a` (offline flush fix + EOD double-verify guard) against a
local Firestore/Auth emulator on `phase0-solid-ground`. Both race-condition fixes hold — live-tested,
not just read. Phase 0 is solid; cleared to proceed. These are smaller things noticed along the way,
none urgent, none blocking.

- [ ] **Rapid reconnect can still double-write offline sales.** `flushOfflineData`
  (`src/App.jsx:197-262`) has no in-flight guard. If `isOnline` flips false→true→false→true within
  about a second (a phone flapping in a dead zone), a second flush can call `getPendingData()` before
  the first flush's `clearProcessedItem` loop finishes clearing IndexedDB — both flushes read the same
  pending items and both commit them, producing duplicates. Reproduced this session by artificially
  double-toggling connectivity during testing; not confirmed on real hardware. A simple
  `isFlushingRef` lock around the effect body would close it. Separate from the Phase 0 bug (which was
  about losing sales, not duplicating them) — worth a look, not urgent.
- [ ] **MVP trophy heading still says "Regional MVP {year}".** The misleading *description* text
  under it was correctly replaced with "Penjual terbaik 7 hari terakhir" (`AgentProfileView.jsx:1119`),
  so it's no longer factually wrong — but the heading itself (`:1118`) still visually reads like an
  annual award for a half-second before the disclaimer registers. Purely cosmetic; rename the heading
  too if it bugs you, skip if not.
- [ ] **Label/exclusion fixes were code-verified, not click-verified.** The leaderboard exclusion
  (`HallOfFameView.jsx:14`, `AgentProfileView.jsx:466`) and the two relabels were confirmed correct by
  reading the source (exact string/condition match), not by clicking through the actual UI like the
  two race-condition tests were. Low risk — they're simple string/filter logic — but flagging the
  difference in verification depth for completeness.
