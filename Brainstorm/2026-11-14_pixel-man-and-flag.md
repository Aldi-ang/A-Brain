---
title: Pixel man and the flag
date: 2026-11-14
status: DECIDED — A, plant it
confidence: medium
checked: 2026-11-14
---
# Pixel man and the flag (2026-11-14)

## PROBLEM (his words)
> *"actually i like the pixel guy better, but instead of opening chest we should do something to make it look like its interacting with the flag instead, what do u think?"*

He kept the pixel man over the three new looks (A patch, B location pin, C flat figure; board 2tnxGyfVT1Fr9hJqVRyE7c).
Today (kpm `src/components/Expedition.jsx` 199-200): at a shop the man swaps to `sellerHtml` - hands up holding the app's
coin - at every shop, whatever the result (closed shops too). On the parked map pins (branch wip/map-pins, aff36c89)
the chest became a flag, so he now holds a coin beside a flag and touches nothing.

Board: `Raw/2026-11-14-man-flag/board.html`, artifact https://claude.ai/artifact/N2RJeQQbiZMzCwQxFKZsQZ.

## OPTIONS
| | What he does | Rest / Lite picture | Time |
|---|---|---|---|
| A Plant it | lifts the pole, stabs it into the ground (dust ring), the cloth unrolls, then the wave | hand on the pole, flag open | wave starts 0.52 s, ends 2.52 s: the 2.4 s moment window grows a little |
| B Hoist it (my pick) | the pole pops up, three pulls, the flag climbs 5 px a pull and waves while it climbs | hand on the pole, flag at the top | climb done 1.15 s; wave 0.24-2.24 s as built |
| C Cheer | the flag rises by itself (as built), he jumps twice with both arms up | standing beside it | as built |

## COSTS
- All three: new poses in mapSprites (reach, pull; 11 columns, the 11th is his fist on the pole), `sellerHtml`
  replaced, the man's icon 30 -> 33 px wide and anchored so his fist lands on the pole (x 7 of the flag), Day Replay's
  man the same; the coin pop leaves the man (the flag's word and colour already say SALE / ORDER).
- B: the cloth's 3-step climb replaces `kx-raise`; the pulls and the climb must share one clock.
- A: a furled-cloth state (the board squeezes the cloth to 12 % width; at zoom the word squashes into stripes).
- C: the smallest change, but he only celebrates next to the flag - the weakest "interacting".
- Seen on the board: at 5x the first poses showed his hand beside the pole, not on it (arm and pole share a column).
  Fixed by moving him 3 px left and giving the fist its own 11th column.

## Models applied
Second-Order Thinking (the coin is a money prop shown even at a CLOSED shop; working the flag says nothing about the
result, the flag does) · Inversion (what makes it read wrong: the hand not on the pole - the 5x frame caught exactly
that) · Opportunity Cost (C costs least and buys least).

## DECISION
**A - plant it** (his 2026-11-14 08:05: *"plant it looks the best"*), over my pick B. Built in kpm 10a66db7 (wip/map-pins, not live). Day Replay left as is: his call.

## REJECTED ON PURPOSE
- He walks away after planting: where the man stands comes from the live team data, not from the moment.
- A rope drawn from his hand to the cloth: 1 px at map size, noise.
- Keep the coin in his other hand while he hoists: two props, and the coin lies at a closed shop.
