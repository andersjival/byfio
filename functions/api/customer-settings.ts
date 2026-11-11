interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const clampVip = (val: unknown): number => {
  const num = Math.floor(Number(val));
  if (!Number.isFinite(num) || num < 1) return 3;
  return Math.min(999, num);
};

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ vipMinPurchases: 3 }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
    ).run().catch(() => {});

    const row: any = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'app_customer_vip_min' LIMIT 1"
    ).first();

    const parsed = row?.data ? JSON.parse(row.data) : null;
    const vipMinPurchases = clampVip(parsed?.vipMinPurchases ?? parsed ?? 3);

    return new Response(JSON.stringify({ vipMinPurchases }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ vipMinPurchases: 3, error: error?.message || 'Error loading customer settings' }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const vipMinPurchases = clampVip(body?.vipMinPurchases);

    if (context.env.DB) {
      await context.env.DB.prepare(
        'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
      ).run().catch(() => {});

      const nowIso = new Date().toISOString();
      await context.env.DB.prepare(
        'INSERT INTO site_metrics (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
      ).bind('app_customer_vip_min', JSON.stringify({ vipMinPurchases }), nowIso).run();
    }

    return new Response(JSON.stringify({ success: true, vipMinPurchases }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Error saving customer settings' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};
