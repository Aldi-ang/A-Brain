---
date: 2026-10-02
status: OPEN — waiting on Aldi (A / B / C)
---

# The same message twice: capybara bubble + top panel (2026-10-02)

## The problem, in his words

*"btw i want u to fix the double notification, sometimes notification is from capybara and top panel together showing the same information"*

## Why it happens (read, not guessed)

`triggerCapy` (App.jsx ~3194) shows the capybara's bubble for every message AND, when `isFailure(text)` (utils/toastSeverity.js) matches, also calls `notify(text)` - the top panel. That second call is deliberate: the bubble disappears after 8 s and is not drawn on the vault screen or while cropping, so a "stock did not save" said only by the capybara could be missed ("he just stops being the only witness to the ones that matter"). The low-stock alert ("⚠️ BOSS! SURYA 16 is critically low...", App.jsx ~1503) contains ⚠, so it counts as a failure and shows twice. 69 places speak through `triggerCapy`.

## Options

| | What he sees | Cost |
|---|---|---|
| A (my pick) | warnings and failures only in the top panel (it stays until he taps x); the capybara keeps everything else (hellos, "Sync complete", tips) | the capybara goes quiet for bad news |
| B | the capybara says it; the top panel appears only when the bubble cannot be seen (vault screen, cropper) | a warning he misses in 8 s is gone; most complex |
| C | capybara only | the "stock did not save" kind of message can vanish unseen - the reason the top panel was added |

## Decision

OPEN — waiting on Aldi.

## Rejected on purpose

- Dropping the top panel for failures outright without his word: Chesterton's fence - it exists so a failure is never only in an 8-second bubble.

Models applied: Chesterton's Fence (why the double call exists before removing it), Inversion (which choice loses a message he needed).

## Answered 2026-10-02 ~01:45 — A, plus a bigger design (his)

*"i choose A and i want u to make new features toward the notification, i want the top panel notification to be timed for few second then fade and also for capybara, but then i want the notification bells to have 2 segment, 1 is for the confirmation request or handsoff request and all of the urgent notification, and the other one is for temporary notification that can be cleared, this is just to record all the missed notification to make sure that the user miss nothing what do u think about this tho"*

Read: the bell today = Firestore system notifications for this person + logistics (handoff) notifications (App.jsx combinedNotifications) - that IS his segment 1 already. Toast.jsx keeps failures until clicked (isSticky); his design lets everything fade because the bell's second segment records it. Verdict given: right call (transient strip + inbox is the standard shape). Costs put to him: (1) a faded failure is only safe if the bell shows an unread count on the "missed" side; (2) where the log lives - this device (free, private, instant) vs his account (follows phone<->PC, but every message becomes a database write + a rules change he publishes) - my pick device; (3) repeats (the low-stock line) merge into one entry with a count; (4) keep the last 100 / 7 days. Open: his answers on where + seconds, then the bell drawn as pictures.
