---
date: 2026-09-24
status: DECIDED 2026-09-24 08:35 — shipped kpm 722cc48
---
# The roster as a game community (Fleet & Roster left panel + the empty right panel)

## Problem, in his words
> *"i dont like the folder design for that roster we need better game like theme for that, do u have any suggestion?
> lets brainstorm and quick research for this maybe some team game play that have this features could be used as
> inspiration, i remember that state of decay 2 have this roster that show all survivor in the settlement and all of
> their stats and skills maybe we can use that but change the 3D character into 3D profile card instead and also i dont
> like this blue panel u should redesign this as well"*

The folder roster shipped in kpm `13802b6` an hour earlier. He rejected it for LOOK, not for logic: the doors, search,
rank order and the "what the van holds" line stay. The "blue panel" is the right side's empty state ("STANDBY FOR
DEPLOYMENT", `bg-slate-900` navy) and, by extension, the blue/green detail header above the bay.

## Research (one source read; web search tools were down this session)
State of Decay 2 (stateofdecay.fandom.com, Skills page): four base skills — Cardio, Wits, Fighting, Shooting — each
rated 1–7 and upgraded to a specialisation at 7, plus a fifth "specialty" skill; survivors also carry traits and a
community standing. The KPM data that maps onto it already exists in `src/config/career.js`: STAT_LABELS (Cash
Collected, Stores Served, Items Moved, Days Closed, Best Streak, Clean Cukai Days, Debt Collected, New Outlets…),
DEFAULT_BADGES (= traits), DEFAULT_RANKS Bronze→Mythic via `rankLadder` (= standing), and the shipped
`components/PlayerCard.jsx` (= the 3D profile card he asked for).

## Options
| | Look | What a row/card shows | Cost | Risk |
|---|---|---|---|---|
| A · Community list (State of Decay 2) | list of survivor rows; tap → big 3D profile card on the right (front: face, rank, title; back: traits/badges) | name, rank chip, four skills as 7-pip bars (Cash, Reach, Stock, Streak), van load | medium: reuses PlayerCard look + career stats | skills need a 1–7 scale (per-team percentile or fixed thresholds) — a design call |
| B · Card collection (FIFA Ultimate Team) | grid of 3D player cards, frame colour = rank, overall number | overall rating + 4 short stats | medium-high: a new card component | showpiece, slow for the daily "who do I load" job |
| C · Barracks (XCOM 2) | dense rows, rank insignia, role, status, van fill bar | status + van fill | low | least game-like; close to what he already rejected |

The blue panel, in every option: the empty state becomes a COMMUNITY overview in slate + gold (people, vans loaded,
Bks out, today's cash), like SoD2's community resource strip, and the selected person's header becomes their profile
card instead of the blue/green chips.

## Recommendation
A — it is his own reference, it keeps the list fast to scan, and the "3D profile card" is a reuse of the PlayerCard he
already approved rather than a new engine (the same floor as 2026-09-22: "it must be OUR cool").

## Decision
DECIDED 08:35 by a screenshot, not by a letter: the game's Community screen itself - *"what i mean is something like
this but change it into 3D character, if its too heavy then just 3D cards, make sure the character is hoverable and
interacable"*. Built as 3D cards (a 3D engine + character models on a cheap Android is the "too heavy" he allowed
for): a full-width stage, a name over each card, hover lifts and lights the floor, pick rings gold, the leader on a
crown, a gold bar with the place and the actions; the blue panel became the community tiles. kpm `722cc48`. The
skill-scoring question is parked: the cards carry no skill pips yet.

## Rejected on purpose
- The folder roster (`13802b6`) — he said so. Keep its logic, drop its look.
- A 3D character model — he asked for a 3D profile CARD instead.

Models applied: Opportunity Cost (B's showpiece vs the daily scan), Second-Order Thinking (a 1–7 skill scale ranks
salesmen against each other — the scale choice is a people decision, not a UI one).

## Round 4 — what sits behind a closed chest (planned 2026-09-24 09:55, not built)
He first asked me to choose ("what do you think as CEO and Regional admin?"); I offered two read-only slips ("what he
usually sells", "money on the road"). He answered with a better list of TOOLS: presets for the usual load, the other
vans' stock, the geofence requests behind the van, then consignment and bounties.

| Behind | Tab | Source | Round |
|---|---|---|---|
| warehouse | PRESET - save the muatan as the usual load, one tap puts it back | agent doc `loadPreset` (own field) | 4 |
| warehouse | TEAM - what the other vans hold | roster `activeCanvas` | 4 |
| van | GEOFENCE - this person's requests + history | `allBypasses`, the ledger's existing matcher | 4 |
| van | CONSIGNMENT, BOUNTIES | reads this screen does not make yet | 5 |

The rule he adopted in his own words: *"A preset only fills the muatan, the same way a drag does. That keeps the rule
that only MUAT VAN moves stock, so a wrong preset can never change real numbers by itself."* - he took it because it is
a guarantee, not a feature.
Rejected on purpose: my two read-only slips (his list does more); the company-wide pending override queue living only
behind a closed chest (a salesman waits at a shop for it) - kept at the top, his call to change.

**BUILT 2026-09-24 12:04 WIB** (kpm `c4a1eaa` chests + tabs, `d02fe2c` far/near + floor, `dfc3820` header into the gold
bar, `cb30e98` a clipped chip the frames caught). Local, not pushed; his ✅ TEST owed. Frames + the round-4 shooter:
`Raw/2026-09-24-round4-chests-stage/`. What the build decided on its own, for him to overrule:
- "Both closed = one short row" was read literally: each chest stands BESIDE its tabs (PC: chest | tabs | tabs | chest;
  phone: two rows of chest | tabs). Before the first hand-close the chests open by themselves, so no tabs flash.
- A preset line the warehouse cannot fill whole is CUT and listed with its reason (short / planned / dry / missing /
  full), not dropped silently; a full van refuses a new product, as a drag does.
- Saving over an existing usual load replaces it and says so ("Muatan biasa diganti"), no confirm.
- The bar follows the picked person on any roster page or area tab (the old header always showed them).
Traps met: a plain `.lite-mode` rule LOSES to the far-card selector (`:has()` + `:not()` add up to 0,6,0), so the dimming
is gated with `:root:not(.lite-mode)` instead of overridden; a list inside a grid needs `minmax(0, 1fr)` or its content
sets the width (clipped "DITOLAK"); the lab stub's fixtures must be seeded before the page runs
(`globalThis.__labFixtures`) for a listener that subscribes on mount.
Models applied: Inversion (what makes a preset change real stock? nothing - it only folds lines), Second-Order Thinking
(the geofence tab must not become a second place to approve).


**His 12:50 test → kpm `f167adb` (round 4.5).** The row pulsed with nobody picked (the gap between cards pointed at
nothing, so every far card grew back) → the hover zones touch. The grid floor was "too norak ... cyberpunk" → warm
light only (taste file, 12:50). TIM became one row per van with its goods, and each row copies into this muatan
(SALIN, the same fill as the usual load). The tutorial left the panel for the ponder book - REJECTED ON PURPOSE:
explaining text inside a working panel. For that ponder page, the words that were removed: "Menarik tidak mencatat
apa pun. Stok gudang dan van baru berubah saat MUAT VAN ditekan — sekali: satu surat jalan untuk yang dimuat, satu
bukti kembali untuk yang dikembalikan." · "Tarik kotak dari gudang ke van — atau kembali" · "Hanya mengisi muatan,
seperti menarik kotak" · "Yang menunggu disetujui atau ditolak di antrean paling atas layar" · "Point at a card to
look · tap to pick" - rewrite them as a person would say them, he called the originals robotic.


**Round 5 → kpm `3d77048` (2026-09-26).** Two more tabs behind the closed van chest, beside GEOFENCE, both read-only:
TITIP (the shops this person holds that still owe money or still hold goods: rupiah owed + packs still at the shop)
and BOUNTY (the PENALTY_ fines on their record, reason + date). Data found first: titip = the `transactions` App
already passed to Fleet (SALE + Titip, CONSIGNMENT_PAYMENT, RETURN); bounties = `cukaiDebts` on the person's own
roster record, the same map the EOD WANTED board reads. No new listener, no new collection; the rules read those under
`isSalesman`. Decided by the build: the tab's sums are the consignment screen's own (titipOf, checked to add up to
the dashboard's receivable), the holder after a hand-off is the shop's `ownerAgentId` (so App now passes its
`customers` too), and the WANTED board's inline bounty reading became one shared `bountyItems` both screens call.
Tab words: "Titip" and "Bounty" - the words the salesmen and the app already use. His 07:24 mid-build ask *"make sure
that both pc and phone looks good for fleet and canvas"*: at 518 with both chests shut each slip sat in a ~190 px
column (tabs one per line, "12 Bks di to…" cut) → the phone keeps the open layout's order. REJECTED ON PURPOSE: a
pay / settle key inside the tab (settling stays on its own screen, as approving stays in the queue); a second copy of
the consignment sums or the bounty labels. Frames: `Raw/2026-09-26-round5-titip-bounty/`.
Models applied: Inversion (how could the tab lie? a second copy of the sums drifting - so the check ties it to
outstandingTitip), Second-Order Thinking (a hand-off must move the shop to the new holder or the seller keeps seeing
debts he no longer collects).


**His 07:50 test of round 5 → kpm `40db68d` `f6aeda7` `8adb777` (2026-09-26).** Round 5 passed. Decided by the build:
the PC keeps the closed panel in the grid, invisible, so the tabs fill the same room (measured 643 px in all three
states, after its status line was reserved too); the muatan left the bay's frame for its own card (`.kpm-bay-duo`);
the phone's page size is a variable (4 under 640 px, the CSS container line), so the van has 20 squares there and 18
on the PC; tap-then-tap reuses the drop's landing and the HOW MANY sheet, so nothing new can write. EOD draft lives in
localStorage per salesman per night - REJECTED ON PURPOSE: a Firestore draft (a new write path and a rules change for
a convenience). OPEN — waiting on Aldi: the boss's EOD card mixes nights (A split by night / B also show the old night
to the salesman / C leave), full diagnosis in kpm `.claude/NEXT-SESSION.md`.
Models applied: Inversion (how could tap-to-place change real stock? only if it skipped the sheet - it cannot),
Second-Order Thinking (a restored draft carrying yesterday's expected figure would name the wrong gap - re-read it).

**The EOD-card question, CLOSED 08:35 → kpm `293798c`.** He chose A (split by night) plus "a special panel for late
EOD" - a red LATE EOD panel on the boss's side. B (the salesman sees an older sent-back night on his own screen) was
not asked for; it is a ❓ in PROGRESS.md. Found while building: the bounty PAYMENT report lit "short count" and was
counted as the night's revenue, and the card's reset deleted it - all three fixed in the same commit.
