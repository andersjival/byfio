import { playNewOrderChimeSound, unlockAudioContext } from './soundEffects';
import { formatCRC } from './formatters';

export interface PushOrderNotificationPayload {
  orderNumber: string;
  customerName: string;
  total: number;
  isWorkshop?: boolean;
  workshopTitle?: string;
  isLayaway?: boolean;
}

const STORAGE_KEY_PUSH_ENABLED = 'byfio_push_notifications_enabled';

/**
 * Comprueba si el navegador soporta la API de Notificaciones
 */
export const isPushSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

/**
 * Obtiene el estado actual del permiso de notificaciones
 */
export const getPushPermission = (): NotificationPermission => {
  if (!isPushSupported()) return 'denied';
  return Notification.permission;
};

/**
 * Solicita permiso al usuario para notificaciones push en tiempo real
 * y desbloquea el contexto de audio del celular.
 */
export const requestPushNotificationPermission = async (): Promise<boolean> => {
  if (!isPushSupported()) return false;

  // Desbloqueo inmediato del audio al hacer clic
  unlockAudioContext();

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      try {
        localStorage.setItem(STORAGE_KEY_PUSH_ENABLED, 'true');
      } catch {}

      // Registrar Service Worker para soporte de notificaciones en segundo plano
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js');
        } catch (swErr) {
          console.warn('Service worker registration error', swErr);
        }
      }
      return true;
    }
    return false;
  } catch (e) {
    console.warn('Error requesting notification permission', e);
    return false;
  }
};

/**
 * Envía una notificación push nativa y emite el sonido de alerta en el celular
 */
export const sendOrderPushNotification = (payload: PushOrderNotificationPayload) => {
  // 1. Sonido de campana celesta para celulares (volumen alto para alertas de pedidos)
  playNewOrderChimeSound(0.85);

  // 2. Vibración háptica en el teléfono (patrón doble largo)
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([400, 150, 400, 150, 600]);
    } catch {}
  }

  // 3. Notificación nativa del navegador / sistema operativo
  if (!isPushSupported() || Notification.permission !== 'granted') return;

  const title = payload.isWorkshop
    ? `🎓 ¡Nueva Reserva en Taller ${payload.orderNumber}!`
    : payload.isLayaway
    ? `🔖 ¡Nuevo Apartado ${payload.orderNumber}!`
    : `📦 ¡Nuevo Pedido ${payload.orderNumber}!`;

  const body = payload.isWorkshop
    ? `Alumno: ${payload.customerName}\n${payload.workshopTitle || 'Taller Creativo'} • ${formatCRC(payload.total)}\nToca para revisar la lista.`
    : payload.isLayaway
    ? `Cliente: ${payload.customerName}\nTotal Apartado: ${formatCRC(payload.total)}\nToca para abrir Apartados.`
    : `Cliente: ${payload.customerName}\nTotal: ${formatCRC(payload.total)}\nToca para iniciar el alisto en el móvil.`;

  const options: NotificationOptions & Record<string, any> = {
    body,
    icon: '/logo-byfio-lila-HD.png',
    badge: '/logo-byfio-lila-HD.png',
    tag: `byfio-order-${payload.orderNumber}`,
    data: { url: payload.isLayaway ? '/apartados' : '/pedidos' },
    renotify: true,
    requireInteraction: true,
  };


  try {
    // Si hay Service Worker activo, usar showNotification para mejor compatibilidad en Android / PWA
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, options);
      }).catch(() => {
        spawnWindowNotification(title, options);
      });
    } else {
      spawnWindowNotification(title, options);
    }
  } catch (e) {
    console.warn('Error displaying native notification', e);
  }
};

const spawnWindowNotification = (title: string, options: NotificationOptions) => {
  try {
    const notification = new Notification(title, options);
    notification.onclick = () => {
      window.focus();
      try {
        if (!window.location.pathname.includes('/pedidos')) {
          window.location.href = '/pedidos';
        }
      } catch {}
      notification.close();
    };
  } catch {}
};

/**
 * Prueba interactiva de sonido y notificación para que el usuario verifique en su celular
 */
export const testPushAndSoundAlert = async (): Promise<boolean> => {
  unlockAudioContext();
  playNewOrderChimeSound(0.9);

  if ('vibrate' in navigator) {
    try {
      navigator.vibrate([300, 100, 300, 100, 500]);
    } catch {}
  }

  if (isPushSupported()) {
    if (Notification.permission !== 'granted') {
      const granted = await requestPushNotificationPermission();
      if (!granted) return false;
    }

    sendOrderPushNotification({
      orderNumber: '#FIO-DEMO',
      customerName: 'Prueba de Celular (Alerta Sonora)',
      total: 15000,
    });
    return true;
  }
  return false;
};
