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

## 2026-10-24 ~19:40 - DECIDED B, plus a hint key (his words in Wiki/Concepts/Aldi's Design Taste.md, 2026-10-24 section)
*"b is easier to see and better if u add circle or square just to show what to do and also blur other outside of the box, but of course this will work as a hint button like in some puzzle game ... dont forget use indonesian language"*. Frames of B in Indonesian with PETUNJUK pressed (phone, phone Lite, PC): `Raw/2026-10-24-mission-card/mission-hint-board.png`, draft kpm `tools/mission-draft.jsx`. Next: build it for real in the demo (steps 1-3).

## 2026-10-24 - the step card: where it lives (was OPEN, answered above)
Board: `Raw/2026-10-24-mission-card/mission-board.png` (real lab frames, `?shell&places&tab=kirim&mission=a|b`, phone 375 + PC 1440; draft in kpm `tools/mission-draft.jsx`, lab only).
Facts read for it [certain, kpm 2026-10-24]: steps 1-2 = the Owner (T2 HARTONO SUSILO has `view_master_vault` + `view_restock_vault`), Master Vault MASUK then KIRIM; step 3 = the Regional Admin (T4 HENDRA GUNAWAN, FLEET_CAPTAIN) loading the motorist T6 DIKA SAPUTRA. So the mission needs one SWITCH between step 2 and 3, and the card says so on step 3.

| | What | Cost |
|---|---|---|
| A | a card in the bottom-left corner; PC lists all 3 steps, phone only the live one | sits on top of the screen (phone: covers 255x63 px of the form) |
| **B (my pick)** | one line under the DEMO bar's tape; phone = live step + 3 bars, PC = all 3 steps in the line | the screen moves down 34 px; covers nothing |

Both: a done step's line turns into what happened ("120 packs received in the Master Vault") - a REPORT, not a hint, so it survives his 2026-09-15 "no hints panel" and 2026-10-19 "this tutorial is not needed" rules; text 14 px; amber only as an edge/ink.
Why B: his pinned-thing rule (one line, and it is the first thing to answer), his "zero space" picks (2026-10-15), his width split (phone one thing, PC everything) inside one strip, and it lives in the DEMO bar he already approved (one door).
Models applied: Inversion (what makes a viewer quit: a card covering the very field the step asks them to fill), Second-Order (a corner card fights the capybara and the phone drawer for the same corners).
REJECTED ON PURPOSE: a how-to paragraph on the card (his 2026-10-19 cut); a separate tutorial button (his 2026-08-31 "one door").

## 2026-10-25 ~09:00 - the capybara talks the viewer through it, RPG style
His words: *"for the demo i want some perfect dialogue between users and the capybara like in the RPG game and gives us tutorial for the app https://www.youtube.com/watch?v=1198z5dDc8g i want u to learn from this and also i want u to use higgsfield to create image for the capybara with several emotions for this dialogue animation, i just want simple image and textbox and blur everything behind it dont need any moving animation, just snap image between conversation"*; *"another free image generator u can use is actually dreamina"*.
- The video ("How to make the Perfect Dialogue System", Apox Fox, ~14 min, watched 2026-10-25 with frames + captions): three zones - the text box, a big character portrait bottom-left standing over the box edge, and the scene above; a slanted name plate on the box; one portrait per EXPRESSION (neutral, happy, sad/scared, angry, confused) swapped per line; lines are a numbered list, choices jump ahead in the list ("choose your own adventure"); his own lesson: art early was procrastination - build the system on stand-in art first.
- Built as a lab draft: `kpm tools/capy-talk-draft.jsx` (mounted by `tools/mission-draft.jsx`, `&talk=step2|step3|error|worry|done`). Lines follow his 2026-08-30 rule (audit G56): no aku / kamu / Anda / kita, subject = factory / warehouse / app - asked him whether a dialogue character may break it.
- Faces: generated with the proven FLUX Kontext route from his merchant sprite (free HF quota, token file on the PC) - Higgsfield and Dreamina need his browser login on the PC, so they wait until he is at the PC.
- Cloud: he asked to move to the cloud; the image work cannot run there (no logins, no token), so per his own rule ("if this work is not possible in cloud session then forget it we can use the pc and remote version") Remote Control was switched on for this PC session instead.

## 2026-10-25 ~11:05 - BUILT into the demo (the one job): mission line + PETUNJUK + the capybara, with the Dreamina faces
- His answers that shaped it: the capybara says saya / Anda (*"dont use aku kamu on the dialogue, use anda dan saya instead"*); faces remade in Dreamina (see [[Capybara Art Generation]]).
- Where: kpm `src/components/DemoMission.jsx` (rendered by DemoBar, demo build only) + `src/config/demoMission.js` (steps, the 00:05 WIB day rule). A step ticks only when the screen's real save went through: Restock Vault MASUK (step 1) and KIRIM (step 2) and the van-loading bay (step 3) send `kpm-mission` right after their commit, behind IS_DEMO, so the real build compiles the send out (demoBuild.check proves it). Progress lives in the visitor's browser: a SWITCH reload keeps it, the nightly reset starts it over. A login that is not the step's person gets the shocked face and is sent to SWITCH (the square goes round SWITCH).
- Not proven in the lab: a real save end to end - the lab has no confirm-box host, so KIRIM waits forever there. Proven instead: the tick from the exact event the save sends (reported once, saved, survives a reload) + a self-check that pins each send AFTER its commit.
- Frames: `Raw/2026-10-25-capy-dialogue/mission-built-board.png` (phone dialogue, phone hint, PC, PC Lite).
- Models applied: Pre-mortem (what if a visitor is the wrong person for the step -> SWITCH line), Inversion (tick on press would lie -> tick on the saved write).
- 14:06 mistake + fix: the mission line showed on the Master Vault password screen - his words, with a frame: *"this mission shouldnt be there when user even not login yet"*. Cause: it was mounted by the DEMO bar, which shows from the Google sign-in on; nobody checked the screens BEFORE the app (vault gate, "pick who to be"). Fix kpm `b482d40`: BiohazardTheme passes `inside` (gate down + a real role) and the mission mounts only then. Lesson for anything hung on a bar that is always up: list every screen the bar is up on, not just the screen the feature is for.
