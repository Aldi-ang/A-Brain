---
title: "Capybara merchant shipped, PC Sales Terminal prototyped"
date: 2026-08-03
type: run-log
tags: [kpm, merchantsalesview, merchant, desktop, sprites, sound]
---

# 2026-08-02 → 08-03 · merchant finished, PC terminal prototyped

## What shipped to the app

Twelve commits, `9fa53df` … `05b5dc5`. Merchant is **done** — Aldi signed off after five rounds.

- merchant is **ephemeral**: appears on deal commit only, speaks, leaves. Permanent left
  portrait panel deleted.
- art is **one pose** (open palm + thumbs up + teeth, 11,5 KB) with the app's own coin sprite
  spinning above the palm at 72,5%/30% — a position measured from the palm, not eyeballed
- **voice = four mumble blips**, 4,6 KB, one per 3 characters, capped at 8. Aldi's idea and
  the right one: not a language, so it can't sound wrong in English or Indonesian.
- talking sheet 8 frames, 57 KB — approved, explicitly not to be changed
- `Karton` added to the unit dropdown; **still untested against a real sale**
- desktop regression fixed: three columns collapsed to two, duplicate manifest deleted
- sound on the +/− steppers

Fixed in passing, both unrelated to the merchant and both real:
- **`coin-sprite.png` was never precached.** The coin marks money coming IN across the whole
  app and had never rendered offline.
- **Five verbatim Resident Evil 4 merchant lines were shipping** in the bundle. Removed.

## Lessons that cost the most to learn

1. **Generated sprite sheets arrive with the transparency checkerboard PAINTED IN.** Every
   sheet measured 0% transparent. Flood-fill from the border, never a colour key — the
   capybara's shirt is cream and his eye whites are pure white, and a key eats both.
2. **Prefer ONE image + CSS motion over a sprite sheet.** Every defect Aldi reported —
   drifting body, vanishing hat, cut hand, flashing coin — was a *between-frame* failure. A
   single drawing cannot have them. This is why the deal pose is one image now.
3. **Ground lines weld frames into one blob**; touching frames produce merged runs, and
   splitting at the midpoint slices a neighbour's hand off and leaves it floating.
4. **Anchor frame alignment on the HEAD, not the feet.** Legs can line up while the body
   above shifts.
5. **Verify built CSS with a literally-built needle** (`'.lg' + String.fromCharCode(92) + ':flex-wrap'`).
   Loose substring checks produced TWO false "verified" claims in one day.
6. **Tailwind breakpoints read the viewport, not the container.** The app's ~350px sidebar is
   invisible to `lg:`, which is how a three-column desktop ended up in ~1000px of space.
7. **Regenerating art is cheaper than repairing it.** The prompt with the checkerboard and
   ground-line bans produced a sheet needing 83 px of cleanup; the previous one needed 6.991.

## PC Sales Terminal — prototype, not yet integrated

`https://claude.ai/code/artifact/040c817e-dc38-4bfc-9d1a-a4b089898ae3`
Built by `<scratchpad>/build-pc.mjs` — **edit the script, never the generated HTML.**

Agreed method: **perfect the prototype, integrate into `MerchantSalesView.jsx` in one pass,
test everything at the end.** The production file stays untouched until then.

Design decisions so far:
- no drawer on desktop — the ledger is a permanent column. Dragging a sheet is a thumb
  solution; with a mouse it is an extra click before every check.
- wares auto-fill the width, same row anatomy as mobile, so it is one design at two sizes
- **mascot alcove**: he lives in the ledger column instead of visiting — idle, talk on
  interaction (throttled to once per 6s), deal on commit
- products **spin on hover, in pure CSS**. `ExamineModal` drives rotation with rAF writing
  React state; twenty of those would re-render the list 60×/s.
- **per-unit quantity boxes** — Aldi's requirement: a customer says "2 karton, 3 slop, 17
  bungkus" and the salesman should not do arithmetic. One line, four small boxes
  (Karton / Bal / Slop / Bks) and the converted Bks total at the end. Applies to phone too.
- ledger is vintage shredded parchment, to suit the Duke persona

## Still open

Bubble styling, `idle 3` not wired (that sheet does not survive the cleanup pipeline —
regenerate with a wide-gap instruction), double-coin report to re-check, and the whole
integration pass.

Resume file: `project_kpm_merchantsales_redesign_brief.md` in CC memory — it leads with the
open list. Kickoff prompts: `https://claude.ai/code/artifact/d0010fe2-2e88-44f8-8160-3c54d02d7035`
