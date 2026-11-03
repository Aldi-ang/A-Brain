---
title: The Player Card
description: The boss's EOD review as one card per salesman — the profile's head, a body that grows open with the handover one line per part — and the three stages it ships in.
type: concept
created: 2026-09-20
updated: 2026-11-03
confidence: high
checked: 2026-11-03
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
| D (the desk) | from lg the head is ONE row (the 128 photo, the name block, CLOSED TODAY + the light at the right — the review card only, `.pc-solo` untouched, the same row open or closed) and the open body is two columns 2:3 (revenue + products \| the handover + plate); a product row wraps on the desk instead of truncating. His board 1 = A "but make the Profile picture bigger as big as B minimum". 880 → 564 px open on his 1000 px screen. Brainstorm: [[Brainstorm/2026-09-22_pc-review-card-and-inventory-strip]] | shipped `20aac21`, CONFIRMED by Aldi 2026-09-22 10:03 ("test 1 approve, test 2 approve, test 3 approve") |

## The laws it kept

**REVENUE TONIGHT is the night's omset alone** (2026-09-22, his answer to the 09-20 question, kpm `f269b9c`): *"revenue bar
is only showing the revenue or omset that he receive that day for each person, target is only for regional team or global
target/ all the regional sales performance at once"*. The bar against his average verified night and the "his usual night"
line are gone; a per-person target does not exist in his business — a target belongs to a region or the whole company.

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

## The stamp holds, then the card folds (#5, 2026-11-03)

His words: *"snap my screen and gone right away"* (the VERIFIED stamp on the boss's review list).

**Root cause, two layers.** (1) The seal stage lived `EOD_SEAL_MS` = 900 ms while the seal only landed at
450 + 320 = 770 ms: ~130 ms on screen, then unmounted with no exit. (2) The card left before the stamp began:
`handleVerifyEOD` commits a `runTransaction` (the snapshot drops the report at once), then awaits `logAudit`,
and only then did PlayerCard call `onSealed`. A lab whose approve never removes the report cannot show (2) -
the old lab said so in a comment and nobody built the variant.

**Fix (`42dcd0e`).** PlayerCard calls `onHold()` right after the confirm, before any write; the list keeps the
night at its old index, built from the LIVE reports, so its lines tick as each write lands; `onSealed(allIn)`
afterwards (false = let go). Seal lands 770 ms, holds to 2270, fades by 2570; the card folds (grid rows
1fr -> 0fr, 300 ms) by 2870; stage = 2900. The night's last card folds INTO "No pending reports." (the box
unfolds on the same clock) so the phone's History Log glides. Lite: stamp at full strength for the stage, no
motion.

**Traps the sampler caught (each now pinned by a logicFixes check).** `.kpm-arrive > :nth-child(n)
{ animation-delay }` outranks a bare `.kpm-fold` - a 2nd child unfolded at 25 ms instead of 2570; write
`.kpm-arrive > .kpm-fold`. Padding floors a `0fr` grid track (the box stayed 66 px) - the grid child must be a
plain div. Lite's `animation: none` left the hidden box's list gap: a 12 px nudge.

**Proof.** Lab `?shell&eod&admin&live` + `Raw/2026-11-03-eod-stamp/stamp.mjs` (headless Chrome, real time, 40 ms
samples from rest + frozen moments). Phone: card 284 px through all writes, seal 1.0 for 1.56 s, card 284 -> 0
while the Late panel goes 450 -> 248 and lands on 248. Board: `board.png` there.

## Related

- [[EOD Per-Part Verification]] — what each ✓ credits and what a ✕ writes.
- [[Aldi's Design Taste]] — "The player card" section: his words on the redesign, verbatim.
- [[Rank Config and Achievement Badges]] — the ladder (`rankLadder`) both screens climb.
