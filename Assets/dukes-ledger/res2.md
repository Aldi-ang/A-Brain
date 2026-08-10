# RE4 Remake Merchant

**1) Quantity Selection:**
- On item hover/select, R1/RB prompt appears bottom-right
- Press R1 → quantity slider appears center-screen as overlay modal
- Slider shows: current value (large center number), min/max range, total cost updates live below
- D-pad left/right or analog for single increments, L2/R2 for +/-10 jumps
- Confirm with X/A, cancel with O/B

**2) Feedback:**
- **Add to cart**: None. Items go direct to transaction.
- **Buy confirm**: Ka-ching register sound (~0.3s), peseta count ticks down animated (~0.5s), item quantity updates, brief white flash on merchant's face
- **Sell confirm**: Lower-pitched coin clink (~0.2s), peseta count ticks up, item removed with quick fade

**3) Merchant Framing:**
- Merchant occupies left third of screen, chest-up, slight low angle
- Item grid right side, 4-5 columns depending on category
- Merchant animated idle, reacts to purchases with nods/smiles
- Camera static, merchant in 3D space behind UI plane

**4) N/A - RE4 has tech grid UI, not paper**

**5) Satisfaction Mechanics:**
- **Quantity slider with large jumps**: R2/L2 prevents tedious single-increment hell
- **Immediate transaction**: No cart, no checkout step. Select amount → confirm → done.
- **Peseta counter animation**: Visual reward, number go up dopamine
- **Merchant reactivity**: Character responds makes it social, not menu
- **No load/transition**: Shop is pause-menu instant, zero friction

**6) Phone Problems:**
- **Quantity slider needs precision**: Fat thumbs on small slider = misery
- **Simultaneous display**: Grid + merchant + currency + controls = too dense for portrait
- **R2/L2 quick-jump**: No phone equivalent for shoulder buttons' +10 speed
- **Hover-then-prompt**: Touch is tap-or-nothing, no hover state for R1 prompt discovery

---

# RE Village Duke Shop

**1) Quantity Selection:**
- Select item → if stackable, numpad overlay appears center-screen
- Shows item icon top, large quantity number, Max button, running total below
- +/- buttons flanking number, or direct numpad input on PC
- Max button instantly caps to affordable quantity
- Confirm with Accept button in overlay

**2) Feedback:**
- **Add to cart**: Checkmark appears, soft paper-rustle sound (~0.2s), item moves to left ledger with ink-scratch animation (~0.4s)
- **Buy (checkout)**: Heavier coin-pour sound (~0.6s), Duke chuckles/comments, lei total animates down, ledger items flash gold then disappear (~0.8s total)
- **Sell confirm**: Coin clink, lei up-tick, item gone

**3) Duke Framing:**
- Duke center-right, seated, fills right 40% of screen
- Shop ledger (item list) is left-side vertical parchment overlay
- Available items grid below ledger, bottom-left
- Duke behind glass partition, shallow depth-of-field, he's in soft focus when browsing

**4) Duke Ledger Treatment:**
- **Paper**: Aged parchment texture, torn/burned edges, scrolls vertically
- **Typography**: Serif font, handwritten style but readable, ~14pt equivalent
- **Borders**: Ornate corner flourishes, bloodstain accents
- **Running total**: "Total: [X] Lei" bottom of ledger in bold, updates live with ink-spread effect when items added
- **Item entries**: Icon left, name center, quantity × price right-aligned, separated by decorative rule lines
- **Checkout button**: Wax seal graphic at ledger bottom

**5) Satisfaction Mechanics:**
- **Max button**: One tap to buy all affordable, eliminates math and tedium
- **Live total on ledger**: Always visible, no surprise at checkout
- **Checkmark + ink animation**: Tangible "added to order" proof, not just list update
- **Cart system with batch confirm**: Browse freely, commit once, reduces decision fatigue
- **Duke's commentary**: Contextual voice lines on big purchases, variable responses prevent repetition

**6) Phone Problems:**
- **Dual-zone layout**: Ledger left + grid bottom-left + Duke right = impossible in portrait, landscape loses vertical space for scrolling
- **Numpad overlay**: Works okay, but Max button would need large touch target
- **Fine detail on parchment**: Ornate borders and small serif type unreadable at phone scale
- **Running total visibility**: In portrait, would need sticky header or lose it when scrolling grid
- **Grid + ledger simultaneity**: Can't see both without pan/zoom gymnastics, breaks "shopping list" mental model