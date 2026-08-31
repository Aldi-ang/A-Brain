---
title: The Shell Repaints Any White It Can Reach
description: The surat jalan printed see-through because a rule in the app shell repaints every plain .bg-white inside it. Also the two harness traps that made the report unreproducible for a whole session.
type: concept
created: 2026-08-31
updated: 2026-08-31
confidence: high
checked: 2026-08-31
tags: [css, receipts, harness, debugging, restock]
---

# The Shell Repaints Any White It Can Reach

Aldi, 2026-08-31, with a screenshot:

> *"we need to redesign the receipt for this because it looks awful and i dont know why is it
> transparant look at the SC"*

## The rule

`src/components/BiohazardTheme.jsx` renders a `<style>` block, and its **first line sits outside
`@media print`**:

```css
.biohazard-content .bg-white { background-color: rgba(20, 20, 20, 0.85) !important;
  border: 1px solid rgba(255,255,255,0.15) !important; color: #e5e5e5 !important; }
```

Every screen in the app renders as `{children}` inside `<div className="biohazard-content">`. The
surat jalan modal is `position: fixed`, which takes it out of layout **but not out of the DOM
tree**, so a descendant selector still reaches it. Its card was a plain `.bg-white`.

So the shell painted his paper `rgba(20,20,20,.85)` — dark, and **fifteen per cent see-through** —
with `#e5e5e5` ink. The page behind read straight through the receipt. Measured live: the card
computed to `rgba(20, 20, 20, 0.85)` before the fix and `rgb(255, 255, 255)` after.

**The sales nota escaped this for years by accident.** Its classes are written `!bg-white`, and the
leading `!` changes the *class name*, so `.bg-white` never matched it. Luck, not design — the same
luck recorded in [[Aldi's Design Taste#NEAR MISS: an automated palette migration almost repainted the nota (2026-08-16)|the palette-migration near miss]], where `!`-prefixed classes also survived a
sweep by accident.

The fix scopes the rule instead of patching the card:

```css
.biohazard-content .bg-white:not(.print-receipt):not(.print-receipt *) { … }
```

One selector, every receipt, present and future. The nota is a printed commercial document and is
exempt from app-UI styling by his fourth law; a rule that darkens app surfaces has no business
reaching into it.

## The second cause of the same appearance

`animate-fade-in` is opacity-only. For half a second the paper is semi-transparent and the page
reads through it — **in a screenshot, identical to the bug above**. It is also a straight violation
of the locked corollary that [[Aldi's Design Taste|an animation must never own an element's
visibility]]. Removed from the card. A document you are about to print gains nothing from an
entrance.

Two causes, one appearance, one report. That is why the diagnosis went sideways twice.

## ⚠️ The two harness traps, which cost more than the bug

**A harness without the ancestor tests a different page.** Mounted alone in the Ponder lab, the
receipt rendered perfectly white — because `.biohazard-content` was not above it and the shell's
`<style>` was not on the page. The lab now carries the class *and* a verbatim copy of the rule, with
a selfcheck pinning the copy against the source so it cannot drift in silence.

**The preview pane freezes its own clock.** `document.hidden` reads `true`, `requestAnimationFrame`
never fires, and a CSS fade sits at `currentTime: 0` forever — so the element paints at its 0%
keyframe and a screenshot of it looks exactly like a real transparency bug. This produced a
confident wrong diagnosis (`opacity: 0`, "the animation is stuck") before a computed read with the
pane visible showed `opacity: 1`.

**The rule that comes out of both:** for anything an animation touches, a frame is not evidence.
Read a computed value. `?nota&probe` in the lab now prints the receipt's computed background for
exactly this reason — a number cannot be caught mid-flight.

## What changed in the look

Recorded in [[Aldi's Design Taste]] under the same date. Short version: KPM leads the header instead
of the supplier's factory name; monospace is now only for codes, quantities and money instead of the
whole document; the two grey label panels became one four-field row; the totals block stopped
breaking "TOTAL LANDED VALUE" and its own figure across lines; figures are tabular; the signature
block stopped spending a screenful on whitespace.

Shipped in `c4935ea`, pinned by checks D14 in `src/config/logicFixes.selfcheck.mjs`.

Related: [[A Meter That Exits Silently Is Not a Meter]] · [[Gudang Pusat (Master Vault)]]
