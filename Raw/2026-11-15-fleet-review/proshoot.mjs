/* shoot the professional direction mock (pro.html) - one png per screen; old pngs deleted first, mtime printed */
import { rmSync, statSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = pathToFileURL(DIR + 'pro.html').href;
for (const [s, w, h, dpr] of [['pc', 1280, 800, 1], ['p1', 390, 844, 2], ['p2', 390, 844, 2]]) {
    const out = `${DIR}pro-${s}.png`; rmSync(out, { force: true });
    try {
        execFileSync(CHROME, ['--headless=new', '--hide-scrollbars', `--user-data-dir=${DIR}prof-pro`, `--force-device-scale-factor=${dpr}`,
            `--window-size=${w},${h}`, `--screenshot=${out}`, `${url}#${s}`], { stdio: 'ignore', timeout: 30000 });
    } catch { /* chrome exits non-zero on some builds after writing */ }
    console.log(s, existsSync(out) ? statSync(out).mtime.toTimeString().slice(0, 8) : 'NOT WRITTEN');
}
