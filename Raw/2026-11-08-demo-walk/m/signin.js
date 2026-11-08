await wait(() => window.__kpmEmulatorAuth); const { auth, credential, signIn } = window.__kpmEmulatorAuth; await auth.signOut();
await signIn(auth, credential(JSON.stringify({ sub: 'g-walker2', email: 'walker@gmail.com', email_verified: true })));
setTimeout(() => location.reload(), 100); return 'signed in';
