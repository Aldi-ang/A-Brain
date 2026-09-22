---
title: The PC — the review card too tall when open, the Agent Inventory strip colliding at xl
type: brainstorm
created: 2026-09-22
status: DECIDED 2026-09-22 09:38 — "board 1 = A but make the Profile picture bigger as big as B minimum, board 2 = A looks better but make sure that all the boards looks good on phone too"; shipped as kpm 20aac21, CONFIRMED by Aldi 10:03 ("test 1 approve, test 2 approve, test 3 approve")
tags: [kpm, pc, desk, player-card, eod, agent-inventory, layout, design]
---

# The PC boards (2026-09-22 09:14 → 09:30)

## The problem, in his words

Three screenshots from his PC, 09:14: *"u need to redesign the agent inventory especailly for the modal here
because its collapsing with other box sc1, sc3 is the review card that u ask this box is little bit to long
vertically when open on the pc so that i need to slide up and down just to see the whole box opened i want u to
shortened it. sc2 is the agent profile"*. sc2 (the Agent Profile with the card's head) came with no complaint.
"Collapsing" is his word for two elements overlapping ([[Aldi's Design Taste]]).

## What the lab measured (`?shell&eod&admin`, `?shell&agent`, 2000×1000 — his screen)

| screen | finding |
|---|---|
| review card, open (real click on the chevron) | the card is **880 px** tall; the EOD scroller is 870 and the card starts 180 px down it, so the plate and the RESET line sit **189 px below the screen's bottom**. Head 255 (avatar row 128 + CLOSED TODAY row 79), body 595 (revenue 48, products 95, handover 5 × 52 + label, plate 52, reset 44). |
| Agent Inventory header at xl | the page is `max-w-5xl` (1024); the stats column is `xl:w-[65%]` = 631 px → four boxes of **149 px, 124 inside**. `Rp 1.200.000` at `md:text-xl` is 126 px in the pane's font, **152 px in his** (from his screenshot: 228 device px at 150 %), so it crosses 14 px into CASH on each side. CASH's `kpm-coin` + number is 164 px: the coin sits 8 px OUTSIDE its own box (the gold sliver at CASH's left edge in his shot). Below 1280 the column is `w-full` and nothing crosses — a laptop never shows it. |
| rank frame | `.sframe` is a fixed 128 px (rankBorders.jsx); shrinking `.pc-avatar` does not shrink it — a compact head needs `transform: scale(72/128)` on the frame. |

## The options (lab looks in `tools/lab-looks.js`, boards in `Raw/2026-09-22-pc-boards/`)

### Board 1 — the review card open on the desk (≥1024 only; the phone untouched)

| option | what it is | measured | cost |
|---|---|---|---|
| **A (recommended)** `rc-head,rc-two` | the head compacts when open (photo 128 → 72, CLOSED TODAY + the stamps light beside the name), the body in two columns: revenue + products left, the handover + plate right | card **619 px**, ends 55 px above the screen's bottom | a product name gets ~170 px, a long one wraps to two lines |
| B `rc-two` | the same two columns, the head untouched | card **737 px**, 64 px spare with 5 lines, 8 px with 6 (BOUNTY) | no slack — one more line or a smaller window and he scrolls again |

### Board 2 — the Agent Inventory strip on the desk (≥1280 only)

| option | what it is | measured | cost |
|---|---|---|---|
| A `inv-a` | the desk uses the laptop layout: MANIFEST block on its own row, the four boxes full-width under it | 239 px per box, 87 px slack | the header grows ~110 px on the PC |
| **B (recommended)** `inv-c` | one panel in the sibling's language (PROJECTED VALUE): four cells, hairline dividers, no coin on the desk, 18 px numbers | 155 px per cell; a 7-digit rupiah 19 px spare in his font, an 8-digit one steps down to 16 px via the Money ladder | the boxes lose their frames and the coin; a title row is his to name |

Models applied: Inversion (what makes the card NOT fit — the head's 255 px, not the lines), Second-Order (the
Money ladder was tuned for the pane's font; his font is 20 % wider, so any fix by string length alone fails on his
machine → the cell needs slack, not a tuned threshold), Opportunity Cost (A of board 2 costs 110 px of every
desk session; B costs one afternoon of CSS).

## Rejected on purpose

- Shrinking the handover rows to 40 px on the desk: saves 60 px, not enough alone, and the keys are 44 by his finger rule (he may touch the PC).
- The open card spanning both EOD columns: needs the card to leave the pending column's DOM; the verified list would jump.
- A container-query font (`cqw`) for the strip: scales with the cell, not with his font — cannot know the text is wider.
- Fixing only the Money ladder thresholds: tuned against the pane's font, breaks again on his.

## Decision

DECIDED 09:38: *"board 1 = A but make the Profile picture bigger as big as B minimum, board 2 = A looks better but make
sure that all the boards looks good on phone too"*. Shipped as kpm `20aac21`: the head is one row from lg with the photo
kept at 128 (so no `.sframe` scale at all), open or closed alike, so opening animates only the body; the body 2:3 — the
1:1 of the board overlapped TRANSFER's label with its value and wrapped STOCK BACK / DAMAGED GOODS when shot headless in
his system font (the pane's font is ~20 % narrower); a product row wraps on the desk instead of truncating. Card 564 px
open (was 880), 189 closed (was 280). The Agent Inventory header lost its xl split: 239 px boxes, MODAL 41 px slack, the
coin 38 px inside. Phone measured to the pixel with the edits stashed and restored: identical. The SHIPPED board is in
`Raw/2026-09-22-pc-boards/board-shipped.png`.
