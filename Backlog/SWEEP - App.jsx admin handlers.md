# SWEEP — App.jsx admin handlers

18 confirmed problems in `src/App.jsx` — the master vault, EOD verify, store hand-offs,
backups, sampling and the delete tools.

Ranked. Severity is the corrected one.

---

## 1. 🟠 HIGH — Damaged goods at EOD are credited with no unit conversion

**Where:** `src/App.jsx:1842` (and `:1840`, `:1856`)

**In plain English:** inside the same EOD verification, good stock coming back is converted
from Bal/Slop/Karton into packs at line 1812. Twenty-six lines later, damaged stock is **not**
— it is added straight in, whatever unit it was in.

**What happens:** an agent returns **2 Bal** of crushed packs. The Quarantine Vault is credited
**2 instead of 400**. The notification then reports the same wrong sum labelled "Bks", so the
admin is told 2 packs entered quarantine. The unit is thrown away at the moment of writing, so
nothing downstream can recover the real figure.

**Smallest fix:** wrap the quantity in `convertToBks(item.qty, item.unit, masterProduct)` —
`masterProduct` is already in scope four lines above. Do the same for the notification total.

---

## 2. 🟠 HIGH — A store hand-off finds the store by **typing its name**

**Where:** `src/App.jsx:1628` (and `:1634`)

**In plain English:** the transfer request stores only the store's *name*, no ID. On approval
the code reassigns **every** transaction whose customer name matches that text, and picks
whichever customer record sorts first.

**What happens:** two outlets called "Toko Jaya" — one in Surabaya (agent A), one in Malang
(agent B). You approve the hand-off of the Surabaya one to agent C. **Agent B's Malang sales
are reassigned to C as well** — B loses his receivable, C is credited with debt he never
carried. The duplicate-request guard compares the same name string, so it also blocks a
legitimate transfer of the second shop while the first is pending.

**Smallest fix:** store `customerId` on the request and match on that, falling back to the name
only for old requests.

---

## 3. 🟠 HIGH — Delete from the history screen silently deletes **nothing** for a delegated admin

**Where:** `src/App.jsx:2613` (and `:2627`, `:2646`)

**In plain English:** the ledger is read from the *boss's* vault. The three delete handlers
write to the *logged-in person's own* vault. For anyone who is not the company owner, those are
two different places.

**What happens:** a delegated admin deletes a duplicated Rp 5.000.000 sale. Firestore accepts a
delete on a document that does not exist and reports success. They get "Transaction record
removed.", "Deleted 12 records", and an audit entry is written — **and the sale is still in
every report after refresh.** The count in the toast is taken from the boss's collection, so it
states a number of records it never touched.

**The checker specifically tried to kill this on permissions and could not** — a catch-all rule
grants the write, so the delete is *accepted*, just against nothing.

**Smallest fix:** use the already-resolved vault ID (`userId`) instead of `user.uid` in the
three paths, matching every other transaction reference in the file.

---

## 4. 🟡 MEDIUM — "Transfer Complete" bells are sent before the money actually moves

**Where:** `src/App.jsx:1641` and `:1653`

**In plain English:** both notifications are written to the database **immediately**. The
status change and every reassignment are only queued, and committed afterwards. Nothing deletes
the bells if that commit fails.

**What happens:** the commit fails (offline, quota, anything). The clicker sees "Failed:". But
both agents now have a permanent notification saying the store moved, while the request is
still PENDING. Andi starts servicing a store that was never transferred; Budi is told he lost a
store he still owns.

**⚠️ The checker refuted the scary half of the original claim.** It was reported as HIGHEST on
the grounds that most approvers would be rejected by the rules. That is wrong — every route to
the approve button is owner-tier only, and those people *are* allowed to write. **The ordering
bug is real; the "anyone can trigger it" part is not.** Two separate agents found this
independently, one rating it MEDIUM and one LOW.

**Smallest fix:** queue the two notifications into the same batch as the reassignment, so they
commit or fail together — the way EOD verification already does.

---

## 5. 🟡 MEDIUM — Approving a hand-off only reassigns the last **7 days** of debt

**Where:** `src/App.jsx:1628`

**In plain English:** the list the code filters is not the transaction collection — it is a
live feed hard-limited to the last seven days. Anything older is not in it.

**What happens:** Toko Berkah owes Rp 4.000.000 on a Titip written 20 days ago and Rp 500.000
from Tuesday. You approve the hand-off from Budi to Andi. The toast says "Transfer complete!
Debt reassigned." Only the Rp 500.000 moves. The Rp 4.000.000 is still tagged to Budi in the
database, visible whenever anyone pulls the archive.

**Downgraded from HIGH** because the receivables screen is fed the same 7-day list, so the old
debt is not sitting visibly on Budi's screen — it is wrong in the data, not on the page.

**Smallest fix:** query the collection directly inside the handler. The unbounded fetch helper
already exists (`useDatabaseSync.js:147`).

---

## 6. 🟡 MEDIUM — Editing a product's price rewrites its stock to whatever it was when the box opened

**Where:** `src/App.jsx:2809`

**In plain English:** the edit form takes a frozen copy of the product when you tap Edit, and
sends the **whole object back** when you save — including the stock number, which nobody
touched.

**What happens:** you open Edit on Sampoerna at 09:00 (stock 1000), change only the Grosir
price, save at 09:20. In those 20 minutes the vault sold 300 packs. The save puts stock back to
1000. **300 packs that were physically sold reappear in the vault**, and the success message
confirms "Stock 1000 Bks".

**Smallest fix:** drop `stock` from the payload on the edit branch, or send it as a difference
rather than an absolute value.

---

## 7. 🟡 MEDIUM — Verify EOD fails forever if a damaged-goods ticket's sale was deleted

**Where:** `src/App.jsx:1851`

**In plain English:** the verification updates the original sale document for every damaged
ticket, without first checking the sale still exists. Firestore aborts the whole transaction
when you update a missing document.

**What happens:** an agent submits Monday's EOD listing damaged goods from sale ABC. An admin
deletes ABC on Tuesday. Wednesday's Verify EOD rolls back **everything**: the stock never
returns to the vault, the van is never cleared, career is never credited, the report stays
PENDING, and the only message is "Verification failed: No document to update". Retrying gives
the same result every time.

**Downgraded from HIGH** because there is an escape — deleting the report lets the agent
resubmit without the dead ticket.

**Smallest fix:** read each sale inside the transaction and skip the ones that are gone.

---

## 8. 🟡 MEDIUM — Import Shared Config overwrites live stock levels with the sender's

**Where:** `src/App.jsx:3376`

**In plain English:** the export file contains the whole product list **including stock**, and
the import does a full document replace, not a merge.

**What happens:** a new franchisee imports the head-office config to get the catalogue and
prices. Every one of their real warehouse counts is replaced by head office's counts, along
with minimum-stock levels and pack sizes. The toast says "Config Imported! Welcome to the
team."

**Downgraded from HIGH** because the confirmation does warn it will "overwrite your current
Product List" — the understatement is that stock counts ride along inside "Product List".

**Smallest fix:** merge instead of replace, and strip `stock` / `minStock` / `damagedStock`
from each item. A config share is a catalogue, not a stock take.

---

## 9. 🟡 MEDIUM — Changing the master password silently deletes every registered fingerprint device

**Where:** `src/App.jsx:916`

**In plain English:** fingerprint devices are stored in the same document as the PIN. The
change-PIN save replaces that whole document instead of merging into it.

**What happens:** you register your phone and your laptop, then use Settings → Change PIN. The
device list is gone. The Settings screen still lists both devices until you reload, and the
next fingerprint attempt fails on a device you can see listed as authorised.

**Smallest fix:** add `{ merge: true }` to that one save. One argument.

---

## 10. 🟡 MEDIUM — The backup lights turn green before any file has been saved

**Where:** `src/App.jsx:530`

**In plain English:** the three downloads are scheduled for later, and then — in the same
instant, before any of them run — the code stamps the backup time, turns all three safety
indicators green, and writes an audit entry saying "Triple Redundancy executed".

**What happens:** Chrome blocks the 2nd and 3rd programmatic download ("this site attempted to
download multiple files") and you click Block. You see three green lights, the vault reports
itself protected for the next 7 days, and the audit log says the backup ran — with at most one
file on disk. **This is the one indicator that tells you whether your data survives losing a
device.** The single-backup button has the same shape.

**Smallest fix:** wait for each download and only light the indicator for the ones that
actually happened.

---

## 11. 🟡 MEDIUM — The recovery code is generated and checked inside the browser, so it is not a real second factor

**Where:** `src/App.jsx:1086`

**In plain English:** the 6-digit code is made in the page, kept in the page's memory, and
compared against itself. The only real check is the secret word.

**What happens:** anyone past the secret word can read the code out of the browser's developer
tools, or simply skip the comparison, and never needs to receive the email. Whoever completes
that flow **rewrites the master password for the whole company vault**.

**Separately:** the email send passes no recipient at all — only the code — so it goes wherever
the template hardcodes it, not to the account being reset.

**Smallest fix:** generate and verify server-side. At minimum, pass the account's email as the
recipient and store the code hashed with an expiry instead of in page memory.

---

## 12. 🟡 MEDIUM — Two "delete ALL" actions only touch the last 7 days, then report a count

**Where:** `src/App.jsx:2624` and `:2635`

**In plain English:** both promise "ALL" and both filter the same 7-day live feed.

**What happens:** "Delete ALL history for X?" deletes only this week's rows. A Titip from three
weeks ago survives, so the customer still shows an outstanding balance after you were told the
account was cleared — and one of the two handlers has **no success message at all**, so
silence is its normal output. The other reports "Deleted 12 records", a number that looks like
proof.

**This is not theoretical:** after a Time Machine pull the history screen shows a year of a
customer's folder, and the delete button sits right there.

**Smallest fix:** query the collection for the target, or change the wording to say "the last
7 days" so the count matches the promise.

*(The third example in the original report — the sampling folder move — was checked and is
fine. A folder is one date, so it is wholly inside or wholly outside the window.)*

---

## 13. 🟢 LOW — Editing a sampling record rounds the quantity down and hands back stock never returned

**Where:** `src/App.jsx:3097`

**In plain English:** the sampling form deliberately stores fractions (2 Bks + 8 batang at 16
per pack = 2.5). The **edit** path converts with `parseInt`, which throws the fraction away.

**What happens:** open Edit only to fix a spelling, save, and the vault is credited **half a
pack that was physically given away**. Every later edit of an odd-batang sample repeats it.

**Downgraded from HIGH** because the error is bounded at under one pack per edit.

**Smallest fix:** `Number(...)` instead of `parseInt(...)`.

---

## 14. 🟢 LOW — Recalculate Career can erase a day that was verified while it was running

**Where:** `src/App.jsx:2093`

**In plain English:** the tool takes a snapshot of every EOD report, then commits a rebuild
seconds later. A day verified inside that gap was still pending at snapshot time, so it is not
in the rebuild — but its "already credited" marker survives, and that marker blocks it from
ever being credited again.

**What happens:** the agent's collected cash, items, stores served and day XP for that day are
gone, with no way back short of editing the database by hand. The comment above the function
calls the operation "safe to re-run".

**Downgraded to LOW** — admin-only, desktop-only, and needs a verify inside a seconds-long
window.

**Smallest fix:** clear the matching "credited" keys in the same write so a lost day can be
re-verified.

---

## 15. 🟢 LOW — Deleting a departed agent's sample restores nothing and says it did

**Where:** `src/App.jsx:3087`

**In plain English:** the stock restore only runs if the agent's record still exists. The
delete and the success message run either way.

**What happens:** an agent leaves, you delete their record, then delete a sample they logged.
The row disappears, **no stock is credited anywhere**, and you are told "Sample deleted & stock
restored." The shrinkage is never investigated. The edit-sampling handler has the same shape.

**Smallest fix:** fail loudly when the agent record is missing, or fall through to the vault so
the stock lands somewhere and the message stays true.

---

## 16. 🟢 LOW — The low-stock threshold is 50 in six places and 5 in two others

**Where:** `src/App.jsx:1217` (and `:1828`, `:4076`, plus four other files)

**In plain English:** when a product has no minimum set, six places assume 50 and two assume 5.
One of them sits directly under a comment saying "default to 5" while using 50.

**What happens:** a product with 20 packs left is shouted about by the login mascot and flagged
red in the terminal, while the **Dashboard low-stock panel and the Stock Opname screen — the
two places you would go to act on it — both call it healthy.** Nobody restocks it.

**Smallest fix:** one shared constant in `helpers.js`, used in all eight places.

---

## 17. 🟢 LOW — Two login-path error handlers report nothing, and one skips the ghost-account check

**Where:** `src/App.jsx:2265`

**In plain English:** the whole live-profile block is wrapped in a catch that only writes to
the console — and the check that revokes a deleted employee's access lives inside that same
block.

**What happens:** if the lookup fails for any reason other than being offline, **the ghost
check never runs** and the account is admitted on its stale cached role. The user is told
nothing. The consignment-history delete has the same shape on the money side.

**Smallest fix:** narrow the try to the fetch itself so the ghost check runs on its own result.

---

## 18. 🟢 LOW — Changing a badge target unlocks it on screen but the EOD verifier uses the old one

**Where:** `src/App.jsx:354`

**In plain English:** the badge configuration is loaded once when the app starts. Editing it
updates only the editing screen's own copy.

**What happens:** you lower "Logistics Titan" from 10.000 to 5.000. An agent at 6.000
immediately sees the badge lit at 100%. EOD verification keeps testing against 10.000 for the
rest of the session, so the badge is never actually recorded as earned.

**Downgraded from MEDIUM.** The original claim said three screens disagree — the checker proved
only two do, and that the recorded-unlock list is read by nothing user-facing anyway.

**Smallest fix:** subscribe to the badge config live instead of loading it once.
