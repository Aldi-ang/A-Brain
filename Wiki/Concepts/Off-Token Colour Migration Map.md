---
title: Off-Token Colour Migration Map
description: The substitution table for moving a KPM screen off hardcoded Tailwind colours onto the theme tokens, and the two checks that prove it landed.
type: concept
created: 2026-08-13
updated: 2026-08-13
confidence: high
checked: 2026-08-13
tags: [pattern, design, tokens, palette, kpm]
---

# Off-Token Colour Migration Map

The UI plan migrates screens one at a time off hardcoded Tailwind colours onto the CSS-variable
tokens in `src/styles/theme.css` (mapped to utility names in `tailwind.config.js`). Phase 5 — the
Architect Terminal — did the Landlord panel and the architect tab of `SettingsView.jsx`
(commit `b25c526`). Phase 6 repeats this across ~25 more files, so the mapping is written here
rather than re-derived each time.

## The table

| Old, hardcoded | Token | Why |
|---|---|---|
| `bg-black`, `bg-black/80` | `bg-panel` / `bg-raised` / `bg-sunk` / `bg-inset` | Four depths, not one black. Panel is the card, raised is a row on it, sunk/inset are wells. |
| `text-white` | `text-ink` | |
| `text-slate-400` | `text-ink-muted` (readable) or `text-ink-dim` (secondary) | slate IS the blue — see [[Aldi's Design Taste]]. |
| `border-slate-800`, `border-white/10` | `border-line` / `border-line-2` | |
| `blue-*` used as *accent* (armed, selected, primary) | `gold` + `gold-ink` on fills | Gold is the app's only accent. |
| `blue-*` used as *neutral* (an Edit button) | `bg-inset text-ink-muted border-line-2` | Most "blue" in this app was never an accent, just a button that needed a colour. |
| `emerald-*` / `green-*` for OK / ACTIVE | `text-verified`, or `gold` if it is a control | No green. `--verified` is a near-white, not a green. |
| `red-*` | `danger`, `danger-text`, `danger-well`, `danger-rail`, `danger-plate` + `danger-plate-ink` | Well = tinted background, text = readable red, plate = a filled red button. |
| `font-serif` | `font-display` | |

Both themes come free: the same token name resolves to different values under the light class,
so no `dark:` variant is written.

## What is NOT migrated

- **The printed nota.** It keeps KPM's company blue; the palette law stops at the print block.
- **`repeating-linear-gradient` textures.** They survive Lite Mode, so they stay as the house
  texture rather than being replaced by a shadow or a blur.
- **Other tabs in a file you are only partly migrating.** Scope the audit needle to the block you
  touched, or the check reports a failure that belongs to a later phase.

## The two checks that prove it

Both live in `src/config/integration.audit.mjs`, group 27, and both were run against the
pre-edit code and seen to FAIL before being kept:

1. **The palette regex** — no `(bg|text|border|from|to|via)-(blue|emerald|green|slate|sky|indigo|teal|cyan)-\d`
   in the migrated block. It must enumerate every family; a narrow list reports "clean" and reads
   as proof, which is how 39 off-token colours once shipped.
2. **The class survived the build** — `.bg-panel{` etc. present in the built CSS. Tailwind only
   emits a class it saw in source, so a typo paints nothing and looks like a transparent panel.

A restyle of a screen holding real controls also needs a **mount check per control** — the
architect tab's tenant switch, ownership transfer and data wipe have no other route in the app,
and losing one to a cosmetic edit is silent.

Related: [[Aldi's Design Taste]], [[Anti-Recurrence Check]], [[Ponytail Philosophy]]

## ⚠️ Read this first when light mode starts (added 2026-08-15)

**`-ink` tokens darken under `html.light`. `-text` tokens do not.** `--danger-ink` #E08C82 → #611A14
and `--accent-ink` #D08A2E → #6B4A05 when `html.light` is set; a `-text` token keeps its dark-theme
value and becomes **pale text on a pale ground — invisible, with nothing failing**. Group 32 already
caught one instance (a Tier-1 clearance line) before it shipped.

So the light-mode sweep is not mainly "pick light colours". It is:
1. every colour that reaches the eye as TEXT must come from an `-ink` token,
2. every hardcoded hex or Tailwind palette class is a second theme that has to be hand-written,
3. `--panel` / `--inset` / `--raised` / `--sunk` invert their brightness ORDER, so anything that
   assumed "inset is darker" reads inverted rather than broken — the quietest failure of the three.

The printed nota is **out of scope**: it keeps KPM company blue and prints on white either way.
