import React from 'react';
import { AppRoute } from '../../types';
import { TreeNavigation } from '../common/TreeNavigation';
import { AnimatedByfioLetters } from '../common/AnimatedByfioLetters';
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
      className="relative overflow-hidden min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8"
    >
      {/* Fondo con Degradado Lila Pastel Oficial de Pantalla Completa (#D4AEFA -> #E7B8F9) */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#D4AEFA]/35 via-[#E7B8F9]/18 to-transparent rounded-b-[60px] -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center w-full my-auto space-y-4 sm:space-y-6">
        {/* Árbol de Navegación Compacto Directo sobre el Difuminado */}
        {onNavigate && (
          <div className="flex justify-center mb-2">
            <TreeNavigation
              nodes={[
                { label: 'by.fio', route: 'home' as AppRoute },
                { label: 'inicio' },
              ]}
              onNavigate={onNavigate}
            />
          </div>
        )}

        {/* Badge Slogan Kawaii */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-fio-200/60 shadow-claySm">
            <Sparkles className="w-4 h-4 text-[#FFF07C] fill-[#FFF07C]" />
            <span className="text-xs sm:text-sm font-bubble font-bold text-fio-900">
              ¡Transformá tu creatividad en tu mejor proyecto!
            </span>
            <Heart className="w-3.5 h-3.5 text-fio-pink fill-fio-pink" />
          </div>
        </div>

        {/* Título Principal con Letras "BYFIO" Animadas en el Centro */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bubble font-bold text-fio-900 tracking-tight max-w-4xl mx-auto leading-tight">
          <span className="block text-slate-800">Aprendé, creá y emprendé con</span>
          <span className="block mt-2 sm:mt-3">
            <AnimatedByfioLetters size="hero" />
          </span>
        </h1>

        <p className="text-sm sm:text-base text-purple-950/80 max-w-2xl mx-auto leading-relaxed font-medium">
          Talleres creativos de encuadernación, agendas y sublimación, junto a productos personalizados con amor e insumos en Costa Rica.
        </p>

        {/* Botones Duales con los Estilos de la Marca */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-2 pb-2">
          <button
            type="button"
            onClick={onScrollToWorkshops}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white font-bubble font-bold text-sm shadow-[0_10px_25px_rgba(236,72,153,0.35)] hover:scale-105 active:scale-95 transition-all"
          >
            <Calendar className="w-5 h-5 text-[#FFF07C]" />
            <span>Ver Talleres Creativos</span>
          </button>

          <button
            type="button"
            onClick={onScrollToProducts}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white text-fio-900 border-2 border-fio-300 font-bubble font-bold text-sm shadow-clay hover:bg-fio-50 hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-5 h-5 text-[#9BE4FF] fill-[#9BE4FF]" />
            <span>Ir a la Tienda &amp; Insumos</span>
          </button>
        </div>

        {/* Píldoras de Calidad */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2">
          <div className="bg-white/85 backdrop-blur rounded-2xl p-3 border border-fio-200 shadow-claySm flex items-center gap-2.5 text-left">
            <span className="p-2 rounded-xl bg-purple-100 text-fio-800">
              <Star className="w-4 h-4 fill-[#FFF07C] text-amber-500" />
            </span>
            <div>
              <p className="text-xs font-bold text-gray-800">+1,500 Alumnas</p>
              <p className="text-[11px] text-gray-500">Talleres con amor</p>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur rounded-2xl p-3 border border-fio-200 shadow-claySm flex items-center gap-2.5 text-left">
            <span className="p-2 rounded-xl bg-pink-100 text-fio-pink">
              <Heart className="w-4 h-4 fill-fio-pink text-fio-pink" />
            </span>
            <div>
              <p className="text-xs font-bold text-gray-800">100% Personalizado</p>
              <p className="text-[11px] text-gray-500">Con tu nombre o idea</p>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur rounded-2xl p-3 border border-fio-200 shadow-claySm flex items-center gap-2.5 text-left">
            <span className="p-2 rounded-xl bg-sky-100 text-[#38BDF8]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-gray-800">Pago SINPE Móvil</p>
              <p className="text-[11px] text-gray-500">Rápido al 6400-4640</p>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur rounded-2xl p-3 border border-fio-200 shadow-claySm flex items-center gap-2.5 text-left">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-600">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-gray-800">Envíos a todo CR</p>
              <p className="text-[11px] text-gray-500">Correos de Costa Rica</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
