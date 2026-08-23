---
title: "Test the new Stock Opname on a real screen — 2026-08-21 build"
description: Five features shipped to the count screen in one day and none of them has been seen running. Audits and a prototype are not the same as a phone in his hand.
status: Partly done — Claude drove it 2026-08-23; three items still need a branch account
area: Stock Opname
priority: High
created: 2026-08-21
updated: 2026-08-21
tags: [testing, stock-opname, aldi-only]
---

# Test the new Stock Opname on a real screen

**Only Aldi can do this one.** Claude proved all of it with the audit suites (599/599 and 543/543)
and with a prototype Aldi approved by eye, but **the real count screen has never been opened** —
it needs a login and real data, and the browser pane would not render a frame that session.

Build to test: commits on `phase0-solid-ground`, 2026-08-21. **Check the build id in the Flight
Recorder header before trusting a screenshot** — old builds have wasted a session twice.

---

## 1 · The four figures are honest now

Count a product that **has damaged stock on file**. Say 100 good and 5 damaged.

- [ ] The row shows four figures: **EXPECTED GOOD 100 · EXPECTED DAMAGED 5 · TOTAL FOUND 105 · MATCH 0**
- [ ] It does **not** read `EXPECTED 100 → FOUND 105`, which is what it used to do and which made a
      perfect count look like five extra boxes
- [ ] Every label is a whole word — no `EXP DMG`

## 2 · Damage has to say what kind

Type a damaged number above zero.

- [ ] A single line appears: **`5 DAMAGED · 0 of 5 sorted`**, red edge
- [ ] Pressing it opens one box holding all five kinds — expired, water, torn/crushed, pest,
      factory defect. **There is no "Other" and no typing box** (removed on his word)
- [ ] Pressing the kind's name **swipes down** to the next one; at the last it **flicks back up
      fast** to the first
- [ ] The ▲▼ arrows step either way
- [ ] The dots below show where you are — the current one filled amber and bigger, ones that
      already have a quantity outlined, the rest a plain grey ring **you can actually see**
- [ ] Put 3 pest and 2 water against a total of 5 → the line turns amber and says **2 kinds recorded**
- [ ] Put 6 against a total of 5 → it refuses with **kinds add up to more than the total**
- [ ] Leave it at 3 of 5 and press submit → it refuses and **names the product**
- [ ] Set damaged back to 0 → the whole block disappears

## 3 · A difference must be counted twice

Type a count that does **not** match, on any product.

- [ ] A red panel appears: **"Count this one again."** — and it must **NOT** say how far off you are
- [ ] Press **clear and count again** → both boxes go blank. **The number you typed before is not
      shown back to you anywhere**
- [ ] Type the **same** wrong number again → **"Counted twice — same answer, this goes to HQ"**
- [ ] Try instead: type a **different** wrong number → it asks a **third** time
- [ ] On the third, type a **third different** number → **"Three different counts — all three go to
      HQ"**, and it stops asking
- [ ] Type the correct number on the second attempt → no warning at all, nothing goes to HQ
- [ ] Try to submit while a row still says "count this one again" → refused, product named

## 4 · Leak detection — HQ side, not the count row

Log in as **tier 1 / owner** and open the audit review list.

- [ ] A product that came up short in at least two of its last three or more approved counts shows
      a red chip: **`SHORT 2 OF LAST 3`**
- [ ] A product with a **surplus** never shows it, however often
- [ ] It does **not** appear on the counting screen — that is deliberate, telling the counter
      "this one is usually short" would bias the count
- [ ] The review row shows the **damage kinds** as red chips under the product name

## 5 · The theme, both ways

- [ ] Flip to **light mode** — the amber edges still read, nothing vanishes
- [ ] Turn on **Lite Mode** — the swipe and the red glow are **gone completely**, not slow or
      frozen. A stopped animation reads as a bug
- [ ] Check the **damaged total** box: red border, red number, and a slow breathing glow while it
      is above zero
- [ ] **No amber filled boxes anywhere.** The only amber fill allowed is the thin 3px bar whose
      length shows how much damage has been sorted
- [ ] On the **phone**: the four figures sit 2×2, nothing runs off the side, nothing overlaps

---

## If something is wrong

Say which numbered item, and send the **build id from the Flight Recorder header** with any
screenshot. Do not describe it as "the layout is broken" — name the box.


---

## Run 2026-08-23 — Claude drove it in his Chrome, he watched

Build: `42fefe8` and earlier, dev server on localhost, **real Firebase**, so **nothing was
submitted** — no stock audit and no receipt was written.

### Passed, seen on screen

- **Stock Opname loads.** No `[STOCK_OPNAME] FAILED TO LOAD`. This is the one that cost an
  afternoon on 08-21.
- **The four figures, full words** — `EXPECTED GOOD 1.086 · EXPECTED DAMAGED 5 · TOTAL FOUND ·
  DIFFERENCE`. No `EXP DMG`.
- **The recount panel** — *"COUNT THIS ONE AGAIN. Most differences are miscounts. It is only
  reported once the same number comes up twice."* + **CLEAR AND COUNT AGAIN**.
- **The damage ledger line** — `5 DAMAGED · 0 of 5 sorted`, red edge, appears the moment a damaged
  number is typed.
- **The reel he designed** — pressing the face steps EXPIRED → WATER DAMAGE → TORN / CRUSHED, the
  dots track `1/5 → 2/5 → 3/5` with the current one filled and larger, ▲▼ arrows present.
- **The reconcile counter is live** — typing 3 turns the line into `3 of 5 sorted` and fills the
  progress bar to match.
- **HQ pipeline says `PENDING, IN-TRANSIT & DISPUTED`** — the 2026-08-23 change is live.
- **Factory intake is labelled FACTORY PRODUCTION INBOUND**, not supplier.

### ⚠️ Found — over-sorted damage looks fine until you submit

Typing **9** against a total of **5** shows `9 of 5 sorted` with the bar full and **nothing marking
it as wrong**. The refusal is real but only fires at submit, so a counter can sit on a broken row
believing it is finished. Small, but it is the *"UI says yes"* shape.

### Could NOT be tested, and why

- **The arrival check** — the logistics pipeline is empty, there is no shipment in transit to
  receive, and creating one would write real stock.
- **The stock-age line** (`Paling lama di sini · N hari`) — it renders on the **branch** side only,
  and he is signed in as HQ. **Needs a regional-admin account.**
- **Blind counting** — he is tier 1, so seeing the expected figures is correct behaviour. The blind
  path needs a tier 5/6 account.
- **Anything past submit** — refused on purpose against the live database.

**The three gaps above all need either a branch/agent login or the Firebase emulator.**
