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

**Models applied:** Opportunity Cost (three looks drawn as one shared map generator, so the loser costs one composition, not one build); Inversion (what makes the boss NOT believe "under control" - a single salesman on screen, which is why B is not the pick).
