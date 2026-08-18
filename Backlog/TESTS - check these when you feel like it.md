---
title: TESTS — check these when you feel like it
description: Every fix from the logic review that needs Aldi to confirm on a real phone/store. No rush, no order. Tick as you go.
status: To Do
area: Testing
priority: Medium
created: 2026-08-18
updated: 2026-08-18
---

# TESTS — check these when you feel like it

**No rush.** Aldi, 2026-08-18: *"im kinda dizzy looking at all the test, can u just put it in all
my to do list for later"*.

Everything here is **already fixed, built and self-checked**. This list is only for confirming it
behaves right in a real shop. Do one, do none, do them next month. Tell me any result and I act on it.

> ⚠️ These test the **new build**. If you are looking at the live/deployed app, it is still the old
> code and every test below will "fail" for the wrong reason. Deploy first, or test locally.

---

## 🔴 Worth doing first (money moves)

### [ ] 1. IOU + Titip in the same visit
Store has a pending IOU. Fulfil it, **then add normal goods**, choose **Titip**.
- **Must:** sale saves as **Titip**, the debt shows in Receivables, nota says Titip.
- **Before the fix:** whole basket became Cash, and the debt existed nowhere at all.

### [ ] 2. Buyback of healthy goods — van stock goes UP
Retur → Refund, condition **Good (Resellable)**, 10 packs of anything.
- **Must:** van stock **increases by 10**. EOD count then matches, no surplus.
- **Also try from the Master Vault** (admin sale, no agent selected) — vault must go up too.
- **Before the fix:** company paid, packs entered nothing, EOD showed a surplus that looked like
  the agent miscounted.

### [ ] 3. Buyback shows as a LOSS, not profit
Same buyback as above. Open the report.
- **Must:** Net Profit (Cuan) goes **down**.
- **Before the fix:** buying back Rp 1.000.000 of stock made profit go **up** by Rp 1.000.000.

---

## 🟠 Worth doing when convenient

### [ ] 4. Agent ranks look sane
Open any agent profile.
- **Must:** ranks spread out. A new agent is near the bottom. Not everyone Mythic.
- **If your Settings XP toggle already says "Career history":** nothing changes, and that is
  correct — the broken path was never running for you.

### [ ] 5. Sector settings survive a reload
1. Map screen → **Territory Manager** (the sector list panel)
2. Click a sector → **edit** (pencil icon)
3. Set **Target Revenue** = `5000000`, pick an assigned agent
4. **Save** — you see "Sector Configuration Saved! 🚀"
5. **Reload the whole page** (F5)
6. Open that same sector again
- **Must:** target still reads 5.000.000.
- **Before the fix:** blank every single time. Every target you ever set was lost.
- **New:** if the save fails now, you get a warning instead of a fake success.

### [ ] 6. New store from the map is billed correctly
Add a store from the map. Dropdown now offers **Retail / Grosir / Ecer**.
- **Must:** that store is billed at the price you picked.
- ✅ **Aldi already confirmed this one works** (2026-08-18).
- 🔴 **Open question:** the rank dropdown is gone from that form — rank is now the Tier Automation
  Engine's job. Say if you want it back as a second dropdown.

---

## What I check myself now, so you do not have to

Aldi, 2026-08-18: *"i want u to check every single update that u made yourself from now on"*.

`src/config/logicFixes.selfcheck.mjs` — every fix leaves two assertions there:
- a **regression guard** (the broken code must not come back)
- a **behaviour check** (the maths re-run on real numbers)

Run with the rest:
```
npm run build; node src/config/integration.audit.mjs; node src/config/logicFixes.selfcheck.mjs
```

**A fix without a line in that file is not finished.** Current: 26 checks, 0 failing.

That catches code going wrong. It cannot catch *"this is not how my business works"* — that is
what the list above is for, and only you can answer it.
