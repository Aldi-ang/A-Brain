---
title: PC sidebar hover-expand and top panel redesign
description: Four items Aldi raised on 2026-08-14 that were deliberately not built that morning — the desk rail shrinking and expanding on hover, a hover label, the music player's phone shape on the desk, and the whole top panel's background and UI.
status: Open
area: App shell / BiohazardTheme
priority: High
created: 2026-08-14
updated: 2026-08-14
---

# PC sidebar hover-expand and top panel redesign

Raised 2026-08-14 ~07:00 in one message of eight items. Four were built the same morning
(`20193bd`, `cedd779`): the desk became a strip, then two columns at 144px so the logout button
stopped being clipped. **These four were not**, and they were not started because they are a design
round and the preview pane refused `https://localhost:5173` all session, so nothing could be seen.

⚠️ **Read [[Anti-Recurrence Check]] §"rebuilding the second layout" before touching any of this.**
The phone half of this same component already answers most of these questions, and that is exactly
the mistake this list came out of.

## 1. The rail shrinks, and expands on hover — his sc4 / sc5

His words: *"sidebar should shrink and opens up when hovered not fix like that to add more space
for the main UI instead"*. Two reference screenshots: **collapsed** is a narrow strip of round icon
buttons in a rounded container; **expanded** shows the same icons with their words beside them,
still in one rounded pill.

Open questions: does the collapsed state keep the two columns (item 3 below) and go one column when
expanded, or stay two? What is the collapsed width? Does the expansion overlay the main UI or push
it? **Ask before building — he judges motion by feeling it, so a live prototype beats a mockup.**

Constraint that already bit once: the panel is `overflow-hidden`, and `.kpm-expand` (the logout)
grows to **118px** on hover. Any collapsed width under ~136px clips it.

## 2. A label box on hover, replacing the `title` tooltip

His words: *"button is too close and i want u to add textbox when we hover it"*. Two things there —
spacing between marks, and a real label plate rather than the browser's native tooltip.

**The phone already has this**: `kpm-rail-say`, the plate that follows the finger. It is positioned
`right: RAIL_W + 10`, so a desk version needs the mirrored side, since the desk panel is on the
left. Port it; do not invent a second tooltip.

## 3. The music player in its phone shape on the desk

His words: *"change the music player to look like what we have on phones"*. On the phone it is a
portalled pill at the top of the screen (`6f706cb`); on the desk it is still the older in-rail
player, which is what he screenshotted. `src/MusicPlayer.jsx` — note the import is from the repo
root, not `components/`.

## 4. The top panel — background and UI, not just its buttons

His words: *"we need to redesign the whole background and UI for this top panel, we only did the
buttons yesterday add this to task list"*. The header row: SYSTEM ACTIVE, the screen title and its
rule, the ghost watermark, the synced pill, the theme switch, the bell, the date and clock. The
chips were standardised; the band they sit on was not. **This is its own session.**

## Also unresolved from the same message

**The profile picture.** His words: *"profile picture should follow the user agent profile
picture"*. The code already does — `App.jsx:3502` passes
`motorists.find(m => m.id === agentProfileId)?.profileImage`, and the shell falls back to the Google
account photo only when that is null. So either his Agent Profile has no image set, or the image he
is seeing IS the one set there. **Ask him to check Agent Profile before changing any code** — the
wiring is not obviously wrong.
