---
title: NOO approval notification fix
description: NOO approval notifications now correctly carry agentId 'ADMIN' instead of only working by accident.
status: Done
area: Permissions & Bugfixes
priority: Medium
created: 2026-07-24
updated: 2026-07-24
---

# NOO approval notification fix

NOO approval notifications now correctly carry `agentId: 'ADMIN'` — previously only visible to admins by accident via a fallback rule. Merged to `main`.
