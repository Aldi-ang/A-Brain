---
title: "Backlog — Index"
description: Folder index for Backlog/ — Kanban board of KPM tasks via Obsidian Bases. Pre-existing, separate from the Wiki ingest system. Added as part of PLAN-A-Brain-agentic-OS task 2.3.
type: index
created: 2026-07-27
updated: 2026-07-27
tags: [index, backlog]
---

# Backlog

Kanban-style task tracking for KPM work, viewed through `Backlog.base` (an Obsidian Base with
To Do / Ready to Deploy / Parked / Done views, filtered on each note's `status` field). Per
[[../CLAUDE.md|CLAUDE.md]], this is "separate, pre-existing, unrelated to [the Wiki ingest]
system" — it's a task tracker, not a knowledge page, so it doesn't go through `ingest`.

## Items here (as of 2026-07-27)

| Item | Status |
|---|---|
| 🔴 **SWEEP 2026-08-18 — START HERE** | **To Do — read first.** 75 confirmed problems from the 14-agent workflow sweep, ranked, plus the 3 order options to choose from. Every detail file below hangs off this one |
| **SWEEP — the sales terminal** | To Do — 16 findings. 2 HIGHEST (IOU rewrites the basket to Cash; a buyback never restocks) |
| **SWEEP — the map screen** | To Do — 15 findings. 2 HIGHEST (sector settings never save at all; "Pricing Tier" writes a game rank into the price field). Worst-affected file in the app |
| **SWEEP — App.jsx admin handlers** | To Do — 18 findings. 3 HIGH (damaged EOD goods not converted; hand-off matches by name; delete does nothing for a delegated admin) |
| **SWEEP — history reports and audit vault** | To Do — 7 findings. 1 HIGH (the edit box reprices Karton from a field that does not exist) |
| **SWEEP — agent profile ranks and awards** | To Do — 5 findings. 1 HIGHEST (**every agent is instantly max rank** — the ladder is in XP, the score is in rupiah) |
| **SWEEP — warehouse and restock** | To Do — 7 findings. Includes corrections to the two shipment items already listed below — read the corrections before fixing |
| **SWEEP — permission rules versus the screen** | To Do — 6 findings. 2 HIGHEST (customer "view only" does nothing; **anyone can claim your employee's email before they log in**) |
| **SWEEP — 22 claims that got KILLED** | Reference — do not chase these. Includes one that **contradicts the excise item below** |
| 🔴 **Name the five shortage causes** | **To Do — Aldi only.** The stock-count cause picker shipped 2026-08-21 with five words Claude invented. Saved records keep whatever string was used, so the list must be settled **before** agents count with it |
| **Test the new Stock Opname on a real screen** | To Do — Aldi only. Five features shipped in one day; the count screen has never been opened |
| Add production_targets Firestore rule | (see file) |
| Test the new Stock Opname on a real screen | **To Do — HIGH, only Aldi can do it.** Five features shipped 2026-08-21, none seen running |
| Business and UX improvement testing session | To Do — scheduled 2026-07-28 |
| Chunk handleAdminApproveTransfer | To Do |
| Crown Transfer (Option A) | Parked — waiting on a conversation with the company boss |
| Deploy firestore.rules to production | Ready to Deploy |
| Merge Batch 1+2 fixes into main | Done |
| NOO approval notification fix | Done |
| NOO registration crash fixes | Done |
| Offline auth lockout fix | Done |
| Rank Config and Achievement Badges redesign | Parked |
| Remove unused code and dependencies | Ready to Deploy — PR open, react-is regression fixed |
| Top panel background and UI redesign | To Do — added 2026-08-14. Same file also holds the record of the PC sidebar, which SHIPPED as `16c8ff9` after the video reference was read frame by frame |
| Phone ribbon position must survive logout | To Do — added 2026-08-14; already in localStorage, so find what clears it |
| 🔴 **What the agent counts at EOD is never used for anything** | **To Do — HIGHEST**, added 2026-08-17 fourth pass. The report sends the system's expected figures; the counted numbers are an unread side note, so a cash shortage cannot be detected. **Read this one first** |
| 🔴 **Shipping stock to a branch can erase sales made while the photo uploads** | **To Do — HIGHEST**, added 2026-08-18. Workflow-found and **verified by a second agent**. One-line fix (`increment`) |
| **Confirming a shipment twice credits the branch twice** | **To Do — HIGH**, added 2026-08-18. Verified. The guard exists in `App.jsx:1788` and was never copied |
| Excise and shipping costs are printed but never counted as cost | To Do — Medium, added 2026-08-18. Verified. ~Rp 6.4M imaginary profit per 1,000-pack batch. **One question for Aldi inside** |
| **The first bounty you mint will break the agent dashboard** | **To Do — HIGH**, added 2026-08-17 fifth pass. A Rp 200.000 fine displays as 200.040 stamps owed. Not firing yet — fires when the bounty feature ships |
| **Offline sales never reduce the van stock** | **To Do — HIGH**, added 2026-08-17 from the logic review. Costs stock AND blames the agent |
| **Returning consignment goods can corrupt the stock count** | **To Do — HIGH**, added 2026-08-17. Unit not converted: 2 Slop adds 2 packs |
| A sale can be booked to the wrong store | To Do — Medium, added 2026-08-17. Partial name match wins over the exact one |
| **Two different debt numbers for the same store** | **To Do — HIGH**, added 2026-08-17. Both shown on one screen; returns reduce only one |
| **Approving a stock count erases everything since the count** | **To Do — HIGH**, added 2026-08-17. HQ approval overwrites today's sales and EOD returns |
| **Goods given back during a payment never reduce what the store owes** | **To Do — HIGH**, added 2026-08-17. `returnTotal` is written and never read — customers are overcharged |
| **The pack-size maths is copy-pasted in six places and they disagree** | **To Do — HIGH**, added 2026-08-17. Root cause behind several stock bugs; two of the six copies are wrong |
| **Clear Canvas can create stock out of thin air** | **To Do — HIGH**, added 2026-08-17 second pass. Credits the warehouse from the admin's stale screen data |
| **Everything is linked by name instead of by id** | **To Do — HIGH**, added 2026-08-17 second pass. Root cause under three other flaws; step 1 of the fix is cheap and stops it growing |
| **Some failures are hidden from the user completely** | **To Do — HIGH**, added 2026-08-17. SEVEN silent write failures, five in one map panel including the price tier |
| **Handing a store to another agent rewrites sales history** | **To Do — HIGH**, added 2026-08-17 third pass. Past sales are re-stamped with the new agent; the real seller is erased |
| **Opening Journey Plan can silently reassign stores to the wrong agent** | **To Do — HIGH**, added 2026-08-17 fourth pass. Automatic bulk write on screen load, guessing by partial name match |
| A deleted permission tier survives in the backup copy | To Do — Medium, added 2026-08-17 fourth pass. Matrix saved twice: one replaced, one merged, so deletions do not stick |
| The app day rolls over at 7am instead of midnight | **Done — `60c53d8` (2026-08-23).** Never two bugs: no 7am rule existed, the UTC date simply flips at 07:00 WIB. Fixed at the helper; a private duplicate in AgentInventoryView deleted. ⚠️ **Old records not rewritten — that is still Aldi's call** |
| A duplicate notifications listener pays for reads nobody uses | To Do — Medium, added 2026-08-17 fifth pass. Filters on two fields that do not exist; result never read. **The bell itself works — checked** |
| Finish the logic review — screens not checked yet | To Do — Medium, added 2026-08-17. Journey, Map, Customers still unread. Fleet Canvas now done — it held 2 flaws |
| Check every UI permission against the database rules | To Do — Medium, added 2026-08-17. A check to run, not a bug found — the rules are a mixture of matrix-driven and role-locked |

This table is a snapshot, not live — open `Backlog.base` in Obsidian for current status, since
items here move between columns over time and this index won't auto-update.

## Relationship to the Wiki

Some Backlog items correspond to real Wiki pages once resolved — e.g. the merged Batch 1+2 fix
is documented in [[../Wiki/Summaries/Fleet Captain Rule Gaps — Batch 1 and 2]] and
[[../Wiki/Entities/Fleet Captain Permission Gap]]. Backlog tracks the doing; the Wiki captures
the understanding after the fact.

- [[Deploy the store hand-off write rule]] — the app refuses a receiver editing inherited sales; the database still allows it. One rule, hand-deployed by Aldi.

- [[Consignment hand-off has no eligibility rule]] — a store can be offered to the agent who already owns it, and across regions. His rule is recorded; half of it still needs one answer.
