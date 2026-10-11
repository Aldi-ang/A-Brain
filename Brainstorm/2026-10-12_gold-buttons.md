---
title: The solid amber buttons (Customer Directory, Sampling)
status: DECIDED - A, built kpm 5aef4dc
tags: [kpm, design, palette, brainstorm]
---

# The solid amber buttons

**Problem, his words (2026-10-12 05:47, four screenshots):** *"and the yellow background onm some button inside the customer directory is not inline with our theme and its hurt the eye , i want it to have better colouring and effect"* + *"sampling also have those button, please fix that too"*

**What they are:** `bg-[var(--gold)] text-[var(--gold-ink)]` solid fills with a glow - Customer Directory (Find Duplicates, Data Scrub, Import Map Marker (KML), Auto-Find, Save Customer - src/components/CustomerManager.jsx) and Sampling (New Sample, View Analytics - src/components/SamplingManager.jsx ~477-480). His own rule from the hub (round 2): *a gold EDGE on the dark plate, never an amber fill*.

| # | What | Cost | Risk |
|---|---|---|---|
| A (MY PICK) | dark plate #14110e, 1.5 px gold edge, gold icon, cream text; press = lights up from inside | one shared class for both screens | a main action no louder than a tool |
| B | dark bronze gradient plate, thin light line on top, cream text | same | warmer, a little heavier on a dark page |
| C | A for every tool; the ONE main action per screen (Save Customer, New Sample) a muted bronze fill #9a6425 | same + a "main" variant | two styles to keep straight |

**Board (sent):** `Raw/2026-10-12-buttons-bell/buttons.jpg` (his real seven buttons, today vs A / B / C).

**Decision:** A - his paste line 2026-10-12 06:00: *"buttons = A"*. **BUILT** kpm `5aef4dc` (local): one class `.kpm-edgebtn` in theme.css on the tokens (`--plate`, 1.5 px `--accent-edge`, word `--ink`, icon `--accent-ink`), worn by the seven (+ Repair Store Tiers, same class). One change from the board: the press "lights up from inside" as a warm FILL (`color-mix(accent-edge 22%, plate)`), not an inset glow - the audit forbids any shadow in the system (Lite Mode deletes them, so nothing may depend on one). Measured at 1280: dark #14110e / #D08A2E / #E8E4DE; light #C6BFAE / #7A5A12 / #131211. Guard: logicFixes "THE AMBER BUTTONS GET A GOLD EDGE" (red: 7 x FILL). NOT changed, still solid amber (outside his two screens' list): the phone ADD NEW CUSTOMER bar (CustomerManager ~1352), Approve NOO (~1722), the two count chips (~1305/1310), Sampling's range tabs (~128), Submit (~320), the modal button (~593).

**Rejected on purpose:** keeping any bright amber FILL at full strength - his "hurt the eye" and his own edge-not-fill rule.

**Models applied:** Inversion (what makes a button style fail here: seven equal shouts - today; or no way to tell the finishing button - A alone, hence C); Second-Order Thinking (a shared class changes every button that uses it - list them before building).

## Same message, other asks

- *"and i want to ask what is the function of the circle color in the musix box"* - ANSWERED: the volume knob of the music player (src/MusicPlayer.jsx:169, `accent-[#ff9d00]` range input); its track (#3e3226 on a near-black pill) is nearly invisible, so the knob looks like a lone dot. Not changed - offered with the buttons.
- *"i want u to add dates and day and time inside the notification bell as well so i know the exact details, so we add sunday, 10 february, 10.21 for example"* - BUILT (kpm, see PROGRESS): `bellTime` in src/utils/missedLog.js -> "Sunday, 11 October, 10.21", on its own line under each message in both lists. Frame: `Raw/2026-10-12-buttons-bell/bell-phone.jpg`.
