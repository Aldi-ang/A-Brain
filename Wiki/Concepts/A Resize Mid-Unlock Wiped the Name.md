---
title: A resize mid-unlock wiped the name
type: concept
confidence: high
checked: 2026-10-01
---

# A resize mid-unlock wiped the name (2026-10-01)

**Symptom, his words (Samsung, password, full motion):** *"A, and i open with password, animation is there but no agent name , welcome text and everything is already there"*.

**Mechanism:** `VaultGate.jsx` keeps the dot grid in `S.dots`. The unlock samples the name (`sampleWord`) and gives each dot a target (`assign` sets `fly`, `tx`, `ty`). On Android the keyboard closes right after Enter and the screen grows. The canvas `ResizeObserver` calls `size()` -> `build()`, which replaces every dot with a fresh one (`fly: 0`). The wave only reads each dot's grid position, so it still ran; WELCOME BACK and the second line are DOM text, so they still showed; no dot knew where the name was, so none flew.

**Why only the Samsung:** the iPhone keyboard does not resize the page, and the headless runs had no keyboard. "Worked at 360 @3x with ALDI" was true and proved nothing about a resize.

**Fix (kpm `acdb0cf`):** the unlock publishes its sampling step as `S.relayout`; `size()` calls it after `build()`. Cleared when the unlock ends. Known corner (ponytail comment in the code): a resize after a letter has already left brings it back.

**Proof:** headless Chrome 360 css @3x, the real component on the ponder-lab vite server, bright name pixels at FORMED: no resize 14140; screen 400 -> 740 tall 150 ms in: **0 before, 14140 after**; at 3 s: 14140 after. Guard: logicFixes "THE NAME SURVIVES A RESIZE MID-UNLOCK", red on the old file.

**Lesson:** a canvas effect that rebuilds its objects on resize loses every per-object state another effect wrote into them. When a phone-only symptom leaves the DOM parts intact and kills the canvas part, test a resize first: the keyboard closing is a resize.

**Viewing path that worked:** the in-app browser pane gave 0 animation frames (requestAnimationFrame never fired), so the proof ran in headless Chrome over CDP. The harness imports `/src/components/VaultGate.jsx` from the ponder-lab server and borrows React from the URL in that module's own import line. The lab page has no Tailwind, so add `.absolute/.inset-0/.w-full/.h-full` by hand, or the canvas grows on every resize until `getImageData` runs out of memory.

Related: [[The Offline Helper Ate the Sign-In Page]] (same Samsung test, same morning) · [[Looking at the App]]
