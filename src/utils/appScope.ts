import { AppRoute, AuthUser } from '../types';

export type AppScope = 'web' | 'admin' | 'collaborator';

const AUTH_KEY_MAP: Record<AppScope, string> = {
  web: 'byfio_auth_user_web_v1',
  admin: 'byfio_auth_user_admin_v1',
  collaborator: 'byfio_auth_user_collab_v1',
};

const LEGACY_AUTH_KEY = 'byfio_auth_user_v1';

const MANIFEST_MAP: Record<AppScope, string> = {
  web: '/manifest.webmanifest',
  admin: '/manifest-admin.webmanifest',
  collaborator: '/manifest-colaborador.webmanifest',
};

const APPLE_TITLE_MAP: Record<AppScope, string> = {
  web: 'by.fio',
  admin: 'by.fio Admin',
  collaborator: 'by.fio Equipo',
};

export const getScopeFromRoute = (route: AppRoute, search?: string): AppScope => {
  if (route === 'admin' || route === 'superadmin' || route === 'metricas') {
    return 'admin';
  }
  if (route === 'pwa-install') {
    const query = search ?? (typeof window !== 'undefined' ? window.location.search : '');
    const params = new URLSearchParams(query);
    if (params.get('app') === 'admin' || params.get('target') === 'admin' || params.get('pwa') === 'admin') {
      return 'admin';
    }
    return 'collaborator';
  }
  if (route === 'pedidos-mobile' || route === 'inventario-app') {
    return 'collaborator';
  }
  return 'web';
};

export const detectInitialAppScope = (
  pathname: string = typeof window !== 'undefined' ? window.location.pathname : '/',
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): AppScope => {
  const path = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(search);
  const appParam = params.get('app') || params.get('target') || params.get('pwa');

  if (
    path.startsWith('/admin') ||
    path.startsWith('/administracion') ||
    path.startsWith('/superadmin') ||
    path.startsWith('/metricas') ||
    ((path.startsWith('/instalar')) && appParam === 'admin')
  ) {
    return 'admin';
  }

  if (
    path === '/usuario/colaborador/pedidos/apps' || path.startsWith('/usuario/colaborador/pedidos/apps') ||
    path === '/usuario/admin/pedidos/apps' || path.startsWith('/usuario/admin/pedidos/apps') ||
    path.includes('/pedidos/apps') ||
    path === '/pedidos' || path.startsWith('/pedidos/') ||
    path === '/pedidos-movil' || path.startsWith('/pedidos-movil/') ||
    path === '/pedidos-mobile' || path.startsWith('/pedidos-mobile/') ||
    path === '/alisto' || path.startsWith('/alisto/') ||
    path === '/picking' || path.startsWith('/picking/') ||
    path === '/app' || path.startsWith('/app/') ||
    path === '/inventario-app' || path.startsWith('/inventario-app/') ||
    path === '/toma-inventario' || path.startsWith('/toma-inventario/') ||
    path === '/conteo-inventario' || path.startsWith('/conteo-inventario/') ||
    path.startsWith('/instalar') ||
    path.startsWith('/colaborador') ||
    appParam === 'colaborador' ||
    appParam === 'inventario'
  ) {
    return 'collaborator';
  }

  return 'web';
};

export const getAuthStorageKey = (scope: AppScope): string => AUTH_KEY_MAP[scope];

const isLegacyUserCompatibleWithScope = (user: AuthUser, scope: AppScope): boolean => {
  if (scope === 'admin') return user.role === 'admin' || Boolean(user.isMasterAdmin);
  if (scope === 'collaborator') return user.role === 'staff' || user.role === 'admin';
  return user.role === 'customer';
};

export const readScopedAuthUser = (scope: AppScope): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getAuthStorageKey(scope));
    if (raw) {
      return JSON.parse(raw) as AuthUser;
    }

    if (scope === 'collaborator') {
      const adminRaw = localStorage.getItem(AUTH_KEY_MAP.admin);
      if (adminRaw) {
        const adminUser = JSON.parse(adminRaw) as AuthUser;
        if (adminUser && (adminUser.role === 'admin' || adminUser.isMasterAdmin)) {
          return adminUser;
        }
      }
    }

    const legacyRaw = localStorage.getItem(LEGACY_AUTH_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw) as AuthUser;
      if (parsed && isLegacyUserCompatibleWithScope(parsed, scope)) {
        localStorage.setItem(getAuthStorageKey(scope), JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch {}
  return null;
};

export const writeScopedAuthUser = (scope: AppScope, user: AuthUser | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      clearScopedAuthUser(scope);
      return;
    }
    localStorage.setItem(getAuthStorageKey(scope), JSON.stringify(user));
  } catch {}
};

export const clearScopedAuthUser = (scope: AppScope): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getAuthStorageKey(scope));
    const legacyRaw = localStorage.getItem(LEGACY_AUTH_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw) as AuthUser;
      if (parsed && isLegacyUserCompatibleWithScope(parsed, scope)) {
        localStorage.removeItem(LEGACY_AUTH_KEY);
      }
    }
  } catch {}
};

export const getManifestHrefForScope = (scope: AppScope): string => MANIFEST_MAP[scope];

export const updateDocumentManifestAndTitle = (scope: AppScope): void => {
  if (typeof document === 'undefined') return;
  const manifestHref = getManifestHrefForScope(scope);
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink && manifestLink.getAttribute('href') !== manifestHref) {
    manifestLink.setAttribute('href', manifestHref);
  }

  const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if (appleTitle) {
    appleTitle.setAttribute('content', APPLE_TITLE_MAP[scope]);
  }

  document.documentElement.setAttribute('data-app-scope', scope);
};
