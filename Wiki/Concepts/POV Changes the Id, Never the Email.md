---
confidence: high
checked: 2026-09-08
---

# POV changes the id, never the email

The tier preview switch lets Aldi wear another tier to see what that person sees. It moves
`displayName`, `agentId` and `userRole` onto a test account and **deliberately leaves `email`
alone**, because the Firebase UID is still his real sign-in and every Firestore read and write is
evaluated against it. `src/config/povPreview.js:115` says so in its own comment: pretending
otherwise is the one lie the feature must not tell.

That is correct, and it has a consequence nobody wrote down until it bit:

> **Any screen that resolves "who am I" by EMAIL is invisible to POV.**
> It will keep showing Aldi his own data while the banner above it says Tier 6.

## How it was found — 2026-09-08

> "i login as t6 tes account and the agent inventory is still showing the t1 inventory but i cant
> do sales with that inventory tho" — Aldi

Two screens answered "who am I" differently, and the pair of symptoms is the signature:

| screen | asks | answer under POV | what he saw |
|---|---|---|---|
| `AgentInventoryView.jsx` | `user.email`, **first** | his own record | the owner's van |
| `MerchantSalesView.jsx:942` | `agentProfileId` | `TEST_TIER_6` | empty van, sale refused |

**Visible and unsellable at the same time is the tell.** One screen believed the email, the other
believed the id, and only one of them tracks POV.

Fixed in `9a35e8e`: the email sweep stands down while previewing. It is untouched for real logins,
which is what it was built for — a stale or missing `agentProfileId` must not strand somebody on
the wrong van. **A preview is the one case where the id is the truth and the email is the stale
half.**

## Not a permission hole, and say so plainly

POV keeps his real UID. The stock shown was his own, and a genuine Tier 6 signing in with their own
Google account always matched their own record correctly. Nothing leaked. The bug was that POV lied
to him on the exact screen he was using it to check — which defeats the point of the feature, and
is worse than a cosmetic bug for that reason. See [[A Hijacked UID Is Not an Identity]] for the
case where a substituted identity *is* a privilege problem; this is its harmless-looking twin.

## The second instance, still unfixed as of 2026-09-08

`src/FleetCanvasManager.jsx:38` carries the identical shape:

```js
const myProfile = activeMotorists.find(m => m.email?.toLowerCase() === user?.email?.toLowerCase())
               || activeMotorists.find(m => m.id === agentProfileId);
```

It feeds `rawLocation` on the next line — the BRANCH the whole screen operates as. Tier 6 has no
`view_fleet` so Aldi's own test never reached it, but Tier 3 and Tier 4 do, and previewing as
either would show his own branch instead of the test account's. That matters more than the
inventory case did: region scoping is what hand-off approval and the geofence work both turn on, so
testing those through POV would quietly measure the wrong branch. Confidence on the impact:
likely — the two lines were read, the whole screen was not.

## The rule for next time

When something looks wrong **only under POV**, do not start at the feature. Grep the screen for
`user?.email` and ask which of the two identities it trusted. There is no shared helper to fix once
— each screen writes its own lookup, so each is its own instance.

⚠️ **Do not "fix" this by making `previewIdentity` rewrite the email.** It would repair every screen
at once and it is the wrong repair: email is identity, other code makes real decisions on it, and
`povPreview.js` refuses on purpose. Stand the lookup down at the screen instead.

Guards: `logicFixes.selfcheck.mjs` imports the real `previewIdentity` rather than restating it, so
if POV ever does start rewriting the email those checks flip and the guard gets reconsidered rather
than guessed at.

## Related

- [[A Hijacked UID Is Not an Identity]]
- [[UI Says Yes, Server Says No Pattern]]
- [[Handoff Eligibility]]

## Gap found 2026-11-02: the costume does not carry its place

His report (verbatim): *"the test account cant see any of the customer therefore i cant accept the the consignment as regional admin test acccount, make sure that all the test account also works well"*.

Mechanism (code read): `previewIdentity` (povPreview.js) moves name, agentId and userRole onto the owner's user, but not `location`. The owner is the raw Firebase user, which has no `location`. The shop list (useDatabaseSync, fed `user?.location` at App.jsx:604/606) then puts every Tier 4-6 costume in team `UNASSIGNED` (permissions.js:354), whatever place he picked. With folder access on, that team has no ticks: Tier 5-6 get an empty list, Tier 4 sees only `holdTeam == 'UNASSIGNED'`. Tier 2-3 see every shop (`seesEveryShop`), so they should be fine. The other screens already fall back to the test agent's roster `location` (App.jsx:5401, :5445, :5549); only the shop list does not. Not a data gap and not a rules gap: Firestore sees his real Tier 1 the whole time. FIXED 2026-11-02: kpm 809f208 - handlePickPov passes the picked place, previewIdentity puts it on user.location. Wear Tier 4 at a branch with ticked folders; at a place with no ticks an empty list is correct.

## A reload takes the costume off (2026-11-06 09:58)

His report: *"test 1 doesnt work, i fill the blank for the healthy and damaged goods, close the app, reopen and all the writing is gone"*. He tests with a test account, and App.jsx keeps `pov` in plain state on purpose ("a refresh always puts him back in his own chair. His rule"). So anything he tests across a reload, wearing a costume, comes back as the owner at the Master Vault: another warehouse, other data, and it reads as "lost". **A ✅ TEST that crosses a reload must say: put the same test account back on, same place.** Reproduced on the real app, kpm `df98751`.
