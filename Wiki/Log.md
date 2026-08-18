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
