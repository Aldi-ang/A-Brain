// A 2× inspection strip of the DIFFERENCE plate in the four frames — for reading, not for him.
import { frame, page } from './shoot.mjs';
const [x, y, w, h] = [262, 480, 226, 68];
const L = { today: 'TODAY', 'nx-a': 'A (recommended) - the bezel', 'nx-b': 'B - daylight glass', 'nx-c': 'C - the odometer' }; page('zoom', ['today', 'nx-a', 'nx-b', 'nx-c'].map((n) => frame(`${n}.png`, x, y, w, h, `<b>${L[n]}</b>`, 2)), (w * 2 + 24) * 4 + 24, h * 2 + 24 * 2 + 40, 40);
