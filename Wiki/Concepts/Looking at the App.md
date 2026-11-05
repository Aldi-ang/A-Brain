---
title: Looking at the App
description: How to actually see a KPM screen before claiming a visual fix — the theme lab harness, why the dev server cannot be opened directly, and the three ways the harness lied before it told the truth.
type: concept
created: 2026-08-16
updated: 2026-09-18
confidence: high
checked: 2026-09-15
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

## A REAL 375px VIEWPORT EXISTS NOW — the in-app pane, sized, plus `?shell` (2026-09-14)

**The honest phone instrument on this machine is the in-app Browser pane with `resize_window` to
375×812, and `innerWidth` read in the SAME probe as every rectangle.** Headless Chrome crops at 518
(above); the pane lays out at whatever it is told — but a hidden pane reports `innerWidth 0` and
still returns plausible rectangles, which is how two false phone claims sat in the queue for days:
*"the menu ribbon is at top:-66px, half above the viewport"* and *"the bell is at x 398..445"*.

Measured properly on 2026-09-14, one of them was an artifact and the other was real and worse:

| claim from the hidden pane | at a real 375×812 (`innerWidth` 375 in the probe) | verdict |
|---|---|---|
| ribbon `top:-66px` | top **340** of 812 = `(812 − 132) / 2` exactly | artifact — `innerHeight` was 0 when it was written down |
| bell x 398..445 | bell x **442..489**, control cluster 260..489, column `overflow-hidden` | real — clipped, never drawn; the theme switch cut in half |

The mount that made it possible: **`?shell` in `tools/ponder-lab.jsx`** renders the real
`BiohazardTheme` (top bar, ribbon, rail) with the sync chip copied verbatim from `App.jsx`, and
`tools/lab-firebase-stub.js` stands in for `src/config/firebase.js` inside the lab only, because the
real module boots Firebase on import. Recipe: `preview_start` ponder-lab → `resize_window` 375×812 →
navigate `?shell` (`&light` for the light theme) → `javascript_tool` reading `innerWidth` and the
rects together → screenshot. Reset the pane with the `desktop` preset when done.

**What the frame bought that the numbers did not:** the row was `flex` with no wrap, the title stack
cannot shrink (a `truncate` child sets the min-content of a parent with no `min-w-0`), and the
cluster is `shrink-0`, so the arithmetic said "505 > 375, overflow". The frame said what that looks
like on his phone: the book, the cloud and half a switch, then nothing — no bell for the whole life
of the app on a phone. Fixed as `flex-wrap` + `ml-auto` (`2af2dd9`), his wrap-over-truncate rule
from [[Aldi's Design Taste]] applied. **Confirmed by Aldi the same evening** with Chrome's device
toolbar (F12 → Ctrl+Shift+M) at 420 and 375 — *"sc1 is 420, sc2 is 375"* — and that is a third
honest phone instrument: **his own browser at a typed width**, cheaper than the phone and exact,
when what is being checked is layout rather than touch or `crypto.subtle`. His first attempt,
*"i use pc but reduce its resolution"*, landed at ~550 CSS px, too wide to wrap — a frame has to be
at the width where the bug lives, or it proves only that nothing else moved.

See also: [[Ponder Tutorial System]] · [[What Create Mod's Ponder Actually Does]]

## A FULL-SCREEN SHEET AT 375: the pane measures, headless shoots at 518 (2026-09-16)

**A `fixed inset-0` sheet is viewport-bound, so the `maxWidth: 375` trick the `?photo` mount uses
for the box does nothing for the dialog over it.** Headless at 420 gave a frame whose right third
was the 518-crop (the PAKAI button cut in half — the artifact above, again). Two ways were tried
to get an honest 375 PNG out of headless, and the one that sounds right does not work:

- **An `file://` wrapper page with two 375×812 `<iframe>`s pointing at the lab** — the iframes
  never finish their work under `--virtual-time-budget` (the outer document is idle, so the budget
  burns instantly), and with `--timeout=9000` the frames show the lab's empty state or another
  route. Do not spend a turn on it again.
- **What works:** measure at 375 in the in-app pane (`resize_window` mobile, `innerWidth` in the
  same probe as the dialog's rect — 351 wide, no overflow, four handles 44×44) and shoot the FILE
  at `--window-size=518,900`, the narrowest uncropped headless width. Say which is which in the
  reply: the PNG is the appearance, the pane numbers are the phone.

The pane can also EXERCISE the sheet: `left_click_drag` on a handle (coordinates are in the
screenshot's frame, ×1.75 at 375 — a click in CSS pixels landed on the backdrop and closed the
dialog once), `find` + `ref` clicks for PUTAR / PAKAI, then the resulting `<img>`'s
`naturalWidth/Height` prove the turn (378×311 → 321×407). That is the proof a corner editor needs;
a still frame cannot show a drag.

## THE FRAME MUST CARRY THE REAL WRAPPERS — `?shell&places` and `?tab=` (2026-09-15)

**A proposal rendered in a bare mount can be approved and still not be what ships.** The Restock
Vault tab-strip options (`tabs-options.png`) were rendered through `?places`, which mounts the
desk in a bare `p-4`: desk 325 px at 375, five tabs on 3+2 rows. Aldi approved that picture.
Inside the real app the desk sits in the shell's `p-6` (`BiohazardTheme.jsx:1059`) and App.jsx's
`border-4 p-4` panel (`App.jsx:4804`): desk **271** px, and the identical fix lands as **three**
rows. Nothing was wrong with the CSS; the instrument left out 54 px of frame.

**The mount that fixes it: `?shell&places`** in `tools/ponder-lab.jsx` — the desk inside the real
`BiohazardTheme`, wrapped with App.jsx's classes copied verbatim. Measure a phone proposal there,
never in the bare mount, and say in the caption which one it is.

**`?tab=<label>[,<label>...]`** presses, in order, each desk button whose text starts with the
label (`?tab=data,daftarkan%20pabrik` opens Data Induk and then its factory form), so a headless
render can show a tab or a form that is not the default view. Timing is the whole trick, and two
obvious versions fail: a `setTimeout` loses the race in headless Chrome, which shoots the moment
the page has loaded (cross-origin iframes run in real time, outside the main frame's
`--virtual-time-budget`); a plain synchronous loop presses the second button before React has
drawn it. What works: **one press per microtask** — a `.click()` inside a commit schedules React's
re-render as its own microtask, so the next `.then` runs after that flush and finds the button
the last press revealed.

**Two traps that each cost a turn today:**
- The lab's root URL is `/tools/ponder-lab.html`. `http://localhost:4190/` serves the APP's own
  `index.html` through the lab's vite config, which dies on the firestore stub (*"does not provide
  an export named 'addDoc'"*) — that error means the wrong page, not a missing stub export.
- `npm run build` while the lab is up killed vite's watcher (`EBUSY` on
  `dist/kpm-final-logo.png`). `tools/ponder-lab.config.mjs` now ignores `dist/`.

**The proof-PNG recipe, as run 2026-09-15:** a scratch HTML with one 375×812 `<iframe>` per frame
(each an `?shell&places…` URL, `&css=` for an option, `&tab=` for a second tab), pinned to
`width: 375px` per column so a long caption cannot widen it, rendered by
`chrome.exe --headless=new --disable-gpu --hide-scrollbars --window-size=1620,1040
--virtual-time-budget=15000 --screenshot=out.png file:///…/page.html`. To show a region low on
the page inside an 812-tall frame, `&css=.biohazard-content{transform:translateY(-1930px)}`
shifts the content up; the document does not scroll, the picture does.

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

## Proving a barcode without a scanner (2026-09-01)

`BarcodeDetector` — the API that would decode a generated symbol — is an **Android Chrome**
feature. Measured in the desktop browser available here on 2026-09-01: `'BarcodeDetector' in
window` is **false**. So the one artifact on this project that is purely pass/fail in the physical
world could not be tested by the usual route.

**Two things followed, and the second is the reusable one.**

1. **The encoder is a library, not 107 hand-written patterns.** A single wrong digit in a Code 128
   table prints a symbol that renders perfectly and refuses to scan — discovered at the warehouse
   door, by someone holding goods. Where correctness cannot be tested locally, a battle-tested
   dependency beats a clever local implementation, and that is not the usual answer on this project.

2. **Assert the INVARIANT, not the output.** Every valid Code 128 symbol satisfies
   `total modules = 11·S + 2` and `black bars = 3·S + 1` for the same S, whatever the pattern table
   says. `?label&probe` measures both from the rendered SVG. Measured: 167 modules, S = 15, 46 bars,
   human-readable text equal to the payload — and 15 symbols is exactly right for an optimally mixed
   B/C encoding of a 17-character string with a long digit run.

⚠️ **Say which kind of proof it is.** This is proof of SHAPE. It cannot distinguish a correct table
from a wrong one, because a wrong table produces the same module count. Only a phone pointed at
printed paper settles scannability, and that test belongs to Aldi.

⚠️ **The first version of that probe was wrong and looked like a failure.** It expected
`11·(len+3)+2 = 222` on the assumption of pure Code128-B, and measured 167. JsBarcode encodes in
optimal MIXED mode, dropping into Code C for the digit run. **A red check is a claim about the
code that has to be checked too** — here the check was wrong and the artifact was right.

## PROVING A MOTION WITHOUT A MOVING FRAME (2026-09-04)

**The Browser pane does not composite, and it says nothing about that.** Measured on the ponder
lab: `requestAnimationFrame` fired **0 times in 500 ms**, while `document.hidden` was `false` and
`document.visibilityState` was `"visible"`. Fronting the tab with `tabs_select` did not change it —
still 0. `tabs_context` is the only honest reporter: it answers *"The Browser pane is currently
hidden."*

⚠️ **`agent-browser` hung again — 1800 s, aborted, second time.** The note above already recorded
one 1801 s hang and it was probed anyway. Treat that tool as unavailable in this environment, not
as worth one more try; the retry costs half an hour and returns nothing.

**The way through was to stop sampling frames and inspect the animation OBJECTS.** `PonderBook`
turns a sheet with the Web Animations API (`el.animate(...)`), not with per-frame inline styles.
So `document.getAnimations()` answers the question directly, and it answers it **without a
timeline that advances** — the objects exist, carry their duration and easing, and can be read the
instant they are created:

    document.getAnimations().map(a => ({
      dur:   a.effect.getTiming().duration,
      ease:  a.effect.getTiming().easing,
      state: a.playState,
    }))

That turned two motion claims into arithmetic:

| claim | what was read | verdict |
|---|---|---|
| a ribbon lands in one step | section 17 → 1, sixteen sheets: **zero** turn animations created, before-set identical to after-set (three 200 ms card transitions, unchanged) | no flip-through |
| a neighbour turn still folds | ArrowRight: **exactly one** animation, `dur 340` (= `TURN_FULL_MS`), `cubic-bezier(0.62, 0.02, 0.28, 1)` (= `HINGE`) | unchanged |

**And a still frame of a moving thing is one line away.** A frozen timeline is an advantage here:
pause the animation and write its `currentTime`, then screenshot — the pane renders on demand even
though it will not run a loop.

    document.getAnimations().forEach(a => { a.pause(); a.currentTime = a.effect.getTiming().duration * 0.45; })

At 45 % of the arc the leaf's computed transform came back as
`matrix3d(0.0946663, 0, 0.995509, 0, …)` → **rotateY ≈ 84,6°**, with live z components, and the
screenshot showed the sheet standing on edge at the spine. That is proof of APPEARANCE, not only
of ratio — the distinction the top of this note insists on.

**The general rule:** when the surface will not run time, look for the declarative object that
describes the motion rather than the pixels that would have shown it. WAAPI, CSS transitions
(`getComputedStyle(el).transitionDuration`) and `element.getAnimations()` are all readable at rest,
and a paused animation is a scrubber for taking the photograph the loop refused to produce.

## AN HONEST 375 PNG OUT OF HEADLESS: pin the app, not the window (2026-09-17)

Headless will not go under 518, but the app does not have to know. `?css=` can carry
`#root{width:375px} div[style*="drawer-h"]{width:375px;right:auto} .fixed.inset-0{right:auto;width:375px}`
— the shell lays out at 375 inside the 518 window, the media queries still see 518 (so anything
keyed on `max-width:1023px` still fires as on a phone), and the PNG's left 375 px IS the phone
layout: the product name wraps exactly where the pane said it does. Crop in the compose page
(`object-fit:none; object-position:left top` in a 375-wide box). Two limits: viewport units
(`100vh`) still mean the window, and a portal that centres with `justify-content:center` inside
a pinned `inset-0` can shift — the shop picker did; when a frame looks wrong, the pane number is
the truth and the frame is dropped, never explained. The Sales Terminal boards
(`st-wares.png`, `st-sheet.png`, 2026-09-17) were shot this way; `tools/ponder-lab.jsx`
`?shell&terminal`, `?grip` (a real pointer tap on the manifest grip — `.click()` does nothing to
a pointer gesture, and the customer bar above it wears the same `cursor-grab` class with a no-op
tap, so take the LAST one).

## THREE MORE INSTRUMENTS, and one trap (2026-09-18)

- **`?look=<name>[,<name>]`** (`tools/lab-looks.js`) — a proposal's CSS behind a short name,
  injected after the app's stylesheet exactly like `?css=`. Made because a board option's `?css=`
  link ran to 6 KB and Aldi could not be handed it; `?shell&customers&look=cust-b` he could press.
  The contract: an entry is a candidate he has not decided on; when one ships its rules move into
  the component and the entry is deleted (today's five did — only `pin` remains). Rebuild the
  entry set per board, never accumulate.
- **`?shell&agent&tick`** — every 2.5 s a second RETUR joins and leaves the lab's transactions, so
  the Quarantine count rolls 10 → 15 → 10. Motion that only fires on a DATA change cannot be
  watched on static fixtures; the tick makes it sampleable: `el.getAnimations()` on the two roll
  spans read `kpmRollIn` + `kpmRollOut` running together, 0 → 117 → 217 ms of 260. Same idea as
  [[PROVING A MOTION WITHOUT A MOVING FRAME]], one step earlier — make the change happen, then read
  the declarative object.
- **`FIXTURES['motorists/m2']` and `FIXTURES['benchmarks']`** — the stub now answers a DOCUMENT
  listener (`exists()` / `data()`) when a fixture is a plain object, and `doc()` joins its id
  segments like the real API. A screen that listens to one document (Agent Inventory) used to
  throw inside the stub's collection shape and sit on "Syncing" forever — the harness measuring the
  harness again.

**The trap:** the lab page is `/tools/ponder-lab.html`. The root `/` on the lab port serves the
REAL app, which imports `connectFirestoreEmulator` from the stubbed `firebase/firestore` and dies
on load — a blank dark page and that error in the console mean the wrong URL, not a broken stub.
Cost 2026-09-18: three probes and a module-graph hunt before the address was read.

**And the audit as the last reviewer:** boards drawn with `box-shadow` / `text-shadow` passed the
pane and the eye, and failed G30 on the built output — nothing in the control system may depend on
a shadow. The check is right and the boards were wrong; a proposal for a `.kpm-*` class is drawn
without shadows from the start, or it is redrawn before shipping and he is told (kpm `832ea7c`).


## TYPE INTO THE LAB, READ THE TRANSFORM, AND A 500 IS A SYNTAX ERROR (2026-09-18, EOD Setoran)

- **`?tab=type:<value>`** — the press chain in `tools/ponder-lab.jsx` now types into the first
  enabled, visible input inside the desk (React's own value setter, then an `input` event). Made
  because the EOD deck's confirm button is disabled until the card carries a figure, so card 2
  and card 3 could not be reached headless by presses alone:
  `?shell&eod&tab=type:2490000,put%20cash,landed,put%20transfer`.
- **A rect read within a second or two of a press can be MID-TRANSITION.** The EOD deck's next
  card scales .93 → 1 over 500 ms; a probe that read the count box right after the press got
  41 × 89 for a box that is 44 × 96, and the desk probe at 1280 read 69 × 36 for a 74-wide box.
  Read `getComputedStyle(el).transform` in the same probe; if it is not the identity matrix,
  wait and read again. The pane also throttles transitions while it is not painting, so a
  1.2 s wait is not always enough — the transform is the truth, not the clock.
- **A blank lab page with `[vite] Failed to reload … 500` in the console is a SYNTAX ERROR in a
  source file**, not a stub problem: `preview_logs` names the file and line. This time it was a
  `{/* JSX comment */}` written as the first thing inside `cond ? (` — two expressions, a parse
  error — the exact trap the brief carried in prose. It is now a logicFixes sweep over every
  `src/**/*.jsx` (`(\s*{/*` goes red), proven red on a probe file. A trap in a brief is a
  hope; a trap in a check is a wall.
- **`?shell&eod`** — EODReconciliationView, the T5 submit flow, no wrapper, as App.jsx:5022
  mounts it; `&admin` mounts the boss's review side (unmeasured). Two cash sales and one
  transfer so both money cards have rows; the van and the cukai debts from the same
  `FIXTURES['motorists/m2']` object the agent branch uses. kpm `84e102f`.


## THE PANE DOES NOT ADVANCE A TRANSITION UNTIL IT PAINTS (2026-09-18, learned twice in one day)

A property read from the pane right after a press — a rect, a transform, a border colour, a
`grid-template-rows` — can be the START value of a CSS transition, however long you `await`: the
Browser pane throttles rendering while nothing forces a frame, and a transition only advances on
frames. Twice today: the EOD deck's next card read 41 × 89 for a 44 × 96 box (scale .93 not yet
1) after 1.2 s; the ⋯ key's amber border read as `--line-2` after 400 ms, and the strip's rows
read `0px` after a click that had opened it. Every "bug" vanished the moment a `computer`
screenshot forced a paint — the values were then 44 × 96, amber, 60.6 px. The rule: **screenshot
first, then read** any property that has a transition on it; or read the untransitioned truth
(`aria-expanded`, the inline style, the class list) and treat the computed value as pending.
A div with the same class and no transition reads its final value at once — that was the probe
that separated "the rule does not apply" from "the rule has not been painted yet".

Also from the same job: a look or a guard written against utility classes (`.flex.gap-2`,
`.flex.gap-1`) matched the title `<h2>` and the DEL button, which carry the same utilities —
two frames were wrong before the selectors were scoped to `div.flex.gap-2`. Utilities describe
layout, not identity; scope to the tag or to a real class.

## THE PANE'S FONT IS ~20 % NARROWER THAN HIS — a desk width is proven headless, not in the pane (2026-09-22)

The same `ui-sans-serif, system-ui` stack resolves to a narrower face in the Browser pane than in headless Chrome and in his
Brave: `Rp 1.200.000` at 20 px measured 126 px in the pane and 152 px on his screenshot (228 device px at 150 %), and the
headless shot matched his. So a "fits with 11 px to spare" read off the pane's DOM can be 15 px over on his PC. The 1:1
columns of the review card passed every pane measurement and overlapped TRANSFER's label with its value the moment the
SHIPPED board was shot headless. Rule: a width claim on the desk is closed by a headless PNG (`--window-size=2000,1000`,
his screen) in the system font, and the pane's numbers are the lower bound. The lab's `?tab=%E2%8C%84` presses the card's
chevron, so headless can shoot the card open.

## A MONEY PATH RUNS THROUGH THE REAL ENGINE IN THE LAB — writes recorded, reads from fixtures (2026-09-22)

His *"can u do your test yourself to make sure that it is working"*. The Firestore stand-in (tools/lab-firestore-stub.js) now
records every batch / updateDoc write in `globalThis.__labWrites` (`{ op, path, data }`) and answers `getDoc`, `getDocs` and
`runTransaction`'s get from FIXTURES by the same path-suffix rule as onSnapshot. So a screen can be mounted over the REAL
`useTransactionEngine` (`?shell&piutang` — Receivables; `window.__labAudit` is handleConsignmentPayment) and the update the
engine would have sent is read back from the console: a 2 Slop return wrote `products/p-cg16 {stock: 4220}`. The recipe for
a BEFORE that could have failed: `git checkout <fix>^ -- <file>`, reload, read the number, `git checkout HEAD -- <file>`.
That is how 165.000 → 110.000, 4202 → 4220 and one-silent-write → zero were each read off the real component, not off a
unit test. A guard that bundles the app (MerchantSalesView imports `debtCredit`) means the old revenueRule.js cannot be
checked out alone — check out only the SCREEN whose number you want.

## `look=pin` IS NOT A PHONE for a screen built on media queries — shoot at 518 (2026-09-22)

The Stock Opname count card pinned to 375 inside a 2000-wide headless window rendered the DESK grid squeezed into 375
(four plates in one row, a one-word-per-line message): the pin narrows `#root`, but `@media (max-width: 1023px)` reads
the window. For a phone LOOK board, shoot at `--window-size=518,1000` — the narrowest uncropped headless width, and the
phone CSS fires. The pin is only honest for layouts that do not branch on a media query. Raw/2026-09-22-nixie-light/shoot.mjs.

**A shot that needs a click or a drag first, with no puppeteer (2026-09-24).** `chrome --headless=new
--remote-debugging-port=9333` plus Node 24's built-in `WebSocket` is the whole toolkit:
`Emulation.setDeviceMetricsOverride` for the width, `Runtime.evaluate` to tap a roster row, `Input.dispatchMouseEvent`
for a REAL drag (Chrome turns mouse events into pointer events, so a window-listening drag runs its own code),
`Input.insertText` to type, `Page.captureScreenshot` to save. Script: Raw/2026-09-24-van-loading-bay/shoot-bay.mjs. It
shot the van-loading bay at 2000 and 518 in both themes, and the 2000 frame caught a muatan line pushing its x out of a
300 px column, which the pane's scaled-down view had hidden.

## A CLASS USED ONLY IN tools/ DOES NOT EXIST — the lab scans one extra file (2026-10-02)

The app's `tailwind.config.js` scans `index.html` and `src/**` only. A lab-only component in `tools/` that uses a class no
`src/` file uses gets NO css for it - the bell proposal's sliding switch plate (`w-[calc(50%-4px)]`) rendered 0 px wide.
`tools/ponder-lab.config.mjs` now runs Tailwind with the app config plus `./tools/lab-bell.jsx`; add a lab file there, or use
inline `style` for its one-off values. The same check found a LIVE bug: `text-orange-400` is never generated (`orange` is one
colour, `var(--orange)`), so the real bell's new-message titles compute to rgb(0,0,0). A class that compiles to nothing fails
silently - read `getComputedStyle`, not the className. Source: `Raw/2026-10-02-notification-bell/`, kpm `1c64e8c`.

## A LEAFLET MAP: the phone frame comes from the pane, the PC frame from headless (2026-10-02)

The Map System at 1440 in the pane is scaled down to fit, and Leaflet under that scale loaded tiles for a half-size
box and framed the team for ~520 px - grey over half the map. Part of it was real (Leaflet only watches the window;
fixed with a ResizeObserver, `eef2f55`), but a map's PC frame is proven headless (`--window-size=1440,900`,
`Raw/2026-10-02-expedition` built-pc-1440.png). Its phone frame is the pane at 390 (mobile emulation: innerWidth
390, scrollWidth 390, real taps) - headless at 390 is cut on the right by the ~518 px window floor above, and a
390-wide iframe inside a headless window came back BLACK (the lab never booted inside it). Re-derived this session
before reading the 518 section: read this note's width sections before choosing the instrument.

## Motion on the PC, without Playwright (2026-10-18)

Found while building presentation v28 (kpm `ada673e`):
- **The in-app browser pane's animation clock stands still while the pane is hidden.** `document.timeline.currentTime` read 0 and every WAAPI animation stayed at 0 ms, so `onfinish` never ran and the cleanup looked broken. It was not. Never judge "does the animation finish" in the pane.
- **A bare headless `--window-size=390` lays out wider than 390** (Chrome's minimum window width): the heading was cut and a button was missing. Either put the page in a 390 px iframe on a board page (`--allow-file-access-from-files` lets the board read the frame's state), or use CDP `Emulation.setDeviceMetricsOverride`.
- **The real-clock driver:** `.claude/presentation/tests/pc-flow.mjs` and `pc-capy.mjs` in kpm. They launch headless Chrome with a debugging port, talk CDP over Node's built-in WebSocket, press through the page with real waits, take timed screenshots, and read the page state after each step. No Playwright needed: `node pc-flow.mjs <file url> <out dir> 390 844`.
- **Frozen frames for a board:** `document.getAnimations().forEach(a => { a.pause(); a.currentTime = T })` right after the action freezes every animation at T ms, so one screenshot shows the middle of a motion.
- **Headless Chrome reports `navigator.webdriver = true`.** A page that hides something from test robots (the capybara) needs `Page.addScriptToEvaluateOnNewDocument` to fake it false when that thing is what you are testing.

## A board of four frames, reliably (2026-10-24)
Four live lab iframes in ONE headless page: only the first booted, three came back blank (same race as above). What worked: one CDP shot per frame (a copy of `.claude/presentation/tests/pc-guide.mjs`'s launcher: `Emulation.setDeviceMetricsOverride` to 375x812 or 1440x900, navigate, wait 4.5 s, `Page.captureScreenshot`), then a board page of plain `<img>` tags shot with `--allow-file-access-from-files`. Serve the lab with `npx vite preview --config tools/ponder-lab.config.mjs --port 4187 --strictPort` - `python` on this PC is only the Microsoft Store stub (exit 49). Example: `Raw/2026-10-24-mission-card/`.

## One JSX, two outlets: the real screen in the lab and a page he can press on his phone (2026-11-05)

A draft written as one React file with its CSS in a string can do both. In the lab, a portal puts it into the real screen for frames (`tools/opname-drafts.jsx`, `mountInLab`). For the phone, `Raw/2026-11-05-opname-board/build-drafts.mjs` bundles it with the repo's own esbuild into one self-contained HTML page, with the app's real colour values read from the lab by the shooter into `tokens.json`, and `publish_files` sends that page as a private Artifact. Layout is written with container queries, so the page's "Phone width" switch shows the phone layout on a PC. A draft that must bundle alone cannot import `utils/helpers.js`.
