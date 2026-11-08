// node whois.mjs <docId> - which collection under the demo owner holds this id (LOCAL emulator only)
import { createRequire } from 'node:module';
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
const require = createRequire(REPO + 'package.json');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { APP_ID, OWNER_UID } = await import('file:///' + REPO + 'api/_demoCompany.js');
if (!getApps().length) initializeApp({ projectId: 'kpm-demo-f4d74' });
const db = getFirestore(); const id = process.argv[2];
const roots = [db.doc(`artifacts/${APP_ID}/users/${OWNER_UID}`), db.doc(`artifacts/${APP_ID}`)];
for (const r of roots) for (const c of await r.listCollections()) { const d = await c.doc(id).get(); if (d.exists) console.log('FOUND', c.path, JSON.stringify(d.data()).slice(0, 400)); }
console.log('done'); process.exit(0);
