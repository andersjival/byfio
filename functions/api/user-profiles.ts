interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
};

const sanitizeProfilesData = (profiles: any) => {
  if (!profiles) return [];
  const str = JSON.stringify(profiles)
    .replace(/ATENCI[\uFFFD]N/g, 'ATENCIÓN')
    .replace(/Atenci[\uFFFD]n/g, 'Atención')
    .replace(/atenci[\uFFFD]n/g, 'atención')
    .replace(/Tib[\uFFFD]s/g, 'Tibás')
    .replace(/tib[\uFFFD]s/g, 'tibás')
    .replace(/cat[\uFFFD]logo/g, 'catálogo')
    .replace(/Cat[\uFFFD]logo/g, 'Catálogo')
    .replace(/[\uFFFD]rdenes/g, 'órdenes')
    .replace(/[\uFFFD]rden/g, 'orden')
    .replace(/ci[\uFFFD]n/g, 'ción')
    .replace(/CI[\uFFFD]N/g, 'CIÓN')
    .replace(/[\uFFFD]/g, '');
  try {
    return JSON.parse(str);
  } catch {
    return profiles;
  }
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
      return new Response(JSON.stringify({ profiles: [] }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
    ).run().catch(() => {});

    const row: any = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'app_user_profiles' LIMIT 1"
    ).first();

    if (row && row.data) {
      const parsed = JSON.parse(row.data);
      if (Array.isArray(parsed)) {
        const clean = sanitizeProfilesData(parsed);
        return new Response(JSON.stringify({ profiles: clean }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ profiles: [] }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error fetching user profiles', profiles: [] }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const profiles = Array.isArray(body) ? body : (Array.isArray(body?.profiles) ? body.profiles : null);

    if (!profiles) {
      return new Response(
        JSON.stringify({ error: 'Formato inválido: se requiere arreglo de perfiles' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const cleanProfiles = sanitizeProfilesData(profiles);

    if (context.env.DB) {
      await context.env.DB.prepare(
        'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
      ).run().catch(() => {});

      await context.env.DB.prepare(
        "INSERT OR REPLACE INTO site_metrics (id, data, updated_at) VALUES ('app_user_profiles', ?, ?)"
      ).bind(JSON.stringify(cleanProfiles), new Date().toISOString()).run();
    }

    return new Response(
      JSON.stringify({ success: true, count: profiles.length }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error saving user profiles' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPut = onRequestPost;
