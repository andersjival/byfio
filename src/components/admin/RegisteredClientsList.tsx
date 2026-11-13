import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search, UserCheck, Phone, MapPin, Calendar, RefreshCw, CreditCard,
  ExternalLink, ShieldCheck, BarChart3, Smartphone, Monitor, Globe, Filter, Copy, Check
} from 'lucide-react';
import { UserMetricsDashboardModal } from './UserMetricsDashboardModal';

export interface RegisteredClientUser {
  id?: string;
  name?: string;
  email: string;
  phone?: string;
  idCard?: string;
  address?: string;
  province?: string;
  createdAt?: string;
  ipAddress?: string;
  deviceType?: 'pc' | 'mobile' | 'tablet';
  deviceModel?: string;
  lat?: number;
  lng?: number;
}

export const PROVINCES_CR = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón',
] as const;

export const detectProvince = (address?: string, explicitProvince?: string): string => {
  if (explicitProvince && explicitProvince.trim()) {
    const ep = explicitProvince.trim();
    const match = PROVINCES_CR.find((p) => p.toLowerCase() === ep.toLowerCase());
    if (match) return match;
  }
  if (!address) return 'No especificada';
  const norm = address.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (norm.includes('san jose')) return 'San José';
  if (norm.includes('alajuela')) return 'Alajuela';
  if (norm.includes('cartago')) return 'Cartago';
  if (norm.includes('heredia')) return 'Heredia';
  if (norm.includes('guanacaste') || norm.includes('liberia') || norm.includes('nicoya')) return 'Guanacaste';
  if (norm.includes('puntarenas') || norm.includes('jac') || norm.includes('quepos')) return 'Puntarenas';
  if (norm.includes('limon') || norm.includes('guapiles') || norm.includes('pococi')) return 'Limón';
  return 'No especificada';
};

const formatDate = (iso?: string) => {
  if (!iso) return { date: 'No registrada', time: '' };
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return { date: 'No registrada', time: '' };
    return {
      date: d.toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: d.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  } catch {
    return { date: 'No registrada', time: '' };
  }
};

export const RegisteredClientsList: React.FC = () => {
  const { syncRegisteredUsers } = useApp();
  const [clients, setClients] = useState<RegisteredClientUser[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [copiedWazeClientId, setCopiedWazeClientId] = useState<string | null>(null);

  const getWazeUrlForClient = (client: RegisteredClientUser) => {
    if (typeof client.lat === 'number' && typeof client.lng === 'number' && !isNaN(client.lat) && !isNaN(client.lng) && (client.lat !== 0 || client.lng !== 0)) {
      return `https://waze.com/ul?ll=${client.lat},${client.lng}&navigate=yes`;
    }
    if (!client.address || !client.address.trim()) return '';
    const cleanAddr = client.address.trim();
    const query = cleanAddr.toLowerCase().includes('costa rica') || cleanAddr.toLowerCase().includes('cr')
      ? cleanAddr
      : `${cleanAddr}, Costa Rica`;
    return `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
  };

  const handleCopyClientWaze = (client: RegisteredClientUser) => {
    const url = getWazeUrlForClient(client);
    if (!url) return;
    navigator.clipboard.writeText(url);
    const key = client.id || client.email;
    setCopiedWazeClientId(key);
    setTimeout(() => {
      setCopiedWazeClientId((current) => (current === key ? null : current));
    }, 2000);
  };

  const loadFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem('byfio_registered_users_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setClients(parsed);
      }
    } catch {}
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (syncRegisteredUsers) await syncRegisteredUsers();
      const res = await fetch('/api/registered-users', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.users)) {
          setClients(data.users);
          localStorage.setItem('byfio_registered_users_v1', JSON.stringify(data.users));
        }
      } else {
        loadFromStorage();
      }
    } catch {
      loadFromStorage();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadFromStorage();
    handleRefresh();
  }, []);

  // Conteo por cada provincia
  const provinceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PROVINCES_CR.forEach((p) => { counts[p] = 0; });
    clients.forEach((c) => {
      const prov = detectProvince(c.address, c.province);
      if (counts[prov] !== undefined) counts[prov]++;
    });
    return counts;
  }, [clients]);

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      const prov = detectProvince(c.address, c.province);
      if (selectedProvince !== 'all' && prov !== selectedProvince) return false;
      if (!q) return true;
      return (
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.idCard && c.idCard.toLowerCase().includes(q)) ||
        (c.ipAddress && c.ipAddress.toLowerCase().includes(q)) ||
        (c.deviceModel && c.deviceModel.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q)) ||
        prov.toLowerCase().includes(q)
      );
    });
  }, [clients, search, selectedProvince]);

  return (
    <div className="space-y-4">
      {/* Barra de Acciones y Estadísticas Rápidas */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#F1F2F6] border border-white/90 shadow-neuCard">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-purple-100 text-fio-purple font-bubble font-bold text-xs shadow-2xs">
            Total de usuarios: <strong>{clients.length}</strong>
          </div>
          <button
            type="button"
            onClick={() => setIsMetricsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn-primary text-white font-bubble font-bold text-xs shadow-xs active:scale-95 transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Métricas de usuarios</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, correo, IP o modelo..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fio-purple/40"
            />
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-fio-purple shadow-xs active:scale-95 transition-all shrink-0"
            title="Sincronizar usuarios"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-fio-purple' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filtro por las 7 Provincias de Costa Rica */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bubble font-bold px-1">
          <Filter className="w-3.5 h-3.5 text-fio-purple" />
          <span>Filtrar por Provincias de Costa Rica:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedProvince('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold shrink-0 transition-all ${
              selectedProvince === 'all'
                ? 'bg-fio-purple text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
            }`}
          >
            Todas ({clients.length})
          </button>
          {PROVINCES_CR.map((prov) => {
            const count = provinceCounts[prov] || 0;
            const isSelected = selectedProvince === prov;
            return (
              <button
                key={prov}
                type="button"
                onClick={() => setSelectedProvince(prov)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-fio-purple text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
                }`}
              >
                <span>{prov}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Listado de Clientes */}
      {filteredClients.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white/70 border border-slate-200 text-center space-y-2">
          <UserCheck className="w-8 h-8 mx-auto text-slate-300" />
          <h4 className="font-bubble font-bold text-sm text-slate-700">No se encontraron clientes</h4>
          <p className="text-xs text-slate-400 font-sans">
            {search || selectedProvince !== 'all' ? 'Ningún usuario coincide con los filtros aplicados.' : 'No hay usuarios registrados.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredClients.map((client, idx) => {
            const { date, time } = formatDate(client.createdAt);
            const province = detectProvince(client.address, client.province);
            const rawPhone = (client.phone || '').replace(/\D/g, '');
            const waPhone = rawPhone.length === 8 ? `506${rawPhone}` : rawPhone;
            const isMobile = client.deviceType === 'mobile' || (client.deviceModel?.toLowerCase().includes('iphone') || client.deviceModel?.toLowerCase().includes('android'));

            return (
              <div key={client.email || idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-neuCard hover:border-purple-200 transition-all flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-fio-purple text-white flex items-center justify-center font-bubble font-bold text-sm shrink-0 shadow-2xs">
                      {(client.name || client.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bubble font-bold text-slate-900 text-sm truncate">{client.name || 'Sin nombre'}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shrink-0">
                          <ShieldCheck className="w-2.5 h-2.5" /> Web
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-sans truncate">{client.email}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-xl text-[10px] font-bubble font-bold bg-purple-50 text-fio-purple border border-purple-100 shrink-0">
                    {province}
                  </span>
                </div>

                {/* Detalles de Cédula, Teléfono, Dispositivo e IP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-sans">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Cédula: <strong className="text-slate-800">{client.idCard || 'N/A'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {client.phone ? (
                      <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-bold truncate">
                        {client.phone}
                      </a>
                    ) : (
                      <span className="text-slate-400">Sin teléfono</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isMobile ? <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Monitor className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    <span className="truncate">Disp: <strong className="text-slate-800">{client.deviceModel || (isMobile ? 'Celular' : 'Computadora')}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">IP: <strong className="text-slate-800 font-mono text-[10px]">{client.ipAddress || 'Registrada en D1'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-1 sm:col-span-2 text-slate-500 pt-0.5 border-t border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-fio-purple shrink-0" />
                    <span>Registro: <strong>{date}</strong> {time && <span>a las {time}</span>}</span>
                  </div>
                </div>

                {/* Dirección y Ubicación Maps & Waze */}
                {(client.address || (client.lat && client.lng)) && (
                  <div className="text-[11px] text-slate-600 bg-purple-50/40 p-2.5 rounded-xl border border-purple-100 space-y-1.5 font-sans">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-fio-purple shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2">{client.address || 'Ubicación en mapa'}</p>
                      </div>
                    </div>

                    {/* Botones de Navegación: Waze + Copiar Link + Google Maps */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-purple-100/60 pl-5">
                      <a
                        href={getWazeUrlForClient(client)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#33CCFF] hover:bg-[#1EBEF5] text-slate-950 font-bubble font-bold text-[11px] shadow-2xs active:scale-95 transition-all cursor-pointer"
                        title="Abrir ubicación en Waze directamente en el navegador"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.34 10.04C18.67 6.59 15.64 4 12 4c-4.41 0-8 3.59-8 8 0 1.25.29 2.43.8 3.49L3.5 19.5l4.31-1.15c1.23.64 2.64 1.01 4.19 1.01 4.41 0 8-3.59 8-8 0-.45-.04-.89-.11-1.32h-.55zM9 13a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
                        </svg>
                        <span>Waze</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopyClientWaze(client)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bubble font-bold border transition-all active:scale-95 cursor-pointer shadow-2xs ${
                          copiedWazeClientId === (client.id || client.email)
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                        title="Copiar link de Waze para enviárselo a un mensajero"
                      >
                        {copiedWazeClientId === (client.id || client.email) ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Copiar link</span>
                          </>
                        )}
                      </button>

                      {client.lat && client.lng && (
                        <a
                          href={`https://www.google.com/maps?q=${client.lat},${client.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-fio-purple hover:underline font-bold ml-auto"
                        >
                          <span>Google Maps</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dashboard Métricas de Usuarios */}
      <UserMetricsDashboardModal
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
        clients={clients}
      />
    </div>
  );
};
