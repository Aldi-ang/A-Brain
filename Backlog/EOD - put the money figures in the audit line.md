---
title: EOD - put the money figures in the audit line
description: logAudit already records WHO approved every EOD and WHEN. It records no numbers, so HQ can see that a day was approved and never what was approved. Cheapest real work in the feature.
status: To Do
area: EOD Setoran / Audit Vault
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# EOD — put the money figures in the audit line

**Half a day's work at most, and it is the only part that does the job he actually described.**

His words, on why HQ exists in this flow: *"every day regional admin approval need to be sent to
the HQ, so HQ should be able to check whether there is some cheating or manipulation been done by
the regional team"*.

Checked against the code: `logAudit()` (`src/App.jsx`) already stores `user: user.email` on every
`EOD_VERIFIED`, so **who** approved is captured. The message is *"Verified EOD for Bagas"* — the
agent's name and nothing else. **HQ can see that a day was approved, never what was approved.**

## The change

Put the figures into the line that already gets written. Declared and accepted, per card, plus the
money gap. No new system, no new collection, no new screen — the Audit Vault already renders these
lines.

## Why it is worth doing before the big admin build

An audit line is **append-only and outside the report document**. If a report is later edited,
reset or deleted, the audit line still says what was signed for and by whom. That property is
exactly what he asked HQ to be able to check, and it survives things the report itself does not.

## Note the framing he chose

> *"if there is some missing input data to the factory then all the blame will go to the regional
> admin"*

**The record defends the admin as much as it catches one.** Use that framing when the feature is
explained to him and to them.
