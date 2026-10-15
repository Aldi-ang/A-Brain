/* Stop hook: upload A-Brain to its private GitHub repo when it holds commits GitHub lacks.
 *
 * Aldi's call, 2026-10-14: "github should be updated at the end of every session". A cloud
 * session reads A-Brain from GitHub, so a note that lives only on the PC is invisible there.
 * Vault commits happen when a session closes its work, so "has commits GitHub lacks" is the end
 * of a session in practice; Stop is used because a cloud VM can vanish without a SessionEnd.
 *
 * Quiet when there is nothing to upload. Uploads nothing unless an anonymous request to GitHub
 * answers 404 (= the repo is private): both repos were public until 2026-10-14.
 * Never opens a sign-in window (GCM_INTERACTIVE=never): a missing login fails fast and says so.
 * ponytail: no auto-merge - if GitHub has commits this copy lacks, it reports and stops.
 */
import { execFileSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = dirname(dirname(fileURLToPath(import.meta.url)));
const git = (...args) => execFileSync('git', ['-C', VAULT, ...args], {
  encoding: 'utf8', timeout: 60000, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' },
}).trim();
const tell = (msg) => {
  console.log(JSON.stringify({ systemMessage: `A-Brain upload: ${msg}` }));
  process.exit(0);
};

let ahead = 0;
try { ahead = Number(git('rev-list', '--count', '@{u}..HEAD')); } catch { process.exit(0); }
if (!ahead) process.exit(0);

let status = 0;
try {
  status = (await fetch('https://api.github.com/repos/Aldi-ang/A-Brain', { signal: AbortSignal.timeout(10000) })).status;
} catch { /* offline: status stays 0 */ }
if (status !== 404)
  tell(`NOT uploaded - GitHub did not confirm the repo is private (answered ${status || 'nothing'}). ${ahead} commit(s) wait on this machine.`);

try { git('push', '-q', 'origin', 'HEAD'); }
catch (e) {
  tell(`FAILED (${String(e.stderr || e.message).trim().replace(/\s*\n\s*/g, ' / ').slice(0, 200)}). ${ahead} commit(s) wait on this machine.`);
}
tell(`${ahead} commit(s) uploaded.`);
