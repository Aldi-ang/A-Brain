---
title: Surat Jalan - a calmer, professional print (A hairline / B black & white / C ruled form)
type: brainstorm
created: 2026-11-16
confidence: high
checked: 2026-11-16
tags: [kpm, fleet, print, design, decision-open]
---

# Surat Jalan - more professional, minimalistic

## PROBLEM (his words, 2026-11-16 ~21:30, after testing pick A live)
> *"well overall the UI is really good, very professional and very simple and straighforward like what i wanted. i want the surat jalan to be more professional as well and better looking minimalistic style format"*

Today's sheet (`src/FleetCanvasManager.jsx`, the SURAT JALAN MODAL, ~L1047-1145): 8 px navy top border, 2 px slate borders on every table cell, a blue-50 header row, blue quantities, a blue italic boxed statement, shadows, "OFFICIAL DELIVERY ORDER", a red Tutup key; `min-w-[800px]` so the phone scrolls it sideways.

## OPTIONS (artifact: https://claude.ai/artifact/QauvVpPpTfLkR8LGJAUT1s, Bagus's real van, A4)
| | Look | Gives | Costs |
|---|---|---|---|
| A Hairline | thin grey row rules, navy only in name + title + one rule | calm, bank-statement look, still KPM | navy prints dark grey on B/W |
| B Black & white | no colour, bigger title, zebra rows | identical on screen and any printer | company navy gone from this paper |
| C Ruled form | every field boxed, light 1 px grid | familiar carbon-form look, works by hand | least minimal |
Shared by all: + "Dari gudang" and a total line; - shadows, double borders, italic box, "OFFICIAL DELIVERY ORDER"; the statement word for word, smaller; app keys (Print, Close) around the paper; the phone shrinks the paper to fit the width.

The paper keeps the KPM company print look (white + navy) - the receipt rule (memory project_kpm_receipt_is_company_theme): palette law stops at print.

Models applied: Second-Order Thinking (who reads it: a warehouse admin and a driver signing on a clipboard, often a B/W printer - hence B and the "navy prints grey" cost on A), Chesterton's Fence (the statement text is legal wording he approved - kept word for word).

## DECISION
OPEN — waiting on Aldi (artifact sent 2026-11-16 ~21:35). My pick: A; B if the warehouses print only in black and white.

## REJECTED ON PURPOSE
- Dropping the statement text to look minimal: it is the receiver's liability clause.
- A third signature box (security/checker): no such role in the app today.
