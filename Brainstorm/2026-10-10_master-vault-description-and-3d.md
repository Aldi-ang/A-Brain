# 2026-10-10 - Master Vault: no description box; the 3D view moves the page (diagnosed, not fixed)

**His words:** *"the description editor for each product is gone btw i cant give new product a description while the old one still remains there, i use to have description on each product and i want the master vault screen when viewing the 3D is fixed and full screen just like the one we have on the view able menu on sales terminal because sometimes when rotate the 3D model it move the whole page instead"*

**1. Description [certain]:** the Edit Record / New Entry form (`src/App.jsx` ~5027-5103) has no description field; `handleSaveProduct` (App.jsx:3560) saves whatever fields the form has, so a box is all that is missing. History: `editingProduct.description` only ever existed in `src/pages/Inventory.js`, a page nothing imported, deleted as dead code in `ee2f854` (2026-07-21); the live form has not had the box since at least 2026-04-08 (start of git). Old products keep their text in Firestore and the sales terminal's fullscreen viewer shows it (`ExamineModal.jsx:119`). Rules: the owner can write it; T3/T4 product updates are limited to stock/name keys (firestore.rules ~431) - same as every other field in that form today.

**2. 3D [certain on the code, guessing on the trigger]:** the Master Vault box (`ResidentEvilInventory.jsx:123-125`) already has `touch-action: none`, so a drag that STARTS on the 340 px stage turns the box; a drag that starts anywhere else on the page scrolls it. The sales terminal's viewer is `ExamineModal` (`fixed inset-0 z-[10000]`, nothing behind it can move), opened only from the sales terminal (App.jsx:4495, MerchantSalesView.jsx:2652).

**Options for 2:**
| | What | Cost |
|---|---|---|
| A | Tap the box in Master Vault -> the SAME fullscreen viewer as the sales terminal (ExamineModal); the small box on the page stops turning on a drag, so the page can never move under a finger | smallest; reuses the screen he named |
| B | Keep the small box turnable AND add a fullscreen button | the page-moving can still happen on the small box |

**Decision (19:13):** *"i cant press the back button on option B but well A is better but add the view in fullscreen button"* -> A + a "View in fullscreen" button BUILT (kpm commit "Master Vault: description box back + the 3D box opens the fullscreen viewer"), walk 9/9 (`walk-vault3d.mjs`). His B back-button problem was my test page only (the box layer covered the X). Before that he asked to see it (*"can u show it to me so that i can decide"*): a live test page with A / B switch + the new description box, https://claude.ai/artifact/TkUxdM1xB19rqJ3WnHnZ8k (source `Raw/2026-10-10-master-vault-3d/vault-3d-test.html`).
