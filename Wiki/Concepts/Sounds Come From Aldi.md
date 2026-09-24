---
title: Sounds Come From Aldi
description: Every sound in KPM is a file Aldi chose. Three separate rounds have been lost to inventing one instead — twice by synthesis, once by reusing a sound that already meant something else — and this page records the rule, the four words that ended each round, and the ffmpeg method that finally worked.
type: concept
created: 2026-09-04
updated: 2026-09-04
confidence: high
checked: 2026-09-04
tags: [pattern, design, audio, kpm, taste]
---

# Sounds Come From Aldi

**The rule, and it has never once been wrong: a sound in this app is a file Aldi picked. Not a
sound generated in code, and not an existing sound pointed at a new meaning.** Three rounds have
been spent learning this, each ending in four or five words from him, and the third one happened
after the first two were already written down in the source file that was open at the time.

## The three rounds

| round | date | what was built | what he said |
|---|---|---|---|
| 1 | 2026-08 | re-pointed the app's own SFX — `commit` for the cover, `tap` for a pick | *"u re crazy using sales SFX for the book, use paper or book SFX la bro"* |
| 2 | 2026-08 | synthesised paper from filtered noise — no files needed, correctly silent in Lite Mode | *"SFX sound really bad as well"* |
| 5 | 2026-09-04 | seven synthesised "tech" takes for the phone's field terminal, with waveforms and a rapid-press test | *"all bad nvm"* |

Rounds 3 and 4 are the ones that worked, and both worked the same way: he sent his own files.

⚠️ **Round 5 is the expensive one, because everything needed to prevent it was already written.**
`src/ponder/sfx.js` opens with rounds 1 and 2 and the sentence *"Synthesis was the clever answer to
the wrong question; the right move was to ask which file, not to build a substitute for one."* That
file was read at the start of the session, the concern was raised to him in writing, and he then
asked for a synthesised draft anyway — *"can u make tech sound and give me the draft so i can review
before u integrate"*. His ask is his call and it was right to build it. **The lesson is not "refuse
him"; it is that a review gate does not change the odds.** Seven takes, a generator, a review page
and a published artifact, and the answer was still four words.

## What actually worked, and it is reproducible

He sent a Snipping Tool screen recording of the sound he wanted and said *"use this for the section
button click on the side"*. The cut is arithmetic, not taste:

1. **Find the burst.** His clips are whole captures — 4,95 s here, and 4,7 / 6,5 / 5,9 s for the
   book — with the actual sound a second or more in. `silencedetect` locates it:
   `ffmpeg -i raw.wav -af "silencedetect=noise=-45dB:d=0.06" -f null -`
2. **Read the envelope before trusting the gate.** This clip reported *two* sounds where a person
   hears one: a press at −13 dB and a release at −30 dB, 115 ms later, with a dip between them that
   a −45 dB gate calls silence. Both were kept — the release is part of the click. A 5 ms-bucket
   peak dump settles this in one look; the gate alone would have thrown half the sound away.
3. **The floor tells you what recorded it.** Outside the burst the file was digital silence
   (−99 dB), which proves it is system audio with no microphone open — so the second hit is the UI,
   not his mouse. That one measurement decided whether to keep it.
4. **Never cut without a fade.** A trim landing on a non-zero sample is a step, and a step is
   broadband noise. An early cut here produced a **−0,7 dB transient at the seam, louder than the
   sound itself**. Every cut now fades in ~4 ms and out ~20 ms.
5. **Match the family's level.** `book-page.mp3` peaks at −1,6 dB, so the key was normalised to
   −3 dB rather than to whatever the recording happened to be.

**A derived sound is still his sound.** The parked panel-opening was built by dropping his click an
octave (which also doubles its length), low-passing at 2,6 kHz and adding a short tail. It stays in
the family because it *is* the click. That is the one form of "making" a sound that has not lost.

## Where sound lives, and what can never be verified from here

`src/hooks/useSound.js` owns `SOURCES` (name → `/sounds/x.mp3`) and a per-name `VOLUMES` map, and
`playSound` handles pooling, the browser unlock gesture and Lite Mode silence. `src/ponder/sfx.js`
is the thin naming layer for the tutorial. **Name a sound for the surface it belongs to** — the
terminal's is `padKey`, not a book name, because the panel is slate and amber where the book is
paper, and a sound named for the wrong one gets wired to the wrong one.

⚠️ **Audibility cannot be proven in this environment, ever.** `playSound` returns early until
`unlockSounds()` has run; `main.jsx` arms that on the first real user gesture, the ponder lab has
its own entry point that never calls it, and the Browser pane cannot deliver a trusted click at all
(a real `computer` click times out — see [[Looking at the App]]). What IS provable, and what every
sound change should report instead: the mp3 resolves (`fetch` → 200 `audio/mpeg`), it decodes to the
intended duration and peak (`AudioContext.decodeAudioData`), and the calling function still does its
job afterwards. **The listening test is his phone. Say so rather than implying otherwise.**

## Enforced, not remembered

`integration.audit.mjs` carries *'every tutorial sound is one of his own files, and none of them is
a sales sound'*, which fails on `playSound('click'|'commit'|'tap'|'sign'|'error'|'vaultb')`, on
`new Audio`/`createOscillator`/`createBiquadFilter` inside `sfx.js`, and on any registered sound
whose file is missing. A companion check fails any tutorial mp3 over ~40 KB, which at this bitrate
means seconds long — that is the untrimmed-capture trap as a check rather than a paragraph. **Do
not weaken either to make something pass.**

## Rejected on purpose — do not re-propose

- **Synthesising a sound.** Lost twice. A review gate does not fix it.
- **Reusing `click` / `tap` / `commit` / `sign` / `vaultb`.** Each already means money moved.
- **Fetching a sound he linked on YouTube.** Cannot be fetched here; those calls were left SILENT
  instead, because a wrong sound is worse than none — round 1's whole lesson.
- **A long clip "because it sounds nicer".** The rail has seventeen keys pressed in a row; anything
  much over ~200 ms stacks on itself.

## Open

Closing a lesson on the phone still plays the paper `book-close`: `PonderOverlay.jsx:373` calls
`bookClose()` and never checks the screen width, so the slate terminal exits on paper. Aldi found it
by ear — *"the ponder panel close, it sound like book close on the phone also"*. He has been asked
whether it should fall silent on a phone or take a sound derived from his click, and he noted the
whole area is low stakes: *"most of the time phone user wont be using their volume on this app
anyway"*.

Related: [[Aldi's Design Taste]] · [[Looking at the App]]

## Round six — the chest (2026-09-23)

| round | date | what was built | what he said |
|---|---|---|---|
| 6 | 2026-09-23 | the van-loading chests: a stick-slip hinge creak, wood modes, a steel latch, a short room — all synthesised | *"i dont like the sound effect, i want it to be more simple just like what minecraft have but satisfying and give me chill when interact with it"* |

His reference was a YouTube video of the Minecraft ender chest. **The game's file cannot ship** — Mojang owns it and KPM
is a paid app — so "which file?" has no answer in the game itself. v2 went simpler (one knock, one airy swell, one rising
pop per box), and the owned paths were put to him in the same reply: Kenney's CC0 "RPG Audio" pack (public domain,
recorded foley — the download needs his yes) or a phone recording of a real wooden box. If v2 loses too, do not make a
fifth: ask for the pack or the recording.

## Round seven — the pack and the studio (2026-09-23, 11:25): the rule changes shape

> *"just download that free pack and remake the SFX again, if possible i want to edit the SFX myself just make a small
> studio to edit the sound but i want u to choose the best sound that sound best for these animation"*

**The source question is closed for the chests:** Kenney's "RPG Audio" (kenney.nl, CC0 — public domain, commercial use
allowed, credit optional; downloaded at his word, 51 recordings, 965 KB zip). Nothing is synthesised any more; the only
processing is a cut, a pitch, a level and a shared room.

**And the way of choosing changed: he edits, instead of voting.** Every earlier round was *I make → he judges →
rejected*. Now the prototype carries a SOUND STUDIO — one card per moment (recording, start, end, loudness, pitch; room
and master on top), a waveform with the kept part lit, letting go of a slider plays the result — and SIMPAN writes the
whole setting to the artifact's own database (`sfx/settings`). That saved document is the truth the integration builds
from: read it, cut those files, ship them to `public/sounds/`.

My picks (by what each file is and its measured shape; I cannot hear): ender open `doorOpen_1` at 0.78×, ender close
`doorClose_3` at 0.75×, van open `creak3`, van close `doorClose_4`, pick `handleSmallLeather`, a box lands `bookPlace1`
(rising 7 % per box), page `bookFlip3`, refused `dropLeather`, MUAT VAN saved `metalLatch`. Coins were left out on
purpose: in this app a coin sound means money moved.

⚠️ **Local check trap:** the Browser pane opens a file:// page as a data: snapshot, so a sibling script
(`sfx-kenney.js`) never loads and the studio shows empty waveforms. Serve it through the `ponder-lab` preview
(http://localhost:4190/tools/…) instead — measured: 51 decoded, 9 waveforms drawn, save + reload kept the edit.

## His first saved set (2026-09-23 11:58) — and what it says about his ear

Saved from the studio as `sfx/settings` version 2: ender chest `cloth2` (open, 0.96×) / `doorClose_4` (close, 0.77×,
cut to 0.38 s); van `cloth1` (open, 0.89×) / `doorClose_4` (close); pick `handleSmallLeather` at **150 %**; a box
lands `bookPlace1` cut to **55–90 ms** at 35 %; page `bookFlip3` at 90 %; refused `dropLeather`; room 33 %, master 62 %.

**Read it as taste:** he swapped both of my wooden door-opens for CLOTH, turned the landing thud into a 35 ms tick, and
turned the pick-up UP. Soft, short and close beats wooden and resonant — that is what "chill" meant. The one he left
alone and then questioned is MUAT VAN's `metalLatch` (*"doesnt really suit it"*); three candidates sit on its card
(a van door that shuts and latches, a heavier door, a ledger snapping shut). His pick decides.

**Direction is heard, not only seen (2026-09-23, 12:54).** *"make the SFX upside down when taken from agent inventory to
warehouse, instead of going up each time now going down each time"* — the landing tick climbs box by box into the van
and descends box by box back into the warehouse. A repeated sound's pitch contour is information: up = gaining,
down = giving back. Keep the contour when the sound ships.

**His studio numbers ship as files (2026-09-24, `1e103f1`).** *"just use the metal latch for now its fine"* closed the
last card, so `sfx/settings` version 2 became `public/sounds/chest-*.mp3`. `tools/sfx-bake.mjs` renders each moment the
way the studio's Web Audio graph plays it: his cut, his rate (pitch AND length together, as `playbackRate` does), 4 ms in /
25 ms out, loudness x master, plus ROOM x the studio's own seeded room impulse with the ConvolverNode's default
normalisation. Two traps found on the way:
- **Chrome's mp3 decoder clamps to full scale; ffmpeg's does not.** metalLatch decodes to a 1.71 peak in ffmpeg and 1.00 in
  the studio. He heard the clamped one, so the render clamps too. Checked against an OfflineAudioContext render of the same
  graph: peaks 0.50 vs 0.498, loudness within 1 dB, room tail within 3 %.
- **An `<audio>` element keeps its pitch when sped up** (`preservesPitch` defaults to true), so the rising landing pop would
  only get faster. `useSound` sets it false on the pool and sets `playbackRate` on every play.
Change a sound later: SIMPAN in the studio artifact, copy the numbers into SET in the script, run it.
