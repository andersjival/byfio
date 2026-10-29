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
import { MessageCircle, Instagram, LayoutGrid, ArrowLeft, Palette } from 'lucide-react';

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
  if (path.startsWith('/admin') || path.startsWith('/administracion') || hash.includes('admin')) {
    return { route: 'admin', adminTab: 'hub' };
  }

  // Rutas públicas
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
  const { setViewMode, colorTheme } = useApp();
  const initial = parseRouteFromLocation();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(initial.route);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(initial.workshopId || null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDailyClosingOpen, setIsDailyClosingOpen] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTabType>(initial.adminTab);

  const navigate = (newRoute: AppRoute, targetTab?: AdminTabType, workshopId?: string) => {
    setCurrentRoute(newRoute);
    setViewMode(newRoute === 'admin' ? 'admin' : 'store');

    const tab = targetTab !== undefined ? targetTab : (newRoute === 'admin' ? 'hub' : 'hub');
    setAdminTab(tab);

    const wsId = workshopId !== undefined ? workshopId : selectedWorkshopId;
    setSelectedWorkshopId(wsId);

    let targetPath = '/';
    if (newRoute === 'store') targetPath = '/tienda';
    else if (newRoute === 'workshops') targetPath = '/talleres';
    else if (newRoute === 'workshop-detail') targetPath = `/talleres/${wsId || ''}`;
    else if (newRoute === 'admin') {
      if (tab === 'orders') targetPath = '/admin/pedidos';
      else if (tab === 'billing') targetPath = '/admin/facturacion';
      else if (tab === 'inventory') targetPath = '/admin/inventario';
      else if (tab === 'reports') targetPath = '/admin/caja';
      else if (tab === 'workshops') targetPath = '/admin/talleres';
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
                : 'talleres & inscripciones',
          },
        ]),
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-fio-300 selection:text-fio-900 text-slate-800">
      {/* Fondo Decorativo Sereno Estilo Cerámico / Zen */}
      <BackgroundDecor />

      <div>
        <Navbar currentRoute={currentRoute} onNavigate={navigate} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-8">
          {currentRoute === 'home' && <HomePage onNavigate={navigate} />}

          {currentRoute === 'store' && <StorePage onNavigate={navigate} />}

          {currentRoute === 'workshops' && <WorkshopsPage onNavigate={navigate} />}

          {currentRoute === 'workshop-detail' && (
            <WorkshopDetailPage
              workshopId={selectedWorkshopId}
              onNavigate={navigate}
            />
          )}

          {currentRoute === 'admin' && (
            <div className="space-y-3 sm:space-y-4">
              {/* Barra de Árbol y Acciones Superiores (Ultra-Compacta, Sube el Contenido) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-0.5">
                <TreeNavigation nodes={adminBreadcrumbs} onNavigate={navigate} />

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {/* Botón Diseño & Letra (Detalles de Personalización del Sitio) */}
                  <button
                    type="button"
                    onClick={() => setIsDesignModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-white/80 shadow-xs transition-all active:scale-95"
                    title="Ajustar paleta de colores y tipografía de todo el sitio"
                  >
                    <Palette className="w-3.5 h-3.5 text-fio-pink" />
                    <span>Diseño &amp; Letra</span>
                    <span className="text-[10px] text-fio-600 bg-fio-100 px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                      {colorTheme === 'vibrant' ? 'Morado' : 'Zen'}
                    </span>
                  </button>

                  {/* Botón Menú Principal (al lado de Diseño & Letra) */}
                  {adminTab !== 'hub' && (
                    <button
                      type="button"
                      onClick={() => handleSelectAdminTab('hub')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                    >
                      <LayoutGrid className="w-3.5 h-3.5 text-fio-yellow" />
                      <span>Menú Principal</span>
                    </button>
                  )}
                </div>
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
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer con Redes Sociales (TikTok, Instagram, WhatsApp) */}
      <footer className="mt-16 border-t border-slate-200/60 bg-white/70 backdrop-blur-md py-8 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <p className="font-serif text-sm sm:text-base text-slate-800 tracking-[0.15em] uppercase font-normal">
            by.fio — Talleres Creativos &amp; Tienda Online • Costa Rica
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium text-slate-600">
            <a
              href="https://wa.me/50664004640?text=Hola%20Fio!%20Vengo%20de%20la%20página%20web"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>WhatsApp 6400-4640</span>
            </a>

            <span className="text-slate-300">•</span>

            <a
              href="https://instagram.com/by_fio10"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-fio-pink transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-fio-pink" />
              <span>Instagram @by_fio10</span>
            </a>

            <span className="text-slate-300">•</span>

            {/* TikTok Oficial: https://www.tiktok.com/@by_fio/ */}
            <a
              href="https://www.tiktok.com/@by_fio/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-black transition-colors"
            >
              <TikTokIcon className="w-3.5 h-3.5" />
              <span>TikTok @by_fio</span>
            </a>

            <span className="text-slate-300">•</span>

            <span>San José, Costa Rica 🇨🇷</span>
          </div>

          {currentRoute !== 'admin' && (
            <div>
              <button
                type="button"
                onClick={() => navigate('admin')}
                className="inline-block mt-2 text-[11px] text-slate-400 hover:text-fio-800 transition-colors underline underline-offset-4"
              >
                Acceso Administración (WMS &amp; Alisto)
              </button>
            </div>
          )}
        </div>
      </footer>

      {/* Modales y Elementos Flotantes Globales */}
      <FloatingMascot />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <GuidedPickingModal />
      <SupplierOrderModal />
      <QrLabelModal />
      <InvoiceModal />
      <NewProductModal />
      <NewWorkshopModal />
      <DailyClosingModal isOpen={isDailyClosingOpen} onClose={() => setIsDailyClosingOpen(false)} />
      <AdminDesignSettingsModal isOpen={isDesignModalOpen} onClose={() => setIsDesignModalOpen(false)} />
    </div>
  );
};

export default App;
