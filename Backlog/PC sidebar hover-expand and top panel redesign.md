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

## 🔴 HIS OPEN DECISION — the blank column (2026-08-14, after `9e975aa`)

**Do not answer this for him; the answer decides the work.** His words: *"the sidebar have it own
space but it just blank while its closed ... so much item on the left while the right it is just
one big panel ... i want ... more balance and more organic"*.

The rail paints 272px and **occupies 72px**, so opening it never moves the main UI — but that 72px
sits empty while closed, which is the strip he is looking at. The Totem sheet he pasted says
*"set it to Fixed, and pin to your chosen edge"* — a floating dock reserves **no** column at all.
Three options were put to him; nothing proceeds until he picks one.

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

### ✅ ALSO SHIPPED — the marks got their space back, `f6c5dbe`, 2026-08-14

His last open item: *"button for each should be spacier, so that all the button can be put inside
the sidebar without some of them exiting the sidebar space"*. **Measured before believing it** —
1366x768, all seventeen marks: each plate was **21.8px tall around a 27px icon**. The glyph was
physically bigger than its own button. He was not describing a preference, he was describing a
defect.

**Two of his own rules collided here, and neither was broken.** *"there is still scroll feature
inside sidebar, i dont want that"* forbids a scrollbar, and a `min-height` floor is worse still —
the nav is `overflow-hidden`, so a mark pushed past the bottom becomes a tab that cannot be
reached at all. With no floor and no scroll, a taller mark can only come from something else in
the column giving height up. Three things were spending it: a **4px gap in place of 8px** (sixteen
gaps ate a quarter of the column), **4px of grid padding** on a strip 64px wide, and a **foot that
had grown to 221px** of the 744px available. After: **29.7px rows, 4.8px of plate around every
icon**, no scrollbar, nothing clipped. Degrades sanely too — 22.2px at 1280x640, still no clipping.

**A SECOND COLUMN IS NOT AVAILABLE HERE, and this is worth knowing before someone proposes it
again.** The pod stays **64px wide by design**; the extra 228px of the open 292px panel is the room
the **label pills slide into**. Two columns would be 21px each. If the dock ever needs two columns,
the pill has to stop being anchored to the mark first.

**The measurement turned up a silent trap on the way past:** the longest tab name,
"Receivables & Consignment", draws a 201px pill ending at x=271 — **21px short of the panel edge**,
and the panel clips. A longer name is sliced off with no other symptom. Now pinned by a check that
caps tab names at 27 characters.

Both facts are audit checks, not prose — see `integration.audit.mjs`, group 25, the two checks
following *"the rail never scrolls"*.
