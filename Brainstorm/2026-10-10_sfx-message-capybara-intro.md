---
date: 2026-10-10
status: OPEN - waiting on Aldi (download yes, then he picks in a studio)
tags: [kpm, sound, sfx, studio]
---

# New sounds: the message strip, the capybara, the intro

**Problem, his words (21:55):** *"i want u to change the SFX for when the top panel notification shows up i dont like it tbh and also change the SFX for the capybara make it less bass sy maybe but more crisp and easy to hear, and also change the SFX on the main intro as well. make the draft so that i can choose from, use all the resource to make these"*.

**Today (checked in code):** a message strip plays `commit` when it appears and `error` for a failure (`src/components/Toast.jsx` ~96), `click` when he closes it (~73). **`commit` is also the SALE sound** (`src/MerchantSalesView.jsx:1576`) - the exact mismatch his round-1 rule forbids ("u re crazy using sales SFX for the book"). The capybara talks with `speakMumble()` (`src/hooks/useSound.js`): `mumble1..4`, 1,2 KB blips, one every 105 ms. The intro = the Master Vault "Welcome back" sequence, `playSound('vaultb')` (`src/components/VaultGate.jsx:335`, `vault-b.mp3`, 3,0 s wave he once signed off).

**Method (his rule, [[Sounds Come From Aldi]]):** recordings, never synthesis; he edits in a studio (cut, pitch, loudness + a BASS control for the capybara) and presses save; `tools/sfx-bake.mjs`'s way renders his numbers into files. The September studio: https://claude.ai/artifact/M3xbaPAJ9LT7FL1ETmXvuu. The packs on the PC (Kenney RPG Audio) are wood and cloth - wrong for chimes, blips and an intro.

**Source asked (download needs his yes), all Kenney, CC0:** Interface Sounds 100 files 814 KB · UI Audio 50 files 402 KB · Digital Audio 60 files 967 KB · Music Jingles 85 files 1.210 KB · Sci-fi Sounds 70 files 5.737 KB (sizes read from kenney.nl 21:55).

**Decision:** OPEN - waiting on his download yes.
