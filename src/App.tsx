import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { AppRoute, AdminTabType } from './types';
import { metricsTracker, appendRefToPath, getActiveCampaignRef } from './services/metricsTracker';
import { initWaterDropButtonSounds } from './utils/soundEffects';
import { setupGlobalHapticClickListener } from './utils/haptics';
import { parseRouteFromLocation } from './utils/routeHelpers';
import { getScopeFromRoute, updateDocumentManifestAndTitle } from './utils/appScope';

const WebShell = React.lazy<React.ComponentType<any>>(() => import('./apps/web/WebShell'));
const AdminPwaShell = React.lazy(() => import('./apps/admin/AdminPwaShell'));
const CollaboratorPwaShell = React.lazy(() => import('./apps/collaborator/CollaboratorPwaShell'));
const EnviosApp = React.lazy(() => import('./apps/envios/EnviosApp'));

const ShellFallback: React.FC = () => (
  <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-[#F7F4FC] text-purple-700 font-bubble text-sm">
    Cargando By.Fio...
  </div>
);

export const App: React.FC = () => {
  const {
    setViewMode,
    setAppScope,
    isIntroOpen,
    closeWebIntro,
    hasPermission,
    isModuleEnabled,
    currentUser,
  } = useApp();

  const initial = parseRouteFromLocation();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(initial.route);
  const [adminTab, setAdminTab] = useState<AdminTabType>(initial.adminTab);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(initial.workshopId || null);
  const [clientUsername, setClientUsername] = useState<string | null>(initial.clientUsername || null);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(Boolean(initial.openDesignModal));

  const syncScopeRuntime = (route: AppRoute, search?: string) => {
    const nextScope = getScopeFromRoute(route, search);
    setAppScope(nextScope);
    updateDocumentManifestAndTitle(nextScope);
    return nextScope;
  };

  useEffect(() => {
    syncScopeRuntime(currentRoute);
  }, [currentRoute]);

  const navigate = (newRoute: AppRoute, targetTab?: AdminTabType, workshopId?: string, clientSlug?: string) => {
    if (newRoute !== 'home' && isIntroOpen) closeWebIntro();

    const nextScope = syncScopeRuntime(newRoute, newRoute === 'pwa-install' ? window.location.search : '');
    setCurrentRoute(newRoute);
    setViewMode(newRoute === 'admin' ? 'admin' : 'store');

    const tab = targetTab !== undefined ? targetTab : 'hub';
    setAdminTab(tab);

    const wsId = workshopId !== undefined ? workshopId : selectedWorkshopId;
    setSelectedWorkshopId(wsId);

    const activeSlug = clientSlug !== undefined ? clientSlug : (clientUsername || currentUser?.clientSlug || currentUser?.username || null);
    if (clientSlug !== undefined) setClientUsername(clientSlug);

    let targetPath = '/';
    if (newRoute === 'superadmin') targetPath = '/admin/superadmin';
    else if (newRoute === 'propuesta') targetPath = '/propuesta';
    else if (newRoute === 'metricas') targetPath = '/metricas';
    else if (newRoute === 'login') targetPath = '/login';
    else if (newRoute === 'mi-cuenta') {
      const cSlug = activeSlug || currentUser?.clientSlug || currentUser?.username;
      targetPath = cSlug ? `/usuario/webcliente/${cSlug}` : '/mi-cuenta';
    }
    else if (newRoute === 'precios') targetPath = '/precios';
    else if (newRoute === 'catalogo') targetPath = '/catalogo';
    else if (newRoute === 'store') targetPath = '/tienda';
    else if (newRoute === 'pedidos-mobile') {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
      if (currentPath.includes('/usuario/admin/pedidos/apps') || currentUser?.role === 'admin' || Boolean(currentUser?.isMasterAdmin)) {
        targetPath = '/usuario/admin/pedidos/apps';
      } else {
        targetPath = '/usuario/colaborador/pedidos/apps';
      }
    }
    else if (newRoute === 'pwa-install') targetPath = '/instalar-app';
    else if (newRoute === 'inventario-app') targetPath = '/inventario-app';
    else if (newRoute === 'workshops') targetPath = '/talleres';
    else if (newRoute === 'workshop-detail') targetPath = `/talleres/${wsId || ''}`;
    else if (newRoute === 'workshop-waitlist') targetPath = wsId ? `/lista-espera/${wsId}` : '/lista-espera';
    else if (newRoute === 'cursos-drive') targetPath = '/cursos-drive';
    else if (newRoute === 'envios') targetPath = '/envios';
    else if (newRoute === 'admin') {
      const adminPathMap: Partial<Record<AdminTabType, string>> = {
        orders: '/admin/pedidos',
        billing: '/admin/facturacion',
        inventory: '/admin/inventario',
        reports: '/admin/caja',
        sinpe: '/admin/sinpe',
        workshops: '/admin/talleres',
        users: '/admin/usuarios',
        customers: '/admin/clientes',
        agenda: '/admin/agenda',
        suppliers: '/admin/proveedores',
        'supplier-order-create': '/admin/realizar-pedido',
        sales: '/admin/ventas',
        apps: '/admin/aplicaciones',
        'drive-courses': '/admin/cursos-drive',
      };
      targetPath = adminPathMap[tab] || '/admin';
    }

    targetPath = appendRefToPath(targetPath);

    try {
      if (nextScope === 'web') {
        sessionStorage.setItem('byfio_last_active_route', newRoute);
      } else {
        sessionStorage.removeItem('byfio_last_active_route');
      }
      if (nextScope === 'admin' && tab) sessionStorage.setItem('byfio_last_admin_tab', tab);
      if (wsId) sessionStorage.setItem('byfio_last_ws_id', wsId);
      else sessionStorage.removeItem('byfio_last_ws_id');
      window.history.pushState({ route: newRoute, adminTab: tab, workshopId: wsId }, '', targetPath);
    } catch {
      window.location.hash = targetPath.replace('/', '#');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAdminTab = (tab: AdminTabType) => {
    if (tab === 'catalog-view' || tab === 'supplier-order-create' || tab === 'apps' || tab === 'drive-courses') {
      navigate('admin', tab);
      return;
    }
    if (tab !== 'hub' && (!isModuleEnabled(tab) || !hasPermission(tab))) {
      navigate('admin', 'hub');
      return;
    }
    navigate('admin', tab);
  };

  const handleOpenDesignModal = () => {
    setIsDesignModalOpen(true);
    try {
      sessionStorage.setItem('byfio_design_modal_open', 'true');
      window.history.pushState({ route: 'admin', adminTab, openDesignModal: true }, '', appendRefToPath('/admin/configuracion'));
    } catch {}
  };

  const handleCloseDesignModal = () => {
    setIsDesignModalOpen(false);
    try {
      sessionStorage.removeItem('byfio_design_modal_open');
      if (window.location.pathname.includes('configuracion')) {
        window.history.pushState({ route: 'admin', adminTab, openDesignModal: false }, '', appendRefToPath('/admin'));
      }
    } catch {}
  };

  useEffect(() => {
    if (currentRoute === 'admin' && adminTab !== 'hub') {
      if (adminTab !== 'catalog-view' && adminTab !== 'supplier-order-create' && adminTab !== 'apps' && adminTab !== 'drive-courses' && (!isModuleEnabled(adminTab) || !hasPermission(adminTab))) {
        setAdminTab('hub');
      }
    } else if ((currentRoute === 'workshops' || currentRoute === 'workshop-detail' || currentRoute === 'workshop-waitlist') && !isModuleEnabled('workshops')) {
      navigate('home');
    } else if (currentRoute === 'store' && !isModuleEnabled('store')) {
      navigate('home');
    } else if (currentRoute === 'catalogo' && !isModuleEnabled('catalogo')) {
      navigate('home');
    } else if (currentRoute === 'precios' && !isModuleEnabled('pricing')) {
      navigate('home');
    } else if (currentRoute === 'metricas' && !isModuleEnabled('metricas')) {
      navigate('admin');
    }
  }, [currentRoute, adminTab, isModuleEnabled, hasPermission]);

  useEffect(() => {
    const handlePop = () => {
      const parsed = parseRouteFromLocation();
      if (parsed.route !== 'home' && isIntroOpen) closeWebIntro();
      syncScopeRuntime(parsed.route);
      setCurrentRoute(parsed.route);
      setAdminTab(parsed.adminTab);
      setSelectedWorkshopId(parsed.workshopId || null);
      setClientUsername(parsed.clientUsername || null);
      setIsDesignModalOpen(Boolean(parsed.openDesignModal));
      setViewMode(parsed.route === 'admin' ? 'admin' : 'store');
    };
    window.addEventListener('popstate', handlePop);
    window.addEventListener('hashchange', handlePop);
    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('hashchange', handlePop);
    };
  }, [setViewMode, isIntroOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (path === '/pedidos' || path === '/pedidos-movil' || path === '/pedidos-mobile' || path === '/alisto') {
        const isUserAdmin = currentUser?.role === 'admin' || Boolean(currentUser?.isMasterAdmin);
        const canonical = isUserAdmin ? '/usuario/admin/pedidos/apps' : '/usuario/colaborador/pedidos/apps';
        window.history.replaceState({ route: 'pedidos-mobile', adminTab: 'orders' }, '', canonical + window.location.search);
      } else if (path === '/mi-cuenta' || path === '/cuenta' || path === '/perfil') {
        const slug = currentUser?.clientSlug || currentUser?.username;
        if (slug) {
          window.history.replaceState({ route: 'mi-cuenta', adminTab: 'hub', clientUsername: slug }, '', `/usuario/webcliente/${slug}` + window.location.search);
        }
      }
    }
  }, [currentUser]);

  useEffect(() => { getActiveCampaignRef(); }, []);
  useEffect(() => setupGlobalHapticClickListener(), []);
  useEffect(() => initWaterDropButtonSounds(), []);

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const effectiveSection = currentRoute === 'admin' ? (adminTab === 'hub' ? 'admin' : `admin-${adminTab}`) : currentRoute;
      metricsTracker.recordPageView(effectiveSection, searchParams);
    } catch (e) {
      console.warn('Metrics tracking error', e);
    }
  }, [currentRoute, adminTab]);

  if (currentRoute === 'envios') {
    return (
      <React.Suspense fallback={<ShellFallback />}>
        <EnviosApp onNavigate={navigate} />
      </React.Suspense>
    );
  }

  const isCollaboratorRoute = currentRoute === 'pedidos-mobile' || currentRoute === 'inventario-app' || currentRoute === 'pwa-install';
  const isAdminRoute = currentRoute === 'admin' || currentRoute === 'superadmin' || currentRoute === 'metricas';

  return (
    <React.Suspense fallback={<ShellFallback />}>
      {isCollaboratorRoute ? (
        <CollaboratorPwaShell currentRoute={currentRoute} onNavigate={navigate} onSelectAdminTab={handleSelectAdminTab} />
      ) : isAdminRoute ? (
        <AdminPwaShell
          currentRoute={currentRoute}
          adminTab={adminTab}
          isDesignModalOpen={isDesignModalOpen}
          onOpenDesignModal={handleOpenDesignModal}
          onCloseDesignModal={handleCloseDesignModal}
          onSelectAdminTab={handleSelectAdminTab}
          onNavigate={navigate}
        />
      ) : (
        <WebShell currentRoute={currentRoute} selectedWorkshopId={selectedWorkshopId} onNavigate={navigate} clientUsername={clientUsername} />
      )}
    </React.Suspense>
  );
};

export default App;
