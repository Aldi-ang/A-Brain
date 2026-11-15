document.querySelector('[data-mark="dashboard"]')?.click();
await new Promise((r) => setTimeout(r, 2500));
return { journeyOpen: !!document.querySelector('.kx-feed') };
