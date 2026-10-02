---
date: 2026-10-02
status: OPEN - waiting on Aldi (order A/B + the game screenshot), asked 12:35
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

**My pick:** A. **Decision:** OPEN - waiting on Aldi. Also asked: which game he means (a screenshot is the spec - State of Decay 2's map, Fallout Shelter's wasteland list, Frostpunk's scouts all look different).

**Rejected on purpose:** none yet.

**Models applied:** Opportunity Cost (showcase vs feature), Second-Order Thinking (a live map of people changes what a salesman does - he may feel watched; the record exists to defend him too, his own "give the power, keep the record" rule), Pre-mortem (the boss signs up from the showcase, opens the map, sees one blue dot - the showcase oversold).

Related: [[2026-09-30_customer-showcase]]
