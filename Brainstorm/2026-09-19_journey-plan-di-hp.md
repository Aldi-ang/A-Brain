---
title: Journey Plan on the phone — the top card, the store card, the path row and the sector reel
type: brainstorm
created: 2026-09-19
status: DECIDED 2026-09-19 02:30 — board 1 = B, board 2 = B, board 3 = YES, plus "fix the map"; all shipped as kpm 056d8e3
tags: [kpm, phone, journey-plan, design]
---

# Journey Plan on the phone (2026-09-19 01:45–02:20)

## The problem

The sixth screen of the phone sweep he set on 2026-09-15 (Sales Terminal ✓ → Customers ✓✓ → Agent
Inventory ✓ → EOD Setoran ✓ → Stock Opname ✓ → **Journey Plan** → Sampling → Agent Profile).
Journey Plan is where a salesman plans the day's route — the day picker, the map, the drill-down
RADAR HUB › province › kabupaten › the stores due, each store with ENGAGE TARGET (jump to the
terminal), RADAR (fly the map to it), NAVIGATE (Google Maps) and LOG (a visit note) — and where the
boss reads every agent's route, assigns stores to agents and paints fleet colours. Never measured
at 375 inside the shell. Measured as BOTH tiers (`?shell&journey`, `&admin`): identical except the
boss's PAINTBRUSH key where the salesman has SQUAD LEGEND.

## What the pane measured at 375 inside the real shell

**Top of the screen.** The MISSION FEED card is 340 px before the map (`bg-black/40 p-5`, progress
bar, then the filter panel). The desk's two filter columns (`flex-1 min-w-[200px] … border-r pr-4`,
`JourneyView.jsx:896` / `:914`) stack on the phone but the first keeps its right border — a stray
line. The three region `<select>` are 144 / 81 / 81 × 30 at 10 px in one `flex gap-2` row; the third
runs to x 367 past its column's edge at 330 (a `<select>` has an intrinsic min width, so the row
cannot shrink it). The FLEET and DAY pickers are 13 px tall `<select>` inside 27 px `p-1.5` boxes —
the trap the note already carries (the wrapper is not the tap target). Every label 10 px
(`text-[10px]`: Elimination Status, Regional Command, Operational Filters, Squad Legend / Paintbrush,
the four map key titles, "1 Regions • 4 Targets", the address line). SQUAD LEGEND / PAINTBRUSH
149 × 37 / 136 × 37; the four map keys 43 × 43 (`p-2.5` + border-2 + a 20 px icon). The map is
`h-[400px] lg:h-[500px]` — a fixed box by design (its own pan/zoom), starts at y 576.

**The drill-down.** RADAR HUB (44) › province card › kabupaten card › the stores. At the store level
the path row (`flex flex-wrap … w-max`, `:1338`) measures 379 wide at x 8 → right edge 387, and the
sector reel (`flex overflow-x-auto hide-scrollbar gap-3 pb-4 -mx-4 px-4`, `:1412`) is l −8 / r 383:
`-mx-4` was written for a `p-4` page and the shell is `p-2` on the phone. Shell scroller
`scrollWidth 387` on a 375 screen — the whole page slides sideways 12 px. The reel is a swipe reel
(sideways is banned, his 2026-09-18 11:11).

**The store card** (`:1473`, 318 wide because the kec block is `p-5`): 383 px each. A tool bar
(`bg-black border-b p-1.5`) with ↑ ↓ reorder keys 24 × 24 at 12 px and the assign-agent `<select>`
128 × 23 at 11 px (disabled for a T5, still painted); a 96 px `h-24` band showing NO INTEL on a
hex texture when there is no photo, with WHO | #STOP and RANK / PRICE pills over it; the name
`truncate` (cut with … — the same hazard as the product name, 2026-08-17); the status pill 11;
the address 10 px `line-clamp-2`; ENGAGE TARGET 283 × 44; RADAR 76 × 44 / NAVIGATE 114 × 44 /
LOG 76 × 44. Four stores = 2,610 px of page; a day with twenty stores is ~7,600 px.

## The options (boards in the scratchpad `jp/`, also sent to him)

| Board | Option | What it is | Costs |
|---|---|---|---|
| 1 top card | A | the floor: pickers 44 × 11 px one per row, the stray column line gone, labels 11, legend + map keys 44 | the card grows 340 → 409; the map starts at 645 |
| 1 top card | **B (rec.)** | MISSION FEED folds to one 44 px row (day · region summary, ▾), progress bar stays; tap → the A pickers slide open (the PROJECTED VALUE fold he said yes to on Agent Inventory) | 102 px card, map at 288; the boss's region pickers are one tap away — but the RADAR HUB cards already do the same navigation |
| 2 store card | A | the floor: ↑ ↓ 44, assign 44, name whole, address 11 | card 383 → 405 |
| 2 store card | **B (rec.)** | tool bar + picture band gone on the phone; one 44 px strip carries WHO \| #STOP + RANK / PRICE; a ⋯ key beside the name folds MOVE UP / MOVE DOWN / ASSIGN under it (the Customers ⋯ he chose 2026-09-18); the three keys 44 | card 321; moving a store in the route is one tap further |
| 3 path row + reel | YES/NO | the path row wraps inside the page, no sideways move; the sector cards wrap two to a row instead of swiping; every key 44 | none measured — pure floor, his own sideways rule |

Live: `?shell&journey&look=jp-floor` (board 1 A / 2 A / 3 AFTER), `&look=jp-floor,jp-fold`
(board 1 B), `&look=jp-floor,jp-card&tab=unmapped%20provinsi,bandung` (board 2 B). Measured after
each look: sideways 387 → 375, nothing under 44 (jp-floor), nothing under 11 px.

## Models applied

Opportunity Cost (a fold costs one tap, the floor costs a screen of scroll per morning — for a
salesman scrolling twenty cards, the scroll is the daily price). Second-Order (folding the region
pickers hides the boss's navigation — checked: the RADAR HUB drill-down IS the same navigation, so
nothing is lost). Chesterton's Fence (the ↑ ↓ reorder keys: `moveStore` orders the day's route —
kept, behind the ⋯, not deleted). Inversion (B on board 2 fails if salesmen reorder the route every
morning — twenty stores × two taps; that is the flip condition and it is his to answer).

## Rejected on purpose

- **Hiding the reorder arrows on the phone** — a control that is the only route to reordering
  would vanish (the book-ribbons lesson, 2026-09-01). They fold, they do not hide.
- **Auto-skipping the province / kabupaten cards when there is one of each** — that is logic, not
  layout; "keep the logic" every time. Not proposed.
- **Repalette (blue NAVIGATE, blue PRICE pill, green fleet picker, green CLAIMED stamp)** — the
  appearance job is parked on purpose ("Appearance — deferred on purpose, last": JourneyView.jsx
  carries 33 blue/green classes). The boards show today's colours so the frames are honest.
- **Shrinking the map on the phone** — 400 px of 812 is the one thing on this screen that is
  correctly a fixed box; fullscreen exists.

## Decision

His words, 2026-09-19 02:30: *"board 1 = B, board 2 = B, board 3 yes, btw fix the map because it said
api key needed or something"* — the recommended option on both boards, and one ask that was not on
any board. Shipped as kpm `056d8e3`. The one thing the boards did not show and the built screen
does differently: the store card's tools fold open at the FOOT of the card (order-last), not under
the name — the tool bar is the same element on both widths and the desk keeps it on top, so
"under the name" would have needed a second copy. The ⋯ sits beside the name as boarded.

**The map ask.** "API KEY REQUIRED" was the tile server, not the lab: CARTO's basemaps watermark
every tile now (a tile fetched with curl carries it). Both maps moved to Esri's key-free canvases
(Dark Gray on Journey Plan and the War Room, Light Gray for the War Room's light layer),
`maxNativeZoom 16`. He saw the watermark in the board frames and reported it as a bug in the
app — it was one, on his phone and on the War Room, not only in the lab.

**Caught by the frame, not by a check:** a heading wrapped in a `<button>` lost its `uppercase`
(Tailwind's preflight resets `text-transform` on buttons); the desk would have changed. One
screenshot of the rendered row showed "Mission Feed" in mixed case; the button now carries
`uppercase`. The preflight reset is now trap (m) in NEXT-SESSION.md.

See also: [[2026-09-18_stock-opname-di-hp]] · [[../Wiki/Concepts/Aldi's Design Taste]] ·
[[../Wiki/Concepts/Looking at the App]]
