---
title: Check every UI permission against the database rules
description: The Settings matrix can grant any permission to any tier. The database rules read that matrix in at least one place and hardcode role names in others. Nobody has checked which is which.
status: To Do
area: Permissions
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# Check every UI permission against the database rules

Added 2026-08-17. **This is a check to run, not a bug already found.** A first look during the
logic review raised the suspicion and then partly disproved it — which is exactly why it needs
doing properly rather than being asserted either way.

## What raised it

Two systems decide what a user may do:

- **The Settings matrix.** The owner can switch any permission on for any tier. The app reads it at
  `src/config/permissions.js:81-99` and it overrides the built-in defaults.
- **The database rules** in `firestore.rules`, which decide whether the write is actually allowed.

If those two disagree, the button appears, the user presses it, and the write is refused. That is
the *screen says yes, database says no* shape already recorded in the vault — it has happened at
least five times in this app, all on the Fleet Captain role.

## What the first look actually found — and the correction

The rules **do** read the permission matrix: `firestore.rules:132-141` fetches the
`settings/permission_matrix` document and reads the calling role's permission list out of it.

So the blunt version of the worry — *"the rules only know fixed role names"* — **is wrong**, and was
stated wrongly in chat on 2026-08-17 before being checked. At least one rule follows the matrix
properly.

But other rules **do** compare against literal role strings (`'AREA_ADMIN'`, `'FLEET_CAPTAIN'`,
`'COMPANY_OWNER'`), and `userRole` appears eleven times in the file. So the file is a mixture, and
which permissions are matrix-driven and which are role-locked has never been written down.

## The check to run

1. List every permission name the Settings matrix can grant.
2. For each one, find the write it is supposed to unlock.
3. Find the rule guarding that write, and record whether it reads the matrix or a fixed role name.
4. Anything role-locked while the matrix advertises it as grantable is a live trap: the owner can
   turn it on and it will silently not work.

Write the result as a table in the vault. It is a page that stays useful — every future permission
question starts by asking which of the two systems actually decides.

## Related

- [[UI-Says-Yes-Server-Says-No Pattern]]
- [[Fleet Captain Permission Gap]]
