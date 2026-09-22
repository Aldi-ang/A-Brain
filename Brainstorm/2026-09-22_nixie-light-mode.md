---
title: The nixie counter in light mode — three looks
status: ROUND TWO SENT 2026-09-22 14:50 — the nixie itself is refused for the DIFFERENCE plate; three plate-family verdicts boarded (A the stamp recommended); his pick owed
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

## Round two, 14:40 — the nixie is refused for this plate; the verdict joins the paper

His 14:30: *"tbh nixie tube doesnt look natural compared to other number box right there maybe we should change into
other design for that, we need something that is little bit special and not standardised i have no inspiration for now"*.
The complaint is not the light theme: the counter is a black instrument in a row of three paper plates. So round two
leaves the glass: three verdicts of the SAME family as the sibling plates, in both themes, the ink following the plate's
state (amber until sure, red for a confirmed difference — his 2026-09-18 rule).

| | what | cost |
|---|---|---|
| **A — the stamp (recommended)** | a double-ruled rounded box tilted 4°, the figure in the display face, the VERIFIED seal's family; lands with the seal's 320 ms on change | none: no font, no effect type; Lite Mode keeps it |
| B — the engraved well | a recessed well in the plate's own tone, the figure 30 px, a 3 px state bar | the quietest; the plate row grows |
| C — written by hand | a marker script (Caveat 700) tilted 3°, the state ink | a ~40 KB font bundled for offline; 0/6 legibility at this size |

Frames: `board-verdict.png` (five crops: TODAY, A, B, C, A dark) and `zoom2.png` (2×, six plates). Looks `st-a` / `st-b` /
`st-c` in tools/lab-looks.js — CSS over the reel markup; a chosen look SHIPS as a plain figure (the reel is hidden, not
needed). The other nixie uses (the EOD folder total, the Agent Inventory window, the presentation hero) are not in this
complaint — "right there" is the count card — and stay.

**Models applied:** First Principles (what is the DIFFERENCE plate FOR — a verdict on paper, not a meter; so the
instrument metaphor was the wrong one for this plate), Inversion (what makes it "not natural": a different material from
its three siblings; every option keeps the plate material), Opportunity Cost (C buys the most character for a font
download he must ship offline).

not-chosen: B loses to A on his "special" — it is a nicer box. C loses on the shipping cost, not on looks; flip
condition: if he picks C, bundle Caveat as a local woff2 and add a self-check that the font file is in dist.
