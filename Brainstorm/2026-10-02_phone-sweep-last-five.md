---
date: 2026-10-02
status: OPEN — waiting on Aldi's pick (board sent 08:50 WIB)
---

# Phone sweep — the five screens it had not reached (2026-10-02)

## The problem, in his words

His standing goal: every panel must work on the phone as well as on the PC (see [[Wiki/Concepts/Aldi's Design Taste]]).
Already swept before this note: agent, customers, eod, fleet, gudang, journey, opname, piutang, places, profile,
sampling, terminal, Master Vault ([[2026-10-02_master-vault-phone]]) and the bell. Not reached: Command Center,
Map System, Reports, Settings, the Leaderboard (Hall of Fame).

## Measured

`Raw/2026-10-02-phone-sweep-rest/ps-measure.mjs` — the real built app (prod-emu build, kpm `3ce869b`) on the emulator,
owner signed in, 390 css with touch via CDP device metrics (never a window crop), each screen walked top to bottom in
viewport frames, plus one 1440 frame. Also measured the panels a phone user opens from them: the Target setup sheet,
the map ≡ menu, Context Analytics, and Settings' Tiers & Logic / Security & Data / Architect sections.
Result files: `ps-result.json`, `ps-result-fame.json`, `ps-result-dashtarget,…json`. Board: `board-phone-sweep.png`.

| Screen | Worst fault on the phone | Also | PC (1440) |
|---|---|---|---|
| 1 Reports (title says TRANSACTIONS) | Context Analytics table: Revenue column off the right edge — scroller 308 < 450 (HistoryReportView.jsx:502, three columns w-1/2 / w-1/4 / w-1/4) | 4 period buttons 29 px tall, "This year" alone on line 2; title vs menu name | all 3 columns, no side scroll |
| 2 Leaderboard (Agent Profile → Leaderboard) | names truncated: "SARI WULAN..." for SARI WULANDARI | `text-emerald-400` money (HallOfFameView.jsx:118), `text-blue-400` count (:122) — palette law | name cut there too |
| 3 Command Center | Cloud / USB / Save point backup buttons 60x32, 43x32, 103x32 side by side | 4.1 screens long; target sheet scrolls itself (maxHeight 90vh, overflowY auto), Save reachable | fine |
| 4 Map System | ≡ menu: "Show All Tiers" bright blue button 211x32 (palette law); tier chips 104x33 | zoom ± 30x30 (pinch covers it); region select 161x32 | fine |
| 5 Settings | nothing broken on the phone: 0 controls under 44 in General & Brand, nothing cut | heading reads "COMMAND CENTER" inside Settings (name clash with the dashboard); bank-details textarea grey-white unlike every other box; Tiers chip row scrolls sideways on purpose (kpm-chips 346 < 867); Architect user rows squeeze "Reset vault tries" to three lines | fine |

Shell controls seen on every screen (already swept, dropped from the lists): the nav handle 14x132, Tutorial 44x36,
light-mode switch 70x36.

Seen in passing (not phone): Reports lists "HEADQUARTERS" and "Headquarters" as two region cards in the test company —
the owner fallback profile is `location: 'Headquarters'` (AgentProfileView.jsx:176), the seeded agents `HEADQUARTERS`.
Not checked on his real data.

## Options — which to fix first

| | Fix | Cost |
|---|---|---|
| A — Reports (my pick) | Revenue column visible at 390 (stack or drop the table's fixed widths), period buttons 44 on one row, title matches the menu | the only phone-only gap that hides money; HistoryReportView.jsx, print layout must not change |
| B — Leaderboard | names wrap instead of truncating; money and count in the app's gold/ink | ~3 lines, but it is not a phone gap (PC cuts the name too) — could ride along with A |
| C — Command Center | backup buttons to 44 | small; the row must stay one line at 390 |
| D — Map | the blue button and chips to slate/gold, chips 44 | small, palette law only |
| E — Settings | rename the heading | wording only |

## Decision

OPEN — waiting on Aldi. No app code before his pick (his diagnose-first rule).

## Rejected on purpose

- Ranking by "how bad it looks" — ranked by what the phone hides that the PC shows, then by who uses it on a phone.
- Treating Settings' length (6.6 screens in General & Brand, 8.4 in Tiers) as a fault — it is long, nothing is
  broken or hidden.

Models applied: Opportunity Cost (each fix delays the next sweep item; the money column wins), Inversion (what would
make the phone worse than the PC — hidden data, not small text).
