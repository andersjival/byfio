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
import { MessageCircle, Instagram, LayoutGrid, ArrowLeft } from 'lucide-react';

interface RouteInfo {
  route: AppRoute;
  adminTab: AdminTabType;
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
  if (path.includes('/talleres') || hash.includes('talleres')) return { route: 'workshops', adminTab: 'hub' };
  return { route: 'home', adminTab: 'hub' };
};

export const App: React.FC = () => {
  const { setViewMode } = useApp();
  const initial = parseRouteFromLocation();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(initial.route);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDailyClosingOpen, setIsDailyClosingOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTabType>(initial.adminTab);

  const navigate = (newRoute: AppRoute, targetTab?: AdminTabType) => {
    setCurrentRoute(newRoute);
    setViewMode(newRoute === 'admin' ? 'admin' : 'store');

    const tab = targetTab !== undefined ? targetTab : (newRoute === 'admin' ? 'hub' : 'hub');
    setAdminTab(tab);

    let targetPath = '/';
    if (newRoute === 'store') targetPath = '/tienda';
    else if (newRoute === 'workshops') targetPath = '/talleres';
    else if (newRoute === 'admin') {
      if (tab === 'orders') targetPath = '/admin/pedidos';
      else if (tab === 'billing') targetPath = '/admin/facturacion';
      else if (tab === 'inventory') targetPath = '/admin/inventario';
      else if (tab === 'reports') targetPath = '/admin/caja';
      else if (tab === 'workshops') targetPath = '/admin/talleres';
      else targetPath = '/admin';
    }

    try {
      window.history.pushState({ route: newRoute, adminTab: tab }, '', targetPath);
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
      setViewMode(parsed.route === 'admin' ? 'admin' : 'store');
    };

    window.addEventListener('popstate', handlePop);
    window.addEventListener('hashchange', handlePop);
    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('hashchange', handlePop);
    };
  }, [setViewMode]);

  // Deep link: ?taller=ID redirects to /talleres
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('taller') && currentRoute !== 'workshops') {
      navigate('workshops');
    }
  }, []);

  const adminBreadcrumbs = [
    { label: 'by.fio', route: 'home' as AppRoute },
    { label: 'panel administrativo', onClick: () => handleSelectAdminTab('hub') },
    ...(adminTab !== 'hub'
      ? [
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
        ]
      : []),
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

          {currentRoute === 'admin' && (
            <div className="space-y-6">
              {/* Barra de Árbol con Slashes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <TreeNavigation nodes={adminBreadcrumbs} onNavigate={navigate} />

                {adminTab !== 'hub' && (
                  <button
                    type="button"
                    onClick={() => handleSelectAdminTab('hub')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-white/80 shadow-sm transition-all self-start sm:self-auto"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-fio-pink" />
                    <span>Volver al Menú Principal</span>
                  </button>
                )}
              </div>

              {/* Si está en el Menú Principal (Hub) */}
              {adminTab === 'hub' ? (
                <>
                  <AdminHeader />
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
    </div>
  );
};

export default App;
