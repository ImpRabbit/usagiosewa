// sw.js（これでOK）
const CACHE = 'bun-cache-sprite-files-v2';   // ← v1 → v2 に変更
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './assets/spritesheet idle.png',
  './assets/spritesheet run.png',
  './assets/spritesheet dash.png',
  './assets/spritesheet hurt.png',
  './assets/spritesheet jump.png',
  './assets/spritesheet death.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
