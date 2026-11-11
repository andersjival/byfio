import React from 'react';
import { AppRoute } from '../../../types';

interface NavbarNavLinksProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  isModuleEnabled: (id: string) => boolean;
  isFeatureEnabled: (moduleId: string, featureId: string) => boolean;
}

export const NavbarNavLinks: React.FC<NavbarNavLinksProps> = ({
  currentRoute,
  onNavigate,
  isModuleEnabled,
  isFeatureEnabled,
}) => {
  return (
    <nav className="hidden xl:flex items-center gap-2 xl:gap-2.5 shrink">
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-2xl text-xs xl:text-sm font-bubble font-bold transition-all whitespace-nowrap active:scale-95 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
          currentRoute === 'home'
            ? 'bg-gradient-to-r from-[#FEF08A] to-[#FDE047] text-amber-950 border border-yellow-200/80 shadow-[0_3px_10px_rgba(250,204,21,0.22)]'
            : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#FEFCE8] hover:text-amber-800'
        }`}
      >
        Inicio
      </button>

      {isModuleEnabled('workshops') && (
        <button
          type="button"
          onClick={() => onNavigate('workshops')}
          className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-2xl text-xs xl:text-sm font-bubble font-bold transition-all whitespace-nowrap active:scale-95 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
            currentRoute === 'workshops' || currentRoute === 'workshop-detail'
              ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-white border border-sky-300/60 shadow-[0_3px_10px_rgba(2,132,199,0.35)]'
              : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#E0F2FE] hover:text-sky-800'
          }`}
        >
          Talleres
        </button>
      )}

      {isModuleEnabled('store') && (
        <button
          type="button"
          onClick={() => onNavigate('store')}
          className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-2xl text-xs xl:text-sm font-bubble font-bold transition-all whitespace-nowrap active:scale-95 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
            currentRoute === 'store'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border border-purple-300/60 shadow-[0_3px_10px_rgba(147,51,234,0.35)]'
              : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#F3E8FF] hover:text-purple-800'
          }`}
        >
          Tienda
        </button>
      )}

      {isModuleEnabled('catalogo') && isFeatureEnabled('catalogo', 'catalog_public_button') && (
        <button
          type="button"
          onClick={() => onNavigate('catalogo')}
          className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-2xl text-xs xl:text-sm font-bubble font-bold transition-all whitespace-nowrap active:scale-95 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
            currentRoute === 'catalogo'
              ? 'bg-gradient-to-r from-[#F9A8D4] to-[#F472B6] text-white [text-shadow:_0_1px_2px_rgba(190,24,93,0.25)] border border-pink-200/80 shadow-[0_3px_10px_rgba(244,114,182,0.3)]'
              : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#FDF2F8] hover:text-pink-600'
          }`}
        >
          Catálogo
        </button>
      )}
    </nav>
  );
};
