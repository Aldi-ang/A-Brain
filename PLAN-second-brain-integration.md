# PLAN — KPM Second Brain: Obsidian + Claude Code + Ponytail Integration System

*This is a living document. Update it (add a new dated entry under "Revision Log") whenever
a better idea emerges — do not just silently change the system without recording why.*

**Status: v1 — initial design, Jul 26 2026**

---

## Requirements (what this system needs to actually do)

1. Capture *knowledge and understanding* about the KPM app — concepts, patterns, decisions,
   the "why" behind things — in a way that's genuinely browsable and connected, not a wall
   of chat history.
2. Do this **without** creating a second, competing source of truth for the app's actual
   code or Firestore rules state — those stay in the git repo, full stop.
3. Work *with* the existing tools already in place (Claude Code's own memory, the
   `delegate-coding-task` skill, Ponytail's minimal-code philosophy) rather than replacing
   or duplicating them.
4. Be maintainable by an AI agent with minimal manual upkeep from the project owner — the
   whole point is reducing cognitive load, not adding a new chore.

## Design

### Division of responsibility (the part that matters most)

| Layer | Lives in | Source of truth for |
|---|---|---|
| The app itself | `kpm-inventory` git repo | Actual code, actual deployed rules |
| AI operational memory | Claude Code's own memory + `delegate-coding-task` skill | Facts needed to resume work efficiently across sessions |
| **Human knowledge/understanding** | **`kpm-notes-vault` Wiki** | **Concepts, patterns, decisions, the "why" — for the project owner to learn from and browse** |

These three never need to be kept in perfect lockstep. The Wiki is allowed to be a
*periodic distillation*, not a live mirror — it's explicitly not trying to be the fastest,
most current source for "is this fixed yet" (the repo/memory already answer that instantly).
It's trying to answer "what do I actually understand about how this app works, and why."

### Vault structure (adopting the guide's pattern, adapted for KPM)

```
kpm-notes-vault/
  CLAUDE.md              ← rulebook (see below)
  Raw/                   ← immutable: full text of real sessions/reports/decisions
  Inbox/                 ← new material waiting to be processed
  Wiki/
    Index.md             ← catalog, read first
    Log.md                ← append-only history of ingest/query operations
    Entities/            ← e.g. Firestore Rules.md, Multi-Tenant Architecture.md,
                             Tier System.md, Fleet Captain Permission Gap.md
    Concepts/             ← e.g. UI-Says-Yes-Server-Says-No Pattern.md,
                             Anti-Recurrence Check.md, Ponytail Philosophy.md
    Summaries/            ← one page per real session/incident ingested
  Backlog/               ← already exists, unchanged
  Brainstorm/            ← already exists, unchanged
```

### Where Ponytail fits

Ponytail governs *how Claude Code writes code* in the actual repo — a real-time coding
discipline, not a knowledge-capture tool. Its role in this system: (a) it keeps doing its
job invisibly in Claude Code as before, and (b) its philosophy gets documented as one
`Concepts/` page in the wiki, so the project owner can actually read and understand *why*
Claude Code behaves the way it does, rather than it being invisible magic.

### The two core operations (adapted from the guide)

**Ingest** — when a real session, bug, or decision happens (this project has *a lot* of
real material already: the worktree incidents, the permission-gap pattern, the security
rules saga):
1. Save the real source material (a transcript, a report) to `Raw/`, untouched.
2. Write a `Wiki/Summaries/` page.
3. **Ripple** — update every relevant `Entities/`/`Concepts/` page the source touches. A
   good KPM incident should touch several pages (e.g. the Fleet Captain motorists-update
   bug touches: Firestore Rules, Tier System, UI-Says-Yes-Server-Says-No Pattern,
   Anti-Recurrence Check).
4. Update `Wiki/Index.md` and append to `Wiki/Log.md`.

**Query** — ask a question, get an answer sourced from the wiki with citations to which
page/summary it came from, clearly separated from anything added from general knowledge.

### Boundaries (non-negotiable, matching this project's hard-earned lessons)

- Never treat the Wiki as authoritative for "is this actually deployed/fixed right now" —
  always verify that against the real repo/live app, same discipline as everything else
  this project has learned the hard way.
- Never auto-ingest without the project owner choosing what goes in (same principle as the
  guide's "daily digest" — surface candidates, don't auto-file).
- Never invent facts — mark anything unverified, same as everywhere else in this project.

## Trade-offs (being honest about the cost)

- This requires **someone to actually run "ingest" periodically** — it's not free. The
  upside is each ingest session is a distinct, bounded task (not ongoing maintenance
  burden), and the payoff compounds — the guide's own claim ("around ten sources, the graph
  starts to feel different") likely holds here too, given how much real material this
  project already has sitting in Claude's memory that's never been "ingested" this way.
- There's real risk of the Wiki quietly going stale if ingestion stops happening. Mitigation:
  the `Log.md` file makes staleness visible (a long gap in the log is an honest signal to
  notice), rather than pretending everything's always current.

## Revision Log

- **2026-07-26 — v1 initial design.** Established the division of responsibility (repo =
  code, memory = AI operations, Wiki = human knowledge), adopted the Raw/Inbox/Wiki
  structure from the natural20.com guide, defined ingest/query operations adapted for KPM's
  actual incident history, positioned Ponytail as a documented Concept rather than a
  wiki-maintenance tool.
