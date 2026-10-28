import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Workshop, AppRoute } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { TreeNavigation } from '../common/TreeNavigation';
import {
  Calendar, Users, Sparkles, Check, ArrowRight,
  GraduationCap, MapPin, Clock
} from 'lucide-react';

interface WorkshopsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const WorkshopsPage: React.FC<WorkshopsPageProps> = ({ onNavigate }) => {
  const { workshops, addToCart } = useApp();
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Check ?taller=ID in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wsId = params.get('taller');
    if (wsId) {
      setHighlightId(wsId);
      setTimeout(() => {
        document.getElementById(`ws-page-card-${wsId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      setTimeout(() => setHighlightId(null), 4000);
    }
  }, []);

  const handleBook = (workshop: Workshop) => {
    addToCart({
      type: 'workshop',
      id: workshop.id,
      sku: `WS-${workshop.id.toUpperCase()}`,
      name: workshop.title,
      price: workshop.price,
      quantity: 1,
      image: workshop.image,
      spotsLeft: workshop.spotsAvailable,
    });
  };

  const breadcrumbs = [
    { label: 'by.fio', route: 'home' as AppRoute },
    { label: 'talleres', route: 'workshops' as AppRoute },
  ];

  return (
    <div className="py-2 sm:py-4 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Encabezado Editorial Estilo SLOW / SPACE con Árbol Integrado sobre el Cuadro Difuminado */}
      <div className="relative text-center py-6 px-6 rounded-[36px] bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_12px_30px_rgba(180,160,200,0.08)] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#D4AEFA]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#9BE4FF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          {/* Árbol de Navegación Compacto Directo Dentro del Cuadro Difuminado (Cero Espacio Perdido) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/40">
            <TreeNavigation nodes={breadcrumbs} onNavigate={onNavigate} />
            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-[11px] text-slate-500 font-sans tracking-wide">
              <GraduationCap className="w-3.5 h-3.5 text-fio-500" />
              <span>{workshops.length} talleres programados</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5FF] border border-fio-200/60 text-fio-800 text-[11px] font-semibold tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-fio-yellow fill-fio-yellow" />
            <span>Academia Creativa by.fio</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-slate-800 tracking-[0.18em] uppercase font-normal">
            TALLERES / CREATIVOS
          </h1>

          <p className="font-sans text-xs sm:text-sm text-slate-500 uppercase tracking-[0.25em] font-medium max-w-lg mx-auto">
            Make room for learning • Aprendé, creá y emprendé
          </p>

          <p className="text-xs sm:text-sm text-slate-600 font-sans pt-1 leading-relaxed">
            Talleres con grupos reducidos, materiales completos incluidos y acompañamiento paso a paso para que salgas con tu proyecto terminado.
          </p>
        </div>
      </div>

      {/* Grid de Talleres — Cajitas Suaves Neumórficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {workshops.map((ws) => {
          const isHighlighted = highlightId === ws.id;
          const isFull = ws.spotsAvailable <= 0;

          return (
            <div
              key={ws.id}
              id={`ws-page-card-${ws.id}`}
              className={`flex flex-col bg-[#FDFBF9] rounded-[32px] p-5 border shadow-[10px_14px_28px_rgba(180,160,200,0.1),-8px_-8px_20px_rgba(255,255,255,0.95)] hover:shadow-[14px_18px_36px_rgba(180,160,200,0.18),-10px_-10px_24px_rgba(255,255,255,1)] transition-all duration-300 group ${
                isHighlighted
                  ? 'border-fio-pink ring-4 ring-fio-pink/20 scale-[1.02]'
                  : 'border-white/90'
              }`}
            >
              {/* Imagen */}
              <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-[#F2EDE7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-white/80">
                <img
                  src={ws.image}
                  alt={ws.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-bold text-slate-700 shadow-sm border border-white/70">
                    {ws.modality}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-fio-pink text-white text-[11px] font-bold shadow-sm">
                    {isFull ? 'Cupos agotados' : `${ws.spotsAvailable} cupos`}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="pt-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-col gap-1 text-xs text-slate-500 font-sans">
                    <span className="flex items-center gap-1.5 text-fio-700 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      {ws.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {ws.schedule}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {ws.location}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-slate-800 font-semibold leading-snug group-hover:text-fio-700 transition-colors pt-1">
                    {ws.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {ws.subtitle}
                  </p>

                  {/* Qué incluye — Cajita Suave Rehundida */}
                  <div className="p-3.5 rounded-2xl bg-[#F6F2EC] border border-white/60 shadow-[inset_1px_1px_3px_rgba(160,140,190,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      El taller incluye:
                    </p>
                    <ul className="space-y-1">
                      {ws.includes.map((inc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="leading-tight">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Precio y Reserva */}
                <div className="pt-3 border-t border-slate-200/50 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                      Inversión
                    </span>
                    <p className="font-serif text-2xl font-bold text-slate-800">
                      {formatCRC(ws.price)}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isFull}
                    onClick={() => handleBook(ws)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold shadow-[0_8px_18px_rgba(192,132,252,0.35),inset_0_1px_2px_rgba(255,255,255,0.6)] active:scale-95 transition-all ${
                      isFull
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] hover:from-[#C084FC] hover:to-[#A855F7] text-white'
                    }`}
                  >
                    <span>{isFull ? 'Agotado' : 'Reservar Cupo'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
