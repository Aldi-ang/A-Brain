---
title: Fleet & Roster - a bigger load panel (A focus / B tall / C wide)
type: brainstorm
created: 2026-11-16
confidence: high
checked: 2026-11-16
tags: [kpm, fleet, design, decision-open]
---

# Fleet & Roster - a bigger load panel

## PROBLEM (his words, 2026-11-16 15:30, on the live demo)
> *"i also feels like the product options screen on the right is too small and it can only show 2 products at a time, i want u to redesign it so that it looks bigger whatever the methods there is one methods that im thinking of is u can just blur all the screen and only name and the right panel is the only panel that is not blurred this way u can use the blurred upper space and use it to make the right panel bigger, but u must think how this method could work in the phone as well tho, or maybe u have another option u can tell me"*

Reading: "name" = the NAME PANEL (his own word for the list, earlier in the same message: *"border between name panel and goods panel"*). The first frame of A sharpened only the picked row - that reading was wrong and was re-drawn before the board.

Measured cause: the panel's head stack (name 69 + person keys 57 + tabs 41 + tools 50 + column head 35) and the foot (57) take 309 of 497 px on the PC; on the phone the first product starts 506 px down an 844 px screen.

## OPTIONS (drawn on the real app, real demo data, counted with count.js)
| | PC 1280x800 products in view | What changes | Cost |
|---|---|---|---|
| TODAY | 3 | - | - |
| A his focus | 8 | panel from under the top bar to the bottom, 955 px wide; name panel sharp and pressable; top bar + day strip dim and blur; each product on one line; tabs and person keys on one row | the day strip is hidden while a van is open; a named blur exemption in integration.audit G30 + Lite Mode (dim .8, no blur), as `.kpm-mx-veil` has |
| B tall | 4 | same 640 width, covers the day strip | hides Sold today, Override requests, Offers and Add personnel while open; the smallest gain |
| C wide | 5 | panel 955 wide at today's height, one-line products | nothing hidden |
| Phone (all) | 3 -> 5 | back key + name one line, numbers one line, person keys behind More, tools one row, sold today joins the numbers line | Surat Jalan / Details / Edit / Delete one press further away |

Board: `Raw/2026-11-16-fleet-build/board.png` (lab overrides in `opt-lib.js`, `mkopt.mjs`).

Models applied: Opportunity Cost (the head stack, not the panel's place, was the thief - every option carries the compaction), Pre-mortem on A (a manager loading 9 vans in a row: a veil over the list would cost two presses per person and unreadable names - fixed by keeping the name panel sharp, which is also his words), Second-Order (B hides the Offers / Add keys a leader uses beside the sheet).

## DECISION
OPEN — waiting on Aldi (board sent 2026-11-16 17:47). My pick: A - 8 products and the list still works; C if he wants nothing hidden.

## REJECTED ON PURPOSE
- A veil over the whole list with only the picked row sharp (first draft): blocks one-press switching between salesmen.
- Truncating product names on the phone to win height: names like "Cello Coffee & Caramel kretek" are how he finds a line.
- Two columns of products in the wide panel: scan order breaks.
