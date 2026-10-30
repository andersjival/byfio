import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock, Unlock, Monitor, Smartphone, Link2, Plus, Copy, Check,
  Trash2, RotateCcw, Heart, TrendingUp, BarChart3, Clock,
  ArrowRight, ShieldCheck, Share2, ExternalLink, RefreshCw,
  ShoppingBag, BookOpen, Sparkles, Tag, GraduationCap, Home,
  Info, AlertCircle, Globe, Filter, Eye, CheckCircle2
} from 'lucide-react';
import { metricsTracker } from '../../services/metricsTracker';
import { MetricsState, TrackedLink, AppRoute } from '../../types';

interface MetricsPageProps {
  onNavigate: (route: AppRoute) => void;
}

interface DestinationSectionOption {
  id: string;
  name: string;
  path: string;
  badge: string;
  icon: any;
}

const DESTINATION_OPTIONS: DestinationSectionOption[] = [
  {
    id: 'all',
    name: 'Todas las Secciones / Todo el Sitio Web',
    path: '/',
    badge: 'Sitio Completo',
    icon: Globe,
  },
  {
    id: 'store',
    name: 'Tienda Online',
    path: '/tienda',
    badge: 'E-commerce',
    icon: ShoppingBag,
  },
  {
    id: 'catalogo',
    name: 'Catálogo Digital',
    path: '/catalogo',
    badge: 'Catálogo Mayorista',
    icon: BookOpen,
  },
  {
    id: 'workshops',
    name: 'Talleres Creativos',
    path: '/talleres',
    badge: 'Clases & Cupos',
    icon: GraduationCap,
  },
  {
    id: 'precios',
    name: 'Precios de Stickers',
    path: '/precios',
    badge: 'Lista Precios',
    icon: Tag,
  },
];

const SECTION_METADATA: Record<string, { label: string; icon: any; routePath: string; color: string }> = {
  home: {
    label: 'Portada / Inicio',
    icon: Home,
    routePath: '/',
    color: 'from-purple-600 to-indigo-600',
  },
  catalogo: {
    label: 'Catálogo Digital',
    icon: BookOpen,
    routePath: '/catalogo',
    color: 'from-purple-500 to-fio-pink',
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
  // Estado de autenticación privada por código numérico (1985)
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

  // Estado central de métricas
  const [metrics, setMetrics] = useState<MetricsState>(() => metricsTracker.getMetrics());
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // FILTRO ACTIVO DE MÉTRICAS: 'all' (Todo el Sitio) o ID de un enlace creado específico
  const [selectedLinkFilter, setSelectedLinkFilter] = useState<string>('all');

  // Formulario para nuevo link rastreado
  const [linkName, setLinkName] = useState('');
  const [targetSectionId, setTargetSectionId] = useState<string>('all');
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

  // Creación de nuevo enlace rastreado
  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkName.trim()) return;

    const opt = DESTINATION_OPTIONS.find((o) => o.id === targetSectionId) || DESTINATION_OPTIONS[0];
    const newLink = metricsTracker.createTrackedLink(linkName, opt.path, opt.name, customSlug);
    refreshMetrics();

    // Seleccionar automáticamente el link creado para ver sus métricas de inmediato
    setSelectedLinkFilter(newLink.id);
    setLinkName('');
    setCustomSlug('');
    setCreatedFeedback(newLink.name);
    setTimeout(() => setCreatedFeedback(null), 4000);
  };

  // Eliminar link
  const handleDeleteLink = (id: string) => {
    if (window.confirm('¿Deseas eliminar este enlace de rastreo?')) {
      metricsTracker.deleteTrackedLink(id);
      if (selectedLinkFilter === id) {
        setSelectedLinkFilter('all');
      }
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

  // Enlace activo seleccionado (si aplica)
  const activeLink = useMemo(() => {
    if (selectedLinkFilter === 'all') return null;
    return metrics.trackedLinks.find((l) => l.id === selectedLinkFilter) || null;
  }, [metrics.trackedLinks, selectedLinkFilter]);

  // Construir URL completa con parámetro ref
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

  const shareWhatsApp = (link: TrackedLink) => {
    const url = getFullTrackedUrl(link);
    const msg = encodeURIComponent(`¡Hola! Te comparto este enlace especial de By.Fio: ${url}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  // DATOS A MOSTRAR (DEL LINK SELECCIONADO O GLOBALES DE TODO EL SITIO)
  const currentDisplayMetrics = useMemo(() => {
    if (activeLink) {
      // MÉTRICAS ESPECÍFICAS DEL ENLACE SELECCIONADO
      const linkClicks = activeLink.clicks || 0;
      const linkPageViews = activeLink.pageViews || linkClicks;
      const pc = activeLink.pcClicks || 0;
      const mobile = activeLink.mobileClicks || 0;
      const totalDev = (pc + mobile) || 1;
      const pcPct = Math.round((pc / totalDev) * 100);
      const mobPct = Math.round((mobile / totalDev) * 100);

      // Secciones visitadas por las personas que abrieron este enlace
      const sectionsData = activeLink.sectionsVisited && Object.keys(activeLink.sectionsVisited).length > 0
        ? activeLink.sectionsVisited
        : {
            // Si el link aún no tiene navegación de secciones, inicializar con su destino
            [activeLink.targetRoute === '/' ? 'home' : activeLink.targetRoute.replace('/', '')]: {
              views: linkClicks,
              likes: Math.round(linkClicks * 0.25),
              timeSpentAvgMinutes: 2.2,
            },
          };

      return {
        isLinkSpecific: true,
        title: `Métricas del Enlace: "${activeLink.name}"`,
        subtitle: `Rastreo exclusivo de visitas que entraron por el enlace: ?ref=${activeLink.slug}`,
        totalPageLoads: linkPageViews,
        totalOpens: linkClicks,
        uniqueSessions: linkClicks,
        pcCount: pc,
        mobileCount: mobile,
        pcPercentage: pcPct,
        mobilePercentage: mobPct,
        sections: sectionsData,
      };
    }

    // MÉTRICAS GLOBALES DE TODO EL SITIO WEB
    const totalDev = (metrics.devices.pc + metrics.devices.mobile) || 1;
    const pcPct = Math.round((metrics.devices.pc / totalDev) * 100);
    const mobPct = Math.round((metrics.devices.mobile / totalDev) * 100);

    return {
      isLinkSpecific: false,
      title: 'Métricas Globales de Todo el Sitio Web',
      subtitle: 'Supervisa en tiempo real cargas de página, dispositivos conectados y qué secciones gustan más.',
      totalPageLoads: metrics.totalPageLoads,
      totalOpens: metrics.trackedLinks.reduce((acc, l) => acc + l.clicks, 0),
      uniqueSessions: metrics.uniqueSessions,
      pcCount: metrics.devices.pc,
      mobileCount: metrics.devices.mobile,
      pcPercentage: pcPct,
      mobilePercentage: mobPct,
      sections: metrics.sections,
    };
  }, [activeLink, metrics]);

  // Ranking de secciones ordenadas por interés del público
  const rankedSections = useMemo(() => {
    return Object.entries(currentDisplayMetrics.sections).map(([id, data]) => {
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
  }, [currentDisplayMetrics.sections]);

  const maxSectionScore = Math.max(...rankedSections.map((s) => s.score), 1);

  // Copiar reporte en texto
  const copyMetricsReport = () => {
    const report = `📊 REPORTE DE MÉTRICAS BY.FIO (${currentDisplayMetrics.title})
------------------------------------
• Cargas Totales: ${currentDisplayMetrics.totalPageLoads.toLocaleString()}
• Aperturas / Clics: ${currentDisplayMetrics.totalOpens.toLocaleString()}
• Dispositivos: 📱 Móvil ${currentDisplayMetrics.mobilePercentage}% (${currentDisplayMetrics.mobileCount}) | 💻 PC ${currentDisplayMetrics.pcPercentage}% (${currentDisplayMetrics.pcCount})

❤️ PREFERENCIAS POR SECCIÓN:
${rankedSections.map((s) => `  - ${s.label}: ${s.views} vistas | ${s.likes} me gusta`).join('\n')}
------------------------------------
Generado el ${new Date().toLocaleDateString('es-CR')} ${new Date().toLocaleTimeString('es-CR')}`;

    navigator.clipboard.writeText(report).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    });
  };

  // PANTALLA DE ACCESO CON PIN DE SEGURIDAD (CÓDIGO 1985 OCULTO)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white dark:bg-[#1E1B2E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 dark:border-purple-900/40 text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-fio-purple/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-fio-pink/15 rounded-full blur-3xl pointer-events-none" />

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

  // PANEL DESBLOQUEADO
  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Barra Superior con Acciones y Bloqueo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-900/5 backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-fio-purple dark:text-fio-pink font-bubble font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Privado de Analítica & Rastreo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bubble font-bold text-slate-900 dark:text-white tracking-wide">
            {currentDisplayMetrics.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans">
            {currentDisplayMetrics.subtitle}
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

      {/* SELECTOR INTERACTIVO DE ENLACES: VER MÉTRICAS GLOBALES O DE UN LINK ESPECÍFICO */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-fio-purple dark:text-fio-pink">
              <Filter className="w-4 h-4" />
            </span>
            <span className="font-bubble font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Filtrar Métricas: Selecciona si deseas ver Todo el Sitio Web o un Enlace Creado Específico:
            </span>
          </div>

          {activeLink && (
            <button
              onClick={() => setSelectedLinkFilter('all')}
              className="text-xs font-bubble font-bold text-fio-purple hover:underline inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>← Volver a Métricas Globales (Todo el Sitio)</span>
            </button>
          )}
        </div>

        {/* Píldoras / Botones de Enlaces */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedLinkFilter('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bubble font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedLinkFilter === 'all'
                ? 'bg-gradient-to-r from-fio-purple to-purple-700 text-white shadow-md scale-102'
                : 'bg-slate-100 dark:bg-[#252038] text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>🌐 Todo el Sitio Web (Global)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
              {metrics.totalPageLoads} cargas
            </span>
          </button>

          {metrics.trackedLinks.map((link) => {
            const isSelected = selectedLinkFilter === link.id;

            return (
              <button
                key={link.id}
                onClick={() => setSelectedLinkFilter(link.id)}
                className={`px-3 py-2 rounded-2xl text-xs font-bubble font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-fio-purple to-purple-700 text-white shadow-md scale-102'
                    : 'bg-slate-100 dark:bg-[#252038] text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <Link2 className="w-3.5 h-3.5 text-fio-pink shrink-0" />
                <span className="truncate max-w-[140px]">{link.name}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-200/50 dark:bg-purple-900/50 text-slate-900 dark:text-white font-mono font-bold">
                  {link.clicks} clics
                </span>
              </button>
            );
          })}
        </div>

        {/* Alerta de Modo de Enlace Específico */}
        {activeLink && (
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="font-bubble font-bold text-purple-900 dark:text-purple-200">
                  Estás viendo las métricas del enlace: "{activeLink.name}"
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1.5 font-mono">
                  (ref={activeLink.slug}) • Destino: {activeLink.targetLabel || activeLink.targetRoute}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copyTrackedUrl(activeLink)}
                className="px-2.5 py-1 rounded-xl bg-fio-purple text-white font-bubble font-bold text-[11px] hover:bg-purple-700 transition-all cursor-pointer flex items-center gap-1"
              >
                {copiedLinkId === activeLink.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLinkId === activeLink.id ? '¡Copiado!' : 'Copiar URL'}</span>
              </button>

              <button
                onClick={() => shareWhatsApp(activeLink)}
                className="p-1 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all cursor-pointer"
                title="Compartir por WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TARJETAS PRINCIPALES DE MÉTRICAS (KPIS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Cargas de Página */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bubble font-bold text-slate-500 dark:text-slate-400">
              {currentDisplayMetrics.isLinkSpecific ? 'Cargas de este Link' : 'Total Cargas'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-fio-purple dark:text-fio-pink flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bubble font-bold text-slate-900 dark:text-white">
            {currentDisplayMetrics.totalPageLoads.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>Páginas visualizadas</span>
          </p>
        </div>

        {/* Aperturas / Sesiones Únicas */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bubble font-bold text-slate-500 dark:text-slate-400">
              {currentDisplayMetrics.isLinkSpecific ? 'Veces que se Abrió' : 'Sesiones Únicas'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bubble font-bold text-slate-900 dark:text-white">
            {currentDisplayMetrics.totalOpens.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {currentDisplayMetrics.isLinkSpecific ? 'Aperturas directas del link' : 'Navegadores individuales'}
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
            {currentDisplayMetrics.pcCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {currentDisplayMetrics.pcPercentage}% del tráfico {currentDisplayMetrics.isLinkSpecific ? 'de este link' : 'total'}
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
            {currentDisplayMetrics.mobileCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {currentDisplayMetrics.mobilePercentage}% del tráfico {currentDisplayMetrics.isLinkSpecific ? 'de este link' : 'total'}
          </p>
        </div>
      </div>

      {/* COMPARADOR VISUAL DE DISPOSITIVOS (PC VS CELULAR) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bubble font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-500" />
              <span>
                Dispositivos {currentDisplayMetrics.isLinkSpecific ? `de este Enlace (${activeLink?.name})` : '(PC vs Celulares)'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proporción de visitas desde computadoras de escritorio frente a teléfonos móviles.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bubble font-bold">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>PC: {currentDisplayMetrics.pcPercentage}% ({currentDisplayMetrics.pcCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400">
              <span className="w-3 h-3 rounded-full bg-pink-500" />
              <span>Celular: {currentDisplayMetrics.mobilePercentage}% ({currentDisplayMetrics.mobileCount})</span>
            </div>
          </div>
        </div>

        {/* Barra de Porcentajes Dual */}
        <div className="h-4 sm:h-5 w-full bg-slate-100 dark:bg-[#2A2440] rounded-full overflow-hidden flex p-0.5 border border-slate-200 dark:border-purple-900/50">
          <div
            style={{ width: `${currentDisplayMetrics.pcPercentage}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-l-full transition-all duration-700 ease-out"
            title={`Computadoras: ${currentDisplayMetrics.pcPercentage}%`}
          />
          <div
            style={{ width: `${currentDisplayMetrics.mobilePercentage}%` }}
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-r-full transition-all duration-700 ease-out"
            title={`Celulares: ${currentDisplayMetrics.mobilePercentage}%`}
          />
        </div>
      </div>

      {/* GENERADOR DE ENLACES ESPECÍFICOS & BOTÓN TODAS LAS SECCIONES */}
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
              Genera links para todo el sitio o secciones específicas, compártelos y mide exactamente qué hacen los clientes.
            </p>
          </div>
        </div>

        {/* Formulario con Botón "Todas las Secciones" */}
        <form onSubmit={handleCreateLink} className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 dark:bg-[#252038] border border-purple-100 dark:border-purple-900/30 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nombre del Link / Campaña */}
            <div className="space-y-1">
              <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300">
                Nombre de la Campaña / Cliente / Red Social *
              </label>
              <input
                type="text"
                required
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="Ej. Historia Instagram, WhatsApp Clientes, Feria..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1B2E] border border-slate-200 dark:border-purple-900/50 text-slate-900 dark:text-white text-xs font-sans focus:outline-none focus:border-fio-purple"
              />
            </div>

            {/* Código del Link (Slug Opcional) */}
            <div className="space-y-1">
              <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300">
                Código del Link (Slug personalizado, opcional)
              </label>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="Ej. promo-navidad, cliente-andrea..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1B2E] border border-slate-200 dark:border-purple-900/50 text-slate-900 dark:text-white text-xs font-sans focus:outline-none focus:border-fio-purple"
              />
            </div>
          </div>

          {/* SECCIÓN A ABRIR: BOTÓN "TODAS LAS SECCIONES" Y OPCIONES INDIVIDUALES */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Sección a Abrir con este Enlace:</span>
              <span className="text-[11px] text-fio-purple font-normal">
                Seleccionado: <strong>{DESTINATION_OPTIONS.find((o) => o.id === targetSectionId)?.name}</strong>
              </span>
            </label>

            {/* Fila de Botones Rápidos (Incluyendo botón destacado: "Todas las Secciones") */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {DESTINATION_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = targetSectionId === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTargetSectionId(opt.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-fio-purple text-white border-fio-purple shadow-md scale-102 font-bubble font-bold'
                        : 'bg-white dark:bg-[#1E1B2E] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-purple-900/40 hover:border-fio-purple hover:bg-purple-50 dark:hover:bg-purple-900/30'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-fio-yellow' : 'text-fio-purple'}`} />
                    <div className="min-w-0">
                      <div className="text-xs truncate">{opt.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                        {opt.badge}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-fio-purple" />
              <span>
                Formato resultante: <code>https://byfiocr.pages.dev{targetSectionId === 'all' ? '' : `/${targetSectionId}`}?ref=tu-codigo</code>
              </span>
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
              <span>¡Enlace "{createdFeedback}" creado! Ahora puedes ver sus métricas específicas arriba o copiarlo abajo.</span>
            </div>
          )}
        </form>

        {/* TABLA DE ENLACES ACTIVOS CON BOTÓN "VER MÉTRICAS DE ESTE LINK" */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bubble font-bold text-slate-900 dark:text-white">
              Enlaces Rastreables Creados ({metrics.trackedLinks.length})
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Presiona "Ver Métricas" para cargar los datos exclusivos de cualquier link
            </span>
          </div>

          <div className="space-y-2.5">
            {metrics.trackedLinks.map((link) => {
              const fullUrl = getFullTrackedUrl(link);
              const isCopied = copiedLinkId === link.id;
              const isFilterActive = selectedLinkFilter === link.id;

              return (
                <div
                  key={link.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isFilterActive
                      ? 'bg-purple-50/80 dark:bg-[#2C2448] border-fio-purple shadow-md ring-2 ring-purple-400/30'
                      : 'bg-slate-50 dark:bg-[#252038] border-slate-200 dark:border-purple-900/40 hover:border-purple-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-fio-purple dark:text-fio-pink flex items-center justify-center shrink-0">
                        <Link2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bubble font-bold text-slate-900 dark:text-white">
                            {link.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-fio-purple dark:text-fio-pink font-mono font-bold">
                            ref={link.slug}
                          </span>
                          {isFilterActive && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              Métricas Activas en Pantalla
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Abre:{' '}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {link.targetLabel || (link.targetRoute === '/' ? 'Todas las Secciones (Inicio)' : link.targetRoute)}
                          </span>
                          {link.lastClickedAt && (
                            <span className="ml-2 text-[10px] text-slate-400">
                              • Último clic: {new Date(link.lastClickedAt).toLocaleDateString('es-CR')} {new Date(link.lastClickedAt).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Botón Principal para Cargar Métricas de este Enlace */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLinkFilter(link.id);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bubble font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                          isFilterActive
                            ? 'bg-fio-purple text-white shadow-sm'
                            : 'bg-white dark:bg-[#1E1B2E] text-fio-purple hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800'
                        }`}
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>{isFilterActive ? 'Métricas en Pantalla' : 'Ver Métricas de este Link'}</span>
                      </button>

                      {/* Contador Rápido */}
                      <div className="flex items-center gap-2 bg-white dark:bg-[#1E1B2E] px-2.5 py-1 rounded-xl border border-slate-200 dark:border-purple-900/40">
                        <div className="text-xs font-bubble font-bold text-fio-purple dark:text-fio-pink">
                          {link.clicks} clics
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 border-l border-slate-200 pl-2">
                          <Smartphone className="w-3 h-3 text-pink-500" />
                          <span>{link.mobileClicks}</span>
                          <Monitor className="w-3 h-3 text-blue-500 ml-1" />
                          <span>{link.pcClicks}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fila de URL y Acciones */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-purple-900/30">
                    <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-lg bg-white dark:bg-[#1E1B2E] px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-purple-900/30">
                      {fullUrl}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => copyTrackedUrl(link)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-fio-purple hover:bg-purple-700 text-white text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                        title="Copiar enlace"
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
                        title="Probar enlace"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleResetLink(link.id)}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-200 dark:bg-purple-900/60 hover:bg-amber-100 hover:text-amber-700 text-slate-600 text-xs transition-all active:scale-95 cursor-pointer"
                        title="Reiniciar contador a 0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-200 dark:bg-purple-900/60 hover:bg-rose-100 hover:text-rose-600 text-slate-600 text-xs transition-all active:scale-95 cursor-pointer"
                        title="Eliminar enlace"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RANKING DE SECCIONES MÁS VISITADAS Y QUE MÁS GUSTARON (DEL LINK O GLOBALES) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-purple-900/30 pb-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/80 text-fio-pink dark:text-pink-300 font-bubble font-bold text-xs mb-1">
              <Heart className="w-3.5 h-3.5" />
              <span>Preferencia y Gustos de los Visitantes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
              ¿Qué Secciones Gustaron Más? {currentDisplayMetrics.isLinkSpecific ? `(En este Link)` : `(Todo el Sitio)`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentDisplayMetrics.isLinkSpecific
                ? `Desglose de navegación de los usuarios que entraron a través de: "${activeLink?.name}"`
                : 'Métricas de interés acumuladas de todo el sitio web por volumen de vistas y me gusta.'}
            </p>
          </div>

          {activeLink && (
            <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-fio-purple font-bubble font-bold">
              Filtrado por: {activeLink.name}
            </span>
          )}
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

                {/* Barra de Progreso */}
                <div className="h-2.5 w-full bg-slate-200 dark:bg-[#1E1B2E] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full bg-gradient-to-r ${section.color} rounded-full transition-all duration-700 ease-out`}
                  />
                </div>

                {/* Números de la sección */}
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
