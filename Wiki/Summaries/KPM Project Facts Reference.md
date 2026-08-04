---
title: KPM Project Facts Reference
description: The core facts every session should already know — stack, tiers, tenant pattern, reusable helpers.
type: summary
created: 2026-07-27
updated: 2026-07-27
confidence: high
checked: 2026-07-27
tags: [ingest, facts, architecture]
source: "[[../../Raw/2026-07-source_kpm-inventory-facts-reference.md]]"
---

# Summary: KPM Project Facts Reference

**Source**: the `delegate-coding-task` skill's project-facts reference file, maintained
specifically so Claude Code sessions don't re-derive these facts from scratch each time.

## What it establishes

- Stack: React 19 + Vite + Firebase (Firestore + offline persistence) + Vercel.
- The full [[Multi-Tenant Architecture]] (`bossUid` pattern) and [[Tier System]] (six-tier
  hierarchy, the `'ADMIN'`/`'DEVELOPER'` legacy overlap).
- Names [[Fleet Captain Permission Gap]] explicitly as "the single most recurring bug class
  in this project," with 5 independent confirmed recurrences.
- Documents known-safe reusable patterns: `commitInChunks()` for bulk writes (chunks by
  count AND byte size, commits sequentially — a hand-rolled concurrent chunking loop has
  independently caused real production incidents twice), and `usePhotoStorage` (base64 vs
  Firebase Storage toggle, defaults to base64 since Storage needs a paid plan not currently
  provisioned).
- States the [[Draft-Then-Deploy Discipline|rules draft-and-deploy process]] and points to
  `MANUAL_TEST_CHECKLIST.md`/`SECURITY_RULES_DEPLOY_CHECKLIST.md` as durable, reusable
  references.
- Flags environment quirks: this is a PWA, so "the fix didn't apply" after a deploy is often
  service-worker caching, not a regression; the live Storage bucket has never been
  provisioned; [[Git Worktrees]] have twice been the source of real, finished work silently
  never reaching `main`.

## Ripple — pages this touches

- [[Multi-Tenant Architecture]] (created/expanded from this source)
- [[Tier System]] (created/expanded from this source)
- [[Fleet Captain Permission Gap]] (named explicitly in this source as the top recurring bug
  class)
- [[Draft-Then-Deploy Discipline]]
- [[Git Worktrees]]
