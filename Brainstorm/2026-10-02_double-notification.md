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
