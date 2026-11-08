const el = document.elementFromPoint(XX, YY);
return { before: cap(), pressing: (el?.getAttribute('aria-label') || el?.innerText || el?.className || '').toString().trim().slice(0, 60), tap: [XX, YY], after: 1500 };
