---
date: 2026-09-30
status: OPEN - measured, no code changed; his pick of what to fix owed
tags: [kpm, performance, phone, animation]
---

# What makes KPM heavy on a cheap phone, in full animation mode - measured 2026-09-30 21:30

**Problem, his words:** *"measure what can be optimize first on the app to make it lighter and more convenience to potato phone even in full animation mode"*. Asked right after the five heavy-app fixes (`b799704`..`616b905`, local).

**How it was measured:** a production build wired to the Firebase emulator (fake company), headless Chrome at 390x844 @2x with touch, **CPU slowed 6x** (the cheap-phone stand-in), reduced-motion OFF, Lite Mode OFF. Every one of 17 screens: tap -> settle, a 4 s idle window traced (nothing touched), what runs, a touch scroll. Then **switch-off tests**: pause one animation or loop at a time and re-measure - the drop is what fixing that one thing would save. Headless draws ~165 frames/s where a phone draws 60, so frame work is scaled to 60 ("idle CPU at 60 fps"). Tool: `Raw/2026-09-30-potato-audit/` (`potato-audit.mjs`; `ABLATE=1` for the switch-off run; `summarize.mjs` prints the table). Re-run it after each fix to prove the saving.

**Options, ranked by measured saving (idle CPU of the phone's main thread, 6x-slow, full animations):**

| # | What | Where | Now -> switched off | Same-look fix | Cost |
|---|---|---|---|---|---|
| 1 | The merchant/capybara sprite keeps animating when it is hidden or off screen (`kpmMerchIdle/Talk`, background-position, cannot run on the graphics chip) | EVERY screen | Command Center 18% -> 2% | pause it while not visible; the visible one could move a sprite strip with transform instead | small |
| 2 | The biohazard sign's colour pulse (`kpmSignPulse`, animates SVG `fill`) - style recalc 14.2 -> 1.3 ms a frame, repaints 107 -> 33 a second | Agent Inventory | 97% -> 29%; scroll 25 janky frames, worst 376 ms | pulse a green copy's opacity instead of fill | small |
| 3 | The Master Vault 3D product card spins by React state every frame (`ResidentEvilInventory.jsx:71` setRotation in rAF) - 125 re-renders a second | Master Vault | 85% -> 22% | spin with a CSS transform animation; drag unchanged | small-medium |
| 4 | The gate's dot field redraws a blank canvas every frame at rest (every dot's brightness is 0 without a finger; `VaultGate.jsx` frame loop) | sign-in + vault gate | 26% -> 3% (sign-in 34%) | sleep the loop when nothing is lit, wake on touch / unlock | small |
| 5 | The notice "breathe" animates border-color (`kpmNoticeBreathe`), off screen too | Restock Vault | 45% -> 21% | opacity of a glow ring, or pause off screen | small |
| 6 | Four pulsing badges (`pulse`) | Stock Opname | 27% -> 17% | pause off screen | small |
| 7 | 70% of the stylesheet is never used on any of the 17 screens (365 KB, 110 KB used) - parsed at every open, matched at every style change | first open, every screen | not switch-off tested | remove dead rules - needs a careful sweep (classes built at runtime) | large |
| 8 | The tutorial book in the first file (5c) | first open after a push | ~39 KB gz -> ~0.3 s of a 3.45 s cold open on slow 4G [likely] | lazy-load the book | medium, touches his book flight |

**Load today:** sign-in screen on slow 4G + 6x CPU: cold 3.45 s (JS 333 KB gz, CSS 63 KB gz, longest task 332 ms); warm (offline copy) 0.68 s.

**Ruled out on purpose (measured):** the whole app re-renders once a second (the shell clock) - stopping it saved 1 point; Firebase idle timers - under 1 a second once synced (55/s is only the first sync after unlock); tab switch times 0.3-0.5 s except Map/Journey ~1.2 s and Reports ~1 s (their map/report code loads on first open). Not measurable honestly in headless: the GPU cost of backdrop blur (Map x3, Agent Profile x4) and blended map tiles - software GL there.

**Decision:** OPEN - his pick owed. My order: 1 (every screen, all the time), 2, 3, 4, 5, 6; 7 and 8 later.

**Models applied:** Theory of Constraints (switch-off tests find the real bottleneck instead of guessing - the once-a-second app re-render looked guilty and was worth 1 point); Inversion (what would make a fast app heavy at rest: things animating nobody can see); Chesterton's Fence on #4 (the dot loop exists for the unlock wave and the finger light - sleeping it must keep both).

**Rejected on purpose:** Lite Mode by default on weak phones (he asked for full animation mode); removing or shortening any animation (every fix keeps the same look); lowering the vault hash rounds.
