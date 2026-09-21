---
title: The player card, stage B — the head on the Agent Profile, and the XP gain on the salesman's EOD panel
type: brainstorm
created: 2026-09-21
status: DECIDED 2026-09-21 08:35 — "i like all the recommended option" (board 1 = A, board 2 = B); shipped as kpm c31af5e, ✅ TEST owed
tags: [kpm, phone, player-card, agent-profile, eod, design, motion]
---

# The player card, stage B (2026-09-21 07:55–08:15)

## The problem, in his words

Stage A of [[The Player Card]] shipped (`a401463`) and its ✅ TEST is his. He set stage B himself on
2026-09-20 04:15: *"the three front number maybe we can put the EXP gain statistic animation on the agent
EOD panel after approval … the picture should be the same with the agent profile picture inside agent
profile"* and 04:55: *"add PLUS on the increase in EXP and also the Recent rank and the progression from
the agent profile"*. Two jobs: (1) the card's HEAD on the salesman's own Agent Profile — the Backlog's
Job 4 (the profile overflows sideways at 375) folds into it; (2) the XP gain animation on the salesman's
EOD panel when the boss approves. His standing rules that bind both: the rank frame / rank / XP come from
the profile's own code (one ladder, `rankLadder`); *"too much of those blinking light"* (2026-09-18) — a
light blinks only while something happens; *"standardize effect"* — one number instrument, the nixie;
*"norak"* (2026-09-03) — one moment gets one animation.

## What the lab measured first (`?shell&profile`, `&admin`, 375, kpm lab commit of 2026-09-21)

| tier | finding |
|---|---|
| boss | the key row (☰ RANK CONFIG AVATAR LEADERBOARD) floats `absolute top-6 left-6` in ONE row, 430 px wide: LEADERBOARD is cut and the profile's own scroller slides **95 px sideways** (scrollWidth 454 / clientWidth 359) |
| both | the hero block `min-w-[350px]` sits at left 32 → right 382, 7 px past the edge, clipped by `overflow-hidden` — silent |
| both | the profile scrolls inside its own `h-screen overflow-y-auto` box NESTED in the shell's scroller — a double scroll on the phone (the shell moves 16 px, then the inner box) |
| both | 20 labels at 10 px (ID, rank, next phase, weekday letters, badge names); the chart chips 1W/1M/1Y are 24 px tall, the badge category chips 28 px |
| both | « THE HUSTLER » `animate-pulse` forever; the LEADERBOARD trophy `animate-bounce-slow` forever; the XP bar carries a box-shadow glow (G30) |
| both | the Backlog's two containers (`xl:flex-row gap-8` "87 px over", `justify-between mb-4` "78 px over") now measure 311 and 262 wide — inside 375; that entry is stale |

## Board 1 — the head on the profile (`board-prof.png`, 4 frames)

| option | what it is | costs |
|---|---|---|
| TODAY | the frames above, boss and salesman | the sideways slide, 600 px before a number |
| **A (recommended)** | the key row wraps in 44 px rows (the boss gets GRANT AWARD as a fifth key), then the SAME closed card head the boss sees in HQ Verification (`PlayerCardHead` exported from PlayerCard.jsx — no second copy), one identity line under it (tier · ID · region · days active); the photo + stars + pills + name block AND the OMSET 7 HARI box go — the head carries the XP, the bar, the rank and the next rank; the page scrolls as one; nothing pulses | the stars (roleStars), the ACTIVE pill and the corporate tag shrink to one 11 px line; the avatar tap (camera badge) must move onto the head's photo; the 10 px labels elsewhere on the page are a separate floor job |
| B | the same head, the OMSET 7 HARI box kept under it | the XP, the bar and the rank appear twice, 120 px apart |

Lab: `?shell&profile&head&look=prof-a` / `prof-b`, `&admin` for the boss (mock: `tools/lab-stageb.jsx` ProfileHeadMock, looks in `tools/lab-looks.js`).

## Board 2 — the XP gain on the salesman's EOD panel (`board-xp.png`, 3 frames)

The moment: the boss's approval lands, the salesman's CASH & STOCK card flips to Shift Closed, and the
verified report carries `dayXP` + `xpBreakdown` (`handleVerifyEOD` writes them). All three use the ONE
number instrument — the signed NixieCount rolling 0 → +51, 400 ms after the block shows; nothing blinks.

| option | what it is | costs |
|---|---|---|
| A | the nixie +51, then the bar under it fills to the new place on the ladder, SILVER · THE HUSTLER · 14.284 XP TO GOLD | says the gain, not where it came from |
| **B (recommended)** | the nixie +51; when the digits settle, the working prints one row at a time (collected Rp 1.675.000 → +33 · day closed → +10 · pita cukai clean → +5 · route 3 stores → +3), the rows rising in AFTER the roll, never with it | ~80 px taller; no ladder bar (can be added under the rows if he wants both) |
| C | the nixie +51 beside the ladder figure 5.614 → 5.665 XP, the bar, the rank line | the arrow figure and the nixie say +51 twice |

Lab: `?shell&eod&verified&xp=a|b|c` (+ `&look=slow` — the nixie at a quarter speed); the phone opens it at
the address `preview_logs` prints for ponder-lab (192.168.1.141:4190 on 2026-09-21).

## Decision

**DECIDED 2026-09-21 08:35** — his words: *"i like all the recommended option"* → board 1 = A, board 2 = B.
Shipped as kpm `c31af5e` the same hour: `PlayerCardHead` exported from PlayerCard.jsx and mounted in
AgentProfileView.jsx (the hero + the OMSET box gone, GRANT AWARD in the key row, the row static and wrapping
at 44 px on the phone, the profile's own scroller lg-only + `min-w-0`, no bounce, no pulse, App.jsx passes
`customers` for CLOSED ?/?); `XpGain` in EODReconciliationView.jsx (the signed nixie mounting at 0, the total
at 400 ms, the working rows at 1000 ms, 90 ms apart). Five guards red-then-green (1701/1701), audit 722/722.
Found while shipping: the profile's flex column had `min-width: auto`, so its min-content (372 as the boss)
pushed it 13 px past the 359 shell under `overflow-hidden` — `min-w-0`, the classic flex fix. ✅ TEST owed.

## Rejected on purpose

- A second copy of the head drawn inside AgentProfileView — his rule from stage A: the profile is the face,
  other screens borrow it; the export is `PlayerCardHead`, one source.
- A count-up drawn with CSS `@property` or a plain number ticking — a second kind of moving number; he
  refused "one more of that type" on 2026-09-18 (the LED window). The nixie is the instrument.
- Any pulse or lamp on the XP block — his "too much of those blinking light".
- The roll and the rows at the same instant — "norak" (2026-09-03): one moment, one animation; B sequences them.
- Rebuilding the profile's whole page (the 10 px floor, the chart chips, the nested scroller) inside this
  job — only the parts the head touches are in A; the floor is its own job after.

## Models applied

Opportunity Cost (B on board 1 keeps the box and pays in duplication, not in code); Second-Order Thinking
(removing the hero removes the stars, the ACTIVE pill and the camera badge — each one got a home: the
identity line, the head's photo); Inversion on the motion (what would make it norak: two motions at one
instant, a looping light — both designed out); Chesterton's Fence on the OMSET box (it exists because the
profile had no head; the head is the box's replacement, not a duplicate).

## Related

- [[The Player Card]] · [[EOD Per-Part Verification]] · [[Aldi's Design Taste]] ("The player card", "Too much of
  those blinking light", "Standardize effect", "Norak")
- Raw: `Raw/2026-09-21-stageb-boards/` (board-prof.png, board-xp.png, shoot.mjs)
