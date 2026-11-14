# SWEEP — agent profile, ranks and awards

## Settled 2026-11-14 - the 4 ❔ lines, read in today's code by Antigravity

Source: kpm commit bf2018d7 (.claude/ANTIGRAVITY-TASK.md). Claude spot-checked 4 of the 38 in the code on 2026-11-14 (App #11, App #13, History #5, Map #8): all 4 held. These answers replace the ❔ marks in the block below.

| Finding | Answer | file:line | One sentence |
| --- | --- | --- | --- |
| #2 | OPEN | `src/AgentProfileView.jsx:442-563` | `(transactions \|\| []).forEach` clamps `Math.max(0, titipIssued - titipCollected)` at `:562`, so unpaid consignment debt older than the 7-day feed vanishes and out-of-window repayments can zero the headline. |
| #3 | OPEN | `src/AgentProfileView.jsx:587-609` | The `stats` `useMemo` reads `useCareerLedger` and `career?.[activeAgent.id]` (`:587-588`), but its dependency array (`:609`) omits `career` and `useCareerLedger`. |
| #4 | OPEN | `src/AgentProfileView.jsx:282,341,393,637-644` | The rank-up `useEffect` (`:637-644`) runs whenever `canEditProfile` (`:209`) rather than own profile only, and all three `master_owner` writes (`:282`, `:341`, `:393`) still call `setDoc` without `{ merge: true }`. |
| #5 | OPEN | `src/AgentProfileView.jsx:363` | `handleGrantAward` still writes `grantedBy: userId, grantedByName: activeAgent.name \|\| 'Admin'`, storing the vault owner ID alongside the recipient's name. |

## Status, checked against the app 2026-11-08 (Claude, his "check the notes, fixes and test it yourself")

✅ fixed 1 · 🔴 still open 0 · ❔ not confirmed 4 (that code was rewritten since August; it needs a read before anyone calls it fixed or open).
Tested: all 16 self-check suites pass (logicFixes 2836/2836 holds a check for every ✅ that names a section).

- 1 ✅ A1, fd562f4 (rank in XP units)
- 2 ❔
- 3 ❔
- 4 ❔
- 5 ❔

---

5 confirmed problems in `src/AgentProfileView.jsx`.

*(Two more findings in this file are about permissions and live in
`SWEEP - permission rules versus the screen.md`.)*

---

## 1. 🔴 HIGHEST — Almost every agent is instantly maximum rank

**Where:** `src/AgentProfileView.jsx:557`

**In plain English:** there are two ways to compute an agent's experience points. The new one
(the career ledger) is **off by default** — nothing ever switches it on unless you click the
toggle in Settings. So the app uses the old one, which is **rupiah of sales**. But the rank
ladder in that same file was rescaled into XP units for the *new* method — and XP numbers are
about 100,000× smaller than rupiah.

**What happens:** an agent who sells **Rp 300.000 in a week** scores 300.000 "XP" against a
Mythic threshold of 250.000, hits **"MAXIMUM RANK REACHED"**, and the app then stamps Mythic's
frame permanently onto his record. **A veteran and a first-week trainee both read Mythic.** The
entire rank system is meaningless as shipped.

**The checker confirmed this end to end** and *raised* it back to HIGHEST — including checking
that no guard, cap, or other code path corrects it anywhere.

**Smallest fix:** divide the old branch by the rupiah-per-XP rate so both methods produce the
same unit. The correct function already exists at `src/config/career.js:83`.

---

## 2. 🟠 HIGH — "Consignment Risk (Titip)" reads Rp 0 for any debt older than a week

**Where:** `src/AgentProfileView.jsx:530`

**In plain English:** the outstanding-consignment figure is built from the 7-day live feed, and
then clamped so it can never go below zero.

**What happens:** an agent leaves Rp 5.000.000 of Titip at Toko Sari on Aug 5. On Aug 17 the
"Consignment Risk (Titip)" card reads **Rp 0** — the debt simply fell out of the window.

**It is worse than a stale number — the same card contradicts itself.** A payment against an
out-of-window debt still counts as *collected*, driving the headline to zero, while the
breakdown list right below it keeps listing the store as owing money. Neither has a "last 7
days" label on it.

**Smallest fix:** read the outstanding figure from the career ledger or a dedicated unbounded
query, not the 7-day feed. Drop the "never below zero" clamp so an impossible negative shows up
instead of hiding.

---

## 3. 🟡 MEDIUM — The XP number never updates when the career data arrives

**Where:** `src/AgentProfileView.jsx:590`

**In plain English:** the block that computes XP and rank reads the career data, but the career
data is not in its list of things to watch. The career data arrives from the server *after* the
screen first paints.

**What happens:** with the ledger toggle ON, the profile opens showing **0 XP and bottom rank**,
and stays there. Meanwhile the badge cards two panels down read the same career data directly
and show the real, non-zero progress. **One screen, two contradictory numbers from the same
source** — and the automatic rank-up write fires against the wrong tier while it lasts.

**Smallest fix:** add `career` and `useCareerLedger` to the dependency list at line 590.

---

## 4. 🟡 MEDIUM — Just *opening* an agent's profile writes to that agent's record

**Where:** `src/AgentProfileView.jsx:618`

**In plain English:** a rank-up effect fires on render whenever the stored rank differs from the
computed one. Clicking through eight agents in the sidebar issues **eight database writes
nobody asked for**.

**Worse for the owner's own record:** three places (rank border, avatar, bio) save with a
*whole-document replace* rather than a merge, writing the screen's cached copy back over
whatever is in the database.

**What happens (the strongest case the checker confirmed):** those three lines are the **only**
writers of the `master_owner` record in the entire app. If that record does not exist yet, a
placeholder invented in code — location "Headquarters", a default payment list, roster editing
turned on — gets written as if it were real, authored data.

**✏️ Correction:** the original "your phone overwrites what you changed on the laptop" story is
weaker than stated. The agent list is live, so the phone normally holds fresh data. It is a
race, not the everyday case.

**Smallest fix:** add `{ merge: true }` to all three saves, and only fire the rank-up write when
the agent is looking at their own profile.

---

## 5. 🟡 MEDIUM — Every award records the recipient as the person who granted it

**Where:** `src/AgentProfileView.jsx:357`

**In plain English:** the award saves `grantedBy` as the vault ID — the same value for every
award in the company — and `grantedByName` as **the agent receiving it**.

**What happens:** grant Budi a 500 XP award and the permanent career record says **Budi granted
it to Budi.** Awards feed bonus XP, which drives rank, so the one field that would let anyone
audit an inflated rank is wrong on every row ever written. And awards cannot be edited or
deleted by rule, so the bad value cannot be corrected without owner-level access.

**Smallest fix:** `grantedBy: user?.uid`, `grantedByName: user?.displayName` — the granting user
is already in scope in that component.
