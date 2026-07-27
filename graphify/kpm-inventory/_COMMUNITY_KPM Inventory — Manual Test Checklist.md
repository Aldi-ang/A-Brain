---
type: community
members: 8
---

# KPM Inventory — Manual Test Checklist

**Members:** 8 nodes

## Members
- [[After deploying a Firestore Security Rules change specifically]] - document - MANUAL_TEST_CHECKLIST.md
- [[KPM Inventory — Manual Test Checklist]] - document - MANUAL_TEST_CHECKLIST.md
- [[MANUAL_TEST_CHECKLIST]] - document - MANUAL_TEST_CHECKLIST.md
- [[⚪ Skip entirely]] - document - MANUAL_TEST_CHECKLIST.md
- [[🔴 Business-critical — test every single release]] - document - MANUAL_TEST_CHECKLIST.md
- [[🚨 Before you say done or commit anything — do this EVERY time]] - document - MANUAL_TEST_CHECKLIST.md
- [[🟠 Data integrity — test after any related change]] - document - MANUAL_TEST_CHECKLIST.md
- [[🟡 Edge cases — test when touching that specific code]] - document - MANUAL_TEST_CHECKLIST.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/KPM_Inventory__Manual_Test_Checklist
SORT file.name ASC
```
