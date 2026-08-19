---
title: The Named Path Was Already Shut
description: A bug report names the control it noticed. The sibling controls that reach the same write are where the defect actually lives.
type: concept
created: 2026-08-19
updated: 2026-08-19
confidence: high
checked: 2026-08-19
tags: [pattern, discipline, money, eod]
---

# The Named Path Was Already Shut

On 2026-08-19 a prepared brief said: *a double-tap on Send submits the EOD twice, because
`EODAgentFlow` declares a `submitting` prop and `EODReconciliationView` never passes it, so
both guards are dead.* Half of that was true. The prop **was** dead. The Send button **was
not** the hole.

`send()` in `src/components/EODAgentFlow.jsx` sets `stage` to `'launching'` in the same
discrete-event flush, and `EODLetter` renders the Send button only while `stage` is
`'sealed'` or `'launching'`, with `disabled={disabled || stage === 'launching'}`. React 19
flushes a discrete click before dispatching the next one, so the second tap of a real
double-tap already met a disabled button — and at `'sent'` the button unmounts entirely.
Wiring `submitting` into that path changes nothing a person can reach.

## Where the money actually leaked

`src/EODReconciliationView.jsx` had **three** controls calling `onSubmitEOD`. Only one was
named in the brief.

| Control | Guarded before? | Why |
|---|---|---|
| The letter's Send | yes, by accident | its own `stage` disabled it, then unmounted it |
| **Pay Bounty** | **no** | called `onSubmitEOD` from `onClick`, changed no local state, stayed mounted and enabled for the whole Firestore round-trip |
| **"Submit stamps & fines"** (legacy cukai) | **no** | same shape |

Two taps on either unguarded button wrote two `PENDING` reports on the same night — a
duplicated BOUNTY payment or a duplicated CUKAI handover, which the admin then unpicks by
hand. That is the money bug the brief was reaching for, at an address it did not have.

## The rule this leaves behind

**Read the symptom as a claim about a WRITE, not about a BUTTON.** Before guarding the
control a report names, list every caller of the write it reaches. One guard where all
callers converge is a smaller diff than a guard per caller — and patching only the named
path leaves every sibling still open, now with a passing check next to it saying the class
of bug is handled. That is worse than not fixing it, because it stops the next reader
looking. Same instinct as [[Anti-Recurrence Check]]: the claim has to be checked, not
inherited.

Fix shipped as one `submit(...payloads)` gate in `EODReconciliationView`, holding a
`submitting` flag across the awaited writes and reopening in a `finally`. The letter's CUKAI
document became a second **payload** rather than a second call, because as two calls the flag
cleared between them and the door reopened mid-submission.

Pinned by **S25** in `src/config/logicFixes.selfcheck.mjs` — eight guards proven red before
the edit (344/352), green after (352/352), plus a behaviour check that two rapid submissions
post one report. Each button guard is scoped by slicing the source between that button's own
handler and its own label, per the S24 lesson about file-wide matches catching bystanders.

## Still open, found while here

When a write fails, `handleSubmitEOD` in `App.jsx` notifies — but the letter has already
marched to `'sent'` and its Send button has unmounted, so the agent cannot retry. A failed
submission looks like a successful one. That is [[Silent Failure Disease]] wearing a success
animation, and it needs its own job.

Commit: `4c12840`.
