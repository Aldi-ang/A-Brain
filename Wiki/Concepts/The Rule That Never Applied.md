---
title: The Rule That Never Applied
description: Three same-day bugs where the CSS was written correctly and still lost — a Tailwind class, source order, and a filled animation. The check must read the computed value, not the source.
type: concept
created: 2026-08-14
updated: 2026-08-15
confidence: high
checked: 2026-08-14
tags: [pattern, css, theme-css, app-shell, kpm, discipline]
---

# The Rule That Never Applied

On **2026-08-14** the same failure shape hit `theme.css` three times in one day: a declaration
was written, was correct, was greppable in the source — and never reached the pixel. Each one
survived a passing audit run, and each one was found by *looking at the app*, not by reading it.
This page exists because three is a pattern, not a coincidence.

## The three occurrences

| # | The rule written | What beat it | How it looked |
|---|---|---|---|
| 1 | `width: 144px` in `theme.css` | a Tailwind width class on the same element, carrying the **phone's** 176px | the desk panel was phone-width; the previous session's "logout stops being clipped" fix had never once applied |
| 2 | the hover label's own positioning | `.kpm-rail-mark > *` sets `position: relative` and won on **source order at equal specificity** | the label sat inside the capsule and, as a flex child, pushed the icon off centre |
| 3 | `opacity: 0` on the closed desk rail | `boot-1/2/3` run `forwards`, and a **filled animation outranks a normal declaration** in the cascade | music, face and logout stayed visible around a *closed* capsule and could not be clicked — the marks, which carry no boot animation, went dark correctly |

Occurrence 3 is the sharpest: the split Aldi photographed *was* the diagnosis. The three elements
that stayed lit were exactly the three carrying an arrival animation. Nothing else distinguished
them.

## The rule

> **Greping the source for a class or a value proves it was TYPED. It does not prove it APPLIES.**

A check that passes on `grep '144px' theme.css` passed for a whole day over a value the browser
never used. The check that catches all three is the same one: **read the computed value in a real
browser** — `getComputedStyle`, or a measured `getBoundingClientRect()`. Commit `9e975aa` ends by
reporting measurements, not code: *rail 64, totem 56×56, brand/nav/bottom all opacity 0, no
animation left running; open 292, capsule 696 tall.* That is what a finished check looks like here.

This is the CSS-shaped instance of [[Anti-Recurrence Check]]'s standing rule — "I wrote it" and
"it happened, verified" are two different claims — and it only became findable once the app could
be looked at at all (see [[../Log]], 2026-08-14, and [[Secure Context Requirement]] for why it
could not be, for two sessions).

## Fixing it without `!important`

Occurrence 3 was fixed by switching the boot animation **off on the desk**
(`.kpm-rail-pod > * { animation: none }`), not by escalating with `!important`. The reasoning is a
design one, not a specificity one: the capsule unfurling *is* the arrival at that width, and two
entrances playing over each other was never the design. The phone keeps its own boot animations.
`!important` would have hidden the fact that the shell had two arrival animations fighting.

## A fourth occurrence: no rule at all is also a rule that never applied (2026-08-15)

`.kpm-rail-totem` had a rule for a desk that hovers (it *becomes* the collapsed circle) and a rule
for a desk that cannot (hidden) — and nothing at all for a phone, which matches neither media
query. A bare `<span>` with no rule renders inline by browser default, so it drew the active tab's
own icon a second time above the grid. **The written rules were all correct; the bug was in the
gap between them.**

> **When a class is only ever styled inside media queries, ask what it looks like OUTSIDE them —
> that is a real screen too.**

Fixed by hiding it at file scope, letting the hover-desk block turn it back on later at equal
specificity — deleting the element outright would have taken the PC's collapsed circle with it.

**The check that caught it broke on its own first run**, worth recording next to the fix: it
anchored on `@media (min-width: 1024px) {`, which occurs several times in `theme.css`, and a plain
text search returns the *first* one — the gate landed 28,000 characters early and missed the real
block. **Fourth time in one week a regex anchor was wrong.** Count the occurrences a pattern
matches before trusting the first one; anchor on something unique (a value, a selector's full
string), never on a fragment that repeats.

## A neighbouring trap: two coordinate systems in one scene

Same commit, different class of bug, worth naming here because it also only shows at real widths:
the cave arch is positioned at `left: 4%` **plus a fixed 124px**, while the left torch was at
`21%` of the same box. They only clear each other past ~729px, and the ledger column never is —
so the torch stood in the doorway at every width Aldi actually uses. Anchored to the arch's right
edge in px now.

⚠️ **Mixing % and px positioning inside one scene is the bug class, not this one instance.** If
two elements must stay in step, they must be positioned in the same units, or one anchored to the
other.

Related: [[The KPM Control System]] · [[Anti-Recurrence Check]] · [[Aldi's Design Taste]]
