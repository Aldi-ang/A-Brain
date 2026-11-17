/* lab only: give the demo company a Master Vault background picture (a product photo) so the stage can be judged.
   node set-bg.mjs        -> sets it;   node set-bg.mjs off -> clears it */
import { readFileSync } from 'node:fs';
const root = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main';
const { APP_ID, OWNER_UID } = await import('file:///' + root + '/api/_demoCompany.js');
const seed = JSON.parse(readFileSync(root + '/demo/seed.json', 'utf8'));
const pic = process.argv[2] === 'off' ? '' : seed.inventory[2].images.front;
const url = `http://127.0.0.1:8080/v1/projects/kpm-demo-f4d74/databases/(default)/documents/artifacts/${APP_ID}/users/${OWNER_UID}/settings/general?updateMask.fieldPaths=inventoryBg`;
const r = await fetch(url, { method: 'PATCH', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { inventoryBg: { stringValue: pic } } }) });
console.log(r.status);
