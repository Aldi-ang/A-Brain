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

### ⚠️ The constraint that must survive into round 3

**"Futuristic" normally arrives as glow, scanlines and CYAN — and cyan is blue, which the palette
law forbids.** So the pad has to be futuristic in **form** (depth, precision, mechanism, exact
alignment, real 3D panel movement) and never in **colour**. Slate, gold, amber. A field instrument,
not a sci-fi prop. This was put to him directly and he has not yet answered.

### Carried forward from the manual

Keep: the tilt-reactive light (the one thing a desk monitor cannot do) · the fore-edge index ·
progress as an edge meter rather than a widget · a real 3D transition, which a pad can do by sliding
panels in depth without owing anyone a hinge.
Drop: the hanging ribbon · the cover · the spine · the fold.

**Status: OPEN.** Nothing built. Round-3 artifact not yet made — the session ended on plan quota.
