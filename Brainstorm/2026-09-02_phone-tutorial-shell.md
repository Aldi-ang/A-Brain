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

---

## Round 5 review — four asks, held for tomorrow at his request (2026-09-02, ~21:55 WIB)

> *"and i want u to do this tomorrow for now just make notes first, so i want the light on the left
> and dot light on the right to go along together, if press that section then both left and right
> lights will turn on then change seksi into section and i dont think we need dibaca here so just
> delete it. and i want to see the animation when u press this panel because there should be
> futuristic animation for intro and outro when we press the ponder panel right? save this for
> tomorrow prepare notes and prompt i want to sleep"*

**Nothing was built. No file changed.** He asked for notes and a prompt only.

### The four asks

| # | Ask | Status |
|---|---|---|
| 1 | The left edge light and the right key-cap dot must turn on together when a section is pressed | **cause already found — see below** |
| 2 | `SEKSI` → `SECTION` | one string, plus a language question it opens |
| 3 | Delete `DIBACA nn/17` from the status strip | one string |
| 4 | He wants to SEE an intro and outro animation when a panel is pressed | **cause already found — see below** |

### 🔴 Ask 1 — the two lights are already wired, and one of them inverts

`.key.on .lamp{background:rgba(14,16,18,.62)}`. When a key-cap becomes current it fills gold, so
its dot is repainted near-black to stay legible on gold. **At the exact moment the left edge lights
up, the right dot goes dark.** He read that as the two indicators disagreeing, and he is right —
they do. The fix is a state colour for the dot that reads as ON against the gold cap, not against
the slate one. Two lines, no restructure.

### 🔴 Ask 4 — the depth move exists, and the fade hides it

`.panel.out` is `opacity 0 / translateZ(-110px)`; `.panel.in` comes from `translateZ(-150px)`. But
the transitions are `opacity .16s linear, transform .30s`. **The opacity finishes in roughly half
the time the transform takes, so the panel is invisible for most of its flight.** What he sees is a
crossfade with a hint of scale — not an arrival. The 3D is real and is being thrown away by its own
fade curve. Fix is the timing, not more effect: hold opacity longer than the transform, or drive
both off one keyframe set.

⚠️ Worth keeping as a general shape: **an animation can be present, correct, and completely
invisible because a second property outruns it.** Nothing was broken; nothing was missing; the
motion simply never had a lit frame to be seen in.

### ❓ The one question ask 2 opens, and he is asleep

`SEKSI` is not the only Indonesian word in the chrome. Also on screen: `ISI`, `SIAP`, `SEGERA`,
`MODUL SIAP`, `DIBACA` (being deleted anyway), and the caption line. **Changing one word makes the
strip bilingual**, which is the exact thing [[Clear terms, one language]] exists to stop.

**Recommendation to put to him first thing:** change every chrome label to English —
`SECTION · CONTENT · READY · SOON · MODULES READY` — and leave the section blurbs and entry text
in Indonesian, because those come from `sections.js` and are the app's own words. The chrome is
instrument legend; the content is the manual. Two registers is defensible; two languages inside
one strip is not.

**Rejected on purpose:** translating the `sections.js` copy. That file is shipped app data and its
wording is his; a tutorial shell does not get to rewrite it.

**Status: OPEN — queued for 2026-09-03.** Prompt written to `.claude/NEXT-SESSION.md`.

---

## Round 6 — 2026-09-03. ALL FOUR SHIPPED, AND THE ANIMATION FIX WAS WRONG THE FIRST TIME

**His answer to the open question, verbatim:** *"only english the label, all the explanation should
be in indonesia"*. Accepted as recommended. Chrome is now `SECTION / CONTENT / READY / SOON /
MODULES READY / Section list`; every title, blurb and entry description stays Indonesian, and the
desk caption stays Indonesian while naming the English control (`tekan tombol section di kanan`).

| Ask | What shipped |
|---|---|
| 1 | `.key.on .lamp` is now `#6B2800` in a `rgba(255,250,240,.92)` socket ring — dense core, bright bezel, reads lit against gold. `paint()` also moved to fire ON THE PRESS instead of 150ms later, so both indicators are written in one synchronous loop |
| 2 | `SEKSI` → `SECTION`, plus the rest of the chrome |
| 3 | `DIBACA nn/17` and `stRead` deleted. The left edge meter is the only read-progress indicator |
| 4 | `.panel` moved from two racing transitions to one `@keyframes` set per direction, plus a staggered `entryIn` on the rows |

### ⚠️ The second cause, which the first fix did not touch

Holding the opacity across the transform was necessary and **not sufficient**. Measured on the real
page after that fix: the panel reached `opacity 1` at `scale .993` of `1.0` — 99% of its travel was
already spent. The old easing `cubic-bezier(.16,.84,.30,1)` is a hard ease-out that puts ~80% of
the distance into the first 30% of the time, so the panel **finished moving before it finished
lighting**. Invisible for a second, independent reason.

Fixed by spreading the travel: `cubic-bezier(.25,.46,.45,.94)` in, `cubic-bezier(.32,.06,.55,1)`
out, opacity to 1 at 22%. Re-measured: `opacity 1` now lands at `scale .961` — 40% travelled, 60%
of the journey still to run while fully lit. Outro: at `scale .960` (89% gone) it is still at
`opacity .51`, so the departure is seen.

**The general shape, sharper than the round-5 version:** an animation has TWO ways to be invisible
— a second property that outruns it, and an easing curve that spends the distance before the
element is lit. Fixing one and declaring victory is how the bug survives a fix. **A duration is not
a schedule; sample the real page.**

**Verified by frame, not by reasoning:** rendered at `http://localhost:4180/ponder-pad.html` off a
gitignored `dist/` copy (the artifact URL will not open in the in-app browser, and a local `file://`
loads as a script-less snapshot). Lite Mode re-checked in the same render: `animationName` reads
`none` on both `.panel` and `.entry`, every colour and every word intact.

**Status: CLOSED.** Published to the same artifact URL.

---

## Round 7 — 2026-09-03. OFF MEANS OFF, AND THE RAIL BECAME A KEYPAD

**His words, verbatim:** *"this light should be off by default and only turn on when the section in
their line is accessed, and also should be off in default until choose for the dot ligjht sc2 then
, make the animation and buttons more 3D and smoother if possible make it cooler more gamelike
features"* — sent with two crops, the left edge meter and the right key rail.

### The ambiguity, and why it was resolved without asking

"Off by default, on when accessed" has two readings:

| | Reading | Verdict |
|---|---|---|
| A | The UNLIT state is drawn too brightly, so cells that were never visited already look lit | **taken** |
| B | Drop the visited/read memory entirely — only the current section lights | rejected |

B loses on his own locked decision from round 6: DIBACA was deleted specifically so *"the left edge
meter is then the only thing reporting how much has been read"*. Reading B would delete the very
thing he kept. A is also just true on inspection — the unlit cell was `rgba(232,227,218,.10)` and
the unlit lamp `rgba(232,227,218,.13)`, both pale grey pips visible on every row, so seventeen
sections read as seventeen lights already on.

### What shipped

| Part | Before | After |
|---|---|---|
| Unlit meter cell | `rgba(232,227,218,.10)` pale bar | `rgba(5,6,7,.66)` dark well, inset shadow |
| Unlit key lamp | `rgba(232,227,218,.13)` grey pip | `rgba(5,6,7,.8)` dark bezel |
| Read lamp | pale cream | amber `rgba(255,140,26,.62)`, so it matches the meter's read colour |
| Current cap | `translateX(-4px) translateZ(10px)` | `translateX(-6px) translateZ(18px) rotateY(-5deg)`, rail given `perspective:620px` |
| Press | none — a colour change | `keyHit` — depress to `translateZ(-13px) scale(.965)`, then ride out with overshoot |
| Lamp turn-on | instant | `lampOn` bloom, ring expands to 3.2px then settles |
| Meter cell turn-on | instant | `segOn` — overbright flash, then settles to burn level |
| Panel flight | straight back | gained `rotateX(7deg)` in / `-5deg` out, so it swings on an axis |

**Measured, not assumed:** the active cap's bounding box is 220.7 x 107.0 against an inactive
210.2 x 88.4 — it is genuinely nearer the viewer under the rail's perspective, not just recoloured.

**Three lamp states now legible in a single frame** (verified): dark = never opened, amber = read,
gold cap with a bright ring = current.

Lite Mode re-checked by computed style: `animationName` is `none` on key, lamp, segment, entry and
panel, key transform is `none`, and every colour and word survives.

### ⚠️ Environment trap, worth more than the feature

Mid-verification every animation on the page reported `playState: "running"` with
`currentTime: 0` — thirteen of them, frozen, while `document.visibilityState` said `"visible"`.
**The preview pane's document timeline stalls**, and a stalled timeline makes `getComputedStyle`
return each animation's FIRST keyframe forever. That looks exactly like "the animation is broken",
and it is not. Two symptoms to recognise: a `requestAnimationFrame` loop that never resolves, and a
transitioned property reading its start value permanently.

**The reliable capture when it stalls:** add the class, then pin the animation with
`style.animationDelay = '-76ms'` and `style.animationPlayState = 'paused'`. That is a static
computed position, so it renders without needing the clock, and the screenshot is real.
`document.getAnimations()` is what tells the two apart — check `currentTime`, not the rendered look.

**Status: CLOSED.** Same artifact URL.

---

## Round 8 — 2026-09-03. THE KEYS LATCH, AND THERE IS NOW ONE LIT COLOUR

**His words, verbatim:** *"dont make the button floating like that, u know just make the button
that pressed and stays down until other button is press. and when not turning on all the light
should stays black on default and lights up light amber when section pressed"*

Round 7 read "more 3D" as *lift*, and that was the wrong direction. A raised cap is a cap that is
about to be pressed; a **latched** cap is one that HAS been pressed. He wanted the second.

| | Round 7 | Round 8 |
|---|---|---|
| Active cap | `translateX(-6px) translateZ(18px) rotateY(-5deg)` — floats above the rail | `translateZ(-7px) scale(.984)` — sunk into it, stays down |
| Measured against a neighbour | 220.7 x 107.0 vs 210.2 x 88.4 — **bigger**, i.e. nearer | 78.3 x 27.6 vs 80.9 x 28.5 — **smaller**, i.e. pushed in |
| Cap shadow | outer drop shadow, as a raised object casts | inset shadow across the top edge, as a recess receives |
| `keyHit` end state | rides out to the raised position | settles at the bottom, identical to `.key.on`, so nothing jumps |
| Hover | lifted the cap 8px | brightens the edge only — a cap that rises under the pointer is the same floating look |
| Unlit lamp / cell | `rgba(5,6,7,.66)` and `.8` — very dark, but still not black | `#000` |
| Lit colour | strong orange `#FF8C1A` on the meter, rust-and-cream on the lamp | one `--lit:#FFCE8F` light amber everywhere |

**One lit colour is the real change.** The pad previously lit three different ways — orange meter
cells, an amber-to-gold read gradient, a rust lamp inside a cream ring — because each was solved
separately against its own background. `--lit`, `--lit-dim` and `--lit-hot` now cover every
indicator, including the PONDER strip's live dot, which was still orange and would have been the
only thing on the pad lighting a different colour.

**And it dissolved the problem three rounds could not fix.** The lamp was illegible because it sat
on a gold cap; the cap is no longer gold, so a light amber lamp in a dark socket ring reads
immediately. The right fix was to the CAP, not to the lamp — every previous attempt tuned the lamp.

⚠️ **The stalled-timeline trap from round 7 fired again and cost a wrong conclusion.** The latch
transform measured as `matrix(1,0,0,1,0,0)` on a clean load, with the active cap's rect identical
to its neighbours' — which reads exactly like "the rule is not applying". It was applying. `.key`
carries `transition:transform`, the class flips from `key` to `key on` after the element is already
styled, and a stalled clock parks that transition at its START value forever.

**The check that works regardless of the clock:** set `style.transition='none'`, force a reflow with
`void el.offsetWidth`, then read `getComputedStyle`. That returns the declared value. Pair it with
pinning an animation via a negative `animationDelay` plus `animationPlayState:'paused'` for the
keyframe end states. Both are static computed positions and neither needs the timeline to advance.

**Status: CLOSED.** Same artifact URL.

---

## Round 9 — 2026-09-03. THE TEXT IS WRITTEN, NOT FADED IN

**His ask:** *"can u make the animation when text appearing to be more technological rather than
just that simple animation"*, followed by *"use all the design skills to make those"*.

The old reveal was `opacity 0 + translateY(9px)` — the default any framework gives you. Replaced
with two things a machine does and a fade does not:

1. **A raster sweep.** Each block is revealed left to right by `clip-path:inset(0 100% 0 0)` →
   `inset(0 0 0 0)`. The machine's own labels (`.eyebrow`, `.rule-lab`) glow in `--lit` as they
   are written and cool behind the sweep; the prose does not.
2. **A decoding title.** `decode()` resolves the `h1` left to right out of a technical glyph set.
   Spaces are never scrambled, so the shape of the words holds and it reads as text resolving
   rather than as noise.

### What the design skills actually changed

The first draft was written before the skills were loaded, and **it failed three of their rules.**
Loading them was not ceremony:

| Draft | Shipped | Rule |
|---|---|---|
| `cubic-bezier(.25,.7,.3,1)`, invented | `--ease-out:cubic-bezier(.23,1,.32,1)` as a token | never hand-roll a curve; the file had no easing token, so every curve in it was a one-off |
| `.44s` line, `.62s` title, 560ms decode | `.30s`, `.42s`, 420ms | 440ms on a 46ms stagger put the last row at 852ms |
| `text-shadow` on every block | glow on the title and the two mono labels only | `text-shadow` repaints every frame, and the prose carries the most glyphs and the largest paint area |
| stagger 46ms | 40ms | the 30–80ms band |

### ⚠️ And then the skills' own default was wrong for this animation

Entrances take `ease-out` — that is the rule, and it is right for position and opacity. It is
**wrong for a sweep**, and the measurement proved it: pinned at half its duration, the blurb was
already `inset(0 3.4% 0 0)` — **96.6% swept**. The strong ease-out spends its distance in the
first third, so there was nothing left to watch, which is the round-6 failure in a new costume.

A raster sweep is **constant motion**, and the same table says constant motion takes `linear`.
Re-pinned at four offsets after the change: 70%/50%/30%/15% of duration gave 30%/50%/70%/85%
remaining — exactly proportional. **Take the rule that matches the motion, not the one that
matches the word "entrance".**

### The Lite Mode trap this animation creates

The reveal fills `backwards`, so its first keyframe holds during the delay. A Lite Mode that only
killed `animation` would leave every block clipped to zero width — **the text would be gone**,
which is the worst version of "a stopped animation looks like a bug". Lite must reset `clip-path`
too, and reduced-motion gets a plain `rmFade` opacity keyframe rather than nothing. Verified: all
five blocks report `animation:none`, `clip-path:none`, `text-shadow:none`, `opacity:1`, with every
word present and the title unscrambled.

**Also:** `decode()` runs on `setInterval`, not `requestAnimationFrame`, precisely because of the
stalled-timeline trap. rAF never fires while the pane's clock is stopped, which would strand the
title mid-scramble and look exactly like a bug. The pane throttles `setInterval` too — 2 samples in
900ms — but it does not stop it, so the decode still completes.

**Status: CLOSED.** Same artifact URL.

---

## Round 10 — 2026-09-03. **ASK RECORDED, NOTHING BUILT.** Quota at 80%, his call

**His words, verbatim:** *"i like the design but remove the zoom out and zoom in for intro and
outro of that text too much animation make it norak and not elegant"* — then, when told the quota
stood at 80%: *"make notes first and do later if quota not enough"*.

No file was changed except these notes. The pad on the artifact is still round 9.

### The diagnosis, so the next session does not repeat it

**Round 9 left two entrance animations playing over each other.** The panel flies in from depth
(`translateZ(-175px) translateY(18px) rotateX(7deg) scale(.935)` plus a 3px blur) at the same
moment the text writes itself on with the raster sweep. He likes the write-on — he said so in the
same sentence — so the write-on is the intro, and the panel's flight is the part that goes.

This is a cost of the last four rounds being additive. Each one added a mechanism that was right
on its own: the panel flight (round 6), the depth on the rail (round 7), the latch (round 8), the
write-on (round 9). Nothing was ever taken away, and the panel flight and the write-on are now
both claiming the same moment. **"Norak" is what he calls the sum, not any one part.**

### The edit, already worked out

| What | From | To |
|---|---|---|
| `@keyframes panelIn` / `panelOut` | translateZ + translateY + rotateX + scale + blur | `opacity` only |
| `.panel.out` | `.30s cubic-bezier(.32,.06,.55,1)` | `.17s var(--ease-out)` |
| `.panel.in` | `.46s cubic-bezier(.25,.46,.45,.94)` | `.14s var(--ease-out)` |
| `var OUT_MS=300, IN_MS=460` | — | `var OUT_MS=170, IN_MS=140` — must match the CSS or the swap shows |
| `.panel{will-change:opacity, transform}` | — | `will-change:opacity` |
| the comment above `panelOut` | documents the depth flight and quotes "scale .961 of 1.0" | rewrite — it will describe code that no longer exists |

**Do not touch** `lineIn`, `lineInLit`, the `--i` stagger, `titleIn` or `decode()`. He likes those.

**Rejected on purpose:** keeping a small `translateY` or the blur "so the swap is not abrupt". He
named the amount of motion as the problem, and the write-on already gives the panel a visible
arrival. A crossfade under a raster sweep is not abrupt.

**Status: OPEN — queued for the next session.** Prompt written to `.claude/NEXT-SESSION.md`; the
riffle removal moved down into the queue below it.
