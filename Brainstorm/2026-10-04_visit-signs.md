---
date: 2026-10-04
status: C DECIDED + BUILT (kpm bcae573); round 2 OPEN - request mark A banner / B "!" + what clears it, drawn on v4
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

Rejected on purpose: the selected-salesman marker (gold chevron over the pressed man) - it already means "this is the man
you pressed"; a second red flag (colour-only difference, his round-7 colour-blind rule).

Models applied (round 2): Reversibility Test (a new stored field is a one-way door - ask before writing it), Second-Order
(auto-clear on sale silently drops a request).

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
