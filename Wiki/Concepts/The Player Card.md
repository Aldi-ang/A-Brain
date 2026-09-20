---
title: The Player Card
description: The boss's EOD review as one card per salesman — the profile's head, a body that grows open with the handover one line per part — and the three stages it ships in.
type: concept
created: 2026-09-20
updated: 2026-09-20
confidence: high
checked: 2026-09-20
tags: [kpm, eod, design, player-card, agent-profile]
---

# The Player Card

The hub for "player card". Decided 2026-09-20 05:35 (*"looks good for v2 lets use that"*) on the lab
mock `2832cea`; stage A shipped as kpm `a401463` (14:25). Code: `src/components/PlayerCard.jsx`,
`theme.css` THE PLAYER CARD, mounted by `src/EODReconciliationView.jsx` (one per `pendingByAgent`
group); the data path is [[EOD Per-Part Verification]].

## What it is

**The head** is the man as his Agent Profile draws him: the photo in the rank frame (RankBorder —
the frame he picked or his rank's), rank + title in the rank's colour, XP with tonight's **+N**
(`computeDayXP` of the CASH & STOCK report), the bar to the next rank, **CLOSED ?/?** stores on
today's route (`dayTargets`, the Journey Plan's own rule), the night's diode (lit only for a
problem: a short count, lost stamps, a part sent back).

**The body** grows open under the head (grid-rows 0fr → 1fr, 320 ms) and sharpens in from a blur
(6 px → 0, the second clip he sent): the revenue bar (tonight beside his usual verified night),
tonight's products, then **THE HANDOVER** — one line per part of every report he sent (cash,
transfer, stock back, damaged goods, pita cukai, the bounty when owed), each with ✓ and ✕. ✓
marks the line for the plate; ✕ asks the reason through the dialog gate. **APPROVE CHECKED** is the
one plate — gold, the measured red when a short line is checked or the plate only returns. When
the last part of a night is approved the scan sweeps and VERIFIED stamps over the list, and the
card leaves with the report.

## The stages

| stage | what | state |
|---|---|---|
| A | per-part verification on the data path + the card in the boss's review, the mock and the look deleted | shipped `a401463`, ✅ TEST owed |
| B | the same head on the salesman's own Agent Profile + the EXP gain animation on his EOD panel when a part is approved | after his test |
| C | the History Log stays folders | decided, nothing to build |

## The laws it kept

Palette (no blue, no green; gold never as text — `--accent-ink` on the ticks and the seal), G30
(the blur is a named audit exemption on the switch glow's own reasoning: the open state is carried
by the row height and the opacity, Lite Mode drops the blur and loses nothing), every key 44 px,
the dialog gate for the reason, every action reports (the toast names the parts approved and sent
back; the salesman gets a notification and a red line).

## Related

- [[EOD Per-Part Verification]] — what each ✓ credits and what a ✕ writes.
- [[Aldi's Design Taste]] — "The player card" section: his words on the redesign, verbatim.
- [[Rank Config and Achievement Badges]] — the ladder (`rankLadder`) both screens climb.
