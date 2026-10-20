---
date: 2026-10-20
status: OPEN — waiting on Aldi (5 questions)
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

## Decision
OPEN — waiting on Aldi:
1. Terminal + map scoped too, or only the directory?
2. Tick level: Kabupaten (recommended) or Kecamatan?
3. Team = same Fleet & Roster branch as the admin?
4. A new shop whose pin is outside the admin's folders -> Tier 1/2 places it (recommended), or the admin's nearest folder?
5. Order P1 -> P2 -> P3 -> P4?

## Rejected on purpose
- Fixing the tier-level "own region" option: it compares two different name lists (branch vs Kabupaten) and is per tier, not per person.
- Hiding other folders only on screen: the server would still hand every shop (with phone numbers) to every phone.

Models applied: Chesterton's Fence ("sell to anyone" existed so any salesman can sell to any shop - D1 asks before removing it), Pre-mortem (a rules query that can return one forbidden shop fails WHOLE, so P1's clean areas must land before P2's rule), Reversibility Test (P1 fills only empty areas and lists conflicts, so it is undoable).
