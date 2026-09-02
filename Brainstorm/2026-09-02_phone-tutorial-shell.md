---
title: The phone tutorial shell — four options
description: The book is clunky on a phone because a phone cannot show a spread. Four candidate shells drafted as a live artifact for Aldi to operate; PC decided to keep the book without the riffle. OPEN.
type: brainstorm
created: 2026-09-02
updated: 2026-09-02
confidence: high
checked: 2026-09-02
tags: [design, ponder, phone, aldi, open-question]
---

# The phone tutorial shell — four options

**Status: OPEN — waiting on Aldi.** He is reviewing the artifact.
Artifact: <https://claude.ai/code/artifact/2a41b123-dac8-4c56-89d0-8f4bcd846026>

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
