---
title: HQ dashboard - money in versus stock out
description: He narrowed HQ's job himself - money and sales data only, never stock counts - and then asked for two dashboards. The daily one is a match; the running one is the leak detector.
status: To Do
area: EOD Setoran / HQ
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# HQ dashboard — money in versus stock out

## He narrowed the job himself, and it shrank the build a lot

> *"HQ just care about the money transferred and the sales data, so the stock that return is going
> back to the regional warehouse not on normal EOD not the Master vault ... since HQ cant monitor
> the real supply number on the regional warehouse then the HQ will just trust the regional admin
> for that, as long as the total money transferred to the HQ is the same value with total goods
> sent to the regional warehouse"*

**Do not build a stock reconciliation into the HQ panel.** HQ trusts the regional admin on stock.
`HQ_CARDS = ['cash', 'transfer']` in `src/utils/eodRecord.js` already encodes this and is pinned by
audit group 47 — a goods gap deliberately never enters HQ's reconciliation.

## The two panels he asked for

> *"in the headquarter panel i think showing both dashboard to monitor the money convert ratio with
> the available supply on the regional warehouse"*

**(A) Daily — a match.** Money received today == sales recorded today. One number, one verdict, per
region. This is cheap: both figures already exist on the EOD reports.

**(B) Running — the money convert ratio.** Goods shipped to a region versus money that came back,
against the stock still sitting in that regional warehouse. **This is the leak detector**, and the
important property is that it is a TREND, not a day: *"a region bleeding money shows up as that
ratio drifting, not as a single bad day"*. A daily panel cannot see it. Plot it over weeks.

## Cost note

The week dashboard was already proven to cost **zero extra Firestore reads** — the EOD reports for
the period are already loaded by the screen. Confirm the same holds for the running ratio before
building it; if it needs a shipment history read per region, that is a different cost conversation.

## Depends on

- [[EOD - put the money figures in the audit line]] — HQ's check is much stronger against an
  append-only audit line than against a report document that can be reset or deleted.
