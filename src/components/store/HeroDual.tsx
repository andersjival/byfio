import React from 'react';
import { Sparkles, ShoppingBag, Calendar, Heart, Star, CheckCircle2 } from 'lucide-react';

interface HeroDualProps {
  onScrollToWorkshops: () => void;
  onScrollToProducts: () => void;
}

export const HeroDual: React.FC<HeroDualProps> = ({
  onScrollToWorkshops,
  onScrollToProducts,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 px-4 sm:px-6 lg:px-8">
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-fio-200/40 via-purple-100/50 to-pink-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center">
        {/* Badge Slogan Kawaii */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-fio-200 shadow-claySm mb-6 animate-pulse-subtle">
          <Sparkles className="w-4 h-4 text-fio-yellow fill-fio-yellow" />
          <span className="text-xs sm:text-sm font-semibold text-fio-800">
            ¡Transformá tu creatividad en tu mejor proyecto!
          </span>
          <Heart className="w-3.5 h-3.5 text-fio-pink fill-fio-pink" />
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bubble font-bold text-fio-900 tracking-tight max-w-4xl mx-auto leading-tight mb-6">
          Aprendé, creá y emprendé con{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fio-600 via-fio-500 to-fio-pink">
            by.fio
          </span>
        </h1>

        <p className="text-base sm:text-lg text-purple-900/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Descubrí nuestros talleres creativos de papelería, encuadernación y sublimación, o encontrá agendas únicas e insumos de alta calidad en Costa Rica.
        </p>

        {/* Hero Section Dual: Botones de los 2 Motores */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <button
            onClick={onScrollToWorkshops}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-fio-800 text-white font-bubble font-semibold text-base shadow-clayBtn hover:bg-fio-900 active:scale-95 transition-all"
          >
            <Calendar className="w-5 h-5 text-fio-yellow" />
            <span>Ver Talleres Creativos</span>
          </button>

          <button
            onClick={onScrollToProducts}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white text-fio-800 border-2 border-fio-300 font-bubble font-semibold text-base shadow-clay hover:bg-fio-50 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-5 h-5 text-fio-pink" />
            <span>Ir a la Tienda & Insumos</span>
          </button>
        </div>

        {/* Píldoras de Confianza y Calidad */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-3 border border-fio-200/80 shadow-claySm flex items-center gap-2.5 text-left">
            <span className="p-2 rounded-xl bg-purple-100 text-fio-700">
              <Star className="w-4 h-4 fill-fio-yellow text-fio-yellow" />
            </span>
            <div>
              <p className="text-xs font-bold text-gray-800">+1,500 Alumnas</p>
              <p className="text-[11px] text-gray-500">Talleres con amor</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-3 border border-fio-200/80 shadow-claySm flex items-center gap-2.5 text-left">
            <span className="p-2 rounded-xl bg-pink-100 text-fio-pink">
              <Heart className="w-4 h-4 fill-fio-pink text-fio-pink" />
            </span>
            <div>
              <p className="text-xs font-bold text-gray-800">100% Personalizado</p>
              <p className="text-[11px] text-gray-500">Con tu nombre o idea</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-3 border border-fio-200/80 shadow-claySm flex items-center gap-2.5 text-left">
            <span className="p-2 rounded-xl bg-sky-100 text-fio-blue">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-gray-800">Pago SINPE Móvil</p>
              <p className="text-[11px] text-gray-500">Rápido al 6400-4640</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl p-3 border border-fio-200/80 shadow-claySm flex items-center gap-2.5 text-left">
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
