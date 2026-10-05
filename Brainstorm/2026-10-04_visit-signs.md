---
date: 2026-10-04
status: C DECIDED + BUILT (kpm bcae573); round 2 DECIDED B + BUILT (kpm 635c62e)
tags: [kpm, journey-plan, map, signs, animation, design, brainstorm, open]
---

# Journey Plan - clearer visit signs, each acting out its word

## The problem, his words (2026-10-04 17:10)

> *"we need to make better sign and animation for the repeat order, stock full and all of those status just to make it
> more clear to understand and memorize"*

The 8 statuses: Sale, Repeat Order, Stock Full (No Order), Competitor Issue, New Request, Store Closed, Routine Check,
Exchange (retur). Today's signs (`PIC5` in kpm `src/utils/mapSprites.js`) are a 9 x 6 dark picture on ONE identical
cream board, 22 px on the map.

**Measured why they fail:** silhouette overlap between any two of today's signs = 1.00 (every sign has the same
outline - the board), so at map size only the tiny picture differs; only issue/closed use colour (red). Grey view on the
board: Today and A collapse into the same board; B's 8 shapes all tell apart. (`Raw/2026-10-04-day-replay/shoot-signs.mjs`,
`shots3/measure3.json`.)

## The options (all drawn on the live page, Today beside each, map size + zoomed, grey view, acts frozen)

| | What it is | Cost / weakness |
|---|---|---|
| **A · Colour boards** | Today's board kept; its face colour = family (gold = money, cream = no sale, red ink = problem, dark = closed); pictures redrawn bolder | still one outline for all 8 - in the grey view the families merge; colour carries the meaning, which his round-7 rule forbids (colour-blind) |
| **B · Objects (my pick)** | No board. Each status is its own thing: the app's coin, a cart, a full shelf, crossed swords, a pinned note, a little shop with shutter + padlock, a magnifier with a tick, a taped crate trading places with a clean one. The lamp colour says the family (gold money / pale no sale / red problem / none closed) | new drawings to learn once; swords are thin at 22 px (the red lamp carries them); the shelf and the shop were both squares until the shop got a roof (overlap 0.92 -> fixed) |
| **C · Objects + word** | B with a one-word tag under it, the name tag's own style (SALE, ORDER, FULL, COMPETITOR, REQUEST, CLOSED, CHECK, EXCHANGE) | words are 40-60 px wide under a 28 px chest: they overlap on a busy map; in the app they would show only when zoomed in |

**Each sign acts out its word once, then stands still** (700 ms, transform/opacity only, no loop, no flash):
coin jumps and spins one turn (the app's own 8-frame spin) · cart rolls away and comes back round · one more pack is
pushed in, no room, bounces back out · two swords swing in and clash · note drops, pin presses, it swings from the pin ·
shutter rolls down, padlock drops on and swings · glass sweeps, a tick shows · taped crate and clean crate trade places.
Lite = the still end pictures. Brightness check over 24 s of replay: worst frame share 0.036 (B) vs 0.024 (today), mean
brightness unchanged 83.1-84.5 - no flash.

## Decision

**DECIDED 18:30 - C.** His words: *"C is the best because it is really clear"*. He took the WORDS over my pick B (the
objects alone) - the same choice as the name tags on 2026-10-04 09:05: readable words beat a picture he has to decode.
**Built kpm `bcae573`** (19:05): `mapSprites.js` PIC6 / SIGN5 / SIGN_FAMILY / SIGN_WORD / `kindByShop`, acts as CSS
keyframes in `expedition.css` (kx-a-*), words decluttered like Expedition's shop names (`SignWords` in JourneyView).
Found on the way: every transaction today counted as a sale, so an exchange-only shop showed the Sale coin - fixed.
Checked: logicFixes 2194/2194, map test 49/49, the 8 built signs frozen at 7 moments inside real markers
(`Raw/2026-10-04-signs-built/moments-built.png`, rest = one cached picture each, 0 squares).

## Round 2 - the open-request mark (his 18:30)

> *"btw for request since it is very important we need more visible compared to other maybe add some flag on that stores
> until order is fullfilled"*

Drawn on the same page (v4), top right of the chest (the red "nobody's shop" flag owns the top left), on a shop, a
pressed shop (0 clashes with the name tag after a 6 px move), a nobody's shop and a bubble:

| | What | Cost |
|---|---|---|
| **A · Banner flag (his idea)** | cream swallow-tail banner with the note's lines, raised up its pole once | still a FLAG next to the red flag; colour, notch and lines tell them apart - weaker in the grey view |
| **B · The "!" (my pick)** | a game's "!" block (gold, dark "!"), drops in once | a new shape to learn; reads as "this shop wants something" in any game |

What clears it needs DATA: today a visit report overwrites `lastVisitTag`, so a request is forgotten at the next
visit. "Until fulfilled" = a new field on the store (e.g. `openRequest: { note, at, by }`) set by a New Request report
and cleared by... **OPEN - his answer owed**: (1) a "Request done" press on the shop popup (recommended - exact, it
reports, the log keeps who/when); (2) the next sale at that shop (automatic, but a normal sale would clear a menthol
request nobody delivered); (3) the next visit of any kind. Also asked: does Repeat Order (an order waiting for delivery)
get the same mark - his "until order is fullfilled" could mean it. Firestore rules for the store update must be read
before building (a salesman may not be allowed to write a new field).

**DECIDED 19:25 - B.** His words: *"B is good"* (the "!", my pick). He did not answer what clears it; built with my
default (1, a "Request done" press - nothing clears it by itself) and New Request only, both said in the reply as
changeable. **Built kpm `635c62e`** (19:37): `openRequest { note, day, by }` on the store, written by a New Request report,
taken back by undoing today's request, cleared only by the Request done key (card + map popup; asks, logs REQUEST_DONE,
reports). No rules change (customers update has no field list). Lab probe with real presses: "!" on 3 chests + bubbles,
0 clashes, Cancel writes nothing, Confirm one update (`Raw/2026-10-04-signs-built/probe-req.mjs`, `req-map.png`).

Rejected on purpose: the selected-salesman marker (gold chevron over the pressed man) - it already means "this is the man
you pressed"; a second red flag (colour-only difference, his round-7 colour-blind rule).

Models applied (round 2): Reversibility Test (a new stored field is a one-way door - ask before writing it), Second-Order
(auto-clear on sale silently drops a request).

## Round 3 - the word only on hover or hold (his 19:45) - BUILT 2026-10-05, kpm `15f21ce`

His words: *"i think it will looks better when the request, sales and any other description on the chest indicator is only
showing when hovered or hold that way it looks cleaner"*. No options drawn - the ask named the mechanism; my defaults, his to
change:

| Call | Picked | Why |
|---|---|---|
| What hides | only the word | the sign object, its lamp and the request "!" stay (he asked for the "!" to be MORE visible, 18:30) |
| PC | mouse hover, CSS only | inside `(hover: hover) and (pointer: fine)`, so a phone never gets a sticky hover |
| Phone | a hold of 350 ms (`FOLDER_HOLD_MS`) shows that chest's word | his folder-day rule: hold is a preview, tap is the commit |
| When it hides | on release, no delay | same as the folder: open while the finger stays, shut on release |
| The shown word | rises over its neighbours | with the overlap hider gone, a neighbour chest could cover it |
| Overlap hider (`SignWords`) | removed | one word at a time has nothing to collide with |

The trap the brief named was real: on the old build a held finger's release opened the popup (measured). The click after a
hold is swallowed on the map container in the capture phase, before Leaflet's own listener on the same container.

Proof: `Raw/2026-10-05-sign-hold/probe-hold.mjs` (real CDP mouse + touch on the production lab build) - before: 18 words at
rest, hold opened the popup; after: 10/10 (`hold.json`, frames `pc-hover.png`, `ph-hold.png`, `ph-tap.png`).

Found on the way, NOT caused by this: `test-journey.mjs` "Selling moment: 4 frozen frames" fails 16/16 retakes on the code
before this change too (05:50 WIB, 2026-10-05). Cause not found; [guessing] the lab's sale times vs the early-morning clock.
The other 48 pass.

## Round 4 - the shop's name always, the status on demand (his 2026-10-05 07:10) - BUILT kpm `977dd08`

His words: *"the description status is hidden for the store but keep the store name visible"* and, asked nothing,
*"right now it is hidden and showed only when hovered"* (the name lived only in the PC hover tooltip; the phone had none).

| Call | Picked (my default, his to change) | Why |
|---|---|---|
| Where the name sits | under the chest, below the sign's foot, name-tag style | the word's old row; the owner tag "BS · 3" owns the top |
| Where the status goes on hover / hold | joined to the name's right end, one strip, gold | his "stacking reads as clutter" (2026-09-28): never a second box |
| Long names | end in "..." at 110 px | the popup has the whole name |
| Crowded names | hidden while they would sit on another name, tag, man, bubble or chest; zoom in brings them back; hover / hold shows one anyway | Expedition's own rule for shop names, which he already lives with |

Measured (probe-hold.mjs, 14/14): 19 of 28 names shown at 1440 and only **2 of 8 at 390** at the probe's zoom - on the phone
most names wait for a zoom-in. That is the cost he has not priced; if he says "all names", the next lever is a smaller
name or a zoom threshold, not overlap.

## Round 5 - Mission Feed: the Global Fleet filter out, a shop search in, on both maps (his 2026-10-05 07:30) - BUILT kpm `517c0c5`

His words: *"and also we need to redesign this a little, global filter is useless since we have the expedition panel now
right and we need to add searching box for store name to show the location we also need that on the regular map"*
(screenshot: GLOBAL FLEET open, "<name>'s Bounties" rows).

- The filter fed three things; all left with it: the "'s Bounties" list, "Global Fleet" in the header line, and an orange
  dashed street route fetched from router.project-osrm.org for one salesman (the Expedition press draws his road now).
  The big "18/32 secured" counter now always counts everyone; per salesman lives on his Expedition card.
- "Find a Shop" sits in the filter's slot: part of a name + Enter, or a pick from the list -> the map flies there
  (StoreFocus, zoom 16). Every shop is searchable, not only today's round: a shop off the round is shown where it is and
  the box says no chest is drawn there (NOT checked - every lab shop visits daily).
- Map System: the same box under "All Regions"; a pick presses the shop's pin (its card opens).
- Native `<datalist>` for the suggestions (no new code to style or maintain); the browser's blue clear "x" made grey.
- Found on the way: the Map System shop card's "Directions" button is blue (palette law) - not touched, not asked.

Models applied: Chesterton's Fence (what the filter fed before deleting it - the street route and the counter),
Second-Order (a crowded phone hides most names - stated, not hidden), Inversion (what makes a search lie: landing on
"Toko Sinar Abadi" for "Toko Abadi" -> exact name first).

## Rejected on purpose

- **A rival FLAG for Competitor** (in the brief): the red pixel flag already means "nobody's shop" on the same map
  (his 2026-10-04 ask). Two flags = two meanings for one shape. Swords instead.
- **A crate for Repeat Order**: three crates (order, competitor, exchange) would read alike - the exact fault being fixed.
  Order is a cart; only Exchange keeps crates (the taped one = Quarantine, which he knows).
- **Arrows alone for Exchange**: tiny cream arrows read as "+" at zoom (seen on the first board). Real down/up arrows +
  the two crates.
- **Loops**: no sign moves after its moment (his "a light blinks only while something is happening right now").

Models applied: Inversion (what makes a sign un-memorable: same outline, colour-only meaning), Second-Order (a flag
already means something on this map), Opportunity Cost (C's words vs map clutter beside the name tags).
