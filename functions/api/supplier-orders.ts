interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ orders: [] }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
    ).run().catch(() => {});

    const [ordersRow, suppliersRow]: [any, any] = await Promise.all([
      context.env.DB.prepare("SELECT data FROM site_metrics WHERE id = 'app_supplier_orders' LIMIT 1").first(),
      context.env.DB.prepare("SELECT data FROM site_metrics WHERE id = 'app_suppliers' LIMIT 1").first(),
    ]);

    const orders = ordersRow?.data ? JSON.parse(ordersRow.data) : [];
    const suppliers = suppliersRow?.data ? JSON.parse(suppliersRow.data) : [];

    return new Response(
      JSON.stringify({
        orders: Array.isArray(orders) ? orders : [],
        suppliers: Array.isArray(suppliers) ? suppliers : [],
      }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error fetching supplier orders', orders: [] }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const orders = Array.isArray(body) ? body : (Array.isArray(body?.orders) ? body.orders : null);
    const suppliers = Array.isArray(body?.suppliers) ? body.suppliers : null;

    if (!orders && !suppliers) {
      return new Response(
        JSON.stringify({ error: 'Formato inválido. Se esperaba orders o suppliers.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    if (!context.env.DB) {
      return new Response(JSON.stringify({ success: true, localOnly: true, orders: orders || [], suppliers: suppliers || [] }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
    ).run().catch(() => {});

    const now = new Date().toISOString();
    if (orders) {
      await context.env.DB.prepare(
        `INSERT INTO site_metrics (id, data, updated_at)
         VALUES ('app_supplier_orders', ?, ?)
         ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
      ).bind(JSON.stringify(orders), now).run();
    }
    if (suppliers) {
      await context.env.DB.prepare(
        `INSERT INTO site_metrics (id, data, updated_at)
         VALUES ('app_suppliers', ?, ?)
         ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
      ).bind(JSON.stringify(suppliers), now).run();
    }

    return new Response(
      JSON.stringify({ success: true, count: orders?.length ?? suppliers?.length ?? 0 }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error saving supplier orders' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};
