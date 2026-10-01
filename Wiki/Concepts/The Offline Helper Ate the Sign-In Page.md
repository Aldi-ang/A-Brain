---
title: The offline helper ate the sign-in page
type: concept
confidence: high
checked: 2026-10-01
---

# The offline helper ate the sign-in page (2026-10-01)

**Symptom, his words:** *"i press sign in it loads a little while and comeback to the sign in screen and not redirecting to google"* (Samsung, right after a push).

**Mechanism:** authDomain is kpm-ang.vercel.app (firebase.js PROXIED_AUTH_HOSTS) and vercel.json proxies /__/auth/* to Firebase, so sign-in first opens OUR /__/auth/handler. The PWA service worker (Workbox NavigationRoute, navigateFallback index.html, no denylist) answered that navigation with the stored app. The server was fine all along.

**Fix:** kpm `79b3e7d` - workbox navigateFallbackDenylist /^\/__\// in vite.config.js.

**Why it showed up now:** the rule is old; after a push the new worker takes control at once (skipWaiting + clientsClaim), so a sign-in right after an update runs under it.

**Testing trap:** vite preview also answers unknown paths with index.html - put a stand-in file at /__/auth/handler before comparing workers, or the test cannot fail.
