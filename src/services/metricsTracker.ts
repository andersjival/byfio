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
      clicks: 540,
      pcClicks: 110,
      mobileClicks: 430,
      createdAt: '2026-10-15T10:00:00.000Z',
      lastClickedAt: '2026-10-30T10:20:00.000Z',
    },
    {
      id: 'link-2',
      name: 'Catálogo WhatsApp Clientes',
      slug: 'wa-catalogo',
      targetRoute: '/catalogo',
      clicks: 388,
      pcClicks: 48,
      mobileClicks: 340,
      createdAt: '2026-10-18T14:30:00.000Z',
      lastClickedAt: '2026-10-30T11:15:00.000Z',
    },
    {
      id: 'link-3',
      name: 'TikTok Enlace Perfil',
      slug: 'tiktok-bio',
      targetRoute: '/tienda',
      clicks: 295,
      pcClicks: 25,
      mobileClicks: 270,
      createdAt: '2026-10-20T09:00:00.000Z',
      lastClickedAt: '2026-10-29T18:40:00.000Z',
    },
    {
      id: 'link-4',
      name: 'Código QR Tarjetas y Taller',
      slug: 'qr-taller',
      targetRoute: '/talleres',
      clicks: 215,
      pcClicks: 18,
      mobileClicks: 197,
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
        return JSON.parse(stored);
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

    // Rastrear por dispositivo
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

    if (refSlug) {
      const cleanSlug = refSlug.toLowerCase().trim();
      const existingLinkIndex = state.trackedLinks.findIndex(
        (l) => l.slug.toLowerCase() === cleanSlug
      );

      if (existingLinkIndex >= 0) {
        state.trackedLinks[existingLinkIndex].clicks += 1;
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
          name: `Enlace ref: ${cleanSlug}`,
          slug: cleanSlug,
          targetRoute: route === 'home' ? '/' : `/${route}`,
          clicks: 1,
          pcClicks: isMobile ? 0 : 1,
          mobileClicks: isMobile ? 1 : 0,
          createdAt: new Date().toISOString(),
          lastClickedAt: new Date().toISOString(),
        };
        state.trackedLinks.unshift(newTrackedLink);
      }
    }

    // Rastrear sección
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
    this.saveMetrics(state);
    return state;
  },

  createTrackedLink(name: string, targetRoute: string, customSlug?: string): TrackedLink {
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
      clicks: 0,
      pcClicks: 0,
      mobileClicks: 0,
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
      link.pcClicks = 0;
      link.mobileClicks = 0;
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
