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

## P2 placement - DECIDED 2026-10-20 09:29: B, *"i think it should be inside the setting"*
Two drawn screens, the same contents: team chips (MUNTILAN · Alex / BANDUNG / SEMARANG), the folder tree with ticks (Provinsi > Kabupaten > Kecamatan, a part-ticked parent shown half-filled), two switches - the regional admin "view only / view and edit" and his team "view only / view and edit" (team default view only) - and the team's temporary folder line.
| Option | Where | Cost |
|---|---|---|
| A (recommended) | a "Team access" button in Customer Directory, beside the folders it ticks | none extra; the tree is the folders he already looks at |
| B | a "Customer access" tab in Settings, beside Tiers and logic | one more Settings tab; the folders are a screen away |
Rejected on purpose: Fleet & Roster - he finds it crowded already (Backlog "Fleet and Roster has too many panels").

## P2 built (2026-10-20 ~10:00, kpm `4350707`, NOT pushed, rules CHANGE 17 NOT published)
Settings > Customer access (Tier 1/2): team chips, the tick tree, admin + team switches, the temporary-folder line, an On/Off switch whose confirm names the teams with no folders and the shops not filed yet. Nothing changes until he presses On. Rules [[Firestore Rules]] CHANGE 17; the app asks a limited phone one Kabupaten at a time (`city in`, 30 max) + the admin's holdTeam folder. Proof: rules 47/47 + older 186/186, logicFixes 2458/2458 (new guards RED on old code), build, audit 722/722, lab frames 375/1440 dark + light.
Decisions made inside the build (his to overrule): T3 "HQ Sales Manager" counts as the admin of his own branch (HQ chip), not as a see-all tier; view only still records visits (or Journey check-in would break); create is unchanged (P3 routes new shops into the temporary folder).
Order to go live: he presses Data Scrub -> publishes CHANGE 17 in the Console -> says push -> ticks folders -> presses On.
Next: P3 - new shops from T5/T6 land in their team's temporary folder (`holdTeam`), the admin places them into one of his ticked folders.

## His answers, 2026-10-20 ~10:15
- *"i already data scrub the customer directory"* - Data Scrub pressed.
- *"tier 3 should be able to see evrything on default actually same like tier 1 and 2"* - DONE kpm `f24f2bf`: AREA_ADMIN is never limited (rules CHANGE 17 + app); the Customer access tab stays Tier 1/2 (only they may write the ticks). Rules test 53/53, now also proving the no-access-doc state he publishes into.
- He asked for the rules text in chat to paste (CHANGE 17 incl. the T3 line, 949 lines).

## P3 reshaped by his answers (2026-10-21 ~10:45) - OPEN, one decision waiting
Asked: whose temporary folder (salesman's team or the pin's team), and should the salesman keep seeing a shop he registered while it waits.
- *"well it supposed to go for bandung team , but this is very niche to happens, in that case there should be customer folder transfer between regional team dont u think?"* - the PIN's team.
- *"actually i made this logic before, all store registration should be automatically can be seen by every team member but to unlock the proce level of grosir, it needs confirmation from the regional admin, to avoid salesman selling at retail price while the system recognize the sales as grosir, when this happen means that the salesman have increase the price for their own benefit which is bad for both customer and company"*.

**So the hold is on the PRICE, not on the shop.** A new shop is filed by its pin (P1) and seen by the team that covers that Kecamatan at once; what waits for the regional admin is GROSIR. The temporary folder (`holdTeam`, P2) is not needed for new shops.

What the code does today (read 2026-10-21) - his rule is NOT enforced anywhere, three doors are open:
| Door | Fact | Where |
|---|---|---|
| D1 terminal | the new-shop form offers the salesman's allowed tiers; the pick is written straight to `priceTier` and the cart is priced at it in the same sale | MerchantSalesView.jsx:979, :3019; useTransactionEngine.js:383 |
| D2 directory | "Pricing Type" (Grosir / Retail / Ecer) is in the add AND edit form for anyone not view-only | CustomerManager.jsx:1379 |
| D3 server | the customers rules let any non-view-only salesman write `priceTier` | firestore.rules:603-612 |
| D4 walk-in | a salesman whose tier allows Grosir can still pick Grosir per cart line on a sale with no shop | MerchantSalesView.jsx:2053 (separate door, not in P3 unless he says) |
| old hide | a shop a field agent adds in the directory is `PENDING` and hidden from every agent until Verify - the opposite of "seen by every team member" | App.jsx:4345, MerchantSalesView.jsx:404, CustomerManager.jsx:1007 |

Proposed P3 (waiting on the one decision below): new shops visible to the team at once (PENDING stops hiding); a Grosir request is saved as `requestedTier: 'Grosir'` with `priceTier` held below it; the regional admin of the shop's area (and Tier 1/2/3) sees "Grosir requests" in Customer Directory with Confirm / Refuse, every press reports; rules CHANGE 18 makes it real (only an admin may write `priceTier: 'Grosir'`), published by him first.

| Option for the first sale | What happens | Cost |
|---|---|---|
| A (recommended) | sells at Retail until the admin confirms Grosir | a real wholesale shop pays Retail on its first sale unless the admin confirms before the salesman finishes |
| B | sells at Grosir at once; the admin checks after and can turn it back | the overcharge he described has already happened on that first sale - B only finds it |

**On his transfer question:** folders are places on the map, so a shop follows its pin. Giving a shop's area to another team is a tick in Settings > Customer access (two teams can both tick the same Kecamatan - each team's list is its own). No per-shop transfer built until a real case needs one.

Rejected on purpose: the admin-only temporary folder for new shops (his answer: registrations are seen by the whole team); routing by the salesman's own team (his answer: the pin's team).

Models applied: Inversion (how would a salesman still overcharge after P3? -> D2/D3 the directory form and the rules, D4 walk-in), Second-Order Thinking (a Retail first sale costs a real wholesale customer once), Opportunity Cost (a per-shop transfer for a case he calls niche).

## P3 DECIDED + BUILT (2026-10-21 18:57, kpm 4879c32, live) - rules CHANGE 18 sent, NOT published yet
His words: *"A, grosir only available for the grosir registered store only"*. So option A (a new Grosir shop sells at Retail until an admin confirms) AND the walk-in door is closed (Grosir prices only for a shop registered as Grosir). Built: grosirHold on every new-shop write (terminal x2, engine online + offline, directory form); "Grosir requests" list for T1-T4 at the top of Customer Directory (Keep / Confirm, both confirm first and report); "Grosir?" badge on the waiting card; the admins' bell; the engine refuses a Grosir line for any other shop before anything is written; PENDING no longer hides a shop anywhere (App filter, terminal nearby pick, next stop, expedition). One mapping, priceLevelOf, for screen + engine + rules (priceTier first, the rank only when no price was saved - GOLD is no back door).
Rules CHANGE 18: only T1-T4 create a shop at Grosir or move one TO Grosir. Order: the app first (it never writes a salesman's Grosir), then he publishes - the other order refuses an old phone's Grosir new-shop and with it the whole sale.
Decided inside the build (his to overrule): T3 and T4 may confirm (same people the rules call admins); an old PENDING shop keeps its Verify button, which now only stamps it checked; a salesman may move a Grosir shop DOWN to Retail without an admin.
Next: P4 change history + undo.
