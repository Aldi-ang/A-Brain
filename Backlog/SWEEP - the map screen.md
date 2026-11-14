# SWEEP — the map screen (Map Mission Control)

## Settled 2026-11-14 - the 5 ❔ lines, read in today's code by Antigravity

Source: kpm commit bf2018d7 (.claude/ANTIGRAVITY-TASK.md). Claude spot-checked 4 of the 38 in the code on 2026-11-14 (App #11, App #13, History #5, Map #8): all 4 held. These answers replace the ❔ marks in the block below.

| Finding | Answer | file:line | One sentence |
| --- | --- | --- | --- |
| #8 | OPEN | `src/MapMissionControl.jsx:16,1417-1425` | `TierAutomationEngine` `catch` now calls `notify` (`:1425`) instead of failing silently, but `getDoc` is still omitted from the `firebase/firestore` import at `:16`, so `:1417-1419` still throw and tier rules never load. |
| #10 | OPEN | `src/MapMissionControl.jsx:1476,1544,1919-1927,2337` | `MapMissionControl` passes the filtered `mapPoints` (`:1919-1927`) into `<TierAutomationEngine mapPoints={mapPoints} .../>` (`:2337`), so `runDataCleanse` (`:1476`) and `runSimulation` (`:1544`) still process only stores matching active filters. |
| #11 | OPEN | `src/MapMissionControl.jsx:648-663` | `toggleFolderVisibility` still runs un-awaited per-border `saveBoundaryToFirebase(target)` inside `forEach` (`:656-662`) where write failures are only logged via `console.error` (`:532`). |
| #12 | OPEN | `src/MapMissionControl.jsx:801` | `handleFileUpload` still checks duplicates against `b.name === name && (b.folderName \|\| b.level) === targetFolder`, scoped only to `targetFolder`. |
| #15 | OPEN | `src/MapMissionControl.jsx:1786-1817` | `handleSaveNewStore` still saves new stores (`:1792-1805`) with no duplicate check (`findShop` is imported at `:17` but unused here) and without setting `region` or `city`. |

## Status, checked against the app 2026-11-08 (Claude, his "check the notes, fixes and test it yourself")

✅ fixed 7 · 🔴 still open 3 · ❔ not confirmed 5 (that code was rewritten since August; it needs a read before anyone calls it fixed or open).
Tested: all 16 self-check suites pass (logicFixes 2836/2836 holds a check for every ✅ that names a section).

- 1 ✅ A4, ed4b2b2 (a sector saves)
- 2 ✅ A5, ed4b2b2 (the dropdown offers prices)
- 3 ✅ likely: the XP sum site writes seasonXP on every run (MapMissionControl.jsx ~1482)
- 4 ✅ S4, a3a9cf6 (a shop by key, counted once)
- 5 ✅ likely: an outlet cannot be saved without a real pin since dda8ec6
- 6 ✅ likely: the zone reads boundary.feature OR boundary.geometry (~1980)
- 7 🔴 the border cache key is still per app, not per person (utils/borderCache.js, cello_map_bnd_<appId>)
- 8 ❔ the rank engine now takes rules as a prop; check where they are loaded
- 9 🔴 Clear All still empties the screen and cache when the database refused (handleWipeAll: setBoundaries([]) after the catch)
- 10 ❔ code moved; check which list the cleanse/audit get
- 11 ❔ code moved; check toggleFolderVisibility for batching
- 12 ❔ code moved; check the duplicate-upload check
- 13 🔴 a failed upload sets an error nothing shows (setError("Upload failed."), no render found)
- 14 ✅ RETURN is subtracted with the payments (~1167)
- 15 ❔ check handleSaveNewStore for the duplicate finder and region

---

15 confirmed problems in `src/MapMissionControl.jsx`. This screen was never reviewed by hand
before, and it turned out to be the worst-affected file in the app.

Ranked. Severity is the corrected one.

---

## 1. 🔴 HIGHEST — Saving a sector's settings never reaches the database

**Where:** `src/MapMissionControl.jsx:611`

**In plain English:** open Sector Configuration, set a revenue target and an assigned agent,
press Save. You get "Sector Configuration Saved! 🚀" and the editor closes. The function that
actually writes to the database is **never called**. Only the phone's local cache is updated.

**What happens:** the target bar turns green. Reload the page — the loader pulls the
un-updated record from the database and then **overwrites the cache that held the only copy**.
The target and the agent assignment are gone, with no error, ever.

**Every name, colour, target and agent assignment ever set through that panel has been lost
this way.**

**Smallest fix:** add one line after the cache write — `await saveBoundaryToFirebase(updatedBoundary);`
— which is exactly what the visibility toggle 20 lines below already does.

---

## 2. 🔴 HIGHEST — The "Pricing Tier" box writes a game rank into the price field

**Where:** `src/MapMissionControl.jsx:1869`

**In plain English:** the new-store form has a dropdown labelled **Pricing Tier**. Its choices
are not prices — they are the RPG ranks: Mythic, Epic, Grandmaster, Bronze, Unranked. Whatever
is picked is saved into `priceTier`, the field that decides what the store is charged.

**What happens:** three different bad outcomes, all silent.

- Register a wholesale outlet and pick **"Grandmaster"** → matches no price, so it defaults to
  **Retail**. That outlet is billed retail on every sale, forever.
- Pick **"Bronze"** (an ordinary rank in your default ladder) → the code sees "BRONZE" and
  bills the shop at **Ecer** (per-pack) prices.
- If you ever name a rank **"Gold"** in Settings, any store on that rank is silently billed at
  **wholesale**.

There is also a knock-on: a store whose price tier reads "Mythic" disappears from the customer
search for any agent whose allowed tiers exclude Retail.

**This class of bug has bitten this codebase before** — there is a whole repair tool in
Customer Manager built to clean up a previous price-tier corruption.

**Smallest fix:** stop writing `priceTier` from that dropdown, or feed the dropdown the real
price ladder (Retail / Grosir / Ecer) instead of the rank list.

---

## 3. 🟠 HIGH — Season XP is written once and never again, so every audit demotes everyone

**Where:** `src/MapMissionControl.jsx:1686`

**In plain English:** `seasonXP` is set by a one-time migration and reset to 0 after each
audit. **Nothing in the entire app ever adds to it** — no sale, no EOD, nothing.

**What happens:** you run "Initialize RPG Data Cleanse" in August; TOKO MAJU gets 3,000,000 XP
and lands on Mythic. Through September the shop buys another 3,000,000 — nothing records it.
In September you run "Audit Season Ranks": it reads the frozen August number, then resets it
to 0. **Every audit from October onward reads 0 and drops every store straight to the bottom
rank in a single run** — and because that rank feeds the price fallback, the demotion follows
the store into pricing.

**Smallest fix:** compute season XP live from the transactions inside the audit, the way the
one-time cleanse already does 60 lines above.

---

## 4. 🟠 HIGH — Zone revenue is counted by store *name*, so same-named shops double up

**Where:** `src/MapMissionControl.jsx:2022`

**In plain English:** revenue for each sector is added up by matching the store's **name**
against the customer name on each sale. Then it loops the stores again and adds that figure
once per store.

**What happens:** you have three shops called "warung sembako sumber rejeki" 14.5 km apart —
this is recorded in the code as a real case from your own book. Two of them sit in Kecamatan
Muntilan with Rp 4.000.000 and Rp 6.000.000 of sales. Both get credited Rp 10.000.000, and the
sector loop adds it twice: **Muntilan reports Rp 20.000.000 against Rp 10.000.000 of real
sales.** That inflated figure drives Global Revenue, the target bars, the heatmap colours and
the tooltip. The third shop, in a different Kecamatan, contributes its siblings' revenue to
that zone too.

**Smallest fix:** bucket by store ID, not by name.

---

## 5. 🟠 HIGH — "Correct Pin" pre-fills a fake coordinate and saves it as if it were surveyed

**Where:** `src/MapMissionControl.jsx:1333`

**In plain English:** any store with no GPS is drawn at a hard-coded placeholder point
(-7.5845, 110.2895). Tap "Correct Pin" and the drag-pin starts at that placeholder — not at
nothing.

**What happens:** an admin opens a store imported from a spreadsheet, sees a pin already on the
map, decides it looks about right, taps Save. The placeholder is now that store's permanent
recorded location, **indistinguishable from a real one**, so nobody will ever flag it again.
Every such store lands on the same point — which dumps all their revenue into whichever
Kecamatan contains it, and puts the shop kilometres from where the agent's GPS check will
stand.

**Smallest fix:** mark stores that got the placeholder, and pass `null` to the pin instead so
Save stays disabled until the pin is actually dragged.

---

## 6. 🟠 HIGH — Freshly uploaded territories show Rp 0 until you reload the page

**Where:** `src/MapMissionControl.jsx:2043`

**In plain English:** two parts of the screen disagree about which object holds the map shape.
The revenue calculator is handed the wrong one, and quietly gives up.

**What happens:** you upload a Kecamatan file. The borders draw fine and the Sector Command
panel correctly says "Assets: 37" — but **every sector shows Rp 0**, red "Zero" on the
heatmap, and Global Revenue reads Rp 0. Reload the page and it is suddenly correct, because the
save path strips the confusing object out. On the day you import a region, you see it as dead
territory.

**Smallest fix:** one line — read `boundary.geometry` first, falling back to
`boundary.feature?.geometry`, matching what the dashboard already does.

---

## 7. 🟠 HIGH — Deleted territories come back on any other device and get re-uploaded

**Where:** `src/MapMissionControl.jsx:1913`

**In plain English:** the screen paints the phone's cached borders first, then replaces them
from the database **only if the database returned at least one**. An empty database can never
clear the cache.

**What happens:** you run Clear All on the office laptop. On the home laptop the cache still
holds the 80 borders, the database returns 0, the guard keeps them on screen — and toggling one
border's visibility **writes that deleted border back into the database**.

**Worse, confirmed by the checker:** the cache key contains no user ID *and* no varying part at
all — it is byte-identical for every account on a given browser. On a shared laptop, an agent
logging in sees the owner's territories and the dashboard computes revenue against boundaries
that are not theirs.

**Smallest fix:** put the user ID in the cache key, and let an empty result clear local state
(use a separate flag for "the fetch failed" versus "the fetch found nothing").

---

## 8. 🟠 HIGH — The rank engine has *never* used your configured targets

**Where:** `src/MapMissionControl.jsx:1512`

**In plain English:** the function that loads your tier rules calls `getDoc` — which was never
imported into that file. Every call throws instantly, into an empty catch block that reports
nothing.

**What happens:** the rules stay empty forever, so the engine silently falls back to
hard-coded targets: `2.500.000 / 1.000.000 / 500.000 / 250.000 / 0`. You set Mythic to
Rp 10.000.000 in Settings, run Audit Season Ranks, and it uses 2.500.000 instead — so every
store between 2.5M and 10M is promoted to Mythic and carries that rank into pricing and the map.

**Second problem on the same line:** even with the import fixed, the database path built at
`:1514` has the wrong number of segments and is not a valid document reference.

**Smallest fix:** add `getDoc` to the import, fix the path, and replace the empty `catch(e) {}`
with a message so the next failure is visible.

---

## 9. 🟡 MEDIUM — Clear All wipes the screen and cache even when the database refused

**Where:** `src/MapMissionControl.jsx:583`

**In plain English:** the error handler shows "Could not delete all borders" — and then the
code carries on and clears them from the screen and the cache anyway, because those two lines
sit outside the error block.

**What happens:** any failure that is not a permission problem — offline, network drop, quota —
destroys the local copy while telling you the delete did not work. `handleDeleteFolder` is
worse: it clears the screen and cache **before** even attempting the delete.

**Downgraded from HIGH** because the Territory Manager is behind the admin PIN, and the rules
grant that group write access — so the specific permission-denied story is unlikely. What
survives is the offline case.

**Smallest fix:** move the two clearing lines inside the try block, after the await.

---

## 10. 🟡 MEDIUM — The data cleanse and the season audit only touch what the filters are showing

**Where:** `src/MapMissionControl.jsx:1566`

**In plain English:** both bulk tools operate on the map's **filtered** store list — filtered
by region, city and rank chips — but the confirmation promises "all legacy receipts" and the
result toast reports a count as if it were the whole book.

**What happens:** you are looking at Region = MAGELANG with the Bronze chip off. You run
Initialize RPG Data Cleanse. Every store outside Magelang and every Bronze store gets nothing.
The toast says "120 stores upgraded" and you treat the one-time migration as done. Later,
filters cleared, Audit Season Ranks reads 0 for all of them and demotes them (see item 3).

**Worst case:** the "select all tiers" toggle sets the filter to *empty* when everything is
selected, so one stray click makes the list empty and the cleanse reports
"✅ RPG Migration Complete! 0 stores upgraded" as a success.

**Smallest fix:** pass the unfiltered store list to the automation engine; keep the filtered
list only for what is drawn on the map.

---

## 11. 🟡 MEDIUM — Show All / Hide All fires one un-batched write per border

**Where:** `src/MapMissionControl.jsx:663`

**In plain English:** the folder visibility toggle loops the borders and fires a separate save
for each one, all at once, with no waiting and no batching.

**What happens:** click HIDE on a 90-border folder and 90 simultaneous writes go out, each
carrying a full map shape. On a field connection some are rejected. Each rejection lands in a
catch that only writes to the console. The screen shows all 90 hidden; some are still visible
for everyone else and after the next reload.

**This is not a new idea to the codebase** — the batching helper sits ten lines above, and
*every* neighbouring function was converted to use it, with comments explaining that 80-100
shapes "exhausts Firestore's write stream, especially on slow connections". This one function
was missed.

**Smallest fix:** use the batching helper that is already there, and add a message to the
catch.

---

## 12. 🟡 MEDIUM — The duplicate-upload check only looks inside one folder

**Where:** `src/MapMissionControl.jsx:808`

**In plain English:** uploading the same territory file into a second folder is not detected,
and the per-folder "+ FILE" button actively invites it.

**What happens:** upload `magelang-kecamatan.geojson` into "2026 Routes", then again into
"Q3 Targets". Both copies survive, both are counted, and a Rp 400.000.000 territory reports
**Rp 800.000.000**. The ranked sector list shows every Kecamatan twice.

**Smallest fix:** make the check global on name + level instead of scoping it to the target
folder.

---

## 13. 🟡 MEDIUM — A failed territory upload tells you absolutely nothing

**Where:** `src/MapMissionControl.jsx:830`

**In plain English:** the error message and the progress message are stored in variables that
**are never displayed anywhere on the screen** — confirmed by searching the whole 2,567-line
file.

**What happens:** the upload fails — bad file, rejected write, anything — the button flips back
from "Processing..." to "2. Select Shapefile", and nothing else happens. The user tries three
more times assuming they mis-clicked.

**Smallest fix:** render the error, or replace it with a `notify()` call the way the folder
delete already does.

---

## 14. 🟡 MEDIUM — A store that hands goods back still owes the full consignment money

**Where:** `src/MapMissionControl.jsx:1152`

**In plain English:** inside one block, the **money** line only counts consignment *payments*,
while the **goods** list fifteen lines below counts payments *and* returns. Returns move the
stock figure and not the money figure.

**What happens:** TOKO MAJU takes 10 packs on Titip worth Rp 100.000 and returns 4 damaged
packs. The expanded detail correctly lists 6 packs outstanding — while the headline "Active
Consignment" right above it still reads Rp 100.000. Two numbers on the same panel that
contradict each other, and the store is chased for Rp 40.000 of goods it already gave back.

**Note:** the correct handling exists twice elsewhere in the app. Only the map omits it.

**Smallest fix:** subtract the value of RETURN transactions alongside the payments.

---

## 15. 🟡 MEDIUM — New stores created from the map get no region and no duplicate check

**Where:** `src/MapMissionControl.jsx:1857`

**In plain English:** the new-store form saves name, phone, address, tier, type, coordinates —
but **no region, no city, and no check that the name already exists**, in an app that joins
everything by name.

**What happens (names):** an agent registers "WARUNG SUMBER REJEKI" from the map, not knowing
you already have one 14.5 km away. From that moment the bottom sheet's lifetime revenue, its
recent sales, and the zone heatmap each show one shop the other's sales — permanently, and
unfixable after the fact. There is a duplicate-finder helper in the codebase built for exactly
this, unused here.

**What happens (region):** with no region, the store is treated as "Uncategorized", which the
rules deliberately let every own-region tier edit. So every store born on the map is exempt
from regional scoping. **The checker flagged this half as a documented, accepted decision** —
the missing duplicate check is the part that is not.

**Smallest fix:** run the duplicate finder before saving, and fill in region/city from the
boundary the pin falls inside.
