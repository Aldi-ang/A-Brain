---
title: Aldi's Design Taste
description: What Aldi actually likes and rejects in an interface, built only from things he said about real screens. Written on his instruction — he wants his taste learned, not guessed at each time.
type: concept
created: 2026-08-10
updated: 2026-08-16
confidence: medium
checked: 2026-08-16
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
