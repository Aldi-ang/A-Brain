---
title: Clear Canvas can create stock out of thin air
description: Emptying a vehicle credits the warehouse from the admin's cached screen data instead of the vehicle's live contents. Anything the agent sells while the admin has the screen open is returned to stock twice.
status: Done
done: "ec45ab9 (2026-08-18"
area: Fleet & Canvas
priority: HIGH
created: 2026-08-17
updated: 2026-08-17
---

# Clear Canvas can create stock out of thin air

Found in the 2026-08-17 logic review, second pass.

## What happens, in simple English

"Clear Canvas" empties an agent's vehicle and puts the unsold stock back in the warehouse.

To decide how much to put back, it uses the vehicle contents **as they were when the admin's screen
last loaded** — not as they are at the moment of the click.

If the agent sells something while the admin has that screen open, the app puts the sold goods back
in the warehouse anyway, and then empties the vehicle. Those packs now exist in two places: sold to
a store, and back on the warehouse shelf.

## A real example

- 14:00 — admin opens Fleet & Canvas. The van shows **50** packs.
- 14:05 — the agent sells **20**. The van really holds 30.
- 14:10 — admin presses Clear Canvas.
- The warehouse is credited **50**. The van is emptied.
- **20 packs were invented.**

## The fix already exists fifty lines above it

`handleLoadCanvas` in the same file does this correctly: inside the transaction it re-reads the
agent's document and uses that live copy (`src/FleetCanvasManager.jsx:307-308`).

`handleClearCanvas` skips that step and reads the screen's cached copy
(`src/FleetCanvasManager.jsx:359`), then wipes the vehicle at `:391`.

## Suggested fix, smallest version

In `handleClearCanvas`, read the agent document inside the transaction — exactly as
`handleLoadCanvas` already does — and credit the warehouse from **that** list, not from
`selectedAgent.activeCanvas`.

It is a two-line change, and the pattern to copy is in the same file.

## Related

This is the third bug found today where the warehouse is credited with goods that were already
sold. The other two are [[Offline sales never reduce the van stock]] and
[[Approving a stock count erases everything that happened since the count]]. **Same shape every
time: a stock figure is trusted after the moment it was true.**
