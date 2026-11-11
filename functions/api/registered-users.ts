interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
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
      return new Response(JSON.stringify({ users: [] }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
    ).run().catch(() => {});

    const row: any = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'app_registered_users' LIMIT 1"
    ).first();

    if (row && row.data) {
      const parsed = JSON.parse(row.data);
      if (Array.isArray(parsed)) {
        return new Response(JSON.stringify({ users: parsed }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ users: [] }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error fetching registered users', users: [] }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    
    // Obtener lista existente en D1
    let existingUsers: any[] = [];
    if (context.env.DB) {
      await context.env.DB.prepare(
        'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
      ).run().catch(() => {});

      const row: any = await context.env.DB.prepare(
        "SELECT data FROM site_metrics WHERE id = 'app_registered_users' LIMIT 1"
      ).first();

      if (row && row.data) {
        try {
          const parsed = JSON.parse(row.data);
          if (Array.isArray(parsed)) existingUsers = parsed;
        } catch {}
      }
    }

    // Identificar registros a incorporar
    let incomingUsers: any[] = [];
    if (body.user && typeof body.user === 'object') {
      incomingUsers = [body.user];
    } else if (Array.isArray(body.users)) {
      incomingUsers = body.users;
    } else if (Array.isArray(body)) {
      incomingUsers = body;
    }

    // Mapa por correo electrónico normalizado en minúsculas
    const usersMap = new Map<string, any>();
    for (const u of existingUsers) {
      if (u && u.email) {
        usersMap.set(String(u.email).trim().toLowerCase(), u);
      }
    }

    for (const u of incomingUsers) {
      if (u && u.email) {
        const cleanEmail = String(u.email).trim().toLowerCase();
        const prev = usersMap.get(cleanEmail) || {};
        usersMap.set(cleanEmail, {
          ...prev,
          ...u,
          email: cleanEmail,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    const merged = Array.from(usersMap.values());

    if (context.env.DB) {
      await context.env.DB.prepare(
        "INSERT OR REPLACE INTO site_metrics (id, data, updated_at) VALUES ('app_registered_users', ?, ?)"
      ).bind(JSON.stringify(merged), new Date().toISOString()).run();
    }

    return new Response(
      JSON.stringify({ success: true, count: merged.length, users: merged }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error saving registered users' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPut = onRequestPost;
