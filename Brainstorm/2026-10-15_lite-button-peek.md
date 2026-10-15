---
title: Lite button in the top bar that hides and peeks
created: 2026-10-15
status: OPEN - waiting on Aldi (A / B / C, and how often it peeks)
tags: [kpm, design, lite-mode, top-bar, brainstorm]
---

# Lite button in the top bar that hides and peeks

## The problem, in his words

2026-10-15 07:5x: *"i want the lite mode button to be available on the main panel on top but i want this button to be hidden somehow but have some animation to show it for a few second and hides again just to show that the button is there but without taking too much space"*

Today Lite Mode lives only in Settings (`App.jsx:1505` state `isLiteMode`, `kpm_lite_mode` in localStorage, passed to `SettingsView` at `App.jsx:5436`). The top bar's right cluster is `BiohazardTheme.jsx:1018-1069`: tutorial book, sync pill, light/dark switch, bell, clock - every chip 44 px.

## What any version must obey (from his taste file)

- **An animation must never OWN visibility** (Lite law corollary): Lite kills every transition, so a button that only appears through the peek would vanish for good the moment Lite is on - the one time he needs it to switch back. Every option keeps a visible mark while Lite is on, carried by a state class, not by motion.
- **Lite freezes everything heavy, CSS or not** - C's decoding text is JavaScript, so it is skipped in Lite too.
- **Space is the reason** (2026-08-31 tutorial-chip removal: *"to save space"*) - the bar is the most contested strip in the app.
- **Every action must report** - each toggle shows a message ("Lite Mode ON · animations paused").
- **"Tech" = decoding text, scans** (2026-09-29) - C uses that.
- **Touch targets 44 px** - the sliver and the tab are thin but carry a 44 px invisible tap area.

## Options (live mock-up: https://claude.ai/artifact/1N2LcKzXiK9C7bknQXiqJb)

| | What it is | Space in the bar | Opening it later | When Lite is on |
|---|---|---|---|---|
| A · Sliver | 12 px strip beside the light/dark switch; the button folds out of it (clip-path, right to left) | 12 px | PC: hover. Phone: tap strip, then tap LITE (2 taps) | strip turns solid amber |
| B · Pull-tab | 34 x 11 px tab hanging under the bar's bottom edge, under the switch; the button drops down over the page | 0 px | PC: hover. Phone: tap tab, then tap LITE (2 taps) | tab turns solid amber |
| C · Status line | the "SYSTEM ACTIVE" line above the page title is the button; it decodes into "LITE MODE · OFF · TAP" and back | 0 px | one tap on that line | reads "SYSTEM ACTIVE · LITE" in amber |

## What each costs

- A: 12 px on every screen, two taps on the phone; the most obviously "a button".
- B: covers a strip of the page for the peek's few seconds; the tab is the smallest visible mark of the three.
- C: nothing in space, one tap; risk - a status line does not look pressable, so the peek is what teaches it, and an accidental tap flips Lite (the message says so at once).

**My pick: C** - zero space where the phone is tightest, one tap, and it reuses the decoding-text "tech" look he chose. not-chosen: A - lost on 12 px plus two taps on the phone; flips if he finds a tappable status line too hidden after a week.

**Second question:** how often it peeks. Every app open is tens of times a day for a salesman (Emil's frequency rule: that much repetition should barely animate). Suggested: the first open of each day.

## Decision

OPEN - waiting on Aldi.

## Rejected on purpose

- A peek driven only by the animation (`opacity: 0` base + `forwards`) - Lite would delete the button.
- Making the hidden button expand by changing its width - it would shove the bell and clock sideways mid-peek; A and B overlay instead.

Models applied: Inversion (what makes a hidden button fail - Lite stops the reveal, a phone has no hover), Second-Order Thinking (a peek on every open becomes noise), Opportunity Cost (12 px vs zero).
