---
confidence: high
checked: 2026-09-09
status: DECIDED and SHIPPED — buyback is off for everyone, exchange stays
---

# A completed sale is a closed contract

## The business model, in his words

> "cash refund doesnt reduce omzet, this is outside of the company contract actually, when company
> sell the product its done, when they needed return, what can agent do is help the stores to
> resell their unsold product to other customer, well its by using agent own money and not the
> company" — Aldi, 2026-09-09

and then, a message later:

> "lets turn off buyback for now it makes counting profit and revenue more difficult anyway and
> company doesnt allow that, exchange still possible tho"

## What it means

The company sells to a shop; money changes hands; **the contract is finished.** There is no
company-side refund. When a shop cannot shift its stock, what happens is a private arrangement: the
salesman buys the goods back **with his own money** and resells them to somebody else. The company's
books never see it.

This is not a small detail. It decides the shape of every money figure in the app.

## Three things it explains that looked like bugs

1. **No company total reduces on a retur.** Omzet, Product Performance and EOD's expected cash all
   ignore `type: 'RETURN'`. That is correct, not an oversight.
2. **`returnTotal` is written in three places and read by no money calculation.** The
   [[2026-09-09_day-one-walk]] flagged this as a suspected bug and queued it for investigation.
   It is not one — it must never reach a company figure, because it is not company money. Closed.
3. **The "Taken" box on the sales terminal DOES net refunds out**, while EOD's expected cash does
   not. Both are right, and the difference between them is precisely the salesman's own money. With
   buyback now off, no RETURN carries a non-zero total anyway, so the gap cannot arise.

## What shipped

Buyback is off for **everyone, the owner included**. Exchange (Tukar Ganti) is untouched — it swaps
goods for goods at a forced price of zero, so no money moves and none of this applies to it.

It was already off by default for every salesman (`allowRetur` and `allowCashRefund` both default
to `false`, granted per person in Fleet & Roster). The only thing keeping it alive was the owner's
own account forcing it on. **"For now"** was taken literally: the code is intact and the per-agent
grant still exists, so one named person can be given it back in a minute if a genuine company-fault
case ever appears.

## The part worth remembering — it took TWO edits, and the second was invisible

`App.jsx` forced the privilege on in **two separate places**:

| where | what it said |
|---|---|
| the settings branch, ~L1591 | `allowCashRefund: true // Admin can always refund` |
| the render site, ~L4891 | `allowCashRefund={userRole === 'ADMIN' ? true : ...}` |

Fixing only the first left the Buyback button sitting on the owner's screen. **The build was green,
1388 self-checks were green, the `no-undef` gate was clean, and the button was still there.** The
only thing that found it was opening Retur Mode in a browser and looking.

Same shape as the revenue bug fixed hours earlier in
[[Revenue Recognition — Titip waits for the cash]]: one rule, written in more than one place, and
nothing forcing the copies to agree. See also [[UI-Says-Yes-Server-Says-No Pattern]] — a hidden
control is a courtesy, never a rule; the refusal in `handleFinalDeal` is the rule.

Three regression checks now pin both forms out, plus a net one: no line in `App.jsx` may grant the
privilege unconditionally, whatever shape the grant takes.

## Rejected on purpose

- **Deleting the Buyback code entirely.** Irreversible for a company-fault case he has not hit yet
  (wrong product delivered, damaged on arrival), and it would not remove the refund records already
  in the book — deleting a button never deletes history. He said "for now", so the code stays and
  only the grant went away.
- **Leaving it, since it was already off for every salesman.** That made the rule a habit rather
  than a rule, and left the one account that should model the policy as the one exempt from it.
- **Changing the "Taken" box to stop netting refunds.** With buyback off, no refund can be written,
  so there is nothing to net. Changing it would have been a fix for a state that can no longer occur.
