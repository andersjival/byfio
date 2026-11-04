import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import App from './App';
import './index.css';

// Auto-recarga inmediata y transparente cuando se despliega una versión nueva y un chunk viejo no existe
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    const lastReload = sessionStorage.getItem('byfio_chunk_reload_lock');
    const now = Date.now();
    if (!lastReload || now - Number(lastReload) > 10000) {
      sessionStorage.setItem('byfio_chunk_reload_lock', String(now));
      window.location.reload();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
