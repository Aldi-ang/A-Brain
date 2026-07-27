# PLAN — A-Brain: Aldi's Agentic OS

*Living document. Add a dated entry to the Revision Log whenever the plan changes — never
silently revise.*

**Status: v1 — Jul 27 2026**
**Framework source:** Chase AI's 4-level agentic OS model (chaseai.io/blog/build-your-own-agentic-os-claude-code)

---

## The core principle driving this plan's ordering

The framework's own author: *"Levels one and two are where you make most of your money —
roughly 90% of the value of any agentic OS. Once those are locked in, the visual stuff on top
is the cherry, not the cake."* He has a separate article specifically warning against building
the dashboard first.

**Therefore: dashboard is Level 3, and we do not start there.** It was requested as a headline
feature, but building it before the skills/memory backbone exists produces a pretty shell with
nothing underneath. This is a deliberate, stated deviation from the original request, not an
oversight.

This also matches Ponytail's philosophy (already installed): the best code is the code you
never wrote. A dashboard built before there's anything to display is exactly the kind of
premature building both sources warn against.

---

## Where we already are (before starting)

| Level | Status |
|---|---|
| L1 Skills | ~10% — one real skill exists (`delegate-coding-task`), plus installed third-party ones (ponytail, caveman, graphify). No workflow audit has ever been run. |
| L2 Memory | ~60% — vault exists with Karpathy Raw/Wiki/Index structure, CLAUDE.md rulebook, real ingested content, git-backed on GitHub. Missing: broader-than-KPM scope, per-folder index.md, personal context/profile. |
| L3 Interface | 0% — deliberately not started. |
| L4 Distribution | 0% — not currently relevant (solo dev, no team yet). |

---

## LEVEL 1 — Skills & Loop Engineering (start here, highest value)

**Goal:** stop re-explaining the same workflows. Codify what's actually repeated.

### 1.1 — Workflow audit via session mining
Pull real past sessions and identify repeated tasks that aren't skills yet. Output: a table of
`task → expected output → proposed skill`. Use real session data, not guesswork.

### 1.2 — Workflow audit via interview
A structured interview to capture: how Aldi thinks, how he prefers to work, what he's building
toward, what frustrates him, what "done" means to him. Output: a `Personal-Context.md` in the
vault that any future Claude session can read. **This is the single highest-leverage item on
this whole list** — it's what actually makes an AI "know you" rather than re-deriving it every
session.

### 1.3 — Build the top 3-5 skills the audit identifies
Not all of them at once. The audit will likely surface 10+; build the highest-frequency ones
first, validate they work, then expand.

### 1.4 — Convert proven skills into automations
Only after a skill is proven manually. Claude Desktop has a **Routines** feature for
scheduling (verify current capabilities before relying on it — this is a product feature that
may have changed).

### 1.5 — Add loop engineering to ONE skill first
A self-improving loop: the skill reads its own past run logs and improves. Do this on one
skill and verify it actually improves anything before applying it broadly. Requires L2's
logging to exist first.

---

## LEVEL 2 — Memory & State (mostly built, needs broadening)

### 2.1 — Rename vault `kpm-notes-vault` → `A-Brain`
Also rename the GitHub repo. Update Obsidian's vault pointer, any CLAUDE.md references, and
the `delegate-coding-task` skill's facts file if it references the old path.

### 2.2 — Restructure for everything, not just KPM
Move KPM content into its own domain folder; add sibling domains (learning, business,
personal projects, whatever the interview surfaces). Structure should come *from* the
interview's findings, not be guessed at upfront.

### 2.3 — Add `index.md` at every folder level
The framework is explicit that this is the actual source of power, not the folder names:
*"The power comes from the map, not the arbitrary folders."* Each index tells Claude what it's
looking at and where to go next.

### 2.4 — Add a `runs/` log folder
Where automations record what they did. Required before any loop engineering (1.5) can work.

### 2.5 — Session ingestion habit
Periodically pull recent sessions into `Raw/`, then ingest → ripple into the wiki. Not
automated at first — prove the habit works manually before automating it.

---

## LEVEL 3 — Interface (only after 1 & 2 are real)

**Do not start until:** at least 5 working skills exist, the vault covers more than KPM, and
`runs/` has real data in it. A dashboard with nothing behind it is decoration.

When ready: an Obsidian plugin or local web app that surfaces the vault + fires skills as
buttons via `claude -p` (headless Claude Code). Verify `claude -p`'s current billing/plan
behavior before depending on it.

---

## LEVEL 4 — Distribution (not currently relevant)

Parked. Aldi is a solo developer; there's no team or client to distribute to yet. Revisit if
that changes (e.g. if KPM's company adds staff who'd use these tools).

---

## Honest risks with this plan

- **Over-engineering the system instead of doing the work.** The KPM app still has real open
  items. A knowledge system that eats the time meant for the actual project is a net loss.
  Mitigation: L1 skills should come *from* real KPM work, not replace it.
- **Interview data going stale.** How someone thinks changes, especially at 14. The
  `Personal-Context.md` should be revisited periodically, not written once and trusted forever.
- **Automation before validation.** The framework is explicit: validate manually first, then
  codify. Skipping that produces automations that reliably do the wrong thing.

---

## Revision Log

- **2026-07-27 — v1.** Adopted Chase AI's 4-level framework. Deliberately reordered to put the
  dashboard last despite it being requested first, per the framework's own explicit warning
  and Ponytail's build-less philosophy. Noted existing progress (L2 ~60% complete from the
  second-brain work already done). Flagged the interview (1.2) as the single highest-leverage
  item.

---

## Vision (clarified by Aldi, 2026-07-27) — supersedes earlier framing

This is **not** a replacement for or distraction from KPM development. It is a separate,
parallel project whose purpose is to make KPM (and every app after it) better.

The model: Aldi may sell KPM and build apps for other companies. Each new project should
start smarter than the last, because the vault carries forward everything learned. The asset
being built is **compounding capability**, not documentation.

This directly answers the "over-engineering instead of doing the work" risk flagged in v1 —
the horizon isn't KPM's timeline, it's a career of projects.

**Corollary worth naming:** when KPM is sold, the code transfers to the buyer. The vault
doesn't. It's the asset that survives the sale and makes Aldi worth hiring for app #2.

---

## Brainstorm outputs — 2026-07-27

### 1. The transferability split (the riskiest assumption, now addressed structurally)

The vault's entire value depends on how much knowledge actually transfers between projects.
Tested against this week's real KPM learnings, they sort into three tiers:

| Tier | Transfers to | Examples from KPM |
|---|---|---|
| **Universal** | Any app, any stack | "UI says yes, server says no" bug class; verify commit diffs match their messages; draft-then-deploy for instantly-live changes; chunk bulk writes; error handlers on all listeners |
| **Stack-specific** | Any Firebase app | Firestore rules patterns; bossUid multi-tenancy; emulator testing workflow; offline persistence gotchas |
| **Domain-specific** | Only KPM | Cigarette distribution logic; Indonesian regional structure; tier naming (Fleet Captain etc.) |

**Finding: most of this week's hard-won lessons are Universal or Stack-specific, not
domain-locked.** That's strong evidence the compounding thesis holds.

**Action: make this split structural in the vault**, not something re-derived each time.
Future-Aldi on a non-Firebase project needs to see in one glance which lessons still apply.

### 2. Knowledge vs. reusable code — two different assets

The vault holds *knowledge* (saves thinking time). But some KPM output is directly reusable
*code* (saves building time): commitInChunks, the tier-permission architecture, the
multi-tenant scoping pattern, the security-rules deploy checklist.

**Open question: should there be a companion "starter kit" repo** for reusable code, separate
from the knowledge vault? Not decided — flagged for a future session.

### 3. The real failure mode: a write-only vault

The genuine risk isn't over-engineering. It's that material goes in and never comes out —
volume feels like progress but produces nothing.

**Success metric (adopt this):** not "how much is in the vault" but **"did a future session
actually get faster because of it?"**

**Cheap test to run:** on the next real task, deliberately query the vault *first*. If it
doesn't help, the fix isn't more notes — it's a structure that answers real questions.

### 4. Versioning a changing mind

Aldi explicitly noted his thinking evolves. Real design problem: if the vault records
"decided X" and he's since moved on, a future AI acts confidently on stale reasoning.

**Proposed convention: never overwrite an opinion.**
- Date-stamp every position
- Add "superseded by [[...]]" links rather than deleting
- Keep the old view visible

The evolution itself then becomes data — showing how thinking matured, which is arguably more
valuable than any single snapshot. Applies to this PLAN document too.

---

## Revision Log (continued)

- **2026-07-27 — v2.** Vision clarified: this is a parallel compounding-capability project,
  not a KPM substitute — resolves the v1 over-engineering risk. Added the three-tier
  transferability split (Universal / Stack-specific / Domain-specific) as a structural
  requirement, backed by testing it against real KPM learnings. Named the write-only vault as
  the true failure mode, with a concrete success metric. Adopted never-overwrite-opinions
  versioning. Flagged the knowledge-vs-reusable-code question as open.
