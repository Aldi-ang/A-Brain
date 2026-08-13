---
title: Aldi's Design Taste
description: What Aldi actually likes and rejects in an interface, built only from things he said about real screens. Written on his instruction — he wants his taste learned, not guessed at each time.
type: concept
created: 2026-08-10
updated: 2026-08-11
confidence: medium
checked: 2026-08-11
tags: [pattern, design, taste, ux, aldi]
---

# Aldi's Design Taste

Written 2026-08-10 on his explicit instruction: *"always update all the new knowledge and skills
that we have everytime we made a mistake or i there some design that i dont like and like to know
my taste better, keep improving everytime"*.

**Every line below is evidence from a real screen he judged.** Confidence is `medium` on purpose:
taste at 14 moves, and this page is young. Add to it; do not invent from it.

---

## The laws (locked — do not re-litigate)

1. **No blue, no green.** The palette is slate/rust/gold/cream. `slate-*` *is* the blue. Gold is
   never used as text on a light background. Violations he has caught himself: the setup screen
   in emerald, the OTP screen in blue, the Edit Record panel using green-vs-blue to tell pairs
   apart.
2. **Every action must report.** See [[Silent Failure Disease]]. This is taste as much as
   correctness — a screen that does something without saying so reads as broken to him.
3. **"Lite mode" means performance, not a white theme.** Borders are exempt. Nothing rotates.
4. **The receipt keeps KPM's company blue.** The printed nota is not app UI; the palette law
   stops at the print block.

## The theme has a name now: RE9 "Ark Lab" (2026-08-13)

His words, unprompted, while rejecting a screen: *"always remember, our theme is Resident evil 9
ark lab theme, for dark mode is black white and amber, while light mode is white black amber and
red color"*.

Two things follow, and they are not the same thing:

1. **Amber is the accent's name.** `--gold` (#D4AF37) is that amber. Nothing to change in code.
2. **He said light mode is WHITE.** The locked Phase 3 decision is that light mode's ground is
   bench STEEL and *"#FFFFFF appears nowhere as a surface"*. Asked directly on 2026-08-13 he
   chose **"Keep steel for now, decide later"** — so the law stands, but he has now said "white"
   once and it will come back. Do not repaint the light tokens without asking again.

**What he actually wants from a redesign, his words:** *"i want u to rebuild everything, but make
sure that all the features is still intake, i want better presentation of all of this button and
features to be more presentable, since i will redesign the whole setting as well, make sure that
the logic and theme and button design and animation that we made here could be use for button in
another place so design it well"*.

That is a request for a **control system, not a screen**: one button/panel/switch vocabulary
defined once and reused. It is also the first time he has asked for something to be built to be
reused elsewhere — treat a one-off className sweep as the wrong answer to this ask.

**Rejection worth recording:** the Architect Terminal was migrated onto the tokens (`b25c526`,
palette-clean, audit group 27) and his verdict was still *"i dont like the UI for the architect
terminal still, redesign it again"*. **Palette-correct is not designed.** The tokens are the
floor, not the deliverable — layout, hierarchy and character are what he is judging.

## Stock assets: watermarked files are not raw material (2026-08-13)

He pointed at `bluefire pixel.webm` in his reference folder and asked for the alcove's fire to
look like it. The file is a **Shutterstock clip with the watermark burned into every frame**,
directly across the flame. It cannot ship in a business app.

**The rule:** a reference folder is for LOOKING at. Generate an equivalent asset instead — the
blue pixel flame was rebuilt as an 8-frame sprite from a Doom-fire automaton, which he owns
outright. Say why, once, and hand him the replacement rather than the objection.

## What he calls "cheap"

He has used the word twice, both times about motion, and both times he was right:

- The old ACCESS GRANTED screen: a 2.4s progress bar that was **pure waiting** — both unlock
  paths had already finished their database write before the bar rendered. He read decoration
  over nothing as cheap. Fixing it was mostly deletion.
- The panel outro: 3.0s of crafted wave animation landing on a **200ms fade**. The parts did not
  match in effort.

**The pattern: "cheap" means the effort is not where the moment is.** It does not mean "add more
animation" — when four richer outros were designed for him he kept the plain one. It means find
the beat that was never designed and design *that*.

**The correction that cost a session:** he said "cheap" about the whole ACCESS GRANTED beat, and
it was read as a standing complaint about the outro specifically. Four variants were built off
that misreading. **Ask which part before designing.**

## What he actually chose, when given choices

- **He keeps the default surprisingly often.** Three designed panel outros lost to the existing
  fade-and-shrink: *"from all your design what we already have is still the best"*.
- **He stops a design round himself when it stops paying.** *"i dont want to waste anymore time
  to design this, lets move on with other work"*. Treat a long design round as a cost he is
  paying, not a gift.
- **He tunes numbers rather than swapping concepts.** The gate went through spacing, density,
  size and wave-speed sliders and ended at *"make the wave little bit slower and we done bro"*.
  **Give him sliders on a live prototype, not a gallery of finished options.**
- **He judges timing honestly and closes it.** 8.5s for the unlock: *"timing is fine"*.

## Words he uses, and what they mean

| His word | What he means |
|---|---|
| "cheap" | effort is not where the moment is |
| "expensive and elegant" | the thing should look considered — his ask for the T9 button |
| "not smooth" / "snapped and gone" | there is no exit animation at all, only an unmount |
| "collapsing" | two elements overlapping, not a layout folding |
| "cutted" | clipped by a container edge, usually on the phone |

## Recurring complaints, worth checking before he has to say it again

- **Clipping on the phone.** The capybara mascot has been reported cut off more than once.
  Anything positioned at a screen edge needs a phone check.
- **Panels that overlap text.** The 3D dimensions panel sits on the product name; the manifest
  sheet's pinned buttons eat the product list.
- **Controls that appear where they do not belong.** *"i dont want to see the sidebar button on
  the login screen"*; the dimensions editor should exist in Master Vault only, not in the sales
  preview. **A control shown in the wrong context is a design bug to him, not a minor one.**
- **Fixed elements on a phone.** He rejects pinned toolbars that shrink the content area. His
  choice on the manifest sheet, 2026-08-10: one slim bar with SIGN only, everything else scrolls.
  **But he will BUY fixed height when the thing pinned answers the first question of the task.**
  One day later, 2026-08-10 ~21:00, on the sales terminal: *"what if we put the customer on top
  instead just near the strip?"* — the customer picker was in the middle of the manifest paper, so
  naming the buyer meant opening the drawer and scrolling. It shipped 2026-08-11 (`237bf6f`) as a
  44px bar above the drag handle; the closed drawer went 52px → 96px, permanently taking 44px from
  the wares list — the exact category he rejected the day before. **The rule that reconciles the
  two is his own condition: it had to collapse to ONE LINE.** Fixed height is not the objection;
  fixed height that grows, or that pins something you are not currently answering, is.

  **So the question to ask before pinning anything: is this the FIRST thing the salesman must
  answer, and is it one line?** Two noes and it scrolls with the paper.

## How to give him a design decision

- One bold line saying what he must decide. He skims.
- Mark it `🔴 DECIDE`. Group the asks; never bury one mid-paragraph.
- Name components by **what they do on screen**, never by filename.
- Give a recommendation with the reason, and say what it costs. He decides fast when the cost is
  stated and stalls when handed a menu.
- Live and playable beats a picture. He judges motion by feeling it, and he uses slow-motion
  toggles when offered.

## Law: only Aldi names the categories in his own trade (2026-08-12)

His words, unprompted: *"dont add extra grade or jenis tembakau inside yourself, only i can decide
what considered as jenis or grade and any other criteria"*.

Context: `pasangSheet` used to seed `M_BARANG` with `Janturan 2026`, `Rajangan Boyolali 2026`,
`Rajangan Panggil 2026`, `Saput`, `Non Gula`, plus a petani `SRI RAHAYU` with a real-looking BRI
account and a pabrik `OM CK`. Those were written as *placeholders*. In a dropdown a placeholder is
indistinguishable from real master data, and he was still seeing them weeks later — *"i dont know
why it still show up in the dropdown as well"*.

**The rule, generalised:** a value that classifies his business — jenis barang, grade, agen,
petani, pabrik, or any future criterion — is his to name. Never invent one, never seed one as an
example, never "helpfully" extend a list he wrote. Structural values the *code* needs are a
different thing and are fine (`IN`/`OUT`, `persen`/`kg`, `LUNAS`/`BELUM LUNAS`) — the test is
whether the word describes his tobacco or describes the software.

Applied: all `CONTOH_*` seed arrays are now empty; `GRADE` was already free text and stays that
way. **Still unaudited against this rule:** `CARA BAYAR` offers `TRANSFER / CASH / BON` and
`JENIS NOTA` offers `NOTA AGEN` — both may be my inventions rather than his vocabulary, and the
round-2 review separately flagged that `NOTA AGEN` is explained nowhere. Ask before relying on them.

## Related

- [[Master Vault Gate]] — the screen most of this evidence comes from
- [[Silent Failure Disease]] — law 2, in its bug-class form
- [[Ponytail Philosophy]] — the minimal-code discipline; his taste and it agree more often than not
- Source: [[../../Raw/2026-08-10_source_kpm-six-days-aug04-to-aug10|the six-day source]]
