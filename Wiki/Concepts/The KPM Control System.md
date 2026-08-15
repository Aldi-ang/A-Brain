---
title: The KPM Control System
description: The reusable button/panel/record vocabulary in theme.css, the material-over-colour rule behind it, and the Lite-Mode contract every control must keep.
type: concept
created: 2026-08-13
updated: 2026-08-15
confidence: high
checked: 2026-08-15
tags: [pattern, design, components, kpm, settings]
---

# The KPM Control System

Built 2026-08-13 (commit `7166366`, audit group 30) because Aldi asked for a vocabulary, not
a screen: *"i want better presentation of all of this button and features to be more presentable,
since i will redesign the whole setting as well, make sure that the logic and theme and button
design and animation that we made here could be use for button in another place so design it
well"*. The Architect Terminal is its first customer. See [[Aldi's Design Taste]].

## The one idea: authority is graded by MATERIAL, not colour

| Material | Means | Class |
|---|---|---|
| hairline + mono | routine, reversible | `.kpm-btn`, `.kpm-rail` |
| gold plate | this module's primary act | `.kpm-btn.key`, `.kpm-rail.gold`, `.kpm-read.on` |
| diagonal stripe | irreversible, no undo | `.kpm-btn.hazard`, `.kpm-rail.hazard`, `.kpm-band.hazard` |

Colour alone failed twice on the screen this replaced: **Lite Mode strips it**, and it could not
tell a joke apart from an ownership transfer — the Disco Protocol button wore a filled red plate at
full width while Crown Transfer, which permanently hands over the product, wore a quiet outline.

## The vocabulary

`.kpm-band` (group caption — says what the group may DO) · `.kpm-mod` (one instrument) ·
`.kpm-rail` (name left, live state right) · `.kpm-read` (a printed state, so a module answers
before it is opened) · `.kpm-btn` (`.key` / `.hazard` / `.block`) · `.kpm-acts` (the action row —
buttons hug their word and settle right) · `.kpm-hold` (hold to confirm, see below) ·
`.kpm-field` (label printed above, never a placeholder) · `.kpm-switch` (both positions visible) ·
`.kpm-rec` (identity above, actions below — three word buttons do not fit side by side at 375px).

## The three rationing laws (2026-08-15) — all three are the SAME law

Aldi found all three by eye in one session, and each time the fix was to make a signal rarer.
**A signal that covers most of the surface is not a signal.** Checked by groups 30, 31, 33.

1. **SPACE.** *"i want u to give more space between features ... i thought it is the same
   components"*. Modules sat 0px apart sharing one 1px line, while each module's OWN head→shelf
   waist carried TWO stacked lines (`--line` + the brighter `--line-2`) also at 0px — the inner
   division was heavier than the outer one, so the eye grouped across module boundaries. The ladder
   now only ever grows outward: **12px between controls · 16px module padding · 20px module→module
   · 40px between groups**, and `.kpm-shelf.split` lost its duplicate border. ⚠️ **Never let an
   inner number reach an outer one** — at a tie the eye picks the wrong grouping and no border
   weight argues it back.
2. **AMBER.** *"too much yellow gold color ... few amber color and more black and white"*.
   `--gold`/`--accent-ink`/`--accent-edge` went **#D4AF37 → #D08A2E**, but the real fix was
   frequency: a live module carried FOUR amber marks (stripe, slot code, title rule, state chip).
   Now two. **Amber marks the STATE and the ACT, never the label.** `--tier-gold` is untouched —
   a gold RANK is a medal, not UI accent.
3. **RED.** *"u can add red but not this much especially on few buttons and panel"*. ~70% of a
   hazard module was red before a warning word was read: a `--danger-well` wash under
   `--hatch-danger`, above buttons that were also red-hatched, under a red-hatched band. Red now
   costs **5px of stripe, 2px of rule, a title and a chip**. ⚠️ The head must still be DISTINCT —
   that is his older *"too standardise"* call and it still stands; group 31 asserts both halves.

## Hold to confirm — `HoldButton.jsx`, the gate that is not a dialog

He pasted an "interactive hover button" (dot expands to fill → text slides → spinner → tick) and
asked for it on the confirming buttons. **The component as pasted has no confirmation in it** —
click runs straight to "Complete!" — so dropped onto a wipe, one tap destroys the database.

Built instead: **1.6s of deliberate pressure**, a `clip-path: inset()` sweep that snaps back on
early release, then the button reports its own result in place (`Wiping…` → `Products wiped`).
A dialog costs one more click and a thumb clicks by reflex; pressure cannot be done by accident.

- 🔴 **IT DOES NOT REPLACE `confirmAction`.** Both wipe dialogs still run behind it, and a check
  fails if either disappears. Trading a confirmation for an animation is Aldi's explicit call.
- **No new dependency.** The pasted version wanted `framer-motion` + `clsx` + `tailwind-merge` +
  TypeScript + shadcn; this repo is **JavaScript + Vite** and has none of them. `lucide-react` yes.
- `clip-path` + `background-color` only, so **Lite Mode keeps it — and must**: the fill is the only
  thing saying how much longer to press. This is the rare case where motion is function.
- ⚠️ `keyHeld` ref is load-bearing: **keydown REPEATS while a key is held**, and without the guard
  the timer restarts forever and the button reads as broken.
- ⚠️ `no-unsafe-finally` — never `return` from a `finally`; lint blocks it.

## The contract, checked by audit group 30

1. **No shadow, no blur, no filter, anywhere in the system.** `index.css` strips all four under
   `html.lite-mode`. The old tab put every separation into shadows, so on a cheap Android it
   collapsed into one undifferentiated column. Borders, background-color and gradients only.
2. **Every hover gated behind `@media (hover: hover) and (pointer: fine)`** — touch fires `:hover`
   on tap and keeps it, leaving a button stuck lit.
3. **44px minimum on every control**, buttons and inputs alike.
4. **One writer per setting.** A two-position switch with two copies of the write is how a setting
   saves locally and never reaches the database — see [[Silent Failure Disease]].
5. **A class that pins its own background must pin its own ink.** Added 2026-08-14 after a live
   bug, below. A token like `var(--ink)` is a promise about *the theme's* ground; the moment a
   class paints its own ground, that promise is void and the token becomes a coin flip between
   the two themes.

## The app shell: two layouts in one file — name the WIDTH before saying a screen is done

`src/components/BiohazardTheme.jsx` renders the navigation for the **phone and the desk from one
element**, split by Tailwind's `lg:` prefix. So "was this screen redesigned?" has three possible
answers, and the useful one is almost never yes or no.

**It has already cost a round.** On 2026-08-14 Aldi said *"i thought i have already redesign these
sidebar"* while looking at his PC. He was right: seven commits on 9–10 August rebuilt it —
`1984ad4` two columns and the grip that follows his thumb, `39dfd72` the scrub that lights every
mark, `5cc7d0f` fits without scrolling, `9d4a367` opens from the edge, `a528633` the three-second
hold, `6f706cb` the music pill, `6a3aa1b` the flash-before-styles fix. **Every one of them was the
PHONE.** The desk half still carried `lg:bg-white` + a white glow for the active tab and
`lg:text-gray-500` for the rest.

**The rule: answer with the width.** *"It was redesigned, at the other width"* is true far more
often than either single-word answer, and both single-word answers are wrong in a way he can see
on his own monitor. Applies to any `lg:`-prefixed component in this repo.

**Shell state as of 2026-08-14** (commits `371a165`, `20193bd`): the panel does not render at all
while signed out; the phone keeps its 176px two-column rail opened by the right-edge ribbon; the
**desk is an 88px strip of marks, always visible, never opened or closed** — his ask, *"so it
doesnt take so much space"*, against a Framer *Totem Side Bar* reference measuring ~70–98px wide
with 44px rows. Both widths share `.kpm-rail-mark` now. Words that do not fit an 88px column live
on the `title` tooltip (desk) and the peek plate (phone). The desk header's 76px left inset — which
cleared a menu button deleted weeks earlier — is gone; it was the *"spaces useless"* he pointed at.

## The invisible panel: a token on a ground the theme does not own (2026-08-14)

`.kpm-mod.gate` is the shell shared by the two locked screens — the Master Vault gate and the
Google sign-in door. It pins its own background, `rgba(4,3,2,.9)`, because both screens are
near-black **in both themes**. Its title, description and button, though, were plain
`.kpm-mod` parts still taking colour from `var(--ink)` / `var(--accent-ink)`.

In light mode `--ink` is **`#131211`** — near-black. Near-black ink on a near-black card is
**≈1.05:1**. So anyone who last left the app in light mode and then signed out was looking at a
card with **no readable text on it at all**: no title, no explanation, no visible button label.
It shipped, passed 357 audit checks, and was found the same night only because he asked for that
panel's colours to match the gate's — the fix for his ask *is* the fix for the bug.

**Why no check caught it:** every contrast check compared a token against the token ground it was
designed for. Nothing compared a token against a **literal** background declared in the same rule.
That is the shape to look for — `background:` a hex, `color:` a var, in one class.

Fixed by giving the class the gate card's literal hexes (`#f7e9c8` cream, `#8a7048` dim gold),
which is also what makes the two locked screens genuinely one screen. Group 15 now asserts it.

## Two traps found while building it

- **A checkable claim beats a paragraph, but a check can fail on its own comment.** Four checks in
  `integration.audit.mjs` went red because their explanatory comments *quoted* the old code they
  replaced (`hidden md:flex`, `<h2>`, "no box-shadow"). The file now has `code(src)`, which strips
  block comments before any structural test. Slicing a block by its header text lands *inside* that
  comment — strip first, then slice.
- **A count that drops is not automatically a regression.** Group 25 counts icon-only delete
  buttons; it went 18 → 17 because the tenant delete button now carries the word "Delete", and the
  rule says a worded button must not be marked or the label prints twice.

## The desk rail's two arrivals fought each other (2026-08-14, `9e975aa`)

The hover-expand desk rail shipped with the music mark, the face and the logout **visible around a
closed capsule and unclickable** — the marks went dark correctly and those three did not. The
difference: those three carry `boot-1/2/3`, the arrival animations, which run `forwards`, and **a
filled animation outranks a normal declaration in the cascade**, so the rail's `opacity: 0` never
reached them.

Fixed by switching the boot animation off on the desk (`.kpm-rail-pod > * { animation: none }`)
rather than with `!important` — the capsule unfurling *is* the arrival at that width, and two
entrances over each other was never the design. The phone keeps its own. Circle also went 72 → 56
inside the 64px column (*"button is too big"*), and the capsule now grows from `inset 4px` to
flush.

**Standing consequence for this system:** any control that carries an arrival animation cannot be
hidden by a plain `opacity`/`visibility` rule later. The full pattern, with the two other
same-day occurrences, is [[The Rule That Never Applied]] — read it before adding a rule that is
supposed to override an existing one.

## Shell state as of 2026-08-15 — the desk header and dock SHIPPED and Aldi approved

The whole app-shell round from 2026-08-13 → 08-15 closed out: desk dock (Label B, square 44px
cells, liquid glass, `--cap` on the grid), the header band reworked to match it (weaker glass on
purpose — blur 18 vs the dock's 30, because the dock is what you reach for and the header is what
you read), and the phone's duplicate-totem bug. **He has seen it and approved it** — *"it looks
fine"*, after one overlap fix (header's left margin had to clear the dock's *open* 112px pane, not
just its closed 60px circle — that number tracks `.kpm-rail-pod`'s width, change one and change
both). No frame was ever captured on this machine to verify by screenshot; his eyes are the only
check that has run on the appearance.

Also closed: the `Backlog/PC sidebar hover-expand and top panel redesign.md` open questions —
glass-vs-flat for the header (glass, weaker than the dock) and whether to keep the ghost watermark
(kept, but changed from the section's **name** to its **icon**, since it was printing 24px behind
the bell).

**A fourth CSS trap, different mechanism from [[The Rule That Never Applied]]:** `grid-auto-rows:
minmax(0, 1fr)` only resolves against a **definite** height on its container. Sizing the dock's pod
from `height: 100%` to `max-content` (needed for "follow how many buttons there are") made the
grid's height indefinite, and every `1fr` row silently collapsed to its icon (44×17 instead of
44×44.9) rather than erroring. Fix: give the grid its own definite `flex: 0 1 var(--cap, auto)`
rather than trusting the ancestor. Isolated-box-chain measurement is what found it; the two wrong
first guesses (max-content on the clipping PANEL instead of the visible POD; shipping unverified)
cost a duplicate bug report.

## Biometric / passkeys are Vercel-only, by design — not a Firebase problem

`App.jsx:1118` — `rp: { id: window.location.hostname }` — locks each WebAuthn passkey to the exact
hostname that created it. A passkey registered at the Vercel address reports "no key" at
`192.168.1.109`; nothing was lost or reset, it is a different origin. It can never work on the LAN
IP regardless: **WebAuthn rejects a bare IP as `rp.id`** and refuses to run on a page with a
certificate warning, which the self-signed LAN dev server always shows. **The LAN IP is PIN-only,
by design.** The 5-minute vault grace period is the same shape — `localStorage['kpm-vault-grace']`
is per-origin — so "biometric is gone" and "grace is gone" reported together are one fact, not two
bugs: a new address starts blank like a brand-new phone. See [[Master Vault Gate]].

Related: [[Off-Token Colour Migration Map]], [[Aldi's Design Taste]], [[Silent Failure Disease]],
[[The Rule That Never Applied]]

## Phase 6 closed — `SettingsView.jsx` is fully on the system (2026-08-15)

All four tabs plus the Command Center chrome and `PermissionMatrixEditor` are converted. Audit
groups **33–37**; the count went 419 → 508. New classes since the last entry: `.kpm-swatch`(+`.sm`),
`.kpm-swatch-input`, `.kpm-dot`, `.kpm-cmd`(+`.clearance.tier1`), `.kpm-nav`, `.kpm-matrix`,
`.kpm-toggle`, `.kpm-sw`, `.kpm-chips`, `.kpm-permlist`, `.kpm-permrow`, `.kpm-rank`,
`.kpm-field.kpm-authority`, `.kpm-pick`, `.kpm-picklist`.

**This is most of the light-mode job done in advance**, which was Aldi's own reasoning for the
order: one token name resolves to both themes, and no `dark:` variant was written anywhere in the
rework. Screens still on `dark:bg-slate-800` are the ones that have to be coloured twice.

### The switch, built from a video he recorded

He filmed a toggle he liked and asked for it in amber. Two rounds of *"it look so kaku"* (stiff)
before it landed, and the second round was a **bug, not a taste call**: the press animated `width`,
`height` and `margin-top` — three LAYOUT properties, so every frame re-ran layout and paint instead
of riding the compositor. `transform: scale(.92)` does the same job for free. A check now forbids
the layout properties coming back.

What actually makes it read as the video: the amber is uncovered by `clip-path: inset(0 100% 0 0)`
→ `inset(0 0 0 0)` so the colour ARRIVES WITH the knob rather than appearing all over the track at
once; and the knob overshoots (`cubic-bezier(.22, 1, .36, 1)`) instead of arriving and stopping
dead. The glow is `box-shadow`, so it is the one part not on the compositor — kept because Lite
Mode strips it automatically, on his *"yeah of course do use the shadow for normal mode"*.

### The authority picker — why a dropdown had to become a component

A native `<select>` draws its **open list in the operating system**, outside the page. No stylesheet
in this project has ever reached it, which is why those two dropdowns were the last controls on the
panel still looking foreign. Restyling was never possible; drawing it ourselves was the only route.

Drawing it yourself means owing back every behaviour the native control gave away: arrows, Home/End,
Enter, Space, Escape, Tab, type-ahead, and an announcement that matches what is saved. Focus stays
on the trigger (`role="combobox"` + `aria-activedescendant`) so there is one tab stop and nothing to
be trapped in — on the screen that decides who may edit what, that is not polish.

⚠️ **A popup inside `overflow-x: auto` is CLIPPED at the box's edge and scrolls away from its own
trigger.** The desktop matrix is exactly that box. Fix: portal to `<body>` + `position: fixed` from
a measured rect — and then it must close on any scroll or resize, because a fixed box cannot follow
a trigger that moved. This is a general shape, not a matrix quirk: any popup in this app that lives
inside a scroller needs the same treatment.

### Four CSS facts this phase paid for

- **A `<select>` sizes itself to its LONGEST OPTION.** Under `table-layout: fixed` the column cannot
  grow to fit it, so it silently spills over its neighbour. `width: 100%` alone loses to the
  intrinsic minimum — it needs `min-width: 0` too.
- **`min-width` floors never fix sideways scroll.** 800px then 560px both still overflowed;
  `table-layout: fixed` + `width: 100%` is what actually removed the drag.
- **Red-as-text is `--danger-ink`, never `--danger-text`.** Only the `-ink` tokens darken under
  `html.light`. Group 32 caught a clearance line that would have been **invisible in light mode**.
  See [[Off-Token Colour Migration Map]] — this is the single most likely light-mode defect class.
- **`focus-within` on a hover-expand dock holds it open after the pointer leaves**, and every
  control inside then sits under an invisible overlay. Half of his *"the sidebar will remain open
  and i cant press any button"* was that; the other half was a separate pointer-events cause.
