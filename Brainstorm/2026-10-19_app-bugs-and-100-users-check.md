---
date: 2026-10-19
status: OPEN — waiting on Aldi's pick
confidence: mixed (tag per row)
checked: 2026-10-19 09:00 WIB, code on phase0-solid-ground at 8e16624
---

# App bugs + the "100 people at once" check (2026-10-19)

## Problem, his words
*"we need to go back to the app after this, we need to focus on bug fixes and make sure again that
everything works well even when there is 100 of people using the app at once"*

## Ranked findings (diagnosis only, no code written)

Assumption used for the sizes: 100 users = ~90 salesmen x ~25 sales/day, ~1,000 stores. Every number
scales in a straight line with his real counts.

| # | Problem | Who hits it, when | What happens | Fix size | Evidence |
|---|---|---|---|---|---|
| 1 | Every phone downloads EVERY salesman's last 7 days of sales (with the proof photo inside each sale) and every store (with its photo), and re-processes the whole list each time anyone sells | every user, every app open after 30+ min away; every sale by anyone | ~21k document reads per phone per open. On the free Spark plan (50k reads/day for the WHOLE company) the 3rd phone of the morning uses up the day: after that every screen fails for everyone until the reset (~14:00-15:00 WIB). On Blaze it is a daily bill instead. Cheap phones also slow down: ~16k sales re-mapped every few seconds | medium-large: each tier listens only to what it needs; photos out of the documents | [certain] `useDatabaseSync.js:73` (no agent filter), `useTransactionEngine.js` deliveryProof.photo, `helpers.js:327` base64 when usePhotoStorage is off. Plan = Spark [likely, vault: "Blaze plan goes live" not done] |
| 2 | Van cargo is saved as one whole list, overwritten by whoever writes last | salesman sells while OFFLINE (or within ~1 s online) and an admin/captain loads, unloads or moves goods on the same van before the phone syncs | the admin's change disappears from the van's record; at EOD it shows as a shortage or surplus of that whole load, blamed on the salesman (bounty) | medium-large: van cargo as per-product counters (data-model change, one-way door) | [certain] mechanism `useTransactionEngine.js:256` (offline, queued updateDoc of the whole array), `:376` (online, read then blind write); how often [guessing] |
| 3 | Master vault sale writes the stock as a fixed number computed from an earlier read | admin sells from HQ vault while another HQ user receives goods or approves a stock count (those use increment) | the received packs vanish from HQ stock | small: increment(-qty) inside a transaction | [certain] `useTransactionEngine.js:371` `stock: update.newStock` |
| 4 | Excise + shipping never counted as cost (Backlog note, still live) | every sale's profit | "Cuan" overstated by excise + shipping per pack | medium + needs his pricing call | [certain] still on `priceDistributor`, no fix commit |
| 5 | A deleted permission tier survives in the backup copy (Backlog note, still live) | owner deletes a tier; later the main matrix doc is missing | the backup (saved with merge) brings the deleted tier's permissions back | small | [certain] `SettingsView.jsx:1734` merge:true, read fallback `:1512` |
| 6 | One document per month counts every sale of every salesman (`sales_stats/{month}`) | many phones reconnecting at once and replaying offline sales | Firestore takes ~1 sustained write/s per document: sync slows and retries; nothing lost (queue keeps items until they land) | medium: split per salesman or per day | [certain] `salesRollupWrite.js:24`; effect [likely] |
| 7 | Notifications downloaded twice (Backlog note, still live) | every user | double reads for nothing | small | [certain] `App.jsx:534` + `useDatabaseSync.js:113` |

Checked and fine: rules look up at most 2 documents per request (`firestore.rules:56`, `:154`), well under
the limit. Big writes already go through `commitInChunks` (450 per batch).

Backlog notes that look already fixed (not closed yet): "A sale can be booked to the wrong store" (exact
match first now, `helpers.js:62`, `useTransactionEngine.js:503`); "Consignment hand-off has no
eligibility rule" (`handoffEligibility()` at `permissions.js:375`).

## Options offered
- Fix in rank order, one at a time, each with its self-check.
- First run a load test on the Firestore EMULATOR: 100 simulated phones selling at once, count reads and
  writes per minute, and show rows 1, 2 and 6 happening. Turns the [likely] rows into measurements.

## Decision
OPEN — waiting on Aldi: which row first; Spark or Blaze (Firebase console, bottom-left).

## Rejected on purpose
- Re-diagnosing Backlog notes that already carry findings (his rule; only re-checked whether still live).
- A workflow / subagent fan-out: his rule, no workflow until he says yes.

Models applied: Inversion (what makes the app fail at 100 = what one phone does x 100), Second-Order
Thinking (a blind overwrite becomes a bounty on a person).
