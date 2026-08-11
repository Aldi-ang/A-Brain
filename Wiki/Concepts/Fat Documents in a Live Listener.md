---
title: Fat Documents in a Live Listener
description: A photo stored inside a document turns every unrelated write into megabytes of work, because a Firestore snapshot re-materialises the whole collection. Found chasing the phone freeze after registering an outlet.
type: concept
created: 2026-08-11
updated: 2026-08-11
confidence: medium
checked: 2026-08-11
tags: [pattern, performance, firestore, phone, kpm]
---

# Fat Documents in a Live Listener

Named 2026-08-11 while chasing Aldi's G6 report. His words, and the narrowing answer that made
this findable at all:

> *"it freeze my phone for a while tho maybe add some conveniency after we register new NOO, like
> close the manifest paper for example"*

> *"freeze after just after the NOO is successful, it go back to the manifest paper right and it
> freeze there"*

## The shape

Two ordinary decisions, each defensible alone, that multiply:

1. **A photo is stored as base64 inside the business document.** A customer's `storeImage` is a
   600px JPEG at quality 0.6 — roughly 40-60KB once base64-encoded — and it lives in the customer
   record itself, not in Storage.
2. **A live listener re-maps the whole collection.**
   `onSnapshot(..., snap => setCustomers(snap.docs.map(d => ({id: d.id, ...d.data()}))))`.
   `d.data()` deserializes a document afresh **on every call**, so this rebuilds every document
   on every write — even a write that touched one field of one unrelated record.

Alone, either is fine. Together, at ~100 outlets, **one new outlet meant re-materialising several
megabytes of string on the main thread**, then handing React a hundred brand-new objects, so every
memo keyed on the list recomputed too. That is a phone freeze, and it lands at exactly the moment
the write completes — which is why it read as "registering the outlet froze it".

## Why it hides

- **It scales with data, not with code.** At 10 outlets nobody notices. Aldi has ~100. Nothing
  changed in the code on the day it started being slow.
- **It only hurts on the device nobody develops on.** A desktop chews through 5MB of string
  without a visible frame drop.
- **The expensive line looks completely ordinary.** `snap.docs.map(d => ({id, ...d.data()}))` is
  the shape every tutorial uses, and it appears in this app once per collection.

## The fix, and its boundary

`snap.docChanges()` names only what actually moved. Applying those touches one document instead of
a hundred, and the untouched rows **keep their object identity**, which is the half that stops the
re-render cascade. Shipped 2026-08-11, `src/utils/docChanges.js`, with
`docChanges.selfcheck.mjs` (8 assertions) proving it produces exactly what the full re-map did —
including the case a naive version gets wrong: a rename that REORDERS a row under
`orderBy('name')` arrives as one `modified` change whose two indices differ.

**Two boundaries were deliberate:**

- **Only the customers listener was converted.** Products, motorists and the rest carry small
  documents; converting them adds a moving part and buys nothing. Audit group 24 pins that.
- **The first snapshot of each subscription is still a full re-map.** A new subscription reports
  every document as `added`, and applying that incrementally on top of the previous tenant's list
  would splice one company's outlets into another's — the [[Multi-Tenant Architecture|bossUid]]
  boundary failing quietly.

## What is still NOT known

**The freeze was never profiled on his device.** This removed the largest measurable cost at the
moment he named; it is not proof that it was the whole freeze. Two smaller suspects were left
standing and deliberately not touched: a high-accuracy GPS ping fired on the same event
(`App.jsx:1490`, asynchronous, so it cannot block a frame), and the mascot animation starting on
that frame. **If he still reports a freeze, those are next — do not re-fix this one.**

The durable version of the fix is to stop putting photos in documents at all: the app already has
`savePhotoAndGetReference` and a `usePhotoStorage` toggle, used by the avatar, the bypass photo,
the receipt and the sale proof. The NOO form is the only photo path that never adopted it, and
existing records would still need a migration.

## The lesson worth carrying

**Ask what a listener re-does when something unrelated changes.** A collection listener is not a
read; it is a read that repeats forever, and its cost is set by the fattest field in the document,
not by the field that changed.

## Related

- [[Silent Failure Disease]] — the sibling: this one is loud to the user's hand and silent to
  every log
- [[Anti-Recurrence Check]] — the check that stops this coming back is a self-check, not a comment
- [[Ponytail Philosophy]] — the fix is smaller than the explanation, which is the usual shape
- [[Terminal Tenant Path Split]] — same collection, different bug, same week
- [[Aldi's Design Taste]] — "cutted" and freezing are both phone-only complaints; he is the only
  one testing on the device that shows them
