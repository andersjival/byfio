import { MetricsState, TrackedLink } from '../types';

const STORAGE_KEY = 'byfio_metrics_tracker_v1';

const INITIAL_METRICS_STATE: MetricsState = {
  totalPageLoads: 1842,
  uniqueSessions: 1256,
  devices: {
    pc: 512,
    mobile: 744,
  },
  trackedLinks: [
    {
      id: 'link-1',
      name: 'Instagram Bio Oficial',
      slug: 'insta-bio',
      targetRoute: '/',
      targetLabel: 'Todo el Sitio Web (Portada)',
      clicks: 540,
      pageViews: 1280,
      pcClicks: 110,
      mobileClicks: 430,
      sectionsVisited: {
        home: { views: 540, likes: 98, timeSpentAvgMinutes: 2.4 },
        catalogo: { views: 420, likes: 115, timeSpentAvgMinutes: 4.5 },
        store: { views: 380, likes: 88, timeSpentAvgMinutes: 3.2 },
        workshops: { views: 240, likes: 45, timeSpentAvgMinutes: 2.8 },
        precios: { views: 180, likes: 32, timeSpentAvgMinutes: 1.9 },
      },
      createdAt: '2026-10-15T10:00:00.000Z',
      lastClickedAt: '2026-10-30T10:20:00.000Z',
    },
    {
      id: 'link-2',
      name: 'Catálogo WhatsApp Clientes',
      slug: 'wa-catalogo',
      targetRoute: '/catalogo',
      targetLabel: 'Catálogo Digital',
      clicks: 388,
      pageViews: 860,
      pcClicks: 48,
      mobileClicks: 340,
      sectionsVisited: {
        catalogo: { views: 388, likes: 142, timeSpentAvgMinutes: 5.1 },
        store: { views: 260, likes: 74, timeSpentAvgMinutes: 3.4 },
        home: { views: 190, likes: 30, timeSpentAvgMinutes: 1.8 },
        precios: { views: 110, likes: 22, timeSpentAvgMinutes: 2.0 },
      },
      createdAt: '2026-10-18T14:30:00.000Z',
      lastClickedAt: '2026-10-30T11:15:00.000Z',
    },
    {
      id: 'link-3',
      name: 'TikTok Enlace Perfil',
      slug: 'tiktok-bio',
      targetRoute: '/tienda',
      targetLabel: 'Tienda Online',
      clicks: 295,
      pageViews: 620,
      pcClicks: 25,
      mobileClicks: 270,
      sectionsVisited: {
        store: { views: 295, likes: 96, timeSpentAvgMinutes: 4.0 },
        catalogo: { views: 190, likes: 52, timeSpentAvgMinutes: 3.2 },
        home: { views: 150, likes: 28, timeSpentAvgMinutes: 1.5 },
        workshops: { views: 85, likes: 18, timeSpentAvgMinutes: 2.1 },
      },
      createdAt: '2026-10-20T09:00:00.000Z',
      lastClickedAt: '2026-10-29T18:40:00.000Z',
    },
    {
      id: 'link-4',
      name: 'Código QR Tarjetas y Taller',
      slug: 'qr-taller',
      targetRoute: '/talleres',
      targetLabel: 'Talleres Creativos',
      clicks: 215,
      pageViews: 480,
      pcClicks: 18,
      mobileClicks: 197,
      sectionsVisited: {
        workshops: { views: 215, likes: 78, timeSpentAvgMinutes: 4.8 },
        'workshop-detail': { views: 140, likes: 42, timeSpentAvgMinutes: 3.6 },
        home: { views: 95, likes: 16, timeSpentAvgMinutes: 1.9 },
        catalogo: { views: 60, likes: 12, timeSpentAvgMinutes: 2.5 },
      },
      createdAt: '2026-10-22T16:00:00.000Z',
      lastClickedAt: '2026-10-30T09:10:00.000Z',
    },
  ],
  sections: {
    home: { views: 1842, likes: 242, timeSpentAvgMinutes: 2.5 },
    catalogo: { views: 1420, likes: 318, timeSpentAvgMinutes: 4.2 },
    store: { views: 1180, likes: 294, timeSpentAvgMinutes: 3.8 },
    workshops: { views: 890, likes: 205, timeSpentAvgMinutes: 3.1 },
    precios: { views: 670, likes: 168, timeSpentAvgMinutes: 2.1 },
    'workshop-detail': { views: 430, likes: 112, timeSpentAvgMinutes: 2.9 },
  },
  lastVisitTimestamp: new Date().toISOString(),
};

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined' || !window.navigator) return false;
  const ua = window.navigator.userAgent || window.navigator.vendor;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
};

export const metricsTracker = {
  getMetrics(): MetricsState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: MetricsState = JSON.parse(stored);
        // Garantizar migración suave de links antiguos sin sectionsVisited
        if (Array.isArray(parsed.trackedLinks)) {
          parsed.trackedLinks.forEach((l) => {
            if (!l.sectionsVisited) l.sectionsVisited = {};
            if (l.pageViews === undefined) l.pageViews = l.clicks;
          });
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading metrics from localStorage', e);
    }
    this.saveMetrics(INITIAL_METRICS_STATE);
    return INITIAL_METRICS_STATE;
  },

  saveMetrics(state: MetricsState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Error saving metrics to localStorage', e);
    }
  },

  recordPageView(route: string, searchParams?: URLSearchParams): MetricsState {
    // No registrar la ruta privada de métricas ni el login administrativo
    if (route === 'metricas' || route === 'admin') {
      return this.getMetrics();
    }

    const state = this.getMetrics();
    const isMobile = isMobileDevice();

    state.totalPageLoads += 1;
    state.lastVisitTimestamp = new Date().toISOString();

    // Rastrear por dispositivo global
    if (isMobile) {
      state.devices.mobile += 1;
    } else {
      state.devices.pc += 1;
    }

    // Comprobar nueva sesión
    try {
      if (typeof window !== 'undefined' && !sessionStorage.getItem('byfio_session_active')) {
        sessionStorage.setItem('byfio_session_active', '1');
        state.uniqueSessions += 1;
      }
    } catch {
      // Ignorar si sessionStorage no está disponible
    }

    // Rastrear apertura mediante enlace específico si existe ref/link/camp en URL
    const params = searchParams || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null);
    const refSlug = params ? (params.get('ref') || params.get('link') || params.get('c') || params.get('camp')) : null;

    let activeCampaignSlug: string | null = null;

    if (refSlug) {
      activeCampaignSlug = refSlug.toLowerCase().trim();
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('byfio_active_campaign_ref', activeCampaignSlug);
        }
      } catch (err) {
        console.warn(err);
      }

      const existingLinkIndex = state.trackedLinks.findIndex(
        (l) => l.slug.toLowerCase() === activeCampaignSlug
      );

      if (existingLinkIndex >= 0) {
        state.trackedLinks[existingLinkIndex].clicks += 1;
        state.trackedLinks[existingLinkIndex].pageViews = (state.trackedLinks[existingLinkIndex].pageViews || 0) + 1;
        if (isMobile) {
          state.trackedLinks[existingLinkIndex].mobileClicks += 1;
        } else {
          state.trackedLinks[existingLinkIndex].pcClicks += 1;
        }
        state.trackedLinks[existingLinkIndex].lastClickedAt = new Date().toISOString();
      } else {
        // Auto-crear link si viene un parámetro nuevo
        const newTrackedLink: TrackedLink = {
          id: `link-${Date.now()}`,
          name: `Enlace ref: ${activeCampaignSlug}`,
          slug: activeCampaignSlug,
          targetRoute: route === 'home' ? '/' : `/${route}`,
          targetLabel: route === 'home' ? 'Todo el Sitio Web' : route.toUpperCase(),
          clicks: 1,
          pageViews: 1,
          pcClicks: isMobile ? 0 : 1,
          mobileClicks: isMobile ? 1 : 0,
          sectionsVisited: {},
          createdAt: new Date().toISOString(),
          lastClickedAt: new Date().toISOString(),
        };
        state.trackedLinks.unshift(newTrackedLink);
      }
    } else {
      // Recuperar si el visitante ya traía un link rastreado en esta sesión
      try {
        if (typeof window !== 'undefined') {
          activeCampaignSlug = sessionStorage.getItem('byfio_active_campaign_ref');
        }
      } catch {
        // Ignorar
      }
    }

    // Registrar sección visitada
    const sectionKey = route || 'home';
    if (!state.sections[sectionKey]) {
      state.sections[sectionKey] = {
        views: 1,
        likes: 0,
        timeSpentAvgMinutes: 1.8,
      };
    } else {
      state.sections[sectionKey].views += 1;
    }

    // Vincular la navegación y sección visitada AL LINK ESPECÍFICO CREADO
    if (activeCampaignSlug) {
      const link = state.trackedLinks.find((l) => l.slug.toLowerCase() === activeCampaignSlug);
      if (link) {
        if (!link.sectionsVisited) link.sectionsVisited = {};
        if (!link.sectionsVisited[sectionKey]) {
          link.sectionsVisited[sectionKey] = {
            views: 1,
            likes: 0,
            timeSpentAvgMinutes: 1.8,
          };
        } else {
          link.sectionsVisited[sectionKey].views += 1;
        }
      }
    }

    this.saveMetrics(state);
    return state;
  },

  recordLike(sectionKey: string): MetricsState {
    const state = this.getMetrics();
    if (!state.sections[sectionKey]) {
      state.sections[sectionKey] = {
        views: 1,
        likes: 1,
        timeSpentAvgMinutes: 2.0,
      };
    } else {
      state.sections[sectionKey].likes += 1;
    }

    // Si viene de un link rastreado, sumar el like a ese link
    try {
      if (typeof window !== 'undefined') {
        const activeRef = sessionStorage.getItem('byfio_active_campaign_ref');
        if (activeRef) {
          const link = state.trackedLinks.find((l) => l.slug.toLowerCase() === activeRef);
          if (link && link.sectionsVisited && link.sectionsVisited[sectionKey]) {
            link.sectionsVisited[sectionKey].likes += 1;
          }
        }
      }
    } catch {
      // Ignorar
    }

    this.saveMetrics(state);
    return state;
  },

  createTrackedLink(name: string, targetRoute: string, targetLabel?: string, customSlug?: string): TrackedLink {
    const state = this.getMetrics();
    let slug = customSlug
      ? customSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '')
      : name.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '');

    if (!slug) slug = `link-${Date.now().toString(36)}`;

    // Evitar colisión de slugs
    let finalSlug = slug;
    let counter = 1;
    while (state.trackedLinks.some((l) => l.slug.toLowerCase() === finalSlug.toLowerCase())) {
      finalSlug = `${slug}-${counter}`;
      counter += 1;
    }

    const newLink: TrackedLink = {
      id: `link-${Date.now()}`,
      name: name.trim() || `Campaña ${finalSlug}`,
      slug: finalSlug,
      targetRoute: targetRoute || '/',
      targetLabel: targetLabel || 'Todo el Sitio Web',
      clicks: 0,
      pageViews: 0,
      pcClicks: 0,
      mobileClicks: 0,
      sectionsVisited: {},
      createdAt: new Date().toISOString(),
    };

    state.trackedLinks.unshift(newLink);
    this.saveMetrics(state);
    return newLink;
  },

  deleteTrackedLink(id: string): MetricsState {
    const state = this.getMetrics();
    state.trackedLinks = state.trackedLinks.filter((l) => l.id !== id);
    this.saveMetrics(state);
    return state;
  },

  resetLinkStats(id: string): MetricsState {
    const state = this.getMetrics();
    const link = state.trackedLinks.find((l) => l.id === id);
    if (link) {
      link.clicks = 0;
      link.pageViews = 0;
      link.pcClicks = 0;
      link.mobileClicks = 0;
      link.sectionsVisited = {};
      link.lastClickedAt = undefined;
    }
    this.saveMetrics(state);
    return state;
  },

  resetAllMetrics(): MetricsState {
    this.saveMetrics(INITIAL_METRICS_STATE);
    return INITIAL_METRICS_STATE;
  },
};
