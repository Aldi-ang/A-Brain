---
title: "Business & UX Improvement Testing Session — 2026-07-28"
description: Live walkthrough checklist for tomorrow, from a business owner and employee perspective — not bug-hunting, since Batch 1+2 landed and no bugs are currently known. Looking for what's slow, confusing, or missing value.
status: To Do
area: UX & Business Value
priority: Medium
created: 2026-07-27
updated: 2026-07-27
tags: [testing, ux, business-value]
---

# Business & UX Improvement Testing — 2026-07-28

**Purpose, different from `MANUAL_TEST_CHECKLIST.md`:** that checklist hunts for crashes and
data-integrity bugs. This one assumes the app *works* — no bugs currently known — and asks a
different question for each screen: **would a real business owner or a real employee actually
want to use this, as-is?** Looking for friction, confusion, missing value, and things that feel
tedious enough that a real person would start skipping steps.

**How to use this tomorrow:** go through each section logged in as that tier (or as close to
it as you can get), actually use the screen for its real purpose, and jot a one-line note next
to anything that feels off. Don't fix anything mid-session — just capture. After the session,
turn each real finding into its own Backlog card (or a Brainstorm note if it's more of an idea
than a decided fix).

---

## Owner / Admin perspective (Tier 1 DEVELOPER, Tier 2 COMPANY_OWNER)

Screens: `DashboardView` / `DashboardBenchmarks`, `SettingsView`, `LandlordDashboard`,
`HistoryReportView`, `AuditVaultView`

- [ ] **Dashboard** — first thing in the morning, does it show what actually matters (today's
      sales, low stock, anything needing approval) without digging? Anything missing that an
      owner would want to see immediately?
- [ ] **Benchmarks/Reports** — can you actually answer "how's the business doing this month vs
      last" without exporting to a spreadsheet in your head?
- [ ] **Settings → Permission Matrix** — try configuring a tier's permissions as if you'd never
      seen the code. Is it clear what each toggle actually does?
- [ ] **Audit Vault / History Report** — if something looked wrong, could you trace who did
      what fast enough to use it in a real dispute with an employee or customer?
- [ ] **New employee onboarding** (Fleet & Canvas → register agent) — how many steps from
      "hire someone" to "they're actually productive"? Anything that feels like more clicks
      than it should be?
- [ ] **New customer onboarding (NOO flow)** — does it feel fast enough to do standing in
      front of a new customer, or clunky enough you'd want to do it later at a desk instead?
- [ ] **Rank Config / Achievement Badges / Hall of Fame** — does the gamification actually feel
      motivating, or is it decoration nobody looks at twice? (Relates to the parked
      [[Rank Config and Achievement Badges redesign]] card — worth deciding if it's even worth
      finishing given real usage.)
- [ ] **Crown Transfer** — still parked on the conversation with the company boss (see
      [[Crown Transfer (Option A)]]) — not a testing item, just flagging it's still there.

## Area Admin / Fleet Captain perspective (Tier 3, Tier 4 — the supervisors)

Screens: `FleetCanvasManager`, `MapMissionControl`, `RestockVaultView`,
`BranchWarehouseManager`, `StockOpnameView`, `EODReconciliationView`

- [ ] **Fleet & Canvas** — managing/hiring/firing agents and assigning territory: is this
      something a manager could do efficiently on a regular basis, or does it feel like a
      once-in-a-while chore because it's awkward?
- [ ] **Map Mission Control** — is the map genuinely useful for planning routes/borders day to
      day, or mostly a nice visual nobody actually relies on?
- [ ] **Restock Vault** — when a branch needs stock, is request → approval → fulfillment fast
      enough that a store doesn't run dry waiting on it?
- [ ] **Stock Opname** — time an actual count. Is it a 10-minute task or does it drag into an
      hour? Would a real employee start finding shortcuts (i.e. cheating) to avoid it?
- [ ] **EOD Reconciliation** — can a supervisor verify a full day's work in a reasonable time,
      or is it tedious enough that steps might start getting skipped under real pressure?

## Field Operative / Rookie perspective (Tier 5, Tier 6 — the actual sales force)

Screens: `MerchantSalesView` (Sales Terminal), `JourneyView`, `AgentInventoryView`,
`AgentProfileView`, `ConsignmentFinanceView`

- [ ] **Sales Terminal** — complete a full sale start to finish, timing it. Any step that feels
      unnecessary or slow while a real customer is standing there waiting?
- [ ] **Journey/route view** — does it actually help plan a day's visits, or is it a map that
      gets opened once and ignored?
- [ ] **Agent Inventory** — can a field agent quickly check what stock they're carrying without
      digging through menus?
- [ ] **Agent Profile (rank/badges)** — does seeing rank/badges feel rewarding day to day, or
      is it something they never open?
- [ ] **Consignment Finance ("Titip" sales)** — is tracking a consignment sale clear to a field
      agent, or confusing enough they'd get it wrong?
- [ ] **Notifications** — do notifications actually reach them with useful, timely info, or do
      they get missed/ignored?

## Cross-cutting, applies to every role

- [ ] **Speed** — anything that feels slow enough a real busy employee would get frustrated
      waiting on it?
- [ ] **Offline reliability** — patchy signal is a real Indonesia field condition, not an edge
      case. Does the app behave believably when the connection is bad, not just when it's off?
- [ ] **Language/clarity** — any UI text that's confusing, too technical, or would land better
      in Indonesian phrasing for a field employee vs. English?
- [ ] **One-handed / mobile usability** — field agents are on phones. Anything hard to tap or
      read on a small screen while standing, not sitting at a desk?

---

## After the session

- Turn each real finding into its own card in this Backlog (or a Brainstorm note if it's more
  of an open idea than a decided fix) — don't leave findings only in this checklist.
- If you run `/save` or the session otherwise gets logged, tonight's 21:00 ingest routine
  should pick it up automatically — but if anything feels important enough not to risk missing,
  say so explicitly rather than relying on that alone.
