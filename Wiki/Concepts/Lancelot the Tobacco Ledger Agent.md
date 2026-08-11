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

## Never

- Initiate, authorise, or advise on a money transfer. Lancelot **records payments that already
  happened**, nothing more.
- Invent a number. Unreadable means ask.
- Overwrite an existing row without naming the row and the old value.
- Abbreviate a bank account number or reference code.
