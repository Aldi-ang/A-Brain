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
| L1 Skills | ~30% — three real skills now exist (`delegate-coding-task`, `firebase-live-qa`, `skill-safety-check`), plus installed third-party ones (ponytail, caveman, graphify). Interview audit (1.2) done; session-mining audit (1.1) still only a partial pass — see note below, the tooling to do it properly now exists but the full pass hasn't been re-run. |
| L2 Memory | ~90% — vault renamed to A-Brain (folder + GitHub repo + Obsidian pointer, all confirmed), index.md everywhere, runs/ has real data, Graphify wired into both `kpm-inventory` (294 nodes) and A-Brain itself (1356 nodes), `/save`/`/resume` installed, session-ingestion automation genuinely live with broader reach than originally scoped (real session mining, not just 4 Cowork sessions — see 2.5). Missing: 2.2's KPM-content-into-its-own-domain-folder move. |
| L3 Interface | 0% — deliberately not started. Gate (5 working skills, vault beyond KPM, runs/ with real data) still not fully met — only 2 skills, only 1 real ingest run logged. |
| L4 Distribution | 0% — not currently relevant (solo dev, no team yet). |

---

## LEVEL 1 — Skills & Loop Engineering (start here, highest value)

**Goal:** stop re-explaining the same workflows. Codify what's actually repeated.

### 1.1 — Workflow audit via session mining — partial pass done 2026-07-27
Pull real past sessions and identify repeated tasks that aren't skills yet. Output: a table of
`task → expected output → proposed skill`. Use real session data, not guesswork.

**Result: [[Skill-Audit-2026-07-27]].** Only 4 Cowork sessions were reachable from this
sandbox — Claude Code CLI history (where most real KPM incidents happened) wasn't accessible.
Treat this as a partial, honest sample, not a complete audit — worth re-running with CLI
session access later.

### 1.2 — Workflow audit via interview ✅ done 2026-07-27
A structured interview to capture: how Aldi thinks, how he prefers to work, what he's building
toward, what frustrates him, what "done" means to him. Output: a `Personal-Context.md` in the
vault that any future Claude session can read. **This is the single highest-leverage item on
this whole list** — it's what actually makes an AI "know you" rather than re-deriving it every
session.

**Result: [[Personal-Context]].** Also surfaced that A-Brain's scope is whole-life, not just
KPM/coding — feeds directly into 2.2 below.

### 1.3 — Build the top 3-5 skills the audit identifies — started 2026-07-27
Not all of them at once. The audit will likely surface 10+; build the highest-frequency ones
first, validate they work, then expand.

**Built so far:** `firebase-live-qa` (test PRs/features against a live Firebase app, verify
real backend state not just UI, safe test-data cleanup, never make billing changes solo) and
`skill-safety-check` (vet a new Claude skill's files for risky patterns before using it). Both
saved via `save_skill`, usable in any future session. Two more candidates
(`single-file-app-iterate`, a scheduled-refresh pattern doc) logged in
[[Skill-Audit-2026-07-27]] but deliberately not built yet — only one occurrence each in the
sample, want a second real instance before codifying.

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

### 2.1 — Rename vault `kpm-notes-vault` → `A-Brain` — done 2026-07-27, ahead of stated sequencing
Also rename the GitHub repo. Update Obsidian's vault pointer, any CLAUDE.md references, and
the `delegate-coding-task` skill's facts file if it references the old path.

**Original sequencing note (superseded): do this after 2.5's automation is actually in
place, not before.** Aldi explicitly asked to do the rename now, from the Claude Code
session with direct access to the local machine and the `kpm-inventory` repo — stated
openly here rather than silently deviating, per this plan's own convention.

**Result:** local folder copied+verified+renamed (`kpm-notes-vault` → `A-Brain`, same
parent directory), all in-vault path references updated except `Raw/` sources (left
untouched — immutable by this vault's own rule) and this task's own historical heading
text above (kept as an accurate record of the rename, not rewritten). GitHub repo also
renamed (`kpm-notes` → `A-Brain`). Obsidian's vault pointer confirmed switched (checked
`obsidian.json` directly — the A-Brain path shows `"open": true`). `delegate-coding-task`'s
facts file checked — never referenced the old path, nothing to update. **Task 2.1 is now
fully complete**, every sub-item verified, not just claimed.

### 2.2 — Restructure for everything, not just KPM — partially started 2026-07-27
Move KPM content into its own domain folder; add sibling domains (learning, business,
personal projects, whatever the interview surfaces). Structure should come *from* the
interview's findings, not be guessed at upfront.

**Progress:** sibling domain folders created — `Tobacco-Business/`, `Crypto-Learning/`,
`Personal/`, each with a starter `index.md` (scaffolding only, no real content ingested yet).
**Not done:** moving existing KPM `Wiki/` content into its own domain folder — deliberately
deferred since it's a higher-risk move (touches every existing wikilink) and wasn't explicitly
requested; do as a dedicated pass with git checkpoints. `CLAUDE.md` also still describes itself
as KPM-only with just a scope note appended, not a full rewrite for the new domains.

### 2.3 — Add `index.md` at every folder level — done 2026-07-27
The framework is explicit that this is the actual source of power, not the folder names:
*"The power comes from the map, not the arbitrary folders."* Each index tells Claude what it's
looking at and where to go next.

**Result:** every folder now has an `index.md` — root, `Raw/`, `Inbox/`, `Backlog/`,
`Brainstorm/`, `Wiki/Entities/`, `Wiki/Concepts/`, `Wiki/Summaries/`, plus the three domain
folders from 2.2. Root `index.md` is the master map — read it first in any new session.

### 2.4 — Add a `runs/` log folder — done 2026-07-27
Where automations record what they did. Required before any loop engineering (1.5) can work.

**Result:** `runs/` created with an `index.md` proposing a naming/content convention. Empty —
no skill logs to it yet. That's expected; 1.5 (loop engineering) is what will actually start
writing here, and it's explicitly gated on skills being proven manually first.

### 2.5 — Session ingestion habit — automated 2026-07-27, ahead of the original caution
Periodically pull recent sessions into `Raw/`, then ingest → ripple into the wiki. Not
automated at first — prove the habit works manually before automating it.

**Deviation, stated openly:** Aldi explicitly asked to skip straight to automation rather than
prove the habit manually first — he wants work in chat/Claude Code/Cowork to land in the vault
without manually prompting for it each time, plus a way to cut token burn when Claude Code
re-derives context that's already in the vault. See [[Automation-Setup]] for the full design
and honest scope limits.

**Update 2026-07-27 — superseded the Cowork-only version.** The original Cowork-based daily
task was deleted and replaced with a scheduled task (`a-brain-session-ingest`, still 21:00
daily) created from a Claude Code session — same taskId, genuinely broader reach: its first
real run mined 14 actual sessions via `list_sessions`/`list_events` (not the ~4 Cowork-only
sessions the old version was limited to), correctly ingested one genuinely new thing and
correctly skipped 13 already-covered ones with real reasoning, not guesswork. See
`runs/2026-07-27_a-brain-session-ingest_first-run.md` for the actual run log.

**Open question this raises, not yet resolved:** the `SessionEnd` hook was planned as a
safety net "for sessions where Aldi forgets `/save`." Given the new routine already mines
real session history directly (regardless of whether `/save` was run), the hook's marginal
value looks lower than originally assumed. Not building it yet — worth watching a few more
days of real ingest runs before deciding it's actually redundant rather than assuming so from
one data point. claude.ai web chat still needs the manual browser-extension export path (see
[[Automation-Setup]] section 4).

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
- **2026-07-27 — v3.** Ran task 1.2 (interview) → [[Personal-Context]]. Answered the "high end
  apps" open question from the context handoff (reliability, polish, depth,
  enterprise-readiness, ergonomics). Confirmed A-Brain's scope is whole-life (tobacco business,
  crypto/financial learning, personal reflection — not just KPM/coding), which sets the
  direction for 2.2's restructuring but doesn't fix the exact folder taxonomy yet.
- **2026-07-27 — v4.** Aldi said he's flexible on the exact taxonomy, so started 2.2 without
  further questions: created `Tobacco-Business/`, `Crypto-Learning/`, `Personal/` as sibling
  domains with starter index.md files, each seeded from the interview. Deliberately did NOT
  move existing KPM `Wiki/` content or rename the vault (2.1) — those are higher-risk,
  higher-blast-radius moves better done as their own dedicated pass.
- **2026-07-27 — v5.** Ran 1.1 (session-mining audit) as a partial pass — see
  [[Skill-Audit-2026-07-27]]; only Cowork sessions were reachable, CLI history wasn't. Built
  the two clearest skills it surfaced (1.3): `firebase-live-qa` and `skill-safety-check`,
  both saved via `save_skill`. Left two weaker candidates unbuilt pending a second real
  occurrence, per the plan's own warning against building from a sample of one.
- **2026-07-27 — v6.** Completed 2.3 (index.md at every folder — including a new root map)
  and 2.4 (runs/ scaffolded, empty, ready for 1.5 later). Did **not** start 1.4 (automations)
  since the plan itself requires skills to be proven manually first, and the two new skills
  haven't been used yet. Remaining open in L1/L2: 1.1 full pass (needs CLI session access),
  1.4/1.5 (blocked on proven skills), 2.1 (vault/repo rename — higher-risk, deferred), 2.5
  (session ingestion habit not yet running).
- **2026-07-27 — v7.** Aldi asked to skip 2.5's "prove manually first" caution and automate
  session capture now, across chat/Claude Code/Cowork, plus fix Claude Code's token burn when
  it re-derives vault context. Built what's actually reachable from this sandbox: a live daily
  Cowork ingest task, a drafted-but-untested Claude Code `SessionEnd` hook, and a short
  CLAUDE.md pointer for the KPM repo (not yet pasted in — that repo isn't connected here). Full
  design and scope limits in [[Automation-Setup]]. Confirmed 2.1 (rename) stays blocked until
  this automation is actually working, per Aldi's own stated sequencing.
- **2026-07-27 — v8.** Aldi pointed to 4 videos on a community Claude Code + Obsidian + Graphify
  pattern (Chase AI's series, referencing
  [lucasrosati/claude-code-memory-setup](https://github.com/lucasrosati/claude-code-memory-setup)
  and graphify.net's official docs). Researched and revised [[Automation-Setup]]: swapped the
  hook-only Claude Code capture plan for `/save`/`/resume` slash commands as primary (hook kept
  as a demoted safety net), adopted Graphify's official `graphify claude install` one-command
  setup plus a "3-layer query rule" (graph → vault → raw files) for the KPM repo's CLAUDE.md,
  scaffolded a `graphify/` folder for Graphify's Obsidian code-graph export, and corrected an
  earlier overclaim — claude.ai web chat isn't fully out of reach, a browser-extension export
  path exists. Nearly everything here still needs Aldi to run commands on his own machine
  (this sandbox can't reach the KPM repo or his Claude Code install directly).
- **2026-07-27 — v9.** A Claude Code session with real machine + `kpm-inventory` access
  executed everything v8 flagged as needing Aldi's hands: `graphify claude install` in
  `kpm-inventory` (294 nodes, committed + pushed, CI green), the 3-layer CLAUDE.md rule,
  `/save`/`/resume` installed globally, the Obsidian code-graph export (315 notes). Aldi then
  asked for the 2.1 rename now rather than waiting — done: folder + GitHub repo renamed,
  Obsidian pointer confirmed. Graphify was also wired into A-Brain itself (1356 nodes across
  the whole vault). A separate reconciliation pass caught and committed uncommitted work from
  two parallel sessions (this one and a Cowork session) that had touched the vault
  independently without conflicting — same failure shape as the 3 worktree incidents, caught
  before it became a 4th. The old Cowork-only daily ingest task was deleted and replaced with
  a scheduled task from a Claude Code session, ran once successfully with genuinely broader
  session reach than before (see 2.5's update). This entry itself written after re-verifying
  every claim above against real `git log`/file contents, not trusted from prior sessions'
  summaries — the status table and 2.1/2.5 sections above were corrected to match.
