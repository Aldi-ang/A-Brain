---
title: The Book as a Stack of Sheets
description: The tutorial book rebuilt on the Framer interactive-book technique — the four things that make a page a sheet, why the leaves had to become the chapters, and why a phone turns to -90 instead of -180.
type: concept
created: 2026-09-01
updated: 2026-09-01
confidence: high
checked: 2026-09-01
tags: [design, ponder, animation, 3d, aldi, framer]
---

# The Book as a Stack of Sheets

Aldi, 2026-09-01, after three failed passes at the phone close:

> *"the only way to do this is the follow this one
> https://framer.com/m/InteractiveBook-xGXc.js@uLOYl8huI2w4XDdONaRK and i want u to change the pc
> version with this one also, i want this 3D style and also i want the page to be drag able to
> change the page left and right with smooth motion"*

Built and committed as `9a9cb62`. **He has not judged the motion yet** — a still frame cannot
prove one, and three of the previous day's passes cleared every check here and were still wrong.

## The licence line

The component is on Framer's marketplace and it is someone else's. It was **fetched and read**;
nothing was pasted, and it is not imported at run time — this app is an offline PWA and cannot
depend on a third-party host loading. Rule 1 of [[Design Inspiration Sources]] required a rebuild
anyway.

## The technique, which is four things

Each one is invisible when it breaks — the turn still plays, it just stops being paper.

| # | The thing | What its absence looks like |
|---|---|---|
| 1 | one element, two faces, both `backface-visibility: hidden`, the back pre-rotated `rotateY(180deg) translateZ(0.01px)` | the next page shows mirrored through the sheet; without the 0.01px the two faces z-fight into a flicker when the sheet lies flat |
| 2 | `transform-origin: left center` on the sheet **and** `preserve-3d` on it AND its parent | the whole rotation flattens into a horizontal squash — the fault he rejected as *"not book logic"* |
| 3 | a fraction of a pixel of Z per sheet, and the moving sheet lifted in `z-index` | no stack thickness, and the turning sheet cuts through the block beneath it |
| 4 | one rotation, `0 → -180`, is the entire page turn | — |

The Framer original has **no drag**; it turns on click. The drag is ours.

## The leaves had to become the chapters, and the data forced it

Counted before writing a line: **of the seventeen sections, seventeen hold four entries or fewer**,
so every one is a single page on a desk and sixteen are a single page on a phone. Keeping pages
scoped to a section — the shape the book already had — would have shipped a drag gesture with
nothing to drag to on every screen but one.

So the book is **one continuous run of pages**, cover → each chapter's opening and its cards →
endpaper. The ribbons became what they look like: a bookmark that jumps to a chapter.

**The desk spread did not change to look at**, because the arithmetic lands it there: the left page
is the back of the sheet you turned, the right page is the front of the one you have not, so
turning sheet *n* shows chapter *n*'s opening beside chapter *n*'s cards. The separate "left half"
element is gone; there was nothing left for it to do.

## FLIP is the one number that differs between the widths

A phone spine is the stage's **left edge**, so a sheet sent to -180 lies a whole page OUTSIDE the
book. Measured at 375x812: it rendered as a cream slab standing over the ribbon column and the
scrim — the same *"background of the book is making it look broke"* fault arriving through a
different element.

`-90` stops it edge-on in the spine, which is the geometry the cover already uses there and the one
he accepted. **And perspective still projects a 24px wedge out of an edge-on plane**, so a turned
sheet on a phone also carries `opacity: 0` from **its own style, never from a keyframe** — Lite Mode
never animates, and an animation that owns visibility is how the wax seal once vanished entirely.

## Why not framer-motion, which he approved and which is installed

The drag is one axis mapped linearly to one rotation. `element.animate()` plus direct style writes
is what the file already does, the audit already pins it, and it costs no bundle on the cheap
Android that Lite Mode exists for.

**Flips if the settle feels stiff to him.** The dependency is in `package.json` at `^13.1.1` and a
spring is the upgrade; nothing imports it yet.

## The rule the drag must keep

**The transform is written straight onto the element, never through React state.** A `pointermove`
that calls `setState` re-renders four sheets and every card on them on each frame of the gesture,
which is how a drag stutters on a cheap phone. State changes **once**, when the sheet has settled —
the same rule the scene player's progress bar already follows.

## What was kept, deliberately

The ribbon column at both widths · two cards to a phone page · opening on the section you are
standing on · the fly-in and fly-back to the chip · Lite Mode and reduced motion skipping the
animation entirely. **The close was not touched** — it is the one part of this he has never
complained about.

## Where it is checked

- `src/ponder/pageModel.js` holds the arithmetic **so the self-check can run it, not read it**.
  Nine assertions in `logicFixes.selfcheck.mjs` walk all seventeen chapters at both widths: every
  chapter opens on its own cards page, the desk spread's left page is that same chapter's opening,
  no two chapters share a sheet, and an unknown section falls back to page one.
- Two audit checks in group 56 pin the four techniques and the no-state drag. **Both were trialled
  against mutations before being trusted** — the first version of the drag check stayed green when
  `setTurned` was injected into `onMove`, because the match window was too small; it is scoped to
  `onMove`'s own body now, with the anchors asserted before the slice.

Found while building: [[A Named Import Can Shadow a Global]].

See also: [[Ponder Tutorial System]] · [[Aldi's Design Taste]] · [[Design Inspiration Sources]] ·
[[Looking at the App]] · [[A Feature Is Not Done Until the Book Knows]]
