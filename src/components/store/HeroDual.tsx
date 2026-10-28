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
    <section id="hero-section" className="relative overflow-hidden pt-6 pb-14 px-4 sm:px-6 lg:px-8">
      {/* Fondo con Degradado Lila Pastel Oficial (#D4AEFA -> #E7B8F9) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-b from-[#D4AEFA]/35 via-[#E7B8F9]/20 to-transparent rounded-b-[60px] -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center">
        {/* Isotipo Oficial Flotante de Marca */}
        <div className="inline-flex flex-col items-center mb-6 group cursor-pointer">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-clayLg border-3 border-white p-1 bg-gradient-to-br from-[#D4AEFA] to-[#E7B8F9] group-hover:scale-105 transition-transform duration-300">
            <img
              src="/assets/logo-byfio.svg"
              alt="Logo Oficial by.fio"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <span className="text-[11px] font-bold text-purple-900/80 uppercase tracking-widest mt-2">
            by.fio • Marca Oficial
          </span>
        </div>

        {/* Badge Slogan Kawaii */}
        <div className="flex items-center justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-fio-200 shadow-claySm">
            <Sparkles className="w-4 h-4 text-[#FFF07C] fill-[#FFF07C]" />
            <span className="text-xs sm:text-sm font-bubble font-bold text-fio-900">
              ¡Transformá tu creatividad en tu mejor proyecto!
            </span>
            <Heart className="w-3.5 h-3.5 text-fio-pink fill-fio-pink" />
          </div>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bubble font-bold text-fio-900 tracking-tight max-w-4xl mx-auto leading-tight mb-5">
          Aprendé, creá y emprendé con{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fio-800 via-fio-600 to-fio-pink">
            by.fio
          </span>
        </h1>

        <p className="text-sm sm:text-base text-purple-950/80 max-w-2xl mx-auto mb-9 leading-relaxed font-medium">
          Talleres creativos de encuadernación, agendas y sublimación, junto a productos personalizados con amor e insumos en Costa Rica.
        </p>

        {/* Botones Duales con los Estilos de la Marca */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <button
            onClick={onScrollToWorkshops}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white font-bubble font-bold text-sm shadow-[0_10px_25px_rgba(236,72,153,0.35)] hover:scale-105 active:scale-95 transition-all"
          >
            <Calendar className="w-5 h-5 text-[#FFF07C]" />
            <span>Ver Talleres Creativos</span>
          </button>

          <button
            onClick={onScrollToProducts}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white text-fio-900 border-2 border-fio-300 font-bubble font-bold text-sm shadow-clay hover:bg-fio-50 hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-5 h-5 text-[#9BE4FF] fill-[#9BE4FF]" />
            <span>Ir a la Tienda & Insumos</span>
          </button>
        </div>

        {/* Píldoras de Calidad */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
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
