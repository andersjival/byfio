import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { TikTokIcon } from './TikTokIcon';
import { AppRoute } from '../../types';
import { ShoppingBag, Instagram, MessageCircle, Menu, X, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { cart, setIsCartOpen } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  const handleNav = (route: AppRoute) => {
    onNavigate(route);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-white/70 shadow-[0_2px_12px_rgba(180,160,200,0.05)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[50px] sm:min-h-[54px] py-1.5 flex items-center justify-between gap-2.5">
        {/* Logo de Marca con Estrella, Corazón Interactivo y Slogan */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="flex items-center shrink-0 text-left focus:outline-none"
          title="Ir al inicio de by.fio"
        >
          <BrandLogo size="sm" showSlogan={true} />
        </button>

        {/* Links de Navegación de Páginas Principales con Estilo Neumórfico Táctil */}
        {currentRoute !== 'admin' ? (
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
        ) : (
          <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl bg-[#ECEEF2] shadow-neuInset border border-white/60">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="neu-btn bg-[#F1F2F6] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bubble font-bold text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-fio-pink" />
              <span>Ver Tienda / Web</span>
            </button>
          </nav>
        )}

        {/* Redes Sociales & Carrito Compactos */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* TikTok Oficial */}
          <a
            href="https://www.tiktok.com/@by_fio/"
            target="_blank"
            rel="noopener noreferrer"
            title="TikTok oficial @by_fio"
            aria-label="TikTok @by_fio"
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/85 text-slate-700 hover:text-black hover:bg-white border border-white/80 shadow-xs hover:scale-105 transition-all"
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

          {/* Botón Carrito de Compras Neumórfico */}
          {currentRoute !== 'admin' && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir Carrito"
              className="relative flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl neu-btn-primary text-white font-bubble font-bold text-xs sm:text-sm shadow-neuBtn hover:shadow-neuBtnHover active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Carrito</span>
              {totalCartCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 bg-fio-pink text-white rounded-full text-[10px] font-bold ring-2 ring-white">
                  {totalCartCount}
                </span>
              )}
            </button>
          )}

          {/* Botón para volver a la tienda desde admin */}
          {currentRoute === 'admin' && (
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="neu-btn bg-[#F1F2F6] flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-700 text-xs sm:text-sm font-bubble font-bold border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-fio-pink" />
              <span>Volver a Tienda</span>
            </button>
          )}

          {/* Botón Hamburguesa Mobile */}
          {currentRoute !== 'admin' && (
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl neu-btn bg-[#F1F2F6] border border-white/80 text-slate-700 shadow-neuBtn active:scale-95 transition-all"
              aria-label="Abrir menú"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Menú Desplegable en Móvil */}
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
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn'
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
                : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn'
            }`}
          >
            Precios Stickers
          </button>

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
