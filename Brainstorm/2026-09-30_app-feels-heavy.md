---
date: 2026-09-30
status: OPEN - waiting on Aldi's ranking (no code changed)
tags: [kpm, performance, phone, service-worker]
---

# "The app feels heavy" - diagnosis, 2026-09-30 13:55

**Problem, his words (right after the v24 push `cc89275..ee0b666`):** *"for some reason the app feels heavy on the web, i mean like entering master vault password even feel really heavy, lagging delayed a,d pressing a button inside the app is heavy also, it takes a while to load even sometimes it error first then i need to refresh to make it works and sliding the fleet and canvas is not fluid as well in the phone since we make it one by one other factor i havent test it yet"*.

**Findings (read from code and the built files; nothing measured on his phone yet):**

| # | What he feels | Cause | Confidence | Smallest fix | Cost |
|---|---|---|---|---|---|
| 1 | an error first, a refresh fixes it | the offline helper (vite-plugin-pwa, `registerType: 'autoUpdate'`; the built sw.js has skipWaiting + clientsClaim + cleanupOutdatedCaches) takes over the moment a new version lands and deletes the old stored copy while the old screen is still open; the old screen then asks for a piece (a lazy chunk) that no longer exists anywhere -> LazyTabBoundary's error box | likely (mechanism in the build; timing = right after a push) | catch the "missing piece" error (`vite:preloadError` / a failed dynamic import) and reload ONCE by itself, before the error box | small |
| 2 | typing the vault password lags | the typed password is state in App.jsx (`setInputPin`, :4623) - every letter re-renders the whole 5,477-line App; the VaultGate dot background redraws every frame (requestAnimationFrame) at the same time | likely (code), not profiled | keep the typed text inside the vault box's own component | small-medium |
| 3 | a delay after pressing Enter on the vault | the check hashes the password with PBKDF2-SHA256 600,000 rounds (src/utils/secretHash.js, since 2026-09-22) - deliberate security; roughly 0.5-2 s on a phone | certain (rounds), guessing (his phone's time) | show "checking…" at once so the press answers; do NOT lower the rounds | small |
| 4 | the roster swipe is not fluid | since `48d50bc` (one person per swipe) the stage has `touch-action: pan-y` and moves only on touchend: nothing follows the finger during the drag, then it jumps one card | certain (code) | let the cards follow the finger while dragging, snap to the next card on release | small-medium |
| 5 | slow to load, buttons heavy | the main file is 1,267 KB (384 KB gzipped) and must be read before anything shows; CSS 365 KB; after every push the phone also downloads the new ~4 MB offline copy (118 files) in the background | certain (sizes), likely (effect) | split the main file so the first screen loads less | large |

**Ruled out (measured in the lab at 430):** running animations at rest are few (Fleet & Roster 4, Agent Inventory 13); only 2 elements use a backdrop blur. The music files (9.4 MB) are NOT in the offline download.

**Decision:** OPEN - his ranking of 1-5 owed. My order: 1 (it looks like a broken app), 4 and 2 (what he touches most), 3, then 5.

**Models applied:** Inversion (what would make a fast app feel slow: an error on first open, input that answers late, a drag that does not follow the finger) - each finding maps to one of those.

**Rejected on purpose:** lowering the vault's 600,000 rounds (it is the security he approved); turning the offline helper off (it is how the field phones work without signal).
