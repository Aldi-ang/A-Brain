---
title: capture="environment" Is a Request, Not a Lock
description: The HTML attribute that looked like it forced a camera and silently didn't on desktop — and the tier rule for sale-proof photos that was built on top of it.
type: concept
created: 2026-09-09
updated: 2026-09-09
confidence: high
checked: 2026-09-09
tags: [pattern, permissions, evidence, kpm, browser]
---

# capture="environment" Is a Request, Not a Lock

**A sale proof photo had been mandatory for a year and enforceable for none of it on a PC.**

`src/MerchantSalesView.jsx` rendered the delivery-proof button over

```html
<input type="file" accept="image/*" capture="environment" id="txProof">
```

`capture` reads like a lock. It is a **hint**. A mobile browser honours it and opens the camera
directly; **a desktop browser ignores it entirely and opens the ordinary file picker.** So the
photo that exists to prove a handover happened *now, at this shop* could be, on a desk machine,
any image on the disk — including a screenshot. And the field salesman on a phone was getting the
camera by accident of his platform, not by any rule the app had written down.

Nothing was broken. Nothing failed. The gate was doing exactly what it said and meaning something
different on each half of the userbase.

> **A browser hint that is honoured on the platform you test on is indistinguishable from
> enforcement until you open the other one.**

## The rule Aldi asked for

His words, 2026-09-09: *"for the camera on PC i want it to be work for tier 3 and above on default
without the camera, only gallery photo is okay and tier 4 and lower will need to use the real time
camera to do this, also add this option on the matrix to toggle on and off"*.

| tier | may attach |
|---|---|
| T1, T2, T3 — the desk | a live capture **or** a file |
| T4, T5, T6 — the field | a live capture only, no file chooser at all |

⚠️ **T4 in his vocabulary is REGIONAL ADMIN; in the code T4's id is the string `FLEET_CAPTAIN`.**
Reading the role names instead of the tier numbers is the most repeated bug in this project — see
[[Fleet Captain Permission Gap]]. "Tier 4 and lower" is the field, and `FLEET_CAPTAIN` is in it.

## What actually enforces it

`getUserMedia`. A live video stream is a camera on both platforms, and there is no attribute that
turns a file input into one. `src/components/ProofCamera.jsx` opens the stream, grabs one frame,
and hands back the same compressed base64 JPEG an upload would have produced.

The strong half is not the camera — it is that **a camera-only tier has no file input in the DOM
of a shipped build.** Verified in `dist`, not asserted from the source:

```
$t&&e.jsx("input",{type:"file",accept:"image/*",id:"txProof"...
```

`$t` is the tier answer, and it is the ONLY thing in front of the input — in every build. It read
`(ht||!1)&&` for about an hour, where `!1` was `import.meta.env.DEV` compiled out of production;
that half is gone entirely, for the reason in the next section but one.

## Two traps this sat on

**`getUserMedia` needs a secure context, and fails silently without one.** https, or localhost. The
state that actually bites is the app opened over a LAN `http://192.168.x.x` — see
[[Secure Context Requirement]]. So every refusal names its own cause: not a secure address, no
camera on this device, or permission refused. A blocked camera that left the button reading
`REQUIRE PROOF` would be the same bug as a dialog that does nothing — [[Every Action Must Report]].

**A `position: fixed` modal opened from inside the manifest drawer is positioned against the
drawer, not the viewport.** The drawer is a scrolling flex column. `createPortal` to `document.body`
is the fix, and it is why the camera is not half off-screen.

## The dev-only bypass that lasted an hour

The first version carried a **"Dev only — pick a file instead"** button on the blocked state, gated
on `import.meta.env.DEV` and never on the tier, so a machine with no webcam could still finish a
sale. It could not exist in a production build, which is what made it sound safe.

Aldi killed it the moment he saw it, wearing tier 6:

> *"me as tier 6 still can see this option and can use it"*

He is right and the reasoning was backwards. **`npm run dev` is the only place he tests anything.**
A bypass that exists exactly there does not preserve testability — it removes the rule under test,
in the one environment where the rule could be watched working.

> **An escape hatch scoped to the environment you test in is not a safety valve. It is the feature
> being switched off, everywhere it could have been observed.**

And it was redundant on top of that: the product already has a visible, auditable way to let a tier
attach a file — turn `photo_pick_from_gallery` ON for that tier in the permission matrix, test, turn
it off. A hidden second answer to *"may this tier attach a file"* is how two answers to one question
start disagreeing.

Removed in `1857b97`. Verified in `dist`: `$t&&e.jsx("input",{type:"file"` — the `||!1` is gone and
the string "Dev only" appears nowhere in the bundle. The consequence is stated rather than hidden:
on a machine with no webcam, a camera-only tier genuinely cannot complete a sale. That is his rule.

⚠️ **The guard that pins this reads through `code()`, not the raw file.** The comments left where
the bypass used to be name `import.meta.env.DEV` in order to say *do not put this back*, and a raw
grep cannot tell a warning about a line from the line.

## The permission shape, unchanged from its three siblings

`canPickFromGallery` already existed — hardcoded to T1–T3, used by the restock evidence photos. It
now reads the matrix key `photo_pick_from_gallery` in the same **absence-means-tier-default** shape
as `view_expected_count`, `handle_delivery` and `manage_registry`: a brand-new key is simply missing
from the matrix he has already saved to Firebase, and `injectDynamicPermissions` **replaces** a
saved tier's list wholesale. Read that absence as "no" and every tier goes camera-only on the day
it ships — the feature looks broken while the code is right.

**One helper, not two.** The restock photos are the same kind of evidence under the same rule, so
one switch governs both. A second copy of the tier translation is what has caused every tier bug
here so far, and `integration.audit.mjs` G53 already pins the helper to `permissions.js` for
exactly that reason.

## What the check had to be

The behaviour check that earns its place is the one that goes **red against the old code**: inject
a matrix that grants T5 and withholds T3, and both must flip. The hardcoded list answered that
exactly backwards — T5 false, T3 true — so the check is evidence, not decoration.
See [[Anti-Recurrence Check]].

## Related

- [[Fleet Captain Permission Gap]] — read the tier NUMBER, never the role name
- [[Secure Context Requirement]] — why the dev server is https, and what breaks on a LAN address
- [[Every Action Must Report]] — a control that cannot say why it will not work
- [[Anti-Recurrence Check]] — shape 4: grepping the source proves a thing was typed, never that it applies
- Shipped: `284ea64`, and the bypass removed in `1857b97`
