---
confidence: high
checked: 2026-11-17
---
# Openverse Audio API

**What:** a free search over Creative Commons audio (Freesound and others), run by WordPress. Source for the future redesign of KPM's button-press SFX. His words, 2026-11-17: *"also add earshot skill, real sfx and openverse api for future redesign for our sfx button press"*.

**Tested 2026-11-17 16:05 WIB, no key:**
`GET https://api.openverse.org/v1/audio/?q=button%20click&license_type=commercial&page_size=3`
-> HTTP 200, 240 results. The first three were CC0 (no credit needed): "SFX UI Button Click" (suntemple), "UI Button Click" (benzix2), "Mid-High Tone Button Click" (wubitog), all freesound.

| Field | Use |
|---|---|
| `license_type=commercial` | only sounds a business may use |
| `license` / `attribution` | CC0 = no credit; CC BY = put the `attribution` text in the app's credits |
| `url` | mp3 preview (cdn.freesound.org) |
| `alt_files[].url` | original wav/ogg - freesound.org/apiv2 download, may need a Freesound login |
| `duration` | milliseconds - a press sound should be under ~150 |

**Limits without a key:** 20 searches/minute, 200/day (from the response headers). A key (free registration at api.openverse.org) raises them - only if a real hunt needs it.

**How it fits:** Openverse finds the candidates -> the `earshot` skill listens and picks (it judges sound Claude cannot hear) -> `real-sfx` / `real-sound` place and process them. The KPM sound rules still apply (`src/hooks/useSound.js`, his "no SFX at all" report about a 45 ms tap: a press sound must be audible, not just short).

**Not this:** `Skills-Library/web3/openverse-dev` is an unrelated blockchain-dapp skill with the same word in its name.

Related: [[Log]]
