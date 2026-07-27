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
