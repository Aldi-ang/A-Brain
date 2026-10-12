---
title: The tutorial book - presses lost, X dead, blank page after a ribbon
status: DECIDED - his "go", built kpm b82ad65
tags: [kpm, ponder, tutorial-book, bug, brainstorm]
---

# The tutorial book: dead presses and the blank page

**Problem, his words (2026-10-12 ~07:00, two PC screenshots):** *"btw i found another huge problem. the ponder book is not responding on press and after the panduan and there is no downloading resources status if needed and also i cant press the X button on the top right and after entering the book and choosing other section sometimes the page doesnt load and show this blank page instead"*

**Reproduced in headless Chrome, 1280x800, lab `?book` (scripts in `Raw/2026-10-12-ponder-book/`), no app code changed:**

| # | Symptom | Cause (measured) | Where |
|---|---|---|---|
| 1 | X, the ‹ › arrows and the tutorial cards ignore a real press (book stays open, page stays, no tutorial opens) | each of those buttons shrinks while pressed (`active:scale-[0.97]`, cards also `hover:-translate-y-[3px]` + `active:scale-[0.985]`). Inside the 3D page, a button that transforms stops being found under the pointer: the press STARTS on the button and ENDS on its parent row (event log: pointerdown -> BUTTON[Close], pointerup / click -> the header DIV), so no click fires. A script `.click()` on the same X closes the book - the handlers are fine. With the press-shrink switched off in the lab: X closes, next turns to 3/17, a card opens its tutorial | src/ponder/PonderBook.jsx:1027 (X), :1045 (cards), :1070 / :1080 (‹ ›) |
| 2 | after a ribbon, the left page is blank and the old chapter's right page stays (his 2nd screenshot: VAULT ribbon lit, 4/17, Restock cards) | the opening animation (the sheets unfold as the book arrives) uses `fill: 'both'` and is never removed - 4 finished animations keep holding the sheets where they were at opening. A ribbon jump moves the sheets by React style only, and a held animation outranks a style, so they never move. Cancelling those 4 by hand in the lab -> the Vault chapter appears. Exposed by `40f8df1` (the ribbon stopped riffling page by page - the riffle's own animations used to replace the held ones) | src/ponder/PonderBook.jsx:620-628 (`parts.forEach ... fill: 'both'`), :957 (`pickSection` commits with no animation) |
| 3 | "no downloading status" | nothing in the book downloads - every chapter and tutorial ships inside the app (static imports, src/ponder/registry.js). The blank page is #2, not loading. A loading indicator would never show | - |

Phone (below 768 px) uses the pad (PonderPad.jsx), which has no 3D: #1 and #2 are PC / tablet only.

**Fix proposed (no visual change):** (1) keep the press-shrink look but put it on an inner layer that does not take the pointer, so the button itself never moves - X, ‹ ›, cards; (2) the opening's sheet animations hold only BEFORE they start (`fill: 'backwards'`) or are cancelled on finish, like `play()` already does. Guards: a selfcheck that no button inside the 3D stage carries a transform class, and that the opening's sheet animations do not hold after they end; a headless walk: X closes, next turns, a card opens its tutorial, ribbon VAULT shows the Vault chapter on both pages.

**Decision:** his *"go"* (2026-10-12 07:06). **BUILT** kpm `b82ad65` (local): the X, the arrows and the cards keep their look on an inner `pointer-events-none` layer (`group-active:scale-[0.97]` / cards `group-hover:-translate-y-[3px] group-active:scale-[0.985]`), the buttons themselves never transform; the opening unfold fills `backwards`. Walk with real mouse presses, nothing injected: 12/12 (`Raw/2026-10-12-ponder-book/walk-book-fix.mjs`, frame `book-vault-1280.png`). Guard: logicFixes "THE TUTORIAL BOOK ANSWERS EVERY PRESS" (red on the old code). General rule worth keeping: inside a `preserve-3d` page, a control must not transform itself - put the motion on a child that takes no pointer.

**Rejected on purpose:** a "downloading" indicator - nothing downloads, it would never appear, and it would hide the real fault.

**Models applied:** Inversion (what makes a press vanish: target moved between down and up - the event log proved it); Chesterton's Fence (the ribbon's direct jump `40f8df1` is his call, kept - the fix is the held animation it exposed, not the jump).
