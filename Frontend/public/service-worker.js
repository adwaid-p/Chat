const CACHE_NAME = 'chat-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.js', // Adjust based on Vite's output (check dist/assets after build)
  '/assets/index.css', // Adjust based on Vite's output
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (
    event.request.url.includes('/upload-audio') ||
    event.request.url.includes('/upload-image') ||
    event.request.url.includes('/socket.io')
  ) {
    event.respondWith(fetch(event.request)); // Don’t cache media or Socket.IO
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).catch(() => {
          return caches.match('/index.html'); // Fallback to app shell
        });
      })
    );
  }
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});