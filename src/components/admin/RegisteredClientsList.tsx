import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, UserCheck, Mail, Phone, MapPin, Calendar, Clock, RefreshCw, CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';

export interface RegisteredClientUser {
  id?: string;
  name?: string;
  email: string;
  phone?: string;
  idCard?: string;
  address?: string;
  province?: string;
  createdAt?: string;
  lat?: number;
  lng?: number;
}

const detectProvince = (address?: string, explicitProvince?: string): string => {
  if (explicitProvince && explicitProvince.trim()) return explicitProvince.trim();
  if (!address) return 'No especificada';
  const norm = address.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (norm.includes('san jose')) return 'San José';
  if (norm.includes('alajuela')) return 'Alajuela';
  if (norm.includes('cartago')) return 'Cartago';
  if (norm.includes('heredia')) return 'Heredia';
  if (norm.includes('guanacaste') || norm.includes('liberia')) return 'Guanacaste';
  if (norm.includes('puntarenas')) return 'Puntarenas';
  if (norm.includes('limon')) return 'Limón';
  return 'Costa Rica';
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
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => {
      const prov = detectProvince(c.address, c.province).toLowerCase();
      return (
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.idCard && c.idCard.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q)) ||
        prov.includes(q)
      );
    });
  }, [clients, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#F1F2F6] border border-white/90 shadow-neuCard">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo, teléfono, cédula o provincia..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fio-purple/40"
          />
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-fio-purple hover:border-purple-300 font-bubble font-bold text-xs shadow-xs active:scale-95 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-fio-purple' : ''}`} />
          <span>{isRefreshing ? 'Sincronizando...' : 'Actualizar'}</span>
        </button>
      </div>

      {filteredClients.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white/70 border border-slate-200 text-center space-y-2">
          <UserCheck className="w-10 h-10 mx-auto text-slate-300" />
          <h4 className="font-bubble font-bold text-sm text-slate-700">No se encontraron clientes registrados</h4>
          <p className="text-xs text-slate-400 font-sans">
            {search ? 'Ningún usuario coincide con los criterios de búsqueda.' : 'Aún no hay clientes que hayan creado cuenta en la plataforma web.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredClients.map((client, idx) => {
            const { date, time } = formatDate(client.createdAt);
            const province = detectProvince(client.address, client.province);
            const rawPhone = (client.phone || '').replace(/\D/g, '');
            const waPhone = rawPhone.length === 8 ? `506${rawPhone}` : rawPhone;
            return (
              <div key={client.email || idx} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-neuCard hover:border-purple-200 transition-all flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-fio-purple text-white flex items-center justify-center font-bubble font-bold text-sm shrink-0 shadow-2xs">
                      {(client.name || client.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bubble font-bold text-slate-900 text-sm truncate">{client.name || 'Sin nombre registrado'}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shrink-0">
                          <ShieldCheck className="w-2.5 h-2.5" /> Web
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-sans truncate">{client.email}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bubble font-bold bg-purple-50 text-fio-purple border border-purple-100 shrink-0">
                    {province}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 font-sans">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Cédula: <strong className="text-slate-800">{client.idCard || 'No indicada'}</strong></span>
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
                  <div className="flex items-center gap-1.5 col-span-1 sm:col-span-2">
                    <Calendar className="w-3.5 h-3.5 text-fio-purple shrink-0" />
                    <span>Registro: <strong>{date}</strong> {time && <span className="text-slate-500">a las {time}</span>}</span>
                  </div>
                </div>

                {(client.address || (client.lat && client.lng)) && (
                  <div className="text-[11px] text-slate-600 bg-purple-50/40 p-2.5 rounded-xl border border-purple-100 flex items-start gap-1.5 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-fio-purple shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2">{client.address || 'Ubicación registrada en mapa'}</p>
                      {client.lat && client.lng && (
                        <a
                          href={`https://www.google.com/maps?q=${client.lat},${client.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-fio-purple hover:underline font-bold mt-1"
                        >
                          <span>Ver en Google Maps</span>
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
    </div>
  );
};
