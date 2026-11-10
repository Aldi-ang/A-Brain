/* put the phone at AMANAH BARU (-6.965387, 107.575909): every location read the page makes answers with the shop's spot */
const C = { latitude: -6.965387, longitude: 107.575909, accuracy: 5, altitude: null, altitudeAccuracy: null, heading: null, speed: null };
const pos = () => ({ coords: C, timestamp: Date.now() });
const g = navigator.geolocation;
g.getCurrentPosition = (ok) => { setTimeout(() => ok(pos()), 30); };
g.watchPosition = (ok) => { setTimeout(() => ok(pos()), 30); return 7; };
g.clearWatch = () => {};
return 'phone placed at the shop';
