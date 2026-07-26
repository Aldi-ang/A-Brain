---
status: Done
area: Permissions & Bugfixes
priority: Medium
updated: 2026-07-24
---

# NOO approval notification fix

NOO approval notifications now correctly carry `agentId: 'ADMIN'` — previously only visible to admins by accident via a fallback rule. Merged to `main`.
