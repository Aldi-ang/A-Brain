// node seed.mjs <invite|audit|customer|eod>  - LOCAL demo emulator only (127.0.0.1:8080, project kpm-demo-f4d74), never live.
// Writes the one record a count badge needs, so the badge can be watched arriving on the real screen.
import { createRequire } from 'node:module';
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
const require = createRequire(REPO + 'package.json');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { APP_ID, OWNER_UID } = await import('file:///' + REPO + 'api/_demoCompany.js');
if (!getApps().length) initializeApp({ projectId: 'kpm-demo-f4d74' });
const db = getFirestore();
const home = `artifacts/${APP_ID}/users/${OWNER_UID}`;
const what = process.argv[2];
if (what === 'invite') {
  await db.doc('demo_invites/walker@gmail.com').set({ email: 'walker@gmail.com', addedAt: Timestamp.now(), addedBy: 'test' });
} else if (what === 'audit') {
  const inv = (await db.collection(`${home}/inventory`).limit(2).get()).docs;
  const ref = await db.collection(`${home}/pending_audits`).add({
    agentId: 'VAULT', agentName: 'Test count', auditType: 'BRANCH_WAREHOUSE', branchLocation: 'BANDUNG', timestamp: Timestamp.now(), status: 'PENDING_HQ_APPROVAL',
    items: inv.map((d) => ({ productId: d.id, name: d.data().name || 'Item', expectedStock: 10, expectedDamagedStock: 0, goodCount: 9, damagedCount: 0, variance: -1,
      varianceReason: 'test', countPasses: [{ good: 9, damaged: 0 }], countedTwice: true, threeWayDisagreement: false })) });
  console.log('audit', ref.id);
} else if (what === 'customer') {
  const c = (await db.collection(`${home}/customers`).limit(1).get()).docs[0];
  await db.doc(`${home}/customers/test-pending-1`).set({ ...c.data(), name: 'Toko Uji Pending', status: 'PENDING' });
  console.log('customer from', c.id);
}
const n = async (p) => (await db.collection(p).count().get()).data().count;
console.log({ what, pendingAudits: await n(`${home}/pending_audits`), customers: await n(`${home}/customers`),
  eodPending: (await db.collection(`${home}/eod_reports`).where('status', '==', 'PENDING').count().get()).data().count });
process.exit(0);
