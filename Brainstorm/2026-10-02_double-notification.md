---
date: 2026-10-02
status: DECIDED and BUILT — kpm de33030 (2026-10-02)
---

# The same message twice: capybara bubble + top panel (2026-10-02)

## The problem, in his words

*"btw i want u to fix the double notification, sometimes notification is from capybara and top panel together showing the same information"*

## Why it happens (read, not guessed)

`triggerCapy` (App.jsx ~3194) shows the capybara's bubble for every message AND, when `isFailure(text)` (utils/toastSeverity.js) matches, also calls `notify(text)` - the top panel. That second call is deliberate: the bubble disappears after 8 s and is not drawn on the vault screen or while cropping, so a "stock did not save" said only by the capybara could be missed ("he just stops being the only witness to the ones that matter"). The low-stock alert ("⚠️ BOSS! SURYA 16 is critically low...", App.jsx ~1503) contains ⚠, so it counts as a failure and shows twice. 69 places speak through `triggerCapy`.

## Options

| | What he sees | Cost |
|---|---|---|
| A (my pick) | warnings and failures only in the top panel (it stays until he taps x); the capybara keeps everything else (hellos, "Sync complete", tips) | the capybara goes quiet for bad news |
| B | the capybara says it; the top panel appears only when the bubble cannot be seen (vault screen, cropper) | a warning he misses in 8 s is gone; most complex |
| C | capybara only | the "stock did not save" kind of message can vanish unseen - the reason the top panel was added |

## Decision

OPEN — waiting on Aldi.

## Rejected on purpose

- Dropping the top panel for failures outright without his word: Chesterton's fence - it exists so a failure is never only in an 8-second bubble.

Models applied: Chesterton's Fence (why the double call exists before removing it), Inversion (which choice loses a message he needed).

## Answered 2026-10-02 ~01:45 — A, plus a bigger design (his)

*"i choose A and i want u to make new features toward the notification, i want the top panel notification to be timed for few second then fade and also for capybara, but then i want the notification bells to have 2 segment, 1 is for the confirmation request or handsoff request and all of the urgent notification, and the other one is for temporary notification that can be cleared, this is just to record all the missed notification to make sure that the user miss nothing what do u think about this tho"*

Read: the bell today = Firestore system notifications for this person + logistics (handoff) notifications (App.jsx combinedNotifications) - that IS his segment 1 already. Toast.jsx keeps failures until clicked (isSticky); his design lets everything fade because the bell's second segment records it. Verdict given: right call (transient strip + inbox is the standard shape). Costs put to him: (1) a faded failure is only safe if the bell shows an unread count on the "missed" side; (2) where the log lives - this device (free, private, instant) vs his account (follows phone<->PC, but every message becomes a database write + a rules change he publishes) - my pick device; (3) repeats (the low-stock line) merge into one entry with a count; (4) keep the last 100 / 7 days. Open: his answers on where + seconds, then the bell drawn as pictures.

## Answered 2026-10-02 ~02:20 — account-wide list, 5 seconds

*"phone and pc show the same thing, maybe around 5 seconds is enough"* - so: one strip time for everything (5 s, the capybara bubble too, was 8 s), and the Missed list lives on his ACCOUNT. Consequences for the build: every recorded message is a Firestore write (keep it to one doc per person with a capped array - last 100 / 7 days - so it is one write and one live read, not a collection); employees are the hijacked user (user.uid = the boss) so key the doc on the PERSON (realUid / roster profile, like vault_keys); a NEW rule block in firestore.rules (the person reads/writes only their own doc) - a DRAFT he publishes himself before the push, per the rules draft process; offline: queue in Firestore's own cache (writes replay), and a failed write must never throw into the toast path. Next: the bell as pictures (two layouts), his pick, then build.

## The bell drawn, 2026-10-02 ~02:40 — A / B, his pick owed

Boards: `Raw/2026-10-02-notification-bell/board-phone.png`, `board-pc.png` (real app shell through the ponder lab, `tools/lab-bell.jsx`, `?shell&bell=a|b&open`; shooter `shoot-bell.mjs`, numbers in `measure.json`).

| | Phone (390) | PC (1440) | Cost |
|---|---|---|---|
| A (my pick on the phone) | one box, a switch on top: Needs you / Missed; opens on Needs you while it has a red number; 374 wide, keys 46 tall | same box, 380 wide | Missed is one press away |
| B (my pick on the PC) | both lists in one scroll; Missed header starts 600 px down, at the bottom of the box | 680 wide, two columns side by side, both seen at once | on the phone you scroll to see one missed line |

Same bell in both: red badge = Needs you unread (the plate lights only for this); a small gold-rim count under it = Missed not yet opened. A Missed row = the strip it came from (strip ink, red edge = failure, x4 = repeated), Clear all, kept 7 days, "Earlier" splits seen from new.

**Found while drawing [certain]:** today's bell titles use `text-orange-400` / `border-orange-500/*`, which Tailwind never generates here (`tailwind.config.js` defines `orange` as ONE colour, `var(--orange)`; the built CSS has 0 `text-orange-400`). So the new-message titles in the live bell print black (rgb 0,0,0, measured) on the dark panel. The proposals use theme tokens (`--duke-amber-ink`, `--duke-edge-*`); the build fixes it either way.

Models applied: Inversion (which layout hides a message he needed -> B on the phone buries Missed under the requests), Second-Order (a Missed count that never drops trains him to ignore it -> opening Missed resets it).

Decision: OPEN — waiting on Aldi (phone A or B, PC A or B; recommended phone A + PC B).

Rejected on purpose: a source icon per Missed row (capybara vs top panel) - who said it does not change what he does; dropped to keep rows short.

## Decided 2026-10-02 ~02:44 — "phone A pc B", BUILT kpm `de33030`

His words: *"phone A pc B"* - the recommendation, split per width. Built: the real bell (NotificationBell.jsx) is A under lg (one box, a switch, opens on Needs you while it has a red number) and B at lg+ (both columns, 680 wide); the Missed list on the account (utils/missedLog.js, one doc per person, keyed like vault_keys, writes debounced 1 s); every strip fades at 5 s and the capybara bubble at 5 s; a failure goes to the top panel alone (his A). Rules [CHANGE 15] is a DRAFT for him to publish (before it, an employee's list does not follow them across devices; nothing breaks). Walk: `Raw/2026-10-02-notification-bell/walk-built.mjs` + `walk.json` + `built-*.png`.

Not built on purpose: per-row clear (Clear all only), a source mark per row, ringing for Missed lines (every strip lands there - it would ring all day).
