---
title: Some failures are hidden from the user completely
description: Seven write paths catch their own errors and say nothing - five of them consecutive save functions in the map store panel, including the price tier.
status: Done
done: "b3f6dae (2026-08-18"
area: Whole app
priority: HIGH
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

## An entire panel where nothing reports — `MapMissionControl.jsx`

Found on the third pass. **Five save functions in a row, every one of them silent.** This is the
store detail panel on the map: the place where a store's commercial settings are changed.

| What it saves | Line | On failure |
|---|---|---|
| Wholesaler / Retailer type | `:1204` | console only |
| Which hub supplies the store | `:1213` | console only |
| Catchment scale | `:1221` | console only |
| Visit frequency | `:1231` | console only, **and the screen already shows the new value** (`:1226`) |
| **Price tier** | `:1244` | console only |

The price tier is the worst of the five: it decides what that store pays for everything. If that
save fails, the agent believes the store is now on a different price level and it is not. Nobody is
told, on a phone, where the browser console does not exist.

`handleDeleteStore` twenty lines below (`:1247-1258`) **does** report its failure properly. So the
pattern is not a house style — those five are just missing it.

## The other two

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
