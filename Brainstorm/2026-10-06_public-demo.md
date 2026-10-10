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
