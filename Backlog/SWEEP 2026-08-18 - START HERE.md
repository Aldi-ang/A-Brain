# SWEEP 2026-08-18 — START HERE

**The robot sweep finished. It found 75 real problems and killed 22 false alarms.**

Every one below was found by one agent and then attacked by a second agent whose only job
was to prove it wrong. The 75 here survived that attack. The 22 that did not are written up
separately in `SWEEP - 22 claims that got KILLED.md` — read that one too, so nobody wastes a
day "fixing" something that was never broken.

Nothing in the app has been changed. This is a list, not a repair.

---

## How to read this

- **HIGHEST** = money or stock goes wrong and nobody can see it happening.
- **HIGH** = wrong numbers a person could eventually notice.
- **MEDIUM** = wrong, but it needs bad luck or it only misleads a screen.
- **LOW** = untidy, wrong in a corner, or dead code.

The severity shown is the **corrected** one. Where the attacking agent proved a finding was
less scary than it first looked, that lower rating is the one written here — a downgrade is
information, not a demotion.

---

## 🔴 THE EIGHT THAT MOVE MONEY OR STOCK SILENTLY

| # | What breaks | Where |
|---|---|---|
| 1 | Every agent is instantly max rank, because rank is measured in rupiah but compared against XP | `AgentProfileView.jsx:557` |
| 2 | Fulfilling an IOU turns the rest of the basket into Cash, so a credit sale exists nowhere | `MerchantSalesView.jsx:930` |
| 3 | A buyback pays the store and never puts the goods back into stock | `useTransactionEngine.js:163` |
| 4 | Saving a sector's settings never reaches the database at all | `MapMissionControl.jsx:611` |
| 5 | The "Pricing Tier" box on the new-store form writes a *game rank* into the *price* field | `MapMissionControl.jsx:1869` |
| 6 | Shipping to a branch overwrites HQ stock with a number the screen cached minutes ago | `BranchWarehouseManager.jsx:294` |
| 7 | The "view only" customer lock does nothing for every agent created the normal way | `firestore.rules:138` |
| 8 | Anyone with a Google account can claim your employee's email before they log in | `firestore.rules:214` |

Details: files below, grouped by screen.

---

## Where the details live

| File | Screen | Count |
|---|---|---|
| `SWEEP - the sales terminal.md` | Merchant Sales + the sale engine | 14 |
| `SWEEP - the map screen.md` | Map Mission Control | 14 |
| `SWEEP - App.jsx admin handlers.md` | Master vault, EOD verify, backups, sampling | 15 |
| `SWEEP - history reports and audit vault.md` | History Report + Audit Vault | 8 |
| `SWEEP - agent profile ranks and awards.md` | Agent Profile | 6 |
| `SWEEP - warehouse and restock.md` | Branch Warehouse + Restock Vault | 7 |
| `SWEEP - permission rules versus the screen.md` | firestore.rules vs the UI | 5 |
| `SWEEP - 22 claims that got KILLED.md` | false alarms, do not chase | 22 |

---

## ❓ ONE THING THE SWEEP COULD NOT CHECK

The robots read the code. **They never ran the app.** Nothing here was reproduced against a
real database. Two of them said so explicitly: *"Nothing was executed: no emulator run, no
browser, no test."*

So before fixing any HIGHEST item, it is worth reproducing it once by hand. The write-ups all
name the exact steps.

---

## 🔴 DECIDE — what order do you want these fixed?

Three sensible orders. Pick one and I'll work through it:

- **A. Money first** — the eight above, in the order listed. Slowest, safest.
- **B. One screen at a time** — clear the sales terminal completely, then the map, then the
  rest. Fewer half-finished screens, but a HIGHEST bug on the map waits its turn.
- **C. Cheapest first** — the one-word and one-line fixes (there are about nine), to shrink
  the list fast before the hard ones.

My recommendation is **A**, because five of the eight quietly change numbers you bill or pay
on, and every day they run is another day of data you cannot trust afterwards.

---

*Source: workflow run `wf_dc12c56c-e08`, 14 agents, 20,080 lines of code read, 0 errors.*
