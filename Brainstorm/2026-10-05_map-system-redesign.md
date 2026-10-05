---
date: 2026-10-05
status: BUILT 10:55 (57abe25); round 2 motion b93540f, hub C + sprout 00d787c; FONT pick OPEN (page v2 shows it 3x)
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

2026-10-05 09:25, his words: *"A for phone B for PC"*. Phone = A (the dock), PC = B (the full map, floating cards) -
against my PC pick (A, the side panel). The shop-card ❓ went unanswered: build it as drawn (his "use your pick" habit).
Status: decided, not built - the build is the next ONE JOB (kpm `.claude/NEXT-SESSION.md`).

## Built (2026-10-05, kpm 57abe25, local, not pushed)

- **Areas = the shop's own city / region field** (`src/utils/mapAreas.js` `rankAreas`), not `zoneRevenues` (per drawn
  border, computed only with heat on). Picked because the ranking must answer "which area sells" before any border is
  imported. Flips if he wants the ranking by his drawn kecamatan borders - the Sector board still does that.
- **The card as drawn** (his ❓ unanswered): money tiles boss-only, same gate as the old card. "Call" is labelled
  WhatsApp, because that is what the key opens.
- **Tool windows unchanged**: Tier rules, Borders setup, Sector board and the new-shop form keep today's look (not drawn).
- **Trap hit and fixed**: a CSS `display` on a `hidden lg:flex` element un-hid the PC Areas card on the phone -
  `expedition.css` loads after Tailwind, same specificity, later wins. Caught by the overlap measure, not by eye.
- Proof: `Raw/2026-10-05-map-system/built/` (shoot-built.mjs, built.json, frames pc-* / pc1024-* / pcsales-* / ph-*):
  0 overlaps, 0 spilled text, 0 sideways scroll, 0 phone targets under 44 px, one-sheet rule holds, 0 console errors;
  logicFixes 2210/2210, audit 722/722, Journey test 49/49.

## Round 2 (2026-10-05 11:24) - font, hub mark, Unranked logo, motion

**The problem, his words** (with a screenshot of the totals bar: 152 / Rp 45 rb / 151): *"the fonts is really bad i want
u to change it, make sure all the animation is on theme with ours, and make sure that symbol for wholesale hub is more
visible than other stores and i think i need new logo for unranked tier"*.

**Root cause of the font** [certain]: `--font-display` names "Barlow Condensed" but nothing loads it (no Google Fonts
link, no @font-face, no package) - Windows has `ARIALN.TTF`, so every big number and title in the app is Arial Narrow.
Every drawing he approved loaded the real Barlow, so the app never looked like its drawings. App-wide, not Map System.

| | Font | Wholesale hub | Unranked |
|---|---|---|---|
| A | today (Arial Narrow) | bigger + gold ring | log |
| B | Barlow Condensed loaded, labels stay mono (MY PICK) | warehouse roof | sprout (MY PICK) |
| C | Rajdhani for numbers AND labels | roof + the word HUB (MY PICK) | raw ore |

**Costs.** Font B/C change every screen's big numbers and titles (and C every label and number table too); widths
measured so far were measured in Arial Narrow, so a tight key may need re-measuring after the switch; the font must
ship inside the app (offline PWA), e.g. the @fontsource package + woff2 in the precache. Hub C = two extra elements on
the pin (roof + word), a taller hit box. Unranked: the log reads like a camera at 14 px, the ore like a blob.

**Built without asking (conformance, not a choice):** motion on Journey's theme - kpm `b93540f` (every key acts out
its job, no bounce, no forever-pulse; the new-shop form no longer lands half off-centre).

**Decision, 2026-10-05 11:50, his words:** *"i cant see the fonts the example u are giving me is too small wholesale hub is C
good, unranked is sprout"*. Hub = C, Unranked = the sprout (my pick) - both BUILT, kpm `00d787c` (the hub also rides outside the
cluster bubbles, so it shows at every zoom). Font: still OPEN - the page now shows the totals bar, an area row and the phone
header zoomed 3x (`big-*.png`, `shoot-fontbig.mjs`), page v2. Page: https://claude.ai/artifact/J7Y5RdwwUhtRPas3KP8Fti (source
`Raw/2026-10-05-map-system/round2/map-system-round2.html`, frames `font-*.png`, `ground.png`, shooter `shoot-round2.mjs`).

**Rejected on purpose:** an amber FILL roof or HUB tag (palette law: amber is an edge and an ink) - both are drawn as
a gold edge on the dark plate; a green sprout (no green); pins scaled down to fit the page (the page crops the map
instead, so every pin is shown at its real pixel size).

Models applied: Inversion (what makes a hub invisible: same size, same shape, a thin ring), Second-Order Thinking (a
font fix ripples to every screen and to every width measured in the wrong font).

## Rejected on purpose

- Chests and the game sign objects on Map System: those are Journey Plan's language for a VISIT; Map System is about the
  shop's level and the area, so it gets level badges (his "each map has one job", 2026-10-03).
- The Territory Control box as its own HUD: folds into the Catchment key (it only means something with catchment on).
- Dropping any tool: every one of today's tools stays (Chesterton's fence - not one was asked to go).

Models applied: Inversion (what makes a store-analysis map useless: the answer behind a menu, every pin alike, no
numbers), Chesterton's Fence (every existing tool kept), Opportunity Cost (A's narrower map vs B's hidden ranking).
