---
title: Sales Terminal arrival flow + left Manifest panel
type: brainstorm
created: 2026-10-31
---

# 2026-10-31 - Sales Terminal: status on arrival, ORDER opens the terminal, Manifest slides from the left

Written 20:19 WIB. Plan only.

## The problem, in his words
*"we need to make a change in sales terminal make it simpler, whenever salesperson in range with the stores, it will have option to show the status to be updated, could be stock full, competitor issue, or even closing, if closing then the app should show the sales terminal in full, this way input is much quicker when done in the phone by salesperson. so the flow will be stores close, open option of updated for the stores, if order then show the salesperson terminal in full and the manifest panel need to be moved to the sidebar on the left and can be pulled so that the sales person can see the manifest just with a side slide instead of moving up and down to check"*

## What exists
The Journey Visit Report already has his statuses - `VISIT_TAGS` (kpm `src/utils/dayLog.js:21`): Routine Check, Repeat Order, Stock Full (No Order), Competitor Issue, New Request, Store Closed. One function, one control: the terminal reuses that list and that save.

## Options
| Reading of "closing" | What the shop gets |
|---|---|
| closing a DEAL (= order) | full terminal opens |
| shop SHUT (= Store Closed) | one-tap status, visit done |

## Decision
ANSWERED 2026-10-31 20:38: closing = closing a DEAL (his *"its mean A"*). Next: frames (375 + 1440 + Lite) and one DECIDE. Brief: kpm `.claude/NEXT-SESSION.md` top block.

## Rejected on purpose
- A second list of statuses in the terminal (his one-function-one-control rule) - reuse VISIT_TAGS.
- Building before frames (his show-him rule).

## The board (2026-10-31 21:04 WIB) - DECIDED: his *"yes build that but change the fill color on the take order because it is too bright"*
`Raw/2026-10-31-arrival-flow/board.png` - 12 frames on the real lab terminal (`?shell&terminal&many`, GPS pinned on Toko Berkah Jaya over CDP so the terminal locks the shop itself), phone 375 dpr 2 with touch media, light, Lite, PC 1440. Sent with one 🔴 DECIDE: build it like the gold frames?

| Step | Today | After (drawn) | Cost he has not priced |
|---|---|---|---|
| 1 reach a shop | shop picked, nothing asked; a "stock full" visit means leaving for Journey | sheet: shop + "0 m · GPS ✓", TAKE ORDER (60 px), 4 one-tap statuses (56 px) + Routine Check (48 px); New Request asks one line | a GPS watch while the terminal is open (today it checks once) |
| 2 order | Manifest pulled UP covers 447 px of wares | left panel 323 px, tab rides its edge (tap = close) | none on screen; every pin naming DRAWER_ must move on purpose |
| 3 tucked | bottom bar 104 px always shows total + last ware | wares get +104 px; 20 px tab at the 25 % band (mirror of the menu ribbon), count on it | total no longer always visible -> a flag slides out of the tab for 2 s after each + |
| PC | Manifest is already the left 420 px column | unchanged; only the arrival card is new | - |

Facts found while drawing:
- The terminal checks GPS ONCE (open, shop cleared, or the button) - `MerchantSalesView.jsx:449-451`, no `watchPosition`. Journey has one (`JourneyView.jsx:267`). "Whenever in range" needs the same watch, foreground only.
- Re-lock loop: after a status is saved the shop clears, `verifyLocation` runs again and the SAME shop (still under 50 m) locks again -> the sheet would reopen forever. Skip shops already reported today (`lastVisit === today`).
- The save must be Journey's shape exactly (`JourneyView.jsx:938-951`): `lastVisit`, `lastVisitNote "[tag] note"`, `lastVisitTag`, `lastVisitedBy`, `openRequest` for 📝, audit `VISIT_REPORT` with `{ storeId, tag, agentId }` - DayReplay + dayLog `readReport` parse that sentence.

## Built (2026-10-31 21:50 WIB)
As drawn, except TAKE ORDER = the ware "+" plate (dark fill, amber edge + ink). Frames from the real code: `Raw/2026-10-31-arrival-flow/built/board.png`. Found while building: index.css `button:has(> svg:only-child)` (min-height 44px, made for icon-only buttons) also catches an icon + bare-text button and beats `min-h-[60px]` - the words go in a `<span>`. The re-lock loop was solved without touching the auto-lock: the sheet asks once per shop per day, and a GPS-picked shop is let go past twice the fence with an empty manifest.

## Rejected on purpose (board round)
- Opening the panel by a swipe from the screen edge: iPhone Safari uses that swipe for "back". Tap the tab; a drag that starts ON the tab is fine. Installed app (manifest `display: 'standalone'`) has no such swipe.
- A 44 px wide tab: it would sit over the ALL chip and the ware pictures (they start 20-24 px in). 20 px, like the 14 px menu ribbon he already uses.
- Changing the PC: the Manifest is already its left column.
- A new status form: the sheet is Journey's six tags, same words, same save.

Models applied: Chesterton's Fence (the drawer holds offers, the promo box, the photo and SIGN - each moves on purpose), Opportunity Cost (seat limit waits behind this), Inversion (what does losing the bottom bar take away? the always-on total -> the flag), Second-Order Thinking (save -> shop clears -> same shop re-locks -> loop).
