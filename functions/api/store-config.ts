interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

const KEY_MAP: Record<string, string> = {
  pricingData: 'app_pricing_data',
  sinpeSettings: 'app_sinpe_settings',
  customers: 'app_customers',
  customerFields: 'app_customer_fields',
  missingInventoryReports: 'app_missing_inventory_reports',
  inventoryMode: 'app_inventory_mode',
  siteDesignSettings: 'app_site_design_settings',
  catalogTaxonomies: 'app_catalog_taxonomies',
  calendarBlockedSpaces: 'app_calendar_blocked_spaces',
  aiSettings: 'app_ai_settings',
};

const ensureTable = async (db: any) => {
  await db.prepare(
    'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
  ).run().catch(() => {});
};

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env }) => {
  const emptyPayload: Record<string, any> = {};
  for (const field of Object.keys(KEY_MAP)) {
    emptyPayload[field] = null;
  }

  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify(emptyPayload), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    await ensureTable(context.env.DB);
    const ids = Object.values(KEY_MAP);
    const placeholders = ids.map(() => '?').join(', ');
    const { results } = await context.env.DB.prepare(
      `SELECT id, data FROM site_metrics WHERE id IN (${placeholders})`
    ).bind(...ids).all();

    const reverseMap = new Map<string, string>();
    for (const [field, dbId] of Object.entries(KEY_MAP)) {
      reverseMap.set(dbId, field);
    }

    const payload: Record<string, any> = { ...emptyPayload };
    for (const row of (results || []) as { id: string; data: string }[]) {
      const field = reverseMap.get(row.id);
      if (!field || !row.data) continue;
      try {
        payload[field] = JSON.parse(row.data);
      } catch {
        payload[field] = null;
      }
    }

    return new Response(JSON.stringify(payload), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ ...emptyPayload, error: error?.message }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = (await context.request.json().catch(() => ({}))) as Record<string, any>;
    const nowIso = new Date().toISOString();

    if (context.env.DB) {
      await ensureTable(context.env.DB);

      for (const [field, dbId] of Object.entries(KEY_MAP)) {
        if (body[field] !== undefined) {
          await context.env.DB.prepare(
            `INSERT INTO site_metrics (id, data, updated_at)
             VALUES (?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
          ).bind(dbId, JSON.stringify(body[field]), nowIso).run();
        }
      }
    }

    return new Response(JSON.stringify({ success: true, savedAt: nowIso }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Error saving store config' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};
