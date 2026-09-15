---
title: Nota scan (CamScanner-style) and tracking goods by production date
type: brainstorm
created: 2026-09-15
status: OPEN — waiting on Aldi
tags: [brainstorm, restock-vault, master-vault, regional-warehouse, photo, lot-tracking, phone]
---

# Two feature asks from the phone sweep, 2026-09-15 08:20

Both came in one message with the Restock Vault phone review. Neither is decided. Written the
moment the options were produced, so the next session does not pay to re-derive them.

## 1. The nota photo — "like what CamScanner have"

**The problem, his words:** *"for nota photo is it possible to make feature like what camscanner
have? so its scan the nota and make it clear instead of just normal photo, that way it will be
easier to see for the user right"*.

**What exists:** the intake form takes a nota photo and a package photo, runs each through
`compressImageToBase64` (`src/utils/helpers.js`, called from `RestockVaultView.jsx:602/609/685`),
and stores the base64. No processing beyond resize + JPEG quality.

**What CamScanner actually does, in two parts:** (a) finds the paper's four corners and
straightens it (perspective correction); (b) turns the photo into a clean "document" — grayscale,
local contrast, whitened background, darkened ink (adaptive threshold / "magic color").

| Option | What the user gets | Cost | Cheap phone | Offline |
|---|---|---|---|---|
| **A — clean-up only** (recommended first) | (b) alone: the nota becomes a crisp black-on-white scan; a tilted photo stays tilted | ~80 lines of canvas code in `helpers.js`, no new dependency; a 1600 px image in well under a second | yes | yes |
| **B — full scan** | (a) + (b): straightened and cleaned | OpenCV.js (~8 MB wasm, one-time download, cached by the service worker) or `jscanify` on top of it; corner detection fails on cluttered backgrounds and needs a "drag the corners" fallback UI | slow first load, heavy CPU on cheap phones | yes after first load |
| **C — cloud** | best quality | a server or paid API; the app's rule is no third-party cloud for customer data | n/a | **no** — a salesman with no signal cannot take a nota |

**Costs he has not priced:**
- Storage: keep the original AND the scan doubles the photo bytes per intake. A scan compresses
  much smaller than a photo (mostly white), so "scan only" is cheaper than today — but the
  original is the legal evidence if the scan ever misreads a digit. Recommendation: store the
  scan, keep the original only until the intake is saved (memory, not storage).
- Lite Mode: none of this is animation; it runs on save, once. Not affected.
- The package photo (`packageFile`) is a photo of goods, not a document — the scan filter would
  make it worse. Apply only to the nota.

**Decision:** OPEN. The question for him: A now (clear, not straightened), or wait for B
(straightened too, 8 MB heavier app)?

**Rejected on purpose:** C (cloud) — offline is a hard rule for the field terminal
([[Secure Context Requirement]] and the offline-auth work).

## 2. Goods by production date — lot tracking through the chain

**The problem, his words:** *"i want u to add this to the regional warehouse and the master vault
soon, i want some features to differentiate goods with different production date so that we are be
able to detect which product with the specific production date is actually distributed for each
specific stores this way when there is some complain we have information on which product with
specific production date is actually perform better or less and also help the user to track each
distribution of older items right"*.

**What exists (checked 2026-09-15):**
- Intake lines already carry a `batchNo` per line, required (`RestockVaultView.jsx:493` — "batch
  tiap baris"), defaulting to the PO number (`:381`). The PO has an `expiryDate` field (`:250`).
- But stock is ONE number per product: intake does `stock: increment(qty)` (`:625`), a sale does
  `stock: newStock` (`useTransactionEngine.js:371`), and shipments/loads move plain quantities.
  **The batch is written on the intake document and never travels.** Nothing today can say which
  batch went to which branch, van or store.

**The shape of the feature:** a "lot" = (product, production date). Stock becomes a set of lots
per place. Every movement — HQ → branch, branch → van, van → store — names the lot(s) it moved.
Reports: per store, which lots were delivered; per lot, which stores got it; age of stock per place.

| Option | How the lot is known at each move | Touches | Cost | Truth |
|---|---|---|---|---|
| **A — full lot stock** | stock split per lot everywhere; each shipment/load/sale picks lots, FIFO by default (oldest first), user can override | Restock Vault intake, shipment (surat jalan), Branch Warehouse, agent load, the sale engine, EOD, Stock Opname, Reports, every `stock` write | large — every stock write in the app, plus a migration for existing stock (one "unknown lot" per product) | exact, if people honour FIFO |
| **B — lot on the paper only** | stock stays one number; the surat jalan and the sale record the lot(s) derived FIFO from intake history | shipment + sale + a lot ledger; no stock split | medium — a ledger of lots per product per place, decremented FIFO; existing screens unchanged | assumed FIFO — wrong the day a salesman sells the newer box first |
| **C — record what actually left** | the person moving the goods types or scans the production date on the box at shipment and at sale | shipment line + sale line get a date field; reports read it | small — two fields and a report | as true as the person; skipped fields = blind spots |

**Costs he has not priced:**
- Data he has to READ: A and B both need the production date typed at intake (batchNo is a PO
  number today, not a date). Without it, everything downstream is "unknown lot".
- Stock Opname: with A, counting becomes counting per lot — more work per shelf.
- The sale engine is the money path; A changes it. Two independent checks before merging, per
  the rules.
- Migration: every existing product's stock becomes one lot of unknown date on day one.

**The question that shapes it (ask him first):** when goods leave a place, does the SYSTEM decide
which lot left (FIFO, options A/B), or does the PERSON record which lot actually left (option C)?
His complaint-tracing goal needs the truth, and a warehouse that mixes boxes makes FIFO a guess.

**Decision:** OPEN. Recommended: C first (production date on the surat jalan line and the sale
line, report by lot per store) — it delivers the complaint-tracing report in days, and A can be
built on the data C collects if FIFO turns out to hold in practice.

**Rejected on purpose:** expiry-date as the key — cigarettes carry a production date, not an
expiry; and the existing `expiryDate` field on the PO is per delivery, not per product line.

## Where this goes next

Both are parked behind the phone sweep in `.claude/NEXT-SESSION.md`. When he answers, the
brainstorm becomes a Concept page and the queue entry becomes the one job.
