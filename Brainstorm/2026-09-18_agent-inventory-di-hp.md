---
title: Agent Inventory on the phone — what 375 px measured, and the two boards on the table
description: The phone sweep reaches the Agent Inventory (AgentInventoryView, the salesman's van manifest). Mounted as T5 Budi in the real shell (kpm b1c77d8, ?shell&agent), measured at innerWidth 375 in both themes, two proposals rendered through ?css= and sent as two boards. OPEN — waiting on Aldi (YES/NO on board 1, A or B on board 2).
type: brainstorm
created: 2026-09-18
updated: 2026-09-18
status: OPEN — waiting on Aldi
confidence: high
checked: 2026-09-18
tags: [brainstorm, phone, agent-inventory, sweep, 375]
---

# Agent Inventory on the phone (2026-09-18, 08:04–08:20)

## The problem

Same sweep rule as the terminal and Customers (his 2026-09-15 order: Sales Terminal ✓ →
Customers ✓ → **Agent Inventory** → EOD Setoran → Stock Opname → Journey Plan → Sampling → Agent
Profile). This is the salesman's own van on his phone — what he carries and what he can sell.
Never measured at 375 inside the shell after the `p-2` cut.

Mount: `App.jsx:4253` renders `<AgentInventoryView>` with NO wrapper. The screen finds its
motorist by EMAIL first and by `agentProfileId` second (`AgentInventoryView.jsx:53-58`), then
listens to ONE document, `artifacts/{appId}/users/{userId}/motorists/{trueAgentId}`, and reads
`activeCanvas` (rows carry `productId, name, qty, unit`). The lab stub had no document-snapshot
shape (`exists()` / `data()`), so `tools/lab-firestore-stub.js` learned one, and `doc()` now
joins its id segments like the real API. Lab: `?shell&agent`, `?tab=quarantine` (kpm `b1c77d8`).

## What measured (375, dark and light, innerWidth 375 in the same probe)

| thing | today |
|---|---|
| the component | `h-[850px]` fixed on phones (`lg:h-[calc(100vh-120px)]` on the desk). The shell's scroller is 678 tall → the page scrolls 188 px AND the list inside scrolls in a 366 px window. Two scrollers under one thumb |
| header (agent name + 4 cards + Projected Value) | 424 px tall, `p-4`; first product row starts at y 642 — below the middle of an 812 screen; 1.7 rows visible |
| Load / Modal / Cash / Cukai Due cards | 2×2, 159 wide, 63 / 87 tall; money 12–14 px (`Money` auto-fit by string length) |
| Projected Value box | 151 px: title + three 29 px rows (Ecer / Retail / Grosir) — `grid-cols-1` at 375, `md:grid-cols-3` on the desk |
| Saleable / Quarantine toggle | 36 px tall (`py-2`) |
| product rows | 74 tall, 326 wide; name `truncate` → "Gudang Garam Surya 12" cut at 154 px (scrollWidth 193) |
| 10 px text | "Projected Value" label, `[3 Bal]` unit chips, "Today" in the sales rows, "No Samples Today", quarantine "Rusak / Basah", "Origin:", "Tx ID:" — nothing under 10 |
| wider than 375 | nothing |
| light mode | zero white boxes (no inputs on this screen); body `rgb(210,201,180)` |
| sales rows | 77–97 tall; fine |
| quarantine view | one 143 px card per returned item; fine |

## The two boards (`board1.png`, `board2.png`, headless 518 with `#root{width:375px}`, cropped to 375)

1. **One scroll + 44 + full names** — phone only: the component drops its fixed 850 height and
   the inner `overflow-y-auto` (`h-auto lg:h-[calc(100vh-120px)]`, `lg:overflow-y-auto`), so the
   shell scrolls the whole screen once; header `p-3 lg:p-4`, gap 3; toggle buttons `min-h-[44px]`;
   `h4` name wraps (`whitespace-normal lg:truncate`); 10 px chips → 11. Measured: header 401,
   toggles 44, first row 627, one scroller (root 1454 = page 1470). **Recommended.**
2. **The Projected Value box** — A: three columns at 375 (the `md:` layout ported; 107 px, money
   12 px in 103 px columns, no overflow; first row 581). B: folded behind its title line
   (`PROJECTED VALUE · SHOW ▾`, 42 px, a tap opens the rows; first row 516, one more product above
   the fold). **B recommended** — the same fold he approved for the Customers form; the
   projections are a report a salesman reads once at load time, Cash he reads all day.

## What each costs

| board | costs |
|---|---|
| 1 | nothing visible on the PC (`lg:` resets). Sales + Samples sections now sit at the bottom of one long page instead of inside the box — reachable by the same thumb, not a second scroller |
| 2A | 12 px money in three columns; a long figure (Rp 100.000.000+) drops to 10 px through `Money`'s length rule |
| 2B | one tap to see the three figures; a `useState` for open/closed (closed by default on phones, always open on the desk); the fold label's language — this screen's copy is English throughout ("Saleable", "Load", "Cukai Due") |

## Models applied

Inversion (what makes a van screen useless on a phone: the list you came for below the fold and
under a second scroller) · Chesterton's Fence on the fixed 850 height — it exists so the desk has
its own scrolling list under a pinned header; on the phone the shell already scrolls, so the fence
guards nothing · Second-Order on the fold: the salesman loses one tap, gains one row every time he
opens the screen.

## Decision

OPEN — waiting on Aldi: 🔴 board 1 YES/NO · 🔴 board 2 A or B.

## Rejected on purpose

- **Moving the product list ABOVE the money cards** (the "lookup before the form" instinct from
  Customers). The header carries the agent's name and the day's Cash; putting the manifest above
  it is a structure change he did not ask for — "structure changes need his ask; surface changes
  do not" (2026-09-17).
- **A three-board split with the 44/wrap fixes alone** — they are settled taste now (his
  2026-09-17 "yes to all"), so they ride inside board 1 instead of asking again.
- **Translating the screen's English copy** while here — a wording job, queued, not this sweep.

## Left alone

Money sizes (12–14 px, auto-fit by length — his 2026-08-19 fix); the sales and quarantine rows;
the four 2×2 cards.
