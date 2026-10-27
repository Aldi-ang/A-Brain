---
title: Promo chest - promotional items and sampling without pita cukai return
description: His 2026-10-25 ask for promotional items (T-shirt, poster, hat, lighter) in every storage feature, a chest per item type, game references, and sampling given away with the pita cukai. Round 1 board sent; six answers and a layout pick owed.
type: brainstorm
created: 2026-10-25
status: decided - build stage 1 next
tags: [storage, promo, chest, sampling, pita-cukai, master-vault, game-reference]
---

# Promo chest

## His words (2026-10-25)

> *"i want to add another new item, promotional item that the salesman can give to the customer as a rewards of buying our
> cigarette or as just marketing strategy to encourage potential customer for closing, the promotional items will be Clothes
> (tshirt of cigarette brand logo), poster of the brand logo or product, brand hat, brand lighter, but we need to update all
> the storage related feature like regional warehouse, mastervault, agent inventory and even stock opname and any other
> storage related features to detect the promotional items, we might need to heavily adjust how the master vault system works
> right now for this, im thinking of some storage area that have few features and chest for each of the item types, the types
> we have for now is quarantine items, healthy items and promotional items, we can use the chest concept for this as well lets
> discuss about this, i want u to research for the game reference how to do this and do this the fun way and cool way"*

> *"some of the cigarette company does not require to return pita cukai on sampling and they just basically give them away
> for free with all the pita cukai as promotional items and on the other words the salesman doesnt need to return the pita
> cukai, hence they need to make sure that the promotional item is depleted and must be depleted for just marketing, we might
> need a new option to disable pita cukai return and put the sampling inside the promotional chest instead of its own place
> inside the agent inventory and the EOD lets discuss about this further as well"*

## Round 1 board

https://claude.ai/artifact/Uo1C1TmANckUie2fXKdLXh (v2; frames PC 1440 and a true 390 phone width read back).

- **Three chests everywhere**: Healthy = the ender chest, Quarantine = the yellow crate, Promo = NEW (crimson box, gold
  ribbon and bow - an object, so it keeps its own colours; no blue, no green).
- **Game references** (read from the wikis 2026-10-25; WebSearch was down on the 9router route and Firecrawl needs a key):
  Minecraft shulker box (a dyed box that keeps its contents when carried = the van's promo kit); Escape from Tarkov typed
  cases (money / medicine / ammo case, a poster tube - a case takes one kind = the promo chest takes promo only); Path of
  Exile stash-tab affinity (items go to the tab set for their kind = MASUK sorts lines into their chest); Satisfactory
  Dimensional Depot (cloud storage reached from anywhere = the same three chests on every screen); Resident Evil safe room
  (item box + typewriter; our theme is RE9 Ark Lab = the Master Vault as a room, typewriter = Stock Opname, terminal =
  MASUK/KIRIM); loot rarity (a gift drops as a reward card, gold and red).
- **Three layouts**: A safe room (all chests on screen, box opens below, one at a time) · B stash tabs (one box, three
  chest tabs, auto-sort) · C a three-way dial on the ender chest (his own "ender chest = general chest" rule, smallest
  change). **My pick: A on PC + C on phone** (his per-width habit).
- **Where it shows**: Restock MASUK/KIRIM (pieces, not bks), Master Vault, regional warehouse, Fleet loading bay (promo
  box beside the van chest), Agent Inventory, Sales Terminal (a GIVE button with a photo), EOD (promo given + left, no
  money), Stock Opname (counted by piece), Reports (marketing spend, shops that got a gift and later bought).
- **Sampling with the switch off** ("Return pita cukai on sampling: OFF"): sample packs live in the promo chest as their
  own item, given whole with a photo, no cukai debt, no pita cukai card at EOD for them, and the promo chest can only go
  down by giving. Today: a sample opens a `cukaiDebts` line on the motorist, EOD's pita cukai card collects the strips or
  the fine (`appSettings.cukaiFinePrice`, Rp 5.000 default) - `EODReconciliationView.jsx` expectedCukai.

## Owed by him

- 🔴 layout A / B / C (or the split).
- ❓ 1 give with a sale only, to a non-buying shop too, or both · 2 T-shirt per size or one item · 3 promo left in the van at
  EOD: stays as his kit or back to the Master Vault · 4 the pita cukai switch per company or per product · 5 photo per gift
  and a limit per shop · 6 a cost price for marketing spend in rupiah.

## Data note (for the build, not shown to him)

Promo items as the SAME product list with a type (`kind: 'promo'`, unit pcs) so every storage screen that already lists
products can sort them into the right chest; every cigarette-only path must skip them: bks/slop/bal/karton conversion,
revenue and price tiers, pita cukai, sales targets, valuation. That skip list is where a bug would hide - write it as a
check before the first screen changes.

Models applied: Pre-mortem (without the strip, "free" samples can be sold - photo, location and a per-shop limit must
replace the proof), Second-Order Thinking (one product list means every sum in the app meets promo items), Reversibility
Test (a `kind` field is additive; a separate catalogue would be a one-way door).

Related: [[Quarantine Chest]] · [[Gudang Pusat (Master Vault)]] · [[Aldi's Design Taste]]

## Round 2 (2026-10-25 19:20) - he chose the direction of C and asked to see it move

> *"i want to see those animation in action and i dont really like that formatting that u give me, i just think its gonna look bad in pc and phone btw C is a cool concept"*

Read as: A and B are out, C (the dial on the ender chest) is the direction, and he judges motion only when it runs
(same as 2026-08-24 / 2026-09-29). Prototype: https://claude.ai/artifact/V2P1rjrXhqK9oBXYEcxGa1 - the built warehouse
box (Minecraft grey, band under the title, pages) with a three-stop dial where the quarantine hatch sits: a heavy knob,
three lamps (ender eye / radiation sign / gift). Turn = knob overshoot + detent, blast doors in the skin of where it is
going (steel with a teal seam / hazard tape / gift wrap with a ribbon and a bow), swap while shut, doors open, a scan
line powers the squares, the title decodes; the ender chest's glow takes the chest's colour. Drag, tap (steps to the
next) or tap a lamp; arrow keys; Sound (soft detent, low thud, warm open) and Lite (instant). PC and Phone views via a
container query (phone = 2x2 big squares, the dial on its own row). Promo items are pixel sprites drawn in the page.
Tested in the pane at 1280 and 375: all three switches, drag, tap, Lite; door positions measured shut at 0.6-0.9 s on the
phone. A bug found and fixed: the title decode waited on screen frames, so in a page that is not drawing the dial
locked - now raced with a timer (his rule: motion never holds the screen). Still owed by him: the six questions.

## Round 3 (2026-10-25 20:00) - no gate, sharper items, a knob that settles from where it is let go

> *"i like it but i dont like the gate animation and also this 8bit logo for the hat i want it little bit more HD and i want the button to feel more natural when spinned, i mean right now when i drag and spin it, it will snap back to the original position and then snap it back to the position i desire which is unnatural right"*

Same prototype URL (version 2):
- **The gate is gone.** The switch is his 2026-09-29 v17 scan: the old box is copied on top, the new one drawn under it,
  and a scan line tinted by the destination (teal / yellow / gold) wipes the copy away from the top; the squares power up
  as the line reaches them; the title decodes. One clock, 560 ms.
- **Items redrawn as shaded vector art** (light side, shadow side, a gold brand mark): T-shirt, hat (crown panels, button,
  brim), poster (taped, curled corner), lighter (metal head, wheel, flame), the packs (3D box with a band), the damaged
  pack (torn, taped), the sample pack (gold FREE corner).
- **The knob**: it turns by how far the finger goes round (not by where it presses), pulls in near a stop (a detent) and
  clicks when it crosses into one, stiffens past the end stops, and on release settles FROM WHERE IT IS to the nearest
  stop with a small overshoot. The round-1 bug: the release replayed the full turn from the old stop. Measured with real
  mouse input in headless Chrome: during the drag -58 -> 38, after release 38 -> 42 -> 58, never back.
- A turn made while the scan runs is kept: the box catches up to where the dial ended.
- Frames: `m-1100-healthy-promo-280.png` (mid-scan), `m-1100-healthy-quarantine-300.png`, `m-390-healthy-promo-900.png`
  in this session's scratchpad `promo-chest/` (the shooting script is `shoot.mjs` there; the method is in the lesson of
  2026-10-25 "animation frames").

## Round 4 (2026-10-25 20:40) - nothing may move or stutter when the chest changes

> *"make sure that there is no stutering or change in formatting when the inventory is changed on the panel"*

Same URL, version 3. Causes found and fixed: the phone title wrapped to two lines on Quarantine (the box grew); the wipe
animated `clip-path` and the squares a `filter` (both repaint every frame); every turn re-parsed the item art. Now: a
fixed one-line title row (on the phone the count sits on its own fixed row), a pane per chest + page built once and
reused (and the first pages built while idle), the wipe = a window sliding down while the old pane inside slides up by
the same amount (transform only), the squares power up through an opacity overlay, the chest glow crossfades three
layers. **Measured** (CDP real time, every frame of every switch, 1100 and 390): box / dial / foot / window geometry
identical in every state and on every frame; frame gaps 6 ms. One 120-170 ms frame only on the first switch in a
freshly started browser, whichever width ran first - a warm page loaded next in the same browser has none, so it is the
browser warming up, not the switch (not fixed: no evidence it reaches a real phone).
**For the real build: the box's height must be the same for every chest - a check, not a hope.**

## His six answers (2026-10-25 21:00) - DECIDED

> *"1a,2b,3b,4a,5 no limit (they buy more = receive more promotional goods), 6 dont need for cost price not function of this app"*

1. **a** - a promo item is given only together with a sale, as a reward.
2. **b** - one "T-shirt" item, no sizes.
3. **b** - at EOD, promo items left in the van go back to the Master Vault, like the cigarettes (so EOD reconciles them:
   loaded - given = returned; a gap is a shortage like any stock).
4. **a** - one company switch "Return pita cukai on sampling".
5. **No limit per shop** - *"they buy more = receive more"*. The photo half was not answered; since a gift rides on a sale
   (1a), the sale's own handover photo covers it - no second photo (my reading, told to him).
6. **No cost price** - *"not function of this app"*. So no marketing-spend report either; Reports only count pieces given.

Layout: **C, the dial** (prototype version 3). Still open: do SAMPLES (when the switch is off) also need a sale, or can a
sample still go to a shop that buys nothing, as Sampling does today?

## The build, in four stages (one session each, in this order)

1. **Promo items exist** - the same product list with `kind: 'promo'`, unit pcs, no packing; the check that every
   cigarette-only path skips them; hidden from the Sales Terminal's grid until stage 4 (nothing sellable at Rp 0).
2. **Storage**: the dial on Master Vault and the regional warehouse; MASUK / KIRIM put promo lines in the promo chest;
   Stock Opname counts it by piece.
3. **The van**: Fleet & Canvas loading bay + Agent Inventory get the promo box.
4. **Giving + EOD + the switch**: a "+ Promo" bonus line on a sale (Rp 0, no limit), EOD returns the leftovers to the
   Master Vault promo chest, and the company switch moves samples into the promo chest without a pita cukai debt
   (today's debt is written at `src/MerchantSalesView.jsx:1055`).

## Stage 1 built (2026-10-25 20:20 WIB, kpm `87b5637`, pushed with `d4c5520`)

- **The skip list is one place, not sixty.** The products collection has exactly ONE reader in the app
  (`useDatabaseSync.js`). It keeps the whole list as `products` and hands out `inventory` = products minus promo
  (every cigarette screen, sum and the Sales Terminal) and `promoItems` (only the Master Vault list + the backup).
  logicFixes "PROMO ITEMS" counts the readers: a second one is how a T-shirt would leak into a cigarette sum.
- **not-chosen:** a `!isPromo` guard in each cigarette path (63 `convertToBks` calls in 19 files, plus every revenue /
  target / valuation sum) - lost on: one missed site is silently wrong stock or revenue, never an error. Flips if a
  screen ever needs cigarettes AND promo items inside ONE sum.
- **The kind is chosen on a NEW entry only** (Reversibility Test): flipping a cigarette later would re-read its past
  Bal sales as single pieces.
- Promo product = `kind: 'promo', unit: 'pcs', type: 'PROMO'`, no sticks / packing / price. `convertToBks` returns the
  plain count for it. The Master Vault list groups them under the PROMO tab, "VAULT: N pcs", no price grid.
- **Rollout trap:** a phone still on a build before `87b5637` sees promo items as cigarettes (terminal grid at Rp 0).
  He was told to make the four items only after every phone shows the new version.
- Not rendered: the product form's "Promo item" box (inline in App.jsx, behind the sign-in); his ✅ TEST covers it.

Models applied (stage 1): Inversion (how would a T-shirt get counted as cigarettes? -> any reader that bypasses the
split), Reversibility Test (kind locked after creation).

## The form fix + his "model" question (2026-10-25 22:20)

- His frame + *"i want u to fix the collapsing panel here"*: ticking "Promo item" hid the prices, the right half went
  empty, the form scrolled past its save button. Fixed kpm `135f7d6`: the pictures are a grid cell of their own, in the
  right half for a promo item, under the fields for a cigarette (unchanged, measured at 1280 and 375).
- **The form behind the sign-in CAN be seen**: `demo-emulator` -> `node tools/demo-reset-emulator.mjs` ->
  `demo-app-emulator` (5176) -> `window.__kpmEmulatorAuth` signIn with an unsigned Google id_token for
  demo.owner@example.com (lands on uid demo-owner) -> "Saya coba sendiri" -> vault password admin123. Stage 1's
  "not rendered: the form" was a missed path, not a wall.
- His question: *"dont u think we need some method to insert or upload the model for the promotional item?"* Sent as
  🔴 DECIDE with lab frames (`?shell&vaultlist&tab=promo,t-shirt&shirt=box|card`):
  - **A photo card** (recommended): a promo item asks for FRONT + BACK only and starts thin (90x100x3). Same box,
    nothing new; also halves the pictures riding inside the 1 MB product document.
  - **B real 3D file (.glb)**: a .glb is megabytes, a Firestore document holds 1 MB, so it needs Firebase Storage -
    which only works on the paid Blaze plan (helpers.js savePhotoAndGetReference; `usePhotoStorage` is off by
    default), plus a storage rule (no storage.rules in the repo), a 3D library, and a 3D file per item.
  - **C leave it**: six faces; depth set by hand in the cropper.
- Found while looking (stage-1 miss, goes with his pick): the fullscreen viewer gives a promo item a 🚬 placeholder,
  "CUKAI: Standard" and "A standard pack of cigarettes..." (ExamineModal.jsx:105, 118, 120).
- not-chosen: B as the default - lost on cost (paid plan + rule + library + a 3D file per item) for goods given away
  free. Flips if he wants real shapes in the vault and will make the files.

Models applied (form + model): Opportunity Cost (3D files vs stages 2-4), Reversibility Test (A does not block B).

## He picked A (2026-10-25 22:59)

*"A looks simple and light i guess we could do that"*. Built kpm `1800d41`: the tick starts a thin card (90x100x3), the form asks FRONT + BACK only (the cropper cuts each face to the box shape, so side faces on a 3-deep card would be slivers), the fullscreen viewer drops the 🚬 / CUKAI / cigarette description for a promo item. Seen on the emulator at 1280 + 375. Items saved before it keep the pack size (none expected - he waits for phones to update).

## Default skin (2026-10-26, kpm 7390164)

His ask: *"can u give it like default skin for the 3D promo item like on the preview u gave me earlier"*. The preview was the lab's T-shirt card. Built as `promoSkin` (helpers.js): drawn when no photo is uploaded, never saved. A shirt word in the name gives the shirt plus the rest of the name ("T-shirt Cello" -> CELLO); any other item gives its name on a black label; the back says KPM. Used in the vault box, the vault list picture and the fullscreen viewer. Open: Stock Opname thumbnails and the stage-2 chest should use it too.
Models applied: Inversion (a shirt drawn on a lighter would be the visible failure, so only shirt names get the shirt).

## The six goods in 3D (2026-10-26, kpm a234781)

His ask: *"there is no product type ... add ashtray and mug ... design 3D default for all the goods, thefore we dont actually need to upload the photo ... the uploaded photo will be these flat card ... u can use any 3D design app"*. Blender 5.0 is on his PC; `tools/promo-goods/goods.py` models T-shirt, poster, hat (6-panel cap, gold brim edge), lighter, ashtray (3 rests), mug as .glb + list pictures. The app draws the item's word on each print area (name minus the goods' own word, else KPM). TYPE picker in the form; no photo = 3D, photo = flat card; three.js only loads with the 3D view (own chunk, 142 KB zipped). Demo vault seeded with one of each (kept out of the demo's made-up sales).
His "T SHIRT TAWANG" was the trigger: name-guessing missed a space - a picked type ends that class of miss.
Open: his "button or panel to combine these UI with the new master vault chest" = stage 2's first frames.
Models applied: Inversion (what breaks offline / without WebGL -> the flat picture), Second-Order (demo seed feeds made-up sales -> promo kept in its own seed key).
Not chosen: turntable pictures instead of live 3D (lighter, but only turns sideways) - flip if phones stutter.

## The look: colours + printed text (2026-10-26, kpm 44c7345)

His ask: *"edit the color appearance on the 3D design, and change the name on it when press edit"*. EDIT on a promo item without a photo shows LOOK: a live 3D preview, PRINTED TEXT (empty = from the name), COLOR (the goods' paint), PRINT COLOR (word + gold parts), Default colors. Any colour: the goods' own paint is content, not app UI (palette law stops at UI, like pack photos). Saved: goodsColor / printColor ('' = type default), printText, thumb (list picture snapshot, ~3 KB).
Models applied: Second-Order (a default saved as a hex would freeze the old type's colour on a TYPE change -> '' means default), Inversion (a list picture that ignores the paint would contradict the model -> snapshot on save).
Not chosen: preset swatches (would put blue/green chips in app UI; the native picker covers any colour).

## Stage 2, round 1: where the dial sits in the Master Vault (2026-10-26 07:20) - OPEN, waiting on Aldi

**The problem, his words:** *"well btw we might need new button or panel to combine these UI with the new master vault chest"* and *"where is the swap button that u show me last time it is not in the app? and also where do u put it we havent design it yet to combine with the recent mastervault panel"*. The dial was drawn on a standalone grey box; the Master Vault is a list (Supply Case: title, search, type tabs + ADD) beside the 3D viewer.

Board: https://claude.ai/artifact/AixSKQFrdHU5gzsKGpdhXv - the REAL Supply Case from the lab (`?shell&vaultlist&tab=promo`), the prototype's own dial CSS injected in a shadow root, shot over CDP at 1440x900 and 375x812 (touch + hover:none emulated). Frames + `inject.js` + `shoot.mjs`: `Raw/2026-10-26-promo-placement/`. Dial drawn at 0.78 scale (153x107), lamp labels 11 px.

| Option | What | Cost (measured) |
|---|---|---|
| **A beside the title** (my pick) | dial right of title + search, spans both rows; title renames per chest (Supply Case -> Promo Chest) = the switch reports | PC list -31 px (569 -> 538), phone header +27 px; search 170 px PC / 152 px phone; same both widths |
| **B foot deck** (PC only) | deck under the list: chest name / dial / item count, like the warehouse box's deck | PC list -130 px (569 -> 439); phone falls back to A |
| **C CHEST button** | button beside + ADD opens the grey prototype box as a panel (full screen on phone) | list -0 px; promo stock behind a press; same stock shown in two places |

**Decision:** OPEN - waiting on Aldi (one letter for PC, one for phone).

**Rejected on purpose (do not re-offer):**
- The dial at the bottom of the list ON THE PHONE: the phone list is part of the page (no inner scroll), so a dial under it jumps every time a chest has more or fewer items - breaks his round-4 rule ("no stutering or change in formatting when the inventory is changed").
- The dial on the 3D viewer's edge: on the phone the viewer is hidden until a product is opened, so the dial would be unreachable from the list (the "hidden control was the only route" fault, 2026-09-01).
- A pinned dial bar on the phone: his pinned-toolbar rule (one line, first question only) - the dial is ~107 px.

**Already settled, no question:** the regional warehouse (LoadingBay deck) - the dial takes the quarantine hatch's place, as the prototype was drawn.

Models applied: Inversion (how would the dial break round 4? -> anything placed after a variable-length list on the phone), Opportunity Cost (C's zero space buys a duplicate view and a press his 2026-10-20 "a stock number belongs where the salesman looks" rejects).
not-chosen: C - lost on two views of one stock + promo numbers behind a press; flips if he wants the grey Minecraft box look inside the Master Vault itself.

## Stage 2 built - "focus on 1" (2026-10-26 07:50, kpm 1e2d004 + 3e17861) - the dial is DROPPED

**His words, on the placement board:** *"first thing first looks like we cant combined these old mastervault UI and the the new button together because both share the same function do u have any better solution for this?, well i think that we just focus on 1 and improve it, like on the old master vault we dont have any method to view the quarantine we should fix that"*.

**Decision:** no dial anywhere. Each screen's EXISTING control grows a promo/quarantine stop:
- Master Vault (Supply Case): QUARANTINE joins the tab row (right after ALL, admin only), listing products with damagedStock; the row now wraps (the hidden sideways scroll hid PROMO at 375 and squeezed the label). kpm 1e2d004.
- Regional warehouse (WarehouseChest): the hatch he loved (2026-09-29) cycles healthy -> Quarantine -> Promo; gift-wrap doors, crimson/gold band, promo squares = list pictures in pcs; one box height in all three views. The van bay keeps its two-stop hatch (stage 3 adds the stop the same way). kpm 3e17861.
- Restock desk: promo items under a "Promo items · pcs" heading in the picker; one pcs box, no landed cost; Bks and pcs never summed (bksOf/pcsOf). KIRIM lines carry promo: true.
- Arrival check: promo lines counted in pcs, shelved in branches/<b>/inventory tagged kind 'promo' (the only path the rules allow - a separate subcollection would have needed a rule he deploys first). Every shelf listener splits them off: the stage-1 skip list, again, for shelves.
- Stock Opname: promo items join the count list (the count card is unit-free, so a piece counts as a piece).

**Rejected on purpose:** the dial in the Master Vault (his "both share the same function"); the placement board A/B/C (https://claude.ai/artifact/AixSKQFrdHU5gzsKGpdhXv) is superseded; a separate `branches/<b>/promo` collection (needs a new rule deployed before the code works).
**Rollout trap:** a branch phone on a build older than 3e17861 shelves a promo arrival untagged -> read as Bks by every new build. Same rule as stage 1: every phone on the new version before the first promo KIRIM.
**Next:** stage 3 = the van (loading bay third stop, Agent Inventory pcs group, EOD returns leftovers). NEXT-SESSION holds it.
Models applied: Inversion (how would a T-shirt reach a Bks sum at a branch? -> any shelf listener that does not split by kind; the check counts them and went red when one was unsplit), Reversibility Test (kind tag on the existing doc vs a new collection: the tag needs no rule and can be read either way later).

## More paint + the back print (2026-10-26 08:00, kpm 4eed16e)

His frame of a yellow "TAWANG" T-shirt: *"we need more customizable color on this, funny thing is that when i put the name on the front here the back does have different name which is the default name"*.
- **Back:** the 3D drew 'KPM' on every back print (a234781's rule). Now: the back prints the typed PRINTED TEXT; only an item with no typed text keeps KPM.
- **More colours, no new export:** the .glb files already split the parts (read their node names): shirt collar, hat seams + gold button/brim edge, mug handle, lighter lever, ashtray gold ring. GOODS_PARTS (helpers.js) names them; the LOOK block shows only the pickers that type has (COLLAR / SEAMS / BUTTON + EDGE / HANDLE / LEVER / RING). Saved trimColor / accentColor; '' follows COLOR / PRINT COLOR, so saved items look the same.
- Frames: `Raw/2026-10-26-promo-look/` (front + back, lab `?promolook`).
- Not chosen: a separate BACK TEXT field - his words read as "the back should follow", not "let me type a second word"; flips if he asks for a different back.

## Stage 3 built - the van (2026-10-26 13:15, kpm c1f9cfb)

His ask, the van half: *"... as well as the agent inventory, EOD, stock opname and anything that relates with that"*; answer 3b = leftovers come back at EOD, a shortage is a shortage but costs nothing (no price).
- **Decision (mine, a data-model door): the van's promo goods live in their OWN field, `promoCanvas`**, not lines flagged `promo: true` inside activeCanvas as the brief first said. activeCanvas is read as Bks by 14 places (every sale, supply, Stock Opname on-field, roster cards, the terminal's stock), and a phone on an older build would have offered a T-shirt at Rp 0. A separate field makes the skip list empty by construction and is invisible to old builds.
- Bay: the warehouse hatch's third stop (healthy -> Quarantine -> Promo), same NEXT map as the regional chest - his "focus on 1" rule. Promo squares are pictures; HOW MANY has no Slop/Bal keys; every total says Bks and pcs apart.
- Agent Inventory: the T1-T4 chest shows promo squares in pcs; the salesman's list grows a "Promo items · pcs" group (same tile as the packs).
- EOD: counted on the same goods card; travels as `promoRemaining` / `promoExpected`; a short one flags DISPUTED, no bounty; the approval puts them back and empties promoCanvas only for a report that carries promoRemaining (an old build's report keeps them on the van, not lost).
- Proven in the lab with the real write path (stub read-back): load 5 -> shelf 24->19, van 6->11; return 2 -> shelf 26, van 4; EOD payload carries T-shirt 4/6 apart from the cigarettes. Frames: `Raw/2026-10-26-promo-stage3/` (bay 1440 + 375, agent chest 1440, agent list 375, EOD goods card).
- Not walked: RECONCILE & CLEAR (the lab has no confirm host) - pinned in logicFixes instead.
- Not chosen: `promo: true` lines inside activeCanvas - cost: a guard in 14 readers and a rollout hole for old phones; flips only if one list must hold both (e.g. a future screen that sorts packs and gifts together).
- Stage 4 (giving with a sale) still needs his answer: do SAMPLES (switch off) also need a sale, or can a sample go to a shop that buys nothing?
- **ANSWERED 2026-10-26 13:20:** *"well sometimes free sample doesnt mean need a sale, we can just do trials for the new smokers and give them for free"*. A cigarette SAMPLE never needs a sale (trials); a PROMO item still needs one (his 1a). Sampling has no sale gate today - stage 4 must not add one there. Read as samples only, not promo goods: his 1a was explicit, and this message talks about trials of the cigarettes; flips if he says a T-shirt can also go out with no sale.
- Same day, his follow-up: *"but as marketer we could offer free sample as a return they buy more of our product but this is just one way of increasing the closing rate but of course this is salesman strategy nothing to do with the app i guess"*. **REJECTED ON PURPOSE: tying a sample to the sale it helped close** - his call, a selling tactic, not an app feature. The cost he accepted: a sample record has no link to a sale, so the app cannot report whether samples raise the closing rate. Flips if he asks for that number.
Models applied: Inversion (how could a T-shirt reach a Rp sum? -> any activeCanvas reader; answer: keep it off activeCanvas), Reversibility Test (a new field can be merged later; lines inside a shared array cannot be split back out of old phones' writes), Pre-mortem on the rollout (old salesman phone + new admin, and the reverse - neither loses a piece).

## Stage 4 built - giving with a sale (2026-10-26 13:41, kpm f6efd61) - the promo build is COMPLETE (4 of 4)
His rules it encodes: 1a (a promo item goes out only with a sale), 5 (*"they buy more = receive more"*, no limit), and the samples answer above (a sample stays free - the sampling screen got no sale rule, and a check pins that).
- Terminal: a "Promo · given free" block inside the cart paper, under the bought lines, one row per promo product the van holds, a pcs field capped at the van (typing more clamps + a red "not enough" toast). Shown only while the cart holds a line the shop BUYS: not in Retur, not for an IOU-only cart, not in the boss's VAULT mode (no van). Never in the total.
- **Decision (mine, data model): what was given is its own field on the receipt, `promoGiven: [{ productId, name, qty }]`, never a line of `items`** - same reasoning as promoCanvas: every revenue / target / dayStats / pita cukai / bounty sum reads `items`, so keeping the gift out by construction beats a skip in each reader.
- Online: promoCanvas loses the pieces in the SAME t.update as the van's cigarettes; a give the van cannot cover throws, nothing written. The engine refuses a give with no sale / in Retur / with no van BEFORE the offline branch.
- Offline: the queued receipt carries promoGiven; the sync takes the pieces off in the same transaction as the van, once (after the already-landed check); a short give is kept as `promoShortfall` and reported in pcs. The phone shows the van minus its own waiting gives.
- Nota: given pieces print as "4 pcs · BONUS" with "-" for price, on the live receipt and the history reprint (thermal, A4, WhatsApp text). Receipt keeps company blue.
- Seen: lab 1440, 375 (drawer full open), Lite; Retur hides the row; empty cart hides it; the reprint's three formats read back. NOT seen: the live receipt right after MAKE DEAL (the lab cannot take the handover photo) - pinned by check instead.
- No rules change: a salesman already updates his own motorist doc and creates transactions with any fields.
- Not chosen: the gift as a Rp 0 line inside `items` (one list, simpler receipt code) - lost on every money reader needing a skip and old phones counting it as a sale; flips only if a report must list gifts and sales in one table.
- Not chosen: giving from the Master Vault in the boss's VAULT mode - not asked; flips if he wants the boss to hand out gifts at HQ counters.
Models applied: Inversion (how could a gift reach a Rp sum? -> any items reader; answer: own field), Pre-mortem on offline (a give queued twice -> settle once after the landed check; a give larger than the van -> clamp + report), Second-Order (a salesman can now give up to the van's whole stock with a 1-pack sale - his answer 5 says that is the policy, so no cap was added).

## Fullscreen spin in Lite (2026-10-26 14:22, kpm 2667d86)
His report: *"the promo goods doesnt spin automatically when viewed in fullscreen tho can u fix that"*.
- Lab, Lite OFF: the fullscreen T-shirt spins (front -> side in 1.5 s); a mouse drag and let-go resume the spin. Lite ON: frozen - the 3D module skipped the idle spin in Lite for EVERY mount, including the viewer that says "AUTOMATIC ROTATION". A cigarette pack in the same viewer turns in Lite (ExamineModal's own loop has no Lite check). A past session ("did turning ⚡ Cello Lite Mode OFF bring the sound and animation back?") shows he runs Lite at times -> cause [likely], not proven on his phone.
- **Decision:** the fullscreen viewer (opened on purpose to look) spins in Lite; the small Master Vault box stays still in Lite - his "nothing rotates" now reads as "nothing rotates that he did not open to look at". Same line the cigarette pack already drew.
- If his phone still shows it still with Lite OFF: the cause is elsewhere (a held pointer that never lets go on touch, or the model failing to load -> the flat picture). Ask whether Lite is on before hunting.
Models applied: Inversion (what else freezes the spin? held pointer / failed load / Lite - only Lite reproduced), Chesterton's Fence (the Lite gate was put there for his "nothing rotates" law - kept for the vault box, lifted only where he asked).

## The lighter remade from his photo (2026-10-26 14:56, kpm 9a163cf)
His *"just make it like this one"* + a Mecco korek-gas photo: see-through body (material clear) with the tube and inner frame, black collar, metal top with hole + slot, black lever by default on any colour, word front + back. Details and the taste lesson: Wiki/Concepts/Aldi's Design Taste.md (2026-10-26 entry).

## Poster on a hanger + his second text (2026-10-26 15:46, kpm 464e94c)
No fixed KPM left in any print: subText = BACK TEXT (T-shirt, lighter) / BOTTOM TEXT (poster); empty = back repeats the front word, poster no bottom line. Poster = paper on top/bottom bars + cord, print = frame + burst + headline block + bottom band. His words + the taste rule: Wiki/Concepts/Aldi's Design Taste.md (2026-10-26 entry).

## Round 5 (2026-10-26 16:10): give without a sale + BUNDLES - DECIDED + BUILT 2026-10-27
His words: *"oww i want the box to appear even when not buying our goods but i want option to create bundle for our goods plus promotional goods"* (after not finding the give box: cart empty, signed in as T1 on Master Vault).
| # | Question | Options | Cost |
|---|---|---|---|
| 1 | give with NO purchase? (reverses his 1a) | yes: box always open, shop + handover photo still required, nota Rp 0 with BONUS lines / no: box always visible but locked with "add what the shop buys first" | yes = engine guard `promoGiven.length && !activeCart.some(...)` and the terminal canGive change; a give-only receipt has items [] - every reader of items must accept an empty sale (dayStats, stores served count?) - CHECK before building |
| 2 | who makes bundles | boss T1/T2 in the Master Vault, one card per bundle in the terminal (my pick) / each salesman | a new product kind or a settings doc; the terminal grid gets bundle cards; one tap = cart line + give line |
| 3 | bundle price | (a) cigarettes price only, promo free inside (my pick) / (b) special bundle price | (b) changes revenue math (items price vs bundle) - money path, two checks |
Default if he says nothing: bundle card greys out when the van has none of its promo item.
REJECTED ON PURPOSE: nothing yet.
Models applied: Inversion (how does a free give leak stock? a give with no shop/photo -> keep both required), Second-Order (a give-only receipt with no items reaches every items reader), Opportunity Cost (the 100-user scale fix waits behind this).

**DECIDED 2026-10-26 16:15** - his words: *"yes, some strategy that factory offer is buy 1 bal of our product and we will give a t shirt for free this is just one variation of those strategy i want the giveaway to be allowed but recorded as always and need a real time photo of course. price is only recorded from the cigarette price only and the promotional goods is just for bonus"*. = 1 YES (giveaway with no purchase, shop + live photo required, saved as its own type, never a sale), 2 bundles = the factory offers, boss sets them, 3 (a) cigarettes price only. REJECTED ON PURPOSE: (b) a special bundle price; a give with no photo.

**BUILT 2026-10-27, pushed (live):** giveaway `34010bb` - an empty cart with promo pieces commits as GIVE PROMO and saves as `type: 'GIVEAWAY'`, Rp 0, items [] (shop + live photo still required; every money/stores reader counts only `type === 'SALE'`, so it adds nothing to revenue or stores served). Factory bundles `9403f84` - stored as `settings/general.promoBundles` (salesmen already read that doc, only the boss writes it: no new collection, no rule change); the boss adds them on a saved promo item's edit panel (FACTORY OFFERS); the terminal shows a BUNDLES chip, one tap = the cigarettes as ordinary cart lines at the shop's tier + the pieces in the give box. No bundle price exists anywhere - the engine never sees a bundle.
- Models applied: Inversion (what turns a free T-shirt into money? -> a Rp 0 SALE would count as a store served and a sale; its own type closes that), Second-Order Thinking (a bundle summed into an Utang Barang line would be priced Rp 0 -> refused), Reversibility Test (a field on an existing doc is reversible; a new collection needs a rule he must publish).
- REJECTED ON PURPOSE: a bundle as a product with `kind: 'bundle'` (falls into `inventory`, every Bks sum); a special bundle price (his 3a: cigarettes' price only); a new `bundles` collection (needs a rules publish first).
- Open edge: a T2 boss may be refused writing settings/general (catch-all = vault owner + distributor admin); the editor then says "only the boss can change offers".

## Round 6 (2026-10-27 12:10): regional offers - BUILT `21004b7`, two questions OPEN
His words: *"actually offers differs for each of the regional area because some of them perform better sales than others right maybe we should have option to make bundle as a whole sales or maybe bundle that are special for the regional location"*.

| Option | Cost | Status |
|---|---|---|
| A. One WHERE per offer: all areas or one roster region; the boss makes them all | no rule change; a 2-region offer = 2 offers | BUILT `21004b7` |
| B. Several regions per offer (chips) | more UI, same storage | not built - A covers it with one more offer |
| C. Each region's own admin makes his region's offers | settings/general is boss-only today -> a Firestore rule he must publish, and a per-region write check | OPEN - asked |
| D. Region as a lock in the engine | pointless: giving without a sale is allowed, so a salesman can hand-build any deal | REJECTED ON PURPOSE |

- Seller region = his `location` (normalizeRegion, as every region screen). Boss (ADMIN) sees all offers; a T2 with a location sees all-area + his region only (flag if he objects).
- OPEN: "whole sales" read as every area (built); the other reading is Grosir (wholesale) shops only - asked.
- Models applied: Second-Order Thinking (a lock in the engine buys nothing once giveaways are free), Reversibility Test (`region` absent = all areas, so old offers stay valid and the field can be dropped).
