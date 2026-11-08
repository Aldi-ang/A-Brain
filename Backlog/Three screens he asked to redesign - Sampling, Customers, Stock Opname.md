---
title: Three screens he asked to redesign - Sampling, Customers, Stock Opname
description: Filed 2026-08-16 in one message alongside EOD. Only one of the four named an actual defect; the other three are ambitions, and he said explicitly that the design conversation comes first.
status: To Do
progress: "partly: Customers (2026-10-20/21) and Stock Opname (2026-11) are redesigned; Sampling is not"
area: Feature Redesign
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# Three screens he asked to redesign

One message, 2026-08-16, four screens. EOD was taken first and is most of the way through. These
three are still untouched, and **he said explicitly that the design conversation comes before the
code** — *"lets brainstorm about this later"*, *"brainstorm topic for later"*. Those are
instructions, not politeness.

## 1. Sampling — the only one that named a real defect

> *"sc1 the folder in sampling ihave the same color with it background it is not clear enough on
> the dark or light mode i suggest redesign the whole sampling segment to looks better but keep the
> logic"*

⚠️ **Check whether the defect is already fixed before designing anything.** The root cause was a
gradient left with no colour stops, painting nothing at all — that class of bug was swept during
the light-theme work. If the folder is now visible, this drops from "bug plus redesign" to
"redesign", which is a different priority.

## 2. Customer Directory — animated cards and 3D folders

> *"customer segment also needed to be redesign the UI and animation better increase ergonomics and
> usefullness as well ... i was thinking about making some animated card for each customer and
> animated folder for each 3D animated cards should looks really cool lets brainstorm about this
> later"*

**"3D" means depth and physicality, not WebGL.** His vocabulary is *cards* and *folders* — objects
that tilt, lift and open. The EOD deck now has a working, Lite-safe vocabulary for exactly this
(persistent nodes, CSS transitions only, state owns visibility) — reuse it rather than inventing a
second motion system.

## 3. Stock Opname — concept, UI and animation

> *"stock opname also need whole redesign for this concept and UI and animation as well brainstorm
> topic for later"*

⚠️ **This screen is load-bearing and half of the HQ layer already lives in it** —
`PENDING_HQ_APPROVAL`, HQ notifications, per-facility damaged tracking with photos, the `'HQ'` role
tag. A redesign here touches the pipeline that
[[Damaged goods and expired stamps need a route to HQ]] depends on. Do that backlog item first, or
design around a shape that is about to change.

## What all three have in common, and it is the useful part

1. **"keep the logic" appears every single time.** He separates how a screen looks from what it
   computes and does not want the second one touched while the first is redone.
2. **Motion is not decoration to him — it is the point.** A screen that is correctly coloured and
   completely still still reads as unfinished.
3. **He cannot judge a concept from prose and said so plainly:** *"i cant imagine those, why dont u
   generate all of that inside artifact and i choose"*. **The deliverable for any design decision
   here is a playable artifact, not a description of one.** Budget that build in from the start.
4. Check for a built-but-invisible mechanic before designing a new one — that has been true three
   times in a row on this codebase.
