---
title: The Caption Clamp Guards One Branch Out of Two
description: On a phone, Ponder captions sit on top of the row they explain or fall off the bottom edge — 36 beats are exposed, and the suspect is one unclamped line.
type: concept
created: 2026-08-31
updated: 2026-08-31
confidence: medium
checked: 2026-08-31
tags: [ponder, layout, mobile, open-question]
---

# The Caption Clamp Guards One Branch Out of Two

## The problem

Rendered on 2026-08-31 through `tools/ponder-lab.jsx` at 375px, the Ponder tutorial's `at: 'near'`
captions land on top of the thing they are explaining, or below the visible edge of the sheet.
Desktop is clean at every width tried, including 1440 — **this only appears on a phone**, which is
the device Aldi carries.

| Scene · beat | Frame at 375px |
|---|---|
| product-performance 5 · Revenue | covers the column header and half the warning banner |
| product-performance 6 · Share | covers the header; the Share column is off-screen entirely |
| product-performance 8 · Cello Kopi | caption ~90% below the visible edge, unreadable |
| product-performance 9 · Total | caption fully off-screen, nothing visible |
| product-performance 11 · missing months | covers the exact banner it is describing |
| stock-by-warehouse 7 · Sold (7d) | covers the first warehouse row it points at |

**36 `near` beats across four scenes** are candidates: `stock-by-warehouse` 18, `goods-received`
10, `product-performance` 5, `shipment-plan` 3.

## The suspect

`src/ponder/PonderOverlay.jsx:328`, inside the `near` `useMemo`:

```js
top: below ? spot.y + spot.h + PAD + GAP : spot.y - PAD - GAP - boxH,
```

That `top` is returned raw. The beside-branch eight lines above it computes
`const top = clampY(cy - boxH / 2)` — same helper, same memo, clamped. The comment at line 287
states the box "gets clamped inside the stage", which is true of one branch and false of the other.

## The trap in the obvious fix

The stage (`wrapRef`) carries `overflow-auto`, and line 219 calls `scrollIntoView` on the target.
So `spot.y` may be in **scrolled content coordinates** while `H = wrap.clientHeight` is the
**visible** height. A plain `clampY(top)` would then clamp into content space and move the caption
somewhere else wrong rather than into view. `wrap.scrollTop` and `wrap.scrollHeight` have to be
read in the running lab before any edit. This is the same shape as
[[An Inherited Explanation Is a Hypothesis]]: the one-line fix is a hypothesis until measured.

## Options put to Aldi — DECISION OPEN

| | Option | Cost | What it leaves |
|---|---|---|---|
| A | Clamp in `PonderOverlay.jsx` | one line, then re-shoot every scene at both sizes because desktop captions move too | nothing broken |
| B | Five beats `near` → `bottom` in `product-performance.js` | ten minutes, zero risk to other scenes | Stock by Warehouse's 18 beats still broken on the phone |

Recommended **A**: B leaves a known-broken tutorial on the device he uses, and the same unclamped
line is the likely cause of the caption bug he photographed in Goods Received
([[A CSS Animation Outranks Your Inline Style]] fixed a different half of that same beat).

**REJECTED ON PURPOSE:** rewriting the placement engine, adding a second layout mode for phones,
and moving every `near` beat in the app to `bottom` wholesale. `near` is the behaviour Aldi asked
for — *"the caption moves to what it is talking about"* — and a caption that never moves stops
being read. The bug is that one branch forgot to clamp, not that `near` is wrong.

## Also found, and it is the more general lesson

The handoff brief claimed beats 5 and 6 "both use `at: 'bottom'` now". They are still `at: 'near'`.
The command that would have applied it was interrupted, and the brief recorded the **intention** as
the **state**. Nothing was lying — the writer believed it. **A handoff must quote the file it is
describing, not the plan it was following.**

Related: [[Ponder Tutorial System]] · [[A Rect Is Painted, Not Laid Out]] · [[Looking at the App]]
