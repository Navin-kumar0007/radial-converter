// Lets the web app open and work with no connection after its first visit, which matters most on an
// iPhone, where this is the only version there is. tool/build_web.sh writes offline_files.js, naming
// what to keep and a version that changes whenever any of it does.

importScripts('offline_files.js');

const cacheName = `radial-${self.offlineVersion}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(self.offlineFiles)));
  // No skipWaiting: an open page keeps its own version, rather than old code loading new workers.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name.startsWith('radial-') && name !== cacheName)
          .map((name) => caches.delete(name)),
      ),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  // Only this site's own files. Nothing here reaches anywhere else, and users' files are blob:
  // addresses, which don't come through here at all.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      const key = request.mode === 'navigate' ? './' : request;
      const kept = await cache.match(key, { ignoreSearch: true });
      if (kept) return kept;
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
      return response;
    })(),
  );
});
