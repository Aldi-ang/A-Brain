---
title: "KPM Inventory Facts Reference (raw source)"
description: The delegate-coding-task skill's project-facts reference file — stack, tiers, tenant pattern, reusable helpers.
created: 2026-07-27
updated: 2026-07-27
tags: [raw, source, facts, architecture]
---

# KPM Inventory (Cello/KPM) — Project Facts Reference

Load this instead of re-deriving these facts from scratch. Stack: React 19 + Vite + Firebase
(Firestore + offline persistence) + Vercel. Multi-tenant B2B SaaS, PT Karyamega Putera
Mandiri. GitHub: github.com/Aldi-ang/kpm-inventory (public).

## Tenant architecture (memorize this, it comes up constantly)

- One shared Firebase project (`cello-inventory-manager`) hosts every tenant company.
- Each company's entire data lives under `artifacts/{appId}/users/{masterUid}/...` —
  `masterUid` is that company's Tier 1/2 owner's UID, shared by every employee of that company
  via `bossUid`.
- `userId` in the app resolves as `bossUid || user?.uid || user?.id || 'default'` — this is
  the standard pattern for scoping any per-tenant Firestore path.
- `employee_directory` is keyed by **email**, not UID, as the authoritative record (written by
  admins). A UID-keyed copy only exists for the Company Owner's own migrated record, covered
  separately by `isVaultOwner()`. Don't assume dual-keying is needed elsewhere without checking.

## Tier system

TIER_1 `DEVELOPER` (Architect/platform owner) → TIER_2 `COMPANY_OWNER` → TIER_3 `AREA_ADMIN` →
TIER_4 `FLEET_CAPTAIN` → TIER_5 `FIELD_OPERATIVE` → TIER_6 `ROOKIE`.

Legacy string overlap exists: `'ADMIN'` and `'DEVELOPER'` both mean Tier 1 in some older code
paths. Confirm which literal string a given check actually uses — don't assume.

## The single most recurring bug class in this project

**A Firestore rule function checks a role by its exact literal string, and simply omits a role
that the client-side UI (or business intent) clearly includes.** This has independently
recurred at least 5 times: `procurement`/`canvas` listeners, the fleet paintbrush
(`mapSettings`), roster create/delete (`motorists`), `pending_audits`, and Fleet Captain
roster-management delegation. Specifically: `isAreaAdmin()` only ever checks for the literal
`'AREA_ADMIN'` string — it has never covered `'FLEET_CAPTAIN'`. When touching any
tier-gated rule, explicitly check whether Fleet Captain (and any other plausible tier) should
also be included, rather than assuming one role-check function covers what it sounds like it
should.

## Known-safe patterns already established — reuse, don't reinvent

- **`commitInChunks(db, writeBatch, operations)`** in `src/utils/helpers.js` — chunks writes by
  both operation count (500) and byte size (8MB), commits sequentially with pacing between
  chunks. Use this for any bulk write instead of a raw `writeBatch` or a hand-rolled
  `Promise.all` chunking loop (the latter has independently caused real production incidents
  twice — firing all chunks concurrently is the actual root cause, not just chunk size).
- **`usePhotoStorage`** (in `appSettings`, Tier-1-only toggle in Architect Terminal) — lets
  photo-saving switch between base64-in-Firestore (safe on any Firebase plan) and Firebase
  Storage upload, via the shared `savePhotoAndGetReference()` helper. Default is OFF
  (base64-safe) since Storage requires a paid Blaze plan this project doesn't currently have
  provisioned.
- **Firestore Security Rules workflow**: `firestore.rules` (live draft, matches what's
  actually deployed plus any pending changes, heavily commented with `[CHANGE N]` markers
  explaining each deliberate deviation from the original baseline) + `firestore.rules.
  deployed-baseline` (a frozen copy of what was live as of the last major reconciliation, kept
  as an instant rollback reference). Never deploy a rules change without: investigating actual
  current behavior first, testing against a real Firestore emulator (JDK 21+ required — this
  environment has historically only had JDK 8, a portable JDK download is the usual
  workaround), and leaving it as a reviewed draft for manual `firebase deploy --only
  firestore:rules` — see `SECURITY_RULES_DEPLOY_CHECKLIST.md` in the repo root.
- **`MANUAL_TEST_CHECKLIST.md`** and **`SECURITY_RULES_DEPLOY_CHECKLIST.md`** in the repo
  root — durable, reusable checklists. Check them before testing/deploying; update them when a
  new durable lesson is learned, rather than letting knowledge live only in chat history.

## Environment quirks worth knowing upfront

- This is a PWA (service worker + manifest) — a "the fix didn't seem to apply" report after a
  real deploy is often just service-worker caching, not a real regression. Hard refresh
  (Ctrl+Shift+R) or unregister-the-service-worker before concluding the deploy failed.
- The live Firebase Storage bucket has never been provisioned (Spark/free plan) — any
  Storage-dependent code path will hang rather than fail fast unless it respects the
  `usePhotoStorage` toggle described above.
- Git worktrees have twice been the source of real, finished work silently never reaching
  `main` — always confirm a commit's actual diff matches its message (see the main skill's
  anti-recurrence check) and periodically check `git worktree list` for forgotten sessions.
