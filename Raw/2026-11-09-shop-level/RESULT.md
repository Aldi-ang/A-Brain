# The shop after a sale - walked on the demo emulator (2026-11-09)

His ask: *"okay make sure that both features works well especially the leveling system that we design"*.
Phone 390x844, signed in as Dika (T6), the repo's draft rules (CHANGE 27) on the emulator. `db.mjs` sets/reads the data.

| case | before the sale | after Dika's 3-pack sale (Rp 690.000) |
|---|---|---|
| level targets ON (Bronze = Rp 50.000 in 90 days, Epic = 20M, Mythic = 50M, Grandmaster = 50 Bal in 30 days) - AMANAH BARU | Unranked, last visit 2026-01-01, Rp 11.87M in 90 days | **Bronze**, last visit **2026-11-09**, by **DIKA SAPUTRA** (Rp 12.56M: above Bronze, below Epic) |
| no level targets saved - ANEKA BARU PANJI | Unranked, last visit 2026-01-01 | Unranked (no targets = no level step), last visit **2026-11-09**, by **DIKA SAPUTRA** - before the fix nothing was saved here, for anyone |

Frames: L00-order.png (the order drawer), L01-receipt-after-deal.png (the sale's receipt), L02-before.png.
Walk scripts: pick.js / cart.js / open-order.js / deal.js / close-receipt.js through `../2026-11-08-demo-walk/drive.mjs run`.
Traps met: the terminal keeps a desk copy of SIMPAN TRANSAKSI off to the left (x -170) - tap the copy inside the screen;
the phone's deal key lives in the PESANAN drawer on the left edge; the shop list's first button is "Selesai".

His call, 2026-11-10: *"yes only sales raise the shop level"* - a sale only RAISES a level; lowering stays the monthly Season Rank Audit on the map.
