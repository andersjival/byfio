import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppRoute, AdminTabType } from '../../types';
import { Shield } from 'lucide-react';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { LoginModal } from '../../components/common/LoginModal';
import { MobileOrdersView } from '../../components/mobile/MobileOrdersView';
import { PwaInstallPage } from '../../components/pwa/PwaInstallPage';
import { NewOrderStarAlert } from '../../components/common/NewOrderStarAlert';
import { AppEntryGatewayModal } from '../../components/common/AppEntryGatewayModal';
import { isCollaboratorPwaContext } from '../../utils/routeHelpers';

const InventoryAppPage = React.lazy(() =>
  import('../../components/inventory/InventoryAppPage').then((m) => ({ default: m.InventoryAppPage }))
);
const GuidedPickingModal = React.lazy(() =>
  import('../../components/admin/GuidedPickingModal').then((m) => ({ default: m.GuidedPickingModal }))
);

interface CollaboratorPwaShellProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute, adminTab?: AdminTabType, workshopId?: string) => void;
  onSelectAdminTab: (tab: AdminTabType) => void;
}

export const CollaboratorPwaShell: React.FC<CollaboratorPwaShellProps> = ({
  currentRoute,
  onNavigate,
  onSelectAdminTab,
}) => {
  const { activePickingOrder, currentUser, isSuperAdminAuthenticated, logoutUser } = useApp();
  const isPrivilegedUser = Boolean(
    isSuperAdminAuthenticated ||
    (currentUser && (currentUser.role === 'admin' || !!currentUser.isMasterAdmin || currentUser.role === 'staff'))
  );
  const [isEntryGatewayOpen, setIsEntryGatewayOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !isCollaboratorPwaContext()) return false;
    try {
      return !sessionStorage.getItem('byfio_entry_gateway_dismissed');
    } catch {
      return false;
    }
  });

  const dismissGateway = () => {
    try {
      sessionStorage.setItem('byfio_entry_gateway_dismissed', '1');
    } catch {}
    setIsEntryGatewayOpen(false);
  };

  if (currentRoute === 'pwa-install') {
    return (
      <ErrorBoundary fallbackTitle="Inconveniente al cargar el portal de instalación">
        <PwaInstallPage onNavigate={onNavigate} onSelectAdminTab={onSelectAdminTab} />
      </ErrorBoundary>
    );
  }

  if (!isPrivilegedUser) {
    const isCustomerUser = Boolean(currentUser && currentUser.role === 'customer');
    return (
      <ErrorBoundary fallbackTitle="Inconveniente al cargar el acceso a gestión de pedidos">
        <div
          className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-3 sm:p-6 bg-cover bg-center bg-no-repeat overflow-y-auto select-none"
          style={{ backgroundImage: "url('/bg-pwa-login.png')", backgroundColor: '#EBD8F7' }}
        >
          <div className="absolute inset-0 bg-purple-950/10 pointer-events-none" />
          <div className="relative z-10 w-full max-w-[395px] my-auto flex flex-col items-center justify-center">
            {isCustomerUser ? (
              <div className="w-full bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-purple-200 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-2xl shadow-inner">
                  <Shield className="w-7 h-7 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-bubble font-bold text-purple-950">Acceso Reservado</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Esta sección es exclusiva para el equipo colaborador y administradores de by.fio. Tu cuenta de cliente no posee permisos para gestionar pedidos.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bubble font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Volver a la Tienda
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logoutUser();
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bubble font-bold text-xs transition-all cursor-pointer"
                  >
                    Cerrar sesión e ingresar como colaborador
                  </button>
                </div>
              </div>
            ) : (
              <LoginModal
                isOpen={true}
                onClose={() => onNavigate('home')}
                isStandalonePage={true}
                forcedRole="staff"
                onSuccess={(user) => {
                  if (user.role === 'admin' || user.isMasterAdmin || user.role === 'staff') {
                    onNavigate('pedidos-mobile');
                  } else {
                    onNavigate('home');
                  }
                }}
              />
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="Inconveniente al cargar la PWA operativa">
      {currentRoute === 'inventario-app' ? (
        <React.Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center font-bubble text-sm text-purple-700 bg-[#F7F4FC]">
              Cargando App de Inventarios...
            </div>
          }
        >
          <InventoryAppPage onNavigate={onNavigate} />
        </React.Suspense>
      ) : (
        <MobileOrdersView onNavigate={onNavigate} />
      )}

      <React.Suspense fallback={null}>
        {activePickingOrder && <GuidedPickingModal />}
      </React.Suspense>

      {Boolean(isSuperAdminAuthenticated || currentUser) && <NewOrderStarAlert />}

      {isCollaboratorPwaContext() && isEntryGatewayOpen && !isPrivilegedUser && (
        <AppEntryGatewayModal
          isOpen={isEntryGatewayOpen}
          onSelectStore={() => {
            dismissGateway();
            onNavigate('store');
          }}
          onSelectOrders={() => {
            dismissGateway();
            onNavigate('pedidos-mobile');
          }}
          onClose={dismissGateway}
        />
      )}
    </ErrorBoundary>
  );
};

export default CollaboratorPwaShell;
