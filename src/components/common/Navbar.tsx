import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { TikTokIcon } from './TikTokIcon';
import { AppRoute, AdminTabType } from '../../types';
import { ShoppingBag, Instagram, MessageCircle, Menu, X, ArrowLeft, LayoutGrid, LogOut, Heart } from 'lucide-react';
import { metricsTracker } from '../../services/metricsTracker';
import { NavbarNavLinks } from './navbar/NavbarNavLinks';
import { NavbarThemeToggle } from './navbar/NavbarThemeToggle';
import { NavbarUserMenu } from './navbar/NavbarUserMenu';
import { NavbarMobileDrawer } from './navbar/NavbarMobileDrawer';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute, targetTab?: AdminTabType) => void;
  onOpenLogin?: (mode?: 'login' | 'register') => void;
  onOpenDesignModal?: () => void;
  onSelectAdminHub?: () => void;
  isAdminHub?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenLogin,
  onSelectAdminHub,
  isAdminHub = false,
}) => {
  const {
    cart,
    setIsCartOpen,
    colorTheme,
    setColorTheme,
    currentUser,
    logoutUser,
    isModuleEnabled,
    isFeatureEnabled,
    setIsMyAccountOpen,
  } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [likePopped, setLikePopped] = useState(false);

  const handlePageLike = () => {
    metricsTracker.recordLike(currentRoute);
    setLikePopped(true);
    setTimeout(() => setLikePopped(false), 900);
  };

  const safeCart = Array.isArray(cart) ? cart.filter(Boolean) : [];
  const totalCartCount = safeCart.reduce((acc, it) => acc + (it && it.quantity ? it.quantity : 1), 0);

  const handleNav = (route: AppRoute, targetTab?: AdminTabType) => {
    onNavigate(route, targetTab);
    setMobileOpen(false);
  };

  const isPwaOrStaffOrAdmin = Boolean(
    currentRoute === 'admin' ||
    currentRoute === 'pedidos-mobile' ||
    currentRoute === 'superadmin' ||
    (currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff'))
  );

  return (
    <header className="sticky top-0 z-40 bg-[#C592F9] border-b border-purple-300/50 shadow-sm transition-all pt-[calc(env(safe-area-inset-top,0px)+8px)] pb-1.5 sm:pb-2">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 min-h-[50px] sm:min-h-[54px] py-1.5 flex items-center justify-between gap-1.5 sm:gap-2 w-full">
        {/* Logo de Marca y Botones de Retorno en Admin/Superadmin */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center shrink-0 text-left focus:outline-none"
            title="Ir al inicio de by.fio"
          >
            <div className="hidden 2xl:block">
              <BrandLogo size="md" showSlogan={false} variant="header" />
            </div>
            <div className="block 2xl:hidden">
              <BrandLogo size="sm" showSlogan={false} variant="header" />
            </div>
          </button>

          {(currentRoute === 'admin' || currentRoute === 'superadmin') && (
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="bg-white/90 hover:bg-white flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-slate-700 text-xs sm:text-sm font-bubble font-bold border border-white/80 shadow-sm hover:shadow hover:text-fio-pink transition-all active:scale-95 shrink-0"
              title="Volver a la tienda pública"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fio-pink shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Volver a Tienda</span>
              <span className="sm:hidden whitespace-nowrap">Tienda</span>
            </button>
          )}

          {currentRoute === 'superadmin' && (
            <button
              type="button"
              onClick={() => handleNav('admin')}
              className="bg-white/90 hover:bg-white flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-purple-700 text-xs sm:text-sm font-bubble font-bold border border-purple-200/80 shadow-sm hover:shadow transition-all active:scale-95 shrink-0"
              title="Ir al Panel de Administración"
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Panel Admin</span>
              <span className="sm:hidden whitespace-nowrap">Admin</span>
            </button>
          )}
        </div>

        {/* Submódulo Atómico: Enlaces de Navegación Desktop */}
        {currentRoute !== 'admin' && currentRoute !== 'superadmin' && (
          <NavbarNavLinks
            currentRoute={currentRoute}
            onNavigate={handleNav}
            isModuleEnabled={isModuleEnabled}
            isFeatureEnabled={isFeatureEnabled}
          />
        )}

        {/* Acciones del Encabezado */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {currentRoute !== 'admin' && currentRoute !== 'superadmin' ? (
            <>
              {/* Redes Sociales Oficiales */}
              {!isPwaOrStaffOrAdmin && (
                <>
                  <a
                    href="https://www.tiktok.com/@by_fio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="TikTok oficial @by_fio"
                    aria-label="TikTok @by_fio"
                    className="hidden 2xl:flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/85 text-slate-700 hover:text-black hover:bg-white border border-white/80 shadow-xs hover:scale-105 transition-all shrink-0"
                  >
                    <TikTokIcon className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://instagram.com/by_fio10"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram @by_fio10"
                    aria-label="Instagram @by_fio10"
                    className="hidden 2xl:flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/85 text-fio-pink hover:bg-white border border-white/80 shadow-xs hover:scale-105 transition-all shrink-0"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://wa.me/50664004640?text=Hola%20Fio!%20Vengo%20de%20la%20página%20web"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp 6400-4640"
                    className="hidden 2xl:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50/90 text-emerald-700 hover:bg-emerald-100/90 border border-emerald-200/50 shadow-xs transition-colors text-xs font-semibold shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>6400-4640</span>
                  </a>
                </>
              )}

              {/* Submódulo Atómico: Selector de Tema */}
              <NavbarThemeToggle colorTheme={colorTheme} setColorTheme={setColorTheme} />

              {/* Botón Me Gusta */}
              {!isPwaOrStaffOrAdmin && (
                <button
                  type="button"
                  onClick={handlePageLike}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-pink-50/90 hover:bg-pink-100 text-pink-600 hover:text-pink-700 border border-pink-200/80 shadow-xs transition-all active:scale-95 shrink-0 font-bubble font-bold text-xs cursor-pointer group"
                  title="¡Dar Me Gusta a esta página de by.fio! ❤️"
                  aria-label="Dar Me Gusta a esta página"
                >
                  <Heart className={`w-3.5 h-3.5 fill-pink-500 text-pink-500 transition-transform ${likePopped ? 'scale-150 animate-bounce' : 'group-hover:scale-125'}`} />
                  <span className="hidden 2xl:inline">{likePopped ? '¡+1 Like!' : 'Me Gusta'}</span>
                </button>
              )}

              {/* Submódulo Atómico: Menú de Usuario / Login */}
              <NavbarUserMenu
                currentUser={currentUser}
                onNavigate={handleNav}
                onOpenLogin={onOpenLogin}
                setIsMyAccountOpen={setIsMyAccountOpen}
                logoutUser={logoutUser}
              />

              {/* Botón Carrito */}
              {isModuleEnabled('store') && isFeatureEnabled('store', 'interactive_cart') && (
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Abrir Carrito"
                  className="relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl neu-btn-primary text-white font-bubble font-bold text-xs sm:text-sm shadow-neuBtn hover:shadow-neuBtnHover active:scale-95 transition-all shrink-0 cursor-pointer mr-0 sm:mr-1"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">Carrito</span>
                  {totalCartCount > 0 && (
                    <span className="flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 px-1 bg-fio-pink text-white rounded-full text-[9px] sm:text-[10px] font-bold ring-1.5 sm:ring-2 ring-white">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Botón Hamburguesa Móvil */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden p-2 rounded-xl bg-white/90 hover:bg-white border border-white/80 text-slate-700 shadow-sm hover:shadow active:scale-95 transition-all shrink-0 cursor-pointer"
                aria-label="Abrir menú"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </>
          ) : currentRoute === 'superadmin' ? (
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <NavbarThemeToggle colorTheme={colorTheme} setColorTheme={setColorTheme} />
              <button
                type="button"
                onClick={() => handleNav('admin')}
                className="bg-white/90 hover:bg-white flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-purple-700 hover:text-purple-900 text-xs sm:text-sm font-bubble font-bold border border-purple-200/80 shadow-sm hover:shadow transition-all active:scale-95 shrink-0"
                title="Ir al Panel de Administración (/admin)"
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
                <span className="whitespace-nowrap">Panel Admin</span>
              </button>
              <NavbarUserMenu
                currentUser={currentUser}
                onNavigate={handleNav}
                onOpenLogin={onOpenLogin}
                setIsMyAccountOpen={setIsMyAccountOpen}
                logoutUser={logoutUser}
              />
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <NavbarThemeToggle colorTheme={colorTheme} setColorTheme={setColorTheme} />
              <button
                type="button"
                onClick={onSelectAdminHub}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bubble font-bold border border-white/80 shadow-sm hover:shadow transition-all active:scale-95 shrink-0 whitespace-nowrap ${
                  isAdminHub
                    ? 'bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-md'
                    : 'bg-white/90 hover:bg-white text-slate-700 hover:text-fio-pink'
                }`}
                title="Ir al Menú del Panel de Control"
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fio-yellow shrink-0" />
                <span className="whitespace-nowrap">Menú</span>
              </button>

              {/* Menú de Usuario Persistente (Avatar + Nombre + Rol) */}
              <NavbarUserMenu
                currentUser={currentUser}
                onNavigate={handleNav}
                onOpenLogin={onOpenLogin}
                setIsMyAccountOpen={setIsMyAccountOpen}
                logoutUser={logoutUser}
              />

              {currentUser && (
                <button
                  type="button"
                  onClick={logoutUser}
                  className="bg-white/90 hover:bg-white flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-slate-600 hover:text-rose-600 border border-white/80 shadow-sm hover:shadow text-xs font-bubble font-bold transition-all active:scale-95 shrink-0"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submódulo Atómico: Drawer Menú Móvil */}
      <NavbarMobileDrawer
        isOpen={mobileOpen}
        currentRoute={currentRoute}
        onNavigate={handleNav}
        currentUser={currentUser}
        onOpenLogin={onOpenLogin}
        setIsMyAccountOpen={setIsMyAccountOpen}
        logoutUser={logoutUser}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
        isModuleEnabled={isModuleEnabled}
        isFeatureEnabled={isFeatureEnabled}
      />
    </header>
  );
};
