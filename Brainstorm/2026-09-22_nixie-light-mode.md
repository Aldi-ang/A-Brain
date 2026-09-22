---
title: The nixie counter in light mode — three looks
status: BOARDS SENT 2026-09-22 14:10 — his pick owed (A recommended)
created: 2026-09-22
updated: 2026-09-22
tags: [design, light-mode, nixie, stock-opname, boards]
---

# The nixie counter in light mode

His 2026-09-20 test answer: *"t4 looks okay but the light mode nixie can look better that that"* (t4 = the Stock Opname
count card). Today the counter is black glass with a fixed amber ink in BOTH themes (his 2026-09-04 rule: an instrument
does not follow the room's lights; kpm `bcb08c4`). On the cream light plate it is a black rectangle.

## The three looks (tools/lab-looks.js, light mode only, dark untouched; no shadow, no filter; Lite Mode safe)

| | what | cost |
|---|---|---|
| **A — the bezel (recommended)** | the same black glass, seated in a 3 px brushed-metal ring (a border-box gradient), the anodized family of the light sidebar | none visible: digits unchanged, the smallest change |
| B — daylight glass | frosted cream tube, digits in dense dark amber `#9A4200` (the gold's own light-mode inversion), faint warm disc | the "lit" feeling is gone in daylight |
| C — the odometer | cream flap tiles with a split hairline in a dark slate frame; the reel reads as flaps | boldest; still a dark rectangle on the cream card |

Frames: `A-Brain/Raw/2026-09-22-nixie-light/` — `board-nixie.png` (four crops of the real count card) and `zoom.png`
(the DIFFERENCE plate at 2×). Live: `http://localhost:4190/tools/ponder-lab.html?shell&opname&light&look=nx-a&tab=count:400/3,3%20damaged`
(`nx-b`, `nx-c`). Shot at 518 — headless cannot go narrower, and `look=pin` does not fire the phone media queries this
screen is built on (the first frame showed the desk grid squeezed into 375; see [[Looking at the App]]).

**Models applied:** Inversion (what would make the light counter WORSE — a paler copy of the dark one; so every option is
a material, not a tint), Chesterton's Fence (the black-in-both-themes rule is his and recent — A keeps it, B and C
say plainly that they cross it), Opportunity Cost (A costs one CSS rule; C costs a second instrument family to maintain).

not-chosen: B and C lose to A on his own record — he keeps the default surprisingly often and tunes numbers rather than
swapping concepts. Flip condition: if he answers "B" or "C" the black-in-both-themes rule (2026-09-04) is superseded for
light mode and the taste file gets the entry.
