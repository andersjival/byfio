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
    path === '/colaborador' ||
    path.startsWith('/colaborador/') ||
    path === '/colaboradores' ||
    path.startsWith('/colaboradores/') ||
    path === '/app/colaborador' ||
    hash.includes('instalar-app') ||
    hash.includes('instalar') ||
    hash.includes('colaborador') ||
    seccionParam === 'instalar-app' ||
    seccionParam === 'instalar' ||
    seccionParam === 'colaborador' ||
    ((searchParams.get('app') === 'colaborador' || searchParams.get('target') === 'colaborador' || searchParams.get('pwa') === 'colaborador') && path !== '/pedidos' && !path.startsWith('/admin') && !path.includes('/pedidos/apps'))
  ) {
    return { route: 'pwa-install', adminTab: 'hub' };
  }

  // 0. Superadmin Portal Maestro Exclusivo (/admin/superadmin)
  if (
    path === '/admin/superadmin' ||
    path.startsWith('/admin/superadmin') ||
    path.includes('/admin/superadmin') ||
    path === '/superadmin' ||
    path.startsWith('/superadmin') ||
    path.includes('/superadmin') ||
    path.includes('/panel/superadmin') ||
    hash.includes('admin/superadmin') ||
    hash.includes('panel/superadmin') ||
    hash.includes('superadmin') ||
    seccionParam === 'superadmin' ||
    seccionParam === 'panel-superadmin' ||
    seccionParam === 'admin/superadmin'
  ) {
    return { route: 'superadmin', adminTab: 'hub' };
  }

  // Vista separada optimizada para móviles de Gestión de Pedidos (/pedidos, /pedidos-movil, /app/pedidos, /alisto, /picking)
  if (
    path === '/usuario/colaborador/pedidos/apps' || path.startsWith('/usuario/colaborador/pedidos/apps') ||
    path === '/usuario/admin/pedidos/apps' || path.startsWith('/usuario/admin/pedidos/apps') ||
    path.includes('/pedidos/apps') ||
    hash.includes('pedidos/apps') ||
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

  // Vista / PWA independiente y aislada de Toma de Inventario por Estantes (/inventario-app, /app/inventario, /toma-inventario)
  if (
    (!path.startsWith('/admin') && (
      path === '/inventario-app' || path.startsWith('/inventario-app/') ||
      path === '/app/inventario' || path.startsWith('/app/inventario/') ||
      path === '/toma-inventario' || path.startsWith('/toma-inventario/') ||
      path === '/conteo-inventario' || path.startsWith('/conteo-inventario/') ||
      path === '/inventario' || path === '/inventario/'
    )) ||
    hash.includes('inventario-app') ||
    hash.includes('app/inventario') ||
    hash.includes('toma-inventario') ||
    seccionParam === 'inventario-app' ||
    seccionParam === 'toma-inventario' ||
    (searchParams.get('app') === 'inventario' && !path.startsWith('/admin'))
  ) {
    return { route: 'inventario-app', adminTab: 'inventory' };
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
    path.includes('/admin/realizar-pedido') ||
    path.includes('/admin/nuevo-pedido-proveedor') ||
    path.includes('/admin/pedidos-proveedores/nuevo') ||
    path.includes('/admin/orden-compra') ||
    hash.includes('realizar-pedido') ||
    hash.includes('nuevo-pedido-proveedor') ||
    seccionParam === 'realizar-pedido' ||
    seccionParam === 'nuevo-pedido-proveedor' ||
    seccionParam === 'orden-compra'
  ) {
    return { route: 'admin', adminTab: 'supplier-order-create' };
  }
  if (
    path.includes('/admin/aplicaciones') ||
    path.includes('/admin/apps') ||
    path.includes('/administracion/aplicaciones') ||
    hash.includes('admin/aplicaciones') ||
    hash.includes('admin/apps') ||
    seccionParam === 'aplicaciones' ||
    seccionParam === 'apps'
  ) {
    return { route: 'admin', adminTab: 'apps' };
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
    !path.startsWith('/admin/superadmin') &&
    (path.startsWith('/admin') ||
    path.startsWith('/administracion') ||
    hash.includes('admin') ||
    seccionParam === 'admin')
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
    path === '/mi-cuenta' ||
    path.startsWith('/mi-cuenta') ||
    path === '/cuenta' ||
    path.startsWith('/cuenta') ||
    path === '/perfil' ||
    path.startsWith('/perfil') ||
    path.includes('/mi-cuenta') ||
    hash.includes('mi-cuenta') ||
    hash.includes('cuenta') ||
    hash.includes('perfil') ||
    hash.includes('my-account') ||
    seccionParam === 'mi-cuenta' ||
    seccionParam === 'cuenta' ||
    seccionParam === 'perfil' ||
    seccionParam === 'my-account'
  ) {
    return { route: 'mi-cuenta', adminTab: 'hub' };
  }
  if (path.includes('/registro') || hash.includes('registro') || seccionParam === 'registro') {
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

  // Subruta limpia de lista de espera de talleres: /lista-espera/:id o /talleres/:id/lista-espera
  const waitlistMatch = path.match(/^\/(?:talleres|taller)\/([^/?#]+)\/lista-espera/i) || path.match(/^\/lista-espera(?:\/([^/?#]+))?/i);
  if (waitlistMatch || hash.includes('lista-espera') || seccionParam === 'lista-espera') {
    const wsFromMatch = waitlistMatch?.[1] && waitlistMatch[1] !== 'undefined' ? decodeURIComponent(waitlistMatch[1]) : null;
    const wsFromQuery = searchParams.get('taller');
    return { route: 'workshop-waitlist', adminTab: 'hub', workshopId: wsFromMatch || wsFromQuery || null };
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

    // Persistencia de navegación acotada: en '/' solo restaurar subrutas públicas de la Web (nunca Admin ni PWA Colaborador)
  try {
    const savedRoute = sessionStorage.getItem('byfio_last_active_route') as AppRoute | null;
    const savedWsId = sessionStorage.getItem('byfio_last_ws_id');
    const webRestorableRoutes: AppRoute[] = [
      'store',
      'catalogo',
      'workshops',
      'workshop-detail',
      'workshop-waitlist',
      'precios',
      'login',
      'mi-cuenta',
      'propuesta',
    ];

    if (savedRoute && webRestorableRoutes.includes(savedRoute) && (path === '/' || path === '')) {
      return {
        route: savedRoute,
        adminTab: 'hub',
        workshopId: savedWsId || null,
        openDesignModal: false,
      };
    }
  } catch {}

  return { route: 'home', adminTab: 'hub' };
};

export const isHomeLocation = (): boolean => {
  return parseRouteFromLocation().route === 'home';
};

export const isCollaboratorPwaContext = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    // 1. Detección explícita de query params de colaborador / staff
    const hasCollaboratorParam =
      urlParams.get('app') === 'colaborador' ||
      urlParams.get('target') === 'colaborador' ||
      urlParams.get('role') === 'alisto' ||
      urlParams.get('role') === 'staff' ||
      urlParams.get('pwa') === 'colaborador' ||
      urlParams.get('modulo') === 'colaborador';

    if (hasCollaboratorParam) {
      try { localStorage.setItem('byfio_collaborator_pwa', 'true'); } catch {}
      return true;
    }

    // 2. Detección de rutas exclusivas de pedidos / colaboradores / inventario PWA
    const isCollaboratorPath =
      path === '/usuario/colaborador/pedidos/apps' || path.startsWith('/usuario/colaborador/pedidos/apps') ||
      path === '/usuario/admin/pedidos/apps' || path.startsWith('/usuario/admin/pedidos/apps') ||
      path.includes('/pedidos/apps') ||
      path === '/pedidos' || path.startsWith('/pedidos/') ||
      path === '/pedidos-mobile' || path.startsWith('/pedidos-mobile/') ||
      path === '/pedidos-movil' || path.startsWith('/pedidos-movil/') ||
      path === '/alisto' || path.startsWith('/alisto/') ||
      path === '/picking' || path.startsWith('/picking/') ||
      path === '/app/pedidos' ||
      path === '/inventario-app' || path.startsWith('/inventario-app/') ||
      path === '/toma-inventario' || path.startsWith('/toma-inventario/') ||
      hash.includes('pedidos-mobile') || hash.includes('alisto') || hash.includes('picking') || hash.includes('inventario-app');

    if (isCollaboratorPath) return true;

    // 3. Detección de PWA en modo standalone con perfil o sesión de colaborador
    // Nunca activar contexto de colaborador en '/', '/admin*', '/administracion*', '/superadmin*' ni '/metricas*'
    const currentPath = (window.location.pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
    if (
      currentPath === '/' ||
      currentPath.startsWith('/admin') ||
      currentPath.startsWith('/administracion') ||
      currentPath.startsWith('/superadmin') ||
      currentPath.startsWith('/metricas')
    ) {
      return false;
    }

    return false;
  } catch {
    return false;
  }
};
