---
title: A Store Name Is Not a Store
description: Aldi's book contains several shops that share a name, kilometres apart. Any code that identifies a shop by its name is a money bug waiting for the second shop to open.
type: concept
created: 2026-08-18
updated: 2026-08-18
confidence: high
checked: 2026-08-18
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
- **Door-step brief** — `src/utils/customerBrief.js` defines its OWN normalizer (trim +
  lowercase, no suffix rule), so a shop with older "(Retail)" rows reports "no recent order" and
  the salesman walks in blind. **Open**, queued in `.claude/NEXT-SESSION.md`, along with
  `dayStats.js` (counts stores by raw name, inflating the day) and `MerchantSalesView`'s
  auto-pick. A private copy of a shared rule is how a fixed bug comes back one file over.

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

## Related

[[Silent Failure Disease]] · [[Anti-Recurrence Check]] · [[The KPM Control System]]
