---
title: PC sidebar (shipped) and top panel redesign
description: The last open item from Aldi's 2026-08-14 list of eight — the header band's whole background and UI, not just the chips on it. The PC sidebar half of this note shipped as 16c8ff9 and is now a short record at the foot.
status: To Do
area: App shell / BiohazardTheme
priority: High
created: 2026-08-14
updated: 2026-08-14
---

# Top panel — background and UI

**His words:** *"we need to redesign the whole background and UI for this top panel, we only did
the buttons yesterday add this to task list"*.

The header row is: SYSTEM ACTIVE and its dot, the screen title with its rule, the ghost watermark
behind it, the synced pill, the theme switch, the notification bell, the date and the clock. The
**chips were standardised** in an earlier round — they all wear `.kpm-chip` now, one plate, one
size, one hover, one press. **The band they sit on was never touched.** That band is this item.

`BiohazardTheme.jsx`, the `.kpm-topbar` block (search `kpm-topbar`), plus its rules in
`theme.css`. **This is its own session** — it is a design round, and he judges these by looking.

⚠️ Before writing any CSS, read [[../Wiki/Concepts/Aldi's Design Taste]] and
[[../Wiki/Concepts/Anti-Recurrence Check]]. If he sends a screen recording, **turn it into frames
first** (`ffmpeg -i clip.mp4 -vf fps=1 f%02d.png`) — that is how the sidebar round finally landed,
after two sessions of guessing from prose.

## Open questions he has not answered

- The desk sidebar is glass now (translucent, blurred, floating capsule). Should the top band
  match it — a floating glass bar — or stay a flat band with an edge?
- The ghost watermark of the tab name: keep, or is it part of what he means by "the whole
  background"?

---

## ✅ SHIPPED — the PC sidebar, `16c8ff9`, 2026-08-14

Kept here only as the record of what it became; the reasoning lives in
[[../Wiki/Log]] (2026-08-14, later) and in the comments in `theme.css`.

**Three states**, from his video (`Assets/references/2026-08-14_pc-sidebar-liquid-reference.mp4`):
one circle at rest, a full-height translucent capsule on hover, and the hovered mark's own name
printed beside the capsule on the app's background. His words: *"a sidebar that shrink in to 1
button big and when it hover it opens all the way to show all the button, including the music
button, when we hover it will show the name of that features … i want background for the sidebar
to be transparant but blurred … it is liquid expensive looks"*.

The numbers that must stay in step: the rail **paints 272px and occupies 72px**
(`margin-right: -200px`), so opening it never moves the main UI. `.kpm-rail-pod` is the capsule and
the panel is the window — one element cannot both clip and be clipped. The glass is on the pod's
`::before` so the shape can grow without moving its contents. On a phone the pod is
`display: contents` and the signed-off phone layout is untouched.

Also in that commit: the music player lost its desk accordion (the pill answers both widths now),
and the collapsed circle carries the **active tab's own mark**, so the collapsed rail still says
where you are.

Two audit checks pin it, including the one that matters most — the capsule must still paint on a
desk with no hover at all, and in Lite Mode, because the panel no longer paints anything itself.
