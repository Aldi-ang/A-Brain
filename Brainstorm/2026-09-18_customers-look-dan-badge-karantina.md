---
title: The Customers look, the sideways swipe, and the Quarantine count — his three asks after T1/T2, and the boards on the table
description: Aldi confirmed Agent Inventory (8b9b3f9) and Customers (a9822ff) on his phone and asked for three more things in one sentence — the Customers screen is "static and too simple", it swipes sideways on the phone, and the Quarantine count badge should be "more animation HD". Measured, diagnosed, four boards sent with live lab links (?look=). DECIDED all B at 10:45, shipped kpm 832ea7c.
type: brainstorm
created: 2026-09-18
updated: 2026-09-18
status: DECIDED — all B; shipped kpm 832ea7c
confidence: high
checked: 2026-09-18
tags: [brainstorm, phone, customers, agent-inventory, design, motion, 375]
---

# The Customers look, the sideways swipe, the Quarantine count (2026-09-18, 09:45–10:15)

## The problem, in his words

> *"T1 approve, t2 approve but i still dont like the formatting on the customer because the color and
> the UI is just look so static and too simple but the logic between pressable is working great i
> want u to redesign this panel i guess especially for the color and add some small animation on the
> folder or lighting or button and i dont really like that the customer segment is not fixed and
> locked on phone that i can swipe it right and left. and another thing is that i want u to redesign
> the quarantine quantity on the agent inventory number box and make it more animation HD and good
> as well"*

Three asks, one confirmation. T1 (Agent Inventory `8b9b3f9`) and T2 (Customers `a9822ff`) are
CONFIRMED on his phone.

## What measured / what was found

| ask | finding |
|---|---|
| "static and too simple" | The Customers screen never joined [[The KPM Control System]]: its folder rows and shop cards are plain Tailwind (`bg-raised border shadow-sm`), no `.kpm-hot` (the RE sweep + ink bar every other record has), no material grading. Two gold plates on one screen (ADD and FOLDER) against the amber rationing law; the folder icon sits in a `--danger-well` red box (red = hazard, a folder is not). Nothing moves on touch. |
| "swipe right and left" | Not the list — at 375 in the shell the page `scrollWidth` is 375 at every folder level, with the form open, and at the shop level. The one sideways scroller is inside a shop's DETAIL page: the Competitor Intelligence `<table className="min-w-[600px]">` in an `overflow-x-auto` box (600 in 310). That block slides under the thumb. Same view: the four benchmark inputs are bare (white in dark mode) and "Open in Map Mission Control" is `text-[var(--gold-ink)]` on `bg-[var(--raised)]` — black on near-black until hover. |
| Quarantine count | `inline-flex min-w-[21px] h-[19px] bg-danger-badge text-white text-[12px]` — a flat red pill, no motion, proportional digits. |

## The options (boards 3–6, live as `?look=`)

Loaded first: his taste file (latched not floating; one lit colour, black when off; norak = two
animations on one moment; cleanest won; lowkey 3D stays; amber is an edge and an ink), the
inspiration house rules, `impeccable`, `emil-design-eng`, `redesign-skill`. `taste-skill` skipped
(same audit-first idea as redesign-skill).

**Boards 3 + 4 — the Customers look (folder level, shop level).**

| option | what it is | costs |
|---|---|---|
| A · LIT ROWS | rows lit from the top (12 % gold into `--raised` over 56 px), hairline highlight, soft drop; the `.kpm-hot` sweep + a 3 px amber edge on touch; press sinks 1.5 %; rows rise in staggered (280 ms, 45 ms apart, keyframe-owned start so Lite Mode leaves them visible); folder icon in a bezelled `--inset` well; count as a printed mono chip; FOLDER demoted to hairline + mono so ADD is the only gold plate; search as a well | the calmest change — in a still it reads as "almost the same"; the motion is the change |
| B · KEY CAPS (recommended) | A + rows stand 3 px proud (`0 3px 0 var(--line-2)`) and sink 2 px on press; a 6 px lamp on the folder well, black until touched, then amber | more depth on a screen he scans all day; his own "pressed and stays down" spec, though a folder does not latch (it navigates) |

**Board 5 — the Quarantine count.**

| option | what it is | costs |
|---|---|---|
| A · HAZARD TAG (recommended) | `--danger-well` fill, 3 px `--danger-rail` on the left, 13 px mono tabular digits, 22 tall; a 2.4 s breathing edge while count > 0 (the NOTICE motion — "alive, waiting on you"); digits roll on change (needs a prev-value state) | red budget: a chip + a rail, inside the rationing law |
| B · LED COUNTER | black `#000` well, glowing red mono digits, a 5 px red lamp pulsing 1.6 s; same roll | the glow is a filter → Lite Mode strips it to flat red text on black (still reads); a lamp that pulses forever on a screen he opens all day may tire |

**Board 6 — the sideways swipe (YES/NO, one fix).** Under lg the competitor table stacks: product +
brand / price right / performance / notes across / delete right; `thead` hidden; the PC keeps the
table. Same commit: surface tokens on the four benchmark inputs, and the map button's ink.

## Models applied

Chesterton's Fence on the red folder box (it exists because the whole app once used red as
"important"; the rationing law since made red mean hazard — remove) · Inversion on "too static"
(what would make a list feel dead: no response to touch, no arrival, one flat material — all three
were true) · Second-Order on the breathing badge (a salesman sees it all day; breathing at 2.4 s is
the slowest motion already in the app and was accepted on the notice boxes).

## Decision

DECIDED 2026-09-18 ~10:45, his words: *"board 3 = B, board 4 =B, 5 = B, 6 = B make sure that the
animation is clear and HD and smooth ,just to let u now that sideways swipe is inconvenience for phone
so make sure that most of the segment doesnt have that"*. Board 6 was a YES/NO — "B" read as the
second frame, YES. Shipped kpm `832ea7c`.

**What the audit changed on the way in.** G30 (nothing in the control system depends on a shadow —
Lite Mode strips them on cheap phones) refused the first theme block: every proposal had been drawn
with `box-shadow` / `text-shadow`. The shipped material is the same shape drawn with a 4 px
border-bottom (the proud edge), gradient layers (top light, hairline, recess, plate edges) and no
glow on the LED digits. G32 refused `--danger-text` as text → a fixed `--led-ink` token, because the
LED's well is black in both themes and `--danger-ink` goes dark in light mode. The boards he chose
from carried the glow and the soft drop; he was told in one line.

**His new rule, generalised:** *"sideways swipe is inconvenience for phone so make sure that most of
the segment doesnt have that"* → THE SIDEWAYS RATCHET in `logicFixes.selfcheck.mjs`: no `<table>`
under lg may carry a bare `min-w-[Npx]`; only `HistoryReportView.jsx:500` and `:808` still do (the
Reports day of the sweep), and no file may join them. ❓ still open: was the shop page the place he
swiped?

## Rejected on purpose

- **Adding colour.** He said "the color"; the laws say slate/rust/gold/cream, few amber, red only for
  hazard. What changed is LIGHT (a top-lit gradient) and MATERIAL (well, chip, hairline), not hue.
  If he answers "more colour" the honest next step is the light-mode material question, not a new
  hue.
- **Hover lift on rows.** He rejected lift on the rail (2026-09-03): raised = available, sunk =
  chosen. Rows sink.
- **A striped (hazard) badge fill.** Stripe means irreversible in the control system; quarantine
  stock is not irreversible.
- **Shrinking the competitor table's font to fit 310 px.** A cut name or a 9 px price is a
  data-entry hazard; stacking keeps every field legible.

## Instruments added

`tools/lab-looks.js` — proposal CSS behind short names; `?look=cust-a,pin` etc. injected after the
app stylesheet (ponder-lab.jsx). `FIXTURES['benchmarks']` so the competitor table has rows.
