---
title: Wheel page background - three Ark Lab looks
created: 2026-10-19
status: DECIDED - C (containment platform), live 2026-10-19 as presentation v31
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

**C, 2026-10-19 ~06:00.** His words: *"C but make sure it looks good both in phone and pc"*. Built as kpm `7745a9f`, live as artifact version 28 (presentation v31). Two changes from the board version, both for "phone and pc": the red was a percentage-sized glow that met in the middle and read as one dark-red band across the top on the PC - now sized in pixels (clamp 150-380 px) so it stays in the corners (measured: top middle 17,15,12, corners 50,21,21 / 35,18,16); the dotted floor lights moved up 10 px to clear the phone's buttons. Checked at 360 / 390 / 1440 / 1920.

## Rejected on purpose

- Green or blue lab light (the obvious RE look): palette law.
- A photo or AI-drawn lab image: the page is one self-contained file and every other picture in it is drawn from the app's own parts.

Models applied: Reversibility Test (each option is one CSS block - a two-way door, so a quick pick is cheap); Second-Order (the capybara walks the bottom edge and flies across the page - checked each option against his path in the PC frames).
