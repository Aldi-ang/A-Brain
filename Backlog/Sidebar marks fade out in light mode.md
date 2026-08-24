---
title: "Sidebar marks fade out in light mode — the rail has no ground of its own"
description: Aldi's screenshot 2026-08-24. The rail icons go from readable at the top to nearly invisible at the bottom in light mode. Traced, not fixed — he asked for it on the list, and the fix is his choice between two.
status: To Do — diagnosed, waiting on his pick
area: Theme / Sidebar
priority: High
created: 2026-08-24
updated: 2026-08-24
tags: [palette-law, light-mode, sidebar, contrast, aldi-reported]
---

# Sidebar marks fade out in light mode

**His report, 2026-08-24, with a screenshot:** *"as u can see on the light background the text on
the sidebar almost invisible maybe we should change the color or edit the transparancy"*.

## What the screenshot shows

The marks do not fail all at once — they **fade down the rail**. The top few (profile, grid, map,
route) read fine. Truck, boxes and store are weaker. Wallet, clipboard, people, gift, chart and
receipt are nearly gone. The music note, the avatar and the logout button at the very bottom are
clear again, because they sit on their own dark plates.

**A fade, not a failure, is the fingerprint of a varying ground under a single ink.**

## Cause, traced in the CSS — NOT yet measured in a browser

`.kpm-rail-pod::before` (`src/styles/theme.css`, ~L1749) is a **lens, not a surface**:

```css
background-color: transparent;
background-image: linear-gradient(180deg, rgba(72, 58, 42, .02), rgba(20, 16, 13, .10));
backdrop-filter: blur(30px) saturate(1.9) brightness(1.06);
```

Three things stack up:

1. **The tint is a fixed DARK wash and it does not flip with the theme.** Both stops are dark
   browns. Over a dark page that darkens the capsule nicely. Over a cream page it does almost
   nothing — 0.02 and 0.10 alpha — so in light mode the rail is essentially **whatever is behind
   it**.
2. **What is behind it is not one colour.** `index.css` puts one light source at top-left and lets
   the page fall away toward `--ground-lo` at bottom-right. So the ground under the rail is pale
   at the top and noticeably darker at the bottom — and the gradient above adds to that in the
   same direction.
3. **The ink is a single value** and, correctly for light mode, a dark one. Dark ink on a ground
   that keeps darkening downward is exactly the fade he photographed.

So the marks are not the wrong colour. **The rail has no ground of its own in light mode**, and no
single ink can survive a ground that changes underneath it.

## Why no check caught it

`contrast.selfcheck.mjs` has one rail pair — `['the ON plate against the rail', 'gold',
'glass-solid', 3]` — and it is measuring the wrong thing twice over:

- it checks the **ON plate**, a non-text indicator at a 3:1 floor, not the **icons**;
- it measures against `--glass-solid`, which is the **Lite Mode** fallback. In normal mode there is
  no solid ground at all, so the check has been grading a surface the user does not see.

**Whatever fix is chosen, the check has to start measuring the real ground**, or this comes back.

## 🔴 HIS CALL — two ways, and they are genuinely different

**A · Give the rail a ground of its own.** Make the tint a token pair that flips: a pale wash in
light mode instead of a dark one, so the capsule is always a predictable surface and the lens stops
showing the page's falloff through it. One token pair, one line. **Keeps the glass effect.**

**B · Drop the transparency in light mode.** Paint `--glass-solid` in light mode the way Lite Mode
already does, so the rail is a plain pale panel. **Simplest and cannot fail** — it is the fallback
that already exists — but light mode loses the liquid-glass look entirely.

Recommendation: **A**, because the glass is something he asked for by name and B throws it away to
fix a tint. But A keeps a lens over a moving ground, so it needs the contrast check pointed at the
real surface before it can be trusted.

Related: [[UI-Says-Yes-Server-Says-No Pattern]] — same shape, a check that passed while the screen
was wrong, because the check was measuring something the user never sees.
