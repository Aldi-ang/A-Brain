---
title: "Source — Stock Count Trust Chain, 2026-08-21 afternoon"
description: The five commit messages from the 2026-08-21 afternoon block on StockOpnameView, verbatim from the kpm-inventory repo. Leak detection, recount, variance cause, tolerance, and the crash.
type: raw-source
created: 2026-08-22
updated: 2026-08-22
tags: [raw, kpm, stock-opname, source]
---

# Raw source — the stock count trust chain, 2026-08-21

Immutable. Copied verbatim from `git log` on branch `phase0-solid-ground` in the
`kpm-inventory` repo. Commits `08e98ce`, `2d8d371`, `e103469`, `7153a82`, `7989b82`.
Per the "tell it once" rule these commit messages ARE the story — nothing was written
down anywhere else.

---

## `08e98ce` — 2026-08-21 15:46 — Stock count: leak detection — the same product short week after week is not a miscount

Aldi, 2026-08-21: "u can add leak detection for this trigger for everytime stock
opname is done, which is each week actually".

One short count is a counting mistake. The SAME product short week after week is a
leak, and nothing in the app could see that before, because every audit was filed
on its own and never compared with the last one. No new data is collected -- this
reads the approved audits already on file.

WHERE IT LIVES IS THE DESIGN DECISION, AND IT IS NOT THE COUNT ROW. Two reasons,
both of which would have made the obvious placement useless or harmful:
  1. `auditHistory` only loads when isHighCommand -- the rules refuse pending_audits
     to everyone else, so a counting agent would see an empty result and conclude
     all was well.
  2. Telling the person counting "this one is usually short" biases the count.
     Blind counting exists so the shelf decides the number, not the expectation.
HQ is who acts on a leak anyway, so it sits on HQ's review row.

The threshold is deliberately dull: at least three counts on record and short in at
least two of them. He counts weekly, so that is three weeks of evidence before the
app accuses anyone. Flagging on one or two counts would cry leak at ordinary
miscounts, and a warning that is usually wrong gets ignored -- worse than none.

THE SELF-CHECK CAUGHT ITSELF. The threshold was first retyped into the check file
rather than lifted from the source, so a probe that loosened the SHIPPED rule to
"short once in one count" changed nothing -- all checks still passed, because they
were testing the check file's own copy. Both the streak function and the threshold
are now lifted out of the component, and the same probe correctly turns two checks
red. A check that cannot fail proves nothing.

Nine behaviour checks, run on real numbers: never counted, one short, two of two,
two of three, three clean counts, a repeated surplus (never a leak), an old problem
ageing out of the five-count window, and audits that never mention the product.

npm run build clean; integration.audit 599/599; logicFixes.selfcheck 529/529.

---

## `2d8d371` — 2026-08-21 15:51 — Stock count: a difference is counted twice before HQ ever sees it

The last hole in the count path, and the one that made counts untrustworthy.

WHY IT MATTERS IN MONEY. HQ approving a count applies increment(counted - expected),
so a miscount is written into real stock -- and that wrong figure then becomes the
EXPECTED figure for the next count. Count 98 instead of 100 once, and the next
honest count of 100 reports a surplus of 2. One typo poisons two months. Most
differences in a real warehouse are miscounts, not theft, so the cheapest correct
thing is to count again before anyone acts on it.

HOW IT BEHAVES. A row whose variance is not zero cannot be submitted; it offers
"clear and count again" instead. Count the same number twice and the shortage is
real -- it goes to HQ marked countedTwice. Count something different and the app
asks a third time. Aldi chose the three-way rule himself, option B: when all three
disagree, ALL THREE go to HQ and the app picks none of them. Three different
answers mean something other than counting is wrong, and that is a judgement.

THREE THINGS A LAZY VERSION GETS WRONG, each now pinned by a check:
- It shows him the previous number. If he sees 98 he retypes 98 and the second
  count proves nothing. The boxes are blanked and the attempt is kept where only
  the submit path reads it.
- It re-takes the expected snapshot on the recount, silently re-opening this
  morning's moving-target bug while still looking like it works.
- It lets an already-counted row be deleted by emptying both boxes -- which drops
  the attempt history, so clearing and retyping the same wrong number submits
  without any recount at all. Found while writing this, not after.

The prompt never names the difference. "You are 5 short" hands a blind tier the
answer this screen exists to withhold, and tells any tier exactly what to type to
make the warning disappear.

Nine behaviour checks on real numbers plus five regression guards, all lifted from
the source rather than retyped. Proven by breaking the shipped rule two ways --
first difference not demanding a recount, and a three-way disagreement silently
recorded as confirmed -- each turning exactly one check red.

npm run build clean; integration.audit 599/599; logicFixes.selfcheck 543/543.

---

## `e103469` — 2026-08-21 16:43 — Stock count: a confirmed difference has to say why

HQ used to receive a bare "-3" and had to guess between a bookkeeping fix, a
write-off and a person. Damage has said what kind since this morning; a shortage
said nothing at all. The cause decides what happens next, exactly as it does for
damage: an unrecorded sale is bookkeeping, breakage is a write-off, theft is a
person. Leak detection already tells HQ WHICH products repeat; this tells them why.

It appears only once the difference has survived the recount. A cause given on the
first guess is a guess, so the control is not offered until recountState reports
confirmed or disagreement.

It starts UNSET, on a face reading "tap to say what happened", and can never cycle
back to it. A picker resting on a default gets submitted unread, and this field is
the one that decides whether a shortage is filed as arithmetic or as a person --
the same argument that put "tap to set" in front of the damage kinds.

Same reel as the damage kinds, deliberately. Aldi approved that control by eye on
2026-08-21, and a second control that looked different on the same screen would be
the mistake here. HQ's review row now carries three chips: the cause, and whether
the number was counted twice or is one of three that disagreed.

🔴 THE FIVE WORDS ARE MINE, NOT HIS. Miscount, unrecorded sale, breakage, theft,
supplier short. His standing law is that only he names the categories in his own
trade, and he has not seen these. They are provisional so the control could be
built and looked at. Records already saved keep whatever string was used, so the
list must be settled BEFORE agents count with it, not after. A check pins that the
list is still the provisional one -- when he renames them that check fails, which
is the moment to delete it.

Also fixed, caught by its own suite: the check that pins the damage strings against
the sales terminal scraped the WHOLE file for `value:`/`label:` pairs, so adding a
second array of the same shape made it read the causes as damage kinds. It is now
scoped to the DAMAGE_REASONS block.

npm run build clean; integration.audit 599/599; logicFixes.selfcheck 554/554.
Proven by disabling the shipped rule, which turned exactly three checks red.

---

## `7153a82` — 2026-08-21 16:51 — Stock count: under one pack is loose sticks, not a shortage

Aldi, asked what size difference is not worth his time: "few batang wont worth my
time, few bks is still money bruv we need that". So the line is exactly one pack.

THIS IS NOT A COMFORT SETTING, IT FIXES A BUG SHIPPED THIS MORNING. Selling in
Batang stores qty / sticksPerPack (App.jsx:3127), so a product that has had loose
sticks sold from it holds a FRACTION of a pack -- 99.44, say. The count box is
parseInt and takes whole Bks only, so the agent can type 99 or 100 and the variance
can never reach zero. Before the recount landed that was merely a wrong number on
screen. With the recount it forced a pointless second count and filed a fake
half-pack shortage on that product every single week. The tolerance is what makes
counting a batang-carrying product possible at all.

The figure is still printed exactly as counted -- nothing is rounded or hidden.
Only the verdict treats a sub-pack difference as a match, which is his own
granularity: batang are noise, a whole pack is money.

A blanket rename in this change put `item.matched` on HQ's review row, a field that
does not exist on a saved record, which would have painted every row red on a value
that is always undefined. Caught before commit and now pinned: HQ judges a saved
row with the same tolerance the agent's row uses.

Nine behaviour checks including the two that matter -- a batang-carrying row no
longer demands an endless recount, and one whole pack short still does. The
tolerance is lifted from the source and injected into the lifted recount rule
rather than retyped; raising it to five packs in the source turns five checks red.

npm run build clean; integration.audit 599/599; logicFixes.selfcheck 565/565.

---

## `7989b82` — 2026-08-21 17:12 — Stock count: fix the crash that made the whole screen fail to load

Found by opening the app in a browser, which is the only thing that could have
found it. Aldi asked for exactly this and was right to.

    ReferenceError: Cannot access 'hasTyped' before initialization

The count row read `hasTyped` two lines ABOVE its own `const hasTyped`. A const is
in the temporal dead zone until its own line runs, so every render threw and the
entire Stock Opname tab fell through to LazyTabBoundary -- a blank screen reading
"[STOCK_OPNAME] FAILED TO LOAD". The fix is moving one line below another.

WHAT MAKES THIS WORTH A LONG MESSAGE: it shipped in the recount commit and survived
two more commits after it. `npm run build` compiled it without complaint.
integration.audit reported 599/599 and logicFixes.selfcheck reported 565/565 on a
screen that did not render at all. Neither suite renders anything -- they read
source and run lifted functions. Every check in this repo can be green while the
app is a black rectangle.

A static guard for it was written and then deleted. It passed on the broken code as
readily as on the fixed code: a probe restoring the bad ordering did not turn it
red, so it was decorative. That is the second decorative check caught today, and
the rule earned twice over is now written where the first one is -- prove a check
fails before trusting it, and delete it when it cannot. The comment left behind
says the honest thing instead: there is no static check for "it renders", so open
the screen.

npm run build clean; integration.audit 599/599; logicFixes.selfcheck 565/565 -- and
this time the screen was confirmed to load in a real browser.
