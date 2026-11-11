/* Floriva Calm Paycheck service worker (generated at build time from scripts/sw-template.js). */
const VERSION = '3fa7798b2ba0';
const ASSETS = [
  "./",
  "./assets/index-9lDbirUk.css",
  "./assets/index-GGydCZBq.js",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./index.html",
  "./manifest.webmanifest"
];
// Scoped by registration path: GitHub Pages project sites of one account share an origin.
const PREFIX = 'calm-paycheck:' + self.registration.scope + ':';
const CACHE = PREFIX + VERSION;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // App shell: always serve the cached index so the app opens offline.
    const index = new URL('index.html', self.registration.scope).href;
    event.respondWith(
      caches.open(CACHE).then((cache) => cache.match(index)).then((cached) => cached || fetch(request))
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE).then((cache) => cache.match(request)).then((cached) => cached || fetch(request))
  );
});
