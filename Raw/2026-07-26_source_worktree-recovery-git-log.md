---
title: "Worktree Recovery — Git Log (raw source)"
description: Verbatim git log for the three commits that recovered work lost in abandoned worktrees.
created: 2026-07-27
updated: 2026-07-27
tags: [raw, source, git, incident]
source-type: git-log-verbatim
retrieved: 2026-07-27
repo: kpm-inventory
---

Verbatim `git show -s --format="%H%n%an <%ae>%n%ad%n%n%B"` output for the three commits that
recovered work lost in abandoned git worktrees. Retrieved directly from the repo, not
paraphrased.

## Incident 1 recovery — commit 90163ee

```
90163ee82f387070516c74be238b925728b3c230
Aldi-ang <adikaryasukses99@gmail.com>
Sun Jul 26 06:50:15 2026 +0700

fix: recover the real Customer Directory permission tier work from an abandoned worktree

Commit 15e1360's message claimed this feature was added, but its actual diff was only
a package.json/package-lock.json version bump - same failure as 673ebf6. The real,
emulator-tested code was still sitting uncommitted in the
customer-directory-permissions-396625 worktree; recovered here after diffing every
file against current main to confirm no unrelated drift before copying.

- src/config/permissions.js: CUSTOMER_EDIT_PERMS + getCustomerAccessLevel() resolver
  (view_only / own_region / global)
- src/components/CustomerManager.jsx: enforces the tier in the UI - hides Add/Edit
  for view_only, blocks/labels out-of-region edits for own_region, surfaces a clear
  message on a server-side permission-denied instead of failing silently
- src/components/SettingsView.jsx: Customer Directory Access dropdown in the
  Permission Matrix editor
- src/App.jsx: passes userRole/employeeRegion down to CustomerManagement
- firestore.rules: matching server-side rule (customerAccessLevel, isOwnRegionMatch,
  isUnclassifiedRegion) - default stays 'global' so untouched companies see no change
- MANUAL_TEST_CHECKLIST.md: adds the Customer Directory test line, plus a new
  standing "before you commit" verification checklist (diff the staged files against
  the commit message every time) to stop this exact bug from happening a third time
```

## Incident 2 recovery — commit 673ebf6

```
673ebf6cdcdebf9ddb718823af5bc8afd97e2617
Aldi-ang <adikaryasukses99@gmail.com>
Sat Jul 25 17:49:49 2026 +0700

fix: recover the real handlePhotoCapture/submitNooOnly fix from an abandoned worktree - the
previous commit's message didn't match its actual contents, only firestore.rules made it in
```

## Incident 3's eventual mitigation — commit fcb255b

```
fcb255bbba58b26a1113c7f09308fbd3f748d29e
Aldi-ang <adikaryasukses99@gmail.com>
Sun Jul 26 08:41:30 2026 +0700

ci: add GitHub Actions build check on push/PR to main

Runs npm ci + npm run build on every push to main and every PR
targeting main, so a broken or incomplete commit shows up as a red X
on GitHub immediately instead of being caught later by manual testing.
```
