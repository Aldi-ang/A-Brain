---
title: Pita Cukai Switch
description: The company switch that turns the pita cukai (excise stamp) return at EOD on or off - what OFF changes, why nothing is deleted, how the counting flow drops its stamp card.
type: entity
created: 2026-11-03
updated: 2026-11-03
confidence: high
checked: 2026-11-03
tags: [kpm, eod, pita-cukai, settings, sampling]
---

# Pita Cukai Switch

His words: 2026-10-25 answer "4a", and 2026-11-03 *"make the toggle button to turn on/off the pita cukai on EOD because
not all company want the pita cukai back and they just giveaway sampling with all the pita cukai attached on them"*.
Built kpm `1a50c03` (it had been dropped from the promo build - a miss, owed for 9 days).

**Where:** Settings > "Lost pita cukai fine" (Tier 1): "Collected at EOD" | "Off". Saved to `settings/general` as
`cukaiReturn`; missing = ON (how it always worked). One writer behind both buttons, and it reports.

**OFF changes four places:** the sampling transaction opens no stamp debt (MerchantSalesView) and its "collect the Pita
Cukai" warning is hidden; EOD expects 0 stamps, the counting flow shows 3 cards instead of 4 and writes no CUKAI report,
the old stamp card is hidden (EODReconciliationView); the van view drops "Cukai Due" (AgentInventoryView).

**Reversible on purpose:** nothing is deleted. Stamps already owed stay in `cukaiDebts` and count again when ON. The
same map holds bounties (`PENALTY_*`, rupiah) - the switch never touches those.

**How the card drops:** `eodRecord.skipCards()` signs the skipped card off at 0 with nothing expected, so canSend /
restoreDraft / canApproveLetter, which all walk the four cards, stay unchanged; the deck and the letter take the shown
list (`ids`). Cheaper and safer than threading a variable card list through the approval rules.

**Known effect (told him):** with OFF every night earns the "clean pita cukai" XP, like a night with no samples today.

Proof: A-Brain `Raw/2026-11-03-pita-cukai-switch/`. Related: [[EOD Per-Part Verification]], [[The Player Card]].
