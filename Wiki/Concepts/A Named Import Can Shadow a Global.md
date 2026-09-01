---
title: A Named Import Can Shadow a Global
description: `new Map()` in PonderBook.jsx built a lucide icon instead of a hash map, because the file imports an icon called Map. The build was green, every check passed, and the book rendered as a black screen.
type: concept
created: 2026-09-01
updated: 2026-09-01
confidence: high
checked: 2026-09-01
tags: [bug, javascript, imports, ponder, verification]
---

# A Named Import Can Shadow a Global

**The one line:** an import binds a name at module scope, and module scope beats the global object.
A file that imports something called `Map`, `Set`, `Image`, `Promise`, `Text`, `Range`, `Event`,
`Node`, `Option` or `Notification` no longer has the global of that name — it has the import.

## What happened

`src/ponder/PonderBook.jsx` imports icons from lucide-react, and the Map War Room's ribbon needs
one called `Map`:

```js
import { X, ChevronLeft, ChevronRight, Lock,
         LayoutGrid, Map, Route, Truck, ... } from 'lucide-react';
```

The book rebuild added a register of live sheet elements and reached for the obvious thing:

```js
const leafEls = useRef(new Map());
```

`Map` there is a React component. `new <component>` throws
`TypeError: p1 is not a constructor` — `p1` being what the minifier had called the icon. The
component threw during render, React unmounted the tree, and the whole tutorial book was a black
screen.

## What it cost, and what did NOT catch it

- `npm run build` — **green**. It is a run-time type error; nothing static can see it.
- 707 integration checks and 986 self-checks — **all green**. They read the source, and the source
  is legal JavaScript.
- The only thing that caught it was **opening the page and looking at it**, which is the whole
  argument in [[Looking at the App]] and the reason the Ponder lab exists.

## The fix, and the rule

A plain object, which needs no name from anywhere:

```js
const leafEls = useRef({});
```

**The rule worth keeping:** before using a global constructor in a file, check the import block for
that name. It is a two-second look, and a shadowed global fails only at run time — the failure mode
is a blank screen, not a red build.

**Related shape:** this is the same family as [[An Effect's Own Cleanup Can Cancel Its Frame]] and
[[The Shell Repaints Any White It Can Reach]] — a fault that every check reports as healthy because
every check is looking at the wrong layer. See [[Anti-Recurrence Check]].

See also: [[The Book as a Stack of Sheets]] · [[Looking at the App]] · [[Ponder Tutorial System]]
