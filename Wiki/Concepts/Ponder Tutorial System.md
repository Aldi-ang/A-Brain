---
title: Ponder Tutorial System
description: An in-app tutorial on every component, modelled on Create mod's Ponder. Scripted scenes over fixed demo data, never recorded video and never a live spotlight. Two decisions locked, three questions still open, nothing built.
type: concept
created: 2026-08-27
updated: 2026-08-27
confidence: high
checked: 2026-08-27
status: OPEN — plan only, nothing built
tags: [kpm, tutorial, onboarding, ux, design, plan, open, brainstorm]
aliases: [Ponder, Tutorial System, In-App Tutorial, Onboarding Scenes]
---

# Ponder Tutorial System

**Status: plan only.** `.claude/PONDER-PLAN.md` in the kpm-inventory repo (commit `5d4f062`,
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

## OPEN — three questions left for him rather than assumed

1. **Language.** Indonesian, English, or both? His *"english if shorter and direct"* rule was about
   **column labels**, and branch staff reading a tutorial are not the same audience as an HQ admin
   reading a table header. **Not assumed either way.**
2. **Autoplay or manual** — auto-run a stage then wait, or press forward for every beat?
3. **Does a first-time user get pushed into a scene**, or is `?` always opt-in?

## Rejected on purpose — do not re-propose

Recorded video/GIF tutorials · spotlighting live data · Ponder's 3D camera work and schematic
format · long scenes (ours are 30-45s, 5-8 steps) · refactoring every component up front.

Source: [[../Summaries/Surat Jalan Desk and Sebaran Stok]] §9.

See also: [[Aldi's Design Taste]] · [[Where KPM Is Going]] · [[The KPM Control System]]
