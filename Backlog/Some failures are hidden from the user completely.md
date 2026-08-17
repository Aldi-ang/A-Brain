---
title: Some failures are hidden from the user completely
description: Two write paths catch their own errors and say nothing. The screen has already updated optimistically, so a failed save looks exactly like a successful one.
status: To Do
area: Whole app
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# Some failures are hidden from the user completely

Found in the 2026-08-17 logic review, second pass. This is the shape already recorded in the vault
as *the screen says yes, the database says no* — here it is caused by the app's own error handling
rather than by a permission rule.

## What happens, in simple English

Two places catch a failed save and then do nothing with it. No message, no retry, no mark on the
screen. And in one of them the screen has **already** been updated to show the new value, so a
failure and a success look identical.

## The two places

**1. Assigning a store to an agent** — `src/JourneyView.jsx:528`

```
} catch (error) {}
```

Before that line runs, the app has already updated the screen, saved the assignment into the
browser's local storage, and changed the store object in memory (`:509-519`). If the database write
then fails, all three of those stay wrong, and the next person to open the screen sees a different
answer from the person who set it.

**2. Processing a consignment return** — `src/hooks/useTransactionEngine.js:504`

```
} catch (err) { console.error(err); }
```

Written to the browser console, which nobody on a phone will ever look at. The return appears to
have worked.

## Why this matters to you specifically

Your standing rule for this app is that **every action must report**. Silence is a bug, not missing
polish. These two are silence in the worst possible position — after a write that moves stock or
changes who is responsible for a store.

## Suggested fix, smallest version

Both already have `notify(...)` available in the same file. Show the error, and undo the optimistic
screen update in the Journey one so the screen goes back to matching the database.
