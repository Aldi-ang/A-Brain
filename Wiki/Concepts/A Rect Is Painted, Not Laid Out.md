---
title: A Rect Is Painted, Not Laid Out
description: getBoundingClientRect() reports what is on screen, so measuring through an ancestor's scale animation returns geometry that is wrong by exactly that scale — the Ponder highlight came back 6% small and stayed small, healing itself four seconds later.
type: concept
created: 2026-08-27
updated: 2026-08-27
confidence: high
checked: 2026-08-27
tags: [kpm, css, animation, measurement, bug, pattern, verification]
aliases: [getBoundingClientRect scale, measuring through a transform, painted vs layout geometry]
---

# A Rect Is Painted, Not Laid Out

**Found while verifying the fix for
[[A CSS Animation Outranks Your Inline Style]] — which is the point: the fifth bug of the family was
only visible because someone measured the DOM instead of reading the diff.**

## The shape

```jsx
// the modal opens on:  ponderOpen { 0% { transform: translateY(10px) scale(0.94) } 100% { none } }
const base = wrap.getBoundingClientRect();
const rs   = hits.map(el => el.getBoundingClientRect());
const x = Math.min(...rs.map(r => r.left)) - base.left;      // 6% too small, forever
```

`getBoundingClientRect()` returns the **painted** box — every ancestor transform already applied.
The tutorial overlay arrives on a `scale(0.94)` animation, so the first beat measured after it opens
comes back 6% small. The measurement is then stored and nothing re-measures, because the *layout*
never changed — the `ResizeObserver` watching the scroller sees no size change at all, since the
scale is visual.

Result on Goods Received: the highlight ring sat **60px short of the third field**, outlining two
and a bit costs under a caption that said three.

## Why it survived every check and every screenshot

Autoplay moves to the next beat after ~4 seconds, which re-measures at scale 1 and **silently
corrects it**. So the bug is only on screen for the first beat of a scene, and only until the scene
moves on. It had been shipped, screenshotted and reviewed repeatedly without anyone catching it.

The tell:

```js
ringEl.getBoundingClientRect().width / wrap.offsetWidth   // 0.94, and 0.94 is in the keyframes
```

## The law

**`offsetWidth` is what the layout says; `rect.width` is what the screen shows; their ratio is
whatever transform is in play.** If you measure rects inside anything that can be transformed, divide
that ratio back out:

```js
const kx = wrap.offsetWidth  > 0 && base.width  > 0 ? base.width  / wrap.offsetWidth  : 1;
const ky = wrap.offsetHeight > 0 && base.height > 0 ? base.height / wrap.offsetHeight : 1;
const x = (r.left - base.left) / kx;
```

This fixes the **cause** and not one animation's end event: it is correct at any point during any
transform, present or future, so there is no listener to remember to add next time. It also keeps
the measurement in the same untransformed space that `clientWidth` / `clientHeight` already speak,
which is the space the rest of the placement maths uses — mixing the two was the deeper error.

**Do not "fix" this by re-measuring on `animationend`.** That patches the one animation you know
about and leaves every other transform still lying to you.

## The wider lesson, and it is the expensive one

Both this bug and the one before it were invisible to source review, to `git diff`, and to
screenshots — and one of them was invisible to a screenshot *specifically* because headless virtual
time does not drive animation clocks honestly, so the frames showed rings mid-transition and read as
a bug that was not there.

**Verify visual work by measuring the DOM in a real browser.** For a Ponder scene the sweep that
actually proves it: for every beat, assert the caption rect does not intersect the ring rect, the
ring sits exactly `PAD` outside the union of the lit fields, and `scrollHeight === clientHeight`.
That sweep found both bugs in minutes after weeks of green checks. See [[Looking at the App]].

## Family

Fifth of the family named in [[An Effect's Own Cleanup Can Cancel Its Frame]]: **work performed or
undone by a mechanism nobody was watching, nothing thrown, every check green.** Now an
[[Anti-Recurrence Check|audit check]] in group 56, mutation-tested to confirm it fails when the bug
returns.

## Where it happened

`src/ponder/PonderOverlay.jsx`, fixed 2026-08-27 in `8109559`. See [[Ponder Tutorial System]].

See also: [[Silent Failure Disease]] · [[Ponytail Philosophy]]
