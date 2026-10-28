import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { ShoppingBag, Instagram, MessageCircle, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio', target: 'hero-section' },
  { label: 'Talleres', target: 'workshops-section' },
  { label: 'Tienda', target: 'products-section' },
];

export const Navbar: React.FC = () => {
  const { viewMode, setViewMode, cart, setIsCartOpen } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero-section');

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  // Hash routing: #admin toggles admin view
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setViewMode('admin');
      } else {
        setViewMode('store');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setViewMode]);

  // Intersection observer for active section highlight
  useEffect(() => {
    if (viewMode !== 'store') return;
    const ids = NAV_LINKS.map((l) => l.target);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [viewMode]);

  const scrollTo = (target: string) => {
    if (viewMode === 'admin') {
      window.location.hash = '';
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-fio-200/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <BrandLogo />
        </div>

        {/* Desktop Nav Links */}
        {viewMode === 'store' && (
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeSection === link.target
                    ? 'bg-fio-100 text-fio-800 shadow-sm'
                    : 'text-gray-600 hover:text-fio-800 hover:bg-fio-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {viewMode === 'admin' && (
          <nav className="hidden md:flex items-center">
            <span className="px-3 py-1.5 rounded-xl bg-fio-800 text-white text-xs font-bold">
              Panel Administrativo
            </span>
          </nav>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://instagram.com/by_fio10"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram @by_fio10"
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-fio-800 hover:bg-fio-200 transition-colors"
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

          {/* Cart button (store only) */}
          {viewMode === 'store' && (
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
          )}

          {/* Back to store (admin only) */}
          {viewMode === 'admin' && (
            <button
              onClick={() => { window.location.hash = ''; }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-fio-100 text-fio-800 font-semibold text-xs hover:bg-fio-200 transition-all"
            >
              ← Volver a la Tienda
            </button>
          )}

          {/* Mobile menu toggle */}
          {viewMode === 'store' && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-fio-50 text-gray-600"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && viewMode === 'store' && (
        <nav className="md:hidden border-t border-fio-200/70 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.target}
              onClick={() => scrollTo(link.target)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeSection === link.target
                  ? 'bg-fio-100 text-fio-800'
                  : 'text-gray-600 hover:bg-fio-50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};
