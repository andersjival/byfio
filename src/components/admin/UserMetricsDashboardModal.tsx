import React from 'react';
import { X, Users, Smartphone, Monitor, MapPin, Globe, BarChart3 } from 'lucide-react';
import { RegisteredClientUser, PROVINCES_CR, detectProvince } from './RegisteredClientsList';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clients: RegisteredClientUser[];
}

export const UserMetricsDashboardModal: React.FC<Props> = ({ isOpen, onClose, clients }) => {
  if (!isOpen) return null;

  const total = clients.length;

  // Conteo por provincias
  const provinceCounts: Record<string, number> = {};
  PROVINCES_CR.forEach((p) => { provinceCounts[p] = 0; });
  let sinProvincia = 0;

  clients.forEach((c) => {
    const prov = detectProvince(c.address, c.province);
    if (provinceCounts[prov] !== undefined) {
      provinceCounts[prov]++;
    } else {
      sinProvincia++;
    }
  });

  // Conteo por dispositivos
  let mobileCount = 0;
  let pcCount = 0;
  let tabletCount = 0;
  const modelsMap: Record<string, number> = {};

  clients.forEach((c) => {
    const type = c.deviceType || (c.deviceModel?.toLowerCase().includes('phone') || c.deviceModel?.toLowerCase().includes('android') ? 'mobile' : 'pc');
    if (type === 'mobile') mobileCount++;
    else if (type === 'tablet') tabletCount++;
    else pcCount++;

    const model = c.deviceModel || 'Computadora / Navegador';
    modelsMap[model] = (modelsMap[model] || 0) + 1;
  });

  const sortedModels = Object.entries(modelsMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const uniqueIps = new Set(clients.map((c) => c.ipAddress).filter((ip) => ip && ip !== 'Desconocida')).size;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn" onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-[#F1F2F6] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fio-purple to-purple-600 text-white flex items-center justify-center shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-900 leading-tight">Métricas de Usuarios</h3>
              <p className="text-[11px] text-slate-500 font-sans">Analítica demográfica por provincia, dispositivos e IPs</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 font-sans">
          {/* Tarjetas Principales de Resumen */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/70 text-center">
              <Users className="w-5 h-5 mx-auto text-fio-purple mb-1" />
              <div className="text-[11px] text-purple-900 font-bubble font-bold">Total Usuarios</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{total}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-center">
              <Smartphone className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
              <div className="text-[11px] text-emerald-900 font-bubble font-bold">Celulares</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{mobileCount} <span className="text-xs font-normal text-slate-500">({total > 0 ? Math.round((mobileCount / total) * 100) : 0}%)</span></div>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-center">
              <Monitor className="w-5 h-5 mx-auto text-blue-600 mb-1" />
              <div className="text-[11px] text-blue-900 font-bubble font-bold">Computadoras</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{pcCount} <span className="text-xs font-normal text-slate-500">({total > 0 ? Math.round((pcCount / total) * 100) : 0}%)</span></div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-center">
              <Globe className="w-5 h-5 mx-auto text-amber-600 mb-1" />
              <div className="text-[11px] text-amber-900 font-bubble font-bold">IPs Únicas</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{uniqueIps}</div>
            </div>
          </div>

          {/* Desglose por las 7 Provincias de Costa Rica */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-fio-purple" />
                <h4 className="font-bubble font-bold text-xs sm:text-sm text-slate-800">Distribución por Provincias de Costa Rica</h4>
              </div>
              <span className="text-[11px] text-slate-500 font-bubble font-bold">7 Provincias</span>
            </div>

            <div className="space-y-2">
              {PROVINCES_CR.map((prov) => {
                const count = provinceCounts[prov] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={prov} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-700">
                      <span className="font-medium">{prov}</span>
                      <span className="font-bold text-slate-900">{count} usuarios <span className="text-slate-400 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-fio-purple transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {sinProvincia > 0 && (
                <div className="space-y-1 pt-1 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
                  <span>Otras / Sin provincia</span>
                  <span className="font-bold">{sinProvincia} usuarios</span>
                </div>
              )}
            </div>
          </div>

          {/* Dispositivos y Modelos Más Frecuentes */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2.5">
            <h4 className="font-bubble font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Modelos de Dispositivos Registrados</span>
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {sortedModels.map(([model, count]) => (
                <div key={model} className="py-1.5 flex items-center justify-between">
                  <span className="text-slate-700 truncate max-w-[300px]">{model}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200/80 font-bold text-slate-700 text-[10px]">{count} reg.</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
