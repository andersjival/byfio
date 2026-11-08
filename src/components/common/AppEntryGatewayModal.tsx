import React from 'react';
import { ShoppingBag, PackageCheck, Sparkles, X, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';

interface AppEntryGatewayModalProps {
  isOpen: boolean;
  onSelectStore: () => void;
  onSelectOrders: () => void;
  onClose?: () => void;
}

export const AppEntryGatewayModal: React.FC<AppEntryGatewayModalProps> = ({
  isOpen,
  onSelectStore,
  onSelectOrders,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePickStore = () => {
    playBubblePopSound();
    onSelectStore();
  };

  const handlePickOrders = () => {
    playWaterDropSound();
    onSelectOrders();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#FAF5FF] via-white to-[#FDF4FF] p-6 sm:p-8 shadow-[0_25px_70px_rgba(74,14,120,0.35)] border border-purple-200/80 space-y-6 text-center animate-scaleUp"
      >
        {/* Botón Cerrar (opcional) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-purple-100/60 transition-all cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Logo y Encabezado */}
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <BrandLogo size="md" showSlogan={false} align="center" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-fio-purple text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-fio-pink fill-fio-pink" />
              <span>Portal de Acceso By.Fio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 tracking-tight">
              ¿Cómo deseas ingresar hoy?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-sm mx-auto">
              Selecciona tu destino para disfrutar de la mejor experiencia optimizada:
            </p>
          </div>
        </div>

        {/* Los Dos Botones Principales Mandatorios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Botón 1: TIENDA */}
          <button
            type="button"
            onClick={handlePickStore}
            className="group relative flex flex-col items-center justify-between p-5 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-pink-400/50 text-left min-h-[160px]"
          >
            <div className="w-full flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-bubble font-bold uppercase tracking-wider text-white">
                Público
              </span>
            </div>

            <div className="w-full mt-3 space-y-1">
              <span className="block text-xl font-bubble font-bold text-white group-hover:translate-x-0.5 transition-transform">
                Tienda
              </span>
              <p className="text-[11px] text-pink-100 font-sans leading-tight">
                Catálogo de productos, papelería, agendas y talleres creativos.
              </p>
            </div>

            <div className="w-full pt-2 flex items-center justify-between text-xs font-bubble font-bold text-white/90 border-t border-white/20 mt-2">
              <span>Ir a la Tienda</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Botón 2: ENTRAR A PEDIDOS */}
          <button
            type="button"
            onClick={handlePickOrders}
            className="group relative flex flex-col items-center justify-between p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-purple-950 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-purple-500/30 text-left min-h-[160px]"
          >
            <div className="w-full flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md flex items-center justify-center shadow-inner">
                <PackageCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-[10px] font-bubble font-bold uppercase tracking-wider text-emerald-300">
                Vista Móvil
              </span>
            </div>

            <div className="w-full mt-3 space-y-1">
              <span className="block text-xl font-bubble font-bold text-white group-hover:translate-x-0.5 transition-transform">
                Entrar a pedidos
              </span>
              <p className="text-[11px] text-slate-300 font-sans leading-tight">
                Gestión y alisto de órdenes en tiempo real optimizado para el equipo.
              </p>
            </div>

            <div className="w-full pt-2 flex items-center justify-between text-xs font-bubble font-bold text-emerald-300 border-t border-slate-700/60 mt-2">
              <span>Acceder a Pedidos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Micro-nota inferior */}
        <div className="pt-2 text-[11px] text-slate-400 font-sans flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
          <span>Sincronizado en tiempo real</span>
        </div>
      </div>
    </div>
  );
};
