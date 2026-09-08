---
title: A Store Name Is Not a Store
description: Aldi's book contains several shops that share a name, kilometres apart. Any code that identifies a shop by its name is a money bug waiting for the second shop to open.
type: concept
created: 2026-08-18
updated: 2026-09-08
confidence: high
checked: 2026-09-08
tags: [pattern, identity, money, kpm]
---

# A Store Name Is Not a Store

**Three shops in his book are called "warung sembako sumber rejeki". The furthest two are
14.5 km apart. The name is a label, not an identity.**

Recorded in `src/MerchantSalesView.jsx:515-533`, in the comment that guards the auto-select:
auto-picking the first exact match "would bill the wrong shop, which is real money and
unpickable afterwards."

## Why this keeps happening

The customer *document* has an id. Almost nothing else does. Transactions are written with
`customerName` and no customer id at all (`src/hooks/useTransactionEngine.js`), so any screen
that reconstructs a customer from transactions — the receivables view groups on
`t.customerName` — has no id available to be correct with. The name is the only key in reach,
so the name is what gets used, and the bug is invisible until a second shop registers.

## The three fields that actually identify something

| Field | Lives on | Trustworthy for |
|---|---|---|
| `c.id` | customer documents | the shop itself, exactly |
| `t.agentId` | every transaction | which agent holds the row (`agentProfileId \|\| 'ADMIN'`) |
| `t.customerName` | every transaction | display only — **never** a selector on its own |

## The rule

A name-keyed sweep is acceptable only when a second field narrows it to one owner. Where the id
is unavailable, scope by `agentId`; where several documents share a name and nothing separates
them, **do nothing rather than guess** — writing to the first match relabels a shop nobody
touched.

And do not reach for `t.customerId` to fix it. It does not exist. A filter on a field no
document carries matches nothing, which fails silently and reports success — see
[[Silent Failure Disease]].

## Where it has bitten

- **Sales terminal** — auto-select on a typed name, guarded 2026-08-14 by requiring exactly one
  exact match before selecting.
- **Account hand-off** — `handleAdminApproveTransfer` reassigned every shop sharing the name,
  fixed 2026-08-18, commit `505ddcf`. See
  [[../Summaries/Store Hand-off Name Collision]].
- **Sale engine** — `handleMerchantSale` did BOTH halves of this mistake at once, fixed
  2026-08-18, commit `264c138`. It matched on part of a name (`.includes`), so "SARI" typed for
  a walk-in booked the sale and its Titip debt onto "WARUNG SARI RASA" — and it APPENDED the
  price tier to the name of any store it had not seen, saving "Warung Bu Sari (Retail)", so the
  next visit typed the real name and found nothing. The sales terminal was already careful; the
  engine redid the lookup loosely underneath it and overrode that care. A screen's guard is
  worth nothing while the engine behind it guesses again.
- **Receivables screen** — groups by name. Two same-named shops under one agent still appear as
  a single row (unfixed, and NOT fixable by customer id — no transaction carries one). As of
  `264c138` it at least groups on `storeKey`, so a legacy "(Retail)" row and a clean row are one
  shop again instead of two half-balances.
- **Agent profile** — `storeDebt`, the agent's own "who owes me" list, keyed on the raw name, so
  one shop appeared several times holding part of its debt each and a payment filed under one
  spelling never cancelled the others. Fixed 2026-08-18, commit `4b63118`. The map now keys on
  `storeKey` and stores the name as written, so the key is lowercased and the list is not.
- **Door-step brief, day stats, auto-pick** — all three fixed 2026-08-18, commit `f1e3b28`.
  `customerBrief.js` had defined its OWN normalizer (trim + lowercase, no suffix rule), so a shop
  with older "(Retail)" rows reported "no recent order" and the salesman walked in blind;
  `dayStats.js` counted stores by raw name, inflating his own day; `MerchantSalesView`'s auto-pick
  compared raw names. All three now use `storeKey`.
- **Map mission control** — matched a store's history with a raw `===` between `store.name` (the
  customer document) and `t.customerName` (typed at the counter) in three places, plus a fourth
  private trim+lowercase copy in the XP loop. One capital letter apart and the pin showed no
  sales, no stock and no debt — a shop with an open Titip balance read as settled. Fixed
  2026-08-18, commit `a3a9cf6`. **The XP loop WRITES**: `lifetimeXP` / `seasonXP` are committed to
  the store documents by the RPG Migration button, so a split history had been banked too low and
  those numbers will come out higher the next time he presses it.
- **Eight more, found by a guard instead of by hand** — 2026-08-18, commit `ef437b1`. After four
  private copies had been found one session at a time, a check was written to scan every file
  under `src/` for a `.trim().toLowerCase()` next to a store-name identifier. It found EIGHT, five
  of them on no list: the hand-off duplicate check, the customer document a hand-off pins to, the
  row sweep a hand-off WRITES, `JourneyView`'s visit map on the build side AND both read sides,
  the FIFO debt engine at the counter, and the rank metric. Plus `EODReconciliationView`'s
  `storesServed`, a count banked into the career document with `increment()`.
  **Finding the class beat finding the instances by five to three.**

- **Account hand-off, again, 2026-09-08** — this time the shop had NO document at all.
  `handleAdminApproveTransfer` wrote `status: 'APPROVED'` unconditionally and only then looked for
  the customer to move; the owner change and the `handoffs` entry both sat inside
  `if (targetCustomer)`. "HQ 3" matched zero documents, so the request said APPROVED, the store
  stayed with the sender, the receiver never got it, and the approver had no history to show —
  one failure wearing three faces. Fixed `cdaabc7`: the target is resolved before anything is
  written and the approval is refused when there is none.

## The rule that follows from it, added 2026-08-18

Because the name IS the key, **nothing may ever be appended to it.** Writing the price tier into
the name looked harmless — it read nicely on a receipt — and it created a second shop on every
first visit. The tier was already on every cart line as `item.priceTier`, so the suffix carried
no information that was not already stored properly.

And a fix that changes the written form is only half a fix. Dropping the suffix alone SPLITS
every shop that already has it: old rows say "Warung Bu Sari (Retail)", new rows say "Warung Bu
Sari", and any screen grouping by name shows one shop as two rows with half the balance each —
no error, no red number, nothing to notice. So the old form has to be tolerated when COMPARING,
in one shared place. That place is `storeKey()` in `src/utils/helpers.js`: trim, strip a
**trailing** " (Retail|Individual|Wholesale)", lowercase, `String()`-coerced so a customer
document with no name field cannot throw. Only at the end — "Warung (Retail) Jaya" is a real
name, not a tier.

Pinned by 14 assertions in `logicFixes.selfcheck.mjs`; the six regression guards were watched
failing against the pre-fix code (stash the fix, run the check) before being trusted.

## A shop can exist on screen with no document behind it, added 2026-09-08

The page above assumes the problem is *which* document a name picks. There is a worse case: **none.**

`ConsignmentFinanceView`'s `customerData` (`:281`) is built by folding TRANSACTIONS, not by reading
the `customers` collection. So Active Consignments will happily show a shop with a name, a held
quantity and an outstanding balance while no customer document exists for it anywhere. Aldi read
that list as proof the shop was registered — reasonably, since it is the screen where he manages
shops — and it is not that at all.

Two consequences worth carrying forward:

1. **A screen listing shops is not evidence a shop is registered.** Ask which collection built the
   list before treating its rows as documents. The registry and the consignment list disagree by
   construction.
2. **Never write the "done" half of a two-part operation before the half that can fail.** The
   status write cost nothing to move; leaving it first turned a recoverable "cannot find the shop"
   into a permanent record claiming money and responsibility had changed hands. A toast explaining
   the failure does not undo a write — Aldi got that toast and the record stood anyway.

The second point is the general one, and it is not about store names at all. See
[[Silent Failure Disease]] for the family it belongs to.

## Related

[[Silent Failure Disease]] · [[Anti-Recurrence Check]] · [[The KPM Control System]]
