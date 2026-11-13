import React, { useState, useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppRoute, AdminTabType, Customer } from '../../types';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { BackgroundDecor } from '../../components/common/BackgroundDecor';
import { Navbar } from '../../components/common/Navbar';
import { LoginModal } from '../../components/common/LoginModal';
import { NewOrderStarAlert } from '../../components/common/NewOrderStarAlert';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminHubMenu } from '../../components/admin/AdminHubMenu';
import { AdminCatalogVisualView } from '../../components/admin/AdminCatalogVisualView';
import { OrdersQueue } from '../../components/admin/OrdersQueue';
import { AdminLayawaysSection } from '../../components/admin/AdminLayawaysSection';
import { InventoryTable } from '../../components/admin/InventoryTable';
import { CashRegisterReports } from '../../components/admin/CashRegisterReports';
import { WorkshopEnrollmentsSection } from '../../components/admin/WorkshopEnrollmentsSection';
import { UserProfilesSection } from '../../components/admin/UserProfilesSection';
import { CustomersSection } from '../../components/admin/CustomersSection';
import { CreateSupplierOrderPage } from '../../components/admin/CreateSupplierOrderPage';
import { SinpePaymentsSection } from '../../components/admin/SinpePaymentsSection';
import { SuppliersOrdersSection } from '../../components/admin/SuppliersOrdersSection';
import { SalesHistorySection } from '../../components/admin/SalesHistorySection';
import { AdminMobileDock } from '../../components/admin/AdminMobileDock';
import { PwaManagerModal } from '../../components/admin/PwaManagerModal';
import { QrLabelModal } from '../../components/admin/QrLabelModal';
import { InvoiceModal } from '../../components/admin/InvoiceModal';
import { NewProductModal } from '../../components/admin/NewProductModal';
import { NewWorkshopModal } from '../../components/admin/NewWorkshopModal';
import { DailyClosingModal } from '../../components/admin/DailyClosingModal';
import { AdminDesignSettingsModal } from '../../components/admin/AdminDesignSettingsModal';
import { AdminPricingModal } from '../../components/admin/AdminPricingModal';

const QuickBillingSection = React.lazy(() => import('../../components/admin/QuickBillingSection').then((m) => ({ default: m.QuickBillingSection })));
const GuidedPickingModal = React.lazy(() => import('../../components/admin/GuidedPickingModal').then((m) => ({ default: m.GuidedPickingModal })));
const AgendaSection = React.lazy(() => import('../../components/admin/AgendaSection').then((m) => ({ default: m.AgendaSection })));
const MetricsPage = React.lazy(() => import('../../components/admin/MetricsPage').then((m) => ({ default: m.MetricsPage })));
const AppsManagementSection = React.lazy(() => import('../../components/admin/AppsManagementSection').then((m) => ({ default: m.AppsManagementSection })));
const SuperadminSection = React.lazy(() => import('../../components/superadmin/SuperadminSection').then((m) => ({ default: m.SuperadminSection })));

interface AdminPwaShellProps {
  currentRoute: AppRoute;
  adminTab: AdminTabType;
  isDesignModalOpen: boolean;
  onOpenDesignModal: () => void;
  onCloseDesignModal: () => void;
  onSelectAdminTab: (tab: AdminTabType) => void;
  onNavigate: (route: AppRoute, adminTab?: AdminTabType, workshopId?: string) => void;
}

export const AdminPwaShell: React.FC<AdminPwaShellProps> = ({
  currentRoute,
  adminTab,
  isDesignModalOpen,
  onOpenDesignModal,
  onCloseDesignModal,
  onSelectAdminTab,
  onNavigate,
}) => {
  const {
    currentUser,
    isLogoutTransitionOpen,
    closeLogoutTransition,
    activePickingOrder,
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

  const [isDailyClosingOpen, setIsDailyClosingOpen] = useState(false);
  const [dailyClosingDate, setDailyClosingDate] = useState<string | undefined>(undefined);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [billingTargetCustomer, setBillingTargetCustomer] = useState<Customer | null>(null);
  const hasAutoRedirectedAlistoRef = useRef<string | null>(null);

  useEffect(() => {
    if (isSinpeModalOpen) {
      setIsSinpeModalOpen(false);
      onNavigate('admin', 'sinpe');
    }
  }, [isSinpeModalOpen, setIsSinpeModalOpen]);

  useEffect(() => {
    if (currentUser?.role === 'staff' && currentRoute === 'admin') {
      const userKey = currentUser.id || currentUser.name;
      if (hasAutoRedirectedAlistoRef.current !== userKey) {
        hasAutoRedirectedAlistoRef.current = userKey;
        const isAlistoOnly = currentUser.permissions?.orders && !currentUser.permissions?.billing && !currentUser.permissions?.inventory;
        if (isAlistoOnly && adminTab === 'hub') onSelectAdminTab('orders');
      }
    } else if (!currentUser) {
      hasAutoRedirectedAlistoRef.current = null;
    }
  }, [currentUser, currentRoute, adminTab]);

  useEffect(() => {
    if (isLogoutTransitionOpen && (currentRoute === 'superadmin' || currentRoute === 'metricas')) {
      onNavigate('admin');
    }
  }, [isLogoutTransitionOpen, currentRoute]);

  const isAdminOrSuperadmin = isSuperAdminAuthenticated || (!!currentUser && (currentUser.role === 'admin' || !!currentUser.isMasterAdmin));

  const handleAuthSuccess = (user: { email?: string; role?: string; permissions?: any }) => {
    closeLogoutTransition();
    if (user.email === 'superadmin@byfio.com') {
      onNavigate('superadmin');
    } else if (user.role === 'admin' || user.role === 'staff') {
      const isAlistoOnly = user.role === 'staff' && user.permissions?.orders && !user.permissions?.billing && !user.permissions?.inventory;
      onNavigate('admin', isAlistoOnly ? 'orders' : undefined);
    } else {
      onNavigate('home');
    }
  };

  if (currentRoute === 'admin' && (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'staff'))) {
    return (
      <ErrorBoundary fallbackTitle="Inconveniente al cargar el acceso administrativo">
        <div
          className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-3 sm:p-6 bg-cover bg-center bg-no-repeat overflow-y-auto select-none"
          style={{ backgroundImage: "url('/bg-pwa-login.png')", backgroundColor: '#EBD8F7' }}
        >
          <div className="absolute inset-0 bg-purple-950/10 pointer-events-none" />
          <div className="relative z-10 w-full max-w-[395px] my-auto flex items-center justify-center">
            <LoginModal
              isOpen={true}
              onClose={() => {
                closeLogoutTransition();
                onNavigate('home');
              }}
              isStandalonePage={true}
              forcedRole="admin"
              isLogoutCurtain={isLogoutTransitionOpen}
              onSuccess={handleAuthSuccess}
            />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="relative min-h-screen min-h-[100dvh] flex flex-col justify-between selection:bg-fio-300 selection:text-fio-900 text-slate-800 overflow-x-hidden w-full max-w-full">
      <BackgroundDecor />
      <div className="flex-1 flex flex-col">
        <Navbar
          currentRoute={currentRoute}
          onNavigate={onNavigate}
          onOpenDesignModal={onOpenDesignModal}
          onSelectAdminHub={() => onSelectAdminTab('hub')}
          isAdminHub={adminTab === 'hub'}
        />
        <main className={`w-full mx-auto px-2.5 sm:px-4 lg:px-6 pt-2 sm:pt-4 pb-8 ${currentRoute === 'admin' ? 'max-w-[1600px]' : 'max-w-7xl'}`}>
          <ErrorBoundary fallbackTitle="Inconveniente en el panel administrativo">
            {currentRoute === 'metricas' && isModuleEnabled('metricas') && (
              isAdminOrSuperadmin ? (
                <React.Suspense fallback={<div className="py-16 text-center font-bubble text-sm text-slate-400">Cargando métricas...</div>}>
                  <MetricsPage onNavigate={onNavigate} />
                </React.Suspense>
              ) : (
                <div className="py-12 max-w-md mx-auto text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center shadow-inner"><Shield className="w-7 h-7" /></div>
                  <h3 className="font-bubble font-bold text-xl text-slate-800">Acceso Restringido</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">El panel de métricas y rastreo es confidencial y solo está autorizado para el admin y superadmin.</p>
                  <button type="button" onClick={() => onNavigate('admin')} className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bubble text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95">Volver a Admin</button>
                </div>
              )
            )}

            {currentRoute === 'superadmin' && (
              <React.Suspense fallback={<div className="py-16 text-center font-bubble text-sm text-slate-400">Cargando panel de superadmin...</div>}>
                <SuperadminSection onNavigate={onNavigate} />
              </React.Suspense>
            )}

            {currentRoute === 'admin' && currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff') && (
              <div className="space-y-3 sm:space-y-4 pb-20 sm:pb-4">
                {adminTab === 'hub' ? (
                  <>
                    <AdminHeader onOpenDesignModal={onOpenDesignModal} onOpenPwaModal={() => setIsPwaModalOpen(true)} onNavigate={onNavigate} onSelectTab={onSelectAdminTab} />
                    <AdminHubMenu onSelectTab={onSelectAdminTab} onNavigate={onNavigate} onOpenPwaModal={() => setIsPwaModalOpen(true)} />
                  </>
                ) : (
                  <>

                    {adminTab === 'orders' && <OrdersQueue />}
                    {adminTab === 'layaways' && <AdminLayawaysSection onNavigate={onNavigate} />}
                    {adminTab === 'billing' && (
                      <React.Suspense fallback={<div className="py-12 text-center text-slate-400 font-bubble text-sm">Cargando facturación rápida...</div>}>
                        <QuickBillingSection initialCustomer={billingTargetCustomer} onClearInitialCustomer={() => setBillingTargetCustomer(null)} />
                      </React.Suspense>
                    )}
                    {adminTab === 'inventory' && <InventoryTable onSelectTab={onSelectAdminTab} onOpenInventoryApp={() => onNavigate('inventario-app')} />}
                    {adminTab === 'reports' && <CashRegisterReports onOpenDailyClosing={(date) => { setDailyClosingDate(date); setIsDailyClosingOpen(true); }} />}
                    {adminTab === 'sinpe' && <SinpePaymentsSection />}
                    {adminTab === 'workshops' && <WorkshopEnrollmentsSection onNavigateToSinpe={() => onSelectAdminTab('sinpe')} />}
                    {adminTab === 'users' && <UserProfilesSection />}
                    {adminTab === 'customers' && <CustomersSection onSelectCustomerForBilling={(cust) => { setBillingTargetCustomer(cust); onSelectAdminTab('billing'); }} />}
                    {adminTab === 'agenda' && <React.Suspense fallback={<div className="py-12 text-center text-slate-400 font-bubble text-sm">Cargando agenda...</div>}><AgendaSection /></React.Suspense>}
                    {adminTab === 'suppliers' && <SuppliersOrdersSection onSelectTab={onSelectAdminTab} />}
                    {adminTab === 'supplier-order-create' && <CreateSupplierOrderPage onBackToSuppliers={() => onSelectAdminTab('suppliers')} onBackToInventory={() => onSelectAdminTab('inventory')} />}
                    {adminTab === 'sales' && <SalesHistorySection />}
                    {adminTab === 'catalog-view' && <AdminCatalogVisualView onBackToHub={() => onSelectAdminTab('hub')} />}
                    {adminTab === 'apps' && (
                      <React.Suspense fallback={<div className="py-12 text-center text-slate-400 font-bubble text-sm">Cargando aplicaciones...</div>}>
                        <AppsManagementSection onSelectAdminTab={onSelectAdminTab} onNavigate={onNavigate} onOpenDesignModal={onOpenDesignModal} />
                      </React.Suspense>
                    )}
                  </>
                )}
              </div>
            )}
          </ErrorBoundary>
        </main>
      </div>

      {Boolean(isSuperAdminAuthenticated || currentUser) && <NewOrderStarAlert />}
      <PwaManagerModal isOpen={isPwaModalOpen} onClose={() => setIsPwaModalOpen(false)} onSelectAdminTab={onSelectAdminTab} onNavigate={onNavigate} />
      {currentRoute === 'admin' && Boolean(currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff')) && (
        <AdminMobileDock activeTab={adminTab} onSelectTab={onSelectAdminTab} />
      )}
      <React.Suspense fallback={null}>
        {activePickingOrder && <GuidedPickingModal />}
        {qrModalProduct && isFeatureEnabled('inventory', 'qr_labels') && <QrLabelModal />}
        {invoiceOrder && <InvoiceModal />}
        {isNewProductModalOpen && <NewProductModal />}
        {isNewWorkshopModalOpen && <NewWorkshopModal />}
        {isDailyClosingOpen && isFeatureEnabled('reports', 'daily_closing') && (
          <DailyClosingModal isOpen={isDailyClosingOpen} initialDate={dailyClosingDate} onClose={() => { setIsDailyClosingOpen(false); setDailyClosingDate(undefined); }} />
        )}
        {isDesignModalOpen && <AdminDesignSettingsModal isOpen={isDesignModalOpen} onClose={onCloseDesignModal} />}
        {isPricingModalOpen && <AdminPricingModal />}
      </React.Suspense>
    </div>
  );
};

export default AdminPwaShell;
