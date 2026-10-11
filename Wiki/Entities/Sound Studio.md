---
title: Sound Studio
description: Aldi's sound editor - he tunes the capybara's voice, the vault intro and the message sounds on one page, presses Save, and the app's sound files are baked from what he saved. Where it lives, how to open it, what it can do, and his saved settings.
type: entity
created: 2026-10-11
updated: 2026-10-11
confidence: high
checked: 2026-10-11
tags: [audio, kpm, tool, studio, capybara, intro, design]
---

# Sound Studio

**The tool:** `A-Brain/Tools/sound-studio/` (README there). **Live:** https://claude.ai/artifact/AmgCRrR8s8MfPaAxfPQtNr (version 6, saves to its database `sfx/settings`). Stored on his ask, 2026-10-11: *"i want u to keep and store all this voice editor for future use and put it on the A brain"*.

## Why it exists

[[Sounds Come From Aldi]]: every sound in KPM is one HE chose. Making sounds and asking "is this right?" failed three times; a page where he hears each candidate in its real moment, tunes it and saves the numbers has worked every time since (the chests 2026-09-23, the message strip 2026-10-10, the intro and the capybara 2026-10-11).

## What he decided (save of 2026-10-11 13:13 - `Tools/sound-studio/saves/2026-10-11_1313_settings.json`)

- **Capybara:** Agent (firm) - 112 Hz, agent moods (focused / firm / questioning / approving), variety 100 %, pace changes 70 %, syllable count changes 60 %, stress 70 %, low creak 35 %, loudness 0.40, echo 0.12. His words: *"tegas and serious but expressive ... elegant manly and focus"*.
- **Vault intro:** ring = slow chord 0.5 · dots fly in = reverse bell, an octave down, 0.25 · name lands = warm bloom, an octave down, 1.0 · name leaves = breath, an octave down, 1.0 · typing = soft key 0.5 (wobble 0.5, also when leaving) · hall echo 0.35. His words: *"dont make the intro 8 bit bruh, we need elegant for that"*.
- **Message / failure:** confirmation_002 at 1.8x with a 180 Hz bass cut, 0.29 / error_002, 0.14 - already in the app (kpm `f942657`).
- **In the app (kpm `7e7e155`, 2026-10-11):** the capybara speaks as Agent (firm) from 61 baked syllable files on the studio's own plan; the vault intro is his mix. The top bar's Volume-all 0.25 / message echo 0 were left out - *"just leave the message like that for now"*.

## How it is built

One synth file, `chip.js`, shared by the page and the baker: the capybara is a source-filter voice (a glottal pulse with jitter, shimmer, breath and a creak, through four formant resonators; six throats - plain, gravel, mumble, whisper, radio, brass - plus a nasal hum and the Game Boy 8-bit loop from his reference video) and a per-line plan with a fresh seed (mood, how many syllables, pace, the stressed word). The intro is FM bells, pads, filtered noise, stereo and a 2.4 s hall, timed to VaultGate's own clock. Every step of how it came to be: `Brainstorm/2026-10-10_sfx-message-capybara-intro.md`.

## Traps

- **The top bar changes more than one card** - Volume-all and Echo-messages feed the message sounds already baked.
- **No global reset** - removed after it put his decided intro back to my picks on save.
- **The page and the app must agree** - the app gets syllable FILES and runs the same plan; never let the studio do something an `<audio>` element cannot (it plays a file, at a rate, at a time, at a loudness).
