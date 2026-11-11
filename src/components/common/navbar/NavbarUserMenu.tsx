import React, { useState, useRef, useEffect } from 'react';
import { User, UserPlus, LayoutGrid, LogOut, ClipboardList, ChevronDown, ChevronRight } from 'lucide-react';
import { AppRoute, AuthUser, AdminTabType } from '../../../types';
import { playWaterDropSound, playBubblePopSound } from '../../../utils/soundEffects';

interface NavbarUserMenuProps {
  currentUser: AuthUser | null;
  onNavigate: (route: AppRoute, targetTab?: AdminTabType) => void;
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
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-fio-pink border border-white/80 shadow-sm hover:shadow transition-all text-xs sm:text-sm font-bubble font-bold active:scale-95 shrink-0 cursor-pointer"
          title="Iniciar Sesión"
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fio-pink" />
          <span className="hidden xl:inline">Iniciar Sesión</span>
        </button>

        <button
          type="button"
          onClick={() => (onOpenLogin ? onOpenLogin('register') : onNavigate('login'))}
          aria-label="Registrarse"
          className="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-700 hover:to-pink-600 text-white shadow-sm hover:shadow transition-all text-xs sm:text-sm font-bubble font-bold active:scale-95 shrink-0 cursor-pointer"
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
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl transition-all cursor-pointer group outline-none select-none active:scale-95 ${
          isUserMenuOpen
            ? 'bg-white text-fio-pink border-2 border-fio-pink shadow-[0_4px_14px_rgba(236,72,153,0.3)]'
            : 'bg-white/95 hover:bg-white text-slate-800 border border-white/80 shadow-[0_2px_8px_rgba(80,30,120,0.18),0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md hover:border-purple-200'
        }`}
        title="Abrir menú Mi Cuenta"
        aria-expanded={isUserMenuOpen}
      >
        <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-fio-pink text-white flex items-center justify-center font-bubble font-black text-xs shadow-2xs shrink-0">
          {(currentUser?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="flex items-center gap-1 text-xs sm:text-sm font-bubble font-bold text-slate-800 max-w-[85px] sm:max-w-[120px] xl:max-w-[160px] truncate">
          <span className="truncate">{(currentUser?.name || 'Usuario').split(' ')[0]}</span>
        </div>
        {currentUser.role === 'admin' && (
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-gradient-to-r from-purple-500 to-fio-pink text-[9px] text-white font-bold uppercase tracking-wider shrink-0">
            Admin
          </span>
        )}
        {currentUser.role === 'staff' && (
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[9px] font-bold uppercase tracking-wider shrink-0">
            Colaborador
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-fio-pink transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menú Desplegado hacia Abajo: Sección Mi Cuenta / Colaborador */}
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-purple-200/90 rounded-2xl shadow-[0_12px_32px_rgba(107,33,168,0.14),0_2px_8px_rgba(0,0,0,0.04)] p-2.5 z-[60] animate-in zoom-in-95 duration-150 space-y-1.5">
          {/* Cabecera del Usuario con Nombre e Identidad */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50/70 to-purple-50/50 border border-purple-100 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-fio-pink text-white flex items-center justify-center font-bubble font-black text-base shadow-clayBtn shrink-0">
                {(currentUser.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bubble font-bold text-sm text-slate-900 truncate leading-snug" title={currentUser.name}>
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {currentUser.role === 'admin' ? (
                    <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-purple-500 to-fio-pink text-[9px] text-white font-bold uppercase tracking-wider shadow-2xs shrink-0">
                      Admin
                    </span>
                  ) : currentUser.role === 'staff' ? (
                    <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[9px] font-bold uppercase tracking-wider shrink-0">
                      Colaborador
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded-full bg-pink-100 text-fio-pink text-[9px] font-bold uppercase tracking-wider shrink-0">
                      Cliente
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 truncate" title={currentUser.role === 'staff' ? 'Acceso a Cola de Pedidos' : (currentUser.email || '')}>
                    {currentUser.role === 'staff' ? 'Acceso a Cola de Pedidos' : (currentUser.email || 'Perfil activo by.fio')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {currentUser.role === 'staff' ? (
            /* USUARIO COLABORADOR: Exclusivamente Botón de Cola de Pedidos hacia 'Cola de Pedidos de Clientes' */
            <button
              type="button"
              onClick={() => {
                setIsUserMenuOpen(false);
                onNavigate('admin', 'orders');
                playBubblePopSound(0.3);
              }}
              className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50/70 to-purple-50 hover:from-purple-100 hover:to-pink-100 text-slate-800 hover:text-purple-900 border border-purple-200/90 shadow-2xs transition-all flex items-center justify-between group cursor-pointer active:scale-98"
              title="Ir directo a Cola de Pedidos de Clientes"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-fio-pink text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ClipboardList className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-bubble font-bold text-xs sm:text-sm block text-slate-900 group-hover:text-purple-900 leading-snug">
                    Cola de Pedidos
                  </span>
                  <span className="text-[10px] text-fio-pink font-semibold block">
                    Cola de pedidos de clientes
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-400 group-hover:text-purple-700 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            /* OTROS ROLES (CLIENTE Y ADMIN) */
            <>
              {/* Botón: Mi Cuenta */}
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onNavigate('mi-cuenta');
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

              {currentUser.role === 'admin' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('admin', 'orders');
                      playBubblePopSound(0.3);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-900 transition-colors flex items-center gap-2 text-xs font-bubble font-bold cursor-pointer"
                  >
                    <ClipboardList className="w-4 h-4 text-fio-pink shrink-0" />
                    <span>Cola de Pedidos de Clientes</span>
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
            </>
          )}

          <div className="border-t border-purple-100 my-1" />

          <button
            type="button"
            onClick={() => {
              setIsUserMenuOpen(false);
              logoutUser();
            }}
            className="w-full text-left p-2.5 rounded-xl bg-slate-50/70 hover:bg-rose-50 text-rose-600 border border-slate-100 hover:border-rose-200 transition-colors flex items-center gap-2 text-xs font-bubble font-bold cursor-pointer active:scale-98"
          >
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
              <LogOut className="w-3.5 h-3.5" />
            </div>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};
