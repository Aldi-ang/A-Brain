---
title: Panel arrival animation — how the phone tech pad opens and closes
description: Three entrance/exit choreographies for the phone Ponder panel, the phone's answer to the PC book flying out of its slot. Open, waiting on Aldi.
type: brainstorm
created: 2026-09-03
updated: 2026-09-03
confidence: high
checked: 2026-09-03
tags: [design, ponder, animation, phone, aldi]
---

# Panel arrival animation — how the phone tech pad opens and closes

## The problem, in his words

> *"this is not what i mean, what i meant is the animation when u press that icon. there will be an
> intro to open the ponder panel and also outro when we press the X button right, thats what i want
> u to make, not the intro and outro of the icon bruh. like for example we have book icon for pc,
> we press the icon and the book come flying towards the screen and open up, while closing it
> trigger close book and fly back to the original position right, i also want the ponder panel to
> have animation but different kind, should be align with the technology high tech theme of course
> and its for phone only."*

⚠️ **This is a correction of a misread, and the misread is the lesson.** Asked for "the intro and
outro", I built the ICON's — its own appearance and disappearance in the top bar. He meant the
PANEL's: press the tutorial icon, the Ponder panel arrives; press the X, it leaves. Both readings
were live and the request did not disambiguate them. Karpathy rule 1 says present both rather than
pick one silently; it was not applied, and it cost a full round.

**He specified it by analogy, and the analogy is the spec.** The PC book flies out of its slot,
opens, and on close shuts and flies back. He wants the phone's equivalent — *"different kind"*,
aligned with the high-tech theme, phone only. That is a complete brief once the analogy is read as
one: an object travels from where you pressed, and it does something mechanical when it gets there.

Also settled by this ask: **the pad had no close control.** An X now sits on the pad's own status
strip rather than floating over the display.

## The options

Studies: https://claude.ai/code/artifact/1df504b7-f3d9-412c-ae16-5924ec1cb80c · source
`Brainstorm/assets/ponder-panel-arrival.html`

All three animate the **same** terminal out of the same six parts — the housing, the gold rim, the
left edge meter, the rail lamps, the picture, the text — so what is being compared is the
choreography and nothing else. Exit is faster than entry in all three, because by then the reader
has already decided to leave.

| # | Study | The housing | In | Out | What it costs |
|---|---|---|---|---|---|
| 1 | **Deploy** *(recommended)* | unfolds out of the icon: a point, a bar across, then the slab drops open from the chip's corner | 710 ms | 380 ms | the longest of the three; the reader waits ~280 ms before the panel is readable |
| 2 | **Power on** | already there, wakes in place from 95,5% with no travel | 720 ms | 270 ms | the only one that does not point back at the chip, so the panel appears from nowhere |
| 3 | **Slide and lock** | comes up off the bottom edge, rim lighting as it rises | 560 ms | 260 ms | fastest and most phone-native, but it borrows a gesture every app already uses |

**Why Deploy is the recommendation:** it is the only one that keeps the book's spatial contract —
one object travels from where you pressed — while being unmistakably a machine deploying rather
than a book opening. It also continues the icon's own CRT collapse, so the icon and the panel are
one motion rather than two.

**The staging is the same in all three and it is the part that carries the theme:** rim traces,
edge meter runs, rail lamps run, picture powers on, text writes. Each part fires once and holds.
Nothing loops.

## Decision — the EXIT is settled, the ENTRANCE is not

> *"deploy looks the best for the closing but what about the intro? i mean the animation when the
> ponder panel is opened"*

**Deploy's exit is locked.** The picture squeezes to a scanline, the slab folds to a bar, the bar
snaps back to the chip. 380 ms, faster than any entrance.

**He split the two halves, and that is the useful part.** An entrance and an exit were offered as
one package per study; he took one half of one study and asked the other half again. So the exit
was never really three options — it was one good idea he recognised. The entrance is a separate
decision and always was.

**Why Deploy's own intro was the weak half, worked out after he said so:** it is the exit played
backwards. Point, bar, slab. That reads as *undoing a close*, not as arriving, and it spends
280 ms on geometry before a single part lights.

### Four entrances, one exit

Same artifact, rewritten: https://claude.ai/code/artifact/1df504b7-f3d9-412c-ae16-5924ec1cb80c

All four use Deploy's exit unchanged, so only the way in is being compared. Two honest numbers per
study: when the slab is on screen, and when the last word has finished writing.

| # | Entrance | The idea | Slab / done |
|---|---|---|---|
| 01 | Unfold *(the baseline)* | point, bar, slab — the exit backwards | 280 / 990 |
| 02 | **Surge** *(recommended)* | the slab lands dark almost instantly, then one wave of light runs through it from the chip's corner: rim, meter, lamps, picture snapping on overbright and cooling | **130** / 840 |
| 03 | Assemble | the machine builds itself from its three columns — rail in from the right, meter from the left, display between them, rim flashes as it locks | 370 / 990 |
| 04 | Scan in | a bright bar crosses the screen and leaves the terminal behind it, top to bottom | 300 / 940 |

**Why Surge is the recommendation:** it is the only one where nothing moves after the first 130 ms.
The geometry settles immediately and the *lighting* is the animation — which is the most
machine-like reading of "high tech" available, and the fastest to something readable. It is also
the least likely to age badly, because there is no travel to get tired of.

**Assemble is the most gamified** and the one to pick if he wants the show over the speed; it keeps
you waiting 370 ms before there is anything to read. **Scan in** is the most literally sci-fi, and
that is the argument against it: a beam that materialises hardware is a film idea, not a machine
idea.

**Still OPEN — waiting on Aldi's entrance pick.**

## Rejected on purpose

- **A book-like flight for the phone.** He said *"different kind"* explicitly. Something that flies
  and opens on a hinge is the book with a new skin.
- **Reusing the panel's section-to-section crossfade for the arrival.** That crossfade (.17s out,
  .14s in, opacity only) was approved this morning for swapping sections *inside* an open panel.
  It is deliberately plain, and it is the wrong instrument for an arrival.
- **Anything that loops while the panel sits open.** Every part fires once and holds; a running
  animation under the text is the *norak* fault again.
- **Touching the PC.** Phone only, his words. The PC keeps the book.

Related: [[2026-09-03_tutorial-icon-candidates]] · [[Aldi's Design Taste]] ·
[[2026-09-02_phone-tutorial-shell]]
