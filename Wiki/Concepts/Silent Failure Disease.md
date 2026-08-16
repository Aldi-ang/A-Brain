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

---

## Case: the gradient with no colour stops (2026-08-16)

**Symptom Aldi reported:** *"the folder in sampling ihave the same color with it background it is
not clear enough on the dark or light mode"*.

**Root cause:** `SamplingManager.jsx:500` carried `bg-gradient-to-br` with its `from-`/`to-` classes
gone — the automated palette migration dropped the colour stops and left the direction behind.
A Tailwind gradient direction with no stops compiles to a `linear-gradient` whose stops are
undefined, so **the element paints nothing and shows the page ground through it**. In light mode
`--ground #D2C9B4` sat directly behind a card meant to be `--raised #EDE7D8`, which is exactly the
"same colour as its background" he described. The card's 100px folder watermark made it worse: it
was `--ink` at `opacity-5`, i.e. 5% — invisible by construction in both themes.

**Why it is this disease and not a colour mistake:** there is no error, no warning, no failing
build, and no red in any linter. The CSS is valid. Only a human looking at the page can see it, and
only if they know what the card was supposed to look like. It survived a build, a 579-check audit
and a contrast self-check — every automated gate the project has.

**The fix that generalises:** an audit check that fails on any `className` containing
`bg-gradient-to-` with no `from-`/`via-` stop, scanning all of `src/`. Verified it goes RED against
the pre-fix file and green after — a check that could not have failed proves nothing. Named stops
(`from-gold`, `from-verified`) pass, so the app's existing custom-palette gradients are unaffected.
Only one file in the whole tree was actually broken.

**Transferable lesson:** when a migration DROPS classes rather than replacing them, the dangerous
leftovers are the classes that are *meaningless alone but still valid CSS*. `bg-gradient-to-br`,
a bare `border`, a lone `ring` — each renders something wrong rather than nothing at all, so
nothing errors. See [[Off-Token Colour Migration Map]] and [[Aldi's Design Taste]].

---

## Case: a transition on an element that was just created (2026-08-16)

**Symptom Aldi reported:** *"where is the animation for C and D"*. Two of four concept demos looked
completely static while the other two animated. Nothing was broken, nothing errored, and the CSS
was written correctly.

**Root cause:** the demos rebuild their DOM on every state change (`innerHTML = ''`, then repaint).
Concepts A and B expressed their motion as `@keyframes` **animations**; C and D expressed theirs as
CSS **transitions**.

    a CSS animation replays when an element is inserted.
    a CSS transition needs a previous computed value to interpolate FROM — an element born in
    its final state has none, so it just appears there.

So the key was created already `.turned`, the chain link created already `.forged`, and both
snapped to the end value with no motion. Same family as the envelope flap earlier the same day,
which had been worked around with a nested `requestAnimationFrame` — a workaround that itself
fails in a throttled or backgrounded tab, where rAF never runs.

**The fix, and the rule:** express state-change motion as keyframes, and gate it with a one-shot
class that is set only on the render following the event.

    st.anim = 'agentKey';           // set by the event
    ... class="keyhole turned just" // paint() reads st.anim
    st.anim = null;                 // cleared at the END of render()

`.turned` owns the end state; `.turned.just` owns the movement. Three properties fall out of it:
Lite Mode (`animation:none`) keeps the turned key and loses only the turn; re-rendering for an
unrelated reason — switching seats, resizing — never replays the animation; and there is no timing
workaround to go stale.

**Verified, not assumed:** `getComputedStyle(el).animationName` was read for every one —
`flapClose`, `slam`, `keyTurn`, `boltSlide`, `boltThunk`, `forge`, `tug`, `crackShake` — plus a
check that the class is absent after a seat switch, and that the JS run-counter still lands on its
final value in Lite where CSS cannot help it.

⚠️ **The general shape: a workaround that hides a mechanism mismatch will fail again somewhere
else.** The rAF patch made one envelope work and taught nothing, so the same fault shipped twice
more in the same file.
