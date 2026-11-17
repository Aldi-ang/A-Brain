---
confidence: medium
checked: 2026-11-17
---
# The demo's top bars as one line

PROBLEM, his words (2026-11-17 08:37, screenshot of the 3D viewer under the bars): *"i think this top panel that show demo is really annoying since there is so many intersection with the main UI i think u need to redesign that one then everything else is fix to many spaces taken by those lines"*.

Today: the demo bar (34 px + a 3 px hazard tape) and the mission line (34 px) = 71 px over every screen, two borders and a dashed tape. Panels that start at the top of the window (the 3D viewer's X) slid under them; fixed the same day (kpm 593875e9) by starting them at --kpm-safe-top.

| Option | Height | Cost |
|---|---|---|
| ONE line (picture): DEMO + who (PC) + steps + ? Petunjuk + Switch | 40 px | "resets every night" moves into the Switch list; phone drops the name (it is in the list) |
| Keep two lines, drop the tape only | 68 px | barely changes what he called "too many spaces" |
| Hide the bars until hover / a corner key | 0-40 px | the guide's steps disappear - the demo's point is that they are seen |

Picture: Raw/2026-11-17-master-vault/demo-bar.html, artifact WEBH4YHN5V3E8mpH2gSRQv.

Models applied: Inversion (what would make it worse: hiding the steps), Second-Order (every screen's top padding reads --kpm-safe-top - one number moves them all).

DECISION: OPEN — waiting on Aldi (ok / what to change).

REJECTED ON PURPOSE: the hide-until-hover bar (the mission must stay visible); an A/B/C board (his one-picture rule).
