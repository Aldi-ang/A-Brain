---
title: "Source — Surat Jalan Desk and Sebaran Stok (2026-08-26 → 2026-08-27)"
description: Immutable source. The full commit messages from the kpm-inventory repo, aea7de4 → ce313f9, covering the Restock Vault becoming a surat jalan desk, the Request tab, Sebaran Stok, the ratio-of-sums correction and the Ponder tutorial plan.
type: raw
created: 2026-08-27
updated: 2026-08-27
tags: [raw, source, kpm, logistics, restock, sebaran-stok, ponder]
---

# Source — kpm-inventory commits aea7de4 → ce313f9

Captured 2026-08-27 by the `a-brain-session-ingest` task, branch `phase0-solid-ground`.
Never edit below this line.

---

## aea7de4 — 2026-08-26 19:59:03 +0700

### The Restock Vault becomes one surat jalan desk

Aldi asked where the Tujuan textbox was. It was never there, and chasing
that answer explained the whole screen: every field the document needs
already existed somewhere, and which half of the screen you stood on
decided whether you could use it. The shipment photo was displayed by the
intake screen but only ever written by the branch screen. The resi worked
outbound only. The nota worked inbound only. The factory's own surat jalan
number had nowhere to go, because the app invented its own from a clock.

That was not two features. It was one document cut in half, and Asal ->
Tujuan is the field that puts it back together. Masuk and Kirim are now
the same form with the route reversed, so the second direction costs one
tab and no new screen.

What changed

- The route. Asal and Tujuan are searchable pickers over places that
  already exist in the records - suppliers seen in procurement, branches
  seen in stock_requests - and an unknown name is still accepted, just
  marked "baru" as you type. Free text is what lets KPM Malang, kpm malang
  and Pabrik Malang all be the same factory and never add up again; his
  own comment in BranchWarehouseManager makes this exact argument about
  Cello Coffee and cello kopi. The swap button reverses the route.
- Kirim. HQ can now send stock to a branch without waiting to be asked. It
  writes the same stock_requests document the branch receive screen
  already reads, straight to IN_TRANSIT, deducting HQ stock with
  increment() rather than a recomputed total - the failure
  BranchWarehouseManager already paid for once. Both requestedItems and
  fulfilledItems are written, because the receive screen reads one and
  falls back to the other, and a push has no request to fall back to. The
  branch is still credited what it counts, never what this form claims.
  No rules change was needed: stock_requests already allows create for
  isSalesman, and HQ is above that.
- Buku. The year -> month -> date drill is gone. The book opens flat,
  newest first, filtered by direction, and every row opens into its own
  document: both SJ numbers, the route, kurir and resi, each line with its
  batch and landed cost, the money, which evidence was attached, and a
  Proses timeline built from the stored workflowTimeline - never invented.
  An IN_TRANSIT shipment older than three days says so by name and in red,
  because that is the state where stock has left HQ and not arrived
  anywhere.
- Batch is a column beside the name, not a 32px box in a corner. An
  untagged lot ships as UNASSIGNED so a partial rollout stays honest.
- Landed cost is live per pack while you type, and each line says whether
  it got dearer than the last time that ware landed - a lookup over
  procurement records already loaded, no new field and no new read.
- Target keeps its data and loses its tab. It answers one question, so it
  is one strip above the form where you see it while writing an intake.
  Setting and deleting a target still work.
- The evidence row: foto barang, nota, resi and kurir, each with a lamp,
  feeding a completeness meter that reports and never blocks a save. A
  blocked save is a blocked dialog, and a block explains nothing.
- Every colour is a theme token. This was the last screen painting itself
  with hardcoded white and black washes, which is why light mode could
  never reach it. The printed nota stays white paper on purpose.

Checks

Five new ones in group 53, each guarding something that loses money or
loses stock if it quietly reverts: the token migration, both item keys on
a push, the server-side deduction, cukai and upah not charged twice on the
way out, and the meter never gating the save.

The icon-only delete count drops 14 -> 13 and that is a migration, not a
loss: both Restock deletes now read "Hapus" in the record's action strip,
so marking them would print the label twice. A paired check asserts the
words are there, the same way the four previous migrations did.

npm run build green. 613 checks, 0 failures.

Not yet seen running - the app is behind the vault gate.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 4387c86 — 2026-08-26 20:12:06 +0700

### PROGRESS: the surat jalan desk, driven in the live app

Everything the prototype promised works on his real data, including the
price drift and the ledger drawer. Kirim was left unpressed on purpose -
it moves real stock. Also records that the nav rail is off-canvas at this
window width, which is why the screen had to be reached by script.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 390d5fa — 2026-08-26 20:41:21 +0700

### Evidence photos come from the camera, and the nota stops being a dead box

Two things Aldi hit, one of them mine.

He could not photograph the nota. It was not broken - he was on Kirim,
where I had disabled it, and a greyed control that never says why is
exactly the silence he calls a bug. An internal transfer usually has no
supplier nota, so the honest shape is optional, not forbidden: the input
is live in both directions and simply reads "opsional" on the way out.

And a photo of goods or of a nota is evidence, so it has to be taken now,
at the warehouse. A picture chosen from the gallery can be any picture
from any day, which is the exact thing the photo exists to rule out. Both
inputs now ask for the camera. Tier 3 and above keep the gallery, because
they are the ones who re-file a photo that arrived by WhatsApp or has to
be replaced after the fact.

The rule lives in permissions.js beside isFieldLevelTier and
isFleetManagementTier, reusing the same translateLegacyRole - that file's
own comment records that a second copy of the translation is what caused
every tier bug in this project so far. Verified across all six tiers plus
an unknown role, which falls back to camera-only.

capture is a request, not a lock: mobile browsers honour it and open the
camera, desktop browsers ignore it and open a picker. The rule is
enforceable where the photos are actually taken. That limit is written
down beside the helper rather than papered over.

Two new checks. Build green, 615 checks, 0 failures.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 5109da2 — 2026-08-26 20:42:29 +0700

### PROGRESS: camera-only photos, the nota unblocked, and the one open question

Records the Active Pipeline pushback verbatim so it does not get asked
twice, and the Global Logistics readout as the next build with its
precondition: name the collection before promising a number.

Trimmed to five entries; git log keeps the rest.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 284602b — 2026-08-26 20:53:59 +0700

### The date gets its capitals back, and the rail's nav gets its touchAction

Two things, found while checking whether his sidebar was really gone.

The date read "26 agustus 2026". The lowercase was not an accident - a
comment recorded it as his own instruction from 16 August, "use this date
format 16 agustus 2026", and read the spelling as part of the format. It
was not. The format was the instruction and the spelling was incidental,
which he settled today: "use proper capitalization for the date as well
bro". Both messages are now written beside the table so nobody restores
the lowercase by reading only the older one.

The second is a real bug and nothing warns you about it. The rail's <nav>
carried TWO style props - touchAction above a long comment block and the
--cap variable below it. A duplicate prop is legal JSX and the LAST one
silently wins, so touchAction:'none' never ran, and the paragraph above it
explaining why pan-y lets the browser steal a slow drag from the scrub was
describing a fix that was not there. Merged into one.

Its check is anchored on the class name, not on /<nav[\s\S]*?>/. That was
tried first and reported zero style props: the tag contains arrow
functions, so a non-greedy scan stops at the > in "(e) => {". The wrong
needle would have passed forever.

Build green, 616 checks, 0 failures. Date confirmed reading "26 Agustus
2026" in the running app.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## c862869 — 2026-08-26 20:54:56 +0700

### PROGRESS: the sidebar verdict and his four-item queue, verbatim

Records that the sidebar is a collapsed capsule by design, that synthetic
hover could not test the expand, and the exact question he still owes an
answer to - plus the note not to rewrite the shell until he answers.

His request-tab message answers the old Active Pipeline question, so that
one is closed and the reason is written down.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 999b5a7 — 2026-08-26 21:01:30 +0700

### One scrollbar on the Restock Vault, not two

His report: "why do we have double slider".

This panel is the only tab that both scrolls itself AND guesses its own
height from 100vh. The guess came out about 38px taller than the shell's
padded workspace, so the workspace overflowed by that sliver and drew a
second, nearly full-height bar right beside the panel's own. Two bars, one
of them able to move the page by 38 pixels and nothing else.

h-full measures the workspace instead of guessing at the viewport, so the
panel now ends exactly where its parent does and only its own bar is left.
The neighbouring tab at line 4242 already carried the same height classes
without an overflow of its own, which is why this was the only screen
showing it.

The scroll stays on this box rather than moving out to the workspace: the
tab strip and the completeness footer are pinned by it, and scrolling the
workspace instead would unpin both.

I broke the build getting here, and the note explaining the fix is what
broke it: a JSX comment placed after `&& (` is a second expression inside
those parentheses and does not parse. It now sits outside the condition,
with a warning beside it, because the comment came back to the same spot
twice while I was writing this.

Build green, 616 checks, 0 failures. NOT seen running - the vault gate
re-locked on reload and the password is his to type.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## afcb01c — 2026-08-26 21:03:44 +0700

### PROGRESS: the sidebar is the top-left circle, and the build I broke

Records the sidebar answer with the proof, marks the x=-124 measurement as
junk so nobody chases it again, and writes down the JSX-comment-after-&&(
parse break plus the rule it cost me: run the build before writing the
claim.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 5643bf9 — 2026-08-26 21:18:19 +0700

### PROGRESS: the data map for the Global Logistics readout

Three of the four columns are already loaded in the app. The fourth,
terjual per warehouse, has no branch field on a transaction and has to be
derived through the agent - recorded as a gate, not a promise, along with
the roster collection that answers the per-team storage ask.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 775c791 — 2026-08-26 22:05:23 +0700

### NEXT-SESSION: the resume brief for the Restock Vault desk

Carries the three queued builds in his order with the data already traced
for each, the sidebar answer with its one open question, and the traps
that each cost time today - including running the build before claiming
it is green, and that a JSX comment after && ( does not parse.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 3452a25 — 2026-08-26 22:06:01 +0700

### PROGRESS: point the next session at the resume brief

No app code changed since 999b5a7. This entry exists so a cleared session
knows the notes are current, and carries the exact paste prompt.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 76de71a — 2026-08-27 07:39:50 +0700

### The Request tab, Tujuan from the roster, and where every pack is

Three builds in his order, all on the Restock Vault desk.

1. THE REQUEST TAB — the desk's 4th tab, and a move rather than a copy

HQ's only way to answer a branch request was "Siapkan Pengiriman", and it lived
inside BranchWarehouseManager — the BRANCH screen — while every other surat jalan
lived on the desk. It is now the desk's 4th tab, next to Masuk, Kirim and Buku.

Almost nothing was written. The Request queue is `bookRows` narrowed to the
outbound documents that are still open, so a row opens the same drawer, prints
the same timeline, and carries the same "Edit resi" and "Hapus" it does in the
book. Only the shipping modal actually travelled, repainted onto theme tokens on
the way (it was text-white on bg-black/50, the exact hardcoding that kept light
mode off that screen).

The queue keeps all three open states — PENDING, IN_TRANSIT, DISPUTED — because
that is what the panel it replaced showed, and narrowing it to PENDING would make
every shipment already on the road invisible to HQ. DISPUTED sorts first: the
goods are already in the branch and the count is already filed, so what is
outstanding is HQ's answer, and that is the one state nobody goes looking for.

BranchWarehouseManager lost 332 lines and is now HQ's warehouse readout rather
than HQ's outbox.

⚠️ The Siapkan button is a SIBLING of the row button, not a child. A <button>
inside a <button> is legal-looking JSX that renders without a warning and
silently kills the inner click, so the row had to become a flex pair to keep
Siapkan at one click. Check 54 pins that open.

2. TUJUAN COMES FROM THE ROSTER

His words: "make sure that every team registered on the fleet and roster have
their own storage option". Tujuan was built from `stockRequests[].branch`, so a
team that had never been shipped to had no entry — the warehouse that most needed
its first delivery was the only one HQ could not select. It is now the roster
UNIONED with the branches seen on past requests; roster alone would drop a live
shipment whose location had been renamed.

3. SEBARAN STOK — where every pack actually is

His words: "show the regional warehouse current stock, on field, sold as well
just like what we have on the dashboard, so HQ know how many bks should be send
to them again". One row per warehouse: di gudang, di jalan, di tangan agen,
terjual, plus the sisa-hari figure that answers the question he asked it for.

"Just like the dashboard" is a correctness requirement, not a styling note, so
the maths is not rewritten — it calls `supplyByProduct` from utils/supply.js, the
same function the dashboard runs on. Two implementations of "where is every pack"
would drift, and the screen nobody edited is the one that keeps being believed.

⚠️ TERJUAL IS SEVEN DAYS. The transactions listener is capped at sevenDaysAgo, so
an all-time total is not something this screen could compute even if it claimed
to. The window is passed explicitly and check 55 ties the label to the listener,
so widening the cap fails loudly instead of quietly making every figure wrong.

⚠️ The stacked bar leaves `terjual` out. Sold packs are not anywhere any more;
putting them in a "where is it" bar shrinks every other segment in proportion to
how WELL a branch is doing.

⚠️ The master vault prints — for di jalan, never 0. stock_requests only ever run
HQ → branch, so a figure there would be an empty sum dressed up as a measurement.

CHECKS: 616 → 627. Two existing checks moved deliberately, both documented in
place: the icon-only delete count 13 → 12 (the queue's glyph arrived somewhere
with room for the word "Hapus"), and the camera rule 2 → 3 (the shipping-proof
photo is evidence and earns the same rule).

One existing check was FIXED rather than worked around. The palette check failed
against the comment explaining the fix — the sentence "the original was
`text-white` on `bg-black/50`" is prose about a raw colour, not a raw colour.
Group 48 already paid for that exact trap and had `noCmt`; group 53 was written
without it. It strips comments now.

Build green, 627/627. Not yet driven in the browser — the vault gate re-locks on
a new tab and cannot be opened from here.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## bc2cb96 — 2026-08-27 07:40:19 +0700

### PROGRESS: three builds landed, none of them seen yet

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 20c4a0a — 2026-08-27 07:54:09 +0700

### Headquarters is the master vault, not a cabang you can ship to

Caught by driving the screen, and only by driving the screen: with the Tujuan
list cleared, the dropdown offered FOUR destinations — Gudang Pusat (HQ), BANDUNG,
Headquarters and MUNTILAN. The first and the third are the same place.

The roster union added yesterday filtered on its own short list, `!== 'UNASSIGNED'`.
supply.js has owned the real rule for a while and states it in prose — "Headquarters
is not a branch — Headquarters IS the master vault" — behind a NON_BRANCH constant
that also covers UNASSIGNED AREA. Two lists, one of them shorter, and the shorter one
was on the form that writes stock movements: a shipment to "Headquarters" would have
opened a stock_request against a branch with no inventory subcollection behind it.

Fixed by exporting NON_BRANCH and using it, NOT by lengthening the copy. A second
list is what produced this in the first place, and it is the same class of fault the
group 55 checks were written to stop between this screen and the dashboard.

Tujuan now lists exactly Gudang Pusat (HQ), BANDUNG and MUNTILAN — verified on screen.
BANDUNG is the point of the whole change: it has never been shipped to, so it could
not appear before, and it is still empty in Sebaran Stok (0/0/0/0).

Check 54 gains a fifth: Tujuan must filter through the exported NON_BRANCH, so a
local list here fails loudly rather than quietly re-offering the master vault.

Build green, 628/628.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## f368ca5 — 2026-08-27 07:54:32 +0700

### PROGRESS: driven live, one bug caught on screen

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 4cc71af — 2026-08-27 08:04:18 +0700

### Sebaran Stok is the title, and each warehouse opens into its own shelf

Three things, all his, all on the HQ logistics screen.

1. THE BANNER IS GONE

"GLOBAL LOGISTICS COMMAND / ALL BRANCHES NATIONWIDE" named the screen you had
just clicked into and then said nothing — two lines of chrome above the only
thing on the page worth reading. His words: "not cool and elegant". Deleted for
HQ. A BRANCH user keeps theirs, because for them it is not decoration: it names
which hub they are looking at and who their admin is, and neither is obvious
from anything else on the screen.

2. SEBARAN STOK IS THE TITLE NOW

Not louder than the old one — the weight went into the type and an accent rule,
and the colour came OUT. `text-ink` reads at full contrast in both themes where
the gold it used to be is a mid-tone fighting the panel behind it in each. The
gold survives as the icon chip and the rule, which is where an accent earns its
keep: pointing at the title rather than being it.

3. EVERY WAREHOUSE OPENS INTO ITS OWN SHELF

His ask: "so that i can see the full detail for every single item status, not
just all product as a whole", then "basically isi gudang cabang with better UI
and format inside the dropdown". Click a warehouse, get one row per product with
the same four columns plus the stock-age line — which is the only part of Isi
Gudang Cabang that was not already in the four totals, and the part that says
WHICH stock to move first.

It cost almost nothing: supplyByProduct already returned one row per product and
the four totals were that list summed. The drawer prints the list the totals came
from — and `di jalan` is now summed FROM that same list, so a row and its own
detail cannot disagree.

⚠️ A PRODUCT CAN BE IN TRANSIT TO A WAREHOUSE THAT HOLDS NONE OF IT.
supplyByProduct drops any row whose shelf+field+sold is 0 — right for a supply
picture, wrong here, because a brand-new branch waiting on its first delivery has
exactly that shape and "what is coming" is its whole answer. In-transit products
are unioned back in. Bandung is that branch today.

🔴 AND ONE FOUND BY LOOKING AT IT. The first version printed "UMUR BELUM TERCATAT
· 10.900 TANPA ASAL" in danger red on every single Master Vault row. Nothing was
broken: the arrivals machinery matches shelf stock against the stock_requests that
delivered it, and nothing is EVER delivered to the master vault that way — it is
stocked by `procurements`, the surat jalan masuk on the desk above. Working code,
asked a question it has no data for, answering in the loudest colour on screen.
The age line is branch-only now, and prints nothing when it has nothing to say.

CHECKS 628 → 630. The terjual check FIRED on this commit and was right to: the
label it anchors on changed from "Terjual = 7 hari terakhir" to "terjual · 7 hari
terakhir" in the retitle. Re-anchored on the CLAIM ("7 hari terakhir") rather than
the punctuation, so a copy tweak no longer trips it but deleting the window does.

Verified on his data: master 10.900+9.988+1.464+1.586+983 = 24.921, the row total.
Muntilan shows real ages — 113 hari, 2 kiriman — and real "tanpa asal" flags.

Build green, 630/630.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## b667e78 — 2026-08-27 08:06:49 +0700

### Isi Gudang Cabang is gone; the drawer replaced it

His call, asked and answered: the Sebaran Stok drawer now shows everything that
panel showed and more, so the panel goes.

What it was: a dropdown that picked ONE branch and listed that branch's shelf.
What replaced it: every warehouse at once, and per product not just the shelf but
di jalan, di tangan agen and terjual beside it, with the same stock-age line.

What was lost, deliberately and with him told first: `stockCard`'s per-SHIPMENT
breakdown, which named each individual kiriman behind a product's stock. The
drawer summarises that as "113 hari · 2 kiriman". He was offered the option of
porting it into the drawer first and chose the straight delete.

`stockCard` itself STAYS — the branch-side view still renders it for a user
looking at their own warehouse. Only HQ's copy of that idea is gone.

Orphaned by the deletion and removed with it:
  - `viewBranch` / `setViewBranch`, the picker's selection
  - `branchesSeen`, which existed only to fill the picker's <option> list
  - HQ's one-branch-at-a-time inventory listener. `watching` is branch-side only
    now; HQ reads every warehouse from `branchStockMap` in one go, so the screen
    also ends up holding one fewer Firestore subscription than before.

Verified on screen: the panel is gone, Sebaran Stok totals unchanged
(24.921 / 0 / 5.516 / 500), no new console errors.

Build green, 630/630.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## d042520 — 2026-08-27 08:11:10 +0700

### Sebaran Stok on a grid: nothing clipped, and the drawer actually animates

His report, twice: "i want better UI design for the edge of the panel here, it
looks cheap and not smooth", then "formatting is really bad, it looks cutted, not
designed properly". Both were the same fault, and it was structural.

THE CUT. The panel was a <table> with `min-w-[640px]` inside a rounded container.
Every row rule ran the full width of the table and straight into the corner
radius, so each separator was visibly sliced off at the right edge and the
numbers sat flush against the border with no breathing room. No amount of padding
on the table fixes that — the rules belong to the table, the curve belongs to the
panel, and they were fighting.

Rebuilt as grid rows inside a padded track. The rules now stop where the padding
stops, so nothing meets the curve. One `COLS` constant drives the header, the
warehouse rows, the drawer rows AND the total, which keeps a table's one real
advantage — perfect column alignment — without its clipping.

THE ANIMATION. There wasn't one. The drawer was a <tr> that simply appeared, and
a <tr> cannot be transitioned. It animates on `grid-template-rows` 0fr → 1fr now,
which is the one way to transition to a height you have not measured — so it
stays smooth no matter how many products a warehouse holds. The chevron eases
over 300ms with it, the row tints on open, and the segment bars transition their
widths instead of snapping.

THE EDGE. `shadow-xl` is a hard black slab under a near-black panel, which is
what read as cheap. Replaced with a two-part shadow — a 1px contact line plus a
wide, heavily-offset ambient — so the panel sits on the page instead of being
stamped onto it.

⚠️ The G55 drawer check FIRED on this commit, correctly: it pinned
`r.detail.map(p =>` and the callback became `(p, i) =>` for the row separators.
Re-anchored on the ARRAY rather than the callback signature — it still proves the
drawer renders the same list the totals are summed from, which is the point, and
no longer breaks on a signature change that cannot affect that.

Verified on his data: Muntilan's drawer is 130+130+50+40+20 = 370, its row total.
Nothing clipped at any edge.

Build green, 630/630.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 645ff0c — 2026-08-27 08:12:07 +0700

### NOTES: the desk is done; the only untested thing is Siapkan

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 2f1efe3 — 2026-08-27 08:12:24 +0700

### graphify: refresh the graph after the Sebaran Stok rebuild

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## d1b6ff4 — 2026-08-27 08:14:20 +0700

### PROGRESS: timestamp + the di jalan / di tangan agen vocabulary

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## b452264 — 2026-08-27 08:38:04 +0700

### Plain words, and an estimate that shows its working

Four asks, all his, all on Sebaran Stok.

1. NO MORE VAGUE LABELS. His rules: "dont make vague terms" and "use english
terms if its shorter and direct".

  Gudang         → Warehouse
  Di gudang      → In stock
  Di jalan       → Shipping          (his: "shipping in progress")
  Di tangan agen → Agent inventory   (his words exactly)
  Terjual        → Sold (7d)         the window is in the header, not a footnote
  Sisa hari      → Est. days left

"Est." is load-bearing and not padding. He asked for wording that says "potential
time left before depletion" — the word he reached for was POTENTIAL. A bare "Days
left" reads as something the system measured; it is a projection off one week.

2. THE CALCULATION IS ON SCREEN. His words: "i want where u got that calculation".
A new "Avg / month" column sits beside "Est. days left", because printing a
quotient without its divisor asks him to trust a number he cannot check. The
footnote writes both divisions out longhand, says what ≈ means, and says what —
means: no rate to divide by, NOT "lasts forever".

3. PER ITEM, NOT JUST PER WAREHOUSE — and this paid for itself immediately on his
own data. Master Vault's row reads 348 days left. Open it and Cello Chocolate has
20 (1.464 ÷ (500 ÷ 7)). The warehouse total was hiding the one product actually
moving behind four that are not. That is exactly the blindness he was pointing at
with "not just all product as a whole", and the aggregate could never have shown
it.

4. Company total renamed out of Indonesian to match the rest of the header row.

Both estimates ignore Shipping and Agent inventory on purpose, and the footnote
says so: they answer "how long does the shelf last", and stock already on a truck
or a motorbike is not on that shelf.

LEFT ALONE ON PURPOSE: BranchWarehouseManager.jsx:1121 still says "Di jalan". It
is the BRANCH user's reorder-advice panel — a different screen, a different
reader, all-Indonesian by design. Renaming it for consistency with a screen that
user never sees would be the change nobody asked for.

CHECKS 630 → 631. The terjual check fired again on the rename, which is its whole
job: it anchors the printed window claim to the listener that supplies it, so
changing the words without changing the data trips it. Re-anchored to "last 7
days". The new check pins the two divisions to the screen — "Est. days left"
alone is a number with no shown working.

Verified live: Master 500 sold → ≈2.143/month → 348 days; Cello Chocolate 20 days.

Build green, 631/631.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 792ca04 — 2026-08-27 08:40:50 +0700

### "SJ" spelled out — the abbreviation was the whole problem

His words: "change nomor SJ because i dont know what is that". SJ is surat jalan.
He owns the company and could not read the label on his own intake form, which is
the clearest possible signal that an abbreviation saved space nobody needed.

  No. SJ (app)   → Delivery note (app)
  No. SJ pabrik  → Delivery note (factory)
  No. SJ manual  → Delivery note (paper)     the Kirim side: HQ's own slip, no factory
  No. SJ (Buku)  → Delivery note
  "dari kertas"  → "copy from the paper"

Two variants exist because the field means two different things by direction, and
that is now visible in the label rather than hidden behind one shared word:
inbound it is the FACTORY's number off their paperwork, outbound there is no
factory and it is whatever HQ wrote on its own paper slip.

⚠️ THE `SJ-631381` VALUE IS DELIBERATELY UNCHANGED. That prefix is written into
`poNumber` on every record already saved and is how the documents in Buku identify
themselves. Renaming a label costs nothing; renaming a stored identifier splits
the history into before-and-after and buys nothing — he asked about the words on
screen, not the numbering.

Build green, 631/631. Verified on screen.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 5d4f062 — 2026-08-27 08:45:19 +0700

### PLAN: a Ponder-style tutorial system, per component

No app code. `.claude/PONDER-PLAN.md` is the whole deliverable; he asked for the
plan and explicitly chose to build nothing this session, with ~23% of the quota
left. Repo is unchanged at 792ca04.

He wants an in-app tutorial on every component, modelled on Create mod's Ponder.

DECIDED: scripted scenes, not recorded video. Ponder is not a video player either
— it scripts a live scene. Eight labels were renamed on 2026-08-27 alone, so
recorded clips would have been wrong by the end of the same day, and they cannot
follow dark mode or ship inside an offline PWA.

THE DESIGN CALL THAT MATTERS MORE THAN THE ENGINE: a scene renders the real
component fed a FIXED DEMO DATASET, rather than spotlighting his live screen.
This is what Ponder actually does — the schematic world is not your base — and it
is the only version that works for the user who needs a tutorial most, the one
whose data is empty. Spotlighting live data today would teach Sebaran Stok using
Bandung's all-zero row: a wall of dashes. Demo data also lets a scene show a red
"3 days left" warning he has never hit.

The cost is one small refactor per component, taken one at a time with its scene
rather than up front: the visual half accepts its rows as a prop instead of
computing them. Same component in both places, so a scene cannot drift from the
screen it teaches.

Also specified: the scene file format (data, never React), the four audit checks
the engine needs — including one asserting every `focus` key exists as a real
`data-ponder` attribute, which is what stops scenes rotting when a panel is
rewritten — the project-specific traps (palette law, reduced-motion, the
off-canvas rail under 1024px), and a build order ranked by where a mistake costs
money rather than by which screen is easiest.

⚠️ Recorded in the plan and in PROGRESS: the Sebaran Stok footnote may not be
deleted before the first scene exists. It is currently the only written record of
the two formulas and check 631 pins them to the screen — so the check MOVES into
the scene file. Deleting a check to make a change pass is how the thing it
protected comes back.

Three questions left open for him rather than assumed, top of them whether the
teaching sentences should be Indonesian or English — his "english if shorter and
direct" rule was about column labels, and branch staff reading a tutorial are not
the same audience as an HQ admin reading a table header.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## f7800f5 — 2026-08-27 08:48:38 +0700

### A warehouse has no "days left"; only a product does

Aldi caught this on screen: "u cant just divide total with the average goods like
that, these are different goods should have their own depleted number." He is
right, and it is a ratio-of-sums error.

The warehouse row divided TOTAL shelf by TOTAL sales rate. Master Vault printed
348 days. That entire rate — 500 a week — was ONE product, Cello Chocolate. The
other four sold nothing at all, and Chocolate itself had 20 days of cover sitting
one row down inside the drawer. So 348 silently answered "how long until
everything is gone, if any product could satisfy demand for any other", which is
not a question anybody has. Nobody sells Cello Mmrapi to a customer who came in
for Chocolate.

The direction of the error is the worst part: 17× too COMFORTABLE, on the one
panel whose entire job is "which warehouse do I restock first".

WHAT STAYS: shelf, sold and perMonth totals. Bks add across products, so a total
pack count is a real quantity. Only the DIVISION was invalid — it needs its
numerator and denominator to describe the same fungible good.

WHAT THE CELL SAYS NOW: "per item", or "below ↓" once the warehouse is open.
Deliberately not "—", which already means "no sales, so no rate" on the item rows.
Reusing it here would claim the warehouse has no rate, when the truth is that the
question has no warehouse-level answer at all.

Check 632 pins it shut: no computed daysLeft on the warehouse row, and the
footnote must keep explaining why there isn't one.

⚠️ THE PART WORTH REMEMBERING. Every check passed. The build was green. I verified
the arithmetic on screen twice and it was correct every time — 24.921 ÷ (500 ÷ 7)
really is 348. The arithmetic was right and the statistic was meaningless, and no
check I could have written would have caught it, because a check tests whether a
number computes, not whether it means anything. Recorded in alucard/lessons.md.

Build green, 632/632.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## 76f1ef3 — 2026-08-27 08:54:25 +0700

### Give the products room to be their own level

His note: "there should be personal space between the location line and the
product lines just to show that they are different ... psychology of the
expensive wears store shelf and product display format used by LV or PRADA".

He is describing a real hierarchy failure, not a taste preference. The drawer sat
flush against the warehouse row behind a hairline, and every product carried
another hairline of the same weight — so a reader scanning down saw one unbroken
stack of six rows rather than one warehouse containing five products.

Fixed with space rather than more lines:
  - the `border-t` between warehouse row and drawer is GONE. The bg-inset tone
    already says "nested"; a rule on top of that says it twice and reads as
    "another row" instead of "a level down".
  - py-5 inside the drawer, so the first product does not start the instant the
    warehouse ends and the last one does not run straight into the next warehouse
  - py-3.5 per product, up from py-2.5
  - between-product rules faded to /30, so they align the number columns without
    competing with the gap that does the actual separating
  - the open warehouse row gets extra bottom padding, only while open

Nothing was added to say "these are different". Something was removed, and the
space left behind says it.

Build green, 632/632. Verified on screen.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---

## ce313f9 — 2026-08-27 08:56:35 +0700

### NOTES: resume brief for the Ponder build; session ready to clear

.claude/NEXT-SESSION.md rewritten — the three queued builds it used to carry all
shipped today, so it now carries what is actually next: the three unanswered
Ponder questions, the two decisions already locked with him (scripted scenes not
video; demo data not live spotlight), the slice order, and the six traps that cost
real time this session.

Top of that list is the one worth carrying furthest: a total divided by a total is
only a rate if the things are interchangeable. That shipped, was wrong by 17x, and
he caught it rather than any of the 632 checks.

No app code changed. Tree clean at 76f1ef3.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

---
