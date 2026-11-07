---
title: "The Stock Opname tabs without the amber fill"
type: brainstorm
created: 2026-11-08
status: DECIDED 2026-11-08 05:52 — 2 all, BUILT kpm 23abaa3
tags: [kpm, design, stock-opname, amber]
---

# The Stock Opname tabs without the amber fill

## The problem, in his words
*"when we got the quota i also want u to redesign those button because i hate the amber fill color"* (2026-11-06). "Those" = Monitor, HQ Audits, Quarantine, New Count. The chosen tab is a whole amber button (`bg-[var(--gold)] text-[var(--gold-ink)] shadow-md`). Third time on the point: see Aldi's Design Taste, "The switches were amber slabs" (2026-10-20) and the 2026-11-06 entry. In the light theme the same class is a near-black slab (measured rgb 27,25,23), so it is a slab in both themes.

## The options (drawn on the real app, emulator, injected style only)
| | Look | Dark | Light | Moves anything? |
|---|---|---|---|---|
| Today | amber slab | amber 208,138,46 | black 27,25,23 | - |
| 1 | `--raised` plate + gold word + 3px gold bar (the `.kpm-switch` answer of 2026-10-20) | plate 27,25,23, word 208,138,46 | plate 237,231,216, word 79,54,3 (brown, not gold on light) | no: 4 buttons, same x/y/size at 1280 and 390 |
| 2 | no plate, plain word, 2px gold underline (the `.kpm-wl-tab` look under it) | word 232,228,222 | word 19,18,17 | no, same |

Board: `Raw/2026-11-08-tabs-amber/board.png` (PC dark, PC light, phone; HQ Audits chosen). Shooter: `tabs-looks.mjs` beside it.

## What each costs
- **1:** matches what he accepted on every Settings switch ("can u fix all the buttons so that it look like that new button"). Two shapes on HQ Audits stay distinct: plate+bar on top, underline for the warehouses. Cost: a small plate is still a fill, only not amber.
- **2:** the quietest. Cost: on HQ Audits two underline rows sit on top of each other, so the four main tabs and the warehouse tabs read as one level.
- **Scope:** the same amber chosen-state is on 3 more tab rows: Quarantine Active/History (StockOpnameView ~1318), EOD Setoran review/submit (EODReconciliationView 393/397), Sampel date range (SamplingManager 128). The other 22 amber lines in the app are badges and action buttons, not tabs: not in this question.

## Decision
**2026-11-08 05:52, his answer: *"2 all"*.** The gold underline, on all four rows, against my recommendation of 1. Built kpm 23abaa3: `.kpm-tab-on`, nine chosen states. Found while checking it: EOD Setoran's tab box was a fixed `bg-black/50`, which put the dark word on a dark grey in the light theme; it takes `--sunk` now. Proof `Raw/2026-11-08-tabs-amber/built.png`.

Was: OPEN — waiting on Aldi. Asked (verbatim): **🔴 DECIDE: Which look do you want for the chosen tab: 1 a dark plate with a gold bar under it, like your Settings switches, or 2 only a gold line under it, like the warehouse tabs below? Add "all" if the other three tab rows that still have the amber fill should get the same look: Quarantine's Active / History, EOD Setoran's two tabs, and Sampel's date tabs.** Recommended 1.

## Rejected on purpose
- A bar that slides between the four tabs: tabs are pressed many times a day, so no motion; and it would need a measured indicator like `.kpm-wl-ind`. Static bar, no animation.
- Keeping amber as a thinner fill or a gradient: still a slab, and gradients are the other thing he dislikes on the Same as last time buttons.
- Changing the badges and action buttons in the same go: they are not what he named.

Models applied: Inversion (what makes him say it a fourth time: any filled amber area left on a chosen state); Second-order (on HQ Audits the main tabs and the warehouse tabs stack, so the two levels must look different).
