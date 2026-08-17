# SWEEP — the sales terminal (Merchant Sales + the sale engine)

16 confirmed problems in `src/MerchantSalesView.jsx` and `src/hooks/useTransactionEngine.js`.
This is the screen agents touch most, so it carries the most.

Ranked. Severity is the corrected one.

---

## 1. 🔴 HIGHEST — Fulfilling an IOU turns the whole basket into Cash

**Where:** `src/MerchantSalesView.jsx:930`

**In plain English:** if a store has a pending IOU (goods you owe them) and the agent presses
Fulfill, the code decides *the entire sale is now a Cash sale* — even if the agent then adds
Rp 3.000.000 of goods and picks Titip (consignment).

**What happens:** the sale is saved as `paymentType: 'Cash'`. Every screen that lists debt
looks for `Titip`. So the Rp 3.000.000 the store owes you **does not exist anywhere in the
system** — not on the debt list, not on the WANTED poster, not in the store's balance. And the
printed nota says "IOU Fulfillment", so the store has no paper record of the debt either.
You have given away three million rupiah of stock with no trace on either side.

**Smallest fix:** the code says `cart.some(...)` — "if *any* line is an IOU". It should say
`cart.every(...)` — "only if *every* line is an IOU". One word. The receipt label at `:917`
needs the same change.

---

## 2. 🔴 HIGHEST — A buyback pays the store but never puts the goods back in the van

**Where:** `src/hooks/useTransactionEngine.js:163`

**In plain English:** Retur Mode → Buyback (Refund) with the condition left on the default
"Good (Resellable)". The company pays the store. Nothing anywhere adds those packs back to
stock.

**What happens:** 50 packs of Surya come back into the van and the system still thinks the van
has 50 fewer. At EOD the agent counts 50 more packs than the app expects — which reads as
miscounting, or as theft. The only path that credits returned goods reads a list built *only*
from items marked DAMAGED, and Buyback leaves the condition on GOOD.

**Smallest fix:** in the stock loop, when the transaction type is `RETUR` and the line's
condition is GOOD, add the packs back instead of skipping the write. DAMAGED lines keep going
to quarantine as they do now.

---

## 3. 🔴 HIGH — A failure *after* the sale is saved tells the agent it failed, so he sells it twice

**Where:** `src/MerchantSalesView.jsx:1193`

**In plain English:** the sale is committed to the database first. *Then* the code writes the
IOU record and the notification. If either of those two later steps fails, the error message
shown is "Transaction Failed! Please try again."

**What happens:** the sale is already saved. The cart, the customer, the photo — all still on
screen, because the clear-the-screen step never ran. The agent presses MAKE DEAL again. The
customer is billed twice and the van is deducted twice.

**Smallest fix:** set a flag the instant the sale commits. In the error handler, if that flag
is set, say "Sale saved, but the IOU record failed" and clear the screen anyway — instead of
claiming the sale failed.

---

## 4. 🟠 HIGH — A buyback is recorded as *profit* equal to the full value of the goods

**Where:** `src/hooks/useTransactionEngine.js:180`

**In plain English:** when goods come back, the money going out is stored as a positive
number, and the cost side is multiplied by zero.

**What happens:** buy back Rp 1.000.000 of stock and "Net Profit (Cuan)" goes **up** by
Rp 1.000.000. The screen prints the figure as negative, so it looks right — only the stored
number is wrong, and the stored number is what every report adds up.

**Smallest fix:** make both the total and the profit negative when the type is `RETUR`, before
saving. The consignment-return path already does exactly this.

---

## 5. 🟠 HIGH — A buyback never reduces what the store owes, because of one missing letter

**Where:** `src/MerchantSalesView.jsx:928`

**In plain English:** the sales terminal saves a buyback as type **`RETUR`**. Every screen
that reduces a store's debt looks for type **`RETURN`**. Different word, no match.

**What happens:** a store owes Rp 800.000 on Titip and hands back Rp 300.000 of goods. The
debt stays at Rp 800.000. The red "Jatuh Tempo" (overdue) banner keeps firing. You chase the
store for money it already settled in goods.

**Smallest fix:** write `RETURN` instead of `RETUR` — or widen the four readers to accept
both. One place versus four; changing the writer is smaller. **See also item 16 — the two
spellings cause a second problem elsewhere, so fix them together.**

---

## 6. 🟠 HIGH — A sale to a new customer gets "(Retail)" welded onto the name forever

**Where:** `src/hooks/useTransactionEngine.js:331`

**In plain English:** if the typed store is not in the customer book yet, the code adds the
price tier to the end of the name before saving: `WARUNG BU SARI` becomes
`Warung Bu Sari (Retail)`.

**What happens:** next visit the agent types `WARUNG BU SARI`. The app compares names exactly,
so it never matches. The Rp 500.000 debt, the last order and the visit history are all
invisible — the panel says "No order in the last 7 days". For a store registered through the
NOO modal it is worse: the customer record itself is *created* with the suffix, permanently.

**Smallest fix:** stop adding the suffix — the tier is already stored on every cart line.
Better: save the customer's ID on the transaction and match on that instead of the name.

---

## 7. 🟠 HIGH — The customer lookup matches on *part* of a name

**Where:** `src/hooks/useTransactionEngine.js:329`

**In plain English:** the engine finds a customer if the typed text appears *anywhere* inside
a stored name.

**What happens:** the agent types `SARI` for a walk-in. The book contains
`WARUNG SARI RASA`. The sale — and its Rp 2.000.000 Titip debt — is recorded against a store
that never bought anything. It then shows up in that store's debt banner and its tier
promotion.

**Note:** the sales screen itself is careful about this and only auto-picks on an exact match,
with a comment about three shops sharing a name. The engine then redoes the lookup loosely and
overrides that care.

**Smallest fix:** exact match only, the same rule the picker already uses at
`MerchantSalesView.jsx:531`.

---

## 8. 🟠 HIGH — Tier promotion measures volume with made-up pack sizes

**Where:** `src/MerchantSalesView.jsx:1078` (and `:1096`)

**In plain English:** to decide if a store has earned a better price tier, the code converts
everything to packs using fixed numbers: Slop = 10, Bal = 200, Karton = 800. Your real pack
sizes are set per product, on the product form.

**What happens:** for a product packed 12 per Slop and 25 Slop per Bal (real: 300 packs a Bal),
5 Bal of history counts as 1.000 packs instead of 1.500. A target of 1.200 fails to fire, the
store keeps its old tier — and that tier gets written back onto the customer record, which is
what locks the price on every future visit. The store is charged the wrong price forever, with
no visible cause.

**Smallest fix:** use `convertToBks()` from `src/utils/helpers.js:97` in both loops. It already
reads the real pack sizes.

---

## 9. 🟡 MEDIUM — An exchange IOU for a walk-in is thrown in the bin

**Where:** `src/MerchantSalesView.jsx:977`

**In plain English:** the IOU is built for every exchange line, but it is only *saved* if a
store was picked from the list. Typing the store name by hand clears that selection on every
keystroke.

**What happens:** the agent does an exchange for 3 Slop of water-damaged stock he cannot
replace today and marks it IOU. Total is Rp 0, the sale commits. The store has handed over 30
packs and the company owes 30 packs **that exist in no document at all**.

**Smallest fix:** if an IOU was generated and no registered store is selected, block the
submit with a message saying an IOU needs a registered outlet.

---

## 10. 🟡 MEDIUM — Losing GPS makes the location fence disappear instead of blocking the sale

**Where:** `src/MerchantSalesView.jsx:1428`

**In plain English:** the sale is only restricted for one specific GPS state
(`manual_override`). If the agent denies the location prompt or turns location off, the state
becomes `error` — which is not in the restricted list.

**What happens:** the screen says "GPS Signal Lost" and MAKE DEAL stays fully enabled. The sale
saves with location 0,0. Denying permission is easier than standing within 50 metres of the
shop, so the fence is optional for anyone who notices.

**Second half:** once GPS reads "verified" it is never checked again. A fix taken at the shop
still reads verified after driving away.

**Smallest fix:** treat `error` as restricted too, and re-check the location when the last fix
is over a minute old.

---

## 11. 🟡 MEDIUM — The printed nota prices the whole catalogue at the wrong tier

**Where:** `src/MerchantSalesView.jsx:2891`

**In plain English:** the price column on the A4 nota is chosen from the **first line in the
cart**. Fulfilling an IOU adds a line hardcoded to Retail, and the IOU banner sits at the top,
so fulfilling first is the natural order.

**What happens:** a Grosir store gets a nota headed "Tipe Harga: RETAIL" with retail prices in
every row, while the GRAND TOTAL at the bottom is the real Grosir total. The customer's own
paperwork shows unit prices that do not multiply out to what they were charged.

**Smallest fix:** pick the tier from the first line that is **not** an IOU fulfilment, falling
back to the store's locked tier.

---

## 12. 🟡 MEDIUM — The "not enough stock" check compares Karton against packs

**Where:** `src/MerchantSalesView.jsx:653` (also `:591`, `:687`, `:1438`)

**In plain English:** the van's stock number is in packs. The quantity typed is in whatever
unit the line is set to. The check compares them directly.

**What happens:** with 3 packs of Surya on the van, typing 5 in a **Karton** line clamps to
"You only have 3 units" and puts **3 Karton — 2.400 packs** in the manifest, priced as 2.400
packs. The button goes green. The sale is only refused later by the engine, as a raw error
message, in front of the customer.

**Also:** the check only runs when the quantity changes. Changing the *unit* runs no check at
all.

**Smallest fix:** convert to packs before comparing, in all four guards. `convertToBks` is
already imported in this file.

---

## 13. 🟡 MEDIUM — The receipt invents a pack size for any product not in the current list

**Where:** `src/MerchantSalesView.jsx:2921`

**In plain English:** if the product is missing from the on-screen inventory, the receipt falls
back to "multiply by 10" for every unit that is not packs.

**What happens:** 2 Karton (really 1.600 packs) prints as QTY 20 with a per-pack price 80×
too high. The line total is correct, so the row does not multiply out. This happens more often
than "discontinued product" suggests — the list it checks against is already filtered by the
search box, so an ordinary product can simply be absent.

**Smallest fix:** use `convertToBks()` with the pack sizes stored on the saved line, or leave
the row out rather than print an invented quantity.

---

## 14. 🟡 MEDIUM — A GPS refresh can pick a customer for you and re-price the open basket

**Where:** `src/MerchantSalesView.jsx:287`

**In plain English:** if no store is chosen, the app re-checks GPS and silently selects
whatever store is nearest within 50 metres. Selecting a store re-prices every line already in
the cart to that store's tier.

**What happens:** standing between two shops in a pasar with a 12-line basket priced at
Retail, a fresh satellite fix that lands 3 metres closer to the Grosir shop next door
re-prices the whole basket to Grosir and stamps that store's name on the sale. No
confirmation.

**Smallest fix:** only auto-select when the cart is empty. Otherwise show the nearby stores and
let the agent tap one.

---

## 15. 🟢 LOW — Tier promotion hides every error

**Where:** `src/MerchantSalesView.jsx:1142`

**In plain English:** the whole promote-the-store block is wrapped in a catch that only writes
to the developer console.

**What happens:** if the write is refused, the sale still reports success, and the store keeps
its old tier — the tier that locks its prices on every future visit. `lastVisit` is not saved
either, so the revisit banners go stale.

**Smallest fix:** show a message in the catch. (One sub-claim in the original report was wrong:
the on-screen visit record is *not* faked — that line runs after the save, so it is skipped
when the save fails.)

---

## 16. 🟢 LOW — Two spellings of "return" split your ledger into two different totals

**Where:** `src/hooks/useTransactionEngine.js:485` and `:499` write `RETURN`;
`src/MerchantSalesView.jsx:928` writes `RETUR`

**In plain English:** two parts of the app save the same kind of transaction under two
different words, and different screens look for different words.

**What happens:** Rp 3.000.000 of Retur/BS in a week — the History report shows revenue *net*
of it, the Dashboard shows revenue *gross* of it. Two headline numbers, Rp 3.000.000 apart, no
explanation on either screen. The Agent Inventory screen has the mirror-image gap.

**Smallest fix:** pick one word, write it from both engines, and change every reader of the
other spelling in the same commit. **Do this together with item 5.**
