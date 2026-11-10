import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import App from './App';
import './index.css';
import { safeSessionStorage } from './utils/safeStorage';

// Auto-recarga inmediata y transparente cuando se despliega una versión nueva y un chunk viejo no existe
if (typeof window !== 'undefined') {
  // Registro transparente de Service Worker para notificaciones push en tiempo real y auto-actualización
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch(() => {});
    });

    let hadController = Boolean(navigator.serviceWorker.controller);
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) {
        hadController = true;
        return; // Primer registro: no recargar para no interrumpir la navegación en Safari / iOS
      }
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    try {
      const lastReload = safeSessionStorage.getItem('byfio_chunk_reload_lock');
      const now = Date.now();
      if (!lastReload || now - Number(lastReload) > 10000) {
        safeSessionStorage.setItem('byfio_chunk_reload_lock', String(now));
        window.location.href = window.location.origin + window.location.pathname + '?r=' + now + window.location.hash;
      }
    } catch {
      window.location.reload();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallbackTitle="Inconveniente al cargar la aplicación by.fio">
      <AppProvider>
        <ConfirmProvider>
          <App />
        </ConfirmProvider>
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
