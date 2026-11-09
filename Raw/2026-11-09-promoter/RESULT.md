# Demo #15b - the store's "last visit" + level after a sale (diagnosis, 2026-11-09)

Probe: `probe.mjs` (copy run from the session's scratch rules-test install, firebase@11 + @firebase/rules-unit-testing),
the repo's current firestore.rules, emulator project demo-kpm-rules. The app's own two steps (MerchantSalesView
handleFinalDeal, "Auto-Promoter"): 1) getDoc `appSettings/tierRules`, 2) updateDoc the shop `{ lastVisit, lastVisitedBy, updatedAt, tier }`.

| login | 1 read the level targets | 2 write the shop |
|---|---|---|
| owner | ok | ok |
| T3 | REFUSED | ok |
| T4 | REFUSED | ok |
| T5 | REFUSED | ok |
| T6 | REFUSED | ok |

- Cause: `appSettings` has no rule of its own, so only the owner / T1 / T2 catch-all covers it (firestore.rules note
  ~L1141 lists appSettings among the owner-only fall-throughs). Step 1 throws for EVERY salesman, the catch only
  `console.error`s, and step 2 never runs. Not a T6 bug - every salesman's sale, since the promoter was written.
- Second: step 2 sits inside `if (rules)` (MerchantSalesView ~1392 / ~1523). A company with no level targets saved never
  records a visit date from a sale, not even the owner's.
- Third (after a fix to step 1): with shop folders ON, a T5/T6 without the team edit switch may write only the visit
  fields - a level change in the same write refuses the whole write, visit included (folderEditOk). A level name
  containing GOLD/GROSIR/WHOLESALE on a shop with no price level is refused for T5/T6 (grosirUpdateOk).
- Who still sees the visit: the Journey map marks a shop visited from today's sale itself (JourneyView ~966), so the map
  is right; the shop's saved "last visit" date (Customer Directory, visit frequency) and its level are what go stale.
