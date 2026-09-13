---
title: Lift the Dialog, Never Push the Rest Down
description: The low-stock alarm strip painted across the top of the confirm dialog. The obvious fix (push the toast column down one layer) would have hidden five reports behind the vault password screen; the fix that shipped lifts the dialog instead. Also the map of every full-screen layer in KPM and the number it sits at.
type: concept
created: 2026-09-13
updated: 2026-09-13
confidence: high
checked: 2026-09-13
tags: [toast, confirm-gate, z-index, stacking, every-action-must-report, kpm]
---

# Lift the Dialog, Never Push the Rest Down

**The symptom.** The low-stock alarm (`⚠️ BOSS! <product> is critically low (N Bks left). Restock
needed!`) is sticky on purpose — no success word, so `isSticky()` keeps it until it is clicked. The
toast column sat at `z-[10000]`, the confirm dialog at `z-[9999]`, so while a question was open the
red strip lay across the top edge of the box he was reading. It never blocked a click (the column is
`pointer-events-none`); it only painted over. Reproduced in a frame on 2026-09-13.

**The near-miss.** The 2026-09-12 brief named the fix as "push the toast column down to
`z-[9998]` — the safe half, the whole job". Reading what else sits at `z-[9999]` showed it was not
safe: the vault password gate (`App.jsx:4238`, opaque black), Access Denied (`:4495`),
Offline-Unverified (`:4509`) and the Flight Recorder window (`:5112`). The gate raises five
`notify()` reports while it is still on screen — `handleSetupSecurity` ×2, `handleResetPin` ×2,
`handleVerifyOtp` ×1. At `z-[9998]` all five paint behind an opaque screen: "wrong reset word"
written where nobody can see it. That is five violations of [[Silent Failure Disease]] shipped
as a cosmetic fix, and no check would have gone red — the guard asserts `toast < dialog`, which
both edits satisfy.

**The rule.** A z-index move crosses EVERY layer between the old number and the new one, not just
the one you aimed at. Before moving a layer, list what sits at every value it will pass. In KPM the
answer is almost always: lift the thing that must be on top, never push the thing that was on top
down through its neighbours. `ExamineModal.jsx:72` already recorded the same instinct in 2026-08
("z-[10000], not z-[60] — the notification bell sits at z-[9999]").

**What shipped — `772ab0a`.** `ConfirmGate.jsx:124` `z-[9999]` → `z-[10001]`, with the reason in a
comment above the line. Side effect, correct: the dialog now also sits above `ExamineModal` and the
`MapMissionControl` side panel (both `z-[10000]`), where a modal question belongs. Aldi's choice, in
his words: *"do 1"* — after the first version of the question bounced with *"i dont understand your
coding words, speak human bro"* and was re-asked as a pile of paper where the top sheet hides the
rest.

**Guard.** Last block of `src/config/toastSeverity.selfcheck.mjs`: reads both numbers off the two
host lines, asserts each anchor was found, asserts toast < dialog. Red with the sources untouched
(56/57), 57/57 after. **Frame.** `?toast` in `tools/ponder-lab.jsx` mounts page + `ConfirmHost` +
`ToastHost` in `main.jsx`'s sibling order, raises the strip, opens a destructive confirm. Headless
Chrome at 820×300, both themes — the method in [[Looking at the App]].

## The layer map, as of 2026-09-13

| number | what sits there | file |
|---|---|---|
| `999999` / `999998` | agent profile full-screen editors | `AgentProfileView.jsx:698,723,758,769,858` |
| `99999` | the mascot | `CapybaraMascot.jsx:311` |
| `10001` | **the confirm / prompt dialog** | `ConfirmGate.jsx:124` |
| `10000` | the toast column · photo viewer · map side panel | `Toast.jsx:114` · `ExamineModal.jsx:76` · `MapMissionControl.jsx:1335` |
| `9999` | vault password gate · Access Denied · Offline-Unverified · Flight Recorder · notification bell panel · award form · journey full-screen | `App.jsx:4238,4495,4509,5112` · `NotificationBell.jsx:94` · `AgentProfileView.jsx:840` · `JourneyView.jsx:873-1015` |

The mascot and the profile editors still sit above the dialog. Not touched — no report of a
confirm being raised from inside either, and moving them is a separate decision.

**Tested by Aldi 2026-09-13 18:23**, his screenshot of the Inventory screen with `coba baru`'s
alarm up and a delete question open: *"now the question panel is on front of everything else and
dim all the background"*. The mascot bubble (`PROTOCOL ALERT: TIME FOR USB SAFE BACKUP!`) is
visibly bright above the scrim in that frame — he was told it is deliberate and did not object.

## Related

- [[Silent Failure Disease]] — the law the wrong fix would have broken five times
- [[Looking at the App]] — the frame is what turned "toast < dialog" into something seen
- [[Creating a Store Is Not a Visit]] — same session pair; both fixed at the cause, not the symptom
- Repo: `git show 772ab0a`
