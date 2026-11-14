import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search, UserCheck, Phone, MapPin, Calendar, RefreshCw, CreditCard,
  ExternalLink, ShieldCheck, BarChart3, Smartphone, Monitor, Globe, Filter, Copy, Check, User,
  Sparkles, TrendingUp, Users
} from 'lucide-react';
import { UserMetricsDashboardModal } from './UserMetricsDashboardModal';

export interface RegisteredClientUser {
  id?: string;
  name?: string;
  username?: string;
  clientSlug?: string;
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

export type RegistrationPeriodFilter = 'all' | 'day' | 'week' | 'month';

export const parseClientDate = (iso?: string): Date | null => {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
};

export const isClientRegisteredToday = (d: Date, now: Date = new Date()): boolean => {
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

export const isClientRegisteredThisWeek = (d: Date, now: Date = new Date()): boolean => {
  // Inicio de la semana actual (Lunes a las 00:00:00)
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay(); // 0 Dom, 1 Lun...
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  // O últimos 7 días corridos (168h)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return d >= startOfWeek || d >= sevenDaysAgo;
};

export const isClientRegisteredThisMonth = (d: Date, now: Date = new Date()): boolean => {
  // Mismo mes calendario actual
  const isSameMonth = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  // O últimos 30 días corridos
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return isSameMonth || d >= thirtyDaysAgo;
};

export const RegisteredClientsList: React.FC = () => {
  const { syncRegisteredUsers } = useApp();
  const [clients, setClients] = useState<RegisteredClientUser[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<RegistrationPeriodFilter>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [copiedWazeClientId, setCopiedWazeClientId] = useState<string | null>(null);

  // Estado de pestañas dentro de las fichas: 'info' (Info de usuario) vs 'device' (Dispositivo & Red)
  const [cardTabs, setCardTabs] = useState<{ [clientKey: string]: 'info' | 'device' }>({});
  const [globalTabMode, setGlobalTabMode] = useState<'info' | 'device'>('info');

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

  const setAllCardsTab = (tab: 'info' | 'device') => {
    setGlobalTabMode(tab);
    const updated: { [k: string]: 'info' | 'device' } = {};
    clients.forEach((c) => {
      updated[c.id || c.email] = tab;
    });
    setCardTabs(updated);
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

  // Reporte de nuevos registros: día, semana, mes y total histórico
  const registrationReport = useMemo(() => {
    const now = new Date();
    let dayCount = 0;
    let weekCount = 0;
    let monthCount = 0;

    clients.forEach((c) => {
      const d = parseClientDate(c.createdAt);
      if (!d) return;
      if (isClientRegisteredToday(d, now)) dayCount++;
      if (isClientRegisteredThisWeek(d, now)) weekCount++;
      if (isClientRegisteredThisMonth(d, now)) monthCount++;
    });

    return {
      day: dayCount,
      week: weekCount,
      month: monthCount,
      total: clients.length,
    };
  }, [clients]);

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = new Date();

    return clients.filter((c) => {
      // 1. Filtro por período de registro (día, semana, mes)
      if (selectedPeriod !== 'all') {
        const d = parseClientDate(c.createdAt);
        if (!d) return false;
        if (selectedPeriod === 'day' && !isClientRegisteredToday(d, now)) return false;
        if (selectedPeriod === 'week' && !isClientRegisteredThisWeek(d, now)) return false;
        if (selectedPeriod === 'month' && !isClientRegisteredThisMonth(d, now)) return false;
      }

      // 2. Filtro por provincia
      const prov = detectProvince(c.address, c.province);
      if (selectedProvince !== 'all' && prov !== selectedProvince) return false;

      // 3. Búsqueda por texto
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
  }, [clients, search, selectedProvince, selectedPeriod]);

  return (
    <div className="space-y-4">
      {/* Panel de Botones con Reporte de Nuevos Registros */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1C1829] border border-purple-200/80 dark:border-purple-800/60 shadow-neuCard space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fio-purple to-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                Reporte de Usuarios Nuevos Registrados
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                Toca cualquiera de los botones para ver el desglose y filtrar usuarios
              </p>
            </div>
          </div>

          {selectedPeriod !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedPeriod('all')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-fio-purple dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-bubble font-bold hover:bg-purple-100 transition-all cursor-pointer self-start sm:self-auto"
            >
              <span>Mostrar todos ({registrationReport.total})</span>
            </button>
          )}
        </div>

        {/* Los 4 Botones del Reporte */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* 1. Botón En el Día */}
          <button
            type="button"
            onClick={() => setSelectedPeriod(selectedPeriod === 'day' ? 'all' : 'day')}
            className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2.5 sm:gap-3 ${
              selectedPeriod === 'day'
                ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-400/50 shadow-md'
                : 'bg-emerald-50/70 hover:bg-emerald-100/70 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/50 text-slate-800 dark:text-slate-200 shadow-2xs'
            }`}
            title="Ver usuarios registrados hoy"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              selectedPeriod === 'day'
                ? 'bg-white/20 text-white'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                selectedPeriod === 'day' ? 'text-emerald-100' : 'text-emerald-700 dark:text-emerald-400'
              }`}>
                En el Día
              </span>
              <div className="font-bubble font-black text-lg sm:text-xl leading-tight truncate">
                {registrationReport.day} <span className="text-[11px] font-bold opacity-80 font-sans">nuevos</span>
              </div>
            </div>
          </button>

          {/* 2. Botón En la Semana */}
          <button
            type="button"
            onClick={() => setSelectedPeriod(selectedPeriod === 'week' ? 'all' : 'week')}
            className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2.5 sm:gap-3 ${
              selectedPeriod === 'week'
                ? 'bg-fio-purple text-white border-purple-500 ring-2 ring-purple-400/50 shadow-md'
                : 'bg-purple-50/70 hover:bg-purple-100/70 dark:bg-purple-950/30 dark:hover:bg-purple-950/50 border-purple-200 dark:border-purple-800/50 text-slate-800 dark:text-slate-200 shadow-2xs'
            }`}
            title="Ver usuarios registrados en la semana"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              selectedPeriod === 'week'
                ? 'bg-white/20 text-white'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
            }`}>
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                selectedPeriod === 'week' ? 'text-purple-100' : 'text-purple-700 dark:text-purple-400'
              }`}>
                En la Semana
              </span>
              <div className="font-bubble font-black text-lg sm:text-xl leading-tight truncate">
                {registrationReport.week} <span className="text-[11px] font-bold opacity-80 font-sans">nuevos</span>
              </div>
            </div>
          </button>

          {/* 3. Botón En el Mes */}
          <button
            type="button"
            onClick={() => setSelectedPeriod(selectedPeriod === 'month' ? 'all' : 'month')}
            className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2.5 sm:gap-3 ${
              selectedPeriod === 'month'
                ? 'bg-pink-600 text-white border-pink-500 ring-2 ring-pink-400/50 shadow-md'
                : 'bg-pink-50/70 hover:bg-pink-100/70 dark:bg-pink-950/30 dark:hover:bg-pink-950/50 border-pink-200 dark:border-pink-800/50 text-slate-800 dark:text-slate-200 shadow-2xs'
            }`}
            title="Ver usuarios registrados en el mes"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              selectedPeriod === 'month'
                ? 'bg-white/20 text-white'
                : 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300'
            }`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                selectedPeriod === 'month' ? 'text-pink-100' : 'text-pink-700 dark:text-pink-400'
              }`}>
                En el Mes
              </span>
              <div className="font-bubble font-black text-lg sm:text-xl leading-tight truncate">
                {registrationReport.month} <span className="text-[11px] font-bold opacity-80 font-sans">nuevos</span>
              </div>
            </div>
          </button>

          {/* 4. Botón Histórico Total */}
          <button
            type="button"
            onClick={() => setSelectedPeriod('all')}
            className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2.5 sm:gap-3 ${
              selectedPeriod === 'all'
                ? 'bg-slate-800 dark:bg-[#2C2746] text-white border-slate-700 dark:border-purple-500/50 ring-2 ring-purple-400/40 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-2xs'
            }`}
            title="Ver todos los usuarios registrados"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              selectedPeriod === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
            }`}>
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                selectedPeriod === 'all' ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'
              }`}>
                Histórico Total
              </span>
              <div className="font-bubble font-black text-lg sm:text-xl leading-tight truncate">
                {registrationReport.total} <span className="text-[11px] font-bold opacity-80 font-sans">usuarios</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Barra de Acciones y Estadísticas Rápidas */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-[#F1F2F6] dark:bg-[#1E1A30] border border-white/90 dark:border-white/10 shadow-neuCard">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-fio-purple dark:text-purple-300 font-bubble font-bold text-xs shadow-2xs">
            Mostrando: <strong>{filteredClients.length}</strong> de {clients.length}
          </div>
          <button
            type="button"
            onClick={() => setIsMetricsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn-primary text-white font-bubble font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Métricas demográficas</span>
          </button>

          {/* Selector Global de Modo de Fichas */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/80 dark:bg-[#25203D] border border-slate-200 dark:border-white/10 text-xs">
            <span className="text-[10px] text-slate-400 font-bold px-1 hidden sm:inline">Vista fichas:</span>
            <button
              type="button"
              onClick={() => setAllCardsTab('info')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bubble font-bold transition-all cursor-pointer ${
                globalTabMode === 'info'
                  ? 'bg-fio-purple text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Info de usuario
            </button>
            <button
              type="button"
              onClick={() => setAllCardsTab('device')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bubble font-bold transition-all cursor-pointer ${
                globalTabMode === 'device'
                  ? 'bg-fio-purple text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Dispositivo &amp; Red
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, correo, IP o modelo..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#151122] border border-slate-200 dark:border-white/15 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fio-purple/40"
            />
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white dark:bg-[#25203D] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-fio-purple shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Sincronizar usuarios"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-fio-purple' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filtro por las 7 Provincias de Costa Rica */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-bubble font-bold px-1">
          <Filter className="w-3.5 h-3.5 text-fio-purple" />
          <span>Filtrar por Provincias de Costa Rica:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedProvince('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold shrink-0 transition-all cursor-pointer ${
              selectedProvince === 'all'
                ? 'bg-fio-purple text-white shadow-xs'
                : 'bg-white dark:bg-[#1E1A30] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-500/50'
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-fio-purple text-white shadow-xs'
                    : 'bg-white dark:bg-[#1E1A30] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-500/50'
                }`}
              >
                <span>{prov}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Listado de Clientes en Fichas Interactivas */}
      {filteredClients.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white/70 dark:bg-[#1C1829] border border-slate-200 dark:border-white/10 text-center space-y-2">
          <UserCheck className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
          <h4 className="font-bubble font-bold text-sm text-slate-700 dark:text-slate-200">No se encontraron clientes</h4>
          <p className="text-xs text-slate-400 font-sans">
            {search || selectedProvince !== 'all' || selectedPeriod !== 'all'
              ? 'Ningún usuario coincide con los filtros aplicados.'
              : 'No hay usuarios registrados.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
          {filteredClients.map((client, idx) => {
            const { date, time } = formatDate(client.createdAt);
            const province = detectProvince(client.address, client.province);
            const rawPhone = (client.phone || '').replace(/\D/g, '');
            const waPhone = rawPhone.length === 8 ? `506${rawPhone}` : rawPhone;
            const isMobile = client.deviceType === 'mobile' || (client.deviceModel?.toLowerCase().includes('iphone') || client.deviceModel?.toLowerCase().includes('android'));

            const clientKey = client.id || client.email || String(idx);
            const activeTab = cardTabs[clientKey] || globalTabMode;

            return (
              <div key={clientKey} className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1C1829] border border-slate-200/90 dark:border-purple-900/40 shadow-neuCard hover:border-purple-200 dark:hover:border-purple-500/50 transition-all flex flex-col gap-2.5">
                {/* Cabecera de la Ficha con Botones Arriba */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-fio-purple text-white flex items-center justify-center font-bubble font-bold text-sm shrink-0 shadow-2xs">
                      {(client.name || client.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bubble font-bold text-slate-900 dark:text-white text-sm truncate">{client.name || 'Sin nombre registrado'}</span>
                        {(client.username || client.clientSlug) && (
                          <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-mono text-[10px] font-bold shrink-0">
                            @{client.username || client.clientSlug}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1 shrink-0">
                          <ShieldCheck className="w-2.5 h-2.5" /> Web
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans truncate">{client.email}</div>
                    </div>
                  </div>

                  {/* Botones de Pestaña Arriba */}
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
                    <div className="inline-flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-[#25203D] border border-slate-200/80 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => setCardTabs((prev) => ({ ...prev, [clientKey]: 'info' }))}
                        className={`flex items-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-bubble font-bold transition-all cursor-pointer ${
                          activeTab === 'info'
                            ? 'bg-gradient-to-r from-fio-purple to-purple-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/10'
                        }`}
                      >
                        <User className="w-3 h-3" />
                        <span>Info de usuario</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCardTabs((prev) => ({ ...prev, [clientKey]: 'device' }))}
                        className={`flex items-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-bubble font-bold transition-all cursor-pointer ${
                          activeTab === 'device'
                            ? 'bg-gradient-to-r from-fio-purple to-purple-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/10'
                        }`}
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Dispositivo &amp; Red</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contenido Dinámico según la Pestaña Activa */}
                {activeTab === 'info' ? (
                  /* PESTAÑA: INFO DE USUARIO */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#151122] p-3 rounded-xl border border-slate-100 dark:border-white/10 font-sans animate-fadeIn">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <User className="w-3.5 h-3.5 text-fio-purple shrink-0" />
                      <span className="truncate">Nombre: <strong className="text-slate-800 dark:text-slate-100 font-bubble">{client.name || 'Sin nombre registrado'}</strong></span>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">Tel: {client.phone ? (
                          <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                            {client.phone}
                          </a>
                        ) : (
                          <strong className="text-slate-400">Sin teléfono</strong>
                        )}</span>
                      </div>
                      {client.phone && (
                        <a
                          href={`https://wa.me/${waPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bubble font-bold flex items-center gap-0.5 hover:bg-emerald-200 shrink-0"
                        >
                          <span>WA</span>
                          <ExternalLink className="w-2 h-2" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0">
                      <Calendar className="w-3.5 h-3.5 text-fio-purple shrink-0" />
                      <span className="truncate">Creado: <strong className="text-slate-800 dark:text-slate-100">{date}</strong> {time && <span>a las {time}</span>}</span>
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-fio-purple shrink-0" />
                      <span className="truncate">Provincia: <strong className="text-slate-800 dark:text-slate-100">{province}</strong></span>
                    </div>

                    <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2 pt-1 border-t border-slate-100 dark:border-white/10">
                      <div className="flex items-start gap-1.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="truncate flex-1 text-slate-700 dark:text-slate-300">
                          Dir: <strong className="text-slate-800 dark:text-slate-100 font-medium">{client.address || 'Ubicación seleccionada en mapa'}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-5">
                        <a
                          href={getWazeUrlForClient(client)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#33CCFF] hover:bg-[#1EBEF5] text-slate-950 font-bubble font-bold text-[10px] shadow-2xs active:scale-95 transition-all"
                          title="Abrir en Waze"
                        >
                          <span>Waze</span>
                          <ExternalLink className="w-2 h-2" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleCopyClientWaze(client)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bubble font-bold border transition-all active:scale-95 cursor-pointer shadow-2xs ${
                            copiedWazeClientId === clientKey
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/50'
                              : 'bg-white hover:bg-slate-50 dark:bg-[#25203D] dark:hover:bg-[#2C2746] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10'
                          }`}
                          title="Copiar link de Waze"
                        >
                          {copiedWazeClientId === clientKey ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-700 dark:text-emerald-300">¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400" />
                              <span>Copiar link</span>
                            </>
                          )}
                        </button>

                        {client.lat && client.lng && (
                          <a
                            href={`https://www.google.com/maps?q=${client.lat},${client.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-[10px] text-fio-purple hover:underline font-bold ml-auto"
                          >
                            <span>Google Maps</span>
                            <ExternalLink className="w-2 h-2" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* PESTAÑA: DISPOSITIVO & RED */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#151122] p-3 rounded-xl border border-slate-100 dark:border-white/10 font-sans animate-fadeIn">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Cédula: <strong className="text-slate-800 dark:text-slate-100">{client.idCard || 'N/A'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isMobile ? <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Monitor className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      <span className="truncate">Disp: <strong className="text-slate-800 dark:text-slate-100">{client.deviceModel || (isMobile ? 'Celular' : 'Computadora')}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">IP: <strong className="text-slate-800 dark:text-slate-100 font-mono text-[10px]">{client.ipAddress || 'Registrada en D1'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-fio-purple shrink-0" />
                      <span className="truncate">Provincia: <strong className="text-slate-800 dark:text-slate-100">{province}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-1 sm:col-span-2 text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-white/10">
                      <Calendar className="w-3.5 h-3.5 text-fio-purple shrink-0" />
                      <span>Registro inicial: <strong className="text-slate-800 dark:text-slate-200">{date}</strong> {time && <span>a las {time}</span>}</span>
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
