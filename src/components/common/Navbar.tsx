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

        {/* Links de Navegación de Páginas Independientes (50% más delgado) */}
        {currentRoute !== 'admin' ? (
          <nav className="hidden md:flex items-center gap-1 p-0.5 rounded-xl bg-white/75 backdrop-blur-sm border border-white/80 shadow-[inset_1px_1px_2px_rgba(160,140,190,0.06)]">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentRoute === 'home'
                  ? 'bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Inicio
            </button>

            <button
              type="button"
              onClick={() => handleNav('workshops')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentRoute === 'workshops' || currentRoute === 'workshop-detail'
                  ? 'bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Talleres
            </button>

            <button
              type="button"
              onClick={() => handleNav('store')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentRoute === 'store'
                  ? 'bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Tienda
            </button>

            <button
              type="button"
              onClick={() => handleNav('catalogo')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentRoute === 'catalogo'
                  ? 'bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Catálogo
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-1 p-0.5 rounded-xl bg-white/75 backdrop-blur-sm border border-white/80 shadow-[inset_1px_1px_2px_rgba(160,140,190,0.06)]">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-fio-pink" />
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

          {/* Botón Carrito de Compras Compacto */}
          {currentRoute !== 'admin' && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir Carrito"
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] hover:from-[#C084FC] hover:to-[#A855F7] text-white font-semibold text-xs shadow-xs active:scale-95 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Carrito</span>
              {totalCartCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-4 px-1 bg-fio-pink text-white rounded-full text-[10px] font-bold ring-1.5 ring-white">
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
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold border border-white/80 shadow-xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Tienda</span>
            </button>
          )}

          {/* Botón Hamburguesa Mobile */}
          {currentRoute !== 'admin' && (
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-xl bg-white/80 border border-white/80 text-slate-700 hover:bg-white"
              aria-label="Abrir menú"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Menú Desplegable en Móvil */}
      {mobileOpen && currentRoute !== 'admin' && (
        <nav className="md:hidden border-t border-slate-200/40 bg-[#FAF7F2]/95 backdrop-blur-md px-4 py-2.5 space-y-1 animate-fadeIn">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentRoute === 'home' ? 'bg-fio-800 text-white' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            Inicio
          </button>
          <button
            type="button"
            onClick={() => handleNav('workshops')}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentRoute === 'workshops' || currentRoute === 'workshop-detail'
                ? 'bg-fio-800 text-white'
                : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            Talleres
          </button>
          <button
            type="button"
            onClick={() => handleNav('store')}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentRoute === 'store' ? 'bg-fio-800 text-white' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            Tienda
          </button>
          <button
            type="button"
            onClick={() => handleNav('catalogo')}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentRoute === 'catalogo' ? 'bg-fio-800 text-white' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            Catálogo Online
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
