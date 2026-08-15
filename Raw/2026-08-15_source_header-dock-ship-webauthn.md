---
title: "Raw source — header/dock shipped, phone totem fix, WebAuthn hostname lock (2026-08-15)"
description: Commit log + verbatim PROGRESS.md entries for the 2026-08-15 00:00–08:15 WIB block (session "CROWN PLAN PHASE 4 PART 9").
type: raw-source
created: 2026-08-15
tags: [raw, kpm, css, theme-css, app-shell, webauthn, biometric]
---

# Commit log (kpm-inventory-main, 2026-08-14 23:43 → 2026-08-15 08:15 WIB)

```
8939567 2026-08-15 08:15:27 +0700 PROGRESS: 21st.dev is a permanent no; biometric and grace are one per-origin fact
3f5d386 2026-08-15 08:11:56 +0700 PROGRESS: totem fix, biometric answer, and three of his questions closed
3a9e4c5 2026-08-15 08:08:49 +0700 The totem is the desk's collapsed circle; a phone was printing it as a duplicate
2b7d125 2026-08-15 02:14:40 +0700 Logout capsule expands inside the dock; the word had to shrink to allow it
1351ac5 2026-08-15 02:11:08 +0700 The 1fr rows needed a definite height, which max-content had taken away
54e796e 2026-08-15 02:07:03 +0700 Shrink the capsule, not the panel -- the previous attempt broke the dock
94542b5 2026-08-15 02:01:57 +0700 Dock height follows its buttons, so it stops reaching into the status strip
c39a820 2026-08-15 01:59:48 +0700 Header clears the OPEN dock, not just the closed circle
1c57a59 2026-08-15 01:54:55 +0700 Header: the band becomes the dock's twin, on a ground worth seeing through
dba279d 2026-08-15 01:16:44 +0700 Notes: the dock shipped -- and the one thing still unverified is how it looks
538ae9f 2026-08-15 01:16:25 +0700 Desk dock: Label B, square cells, liquid glass -- and the clip that hid every label
36fdae2 2026-08-14 23:43:11 +0700 Notes: the dock geometry is settled -- 100px, square 44px cells, even 4px
```

Session: "CROWN PLAN PHASE 4 PART 9" (`local_d1c49093-4d21-47d3-aab4-f2f2295255e9`), last
activity 2026-08-15 08:27 WIB.

# `.claude/PROGRESS.md` — the three 2026-08-15 log entries, verbatim

## 08:09 (KPM app session) — the phone was printing the active icon twice, and biometric was never a Firebase problem

**374/374, `src/` clean.** His screenshots: *"there is a duplicate logo of the active segment in
the top left of the sidebar panel i want u to delete that, because it is not aesthetic"*.

**`.kpm-rail-totem` had a rule for a desk that hovers (it BECOMES the collapsed circle) and a rule
for a desk that cannot (hidden) — and no rule at all for a phone, which matches neither media
query.** A bare `<span>` renders inline, so it drew the active tab's own icon a second time above
the grid. Hidden at file scope now; the hover-desk block still turns it back on because it is later
at equal specificity. **Deleting the span was the wrong fix** — it would have taken the PC's
collapsed circle with it.
Shape to remember: when a class is only ever styled inside media queries, ask what it looks like
OUTSIDE them, because that is a real screen too. Now a check.
That check failed on its first run: anchored on `@media (min-width: 1024px) {`, which occurs
several times, and `.search` returns the FIRST — the gate landed 28,000 characters early.
**Fourth time this week a regex anchor has been wrong. Count the occurrences, do not assume one.**

**His biometric question — answered, nothing to build.** *"why biometric keep resetting ... is
there any problem with the biometric data inside the firebase?"* No. The device list is in
Firestore and `firebase.js:37` hardcodes `appId`, so the path is identical on every site. The cause
is `App.jsx:1118` — `rp: { id: window.location.hostname }` — which locks each passkey to the exact
hostname it was created on. Registered at the Vercel address, opened at `192.168.1.109`: different
host, so the phone reports no key. It can never work there anyway: WebAuthn requires a real
*domain* (an IP is rejected outright) and refuses to run on a page with a certificate warning,
which is what his "Not Secure" address bar is. **Biometric is Vercel-only; the LAN IP is PIN-only,
by design.**

## 03:05 — the logout capsule stayed inside the dock, and the word had to shrink

His last open item: *"when it expand the animation go outside the sidebar box"*. `.kpm-expand`
grows to 136px and the pod is 100px, so the red slab crossed the capsule's edge. The rail now gets
its own narrower expansion, scoped.

Measured with the real face at 10px/.12em: at 96px wide there are 32px left for text, and
"LOG OUT" needs 52, "LOGOUT" 48, "EXIT" 26. So the word is the only variable that could give. The
full phrase moved to `title` and `aria-label`, where it costs no width. **373/373.**

## 02:35 — the dock is as tall as its buttons. Second attempt; the first broke it.

His two reports were ONE bug: *"i dont want bottom panel to collapse with the sidebar panel"* and
*"it looks better when the sidebar panel height follow how many buttons are there instead of
expanding all the way to the bottom of the screen"*.

**The actual mechanism, MEASURED in an isolated box chain (same nesting, 768px frame):**
`grid-auto-rows: minmax(0, 1fr)` resolves only against a DEFINITE height. While the pod was
`height: 100%` the grid inherited one and cells came out 44x44. The moment the pod became
`max-content` — required by "follow how many buttons" — the grid's height went indefinite, and
every `1fr` row collapsed to its icon:

| grid's flex | cell size | square? | pod |
|---|---|---|---|
| `flex: 1 1 0%` | 44 x 17 | no | 342px |
| `flex: 0 1 var(--cap)` | 44 x 44.9 | yes | 593px |

Fix: a definite flex-basis on the grid, `flex: 0 1 var(--cap, auto)`. `0 1` keeps it shrinkable.

Two wrong turns: first, `height: max-content` was put on `[data-kpm-rail]` (the PANEL — `position:
fixed` + `inset-y-0` + `overflow: hidden`), which asks a clipping box to measure the thing it
clips; only the POD needed to change. Second, the fix shipped without being seen, so he had to
report the same break twice.

# Aldi's decision, verbatim (2026-08-15)

> 21 dev is no

Closed. `/21st:21st-design-sync` must never run on this project — the palette stays private.
