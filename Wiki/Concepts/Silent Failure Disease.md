---
title: Silent Failure Disease
description: The KPM app's oldest and most expensive bug class — a code path that ends without telling the user anything. Aldi's design law, in his own words, is that silence is a bug.
type: concept
created: 2026-08-10
updated: 2026-08-10
confidence: high
checked: 2026-08-10
tags: [pattern, ux, discipline, error-handling]
---

# Silent Failure Disease

**Aldi's law, unprompted and repeated: every action must report. Silence is a bug, not missing
polish.**

The disease is a code path that ends without telling the user anything — a bare `return`, a
`catch` that only writes to the console, a validation that shakes a field but never says why.
On a desktop the user shrugs and retries. On a phone there is no console to open, so the app is
simply broken with no evidence.

## The scale of it in this codebase

| Wave | What was replaced | When |
|---|---|---|
| 58 `window.confirm()` | in-page `ConfirmGate` | 2026-08-07 |
| 11 `window.prompt()` | a typing field inside the gate | 2026-08-07 |
| 184 `alert()` | in-page `Toast` (`notify()`) | 2026-08-08, `e7f2eab` |
| 3 silent exits in `handlePinLogin` | real messages | 2026-08-10, `f460297` |

The last row is the point. After 253 dialogs were replaced, the disease was **still alive on the
screen every session starts at** — the login gate. It hid [[Secure Context Requirement|a
`crypto.subtle` failure]] for months.

## Why the browser dialogs had to go, specifically

A blocked browser dialog does nothing — the browser can suppress it, and then the code proceeds
as if the user answered. That is how duplicate data gets written with no explanation. This is a
locked decision: **never reintroduce `window.confirm` / `window.prompt` / `alert`.**

`notify()` is deliberately **not async** and must never become async. Many call sites are written
`return alert(msg)` → `return notify(msg)`; both return `undefined`, which is why the whole swap
was textual and no function needed converting.

## Where to look for the next instance

The disease hides in exactly three shapes. Grep for them:

1. `catch (e) { console.error(...) }` with nothing after it.
2. A bare `return` inside a handler, guarding a missing document or an empty value.
3. A validation whose only output is visual (a shake, a red border) with no words.

## Related

- [[Secure Context Requirement]] — the bug this disease concealed for months
- [[UI-Says-Yes-Server-Says-No Pattern]] — the sibling: the UI reports success the server never
  gave
- [[Aldi's Design Taste]] — "every action must report" is a taste law, not only a bug class
- Source: [[../../Raw/2026-08-10_source_kpm-six-days-aug04-to-aug10|the six-day source]]
