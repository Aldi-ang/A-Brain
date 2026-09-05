---
title: "Run log — a-brain-session-ingest, 2026-09-05"
description: Seventh partial pass on the long-running KPM session. Captured the four morning commits the self-ingest missed — the Product Performance rollup trace and the Vercel demo.
type: run-log
created: 2026-09-05
updated: 2026-09-05
tags: [runs, ingest, kpm]
---

# Run: a-brain-session-ingest, 2026-09-05

## How the gap was found

Not by reading transcripts — by pairing the two git logs. The working session self-ingests as it
goes, and every KPM commit through `efcfc33` (2026-09-05 09:10:10) has a vault commit within a
minute of it (`ea4ad74` → `c5648ad`). The vault's last commit of the day is `c5648ad` at 09:10:30.
Four KPM commits land after it and stop:

| KPM commit | Time (WIB) | Subject |
|---|---|---|
| `610f02c` | 09:13:39 | quota reporting leads with the 5-hour window |
| `c739608` | 09:31:46 | bug 2 is a rollup change, not a panel change — traced, scoped, not started |
| `0b947f8` | 09:46:08 | branch pushed for a Vercel demo, with the signup check that made it safe |
| `2906294` | 09:52:36 | the demo link is `kpm-ang.vercel.app`, aliased to the branch not production |

## Ingested

- **Raw:** `Raw/2026-09-05_source_kpm-rollup-scope-and-vercel-demo.md` — the four commit messages
  and the `PROGRESS.md` / `NEXT-SESSION.md` text they added, unedited.
- **Summary:** `Wiki/Summaries/The Panel That Never Reads a Transaction.md`.
- **Rippled:** `Wiki/Concepts/A Rollup Is a Cache, Not a Ledger.md` (new 2026-09-05 section on the
  dimension that was never recorded, and the historical-document trap);
  `Wiki/Entities/Firestore Rules.md` (new section: a public demo URL makes the drafted-not-deployed
  hand-off rule concrete, and what actually protects the demo is the absence of self-signup).
- **Indexes:** `Wiki/Index.md`, `Wiki/MOC.md`, `Wiki/Summaries/index.md`, `Raw/index.md`,
  `Wiki/Log.md`, `runs/session-ingest-state.md`.

While updating `Raw/index.md` I noticed the 2026-09-03 source file had never been listed there.
Added it, with a note saying when and why — the file itself is untouched.

## Skipped, and why

- All 2026-09-04 work (rail-key sound from Aldi's own recording, the one-palette field terminal,
  the three ponder sweeps, the four Backlog candidates) — already self-ingested, vault commits
  `038bd95` → `ed080f9` pair with their KPM counterparts.
- All 2026-09-05 work before 09:13 (hand-off build, the live test, the four faults, the approval
  matrix, the region lock) — self-ingested, vault `c059684` → `c5648ad`.
- Vault gap curator and this task's own earlier runs — their writes *are* the vault.
- `Inbox/` — holds only `index.md`, nothing to process.

## Skill-file edit: NONE this run — named explicitly

The rollup trap ("adding a dimension makes every historical document answer a question it was
never asked, confidently and with no error") is a strong candidate for
`delegate-coding-task/references/kpm-inventory-facts.md`. **It was not added**, because bug 2 is
*traced*, not built — the rule is "a real, verified fix," and nothing here has shipped or been
proven. It is recorded in the Summary and in `Wiki/Log.md`, and should go into the skill file the
moment bug 2 actually lands. Flagging the judgment rather than making it silently.

## No Alucard lesson candidates proposed

Nothing in this material belongs in Alucard's lessons. `runs/lesson-candidates.md` was not created.

## For Aldi's eyes

- ❓ **Unverified and load-bearing:** does a later `CONSIGNMENT_PAYMENT` also enter the sales
  rollup (`SALE_TYPES`, `salesRollup.js:42-46`)? If a Titip sale books revenue at placement *and*
  its payment books it again, Product Performance is double-counting **today**, and that is bigger
  than the receivable/paid split. The session ran out of budget before checking and correctly
  refused to assume either way. This is the first thing to settle on bug 2.
- ⚠️ The store hand-off write rule is still **drafted, not deployed**. The demo is unaffected
  (no self-signup, so nobody new can get an account), but real agents can still edit or delete
  transactions they did not make at the database level.
