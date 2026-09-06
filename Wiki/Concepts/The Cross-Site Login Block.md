---
confidence: high
checked: 2026-09-06
---

# The cross-site login block

Google sign-in worked on `localhost` and failed on every deployed address. **Confirmed by test, not
reasoned:** Brave Shields down on the deployed site, sign-in went straight through.

## The cause

The app is served from `kpm-ang.vercel.app`. The Google handshake happens on
`cello-inventory-manager.firebaseapp.com`. Finishing a login therefore means one site reading a
cookie another site set. Brave blocks that by default; Safari blocks it; Chrome is phasing it in.

**Localhost is the one place Brave does not apply the block** — which is exactly why localhost was
the one place that worked, and why it looked for a while like a broken OAuth client.

## Two symptoms, one root

| where | route | message |
|---|---|---|
| phone, 2026-09-05 | `signInWithRedirect` | "The requested action is invalid." on firebaseapp.com |
| desktop Brave, 2026-09-06 | `signInWithPopup` | `auth/invalid-credential`, userinfo 401 |
| old Vercel link, Brave | popup | Google consent page, 401 malformed |

Different flows produce different messages from the same break. **Do not chase the message.**

## The fix

`vercel.json` passes `/__/auth/*` through to Firebase, so on that host the handshake happens on the
app's own address. `src/config/firebase.js` resolves `authDomain` at runtime from
`PROXIED_AUTH_HOSTS`.

⚠️ **Every host on that list needs `https://<host>/__/auth/handler` registered under Authorized
redirect URIs on the OAuth client in Google Cloud Console, FIRST.** Add it to the list without
registering it and sign-in on that host dies with `redirect_uri_mismatch`. Everything not on the
list keeps the Firebase handler, which is already registered — localhost, the LAN IPs used for phone
testing, and every auto-generated Vercel preview URL. Preview URLs can never be registered in
advance, which is why a blanket "use `window.location.host` when deployed" rule was rejected.

⚠️ **The pass-through is unproven until it is deployed.** The checks pin the configuration, not the
round trip.

## Three theories died on the way, and what killed each

1. **"The new domain is not authorised."** Killed by reading the live config: `kpm-ang.vercel.app`
   was already in `authorizedDomains`. Read it with the public web key —
   `curl "https://identitytoolkit.googleapis.com/v1/projects?key=<apiKey>"`.
2. **"The OAuth client is broken."** Killed by one fact from Aldi: sign-in works on localhost. Same
   client, same project — a broken client cannot work anywhere.
3. **"Test it on `cello-inventory-manager.web.app`."** A wasted test. That address serves an
   **ancient, unrelated build**, so its result meant nothing. **Fetch a URL before sending him to
   it** — `curl -s <url> | grep -o 'src="[^"]*\.js"'` takes two seconds and would have caught it.

Related: [[Looking at the App]] · [[Secure Context Requirement]]
