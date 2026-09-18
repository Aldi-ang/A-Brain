---
title: Customers on the phone, round two — the boss's header, DEL/EDIT behind ⋯, a new hold
type: brainstorm
created: 2026-09-18
status: OPEN — waiting on Aldi (three letters)
tags: [kpm, phone, customers, design, motion]
---

# Customers on the phone, round two (2026-09-18 14:12)

## The problem, in his words

*"the find duplicate, data scrub, add new customer and import map button inside customer is still in
a bad shape and needed redesign as well , and i can still move the customer page sideways which i dont
want to, and i want u to hide delete and edit button somewhere with some animation just to make things
little bit clearer and spacey and the press animation looks fine hold animation also looks fine but it
is repetitive because it have similar animation like the ponder panel, try make the animation little
bit different and unique but stay smooth and on theme"*

Measured as TIER 1 at 375 inside the real shell (lab `?shell&customers&admin`): the sideways move is
the boss's header — `CustomerManager.jsx:1134` puts the title and the three admin buttons in one
non-wrapping row, right edge 521, shell scrollWidth 521. Every earlier measurement mounted a T5, who
never sees those buttons. The hold today = sink 2 px + the folder icon's lamp lighting amber
(`theme.css:4426`) — the same idea as the ponder pad's `.pp-lamp`, hence "repetitive".

## Options and costs

| Board | A (recommended) | B | Cost of A | Cost of B |
|---|---|---|---|---|
| 1 top of page | the three admin tools fold behind ONE 44 px "ADMIN TOOLS ▾" row under the gold ADD NEW CUSTOMER bar; open = three 44 px rows | three tiles always visible (icon over 11 px name) | one extra tap for a monthly action | 64 px of every visit spent on monthly buttons |
| 2 DEL / EDIT | a 44×44 ⋯ key at the row's right; tap → a strip unfolds under the row (DEL danger tone, EDIT, MAP on shop cards), 200 ms | no key; hold the row half a second to unfold | one more control per row | nobody finds it; the phone's own long-press menu must be blocked on every row |
| 3 the hold | an amber charge line grows along the bottom edge while held (360 ms, background-size), lamp stays black | the icon well fills with amber from the bottom like a gauge (300 ms) | subtle on a short tap | the icon disappears into amber for a moment |

Both A/B on every board stop the sideways move (board 1) and survive Lite Mode (a transition on
`background-size` jumps to the full state, which still reads) and audit G30 (no shadow, no filter).

## Decision

**OPEN — waiting on Aldi.** Boards sent as `cust2-boards.png`; live hold links on his phone through
the lab's new `--host` (`http://192.168.1.132:4190/tools/ponder-lab.html?shell&customers&admin&look=hold-a`).

## Rejected on purpose

- Keeping the RE sweep + amber bar and only changing its timing — the sweep is the pad's arrival
  shape; timing does not make it a different thing. Flips if he says "keep the sweep".
- A swipe-to-reveal for DEL/EDIT (iOS style) — sideways motion on a screen he has twice said must
  not move sideways.
- Any pseudo-element for the charge line — `.kpm-hot::before` (sweep) and `::after` (ink bar) are
  both taken; the line is a third background layer.

Models applied: Opportunity Cost (board 1 — what every visit pays for a monthly button), Inversion
(board 2 B — how would a boss FAIL to find DEL? by never being told), Chesterton's Fence (the lamp is
kept, black, not deleted — it is the pad's signal and stays there), Second-Order (a hold-to-reveal
collides with the phone's own long-press menu on every row).
