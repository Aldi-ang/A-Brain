---
title: A Smooth Scroll That Never Runs
description: Six Ponder beats put their caption on top of the row they explained. It looked like a placement bug for a whole session and it was scrollIntoView with behavior 'smooth' moving nothing at all.
type: concept
created: 2026-08-31
updated: 2026-09-03
confidence: high
checked: 2026-09-03
tags: [ponder, layout, mobile, scroll, root-cause]
---

# A Smooth Scroll That Never Runs

*Renamed 2026-08-31 from "The Caption Clamp Guards One Branch Out of Two" — that title named the
first hypothesis, and the hypothesis was wrong. Kept as one page so the wrong turn stays visible.*

## What it looked like

Rendered at 375px through `tools/ponder-lab.jsx`: the tutorial's `at: 'near'` captions sat on top of
the row they were explaining, or fell below the visible edge of the stage. Desktop was clean at
every width tried. Six beats across two scenes, out of 36 `near` beats in four.

| Scene · beat | Frame at 375px, before |
|---|---|
| product-performance 5, 6 | caption covers the column header and the warning banner |
| product-performance 8, 9 | caption below the visible edge, unreadable or invisible |
| product-performance 11 | covers the exact banner it is describing |
| stock-by-warehouse 7 | covers the first warehouse row it points at |

## The wrong diagnosis, and why it was believable

`PonderOverlay.jsx` computes a `near` placement. Its beside-branch runs its `top` through `clampY`;
its above/below branch returns `top` raw. **That asymmetry is real, it is visible in the source, and
it is not the bug.** A whole handoff brief was written around it.

It survived because it explains the symptom perfectly. A caption landing outside the stage is
exactly what a missing clamp produces. Nothing about reading the code could separate the two.

## What it actually was

Measured in the running lab, on the same element in the same frame:

| call | scrollTop before | after |
|---|---|---|
| `scrollIntoView({block:'nearest', behavior:'smooth'})` | 0 | **0** (still 0 after 800ms) |
| `scrollIntoView({block:'nearest', behavior:'auto'})` | 0 | **211** |

**The smooth scroll moved nothing.** The stage is 219px tall on a phone against 450px of content, so
a subject that never scrolls sits at y=353 — below the floor. `spot` is then measured off-stage, and
every consumer inherits it: the highlight ring is drawn under the stage, the room test in `near` is
handed impossible numbers, and the caption is placed against a position nobody can see.

Desktop never showed it because the stage is sized so it does not scroll there at all
(`scrollHeight === clientHeight` at 1440), which makes `scrollIntoView` a no-op either way.

There is a second reason `auto` is the only correct choice here: `measure()` runs **synchronously**
three lines after the call. An animated scroll is measured before it has moved. The scroller's own
scroll listener was the safety net for that — and a smooth scroll that never starts never fires it.

## The second half — a phone has no "beside"

With the scroll fixed, four beats still covered their subject. `boxW` is `min(380, W - 24)`, which on
a 375px screen is **349 of 373 — 94% of the stage**. There is no free column to stand a box that wide
in, and no honest above or below on a 219px stage either, so every placement it can choose lands on
the subject. Clamping cannot help; there is nowhere to clamp it to.

Those beats now return `null` and fall through to the wide bottom bar, which is the layout the other
beats in the same scenes already used on a phone. **The bar is the phone layout, not a downgrade.**

## Verification

78 beat renders walked across all four scenes at 375px: zero captions outside the stage, zero
overlapping their own highlight. Desktop unchanged and provably so — neither changed line can fire
there. Two audit checks added (669 total), both mutation-tested red before green. Commits `aef7f03`
(fix) and `8f3f438` (checks).

Three pre-existing caption/ring overlaps remain in Stock by Warehouse **on desktop**, on tall
full-width subjects. Unrelated to this change, untouched, and not yet diagnosed.

## The lesson worth keeping

**An asymmetry in the code is not evidence that the asymmetry is the bug.** The missing clamp was
real, sat one branch away from the fault, and explained every symptom. What separated them was
asking the browser a question neither hypothesis could answer from source: *does this scroll at all?*

## The sequel — the same call, a second way to be wrong (2026-09-01)

The `behavior` argument was not the only thing wrong with this call. On 2026-09-01 the same camera
was found to be aimed wrong on the other axis: `block: 'nearest'` is satisfied the moment **one cell
of a tall column touches the edge**, and it was moving the **stage** when Stock by Warehouse's own
`overflow-x-auto` div owned sideways movement. Vertically perfect, **0% horizontally in view on five
of fourteen phone beats**. Fixed by centring the union in every scroller between subject and stage.
Full write-up: [[../Summaries/The Camera Was Aimed at the Wrong Scroller]].

**Two lessons stack here.** This page's is *does it scroll at all*. The sequel's is *which element
scrolled, and on which axis* — a camera can be provably working on one axis and blind on the other,
and the working axis is the one you check first.

Related: [[An Inherited Explanation Is a Hypothesis]] · [[Ponder Tutorial System]] ·
[[../Summaries/The Camera Was Aimed at the Wrong Scroller]] ·
[[A Rect Is Painted, Not Laid Out]] · [[Looking at the App]] · [[A CSS Animation Outranks Your Inline Style]]
