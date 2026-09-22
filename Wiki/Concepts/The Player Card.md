---
title: The Player Card
description: The boss's EOD review as one card per salesman — the profile's head, a body that grows open with the handover one line per part — and the three stages it ships in.
type: concept
created: 2026-09-20
updated: 2026-09-21
confidence: high
checked: 2026-09-21
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
| B | the same head on the salesman's own Agent Profile (`PlayerCardHead`, one export, the profile's own `stats` feed it; the hero + OMSET box gone, the keys wrap at 44, one scroll) + tonight's XP on his Shift Closed block (`XpGain`: the signed nixie 0 → +N at 400 ms, the working rows after the roll) — [[2026-09-21_player-card-stage-b]] | shipped `c31af5e` (his "i like all the recommended option", 2026-09-21 08:35), ✅ TEST owed |
| C | the History Log stays folders | decided, nothing to build |
| D (the desk) | from lg the head is ONE row (the 128 photo, the name block, CLOSED TODAY + the light at the right — the review card only, `.pc-solo` untouched, the same row open or closed) and the open body is two columns 2:3 (revenue + products \| the handover + plate); a product row wraps on the desk instead of truncating. His board 1 = A "but make the Profile picture bigger as big as B minimum". 880 → 564 px open on his 1000 px screen. Brainstorm: [[Brainstorm/2026-09-22_pc-review-card-and-inventory-strip]] | shipped `20aac21`, ✅ TEST owed |

## The laws it kept

Palette (no blue, no green; gold never as text — `--accent-ink` on the ticks and the seal), G30
(the blur is a named audit exemption on the switch glow's own reasoning: the open state is carried
by the row height and the opacity, Lite Mode drops the blur and loses nothing), every key 44 px,
the dialog gate for the reason, every action reports (the toast names the parts approved and sent
back; the salesman gets a notification and a red line).

**A law it broke in light mode, found 2026-09-21 (kpm `084b05a`).** The diode line under CLOSED
TODAY ("2 stamps lost") and the DAMAGED GOODS / PITA CUKAI labels in the open body are the shared
`.kpm-led-line` from the store card. Its `.warn` / `.crit` states coloured the WORDS with
`--led-warn` (#FFB020) and `--led-crit` (#FF3B4B) — fixed instrument lights that do not flip with
the theme — so on the light card (#D2C9B4) the one line that flags a problem read at 1,5:1. The
14:25 "watched dark and light" missed it. Fix: one rule inside the LED block, `html.light
.kpm-led-line.crit, html.light .kpm-led-line.warn { color: var(--ink) }` — the diode keeps its
light, the words read at 11,4:1 (measured in the pane). The same rule covers the Journey Plan store
card and the salesman's "sent back" lines. Rule of thumb from it: an instrument colour is for the
LAMP, never for words on a themed surface — the token file already said so for `--led-ink`.

**Stage B's shape (kpm `c31af5e`, 2026-09-21).** The head is a PRESENTATIONAL export: `PlayerCardHead({ name,
photo, currentTier, nextTier, progressPercent, xp, gain, frame, closed, diode, diodeText, onTap, children })`.
The card computes its numbers from the group + ledger and passes them; the profile passes its own `stats`
(which already ran `careerXP` / the omset formula through `rankLadder`). One renderer, two data sources that
already existed — no ladder climbed twice, no second copy of the markup (a guard counts one `pc-head` in the
app). `onTap` is the head's one action: the card grows open, the profile opens the avatar customizer. The XP
gain on the salesman's panel is the nixie — his "standardize effect, one number instrument" — mounting at 0
and rolling to `dayXP` 400 ms after the block shows, the breakdown rows rising in at 1000 ms (one moment, one
animation; "norak" was two at once). Nothing on either screen loops.

## Related

- [[EOD Per-Part Verification]] — what each ✓ credits and what a ✕ writes.
- [[Aldi's Design Taste]] — "The player card" section: his words on the redesign, verbatim.
- [[Rank Config and Achievement Badges]] — the ladder (`rankLadder`) both screens climb.
