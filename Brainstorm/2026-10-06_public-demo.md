---
date: 2026-10-06
status: DECIDED 00:15 - C (shared real backend) + updates first; after the presentation
tags: [kpm, demo, showcase, vercel]
---

# A demo of KPM that he and other people can try

**Problem, his words (2026-10-06 00:10):** *"i want to have demo for this app so that i can try the new update and people can try this too, what should we prepared tho"*.

**Two jobs in one ask:** (1) HE can try each new update easily - today the real app needs the HTTPS dev server, a Google sign-in and the Master Vault password, so he tries updates only through my frames or the live site after a push; (2) OTHER PEOPLE (by the showcase answers of 2026-10-02: the distributor boss who pays AND the salesmen; Indonesian; phone first) can touch the app without an account and without ever reaching real data.

**What already exists:** the lab (`tools/ponder-lab.jsx`, build `npx vite build --config tools/ponder-lab.config.mjs` -> `dist-ponderlab/`, 23 MB) mounts the REAL screens on made-up data (Budi Santoso + 4 salesmen, 8 shops each, one full day; products, van, vault desk). Firebase is stubbed: no sign-in, no network, writes are no-ops. Checked 2026-10-06: 0 Firebase keys / hosts in the lab files. Limits: ONE screen per link (74 URL switches like `?shell&journey&exp&admin`), no menu, nothing a visitor does stays (a sale never reaches Reports).

**Options:**

| # | What people get | Cost | Risk |
|---|---|---|---|
| A | Publish the lab as its own site + a start page of links (Journey Plan, Day Replay, Sales Terminal, Map System...) | ~1 session + he creates a 2nd Vercel project (his login) | a visitor presses Save and nothing happens - reads as broken |
| B | DEMO MODE: the real app shell with its menu, no login, a "Try as Salesman / Boss / Admin" picker, a DEMO banner; the stub keeps writes in memory so a sale shows in Reports and the Day Replay until refresh | ~2-3 sessions [guessing] (in-memory store with listeners, a week of sample data, vault gate skipped in the demo build only) + the 2nd Vercel project | the demo build must never carry real keys - a bundle check before every publish |
| C | A demo COMPANY on a real backend (a 2nd Firebase project, seeded with `tools/seed-emulator.mjs`, demo accounts, nightly reset) | ~4+ sessions + he creates the Firebase project and deploys its rules | strangers write junk all day; rules + reset to keep alive |

**My pick:** B, built on the lab's stub + fixtures, on its own address so the real site and real data are never touched. A is B's first step, not a rival.
**not-chosen:** C - lost on his effort (Firebase project, rules deploys) and open writes from strangers; flips if the demo is for his own salesmen to practise real routines over several days.

**Prepare list (any option):** its own address (2nd Vercel project from the same repo: build command `npx vite build --config tools/ponder-lab.config.mjs`, output `dist-ponderlab`); made-up company data (one day exists, a week needed for Reports); a way in with no sign-in; a DEMO banner on every screen; a bundle check (no keys, no real customers) before each publish; which code it shows (the live code, or the next update BEFORE it goes live = a "try first" branch).

**Already decided elsewhere:** 2026-10-02 the customer PRESENTATION was picked as a web page (A) over a video and over "a demo mode inside the app" - that was about the presentation's format. This ask is a separate thing (people TRY the app); the presentation stays a web page and can end with a "Try it yourself" link to this demo.

**Decision:** see "00:15 - his answers" below.

**Rejected on purpose:** putting the demo inside the real site (same address, a "demo" button on the real login) - one wrong switch shows real data to a stranger, or demo data to his salesmen.

**Models applied:** Inversion (what makes a demo backfire: a Save that does nothing, a stranger near real data, a customer seeing a crash); Opportunity Cost (week quota ~30% on 2026-10-05 - the presentation was the next job).

## 2026-10-06 00:15 - his answers (three questions, his picks)

| Question | His pick |
|---|---|
| Does what people do stay? (a sale on the terminal -> Reports, Day Replay) | **"Stays for everyone"** = option C, a shared real backend (my pick was B - he chose the bigger one) |
| Which version does the demo show? | **"Next update first"** - every update goes to the demo first, he tries it on his phone, then it goes live |
| Presentation or demo first? | **"Presentation first"** - the demo is the job after it; the presentation then gets a "Try it yourself" button |

**Facts checked for the plan (2026-10-06):** the Firebase config is hard-coded in `src/config/firebase.js` (project `cello-inventory-manager`) - the demo needs a build switch; sign-in is Google only (`App.jsx` signInWithPopup / Redirect) - a new Google visitor would land with no role, so the demo needs shared demo accounts per role (Email/Password); `tools/seed-emulator.mjs` refuses anything but the emulator ON PURPOSE - seeding the demo project needs its own script, run by a job HE sets up (Alucard never runs against a live project, demo included); the app sends vault-recovery codes through his real EmailJS account (`App.jsx` ~1336, `CrownTransferProtocol.jsx` ~62, service `service_b564nlp`) - OFF in the demo build or a stranger spends his EmailJS quota and mails his address.

**HIS part (accounts and consoles - only he can):** (1) a new Firebase project (e.g. `kpm-demo`) on the FREE Spark plan, never add billing - then a stranger can never cost money; the worst case is the free daily limit running out and the demo stopping until the reset; Firestore + Authentication (Email/Password) on; add a web app and paste its config to me (the web config is a public id, not a secret); (2) deploy the rules to that project when I hand them over; (3) a second Vercel project from the same repo, production branch `demo`, env `VITE_DEMO=1`; (4) a service-account key for the nightly reset, stored as a GitHub secret by him - Alucard never sees the key.

**MY part (after the presentation):** the build switch (`VITE_DEMO`: demo Firebase config, DEMO banner on every screen, EmailJS off, a "Try as Salesman / Boss / Admin" page with the shared demo logins and the demo vault password printed); a seed + nightly reset script (GitHub Actions, his secret) that REFUSES the real project id; a week of made-up data (the lab's day, stretched); self-checks that the real build never carries the demo page and the demo build never carries the real project id; the push flow (an update -> `demo` branch -> he tries it -> live).

**Known ceilings:** a visitor can change a shared demo password or fill screens with junk until the nightly reset (the reset re-sets passwords and data); the free plan's daily reads (~50k) hold roughly a few hundred visits a day [guessing - measure once seeded].

**Models applied (answers round):** Reversibility Test (a separate project + a separate Vercel project = the real site and data are untouchable; deleting the demo deletes nothing real); Inversion (EmailJS found - the one thing in the demo that reaches the outside world).

## 2026-10-10 19:31 - his "freeze time" ask (DECIDED 19:44: B)

**Problem, his words (19:26):** *"dont forget to make the demo account for the trials so that everyone can tried the app online and maybe since the data is always resetted everyday it will affect the demo account as well isnt? maybe add ability to freeze time so that some of the features are not affected, i mean the daily journey might reset when the date change as well and we lose the ability to view the animation again"*.

**Facts checked in code (2026-10-10):** Journey Plan's "today" = `getLocalDayKey()` (`src/JourneyView.jsx:405`) - its live map and Expedition show today only, so a sample day dated yesterday is empty there. Day Replay OPENS on today (`JourneyView.jsx:1007` `setReplayFor({ id, day: todayDate })`) but its panel already has a date picker (`<input type="date" max={getLocalDayKey()}>`, `src/components/DayReplay.jsx:303`) - an old sample day is never lost from the replay, only hidden behind the picker. His worry is right for Journey, half right for the replay. Clock readers in `src/`: 106 `new Date()` in 31 files, 82 `Date.now()`, 47 `getLocalDayKey()`/`getCurrentDate()`; and 91 `serverTimestamp()` writes, stamped by the SERVER's real clock - a freeze on the phone cannot reach them.

| # | What the demo does | Cost | Breaks |
|---|---|---|---|
| No fix | the reset writes the same old date | nothing | from day 2, Journey + Replay open empty |
| A | demo build freezes the phone's clock on the sample day (one Date shift at the app entry covers the 188 phone reads, ~10 lines + a self-check the real build never carries it) | ~half a session | a visitor's sale gets `date` = frozen day but `timestamp` = real day (server clock) -> Reports / Replay put it on the wrong day; sign-in tokens check expiry against the phone clock [likely, not tested] -> visitors logged out or stuck |
| B | the nightly reset writes the sample day with TODAY's date each night | nothing in the app - the reset script is mine and not written yet | in the morning the demo already shows the afternoon's sales (written at 00:05 for 08:00-17:00); a night the job fails = that day empty until the next night (the replay's picker still reaches the last good day); GitHub turns off scheduled jobs after 60 days with no repo activity [likely - public repos] |
| C | A + B | A's cost | A's wrong-day sale, for nothing B lacks |

**My pick:** B. **not-chosen:** A - lost on the two-clocks sale (his own pick "Stays for everyone" means a visitor's sale must show in Reports and the Replay) and the token risk; flips if the demo must always show ONE exact date (e.g. a date printed in the presentation).

**Decision:** B, 19:44 - his words: *"B is good i guess we can do that"*. (Asked 19:31 as a picture (No fix / A / B / C x Day 1 / Day 2 / a visitor's sale), with his part step 1 (the Firebase project).)

**Rejected on purpose:** nothing yet.

**Side fact:** his 19:26 "push it" did not land (sign-in window); this session's retry was refused by the auto-mode safety check - he pushes himself, or says "push" again.

**Models applied:** Inversion (what makes a frozen demo break - a visitor's sale on the wrong day); Second-Order Thinking (the server's clock is a second clock the freeze cannot reach); Opportunity Cost (B is free because the nightly reset is already in his 2026-10-06 pick).

**19:44 - his Firebase project, in progress (he is in the console):** he turned on Google sign-in AND Email/Password in the demo project (*"i turn on google sign in because it is our main sign in method and also email and password"*). Firestore choices given: Standard edition (Enterprise is the paid MongoDB-style engine; the app uses only Core operations), database ID left as `(default)` (the app opens the default database: `initializeFirestore(app, {...})` with no database id, `src/config/firebase.js:49`), location `asia-southeast2` (Jakarta; cannot be changed later), production mode (locked until the rules go in; test mode would let any stranger read and write for 30 days), no scheduled backups. Open cost of Google sign-in in the demo: a stranger who uses Google lands with no role - the "Try as" page must steer visitors to the shared demo logins; the demo address must be added under Authentication -> Settings -> Authorized domains once it exists.

**19:49 - console refused the empty ID:** his Create database (Standard, ID box locked/empty) failed with *"database_id should be 4-63 characters, and valid characters are /[a-z][0-9]-/"*, though the docs say Standard creates `(default)` when no ID is typed (firebase.google.com/docs/firestore/manage-databases, read 2026-10-10). Told: reload and retry once; if it fails again, a NAMED database (e.g. `kpm-demo`) is still free - *"Cloud Firestore allows exactly one free database per project"* (firebase.google.com/docs/firestore/quotas) - and costs us one extra argument: `initializeFirestore(app, settings, 'kpm-demo')` in the demo build, the database name in the seed/reset script and in the rules deploy target.

**19:50 - retry WORKED:** project `kpm-demo`, Firestore `(default)` created, Spark plan "No-cost ($0/month)" (his screenshot). The app's default-database code needs no change. Next from him: the web app's `firebaseConfig`; a glance at the Rules tab (must read `if false`, not a test-mode date).

**20:01 - the demo build switch BUILT (kpm `ea62eb6`, local, not pushed):** his web config pasted 19:53 = project id `kpm-demo-f4d74` (the console added a suffix to "kpm-demo"; he also turned on Google Analytics - unused by the app). `IS_DEMO = import.meta.env.VITE_DEMO === '1'` in `src/config/firebase.js` picks the config; Vite inlines the flag, so each bundle carries only its own project (proved on BOTH bundles by `src/config/demoBuild.check.mjs`, red 3 fail on the old code -> 6/6). **appId stays `cello-inventory-manager` on purpose** - it is only the folder name inside the open database, so the SAME firestore.rules deploys to the demo with no copy to drift (the plan's "demo build never carries the real project id" was refined to: never carries the real CONFIG - key, sender id, auth domain, bucket). EmailJS: both send sites stop on IS_DEMO with a plain message; the EmailJS ids stay in the demo bundle (minifier keeps code after an early return) - no new exposure, the live site's public bundle carries them already. Demo build booted in the pane over `vite preview --mode httpdev` (the https preview's self-signed cert is refused by the pane): sign-in page, 0 console errors, kpm-demo-f4d74 loaded, real key absent.

**Found while building (costs not yet priced with him):** (1) the app signs in with Google ONLY (one "SIGN IN WITH GOOGLE" button) - the shared demo logins per role need an Email/Password sign-in in the demo build, part of the "Try as" page; (2) photo uploads (products, proof camera) use Cloud Storage, which on a new project needs the paid Blaze plan [likely - Firebase changed this in late 2024; not checked today] - in the demo an upload would fail, so the demo build must say so plainly instead of erroring; (3) a stranger who signs in with Google lands with no role.

**Order from here:** (a) the "Try as Salesman / Boss / Admin" page + DEMO banner + the demo-only Email/Password sign-in - DESIGN, drawn first, his pick; (b) the seed/reset script (B: the sample day dated from its run date; creates the demo accounts per role + their vault passwords; refuses any project but kpm-demo-f4d74) run nightly by GitHub Actions on HIS service-account secret; (c) his rules deploy to kpm-demo (the same firestore.rules); (d) the 2nd Vercel project on a `demo` branch with VITE_DEMO=1.

**20:03 - his "what about the rules?":** the demo gets the SAME `firestore.rules` as live, unchanged (why appId was kept). Checked: the file's code lines equal the live copy `firestore.rules.deployed-baseline` - the only difference is the header comment (diff 11 lines, all in lines 2-7). The demo's rules today = the console default `allow read, write: if false` (his screenshot 19:5x) = fully locked - right while it is empty and has no accounts. `isSuperAdmin()` hard-codes his Gmail (`firestore.rules:21`), so in the demo his own Google account is super admin too; strangers cannot get it. Advice given: paste-and-publish the file in the same sitting as the first seed (accounts + sample day), not before - nothing can use the rules until the accounts exist. "Next update first" applies to rules too: a rules change goes to kpm-demo before live.

## 20:06 - his tier switcher for the demo (OPEN - waiting on Aldi)

**Problem, his words:** *"u need to add some temporary panel just to swap between tiers so that the users that use the demo can switch tiers at ease and try each of the tiers features and of course i want each of the account swapping to be a real account, this logic is similar to the tier 1 features to swap account, but of course the account swapping is only tier 2 and below and they cant access to tier 1 features"*.

**His call is right, and better than the tool it copies:** his own T1 switch (`src/components/TierPovSwitch.jsx`, `src/config/povPreview.js`) changes only the SCREEN - Firestore still sees his T1 account ("HONEST LIMIT" in povPreview.js). A real sign-in per tier means the rules really apply, so a visitor sees exactly what that tier can and cannot do. Tiers (`src/config/permissions.js:2-8`): T1 DEVELOPER (his Gmail only - `isSuperAdmin()` firestore.rules:21, `POV_OWNER_EMAIL`), T2 COMPANY_OWNER, T3 HQ Sales Manager, T4 Regional Admin, T5 Sales Canvas, T6 Sales Motorist. So 5 switch logins, T2..T6; T2 = the demo company's owner. It folds into the next job (the front door): the same role buttons, on the sign-in page AND as a small panel on every screen.

**The cost he has not priced (checked in the rules):** the 5 logins are SHARED by every visitor. A T2 can lock or unlock a colleague (firestore.rules:254) and move a person to a new Gmail (:245); a locked login gets no record (:57). So: a visitor on Owner locks "Demo Salesman" -> every visitor who presses Salesman is refused until the reset.

| # | What happens | Cost | Breaks |
|---|---|---|---|
| A | only the nightly reset repairs | nothing extra | a locked / moved switch login stays broken for everyone until midnight |
| B | the reset runs every hour | 24 runs a day (GitHub Actions minutes; Firestore free writes ~20k/day - a reset's write count to be measured once seeded) | broken for up to an hour |
| C (MY PICK) | the 5 switch logins are protected in the demo build: lock / change email / change tier / delete / their vault password greyed out with "This is a demo login - try it on Budi"; the demo company also has extra staff (Budi, Ari...) that visitors can lock, move, edit freely; nightly reset as planned | a guard on each of those buttons (count them first) + a demoBuild check that the real bundle carries none of it | a visitor with devtools can still reach the rules directly - the reset repairs it; the buttons stay try-able on the extra staff, so no selling point is hidden |

**not-chosen:** B - lost because it still leaves a broken tier in front of the next visitor (up to an hour) and adds 24 runs a day; flips if the guards in C turn out to touch more than ~5 screens. Hiding the lock buttons everywhere was rejected on purpose: "lock an account" is a selling point in the presentation (security scene).

**Decision:** OPEN - waiting on Aldi.

**Models applied:** Inversion (how does the switcher break? a visitor uses a real T2 power on a shared login); Second-Order Thinking (a shared account turns one visitor's action into every visitor's problem); Opportunity Cost (hiding the features to protect the logins would hide what the demo exists to show - hence the extra practice staff).

**20:14 - his answer + a new ask.** *"c is good make sure that the users wont broke anything or edit anything, and i want u to add and prepare some sales and demo data as well inside the app but of course use all my real data inside, all customer profile, product and literally everything u need inside this app. here is the recovery that should contained everything inside the real app right now"* (file `Downloads/FOLDER_RECOVERY--SAFE_2026-10-10_20-12.json`, 6.4 MB, `meta.type` RECOVERY). **Switcher protection = C (DECIDED).** Two readings of "wont ... edit anything" put back to him: (1) visitors can only look, nothing they do stays (contradicts his 2026-10-06 "Stays for everyone"); (2) the 5 demo logins cannot be broken or edited, everything else works and resets nightly (my reading).

**What the backup holds (counts only, no values copied here):** 6 products (names, 4 price levels incl. distributor + grosir, photos as base64, pack sizes), 152 customers (exact GPS on 151, 38 cities in 4 provinces, phone on 22, street address on 18, store photo on 27, a contact-person name on 1, visit notes / descriptions on 73, a debt (pendingIOUs) on 1, salesman names on 3-6), 23 activity-log entries, 5 tier settings, the company name; 0 transactions, 0 samplings, 0 borders; no staff list.

**SECURITY WARNING given (not a design choice, raised before anything is built):** the demo is public ("Stays for everyone", open to anyone). His real shops' names, map pins, phones, addresses, photos and notes would be readable by any stranger, competitors included; the shop owners never agreed (Indonesia's personal-data law, UU PDP 27/2022, covers exactly this - not legal advice); the distributor and grosir prices are his client's margins. The backup itself never goes into the repo.

| # | What the demo holds | Cost | Risk |
|---|---|---|---|
| A (MY PICK) | the real SHAPE, disguised: the 6 real products (names, photos, pack sizes) with prices changed a little; the 152 shops copied with made-up shop names, no phone / address / photos / notes, each pin moved a short way inside its own town; made-up staff; sales made fresh each night (B) | one converter script (backup -> demo seed) + a check that no real name / phone / exact pin survives | a viewer sees his market footprint (which towns) - low |
| B | as A, but the product prices stay real | same | his client's margins public |
| C | everything real | none to build | public personal data - only acceptable if the demo becomes PRIVATE (a password he hands out), which ends "anyone can try" |

**Decision:** OPEN - waiting on Aldi (both questions).

**Models applied:** Inversion (what makes this demo a disaster: a shop owner finds their phone and shop photo on a public page); Reversibility Test (published personal data cannot be taken back - a one-way door; disguising is two-way: real data can be added later if the demo goes private).

**20:22 - DECIDED (his words):** *"A is better option, just keep the store name btw but slightly change the price of each products just make it easier to compute, yes visitor can do anything but reset every 24 hours, this way it is stays fresh everyday how about that, for manual reset im expecting tier 1 account to be able to do that, anyway tier 1 account is still adikaryasukses99@gmail.com, visitor is tier2 and below"*. So: data = A with the REAL shop names (cost told once: names + towns = his customer list, visible to a competitor - his call); visitors may do anything (reading 1); reset every 24 h; a manual "reset now" only for his T1 Gmail; visitors get T2..T6.

**BUILT (kpm `4cd4662`, local):** `tools/demo-seed-from-backup.mjs` (allowlist) -> `demo/seed.json` (1.4 MB: 6 products, 152 shops, 5 tier pictures). Prices x1.05 rounded to Rp 500 / 5.000, order kept - e.g. Cello Coffee & Caramel 8.500 / 8.700 / 8.900 / 10.000 -> 8.500 / 9.000 / 9.500 / 10.500; American Spirit 200k / 210k / 220k / 250k -> 210k / 220k / 230k / 265k. Pins moved 152-398 m. logicFixes "The demo seed" 3 checks: FAIL x3 on the raw backup, pass on the seed (2241/2241).

**The reset - my design choice (mechanism, not his decision):** ONE function, `api/demo-reset` on the demo's Vercel project, holding the service-account key in that project's settings (his step, instead of the GitHub secret in the 2026-10-06 plan). Two callers: Vercel's daily cron (Hobby allows once a day - his 24 h) and the T1 "Reset demo now" button, which sends his Firebase sign-in token; the function checks the token's email is his Gmail. It refuses any project but kpm-demo-f4d74 and does nothing without the key - the same file is also deployed on the REAL Vercel project, where no key exists. What a reset does: wipe `artifacts/cello-inventory-manager` + the demo staff records, write the seed, (re)create the 5 switch logins (T2..T6) + the practice staff (Budi, Ari...) with fixed passwords + vault passwords, unlock everything, and write TODAY's sales (B: dated from the run). **not-chosen:** GitHub Actions - lost because the T1 button would need a GitHub token inside the browser to start it (a secret on a public page) and the reset would live in two places; flips if Vercel's cron is not available on his plan.


## 2026-10-11 16:05 - the reset BUILT (kpm `199b19a`, local, not pushed)

**His ask:** *"continue with the demo account"* (2026-10-11 15:39).

**What exists now:** `api/demo-reset.js` (the Vercel function: daily cron 00:05 WIB with CRON_SECRET, or a POST with his Firebase token - his Gmail only; 404 without a kpm-demo-f4d74 key, so the real Vercel project ignores it) + `api/_demoCompany.js` (the company as pure data, same per WIB day). Logins + public passwords live in `api/_demoCompany.js` (LOGINS, LOGIN_PASSWORD, VAULT_PASSWORD). One reset = 205+ documents: 6 products, 152 shops, 5 switch logins T2..T6 (owner uid `demo-owner`) + 3 practice staff (Budi, Ari, Dewi), vaults, 23 sales today, the month tally, each seller on the map, the MAGELANG branch warehouse.

**Proof:** `tools/demo-reset-emulator.mjs` 17/17 against the emulator with the real rules (second reset = same counts; a visitor's sale / lock / password change undone; wrong caller 401; real-project key 404). Then the APP on the emulator (launch `demo-app-emulator`): T2 dashboard Rp 10.474.000 = the 23 sales; T3 the same; T4 its 4-man Magelang team + Day Replay plays; T5 his 6/73 route; T6 Journey with today's coins.

**Five data shapes only the tier walk found** (admin writes skip the rules; each is now a logicFixes guard): owner login rows need bossUid; a staff vault needs uid + email; a shop's assignedAgent is a NAME; a seller needs currentLocation/pathHistory; the Magelang team needs location MAGELANG + branch stock.

**Side finding (rules are his, NOT changed):** a real-shaped T2 owner (Landlord-provisioned, migrated: uid row with bossUid, email row deleted) gets 403 on every LIST - `firestore.rules` L347 `document[0]` errors on a list ("Variable is not bound in path template"), and L555 `isSalesman` needs the email row. Emulator-proven with `t2-real-shape.mjs` (listTransactions 403, getOne 200, listProducts 403). Put to him as: 🔴 DECIDE: your current security rules block a Tier 2 company owner from seeing their own lists. Example: you create "Toko Maju" as a T2 company from the Landlord screen; its owner signs in and sees Rp 0 sales and no products, although the data is there (tested on the emulator with your rules file, 2026-10-11). Your own T1 account is not affected. Do you want me to write a fix to the rules (you paste/deploy it yourself, like always), or leave it because you have no T2 companies?

**Decision:** OPEN - his answer on the T2 rules gap. Next build: the front door (design first).

**Rejected on purpose:** changing `firestore.rules` to make the demo work - the demo uses data shapes the app itself writes instead; the rules stay his call.

**17:35 - his answer + his idea:** *"regarding the question, yes i might have another company using the KPM but isnt it better when i just made another project just to login to another company instead of combining those projects together inside the firebase console?"* Told him: the fix is needed either way - the T2 test above ran in the SEPARATE demo project (kpm-demo-f4d74 emulator) and was still blocked, because every project gets the same rules file and only his Gmail is Tier 1 in it. One project per company: + a wrong rule can never show one company's data to another; - every app update is deployed once per company (a website + a rules paste each), and the Landlord screen cannot see the companies together. That choice can wait for a real second company. **Decision:** I write the T2 rules fix as a DRAFT (he deploys) after the demo front door, unless he says no.

## 2026-10-13 07:27 - the front door + the switch, DRAWN (OPEN - waiting on Aldi)

**Problem, his words:** *"next session should continue doing the demo"* (2026-10-12 20:00) - the front door was the last undesigned piece: a visitor must get in as a real tier (T2..T6), switch tiers on every screen, and always see that it is the demo.

**Boards** (real built CSS + the lab's real app shell, Rajdhani loaded, PC + 390, numbers read off the frames): `Raw/2026-10-13-demo-door/board-door.png` (TODAY / A / B / C) and `board-inside.png` (A / B / C + A light). Rebuild: serve the lab (`launch.json` ponder-lab-built, port 4187), `node shoot.mjs` (copies the pages into `dist-ponderlab/demo-door/` - a file:// page cannot load the lab's fonts).

| Board 1 - the front door | What it is | Cost (measured) |
|---|---|---|
| A five keys (MY PICK) | today's gate card, one row per person, one press signs in; both passwords printed once under the list; Google kept with "no role" line | card 722 px on an 844 phone - all five visible, no scroll; same 320/384 width as the vault gate |
| B five badges | wide panel, one ID badge per person (initials, name, role) | best on PC; phone page 1,098 px on 844 - scrolls, 5th badge below the edge |
| C pick then enter | T2..T6 keys, one person shown in full, one Enter button | smallest (650 px), but one extra press and the five cannot be compared |

| Board 2 - inside the app | What it is | Cost (measured) |
|---|---|---|
| A one bar on top (MY PICK) | DEMO + who you are + reset time + SWITCH; list of five drops under it | 37 px strip on every screen; one line (his "fixed height is fine if it is ONE line and answers the first question") |
| B tape + edge tab | 23 px tape, SWITCH tab on the right edge mid-screen | hides who you are; the tab sits over lists and buttons |
| C one bar at the bottom | same line as A at the bottom | 47 px; stacks with the sales screen's bottom cart drawer; far from the eye on PC |

**Why A + A:** a visitor (a distributor boss on a WhatsApp link, most likely on a phone) must compare the five roles before choosing - only A shows all five without a scroll and without an extra press. The capybara owns the bottom-right corner and the sales drawer owns the bottom on the phone, so the switch goes on top.

**Build notes for whichever he picks:** the bar needs `padding-top: env(safe-area-inset-top)` (the notch, cf. 721f999); a failed demo sign-in says "the demo is being reset - try in a minute"; every demo element behind IS_DEMO + the demoBuild.check guard.

**Side finding (not demo):** `src/styles/theme.css:5331` - the Agent Inventory book's `.kpm-shelf { margin-top:14px; border; border-radius:14px; justify-content:center }` (f0ec63d, 2026-09-27) is GLOBAL, so every module's button shelf (47 uses) gets a rounded border box - visible in the TODAY frame around "Sign in with Google". Fix = scope it to the book's own wrapper. Reported, not fixed.

**Models applied:** Inversion (how does a visitor fail at the door? cannot compare roles / scrolls past the fifth), Second-Order Thinking (a switch on every screen covers what it sits on), Opportunity Cost (every px of the bar is taken from every screen).

**Decision:** OPEN - his letters for board 1 and board 2.

**Rejected on purpose:** a floating switch at the bottom-right (the capybara's corner); hiding the switch inside the side menu (closed on the phone, one more press); a pre-highlighted first row (read as "already chosen").

**2026-10-13 07:45 - DECIDED, his words:** *"A for phone B for pc for decide 1, decide 2 is A, u can fix it after the demo"* - board 1: five keys on the phone, five badges on the PC; board 2: the one bar on top. The `.kpm-shelf` side bug: fix after the demo.

**08:08 - BUILT + walked on the emulator (kpm `914d17d`, `7394c6b`, local, not pushed):** src/config/demoLogins.js (the one list - api/_demoCompany.js re-exports it), components/DemoFrontDoor.jsx (door + bar), vault-gate hint, Fleet & Roster guards (Edit / Delete / Lock / Reset vault password answer "This is a demo login - try it on Budi."; Details + Reset vault tries stay). Walk: T2..T6 each signed in (door or SWITCH) and past the vault, none denied; phone door 717 px on 812, no scroll; PC badges 1040 wide; Dika greyed + Lock answers, Budi untouched; T1 sees "Reset demo now" (local dev has no /api, so it reported the 404 in words). Found while walking + fixed: the PC rail button and the toasts sat under the bar - both now start at --kpm-safe-top (0 px on a desk in the real app). demoBuild.check caught the REAL bundle carrying two demo emails (a top-level LOGINS.map kept the module) - the list is now built on render.

**Next:** his steps (demo Vercel project with VITE_DEMO=1, DEMO_FIREBASE_KEY, CRON_SECRET; rules pasted into the kpm-demo-f4d74 console; the demo domain in Firebase Auth authorized domains), push on his word, then the T2 rules draft, then the .kpm-shelf fix.

**09:01 - first live reset FAILED, cause found:** his Vercel log: `7 PERMISSION_DENIED: Missing or insufficient permissions` from BulkWriter (the delete step, recursiveDelete), at `api/demo-reset.js:60`. The admin SDK skips security rules, so this is Google Cloud IAM: the new-style service account `firebase-adminsdk-fbsvc@kpm-demo-f4d74` may not write Firestore. Fix (his step): Google Cloud > IAM > that account > add role **Cloud Datastore User**. Also: our reset message showed only "failed with: ." - the library keeps the reason in the stack (recursive-delete.js:205-214), so `e.message` is empty; asked him whether to make the message carry the cause (code + first Caused-by line). The emulator never checks IAM, which is why tools/demo-reset-emulator.mjs passed 17/17.

**09:18 - FIXED, the live demo is filled:** he added "Cloud Datastore User" (kept Firebase Authentication Admin); the retry right after still failed, the one ~5 min later said "Demo reset done: the company is back to the start (211 records, 2026-10-13)". Open: his T2/T5 test on the live demo; whether the reset message should carry the real cause.

## 2026-10-13 09:30 - two places only: Bandung + Kabupaten Magelang (OPEN - waiting on Aldi)

**Problem, his words:** *"why there is many headquarters and un assigned area, just use 2 area that i insert on the map system on the real app instead which is bandung area and kabupaten magelang area"* (screenshot: Fleet Roster tabs HEADQUARTERS 1 / UNASSIGNED AREA 1 / HEADQUARTERS 1 / HEADQUARTERS 1 / MAGELANG 5). Also asked: *"i want easier password bruh like admin123"* - DONE kpm `92892a8` (local).

**Cause (from code):** the stage tabs key on province + location (FleetCanvasManager.jsx placeOf ~745) but print only the location. _demoCompany.js:125 takes each mans province from his first shop (Agus: JAWA BARAT from Bandung shops; Rina: no shops -> JAWA TENGAH; the owner card: another default) -> three HEADQUARTERS tabs. One record has no location -> UNASSIGNED AREA (not yet identified). His drawn areas are GeoJSON borders saved at artifacts/<app>/users/<owner>/mapSettings/bnd_* in the REAL project - demo/seed.json never carried them (seed = appSettings, tiers, inventory, customers). Shops in the seed: region MAGELANG 75, KOTA BANDUNG 32, BANDUNG 31, KOTA CIMAHI 6, BANDUNG BARAT 4, DIY 2, none 2.

| Option | What | Cost |
|---|---|---|
| MY PICK | everyone in one of two places: BANDUNG (owner, Rina T3, Agus T5) / KABUPATEN MAGELANG (Hendra T4, Dika T6, Budi, Ari, Dewi); shop regions renamed to those two; the 4 shops outside both leave the demo; his two border files added to the seed so every reset draws them | his .geojson files; one rebuild + reset; Headquarters disappears from the demo, so every van loads from a branch warehouse |
| keep Headquarters as a third place | owner + Rina stay at HQ | still three tabs, not his ask |

**Rejected on purpose:** reading his borders from the real project (never touch live data from here).

**Decision:** OPEN.

**09:27 - his "the border is not included and exported as well with all the data that i gave u before" - ROOT CAUSE (real app, not only the demo):** Map System saves AND reads borders at artifacts/<app>/users/<uid>/mapSettings/bnd_* (MapMissionControl.jsx:530, 551, 561, 576, 717, read :1829), but BOTH backups read artifacts/<app>/users/<uid>/mapBorders (App.jsx:691 and :894) - a collection nothing writes. Every backup he made carries mapBorders = [] -> a restore would lose his drawn areas; the demo seed (tools/demo-seed-from-backup.mjs, customers etc. only) could never get them either. Restore (App.jsx:4153) already accepts data.mapBorders || data.mapSettings. Fix proposed (his go): backups read mapSettings and keep the bnd_ docs as mapBorders; a guard; then a fresh backup -> seed builder takes mapBorders -> the reset writes them for the demo owner.

**09:30 - DECIDED, his words:** *"yes fix the backup, owner stays in kabupaten magelang its fine, just make 2 teams, and make the muntilan inside kabupaten magelang as headquarters in here, yogyakarta is not included, only bandung and muntilan team for now, sure cartoon face that u make is also fine, yes push everything with all of that, make sure that the history and everything is in there so that they are be able to be reviewed as well just remember, makesure that the demo is fully realistic 100%"*. Two teams: BANDUNG + MUNTILAN (= HQ, Kabupaten Magelang); Yogyakarta out; cartoon faces; weeks of history; backup fix first; one push for all. Open: Rina (T3) at Muntilan HQ or Bandung (default Muntilan).


**2026-10-13 14:47-15:00 - BUILT, WALKED, PUSHED (kpm `9295042` backup fix, `25fb74a` demo company, cartoon faces after it, emulator count tool + crash-safe checks after that).**
- Backups: both read mapSettings/bnd_<id> through src/utils/mapBorders.js; restore + share import write back there. Round trip guarded.
- Teams: Headquarters = Muntilan (JAWA TENGAH): owner Hartono, Rina T3, Hendra T4, Dika T6, Budi canvas. BANDUNG (JAWA BARAT): Agus T5, Dewi regional admin, Ari motorist. Roster = exactly two tabs on the emulator. The third "UNASSIGNED AREA" tab was the owner's van, auto-made by useDatabaseSync.js with no place - the reset now writes it with HQ's place.
- Profiles: cartoon faces (api/_demoFaces.js), bios, career ledger ON (settings/general.useCareerLedger), ranks Bronze..Mythic, frame = rank material, awards. 913 docs per reset (free plan: ~20 resets a day).
- Walk on the emulator (owner, T6, T4, T3): profiles + leaderboard + EOD (the owner approved Agus's waiting report: +1 day, +85 XP, credited once) + Reports (Sept + Oct, Rp 368 jt this year) + Journey (no ghost warning) + Restock (2 Bandung requests). Reset proof 17/17.
- Findings NOT fixed (his to rank): (1) leaderboard cards print Rp 0 / 0 closed when the career ledger is on - HallOfFameView skips the sales scan in ledger mode but still shows its totals (his real app too, if he turns the ledger on); (2) the owner shows twice on the HQ roster (his van + his profile card) - how the real app shows any owner with a profile; (3) the owner's profile says "TIER 1 : SYSTEM ARCHITECT" while the door says Owner (T2) - the app's COMPANY_OWNER label; (4) Rina (T3 AREA_ADMIN at Headquarters) gets a branch-style Restock screen "Gudang Headquarters" - her place did not change in this job; (5) one refused login-record write (rules L241/L250) in the console during the walk, source not found.
- Rejected on purpose: anime faces (his call); turning the career ledger off to dodge finding (1) - that drops every rank to Bronze.


**2026-10-13 17:58 - the 5 findings FIXED (kpm `1cedbd3`, local), his *"fix it all whatever the order"*.** Causes: (1) HallOfFameView skipped the sales scan under the career ledger but printed its totals; (2) Fleet listed master_owner (a profile record) beside ADMIN_VEHICLE (his van) - now left off the stage like the EOD / Stock Opname pickers; (3) getCorporateIdentity hard-coded master_owner = T1 - now reads the record's title ('T2 · OWNER' from the location ping / the demo reset); (4) BranchWarehouseManager made a branch desk of "Headquarters" for any non-admin there - HQ is not a branch, they read the company Stock by Warehouse table; (5) App.jsx sign-in copied the email login record to employee_directory/<uid> - the rules refuse a staff create (only boss / admin), it threw on every staff sign-in; rules read people by email and the copy was read nowhere else, so the write is gone. **Rejected on purpose:** widening the employee_directory create rule - a salesman could then write his own userRole / bossUid. Proof: 5 guards red first, each fix seen on the emulator (PERMISSION_DENIED count flat across two staff sign-ins).


**2026-10-13 18:16 - his team rule, RESTATED (this wording wins over 09:31):** *"why on the bandung and headquarters there is no tier 4 or regional admin?, i said before that each team should contain at least regional admin tier 4 and motorist tier 6, sales canvas tier 5 is optional"* Both teams already met it; the roster card hid the tier for everyone but a T3, so he could not see it. Fixed in kpm `5771169`: a T4 card reads "REGIONAL ADMIN (<place>)". OPEN: should his T1 Gmail jump to the Owner after "Reset demo now"? (his Gmail sees an empty company - it is not a member of the demo company).


**2026-10-13 18:2x - RESET WITHOUT SIGNING IN (his idea, OPEN - waiting on Aldi).**
Problem, his words: *"btw if google login should be for my adikaryasukses account only, then why is that button is there tho why dont we just add some button and password to reset the demo and i dont need to login again whatsoever? and people also didnt need to login when they see that"*
Why Google is on the door today: the "Reset demo now" button proves it is him through his Google sign-in token (api/demo-reset.js callerOf checks the token's email = his Gmail). A visitor who signs in with Google gets an empty company of their own - no use to anyone (his 18:08 screenshot is exactly that, for his own Gmail).

| Option | What happens | Cost |
|---|---|---|
| A (my pick) | Door: the 5 people + a small "Reset demo" button -> asks a password -> the server checks it against a secret only the demo's Vercel project holds (DEMO_RESET_PASSWORD) -> reset. Google button removed. One reset per 10 minutes, enforced on the server. | His step: add one secret in the demo Vercel project. Code: door + api/demo-reset.js + a cooldown doc; the T1-by-Google path goes. |
| B | Keep Google; after "Reset demo now" his Gmail jumps to the Owner by itself. | No setup; he still signs in with Google every time. |

Models applied: Inversion (how does a stranger abuse a public reset? guess the password and reset over and over - each reset is ~913 writes + ~913 deletes, the free plan allows 20.000 of each a day, so ~20 resets kill the demo until midnight -> the server-side 10-minute cooldown caps that at 144/day worst case... still too many -> cooldown must also cap the DAY: max 12 resets a day), Second-order (removing Google also removes the only way his T1 Gmail reaches the demo - fine, the demo needs no T1 screen), Chesterton's Fence (Google was kept on the door in the 2026-10-11 design "with one line saying a Google visitor gets no role" - it existed for the T1 reset, nothing else).
Rejected on purpose: the password inside the app's code (the bundle is public - anyone could read it); a password with no cooldown (one leak = the demo dead for the day).
