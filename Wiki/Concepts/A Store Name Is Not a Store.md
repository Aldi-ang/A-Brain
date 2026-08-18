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
- **Receivables screen** — still groups by name. Two same-named shops under one agent appear as
  a single row. Known, unfixed, needs the view re-keyed on customer id.

## Related

[[Silent Failure Disease]] · [[Anti-Recurrence Check]] · [[The KPM Control System]]
