interface Env {
  DB?: any;
  AGENT_DB?: any;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export const onRequestOptions = async () => new Response(null, { headers: CORS_HEADERS });

function getRetentionModifier(period: string): string | null {
  switch (period) {
    case '1h': return '-1 hours';
    case '6h': return '-6 hours';
    case '24h': return '-24 hours';
    case '3d': return '-3 days';
    case '7d': return '-7 days';
    case '30d': return '-30 days';
    default: return null;
  }
}

async function runAutoPurge(db: any, retentionPeriod: string) {
  const modifier = getRetentionModifier(retentionPeriod);
  if (!modifier) return 0;

  try {
    const res = await db.prepare(
      `DELETE FROM agent_messages WHERE conversation_id IN (
        SELECT id FROM agent_conversations WHERE datetime(updated_at) < datetime('now', ?1)
      )`
    ).bind(modifier).run();

    await db.prepare(
      `DELETE FROM agent_conversations WHERE datetime(updated_at) < datetime('now', ?1)`
    ).bind(modifier).run();

    return res?.meta?.changes || 0;
  } catch {
    return 0;
  }
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    const db = context.env.DB || context.env.AGENT_DB;
    if (!db) {
      return new Response(JSON.stringify({ success: false, error: 'Base de datos no disponible' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const url = new URL(context.request.url);
    const conversationId = url.searchParams.get('conversationId');
    const search = (url.searchParams.get('search') || '').trim();
    const role = url.searchParams.get('role'); // 'customer' | 'staff' | 'admin' | null
    const period = url.searchParams.get('period'); // 'today' | null

    // 1. Obtener configuración de retención de chats
    let chatRetentionPeriod = '7d';
    try {
      const cfgRow = await db.prepare("SELECT data FROM site_metrics WHERE id = 'app_ai_settings'").first();
      if (cfgRow && cfgRow.data) {
        const parsed = JSON.parse(cfgRow.data as string);
        if (parsed.chatRetentionPeriod) {
          chatRetentionPeriod = parsed.chatRetentionPeriod;
        }
      }
    } catch {}

    // 2. Ejecutar auto-purga si aplica
    if (chatRetentionPeriod !== 'never') {
      await runAutoPurge(db, chatRetentionPeriod);
    }

    // 3. Si se pide una conversación en específico con todos sus mensajes
    if (conversationId) {
      const conv = await db.prepare(
        'SELECT id, user_id, user_name, user_role, last_message, created_at, updated_at FROM agent_conversations WHERE id = ?1'
      ).bind(conversationId).first();

      const messagesRes = await db.prepare(
        'SELECT id, conversation_id, role, content, has_audio, created_at FROM agent_messages WHERE conversation_id = ?1 ORDER BY created_at ASC'
      ).bind(conversationId).all();

      return new Response(
        JSON.stringify({
          success: true,
          conversation: conv,
          messages: messagesRes.results || [],
          retentionPeriod: chatRetentionPeriod,
        }),
        { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // 4. Listar todas las conversaciones con filtros
    let sql = `
      SELECT 
        c.id, 
        c.user_id, 
        c.user_name, 
        c.user_role, 
        c.last_message, 
        c.created_at, 
        c.updated_at,
        COUNT(m.id) as message_count
      FROM agent_conversations c
      LEFT JOIN agent_messages m ON m.conversation_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      sql += ` AND (c.user_name LIKE ?${params.length - 2} OR c.user_id LIKE ?${params.length - 1} OR c.last_message LIKE ?${params.length})`;
    }

    if (role && role !== 'all') {
      params.push(role);
      sql += ` AND c.user_role = ?${params.length}`;
    }

    if (period === 'today') {
      sql += ` AND date(c.updated_at) = date('now')`;
    }

    sql += ` GROUP BY c.id ORDER BY c.updated_at DESC LIMIT 120`;

    const convRows = await db.prepare(sql).bind(...params).all();

    return new Response(
      JSON.stringify({
        success: true,
        conversations: convRows.results || [],
        retentionPeriod: chatRetentionPeriod,
        timestamp: new Date().toISOString(),
      }),
      { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error al obtener chats en vivo' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const db = context.env.DB || context.env.AGENT_DB;
    if (!db) {
      return new Response(JSON.stringify({ success: false, error: 'Base de datos no disponible' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const body = (await context.request.json().catch(() => ({}))) as any;
    const action = body?.action;

    // Acción A: Configurar período de retención / auto-borrado
    if (action === 'set_retention') {
      const period = body?.retentionPeriod || '7d';
      let prevSettings = {};
      try {
        const row = await db.prepare("SELECT data FROM site_metrics WHERE id = 'app_ai_settings'").first();
        if (row && row.data) prevSettings = JSON.parse(row.data as string);
      } catch {}

      const updated = {
        ...prevSettings,
        chatRetentionPeriod: period,
        updatedAt: new Date().toISOString(),
      };

      await db.prepare(
        "INSERT INTO site_metrics (id, data, updated_at) VALUES ('app_ai_settings', ?1, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET data = ?1, updated_at = CURRENT_TIMESTAMP"
      ).bind(JSON.stringify(updated)).run();

      // Si se definió un período inmediato, ejecutar purga
      if (period !== 'never') {
        await runAutoPurge(db, period);
      }

      return new Response(
        JSON.stringify({ success: true, retentionPeriod: period }),
        { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // Acción B: Purgar chats manualmente ahora
    if (action === 'purge_now') {
      const period = body?.retentionPeriod || '7d';
      const purgedCount = await runAutoPurge(db, period);
      return new Response(
        JSON.stringify({ success: true, purgedCount, retentionPeriod: period }),
        { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // Acción C: Eliminar conversación individual
    if (action === 'delete_conversation') {
      const conversationId = body?.conversationId;
      if (!conversationId) {
        return new Response(JSON.stringify({ success: false, error: 'ID de conversación requerido' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }

      await db.prepare('DELETE FROM agent_messages WHERE conversation_id = ?1').bind(conversationId).run();
      await db.prepare('DELETE FROM agent_conversations WHERE id = ?1').bind(conversationId).run();

      return new Response(
        JSON.stringify({ success: true, deletedId: conversationId }),
        { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    return new Response(JSON.stringify({ success: false, error: 'Acción no reconocida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error en live-chats' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
};
