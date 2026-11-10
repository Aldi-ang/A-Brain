# The demo vault + the nightly reset (2026-11-10, kpm 3ff452d)

His ask: *"i just want straight the login screen and do the intro just like usual, basically all the same just skip the password making , and test it all yourself"*.

| step | where | result |
|---|---|---|
| his screen: INITIALIZE VAULT as T1 | live demo | the company was EMPTY - settings/admin, tiers, shops, staff gone; 3 leftovers from the 2026-11-08 run (00-live-before-empty-demo.jpg) |
| "Reset demo now" (his OK) | live demo | 910 written in 4.9 s; T1 lands on MASTER VAULT unlock (01-live-after-reset-unlock.jpg) |
| owner vault doc deleted, T1 signs in | PC emulator, new code | MASTER VAULT unlock, not INITIALIZE VAULT; the app wrote the vault (02) |
| admin123 | PC emulator | WELCOME BACK + name dots (03), then Agent Capybara's demo intro (04) |
| real reset handler | PC emulator, tools/demo-reset-emulator.mjs | 34/34, incl. the settings/demoReset note |
| CHANGE 27 as Dika (T6), REST with his pane session | live demo | appSettings/tierRules 200 (was refused before his publish), appSettings/general 403, sales IN query 200 |

Not done live: a Dika sale through the UI - the T6 meets the vault gate, and a password is not typed on the public demo host. The 2026-11-09 emulator walk (Raw/2026-11-09-shop-level) covers the sale with the same rules.

## The full sale as Dika (T6), PC copy, 2026-11-10 (his "test it yourself ... tier 6 cant sell item when they are not closed to that stores so get creative")

geo.js answers every location read with AMANAH BARU's spot (-6.965387, 107.575909) -> the terminal says LOKASI COCOK, 0 m. Then 3 packs, the handover photo, SIMPAN TRANSAKSI.
Before: Unranked, last visit 2026-01-01, 3 sales. After: **Bronze**, last visit **2026-11-10** by **DIKA SAPUTRA**, 4 sales; the capybara said "LEVEL UP! AMANAH BARU EARNED B...". Frames mission-g01 (gate), g04 (receipt), g05 (after).
Trap: on a fresh visitor the capybara welcome covers the terminal - talk-through.js presses LANJUT until it is gone, before any tap.
