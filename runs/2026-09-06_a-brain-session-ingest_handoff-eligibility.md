---
title: "Run log — a-brain-session-ingest, 2026-09-06"
description: Eighth partial pass. The self-ingest captured the morning's taste and decision but not its engineering — the eligibility predicate, the new matrix key, and the demo's real blocker.
type: run-log
created: 2026-09-06
updated: 2026-09-06
tags: [runs, ingest, kpm]
---

# Run: a-brain-session-ingest, 2026-09-06

## How the gap was found

Same method: pair the two git logs. The difference this run is that the gap was **thematic, not
chronological**. The vault's own commits do cover 2026-09-06 — `54d4a33` (07:25) is the approval
brainstorm, `ba42702` (08:00) adds the picker reversal to Aldi's Design Taste and the Option B
decision. But both are about *what he decided*. Nothing in `Wiki/` held what was *built*:

| KPM commit | Time (WIB) | Covered before this run? |
|---|---|---|
| `dace958` | 07:22:59 | Only as a one-line mention inside the Brainstorm page |
| `fd0166c` | 07:26:25 | No |
| `48f5b10` | 07:27:16 | graphify rebuild, nothing to ingest |
| `43cd4f3` | 07:59:50 | As taste (why he reversed it), not as engineering |
| `952b0ca` | 08:02:34 | **No — lands after the last vault commit (08:00:41)** |
| `dd5639a` | 08:02:45 | graphify rebuild |

## Ingested

- **Raw:** `Raw/2026-09-06_source_kpm-handoff-eligibility-and-demo-blockers.md` — the five commit
  messages, unedited.
- **Summary:** `Wiki/Summaries/The Shorter List Was Never the Eligible One.md`.
- **Rippled:** `Wiki/Concepts/UI-Says-Yes-Server-Says-No Pattern.md` (the version where the server
  check did not exist at all, plus the one-predicate-two-call-sites fix shape);
  `Wiki/Entities/Tier System.md` (absence-means-tier-default for new matrix keys; `UNASSIGNED` is
  not a region); `Wiki/Entities/Firestore Rules.md` (the demo was unreachable, not exposed —
  added forward, the 2026-09-05 claim left standing); `Wiki/Concepts/Ownership Moves, History Does
  Not.md` (who may receive it, and the still-unbuilt approving half).
- **Indexes:** `Wiki/Index.md`, `Wiki/MOC.md`, `Wiki/Summaries/index.md`, `Raw/index.md`,
  `Wiki/Log.md`, `runs/session-ingest-state.md`.

## Skipped, and why

- Everything through 2026-09-05 — covered by the previous run and by the session's own self-ingest.
- `Wiki/Concepts/Aldi's Design Taste.md` — the session already wrote the reversal entry itself
  (`ba42702`); adding a second account of the same words would duplicate, not ripple.
- The Brainstorm page — it is current and correct; the Summary links to it rather than restating it.
- Vault gap curator and this task's own runs.
- `Inbox/` — holds only `index.md`.
- `Wiki/graphify-out/` shows as modified in `git status`; that is a graph rebuild, not content.

## Skill-file edit — named, not buried

`C:\Users\ASUS\.claude\skills\delegate-coding-task\references\kpm-inventory-facts.md` gained a new
section before "The single most recurring bug class": **a new `ROLE_PERMISSIONS` key is ABSENT from
the live matrix — never read absence as "no."** Plus the two adjacent traps from the same fix
(`UNASSIGNED` is not a region; don't overload one absent field to mean two things).

This one clears the "real, verified fix" bar the 2026-09-05 run correctly refused to clear: it
shipped (`dace958`), the checks went 1035 → 1060 green, and it was trialled red twice. It will
recur on the very next matrix key anyone adds — which is the reusable-lesson test.

## No Alucard lesson candidates proposed

Nothing here belongs in Alucard's lessons. `runs/lesson-candidates.md` was not created.

## For Aldi's eyes

- 🔴 **Two settings, both yours, neither is code.** `kpm-ang.vercel.app` returns 302 to
  `vercel.com/sso-api` — Vercel *Deployment Protection* is turning away everyone not signed into
  your Vercel team. That is why your friends saw nothing. Turn it off and the app is genuinely
  public, at which point the drafted-not-deployed hand-off write rule is the only thing left
  between a real agent and editing transactions they did not make.
- ⚠️ **Neither hand-off change has been seen by human eyes.** Both commits say so plainly: the
  picker is behind Firebase auth inside a selected consignment store. 1073 green checks prove the
  logic, not the screen.
- ❓ Still carried over from 2026-09-05 and still unanswered: does a later `CONSIGNMENT_PAYMENT`
  also enter the sales rollup? If it does, Product Performance is double-counting today.
