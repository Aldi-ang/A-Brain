---
type: concept
confidence: certain
checked: 2026-08-11
---

# Lancelot the Tobacco Ledger Agent

Lancelot is the bookkeeper agent for Aldi's **tobacco (tembakau) buying business**. This is a
personal business and is **not the KPM inventory app** — the two share no code, no data, and no
repo. Loading the KPM repo to answer a Lancelot question is always wrong.

Built 2026-08-11.

## What it does

Aldi sends two photos: the handwritten **nota tembakau** (the farmer's receipt) and the **bukti
transfer** (bank transfer confirmation). Lancelot reads both, extracts the figures, verifies the
arithmetic, and writes one row into the Google Sheets ledger.

Definition lives at `C:\Users\ASUS\.claude\agents\lancelot.md`.

## The three pieces

| Piece | Role |
|---|---|
| **Lancelot** (`~/.claude/agents/lancelot.md`) | knows the ledger layout, the maths, the refusal rules |
| **Autosheet** (MCP connector) | the only thing that can write to the Google Sheet |
| **Google Drive** (MCP connector) | holds the original receipt photos |

There is **no standalone app**, deliberately. A web or mobile app would be a second codebase doing
exactly what sending two photos in chat already does. Reconsider only if other people (not Aldi)
need to submit receipts, or if it must run with no Claude session open.

## Why Autosheet and not a Sheets connector

There is no standalone "Google Sheets" connector on claude.ai. **Google Drive alone is read-only
for existing files** — it can create new files but cannot append a row to an existing spreadsheet.
Autosheet is the connector that writes. This cost most of a session to establish; do not re-derive
it by searching the registry again.

## The ledger

Spreadsheet `1qBbfEsuYQu0CWMGzzYES2xKCn0PMVseG_CodZ0QUPAQ`, one tab per farmer (petani).
`MITA`, `YOHAN`, `PAK MUL` are transaction logs; `C` is a summary/recap.

`PAK MUL` is the reference layout and the only tab with the full column set: NO, TANGGAL,
BERAT RINCIAN, BRUTO (kg), TARA 10% (kg), NETTO (kg), HARGA, ONGKOS, JUMLAH, BUKTI TRANSFER,
LUNAS, NOTA IMAGE, BUKTI TRANSFER IMAGE. `MITA` and `YOHAN` use an older narrower layout with
LUNAS as a loose label below the data rather than a column — do not silently restructure them.

## The arithmetic is the check

Handwritten notas are routinely obscured by the business stamp. Lancelot reconciles before
writing, and every relation must hold:

- the per-batch weights sum to bruto
- tara is normally **10%** of bruto
- netto = bruto − tara
- netto × harga + ongkos = total

**A digit that does not reconcile is far more likely misread than genuinely wrong.** On the first
real receipt (P. Mul, 11/08/2026), `TR2` was unreadable under the stamp and was recovered as `29`
from `185 − 58 − 43 − 55`. Aldi confirmed it. The rule that came out of it: state which number was
*inferred* rather than *read*, and ask before writing it.

`LUNAS` is only written when the transfer nominal, the date, and the recipient name **all** match
the nota. Any mismatch is reported as a Rupiah difference, never silently marked paid.

See [[Silent Failure Disease]] — a wrong number written quietly into an accounting ledger is the
same disease in a different room.

## Design decision — images are links, not embedded objects

**Aldi's call, 2026-08-11: "A is better."** Option A was a Drive link rendered with `=IMAGE(url)`;
option B was a true embedded image object floating over the cell.

Links win because they **survive row edits**. An embedded image is positioned over a cell range and
shifts or detaches when rows are inserted above it — in a ledger that grows by a row per
transaction, that breaks constantly.

Consequence worth remembering: **photos pasted into chat are not files**. They cannot be uploaded
to Drive from the conversation. Write the data row, leave the image columns blank, and ask Aldi for
the Drive links. This is a permanent property of the workflow, not a bug to fix later.

## Formatting is part of the job

He reads this ledger on a phone as often as a laptop, so readability is a requirement and not
polish. Carry these conventions to every new farmer tab: frozen headers, bold on dark; Rupiah as
`Rp 9.357.500` with no decimals; weights to 1 decimal with the unit in the header (`BRUTO (kg)`);
dates `dd/mm/yyyy`; LUNAS green and BELUM LUNAS red via conditional formatting applied to the
**whole column** so future rows inherit it; long text wrapped and wide, numbers narrow.

Consistent with [[Aldi's Design Taste]] — the format serves the person reading it, not the tool
writing it.

## The PC/phone gap

A Claude Code subagent lives in a file on his PC. **The claude.ai phone app cannot see it.** To get
the same behaviour on the phone he must create a claude.ai **Project**, paste the contents of
`lancelot.md` in as its custom instructions, and connect Autosheet + Drive there. Same brain, two
doors — and the instructions have to be copied again whenever `lancelot.md` changes.

## How the business actually works — confirmed 2026-08-11

Aldi is a **mediator**. Roles, in his own words and settled:

- **Agen** — MITA, YOHAN, PAK MUL. They work for him and find the tobacco. He rejected *partner*
  and *pengepul* in favour of **agen**. They are **not petani**; the old sheet's `PETANI :` label
  on their tabs was simply wrong.
- **Petani** — the farmers, e.g. Sri Rahayu. Each has a unique code.
- **Pabrik** — the customer. **"OM CK" is a pabrik**, and the `C` tab is already the buy-vs-sell
  comparison against it.

**Three prices**: harga petani (what the farmer gets) < harga agen (Aldi's decision, the agen's
commission is the gap) < harga pabrik (what comes back). Plus **margin timbangan**, the kilos
gained between buying and selling — real and large: MITA netto 48 kg bought, 52 kg sold;
YOHAN 115 kg bought, 128 kg sold.

**Two purchase methods.** (1) **BON** — agen borrows, buys, settles after the sale;
*deactivated for now*, may return. (2) **BAYAR LANGSUNG** — the agen brings the nota and Aldi
pays the petani directly. This is the live method and explains the Sri Rahayu transfer on a nota
addressed to Pak Mul.

**No gudang.** Goods ship agen → pabrik directly. That deletes stock tracking and probably the
buy-to-sell matching table too.

**The unit is a package, not a kilogram** — keranjang, gulungan, or plastik. **One row = one
gulungan** (`JUMLAH GULUNG` 2 for MITA's 2 rows, 4 for YOHAN's 4). Rejection is per package:
*"could be only 1 keranjang or few"*.

**Two kinds of seri, and this matters.** `SERI` on the sheet is the **agen's** serial (e.g. `KS`)
and changes every time. `DN`, `JWD`, `TR1`, `TR2` on Pak Mul's nota are **petani seri** — codes
the agen writes for his own notes, used *when the agen seri is missing*, so a gulungan can be
traced to the petani it came from. An agen buys from many petani, so this is the only link back.
**`NO GUDANG` is the tie-breaker** when a gulungan's seri is missing, which happens often; not
every customer supplies it.

### A trap already in the data

**`ONGKOS` carries opposite signs in the same file.** In MITA and YOHAN it is *subtracted*
(23 kg × Rp 40.000 = 920.000, − Rp 10.000 ongkos = Rp 910.000, and Rp 10.000 is per gulungan).
In the PAK MUL row it is *added* (Rp 9.157.500 + Rp 200.000 contoh tbk = Rp 9.357.500). One
column, two meanings — it must split into **ongkos naik turun** (deduction, per package, rate set
by the pabrik) and **tambahan** (addition). Left as one column it silently corrupts every total.

## The real shape of the data — settled 2026-08-11, from his own sheets

**The unit is the NOTA, not the gulungan.** His YOHAN tab proves it: four gulungan each carry
their own **bruto** (27, 22, 53, 27), but **tara and netto are blank on every row** and appear
only on the total line — bruto 129, tara 14, netto 115. And 129 × 10% = 12,9, not 14, so **tara
is negotiated, not a fixed percentage**.

A first build that computed tara and netto per gulungan invented numbers that were never in his
book (netto 24,3 / 19,8 / 47,7 / 24,3). Correct model:

- **GULUNGAN level** — bruto, seri agen, seri petani, no gudang, jenis, grade
- **NOTA level** — tara, netto, harga, ongkos, jumlah, lunas — and **twice over**, once for the
  agen side and once for the pabrik side

**Every delivery produces two notas of the same gulungan.** Same items, two weighings, two
prices. `C` compiles both across all agen per date:

| | Agen side (NOTA BAYAR PETANI) | Pabrik side (NOTA OM CK) | Cuan |
|---|---|---|---|
| MITA | 54 bruto → 48 netto, Rp 2.025.000 | 54 → **52** netto, Rp 2.330.000 | Rp 305.000 |
| YOHAN | 129 → 115 netto, Rp 4.790.000 | **132** → 128 netto, Rp 5.720.000 | Rp 930.000 |

Cuan is the plain difference between the two notas — Rp 1.235.000 that day. Note the pabrik side
records **more** bruto and much less tara; the timbangan gap is a large part of the margin.

### The pabrik nota is confidential — a hard design constraint

His words: the factory's nota *"shouldnt be sent to our agen due to ethic matters"*.

That makes confidentiality a **build requirement, not a preference**. Any per-agen view, printed
nota, or export must carry the **agen side only**. The pabrik side and the cuan column belong to
Aldi's own summary and nowhere else. A view that leaks it is a broken view, not a cosmetic bug.

### Three retypings, and why the flat store wins

He currently types the same numbers three times — the agen nota, the pabrik nota, and the `C`
compilation. Two of the three are pure copying, and each is a chance to fumble a digit. Storing
once and **generating** his existing side-by-side layout keeps the format he already reads while
removing both copies. He is right about the layout; only the typing changes.

## The discipline has a name, and he reinvented most of it

Aldi asked what companies like Tokopedia or Indomaret do to manage data at scale, believing
his own system was amateur because he built it from his own head. **It is called dimensional
modelling** (Kimball) — facts and dimensions — and his `Compile Master 101` already is one.
Facts are things that happened (`NOTA`, `ITEM`); dimensions are things that exist (the `M_*`
lists). Tell him this plainly when it comes up: the gap was never his thinking, it was five
named techniques nobody had shown him.

Rules now enforced in the Apps Script, each tied to a mistake that actually occurred here:

1. **One grain per table** — `NOTA` = one nota, `ITEM` = one gulungan. Never mixed.
2. **Store once, generate the rest** — COMPILE, IN-OUT, RINGKASAN, DASHBOARD are derived.
3. **Freeze the price on the fact** — `HARGA` is what it cost that day; looking it up from a
   master later would silently rewrite history.
4. **Append-only; corrections are new rows** — his own instruction, and the reason a wrong
   number must never be editable away.
5. **Referential integrity** — names come from master dropdowns. Free-typed `MITA` and
   `MITHA` become two agen who each own half the truth.
6. **Idempotent writes** — `cariNota_()` refuses a duplicate `NO NOTA`, so the Drive inbox
   cannot double-post a nota.
7. **Blank means unknown, zero means zero** — a blank harga yields a blank total. This one is
   from a real bug: `Rp 0` propagated into a payment of **−Rp 10.000**.
8. **Every rule gets a runnable check** — `lancelotSelfCheck` (arithmetic, 14 asserts) and
   `cekKualitas` (10 data rules → the `MASALAH` tab).

The variability that broke every previous format is now one field: **`CARA TARA` + `NILAI
TARA`** on the nota. RA 7 took 10%, MT 1 took a flat 1 kg, ALR 1 took 2 kg — same skeleton,
different method. Storing the method instead of retyping the arithmetic is what stopped 37
hand-copied tabs from drifting.

**On his sources:** the YouTube links he supplied (*Become a Data Management Master with
Google Sheets*, *10 INCREDIBLE things Google Sheets can do*, *Gemini to Create a Sheets
Dashboard*) teach Sheets **tactics** — QUERY, pivots, dashboards. The Towards Data Science
piece is about using Claude (dashboards, Cowork, Claude Code debugging), not about modelling.
Neither category contains the discipline above. Say so honestly rather than pretending the
videos supplied it.

## Where the build stands — 2026-08-11 18:40 WIB

Live in the sheet and working: `NOTA`, `ITEM`, four masters, `LOG`, plus generated `COMPILE`,
`IN-OUT`, `RINGKASAN`, `DASHBOARD`, `MASALAH`. Drive inbox watcher running every 5 minutes.
`lancelotSelfCheck` 13/13. Aldi ran all seven functions himself.

**`cekKualitas` justified itself on its first run**, catching a bug in the migration rather than
in his data: his `YOHAN` tab has 11 columns (he added JENIS BARANG and GRADE) while `MITA` still
has 9, so position-based reading took the word `SAPUT` as a weight and wrote four gulungan of
0 kg. Fixed by mapping columns **by header name**. The rule: never read a hand-made sheet
positionally — the drift that motivated this whole rebuild will bite the migration code too.

### Not built yet, ranked

1. **Append-only is documented but unenforced** — nothing stops a manual edit erasing history.
   Needs `koreksiNota()` writing a reversing row, plus a `KOREKSI` tab.
2. **No backup.** One bad delete loses the ledger. A scheduled snapshot copy is small and
   everything else depends on the data surviving — do it first.
3. **Manual edits are invisible.** `LOG` records Lancelot's actions only; an `onEdit` trigger
   would catch a human changing a cell.
4. **No surrogate keys** — `NO NOTA` is the natural key, so renaming a nota breaks its links.
5. **Sell side incomplete.** `JUAL PABRIK` notas can be stored but cuan per gulungan is not
   computed, so `DASHBOARD` reads −Rp 11.202.500 — that is unsold stock, not loss, and the
   system cannot yet tell the two apart.
6. **The side-by-side nota generator** — agen nota left, pabrik nota right, cuan between — his
   actual working format, still hand-made.
7. **No archiving per musim.**

**His process instruction, 2026-08-11:** *"i rather give u all the time to learn first then we
update the code at last, i dont want to update it everytime u learn a new thing"*. So: settle
the whole design in writing, get it approved, then **one** script paste. No incremental drops.

## Tooling: Autosheet is a dead end on cost

Autosheet writes reliably but is **metered, and the balance ran out mid-build** on 2026-08-11 —
the agent stopped part-way through creating tabs. Nothing was written (verified by reading the
file through the Drive connector afterwards), but a paid dependency in the middle of a
bookkeeping workflow is a standing risk.

Aldi asked for a free replacement. The tutorials he found all demonstrate the **Claude add-on
from the Google Workspace Marketplace**, which runs Claude *inside* Sheets via formulas — it
needs an Anthropic API key and bills per call, so it is not free either, and it does not read
photos.

**The genuinely free split is Claude for the eyes, Apps Script for the hands:** Claude reads the
nota photo and emits one structured line; a Google Apps Script bound to the sheet parses it,
computes tara/netto/totals, assigns the KODE, files the Drive link, and refreshes the dashboards.
Apps Script is free, native, runs with the PC off, and — unlike any connector — can give him
custom menus and dialogs, which is what he asked for when he said the sheet should look
*"tidy and presentable… some cool UI and decoration"*.

### The ledger was world-editable — found and closed 2026-08-11

`get_file_permissions` on the spreadsheet returned `{"role": "writer", "type": "anyone"}`.
No sign-in, no invitation: **anyone holding the URL could edit or delete the financial records**,
which include a real bank account number, a real person's name, transfer reference codes, buying
prices and margins. It was found only because an unrelated failure (Apps Script refusing to open)
prompted a permissions check.

It also explained the failure. The file was owned by **`kurniawanaldi576@gmail.com`** while Aldi
was signed in as **`adikaryasukses99@gmail.com`** — the sheet sat in "Shared with me". A bound
Apps Script project lives in the *owner's* Drive, so Extensions → Apps Script tried to open a
project his signed-in account did not own.

**The silent failure it would have caused later is the real lesson.** The script would have run
under one account's Drive while Claude dropped inbox files into another's. Two different Drives,
no error, no warning — the watcher would simply have found nothing forever.

Resolved by **transferring ownership** rather than copying. A copy would have left the original
world-editable and created two files that drift apart. Verified after: owner is now
`adikaryasukses99@gmail.com`, and the permissions list contains only that one owner entry — the
`type: anyone` grant is gone.

**Rule that falls out of this: before building any automation on a shared document, check who
owns it and who can reach it.** Everything — file, script, Drive inbox, and the Claude connector —
must sit on one account, and `get_file_permissions` is one call.

### Unrelated blocker found the same day

`WebFetch` and `WebSearch` both run on Haiku, and this machine's
`ANTHROPIC_DEFAULT_HAIKU_MODEL=cc/claude-haiku-4-5-20251001` points at a model 9router does not
serve — so both tools fail with "issue with the selected model". Sonnet and Opus were already
remapped to `cc/claude-opus-5`; Haiku was missed. The fix is to point it at a served model. The
browser tools are the workaround until then.

## Never

- Initiate, authorise, or advise on a money transfer. Lancelot **records payments that already
  happened**, nothing more.
- Invent a number. Unreadable means ask.
- Overwrite an existing row without naming the row and the old value.
- Abbreviate a bank account number or reference code.
