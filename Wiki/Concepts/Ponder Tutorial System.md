---
title: Ponder Tutorial System
description: An in-app tutorial on every component, modelled on Create mod's Ponder. Scripted scenes over fixed demo data, never recorded video and never a live spotlight. Two decisions locked, three questions still open, nothing built.
type: concept
created: 2026-08-27
updated: 2026-08-27
confidence: high
checked: 2026-08-27
status: BUILDING — slice 1 shipped 2026-08-27 (`521b1d9`), slice 2 is the real table
tags: [kpm, tutorial, onboarding, ux, design, plan, open, brainstorm]
aliases: [Ponder, Tutorial System, In-App Tutorial, Onboarding Scenes]
---

# Ponder Tutorial System

**Status: slice 1 is built and was looked at.** `.claude/PONDER-PLAN.md` in the kpm-inventory repo (commit `5d4f062`,
2026-08-27) is the whole deliverable. He asked for the plan and **explicitly chose to build
nothing** that session, with ~23% of the quota left.

## The problem, his words

> *"custom instruction menu on each of every components ... so that if our user forgot they can just
> see it from there"*

> *"i want the tutorial to be like video interactive similar to ponder system on minecraft create
> mod"*

## Decision 1 — scripted scenes, not recorded video (LOCKED)

Ponder is not a video player either: it builds a small fixed world from a schematic and runs a
**script** over it. Recorded clips lose to that on three counts here — **eight labels were renamed
on 2026-08-27 alone**, so a clip would have been wrong by the end of the same day; a video cannot
follow dark mode; and it cannot ship inside an offline PWA at a sane size.

## Decision 2 — fixed demo data, not a live spotlight (LOCKED, and it shapes everything)

A scene renders **the real component fed a fixed demo dataset**, rather than spotlighting his live
screen.

| | Spotlight the LIVE panel | Real component + FIXED demo data |
|---|---|---|
| always matches the current UI | yes | yes (same component, different props) |
| works for a brand-new user | **no — empty data is a tutorial full of dashes** | yes, always the same story |
| can teach a state he has never hit (red "3 days left") | no | yes |
| can show a number *changing* | no | yes |
| work needed | less | one small refactor per component |

**This is the version that works for the user who needs a tutorial most: the one whose data is
empty.** Spotlighting live data today would teach Sebaran Stok using Bandung's all-zero row — a
wall of dashes. It is also what Ponder actually does; the schematic world is not your base.

**The cost, taken one slice at a time and never up front:** the visual half of a panel accepts its
rows as a **prop** instead of computing them. Same component in both places, so a scene cannot
drift from the screen it teaches.

## Scene format — data, never React

One file per component under `src/ponder/scenes/`. A scene is `{ id, title, blurb, related, data,
steps[] }`; each step carries `text`, a `focus` key resolved against `data-ponder` attributes, an
optional `act` (open a drawer, switch a tab) and an optional `tick` (a number that counts up rather
than appearing, for the beats that teach a calculation). **Writing a new scene must never require
React.**

## The four audit checks the engine needs

1. every `sceneId` on a `PonderButton` exists in the registry — a typo must fail the audit, not
   render a dead `?`
2. every step has non-empty `text` — a silent step is a black screen
3. **every `focus` key exists as a real `data-ponder` attribute** — this is the one that stops
   scenes rotting when a panel is rewritten
4. the Sebaran Stok formulas appear in the scene file — the migrated check 631, see below

## The footnote migration — recorded so it is not forgotten

**The Sebaran Stok footnote may not be deleted before the first scene exists.** It is currently the
only written record of the two formulas, and check 631 pins them to the screen. So the check
**moves** into the scene file. *Deleting a check to make a change pass is how the thing it protected
comes back* — see [[Anti-Recurrence Check]]. The formulas themselves are why
[[A Ratio of Sums Is Not a Rate]] matters on that panel.

## Project traps written into the plan

Palette law (no blue, no green; gold never text on light) · *Lite mode means performance*, so
nothing rotates and only `transform`/`opacity` animate · `prefers-reduced-motion` must jump to each
step's end state **and keep the captions**, because the tutorial still has to teach with motion off ·
no `window.confirm`/`prompt` anywhere near it · the rail is off-canvas under 1024px, so the overlay
is full-screen there and the caption bar must not cover what it points at.

## Build order — ranked by where a mistake costs money

Slice 1 is the engine on one panel with a placeholder scene. Slice 2 is **Sebaran Stok for real**,
the slice that proves the format. Then one component per slice: Sales Terminal (titip vs paid) →
EOD Setoran → Stock Opname (why the number is hidden) → Restock Vault Request (Siapkan deducts HQ
stock immediately) → Receivables → Fleet & Canvas (loading a van *moves* stock, it does not copy it)
→ Dashboard/Map/Reports last, being read-only.

## ANSWERED 2026-08-27 — all three, plus a fourth he added

> 1. *"teaching just use indonesia, for terms for the features and components just use english"*
> 2. *"scene play but itself but also add pause button or timeframe to restart the tutorial, just
>    like the ponder system inside create mod, i want u to fully research how that works and also
>    find example so u got the image to do this job"*
> 3. *"nope dont push newcomer towards the scene let them figure out by pressing the tutorial button"*
> 4. *"dont use sebaran stock, use proper elegant english terms for that"*

**All four are checks now, not prose** — `integration.audit.mjs` group 56, fourteen of them. A
paragraph recording a preference goes stale in silence; a check cannot.

**On (1):** a teaching sentence is Indonesian and every column name stays in the English it is
printed in on screen, marked `**like this**` so it renders in accent ink. That is what makes an
English term visibly a term rather than a foreign word dropped into an Indonesian sentence — and it
is what sends the reader looking for the same label on the real panel.

**On (4), the name is `Stock by Warehouse`.** Two runners-up lost for stated reasons:
*Stock Distribution* — that screen already has a **Shipping** column, and "distribution" reads as
the shipping operation, so the title could be misread as naming one of its own columns.
*Stock Across Warehouses* — 23 uppercase characters at `tracking-[0.14em]` wrap to two lines on a
phone, and a two-line title is exactly what he deleted the old banner for
([[Aldi's Design Taste]], *"not cool and elegant"*).

## What slice 1 actually built (`521b1d9`, 645/645)

`src/ponder/`: `useScenePlayer` (the clock), `PonderOverlay` (the player), `PonderButton` (the chip
in the panel header), `registry.js`, one scene, one disposable stage. Autoplay, a real Pause,
Restart, a 3px timeline with a notch per beat, Comfy Reading, arrow keys, Esc.

**Slice 2 is the only queued job:** extract the real table into a presentational component, feed it
`DEMO_WAREHOUSES`, delete the placeholder stage and the footnote, and **move** check 631 onto the
scene file. See `.claude/NEXT-SESSION.md` in the repo.

See [[What Create Mod's Ponder Actually Does]] for the mechanics this was built from, and
[[Looking at the App]] for how a frame of it was obtained without the vault password.

## Rejected on purpose — do not re-propose

Recorded video/GIF tutorials · spotlighting live data · Ponder's 3D camera work and schematic
format · long scenes (ours are 30-45s, 5-8 steps) · refactoring every component up front.

Source: [[../Summaries/Surat Jalan Desk and Sebaran Stok]] §9.

See also: [[Aldi's Design Taste]] · [[Where KPM Is Going]] · [[The KPM Control System]]
