// CLOUDFLARE PAGES FUNCTION: /api/metrics
// Sincronización Global de Métricas en Tiempo Real con Cloudflare D1

interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

const DEFAULT_SECTIONS_INITIAL: Record<string, { views: number; likes: number; timeSpentAvgMinutes: number }> = {
  home: { views: 1842, likes: 242, timeSpentAvgMinutes: 2.5 },
  catalogo: { views: 1420, likes: 318, timeSpentAvgMinutes: 4.2 },
  store: { views: 1180, likes: 294, timeSpentAvgMinutes: 3.8 },
  workshops: { views: 890, likes: 205, timeSpentAvgMinutes: 3.1 },
  precios: { views: 670, likes: 168, timeSpentAvgMinutes: 2.1 },
  'workshop-detail': { views: 430, likes: 112, timeSpentAvgMinutes: 2.9 },
  login: { views: 320, likes: 62, timeSpentAvgMinutes: 1.5 },
  admin: { views: 560, likes: 148, timeSpentAvgMinutes: 5.8 },
  'admin-billing': { views: 420, likes: 115, timeSpentAvgMinutes: 6.9 },
  'admin-orders': { views: 390, likes: 96, timeSpentAvgMinutes: 6.1 },
  'admin-inventory': { views: 345, likes: 88, timeSpentAvgMinutes: 4.7 },
  'admin-reports': { views: 295, likes: 78, timeSpentAvgMinutes: 5.2 },
  'admin-workshops': { views: 265, likes: 68, timeSpentAvgMinutes: 3.9 },
  'admin-pricing': { views: 215, likes: 52, timeSpentAvgMinutes: 3.4 },
  'admin-users': { views: 185, likes: 45, timeSpentAvgMinutes: 2.9 },
  metricas: { views: 170, likes: 58, timeSpentAvgMinutes: 4.2 },
  propuesta: { views: 95, likes: 34, timeSpentAvgMinutes: 3.5 },
};

const getInitialMetricsState = () => ({
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
        'admin-billing': { views: 65, likes: 18, timeSpentAvgMinutes: 4.1 },
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
  sections: DEFAULT_SECTIONS_INITIAL,
  lastVisitTimestamp: new Date().toISOString(),
});

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify(getInitialMetricsState()), {
        headers: CORS_HEADERS,
      });
    }

    const row: any = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'global_metrics' LIMIT 1"
    ).first();

    if (row && row.data) {
      const parsed = JSON.parse(row.data);
      return new Response(JSON.stringify(parsed), {
        headers: CORS_HEADERS,
      });
    }

    // Inicializar estado en D1 si está vacío
    const initial = getInitialMetricsState();
    await context.env.DB.prepare(
      "INSERT OR REPLACE INTO site_metrics (id, data, updated_at) VALUES ('global_metrics', ?, ?)"
    ).bind(JSON.stringify(initial), new Date().toISOString()).run();

    return new Response(JSON.stringify(initial), {
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error fetching metrics', fallback: getInitialMetricsState() }),
      { status: 200, headers: CORS_HEADERS }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const action = body?.action || 'record_visit';

    let currentState: any = null;

    if (context.env.DB) {
      const row: any = await context.env.DB.prepare(
        "SELECT data FROM site_metrics WHERE id = 'global_metrics' LIMIT 1"
      ).first();
      if (row && row.data) {
        try {
          currentState = JSON.parse(row.data);
        } catch {
          currentState = null;
        }
      }
    }

    if (!currentState) {
      currentState = getInitialMetricsState();
    }

    // Asegurar estructura
    if (!currentState.sections) currentState.sections = { ...DEFAULT_SECTIONS_INITIAL };
    if (!currentState.devices) currentState.devices = { pc: 0, mobile: 0 };
    if (!Array.isArray(currentState.trackedLinks)) currentState.trackedLinks = [];

    if (action === 'record_visit') {
      const { slug, route, isMobile, isNewSession } = body;
      currentState.totalPageLoads = (currentState.totalPageLoads || 0) + 1;
      currentState.lastVisitTimestamp = new Date().toISOString();

      if (isMobile) {
        currentState.devices.mobile = (currentState.devices.mobile || 0) + 1;
      } else {
        currentState.devices.pc = (currentState.devices.pc || 0) + 1;
      }

      if (isNewSession) {
        currentState.uniqueSessions = (currentState.uniqueSessions || 0) + 1;
      }

      const secKey = route || 'home';
      if (!currentState.sections[secKey]) {
        currentState.sections[secKey] = { views: 1, likes: 0, timeSpentAvgMinutes: 2.0 };
      } else {
        currentState.sections[secKey].views += 1;
      }

      if (slug) {
        const cleanSlug = String(slug).toLowerCase().trim();
        let targetLink = currentState.trackedLinks.find(
          (l: any) => l.slug && l.slug.toLowerCase() === cleanSlug
        );

        if (targetLink) {
          targetLink.clicks = (targetLink.clicks || 0) + 1;
          targetLink.pageViews = (targetLink.pageViews || 0) + 1;
          if (isMobile) {
            targetLink.mobileClicks = (targetLink.mobileClicks || 0) + 1;
          } else {
            targetLink.pcClicks = (targetLink.pcClicks || 0) + 1;
          }
          targetLink.lastClickedAt = new Date().toISOString();

          if (!targetLink.sectionsVisited) targetLink.sectionsVisited = {};
          if (!targetLink.sectionsVisited[secKey]) {
            targetLink.sectionsVisited[secKey] = { views: 1, likes: 0, timeSpentAvgMinutes: 2.0 };
          } else {
            targetLink.sectionsVisited[secKey].views += 1;
          }
        } else {
          // Si el enlace aún no estaba en la base global, registrarlo de inmediato
          const newTrackedLink = {
            id: `link-${Date.now()}`,
            name: `Enlace ref: ${cleanSlug}`,
            slug: cleanSlug,
            targetRoute: secKey === 'home' ? '/' : `/${secKey}`,
            targetLabel: secKey === 'home' ? 'Todo el Sitio Web' : secKey.toUpperCase(),
            clicks: 1,
            pageViews: 1,
            pcClicks: isMobile ? 0 : 1,
            mobileClicks: isMobile ? 1 : 0,
            sectionsVisited: {
              [secKey]: { views: 1, likes: 0, timeSpentAvgMinutes: 2.0 },
            },
            createdAt: new Date().toISOString(),
            lastClickedAt: new Date().toISOString(),
          };
          currentState.trackedLinks.unshift(newTrackedLink);
        }
      }
    } else if (action === 'create_link') {
      const newLink = body.link;
      if (newLink && newLink.slug) {
        const existingIdx = currentState.trackedLinks.findIndex(
          (l: any) => l.slug && l.slug.toLowerCase() === newLink.slug.toLowerCase()
        );
        if (existingIdx >= 0) {
          currentState.trackedLinks[existingIdx] = {
            ...currentState.trackedLinks[existingIdx],
            ...newLink,
          };
        } else {
          currentState.trackedLinks.unshift(newLink);
        }
      }
    } else if (action === 'delete_link') {
      const linkId = body.id;
      if (linkId) {
        currentState.trackedLinks = currentState.trackedLinks.filter((l: any) => l.id !== linkId);
      }
    } else if (action === 'reset_link') {
      const linkId = body.id;
      const targetLink = currentState.trackedLinks.find((l: any) => l.id === linkId);
      if (targetLink) {
        targetLink.clicks = 0;
        targetLink.pageViews = 0;
        targetLink.pcClicks = 0;
        targetLink.mobileClicks = 0;
        targetLink.sectionsVisited = {};
        targetLink.lastClickedAt = undefined;
      }
    } else if (action === 'sync_state' && body.state) {
      currentState = { ...currentState, ...body.state };
    }

    if (context.env.DB) {
      await context.env.DB.prepare(
        "INSERT OR REPLACE INTO site_metrics (id, data, updated_at) VALUES ('global_metrics', ?, ?)"
      ).bind(JSON.stringify(currentState), new Date().toISOString()).run();
    }

    return new Response(JSON.stringify({ success: true, metrics: currentState }), {
      headers: CORS_HEADERS,
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};
