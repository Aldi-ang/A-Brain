# KPM Inventory (Cello/KPM) — Project Facts Reference

Load this instead of re-deriving these facts from scratch. Stack: React 19 + Vite + Firebase
(Firestore + offline persistence) + Vercel. Multi-tenant B2B SaaS, PT Karyamega Putera
Mandiri. GitHub: github.com/Aldi-ang/kpm-inventory (public).

## Tenant architecture (memorize this, it comes up constantly)

- One shared Firebase project (`cello-inventory-manager`) hosts every tenant company.
- Each company's entire data lives under `artifacts/{appId}/users/{masterUid}/...` —
  `masterUid` is that company's Tier 1/2 owner's UID, shared by every employee of that company
  via `bossUid`.
- `userId` in the app resolves as `bossUid || user?.uid || user?.id || 'default'` — this is
  the standard pattern for scoping any per-tenant Firestore path.
- `employee_directory` is keyed by **email**, not UID, as the authoritative record (written by
  admins). A UID-keyed copy only exists for the Company Owner's own migrated record, covered
  separately by `isVaultOwner()`. Don't assume dual-keying is needed elsewhere without checking.

## Tier system

TIER_1 `DEVELOPER` (Architect/platform owner) → TIER_2 `COMPANY_OWNER` → TIER_3 `AREA_ADMIN` →
TIER_4 `FLEET_CAPTAIN` → TIER_5 `FIELD_OPERATIVE` → TIER_6 `ROOKIE`.

Legacy string overlap exists: `'ADMIN'` and `'DEVELOPER'` both mean Tier 1 in some older code
paths. Confirm which literal string a given check actually uses — don't assume.

## A NEW `ROLE_PERMISSIONS` key is ABSENT from the live matrix — never read absence as "no" (2026-09-06)

Delegated permissions are array entries in `ROLE_PERMISSIONS` (`src/config/permissions.js`), and
the owner's saved matrix lives in Firebase. So **a permission key your change introduces does not
exist in the deployed matrix.** Gate the feature on `perms.includes('new_key')` and it is denied
for every tier at once, while your code is perfectly correct — a bug that looks like a logic error
and is not.

The established shape is **absence means the tier default**: ship a default tier set in code, and
let the saved matrix win in both directions once the key appears in it. Existing keys following
this: `view_expected_count`, `handle_delivery`, `manage_registry`, and `handoff_cross_region`
(added 2026-09-06, default tiers 1-3).

Same fix, two adjacent traps worth knowing:

- `UNASSIGNED` is the fallback string for a missing `location` field, **not a region**. Never let
  two records both missing a location compare as "same branch" — the emptiest possible record would
  get the widest possible reach.
- Do not overload "field is absent" to mean two different things (there: an owner acting
  company-wide vs. an agent whose location was never filled in). Use a separate explicit flag. The
  first draft of `handoffEligibility` overloaded it and reopened the hole it had just closed.

## The single most recurring bug class in this project

**A Firestore rule function checks a role by its exact literal string, and simply omits a role
that the client-side UI (or business intent) clearly includes.** This has independently
recurred at least 5 times: `procurement`/`canvas` listeners, the fleet paintbrush
(`mapSettings`), roster create/delete (`motorists`), `pending_audits`, and Fleet Captain
roster-management delegation. Specifically: `isAreaAdmin()` only ever checks for the literal
`'AREA_ADMIN'` string — it has never covered `'FLEET_CAPTAIN'`. When touching any
tier-gated rule, explicitly check whether Fleet Captain (and any other plausible tier) should
also be included, rather than assuming one role-check function covers what it sounds like it
should.

## Known-safe patterns already established — reuse, don't reinvent

- **`commitInChunks(db, writeBatch, operations)`** in `src/utils/helpers.js` — chunks writes by
  both operation count (500) and byte size (8MB), commits sequentially with pacing between
  chunks. Use this for any bulk write instead of a raw `writeBatch` or a hand-rolled
  `Promise.all` chunking loop (the latter has independently caused real production incidents
  twice — firing all chunks concurrently is the actual root cause, not just chunk size).
- **`usePhotoStorage`** (in `appSettings`, Tier-1-only toggle in Architect Terminal) — lets
  photo-saving switch between base64-in-Firestore (safe on any Firebase plan) and Firebase
  Storage upload, via the shared `savePhotoAndGetReference()` helper. Default is OFF
  (base64-safe) since Storage requires a paid Blaze plan this project doesn't currently have
  provisioned.
- **Firestore Security Rules workflow**: `firestore.rules` (live draft, matches what's
  actually deployed plus any pending changes, heavily commented with `[CHANGE N]` markers
  explaining each deliberate deviation from the original baseline) + `firestore.rules.
  deployed-baseline` (a frozen copy of what was live as of the last major reconciliation, kept
  as an instant rollback reference). Never deploy a rules change without: investigating actual
  current behavior first, testing against a real Firestore emulator (JDK 21+ required — this
  environment has historically only had JDK 8, a portable JDK download is the usual
  workaround), and leaving it as a reviewed draft for manual `firebase deploy --only
  firestore:rules` — see `SECURITY_RULES_DEPLOY_CHECKLIST.md` in the repo root.
- **`MANUAL_TEST_CHECKLIST.md`** and **`SECURITY_RULES_DEPLOY_CHECKLIST.md`** in the repo
  root — durable, reusable checklists. Check them before testing/deploying; update them when a
  new durable lesson is learned, rather than letting knowledge live only in chat history.

## Removing an npm dependency — verify it's not a transitive need first

`react-is` was removed as "unused" (2026-07-27, `cleanup-dead-weight-hygiene` branch) after
confirming nothing in `src/` imports it directly — but `recharts` imports it internally
(`node_modules/recharts/es6/util/ReactUtils.js`), so the removal broke the Vercel production
build (`Rollup failed to resolve import "react-is"`) even though it built fine locally with a
stale `node_modules`/lockfile still holding the old dependency tree. Fixed by restoring it
(commit `9cddd45`).

**Before removing any dependency as unused**, grepping `src/` for direct imports isn't
enough — a package can be required internally by another dependency you're keeping. Check
`grep -rl "\"<package>\"" node_modules/*/package.json` for anything still declaring it, or
just do a full clean install + production build (`rm -rf node_modules && npm install &&
npm run build`) before trusting a "this looks unused" cleanup. Same root cause class as the
`commitInChunks` lesson above — a local check that doesn't match what actually gets
exercised in a real build/deploy.

## Live browser verification — `agent-browser` (installed 2026-07-29)

Real browser automation is available for verifying things a code read can't confirm — an
offline-sync race, a double-verify race, an actual rendered permission error. Installed globally
(`npm install -g agent-browser`, on PATH, `agent-browser doctor` passes clean) and registered as
a **project-scoped** MCP server at `kpm-inventory-main/.mcp.json` (`--tools core,network` — the
`network` profile is what adds `agent-browser set offline` and `agent-browser network route
<url> --abort`, needed for airplane-mode-style tests; `--tools all` was deliberately not used,
keep it scoped).

Being project-scoped, its `mcp__agent-browser__*` tools only load in a Claude Code session
started **from `kpm-inventory-main` directly** (not a `.claude/worktrees/...` subfolder, and
worktree-isolation should be off) — MCP servers load at session start, so a session already
running before this was installed won't see it until restarted.

> ⚠️ **A-BRAIN IS THE MEMORY, THIS FILE IS A POINTER.** Aldi, 2026-08-14: *"this app memories and
> facts should be take noted inside the A-Brain, this app folder is just for workspace, all the
> memories regarding anything should be taken from A-Brain"*. The two sections below are summaries;
> the authority for both is `A-Brain/Wiki/Concepts/The KPM Control System.md`. If they ever
> disagree, **A-Brain wins** — and fix this file, do not fix A-Brain from this one.

## The app shell holds TWO layouts in one file — "done" can be true for only one

`src/components/BiohazardTheme.jsx` renders the navigation for **both** the phone and the desk from
one element. The phone half is on the control system (`kpm-rail-mark`, the edge ribbon, the
scrub-to-peek label, `auto-rows-[minmax(0,1fr)]` so it never scrolls). The desk half, sitting on the
same buttons behind `lg:` prefixes, is **still hand-written**: `lg:bg-white lg:text-black
lg:shadow-[0_0_10px_rgba(255,255,255,.8)]` for the active tab, `lg:text-gray-500` for the rest, and
an `UNLOCK MASTER VAULT` button in raw `#ff9d00` with `rounded-xl` + `shadow-lg`.

🔑 **The trap this creates, and it has already happened (2026-08-14):** Aldi said *"i thought i
have already redesign these sidebar"* while looking at his PC. He was right — seven commits on
9–10 August redesigned it. Every one of them was the **phone**. So:

**Before telling him a screen was or was not done, name the WIDTH.** "It was redesigned, at the
other width" is the true answer far more often than either "yes it's done" or "no it never
happened", and both of those single-word answers are wrong in a way he can see on his monitor.
The same applies to any `lg:`-prefixed component in this repo.

Related state: the drawer does not render at all while signed out, and starts **closed** at every
width — the edge ribbon is the only opener (right edge on the phone, left on the desk). The
three-line menu square is deleted at every width by his instruction and an audit check keeps it so.

## theme.css: a class that pins its own background must pin its own ink

`--ink` is `#E8E4DE` in dark and `#131211` in light. That token is a promise about *the theme's*
ground. The moment a class paints its own background, the promise is void — and a component that
is dark in **both** themes (`.kpm-mod.gate`, the two locked screens) rendered near-black ink on a
near-black card for every light-mode user, at about 1.05:1. It shipped and passed 357 audit checks,
because every contrast check compares a token against the token ground it was designed for and
nothing compares a token against a **literal** background declared in the same rule.

**The shape to grep for: `background:` a hex and `color:` a `var()` inside one class.**
Fixed 2026-08-14 by writing the gate's literal hexes (`#f7e9c8` cream, `#8a7048` dim gold) into
`.kpm-mod.gate`. Audit group 15 now asserts it. Full write-up: `A-Brain/Wiki/Concepts/The KPM
Control System.md`, contract rule 5.

## theme.css: greping for a class proves it was TYPED, not that it APPLIES

Three bugs in one day (2026-08-14) had the same shape — a correct declaration that never reached
the pixel, each one surviving a passing audit run:

1. A `width: 144px` rule lost to a **Tailwind width class on the same element** carrying the
   phone's 176px. The check greped `theme.css`, so it passed for a whole day over a dead value.
2. A hover label's positioning lost to `.kpm-rail-mark > *` (`position: relative`) on **source
   order at equal specificity**.
3. `opacity: 0` on the closed desk rail never reached three controls because they carry
   `boot-1/2/3`, which run `forwards` — **a filled animation outranks a normal declaration in the
   cascade**. Consequence worth carrying: *any control with an arrival animation cannot be hidden
   by a plain opacity/visibility rule added later.* Fix by disabling the animation at that width,
   not with `!important`.

🔑 **A check must read the computed result, not the source.** `getComputedStyle` /
`getBoundingClientRect` in a real browser — see the live-verification section above. Finish a
styling change by reporting measurements ("rail 64, opacity 0, no animation running"), not by
quoting the CSS you wrote.

Same commit, neighbouring class: **mixing % and px positioning inside one scene** is a bug class.
The cave arch is `left: 4%` **plus a fixed 124px** while its torch was `21%` of the same box —
they only clear each other past ~729px, so the torch stood in the doorway at every real width.
Anchor one element to the other, or position both in the same units. Full write-up:
`A-Brain/Wiki/Concepts/The Rule That Never Applied.md`.

## Writing an audit check: count how many times your regex anchor matches, not just whether it matches

Recurred 4 times in one week (through 2026-08-15) in `src/config/integration.audit.mjs`: an anchor
string that repeats in the file — e.g. `@media (min-width: 1024px) {`, which occurs several times
in `theme.css` — and a plain text search (`.indexOf`/`.search`/first-match regex) returns the
*first* occurrence, not the one the check actually means to validate. One instance landed the
check's gate 28,000 characters early, silently validating the wrong block for a full audit run.

**Before trusting a text/regex anchor in a check, count how many times it matches the file** (or
use a distinguishing, non-repeating fragment — a specific value or a full selector string) rather
than assuming a match means *the right* match.

### The same anchor, killed by line endings: never put a literal `\n` in a needle

This repo's files are checked out with **CRLF** endings, so a needle containing `\n` (e.g. a regex
ending `;\n`, or a multi-line string anchor) matches **nothing**. It bit twice on 2026-09-01
alone: in the morning a lift returned `undefined` and every behaviour check built on it went green
**while testing nothing**; in the evening an audit check failed for the same reason.

🔑 **Write `\s*` (or `\r?\n`) instead of `\n`, and add an anchor check asserting the lift actually
FOUND something before anything slices it.** A lift that silently returns `undefined` turns its
whole check group decorative — and the group's count still shows up in the audit total.

## Neither audit suite renders anything — a green run says nothing about whether the screen loads

`integration.audit.mjs` and `logicFixes.selfcheck.mjs` **read source text and run functions lifted
out of components**. Nothing in this repo mounts a component. `npm run build` does not evaluate the
module either — a bundler compiles it and never runs it.

Measured 2026-08-21 (`7989b82`): a count row read `hasTyped` two lines **above** its own
`const hasTyped`. A `const` is in the temporal dead zone until its own line runs, so every render
threw `ReferenceError` and the whole Stock Opname tab fell into `LazyTabBoundary` — a blank
*"[STOCK_OPNAME] FAILED TO LOAD"*. It shipped and survived **two further commits** while
`build` was clean, `integration.audit` read **599/599** and `logicFixes.selfcheck` read **565/565**.

🔑 **Every check in this repo can be green while the app is a black rectangle.** A change that
alters what renders is not verified until the screen is opened — `agent-browser` (see the
live-verification section above) or Aldi's own Chrome. Say "not visually verified" rather than
quoting a suite total as if it covered rendering.

## Prove a check fails before trusting it, and lift every constant from the source

Two decorative checks were caught in a single day (2026-08-21), both only by **deliberately
breaking the shipped rule and watching what happened**:

1. A threshold was **retyped** into `logicFixes.selfcheck.mjs` instead of imported from the
   component. Loosening the *shipped* rule to a nonsense value changed nothing — the checks were
   testing the check file's own copy of the number.
2. A static guard for the `const`-ordering crash above **passed on the broken code as readily as
   on the fixed code**. It was deleted rather than kept, and a comment left in its place saying
   there is no static check for "it renders".

🔑 **Write the probe, not just the check.** After adding a guard, break the source rule it is meant
to catch and confirm the check turns red; if it cannot fail, delete it — a decorative check is
worse than none, because it is counted in the total. **Lift every rule and constant out of the
source** (export it and import it) rather than retyping it into the check.

Related: a check that scrapes a whole file for a generic shape (`value:`/`label:` pairs) breaks the
day a second array of that shape is added — scope it to the named block. Same failure family as the
regex-anchor section above.

## Biometric/passkeys are Vercel-only by design — not a Firebase problem

`App.jsx:1118` — `rp: { id: window.location.hostname }` — locks each WebAuthn passkey to the exact
hostname that created it. WebAuthn also rejects a bare IP address as `rp.id` outright and refuses
to run on a page showing a certificate warning (the self-signed LAN dev server always shows one).
So a passkey registered at the Vercel address will never work from a LAN IP, and can't be
re-registered to work there either — **the LAN IP is PIN-only, permanently, by design.** "Biometric
keeps resetting" reported alongside "the grace period is gone" is the same per-origin fact, not two
bugs — see `A-Brain/Wiki/Entities/Master Vault Gate.md`.

## `grid-auto-rows: minmax(0, 1fr)` needs a DEFINITE height on its container to resolve

Sizing a flex/grid ancestor from `height: 100%` to `height: max-content` (or similar) makes the
grid's own height indefinite, and `1fr` rows silently collapse toward their content instead of
erroring — a `minmax(0, 1fr)` row can end up a fraction of its intended size with no console
warning. If a grid inside a container needs to both size-to-content AND keep `1fr` rows even, give
the *grid itself* a definite `flex-basis` (e.g. `flex: 0 1 var(--cap, auto)` with a computed cap),
don't rely on inheriting a definite height from an ancestor that's being resized for an unrelated
reason.

## A check proves a number COMPUTES, never that it MEANS anything (2026-08-27)

The strongest counter-example this repo has to a green suite. `f7800f5`: Sebaran Stok printed a
per-warehouse **"Est. days left"** = total shelf / total sales rate. Master Vault read **348 days**.
That whole rate (500/week) was **one** product; its own cover was **20 days**, one row down in the
same drawer. **17x too comfortable**, on the panel whose only job is *which warehouse do I restock
first* — with the build green, **632/632 checks passing**, and the arithmetic verified on screen
twice. It really is 348. Aldi caught it by reading the screen.

🔑 **A ratio of sums is only a rate if the numerator and denominator describe the same fungible
good.** Before dividing an aggregate by an aggregate, ask what one unit of each would have to have
in common for the quotient to name anything. If the answer is "they'd have to be substitutable" and
they are not, there is **no** figure to print at that level — output a pointer to the level where
the question has an answer ("per item", "below"), and do not reuse a glyph that already means
something else on the rows below (an em-dash there means *no sales, so no rate*, which is a
different statement from *this question has no answer here*).

Watch for this shape anywhere in KPM: days-of-cover / burn rate / reorder point computed per
warehouse, per region or company-wide instead of per product; average margin over a mixed basket;
"average price per pack" across products with different `sticksPerPack`.

## One rule, one list — export the constant instead of lengthening the copy (2026-08-27)

`20c4a0a`: the Restock Vault's Tujuan picker built its own destination list filtering on
`!== 'UNASSIGNED'`, while `utils/supply.js` had long owned the real rule behind a `NON_BRANCH`
constant covering `UNASSIGNED AREA` too. **Headquarters** therefore appeared as a shipping
destination — a `stock_request` against a branch with no inventory subcollection. Two lists, and
the shorter one was on the form that **writes stock movements**.

Fixed by **exporting `NON_BRANCH`**, never by adding the missing name to the local copy.
Same rule for the numbers: **"where is every pack" has exactly one implementation**,
`supplyByProduct` in `utils/supply.js` — the dashboard and Sebaran Stok both call it, because two
implementations drift and the screen nobody edits is the one that keeps being believed. When a
screen is asked to match another "just like the dashboard", that is a **correctness requirement,
not a styling note**: call the same function, do not re-derive the maths.

## Three JSX shapes here that compile clean and fail silently

All three cost real time on 2026-08-26/27. None produces a warning.

1. **A duplicate `style` prop — the LAST one silently wins.** `284602b`: the nav rail carried
   `touchAction` above a long comment block and a `--cap` variable below it, so `touchAction:'none'`
   never ran, and the paragraph above it described a fix that was not there.
2. **`<button>` inside `<button>`** renders fine and **kills the inner click**. `76de71a`: the
   Siapkan control had to become a *sibling* of the row button in a flex pair.
3. **A JSX comment placed after `&& (` does not parse** — it is a second expression inside those
   parentheses. It broke the build twice in one evening (`999b5a7`). Put it outside the condition.
   And: **run the build before writing the claim that it is green.**

⚠️ When writing a check against a JSX tag, do **not** anchor on `/<nav[\s\S]*?>/` or similar —
the tag contains arrow functions, so a non-greedy scan stops at the `>` in `(e) => {` and reports
zero attributes. It passes forever. Anchor on the class name or another non-repeating fragment.

## Re-anchoring a check: what to keep, what to strip (2026-08-27)

Four audit checks fired correctly in one session, and each fix is reusable:

- **Anchor on what the check proves, not on incidental syntax.** A drawer check pinned
  `r.detail.map(p =>` and broke when the callback became `(p, i) =>`. Re-anchored on the **array** —
  which is what proves the drawer renders the list the totals are summed from.
- **A check that ties a printed claim to its data source is supposed to fire on a rename.** The
  "Sold (7d)" label is pinned to the `sevenDaysAgo` transactions listener, so changing the words
  without changing the cap trips it. Re-anchor, never loosen.
- **Strip comments before scanning for raw colours/values.** A palette check failed on the *comment
  explaining* a fix ("the original was `text-white` on `bg-black/50`"). Group 48 already carried
  `noCmt`; group 53 was written without it. **A trap paid for once must be paid forward into every
  group written after it.**
- **Migrate a check, never delete it to make a change pass** — that is how the thing it protected
  comes back. Document a moved count in place, beside the check.

## Environment quirks worth knowing upfront

- This is a PWA (service worker + manifest) — a "the fix didn't seem to apply" report after a
  real deploy is often just service-worker caching, not a real regression. Hard refresh
  (Ctrl+Shift+R) or unregister-the-service-worker before concluding the deploy failed.
- The live Firebase Storage bucket has never been provisioned (Spark/free plan) — any
  Storage-dependent code path will hang rather than fail fast unless it respects the
  `usePhotoStorage` toggle described above.
- Git worktrees have twice been the source of real, finished work silently never reaching
  `main` — always confirm a commit's actual diff matches its message (see the main skill's
  anti-recurrence check) and periodically check `git worktree list` for forgotten sessions.
- Printing (Reports' PDF) lays out at A4's printable width, ~718 css px — UNDER `md` (768). A phone
  fix written as `flex-col md:flex-row` silently changes the PDF; pin the print form with `print:`
  classes, and prove it by comparing box rects under emulated print media at 718 px (2026-10-02).
- `tools/seed-emulator.mjs` writes September sales with NO `timestamp`; the app's live transaction
  query never loads them, so Reports/Command Center read empty in the lab. A walk that needs rows
  PATCHes today-dated sales with a `timestampValue` (A-Brain `Raw/2026-10-02-phone-sweep-rest/ps-measure.mjs`).
- Map (react-leaflet v4): `pathOptions` go through `setStyle`, which never sets a class - a Polyline's
  `className` (and `renderer`) must be PROPS. The MapContainer is `preferCanvas`: a CSS-animated line needs
  `renderer={L.svg()}`. Leaflet only watches the window - a map inside a flex box needs a ResizeObserver
  calling `invalidateSize()` (src/components/Expedition.jsx, 2026-10-02). See `?shell&map` in tools/ponder-lab.jsx.
- CSS order trap: `src/styles/expedition.css` (imported by a component) loads AFTER Tailwind's utilities, so a
  `.kx-*` class that sets `display` beats `hidden` / `lg:hidden` on the same element (same specificity, later wins).
  Measured 2026-10-03: the day keys showed twice at 390. Use the component's own show/hide (`.kx-phone`/`.kx-desk`),
  never mix a display-carrying class with a Tailwind display utility (logicFixes guards the Mission Feed).
- Leaflet `L.divIcon` REUSES the marker's div on `setIcon` (it swaps innerHTML, the element stays). Anything cached ON the
  marker element (animations, flags, listeners) goes stale at the next icon change - key the cache on a child the new
  HTML creates (Day Replay 2026-10-05: `box.__rpFor !== scene`, the `.kx-c5.burst` chest). Found when the props froze.
- A NEW Firebase project (kpm-demo-f4d74, 2026-10-13): its `firebase-adminsdk-fbsvc@` service account gets ONLY
  "Firebase Authentication Admin" - an admin-SDK Firestore write answers `7 PERMISSION_DENIED: Missing or insufficient
  permissions` (same text as a rules denial, but the admin SDK skips rules, so it is IAM). Fix: add "Cloud Datastore User"
  in Google Cloud > IAM; it took ~5 min to reach the servers. The emulator never checks IAM, so an emulator pass cannot
  catch it. Also: Firestore recursiveDelete puts the real reason only in the error STACK - `e.message` ends "failed with: ".

## An icon-only button ignores a one-class `display` rule (2026-11-15)
theme.css styles `button:has(> svg:only-child)` as `inline-flex` at specificity (0,1,1). A component rule like
`.kx-find-key { display: none }` (0,1,0) LOSES to it, and so does Tailwind's `lg:hidden` on the same button: the
Journey search key showed on the PC and pushed the map 18 px down. Hide or show an icon-only button through a
wrapper (`<span className="lg:hidden">`) or a two-class selector, and read `getComputedStyle(el).display` at both widths.
