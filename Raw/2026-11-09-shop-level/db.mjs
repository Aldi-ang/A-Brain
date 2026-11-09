// node db.mjs <rules-on|rules-off|reset NAME|show NAME> - LOCAL demo emulator only (127.0.0.1:8080), never live.
// rules-on: the owner's level targets (Settings > Tier Automation Rules shape); reset: a shop back to Unranked, last visit long ago.
import { createRequire } from 'node:module';
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
const require = createRequire(REPO + 'package.json');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { APP_ID, OWNER_UID } = await import('file:///' + REPO + 'api/_demoCompany.js');
if (!getApps().length) initializeApp({ projectId: 'kpm-demo-f4d74' });
const db = getFirestore(), home = `artifacts/${APP_ID}/users/${OWNER_UID}`;
const [cmd, ...rest] = process.argv.slice(2); const name = rest.join(' ');
const shopByName = async () => (await db.collection(`${home}/customers`).get()).docs.find((d) => String(d.data().name).trim().toLowerCase() === name.trim().toLowerCase());
if (cmd === 'rules-on') {
  await db.doc(`${home}/appSettings/tierRules`).set({ rules: {
    Mythic: { type: 'omset', omsetTarget: 50000000, volumeUnit: 'Bal', volumeTarget: 0, timeframe: '90' },
    Epic: { type: 'omset', omsetTarget: 20000000, volumeUnit: 'Bal', volumeTarget: 0, timeframe: '90' },
    Grandmaster: { type: 'volume', omsetTarget: 0, volumeUnit: 'Bal', volumeTarget: 50, timeframe: '30' },
    Bronze: { type: 'omset', omsetTarget: 50000, volumeUnit: 'Bal', volumeTarget: 0, timeframe: '90' },
    Unranked: { type: 'omset', omsetTarget: 0, volumeUnit: 'Bal', volumeTarget: 0, timeframe: '90' },
  } });
  console.log('rules on');
} else if (cmd === 'rules-off') {
  await db.doc(`${home}/appSettings/tierRules`).delete(); console.log('rules off');
} else if (cmd === 'reset' || cmd === 'show') {
  const d = await shopByName(); if (!d) { console.log('no shop', name); process.exit(1); }
  if (cmd === 'reset') await d.ref.update({ tier: 'Unranked', lastVisit: '2026-01-01', lastVisitedBy: 'nobody' });
  const s = (await d.ref.get()).data();
  const sales = (await db.collection(`${home}/transactions`).where('customerName', '==', s.name).get()).docs.map((x) => x.data());
  console.log(JSON.stringify({ id: d.id, name: s.name, tier: s.tier, priceTier: s.priceTier, lastVisit: s.lastVisit, lastVisitedBy: s.lastVisitedBy,
    sales: sales.length, total90: sales.filter((t) => (t.timestamp?.seconds || 0) * 1000 > Date.now() - 90 * 864e5 && String(t.type || 'SALE') === 'SALE').reduce((a, t) => a + (Number(t.total) || 0), 0) }));
}
process.exit(0);
