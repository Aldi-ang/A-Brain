await wait(() => window.__kpmEmulatorAuth); const { auth, credential, signIn } = window.__kpmEmulatorAuth; await auth.signOut();
const u = await signIn(auth, credential(JSON.stringify({ sub: 'g-WHO', email: 'WHO@example.com', email_verified: true })));
setTimeout(() => location.reload(), 100); return { uid: u.user.uid };
