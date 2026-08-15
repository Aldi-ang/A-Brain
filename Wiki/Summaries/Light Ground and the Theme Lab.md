---
title: Light Ground and the Theme Lab
description: The 2026-08-16 night session — why light mode looked unfinished when every panel was already converted, and the browser harness built after three "fixed" claims made without ever seeing the app.
type: summary
created: 2026-08-16
updated: 2026-08-16
confidence: high
checked: 2026-08-16
tags: [summary, kpm, light-mode, design, verification, tokens]
source: "[[../../Raw/2026-08-16_source_light-ground-and-the-theme-lab|Raw]]"
---

# Light Ground and the Theme Lab

Source: [[../../Raw/2026-08-16_source_light-ground-and-the-theme-lab|Raw — 2026-08-16]].

---

## The one-sentence version

Every panel on the screen was already cream, and light mode still looked broken, because **the
page under them was a literal** — and the header and dock are glass, so they were showing that
literal through themselves rather than being dark themselves.

## Three surfaces, one cause

Aldi reported the background, the top bar and the sidebar as separately still-dark. They were one
bug. `body` in `src/index.css` pinned `#0b0a09` and a hardcoded gradient; `.kpm-topbar` and the
dock set `background-color: transparent` and blur what is behind them.

> **When three surfaces are wrong at once, look for the one thing behind all three.**

This is worth generalising past CSS: a glass element has no colour of its own, so "it is the wrong
colour" is never a fact about the glass.

## The app had two light themes and nobody had put them side by side

The modules Aldi keeps approving are the Duke **cream** (`#f6f1e4` · `#e6dfcd` · `#d8cdb6`). The
app's own semantic surfaces were a colder, darker **steel** (`#B4B0A9` · `#C6C2BB` · `#D2CEC7`).
Same screen, two families — which is why the page read as a different app to the panels sitting on
it even after it stopped being black.

His instruction closed it: *"use the light theme that we apply to the setting panel to its
background as well"*. The whole ladder moved into the cream family **together**, every step
preserved — lifting only the page would have put the ground above the panels and deleted the one
thing that makes a panel read as a panel.

⚠️ **This supersedes a Phase-3 "locked" decision.** See [[../Concepts/Aldi's Design Taste]]: the
light ground was bench steel and *"#FFFFFF appears nowhere as a surface"*. The second half still
holds — `--raised` stops at `#EDE7D8` — but the ground is cream now, on his instruction, and it
moves toward the *"light mode is white black amber and red"* he said on 2026-08-13.

**Safe direction, and why:** lifting a light surface only ever *helps* the dark inks on it. Every
ink in the light theme is dark; the pale inks (`--gold-ink`, `--ink-inverse`, `--knob-on`) all sit
on dark plates, which did not move.

## A theme island, for screens that stay dark in both themes

The vault gate's backdrop flipped to cream — *"light mode or not, login background should not
change like this should stay black"*. All 17 tokens used inside that gate flip, and its card is a
literal near-black in both themes, so every ink on it went near-black too.

`.kpm-dark-island` re-declares those tokens back to their **dark** values for a whole subtree.
Anything added inside such a screen later is dark-correct without anyone remembering the rule.
Carried by the vault gate and the two full-screen stop screens.

> **Reach for an island whenever a screen's ground is fixed while the page around it themes.**

## Frozen copies do not follow a corrected token

`.kpm-chip` (SYNCED, the clock) was written in raw dark hexes. Its resting ink `#8b7256` is what
`--duke-ink-3` was *before* Aldi said *"fix the dark contrast"* and it moved to `#a08768`. The
copy never got the correction — invisible on a black header, two dark holes punched in a cream one.

## What only *looking* found

Three defects that no contrast ratio could ever have flagged:

- the gold bloom at `.16` was **amplified by the header's `saturate(1.5)`** into a yellow stain;
- the scrollbar was three fixed browns — on the palette, but only in one theme;
- the selection ink was near-white on a pale amber wash.

And one real ratio failure that only a browser measurement caught: `--accent-ink` `#6B4A05` at
**3,73:1** on the light ground (his "lock terminal"). Now `#4F3603`. **"Reset indicators", reported
in the same sentence, was never broken** — 5,48 all along, and only looked wrong because the page
behind it was black. **Fixing it would have broken it.**

## Related

- [[../Concepts/Looking at the App]] — the harness this session produced, and the three ways it
  lied before it told the truth. **Read before claiming any colour is fixed.**
- [[../Concepts/Aldi's Design Taste]] — his verbatim instructions from this night
- [[../Concepts/Anti-Recurrence Check]] — shape 5 recurred here; shape 7 was added from it
- [[../Concepts/The KPM Control System]] — the vocabulary these tokens dress
- [[../Concepts/Off-Token Colour Migration Map]] — what is still unconverted
