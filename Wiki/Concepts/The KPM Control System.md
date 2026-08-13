---
title: The KPM Control System
description: The reusable button/panel/record vocabulary in theme.css, the material-over-colour rule behind it, and the Lite-Mode contract every control must keep.
type: concept
created: 2026-08-13
updated: 2026-08-13
confidence: high
checked: 2026-08-13
tags: [pattern, design, components, kpm, settings]
---

# The KPM Control System

Built 2026-08-13 (commit `7166366`, audit group 30) because Aldi asked for a vocabulary, not
a screen: *"i want better presentation of all of this button and features to be more presentable,
since i will redesign the whole setting as well, make sure that the logic and theme and button
design and animation that we made here could be use for button in another place so design it
well"*. The Architect Terminal is its first customer. See [[Aldi's Design Taste]].

## The one idea: authority is graded by MATERIAL, not colour

| Material | Means | Class |
|---|---|---|
| hairline + mono | routine, reversible | `.kpm-btn`, `.kpm-rail` |
| gold plate | this module's primary act | `.kpm-btn.key`, `.kpm-rail.gold`, `.kpm-read.on` |
| diagonal stripe | irreversible, no undo | `.kpm-btn.hazard`, `.kpm-rail.hazard`, `.kpm-band.hazard` |

Colour alone failed twice on the screen this replaced: **Lite Mode strips it**, and it could not
tell a joke apart from an ownership transfer — the Disco Protocol button wore a filled red plate at
full width while Crown Transfer, which permanently hands over the product, wore a quiet outline.

## The vocabulary

`.kpm-band` (group caption — says what the group may DO) · `.kpm-mod` (one instrument; stacked ones
share an edge, a rack rather than floating cards) · `.kpm-rail` (name left, live state right) ·
`.kpm-read` (a printed state, so a module answers before it is opened) · `.kpm-btn`
(`.key` / `.hazard` / `.block`) · `.kpm-field` (label printed above, never a placeholder) ·
`.kpm-switch` (both positions visible) · `.kpm-rec` (identity above, actions below — three word
buttons do not fit side by side at 375px).

## The contract, checked by audit group 30

1. **No shadow, no blur, no filter, anywhere in the system.** `index.css` strips all four under
   `html.lite-mode`. The old tab put every separation into shadows, so on a cheap Android it
   collapsed into one undifferentiated column. Borders, background-color and gradients only.
2. **Every hover gated behind `@media (hover: hover) and (pointer: fine)`** — touch fires `:hover`
   on tap and keeps it, leaving a button stuck lit.
3. **44px minimum on every control**, buttons and inputs alike.
4. **One writer per setting.** A two-position switch with two copies of the write is how a setting
   saves locally and never reaches the database — see [[Silent Failure Disease]].

## Two traps found while building it

- **A checkable claim beats a paragraph, but a check can fail on its own comment.** Four checks in
  `integration.audit.mjs` went red because their explanatory comments *quoted* the old code they
  replaced (`hidden md:flex`, `<h2>`, "no box-shadow"). The file now has `code(src)`, which strips
  block comments before any structural test. Slicing a block by its header text lands *inside* that
  comment — strip first, then slice.
- **A count that drops is not automatically a regression.** Group 25 counts icon-only delete
  buttons; it went 18 → 17 because the tenant delete button now carries the word "Delete", and the
  rule says a worded button must not be marked or the label prints twice.

Related: [[Off-Token Colour Migration Map]], [[Aldi's Design Taste]], [[Silent Failure Disease]]
