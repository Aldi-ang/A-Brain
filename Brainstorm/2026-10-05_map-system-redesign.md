---
date: 2026-10-05
status: OPEN - waiting on Aldi (PC A/B, phone A/B, the shop card)
page: https://claude.ai/artifact/WxW6xpYd3dhLhyEwZ6Gn8u
source: Raw/2026-10-05-map-system/map-system-redesign.html (frames: pc-*.png, ph-*.png, states.json)
---

# Map System redesign

## The problem, his words

2026-10-05 09:08: *"continue to redesign the map system first since nothing to improve yet in the journey plan for now"*.
The job he gave this screen on 2026-10-03: *"map mission control is used to analyze the stores distribution channel,
sales performance of an aread, stores level and position"*; queued since then as *"we should redesign the map system as
well later"*.

What today's screen does against that job (frames shot on the lab build, real clicks, 1440 and 390):

1. It does not open on its job - at rest a map with three blue bubbles; area sales and shop levels hide behind ☰; no
   legend for the levels.
2. Off the palette law - blue bubbles and Directions key, purple "Catchment ON", green "Street Peddler", an orange FILL on
   "Show All Tiers" (amber is an edge and an ink, never a fill), white Leaflet zoom/layer keys. A different app from
   Journey Plan.
3. The shop card is thin for analysis - no level, no sales, no salesman; "Never Visited" in a red box.
4. On the phone the menu covers ~60% of the map. Detector: 11 grey-on-colour texts, 6 bounce/elastic easings.

## The options (drawn on the page, in his palette, example data)

| | PC | Phone |
|---|---|---|
| **A** (my pick) | Journey's sibling: map + an Areas panel beside it (where Journey keeps the Expedition panel): areas ranked by this month's sales, each bar split by its shops' levels; levels as filter chips; layer keys top-right of the map; a pressed shop swaps the panel for its card | Journey's full-map dock (Areas / Levels / Layers / Locate); one key opens one sheet; press again = whole map |
| **B** | Full map: three totals at the top, top-3 areas floating left, levels bottom-left, layers in a bottom dock | Pull-up sheet that peeks with the three totals; tabs Areas / Levels / Layers |

Same in A and B: the shop marker = level as colour AND shape (Mythic gold crown, Epic rust flame, Grandmaster cream
crossed swords, Bronze bronze shield, Unranked grey dot); "needs a visit" = a dot on the corner (red overdue, gold due
soon), not the whole ring. The card: level, area, salesman, this month's sales, last order, still unpaid, visit rhythm,
next visit; Directions / Call / ⋯ (Edit pin, Wholesale hub, Delete - boss only) / On Journey Plan.

## What each costs

- PC A: the map is about a quarter narrower. PC B: the full ranking is one press away and floating cards cover shops.
- Phone A: one press to see the ranking. Phone B: the sheet always takes the bottom of the map.
- Building either: the Areas ranking needs sales per area - `zoneRevenues` (by drawn boundary) exists for the heatmap;
  ranking by the shop's own kabupaten/kecamatan field would not need borders drawn. Decide at build time, say which.

## Decision

OPEN - waiting on Aldi: 🔴 PC A or B, 🔴 phone A or B, ❓ anything to add to or drop from the shop card.

## Rejected on purpose

- Chests and the game sign objects on Map System: those are Journey Plan's language for a VISIT; Map System is about the
  shop's level and the area, so it gets level badges (his "each map has one job", 2026-10-03).
- The Territory Control box as its own HUD: folds into the Catchment key (it only means something with catchment on).
- Dropping any tool: every one of today's tools stays (Chesterton's fence - not one was asked to go).

Models applied: Inversion (what makes a store-analysis map useless: the answer behind a menu, every pin alike, no
numbers), Chesterton's Fence (every existing tool kept), Opportunity Cost (A's narrower map vs B's hidden ranking).
