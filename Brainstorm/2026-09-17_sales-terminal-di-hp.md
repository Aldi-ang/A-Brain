---
title: Sales Terminal on the phone — what 375 px measured, and the two fixes on the table
description: The phone sweep reaches the Sales Terminal. Every control measured at innerWidth 375 in the real shell, the two proposals rendered through ?css= and sent as frames. DECIDED the same morning — B for the wares row, YES for the sheet — shipped kpm 4ba6563.
type: brainstorm
created: 2026-09-17
updated: 2026-09-17
status: DECIDED — B + YES, shipped kpm 4ba6563
confidence: high
checked: 2026-09-17
tags: [brainstorm, phone, sales-terminal, sweep, 375]
---

# Sales Terminal on the phone (2026-09-17)

## The problem, in his words

The sweep rule (2026-09-15): *"just make the panel bigger so that more words and panel fit inside
the phone because there is so little space"*, and the 44 px finger rule he confirmed on the
Restock Vault. The Sales Terminal is the screen a salesman uses all day on a phone and nothing on
it had been measured at 375 since the redesign.

## What the lab measured (`?shell&terminal`, innerWidth 375, dark AND light — same numbers)

Instrument: `tools/ponder-lab.jsx` `?shell&terminal` (commit `dbc0787`), the terminal inside the
real shell and the one bare box App.jsx wraps it in; `?grip` opens the manifest with a real
pointer tap; `?tab=+,tap to choose,toko berkah,open camera` walks a sale to the camera.

| control | today | rule |
|---|---|---|
| − / + steppers on every ware | 32 × 32 | 44 |
| product name column | 98 px → "CELLO GREEN 16" wraps to 2 lines | one line |
| ALL / MISC category tabs | 34 tall, 10 px text | 44 |
| SEARCH WARES | 35 tall | 44 |
| customer-bar button | 16 tall inside the 52 px bar (a miss lands on the no-op bar) | 44 |
| SALE MODE / RETUR MODE | 27 tall, 10 px | 44 |
| "Tap to choose the customer" box | 33 | 44 |
| payment select | 32 | 44 |
| cart-line unit boxes (Karton/Bal/Slop/Bks) | 32 × 20, labels **8 px** | 44 / ≥10 px |
| cart-line qty input · unit select · tier select | 25 · 17 · 17 | 44 |
| "Open camera for handover photo" | 32 | 44 |
| picker DONE | 28 | 44 |
| EXAMINE label on the picture · "Customer" label on the bar | 9 px · 9 px | ≥10 |

Fine as is: grip 52, customer bar 52, SIGN MANIFEST 47, camera close 44, picker rows 45, nothing
wider than 375 (scrollWidth 375), the T4–T6 camera view has no file input (trap (a) holds).

## Options — rendered at 375, sent as `st-wares.png` and `st-sheet.png`

**1 · the wares row**

| letter | what it is | measured at 375 | cost |
|---|---|---|---|
| **A · recommended** | text column becomes a 2-row grid: name across the top (one line), price left + 44 px steppers right below; picture untouched | row 99 (unchanged), name 220 px one line, − + 44 × 44, picture tap 80 × 80 | none on height; ~10 lines of phone-only CSS in MerchantSalesView |
| B | picture 96 → 64, steppers 44 in the same row | row 68–90, "DJARUM COKLAT 12" still wraps, picture tap 48 × 48 | loses the stock-detail target he sized at 96 ("80 was barely a fingertip") |
| ~~stack~~ | text column stacked, steppers under the price | row 122 (+23 per ware) | rejected before he saw it — same idea as A, one more row of height for nothing |

Both A and B also lift ALL/MISC and the search to 44 and EXAMINE to 11 px.

**2 · the manifest sheet — one YES/NO.** Every control in the drawer to 44 (min-height, nothing
moved or renamed), every 8–10 px label to 11 (unit labels to 10 so the four boxes stay on one
row), DONE in the picker 44. Measured after: zero controls under 44 in the drawer, zero text
under 10 px, the four unit boxes on one row at y 1246. All rules under `@media (max-width:1023px)`
— the terminal's own `lg:` breakpoint — so the desk keeps every number.

## Decision

**B + YES, 2026-09-17 08:30**, his words: *"just change into B because it fit well and doesnt take
a lot of space and bigger button as well users need it, manifest also looks better since there is
more space to press and read yes"*. He took the shorter row over the kept picture — A's argument
(row height unchanged, 96 px picture) did not weigh; space and button size did. Shipped as kpm
`4ba6563`: picture `w-16 h-16 p-1` (56 px target), steppers `w-11 h-11 lg:w-8 lg:h-8`, every
sheet control `min-h-[44px] lg:min-h-0`, labels 11 (unit labels 10, one row), nine element-scoped
guards in `logicFixes.selfcheck.mjs` (red 8 → green 1574), audit G7b re-pointed at 64 px (722).
Desk probed at 1280: every number as before. Left alone on purpose: the admin field-mode toggle
(27 px, tier 1 only) and the six 8.5 px mono eyebrow labels of the customer brief — a separate
typographic decision. ✅ TEST owed on his phone.

## Rejected on purpose

- The stacked wares row (above) — taller for the same result.
- Moving the admin field-mode toggle back into the shell — App.jsx:4899 comment, his G5 report.
- Any picker for T4–T6 in the camera view — `284ea64`/`1857b97`.
- Touching the money engine — cash refund never reduces omzet, Buyback stays off.

## Models applied

Inversion (what would make the row fix wrong: a 44 px stepper that squeezes the name column —
the reason A is a grid, not a size bump); Chesterton's Fence (the 96 px picture was sized on
purpose and the 32 px stepper comment already prices the trade — B pays that fence, A keeps it);
Second-Order Thinking (a taller row means fewer wares per screen for a salesman scrolling all day
— why the stack was dropped); Reversibility (all CSS, phone-only, one-way nothing).

## Traps for the session that builds it

- `?css=` proves the LOOK; the real edit goes into the JSX classes so the audit can pin it. Add a
  guard in `src/config/integration.audit.mjs` (built output) or a selfcheck: the stepper buttons
  carry `w-11 h-11` (or `min-h-[44px]`) on the phone, the grid stays.
- The headless frame at 518 lies about the name wrap; pin `#root{width:375px}` (recorded in
  Looking at the App) or trust only the pane.
- `input{min-height:44px}` measured 43 in the pane (border box) — use 46 or check the box.
