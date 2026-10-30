import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { TikTokIcon } from './TikTokIcon';
import { AppRoute } from '../../types';
import { ShoppingBag, Instagram, MessageCircle, Menu, X, ArrowLeft, User, Palette, LayoutGrid, LogOut, ShieldCheck, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenLogin?: () => void;
  onOpenDesignModal?: () => void;
  onSelectAdminHub?: () => void;
  isAdminHub?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenLogin,
  onOpenDesignModal,
  onSelectAdminHub,
  isAdminHub = false,
}) => {
  const { cart, setIsCartOpen, colorTheme, setColorTheme, currentUser, logoutUser, loginIntroStage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  const handleNav = (route: AppRoute) => {
    onNavigate(route);
    setMobileOpen(false);
  };

  let navAnimationClass = '';
  if (loginIntroStage > 0) {
    if (loginIntroStage < 3) {
      navAnimationClass = 'opacity-0 -translate-y-full pointer-events-none';
    } else if (loginIntroStage >= 3) {
      navAnimationClass = 'navbar-slide-down';
    }
  }

  return (
    <header className={`sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-white/70 shadow-[0_2px_12px_rgba(180,160,200,0.05)] transition-all ${navAnimationClass}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[50px] sm:min-h-[54px] py-1.5 flex items-center justify-between gap-2">
        {/* Logo de Marca con botón de Volver a Tienda inmediatamente al lado en Admin */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center shrink-0 text-left focus:outline-none"
            title="Ir al inicio de by.fio"
          >
            <BrandLogo size="sm" showSlogan={true} />
          </button>

          {currentRoute === 'admin' && (
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="neu-btn bg-[#F1F2F6] flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-slate-700 text-xs sm:text-sm font-bubble font-bold border border-white/80 shadow-neuBtn hover:text-fio-pink hover:bg-pink-50/70 hover:shadow-neuBtnHover transition-all active:scale-95 shrink-0"
              title="Volver a la tienda pública"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fio-pink" />
              <span>Volver a Tienda</span>
            </button>
          )}
        </div>

        {/* Links de Navegación de Páginas Principales con Estilo Neumórfico Táctil (Solo en Modo Público) */}
        {currentRoute !== 'admin' && (
          <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl bg-[#ECEEF2] shadow-neuInset border border-white/60">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all ${
                currentRoute === 'home'
                  ? 'neu-btn-primary text-white shadow-neuBtnHover'
                  : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 hover:border-pink-200/80 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
              }`}
            >
              Inicio
            </button>

            <button
              type="button"
              onClick={() => handleNav('workshops')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all ${
                currentRoute === 'workshops' || currentRoute === 'workshop-detail'
                  ? 'neu-btn-primary text-white shadow-neuBtnHover'
                  : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 hover:border-pink-200/80 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
              }`}
            >
              Talleres
            </button>

            <button
              type="button"
              onClick={() => handleNav('store')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all ${
                currentRoute === 'store'
                  ? 'neu-btn-primary text-white shadow-neuBtnHover'
                  : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 hover:border-pink-200/80 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
              }`}
            >
              Tienda
            </button>

            <button
              type="button"
              onClick={() => handleNav('catalogo')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all ${
                currentRoute === 'catalogo'
                  ? 'neu-btn-primary text-white shadow-neuBtnHover'
                  : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 hover:border-pink-200/80 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
              }`}
            >
              Catálogo
            </button>

            <button
              type="button"
              onClick={() => handleNav('precios')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all ${
                currentRoute === 'precios'
                  ? 'neu-btn-primary text-white shadow-neuBtnHover'
                  : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 hover:border-pink-200/80 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
              }`}
            >
              Precios
            </button>
          </nav>
        )}

        {/* Acciones del Encabezado */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Si NO es admin: Redes Sociales, Carrito y Login */}
          {currentRoute !== 'admin' ? (
            <>
              {/* TikTok Oficial (En desktop y tablet; en móvil ya vive dentro del menú) */}
              <a
                href="https://www.tiktok.com/@by_fio/"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok oficial @by_fio"
                aria-label="TikTok @by_fio"
                className="hidden sm:flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/85 text-slate-700 hover:text-black hover:bg-white border border-white/80 shadow-xs hover:scale-105 transition-all"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
              </a>

              {/* Instagram @by_fio10 */}
              <a
                href="https://instagram.com/by_fio10"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram @by_fio10"
                aria-label="Instagram @by_fio10"
                className="hidden sm:flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/85 text-fio-pink hover:bg-white border border-white/80 shadow-xs hover:scale-105 transition-all"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              {/* WhatsApp Directo */}
              <a
                href="https://wa.me/50664004640?text=Hola%20Fio!%20Vengo%20de%20la%20página%20web"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp 6400-4640"
                className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50/90 text-emerald-700 hover:bg-emerald-100/90 border border-emerald-200/50 shadow-xs transition-colors text-xs font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>6400-4640</span>
              </a>

              {/* Selector de Tema Claro / Oscuro (Botones Sol y Luna) */}
              <div className="flex items-center p-0.5 sm:p-1 rounded-full bg-[#ECEEF2] shadow-neuInset border border-white/60 shrink-0">
                <button
                  type="button"
                  onClick={() => setColorTheme('vibrant')}
                  className={`p-1.5 sm:p-2 rounded-full transition-all ${
                    colorTheme !== 'dark'
                      ? 'bg-[#F1F2F6] shadow-neuBtn text-amber-500 scale-105'
                      : 'text-slate-400 hover:text-amber-500'
                  }`}
                  title="Cambiar a tema claro (Sol)"
                  aria-label="Cambiar a tema claro"
                >
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400/20" />
                </button>
                <button
                  type="button"
                  onClick={() => setColorTheme('dark')}
                  className={`p-1.5 sm:p-2 rounded-full transition-all ${
                    colorTheme === 'dark'
                      ? 'bg-[#1E1B4B] shadow-neuBtn text-indigo-400 scale-105'
                      : 'text-slate-400 hover:text-indigo-400'
                  }`}
                  title="Cambiar a tema oscuro (Luna)"
                  aria-label="Cambiar a tema oscuro"
                >
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-indigo-400/20" />
                </button>
              </div>

              {/* Sesión de Usuario o Botón Iniciar Sesión 3D */}
              {currentUser ? (
                <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-white/90 border border-purple-200/80 rounded-2xl shadow-xs shrink-0">
                  <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 text-xs font-bubble font-bold text-slate-700 max-w-[85px] sm:max-w-[160px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="truncate">{currentUser.name.split(' ')[0]}</span>
                    {currentUser.role === 'admin' && (
                      <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-gradient-to-r from-purple-500 to-fio-pink text-[9px] text-white font-bold uppercase tracking-wider shrink-0">
                        Admin
                      </span>
                    )}
                    {currentUser.role === 'staff' && (
                      <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[9px] font-bold uppercase tracking-wider shrink-0">
                        Staff
                      </span>
                    )}
                  </div>
                  {(currentUser.role === 'admin' || currentUser.role === 'staff') && (
                    <button
                      type="button"
                      onClick={() => handleNav('admin')}
                      className="hidden sm:inline-block px-2 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-fio-purple text-xs font-bubble font-bold transition-all shrink-0"
                      title="Ir al panel de administración"
                    >
                      Panel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={logoutUser}
                    className="p-1 sm:p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all shrink-0"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenLogin || (() => handleNav('login'))}
                  aria-label="Iniciar Sesión"
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover transition-all text-xs sm:text-sm font-bubble font-bold active:scale-95 shrink-0"
                  title="Iniciar Sesión 3D"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fio-pink" />
                  <span className="hidden xl:inline">Iniciar Sesión</span>
                </button>
              )}

              {/* Botón Carrito de Compras Neumórfico */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Abrir Carrito"
                className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl neu-btn-primary text-white font-bubble font-bold text-xs sm:text-sm shadow-neuBtn hover:shadow-neuBtnHover active:scale-95 transition-all shrink-0"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Carrito</span>
                {totalCartCount > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 px-1 bg-fio-pink text-white rounded-full text-[9px] sm:text-[10px] font-bold ring-1.5 sm:ring-2 ring-white">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Botón Hamburguesa Mobile */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl neu-btn bg-[#F1F2F6] border border-white/80 text-slate-700 shadow-neuBtn active:scale-95 transition-all shrink-0"
                aria-label="Abrir menú"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </>
          ) : (
            /* EN PANEL DE ADMINISTRACIÓN: Redes sociales retiradas, colocamos Diseño & Letra y Menú Principal */
            <div className="flex items-center gap-2">
              {/* Selector de Tema Claro / Oscuro en Admin */}
              <div className="flex items-center p-0.5 sm:p-1 rounded-full bg-[#ECEEF2] shadow-neuInset border border-white/60">
                <button
                  type="button"
                  onClick={() => setColorTheme('vibrant')}
                  className={`p-1.5 sm:p-2 rounded-full transition-all ${
                    colorTheme !== 'dark'
                      ? 'bg-[#F1F2F6] shadow-neuBtn text-amber-500 scale-105'
                      : 'text-slate-400 hover:text-amber-500'
                  }`}
                  title="Cambiar a tema claro (Sol)"
                  aria-label="Cambiar a tema claro"
                >
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400/20" />
                </button>
                <button
                  type="button"
                  onClick={() => setColorTheme('dark')}
                  className={`p-1.5 sm:p-2 rounded-full transition-all ${
                    colorTheme === 'dark'
                      ? 'bg-[#1E1B4B] shadow-neuBtn text-indigo-400 scale-105'
                      : 'text-slate-400 hover:text-indigo-400'
                  }`}
                  title="Cambiar a tema oscuro (Luna)"
                  aria-label="Cambiar a tema oscuro"
                >
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-indigo-400/20" />
                </button>
              </div>

              {/* Botón Diseño & Letra */}
              <button
                type="button"
                onClick={onOpenDesignModal}
                className="neu-btn bg-[#F1F2F6] flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-slate-700 text-xs sm:text-sm font-bubble font-bold border border-white/80 shadow-neuBtn hover:text-fio-pink hover:bg-pink-50/70 hover:shadow-neuBtnHover transition-all active:scale-95"
                title="Ajustar paleta de colores y tipografía de todo el sitio"
              >
                <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fio-pink" />
                <span className="hidden xs:inline">Diseño &amp; Letra</span>
                <span className="text-[10px] text-fio-600 bg-fio-100 px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {colorTheme === 'vibrant' ? 'Morado' : colorTheme === 'dark' ? 'Oscuro' : 'Zen'}
                </span>
              </button>

              {/* Botón Menú Principal */}
              <button
                type="button"
                onClick={onSelectAdminHub}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bubble font-bold border border-white/80 shadow-neuBtn transition-all active:scale-95 ${
                  isAdminHub
                    ? 'neu-btn-primary text-white shadow-neuBtnHover'
                    : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 hover:shadow-neuBtnHover'
                }`}
                title="Ir al Menú Principal del Panel de Control"
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fio-yellow" />
                <span>Menú Principal</span>
              </button>

              {/* Botón Cerrar Sesión en Admin */}
              {currentUser && (
                <button
                  type="button"
                  onClick={logoutUser}
                  className="neu-btn bg-[#F1F2F6] flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-bubble font-bold border border-white/80 shadow-neuBtn transition-all active:scale-95"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Menú Desplegable en Móvil (Solo en modo Tienda/Público) */}
      {mobileOpen && currentRoute !== 'admin' && (
        <nav className="md:hidden border-t border-slate-200/40 bg-[#FAF7F2]/95 backdrop-blur-md px-4 py-3 space-y-2 animate-fadeIn">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all ${
              currentRoute === 'home'
                ? 'neu-btn-primary text-white shadow-neuBtnHover'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn'
            }`}
          >
            Inicio
          </button>
          <button
            type="button"
            onClick={() => handleNav('workshops')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all ${
              currentRoute === 'workshops' || currentRoute === 'workshop-detail'
                ? 'neu-btn-primary text-white shadow-neuBtnHover'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn'
            }`}
          >
            Talleres
          </button>
          <button
            type="button"
            onClick={() => handleNav('store')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all ${
              currentRoute === 'store'
                ? 'neu-btn-primary text-white shadow-neuBtnHover'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn'
            }`}
          >
            Tienda
          </button>
          <button
            type="button"
            onClick={() => handleNav('catalogo')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all ${
              currentRoute === 'catalogo'
                ? 'neu-btn-primary text-white shadow-neuBtnHover'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink border border-white/80 shadow-neuBtn'
            }`}
          >
            Catálogo Online
          </button>
          <button
            type="button"
            onClick={() => handleNav('precios')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all ${
              currentRoute === 'precios'
                ? 'neu-btn-primary text-white shadow-neuBtnHover'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink border border-white/80 shadow-neuBtn'
            }`}
          >
            Precios Stickers
          </button>

          {currentUser ? (
            <div className="p-3 rounded-2xl bg-white/80 border border-purple-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bubble font-bold text-slate-800">{currentUser.name}</span>
                </div>
                {currentUser.role === 'admin' && (
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-fio-pink text-[10px] text-white font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
                {currentUser.role === 'staff' && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
                    Staff
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">{currentUser.email || 'Perfil con código PIN'}</p>
              <div className="flex items-center gap-2 pt-1 border-t border-purple-100">
                {(currentUser.role === 'admin' || currentUser.role === 'staff') && (
                  <button
                    type="button"
                    onClick={() => handleNav('admin')}
                    className="flex-1 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-fio-purple text-xs font-bubble font-bold text-center transition-all"
                  >
                    Panel Admin
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setMobileOpen(false);
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bubble font-bold text-center flex items-center justify-center gap-1 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                if (onOpenLogin) onOpenLogin();
                else handleNav('login');
              }}
              className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink border border-white/80 shadow-neuBtn flex items-center gap-2"
            >
              <User className="w-4 h-4 text-fio-pink" />
              <span>Iniciar Sesión 3D</span>
            </button>
          )}

          {/* Selector de Tema en Móvil */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#ECEEF2] border border-white/80 shadow-neuInset">
            <span className="text-xs font-bubble font-bold text-slate-700">Tema de la Web</span>
            <div className="flex items-center p-1 rounded-full bg-white/70 shadow-xs border border-white/90">
              <button
                type="button"
                onClick={() => setColorTheme('vibrant')}
                className={`p-1.5 rounded-full transition-all ${
                  colorTheme !== 'dark'
                    ? 'bg-[#F1F2F6] shadow-neuBtn text-amber-500 scale-105'
                    : 'text-slate-400 hover:text-amber-500'
                }`}
                title="Tema Claro (Sol)"
              >
                <Sun className="w-4 h-4 fill-amber-400/20" />
              </button>
              <button
                type="button"
                onClick={() => setColorTheme('dark')}
                className={`p-1.5 rounded-full transition-all ${
                  colorTheme === 'dark'
                    ? 'bg-[#1E1B4B] shadow-neuBtn text-indigo-400 scale-105'
                    : 'text-slate-400 hover:text-indigo-400'
                }`}
                title="Tema Oscuro (Luna)"
              >
                <Moon className="w-4 h-4 fill-indigo-400/20" />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/40 flex items-center gap-3 px-2">
            <a
              href="https://www.tiktok.com/@by_fio/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold py-1"
            >
              <TikTokIcon className="w-3.5 h-3.5" />
              <span>TikTok @by_fio</span>
            </a>
            <a
              href="https://instagram.com/by_fio10"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-fio-pink font-semibold py-1 ml-auto"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
