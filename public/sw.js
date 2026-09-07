const CACHE = 'eyvan-kheshti-cinematic-v21';
const SHELL = ['/', '/manifest.webmanifest', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key.startsWith('meyanfaza-') || (key.startsWith('eyvan-kheshti-') && key !== CACHE))
        .map((key) => caches.delete(key)),
    )),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;
  const url = new URL(event.request.url);
  const destination = event.request.destination;

  // Private API responses and range-based media must never enter the public shell cache.
  if (url.pathname.startsWith('/v1/') || event.request.headers.has('range') || destination === 'video' || destination === 'audio') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && ['document', 'script', 'style', 'font', 'image', 'manifest'].includes(destination)) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === 'navigate') return (await caches.match('/')) || Response.error();
        return Response.error();
      }),
  );
});
