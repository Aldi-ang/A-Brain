---
date: 2026-10-20
status: DONE 2026-10-20 (kpm a2bf766, not pushed)
---
# Sales terminal: no pack count on the card; WhatsApp box asks for a number

## The problem, in his words
> *"i found bug, as u can see agent inventory detected 16 mrapi cigarette but on the sales terminal there is no information regarding its quantity, looks like i can make some sales here, and on sc4 i want the whatsapp number to be autofilled if there is data about the store whatsapp number in the customer directory this way the salesman doesnt have to ask and filled the whatsapp number of the store owner everytime"*

He also confirmed the salesman test from 2026-10-19: *"i checked that agent inventory for the mmrapi is deducted here and i can see the receipt on the history as well"*.

## What the code does (read 2026-10-20)
1. **Count on the card** - removed ON PURPOSE in kpm `a181c9a` (2026-08-05, a session's call, no quote of his): "a bare 9.892 Bks is four words of noise". The card keeps only EMPTY / LOW (`src/MerchantSalesView.jsx` ~2480-2495). The count moved to the side "Examine" rail (`~2608`, Karton/Bal/Slop/Bks split), which exists only at screen width 1280 px and up (`hidden xl:flex`) and only after the picture is pressed. Below 1280 px the terminal shows no count anywhere. His report reverses the 2026-08-05 call: he wants the number where he looks.
2. **WhatsApp box** - `src/components/shareReceipt.js:9` already skips the box and opens the shop's chat straight away when the shop has a phone saved (`waNumber(shop.phone)`, Customer Directory field "Phone"). The box only shows when no usable number is saved; after a typed number it offers to save it on the shop. So for TEST 2 either (a) no phone is saved [likely], or (b) the terminal used an older copy of the shop: the picked shop is restored from a saved draft (`useState(draft?.selectedCustomerInfo)`, ~line 217), so a number added to the directory after the shop was picked is not in that copy [guessing].
3. **Seen in passing** - the card always shows the Ecer price (`item.priceEcer`, ~2498, label "Ecer Price"), even after a shop that pays Retail is picked; his TEST 2 receipt charged 9.000 while the card said 10 rb.

## Options for the count
| Option | What the card shows | Cost |
|---|---|---|
| A (recommended) | "16 Bks left" chip where EMPTY/LOW already sit | small; same unit as Agent Inventory ("16 Bks") and the receipt ("1 Bks x 9.000") |
| B | "1 Slop 6 Bks" chip (the rail's split) | small; longer text, can crowd the phone card row on big numbers |
| C | keep the card clean, show the Examine rail from 1024 px | does not help the phone at all |

Shown to him as three drawn cards (Today / A / B), A marked.

## Decision
His answers, 2026-10-20 07:40: *"B is better"* · *"yes there is phone number data on the customer directory for test 2, but no worries it was random phone number make sure that from now on the number and data is well stored and immune to any updates in the future this is a must"* · *"the price shown on the card should be depending on the stores type that we are selling on"*.
Built in kpm `a2bf766`: card chip "1 Slop 6 Bks" (LOW keeps amber with the count inside), card price = the picked shop's tier, a number WhatsApp cannot open is refused on save (directory + terminal new-outlet form) and shown in the receipt box to fix, and a check fails if any write ever replaces a whole shop document. The cause for TEST 2 was the random number itself (WhatsApp cannot open it), not a stale copy.

## Rejected on purpose
- Hiding the count again behind a press or a hover: he did not find it there, which is the bug.

Models applied: Chesterton's Fence (read why a181c9a removed the count before proposing it back), Inversion (what would make the WhatsApp box appear even with a number saved -> the stale draft copy).
