---
date: 2026-10-10
status: OPEN - waiting on Aldi (two facts first, then a fix pick)
tags: [kpm, master-vault, offline, toast]
---

# "on this device only" after saving a product description

**Problem, his words (21:49, live site after the 20:41 push):** *"why is this notification shows up tho after i tried to update the description"* - toast: "American Spirit - Turquoise is on this device only — it has NOT reached the server yet, and will sync when the connection returns."

**Mechanism (checked in code, no change made):** `handleSaveProduct` (`src/App.jsx` ~3561) waits only **1.5 s** for the server's acknowledgement (`App.jsx:3606-3608`, added 2026-08-08 `c319b29` so an offline save stops looking dead), then shows "device only" if none came. Every save re-sends the product's PHOTOS: `data.images = { ...editingProduct.images, ...tempImages }` (`App.jsx:3582`) - photos are stored as text inside the product record (American Spirit's are ~131 KB in his backup). Changing one word of description uploads ~130 KB+ again; on a phone or busy connection that passes 1.5 s. The code comment already named this ceiling: *"make it adaptive only if a slow connection starts reporting 'not sent' for writes that did land"*. Not caused by the 20:41 push - the save code is unchanged; the new description box only made him use this path.

**CONFIRMED by him (21:4x): no red "NOT saved" message, the description is there after a reload - the write landed; only the 1.5 s message was wrong.** Was [likely]: the write landed a moment later. A real failure would add a second message `"<name>" was NOT saved. <reason>` (`App.jsx:3610`). Facts asked from him: did that second red message appear; after a reload, is the new description there?

| # | Fix | Cost | Gain |
|---|---|---|---|
| A | wait longer (e.g. 8 s) before "device only" | one number | right message on slow lines; a truly offline save shows its message 8 s later |
| B (MY PICK) | say "Saving…" at once, then "Saved" when the server confirms; "device only" only if the phone is really offline or nothing confirms in ~10 s | small, one function | honest at every speed, and no 8 s silence |
| C | stop re-sending photos when they did not change (send only changed fields) | touches the photo logic + every reader of `images` | every product save is much smaller and faster |

**Decision:** B, built kpm `51527bc` (his "B is better message to use").


**Models applied:** Inversion (when is the message wrong? a write slower than the window but still landing); Second-Order Thinking (photos stored inside the record make every small edit a large upload).
