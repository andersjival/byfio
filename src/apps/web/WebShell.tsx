import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppRoute, AdminTabType } from '../../types';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { BackgroundDecor } from '../../components/common/BackgroundDecor';
import { Navbar } from '../../components/common/Navbar';
import { FloatingMascot } from '../../components/common/FloatingMascot';
import { WebIntroOverlay } from '../../components/common/WebIntroOverlay';
import { LoginModal } from '../../components/common/LoginModal';
import { CartSuccessToast } from '../../components/common/CartSuccessToast';
import { WelcomeStarModal } from '../../components/common/WelcomeStarModal';
import { HomePage } from '../../components/store/HomePage';
import { StorePage } from '../../components/store/StorePage';
import { CatalogPage } from '../../components/store/CatalogPage';
import { WorkshopsPage } from '../../components/store/WorkshopsPage';
import { WorkshopDetailPage } from '../../components/store/WorkshopDetailPage';
import { WorkshopWaitlistPage } from '../../components/store/WorkshopWaitlistPage';
import { PricingStickersSection } from '../../components/store/PricingStickersSection';
import { MyAccountPage } from '../../components/store/MyAccountPage';
import { CartDrawer } from '../../components/store/CartDrawer';
import { CheckoutModal } from '../../components/store/CheckoutModal';

const PropuestaPage = React.lazy(() =>
  import('../../components/propuesta/PropuestaPage').then((m) => ({ default: m.PropuestaPage }))
);
const DriveCoursesPage = React.lazy(() =>
  import('../../components/store/DriveCoursesPage').then((m) => ({ default: m.DriveCoursesPage }))
);

interface WebShellProps {
  currentRoute: AppRoute;
  selectedWorkshopId: string | null;
  clientUsername?: string | null;
  onNavigate: (route: AppRoute, adminTab?: AdminTabType, workshopId?: string, clientSlug?: string) => void;
}

export const WebShell: React.FC<WebShellProps> = ({
  currentRoute,
  selectedWorkshopId,
  clientUsername,
  onNavigate,
}) => {
  const {
    isIntroOpen,
    closeWebIntro,
    isLogoutTransitionOpen,
    closeLogoutTransition,
    isCheckoutOpen,
    setIsCheckoutOpen,
    isModuleEnabled,
    isFeatureEnabled,
  } = useApp();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'register'>(() => {
    if (typeof window === 'undefined') return 'login';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return path.includes('registro') || hash.includes('registro') || search.includes('registro')
      ? 'register'
      : 'login';
  });

  const handleOpenLogin = (mode?: 'login' | 'register') => {
    setLoginModalMode(mode || 'login');
    setIsLoginModalOpen(true);
  };

  const handleAuthSuccess = (user: { email?: string; role?: string; permissions?: any; clientSlug?: string; username?: string }) => {
    setIsLoginModalOpen(false);
    closeLogoutTransition();
    if (user.email === 'superadmin@byfio.com') {
      onNavigate('superadmin');
    } else if (user.role === 'admin' || user.role === 'staff') {
      const isAlistoOnly =
        user.role === 'staff' &&
        user.permissions?.orders &&
        !user.permissions?.billing &&
        !user.permissions?.inventory;
      onNavigate('admin', isAlistoOnly ? 'orders' : undefined);
    } else {
      const slug = user.clientSlug || user.username;
      onNavigate('mi-cuenta', undefined, undefined, slug || undefined);
    }
  };

  if (currentRoute === 'workshop-waitlist' && isModuleEnabled('workshops')) {
    return (
      <ErrorBoundary fallbackTitle="Inconveniente en la lista de espera">
        <WorkshopWaitlistPage workshopId={selectedWorkshopId} onNavigate={onNavigate} />
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
          onOpenLogin={handleOpenLogin}
          isAdminHub={false}
        />

        {currentRoute === 'home' ? (
          <main className="w-full pb-10">
            <ErrorBoundary fallbackTitle="Error al cargar la portada">
              <HomePage onNavigate={onNavigate} />
            </ErrorBoundary>
          </main>
        ) : (
          <main className="w-full mx-auto px-2.5 sm:px-4 lg:px-6 pt-2 sm:pt-4 pb-8 max-w-7xl">
            <ErrorBoundary fallbackTitle="Inconveniente al cargar la sección">
              {currentRoute === 'login' && (
                <LoginModal
                  isOpen={true}
                  onClose={() => onNavigate('home')}
                  isStandalonePage={true}
                  initialMode={loginModalMode}
                  onSuccess={handleAuthSuccess}
                />
              )}

              {currentRoute === 'store' && isModuleEnabled('store') && <StorePage onNavigate={onNavigate} />}
              {currentRoute === 'catalogo' && isModuleEnabled('catalogo') && <CatalogPage onNavigate={onNavigate} />}
              {currentRoute === 'workshops' && isModuleEnabled('workshops') && <WorkshopsPage onNavigate={onNavigate} />}
              {currentRoute === 'precios' && isModuleEnabled('pricing') && <PricingStickersSection onNavigate={onNavigate} />}

              {currentRoute === 'mi-cuenta' && (
                <MyAccountPage onNavigate={onNavigate} onOpenLogin={handleOpenLogin} clientUsername={clientUsername} />
              )}

              {currentRoute === 'workshop-detail' && isModuleEnabled('workshops') && (
                <WorkshopDetailPage workshopId={selectedWorkshopId} onNavigate={onNavigate} />
              )}

              {currentRoute === 'cursos-drive' && (
                <React.Suspense fallback={<div className="py-16 text-center font-bubble text-sm text-slate-400">Cargando cursos...</div>}>
                  <DriveCoursesPage onNavigate={onNavigate} />
                </React.Suspense>
              )}

              {currentRoute === 'propuesta' && (
                <React.Suspense fallback={<div className="py-16 text-center font-bubble text-sm text-slate-400">Cargando propuesta...</div>}>
                  <PropuestaPage onNavigate={onNavigate} />
                </React.Suspense>
              )}
            </ErrorBoundary>
          </main>
        )}
      </div>

      <footer className="w-full py-5 text-center mt-auto pb-8 z-10">
        <div className="geosoft-copyright-pill px-4 py-1.5">
          <a
            href="https://www.geosoft.lat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm tracking-wider hover:opacity-90 transition-opacity font-bubble"
            title="Desarrollado por GeoSoft"
          >
            <span className="animate-copyright-sweep font-bold">© Copyright en byfio by GeoSoft</span>
          </a>
        </div>
      </footer>

      <LoginModal
        key={isLogoutTransitionOpen ? 'logout-curtain' : `login-${loginModalMode}`}
        isOpen={isLoginModalOpen || isLogoutTransitionOpen}
        isLogoutCurtain={isLogoutTransitionOpen}
        initialMode={loginModalMode}
        onClose={() => {
          setIsLoginModalOpen(false);
          closeLogoutTransition();
        }}
        onSuccess={handleAuthSuccess}
      />

      <ErrorBoundary fallbackTitle="Inconveniente con la notificación de carrito">
        <CartSuccessToast />
      </ErrorBoundary>

      {currentRoute === 'home' && isIntroOpen && (
        <WebIntroOverlay
          isOpen={isIntroOpen}
          onFinish={closeWebIntro}
          onSelectStore={() => {
            closeWebIntro();
            onNavigate('store');
          }}
          onSelectOrders={() => {
            closeWebIntro();
            onNavigate('admin', 'orders');
          }}
        />
      )}

      <FloatingMascot currentRoute={currentRoute} />

      {isModuleEnabled('store') && isFeatureEnabled('store', 'interactive_cart') && (
        <ErrorBoundary fallbackTitle="Inconveniente con el carrito">
          <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
        </ErrorBoundary>
      )}

      <WelcomeStarModal />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
};

export default WebShell;
