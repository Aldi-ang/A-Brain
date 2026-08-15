---
title: "Ingest run — the dock shipped, and biometric was never a Firebase bug"
skill: a-brain-session-ingest
date: 2026-08-15
outcome: one source ingested, no new pages, four ripples, one skill-file edit
tags: [runs, ingest, kpm, css, webauthn]
---

# 2026-08-15 · scheduled ingest

## What was found

Last vault write was `b6c5def` (2026-08-14 18:33 WIB). The KPM repo had 12 commits after that,
all 2026-08-15 00:00–08:15 WIB, from session "CROWN PLAN PHASE 4 PART 9" — none reflected in the
vault yet. "Vault gap curator" ran once more (08:05 WIB) but produced no vault commit, so nothing
from it needed capturing.

## Ingested

- `Raw/2026-08-15_source_header-dock-ship-webauthn.md` — commit log + the three 08-15 PROGRESS.md
  log entries, verbatim.
- No new Wiki pages — everything found extends existing pages precisely (see below), matching the
  pattern the 2026-08-11/14 passes established for this vault.
- Rippled: `Wiki/Concepts/The KPM Control System.md` (shell shipped + approved, the
  `grid-auto-rows: minmax(0,1fr)` definite-height trap, WebAuthn hostname-lock fact),
  `Wiki/Concepts/The Rule That Never Applied.md` (fourth occurrence — a class with no rule at all
  outside its media queries), `Wiki/Concepts/Anti-Recurrence Check.md` (sixth shape — regex anchors
  matching the wrong occurrence, now 4x in a week), `Wiki/Entities/Master Vault Gate.md` (the
  WebAuthn explanation), `Backlog/PC sidebar hover-expand and top panel redesign.md` (marked
  shipped, two of its three open questions answered — the blank-column one explicitly left open),
  `Raw/index.md`, `Wiki/Log.md`.

## Skipped, and why

- "Vault gap curator" (2026-08-15 08:05 WIB) — maintenance session, and produced no vault commit,
  so there was nothing of its own to capture.
- The KPM session's own PROGRESS.md prose beyond the three log entries (the "decisions that
  shipped" reference table, the track-labeling protocol) — already-standing content, not new
  substance from this window.
- 21st.dev "permanent no" — recorded verbatim in the raw source and `Wiki/Log.md`; not given a
  standing page for one closed yes/no decision.

## Deviation from CLAUDE.md worth naming

No `Wiki/Summaries/` page, consistent with the pattern the last three passes settled on: this
window's substance is reusable lessons (CSS traps, an audit-check discipline, an auth architecture
fact), which belong on the Concept/Entity pages that already own those topics, not in a fourth copy
of the same 300 words.

## Skill-file edit (Step 3.5, the one allowed exception)

`~/.claude/skills/delegate-coding-task/references/kpm-inventory-facts.md` gained three sections:
regex-anchor-match-counting (the reusable lesson — 4th same-shape occurrence in a week),
biometric/WebAuthn hostname-lock, and the `grid-auto-rows` definite-height gotcha. The first is the
one crossing from "one-off" to "reusable lesson" by the skill's own bar (this exact mistake shape
recurred four times); the other two are concrete, verified, low-risk facts about this codebase —
cheap to add, save a future re-derivation.

No Alucard lesson-candidates proposed this run.

## For Aldi's eyes

Nothing ambiguous this pass — the source was git commits and PROGRESS.md prose he already wrote
and read live. One thing flagged rather than resolved: the Backlog card's "more balance and more
organic" blank-column decision from 08-14 was **not** answered by this round's header work — left
explicitly open in the card rather than assumed closed.
