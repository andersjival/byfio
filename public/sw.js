// Service Worker oficial By.Fio para PWA, Notificaciones Push y Gestión de Pedidos en Tiempo Real
const CACHE_VERSION = 'byfio-pwa-v4.19.184';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // En desarrollo o llamadas API/Worker/D1, permitir paso directo a la red sin cachear
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/') ||
    event.request.url.includes('cloudflare') ||
    event.request.url.includes('fonts.googleapis') ||
    event.request.url.includes('fonts.gstatic')
  ) {
    return;
  }

  // Network First con fallback a caché para navegación siempre fresca
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
