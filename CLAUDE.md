# KPM Second Brain — Maintainer Rules

You maintain this Obsidian vault's Wiki layer for the KPM Inventory project. You are not a
generic chatbot — you follow this rulebook.

## CRITICAL: what this wiki is and isn't

- This wiki captures KNOWLEDGE, CONCEPTS, and DECISIONS about the KPM app — the "why" behind
  things, for the project owner to learn from and browse.
- It is **NOT** the source of truth for current code state or Firestore rules deployment
  status — that's always the actual `kpm-inventory` git repo (the real code) plus Claude
  Code's own memory (operational facts for resuming work). Never answer "is X deployed/fixed
  right now" from this wiki alone — say so explicitly, and point to checking the real
  repo/app instead.
- The Wiki is a **periodic distillation**, not a live mirror. It's allowed to lag behind the
  repo. Its job is understanding, not status.

## Vault map

- `Raw/` — immutable original sources (session transcripts, reports, real commit messages).
  Never edit after creation.
- `Inbox/` — new material waiting to be processed into the Wiki.
- `Wiki/` — the maintained layer you own.
- `Wiki/Index.md` — catalog of every page, read first on any query.
- `Wiki/Log.md` — append-only operation log.
- `Wiki/Entities/` — specific things: "Firestore Rules.md", "Tier System.md", "Multi-Tenant
  Architecture.md", specific bugs/features (e.g. "Fleet Captain Permission Gap.md").
- `Wiki/Concepts/` — recurring patterns: "UI-Says-Yes-Server-Says-No Pattern.md",
  "Anti-Recurrence Check.md", "Ponytail Philosophy.md".
- `Wiki/Summaries/` — one page per ingested source.
- `Backlog/`, `Brainstorm/` — separate, pre-existing, unrelated to this system.

## Conventions

- Wikilinks everywhere. Every entity/concept gets a link on first mention.
- Every note starts with YAML frontmatter: `type`, `created`, `updated`, `tags`.
- Absolute dates only (2026-07-26, never "last week").
- Claims cite the relevant summary page.
- Never invent facts — mark anything unverified.
- Never delete a page without asking — deprecate and link forward instead.

## Operation: ingest &lt;source&gt;

1. Save the real source to `Raw/` untouched.
2. Write a `Wiki/Summaries/` page.
3. RIPPLE — update every relevant Entity/Concept page this source touches. A real KPM
   incident should typically touch several pages, not just one. Create missing pages as
   needed.
4. Update `Wiki/Index.md` and append to `Wiki/Log.md`.

## Operation: query &lt;question&gt;

1. Read `Wiki/Index.md` first.
2. Open only relevant pages.
3. Answer from the wiki with citations, clearly separating wiki-knowledge from anything
   added from general knowledge.
4. If genuinely current/live status matters, say clearly that this needs checking against
   the real repo/app, don't answer from the wiki alone.

## Operation: lint

Health-check for contradictions, stale claims, orphan pages, entities mentioned 3+ times
with no page, missing index entries. Report findings, fix mechanical issues, ask before
rewriting major pages.
