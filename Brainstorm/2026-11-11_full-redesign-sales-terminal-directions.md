---
title: Full redesign, step 1 + 2 - screen ranking and three Sales Terminal directions
created: 2026-11-11
status: DECIDED B (not built) + game look saved as kpm tag game-edition-v1; where the two editions live still open
tags: [brainstorm, redesign, sales-terminal, professional-edition]
---

# Full redesign: the screen ranking and the Sales Terminal directions

Follows [[2026-11-09_professional-edition]] (option C: the game look is frozen as his showcase, the professional look gets all future work).

## The problem, in his words (2026-11-11)
> "New job: a full redesign of the KPM / DSM app, to look professional on the phone AND the PC. ... keep the locked design laws ...
> Step 1, no code yet: list every screen in the app, rank them by how often people use them, and show me rendered frames of the
> top 3 as they look TODAY, phone and PC side by side. Step 2: for the first screen, show 2-3 redesign directions as pictures side
> by side with plain captions, and I pick one. Then build one screen at a time, test it, show me, and push. Do not redesign the
> capybara, his voice or the sounds - those were just finished."

## Step 1 - the screens, ranked (a reasoned order, NOT a measured one: the app keeps no usage log)
Basis: who can open a screen (src/config/permissions.js) x how often that job happens. About 25 salesmen, 2 office staff, 1 owner.

| # | Screen (menu id) | Who | How often |
|---|---|---|---|
| 1 | Sales Terminal (sales) | every salesman | every sale, many a day |
| 2 | Journey Plan (journey) | every salesman | his landing screen, every open and every stop |
| 3 | Agent Inventory (agent_inventory) | every salesman | morning load + checks through the day |
| 4 | EOD Setoran (eod) | every salesman | once a day |
| 5 | Agent Profile (agent_profile) | every salesman | now and then |
| 6 | Command Center (dashboard) | owner, office | their landing screen, daily |
| 7 | Master Vault (inventory) | owner, office | daily |
| 8 | Restock Vault (restock_vault) | owner, office, T4 | on each load-out |
| 9 | Receivables & Consignment (receivables) | office, T4 | daily |
| 10 | Reports (transactions) | office, salesman (own) | daily to weekly |
| 11 | Customers (customers) | office | weekly |
| 12 | Fleet & Canvas (fleet) | office, T4 | weekly |
| 13 | Stock Opname (stock_opname) | T4 | once a week per warehouse |
| 14 | Map System (map_war_room) | owner, office | weekly |
| 15 | Sampling (sampling) | office | now and then |
| 16 | Audit Logs (audit) | owner | rare |
| 17 | Settings (settings) | owner | rare |
| - | Outside the menu: sign-in + vault gate (every open), the shared top bar and menu (on every screen), Hall of Fame, the receipt (keeps company blue) | | |

The shared top bar is on all 17 screens; the Sales Terminal drawings below already carry a one-row version of it, so that pick rides along.

Frames of today: `Raw/2026-11-11-redesign-today/TODAY-BOARD.png` (Sales Terminal, Journey Plan, Agent Inventory at 375 and 1440; EOD and Agent Profile frames are in the folder too).

## Step 2 - Sales Terminal, three directions
Boards: `Raw/2026-11-11-redesign-today/DIRECTIONS-PHONE.png` and `DIRECTIONS-PC.png` (drawn as real pages in the app's own dark tokens, the real product photos, Rajdhani; `dir.html?d=A|B|C`, shot at 375x812 and 1440x900).

| | What it is | Products before scrolling (measured, phone / PC) | Cost |
|---|---|---|---|
| Today | large 3D cards, three letter styles, total behind the PESANAN edge tab | 5 / 3 | - |
| A Tidy | today's three parts kept (order left, cards, day rail), one-row top bar, smaller cards, total + order button fixed at the bottom of the phone | 6 / 8 | smallest change, same parts restyled |
| B Price list | one ruled line per product (PC: a table with columns), customer + payment in a strip on top, day's numbers in one strip, cream order slip on the right, total + Pay at the bottom of the phone | 8 / 9 | cards become rows on both widths; the big 3D pack picture goes |
| C Cashier | picture tiles, one tap adds one, a count badge on the tile, kinds in a left column on the PC | 4 / 10 | the way of adding changes, so the money path needs the most testing; fewest products on the phone |

Kept in all three: the palette law (amber only as a mark or as text on dark; the cream slip uses dark ink), 44 px buttons, the stock chip on the card in his units, the capybara and his room unchanged.

## Recommendation given
B. Evidence from his taste file: "doesnt take a lot of space ... bigger button as well users need it" (2026-09-17), the shop cards "too smooth ... not even the lines to separate the information" (2026-10-20), "Cleanest won" (2026-09-03).
not-chosen: A - lost on products per screen (6 vs 8 on the phone). Flips if the salesmen find a pack by its picture, not its name: B's phone picture is 44 px wide.

## Decision (2026-11-11 17:52 WIB, verbatim)
> "B looks the best i think it looks most professional, actually yes i want the existing build app, game inspiration DSM should be
> stored somewhere else inside my github, so that if i want to show off my resume i can do that as well, and if i want to show off
> the profession version also can, what do u think the wisest method to do that?, dont worry about the order, any order is fine by me"

- **B, Price list** - Sales Terminal, phone and PC. NOT built yet.
- **The game look is saved** (done 17:55 WIB): kpm tag `game-edition-v1` + branch `game-edition`, both on GitHub at `4e07d2f4`, the last game-look commit.
- **The screen order is free**: "any order is fine by me".

### Where the two editions live - options put to him, STILL OPEN
| | How | Cost |
|---|---|---|
| 1. One repository, two branches (recommended, half done) | `game-edition` stays frozen; `phase0-solid-ground` becomes the professional app. The demo address is pointed at `game-edition` in Vercel (Settings > Git > Production Branch), so the showcase has its own live link | one setting, his to change; not yet verified which branch the demo's Vercel project builds today |
| 2. A second repository for the game edition | he makes an empty repository, the tag is pushed into it, it gets its own Vercel project | a second project to set up (env keys, domain); gives a separate GitHub page for a resume |
| Public code | either option, switched to public | NOT recommended without a review: the game edition and the professional app share the same rules and money code, so a public copy shows a stranger how the paid app works inside |

## Rejected on purpose
- A (Tidy) and C (Cashier) for the Sales Terminal - he took B on "most professional".

Models applied: Inversion (what makes a redesign fail here: a silent break in the 3,768-line file that also does the money math - so A is the low-risk pole), Chesterton's Fence (the stock chip, the 44 px rule and the capybara room each exist because he asked; kept in all three), Reversibility Test (pushing a new look to the live branch replaces the look he called his resume - hence the freeze question first).
