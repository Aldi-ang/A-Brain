---
title: Day Log on paper
date: 2026-11-14
status: OPEN — waiting on Aldi
confidence: medium
checked: 2026-11-14
---
# Day Log on paper (2026-11-14)

## PROBLEM (his words)
> *"also add paper like Todays log that can be printed when admin doesnt want to see the whole animation for each of the person to see its activities in a single paper page"*

The Day Replay (Journey Plan) plays a salesman's day as an animation. An admin checking a whole team does not want to
watch every replay; he wants the same day on paper. Two readings of "for each of the person ... in a single paper
page": one page PER person, or every person on ONE page - the board shows both.

Board: `Raw/2026-11-14-day-log-paper/board.html`, artifact https://claude.ai/artifact/9p4FCMUngPDqijLBvbuifL.

## OPTIONS
| | Sheet | Good for | Loses |
|---|---|---|---|
| A (my pick) | one salesman per A4: day numbers on top, a ruled list (time, shop, result, what happened, amount), the shops not visited, two signature lines; "Print all" = one sheet per man | checking one man's day line by line, signing it | the team at a glance |
| B | the whole team on one A4: a line per man (shops x/y, sales, total, first/last) + a strip of his visits across the day | the evening overview | per-shop detail |
| C | like A plus a drawn route (numbered stops from the shops' pins, not a map picture) | seeing the order he walked | room: smaller type, notes under each shop |

## COSTS
- All three read data the app already has: `src/utils/dayLog.js` `dayLog()` (events: time, shop, result, note, the sale
  with its items). No new write, no rule.
- Printing: `SaleReceipt.jsx` already writes a document into a new window and prints it - reuse that path.
- C costs the most: a route drawing to lay out so labels do not collide (the board needed a second pass for that).
- Not visited: needs the man's shops for that day (the road the map already draws), minus the visited ones.

## Models applied
Opportunity Cost (A first, B is a second view of the same data later) · Second-Order Thinking (a signed paper becomes a
record: whoever signs it has checked the day - two signature lines, nothing more) · Inversion (what would make it
useless: two pages for one man; the board keeps every option to one sheet).

## DECISION
OPEN — waiting on Aldi (A / B / C, and per person vs everyone).

## REJECTED ON PURPOSE
- A screenshot of the map in the print: map tiles print badly and slowly; C draws the route from the pins instead.
- Colour per result (gold / red / grey fills): photocopies turn it to mush; the word carries the result, gold only as a line.
- Printing the app page itself (window.print): the app's dark screens and menus would print too.
