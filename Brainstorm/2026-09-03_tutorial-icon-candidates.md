---
title: Tutorial icon candidates — replacing the book
description: Four launcher icons built from the field terminal's parts, the amber swap they carry, and the two jobs waiting behind Aldi's pick.
type: brainstorm
created: 2026-09-03
updated: 2026-09-03
confidence: high
checked: 2026-09-03
tags: [design, ponder, icon, animation, amber, aldi]
---

# Tutorial icon candidates — replacing the book

## The problem, in his words

> *"change the light amber to normal glowy amber that we use on our theme then integrate it now to
> the app for phone sizing, but before that i want to see the animation icon for this panel
> replacing the book first, make sure its animation looks gamified and cool and of course looks
> like this panel"*

**Three jobs and he set the order himself.** The icon comes first and gates the other two.

The tech pad is replacing the Ponder book. The book still has a launcher in the top bar —
`BookGlyph` inside `PonderBookButton`, `src/ponder/PonderBook.jsx:259` — a 21x30 closed book with
a hinged cover, a specular sweep and four hover sparks. Once the panel is a field terminal, a
leather book in the top bar is pointing at something that no longer exists.

## The options

Bench: https://claude.ai/code/artifact/a60961be-28e2-4887-9129-cf723689d529 · source
`Brainstorm/assets/ponder-icon-bench.html`

All four are 22px, built the way the pad is built — boxes, gradients and inset shadows, no SVG
paths — so the icon and the panel are provably the same object at two sizes, and a 4x
magnification has nothing rasterised in it to fall apart.

| # | Candidate | Idle state | Hover | Press | What it costs |
|---|---|---|---|---|---|
| 1 | **The cap** *(recommended)* | one dark key in its well, black lamp | lamp blooms overbright then settles; label lines go amber | cap sinks and STAYS sunk, face lit, lamp white-hot | nothing structural — it is the pad's own latch |
| 2 | **The display** *(chosen)* | four lines burned in at their dim level | four lines re-write left-to-right, linear, 55ms apart | all lines snap full, screen takes an inner glow | at 22px the lines are 1,5px — delicate, not punchy |
| 3 | **The meter** | two cells burned in | cells energise bottom-to-top, 55ms apart | all five go hot | **carries information at rest, so it must be true** — the cells would have to track sections actually read |
| 4 | **The micropad** | one cap latched amber | the latch walks down the rail, 70ms apart | a phosphor line writes across the little screen | four caps at 3px each is texture, not four readable keys — busy at true size |

**Why the cap is the recommendation:** it is the only one that reads as a *button* at 22px and as
*the panel* at 4x. Its press is the latch he approved on 2026-09-03 (*"More 3D means LATCHED, not
floating"*), so pressing the icon and pressing a section key become the same gesture.

**Idle is a still frame in all four, deliberately.** The icon sits in the top bar on every screen
in the app. An icon that animates at rest is exactly the thing he called *norak* this morning —
see [[Aldi's Design Taste]], the "Norak" entry. Motion is spent on hover and on the press.

## The amber, decided by his sentence

The pad shipped with `--lit:#FFCE8F`, a pale amber invented for it. He asked for *"normal glowy
amber that we use on our theme"* — that is `--amber:#F59E0B` in `src/styles/theme.css`, the one he
picked by measurement in August (*"B is better but i like amber color more than gold TBH"*).

Every lit thing on the bench already uses it, so the icon choice and the amber judgement happen in
the same look. Dark ink `#2A1A08` on the new face measures **7,82:1** — a latched key stays
readable.

⚠️ **One flag, not an objection.** `AMBER IS AN EDGE AND AN INK. IT IS NOT A FILL.` is a locked law
(2026-08-21). The pad's latched key face is already an approved exception; #F59E0B makes that fill
more saturated, not less. He asked for it explicitly and the contrast holds.

## Decision

**DECIDED 2026-09-03 — candidate 02, the display.** His words: *"display look the cleanest so
choose that"*. **"Cleanest" is the word to keep** — of the four he took the one with the least
going on, not the one with the most. The cap was the recommendation and it lost on busyness, which
is the same instinct behind *norak* earlier the same day.

He asked for its intro and outro in the same breath: *"now what about the intro and outro make
sure our technological high tech theme stays intact with the animation also and i want u to make
it i want to see it, keep it elegant and cool and gamified"*.

### The intro and outro, built and shown

Artifact: https://claude.ai/code/artifact/d39f91fd-c2b2-4677-acda-3cdaebc2c34b · source
`Brainstorm/assets/ponder-icon-handoff.html`

The icon is a screen, so its entrance and exit are a screen's. **The bezel never moves** — the
housing stays in the top bar and only the picture travels, so nothing in the bar shifts and the
chip stays pressable throughout. That is the book's old contract kept: one object travels, nothing
cross-fades into nothing.

| Moment | What happens | Time |
|---|---|---|
| Outro — squeeze | the picture collapses into one bright scanline | 90 ms |
| Outro — blink | the scanline snaps to a point and fades | 100 ms |
| Panel in | the panel's own crossfade, opacity only | 140 ms |
| Panel out | same, the other way | 170 ms |
| Intro — open | point to scanline, scanline to screen | 240 ms |
| Intro — write | four lines, linear, 45 ms apart | 335 ms |

**Out is faster than in** because the panel is what the reader is waiting for. **The boot is three
beats in a row, never two at once** — the direct application of the norak rule from the same
morning. Nothing new was invented for it: the CRT collapse and the raster write-on are the two
ideas the terminal already had, put in an order.

Two defects were caught before publishing and both were invisible in the source:
- the collapse beam was drawn INSIDE the tube, so the tube's `scaleY(.045)` squashed the 1 px beam
  to 0.045 px and the one thing the whole outro is about never rendered. It is a sibling now.
- rest showed one lit line while the boot wrote four, so three lines popped out of existence the
  instant the boot finished. The write now cools to the dim burn level, the way the panel's own
  labels do, and rest is exactly where the boot lands.

Still queued behind this, in his order: the amber swap on the panel, the icon into
`PonderBookButton`, and phone sizing.

## Rejected on purpose

- **An idle animation on the icon.** Whatever he picks, it does not move at rest. Covered above.
- **Keeping the book glyph and only recolouring it.** He said the icon should look like *this
  panel*; a recoloured book still says book.
- **An SVG icon.** Every other pad part is CSS boxes. An SVG would be a different construction
  that only *looks* similar, and it would not magnify as the same object.
- **Showing the options as prose.** He settled this in August: *"i cant imagine those, why dont u
  generate all of that inside artifact and i choose"*. The deliverable for a design decision is a
  page he can press.

Related: [[Aldi's Design Taste]] · [[Design Inspiration Sources]]
