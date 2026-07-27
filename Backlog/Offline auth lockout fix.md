---
title: Offline auth lockout fix
description: Refreshing offline no longer falsely locks out real employees with an "Access Denied" screen.
status: Done
area: Permissions & Bugfixes
priority: High
created: 2026-07-24
updated: 2026-07-24
---

# Offline auth lockout fix

Refreshing the page while offline no longer locks out real employees with a false "Access Denied" — added `getDocOfflineSafe()` and an honest "Can't Verify You Yet" state distinct from a real denial. Merged to `main`.
