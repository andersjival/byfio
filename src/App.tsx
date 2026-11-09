import React, { useState, useEffect, useRef } from 'react';
import { useApp } from './context/AppContext';
import { AppRoute } from './types';
import { BackgroundDecor } from './components/common/BackgroundDecor';
import { Navbar } from './components/common/Navbar';
import { TikTokIcon } from './components/common/TikTokIcon';
import { FloatingMascot } from './components/common/FloatingMascot';
import { HomePage } from './components/store/HomePage';
import { StorePage } from './components/store/StorePage';
import { CatalogPage } from './components/store/CatalogPage';
import { WorkshopsPage } from './components/store/WorkshopsPage';
import { WorkshopDetailPage } from './components/store/WorkshopDetailPage';
import { CartDrawer } from './components/store/CartDrawer';
import { CheckoutModal } from './components/store/CheckoutModal';
import { PricingStickersSection } from './components/store/PricingStickersSection';
import { PaymentAccountsModal } from './components/common/PaymentAccountsModal';
import { StudioScheduleModal } from './components/common/StudioScheduleModal';
import { WebIntroOverlay } from './components/common/WebIntroOverlay';
import { AppEntryGatewayModal } from './components/common/AppEntryGatewayModal';
import { MobileOrdersView } from './components/mobile/MobileOrdersView';
import { PwaInstallPage } from './components/pwa/PwaInstallPage';
import { CartSuccessToast } from './components/common/CartSuccessToast';
import { NewOrderStarAlert } from './components/common/NewOrderStarAlert';
import { LoginModal } from './components/common/LoginModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminTabs, type AdminTabType } from './components/admin/AdminTabs';
import { AdminHubMenu } from './components/admin/AdminHubMenu';
import { AdminCatalogVisualView } from './components/admin/AdminCatalogVisualView';
import { OrdersQueue } from './components/admin/OrdersQueue';
import { InventoryTable } from './components/admin/InventoryTable';
import { CashRegisterReports } from './components/admin/CashRegisterReports';
import { WorkshopEnrollmentsSection } from './components/admin/WorkshopEnrollmentsSection';
import { UserProfilesSection } from './components/admin/UserProfilesSection';
import { CustomersSection } from './components/admin/CustomersSection';
import { Customer } from './types';
import { SupplierOrderModal } from './components/admin/SupplierOrderModal';
import { QrLabelModal } from './components/admin/QrLabelModal';
import { InvoiceModal } from './components/admin/InvoiceModal';
import { NewProductModal } from './components/admin/NewProductModal';
import { NewWorkshopModal } from './components/admin/NewWorkshopModal';
import { DailyClosingModal } from './components/admin/DailyClosingModal';
import { AdminDesignSettingsModal } from './components/admin/AdminDesignSettingsModal';
import { AdminPricingModal } from './components/admin/AdminPricingModal';
import { PwaManagerModal } from './components/admin/PwaManagerModal';
import { AdminMobileDock } from './components/admin/AdminMobileDock';
import { SinpePaymentsSection } from './components/admin/SinpePaymentsSection';
import { SuppliersOrdersSection } from './components/admin/SuppliersOrdersSection';
import { SalesHistorySection } from './components/admin/SalesHistorySection';

// Carga perezosa (Lazy Loading) de módulos pesados administrativos para carga móvil instantánea
const QuickBillingSection = React.lazy(() => import('./components/admin/QuickBillingSection').then((m) => ({ default: m.QuickBillingSection })));
const GuidedPickingModal = React.lazy(() => import('./components/admin/GuidedPickingModal').then((m) => ({ default: m.GuidedPickingModal })));
const AgendaSection = React.lazy(() => import('./components/admin/AgendaSection').then((m) => ({ default: m.AgendaSection })));
const MetricsPage = React.lazy(() => import('./components/admin/MetricsPage').then((m) => ({ default: m.MetricsPage })));
const PropuestaPage = React.lazy(() => import('./components/propuesta/PropuestaPage').then((m) => ({ default: m.PropuestaPage })));
const SuperadminSection = React.lazy(() => import('./components/superadmin/SuperadminSection').then((m) => ({ default: m.SuperadminSection })));

import { metricsTracker, appendRefToPath, getActiveCampaignRef } from './services/metricsTracker';
import { initWaterDropButtonSounds } from './utils/soundEffects';
import { setupGlobalHapticClickListener } from './utils/haptics';
import { parseRouteFromLocation, RouteInfo, isCollaboratorPwaContext } from './utils/routeHelpers';
import { MessageCircle, Instagram, LayoutGrid, ArrowLeft, Palette, CreditCard, Clock, MapPin, Film, Shield } from 'lucide-react';

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
    activePickingOrder,
    isSupplierModalOpen,
    qrModalProduct,
    invoiceOrder,
    isNewProductModalOpen,
    isNewWorkshopModalOpen,
    isPricingModalOpen,
    isSinpeModalOpen,
    setIsSinpeModalOpen,
    isModuleEnabled,
    isFeatureEnabled,
    isSuperAdminAuthenticated,
  } = useApp();
  const initial = parseRouteFromLocation();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(initial.route);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(initial.workshopId || null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDailyClosingOpen, setIsDailyClosingOpen] = useState(false);
  const [dailyClosingDate, setDailyClosingDate] = useState<string | undefined>(undefined);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(Boolean(initial.openDesignModal));
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTabType>(initial.adminTab);
  const [billingTargetCustomer, setBillingTargetCustomer] = useState<Customer | null>(null);
  const [isEntryGatewayOpen, setIsEntryGatewayOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    // Solo permitir que se abra en los módulos PWA de colaboradores; NUNCA en el home ni en la web pública
    if (!isCollaboratorPwaContext()) return false;
    const initialRoute = parseRouteFromLocation().route;
    if (initialRoute === 'home') return false;
    try {
      return !sessionStorage.getItem('byfio_entry_gateway_dismissed');
    } catch {
      return false;
    }
  });

  const handleOpenDesignModal = () => {
    setIsDesignModalOpen(true);
    try {
      sessionStorage.setItem('byfio_design_modal_open', 'true');
      window.history.pushState({ route: 'admin', adminTab: adminTab, openDesignModal: true }, '', appendRefToPath('/admin/configuracion'));
    } catch {}
  };

  const handleCloseDesignModal = () => {
    setIsDesignModalOpen(false);
    try {
      sessionStorage.removeItem('byfio_design_modal_open');
    } catch {}
    navigate('admin', adminTab);
  };

  const isAdminOrSuperadmin = isSuperAdminAuthenticated || (!!currentUser && (currentUser.role === 'admin' || !!currentUser.isMasterAdmin));

  const navigate = (newRoute: AppRoute, targetTab?: AdminTabType, workshopId?: string) => {
    // El video intro solo debe existir en la página principal (home)
    if (newRoute !== 'home' && isIntroOpen) {
      closeWebIntro();
    }

    setCurrentRoute(newRoute);
    setViewMode(newRoute === 'admin' ? 'admin' : 'store');

    const tab = targetTab !== undefined ? targetTab : (newRoute === 'admin' ? 'hub' : 'hub');
    setAdminTab(tab);

    const wsId = workshopId !== undefined ? workshopId : selectedWorkshopId;
    setSelectedWorkshopId(wsId);

    let targetPath = '/';
    if (newRoute === 'superadmin') targetPath = '/panel/superadmin';
    else if (newRoute === 'propuesta') targetPath = '/propuesta';
    else if (newRoute === 'metricas') targetPath = '/metricas';
    else if (newRoute === 'login') targetPath = '/login';
    else if (newRoute === 'precios') targetPath = '/precios';
    else if (newRoute === 'catalogo') targetPath = '/catalogo';
    else if (newRoute === 'store') targetPath = '/tienda';
    else if (newRoute === 'pedidos-mobile') targetPath = '/pedidos';
    else if (newRoute === 'pwa-install') targetPath = '/instalar-app';
    else if (newRoute === 'workshops') targetPath = '/talleres';
    else if (newRoute === 'workshop-detail') targetPath = `/talleres/${wsId || ''}`;
    else if (newRoute === 'admin') {
      if (tab === 'orders') targetPath = '/admin/pedidos';
      else if (tab === 'billing') targetPath = '/admin/facturacion';
      else if (tab === 'inventory') targetPath = '/admin/inventario';
      else if (tab === 'reports') targetPath = '/admin/caja';
      else if (tab === 'sinpe') targetPath = '/admin/sinpe';
      else if (tab === 'workshops') targetPath = '/admin/talleres';
      else if (tab === 'pricing') targetPath = '/admin/precios';
      else if (tab === 'users') targetPath = '/admin/usuarios';
      else if (tab === 'customers') targetPath = '/admin/clientes';
      else if (tab === 'agenda') targetPath = '/admin/agenda';
      else if (tab === 'suppliers') targetPath = '/admin/proveedores';
      else if (tab === 'sales') targetPath = '/admin/ventas';
      else targetPath = '/admin';
    }

    // Preservar siempre el parámetro de campaña (?ref=...) para que no se pierda en la navegación
    targetPath = appendRefToPath(targetPath);

    try {
      sessionStorage.setItem('byfio_last_active_route', newRoute);
      if (tab) sessionStorage.setItem('byfio_last_admin_tab', tab);
      if (wsId) sessionStorage.setItem('byfio_last_ws_id', wsId);
      else sessionStorage.removeItem('byfio_last_ws_id');
      window.history.pushState({ route: newRoute, adminTab: tab, workshopId: wsId }, '', targetPath);
    } catch {
      window.location.hash = targetPath.replace('/', '#');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAdminTab = (tab: AdminTabType) => {
    if (tab === 'catalog-view') {
      navigate('admin', tab);
      return;
    }
    if (tab !== 'hub' && (!isModuleEnabled(tab) || !hasPermission(tab))) {
      navigate('admin', 'hub');
      return;
    }
    navigate('admin', tab);
  };

  // Protección: Si el módulo activo fue desactivado por Superadmin o revocado al colaborador, volver al Hub de inmediato
  useEffect(() => {
    if (currentRoute === 'admin' && adminTab !== 'hub') {
      if (adminTab === 'catalog-view') {
        // catalog-view está disponible dentro del panel admin
      } else if (!isModuleEnabled(adminTab) || !hasPermission(adminTab)) {
        setAdminTab('hub');
      }
    } else if ((currentRoute === 'workshops' || currentRoute === 'workshop-detail') && !isModuleEnabled('workshops')) {
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

  // Redirigir a portada si se cierra sesión estando en admin para que la cortina cubra la tienda limpia
  useEffect(() => {
    if (isLogoutTransitionOpen && currentRoute === 'admin') {
      navigate('home');
    }
  }, [isLogoutTransitionOpen, currentRoute]);

  // Redirigir al módulo independiente de pagos SINPE si se solicita su apertura
  useEffect(() => {
    if (isSinpeModalOpen) {
      setIsSinpeModalOpen(false);
      navigate('admin', 'sinpe');
    }
  }, [isSinpeModalOpen]);

  // Sync with browser Back/Forward & hash changes
  useEffect(() => {
    const handlePop = () => {
      const parsed = parseRouteFromLocation();
      if (parsed.route !== 'home' && isIntroOpen) {
        closeWebIntro();
      }
      setCurrentRoute(parsed.route);
      setAdminTab(parsed.adminTab);
      setSelectedWorkshopId(parsed.workshopId || null);
      setIsDesignModalOpen(Boolean(parsed.openDesignModal));
      setViewMode(parsed.route === 'admin' ? 'admin' : 'store');
    };

    window.addEventListener('popstate', handlePop);
    window.addEventListener('hashchange', handlePop);
    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('hashchange', handlePop);
    };
  }, [setViewMode]);

  // Inicializar y persistir el parámetro de campaña al entrar al sitio
  useEffect(() => {
    getActiveCampaignRef();
  }, []);

  // Respuesta háptica táctil y vibración suave y corta en clics e interacciones de la web
  useEffect(() => {
    const cleanupHaptics = setupGlobalHapticClickListener();
    return cleanupHaptics;
  }, []);

  // Sonido háptico/orgánico de gotas de agua al hacer clic en botones
  useEffect(() => {
    const cleanupSounds = initWaterDropButtonSounds();
    return cleanupSounds;
  }, []);

  // Rastrear vistas de páginas, dispositivos (PC/Móvil) y enlaces generados (incluyendo panel admin y submódulos)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const effectiveSection = currentRoute === 'admin'
        ? (adminTab === 'hub' ? 'admin' : `admin-${adminTab}`)
        : currentRoute;
      metricsTracker.recordPageView(effectiveSection, searchParams);
    } catch (e) {
      console.warn('Metrics tracking error', e);
    }
  }, [currentRoute, adminTab]);

  const hasAutoRedirectedAlistoRef = useRef<string | null>(null);

  // Auto-seleccionar Cola de Pedidos únicamente al iniciar sesión si el colaborador ingresa con perfil exclusivo de Alisto
  useEffect(() => {
    if (currentUser?.role === 'staff' && currentRoute === 'admin') {
      const userKey = currentUser.id || currentUser.name;
      if (hasAutoRedirectedAlistoRef.current !== userKey) {
        hasAutoRedirectedAlistoRef.current = userKey;
        const isAlistoOnly = currentUser.permissions?.orders && !currentUser.permissions?.billing && !currentUser.permissions?.inventory;
        if (isAlistoOnly && adminTab === 'hub') {
          setAdminTab('orders');
        }
      }
    } else if (!currentUser) {
      hasAutoRedirectedAlistoRef.current = null;
    }
  }, [currentUser, currentRoute]);

  if (currentRoute === 'pedidos-mobile') {
    return (
      <ErrorBoundary fallbackTitle="Inconveniente al cargar la vista de pedidos">
        <MobileOrdersView onNavigate={navigate} />
      </ErrorBoundary>
    );
  }

  if (currentRoute === 'pwa-install') {
    return (
      <ErrorBoundary fallbackTitle="Inconveniente al cargar el portal de instalación">
        <PwaInstallPage onNavigate={navigate} onSelectAdminTab={setAdminTab} />
      </ErrorBoundary>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-fio-300 selection:text-fio-900 text-slate-800 overflow-x-hidden w-full max-w-full">
      {/* Fondo Decorativo Sereno Estilo Cerámico / Zen */}
      <BackgroundDecor />

      <div className="flex-1 flex flex-col">
        <Navbar
          currentRoute={currentRoute}
          onNavigate={navigate}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenDesignModal={handleOpenDesignModal}
          onSelectAdminHub={() => handleSelectAdminTab('hub')}
          isAdminHub={adminTab === 'hub'}
        />

        {currentRoute === 'home' ? (
          <main className="w-full pb-10">
            <ErrorBoundary fallbackTitle="Error al cargar la portada">
              <HomePage onNavigate={navigate} />
            </ErrorBoundary>
          </main>
        ) : (
          <main className={`w-full mx-auto px-2.5 sm:px-4 lg:px-6 pt-2 sm:pt-4 pb-8 ${currentRoute === 'admin' ? 'max-w-[1600px]' : 'max-w-7xl'}`}>
            <ErrorBoundary fallbackTitle="Inconveniente al cargar la sección">
              {currentRoute === 'login' && (
                <LoginModal
                  isOpen={true}
                  onClose={() => navigate('home')}
                  isStandalonePage={true}
                  onSuccess={(user) => {
                    if (user.email === 'superadmin@byfio.com') {
                      navigate('superadmin');
                    } else if (user.role === 'admin' || user.role === 'staff') {
                      const isAlistoOnly = user.role === 'staff' && user.permissions?.orders && !user.permissions?.billing && !user.permissions?.inventory;
                      navigate('admin', isAlistoOnly ? 'orders' : undefined);
                    } else {
                      navigate('home');
                    }
                  }}
                />
              )}

              {currentRoute === 'store' && isModuleEnabled('store') && <StorePage onNavigate={navigate} />}

              {currentRoute === 'catalogo' && isModuleEnabled('catalogo') && <CatalogPage onNavigate={navigate} />}

              {currentRoute === 'workshops' && isModuleEnabled('workshops') && <WorkshopsPage onNavigate={navigate} />}

              {currentRoute === 'precios' && isModuleEnabled('pricing') && <PricingStickersSection onNavigate={navigate} />}

              {currentRoute === 'workshop-detail' && isModuleEnabled('workshops') && (
                <WorkshopDetailPage
                  workshopId={selectedWorkshopId}
                  onNavigate={navigate}
                />
              )}

              {currentRoute === 'metricas' && isModuleEnabled('metricas') && (
                isAdminOrSuperadmin ? (
                  <React.Suspense fallback={<div className="py-16 text-center font-bubble text-sm text-slate-400">Cargando métricas...</div>}>
                    <MetricsPage onNavigate={navigate} />
                  </React.Suspense>
                ) : (
                  <div className="py-12 max-w-md mx-auto text-center space-y-4 animate-fadeIn">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center shadow-inner">
                      <Shield className="w-7 h-7" />
                    </div>
                    <h3 className="font-bubble font-bold text-xl text-slate-800">Acceso Restringido</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      El panel de métricas y rastreo es confidencial y solo está autorizado para el admin y superadmin.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('home')}
                      className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      Regresar al Inicio
                    </button>
                  </div>
                )
              )}

              {currentRoute === 'propuesta' && (
                <React.Suspense fallback={<div className="py-16 text-center font-bubble text-sm text-slate-400">Cargando propuesta...</div>}>
                  <PropuestaPage onNavigate={navigate} />
                </React.Suspense>
              )}

              {currentRoute === 'superadmin' && (
                <React.Suspense fallback={<div className="py-16 text-center font-bubble text-sm text-slate-400">Cargando panel de superadmin...</div>}>
                  <SuperadminSection onNavigate={navigate} />
                </React.Suspense>
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
                          if (user.email === 'superadmin@byfio.com') {
                            navigate('superadmin');
                          } else if (user.role === 'admin' || user.role === 'staff') {
                            const isAlistoOnly = user.role === 'staff' && user.permissions?.orders && !user.permissions?.billing && !user.permissions?.inventory;
                            navigate('admin', isAlistoOnly ? 'orders' : undefined);
                          } else {
                            navigate('home');
                          }
                        }}
                      />
                    </div>
                  ) : null
                ) : (
                  <div className="space-y-3 sm:space-y-4 pb-20 sm:pb-4">
                    {/* Si está en el Menú Principal (Hub) - Renderizado Instantáneo 0ms */}
                    {adminTab === 'hub' ? (
                      <>
                        <AdminHeader onOpenDesignModal={handleOpenDesignModal} onOpenPwaModal={() => setIsPwaModalOpen(true)} onNavigate={navigate} onSelectTab={handleSelectAdminTab} />
                        <AdminHubMenu onSelectTab={handleSelectAdminTab} onNavigate={navigate} onOpenPwaModal={() => setIsPwaModalOpen(true)} />
                      </>
                    ) : (
                      /* Si está dentro de una sección específica */
                      <>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <button
                            type="button"
                            onClick={() => handleSelectAdminTab('hub')}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-pink-50 text-fio-900 hover:text-fio-pink border border-slate-200/90 shadow-2xs font-bubble font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
                            title="Volver al Menú de Administración"
                          >
                            <ArrowLeft className="w-4 h-4 text-fio-pink shrink-0" />
                            <span className="whitespace-nowrap">← Volver al Menú</span>
                          </button>
                        </div>

                        {adminTab === 'orders' && <OrdersQueue />}
                        {adminTab === 'billing' && (
                          <React.Suspense fallback={<div className="py-12 text-center text-slate-400 font-bubble text-sm">Cargando facturación rápida...</div>}>
                            <QuickBillingSection
                              initialCustomer={billingTargetCustomer}
                              onClearInitialCustomer={() => setBillingTargetCustomer(null)}
                            />
                          </React.Suspense>
                        )}
                        {adminTab === 'inventory' && <InventoryTable />}
                        {adminTab === 'reports' && (
                          <CashRegisterReports
                            onOpenDailyClosing={(date) => {
                              setDailyClosingDate(date);
                              setIsDailyClosingOpen(true);
                            }}
                            onNavigateToSinpe={() => handleSelectAdminTab('sinpe')}
                          />
                        )}
                        {adminTab === 'sinpe' && <SinpePaymentsSection />}
                        {adminTab === 'workshops' && <WorkshopEnrollmentsSection onNavigateToSinpe={() => handleSelectAdminTab('sinpe')} />}
                        {adminTab === 'pricing' && <PricingStickersSection onNavigate={navigate} />}
                        {adminTab === 'users' && <UserProfilesSection />}
                        {adminTab === 'customers' && (
                          <CustomersSection
                            onSelectCustomerForBilling={(cust) => {
                              setBillingTargetCustomer(cust);
                              handleSelectAdminTab('billing');
                            }}
                          />
                        )}
                        {adminTab === 'agenda' && (
                          <React.Suspense fallback={<div className="py-12 text-center text-slate-400 font-bubble text-sm">Cargando agenda...</div>}>
                            <AgendaSection />
                          </React.Suspense>
                        )}
                        {adminTab === 'suppliers' && <SuppliersOrdersSection />}
                        {adminTab === 'sales' && <SalesHistorySection />}
                        {adminTab === 'catalog-view' && (
                          <AdminCatalogVisualView onBackToHub={() => handleSelectAdminTab('hub')} />
                        )}
                      </>
                    )}
                  </div>
                )
              )}
            </ErrorBoundary>
          </main>
        )}
      </div>

      {/* Footer Global: Badge animado de GeoSoft visible en todo momento excepto en la sección admin o superadmin */}
      {currentRoute !== 'admin' && currentRoute !== 'superadmin' && (
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
          if (currentRoute === 'admin' && !currentUser) {
            navigate('home');
          }
        }}
        onSuccess={(user) => {
          setIsLoginModalOpen(false);
          closeLogoutTransition();
          if (user.email === 'superadmin@byfio.com') {
            navigate('superadmin');
          } else if (user.role === 'admin' || user.role === 'staff') {
            navigate('admin');
          } else {
            navigate('home');
          }
        }}
      />
      <CartSuccessToast />
      {Boolean(isSuperAdminAuthenticated || currentUser) && (
        <NewOrderStarAlert />
      )}
      {/* El video intro solo debe cargar y mostrarse en la página principal (home) */}
      {currentRoute === 'home' && isIntroOpen && (
        <WebIntroOverlay
          isOpen={isIntroOpen}
          onFinish={closeWebIntro}
          onSelectStore={() => {
            closeWebIntro();
            navigate('store');
          }}
          onSelectOrders={() => {
            closeWebIntro();
            navigate('pedidos-mobile');
          }}
        />
      )}

      {/* Modal de Entrada Dual: Exclusivo para módulos PWA de colaboradores (NUNCA en el home) */}
      {isCollaboratorPwaContext() && currentRoute !== 'home' && (
        <AppEntryGatewayModal
          isOpen={isEntryGatewayOpen && !isIntroOpen}
          onSelectStore={() => {
            try { sessionStorage.setItem('byfio_entry_gateway_dismissed', '1'); } catch {}
            setIsEntryGatewayOpen(false);
            navigate('store');
          }}
          onSelectOrders={() => {
            try { sessionStorage.setItem('byfio_entry_gateway_dismissed', '1'); } catch {}
            setIsEntryGatewayOpen(false);
            navigate('pedidos-mobile');
          }}
          onClose={() => {
            try { sessionStorage.setItem('byfio_entry_gateway_dismissed', '1'); } catch {}
            setIsEntryGatewayOpen(false);
          }}
        />
      )}
      <FloatingMascot currentRoute={currentRoute} />
      {isModuleEnabled('store') && isFeatureEnabled('store', 'interactive_cart') && (
        <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      )}
      {/* Centro de Aplicaciones PWA (PC & Celular) */}
      <PwaManagerModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        onSelectAdminTab={handleSelectAdminTab}
        onNavigate={navigate}
      />

      {/* Dock Táctil Inferior para Navegación Móvil de Administración */}
      {currentRoute === 'admin' && Boolean(currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff')) && (
        <AdminMobileDock
          activeTab={adminTab}
          onSelectTab={handleSelectAdminTab}
        />
      )}

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <PaymentAccountsModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} />
      <StudioScheduleModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />
      {/* Modales Administrativos Diferidos (cargados estrictamente bajo demanda para no ralentizar la web) */}
      <React.Suspense fallback={null}>
        {activePickingOrder && <GuidedPickingModal />}
        {isSupplierModalOpen && isFeatureEnabled('inventory', 'supplier_list') && <SupplierOrderModal />}
        {qrModalProduct && isFeatureEnabled('inventory', 'qr_labels') && <QrLabelModal />}
        {invoiceOrder && <InvoiceModal />}
        {isNewProductModalOpen && <NewProductModal />}
        {isNewWorkshopModalOpen && <NewWorkshopModal />}
        {isDailyClosingOpen && isFeatureEnabled('reports', 'daily_closing') && (
          <DailyClosingModal
            isOpen={isDailyClosingOpen}
            initialDate={dailyClosingDate}
            onClose={() => {
              setIsDailyClosingOpen(false);
              setDailyClosingDate(undefined);
            }}
          />
        )}
        {isDesignModalOpen && <AdminDesignSettingsModal isOpen={isDesignModalOpen} onClose={handleCloseDesignModal} />}
        {isPricingModalOpen && <AdminPricingModal />}
      </React.Suspense>
    </div>
  );
};

export default App;
