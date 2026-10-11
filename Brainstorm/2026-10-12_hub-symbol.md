---
title: The wholesale HUB pin - aligned and more recognizable
status: DECIDED - A, built kpm 9104082
tags: [kpm, map, design, brainstorm]
---

# The wholesale HUB pin

**Problem, his words (2026-10-12 05:43, with a phone shot of the pin):** *"i found bug, i feels like the logo here is not inline with the HUB symbol bro i think we need more recognize able HUB symbol here as well and i checked that the capybara voice is soo much better"*

**Measured (real markup + the app's built stylesheet, lab page):** the roof's centre is 184 px, the badge's 187.5 px - the roof hangs **3.5 px left**. Cause: `src/styles/expedition.css` `.ms-mk > svg.roof { left: -7px; right: -7px; width: auto }` - an SVG's `width: auto` is its own 44 px, so `right` is ignored. And the overdue dot (`.ms-mk .st`, right -5 / top -5) lands on the roof's right end, so it reads as part of the roof. Markup: `src/MapMissionControl.jsx:55-58` (`HUB_ROOF`, `levelBadge`).

| # | What | Cost | Risk |
|---|---|---|---|
| A (MY PICK) | one shape: the warehouse (roof + walls) IS the plate, the level badge big inside it, the HUB word under it, the dot on the plate's corner | one SVG in levelBadge, the roof CSS goes | taller pin (66 units) - two hubs close together overlap sooner |
| B | a warehouse silhouette with a striped roller door, the level badge small on its corner | same | the level (his tier system) is the smallest part - harder to read the tier |
| C | not a building: the badge in a gold ring with 6 spokes going out (the centre goods leave from) | same | at map size it reads like a ship's wheel, not a hub |
| fix only | keep today's roof, centre it (width: calc(100% + 14px)) and move the dot off the roof | 2 CSS lines | his "more recognizable" is not answered |

**Board (sent to him):** `Raw/2026-10-12-hub-symbol/board.jpg` - TODAY vs A / B / C, at map size among two normal pins and at 3x.

**Decision:** A - his paste line 2026-10-12 06:00: *"HUB = A"*. **BUILT** kpm `9104082` (local, not pushed): `levelBadge` draws ONE svg for a hub, 50 x 66 units - roof + walls are the dark plate with a gold edge, the level symbol (any level, not only the sprout) in its door at (25, 34), the word HUB under it; the `HUB_ROOF` svg and its CSS are gone; the dot sits at (44, 9), off the roof line; the map hit box is the drawing + 10 px each way; the shop panel head still hides the word. Size: hub width = pin px + 13 (Unranked on the map = 50 x 66, the board's size). Measured in the built lab at 375 (real levelBadge output injected): pin / roof / word centre offsets 0 px, one svg, dot clears the roof by 3.2 units. Guards: logicFixes "his HUB pick A" + "the HUB drawing re-measured". Tool: `Raw/2026-10-12-batch/hub-html.mjs` slices levelBadge out of the source to inject it.

**Rejected on purpose:** placing the roof by offsets again (any new piece positioned with left/right on an SVG can drift the same way) - every option is ONE drawing, centred by construction.

**Models applied:** Inversion (how would the new pin fail: a dot that reads as decoration, a tier you cannot read at map size, a symbol read as something else - C's ship's wheel); Chesterton's Fence (his round-2 pick was "the object AND the word" - all three keep both).

Also in this message: the mumbling capybara voice CONFIRMED on his phone - *"the capybara voice is soo much better"*.
