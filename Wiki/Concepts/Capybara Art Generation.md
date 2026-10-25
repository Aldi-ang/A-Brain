---
title: Capybara Art Generation
description: How new poses and outfits of Aldi's capybara are made without changing the character - which generator kept his face and body, which routes are closed, and how a pose gets into the presentation.
type: concept
created: 2026-10-22
updated: 2026-10-25
confidence: medium
checked: 2026-10-25
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

## Done 2026-10-22 15:19 - all 11 poses, live in presentation v35

He made a free Hugging Face account and a Read token. The anonymous limit no longer applies, and the 8 missing poses came back in ~5 minutes (33-39 s each, every one right on the first try). The worker outfit was made from his merchant sprite (only the clothes changed). The other worker poses then used the worker image as their reference, so the clothes stay the same. Notes:
- The model chooses the facing: `w-carry` came back walking LEFT although the prompt said right, so the page mirrors it. `m-run` faces right, as asked. Look before wiring any walk.
- Two poses came with a floor shadow that tolerance 75 did not clear; 110 did, and the shirts and the box survived.
- The token was pasted in chat, so it should be deleted after use; the generator reads `%USERPROFILE%\.cache\huggingface\token`.

See also: [[Aldi's Design Taste]] · [[Looking at the App]] · [[9Router Subordinate AI Delegation]]

## The flying cameo uses them too (2026-10-22 17:32, presentation v36)
His words: *"yes i want the capybara update on all models inside the presentation so that it have varieties, u can even generate other clothes for him"*. Each visit the cameo dresses for the slide on screen (`OUTFIT` map: stock slides -> worker, security -> guard, money -> cashier, reports -> office, sales -> sales, customers -> warung owner, routes -> driver), and each pause or tap shows a different gesture from that look's list (never the same one twice in a row). A look whose picture is not drawn yet is skipped, so new outfits switch on as soon as `swap.mjs` adds them.
Quota fact: a free account's ZeroGPU allowance covered 9 pictures (~33-39 s each) before *"exceeded your ZeroGPU runs limit"* at 17:23; it refills daily. Still to draw: o-sales, o-driver, o-office, o-guard, o-cashier, o-chef, m-think, m-sit (`capy-poses/tools/outfits.sh`).

## Dreamina works too - the six dialogue faces (2026-10-25 ~10:50)
His call: *"u should remake these using dreamina ig higgsfield is unable to do that"*, after the FLUX faces kept the thumbs-up on shocked / worried / annoyed. He signed in to dreamina.capcut.com in the Browser pane himself; Claude never signs in.
- Model: **Seedream 4.6** ("improved character consistency, efficient on credits"), 4 credits per picture, 1:1, 2K. One run of 6 pictures with ONE prompt that numbers the six expressions came back as six different faces of the same character - 24 credits. Only "annoyed" kept a thumbs-up; a 2-picture redo with "both arms firmly crossed, hands tucked under the arms and hidden, no thumbs up" fixed it (8 credits). 64 -> 32 credits left on his account.
- Full size: each thumbnail opens a viewer whose `<img>` carries a signed `...aigc_resize_mark:1080:1080.webp` URL; `curl` downloads it with no cookies. Sources: `Raw/2026-10-25-capy-dialogue/dreamina/r-*.webp`; the cut set on the dark ground: `Raw/2026-10-25-capy-dialogue/dreamina-faces-cut.png`.
- **Getting a local file INTO Dreamina from Claude** (the trap that cost the most turns): the page cannot reach `localhost` (fetch, `<img>`, iframe all blocked - local network access), `window.open` replaces the pane's only tab, a Ctrl+V of an image does not paste, and computer-use can never control Claude's own window (so the Windows file picker is out). What worked: (1) shrink the reference (crop + 304x384 JPEG, 15 KB); (2) send its base64 into the page in 400-character blocks, each checked against a hash computed locally first - hand-copied base64 drops characters (the first unchecked try lost 6 of 9,896); (3) Dreamina's "+" calls `showOpenFilePicker`, not a file `<input>`: replace `window.showOpenFilePicker` with a function that returns `[{ kind: 'file', name, getFile: async () => file }]`, then click "+".
- Cut: scale 1080 -> 1024, `crop=760:760:140:30` (head + chest, same as the FLUX set), `node img.mjs cut <in> <out> 512 40`; for the app, WebP q82 (~30 KB each, alpha kept) in kpm `src/assets/capy-talk/`.
