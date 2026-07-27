---
title: Map of Content
description: Start here. Every Wiki page, organized by topic instead of a flat list — the front door to this vault.
type: moc
created: 2026-07-27
updated: 2026-07-27
tags: [moc, meta]
---

# Map of Content

**Open this page first.** Everything below is a real page in this vault, sorted by what it's
*about* rather than when it was written. For a plain A-Z list instead, see [[Index|Wiki Index]].

New to this vault? Read `CLAUDE.md` in the vault root for the full rulebook — short version:
`Raw/` holds untouched original sources, `Wiki/` is the readable layer built from them, and
this Wiki is a snapshot of *understanding*, not a live status page. For "is this actually
fixed/deployed right now," always check the real `kpm-inventory` git repo, not this vault.

---

## 🔒 Security & Permissions

How KPM decides who can read or write what, and where that's gone wrong.

- [[Firestore Rules]] — the server-side file that actually enforces access, separate from the UI.
- [[Fleet Captain Permission Gap]] — the #1 recurring bug: a check that covers Area Admin but forgets Fleet Captain.
- [[UI-Says-Yes-Server-Says-No Pattern]] — the general bug shape behind that gap: a button that works in the UI but silently fails at the database.
- [[Rank Config and Achievement Badges]] — a feature with two bugs, one fixed, one still open — the closest thing in KPM to a real "escalation" vulnerability.
- [[Rank Config Cross-Tenant Gap]] — the summary that names that open vulnerability precisely: one company's settings shared by every company.
- [[Fleet Captain Rule Gaps — Batch 1 and 2]] — the two batches of fixes for the recurring gap above, and how they nearly got lost on an unmerged branch.
- [[Option B Region Lock]] — locking roster create/delete to an admin's own region, plus a real "don't trust old memory, re-check the code" lesson.
- [[Customer Directory Permission Tier]] — a 3-level edit permission for the Customer Directory. *(Also an [[#🚨 Incidents|incident]] — its first version was nearly lost.)*
- [[Dead Weight Cleanup and Rules-Deploy Gap]] — 2026-07-27 re-check: rules deploy still the top open gap; also removed two console.logs that leaked a privilege-bypass path to devtools.

## 🧭 Process & Discipline

The house rules this project follows so mistakes don't repeat.

- [[Anti-Recurrence Check]] — never say "committed" without checking `git show --stat` yourself.
- [[Draft-Then-Deploy Discipline]] — a Firestore rule change is only a draft until a human deploys it by hand.
- [[Rules Draft Process]] — the summary this discipline was built from: document a blocked fix, don't silently skip it.
- [[Ponytail Philosophy]] — the lazy-but-correct coding style that governs how Claude Code writes real code here.
- [[Ponytail Philosophy Ingest]] — where that page's content actually came from.
- [[Claude Code CLI Install — McAfee Download Freeze]] — the CLI install got silently blocked by McAfee scanning the download; how it was diagnosed and worked around, plus the non-interactive ponytail marketplace install.

## 🏗️ Architecture

The shape of the app everything else sits on top of.

- [[Multi-Tenant Architecture]] — one shared database, every company's data kept apart via the `bossUid` pattern.
- [[Tier System]] — the six role levels, from Developer down to Rookie, and how delegation works.
- [[KPM Project Facts Reference]] — the one-page cheat sheet covering both of the above, plus reusable patterns worth knowing.

## 🚨 Incidents

Real things that went wrong (or nearly did), and what was learned.

- [[Git Worktrees]] — the git feature behind three separate near-losses of finished work.
- [[Lost Work in Worktrees — Three Incidents]] — the full story of all three, back to back.
- [[Offline Login Lockout Fix]] — refreshing the page offline could show a real employee a false "Access Denied."
- [[Customer Directory Permission Tier]] — incident #1 of the three above: this feature's first landing attempt was the one that got lost.

---

## Elsewhere in this vault

- [[Index|Wiki Index]] and [[Log|Wiki Log]] — the flat catalog and the append-only build history, mainly for AI queries.
- `Backlog/` and `Brainstorm/` — a separate to-do board and scratch space for open work. Not part of this knowledge graph by design (see `CLAUDE.md`) — open `Backlog/` directly to see what's next.
- `PLAN-second-brain-integration.md` — why this vault exists and how it's meant to be maintained.
