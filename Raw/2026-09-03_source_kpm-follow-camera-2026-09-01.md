---
title: "Source — the follow camera, the name column and the orange ring (2026-09-01)"
description: Untouched PROGRESS.md entries from KPM commits 87b0939 and 96f2474, the 2026-09-01 18:11–18:40 WIB block that the vault's self-ingest skipped.
type: raw-source
created: 2026-09-03
updated: 2026-09-03
tags: [raw, kpm, ponder, scroll, mobile]
---

# Source — KPM `.claude/PROGRESS.md`, 2026-09-01 18:11 → 18:40 WIB

Captured 2026-09-03 by the `a-brain-session-ingest` task. Two entries, verbatim from the diffs of
commits `87b0939` ("Notes: the name column, the orange ring, and the follow-camera recommendation")
and `96f2474` ("Notes: the follow camera shipped, and the brief goes back to the ten copies") on
branch `phase0-solid-ground`. Do not edit.

---

## 🟠 2026-09-01 19:05 — THE NAMES GET THEIR ROOM, THE RING GOES ORANGE. **702/702 + 977/977**.

*"take more space its okay"* — the Stock by Warehouse name column was `minmax(0,1fr)` with `truncate`
on both names, so a narrow desk cut the part that tells two products apart. It is
`minmax(260px,max-content)` now and the table's own side slider pays for it. `min-w-0` came off with
the truncate; leaving it in re-enables the squeeze. Measured at 1440 with a drawer open: nothing
clipped, 1196px of content in a 1022px window.

*"i want the highlight to be clearer to see"* — the Ponder ring was `border-line-3`, the grey used
for table rules. It has its own map now, `TONE_RING`, and reads orange at 2px. A spotlight shadow was
tried first, did not take, and was deleted rather than left in as a dead class.

**Two existing guards went red first and both were right.** The audit pinned the ring to `TONE_EDGE`
by name; it now pins `TONE_RING` and also asserts neither map carries a `bg-`, which is the real
rule. The selfcheck pinned the grid's first track; it now pins the widened one.

🔴 **HIS OPEN QUESTION, answered in chat, not yet built:** phone Ponder vs a camera that follows
the highlight. **The recommendation is the follow-camera, one Ponder for both widths** — a second
phone tutorial is a second thing to keep in step with every UI change, and the highlight's rect is
already measured, so following it is a few lines. **He has not said yes yet.**

🔴 **WAITING ON ALDI — four.** The follow-camera go-ahead · whether both Wi-Fi networks stay in
use (the 192.168.100.1 router has no reservation and no Firebase entry) · the label print-and-scan
test, still owed · the G1+G2 staleness threshold in days.

---

## 🟠 2026-09-01 18:40 — THE CAMERA FOLLOWS THE HIGHLIGHT. **705/705 + 977/977**.

*"do follow camera then"* — he chose it over a separate phone Ponder. **One tutorial, both widths.**

**A camera already existed and was aimed wrong twice.** It called `scrollIntoView({block:'nearest'})`
on the FIRST element matching the beat, and `nearest` is satisfied the moment one cell of a tall
column touches the edge. Worse, it moved the STAGE — but Stock by Warehouse has its own
`overflow-x-auto` around a 1080px grid, so sideways movement belongs to that div. Measured at 375px
before the fix: the ring was fully in view vertically on every beat and **0% in view horizontally on
five of them**.

**Now it centres the UNION in every scroller between the subject and the stage, innermost first**,
recomputing rects per scroller because moving an inner one moves everything outside it. It stops AT
the stage — walking past would scroll the app underneath the tutorial. A scroller with nothing to
scroll returns at once, which is why the desk is untouched.

**Verified beat by beat, not by eye.** At 375px: stock-by-warehouse 14 beats, regional-warehouse 16
beats, and on every one the ring is 90%+ visible or fills 85%+ of the window (the second case is a
subject wider than a phone — centring its middle is the best the window can do). At 1440 the same 14
beats pass and the stage's own scrollTop/scrollLeft stay at 0.

⚠️ **CRLF bit twice today.** A needle with a literal `\n` matches nothing in these files. It made a
selfcheck pass while testing nothing this morning, and an audit check fail this evening. Anchor the
lift, or use `\s*`.

🔴 **WAITING ON ALDI — three.** Whether both Wi-Fi networks stay in use (the 192.168.100.1 router
has no reservation and no Firebase entry) · the label print-and-scan test, still owed · the G1+G2
staleness threshold in days. He also asked *"is there another components i need to check on my
phones right now?"* — named in chat: the sales terminal cart, the wide Stock by Warehouse table, the
surat jalan and the printed label. A full phone sweep was offered and not yet asked for.
