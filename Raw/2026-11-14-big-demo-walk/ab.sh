#!/usr/bin/env bash
# small vs big: the same first-time visitor (storage wiped), the same person (T4 lands on its own vault gate), the same
# phone; only the company differs. Prints the reset line and the gate time for each. bash ab.sh
KPM="D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main"
HERE="D:/APP DEVELOPMENT/kpm inventory main FILES/A-Brain/Raw/2026-11-14-big-demo-walk"
for size in small big; do
  flag=""; [ "$size" = "small" ] && flag="--small"
  (cd "$KPM" && node tools/demo-reset-emulator.mjs $flag 2>&1 | grep -E "reset 1:|passed")
  for run in 1 2; do
    (cd "$HERE" && node clear.mjs && sleep 6 && timeout 150 node walk.mjs 40 --gate-only --tier=T4 --tag=ab-$size-$run 2>&1 | grep -E "vault gate|STUCK|NO PAGE" | sed "s/^/  $size run $run: /")
  done
done
