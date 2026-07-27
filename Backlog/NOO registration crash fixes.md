---
title: NOO registration crash fixes
description: Fixed the Register New Outlet flow's photo-step crash, plus three related bugs found alongside it.
status: Done
area: Permissions & Bugfixes
priority: Critical
created: 2026-07-25
updated: 2026-07-25
---

# NOO ("Register New Outlet") crash fixes

Fixed and merged to `main`:
- `handlePhotoCapture` was referenced but never defined — crashed the photo step of Register New Outlet every time
- `submitNooOnly` had the same problem
- Dead delete-customer-history button restored
- Import Shared Config and offline sale sync writes chunked
