---
title: SFX Toolkit
description: The sound tools stored for the KPM SFX upgrade (his 2026-11-01 ask) - what each does, where it lives in Skills-Library, and which ones fit his rule that every sound is a file he picked.
type: concept
created: 2026-11-01
updated: 2026-11-01
confidence: high
checked: 2026-11-01
tags: [audio, kpm, skills, sfx, tools]
---

# SFX Toolkit

His words, 2026-11-01: *"add this skills for future jobs that we will do ... in the future i will upgrade our app SFX
with these skills"*. Stored in `A-Brain/Skills-Library/` (not installed, so they cost nothing per session); find one
with `node ../A-Brain/automation/skill-find.mjs <words>` from the app folder and load it only when he says yes.

**Read [[Sounds Come From Aldi]] before using any of them.** Every KPM sound is a file he picked; sounds made in code
lost three rounds. So the tools split in two:

| Tool | Where | What it does | Fits his rule? |
|---|---|---|---|
| `earshot` (skill) | `sound/earshot/skills/earshot` | lets the agent "hear": describe a sound in words, compare candidates, find the cleanest moment, tell real recording from synthesis | **yes** - judging and trimming HIS files |
| `real-sound` (skill) | `sound/earshot/skills/real-sound` | soundtracks for code-made videos from real licensed recordings | yes, for presentation / demo videos |
| `real-sfx` (skill, his `.skill` file) | `sound/real-sfx` | places real library sounds on a motion video's moments; bundles the uisfx pack (CC0 UI sounds) | yes for his library; the uisfx sounds are MADE sounds - offer them as candidates for him to pick, never wire one in unasked |
| `earshot forge` | inside earshot | makes sounds in code and improves them by listening | **no** - this is rounds 2 and 5 again; only if he asks for it by name |
| `faster-whisper` (library card) | `sound/faster-whisper` | speech to text with timestamps, CPU | yes - timing cues to a voice, never a sound itself |
| `kokoro-onnx` (library card) | `sound/kokoro-onnx` | text to speech, CPU | a made voice - say so plainly; his call per use |

Also stored the same day, **not sound tools** although he listed them with these: `ios/xtool` (build iOS apps from
Windows/Linux, card only) and `web3/openverse-dev` - a Solana-style blockchain coding skill (Anchor programs, tokens,
staking), 0 stars, no description; it is NOT Openverse the CC-licensed media search. Never run its `install.sh`.

Safety read 2026-11-01: real-sfx's scripts launch only ffmpeg / ffprobe / node; its model downloads (45 MB listener,
3.1 GB caption model) each need an explicit `--yes`. The GitHub repos were stored as plain files from the default
branch (no git history), nothing executed; faster-whisper's 20 MB of test audio and xtool's 7 MB of doc screenshots
were left out.

Related: [[Sounds Come From Aldi]].
