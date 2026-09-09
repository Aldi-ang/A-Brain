---
confidence: high
checked: 2026-09-09
status: OPEN — the money finding needs Aldi's answer; everything else is ranked and unblocked
---

# The day-one customer walk — what a new customer meets in their first hour

## The problem, in his words

> "make sure both phone and PC looks good and work well" — 2026-09-08

and the frame the whole thing sits in, agreed the same day: ship to a paying customer before
**30 September 2026**, and the goal is not "no bugs" but "no bug on the paths his customer walks",
with everything else written down and ranked — money lies > data loss > branch leaks > day one >
appearance. Full reasoning in [[2026-09-08_shipping-readiness]].

Day one is the class that ends a sale before any other one matters. If onboarding breaks, nothing
else gets looked at. So the job was to walk it and write down what breaks, **without fixing**,
because the ranking is his and a session that fixes eagerly spends his deadline for him.

## How it was walked

Local Firebase emulator (`37f34ee`), empty tenant — one `employee_directory` row keyed by email
and nothing else. No seeded company: every product, person, store and sale below was created
through the UI, which is the point. Desktop at 1440x900 and phone at 375x812.

Seven paths, in the order a real customer meets them: first sign-in → first product → first person
→ load the van → first sale (Cash, then Titip) → first EOD → first consignment audit → Dashboard
and Product Performance.

All seven completed. The app is walkable end to end on an empty tenant, which is itself the
headline: nothing on the day-one path is a dead end.

## What broke, ranked by his own order

### 1. Money — one finding, and it is the one that needs him

**A Titip placement is booked as revenue at placement, and the store audit that proves it unsold
does not correct it.**

Walked: one Cash sale of 1 Bks at Rp 2.000, one Titip placement of 1 Bks at Rp 24.000 to a
registered store, then a store audit declaring 1 Bks still on the shelf (0 sold).

| screen | after the audit | correct? |
|---|---|---|
| Sales Terminal `TAKEN` | Rp 26.000 | no |
| Dashboard `OMZET` | Rp 26.000 | no |
| Product Performance | Surya 16 — 2 Bks sold, Rp 26.000, 100% | no |
| Receivables | Rp 24.000 outstanding, due in 7 days | yes |
| Store audit receipt | 0 Laku, TOTAL COLLECTED Rp 0 | yes |
| EOD expected cash | Rp 2.000 | yes |

Rp 2.000 was actually collected. The other Rp 24.000 is a packet on a shop's shelf, counted as
revenue and as debt at the same time, and the audit that proved it unsold moved nothing.

Two facts worth separating, because they have different fixes:

* **The rollups read the placement, not the audit.** Dashboard and Product Performance agree with
  each other and disagree with the audit, so this is one shared source, not two bugs.
* **`TAKEN` is the wrong word even if the booking is right.** "Taken" is money in hand. Whatever
  he decides about revenue recognition, a label promising collected cash should not include a
  consignment that has not been paid for.

`f46bc4a` — the fix that stopped returned consignment goods counting as sold — **holds**. The audit
itself is correct. The lie is downstream of it.

### 2. Data loss — nothing found on this walk

The offline drain (`e9b04e5`) was not exercised; the walk stayed online throughout.

### 3. Branch leaks — nothing found on this walk

One region, one branch, so the walk could not test it. Bug 3 (geofence bypass routing) is still
open and still unanswered.

### 4. Day one

* **The first product raises a false alarm.** MIN. ALERT left blank falls back to the company
  default of 3 Bal = 600 Bks, which is above any realistic first stock entry, so the very first
  product saved is instantly "critically low". The toast never expires — it was still on screen
  7 minutes and six screens later.
* **Toasts paint over dialogs.** Toast container `z-index: 10000`; the dialogs underneath create no
  stacking context. Three stacked errors completely covered the "WHO IS BUYING?" search box, and
  stale errors stayed after their cause was fixed.
* **A phantom competitor claims the first store.** A store created today and sold to the same day
  shows a permanent red banner: *ALREADY SECURED TODAY — Claimed by ANOTHER AGENT. Selling here is
  a redundant visit.* `CustomerManager.jsx:248` and `:1018` default a new customer's `lastVisit` to
  today; `MerchantSalesView.jsx:536` reads `lastVisit === localToday` and, with `lastVisitedBy`
  empty, falls back to the literal string `'another agent'`. The banner is deliberately
  undismissable, so it cannot be shrugged off.
* **Every sale requires a handover photo, unconditionally.** `MerchantSalesView.jsx:1570`. Right on
  a phone in the field; on the desk — the MASTER VAULT tab the owner sells from — there is no
  camera, so a laptop-only customer cannot complete a single sale.
* **New personnel default to `T3: HQ SALES MANAGER`** even when the role picker says Sales Motorist.
* **The GPS placeholder reads as a value** (`-7.6043, 110.2055`, empty `value`, same grey as real
  text), then Save fails with "This outlet has no map pin". The same form's first refusal is
  `SSOT Violation: You must specify the complete Matrix Location...` — jargon in front of a shop owner.
* **Phone: the only nav control is a 14px sliver.** `.kpm-edge-ribbon`, `w-[14px] h-[132px]`,
  `top:-66px` — the real target is 14x66px at the extreme right edge.
* **Phone: the notification bell is off-screen** (measured x 398 → 445 against a 375 viewport). The
  clock hides itself on purpose (`hidden md:flex`); the bell just overflows.

### 5. Appearance — deferred by him, recorded so it is not re-derived

~180 blue/green Tailwind classes remain in app UI: `MapMissionControl.jsx` 58,
`FleetCanvasManager.jsx` 50, `JourneyView.jsx` 33, `ConsignmentFinanceView.jsx` 33. Receipt and
surat-jalan blues are legal — the nota keeps company blue, see [[KPM Palette Law]] if it exists,
otherwise the memory rule. `bg-blue-600` is on the Fleet & Canvas add-personnel button today,
which is the palette law's own headline example.

Wording, each one read by a customer: `49 Bks left in the vehicle` while selling from Master
Vault · `Surya 16 (Available: 100 )` with a trailing space and no unit · the salesperson printed as
`ADIKARYASUKSES99` on the receipt and the consignment card · the EOD verify confirm claiming
"clears their inventory" on a stamps-only card · the EOD `MATCHES` column showing `—` when the two
numbers are equal · the audit receipt printing `BAYAR : CASH` on an audit that collected Rp 0 ·
`MIN. ALERT (BKS)` labelled over a `pakai batas perusahaan (3 Bal)` placeholder.

## Confirmed working — the point of writing this down is that nobody re-checks it

* `f46bc4a` holds: the audit does not count unsold goods as sold.
* EOD expected cash correctly excludes the Titip placement.
* Unit maths correct at every step: 1 Bal = 200 Bks, 1 Karton = 800 Bks; master stock 100 → 50
  after loading a van → 49 after a 1 Bks sale → 48 after the Titip.
* **The dashboard is not broken.** The open thread from 2026-09-08 — Rp 0 against three seeded
  transactions — was the seed writing no `timestamp`, exactly as suspected. Sales written by the
  app appear immediately. `txDate`/`dayOf` do not need touching.
* Every confirmation on the walk was an in-app dialog. No `window.confirm` survived anywhere.
* Every action reported itself, mascot and toast. The locked law holds.

## The decision

**OPEN — waiting on Aldi.** One question, and it outranks everything else on the list:

> Should a Titip placement count towards OMZET before the store audit says it sold?

If no, the Dashboard and Product Performance rollups must read the audit result rather than the
placement value, and every historical Titip is restated. That is why nothing was touched.

## Rejected on purpose

* **Fixing anything during the walk.** The brief said collect first, and more than one fix before
  reporting spends his ranking for him. Nothing was changed; the only writes were the fake company
  the walk itself created in the emulator.
* **Seeding the company and walking behind it.** The seed would have skipped exactly the screens
  under test — the first product form, the first roster entry, the first store. The empty tenant is
  the whole experiment.
* **Calling the low-stock alarm itself wrong.** It is correct once a company sets real thresholds;
  a salesman running dry mid-route is what it exists to catch. Only the empty-tenant default is wrong.
* **Auto-dismissing every toast.** Some toasts are the app's only report that an action happened,
  and a report that vanishes before it is read fails the same law it was built to satisfy. Errors
  and reports need different lifetimes.
* **Treating the blue/green count as urgent.** He deferred appearance in his own words. It is
  recorded here so the number does not get re-counted, and it stays last.
