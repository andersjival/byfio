import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock, Unlock, Monitor, Smartphone, Link2, Plus, Copy, Check,
  Trash2, RotateCcw, Heart, TrendingUp, BarChart3, Clock,
  ArrowRight, ShieldCheck, Share2, ExternalLink, RefreshCw,
  ShoppingBag, BookOpen, Star, Award, Tag, GraduationCap, Home,
  Info, AlertCircle, Globe, Filter, Eye, CheckCircle2,
  Receipt, Boxes, Landmark, QrCode, Users, Layers, Shield
} from 'lucide-react';
import { metricsTracker } from '../../services/metricsTracker';
import { MetricsState, TrackedLink, AppRoute } from '../../types';

interface MetricsPageProps {
  onNavigate: (route: AppRoute, adminTab?: any) => void;
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
  {
    id: 'admin',
    name: 'Panel de Administración',
    path: '/admin',
    badge: 'Gestión Interna',
    icon: ShieldCheck,
  },
  {
    id: 'propuesta',
    name: 'Propuesta Integral & Ecosistema',
    path: '/propuesta',
    badge: 'Propuesta',
    icon: Award,
  },
];

interface SectionMetadataItem {
  label: string;
  category: 'store' | 'admin';
  icon: any;
  routePath: string;
  color: string;
  routeKey: AppRoute;
  adminTabKey?: string;
}

const SECTION_METADATA: Record<string, SectionMetadataItem> = {
  // --- SECCIONES PÚBLICAS Y TIENDA ---
  home: {
    label: 'Portada / Inicio',
    category: 'store',
    icon: Home,
    routePath: '/',
    color: 'from-purple-600 to-indigo-600',
    routeKey: 'home',
  },
  catalogo: {
    label: 'Catálogo Digital',
    category: 'store',
    icon: BookOpen,
    routePath: '/catalogo',
    color: 'from-purple-500 to-fio-pink',
    routeKey: 'catalogo',
  },
  store: {
    label: 'Tienda Online',
    category: 'store',
    icon: ShoppingBag,
    routePath: '/tienda',
    color: 'from-pink-500 to-rose-600',
    routeKey: 'store',
  },
  workshops: {
    label: 'Talleres Creativos',
    category: 'store',
    icon: GraduationCap,
    routePath: '/talleres',
    color: 'from-amber-500 to-orange-600',
    routeKey: 'workshops',
  },
  precios: {
    label: 'Precios de Stickers',
    category: 'store',
    icon: Tag,
    routePath: '/precios',
    color: 'from-emerald-500 to-teal-600',
    routeKey: 'precios',
  },
  'workshop-detail': {
    label: 'Detalle de Taller',
    category: 'store',
    icon: GraduationCap,
    routePath: '/talleres/:id',
    color: 'from-blue-500 to-cyan-600',
    routeKey: 'workshops',
  },
  login: {
    label: 'Portal de Acceso / Login',
    category: 'store',
    icon: Lock,
    routePath: '/login',
    color: 'from-violet-600 to-purple-800',
    routeKey: 'login',
  },

  // --- TODAS LAS PARTES DEL PANEL DE ADMINISTRACIÓN ---
  admin: {
    label: 'Panel Admin - Menú Principal (Hub)',
    category: 'admin',
    icon: ShieldCheck,
    routePath: '/admin',
    color: 'from-purple-700 to-indigo-900',
    routeKey: 'admin',
    adminTabKey: 'hub',
  },
  'admin-billing': {
    label: 'Panel Admin - Facturación Rápida & POS',
    category: 'admin',
    icon: Receipt,
    routePath: '/admin/facturacion',
    color: 'from-fio-pink to-purple-600',
    routeKey: 'admin',
    adminTabKey: 'billing',
  },
  'admin-orders': {
    label: 'Panel Admin - Cola de Pedidos & Alisto',
    category: 'admin',
    icon: QrCode,
    routePath: '/admin/pedidos',
    color: 'from-fio-purple to-pink-600',
    routeKey: 'admin',
    adminTabKey: 'orders',
  },
  'admin-inventory': {
    label: 'Panel Admin - Inventario & Stock QR',
    category: 'admin',
    icon: Boxes,
    routePath: '/admin/inventario',
    color: 'from-sky-500 to-indigo-600',
    routeKey: 'admin',
    adminTabKey: 'inventory',
  },
  'admin-reports': {
    label: 'Panel Admin - Caja & Reportería',
    category: 'admin',
    icon: Landmark,
    routePath: '/admin/caja',
    color: 'from-emerald-600 to-teal-700',
    routeKey: 'admin',
    adminTabKey: 'reports',
  },
  'admin-workshops': {
    label: 'Panel Admin - Alumnos & Talleres',
    category: 'admin',
    icon: GraduationCap,
    routePath: '/admin/talleres',
    color: 'from-amber-600 to-orange-700',
    routeKey: 'admin',
    adminTabKey: 'workshops',
  },
  'admin-pricing': {
    label: 'Panel Admin - Editor de Precios & Stickers',
    category: 'admin',
    icon: Tag,
    routePath: '/admin/precios',
    color: 'from-amber-500 to-yellow-600',
    routeKey: 'admin',
    adminTabKey: 'pricing',
  },
  'admin-users': {
    label: 'Panel Admin - Perfiles de Usuarios & PINs',
    category: 'admin',
    icon: Users,
    routePath: '/admin/usuarios',
    color: 'from-purple-600 to-violet-800',
    routeKey: 'admin',
    adminTabKey: 'users',
  },
  metricas: {
    label: 'Panel Admin - Métricas & Rastreo Privado',
    category: 'admin',
    icon: BarChart3,
    routePath: '/metricas',
    color: 'from-indigo-600 to-blue-700',
    routeKey: 'metricas',
  },
  propuesta: {
    label: 'Propuesta Integral & Ficha Técnica',
    category: 'admin',
    icon: Award,
    routePath: '/propuesta',
    color: 'from-fio-purple to-pink-600',
    routeKey: 'propuesta',
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

  // FILTRO DE CATEGORÍA EN "QUÉ SECCIONES GUSTARON MÁS": 'all' | 'store' | 'admin'
  const [sectionFilterCategory, setSectionFilterCategory] = useState<'all' | 'store' | 'admin'>('all');

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

    // 1. Canal en tiempo real entre pestañas (0ms latencia instantánea)
    const channel =
      typeof window !== 'undefined' && 'BroadcastChannel' in window
        ? new BroadcastChannel('byfio_metrics_channel')
        : null;

    const handleBroadcast = (evt: MessageEvent) => {
      if (evt.data?.type === 'METRICS_UPDATED') {
        refreshMetrics();
      }
    };

    if (channel) {
      channel.addEventListener('message', handleBroadcast);
    }

    // 2. Storage event listener (sincronización entre ventanas)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'byfio_metrics_tracker_v1') {
        refreshMetrics();
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Sincronización Remota desde la base de datos Cloud con Polling Inteligente (Anti-Drain)
    let isSubscribed = true;
    const syncRemoteMetrics = async () => {
      // Si la pestaña está oculta, pausar para ahorro de cuota y batería
      if (typeof document !== 'undefined' && document.hidden) return;
      try {
        const remote = await metricsTracker.fetchRemoteMetrics();
        if (remote && isSubscribed) {
          setMetrics({ ...remote });
        }
      } catch {
        // Red silenciosa
      }
    };

    // Sincronización remota inicial
    syncRemoteMetrics();

    // Intervalo de 2.5s mientras la pestaña esté en foco activo
    const intervalId = setInterval(syncRemoteMetrics, 2500);

    // Reactivación inmediata al regresar a la pestaña
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshMetrics();
        syncRemoteMetrics();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isSubscribed = false;
      if (channel) {
        channel.removeEventListener('message', handleBroadcast);
        channel.close();
      }
      window.removeEventListener('storage', handleStorage);
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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

  const shareWhatsApp = async (link: TrackedLink) => {
    const url = getFullTrackedUrl(link);
    const title = `by.fio — ${link.name}`;
    const text = `¡Hola! Te comparto este enlace especial de by.fio 💖✨:`;

    // Intentar Web Share API nativo si está disponible en móvil para previsualizar imagen de la web
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${text}\n${url}`,
          url,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    const msg = encodeURIComponent(`${text}\n\n${url}`);
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

      // Fusionar todas las secciones registradas para el enlace
      const sectionsData: Record<string, { views: number; likes: number; timeSpentAvgMinutes: number }> = {};
      Object.keys(SECTION_METADATA).forEach((secKey) => {
        if (activeLink.sectionsVisited && activeLink.sectionsVisited[secKey]) {
          sectionsData[secKey] = activeLink.sectionsVisited[secKey];
        } else {
          sectionsData[secKey] = { views: 0, likes: 0, timeSpentAvgMinutes: 1.5 };
        }
      });

      return {
        isLinkSpecific: true,
        title: `Métricas del Enlace: "${activeLink.name}"`,
        subtitle: `Rastreo exclusivo de visitas que entraron por el enlace: ?ref=${activeLink.slug}`,
        totalPageLoads: linkPageViews,
        totalOpens: linkClicks,
        uniqueSessions: linkClicks,
        cartAdditions: activeLink.cartAdditions || 0,
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

    // Asegurar que todas las secciones del mapa existan en sectionsData
    const sectionsData: Record<string, { views: number; likes: number; timeSpentAvgMinutes: number }> = {};
    Object.keys(SECTION_METADATA).forEach((secKey) => {
      sectionsData[secKey] = metrics.sections[secKey] || { views: 0, likes: 0, timeSpentAvgMinutes: 2.0 };
    });

    return {
      isLinkSpecific: false,
      title: 'Métricas Globales de Todo el Sitio Web',
      subtitle: 'Supervisa en tiempo real cargas de página, dispositivos conectados y todas las partes de la web.',
      totalPageLoads: metrics.totalPageLoads,
      totalOpens: metrics.trackedLinks.reduce((acc, l) => acc + l.clicks, 0),
      uniqueSessions: metrics.uniqueSessions,
      cartAdditions:
        metrics.totalCartAdditions ??
        metrics.trackedLinks.reduce((acc, l) => acc + (l.cartAdditions || 0), 0),
      pcCount: metrics.devices.pc,
      mobileCount: metrics.devices.mobile,
      pcPercentage: pcPct,
      mobilePercentage: mobPct,
      sections: sectionsData,
    };
  }, [activeLink, metrics]);

  // Ranking de TODAS las secciones (públicas y de administración) ordenadas por popularidad
  const allRankedSections = useMemo(() => {
    return Object.entries(currentDisplayMetrics.sections).map(([id, data]) => {
      const meta = SECTION_METADATA[id] || {
        label: id.toUpperCase(),
        category: 'store' as const,
        icon: Star,
        routePath: `/${id}`,
        color: 'from-purple-500 to-indigo-600',
        routeKey: 'home' as AppRoute,
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

  // Filtrado por categoría si el usuario selecciona ver solo Tienda o solo Admin
  const filteredSections = useMemo(() => {
    if (sectionFilterCategory === 'all') return allRankedSections;
    return allRankedSections.filter((s) => s.category === sectionFilterCategory);
  }, [allRankedSections, sectionFilterCategory]);

  const maxSectionScore = Math.max(...allRankedSections.map((s) => s.score), 1);

  // Conteo de secciones por categoría
  const storeCount = allRankedSections.filter((s) => s.category === 'store').length;
  const adminCount = allRankedSections.filter((s) => s.category === 'admin').length;

  // Copiar reporte en texto
  const copyMetricsReport = () => {
    const report = `📊 REPORTE DE MÉTRICAS BY.FIO (${currentDisplayMetrics.title})
------------------------------------
• Cargas Totales: ${currentDisplayMetrics.totalPageLoads.toLocaleString()}
• Aperturas / Clics: ${currentDisplayMetrics.totalOpens.toLocaleString()}
• Agregados al Carrito: ${currentDisplayMetrics.cartAdditions.toLocaleString()}
• Dispositivos: 📱 Móvil ${currentDisplayMetrics.mobilePercentage}% (${currentDisplayMetrics.mobileCount}) | 💻 PC ${currentDisplayMetrics.pcPercentage}% (${currentDisplayMetrics.pcCount})

❤️ TODAS LAS PARTES DE LA WEB (PÚBLICAS & ADMIN):
${allRankedSections.map((s) => `  - [${s.category === 'admin' ? 'ADMIN' : 'WEB'}] ${s.label}: ${s.views} vistas | ${s.likes} me gusta`).join('\n')}
------------------------------------
Generado el ${new Date().toLocaleDateString('es-CR')} ${new Date().toLocaleTimeString('es-CR')}`;

    navigator.clipboard.writeText(report).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    });
  };

  // Navegar a una sección desde el panel
  const handleGoToSection = (section: (typeof allRankedSections)[0]) => {
    if (section.routeKey === 'admin') {
      onNavigate('admin', section.adminTabKey || 'hub');
    } else {
      onNavigate(section.routeKey);
    }
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
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-fio-purple dark:hover:text-fio-pink transition-colors font-bubble font-bold inline-flex items-center gap-1 cursor-pointer"
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
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-fio-purple dark:text-fio-pink font-bubble font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Panel Privado de Analítica & Rastreo</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-bubble font-bold text-xs shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>En Vivo · Tiempo Real Activo</span>
            </div>
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
            onClick={() => {
              refreshMetrics();
              metricsTracker.fetchRemoteMetrics().then((r) => r && setMetrics({ ...r }));
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-purple-900/40 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-purple-900/60 font-bubble font-bold text-xs transition-all active:scale-95 cursor-pointer"
            title="Sincronizar métricas en tiempo real"
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

        {/* Texto Explicativo de Alto Contraste Justo Abajo del Título */}
        <p className="text-xs sm:text-sm font-sans font-medium text-slate-700 dark:text-slate-200">
          Toca una de las siguientes opciones para filtrar las métricas en tiempo real:
        </p>

        {/* Píldoras / Botones de Enlaces */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedLinkFilter('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bubble font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedLinkFilter === 'all'
                ? 'bg-gradient-to-r from-fio-purple to-purple-700 text-white shadow-md scale-102 ring-2 ring-purple-400/50'
                : 'bg-white dark:bg-[#252038] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-purple-800 hover:border-fio-purple hover:bg-purple-50 dark:hover:bg-purple-900/40 shadow-xs'
            }`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold text-slate-900 dark:text-white">🌐 Todo el Sitio Web (Global)</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              selectedLinkFilter === 'all'
                ? 'bg-white/25 text-white'
                : 'bg-purple-100 dark:bg-purple-900/60 text-purple-950 dark:text-purple-100 border border-purple-200 dark:border-purple-700'
            }`}>
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
                    ? 'bg-gradient-to-r from-fio-purple to-purple-700 text-white shadow-md scale-102 ring-2 ring-purple-400/50'
                    : 'bg-white dark:bg-[#252038] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-purple-800 hover:border-fio-purple hover:bg-purple-50 dark:hover:bg-purple-900/40 shadow-xs'
                }`}
              >
                <Link2 className="w-3.5 h-3.5 text-fio-pink shrink-0" />
                <span className="truncate max-w-[140px] font-bold text-slate-900 dark:text-white">{link.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-purple-100 dark:bg-purple-900/60 text-purple-950 dark:text-purple-100 border border-purple-200 dark:border-purple-700'
                }`}>
                  {link.clicks} clics
                </span>
              </button>
            );
          })}
        </div>

        {/* Alerta de Modo de Enlace Específico */}
        {activeLink && (
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border-2 border-purple-300 dark:border-purple-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="font-bubble font-bold text-purple-950 dark:text-purple-100">
                  Estás viendo las métricas del enlace: "{activeLink.name}"
                </span>
                <span className="text-[11px] text-slate-800 dark:text-slate-200 ml-1.5 font-mono font-semibold">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
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

        {/* Agregados al Carrito */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-amber-200/80 dark:border-amber-900/40 shadow-lg shadow-purple-950/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bubble font-bold text-slate-500 dark:text-slate-400">
              {currentDisplayMetrics.isLinkSpecific ? 'Al Carrito (Este Link)' : 'Al Carrito'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bubble font-bold text-amber-600 dark:text-amber-400">
            {currentDisplayMetrics.cartAdditions.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {Math.round((currentDisplayMetrics.cartAdditions / Math.max(1, currentDisplayMetrics.totalOpens)) * 100)}%
            </span>
            <span>de conversión de clics</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
                        <div
                          className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 border-l border-slate-200 dark:border-purple-900/50 pl-2 font-bold"
                          title="Productos añadidos al carrito por visitantes de este link"
                        >
                          <ShoppingBag className="w-3 h-3 text-amber-500" />
                          <span>{link.cartAdditions || 0} carrito</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 border-l border-slate-200 dark:border-purple-900/50 pl-2">
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

      {/* TODAS LAS PARTES DE LA WEB: QUÉ SECCIONES GUSTARON MÁS (HASTA EL PANEL DE ADMIN) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1B2E] border border-purple-100 dark:border-purple-900/40 shadow-lg shadow-purple-950/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-purple-900/30 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/80 text-fio-pink dark:text-pink-300 font-bubble font-bold text-xs mb-1">
              <Heart className="w-3.5 h-3.5" />
              <span>Preferencia y Gustos de los Visitantes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bubble font-bold text-slate-900 dark:text-white">
              ¿Qué Secciones Gustaron Más? {currentDisplayMetrics.isLinkSpecific ? `(En este Link)` : `(Todas las Partes de la Web)`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentDisplayMetrics.isLinkSpecific
                ? `Desglose de navegación de los usuarios que entraron a través de: "${activeLink?.name}"`
                : 'Métricas completas de cada sección pública y de cada módulo del Panel de Administración.'}
            </p>
          </div>

          {/* Filtro Rápido de Categorías: Todas las Partes vs Tienda vs Admin */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/90 dark:bg-[#1E1B2E] border border-slate-300 dark:border-purple-900/50 shrink-0">
            <button
              type="button"
              onClick={() => setSectionFilterCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                sectionFilterCategory === 'all'
                  ? 'bg-fio-purple text-white shadow-sm ring-1 ring-purple-300'
                  : 'bg-white dark:bg-[#252038] text-slate-900 dark:text-white hover:text-fio-purple hover:bg-purple-50 dark:hover:bg-purple-900/50 shadow-xs border border-slate-300/80 dark:border-purple-800/60'
              }`}
            >
              🌐 Todas ({allRankedSections.length})
            </button>
            <button
              type="button"
              onClick={() => setSectionFilterCategory('store')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                sectionFilterCategory === 'store'
                  ? 'bg-fio-purple text-white shadow-sm ring-1 ring-purple-300'
                  : 'bg-white dark:bg-[#252038] text-slate-900 dark:text-white hover:text-fio-purple hover:bg-purple-50 dark:hover:bg-purple-900/50 shadow-xs border border-slate-300/80 dark:border-purple-800/60'
              }`}
            >
              🛍️ Tienda & Clientes ({storeCount})
            </button>
            <button
              type="button"
              onClick={() => setSectionFilterCategory('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                sectionFilterCategory === 'admin'
                  ? 'bg-fio-purple text-white shadow-sm ring-1 ring-purple-300'
                  : 'bg-white dark:bg-[#252038] text-slate-900 dark:text-white hover:text-fio-purple hover:bg-purple-50 dark:hover:bg-purple-900/50 shadow-xs border border-slate-300/80 dark:border-purple-800/60'
              }`}
            >
              🛡️ Panel Admin ({adminCount})
            </button>
          </div>
        </div>

        {/* Grid de Secciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSections.map((section, index) => {
            const IconComponent = section.icon;
            const percentage = Math.round((section.score / maxSectionScore) * 100);
            const isAdmin = section.category === 'admin';

            return (
              <div
                key={section.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-[#252038] border border-slate-200 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-purple-900 text-slate-700 dark:text-white font-bubble font-bold text-[11px] shrink-0">
                        #{index + 1}
                      </div>
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${section.color} text-white flex items-center justify-center shadow-xs shrink-0`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bubble font-bold text-slate-900 dark:text-white truncate" title={section.label}>
                          {section.label}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                            isAdmin
                              ? 'bg-purple-200 text-purple-900 dark:bg-purple-950 dark:text-purple-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {isAdmin ? 'Admin' : 'Público'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 truncate">
                            {section.routePath}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bubble font-bold text-fio-purple dark:text-fio-pink">
                        {percentage}%
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Afinidad
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progreso */}
                  <div className="h-2 w-full bg-slate-200 dark:bg-[#1E1B2E] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full bg-gradient-to-r ${section.color} rounded-full transition-all duration-700 ease-out`}
                    />
                  </div>

                  {/* Métricas: Vistas, Likes y Tiempo */}
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 rounded-xl bg-white dark:bg-[#1E1B2E] border border-slate-200/60 dark:border-white/5">
                      <div className="text-xs font-bubble font-bold text-slate-900 dark:text-white">
                        {section.views.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-slate-400 uppercase font-bubble">
                        Vistas
                      </div>
                    </div>

                    <div className="p-1.5 rounded-xl bg-white dark:bg-[#1E1B2E] border border-slate-200/60 dark:border-white/5">
                      <div className="text-xs font-bubble font-bold text-pink-600 dark:text-pink-400 flex items-center justify-center gap-1">
                        <Heart className="w-2.5 h-2.5 fill-pink-500 text-pink-500" />
                        <span>{section.likes.toLocaleString()}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 uppercase font-bubble">
                        Me Gusta
                      </div>
                    </div>

                    <div className="p-1.5 rounded-xl bg-white dark:bg-[#1E1B2E] border border-slate-200/60 dark:border-white/5">
                      <div className="text-xs font-bubble font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{section.timeSpentAvgMinutes}m</span>
                      </div>
                      <div className="text-[9px] text-slate-400 uppercase font-bubble">
                        Tiempo
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón para Abrir / Navegar a la Sección */}
                <button
                  type="button"
                  onClick={() => handleGoToSection(section)}
                  className="w-full mt-2 py-1.5 px-3 rounded-xl bg-white dark:bg-[#1E1B2E] hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-700 dark:text-slate-200 text-[11px] font-bubble font-bold transition-all border border-slate-200/80 dark:border-white/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Abrir Sección</span>
                  <ArrowRight className="w-3 h-3 text-fio-purple" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
