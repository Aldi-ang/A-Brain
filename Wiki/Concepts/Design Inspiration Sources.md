---
title: Design Inspiration Sources
description: The five sites Aldi pulls component and animation ideas from, what each is actually good for, and the four house rules that decide whether an idea can survive inside KPM.
type: concept
created: 2026-08-23
updated: 2026-08-23
confidence: high
checked: 2026-08-23
tags: [design, components, animation, reference, aldi]
---

# Design Inspiration Sources

Aldi, 2026-08-23: *"i want alucard to save this few template website for himself to refer when we
need some new components inside our app, we can use this template as inspiration and we can copy
their design ourself like every new animation that i take and give u is from these website"*.

**This is where his animation and component ideas come from.** When he says "make it like the one
I showed you" or asks for a new interaction, look here first instead of inventing one.

## The five

| Site | Good for | Notes |
|---|---|---|
| [animmasterlib.dev](https://animmasterlib.dev/) | animation patterns, timing curves | idea source — read the motion, not the code |
| [ui.aceternity.com/components](https://ui.aceternity.com/components) | React + Tailwind components, heavy motion | closest to the KPM stack, so the most directly liftable |
| [framer.com/community/marketplace/components](https://www.framer.com/community/marketplace/components/) | interaction ideas | **Framer, not React** — never a copy-paste, always a rebuild. Much of it is paid |
| [21st.dev](https://21st.dev/?qt=hero&qs=downloads) | React/shadcn components, themes | **has a CLI — do not browse it by hand**, see below |
| [designprompts.dev](https://www.designprompts.dev/) | prompts that produce a look | use as a brief, not as output |

## 21st.dev is not a browsing job

The `21st` skills are installed (`21st-cli-use`, `21st-ai`, `21st-registry`) and this repo has a
`components.json`, so the CLI can search the catalog and print a component's real code:

```
npx @21st-dev/cli search <thing>
```

Prefer that over reading the website. Same source, no screenshots, no guessing at the markup.

## Four house rules before anything lands in KPM

Every one of these sites builds for a bright, shadow-heavy, motion-heavy marketing page. KPM is
none of those things. An idea has to clear all four:

1. **Repalette, always.** [[Where KPM Is Going]] holds the palette law — no blue, no green,
   slate + gold, and the receipt keeps company blue. Take the *shape and the motion*; the colours
   are never imported.
2. **It must survive Lite Mode.** `html.lite-mode *` strips every transition, animation, shadow
   and filter. A component whose whole idea IS the glow becomes a dead grey box. Anything lifted
   needs a deliberate still state that still reads. **A stopped animation looks like a bug** —
   his words.
3. **No `window.confirm` / `window.prompt`.** The dialog gate replaced all 69 of them. A lifted
   component that opens a native dialog is a regression, not a feature.
4. **Every action must report.** Silence is a bug in this app. A pretty control that does its work
   quietly is unfinished.

## Licensing, one line

Ideas are free; code is not always. Aceternity and 21st are made to be copied. Framer marketplace
components frequently are not. **Rebuild rather than paste** whenever the licence is unclear — the
rebuild is required by rule 1 anyway.

See also: [[Aldi's Design Taste]] · [[Where KPM Is Going]] · [[Looking at the App]]
