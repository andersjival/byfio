import React from 'react';
import { User, UserPlus, LogOut, ShieldCheck, Sun, Moon, Instagram } from 'lucide-react';
import { TikTokIcon } from '../TikTokIcon';
import { AppRoute, AuthUser, AdminTabType } from '../../../types';
import { isCollaboratorPwaContext } from '../../../utils/routeHelpers';
import { playBubblePopSound } from '../../../utils/soundEffects';

interface NavbarMobileDrawerProps {
  isOpen: boolean;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute, targetTab?: AdminTabType) => void;
  currentUser: AuthUser | null;
  onOpenLogin?: (mode?: 'login' | 'register') => void;
  setIsMyAccountOpen: (open: boolean) => void;
  logoutUser: () => void;
  colorTheme: string;
  setColorTheme: (theme: 'vibrant' | 'dark' | 'zen') => void;
  isModuleEnabled: (id: string) => boolean;
  isFeatureEnabled: (moduleId: string, featureId: string) => boolean;
}

export const NavbarMobileDrawer: React.FC<NavbarMobileDrawerProps> = ({
  isOpen,
  currentRoute,
  onNavigate,
  currentUser,
  onOpenLogin,
  setIsMyAccountOpen,
  logoutUser,
  colorTheme,
  setColorTheme,
  isModuleEnabled,
  isFeatureEnabled,
}) => {
  if (!isOpen || currentRoute === 'admin' || currentRoute === 'superadmin') {
    return null;
  }

  return (
    <nav className="xl:hidden border-t border-white/40 bg-gradient-to-b from-[#C99BF9] to-[#E2C0F4] backdrop-blur-md px-4 py-3 space-y-2 animate-fadeIn pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+1rem))]">
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all active:scale-95 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
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
          className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all active:scale-95 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
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
          className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all active:scale-95 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
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
          className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold transition-all active:scale-95 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
            currentRoute === 'catalogo'
              ? 'bg-gradient-to-r from-[#F9A8D4] to-[#F472B6] text-white [text-shadow:_0_1px_2px_rgba(190,24,93,0.25)] border border-pink-200/80 shadow-[0_3px_10px_rgba(244,114,182,0.3)]'
              : 'bg-white/90 text-slate-700 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:bg-[#FDF2F8] hover:text-slate-800'
          }`}
        >
          Catálogo
        </button>
      )}

      {(currentUser?.role === 'admin' || currentUser?.role === 'staff' || isCollaboratorPwaContext()) && (
        <button
          type="button"
          onClick={() => onNavigate('admin', 'orders')}
          className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold bg-gradient-to-r from-purple-700 to-fio-pink text-white border border-purple-300/40 shadow-neuBtn active:scale-95 transition-all flex items-center justify-between cursor-pointer"
        >
          <span>📋 Cola de Pedidos de Clientes</span>
        </button>
      )}

      {currentUser ? (
        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50/70 to-purple-50/50 border border-purple-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-fio-pink text-white flex items-center justify-center font-bubble font-black text-xs shadow-clayBtn shrink-0">
                {(currentUser.name || 'U').charAt(0).toUpperCase()}
              </div>
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
              onNavigate('mi-cuenta');
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
                onClick={() => onNavigate('admin')}
                className="flex-1 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-fio-purple text-xs font-bubble font-bold text-center transition-all"
              >
                Panel Admin
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('superadmin')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bubble font-bold text-center flex items-center justify-center gap-1 transition-all"
              title="Panel Maestro Superadmin"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
              <span>Superadmin</span>
            </button>
            <button
              type="button"
              onClick={logoutUser}
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
              if (onOpenLogin) onOpenLogin('login');
              else onNavigate('login');
            }}
            className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bubble font-bold neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink border border-white/80 shadow-neuBtn flex items-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4 text-fio-pink" />
            <span>Iniciar Sesión</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenLogin) onOpenLogin('register');
              else onNavigate('login');
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
  );
};
