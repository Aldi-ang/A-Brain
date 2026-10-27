---
title: Operation Log
description: Append-only history of every ingest/tidy pass done on this vault — a long gap here is an honest staleness signal.
type: log
created: 2026-07-27
updated: 2026-07-27
tags: [log, meta]
---

# Operation Log

Append-only. A long gap here is an honest signal the wiki may be going stale — see
`PLAN-second-brain-integration.md`'s Trade-offs section.

## 2026-10-22 13:30 — presentation v37 batch 2 built from his picks (local + private preview); new technique: [[Capybara Art Generation]]
His picks were all my picks (E-A, 09-A, 18-A, 19-A, 20-A) plus new capybara gestures and a worker outfit. FLUX Kontext on Hugging Face kept the character identical for 3 poses, then the free anonymous limit stopped it. Waiting on him for a way to unlock it.

## 2026-10-05 (later) — Consensus connected; 13 prompts run, evidence page built

Aldi connected the Consensus connector. Ran P1-P13 sequentially (free tier rate-limits parallel calls). 39 papers used; 5 strong, 5 moderate, 3 weak answers; 7 of his field claims supported. Corrections: ngrapak = faster burn + more NH3, not a hotter coal; tegal dryness can be good, rapid-growth drought is the damage. Page https://claude.ai/artifact/HBX62nSw7YRrraUWLeGby9.

## 2026-10-05 — tobacco: research brief + 13 prompts for Consensus

Aldi wants Consensus to do the literature research and Claude to build the visuals. Wrote an English research brief PDF (verified facts, field knowledge, working explanation, 13 open questions, 13 prompts with one table format, chart plan, glossary) and a plain-text prompt file. Consensus has a Claude connector (directory uuid 65247229-...) that is not connected here; connecting it would let Claude run the prompts directly.

## 2026-10-04 19:37 — Journey map: an open request keeps a "!" until Request done (kpm 635c62e)

His 19:25 *"B is good"*. A New Request now writes `openRequest` on the shop; the "!" stays (chest + bubble) until the
Request done key (asks, logs, reports) clears it. Lab probe with real presses: `Raw/2026-10-04-signs-built/probe-req.mjs`.

## 2026-10-04 19:10 — Journey map: visit signs in his look C (kpm bcae573) + Map System flash fixed (kpm 9006958)

His 18:30 *"C is the best because it is really clear ... yes please fix the map flash as well"*. Look C built: each
status its own 12 x 12 object + family lamp + word, acting out its word once on the chest's moment; an exchange (RETUR)
no longer shows the Sale coin (`kindByShop`). Map System: the empty map follows the picked base map (dark 79,79,81 /
satellite 84,84,80 / light maps #ddd) - light share on a slow zoom 15.7 % -> 0.4 %. Frames: `Raw/2026-10-04-signs-built/`,
`Raw/2026-10-04-map-flash/`. His request-mark ask drawn (A banner / B "!"), OPEN - `Brainstorm/2026-10-04_visit-signs.md`.

## 2026-10-04 — Journey map: light flash on salesman switch fixed (kpm aa87cd1)

His epilepsy concern. Leaflet's default `#ddd` showed while tiles loaded after a camera move; the map background is now
the dark basemap's land colour. Measured before/after in `Brainstorm/2026-10-03_journey-map-keys.md` (FLASH FIXED);
Map System has the same trap, OPEN.

## 2026-10-04 — Journey map tested end to end: 9 bugs fixed (kpm 8e38420)

His "test it yourself". 49 headless checks on the production lab build (PC + phone + break cases); root causes and the
two traps in `Brainstorm/2026-10-03_journey-map-keys.md` (TESTED END TO END); test and board in
`Raw/2026-10-03-map-keys/built8/`.

## 2026-10-03 (later) — tobacco plant physiology + Gemini fact-check

Aldi asked for deeper research on how the tobacco plant works and a check of a Gemini 3.6 Flash chat. 24 claims judged (4 true, 7 partly, 6 false, 3 no evidence, 4 do-not-do); biggest error: Gemini says 2026 leaf is low-nicotine/high-sugar, research says the opposite. Also found the Frontiers 2024 sugar -5% source that page 1 had marked unverified. New: Summaries/Tembakau - Cara Kerja Pohon dan Cek Riset Gemini.md; page https://claude.ai/artifact/B7ZgHk8WEPpd9t9reez8sG.

## 2026-10-03 — first tobacco ingest: rajangan 2026 research, verified and drawn

Aldi pasted a research report (why 2026 rajangan smokes hot, smells thin, imbon took 6 days) and asked for it researched, simplified and drawn in Indonesian. 9 of 11 claims re-verified by DuckDuckGo in the built-in browser (WebSearch/firecrawl dead); page published as a private artifact. New: Summaries/Tembakau Rajangan 2026 - Panas, Aroma Tipis, Imbon Molor.md, Concepts/Web Research When the Search Tools Die.md, Tobacco-Business/Raw/2026-10-03_rajangan-2026-research-page.html.

## 2026-09-16 — nota scan option B shipped: pure-JS paper finder + perspective warp + corner editor

kpm-inventory `a267298`. `helpers.findPaper` / `homography` / `warpQuad` / `loadNotaPhoto`;
`PhotoField` SESUAIKAN sheet. Recorded in `Brainstorm/2026-09-15_nota-scan-dan-lacak-tanggal-produksi.md`
(the B block: what shipped, three things learned — the L-shape needs a blob-fills-quad rule, the
scan must run after the warp, corner error lands inside the sheet — and the white-desk limit that
waits on his real-nota test). `Concepts/Looking at the App.md` gained the 375-sheet section: the
pane measures and exercises (drag / PUTAR / PAKAI), headless shoots at 518; the iframe wrapper
does not finish loading headless. Lessons: three 2026-09-02 entries retired as platitudes (never
fired in 14 days).

Evening, same day: scanner and ribbon CONFIRMED on his phone; `af4d5e2` first-open fix (the stale
red Access Denied had two writers — recorded on `Concepts/UI-Says-Yes-Server-Says-No Pattern.md`);
`Concepts/Aldi's Design Taste.md` gained the pull-tab-at-25 % entry; one new lesson ("unreachable"
needs every writer of every half). Session closed 21:20 at *"let me test tomorrow prepare notes
and prompt for tomorrow"*.

## 2026-09-15 — thinking-partner installed; Alucard §1c makes it automatic

His ask: *"add this skills inside alucard, or maybe mental thinking to make our job more effective
and efficient and give better input later on"* — github.com/mattnowdev/thinking-partner. Source
cloned to `Skills-Library/thinking-partner` (indexed), installed as `Skill(thinking-partner)`
(17.8 KB SKILL.md, 150+ models in `references/model-catalog.md`, diagnostics in
`references/thinking-diagnostics.md`). Alucard SKILL.md gained §1c: automatic on any feature
ask, DECIDE, brainstorm, root-cause hunt or plan; 2–3 models applied silently, named only in the
vault note (`Models applied:`), the challenge landing as ONE descriptive question. First use the
same hour: the lot-tracking brainstorm.

## 2026-08-17 — Ripple: the stamp ceiling, and a palette bug that was really a money bug

Commit `23d1977` on `phase0-solid-ground`, 594/594 audit (group 48 is new and was seen to
FAIL before the fix), 12/12 record self-check. A second harness now mounts the WHOLE
`EODReconciliationView`, not a component out of it — the legacy card is inline JSX and a component
harness cannot reach it.

**Rippled:**
- [[Concepts/Aldi's Design Taste]] — *"He reports a palette bug and a money bug in the same
  breath"*. Three things worth keeping: "I hid it in the case I was working on" is not "I removed
  it" (the card he screenshotted was still live in a state I had not covered); a complaint about
  one card is worth grepping the whole screen for (the new check found two more gold-on-gold sites
  nobody reported); and **he rates a bug by how often he thinks it happens, never by what it costs
  when it does** — his *"really niche"* over-count was minting permanent stamp credit through
  `global_credit`.

## 2026-08-17 — Ripple: his three EOD corrections, built and rendered

One commit on `phase0-solid-ground` (`661498f`), 586/586 audit, 12/12 record self-check, flow
driven end to end in headless Chrome at 390px in light, dark and Lite. No new page — both targets
already existed and are linked from three places each.

**Rippled:**
- [[Concepts/Aldi's Design Taste]] — *"What his three corrections were worth once they were
  built"*. The per-line goods card is a record-shape argument, not a layout one; his pita cukai
  generalisation was wrong on the data and the correction is recorded next to it; *"sending
  animation could be better"* is the third correct use of his "cheap" judgement.
- [[Concepts/Looking at the App]] — two sections. *"Four ways the harness decayed on its second
  outing"*: `vite build` empties `dist/`; a page with neither `html.light` nor `html.dark` renders
  an undefined palette (the tell was two byte-identical PNGs); headless never advances a CSS
  transition, so resting layout must be read in Lite; and freezing animations does not freeze the
  component's own `setTimeout`. Plus *"What the frames bought this time"* — three defects that
  passed every check, sharing one cause.

## 2026-08-16 — Ingest: the light ground, and the session that finally looked at the app

Nine commits on `phase0-solid-ground`, 543/543 audit checks, contrast self-check passing both
themes. Raw source:
[[../Raw/2026-08-16_source_light-ground-and-the-theme-lab|Raw]] · Summary:
[[Summaries/Light Ground and the Theme Lab]].

**New page:**
- [[Concepts/Looking at the App]] — the theme-lab harness (`tools/theme-lab.html`,
  `theme-lab-server.mjs`, `make-preview.mjs`), why the HTTPS dev server + Google login made the
  app unviewable here, and the three ways the harness produced confident wrong readings before it
  produced a true one. **Linked from Concepts/index, Wiki/Index and MOC → Process & Discipline.**

**Rippled:**
- [[Concepts/Aldi's Design Taste]] — the 2026-08-13 *"light mode is white"* question is
  **CLOSED**: he chose the modules' cream family for the page ground, so the Phase-3 steel law is
  superseded (the "no `#FFFFFF` surface" half survives). Plus a new section on judging a theme as
  ONE thing, and on *"why are u rushing"* being his phrase for a claim made without checking.
- [[Concepts/Anti-Recurrence Check]] — **shape 5 recurred** (read a colour mid-transition, got the
  previous theme's value, nearly reported a false bug) and **shape 7 added**: a check that freezes
  a hex breaks when the hex is correctly changed — three times in one day, with the lesson already
  written in the same audit file weeks earlier. Seventh instance of a needle matching its own
  documentation also recorded.

**Not done:** ten screens still built from `bg-slate-*` panels are untouched; the measured table
lives in the repo's `.claude/PROGRESS.md`, not here, because it is work state rather than
knowledge. [[Concepts/Off-Token Colour Migration Map]] was NOT updated — it describes the
per-screen migration recipe and that recipe did not change.

## 2026-08-15 — Scheduled ingest pass: the header/dock shipped, and biometric was never a Firebase bug

The app-shell round from 2026-08-13 closed out: the desk header and dock shipped, Aldi saw it and
said *"it looks fine"*. Raw source: [[../Raw/2026-08-15_source_header-dock-ship-webauthn|Raw]].

Rippled, no new pages:
- [[Concepts/The KPM Control System]] — shell-state update (shipped, approved), the
  `grid-auto-rows: minmax(0,1fr)`-needs-a-definite-height trap, and the WebAuthn hostname-lock
  fact (biometric/passkeys are Vercel-only by design; the LAN IP is PIN-only).
- [[Concepts/The Rule That Never Applied]] — fourth occurrence: a class styled only inside media
  queries had no rule for the phone at all, so the browser default (inline `<span>`) drew the
  active tab's icon twice. Caught by, then broke, an audit check whose regex anchor matched the
  *first* of several identical `@media` fragments instead of the relevant one.
- [[Concepts/Anti-Recurrence Check]] — sixth shape: regex anchors that match the wrong occurrence,
  now the fourth time in one week. **Also propagated to the skill file**, see below.
- [[Entities/Master Vault Gate]] — the WebAuthn hostname-lock explanation, so future sessions don't
  re-diagnose "biometric keeps resetting" as a Firebase problem.
- `Backlog/PC sidebar hover-expand and top panel redesign.md` — marked shipped; its two open
  design questions were answered by the actual work (glass header, ghost watermark kept as icon).
  Its **blank-column / "more balance and more organic"** decision was left explicitly flagged as
  still open — the header round answered a different question than that one.

**Skill-file edit (the one allowed exception outside the vault):**
`C:\Users\ASUS\.claude\skills\delegate-coding-task\references\kpm-inventory-facts.md` gained a
"count the regex matches before trusting the first one" section — this is the fourth same-shape
occurrence in a week (audit-check anchors matching the wrong span of `theme.css`), which crosses
from "worth noting" to "should be known before writing the next check."

**Also closed, verbatim, not a wiki page:** *"21 dev is no"* — `/21st:21st-design-sync` must never
run on this project. Recorded in the raw source and in `.claude/PROGRESS.md`; not worth a standing
page for one closed yes/no.

Skipped: "Vault gap curator" (01:05 UTC) and "CROWN PLAN PHASE 4 PART 9" itself — the vault-facing
one is maintenance, and the KPM session's own commits/PROGRESS.md entries are the primary source
already captured above. No Inbox items.

## 2026-08-14 (13:20) — Scheduled ingest pass: the boot-animation cascade trap

`9e975aa` + `5d4f61f`, 364/364. Ingested by the `a-brain-session-ingest` task; source saved at
[[../Raw/2026-08-14_source_desk-rail-cascade-and-torch|Raw/2026-08-14_source_desk-rail-cascade-and-torch]].
Four screenshot reports from Aldi, three fixed, the fourth is his to answer.

🔑 **Music, face and logout stayed visible around a CLOSED capsule and could not be clicked.** They
carry `boot-1/2/3`, the arrival animations, which run `forwards` — and **a filled animation
outranks a normal declaration in the cascade**, so the rail's `opacity: 0` never reached them. It
reached the marks, which carry none: exactly the split he photographed. Fixed by switching the boot
animation off on the desk, not with `!important`. Circle 72 → 56 inside a 64px column.

**The left torch stood in the doorway at every real width** — the arch is `left: 4%` **plus a fixed
124px**, the torch was `21%` of the same box; they only clear past ~729px and the ledger column
never is. ⚠️ Mixing % and px positioning in one scene is the bug class, not this one instance.

This is the third same-day occurrence of one shape, so it now has a page:
[[Concepts/The Rule That Never Applied]] — new, with the two from the entry below. Rippled into
[[Concepts/The KPM Control System]] (arrival animations cannot be overridden by a plain rule later)
and [[Concepts/Anti-Recurrence Check]] (fourth shape: grep the source vs. measure the result). His
open decision — *"it just blank while its closed … i want more balance and more organic"* — is
recorded verbatim in `Backlog/PC sidebar hover-expand and top panel redesign.md`, unanswered on
purpose.

Also from that commit's notes and **flagged as environment-dependent, not a project fact**: the
PROGRESS entry states seven design skills "do not exist" and cannot be installed. In the ingest
session six of those seven were listed as available. Treat "skill X is unavailable" as a fact about
one session's environment, never as a standing project fact.

## 2026-08-14 (afternoon) — the app can be LOOKED AT, and a check that only proved a class was typed

`c53025b`, `a611857`, 364/364. Aldi: *"fix your app access in your browser first so that u can
look and check it before u gave it to me"*. Done, and it paid for itself within the hour.

**How.** The dev server is HTTPS on purpose ([[Concepts/Secure Context Requirement]]) and the
in-app browser refuses its self-signed certificate — which is why nothing had been seen for two
sessions. **Plain HTTP is not blocked.** Copy the built stylesheet beside a mock page, serve the
folder with `python -m http.server`, and open that. The mock carries the shell's real class
strings and the real built CSS but no React and **no login**, which is the only reason it is
usable — the rail does not render signed out. `:hover` cannot be forced from a script; **`:focus-
within` can**, so `.focus()` on a mark reaches the open state. Kill transitions first or you
measure a frame mid-animation. Screenshots still need Aldi to display the pane; everything else is
scriptable.

**Two bugs it found immediately**, both invisible to reading:

1. The desk panel was **176px wide — the phone's width**. A Tailwind width class on the element
   and a width rule in the stylesheet owned the same property, and the phone value won on the
   desk. The previous session's "144px so the logout stops being clipped" had never once applied.
2. The hover label was **`position: relative`**, because `.kpm-rail-mark > *` sets relative to
   lift icons above their plate and won on order at equal specificity. The label sat inside the
   capsule and, as a flex child, pushed the icon off centre.

🔑 **The lesson, worth more than either fix: a check that greps the source for a class proves the
class was TYPED, not that it APPLIES.** The 144px check passed for a whole day over a value that
never reached the screen. Assert the outcome, or measure it in a browser. Belongs with
[[Concepts/Anti-Recurrence Check]].

**And his Totem spec, from the component's own description** — he pasted it and said *"i want
exactly like that"*. That settled a contradiction: the sheet says *"Solid surface. No backdrop
blur"*, which **supersedes his earlier "transparant but blurred"** (his reading of the video).
Artefact over sentence, again — see [[Concepts/Aldi's Design Taste]]. Solid also deleted a failure
mode rather than adding one: no backdrop-filter means nothing for Lite Mode to strip. Plus the
label became its own pill, the logo became the trigger (at rest the panel takes no pointer events,
so it is not an invisible wall down the screen edge), the icons cascade, and **every control in
the rail is one shape now** — the gold unlock block and the `.kpm-expand` logout are gone.

## 2026-08-14 (later) — the desk sidebar becomes one button, and the video was finally watchable

`16c8ff9`, 362/362 checks. The strip built earlier the same day was **the wrong format** and he
said so with a screen recording. Four things came out of the round worth not re-deriving:

**A video reference can be read.** `ffmpeg` is installed on this machine, so
`ffmpeg -i <clip> -vf fps=1 f%02d.png` turns a 6-second recording into frames that can simply be
looked at. Two sessions of guessing from prose descriptions ended in one command. **Do this first
whenever he sends a clip** — see [[Concepts/Aldi's Design Taste]].

**What the frames showed**, against what had been guessed from his words: collapsed is **one
circle**, not a narrow column of icons — the earlier backlog note said "one button WIDE" and that
was wrong. Open is a floating rounded capsule, translucent over the page. The feature's name
prints **outside** the capsule, beside the icon under the pointer, on the app's own background —
only that one name, never a column of labels.

**The two-box rule that came out of it.** The panel has to keep `overflow: hidden` (a conditional
overflow there once left an expanded music panel floating over the app), but the label has to
escape the glass while the glass stays one button wide. One element cannot both clip and be
clipped, so the panel became the WINDOW and `.kpm-rail-pod` became the CAPSULE. The glass sits on
the pod's `::before`, which is what lets a circle grow into a column without moving one pixel of
what is inside it. On a phone the pod is `display: contents`, so the layout he already signed off
does not know it exists.

⚠️ **The invisible-panel trap, second shape.** The panel gave up every surface of its own for
this, so anything that hides the pod's glass hides the whole sidebar. Two ways that happens:
putting the appearance behind the `hover: hover` gate (a touch laptop matches `lg:` but not that),
or Lite Mode deleting `backdrop-filter` with nothing solid underneath. Both are pinned by a check
now. Same family as the sign-in panel that pinned its own background and not its own ink — see
[[Concepts/The KPM Control System]].

**The music player lost its desk accordion** for the reason it had already lost its card: it
opened downwards into a panel that is now 72px wide and, once the pointer leaves, 72px tall. The
pill answers both widths. Net −48 lines.

Also written up this round: [[Entities/The Admin Agent Profile Id]], the real reason his profile
picture never followed his Agent Profile.

### ⚠️ And the one I had already got wrong once: the sidebar over the lock screen (`06f299b`)

He reported it on 2026-08-14 as *"why did u change our login screen after google login tho, these
sidebar format shouldnt be showing"*. It was answered as old un-converted UI, from the diff. **That
was wrong**, and he reported it again the same day with a screenshot: *"why sidebar keep showing in
login screen"*.

**A z-index only competes inside its own stacking context.** The Master Vault gate is rendered as
one of `<BiohazardTheme>`'s own children, so it lands inside the content div — and that div is
`relative z-10`, which IS a stacking context. The gate's `z-[9999]` is resolved against its
siblings in there, and then the whole context is stamped at 10. The navigation panel is a sibling
of that div at `z-[90]`. 90 beats 10, so a menu paints over a full-screen modal, and **raising the
gate's number can never fix it.**

The panel steps aside instead — `{user && !showAdminLogin && (`, which the edge ribbon already
did. Two checks now carry the reasoning so the next person reaches for the guard and not for a
bigger number.

The general law, worth more than this instance: **when a `fixed` full-screen overlay fails to
cover something, look for a positioned ancestor with a z-index, not for a bigger z-index.** Same
family as the `backdrop-filter` trap recorded above — an ancestor quietly deciding where and how
high a child lives.

🔑 **And the process lesson:** the first answer was reasoned entirely from the diff — "I changed
nothing here, therefore nothing here is broken". A diff proves what changed. It cannot prove what
is correct. He was reporting a real defect that predated the change, and the reply talked him out
of it. Verify the report before disproving the cause.

## 2026-08-14 — A-BRAIN IS THE MEMORY, and the desk navigation becomes an 88px strip

**His standing instruction, and it changes where things get written:** *"this app memories and
facts should be take noted inside the A-Brain, this app folder is just for workspace, all the
memories regarding anything should be taken from A-Brain"*. So the vault is the authority for every
fact, decision, incident and taste note about the KPM app. Anything in the repo or in a skill
reference file is a **pointer**, and when the two disagree A-Brain wins and the copy gets fixed.
`.claude/PROGRESS.md` stays as session state — where the work stands — never as knowledge.
Applied immediately: the shell facts written into
`skills/delegate-coding-task/references/kpm-inventory-facts.md` earlier the same night were cut
down to a summary that names [[The KPM Control System]] as their authority.

**The desk navigation** (`20193bd`): 256px of words became an **88px strip of marks**, always
visible, never opened or closed — his ask *"i want u to change the sidebar for pc to be like this,
so it doesnt take so much space"* against a Framer *Totem Side Bar* reference (~70–98px wide, 44px
rows, 10px gaps, 20–32px icons), plus *"the sidebar u pull here is the sidebar for phone only dont
use it on PC"*. The pull-ribbon is phone-only again. The desk finally joins `.kpm-rail-mark`, so
the white glowing slab and the hand-rolled gold UNLOCK button are gone. 76px of dead header inset,
left over from a menu button deleted weeks ago, removed — that was the *"spaces useless"*.
Written up in [[The KPM Control System]] under **two layouts in one file**, with the rule it
taught: *name the WIDTH before saying a screen was or was not done*.

## 2026-08-14 — the two locked screens became one, and a panel that was invisible in light mode

Two of his asks on the sign-in screen (`371a165`), then one on the PC drawer. The middle panel took
the vault gate panel's **format**, not only its colours — he had already been given the gate card's
background, border and width as a shared class hours earlier and said it still did not match,
because what he reads is the contents, not the shell. That ask surfaced a live bug:
`.kpm-mod.gate` paints its own near-black ground in both themes while its text still read
`var(--ink)`, which is `#131211` in light mode. Every light-mode user who signed out saw a card
with no readable text. Now written up as contract rule 5 in [[The KPM Control System]] — *a class
that pins its own background must pin its own ink*.

Also recorded in [[Aldi's Design Taste]]: **"same colour" and "similar format" are two separate
asks**, and a control that can do nothing in the current context reads to him as old UI rather than
as neutral. The drawer no longer renders while signed out and no longer opens itself on the desk.

The answer he needed on the drawer's age is the one worth keeping: the sidebar redesign he
remembered **did** happen, on 9–10 August, and every commit in it was the **phone** rail. The desk
list is still hand-written `lg:` classes. *Name the width before saying whether a screen was done.*
That one is in `skills/delegate-coding-task/references/kpm-inventory-facts.md`, where Alucard
loads it for KPM code work. Vault commit for the concept pages: `128fa7c`.

## 2026-08-11 — the customer picker moved to the top of the sales terminal

His design call, made 2026-08-10 ~21:00 and deliberately not built that night for lack of quota:
*"what if we put the customer on top instead just near the strip?"* Shipped this morning as commits
`237bf6f` and the follow-up direction fix — a 44px one-line bar above the manifest drawer's grip,
closed drawer 52px → 96px, the paper keeping the geofence column and echoing the name read-only.
Audit group 22 (7 checks) pins the shape: one input, one dropdown, the read-only echo, the bar
above the grip, the click-outside class, both opening directions, and the three places that must
agree on 96.

Two things worth carrying forward, both written into [[Concepts/Aldi's Design Taste]]: he **will**
buy permanent fixed height on a phone when the pinned thing is the first question of the task and
collapses to one line — which reconciles this with his 2026-08-10 rejection of pinned toolbars;
and the near-miss, a suggestion list pinned above a drawer that opens to 92% of the screen, which
would have rendered 200px past the top edge and made no customer selectable. Found by reading the
geometry, never in a browser — **the layout has still not been seen at 375px by anyone.**

## 2026-08-10 — Hermes Agent studied; seven of its rules now govern Alucard

New sibling domain `Hermes-Agent-Research/` (outside `Wiki/` by design — it is not KPM app
knowledge). Two pages: an architecture read of Nous Research's Hermes Agent from its installed
source, and the output of a 16-agent sweep that put 19 candidate rules through an adversarial cut.
Seven survived and were applied to `~/.claude/skills/alucard/SKILL.md` (263 → 282 lines).

The change that matters for everything else in this vault: **`(checked: ...)` receipts now go
stale at the next edit, not at the end of the session**, and a check that could not have gone red
counts zero. Both tighten the evidence standard behind every `[certain]` claim recorded here.
Also new: never write a Lesson saying a tool is broken — this repo's own `0aabb81` → `b1aee4e`
proved such a claim can be false one day later, while a stale negative fires forever.

Twelve proposals were rejected, and the pattern is worth keeping: Alucard already covered most of
what Hermes enforces in code. See [[../Hermes-Agent-Research/2026-08-10 Seven Rules Worth Porting]].

## 2026-07-27 — First ingest pass (structure build + seed content)

Built the vault structure (`CLAUDE.md`, `Raw/`, `Inbox/`, `Wiki/Index.md`, `Wiki/Log.md`,
`Wiki/Entities/`, `Wiki/Concepts/`, `Wiki/Summaries/`) per
`PLAN-second-brain-integration.md` v1 and the accompanying build prompt.

Ingested 13 real sources into `Raw/` (memory files copied verbatim, plus verbatim git log
output, a `firestore.rules` excerpt, and a Ponytail rulebook excerpt) — no invented filler
content.

Produced:
- 6 Entity pages: Multi-Tenant Architecture, Tier System, Firestore Rules, Fleet Captain
  Permission Gap, Rank Config and Achievement Badges, Git Worktrees
- 4 Concept pages: UI-Says-Yes-Server-Says-No Pattern, Anti-Recurrence Check,
  Draft-Then-Deploy Discipline, Ponytail Philosophy
- 9 Summary pages, one per ingested source group (see Wiki/Index.md for the full list)

Every summary ripples to at least one Entity/Concept page; every Entity/Concept page cites
at least one summary. Cross-links verified by hand during writing — no orphan pages.

One honest gap flagged in Wiki/Index.md rather than papered over: offline/PWA-specific
material doesn't have a clean Entity home yet, and feature-level "how it actually works"
knowledge (Fleet & Canvas, Stock Opname, etc.) isn't covered in this first pass.

Next ingest candidates: the recovered NOO/`handlePhotoCapture` incident in more depth (right
now it's only touched via the worktree-incident summary), the Customer/Notification scoping
investigation (`project_kpm_customer_notification_scoping` memory, not yet ingested), and
whatever real material accumulates from future sessions.

## 2026-07-27 — Tidy pass (frontmatter, titles, MOC)

No new content ingested — this pass made the existing vault easier for a human to actually
browse:

- Added `title`/`description` frontmatter to all 19 Wiki pages (Entities/Concepts/Summaries),
  all 12 `Raw/` sources (display fields only — no source text touched), all 9 `Backlog/`
  cards, and both `Brainstorm/` pages. `Raw/` filenames were deliberately left as-is (their
  `date_source_slug` naming is the documented convention for immutable sources, not a
  mistake) — they now carry a readable `title:` for display instead.
- Built `Wiki/MOC.md` — a Map of Content organized by topic (Security & Permissions,
  Process & Discipline, Architecture, Incidents), meant as the actual human starting point.
  `Wiki/Index.md` stays as the flat A-Z catalog for AI queries; both now point at each other.
- Removed `Welcome.md` and `create a link.md` — Obsidian's stock onboarding notes, empty of
  real content and not linked from anything real. Recoverable via git if that was wrong.
- Verified every `[[wikilink]]` in `Wiki/`, `Backlog/`, `Brainstorm/`, and the new MOC
  resolves to a real file — zero dangling links introduced. The only unresolved `[[...]]`
  references left in the vault are pre-existing ones inside `Raw/` files, pointing at the
  original Claude memory system's slugs (e.g. `project_kpm_rules_draft_process`) rather than
  vault pages — these predate this pass and are out of scope to fix since `Raw/` content
  can't be edited.
- `CLAUDE.md` updated: documents `Wiki/MOC.md` in the vault map, and adds a step to the
  Ingest operation so future passes keep the MOC and frontmatter current, not just the Index.

## 2026-08-10 — Six-day backfill, on Aldi's emergency instruction

**The vault had not been written to since 2026-08-04 while 178 commits landed in
`kpm-inventory`.** Aldi called the gap an emergency and ordered it closed before any code work:
*"make sure that all the data that we have done here is written in A-Brain before anything else,
because its part of the plan to become agentic Agent for alucard"*.

Ingested one source covering 2026-08-04 → 2026-08-10:
`Raw/2026-08-10_source_kpm-six-days-aug04-to-aug10.md` — commit skeleton, his verbatim quotes,
the findings, the mistakes, and the decisions he closed.

Produced:
- 3 Concept pages: [[Secure Context Requirement]] (the `crypto.subtle` root cause behind months
  of failed phone logins), [[Silent Failure Disease]] (the app's oldest bug class, named at last),
  [[Aldi's Design Taste]] (written on his instruction — he wants his taste learned, not re-derived)
- 1 Entity page: [[Master Vault Gate]]
- 1 Summary page: [[Six Days — Gate, Phone Access, Quota Meter]]
- `Wiki/MOC.md` gained two new sections — **Design & Interface** and **Phone & Device** — the
  first structural change to the MOC since it was built.

**Why the gap happened, recorded so it does not repeat:** all six days of reasoning went into
`kpm-inventory/.claude/PROGRESS.md`, which a `SessionStart` hook prints automatically. It served
the resume-the-session job so well that the vault was never reached for. **A note that survives a
`/clear` is not the same as knowledge that survives a project.** The Alucard skill was amended in
the same session to make the vault write mandatory rather than optional.

Known gaps left honest, not papered over: the Duke's Ledger / sales terminal surface still has no
Entity page, and the quest log (the instrument every test result comes through) is undocumented.

## 2026-07-27 — Scheduled ingest pass (`a-brain-session-ingest`, first run)

Reviewed CCD session history (14 sessions, 2026-07-22 through 2026-07-27) against existing
vault content. Most were already fully reflected — either by the first ingest pass's Summary
pages, or (for the two most-recent 2026-07-27 sessions covering the vault rename and Graphify
wiring) by `PLAN-A-Brain-agentic-OS.md`'s own revision log and `Automation-Setup.md`, which
were written live during those sessions. `Inbox/` was empty.

One genuinely new item ingested: the "Plugin marketplace DietrichGebert/ponytail" session
(2026-07-26), covering a McAfee-caused silent freeze during the Claude Code CLI install and
its curl-based workaround, plus the non-interactive `claude plugin marketplace add`/
`claude plugin install` commands used to install ponytail. Saved to `Raw/`, new Summary page
[[Claude Code CLI Install — McAfee Download Freeze]], rippled into [[Ponytail Philosophy]],
added to `Wiki/Index.md` and `Wiki/MOC.md`.

Explicitly skipped as already-covered, not overlooked: "Abandoned worktrees audit" and "MCP
server installation" sessions — both are the same underlying incidents already documented in
[[Lost Work in Worktrees — Three Incidents]].

## 2026-07-27 — Scheduled ingest pass (`a-brain-session-ingest`, second run)

Reviewed CCD session list again; one genuinely new session found: "Full app review and git
integrity audit" (2026-07-27, after the first run). A `/ponytail:ponytail ultra` review
re-confirmed [[Firestore Rules|Firestore rules deploy]] as still the top open gap, then a
dead-code/dependency/asset cleanup and hygiene pass landed as commit `ce3b001` on branch
`cleanup-dead-weight-hygiene` (not yet pushed/merged as of this ingest). New Summary page
[[Dead Weight Cleanup and Rules-Deploy Gap]], rippled into [[../Entities/Firestore Rules]] and
[[../Concepts/Ponytail Philosophy]], added to `Wiki/Index.md` and `Wiki/MOC.md`.

Other sessions on the list were either the ingest task's own prior run ("A brain session
ingest") or already logged in `runs/session-ingest-state.md` from the first pass. `Inbox/`
was empty.

## 2026-07-28 — dependency-removal regression, fixed and rippled

The `cleanup-dead-weight-hygiene` PR broke Vercel's production build: `react-is` was
removed as unused (nothing in `src/` imports it) but `recharts` needs it internally. Fixed
(commit `9cddd45`), verified with a real `npm run build` before pushing again. Updated:
[[Summaries/Dead Weight Cleanup and Rules-Deploy Gap]] (the incident, in full),
[[Concepts/Anti-Recurrence Check]] (added as a second real example of "local check doesn't
match real conditions"), `Wiki/MOC.md`, `Backlog/Remove unused code and dependencies.md`
(corrected its own wrong "no functional risk" claim), and the `delegate-coding-task`
skill's `kpm-inventory-facts.md` reference (so future sessions doing dependency cleanup
start with this already known — not just documented here passively).

## 2026-08-11 — Lancelot built: the tobacco business gets a bookkeeper agent

Aldi's tobacco (tembakau) buying business now has its own agent, separate from the KPM app.
New Concept page [[Concepts/Lancelot the Tobacco Ledger Agent]], linked from
`Wiki/Index.md`, `Wiki/Concepts/index.md`, and `Wiki/MOC.md` (Process & Discipline).

Three findings worth not re-deriving:
1. **Google Drive alone cannot write to an existing spreadsheet** — it is read-only for existing
   files. **Autosheet** is the MCP connector that writes. There is no standalone "Google Sheets"
   connector on claude.ai. Establishing this consumed most of a session.
2. **His call: receipt images are Drive links, not embedded image objects** — "A is better".
   Links survive row insertion; embedded images shift and detach.
3. **Photos pasted into chat are not files** and cannot be uploaded to Drive from the
   conversation. Permanent property of the workflow, not a bug.

First real transaction written: `PAK MUL` tab, 11/08/2026, bruto 185kg → netto 166.5kg at
Rp 55.000/kg, total Rp 9.357.500, LUNAS (BCA→BRI transfer matched the nota exactly). `TR2` was
unreadable under the business stamp and was recovered as 29 from the arithmetic; he confirmed it.
That produced the standing rule: say which number was *inferred* rather than *read*, and ask
before writing it.

## 2026-08-15 — Phase 6 closed: Settings is fully on the control system

27 commits, `phase0-solid-ground`, audit 419 → 508. All of `SettingsView.jsx` converted — Security
& Data, General & Brand, Tiers & Logic, the Command Center chrome, and `PermissionMatrixEditor`.
Details and the new class list are in [[Concepts/The KPM Control System]]; the light-mode warning
that came out of it is in [[Concepts/Off-Token Colour Migration Map]].

**Light mode is the next front**, on his order, and Phase 6 was chosen first precisely because it
does most of that job in advance. Indonesian is queued behind it and **has not been asked for** —
his words were *"if needed in the future"*.

Six things worth not re-deriving:

1. **The mascot never appeared on the size slider because the dispatch ran LAST.** It sat after a
   `setDoc(doc(db, …))` in the same handler; `doc()` throws synchronously, so the call was skipped
   while the number had already moved. General rule: **the user-visible effect goes first, before
   anything that can throw.** A check now asserts nothing precedes it.
2. **The receipt watermark was anchored to the modal SHELL, not the printed SHEET.** Found only by
   building the "View receipt" preview he asked for — the bug was invisible until something drew
   the page at its real size. Geometry now lives in one shared config so preview and nota cannot
   drift.
3. **An under-counting needle hides exactly what the check exists to catch.** Wrapping a
   delete-button count in `strip()` looked like the clean fix for a comment being counted; it is
   not — `strip`'s non-greedy comment pair swallows real code in `CustomerManager.jsx` and dropped
   one of its two genuine delete buttons. The comment was reworded instead.
4. **Needles matching their own documentation, four times in one week.** A check's regex found the
   comment that explained the check. When a needle is quoted in prose near the code it scans, the
   count is wrong and everything still passes.
5. **`data-kpm-del` must be the FIRST attribute on the tag** — the needle anchors immediately after
   the tag name, so slipping `type="button"` in front silently unmarks the button. Nothing errors.
6. **"There is 2 default here."** The customer-access dropdown listed a "not set" line and a Global
   line under identical words, because `getCustomerAccessLevel()` resolves an absent permission to
   `'global'` — **one state wearing two names**, and the second could never be selected. The fix
   collapses the STATE on the read side (`|| 'customers_edit_global'`) *before* removing the
   option; deleting the option first would have left every unset tier valued at a choice that no
   longer exists — a blank control on the screen that decides who may edit customers. Reporting
   Authority looked identical and is not: there `'none'` genuinely means no access.

⚠️ **Nothing in this entry was verified by screenshot.** The dev server is HTTPS by design and the
in-app browser refuses it; the app needs Google sign-in. **His eyes remain the only test that has
ever run on appearance.**

## 2026-08-16 → 17 — EOD Setoran: the redesign Aldi specified himself

Four pitched concepts, all rejected in favour of a flow he wrote out in one message: four cards →
a letter → three approvals (agent → regional admin → HQ), with the WANTED poster demoted to unpaid
bounties and a separate repayment flow. See [[Concepts/Aldi's Design Taste]] for why his beat mine.

**Built and committed:** the record shape (`eodRecord.js`, self-check, audit group 47), the
four-card counting deck, the letter, the composed agent flow, and the wiring into the live screen —
with real per-sale source rows so a gap leads back to a named customer.

**His decisions, all locked:** Sheriff's Desk concept · Accept short = yes · a perfectly-counted day
glows GOLD (a deliberate exception to his own palette law) · per-card approval is real, one result
per card · approve-all shortcut yes, no grey-out ("we gave admin power and we should trust them") ·
missing transfer covers both never-arrived and arrived-short · HQ = T2, regional = T3, no new tier.

**Three faults he found on the real screen** that every passing check missed — a composition bug, a
one-input goods card that destroys traceability at the point of entry, and a misread of "cards put
INSIDE the letter" as two scenes instead of one. Full reasoning in
[[Concepts/Aldi's Design Taste#He tests on the REAL screen and finds what a harness cannot]].

**Method that came out of it:** [[Concepts/Looking at the App#Rendering a React component without
signing in]] — esbuild + the real stylesheet + pause-and-seek for a motion frame.

**Open when this was written:** per-row goods counting, the cards-into-one-letter animation, the
duplicate PITA CUKAI card, and two jobs only Aldi can do — tick `view_stock_opname` for T3 in the
permission matrix, and deploy the rules change that Accept short will need.

## 2026-08-18 — store hand-off name collision

**Ingested:** [[../Raw/2026-08-18_source_store-handoff-name-collision|the hand-off session]] →
[[Summaries/Store Hand-off Name Collision]].

**New concept:** [[Concepts/A Store Name Is Not a Store]] — his book holds three shops with one
name, 14.5 km apart, and nothing but the customer document carries an id. Every name-keyed sweep
in this app is a money bug waiting for the second shop to register.

**Near-miss worth keeping:** the job prescribed filtering transactions on `t.customerId`. That
field exists on no transaction in the codebase, so the "fix" would have approved the hand-off,
notified both agents, and moved zero rows. The over-broad match it replaced at least fails
loudly. Checked before trusting the brief, not after.

**Shipped:** commit `505ddcf`, build clean, 599/0, selfcheck 59/0 → 72/0.

## 2026-08-18 — the sale engine both guessed at a store name and rewrote it

Two bugs in `handleMerchantSale`, one root cause, fixed together in `264c138`. The profile lookup
matched on PART of a name, so "SARI" typed for a walk-in booked the sale and its Rp 2.000.000
Titip debt onto "WARUNG SARI RASA". And the price tier was appended to the name of any store not
yet in the book — "Warung Bu Sari (Retail)" — so the next visit typed the real name, matched
nothing, and the debt, last order and visit history vanished from the panel. Through the NOO
modal the customer DOCUMENT was created with the suffix, permanently.

**The half that was nearly missed:** dropping the suffix alone splits every shop that already
carries it, and the receivables screen groups by name, so one shop becomes two rows with half
the balance each and NOTHING errors. Handled by tolerating the old form when comparing, in one
shared helper — `storeKey()` in `src/utils/helpers.js` — now used by the engine and by
`ConsignmentFinanceView`. Written up in [[Concepts/A Store Name Is Not a Store]].

**Method note worth keeping:** the six regression guards were watched FAILING first — stash the
three source files, run the self-check, see 80/6, restore. A guard never seen red is not evidence.

**Shipped:** commit `264c138`, build clean, 599/0, selfcheck 72/0 → 86/0.

## 2026-08-18 (2) — the same split reached the agent's own debt list

`storeDebt` in `AgentProfileView` keyed on the raw `customerName`, so after `264c138` stopped the
sale engine welding the price tier on, one shop could sit in the "who owes me" list as
"Warung Bu Sari (Retail)" AND "Warung Bu Sari", each holding part of the debt — and a payment
filed under one spelling never cancelled the other. Keyed on `storeKey` now, display name kept as
written. Commit `4b63118`.

**The decision worth keeping:** the `&& storeDebt[key]` guard on the payment line STAYED. Once the
key is unified, the only case left where it fires is a payment whose sale is outside the loaded
window — and there the debt is already absent, so subtracting would invent a negative for a shop
that owes nothing. The alternative (drop the guard, clamp afterwards) is more code for a number
the existing `> 0` filter already hides. **The self-check runs the branch that was NOT chosen** and
pins what it would have produced (−400.000). A rejected option with a check on it cannot be
quietly re-adopted later by someone who did not read this.

**Still open, and the interesting one:** `src/utils/customerBrief.js` carries a PRIVATE copy of the
name rule — trim + lowercase, no suffix strip. A shared helper does not help the file that never
imported it, and its own comment shows the author reasoned about the problem and stopped one step
short. That is how a fixed bug reappears one file over. See [[Concepts/A Store Name Is Not a Store]].

**Shipped:** commit `4b63118`, build clean, 599/0, selfcheck 86/0 → 99/0.

## 2026-08-18 (3) — the private copies, and a check that pinned a spelling instead of a behaviour

`customerBrief.js`, `dayStats.js` and `MerchantSalesView`'s auto-pick each compared store names by
their own rule. All three now use `storeKey`. Commit `f1e3b28`, build clean, 599/0, selfcheck
99/0 → 115/0, customer-brief 9/9, day-stats 7/7, no fixture edited.

**The pattern worth naming: a private copy of a shared rule is how a fixed bug comes back one file
over.** `customerBrief`'s own comment argued correctly that a raw match splits a customer's history
— the author had reasoned about the exact problem and stopped one step short of the tier suffix.
Being right about the principle did not stop the bug, because the rule lived in that file instead
of in one place. Three private copies have now been found by hand; the check that finds them all
at once (grep for `.trim().toLowerCase()` next to a customer name) is queued and is worth more than
any single fix.

**A check can pin a spelling instead of a behaviour, and then it lies twice.** `integration.audit`
G18 — "an empty or whitespace-only name never selects anything" — required the literal
`typed.trim().toLowerCase()`. It went red on a rename while the behaviour it exists to protect was
untouched: red for a change that was correct, and it would have stayed green if someone kept the
spelling and deleted the `if (needle)` gate. Repinned on the gate, and the behaviour itself is now
asserted on real values (`''`, `'   '`, `null`, `undefined`, `' (Retail)'` → all `''`). **When a
guard goes red on a rename, the guard is the thing to look at first, not the rename.**

**Method note:** the two util self-checks (`customerBrief`, `dayStats`) crashed on an extensionless
`./helpers` import — node's ESM resolver does not add `.js` the way Vite does — and they crashed
BEFORE anything was claimed working, because they were run first rather than at the end. A build
would never have caught it: Vite resolves it fine. The `.js` is deliberate in both files and there
is a check on it now.

See [[Concepts/A Store Name Is Not a Store]].

## 2026-08-18 (4) — the map read a shop's whole history as empty, and a zone counted it twice

`MapMissionControl` matched store history with a raw `===` between `store.name` (from the customer
document) and `t.customerName` (typed at the counter). One capital letter apart and the pin showed
no sales, no stock and **no debt** — a shop with money outstanding read as settled, which is the
worst direction for this bug to fail in. Commit `a3a9cf6`, build clean, 599/0, selfcheck 115/0 →
130/0.

**The method that made this one safe: label every site before touching it.** Four matches, and
they were not the same kind of comparison — one display list, and three sums, one of which
**writes to Firestore** (the RPG Migration button banks `lifetimeXP` / `seasonXP` into the store
documents). A "just normalise the comparison" sweep would have silently changed three numbers he
reads and one he stores. Every sum site got a behaviour check stating the BEFORE next to the
AFTER on real rupiah: a pin reading "revenue 300.000, debt 0" now reads "2.300.000, debt
1.500.000". A changed number on his screen has to be a number that was decided.

**And one fix beyond the four, because the change would have widened it:** two customer documents
sharing a name return the SAME transactions — the rows are indistinguishable, there is no
customerId to separate them — so a heatmap zone was adding one shop's takings twice. Already true
for identical names; matching by key would have extended it to every spelling variant. The zone
sum now counts each distinct key once. **When a fix widens the blast radius of a bug that was
already there, the pre-existing bug is part of the job.**

`.customer` was checked before the fallback at the XP loop was kept: no transaction in this
codebase writes that field, but nothing here can prove it for every row ever written offline, and
keeping it costs nothing.

See [[Concepts/A Store Name Is Not a Store]].

## 2026-08-18 (5) — write the guard that finds the class, not the fourth instance

Four private copies of the store-name rule had been found one at a time, one session each. The
fifth session wrote the check instead: scan every file under `src/`, comments stripped, for a
`.trim().toLowerCase()` next to `customerName` / `storeName` / `store.name`, and fail with
`file:line`. It found **eight**, five of which were on no list — including the FIFO debt engine at
the sales counter, both read sides of `JourneyView`'s visit map, and the row sweep an account
hand-off WRITES. Commit `ef437b1`, build clean, 599/0, selfcheck 130/0 → 150/0.

**The lesson is the ratio.** Hand-searching found 3 over four sessions. One guard found 8 in one
run, and will find the ninth on the day someone writes it. **When the same defect has been found
three times, stop fixing instances and write the finder.**

**Two design points that made the guard survivable:**
- **Comments stripped first.** A regression guard for `.includes(inputTrimmed)` once went red
  against the FIXED code because the comment explaining the fix contained the phrase. A text scan
  that reads prose reports the opposite of the truth. Three checks pin this: banned shape in a
  comment must NOT count, same shape in code MUST count.
- **Scoped to store-name identifiers.** `.trim().toLowerCase()` is correct on an email, a search
  box, a product name. A guard that fails on those is a guard that gets deleted in a week.

**One claim of mine was wrong and the file corrected it:** the hand-off note said `JourneyView`'s
`.trim()` throws on a nameless row. It cannot — line 264 coerces every `customerName` through
`String(t.customerName || '')` before that code sees it. **A prompt written by a previous session
is not evidence; the file is.** A behaviour check also caught an arithmetic claim of mine — the
old rule DID trim, so it subtracted a payment from a debt it could not see, making the BEFORE
300.000 rather than the 800.000 I asserted.

**Now open, and it is his call, not a code task:** old names are still written in the data, and
every screen displays whichever spelling came first. Cleaning them means writing to his live book.
Queued in `.claude/NEXT-SESSION.md` as a question for him, with the migration deliberately NOT
written — a script that exists is a script someone runs.

See [[Concepts/A Store Name Is Not a Store]].

## 2026-08-18 (6) — clean the old names without writing to the book

Aldi, asked whether to leave the legacy "(Retail)" endings or clean them: *"clean it then move on"*.
Done at DISPLAY, not in the database. `storeLabel()` joins `storeKey()` in helpers — same suffix
rule, but it keeps capitals and spacing, because `storeKey` answers "same shop?" and `storeLabel`
answers "what do I print?". Commit `883a62e`, build clean, 599/0, selfcheck 150/0 → 163/0.

**Why not the migration he authorised.** Rewriting the customer documents was the obvious reading
of "clean it", and it is a live-data write that needs a verified backup first. Stripping at display
reaches every screen he actually looks at, writes nothing, and is reversible by deleting one
function. **The better option was available because a fact turned up during the work, not because
his instruction was second-guessed** — see below.

**The fact that decided the shape: the backup round-trips the in-memory customer list.**
`exportData.customers` is built from the live array and a RESTORE writes it straight back with
`set()`. So stripping names on load — the one-line version of this fix — would have turned any
future restore into a silent permanent rename of every shop in the book. Checked before writing
anything. The customer directory is excluded for the same class of reason: it is the one screen
that writes customer documents in bulk through `commitInChunks`, so it still shows the suffix, and
that gap is deliberate and recorded.

**The quiet win:** the sale engine now resolves against the display copy, so a store's NEXT sale is
written with the clean name. The old names retire as shops are served again — a migration that
needs no migration, no backup and no button.

**The invariant that makes relabelling safe, and it is checked:** every spelling ever written still
resolves to the same shop after relabelling, and relabelling never merges two shops that were
separate. If that could fail, renaming on screen would silently lose history.

Also worth keeping: **four of the eight new checks assert what must NOT change** — the backup export
must keep reading the raw list, the directory must keep receiving it. A guard on the thing you
deliberately did not do is how a later session finds out it was deliberate.

See [[Concepts/A Store Name Is Not a Store]].

## 2026-08-18 (7) — tell it once

Measured one session: 195 lines of actual fix, 2,359 lines written *about* it — commit messages,
PROGRESS, this vault, the next-job file, and the replies, all carrying the same facts. Aldi, shown
the ratio: *"yes"*. **From now the full story lives in the commit message only; everything else is
a pointer.** If a vault entry could be replaced by `git show <hash>`, it should be — so entries
here shrink to the LESSON and drop the retelling.

Not shortened, and this is the boundary: the self-checks, which caught two of my own wrong claims
that same session, and any note recording why something must NOT change.

## 2026-08-18 (8) — a guard that is red on day one gets deleted in a week

Four van-stock conversions replaced with the `convertToBks` helper they already had (`f51a3a9` —
the story is in that commit). **The lesson is the guard, not the fix.**

The obvious check was "no file may hand-write pack-size maths". About twenty CORRECT hand-written
copies exist, so that check would have been red from the first run, and a permanently-red check is
one nobody reads. The guard shipped instead is narrow: it fails a one-line size ladder that starts
at Slop and never names `balsPerCarton`. Every correct copy names it; all three broken ones did
not — so it named exactly the three real bugs and was silent on the twenty. **Scope a guard to the
shape of the DEFECT, not to the shape of the habit.**

Second: the behaviour block imports the real helper instead of restating the maths. A self-check
carrying its own copy of the rule it is checking would be the same disease. See
[[Concepts/A Store Name Is Not a Store]] for the sibling case with store names.

## 2026-08-18 (9) — a stock figure trusted after the moment it was true

Stock-count approval fixed (`5c4d3c7` — story in the commit). **The lesson is the shape, and it has
now appeared three times:** approving a morning count over an evening's stock, Clear Canvas
crediting the warehouse from a stale screen, and offline sales never reducing van stock. Every one
is the same sentence — *a stock figure is trusted after the moment it was true* — and every one
inflates stock rather than losing it, so it looks like abundance, not like an error.

Two things that keep making these smaller than they look: the correct value is usually **already
stored** (`expectedStock` was snapshotted at count time; the live canvas is one read away), and the
correct pattern is usually **already in the same file** — `handleLoadCanvas` re-reads inside its
transaction fifty lines above the function that does not. **Before designing a fix here, look up
the file for the sibling that already works.**

Also: `increment()` turned "read current stock, subtract, write" into one atomic server-side delta,
which is what stopped this fix from becoming a transaction rewrite. Worth reaching for whenever a
batch write needs to adjust rather than replace.

## 2026-08-18 (10) — five of one shape, and the guard that keeps passing itself

Six fixes in a row, all commits: `ec45ab9` Clear Canvas, `4c38b91` the lying online flag,
`ac492c3` offline sales not leaving the van, `553cf91` the offline store status, `655e7f1`
shipping to a branch. Stories are in the commits.

**The shape is now confirmed five times over: a stock figure trusted after the moment it was true.**
Approving a morning count at night · clearing a van from a screen loaded an hour ago · selling with
no signal and never touching the van · shipping HQ stock computed before a photo upload. **And the
cure was the same twice: `increment()`.** A batch write that ADJUSTS instead of REPLACING needs no
read, so there is no stale number to be wrong. Reach for it whenever a fix starts with "read the
current value first".

**Then the class was swept rather than waited on.** Every other `stock: cached ± qty` in `src/` was
checked: all inside `runTransaction` (safe by construction), or sub-second windows where the
computed value is also needed for the low-stock alert. **One real instance, and now it is known
that the rest are fine — which is worth as much as the fix.**

**The recurring self-inflicted wound, three times today: a guard that cannot fail.**
Twice it matched a sibling function in the same file (`handleLoadCanvas` next to
`handleClearCanvas`; the transaction flush next to the customer flush), once it matched the comment
explaining the fix. All three PASSED against broken code. **Testing a pattern against a whole file
is the bug — scope it to the function, and strip comments first.** A red guard is annoying; a
green one that proves nothing is a lie with a tick next to it.

Also: two OLDER guards went red during the canvas extraction and were REPINNED, not relaxed —
they pinned variable names the refactor renamed while the behaviour was untouched. **A guard going
red on a rename is a guard doing its job; look at the guard first, not the rename.**

## 2026-08-18 (11) — silence, and the guard that had to stop stripping comments

Two debt numbers merged into one (`2dbfc66`), then twenty-three silent failures given a voice
(`b3f6dae`). Stories in the commits.

**The lesson is about the guard, again, and it inverts yesterday's rule.** The sweep for empty
catch blocks was written the way every other guard here is written — comments stripped first — and
it flagged eighteen catches that are empty ON PURPOSE, each carrying a comment explaining why
silence is correct there. Stripping comments made a deliberate decision indistinguishable from an
oversight.

So: **strip comments when the comment could FAKE a fix; keep them when the comment IS the fix.**
A regression guard looking for removed code must not read prose. A guard asking "did anyone think
about this?" must read exactly that prose, because the comment is the evidence. Same file, opposite
rules, and getting it backwards produces either a lie with a tick or a check nobody can keep.

**And a rule for reporting, from the five silent saves in the map panel:** the message has to name
the consequence, not the operation. "Save failed" tells him nothing he can act on; "PRICE TIER NOT
SAVED — this store is still on its old tier, do not sell at the new price" tells him what to do in
the next thirty seconds. Fourteen of the sixteen swept catches were left silent deliberately, each
with one line saying why — **the fix for a cosmetic silent failure is a sentence, not a toast**, and
a toast for every cache miss trains him to ignore all of them.

## 2026-08-18 (12) — the count that was recorded and never compared

EOD payload now carries what the agent COUNTED, not what the app expected (`d859d41` — story in the
commit). **The lesson is the failure shape, and it is a new one for this vault: a feature that is
fully built, fully used, and connected to nothing.**

Nothing was broken. The counting screen worked, the numbers were stored, the agent saw a shortfall
on his own card. But the figure that ACTED was the system's own expectation, so the submitted cash
was the expected cash and the two could never disagree. **A comparison that cannot come out
negative is not a check.** Worth looking for elsewhere: any screen where the "actual" and the
"expected" are the same variable by the time they are written.

**And the discipline that mattered more than the code:** the backlog note said do not change this
payload before deciding what happens when the count is LOWER, because sending it without a ruling
step would post shortages straight against agents — the exact thing Aldi said must not happen. So
the fix carries the gap and marks it DISPUTED, and debits nobody. **His rule for transfer shortfalls
(it waits for the company to rule) was applied to cash and goods rather than inventing a third
answer** — reuse his own decision before asking for a new one, and say plainly that you did.

The half that stays open is his, not code: what the admin may DO with a disputed report. Written
into `.claude/NEXT-SESSION.md` as a question in his words, with the one option that takes money from
a person flagged as needing him to say it out loud.

Also today, his call on shipping: *"we might it later if we done with everything"* — the 538-commit
merge to `main` waits until the work is finished, not before.

## 2026-08-18 (13) — Aldi ruled on the EOD shortfall, and most of it was already built

His words, asked what the admin may do with a short count: *"admin can approve but it will add up to
the agent's bounties instead, and for the bounties, the agent can repay their debt through the EOD
screen even after bounties recorded on their name"*. Shipped as `7f96d19`.

**The finding worth keeping: the answer was two-thirds already in the codebase.** The WANTED board
already summed every `PENALTY_` key, and a `BOUNTY` clearance report submitted from the agent's own
EOD screen already deleted them on verification. His "repay through the EOD screen" needed no code
at all — only the MINTING was missing, and it is one line. **Before building a rule he has just
stated, look for the half of it he already asked for months ago.**

**Three choices inside that one line, each of which would have been a bug the other way:**
- Keyed by report id and **assigned, never incremented** — verifying the same report twice writes
  the same number, so a double-approve cannot fine a man twice for one night.
- Cash and transfer floored at zero **separately** — counting extra cash must not silently pay off a
  missing transfer.
- **Money only.** A goods shortage rides along as a flag and is deliberately not priced. What a
  missing pack is worth is his call; burying an assumed price inside a transaction would have been
  inventing a fine.

**And the pattern from earlier in the day held again:** the fix is allowed to let the admin approve,
because he said so — the change is that approving is no longer silent. The confirmation names the
rupiah and says the agent can repay it. See [[Concepts/Aldi's Design Taste]] for the standing law
this serves: every action must report.


---

## 2026-08-18 19:54 — the card that showed the gap, and the defect class it spread on the way

`ce70287` `44efb69` `b904db2`. EOD integration is finished: the admin's report card now shows
expected beside counted, names the short PRODUCTS rather than one goods total, and a short count
changes the card's heading and the approve button's own words so it cannot be waved through.

**The lesson worth keeping is not the feature. It is that I shipped three broken sites by copying
the code around me.** The red banner, its badge and its product rows all used
`text-[var(--danger-ink)]` on `bg-[var(--danger)]`, because that is what every neighbouring element
did. That pair measures **1,94:1**. It was already on Aldi's own confirmed-and-still-to-do list,
where it had been sitting as item 1 — I extended the defect an hour before finding the note that
described it.

**Matching the surrounding style is normally right, and it is exactly what spreads a defect class.**
When the new element carries text that must be read, measure the pair being copied. The palette
already held the answer (`--danger-well`, 7,04:1) and one site was already using it correctly.

**Two traps inside the sweep itself, both of which produced confident wrong answers first:**
- `bg-\[var\(--danger\)\]` also matches inside `hover:bg-[var(--danger)]`. 17 hits collapsed to 11
  once the regex anchored on the variant boundary. A token search without that anchor over-reports,
  and an over-reported sweep is one that edits things it should not.
- The rule "this element has no text, so change its ground" darkened a 2px status dot and a
  damaged-share bar into near-black. **A colour used as a GROUND and the same colour used as a FILL
  are different jobs.** A dot exists to be seen; it has no contrast partner to protect.

**The 3-layer rule paid for itself.** His own `PROGRESS.md` list named the contrast bug, the missing
`key` on the counting flow, and a stale item (`letter.signatures` does not exist) — none of which a
code search would have surfaced as *problems*. Read the note before hunting.

Also fixed from that list: `key={effectiveId}` on the counting flow, so switching whose setoran is
being entered cannot post one agent's counted cash under another's id. See
[[Concepts/Anti-Recurrence Check]] — both fixes left a check (S20, S21), not a paragraph.

**Still Aldi's call:** what a missing pack is worth in rupiah, and what colour replaces the banned
green on the Verify button.


---

## 2026-08-18 20:14 — pricing a missing pack, and why the money stayed a plain number

`43f8059`. Aldi ruled that a missing pack is bought back at **retail** price, and that the bounty
panel must show how each number was reached — his example: *"cello chocolate 5 bks = 50,000
(7 agustus 2026), transfer loss 30,000 (8agustus 2026)"*.

**The design decision worth keeping is the one about SHAPE.** The obvious move was to make each
`PENALTY_` value a richer object — `{amount, label, date}` — so the explanation travels with the
money. That would have broken three things at once, all of which read those keys as plain numbers:
the WANTED board's sum, the bounty clearance report, and the stamp-payment loop that skips
`PENALTY_` keys by name. **When a stored value already has readers, add a sibling, do not enrich the
value.** `cukaiDebtNotes[key] = {label, date}` carries the words; `cukaiDebts[key]` stays a number.

**Second: one key per reason, not one lump sum.** A lump sum cannot be explained to the man paying
it. `_CASH`, `_TRANSFER`, `_GOODS_<productId>` — and because each is still keyed by the report id
and assigned rather than incremented, a double-approve remains harmless.

**Third, and this is the honest-reporting one:** a product with no `priceRetail` still mints a LINE,
at Rp 0, whose label says *(no retail price set)*. Minting nothing would have been the tidier code
and the worse answer — a shortfall nobody can price is exactly the thing that must stay visible.
See [[Concepts/Aldi's Design Taste]]: every action must report.

Also: the pricing lives in ONE function, `eodBountyLines()` in helpers, called by both the admin's
card and `App.jsx`. The number he approves and the number the ledger writes cannot drift apart
because they are the same call.

---

## 2026-08-18 20:30 — a rule that differs between companies belongs in Settings, not in code

`bf75678`. Aldi asked for the damaged-goods penalty price to be configurable, and said why in one
line: *"i just want to make sure that this app is flexible enought so that i can sell it to
multiple company instead of one only."* **That sentence is a design constraint, not a feature
request** — it means every rule where a different company would plausibly answer differently is a
setting, and hardcoding one is a sale lost. Worth applying ahead of him asking next time.

**The half that needed no code.** He also described the fair split: damage the agent brings back
from a shop costs him nothing; damage he caused himself he buys. Stock Opname already offered three
buttons — SAMPLING, RTV, PENALTY — where the first two charge nobody and the third is a deliberate
admin choice. His rule was already the shape of that screen. **Check whether the described rule is
already implemented before building a second mechanism for it** — the cheapest fix is the one
already shipped.

**The half that was backwards.** The penalty charged `priceDistributor`, what the company PAID for
the stock, not what it sells for. So an agent who damaged goods repaid cost and the company ate the
margin. Now `appSettings.penaltyPriceTier`, default Retail.

**One fallback decision worth remembering:** an unknown tier, or a tier the product has no price
for, falls back to **Retail — never zero**. A penalty that silently becomes Rp 0 looks like no
penalty, and nobody investigates a number that isn't there. Same instinct as the Rp 0 bounty line
that says *(no Retail price set)*: an unpriceable charge must be loud, not absent.

**Also:** the Alucard lessons loop was jammed at 5/5-all-fired and had been since 2026-08-10 —
§8's "or don't write" branch meant it silently stopped learning. Aldi gave permission to change the
rule rather than keep hand-clearing it: it now archives one entry anyway and requires the reason in
the archive. `74c9a88`. **A maintenance rule whose failure mode is silence needs a check that
speaks** — the daily health script is what caught it, twice.

---

## 2026-08-18 20:52 — amber had to be two colours, and a guard had to be scoped

`a0d27b5`. Aldi picked option B off the colour sheet, in amber: *"B is better but i like amber
color more than gold TBH"*. Shipped.

**The finding that generalises: a colour preference is not one hex value.** Bright amber measures
10,60:1 on the dark surface and **1,34:1** on the light one — the same colour is excellent and
invisible depending on the theme. Every token in this palette is already a pair for exactly this
reason, and a new one is no exception: `#F59E0B` dark, `#92400E` light, picked as the deepest amber
that still reads amber rather than brown. **When he names a colour, that is a direction, not a
value — measure both themes before writing it down.**

**And the measuring is what turned a taste question into a defect.** The green it replaced scored
2,98:1 in dark mode and the cukai orange 2,81:1 in both. He asked about palette compliance; what
was actually wrong was that the label on the button he presses every night could barely be read at
night. See [[Concepts/Anti-Recurrence Check]] — the number found what the eye had lived with.

**The guard took three attempts, and the failure mode is worth naming.** Scoping a regression guard
by a *string that appears on an element* rather than by *the element* caught innocent bystanders
twice: the WANTED total's drop-shadow, then the Pay Bounty button, both of which legitimately use
the same rgba. The fix is to slice the source between the element's own handler and the end of its
tag, then assert inside the slice. **Recorded in `lessons.md`** — and it is the first real use of
the loop Aldi unjammed an hour earlier, which archived an entry by the new rule and accepted the
new one without argument.

The health check had two bugs of its own, both the same shape: it counted the archive ledger as
part of whichever entry the ledger happened to sit beside. Comments are not entry content, wherever
they sit. `7e887e1`

## 2026-08-19 — he said the plain-English rule was not actually being followed

Aldi, verbatim: *"why the caveman ultra not working, alucard still talk like it used to be not caveman
that i ask tho, too many hard to understand words, too many unfamiliar terms i want this to change on
next session"*.

The miss: caveman was cutting sentence LENGTH but not hard WORDS. Replies were short and still full
of specialist terms. Short plus jargon still fails him. Cut the vocabulary, keep file paths, function
names, numbers and error text exact. See the `feedback_explain_in_plain_english` memory.

Same day he settled two decisions: the stock-count expected number is a per-tier option, on by
default for tiers 1-3 and blind for tiers 4-6 ("encourage them to really count the number right"),
and the whole app says TITIP, not consignment.

## 2026-08-21 — the count path closed end to end, and a page that went stale in seven hours

**Ingested:** [[../Raw/2026-08-21_source_stock-count-trust-chain|the five afternoon commits]] →
[[Summaries/Stock Count Trust Chain]]. Scheduled ingest run 2026-08-22.

At 10:07 [[Concepts/Where KPM Is Going]] was written and named the gap four times: *"the gap
between 'the agent found a different number' and 'stock changed' has no checking in it at all
today."* **By 17:00 that sentence was false.** Recount (`2d8d371`), variance cause (`e103469`),
one-pack tolerance (`7153a82`) and leak detection (`08e98ce`) all shipped. That page's gap table
carried four ❌ rows that were ✅ the same afternoon — corrected in place, with the original claims
kept and marked superseded rather than deleted.

**Worth remembering on its own: a direction page can go stale in seven hours.** It is the most
useful page in the vault precisely because it says what is missing, which is also the part with
the shortest half-life. Nothing is wrong with the page — it needed a ripple that nobody ran until
the next scheduled pass.

**The finding that generalises, from the tolerance:** selling in Batang stores `qty /
sticksPerPack`, so a product with loose sticks sold from it holds a **fraction** of a pack. The
count box is `parseInt`. **A fractional stored value met by an integer-only input is an
unsatisfiable equality** — variance could never reach zero, so with the recount in place it forced
an endless second count and filed a fake half-pack shortage every week. It arrived looking like a
preference question (*"what size difference is not worth your time"*) and was a defect underneath.

**And where a feature lives is a design decision.** Leak detection deliberately does NOT go on the
count row: `auditHistory` only loads for high command, so a counting agent would see an empty list
and **conclude all was well** — and telling the counter "this one is usually short" biases the
count blind counting exists to protect. It sits on HQ's review row.

🔴 **One open decision was created and not closed:** the five shortage causes — *miscount,
unrecorded sale, breakage, theft, supplier short* — **are Claude's words, not Aldi's**. His
standing law is that only he names categories in his own trade. Saved records keep whatever string
was used, so the list must be settled **before** agents count with it. New card:
[[../Backlog/Name the five shortage causes]].

The crash that blanked the tab for the afternoon, and the two decorative checks caught the same
day, were already written up in [[Concepts/Anti-Recurrence Check]] by the session itself
(`b05e841`) — not repeated here.

## 2026-08-26 — the research WAS saved; retrieving it was the thing that failed

Aldi: *"every research, thinking, brainstorm should all be take notes, the problem, solution, the
options, the decision, everything should go to A brain ... make sure that token wasted on research
is not just gone like that"*.

**His premise was half wrong, and the real flaw is worse.** The big-logistics research he
remembered asking for (2026-08-23, *"tokopedia and indomaret level"*) **was written** —
[[The Eight Warehouse Gaps]], with an artifact, ranked gaps, build order and a rejected list. It
was linked from `Wiki/Index.md` only, 1 of the required 3 places.

What actually broke: this session answered a **logistics design question from cold domain
knowledge** while that note sat unread, because `SKILL.md` §1's load table had **no row for
warehouse / shipping / stock movement**. Research is not lost by failing to write it. It is lost
by failing to route back to it.

**Fixed, both directions:**
- `SKILL.md` §1 — new mandatory load row: warehouse / shipping / stock movement / restock /
  logistics design -> [[The Eight Warehouse Gaps]], **before proposing anything**.
- `SKILL.md` §11a — the four A-Brain triggers became **five**. The new one is *research or a
  brainstorm that produced options, **even with no decision yet***. The other four all fire on
  something being FINISHED, so an open brainstorm fired none of them and died at the next
  `/clear`. A brainstorm note must carry: problem in his words · options table · costs · decision
  or `OPEN` · **rejected on purpose**.

**Written:** [[HQ-Initiated Stock Push]] — this session's own brainstorm, saved while still OPEN,
which is the first exercise of the new rule.

**Both notes now linked in all three places.** [[The Eight Warehouse Gaps]] was missing from
`MOC.md` and `Concepts/index.md`; added.

⚠️ **This log itself went stale.** Nothing between 2026-08-21 and today, across the warehouse
research, the dashboard rebuild and two skill installs.

## 2026-08-27 — the desk was built, and a green suite shipped a 17x wrong number

Ingested [[../Raw/2026-08-27_source_surat-jalan-desk-and-sebaran-stok|commits aea7de4 → ce313f9]]
(2026-08-26 19:59 → 2026-08-27 08:56 WIB) as
[[Summaries/Surat Jalan Desk and Sebaran Stok]]. The vault's own history stopped at the **design**
of Restock Vault v2 (vault commit `66c5f30`, 19:06); everything after it is the **build**.

**The design decisions this closes.** [[Concepts/HQ-Initiated Stock Push]] had three open
questions and all three were answered by shipping rather than by a reply — and **not the way the
page recommended**: option **A** shipped, not D, writing `stock_requests` straight to `IN_TRANSIT`.
The reason D was preferred (not re-implementing courier/resi/photo validation) was absorbed by
rebuilding the whole surat jalan as one form with the route reversed, so the validation is shared
**by construction**. The in-transit hole is closed at HQ (a *Shipping* column), and the aging flag
shipped at three days, red. Marked as built rather than rewritten; the OPEN block is struck
through, not deleted.

**The finding that generalises, and it is the sharpest one this project has produced:**
[[Concepts/A Ratio of Sums Is Not a Rate]]. A warehouse "Est. days left" divided **total shelf by
total sales rate**. Master Vault printed **348 days**; the whole rate was one product, Cello
Chocolate, whose own cover was **20 days**, one row down inside the same drawer. **17x too
comfortable, on the one panel whose job is "which warehouse do I restock first"** — with the build
green, **632/632 checks passing**, and the arithmetic verified on screen twice. Aldi caught it by
reading it.

> **A check tests whether a number computes, not whether it means anything.**

Rippled into [[Concepts/Anti-Recurrence Check]], which now also carries the four checks that fired
**correctly** that session and what re-anchoring each one taught — anchor on what the check proves,
not on incidental syntax; a trap paid for once must be paid forward into every group written after
it; migrating a check is not deleting one — plus **two JSX shapes that compile clean and fail
silently**: a duplicate `style` prop where the last one wins, and a `<button>` inside a `<button>`
that kills the inner click.

**One list is one rule.** *Headquarters* was briefly offered as a shipping destination because the
Tujuan picker filtered on its own short list while `supply.js` already owned `NON_BRANCH`. Fixed by
**exporting the constant, not lengthening the copy**. Same shape as "where is every pack" having
exactly one implementation (`supplyByProduct`), which is why Sebaran Stok calls the dashboard's
function instead of re-deriving it. Both written into [[Concepts/Logistics and Stock Movement]] as
locked rules.

**Taste.** [[Concepts/Aldi's Design Taste]] gains three sections: **hierarchy is made of space, not
more lines** (the fix removed a border rather than adding weight — *"psychology of the expensive
wears store shelf ... LV or PRADA"*); **plain words and a number that shows its working** (*"dont
make vague terms"*, and **he owns the company and could not read "No. SJ" on his own intake form**);
and **a banner that names the screen you just clicked is chrome** — deleted for HQ, kept for a
branch user where it actually says something.

**Written open, on purpose:** [[Concepts/Ponder Tutorial System]] — the plan he asked for and
explicitly chose not to build, with two decisions locked (scripted scenes not video; fixed demo
data not a live spotlight) and **three questions left unanswered rather than assumed**, top of them
whether teaching sentences are Indonesian or English. This is the second exercise of the 2026-08-26
rule that a brainstorm gets saved even with no decision yet.

⚠️ **Still untested, and worth carrying:** *Siapkan Pengiriman* since it moved to the Request tab.
Kirim itself was left unpressed in the live app on purpose — it moves real stock.

## 2026-09-01 — the branch warehouse got the ledger, and two app-wide faults fell out of looking

Commit `a4bc1ca` on `phase0-solid-ground`, **680/680 audit** (group 57 is new and was seen to FAIL
on all four of its first checks before the fix), 957/957 self-check.

**Rippled:**

- [[Concepts/Aldi's Design Taste]] — he refused a staged delivery: *"well redesign and repaint
  should go together isnt"*. One screen is one unit of work, and offering a phased plan offers him
  extra review sessions, which is a cost he pays and I do not.
- [[Concepts/Off-Token Colour Migration Map]] — two fault classes the map never covered, because
  neither is a raw hex: **90 uncoloured `placeholder=` in 18 files** (falling back to the browser's
  slate, 1,36:1) and **~107 bare `text-orange` used as ink in 15** (1,08:1 on the light well).
  Both measured, both app-wide, neither pinned by anything.
- [[Concepts/Looking at the App]] — `tools/lab-firestore-stub.js`, aliased over
  `firebase/firestore` for the lab build only, so a screen needing live data renders against
  fixtures through its own real listener. `?gudang` is the first user.

**The thing worth carrying:** every check on that screen was green before the last two faults were
found, and they were found by mounting it and reading computed contrast. A colour audit that greps
for hexes finds only the fault it was written for — a legal token in an illegal role, and the
absence of a decision, both survive it.

## 2026-09-01 — the regional warehouse became a desk, and two checks earned their keep

Commit `dc05d61` on `phase0-solid-ground`, **680/680 audit** and **970/970 self-check** (D17 is new
and its tier assertions distinguish the two clearances rather than merely existing).

**Rippled:**

- [[Concepts/Aldi's Design Taste]] — *"not just recolor but redesign"*. When he names another screen
  as the model, the thing to copy is its LAYOUT GRAMMAR, not its palette; and his feature requests
  arrive bundled inside the design request. Also his approval shape: *"stock only is enough then u
  can continue"* — four names approved by silence, one edited, permission granted, in five words.
- [[Entities/Fleet Captain Permission Gap]] — the gap on purpose this time. `canHandleDelivery`
  T1–T4, `canManageRegistry` T1–T3, one tier apart deliberately. And the trap under it: `isAdmin` is
  `vaultUnlocked`, a password and not a rank.
- [[Concepts/Anti-Recurrence Check]] — a check can enforce a narrower rule than its own label
  claims. The second-person ban held only the informal words for two days while the rule was being
  followed by hand.

**The thing worth carrying:** both faults this session were caught by guards on the guards — the
`ok()` that asserts an anchor was FOUND before slicing, and the widened word list. Neither was found
by reading the diff.

## 2026-09-03 — ingest: the follow camera, the one gap the self-ingest left on 2026-09-01

Scheduled `a-brain-session-ingest` run. The 2026-09-01 18:11 → 18:40 WIB block (KPM commits
`7d3d350`, `87b0939`, `832e465`, `96f2474`, audit 702 → **705/705**) had no vault coverage at all —
"follow camera" returned zero hits across `Wiki/`. Everything else since the 2026-09-01 run was
verified already self-ingested, commit-for-commit.

**Added:** [[Summaries/The Camera Was Aimed at the Wrong Scroller]], from
[[../Raw/2026-09-03_source_kpm-follow-camera-2026-09-01]].

**Rippled:**

- [[Concepts/A Smooth Scroll That Never Runs]] — a sequel section. Same `scrollIntoView` call, a
  second way to be wrong: `block:'nearest'` is satisfied by one cell touching the edge, and the
  stage is not the scroller that owns sideways movement in Stock by Warehouse.
- [[Concepts/Ponder Tutorial System]] — **one tutorial, both widths**. He chose the follow-camera
  over a separate phone Ponder, and the argument that won was maintenance: a second tutorial is a
  second thing to keep in step with every UI change.
- [[Concepts/Anti-Recurrence Check]] — a guard pinned by an implementation's *name* enforces the
  name, not the rule; when it fires on a rename, that is the moment to ask what it was protecting.
- [[Concepts/Aldi's Design Taste]] — *"take more space its okay"*: on a screen that already has a
  scrollbar, horizontal space is cheap and a cut name is not.

**The thing worth carrying:** the camera was **provably correct on the vertical axis on every beat
and 0% in view on the horizontal axis on five of them**. A measurement that covers one axis reads
exactly like a measurement that covers the feature.

**Skill-file edit (named, not buried):** `kpm-inventory-facts.md` in the `delegate-coding-task`
skill gained the CRLF-needle rule. Second real occurrence — see [[Concepts/A Cache Saying No]] for
the first, on the same day.

## 2026-09-05 — ingest: the rollup that threw the question away, and the day the app went online

Scheduled `a-brain-session-ingest` run. Everything through KPM commit `efcfc33` (09:10:10) was
already self-ingested — the vault's own `c5648ad` landed 20 seconds later, the usual pattern. The
gap was the **last four commits of the morning**, `610f02c` → `2906294` (09:13 → 09:52 WIB), which
had no vault counterpart at all.

**Added:** [[Summaries/The Panel That Never Reads a Transaction]], from
[[../Raw/2026-09-05_source_kpm-rollup-scope-and-vercel-demo]].

**Rippled:**

- [[Concepts/A Rollup Is a Cache, Not a Ledger]] — a 2026-09-05 section. The rebuild property
  makes a *wrong* rollup cheap; it does nothing for a rollup that is right and **too narrow**.
  `salesDelta` carries `{ qty, revenue }` and no `paymentType`, so the consignment/paid split was
  gone before the writer ever saw it — and a panel cannot render a distinction its source never
  recorded.
- [[Entities/Firestore Rules]] — the draft/deployed gap stopped being abstract. A public demo URL
  exists now; what protects it is the *absence of self-signup*, not the rules. The store hand-off
  write rule is still drafted-not-deployed and still live for real agents.

**The thing worth carrying:** every rollup month already written holds only `{ qty, revenue }`.
Ship the split naively and history reports **zero receivable, 100% finished sales** — confidently,
with no error anywhere. Old documents will answer a question they were never asked.

**Open and unverified, flagged not guessed:** does a later `CONSIGNMENT_PAYMENT` also enter the
rollup (`SALE_TYPES`, `salesRollup.js:42-46`)? If it does, Product Performance double-counts today
and that is bigger than the split. The session ran out of budget before checking and refused to
assume.

**No skill-file edit this run.** The rollup trap is a strong candidate for
`kpm-inventory-facts.md`, but it is a *trace*, not a verified fix — nothing has been built or
proven yet. Recorded here and in the Summary instead; worth adding to the skill file the moment
bug 2 actually ships.

## 2026-09-06 — ingest: the shorter list was never the eligible one

Scheduled `a-brain-session-ingest` run. Gap found by pairing the two git logs, as usual. The
working session self-ingested through vault `ba42702` (08:00:41), which covers the picker reversal
as a *taste* entry and the Option B decision. What had no coverage anywhere in `Wiki/` was the
**engineering** of the morning: `dace958`'s eligibility predicate, the new matrix key, and the
`curl` result in `952b0ca` (08:02:34, after the last vault commit).

**Added:** [[Summaries/The Shorter List Was Never the Eligible One]], from
[[../Raw/2026-09-06_source_kpm-handoff-eligibility-and-demo-blockers]].

**Rippled:**

- [[Concepts/UI-Says-Yes-Server-Says-No Pattern]] — the version where the server check *did not
  exist at all*. `handleRequestTransfer` wrote `account_transfers` with no eligibility check of any
  kind; the picker was the only thing in the way, and a picker is not a boundary. The fix shape
  worth copying: one exported predicate, called in both places, not two conditions that drift.
- [[Entities/Tier System]] — **a brand-new matrix key is ABSENT, not "no"**. Aldi's
  `ROLE_PERMISSIONS` matrix lives in Firebase, so a key added by new code is missing from it;
  reading that as denied breaks the feature for every tier at once while the code is right.
  Absence means the tier default — `handoff_cross_region` joins `view_expected_count`,
  `handle_delivery`, `manage_registry`.
- [[Entities/Firestore Rules]] — **the demo was not exposed, it was unreachable.** The 2026-09-05
  entry reasoned about what protects a public URL; a `curl` showed `kpm-ang.vercel.app` answering
  302 to `vercel.com/sso-api`. The earlier claim stands as written; this only adds an earlier gate
  nobody had checked. When Aldi flips it, the drafted-not-deployed hand-off write rule matters
  again.
- [[Concepts/Ownership Moves, History Does Not]] — the *who may receive it* half, and the note that
  the approving half is still unbuilt with Option B now chosen.

**The thing worth carrying:** he complained about a *long list*; the fix that landed first was an
*eligibility* filter. Those look like one job and are not. He is Tier 1 — everyone is eligible for
him, so hiding the ineligible would have hidden nobody from the one person complaining. The filter
that shortens the list is the regional team. And the checkbox added to reveal other branches
widens the **view**, never the permission: the predicate still decides.

**Skill-file edit (named, not buried):** `kpm-inventory-facts.md` in the `delegate-coding-task`
skill gained the absence-means-tier-default rule for new `ROLE_PERMISSIONS` keys. Real, verified,
shipped fix (`dace958`, checks 1035 → 1060 green, trialled red twice), and it will recur on the
very next matrix key anyone adds.

## 2026-09-14 — the phone top bar, measured at last

`Looking at the App.md` gained the real-375px recipe: the in-app pane sized with `resize_window`, `innerWidth` read in the same probe, and the new `?shell` ponder-lab mount of the app shell. Two queued phone claims settled by measurement — the ribbon `top:-66px` was a hidden-pane artifact (top 340 of 812), the off-screen bell was real and worse (x 442..489). Shipped as `2af2dd9` in kpm-inventory (`flex-wrap` + `ml-auto` on the top bar), guard THE BELL IS ON THE PHONE SCREEN, 1470/1470.

## 2026-09-17 — the Sales Terminal measured on the phone, nothing shipped yet

`Brainstorm/2026-09-17_sales-terminal-di-hp` opened (🔴 OPEN): `?shell&terminal` in the ponder
lab (kpm `dbc0787`) put the terminal in the real shell at innerWidth 375; the table of every
undersized control is in the note; two boards sent (wares A/B, sheet YES/NO). `Looking at the
App` gained the `#root{width:375px}` pin that makes a headless 518 frame carry the 375 layout.
Lessons: four 2026-09-16 retirements archived; four LIVE entries fired.

## 2026-09-17 — the Sales Terminal shipped on the phone; the vault press reports

His answer to the boards at 08:30: B + YES → kpm `4ba6563`; the brainstorm note closed with his
words, the taste page gained "denser and bigger at once" (he picks the smaller picture to get the
bigger button; he names the user, not himself). `af4d5e2` confirmed by his incognito test; the
next wait — the security-profile read on the password press — moved earlier and made visible
(`dfc2392`), recorded on the UI-Says-Yes page. Packed build serving on `https://192.168.1.107:4173`.

Confirmed 09:05: *"t1 approve, t 2 approve, t3 i just tried to close the incognito and open it again after that i manual google login , master vault panel shows up enter password and it instantly let me in after press so i havent be able to see the processing animation tho"*.

## 2026-09-17 — Customers shipped on the phone

Brainstorm closed (three YES + A→Z, folder tree stays), kpm `a9822ff`; taste page: the lookup comes before the form, sort before style, structure needs his ask, bare inputs are a dark-mode bug. Trap recorded in the brainstorm and the next brief: `button:has(> svg:only-child)`.

## 2026-09-18 — EOD Setoran shipped on the phone

His board 1 YES + board 2 B ("more space for long product name"), kpm `84e102f`: deck as tall as the card on top, count rows stacked with 96×44 boxes, no inner scroll, 44 px verdict buttons, labels 11; desk unchanged at 1280. Taste page: he takes the taller row to get the whole name (pairs with 2026-09-17's smaller picture for the bigger button). Looking at the App: `?tab=type:`, the mid-transition rect trap, a 500 in the lab is a syntax error, and the `{/* */}`-after-`(` trap is now a selfcheck sweep. Next: Stock Opname on the phone.

## 2026-09-18 — Customers round two shipped on the phone

His A / A / A on three boards, kpm `5d7a9d0`: the boss's admin tools fold behind ADMIN TOOLS (the sideways cause — shell scrollWidth 521 → 375 as tier 1), DEL / EDIT behind a ⋯ key with a fold under every row and card (one set of buttons relocated by `contents lg:flex` + grid placement), the hold is an amber charge line and the lamp stays black; desk unchanged at 1280. Taste page: rare tools fold, destructive controls hide, motion vocabulary must not repeat across instruments. Looking at the App: the pane does not advance a transition until it paints — screenshot, then read; utility-class selectors match more than the group you mean. Brainstorm note closed DECIDED. Next: Stock Opname on the phone, measured as both tiers.

## 2026-09-20 — THE PLAYER CARD, stage A shipped (kpm `a401463`)

His 03:55 redesign of the EOD review three hours after the docket shipped, decided 05:35 ("looks good for v2 lets use
that"). Per-part approve / return on the data path (`eodReportParts`, `handleVerifyEOD(report, decision)`, the
fresh-map gate inside the transaction, VERIFIED only when every part is in, the salesman notified and shown the reason);
one PlayerCard per salesman replaces the folders + docket (the profile's head via `rankLadder` lifted into career.js,
CLOSED ?/? via `dayTargets` lifted from the Journey Plan, the body grows open with a blur-in, the scan + seal kept);
the mock and the eod-card look deleted; rules untouched and reported. New pages: [[The Player Card]] (hub),
[[EOD Per-Part Verification]] (entity); taste page: the player card section, his words verbatim. Checks: logicFixes
1695/1695, audit 722/722 (G30 gains the blur as a second named exemption). Next: his ✅ TEST on a401463, then stage B.

## 2026-09-20 16:30 — the player card: one question per night, one history row per night (kpm `992ff6e`, `601e387`)

His 15:00 answer on stage A: the confirm panel "showing up twice" (a night is two documents, the handler asked per document) and the History Log splitting one night into two rows. Fixed: `eodNightMessage` asks once for the night, `handleVerifyEOD` / `handleResetEOD` take `{ confirmed: true }`, the log shows the night as one row (a fine keeps its own). Entity page [[EOD Per-Part Verification]] to be updated with the `confirmed` flag next session (quota wall at 16:30).

## 2026-09-21 08:50 — THE PLAYER CARD stage B shipped (kpm `c31af5e`): the head on the Agent Profile (A), tonight's XP on the EOD panel (B)

His *"testing later continue your work first"* (08:00) → the profile mounted in the lab and measured, two boards sent 08:15 ([[2026-09-21_player-card-stage-b]]), his *"i like all the recommended option"* (08:35) → built and committed by 08:50. `PlayerCardHead` exported once (the profile feeds it its own `stats`), the hero + OMSET box gone, the keys wrap at 44, one scroll, `min-w-0` on the profile column (its min-content was 372 as the boss); `XpGain` = the signed nixie mounting at 0, the total at 400 ms, the working rows at 1000 ms. Watched at 375 dark + light + 1280 with a real tap on the head. [[The Player Card]] stages table + the stage-B shape; [[Aldi's Design Taste]] gained his six-word answer. ✅ TEST owed on a401463 + 992ff6e + 084b05a + c31af5e.

## 2026-09-21 07:55 — the 992ff6e / 601e387 fix watched in the pane; a light-mode miss on the LED words fixed (kpm `084b05a`)

Watched with real taps at 375: five ✓ → one dialog → CANCEL keeps the ticks → CONFIRM → both writes and the scan + VERIFIED seal (held with a 20 s timer for the frame — the 900 ms window fell between pane screenshots four times); the History Log's 20 September night is ONE row. Miss found in light mode: `.kpm-led-line.warn` / `.crit` words in the fixed instrument colours read 1,5:1 on the light card — one rule in the LED block gives the words the ink (11,4:1), the diode keeps its light; covers the store card and the salesman's "sent back" lines too. [[EOD Per-Part Verification]] now carries the `confirmed` flag and the one-row log; [[The Player Card]] records the law it broke. Lessons: one new entry (elementFromPoint skips pointer-events:none — it cannot prove paint order); the 09-06 sentinel entry archived here; two 09-07 entries retired (never fired in 14 days).

## 2026-09-22 09:45 — the desk fix shipped (kpm `20aac21`): the review card one-row head + 2:3 body from lg, the Agent Inventory header without its xl split

His PC test (three screenshots) → two boards (Raw/2026-09-22-pc-boards) → "board 1 = A but make the Profile picture bigger as big as B minimum, board 2 = A" → shipped in one pass. Guards red first (1704/1704 after), audit 722/722, the phone measured identical with the edits stashed and restored. New technique recorded in [[Looking at the App]]: a desk width is proven by a headless shot in the system font — the pane's font is ~20 % narrower and passed a layout that overlapped on his PC. Brainstorm closed: [[Brainstorm/2026-09-22_pc-review-card-and-inventory-strip]].

## 2026-09-22 10:55 — the money-bug batch: three Backlog HIGH bugs fixed, two found already fixed; the card's revenue line is the omset alone

His *"continue with the most orgent matters first then follow up with the other jobs"*. Checked all five HIGH Backlog notes against the live code first (two were stale — the PENALTY_ guard and the shipment transaction already existed). Fixed: goods handed back at a store audit now reduce the debt (`0ad432a`, one rule `debtCredit` for six calculators; two checks had asserted the bug), warehouse returns converted to packs (`7547f48`), Journey Plan reports ghosts instead of guessing and writing (`e7ab845`). The revenue line on the card (`f269b9c`). Guards red first each time, 1711/1711; audit 722/722 on the built dist. Backlog: five notes Done.

## 2026-09-22 11:50 — the three money fixes proven in the lab with before/after (kpm lab `02b39f3`)

Receivables 165.000 → 110.000, a Slop return 4202 → 4220 through the real engine, Journey Plan one silent write → zero + a message. New technique in [[Looking at the App]]: the recording stub + `?shell&piutang` over the real engine.

## 2026-09-22 13:10 — the security batch: the fingerprint is slow and salted; the rank settings have one home (kpm `603472d`)

His YES and YES at 12:30. (a) [[The Master Password Fingerprint]] — PBKDF2-SHA256 with salt, the old form still opens and is re-saved on the first sign-in, the password keeps its case, one helper for the gate / setup / recovery / crown transfer. (b) [[Firestore Rules]] CHANGE 8 — the shared rank-settings path closed as a DRAFT, the one-time move into the company folder reported by the app, emulator 26/26. ✅ TEST owed with two order rules (deploy the build around the first sign-in; open the app as the boss before deploying the rules).

## 2026-09-22 14:10 — the presentation updated (artifact v6); the light-mode nixie boards sent; Fleet & Roster logic asked

KPM Command Center v6 carries the security work, the shipped card and the 22 Sep numbers. Three light-mode nixie looks boarded from the real count card ([[The nixie counter in light mode — three looks]]); A recommended. The Fleet & Roster redesign waits on his answer to the 2026-08-24 "few logic" question. Lesson in [[Looking at the App]]: `look=pin` is not a phone for a media-query layout — shoot at 518.

## 2026-09-22 15:30 — the DIFFERENCE figure shipped as his own spec (kpm `9cb543b`); the Fleet van-loading logic named

Both boards refused; the figure is now the siblings' plain mono figure, red on a difference, a drop on a shortfall and a rise on a surplus, once. Taste file: a plate among plain figures refuses an instrument; the Fleet & Roster logic is the van-loading flow, segment vs panel is the next job's talk. [[The nixie counter in light mode — three looks]] closed.

## 2026-09-22 16:00 — the boss's audit line follows the card (kpm `c86c9ee`); Stock Opname has no nixie left

His "yea sure make boss audit have the same design like that one". The three audit figures are the plain mono figure, the DIFFERENCE the keyed red one; the nixie stays only where it stands alone (the EOD folder total, the Agent Inventory window). Presentation v7.

## 2026-09-24 12:04 — Fleet & Roster round 4 BUILT (kpm `c4a1eaa` `d02fe2c` `dfc3820` `cb30e98`)

The chests close again with tabs behind them (his usual load, the team, this person's geofence requests), far and near on the stage over a lit grid floor, the big deployment header moved into the gold bar. His preset rule kept: a preset only fills the muatan. What the build decided on its own and the three traps met are in [[2026-09-24_roster-as-a-game-community]] (Round 4). Frames + shooter: `Raw/2026-09-24-round4-chests-stage/`. His test owed.

## 2026-09-24 13:10 — his round-4 test answered (kpm `f167adb`)

No pulsing row, warm plain stage, no tutorial in the bay, TIM one row per van + SALIN. His words in [[Aldi's Design Taste]] (12:50); the removed tutorial text kept for the ponder page in [[2026-09-24_roster-as-a-game-community]].

## 2026-09-27 09:52 — the Agent Inventory chest BUILT (kpm `4f44e3d`)

T1-T4 see the van as the chest (`LoadingBay vanOnly`, look 1, six a page, page keys carry their count, the damaged row under it; a drag writes only `vanLayout`); the book page Agent Inventory -> Agent Chest, 22 beats; the shut-panel speck in both book pages fixed (the book's inline opacity beat `opacity: 0`, now `visibility: hidden` after the shrink). Frames + shooter in `Raw/2026-09-27-agent-chest/`. The near-miss (a handoff naming `seesEveryRegion` for a T1-T4 rule) is on [[Fleet Captain Permission Gap]]. Next: T3 sees every region.

## 2026-09-30 07:25 — the Fleet & Roster quarantine switch BUILT (kpm `8476f20`)

His prototype v21 in the app: the ender chest's ONE box switches healthy <-> Quarantine on his Satisfactory hatch, blast doors over the box, the crate and the van chest take turns in one place, four squares a row at every width. Built as one shared piece (`components/QuarantineSwitch.jsx`) for the regional warehouse and Stock Opname. New hub note: [[Quarantine Chest]]. Frames and walk: `Raw/2026-09-30-quarantine-switch/`.

## 2026-09-30 07:45 — his "do the 3 job": two boards + look C (kpm `b3d49ad`)

Solo, on his answer ("Solo, one by one", then "no workflow"). The regional warehouse and Stock Opname chest options drawn as prototype v22 (live, the app's own hatch/doors/band), his picks owed - [[2026-09-30_quarantine-chest-warehouse-and-opname]]. The Agent Inventory crate box got look C + English words (`b3d49ad`). The enchanting-table row (v6) re-shown for his yes. Lab: `?shell&gudang` (`9d9ba19`). Hub: [[Quarantine Chest]].

## 2026-09-30 18:25 — the app feels heavy: five fixes BUILT (kpm `b799704` `bf873d6` `ebc2329` `47f6e51` `616b905`)

Each measured before and after; results table and the open 5c (tutorial-book split, his call) in [[2026-09-30_app-feels-heavy]]. Finding 3 needed no code - measuring first showed "Checking..." already painted in 6.7 ms. New viewing tricks (built app over http 4174, per-letter timing, hidden-pane drags) in [[Looking Inside the App]].

## 2026-09-30 21:30 — potato-phone audit, measured (no code)

17 screens on a 6x-slow simulated phone, full animations, plus switch-off tests per animation/loop; 8 ranked same-look fixes in [[2026-09-30_potato-phone-audit]]; the tool in Raw/2026-09-30-potato-audit.

## 2026-10-01 00:50 — potato fixes 1-5 BUILT (kpm `6b2747a` `5937e67` `8b6e87a` `91817a5` `385736b`)

Each proved same-look (byte\/pixel compares, matrix maths, a touch walk) and measured; 6 skipped after re-measuring; three new open items. [[2026-09-30_potato-phone-audit]].

## 2026-10-01 01:20 — the coin spin BUILT (kpm 72101d1)

Agent Inventory 30% -> 15%; [[2026-09-30_potato-phone-audit]]. A fresh emulator reads 80% everywhere for its first sync - measure warm.

## 2026-10-01 06:55 — heavy-app + potato fixes PUSHED (kpm ee0b666..72101d1)

Live ~25 s after on kpm-ang.vercel.app; his iPhone test owed. [[2026-09-30_potato-phone-audit]] [[2026-09-30_app-feels-heavy]]

## 2026-10-01 07:50 — his Samsung test: 3 fixes (kpm 6c04dff 28e2cb3 751d64b, local)

Page buttons under the hatch on phones; the name in the plain unlock box; the roster slides freely. Taste note in [[Aldi's Design Taste]].

## 2026-10-01 07:58 — Samsung fixes PUSHED (kpm 72101d1..751d64b)

Live ~35 s later; his re-test owed.

## 2026-10-01 08:05 — sign-in fixed (kpm 79b3e7d, local)

[[The Offline Helper Ate the Sign-In Page]] - the service worker answered /__/auth/handler with the app.

## 2026-10-01 08:56 — unlock name fixed (kpm acdb0cf, local)

[[A Resize Mid-Unlock Wiped the Name]] - a resize mid-unlock rebuilt the dot grid; the name now re-aims. "push" owed.

## 2026-10-01 09:32 — side-menu logout ends the vault pass (kpm 0e285e6, local)

[[Master Vault Gate]] - "Terminate Session?" never cleared the 5-minute grace, so signing back in skipped the vault. Unlock-name fix acdb0cf PUSHED, Vercel done 09:25.

## 2026-10-01 09:45 — Gmail-app jump on sign-in: diagnosed, OPEN

[[2026-10-01_google-signin-opens-gmail]] - waiting on his browser History observation.

## 2026-10-01 09:56 — phone sign-in in the same tab (kpm 216a7df, local)

[[2026-10-01_google-signin-opens-gmail]] decided B. Unlock name CONFIRMED by him on the Samsung.

## 2026-10-01 10:05 — all three Samsung fixes CONFIRMED by him

*"sign in work, no grace period work, name showing in tier 1, no duplicate tab also work"* - kpm acdb0cf (name), 0e285e6 (logout ends the pass), 216a7df (same-tab sign-in), all live.

## 2026-10-01 10:26 — potato open costs closed (kpm 3f53552, d62588c, local)

[[2026-09-30_potato-phone-audit]] - EOD Setoran 49 -> 5%, Agent Profile 53 -> 5% (SMIL swirl asleep without its frames); Restock cells no longer rebuilt per render.

## 2026-10-01 10:39 — Lite Mode freezes the rank-frame swirl (kpm c64de8b, local)

His rule added to [[Aldi's Design Taste]]. Local commits waiting on "push": 3f53552 d62588c c64de8b.

## 2026-10-01 11:11 — Agent Profile opens on your own (kpm 28b5d14, local); intro-for-every-tier OPEN

[[2026-10-01_intro-name-for-every-tier]]. Lab tools profile-own.mjs + idle-lite.mjs saved in Raw/2026-09-30-potato-audit.

## 2026-10-01 12:04 — every person opens the app with their own password (kpm 6857f27, local)

[[Master Vault Gate]] - T3-T6 meet the gate on entry; intro with their name. Push blocked on: live rules carry vault_keys (CHANGE 11)?

## 2026-10-01 12:10 — entry-lock push cleared (rules live, his T2 test); first-time screen stays the same for all

[[Master Vault Gate]].

## 2026-10-01 13:06 — fingerprint at the first password (local)

[[Master Vault Gate]].

## 2026-10-01 18:50 — 3 reports: fingerprint resets after push (OPEN), Master Vault phone redesign + 3D box photo on phone (next session)

[[Master Vault Gate]].

## 2026-10-02 19:45 — Expedition map BUILT (kpm eef2f55, local): B on the phone, A on the PC

[[2026-10-02_expedition-map]] · [[Looking at the App]] (map frames: pane for 390, headless for 1440).

## 2026-10-03 13:42 — Journey map design BUILT (kpm aaf6a7e, local)

[[2026-10-03_journey-map-keys]] (BUILT section: frames, numbers, five build traps) · frames in Raw/2026-10-03-map-keys/built/.

## 2026-10-03 17:53 — Journey map lag + salesman collisions FIXED (kpm eabda69, local)

[[2026-10-03_journey-map-keys]] (LAG + COLLISIONS section: measured table, rejected options) · probe + frames in Raw/2026-10-03-map-keys/perf/.

## 2026-10-03 20:10 — Journey map: salesmen fixed to their spot, offline off the map (kpm 7b770be); zoomed-out A/B OPEN

[[2026-10-03_journey-map-keys]] (FIXED SPOT section) · mock frames Raw/2026-10-03-map-keys/perf/mock-*.png.

## 2026-10-05 10:55 — Map System redesign BUILT (kpm 57abe25, local, not pushed)

His "A for phone B for PC": phone = Journey's dock (Areas / Levels / Layers / Locate), PC = the full map with floating
totals, top areas, level chips and a layer dock. Areas ranked by the shop's own city field. [[2026-10-05_map-system-redesign]]
(Built section) · proof Raw/2026-10-05-map-system/built/.

## 2026-10-05 11:45 — Map System round 2: motion BUILT (kpm b93540f); font / hub / unranked drawn, picks OPEN

Font root cause: Barlow Condensed never loaded, the app draws Arial Narrow everywhere. Page
https://claude.ai/artifact/J7Y5RdwwUhtRPas3KP8Fti · [[2026-10-05_map-system-redesign]] (Round 2).

## 2026-10-05 11:55 — Map System: his hub C + Unranked sprout BUILT (kpm 00d787c); font pick re-shown at 3x, OPEN

[[2026-10-05_map-system-redesign]] (Round 2) · page v2 https://claude.ai/artifact/J7Y5RdwwUhtRPas3KP8Fti.

## 2026-10-05 12:12 — Font C (Rajdhani) app-wide + hub hidden when zoomed out BUILT (kpm 7f88984); group symbol drawn, OPEN

[[2026-10-05_map-system-redesign]] (Round 3) · page v3 https://claude.ai/artifact/J7Y5RdwwUhtRPas3KP8Fti.

## 2026-10-05 12:25 — Map System: market-town groups BUILT (kpm 1e9fc8b); tier symbol sets drawn, OPEN

[[2026-10-05_map-system-redesign]] (Round 4) · page v4 https://claude.ai/artifact/J7Y5RdwwUhtRPas3KP8Fti.

## 2026-10-05 12:32 — Map System: tier set B (rank medals) chosen, its Mythic rejected; three Mythics drawn, OPEN

[[2026-10-05_map-system-redesign]] (Round 5) · page v5 https://claude.ai/artifact/J7Y5RdwwUhtRPas3KP8Fti.

## 2026-10-05 12:45 — Map System: rank medals + royal-crown Mythic BUILT (kpm 5aa0b80); the redesign is done

[[2026-10-05_map-system-redesign]] closed. Next: the Day Replay (kpm NEXT-SESSION.md).

## 2026-10-05 16:20 — Journey Plan: the Day Replay BUILT (kpm a4afcf2, local); his test owed

[[2026-10-04_journey-day-replay]] "BUILT" section: parts, decisions, the five defects the proof caught, known limits. Proof: `Raw/2026-10-05-day-replay-built/` (38/38). New KPM fact: a divIcon reuses its element. Next: the shop popup redesign (kpm NEXT-SESSION.md).

## 2026-10-05 18:25 — Too small to read: notification text + Map System pins (kpm 3c28e68)

His two "too small" reports fixed and measured; rule written into [[Aldi's Design Taste]] ("Small type he cannot see is a bug"). Proof: `Raw/2026-10-05-small-type/`. He asked for a demo account: the lab (?shell&journey&exp&admin) is the demo - opened for him in the browser pane.

## 2026-10-12 06:55 — his batch built: HUB pin A, gold-edge buttons A, Masuk overlap, stock table columns, WhatsApp receipt A (kpm 9104082..7098386, local)

Five fixes, each with a guard trialled red; logicFixes 2299/2299, audit 722/722. Causes + traps in [[2026-10-12_whatsapp-receipt]] (the 0fr drawer inside a grid; the hidden browser pane has no animation frames). Proof: `Raw/2026-10-12-batch/`. Next: the demo front door, design first.

- 2026-10-20 08:34 - Sales Terminal: the H2a auto-pick ran on every keystroke, and picking closes the "Who is buying?" box, so a new shop name starting with an existing one ("HQ DEKET 1") could not be typed - the phone keyboard vanished at "HQ DEKET". The pick now runs when he finishes (Done / Enter / tap outside), same one-match guard. kpm `bb2054c`. Lesson for any auto-action inside a text field: it must not unmount the field it fires from.
- 2026-10-27 12:05 - Promo Round 5 BUILT + pushed: giveaway without a sale (`34010bb`, type GIVEAWAY, Rp 0) and factory bundles (`9403f84`, settings/general.promoBundles, BUNDLES chip in the terminal). Decision + rejected paths in [[2026-10-25_promo-chest]] (Brainstorm).
- 2026-10-27 12:33 - Regional factory offers built + pushed (`21004b7`): WHERE = all areas or one roster region; options + the two open questions in [[2026-10-25_promo-chest]] Round 6.
