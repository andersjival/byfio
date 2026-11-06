interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function deduplicateAgendaItems(items: any[]): any[] {
  if (!Array.isArray(items)) return [];
  const seenIds = new Set<string>();
  const seenContent = new Set<string>();
  const result: any[] = [];

  for (const item of items) {
    if (!item) continue;
    const id = item.id ? String(item.id).trim() : '';
    const title = (item.title || '').trim().toLowerCase();
    const date = (item.date || '').trim();
    const contentKey = `${title}:::${date}`;

    if (id && seenIds.has(id)) continue;
    if (title && seenContent.has(contentKey)) continue;

    if (id) seenIds.add(id);
    if (title) seenContent.add(contentKey);
    result.push(item);
  }
  return result;
}

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ items: [] }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
    ).run().catch(() => {});

    const row: any = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'app_agenda_items' LIMIT 1"
    ).first();

    if (row && row.data) {
      const parsed = JSON.parse(row.data);
      if (Array.isArray(parsed)) {
        const cleanItems = deduplicateAgendaItems(parsed);
        return new Response(JSON.stringify({ items: cleanItems }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ items: [] }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error fetching agenda items', items: [] }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const rawItems = Array.isArray(body) ? body : (Array.isArray(body?.items) ? body.items : null);

    if (!rawItems || !Array.isArray(rawItems)) {
      return new Response(
        JSON.stringify({ error: 'Formato inválido. Se esperaba un array de items de agenda.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const items = deduplicateAgendaItems(rawItems);

    if (!context.env.DB) {
      return new Response(JSON.stringify({ success: true, localOnly: true, items }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
    ).run().catch(() => {});

    await context.env.DB.prepare(
      `INSERT INTO site_metrics (id, data, updated_at)
       VALUES ('app_agenda_items', ?, ?)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
    ).bind(JSON.stringify(items), new Date().toISOString()).run();

    return new Response(JSON.stringify({ success: true, count: items.length }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error saving agenda items' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};
