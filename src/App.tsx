import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { AppRoute } from './types';
import { BackgroundDecor } from './components/common/BackgroundDecor';
import { Navbar } from './components/common/Navbar';
import { TikTokIcon } from './components/common/TikTokIcon';
import { TreeNavigation } from './components/common/TreeNavigation';
import { FloatingMascot } from './components/common/FloatingMascot';
import { HomePage } from './components/store/HomePage';
import { StorePage } from './components/store/StorePage';
import { CatalogPage } from './components/store/CatalogPage';
import { WorkshopsPage } from './components/store/WorkshopsPage';
import { WorkshopDetailPage } from './components/store/WorkshopDetailPage';
import { CartDrawer } from './components/store/CartDrawer';
import { CheckoutModal } from './components/store/CheckoutModal';
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminTabs, AdminTabType } from './components/admin/AdminTabs';
import { AdminHubMenu } from './components/admin/AdminHubMenu';
import { OrdersQueue } from './components/admin/OrdersQueue';
import { QuickBillingSection } from './components/admin/QuickBillingSection';
import { InventoryTable } from './components/admin/InventoryTable';
import { CashRegisterReports } from './components/admin/CashRegisterReports';
import { GuidedPickingModal } from './components/admin/GuidedPickingModal';
import { SupplierOrderModal } from './components/admin/SupplierOrderModal';
import { QrLabelModal } from './components/admin/QrLabelModal';
import { InvoiceModal } from './components/admin/InvoiceModal';
import { NewProductModal } from './components/admin/NewProductModal';
import { NewWorkshopModal } from './components/admin/NewWorkshopModal';
import { DailyClosingModal } from './components/admin/DailyClosingModal';
import { WorkshopEnrollmentsSection } from './components/admin/WorkshopEnrollmentsSection';
import { AdminDesignSettingsModal } from './components/admin/AdminDesignSettingsModal';
import { AdminPricingModal } from './components/admin/AdminPricingModal';
import { PricingStickersSection } from './components/store/PricingStickersSection';
import { PaymentAccountsModal } from './components/common/PaymentAccountsModal';
import { StudioScheduleModal } from './components/common/StudioScheduleModal';
import { WebIntroOverlay } from './components/common/WebIntroOverlay';
import { CartSuccessToast } from './components/common/CartSuccessToast';
import { LoginModal } from './components/common/LoginModal';
import { UserProfilesSection } from './components/admin/UserProfilesSection';
import { MetricsPage } from './components/admin/MetricsPage';
import { metricsTracker } from './services/metricsTracker';
import { initWaterDropButtonSounds } from './utils/soundEffects';
import { MessageCircle, Instagram, LayoutGrid, ArrowLeft, Palette, CreditCard, Clock, MapPin, Film, Shield } from 'lucide-react';

interface RouteInfo {
  route: AppRoute;
  adminTab: AdminTabType;
  workshopId?: string | null;
}

const parseRouteFromLocation = (): RouteInfo => {
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

export const App: React.FC = () => {
  const {
    setViewMode,
    colorTheme,
    isIntroOpen,
    closeWebIntro,
    playWebIntro,
    currentUser,
    hasPermission,
    isLogoutTransitionOpen,
    closeLogoutTransition,
  } = useApp();
  const initial = parseRouteFromLocation();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(initial.route);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(initial.workshopId || null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDailyClosingOpen, setIsDailyClosingOpen] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTabType>(initial.adminTab);

  const navigate = (newRoute: AppRoute, targetTab?: AdminTabType, workshopId?: string) => {
    setCurrentRoute(newRoute);
    setViewMode(newRoute === 'admin' ? 'admin' : 'store');

    const tab = targetTab !== undefined ? targetTab : (newRoute === 'admin' ? 'hub' : 'hub');
    setAdminTab(tab);

    const wsId = workshopId !== undefined ? workshopId : selectedWorkshopId;
    setSelectedWorkshopId(wsId);

    let targetPath = '/';
    if (newRoute === 'metricas') targetPath = '/metricas';
    else if (newRoute === 'login') targetPath = '/login';
    else if (newRoute === 'precios') targetPath = '/precios';
    else if (newRoute === 'catalogo') targetPath = '/catalogo';
    else if (newRoute === 'store') targetPath = '/tienda';
    else if (newRoute === 'workshops') targetPath = '/talleres';
    else if (newRoute === 'workshop-detail') targetPath = `/talleres/${wsId || ''}`;
    else if (newRoute === 'admin') {
      if (tab === 'orders') targetPath = '/admin/pedidos';
      else if (tab === 'billing') targetPath = '/admin/facturacion';
      else if (tab === 'inventory') targetPath = '/admin/inventario';
      else if (tab === 'reports') targetPath = '/admin/caja';
      else if (tab === 'workshops') targetPath = '/admin/talleres';
      else if (tab === 'pricing') targetPath = '/admin/precios';
      else if (tab === 'users') targetPath = '/admin/usuarios';
      else targetPath = '/admin';
    }

    try {
      window.history.pushState({ route: newRoute, adminTab: tab, workshopId: wsId }, '', targetPath);
    } catch {
      window.location.hash = targetPath.replace('/', '#');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAdminTab = (tab: AdminTabType) => {
    navigate('admin', tab);
  };

  // Redirigir a portada si se cierra sesión estando en admin para que la cortina cubra la tienda limpia
  useEffect(() => {
    if (isLogoutTransitionOpen && currentRoute === 'admin') {
      navigate('home');
    }
  }, [isLogoutTransitionOpen, currentRoute]);

  // Sync with browser Back/Forward & hash changes
  useEffect(() => {
    const handlePop = () => {
      const parsed = parseRouteFromLocation();
      setCurrentRoute(parsed.route);
      setAdminTab(parsed.adminTab);
      setSelectedWorkshopId(parsed.workshopId || null);
      setViewMode(parsed.route === 'admin' ? 'admin' : 'store');
    };

    window.addEventListener('popstate', handlePop);
    window.addEventListener('hashchange', handlePop);
    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('hashchange', handlePop);
    };
  }, [setViewMode]);

  // Sonido háptico/orgánico de gotas de agua al hacer clic en botones
  useEffect(() => {
    const cleanupSounds = initWaterDropButtonSounds();
    return cleanupSounds;
  }, []);

  // Rastrear vistas de páginas, dispositivos (PC/Móvil) y enlaces generados
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      metricsTracker.recordPageView(currentRoute, searchParams);
    } catch (e) {
      console.warn('Metrics tracking error', e);
    }
  }, [currentRoute]);

  const adminBreadcrumbs = [
    { label: 'by.fio', route: 'home' as AppRoute },
    ...(adminTab === 'hub'
      ? [{ label: 'administración' }]
      : [
          {
            label:
              adminTab === 'orders'
                ? 'cola de pedidos'
                : adminTab === 'billing'
                ? 'facturación rápida'
                : adminTab === 'inventory'
                ? 'inventario & qr'
                : adminTab === 'reports'
                ? 'caja & reportes'
                : adminTab === 'pricing'
                ? 'precios & stickers'
                : adminTab === 'users'
                ? 'perfiles de usuarios'
                : 'talleres & inscripciones',
          },
        ]),
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-fio-300 selection:text-fio-900 text-slate-800 overflow-x-hidden w-full max-w-full">
      {/* Fondo Decorativo Sereno Estilo Cerámico / Zen */}
      <BackgroundDecor />

      <div className="flex-1 flex flex-col">
        <Navbar
          currentRoute={currentRoute}
          onNavigate={navigate}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenDesignModal={() => setIsDesignModalOpen(true)}
          onSelectAdminHub={() => handleSelectAdminTab('hub')}
          isAdminHub={adminTab === 'hub'}
        />

        {currentRoute === 'home' ? (
          <main className="w-full pb-10">
            <HomePage onNavigate={navigate} />
          </main>
        ) : (
          <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-8">
            {currentRoute === 'login' && (
              <LoginModal
                isOpen={true}
                onClose={() => navigate('home')}
                isStandalonePage={true}
                onSuccess={(user) => {
                  if (user.role === 'admin' || user.role === 'staff') {
                    navigate('admin');
                  } else {
                    navigate('home');
                  }
                }}
              />
            )}

            {currentRoute === 'store' && <StorePage onNavigate={navigate} />}

            {currentRoute === 'catalogo' && <CatalogPage onNavigate={navigate} />}

            {currentRoute === 'workshops' && <WorkshopsPage onNavigate={navigate} />}

            {currentRoute === 'precios' && <PricingStickersSection onNavigate={navigate} />}

            {currentRoute === 'workshop-detail' && (
              <WorkshopDetailPage
                workshopId={selectedWorkshopId}
                onNavigate={navigate}
              />
            )}

            {currentRoute === 'metricas' && (
              <MetricsPage onNavigate={navigate} />
            )}

            {currentRoute === 'admin' && (
              !currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'staff') ? (
                /* Puerta de Entrada Segura a Administración con URL Protegida (oculta durante la cortina de logout) */
                !isLogoutTransitionOpen ? (
                  <div className="py-6 sm:py-10 max-w-[395px] mx-auto space-y-4 animate-fadeIn">
                    <div className="text-center space-y-2 mb-2">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-fio-purple font-bubble font-bold text-xs shadow-neuBtn">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Acceso Seguro a Administración</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bubble font-bold text-slate-900">
                        Inicia Sesión para Continuar
                      </h2>
                      <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
                        Esta área está protegida. Ingresa tus credenciales maestras de administradora o tu código PIN de 4 dígitos.
                      </p>
                    </div>

                    <LoginModal
                      isOpen={true}
                      onClose={() => navigate('home')}
                      isStandalonePage={true}
                      onSuccess={(user) => {
                        if (user.role === 'admin' || user.role === 'staff') {
                          navigate('admin');
                        } else {
                          navigate('home');
                        }
                      }}
                    />
                  </div>
                ) : null
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {/* Barra de Árbol de Navegación Compacta */}
                  <div className="flex items-center justify-between gap-2.5 pb-0.5">
                    <TreeNavigation nodes={adminBreadcrumbs} onNavigate={navigate} />
                  </div>

                  {/* Si está en el Menú Principal (Hub) */}
                  {adminTab === 'hub' ? (
                    <>
                      <AdminHeader onOpenDesignModal={() => setIsDesignModalOpen(true)} />
                      <AdminHubMenu onSelectTab={handleSelectAdminTab} />
                    </>
                  ) : (
                    /* Si está dentro de una sección específica */
                    <>
                      <AdminTabs activeTab={adminTab} setActiveTab={handleSelectAdminTab} />

                      {adminTab === 'orders' && <OrdersQueue />}
                      {adminTab === 'billing' && <QuickBillingSection />}
                      {adminTab === 'inventory' && <InventoryTable />}
                      {adminTab === 'reports' && (
                        <CashRegisterReports onOpenDailyClosing={() => setIsDailyClosingOpen(true)} />
                      )}
                      {adminTab === 'workshops' && <WorkshopEnrollmentsSection />}
                      {adminTab === 'pricing' && <PricingStickersSection onNavigate={navigate} />}
                      {adminTab === 'users' && <UserProfilesSection />}
                    </>
                  )}
                </div>
              )
            )}
        </main>
      )}
      </div>

      {/* Footer Global: Badge animado de GeoSoft visible en todo momento excepto en la sección admin */}
      {currentRoute !== 'admin' && (
        <footer className="w-full py-5 text-center mt-auto pb-8 z-10">
          <div className="geosoft-copyright-pill px-4 py-1.5">
            <a
              href="https://www.geosoft.lat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm tracking-wider hover:opacity-90 transition-opacity font-bubble"
              title="Desarrollado por GeoSoft"
            >
              <span className="animate-copyright-sweep font-bold">
                © Copyright en byfio by GeoSoft
              </span>
            </a>
          </div>
        </footer>
      )}

      {/* Modales y Elementos Flotantes Globales */}
      <LoginModal
        key={isLogoutTransitionOpen ? 'logout-curtain' : 'standard-login'}
        isOpen={isLoginModalOpen || isLogoutTransitionOpen}
        isLogoutCurtain={isLogoutTransitionOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          closeLogoutTransition();
          if (currentRoute === 'admin') {
            navigate('home');
          }
        }}
        onSuccess={(user) => {
          setIsLoginModalOpen(false);
          closeLogoutTransition();
          if (user.role === 'admin' || user.role === 'staff') {
            navigate('admin');
          } else {
            navigate('home');
          }
        }}
      />
      <CartSuccessToast />
      <WebIntroOverlay isOpen={isIntroOpen} onFinish={closeWebIntro} />
      <FloatingMascot currentRoute={currentRoute} />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <PaymentAccountsModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} />
      <StudioScheduleModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />
      <GuidedPickingModal />
      <SupplierOrderModal />
      <QrLabelModal />
      <InvoiceModal />
      <NewProductModal />
      <NewWorkshopModal />
      <DailyClosingModal isOpen={isDailyClosingOpen} onClose={() => setIsDailyClosingOpen(false)} />
      <AdminDesignSettingsModal isOpen={isDesignModalOpen} onClose={() => setIsDesignModalOpen(false)} />
      <AdminPricingModal />
    </div>
  );
};

export default App;
