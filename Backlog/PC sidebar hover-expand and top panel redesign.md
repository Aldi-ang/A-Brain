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

> 🔴 **REOPENED 2026-08-14 07:50 — the built version is the WRONG FORMAT. His words, verbatim:**
> *"wrong format for the sidebar, what i want is a sidebar that shrink in to 1 button big and when
> it hover it opens all the way to show all the button , including the music button, when we hover
> it will show the name of that features , i want the initial position for the music player also
> the same with that, i want background for the sidebar to be transparant but blurred, look at the
> vidieo this is the exact sidebar i want for the pc version, it is liquid expensive looks"*.
>
> **What is wrong with what shipped**, point by point, so the next session does not re-derive it:
> 1. **Collapsed must be ONE BUTTON WIDE.** It ships as two columns at rest — that came from his
>    earlier *"2 colomn"* ask, which he has now superseded for the desk. One column, one button.
> 2. **The music button lives in that collapsed strip**, in the same shape as every other mark
>    ("i want the initial position for the music player also the same with that").
> 3. **Opening shows every button "all the way"**, with each feature's NAME beside it. The word
>    part is built; the geometry around it is not.
> 4. **The panel must be TRANSPARENT AND BLURRED.** It currently ships near-opaque —
>    `bg-[#0b0a09]/97 lg:bg-black/95` with `backdrop-blur-xl` behind it, so the blur is invisible.
>    Real transparency plus the blur is what he means by *"liquid expensive looks"*.
>    ⚠️ Lite Mode strips `backdrop-filter` — that mode needs a solid fallback, not a see-through
>    panel over the app.
>
> 🎥 **THE REFERENCE IS A VIDEO, and it is the spec**: `Assets/references/2026-08-14_pc-sidebar-liquid-reference.mp4`
> (copied out of `Microsoft.ScreenSketch/TempState/Recordings/`, which Windows clears — the
> original path will not survive). **Watch it before writing any CSS.**
>
> ✅ **Still correct from the last round, do not rebuild:** the hover word (`.kpm-rail-word`), the
> `margin-right: -132px` trick so opening never reflows the main UI, the music player wearing the
> phone's shape, and the `hover:hover`/`pointer:fine` gate.

> ✅ **UPDATE 2026-08-14 07:35 — items 1, 2 and 3 below are BUILT** (`d248017`), and so is the
> profile-picture bug at the foot of this page. He overruled the parking the same morning:
> *"why does the sidebar not shrinking like i ask before?"*. **Only §4, the top panel, is still
> open** — that is the whole of this item now. The rest is kept below because it records what was
> decided and why, and the hover rail's one non-obvious number is
> **`margin-right: -132px`**: the strip paints 236px and occupies 104px, so opening it never
> reflows the main UI.

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
