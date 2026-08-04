---
title: "Wiki Conventions"
description: The confidence/checked frontmatter fields on Entity, Concept, and Summary pages — a lightweight claim-ledger, adapted from claude-obsidian's schema, not imported.
type: meta
created: 2026-07-29
updated: 2026-07-29
tags: [meta, wiki, conventions]
---

# Wiki Conventions

## confidence / checked frontmatter

Entity, Concept, and Summary pages carry two extra frontmatter fields:

```yaml
confidence: high | medium | low
checked: YYYY-MM-DD
```

- **confidence** — how sure this page's claims still hold. `high` by default for pages nothing
  has contradicted. Drop to `medium`/`low` the moment something in the real repo (a commit, a
  deploy, a code change) makes a claim here uncertain — don't wait for a full rewrite first.
- **checked** — the date someone (Aldi or an agent) last verified this page against the real
  repo, not the date it was last edited. `updated:` already tracks edits; `checked:` tracks
  verification, which is a different event.

## Why this exists

Adapted from the source/claim ledger pattern in
[claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) (`claude_obsidian/ledgers.py`)
— evaluated 2026-07-29, not imported wholesale (see the Alucard benchmark run for why: no
subagents, no new Python dependency for a single-user vault). This is the lightweight version
of the same idea: **a stale claim should be visible as stale, not indistinguishable from a
verified one.**

This is not a new rule — it formalizes what the vault's own
[[Draft-Then-Deploy Discipline]] convention ("document, don't silently overwrite") already
does in prose. The frontmatter just makes staleness *scannable* without reading every page.

## The case that proved it was needed

[[Firestore Rules]] was re-confirmed "still-undeployed" on 2026-07-27. The rules **were**
deployed the next day (commit `b386ec7`, 2026-07-28) — the page said otherwise for two days
before this retrofit caught it, only because the Alucard benchmark's T2 task happened to ask
about it directly. `confidence: low` + an old `checked:` date would have flagged this on sight,
without needing a benchmark to surface it.

## What NOT to retrofit

`index.md`, `MOC.md`, `Log.md`, `Lessons-Archive.md` — these are navigation and append-only
history, not claims about the world. They don't get `confidence`/`checked`.

## Maintenance

No automation writes these fields yet. Whoever verifies a page's claims against the real repo
updates `checked:` to that date, and `confidence:` if anything changed. If this becomes
frequent enough to be annoying by hand, that's the signal to look at claude-obsidian's actual
`gates.py`/`transaction.py` — not before.
