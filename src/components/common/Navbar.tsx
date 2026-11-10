import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { TikTokIcon } from './TikTokIcon';
import { AppRoute } from '../../types';
import { ShoppingBag, Instagram, MessageCircle, Menu, X, ArrowLeft, User, UserPlus, LayoutGrid, LogOut, ShieldCheck, Sun, Moon, Heart, PackageCheck, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';
import { metricsTracker } from '../../services/metricsTracker';
import { isCollaboratorPwaContext } from '../../utils/routeHelpers';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenLogin?: (mode?: 'login' | 'register') => void;
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
  const { cart, setIsCartOpen, colorTheme, setColorTheme, currentUser, logoutUser, isModuleEnabled, isFeatureEnabled, setIsMyAccountOpen } = useApp();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [likePopped, setLikePopped] = useState(false);

  const handlePageLike = () => {
    metricsTracker.recordLike(currentRoute);
    setLikePopped(true);
    setTimeout(() => setLikePopped(false), 900);
  };

  const safeCart = Array.isArray(cart) ? cart.filter(Boolean) : [];
  const totalCartCount = safeCart.reduce((acc, it) => acc + (it && it.quantity ? it.quantity : 1), 0);

  const handleNav = (route: AppRoute) => {
    onNavigate(route);
    setMobileOpen(false);
  };

  const isPwaOrStaffOrAdmin = Boolean(
    currentRoute === 'admin' ||
    currentRoute === 'pedidos-mobile' ||
    currentRoute === 'superadmin' ||
    (currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff'))
  );

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#C99BF9] via-[#D4AEFA] to-[#E2C0F4] border-b border-white/50 shadow-[0_4px_20px_rgba(180,130,220,0.25)] transition-all">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 min-h-[50px] sm:min-h-[54px] py-1.5 flex items-center justify-between gap-1.5 sm:gap-2 w-full">
        {/* Logo de Marca con botón de Volver a Tienda inmediatamente al lado en Admin */}
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
              className="neu-btn bg-[#F1F2F6] flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-slate-700 text-xs sm:text-sm font-bubble font-bold border border-white/80 shadow-neuBtn hover:text-fio-pink hover:bg-pink-50/70 hover:shadow-neuBtnHover transition-all active:scale-95 shrink-0"
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
              className="neu-btn bg-[#F1F2F6] flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-purple-700 text-xs sm:text-sm font-bubble font-bold border border-purple-200/80 shadow-neuBtn hover:bg-purple-50 transition-all active:scale-95 shrink-0"
              title="Ir al Panel de Administración"
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Panel Admin</span>
              <span className="sm:hidden whitespace-nowrap">Admin</span>
            </button>
          )}
        </div>

        {/* Links de Navegación de Páginas Principales con Estilo Neumórfico Táctil (Solo en Modo Público) */}
        {currentRoute !== 'admin' && currentRoute !== 'superadmin' && (
          <nav className="hidden xl:flex items-center gap-2 xl:gap-2.5 shrink">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-2xl text-xs xl:text-sm font-bubble font-bold transition-all whitespace-nowrap active:scale-95 ${
                currentRoute === 'home'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white border border-amber-300/80 shadow-[0_3px_10px_rgba(245,158,11,0.35)]'
                  : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#FEF9C3] hover:text-amber-900'
              }`}
            >
              Inicio
            </button>

            {isModuleEnabled('workshops') && (
              <button
                type="button"
                onClick={() => handleNav('workshops')}
                className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-2xl text-xs xl:text-sm font-bubble font-bold transition-all whitespace-nowrap active:scale-95 ${
                  currentRoute === 'workshops' || currentRoute === 'workshop-detail'
                    ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-white border border-sky-300/80 shadow-[0_3px_10px_rgba(2,132,199,0.35)]'
                    : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#E0F2FE] hover:text-sky-900'
                }`}
              >
                Talleres
              </button>
            )}

            {isModuleEnabled('store') && (
              <button
                type="button"
                onClick={() => handleNav('store')}
                className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-2xl text-xs xl:text-sm font-bubble font-bold transition-all whitespace-nowrap active:scale-95 ${
                  currentRoute === 'store'
                    ? 'bg-gradient-to-r from-[#F472B6] to-[#EC4899] text-white border border-pink-300/80 shadow-[0_3px_10px_rgba(236,72,153,0.35)]'
                    : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#FCE7F3] hover:text-pink-900'
                }`}
              >
                Tienda
              </button>
            )}

            {isModuleEnabled('catalogo') && isFeatureEnabled('catalogo', 'catalog_public_button') && (
              <button
                type="button"
                onClick={() => handleNav('catalogo')}
                className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-2xl text-xs xl:text-sm font-bubble font-bold transition-all whitespace-nowrap active:scale-95 ${
                  currentRoute === 'catalogo'
                    ? 'neu-btn-primary text-white border border-purple-300/80 shadow-[0_3px_10px_rgba(147,51,234,0.35)]'
                    : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#F3E8FF] hover:text-purple-900'
                }`}
              >
                Catálogo
              </button>
            )}
          </nav>
        )}

        {/* Acciones del Encabezado */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Si NO es admin ni superadmin: Redes Sociales, Carrito y Login */}
          {currentRoute !== 'admin' && currentRoute !== 'superadmin' ? (
            <>
              {/* Redes Sociales Oficiales (En pantallas grandes para clientes públicos) */}
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

              {/* Botón Interactivo de Me Gusta a la Web (Solo en tienda pública para clientes) */}
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

              {/* Sesión de Usuario con Menú Desplegable 'Mi Cuenta' */}
              {currentUser ? (
                <div className="relative shrink-0" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen((prev) => !prev);
                      playWaterDropSound();
                    }}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-white/95 hover:bg-white border border-purple-200/90 hover:border-fio-pink rounded-2xl shadow-xs transition-all cursor-pointer group"
                    title="Abrir menú Mi Cuenta"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-purple-600 to-fio-pink text-white flex items-center justify-center font-bubble font-bold text-xs shadow-2xs shrink-0">
                      {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bubble font-bold text-slate-700 max-w-[70px] sm:max-w-[100px] xl:max-w-[130px] truncate">
                      <span className="truncate">{(currentUser?.name || 'Usuario').split(' ')[0]}</span>
                    </div>
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
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-fio-pink transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Menú Desplegado hacia Abajo: Sección Mi Cuenta */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white/98 backdrop-blur-xl border border-purple-200/90 rounded-2xl shadow-2xl p-2 z-[60] animate-in zoom-in-95 duration-150 space-y-1">
                      <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50/60 border border-purple-100">
                        <p className="font-bubble font-bold text-xs text-slate-900 truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {currentUser.email || 'Perfil activo by.fio'}
                        </p>
                      </div>

                      {/* Botón Mandatorio: Mi Cuenta */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsMyAccountOpen(true);
                          playBubblePopSound(0.3);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-pink-50 text-slate-800 hover:text-fio-pink transition-colors flex items-center justify-between group cursor-pointer border border-transparent hover:border-pink-200"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-pink-100 text-fio-pink flex items-center justify-center shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bubble font-bold text-xs block text-slate-900 group-hover:text-fio-pink">
                              Mi Cuenta
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Envíos, pedidos, promos y mapa
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-fio-pink" />
                      </button>

                      {(currentUser.role === 'admin' || currentUser.role === 'staff') && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              handleNav('pedidos-mobile');
                            }}
                            className="w-full text-left p-2 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors flex items-center gap-2 text-xs font-bubble font-bold cursor-pointer"
                          >
                            <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Gestión de Pedidos (Móvil)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              handleNav('admin');
                            }}
                            className="w-full text-left p-2 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-900 transition-colors flex items-center gap-2 text-xs font-bubble font-bold cursor-pointer"
                          >
                            <LayoutGrid className="w-4 h-4 text-purple-600 shrink-0" />
                            <span>Panel de Administración</span>
                          </button>
                        </>
                      )}

                      <div className="border-t border-purple-100 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logoutUser();
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors flex items-center gap-2 text-xs font-bubble font-bold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => (onOpenLogin ? onOpenLogin('login') : handleNav('login'))}
                    aria-label="Iniciar Sesión"
                    className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover transition-all text-xs sm:text-sm font-bubble font-bold active:scale-95 shrink-0 cursor-pointer"
                    title="Iniciar Sesión"
                  >
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fio-pink" />
                    <span className="hidden xl:inline">Iniciar Sesión</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => (onOpenLogin ? onOpenLogin('register') : handleNav('login'))}
                    aria-label="Registrarse"
                    className="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-700 hover:to-pink-600 text-white shadow-neuBtn hover:shadow-neuBtnHover transition-all text-xs sm:text-sm font-bubble font-bold active:scale-95 shrink-0 cursor-pointer"
                    title="Crear cuenta nueva en 3 pasos"
                  >
                    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    <span className="hidden xl:inline">Registrarse</span>
                  </button>
                </div>
              )}

              {/* Botón Carrito de Compras Neumórfico */}
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

              {/* Botón Hamburguesa Mobile y Tablets */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden p-2 rounded-xl neu-btn bg-[#F1F2F6] border border-white/80 text-slate-700 shadow-neuBtn active:scale-95 transition-all shrink-0 cursor-pointer"
                aria-label="Abrir menú"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </>
          ) : currentRoute === 'superadmin' ? (
            /* EN PORTAL SUPERADMIN: Acciones exclusivas del Maestro */
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Selector de Tema Claro / Oscuro en Superadmin */}
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

              {/* Botón Ir a Admin desde Superadmin */}
              <button
                type="button"
                onClick={() => handleNav('admin')}
                className="neu-btn bg-[#F1F2F6] flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-purple-700 hover:bg-purple-50 text-xs sm:text-sm font-bubble font-bold border border-purple-200/80 shadow-neuBtn transition-all active:scale-95 shrink-0"
                title="Ir al Panel de Administración (/admin)"
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
                <span className="whitespace-nowrap">Panel Admin</span>
              </button>
            </div>
          ) : (
            /* EN PANEL DE ADMINISTRACIÓN: Redes sociales retiradas, colocamos Diseño & Letra y Menú Principal */
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Selector de Tema Claro / Oscuro en Admin */}
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

              {/* Botón Menú Principal */}
              <button
                type="button"
                onClick={onSelectAdminHub}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bubble font-bold border border-white/80 shadow-neuBtn transition-all active:scale-95 shrink-0 whitespace-nowrap ${
                  isAdminHub
                    ? 'neu-btn-primary text-white shadow-neuBtnHover'
                    : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 hover:shadow-neuBtnHover'
                }`}
                title="Ir al Menú del Panel de Control"
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fio-yellow shrink-0" />
                <span className="whitespace-nowrap">Menú</span>
              </button>

              

              {/* Botón Cerrar Sesión en Admin */}
              {currentUser && (
                <button
                  type="button"
                  onClick={logoutUser}
                  className="neu-btn bg-[#F1F2F6] flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-bubble font-bold border border-white/80 shadow-neuBtn transition-all active:scale-95 shrink-0"
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

      {/* Menú Desplegable en Móvil y Tablets (Solo en modo Tienda/Público) */}
      {mobileOpen && currentRoute !== 'admin' && currentRoute !== 'superadmin' && (
        <nav className="xl:hidden border-t border-white/40 bg-gradient-to-b from-[#C99BF9] to-[#E2C0F4] backdrop-blur-md px-4 py-3 space-y-2 animate-fadeIn">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all active:scale-95 ${
              currentRoute === 'home'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white border border-amber-300/80 shadow-[0_3px_10px_rgba(245,158,11,0.35)]'
                : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#FEF9C3] hover:text-amber-900'
            }`}
          >
            Inicio
          </button>
          {isModuleEnabled('workshops') && (
            <button
              type="button"
              onClick={() => handleNav('workshops')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all active:scale-95 ${
                currentRoute === 'workshops' || currentRoute === 'workshop-detail'
                  ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-white border border-sky-300/80 shadow-[0_3px_10px_rgba(2,132,199,0.35)]'
                  : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#E0F2FE] hover:text-sky-900'
              }`}
            >
              Talleres
            </button>
          )}
          {isModuleEnabled('store') && (
            <button
              type="button"
              onClick={() => handleNav('store')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all active:scale-95 ${
                currentRoute === 'store'
                  ? 'bg-gradient-to-r from-[#F472B6] to-[#EC4899] text-white border border-pink-300/80 shadow-[0_3px_10px_rgba(236,72,153,0.35)]'
                  : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#FCE7F3] hover:text-pink-900'
              }`}
            >
              Tienda
            </button>
          )}
          {isModuleEnabled('catalogo') && isFeatureEnabled('catalogo', 'catalog_public_button') && (
            <button
              type="button"
              onClick={() => handleNav('catalogo')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all active:scale-95 ${
                currentRoute === 'catalogo'
                  ? 'neu-btn-primary text-white border border-purple-300/80 shadow-[0_3px_10px_rgba(147,51,234,0.35)]'
                  : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#F3E8FF] hover:text-purple-900'
              }`}
            >
              Catálogo Online
            </button>
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'staff' || isCollaboratorPwaContext()) && (
            <button
              type="button"
              onClick={() => handleNav('pedidos-mobile')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold neu-btn ${
                currentRoute === 'pedidos-mobile'
                  ? 'neu-btn-primary text-white shadow-neuBtnHover'
                  : 'bg-gradient-to-r from-slate-900 to-purple-950 text-white hover:text-emerald-300 border border-purple-500/30 shadow-neuBtn'
              }`}
            >
              📦 Entrar a pedidos (Móvil)
            </button>
          )}

          {currentUser ? (
            <div className="p-3 rounded-2xl bg-white/80 border border-purple-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bubble font-bold text-slate-800">{currentUser?.name || 'Usuario'}</span>
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
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setIsMyAccountOpen(true);
                  playBubblePopSound(0.3);
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink text-white text-xs font-bubble font-bold text-center flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-white" />
                <span>Mi Cuenta (Datos, Pedidos y Ofertas)</span>
              </button>
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
                  onClick={() => handleNav('superadmin')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bubble font-bold text-center flex items-center justify-center gap-1 transition-all"
                  title="Panel Maestro Superadmin"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                  <span>Superadmin</span>
                </button>
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
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  if (onOpenLogin) onOpenLogin('login');
                  else handleNav('login');
                }}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink border border-white/80 shadow-neuBtn flex items-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-fio-pink" />
                <span>Iniciar Sesión</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  if (onOpenLogin) onOpenLogin('register');
                  else handleNav('login');
                }}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold bg-gradient-to-r from-purple-600 to-fio-pink text-white shadow-neuBtn flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Crear Cuenta (Registro 3 Pasos)</span>
                </div>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bubble font-bold uppercase">Nuevo</span>
              </button>
            </div>
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
