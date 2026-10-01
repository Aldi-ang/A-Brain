---
title: Google sign-in sometimes opens the Gmail app (Samsung)
type: brainstorm
status: OPEN — waiting on Aldi
created: 2026-10-01
---

# Google sign-in sometimes opens the Gmail app (2026-10-01)

**Problem, his words:** *"there is bug on samsung, sometimes when i choose google account for some reason it redirect me to gmail instead"* · *"redirect gmail app on the phone, i open kpm from web"*.

**What is known [certain, code read]:** KPM never links to Gmail (no `mail.google` anywhere in src / vercel.json / index.html). Sign-in = `signInWithPopup` with `prompt: 'select_account'` (App.jsx handleLogin ~3025), full-page redirect only when the popup fails. Path: our /__/auth/handler (proxied to firebaseapp.com by vercel.json) -> accounts.google.com -> back to /__/auth/handler.

**Mechanism [likely]:** Android hands a web address to an app only when that app claims the address. Gmail claims mail.google.com. So on the bad runs Google itself sent the tab to a Gmail address - it does that when its sign-in page loses where to return and falls back to its default landing [guessing on why it loses it: a popup tab on mobile, or an extra sign-in/verify step].

| Option | What it does | Cost |
|---|---|---|
| A. Observe first | He reads the browser History right after it happens: the address handed to Gmail | one test on his phone; no code |
| B. Redirect on phones | Phones skip the popup and use the full-page redirect (same tab) | changes the sign-in he just got working (79b3e7d); untested whether it stops Gmail |
| C. Drop `select_account` | Google stops showing the chooser when one account is signed in | he loses the account chooser (he switches tier accounts to test) |
| D. Phone setting | Android Settings > Apps > Gmail > Open by default > "Open supported links" off | only his phone; every salesman's phone would need it |

**09:43 new evidence, his words:** *"i tried to refresh and now it said unable to process request due to missing initial state"*. That is Firebase's /__/auth/handler page: it keeps the sign-in's state in the TAB's sessionStorage, so the state is lost when the return lands in a different tab or the handler is reloaded. Same family as the Gmail jump: the POPUP is a separate tab on Samsung, and that tab loses its context mid-flow [likely]. The proxy (firebase.js PROXIED_AUTH_HOSTS, vercel.json /__/auth/*) exists precisely so a same-tab redirect works on kpm-ang.vercel.app - so B is safe there; on LAN IPs / previews (no proxy) the popup must stay.

**Decision:** OPEN — recommended B on phones on the proxied host only (popup stays on PC and unproxied hosts). Waiting on his 🔴.

**Rejected on purpose:** none yet.

Models applied: Inversion (what makes Android open an app at all -> a claimed address), Reversibility (B and C change a working sign-in; A changes nothing).
