---
type: summary
created: 2026-07-27
updated: 2026-07-27
tags: [ingest, incident, auth, offline]
source: "[[../../Raw/2026-07-24_source_offline-auth-lockout-fix.md]]"
---

# Summary: Offline Login Lockout Fix

**Source**: the `project_kpm_offline_auth_fix` memory, 2026-07-24.

## The bug

Refreshing the page while offline (or on a flaky connection) could show a real, legitimate
employee a false "Access Denied" screen. Root cause: the permission check (App.jsx's
"Traffic Cop" handler) used `getDoc()` to read the employee's profile — which, when offline
and nothing is cached yet, simply fails rather than falling back to whatever's in the local
cache.

## The fix

Added a `getDocOfflineSafe()` helper that tries the network read, and on failure falls back
to `getDocFromCache()`. Just as important: distinguished two genuinely different states that
were previously both shown as the same scary "Access Denied" — a real denial (the profile
was checked and this user really isn't authorized) versus an honest "Can't Verify You Yet"
state (offline, nothing cached yet, we genuinely don't know). Conflating those two is what
made the bug feel like a lockout rather than a loading state.

## Why this belongs in the wiki

Not a permissions-rule bug like [[Fleet Captain Permission Gap]] — this is about offline
resilience and honest UI state, a different failure mode worth its own memory: don't let
"we can't verify" collapse into "denied."

## Ripple — pages this touches

- No existing Entity page precisely fits this (it's not a [[Tier System]] or
  [[Firestore Rules]] issue — it's a client-side offline/caching issue). Flagged as a gap:
  see the Revision Log note in `PLAN-second-brain-integration.md` about whether an
  "Offline/PWA Behavior" entity page is worth adding in a future ingest pass.
