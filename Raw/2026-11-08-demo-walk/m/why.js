const t = document.body.innerText; const i = t.search(/gagal|ditolak|denied|alasan/i);
const lines = t.split('\n').filter((l) => /gagal|ditolak|denied|alasan|izin|permission|tidak tercatat|belum tercatat/i.test(l)).slice(0, 10);
return { lines, around: i >= 0 ? t.slice(Math.max(0, i - 300), i + 300) : null };
