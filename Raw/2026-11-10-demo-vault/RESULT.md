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
