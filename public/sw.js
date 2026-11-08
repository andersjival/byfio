// Service Worker oficial By.Fio para Notificaciones Push y Gestión de Pedidos en Tiempo Real
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
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
