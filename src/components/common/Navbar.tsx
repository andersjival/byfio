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
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/85 backdrop-blur-md border-b border-white/60 shadow-[0_4px_20px_rgba(180,160,200,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Logo de Marca — Clic regresa al Inicio */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 shrink-0 text-left focus:outline-none"
          title="Ir al inicio de by.fio"
        >
          <BrandLogo />
        </button>

        {/* Links de Navegación de Páginas Independientes */}
        {currentRoute !== 'admin' ? (
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-[inset_1px_1px_2px_rgba(160,140,190,0.08)]">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                currentRoute === 'home'
                  ? 'bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Inicio
            </button>

            <button
              type="button"
              onClick={() => handleNav('workshops')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                currentRoute === 'workshops'
                  ? 'bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Talleres
            </button>

            <button
              type="button"
              onClick={() => handleNav('store')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                currentRoute === 'store'
                  ? 'bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              Tienda
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-fio-800 text-white text-xs font-bold tracking-wide shadow-sm">
              Panel Administrativo (WMS / Alisto)
            </span>
          </div>
        )}

        {/* Redes Sociales (TikTok Oficial, Instagram, WhatsApp) & Carrito */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* TikTok Oficial: https://www.tiktok.com/@by_fio/ */}
          <a
            href="https://www.tiktok.com/@by_fio/"
            target="_blank"
            rel="noopener noreferrer"
            title="TikTok oficial @by_fio"
            aria-label="TikTok @by_fio"
            className="flex items-center justify-center w-9 h-9 rounded-2xl bg-white/80 text-slate-700 hover:text-black hover:bg-white border border-white/80 shadow-[0_2px_8px_rgba(180,160,200,0.1)] hover:scale-105 transition-all"
          >
            <TikTokIcon className="w-4 h-4" />
          </a>

          {/* Instagram @by_fio10 */}
          <a
            href="https://instagram.com/by_fio10"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram @by_fio10"
            aria-label="Instagram @by_fio10"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-2xl bg-white/80 text-fio-pink hover:bg-white border border-white/80 shadow-[0_2px_8px_rgba(180,160,200,0.1)] hover:scale-105 transition-all"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* WhatsApp Directo */}
          <a
            href="https://wa.me/50664004640?text=Hola%20Fio!%20Vengo%20de%20la%20página%20web"
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp 6400-4640"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-50/90 text-emerald-700 hover:bg-emerald-100/90 border border-emerald-200/50 shadow-sm transition-colors text-xs font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>6400-4640</span>
          </a>

          {/* Botón Carrito de Compras */}
          {currentRoute !== 'admin' && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir Carrito"
              className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] hover:from-[#C084FC] hover:to-[#A855F7] text-white font-semibold text-xs sm:text-sm shadow-[0_6px_16px_rgba(192,132,252,0.35),inset_0_1px_2px_rgba(255,255,255,0.6)] active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Carrito</span>
              {totalCartCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 bg-fio-pink text-white rounded-full text-xs font-bold ring-2 ring-white">
                  {totalCartCount}
                </span>
              )}
            </button>
          )}

          {/* Si está en admin, botón para salir y volver a la tienda */}
          {currentRoute === 'admin' && (
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold border border-white/80 shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Tienda</span>
            </button>
          )}

          {/* Botón Hamburguesa Mobile */}
          {currentRoute !== 'admin' && (
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-2xl bg-white/80 border border-white/80 text-slate-700 hover:bg-white"
              aria-label="Abrir menú"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Menú Desplegable en Móvil */}
      {mobileOpen && currentRoute !== 'admin' && (
        <nav className="md:hidden border-t border-slate-200/40 bg-[#FAF7F2]/95 backdrop-blur-md px-4 py-3 space-y-1.5 animate-fadeIn">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              currentRoute === 'home' ? 'bg-fio-800 text-white' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            Inicio
          </button>
          <button
            type="button"
            onClick={() => handleNav('workshops')}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              currentRoute === 'workshops' ? 'bg-fio-800 text-white' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            Talleres
          </button>
          <button
            type="button"
            onClick={() => handleNav('store')}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              currentRoute === 'store' ? 'bg-fio-800 text-white' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            Tienda
          </button>

          <div className="pt-2 border-t border-slate-200/40 flex items-center gap-3 px-2">
            <a
              href="https://www.tiktok.com/@by_fio/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold py-1"
            >
              <TikTokIcon className="w-4 h-4" />
              <span>TikTok @by_fio</span>
            </a>
            <a
              href="https://instagram.com/by_fio10"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-fio-pink font-semibold py-1 ml-auto"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
