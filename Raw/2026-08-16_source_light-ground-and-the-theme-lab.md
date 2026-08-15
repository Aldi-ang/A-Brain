---
title: "Source — the light ground, and finally looking at the app (2026-08-16)"
description: Immutable capture of the 2026-08-16 KPM night session. Aldi's verbatim instructions on light mode, the page-ground root cause, three wrong claims made blind, and the browser harness built to stop that.
type: raw
created: 2026-08-16
tags: [raw, source, kpm, light-mode, design, verification]
---

# Source — 2026-08-16, the light ground and the theme lab

Immutable. Do not edit; correct in the Summary or the Concept pages instead.
Session: KPM app track, branch `phase0-solid-ground`, 21:00-ish → 03:30 WIB.

---

## What Aldi said, verbatim, in order

1. *"yea fix all of the color for light mode and the adjustment as well for the outside panel, we
   can start from the settingview"*
2. *"light mode or not, login background should not change like this should stay black"*
3. *"the background is still black on light mode, why are u rushing things that havent done"*
   — sent with a screenshot of Settings in light mode, modules cream, everything around them black.
4. *"this whole letter is too dark in light mode causing it hard to read sc1. reset indicator
   button and lock terminal also looks so dark in light mode, u better fix that sc2"*
5. *"make sure u check the app first before moving on"*
6. *"if the browser is broken then fix it until u can see it"*
7. *"yes use the light theme that we apply to the setting panel to its background as well"*
8. *"this task is finish until the background is light color and on theme with the panel that we
   work so far, im going to sleep first, dont stop working until u done achieving that"*

---

## The technical facts established

**The page ground was the last literal.** `body` in `src/index.css` pinned `background-color:
#0b0a09` plus a hardcoded three-layer gradient. It never changed theme. Fixed to
`--ground-base` / `-hi` / `-lo` / `--ground-glow` / `-glow-2`.

**The header and the dock are GLASS.** `.kpm-topbar` sets `background-color: transparent` and
blurs what is behind it; the dock (`.kpm-rail-pod`) is the same. So when Aldi reported that the
top bar and the sidebar were "still dark", neither was painting dark — both were faithfully
showing a black page through themselves. **Three surfaces wrong, one cause behind all three.**

**The app was carrying two light themes at once.** The modules Aldi has been approving are the
Duke cream (`#f6f1e4` · `#e6dfcd` · `#d8cdb6`). The app's own semantic surfaces were a colder,
darker steel (`--ground #B4B0A9` · `--panel #C6C2BB` · `--raised #D2CEC7`). One screen, two
families. Resolved on instruction 7 by moving the whole app ladder into the cream family:

| token | was | now |
|---|---|---|
| `--ground` | `#B4B0A9` | `#D2C9B4` |
| `--sunk` | `#9E9A93` | `#B9B0A0` |
| `--panel` | `#C6C2BB` | `#E1DAC8` |
| `--raised` | `#D2CEC7` | `#EDE7D8` |
| `--inset` | `#ADA9A2` | `#C6BDA9` |

Measured after, in a real browser: panel lifts off page **1,18** in light vs **1,05** in dark; gold
ON-plate stands off the panel **5,26** light / **6,61** dark; all 19 head/nav/module/switch/chip
text pairs pass in both themes. Dark values untouched.

**The vault gate is a THEME ISLAND.** Instruction 2. Its backdrop was `--duke-well-solid`, which
flips to cream. All seventeen tokens inside that gate flip, and the card is a literal near-black in
both themes — so in light every ink on it went near-black too. Fixed with `.kpm-dark-island`, a
class that re-declares the tokens back to their dark values for a whole subtree. Carried by the
vault gate and the two full-screen stop screens (Access Denied, Can't Verify You Yet).

**Frozen copies do not follow a corrected token.** `.kpm-chip` (the SYNCED pill and the clock) was
written in raw dark hexes. Its resting ink `#8b7256` is what `--duke-ink-3` *used to be* before
Aldi said *"fix the dark contrast"* and it moved to `#a08768`. The chip never got the correction.

**One genuine contrast failure, found only by measuring in a browser:** `--accent-ink` `#6B4A05`
measured **3,73:1** on the light ground — that is instruction 4's "lock terminal". Moved to
`#4F3603` (5,22 on ground, 4,82 on inset). *Reset Indicators was never broken* — 5,48 all along,
and only looked wrong because the page behind it was black.

**Other literals cleared the same night:** `#0f172a` Lite-Mode blur fallback (slate, forced with
`!important` onto every backdrop, present in BOTH `App.jsx` and `index.css` — the `index.css` one
is the one that ships); the scrollbar's three fixed browns; the selection ink; `Unranked`'s slate
default rank colour in two files.

---

## What went wrong on my side

**Three claims of "fixed" made without ever seeing the app.** No frame of this app had ever been
rendered in this environment: the dev server is HTTPS with a self-signed cert (deliberate — his
phone needs a secure context for `crypto.subtle`) and the in-app browser refuses it, and the app
needs a Google sign-in before any screen draws. Instruction 6 was the correction.

**The harness built to fix that lied three times before it told the truth:**
1. It read computed colours at t=0 of `.kpm-btn`'s 120ms colour transition and returned the
   *previous* theme's values — nearly shipping a false "the buttons don't flip in dark" bug.
   **This exact trap is already written down** in [[../Wiki/Concepts/Anti-Recurrence Check]] shape 5.
2. It picked "the newest CSS in `dist/assets`" and got a 124-rule code-split chunk with no tokens
   in it. A full sweep returned *"no failures, both themes"* — while measuring an unstyled page.
3. It invented markup: `.kpm-matrix two` with a `.on` class for the FULL/LITE control, which is
   actually `.kpm-switch` with `aria-pressed`. The guessed class matched no rule, so it measured a
   plain button and reported the gold ON-plate at 1:1.

**Three audit checks failed correctly in one day, all the same cause:** each pinned a HEX literal,
so correcting the colour broke the check that existed to protect it (group 32's `#6B4A05`, group
25's glow literal, group 25's scrollbar literals). Group 39 in the same file already carried this
lesson in its own words: *"a check that freezes a value a measurement later moves is just a second
thing to fix."*

**A needle matched its own documentation for the SEVENTH time** — a slate-hunting check found the
four slate hexes quoted inside the comment explaining that those four hexes had been removed.

---

## Commits (kpm-inventory, `phase0-solid-ground`)

`ca40e61` white film → veil tokens · `26615d7` the vault gate stops turning into paper ·
`63f8f14` accents follow their ground · `1e5caad` the ground walker + the real remaining size ·
`39ad446` the page stops being the last literal · `b08d8db` the theme lab + `--accent-ink` ·
`55291ee` the page joins the panels · `634e901` scrollbar, selection, the lit corner ·
`2fe365c` the standalone preview file.
Final state: **543/543 audit checks, contrast self-check passes both themes.**

## Still open

Ten screens have never been converted — they are built from `bg-slate-*` panels, not stray
accents. Measured table lives in `.claude/PROGRESS.md`. `MapMissionControl` is the largest (157
sites on unconverted panels). **Panels first, accents follow; one screen at a time.**
