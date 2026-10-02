---
date: 2026-10-02
status: BUILT 2026-10-02 19:44 (kpm eef2f55, local, not pushed) - waiting on Aldi - his real-data test + the pathHistory call
tags: [kpm, map, journey-plan, design, gps]
---

# The expedition map: salesmen roaming with their own destination progress

**Problem, his words (2026-10-02 12:30, right after picking hero A for the showcase):** *"i think we need to improve the map system and journey map so that it could show the sales team roaming around on the map with their own destination progress kinda cools cool just like some survivors on game that runs an expedition"*

## What the app already has (read 12:31, kpm `5f9d5c7`)

| Piece | Today | Where |
|---|---|---|
| Where each salesman is | his GPS point is saved on every sale and when the app opens (`trigger-telemetry-ping`), as `currentLocation` | `src/App.jsx:1779-1817`; dispatched from `useTransactionEngine.js:269/482/664`, `MerchantSalesView.jsx` x5, `MapMissionControl.jsx:185` |
| Shown on the map | a pulsing avatar at `currentLocation` - **blue `#3b82f6`** ring and a dicebear fallback image with a blue background (palette law broken, and an outside image call) | `src/MapMissionControl.jsx:2536-2595` |
| Where he is heading | `nextStop.js` already works out the nearest unvisited shop he may sell to + how many are left - the map never shows it | `src/utils/nextStop.js` |
| The trail he walked | `pathHistory: arrayUnion(point)` on every ping - **read by nothing** (grep: the write is the only hit) | `src/App.jsx:1800` |
| His own "you are here" | `watchPosition` in Journey Plan, local only, off in Lite Mode (battery) | `src/JourneyView.jsx:177` |

**Limits that shape the design:**
- A web app gets GPS only while it is open on screen; with the phone locked there is no position [likely]. So the expedition is honest only as: last known point + today's trail + a dashed line to the next shop + progress. Movement between two known points can be animated; a live moving dot cannot be promised.
- `pathHistory` never shrinks. Firestore caps one document at 1 MiB; at roughly 70 bytes a point that is ~15,000 points, about a year at 40 sales a day [guessing on the rate]. Past that, saves that grow that salesman's record fail, and the failure is only a console line (Silent Failure Disease). UNKNOWN today: the real length - check in the Firebase console, motorists -> one salesman -> `pathHistory`. Any expedition build reads this field and keeps only today's points, which also stops the growth.

## Options (order of work)

| # | Order | Costs | Buys |
|---|---|---|---|
| A | Expedition view in the app first (Map System + Journey Plan), then finish the showcase so its first screen shows the real thing | the showcase waits ~2-3 sessions [guessing]; touches the map, the telemetry write, maybe the rules (a new field) | the showcase stops promising a feature the app lacks; the blue dot + the unbounded trail get fixed on the way |
| B | Finish the showcase now (10 scenes written, `Raw/2026-10-02-showcase-hero/showcase.html`, not yet proven or published), expedition after | the hero shows salesmen walking routes the real map cannot show yet - "Data contoh" covers the numbers, not the capability | the showcase ships in ~1 session |

**My pick:** A. **Decision (18:45):** A - his *"sure lets do A first"*. The expedition map is built in the app first; the showcase waits and then shows the real thing.

## 2026-10-02 18:55 - his reference, researched, and two looks drawn

**His words:** *"i think one of the mobile walking dead game have that expedition kinda system and also how we navigate on the last day on earth when we travel through the map, the zombie game also have that kinda features that show the progress of walking from place to places"*.

**What the research found (browser; the web-search tool and firecrawl were both down):**
- **The Walking Dead: Survivors** (Elex, mobile 4X) - squads "march" from the settlement to tiles on a world map: a straight line base -> target, the squad slides along it with a timer, a march list shows every squad; an "Expeditions" feature since Sep 2024 (their Facebook/Instagram post, 2024-09-05).
- **Last Day on Earth: Survival** - the Global Map: tap a location, the survivor walks / runs (energy) / drives there with travel time shown; locations are named places on a painted map (fandom wiki "Global Map").

**Two looks, drawn on the app's real ground** (the Map System's own Esri dark tiles around Muntilan, zoom 14, brightness 1.2 - `Raw/2026-10-02-expedition/ground.mjs`), one branch + four example salesmen on real roads, live page https://claude.ai/artifact/FCv7roDb7FSofmZig6NxWQ, boards `board-phone.png` / `board-pc.png`, shooter `shoot-exp.mjs`:

| Look | Map | Panel | Costs | Buys |
|---|---|---|---|---|
| A squad list (TWD: Survivors) | white trail of today's sales, a gold dashed march line from his last-seen point to his next shop, a pulsing target, chips with rank rings | one row per salesman: status lamp (En route / At shop / Heading back), 8 segmented cells, km, last seen | phone shows one row; the names of shops are not on the map | the boss sees the whole team; the map gets the most room |
| B travel card (Last Day on Earth) | his shops as numbered pins, names only on the shops still ahead, he stands on the pin of his last sale | "Heading to WARUNG POJOK" big, the shop's lamp (red: overdue bill), his 8 shops as a chain, km / ±min by motor | the map gets ~180 px less on a phone | one salesman's day reads like a journey |

**My pick:** B on the phone, A on the PC (his own 2026-10-02 rule: phone one at a time, PC everything at once). Both share one map layer, so the split costs one extra card component.

**Honesty rules baked into both:** the chip sits at the LAST KNOWN point (his last sale or app open) with "last seen N min ago"; motion only shows a new point arriving (glide to the shop, it lights, count +1) - never a fake live walk. English labels (new UI, his 2026-09-29 rule).

**Decision (19:00):** the split - B (travel card) on the phone, A (squad list) on the PC. His words: *"do your pick both looks good anyway"*. **Rejected on purpose:** one look for both widths (he took the split; do not re-propose a single layout). Also asked: which game he means (a screenshot is the spec - State of Decay 2's map, Fallout Shelter's wasteland list, Frostpunk's scouts all look different).

**Rejected on purpose:** none yet.

## 2026-10-02 19:44 - BUILT (kpm `eef2f55`, local)

Frames: `Raw/2026-10-02-expedition/built-phone-390.jpg` (the pane, real 390, Budi picked by a real tap) and
`built-pc-1440.png` (headless, true 1440x900). Lab mount: `?shell&map` in `tools/ponder-lab.jsx` - the
prototype's team turned back into lat/lng on the same roads.

| Decision made while building | Why | Flips if |
|---|---|---|
| Trail = his SALES today at each shop's pin, not `pathHistory` | the legend says "his sales so far"; no dependency on the unbounded field; no write touched | he wants the GPS walk between shops too |
| Round = his shops due today by the Journey Plan rule, exact name | same rule as Journey Plan; "andi" must not claim Andika's round | the real data has no `visitDay` set - then every man shows a bare count, no "/8" |
| No round today -> next = `nextStop()` over his whole list, count shown without "/N" | a "5/6" made from one suggestion would lie | - |
| Expedition is a SWITCH (footprints, control card), on by itself once anyone was seen today; shop pins + Drop New Pin step aside while on | the design has no shop pins; numbered pins on top of store pins doubled every marker; a T5 still needs the shop map | he wants both layers at once |
| Shop names that collide hide; the next shop's name always stays | four names stacked unreadably at 390 | - |
| Skipped: the chip's glide to a new shop, the rank ring colour, the red "overdue bill" line on the card, the Branch marker | no reliable data source in reach (no branch point, no overdue rule on the map); glide is seen only if watching at that second | he asks for one |
| `master_owner` (the boss's own pings) is not a salesman | "Master HQ 0" row was noise | - |

**DECIDED (20:20): `pathHistory` keeps TODAY'S points only - kpm `664b756`.** Options put to him: A stop writing it
(my pick), B keep only today's points, C leave it growing. His words in order: *"yeah we dont need that history anyway
we just need current position when they use the app or make sales thats all so option A is good"*, then *"wait but
after i think maybe B is safer option"*, then *"if B is no problem in the long term or short term then use B instead"*.
B was built so it costs nothing: the day is kept on the phone (no extra read, works offline, stored before the await so
offline pings do not wipe the list), the first ping of a day replaces the list. Accepted edge: two phones, one man, one
day can drop that day's earlier points (never his position or a sale). **Rejected on purpose:** C (the list grows
toward the 1 MB record his van stock lives in). A lost only to his wish to keep today's walk for later - flips if
the list stays unread for good. Taste note: he picks the option that keeps data when the cost is shown as zero.

**Models applied:** Opportunity Cost (showcase vs feature), Second-Order Thinking (a live map of people changes what a salesman does - he may feel watched; the record exists to defend him too, his own "give the power, keep the record" rule), Pre-mortem (the boss signs up from the showcase, opens the map, sees one blue dot - the showcase oversold).

Related: [[2026-09-30_customer-showcase]]
