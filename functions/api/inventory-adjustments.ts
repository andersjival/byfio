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
      return new Response(
        JSON.stringify({ adjustments: [], collaboratorInventoryEnabled: false }),
        { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    await context.env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
    ).run().catch(() => {});

    // 1. Obtener registros de ajustes de inventario
    const rowAdj: any = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'app_inventory_adjustments' LIMIT 1"
    ).first();

    let adjustments: any[] = [];
    if (rowAdj && rowAdj.data) {
      try {
        const parsed = JSON.parse(rowAdj.data);
        if (Array.isArray(parsed)) adjustments = parsed;
      } catch {}
    }

    // 2. Obtener estado de activación del módulo para colaboradores
    const rowCollab: any = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'app_collaborator_inventory_enabled' LIMIT 1"
    ).first();

    let collaboratorInventoryEnabled = false;
    if (rowCollab && rowCollab.data) {
      try {
        collaboratorInventoryEnabled = Boolean(JSON.parse(rowCollab.data));
      } catch {}
    }

    // 2b. Obtener registros de Inventario por Barrido y modo de carga
    const rowSweepEntries: any = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'app_inventory_sweep_entries' LIMIT 1"
    ).first();

    let sweepEntries = [];
    if (rowSweepEntries && rowSweepEntries.data) {
      try {
        const parsed = JSON.parse(rowSweepEntries.data);
        if (Array.isArray(parsed)) sweepEntries = parsed;
      } catch {}
    }

    const rowSweepMode: any = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'app_sweep_load_mode' LIMIT 1"
    ).first();

    let sweepLoadMode: 'auto' | 'manual' = 'auto';
    if (rowSweepMode && rowSweepMode.data) {
      try {
        const parsed = JSON.parse(rowSweepMode.data);
        if (parsed === 'auto' || parsed === 'manual') sweepLoadMode = parsed;
      } catch {}
    }

    // 3. Obtener estados de estantes si existen
    const rowShelves: any = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'app_shelf_inventory_states' LIMIT 1"
    ).first();

    let shelfStates = {};
    if (rowShelves && rowShelves.data) {
      try {
        shelfStates = JSON.parse(rowShelves.data) || {};
      } catch {}
    }

    return new Response(
      JSON.stringify({ adjustments, collaboratorInventoryEnabled, shelfStates, sweepEntries, sweepLoadMode }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error fetching adjustments', adjustments: [], collaboratorInventoryEnabled: false, sweepEntries: [], sweepLoadMode: 'auto' }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const nowIso = new Date().toISOString();

    if (context.env.DB) {
      await context.env.DB.prepare(
        'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
      ).run().catch(() => {});

      // Guardar entradas de Inventario por Barrido
      if (body.sweepEntries !== undefined && Array.isArray(body.sweepEntries)) {
        await context.env.DB.prepare(
          'INSERT INTO site_metrics (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
        ).bind('app_inventory_sweep_entries', JSON.stringify(body.sweepEntries), nowIso).run();
      }

      // Guardar modo de carga de Inventario por Barrido (Automático vs Manual)
      if (body.sweepLoadMode === 'auto' || body.sweepLoadMode === 'manual') {
        await context.env.DB.prepare(
          'INSERT INTO site_metrics (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
        ).bind('app_sweep_load_mode', JSON.stringify(body.sweepLoadMode), nowIso).run();
      }

      // Guardar lista o adición de ajustes
      if (body.adjustments !== undefined) {
        await context.env.DB.prepare(
          'INSERT INTO site_metrics (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
        ).bind('app_inventory_adjustments', JSON.stringify(body.adjustments), nowIso).run();
      }

      // Guardar activación de colaboradores
      if (body.collaboratorInventoryEnabled !== undefined) {
        await context.env.DB.prepare(
          'INSERT INTO site_metrics (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
        ).bind('app_collaborator_inventory_enabled', JSON.stringify(Boolean(body.collaboratorInventoryEnabled)), nowIso).run();
      }

      // Guardar estados de estantería
      if (body.shelfStates !== undefined) {
        await context.env.DB.prepare(
          'INSERT INTO site_metrics (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
        ).bind('app_shelf_inventory_states', JSON.stringify(body.shelfStates), nowIso).run();
      }
    }

    return new Response(JSON.stringify({ success: true, savedAt: nowIso }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error saving adjustments' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
};
