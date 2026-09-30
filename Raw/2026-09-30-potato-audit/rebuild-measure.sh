#!/bin/sh
# Rebuild the production+emulator build, restart its preview, then run the harness with the given env (e.g. FRAMES=after
# or ABLATE=1 QUICK=1). The emulator must already be running. Usage: sh rebuild-measure.sh "FRAMES=after" [nobuild]
S="C:/Users/ASUS/AppData/Local/Temp/claude/D--APP-DEVELOPMENT-kpm-inventory-main-FILES-kpm-inventory-main/1605fa45-07c0-453b-aad6-f00bd33c7499/scratchpad"
R="D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main"
if [ "$2" != "nobuild" ]; then
  for p in $(netstat -ano | grep -E ":4175 .*LISTENING" | awk '{print $5}' | sort -u); do taskkill //PID $p //F >/dev/null 2>&1; done
  cd "$R" && npx vite build --mode httpdev --config "$S/prod-emu.config.mjs" 2>&1 | grep -iE "error|built in" | head -3
  (npx vite preview --mode httpdev --config "$S/prod-emu.config.mjs" > "$TEMP/prev4175.log" 2>&1 &)
  until curl -s -o /dev/null http://localhost:4175/; do sleep 1; done
fi
cd "$R" && node tools/seed-emulator.mjs > /dev/null
cd "$S" && env $1 node potato-audit.mjs 2>&1 | grep -E "ablate|frames|gate|written|rror" | tail -20
