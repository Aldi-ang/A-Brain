---
date: 2026-10-19
status: PARTLY DONE — rows 2,3,5,7 shipped; Blaze + rules publish waiting on Aldi
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
- ~09:20 his answer: *"gulir is gone, my firebase is the free one, u can do whatever first, make sure u reports when everything is done, dont forget to do the test as well"*.
- DONE kpm `363cea9`: rows 2, 3, 5, 7 + `load-test/hundred-users.mjs` (14/14: legacy shapes of rows 2-3 lose stock, current code keeps it) + rules draft for `sales_stats` (the draft refused every salesman's sale - renumbered CHANGE 16, a CHANGE 15 already existed).
- 14:05 his answers: *"yes deploy the change"* (rules: `firebase deploy` is denied in settings and deploying is his job - draft = live baseline + CHANGE 16 only, checked by diff; text put on his clipboard for the Console) · row 4 closed by design: *"we have nothing to do with the product cost it is outside of this app, we just have their prices, for distributor, ecer, grosir retail, for the shipping cost and pita cukai is outside this app"* · *"i want u to make simulation on the cost needed to run this app and make it in simulation 3D motion"* -> artifact https://claude.ai/artifact/H4ZyaEkJFyy1LTQDaaBEtd (source kpm `.claude/cost-sim/kpm-running-cost.html`).
- Row 6 skipped on purpose (splitting the tally multiplies READS on Spark; test C shows nothing is lost).

## The cost model (Jakarta prices read 2026-10-19 from cloud.google.com/firestore/pricing)
Reads US$0.038 / writes US$0.115 / deletes US$0.013 per 100k; storage US$0.000263 per GiB-hour (~US$0.192 a month); internet transfer US$0.12 per GB after 10 GB a month free. Free daily: 50k reads, 20k writes, 1 GiB. At 100 people (90 salesmen x 25 sales, 3 opens a day, 80 KB photo):
| | reads a day | download a day | Blaze per month |
|---|---|---|---|
| code today | 6.29 M | 389 GB | ~Rp 21.8 jt (Rp 20.6 jt of it is photos downloaded inside every sale) |
| both fixes (photos as files + own sales only) | 1.99 M | ~1.2 GB | ~Rp 434 rb |
Spark at 100 people: free reads gone ~14:05, the app works ~5 minutes a day; storage 1 GB full in ~6 days. **Spark cannot hold 100 people with any code** - even with both fixes, 1.99 M reads a day is 40x the free 50k. After the fixes, office users are half the reads (they download all sales + audit lines).

## Still OPEN — waiting on Aldi
- Blaze: **NO for now** (~14:35) - *"i wont move to blaze yet until the app is rented and i have those blaze switch button on the setting doesnt we?"*. The Settings switch (SettingsView ~line 1366, "Database" / "Cloud · Blaze") only moves PHOTOS; it does not upgrade the plan - the Firebase project must be put on Blaze in the Console first. Flipped on Spark, an upload fails and the sale falls back to a photo inside the sale (MerchantSalesView), so it is safe but does nothing. The second fix (own sales only) is code, not a switch, and is not built.
- DONE ~14:41: Aldi published rules CHANGE 16 (*"i pasted the whole rules that u give me just now and publish it"*); kpm baseline synced 14:43. **CORRECTION ~14:38:** I said the live app was not hit because the tally code is not on `main`. Wrong: a push of `phase0-solid-ground` IS the live version (his *"whenever we push a new version of the app, the biometric reset"*), and the tally went up with the 2026-08-30 pushes - so since then any salesman account's online sale is refused by the live rules. No real salesmen yet (the app is not rented), which is why nobody saw it. ~14:38 pushed `f292af6..ffcc9a6` on his *"publish the fixes"*.
- Restock intake desk: **keep Shipping / Excise / Labour and "Total Landed Value" as notes only** (his ~14:35). Already true in code: the landed value is only shown (restock book value column, "landed Rp / Bks" step, AcceptanceReceipt) and never feeds profit. Nothing to change.
- Found, not fixed: an HQ vault sale made offline never deducts HQ stock; an offline consignment audit never puts returned goods back on the van.

## Rejected on purpose
- Re-diagnosing Backlog notes that already carry findings (his rule; only re-checked whether still live).
- A workflow / subagent fan-out: his rule, no workflow until he says yes.

Models applied: Inversion (what makes the app fail at 100 = what one phone does x 100), Second-Order
Thinking (a blind overwrite becomes a bounty on a person).
