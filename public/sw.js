// Service Worker oficial By.Fio para PWA, Notificaciones Push y Gestión de Pedidos en Tiempo Real
const CACHE_VERSION = 'byfio-pwa-v4.19.21';

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

// Soporte PWA offline con estrategia Network-First (evita desactualizaciones)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
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
