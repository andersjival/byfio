import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Workshop } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { Calendar, Users, Sparkles, Check, ArrowRight } from 'lucide-react';

export const WorkshopsSection: React.FC = () => {
  const { workshops, addToCart } = useApp();
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Handle ?taller=ID deep link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tallerId = params.get('taller');
    if (tallerId) {
      setHighlightId(tallerId);
      setTimeout(() => {
        document.getElementById(`ws-card-${tallerId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
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

  return (
    <section id="workshops-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Encabezado de Sección */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-fio-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-fio-yellow fill-fio-yellow" />
            <span>Academia Creativa by.fio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bubble font-bold text-fio-900">
            Talleres Creativos & Presenciales
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-xl">
            Aprendé técnicas profesionales con materiales de primera calidad y grupos reducidos para atención personalizada.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-white px-3.5 py-2 rounded-2xl border border-fio-200 shadow-sm self-start md:self-auto">
          <Users className="w-4 h-4 text-fio-pink" />
          <span>¡Cupos súper limitados por fecha!</span>
        </div>
      </div>

      {/* Grid de 5 Talleres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((ws) => (
          <div
            key={ws.id}
            id={`ws-card-${ws.id}`}
            className={`flex flex-col bg-[#F1F2F6] rounded-3xl overflow-hidden border border-white/90 shadow-neuCard hover:shadow-neuCardHover transition-all duration-300 group ${
              highlightId === ws.id ? 'ring-2 ring-amber-400/60 scale-[1.02]' : ''
            }`}
          >
            {/* Imagen con badges */}
            <div className="relative h-48 w-full overflow-hidden bg-fio-100">
              <img
                src={ws.image}
                alt={ws.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-bold text-fio-800 shadow-sm">
                  {ws.modality}
                </span>
                <span className="px-3 py-1 rounded-full bg-fio-pink text-white text-[11px] font-bold shadow-sm">
                  {ws.spotsAvailable} cupos disponibles
                </span>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-fio-500" />
                  <span>{ws.date}</span>
                </div>

                <h3 className="font-bubble font-bold text-lg text-fio-900 group-hover:text-fio-600 transition-colors mb-1.5">
                  {ws.title}
                </h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{ws.subtitle}</p>

                {/* Lo que incluye */}
                <div className="bg-fio-50 rounded-2xl p-3 mb-4 border border-fio-100">
                  <p className="text-[11px] font-bold text-fio-800 uppercase tracking-wider mb-2">
                    Qué incluye:
                  </p>
                  <ul className="space-y-1.5">
                    {ws.includes.map((inc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-700">
                        <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="leading-tight">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Precio y Reserva */}
              <div className="pt-3 border-t border-fio-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Inversión</span>
                  <p className="text-xl font-bubble font-bold text-fio-900">
                    {formatCRC(ws.price)}
                  </p>
                </div>

                <button
                  onClick={() => handleBook(ws)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl neu-btn-primary font-bubble font-bold text-xs active:scale-95 transition-all"
                >
                  <span>Reservar Cupo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
