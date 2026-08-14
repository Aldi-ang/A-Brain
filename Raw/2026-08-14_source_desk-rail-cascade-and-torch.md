---
title: "Source — desk rail cascade trap and the torch in the doorway (2026-08-14)"
description: Verbatim commit message 9e975aa and the .claude/PROGRESS.md 13:20 WIB section from commit 5d4f61f, captured as-is. Original source, never edit.
type: raw-source
created: 2026-08-14
updated: 2026-08-14
tags: [raw, kpm, theme-css, css-cascade, app-shell]
---

# Source captured 2026-08-14

Two commits in the `kpm-inventory` repo, branch `phase0-solid-ground`, 12:47 WIB. Captured
verbatim below; body text never edited.

---

## Commit `9e975aa` — "A filled animation beats a plain rule, which is why half the rail stayed lit"

> His screenshot: the music mark, the face and the logout sat visible around a
> closed capsule and could not be clicked — the worst of both. The nav went dark
> correctly and those three did not, and the difference between them is that
> they carry boot-1/2/3.
>
> Those are the arrival animations and they run `forwards`, and a filled
> animation outranks a normal declaration in the cascade. So `opacity: 0` never
> reached the three blocks that had one; it only reached the marks, which have
> none. The animation is switched off on the desk rather than fought with
> !important: the capsule unfurling is the arrival here, and two entrances
> playing over each other was never the design. The phone keeps its own.
>
> The circle was also too big at 72 — it read as a panel with one icon in it
> rather than a button. 56 inside a 64px column, and the capsule now grows from
> inset 4px to flush as it unfurls.
>
> And the left torch stood in the doorway at every real width, because the arch
> is positioned in percent PLUS a fixed 124px while the torch was in percent
> alone. They only clear each other past ~729px and the ledger column never is.
> Anchored to the arch's right edge now, so it cannot drift back in.
>
> Measured closed: rail 64, totem 56x56, brand/nav/bottom all opacity 0, no
> animation left running. Open: 292, all three blocks at 1, capsule 696 tall.

Files: `src/config/integration.audit.mjs` (+9/−4), `src/styles/theme.css` (+37/−8). 364/364 audit
checks passing.

---

## Commit `5d4f61f` — `.claude/PROGRESS.md`, the 13:20 WIB section

> ### ✅ 13:20 WIB — his four screenshot reports. Three fixed (`9e975aa`, 364/364), the fourth is a DECISION.
>
> 1. **Left torch stood in the doorway.** The arch is `left: 4%` **plus a fixed 124px**; the torch
>    was at `21%` of the same box. They only clear each other past ~729px and the ledger column
>    never is. Anchored to the arch's right edge in px now. ⚠️ Mixing % and px positioning in one
>    scene is the bug class, not this one instance.
> 2. **The hover label already exists** — he could not see it because of (3).
> 3. **🔑 Music, face and logout stayed visible around a CLOSED capsule and were not clickable.**
>    Cause: `boot-1/2/3` (the arrival animations) run `forwards`, and **a filled animation outranks
>    a normal declaration in the cascade**, so `opacity: 0` never reached the three blocks carrying
>    one. It reached the marks, which carry none — which is exactly the split he photographed.
>    Fixed by switching the boot animation off on the DESK (`.kpm-rail-pod > * { animation: none }`),
>    not with `!important`: the capsule unfurling is the arrival here. Phone untouched.
>    Circle also went 72 → **56 inside a 64px column** — *"button is too big"*.
> 4. **HIS DESIGN QUESTION IS OPEN, do not answer it for him.** *"the sidebar have it own space but
>    it just blank while its closed ... so much item on the left while the right it is just one big
>    panel ... i want ... more balance and more organic"*. The Totem sheet he pasted says **"set it
>    to Fixed, and pin to your chosen edge"** — a floating dock reserves NO column, which is the
>    blank strip he is looking at. Three options were put to him; **the answer decides the work.**
>
> ⚠️ **The seven skills he named do not exist** (`/emil-design-eng`, `/design:design-critique`,
> `/design`, `/ui-styling`, `/ui-ux-pro-max`, `/make-interfaces-feel-better`, `/impeccable`).
> `ListSkills` and `SuggestSkills` both come back empty for design/UI. He asked to "add them to this
> workspace" — **they cannot be installed from here.** The nearest real thing is a project skill
> written into this repo, and he has not said yes to that yet.

**Ingest note (not part of the source):** that last claim is environment-dependent, not a
project fact. In the 2026-08-14 scheduled-ingest session, six of those seven names *were* listed
as available skills. See the run log for 2026-08-14.
