// node heredoc-gate.test.mjs - feeds Bash commands to the gate the way Claude Code does (stdin JSON) and checks
// the exit code: 2 = blocked, 0 = let through. Case 1 is the 2026-10-19 hole: an escaped \" inside the code
// ended the old match early, so the backtick after it was never seen.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const gate = fileURLToPath(new URL('./heredoc-gate.mjs', import.meta.url));
const BT = '`';
const run = (command) => spawnSync(process.execPath, [gate], { input: JSON.stringify({ tool_name: 'Bash', tool_input: { command } }), encoding: 'utf8' }).status;
const CASES = [
  ['block', 'escaped quote first, backtick after (the 2026-10-19 hole)', 'node -e "const r=(a,b)=>s.replace(a,b);\nr(\\"x\\", \\"y\\");\nawait ev(' + BT + 'addEventListener(1)' + BT + ')"'],
  ['block', 'escaped quote first, ${ after', 'node -e "r(\\"a\\");\nconsole.log(\\"${w}x${h}\\")"'],
  ['block', 'plain backtick in double quotes', 'node -e "console.log(' + BT + 'hi' + BT + ')"'],
  ['block', 'backtick in single quotes', "node -e 'console.log(" + BT + "x" + BT + ")'"],
  ['block', 'node -p with a backtick', 'node -p "' + BT + 'a' + BT + '"'],
  ['pass', 'plain inline script', 'node -e "console.log(1)"'],
  ['pass', 'escaped quotes, no backtick', 'node -e "require(\\"fs\\").readFileSync(\\"a\\")"'],
  ['pass', 'a script file', 'node .claude/presentation/tests/pc-drag.mjs "$U" "$S" 390 844'],
];
let fails = 0;
for (const [want, name, cmd] of CASES) {
  const got = run(cmd) === 2 ? 'block' : 'pass';
  if (got !== want) fails++;
  console.log(`${got === want ? 'PASS' : 'FAIL'} ${name}: wanted ${want}, got ${got}`);
}
console.log(`${CASES.length - fails}/${CASES.length}`);
process.exit(fails ? 1 : 0);
