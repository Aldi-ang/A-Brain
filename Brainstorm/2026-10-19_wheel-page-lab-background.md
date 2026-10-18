---
title: Wheel page background - three Ark Lab looks
created: 2026-10-19
status: OPEN - waiting on Aldi's pick (A / B / C)
tags: [kpm, presentation, design, ark-lab, brainstorm]
---

# Wheel page background - three Ark Lab looks

## The problem, in his words

On the customer presentation's feature-wheel page (the 3D carousel of 23 cards), 2026-10-19:
*"i need better background for this panel btw, that represent our Resident evil requiem theme, the lab and dark theme"*.
Same message: *"this tutorial is not needed"* - the how-to line under the heading (removed, kpm `dc4d3b0`).
Same morning: *"i want when i hover the carousel it slow its speed gradually rather than completely stop just to make it more natural"* (built, kpm `1315ef7`).

Today the page is a soft gold glow on black. Theme law for dark mode (his words, 2026-08-13): *"black white and amber"*; no blue, no green.

## The options (boards: `Raw/2026-10-19-wheel-bg/board-390.png`, `board-1440.png`; CSS in `bgboard.mjs` there)

| | Look | What it costs |
|---|---|---|
| A · Containment bay | riveted steel wall, amber cage lamp overhead, amber lab-floor grid at the bottom, hazard tape on the bottom edge | quietest of the three; the floor only shows on tall screens; the tape sits under the capybara's walk line |
| B · Specimen lab | two glass specimen tubes lit amber from below at the page edges, schematic grid, faint scanner rings behind the wheel | the strongest "lab" read on the PC; on the phone the tubes are thin slivers at the edges; the capybara's rock flies past a tube on the PC |
| C · Containment platform | the wheel stands on a lit floor ring (dotted amber lights), red emergency light in the top corners, low fog, vent slats under the bar | the only one that gives the wheel a floor to stand on; red is the accent, kept faint so it never reads as an error |

All three: CSS only (gradients on `.hubsec`, pseudo-elements), nothing moves, so Lite Mode loses nothing. Palette: black, warm white, amber; red only in C.

## Decision

OPEN - waiting on Aldi. After the pick: move that option's CSS from `bgboard.mjs` into the page (drop the `html[data-bg]` prefix), re-shoot 390 + 1440, publish v31 (hover slow-down + no how-to line + the background).

## Rejected on purpose

- Green or blue lab light (the obvious RE look): palette law.
- A photo or AI-drawn lab image: the page is one self-contained file and every other picture in it is drawn from the app's own parts.

Models applied: Reversibility Test (each option is one CSS block - a two-way door, so a quick pick is cheap); Second-Order (the capybara walks the bottom edge and flies across the page - checked each option against his path in the PC frames).
