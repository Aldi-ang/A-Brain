---
title: The phone tutorial shell — four options
description: Three rounds of phone-shell drafts. Round 3 direction: a tech pad, not a book — a book's obligations (cover, spine, two halves) are what kept breaking on a phone. Ribbon killed, thumb index kept. OPEN.
type: brainstorm
created: 2026-09-02
updated: 2026-09-02
confidence: high
checked: 2026-09-02
tags: [design, ponder, phone, aldi, open-question]
---

# The phone tutorial shell — four options

**Status: OPEN — waiting on Aldi.** He rejected all four of the first round and gave creative
freedom; a fifth direction was designed and is now what he is reviewing.

- **Round 2 — THE FOREMAN'S MANUAL** (current): <https://claude.ai/code/artifact/2cc96364-ff22-4221-b93c-05a7c1cb2bb3>
- Round 1 — the four retreat options: <https://claude.ai/code/artifact/2a41b123-dac8-4c56-89d0-8f4bcd846026>

## The problem, in his words

> *"here is something that i dont like, on the phone it cant look good, if its possible to look good
> then try fix it for me maybe we need to redesign it into other forms than book, maybe do a quick
> research for that and for pc let it stay book, or another suggested change is that just remove the
> realistic feature of this book. it looks so clunky on the phone, maybe just keep it simple and
> revert it back to old one, where 1 swipe and the section teleport maybe its better at this point,
> and for the phone itself what if we change the book into other model can u think of this and make
> me some draft first so that i can choose rather that build and keep changing it?"*

## The diagnosis worth keeping

**A book's whole idea is the two-page spread and the hinge between them. A phone can only ever show
one half, so the phone book is a book with its best feature amputated.** Every phone fault of the
last two days is that same missing half surfacing somewhere new:

| Phone fault | Date | It was really |
|---|---|---|
| cover swings out past the spine onto nothing | 09-01 | no second half to close onto |
| cream wedge standing over the ribbon column | 09-01 | a folded sheet has nowhere to lie |
| closed pose shows a bare leather board | 09-02 | the cover shuts edge-on, so it is invisible |
| "it looks so clunky" | 09-02 | all three, plus the ribbon column eating 84 of 375px |

**Four separate patches to one root cause is the signal to stop patching.** That is the reason this
went to options rather than a fifth fix.

## The options

| | Shell | Gesture | Drops | Keeps | Build |
|---|---|---|---|---|---|
| **A** | Card deck | horizontal swipe + dots | fold, cover, spine, all 3D | the swipe, the sideways feel | smallest |
| **B** | Scroll list | none — vertical scroll | everything: pages, cover, swipe, position | all 17 chapters visible at once | small, unbreakable |
| **C** | Flat book | swipe or ‹ ›, 120ms slide | the 3D fold, the riffle, the closed arrival | **the book** — ribbons, paper, the chip flight | mostly deletion |
| **D** | Shelf → card | tap a spine, tap back | pages, the cramped ribbon column | **the book world** — leather, gold, spines | largest |

**What each costs, beyond the build:**
- **A** — seventeen dots is a lot of dots.
- **B** — it stops feeling like a book at all.
- **C** — a book with no depth may just read as a plain panel. **This is his own suggestion.**
- **D** — two taps to reach a chapter where there are currently none.

## Decided already (do not re-open)

🔴 **PC: keep the book, drop the riffle.** His pick, 2026-09-02. Page turns and the 3D fold stay;
pressing a ribbon jumps straight there instead of turning N pages. Removes `riffle()` and its plan
from `pageModel.js` (~40 lines) and the run effect from `PonderBook.jsx`. **The turn itself is
untouched.** Not yet built — it waits with the phone decision so both land in one pass.

🔴 **He wants to review before building.** *"make me some draft first so that i can choose rather
that build and keep changing it"* — his own words, and the reason the artifact exists. **Do not
build a phone shell until he names one.** Four rebuild-then-revise cycles is what he is buying his
way out of.

## Rejected on purpose

- **Making the phone book work as a book.** Considered and refused: it needs a second half it does
  not have. Four patches already went into that hole.
- **Keeping the riffle on the PC.** He chose to drop it after seeing it. Built, verified, and being
  removed anyway — his call, not a defect.
- **framer-motion.** Approved and installed at `^13.1.1`, still unused. Every option above is a
  slide or a tap; nothing here needs a spring. Reopen only if a settle feels stiff to him.
- **Deciding for him from a sketch.** He asked to judge it in his hand, and a card deck genuinely
  feels different under a thumb than it reads in a box drawing.

See also: [[The Book as a Stack of Sheets]] · [[Aldi's Design Taste]] · [[Ponder Tutorial System]] ·
[[Design Inspiration Sources]]

---

## Round 2 — and why round 1 was the wrong menu (2026-09-02)

His verdict on all four: *"everything is too simple i need better animation and UI for this, i want
something more gamified and cool i still want the 3D tho"*.

🔴 **The mistake worth recording: every one of the four options was a way to RETREAT from 3D, and
his complaint was never that it was 3D — it was that it was CLUNKY.** Those are different problems.
The diagnosis above ("a phone cannot show a spread") was correct, but the conclusion drawn from it
was wrong: a phone cannot be a *desk* book, which is not the same as not being a book.

**What a phone can do that a desk cannot: it is a slab you HOLD and TILT.** So the phone book stops
imitating the desk and becomes the thing the desk has no access to — an object in your hand. That
is more gamified and more 3D, not less.

Asked to choose the feel and the level of gamification, he handed both back: *"i'll let u be
creative and made your own theme for the ponder book for phone"* and *"i give u freedom for that, if
there is something i dont like i can just tell u after u made it"*.

### The theme chosen, and why

**A foreman's manual — gold-stamped, thumbed, chained to the warehouse.** A working book, not a
decorative one. It sits inside the app's existing world (leather, gold, cream, Master Vault) instead
of importing a new one.

| Move | What it is | Why it earns its place |
|---|---|---|
| **Tilt-reactive light** | a specular sweep across leather, gold foil and paper, driven by `deviceorientation`, falling back to pointer position | the single thing a desk monitor cannot do; this is the whole thesis |
| **Page curl** | the turning sheet BENDS — a gradient tracking the fold, not a flat rotation | a flat rotate is what read as clunky |
| **Thumb index** | notches cut into the fore-edge, one per chapter | how a thick manual is really navigated, and it kills the 84px ribbon column that ate a quarter of a 375px screen |
| **One hanging ribbon** | sewn at the SPINE, hanging down the gutter, its length = position | replaces seventeen ribbons with one. **First attempt hung it down the fore-edge and it lay across the words** — a bookmark is attached at the spine |
| **The page block IS the progress bar** | cream edges both sides; left grows, right shrinks | the meter is the object, not a widget stuck on it |

**Gamification: physical + progress, not a full unlock layer.** Read chapters are stamped in foil on
the fore-edge and the block fills. **Deliberately no reward ceremony** — a tutorial is opened
mid-task, in a hurry, and ceremony gets in the way of an answer.

**Lite Mode is a toggle in the draft**, so the still state can be judged rather than promised: motion,
sheen and curl go; every colour and every word stays.

### Rejected in round 2

- **All four round-1 shells.** Each retreats from 3D, which was never the complaint.
- **A full game layer** — unlock sequencing, reward flourishes, completion states. See above.
- **Progress that survives reinstall.** Kept in `localStorage` for the draft. Whether it should
  reach Firestore is a real question and has not been asked yet.

---

## Round 3 — the ribbon dies, and the direction turns to a tech pad (2026-09-02)

His verdict on the foreman's manual: *"tbh that ribbon going longer and shorter is weird so erase,
but maybe this small book model with little section on the right will work well. basically change
the size and model of the section will work, maybe it look better when it is a tech pad instead of
book, like futuristic style way to read what do you think?"*

### 🔴 DECIDED — the hanging ribbon is removed

He is right and the reason is worth keeping: **the page block already IS the progress meter, so the
ribbon was a second meter reporting the same fact in a worse way.** A bookmark whose length changes
is not a bookmark. Two indicators for one quantity is always the wrong answer, and the one that
looked physical was the one that lied.

### 🔴 THE THUMB INDEX IS THE PART THAT WORKED

*"this small book model with little section on the right will work well ... basically change the
size and model of the section will work"*. The fore-edge index is the only navigation idea across
three rounds that he has praised unprompted. **Whatever gets built keeps it** — and on a pad it
stops being a compromise and becomes correct: a channel of section keys down the right edge, inside
thumb reach, is what a handheld terminal should look like.

### The case for the pad, which is stronger than "futuristic looks cool"

**A book is a physical metaphor, and physical metaphors carry obligations.** A book must have a
cover, a spine, two halves and a closing motion. Every one of those has cost a bug on the phone,
because a 375px screen cannot afford them:

| The obligation | What it cost |
|---|---|
| a cover | swung out past the spine onto nothing |
| two halves | a folded sheet with nowhere to lie — the cream wedge over the ribbons |
| a closing motion | the closed pose showing a bare leather board |
| a spine | the 84px ribbon column eating a quarter of the screen |

**A pad owes none of it.** No cover, no spine, no missing second half. It can be exactly the size of
the screen, because that is what a screen is. It is also closer to the app's own world: KPM is a
warehouse system read on a phone in a gudang, and a field terminal fits that better than a leather
manual.

### ✅ ANSWERED — futuristic in form, not in colour

*"well be creative just as long as we use futuristic theme for this u made and i can adjust later"*
(2026-09-02). He confirmed the theme and handed over the execution. **The palette law is not
negotiable and was never in question** — so the pad is futuristic in **form** (depth, precision,
mechanism, exact alignment, real 3D panel movement) and never in **colour**. Slate, gold, amber. A
field instrument, not a sci-fi prop.

### Carried forward from the manual

Keep: the tilt-reactive light (the one thing a desk monitor cannot do) · the fore-edge index ·
progress as an edge meter rather than a widget · a real 3D transition, which a pad can do by sliding
panels in depth without owing anyone a hinge.
Drop: the hanging ribbon · the cover · the spine · the fold.

**Status: OPEN.** Nothing built. Round-3 artifact not yet made — the session ended on plan quota.

---

## THE SPEC — build this (2026-09-02, his approval given)

*"well be creative just as long as we use futuristic theme for this u made and i can adjust later"*.
Design locked below so the next session builds once instead of exploring again.

### The object: **a field terminal, not a screen pretending to be paper**

A hardened handheld a gudang worker would actually carry — milled slate housing, an inset display,
gold anodised edges. Nothing skeuomorphic: **no paper, no leather, no cover, no spine, no fold.**
Those obligations are exactly what kept breaking. The pad is honest about being a screen.

### The five moves, in priority order

| # | Move | Why it earns its place |
|---|---|---|
| 1 | **The section rail is the hero** — the fore-edge index reborn as a channel of milled key-caps down the RIGHT edge, thumb-reachable, each with its code and a state light | The only navigation idea he has praised on sight, three rounds running. It stops being a compromise and becomes what a handheld terminal *should* look like |
| 2 | **Panels move in real depth** — sections arrive by sliding forward on Z and settling, not by rotating. Perspective and parallax between the rail, the panel and the housing | Keeps the 3D he explicitly refuses to give up, without a hinge to owe |
| 3 | **Tilt-reactive** — the housing's milled edges catch light, the display gets a faint sheen, the rail's key-caps highlight as the phone moves | Still the one thing a desk monitor cannot do. Carried straight over from the manual |
| 4 | **Progress as an edge meter** — a thin illuminated track down the LEFT housing edge, filling as sections are read | Replaces both the page block and the deleted ribbon. **One meter, one fact** — the mistake that killed the ribbon |
| 5 | **Readout chrome** — mono labels, tabular numbers, a fine baseline grid, hairline rules, a status strip | Futurism carried by precision and information density rather than by glow |

### 🔴 Palette — non-negotiable

- **Housing** slate, cool but never blue-cast: `#1C1F22` → `#0E1012`
- **Display ground** near-black warm `#121014`
- **Ink** bone `#E8E3DA`, dim `#8E8779`
- **Accent** the KPM gold/amber `#FF8C1A`, with foil `#FFD9A0` for the tilt highlight
- **State** amber = current, dim bone = read, faint = unwritten
- **BANNED: cyan, teal, electric blue, green.** No exceptions, including "just for the glow".

### ⚠️ Rules the draft must obey

1. **Lite Mode toggle in the artifact.** Motion, sheen and parallax go; every colour and every word
   stays. Judged, not promised.
2. **No glow-as-crutch.** If a shape only reads because it is glowing, the shape is wrong.
3. **17 sections, real data**, from `src/ponder/sections.js`. Never filler.
4. **Thumb reach.** Every control on the right edge, lower two-thirds.
5. **It must survive a still frame** — he judges on a phone, often paused.

### Rejected on purpose, round 3

- **Scanlines, CRT bloom, holographic sheen, cyan grids.** Cyan is blue. And a warehouse terminal
  used in daylight would not glow.
- **Any paper or leather texture.** The whole point of dropping the book is dropping its obligations.
- **A reward/unlock layer.** Unchanged from round 2: a tutorial is opened mid-task, in a hurry.
- **Keeping the hanging ribbon in any form.** Deleted, and the edge meter replaces it.

**Status: SPEC LOCKED, NOT BUILT.** Session ended on plan quota with none of the app touched.

---

## Round 4 — THE TECH PAD IS BUILT (2026-09-02, ~21:10 WIB)

**Artifact:** <https://claude.ai/code/artifact/ad98ec70-ede4-4866-95f6-aa553c9f0ef0> — "Ponder Field
Terminal". Built straight from THE SPEC above, no fourth exploration, no menu. **No KPM app file
was touched.**

### What shipped in the draft, against the five moves

| # | Move | How it was built |
|---|---|---|
| 1 | Section rail is the hero | 17 milled key-caps down the RIGHT edge, three-letter code + a state lamp each. Flex-sized, so all 17 fit any phone height without scrolling. Active cap fills gold and steps out toward the reader |
| 2 | Panels move in real depth | leaving panel goes back to `translateZ(-110px)`, the arriving one comes forward from `-150px` and settles. Rail sits at `+15px`, meter `+5px`, display at `0` — real parallax under tilt. **Nothing rotates** |
| 3 | Tilt-reactive | `deviceorientation` drives `--tx/--ty`; the housing rotates ±5.5°, the gold rim's gradient angle shifts, and a light band sweeps the face. iOS needs a tap for permission, so there is a **TILT** cap — without it the gyro would silently do nothing and read as dead |
| 4 | One progress meter | a 17-segment illuminated track down the LEFT housing edge. Read = foil, current = amber. **No second indicator anywhere** |
| 5 | Readout chrome | IBM Plex Mono labels, tabular numbers, hairline rules, a status strip (`SEKSI 02/17 · DIBACA 02/17`) and a footer (`MODUL SIAP 05/21`, counted from the real data) |

### Two deliberate deviations from the written spec — both need his eye

1. **No lucide icons.** `sections.js` carries an `icon` string per section, and the book uses them.
   The pad uses a **milled code plate** (`RST`) instead, matching the rail cap. An instrument reads
   in codes, not pictograms — and it removes a CDN dependency that fails silently. Reversible.
2. **Single theme.** The pad is a dark object; the spec's palette has no light values. So it does
   not follow the app's light/dark switch. If the tutorial must invert with the app, that is a
   second palette he has not been asked for.

### Verified by rendering, not by claim

Both states were rendered and screenshotted at phone width: normal, and **Lite Mode ON** — the
sheen and the depth offsets go, every colour and every word stays. Section 02 was opened by
pressing its rail cap; the panel, the status counts, the meter and the caps all followed.

⚠️ **One bug was caught only because it was rendered.** `.display` was placed at `translateZ(-9px)`
inside the `preserve-3d` housing, and a child at negative Z **paints behind its own parent's
background** — the whole readout was invisible while the rail and the meter drew perfectly. A
still-frame check is what found it; the DOM was correct the entire time.

### Status

🔴 **OPEN — waiting on his verdict.** The riffle removal from the PC book is queued behind it and
ships in the same pass, unchanged from the round-3 decision.

### Round 4 review — his three rulings, all applied same session (2026-09-02)

> *"the backlight is too much i think, i dont think its convenience to look at in the long term
> maybe just remove the backlight. and i want the section button to be 1 full word instead so its
> easier to read right, the lowkey 3D looks kinda cool tbh"*

| Ruling | Applied |
|---|---|
| Backlight out | the sweeping light band is deleted, not dimmed. The milled grain moved to Z 0 and first in the DOM, so it stays on the housing and never crosses the words. Tilt still reads through the housing rotation, the rail/display parallax and the rim gradient |
| One full word per key-cap | the rail now prints `short` from `sections.js` verbatim — Command, Restock, Setoran, Piutang. The invented three-letter codes are gone. Rail 58px → 80px |
| Lowkey 3D approved | unchanged, and now the only motion left. Recorded in [[Aldi's Design Taste]] |

Two things went with it, unasked and worth naming: the readout's scrollbar is themed instead of
the OS grey bar, and the panel's `SEKSI n / 17` eyebrow is gone because the status strip already
prints it — **one fact, one indicator**, the rule that killed the hanging ribbon.

**Still open:** the two deviations from round 4 (code plate vs lucide icon — now moot, the plate
carries the word; and the single dark theme). And his verdict on whether the pad ships.
