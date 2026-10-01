---
date: 2026-10-02
status: OPEN — waiting on Aldi (layout A / B / C + cropper yes)
---

# Master Vault on the phone — measured, three layouts (2026-10-02)

## The problem, in his words

*"the mastervault need to be redesign and make it compatible on the phone, and make sure all the features is there, and the picture insert submission for the 3D cigarette box is incompatible in phone as well"* (2026-10-01 18:50).

## Measured (Raw/2026-10-02-master-vault-phone/mv-measure.mjs — the real built app on the emulator, owner, 390 css touch + 1440)

- **A finger drag turns nothing.** 3D box: touch drag leaves `rotateY(35deg)`, mouse drag turns it to 95deg. Photo cropper: touch drag leaves the photo where it was, mouse moves it. Both listen to mouse events only (ResidentEvilInventory.jsx ItemInspector `onMouseDown/Move/Up`; ImageCropper.jsx `handleMouseDown` + document `mousemove`). This is the "picture insert incompatible on the phone".
- **Cropper at 390:** the photo area is a ~140px strip (crop box 86x140) because the 3D-size card, zoom and rotate take the screen; the app's capybara bubble covers Crop & Save; cyan/blue/white panel (palette law).
- **List at 390:** a fixed 350px box holding title + search + tabs, so one and a half products show; every row's numbers line (VAULT/START/FIELD/SOLD/DMG) scrolls sideways — at 1440 too (269 < 400).
- **Two search boxes** (App.jsx "Search inventory by name..." above, the component's "SEARCH..." inside).
- **Small targets:** section tabs 38x27 / 47x27, the + add icon inside the search, Edit/Discard 33 tall, the photo-background and 3D-size buttons ~32.
- **Edit Record at 390:** STOCK / MIN ALERT / STICKS / TYPE in four 67px columns - labels wrap to three lines, the min-alert placeholder is cut.
- **Palette:** purple stage gradient + Grosir edge, emerald SOLD, cyan cropper.

## Every feature on the PC (the "all the features" checklist)

Search · add product (+) · type tabs · rows (thumb, name, VAULT bks/slop, START, FIELD, SOLD, DMG, LOW mark) · 3D box drag-to-turn + idle spin · 3D size W/H/D + Save 3D Layout · background photo upload · name, stock bks/slop/bal, DAMAGED, type tag · Edit / Discard · four prices · Edit Record (name, stock, min alert, sticks/bks, type, bks/slop, slop/bal, bal/karton, front-for-back, six face photos with re-crop, four prices, save) · cropper (pan, resize handles, 3D size, zoom, rotate slider, ±90, Cancel, Crop & Save).

## Options (board: Raw/2026-10-02-master-vault-phone/mv-board-layouts.png; the PC split stays in all three)

| | What the phone shows | Cost |
|---|---|---|
| A — same order, fixed | list first (grows, numbers wrap under the name), box below, one search | least code; the box and Edit sit below the whole list, a long scroll on a big catalogue |
| B — box first | the chosen product on top (box, stock, Edit), list under it | scrolling down past the box every time he looks for a product |
| C — list, then the product (my pick) | phone shows only the list, full width; tapping a product opens its own screen (big box, stock, Edit/Discard, prices, 3D size folded), Back returns | the most code (a phone-only product screen + back); no feature lost, each part gets the whole screen |

Cropper (board: mv-board-cropper.png) — one design, not a choice: the photo gets most of the screen, finger drag + pinch zoom, 44px round handles, zoom + rotate sliders + ±90 kept, 3D size folded, Cancel / Crop & Save pinned at the bottom, capybara hidden while cropping, amber/cream not cyan.

## Decision

OPEN — waiting on Aldi.

## Rejected on purpose

- Keeping the fixed-height list box on the phone: it is why only 1.5 products show.
- A sideways-scrolling numbers line in each row: his rule, *"sideways swipe is inconvenience for phone"* (the SIDEWAYS RATCHET guard).
- Dropping the free rotate slider from the cropper to save space: an early AFTER frame did, put back - "make sure all the features is there".

Models applied: Opportunity Cost (a phone screen split between list and box makes both too small - C gives each the whole screen), Chesterton's Fence (the desk split exists for a reason and stays at lg).
