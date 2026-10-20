---
date: 2026-10-20
status: DECIDED — P1 DONE 2026-10-20 08:21 (kpm e360fa3), P2 next
---
# Customer Directory: each regional admin sees only the folders Tier 1 gives him

## The problem, in his words
> *"this account name is ALEX and im located in the muntilan roster team but how can i see all the customer directory and can edit them tho even when im regional admin, this should not be possible tho , last time we discuss about this and the regional admin can only see the customer that is on their own team area only, for example bandung team may only see bandung's customer and not muntilan one"*

> *"we should make setting so that the higher tier can give proportion of customer directory that regional admin can see. as tier 1 i want option so that alex be able to see the customer inside which folder"*

> *"there is sometimes unassigned folder and this folder will not be seen by everyone when i only tick muntilan folder for ALEX right even when the unassigned store is belong to muntilan region , to avoid this i suggest u to fix so that each of the NOO are compulsory to be put on the folder assigned to the regional admin ONLY. and also add another option to allow edit profile or just view on the customer"*

> *"lower tier in default tier 5 and 6 , motorist and canvas, are not be able to edit the customer data and can only view their customer data that is assigned to their regional admin, if Alex can see bandung customer then all of their team can see bandung as well ... the tier 5 and 6 of course can register the store but to put the new NOO data on the folder it is needed regional admin confirmation"*

> *"i want the stores to be automatically autofilled on where is their kecamatan, kabupaten, and province according to their location inside map system and journey map ... because the salesman wont be looking at the map all the time"*

## What the code does today (read 2026-10-20)
| # | Fact | Where |
|---|---|---|
| F1 | Every employee READS every shop. The terminal and the directory get the full list on purpose ("sell to anyone", a 2026-07-24 session's call). | `firestore.rules` customers `allow read: if isSalesman(bossUid)`; memory "Customer/notification scoping" |
| F2 | EDIT is per TIER (Settings > Tiers & Logic: edit all / own region / view only), default "edit all" -> Alex edits everything. "Own region" compares the staff branch label (MUNTILAN) with the shop's Kabupaten (MAGELANG): different lists, so it would block him from almost everything. Never usable on his data. | `permissions.js:309-319`, rules CHANGE 6 |
| F3 | Folders = Provinsi > Kabupaten > Kecamatan, built from each shop's own text. Spelling splits folders: "JAWA TENGAH" (76) and "Jawa Tengah" (1) in his screenshot. Where map borders exist the directory GUESSES the area on screen only - never saved. | `CustomerManager.jsx:398-466` |
| F4 | A shop registered from the Sales Terminal saves its GPS pin but NO Provinsi / Kabupaten / Kecamatan -> it lands in "Unknown" = the unassigned folder. The directory's own form refuses a save without them; the terminal does not ask. | `MerchantSalesView.jsx` NOO ~930; `useTransactionEngine.js` storePayload |
| F5 | "Team" = everyone in the same Fleet & Roster branch (`location`) [likely, to confirm]. | `App.jsx` employeeRegion |

## Plan (proposed, not started)
| Step | What | Cost |
|---|---|---|
| P1 | Clean the areas first: one spelling per area; every NEW shop (terminal too) gets Provinsi / Kabupaten / Kecamatan from its pin + the map borders when it is saved; a Tier 1 button fills the EMPTY areas of old shops the same way (shows the list first, never overwrites a typed area that disagrees - lists those for him). | 1 session; writes old shops only on his press |
| P2 | "Customer access" in Settings (Tier 1/2): per regional admin, tick folders (a Provinsi ticks every Kabupaten in it) + "View only / View and edit". His branch team inherits the folders, view only by default (Tier 5/6). Enforced in firestore.rules, not only hidden on screen (UI-Says-Yes-Server-Says-No). Replaces the tier-level "own region" option. Rules publish by him FIRST. | 2 sessions; rules change; every screen that receives `customers` re-checked |
| P3 | NOO confirmation: Tier 5/6 register -> waiting, with the auto-filled area -> his regional admin confirms -> it can only go into one of HIS folders. | 1 session |
| P4 (my idea) | Change history on every shop (who changed phone / tier / area, when, old value) + undo for Tier 1/2 - catches a deliberate bad edit even by someone allowed to edit. | 1 session |

Bonus: P2 also cuts reads - today every phone downloads every shop (100-users check, row 1).

## Decision (his answers, 2026-10-20 07:58)
1. *"yes of course sales terminal should be limited as well"* - the scope applies to the terminal and the map too, not only the directory.
2. *"i think i want the ticked to be as low as the kecamatan, but well if i choose the kabupaten then all kecamatan inside it will also be included in default, and if i choose province then all the kabupaten and kecamatan inside it also included in default, but we can ticked them off as well as an option"* - the grant is a list of KECAMATAN; ticking a Kabupaten or Provinsi ticks everything inside it, each can be unticked.
3. *"yes basically the regional team"* - team = the admin's Fleet & Roster branch.
4. *"we should have temporary folder for this, make sure that the admin of that regional area can see that, it is wise when each team have their own temporary folder for this as well dont u think, so that bandung temporary folder cant be seen by muntilan regional admin and muntilan admin cant put the bandung customer inside muntilan folder"* - one temporary folder PER regional team; only that team's admin sees it; an admin can only place a shop into his own ticked folders.
5. *"for the build order i want u to decide it which is the wisest order, u can push now or later its up to u"*.

**Order I chose, and why:** P1 clean areas + auto-fill from the pin (every later step keys on a shop's Kecamatan, and a rule query that can return one forbidden shop fails whole) -> P2 access: per-team Kecamatan grant (tick down, untick allowed) + view/edit + each team's temporary folder + the rule (he publishes rules first) -> P3 new-shop flow: a Tier 5/6 registration lands in a temporary folder, the admin places it into his own folders only -> P4 change history + undo. Then the Fleet & Roster tidy-up (Backlog "Fleet and Roster has too many panels").

**Temporary-folder routing, my proposal (confirm at P3, not blocking P1):** a new shop goes to the temporary folder of the team whose ticked Kecamatan contains its pin (a Muntilan salesman registering a shop inside Bandung's area -> Bandung's temporary folder); a pin inside nobody's area -> the Tier 1/2 list.

## Rejected on purpose
- Fixing the tier-level "own region" option: it compares two different name lists (branch vs Kabupaten) and is per tier, not per person.
- Hiding other folders only on screen: the server would still hand every shop (with phone numbers) to every phone.

Models applied: Chesterton's Fence ("sell to anyone" existed so any salesman can sell to any shop - D1 asks before removing it), Pre-mortem (a rules query that can return one forbidden shop fails WHOLE, so P1's clean areas must land before P2's rule), Reversibility Test (P1 fills only empty areas and lists conflicts, so it is undoable).

## P1 done (2026-10-20 08:21, kpm `e360fa3`)
New shops from the Sales Terminal now carry Provinsi / Kabupaten / Kecamatan from the salesman's pin (`src/utils/areaFromPin.js`, shared with the directory); folders group in capitals so "Jawa Tengah" and "JAWA TENGAH" are one; the directory form fills an empty level from the pin; the Data Scrub works out its plan and states it (from pin / from address words / still unmapped) before writing. Found on the way: the terminal had saved the pin and NO area since the new-outlet form was built - that, not a missing feature, was the unassigned folder. Grants must key "PROVINSI|KABUPATEN|KECAMATAN" (names repeat), and Firestore `in` takes 30 values - both in the P2 brief.

## P2 placement - shown 2026-10-20 09:08, OPEN
Two drawn screens, the same contents: team chips (MUNTILAN · Alex / BANDUNG / SEMARANG), the folder tree with ticks (Provinsi > Kabupaten > Kecamatan, a part-ticked parent shown half-filled), two switches - the regional admin "view only / view and edit" and his team "view only / view and edit" (team default view only) - and the team's temporary folder line.
| Option | Where | Cost |
|---|---|---|
| A (recommended) | a "Team access" button in Customer Directory, beside the folders it ticks | none extra; the tree is the folders he already looks at |
| B | a "Customer access" tab in Settings, beside Tiers and logic | one more Settings tab; the folders are a screen away |
Rejected on purpose: Fleet & Roster - he finds it crowded already (Backlog "Fleet and Roster has too many panels").
