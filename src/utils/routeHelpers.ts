import { AppRoute } from '../types';
import type { AdminTabType } from '../components/admin/AdminTabs';

export interface RouteInfo {
  route: AppRoute;
  adminTab: AdminTabType;
  workshopId?: string | null;
}

export const parseRouteFromLocation = (): RouteInfo => {
  if (typeof window === 'undefined') {
    return { route: 'home', adminTab: 'hub' };
  }

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  // Admin sub-rutas independientes
  if (path.includes('/admin/pedidos') || path.includes('/administracion/pedidos') || hash.includes('admin/pedidos')) {
    return { route: 'admin', adminTab: 'orders' };
  }
  if (path.includes('/admin/facturacion') || path.includes('/administracion/facturacion') || hash.includes('admin/facturacion')) {
    return { route: 'admin', adminTab: 'billing' };
  }
  if (path.includes('/admin/inventario') || path.includes('/administracion/inventario') || hash.includes('admin/inventario')) {
    return { route: 'admin', adminTab: 'inventory' };
  }
  if (path.includes('/admin/caja') || path.includes('/administracion/caja') || path.includes('/admin/reportes') || hash.includes('admin/caja')) {
    return { route: 'admin', adminTab: 'reports' };
  }
  if (path.includes('/admin/talleres') || path.includes('/administracion/talleres') || hash.includes('admin/talleres')) {
    return { route: 'admin', adminTab: 'workshops' };
  }
  if (path.includes('/admin/precios') || path.includes('/administracion/precios') || hash.includes('admin/precios')) {
    return { route: 'admin', adminTab: 'pricing' };
  }
  if (path.includes('/admin/usuarios') || path.includes('/admin/perfiles') || path.includes('/administracion/usuarios') || hash.includes('admin/usuarios') || hash.includes('admin/perfiles')) {
    return { route: 'admin', adminTab: 'users' };
  }
  if (path.startsWith('/admin') || path.startsWith('/administracion') || hash.includes('admin')) {
    return { route: 'admin', adminTab: 'hub' };
  }

  // Rutas públicas y privadas
  if (path.includes('/propuesta') || hash.includes('propuesta')) return { route: 'propuesta', adminTab: 'hub' };
  if (path.includes('/metricas') || hash.includes('metricas')) return { route: 'metricas', adminTab: 'hub' };
  if (path.includes('/login') || hash.includes('login')) return { route: 'login', adminTab: 'hub' };
  if (path.includes('/precios') || hash.includes('precios')) return { route: 'precios', adminTab: 'hub' };
  if (path.includes('/catalogo') || hash.includes('catalogo')) return { route: 'catalogo', adminTab: 'hub' };
  if (path.includes('/tienda') || hash.includes('tienda')) return { route: 'store', adminTab: 'hub' };

  // Subruta de taller individual: /talleres/:id o /taller/:id o ?taller=:id
  const wsMatch = path.match(/^\/(?:talleres|taller)\/([^/?#]+)/i);
  const searchParams = new URLSearchParams(window.location.search);
  const tallerQuery = searchParams.get('taller');

  if (wsMatch && wsMatch[1] && wsMatch[1] !== 'undefined') {
    return { route: 'workshop-detail', adminTab: 'hub', workshopId: decodeURIComponent(wsMatch[1]) };
  }
  if (tallerQuery) {
    return { route: 'workshop-detail', adminTab: 'hub', workshopId: tallerQuery };
  }

  if (path.includes('/talleres') || hash.includes('talleres') || path.includes('/taller') || hash.includes('taller')) {
    return { route: 'workshops', adminTab: 'hub' };
  }

  return { route: 'home', adminTab: 'hub' };
};

export const isHomeLocation = (): boolean => {
  return parseRouteFromLocation().route === 'home';
};
