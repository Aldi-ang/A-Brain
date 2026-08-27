---
title: Aldi's Design Taste
description: What Aldi actually likes and rejects in an interface, built only from things he said about real screens. Written on his instruction — he wants his taste learned, not guessed at each time.
type: concept
created: 2026-08-10
updated: 2026-08-27
confidence: medium
checked: 2026-08-27
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
