import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppRoute, AdminTabType } from '../../types';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
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
  const { activePickingOrder, currentUser, isSuperAdminAuthenticated } = useApp();
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
