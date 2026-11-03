---
type: concept
confidence: high
checked: 2026-11-03 (kpm c76408e, logicFixes 2661/0, audit 723/0, demoBuild.check pass)
---

# Language Switch (EN / ID per phone)

Hub note: the app shows Indonesian or English per phone, picked in Settings > This device. No stored choice = Indonesian.

Aldi, 2026-11-02: *"we all can see indonesian just add language swapper on the setting, we should make this setting that can be seen by every tiers"* and *"english already correct, make it as second language indonesia on default"*.

## Where it lives

| What | Where |
|---|---|
| The function and every word | kpm `src/config/lang.js` - `tr(en, fill)`, the `ID` list. English is the key. |
| Round 1 words (agreed) | `Raw/2026-11-02-indonesian/` |
| Round 1b board (lines 1-100) | `Raw/2026-11-02-language-switch/words-1b.mjs` -> `words-1b.png` |
| Round 1b frames, built | `Raw/2026-11-02-language-switch/r1b-built-{p,d,s}.png` |
| The guard | kpm `src/config/logicFixes.selfcheck.mjs`, block "EN / ID PER PHONE" |

Rounds: 1 = Sales Terminal (live). 1b = the rest of the terminal, 41 pop-ups, menu, top bar, Settings band (live `c76408e`, 2026-11-03). 2 = Journey. 3 = evening hand-in (EOD). Each round: words board first, his ok, then build.

## Rules (his)

- Display only. A saved value (payment method, visit tag, return reason) never goes through `tr()`; Day Replay and the reports read them back in English.
- No "kamu", no "Anda". "contoh:" not "mis.". One word per idea on sibling labels.
- A word he changes is changed in the board file AND `lang.js` together, by line number.

## Traps found building round 1b (2026-11-03)

1. **A toast's colour comes from its words.** `utils/toastSeverity.js` isFailure() reads the message to pick red edge + error sound + top panel. Translated, four red pop-ups would have gone neutral (both INSUFFICIENT STOCK, HQ Rejected, Visit NOT saved) and a restored draft would have gone red ("belum selesai"). Fix: kurang / menolak / tidak tersimpan added to the regex, "belum selesai" excluded. Now a check: "every translated pop-up keeps its colour" (RED on the old regex named all four).
2. **Demo-only words never go in `lang.js`.** The dictionary ships in every build, so the demo camera text reached the real build and demoBuild.check went red. Both languages sit inside the `IS_DEMO` branch instead.
3. **A util that calls `tr()` reads Indonesian in node checks** (no localStorage there), so checks that pinned its English had to change (dayStats agoLabel, vanBay bundleCheck why).
4. **A placeholder can fool the colour check** - `{error}` reads as the word "error". The check blanks every `{name}` first.

Related: [[Aldi's Design Taste]] (one language per screen, 2026-09-01).
