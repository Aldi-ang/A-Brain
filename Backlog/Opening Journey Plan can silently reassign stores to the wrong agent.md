---
title: Opening Journey Plan can silently reassign stores to the wrong agent
description: A repair routine runs automatically on screen load. It guesses which agent a store belongs to by partial name match, writes the guess to the database without asking, and hides any failure.
status: Done
area: Journey Plan
priority: HIGH
created: 2026-08-17
updated: 2026-09-22
---

# Opening Journey Plan can silently reassign stores to the wrong agent

Found in the 2026-08-17 logic review, fourth pass. **Nobody presses a button for this one. It just
happens.**

## What happens, in simple English

Every store record holds the **name** of the agent who handles it. When the Journey Plan screen
opens, the app checks each store's agent name against the current staff list. For any name it does
not recognise, it tries to repair the record by itself:

1. it looks for a current agent whose name **contains**, or is **contained by**, the old name;
2. it takes the **first** one it finds and assigns the store to them;
3. if it finds none, it sets the store to **Unassigned** and deletes the field;
4. it writes that to the database immediately — **no confirmation, no message, and any failure is
   thrown away**.

## Why the guessing is dangerous

The match is a two-way partial match on names. So:

- Agent **Andika** leaves. Agent **Andi** is still on staff. Every one of Andika's stores is handed
  to Andi, because "andika" contains "andi". Nobody is told.
- The shorter the leftover name, the more it matches. A stale name of two or three letters can
  match almost any agent on the list.
- Which agent wins depends on the order of the staff list, not on anything real.

And because stores are linked to agents by **name** rather than id (see
[[Everything is linked by name instead of by id]]), simply **renaming** an agent in Fleet & Roster
turns all of their stores into unrecognised records — which then get fuzzy-matched or unassigned the
next time anyone opens Journey Plan.

## It also breaks your own rule

Your standing law is that every action must report. This one:

- is a **bulk write** to the customers collection,
- triggered by **opening a screen**, not by a decision,
- with `.catch(() => {})` on the write, so a failure is invisible — the **eighth** silent failure
  found today.

## Where it is

`src/JourneyView.jsx:550-582` — the fuzzy match at `:560-563`, the write at `:571-573`.

## Suggested fix, smallest version

Stop guessing and stop writing on load.

1. Leave the records alone. Show them instead: *"3 stores are assigned to someone who is no longer
   on the staff list"*, with a button to review.
2. On that screen, let the admin pick the new agent per store, or unassign in one deliberate action.
3. If an automatic repair is still wanted, only accept an **exact** name match — never a partial
   one — and report what it changed.

The real repair is to stop storing the agent's name and store their id instead, which is step 1 of
[[Everything is linked by name instead of by id]].

## ✅ DONE 2026-09-22

kpm `e7ab845`: the fuzzy match and the write on open are gone; the boss is told once per open which stores point at a name not on the roster and reassigns each through the existing control; the stale name still shows in the dropdown (globalAgentList). Two guards. The id-instead-of-name repair stays in [[Everything is linked by name instead of by id]].
