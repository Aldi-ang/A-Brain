---
title: Package (Paket) limit per shop, who may take it, and an on/off switch
date: 2026-11-12
status: DECIDED 2026-11-12 — stage A live (kpm 141dd879); stage B (the limit over days) is the brief in kpm .claude/NEXT-SESSION.md
related: "[[2026-11-11_full-redesign-sales-terminal-directions]]"
---

# Package limit per shop, eligibility, and an on/off switch

## The problem, in his words (2026-11-12)

> *"bundle should be limited to per store, old store, new store cant do that  and ecer cant do that only retail and whosales who are registered who can do that, and this bundle limit example was, for muntilan regional team, the bundle is special 1 tawang slop u get 1 lighter for example and each stores can only buy 1 bundle, so buying 2 bundle is not possible hence 2 slop doesnt mean 2 lighter but this is just one example of the limitation for each bundle, what do u think about this, will this be efficient and effective and also does sales have no way to play with the system to for their own gain from this system?, regarding the bundl/paket i think there should be on and off toggle button but tier 3 and above as default to activate bundle or off that bundle to be used in the future when sales dropped"*

Earlier the same day he asked for *"limit option on the promo as well manageable by tier 3 and above on default"* and then corrected: *"what i meant before was not promo but paket"*.

So three things, per package: a limit **per shop**, a rule for **which shops** may take it (registered, Retail or Grosir, never Ecer), and an **on/off switch** (tier 3 and above by default).

## What the code does today (checked 2026-11-12, kpm 6257a8df)

| Fact | Where |
|---|---|
| A package is added by a press; nothing counts how many a shop has taken | `MerchantSalesView.jsx` `applyBundle` |
| A saved sale keeps which packages were used, as `offers` | `MerchantSalesView.jsx` (the `offers:` line) |
| Any salesman with promo pieces in the van can give them by hand, with no package, even on an empty cart | `canGive = !isReturMode && promoVan.length > 0` |
| A shop becomes Grosir only after a boss confirms the request; a new shop starts as Retail with nobody confirming | `CustomerManager.jsx` (`requestedTier`, `was?.priceTier \|\| 'Retail'`) |
| The package price already has a permission key, default T1-T3 | `permissions.js` `set_bundle_price` |

## How a salesman could beat a per-shop limit (Inversion)

| # | The trick | Why it works today | What closes it |
|---|---|---|---|
| 1 | Give the lighter by hand from "Promo · gratis" | hand-giving is not tied to any package | mark a promo item **package only**: it cannot be given by hand |
| 2 | Register the same shop again under a new name | a new shop is Retail at once, no boss in the loop | the package only for shops a boss has confirmed, or shops with an earlier paid sale |
| 3 | Two phones, or one phone with no signal | the limit would be checked on the phone from data it already has | a **claim ticket** in the database: one record per shop per package, and the database refuses a second one |
| 4 | Sell the package, then return the cigarettes | the shop keeps the lighter and the limit could reopen | a return never gives the claim back |
| 5 | Record the package on shop B, hand the goods to shop A | the app trusts the chosen shop | already narrowed by the hand-over photo and the GPS gate; not closed, and not closable in the app |

## Options for where the limit is enforced

| Option | What it buys | What it costs |
|---|---|---|
| A. Phone only (count past `offers` for that shop) | no rule change, quick | beaten by trick 3; "UI says yes" with nothing behind it |
| B. Phone check + claim ticket in the database (recommended) | cannot be beaten by going offline or by a second phone; the phone still explains the refusal | one new Firestore rule that Aldi publishes himself; one more small write per package sale |
| C. Boss approves each package sale | strongest | slows every sale, needs a boss online; defeats the point of a field promo |

## Decision

**OPEN — waiting on Aldi.** Asked 2026-11-12:

1. "old store, new store cant do that" - does a shop registered today wait before it can take a package, or does only the price tier matter?
2. Is the limit forever for that package, or does it start again each month?
3. Should a promo item that belongs to a package be blocked from hand-giving?
4. May the database get the claim ticket rule (he publishes it in the Console)?

The switch (on/off, T3 and above by default, a key in the permission table beside `set_bundle_price`) needs no answer and is agreed.

## His answers, 2026-11-12 12:10 WIB

> *"by seeing your recommendation all is good but i can see 2 flaw here ticket in the database one, what if there is 2 agent in the same place trying to turn their internet off then making those paket deal? well i have recommendation how to fix that is the only sales that can sell bundle to that stores is the one who is assigned to that stores, this way only 1 way ticket for each agent and stores right, and another flaw that i see here is this return goods is making everything complicated TBH, i still have no solution for that, this returning goods system could cause a lot of flaws inside the system isnt it. decide 1 = A, decide 2 = we should add time limit from days to week or months or forever for this, decide 3 = i dont understand what u mean, decide 4= see my recommendation for that one and we re discuss it again"*

| Question | His answer |
|---|---|
| 1. New shop | **A** - a new shop waits |
| 2. How long | a time limit per package: **days, weeks, months, or forever** |
| 3. Hand-giving | not understood - asked again with an example |
| 4. Ticket | his own rule instead: **only the salesman assigned to a shop can sell it a package**; discuss again |
| Returns | he has no solution; asks whether returns are a wider flaw |

**He was right about the ticket.** Two phones with no signal both hand the goods over; the database refuses the second one hours later, when the lighter is already gone and a real sale would be thrown away. A wall that falls after the goods left is not a wall.

**What his rule changes, checked in the code:**
- One salesman per shop means one phone per shop, so the phone's own check (which also sees its own unsent sales) is enough. The two-phone case is gone.
- It merges with answer A: "a boss assigned this shop to a salesman" IS the boss's confirmation of a new shop. An unassigned shop gets no package.
- ⚠️ The assignment today is the salesman's NAME as free text (`assignedAgent`, written in `JourneyView.jsx`, matched loosely; `firestore.rules` says so itself near the customers block). The phone can compare it; the database cannot trust it. To make the rule firm, an assignment must also store the salesman's id from now on (a new field beside the name - old shops keep working on the name).
- A small record per shop per package is still needed (a "stamp": who took it, when): the time limit needs the date even after a new phone or a reinstall, and the boss needs to see it. With one writer per shop it can never collide, so it never costs a sale.

**Returns, my view:** do not solve it, bound it. If a return never gives the limit back, the worst a return trick can win is one lighter per shop per period - which is the promo's own budget. Add one report line for the boss (took a package, returned the cigarettes within 7 days) to SEE it, not to block it. Returns in general are a separate question and a good read-only audit for Antigravity.

Still open after this round: question 3 (re-asked), the stamp rule, the return rule, the Antigravity audit.

## DECIDED, 2026-11-12 12:24 WIB

> *"boss assign here means, should be regional manager tier 4 as default who are responsible for that confirming the new customer, but higher tier inside that team can also see that, for example if tier 3 visit muntilan then that tier 3 can see the confirmation coming to its account as well . yes to all recommendation"*

| Question | Decision |
|---|---|
| 3. Hand-giving a package item | closed in the slip list ("package only"); items in no package can still be given by hand |
| 5. A shop nobody assigned | gets no package; this is also how a new shop waits |
| 6. Returns | never give the limit back; nothing else changes in Retur; one report line for the boss |
| 7. Database record + assignment id | yes; he publishes the rule in the Console |
| Who confirms a new shop | **tier 4 (Regional Admin, the code's FLEET_CAPTAIN) by default**; a higher tier inside that team sees the same request - a tier 3 visiting Muntilan sees it on his account too |
| Antigravity reads the Retur path | yes; queued behind its open task (the 38-findings audit) |
| The total side of the phone bar opens the order list | yes; built and live, kpm df1fd6d6 |

Build order (kpm `.claude/NEXT-SESSION.md`): A phone-only checks and the editor fields · B the rule, the record, the limit window · C the new-shop confirmation queue · D the returns report line.

## Stage A built and live, 2026-11-12 17:45 WIB (kpm 141dd879)

Built: the on/off switch, which shops (Retail / Grosir / both), the limit fields, two matrix keys (`switch_bundle`,
`set_bundle_limit`, tiers 1-3 by default); the terminal refuses with the reason on the card (off, no registered shop,
Ecer, nobody assigned, another salesman's shop, already in this order); package items are closed in the hand-give list.

Choices made while building, not asked first - each one is one condition to flip:

| Choice | Why | Flips if |
|---|---|---|
| The assigned-salesman match is EXACT (roster name or sign-in name), not the picker's loose `includes` | "Adi" would open Aditya's shops; a wrong refusal costs a package, not a sale | real owners get refused because their roster name and sign-in name differ from the assignment text |
| The boss account is held to the same rule: it cannot sell a package to a shop assigned to someone else | his words name no exception | he says the boss is free of it (asked, see PROGRESS) |
| The boss account still gives package items by hand | his 2026-10-27 *"can u add so that tier 1 can give the item straight from the master vault?"* | he wants the boss closed too |
| A switched-off package still closes its item in the hand-give list | switching a package off must not reopen the leak it closed | he wants an off package to free its item |
| The gift is capped by the cigarettes still in the cart | add a package, take the cigarettes out, keep the lighter: a hand-give through the back door | never |
| The limit stops a second package in ONE order only; the editor says so | the count over days needs the per-shop record (stage B) | stage B ships |

Not exercised for real: the gate at the save (the lab has no proof photo). It is pinned by text and the gate itself is
checked on real cases.

## Stage B built and live, 2026-11-12 18:25 WIB (kpm 20131db3) - NOT the way the plan said

The plan (decision 7) was one new record per shop per package plus a Console rule. While building, the shop's own
sales turned out to already be that record: every sale stores `offers` with `taps` (online and offline), sales can
never be edited or deleted (`transactions: update, delete: false`), every salesman may read them, and the terminal
already reads a shop's sales by name for the shop-level check (no index). So stage B counts the sales.

| | New record (the plan) | The shop's sales (built) |
|---|---|---|
| Console rule for him to publish | yes | none |
| Extra write per package sale | yes, could fail or be skipped by a phone | none |
| Survives a new phone | yes | yes |
| Return gives the limit back | must be coded around | cannot: a return is its own sale |
| Boss sees who took it | new screen | already in the sales and Offer Performance |

not-chosen: the new record - lost on a rule to publish and a write that can fail. Flips if: a shop's sales stop being
readable to salesmen, or one shop passes ~1k sales (then an index or the record).
Known edges: an old sale typed under another name is not counted; an offline sale can be counted twice for the moment
it syncs (refuses a package, never a sale). The assignment id (decision 8) is not built: only a rule needs it.
Also proven this round: stage A's check at save, for real (another salesman's shop refused, nothing written).

## Rejected on purpose

- **A limit per deal** (my first recommendation, before he explained): it does not stop a second sale to the same shop an hour later. His per-shop rule is the right one.
- **Phone-only enforcement (A)** as the final form: it is the UI-Says-Yes-Server-Says-No pattern this project has paid for before.
- **Boss approval per sale (C)**: flips only if a package ever carries something expensive enough that one wrong give matters more than the lost speed.

Models applied: Inversion (the table of tricks), Second-Order Thinking (a per-shop limit makes registering shops valuable, so registration becomes the weak point), Reversibility Test (a claim ticket is written once and is hard to take back - which is the point, but a "reset" for T3 must be designed with it).
