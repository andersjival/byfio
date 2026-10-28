import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { ShoppingBag, Sparkles, LayoutDashboard, Instagram, MessageCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { viewMode, setViewMode, cart, setIsCartOpen, orders } = useApp();

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking').length;

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-fio-200/70 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Logo de Marca */}
        <div className="flex items-center gap-3">
          <BrandLogo />
        </div>

        {/* Selector de Entornos Dual (Tienda vs Admin) */}
        <div className="flex items-center p-1.5 bg-fio-100/90 rounded-2xl border border-fio-300/60 shadow-inner">
          <button
            onClick={() => setViewMode('store')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              viewMode === 'store'
                ? 'bg-white text-fio-800 shadow-claySm scale-[1.02]'
                : 'text-purple-600/80 hover:text-purple-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-fio-500" />
            <span className="hidden sm:inline">Vista Cliente</span>
            <span className="sm:hidden">Tienda</span>
          </button>

          <button
            onClick={() => setViewMode('admin')}
            className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              viewMode === 'admin'
                ? 'bg-fio-800 text-white shadow-claySm scale-[1.02]'
                : 'text-purple-600/80 hover:text-purple-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-fio-300" />
            <span className="hidden sm:inline">Panel Admin (WMS & QR)</span>
            <span className="sm:hidden">Admin</span>
            {pendingOrdersCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-fio-pink text-white rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* Acciones Rápidas & Carrito */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://instagram.com/by_fio10"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram @by_fio10"
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-fio-800 hover:bg-fio-200 transition-colors"
          >
            <Instagram className="w-5 h-5 text-fio-pink" />
          </a>

          <a
            href="https://wa.me/50664004640?text=Hola%20Fio!%20Vengo%20de%20la%20página%20web"
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp 6400-4640"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-xs font-semibold"
          >
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span className="hidden lg:inline">6400-4640</span>
          </a>

          {/* Botón Carrito */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Abrir Carrito"
            className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-fio-500 text-white font-semibold text-xs sm:text-sm hover:bg-fio-600 active:scale-95 transition-all shadow-clayBtn"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Carrito</span>
            {totalCartCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 bg-fio-pink text-white rounded-full text-xs font-bold ring-2 ring-white">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
