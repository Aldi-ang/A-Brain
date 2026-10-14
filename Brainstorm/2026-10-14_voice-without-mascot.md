---
status: OPEN — waiting on Aldi (A / B / C)
date: 2026-10-14
confidence: likely (code chain read end to end; not yet observed on a phone screen)
checked: kpm src/MerchantSalesView.jsx:455-467, 486-526, 1145-1161, 2101, 2903; src/components/CapybaraMascot.jsx:111, 182-184, 286; src/App.jsx:3241-3249, 5590; dist/assets/index-RIQs1GNC.css (.kpm-alcove at 12691, .hidden at 201895)
---

# The capybara talks with nobody on screen

## The problem, in his words

2026-10-14 19:1x: *"i oftenly hear the 1 words or 2 words without any mascot showing up btw can u check the problem for that one also"*

## Root cause (likely)

On the phone (under 1024 px wide), inside the sales terminal:

1. The cave the merchant stands in is `hidden lg:grid` (MerchantSalesView.jsx:2101). Under 1024 px it is `display: none` (`.hidden` comes after `.kpm-alcove` in the built CSS, so it wins).
2. The terminal watches that cave with an IntersectionObserver (486-505). A `display: none` element never intersects, so `alcoveOut` goes true at once.
3. `alcoveOut` -> `floatShown` true (509-515) -> `CAPY_SUPPRESS {on: true}` (521-523) -> the corner capybara is muted for the whole visit (CapybaraMascot.jsx:286, `showMascot = !suppressed && ...`).
4. The "corner figure" that was supposed to replace him is `hidden lg:block` (2903+), so it is invisible on the phone too.
5. Every merchant line still calls `speakMumble`: adding a product, picking a customer, a verified new outlet (`triggerMerchantSpeak`, 455-467, at most once per 6 s) and the deal line after a sale (1151). The lines are 2-4 words ("Good pick.", "Aye, one more.", "Ah. This one.") - his "1 words or 2 words".

The deal path even says it wants the corner appearance on the phone (1155-1161 dispatch `CAPY_COMMS` below 1024 px) - but step 3 has already muted the corner capybara, so it never shows.

Smaller, rarer paths with the same shape:
- App.jsx:3247 `triggerCapy` speaks every line, even when the mascot is muted (sales terminal), or not drawn at all (vault gate up, photo cropper open - App.jsx:5590).
- CapybaraMascot.jsx:111 speaks any plain-text `CAPY_COMMS` line before checking the mute (the Map's "Sector Configuration Saved!" at MapMissionControl.jsx:628).

## Options

| | What he gets | Cost |
|---|---|---|
| A | On the phone the merchant pops up in the corner each time he talks, then leaves (like the deal line was meant to). The terminal mutes the corner capybara only when its own corner figure is really on screen (1024 px and up) | MerchantSalesView.jsx only (the mute + the chatter path). Must check he does not cover the basket drawer (fixed bottom, z-150) on a 375 phone |
| B | On the phone the merchant stays silent - no voice when nobody can be seen | Smallest change; he loses the merchant's voice on the phone |
| C | A small merchant face inside the phone terminal itself, talking there | New design - frames first, his pick, then build. Biggest |

Plus, for all three: one guard so the capybara never speaks a line while he is muted or not drawn (App.jsx:3247 + CapybaraMascot.jsx:111).

## Decision

OPEN — waiting on Aldi. My pick: A + the guard (the code already wanted A; it costs one file).

## Rejected on purpose

Nothing yet.

Models applied: Inversion (what would make a voice play with nobody shown - every speak call with no visibility check), Second-Order Thinking (A puts a figure over the phone's basket every 6 s - check the overlap before building).
