// Service Worker oficial By.Fio para PWA, Notificaciones Push y Gestión de Pedidos en Tiempo Real
const CACHE_VERSION = 'byfio-pwa-v4.19.131';

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

// Soporte PWA con protección total para WebKit / iOS Safari
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Ignorar peticiones a APIs externas, autenticación, base de datos y Cloudflare Pages
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/') ||
    url.pathname.startsWith('/_app/') ||
    url.hostname.includes('supabase') ||
    url.hostname.includes('google') ||
    url.hostname.includes('gstatic')
  ) {
    return;
  }

  // Network First con fallback a Cache para máxima frescura en actualizaciones
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
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fallback para navegación offline si se solicita HTML
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});
