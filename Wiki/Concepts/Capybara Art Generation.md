---
title: Capybara Art Generation
description: How new poses and outfits of Aldi's capybara are made without changing the character - which generator kept his face and body, which routes are closed, and how a pose gets into the presentation.
type: concept
created: 2026-10-22
updated: 2026-10-22
confidence: medium
checked: 2026-10-22
tags: [capybara, art, image-generation, presentation, tools]
---

# Capybara Art Generation

His ask, 2026-10-22: *"can u generate new expression for that capybara for overall use, make sure their body and face is the same just different gesture, because all the gesture is the same, u can use higgsfiel or some other provider to help u generate resources for the capybara"* and, for slide 20, *"im expecting different clothes as well for the capybara i want u to generate it, u can use other sources"*.

## What worked

**FLUX.1 Kontext [dev]** on its official Hugging Face Space (`black-forest-labs/FLUX.1-Kontext-Dev`), called from Node with `@gradio/client`. The reference is his `public/sprites/merchant-deal.png` (200 px, transparent), first put on white at 1024 px. The prompt says what changes ("wave hello with one hand raised") and lists everything that must stay: face, fur colour, fedora, brown coat, fingerless gloves, cream shirt, gold-buckle belt, shoulder bag, proportions, line art, plain white background. All three results kept the character exactly; only the gesture changed (~33 s each).

Cut-out: there are no Python or image libraries on the PC, so headless Chrome's canvas does it. A flood fill from the edges clears near-white, then the figure is cropped and stood on the bottom of a 240 px square. Tolerance 40 is right for most poses. A pose with a grey floor shadow needs ~75, because the white between the legs is closed in by the shadow. A white sheet of paper inside the figure survives because the fill never reaches it.

Tools: kpm `.claude/presentation/capy-poses/tools/` (`gen.mjs`, `img.mjs`, `retry.sh`, `swap.mjs`). Poses: `capy-poses/raw/` and `capy-poses/cut/`.

## Routes that are closed (2026-10-22)

| Route | Result |
|---|---|
| 9router (`localhost:20128`) | no image-output model at all; its `/v1` also wants an API key now |
| Hugging Face Space, anonymous | 3 images, then *"You have exceeded your ZeroGPU runs limit"*. A free account token (`HF_TOKEN`) gives his own quota; `gen.mjs` uses it when set |
| Pollinations | lists Kontext Pro / gpt-image as not paid-only, but `/v1/images/edits` returns 401 without a key |
| Higgsfield (his pick) | needs his login; no Chrome extension was connected, and Claude does not sign in or create accounts |

## How a pose reaches the presentation

The page carries the poses as data URIs between `/*CYI*/` and `/*CYI-END*/`. `swap.mjs` rebuilds that block from `capy-poses/cut/`. A pose that does not exist yet falls back to one that does (run -> point, stamp -> deal, receive -> wave, workers -> merchant with a carton on the head), and `CYI_HAS` says which poses are real, so the page never breaks while art is missing.

## Still to make

Worker outfit: w-stand (yellow hard hat, orange hi-vis vest, beige shirt, brown trousers and boots, no blue or green, palette law), then w-carry, w-shock and w-wave, each using the worker image as its reference so the clothes stay the same. Merchant poses still to make: m-run (09), m-stamp and m-receive (18), m-cheer.

See also: [[Aldi's Design Taste]] · [[Looking at the App]] · [[9Router Subordinate AI Delegation]]
