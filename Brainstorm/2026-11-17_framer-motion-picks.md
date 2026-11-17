---
confidence: high
checked: 2026-11-17
---
# Framer motion picks for KPM (2026-11-17)

**PROBLEM, his words:** *"i put framer and 21st dev to find some good animation for our app"*, then *"nvm use framer instead"*, then *"you search and give me the best 5 for the framer and ill choose"*.

**OPTIONS (sent 14:58, framer.com/marketplace, found by firecrawl search):**

| # | Component | Motion | KPM place |
|---|---|---|---|
| 1 | Odometer Counter FX (AliThemes, free) | each digit rolls on its own wheel | Stock Opname diff, Rupiah summary, Receivables totals |
| 2 | Sliding Tab Nav (Wael Tamzouk, free) | marker slides to the pressed tab | Receivables / Agent Profile / Map tabs |
| 3 | Modern FAQ Accordion (free) | spring row open | phone master-detail row |
| 4 | QuoteCartPro (paid, idea only) | toast in/out + self-drawing checkmark | "Count saved" / "Settled" reports |
| 5 | Tally Row (Bobob Apps, free) | count-up once | Reports / Command Center top line |

**COSTS:** Framer components are not React-liftable (Design Inspiration Sources.md), so every pick is a CSS rebuild. #1 is nearly free: the app already has the reel (theme.css "THE DIGITS SLIDE", BiohazardTheme.jsx SlidingDigit, 260 ms). #4 is half there: Toast.jsx already slides in (kpm-toast-in .26s); new part = SVG check drawn by stroke-dashoffset, success only.

**DECISION:** his words 15:0x: *"1 and 4 is simple and look good"*. Playable board https://claude.ai/artifact/2T7JgokaVn7pms3dqGcRN7 (repo `.claude/drafts/motion-picks.html`). Build waits on his ok of the board.

**REJECTED ON PURPOSE:** 2, 3, 5 (not picked). Using the `motion` library or the Framer code itself - JS animation escapes `html.lite-mode *` (taste file, the SlidingNumber clock story). A checkmark on a failed save - failure must never look like success; failed toast keeps the red edge + X.

Models applied: Opportunity Cost (reuse the clock reel instead of a second counter), Inversion (what makes a toast lie -> check on failure).
