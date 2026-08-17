---
title: EOD - show the admin what the agent counted
description: The agent now submits a `cards` field with what they physically counted and the rows behind it. The admin review screen does not display it, so the entire point of the redesign is currently invisible.
status: To Do
area: EOD Setoran
priority: High
created: 2026-08-17
updated: 2026-08-17
---

# EOD — show the admin what the agent counted

**Smallest high-value job in the whole feature. Do this before the letter stack.**

Since `661498f` every EOD submission carries an additive `cards` field: for each of the four cards,
what the agent **declared**, what the app **expected**, and the **source rows** behind it — one row
per sale for cash and transfer (with the customer's name), one row per product for goods, and
handed-over vs lost for stamps.

**The admin review screen shows none of it.** It still shows the figures the app calculated, which
is exactly the screen the redesign was meant to replace. Right now an agent counts carefully, the
number is stored, and nobody ever sees it.

## Why this is the whole point

His sentence that started the redesign: *"we need to make system where this leak of cash or input
can be traced down to the root"*. A stored number nobody compares is not traceability, it is
storage. The comparison — **declared vs expected, per card, with the rows underneath** — is the
feature.

## The smallest version that earns its place

Inside the existing expanded report row on the admin side, for each of the four cards:

    Cash       counted 4.850.000   expected 4.850.000   ✓
    Transfer   counted 1.150.000   expected 1.200.000   -50.000  →  3 sales, largest: Pak Budi
    Goods      counted 108         expected 109         -1       →  Cello Merah 12
    Stamps     counted 123         owed 128             -5       →  3 lost, 120 handed over

Guarded with `report.cards &&` so every report submitted before this exists still renders.
`traceCard()` in `src/utils/eodRecord.js` already returns the sources biggest-first — it is written
and tested and has never been called.

## ⚠️ Do not change what gets credited

`handleVerifyEOD` still credits the career ledger from the CALCULATED `cash`/`transfer`, and he said
keep the logic. This job is display only. Crediting moves when **Accept short** ships, and that
needs his rules deploy first.
