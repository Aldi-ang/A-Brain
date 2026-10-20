---
date: 2026-10-20
status: DECIDED A, built kpm 50ae2e0 (not pushed)
---
# The Journey map's keys painted over the Master Vault screen

## The problem, in his words
> *"i found bug look at this . it is gone tho after few seconds"* — his screenshot (PC): the Master Vault card ("New version found - updating... · 08edae7"), and on top of it the Journey Plan map's PC toolbar: FULLSCREEN, BORDERS (gold, focused), SET HOME, FLY HOME.

## Cause [certain, read 2026-10-20 10:17]
- The vault screen: `src/App.jsx` ~4560, `fixed inset-0 z-[9999]`.
- The Journey toolbar: `src/JourneyView.jsx` ~1242, `.kx-keys absolute top-4 right-4 z-[9999]` - the SAME layer number, so whichever sits later in the page paints on top. The Journey Plan is mounted behind the vault screen (the app shell keeps rendering under it).
- Six more layers sit at or above 9999 and can do the same when their screen is the one behind the vault: `MapMissionControl.jsx` z-[10000], `AgentProfileView.jsx` z-[999999] x4 and z-[999998], `CapybaraMascot.jsx` z-[99999], `ExamineModal.jsx` z-[10000], other JourneyView / BiohazardTheme / NotificationBell z-[9999].
- Why it went away after a few seconds [guessing]: the update reload ("New version found - updating...") rebuilt the page.

## Options
| Option | What | Cost |
|---|---|---|
| A (recommended) | While the vault screen is up, hide the app behind it (not unmount - data keeps loading) | one place; covers every layer today AND every future one. Must check that nothing meant to show over the vault lives inside the shell (toasts, confirm dialogs, the unlock sequence) |
| B | Raise the vault screen above every number (> 999999) and lift the confirm dialog + toasts above it | numbers in 3 files; the next screen that picks a bigger number breaks it again |

## Decision
DECIDED 2026-10-20 ~10:25: A, his words *"A is better option"*. Built kpm `50ae2e0`: BiohazardTheme marks html.kpm-gate-up while the gate is up; theme.css hides .biohazard-content and every body-level popup, the gate (.kpm-gate) stays drawn; confirm box + toasts live in #root so they still show. Lab ?shell&gate: RED before (toolbar and popup on top), GREEN after.

## Rejected on purpose
- Lowering only the Journey toolbar's number: fixes one of seven offenders.

Models applied: Inversion (what else can paint over the vault? -> the z-index census above), Second-Order Thinking (B invites an arms race of numbers).
