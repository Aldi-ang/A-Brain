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
