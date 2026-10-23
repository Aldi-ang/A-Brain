---
title: Presentation - let viewers experience the app, not read about it
created: 2026-10-23
status: DECIDED 2026-10-23 - A
---

# Let viewers experience the app

## The problem, his words (2026-10-23)
*"for further immersive experience actually i want the viewers to experience how this app really work and let them know by showing them not just telling them how this app is, and experience from the storing item coming from production to the mastervault, master vault shipment to regional warehouse, putting item on the motorist backpack, doing sales and EOD at the end, stock opname and also returning item and showing the quarantine item and giving them feeling on how the interaction work in this app, can view the maps, journey plan, even the smallest detail like dragging item from warehouse chest to motorist chest, but looks like we have limited quota this week btw"*

## What already exists
The app has a demo build (`src/components/DemoFrontDoor.jsx`, IS_DEMO). It is invite-only: Google sign-in, then pick one of five REAL accounts (Owner, HQ Sales Manager, Regional Admin, Sales Canvas, Motorist), and it resets every night (`api/_demoCompany.js`). Every step on his list already works there for real: Master Vault receiving, shipment to a regional warehouse, dragging from the warehouse chest to the motorist chest, the sales terminal, EOD, stock opname, returns and quarantine, the maps and the journey plan.

## Options
| | What the viewer gets | Cost to build | Catch |
|---|---|---|---|
| **A (my pick)** - a guided "mission" inside the real demo | The real app, real drags and screens. A small step card on top says what to do next (1 receive production in the Master Vault -> 2 ship to the regional warehouse -> 3 drag into the motorist's backpack -> 4 sell -> 5 EOD -> 6 opname -> 7 return -> quarantine) and ticks itself when the step is done. The presentation gets a "Coba sendiri" button | ~2-3 sessions (the screens exist; only the step card, the step checks and the seed data) | invite-only: each viewer's Gmail must be on his demo list, which he already manages in the demo sheet |
| B - a playable copy inside the presentation | Anyone with the link, no login. Each step hand-built as a mini screen (vault, chests, backpack drag, terminal, EOD, opname, quarantine, map) | ~6-10 sessions; with this week's limited quota, weeks | a copy, not the real thing; it can drift from the real app |
| C - recorded walkthrough clips in the slides | Showing, not doing | medium, but recording needs a signed-in demo session (Claude does not sign in) | not interactive, which is the point of his ask |

## Decision
DECIDED 2026-10-23: A, his words: *"A is efficient i guess"*. First slice = steps 1-3.

## Rejected on purpose
C as the main answer: his ask is the feeling of the interaction ("giving them feeling on how the interaction work"), and a clip gives none.
