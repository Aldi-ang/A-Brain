---
title: A Feature Is Not Done Until the Book Knows
description: Aldi's rule, 2026-08-30 - every new panel gets its own Ponder scene and every new column gets beats on its panel's existing scene, both inside the sidebar section they are printed in.
type: concept
created: 2026-08-30
updated: 2026-08-30
confidence: high
checked: 2026-08-30
tags: [kpm, ponder, tutorial, process, definition-of-done]
---

# A Feature Is Not Done Until the Book Knows

His words, 2026-08-30, at the end of a session that shipped three UI features:

> *"dont forget that we might need to update the ponder book for the new columns and also the new
> panel, remember, new panel and features means different ponder, but inside the same section of
> the book"*

This is a **definition of done**, not a nice-to-have. He said it unprompted, about work that was
already committed and already green.

## The rule, split

| What shipped | What the book needs |
|---|---|
| A new **column** on an existing panel | extra beats on that panel's **existing** scene |
| A new **panel** | its own scene + stage + demo world, registered in `registry.js` and added to `sections.js` |
| Either | filed under the **sidebar section the panel is printed in**, at its top-to-bottom position |

`sections.js` mirrors the sidebar exactly - that was settled on 2026-08-27 when the first version
invented seven categories of its own: *"all the section in the book should follow the sidebar and
everything on the sidebar should be on the book"*. So there is never a question of WHERE a scene
goes; there is only the question of whether it exists.

## Two mechanical traps the first one hit

**The component must live in `src/ponder/stages/`.** The audit scans that folder (plus `demo/` and
`BranchWarehouseManager`) for `data-ponder` keys, and fails when a scene focuses a key nothing
wears. `ShipmentPlanTable` was written in `src/components/` and had to be moved - the same place
`StockByWarehouseTable` already sat, for exactly this reason.

**`data-ponder` is an API, not decoration.** A beat names a key; the overlay lights every element
wearing it. Drop or rename one and the tutorial keeps playing while pointing at nothing.

## And one thing only a rendered frame catches

`at: 'near'` puts the caption beside its subject, which needs room below that subject. On a
**four-row** panel, a beat anchored on the column headers or the first row lands squarely on the
rows underneath - and on a panel whose whole purpose is comparing those rows, hiding them to
explain them is self-defeating. Header and first-row beats use `at: 'bottom'`; rows further down
keep `'near'`, because below them is empty stage.

Sixth member of the family in [[An Effect's Own Cleanup Can Cancel Its Frame]]: every check was
green and the scene played perfectly. Only the picture showed it.

See also: [[Ponder Tutorial System]] · [[What Create Mod's Ponder Actually Does]] ·
[[Looking at the App]] · [[Aldi's Design Taste]]
