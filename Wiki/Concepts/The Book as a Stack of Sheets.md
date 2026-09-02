---
title: The Book as a Stack of Sheets
description: The tutorial book rebuilt on the Framer interactive-book technique — what makes a page a sheet, why the leaves became the chapters, the commit-on-gesture rule that stopped a fast swipe snapping, why a tap on the close button armed a page drag, and the Z trap that folded the cover behind its own pages.
type: concept
created: 2026-09-01
updated: 2026-09-02
confidence: high
checked: 2026-09-02
tags: [design, ponder, animation, 3d, aldi, framer]
---

# The Book as a Stack of Sheets

Aldi, 2026-09-01, after three failed passes at the phone close:

> *"the only way to do this is the follow this one
> https://framer.com/m/InteractiveBook-xGXc.js@uLOYl8huI2w4XDdONaRK and i want u to change the pc
> version with this one also, i want this 3D style and also i want the page to be drag able to
> change the page left and right with smooth motion"*

Built as `9a9cb62`, then `c0ce49f` (fast swipe, riffle) and `bedf40b` (closeable, and the close as a real fold) — all three recorded further down this page. **He has not judged the latest pass yet** — a still frame cannot
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
which is how a drag stutters on a cheap phone. State changes **once** per gesture — the same rule
the scene player's progress bar already follows.

⚠️ **Superseded in one detail on 2026-09-02:** that single state change happens when the gesture
DECIDES, not when its animation ends. See *He watched it, and named two faults* at the bottom —
committing at the end of the animation is what made a fast swipe snap.

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

---

## He watched it, and named two faults (2026-09-02)

Both fixed the same day, commit `c0ce49f` in kpm-inventory. His words:

> *"when i slide it too quickly, animation broke and the book snapped itself into next page
> instead"*
>
> *"i want to put full realism of this book, for example if i change the ribbon section by 4 ribbons
> far then the book will turn 4 times to reach that page so instead of page 1 to page 5 in one swipe
> i want the animation to be 4 quick page swipe, this way it will make it realistic"*

### The snap was one cause with three faces

The first version committed the position **only** from `anim.onfinish`. So for the whole 520ms of a
settle, the book still believed it stood on the old sheet — and three separate symptoms fell out of
that single fact:

| What you saw | Why |
|---|---|
| the second swipe did nothing | it grabbed the sheet that was already flying away |
| the page ignored the finger | a WAAPI animation under `fill: 'both'` **outranks an inline style**, so the drag's writes had no effect for the rest of that arc |
| the book jumped on its own | the first animation finished and applied ITS target — this is the snap |

**The rule worth keeping: commit state when the GESTURE decides, and let the animation be
decoration.** React re-renders the sheet at the same transform the animation is already holding, so
nothing moves on screen, and the next gesture reads the new position immediately. A `posRef` carries
it synchronously, because two flicks can land inside one React batch.

Two more, from the same family:
- a drag **cancels whatever animation owns that sheet** before touching it;
- a finished animation **only cleans up if it still owns the sheet** — a faster gesture may have
  taken it over, and cancelling that one drops the page mid-turn.

### A flick is a speed, not a distance

A decisive swipe covering a fifth of the page snapped back under a distance-only threshold. Release
speed now decides it too — `0.45 px/ms`, about a page's width in half a second. And only the arc
that is **left** gets played, so a page released at 90% finishes in a blink rather than restarting a
full-length turn from where it already is.

### The riffle

`riffle(from, to)` in `pageModel.js` plans the run and the self-check runs it on the real seventeen
chapters. Four apart is four turns at 225ms; every distance up to eight is turned page for page.
Past eight the book opens most of the way at once and riffles the last eight — chapter one to
chapter seventeen is sixteen sheets, and that is a thumb on a bookmark, not a teleport.

⚠️ **One step per RENDER, driven by an effect, never a loop.** A loop starts all four turns in the
same tick and they land as one, which is exactly the teleport being removed.

### The harness trap this pass paid for

**The Browser pane's animation clock only advances when it PAINTS.** Between tool calls an animation
sits at `currentTime: 0` in state `running` forever, so a perfectly working turn reads as frozen.
Pump frames with repeated screenshots. This cost a round of misdiagnosis before it was noticed, and
it is the same shape as the note already in [[The Shell Repaints Any White It Can Reach]]: the
harness, not the code, was the thing that was wrong.

---

## The close, done as a fold — and why he could not close it at all (2026-09-02)

Commit `bedf40b`. Two asks in one afternoon: *"make sure that i can close the book right now i
cant"*, and then *"make sure book close the right way, imagine its 3D use all the design skill to
do this"*.

### The reason he could not close it, and why looking would never have found it

A tap on the close button that drifts **twelve pixels** — which is every tap a finger ever makes —
cleared the ten-pixel drag threshold. The stage called `setPointerCapture`, the pointer stopped
belonging to the button, and **on a touch device that suppresses the click outright**. So the X did
nothing, the tap turned the page instead, and on a phone the book had no other reliable way out.

⚠️ **The button was a correct 44×44 the whole time and the finger was on it.** Nothing about the
geometry, the z-order or the styling was wrong. This is the shape of bug that a screenshot can
never show, and the only reason it was found is that the failing gesture was replayed as real
pointer events and `setPointerCapture` was instrumented to report when it fired.

**The rule:** a gesture must decide by **what was touched**, not by how far it moved. A press that
lands on a control never arms a drag, whatever it does afterwards. Two supports underneath it: a
drag needs real intent (14px **and** more sideways than up-and-down), and the scrim closes on
`pointerdown` — which a phone gets for certain — not only on the `mousedown` it merely synthesizes.

### Closing a book is one motion, not a fade

The close before this faded every sheet to `opacity: 0` while a cover swung across on its own. The
pages evaporated and a cover arrived from nowhere, and **nothing in the real world disappears and
reappears** (Emil Kowalski's rule, and it is the whole diagnosis here).

Closing a book open at page N is one motion: the **entire right-hand block** — every sheet you have
not turned yet, plus the cover beneath them — folds about the spine onto the left half. The sheets
already lying on the left never move, because on a desk they do not. No opacity anywhere in it.

The one liberty is a **14ms stagger from the outside in**, so the cover leads and the page you were
reading settles last. That is what makes it read as paper falling rather than as a board swinging.

### 🔴 The Z trap, which cost a render to find

**A parent's `translateZ` is applied AFTER the child's rotation, so the rotation never negates it.**

- Cover depth on the **wrapper** at `-24`: the child rotates, then the parent offsets → the cover
  folds over and ends up at −24, *behind its own pages*. The frame showed a page lying face-up
  where the leather should be.
- Cover depth on the **rotating element** as `translateZ(24px) rotateY(...)`: it rotates first and
  offsets second → +24, which is in front of a sheet stack spanning about 7. In front while it
  swings open, in front again once it has folded shut, which is where the outside of a book goes.

`SHUT` and `OPEN` stay rotation-only because the **sheets** use them too; a sheet that borrowed the
cover's offset would fold up in front of the cover.

### The riffle lost its cap, and everything got faster

*"yes, full realism needed"* closed the cap question: every page between here and there is turned,
at any distance. Chapter one to chapter seventeen is sixteen real turns. The run stays under a
second by getting **faster** rather than by skipping.

| | before | after |
|---|---|---|
| a single deliberate turn | 520ms | **340ms** |
| the riffle's whole budget | 900ms | **700ms** |
| the close | 980ms | **820ms** |

An exit should be faster than an entrance: the arrival is the book being carried to you and may
take its time, the departure is the system answering and must not keep you waiting.

### The bug only running it could find

`play()` floored every step at a **literal 90ms**, silently overriding the 60 the riffle had
planned. The longest run took 1260ms while every check in the file read 840 and passed — the
arithmetic said one thing and the screen did another, and the checks agreed with the arithmetic
because that is the number they read. One constant now (`RIFFLE_MIN_MS`), used on both sides, plus
a check that no planned step is below the floor the book will actually use.

**The general shape:** a second literal for a value that already has a name is not a duplicate, it
is a silent override — and it will beat the named one wherever it happens to sit later in the
pipeline. Same family as [[A Check Points at a File, Not at a Behaviour]].

### Two harness notes, both paid for

- **Never call `requestAnimationFrame` in a Browser-pane probe.** The pane does not paint between
  tool calls, so rAF never fires and the call times out at 45 seconds.
- **To inspect a motion, freeze it rather than race it.** Start it, `setTimeout(30)`, then
  `document.getAnimations().forEach(a => { a.pause(); a.currentTime = N })` and screenshot. That is
  what produced the frame proving the cover folds in front of its pages.
