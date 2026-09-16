---
title: Nota scan (CamScanner-style) and tracking goods by production date
type: brainstorm
created: 2026-09-15
status: DECIDED 2026-09-15 09:41 — scan A + levelling shipped (3bac5b7, 39dc277); lot tracking = FIFO-only pre-selected recommendation with manual pick, build AFTER the phone sweep
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

**Decision (2026-09-15 08:50):** *"nota scan = A keep the storage small to minimize firebase
cost"*. Shipped as `3bac5b7`: `helpers.scanPixels` (local-mean threshold, two box sizes, paper →
white, ink → black) + `scanNotaToBase64` (800 wide, JPEG 0.5, scan only — the original never
leaves the phone), wired to the nota only. Proof `?nota-scan` in the ponder lab; maths in
`src/config/notaScan.selfcheck.mjs`. What stays for B: the dark band where the table meets the
paper's edge — a crop removes it.

**Reopened 10:15 — B is wanted after all, his words on the first real scan:** *"is it possible
that u make the scanner automatically align and make sure the receipt to be square and 2D like in
plain paper … there is no pressable or interaction button on the preview photo or maybe the edit
button like camscanner have"*. The A scan of a 40° perspective shot stayed crooked: `deskewAngle`
covers ±15° and perspective is not a rotation. Plan (in `.claude/NEXT-SESSION.md`): pure-JS corner
finding (Otsu → largest bright blob → convex hull → best quad) + homography warp + scan, with a
manual corner editor as the fallback — no OpenCV (8 MB) needed for this.

**B SHIPPED 2026-09-16 as `a267298`** (kpm-inventory). `helpers.findPaper` (Otsu → largest bright
blob → hull of each row's outer pixels → hull ≤ 24 → the 4 points with the biggest quad; null on a
sticker < 15 % of the frame, an L (blob under 80 % of its quad), or a frame-filling sheet > 95 %),
`helpers.homography` (Heckbert's closed form), `helpers.warpQuad` (bilinear, ≤ 800 wide; one cycle
of the corner order = a 90° turn), `helpers.loadNotaPhoto` (one decode at ≤ 1600, shared).
`PhotoField` grew SESUAIKAN → `CornerSheet` (dialog language, 4 × 44 px pointer handles, ATAS on
the top edge, PUTAR 90°, BATAL, PAKAI → rescan → `onFile(file, scan)`), and an asli / scan switch.
notaScan 22/22, logicFixes 1547/1547, audit 722/722. PC timing at 1600×1200: findPaper 8 ms,
warpQuad 19 ms. Three things learned building it:
- **The hull-ratio test does not catch an L.** An L's hull is nearly a quad, so "quad ≥ 60 % of
  hull" passes; what catches it is "the blob fills ≥ 80 % of its best quad". A sheet fills its quad.
- **scanPixels must run AFTER the warp.** The scan paints the table black and the paper white with
  a dark halo — the one picture Otsu must never see. Guarded by order in logicFixes.
- **Corner precision is ± one sample step** (≈ 5 px at 1600), and the error lands INSIDE the
  sheet, so the warp loses a hair of margin and never a band of table.
Known limit, waiting on his real-nota test: the sheet must be the BRIGHT class. A white desk merges
table and sheet → quad fills the frame → null → old path (the editor still opens, frame corners as
the default). If his phone shows that, the next step is an edge-based finder (Sobel + the same
hull/quad), not a threshold tweak.

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

**Decision (2026-09-15 08:50):** *"yes either FIVO or FEVO should be able to use as option to
manage the regional warehouse and master vault"* — the SYSTEM decides which lot leaves, and the
rule (FIFO = oldest production date first, FEFO = nearest expiry first) is a setting. So option C
is out; the choice is between A (stock split per lot everywhere) and B (a lot ledger beside the
stock number). **Recommended shape, not yet approved:** B first — a `lots` ledger per product per
place, fed by `productionDate` on every intake line (required, like `batchNo`), decremented
FIFO/FEFO on every movement, with the chosen lot PRINTED on the surat jalan so the loader takes
the box the paper names; the `stock` number stays the truth for today's screens; reports read
the ledger. A becomes possible later on the ledger's data.

**Refined 09:15, his words:** *"make sure that the regional admin and the restock sender can
choose which product with specific production date/batch to be sent or carried to the agent
inventory, there will be update needed is some components that we have"*. So it is NOT system-only:
the PERSON picks the batch on every KIRIM line and every load-to-agent line; the setting
(FIFO/FEFO) only pre-selects. That makes lots VISIBLE per product at Master Vault and Regional
Warehouse — option A's shape (stock per batch), not the invisible ledger. Mock rendered for him:
`lot-mock.png` (KIRIM line with a batch picker, TERTUA pre-selected; load-to-agent the same; a
Settings switch FIFO/FEFO; the list of components that change). Owed: his yes on the mock and
"now or after the phone sweep".

**Also shipped 09:24 (`39dc277`):** the scan is levelled — `helpers.deskewAngle` + rotate by its
negative; a photo taken with the phone sideways is upright already (the browser applies the
camera's orientation tag). His words: *"make the photo upright so that its easier to read … if
took the photo on landscape or potrait it will stay upright"*.

**Closed 09:35–09:41, his words:** *"looks cool tbh u can add that lot tracking later"* (the mock is
the shape; build after the sweep) and, told that FEFO equals FIFO for one product with a fixed
shelf life: *"yeah thats why bruh fivo or fevo doesnt do shit actually lol just add one of those or
something and also this is should just work as recommendation and preselect the batch where
actually the regional admin can manually choose from the selection tab right"*. **Final shape:**
FIFO only, no setting; the oldest production date is pre-selected as a recommendation on every
KIRIM and load-to-agent line, and the sender picks any other batch from the list. The surat jalan
prints the batch that was picked. Rejected on purpose: FEFO and the Settings switch.

**Models applied (2026-09-15, thinking-partner):**
- *Reversibility* — splitting `stock` per lot touches every stock write and needs a migration:
  a one-way door. A ledger beside the number is a two-way door (delete it, nothing breaks). That
  is why B before A.
- *Second-order thinking* — FIFO on paper is only true if the loader takes the box the paper
  says. So the lot goes ON the surat jalan; the paper drives the hands, not the other way round.
- *Chesterton's Fence* — `batchNo` already exists at intake (PO number). Keep it; add the date
  beside it rather than repurposing it.
- *Pre-mortem* — "a year on, every report says unknown lot": intake staff left the date blank.
  Make it required at intake (the same `:493` list that requires `batchNo`), or default it to
  the PO date with a visible flag.
- *Opportunity cost* — built now it displaces two sweep screens; parked behind the sweep, his
  order.

**Parked with it (his words):** *"i was thinking on redesign the method the regional admin fill
the agent inventory but we'll decide first if this really needed or not in the app"* — not a
job until he says it is.

**Rejected on purpose:** expiry-date as the key — cigarettes carry a production date, not an
expiry; and the existing `expiryDate` field on the PO is per delivery, not per product line.

## Where this goes next

Both are parked behind the phone sweep in `.claude/NEXT-SESSION.md`. When he answers, the
brainstorm becomes a Concept page and the queue entry becomes the one job.
