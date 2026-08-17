# SWEEP — permission rules versus the screen

6 confirmed problems where `firestore.rules` (the server's own rulebook, which cannot be
bypassed) and the app's permission matrix disagree.

⚠️ **Read `Rules draft-and-report process` before touching `firestore.rules`.** That file is a
draft and `allow` lines are never changed silently. Everything below is a report, not a change.

---

## 1. 🔴 HIGHEST — "View only" on customers does nothing for every agent created the normal way

**Where:** `firestore.rules:138`

**In plain English:** the server looks up an employee's permissions using their **raw stored
role tag**. The app looks them up **after translating** old tags into new ones. New agents are
created with the tag `AGENT`, which exists only on the old side. The server looks for a row
called `AGENT`, finds nothing — and its "nothing found" fallback is **`global`**, meaning full
access.

**What happens:** you set FIELD_OPERATIVE to "View only" in Settings → Tiers & Logic. Agent Budi
opens Customers and the screen correctly hides editing. Meanwhile the server would let Budi
**create and update every customer in the company** — price tier, region, credit terms — with
one direct call. Same hole for the tags `Motorist`, `Canvas`, `Salesman`, `ADMIN`, `DEVELOPER`,
and for any tier whose row was deleted in Settings.

**The checker verified the trap closes by itself:** the tier dropdown that would let you fix the
tag never contains `AGENT` as an option, so an untouched dropdown saves the literal `AGENT`.

**Smallest fix:** do the same old-tag translation inside the rules before the lookup, **and make
the no-match branch deny instead of defaulting to `global`.**

---

## 2. 🔴 HIGHEST — Anyone with a Google account can claim your employee's email before they log in

**Where:** `firestore.rules:214`

**In plain English:** the rule that lets someone create an employee record only checks that the
record points at *their own* account. **It does not check who the record is for.** The record is
named by email address, and that name is unconstrained.

**What happens:** an attacker signs in with any Google account and creates the record
`employee_directory/newhire@kpm.com` pointing at themselves, with role ADMIN. When the real
`newhire@kpm.com` signs in, the app reads that record and **points them at the attacker's
vault** — every sale, customer and EOD they enter lands in the attacker's data.

**And you can never fix it from inside the app:** creating the record fails (it exists), and
updating it requires being the account it already points at — the attacker.

**Note:** a previous change closed this hole for *updating* and left it open for *creating*.

**Smallest fix:** require the record's email to be one the caller is entitled to write — either
their own signed-in email, or require that they are already an admin of that vault.

---

## 3. 🟠 HIGH — "[GOD] Edit Ranks" can be switched on for any tier, and the server refuses all of them

**Where:** `src/AgentProfileView.jsx:159`

**In plain English:** the button that opens Rank Config is gated by the Settings matrix. The
document it saves to is gated by a rule that **says `allow write: if false`** and falls back to
"vault owner only". The matrix is never consulted by the server.

**What happens:** you turn Edit Ranks ON for AREA_ADMIN. The modal opens. Ranks are edited. Save
→ permission denied. The *loading* side fails completely silently (empty catch), so the screen
may not even show the current values.

**Second, separate problem on the same finding:** an older rule still grants write access on a
**shared, un-tenanted path** to anyone whose role reads ADMIN or COMPANY_OWNER **at any
company**. The app moved off that path already, so it now has zero legitimate writers and
remains a live cross-company write surface.

**Smallest fix:** point the rule at the document the app actually writes, and set the old shared
path to `allow write: if false` since the app only reads it now.

---

## 4. 🟠 HIGH — "[GOD] Promote Agents" shows buttons the server refuses

**Where:** `src/AgentProfileView.jsx:1068`

**In plain English:** Grant Award and profile editing are gated by the Settings matrix. The
award documents have **no create rule at all**, and the career record is `allow write: if false`
— so both fall back to vault-owner-only.

**What happens:** you turn "[GOD] Promote Agents" ON for FLEET_CAPTAIN. The captain grants a
500 XP award and gets **"Failed to grant award: Missing or insufficient permissions."** Same
switch also enables editing another agent's photo and bio, where the rules require a different
permission *plus* a matching location.

**Smallest fix:** give the awards collection an explicit create rule keyed to the same authority
the screen uses — or remove that toggle from the matrix and gate the buttons on the literal
roles the rules actually enforce.

---

## 5. 🟡 MEDIUM — "[CHANGE 9]" did not make Load/Clear Canvas work for a Fleet Captain

**Where:** `firestore.rules:330`

**In plain English:** loading a van's canvas is **one transaction with two writes** — one to
products, one to the agent's record. CHANGE 9 opened the products half for Fleet Captains. The
agent-record half still requires roster-editing rights plus a location match, and roster editing
is **off by default**. Because it is one transaction, half-permission means the whole thing
aborts.

**What happens:** a Fleet Captain selects an agent, enters 50 packs, presses Load — and the
whole thing is denied with a raw Firebase error. The Load and Clear buttons carry no permission
gate at all, unlike the neighbouring buttons which do.

**✏️ Correction from the checker — this matters:** the original claim said CHANGE 9 "achieved
nothing" and handed every Fleet Captain price-editing on the Master Vault. **That is
overstated.** The products rule is an explicitly reasoned decision documented in the rules file,
matching what Area Admin already had — and for a Fleet Captain who *has* been given roster
rights in their own region, CHANGE 9 is precisely the piece that makes the flow work.
Downgraded HIGH → MEDIUM.

**Smallest fix:** pick one — either let Fleet Captains write the agent record so the transaction
can finish, **or** gate the Load/Clear buttons behind the fleet-edit permission and revert
CHANGE 9. Do not leave products open to a role that still cannot complete the operation.

---

## 6. 🟢 LOW — Rules and app disagree on which customer flag wins when a tier has more than one

**Where:** `firestore.rules:142`

**In plain English:** the app checks the flags in the order *global → own region → view only*,
under a comment saying **"Order matters here — do not flip it"**. The rules check them in the
**exact opposite order**, under a comment claiming they mirror the app "exactly".

**What happens:** a tier holding both "edit globally" and "view only" resolves to **full edit
rights in the app and a hard deny on the server** — or the reverse for an admin.

**Correctly scoped as latent:** today's Settings screen strips the other flags before saving
one, so only a hand-edited, restored or migrated permission record can hold two.

**Smallest fix:** flip the rules to the same order as the app, or make both sides insist on
exactly one flag.
