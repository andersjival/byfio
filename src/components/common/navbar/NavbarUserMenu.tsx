import React, { useState, useRef, useEffect } from 'react';
import { User, UserPlus, LayoutGrid, LogOut, PackageCheck, ChevronDown, ChevronRight } from 'lucide-react';
import { AppRoute, AuthUser } from '../../../types';
import { playWaterDropSound, playBubblePopSound } from '../../../utils/soundEffects';

interface NavbarUserMenuProps {
  currentUser: AuthUser | null;
  onNavigate: (route: AppRoute) => void;
  onOpenLogin?: (mode?: 'login' | 'register') => void;
  setIsMyAccountOpen: (open: boolean) => void;
  logoutUser: () => void;
}

export const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({
  currentUser,
  onNavigate,
  onOpenLogin,
  setIsMyAccountOpen,
  logoutUser,
}) => {
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

  if (!currentUser) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => (onOpenLogin ? onOpenLogin('login') : onNavigate('login'))}
          aria-label="Iniciar Sesión"
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl neu-btn bg-[#F1F2F6] text-slate-700 hover:text-fio-pink hover:bg-pink-50/70 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover transition-all text-xs sm:text-sm font-bubble font-bold active:scale-95 shrink-0 cursor-pointer"
          title="Iniciar Sesión"
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fio-pink" />
          <span className="hidden xl:inline">Iniciar Sesión</span>
        </button>

        <button
          type="button"
          onClick={() => (onOpenLogin ? onOpenLogin('register') : onNavigate('login'))}
          aria-label="Registrarse"
          className="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-700 hover:to-pink-600 text-white shadow-neuBtn hover:shadow-neuBtnHover transition-all text-xs sm:text-sm font-bubble font-bold active:scale-95 shrink-0 cursor-pointer"
          title="Crear cuenta nueva en 3 pasos"
        >
          <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          <span className="hidden xl:inline">Registrarse</span>
        </button>
      </div>
    );
  }

  return (
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
                  onNavigate('pedidos-mobile');
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
                  onNavigate('admin');
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
  );
};
