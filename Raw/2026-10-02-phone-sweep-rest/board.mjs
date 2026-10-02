// board.html -> board-phone-sweep.png (old png deleted first, so a no-op cannot pass as a new board)
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const NAME = process.argv[3] || 'board'; const png = path.join(HERE, NAME === 'board' ? 'board-phone-sweep.png' : NAME + '.png'); fs.rmSync(png, { force: true });
execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--hide-scrollbars', '--allow-file-access-from-files',
  '--user-data-dir=' + path.join(HERE, 'sheets', 'prof'), '--screenshot=' + png, '--window-size=' + (process.argv[4] || 1440) + ',' + (process.argv[2] || 1900),
  'file:///' + path.join(HERE, NAME + '.html').split(path.sep).join('/')], { stdio: 'ignore' });
console.log(fs.existsSync(png) ? 'board ' + fs.statSync(png).size + ' ' + fs.statSync(png).mtime.toISOString() : 'NO BOARD');
