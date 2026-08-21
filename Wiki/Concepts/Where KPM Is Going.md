---
title: Where KPM Is Going
description: The settled decisions, the theme, and the direction — read this first to know what is locked and what is still open.
type: concept
created: 2026-08-21
updated: 2026-08-21
confidence: high
checked: 2026-08-21
tags: [kpm, decisions, theme, direction]
---

# Where KPM Is Going

Aldi asked for this page on 2026-08-21:

> *"just take some notes on important points that our app have, like the theme and all the
> decision that i made so u know for sure where are we going on this project"*

**Read this before proposing anything.** Everything below is his decision, not a suggestion.
Detail on how each was reached lives in the commit messages and in [[Aldi's Design Taste]].

---

## What the app is

A multi-tenant inventory and sales system for a cigarette distribution business. One owner, a
fleet of sales agents on motorbikes and vans, branch warehouses, and shops that buy on cash, on
credit (**titip**), or return goods. Agents work on phones, often with bad signal.

The people entering records can also be the people stealing, so nearly every design decision is
about **evidence**, not convenience.

---

## The theme — locked

- **No blue, no green. Ever.** `slate-*` IS blue and is banned too.
- **Dark is ~90%, light accents ~5%**, other colour sparingly.
- **Amber draws EDGES and INK. It does not fill boxes.** *"stop using amber background i said,
  i hate it, use it for little things"* (2026-08-21, second time). Gold may fill only: a selected
  tab, a primary button, or a bar whose **length is the data**.
- **`--accent-ink` is gold-as-TEXT and in dark mode is the SAME hex as `--gold`.** On any filled
  plate use `--gold-ink` or `--duke-on-fill`. This bug has appeared five separate times.
- **The third accent is violet** (`--alt-ink` / `--alt-edge`) — ink and edges only.
- **In light mode `--sunk` is DARKER than the panel.** Controls belong on `--raised`.
- **No `filter`, no dependence on a shadow or a blur.** Lite Mode deletes all of them; anything
  the meaning rests on must be a border, a background-colour or a position. Tailwind's `ring-*`
  is a box-shadow and is caught by this too.
- **Tints use `color-mix(in srgb, var(--x) 12%, transparent)`**, never the `/N` opacity modifier —
  Tailwind cannot parse `var()` through it, and 35 classes once painted nothing.
- **Motion is removed outright in Lite Mode and under reduced-motion, never frozen.** A stopped
  animation reads as a bug. Nothing rotates.
- **The receipt (nota) is exempt** — it keeps KPM company blue. The palette law stops at the
  print block.

## Laws about behaviour — locked

- **Every action must report.** Silence is a bug, not missing polish. His words, unprompted.
- **A sale is final** — no refund, no credit reversal. See [[Sale Is Final - no refund, no credit]].
- **Never `window.confirm` or `window.prompt`.** A blocked browser dialog does nothing, which is
  how duplicate data got explained away. All 69 were replaced by the dialog gate.
- **Fault follows the goods, not the money.** Goods delivered + money missing = the customer owes.
  No evidence of a sale = the agent invented it.
- **TITIP everywhere in labels, never "consignment".** Code names like `CONSIGNMENT_PAYMENT` stay.
- **Firestore rules are a DRAFT until Aldi deploys them himself.** Claude deploys nothing.

## How work is done here — his rules

- **Diagnose first, then change.** Report findings ranked with file and line; write no code until
  he picks the order.
- **No workflows, no subagents.** Settled 2026-08-20 and not open for re-litigation.
- **A fix is not finished until it leaves a line in `src/config/logicFixes.selfcheck.mjs`** — one
  regression guard and one behaviour check. *"i want u to check every single update that u made
  yourself"*. A trap encoded as a passing check beats a trap written in prose, because a check
  cannot go stale silently. See [[Anti-Recurrence Check]].
- **Replies are a few sentences.** Decisions only, no summary blocks, no check tallies.
- **Explain in plain English.** An approval he did not understand is not an approval.

---

## Where it is going — the direction

**Toward a count and a ledger you can trust without being there.** Every recent decision points
the same way: make the record carry its own evidence, so a number on a screen can be acted on
without asking the person who typed it.

Concretely, in the order he has been driving:

1. **Stock Opname is the priority.** *"stock opname is the most important lets fix that"*.
   Shipped 2026-08-21: expected damage has its own figure, damage carries a **cause and a
   quantity per cause**, and the target is frozen when a row is started so a mid-count sale
   cannot move it. Next: **count a difference twice before HQ sees it**, then variance causes,
   then thresholds so small differences stop drowning HQ.
2. **Counting in sessions, not wall-to-wall.** Pick a shelf, count it, close it, resume tomorrow.
   This is also the only real fix for a long product list on a phone.
3. **He wants "tokopedia and indomaret level".** Underneath that phrase is ordinary warehouse
   practice: cycle counting by ABC class, scan instead of scroll, sign-off with a reason.
4. **One email, one profile.** Tier 1 is currently three documents in `motorists`; stage A is
   done, stages B and C are not. **C before B shows his van as EMPTY** — the order is not
   optional.
5. **Merge to main last.** *"we might it later if we done with everything"*.

## The structural finding worth remembering

**Damage intake was an integer; damage resolution was a ledger.** `damagedStock` was a bare
number, while `quarantine_logs` recorded every exit with qty, method, value, who and when. So the
app could answer *"what left quarantine and why"* perfectly and *"what is in quarantine and why"*
not at all. Fixed at intake on 2026-08-21.

**It is a money change, not a tidiness one:** the cause decides who pays. RTV charges nobody,
PENALTY charges the agent at retail.

---

## Related

- [[Aldi's Design Taste]] — his exact words on every visual decision
- [[The KPM Control System]] · [[Anti-Recurrence Check]] · [[Silent Failure Disease]]
- [[Sale Is Final - no refund, no credit]] · [[UI-Says-Yes-Server-Says-No Pattern]]
