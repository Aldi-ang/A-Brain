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
