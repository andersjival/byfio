import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Workshop, AppRoute } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { TreeNavigation } from '../common/TreeNavigation';
import {
  Calendar, Users, Sparkles, Check, ArrowRight,
  GraduationCap, MapPin, Clock, Share2, CheckCircle2, Eye, Link2
} from 'lucide-react';

interface WorkshopsPageProps {
  onNavigate: (route: AppRoute, targetTab?: any, wsId?: string) => void;
}

export const WorkshopsPage: React.FC<WorkshopsPageProps> = ({ onNavigate }) => {
  const { workshops, addToCart, cart } = useApp();
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [copiedWsId, setCopiedWsId] = useState<string | null>(null);
  const [copiedCatalog, setCopiedCatalog] = useState(false);

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

  const copyCatalogLink = () => {
    const link = `${window.location.origin}/talleres`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedCatalog(true);
      setTimeout(() => setCopiedCatalog(false), 2000);
    });
  };

  const copyWorkshopLink = (wsId: string) => {
    const link = `${window.location.origin}/talleres/${wsId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedWsId(wsId);
      setTimeout(() => setCopiedWsId(null), 2000);
    });
  };

  return (
    <div className="py-2 sm:py-4 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Encabezado Editorial Estilo Neumorphic Soft UI con Árbol Integrado */}
      <div className="relative text-center py-6 sm:py-8 px-6 rounded-[36px] bg-[#F1F2F6] border border-white/90 shadow-neuCard overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#D4AEFA]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#9BE4FF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          {/* Árbol de Navegación Compacto Directo Dentro del Cuadro Neumórfico */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60">
            <TreeNavigation nodes={breadcrumbs} onNavigate={onNavigate} />
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-[11px] text-slate-500 font-sans tracking-wide">
              <button
                type="button"
                onClick={copyCatalogLink}
                className={`neu-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bubble font-bold text-xs border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover transition-all ${
                  copiedCatalog
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-[#F1F2F6] text-slate-700 hover:text-slate-900'
                }`}
              >
                {copiedCatalog ? (
                  <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ¡Link copiado!</>
                ) : (
                  <><Link2 className="w-3.5 h-3.5 text-fio-pink" /> Copiar Link de Todos los Talleres</>
                )}
              </button>

              <div className="flex items-center gap-1.5 text-slate-500 bg-[#ECEEF2] px-2.5 py-1 rounded-xl shadow-neuInset border border-white/60">
                <GraduationCap className="w-3.5 h-3.5 text-fio-500" />
                <span>{workshops.length} talleres</span>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-white/90 text-fio-800 text-[11px] font-bubble font-bold tracking-widest uppercase shadow-neuBtn">
            <Sparkles className="w-3.5 h-3.5 text-fio-yellow fill-fio-yellow" />
            <span>Academia Creativa by.fio</span>
          </div>

          <h1 className="font-bubble text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight font-bold">
            TALLERES CREATIVOS
          </h1>

          <p className="font-sans text-xs sm:text-sm text-slate-500 uppercase tracking-[0.25em] font-medium max-w-lg mx-auto">
            Make room for learning • Aprendé, creá y emprendé
          </p>

          <p className="text-xs sm:text-sm text-slate-600 font-sans pt-1 leading-relaxed">
            Talleres con grupos reducidos, materiales completos incluidos y acompañamiento paso a paso para que salgas con tu proyecto terminado.
          </p>
        </div>
      </div>

      {/* Banner Ilustrado Oficial: Taller Creativo */}
      <div className="rounded-[32px] overflow-hidden shadow-neuCard border border-white/90 bg-[#FAF5FF] group">
        <img
          src="/assets/imagen-tienda-creativa.jpeg"
          alt="Taller Creativo by.fio"
          className="w-full h-44 sm:h-64 md:h-80 object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/taller-creativo.jpeg';
          }}
        />
      </div>

      {/* Grid de Talleres — Cajas Neumórficas Táctiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {workshops.map((ws) => {
          const isHighlighted = highlightId === ws.id;
          const isFull = ws.spotsAvailable <= 0;

          return (
            <div
              key={ws.id}
              id={`ws-page-card-${ws.id}`}
              className={`flex flex-col bg-[#F1F2F6] rounded-[32px] p-5 border border-white/90 shadow-neuCard hover:shadow-neuCardHover transition-all duration-300 group ${
                isHighlighted
                  ? 'ring-4 ring-fio-pink/30 scale-[1.02]'
                  : ''
              }`}
            >
              {/* Imagen (Clicable a la página del taller) */}
              <div
                onClick={() => onNavigate('workshop-detail', undefined, ws.id)}
                className="relative h-52 w-full rounded-2xl overflow-hidden bg-[#ECEEF2] shadow-neuInset border border-white/80 cursor-pointer"
              >
                <img
                  src={ws.image}
                  alt={ws.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-bold text-slate-700 shadow-neuBtn border border-white/70">
                    {ws.modality}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-fio-pink text-white text-[11px] font-bold shadow-neuBtn">
                    {isFull ? 'Cupos agotados' : `${ws.spotsAvailable} cupos`}
                  </span>
                </div>
                {cart.some((it) => it.id === ws.id) && (
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bubble font-bold shadow-md border-0 flex items-center gap-1.5 z-10 animate-fadeIn">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Taller Agregado</span>
                  </span>
                )}
              </div>

              {/* Contenido */}
              <div className="pt-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-col gap-1 text-xs text-slate-500 font-sans">
                    <span className="flex items-center gap-1.5 text-fio-800 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-fio-600" />
                      {ws.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5" />
                      {ws.schedule}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5" />
                      {ws.location}
                    </span>
                  </div>

                  <h3
                    onClick={() => onNavigate('workshop-detail', undefined, ws.id)}
                    className="font-bubble text-xl text-slate-900 font-bold leading-snug group-hover:text-fio-800 transition-colors pt-1 cursor-pointer"
                  >
                    {ws.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {ws.subtitle}
                  </p>

                  {/* Qué incluye — Cajita Neumórfica Rehundida */}
                  <div className="p-4 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      El taller incluye:
                    </p>
                    <ul className="space-y-1.5">
                      {ws.includes.map((inc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="leading-tight">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Precio y Acciones */}
                <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Inversión
                    </span>
                    <p className="font-bubble text-2xl font-bold text-slate-900">
                      {formatCRC(ws.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Copiar link directo a este taller"
                      onClick={() => copyWorkshopLink(ws.id)}
                      className="w-10 h-10 neu-btn-circle shadow-neuBtn text-slate-600 hover:text-fio-800 transition-all"
                    >
                      {copiedWsId === ws.id ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4 text-fio-pink" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigate('workshop-detail', undefined, ws.id)}
                      className="neu-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bubble font-bold text-white shadow-neuBtn hover:shadow-neuBtnHover active:scale-95 transition-all"
                    >
                      <span>Inscribirme</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
