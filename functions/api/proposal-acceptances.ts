interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
      return new Response(JSON.stringify({ acceptances: null }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
    ).run().catch(() => {});

    const row: any = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'app_proposal_acceptances' LIMIT 1"
    ).first();

    if (row && row.data) {
      const parsed = JSON.parse(row.data);
      if (Array.isArray(parsed)) {
        return new Response(JSON.stringify({ acceptances: parsed }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ acceptances: [] }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error fetching proposal acceptances', acceptances: [] }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const acceptances = Array.isArray(body)
      ? body
      : (Array.isArray(body?.acceptances) ? body.acceptances : null);

    if (!acceptances || !Array.isArray(acceptances)) {
      return new Response(
        JSON.stringify({ error: 'Formato inválido. Se esperaba un array de aceptaciones.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    if (!context.env.DB) {
      return new Response(JSON.stringify({ success: true, localOnly: true }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
    ).run().catch(() => {});

    await context.env.DB.prepare(
      `INSERT INTO site_metrics (id, data, updated_at)
       VALUES ('app_proposal_acceptances', ?, ?)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
    ).bind(JSON.stringify(acceptances), new Date().toISOString()).run();

    return new Response(JSON.stringify({ success: true, count: acceptances.length }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error saving proposal acceptances' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};
