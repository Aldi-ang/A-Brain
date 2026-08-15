---
title: Looking at the App
description: How to actually see a KPM screen before claiming a visual fix — the theme lab harness, why the dev server cannot be opened directly, and the three ways the harness lied before it told the truth.
type: concept
created: 2026-08-16
updated: 2026-08-16
confidence: high
checked: 2026-08-16
tags: [pattern, verification, design, tooling, kpm]
---

# Looking at the App

**Every colour decision on KPM until 2026-08-16 was made blind.** Aldi's instruction, after three
"fixed" claims in a row that were not: *"if the browser is broken then fix it until u can see it"*,
and just before it, *"make sure u check the app first before moving on"*.

## Why the app could not be opened

Two independent blocks, and each one alone is enough:

1. **The dev server is HTTPS with a self-signed certificate**, and the in-app browser refuses it.
   ⚠️ **That is deliberate and must not be "fixed" to http** — his phone needs a secure context for
   `crypto.subtle`. See [[Secure Context Requirement]].
2. **The app needs a Google sign-in** before any screen renders at all.

So no frame of this app had ever been captured in this environment, and *"it should look right"*
was doing the work that looking should have done.

## The harness

    npm run build
    PORT=4181 node tools/theme-lab-server.mjs      # -> http://localhost:4181/

`tools/theme-lab.html` renders the control-system markup — glass header, Command Center head, tab
list, modules, switch, chips — against the **real built stylesheet**, over plain HTTP, with no
login. `tools/make-preview.mjs` inlines that stylesheet into `tools/theme-preview.html`, a single
file Aldi can double-click with no server at all.

⚠️ **The dev server is untouched and stays HTTPS.** This is a second, separate, read-only server
over `dist/`.

**Rebuild first.** The lab reads `dist/`; a stale build is a stale lab.

## The three ways it lied before it told the truth

All three produced *confident, plausible, wrong* readings. Guard against each:

1. **Colours read at t=0 of a transition return the PREVIOUS theme's values.** `.kpm-btn` has a
   120ms colour transition, so flipping the theme class and reading synchronously reports the old
   colour. This nearly shipped a false *"the buttons don't flip in dark mode"* bug.
   → **Inject `*{transition:none!important;animation:none!important}` before measuring.**
   ⚠️ This was **already written down** in [[Anti-Recurrence Check]] shape 5 and was hit anyway.
2. **Vite code-splits CSS.** "Newest file in `dist/assets`" was a 124-rule chunk with no tokens in
   it. A full sweep came back *"no failures, both themes"* — because it was measuring an
   **unstyled page**. The numbers were real; they were just not about this app.
   → The server picks the sheet that declares `--ground`, and the page **refuses to render**
   without it. **A lab that measures nothing must never look like a lab that found nothing.**
3. **A harness that invents markup measures the harness.** The FULL/LITE control was guessed as
   `.kpm-matrix two` with a `.on` class; it is `.kpm-switch` with `aria-pressed`. The guessed
   class matched no rule, so the gold ON-plate measured 1:1 against the panel.
   → **Copy the markup out of the real component. Never approximate it.**

## What measurement cannot replace

The lab settles ratios. It does **not** settle appearance, and both mattered the same night:

- a gold bloom at `.16` alpha passed every ratio and, amplified by the header's `saturate(1.5)`,
  read as a **yellow stain** across the top-left of the page;
- a scrollbar in three fixed browns was fully on-palette — **in one theme only**, so it was a dark
  bar down a cream page.

> **On-palette is not the whole claim. It has to be on the palette the page is currently wearing.**

And the inverse trap, which is the expensive one: Aldi reported two controls as too dark in the
same sentence. One was genuinely failing at 3,73:1; the other measured 5,48 and only *looked* wrong
because the page behind it was still black. **Fixing the second would have broken it.**
→ **When several things look wrong at once, find the shared ground before touching any of them.**

## Checks that freeze a value

Three audit checks failed in one day for one reason: each **pinned a hex literal**, so correcting
a colour broke the check that existed to protect that colour. Group 39 of the same audit file
already said it: *"a check that freezes a value a measurement later moves is just a second thing
to fix."*

**Assert the relationship, not the number** — "the light ink is darker than the dark ink", "this
token is a real pair" — and leave the ratios to `contrast.selfcheck.mjs`, which measures.

## Related

- [[Anti-Recurrence Check]] — shape 5 (measure vs look) and shape 7 (a check that freezes a value)
- [[Secure Context Requirement]] — why the dev server is HTTPS and must stay that way
- [[The KPM Control System]] — the classes the lab renders
- [[Aldi's Design Taste]] — *"live and playable beats a picture"*, the same instinct from his side
- Source: [[../../Raw/2026-08-16_source_light-ground-and-the-theme-lab|2026-08-16]]
