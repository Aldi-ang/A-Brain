---
title: Secure Context Requirement
description: Browser APIs that exist only on HTTPS or localhost — the class of bug where the PC works, the phone silently does nothing, and months of reports point at the wrong thing.
type: concept
created: 2026-08-10
updated: 2026-08-10
confidence: high
checked: 2026-08-10
tags: [pattern, browser, phone, security, crypto]
---

# Secure Context Requirement

A whole class of browser APIs is **undefined unless the page is in a secure context** — served
over HTTPS, or loaded from `localhost`. Not restricted. Not throwing a permission error.
**Undefined.** Reading a property off it produces *"undefined is not an object"*, and if that read
sits inside a `try/catch`, the feature simply does nothing.

## The instance that cost months

`crypto.subtle` hashes the KPM master password (`hashSecretWord`, `src/App.jsx:~853`).

- Aldi's PC reaches the dev server at `localhost` → secure context → works.
- Aldi's phone reaches it at `http://192.168.1.141:5173` → **not** localhost, **not** HTTPS →
  `crypto.subtle` is undefined → hashing throws → the silent `catch` eats it → the button does
  nothing at all, with no message.

His report: *"i press open vault from my phone and its not doing anything, doesnt let me enter but
no notification just nothing"*. Only after the gate was made to report its failures did the real
message appear: *"could not check password, undefined is not object evaluating crypto digest"*.

Fixed 2026-08-10 by `f460297` (refuse loudly with `SECURE_CONTEXT_REQUIRED`) and `b1aee4e`
(dev server serves HTTPS via `@vitejs/plugin-basic-ssl`, dev-only). Production was never affected
— Vercel already serves HTTPS.

## Why it took months to find

Three separate real problems were found and fixed first, and **none of them was the cause**:

1. A missing sign-in button on the signed-out screen — real, fixed.
2. A stale Firebase authorised domain (`192.168.1.102` while the phone was on `.141`) — real,
   fixed in the Firebase Console.
3. The PIN field's `autoFocus` putting the keyboard over the panel so the first tap was eaten —
   real, fixed in `d366acc`.

Each fix was verified and each made the app better. The symptom persisted because the actual
cause was one undefined API that nobody could see. **A fix that is real is not thereby the cause.**

## The rule this produces

**When something works on the PC and does nothing on the phone, check the origin before checking
the code.** `window.isSecureContext` answers it in one line. The other APIs in this class worth
knowing: `crypto.subtle`, `navigator.geolocation` (modern browsers), `navigator.mediaDevices`
(camera/mic), service workers, `navigator.clipboard`, notifications, and Bluetooth/USB.

Two of those are already load-bearing in KPM: the camera for delivery-proof photos, and the
service worker for offline mode. Both would fail the same silent way on a plain-HTTP LAN address.

## Related

- [[Silent Failure Disease]] — why this was invisible for months rather than merely broken
- [[Anti-Recurrence Check]] — the "local check narrower than real conditions" shape; a PC test
  cannot exercise a phone's origin
- [[Master Vault Gate]] — the screen this happened on
- Source: [[../../Raw/2026-08-10_source_kpm-six-days-aug04-to-aug10|the six-day source]]
