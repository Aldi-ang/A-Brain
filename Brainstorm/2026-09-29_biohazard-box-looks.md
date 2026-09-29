---
title: Biohazard box looks
created: 2026-09-29
status: DECIDED — C (tape band, no word)
tags: [kpm, design, agent-inventory, quarantine, chest]
---

# The quarantine crate's box: three biohazard looks

## Problem

His words, 2026-09-28: *"i want u to make the inventory box for the quarantine chest to have biohazard theme as well just for extra feature"*. The box is the stone-grey panel that opens above the yellow crate (`.gui.q`, kpm `src/components/LoadingBay.jsx:841`; styles `src/styles/theme.css` ~4758-4989). The same class is used by Fleet & Roster's bay, so the look can land on both crates or only on Agent Inventory's (`.kpm-bay.solo`).

## Options (prototype v12, https://claude.ai/artifact/QA46EfZgkJPd6PH7f2FSjD, top of the page)

| Look | What it is | Cost |
|---|---|---|
| Today | the grey Minecraft box (his look-1 pick, 2026-09-24) | none |
| A · Tape rim | same grey box, the 4 px bevel becomes a 6 px black-and-yellow tape frame; the pixel sign next to the title | smallest: one border rule + the sign in the title |
| B · Inside the crate | dark inside, the crate's yellow bevel on the edges, a tape strip on top, yellow title; the sign fades to green slowly like the crate's own (his C pick) | largest: new panel + slot colours; the one moving part is the sign, off in Lite Mode |
| C · Taped label | grey box kept, a tape band under the title with KARANTINA on a yellow label | small: one extra element |

All three use only the crate's own object colours (yellow #F2C318, black #141414, the sign's green) - the object exemption his 2026-09-27 green-waves ask set; no glow, no white line.

## Decision

**DECIDED 2026-09-29 — C, the tape band with no word** (his *"tape band is the one that i like the most"*), labels in English (*"use Quarantine instead of karantina we will add language switching int he future"*; prototype v14). "Both crates" became a bigger ask - a quarantine chest for the regional warehouse in Fleet & Roster: [[2026-09-29_warehouse-quarantine-and-account-move]].

## Rejected on purpose

- A full yellow panel: a large flat accent fill reads "raw" to him (2026-09-24, "i dont like that raw color dominating the panel").
- Moving hazard stripes or pulsing rings: he turned down loud effects on this crate once already (2026-09-27, "the radioactive effect it is too much").

Models applied: Inversion (what makes the box look cheap? a raw slab or a loud loop - both left out), Reversibility Test (all three are CSS on one class; any pick can be undone in one commit).

**2026-09-29 08:29:** on C he said *"erase the text, the biohazard line is enough for decoration"* - v13 drops the KARANTINA label, the band stays. Read as leaning C; the pick and the both-crates answer are not confirmed yet.
