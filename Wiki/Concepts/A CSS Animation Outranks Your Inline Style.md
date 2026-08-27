---
title: A CSS Animation Outranks Your Inline Style
description: An animation's final keyframe wins over a style attribute, so any geometry parked in `transform` is erased the moment the animation finishes — it broke every 'above' caption in the Ponder tutorial while all 657 checks stayed green.
type: concept
created: 2026-08-27
updated: 2026-08-27
confidence: high
checked: 2026-08-27
tags: [kpm, css, animation, bug, pattern, verification]
aliases: [animation fill-mode both, transform clobbered by keyframe, inline transform erased]
---

# A CSS Animation Outranks Your Inline Style

**Aldi photographed it before any check did: *"the textbox block the view for the 3 biaya"*. The
caption in the Ponder tutorial sat on top of the very field it was explaining, in every scene, and
nothing anywhere had thrown an error.**

## The shape

```jsx
// the element carries an arrival animation whose last keyframe is `transform: none`
<div className="animate-ponder-in" style={{ top: y, transform: 'translateY(-100%)' }}>
```

```js
ponderIn: { '0%': { transform: 'translateY(6px) scale(0.985)' },
            '100%': { transform: 'none' } }        // + fill-mode: both
```

Read on its own, each half is correct. Together, the inline `transform` survives exactly as long as
the animation takes to finish. **The CSS cascade puts the animation origin above the author origin,
and a `style` attribute is author origin** — so while `animate-ponder-in` is running and, because
its fill-mode is `both`, for as long as it stays applied afterwards, `transform: none` wins.

The `translateY(-100%)` was doing real work: it turned the `top` coordinate into the box's *bottom*
edge, which is what "put the caption above the thing" means. Lose it and the box hangs *downward*
from a number meant for its bottom — landing squarely on its subject. Same for the `translateY(-50%)`
that centred a sideways caption.

## Why it survived every check and every screenshot

- Nothing threw. The captions kept playing, the text was right, the highlight was right.
- The diff reads correctly. Both lines are individually sensible; only their interaction is wrong.
- It is invisible to source review and to `git diff`. You have to ask the *browser*.

The tell, once suspected, took one line:

```js
box.style.transform                      // "translateY(-50%)"
getComputedStyle(box).transform          // "matrix(1, 0, 0, 1, 0, 0)"   <- the identity
```

**When the inline style and the computed style disagree, something outranks you.** That is the whole
diagnostic.

## The law

**Geometry that must survive an animation goes in `left` / `top`, never in `transform`.** Leave
`transform` entirely to the animation. If a box's position depends on its own size, measure the size
and put the answer in `top` — do not let a percentage translate stand in for a measurement you have
not taken.

The corollary is that a component owning an animation should not also own a transform, and a
component that must have both needs two elements: an outer one that positions, an inner one that
animates.

## Family

This is the **fourth** of a family this codebase keeps producing — see
[[An Effect's Own Cleanup Can Cancel Its Frame]] for the first three. Every member is the same
shape: **work performed or undone by a mechanism nobody was watching, with nothing thrown and every
check green.** The **fifth**, found while verifying the fix for this one, is
[[A Rect Is Painted, Not Laid Out]].

Both new members are now [[Anti-Recurrence Check|checks]] in group 56 of
`src/config/integration.audit.mjs`, and both were mutation-tested — the fix was re-broken four
different ways to confirm the check goes red each time. A check nobody has watched fail is a
decoration.

## Where it happened

`src/ponder/PonderOverlay.jsx`, fixed 2026-08-27 in `8109559` along with the other three Goods
Received faults. See [[Ponder Tutorial System]] and [[Looking at the App]].

See also: [[Silent Failure Disease]] · [[Aldi's Design Taste]]
