# KPM Inventory — Trophy Room, Rank System, Performance & Ergonomics
### A design document for the achievement/ranking system, the agent profile, and making the app light on cheap phones

Written 2026-07-28. Every claim about your code below was read directly from
`D:\APP DEVELOPMENT\kpm inventory main FILES\kpm-inventory-main` and is cited as `file:line`.
Nothing here has been written to your repo — this is design only.

---

## 1. The thing you need to know first

### Your "Lifetime" numbers are 7-day numbers, and every agent's rank is a speedometer, not an odometer

Here is the whole chain, in three lines of your own code.

**Line 1 — the app only ever downloads 7 days of sales.**

`src/hooks/useDatabaseSync.js:41-42` builds a cutoff date:

```js
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
```

and `src/hooks/useDatabaseSync.js:50` uses it:

```js
onSnapshot(query(collection(db, basePath, 'transactions'),
  where('timestamp', '>=', sevenDaysAgo), orderBy('timestamp', 'desc')), ...)
```

That is a good decision. It is what keeps the app openable on 3G. **Do not remove it.**

**Line 2 — the profile adds up that 7-day list and calls the result "lifetime".**

`src/AgentProfileView.jsx:413`:

```js
lifetimeOmset += (t.total || 0);
```

**Line 3 — rank is computed straight from that number.**

`src/AgentProfileView.jsx:495`:

```js
const lifetimeEXP = (lifetimeOmset * (rpgData.expMultiplier || 1)) + (activeAgent.manualExp || 0);
```

Then `src/AgentProfileView.jsx:502-509` walks the rank ladder against `lifetimeEXP`.

### What this means for your agents *right now, today*

The default ladder (`src/AgentProfileView.jsx:193-200`) is:

| Rank | EXP needed |
|---|---|
| Bronze | 0 |
| Silver | Rp 25.000.000 |
| Gold | Rp 100.000.000 |
| Platinum | Rp 250.000.000 |
| Diamond | Rp 500.000.000 |
| Mythic | Rp 1.000.000.000 |

An agent selling Rp 5 juta a day, six days a week, has a rolling 7-day total of about **Rp 30 juta**.
So:

- He hits Silver in his first week.
- He **can never reach Gold.** Not in a year, not in ten years. Gold needs Rp 100 juta *inside one
  7-day window*, which for him is impossible.
- If he takes a week off sick, his 7-day total drops toward zero and **his rank falls back to
  Bronze**. He literally watches his rank go down for being ill.
- Every Monday, last Monday's sales silently fall out of the window. His number goes down for no
  reason he can see.

The same maths runs the leaderboard — `src/HallOfFameView.jsx:22` and `:30` do the identical
calculation, so the Hall of Fame is a 7-day chart, not a hall of fame.

And the "Regional MVP {year}" trophy is worse. `src/AgentProfileView.jsx:380-394` filters by
`txDateStr.startsWith(currentYear.toString())` — but *every* row in a 7-day window is from this
year, so the year filter excludes nothing. The trophy at `src/AgentProfileView.jsx:1118` says
"Highest grossing sales operative in the current fiscal year." It is actually "best seller in the
last 7 days," and it can change owner on any given day.

The only number on the whole screen that is permanent is `manualExp`, which you set through a
browser `prompt()` at `src/AgentProfileView.jsx:322-331`.

### The second thing: rank counts money you haven't been paid

`src/AgentProfileView.jsx:413` adds `t.total` for **every** `type === 'SALE'`, with no check on
`paymentType`. A Titip (consignment) sale writes the full total at handover time — see
`src/hooks/useTransactionEngine.js` where the receipt is built with `total: totalRevenue` regardless
of payment method. So right now, **the fastest way to climb your ladder is to push consignment stock
into shops and never collect it.**

For a cigarette distribution business, that is the single worst thing you could accidentally reward.

### The third thing: two bugs sitting under all of this

**(a) Your offline sync deletes a sale from the phone before confirming the cloud write.**
This is the most damaging thing I found in the whole codebase, and it has nothing to do with
gamification.

In `src/App.jsx`, the flush loop builds a list of writes:

- `src/App.jsx:224` — `await clearProcessedItem('noo_profiles', localId);`
- `src/App.jsx:239` — `await clearProcessedItem('transactions', localId);`
- `src/App.jsx:242` — `await commitInChunks(db, writeBatch, operations);`
- `src/App.jsx:247` — `catch (err) { ... }`

`clearProcessedItem` deletes the record from the phone's IndexedDB. It runs **inside the loop that
only builds the list.** The actual upload happens afterwards at `:242`, and
`commitInChunks` → `await batch.commit()` (`src/utils/helpers.js:76`) can absolutely fail — weak
signal mid-upload, a permission error, a request too big because of delivery-proof photos. When it
does, the sales are **already gone from the phone and were never written to Firestore.** The catch
block says `Retrying later` but there is nothing left to retry.

Fix: move both `clearProcessedItem` calls to a second loop *after* `await commitInChunks(...)`
resolves. That is it. Commit first, then clear.

**(b) Verifying an EOD twice returns the same stock to the warehouse twice.**
`src/App.jsx:1623` is `handleVerifyEOD`. Inside its `runTransaction` it reads product docs and the
agent doc — but it **never reads the EOD report itself.** At `src/App.jsx:1804-1806` it just writes:

```js
const eodRef = doc(db, `artifacts/${appId}/users/${userId}/eod_reports`, report.id);
t.update(eodRef, { status: 'VERIFIED', verifiedAt: serverTimestamp() });
```

Two admins pressing Verify, or one double-tap on a slow connection, and stock gets returned twice.
This is a live bug today. Fixing it is one extra read (see Phase 0).

### One thing I was told was broken that is NOT broken — correcting the record

The investigation you commissioned flagged `src/App.jsx:3398` (`userId={user?.uid}` passed to
`AgentProfileView`, while every other view gets `userId={userId}`) as a **critical bug** that breaks
avatar/bio/EXP saving for every Tier 3–6 employee. Three of the proposals and two of the three
critiques built their "Phase 0" on it.

**I checked, and it is not a bug.** `src/App.jsx:282` is:

```js
const userId = bossUid || user?.uid || user?.id || 'default';
```

and the employee login path at `src/App.jsx:1975-1976` builds the user object like this:

```js
const hijackedUser = {
    uid: trueBossUid || currentUser.uid, // 🚨 CRITICAL: Forces connection to the Master Vault
```

`user.uid` **already is** `bossUid` for every employee. `setBossUid(trueBossUid)` at
`src/App.jsx:1971` and `setUser(hijackedUser)` at `:1987` are in the same block, so the two values
are always identical. `userId={user?.uid}` and `userId={userId}` resolve to the same string.

It is still worth changing to `userId={userId}` **for consistency**, because relying on the hijack
being applied inside the user object is fragile — but it is a tidy-up, not an emergency, and nobody
is losing bio saves because of it. I would rather tell you that than let you spend a session fixing
a phantom.

(A real, smaller version of that concern does exist: `canEditProfile` at
`src/AgentProfileView.jsx:188` is `hasClearance(userRole, 'edit_agent_roles') || own profile ||
master_owner`. Only Tier 1 and Tier 2 hold `edit_agent_roles` (`src/config/permissions.js:59`). The
rules at `firestore.rules:479-480` allow a salesman to update only their own motorist doc. Those two
agree. No gap.)

---

## 2. What's already good

I want to be specific here, because a lot of this is better than it needs to be and a redesign
could throw it away by accident.

**1. The offline architecture is genuinely well built.** Firestore is initialised with
`persistentLocalCache` (`src/config/firebase.js:24-26`), and on top of that you built a separate
IndexedDB pending-write queue with a sync log (`src/hooks/useOfflineEngine.js`). That is the correct
shape for patchy 3G and it is better than most commercial apps. The flush ordering bug above is a
two-line fix in an otherwise correct system.

**2. `commitInChunks` (`src/utils/helpers.js:53-91`) is properly done.** It chunks by count *and*
by bytes (8 MiB), and it paces itself with a 150 ms gap between chunks. The comments explain
exactly why. This is real engineering, not copy-paste.

**3. The data-driven badge engine is the right design.** `DEFAULT_BADGES` at
`src/AgentProfileView.jsx:20-26` is `{ id, source, target, title, desc, icon, hex }` — rows loaded
from Firestore (`:140`), edited in a real UI (`:612-666`), saved back (`:149`), and rendered with
`{val} / {max}` template interpolation and progress bars (`:1125-1157`). That is better than the
hardcoded `BADGE_REGISTRY` in `src/config/achievements.js:18-69` that it was clearly meant to
replace. **Keep the configurable one. Finish the migration.**

**4. Locked badges show progress instead of being hidden.** `src/AgentProfileView.jsx:555-567`
renders locked badges greyscaled with a filled bar and real numbers. That is correct gamification —
you can see what you are climbing toward. Do not lose this.

**5. Lite Mode ("Potato Engine") is a real, persisted, global GPU governor.** State at
`src/App.jsx:1110`, class applied to `<html>` at `:2078-2085`, toggle in
`src/components/SettingsView.jsx:195-213`, CSS at `src/App.jsx:3086-3098` and
`src/index.css:41-61`. Most apps at this scale don't have one. It has a gap (see §6) but the
skeleton is right.

**6. The per-rank `borderImage` escape hatch already exists and already works.**
`src/AgentProfileView.jsx:832-836` lets an uploaded frame fully override the CSS frame. That is
exactly the extension point a trophy room needs, and you built it before anyone asked for it.

**7. The photo-storage toggle is already wired for avatars.**
`src/AgentProfileView.jsx:248-262` routes the avatar through `savePhotoAndGetReference`
(`src/utils/helpers.js:102`) and deletes the previous image with `deletePhotoFromStorage`
(`:115`). The Spark/Blaze fallback comment in `helpers.js:94-101` is thoughtful. The same pattern
just needs applying to rank art.

**8. The leaderboard button is open to everyone.** `src/AgentProfileView.jsx:817` has no clearance
check, while the Agent Directory sidebar at `:759` does. Whether deliberate or not, that is the
right call: everyone sees the scoreboard, only management browses dossiers.

**9. `workingDays` is real local fit.** `src/AgentProfileView.jsx:192` and `:370` let you declare
which days count, so a six-day Indonesian week isn't charted against a Western Monday–Friday
assumption. Thoughtful.

**10. The Titip and Canvas expanders are the most useful thing on the profile.**
`src/AgentProfileView.jsx:940-992` — tapping a number to see which shops owe what. That has nothing
to do with gamification and it must survive any redesign.

**11. `firestore.rules` is genuinely well-commented.** The `[CHANGE 2]`, `[CHANGE 3]`, `[CHANGE 8]`
blocks (`firestore.rules:439-478`, `:534-546`) explain *why* each rule is shaped the way it is, and
record emulator results. Very few professional codebases do this. Keep the habit.

**12. `MAKE DEAL` is the best-behaved button in the app.** It has a real disabled state, a distinct
processing state, and it renders the *specific reason* it's blocked on the button face
(`src/MerchantSalesView.jsx:901`, `:1247-1259`). That is good design and should be the model for
other buttons.

---

## 3. The recommended design — "Buku Karir" (the Career Book)

### Where each piece came from, and why

I was given three proposals and three critiques. I am not picking one; I am picking a spine and
grafting.

| Piece | Taken from | Why |
|---|---|---|
| **Career data in its own `career/{agentId}` collection**, not on the motorist doc | *Ledger* | The engineering critique verified this: writes to `users/{bossUid}/**` already fall through to the catch-all at `firestore.rules:281-282` (`isVaultOwner \|\| isDistributorAdmin`) — which is **already** exactly the set that can verify an EOD (`eod_reports` is `allow update, delete: if false` at `firestore.rules:522-523`). So this needs **2 new rule lines and zero field-level clamps.** The other two proposals require clamping `firestore.rules:479-480`, the rule every sale depends on. That's the single riskiest change on the table. Not worth it. |
| **`base` / `live` split** (backfill SETs absolutes, live path only `increment()`s) | *Ledger* | Makes the backfill idempotent by construction — run it ten times, get the identical document, no "already ran" flag to get wrong. |
| **Phase ordering: new tile alongside the old number first, switch the ladder together with the backfill** | *Day Book* | *Locker Room* switches the hero to `career.xp` in the same phase that starts writing it, so on deploy day everyone reads zero. That is exactly the "the trophy room lied to me once" failure it warns about. |
| **`dayXP` + `xpBreakdown` stamped on the EOD report** | *Day Book* | A permanent ledger that turns out to be wrong is unfixable without an audit trail. With it, every day's contribution traces to one report and one set of numbers. |
| **`src/config/career.js` as a pure module with a runnable self-check** | *Day Book* | `package.json` has no test runner. A Firebase-free module with an `assert`-based `demo()` you run with `node src/config/career.js` is the only executable test this repo can have without new tooling. |
| **`frameUrl` accepted only if it starts with `https://`** | *Day Book* | One condition that makes base64-in-a-settings-doc structurally impossible to reintroduce. |
| **Cosmetics as string IDs in a code registry, not images** | *Locker Room* | Zero Firestore reads, zero network, works offline. The single best decision for a cheap phone in all three proposals. |
| **Three starter frames handed to a new hire before their first sale** | *Locker Room* | The only answer anyone gave to "the rookie's shelf is empty". |
| **Peer grid sorted by tenure, open to all six tiers** | *Locker Room* | You cannot be "last" on a list ordered by the calendar. |
| **Awards in a subcollection, not an array on the doc** | *Locker Room* + *Day Book* | Firestore re-sends the whole document on any field change. An award array on a listener-synced doc re-transmits every award to every phone every day. |
| **`peakXP` with a permanent "Puncak: Gold" ghost marker** | *Ledger* | The best single piece of emotional design in all three documents. Nobody ever watches a rank disappear. |
| **Idempotency keyed on `(dayKey, reportType)`, not on report status** | *engineering critique* | I verified this. `handleResetEOD` at `src/App.jsx:1817` **deletes** the report rather than un-verifying it, so a status-based guard is defeated by a button that already exists. And there are **two** chargeable report types per agent per day (`CASH_STOCK` at `src/EODReconciliationView.jsx:421`, `CUKAI` at `:520`) — so a day-only guard drops a whole day's revenue on a coin flip. |
| **`reportType: 'BOUNTY'` excluded from every money term** | *engineering critique* | Verified: `src/EODReconciliationView.jsx:306-308` submits `cash: agentBountyData.total` — that "cash" is a **damage fine the agent is paying.** Without the guard, damaging Rp 5 juta of stock and paying for it would *award* XP. |
| **Precache fix shipped BEFORE any of this** | *potato-phone critique* | Verified: `src/assets/music/` is 9.66 MB of game soundtracks and `public/` holds another ~9.5 MB of PNG/MP4. `vite.config.js:12` precaches all of it. |
| **Non-money terms weighted to ~55% of a typical day** | *human critique* | *Ledger*'s own weights come out ~98% money in a design whose stated goal is "not just work for money". *Day Book*'s flat bonuses max out after two months and collapse back to money. Mine is in between and stays there. |
| **Monthly, branch-scoped season with a top-3 podium and no rank number below third** | *Day Book* + *human critique* | Nobody is permanently last. |

---

### 3.1 The data model — real paths, real shapes

Everything lives under the company vault you already use:
`artifacts/cello-inventory-manager/users/{bossUid}/`.
`{bossUid}` is the `userId` computed at `src/App.jsx:282`.

#### A. The career ledger — `.../career/{agentId}` (NEW collection)

One small document per motorist. `{agentId}` is the same motorist doc id used everywhere else.

```js
{
  // ── BASE: written ONLY by the one-time backfill. Always SET to absolute values.
  //    Because it's SET and not incremented, running the backfill twice gives
  //    the identical document. No "already ran" flag needed.
  base: { collected: 0, itemsBks: 0, titipCollected: 0,
          daysVerified: 0, cleanCukaiDays: 0, storesServed: 0 },
  baseThrough: '2026-08-31',        // any day ON OR BEFORE this is already inside `base`

  // ── LIVE: written ONLY inside handleVerifyEOD, ONLY with increment().
  live: { collected: 0, itemsBks: 0, titipCollected: 0,
          daysVerified: 0, cleanCukaiDays: 0, storesServed: 0,
          cleanCounts: 0,    // stock opname with zero variance   (phase 5)
          honestDamage: 0,   // damage resolved RTV/SAMPLING       (phase 5)
          penalties: 0,      // PENALTY_ keys ever issued          (phase 5)
          newOutlets: 0 },   // NOO attributed to this agent       (phase 5)

  // ── THE DOUBLE-CREDIT GUARD. Key is 'YYYY-MM-DD:REPORTTYPE'.
  //    Survives verify → reset → resubmit → verify, which a status check does not.
  //    ponytail: pruned to the newest 90 keys (~45 working days) on every write.
  //    Upgrade to a Cloud Function only if someone actually needs to re-verify
  //    something older than that.
  credited: { '2026-07-27:CASH_STOCK': true, '2026-07-27:CUKAI': true },

  lastVerifiedDay: '2026-07-27',
  streakCurrent: 12,
  streakBest: 31,                   // monotonic — the badge source. Current may reset.

  joinDate: '2019-03-14',           // typed by a human. NEVER derived from createdAt.

  bonusXP: 5000,                    // sum of hand-granted awards, kept here so XP math is O(1)
  awardCount: 3,

  peakXP: 41230,                    // never goes down. "Puncak: Gold" ghost marker.
  peakRankId: '3',

  season: { key: '2026-07', score: 1840 },   // resets on month rollover

  unlocks: ['frame.starter_ember','frame.gold_v1','title.anniv_5y','badge.eod_100'],

  updatedAt: <serverTimestamp>
}
```

**Size:** roughly 30 numbers, 6 short strings, two small arrays, plus a pruned `credited` map ≈
**3–4 kB per agent**. Twelve agents ≈ **45 kB for the whole company's career history.**
Firestore's hard cap is 1,048,576 bytes per document — 250× headroom.

**Why a separate collection and not fields on `motorists`:**
`firestore.rules:280-283` already says

```
match /artifacts/cello-inventory-manager/users/{bossUid} {
  match /{document=**} {
    allow read, write: if isVaultOwner(bossUid) || isDistributorAdmin(bossUid);
  }
```

So write authority on a new collection under that path is already correct with **zero** work.
Putting `career` on the motorist doc instead would require clamping `firestore.rules:479-480` —
the rule that lets a field agent update their own doc, which is how `activeCanvas` is deducted
during every sale (`src/hooks/useTransactionEngine.js:216`) and during sample deployment
(`src/MerchantSalesView.jsx:598`, which writes `activeCanvas` **and** `cukaiDebts`). Get that
allowlist one field short and every sale in the company starts failing. Not worth it for a
gamification feature.

#### B. Awards — `.../career/{agentId}/awards/{awardId}` (NEW subcollection)

```js
{
  title:      'Ketenangan Luar Biasa',
  reason:     'Tetap tenang menghadapi pemilik toko yang marah di Magelang, 12 Agustus.',
  xp:         2000,
  cosmetic:   'frame.penghargaan_2026',   // optional; pushed into unlocks by the same write
  icon: 'ShieldCheck', hex: '#f59e0b',
  grantedBy:     '<uid>',
  grantedByName: 'Pak Aldi',
  grantedAt:     <serverTimestamp>
}
```

Read cost: **zero** on the profile hero and zero on the peer grid (the count and the newest one are
denormalised onto the parent doc). Only "Lihat semua" fires a `limit(20)` query.

This replaces `handleManualExpSave` (`src/AgentProfileView.jsx:322-331`) — a browser `prompt()`
labelled *"Set to 1000000000 to instantly hit Mythic"* that writes a number with no reason, no
grantor, no date, and no `logAudit` call.

#### C. Config — `.../settings/progression` (NEW, replaces two leaking docs)

Today rank config and badge config live at:

- `src/AgentProfileView.jsx:140` — read `artifacts/${appId}/settings/achievements`
- `src/AgentProfileView.jsx:149` — write the same
- `src/AgentProfileView.jsx:208` — read `artifacts/${appId}/settings/rpg_ranks`
- `src/AgentProfileView.jsx:337` — write the same

That is **one document shared by every company in the whole Firestore project.** The rule at
`firestore.rules:275-277` is:

```
match /artifacts/cello-inventory-manager/settings/{docId} {
  allow read: if isAuthenticated();
  allow write: if isRankConfigEditor();
}
```

and `isRankConfigEditor()` (`firestore.rules:114-118`) is any authenticated user whose profile role
is `COMPANY_OWNER` or `ADMIN` — **of any company.** So any other distributor using your app can
overwrite your rank ladder and your badges, and you can overwrite theirs. This is a real leak and
moving it fixes it.

```js
{
  version: 2,
  xp: { rupiahPerXp: 100000, xpPerVerifiedDay: 25, xpPerCleanCukaiDay: 10,
        xpPerTenureDay: 5, xpPerCleanCount: 100, xpPerStore: 1, storeCapPerDay: 15 },
  workingDays: [1,2,3,4,5,6],
  ranks: [
    { id:'1', name:'Perintis',  min:0,      hex:'#d97706', title:'Baru Berangkat', frame:'frame.bronze_v1' },
    { id:'2', name:'Andalan',   min:1500,   hex:'#94a3b8', title:'Pedagang Ulet',  frame:'frame.silver_v1' },
    { id:'3', name:'Juragan',   min:6000,   hex:'#facc15', title:'Raja Pasar',     frame:'frame.gold_v1' },
    { id:'4', name:'Sesepuh',   min:18000,  hex:'#22d3ee', title:'Penjaga Rute',   frame:'frame.cyan_v1' },
    { id:'5', name:'Legenda',   min:45000,  hex:'#c084fc', title:'Tulang Punggung',frame:'frame.violet_v1' },
    { id:'6', name:'Pusaka',    min:100000, hex:'#f43f5e', title:'Sesepuh KPM',    frame:'frame.crown_v1' }
  ],
  badges: { 'badge.eod_365': { enabled: true, target: 365, label: 'Setahun Penuh' } },
  customFrames: { 'frame.ramadan_2026': { label:'Ramadan 2026',
                    url:'https://firebasestorage.googleapis.com/.../ramadan.webp' } }
}
```

Two things changed and they matter:

1. **`frame` is a string key, not an image.** Today `src/AgentProfileView.jsx:265` and `:270` assign
   raw base64 straight into `rank.logo` and `rank.borderImage`, and `:337` writes the whole ladder
   as one `setDoc`. Six ranks × two image slots × ~107 kB of base64 ≈ **1.28 MB against a
   1,048,576-byte hard cap.** You get about 8 uploads and then saves start failing with
   `alert("Failed to save Rank Configuration.")` (`:340`) telling you nothing. With string keys this
   document stays ~4 kB forever.
2. **`customFrames[].url` must start with `https://`.** One condition, enforced on save. Base64 can
   never get back in.

Doc size ≈ 4 kB. One `getDoc` on profile mount, replacing two.

#### D. Two new fields on `.../motorists/{agentId}`

```js
loadout: { frame: 'frame.gold_v1', title: 'title.anniv_5y', badge: 'badge.eod_365' },
seenBadges: ['badge.eod_100', 'badge.anniv_5y']   // so the unlock celebration fires once
```

`motorists` is already synced in full with no time gate (`src/hooks/useDatabaseSync.js:47`), so
these cost nothing to read anywhere. The agent writes them — already allowed by
`firestore.rules:479-480`, **no rules change needed.**

#### E. Fields added to `.../eod_reports/{reportId}`

Written by the agent at submit time (`src/EODReconciliationView.jsx:421-431`):

```js
dayKey: '2026-07-27',        // LOCAL date (WIB), not toISOString() which is UTC
storesServed: 14,
cukaiRemaining: 0,
titipCollected: 350000,
itemsBks: 1240
```

and by the admin at verification (`src/App.jsx:1806`):

```js
dayXP: 87,
xpBreakdown: { collected: 40, closed: 25, cukai: 10, route: 12 }
```

**Why `dayKey` and not `date`:** I checked all three `onSubmitEOD` payloads
(`src/EODReconciliationView.jsx:306`, `:421`, `:520`) and `handleSubmitEOD`
(`src/App.jsx:1595-1601`). **There is no `date` field on any EOD report.** One of the three
proposals built its entire double-credit guard on `report.date`, which does not exist, and
`src/config/firebase.js` does not set `ignoreUndefinedProperties`, so writing `undefined` would
throw inside the transaction and roll back the stock return. Always coalesce:
`report.dayKey ?? localDayKeyFromTimestamp(report.timestamp)`.

**Why local, not UTC:** `getCurrentDate()` (`src/utils/helpers.js:11`) and
`src/AgentProfileView.jsx:357` both use `toISOString().split('T')[0]`, which is UTC. Indonesia is
UTC+7, so "today" currently flips at **07:00 WIB — right in the middle of a motorist's morning
route.** A streak broken by a timezone bug is a trophy taken away for nothing.

---

### 3.2 How XP works, and why it can never decay again

One new file, `src/config/career.js`, ~60 lines, **no Firebase import** so you can run it with
`node`:

```js
export const DEFAULT_XP = {
  rupiahPerXp:       100000,  // Rp 100.000 actually collected = 1 XP
  xpPerVerifiedDay:      25,  // you closed the day and the boss signed it
  xpPerCleanCukaiDay:    10,  // zero pita cukai debt after this EOD
  xpPerTenureDay:         5,  // one calendar day of service
  xpPerCleanCount:      100,  // a stock opname with zero variance
  xpPerStore:             1,  // per store served that day
  storeCapPerDay:        15
};

export const totals = (c = {}) => {
  const b = c.base || {}, l = c.live || {};
  const add = k => (b[k] || 0) + (l[k] || 0);
  return {
    collected:      add('collected'),
    itemsBks:       add('itemsBks'),
    titipCollected: add('titipCollected'),
    daysVerified:   add('daysVerified'),
    cleanCukaiDays: add('cleanCukaiDays'),
    storesServed:   add('storesServed'),
    cleanCounts:    l.cleanCounts   || 0,
    honestDamage:   l.honestDamage  || 0,
    penalties:      l.penalties     || 0,
    newOutlets:     l.newOutlets    || 0,
    streakBest:     c.streakBest    || 0,
    awardCount:     c.awardCount    || 0,
    tenureDays:     c.joinDate
      ? Math.max(0, Math.floor((Date.now() - Date.parse(c.joinDate)) / 86400000)) : 0
  };
};

export const careerXP = (c = {}, w = DEFAULT_XP) => {
  const t = totals(c);
  return Math.floor(t.collected / w.rupiahPerXp)      // MONEY (collected, not handed out)
       + t.daysVerified   * w.xpPerVerifiedDay        // SHOWING UP
       + t.cleanCukaiDays * w.xpPerCleanCukaiDay      // DISCIPLINE
       + t.cleanCounts    * w.xpPerCleanCount         // ACCURACY
       + t.tenureDays     * w.xpPerTenureDay          // TIME SERVED (a clock)
       + (c.bonusXP || 0);                            // APPRECIATION (signed by you)
};
```

#### Why it cannot decay — the whole proof

| Term | Where it comes from | Can it fall? |
|---|---|---|
| `collected` | `increment(report.cash + report.transfer)` at verify | No — `increment()` only, never recomputed |
| `daysVerified` | `increment(1)` at verify | No |
| `cleanCukaiDays` | `increment(0 or 1)` at verify | No |
| `cleanCounts` | `increment(1)` on a clean stock count | No |
| `tenureDays` | `today − joinDate` | No — that's a calendar |
| `bonusXP` | `increment(award.xp)` | No |

Every term is a sum of non-negative increments or a clock. **There is no code path anywhere that
subtracts.** Nothing to protect, nothing to remember — the shape of the data forbids decay. And no
Firestore query window is involved anywhere in the read path, so the 7-day listener at
`useDatabaseSync.js:50` becomes completely irrelevant to rank. **You keep the listener. It is
correct. Rank just stops depending on it.**

On top of that, `peakXP: Math.max(old, new)` is written on every verify. Even if you later issue a
negative correction award, the profile still shows a permanent ghost marker at "Puncak: Juragan."
**An employee never watches a rank or a badge vanish from their own screen. Ever.** That is the
emotional contract the whole feature rests on.

#### The daily formula

```js
export const computeDayXP = (report, prevCareer, cfg) => {
  if (report.reportType === 'BOUNTY') return { total: 0, breakdown: {} };  // a fine, not income

  const collected  = Number(report.cash || 0) + Number(report.transfer || 0);
  const cukaiClean = Number(report.cukaiRemaining || 0) <= 0;

  const b = {
    collected: Math.floor(collected / cfg.rupiahPerXp),
    closed:    cfg.xpPerVerifiedDay,
    cukai:     cukaiClean ? cfg.xpPerCleanCukaiDay : 0,
    route:     Math.min(cfg.storeCapPerDay, Number(report.storesServed || 0) * cfg.xpPerStore)
  };
  return { total: b.collected + b.closed + b.cukai + b.route, breakdown: b };
};
```

`report.cash` and `report.transfer` need **nothing new** — they are already in the payload
(`src/EODReconciliationView.jsx:422-423`) and already computed at `:102-108` as exactly

```js
if ((t.type === 'SALE' && method !== 'Titip') || t.type === 'CONSIGNMENT_PAYMENT') { ... }
```

**Money actually collected. Titip handed out is worth zero XP until it comes back.** That is the
whole anti-Titip-farming mechanism and it is already written and already trusted for the physical
cash handover.

#### What a real day looks like

An agent collecting Rp 4 juta, serving 12 shops, with a clean stamp ledger:

| Source | XP | Share |
|---|---|---|
| Money collected (4jt ÷ 100.000) | 40 | 43% |
| Closed the day, verified | 25 | 27% |
| Clean pita cukai | 10 | 11% |
| Route (12 stores, capped at 15) | 12 | 13% |
| Tenure (runs every calendar day) | 5 | 5% |
| **Total** | **92** | |

**57% of a working day is not money.** That is your "not just work for money" written as arithmetic
instead of a slogan, and unlike a flat bonus it does not max out and collapse after two months —
route and money both keep scaling.

A big earner on Rp 10 juta/day gets 100+25+10+15+5 = 155/day. A quiet agent on Rp 1 juta/day gets
10+25+10+8+5 = 58/day. That is **2.7×**, not 10×. That compression is deliberate, and I'll be honest
that your best salesman will notice it. The pressure valve is §5: the **monthly Papan Omset board is
pure collected money**, and he wins it every single month. Career rank measures a career; the
monthly board measures this month's selling.

#### The ladder

XP, not Rupiah — so it doesn't need retuning when prices inflate or the company grows.

| Rank | XP | Roughly how long, at ~92 XP/day, 6 days/week |
|---|---|---|
| Perintis | 0 | day one |
| Andalan | 1.500 | ~17 working days (3 weeks) |
| Juragan | 6.000 | ~2,5 months |
| Sesepuh | 18.000 | ~8 months |
| Legenda | 45.000 | ~1,7 years |
| Pusaka | 100.000 | ~3,8 years |

Dense early so a new hire gets a real win in three weeks; long tail so Pusaka means something.
All six numbers, and all seven weights, live in `settings/progression` and are editable from the
Rank Config screen you already built. **Tune them against reality after month one** — my day is a
guess, your actual fleet is not.

Note the veteran effect: `tenureDays × 5` means a seven-year rider arrives at ~12.800 XP from tenure
alone on migration day — Juragan, before a single sale is counted. That is deliberate. In a family
business the man who has ridden for you since 2019 must not be outranked on day one by a rookie with
a good week.

#### Where XP is minted — inside a transaction that already runs

`handleVerifyEOD` at `src/App.jsx:1623`. No new transaction, no new document write, no Cloud
Function, no Blaze plan.

**Add to Phase 1 (reads), next to the reads at `src/App.jsx:1668-1674`:**

```js
const eodRef    = doc(db, `artifacts/${appId}/users/${userId}/eod_reports`, report.id);
const careerRef = doc(db, `artifacts/${appId}/users/${userId}/career`, lookupAgentId);
const eodSnap    = await t.get(eodRef);
const careerSnap = await t.get(careerRef);

if (!eodSnap.exists())                      throw new Error('Laporan EOD sudah tidak ada.');
if (eodSnap.data().status === 'VERIFIED')   throw new Error('Laporan ini sudah diverifikasi.');
```

**Those two lines fix the double-return-stock bug on their own** and are worth shipping before any
gamification.

**Add to Phase 2 (writes), just before `src/App.jsx:1806`:**

```js
const dayKey  = report.dayKey ?? localDayKey(report.timestamp);
const key     = `${dayKey}:${report.reportType || 'LEGACY'}`;
const c       = careerSnap.exists() ? careerSnap.data() : {};
const already = (c.credited || {})[key] === true;
const inBase  = dayKey <= (c.baseThrough || '');

if (!already && !inBase && report.reportType !== 'BOUNTY') {
  const { total: dayXP, breakdown } = computeDayXP(report, c, cfg);
  const prev      = c.lastVerifiedDay || '';
  const yesterday = prevWorkingDay(dayKey, cfg.workingDays);
  const streak    = prev === dayKey ? (c.streakCurrent || 1)
                  : prev === yesterday ? (c.streakCurrent || 0) + 1 : 1;
  const monthKey  = dayKey.slice(0, 7);
  const sameSeason = c.season?.key === monthKey;

  t.set(careerRef, {
    live: {
      collected:      increment(Number(report.cash||0) + Number(report.transfer||0)),
      itemsBks:       increment(Number(report.itemsBks||0)),
      titipCollected: increment(Number(report.titipCollected||0)),
      storesServed:   increment(Number(report.storesServed||0)),
      cleanCukaiDays: increment(Number(report.cukaiRemaining||0) <= 0 ? 1 : 0),
      daysVerified:   increment(report.reportType === 'CASH_STOCK' ? 1 : 0)
    },
    credited:        prune({ ...(c.credited||{}), [key]: true }, 90),
    lastVerifiedDay: dayKey,
    streakCurrent:   streak,
    streakBest:      Math.max(streak, c.streakBest || 0),
    season:          { key: monthKey, score: (sameSeason ? (c.season.score||0) : 0) + dayXP },
    updatedAt:       serverTimestamp()
  }, { merge: true });

  const fresh = newlyUnlocked(c, cfg);
  if (fresh.length) t.set(careerRef, { unlocks: arrayUnion(...fresh) }, { merge: true });
  //  ^^^^^^^^^^^^^^^^ NEVER call arrayUnion() with zero arguments — the Firebase SDK
  //  throws, and that throw would roll back the whole stock return.

  t.update(eodRef, { status:'VERIFIED', verifiedAt: serverTimestamp(), dayXP, xpBreakdown: breakdown });
} else {
  t.update(eodRef, { status:'VERIFIED', verifiedAt: serverTimestamp() });
}
```

`increment` is already imported at `src/App.jsx:93` and already used in this file. `t.set(...,
{merge:true})` creates the doc if it's missing, so no agent ever needs a "create career doc" step.

**Note `daysVerified` only increments on `CASH_STOCK`.** There are two chargeable report types per
agent per day (`CASH_STOCK` at `src/EODReconciliationView.jsx:421`, `CUKAI` at `:520`) and both go
through the same verify handler. Counting both would give some agents two "days" per day, and
`daysVerified` is a badge source.

#### The one runnable check

At the bottom of `src/config/career.js`:

```js
// node src/config/career.js
if (import.meta.url === `file://${process.argv[1]}`) {
  const A = console.assert;
  const cfg = DEFAULT_XP;
  A(computeDayXP({ reportType:'BOUNTY', cash: 5000000 }, {}, cfg).total === 0, 'bounty must score 0');
  A(computeDayXP({ reportType:'CASH_STOCK', cash: 0, transfer: 0, cukaiRemaining: 0,
                   storesServed: 0 }, {}, cfg).total === 35, 'quiet honest day = 25+10');
  A(computeDayXP({ reportType:'CASH_STOCK', cash: 4000000, cukaiRemaining: 0,
                   storesServed: 12 }, {}, cfg).total === 87, 'typical day = 40+25+10+12');
  A(computeDayXP({ reportType:'CASH_STOCK', cash: 0, storesServed: 99,
                   cukaiRemaining: 5 }, {}, cfg).breakdown.route === 15, 'route caps at 15');
  A(careerXP({ base:{collected:1000000}, live:{collected:1000000} }) === 20, 'base+live add up');
  A(careerXP({}) === 0, 'empty career is 0, not NaN');
  console.log('career.js OK');
}
```

Five asserts. If someone later changes a weight and breaks the bounty guard, this fails.

---

### 3.3 The achievement system

#### Kill one of the two systems

You currently have two, and they share no code, no data, no ids and no icon map:

- **System A** — `src/config/achievements.js:18-69`. Five badges with JavaScript `condition()`
  functions. Read by exactly one file, `src/HallOfFameView.jsx:3` and `:44`. **Not editable from any
  UI.** These are the badges shown next to every agent's name on the leaderboard — the most socially
  visible badges in the app — and you cannot rename or remove one without editing source.
- **System B** — `src/AgentProfileView.jsx:20-26`. Firestore rows, editable in your config modal.

There is also a **third** icon map, `BadgeIconMap` at `src/AgentProfileView.jsx:28`, which is defined
and never used anywhere.

**Delete `src/config/achievements.js` entirely** (all 73 lines: `BADGE_REGISTRY`,
`calculateAgentLevel` — a second, unrelated "1 level per Rp 5.000.000" ladder called exactly once
inside its own file at `:67` — and `checkUnlockedBadges`). Point `HallOfFameView` at the same
Firestore config the profile uses. **Net: one file gone, one whole parallel system gone, and your
leaderboard badges become editable for the first time.**

#### Schema

Your existing shape, plus three fields:

```js
{ id, cat, source, target, title, desc, icon, hex, fmt, unlocks }
```

- `cat` — `'jual' | 'andal' | 'masa' | 'wilayah' | 'tim' | 'seru'`
- `source` — a key of `totals(career)` instead of a recomputed 7-day stat
- `fmt` — `'rp' | 'count' | 'days'`
- `unlocks` — optional array of cosmetic ids granted when this badge lands

**`fmt` kills a real bug.** `src/AgentProfileView.jsx:1137-1138` decides Rupiah formatting by
substring-testing the source key:

```js
badge.source.includes('Omset') || badge.source.includes('Titip') ||
badge.source.includes('EXP')   || badge.source.includes('Items')
```

The actual key is `'titipCollected'` — lowercase `t` — so `includes('Titip')` is **false** and the
Debt Collector badge prints `Collected 12500000 / 50000000` with no separators and no "Rp". Meanwhile
`'totalItemsSold'` contains `'Items'`, so plain item *counts* get run through the Rupiah compact
formatter and display as `"8,2 rb / 10 rb items"`. **Exactly backwards on both.** An explicit `fmt`
field ends the guessing.

#### Evaluation — the elegant part

```js
export const isUnlocked = (badge, career, cfg) =>
  (totals(career)[badge.source] || 0) >= (cfg.badges?.[badge.id]?.target ?? badge.target);
```

That is the whole engine. **No unlock table, no extra reads, no extra writes.**

This works *only* because the ledger is monotonic: a badge that unlocked can never re-lock, so there
is nothing to persist. The `unlocks` array on the career doc exists purely so that **cosmetics** are
granted through an admin write (which is what makes them unforgeable), and `seenBadges` on the
motorist doc exists so the celebration fires once.

#### The starter set — with the exact data source for each, or an honest "not yet"

**PENJUALAN (jual) — money that actually arrived**

| Badge | Source | Target | Data source | Status |
|---|---|---|---|---|
| Penjualan Pertama | `collected` | 1 | `report.cash + report.transfer`, `src/EODReconciliationView.jsx:102-108` | ✅ works |
| 100 Juta | `collected` | 100.000.000 | same | ✅ |
| 1 Milyar | `collected` | 1.000.000.000 | same | ✅ |
| Penagih Ulung | `titipCollected` | 50.000.000 | `todaysTrans` filtered to `type === 'CONSIGNMENT_PAYMENT'`, `src/EODReconciliationView.jsx:95-100` | ⚠️ one line to add to the submit payload |
| Angkut 10rb Bks | `itemsBks` | 10.000 | `convertToBks()`, `src/utils/helpers.js:30`, over `todaysTrans` | ⚠️ one line to add. **Honest caveat:** `src/hooks/useTransactionEngine.js:221-227` deliberately deletes `qtyInBks` before saving the receipt, so the count is re-derived from *current* product records — editing `packsPerSlop` on a product retroactively changes history. Fix by keeping `qtyInBks` instead of deleting it (four fewer lines than deleting it). |

**KEANDALAN (andal) — reliability. The direct counterweight to money.**

| Badge | Source | Target | Data source | Status |
|---|---|---|---|---|
| Selalu Setor | `daysVerified` | 100 | `eod_reports` flipped to `VERIFIED`, `src/App.jsx:1806` | ✅ |
| Setahun Penuh | `daysVerified` | 365 | same | ✅ |
| Runtun 30 Hari | `streakBest` | 30 | computed in the verify write | ✅ |
| Tanpa Cela | `cleanCukaiDays` | 90 | `expectedCukai`, `src/EODReconciliationView.jsx:80-85` | ⚠️ one line (`cukaiRemaining`) to add to the payload |
| Nol Denda | `penalties` === 0 AND `daysVerified` ≥ 180 | — | `PENALTY_` keys written at `src/StockOpnameView.jsx:361-372` | ⚠️ needs an `increment` there (Phase 5) |
| Jujur Lapor | `honestDamage` | 10 | `quarantine_logs.method` = `RTV`/`SAMPLING` vs `PENALTY`, `src/StockOpnameView.jsx:356-383` | ⚠️ needs an `increment` there (Phase 5) |
| Hitungan Bersih | `cleanCounts` | 12 | `pending_audits` items carry `variance`, `src/StockOpnameView.jsx:226` | ❌ **CANNOT COMPUTE PER AGENT TODAY.** `src/StockOpnameView.jsx:207` writes `agentId: user.uid` — and because `user.uid` is the boss vault uid (`src/App.jsx:1976`), **every stock count in the whole company is currently recorded against you, not against the person who did it.** Change it to `user.agentId` first, then this badge works. |

That last row is exactly the kind of thing I promised to tell you rather than quietly promise a
badge the data can't back.

**MASA KERJA (masa) — completely ungameable**

| Badge | Source | Target | Data source | Status |
|---|---|---|---|---|
| 1 / 3 / 5 / 10 Tahun | `tenureDays` | 365 / 1095 / 1825 / 3650 | **`joinDate` — a new field** | ❌ **does not exist yet** |

Today tenure comes from `activeAgent.createdAt` (`src/AgentProfileView.jsx:512-518`), which is
stamped once at roster-creation time as an ISO string at `src/FleetCanvasManager.jsx:197`. So for a
man who has ridden for you since 2019, the app says **"Active: 3 Days"** — that's the age of the
database row, not the person. Any agent whose record predates that field has no `createdAt` at all,
so `daysInServiceNum` stays `0` forever and the display reads `'NEW'` (`:518`). Meanwhile
`master_owner` is hardcoded to 999 days and reads `'DAY ONE'`.

**One optional `<input type="date">` on the roster form fixes it, and it is the highest
value-per-line-of-code change in this entire document.** Tenure is the one form of recognition that
is impossible to fake, impossible to lose, and costs nothing to maintain.

**WILAYAH (wilayah) — territory and relationships**

| Badge | Source | Target | Data source | Status |
|---|---|---|---|---|
| Keliling 1000 | `storesServed` | 1000 | `new Set(todaysTrans.map(t => t.customerName)).size` at submit | ⚠️ one line. **Named honestly as store-visits served, not unique stores.** A truthful unique-store count is impossible today: `src/hooks/useTransactionEngine.js:317-322` appends " (Individual)" / " (Wholesale)" / " (Retail)" to a new customer's name based on one cart's price tier, so one physical shop becomes two or three names — while every anonymous sale collapses into the single string "Walk-in Customer". Fixing that needs the customer *document id* stored on the transaction. |
| Pembuka Jalan (10 toko baru) | `newOutlets` | 10 | `mappedBy` written at `src/hooks/useTransactionEngine.js:262-263` | ❌ **BLOCKED.** Only the sale-bundled NOO path writes attribution, and it writes a **name string**, not an id. The two standalone paths — `submitNooRegistration` (`src/MerchantSalesView.jsx:521-539`) and `submitNooOnly` (`:544-562`) — write **no agent attribution at all.** Add `mappedById: agentProfileId` to all three. Don't ship this badge until then. |
| Rute Bersih (zero overdue stores) | — | — | `customer.visitFreq` + `lastVisit`, already classified SAFE / EXPIRING / OVERDUE at `src/JourneyView.jsx:619-644` | ⚠️ **point-in-time only.** The customer doc stores only the *last* visit (`src/JourneyView.jsx:692` overwrites it), so a *streak* over time is not computable from customer docs. It would have to come from `VISIT_REPORT` entries in `audit_vault` (`src/App.jsx:2144`), which is the one archive that is never time-gated. Defer. |

**TIM (tim) — teamwork**

| Badge | Data source | Status |
|---|---|---|
| Serah Terima Bersih (clean account hand-offs) | `account_transfers`, created at `src/App.jsx:1417-1450`, approved at `:1580` | ⚠️ needs a counter; the data is real |
| Papan Cabang (best branch this month) | `m.location` on each motorist doc + `season.score` | ✅ computable today, zero new data |
| Mentoring a rookie / covering a sick colleague's route / co-visits | — | ❌ **NO DATA AT ALL.** I checked `defaultAgentState` (`src/FleetCanvasManager.jsx:85-94`) and both write paths (`:178-184`, `:196-204`): there is no `mentor`, `recruitedBy`, `trainedBy`, `squad` or `partner` field anywhere. **Do not ship badges for these.** They need new data written first. |

**SERU (seru) — personality, non-competitive, nobody can lose**

| Badge | Data source | Status |
|---|---|---|
| Wajah Baru — filled in a bio AND an avatar | `bio` (`src/AgentProfileView.jsx:311-320`) and `profileImage` (`:242-262`) on the motorist doc | ✅ **free, and deliberately available on day one so nobody's shelf is empty** |
| Penjelajah — served stores in 5 different Kecamatan | `customer._hierarchy`, `src/JourneyView.jsx:724-726` | ⚠️ needs a counter or an on-demand compute. Defer to Phase 5. |
| Burung Pagi — 20 days with a sale before 08:00 | derivable from `transaction.timestamp` (server time) at EOD | ⚠️ nothing counts it today. Easy to add, low priority. |

**PENGHARGAAN (given by hand)** — the `awards` subcollection. Free text title + reason. This is the
shelf that recognises everything the app will never measure: staying calm with an angry shop owner,
coming in on a day off, teaching a rookie. It is the escape hatch, and it is deliberately a human
one.

#### How you configure them

Your existing Achievement Config modal (`src/AgentProfileView.jsx:612-666`) stays — it's good work.
Three changes: it writes to `users/{bossUid}/settings/progression`; the Data Source dropdown
(`:628-636`) lists the `totals()` keys; and a category selector is added.

You can rename any badge into your own words, retune any target, and switch off any you don't like —
**including, for the first time, the leaderboard badges.** What you can't do is invent a new
`source` from scratch. That's strictly less flexible than today's free-text field, and it's the
price of deleting a whole parallel system. Note that today's flexibility is partly an illusion
anyway: the config dropdown offers no source that `BADGE_REGISTRY` understands, so a badge you
configure there never appears on the leaderboard.

---

### 3.4 Security rules — what changes and what doesn't

**Add (2 real lines) — inside `match /artifacts/cello-inventory-manager/users/{bossUid}`, next to
the `settings` block at `firestore.rules:530`:**

```
// Career ledger. READ: every employee — the profile and the leaderboard need it.
// WRITE: deliberately nothing here. Falls through to the users/{bossUid} catch-all
// at :281-282 = isVaultOwner || isDistributorAdmin ONLY. Same mechanic the
// [CHANGE 2] comment at :534 already documents for mapSettings.
// An agent can read their own XP and can never increment it.
match /career/{agentId} {
  allow read: if isSalesman(bossUid);
  allow write: if false;

  match /awards/{awardId} {
    allow read: if isSalesman(bossUid);       // rules do NOT cascade into subcollections
    allow update, delete: if false;           // an award is a permanent record
  }
}
```

**Emulator cases to prove (all of them, actually run, not just read):**

| Case | Expected |
|---|---|
| FIELD_OPERATIVE reads own `career` doc | ALLOW |
| FIELD_OPERATIVE writes own `career` doc | DENY |
| ROOKIE writes another agent's `career` doc | DENY |
| A user from a **different** `bossUid` reads this `career` doc | DENY |
| Vault owner writes `career` | ALLOW |
| Distributor ADMIN writes `career` | ALLOW |
| AREA_ADMIN writes `career` | DENY |
| FIELD_OPERATIVE reads another agent's `awards` | ALLOW (peer profile needs it) |
| Anyone updates or deletes an existing award | DENY |

**Changes needed to move the config: ZERO new rules.** `match /settings/{docId}` already exists at
`firestore.rules:530-533` with `allow read: if isSalesman(bossUid); allow write: if false;` — and the
catch-all at `:281-282` ORs in write access for the owner and distributor admin, exactly as your own
`[CHANGE 2]` comment at `:534-546` explains. Moving the four `doc()` paths in
`src/AgentProfileView.jsx` (`:140`, `:149`, `:208`, `:337`) from
`artifacts/${appId}/settings/...` to `artifacts/${appId}/users/${userId}/settings/progression`
inherits correct per-company scoping and correct write authority for free.

**Changes needed for `loadout`: ZERO.** `firestore.rules:479-480` already lets a salesman update
their own motorist doc.

**One thing I am deliberately NOT recommending.** Two of the three proposals wanted to clamp
`firestore.rules:479-480` with a `hasOnly([...])` field allowlist. I looked at what a field agent
actually writes to their own motorist doc and found at least these:

- `src/hooks/useTransactionEngine.js:216` — `activeCanvas`
- `src/MerchantSalesView.jsx:598` — `activeCanvas` **and `cukaiDebts`**
- `src/AgentProfileView.jsx:260` — `profileImage`
- `src/AgentProfileView.jsx:316` — `bio`

Both proposals' allowlists **omitted `cukaiDebts`.** Ship that and sample deployment starts failing
with permission-denied for every field agent — the exact "UI says yes, server says no" shape your
own rules file already documents four times (`[CHANGE 3]`, `[CHANGE 4]`, `[CHANGE 8]`,
`[CHANGE 9]`). Because career XP lives in its own collection where the agent has no write access at
all, **you do not need this clamp.** If you ever do it anyway: grep every
`updateDoc` / `batch.update` / `t.update` against `motorists` reachable from a field agent's session
and list every field, before you touch the rule.

Per your project convention, all of the above ships as commented `[CHANGE N]` blocks in
`firestore.rules` with emulator results recorded — not as silent `allow` edits.

---

## 4. The trophy room / profile UI

### First: the 3D question, with actual numbers

**Answer: no 3D library. Not now, not later, not for one screen.**

The arithmetic:

- Your eager JavaScript chunk today, measured from the build: **1.344,10 kB minified / 400,58 kB
  gzipped.** Vite already prints a warning about it.
- `three.js` minified is ~600 kB (~150 kB gzipped). `@react-three/fiber` adds ~100 kB. `drei` adds
  more.
- That is **+52% raw / +37% gzipped on first paint**, for a screen a field agent opens occasionally,
  on a phone that already needs about 1,3–1,5 seconds just to parse and compile what ships today.
- A WebGL context also reserves 30–80 MB of RAM on a 2–4 GB Android that is already holding decoded
  images.
- And you deleted `three.js` and `@react-three/*` from this repo today (PR #4, `ce3b001`) as unused
  dead weight. Re-adding them in the same week to draw six trophy frames would be undoing your own
  correct decision.

**More importantly: the profile is already losing the GPU fight before any 3D exists.**
`src/AgentProfileView.jsx:78` animates a `conic-gradient` whose `--border-angle` is a registered CSS
`@property` (registered at `:575-579`), then pushes the result through `blur-[6px]`. A registered
custom-property change **forces a full repaint of the gradient every single frame** — the browser
cannot hand it to the compositor the way it can a `transform` — and the blur then re-blurs that
fresh paint, 60 times a second, forever. At Mythic that runs alongside five more infinite animations
(`:77-86`), 16 `backdrop-blur` surfaces, and a `blur-[150px]` on a 600×600 div (`:823`).

### What Mobile Legends actually does, and how to get it for free

What reads as "3D" on an ML profile is pre-rendered 2D art plus depth cues. Both are nearly free:

**1. A masked conic ring instead of a blurred one.** Same look, ~zero GPU:

```css
.frame-spin::before{
  content:''; position:absolute; inset:-2px; border-radius:9999px;
  background: conic-gradient(from 0deg, transparent, var(--ring), transparent 60%);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0);
          mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0);
  animation: spin var(--speed, 8s) linear infinite;
  will-change: transform;
}
@keyframes spin { to { transform: rotate(360deg) } }
```

The gradient is **painted once** into its own layer; after that only `transform` changes, which is
compositor-only. The sharp ring edge comes from `mask`, not from `blur`. This is roughly a four-line
rewrite of `CrazyRankBorder` and it is the single highest-value GPU change in the codebase.

**2. Real painted art where you want it — but as a URL, not base64.** Your `borderImage` override at
`src/AgentProfileView.jsx:832-836` already fully replaces the CSS frame. Point it at a ~15 kB WebP in
Firebase Storage instead of ~107 kB of base64 in Firestore and you get real art per rank for less
than the cost of one of today's avatars. **If you do this, add a Workbox `runtimeCaching` rule in
the same commit** — see §6, item 4.

**3. Skip the tilt.** Two of the proposals wanted a `deviceorientation`-driven parallax tilt. Android
fires that event at up to 60 Hz; writing CSS variables on every event is 60 style recalculations per
second on the same thread React renders on, plus a sensor wake burning battery all day in the sun,
plus a permission prompt on iOS — for a 6-degree wobble nobody asked for. **Not worth it.**

**4. Only ONE animated element on screen, ever.** Enforced by a prop default, not by discipline (see
the `LockerCard` component below).

### The screen — mobile first, one thumb, readable in midday sun

#### 4.1 Hero

```
 ┌──────────────────────────────────────────┐
 │  ╭────────────────────╮                  │
 │  │  ╭──────────────╮  │   ← equipped     │
 │  │  │              │  │     frame        │
 │  │  │   AVATAR     │  │                  │
 │  │  │         [📷] │  │   ← ALWAYS-      │
 │  │  ╰──────────────╯  │     VISIBLE      │
 │  ╰────────────────────╯     camera badge │
 │                                          │
 │        BUDI SANTOSO                      │
 │        « Raja Pasar »        ← equipped  │
 │                                 title    │
 │   ┌──────────┐ ┌──────────────────────┐  │
 │   │ JURAGAN  │ │ Bergabung 6 thn 4 bln│  │
 │   └──────────┘ └──────────────────────┘  │
 │      rank chip     tenure — from         │
 │                    joinDate, not         │
 │                    createdAt             │
 │                                          │
 │   6.240 / 18.000 XP → Sesepuh            │
 │   ▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░┊░░░░░         │
 │                            ↑             │
 │                     "Puncak: Juragan"    │
 │                     ghost marker at      │
 │                     peakXP — never       │
 │                     moves backwards      │
 └──────────────────────────────────────────┘
```

The camera badge is important. Today the "Change Intel" overlay is
`opacity-0 group-hover:opacity-100` (`src/AgentProfileView.jsx:847-852`). **Touch screens have no
hover state.** On the device 100% of your field staff use, the entry point to the entire
personalisation feature is invisible — it looks like a static picture.

Also fixed here: the 6-star row. `getCorporateIdentity` (`src/AgentProfileView.jsx:280-303`) works
out the star count by splitting an owner-editable label string on `':'` and then substring-testing
for digits (`:293-297`). Rename "T2: OWNER" to plain "Owner" in Settings and the Company Owner
silently drops to 2 stars. **Stars become `rank index + 1`.** A Rookie who earned Juragan shows 3
gold stars; the corporate tier drops to a small text chip. Today the biggest visual (the frame)
rewards merit while the most rank-shaped visual (the stars) undercuts it with hierarchy — this
resolves that in favour of merit.

#### 4.2 Etalase — three slots the employee chooses

This is the part that makes it a trophy room instead of a report card.

I grepped `src/` for `equipped`, `showcase`, `favoriteBadge`, `selectedBadge`, `nickname`. **Zero
hits.** Today an employee authors exactly two things about themself: a bio
(`src/AgentProfileView.jsx:1052-1064`) and an avatar (`:830-854`). Everything else is assigned to
them — the rank ladder, the badge definitions, the frame (which is a pure function of `tierIndex` at
`:835`, so the employee has no say at all).

Mobile Legends works because the player **chooses** what to wear. The flex is the choice, and the
choice only impresses because everyone knows the frame had a price.

```
 ┌── ETALASE ─────────────────────────────────┐
 │                                            │
 │  BINGKAI                                   │
 │  [🔥][💠][⚪][🌑][🔒][🔒][🔒]              │
 │   ▲                  ↑                     │
 │  equipped        greyed out, with          │
 │                  "buka pada 3 Tahun"       │
 │                  underneath                │
 │                                            │
 │  GELAR                                     │
 │  ( Raja Pasar ) ( Setahun Penuh ) (🔒)     │
 │                                            │
 │  LENCANA UTAMA                             │
 │  [🏅][🏅][🏅][🔒][🔒]                      │
 │                                            │
 └────────────────────────────────────────────┘
```

**Showing what you cannot yet wear is the entire motivational engine.** A locked shelf you can see
is worth far more than a badge nobody told you existed.

Tapping writes one `updateDoc({ loadout })` — about 140 bytes, resolves instantly against the local
cache, works offline.

Honest limitation: this is client-validated only. A technically-minded employee could equip a frame
they never earned, because `firestore.rules:479-480` doesn't restrict which fields they write to
their own doc. **XP is untouchable — only the picture can lie.** Fixing it properly needs a Cloud
Function (Blaze plan, whole new deployment surface) for a purely cosmetic risk. Accepted.

#### 4.3 Rekor Karir — four permanent tiles

```
 ┌───────────────┬───────────────┐
 │ TERKUMPUL     │ HARI TUTUP    │
 │ Rp 1,28 M     │ 214           │
 │ sejak Jan 2025│ runtun 12 hari│
 ├───────────────┼───────────────┤
 │ BARANG (Bks)  │ TOKO DILAYANI │
 │ 84.120        │ 1.830         │
 └───────────────┴───────────────┘
```

Each carries a small "sejak …" line so nobody ever again mistakes a 7-day window for a lifetime.
Indonesian labels — this is the sentence a motorist reads out to his family.

#### 4.4 Dinding Prestasi — the badge wall

Your existing grid (`src/AgentProfileView.jsx:1125-1157`), now with six category tabs, locked badges
greyscaled with real progress bars (keep this — `:555-567` already does it right).

One fix: `shadowClass={\`shadow-[0_0_15px_${badge.hex}40]\`}` at `:1154` is a Tailwind class
assembled at runtime from a hex value. Tailwind's compiler scans your source text at *build* time, so
that class is never generated and **the glow at the moment of payoff has never once rendered.**
Replace it with an inline `style={{ boxShadow: ... }}` — which is where the gradient already
correctly lives at `:555`.

#### 4.5 Penghargaan — the shelf you fill by hand

```
 ┌─────────────────────────────────────────┐
 │  ▓▓ KETENANGAN LUAR BIASA          🏵  │
 │  "Tetap tenang menghadapi pemilik toko  │
 │   yang marah di Magelang."              │
 │                                         │
 │  — Pak Aldi, 12 Agustus 2026            │
 └─────────────────────────────────────────┘
```

Paper-and-stamp styling, deliberately unlike everything else on the page, because it came from a
person. Always shows your name, the date, and the reason in your own words.

Emotionally this is the most important block on the page, and it costs zero bytes of assets.

#### 4.6 Hari Ini — operational, visually separated

Titip risk and canvas value stay, including the tap-to-expand per-store debt table
(`src/AgentProfileView.jsx:940-992`) — the most useful thing on the page. But they move under a
**"HARI INI / 7 HARI"** header with a different border colour, so a live-ops number is never mistaken
for a career number.

**Be aware these numbers are currently wrong, and this design does not fix them:**

- The per-store Titip list never subtracts a payment. `src/AgentProfileView.jsx:457` only deducts
  when `storeDebt[t.customerName]` is *already* truthy — but transactions arrive newest-first
  (`useDatabaseSync.js:50` orders `desc`), so a payment collected today is processed **before** the
  Titip sale that created the debt. The guard fails, the deduction is silently skipped, and the sale
  later adds to the entry with no memory of the payment. A shop that paid in full still appears on
  the collection list.
- `activeTitipResponsibility` (`src/AgentProfileView.jsx:432-438`, `:473`) subtracts this week's
  payments from this week's Titip issued — but a payment collected today usually settles a debt from
  weeks ago, outside the window. `Math.max(0, ...)` then clamps it to zero. An agent carrying
  millions in old debt can show "Rp 0 Consignment Risk."
- Returns reduce nothing. `handleConsignmentReturn` writes `type: 'RETURN'` with **no `agentId` at
  all** (`src/hooks/useTransactionEngine.js:482`), and a buyback through `processTransaction` gets
  `type: 'RETUR'` with a **positive** total (`:147`, `:238`). Both the profile and the leaderboard
  only ever look at `type === 'SALE'`.

None of those affect career XP (which comes from reconciled cash, not the transaction stream), but
**shipping a beautiful trophy room above a lying debt figure is its own kind of damage.** Put them on
the list.

#### 4.7 The Locker Room — how peers see each other

Today the Agent Directory sidebar is gated on `hasClearance(userRole, 'view_dashboard')`
(`src/AgentProfileView.jsx:759`). I checked `src/config/permissions.js:57-77`: only Tier 1
(`ALL_ACCESS`), Tier 2 and Tier 3 hold `view_dashboard`. **A Fleet Captain, a Field Operative and a
Rookie can never open a colleague's profile at all.**

Against your first stated goal — *"each employee can express themself and know each other inside the
company"* — the current answer is: they can see each other's numbers, not each other.

```
 ┌── RUANG LOKER ─────────────────────────────────┐
 │  [ Semua ] [ Magelang ] [ Salatiga ] [ HQ ]    │
 │                                                │
 │  ┌────────┐ ┌────────┐ ┌────────┐              │
 │  │  ◉     │ │  ◉     │ │  ◉     │              │
 │  │ BUDI   │ │ YANTO  │ │ SARI   │              │
 │  │ 6 thn  │ │ 4 thn  │ │ 2 thn  │              │
 │  │ 🏅🏅   │ │ 🏅     │ │ 🏅🏅   │              │
 │  └────────┘ └────────┘ └────────┘              │
 │  ┌────────┐ ┌────────┐ ┌────────┐              │
 │  │  ◉     │ │  ◉     │ │  ◉     │              │
 │  │ EKO    │ │ RINA   │ │ AGUS   │              │
 │  │ 1 thn  │ │ 8 bln  │ │ 3 bln  │              │
 │  └────────┘ └────────┘ └────────┘              │
 │                                                │
 │  Diurutkan: paling lama bergabung              │
 └────────────────────────────────────────────────┘
```

- Re-gated to `view_agent_profile`, which **all six tiers hold** (`src/config/permissions.js:59-77`).
- **Default sort: tenure, longest first. Not XP.** You cannot be "last" on a list ordered by a fact
  about the calendar. The longest-serving person is first on the company's most-visited screen, every
  day, forever.
- Tap a card → read-only peer profile: hero + etalase + badge wall + award shelf. **No financial
  panels, no phone number.**
- `ADMIN_VEHICLE` and `VAULT` excluded. `src/hooks/useDatabaseSync.js:80-88` auto-creates a motorist
  doc called "Admin (Boss Vehicle)" and your VEHICLE-mode sales are attributed to it
  (`src/App.jsx:3612`). `src/HallOfFameView.jsx:14` filters out only `master_owner`, so **your truck
  currently browses as a colleague and competes as a rival.** One string in the filter.

**Cost: zero additional Firestore reads.** `motorists` is already fully synced
(`src/hooks/useDatabaseSync.js:47`) and `career` is 12 tiny docs on one new listener. The whole
peer-browsing feature is free and works offline from `persistentLocalCache`.

Honest caveat: the peer view renders a whitelist of fields, but the *full* motorist document —
including `phone`, `cukaiDebts`, `allowedTiers` — already reaches every client and has since long
before this design (`useDatabaseSync.js:47` + `firestore.rules:441`). A determined employee with
devtools can read the rest. Real field-level read scoping needs a separate public-profile document
per agent. Not worth it for twelve people.

#### 4.8 One shared component

`src/components/LockerCard.jsx`, ~120 lines, module scope, `React.memo`'d. Used on the hero, in the
grid, and on the podium, with `size` (`sm` | `lg`) and `animated` props.

**`animated` defaults to `false`.** So all twelve grid cards and all three podium cards render a
static ring regardless of what is equipped. Only the hero animates. That is a GPU budget enforced by
a prop default rather than by reviewer discipline — it survives the next change you make.

While you're in there: `AchievementCard` is defined **twice** — once inside the `AgentProfileView`
function body at `src/AgentProfileView.jsx:550-570`, and once at module scope at `:1167-1187`. The
inner one shadows the outer, so the module-level copy is unreachable dead code. Worse, because the
inner one is re-created on every render, React sees a brand-new component *type* each time and
**unmounts and remounts every badge card** — on every keystroke in the bio textarea (`:1055`), every
chart-filter click, every Firestore sync. Delete the inner copy; the outer one is already correct.

---

## 5. Making it fun (and the ways it could go badly wrong)

### The moments of delight — what actually lands

**1. Day one: you have a locker before you have a number.** A new hire's roster record seeds:

```js
unlocks: ['frame.starter_ember','frame.starter_teal','frame.starter_violet',
          'title.baru','badge.wajah']
```

Three starter frames in different colours. **They pick one before their first sale.** Their profile
already looks different from everyone else's. Combined with the free `Wajah Baru` badge for filling
in a bio and a photo, nobody's shelf is ever empty.

**2. Three weeks in: the first rank-up.** Andalan at 1.500 XP is about 17 working days. Full-screen
moment, the frame changes, a new title unlocks. This is the number I tuned hardest — a first reward
five weeks out is a dead zone.

**3. Every evening: the boss signs your day.** A small notification when your EOD is verified,
showing `dayXP` and its four-part breakdown. You can see *why* you got 87. An adult who can see how
his number was made will argue with the formula instead of concluding it's rigged.

**4. Every day, without anyone's permission: tenure ticks.** 5 XP per calendar day, no boss required.
This matters more than it sounds — see the failure mode below.

**5. Anniversaries.** 1, 3, 5, 10 years. Impossible to fake, impossible to lose. This is the one that
will actually get shown to a family.

**6. A signed award with your reason in it.** "Ketenangan Luar Biasa — diberikan oleh Pak Aldi, 12
Agustus 2026 — *tetap tenang menghadapi pemilik toko yang marah di Magelang*." Nothing the app can
compute will ever land like that.

**7. The unlock celebration fires once.** Compare computed unlocks against `motorists/{id}.seenBadges`
and show the new ones full-screen, then append the ids.

### How this could fail, and what stops it

#### Failure 1: the leaderboard bottom

`src/HallOfFameView.jsx:47` sorts every agent by XP and `:76` stamps each one `Rank #N`. Every tier
can see it (`src/config/permissions.js:59-77` grants `view_agent_profile` to all six, and the
leaderboard button at `src/AgentProfileView.jsx:817` is deliberately ungated).

Combine that with a permanent career ladder and a good employee who was sick, or whose region is
smaller, is **publicly and permanently near the bottom, forever.** In a twelve-person company where
everyone knows each other, that is more personal, not less.

**What this design does about it — four things:**

1. **Delete `Rank #N` entirely.** No position number is ever shown to anyone below third place.
2. **Top-3 podium only, per board, per month.** Seasons reset (`career.season`), so nobody is
   permanently anything.
3. **Four different monthly boards**, so four different people can lead:
   - **Papan Omset** — Rupiah collected. Your top seller owns this every month, and nobody can take it
     from him. This is the pressure valve for the XP compression in §3.2.
   - **Papan Penagihan** — `titipCollected`. Rewards the collector, not the pusher.
   - **Papan Kedisiplinan** — `streakBest` / clean closes.
   - **Papan Toko Baru** — new outlets (once attribution is fixed).
4. **A branch team board** (best `location` this month) plus, for everyone else, **their own bar
   against their own last month.** You compete with September-you. In an Indonesian workplace a
   branch winning usually lands better than one person winning anyway.

And the peer grid — the screen people actually open — is **sorted by tenure**, not by score.

#### Failure 2: the new hire versus the veteran

Two opposite complaints, both real:

- *"The new guy can never catch up."* → Solved by monthly seasons that reset, by four separate
  boards, by starter cosmetics on day one, and by the first rank-up at three weeks.
- *"The veteran who sells modestly outranks me."* → **Yes, deliberately.** `tenureDays × 5` means a
  seven-year rider starts at Juragan on migration day. In a family distribution business the man who
  has ridden for you since 2019 must not be outranked in week one by a rookie with a good week. Your
  top seller still owns the Papan Omset podium every single month. I'd rather that trade be explicit
  than accidental.

One thing I would **not** do, which one of the proposals suggested: a `title.baru` / "Anak Baru"
label auto-applied to every new hire. A 45-year-old joining from another distributor with twenty
years on a motorbike being publicly labelled "the kid" by an app is the single most likely thing in
any of these designs to make an experienced adult refuse to use it. Skip it.

#### Failure 3: it feels like surveillance, not appreciation

This is the biggest risk in the whole document and it is not a code problem.

`src/EODReconciliationView.jsx:266-324` renders a full-screen red **"WANTED — Company Property Damage
Fine"** poster with a bounty amount and a named employee on it, and a `window.confirm` at `:305`
demanding *"Hand over exactly Rp X in cash to the Admin to clear this bounty?"*.

**That is currently the only place in the entire app where an individual's personal conduct affects
their own display, and it is 100% negative.** An RDR2 reference reads very differently to a 40-year-old
motorist than it does to a 14-year-old developer.

**If a public red penalty screen ships alongside a trophy room, the trophy room reads as decoration
bolted onto a punishment system.** My recommendation: either soften the poster (same function,
private, no "WANTED", no name in 5xl serif), or ship `Nol Denda` and `Jujur Lapor` — the clean-record
badges — **in the same release.** Do not ship the trophy room first and the positive counterpart in
Phase 5.

Related: right now, honest damage reporting is *punished*. A salesman marks stock DAMAGED
(`src/hooks/useTransactionEngine.js:24-33`), it shows on his EOD screen
(`src/EODReconciliationView.jsx:392-414`), and HQ can resolve it as PENALTY, which writes
`cukaiDebts['PENALTY_<timestamp>'] = qty × HPP` onto his own profile
(`src/StockOpnameView.jsx:361-372`) and fires a debt notification at him (`:374-381`). The rational
move for a field agent is to say nothing and quietly sell damaged stock as good. The
`honestDamage` counter — incremented when HQ resolves a ticket as RTV or SAMPLING rather than PENALTY
— is the direct fix.

#### Failure 4: the boss becomes the heartbeat

Career XP only moves when an admin presses Verify. **If you travel for a week, nobody's rank moves
for a week.** Nothing is lost — it all lands on catch-up verification — but gamification lives on
fast feedback, and the current broken system at least moved every time someone made a sale.

Three mitigations:
1. **Tenure XP runs on the calendar, not on you.** Every agent's number goes up every single day
   whether you're there or not. This is why `xpPerTenureDay` matters more than its 5% share suggests.
2. **The season score and the streak are both visible as "pending" the moment the agent submits**,
   before verification. They can see what's coming.
3. Verify daily, or delegate. Note that server-side this is already the boundary: `eod_reports` is
   `allow update, delete: if false` (`firestore.rules:522-523`), so only you and a distributor ADMIN
   can verify today. An Area Admin pressing Verify **already fails** right now.

#### Failure 5: half the fleet gets an empty trophy room

**Before you build any of this, run one query:** count `eod_reports` with `status == 'VERIFIED'` per
agent over the last 60 days. Every design here makes EOD the sole source of career progression. If
EOD adoption is patchy in the real business, half your fleet gets a permanently empty profile and
concludes the feature is broken. **If adoption is low, fix EOD adoption first.** No amount of data
modelling substitutes.

#### Failure 6: the rank titles

Your default titles are `The Wanderer`, `The Hustler`, `The Market King`, **`The Syndicate Boss`**,
**`The Robin Hood`**, `The Sales Boomer` (`src/AgentProfileView.jsx:193-200`).

"Syndicate Boss" means crime boss. "Robin Hood" means a thief. Attached to a named adult employee of
a real Indonesian cigarette distributor, on a phone he shows to shop owners and to his family. This is
a one-line default change, not a conversation — I've put Indonesian defaults in the config block in
§3.1. Change them before anyone sees them.

#### Failure 7: nobody asked the actual employees

The cheapest de-risking move available, worth more than any phase in this document: before you build
the borders, ask two real motorists one question.

> **"Apa yang bikin kamu bangga menunjukkan layar ini ke keluargamu?"**

A 14-year-old's Mobile Legends instinct and a 40-year-old field salesman's sense of pride overlap —
but not perfectly. He might say "my bike plate and my years", not "a spinning frame". If he does,
half the cosmetic work is wasted and the tenure work is worth double. That's one afternoon to find
out.

---

## 6. Performance work — making it light on a potato phone

Ranked by **win divided by effort**. Every one of these is worth doing whether or not you build the
trophy room. The first four together are bigger than everything else combined.

| # | What | File & fix | Estimated win | Effort |
|---|---|---|---|---|
| **1** | **Stop precaching 19 MB of media onto every field phone** | `vite.config.js:12` — change `globPatterns: ['**/*.{js,css,html,ico,png,svg,mp4,mp3}']` to `['**/*.{js,css,html,ico}']`, and drop `maximumFileSizeToCacheInBytes: 15000000` at `:13`. Measured: `src/assets/music/` = 6 MP3s totalling **9,66 MB**; `public/` holds `talking.png` 2,06 MB, `apple-touch-icon.png` 1,79 MB, `kpm-final-logo.png` 1,56 MB, `idle.png` 1,42 MB, `deal.png` 1,14 MB, `Bit_Capybara_Fortnite_Dance_Video.mp4` 1,19 MB, `icon-512.png` 0,32 MB. | Precache drops from ~21 MB to **~2,4 MB (−89%)**. On a real 3G link that is roughly **7 minutes of background download and ~Rp 300 of prepaid quota saved on first install**, per phone. | **1 line, 2 minutes** |
| **2** | **Stop bundling admin-only music into every build** | `src/MusicPlayer.jsx:5` — `import.meta.glob('./assets/music/*.mp3', { eager: true })` → `{ eager: false }`, and `await` the module inside the play handler. `eager: true` forces every MP3 into the build graph so it can never be code-split out. `MusicPlayer` only ever renders behind `{isAdmin && ...}` (`src/components/BiohazardTheme.jsx:128`). | **−9,66 MB** from every field agent's download. | **1 word + ~5 lines**, 15 min |
| **3** | **Take recharts off the first-paint path** | `src/App.jsx:35` imports `SamplingManager` eagerly, and `src/components/SamplingManager.jsx:3` imports recharts — dragging recharts + `@reduxjs/toolkit` + `es-toolkit` + `decimal.js-light` + six `d3-*` packages (~387 kB min / ~115 kB gzip) into the eager chunk. Make it `lazy()` like its siblings. **Separately**, `src/App.jsx:16-18` imports 11 recharts components (`BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell`) that this 3.911-line file never uses — delete the import. | **~115 kB gzip off first paint**, roughly **380 ms less parse+compile** on a phone managing ~1 MB/s of JS. | **1 line changed, 3 deleted** |
| **4** | **Make Lite Mode actually do what it promises** | `src/App.jsx:3086-3098` kills `backdrop-filter`, `box-shadow`, `text-shadow`, and exactly three named classes (`animate-pulse`, `animate-bounce`, `animate-bounce-slow`). It does **not** kill `filter: blur()`, `animate-spin`, `animate-ping`, or any arbitrary `animate-[borderSpin_2.5s_linear_infinite]`. **Every expensive thing in `CrazyRankBorder` falls straight through the gap.** Meanwhile `src/components/SettingsView.jsx:203-205` promises it "Disables blur, animations, and heavy GPU effects." Add: `.lite-mode * { filter: none !important; animation: none !important; }` plus `.lite-mode .rank-frame { background-image: none !important; }` | Highest **GPU-saved-per-character** in the whole codebase. Makes the settings text true. | **2 lines** |
| **5** | **Delete two duplicate Firestore listeners** | `src/App.jsx:291` subscribes to `notifications` with **no time gate and no filter** — duplicating `src/hooks/useDatabaseSync.js:66`, which already does it with a 7-day gate. It downloads every notification the company has ever generated, on every cold open. `src/App.jsx:336` duplicates the `customers` listener at `useDatabaseSync.js:46`. `src/App.jsx:348` pulls all `stock_requests` then throws away everything past the first 30 with a client-side `.slice(0, 30)` at `:361`. | On a modelled company: ~6.400 fewer documents and ~3,4 MB less per cold open. | **~15 lines deleted** |
| **6** | **Resize the PNGs** | `apple-touch-icon.png` is declared `sizes="180x180"` at `index.html:7` but is actually **1,79 MB**. `kpm-final-logo.png` is the same artwork exported again at 1,56 MB. The merchant sprites (`talking.png` 2,06 MB, `idle.png` 1,42 MB, `deal.png` 1,14 MB) render inside a `w-40 h-40` box — 160 CSS px — at `src/MerchantSalesView.jsx:1197-1199`. Decoded, those three alone hold ~13 MB of RAM. | ~9,5 MB of PNG → **~300 kB** as WebP at the size they actually render. Also frees ~12 MB of RAM. | **No code. 30 min in an image tool.** |
| **7** | **Drop the avatar cap from 800 px to 256 px** | `src/AgentProfileView.jsx:51` caps crops at 800 px. A 12-card peer grid at 800×800 RGBA holds **30,7 MB of decoded bitmap** to draw twelve 48-pixel circles. At 256 px it's **3,1 MB**, and each avatar goes from ~80 kB to ~12 kB. | −27 MB RAM on the most-visited screen, −68 kB per avatar. Android stops evicting the tab mid-route. | **One number** |
| **8** | **Fix the two broken icon references** | `index.html:16` hardcodes `<link rel="manifest" href="/manifest.json" />`, and `vite-plugin-pwa` injects a second one. Browsers use the first — your hand-written `public/manifest.json`, whose only icon is `"/icon-512.jpg"`. **That file does not exist** (`public/` has `icon-512.png`). `index.html:10` also requests `/app-icon.png`, which does not exist either — a guaranteed 404 on every app open. Delete `public/manifest.json` and the link at `index.html:16`; delete line 10. | Home-screen icon starts working; one 404 removed from every cold start. | **Delete a file + 2 lines** |
| **9** | **Rewrite `CrazyRankBorder` to masked-conic + transform** | `src/AgentProfileView.jsx:75-122`. Replace the animated registered `@property` conic-gradient + `blur-[6px]` (`:78`) with the `mask` recipe in §4. Also `:90` (`blur-[2px]`), `:97`, `:105`. | On a Mythic profile: **15+ concurrent infinite animations → 1**, and **0 animated blurs**. Turns a per-frame full-surface repaint+blur into compositor-only work. | **~4-line rewrite** |
| **10** | **Build a product lookup Map once instead of `.find()` in a nested loop** | `src/AgentProfileView.jsx:419-426` calls `inventory.find()` inside `itemsList.forEach` inside `transactions.forEach`. At 420 transactions × 5 items × 200 products that is **~420.000 comparisons plus ~2.100 closure allocations**, re-run on every Firestore delta — including when another agent merely updates his canvas. Same shape at `src/components/DashboardView.jsx:71`, `src/components/DashboardBenchmarks.jsx:61`, `src/components/HistoryReportView.jsx:139`, `:156`, `:271`, and `src/EODReconciliationView.jsx:366`, `:599`. Fix: `const byId = useMemo(() => new Map(inventory.map(p => [p.id, p])), [inventory])`, then `byId.get(item.productId)`. | ~50–150 ms of blocked main thread removed, repeatedly. (After the career ledger lands, the profile's copy disappears entirely.) | **~1 line per site, 7 sites** |
| **11** | **Delete the shadowing `AchievementCard`** | `src/AgentProfileView.jsx:550-570` is declared inside the component body, so React remounts every badge card on every render. The identical module-scope copy at `:1167-1187` is already correct. | Badge grid starts *updating* instead of remounting. −21 lines. | **Delete 21 lines** |
| **12** | **Add `manualChunks` so a deploy doesn't force a full re-download** | `vite.config.js` has no `build.rollupOptions`, so everything eager lands in one hashed chunk. Your deploy script runs `npm version patch` and you're at 0.1.174 — 174 deploys. Changing one line of `App.jsx` changes the hash of all 1.344 kB, and `registerType: 'autoUpdate'` (`vite.config.js:9`) re-downloads it silently. Split `firebase`, `recharts` and `react`/`react-dom` into vendor chunks. Note `leaflet` is already correctly isolated — copy that pattern. | Per-deploy re-download **~1.344 kB → ~300 kB (−78%)**. | **~10 lines of config** |
| **13** | **Route rank art through Storage, not base64** | `src/AgentProfileView.jsx:265` and `:270` assign raw base64 into `rank.logo` / `rank.borderImage`; `:337` writes the whole ladder as one doc. 12 slots × ~107 kB ≈ 1,28 MB against a 1.048.576-byte hard cap. **You get ~8 uploads then saves fail with an unexplained error** (`alert` at `:340`). Route through `savePhotoAndGetReference` (`src/utils/helpers.js:102`) exactly as the avatar already does at `:256`, and reject any URL not starting with `https://`. | Removes a hard wall you will hit. Settings doc stays ~4 kB forever. | **~6 lines** |
| **14** | **If any image ever comes from Firebase Storage, add a Workbox runtime cache in the SAME commit** | Your service worker registers exactly one route today (`NavigationRoute(index.html)`) — no `runtimeCaching` at all. The moment `appSettings.usePhotoStorage` flips on, every avatar and frame becomes an **uncached cross-origin GET**. A 12-card grid becomes 12 fresh HTTPS round-trips, and none of them work offline — base64-in-Firestore is offline-correct today because `persistentLocalCache` holds it. Add a `CacheFirst` rule on `firebasestorage.googleapis.com` with an `ExpirationPlugin`, plus a CSS ring fallback on `<img onError>`. | The difference between the trophy room working in a shop with no bars and showing blank boxes. | **~6 lines of config** |
| **15** | **Stop hotlinking decorations from third-party sites** | `src/AgentProfileView.jsx:801`, `:824`, `:896` fetch textures from `www.transparenttextures.com` — three DNS+TLS round-trips to a domain you don't control, on the profile screen, on 3G. Ten such references app-wide, plus a full-HD Resident Evil wallpaper from `wallpapers.com` (`src/components/BiohazardTheme.jsx:70`) and a default avatar from `api.dicebear.com` (`:133`). None of them are precached, so they refetch on every cold start and **fail entirely offline**. Inline as a ~1 kB data URI or a CSS gradient. | 3 blocking third-party requests removed from the profile; the app's look survives with no signal. | **~10 lines** |
| **16** | **Remove `bg-fixed`** | `src/AgentProfileView.jsx:801` is the only `background-attachment: fixed` in the app. Mobile Chrome cannot use its fast scroll path with it and must repaint the background layer on every scroll frame. | Restores smooth scrolling on the profile. | **1 word** |
| **17** | **Delete Firebase Analytics** | `src/config/firebase.js:18-19` calls `getAnalytics(app)` at module load — on the critical path. That's `@firebase/analytics` (~10 kB) + `@firebase/installations` (~11 kB) plus two network round-trips on every open. For a 12-person internal tool where you already have `audit_logs` and `audit_vault`, it buys nothing. It's already inside a try/catch that swallows failures. | −21 kB, −2 network round-trips per cold start. | **2 lines deleted** |
| **18** | **Consolidate the arbitrary shadow classes** | The built stylesheet is 176,08 kB (23,12 kB gzip) — very large for a Tailwind JIT build. The cause is 194 distinct `shadow-[...]` values across the app, each generating its own class with no reuse (plus 82 `backdrop-blur`, 78 `animate-pulse`). Define 4–6 named glow utilities in `tailwind.config.js`. | ~30–50 kB of raw CSS, and glows become themable in one place — useful for the trophy room anyway. | **Medium: a config block + find/replace** |
| **19** | **Delete animations that reference keyframes that don't exist** | `animate-[flow_2.5s_infinite]` (`src/AgentProfileView.jsx:114`, the silver shine sweep) and `animate-[flow_2s_infinite]` (`:899`, the XP bar shine) reference a `flow` keyframe. The only `@keyframes flow` in the codebase is inside `src/MapMissionControl.jsx:2549` and animates `stroke-dashoffset` for SVG map routes — useless for a translating div, and only mounted when the map is open. `animate-bounce-slow` (`:818`, `src/App.jsx:3337`, `src/components/SettingsView.jsx:95`) is not a Tailwind default and is not in `tailwind.config.js`. `animate-fade-in-up` (`src/HallOfFameView.jsx:52`) is likewise undefined. | Nothing, performance-wise. Listed because **you believe you have polish you don't have** — and Lite Mode's kill list at `src/App.jsx:3096` disables `animate-bounce-slow`, a class that has never existed, while missing everything that is actually running. | **Trivial, but replace with something real** |
| **20** | **Consider replacing recharts with ~120 lines of SVG** | The app renders four chart types: a stacked bar (`src/AgentProfileView.jsx:1085-1091`), a bar with legend (`DashboardView`), a donut (`DashboardBenchmarks`), and one more bar (`SamplingManager`). A 7-bar stacked chart is ~30 lines of inline SVG with no dependency, no d3, no redux, no ResponsiveContainer resize-observer churn. | **−387 kB minified** — over a quarter of the eager chunk — and it removes `@reduxjs/toolkit` and six `d3-*` packages that exist for no other reason. | **High effort. Biggest single byte win available. Do it last, or never.** |

**Measure before and after.** Every number above is either read from your files or estimated from
stated assumptions about a 12-agent company. Before Phase 3, run Chrome remote debugging on one
**actual field phone** at Slow 3G + 6× CPU throttle and record First Contentful Paint and Total
Blocking Time on the profile. Re-run after. Otherwise there is no way to know whether a new frame
made things worse.

**Write the budget into the plan as a gate, not a suggestion:** profile interactive under 2,5 s at
Slow 3G + 6× CPU; zero long tasks while idle; **at most one animation running on screen**; and Lite
Mode proving it in the DevTools Animations panel.

---

## 7. Ergonomics — one-handed field use

Ranked by how much a motorist standing in the sun next to his bike will feel it.

| # | Problem | File & fix | Effort |
|---|---|---|---|
| **1** | **The MAKE DEAL button is dead for up to 10 seconds every time the agent types a customer name.** `src/MerchantSalesView.jsx:232` calls `getCurrentPosition` with `{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }`. `maximumAge: 0` **forbids** reusing a fix the phone already has, forcing a fresh satellite lock every time. The `useEffect` at `:237-242` depends on `customerName`, so typing a walk-in name fires a full GPS acquisition. `canSubmitSale` at `:901` includes `gpsStatus !== 'checking'`, so the button reads "Awaiting GPS..." (`:1253`) while it runs. The escape hatch is a 9 px underlined link labelled "PC Fast Scan" (`:985`) — which sounds like it's for desktop computers. | Change `maximumAge: 0` → `maximumAge: 60000` at `:232` (reuse a fix from the last minute — exactly right for someone standing still at a shop), and drop `customerName` from the dependency array at `:242`. | **2 numbers** |
| **2** | **Primary navigation is in the top-left corner** — the furthest point from a right thumb, on every screen change. `src/components/BiohazardTheme.jsx:75` pins the hamburger at `fixed top-3 left-3`. | Move it to `bottom-5 right-5`. Same button, same drawer, now inside the thumb arc. Your own sales terminal already gets this right with a 56 px bottom tab bar at `src/MerchantSalesView.jsx:1189-1192` — copy that pattern up into the shell. | **1 line (then a proper bottom bar later)** |
| **3** | **423 uses of `text-slate-500` and 142 of `text-slate-600` on near-black backgrounds.** Measured contrast: slate-500 (#64748b) on #050505 = **4,27:1**; on slate-900 = **3,79:1** — both below the 4,5:1 minimum. slate-600 (#475569) on #050505 = **2,68:1**, failing even the relaxed large-text threshold. The sales terminal is worse: `text-[#5c4b3a]` on `#0f0e0d` (`src/MerchantSalesView.jsx:1293`) = **2,30:1**. These ratios assume an indoor screen; Indonesian midday sun is ~100.000 lux and a budget Android peaks around 400–500 nits. | Find-replace `text-slate-500` and `text-slate-600` → `text-slate-400` (#94a3b8), which measures **7,95:1** on #050505 and passes even AAA. | **1 find-replace, large but zero layout risk** |
| **4** | **872 pieces of functional text are 10 px or smaller.** Counted across `src/` (worktrees excluded): 548 × `text-[10px]`, 257 × `text-[9px]`, 67 × `text-[8px]`, 5 × `text-[7px]`, 1 × `text-[5px]`. Not decorations — the **unit selector and price-tier selector**, which directly change how much money is charged, are `text-[9px]` (`src/MerchantSalesView.jsx:1119-1120`). The message explaining why a sale is blocked is `text-[8px] text-slate-500` (`:1020`). Platform guidance puts minimum body text at 11–12 px, indoors, with good eyesight. | Find-replace `text-[8px]` and `text-[9px]` → `text-[11px]`. These are already the smallest elements on screen; they have room to grow. Handle the five `text-[7px]` and the one `text-[5px]` by hand. Bump the two price-deciding selectors at `:1119-1120` to `text-sm`. | **1 find-replace + 6 manual** |
| **5** | **Destructive controls are 22–28 px, half the 44 px minimum.** The "remove item from cart" button is `p-1` around a 14 px icon ≈ **22×22 px**, sitting right beside the item name (`src/MerchantSalesView.jsx:1115`) — fat-fingering it silently deletes a line the customer already agreed to. Logout is `p-1.5` around a 14 px icon ≈ 26 px (`src/components/BiohazardTheme.jsx:141`). The **quantity field**, the most-used control in the app, is `w-10 ... p-1` ≈ 40×32 px with no plus/minus steppers (`:1118`). | One rule in `src/index.css`: `button:has(> svg:only-child) { min-width:44px; min-height:44px; display:inline-flex; align-items:center; justify-content:center; }` — fixes ~20 targets at once with no JSX changes. Then add stepper buttons flanking the quantity input. | **1 CSS rule + a small component** |
| **6** | **Offline state — the most important state in this app — is an unlabelled icon on a phone.** The indicator sits at `fixed top-4 right-32` (`src/App.jsx:3800`) — top of screen, 128 px inset, out of thumb reach — and its text label is `hidden md:inline` (`:3803`), so **the word "OFFLINE" only shows on tablets and desktops.** Exactly backwards. Combined with Firestore's offline behaviour (an awaited write resolves against the local cache immediately, so a receipt prints as if it succeeded), an agent can do a full day with no signal and never see a clear indication. | Drop `hidden md:inline` at `:3803`; move the indicator from `top-4 right-32` to `bottom-20 right-4` at `:3800`. | **3 lines** |
| **7** | **The avatar upload is invisible on touch.** `src/AgentProfileView.jsx:847-852` uses `opacity-0 group-hover:opacity-100`. Touch screens have no hover. Seven instances of this pattern across four files, including the rank-art upload targets at `:714`. | Replace with an always-visible camera badge pinned to the corner. | **~7 small edits** |
| **8** | **Every button is in English; Indonesian appears only as nouns.** Counted: `Retur` 203, `Bks` 323, `Slop` 102, `Ecer` 69, `Omset` 48, `Titip` 45 — but `Simpan` = 1, `Kirim` = 1, `Batal` = 0. So the vocabulary of the *business* is Indonesian and the vocabulary of the *interface* is English — and not plain English either: "Acquiring Satellites...", "Geofence Secured: In Range", "Deploy Free Sample", "Change Intel", "Manifest Empty", "Tarik Barang: GRANTED" (`src/AgentProfileView.jsx:1033` — both languages in one 8 px label). `index.html:2` also declares `<html lang="en">`, which affects Android keyboard hints. | No i18n library needed. Translate the ~25 strings on the sales terminal and EOD screens — that covers 95% of a motorist's day. "MAKE DEAL" → "JUAL", "Customer Name" → "Nama Toko", "REQUIRE PROOF" → "PERLU FOTO", "Manifest Empty" → "Keranjang Kosong", "Acquiring Satellites..." → "Mencari Lokasi...". Keep the game-flavoured English on admin-only screens. Set `lang="id"`. | **~25 strings** |
| **9** | **59 `window.confirm`, 8 `window.prompt`, 174 `alert()`.** Native dialogs put their buttons where the OS decides, not where the thumb is. Three specific problems: the cash handover is a `window.confirm` (`src/EODReconciliationView.jsx:305`); the manual EXP override is a `window.prompt` (`src/AgentProfileView.jsx:323`); and — most dangerous — after several dialogs, **Android Chrome offers a "prevent this page from creating additional dialogs" checkbox.** If an agent ever ticks it, all 59 `window.confirm` calls silently return `false` for the rest of the session and every guarded action quietly does nothing, with no error. | Replace with in-app modals on the two highest-stakes paths first: the cash handover, and the EXP prompt (which the Award modal replaces anyway). | **2 modals** |
| **10** | **Zero accessibility attributes anywhere.** Across all `.jsx` in `src/`: 0 `aria-label`, 0 `role=`, 0 `tabIndex`, 0 `focus-visible`, 6 `focus:ring`, and only 23 `alt=` across 44 `<img>`. There are 45 clickable `<div>`s doing a button's job, including the product card (`src/MerchantSalesView.jsx:1281`) and the avatar upload target (`src/AgentProfileView.jsx:830`). Icon-only buttons rely on `title=`, which never appears on touch. | Add `aria-label` to the ~20 icon-only buttons, `alt` to the 21 images missing it, convert those two `<div>`s to real `<button>`s, and add one global `:focus-visible` outline rule. | **Medium, mechanical** |
| **11** | **Rotating the phone strands the sidebar.** `src/AgentProfileView.jsx:126` initialises with `useState(window.innerWidth > 1024)` and `:754` reads `window.innerWidth <= 1024` inline during render. Neither is reactive — no resize or orientationchange listener. Rotating the phone (exactly what someone does to read a wide table) can leave the drawer open with no way to dismiss it. | A small `useMediaQuery('(min-width: 1024px)')` hook. | **~10 lines** |

---

## 8. The plan

Realistic for one teenager plus Claude. Each phase is independently shippable and independently
revertible. **Do not touch `firestore.rules` and `App.jsx` in the same commit.**

---

### Phase 0 — Solid ground
**🟢 Safe to do in one session. Nothing user-visible except that offline sales stop disappearing.**

Two real bugs. No new features. **This is worth shipping alone even if you build nothing else in
this document.**

**Changes:**
- `src/App.jsx:224` and `:239` — move both `clearProcessedItem(...)` calls out of the operation-building
  loops into a second loop that runs **after** `await commitInChunks(...)` at `:242` resolves.
- `src/App.jsx:1668-1674` — add to the Phase 1 read block:
  ```js
  const eodRef  = doc(db, `artifacts/${appId}/users/${userId}/eod_reports`, report.id);
  const eodSnap = await t.get(eodRef);
  if (!eodSnap.exists()) throw new Error('Laporan EOD sudah tidak ada.');
  if (eodSnap.data().status === 'VERIFIED') throw new Error('Laporan ini sudah diverifikasi.');
  ```
  Reuse `eodRef` at `:1805` instead of rebuilding it.
- `src/HallOfFameView.jsx:14` and `src/AgentProfileView.jsx:466` — exclude `'ADMIN_VEHICLE'` and
  `'VAULT'` alongside `'master_owner'`.
- `src/AgentProfileView.jsx:886` — relabel **"Lifetime Career EXP"** → **"Omset 7 Hari"**, and the
  MVP trophy at `:1118` → "Penjual terbaik 7 hari terakhir". **One string each. This is the correct
  emergency fix if you only have one afternoon** — an agent who catches the trophy room lying once
  stops opening it, and no amount of good design afterwards wins that back.
- `src/App.jsx:3398` — `userId={user?.uid}` → `userId={userId}` for consistency. (Not a bug — see §1
  — but stop relying on the hijack being baked into the user object.)

**Verify:**
1. **Offline flush:** airplane mode, make 3 sales. Restore network but block
   `firestore.googleapis.com` in DevTools request blocking. Trigger the sync. Open Application →
   IndexedDB and confirm **all 3 sales are still queued.** Today they are gone forever. Then unblock
   and confirm all 3 land exactly once.
2. **Double-verify:** open the EOD screen in two admin tabs and verify the same report in both. The
   second must error, and warehouse stock must have increased **exactly once.**
3. Open the leaderboard: "Admin (Boss Vehicle)" is gone.

---

### Phase 1 — The performance pass
**🟢 Safe to do in one session. No data touched.**

Items 1–5, 8, 11, 16, 17 from §6. All independent, all small.

**Verify:** `npm run build`, then read the printed precache line. It should drop from
~21 MB / 60 entries to **~2,4 MB**. Confirm the eager chunk gets smaller (recharts markers gone).
Install the PWA on a real phone and confirm the home-screen icon is your logo, not a generic
screenshot. Toggle Lite Mode and confirm the DevTools Animations panel shows **nothing running** on a
top-rank profile.

---

### Phase 2 — The ledger runs in the dark
**🟡 Needs care: touches `handleVerifyEOD` (live money and stock) and adds rules.**

The career doc fills up silently for a week while the profile still shows the old numbers. Nothing
can break for users because nothing reads the new data yet.

**Changes:**
- **NEW** `src/config/career.js` (~60 lines + the `demo()` self-check). No Firebase import.
- `src/EODReconciliationView.jsx:421-431` — add `dayKey` (local WIB, **not** `toISOString()`),
  `storesServed`, `cukaiRemaining`, `titipCollected`, `itemsBks` to the CASH_STOCK payload. All five
  come from `todaysTrans` (`:95-100`) and `agentData.expectedCukai` (`:86`), which already exist.
  Build a product `Map` once, outside the loop.
- `src/App.jsx` `handleVerifyEOD` — the career write from §3.2, merged into the existing
  `runTransaction`. `increment` is already imported at `:93`.
- `src/hooks/useDatabaseSync.js` — one listener next to `motorists` at `:47`:
  ```js
  const unsubCareer = onSnapshot(collection(db, basePath, 'career'),
    snap => setCareer(Object.fromEntries(snap.docs.map(d => [d.id, d.data()]))),
    err => console.warn("Career listener:", err.code));
  ```
  No time gate — the collection is bounded by headcount, not history. Export `career`.
- `firestore.rules` — the `career` block from §3.4, as a commented `[CHANGE N]`.

**Verify:**
1. `node src/config/career.js` — all five asserts pass.
2. **Rules emulator, all nine cases from §3.4, actually run.**
3. Submit and verify one real EOD. The career doc appears with
   `live.collected === report.cash + report.transfer` **to the rupiah**, `daysVerified === 1`,
   `streakCurrent === 1`, and the eod_report now carries `dayXP` + `xpBreakdown`.
4. Verify a `CUKAI` report the same day: `daysVerified` stays at 1, `credited` has two keys.
5. Pay a bounty and verify it: `live.collected` **does not move.**
6. Reset an EOD, resubmit, re-verify: `live.collected` **does not double.**
7. After 7 days, hand-add that week's verified `cash + transfer` from the Firebase console and compare
   to `live.collected`. Must match exactly. **Nothing on any screen has changed.**

---

### Phase 3 — Tenure and the backfill
**🟡 Needs care: one-time bulk write. Run it on a laptop, on wifi.**

**Changes:**
- `src/FleetCanvasManager.jsx:85-94` — add `joinDate: ''` to `defaultAgentState`; write it on both
  create (`:196-204`) and edit (`:178-184`). One native `<input type="date">`, no picker library.
  Also switch `createdAt` at `:197` from `new Date().toISOString()` to `serverTimestamp()` so it stops
  existing in two incompatible formats.
- Owner-only Settings button "Hitung Ulang Karir": `getDocs` over
  `eod_reports where status == 'VERIFIED'`, replay `computeDayXP` per report, group by `agentId`,
  **SET** `base: {...}` and `baseThrough: cutoffDay` via `commitInChunks`. Absolute SET, never
  increment — safe to re-run forever.
  - **Guard it:** refuse to run if `navigator.connection?.effectiveType` isn't `4g`, or below a
    desktop viewport width, with a clear message. An owner-only *permission* gate is not a *device*
    gate, and you will run this on your phone by accident otherwise.
- **You type the 12 real join dates by hand.** You know when everyone started. Ten minutes, and it
  buys 1/3/5/10-year badges that are impossible to fake.
- Grant each veteran one **"Buku Lama"** award for pre-app history, with a real written reason
  ("Penjualan sebelum aplikasi ada, 2019–2026, diperkirakan oleh Bapak"). Do not invent numbers into
  `base`. A visible, signed, dated estimate is strictly better than a silent number nobody can
  explain — **and it's your appreciation mechanism working on day one.**

**Verify:** Run the backfill **twice** and diff the career documents — byte-identical. Pick one agent,
add up their verified EOD `cash + transfer` from the Firebase console by hand, compare to
`base.collected`. Verify a new EOD afterwards and confirm `base` is untouched and only `live` moved.
Set one agent's `joinDate` to exactly one year ago and confirm the profile reads "1 tahun".

---

### Phase 4 — Flip the switch
**🟡 Needs care: every agent's visible rank changes. Behind a flag.**

**Changes:**
- `src/AgentProfileView.jsx:495` — `lifetimeEXP` becomes `careerXP(career[activeAgent.id], cfg.xp)`.
  The rank walk at `:502-509` is untouched.
- Guard the division at `:510` with `Math.max(1, next.min - current.min)` — the Rank Config editor
  sorts but does not dedupe (`:333-341`), so two ranks with the same `min` currently produce `NaN%`.
  Also **dedupe by `min` on save.**
- `src/HallOfFameView.jsx:19-30` — delete the transaction scan, sort the career objects.
- Migrate `manualExp` into an award titled "Penghargaan Sebelumnya" so nobody loses standing. Leave
  the field on the doc, unread, for one release.
- Move the four settings paths (`src/AgentProfileView.jsx:140, :149, :208, :337`) to
  `users/${userId}/settings/progression`, with a one-release read-fallback to the old shared path.
  **Zero new rules needed.**
- Gate the whole switch on `appSettings.useCareerLedger`.

**Verify:** Flag **off** — every number is byte-identical to today. Flag **on** — an agent whose
ledger says 6.500 XP shows Juragan and **stays Juragan after a zero-sales week.** That single test is
the entire reason this design exists. Toggle back and forth; no data changes either way. **Eyeball all
twelve new ranks before telling anyone** — if anyone's new rank is *lower* than their current one,
tune `rupiahPerXp` / `xpPerTenureDay` in `settings/progression` until it isn't. The knobs exist for
exactly this. Then confirm two test companies can save different ladders without touching each
other's.

---

### Phase 5 — One badge system
**🟢 Safe. Mostly deletion. Line count goes down.**

**Changes:**
- **DELETE** `src/config/achievements.js` (all 73 lines) and its import at `src/HallOfFameView.jsx:3`.
- **DELETE** `BadgeIconMap` (`src/AgentProfileView.jsx:28`) and the shadowing `AchievementCard`
  (`:550-570`).
- Add `checkBadges()` to `src/config/career.js`; call it inside the verify transaction with
  `arrayUnion(...fresh)` — **guarded so it never runs with zero arguments.**
- Badge grid gains six category tabs; progress reads `totals(career)[badge.source] / target`.
- Add the explicit `fmt` field; delete the `source.includes(...)` string sniffing at
  `src/AgentProfileView.jsx:1137-1138`.
- Replace the runtime Tailwind class at `:1154` with inline `style={{ boxShadow: ... }}`.
- Fix the gate split: the Rank Config **button** uses `hasClearance(userRole, 'edit_rank_config')`
  (`:811`) while its **modal** uses a raw string test (`:668`); the Achievement Config button
  (`:1103`) and modal (`:612`) are **both** raw string tests with no permission key at all. Make all
  four use `hasClearance(userRole, 'edit_rank_config')`.

**Verify:** Cross a badge threshold via a real EOD verification and confirm the id lands in `unlocks`.
Then hand-lower that agent's counter in the console and confirm the badge **stays lit** — permanence
is the point. Raise a target in the config UI and confirm nobody already holding it loses it. Confirm
the **leaderboard** badges now change when the config changes. A badge with `fmt:'rp'` renders
"Rp 12,5 jt / Rp 50 jt" and one with `fmt:'count'` renders "8.200 / 10.000 Bks". Verify a day where
nobody crosses a threshold: **the EOD still verifies** (the `arrayUnion` guard).

---

### Phase 6 — The trophy room
**🟢 Safe: UI only, plus one agent-writable field the rules already allow.**

**Changes:**
- Cosmetic registry in `src/config/career.js` (~40 frames/titles as CSS recipes, ~3 kB).
- **NEW** `src/components/LockerCard.jsx` — module scope, memoized, `animated={false}` by default.
- Loadout drawer with tap-to-equip; one `updateDoc({ loadout })` per tap.
- Rewrite `CrazyRankBorder` (`src/AgentProfileView.jsx:75-122`) to masked-conic + `transform: rotate()`.
  No `filter: blur()` in any animated path. Key on the rank's named `frame` string, **not** on
  `tierIndex` — today renaming Bronze to "Diamond" still gives it the brown ring, and deleting a
  mid-tier silently reshuffles everyone's frame.
- Stars from rank index + 1, not from substring-testing a label (`:293-297`).
- Always-visible camera badge replacing the hover overlay (`:847-852`).
- Route rank art through `savePhotoAndGetReference`; reject any URL not starting with `https://`.
  Add the Workbox `runtimeCaching` rule **in the same commit.**
- Peer profiles: re-gate the directory to `view_agent_profile`, make leaderboard cards tappable,
  default-sort by tenure.
- Award form (title, reason ≥10 chars, XP, optional cosmetic) replacing the `prompt()` at `:322-331`.
  Calls `logAudit` — the current override records nothing at all.

**Verify:** Chrome remote-debug a real field phone at Slow 3G + 6× CPU. Record a Performance trace of
a top-rank profile **before and after.** Target: **zero long tasks while idle.** Toggle Lite Mode and
confirm the Animations panel is empty. Log in as a Tier 6 Rookie, open the Locker Room, tap a
colleague, see their trophy room and **no money figures and no phone number.** Equip a badge, reload,
still equipped. Airplane mode, cold start: the entire grid renders from cache.

---

### Phase 7 — Seasons and the honest extras
**🟡 Needs care: touches `StockOpnameView` and the NOO paths.**

- Season board reading `season.score`, scoped to the viewer's own `location` by default with a
  "Seluruh perusahaan" toggle. Top-3 podium only. Owner-only "Tutup Musim" button.
- `src/MerchantSalesView.jsx:524` and `:547` — add `mappedById: agentProfileId` and
  `mappedAt: serverTimestamp()` to both standalone NOO writes. Unblocks the `toko_baru` badge.
- `src/StockOpnameView.jsx:207` — change `agentId: user.uid` to `agentId: user.agentId`. **Right now
  every stock count in the company is recorded against you.** Unblocks `cleanCounts`.
- `src/StockOpnameView.jsx` `executeResolution` (~`:306-383`) — `increment` `career.honestDamage` on
  RTV/SAMPLING, `career.penalties` on PENALTY.
- Ship `Nol Denda` and `Jujur Lapor` **in this release, or earlier if the WANTED poster is still
  live.**

**Verify:** Roll the device clock past a month boundary, verify an EOD, confirm `season` resets to the
new key while `career.xp` is untouched — that's the permanent-vs-competitive split in one test.
Register a NOO with no sale and confirm `mappedById` is present. Submit a stock count as a Tier 5 and
confirm `pending_audits.agentId` is **their** agent id, not yours. Resolve one damaged ticket as RTV
and one as PENALTY; confirm each counter moved by exactly one.

---

### Phase 8 — Ergonomics
**🟢 Safe. Do the find-replaces in their own commits so they're easy to revert.**

Items 1–7 from §7, in that order. Item 1 (the GPS `maximumAge`) is two numbers and will be the most
appreciated change in this entire document.

---

## 9. What I'd revisit later, and the signal that says it's time

**1. The Titip and returns arithmetic.**
Deferred because career XP comes from reconciled cash, not the transaction stream — so the trophy
room stops depending on it. But `src/AgentProfileView.jsx:457` (payments never subtracted, because
transactions arrive newest-first), `:432-438` (payments subtracted from a window that never contained
the sale), and `src/hooks/useTransactionEngine.js:482` (`RETURN` written with no `agentId` at all) are
all still wrong.
**Signal:** the first time you look at the orange "Consignment Risk" number to judge whether an agent
is behind on collections, and it doesn't match what you find on the road.

**2. A unique-store count you can trust.**
Deferred because `src/hooks/useTransactionEngine.js:317-322` mutates customer names with
" (Individual)" / " (Wholesale)" / " (Retail)" suffixes, and every anonymous sale becomes the single
string "Walk-in Customer". Until the customer *document id* is stored on the transaction, "toko
dilayani" honestly means store-visits, not stores.
**Signal:** you want a "kunjungan berulang" (repeat customer) badge, or a real per-shop history.

**3. Teamwork and mentoring badges.**
There is no `mentor`, `recruitedBy`, `squad` or `partner` field anywhere
(`src/FleetCanvasManager.jsx:85-94`, `:178-184`, `:196-204`). The only agent-to-agent record that
exists is `account_transfers` (`src/App.jsx:1417-1450`). The branch team board covers most of what
Indonesian workplace culture actually rewards.
**Signal:** you start formally pairing a rookie with a veteran. Add a `mentorId` field to the roster
form the day you do it, before you need the badge.

**4. Route-adherence streaks.**
Point-in-time "zero overdue stores" is computable today from
`src/JourneyView.jsx:619-644`. A *streak* is not, because the customer doc keeps only the last visit
(`:692` overwrites it). It would have to come from `VISIT_REPORT` entries in `audit_vault`
(`src/App.jsx:2144`) — the one archive that's never time-gated.
**Signal:** route discipline becomes a real problem, or you want a "Rute Bersih 30 Hari" badge.

**5. Moving XP minting to a Cloud Function.**
Today the arithmetic runs in an admin's browser. The rules guarantee an agent can never mint their own
XP, but they can't verify that the admin's arithmetic was right. This is the **identical** trust model
already used for stock levels and cash reconciliation everywhere in the app — it adds no new class of
risk, it just doesn't remove one.
**Signal:** the Blaze plan goes live (which `usePhotoStorage` needs anyway), or the company grows past
one trusted verifier.

**6. Field-level read scoping on the peer profile.**
The full motorist document — phone number, `cukaiDebts`, `allowedTiers` — already reaches every client
and has since long before this design (`src/hooks/useDatabaseSync.js:47` + `firestore.rules:441`). The
peer view renders only public fields, but a determined employee with devtools can read the rest. A
real fix needs a separate `public_profile` doc per agent, costing ~12 extra reads per grid render.
**Signal:** you pass ~25 employees, or you start storing anything genuinely private (salary, warnings)
on the motorist doc.

**7. Paging and a real leaderboard collection.**
At 12 agents, `career` is 45 kB on one listener and the grid is 12 static cards. At 200 agents it's
750 kB per cold open and 200 cards to render.
**Signal:** roughly 50 agents. Say it out loud now: **this is built for a family firm and will need
rework at that size.**

**8. Replacing recharts with hand-written SVG.**
Item 20 in §6. The single largest byte win available (−387 kB minified), but it's real work.
**Signal:** first-paint on a real field phone is still over 3 seconds after everything else in §6 is
done.

**9. The WANTED poster.**
Not deferred — **decided.** It's a conversation with the actual boss, not a code change, and it should
happen before Phase 6 ships. But if the answer is "keep it", then `Nol Denda` and `Jujur Lapor` move
from Phase 7 to Phase 5.

**10. Asking the employees.**
Also not deferred. It's the cheapest and highest-value thing in this document and it should happen
before Phase 4, when ranks visibly change. One question, two people, one afternoon:

> **"Apa yang bikin kamu bangga menunjukkan layar ini ke keluargamu?"**

That answer is worth more than any phase above.

---

## Appendix: everything I checked, in one list

Verified by direct read on 2026-07-28:

| Claim | Location | Result |
|---|---|---|
| 7-day transaction gate | `useDatabaseSync.js:41-42`, `:50` | ✅ confirmed |
| lifetimeOmset from the 7-day array | `AgentProfileView.jsx:413` | ✅ |
| lifetimeEXP formula | `AgentProfileView.jsx:495` | ✅ |
| Default ladder (Silver 25jt … Mythic 1M) | `AgentProfileView.jsx:193-200` | ✅ |
| Leaderboard uses the identical maths | `HallOfFameView.jsx:22`, `:30`, `:43` | ✅ |
| MVP "year" filter excludes nothing | `AgentProfileView.jsx:380-394` | ✅ |
| Titip counted at full value, no `paymentType` check | `AgentProfileView.jsx:413` | ✅ |
| Offline flush clears before commit | `App.jsx:224`, `:239`, `:242`, `:247` | ✅ **real bug** |
| `handleVerifyEOD` never reads the report | `App.jsx:1623`, `:1804-1806` | ✅ **real bug** |
| `handleResetEOD` deletes the doc | `App.jsx:1814-1817` | ✅ |
| `userId={user?.uid}` "critical bug" | `App.jsx:282`, `:1975-1976`, `:3398` | ❌ **NOT a bug — user.uid IS bossUid** |
| No `date` field on any EOD report | `App.jsx:1595-1601`; `EODReconciliationView.jsx:306, :421, :520` | ✅ confirmed absent |
| BOUNTY `cash` is a fine the agent pays | `EODReconciliationView.jsx:306-308` | ✅ |
| CUKAI report submits `cash: 0` | `EODReconciliationView.jsx:520-521` | ✅ |
| `expectedCash` excludes Titip | `EODReconciliationView.jsx:102-108` | ✅ |
| Shared cross-company settings doc | `firestore.rules:275-277`, `:114-118` | ✅ **real leak** |
| `users/{bossUid}` catch-all grants owner+admin write | `firestore.rules:280-283` | ✅ |
| `eod_reports` update denied to everyone but the catch-all | `firestore.rules:522-523` | ✅ |
| `settings/{docId}` needs no new rule | `firestore.rules:530-533`, `:534-546` | ✅ |
| Motorist self-update has no field restriction | `firestore.rules:479-480` | ✅ |
| Sample deploy writes `cukaiDebts` too | `MerchantSalesView.jsx:598` | ✅ — this is why a `hasOnly` clamp is dangerous |
| Standalone NOO writes have no agent attribution | `MerchantSalesView.jsx:521-539`, `:544-562` | ✅ |
| Sale-bundled NOO writes `mappedBy` as a **name** | `useTransactionEngine.js:262-263` | ✅ |
| Stock opname records the boss's uid as `agentId` | `StockOpnameView.jsx:207` + `App.jsx:1976` | ✅ **blocks per-agent accuracy badges** |
| PENALTY_ keys written onto the agent | `StockOpnameView.jsx:361-372` | ✅ |
| `variance` recorded per item | `StockOpnameView.jsx:226` | ✅ |
| Rank art assigned as raw base64 | `AgentProfileView.jsx:265`, `:270`, `:337`, `:340` | ✅ |
| Avatar already routes through Storage | `AgentProfileView.jsx:248-262`; `helpers.js:102-118` | ✅ |
| Badge Rupiah formatting backwards | `AgentProfileView.jsx:1137-1138` | ✅ |
| Runtime Tailwind shadow class | `AgentProfileView.jsx:1154` | ✅ never generated |
| `AchievementCard` defined twice | `AgentProfileView.jsx:550-570`, `:1167-1187` | ✅ |
| `BadgeIconMap` unused | `AgentProfileView.jsx:28` | ✅ |
| `calculateAgentLevel` used once, inside its own file | `config/achievements.js:4`, `:67` | ✅ |
| Directory gated on `view_dashboard` (Tier 1-3 only) | `AgentProfileView.jsx:759`; `permissions.js:57-77` | ✅ |
| Leaderboard button ungated | `AgentProfileView.jsx:817` | ✅ |
| Rank Config button/modal gate mismatch | `AgentProfileView.jsx:811` vs `:668` | ✅ |
| Achievement Config has no permission key at all | `AgentProfileView.jsx:612`, `:1103` | ✅ |
| Stars parsed from an editable label | `AgentProfileView.jsx:280-303` | ✅ |
| Tenure from `createdAt`, owner hardcoded to 999 | `AgentProfileView.jsx:512-518`; `FleetCanvasManager.jsx:197` | ✅ |
| Avatar hover-only on touch | `AgentProfileView.jsx:847-852` | ✅ |
| Lite Mode misses `filter` and arbitrary animations | `App.jsx:3086-3098`; `SettingsView.jsx:203-205` | ✅ |
| `ADMIN_VEHICLE` auto-created as a motorist | `useDatabaseSync.js:76-89` | ✅ |
| Precache globs include mp3/mp4/png at 15 MB cap | `vite.config.js:12-13` | ✅ |
| Music glob is `eager: true` | `MusicPlayer.jsx:5` | ✅ |
| `src/assets/music/` = 9,66 MB (6 files) | measured | ✅ |
| `public/` PNG+MP4 ≈ 9,5 MB | measured | ✅ |
| Dead recharts import (11 components, 0 uses) | `App.jsx:16-18` | ✅ |
| `SamplingManager` imported eagerly | `App.jsx:35` | ✅ |
| Two manifest links; `/icon-512.jpg` and `/app-icon.png` don't exist | `index.html:10`, `:16`; `public/manifest.json`; `ls public/` | ✅ |
| `<html lang="en">` | `index.html:2` | ✅ |
| `getCurrentDate()` is UTC | `helpers.js:11` | ✅ |
| `commitInChunks` awaits `batch.commit()` | `helpers.js:76` | ✅ |
| `fetchHistoricalTransactions` bypasses the 7-day gate | `useDatabaseSync.js:99-118` | ✅ |
| `convertToBks` exists and is exported | `helpers.js:30-40` | ✅ |
| Nested `inventory.find()` in the profile memo | `AgentProfileView.jsx:419-426` | ✅ |
| `manualExp` set by a `prompt()`, no audit | `AgentProfileView.jsx:322-331` | ✅ |
| `canEditProfile` matches the rules | `AgentProfileView.jsx:188`; `permissions.js:59`; `firestore.rules:479-480` | ✅ no gap |