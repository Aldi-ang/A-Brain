---
date: 2026-09-30
status: hero drawn 2026-10-02 10:50 (A/B/C at 390 + 1440); his pick owed, then the full build
tags: [kpm, showcase, sales, design]
---

# A showcase of KPM for customers (3D, animated)

**Problem, his words (2026-09-30 13:35):** *"we need to push this later to finish up everything and we should make really good visual design to show this app off to the customer can be as 3D visual animation kind of presentation"*.

**Options:**

| # | What it is | What it costs | What it buys |
|---|---|---|---|
| A | A web page (an Artifact link): one scroll = one scene; each scene is a live 3D piece of the app (the Satisfactory hatch + blast doors, the ender chest in The End, the crates, the sales terminal's 3D boxes, the enchanting-table book), a short line of what it does for the business | 1-2 sessions; reuses the real CSS, so it cannot drift from the app | opens on any phone or laptop from a link; can be recorded into a video later |
| B | A video (MP4) - the same scenes rendered frame by frame (the Remotion skill is installed) | 2+ sessions; a render pipeline; every change means re-rendering | sends on WhatsApp, plays anywhere, no internet needed |
| C | A demo mode inside the app (fake company, fake data, a guided tour) | the most work; touches the real app and its rules; must never leak into a real tenant | the customer touches the real thing |

**Decision:** OPEN - waiting on Aldi. My pick A (a link first; it can become B by recording it).

**Questions put to him:** who the customer is and which features sell best; English or Indonesian; phone or laptop in front of the customer.

**Rejected on purpose:** none yet.

**Models applied:** Opportunity Cost (a showcase session is a session not spent on the enchanting row and the push - the build finishes first, his own order "push this later to finish up everything").

**2026-09-30 13:38, his answer:** *"web page looks cool but save it for later we need to continue the job and push it to vercel first"* - A picked (a web page), parked until the v24 build is live and tested. Still owed before drawing: who the customer is and which part sells it, English or Indonesian, phone or laptop.

## 2026-10-02 10:27 - GO, and his four answers

He closed the phone sweep with: *"i think overall its look okay to be showed to the customer u may start designing the visual presentation"*.

| Question | His answer |
|---|---|
| Who watches first | **Both** - the distributor boss who would pay, and the salesmen who use it |
| Which part sells it | *"definitely the journey map because it is the main objective of this app, make sure that all the salesman and sales performance and sales distribution for the product is in control"* |
| Language | **Indonesian** |
| Device | **Both** - phone first (a WhatsApp link), and it must fill a laptop or TV in a meeting |

**The story this sets:** the hero is the journey map - every salesman, where they went, what they sold, where each
product went - told as one claim: *everything is under control*. The boss half shows control (the map, the routes,
the sales distribution, the leaderboard); the team half shows how fast and fun the day is (the terminal, the player
card). Assumption to state on the first board, not a question: "journey map" = the Journey Plan screen (each
salesman's route and stores) shown together with the Map System (pins, territory revenue, supply lines); if he meant
only one, he will say so on the pictures.

**Already exists:** the 2026-09-20 showcase artifact https://claude.ai/artifact/PPHRkGLFZ4KRZcPfUmHGtZ ("KPM Command
Center", Indonesian, ten chapters, every fact with a BUKTI chip, live CSS demos). Read it first; the new page is
scene-per-scroll and 3D (option A above), so it replaces that page's order, not its facts.

**Rejected on purpose:** B (video) and C (demo mode inside the app) - A was his pick 2026-09-30.

## 2026-10-02 10:50 - the first screen (the journey map), drawn three ways

**Problem, his words:** *"the main objective of this app, make sure that all the salesman and sales performance and sales distribution for the product is in control"* - three things on one screen: where each salesman went, what sold where, where the goods went.

Built as a live page (https://claude.ai/artifact/FiPesjkC3kXGBzCn8r9uwW, source `Raw/2026-10-02-showcase-hero/hero-options.html`) and shot at a real 390 (dpr 2, touch) and 1440, frozen mid-day = the Lite Mode frame (`shoot-hero.mjs`, `measure.json`, boards `board-phone.png` + `board-pc.png`). One drawn map for all three: a Voronoi split into areas tinted gold by sales, three branches + Gudang Pusat as 3D crates, three salesmen walking eight shops each; everything marked "Data contoh". Colours and fonts copied from `src/styles/theme.css`.

| # | Look | What it costs | What it buys |
|---|---|---|---|
| A | **Command table** - the whole map on one tilted slab; gold bars rise on each visited shop; goods lines flow from Gudang Pusat; three latched keys turn the layers on and off | densest picture; bars can sit in front of words, so the names float flat above the table (fixed) | the boss's "everything under control" in one look; fills a phone (table 1.16x the width) and reads from across a room |
| B | **Follow one salesman** - the camera zoomed on one route, the shops numbered, his player-card head + nixie omzet + the next shop beside it | shows one person; on a phone the card takes 200 px | the salesmen's story; the most "app" (player card, nixie, LED diodes) |
| C | **Three layers** - routes / money per area / goods lines as three see-through plates that slowly close into one | each plate is the smallest map of the three on a phone | explains the three things by name ("Siapa pergi ke mana?" etc.) |

**My pick:** A. **Decision:** OPEN - waiting on Aldi (asked 10:50 with the boards). Also put to him: the 10-scene list (1 Peta Perjalanan, 2 Rute Hari Ini, 3 Omzet Wilayah, 4 Jalur Barang, 5 Terminal Penjualan, 6 Setoran Malam, 7 Kartu Pemain, 8 Karantina, 9 Aman/Tanpa Sinyal, 10 Semua Terkendali), each tagged BOSS or SALES.

**Found while drawing:** a 3D table wider than its grid track pushed the headline 107 px off a 390 phone while `scrollWidth` still read 390 (the hero clips) - fixed with `minmax(0, 1fr)`; recorded as a lesson. The map's words are flat overlays pinned to 1 px anchors on the table, so a bar or an upper plate can never hide a name.

**Rejected on purpose:** a real Java/Indonesia coastline (would be invented geography, and map tiles are blocked inside an artifact) - the map stays an abstract area grid marked "Data contoh".

**2026-10-02 12:30, his answer:** *"A, journey map and map system is connected"* - hero A picked; the assumption (journey map = Journey Plan + Map System) confirmed. The full 10-scene page was then written (`Raw/2026-10-02-showcase-hero/showcase.html`, not yet proven or published) when he asked for the real map to show salesmen roaming like an expedition - see [[2026-10-02_expedition-map]] for the order question.

**Models applied:** Opportunity Cost (three looks drawn as one shared map generator, so the loser costs one composition, not one build); Inversion (what makes the boss NOT believe "under control" - a single salesman on screen, which is why B is not the pick).

## 2026-10-05 20:48 - his order: the showcase is next after the fullscreen replay + a push

*"push after we build the fullscreen replay bro then customer presentation"* (his week quota ~30%). Scope agreed by default: prove + finish the 10 written scenes and add the Day Replay as a scene; no new 3D work this week. The popup redesign and the store-list colours wait for next week.

## 2026-10-06 07:58 - PROVEN and FINISHED, the Day Replay added as scene 03 (not published yet)

His go, 07:28: *"lets continue with the presentation first"*. The page `Raw/2026-10-02-showcase-hero/showcase.html` now has 11 scenes.

**Fixed (all checked 2026-10-06 against kpm 8abbf30):** the page used Barlow Condensed - the app ships Rajdhani for titles + labels and the phone's own font for body (theme.css:207-209, kpm `7f88984`), now the same; Rajdhani reads ~2 sizes smaller, so 24 labels under 12 px went up 2 px (his "too small" rule of 2026-10-05) and the smallest text on the page is now 12 px; five Bukti facts had moved (Map System's "Territory Revenue" is now the "Sales heat" key at MapMissionControl.jsx:2096; the nota is ONE component `SaleReceipt.jsx`, not HistoryReportView; eodBountyLines :716; registerSW :13); scene 11's numbers re-measured (3.189 checks in 16 suites, 53.795 lines in 133 files, 2.086 commits, commit 8abbf30); the Karantina doors had no sign (`--sign` never defined) - the app's radiation sign built from `vanBay.js HAZARD_SIGN`; the player card's toggle 28 -> 36 px tall.

**Scene 03 "Putar Ulang Hari" (new):** a drawn map (the page's rule: abstract, "Data contoh"), the app's OWN pictures (chest closed/open, the visit signs, the salesman, the spinning coin - from kpm `mapSprites.js` + `coin-sprite.png`, spliced by `splice-replay.mjs` from `replay-scene.css/.html/.js`), "BS · n" name tags, the fullscreen bar (colour ticks, play/pause, 1x/2x/4x, drag), the card under the map; every chest and tick pressable (his 2026-10-04 rule); Lite = the frame stands at stop 5 and Play cuts between stops.

**Proof:** `shoot-showcase.mjs` -> `results-showcase.json`: 0 elements past the screen edge in all 11 scenes at 390 and 1440, smallest text 12 px, 0 page errors; frames `sc-p-NN.png` / `sc-d-NN.png`, board `board-showcase-p.png`. `walk-replay-scene.mjs` -> `results-replay-scene.json` 27/27 with real presses (mouse 1440, touch 390): plays by itself, pause, tick jump, chest card, play from here, 4x, drag, Lite cuts.

**Found on the way:** (1) my own chests were invisible - a `background` shorthand after the sprite rules wiped their images; longhands now. (2) A "lost tap" on the phone that cost two wrong fixes: a test drag sent as ONE instant move reads as a fling, and the next tap only stops the fling (no click) - real phone behaviour; with a finger-speed drag the tap clicks (`probe-tap.mjs` vs `probe-tap-slow.mjs`). Not a page bug; lesson recorded.

**Skipped on purpose:** the "Try it yourself" button to the demo - a key with no address is a dead object; it goes in when the demo exists.

**PUBLISHED 2026-10-06 08:05 (his "Publish now"):** https://claude.ai/artifact/AJQ36jBJr4jkkn6ZUnRN4A - private until he shares it from the page's Share menu. To update it from another session, edit `showcase.html` here and publish with this URL as `url`.

**Models applied:** Inversion (what makes the boss doubt the page: a wrong Bukti line - all re-checked); Chesterton's Fence (the drawn map: rejected real geography on 2026-10-02 stays rejected).

## 2026-10-06 08:48 - round 2 from his shots at 1920, PUBLISHED as version 2 (same link)

His words: *"these parts need improvement u can spot the problem right away when fullscreen especially, use formal languange instead"* + *"these box is unclear really i want u to change the product with cigarette box instead"*. Fixed: (04) the map is measured into its stage and sits above the leaderboard at every width (it overlapped by 114 px at 1920); (05, 06) the cubes became the app's pack shape with made-up packaging - a kraft case BAL, a carton SLOP showing 5 packs, a pack - bigger on a PC; (06) the receipt prints once and stays (it looped and faded to nothing); (09) the box keeps a 460 px width, centred; every description, audience chip and trust line in formal Indonesian, humanized. Found on the way: pack C borrowed the player card's class `.pc` (rounded, flattened) - the packs use `pk-a/-b/-c`. Proof: `shoot-showcase.mjs` now measures 390 + 1440 + 1920 with an overlap check (red on the old page: "map over leaderboard by 114 px") - 0 overlaps, 0 past the edge, smallest text 12 px, 0 errors; replay scene 27/27; `probe-nota.mjs`: receipt and wares fully visible from 3 s to 12 s. Boards `board-showcase-p.png`, `board-showcase-w.png`. Link unchanged: https://claude.ai/artifact/AJQ36jBJr4jkkn6ZUnRN4A (version 2).
