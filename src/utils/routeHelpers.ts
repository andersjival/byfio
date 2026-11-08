import { AppRoute } from '../types';
import type { AdminTabType } from '../components/admin/AdminTabs';

export interface RouteInfo {
  route: AppRoute;
  adminTab: AdminTabType;
  workshopId?: string | null;
  openDesignModal?: boolean;
}

export const parseRouteFromLocation = (): RouteInfo => {
  if (typeof window === 'undefined') {
    return { route: 'home', adminTab: 'hub' };
  }

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const seccionParam = (
    searchParams.get('seccion') ||
    searchParams.get('section') ||
    searchParams.get('ruta') ||
    searchParams.get('route') ||
    searchParams.get('page') ||
    searchParams.get('tab') ||
    ''
  ).toLowerCase();

  // 0a. Portal Exclusivo de Instalación PWA y Onboarding con PIN (solo rutas explícitas)
  if (
    path === '/instalar' ||
    path.startsWith('/instalar/') ||
    path === '/instalar-app' ||
    path.startsWith('/instalar-app/') ||
    hash.includes('instalar-app') ||
    hash.includes('instalar') ||
    seccionParam === 'instalar-app' ||
    seccionParam === 'instalar'
  ) {
    return { route: 'pwa-install', adminTab: 'hub' };
  }

  // 0. Superadmin Portal Maestro Exclusivo (/panel/superadmin o /superadmin)
  if (
    path.includes('/panel/superadmin') ||
    path.includes('/superadmin') ||
    path.includes('/admin/superadmin') ||
    hash.includes('panel/superadmin') ||
    hash.includes('superadmin') ||
    seccionParam === 'superadmin' ||
    seccionParam === 'panel-superadmin'
  ) {
    return { route: 'superadmin', adminTab: 'hub' };
  }

  // Vista separada optimizada para móviles de Gestión de Pedidos (/pedidos, /pedidos-movil, /app/pedidos, /alisto, /picking)
  if (
    (!path.startsWith('/admin') && (
      path === '/pedidos' || path.startsWith('/pedidos/') ||
      path === '/pedidos-movil' || path.startsWith('/pedidos-movil/') ||
      path === '/pedidos-mobile' || path.startsWith('/pedidos-mobile/') ||
      path === '/alisto' || path.startsWith('/alisto/') ||
      path === '/picking' || path.startsWith('/picking/') ||
      path === '/app' || path.startsWith('/app/pedidos')
    )) ||
    hash.includes('pedidos-movil') ||
    hash.includes('pedidos-mobile') ||
    hash.includes('app/pedidos') ||
    hash.includes('alisto') ||
    hash.includes('picking') ||
    seccionParam === 'pedidos-movil' ||
    seccionParam === 'pedidos-mobile' ||
    seccionParam === 'app-pedidos' ||
    seccionParam === 'alisto' ||
    seccionParam === 'picking'
  ) {
    return { route: 'pedidos-mobile', adminTab: 'orders' };
  }

  // Admin sub-rutas independientes (por pathname, hash o query param)
  if (
    path.includes('/admin/pedidos') ||
    path.includes('/administracion/pedidos') ||
    hash.includes('admin/pedidos') ||
    seccionParam === 'pedidos' ||
    seccionParam === 'orders'
  ) {
    return { route: 'admin', adminTab: 'orders' };
  }
  if (
    path.includes('/admin/facturacion') ||
    path.includes('/administracion/facturacion') ||
    hash.includes('admin/facturacion') ||
    seccionParam === 'facturacion' ||
    seccionParam === 'billing'
  ) {
    return { route: 'admin', adminTab: 'billing' };
  }
  if (
    path.includes('/admin/inventario') ||
    path.includes('/administracion/inventario') ||
    hash.includes('admin/inventario') ||
    seccionParam === 'inventario' ||
    seccionParam === 'inventory'
  ) {
    return { route: 'admin', adminTab: 'inventory' };
  }
  if (
    path.includes('/admin/caja') ||
    path.includes('/administracion/caja') ||
    path.includes('/admin/reportes') ||
    hash.includes('admin/caja') ||
    seccionParam === 'caja' ||
    seccionParam === 'reports'
  ) {
    return { route: 'admin', adminTab: 'reports' };
  }
  if (
    path.includes('/admin/sinpe') ||
    path.includes('/administracion/sinpe') ||
    hash.includes('admin/sinpe') ||
    seccionParam === 'sinpe'
  ) {
    return { route: 'admin', adminTab: 'sinpe' };
  }
  if (
    path.includes('/admin/talleres') ||
    path.includes('/administracion/talleres') ||
    hash.includes('admin/talleres')
  ) {
    return { route: 'admin', adminTab: 'workshops' };
  }
  if (
    path.includes('/admin/precios') ||
    path.includes('/administracion/precios') ||
    hash.includes('admin/precios')
  ) {
    return { route: 'admin', adminTab: 'pricing' };
  }
  if (
    path.includes('/admin/usuarios') ||
    path.includes('/admin/perfiles') ||
    path.includes('/administracion/usuarios') ||
    hash.includes('admin/usuarios') ||
    hash.includes('admin/perfiles') ||
    seccionParam === 'usuarios' ||
    seccionParam === 'users'
  ) {
    return { route: 'admin', adminTab: 'users' };
  }
  if (
    path.includes('/admin/clientes') ||
    path.includes('/administracion/clientes') ||
    hash.includes('admin/clientes') ||
    seccionParam === 'clientes' ||
    seccionParam === 'customers'
  ) {
    return { route: 'admin', adminTab: 'customers' };
  }
  if (
    path.includes('/admin/ventas') ||
    path.includes('/admin/historial-ventas') ||
    path.includes('/administracion/ventas') ||
    hash.includes('admin/ventas') ||
    seccionParam === 'ventas' ||
    seccionParam === 'sales'
  ) {
    return { route: 'admin', adminTab: 'sales' };
  }
  if (
    path.includes('/admin/agenda') ||
    path.includes('/administracion/agenda') ||
    hash.includes('admin/agenda') ||
    seccionParam === 'agenda'
  ) {
    return { route: 'admin', adminTab: 'agenda' };
  }
  if (
    path.includes('/admin/proveedores') ||
    path.includes('/administracion/proveedores') ||
    hash.includes('admin/proveedores') ||
    seccionParam === 'proveedores' ||
    seccionParam === 'suppliers'
  ) {
    return { route: 'admin', adminTab: 'suppliers' };
  }
  if (
    path.includes('/admin/configuracion') ||
    path.includes('/admin/diseno') ||
    hash.includes('admin/configuracion') ||
    hash.includes('admin/diseno') ||
    seccionParam === 'configuracion' ||
    seccionParam === 'diseno' ||
    seccionParam === 'design'
  ) {
    return { route: 'admin', adminTab: 'hub', openDesignModal: true };
  }
  if (
    path.startsWith('/admin') ||
    path.startsWith('/administracion') ||
    hash.includes('admin') ||
    seccionParam === 'admin'
  ) {
    return { route: 'admin', adminTab: 'hub' };
  }

  // Rutas públicas y privadas específicas
  if (path.includes('/superadmin') || hash.includes('superadmin') || seccionParam === 'superadmin') {
    return { route: 'superadmin', adminTab: 'hub' };
  }
  if (path.includes('/propuesta') || hash.includes('propuesta') || seccionParam === 'propuesta') {
    return { route: 'propuesta', adminTab: 'hub' };
  }
  if (path.includes('/metricas') || hash.includes('metricas') || seccionParam === 'metricas') {
    return { route: 'metricas', adminTab: 'hub' };
  }
  if (path.includes('/login') || hash.includes('login') || seccionParam === 'login') {
    return { route: 'login', adminTab: 'hub' };
  }
  if (
    path.includes('/precios') ||
    hash.includes('precios') ||
    hash.includes('seccion-precios') ||
    hash.includes('stickers') ||
    seccionParam === 'precios' ||
    seccionParam === 'stickers'
  ) {
    return { route: 'precios', adminTab: 'hub' };
  }
  if (path.includes('/catalogo') || hash.includes('catalogo') || seccionParam === 'catalogo') {
    return { route: 'catalogo', adminTab: 'hub' };
  }
  if (
    path.includes('/tienda') ||
    hash.includes('tienda') ||
    hash.includes('products') ||
    seccionParam === 'tienda' ||
    seccionParam === 'store'
  ) {
    return { route: 'store', adminTab: 'hub' };
  }

  // Subruta de taller individual: /talleres/:id o /taller/:id o ?taller=:id
  const wsMatch = path.match(/^\/(?:talleres|taller)\/([^/?#]+)/i);
  const tallerQuery = searchParams.get('taller');

  if (wsMatch && wsMatch[1] && wsMatch[1] !== 'undefined') {
    return { route: 'workshop-detail', adminTab: 'hub', workshopId: decodeURIComponent(wsMatch[1]) };
  }
  if (tallerQuery) {
    return { route: 'workshop-detail', adminTab: 'hub', workshopId: tallerQuery };
  }

  if (
    path.includes('/talleres') ||
    hash.includes('talleres') ||
    hash.includes('workshops') ||
    path.includes('/taller') ||
    hash.includes('taller') ||
    seccionParam === 'talleres' ||
    seccionParam === 'workshops'
  ) {
    return { route: 'workshops', adminTab: 'hub' };
  }

    // Persistencia de navegación: Si se recarga en la raíz o ruta base sin sub-rutas, recuperar la última pestaña visitada
  try {
    const savedRoute = sessionStorage.getItem('byfio_last_active_route') as AppRoute | null;
    const savedTab = sessionStorage.getItem('byfio_last_admin_tab') as AdminTabType | null;
    const savedWsId = sessionStorage.getItem('byfio_last_ws_id');
    const savedModal = sessionStorage.getItem('byfio_design_modal_open') === 'true';

    if (savedRoute && savedRoute !== 'home' && (path === '/' || path === '')) {
      return {
        route: savedRoute,
        adminTab: savedTab || 'hub',
        workshopId: savedWsId || null,
        openDesignModal: savedModal,
      };
    }
  } catch {}

  return { route: 'home', adminTab: 'hub' };
};

export const isHomeLocation = (): boolean => {
  return parseRouteFromLocation().route === 'home';
};
