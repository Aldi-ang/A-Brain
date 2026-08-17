# SWEEP — 22 claims that got KILLED

These were reported as bugs by one robot and **proved wrong** by a second one whose only job
was to attack them. **Do not chase any of these.** Each line says what was claimed and why it
is not true, so if someone finds it again they can stop in thirty seconds instead of a day.

A few were *technically* true but harmless — those are marked. That distinction matters: a
write-only field that nobody reads produces no wrong number, so it is tidying, not a bug.

---

## 🔄 ONE OF THESE 22 HAS BEEN UN-KILLED

**The excise/cukai refutation below was itself overturned** by a third check on 2026-08-18. It **is**
a real defect, HIGH. The refutation rested on "you can just type the true cost into DISTRIBUTOR
(MODAL)" — and that escape hatch does not exist, because **`App.jsx:2947` uses that same field as the
selling price to Distributor-tier customers**, so raising it would reprice every distributor sale.

**Read `Excise and shipping costs are printed but never counted as cost.md` for the current verdict.**
The text below is kept because its facts are right; only its conclusion was wrong.

**That makes the real score 76 confirmed / 21 refuted**, and it is the single most useful thing this
sweep produced — see the closing section of this file.

---

## ⚠️ THE OVERTURNED ONE

**`Excise and shipping costs are printed but never counted as cost.md`** — the sweep looked at
this and **killed it as a defect.**

The claim was that "True Landed Total" (shipping + cukai + labour) is written on every
production batch and read by nothing but the screen. The facts are right, **but that is the
field doing its job**: it is a document total for the ledger card and the printed GRN, and
nothing in the code presents it as a per-unit cost.

The app's actual cost basis is a separate field that **you type in** — labelled
"DISTRIBUTOR (MODAL)" on the product form. Every cost calculation in the app reads that field.
So no code path computes a wrong number. The claimed under-statement rests on an assumption
about what was typed into that field, not on a code fact.

**Verdict: this is a missing feature (rolling landed cost into a weighted-average cost price),
not a logic bug.** That reframing is worth keeping — but it also means **your open cukai
question still needs answering**, because the answer decides whether the feature is wanted at
all.

**❓ ANSWER NEEDED:** should excise (cukai) count as part of the cost of goods, or is it tracked
separately on purpose? If it is deliberate, the printed note should stop calling it "TOTAL
LANDED VALUE".

---

## Killed because the person who would trigger it cannot reach the button

| Claim | Why it died |
|---|---|
| An agent with the vault open can submit an EOD cash report that notifies nobody | A field agent has **no path** to the admin flag. All three ways to open the master-password box need permissions only Tier 1/2 have. And for those who *can*, the notification is addressed to admins — i.e. themselves — so the skip is the deliberate "don't ring my own bell" guard. |
| Every map write uses the logged-in person's vault while the customer list came from the boss's | **Refuted at the root.** The app builds a special user object at login that forces the boss's vault ID, with a comment saying so. The map already receives the boss's vault. The similar bug in the sales screen was different — that component got a *separate* ID prop, not the user object. |
| Store-pin permission is decided by a hand-written role check that skips the matrix | The escape hatch it depends on is **dead code** — it checks a `tier` field that nothing in the app ever sets. The only reachable path is the admin PIN flag, whose holders the rules already fully permit. |
| Tier 1 DEVELOPER / COMPANY_OWNER get god-mode UI with no server standing | **That tag cannot be produced.** The tier dropdown filters those three values out, DEVELOPER isn't in the tier list at all, core tiers can't be renamed to them, and new tiers get generated IDs. Everyone who really reaches Tier 1/2 is already covered by the rules. |
| Stock Opname review is keyed to "ADMIN" so a Company Owner can never approve a count | The company owner **is** "ADMIN" on the client — login converts the role. The narrowing is a deliberate, commented fix. |
| Master Vault product create/delete offered by the matrix, refused by the rules | The matrix toggle **never surfaces an Add Product button** — create, edit and delete are all behind the PIN flag, not the matrix. The screen isn't half-alive. |
| The rules read the employee's role from a different document than the app does | Both named consequences die on the code. The boss branch never consults a role-based rule at all, and the one place that writes the role writes **both** documents in a single atomic batch, so they cannot drift. |

---

## Killed because the value is written but nobody reads it — no wrong number results

| Claim | Why it died |
|---|---|
| The field recording which agent owns a store is written and read by nothing | The claim's own example is **backwards** — that line writes the *new* owner's name, not the old one. Ownership really comes from fields the same batch updates correctly. Dead field, not a defect. |
| A transferred store keeps pointing at the old agent's ID | Three hits repo-wide, **all writes, zero readers**. Nothing behaves wrongly today. The claim concedes this itself. |
| `baseThrough` is written by the career backfill and read by nothing | Same shape. The claimed harm is "a check that would have caught two other bugs" — that is a missing feature, not a defect. And one of the two bugs it would guard is itself unreachable. |
| Every stock request carries a `unit` field no arithmetic reads | True but harmless — **everything is packs today**. The input is labelled "Qty (Bks)" and the one external consumer sums it as packs. The claimed harm is conditional on a unit dropdown that does not exist. |
| True Landed Total is written and read by nothing but the screen | See the box above — it is a document total doing its job. |

---

## Killed because the numbers were checked and are correct

| Claim | Why it died |
|---|---|
| Consignment returns credit the vault 1 pack per Bal instead of the whole Bal | The function is **never called** — the prop is passed and destructured but never invoked. And even if it were, every consignment item is converted to packs *before* it leaves that screen, which is exactly why `× 1` is correct there. `× 1` is the convention for "already in packs", not a missing multiplier. |
| Deploying a sample from a Karton line deletes whole cartons of stock | **No writer can create a non-pack van line.** Every path hardcodes packs, so the missing Karton branch falls through to `× 1`, which is the correct multiplier. Real as text, unreachable as a failure. |
| Transaction totals summed three different ways, and one does no number conversion | **The named line is the app-wide convention, not the outlier** — six other files do exactly the same. Every writer stores a number. No file produces the claimed string concatenation. |
| The XP on the verified EOD report is bigger than the XP the career total gains | The arithmetic difference is real, **but nothing displays either number.** No screen reads them, so nothing "says 87" while the career rises 75. The omission is also defensible — the missing part is capped per day, and that cap can't be rebuilt from lifetime totals. |
| EOD stock return reads packing ratios from the cached list, not the document it just read | The comment directly above says why: ratios always come from the master product, because **branch inventory documents don't carry those fields**. The proposed fix would break the branch path. |
| EOD verification picks the warehouse from a list read outside the transaction | The gap the claim needs is closed by a human confirmation dialog that runs first, and the load order runs the opposite way to what was claimed. |

---

## Killed because the scale required cannot happen

| Claim | Why it died |
|---|---|
| Career backfill splits an increment and its guard flag into two batches | **Needs ~150 agents migrating in one run.** Each agent's three operations are contiguous and the batch only breaks at 450 operations or 8 MiB; these payloads are a few hundred bytes. Below that it is one atomic commit. |
| Restoring a backup collapses records without an ID onto one document | **No build in this repo produces an ID-less record** — every listener stamps the document ID. Needs a hand-edited or foreign file. |
| Accepting a hand-off never checks who is accepting or what state it's in | The checks are missing, but the Accept button is only rendered from a list already filtered to *you* and *pending*. A double-tap writes the same value to the same document. Only a duplicate notification survives. |

---

## Killed because the code does the opposite of what was claimed

| Claim | Why it died |
|---|---|
| Product dimension save swallows every error after showing it as saved | **That function is dead code** — one hit repo-wide, its own definition. The live screen passes its own handler that awaits the write, confirms on success and reports failure. The opposite of the empty catch described. |

---

## The lesson worth keeping

Nine of these twenty-two died the same way: **the code was written wrong, but nobody can reach
it.** Dead functions, unreachable roles, values that can only be one thing in practice.

That is why the attack step exists. Without it this list would have been 97 "bugs" and you
would have spent weeks on twenty-two of them.

It is also why the *reverse* mistake is dangerous — see
`Wiki/Concepts/Anti-Recurrence Check.md`, ninth shape: **a verifier that dies and gets scored as
a successful refutation.** That happened earlier in this same review. "Refuted" and "never
checked" must never be allowed to look alike.

## 🔴 AND THE BIGGEST LESSON, FOUND BY ACCIDENT

While testing whether a cheaper model could do the checking, three claims were re-verified by the
**same model that checked them the first time**, on the same code, with a comparable prompt.

**It disagreed with itself on all three.** One was a straight verdict reversal (the excise item above,
refuted → confirmed). Two were severity changes of two full steps.

Not because the first pass was careless — every fact it cited was true. **Because each pass found one
extra fact the other missed**, and that one fact flipped the conclusion:

| Claim | What pass 2 found that pass 1 did not | Effect |
|---|---|---|
| Excise / landed cost | `priceDistributor` is also the Distributor **selling** price | the "just type it in" fix is blocked → real defect |
| Branch shipping | photo upload is a no-op by default; **offline persistence** is the real window; 4 other files share the flaw | HIGHEST → MEDIUM, and it is a pattern not a site |
| Double confirm receipt | the button only renders while status is IN_TRANSIT | HIGH → LOW |

**So: a single verification pass is evidence, not proof.** For anything that moves money, check it
twice with independent attention — or reproduce it once by hand, which is cheaper and more certain
than any number of passes.
