import React from 'react';
import { AppRoute } from '../../types';
import { AnimatedByfioLetters } from '../common/AnimatedByfioLetters';
import { HeroAnimatedSlogan } from './HeroAnimatedSlogan';
import { Sparkles, ShoppingBag, Calendar, Heart, Star, CheckCircle2 } from 'lucide-react';

interface HeroDualProps {
  onScrollToWorkshops: () => void;
  onScrollToProducts: () => void;
  onNavigate?: (route: AppRoute) => void;
}

export const HeroDual: React.FC<HeroDualProps> = ({
  onScrollToWorkshops,
  onScrollToProducts,
  onNavigate,
}) => {
  return (
    <section
      id="hero-section"
      className="relative w-full overflow-hidden min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center py-6 sm:py-14 px-3 sm:px-6 lg:px-8"
    >
      {/* Fondo con Degradado Lila Pastel Oficial de Pantalla Completa De Borde a Borde (Full Bleed) */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#D4AEFA]/35 via-[#E7B8F9]/18 to-transparent -z-10 pointer-events-none" />

      {/* Resplandores ambientales expansivos de ancho completo (Sin bordes ni cortes laterales) */}
      <div className="absolute -top-28 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#D4AEFA]/40 via-[#C084FC]/25 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute -top-28 -right-20 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-[#EC4899]/20 via-[#F472B6]/15 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#FFF07C]/12 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto text-center w-full my-auto space-y-4 sm:space-y-6">
        {/* Coreografía Hero: Primero el badge suavemente, luego texto pausado, estrella, corazón y BYFIO */}
        <div className="w-full">
          <HeroAnimatedSlogan />
        </div>

        <p className="text-xs sm:text-base text-purple-950/80 max-w-2xl mx-auto leading-relaxed font-medium px-2">
          Talleres creativos de encuadernación, agendas y sublimación, junto a productos personalizados con amor e insumos en Costa Rica.
        </p>

        {/* Botones Duales con Estilo Neumórfico Táctil */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto pt-2 pb-2 w-full px-2 sm:px-0">
          <button
            type="button"
            onClick={onScrollToWorkshops}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 sm:gap-3 px-6 py-3.5 sm:px-9 sm:py-4.5 rounded-2xl neu-btn-primary text-white font-bubble font-bold text-sm sm:text-lg shadow-neuBtnHover active:scale-95 transition-all"
          >
            <Calendar className="w-5 h-5 text-[#FFF07C]" />
            <span>Ver Talleres Creativos</span>
          </button>

          <button
            type="button"
            onClick={onScrollToProducts}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 sm:gap-3 px-6 py-3.5 sm:px-9 sm:py-4.5 rounded-2xl neu-btn bg-[#F1F2F6] text-slate-800 border border-white/90 font-bubble font-bold text-sm sm:text-lg shadow-neuBtn hover:shadow-neuBtnHover active:scale-95 transition-all"
          >
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <span>Ir a la Tienda &amp; Insumos</span>
          </button>
        </div>

        {/* Píldoras de Calidad / Cajas de Información Neumórficas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-4xl mx-auto pt-2 px-1 sm:px-0">
          <div className="hero-quality-pill bg-[#F1F2F6]/90 backdrop-blur rounded-2xl p-2.5 sm:p-3 border border-white/80 shadow-neuCard flex items-center gap-2 sm:gap-2.5 text-left">
            <span className="p-1.5 sm:p-2 rounded-xl neu-btn-circle text-amber-500 shadow-neuBtn shrink-0">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-500" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">+1,500 Alumnas</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Talleres con amor</p>
            </div>
          </div>

          <div className="hero-quality-pill bg-[#F1F2F6]/90 backdrop-blur rounded-2xl p-2.5 sm:p-3 border border-white/80 shadow-neuCard flex items-center gap-2 sm:gap-2.5 text-left">
            <span className="p-1.5 sm:p-2 rounded-xl neu-btn-circle text-fio-pink shadow-neuBtn shrink-0">
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-fio-pink text-fio-pink" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">100% Personalizado</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Con tu nombre</p>
            </div>
          </div>

          <div className="hero-quality-pill bg-[#F1F2F6]/90 backdrop-blur rounded-2xl p-2.5 sm:p-3 border border-white/80 shadow-neuCard flex items-center gap-2 sm:gap-2.5 text-left">
            <span className="p-1.5 sm:p-2 rounded-xl neu-btn-circle text-[#38BDF8] shadow-neuBtn shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">Pago SINPE Móvil</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Al 6400-4640</p>
            </div>
          </div>

          <div className="hero-quality-pill bg-[#F1F2F6]/90 backdrop-blur rounded-2xl p-2.5 sm:p-3 border border-white/80 shadow-neuCard flex items-center gap-2 sm:gap-2.5 text-left">
            <span className="p-1.5 sm:p-2 rounded-xl neu-btn-circle text-amber-600 shadow-neuBtn shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">Envíos a todo CR</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Por Correos CR</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
