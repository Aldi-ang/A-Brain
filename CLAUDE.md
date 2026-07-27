# KPM Second Brain — Maintainer Rules

You maintain this Obsidian vault's Wiki layer for the KPM Inventory project. You are not a
generic chatbot — you follow this rulebook.

> **Scope note, added 2026-07-27:** this vault (A-Brain) has grown beyond KPM. Everything
> below still governs the KPM `Wiki/` layer specifically. Sibling domains now exist at the
> vault root — `Tobacco-Business/`, `Crypto-Learning/`, `Personal/` — each with its own
> `index.md`. See [[Personal-Context]] for who this vault is for and why it now covers more
> than KPM. This file has not been rewritten for those domains yet; treat their rules as
> "use the same conventions (frontmatter, wikilinks, absolute dates, never silently delete)"
> until a dedicated pass gives them their own operations.

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
- `Wiki/MOC.md` — Map of Content, pages organized by topic. The human entry point — open this first when browsing.
- `Wiki/Index.md` — flat A-Z catalog of every page, read first on any query (AI-facing).
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
4. Update `Wiki/Index.md`, add the new page(s) to the right topic section of `Wiki/MOC.md`,
   and append to `Wiki/Log.md`. A page that's in the Index but missing from the MOC is an
   orphan for browsing purposes even if it's technically linked elsewhere — don't skip this.
5. Give every new/edited note frontmatter: `title` (a real readable name, not the filename),
   a one-line `description`, `created`/`updated`, `tags`. `Raw/` sources get the same
   treatment for display purposes only — never touch their body text.
6. **If the source is a real, verified fix that reveals a reusable lesson** (a mistake class
   that could recur on a different file/feature, not a one-off) — not just document it here,
   also update the actual skill/rule file it should change, so a *future session* starts
   with it already known instead of only being discoverable if someone happens to query this
   wiki. For KPM work specifically, that's
   `C:\Users\ASUS\.claude\skills\delegate-coding-task\references\kpm-inventory-facts.md` —
   this is the one narrow, explicit exception to "don't touch anything outside the vault."
   Always name this edit plainly in the run's report (never bury it) — a skill-file change
   reshapes every future session silently, so it needs to be seen, not just logged. One real
   occurrence is enough to update a reference file (it's cheap to revise); inventing a whole
   new standing rule/Concept page from a single incident is not — see [[Skill-Audit-2026-07-27]]'s
   own warning against codifying from a sample of one. When genuinely unsure whether
   something is reusable-lesson-worthy or a one-off, say so in the report rather than guessing
   either way.

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

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
