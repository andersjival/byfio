import React, { useState } from 'react';
import { UberDeliveryState } from '../types';
import {
  Truck, CheckCircle2, Phone, Star, ShieldCheck, Play, Pause,
  SkipForward, XCircle, Code, RotateCcw, ExternalLink
} from 'lucide-react';

interface UberDirectLiveMonitorProps {
  delivery: UberDeliveryState;
  isAutoPlaying: boolean;
  onAdvanceStep: () => void;
  onToggleAutoPlay: () => void;
  onCancelDelivery: () => void;
  onResetFlow: () => void;
}

export const UberDirectLiveMonitor: React.FC<UberDirectLiveMonitorProps> = ({
  delivery,
  isAutoPlaying,
  onAdvanceStep,
  onToggleAutoPlay,
  onCancelDelivery,
  onResetFlow,
}) => {
  const [showJson, setShowJson] = useState(false);
  const isFinished = delivery.step === 'delivered' || delivery.step === 'cancelled';

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
      {/* Encabezado del Despacho Uber */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
              ID: {delivery.deliveryId}
            </span>
            <span className="text-xs text-purple-300 font-mono">Orden: {delivery.orderId}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bubble font-bold text-white mt-1">
            Monitor de Despacho Uber Direct en Vivo
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!isFinished && (
            <>
              <button
                type="button"
                onClick={onToggleAutoPlay}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isAutoPlaying ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-600 text-white'
                }`}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoPlaying ? 'Pausar Avance' : 'Auto-Avance (4s)'}</span>
              </button>
              <button
                type="button"
                onClick={onAdvanceStep}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Paso Siguiente</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setShowJson(!showJson)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Code className="w-3.5 h-3.5 text-fio-yellow" />
            <span>{showJson ? 'Ocultar JSON' : 'Ver JSON API'}</span>
          </button>
          <button
            type="button"
            onClick={onResetFlow}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Nueva Prueba</span>
          </button>
        </div>
      </div>

      {/* Tarjeta del Repartidor si está asignado */}
      {delivery.driver && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-purple-950/60 border border-emerald-500/40 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <img src={delivery.driver.photoUrl} alt={delivery.driver.name} className="w-12 h-12 rounded-xl object-cover border border-emerald-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bubble font-bold text-sm text-white">{delivery.driver.name}</span>
                <span className="flex items-center text-[10px] text-amber-300 bg-amber-400/20 px-1.5 py-0.2 rounded-full font-bold">
                  <Star className="w-3 h-3 fill-amber-300 mr-0.5" /> {delivery.driver.rating}
                </span>
              </div>
              <p className="text-xs text-purple-200">
                {delivery.driver.vehicleType} • <span className="font-mono text-emerald-300 font-bold">{delivery.driver.licensePlate}</span>
              </p>
            </div>
          </div>
          <a
            href={`tel:${delivery.driver.phone}`}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Llamar Repartidor</span>
          </a>
        </div>
      )}

      {/* Línea de Tiempo del Procesamiento en Pantalla */}
      <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
        <h3 className="font-bubble font-bold text-xs text-purple-300 uppercase tracking-wider">
          Registro de Eventos en Tiempo Real (Uber Direct Webhook / Polling)
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {delivery.timeline.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 p-2 rounded-xl bg-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-bubble">{item.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                </div>
                {item.description && <p className="text-[11px] text-purple-200/80 mt-0.5">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspección de Payload JSON */}
      {showJson && (
        <div className="p-3 bg-black/80 rounded-2xl border border-purple-500/40 text-[11px] font-mono text-emerald-400 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[10px]">
            <span>POST /v1/customers/{`{customer_id}`}/deliveries</span>
            <span>API Specification Uber Direct</span>
          </div>
          <pre className="overflow-x-auto max-h-48 text-purple-200 p-2 bg-slate-950 rounded-xl">
            {JSON.stringify({ request: delivery.rawRequestPayload, response: delivery.rawResponsePayload }, null, 2)}
          </pre>
        </div>
      )}

      {!isFinished && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancelDelivery}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelar Entrega Uber</span>
          </button>
        </div>
      )}
    </div>
  );
};
