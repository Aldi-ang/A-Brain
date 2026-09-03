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
| 2 | **The display** | one line written and holding | four lines write left-to-right, linear, 55ms apart | all lines snap full, screen takes an inner glow | at 22px the lines are 1,5px — delicate, not punchy |
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

**OPEN — waiting on Aldi.** He picks one of the four. Then, in his order: swap the pad's amber
tokens, build the picked icon into `PonderBookButton`, and size the pad for the phone.

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
