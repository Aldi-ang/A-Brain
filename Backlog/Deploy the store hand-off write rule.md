---
title: Deploy the store hand-off write rule
description: The app already refuses it. The server does not yet. One rule to add to firestore.rules and deploy by hand — only Aldi can run this.
status: To Do
area: Permissions & Bugfixes
priority: HIGH
created: 2026-09-05
updated: 2026-09-05
---

# Deploy the store hand-off write rule

**This is Aldi's job, not the assistant's.** Nothing here runs `firebase deploy` for you.

## Why it matters

Shipped 2026-09-05 (`39cd90d`): after a store is handed to another agent, the past sales keep the
agent who made them, and the receiving agent is **view-only** on them. That refusal lives in
`handleDeleteConsignmentData` in `src/App.jsx` — the app will not do it.

The database will still allow it. Anyone who reaches Firestore around the app's screens can rewrite
or delete a transaction they did not make. That is the "UI Says Yes, Server Says No" gap: the screen
is honest, the server has not been told.

## The rule

Not yet written into `firestore.rules` — it is quoted here so you read it before it changes
anything. `firestore.rules` is a draft file and no `allow` line is edited without you seeing it.

```
match /artifacts/{appId}/users/{uid}/transactions/{txId} {
  allow update, delete: if isAdmin()
    || resource.data.agentId == request.auth.token.agentProfileId;
}
```

Reads as: an admin may change any transaction; an agent may change only rows stamped with his own
agent id. A row he inherited with a store is readable and collectable, never editable.

## Before deploying

1. Confirm `agentProfileId` is actually on the auth token in this project. If it is not, the rule
   has to read it from the agent's own profile document instead, and that is a different rule.
2. Emulator first — the same way every earlier rules change was tested here.
3. `MANUAL_TEST_CHECKLIST.md` and `SECURITY_RULES_DEPLOY_CHECKLIST.md` in the repo root exist for
   this step.

## Related

[[Handing a store to another agent rewrites sales history]] — the fix this protects.
[[Deploy firestore.rules to production]] — the other tested rules still waiting on a hand deploy.
