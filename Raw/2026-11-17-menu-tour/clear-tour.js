/* forget today's menu tour in this browser and reload, so the next "Pandu saya" starts it again */
localStorage.removeItem('kpm-demo-tour');
setTimeout(() => location.reload(), 50);
return 'tour forgotten, reloading';
