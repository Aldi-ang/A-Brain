---
title: What Create Mod's Ponder Actually Does
description: The mechanics of Create mod's Ponder, read out of its own source rather than from memory — every control, what pause really is, how scrubbing works, and the four things KPM copied versus the two it dropped and why.
type: concept
created: 2026-08-27
updated: 2026-08-27
confidence: high
checked: 2026-08-27
tags: [kpm, tutorial, ponder, research, ux, reference]
aliases: [Ponder mechanics, Create mod Ponder, PonderUI]
---

# What Create Mod's Ponder Actually Does

Aldi, 2026-08-27: *"just like the ponder system inside create mod, i want u to fully research how
that works and also find example so u got the image to do this job"*.

**Read from source, not from memory.** `Creators-of-Create/Ponder`, branch `mc1.21.1/dev`:
`common/src/main/java/net/createmod/ponder/foundation/ui/PonderUI.java`,
`ui/PonderProgressBar.java`, `PonderScene.java`, and
`common/src/main/resources/assets/ponder/lang/en_us.json`, which names every control.

## Getting the source at all

Every wiki mirror is behind Cloudflare — `create.fandom.com` returns 403 to curl, 402 through the
fetch proxy, and a CAPTCHA page through a text proxy. **GitHub's raw and API hosts answer plainly.**
That is the route: `api.github.com/repos/<owner>/<repo>/git/trees/<branch>?recursive=1` to find the
files, then `raw.githubusercontent.com` to read them. Ponder is no longer inside Create — it was
split out into its own repo alongside `catnip`, so searching the Create tree for `PonderUI` finds
nothing and looks like a dead end.

## Every control, and what it really is

| Control | Default key | What it does |
|---|---|---|
| open | hold the Ponder key over an ITEM | there is no index to go find; the entry point is the thing you are confused by |
| **Identify** | `keyDrop` (Q) | **this is the pause.** It stops ticking the scene entirely, and while frozen you hover parts of the world to have them named. The tooltip is literally *"Identify mode active. Unpause with [Q]"* |
| Replay | `keyDown` (S) | restart the current scene from its first instruction |
| ◀ ▶ | `keyLeft` / `keyRight` (A/D) | **previous / next SCENE**, not stage. A Create item owns five or six scenes |
| **Comfy Reading** | no shortcut | stretches time *while a caption is on screen* — `extendedTickLength = 2`, so a tick takes three, but only when a `TextWindowElement` is visible |
| progress bar | click | seeks to a **keyframe**. Not free scrubbing |
| Close | `keyInventory` (E) | exit |

## The three mechanics worth stealing

**1. Pause and inspect are the same button.** Ponder has no plain "stop the animation" control. Its
freeze exists so you can point at things. That is a better feature than a pause, and it is the one
KPM has not built yet — it needs a stage with real named parts, so it waits for
[[Ponder Tutorial System]] slice 2.

**2. Scrubbing only stops where the author said.** `PonderProgressBar.onClick` maps the click to the
nearest `attachKeyFrame()` and seeks there; clicking before the first keyframe restarts the scene,
and the bar is not clickable at all when `getKeyframeCount() == 0`. **Keyframes are opt-in**, so the
author decides what counts as a beat. KPM's timeline notches are the same idea: one per authored
step, never one per instruction.

**3. The scene holds at its end; it never loops.** At `totalTime - 1` Ponder arms a flash at 30
ticks and an *"Up Next:"* hint at 50, floating over the ▶ button. **It still does not advance by
itself** — the suggestion is the whole behaviour. An end state, not a jump cut.

## The architectural difference that made KPM's engine short

`PonderScene.seekToTime` **throws** on a backwards seek — *"Cannot seek backwards. Rewind first."*
`PonderUI.seekToTime` works around it by calling `replay()` and fast-forwarding with
`whileSkipping`. It has to: Ponder's world is **mutable**. Blocks have already moved, so the only
way back is to rebuild the world and replay into position.

**KPM's is not.** A beat is a pure function of its index over fixed demo data, so seeking backwards
costs nothing and none of that machinery exists. `useScenePlayer.js` is about 95 lines where
PonderUI is 1,221. **Copy the behaviour, not the architecture** — the architecture is a solution to
a problem we do not have.

## What KPM dropped on purpose

- **Ponder's 3D camera, its schematic format, and its length.** KPM scenes are 30–45s, 5–8 beats.
- **Arrows between scenes.** A Create item owns several scenes; a KPM panel owns exactly one. So the
  arrows step BEATS and the timeline scrubs them — one job each, instead of two controls doing the
  same thing.

## The one place a scene script is worth reading

`AlmostReliable/ponderjs` (MIT) exposes the scene builder to KubeJS, and
`run/kubejs/client_scripts/getting-started.js` is a commented, working scene:
`scene.showStructure()`, `scene.idle(ticks)`, `scene.text(60, "...", [x,y,z]).colored(...)
.placeNearTarget().attachKeyFrame()`, `scene.showControls(...)`. It is the clearest statement of the
shape — **a scene is a sequence of timed instructions with text pinned to positions**, which is
exactly the shape KPM's `steps[]` took.

See also: [[Ponder Tutorial System]] · [[Aldi's Design Taste]] · [[Looking at the App]]
