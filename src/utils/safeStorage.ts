// Utilidad universal a prueba de fallos para localStorage y sessionStorage
// Blindado contra excepciones de Safari Private Browsing (SecurityError), iOS WebViews y cuotas excedidas (QuotaExceededError)

const memoryStore: Record<string, string> = {};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return memoryStore[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // Si la cuota de localStorage se agotó (DOMException: QuotaExceededError)
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          // Purgar claves no críticas y pesadas para liberar espacio
          window.localStorage.removeItem('byfio_metrics_tracker_v1');
          window.localStorage.removeItem('byfio_agenda_items_v1');
          window.localStorage.removeItem('byfio_daily_closings_v1');
          window.localStorage.removeItem('byfio_supplier_orders_v1');
          window.localStorage.removeItem('byfio_orders_v1');
          window.localStorage.setItem(key, value);
          return;
        }
      } catch {}
    }
    // Si aún falla o no hay almacenamiento disponible, guardar en memoria de sesión sin quebrar la app
    memoryStore[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
    delete memoryStore[key];
  },
  clear: (): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch {}
    for (const k of Object.keys(memoryStore)) {
      delete memoryStore[k];
    }
  },
};

const sessionMemoryStore: Record<string, string> = {};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch {}
    return sessionMemoryStore[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
        return;
      }
    } catch {}
    sessionMemoryStore[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch {}
    delete sessionMemoryStore[key];
  },
  clear: (): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.clear();
      }
    } catch {}
    for (const k of Object.keys(sessionMemoryStore)) {
      delete sessionMemoryStore[k];
    }
  },
};

// Parche global defensivo para blindar llamadas directas a window.localStorage.setItem
// evitando que cualquier QuotaExceededError quiebre la aplicación
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const rawSetItem = window.localStorage.setItem.bind(window.localStorage);
    window.localStorage.setItem = (key: string, value: string) => {
      try {
        rawSetItem(key, value);
      } catch (err) {
        console.warn(`[safeStorage] Cuota excedida al guardar ${key}, redirigiendo a almacenamiento seguro`, err);
        safeLocalStorage.setItem(key, value);
      }
    };
  } catch {}
}
