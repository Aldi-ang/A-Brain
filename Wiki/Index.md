---
title: Wiki Index
description: Flat A-Z catalog of every Wiki page — the reference list. For browsing by topic, start at Wiki/MOC.md instead.
type: index
created: 2026-07-27
updated: 2026-07-31
---

# Wiki Index

A flat catalog of every page, grouped by type — good for "does a page on X exist?" lookups
and for AI queries (see `CLAUDE.md`). **New here? Start at [[MOC|the Map of Content]]
instead** — it's the same pages, organized by topic instead of by list. Reminder: this
catalog describes *understanding*, not current live status. For "is X actually
deployed/fixed right now," check the real `kpm-inventory` git repo, not this page.

## Entities (specific things)

- [[Multi-Tenant Architecture]] — the `bossUid` per-company data pattern
- [[Tier System]] — the six-tier role hierarchy (`DEVELOPER` → `ROOKIE`)
- [[Gudang Pusat (Master Vault)]] — the main warehouse's ONE name, and why the `'MASTER'` beside it
  is a Firestore routing value that must never follow the rename
- [[The Place Registry]] — factories and warehouses as records with fixed addresses; why the
  warehouse half already existed, and why the route boxes now search instead of create
- [[Firestore Rules]] — the server-side enforcement layer, and its draft-vs-live split
- [[Fleet Captain Permission Gap]] — the #1 most recurring bug class (`isAreaAdmin()` never
  covering `FLEET_CAPTAIN`)
- [[Rank Config and Achievement Badges]] — a feature with two distinct real bugs: zero rule
  coverage (fixed), and a cross-tenant shared document (open, documented)
- [[Git Worktrees]] — the tool behind three real lost-work incidents
- [[Master Vault Gate]] — the master-password screen, its locked numbers, and its closed decisions
- [[Terminal Tenant Path Split]] — the terminal read one vault and wrote another; invisible on the
  boss's own account, broken for every salesman
- [[The Admin Agent Profile Id]] — why the shell's face does not follow Agent Profile for the boss,
  and the ghost-killer line that looks like the cause and is not

## Concepts (recurring patterns)

- [[UI-Says-Yes-Server-Says-No Pattern]] — a UI control shown without a matching server rule
- [[Anti-Recurrence Check]] — never claim "committed" without `git show --stat` proof
- [[The Named Path Was Already Shut]] — the button a bug report names is usually the one already guarded
- [[Looking at the App]] — how to actually SEE a KPM screen before claiming a visual fix: the
- [[Concepts/Looking Inside the App]] — the emulator setup; every screen behind the login is verifiable now, real data still is not.
  theme-lab harness, why the dev server cannot be opened directly, and the three ways the
  harness lied first
- [[The Rule That Never Applied]] — three same-day CSS bugs where the declaration was written
  correctly and still lost; greping the source proves it was typed, not that it applies
- [[Sounds Come From Aldi]] — a sound is a file he chose, never one generated in code and never
  one borrowed from another meaning. Three rounds lost to that, the ffmpeg cut method that
  finally worked, and why audibility is his phone's test and never this environment's
- [[Draft-Then-Deploy Discipline]] — rules changes are always draft until manually deployed
- [[The KPM Control System]] — the reusable button/panel/record vocabulary, and the rule that
  authority is graded by material rather than colour
- [[Off-Token Colour Migration Map]] — the hardcoded-colour → theme-token table every screen
  migration follows, and the two checks that prove one landed
- [[Ponytail Philosophy]] — the minimal-code discipline governing how the real repo gets
  edited
- [[9Router Subordinate AI Delegation]] — curl-delegating subtasks to free models via 9Router,
  and logging what each one is actually good at
- [[Secure Context Requirement]] — browser APIs that are undefined off HTTPS; the PC-works
  phone-does-nothing bug class
- [[Silent Failure Disease]] — a code path that ends without telling the user; the app's oldest
  and most expensive bug class
- [[A Network Is Not The Internet]] — `navigator.onLine` says a network exists, not that packets
  arrive; it has lied twice here, the second time freezing a finished sale on PROCESSING
- [[Lancelot the Tobacco Ledger Agent]] — the bookkeeper agent for the tobacco business (NOT the
  KPM app): reads nota + bukti transfer photos, checks the arithmetic, writes the Sheets ledger
- [[Fat Documents in a Live Listener]] — a base64 photo inside a customer document turns every
  unrelated write into megabytes of main-thread work, because a snapshot re-materialises the
  whole collection; found chasing the phone freeze after registering an outlet
- [[Aldi's Design Taste]] — what he actually likes and rejects, built only from screens he judged
- [[The Eight Warehouse Gaps]] — what big warehouse operations do that KPM does not, ranked, with the build order and the excise question that blocks one of them
- [[Logistics and Stock Movement]] — **topic hub**: the factory→HQ→branch→van→store chain, which note answers which question, and the locked rules. Start here for anything about shipping, restock, transfers or stock levels.
- [[One Pack Count, Many Screens]] — karton, bal, slop and bks: the one converter every screen must use, why the boxes are a calculator rather than a second unit on the line, and the two screens that still hardcode the rate and miscount today.
- [[A Cache Saying No]] — why the app showed ACCESS DENIED to its own owner for twenty seconds: Firestore answering a lookup from the local cache, and the rule that a negative from the cache is not evidence while a positive still is.
- [[HQ-Initiated Stock Push]] — how HQ could send stock to a branch on purpose instead of waiting for a request: the verified PENDING→IN_TRANSIT→DELIVERED lifecycle, four options, the courier-vs-consignee trap, and the in-transit hole. **BUILT 2026-08-27 as option A** (see the summary below).
- [[A Ratio of Sums Is Not a Rate]] — a total divided by a total is only a rate if the things are interchangeable. Sebaran Stok shipped a warehouse "348 days left" whose real cover was 20, past 632 green checks.
- [[Headquarters Is Not a Cabang]] — Headquarters IS the master vault, so anything posted there reads an empty branch warehouse forever. Bit the Tujuan form (20c4a0a) and the POV test agent (b1cdcaa).
- [[A Feature Is Not Done Until the Book Knows]] — his rule, 2026-08-30: a new panel gets its own Ponder scene, a new column gets beats on the existing one, both in the sidebar section they are printed in.
- [[A Check Points at a File, Not at a Behaviour]] — source-scan checks bind to a PATH. Move the code and they keep asserting against the file it left; two went red for four days and nobody saw it.
- [[Ponder Tutorial System]] — an in-app tutorial per component, modelled on Create mod's Ponder: scripted scenes over fixed demo data, never video and never a live spotlight. **Slice 1 built 2026-08-27; all four of his questions answered and encoded as checks.**
- [[What Create Mod's Ponder Actually Does]] — the mechanics read out of Create's own source: every control, why its pause is really "Identify", why scrubbing only stops at authored keyframes, and the mutable-world constraint KPM does not have.
- [[An Effect's Own Cleanup Can Cancel Its Frame]] — a requestAnimationFrame scheduled in a React effect and killed by that effect's own cleanup. Twice in one session it deleted a whole feature with every check green and nothing thrown. **Now the hub for a family of five** — read it before debugging anything visual that "looks right in the code".
- [[A CSS Animation Outranks Your Inline Style]] — a keyframe's `transform: none` erases the inline `transform` you positioned with, because the animation origin beats the author origin. It put every Ponder caption on top of the field it was explaining, in every scene, with 657 checks green.
- [[A Rect Is Painted, Not Laid Out]] — `getBoundingClientRect()` reports the screen, not the layout, so measuring through an ancestor's `scale(0.94)` returns geometry 6% small. It healed itself four seconds later, which is why it shipped.
- [[Design Inspiration Sources]] — the 5 sites his component and animation ideas come from, and the 4 rules an idea must clear to survive in KPM

## Summaries (one per ingested source, newest ingest pass first)

- [[n8n Automation Templates Archive]] — 347 ready-made automation workflows, saved locally
- [[Skill Repos Evaluated 2026-08-25]] — 19 skill repos judged; why 18 were declined on catalog cost
  so they survive upstream deletion; the full index lists every one

- [[Surat Jalan Desk and Sebaran Stok]] — the Restock Vault becomes one surat jalan desk with four tabs, HQ gets a push and a request queue, and Sebaran Stok answers "where is every pack" per warehouse.
- [[Stock Count Trust Chain]] — the afternoon the gap between "a different number was found" and
  "stock changed" was closed: recount, cause, tolerance, leak detection. Plus the five shortage
  words Aldi has not approved
- [[Light Ground and the Theme Lab]] — why light mode looked unfinished when every panel was
  already converted, and the harness built after three "fixed" claims made without ever looking
- [[KPM Project Facts Reference]] — the delegate-coding-task skill's KPM facts doc
- [[Fleet Captain Rule Gaps — Batch 1 and 2]] — two batches of fixes, their unmerged-branch
  scare, and their eventual real-PR merge
- [[Rank Config Cross-Tenant Gap]] — the closest real match to a rules "escalation"
  vulnerability in this codebase
- [[Lost Work in Worktrees — Three Incidents]] — Customer Directory, NOO fix, build-check.yml
- [[Customer Directory Permission Tier]] — the feature behind worktree incident #1
- [[Offline Login Lockout Fix]] — false Access Denied on offline refresh
- [[Option B Region Lock]] — Area Admin/Fleet Captain roster region-locking, plus a real
  stale-memory lesson
- [[Rules Draft Process]] — the source behind Draft-Then-Deploy Discipline
- [[Ponytail Philosophy Ingest]] — the source behind Ponytail Philosophy
- [[Claude Code CLI Install — McAfee Download Freeze]] — CLI install blocked by McAfee
  intercepting the download, plus the non-interactive ponytail marketplace install
- [[Dead Weight Cleanup and Rules-Deploy Gap]] — ponytail-ultra review re-confirmed rules
  still undeployed; dead code/deps/assets and a leaking "GOD MODE" console.log cleaned up
- [[Six Days — Gate, Phone Access, Quota Meter]] — 178 commits, 2026-08-04 → 2026-08-10; the
- [[Concepts/A Store Name Is Not a Store]] — the name is not the shop; a name-keyed sweep is a money bug.
- [[Concepts/Ecer Is a Person, Not a Shop]] — his tier design, and why an Ecer consignment broke the store hand-off three steps downstream.
- [[Concepts/A Mode Reminder Does Not Outrank Aldi]] — a standing decision of Aldi's beats an instruction injected mid-session; the 31-agent, 1.62M-token workflow that proved it, and the hook proposed to stop the next one.
- [[Concepts/Ownership Moves, History Does Not]] — a hand-off moves ownership, never authorship; and why deleting the rewrite alone would have been the worse bug.
- [[Concepts/A Stored Name Is Not the Name of Record]] — the stored agent name is a frozen Google displayName; the id on the row is the fact. Also why the hand-off left every "who manages this" reader naming the previous agent.
- [[Concepts/Email Is a Document ID, Not a Field]] — telling a structural required field from a tidy one before relaxing it, and the duplicate check that breaks when you do.
- [[Concepts/A Hijacked UID Is Not an Identity]] — a substituted uid turned the vault grace into a privilege escalation; grep the hijacked field, not the feature.
- [[Concepts/POV Changes the Id, Never the Email]] — wrong only under POV? grep the screen for user?.email and ask which identity it trusted.
- [[Concepts/A Retry Must Land Where the First Try Landed]] — decide the document id when the record is QUEUED; acknowledge at the granularity you commit at.
  backfill pass that closed a six-day vault gap

- [[Concepts/Where KPM Is Going]] — START HERE: the theme, every locked decision, and the direction.
- [[Concepts/A Meter That Exits Silently Is Not a Meter]] — a silent monitor and a healthy one look identical from inside. Fixed 2026-08-31: a decoy config file, and a count reported as a percentage.
- [[Concepts/The Shell Repaints Any White It Can Reach]] — why the printed nota was see-through, and why a frame is not evidence for anything an animation touches.
- [[Concepts/A Smooth Scroll That Never Runs]] — a smooth scroll that moved nothing put every phone caption on top of its own subject; the source-visible asymmetry beside it was not the bug.
- [[Summaries/The Camera Was Aimed at the Wrong Scroller]] — the Ponder camera used `block:'nearest'` on the first match and moved the stage, not the table's own scroller: perfect vertically, 0% horizontally in view on five of fourteen phone beats.
- [[Concepts/The Book as a Stack of Sheets]] — the tutorial book rebuilt on the Framer interactive-book model: the sheet technique, why the chapters had to become the leaves, and the drag that never goes through React state.
- [[Brainstorm/2026-09-02_phone-tutorial-shell]] — 🔴 OPEN: four candidate phone shells for the tutorial, drafted for him to operate. The PC half is decided — keep the book, drop the riffle.
- [[Brainstorm/2026-09-06_handoff-approval-region-matrix]] — 🔴 OPEN: who gets the hand-off approval bell, and for which regions. Three options priced; the data shape and the default are decided, the replace-vs-add question is his. The SENDING half already shipped (`dace958`).
- [[Brainstorm/2026-09-08_shipping-readiness]] — what "no bugs" has to mean before KPM is sold: the 30 September deadline, the fix order (money lies > data loss > branch leaks > day one > appearance), and what was ruled out.
- [[Brainstorm/2026-09-09_day-one-walk]] — 🔴 OPEN: the day-one customer walk on an empty tenant, desktop and phone. All seven onboarding paths complete; one money finding needs his answer (does a Titip placement count towards OMZET before the audit says it sold?), and the day-one list under it is ranked and unblocked.
- [[Concepts/Revenue Recognition — Titip waits for the cash]] — ✅ DECIDED and SHIPPED (`a6192b1`): a Titip placement books no omzet and no "sold Bks"; the store audit books what the shop actually paid for, and the receivable gets its own line beside the omzet. Also why the same rule existed correctly in one screen and wrongly in seven.
- [[Concepts/A sale is a closed contract — no cash goes back]] — ✅ DECIDED and SHIPPED: the company never refunds; a retur is the agent buying stock back with his own money. Buyback is off for everyone including the owner, Exchange stays. Explains why no company total moves on a retur, and why `returnTotal` is read by nothing.
- [[Concepts/Handoff Eligibility]] — who may receive a consignment store and who may approve the hand-off; the matrix key per branch, and why absence of a key must mean "tier default".
- [[Concepts/The Cross-Site Login Block]] — why Google sign-in worked on localhost and failed on every deployed address, and the three theories that died on the way.
- [[Concepts/A Named Import Can Shadow a Global]] — an imported icon called `Map` beat the global; `new Map()` threw and the book went black with every check green.
- [[Summaries/The Shorter List Was Never the Eligible One]] — hand-off eligibility shipped as one predicate refusing the wrong receiver in the picker AND at the write; the display reversed a day later from greyed-out to hidden, because the filter that shortens a Tier 1's list is regional team, not eligibility. Plus: the demo link was never exposed, it was unreachable (Vercel Deployment Protection, 302).
- [[Summaries/The Panel That Never Reads a Transaction]] — unpaid consignment shown as revenue: the panel reads a rollup that merged receivable and paid before the writer ever saw them, so the fix is five files upstream. Traced 2026-09-05, not built. Same day: the `kpm-ang.vercel.app` demo, and the no-self-signup check that made a public URL safe.

## Known gaps (honest, not filled in yet)

- No Entity page for offline/PWA behavior generally — [[Offline Login Lockout Fix]] didn't
  cleanly fit any existing Entity. Worth an "Offline & PWA Behavior" page in a future ingest
  pass if more offline-related material comes in.
- This first pass focused on permissions/Firestore-rules material (where this project's real
  incident history is richest) and the worktree/process incidents. Feature-level knowledge
  (how Fleet & Canvas, Stock Opname, EOD Reconciliation etc. actually work end-to-end) isn't
  covered yet — a good candidate for the next ingest pass.

- [7 Days to Die — mod load order](Concepts/7%20Days%20to%20Die%20Mod%20Load%20Order.md) — infinite loading screen = one mod extending a block from a mod that loads after it; Vortex's load-order list does not match the disk
