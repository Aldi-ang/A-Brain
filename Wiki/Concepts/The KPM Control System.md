---
title: The KPM Control System
description: The reusable button/panel/record vocabulary in theme.css, the material-over-colour rule behind it, and the Lite-Mode contract every control must keep.
type: concept
created: 2026-08-13
updated: 2026-08-14
confidence: high
checked: 2026-08-14
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
5. **A class that pins its own background must pin its own ink.** Added 2026-08-14 after a live
   bug, below. A token like `var(--ink)` is a promise about *the theme's* ground; the moment a
   class paints its own ground, that promise is void and the token becomes a coin flip between
   the two themes.

## The app shell: two layouts in one file — name the WIDTH before saying a screen is done

`src/components/BiohazardTheme.jsx` renders the navigation for the **phone and the desk from one
element**, split by Tailwind's `lg:` prefix. So "was this screen redesigned?" has three possible
answers, and the useful one is almost never yes or no.

**It has already cost a round.** On 2026-08-14 Aldi said *"i thought i have already redesign these
sidebar"* while looking at his PC. He was right: seven commits on 9–10 August rebuilt it —
`1984ad4` two columns and the grip that follows his thumb, `39dfd72` the scrub that lights every
mark, `5cc7d0f` fits without scrolling, `9d4a367` opens from the edge, `a528633` the three-second
hold, `6f706cb` the music pill, `6a3aa1b` the flash-before-styles fix. **Every one of them was the
PHONE.** The desk half still carried `lg:bg-white` + a white glow for the active tab and
`lg:text-gray-500` for the rest.

**The rule: answer with the width.** *"It was redesigned, at the other width"* is true far more
often than either single-word answer, and both single-word answers are wrong in a way he can see
on his own monitor. Applies to any `lg:`-prefixed component in this repo.

**Shell state as of 2026-08-14** (commits `371a165`, `20193bd`): the panel does not render at all
while signed out; the phone keeps its 176px two-column rail opened by the right-edge ribbon; the
**desk is an 88px strip of marks, always visible, never opened or closed** — his ask, *"so it
doesnt take so much space"*, against a Framer *Totem Side Bar* reference measuring ~70–98px wide
with 44px rows. Both widths share `.kpm-rail-mark` now. Words that do not fit an 88px column live
on the `title` tooltip (desk) and the peek plate (phone). The desk header's 76px left inset — which
cleared a menu button deleted weeks earlier — is gone; it was the *"spaces useless"* he pointed at.

## The invisible panel: a token on a ground the theme does not own (2026-08-14)

`.kpm-mod.gate` is the shell shared by the two locked screens — the Master Vault gate and the
Google sign-in door. It pins its own background, `rgba(4,3,2,.9)`, because both screens are
near-black **in both themes**. Its title, description and button, though, were plain
`.kpm-mod` parts still taking colour from `var(--ink)` / `var(--accent-ink)`.

In light mode `--ink` is **`#131211`** — near-black. Near-black ink on a near-black card is
**≈1.05:1**. So anyone who last left the app in light mode and then signed out was looking at a
card with **no readable text on it at all**: no title, no explanation, no visible button label.
It shipped, passed 357 audit checks, and was found the same night only because he asked for that
panel's colours to match the gate's — the fix for his ask *is* the fix for the bug.

**Why no check caught it:** every contrast check compared a token against the token ground it was
designed for. Nothing compared a token against a **literal** background declared in the same rule.
That is the shape to look for — `background:` a hex, `color:` a var, in one class.

Fixed by giving the class the gate card's literal hexes (`#f7e9c8` cream, `#8a7048` dim gold),
which is also what makes the two locked screens genuinely one screen. Group 15 now asserts it.

## Two traps found while building it

- **A checkable claim beats a paragraph, but a check can fail on its own comment.** Four checks in
  `integration.audit.mjs` went red because their explanatory comments *quoted* the old code they
  replaced (`hidden md:flex`, `<h2>`, "no box-shadow"). The file now has `code(src)`, which strips
  block comments before any structural test. Slicing a block by its header text lands *inside* that
  comment — strip first, then slice.
- **A count that drops is not automatically a regression.** Group 25 counts icon-only delete
  buttons; it went 18 → 17 because the tenant delete button now carries the word "Delete", and the
  rule says a worded button must not be marked or the label prints twice.

## The desk rail's two arrivals fought each other (2026-08-14, `9e975aa`)

The hover-expand desk rail shipped with the music mark, the face and the logout **visible around a
closed capsule and unclickable** — the marks went dark correctly and those three did not. The
difference: those three carry `boot-1/2/3`, the arrival animations, which run `forwards`, and **a
filled animation outranks a normal declaration in the cascade**, so the rail's `opacity: 0` never
reached them.

Fixed by switching the boot animation off on the desk (`.kpm-rail-pod > * { animation: none }`)
rather than with `!important` — the capsule unfurling *is* the arrival at that width, and two
entrances over each other was never the design. The phone keeps its own. Circle also went 72 → 56
inside the 64px column (*"button is too big"*), and the capsule now grows from `inset 4px` to
flush.

**Standing consequence for this system:** any control that carries an arrival animation cannot be
hidden by a plain `opacity`/`visibility` rule later. The full pattern, with the two other
same-day occurrences, is [[The Rule That Never Applied]] — read it before adding a rule that is
supposed to override an existing one.

Related: [[Off-Token Colour Migration Map]], [[Aldi's Design Taste]], [[Silent Failure Disease]],
[[The Rule That Never Applied]]
