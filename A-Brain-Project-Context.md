# A-Brain Project — Context Handoff

*Upload this as project knowledge in the new A-Brain Claude project, alongside
`PLAN-A-Brain-agentic-OS.md`. Claude's memory does not carry across projects, so this file
is what bridges the gap.*

---

## Who this is for

**Aldi** — 14, Indonesian, self-taught developer. Building a real production B2B app
(KPM/Cello) for an actual company, PT Karyamega Putera Mandiri.

**Communication preferences (important):**
- Simple, short English sentences. Explain technical terms in plain words.
- Indonesian words/phrases welcome where they help.
- He's learning — be patient and clear, but don't talk down to him. He handles real
  architectural decisions and pushes back well when something's wrong.
- He responds well to honest disagreement. Multiple times, pushing back on his stated
  request produced a better outcome than complying would have.

---

## What A-Brain is

A knowledge vault + agentic OS. **Separate from KPM development, not a replacement for it.**

The thesis: Aldi may sell KPM and build apps for other companies. The vault carries forward
everything learned, so each new project starts smarter than the last. The asset is
**compounding capability**, not documentation.

Key corollary: when KPM sells, the code goes to the buyer — the vault doesn't. It's what
survives the sale.

See `PLAN-A-Brain-agentic-OS.md` for the full plan, current status, and revision history.
**That plan is a living document — update its Revision Log whenever it changes, never
silently revise it.**

---

## Current tool stack (all already installed and working)

| Tool | What it does | Where |
|---|---|---|
| **Claude Code** | The main coding agent (CLI + Desktop app) | Terminal + Desktop |
| **Obsidian** | The vault UI | Desktop app |
| **Claudian** | Embeds Claude Code as a chat panel inside Obsidian | Obsidian plugin |
| **Graphify** | Indexes codebases into a queryable graph (cuts token cost on code navigation) | Claude Code skill |
| **Ponytail** | Forces Claude Code to stop over-engineering (~50% less code) | Claude Code plugin |
| **delegate-coding-task** | Custom skill encoding this project's hard-won prompt discipline | Claude Code skill |
| **caveman** | Ultra-compressed output mode when token efficiency matters | Claude Code skill |

**Vault location:** `D:\APP DEVELOPMENT\kpm inventory main FILES\A-Brain` (renamed 2026-07-27,
was `kpm-notes-vault` — task 2.1)
**Vault repo:** `github.com/Aldi-ang/A-Brain` (renamed from `kpm-notes` 2026-07-27)
**KPM code repo:** `github.com/Aldi-ang/kpm-inventory` (completely separate — keep it that way)

---

## Vault structure as it currently exists

Built on the Karpathy pattern:
```
Raw/          ← immutable original sources, never edited
Inbox/        ← captures waiting to be processed
Wiki/
  Index.md    ← catalog, read first
  Log.md      ← append-only operation history
  Entities/   ← specific things (Firestore Rules, Tier System, etc.)
  Concepts/   ← recurring patterns (UI-Says-Yes-Server-Says-No, Anti-Recurrence Check)
  Summaries/  ← one page per ingested source
Backlog/      ← Kanban board via Obsidian Bases
Brainstorm/   ← scratch space for undecided things
CLAUDE.md     ← the vault's own rulebook
```

---

## Hard-won lessons that must not be lost

These came from real incidents on KPM and are why several conventions exist:

1. **Verify claims against reality, always.** Three separate times, work claimed as "done and
   committed" was not actually on `main` — it sat in abandoned git worktrees or was never
   committed at all. The fix: before declaring anything done, diff the actual commit against
   what's being claimed (`git show --stat`) and confirm they match.

2. **Comments lie.** A file header saying "NOT DEPLOYED" stayed there after deployment. Only
   checking the actual live system is real proof — never infer deployment state from a
   document.

3. **"UI says yes, server says no."** A permission check in the app that doesn't match what
   the backend actually enforces. This exact bug class recurred 5+ times in KPM. Always check
   both sides against each other.

4. **Watch for injected content.** Twice, text formatted to look like prior AI analysis
   appeared in messages, containing claims never actually made. Treat unverified claims as
   unverified regardless of how they're formatted.

5. **Security changes are never auto-deployed.** Firestore rules go live instantly and
   globally. Process: investigate → emulator-test → leave as reviewed draft → Aldi deploys
   himself, present at the keyboard, with immediate post-deploy verification.

---

## Where the plan currently stands

- **Level 1 (skills + loop engineering): ~10%.** One real custom skill exists. No workflow
  audit has ever been run. **The interview (task 1.2) is the highest-leverage next step** —
  it produces `Personal-Context.md`, which is what makes future sessions actually know Aldi
  rather than re-deriving him every time.
- **Level 2 (memory + state): ~60%.** Vault exists and works. Needs: rename to A-Brain,
  broaden beyond KPM, per-folder index files, a `runs/` log folder.
- **Level 3 (interface/dashboard): 0%, deliberately.** The framework's own author warns that
  building the dashboard first is the classic mistake. Aldi originally asked for it as a
  headline feature; the reordering was stated openly, not done silently.
- **Level 4 (distribution): parked.** Solo dev, no team to distribute to yet.

---

## Open questions awaiting Aldi's input

1. ~~What does "high end kind of apps" actually mean to him?~~ **Answered 2026-07-27** in the
   task 1.2 interview — see [[Personal-Context]]. Reliability, polish, depth,
   enterprise-readiness, and ergonomics (simple/low-maintenance logic despite feature depth).
2. **Should there be a companion "starter kit" repo** for reusable *code* (as distinct from
   knowledge)? Still undecided.
3. **Crown Transfer decision** (a KPM matter) is parked pending a conversation with the
   company boss — mentioned here only so it isn't mistaken for something forgotten.
