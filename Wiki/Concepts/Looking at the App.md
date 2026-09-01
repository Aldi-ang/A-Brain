---
title: Looking at the App
description: How to actually see a KPM screen before claiming a visual fix — the theme lab harness, why the dev server cannot be opened directly, and the three ways the harness lied before it told the truth.
type: concept
created: 2026-08-16
updated: 2026-09-01
confidence: high
checked: 2026-09-01
tags: [pattern, verification, design, tooling, kpm]
---

# Looking at the App

**Every colour decision on KPM until 2026-08-16 was made blind.** Aldi's instruction, after three
"fixed" claims in a row that were not: *"if the browser is broken then fix it until u can see it"*,
and just before it, *"make sure u check the app first before moving on"*.

## Why the app could not be opened

Two independent blocks, and each one alone is enough:

1. **The dev server is HTTPS with a self-signed certificate**, and the in-app browser refuses it.
   ⚠️ **That is deliberate and must not be "fixed" to http** — his phone needs a secure context for
   `crypto.subtle`. See [[Secure Context Requirement]].
2. **The app needs a Google sign-in** before any screen renders at all.

So no frame of this app had ever been captured in this environment, and *"it should look right"*
was doing the work that looking should have done.

## The harness

    npm run build
    PORT=4181 node tools/theme-lab-server.mjs      # -> http://localhost:4181/

`tools/theme-lab.html` renders the control-system markup — glass header, Command Center head, tab
list, modules, switch, chips — against the **real built stylesheet**, over plain HTTP, with no
login. `tools/make-preview.mjs` inlines that stylesheet into `tools/theme-preview.html`, a single
file Aldi can double-click with no server at all.

⚠️ **The dev server is untouched and stays HTTPS.** This is a second, separate, read-only server
over `dist/`.

**Rebuild first.** The lab reads `dist/`; a stale build is a stale lab.

## THE FRAME, FINALLY — headless Chrome (2026-08-16, second session)

Everything above this line is a **measurement** harness: it reads computed styles and reports
ratios. It proves a mechanism. It cannot prove an appearance, and for two sessions that gap was
reported honestly and left open — the in-app Browser pane answers
*"the Browser pane is not displayed, so the page is not compositing frames"*, `agent-browser`
hung for 1801s and aborted, and there is no playwright or puppeteer in `node_modules`.

**The way through was already on the machine.** Windows 11 ships Edge, and this machine also has
Chrome. Either will render a PNG with no install, no dev server, and no login:

    "/c/Program Files/Google/Chrome/Application/chrome.exe" \
      --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=2500 \
      --screenshot="<abs>/out.png" --window-size=1000,420 "http://localhost:4180/"

Then **read the PNG** — the Read tool displays images, so the frame arrives as something to look
at rather than something to assert about. Edge lives at
`/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe` and takes the same flags.

Two details that decide whether the shot is worth anything:

- **`file://` works too, with `--allow-file-access-from-files`**, linking the built stylesheet by
  absolute path. That is how a component the showroom does not contain (the sidebar rail) got
  looked at without touching the repo — a scratch HTML file, the real `dist/assets/index-*.css`,
  and **the real Tailwind class names copied out of the JSX**, so the cascade under test is the
  shipped one including Tailwind's file-order win. A harness that drops the arbitrary-value
  classes is testing a different stylesheet than the app ships.
- **Screenshot each theme as its own shot** (`#dark` toggling `html.className`), never a dark
  island nested inside a light document: `html.light .kpm-rail-mark` still matches inside the
  island, so the nested version shows the light rules on a dark ground and proves nothing.

⚠️ **The build hash changes every `npm run build`,** so a `file://` harness written before a
rebuild silently loads a 404 and renders unstyled — the exact failure mode described below. Point
it at the stylesheet that declares `--ground:` and re-point it after every build.

**What looking bought that measuring could not, the same day it was first used:** the darkened
placeholder passed 4,5:1 and looked *identical to a typed value* in light mode, because
`--ink-dim` and `--ink` sit close together there. One number said pass; the frame said an empty
field now reads as a filled one. The fix was italic — shape, not colour. See
[[Aldi's Design Taste]].

## The three ways it lied before it told the truth

All three produced *confident, plausible, wrong* readings. Guard against each:

1. **Colours read at t=0 of a transition return the PREVIOUS theme's values.** `.kpm-btn` has a
   120ms colour transition, so flipping the theme class and reading synchronously reports the old
   colour. This nearly shipped a false *"the buttons don't flip in dark mode"* bug.
   → **Inject `*{transition:none!important;animation:none!important}` before measuring.**
   ⚠️ This was **already written down** in [[Anti-Recurrence Check]] shape 5 and was hit anyway.
2. **Vite code-splits CSS.** "Newest file in `dist/assets`" was a 124-rule chunk with no tokens in
   it. A full sweep came back *"no failures, both themes"* — because it was measuring an
   **unstyled page**. The numbers were real; they were just not about this app.
   → The server picks the sheet that declares `--ground`, and the page **refuses to render**
   without it. **A lab that measures nothing must never look like a lab that found nothing.**
3. **A harness that invents markup measures the harness.** The FULL/LITE control was guessed as
   `.kpm-matrix two` with a `.on` class; it is `.kpm-switch` with `aria-pressed`. The guessed
   class matched no rule, so the gold ON-plate measured 1:1 against the panel.
   → **Copy the markup out of the real component. Never approximate it.**

## What measurement cannot replace

The lab settles ratios. It does **not** settle appearance, and both mattered the same night:

- a gold bloom at `.16` alpha passed every ratio and, amplified by the header's `saturate(1.5)`,
  read as a **yellow stain** across the top-left of the page;
- a scrollbar in three fixed browns was fully on-palette — **in one theme only**, so it was a dark
  bar down a cream page.

> **On-palette is not the whole claim. It has to be on the palette the page is currently wearing.**

And the inverse trap, which is the expensive one: Aldi reported two controls as too dark in the
same sentence. One was genuinely failing at 3,73:1; the other measured 5,48 and only *looked* wrong
because the page behind it was still black. **Fixing the second would have broken it.**
→ **When several things look wrong at once, find the shared ground before touching any of them.**

## Checks that freeze a value

Three audit checks failed in one day for one reason: each **pinned a hex literal**, so correcting
a colour broke the check that existed to protect that colour. Group 39 of the same audit file
already said it: *"a check that freezes a value a measurement later moves is just a second thing
to fix."*

**Assert the relationship, not the number** — "the light ink is darker than the dark ink", "this
token is a real pair" — and leave the ratios to `contrast.selfcheck.mjs`, which measures.

## Related

- [[Anti-Recurrence Check]] — shape 5 (measure vs look) and shape 7 (a check that freezes a value)
- [[Secure Context Requirement]] — why the dev server is HTTPS and must stay that way
- [[The KPM Control System]] — the classes the lab renders
- [[Aldi's Design Taste]] — *"live and playable beats a picture"*, the same instinct from his side
- Source: [[../../Raw/2026-08-16_source_light-ground-and-the-theme-lab|2026-08-16]]

## The stylesheet is the only witness (2026-08-16)

A class can be spelled perfectly and still paint nothing.

**Tailwind's `/N` opacity modifier needs a colour it can parse**, so it can rewrite it as
`rgb(r g b / a)`. `var(--x)` is opaque to it. So `bg-[var(--duke-amber)]/10` matches **no rule at
all** — not a wrong colour, no colour. Found 2026-08-16: **35 distinct classes over 54 sites**, in
`App.jsx` and in the sales terminal Aldi had already approved. The vault's amber buttons had no
background and no border; the gate's inputs had no border; the nota's paper tints were absent.

The fix is `color-mix(in_srgb,var(--token)_N%,transparent)`, which compiles.

⚠️ **Nothing caught it because every audit check greps the SOURCE.** The source looked correct, and
was correct — as text. This is [[Anti-Recurrence Check]] shape 4 at project scale: grepping the
source proves a class was *typed*, never that it *applies*.

> **When the question is "does this render", the built stylesheet is the only witness.**
> `dist/assets/*.css` is one file read away, and it settles in seconds what source-reading cannot
> settle at all.

**And verify the replacement, not just the removal.** "The old pattern is gone" and "the new one
works" are two claims. Read the emitted **declarations** — they are unescaped and carry real
spaces, so they need no escaping guesswork — rather than hunting for escaped selectors.

## Rendering a React component without signing in (2026-08-16)

Most KPM screens sit behind the vault gate, and Claude never signs into Aldi's account — so for
months the only way to see a component was to describe it. This works and is now the house method:

```bash
# 1. an entry that mounts the real component
cat > mount.tmp.jsx <<'JSX'
import React from 'react'; import { createRoot } from 'react-dom/client';
import Thing from './src/components/Thing.jsx';
createRoot(document.getElementById('root')).render(React.createElement(Thing, { ...props }));
JSX
# 2. bundle it (esbuild ships with vite, no install)
npx esbuild mount.tmp.jsx --bundle --format=iife --jsx=automatic \
  --define:process.env.NODE_ENV='"development"' --outfile=app.js
# 3. a harness page that links the REAL built stylesheet, then drive and screenshot
```

**Three traps, each of which cost a cycle:**

⚠️ **Tailwind only emits classes it has SEEN.** The harness links `dist/assets/index-*.css`, so a
component written after the last `npm run build` renders with none of its arbitrary classes
(`w-[290px]`, `duration-[700ms]`) and the layout collapses into a heap that looks like a bug in the
component. **Always `npm run build` after writing a component and BEFORE rendering it** — and
re-point the harness, because the CSS filename hash changes every build.

⚠️ **Headless Chrome does not advance CSS transitions under `--virtual-time-budget`.** Sampling an
"after" value returns the START value and reads as a broken feature. Three different questions need
three different instruments:
- *does it end in the right place?* → force Lite (`html.lite-mode`), which zeroes transitions, and
  read the computed style. This doubles as the Lite-law check.
- *is it actually animating?* → `document.getAnimations()` and check `playState`.
- *what does the motion look like?* → pause every animation and seek:
  `document.getAnimations().forEach(a => { a.pause(); a.currentTime = duration * 0.45 })`, then
  screenshot. The only still that can show motion.

⚠️ **Headless reports `clientWidth=503` for `--window-size=390`**, so a phone screenshot looks
clipped when nothing is wrong. **Wrap the component in a fixed-width div and MEASURE** — never
judge phone layout from the crop.

**And the limit of the whole method, learned the hard way the same night:** it renders the
COMPONENT, never the SCREEN. A component that is correct next to a block that is also correct can
still make a broken page — see [[Aldi's Design Taste#He tests on the REAL screen and finds what a
harness cannot]]. Read the whole branch being modified before adding to it.

## Four ways the harness decayed on its second outing (2026-08-17)

Rebuilding the EOD counting flow used the method above and hit four fresh failures. None of them
produced an error; each produced a confident, plausible, wrong frame — the same family as the
three above. All four have a one-line fix, so they are recorded as fixes, not as complaints.

1. **`vite build` EMPTIES `dist/`.** A harness planted in `dist/` is deleted by the very rebuild
   the harness requires (Tailwind must have seen the new classes). The second `npm run build`
   returned `sed: can't read dist/eod-lab.html`. → **The harness source lives outside the build
   output**, with a `relab.sh` that copies it in, resolves the stylesheet hash from the build that
   just ran, and re-bundles. Never hard-code the hash; never keep the only copy in `dist/`.

2. **A page with NEITHER `html.light` NOR `html.dark` is not "light" — it is undefined.**
   `App.jsx:2436-2437` toggles *both* classes. A harness that only added `dark` for dark mode
   rendered the same undefined palette in both shots, and the tell was two PNGs with **identical
   byte counts**. → Add one class or the other, always, and **print
   `getComputedStyle(document.body).backgroundColor` into the frame** — light must read
   `rgb(210,201,180)`, dark `rgb(10,9,8)`. A theme check you cannot see in the shot is not a check.

3. **Headless does not advance CSS transitions, so a resting layout read from a normal shot is a
   lie.** The sealed flow measured 649px tall with 280px of dead space — the deck's collapse
   transition had simply never run. `?lite=1` (which zeroes every duration by `!important`) gave
   the true resting height of 365px. → **Read layout in Lite, read motion frozen.** Same page, two
   instruments, and using the wrong one invents a bug that is not there.

4. **Freezing the animations does not freeze the COMPONENT.** `document.getAnimations()` was
   paused and seeked to 55%, and the frame still came back showing the end of the flow — because
   the component's own `setTimeout` had advanced its stage under virtual time. → To hold a
   mid-transition frame, **neuter `window.setTimeout` before the click that starts it**, keeping
   the original for the harness's own waits.

## What the frames bought this time (2026-08-17)

586 audit checks, a 12-assertion record self-check and a build all passed on code that had three
visible defects. Each was found by looking, and each is the same shape: **an element whose resting
state nobody had ever seen, because the old design only showed it at the end of the flow.**

| the frame showed | why every check missed it |
|---|---|
| the open flap threw an 81px beige wedge across the step strip | `rotateX(172deg)` about the top edge is *correct* for a folded-back flap; it had simply never been on screen at the same time as anything else |
| the wax seal still clipped the last row's figure | it had already been moved off-centre once for exactly this reason — the corner is precisely where a right-aligned number ends |
| a 238px hole above the "waiting" panel | the letter had flown away and its slot had not |

**The rule worth carrying:** when a component stops being an ENDING and starts being PRESENT, every
one of its states becomes a layout that has to be looked at — including the ones that used to last
400ms. Half the checks in this repo are about the final frame; none of them describe the waiting one.


## A SECOND HARNESS — `tools/ponder-lab.*` renders a real React component (2026-08-27)

The theme lab above renders **markup** against the built stylesheet. It cannot render a React
component, so a component the showroom does not contain had to be hand-copied into a scratch file —
which is note 3 of "the three ways it lied" waiting to happen.

`tools/ponder-lab.config.mjs` is a second, tiny vite build: same repo, same postcss and Tailwind,
`react()` only, output to `dist-ponderlab/` (gitignored). It imports the **real** component from
`src/` and the **real** `src/index.css`, and it drops the app's HTTPS certificate and service
worker, which is what puts the app itself behind a wall here.

    npx vite build --config tools/ponder-lab.config.mjs
    python -m http.server 4187 -d dist-ponderlab
    http://localhost:4187/tools/ponder-lab.html?light&lite&step=N&scene=<id>&probe

Then headless Chrome exactly as above. **This generalises** — any component that takes props can get
its own lab entry, and nothing is copied, so nothing can drift.

## 🔴 A HEADLESS SHOT NARROWER THAN ~518px ON WINDOWS IS A CROP, NOT A LAYOUT (2026-08-27)

**Chrome on Windows will not open a window narrower than about 518 CSS pixels.** Ask headless for
`--window-size=375,812` and it lays the page out at **518** and saves the left 375 pixels of it. The
PNG is 375 wide and looks exactly like a component overflowing its viewport: the close button gone
off the right edge, the caption clipped mid-word, the controls cut in half.

**It cost three screenshots, a wrong diagnosis and a layout fix aimed at a bug that did not exist.**
The same page measured **375px wide with zero overflow** in a real browser at a 375 viewport.
`--force-device-scale-factor` does not help — it scales the output, not the CSS viewport.

**The guard, and it is cheap:** the lab answers `?probe` by writing `window.innerWidth`, the panel's
measured width and `overflowsViewport` into a `<pre>` that `--dump-dom` can read. Run the probe
first; if `vw` is not the width you asked for, the frame is a crop and proves nothing. **518px is
still a useful narrow frame** — it is below both the `sm:` (640) and `lg:` (1024) breakpoints, so it
exercises the whole mobile branch.

The general shape is the one this page keeps re-learning: **a harness that renders something other
than what the app renders measures the harness.** Here it was not the markup or the stylesheet — it
was the viewport, and the harness never said so.

See also: [[Ponder Tutorial System]] · [[What Create Mod's Ponder Actually Does]]

## A screen that needs LIVE DATA can now be looked at too (2026-09-01)

The `?places` mount worked because `RestockVaultView`'s one listener bails out when there is no
signed-in user, so `db={null}` renders the whole desk against fixtures. **That was luck, not a
technique.** `BranchWarehouseManager`'s listener returns early on a missing `masterUserId` and
then never sets `isLoading` false — so with no database the branch screen renders *"Loading
Logistics Logs..."* forever, and an empty shelf under it. A harness that can only show empty
states measures the harness.

**`tools/lab-firestore-stub.js` is aliased over `firebase/firestore` in
`tools/ponder-lab.config.mjs`, and in nothing else.** `collection()` returns `{ path }`,
`onSnapshot()` matches the tail of that path against a `FIXTURES` map and calls back
asynchronously, and every write is a no-op that resolves. The component's OWN listener runs
unmodified, so what appears on screen is what a branch admin sees. `dist/` is built by
`vite.config.js` and never sees the alias.

Adding a screen is now two edits and no component change: a `FIXTURES['<path tail>']` entry and a
mount beside `?places` / `?nota` / `?gudang`.

**The callback is deliberately asynchronous.** A synchronous first callback would set state during
render and hide exactly the effect-ordering bugs this harness exists to be able to show.

**And the probe matters more than the screenshot.** `?gudang&probe` walks up from each title to
the first ancestor that paints an opaque background and prints the contrast ratio, because a
heading's own background is `rgba(0, 0, 0, 0)` and comparing ink against transparency reports a
number nobody can see. It was the probe, not the frame, that found the two faults in
[[Off-Token Colour Migration Map]] — the frame only made me suspicious enough to measure.

⚠️ **`--font-display` has no `@font-face` and no webfont link.** "Barlow Condensed" renders only
where it is installed locally; everywhere else the stack falls to "Arial Narrow". So the lab's
text metrics are representative rather than distorted — but check `document.fonts` before trusting
any width claim, because the older warning on this page assumed the opposite.
