// Service Worker oficial By.Fio para PWA, Notificaciones Push y Gestión de Pedidos en Tiempo Real
const CACHE_VERSION = 'byfio-pwa-v4.19.119';

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

  // NUNCA interceptar APIs, peticiones multimedia (.mp4/.webm/.mp3) o con cabecera Range para no romper video en Safari
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.endsWith('.mp4') ||
    url.pathname.endsWith('.webm') ||
    url.pathname.endsWith('.mp3') ||
    event.request.headers.get('range')
  ) {
    return;
  }

  // Dejar que las peticiones se sirvan directamente por red
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') {
        const indexFallback = await caches.match('/index.html');
        if (indexFallback) return indexFallback;
      }
      return new Response('Contenido no disponible sin conexión.', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    })
  );
});

// Manejo de clic en la notificación push
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/pedidos';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si la ventana ya está abierta, enfocarla
      for (const client of clientList) {
        if (client.url && client.url.includes('/pedidos') && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir una nueva ventana con la vista de pedidos
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
