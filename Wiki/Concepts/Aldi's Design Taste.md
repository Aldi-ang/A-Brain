---
title: Aldi's Design Taste
description: What Aldi actually likes and rejects in an interface, built only from things he said about real screens. Written on his instruction — he wants his taste learned, not guessed at each time.
type: concept
created: 2026-08-10
updated: 2026-10-13
confidence: medium
checked: 2026-09-19
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

## Light mode gets its own MATERIAL, not a paler copy (2026-08-24)

He photographed the sidebar in light mode: *"as u can see on the light background the text on the
sidebar almost invisible maybe we should change the color or edit the transparancy"*. Offered two
fixes — paler glass, or a solid panel — **he invented a third and it was better than both**:

> *"what if some laboratory panel kind of design for the light mode and keep the glass one for the
> dark mode? do u have something in mind?"*

Then, from four mockups: *"i like anodized the most"*, and after seeing the animations,
*"A is minimalist and looks cooler"* (lamp beside the icon, not the icon itself lighting).

**The principle, and it generalises past this rail:** the two themes may be different MATERIALS,
not one design in two colour sets. Glass is a lens — it works by showing what is behind it, which
is why it failed on a page lit from the top-left that falls off darker toward the bottom. A
faceplate is opaque and owns its own ground.

**Three things he taught by correcting me:**

1. **My mockups all sat on near-white.** His verdict: *"most of the background is not really
   difference"*. He was right — the real light ground is `--ground #D2C9B4` cream, and three
   near-white plates on a widget's white canvas were indistinguishable. **Mock on the real ground
   or the comparison is fake.**
2. **"Dense LED" means DARKER on a light plate, not brighter.** *"make sure u make the amber color
   more dense more like LED ... this color is too light on top of light theme"*. A lamp reads as
   lit because it stands off its surround; on a pale plate the only direction available is down.
   `#E0680A` measured 1,86:1 and failed; `#9A4200` measures 3,64:1. Same inversion `--gold`
   already uses in light mode.
3. **He asks to see motion running before choosing it.** *"i want to see both animation in
   action to decide"*, then *"i want to see it on action"*. Static frames are not enough for
   anything that moves — build the live thing.

**A material that needs no effects also survives Lite Mode untouched**, which the glass never
could: border + fill + a 1px pattern lose nothing when blur and shadow are stripped.

Shipped: `--plate*` / `--lamp*` tokens, `html.light .kpm-rail-pod::before`, three new
contrast pairs. Dark mode not touched. See [[Sidebar marks fade out in light mode]].

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

   > ✅ **IT CAME BACK, 2026-08-16, AND HE DECIDED IT.** *"use the light theme that we apply to
   > the setting panel to its background as well"*, then *"this task is finish until the
   > background is light color and on theme with the panel that we work so far"*. The steel
   > ground is **gone**: the whole app ladder moved into the modules' cream family
   > (`--ground #B4B0A9 → #D2C9B4`, `--panel → #E1DAC8`, `--raised → #EDE7D8`).
   > **The "no white surface" half of the law survives** — `--raised` stops at `#EDE7D8`. So the
   > direction of his 2026-08-13 "white" was right and the literal reading of it was not: he
   > wanted *light and warm*, not `#FFFFFF`. See
   > [[../Summaries/Light Ground and the Theme Lab]].

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
- **The phone is not a narrow desk, and he checks it.** 2026-09-01, from his iPhone: *"it look
  really bad on phone, i mean the restock vault feels like there is too much going on vertically in
  that small space"*, *"the ponder panel is cutted in half"*, *"even the book cutted in half as well
  that i cant see the left book with all the section ribbons"*. Four faults, all measured at
  375x812 and all the same shape — a desk layout carried onto a phone unchanged: a 780px table in a
  291px window, a 160px pinned footer on an 812px screen, a content-height sheet leaving 283px of
  empty scrim, and a four-card page running 30px past the bottom. **The lesson is not any one of
  them: it is that "it fits at 1280" is not a phone check.** He also asks for proof now — *"as long
  as u checked everything and make sure that all of it worked"* — so a phone change is measured
  before, measured after, and the desk is re-measured to show it did not move.
- **Hiding a control on the phone can be a functional bug, not a smaller layout.** The book's
  section ribbons were `hidden lg:flex`. The page arrows only turn pages inside a section, so on a
  phone there was no way to reach another section at all. Ask what the hidden thing was the only
  route to before hiding it.
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

## "Similar format" is a separate ask from "same colours" (2026-08-14)

Two instructions the same night, both about the screen you see *before* Google signs you in:

1. *"remove the left sidebar then its old stuff already"*
2. *"and make the panel in the middle to have the same color theme of our panel inside vault gate
   as well, and similar format"*

**The second one is the lesson.** Hours earlier that panel had already been given the vault gate
card's exact background, border and width — as a shared class, so the two screens could not drift
— and he looked at it and said it still did not match. He was right. What had been copied was the
**shell**; what he was reading was the **contents**. The gate's panel is one centred column in
mono: a 9px eyebrow, a 13px title, the control, nothing ruled across it. The module default is the
opposite — a left-aligned head on its own tinted band, a 19px display title, a divider above the
buttons. Same colours, different screen.

**So: "same colour" and "same format" are two jobs, and matching a card's fill finishes neither.**
When he points at two screens and says they should be the same, ask which of the two he is
looking at — the material, or the layout — and expect the answer to be layout.

Ask 1 is a second instance of a law already on this page: *"i dont want to see the sidebar button
on the login screen"* (recorded above under **controls that appear where they do not belong**).
The drawer is the app's whole navigation; signed out it carried only gated tabs and a duplicate
login button. **A control that cannot do anything yet is not neutral to him — it is old UI.**

## 🎥 When he sends a video, WATCH it — do not paraphrase it

2026-08-14. He rejected a shipped sidebar with *"wrong format"* and attached a six-second screen
recording, calling it *"the exact sidebar i want"*. Two sessions were then spent building from his
written description of that recording. That was avoidable: **`ffmpeg` is installed on this
machine.**

    ffmpeg -i clip.mp4 -vf "fps=1,scale=900:-1" -frames:v 12 f%02d.png

Then look at the frames. One command settled what prose could not: *"shrink in to 1 button big"*
had been read as *one button WIDE* — a narrow column of icons — and the frames showed **one single
circle**, with the whole menu appearing only on hover. Everything built on the wrong reading had
to be redone.

The general law: **his reference is the artefact, not his sentence about the artefact.** He is 14
and describes shapes by feeling — accurately, but loosely; when he hands over an image, a link or
a clip, that is the specification and his words around it are commentary. The same goes for
screenshots. Open them.

## One theme, or it is not finished (2026-08-16)

The night's whole lesson, in his order:

1. *"yea fix all of the color for light mode and the adjustment as well for the outside panel, we
   can start from the settingview"*
2. *"the background is still black on light mode, why are u rushing things that havent done"*
3. *"make sure u check the app first before moving on"*
4. *"if the browser is broken then fix it until u can see it"*
5. *"yes use the light theme that we apply to the setting panel to its background as well"*
6. *"this task is finish until the background is light color and on theme with the panel that we
   work so far, im going to sleep first, dont stop working until u done achieving that"*

**He judges a theme as ONE THING, not as a list of converted components.** Every module on the
screen he photographed was already correct. He still called the screen not done, and he was right:
the page under those modules was a different colour family. A conversion that is 95% complete does
not look 95% done to him — it looks broken, because the 5% is what everything else sits on.

**He also defines "done" himself, and it is a state, not a task list** — sentence 6 sets a
condition, not a scope. Read that as permission to keep going past the literal ask until the
condition is actually true.

⚠️ **"Why are you rushing" is his phrase for a claim made without checking.** It appeared right
after two replies that said a thing was fixed when nothing had been rendered. He is not objecting
to speed — he is objecting to being told something is done. See
[[Looking at the App]] for the harness built in response, and use it before the claim, not after
he pushes back.

## He hands over a component and means the LOOK, not the library (2026-08-16)

He pasted a 21st.dev / motion-primitives `SlidingNumber` and said *"and change the clock UI into
this"*. Asked to choose between porting it as pure CSS, installing the libraries with a hand-written
Lite guard, or parking it, he answered: *"create one using CSS like u recommended before"*.

**That is the second time he has taken the no-dependency option when the look was identical.** The
paste was the specification for the APPEARANCE; it was never a request for `motion` (~50KB) and
`react-use-measure` in an offline-first app. The deciding fact was his own law — that component
animates in JS, and `html.lite-mode *` can only force `animation` and `transition` to none, so a JS
spring runs straight through the setting that exists for cheap phones. **Reach for a CSS transition
whenever Lite Mode has to be able to stop the thing.**

Then, unprompted, he extended it: *"i want the clock to swapped into dates for 5 second then animate
back in into clock display can u do that, and use this date format 16 agustus 2026, i want this
action works on press"*.

Three things in that one sentence worth keeping:

1. **He specifies formats in his own writing, lowercase** — `16 agustus 2026`, not `16 Agustus 2026`.
   Indonesian month names, day first, no punctuation. Treat the string he types as the spec, the same
   way [[Aldi's Design Taste#🎥 When he sends a video, WATCH it — do not paraphrase it]] treats a clip.
2. **He asks for a temporary state, not a mode** — "for 5 second then animate back". A flip that
   stays flipped would be a different control from the one he described.
3. **"works on press" turns a readout into a control**, and the CSS that said *"the clock does not
   light up under the pointer — it is a readout, not a control"* became wrong the moment he said it.
   ⚠️ A comment stating a design intent is evidence of a decision, not a permanent rule; when the
   ask changes, the comment is part of the change.

⚠️ **The clock had never ticked.** It was `new Date()` written inline in the header — no state, no
timer — so it printed the time the shell last happened to re-render at. Nobody caught it because
nothing was broken enough to look at: a wrong clock still looks like a clock.

## Related

- [[Looking at the App]] — how to see a screen before telling him it is fixed
- [[Master Vault Gate]] — the screen most of this evidence comes from
- [[Silent Failure Disease]] — law 2, in its bug-class form
- [[Ponytail Philosophy]] — the minimal-code discipline; his taste and it agree more often than not
- Source: [[../../Raw/2026-08-10_source_kpm-six-days-aug04-to-aug10|the six-day source]]

## Lite Mode gives up motion, never colour (2026-08-16)

His law, verbatim, on finding the header's title gone in light + Lite: *"lite item use to
sacrifice the animation but not the color"*. Report: *"the lite light moe causing the system
acitve settings text to gone, since it causing the background for that top panel to be black"*.

This sharpens law 3 on this page (*"lite mode means performance, not a white theme"*) into
something checkable. Lite Mode may drop **motion, blur and shadow**. It may not touch a **hue** —
and an opaque fallback that a stripped blur requires is still a colour, so it has to be a token
with a value per theme, not a fixed one. Enforced by audit group 43, which asserts the law rather
than any value.

⚠️ **Three audit checks were pinning the offending literal, so they were protecting the bug.** The
"freeze a value" trap in [[Anti-Recurrence Check]] shape 7, for the fourth time in two days.

## He approved the preview artifact, and asked for bigger small type (2026-08-16)

Handed a single self-contained HTML file rendering the real stylesheet — light by default, with
light/dark/lite buttons. His verdict: *"it is what im looking for, i like it"*.

**This is the second time the same instinct has shown:** the page already records *"live and
playable beats a picture"* and *"give him sliders on a live prototype, not a gallery of finished
options"*. A file he can open and toggle himself is the format he says yes to.

His only change: *"maybe make the font little bit bigger especially for the small description,
without sacrificing any aesthetics"*. Module description 13 → 14px, mono eyebrow and caption strip
10 → 11px. **Tracking eased with the size** (.26 → .24em, .22 → .2em) — letter-spacing is chosen
for a size, and carrying the old value onto a larger glyph is exactly what makes a bumped label
read as stretched rather than bigger. That is the "without sacrificing any aesthetics" half of the
ask, and it is the half that is easy to skip.

## Law: proof before the claim (2026-08-16)

*"dont claim anything with no proof, facts above everything"* — said while approving a rule change
to the Alucard skill after three "fixed" claims in one session with nothing rendered.

Paired with his earlier *"if the browser is broken then fix it until u can see it"*, the standard
is: **a blocked viewer is a problem to solve, not a result to report.** And state which proof you
have — a measurement proves a ratio, only a frame proves an appearance. See
[[Looking at the App]].

## ✅ THE LIGHT PALETTE IS APPROVED — locked 2026-08-16

*"regarding the color i like it we can use this color"*, said after looking at the showroom page
with every colour in place. Also, of the showroom itself: *"it is what im looking for, i like it"*.

**So the cream light theme is settled and is not to be re-litigated:**
`--ground #D2C9B4` · `--panel #E1DAC8` · `--raised #EDE7D8` · `--inset #C6BDA9` · `--sunk #B9B0A0`,
with the gold bloom top-left at `.09` and `--raised` stopping short of white.

⚠️ **This closes the 2026-08-13 *"light mode is white"* thread for good.** He wanted *light and
warm*, and cream is the answer he approved on sight — not `#FFFFFF`, and not the old bench steel.

## A screen can be exempt from the theme entirely (2026-08-16)

*"for the master vault panel, let the textbox to stay dark, light or dark mode should not affect
the loading screen"*.

**He thinks in SCREENS, not in components.** The vault gate is not "a dark card that also needs a
dark input" — it is a screen that the theme does not reach. Once he says a screen is exempt,
expect *everything* inside it to be exempt, including anything added later.

That is what [[Looking at the App]]'s dark-island exists for, and the first version got it wrong
in the most instructive way: it re-declared a **hand-copied list** of the tokens that gate
happened to use, so a field painted with a token nobody listed still flipped. **A list of
exceptions is complete on the day it is written.** The fix was to make the island ride the dark
palette itself rather than copy from it.

## Three complaints in one message, and the single fault under all of them (2026-08-16)

Three screenshots, three sentences, sent together:

> *"i want the transparant example text inside the text to be more clear in the light mode"*

> *"i want the black color text need to be clearer maybe add little bit thickness in color could
> help? nah i'll just let u think about that"*

> *"yellow color glow inside the sidebar on light mode is not good because it is not clear, feels
> like the color is menyatu with the background human eyes hard to see light on light combination
> like that"*

**They looked like three unrelated contrast nits. They were one fault wearing three coats:**
colour decided against a near-black ground and never re-decided for the cream one. Worth reading
that way next time three small light-mode complaints arrive together.

### He describes mechanisms, not preferences — read them literally

*"light on light combination"* is not a complaint about a shade. It is the correct diagnosis. A
glow works by **adding light**; on a cream ground there is none left to add, so the plate cannot
end up darker than the surface it is supposed to stand on. `menyatu` = *merges into / blends with*.
**The answer to a glow that fails on light is never a brighter glow** — it is the inversion this
palette already makes everywhere else (`--gold` becomes a dark amber PLATE, `--gold-ink` the pale
ink on it). Measured after: 5,32:1, from roughly 1,2:1.

### Where the bug actually lived: hexes in the JSX

The sidebar was the last place in the app still deciding its own colour from `text-[#ff9d00]` and
`bg-[#ff9d00]` written into the markup. **A hardcoded hex means the dark theme is deciding what
light mode looks like**, and no token, no palette law and no contrast check can see it. If a
light-mode complaint has no matching token to blame, grep the JSX for arbitrary Tailwind colours
before touching the stylesheet.

### "thickness in color" meant WEIGHT, and he was right for a reason he did not have to state

The band's ink was never the problem — `--ink` is 10,6:1 there. The **hatch** was: a 1px stripe
every 4px cuts straight through 11px mono tracked to .2em, and a one-pixel stroke loses that
argument. `font-weight: 700` fixed it. ⚠️ **He keeps the texture** — it is the tab's one surviving
decoration — so the answer to texture eating a stroke is a thicker stroke, never a quieter texture.

### *"nah i'll just let u think about that"* is delegation, not indifference

He named the symptom, offered a guess, and handed the mechanism over. That is permission to
choose the lever — and an obligation to say which one was chosen and why, in his terms.

### The verdict, and what it settles about unrequested changes

> *"sidebar is good, grey example text is good, 3 is also good lets move on"*

All three accepted on sight, including **the italic he never asked for**. It was flagged to him as
mine before he looked, with the reason in one sentence, and he kept it.

**The rule that earns:** when a legibility fix DELETES a distinction (darkening the example text
made an empty field read as a filled one), restoring that distinction with **shape** — italic,
weight, position — is welcome, because it costs none of the legibility he asked for. Colour is
where he has strong opinions and standing laws; form is where he delegates. ⚠️ Still flag it as
yours before he looks. He accepted it *and* was told it was a choice — those are not separable.

`lets move on` is his close-the-topic marker. He does not want a summary of what was just agreed.

### He removes information to make what is left bigger (2026-08-16)

> *"i want u to make all this button bigger but dont allow it to exceed the given box space"*

> *"removed the small dated above that and use that whole time box to 1 each time, so one side is
> clock and u press it other one is date so that it look bigger on both side"*

Two asks, one instinct: **a control should spend its whole area on one thing.** The clock had a
9px date stacked above a 13px time on BOTH faces — four pieces of text to show two facts. He
deleted the small line rather than shrink anything else, and the time went 13px → 20px in the
same plate.

⚠️ **The small line was a leftover from before the press existed.** It was the compromise you make
when a chip must say everything at once; adding the press removed that requirement and nobody went
back to remove the compromise. **When a control gains a way to reveal something, look for the thing
that was there to avoid needing the reveal.**

**"dont allow it to exceed the given box space" is a constraint he expects to be MEASURED.** The
header declares no height — it grows to its tallest child — so the ceiling was the two lines of
text on the left, at 48px, and the buttons had 12 free pixels nobody had noticed. See
[[Looking at the App]] for how to take that measurement.

## NEAR MISS: an automated palette migration almost repainted the nota (2026-08-16)

A scripted conversion moved six screens onto the tokens in one pass. Two of them —
`HistoryReportView.jsx` and `ConsignmentFinanceView.jsx` — contain a **`print-receipt` block**, and
**the nota is exempt from the palette law**: it keeps KPM's company blue because it is a printed
commercial document, not app UI.

⚠️ **The `!important` classes inside it survived only by luck** — `!text-blue-800` and `!bg-white`
begin with `!`, which made them unmatchable by a regex that expected a class to start with its
property. Nothing in the script knew the nota existed. **Ordinary classes inside the same receipt
were converted**, including a `bg-blue-50` proof box. Both files were reverted rather than shipped.

**The lesson is about automation, not about colour: a sweep that is correct for a screen is not
automatically correct for every REGION of that screen.** Before running any bulk transform over a
file, ask which parts of it are governed by a different rule — print blocks, dark islands like the
vault gate, embedded documents. An exemption that lives in a person's head is invisible to a script.

## The hole in the palette law: it bans colours but never named replacements (2026-08-16)

By the end of one afternoon Aldi had asked for redesigns on **ten** screens, and eight of them fail
in the same way. It is worth stating precisely, because "convert the colours" is the wrong summary:

**The law says what is BANNED (no blue, no green, gold never as text on light). It never said what
a state should be INSTEAD.** So every screen invented its own answer with a hardcoded hex, and each
one was tuned against the near-black page that existed at the time. Light mode did not break these
screens — it revealed that they were never theme-aware at all.

The banned hues are not decoration on most of them. They carry MEANING that has no token:

| screen | green means | blue means |
|---|---|---|
| Receivables | SAFE (not due yet) | the amount owed |
| Stock Opname | HEALTHY | the selected tab |
| EOD Setoran | verified / shift closed | Digital Transfers |
| Audit Vault | a snapshot exists, revertable | the month folders |
| Sampling | New Sample | View Analytics |

⚠️ **The blues are all decoration** — a button that happens to be blue. Those convert freely.
**The greens are all "everything is fine"**, which is the one meaning the palette has no token for,
and it is why the same question kept coming back screen after screen instead of being answered once.

**The proposal put to him:** *colour marks what needs attention; "fine" is the ABSENCE of colour.*
Safe/healthy/verified = plain ink on the normal surface, no plate. Needs-attention = gold.
Destructive or overdue = the existing red. That is not a new rule — it is the rule the header chips
already follow (*"the resting plate has no colour at all"*) and the one the danger red already
follows (*"rationed to things that destroy data"*), applied to the states nobody had ruled on.

---

## 2026-08-16 — "animation and 3D more with gamification on all of this segment"

Four judgements in one message, after seeing Sampling and Customer Directory rendered. Verbatim:

> *"sc1 the folder in sampling ihave the same color with it background it is not clear enough on the
> dark or light mode i suggest redesign the whole sampling segment to looks better but keep the logic"*

> *"sc2 customer segment also needed to be redesign the UI and animation better increase ergonomics
> and usefullness as well, color is not clear enough as u can see here, i was thinking about making
> some animated card for each customer and animated folder for each 3D animated cards should looks
> really cool lets brainstorm about this later"*

> *"stock opname also need whole redesign for this concept and UI and animation as well brainstorm
> topic for later"*

> *"EOD setoran looks really bad need redesign for later as well, we need new concept for this
> segment as well lets use animation and 3D more with gamification on all of this segment"*

**What this establishes about his taste, beyond the four screens:**

1. **Motion is not decoration to him — it is the point.** Three of the four messages name animation
   unprompted. A screen that is correctly coloured and completely still still reads as unfinished.
2. **"3D" means depth and physicality**, not WebGL. The vocabulary he reaches for is *cards* and
   *folders* — objects that tilt, lift, open. The existing card set is flat rectangles; he wants
   them to behave like things.
3. **Gamification is wanted on operational screens**, including the money ones (EOD Setoran). This
   is consistent with the app's existing Hall of Fame / agent-stats direction, and it is the first
   time he has asked for it as a *system-wide* property rather than one feature.
4. **"keep the logic" is said every single time.** He separates how a screen looks from what it
   computes, and he does not want the second one touched while the first is being redone. Same
   phrasing he used for Customer Directory a message earlier.
5. **He defers deliberately.** *"lets brainstorm about this later"* and *"brainstorm topic for
   later"* are instructions, not politeness — the design conversation comes before the code.

**What he actually filed as a bug, versus what he filed as a want:** only sc1 named a defect
(*"same color with it background"*). It was a real one — a gradient left with no colour stops
painting nothing at all. The other three are ambitions. Reading all four as bugs would have
produced three unwanted rewrites. See [[Silent Failure Disease]] for the sc1 root cause.

### He cannot judge a concept from prose — and said so plainly (2026-08-16)

Handed three EOD Setoran concepts as written descriptions with costs and risks, he answered:

> *"i cant imagine those, why dont u generate all of that inside artifact and i choose, u can do
> research on the animation or the concept that we are about to do as well. i want to see the full
> concept complete with the animation"*

**This is the third confirmation of the same instinct, and the strongest.** The page already
records *"live and playable beats a picture"* and *"give him sliders on a live prototype, not a
gallery of finished options"*, plus his verdict on the first showroom file — *"it is what im
looking for, i like it"*. This message upgrades it from a preference to a **constraint**: a written
concept is not a proposal he can act on. It does not reach him.

**So the deliverable for any design decision is a playable artifact, not a description of one.**
Three concepts written out cost a turn and produced no decision; the same three built as a page he
can press produced one. Budget the build in from the start rather than pitching in prose first.

Note the second half of the sentence too — *"u can do research on the animation or the concept"*.
He is explicitly authorising the expensive path when the output is something he can look at.

**What shipped in response:** `scratchpad/eod-concepts.html` → *Three Ways to Close a Shift*, three
working demos in the app's own tokens with light / dark / **Lite** / slow-mo toggles. The palette
was lifted verbatim out of `theme.css` rather than approximated, because the whole point is that he
judges the concept in his own colours.

### Corollary to the Lite law: an animation must never OWN an element's visibility

Found while building that artifact, and it is checkable. The wax seal and the CLEARED stamp were
written the ordinary way — `opacity: 0` in the base rule, an `animation … forwards` that ends at
`opacity: 1`. Turn Lite Mode on, `animation: none` applies, and **the seal and the stamp disappear
entirely**. Not "less animated" — gone.

That is Lite deleting **content**, and his law is that Lite may drop motion, blur and shadow and
may never touch a hue or, by the same reasoning, a thing that is supposed to be on the screen.

**The fix, and the pattern to reuse:** the STATE class carries the visibility, and the animation
only carries the movement.

    .env.sealed .wax { opacity: 1; animation: slam 420ms … both; }
    @keyframes slam { from { opacity: 0; transform: scale(2.6) } to { opacity: 1; transform: scale(1) } }

With `animation: none` the element still resolves to `opacity: 1` from the state rule. Lite loses
the slam and keeps the seal. ⚠️ **Anything using `forwards` from a hidden base is suspect** — that
is the exact shape of the bug. Verified by running the page with Lite forced on and reading
computed styles: `waxOpacity=1`, `markOpacity=1` after the fix, `0` before it.
See [[Silent Failure Disease]] — no error, no warning, only a missing thing.

### He rejects concepts individually and asks for MORE, not for a rewrite (2026-08-16)

> *"btw im okay with 1 and 2 i dont like 3, i want u to make few other options for this and just
> delete 3 keep 1 and 2 for comparison later. give me another gamification concept, anyway EOD
> needs approval from the regional admin to be accepted, EOD wont be complete without admin
> approval"*

Three separate instructions in one sentence, and the shape is worth keeping:

1. **He judges each option on its own** — two kept, one deleted, no explanation asked for or given.
   A rejected concept is not a signal that the batch was wrong.
2. **"keep 1 and 2 for comparison later"** — he wants the survivors held side by side against the
   new ones rather than replaced. The deliverable grows; it does not get rewritten.
3. **He supplies the missing domain rule himself, in passing.** The approval requirement arrived as
   an afterthought clause and it invalidated the ending of all three concepts. ⚠️ **Ask what
   completes a flow before designing its climax** — every concept had been built to end at the
   agent's submit, and the real ending is a second person in another town.

**What the domain rule turned up when it was chased into the code:** the gamification he keeps
asking for **already exists** — XP, badges, day counters and streaks all fire inside
`handleVerifyEOD`, at the admin's approval. It has simply never been shown on screen. Worth
checking for a built-but-invisible mechanic before designing a new one.

**And the three kinds of loss are handled three different ways**, which is the actual bug under his
question *"what if there is some miscount or lost pita cukai or lost item"*: lost stamps become a
debt that follows the agent; short cash and missing goods have nowhere to go at all, because
approval is all-or-nothing — accept the calculated number, or delete the submission. The proposal
put to him is to generalise the mechanic the app already owns rather than invent one.

### ✅ HE CHOSE THE SHERIFF'S DESK (2026-08-16)

> *"i like B better TBH"*

Of four EOD Setoran concepts — A The Shift Close (recommended), B The Sheriff's Desk, C Two Keys,
D The Clean Run — he picked **B**, the one costed as *"High — it is a whole art direction, and the
one that risks hiding the money behind a costume."* He had already deleted the vault-door concept
and kept A and B; A was the recommendation and he went past it.

**What this says about his taste, and it is consistent with everything above:**

1. **Theme beats efficiency.** B is the largest build of the four and the least ergonomic, and he
   took it anyway. He is buying a WORLD, not a workflow. Recommending the cheap option on
   character grounds will keep losing.
2. **He picks the concept that already exists in his own app.** The WANTED poster, the bounty and
   *"Awaiting Sheriff Verification"* were already sitting in `EODReconciliationView.jsx` — an
   RDR2-flavoured layer someone (him) put there and never finished. He chose the one that
   completes something he started, over three that invent something new.
3. **His stated ranking is not his real ranking.** He asked for "ergonomics" three separate times
   and then chose the least ergonomic option. ⚠️ Read "make it ergonomic" as "do not make it
   WORSE", not as "optimise for it".

Consistent with the RE9 Ark Lab theme naming and the capybara mascot: this app is a place, and he
is furnishing it. Also consistent with his *"animation and 3D more with gamification"* ask — B is
the concept with the most physical objects to animate.

⚠️ Still unanswered when he chose: whether he wants the **Accept short** outcome (real money logic,
needs an explicit yes) and whether a perfectly-matched day earns a COLOUR or only motion.

### 🔴 HE BROKE HIS OWN PALETTE LAW, ON PURPOSE, AND IT IS A GOOD EXCEPTION (2026-08-16)

Asked whether a perfectly-counted day should stay colourless — his own law is *colour marks what
needs ATTENTION; "fine" is the ABSENCE of colour* — he chose **"Gold — let it glow"** over
"Motion only, no colour", with the cost stated in the option itself (*"gold starts meaning two
different things on the same screen"*).

**So gold now carries two meanings in KPM: needs-attention everywhere, and a perfect close on the
EOD stamp.** He took that knowingly. Do not "fix" it later as a violation — it is a decision.

**What makes it survivable, and the shape to reuse when he breaks a rule again:** the exception is
*contained*. It fires ONCE, on ONE element, at the END of a whole day's work, and only when
everything matched. A law with a single loud exception still reads as a law; a law with exceptions
scattered through a screen does not.

⚠️ **Note the asymmetry he chose without being asked about it:** the same stamp lands in DANGER red
and reads SHORT when the day closes with a gap. So the stamp is the one place in the app where the
outcome is spoken in colour at both ends — gold for perfect, red for short, nothing in between.

### He also approved the money change: "Accept short" (2026-08-16)

He chose **"Yes, add it"** over admin-only and over leaving it alone. So the regional admin gets a
third action beside Verify and Reset: close the day AND mint a debt for the gap, the same mechanic
`cukaiDebts` already uses for lost pita cukai.

**This is the first time he has approved a change to a MONEY path in this redesign**, and he did it
after the two existing buttons were described concretely — Verify records a number that is false,
Reset throws away a whole day's counting. ⚠️ The lesson for how to ask: he said yes to a logic
change only once the *status quo* was shown to be the risky option. Naming what today's code
actually does beat describing what the new feature would do.

### 🏆 HE DESIGNED THE FLOW HIMSELF, AND IT BEAT BOTH OF MINE (2026-08-16)

After choosing B he did not ask for B. He specified a combination of A and B, in one message, in
detail: four cards (cash, transfer, goods return, pita cukai) that SWAP one to the next as each is
confirmed; the cards then go INTO a letter; the letter is sent to the regional admin; the admin
sees a STACK of letters, opens one, views each card, **approves the cards one by one**, and only
then gets a button to approve the whole letter and send it back; the WANTED poster is repurposed to
carry **unpaid bounties only** (missing item, missing cukai, missing cash, missing transfer); and a
separate feature beside EOD repays a bounty via a receipt the admin also confirms, ending in a
cleared-bounty animation.

**Why it is better than what I pitched, stated plainly because it is a lesson about my own work:**

1. **It fixes the flaw I had named but not solved.** I costed B as *"the one that risks hiding the
   money behind a costume"* and shipped it anyway. He split the objects by JOB — the letter holds
   the facts, the poster holds the debt — so the theme stops competing with the numbers. That was
   available to me and I did not see it.
2. **Per-card approval is where "Accept short" actually belongs.** One verdict per day forces the
   admin to judge four different things with one button. Four cards means goods can be approved
   while cash is marked short. My design put the precision in a third BUTTON; his puts it in the
   STRUCTURE, which needs no extra rule to explain.
3. **He is completing what already exists again.** `reportType: 'BOUNTY'`, `penaltyKeys` and
   `handleVerifyEOD`'s debt-wiping branch are already in the code — his "repay the bounty" feature
   is roughly half built and has no UI. Second time in one day he has chosen to finish something
   already in the repo over accepting something new. See his choice of B for the first.

**The pattern to carry:** when he answers a design question with a paragraph of mechanics rather
than a preference, that paragraph IS the specification — treat it the way
[[Aldi's Design Taste#🎥 When he sends a video, WATCH it — do not paraphrase it]] treats a clip.
He describes objects and what happens to them, and the nouns are load-bearing: cards, letter,
stack, poster, receipt.

⚠️ **What he has not priced, and owes an answer on:** approving four cards plus a letter is 5 taps
per agent per day for an admin who may have several agents; today an EOD report carries ONE status
field, so per-card approval is a schema change inside the `handleVerifyEOD` transaction; and a bank
transfer cannot be "short in the envelope" the way cash can, so "missing transfer" needs defining.

### He answers a restriction question with an ACCOUNTABILITY answer (2026-08-16)

Asked whether the "approve all" shortcut should be greyed out when a day does not balance — a
restriction on the regional admin — he refused the framing:

> *"well at the end of the day we gave admin power and we should trust them but on the other hands
> if there is some missing input data to the factory then all the blame will go to the regional
> admin, every day regional admin approval need to be sent to the HQ, so HQ should be able to check
> whether there is some cheating or manipulation been done by the regional team"*

**Do not build the grey-out.** His instinct is consistent and worth naming as a rule:

> **Give the power, keep the record.** He does not take a capability away from someone he has
> chosen to trust; he makes what they did visible to the layer above.

This is the same instinct behind the Dialog Gate (*"every action must report"*) and the Audit Vault
— his answer to risk is a record, not a lock. ⚠️ So a proposal that reads as *"stop them doing X"*
will usually lose to one that reads *"log X so it can be checked"*. Reframe before proposing.

**And note who he is protecting.** He named the honest case first: if data is missing at the
factory *"all the blame will go to the regional admin"*. The record exists to defend the admin as
much as to catch one. That framing should be used when the feature is explained to him and to them.

**It also revealed a third party nobody had mentioned in six messages of design work: HQ.** EOD is
agent → regional admin → HQ, not agent → admin. Every concept pitched to him had assumed two
parties. ⚠️ **Ask who else sees the output before designing the ending of a flow** — this is the
second time in one day a whole ending was designed for the wrong last actor (the first was
forgetting the regional admin existed at all).

**What checking found, and it flatters nobody:** `logAudit()` already stores `user: user.email` on
every `EOD_VERIFIED`, so WHO approved is captured. What is not captured is the numbers — the audit
line records the agent's name and nothing about the money. **HQ can see that a day was approved,
never what was approved.** The fix is not a new system; it is putting the figures into a line that
already gets written. Cheapest real work in the feature, and the only part that does the job he
actually described.

### A "mismatch with the code" was a missing STEP, not a bug (2026-08-16)

Told that his rule (damaged goods → Master Vault) disagreed with the code (damaged goods → regional
branch), he did not accept the framing:

> *"yea they went to the regional vault first and then on the stock opname allow the damaged goods
> to be sent to the headquarters right"*

**Both were right. The code does step one; he was describing the destination after step two.** The
gap was a transfer action that does not exist yet, not a wrong route.

⚠️ **The lesson is about how a discrepancy gets reported.** Saying "your rule and the code disagree"
invites him to pick a side. Asking "the code sends these to the branch — is that the final stop, or
is there a later step?" would have got the same answer without implying one of them was broken. He
holds a model of his own business with steps that are not in the software yet, and a mismatch is
more often a missing step than a defect.

**And checking that path found the real prize:** `PENDING_HQ_APPROVAL`, HQ notifications, per-facility
damaged-stock tracking with photos, and an `HQ` role tag are all ALREADY in `StockOpnameView.jsx`.
**HQ is not a new layer in this app; it is new to EOD.** Third time in one day that "what he asked
for is half-built already" has been true — after the bounty engine and the sheriff theme. Check for
an existing implementation before designing a new one; with this codebase it is the higher-yield
first move.

### He tests on the REAL screen and finds what a harness cannot (2026-08-17)

Five slices of EOD were built and each was verified — build clean, 586-check audit, a 10-assertion
self-check, components mounted and driven in headless Chrome, rendered in both themes at 390px.
Then he opened the actual app and reported three things in one message:

> *"it look so broken sc1"* ·
> *"sc2 is not effective, what if there are a lot of item types at once missing item on onetype wont
> make a good record to the data"* ·
> *"what i want is each card animations going inside 1 same letter then sending animation could be
> better than now"*

**All three were invisible to every check that passed.** Worth separating why, because they fail
differently:

1. **The broken screen was a COMPOSITION bug.** The new deck was correct and the old figures block
   was correct; putting both on one screen was not. A component harness renders the component, so
   it can never see this. ⚠️ **Rendering a component in isolation does not verify the screen it
   lands on** — the only check that would have caught it is the real app, or reading what the
   branch already rendered before adding to it. I replaced the submit BUTTON and left 73 lines of
   figures above it.
2. **The goods card was a DESIGN flaw with a data consequence**, and he found it by thinking about
   his own trade rather than by looking: one input for all goods means a shortfall of one product
   type vanishes inside a total. The record shape built hours earlier exists so a gap leads back to
   a specific thing — and a single-number input discards that at the point of entry, before any of
   the machinery downstream gets a chance. **He protected an architectural property I had built and
   then undermined myself.**
3. **The animation was a misread of his spec.** He wrote *"animation of those cards put inside the
   letter"*. It was built as deck-then-letter, two scenes. He meant one letter present throughout
   with each card flying INTO it. Re-read: his sentence says "inside", and "inside" is a
   destination, not a sequence.

**The rule this earns:** when he specifies motion with a preposition — *into*, *onto*, *behind* —
that preposition is load-bearing and describes a spatial relationship between things that coexist.
Two things cannot go "inside" each other if only one is on screen at a time.

⚠️ **And the pattern across all three: every check I ran was a check of MY OWN work against MY OWN
intent.** None of them compared the result to the screen he would actually open. Cheap correction
available and not taken: read the whole branch being modified before adding to it, not just the
line being replaced.

### What his three corrections were worth once they were built (2026-08-17)

All three were fixed the same night (`661498f`). Two turned out to be **better design than the
thing they replaced**, not just repairs, and that is the part worth keeping.

**#2, the per-line goods card, is the strongest design note he has given.** He did not describe a
screen — he described a *failure of the record*: a shortfall of one product type vanishing inside a
total. The fix it implies is stricter than the version it replaces: one input per product, and
**confirm blocked until every line carries a number, because a blank and a zero must not become the
same record.** "There are none left" and "I did not count this" are different facts. He got there
by thinking about his own trade, and it protects an architectural property that had been built
hours earlier and then undermined at the point of entry.

⚠️ **His generalisation did not survive contact with the data, and saying so is part of the
answer.** He wrote *"same argument applies to pita cukai if stamps are tracked per product"* — they
are not. `expectedCukai` is one pool (`calcTotal + globalCredit + legacyDebt`), so there is no
per-product figure to count against. The two lines that card *does* need are the two OUTCOMES the
legacy second card owned: handed over, and lost. **He named the shape; the data named the axis.**

**#3 confirms the preposition rule above.** "Inside" needed the letter mounted for the whole flow —
so it now shows **four blank rules from the first card**, and each confirm flies its card in and
fills one. That beats the deck-then-letter it replaced for a reason that has nothing to do with
animation: **the letter says what the evening is before the evening starts.**

**And *"sending animation could be better than now"* is the "cheap" diagnosis again**, in its exact
recorded form — *effort is not where the moment is*. The send was one 700ms slide at the end of a
carefully staged flow. It is now a 200ms lift, then the arc away, then the slot closing behind it.
Third time he has made that judgement; third time he has been right.

⚠️ **The screen he called broken also had three defects he had NOT named**, all found by rendering
it: the open envelope flap threw an 81px wedge over the step strip, the wax seal still clipped the
last row's figure, and the letter's slot stayed open after it flew away. See
[[Looking at the App#What the frames bought this time (2026-08-17)]] — the shared cause is that a
component which stops being an ENDING and becomes PRESENT has states nobody has ever looked at.

### He reports a palette bug and a money bug in the same breath, and the palette one is the tell (2026-08-17)

Two sentences, one message, about the legacy Pita Cukai card:

> *"the color pallete and design is really bad, make sure it follow our theme"*

> *"i add more item and submit on the EOD it still allow us to sent the item data more than what
> the agent bring, this is really niche happen tho"*

**The screen he was looking at was the OLD card**, still on display because he had already
submitted cash that day — so the new flow had replaced it only in the state where cash was still
open. ⚠️ **"I hid it in the case I was working on" is not "I removed it".** Ask which STATES a
replaced component still renders in before calling it replaced.

**On the palette half, the mechanism was the same one already recorded twice on this page.** The
panel was a full `--gold` slab carrying `--ink-dim` text — gold on gold — and its two fields were
`bg-black/60`, a hardcoded black that lets the dark theme decide what light mode looks like. Both
are shapes this page already names ([[#Where the bug actually lived: hexes in the JSX]], and the
`--accent-ink` / `--gold-ink` confusion). **The audit check written for it immediately found two
MORE gold-on-gold sites on the admin side of the same file** that nobody had reported. A complaint
about one card is worth grepping the whole screen for.

**On the "niche" half — he undersold it, and that is worth knowing about how he reports.** He
called it *"really niche happen tho"*. Chased into the code it is the most expensive bug found in
this feature: `handleVerifyEOD` spends the submitted stamp figure against the debt ledger and turns
any surplus into a **negative `global_credit`** (App.jsx:1918-1920), which permanently reduces what
that agent owes on every later day. An over-count did not record a wrong number — it minted credit.
⚠️ **He rates a bug by how often he thinks it happens, never by what it costs when it does.** Price
the consequence before agreeing with his severity.

**And the fix had to choose between two of his own principles**, so it is recorded rather than
assumed: capping a physical line reveals the expected figure, which the money cards deliberately
hide so that counting cannot become copying. It was capped anyway, because the vehicle's own load
is not a secret — the agent can read it on their Agent Inventory screen — while which sales made up
today's cash is. **Cash and transfer stay uncapped**: an agent genuinely can be holding more money
than the app expected, and that over is a real gap worth keeping. The ceiling belongs to physical
objects, where the number is *impossible* rather than merely *unlikely*.

## A truncated product name is a data-entry hazard, not a cosmetic flaw (2026-08-17)

Shown the fan-carousel prototype he had asked for, he approved the motion and rejected the rows,
in one sentence:

> *"its good but adjust the spacing and sizing, i dont want to see this kind of format, because i
> want to see the product in full name to avoid mistake in the future"*

The screenshot he attached read `Cell… / Cell… / Siga… / Djar…`. **Two of those are the same
prefix** — the demo list holds *Cello Green 16* and *Cello Merah 12* — so an ellipsis at four
characters removed the only part of the string that told them apart, on a screen where the number
typed next to the name becomes money owed.

Three things to carry forward:

- **`text-overflow: ellipsis` is banned on any identifier the user must match against a physical
  object.** Wrapping to a second line shows every character and costs only height; truncation is
  silent and costs the wrong count. This is the same instinct as [[Every action must report]] —
  he will not accept a UI that hides what it did or what it is.
- **He does not say "make the card bigger", he says "adjust the spacing and sizing".** That is
  permission to change the geometry, and it is on you to find which dimension was actually
  starved. Here the name column was 89px because a *scrollbar* was eating 15px and the number
  field was reserving 76px for four digits — neither is visible in the complaint.
- **He justifies with consequence, never with taste**: *"to avoid mistake in the future"*. When he
  gives a reason like that, the fix has to satisfy the consequence, not the appearance. Shrinking
  the font to make `Cello Green 16` fit would have answered the screenshot and failed the reason.

Fix, measured inside a real 390px viewport: card 232→264 wide and 372→416 tall, name column
89→112px, number field 70px content-box → 56px border-box, list turned into a flex child so no
fixed height can clip it. All six names now render on one line.

## Fault follows the goods, not the money (2026-08-17)

Asked who owns a transfer that never lands — the agent or the customer — he refused both and gave
a procedure instead:

> *"well if there is a scenario, where customer use transfer to buy the product, show the agent
> faked bukti transfer and agent bring that fake bukti transfer to the admin, then there will be
> investigation towards this, if confirm the store already receive the item then it is customer
> unpaid bill, but if there is no proof even that the customer did not buy and the agent make fake
> receipts instead then it will be put on the agent bounties"*

**The discriminator is whether the goods reached the store, not whether the money arrived.** Goods
delivered + money missing = the customer owes. No evidence of a sale at all = the agent invented
it, and it becomes an agent bounty.

Two things this teaches about how he decides:

- **He answers an either/or with the investigation that separates them.** The question offered
  three owners; he supplied the evidence test. When a question has been posed as "who pays", check
  whether the real answer is "here is how you find out" — a state machine, not a field.
- **He thinks in fraud scenarios, not error scenarios.** The case he reached for first was a
  *forged* bukti transfer, not a mistyped one. His app is built for a business where the person
  entering the record can be the person stealing, which is why [[Every action must report]] and
  the physical count ceiling both exist.

**What it forces in the design, which he had not priced:** the investigation does not finish the
same night the EOD does, so a shortfall needs a third, ownerless `DISPUTED` state at verify time.
And "confirm the store received the item" cannot be settled from the sale record, because the
agent typed it — the suspect's own entry cannot exonerate the suspect. Independent evidence is the
customer's word, or the van count, which already catches the variant where the faked sale's goods
are still on the vehicle.

## 🔴 AMBER IS AN EDGE AND AN INK. IT IS NOT A FILL. (2026-08-21)

> *"stop using amber background i said, i hate it, use it for little things and u can do better
> animation or UI for the damaged item not just all amber"*

The word **"i said"** is the tell — this was the second time. The 2026-08-20 rule ("amber draws
lines, it does not fill the box") was written down and then broken anyway, by me, in a fresh
prototype: a gold slab on the MATCH plate and gold fills on the toggle buttons. Writing a design
law down does not stop it being broken. **A number in a check does.**

What survived as a legal fill, and why: a **3px rule whose LENGTH is the data** (how much of the
damaged total has been given a cause). At 3px it reads as a line, not a slab. That is the only
one left on the control.

### He judges by measurement, not by vibe — twice in one session

> *"i want u make the transparant circle on the back for the level to have outline color so that
> i can see it clearly instead of black on black or something, just make it visible"*

"black on black" was literal. The empty ring was `--line` (#26231F) on `--panel` (#121110):
**1,19:1**. He read a contrast failure off a screenshot. After the fix: 5,60:1 dark, 7,97:1 light.

> *"it is an taste issue why u have so much space between produt title and the 2x2 panel, why
> dont u just expand the panel so that its more visible instead or smth?"*

He called it taste; it was two bugs. **The rule underneath is his, and it is general: the SLACK
BELONGS TO THE DATA, NOT THE LABEL.** A title given `flex:1` parks hard left and opens a dead
channel across every row. The figures should grow into that space instead — bigger numbers are
the point of having the space.

### The near-miss worth remembering

Fixing his invisible-dot report, I gave the ring `box-shadow: inset 0 0 0 1px`. **Lite Mode strips
box-shadow**, so on a cheap Android every unvisited position would have gone invisible again — the
identical bug he had just reported, arriving through a different door. The integration audit's
rule *"nothing depends on a shadow, a blur or a filter"* caught it. Tailwind's `ring-*` is also a
box-shadow, and caught the same way.

**A check outlives the person who remembers why.** See [[Anti-Recurrence Check]].

## A warehouse row holds several kinds of damage at once (2026-08-21)

> *"i made this because there might be different kind of damaged good stored inside our warehouse
> right?"*

He killed my one-reason-per-product shortcut with one question, and he was right.

**The structural finding underneath it:** KPM treats damage two different ways and they do not
match. **Intake** is a bare integer (`damagedStock`). **Resolution** is a full ledger
(`quarantine_logs` — qty, method, value, who, when). So the app can answer *"what left quarantine
and why"* perfectly and *"what is in quarantine and why"* not at all. Damage now enters with a
cause and a quantity per cause; the total stays the truth and the causes must sum to it.

**Why it is a money change:** the cause decides who pays. RTV charges nobody, PENALTY charges the
agent at retail. Damage entering with no cause makes that decision a guess.

## Where his ideas come from

The component and animation sources he pulls from are listed in [[Design Inspiration Sources]],
with the four rules that decide whether an idea can survive inside KPM.

## 2026-08-24 — the ON plate is brown by law, and the bezel is the way out (measured)

He photographed Sampling, Customer Directory and Settings: *"most of them have brown color not
ARK Lab enough lol"*, and earlier *"apply this color to other components as well because most of
them is too brown, but make sure that its not too bright that sharp to the eye level"*.

**The brown is not neglect. It is forced by `src/config/contrast.selfcheck.mjs`.** Measured:

- the gold plate must clear **3:1** against the darkest light ground → plate luminance **≤ 0.1376**
- a dark ink (`#2B2318`) on that plate needs **4.5:1** → plate luminance **≥ 0.2552**

The windows do not overlap, so **no colour** satisfies both — not just no amber. `--gold` is
`#7A4C0C` (L 0.0933) with pale ink `#FCF7EE` because that is the only shape that passes. A trial
swap to `#E07C00` + `#2B2318` failed 4 pairs (2.14, 1.60, 2.41, 2.16 vs a needed 3) and was
reverted; the ink half passed at 5.20:1.

**The escape is the rule he had already accepted the same day for the sidebar rail:** *"a lamp is
separated from its panel by its BEZEL, not its core"*. `--gold-edge` measures **4.57:1** against a
panel. The check measures the plate's CORE against the ground — the wrong part of a rimmed plate.

**Taste principle to carry forward:** when he says something reads too brown, check whether a
contrast rule is measuring a FILL that is actually rimmed. Darkening a core until a check goes
green is how the rail came out brown the first time, and he photographed that too. The fix is to
move what is measured, never to move the bar.

⚠️ Open, unanswered as of this note: whether he wants bright-amber plates with dark outlines
instead of dark-brown plates with none. 68 fills ride on it.

## 2026-08-24 — the grain had to go, and it was a measurement error as well as a taste one

> *"btw i dont like the lines on the sidebar background for the light mode can u change to other
> plate instead, this line make the color that is intact on it seems darker as well"*

The light-mode faceplate carried a brush texture: `repeating-linear-gradient(90deg,
rgba(255,252,244,.28) 0 1px, transparent 1px 3px)`. **A 1px line every 3px covers a third of the
plate**, so the surface the sixteen marks actually met was never `--plate` — and
`contrast.selfcheck` was grading a colour that is not fully there. He read that off a screenshot
before anyone measured it. **Third time he has caught a contrast fault by eye** (see the invisible
ring at 1,19:1, and *"it looks more brown than amber"*).

Fixed by removing the grain, not by tuning it. The flat faceplate is not a new material — **Lite
Mode had shipped exactly it since the plate was built**, so the two modes now agree.

⚠️ **Recorded so it is not "fixed" back:** do NOT put a gradient there instead. A vertical fade
re-creates the moving ground that made the marks fade down the column before the plate existed.
Flat, or nothing.

### Refinement to [[AMBER IS AN EDGE AND AN INK]] — the size is what the law is really about

His screenshot of the rail shows the active gear on a **bright amber disc**, and he is not
complaining about it — he photographed it to complain about something else. So *"stop using amber
background"* is not a ban on every amber fill; his own words were *"use it for little things"*.

**The operative distinction is SLAB vs MARK.** A small disc, a 3px rule whose length is the data,
a dot — legal, and bright. A button-sized or panel-sized amber plate — not. This matters because
the light theme cannot make a large amber fill work anyway: a fill must be dark to clear 3:1
against cream, and dark amber reads brown, which is the complaint he opened the day with.

**So the fix for a brown button is to stop it being a fill at all** — transparent body, amber
edge, amber word, fill only on press. `.kpm-btn.key` already does this and passes; the buttons he
photographed are Tailwind ones that never adopted the house pattern.

## 2026-08-24 — he chose the STEEL faceplate over the stencil, against the measurements

Shown four button treatments on his real ground, with contrast numbers on each:

> *"TBH A and B looks cool but B is more minimalistic and similar to our theme more, i think
> we'll go with that one"*

**A (near-black stencil plate) measured better on every single row** — 15.82 vs 13.97 for ink,
10.65 vs 1.49 for separation, and it needed no rule changes at all. He picked B anyway, and the
word that decided it was **"minimalistic"**, with "similar to our theme" right behind it.

**This is the clearest datapoint yet on how he ranks the two.** A measurement gets a treatment
onto the shortlist; it does not win the shortlist. Weight and quietness beat contrast margin when
both options are legible. Do not re-run this argument by quoting numbers at him — offer the
options that pass, then let taste choose. See [[He judges by measurement, not by vibe]], which is
still true and is not the opposite of this: he uses numbers to catch things that are BROKEN, and
taste to choose between things that WORK.

### What his choice cost, and why it was still cheap

B is the option that needed work. A pale plate is 1,11-1,68:1 against its grounds, so the rim
became load-bearing and the four contrast pairs that graded the plate CORE were repointed to
grade the RIM — **the 3:1 bar did not move, only what it measures.** That trade is only honest
while the rim is really applied, which the pairs cannot see, so `G50` in `integration.audit.mjs`
asserts it against the BUILT stylesheet.

⚠️ **THE PART THAT WOULD HAVE SHIPPED BROKEN — MARKS DO NOT FOLLOW PLATES.** `--gold` also filled
the toggle switch, the segmented switch and the EOD progress bar. Those sit on an `--inset` track,
not on the page, and a pale fill measures **1,68:1** there: he would have flipped a switch in
Settings and been unable to tell whether it was on. Plates went pale, marks kept amber. His own
slab-versus-mark rule is what made the call obvious.

⚠️ **`--sw-on` exists because one mark inverses.** The toggle's track is mid-tone in light and
near-black in dark, so no single value works: bright amber on the light track is **1,12:1**. Deep
amber `#6B3400` gives 5,32:1 in light; the bright value gives 9,32:1 in dark. `--lamp-on`
deliberately does NOT inverse, because a lamp is a lamp — a filled track is not a lamp.

### Two bugs found by checks rather than by looking

A rim written as `box-shadow` — **Lite Mode deletes shadows**, so the segmented switch's ON state
would have gone invisible on a cheap Android. Identical shape to the invisible-dot near-miss
recorded above. And a contrast pair written this session graded a rim against its own fill instead
of against the panel, failing at 2,33:1 on a control that is perfectly visible. **A pair that
measures the wrong relationship is worse than no pair** — it spends trust on a false alarm.

## 2026-08-24 — he reversed his own choice AFTER seeing it, and that is the whole lesson

Two hours after choosing the steel faceplate he opened the running app:

> *"wait i think it may look better with the stencil and an amber light tho, i look on the app
> and i dont really like it"*

**He is the only person who had seen either treatment render.** The measurements had favoured the
stencil all along (15,82 vs 13,97 ink, 10,65 vs 1,49 separation); he chose steel from a study
page, then unchose it from the app. Both calls are his and both were right at the time.

⚠️ **THE RULE THIS SETS: a swatch is not a screen.** The study rendered real buttons at real size
on the real ground and it STILL did not predict his reaction, because a button is judged among
sixty other things, not in a row of four. Offer options as a study to narrow the field; expect the
final call to move once it is in the app. **Budget for one reversal instead of arguing against it.**

### What looking found that no check had been asked

The stencil plate exposed a bug nothing was watching: the two buttons at the top of Sampling
paired `bg-[var(--gold)]` with `text-[var(--ink)]` — **near-black on near-black, 1,04:1.** He saw
it in the first screenshot ever taken of this project.

**21 ink references across 5 files** were pointing at `--ink`, `--accent-ink` or `--ink-dim`
instead of the plate's own `--gold-ink`. Most had never been readable: `--accent-ink` on the OLD
brown plate measured **1,54:1**, so those notes and badges were broken long before today.

**A token PAIR is a contract, and nothing was enforcing it.** `G51` does now.

### The guard that had to be rewritten before it was worth having

`G51` v1 scanned source LINES and fired 30 times — about 26 wrong. A ternary's other branch, a
`group-hover:` pair that switches bg and ink together, and two elements sharing one line all look
identical to a line scan. v2 reads one `className` value at a time and only complains when the bad
ink is in the STATIC part while the plate can actually apply. **This is the third time the
element-vs-line mistake has cost a session** — see [[scope a guard to the ELEMENT]].

⚠️ **A guard that cries wolf gets switched off, which is worse than no guard.**

### Green was carrying meaning in Customer Directory, and it had to be replaced not deleted

Three violations on one screen, all meaning *"this is the record you are editing"*: an emerald
button fill, an emerald glow on DATA SCRUB, and `ring-2 ring-emerald-500 bg-emerald-50
dark:bg-slate-700` on the card. **Deleting green would have deleted the meaning.** It is an amber
EDGE now — legal under his law, and Lite Mode safe, which the ring never was: a ring is a
box-shadow and Lite Mode deletes it, so on a cheap phone the edited card had no mark at all.

## 2026-08-24 — Lite Mode was painting a dark scrim over every screen, and only looking found it

> *"another thing that i see broke is actually sidebar on lite mode u may check it"*

Reproduced in his Chrome and **measured, after three wrong theories** (a black `box-shadow`, a
gradient, a specificity tie). `getComputedStyle` settled it in one call:
the sidebar panel was painting **`rgba(46,38,26,.72)` across 351x688px** — `--duke-scrim` — over
the whole left column of every screen in Lite Mode.

**Cause: a blanket attribute selector.** `src/index.css` has
`html.lite-mode [class*="backdrop-blur"] { background-color: var(--duke-scrim) !important }`.
The desk panel carries `backdrop-blur-xl`, so it matched, and the `!important` beat the panel's
own `lg:bg-transparent`. On a desk that element is an invisible **window** — it paints nothing,
and the capsule inside it is the sidebar you see.

⚠️ **The rule's own comment asserted the thing that was false:** *"every element this rule
overrides is a scrim or an overlay"*. **A comment cannot check itself.** This is the same failure
shape as a source guard scoped to a line instead of an element, and it is the third time that
shape has cost a session — see [[scope a guard to the ELEMENT]].

**Fix:** hand the background back at `>=1024px` only, since below that the rail really IS a drawer
and the scrim is correct. **The blur stays stripped**, or Lite Mode would be paying for a blur on
the exact phones it exists to protect. `G52` asserts both halves plus the media-query scoping,
against the BUILT stylesheet.

### The minified form is the form to assert against

`G52` first went red against working CSS because it matched `[class*="backdrop-blur"]` while the
minifier ships `[class*=backdrop-blur]` — **quotes dropped**. A check that reads the built output
must be written against the built output, not against the source it came from. Look at `dist`
first; do not predict the minifier.

## 2026-08-27 — hierarchy is made of space, not of more lines

> *"there should be personal space between the location line and the product lines just to show
> that they are different ... psychology of the expensive wears store shelf and product display
> format used by LV or PRADA"*

He is describing a **real hierarchy failure, not a taste preference**. The Sebaran Stok drawer sat
flush against its warehouse row behind a hairline, and every product carried another hairline of
the same weight — so a reader scanning down saw **one unbroken stack of six rows** instead of one
warehouse containing five products.

The fix removed rather than added: the `border-t` between the warehouse row and its drawer is
**gone** (the inset background tone already says *nested*; a rule on top of that says it twice and
reads as "another row"), padding grew inside the drawer and per product, and the between-product
rules faded to `/30` so they align the number columns without competing with the gap doing the
actual separating.

> **Nothing was added to say "these are different". Something was removed, and the space left
> behind said it.**

**Generalises:** when two levels read as one list, look for a rule to delete before reaching for a
stronger one. Weight competes; space does not.

## 2026-08-27 — plain words, and a number must show its working

Four rules stated in his own voice on one screen:

- *"dont make vague terms"* and *"use english terms if its shorter and direct"* — Di gudang → **In
  stock**, Di jalan → **Shipping**, Di tangan agen → **Agent inventory**, Terjual → **Sold (7d)**.
- **An abbreviation nobody can expand is a bug.** *"change nomor SJ because i dont know what is
  that"* — SJ is *surat jalan*, and **he owns the company and could not read the label on his own
  intake form**. Now "Delivery note (app) / (factory) / (paper)". If the owner cannot read it, no
  agent can.
- **An estimate must say it is one.** He asked for wording meaning *potential* time left, so the
  column is **Est. days left** — a bare "Days left" reads as something the system measured.
- *"i want where u got that calculation"* — **printing a quotient without its divisor asks him to
  trust a number he cannot check.** An *Avg / month* column now sits beside the estimate and the
  footnote writes both divisions out longhand, including what `≈` means and what an em-dash means
  (no rate to divide by, **not** "lasts forever").

⚠️ **Scope the rule to the audience.** `BranchWarehouseManager.jsx:1121` still says "Di jalan" on
purpose: a different screen, a different reader, all-Indonesian by design. The English rule was
about **HQ column labels**, and the same open question now sits on the
[[Ponder Tutorial System]] — a teaching sentence for branch staff is not a table header for an
HQ admin.

## 2026-08-27 — a banner that names the screen you just clicked is chrome

*"not cool and elegant"* about "GLOBAL LOGISTICS COMMAND / ALL BRANCHES NATIONWIDE" — two lines
above the only thing on the page worth reading, saying what the click already said. Deleted for HQ,
**kept for a branch user**, where it is not decoration: it names which hub they are looking at and
who their admin is, and neither is obvious from anything else on the screen.

The replacement title took its weight from **type and an accent rule, with the colour coming out**:
`text-ink` reads at full contrast in both themes, where the gold it used to be is a mid-tone
fighting the panel in each. **The gold survives as the icon chip and the rule — pointing at the
title rather than being it.**

And the edge: `shadow-xl` is a hard black slab under a near-black panel, which is what read as
*cheap*. Replaced with a **1px contact line plus a wide heavily-offset ambient**, so the panel sits
on the page instead of being stamped onto it.

Source: [[../Summaries/Surat Jalan Desk and Sebaran Stok]].


## 2026-08-27 — the tutorial's four answers, and how a panel got its English name

Asked the three open Ponder questions, he answered all three and added a fourth, unprompted:

> *"teaching just use indonesia, for terms for the features and components just use english"*

> *"scene play but itself but also add pause button or timeframe to restart the tutorial, just like
> the ponder system inside create mod, i want u to fully research how that works and also find
> example so u got the image to do this job"*

> *"nope dont push newcomer towards the scene let them figure out by pressing the tutorial button"*

> *"dont use sebaran stock, use proper elegant english terms for that"*

**Three things worth keeping from these.**

**He splits the audience by SENTENCE versus LABEL, not by screen.** The 2026-08-27 English rule was
about HQ column headers, and the open question was whether a teaching sentence for branch staff
inherited it. His answer draws the line inside the sentence instead: Indonesian prose, English
terms, because the term is the thing the reader has to go find on the real panel. A translated
column name would teach a word that appears nowhere.

**"Fully research how that works and also find example."** He asks for the mechanism before the
build, and he means it literally — the result is
[[What Create Mod's Ponder Actually Does]], read out of Create's own Java rather than described
from memory. Compare *"i want where u got that calculation"*: the same instinct, applied to a
reference instead of to a number. **He does not accept a resemblance where a source exists.**

**He refuses to push anything at a new user.** Not a first-run tour, not a "have you seen this"
flag. The button sits there and waits. That is consistent with *"i dont want to see the sidebar
button on the login screen"* — a control that appears without being asked for is a bug to him.

### The naming call, and the two that lost

**`Stock by Warehouse`.** Rejected on stated grounds, so no later session re-proposes them:

- **Stock Distribution** — the literal translation of *Sebaran Stok*, and wrong here. The panel
  already has a **Shipping** column, and in logistics "distribution" is the shipping operation, so
  the title could be read as naming one of its own columns. The [[UI-Says-Yes-Server-Says-No Pattern]]
  cousin for words: an ambiguous label is a bug, not a style preference — the same rule that killed
  *"nomor SJ"* when the owner could not expand his own abbreviation.
- **Stock Across Warehouses** — precise, and 23 uppercase characters at `tracking-[0.14em]` wrap to
  two lines on a phone. **A two-line title is the thing he deleted the banner for**, three hours
  earlier, in this same file.

The subtitle already reads *every warehouse · in Bks*, so the title never had to carry scope.
**The slack belongs to the data, not the label** — his rule, applied to words.


## 2026-08-27 — six asks in one message, and what they say about how he reviews

> *"we can delete this"* … then, unprompted, a correction: *"i mean the instruction below company
> total btw"*

> *"make the explanation more easier to understand and more descriptive with easy indonesian
> language"*

> *"more variative textbox and animation not just static textbox on the bottom just like what create
> mod have"* · *"improve the higlights animation on each timeframe as well"*

> *"i want the tutorial book on the very top of the screen for every components, since we have a lot
> of space there maybe we can put it the book animation around there?"*

> *"make sure the book animation also open when hovered with all the effect and cool gaming
> animation then book open animation and zoom in to view the tutorial to choose from"*

> *"book open and closed animation on exit must be smooth, for lite mode then snap the book and
> close it right back thats fine"* · *"book SFX also needed here"*

**He deletes explanation and replaces it with demonstration.** The footnote he killed was correct,
complete and his own request from four hours earlier. What changed is that a tutorial now exists, so
the small print became the worse copy of a thing that already had a better home. **The instinct is
not "less documentation" — it is "documentation where someone is actually looking".**

**He specifies MOTION as precisely as he specifies numbers.** Not "make it nicer": *variative*
textbox rather than static, highlight animation per timeframe, hover then open then zoom, smooth on
exit. Compare *"i want where u got that calculation"* — the same demand for the mechanism to be
visible, applied to movement instead of arithmetic.

**He names the Lite Mode carve-out himself, every time.** *"for lite mode then snap the book and
close it right back thats fine"*. He has now done this on three separate features. **Lite Mode is
not something to protect him from; he budgets for it out loud.** The rule that keeps falling out of
it is the same one: the END state must be the readable one, because Lite Mode delivers only that.

**He points at empty space and asks what belongs there.** *"since we have a lot of space there
maybe we can put it the book animation around there?"* — the top bar, three status chips and a
clock. He reads unused space as an unanswered question, not as breathing room. Contrast the banner
he deleted the same morning for saying nothing: **space is for something that does a job, and
nothing is better than something that does not.**

**And a Minecraft mod screenshot is a spec.** He sent a dictionary book — tabs down the left edge, a
two-page spread, page arrows in the corners — and every one of those three made it in. What did not
was its palette; that book is green on parchment. [[Design Inspiration Sources]] rule 1 held:
**take the shape and the motion, never the colours.**

## 2026-08-30 — "its so fague": a label that never says less THAN WHAT

He shipped-tested a panel an hour after it landed and went straight at one word:

> *"btw what is showed on the 'kurang' here can u use better english words from now on and change
> that, its so fague"*

**`Kurang` means "less". It never says less than what.** The column was the master vault's stock
measured against every branch's need; `Short by` names the gap, and the explainer under the panel
names the two numbers that made it.

Three things worth keeping from this:

1. **He had already settled the rule and I drifted off it.** 2026-08-27: *"dont make vague terms"*
   and *"use english terms if its shorter and direct"*. The table directly above this panel has
   been English since that day. Putting an Indonesian panel underneath it was the inconsistency —
   he was not asking for something new, he was asking why one screen contradicted its neighbour.
2. **A number needs a noun.** In the same message: *"what is this mean the oldest sentence?"*, about
   `oldest here 116 days`. It never said 116 days of WHAT. It reads `oldest pack 116 days old`
   now. He reads a screen literally, and a phrase that only makes sense to whoever wrote it will
   be caught.
3. **The rule is now a check, not a memory.** Two guards scan the HQ desk files for Indonesian
   labels. His preferences keep coming back as things I forget; a preference that has been stated
   twice should stop being prose. See [[A Check Points at a File, Not at a Behaviour]].

⚠️ **Scope: HQ desk only.** The branch-side screens are all-Indonesian on purpose — different
reader, settled separately. This is not a rule about the app; it is a rule about the desk HE reads.

## 2026-08-31 — one door for the tutorial, and the reason is SPACE

He removed a feature that worked, and the reason he gave is the part worth keeping.

Three panels carried a small `? TUTORIAL` chip in their header — Product Performance, Stock by
Warehouse, Goods Received — which opened that panel's tutorial directly, without going through the
book on the top bar. Two doors into the same room.

> *"book is good we dont need any of the tutorial chip, all should be inside the tutorial book on
> top"*, then, when asked to confirm: *"okay yea remove the tutorial chip, all tutorials should be
> on book only to save space also"*.

**"To save space" is the rule, not "I dislike chips".** A panel header is the most contested strip
in the app: it already holds a title, a rule, a subtitle line, and on Product Performance four range
buttons. The chip was the least important thing there and it was competing with the controls people
actually press. He is not against entry points — he is against a permanent one costing header width
forever for something opened rarely.

**What this predicts for the next such decision.** A second way to reach something already reachable
must justify the space it occupies on every render, not on the render where it is used. If a feature
has a home, it does not also get a shortcut in a header — the shortcut is what gets cut.

**The original argument it overturned, which was also his.** 2026-08-27: *"nope dont push newcomer
towards the scene let them figure out by pressing the tutorial button"*, and the chip was built
because Create mod's Ponder opens by holding a key over the ITEM you are confused by, never from an
index. That reasoning was sound and he still overruled it once he saw the header. **Seeing it beats
reasoning about it** — the same pattern as 2026-08-24, when he reversed his own faceplate choice
after seeing it rendered.

One consequence he accepted implicitly: a scene missing from `sections.js` is now unreachable by
anyone, because the chips were its second door. That is pinned by an audit check rather than left
to memory.

Related: [[Ponder Tutorial System]] · [[A Feature Is Not Done Until the Book Knows]]

## The surat jalan: "looks awful" was two faults and a wrong lead (2026-08-31)

> *"we need to redesign the receipt for this because it looks awful and i dont know why is it
> transparant look at the SC"*

He named the transparency and left the rest as "awful". Both halves were real, and the transparency
had a mechanism he could not have guessed — see
[[The Shell Repaints Any White It Can Reach]].

**What "awful" turned out to be, once it could be looked at:**

| Fault | Why it read badly | Now |
|---|---|---|
| The **supplier's factory name** was the largest type on the page | his own delivery note looked like it belonged to the supplier | KPM leads; the factory is a field, `Asal` |
| The whole document was **monospace** | a delivery note that reads like a till slip | mono only for codes, quantities and money |
| Two grey panels holding four fields | the same four facts wearing furniture; eight stacked lines on a phone | one four-field row, hairline rules |
| `TOTAL LANDED VALUE` and its figure **broke across lines** | the most important number on the page was the one that wrapped | fixed grid, `whitespace-nowrap`, tabular figures |
| `mb-12` + `mt-12 pt-8` on the signatures | both names pushed off the first view on a laptop | room to sign, not a screenful |

**The reusable part is the type rule, not the layout.** Monospace is for things read digit by digit
or compared down a column — SJ numbers, batch codes, quantities, money. Setting a whole document in
it is monospace as a costume for "technical", and it is what made this one look cheap.

**And it confirmed the locked corollary rather than testing it.** `animate-fade-in` is opacity-only,
so the paper spent half a second semi-transparent — visually identical to the actual bug. An
animation must never own an element's visibility, and a printed document should not have an
entrance at all.

Related: [[The Shell Repaints Any White It Can Reach]] · [[Gudang Pusat (Master Vault)]]

## Given three options, he designed a fourth and it was better (2026-08-31)

Asked how the two signature lines on the surat jalan should be filled — type the driver / type both
/ print blank lines and sign by hand — he took none of them and specified a system instead:

> *"the only person who are be able to send and receive the package is company employees right, so
> make sure that there is new textbox to fill the recipient/penerima and sender/pengirim and then i
> want it to work like the factory and warehouse textbox, tier 4/ regional admin and above is
> automatically registered to have power to send or receive package, while lower tier cant do that,
> and if there is other employees outside of the sales team who will send that package then just
> add register button for the sender and receiver"*

**What all three of my options missed and he did not:** the question is not *how to fill two boxes*,
it is *who is allowed to be named on a document at all*. His answer reuses the pattern built four
hours earlier for places, so the delivery form ends up with one interaction rule across all four
fields instead of two. He also solved the bootstrap problem in the same sentence — staff qualify by
tier, so the list is never empty and nobody maintains it — and the escape hatch (a register button
for an outsider) is the smallest possible addition rather than a second system.

**This is the third time a design he wrote himself beat the options he was given** — see the
Sheriff's Desk flow and the tutorial-chip reversal above. The pattern in all three: he reasons from
**who the people are and what they are allowed to do**, where my options reason from what the screen
should look like.

**Practical rule for offering him choices:** when the options differ only in *interaction*, say what
each one implies about *permission and responsibility* too, or he has to supply that half himself —
which he will, and it will make the offered options look small.

Related: [[The Place Registry]] · [[Fleet Captain Permission Gap]]

## "Tempat" was too vague, and so was my fix (2026-08-31)

> *"i want u to change 'tempat' into better wording than that, it is so fague"*

He was right twice. `Tempat` (place) does not say which places or why, and the replacement I had
already shipped — `Daftar` — only means "list", which is no clearer. **A word that names the
container rather than the contents is the failure mode both of them share.**

Four options were offered rather than one chosen: **Relasi** (the word Indonesian trading and
accounting software uses for the parties you deal with), **Pihak** (the parties to a transaction),
**Data Induk** (master data), **Alamat** (addresses). He picked **Data Induk**.

**Why offering, not choosing:** this is the locked law about naming categories in his own trade,
and it earned its keep here — `Relasi` was my own favourite on domain grounds and he did not want
it. His pick is the one that says *what the records are for*: the fixed reference data everything
else points at. Anyone who has used business software in Indonesia knows the term on sight.

**Applied lesson, worth repeating:** the checks that went in do NOT pin the words. A guard anchored
on display copy goes red every time he renames something, which trains everyone to ignore it. They
pin **consistency** instead — whatever the tab is called, every message telling him to go register
something there must name that same label. A rename that misses one leaves an instruction pointing
at a tab that no longer exists, and that is the failure worth catching.

Related: [[The Place Registry]]

## 2026-09-01 — he refused a staged delivery, and the reason generalises

Offered the regional-warehouse job as two — repaint the colours first, then redesign the layout,
with the argument that he could not fairly review a design half of which was invisible in light
mode — he rejected the split in one line:

> *"well redesign and repaint should go together isnt"*

**He is right, and the reason is mechanical, not aesthetic.** A redesign rewrites the same
`className` strings the repaint would touch. Staging them means editing every line twice, and
handing him the same screen to look at twice. My argument had it backwards: the repaint was not a
prerequisite to be shipped separately, it was *part of the same edit*.

**What this says about how he takes delivery, and it has now happened twice:** he treats one
screen as one unit of work. On 2026-08-16 he closed a design round himself — *"i dont want to
waste anymore time to design this, lets move on with other work"* — and here he refused to open
two rounds where one would do. **Offering him a phased plan reads as offering him more review
sessions, which is a cost he pays and I do not.** Propose the whole pass; if it is too big, that
is his call to make after seeing the scope, not mine to make by pre-splitting it.

**It also cost nothing to be wrong here, because he answered in nine words.** The failure mode
worth avoiding is the opposite one — silently choosing the split and delivering half a screen.

### What the single pass then found, which the split would have buried

Doing both at once meant looking at the finished screen rather than at a half-repainted one, and
**two faults surfaced that every check had already passed**: amber used as reading ink (1,08:1 on
the light well) and six inputs with no placeholder colour, falling back to the browser's slate
(1,36:1). Both are recorded in [[Off-Token Colour Migration Map]]; both are app-wide. Neither
would have been visible in the repaint-only pass, because at that point the layout it sat in was
still the old one and I would have been looking for something else.

See also: [[Looking at the App]] · [[Off-Token Colour Migration Map]]

## 2026-09-01 — clear terms, and two sibling screens share one language

> *"use better language like before also add this learning into your memory, always use clear
> terms, not fague one and if the restock vault is in english then this regional warehouse should
> be in english as well if indo then indo"*

Third strike on vagueness, after *"its so fague"* (2026-08-30) and *"i want u to change tempat into
better wording than that, it is so fague"* (2026-08-31, which became **Data Induk**). He was
rejecting a proposed tab set — Terima / Minta / Isi Gudang — which was both vaguer and in a
different language from the panels he had already approved on the same screen.

**Two rules, and the second one is new:**

1. **A name must say what it is in full.** No word that only reads correctly to someone who already
   knows what the panel does.
2. **Match the SIBLING screen, and go and look at it rather than deciding from a rule.** The
   Restock Vault and the regional warehouse are the same job at two ends of one shipment; two
   languages across them reads as two products.

⚠️ **Rule 2 had no clean answer, and that is the finding.** Measured across
`RestockVaultView.jsx` on 2026-09-01, the Restock Vault is **mixed**: English for Batch No, Date,
Extra Costs, Qty Received, Select Product, Metadata, Shipping / Labor / Tax (Rp), Target Month;
Indonesian for Barang, Jenis, Jumlah, Nama, Nota, Kirim, Hapus, Proses, Tanggal, Ongkos kirim,
Pita cukai; and three fields carry both at once — *"Nama Pengirim (Sender Name)"*, *"Nomor Resi /
Tracking No"*, *"Surat Jalan / Delivery No"*.

So the instruction pointed at a screen that could not answer it, and the mixture went back to him
as the decision rather than being resolved by guessing. **This is also a standing cleanup item: one
of the two screens is going to have to be re-labelled whichever way he answers.**

**Unchanged either way: names he picked himself.** *Data Induk* is his, chosen from four options,
and it survives in an English tab set.

See also: [[Off-Token Colour Migration Map]] · [[Looking at the App]]

## 2026-09-01 — "not just recolor but redesign", and what he meant by it

A pass that repainted the regional warehouse onto the tokens, restyled its four panel headers and
fixed three measured contrast failures came back marked incomplete:

> *"regional warehouse is not complete, i want u to redesign the whole panel, similar to the main
> restock vault i said not just recolor but redesign, i want the design to be somewhat similar and
> of course include all the new product data and everything and also there should be different
> ponder regional warehouse as well. all the logic remains, there should be fixed location for the
> gudang as well and tier 4 and below cannot access the editing and registering of employees,
> gudang warehouse and factory as well"*

**"I said" is the tell again**, the same marker as [[AMBER IS AN EDGE AND AN INK]]. He had already
named the Restock Vault as the model; the pass took that as a palette reference and he meant the
STRUCTURE.

**What "similar to the main restock vault" actually means, now that it has been paid for twice:**
the other screen's SHELL — one nav strip, a lamp, a title on the left, tabs on the right, one body
below. Not its colours; those were already shared. When he names another screen as a model, the
thing to copy is its **layout grammar**, and the cheapest way to prove it was copied rather than
imitated is to make both screens render the same component — `WarehouseDeskNav` now does.

**Three separate asks arrived inside one sentence and only one of them was visual.** A fixed
warehouse address, a tier boundary on master data, and its own tutorial. His feature requests
routinely arrive bundled into the design request; reading the sentence as "make it look like the
other one" would have shipped a third of it.

### He settles a rule and then immediately shortens it

Asked English or Indonesian, he answered with a rule rather than a preference — *"if the restock
vault is in english then this regional warehouse should be in english as well if indo then indo"* —
and then, handed five proposed tab names, replied only:

> *"stock only is enough then u can continue"*

**Four of five names approved by silence, one shortened, and permission to continue in the same
five words.** That is the shape of his approvals: he edits the one thing that is wrong and does not
restate the rest. Waiting for a name-by-name confirmation after a message like that is waiting for
something already given.

See also: [[Off-Token Colour Migration Map]] · [[../Entities/Fleet Captain Permission Gap]]

## 2026-09-01 — he turned a feature into a SEQUENCE, and it was the better design

Shown the barcode working — scan marks the shipment arrived, count panel opens from its own button
— he did not accept it as finished. He described the flow he actually wanted:

> *"after confirming with barcodes there will be blind count panel that will appear to fill. so
> this barcode is just as a gate to confirm and make sure that all the package is arrived and
> opening a blind count panel to be fill to make sure that there is no missing item when shipment
> how is that system? is this good enough?"*

**What I built was two independent controls. What he described is one ordered process**, and it is
stronger for a reason he stated himself: *"this barcode is just as a gate"*. With two loose
controls, a count can be filed for a shipment nobody has confirmed is in the building. With the
gate, the physical fact comes first and the paperwork follows it.

**The division of labour in his own sentence is exact**, and worth quoting because it settles a
question I would otherwise have had to ask: the scan makes sure *"all the package is arrived"*; the
count makes sure *"there is no missing item"*. One label per delivery, so a delivery arriving as
three cartons with one missing still scans as arrived — and that is fine, because the count is
what catches it. **He is not asking the barcode to count boxes.** A later session tempted to make
the label per-carton should read this paragraph first.

### He asks "is this good enough?" and means it as a real question

The phrasing is not a request for approval of his own idea — it is the third time he has handed
over a design and asked for the objection ([[HE DESIGNED THE FLOW HIMSELF, AND IT BEAT BOTH OF
MINE]], and the sender/recipient design on 2026-08-31). **The correct response is the cost he has
not priced, not agreement.** Here that cost is: a hard gate means anything blocking a scan blocks
receiving goods entirely, so the typed fallback stops being a convenience and becomes a safety
property. He had already covered it in the same message — *"yea put typing box if camera not
working"* — which is itself the pattern: he tends to close the hole in his own design in the
sentence after he opens it.

See also: [[Logistics and Stock Movement]] · [[Every action must report]]

---

## Backlight out, full words in, and the lowkey 3D stays (2026-09-02)

His verdict on the tech-pad draft, verbatim:

> *"the backlight is too much i think, i dont think its convenience to look at in the long term
> maybe just remove the backlight. and i want the section button to be 1 full word instead so its
> easier to read right, the lowkey 3D looks kinda cool tbh"*

Three separate rulings in one sentence, and they do not generalise to each other.

### 1. He judges a surface by how it feels after an hour, not in a screenshot

*"i dont think its convenience to look at in the long term"*. The light band sweeping the pad's
face looked good in a still frame and read as fatigue in use. **A moving highlight over text is a
cost he pays every time he reads, and the payoff is one moment of "nice".** This sharpens the
spec's existing *no glow-as-crutch* rule, which only banned a glow that a shape DEPENDS on: he
also refuses a glow the shape does not need. The test to apply before adding any sheen, bloom or
sweep is **"would this still be welcome on the tenth read?"**

Carried out in the fix: the grain texture moved to the housing only. **Texture may sit on the
object; it may not sit across the words.**

### 2. Navigation labels are words, not codes

Three-letter key-caps (`CMD`, `RST`, `PTG`) were built for instrument flavour. He replaced them
on sight: *"1 full word instead so its easier to read"*. **Readability outranks theme.** The
theme survives in the housing, the mono type, the tabular numbers and the hairlines — none of
which cost him a word.

⚠️ **And the words already existed.** `short` in `src/ponder/sections.js` is one word per section
and its comment says it is the tab label for a page edge. Inventing codes meant inventing a
second naming system beside one his own file already held. **Look for the label the data already
carries before naming anything** — the same rule as [[Law: only Aldi names the categories in his
own trade]], one layer down.

### 3. Depth is confirmed, and quiet is why

*"the lowkey 3D looks kinda cool tbh"* — the first unprompted praise for motion in this project,
and the word doing the work is **lowkey**. Three rounds of a book with a full 3D fold got
"clunky"; a 5.5-degree housing tilt with parallax between the rail and the display got "cool".
**The depth he likes is the depth he notices only when he moves the phone.**

See also: [[The phone tutorial shell]] · [[Lite Mode gives up motion, never colour]]


## Chrome speaks English, the app speaks Indonesian (2026-09-03)

Asked whether renaming `SEKSI` to `SECTION` should drag the rest of the strip with it, he ruled:

> *"only english the label, all the explanation should be in indonesia"*

**The line he drew is register, not vocabulary.** Instrument labels — the words printed ON the
housing, that name a control or a count — are English. Everything that EXPLAINS something to the
reader is Indonesian. So `SECTION 14/17` and `MODULES READY 05/21` sit above a panel whose title,
blurb and every entry description are Indonesian, and the caption under the pad stays Indonesian
while naming the English control it points at.

This settles the tension in [[Clear terms, one language]] for chrome specifically: one language per
LAYER, not one language per screen. A strip that mixes both inside itself is still wrong.

## An OFF state has to look OFF (2026-09-03)

On the tech pad's edge meter and key-cap lamps:

> *"this light should be off by default and only turn on when the section in their line is
> accessed, and also should be off in default until choose for the dot"*

Both unlit states were pale grey — `rgba(232,227,218,.10)` and `.13` — chosen so the shape of the
control would still be readable. He read the whole rail as already switched on.

**The rule:** an indicator's resting state is a DARK WELL, not a dim version of its lit state. On
this dark housing that means near-black with an inset shadow; the eye should have to look for it.
Anything bright enough to be comfortably visible is reporting something. Note this is the same
instinct as [[Light mode gets its own MATERIAL]] pointing the other way: a lamp reads as lit by
standing OFF its surround, so on a dark plate it goes brighter and on a pale plate it goes darker
and denser — and its OFF state always retreats toward the plate.

He also asked, same message, for *"more 3D and smoother ... cooler more gamelike features"*. What
satisfied it was physicality, not effects: caps that actually depress before they rise, a lamp that
blooms then settles, a meter cell that flashes overbright as it energises. No new colours were
added — the palette law held, and the removed backlight stayed removed.

## "More 3D" means LATCHED, not floating (2026-09-03)

Shown a rail whose active key rose off the panel with a tilt, he rejected it:

> *"dont make the button floating like that, u know just make the button that pressed and stays
> down until other button is press. and when not turning on all the light should stays black on
> default and lights up light amber when section pressed"*

**Two things to carry forward.**

1. **His depth is physical state, not visual flourish.** A raised control reads as *available*; a
   sunk one reads as *chosen*. He asked for 3D and got lift, and lift was the wrong direction —
   the selected thing should be the one pushed IN, held down like a latching push-button, until
   another takes its place. Hover must not lift either, for the same reason.
2. **He wants ONE lit colour, and black when unlit.** Not a palette of lit states tuned per
   surface — one amber that means "on" wherever it appears, and true black when off. This is the
   third round in a row where the same indicator was retuned; the reason it kept failing is that
   each surface got its own answer. See also [[An OFF state has to look OFF]].

**The lesson underneath both:** the fix for an illegible indicator was not the indicator. The lamp
could not be read because it sat on a gold cap. Three rounds tuned the lamp; changing the CAP
solved it at once. When a foreground element keeps failing against its background, the background
is the thing to question.

## "Technological" means the machine shows its work (2026-09-03)

> *"can u make the animation when text appearing to be more technological rather than just that
> simple animation"*

A fade-and-slide is what every framework hands you, and he reads it as *nothing was designed*. What
satisfied him was motion that imitates a **mechanism**: text swept on left to right like a raster
scan, and a title resolving out of scrambled glyphs. Both say "a machine is putting this on the
screen"; a fade says only "this appeared".

**The pattern across rounds 7, 8 and 9 is one instinct.** He wants interface elements to behave
like *parts*: a key that latches down, a lamp that energises and settles, text that is written
rather than revealed. Effects layered on top of a control do not satisfy him; behaviour that the
control would have if it were physical does. Reach for the mechanism, not the effect.

He also said, same session: *"use all the design skills to make those"* — see
[[Design Inspiration Sources]] and the §1a stack. Worth recording that it paid: the first draft
broke four of the skills' rules, and the skills' own default curve then turned out to be the wrong
one for this motion, which only a measurement caught.

## "Norak" — two animations claiming the same moment (2026-09-03)

> *"i like the design but remove the zoom out and zoom in for intro and outro of that text too
> much animation make it norak and not elegant"*

**Norak** is Indonesian for tacky, gaudy, trying too hard. It is his strongest negative word for a
look so far, and it is worth reading precisely: he aimed it at the *quantity* of motion, not at any
single animation. He had just approved the text write-on. What he rejected was the panel zooming in
from depth **at the same time** as the text swept itself on.

**The rule this gives:** one moment gets one animation. When a new mechanism is added to a screen,
check what the old one was already saying at that instant — two things introducing the same content
read as fussy even when each is well made on its own.

**And the process failure behind it:** four rounds in a row were additive. Every round added a
mechanism that was correct in isolation and nothing was ever removed, so the motion budget crept up
until he named it. **On any round that adds motion, ask what should come OUT.** He should not have
to be the one who notices.

Related: [["More 3D" means LATCHED, not floating]] · [["Technological" means the machine shows its work]]

**Applied 2026-09-03 (round 10, same artifact `ad98ec70`).** Both panel keyframe sets became
opacity-only, .17s out / .14s in, with the script's `OUT_MS`/`IN_MS` moved to match. The depth
flight, the blur and the scale are gone; the text write-on was left untouched.

## "Cleanest" won over "most impressive" (2026-09-03)

Shown four launcher icons for the tutorial button, each built from the tech pad's parts, he
answered:

> *"display look the cleanest so choose that, now what about the intro and outro make sure our
> technological high tech theme stays intact with the animation also and i want u to make it i
> want to see it, keep it elegant and cool and gamified"*

**He picked the quietest one, and he named quietness as the reason.** The recommendation was a key
cap that sinks and latches; it is more physical and more obviously a button. He took the screen
with four thin lines instead. The candidate carrying the most going on (a micropad with four caps
and a screen) placed last without being mentioned.

**This is the same instinct as [["Norak" — two animations claiming the same moment]], eight hours
later, and it is worth reading as one rule: he wants a small number of things done well, not a
large number of things done at all.** "Gamified and cool" in the same sentence as "clean" is not a
contradiction to him — the motion is allowed to be a performance, the resting object is not.

**And the follow-up is the tell about how he reviews.** He accepted the icon and immediately asked
what it does on the way in and on the way out. A static icon is only half an answer to him;
[[2026-08-16 — "animation and 3D more with gamification on all of this segment"]] already recorded
that a correctly drawn, completely still screen reads as unfinished. Expect "what about the
entrance" on anything handed over as a still object.

Related: [["Norak" — two animations claiming the same moment]] &middot; [[Design Inspiration Sources]]

## He specifies by analogy, and the analogy is the whole spec (2026-09-03)

Asked for "the intro and outro" of the tutorial icon, I built the icon's own appearance and
disappearance. He meant the PANEL's:

> *"this is not what i mean, what i meant is the animation when u press that icon. there will be an
> intro to open the ponder panel and also outro when we press the X button right, thats what i want
> u to make, not the intro and outro of the icon bruh. like for example we have book icon for pc,
> we press the icon and the book come flying towards the screen and open up, while closing it
> trigger close book and fly back to the original position right, i also want the ponder panel to
> have animation but different kind, should be align with the technology high tech theme of course
> and its for phone only."*

**Both readings were live and the request did not separate them.** "Intro and outro" of a thing you
press can mean the button's own motion or the thing it opens. The rule that would have caught it is
already written down &mdash; present both readings rather than pick one silently &mdash; and it was
not applied. It cost a full round.

**The reusable part is how he specifies.** He does not describe motion in motion vocabulary; he
points at something already shipped and says *do that, but different kind*. The book flying out of
its slot, opening, then shutting and flying back IS the spec: an object travels from where you
pressed, and does something mechanical when it arrives. Everything else &mdash; "different kind",
"high tech", "phone only" &mdash; is the delta from that reference.

**So when he names an existing behaviour, go read that behaviour before designing.** The answer is
usually a translation of it into the new object's material, not an invention.

Related: [[2026-09-03_panel-arrival-animation]] &middot; [["Cleanest" won over "most impressive"]]

## "So that user eyes can enjoy" — he buys the watchable one, twice (2026-09-03)

> *"scan in looks cool tbh but make both intro and outro of the animation slow, not too fast so
> that user eyes can enjoy the animation then now we can move on"*

**He took the option I had argued against, for the second time in one day.** The panel entrance was
recommended as Surge on the grounds that it got a readable screen up in 130 ms and had no travel to
get tired of. He chose Scan in — the one whose write-up said *"a beam that materialises hardware is
a film idea, not a machine idea"* — and then asked for it **slower**.

Earlier the same day he took the display icon over the key cap for being *"the cleanest"*, against
a recommendation argued on physicality.

**The rule that reconciles both:** he optimises for **watchability at rest and on arrival**, not
for time-to-useful. A screen he looks at should be calm; a moment he was going to watch anyway
should be worth watching. Speed arguments do not move him on rare, deliberate transitions — and a
tutorial panel is exactly that.

**So stop pricing entrances in milliseconds-to-readable.** For anything opened rarely, the question
he is actually answering is "is this nice to watch", and the honest cost to raise is whether it will
still be nice on the hundredth time, not whether it is fast.

Related: [[2026-09-03_panel-arrival-animation]] &middot; [["Cleanest" won over "most impressive"]] &middot;
[["Norak" — two animations claiming the same moment]]

## The tutorial pad: twelve rounds, and what actually closed it (2026-09-03)

> *"its good now"*

His sign-off on the phone field terminal, after a single day that ran twelve review rounds — the
panel zoom removal, four icon candidates, an icon intro/outro that answered the wrong question,
three panel arrivals, four entrances, a pace dial, and the build.

**What the arc is worth remembering for:**

1. **Every round that converged ended in something he could press.** Not one decision came from
   prose. The rounds that cost the most were the two where I guessed what he meant instead of
   showing both readings — the icon-vs-panel misread, and Deploy's entrance being offered as
   half of a package he only wanted half of.
2. **He never once picked my recommendation.** Cap over display, Surge over Scan in, brisk over
   cinematic — he took the other one every time, and the reasons were consistent: cleaner,
   nicer to watch, slower. See [["Cleanest" won over "most impressive"]] and
   [["So that user eyes can enjoy" — he buys the watchable one, twice]].
3. **"Now we can move on" is a real boundary.** He closed the design phase explicitly and then
   said *"now u can integrate it"*. After that sentence, questions about the look are re-opening
   something he shut. The integration turned up two genuine bugs and neither needed him.
4. **The approval came on the REAL app, not the prototype.** Ten rounds of artifacts got the
   design right; *"its good now"* only arrived once it was running in KPM on his phone. Budget for
   that last step — a prototype he likes is not a thing he has approved.

Shipped as `37cbfd5` in kpm-inventory, 718/718 + 1000/1000.

Related: [[2026-09-03_panel-arrival-animation]] &middot; [[2026-09-03_tutorial-icon-candidates]] &middot;
[["Norak" — two animations claiming the same moment]]

## He will pay width for legibility on a table that already scrolls (2026-09-01)

*"take more space its okay"* — the Stock by Warehouse name column was `minmax(0,1fr)` with
`truncate`, so a narrow desk cut the part that tells two products apart. He did not ask for a
smaller font or a tooltip; he granted the width. The column is `minmax(260px,max-content)` now and
the table's own side slider pays for it.

This is the same instinct as the 2026-08-17 truncation ban: **on a screen that already has a
scrollbar, horizontal space is cheap and a cut name is not.** Ask whether the container can pay
before compressing the content.

*"i want the highlight to be clearer to see"* — the Ponder ring was a divider grey. A spotlight
shadow was tried first, did not read, and was **deleted rather than left in as a dead class**.

Source: [[../Summaries/The Camera Was Aimed at the Wrong Scroller]]

## An instrument does not follow the room's lights (2026-09-04)

*"keep it dark, ponder panel should not change with the dark or light mode"*

Asked twice before and left open both times, so the terminal shipped dark-only by default rather
than by decision. This closes it: the field terminal — the phone's tutorial shell — keeps ONE
palette in both themes, on purpose.

**The reasoning he did not have to spell out, and the reason to record it here rather than in a
backlog:** the sidebar took the OPPOSITE route on 2026-08-24, growing a pale anodised faceplate
under `html.light .kpm-rail-pod`. Both calls are his and they do not contradict each other. A
sidebar is part of the room, so it follows the room. An instrument panel is an object IN the room,
and it reads as an instrument by staying darker than everything around it — a car dashboard does
not turn white at noon.

⚠️ **The trap this closes is the "unfinished work" reading.** A dark-only component in a
themed app looks like a gap, and the next session to open `pad.css` would have found fourteen
`--pp-` tokens with no light branch and "finished" the job. It is now a locked comment above
`:root` in `src/ponder/pad.css` AND an audit check — *the field terminal keeps one palette in both
themes* — that goes red on any `.light` / `.dark` selector or `prefers-color-scheme` query in that
file. Trialled red before it was trusted.

**Second-order note for any future light branch anywhere:** it could not have reused the amber.
`--pp-lit` (#F59E0B) is a LAMP colour; its dark partner `--pp-lit-ink` (#2A1A08) measures 7,82:1 on
it, but amber as INK on a pale faceplate breaks the palette law outright — gold is never text on
light. A light terminal would have needed a second amber, i.e. a second identity.

See also [[Aldi's Design Taste]] above on Lite Mode: `html.lite-mode` is the PERFORMANCE switch and
strips motion only. It is not a theme and must never carry colour.

## The icon follows the panel, because the panels do not look alike (2026-09-04)

*"icon should be different because they have different theme and color"*

Confirming the split shipped on 2026-09-03: a display glyph on a phone, a book glyph on anything
wider. It had been my call, not his, and it is now his.

**The reason he gave is sharper than the one it was built on.** It was built on "the icon should
look like what it opens" — a functional argument. His is a visual one: the two panels do not share
a palette or a material, so one icon standing for both would be a lie about which one you are
about to see. The book is warm paper on cream; the terminal is a dark slate instrument with amber
lamps. Same feature, two faces, two glyphs.

Pinned by 'a phone opens the field terminal, anything wider opens the book, and the glyph matches'
in integration.audit.mjs, which holds all three of panel, component and glyph together.

Related: [[Aldi's Design Taste]] above, 2026-09-04 — the terminal keeps one palette in both themes.

## He will not accept a made sound, and he says so in four words (2026-09-04)

*"all bad nvm, use this for the section button click on the side"*

Seven synthesised tech takes for the field terminal, presented with waveforms, a rapid-press test
and a published review page. All seven rejected in one line, and a screen recording of the sound he
actually wanted sent in the same message. **This is the third round of the same verdict** — see
[[Sounds Come From Aldi]] for rounds 1 and 2 and the ffmpeg method that does work.

⚠️ **The gate did not save it, and that is the part worth remembering.** He had explicitly asked
for the synthesis *with* a review step — *"can u make tech sound and give me the draft so i can
review before u integrate"* — and the concern was raised to him before building. His ask was his
call and building it was right. It still cost a generator, a review page and an artifact to reach
four words. **Asking which file is not a slower path than making one; it is the only path that has
ever finished.**

**And a derived sound is not a made sound.** He did not object to the panel-opening built by
dropping his own click an octave — he parked it (*"forget the panel open for now"*), which is not
the same as bad. Transforming his material stays inside the rule; inventing beside it does not.

## He prices the feature before he prices the polish (2026-09-04)

*"most of the time phone user wont be using their volume on this app anyway"*

Said while approving the rail-key sound — accepting the work and, in the same breath, telling me
what it is worth. He is not asking for less quality; he is refusing to spend a session on the tier
below it. **Read this as a stop signal on scope, not on craft:** ship the one sound that was asked
for, and do not build the other three "while we are in here". The three silent moments were left
silent on purpose and written down as a question instead.

Source: [[Sounds Come From Aldi]]

## He wants the ask, not the account (2026-09-04)

*"stop bertele2 just tell me if i need to do something or if there is some question or input needed
by me tell it, i want direct straightforwards information, as always i want this kind of
conversation for every session"*

"Bertele-tele" is rambling. Said after a session of correct work reported at length — nothing was
wrong with the work, only with the telling. **A reply carries what he must DO and what he must
ANSWER. Nothing else.** No method, no reasoning, no near-misses, no shipped-list, no hashes.

⚠️ **The failure mode is subtle and it is not length.** A short reply that still narrates breaks
this. "One thing worth knowing", "the interesting part is", "I also found" — each is an account of
work, dressed as brevity. The account belongs in the commit message, `PROGRESS.md` and this vault,
all three of which he can open when he wants them. He said *"for every session"*, so this is
standing and does not need re-earning.

The single carve-out stays: a QUESTION gets plain wording and a worked example, because an approval
he did not understand is not an approval.

## He judges a tutorial by what it SHOWS, not by what it says (2026-09-04)

*"there is too much words but too little showing"* · *"make sure that for almost every sentence there
is some textbox to highlights and explain not just sentence reading"*

And then the correction that mattered more than either, when a false choice was put to him about how
to build the demo content:

*"show the fake content but real panel like u do on other tutorial of course, uve done this before
bruh why dont u look at other tutorial that u made"*

⚠️ **He was right and the question should never have been asked.** The pattern already existed in
four other stages; the answer was in the codebase, not in his head. **Before offering him an A-or-B
design decision, check whether this project already solved it — an option list costs him a reply and
teaches nothing.** See [[Ponder Tutorial System]] for the rule and the measurements.

His standard here is concrete rather than aesthetic: an explanation of the barcode scanner should
highlight the barcode scanner's own textbox and button. Not the panel it sits in, and not nothing.

## A shorter list beats a self-explaining one (2026-09-06)

*"i dont want the list to be greyed out, but just hide personnel that is not on regional team on
default, so that there will be less personel list when the dropdown is opened"*

The day before, he had reported the hand-off picker as broken because a name he expected was
missing from it with no explanation. The fix shipped as a greyed-out row carrying the reason —
"another branch", "already holds this store" — on the reasoning that a name which vanishes reads as
a fault. He looked at it and reversed it in one sentence.

**Both readings of his complaint were available and the wrong one was chosen.** He was not asking
*why is this name missing*; he was asking *why is this list so long that I cannot find the name I
want*. A greyed row answers the first question and makes the second one worse — it adds rows.

⚠️ **The lesson is not "he prefers hiding".** It is that a control's problem is usually the one he
names, not the one it implies. He said "less personel list" explicitly, and that phrase was already
in the sentence when the greyed-out row was proposed.

**What still had to be true after the reversal**, and he did not have to say either of these:

- **The filter has to be the one that shortens HIS list.** He is Tier 1, so every agent in the
  company is eligible for him — hiding only the ineligible would have hidden nobody from the one
  person complaining. The regional team is the filter that bites.
- **The one remaining case where hiding can still read as broken has to speak.** An empty list now
  says "Nobody in JAKARTA can receive this store" instead of showing a bare dropdown. That is the
  original complaint, cornered into the only place it can still happen.

And the phrase **"on default"** carried a second requirement he never spelled out: a default implies
something other than the default exists. Tiers 1-3 may hand a store across branches, so they get a
"Show other branches" checkbox, off by default. Without it the permission would be live at the write
and unreachable on screen. See [[UI Says Yes, Server Says No Pattern]] for the inverse fault.

Related: [[Handoff Eligibility]] · the reversal is commit `dace958` -> the one after it.

## Twice in one day, he reversed a control for being built at the wrong GRANULARITY (2026-09-06)

Two reversals, hours apart, and underneath they are the same mistake.

**One — the hand-off picker.** He reported a name missing from a list. It shipped as a greyed-out row
explaining the missing name. His answer: *"i dont want the list to be greyed out, but just hide
personnel that is not on regional team on default, so that there will be less personel list when the
dropdown is opened"*. The complaint was never *why is this name missing*, it was *why is this list so
long*. The answer was built one level too small.

**Two — the approval control.** He asked for approval power to be configurable "in the matrix". It
shipped as a branch row per TIER. His answer: *"there is so flaw in the matrix system if u build it
that way ... if u put it on each tier like this then, all the regional admin if tick, will see every
single approval for every regional location as well, where i only want this 1 account to have the
power for approval in bandung only"*. The answer was built one level too big.

⚠️ **The check that would have caught both, and takes one minute: name the exact set of people or
rows the control produces, on his real company, and read it back against his sentence.** For the
picker that is "every agent in the company, because he is Tier 1 and everyone is eligible for him" —
which visibly fails "less personel list". For the matrix that is "every T4 everywhere" — which
visibly fails "this 1 account ... in bandung only". Neither needed him to look at a screen.

**He also says the word.** "less personel list" was in the sentence before the greyed row was
proposed. "this 1 account" was in the sentence that killed the tier matrix. When he names a
quantity — one account, a shorter list, four regions not two — that quantity IS the specification,
and a design that cannot produce exactly it is the wrong design however reasonable it reads.

Related: [[Handoff Eligibility]] · [[Anti-Recurrence Check]]

## The glass number is not fixed — it moves when the ground behind it does (2026-09-13)

> *"i want u to make the side panel to be less transparant because on some bright space the name
> and logo cant be seen"*

He chose 0.02 himself on a slider on 2026-08-14 (*"as transparan like apple liquid glass theme
uknow"*). A month later, with a bright page region behind the capsule, the same eye reversed it —
the dark rail's tint went to .42/.58, still a gradient over transparent with the blur on. This is
the SAME complaint he made about light mode on 2026-08-16 (*"on the light background the text on
the sidebar almost invisible"*), which produced the anodized plate. The rule that survives both:
**he tunes transparency by looking at what is BEHIND it, never by the number**, so a glass value
is only ever right for the grounds he has seen it over. Guarded as a band, not a number
(`logicFixes.selfcheck.mjs`, THE DARK RAIL IS GLASS YOU CAN READ THROUGH). Repo `2771374`.

Same session, two smaller calls on the customer form, both his words:

> *"gps example number should be more transparant here sc4 it is too visible that i think it is
> already filled"*

An italic example was not enough — he reads the mono face as "typed" until it is also faint.
`placeholder:italic placeholder:opacity-50`. And on the browser's own *"Please fill out this
field."* bubble appearing where the app's strip should have: he listed it as a finding, so the
form got `noValidate` and its refusals speak in the app's voice. He expects ONE reporting channel.

Related: [[Lift the Dialog, Never Push the Rest Down]] · [[Silent Failure Disease]]

Round two, forty minutes later, over a near-white receipt: *"reduce the transparancy more still
not visible in very bright space"* → `.66/.78` (`3af7685`). Two rounds in one evening on the same
number: he does not name a value, he names the ground it failed on, and expects the next step to
be visibly bigger than the last. The band guard caps at .8; past that it is solid, and that is a
different material he has not asked for.

Round three, the same evening: *"the visibility is still not maximal, the goal is making the logo
clearer u can reduce the transparancy even more or make the logo clearer"*. He named the GOAL and
handed over the lever. The answer was both levers — glass to .80/.90 and the resting mark ink from
#6b5845 to #b39c7d (7,14:1) — and the second one was the one that mattered: the marks had been
2,78:1 on the plate since the rail was built, and `contrast.selfcheck.mjs` had been saying so as a
`note` for three weeks, waiting for exactly this sentence. When he says "still not visible" twice,
stop turning the dial he pointed at and look for the number a check already flagged. `7ea096e`.

His verdict on round three, 19:34: *"look very nice now u may move on"*. Closed at `7ea096e`:
glass .80/.90, resting marks #b39c7d.

## A decision comes as a picture, never as a sentence (2026-09-14)

Asked to choose between three layouts for the Restock Vault tab strip on a phone, written as a
table of class names and trade-offs, he did not choose. His words: *"if u want me to decide then
give me ilustration or image or anything to show me what is the recommended changes instead of
telling me with your technical AI sentence that i wont understand keep this work method in mind
when working with me"*. And the goal, so it never needs re-asking: *"we need all the panel whatever
the method is, i just want to make sure that all the features is available on the phone as good as
pc uses"*.

**What this settles.** A 🔴 DECIDE on a screen is delivered as one image: the screen as it is today
and each option rendered at the real width, side by side, the recommended one marked, one plain
sentence under each. The reply text carries only the question. Same instinct as *"seeing it beats
reasoning about it"* (2026-08-27, the tutorial chip) and *"live and playable beats a picture"* — he
judges with his eyes, so the options must be things he can look at.

**How it is made.** `tools/ponder-lab.jsx` takes `?css=<rules>` and injects them after the app's
own stylesheet, so a proposed layout renders in the real component without touching it. A scratch
HTML with one 375×812 `<iframe>` per option, rendered by headless Chrome at a wide window, is the
composite — see [[Looking at the App]]. The first one: `tabs-options.png`, 2026-09-14 19:15.

**He chose the next morning, 2026-09-15 07:40, from the re-sent picture, in five words:** *"A is
good and do 1"* — A = the two extra tabs drop to a second row (the wrap, same instinct as the top
bar the day before), 1 = one screen at a time, salesmen's screens first. Shipped as `096ac05`
within twelve minutes of the answer. **What the picture did not know:** it was rendered in the
bare lab where the desk is 325 px; inside the real app shell the desk is 271 px, so on his phone
the same fix lands as THREE tab rows, not two. The next picture (`rv-findings.png`) rendered the
desk inside the real wrappers and put the frame-cut option beside it — the lesson is in
[[Looking at the App]]: a proposal frame must carry the real wrappers, or the approved picture and
the shipped screen differ. Open at the time of writing: whether to cut the phone frame (shell
`p-6` → `p-2`, panel `p-4` → `p-2`, border 4 → 2, phones only), and the words for the hint
line that says *"Cari barang di kiri"* on a phone where the list is above.

## Hints go, reports stay — the tutorial owns the explaining (2026-09-15)

Shown the Restock Vault at 375 inside the real shell (`rv-findings.png`: today / cut the frame /
Data Induk / the cut hint line) and asked YES/NO on the frame and a letter for the hint's words,
he answered both at once, in one sentence:

> *"just make the panel bigger so that more words and panel fit inside the phone because there is
> so little space, since we have the ponder tools we dont need any hints panel i guess"*

**Two rules in one line.**

1. **Space on the phone is for words and panels, not for frame.** He did not weigh the border he
   would lose; he named what the space is FOR. The shell's `p-6` became `p-2 lg:p-6` — every
   screen, not just this one — and the panel `border-2 lg:border-4 p-2 lg:p-4`. Desk 271 → 323
   px. The PC keeps every number. Same instinct as *"he removes information to make what is left
   bigger"* (2026-08-16) and the 2026-09-01 phone complaint *"too much going on vertically in
   that small space"*.
2. **An explanatory hint is not wanted anywhere the tutorial reaches.** *"since we have the
   ponder tools we dont need any hints panel"* — the empty-cart line under the form and the Data
   Induk intro paragraph were deleted, not reworded. **The line that survives is a REPORT:**
   *"→ Belum lengkap: Asal, Tujuan"* is the form saying what is still missing, and it stays
   (law 2, every action must report). The test for any line of copy on a screen from now on:
   does it tell him what the screen just did or still needs (keep), or how the screen works
   (delete — the book does that)?

**What this cost that he did not price, said in the reply:** the frame cut is shell-wide, so the
other fifteen screens changed on the phone before they were swept. That is the sweep's purpose,
but each one must now be measured after the cut, not from an older frame.

**A guard caught a draft that broke his own earlier rule.** The first pass let the completeness
report wrap on the phone; audit G60 (2026-09-01) pins that footer to ONE line because it is
pinned at the bottom of the phone and his condition for anything pinned is that it collapses to
one line. Two of his rules met on one element and the check, not memory, settled it.

### The next two picks, 08:50 the same morning — and one against the picture's advice

Shown `rv-notice.png` (message A dashed / B left rule; buttons A one row / B button + link,
B recommended because A's words wrap), he answered *"message = A and button= A"*. **He chose the
button row whose words wrap, having seen them wrap.** Read it as: one row of two equal buttons
beat one button and a link, even at the cost of a two-line label — the pair reads as one choice.
Do not "fix" the wrap into option B later; he priced it.

His words on the empty-table box, which shaped message A: *"different animation and color to
shows that this is a warning or notification on not actually belong to the real panel just
something the user need to do to in some certain situation"*. A NOTICE is: dashed edge (not part
of the panel), amber ink and edge (never a fill), a small label naming what to do, a fade-in and
a slow breathing edge (motion says "alive, waiting on you"; Lite Mode strips both). Reuse this
exact look for the next empty state that asks for an action, and nothing else.

## The phone's pull-tab rests a quarter of the way down, not in the middle (2026-09-16)

His ask, unprompted, after a day on the phone: *"make the sidebar button on the right side phone
to be 25% from upper right as default location instead of just 50% between upper and bottom right
side"*. Shipped as `c5c7ed3` (kpm-inventory): the ribbon's DEFAULT centre sits at 25 % of the
screen height; a spot he drags to still wins and is remembered. Read it with his 2026-08-12 line
(*"our thumb usually position differently when using phone right"*): on his phone the resting
thumb is HIGH on the right edge, not at the vertical middle. Anything else that wants to be under
the thumb on a phone — a floating action, a drag handle — starts from that same quarter mark
before it asks him.

Confirmed the same evening with the nota scanner: *"test 1 approve, nota looks align and good,
test 2 looks great as well"* — the squared, levelled scan of a photo taken at an angle is what he
meant by *"square and 2D like in plain paper"*; no further polish was asked for.

## Denser and bigger at once: he picks the smaller picture to get the bigger button (2026-09-17)

Shown two boards of the Sales Terminal at a measured 375 (`st-wares.png`: TODAY / A / B;
`st-sheet.png`: TODAY / AFTER), A recommended because it kept the row height and the 96 px
picture, he chose the other one:

> *"just change into B because it fit well and doesnt take a lot of space and bigger button as
> well users need it, manifest also looks better since there is more space to press and read yes"*

**Three things in one sentence.** (1) *"doesnt take a lot of space"* — a shorter row wins over a
kept picture; he is optimising wares-per-screen for a salesman scrolling all day, the same instinct
as *"too much going on vertically in that small space"* (2026-09-01) and *"space on the phone is for
words and panels"* (2026-09-15). (2) *"bigger button as well users need it"* — he names the USER,
not himself; the 44 px rule is now his, stated unprompted. (3) *"more space to press and read"* —
press AND read: a 44 px control is worth it to him for the reading room as much as the target.
He did not mention the one cost A's caption carried (B's longer names still wrap) — a two-line name
is not a price he counts. Shipped as kpm `4ba6563`.

**Same reply, the vault gate.** *"the password press still took some time to submit and react,
well if u can make it faster then please do and if u cant then add some waiting animation on the
button to show that it is working and wait for process so that we as users know and willing to
wait"* — his own statement of law 2 (every action reports), with the priority order: speed first,
and if speed is out of reach, an honest wait. Both were shipped (`dfc2392`): the read the press
waited on now starts while he types, and the button says CHECKING for whatever is left. His
incognito test of `af4d5e2` passed the same message: *"there is no access denied panel, it give me
straigh to the master vault panel instead which is good"*.

## The lookup comes before the form, and a list is sorted before it is styled (2026-09-17, 10:00)

Three Customers boards at 375 (form folds behind a button / every box 44 / folder rows + tighter
shop cards) and one question (skip the four folder levels for a T5?). His answer, one sentence:

> *"yes to all but on the customer directory i want the customer name to be alphabetically in order so that its easier to find them, for the question that u ask i think just let it be like that do not need to change anything"*

Read it as three rules. (1) He takes every density and size fix without weighing them — the sweep's
44 px rule and "space for words and panels" are settled taste now, not decisions. (2) **He adds
the thing the boards did not offer: order in the list.** A prettier card is worth less to him than
knowing where a name will be — *"easier to find them"* is the whole reason. Any list he will scan
by name should be A→Z before it is restyled. (3) He leaves structure alone when it is somebody
else's tool: the folder tree is the boss's organiser and he did not want it flattened for the
salesman — *"just let it be like that"*. Structure changes need his ask; surface changes do not.

Ten minutes later, unprompted, on the same form: *"i want the textbox background to be dark when use darkmode and light when use light mode because right now it is white inside dark mode and it is too bright bro"*. A white input on a dark card is a defect to
him, not a style — the same eye that caught the emerald setup screen and the blue OTP. Every box
takes a surface token from now on; a bare input is a bug waiting for dark mode.

## A frame he has seen becomes a word he can use (2026-09-18, 09:30)

Two Agent Inventory boards at 375 (`board1.png`: TODAY / AFTER — one scroll, 44 px toggle, names in
full; `board2.png`: the Projected Value box AFTER BOARD 1 / A three columns / B folded, B
recommended). His answer:

> *"board 1 yes, board 2 B that shows "afterboard 1" when pressed, btw what is the test customer u mean?"*

Three things. (1) The density-and-size board is taken whole again — the third screen in a row
("yes to all" on Customers, "B … bigger button as well users need it" on the terminal). The 44 px
rule, one scroller, and wrapping names are no longer decisions; stop asking, ship them inside the
first board. (2) **He chose the FOLD over the always-visible columns**, the same pattern he approved
for the Customers form: a block a salesman reads once a day may hide behind one 44 px tap so the
thing he reads all day (the van, Cash) moves up. Recommendation followed. (3) **He specified the
open state by pointing at a frame** — *"that shows 'afterboard 1' when pressed"* is the first frame
of board 2, the three stacked rows. He did not describe it; he named the picture. Every frame sent
is a word he can answer with, so label frames with short stable names and keep them on screen in
the reply he answers from.

And the tail — *"btw what is the test customer u mean?"* — is a miss on my side, not his: the
✅ TEST line said "Customers (`a9822ff`) on your phone" with no checklist, and a hash is not a test
he can run. Every ✅ TEST carries its plain-word checklist in the reply itself, the same words
PROGRESS.md keeps under WAITING ON ALDI. Lesson written 2026-09-18.

## "Static and too simple" — he asks for material and motion, not for colour (2026-09-18, 10:40)

After confirming two phone screens (*"T1 approve, t2 approve"*) he sent three asks in one breath:

> *"i still dont like the formatting on the customer because the color and the UI is just look so
> static and too simple but the logic between pressable is working great i want u to redesign this
> panel i guess especially for the color and add some small animation on the folder or lighting or
> button and i dont really like that the customer segment is not fixed and locked on phone that i can
> swipe it right and left. and another thing is that i want u to redesign the quarantine quantity on
> the agent inventory number box and make it more animation HD and good as well"*

and, on the four boards: *"board 3 = B, board 4 =B, 5 = B, 6 = B make sure that the animation is
clear and HD and smooth ,just to let u now that sideways swipe is inconvenience for phone so make sure
that most of the segment doesnt have that"*.

**What it settles.** (1) He says "color" and means *life*: the Customers screen had the right tokens
and no material — plain cards, no response to touch, nothing arriving. The fix that satisfied the
"color" complaint added no hue at all: a top light, a bezel, a proud edge, a lamp, a sweep. When he
says a screen looks "static and too simple", check whether it ever joined [[The KPM Control System]]
before reaching for a palette. (2) **He took the more physical option four times out of four** —
key caps that stand proud and sink, the LED with a lamp — against a recommendation for the quieter
hazard tag. Read with "lowkey 3D stays" and "more 3D means latched": on a screen he presses, depth
that answers the press is not noise to him. (3) *"Clear and HD and smooth"* is his motion brief:
crisp tabular digits, transform/opacity only, one motion per moment — not more motion. (4) **A
sideways swipe on the phone is a defect class, not a per-screen taste** — his sentence generalised
it, so it became a guard (the SIDEWAYS RATCHET), not a note.

**And one cost he did not see:** the boards were drawn with shadows and a glow; the app's own audit
(nothing in the control system may depend on a shadow — his 2026-08-15 Lite Mode rule) turned them
into borders and gradient layers before shipping (kpm `832ea7c`). The shape he chose is what shipped; the
glow behind the LED digits is not. Told in one line, not hidden.


## He takes the taller row to get the whole product name (2026-09-18)

EOD Setoran on the phone, two boards. Board 1 (the card deck as tall as the card on top, blank
card backs peeking): *"board 1 yes"*. Board 2, the count rows — A was recommended (one line per
product, name wraps beside a 64 × 44 box, rows 52 px) and B was the taller alternative (name on
its own line, a 96 × 44 box under it on the right, rows 75 px): *"board 2 B because it have more
space for long product name"*.

**What it settles, read with 2026-09-17:** the day before he took the SMALLER product picture to
get the BIGGER button; today he took the TALLER row to get the WHOLE name. The constant is not
"compact" and not "big" — it is that the thing the salesman must READ or PRESS gets the room,
and everything decorative pays for it. A recommendation that optimises for a shorter card loses
to one that optimises for the line he has to act on. Next time a board trades card height
against name legibility or target size, recommend the legible one and say what it costs in
scroll — do not recommend the compact one and let him correct it.

Rendered and measured, not described: both boards through `?look=` entries at a pinned 375,
TODAY beside each option, one PNG. He answered in one line. kpm `84e102f`.


## Rare tools fold, DEL/EDIT hide behind a ⋯, and a hold must not repeat the pad's lamp (2026-09-18)

Customers round two, three boards, his answer in one line: *"Board 1 = A, Board 2 and 3 also A"* —
the recommended option each time. What the three say together:

- **A monthly action pays no rent on a daily screen.** The boss's Find Duplicates / Data Scrub /
  Import Map fold behind one ADMIN TOOLS row on the phone; he did not want them as tiles even at
  44 px. Pair with 2026-08-16 *"he removes information to make what is left bigger"*.
- **A destructive control is hidden, not shrunk.** DEL / EDIT on every row become one ⋯ key and a
  strip that unfolds under the row — his own words were *"hide delete and edit button somewhere
  with some animation just to make things little bit clearer and spacey"*. The fold IS the
  animation he asked for; a hover-reveal or a swipe would not have been (sideways is banned).
- **Motion vocabulary must not repeat across instruments.** The folder icon's lamp lighting amber
  under the thumb was the ponder pad's signal, and he read the copy as *"repetitive because it have
  similar animation like the ponder panel, try make the animation little bit different and unique
  but stay smooth and on theme"*. The row now draws an amber charge line along its bottom edge
  while held and the lamp stays black. Rule to carry: before reusing a signal from one instrument
  on another, ask whether he will see both in one session — if yes, it needs its own move.

He felt board 3 on his phone through the lab (`--host`) before answering; the stills could not
show the motion and said so. kpm `5d7a9d0`.

## "Too much red" and "too compact" — he refuses a floor that is only sizes (2026-09-18, 19:00)

Four Stock Opname boards at 375 (the salesman's count card TODAY/AFTER, the damage reel A/B, the
boss's four tabs A/B, the boss's audit list TODAY/AFTER). His answer, one line:

> *"A for expired panel, A for supply telemetry, for the HQ audit i still dont like the
> presentation, all the data is good for just looks bad for the presentation i feels that it is
> too compact in a small space, and for the warehouse opname i dont like the presentation because
> there is too much red and not really have any animation or effect"*

What it settles. (1) **He names a control by the word on its face**, not by the board number:
"expired panel" = the kinds-of-damage reel (EXPIRED was the face in the frame), "supply
telemetry" = the boss's tab strip (the title above it). Frames must carry a readable word he can
point at. (2) **A board that only fixes sizes is not a design he will say YES to when the screen
looks wrong** — the count card's AFTER had every label at 11 and every key at 44 and he refused it
for its colour and its stillness. Sizes are the floor, not the proposal; ship them without asking
(done, kpm f72ef35) and board the LOOK. (3) "too much red" — on the first miscount the card
edge, the bar, DIFFERENCE, the recount box, the CLEAR key and the damaged line all went red at
once. Read with 2026-08-21 ("use amber for little things", the verdict is an edge): red is for a
problem that is SURE; a request to count again is amber. (4) "not really have any animation or
effect" — the third screen where "static" is the complaint (Customers 2026-09-18 10:40); a card
he types into must still belong to the control system (top light, LED digits, a fold). (5) "too
compact in a small space" — the boss's audit item packed name + SYS -> FND + difference on one
line; the thing to READ gets the room (2026-09-18, EOD board 2 B).

## "Standardize effect" — one number instrument, and he brought the reference himself (2026-09-18, 19:25)

Boards 5 and 6 (the count card look, the audit item look), his answer with a 2.8 s screen
recording attached — a pricing card whose digits roll vertically one place at a time, the left
digits settling first and the right ones lagging:

> *"board 5 = A but i want u to redesign the difference, it looks bad and standardize effect, too
> much of that type, for item count board 6 i like A but make the difference number a little bit
> bigger and put some animation on the number as well, what if u make the counter to be like this
> animation look on the attachment that i send u and make it like nixie tube a like so its analog
> but animated must look kinda cool i think"*

What it settles. (1) **He rejects a SECOND kind of the same effect.** The LED window (Agent
Inventory's Quarantine count, his B on 2026-09-18 10:40) placed on the count card's DIFFERENCE
was "one more of that type" — the app should have ONE animated-number instrument, not a family.
(2) **He specifies by reference, and the reference is the motion, not the look** — the clip is a
plain white price; the LOOK he wants is his own word, "nixie tube": analog, warm, glowing digits
in glass. Take the motion from the clip and the material from the word. (3) The DIFFERENCE is the
verdict, so it is bigger than the figures it is computed from ("a little bit bigger", both
screens). (4) Build one instrument and use it everywhere a figure changes; ask before swapping the
instrument he already approved (the LED), never assume "standardize" reaches it.

## "Too much of those blinking light" — the offending effect was the LAMP, not the number (2026-09-18, 21:30)

Shown the nixie counter live on his phone, he took it in four words and then corrected what
"standardize" had meant:

> *"okay nixie looks fine, standardise here because that effect is also use in the ponder panel
> before as i remember, im talking about the blinking dot light and we also use that on the
> customer profile as well, too much of those blinking light"*

What it settles. (1) The thing he had counted as "too much of that type" was the small BLINKING
DOT (the LED's red lamp, the pending pill on Customers, the finance ping) — a family of looping
lights across screens, not the number effect. Read his complaints about repetition at the level
of the SIGNAL, not the component: two instruments that pulse the same way are one signal repeated,
whatever they are attached to. (2) A loop that never stops reads as noise to him after an hour;
the pad's lamps, which only light on a press or an arrival, he remembers as blinking — so any
light that pulses forever will be counted against the app. (3) The rule to propose from this:
a light blinks only while something is happening right now.

## The nixie face, round two — "not clear" is a font, and "creative" means the same instrument (2026-09-18, 22:10)

> *"change the fonts for the nixie tube because it is not clear, and also fix the light mode
> nixie tube it is unclear as well, and just erase the dot light and use another creative design
> bruv"*

What it settles. (1) A mono digit at 20 px inside a narrow tube with a ghost "8" behind it is a
smudge to him; the fix was the app's own condensed display face and no ghost - realism that costs
legibility loses. (2) A theme token on a black instrument is a trap: light mode's amber is a
dark brown, and the counter vanished. Instruments carry a FIXED ink (--nixie-ink, like the old
--led-ink). (3) "Another creative design" for the LED did not mean a new invention - it meant
the instrument he had just approved. The LED window and every looping dot (its lamp, the
Customers pending pill, the finance ping) are gone; the two dots that report a live state stay.
kpm bcb08c4.

## He picks the fold twice, and files a tile watermark as an app bug (2026-09-19, 02:30)

Three Journey Plan boards at 375 (the top card A floor / B fold; the store card A floor / B ⋯
fold; the path row + sector reel YES/NO), B recommended on both. His answer in one line:

> *"board 1 = B, board 2 = B, board 3 yes, btw fix the map because it said api key needed or
> something"*

What it settles. (1) **The fold is now his default for anything not pressed every minute** — the
MISSION FEED pickers and the store card's reorder/assign tools both went behind a tap, the third
and fourth folds he has chosen on the sweep (PROJECTED VALUE 2026-09-18 09:38, ADMIN TOOLS + DEL /
EDIT 2026-09-18 16:26). The cost stated on board 2 (moving a store in the route is one tap
further) did not move him. (2) **He reads the frames as the app, not as a mock.** "API KEY
REQUIRED" was CARTO's tile watermark showing through the lab's real map, and he filed it as a
thing to fix — rightly, it was live on his phone and on the War Room too. A board frame that
shows a defect he did not ask about is a bug report he will make; either fix it before the board
or say in the caption that it is not the screen's. (3) **"btw" carries a real job.** The map ask
was an afterthought clause and it was the only change that touched two screens. Read the tail of
his sentence as carefully as the letters.

Shipped kpm `056d8e3`. Measured 375 both tiers + 1280, the SHIPPED board sent.

## "So many buttons" — a shipped card is not a finished card, and critical keeps its light (2026-09-19, 02:55)

Twenty minutes after choosing B for the Journey Plan store card and seeing it shipped at 317 px
(strip, name + ⋯, status pill, address, ENGAGE TARGET, RADAR / NAVIGATE / LOG, the ↑ ↓ + assign
fold), he sent:

> *"i think i want u to redesign the store card, and make it compact as well so that it doesnt take
> so much space because there is so many buttons there but of course make sure that stores with
> critical alert are still showing critical animation or lighting on its each store card, after this
> prepare for notes and prompt we continue tomorrow"*

What it settles. (1) **A board he approved is a floor he can still refuse once it is real** — the
same shape as the Stock Opname count card (2026-09-18 19:00: sizes fixed, look refused). The B
frame kept every button the desk had; seeing six keys per card on a phone, he counted them. **Next
time a card carries more than three keys on the phone, board the compact version FIRST**, before
he has to ask. (2) **"So many buttons" names the cause, not the height** — the fix he wants is
fewer visible actions (the everyday ones stay, the rest fold), not smaller ones; his 44 px rule
stands. (3) **"Critical animation or lighting" is a requested exception to "too much of those
blinking light" (2026-09-18)** — an overdue store is a state that must be SEEN on its card. Read
with the rule that closed the blinking lights (*a light blinks only while something is happening
right now*): the answer is a steady critical light or a breath, an instrument of the control
system, not the `animate-pulse` pill the card has today. (4) **He closes the day with the ask in
hand** — *"prepare for notes and prompt we continue tomorrow"* — so the notes carry his sentence
verbatim and the boards are the first thing tomorrow, before any code.

## "board 1 = C … LED cyberpunk style … what is radar button actually?" — density wins, an instrument may glow, a metaphor is not a label (2026-09-19, 07:05)

On the store card boards (compact A / B / C beside TODAY; the critical light TODAY / LAMP / LAMP + EDGE),
with A and LAMP + EDGE recommended, he wrote:

> *"board 1 = C, board 2 lamp edge but make it LED cyberpunk style, usually engage target and navigate,
> what is radar button actually?"*

Shipped as kpm `0743a17`. What it settles. (1) **He picks the SHORTEST card over the recommended
middle one** — C keeps only the name, one status line and the two everyday keys (144 px, was 343); the
strip, the address and every other key go behind the ⋯. On the phone, density beats information on
the face of a card; the ⋯ is where information lives. Same shape as *"just make the panel bigger"*
(2026-09-15) and *"so many buttons"* (02:55 today). (2) **"LED cyberpunk style" names the instrument
vocabulary he wants for a state light**: a diode with a halo and neon mono words, hotter than the
palette's brick red — an instrument light is exempt from the room's palette, like `--led-ink`
(2026-09-04) and the nixie ink. The muted lamp on the LAMP board was not enough; the glow IS the
point. Still no blink: the edge breathes (3.2 s), the diode is steady. (3) **A metaphor is not a
label**: RADAR had been on the card for months and he did not know what it did. The fold now says
SHOW ON MAP and LOG A VISIT; the desk still says Radar / Log until he asks. When he asks "what is X
actually?" about a button, the button's name has already failed. (4) **"usually engage target and
navigate"** confirms the everyday-key assumption — a compact card is decided by which keys a
salesman presses daily, not by pixels; ask that question with the board, every time.

## The folder day — hold is a preview, tap is the commit, and a tap must show itself (2026-09-19, 08:05 → 13:00)

One video (three folder cards, a lid that opens on hover) and nine messages in five hours, all on the same
control, all shipped the same day and confirmed at 13:00 with *"test approve u may move on"*. His words in order:

> *"change the folder design make it more alive like this video, i want u to make the customer folder like this also"* ·
> *"B for both"* · *"add hold effect on the folder, just like the video … we have hold mechanic as well on the side
> panel"* · *"the folder animation is upside down bruh, folder should be expand when hold and on default it should
> shrink … put file animation on inside the folder that move up a little when expand and going back inside when
> shrink"* · *"when hold folder should not click it will just animate bro, click to enter not hold. and paper is not
> sliding out here"* · *"the file and the paper little bit off, revert it to before its better"* · *"animation on the
> holding opening looks bad … especially on the LED light on the bottom … when i only press and not hold … the button
> will just skip the animation and go directly inside"* · *"can the transition be smoother when entering inside the
> folder and not just snapped? … just like some a hundread grand worth of APP"* · *"ok continue"*

What it settles. (1) **HOLD IS A PREVIEW, TAP IS THE COMMIT.** A hold shows what a control would do and never
does it; a tap does it — and the tap must SHOW its press first (the lid lifts, then it enters). This is now the
interaction law for any card that opens something (`components/FolderCard.jsx`). (2) **He reasons about motion
physically.** "Upside down", "the paper is not sliding out", "revert it, the paper inside was better" — a folder, a
pocket, a sheet; if the model is wrong he sees it at once, and a version that broke the model (the sheet past the
lid's edge) was sent back within minutes. Design motion from an object, not from an easing. (3) **No snaps
anywhere on the path.** Enter = the neighbours step back, the tapped one opens, the next level rises in one item
after another (40 ms stagger, 320 ms, ease-out). "A hundred grand worth of app" means exactly this: nothing
appears or disappears in one frame. (4) **For MOTION he corrects the shipped thing, not a board.** Six rounds of
"a bit off / revert / not natural" in two hours, each a one-line change — a still cannot show a hold. Ship the
motion small, then adjust to his words; keep boards for layout. (5) **"LED light on the bottom"** was the pale
resting sliver of the paper on a narrow folder — a light-coloured strip under a lid reads as a lamp to him; on
narrow cards keep the pocket shut at rest.

## Sampling — B, the folder everywhere (2026-09-19 19:52)
*"B is better, use that instead"* — one message on three boards (the year page, the date + place levels, the
items). What it confirms: once a control exists (the FolderCard), every list of the same kind wears it; the flat
card lost the moment the real folder stood beside it, he did not weigh A. Two things the boards taught: measure a
phone screen as the tier with the MOST keys (the boss's second gold key ran off the phone where T5 looked fine),
and a table does not fit a phone row that also holds two keys (a one-line table cut "Cello Green 16" to "Cello
Gr…") — rows won. Board B was the shipped component rendered in the lab, not a CSS drawing; that is why the
decision took one message. Shipped as kpm `d7f2193`.

## Journey Plan — A, the strip (2026-09-20 01:15)
*"A looks best"* between A (the map a 160 px strip with the pins still visible, the feed one line) and B (the map folded
away into a MAP card under the hub). He kept the glance at the map over the most compact page: context he can use at a
look stays on the first screen; what he cuts is the space that earns nothing (the +/- keys, the legend, the three
tool keys on a strip, a 124 px feed card for one line of status). "Not taking that much space if not needed" means
shrink, not hide. The scroll bug he named ("scrolling causing the map to move instead of sliding the page down") was a
touch-action none on the map box; the fix is the native one (drag off until full screen), no plugin. Shipped as kpm
`73d9eb9`.

## EOD HQ Verification — B, and what "tech game spices" meant (2026-09-20 02:50)
*"B is better but i want the confirmation for cukai and cash to be one panel per person make sure animation and
smoothness for the graphic and colour suit our theme both dark and light mode and add some tech game spices in there
as well."* Three rules in one line. (1) **The unit of his work is the person, not the record** — two reports from one
salesman are one night; he verifies a night. (2) **Both themes are the deliverable** — a design is checked in light
before it ships, not assumed from the tokens. (3) **"Tech game spices" = the kit the app already owns, used sparingly:**
the nixie for the big number, HUD corner brackets on a sheet, a scan line and a stamp on the commit, a diode that only
lights for a problem. Not new colours, not shadows — the palette law and G30 held, and the audit refused --gold as the
seal's text (the readable token instead). Shipped as kpm `64f6505`.

## The player card — the person as the unit, the profile as the face, per-part approval for money (2026-09-20 03:55 → 05:35)
Three hours after the folders + docket shipped (`64f6505`) he redesigned the same screen: *"actually i want u to
redesign this, maybe it is better when we made approve and reject for every single EOD, so one for each, cash,
transfer, pita cukai, bounties for havent paid penalty,etc and instead of folder form i want u to make it into 3D card
that looks like this video, the front card is for the statistic and agent profile picture of the users and second side
of the card is for statistic on the EOD like pita cukai, transfer, cash etc … for example 3/8 stores are Closing deal
… i want u to act like CEO and sales persona at the same time and give me your critique and recommendations on my
idea, looks kinda fun and satisfying to see as well right?"* His answers to the four questions, 04:15: *"per item reject
and approve looks okay, since sales will bring few kind of items, the three front number maybe we can put the EXP gain
statistic animation on the agent EOD panel after approval,and stores closing ?/? is also important revenue should be
on the second screen with all product performance and the EOD statistic. the picture should be the same with the
agent profile picture inside agent profile"*. On v1 of the mock, 04:55: *"i dont know whats the point of this so erase
that, and btw change the effect with this instead, i think it will fit the card beter and add PLUS on the increase in
EXP and also the Recent rank and the progression from the agent profile"* — the TONIGHT nixie block erased, the pixel
dissolve of his first clip replaced by his second clip (a card that grows open under its photo, the body blurring in).
On v2, 05:35: *"looks good for v2 lets use that"*.

What it teaches. (1) **A shipped screen is not a finished screen when its UNIT was wrong** — a night as one sheet
verified by one plate was the reflex he refused for money; each part of the handover is its own yes or no, and the
data model had to follow (per-part `verified` / `rejected`, [[EOD Per-Part Verification]]). (2) **The profile is the
face; other screens borrow it, never redraw it** — "the same with the agent profile picture": the rank frame, the
rank + title, the XP and the bar came from the profile's own code (`rankLadder` lifted so both climb one ladder).
(3) **He swaps an effect by sending a clip, not by describing one** — the first clip's dissolve was named, the second
clip's grow-open replaced it in one message; build the mock so the effect can be swapped without rebuilding the card.
(4) **A number without its delta is unfinished** — "add PLUS on the increase in EXP"; the same rule as the nixie's
signed difference. (5) **A block he cannot explain is erased on sight** — "i dont know whats the point of this so erase
that": every figure on a card must answer a question he would ask. Shipped as kpm `a401463` (stage A); the card is
[[The Player Card]].

## Stage B — "i like all the recommended option" (2026-09-21, 08:35)
Two boards in one message (the head on his Agent Profile: A the hero + OMSET box gone / B the box kept; the XP gain
on the salesman's EOD panel: A the ladder bar / B the working rows after the nixie's roll / C the 5.614 → 5.665
figure), each with the recommended one marked and its cost stated. His whole answer: *"i like all the recommended
option"*. Read with [[A decision comes as a picture, never as a sentence]]: when the frames are real renders at a
measured 375 with TODAY beside them, the recommendation carries — he decided both boards in six words, thirty-five
minutes after they were sent, without a question. The cost lines did their job: A removed a block of his own (the
OMSET box) and he took it, because the caption said what the head already carries. Shipped as kpm `c31af5e`.

## The desk — the face is not shrunk for room, and the phone is his standing condition (2026-09-22, 09:38)
Two boards from his three PC screenshots (*"u need to redesign the agent inventory especailly for the modal here because its
collapsing with other box sc1, sc3 is the review card that u ask this box is little bit to long vertically when open on the pc
so that i need to slide up and down just to see the whole box opened i want u to shortened it"*). His answer: *"board 1 = A
but make the Profile picture bigger as big as B minimum, board 2 = A looks better but make sure that all the boards looks good
on phone too"*. Three things. (1) **He took the recommended layout and refused its one cost he could see** — the 72 px photo.
The face is the identity of the card ([[The Player Card]]: "the profile is the face"); room is found elsewhere, never by
shrinking the person. (2) **On the strip he picked the plain fix over the redesign** (A: the laptop layout on the desk, B: one
panel like PROJECTED VALUE) — *"A looks better"* — the second time he keeps the existing look when the fix is only layout
(see "He keeps the default surprisingly often"). (3) **"looks good on phone too" is now a standing condition on every desk
change**, not a question to ask: a desk fix is measured at 375 before and after, and the SHIPPED board carries the phone frame.
Shipped as kpm `20aac21`.

## A plate among plain figures refuses an instrument — "let the format be the same with other text beside it" (2026-09-22, 15:05)

> *"tbh nixie tube doesnt look natural compared to other number box right there maybe we should change into other design
> for that, we need something that is little bit special and not standardised i have no inspiration for now"*
> — then, to three plate-family verdicts (a stamp, an engraved well, a handwritten figure):
> *"i dont like your design on the differences, just make it on red color with some animation on negative and also
> specific animation on positive but just let the format be the same with other text beside it"*

What it settles. (1) **"Special and not standardised" did not mean a new object.** Two boards of objects lost; the
answer was the SIBLINGS' own figure with the state carried by colour and one motion — special by behaviour, standard by
format. Next time a figure sits in a row of plain figures, the first board is "same format + colour + one-shot
motion", not a new material. (2) **"Some animation on negative and a specific animation on positive"** = two different
one-shot motions that MEAN the sign (a shortfall drops, a surplus rises), never a loop — his "too much of those
blinking light" still holds. (3) The nixie is not refused as an instrument; it is refused *beside plain figures*. Where
it stands alone (the EOD folder total, the Agent Inventory window) it stays. Shipped kpm `9cb543b`.

## Fleet & Roster: the logic he wants changed is the van-loading flow; segment or panel is a talk, not a guess (2026-09-22, 15:05)

> *"i also want to redesign how the regional admin put item to the agent inventory that is the logic that i want to
> change actually is it better to make another segment or just make another panel inside the fleet and roster is
> something we should talk about on the next job"*

The 2026-08-24 "few logic" question (Backlog: Redesign Receivables and Fleet) is answered: the logic is how a regional
admin loads a salesman's van (today `handleLoadCanvas` inside Fleet & Roster). The shape — its own module or a panel
inside Fleet & Roster — he wants to TALK through first, as a decision with pictures, before any redesign of the screen.
Do not start the Fleet & Roster repaint until that talk has happened; the repaint follows the shape.

## He took the cheaper shape without arguing, and spent the saving on FEEL (2026-09-22, 19:00)

> *"if we can put inside the fleet and roster then lets just do that, make sure that there is animation on doing
> loading and i want better UI than that for our roster, cool if we have some 3D animation as well can u think of
> something cool"*

Four things in one sentence, and the order matters.

1. **Given a cheap option and an expensive one with a real argument behind it, he takes the cheap one — on the
   condition that it works.** "if we can" is the whole test: not "which is nicer", but "is it possible here". Third
   time now (the panel outro, the Agent Inventory strip, this). **Lead with whether the cheap path actually holds,
   not with the comparison.**
2. **The money saved does not go back in the pocket — it goes into the moment.** He closed the shape question and
   immediately spent the difference on the loading animation and the roster. A shape decision is not the end of a
   design round for him; it is the budget for the next one.
3. **"Better UI than that" was said about a screen I had just drawn in his own palette.** It was already tokenised,
   already in slate + gold. So "better" here did NOT mean "not broken" — it meant the roster is still a LIST, and he
   wants the row to say something. What the boards answered with: the van's fill (484 of his usual 600), the number
   plate, the light. **When he says "better" about something that already obeys the laws, look for missing
   INFORMATION, not missing style.**
4. **"Can u think of something cool" is a real delegation, and it has a floor: it must be OUR cool.** The answer that
   fits is the 3D crate — `.kpm-cube` already exists in the sales terminal, driven by each ware's true millimetres —
   so the roster's 3D is a reuse of a thing he already approved, not a new toy. A 3D idea that needs its own engine
   would have been the wrong answer to the same sentence.

Also settled while building it: **the crate turns ONCE when you pick the person and parks at three-quarters.** A box
that spins for ever is the same fault as the blinking lights he killed on 2026-09-18 — the turn has to be an event.

Boards: `Raw/2026-09-22-fleet-loading/board-roster.png` (+ the phone board) and `board-motion.png`. Decision open.

## He asks for a look from a game, and he asks to REVIEW it before it is integrated (2026-09-22, 19:40)

> *"for the animation what if u made this minecraft chest animation with the GUI and also the sound when we open the
> agent inventory, and the textbox "chest" should be replaced with ("agent name" inventory") … btw i want to see it
> on the artifact first so that i can review before integrate it"*

Three things worth keeping.

1. **He rejected all three of my motions by proposing a fourth, and his is better.** Same pattern as 2026-08-31
   ("given three options, he designed a fourth"). My three were abstractions of *loading*; his is a **container
   opening**, which is what the agent inventory actually is. When he answers a motion board with a reference instead
   of a letter, the reference is the answer — board it, do not re-offer the three.
2. **"I want to see it on the artifact first so I can review before integrate it" is now the standing route for any
   borrowed look.** Not a board of stills: a page he can press, with the sound on, before a line of it goes near the
   app. The boards stay for choices between OUR options; a lifted look gets a prototype.
3. **He names the copy targets precisely** — the GUI, the sound, and the title text replaced with the agent's name.
   He does not ask for the textures, and the answer to what he did not ask for is the house rule anyway: the motion
   is copyable, the assets are not. Say that in the same breath as showing it, or the prototype reads as a promise
   to ship someone else's art.

Prototype: https://claude.ai/artifact/V5Z3ZkQZ3fvtXHynn4AnNF · [[Design Inspiration Sources]] rule 1 (repalette,
always) is what look 2 in it exists to answer.

## 🔴 THE CHEST IS BROWN, AND HE SAID SO OUT LOUD (2026-09-22, 20:10)

> *"i like the brown color chest dont need to follow the theme"*

**The second named exemption from the palette law**, after the printed nota ([[The receipt keeps KPM company blue]]).
The rule underneath both: **an OBJECT may keep its own colour; app furniture may not.** The nota is paper, the chest
is a crate — the panel that opens out of it is furniture, and that is why look 2 exists for the panel and not for the
chest.

Two more things settled in the same message, both worth generalising:

- **"Bigger, with pages" beats "everything at once".** *"i rather have big square and page 1,2,3 selection that all at
  once inside the chest causing it to be smaller and harder to see"* — the same instinct as removing information to
  make what is left bigger (2026-08-16). When a grid gets crowded, his answer is fewer cells and a pager, never
  smaller cells.
- **He asks for OUR 3D, not a new 3D.** *"just like master vault and sales terminal"* — the reference is always
  something the app already does. A borrowed look gets rebuilt in our vocabulary; a borrowed capability gets pointed
  at the one we already have.

## "It refreshed" means the screen re-arrived when only one thing changed (2026-09-22, 20:40)

> *"i dont like that everytime i move the item it refreshed and i want it to be able to moved to empty squared and
> not just switch place with other item location"*

**His word for a re-render that replays an entrance is "refreshed", and he reads it as a fault, not as polish.** The
arrival animation is part of a thing APPEARING; once it is on screen, a change must move only what changed. Every list
in this app that re-draws after an edit should be checked against this: `kpm-arrive` on a re-draw is the same bug.

And the other half is a taste rule about direct manipulation: **if something can be picked up, every visible place
must be a place it can be put down.** A grid that only swaps is a grid that says no to half the gestures it invites.
An empty square has to be a real destination, or the emptiness is decoration.

## He wants the game's FEEL, named precisely — and "chill" is a sound word (2026-09-23)

> *"i dont like the sound effect, i want it to be more simple just like what minecraft have but satisfying and give me
> chill when interact with it"* · *"i want the warehouse chest to be ender chest with the effects like on this video"* ·
> *"i like the logic and animation when item transferred to the other chest but make sure the animation is on the middle
> level of between the chests and not too bottom there"*

- **"Simple" beat "rich".** The first chest sound was layered (creak, wood modes, a steel latch) and he called it bad in
  one line. What he describes is fewer parts: one knock, one pop. Satisfying = a small reward per box, not a big noise.
- **"Chill" is soft attack, low pitch and a warm tail**, not a quieter version of the same sound.
- **He watches where motion happens, not only whether it happens.** The flight was right and still in the wrong place —
  at the chests' feet instead of across the middle, where the eye already is.
- **Every place is a place — now in both directions.** He asked for the return drag unprompted: the same rule as the
  empty squares (2026-09-22) — if a thing can be carried one way, it must be carryable back.
- **"Maybe … we'll discuss later" means PARKED, not queued.** The quick-transfer keys were named and deliberately not
  asked for; building them would spend his quota on a maybe.
- **An object may keep its own colours — the second time he asked for one.** The ender chest is near-black, teal and
  green-eyed; the panels around it still follow the palette law. *(Superseded 2026-09-24 — the panel keeps the
  game's grey too; see the next section.)*

Source: [[2026-09-22_fleet-van-loading-shape]] round eight · [[Sounds Come From Aldi]] round six

## The chest's panel is part of the object — look 1, the stone grey (2026-09-24, 06:25)

> *"just use the metal latch for now its fine, inventory box panel just stay with that minecraft color"*

- **The object exemption now covers the panel.** Offered look 1 (stone grey, like the game) against look 2 (the app's
  slate and gold), he kept the game's grey. Chest, slots and panel read as ONE object from the game, not as app
  furniture. Grey is not blue or green, so the palette law holds; only the slate-and-gold furniture rule gives way, and
  only inside the bay.
- **"For now, it's fine" closes a sound question.** Three candidates were offered for MUAT VAN; he kept the metal latch
  he had said *"doesnt really suit it"*. Good enough beat another round of listening — his attention goes to the build.
  Do not re-offer the candidates unless he raises it.

Source: the 2026-09-24 session; the prototype https://claude.ai/artifact/M3xbaPAJ9LT7FL1ETmXvuu · [[Sounds Come From Aldi]]

## Too big is a size bug, and "the whole left panel" means every door kept (2026-09-24, 07:52)

> *"box is too big that the inventory box it is on top of another and i cant even see the whole panel in there"* ·
> *"i want u to redesign the whole left panel but dont forget to include all the logic behind that ... after that then i
> will start to test when the UI is fixed"*

- **He tests on his own PC, and his PC is not the board's width.** The bay passed at 2000 and 518 and still broke on his
  screen (about 800 px of bay, which fell into the phone stack with 250 px squares). Shoot the width he USES (1440x900)
  as well as the two board widths; an inventory square has a size, not a share of whatever width is left.
- **He will not test a screen whose look is wrong** - "after that then i will start to test when the UI is fixed". A
  visual fault blocks the functional test, so it is fixed first, in the same round.
- **"Redesign ... but include all the logic" is permission for a full redraw with one hard floor:** every door (view,
  edit, remove, add, search fields, rank order, the empty-roster causes) must survive, and a check must prove it.
- The roster became his folders where there is more than one place, rows that say what the van holds - the same
  information-first reading of "better" as 2026-09-22. Shipped `13802b6`; his verdict owed.

## He answers a menu with a screenshot of the thing he meant (2026-09-24, 08:35)

> *"what i mean is something like this but change it into 3D character, if its too heavy then just 3D cards, make sure
> the character is hoverable and interacable"* (the State of Decay 2 Community screen attached)

- **Three drawn directions got no letter back - they got the original.** When he names a game, the game's own screen
  is the spec; my A/B/C translations were all one step away from it. Next time he names a game screen: find the
  screen first, and draw options only for what the screen does not settle.
- **"If its too heavy then just X" is a delegated budget call with a floor.** He named the fallback himself, so
  picking it on a real weight argument (a 3D engine + models on a cheap Android) is doing what he asked, not second-guessing him.
- **"Hoverable and interacable" is a requirement, not garnish:** the look is judged by what happens under the pointer.
  Shipped `722cc48`: lift + lit floor on hover, gold ring on pick, the actions in a gold bar.

## Nothing may sit dormant, and a raw colour slab reads cheap (2026-09-24, 09:05)

> *"make the spacing between cards even ... fill all the space"* · *"weird to see this chest just stay dorman like that
> doing nothing ... weird that we have close and open button and a big space"* · *"i dont like that raw color dominating
> the panel, maybe add some creativity to make it looks more expensive"* · *"i like that there is crown symbol for the
> people who responsible for that area"*

- **Empty space on one side reads as unfinished**, even when the layout is "correct" - he wants the row to own the width.
- **A control that only hides things is dead weight.** A closed chest that keeps its room is "dormant"; the chests now
  stay open and a tap only knocks them. Prefer a state that always shows something over a toggle.
- **"Expensive" = a dark surface with gold at the EDGES, not a full gold slab**: gradient ends, a gold rim, gold ink,
  one light sweep on an event. A large flat accent fill reads raw to him.
- **Symbols of responsibility land**: the crown under the area leader is the one element he praised unprompted.
Shipped in the kpm polish commit after `722cc48`; his verdict owed.


## Warm light, not lines; no tutorial in a panel; group by person (2026-09-24, 12:50)

His test of round 4, with a screen recording and two screenshots:
- *"i dont like the background it is too norak, maybe make it more elegant and less lines like there is some
  cyberpunk stuff going on there, just simple cool and elegant with the warm lighting just like what the State of
  decay have"* - a perspective grid floor reads as cheap sci-fi to him. Game-like = warm LIGHT (a lamp overhead, its
  pool on the floor, shadowed edges), never drawn lines.
- *"dont put tutorial inside the panel, we will put all the tutorial on the ponder book anyway"* - explaining text
  (contracts, hints, "tap to pick") belongs in the ponder book, not on the working screen. A panel carries state
  and keys only.
- *"instruction on sc1 is not explained correctly in indonesian and its sound so robot"* - a literal translation of
  an English rule ("Menarik tidak mencatat apa pun", "satu tekan · van tercatat sekali") reads robotic. Write the
  Indonesian a person would say, short: "Muatan masih kosong.", "Muat van".
- *"i want 1 personnel and list of the products they bring, not 1 personnel and 1 product so that it will save
  some space"* - a list about people is grouped by the PERSON, with their things under them.
- *"add copy paste loadout ... just pure for convenience"* - he likes one-tap shortcuts that reuse a colleague's
  work, as long as they only fill (the preset rule holds: nothing real changes until MUAT VAN).
- The pulsing row ("card is shaking when hovered") - a hover effect that changes the WHOLE row must never switch
  off in the gaps between items; the hover zones touch.
Shipped kpm `f167adb` (round 4.5); his verdict owed.

## Every screen on both widths, unasked (2026-09-26, 07:24)
- *"make sure that both pc and phone looks good for fleet and canvas"* - sent mid-build. A panel that fits the PC and
  squeezes on the phone is not finished; the frames at 1440 AND 518 are the check, read back before calling it done.
  What it caught: three tabs stacked one per line and a cut "12 Bks di toko" when both chests were shut on the phone.
  The fix reused the phone's OPEN layout order instead of inventing a new one.
Shipped kpm `3d77048` (round 5); his verdict owed.

## A panel that jumps is a cost; the phone wants less, and two ways to do one thing (2026-09-26, 07:50)
- *"this whole panel shrink and expand too much as pc user i need to scroll up and down whenever i close and open the
  chest i dont like that its incovenience"* - on the PC, opening or closing something must not move the page. It
  overrode his own round-4 "both closed = one short row": the closed panel now keeps its room.
- *"on phone it looks soo big, my suggestion is make the product 3D smaller and make per page 4 box only"* - on the
  phone, less on screen at once beats bigger items; four in one row.
- *"maybe better if the users are be able to press the product and press the van box ... so there is 2 option"* -
  a drag alone is hard on a phone; he wants a tap-then-tap path beside it.
- *"make sure that the muatan panel with the van inventory panel is well separated and looks separated because it
  looks like 1 big panel"* - two jobs, two cards; nesting them in one frame reads as one thing.
- *"there is collapsing text here"* (the gold bar on the phone) and *"make the roster slide lock 1 by 1"* - a swipe
  should move exactly one person; text must never sit under a key.
- *"there should be data history what is being titip ... instead we need more description dropdown"* - a count
  ("1 item") is not information; a row should open to what it is made of.
Shipped kpm `40db68d` `f6aeda7` `8adb777`; his verdict owed.

## Money that looks like every other line gets missed (2026-09-26, 08:35)
- *"split cards by night to make it clear, and make special panel for late EOD for this"* - one card is one night;
  anything late lives apart, where it cannot be mistaken for tonight.
- *"i want u to make the bounties payback to be more clear and little bit different from other because i dont
  realise that the bounties payback is submitted down there"* - a line of a different KIND (a fine being paid, not
  the night's handover) must LOOK different: its own titled plate, not one more row in the list.
- He found the false "short count" himself by testing a real reset + full return - his live tests catch what the
  lab fixtures do not.
Shipped kpm `293798c`; his verdict owed.
- 08:55, on who should see a late night: *"yes salesman should also need to see the late EOD, because it is their late
  responsibility"* - whoever owes the fix must SEE it on their own screen; a problem visible only to the boss is not
  yet the salesman's problem. Shipped kpm `dd94f8b`.

## 2026-09-27 — a switch between two views becomes two objects you can open

His first look at the Agent Inventory chest on his PC (kpm `4f44e3d`), with a screenshot of the chest in a 300 px
window under the pinned header:

> *"the space to view the agent inventory is too small for the chest i use PC to see this btw ... i cant scroll down
> for the page which causing me to unable to see the chest is full view and also its incovenience to see the sales and
> sample as well, make sure that the chest for saleable, quarantine is separated and i suggest u to put some notes icon
> just to view the notes and data for sample and sales that way it would save some space and add cool features as
> well, make sure the icon is 3D kind of book or notes maybe u can use minecraft inspiration for this"*
> *"so what im saying is erase those panel to switch between saleable and quarantine, instead replace them with 2
> chests that can be open"*

- **A pinned header is a cost on the PC too.** The desk kept its figures pinned over a scrolling list (2026-09-18
  board 1 fixed only the phone). Once the list became a chest, the window was too small to hold it. One scroll, both widths.
- **A segmented switch between two collections -> two objects, each opened on its own.** Same instinct as the chest
  itself: things you own are containers you open, not tabs you flip. The quarantine chest gets Minecraft's TRAPPED
  chest (red hook, red band) so the two read apart at a glance; an object keeps its own colours.
- **Long lists he reads rarely go behind a 3D object.** Sales and samples become two closed books on a shelf, the count
  on the label, opened on a tap. Drawn with the app's own box geometry (the `.kpm-cube` way), lowkey tilt, the sales
  book with a quill (book and quill).

Prototype v4, same link as the chest: https://claude.ai/artifact/V5Z3ZkQZ3fvtXHynn4AnNF. His verdict owed.

Minutes later, on the red-latch chest, with a pixel radiation sign as the picture:

> *"for the quarantine chest i think u should make it yellow and add this logo on the chest just to show that it is
> quarantine and add some green radioactive wave just around it"*

**He asked for green himself, on an object.** The palette law is about app furniture; the chest is an object, so the
green waves ride the same exemption as the ender chest's purple specks - and the same carve-out: the one thing that
moves on its own, gone in Lite Mode and reduced motion. A meaning he wants seen at a glance (THIS is quarantine) beat
a subtle cue (a red latch). Built as v5 of the prototype.

Then, on the two books:

> *"make the book 3D more natural and make it open when hover and slide its pages like some magic book and just make it
> 1 book instead with 2 section, 1 section for sales and one for sample just to make it more spacy"*

- **Fewer objects, more room** - two related lists become one object with two sections (the ribbons), the same
  instinct as the chest's pages: one bigger thing beats two smaller ones.
- **"Natural" meant real parts**: covers larger than the page block, a rounded spine, loose leaves, an endpaper inside
  the cover. The first books were boxes with a picture on the front.
- **Hover is a preview, not decoration** - for him a hover should show what is inside (the book opening and its
  pages turning, the enchanting-table book), the same ask as the tutorial book's "open when hovered". Lite snaps.
Built as v6 of the prototype.

And on the waves he had asked for himself, once he saw them moving:

> *"i dont like the radioactive effect it is too much i want the effect very minimalist but looks good instead"*

**What he asks for and what he approves after seeing it are different tests** - the green waves were his words, and
three rings rolling out every 0.8 s were too loud once on screen. It matches "lowkey" (2026-08-30): the effect he keeps
is the one he notices a moment late. v7 offers three quiet ones side by side (a breathing hairline ring, four rising
specks, the sign alone fading to dark green). His pick:

> *"C and B is good i want it together but makes the effect for C little bit brighter"*

Two quiet effects together beat one loud one: small specks at the edge of the eye plus a change in the object's own
sign. Built as v8 (sign peak #2F9A1C instead of #1F5E12).

Then, with a screenshot of the open book (a leather frame with tabs above a two-column panel):

> *"make the book more natural make it open when press and also keep the original size even when there is few
> transaction then just the other space blank rather than change the book size everytime new transaction is added"*

- **An object keeps its size whatever it holds.** A notebook with two entries is the same notebook with blank lines,
  never a shorter book. Same instinct as the chest's empty squares: an empty slot is a real place, so the container
  never shrinks to fit its content.
- **"Open when press" means the object performs the opening**, not a panel appearing: the shut book flies up, then the
  cover turns on the spine and becomes the left page. The v8 dialog was a panel dressed as a book.
Built as v9 (`.ob`), approved build carries it.

> *"make the book look thicker when it close and open just to enhance its 3D, and also fix the ponder book , make sure
> that there is no white lines in there"*

- ~~Depth has to be SEEN, so the object leans.~~ Overruled at once: *"dont make it tilt like that kinda annoying to
  read lol, just let it straight and we can move on"*. **Reading beats depth**: anything that carries text stays
  square to the reader; thickness is shown flat, as page layers in the margin (v11). Same line as "lowkey 3D".
- **A white line is always a bug to him**, never a highlight: the page-stack edge is warm tan stripes, and the
  tutorial book's edge strip that stood alone after closing was a real defect (kpm `dd8f1b9`, see
  [[Anti-Recurrence Check]]: its guard passed on the broken form).

## A tape band is decoration enough; a word on it is one too many (2026-09-29)

On look C of the biohazard box (a tape band under the title with KARANTINA on a yellow label), with a crop of just the band:

> *"erase the text, the biohazard line is enough for decoration"*

- **The stripes already say it.** The crate, its sign and its title already name the place; a label on the tape repeats it. Same instinct as "lowkey": a meaning carried by the object's own marks beats a caption.
- Built as prototype v13 (https://claude.ai/artifact/QA46EfZgkJPd6PH7f2FSjD): the band stays, the word is gone. Whether C is his pick is still to be confirmed. [[2026-09-29_biohazard-box-looks]]

Then, 2026-09-29: *"tape band is the one that i like the most"* (C, no word, is the pick) and *"use Quarantine instead of karantina we will add language switching int he future"* - **new labels are English**; the old Indonesian ones wait for the language switch, never converted unasked.

## The ender chest is the general chest (2026-09-29)

> *"on minecraft ender chest is considered as general chest, chest that can contained everything so we use that terminology and logic instead"*

- **The game's own meaning decides where a thing goes.** The ender chest holds everything, so the warehouse's damaged stock lives INSIDE it (a second inventory box), while the van keeps two separate chests. He reasons from Minecraft's rules, not from symmetry - a design that is logical in the game wins over one that only looks even. "Inventory box" is his word for the grey panel a chest opens. [[2026-09-29_fleet-roster-quarantine-chests]]

## Stacked boxes lose to one box you switch; a switch he can feel (2026-09-29, 15:40)

On prototype v15 (the ender chest opening two stacked boxes, the van's wooden chest and crate each opening its own box, all at once), with a crop of the warehouse title and a 2.6 s clip of a 3D arcade button:

> *"dont make the inventory stacked on top of another for the wooden and quarantine chest, instead open them is one at time, so opening quarantine chest will close the wooden chest and vice versa"*

> *"i rather ask u to make some small section button just beside the warehouse name to switch between quarantine or healthy inventory so 1 switch able inventory panel only, make sure that the button is animated like this button on the video that i gave u and make sure that the button have quarantine logo and toxic effect when press to change into quarantine panel and there should be intro for the panel, this is also work the other way around, pressing back to the healthy goods should also be animated and healthy goods panel should have their own animation and effect how about that?, but maybe we need better button placement instead of up there maybe do u have suggestion where i should put it?"*

- **Stacking reads as clutter to him; taking turns reads as a game.** Same answer he gave Agent Inventory on 2026-09-28 ("open them one by one"): two boxes of the same kind never share the screen, one closes when the other opens.
- **A switch must be a physical thing.** He did not ask for a toggle or tabs; he sent an arcade button and wants it to sink and spring back. Each side of the switch gets its own logo AND its own effect - the quarantine one toxic, the healthy one its own - so both directions are designed, not only the dramatic one.
- **He places a control, then asks to be told a better place.** His red box was a first guess, offered for correction. Answer with the spots drawn side by side, his own included, measured.
- His clip, read with ffmpeg: the cap sits flush while held (~270 ms), pops up with a small overshoot on release, then settles. Built as prototype v16. [[2026-09-29_warehouse-quarantine-and-account-move]]

## "Tech", smooth, and one button that does both (2026-09-29, 16:10)

On v16 (two arcade buttons, three spots; specks bursting out of the button, a tape sweep, squares dropping in):

> *"by the page is okay but the animation is bad i want u to research on how to make it smoother and better and more tech related animation and i rather have 1 button that work 2 ways and change it logo when pressed"*

- **Specks and sweeps read as "bad" to him; he asked for research, not another guess.** The v16 intro was four effects on four clocks, and the old box vanished the instant the button was pressed - "snapped and gone", his old complaint. v17 answered with one clock and no snap: a scan line cuts the old box away as the new one appears, the squares power up as the line reaches them, the name decodes. Research sources: Chrome's `linear()` guide, Aceternity's Encrypted Text / Image Generation Loader / Background Ripple, Emil Kowalski's motion rules.
- **"Tech" for him = lab instruments, not particles**: a scan, a pixel grid, decoding text. Consistent with the RE9 Ark Lab theme.
- **One control, two ways, the face changes.** He prefers one button that flips over a pair he must choose between. v17's face shows where the NEXT press goes (biohazard while the healthy stock is on show, the ender eye while Quarantine is) - my reading of "change it logo when pressed", told to him, not asked.
- He took spot C (by the page buttons) over my pick B. [[2026-09-29_warehouse-quarantine-and-account-move]]

## He designs the control himself when the options miss (2026-09-29, 16:25-17:00)

On v17 (one arcade button whose face flipped like a coin; a scan line across the box):

> *"i dont like the animation for both of those, maybe lets try other theme and animation for these go research more and i dont like the animation for that button switch flip, do you have better idea? u can even make new kind of animation or button"*

Then, before any new option reached him, with a clip of Satisfactory's launch button (a ribbed hatch, two doors slide apart, a red dome on a hazard plate rises; a fist punches it):

> *"what if we made button animation like what satisfactory have, so there is like some blast door opening and the 3D button lift up, when press it plays the animation backwards and change the button logo from quarantine to healthy goods logo what about that"*

- **Two rejections in a row, then his own design.** Same pattern as the EOD letter (2026-08-16): when the options miss, he stops choosing and specifies. His spec is the spec; the nouns are load-bearing - hatch, doors, lift, backwards, logo.
- **He likes machines that REVEAL a control**, from games he plays (Satisfactory, Minecraft), more than flat effects (a scan, specks, a coin flip). A control that hides and comes out reads as "3D" and "tech" to him.
- **"Plays the animation backwards"** = the exit is the entrance reversed, and the state change happens while the thing is hidden. Built as v18: the face changes only behind the shut doors.
- A scan line and a coin flip were both rejected as "bad"; do not offer them again for this switch. [[2026-09-29_warehouse-quarantine-and-account-move]]

- **17:30, on v18:** *"its good but make the button 3D, make the button like before but with that animation and make it bigger so that we can see the animation make the button bigger on the middle bottom of the inventory and make the 6 product box smaller instead ... it can be inside or outside u design it so that i can revise it"*. He keeps the pieces he liked from each round (v17 3D cap + v18 hatch motion) and combines them, then hands layout to me as a DRAFT he will revise. He will trade product-square size for a bigger, visible control. Built as v19 (the 3D button inside the hatch, 112 x 92, middle of the bottom deck; 4 squares a row).

- **17:50, on v19:** *"i feels like the buttons design is not correct it is not well design here because the black mark under the button, i think u need to follow the video that i sent u earlier so that it become more realistic and HD ... steel platform that goes up when button is showing like some elevator ... must exactly like how satisfactory button look at least 3D, realistic, HD high quality"*. **When he sends a reference, match the reference, not my idea of it.** A stylised cylinder read as "not well designed"; a dark gap under the cap read as a defect. He wants the game object rendered faithfully: glossy dome with a highlight, chrome bezel, bolted steel, a label plate, and a mechanism that moves like a machine (an elevator). Built as v20.

- **18:35, APPROVED:** *"i love the button now, everything else is great nothing to complain really u can continue the work"*, then *"maybe look even cooler tbh when the ender eyes is moving and blink at random lol"* - a living object (the eye glances, blinks) is his idea of "cooler", like the crate's slow sign and specks. Added as v21.

## Both times he took the OBJECT over my pick; "norak" = a hazard pattern over the whole surface (2026-09-30)

> *"i want u to add the 3D chest in the regional warehouse and not just the inventory panel, and for stock opname i want option B, and use box A for quarantine inventory"*

> *"i want u to redesign all the blastdoor for quarantine animation because it is too norak i want it to be minimalist but cool but still shows that it is quarantine blast door"*

- **The object wins again.** I recommended A twice on ergonomics (keep the age list; one press per row); he chose B twice and asked for the 3D chest on top. Same instinct as the Sheriff's Desk (2026-08-16): he buys the world. A panel without its chest reads as "just the inventory panel" to him.
- **"Norak" (tacky) is a pattern that covers everything.** Tape stripes over both whole doors failed; the fix is to put the meaning in ONE place (the seam, a seal) and let the rest be plain material. Same rule as "a tape band is decoration enough; a word on it is one too many" and "the effect he keeps is the one he notices a moment late".
- **"Minimalist but cool but still shows it is X"** = keep ONE unmistakable marker, delete the rest. [[2026-09-30_quarantine-chest-warehouse-and-opname]]

- **2026-09-30 08:30, on v23:** *"door 1 looks cool but make sure that the logo is gone after its open"* - the quiet door won; and a mark must leave WITH its moment (a seal left peeking at the edge after the doors open reads as a bug). *"add some background for this panel ... some ender minecraft kinda background theme"* - a dark object on a dark panel needs a SCENE from its own game, not a lighter card: the End sky + an End stone island. *"make sure that there is animation when swapping between chest for the inventory box"* - a content swap between two objects must show where it went and where it came from.

- **2026-09-30 09:10, on v24's End island:** *"i like the idea but the platform is not naturally and on point here, and if u want to make the platform there then add some slow floating animation for those chest and platform to increase the naturality"* - a platform drawn flat in FRONT of a 3D object reads as a sticker: "on point" = the object stands ON it, in the same camera (the island now lives inside the chest's own 3D, `.cc`). "Naturally" again meant real parts (a top face, a thick slab, a stepped underside tapering into the void - see the book's "natural" on 2026-09-28), and a floating thing must MOVE like it floats: slow, small, together (5 s, 5 px, chest + island as one; Lite Mode rests).
- **2026-09-30 09:25, island approved + a new ask:** *"make the blast door for healthy goods special, design it so that it look kinda realistic and more beautiful the rest is great"* - the plain door he never commented on still bothered him: every moment of a machine he likes must be designed, including the way BACK. "Realistic" for a door = parts a real one has (interlocking teeth, bands, bolts, a lock at the seam), not a texture. Options on v26, his pick owed. [[2026-09-30_quarantine-chest-warehouse-and-opname]]
- **2026-09-30 10:15, on v26's healthy doors:** *"vault wheel is okay but change it into eye of ender logo instead of spiinning vault i like the silver color tho but make sure that both quarantine and eye of ender logo in the middle is really in the middle as u can see the line is not in the middle it is annoying to watch"* - he mixes: the material of one option (silver) with the symbol of another (the Eye of Ender, the healthy side's own sign, as the biohazard is the quarantine's). And he SEES a 4.6 px asymmetry and calls it "annoying to watch": anything meant to sit in the middle must be measured there, not eyeballed. [[2026-09-30_quarantine-chest-warehouse-and-opname]]

## On a real phone, fluid beats locked (2026-10-01, his Samsung)

*"im expecting the fleet and roster user card slider to be unlocked and not one by one just to make it fluid"* - he reversed his own 2026-09-26 *"make the roster slide lock 1 by 1"* after using it on a phone. Built `751d64b`: native momentum, the snap still lands a person in the middle. Lesson for proposals: a control that limits a gesture (one-per-swipe, locked drag) reads well in a spec and badly under a thumb - offer the fluid version first on touch screens.

Same session: *"the welcome \"aldi\" is gone when i use my samsung"* and *"we should fix the name on the intro"* - the greeting matters to him even when animations are off; the plain unlock box now says WELCOME BACK, ALDI (`28e2cb3`).

## Lite Mode freezes everything heavy, CSS or not (2026-10-01)

*"yeah lite mode should freeze everything thats heavy, we can push later"* - asked whether Lite Mode should also stop the Platinum/Mythic rank-frame swirl (SVG SMIL, which the `html.lite-mode *` CSS kill cannot reach). Law 3 extends: Lite Mode is judged by what still MOVES, not by which mechanism moves it - SMIL, canvas loops and JS timers count the same as CSS. Built kpm `c64de8b` (frozen, texture kept). Sweep after it: all 17 screens 0-3% busy at 6x in Lite Mode, 0 SMIL running.

## The app tells him it is current - he does not compare numbers (2026-10-01)

*"i think we should put version number somewhere so that we know that the app is already at latest version or not or do u have better option to do so?"* - offered A (a version code to compare), B (the code plus the app checks and says "Latest version" / "updating…" before he types) and C (B plus a locked Sign in), he picked B: *"b is good"*. The pattern: a status he has to interpret against outside knowledge is a chore; he wants the machine to say the answer. Built as one muted line under the door's main control, mixed case to match the Fingerprint row - a bordered readout box on the sign-in card was dropped on sight because it read as a second button. Source: [[../../Brainstorm/2026-10-01_version-check-on-open]], kpm `9d276db`.

## On a phone, one thing at a time - he picked the list-then-product screen (2026-10-02)

Shown Master Vault on a phone three ways - A today's order fixed, B the product on top with the list under it, C the list alone and a tap opening the product on its own screen with a Back - he picked C: *"c is the best one for master vault, cropper plan is great do that for now if anything extra needed i can just review it"*. The reason it won is space: on a 390 screen a list and a draggable 3D box side by side or stacked leave both too small, and C gives each the whole screen. He also approved the cropper as one picture (the photo gets the screen, every tool kept, Crop & Save pinned) without asking for options - for a fix with one obvious shape, one picture is enough. And "do that for now ... i can just review it" = build it, he reviews the result, no second round of pictures. Source: [[../../Brainstorm/2026-10-02_master-vault-phone]], kpm `12b736f`.

## Phone one at a time, PC everything at once - he split the pick by width (2026-10-02)

Shown the two-part bell as A (one box, a switch) and B (both lists at once) at 390 and 1440, with my pick drawn as "phone A, PC B", he answered in four words: *"phone A pc B"*. Same rule as his Master Vault pick the same night: on a phone each thing gets the whole screen; on a PC the room is spent showing both. When a layout question has a different best answer per width, offer the split as the recommendation - he takes it without asking for a single shape. Source: [[../../Brainstorm/2026-10-02_double-notification]], kpm `de33030`.

Verdict 2026-10-02 08:12, on the built bell and the USB reminder in the top panel: *"both working great"*. Recurring-to-done in one night: he described the feature, picked from two drawn layouts per width, and approved on the live phone with no design round.

## A game reference is the spec; he takes the per-width split again (2026-10-02, 18:45-19:00)

He asked for the Map System to show *"the sales team roaming around on the map with their own destination progress ... just like some survivors on game that runs an expedition"*, then named the games instead of describing them: *"one of the mobile walking dead game have that expedition kinda system and also how we navigate on the last day on earth ... i allow u to research a little bit to know what i meant i cant explain it much"*. Researched (TWD: Survivors' squad marches, Last Day on Earth's map travel), drawn as A squad list / B travel card on the app's own dark tiles at 390 + 1440, recommended B on the phone + A on the PC. His answer: *"do your pick both looks good anyway"*.

- **When he says "I can't explain it", the game IS the brief** - research it, draw it in his palette, do not ask him to describe it again. Same rule as his videos and screenshots.
- **The per-width split is now his default, three times in one day** (the bell, Master Vault, the expedition map). Offer it as the recommendation whenever phone and PC want different answers.
- **Honesty survived the game look**: the salesman sits at his last known point with "last seen N min ago", no fake live walk - he did not push back on it. Source: [[../../Brainstorm/2026-10-02_expedition-map]].

## Each map has one job: Map System = stores and areas, Journey Plan = the salesman's day (2026-10-03)

> *"map mission control is used to analyze the stores distribution channel, sales performance of an aread, stores
> level and position while the journey map is for like it said, journey of the salesman throughout the day"*

The expedition (salesmen roaming with their next shop) was built on Map System and he moved it to Journey Plan the
same night. Rule: before placing a feature on a map, ask which job it serves - where SHOPS are and how AREAS sell
(Map System) or where a SALESMAN goes today (Journey Plan). He also wants Map System redesigned later. Built: kpm
`ccae937`; [[2026-10-02_expedition-map]].

## He splits looks by width as a habit: phone = one thing at a time, PC = everything at once (2026-10-03)

Twice in two days, given an A/B: the expedition (*"do your pick both looks good anyway"* -> B travel card on the phone,
A squad list on the PC) and Journey Plan's top panel (*"A for pc B for phone"*). When drawing options for a screen that
lives on both, draw the PC look and the phone look as separate choices from the start - he will combine them anyway.
[[2026-10-03_journey-header]]

## A mark with no moment is not "artistic"; an icon that acts out its job is "high tech but simple" (2026-10-03, 08:25)

Shown three looks for the Journey map's shop marks (a lamp bead, a survey diamond, a game token - all abstract shapes,
gold kept only for "secured") and three key motions (corner brackets, the icon acting out its job, a small lamp):

> *"icon acts is the best, i dont like all the marks can u redesign it to make it more satisfying and cool and game
> related u can do research on this"*

- **The key motion he took is the one that MEANS something**: the fullscreen corners open, the pin drops, the arrow
  flies. A generic effect (brackets, a lamp) lost to motion that explains the button - and the lamp lost even though
  it was the sidebar's own vocabulary, so "reuse the app's control" did not outrank "the icon tells you what it does".
- **All three marks lost because none was a game OBJECT and none had a MOMENT.** "Satisfying" = a reward beat when the
  thing happens (a hop, a pop, light), not a nicer still. Same rule as "the object wins" (2026-09-30): offer things he
  could name from a game - a chest, a banner - not tasteful shapes. Round 2 drawn as banner / chest / beacon with a
  secure moment each; his pick owed. [[../../Brainstorm/2026-10-03_journey-map-keys]]
- **08:45, round 2:** *"chest is kinda cool tbh but since it is small, secured stores and unvisited stores looks almost
  the same"* - the object won again (the chest), and he judges a MAP mark at map size: two states that differ only in
  a detail (a squashed lid) read as one. A state on a small mark needs shape + brightness + light together; check it
  in grey at real size before showing him. He also asks what a design element is FOR (*"what is the purpose of the
  filled and unfilled hexagon"*) - a mark whose meaning he cannot read is decoration to him.
- **09:00, round 3:** *"looks okay but make sure the animation is smooth and correct ... there should be sign on the
  chest for the stores status, sometimes stores dont buy because our product is still on their shelf or many other
  reasons that we have"* - a map mark must carry the visit's OUTCOME, not just visited / not visited: he manages by
  the reason a shop did not buy. And "correct" motion = physically right (a lid swings on a hinge, a jump slows at
  the top), not only smooth; he noticed v3's motion was off before I did.
- **09:32, round 4:** *"open with dark inside but light sign and all the visited should be dark ... make the chest
  more detailed even when it is zoomed its still look like a good 8bit chest ... better animation or model for the
  salesman location because pinpoint is just too standard"* - he moved the light off the object onto the LABEL (the
  sign carries the meaning, so it carries the light); he judges pixel art zoomed in, so a sprite must hold up at 6x,
  not only at map size; and a stock map pin is "too standard" - every marker on his maps should be an object from
  the world (a chest for a shop, a person for a salesman).

## A reward that already exists in the app beats a new drawing of the same thing (2026-10-03, 23:05)

Shown three selling scenes for the Journey map (A restock, B paid, C stall), each with a coin or box drawn for the page,
he picked B and swapped its coin for the app's own:

> *"B paid but change that into coin animation that used on the agent inventory and receipt"*

- **The meaning he picked is money coming in** (the coin into the salesman's hands), over giving goods (A) or keeping
  a stall (C) - the map is for watching sales happen.
- **He wants one coin across the app, not one per screen.** The spinning `.kpm-coin` of Agent Inventory and its receipt
  rows is already "the coin" to him; a second, prettier coin drawn for the map would be a stranger. Rule: before
  drawing a reward object (coin, chest, gem, star), check whether the app already has one and reuse it, motion included.
- Earlier the same night: *"make it into group of 8bit character instead looks kinda cool right"* - zoomed out, men
  are shown as a crowd standing on the bubble, not as heads or as a count. Built kpm `41e308b`;
  [[../../Brainstorm/2026-10-03_journey-map-keys]] "Round 6".

## To mark whose thing it is, he picks the words he can read (2026-10-04, 09:05)

Shown three ways to mark a salesman's chests when he is pressed (A a black flag with the stop number, B the salesman's
own name tag "BS · 3" on each chest, C his 8-bit head with the number), each checked in a colour-blind view:

> *"Name tags is easier to see,"*

- **For identifying an owner, readable text beat the game object.** The flag (A) and the face (C) were more "game";
  he took the one he can READ at map size. Same root as "what is the purpose of the filled and unfilled hexagon"
  (2026-10-03): a mark whose meaning he has to decode is decoration to him.
- **Reuse wins again:** B is the exact tag already floating over the salesman, so the chest and the man now speak the
  same label. Pairs with "a reward that already exists in the app beats a new drawing" (2026-10-03, the coin).
- His original complaint stands as the rule: *"a clearer indicator that the chest is theirs to collect not just color
  ... especially for the people who color blinds"* - ownership is never carried by colour alone.
  [[../../Brainstorm/2026-10-03_journey-map-keys]] "Round 7".

## A replay must be readable at the sprite's size; every object he sees is something he can press (2026-10-04, 16:10)

Shown the Day Replay prototype (a salesman's day replayed on the pixel map, a scene per visit outcome):

> *"that is really cool bro make sure that all the stores is interactable when press and make sure that we now what them notes or status are on each of the stores we, and better if there is button to review the receipt from that sales , well looks like follow him is more visible because the map can be large and it will make the 8 bit model small and hard to see especially on phone, maybe see as a whole in pc and follow on phone?"*

- **The camera split by width again** - Whole day on the PC, Follow him on the phone - and the reason is size: the
  8-bit model must stay big enough to read. Same habit as the expedition (2026-10-02) and the header (2026-10-03).
- **Anything drawn on the map is a door.** A shop he can see but not press is a dead object to him; each one must open
  its status, the salesman's note and, for a sale, the receipt. The receipt is the app's own nota (company blue).
- Built into v2 of https://claude.ai/artifact/WnjonLSqjNZYpoMBbXSdSz. The card lives OFF the map (beside it on the
  PC, under it on the phone) - over the map it covered the next shop he wanted to press (measured with real presses).
  [[../../Brainstorm/2026-10-04_journey-day-replay]]

## The object AND the word: he picks the look he can read (2026-10-04, 18:30)

Shown four sign looks for the 8 visit statuses (Today's cream board, A colour boards, B objects - my pick, C objects +
the word), each at map size and zoomed, in a grey view, each acting out its word:

> *"C is the best because it is really clear, btw for request since it is very important we need more visible compared
> to other maybe add some flag on that stores until order is fullfilled"*

- **Words won again** - the third time a readable label beat a picture alone (name tags 09:05 today; "what is the
  purpose of the filled and unfilled hexagon" 2026-10-03). When a mark must be MEMORISED, put its word next to it; the
  object makes it findable, the word makes it certain. My pick (B, objects only) lost on exactly that.
- **Importance is a property of a status, not only of its picture.** He ranks New Request above the others and wants it
  to persist until it is done - a mark with a lifetime (open until closed), not a moment. Expect the same for anything
  that is a promise to a shop (an order waiting for delivery).
- He proposed a FLAG; the map already has a red one (nobody's shop). Drawn as his banner (A) beside a game "!" (B).
  19:25: *"B is good"* - he dropped his own flag for the game "!" once both stood side by side with the red flag: shown
  the clash, he picks the distinct shape (the object rule again, and the colour-blind rule from round 7). He answers only
  the part he cares about (the look); a rule question left unanswered is his "use your pick".
  [[../../Brainstorm/2026-10-04_visit-signs]]

## The name stays, the detail waits - and a duplicate control goes (2026-10-05, 07:10 - 07:30)

> *"the description status is hidden for the store but keep the store name visible"* · *"right now it is hidden and showed
> only when hovered"* · *"global filter is useless since we have the expedition panel now right and we need to add searching
> box for store name to show the location we also need that on the regular map"*

- **Identity is always on; detail is on demand.** A shop's NAME earns a permanent label; its STATUS waits for hover / hold.
  The same split as the sign object (always) and its word (on demand) the evening before.
- **One job, one control.** Once the Expedition press did the Global Fleet filter's job, he called the filter useless and
  wanted its space for something new. Two controls that do the same thing read as clutter to him.
- **A tool on one map belongs on both.** He asked for the search on Journey AND the regular map in the same sentence.
  [[../../Brainstorm/2026-10-04_visit-signs]] rounds 4-5
- **Fewer pickers, coarser grain.** 08:30: *"for regional command just add selection of team instead to make it simpler"* -
  three region drop-downs (province / regency / district) gave way to one Team picker. He filters by PEOPLE he manages,
  not by map geography; geography stays one layer down (the sector tree).
- **He expects the testing done, not handed back.** Same message: *"test it yourself"* - a ✅ TEST list he could have run
  himself reads as unfinished work.

## Map System: the PC keeps the whole map, the phone gets the dock (2026-10-05, 09:25)

> *"A for phone B for PC"*

- Shown A (map + a side panel, Journey's layout - my pick) and B (full-width map, floating cards) per width, he split
  them again: **phone A, PC B**. On the PC he chose the bigger map over the always-open ranking, against my pick - for
  an analysis map, the map itself is the thing he wants room for. The per-width split is his habit, fifth time.
- He left the shop-card question unanswered: as before, that is "use your pick".
  [[../../Brainstorm/2026-10-05_map-system-redesign]]

## "The fonts is really bad" - the app never loaded its own font (2026-10-05, 11:20)

> *"the fonts is really bad i want u to change it, make sure all the animation is on theme with ours, and make sure that
> symbol for wholesale hub is more visible than other stores and i think i need new logo for unranked tier"*

- **He judges the font he SEES, and what he saw was a fallback.** The app's display face (Barlow Condensed) was never
  loaded, so his PC drew Arial Narrow; every drawing he approved used the real face. When he calls a font bad, first
  check `document.fonts` / the computed family on his screen before proposing a new face.
- **"On theme with ours" = Journey's motion**: a key's icon acts out its job, nothing bounces, nothing pulses forever.
  He expects one motion language across both maps.
- **A special shop must out-shout the rest at map size** (the hub), and **every level needs a picture he can name** -
  a plain grey dot for Unranked is not a logo to him. [[../../Brainstorm/2026-10-05_map-system-redesign]] round 2

- **11:50, the answer:** *"i cant see the fonts the example u are giving me is too small wholesale hub is C good, unranked is
  sprout"* - he took the object AND the word for the hub again (third time: signs, name tags, hub), and my sprout pick. **A
  font comparison must be shown ZOOMED** (one part at ~3x per option, stacked full width): side-by-side screens at app size
  read as the same picture to him, so the pick cost a round trip.

- **12:00 - 12:10:** *"C is best for fonts"* - shown big, he took the squarer GAME face for numbers and labels over my "the
  font your drawings used" (B): the game feel beats consistency with old drawings. Then *"make sure that the hub is hidden also
  when zoom out"* - a special shop must stand out when you can see it, but must not break the clean zoomed-out picture; and
  *"change the circle and number to better symbol"* - even a counter on his map must be an object, not a plain shape.

- **12:15:** *"B is better but we need set of of new tier symbol as well to better show their exclusiveness"* - he took the
  object (the market town) for the groups, and asked that a RANK look like a rank: the ladder must show who is rare, not just
  which colour a shop is. Equal plates for every level read as "all the same" to him.

- **12:30 - 12:40:** *"rank medal is cool but i dont like the mythic logo"* then *"A is good"* - he rejected the busiest drawing
  (a crown in a medallion with feathered wings) for the plainest strong one (a big crown alone). At the top of a ladder he wants
  ONE bold object, not decoration around it.

## Small type he "cannot see" is a bug, not a taste call (2026-10-05)

His words, the same evening, two screens: *"this font for notification is not visible i think it is too small"* (a
stock-low notification) and *"why is this so small man please fix that"* (a phone shot of Map System's Unranked sprouts
with their overdue dots). One hidden cause behind both: a size chosen for one font or one box, kept after the thing
around it changed. The notification was 11 px "mono" - and since the font switch (kpm `7f88984`) mono IS Rajdhani, a
narrow face that reads about two sizes smaller; the sprout was a r 9 dot in the middle of its own 32-grid box, so making
the box bigger still drew a dot. Fixed in kpm `3c28e68`: 15 px semibold in the app's ink; Map System pins x 1.4 (Unranked
31 px ... Mythic 45 px); the sprout fills its box like every other level.

**Rules:** after any font change, re-measure every size under 12 px - the px number did not change, what he sees did. On
the map a symbol FILLS its hit box; a symbol sitting in its box as a dot reads as "too small" however big the box is.
Proof: `Raw/2026-10-05-small-type/` (9/9, both widths).

## The map comes first on the fullscreen map (2026-10-05)

Two rounds on the Day Replay in fullscreen. Round 1 he said *"can u make it more compact especially on pc because the panel
looks so big here"*; round 2, between a thin bar along the bottom (A) and a 300 px column with every detail (B), he picked
**"A - thin bottom bar"**. On a full-screen map he gives up the list (the Day Log) to keep the map big: details open one at
a time (a pressed shop's card), the controls shrink to one row, the day becomes colour ticks instead of pictures.

**Rule:** on a fullscreen map, chrome is one thin row and details are on demand; a full panel belongs on the page, not over
the map. Proof: `Raw/2026-10-05-day-replay-built/fs2-*.png` (the pick), `fs3-*.png` (built).

## A product shown as a plain cube is "unclear"; judge every page at HIS screen, full width (2026-10-06)

His review of the published presentation, four shots taken on his wide screen (about 1920 px): *"these parts need improvement u can spot the problem right away when fullscreen especially, use formal languange instead"* and, on the stock and terminal scenes, *"these box is unclear really i want u to change the product with cigarette box instead"*.

- **Show the real object of the business.** KPM sells cigarettes, so a ware is a cigarette pack, a carton (slop) or a case (bal) - a gold-lined cube meant nothing to him. Same root as "a mark whose meaning he has to decode is decoration" (2026-10-03). The app's own pack shape is the spec (55 x 90 x 22 mm, MerchantSalesView `cubeVars`); on a shared page the packaging stays made-up, never a real brand.
- **He looks at full width first.** All four defects (the tilted map over the leaderboard, a cube over its label, a receipt faded to nothing mid-loop, a blank door panel filling the screen) showed at 1920 and hid at 1440 / 390. A page is checked at 390, 1440 AND 1920 now (`shoot-showcase.mjs` does all three, plus an overlap check).
- **Customer-facing words are formal Indonesian** ("pimpinan", "tenaga penjual", no "bos" / "laku" in the descriptions); the app's own button names stay as the app writes them.
- **Something that loops must not spend its loop invisible.** A receipt that prints, holds and fades reads as missing in whatever second he looks; it prints once when the scene shows and stays.

## "Not standardise": flat cards read as a template to him (2026-10-06)

The customer presentation's round 3 added five scenes built as flat bordered boxes with rows. Palette-correct, all checks green. His verdict, while I was adding two more: *"make sure that the design is not standardise can u design it better use more motion and animation and perspective"*.

**What answered it (v4):** every new picture stands on a tilted 3D stage and rises into place when its scene first shows; parts float at different heights; on a PC the picture leans toward the mouse. Each scene got ONE motion that acts out its own claim: the stock gauges became 3D columns that turn red under a see-through minimum plate; the sample scene throws packs from a carton into a SAMPEL tray; the target chart flips in and draws its own line to "now"; the refused edit shakes and a TERKUNCI stamp slams down; the roles became a stepped tower where the lit role lifts. Lite keeps the tilt (a still frame), drops the motion.

**The rule it adds:** a box of rows is the default every generator reaches for, and he can tell. Same lesson as the Architect Terminal (*"palette-correct is not designed"*): before calling a scene done, ask what this scene's object would be in 3D and what single motion would prove its sentence.

**Corrected the same day, 14:09:** *"dont use too much 3D kinda annoying to view btw"*. The tilted stage and the lean toward the mouse went (v5); the motion inside each scene stayed (the rise-in, the flying packs, the stamp, the dot walking into the GPS ring). So "not standardise" meant **motion and character**, not tilt: a whole picture leaning in 3D is noise to him, while a single object that is 3D because the real thing is (the cigarette packs, the command-table map he picked) is fine. Default from here: flat stage, one meaningful motion per scene, 3D only for objects.

## A message rings out, a box thuds (2026-10-10, baked 2026-10-11)

In the message sound studio he pushed the message chime (`confirmation_002`) to **pitch 1.8x - the top of the slider**, cut the bass under 180 Hz, and set the echo to **0.6 - also the top of the slider**; the failure (`error_002`) he kept short and quiet (0.14). In the chest round (2026-09-23) he chose the opposite: soft, short and close, echo 0.33. A sound's character follows what it announces. He rejected every capybara and intro candidate: *"i dont like the capybara and vault intro, especially the vault intro because it is specific for our own design, and the capybara talk is not satisfying enough"* - the intro must belong to KPM's own vault moment, not a stock jingle. Baked as kpm `f942657`. Source: `Brainstorm/2026-10-10_sfx-message-capybara-intro.md`.

**8-bit, his words (2026-10-11):** *"those 8 bit games usually sounds great"* - for the capybara's voice; and a typing sound for the intro's text lines, with the dots' sound invented. Same direction as the message chime: bright, small, game-like.

**Human beats 8-bit, elegant beats retro (2026-10-11):** *"dont have to be 8 bit TBH why not sound like minecraft character or even sims character it sounds better in the ear than 8 bits for the capybara"* And for the vault intro: *"dont make the intro 8 bit bruh, we need elegant for that"*. So the retro look of the app does NOT carry over to its sounds by default: a character should sound like a creature (Minecraft villager, a Sim), and a brand moment (the vault intro) should sound refined.

**The agent capybara's voice (2026-10-11):** *"saved the capybara voice already but i want more expressive voice and not like robotic kind of voice, and also i want variety on the number of syllabus said by the capybara not just fixed number each time he talk and also add slow and fast talking just like human being talking being expressive, since this is agent capybara i want the voice to be tegas and serious but expressive can could be elegant manly and focus type of people"* - "tegas" (firm). A character voice in this app is serious and focused, never cute or chirpy, but alive: changing pace, a stressed word, a different length every time. Robotic = rejected.

**2026-10-11 17:35 - the capybara's voice must sound HAPPY and never be one lonely sound.** *"anyway sometimes the capybara said one words only its kinda scary and like somescare tbh we need more happy emotion and minimum of 3 words when saying stuff can u do that?"* Measured: "Hi." / "Ok" were ONE sound, 1 line in 6 began with a lone low "hm." grunt. Built (kpm `e55536c`): the same Agent voice he picked, happy melodies only (cheerful / approving / excited / curious), at least 3 sounds a line, no grunt. Reading: he liked the firm Agent TIMBRE at 13:13 but not a serious MOOD - keep the two apart when tuning a voice.

**2026-10-11 19:30 - the capybara is a GENTLEMAN who MUMBLES, fat but soft.** *"and i want u to change the sfx for capybara to mumbling insted, i want u to think how capybara gentlement should have when talking and i have some of the sfx sample in this youtube https://www.youtube.com/watch?v=Dl_hOYskhHU, it might be cool when u can make some fat but soft mumbling sound, just imagine the duke from resident evil village but inside the sim city or maybe esquie voice from expedition 33 but mumbling like inside sim city"* His references, as sound: The Duke (Resident Evil Village - a huge, jolly, rich-voiced merchant), Esquie (Clair Obscur: Expedition 33 - a huge, soft, round, gentle creature), Sim City / Sims gibberish. So: deep and big-bodied, soft edges, friendly, never sharp or dark - and, from 17:35, happy and never one lonely sound.

**2026-10-11 ~19:45 - natural beats processed.** *"your pick is good but make it more natural sounding instead of electronic edited sound"* He kept the direction (real mumbles, deep and soft) and rejected the sound of the processing: a forced pitch, chopped ends and a heavy filter read as "electronic edited". Same instinct as *"not like robotic kind of voice"* (round 5): when a real recording is the source, change it as little as possible and the same way for every piece.

**2026-10-12 18:42 - "3 words" means 3 words HE HEARS, in EVERY SENTENCE.** *"i still can hear the capybara saying 1 or 2 words only i want u to fix that it shocked me so much minimum 3 words each sentence remember"* - the second time he asked (first 2026-10-11 17:35). The first fix counted SOUNDS per LINE in the plan and passed its own check, but the syllables run together with the echo: rendered as the phone plays them, "Hi." was 3 sounds heard as ONE word, "Welcome back, Boss!" one, "Deal's done. Good haul." one per sentence (3 of 72 sentences heard as 3+ words). Fixed kpm `ac0af54`: 3 words per sentence, a .15 s quiet between words, every sentence of all 170 lines he can hear rendered and counted (0 short). Before/after audio: `Raw/2026-10-12-capy-three-words/`. **Lesson for any sound ask: measure the rendered audio the way his ear gets it, never the plan's count.** A word he hears is a burst with quiet around it.

**2026-10-12 06:00 - his three picks, all A (the paste line *"My picks: HUB = A, buttons = A, WhatsApp = A"*).** HUB = A: the warehouse IS the plate - roof and walls one drawing, the level badge big inside its door, the word under it (he had said *"we need more recognize able HUB symbol"* and the old roof hung off-centre). Buttons = A: *"the yellow background ... hurt the eye"* -> a gold EDGE on the dark plate, icon gold, word cream - the same rule he set for the hub in round 2. Both times he chose the one-piece, edge-not-fill option over the louder ones (B's roller door, C's bronze main button). Built: kpm `9104082`, `5aef4dc`. Notes: [[2026-10-12_hub-symbol]], [[2026-10-12_gold-buttons]].

## He picks per device: the phone and the PC can get different answers (2026-10-13)

The demo front door board offered one look for both screens (A five keys, my pick). His answer split it:
*"A for phone B for pc for decide 1, decide 2 is A"*. The compact list where a thumb scrolls, the ID badges
where there is room to show five people side by side. It is the second time: the Map System redesign went the
same way on 2026-10-05 (*"A for phone B for PC"*).

**What to do with it:** when a board shows PC and phone frames, caption each option per device and expect a
split pick - do not force one recommendation across both. Building a split costs one Tailwind switch
(`lg:hidden` / `hidden lg:grid`), never two components. Shipped: kpm `914d17d` (components/DemoFrontDoor.jsx).


## 2026-10-13 - people's faces: cartoon, not anime

The demo's eight people got drawn faces (SVG, no photos). He first accepted *"sure cartoon face that u make is also
fine"*, then asked *"can u do anime style for the character"* - an anime set was drawn (big shiny eyes, spiky bangs,
cel shading) - and after seeing it: *"i dont like the anime face model just switch back to cartoon like before"*.

**What to do with it:** for people pictures in KPM, the flat cartoon look (simple shapes, small dot eyes, soft smile,
slate shirt with the gold collar) is his pick. Do not offer anime again unless he asks. Both sets are in kpm git
history (`25fb74a` anime, the cartoon set after it) if he ever wants to compare.


## 2026-10-14 - Agent Directory rows wear the agent's frame

His ask: *"can u make the app show the border on the side profile as well so we know all their used border directly
from the agent directory"*. Built as the player card's 128 px frame parts scaled whole to 56 px (photo 44 px, rows
82 px), the agent's own pick, animated like the profile. Shown one rendered frame (lab, 1440); after it went live:
*"its good enough"*.

**What to do with it:** a small copy of an existing look is built by SCALING the solved component whole, not by
redrawing it smaller - it keeps every frame's detail and cannot drift from the original. "good enough" is acceptance,
not delight: if he later says the list feels busy, the two prepared answers are 48 px or still frames in the list
only. Shipped: kpm `d6ae9d0`, live `ff5b97b`.

## He picks the option that costs zero space, again (2026-10-15)

Shown three ways to hide a Lite button in the top bar (A a 12 px sliver, B a pull-tab under the bar, C the "SYSTEM ACTIVE" line itself decoding into "LITE MODE · OFF · TAP"), he answered: *"i want the status line and push it first"*. Same rule as the tutorial chips (2026-08-31, *"to save space"*): an entry point he rarely uses must not cost the bar width. He took my pick; he skipped the how-often question, so the default (first open of each day) stands until he says otherwise. [[2026-10-15_lite-button-peek]]

## Cards in a row need air to be read (2026-10-18)

On the presentation's 3D feature wheel (23 cards on a ring, 7 px apart on the phone, 10 px on the PC), his ask: *"i want there is some distance between the carousel just for better visibility and reading"*. Built: the ring widened so neighbours sit 30% of a card apart - 45 px on the phone, 60 px on the PC; card size unchanged, so the text stays the same size and fewer side cards show. Shown as a before/after board (phone 390 + PC 1440).

**What to do with it:** cards that touch read as one block; give each one its own edge before he has to ask. Get the space by moving things apart, never by shrinking them - the same instinct as "bigger, with pages" (fewer cells, never smaller cells). kpm presentation v27 (`.claude/presentation/kpm-semua-terkendali.html`, `wFit`).

## A slide change that looks like a basic slide effect reads as "cheap" (2026-10-18)

On the presentation (v27): the front card flying to full screen and the sideways slide-in between slides. His words: *"i want better animation when entering the slides makes it more natural and smooth and high quality right now the animation is like my secondary slides effect its look kinda cheap and bad TBH"*. Same message asked for a mascot: *"some random high quality agent capybara roaming around the slides and carousel make sure it is natural and HD"*.

**What to do with it:** a stock transition (a plain slide, a plain zoom) is the thing he calls cheap - he wants motion that feels continuous and physical, where the thing you pressed BECOMES the next screen. "HD" and "natural" are his quality bar for anything drawn: no stiff loops, no blurry raster. To be built in v28 (see kpm NEXT-SESSION.md, 2026-10-18 16:35).

## His own character beats a new one; then he asks for a second act (2026-10-18)

Shown v28's cameo (his merchant capybara from the sales terminal, walking the bottom edge with a step bob, thumbs-up on tap): *"okay bruh i like the capybara just walk around like that, but i want more creativity, what if u make a new animation with that capybara model just wandering around, flying with the floating rock if possible just like in the sales terminal, but with better animation and naturality"*.

**What to do with it:** reusing HIS existing art was the right call - it landed on the first try. "Like that" means keep what works and ADD to it, never replace it. His next step up is always more life (a second behaviour, a vehicle, a place from his own app), and "naturality" is the bar: curved paths, lag, weight, a shadow that knows the height.

## Slow down, never stop dead; no how-to text; a page must look like the lab (2026-10-19)

On the presentation's feature wheel, three asks in one morning:
- *"i want when i hover the carousel it slow its speed gradually rather than completely stop just to make it more natural"* - a dead stop is a snap. Built as an eased speed (10 -> 2.5 deg/s, 0.45 s time constant, both ways), kpm `1315ef7`.
- *"this tutorial is not needed"* - the line explaining how to drag and tap the wheel. A control that needs a paragraph of instructions is the control's problem; he cuts the paragraph.
- *"i need better background for this panel btw, that represent our Resident evil requiem theme, the lab and dark theme"* - a plain glow on black is not "Ark Lab" to him; a page should look like a PLACE in the lab. Options: [[../../Brainstorm/2026-10-19_wheel-page-lab-background]].

- Shown three rooms (steel wall / specimen tubes / a lit platform), he chose the one that gives the content a FLOOR to stand on: *"C but make sure it looks good both in phone and pc"*. "Both" is a standing condition, not a courtesy - a percentage-sized glow that looked fine on the phone became one dark-red band across the PC's top; size light sources in pixels with a clamp.

- Then the drag: *"i want u to reduce the sensitivity on scrolling the carousel it is too sensitive and move too much"*, and before it was built, *"i want it to be slower and smoother"*. Measured cause: 0.3 deg per px plus a free spin after the lift - a slow 120 px drag moved 2.3 cards and a flick 9-12. Fixed at half the rate with a capped glide of at most two cards (kpm `b100c4b`). A carousel he presents from should move LESS than the finger expects, never more.
- Ten minutes later, still too much: *"i want it to be more less sensitive and also make the spin slower on default and i want u to make the screen fixed when on the carousel so that i can spin it without sliding up and down"*, then *"the sliding feels bad on the phone"*. Went to .09 deg/px (~175 px per card), spin 10 -> 5 deg/s, and `touch-action: none` on the wheel - with `pan-y` the browser took any steep swipe (the drag died mid-swipe and the page scrolled 157 px, measured sideways). **His bar for a touch carousel: the thing under his thumb moves ONLY the thing under his thumb, slowly.** Start the next carousel there instead of at a "lively" default (kpm `5608ab1`).

**What to do with it:** every stop, start and switch eases (the same "no snaps" law as the fan-carousel, now for speed too). Backgrounds on his pages are rooms - steel, glass, floor, light sources - in black, warm white and amber, red only as an emergency accent.

## A stock number belongs where the salesman looks, not behind a press (2026-10-20)

*"agent inventory detected 16 mrapi cigarette but on the sales terminal there is no information regarding its quantity"* - he called it a BUG. The count had been taken off the card on purpose on 2026-08-05 (kpm `a181c9a`, "four words of noise") and moved to a side rail that only exists at 1280 px and up, behind a press. He never found it there.

**What to do with it:** a number he checks before every sale (what is left on the van) stays ON the card, in the same unit the sibling screen uses (Agent Inventory says "16 Bks"). Moving it behind a hover or a press counts as removing it. Options and his pick: Brainstorm/2026-10-20_terminal-card-count-and-whatsapp-autofill.md.

- 2026-10-20 07:40, shown "16 Bks left" (A) beside "1 Slop 6 Bks" (B) on the card: *"B is better"* - he reads stock in the units he counts in, even on the busiest card. Built in kpm `a2bf766`.
- 2026-10-20 07:58, after B was built: *"i want bks also included there my idea is giving it pressable button like the clock button to show bopth format"* - his own pattern: ONE chip, two readings, a press flips it and it flips back by itself (the header clock and its date). He would rather add a press than a second line of text. Built in kpm `e31c310`.
- 2026-10-20 08:09, pointing at the header clock: *"i want the animation to be like this clock for that switch up bks format we press and its switch"* - a switch between two readings SLIDES like the clock (old face up and out, new one rises from below, 320 ms), never a plain text swap. Reuse the clock's own motion for any two-face control. Built in kpm `1a62f01` (theme.css .kpm-flip-*).
- 2026-10-20 09:29, shown the folder-tick page in Customer Directory beside the folders (A, recommended) or as a tab in Settings beside the tier permissions (B): *"i think it should be inside the setting"* - a control that decides WHO SEES WHAT belongs with the other permission settings, not on the screen it governs. He overruled the in-place option.

## The confirm box was too small to read (2026-10-20)
His words, with a screenshot of the "Turn folders ON?" confirm: *"i want u to fix this panel make it bigger because it is too small hard to read"*. It was 11px message text, 9.5px title, 11px buttons in a 448px box. Now 15px / 12px / 14px in 576px (kpm, ConfirmGate.jsx). Third time he has asked for bigger small type (see "asked for bigger small type", 2026-08-16): **text he must READ to decide something starts at 15px; 11px is for labels only.**

## The switches were amber slabs, and he said "remember" (2026-10-20)
His words, on the Customer access switches and Save row: *"make sure this buttons is well animation and build"* and *"and remember i dont like this full amber fill the panel"*. The "remember" is the point: the slab-vs-mark law was already written here, but `.kpm-switch` broke it in the dark theme because `--gold` is amber there (the old comment only checked the light theme, where it is near-black). Built kpm: chosen side = `--raised` + gold word + a 3px gold bar that slides (220ms); the red "NOT SAVED" plate became amber ink text; a disabled gold button now looks disabled. **Check a colour token in BOTH themes before calling a fill legal.** Frames: Raw/2026-10-20-customer-access/switch-after-*.png.

Same day, his follow-up: *"can u fix all the buttons so that it look like that new button u just made, i see few in the setting"* - status badges, the pill switches and the dropdown chosen row moved to the same look (kpm d1398cf). Frames: Raw/2026-10-20-customer-access/settings-controls-*.png.

## Forms become standalone panels, opened only when needed (2026-10-20)
His words, with a screenshot of ADD NEW CUSTOMER filling the top of the directory: *"just to save some spaces i want this panel to be standalone panel that shows up when we press the edit button only , we will do the same similar to this on the fleet and roster so that it saves spaces, we can put other things on the customer directory or even expand the features for that customer"*. This REVERSES his 2026-09-17 "always open on the desk". Built kpm 5bed35a: a panel over the page (drawn onto body, so the side menu cannot cover it), closed until Edit / Add, a tap outside does not close it. **Next in line: the same for Fleet & Roster.** Frames: Raw/2026-10-20-customer-access/directory-panel-*.png.

## The shop cards are "too smooth" (2026-10-20, evening)
His words, with a screenshot of two Customer Directory shop cards: *"btw i want u to add line and well format because the customer cards looks too smooth without any literature or anything here as u can see not even the lines toseparate the information"*. The dividers existed at `--line` (1.3:1) - invisible to him. **A separator he cannot see is no separator; a divider that has to read uses --line-2 or stronger.** Queued as the next ONE job (kpm NEXT-SESSION.md), two options as frames first.

**Decided 2026-10-21 08:20: A, "Bands".** Shown Today / A (name on its own darker strip, clear rules under it and over the buttons, a column rule between the two facts, card +8 px) / B (a ruled spec sheet, one row per fact, card +33 px), phone and PC, he answered *"A look okay u can do that"*. He picked the compact option over the one that read more like a form. That fits his 2026-09-01 phone complaint ("too much going on vertically"): **he wants separation he can see, but he will not pay for it in height.** The lines that won are neutral (--line-3 / --line-2), not gold. Built in kpm d3dfe63.

## The capybara must not repeat itself, and it must be HIS capybara (2026-10-22)
His words, picking the v37 options: *"can u generate new expression for that capybara for overall use, make sure their body and face is the same just different gesture, because all the gesture is the same"* and *"im expecting different clothes as well for the capybara"* (for the warehouse workers on slide 20).
Read literally: one character, recognisable everywhere (same face, same body, same art style), with a gesture that fits each scene (handing over a paper, stamping, receiving, running, carrying a box). Reusing one pose everywhere reads to him as lazy. Clothes may change with the job (worker outfit), and the face never does. He also named the tool route himself ("higgsfield or some other provider"), so generated art is welcome as long as identity holds. How it is done: [[Capybara Art Generation]].
He took all five of my recommended options at once (E-A, 09-A, 18-A, 19-A, 20-A): when the cost is stated beside each option, he decides in one message.

## A hint is a puzzle-game hint: a box around the thing, the rest blurred, on a key (2026-10-24)
Shown the demo mission card as A (corner card) / B (one line under the DEMO bar), his words: *"b is easier to see and better if u add circle or square just to show what to do and also blur other outside of the box, but of course this will work as a hint button like in some puzzle game so that the user know what to do and dont forget use indonesian language"*.
- He took the line that covers nothing (again the zero-space pick) and added the hint himself: a shape AROUND the target, everything else blurred, opened by a key - never always on. This does not undo his 2026-09-15 "no hints panel": that was copy explaining how a screen works, permanently on screen; this is a key the viewer presses when stuck, inside a demo built to teach.
- The demo's mission copy is Indonesian (MISI, PETUNJUK), even though the DEMO bar around it is English.
- Built as frames: square ring in amber edge, four dim panels with a 3 px blur outside it, a one-line tip under it; Lite Mode drops the blur, so its dim goes .55 -> .8 (at .55 with no blur the screen read as not dimmed at all). Board: `Raw/2026-10-24-mission-card/mission-hint-board.png`.

## The capybara speaks "saya" to "Anda" - the one exception to the no-second-person rule (2026-10-25)
Asked whether the dialogue capybara may talk like a person, his answer: *"dont use aku kamu on the dialogue, use anda dan saya instead"*. So a CHARACTER in a conversation uses polite first and second person (saya / Anda); never aku / kamu. His 2026-08-30 rule (the Ponder book's subject is the factory, no second person, audit G56) still holds everywhere else - the dialogue is the exception, not a repeal.
Same message, on the faces: *"u should remake these using dreamina ig higgsfield is unable to do that"* - Dreamina is his pick for the capybara art; it needs his sign-in on the PC (dreamina.capcut.com showed "Sign in to start creating" in the built-in browser, and no Chrome was connected).

On the Dreamina talking face (small black beady eyes, 2026-10-25 11:2x): *"this one eyes is scary make sure that the eyes the same with others"*. One character = one eye style across every expression: white eyes, a round dark-brown pupil, a small shine, relaxed lids (the thinking face is the model). Tiny all-black dot eyes read as staring. Fixed with Dreamina Smart edit (the face as the only reference, "change ONLY the eyes"); the body stayed identical. Before / after: `Raw/2026-10-25-capy-dialogue/talk-eyes-fix.png`.

## A gate reads as bad, 8-bit reads as low-res, and a knob must never rewind (2026-10-25, the promo dial)

> *"i like it but i dont like the gate animation and also this 8bit logo for the hat i want it little bit more HD and i want the button to feel more natural when spinned ... it will snap back to the original position and then snap it back to the position i desire which is unnatural"*

- **Doors closing over the box lost to the scan line, twice now** (v16 specks/sweeps -> v17 scan on 2026-09-29; blast doors
  -> scan again here). For a box changing what it shows, the scan wipe is his switch. Do not offer doors again.
- **"Minecraft" is the world, not the resolution.** 12x12 pixel sprites read as "8bit"; he wants the items "a little bit
  more HD" - shaded vector art with a light side, a shadow side and a brand mark, still inside the grey Minecraft box.
- **A physical control must continue from where the hand leaves it.** Any animation that restarts from the previous
  state after a drag reads as a fault ("unnatural"). Settle from the current position; detents and a soft click are what
  make a dial feel real.

Source: [[../../Brainstorm/2026-10-25_promo-chest]] round 3.

## One function, one control: grow the control he has, never add a twin (2026-10-26, the promo dial)

> *"first thing first looks like we cant combined these old mastervault UI and the the new button together because both share the same function do u have any better solution for this?, well i think that we just focus on 1 and improve it"*

- He had approved the dial as a concept (2026-10-25, "C is a cool concept") - and dropped it the moment it had to sit
  beside the Master Vault's tab row, because both would pick what the list shows. **A new control that does what an
  existing one does is a design bug to him, even when he liked the new one on its own page.**
- What he chose instead: improve the one that is already there. Built as a QUARANTINE tab in the existing row, and a
  third stop on the existing warehouse hatch (the one he said he loved, 2026-09-29).
- **Before proposing a control, ask: which control on this screen already does this job?** If one does, the proposal is
  a new state of it, not a new widget. A board of placements for a second control (the A/B/C board that morning) was
  the wrong question - he answered a different one.

Source: [[../../Brainstorm/2026-10-25_promo-chest]] "Stage 2 built".

## Customizing means every visible part, and front/back must agree (2026-10-26, promo goods)

> *"we need more customizable color on this, funny thing is that when i put the name on the front here the back does have different name which is the default name"*

- Two colour pickers (body + print) were not enough the moment he painted a shirt yellow: the collar followed the body
  and he could not set it. **If a part is visibly separate on the model, he expects to colour it.** Built as one picker
  per real part, only for the types that have it.
- A default he never set (KPM on the back) that contradicts what he typed reads as "funny" - a bug, not a feature.
  **A value he types must win everywhere that value is shown.**

Source: [[../../Brainstorm/2026-10-25_promo-chest]] "More paint + the back print".

## 2026-10-26 — a 3D product must read as the REAL product he knows, and he will hand over the photo (kpm 9a163cf)
His words: *"i think u need to remake the lighter because it doesnt look like a 3D lighter btw"*, then mid-build a product photo of a Mecco-style disposable gas lighter (five see-through colours) with *"just make it like this one"*.
- What failed: the first lighter was built from generic parts (a rounded black box + a silver box + a wheel) - correct-ish in pieces, wrong as a whole. Its list picture read as a bottle. I had started a second generic guess (a BIC with a spark wheel) when his photo arrived; the photo showed NO wheel - a piezo korek gas with a flat stamped metal top and a black side lever.
- What he means by "like this one": the exact everyday object in Indonesian shops, down to its identifying details - see-through coloured plastic showing the insides, the black collar, the metal top with its hole, the black lever on EVERY colour (so the lever default became black, not the body colour).
- Rule for next time: before modelling or drawing a real-world object for him, ask for (or find) ONE reference photo of the local version first; a generic Western reference (BIC, Zippo) is a guess about his market.

## 2026-10-26 — every printed word on a promo item is HIS; a fixed company word is a bug (kpm 464e94c)
His words, on a phone frame of his TAWANG poster: *"u need to redesign the poster to show that it is a poster and also both of the text should be editable weird if the other one is tawang but the other text is kpm its a whole different company"*.
- KPM is the distributor; the goods advertise a FACTORY's brand (TAWANG). A default "KPM" next to the brand reads as two companies on one item. The earlier fix (back = typed text, else KPM) was half of this - he had to say it twice.
- Now: a second text field per item (BACK TEXT on T-shirt / lighter, BOTTOM TEXT on the poster); empty = repeat the front word or print nothing. Never invent a word for him.
- "Show that it is a poster": a bare sheet read as a card. The tell is how a poster is HUNG - bars top and bottom, a cord - plus a printed promo layout (frame, a burst behind the headline). Same lesson as the lighter: the object must be recognisable from its silhouette, not from its label.

## 2026-10-26 16:00 — a pattern carries a meaning he will read before the brand (kpm da62fe1)
His words: *"your poster is look like some japanese propaganda bruh change it"*. The burst of rays from the centre of a red poster = the rising-sun flag. Fixed to a double frame (tobacco-label look). Rule: before shipping a decorative pattern on his goods, ask what a stranger in Indonesia would read it as - rays on red, a big circle on red, a red-white split all carry a flag. Plain frames and blocks carry nothing.

## 2026-10-27 — asked paper OR dark, he answered BOTH, behind a toggle (kpm 903091c)

Elder presentation board, A paper vs B dark: *"i want both light and dark version inside the ppt to be toggle button"*. Same shape as 2026-08-31 (given options, he designs another): when the two options are two LOOKS of one thing, expect "both, switchable" and price the toggle into the option table up front. Built as "Layar gelap" / "Layar terang" in the top bar, words only (a sun glyph rendered as an asterisk in the reading face), light by default.

## 2026-10-27 — never TELL a viewer about a part of the app the page does not SHOW (kpm 6355925)

His review of the elder presentation: *"vague because not even showed, just tell and the newcoming wont know what is that"* ... *"users wont even know what is peti when not showed"* ... *"read the whole ppt again and make sure that just dont tell the viewer something u dont show"*. I had kept the original's in-app names (peti, Putar Ulang Hari, Fleet & Roster, Notification Bell, papan WANTED, Di aplikasi: Journey Plan) as if the viewer already knew the app. A newcomer has never seen any of them.

**The rule:** a screen part or menu name may appear only when the picture on the same screen shows it. Otherwise write what it does for the business, in his trade's words (data histori penjualan, kompetitor, repeat order). Same root as "a mark whose meaning he has to decode is decoration" (2026-10-03), now for words. Encoded as a check: kpm `.claude/presentation/tests/elder.mjs` fails on the old words.

## 2026-10-27 — "all text is overwhelming": every screen a picture, the real app first

Third call on the elder presentation, same evening: *"make sure u add picture of our app real features just to show or u can use graph or maybe some ilustration"*. His order of preference is the order to reach for: a REAL screen of the app (the lab shoots them with no login), then a chart, then a drawing. On a phone the picture goes right under the title, before the sentences: it is what an older viewer reads first. Charts for this audience carry no numbers; the bar length is the message.

- 2026-10-27: *"yes add that line and dont hide the button"* - a control that cannot be used right now stays on screen and SAYS why (the Sales Terminal promo give box), never an empty gap. Same law as "every action must report".

## 2026-10-31 — a big button filled with amber is "too bright"; the "+" plate is the primary (kpm arrival flow)

Shown the arrival-flow board (Sales Terminal: GPS reaches a shop -> TAKE ORDER or a one-tap status; the Manifest as a left side panel), his whole answer: *"yes build that but change the fill color on the take order because it is too bright"*. The drawn TAKE ORDER was the MAKE DEAL button's amber gradient fill at full width and 60 px tall.

**What it confirms:** the law "AMBER IS AN EDGE AND AN INK. IT IS NOT A FILL." (2026-08-21) and the size refinement under it - a small amber thing is fine, a wide amber slab is not. Built as the ware "+" plate (`bg-[var(--duke-fill-plank)]`, amber edge, amber ink), the same family as the buttons he presses all day; in light mode the same tokens give a pale plate with brown ink. A self-check pins it (no `bg-` / `from-` / `to-` amber on TAKE ORDER).

**How to apply:** a primary action on a new sheet borrows the "+" plate, not the MAKE DEAL fill. He approved the layout and the flow in the same sentence - a colour note is not a rejection, so build the rest as drawn.


## One customer box, the promo list folds, a required step is a lit plate (2026-11-02, 17:06)

Three phone screenshots of the live Sales Terminal and two messages. Verbatim:

> *"btw i feels like we dont need 2 pelanggan textbox since we are be able to pull it from the side, just erase the top
> pelanggan box i guess, and also hide the promo goods on default and press it to open the promo goods panel just to
> save some space"*

> *"another thing to redesign is make sure that the capture button to be more visible because it is camouflage with its
> background"*

What it settles. (1) **Two controls for one value: keep the one inside the panel where the work happens.** The strip
above the manifest and the paper's Nama Pelanggan box opened the same picker; he cut the one OUTSIDE the paper. Its ✕
(the only clear button) had to move with it - a removal that strands a control is not the removal he asked for.
(2) **The fifth fold he has chosen** (after PROJECTED VALUE, ADMIN TOOLS, DEL/EDIT, the Journey store tools): the promo
goods are not used on every deal, so the list folds and starts shut. His 2026-10-27 "dont hide the button" still holds
- the header stays, is the press, and shows the pcs already given while shut. (3) **A dashed transparent button reads
as background.** Dashed edge = his NOTICE look; a required step gets a solid plate. Built: brass plate + dark ink
(6.4:1, was 2.7:1), the same plate as the selected MODE JUAL; MAKE DEAL stays dim until the photo exists, so there is
one lit plate per step. Built and pushed kpm `a79c0ca`; board `Raw/2026-11-02-terminal-tidy/board.png`. His reaction
to the brass plate: not yet given.

**CORRECTION, same evening (17:50).** The brass plate in point (3) above was a mistake, and a repeat one. His verdict:

> *"that button is really bad quality change that i hate it even the fill color is bad"* · then *"make the button 3D for that camera"*

It broke [[#🔴 AMBER IS AN EDGE AND AN INK. IT IS NOT A FILL. (2026-08-21)]] - the third time an amber/brass fill was
shipped after that law was written. The grep before designing looked for "camera", "collapse", "dashed" and never for
the colour about to be used. **Before choosing any fill for a control, grep this file for the colour word itself
(amber, brass, gold, fill).** What replaced it (kpm `f530178`, board `Raw/2026-11-02-terminal-tidy/board-key.png`):
the camera KEY - a black cap whose 6 px bottom border is its side (depth as a border, since Lite Mode strips
shadows), the camera in a round lens in amber INK, and the press his keys already make: the cap sinks 4 px into its
side and the 3 px amber charge line runs along the bottom while held. "3D" read the same way as 2026-09-03: physical
depth and a press that sinks, not lift and not WebGL. His reaction to the key: not yet given.

## 2026-11-03 — the presentation is his motion reference: "like the one we have on the presentation" (kpm cd8b942)

Asked for the EOD animation, he did not describe it - he pointed at his own deck: *"i want the animation like the one we
have on the presentation"* (slide 19 "Kartu Pemain": the XP counting up with source chips, the "Naik pangkat" banner, the
sweep, the frame zooming in). And *"the EOD animation should stay until all the level up or exp gain increase is
completed"* - a reward moment must not be cut short by a fixed timer; it ends when its story ends. When he names the
presentation, port THAT slide's timing (2.6 s count, 1.7 s rank-up hold) and keep the house rules where they clash (no
gold text, no shadow, no filter) - see [[The Player Card]].

## 2026-11-03 — the photo button belongs to the PAPER: his pick B "PHOTO CORNER" (kpm 49012b9)

After the black 3D camera key (2026-11-02) he said *"i want the button to be still in theme of the resident evil village
manifest paper not tech like this"*, and from three paper-themed options (ink stamp box / photo corners / typewriter key)
picked *"PHOTO CORNER"*. Read: on the manifest, a control should look like something printed on or pasted into the
paper - not a device sitting on top of it. "3D" was never the point; belonging to the paper is. Built: an empty album
spot, 4 black corners, a serif italic word, brown ink, no fill; the photo he takes sits in the same corners. Detail
that mattered: the frame must shrink to the photo, or the corners hold a letterbox instead of the picture. Proof:
A-Brain `Raw/2026-11-03-paper-key/built-board.png`.

## 2026-11-04 — asked for the main button on the paper, he took the quiet one: *"i like B better"* (kpm 9eae2d1)

Board: the real SIMPAN TRANSAKSI button as A printed block (black ink, amber bolt; my recommendation for being the strongest), B rubber stamp (no fill, double ink line; I captioned it "the easiest of the three to overlook"), C wax seal (ink frame, small amber disc). He picked B. Read with PHOTO CORNER (2026-11-03): on the manifest, looking like the paper outranks shouting, even for the one button every sale ends on. So do not recommend the loudest option on the paper by default, and do not expect a small amber mark to win him back to amber. The caption's warning did not move him; test it on a phone in the sun before treating it as a problem. Proof: A-Brain `Raw/2026-11-04-save-button/board.png` and `built-board.png`.

## 2026-11-05 — shown his own hatch beside a plain rail, he took the rail, then left the game theme: *"instead of gaming and not serious i want more serious"* (kpm none yet)

Board: Stock Opname review as A the hatch (my pick, on "the object wins"), B a rail of lit plates showing every warehouse's loss, C a deck of cards. His whole answer: *"i like B better but i dont like the animation, what if we make the animation and panel outside of our theme but take the color just not the design i want u to make it professional where real factory and business can use it, instead of gaming and not serious i want more serious, super ergonomics, super efficient and effective and business format panel u can do research on the internet for the website u can use framer website or 21stdev and any other animation for this, u can use your own claude design as well, use all the skills and taste that i already ask u to download to A-Brain for this one, give me the draft and i'll choose the design u generate, regarding your question, who can reject or accept the stock opname is the tier 3 and above as default, make sure this power added into the matrix for additional flexibility"*

**What it says:** the first time he has turned down his own loved object for a work panel, and the first time he has named a reader outside his own world ("real factory and business can use it"). So "theme beats efficiency" (2026-08-16) has a limit: a panel managers decide money on may need to look like a tool. **The colours stay and the material goes**, in his words: "take the color just not the design". He also rejected the motion on its own, separately from the panel.

**How to apply:** one data point, on one panel. Do not strip the rest of the app. For a new decision or money panel for high tiers, ask or draw the serious version beside the themed one, instead of assuming the world. His pick among the three drafts will say how far "serious" goes. Same pattern as 2026-08-31 and 2026-09-30: given options, he specifies a new brief.

**2026-11-05 20:49, his pick:** *"worklist is my favorite one, both pc and phone looks great"*. Of three business drafts he took my recommendation, the same answer on both devices, and asked for no changes: tabs with the loss on each, numbers on top, the list starts on what still waits. So on a money panel for high tiers, the plain worklist is proven. Live kpm d16c9ad.

## "i hate the amber fill color": the Stock Opname tabs (2026-11-06 19:21)

> *when we got the quota i also want u to redesign those button because i hate the amber fill color*

"Those" = Monitor, HQ Audits, Quarantine, New Count, the row in the picture he had just sent. **Third time on the same point:** "use it for little things", then 2026-10-20 *"and remember i dont like this full amber fill the panel"* (see "The switches were amber slabs"). My miss: the same morning I gave all four tabs one look (kpm df98751) and kept the amber slab on the chosen one, without reading that section. Nobody asked for the slab; it was what was there.

**How to apply:** a chosen tab is a mark, not a slab: `--raised` + gold word + a thin gold bar is the answer he already accepted on the switches. Before shipping any tab, switch or chosen state with `bg-[var(--gold)]` over a whole button, read that section. Not built yet: next job, frames first.

**2026-11-08 05:52, his pick:** *"2 all"*. Shown two looks without amber on the real Stock Opname tabs, he took the quietest one, a plain word with a 2px gold line under it, **over my recommendation** (a dark plate + gold bar, his own Settings switch look), and asked for it on every tab row that still had the amber fill. So on tabs he wants no plate at all, not even a dark one. **How to apply:** when drawing a chosen state, draw the no-fill option first; a plate is the option that has to earn its place. Built kpm 23abaa3; board `Raw/2026-11-08-tabs-amber/built.png`.

**2026-11-08 06:14, on the Stock Opname warehouse tabs:** *"i want u to put some space or line to misah each of the regional warehouse because it is look like its one part"*. A tab row with only an underline under the chosen one read as one block to him: neighbours need their own mark. Built a hairline between tabs (kpm 62c9f83). **How to apply:** in a tab row with no plates, put a quiet divider between tabs.

**2026-11-08 07:04, his pick:** *"1 better"*, for the Same as last time buttons: no fill, a gold edge around a plain word, over a dark plate with a gold word. Second time in one day he took the option with no plate. Built kpm cca32e1.

**2026-11-08 08:57, his pick:** *"1 is easier to find use that"*, for where a damaged pack put back on sale sits on the Sales Terminal shelf: right after its own pack, over all damaged packs at the end under a thin line. His reason is finding, not looks. He did not object to the crate button or the price box drawn beside it. [[2026-11-08_quarantine-sell-again-board]]


## A count badge must move, and a plain circle loses even when it reads (2026-11-08)

Shown three static count badges on the HQ Audits tab (solid red circle 6.42:1, red ring 8.04:1, soft fill 6.59:1 - all legible, all fixing the 4.02:1 of today): *"all looks bad, i dont like all"*, then *"i want small animation and effeect for that"*. Same lesson as the map counter (*"change the circle and number to better symbol"*): a counter is an object with a small life, not a coloured dot. Passing contrast got none of them picked. Round 2 offered the app's nixie tube, a red tag with one ripple, a red edge with a passing shine - each plays on arrival or change and stops (his 2026-09-18 "too much of those blinking light"). Board: Raw/2026-11-08-badges/.

## "Most professional" = the price list: ruled lines beat cards for the business look (2026-11-11)

Shown the Sales Terminal as Today / A Tidy (today's cards, smaller) / B Price list (one ruled line per product, a table with columns on the PC, the day's numbers in one strip, a cream order slip) / C Cashier (picture tiles, one tap adds one), phone 375 and PC 1440, his words:

> *"B looks the best i think it looks most professional"*

- For the professional edition he took the densest, quietest option: 8 products before scrolling on the phone against 5 today, no card frames, sentence-case labels, one letter style. Same instinct as "doesnt take a lot of space" (2026-09-17) and "Cleanest won" (2026-09-03).
- He did not mention the cost named beside it (the big 3D pack picture goes; the phone photo is 44 px wide). A picture is not what "professional" means to him on a selling screen.
- This does NOT undo "flat cards read as a template" (2026-10-06): that was a presentation scene. On a work screen, rows with visible rules, tabular numbers and a strong total read as business software to him.
- Same message: the game look is his resume and must stay showable beside the professional one - saved as kpm tag `game-edition-v1`. Board + note: Brainstorm/2026-11-11_full-redesign-sales-terminal-directions.md.

## Shown B built, he asked for MORE of it: the top bar, the shopping list, and the capybara off the panel (2026-11-12)

Shown the built Sales Terminal in direction B (boards BUILT-PHONE.png / BUILT-PC.png, kpm cb8f5244) with two questions - rebuild the shared top bar as one row, and keep the rubber-stamp save button or a dark plate:

> *"yes we should redesign to make it more professional, make the shopping list professional as well, and dont forget the capybara on the right is blocking the shopping panel"*

- "Professional" reaches every part of the screen he can see: the header that was left in the game look, and the order lines that were still boxed, dashed cards. A half-converted screen reads to him as not done. Convert the whole visible surface of a screen, or say which part is left and why, before showing it.
- He answered the stamp question by scope, not by name: the save button went with "the shopping list". His own 2026-11-04 stamp pick did not survive the professional edition - a pick made for the game look is not a pick for the professional one.
- **The capybara may live on a work screen only where he takes nothing from the work.** He named it himself, unasked. The drawing he picked had the room on top of the order slip; built, the room held 280 px of a 651 px panel and the total was under the fold. A mascot that costs the order panel its space is "blocking", even when it is exactly where the drawing put it.
- Built from it (kpm 1695539c): ruled order lines, the item's money beside its name, Total pinned with a dark save button, the PC screen fitted to the window, the room scrolling away with the order, his corner visit only while he speaks and at the bottom-left. Board: Raw/2026-11-11-redesign-today/PANEL-V2.png.

## 2026-11-12 — the item-type strip beside the search: "redesign this panel"

> *"i want u to redesign this panel that show type of the items here and also looks like promo doesnt have add button"*

What he circled on the Sales Terminal: SEMUA / SKT / NATURAL / SK... as plain words with a gold underline, squeezed into 58% of the phone row beside the search, the lit one cut in half, directly under a second underlined row (the stock sources). Built (kpm 00cf1b51): bordered buttons on their own phone row, the lit one takes the gold edge. **No verdict from him yet.**

Second half of the sentence: a count he can only TYPE reads to him as "no add button". A number box needs a minus and a plus beside it, like the product rows. Applied to the promo goods on the order slip, and a plus mark was added to the package card (one big press that did not say so).

## 2026-11-12 — a control that LOOKS like the others must BEHAVE like the others

> *"but there is no minus button on the promo and i think we should add limit option on the promo as well manageable by tier 3 and above on default also there is no SFX and animation on the button press, unlike others add and minus button, btw what i meant before was not promo but paket i was wrong"*

The package card had been given a plus MARK (a drawn square, not a button) and a count. He read it as a broken button within one look: no minus beside it, no click sound, no press movement. Rule taken: when a new control borrows the look of an existing one, it borrows ALL of it - the partner button, the sound, the press animation - or it does not borrow the look. Built (kpm 6257a8df): − n + on the package card with the product row's own classes and sounds.

Also: his word "promo" meant PAKET (the package offers), not the promo goods on the slip. Ask which SCREEN when a noun has two homes; the first build answered the wrong one (the − + on the slip stays, it was missing too).

OPEN: the package limit (his idea, "manageable by tier 3 and above on default") - what the number counts is his to pick; asked 2026-11-12, see PROGRESS.


## 2026-11-13 — the game look gives way to a professional one, motion stays

> *"switch to plain words and i want better professional pin looking but stays animated but simple and clear and effective"*

His answer to the Journey Plan ideas talk (tiers 2-6, phone and laptop). Two calls in one line: the game words go (Mission Feed, Engage Target, Secured became Today's Route, Sell, Visited; kpm 97ea6d3b), and the pixel chests on the map become professional pins. One thing from the game years stays on purpose: motion. Read it as the default for any "professional version" work: plain words, clean shapes, one small animation with a job, never a still screen.

Board: Raw/2026-11-13-map-pins/board.html (artifact CAdePSN2SQamUsQv5BJoBs): A drop pin that hops, B round pin that pops (my pick), C flat dot that fills. Round 2, same day: *"the pin is too small to show its content i think, what if some flag or something? so that it will be more clear to show the store status after visit"*. The 14 px picture in a 24 px pin head was the problem; his own idea, a flag, became the board: a visit plants a flag (A, 18 px picture), a flag with the word (B), or a bigger pin (C), my pick A. Lesson for map marks: the result of a visit must read from arm's length on a phone, so it gets its own shape (flag vs pin), not only a colour and a small picture. Flags taking over meant his old red flag for "no salesman" becomes a red ? pin in A and B, told to him on the board.

Round 3, same day: he picked **B** (flag with word, "because it is clear") and asked *"i want the animation to be more clear as in looks like the words and symbol is knitted on the flag ... the flag and the content inside it is not in line and not naturally connected right, i want more realism on this, the effect when flag capture was really nice i like it"*. Round 2 tilted the cloth as one flat sheet with the word laid on top and the picture popping in on its own, so it read as a sticker. Round 3: cloth, stitched hem, picture and word are one drawing; a wave runs from the pole to the tip, every letter rides and tilts with it, the folds shade the word too, and the rise he liked stays. Lesson: anything printed on a moving surface moves with the surface, never on its own clock.

OPEN: his "build".

## 2026-11-14 — the pixel man stays; he must DO something to the flag

Shown three new looks for the salesman beside the new flags (A an initials patch, B a location pin, C a flat figure; board 2tnxGyfVT1Fr9hJqVRyE7c), he kept the old one:

> *"actually i like the pixel guy better, but instead of opening chest we should do something to make it look like its interacting with the flag instead, what do u think?"*

- The professional turn of 2026-11-13 stops at the man: the markers that carry data went plain, the character keeps the game look.
- The object wins again, now as an ACTION: the man has to do something to the thing at the shop (the chest opened; now the flag), not stand beside it holding a prop. Today's coin is a prop, and it shows at closed shops too.
- Board: Raw/2026-11-14-man-flag/board.html (artifact N2RJeQQbiZMzCwQxFKZsQZ): A plant it, B hoist it (my pick), C cheer. [[../../Brainstorm/2026-11-14_pixel-man-and-flag]]

Picked 07:55: *"plant it looks the best"* - A, over my B (hoist). He chose the bigger, harder motion again: the stab reads from arm's length. Built the same morning, parked with the pins (kpm wip/map-pins 10a66db7).

## 2026-11-14 — "ship and yes": the planting man everywhere, and a paper for the busy admin

> *"ship and yes, and also add paper like Todays log that can be printed when admin doesnt want to see the whole animation for each of the person to see its activities in a single paper page"*

- "yes" = the Day Replay's man plants the flag too, instead of holding up the coin / crate / note. One scene, the same everywhere (kpm 7a3dc370, live).
- He keeps the animation and adds a plain way around it: the replay stays for watching, a paper for checking. Motion is for the moment; a record is for reading.
- Board: Raw/2026-11-14-day-log-paper/board.html (artifact 9p4FCMUngPDqijLBvbuifL): A one salesman per sheet (my pick), B the team on one sheet, C one salesman with his route. [[../../Brainstorm/2026-11-14_day-log-paper]]

OPEN: his letter.
Picked ~08:50: *"we need both C and B one to see all and one to see each person, B is a good dashboard, buth make sure that u make it clean and clear"* - not my A. He took the route drawing (C) over the plain list for one man, and the team sheet as a "dashboard". "Clean and clear" on a paper = fewer marks per line: the board's B (a strip of tiny squares in three looks under every man) was the busiest of the three.

2026-11-14 ~09:15, mid-build of the Day Log paper, on the board's route drawing (pins + dashed line on a blank box): *"seeing the receipt and location should also show the map in full and its regional information, because drawing of map pins and lines doesnt give any information really"*.
- A location he will read must sit on a REAL map: streets, place names, the area borders and names. An abstract sketch "gives no information" even when it is accurate. My board had sold the sketch as "prints clean"; clean without context lost.
- Built that way (kpm 1a3a934a, live): Esri street map in grey, Journey Plan's own area borders + names, "Areas: Muntilan 6 · Mungkid 6" under it, the pins numbered on top. B (the team sheet) made cleaner than the board: one row of even marks per man, totals at the bottom.

2026-11-14 09:30, on the paper map (his crop: two area names run together, a pin on a letter): *"make sure this features is maximized first and make sure that there is no intersection in words and make sure it looks the best for phone and pc"*.
- No text may touch other text or a marker, at ANY size he will see. A layout that is right on one fixture is not enough: prove it with a hard case (things metres apart) at the phone size AND the PC size. Built as a check (kpm 0fc4318c).
- "Best on phone" = its own frame drawn for the phone, not the PC picture shrunk.

- 2026-11-14 - Day Replay, a pressed shop on the phone map: shown NOW (the card names the shop, no pin is marked) beside an example gold glow + ring on the pressed pin, he said *"q2= sure"*. Taste: what you pressed must show on the map too, not only in the card. Board: `Raw/2026-11-14-day-replay-mark/board.png`.

## 2026-11-15 — Fleet & Roster: four polish fixes refused, "it's all gamified", a professional one wanted

Shown a TODAY vs PROPOSED board of four measured fixes inside the game look (leaders crowned, phone title + swipe row, a glide + gold bar for van loading, one number said once):

> *"well i dont want all because its all gamified tbh we need to create e new professional one, research and give me an idea to do that"*

- Polish on a game-look screen is not what he wants any more: the 2026-11-13 turn (plain words, professional shapes, motion stays) now reaches Fleet & Roster, chests included. Do not offer fixes INSIDE a look he is leaving; offer the professional version.
- His September asks (Minecraft chests with sound, the 3D crate, the stage) were picks for the game look; like the stamp on 2026-11-12, they do not carry into the professional edition. The game look stays showable in tag `game-edition-v1`.
- Answered with a direction drawn on the lab's real numbers: the roster as a ruled table (leaders on top), the load as a sheet (warehouse / in van / last day sold / − n +), "Fill suggested" = last day's sales minus what is still in the van, one gold Load button. Board: Raw/2026-11-15-fleet-review/pro-board.png. [[../../Brainstorm/2026-11-15_fleet-roster-review]]

- 2026-11-15 18:0x, on the options artifact: *"its hard to see when i scroll up and down can u readjust the formatting"* - a picker whose choices and result are a scroll apart fails him; the choice and its effect must share one screen (side column on the PC, a pinned bar on the phone).

- 2026-11-15 18:4x, his pick from the options artifact: *"this is my personal favorite My Fleet & Roster picks: Team list A Ledger table · Loading 1 Load sheet · PC Y Slide-over panel"* - the densest table again (same as the Sales Terminal "price list"), the typed sheet over the two-list transfer and the slip, and on the PC a panel over the list rather than a split or a new page.
- Same minute: *"but make sure the animation is smooth and elegant and not flickering"*. The artifact had given him a flicker: the slide-over replayed its entrance on every − + press. Motion rule for the professional edition: an entrance plays once per opening, transform + opacity only, nothing re-mounts on a press; prove it by sampling, not by a frame.

## 2026-11-16 — Fleet & Roster live: the panel must close the way it opens, edges must be clear, and the sheet is too small

On the live demo, the day the professional Fleet & Roster went out (kpm 62f5615d):

> *"i want border between name panel and goods panel to have some kejelasan that these panel are different. and also i want when u press the name again it will close the screen again so there is 2 way to close the right panel screen, by pressing the name and the X button make sure closing and opening close for the appearing panel to be smooth and high quality but professional ... i want clearer border between tier 4 and lower tiers, i also feels like the product options screen on the right is too small and it can only show 2 products at a time, i want u to redesign it so that it looks bigger ... u can just blur all the screen and only name and the right panel is the only panel that is not blurred ... but u must think how this method could work in the phone as well tho, or maybe u have another option u can tell me"*

- A 1px rule between two panels is not enough for him when both sit on the same surface: he wants the difference SEEN (kejelasan), and the same between the leaders and the salesmen. Quiet ruled lines are right INSIDE a table, not between two different things.
- Whatever opens must also close, and the way back must be where the way in was (press the name again), plus the X. The close is part of "smooth and high quality but professional" - a panel that slides in and then vanishes reads as cheap.
- Two products in view is too few for a work screen: he measures a panel by how much work fits in it, and he offered his own fix (focus mode: blur everything but the name and the panel) while asking for alternatives and for the phone to be thought through.
- The demo is held to the live app's standard: a panel whose top is cut under the demo bars is a bug "since this a demo".
Options named to him in chat: A focus (his), B tall panel no blur, C wide (names column + big panel). Board sent 2026-11-16 17:47 (Raw/2026-11-16-fleet-build/board.png): products in view on PC today 3, A 8, B 4, C 5; phone 3 -> 5. "name" in his blur idea = the NAME PANEL (his own word for the list in the same message), so A keeps the whole list sharp and pressable. [[../../Brainstorm/2026-11-16_fleet-bigger-load-panel]]

## 2026-11-16 — the bigger load panel: he took his own idea (A, focus) and named the motion in the same breath (kpm c497b4c1)

> *"can u show me through artifact instead so that i can decide better"* - then: *"A is good make sure it well animated and smooth with the design skills u have"*

- He decides better from a page he can press (cards that swap the real-app frame, a "show today" toggle) than from one board image. A design pick goes out as an artifact first.
- He picked the option that hides the most (the day numbers) for the most work in view (8 products vs 3): on a work screen he trades context for capacity, as long as the way back is one press (the dimmed part closes it, the name list stays usable).
- "well animated and smooth" is part of every visual order now, not polish: the veil and the panel move as one, the entrance waits 40 ms so it starts after the slow first frame (it skipped a third of itself without that), the exit is faster than the entry. Sampled per frame before the push.

## 2026-11-16 — "fine" is not a yes to build: the Surat Jalan

> *"A is fine but not really special tbh"*

- Asked to pick a minimal Surat Jalan, he accepted the calm option and in the same breath said it lacked character. Minimal for him is not plain: he wants one memorable move (a big title, a band, a stamp box) on top of the calm. Next time a "minimal" board goes out, every option carries one distinctive element, and the plainest one is the baseline, not the pick.
- Same message, on the load sheet: *"1 press is 1 slop and 1 slop is 10 bks but i think u should add button where i can increase the add button by 1 or by 10"* - he keeps the trade's unit (Slop) and wants a finer control beside it, not a replacement. Built as "Each press: 1 Bks | 1 Slop" (kpm 54ff882f).

## 2026-11-16 — for a paper, neutral beats character: he took B over the "special" A3 (kpm b10ce952)

> *"i'll choose B black and white it is more netral i guess"*

- Twenty minutes after asking for something more special than A, he picked the plainest board option for the printed Surat Jalan. Read together: on app screens he wants character; on a business paper that leaves the company, he wants it neutral. Do not carry "make it special" from a screen over to a print document.

## 2026-11-17 — Master Vault: "solid", but the professional look keeps what he built

> *"actually its look solid, 3D slider is important we need to keep it somewhere, and the background yea we also need it but since we are on new theme, make sure it is professional and not kaku and looks minimalistic but cool"*

- The ruled-table picture passed on the first look (one picture, no options board - the 12-screens-by-20-November pace works).
- A professional look may MOVE his features, never drop them: both features the picture removed (3D size sliders, background picture) came back in the same message. Before showing the next screen's picture, list every feature it moves or hides and say where it went.
- "Minimalistic but cool" for a picture behind content = blurred, faded, desaturated, behind one element only (the 3D box), fading into the page. The full-strength photo competed with the product (lab frame pc-1440-bg.jpg) - calm wins. "kaku" = stiff.
- Built: kpm ad0b7d5a. Frames: Raw/2026-11-17-master-vault/.

## 2026-11-17 08:0x — "i really hate the simple amber fill button dont make it again"

> *"just edit this panel so that it look professional as well and please i really hate the simple amber fill button dont make it again change it and make sure all the button animation are nice and clean"*

- Third time the same answer: 2026-11-08 "1 better" (no fill, a gold edge around a plain word), 2026-11-08 "2 all" (a plain word with a gold line), now said in anger after the first professional Master Vault shipped a gold-FILLED Add product. The rule is settled: **no amber/gold fill on a button, ever** - the gold is an edge or a line, the word stays plain.
- Built as `.kpm-edge-btn` (kpm theme.css, 37a93664): gold edge, see-through, hover = an 11% gold wash fading in over 160 ms, press = sinks 3%, keyboard = gold outline. `.quiet` and `.danger` for the others. Guarded by a logicFixes check on Master Vault; every next screen joins that check.
- "nice and clean" motion = colour and a small scale only, short (140-160 ms), nothing bouncing or rotating.


## A look he likes can still be a layout he can't work in (2026-11-17, Stock Opname picture)

> *"design is fine but format for the stock opname is confusing i want u to make it more tidy and easier to work at"*

He split the two on his own: the LOOK (tokens, edge buttons, underline tabs) passed; the FORMAT failed. The first picture
made every product a tall card with its own mix of boxes, a four-cell verdict strip, chips and panels, so no two rows had
the same shape and the boxes moved from row to row. His word for that is "confusing"; his ask is "easier to work at".

What answered it (picture v2, https://claude.ai/artifact/RgwzugPr456zKvjasEYRT1): ONE ruled table, the same columns on every
row (Expected good · Good · Expected damaged · Damaged · Difference · Status), so the hand types straight down; a row that
needs an answer opens ONE question directly under itself and every other row stays one line; a progress bar + "Needs you"
filter on top; cigarettes (Bks) and promo (pcs) as two groups. **Rule for every work screen (a count, a cart, a form he
types into all day): judge the format by "can the eye and the hand go straight down", separately from the look.**

**v2 -> v3, same day, 13:38:** *"almost good, why is there so many information and writing, simplify those and make it aesthetic and not confusing"*. Tidy (one table) was not enough: every extra column and every explaining word counted against it. v3 kept 4 columns, put the expected figure as a dim "/ n" beside its box, cut each state to one or two words and each question to its chips. **On a work screen, words are cost: a label he must read every row is clutter even when it is true.**

**v3 -> v4, 13:44:** *"i dont like it here i feels like there is no effort at making those can u make it clearer and make it looks better, should try researching"*. Cutting words (v3) read to him as cutting EFFORT. Simple must still look made: v4 = master-detail (list + the product in hand), drawn icons, a real summary line, the Bal/Slop/Bks helper and the Rupiah of a gap - more craft, not more text. **"Simplify" from him means fewer words on the surface, never a plainer build.**

## 2026-11-17 - from five Framer motions he picked the two plain ones
Shown 5 Framer marketplace components (rolling digits, sliding tab marker, spring accordion, toast + self-drawing checkmark, count-up row). His words: *"1 and 4 is simple and look good"*. He picked rolling digits and the toast checkmark, the two that carry a STATE change (a number changed, a save landed), and passed over the decorative ones. Same taste as "simple" in the panel outro story above. Board: Brainstorm/2026-11-17_framer-motion-picks.md.

## 2026-11-17 15:18 - he played the motion board and approved it
*"animation is good i like it"* - rolling digits + self-drawing check went live (KPM f6152ec5). He judges motion by playing it; the board with a Lite Mode switch was enough to decide.

## 2026-11-17 17:49 - Receivables: the quiet v4 list was "too simple"

> *"well it is too simple i want it to look more professional and business like with the professional theme color and the animation of course, make the debt on the demo as well of course to show its features"*

- The v4 rule (master-detail, one summary line) is a FORMAT, not a ceiling. On a money screen "professional and business like" means the tools a finance person expects: an aging bar (Safe / Due soon / Overdue in Rupiah), a tempo-used bar per row, the notes and their history in the shop in hand. Same lesson as Stock Opname v3 -> v4: fewer words is fine, a thin build is not.
- "the professional theme color" = the app theme tokens (stock-opname-pro.html, light and dark), not a draft's own browns.
- "the animation of course" - motion is expected in every picture now, not asked for: rolling digits on money, bars that grow once, the detail fading in on a new pick.
- He wants the demo to SHOW a feature, so a screen whose feature needs data (debt) gets that data in the demo in the same job.
- Picture v5: https://claude.ai/artifact/PuX2thEyaC84BjjoPCAR1t

## 2026-11-17 18:03 - Receivables: shown A (late line) and B (salesman cards), he kept C

> *"show me dont tell me and ask me i cant imagine what u mean"* (after options described in words) -> *"i feels like C is still the best but dont forget to add the agent who responsible in there as well"*

- Options in words do not reach him; drawn and playable they do - and then he often keeps the plainer one (same as the Surat Jalan pick).
- On a debt screen WHO is responsible is a first-class fact: a Salesman column in the list and a "Responsible: <name>" chip on the shop, not a grey word in a sub-line.

## 2026-11-18 - Reports: "keep this UI", and no profit figure

> *"we have no information on calculating profit here only omset which is revenue but overall it looks great tho, make sure u keep this UI and make sure that all the previous information available on game version also available here"*

- The playable Reports picture (https://claude.ai/artifact/S11MofDxEps7oMtX6GRoJq, kpm `.claude/drafts/reports-live.html`) is APPROVED as the look: one dense KPI strip, ledger by day, receipt in hand, rolling digits, self-drawing check, built-in confirm boxes, owner/regional/salesman views. "More professional and minimalistic but contained a lot of information" = many facts, few words, each fact in its own small cell.
- **Never show profit / cuan / margin anywhere.** The app keeps no real cost price, so a profit number is invented. The money word on report screens is **Omset** (his word). The old screen's "Net Profit (Cuan)" tile goes.
- A redesign is not allowed to lose anything: every element of the old ("game version") screen must still be reachable - checked against Antigravity's element map (Task 24) before showing him.

## 2026-11-18 - Customers: a concept that hides features reads as "lacking"

> *"well its not that i dont like the first design u bring but it is just untidy, in this one all 3 options looks like all are lacking of information unlike the first one, well i want u to show all the features on that UI so that u can show me each of the option are not lacking of that information for example even the GPS or Google strettview and competitor intelligence not even shown there"*

- Layout options must be drawn FULL: every feature of the current screen visible in each option (GPS, Street View, competitor prices, approvals, admin tools, edit form). A thin sketch is judged as a thin design, not as a layout idea.
- "Untidy" (his word for the first Customers picture) is about too much in one view at once, not about too much information. He wants the information kept, arranged better.
- Board v2 with a feature checklist per option: https://claude.ai/artifact/LMBj8wJEqRe5ryrpqe5F3N

## 2026-11-18 - Customers: competitor intelligence and location get their own place

> *"u need to make competitor intelligence for each of the stores in each own segment because it is a very important features to be have here i want to make a special place and UI for it so that it doesnt combined with the store information, as well as the streetview and the gps map"*

- A feature he calls "very important" gets its own section with its own UI, not a card next to the facts. In Customers C the shop now has three tabs: Shop info / Location (big GPS map + Street View, copy GPS, directions) / Competitor intelligence (summary, rival vs our nearest Cello price bars, shelf + promo + selling speed, dated history).
- Shop info keeps a one-line glance of the other two (tap to jump), so nothing is hidden.

## 2026-11-19 - Customers: side-by-side compare, the user picks both sides

> *"add some comparison features maybe side by side, we can choose one of our competitor products and it shows comparison of our choosen product so the one who decide what compare of what is the users and make it ergoomics and easy to use and see and make sure that all control is on our side"*

- He wants the USER to decide what is compared, not the app. The old list paired each rival with "our nearest Cello" automatically; the new card has two pickers (ours left, rival right) and nothing is locked.
- Read as: our product always sits on the left (our side) and holds the gold edge; the rival is on the right in rust. "All control is on our side" may also mean something else - asked him, waiting.
- A picker must show the FULL name: on the phone a native select cut "Cello Coffee & Cara". Fixed by showing the name as wrapping text with an invisible select over it (tap the name to change it).

## 2026-11-19 (later) - Comparisons are paired BY US, and rivals get categories

> *"i feels like this comparison also need to be added by us because we are the only one who knows which of our product that is can be compared with what product this way our comparison can be apple to apple"*
> *"since this app is not only for cigarettes then we should be more general on this, my recommendations is that u need to make features to add category for the competitor product"*

- Correction to the morning reading: "the user decides" meant the COMPANY decides the pairs, not each salesman on the spot. Free pairing was too loose for him.
- Like-with-like is the rule: a rival is compared only with a Cello product in the same category. The picture makes a cross-category pair impossible, not just discouraged.
- Keep it general: categories are data he adds, never a fixed cigarette list (the app is not only for cigarettes). Category names stay his (see the law on naming his trade's categories).

## 2026-11-19 (09:55) - Review of the Competitors / Customers v5 / Master Vault pictures

> *"make sure the segment button is clear because looks like it is similar with other button and too blend inside the UI that its hard to see those button if not pressed"*
> *"i rather u add button and the panel of adding customer shows up infront of u and blur other"*
> *"make the spacing better here because looks like all the panel just combined into one u can make some border or anything"*
> *"make sure buttons little bit bigger especially for phone and outline it for easier and faster navigation"*
> *"make sure its category can be expanded and retract, but retract on default because there will be so many products out there"*

- Tabs drawn as plain text with an underline read as "not a button" to him. Segment controls need a visible outline on EVERY option, not only the selected one.
- A form that is not the main job of a tab (Report a rival inside the shop tab) goes behind a button and opens as a front panel with the background blurred.
- Panels must not touch: each block is its own bordered card with clear gaps. "Combined into one" = missing card edges and gaps.
- Buttons: bigger (phone tap size) and always outlined.
- Long lists that will grow (rival products by category) start collapsed.
- He also caught that a picture tab named "Sales terminal" looks like a SECOND sales terminal - never reuse a real screen's name for a preview.
- Native `<select>` dropdowns show the browser's blue highlight - breaks the palette law; use a searchable in-page picker.

## 2026-11-19 (11:00) - Competitors screen approved; NOO must shout; Undo; prices in full

> *"competitor screen is good"*
> *"make verify noo have better button visibility as i want the admin to realise if there is NOO verification to do, its hard to see and realise which of the new stores are NOO stores and old stores"*
> *"other thing that we need on this app is undo button especially when doing accidental fatal pressing like deleting data"*
> *"for master vault i just want the stock number to be visible and also show all the price level for that product not just the grosir one"*

- A pending admin job must be visible from the LIST, not only inside the record: new (NOO) shops get their own mark so old and new shops never look alike.
- He wants a second safety after confirm boxes: an Undo right after a delete.
- On a product card he wants the stock as the main number and every price level, never a single price standing for all.

## 2026-11-19 (11:53) - Pictures approved; every queue must explain itself

> *"all good but what is this for tho?"* / *"make a better description for these so that the users now what is this confirmation not just no pic and also reword the Grosir? doesnt sounds professional there make sure all the features is available on phone as well"*

- He approved Competitors, Customers C v7 and Master Vault v3 ("all good").
- A queue or confirmation needs a one-line WHY under its title ("Nobody is in charge of these shops, so they get no visits..."). A short code like "no PIC" or a question-mark badge like "Grosir?" reads as unprofessional to him.
- Feature parity on the phone is a standing ask: every PC action must be reachable on the phone too.
- 2026-11-20: Quarantine picture (no chest, artifact Bn1mQv8w7KBroWVUcg2NQV) APPROVED - his words: *"this looks professional and its look fine make sure the animation is on point and u can use framer or 21dev to find the best animation for that"*. Motion polish is the next ask for approved pictures; must still survive Lite mode.
- 2026-11-20: on the Quarantine animation pass: *"nothing special really but its working and the ui is fine i think we still need the biohazard glowing symbol somewhere inside here just to make it clear that this is the damaged segment"*. So: a professional screen may keep ONE themed marker that says what the place is (biohazard = damaged goods) - one symbol, not the old game look; its glow must stop in Lite mode.
- 2026-11-20: EXCEPTION to the no-green palette law, his call: *"make sure the glow is green and easy too see"* (the Quarantine biohazard symbol). Green is allowed for THAT one biohazard marker only; the rest of the app stays slate + gold.
