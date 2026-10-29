import React from 'react';
import { MapPin, Clock, Phone, ExternalLink, Calendar, MessageCircle, Store } from 'lucide-react';

interface StudioLocationScheduleCardProps {
  compact?: boolean;
}

export const StudioLocationScheduleCard: React.FC<StudioLocationScheduleCardProps> = ({
  compact = false,
}) => {
  const scheduleItems = [
    {
      days: 'Lunes, Martes y Viernes',
      hours: '9:00 am – 5:00 pm',
      status: 'Abierto',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      days: 'Jueves',
      hours: '10:00 am – 4:00 pm',
      status: 'Abierto',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      days: 'Sábado',
      hours: '10:00 am – 3:00 pm',
      status: 'Fin de Semana',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      days: 'Miércoles y Domingo',
      hours: 'Cerrado al Público',
      status: 'Cerrado',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    },
  ];

  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Parque+de+Tibás,+San+José,+Costa+Rica';

  return (
    <div
      className={`rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard text-slate-800 transition-all ${
        compact ? 'p-4 sm:p-5 space-y-4' : 'p-6 sm:p-8 space-y-6'
      }`}
    >
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-300/40 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#F1F2F6] shadow-neuBtn flex items-center justify-center text-amber-500">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-900 leading-tight">
              Taller Creativo &amp; Horarios de Atención
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              Visitas presenciales, talleres y retiro de pedidos
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-neuBtn self-start sm:self-auto border border-white/80">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Tibás, Costa Rica
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Columna Izquierda: Dirección Física & Mapa */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-5 h-5 text-fio-pink shrink-0" />
              <span className="font-bubble font-bold text-sm text-slate-900">
                Dirección Oficial
              </span>
            </div>

            <div className="space-y-1 pl-1">
              <p className="font-bubble font-bold text-base sm:text-lg text-slate-900 leading-snug">
                200 sur del parque de Tibás
              </p>
              <p className="text-xs text-slate-600 font-medium">
                San José, Costa Rica &bull; Ref: MAYO10 / by.fio
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                A pasos del parque central de Tibás, fácil acceso y parqueo en zona.
              </p>
            </div>
          </div>

          {/* Bloque de Contacto Directo */}
          <div className="pt-3 border-t border-slate-300/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-600" />
                Número de Atención:
              </span>
              <a
                href="https://wa.me/50664004640?text=Hola%20Fio!%20Quiero%20consultar%20sobre%20el%20horario%20y%20ubicación"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bubble font-bold text-sm text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                6400-4640
              </a>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl neu-btn text-xs font-bubble font-bold text-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
            >
              <ExternalLink className="w-3.5 h-3.5 text-fio-pink" />
              <span>Ver Ubicación en Maps</span>
            </a>
          </div>
        </div>

        {/* Columna Derecha: Horarios de Atención Detallados */}
        <div className="md:col-span-7 p-5 rounded-2xl bg-[#F1F2F6] border border-white/80 shadow-neuCard flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bubble font-bold text-slate-900">
              <Clock className="w-4 h-4 text-amber-500" />
              Horarios Semanales de Atención
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Hora local Costa Rica
            </span>
          </div>

          <div className="space-y-2 divide-y divide-slate-200/60">
            {scheduleItems.map((item, idx) => (
              <div
                key={idx}
                className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
              >
                <div>
                  <p className="font-bubble font-bold text-slate-800 text-[13px]">
                    {item.days}
                  </p>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {item.hours}
                  </p>
                </div>

                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border self-start sm:self-auto ${item.badgeClass}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>✨ Para retiros o consultas personalizadas podés escribirnos al WhatsApp.</span>
            <a
              href="https://wa.me/50664004640?text=Hola%20Fio!%20Vengo%20de%20la%20página%20web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chatear ahora</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
