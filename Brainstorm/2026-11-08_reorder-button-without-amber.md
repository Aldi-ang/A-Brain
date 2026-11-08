---
title: "The Same as last time buttons without the amber gradient"
type: brainstorm
created: 2026-11-08
status: DECIDED 2026-11-08 07:04 — 1, BUILT kpm cca32e1
tags: [kpm, design, sales-terminal, amber]
---

# The "Same as last time" buttons without the amber gradient

## The problem
Queued since 2026-11-05 as #2 in his order: both `handleReorder` buttons in MerchantSalesView.jsx (the phone's shop card ~2684, the PC "Sebelum masuk" panel ~3065) are a wide amber gradient slab, `bg-gradient-to-r from-[var(--duke-amber)] to-[var(--duke-amber-2)]` with black text. Same complaint as the tabs (Aldi's Design Taste, 2026-11-06 and 2026-11-08): he hates the amber fill, and on 2026-11-08 he picked the quietest look over my plate.

## The options (real terminal in the lab, injected style only; lab gained `&history` so a shop has a past sale)
| | Look | Dark theme values | Moves anything? |
|---|---|---|---|
| Today | amber gradient, black word | gradient, ink 0,0,0 | - |
| 1 | no fill: transparent, 2px gold edge, plain word (the house `.kpm-edgebtn` idea) | edge 208,138,46, word 232,228,222 | no: same box, phone 342x44, PC 199x41 |
| 2 | dark plate (`--raised`), gold word, quiet border | plate 27,25,23, word 208,138,46 | no, same |

Board: `Raw/2026-11-08-reorder-button/board.png`; shooter `looks.mjs` beside it.

## What each costs
- **1:** matches his tab pick (no plate) and the edge buttons already in the app (View Analytics). Still reads as the one thing to press on the card.
- **2:** a grey plate with a gold word reads close to a DISABLED button at a glance, on a card he presses outdoors one-handed. A gold bar under it was drawn first and did not show (the button's own ::after won), so it was dropped from the board rather than faked.

## Decision
**2026-11-08 07:04, his answer: *"1 better"*.** Built kpm cca32e1 as `.kpm-reorder`. Proof `Raw/2026-11-08-reorder-button/built.png`.

Was: OPEN — waiting on Aldi. Asked (verbatim): **🔴 DECIDE: Which look do you want for the two "Sama seperti terakhir" buttons (on the shop card on the phone, and in the "Sebelum masuk" panel on the PC): 1 no fill, a gold edge around a plain word, or 2 a dark plate with a gold word?** Recommended 1.

## Rejected on purpose
- Keeping a thinner amber fill or a softer gradient: still a slab, and the gradient is the very thing he named.
- An animated hover sweep: pressed often, outdoors, on a phone; no motion.

Models applied: Inversion (what would make him say "amber" a fourth time: any filled amber area); Second-order (a plate that looks disabled costs a salesman a second look at every shop).
