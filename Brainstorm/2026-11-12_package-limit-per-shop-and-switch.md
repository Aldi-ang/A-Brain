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

## The boss and the assigned-salesman rule, DECIDED 2026-11-12 18:30 WIB (kpm aabead7e)

> *"well only tier 1.2.3 can have that ability as default and do your test"*

Tiers 1-3 may sell a package to a shop assigned to another salesman (matrix key `sell_bundle_any_shop`, his switch wins
once saved). Built narrower than "free of the rule": a shop with NO salesman still waits for every tier, because that
wait is how a new shop gets confirmed (stage C). Flips if he wants T1-T3 to sell packages to unconfirmed new shops too.
The per-shop limit stays right with two sellers on one shop: it counts the shop's sales, whoever made them.

## Stage C stopped on a finding, 2026-11-12 18:45 WIB - OPEN, waiting on Aldi

Journey Plan lets ANY signed-in user assign any shop to any salesman (`src/JourneyView.jsx:459`
`const canAssignAgent = !!user;`; `view_journey` is in every tier's list, T5 included), and the database lets any
salesman with shop-edit access change `assignedAgent` (`firestore.rules:751`). So a salesman can register a new shop,
assign it to himself in Journey Plan and sell it a package straight away: trick 2 from the Inversion table, back through
a side door. The tier-4 confirmation queue means nothing until this is closed.

| Option | Buys | Costs |
|---|---|---|
| A. Assigning in Journey Plan = tier 1-4 only (recommended) | the "assigned salesman" rule becomes real on the phone | a salesman can no longer plan his own route by taking shops; if he does that today, his work changes |
| B. Leave it, report self-assignments to the boss | nothing changes for salesmen | the package limit stays a suggestion |
| C. A + a database rule that only T1-T4 may change assignedAgent | closes it in the database too | a rule he publishes; every other writer of assignedAgent (CustomerManager.jsx:662 transfer) must be checked first |

Question put to him (verbatim in kpm PROGRESS 2026-11-12 18:47).

**DECIDED 2026-11-12 21:30 WIB:** *"i think i only give the paintbrush features for tier 4 and above in default bro"* - he
believed it was already locked; the pens were, the two Assign Fleet boxes were not. Built option A (kpm 9eda75b5): choosing
a shop's salesman = tier 1-4, pins stay open. Option C (the database rule) is still open. Second-Order Thinking applied: the change alters what a
salesman does every day, so it is his, not mine.

## Rejected on purpose

- **A limit per deal** (my first recommendation, before he explained): it does not stop a second sale to the same shop an hour later. His per-shop rule is the right one.
- **Phone-only enforcement (A)** as the final form: it is the UI-Says-Yes-Server-Says-No pattern this project has paid for before.
- **Boss approval per sale (C)**: flips only if a package ever carries something expensive enough that one wrong give matters more than the lost speed.

Models applied: Inversion (the table of tricks), Second-Order Thinking (a per-shop limit makes registering shops valuable, so registration becomes the weak point), Reversibility Test (a claim ticket is written once and is hard to take back - which is the point, but a "reset" for T3 must be designed with it).

## Stage C built and live, 2026-11-13 05:30 WIB (kpm 56942b48)
Where: Customer Directory, under the Grosir requests, for the same people (tier 1-4 or the boss's unlock): "Shops waiting for a salesman", only shops with no salesman that person may edit (his region or folders). Give picks a name from the roster (never typed - the terminal matches exactly), asks first, writes assignedAgent + assignedBy + assignedAt, reports.
Found on the way: an 'ADMIN' bell line was read only by the boss's own account, so a tier 4 who confirms Grosir never heard a Grosir request. Now tier 1-4 also get GROSIR_REQUEST and NEW_SHOP lines; every other 'ADMIN' line unchanged.
No Console rule: tier 4 already writes customers (isSalesman + region/folder lines).
Rejected on purpose: putting the queue in Journey Plan (it already has the per-shop owner box; the directory is where Grosir is decided, so one place for both asks) · a "new shop" age limit on the list (any shop with no salesman gets no package, old or new; the list shows 8 then "Show all").
Models applied: Second-Order Thinking (who hears the bell), Inversion (what if T4 never sees it - the bell gap).

## Clear count DECIDED and built, 2026-11-13 05:55 WIB (kpm 63e79fb6)
His words: "yes i think tier 4 and above can refresh that immediately and test it yourself" (to: should tier 3+ be able to clear one shop's package count). He picked tier 4 and above, wider than the tier 3 asked. Built as customer.bundleReset[package id] = time of the clear; the count reads only sales after it; the sales stay untouched; audit BUNDLE_COUNT_CLEARED. Button on the terminal package card, only when that count is full.
Cost he accepted: every clear is also a way around the limit - stage D's report should name cleared shops too.
Rejected on purpose: deleting or editing the sale (sales can never be edited, by rule) · a counter field on the shop (two sources of truth with the sales).

## Stage D built and live, 2026-11-13 06:30 WIB (kpm 3f5e71bb) - the package rules A-D are complete
Where: Sales History > Context Analytics, under Offer Performance (same period and region fence; not in a field agent's own report). "Package, then Retur within 7 days": one row per Retur of a package's cigarettes at the same shop within 7 days, tied to the LATEST package sale before it. Plus "Package counts cleared, last 30 days" from customers bundleReset.
Caught in the lab: the first version listed one Retur twice when the shop had two package sales - fixed before the push, and the self-check holds it.
Rejected on purpose: blocking or undoing anything (his rule: show, not stop) · a new screen (one line beside the offers it is about) · reading outside the report period (ceiling noted in the code).
