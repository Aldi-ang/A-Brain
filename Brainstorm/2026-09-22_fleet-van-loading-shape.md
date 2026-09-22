---
title: "Van loading — its own segment, or a panel inside Fleet & Roster?"
description: The 2026-09-22 talk Aldi asked for before the Fleet & Roster redesign. Both shapes drawn on the real screens (phone 518 + PC 2000x1000), measured, costed. OPEN — waiting on Aldi.
type: brainstorm
created: 2026-09-22
updated: 2026-09-22
status: SHAPE DECIDED (A, the panel) — round two OPEN: the roster look and the loading motion
tags: [fleet, van-loading, design, decision, aldi-asked]
---

# The problem, in his words

> *"i also want to redesign how the regional admin put item to the agent inventory that is the
> logic that i want to change actually is it better to make another segment or just make another
> panel inside the fleet and roster is something we should talk about on the next job"*
> — 2026-09-22 15:05

So the decision is about SHAPE, and it comes before the repaint. The Fleet & Roster redesign
follows whichever shape he picks — see [[Redesign Receivables and Fleet - logic must survive]].

## What the loading job is today (measured, not remembered)

`src/FleetCanvasManager.jsx` (1498 lines) is one screen with two columns: the roster on the left,
the "loading dock" on the right. The dock's TRANSFER TO VEHICLE VAULT box takes **one product at a
time**: choose a product from a `<select>`, type a qty in Bungkus, press LOAD → `handleLoadCanvas`
runs one `runTransaction` (warehouse → van). Loading a van with five products is five passes
through that box.

Measured in the pane at 518 (`?shell&fleet&tab=budi`, the regional admin's view):

| | value |
|---|---|
| where the loading box starts on the phone | **y = 1001 px** — a full screen below the fold; the whole roster scrolls past first |
| roster block height, 4 people | 922 px (it grows with the team) |
| product pickers on screen | 1 `<select>`, one product per press |
| stock writes for 3 products | 3 — one transaction per press, and that does not change in either option |

## The two options (boards in `Raw/2026-09-22-fleet-loading/`)

Both carry the SAME new loading logic — a basket: search the branch stock, add several products,
each line with its own unit (Bks / Slop / Bal / Karton) and a live "= N Bks", one total, **one
press**, one surat jalan. The options differ only in WHERE that basket lives.

| | A — a panel inside Fleet & Roster | B — its own segment in the sidebar |
|---|---|---|
| where | same screen; MUAT on a person opens the bay in the right column (a sheet over the roster on the phone) | a new page: person → goods → surat jalan, with the day's loading history beside it |
| phone, first product field | **341 px** down, LOAD key at 789 — no scrolling | **304 px** down |
| who it fits | the admin who is already looking at his team | the admin whose morning job IS loading vans |
| Fleet & Roster afterwards | keeps hiring, the roster AND the loading job | keeps hiring and the roster only; the dock moves out |
| new surface | none — one file | a new file, a new tab in App.jsx, a sidebar entry, a second place that gates on `canEditFleetRoster` |
| firestore rules | unchanged (same collections, same paths) | unchanged (same collections, same paths) |
| reversible? | yes — it is a layout change inside one file | harder: a tab people learn, then unlearn |
| rough cost | **~1 session** | **~2 sessions**, and Fleet & Roster still needs its own repaint after |

## Recommendation: A, the panel

1. **The job starts with a person, and the roster is where people are.** A module has to re-solve
   "which salesman" as its own step — that is the step B's board shows as "1 ORANG".
2. **It is the reversible door.** A panel is a layout change in one file; a segment is a tab in
   the sidebar, a second `canEditFleetRoster` gate, and something to take away again if he changes
   his mind. The [[Fleet Captain Permission Gap]] history says every new gate is a chance to
   re-open the same bug.
3. **The win he asked for is the basket, not the address.** Both options deliver it. A buys it for
   half the cost.

**not-chosen: B, its own segment — lost on cost and on a second permission gate. It flips if the
loading job stops being "look at my team, then load one of them" and becomes the morning's own
routine — e.g. a warehouse person who loads six vans in a row and never hires anybody, or if
Fleet & Roster grows a third job on top of these two.**

## The trap either shape must not walk into

`handleLoadCanvas` and `handleClearCanvas` are the two transactions the Backlog says never to
touch — every comment inside them records a bug that already cost a session. So the basket LOOPS
over them, one call per line; the admin presses once, but **the writes are still one per product**,
and each call reports through `notify()`. One press must not produce five toasts: the basket needs
one summary report at the end ("Van Budi: 3 barang · 760 Bks"), which means the report — never the
transaction — is what gets a flag.

## Rejected on purpose

- **Loading straight from the warehouse screen (Restock Vault).** That screen is about stock coming
  IN; the van is stock going out to a person. Two different questions, and the person is missing.
- **Keeping the one-product box and only repainting it.** The repaint was never the ask — he said
  the LOGIC is what he wants changed.
- **Loading several people in one basket.** Each van is its own document and its own surat jalan;
  one basket across people makes a partial failure unexplainable.

Models applied: Chesterton's Fence (why the dock sits beside the roster at all), Reversibility Test
(a tab is a one-way-ish door, a panel is not), Opportunity Cost (a session spent on B is a session
not spent on lot tracking).

Related: [[Aldi's Design Taste]] · [[Fleet Captain Permission Gap]] · [[Logistics and Stock Movement]]

---

# ROUND TWO — DECIDED: A, the panel. Now the look and the motion (2026-09-22, 19:00)

> *"if we can put inside the fleet and roster then lets just do that, make sure that there is animation on doing
> loading and i want better UI than that for our roster, cool if we have some 3D animation as well can u think of
> something cool"*

So the shape is settled — the loading bay is a PANEL inside Fleet & Roster — and two new questions open with it.

## Question 1 — the roster look (board-roster.png, board-roster-phone.png)

| | what the row becomes | costs |
|---|---|---|
| A — the bay plate | photo, number plate, and the van's fill right now (484 of his usual 600) with the LED | ~half a session |
| **B — the van crate (3D)** | the same thing, but the person's slot is a real `.kpm-cube`: a loaded van is a deep crate, an empty one a flat pallet, and it turns once when you pick him | ~half a session — the cube already exists |
| C — the region folder | the warehouses as folders (Bandung open, Semarang shut), people inside; same family as Customers and Sampling | ~half a session |

**Recommended B.** He asked for 3D, and `.kpm-cube` in theme.css is 3D the app already owns — driven by each ware's
true millimetres in the sales terminal. So B answers the ask with a REUSE rather than a second 3D engine, and the
depth carries the meaning, which means the information survives Lite Mode with the turn switched off.

**not-chosen: C, the region folder — lost because the regional admin only ever sees ONE region (the roster filters to
his own), so a folder per warehouse is a drawer he opens every time with nothing beside it. It flips the day a global
admin works this screen across regions, which is exactly what the HQ view does.**

## Question 2 — the loading motion (board-motion.png)

| | what happens on one press | costs |
|---|---|---|
| **1 — the cargo flies** | each line leaves as a crate and lands on the tally, one after the other; the figure pumps, the van's MUAT key dips. ~1,2 s | ~half a session |
| 2 — the surat jalan stamps | a gold line sweeps the list, each row greys as it is counted, SURAT JALAN seals. ~0,8 s | ~quarter session — it is the shipped docket's own kpmScan / kpmSeal |
| 3 — the roller door | the bay shutter comes down over the list, MEMUAT… through the slats, lifts on a loaded van. ~1,1 s | ~half a session |

**Recommended 1.** It is the only one of the three that shows the GOODS moving, and the thing being reported is goods
moving. 2 reports paperwork; 3 reports waiting — and a door that covers the list hides the numbers while it runs,
which is the one thing his Lite Mode law forbids an animation from doing.

**not-chosen: 2 — lost on meaning, not on cost (it is the cheapest by far and it is already in the app's language).
It flips if the surat jalan becomes the point of the moment, e.g. if loading has to be signed for on the spot.**

## What the motion must not do (either way)

- It never hides a figure. `.lab-door` in the mock covers the list and that is exactly why 3 is not recommended.
- It runs ONCE. No loop, no forever-turning crate — the 2026-09-18 blinking-lights rule.
- Lite Mode and reduced motion stop it through the app's global rules, and what is left must still read: the crate
  parks at three-quarters, the tally shows its number, the seal is simply already there.
- One press is still one write per product (handleLoadCanvas is untouched), so the motion's job is to make ONE report
  out of several writes — never to imply a single transaction.

Models applied: Inversion (what would make the loading moment feel worse — hiding the numbers), Second-Order Thinking
(a roster row that shows van fill changes what the admin does before he loads), Chesterton's Fence (why the cube
exists at all, and why it is driven by millimetres).
