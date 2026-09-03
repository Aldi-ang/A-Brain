---
title: The Camera Was Aimed at the Wrong Scroller
description: The Ponder tutorial's existing camera scrolled the stage with block 'nearest' on the first match — vertically perfect, horizontally 0% in view on five of fourteen phone beats. Fixed by centring the union in every scroller between subject and stage.
type: summary
created: 2026-09-03
updated: 2026-09-03
confidence: high
checked: 2026-09-03
tags: [kpm, ponder, scroll, mobile, root-cause]
source: "[[../../Raw/2026-09-03_source_kpm-follow-camera-2026-09-01]]"
---

# The Camera Was Aimed at the Wrong Scroller

**2026-09-01, 18:11 → 18:40 WIB.** KPM commits `7d3d350`, `87b0939`, `832e465`, `96f2474` on
`phase0-solid-ground`. Audit 702 → **705/705**, selfcheck **977/977**.

Ingested 2026-09-03 — this block was the one gap the vault's own self-ingest left on 2026-09-01.
Source: [[../../Raw/2026-09-03_source_kpm-follow-camera-2026-09-01]].

## The decision that came first

Aldi's open question was *phone tutorial, or one tutorial with a camera that follows the highlight*.
The recommendation given was the follow-camera, and the reason was maintenance, not motion: **a
second phone tutorial is a second thing to keep in step with every UI change**, while the
highlight's rect is already measured, so following it costs a few lines. He answered *"do follow
camera then"*. **One tutorial, both widths** — see [[../Concepts/Ponder Tutorial System]].

## The camera already existed, and was aimed wrong twice

1. **`block: 'nearest'` on the FIRST matching element.** `nearest` is satisfied the moment one cell
   of a tall column touches the edge. It is not "bring this into view", it is "stop as soon as
   something is technically not outside".
2. **It moved the stage.** Stock by Warehouse carries its own `overflow-x-auto` around a 1080px
   grid, so sideways movement belongs to *that* div, not to the stage above it.

Measured at 375px before the fix: the ring was **fully in view vertically on every beat, and 0% in
view horizontally on five of them**. A camera can be provably working on one axis and blind on the
other, and the working axis is the one you look at first.

## The fix

Centre the **union** of the subject's rects in **every scroller between the subject and the stage,
innermost first**, recomputing rects per scroller because moving an inner one moves everything
outside it. It stops **at** the stage — walking past would scroll the app underneath the tutorial. A
scroller with nothing to scroll returns immediately, which is why the desk is left untouched.

## Verification — beat by beat, not by eye

- 375px: stock-by-warehouse **14 beats**, regional-warehouse **16 beats**; on every one the ring is
  90%+ visible, or fills 85%+ of the window (that second case is a subject wider than a phone —
  centring its middle is the best the window can do).
- 1440px: the same 14 beats pass and the stage's own `scrollTop`/`scrollLeft` stay at 0, so the
  desktop path is provably unchanged rather than assumed unchanged.

## Two smaller things in the same block

- **The name column got its room back.** *"take more space its okay"* — Stock by Warehouse held
  product names in `minmax(0,1fr)` with `truncate`, so a narrow desk cut the part that tells two
  products apart. Now `minmax(260px,max-content)`, with the table's own side slider paying for it.
  ⚠️ `min-w-0` came off with the truncate; **leaving it in re-enables the squeeze.**
- **The highlight ring stopped being a divider grey.** *"i want the highlight to be clearer to
  see"* — it was `border-line-3`, the grey used for table rules. It has its own `TONE_RING` map now
  and reads orange at 2px. A spotlight shadow was tried first, did not take, and was **deleted
  rather than left in as a dead class**.
- **Two existing guards went red first, and both were right to.** The audit pinned the ring to
  `TONE_EDGE` *by name*; it now pins `TONE_RING` **and** asserts neither map carries a `bg-`, which
  is the rule the first check was only gesturing at. The selfcheck pinned the grid's first track; it
  now pins the widened one. See [[../Concepts/Anti-Recurrence Check]].

## The trap worth carrying

⚠️ **CRLF bit twice in one day.** A needle containing a literal `\n` matches nothing in files
checked out with CRLF endings. It made a selfcheck **pass while testing nothing** in the morning
(recorded in [[../Concepts/A Cache Saying No]]) and made an audit check **fail** the same evening.
Anchor the lift, or write `\s*` instead of `\n`. Second occurrence — now also written into the
`delegate-coding-task` skill's `kpm-inventory-facts.md`.

Related: [[../Concepts/A Smooth Scroll That Never Runs]] · [[../Concepts/Ponder Tutorial System]] ·
[[../Concepts/Aldi's Design Taste]] · [[../Concepts/A Rect Is Painted, Not Laid Out]]
