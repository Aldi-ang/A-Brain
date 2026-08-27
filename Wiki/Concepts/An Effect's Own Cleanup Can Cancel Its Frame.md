---
title: An Effect's Own Cleanup Can Cancel Its Frame
description: A requestAnimationFrame scheduled inside a React effect and cancelled by that effect's own cleanup before it fires — twice in one session it silently disabled a whole feature while every check stayed green.
type: concept
created: 2026-08-27
updated: 2026-08-27
confidence: high
checked: 2026-08-27
tags: [kpm, react, animation, bug, pattern, verification]
aliases: [rAF cleanup race, requestAnimationFrame effect trap, silent feature loss]
---

# An Effect's Own Cleanup Can Cancel Its Frame

**It cost more than any other single thing on 2026-08-27, it happened twice in one session, and
neither time did anything error.**

## The shape

```jsx
useEffect(() => {
  const id = requestAnimationFrame(doTheThing);
  return () => cancelAnimationFrame(id);
}, [deps]);
```

Read on its own that is textbook: schedule work for the next frame, clean up on unmount. What it
does in practice is schedule work that **any re-render before the next frame will cancel**. If a
dependency is unstable, or a sibling state change lands in the same tick, or the mount runs twice,
the frame never arrives — and the cleanup is the thing that killed it.

## What it actually did, twice

**The spotlight.** The tutorial's dimming and highlight were both computed inside a frame scheduled
this way. Result: **not one element was ever dimmed, and no highlight was ever drawn.** The scene
played, the captions changed, the timeline advanced, the controls worked. The whole visual half of
the feature was simply absent, and it took a DOM dump to notice that every element read
`opacity: unset`.

**The book.** Its open animation flipped a `shown` flag inside the same pattern. Result: the spread
mounted at `opacity: 0` and `scale(0.93)` and stayed there. A screenshot came back **entirely
black**. It had worked in the previous screenshot, which is the worst property of this bug: it is a
race, so it passes until it does not.

## Why the checks did not catch it

Every one of the fourteen tutorial checks was green through both failures. They assert that the
right code is present — `el.style.opacity = lit ? …`, the ring markup, the animation class. **All
of that code WAS present. It just never ran.** A grep-the-source check cannot tell "this line
exists" from "this line executes", and that gap is exactly the size of this bug.

The only thing that found it was rendering the component and looking at the pixels — see
[[Looking at the App]]. **A measurement proves a mechanism; only a frame proves an appearance.**

## What to do instead

- **Measuring? Do it synchronously in `useLayoutEffect`.** It already runs after the DOM is written
  and before paint, so rects are valid. There is nothing to wait for.
- **Animating on mount? Use a keyframe.** A CSS animation starts when the element mounts and always
  finishes; it cannot lose a race with a re-render.
- **Needs to reverse? Use a transition** — and drop the animation class in the same commit that
  applies the reversing style, because a keyframe with `fill: both` outranks an inline style. That
  split is what the book does now: **opens on a keyframe, closes on a transition.**
- **Chasing a layout that keeps changing?** A `ResizeObserver` on the container beats guessing when
  an animation has finished. The tutorial's highlight follows the drawer as it opens because of one.

## The general lesson, which is not about rAF

**A feature can be entirely absent while every check is green and nothing throws.** The failure mode
to fear in this codebase is not the exception; it is the silent no-op. Two of the three most
expensive bugs here have had that shape — this one, and the `setScrub` free variable that built
cleanly and blanked the dashboard.

See also: [[Looking at the App]] · [[Ponder Tutorial System]] · [[Anti-Recurrence Check]] ·
[[Aldi's Design Taste]]

## The family has six members now

All five share one shape: **work performed or undone by a mechanism nobody was watching, with
nothing thrown and every check green.**

1. A `requestAnimationFrame` cancelled by its own effect cleanup — the spotlight silently did nothing.
2. The same pattern rendering the book at `opacity: 0`.
3. A `const T = {...}` inside the component putting an unstable object in a dependency array,
   replaying the whole book on every render.
4. [[A CSS Animation Outranks Your Inline Style]] — a keyframe's `transform: none` erasing the inline
   `transform` that positioned every caption. Found 2026-08-27 from a photograph Aldi took.
5. [[A Rect Is Painted, Not Laid Out]] — a rect measured through the modal's own `scale(0.94)` open
   animation, so the first beat of every scene measured 6% small and healed itself four seconds later.

6. **The same keyframe trap again, one file over, the same day.** The book chip's hover sparks
   needed `translateZ` to sit in front of a cover that leans toward the viewer — `preserve-3d` sorts
   children by DEPTH, not document order, so three of four sparks painted behind it and simply never
   appeared. Put the `translateZ` on the element and the spark's own animation erases it on frame
   one; it has to go in BOTH transform stops of the keyframe. Member 4 taught the law, and member 6
   is the same law being needed again within hours — which is the argument for writing it down.

**The generalisation, and it is worth more than any of the five:** none of these are visible in the
source, in `git diff`, or in a screenshot. Each was found by asking the running browser a question —
`getComputedStyle()` against the inline style, `rect.width` against `offsetWidth`. When a visual
change is claimed fixed, **measure the DOM**; see [[Looking at the App]].
