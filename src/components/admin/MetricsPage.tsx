import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock, Unlock, Monitor, Smartphone, Link2, Plus, Copy, Check,
  Trash2, RotateCcw, Heart, TrendingUp, BarChart3, Clock,
  ArrowRight, ShieldCheck, Share2, ExternalLink, RefreshCw,
  ShoppingBag, BookOpen, Sparkles, Tag, GraduationCap, Home,
  Info, AlertCircle
} from 'lucide-react';
import { metricsTracker } from '../../services/metricsTracker';
import { MetricsState, TrackedLink, AppRoute } from '../../types';

interface MetricsPageProps {
  onNavigate: (route: AppRoute) => void;
}

const SECTION_METADATA: Record<string, { label: string; icon: any; routePath: string; color: string }> = {
  catalogo: {
    label: 'Catálogo Digital',
    icon: BookOpen,
    routePath: '/catalogo',
    color: 'from-purple-500 to-indigo-600',
  },
  store: {
    label: 'Tienda Online',
    icon: ShoppingBag,
    routePath: '/tienda',
    color: 'from-pink-500 to-rose-600',
  },
  workshops: {
    label: 'Talleres Creativos',
    icon: GraduationCap,
    routePath: '/talleres',
    color: 'from-amber-500 to-orange-600',
  },
  home: {
    label: 'Portada / Inicio',
    icon: Home,
    routePath: '/',
    color: 'from-fio-purple to-purple-800',
  },
  precios: {
    label: 'Precios de Stickers',
    icon: Tag,
    routePath: '/precios',
    color: 'from-emerald-500 to-teal-600',
  },
  'workshop-detail': {
    label: 'Detalle de Taller',
    icon: Sparkles,
    routePath: '/talleres',
    color: 'from-blue-500 to-cyan-600',
  },
};

export const MetricsPage: React.FC<MetricsPageProps> = ({ onNavigate }) => {
  // Estado de autenticación privada por código numérico
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('byfio_metrics_auth_token') === '1985';
    } catch {
      return false;
    }
  });

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Estado de las métricas
  const [metrics, setMetrics] = useState<MetricsState>(() => metricsTracker.getMetrics());
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // Formulario para nuevo link rastreado
  const [linkName, setLinkName] = useState('');
  const [targetSection, setTargetSection] = useState<string>('home');
  const [customSlug, setCustomSlug] = useState('');
  const [createdFeedback, setCreatedFeedback] = useState<string | null>(null);

  // Cargar métricas actualizadas
  const refreshMetrics = () => {
    const updated = metricsTracker.getMetrics();
    setMetrics({ ...updated });
  };

  useEffect(() => {
    refreshMetrics();
  }, []);

  // Manejo de validación del PIN privado
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1985') {
      try {
        sessionStorage.setItem('byfio_metrics_auth_token', '1985');
      } catch (err) {
        console.warn(err);
      }
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
      refreshMetrics();
    } else {
      setPinError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  const handleLockPanel = () => {
    try {
      sessionStorage.removeItem('byfio_metrics_auth_token');
    } catch (err) {
      console.warn(err);
    }
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Creación de nuevo link
  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkName.trim()) return;

    const targetRoute = targetSection === 'home' ? '/' : `/${targetSection}`;
    const newLink = metricsTracker.createTrackedLink(linkName, targetRoute, customSlug);
    refreshMetrics();

    setLinkName('');
    setCustomSlug('');
    setCreatedFeedback(newLink.name);
    setTimeout(() => setCreatedFeedback(null), 3000);
  };

  // Eliminar link
  const handleDeleteLink = (id: string) => {
    if (window.confirm('¿Deseas eliminar este enlace de rastreo?')) {
      metricsTracker.deleteTrackedLink(id);
      refreshMetrics();
    }
  };

  // Reiniciar estadísticas de un link
  const handleResetLink = (id: string) => {
    if (window.confirm('¿Reiniciar a 0 las estadísticas de este enlace?')) {
      metricsTracker.resetLinkStats(id);
      refreshMetrics();
    }
  };

  // Copiar URL rastreada
  const getFullTrackedUrl = (link: TrackedLink) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://byfiocr.pages.dev';
    const cleanRoute = link.targetRoute === '/' ? '' : link.targetRoute;
    return `${origin}${cleanRoute}?ref=${link.slug}`;
  };

  const copyTrackedUrl = (link: TrackedLink) => {
    const url = getFullTrackedUrl(link);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLinkId(link.id);
      setTimeout(() => setCopiedLinkId(null), 2500);
    });
  };

  // Compartir por WhatsApp
  const shareWhatsApp = (link: TrackedLink) => {
    const url = getFullTrackedUrl(link);
    const msg = encodeURIComponent(`¡Hola! Te comparto este enlace especial de By.Fio: ${url}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  // Copiar resumen del reporte
  const copyMetricsReport = () => {
    const totalDevices = metrics.devices.pc + metrics.devices.mobile || 1;
    const pcPct = Math.round((metrics.devices.pc / totalDevices) * 100);
    const mobPct = Math.round((metrics.devices.mobile / totalDevices) * 100);

    const report = `📊 REPORTE DE MÉTRICAS BY.FIO
------------------------------------
• Cargas Totales de Página: ${metrics.totalPageLoads.toLocaleString()}
• Sesiones Únicas: ${metrics.uniqueSessions.toLocaleString()}
• Dispositivos: 📱 Móvil ${mobPct}% (${metrics.devices.mobile}) | 💻 PC ${pcPct}% (${metrics.devices.pc})

🔗 TOP ENLACES RASTREADOS:
${metrics.trackedLinks.slice(0, 5).map((l) => `  - ${l.name}: ${l.clicks} aperturas (${l.mobileClicks} cel / ${l.pcClicks} pc)`).join('\n')}

❤️ PREFERENCIAS POR SECCIÓN:
${Object.entries(metrics.sections)
  .map(([key, data]) => `  - ${SECTION_METADATA[key]?.label || key}: ${data.views} vistas | ${data.likes} me gusta`)
  .join('\n')}
------------------------------------
Generado el ${new Date().toLocaleDateString('es-CR')} ${new Date().toLocaleTimeString('es-CR')}`;

    navigator.clipboard.writeText(report).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    });
  };

  // Cálculos de porcentaje de dispositivos
  const totalDeviceViews = (metrics.devices.pc + metrics.devices.mobile) || 1;
  const pcPercentage = Math.round((metrics.devices.pc / totalDeviceViews) * 100);
  const mobilePercentage = Math.round((metrics.devices.mobile / totalDeviceViews) * 100);

  // Cálculos de secciones ordenadas por popularidad (vistas + likes)
  const rankedSections = useMemo(() => {
    return Object.entries(metrics.sections).map(([id, data]) => {
      const meta = SECTION_METADATA[id] || {
        label: id.toUpperCase(),
        icon: Sparkles,
        routePath: `/${id}`,
        color: 'from-purple-500 to-indigo-600',
      };
      const score = data.views + (data.likes * 3);
      return {
        id,
        ...data,
        ...meta,
        score,
      };
    }).sort((a, b) => b.score - a.score);
  }, [metrics.sections]);

  const maxSectionScore = Math.max(...rankedSections.map((s) => s.score), 1);

  // Si no está autenticado, mostrar pantalla de PIN seguro sin revelar el código
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white dark:bg-[#1E1B2E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 dark:border-purple-900/40 text-center relative overflow-hidden">
          {/* Luz ambiental de fondo */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-fio-purple/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-fio-pink/15 rounded-full blur-3xl pointer-events-none" />

          {/* Icono de Seguridad */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-fio-purple to-purple-600 text-white shadow-lg shadow-purple-500/25 mb-5 mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bubble font-bold text-slate-900 dark:text-white tracking-wide mb-2">
            Panel Privado de Métricas
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans max-w-xs mx-auto mb-6">
            Módulo restringido de analítica y enlaces rastreables. Introduce el código de acceso autorizado para desbloquear.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className={`relative ${isShaking ? 'animate-bounce' : ''}`}>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••"
                autoFocus
                className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3.5 px-4 rounded-2xl bg-slate-50 dark:bg-[#2A2440] border-2 border-slate-200 dark:border-purple-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-fio-purple dark:focus:border-fio-purple transition-all shadow-inner"
              />
            </div>

            {pinError && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-bubble font-bold animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Código de acceso no válido</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-fio-purple to-purple-700 hover:from-purple-700 hover:to-fio-purple text-white font-bubble font-bold text-sm shadow-lg shadow-purple-600/30 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Desbloquear Métricas</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-purple-900/30">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-fio-purple dark:hover:text-fio-pink transition-colors font-bubble font-bold inline-flex items-center gap-1"
            >
              <span>← Volver a la página principal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista del Panel Desbloqueado
  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Barra Superior del Panel de Métricas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-900/5 backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-fio-purple dark:text-fio-pink font-bubble font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Privado de Analítica & Rastreo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bubble font-bold text-slate-900 dark:text-white tracking-wide">
            Métricas de Visitas y Enlaces
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans">
            Supervisa en tiempo real cuántas veces se carga la página, dispositivos conectados y qué secciones gustan más.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={refreshMetrics}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-purple-900/40 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-purple-900/60 font-bubble font-bold text-xs transition-all active:scale-95 cursor-pointer"
            title="Refrescar métricas"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refrescar</span>
          </button>

          <button
            onClick={copyMetricsReport}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-fio-purple dark:text-fio-pink hover:bg-purple-100 dark:hover:bg-purple-900/50 font-bubble font-bold text-xs border border-purple-200 dark:border-purple-800 transition-all active:scale-95 cursor-pointer"
            title="Copiar reporte en texto"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedReport ? '¡Copiado!' : 'Copiar Reporte'}</span>
          </button>

          <button
            onClick={handleLockPanel}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-bubble font-bold text-xs border border-rose-200 dark:border-rose-900/40 transition-all active:scale-95 cursor-pointer"
            title="Bloquear panel por seguridad"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bloquear</span>
          </button>
        </div>
      </div>

      {/* Tarjetas Principales de Métricas (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Cargas de Página */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bubble font-bold text-slate-500 dark:text-slate-400">
              Total Cargas
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-fio-purple dark:text-fio-pink flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bubble font-bold text-slate-900 dark:text-white">
            {metrics.totalPageLoads.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>Páginas visualizadas</span>
          </p>
        </div>

        {/* Visitas Únicas */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bubble font-bold text-slate-500 dark:text-slate-400">
              Sesiones Únicas
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bubble font-bold text-slate-900 dark:text-white">
            {metrics.uniqueSessions.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Navegadores individuales
          </p>
        </div>

        {/* Computadoras / PC */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bubble font-bold text-slate-500 dark:text-slate-400">
              Visto en PC
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Monitor className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bubble font-bold text-slate-900 dark:text-white">
            {metrics.devices.pc.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {pcPercentage}% del tráfico total
          </p>
        </div>

        {/* Celulares / Móviles */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bubble font-bold text-slate-500 dark:text-slate-400">
              Visto en Celulares
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bubble font-bold text-slate-900 dark:text-white">
            {metrics.devices.mobile.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {mobilePercentage}% del tráfico total
          </p>
        </div>
      </div>

      {/* Gráfico / Comparador de Dispositivos (PC vs Celular) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bubble font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-500" />
              <span>Distribución de Dispositivos (PC vs Celulares)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proporción de personas que navegaron en computadoras de escritorio frente a teléfonos móviles.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bubble font-bold">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>PC: {pcPercentage}% ({metrics.devices.pc})</span>
            </div>
            <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400">
              <span className="w-3 h-3 rounded-full bg-pink-500" />
              <span>Celular: {mobilePercentage}% ({metrics.devices.mobile})</span>
            </div>
          </div>
        </div>

        {/* Barra de Porcentajes Dual */}
        <div className="h-4 sm:h-5 w-full bg-slate-100 dark:bg-[#2A2440] rounded-full overflow-hidden flex p-0.5 border border-slate-200 dark:border-purple-900/50">
          <div
            style={{ width: `${pcPercentage}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-l-full transition-all duration-700 ease-out"
            title={`Computadoras: ${pcPercentage}%`}
          />
          <div
            style={{ width: `${mobilePercentage}%` }}
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-r-full transition-all duration-700 ease-out"
            title={`Celulares: ${mobilePercentage}%`}
          />
        </div>
      </div>

      {/* Sección 1: Generador de Enlaces Específicos & Rastreo de Clics */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-purple-900/30 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bubble font-bold text-xs mb-1">
              <Link2 className="w-3.5 h-3.5" />
              <span>Generador de Links Específicos</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
              Crea Enlaces Rastreables
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Genera links personalizados para tus historias de Instagram, WhatsApp, TikTok o clientes directos y mide cuántas veces se abren.
            </p>
          </div>
        </div>

        {/* Formulario de Creación de Link */}
        <form onSubmit={handleCreateLink} className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 dark:bg-[#252038] border border-purple-100 dark:border-purple-900/30 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Nombre del Link / Campaña */}
            <div className="sm:col-span-1 space-y-1">
              <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300">
                Nombre de la Campaña / Cliente *
              </label>
              <input
                type="text"
                required
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="Ej. Promo Instagram Bio"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1B2E] border border-slate-200 dark:border-purple-900/50 text-slate-900 dark:text-white text-xs font-sans focus:outline-none focus:border-fio-purple"
              />
            </div>

            {/* Sección Destino */}
            <div className="space-y-1">
              <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300">
                Sección a Abrir
              </label>
              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1B2E] border border-slate-200 dark:border-purple-900/50 text-slate-900 dark:text-white text-xs font-sans focus:outline-none focus:border-fio-purple cursor-pointer"
              >
                <option value="home">Portada / Inicio</option>
                <option value="catalogo">Catálogo Digital</option>
                <option value="store">Tienda Online</option>
                <option value="workshops">Talleres Creativos</option>
                <option value="precios">Precios & Stickers</option>
              </select>
            </div>

            {/* Identificador / Slug personalizado (Opcional) */}
            <div className="space-y-1">
              <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300">
                Código del Link (Slug Opcional)
              </label>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="Ej. insta-promo, cliente-fio"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1B2E] border border-slate-200 dark:border-purple-900/50 text-slate-900 dark:text-white text-xs font-sans focus:outline-none focus:border-fio-purple"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-fio-purple" />
              <span>El enlace se generará con el formato: <code>https://byfiocr.pages.dev/?ref=tu-codigo</code></span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-fio-purple to-purple-700 hover:from-purple-700 hover:to-fio-purple text-white text-xs font-bubble font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generar Enlace Rastreable</span>
            </button>
          </div>

          {createdFeedback && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bubble font-bold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>¡Enlace rastreable "{createdFeedback}" creado con éxito! Ya puedes copiarlo abajo.</span>
            </div>
          )}
        </form>

        {/* Tabla / Lista de Enlaces Rastreables Generados */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bubble font-bold text-slate-900 dark:text-white">
              Enlaces Rastreables Activos ({metrics.trackedLinks.length})
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Total aperturas por enlaces: {metrics.trackedLinks.reduce((acc, l) => acc + l.clicks, 0).toLocaleString()}
            </span>
          </div>

          <div className="space-y-2.5">
            {metrics.trackedLinks.map((link) => {
              const fullUrl = getFullTrackedUrl(link);
              const isCopied = copiedLinkId === link.id;

              return (
                <div
                  key={link.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#252038] border border-slate-200 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-fio-purple dark:text-fio-pink flex items-center justify-center shrink-0">
                        <Link2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bubble font-bold text-slate-900 dark:text-white">
                            {link.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-fio-purple dark:text-fio-pink font-mono font-bold">
                            ref={link.slug}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Destino: <span className="font-semibold text-slate-700 dark:text-slate-300">{link.targetRoute}</span>
                          {link.lastClickedAt && (
                            <span className="ml-2 text-[10px] text-slate-400">
                              • Última apertura: {new Date(link.lastClickedAt).toLocaleDateString('es-CR')} {new Date(link.lastClickedAt).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Contadores de Aperturas y Dispositivos */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0 bg-white dark:bg-[#1E1B2E] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-purple-900/40">
                      <div className="text-center pr-3 border-r border-slate-200 dark:border-purple-900/40">
                        <div className="text-base sm:text-lg font-bubble font-bold text-fio-purple dark:text-fio-pink">
                          {link.clicks}
                        </div>
                        <div className="text-[10px] font-bubble text-slate-500 uppercase">
                          Aperturas
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-pink-600 dark:text-pink-400" title="Aperturas en Celular">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span className="font-mono font-bold">{link.mobileClicks}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400" title="Aperturas en PC">
                          <Monitor className="w-3.5 h-3.5" />
                          <span className="font-mono font-bold">{link.pcClicks}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fila de URL y Acciones Rápidas */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-purple-900/30">
                    <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-lg bg-white dark:bg-[#1E1B2E] px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-purple-900/30">
                      {fullUrl}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => copyTrackedUrl(link)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-fio-purple hover:bg-purple-700 text-white text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                        title="Copiar enlace al portapapeles"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                      </button>

                      <button
                        onClick={() => shareWhatsApp(link)}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs transition-all active:scale-95 cursor-pointer"
                        title="Enviar por WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-200 dark:bg-purple-900/60 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs transition-all active:scale-95"
                        title="Probar enlace en nueva pestaña"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleResetLink(link.id)}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-200 dark:bg-purple-900/60 hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-700 text-slate-600 dark:text-slate-300 text-xs transition-all active:scale-95 cursor-pointer"
                        title="Reiniciar contador a 0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-200 dark:bg-purple-900/60 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-600 text-slate-600 dark:text-slate-300 text-xs transition-all active:scale-95 cursor-pointer"
                        title="Eliminar este enlace"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {metrics.trackedLinks.length === 0 && (
              <div className="text-center py-8 text-slate-400 font-bubble">
                No hay enlaces de rastreo creados todavía. Utiliza el formulario arriba para generar el primero.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección 2: Ranking de Secciones Más Visitadas y que Más Gustaron */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/80 text-fio-pink dark:text-pink-300 font-bubble font-bold text-xs mb-1">
            <Heart className="w-3.5 h-3.5" />
            <span>Preferencia y Gustos del Público</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
            ¿Qué Secciones Gustaron Más?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Métricas de interés calculadas por volumen de visitas, tiempo en página y me gusta recibidos en cada sección.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rankedSections.map((section, index) => {
            const IconComponent = section.icon;
            const percentage = Math.round((section.score / maxSectionScore) * 100);

            return (
              <div
                key={section.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#252038] border border-slate-200 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 dark:bg-purple-900 text-slate-700 dark:text-white font-bubble font-bold text-xs">
                      #{index + 1}
                    </div>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${section.color} text-white flex items-center justify-center shadow-md`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bubble font-bold text-slate-900 dark:text-white">
                        {section.label}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500">
                        Ruta: {section.routePath}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bubble font-bold text-fio-purple dark:text-fio-pink">
                      {percentage}% Popularidad
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Índice de afinidad
                    </div>
                  </div>
                </div>

                {/* Barra de Afinidad / Progreso */}
                <div className="h-2.5 w-full bg-slate-200 dark:bg-[#1E1B2E] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full bg-gradient-to-r ${section.color} rounded-full transition-all duration-700 ease-out`}
                  />
                </div>

                {/* Datos numéricos de la sección */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 dark:border-purple-900/30 text-center">
                  <div className="p-2 rounded-xl bg-white dark:bg-[#1E1B2E]">
                    <div className="text-xs sm:text-sm font-bubble font-bold text-slate-900 dark:text-white">
                      {section.views.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-bubble">
                      Vistas
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-[#1E1B2E]">
                    <div className="text-xs sm:text-sm font-bubble font-bold text-pink-600 dark:text-pink-400 flex items-center justify-center gap-1">
                      <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                      <span>{section.likes.toLocaleString()}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-bubble">
                      Me Gusta
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-[#1E1B2E]">
                    <div className="text-xs sm:text-sm font-bubble font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{section.timeSpentAvgMinutes}m</span>
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-bubble">
                      Tiempo Prom.
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
