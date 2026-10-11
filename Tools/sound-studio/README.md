# Sound Studio

Aldi's sound editor for KPM: he tunes a sound on the page, presses **Save**, and the app's sound files are baked from what he saved.
His ask, 2026-10-11: *"i want u to keep and store all this voice editor for future use and put it on the A brain"*.

**This folder is the living copy.** `Raw/2026-10-10-sfx-packs/` and `Raw/2026-10-11-sfx-round2/` are its history (the rounds as they were built).

## Open it

- **Live (saves for real):** https://claude.ai/artifact/AmgCRrR8s8MfPaAxfPQtNr - private to Aldi; saves go to that artifact's database, collection `sfx`, doc `settings`.
- **Offline (this folder):** `node serve.mjs` -> http://localhost:4197 (kpm launch config `sound-studio`). Offline it saves to the browser only.

## What is on it

| Card | What he tunes | Where it plays in the app |
|---|---|---|
| Capybara talks | 11 voices (Agent firm, Radio agent, Gravel agent, Deep baritone, Whisper agent, Low mumble, Muted trumpet wah, Sleepy grumble, Sims chatter, Villager hum, Game Boy 8-bit) + Today's sound; pitch, mouth size, melody, randomness, slide in, fall at the end, speed, consonants, wobble, breath, longest line, variety, pace changes, syllable count changes, stress on a word, low creak at the end, loudness, echo. Shown in his corner (the merchant sprite + bubble) saying his real lines; "Play a conversation" | `speakMumble` (CapybaraMascot.jsx, MerchantSalesView.jsx) |
| Vault intro | typing (made ticks or 9 Kenney recordings), the ring, dots fly in, the name lands, the name leaves - each a list + loudness + pitch, echo (a 2.4 s hall); drawn over a line-for-line copy of VaultGate's dots | `VaultGate.jsx` playSound at the unlock |
| Message appears / Failure appears | a Kenney recording, start, end, loudness, pitch, bass cut | `Toast.jsx` (msg-in.mp3 / msg-fail.mp3, baked 2026-10-11) |

The top bar: **Echo, messages** and **Volume, all** - careful, both feed the message sounds too. There is NO "My picks" button on purpose (it reset every card and once overwrote his decided intro); every list stars my pick.

## The files

| File | What it is |
|---|---|
| `sound-studio.html` | the page (the artifact's index) |
| `chip.js` | THE synth - the capybara voices (glottal pulse + formants, syllables, a seeded plan: moods, pace, syllable dropping, stress) and the intro's sounds (FM bells, pads, noise, stereo, the hall). The baker imports this same file, so what he hears is what gets baked |
| `sfx-pack.js` | round-1 recordings (Kenney Interface Sounds, UI Audio, Digital Audio, Music Jingles - CC0) + the app's current sounds, as base64 mp3 (made by `build-pack.mjs` from `sfx-measure.json`) |
| `sfx-pack2.js` | the 9 typing recordings (made by `build-pack2.mjs`) |
| `merchant-idle.png`, `merchant-talk.png` | the capybara's sprite sheets, copies of kpm `public/sprites/` |
| `sfx-measure.mjs` / `.json` | measures every recording (length, peak, brightness, bass share) - the shortlists come from it |
| `saves/` | his saved settings, one JSON per save worth keeping - `2026-10-11_1313_settings.json` is the one the next bake uses |
| `serve.mjs` | the offline server (wraps the page the way the artifact host does) |

The Kenney packs themselves (9 MB) are NOT here: re-download from kenney.nl if a pack must be rebuilt.

## Change it, then publish

Edit the files here, check offline, then publish to the SAME link: Artifact publish with `url` = https://claude.ai/artifact/AmgCRrR8s8MfPaAxfPQtNr, the page as `file_path`, and `chip.js` (+ any changed file) in `files`. Read the artifact first (the tool insists). Always read his `sfx/settings` after he saves and compare EVERY card with the last save - a slider in the top bar changes more than the card he talked about.

## Bake what he saved

`tools/sfx-bake.mjs` in kpm renders his numbers into `public/sounds/` (messages done 2026-10-11; the intro and the capybara next - the steps are in kpm `.claude/NEXT-SESSION.md`). Restore a save into the live studio: ArtifactData `set` collection `sfx` doc `settings` from a file in `saves/`.
