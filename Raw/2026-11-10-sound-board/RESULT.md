# Sale sound board, round 1 (2026-11-10 08:54 WIB)

His ask (2026-11-09 21:02): *"redesign the capybara voice with the new skills that we have because it is annoying AF and
also redesign the transaction complete when receipt shows up because it is too loud and long"*.

Board: https://claude.ai/artifact/3s4aXiddpLFTCtuGUnq3mJ (v2). Built by `build-board.mjs` from `board-template.html`
(scratchpad copy; inlines sign.mp3, the 3 cues, the 61 capy syllables, tools/chip.js, CAPY_VOICE). Render at 380 px:
`board-380px.png` (headless Edge has a 510 px minimum window: render inside a 380 px iframe).

## Measured

- Today: `sign.mp3` 4.13 s (sound 0.11-2.15 s, then 2 s silence), peak -2 dB, mean -32.2 dB, played x2.16
  (VOLUMES .9 x BOOST 2.4) = mean ~-25.5 dB and clipped; the capybara mumbles 0.52 s later.
- New cues, cut + 4 ms fade-in + fade-out, levelled to mean ~-30 dB (his msgIn sits at -29.2), peak cap -6 dB:
  R1 his pen, first stroke (sign.mp3 0.09-0.58 s) 0.49 s · R2 Kenney Pizzicato jingle PIZZI00 0.49 s ·
  R3 Kenney RPG handleCoins (0.04-0.74 s) 0.70 s.
- Capybara (voicelen.mjs, 10 real lines x 40 seeds): today avg 1.59 s, max 2.68 s. Option A (first sentence only,
  maxSyl 5) avg 1.11 s, max 1.77 s, every sentence still >= 3 heard words. A plays at 0.6 of today's gain.
- Capybara talks today on: every sale (MerchantSalesView ~1346), every non-failure app message (App.jsx triggerCapy),
  cart chatter up to every 6 s (MerchantSalesView ~563), an unasked pop-up every 90-210 s (CapybaraMascot ~208).
  Capy syllable elements are made after the gain stage, so they are NOT boosted (element volume = plan gain).

## Options on the board (my picks marked)

Receipt: today / **R1** / R2 / R3 · Voice: today / **A** / B kokoro (locked: needs ~115 MB download, his OK) / C silent ·
Talks on: sale (rec off) / **news** (rec on) / cart (rec off) / pop-up (rec off). Kokoro has no Indonesian voice in my
knowledge; the lines are English - check the release notes before promising.

Waiting on his copied pick line ("Receipt R1 · Voice A · Talks on: news").
