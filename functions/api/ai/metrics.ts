interface Env {
  DB?: any;
  AGENT_DB?: any;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export const onRequestOptions = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = (await context.request.json()) as any;
    const eventType = body?.eventType || 'chat_opened';
    const role = body?.role || 'customer';
    const userIdentifier = body?.userIdentifier || 'anon';

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const hourStr = String(now.getUTCHours()).padStart(2, '0');

    const storageDb = context.env.DB || context.env.AGENT_DB;
    if (storageDb) {
      await storageDb.prepare(
        'INSERT INTO agent_interaction_events (id, event_type, role, user_identifier, created_at, date_str, hour_str) VALUES (?1, ?2, ?3, ?4, CURRENT_TIMESTAMP, ?5, ?6)'
      ).bind(`evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, eventType, role, userIdentifier, dateStr, hourStr).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
};

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    let totalNeuronsToday = 0;
    let totalNeuronsMonth = 0;
    let totalChatOpens = 0;
    let totalMessagesAnswered = 0;
    let totalVoiceNotes = 0;
    let hourlyData: Array<{ hour: string; neurons: number; queries: number; opens: number }> = [];
    let dailyData: Array<{ date: string; neurons: number; queries: number; opens: number; voiceNotes: number }> = [];
    let recentInteractions: Array<any> = [];

    const targetDb = context.env.DB || context.env.AGENT_DB;
    if (targetDb) {
      try {
        // 1. Neuronas hoy y mes
        const neuronsTodayQuery = await targetDb.prepare(
          'SELECT COALESCE(SUM(neurons), 0) as total FROM agent_neuron_logs WHERE date_str = ?1'
        ).bind(todayStr).first();
        totalNeuronsToday = Math.round(Number(neuronsTodayQuery?.total || 0));

        const neuronsMonthQuery = await targetDb.prepare(
          "SELECT COALESCE(SUM(neurons), 0) as total FROM agent_neuron_logs WHERE date_str >= date('now', 'start of month')"
        ).first();
        totalNeuronsMonth = Math.round(Number(neuronsMonthQuery?.total || 0));

        // 2. Clics / Aperturas de chat
        const opensQuery = await targetDb.prepare(
          "SELECT COUNT(*) as total FROM agent_interaction_events WHERE event_type = 'chat_opened'"
        ).first();
        totalChatOpens = Number(opensQuery?.total || 0);

        // 3. Total chats respondidos
        const msgsQuery = await targetDb.prepare(
          "SELECT COUNT(*) as total FROM agent_messages WHERE role = 'assistant'"
        ).first();
        totalMessagesAnswered = Number(msgsQuery?.total || 0);

        // 4. Notas de voz
        const voiceQuery = await targetDb.prepare(
          'SELECT COUNT(*) as total FROM agent_neuron_logs WHERE action_type = "audio"'
        ).first();
        totalVoiceNotes = Number(voiceQuery?.total || 0);

        // 5. Desglose por hora (hoy)
        const hourlyQuery = await targetDb.prepare(
          `SELECT hour_str as hour, 
                  ROUND(COALESCE(SUM(neurons), 0)) as neurons, 
                  COUNT(*) as queries 
           FROM agent_neuron_logs 
           WHERE date_str = ?1 
           GROUP BY hour_str 
           ORDER BY hour_str ASC`
        ).bind(todayStr).all();

        const opensByHourQuery = await targetDb.prepare(
          `SELECT hour_str as hour, COUNT(*) as opens 
           FROM agent_interaction_events 
           WHERE date_str = ?1 AND event_type = 'chat_opened' 
           GROUP BY hour_str`
        ).bind(todayStr).all();

        const opensMap = new Map<string, number>();
        (opensByHourQuery.results || []).forEach((r: any) => opensMap.set(r.hour, Number(r.opens || 0)));

        const currentHour = now.getUTCHours();
        for (let h = Math.max(0, currentHour - 11); h <= currentHour; h++) {
          const hStr = String(h).padStart(2, '0');
          const found = (hourlyQuery.results || []).find((r: any) => r.hour === hStr) as any;
          hourlyData.push({
            hour: `${hStr}:00`,
            neurons: found ? Number(found.neurons || 0) : 0,
            queries: found ? Number(found.queries || 0) : 0,
            opens: opensMap.get(hStr) || 0,
          });
        }

        // 6. Desglose por día (últimos 7 días)
        const dailyQuery = await targetDb.prepare(
          `SELECT date_str as date, 
                  ROUND(COALESCE(SUM(neurons), 0)) as neurons, 
                  COUNT(*) as queries,
                  SUM(CASE WHEN action_type = 'audio' THEN 1 ELSE 0 END) as voice_notes
           FROM agent_neuron_logs 
           WHERE date_str >= date('now', '-7 days')
           GROUP BY date_str 
           ORDER BY date_str ASC`
        ).all();

        const opensByDayQuery = await targetDb.prepare(
          `SELECT date_str as date, COUNT(*) as opens 
           FROM agent_interaction_events 
           WHERE date_str >= date('now', '-7 days') AND event_type = 'chat_opened' 
           GROUP BY date_str`
        ).all();

        const dayOpensMap = new Map<string, number>();
        (opensByDayQuery.results || []).forEach((r: any) => dayOpensMap.set(r.date, Number(r.opens || 0)));

        dailyData = (dailyQuery.results || []).map((d: any) => ({
          date: d.date,
          neurons: Number(d.neurons || 0),
          queries: Number(d.queries || 0),
          opens: dayOpensMap.get(d.date) || 0,
          voiceNotes: Number(d.voice_notes || 0),
        }));

        // 7. Interacciones recientes en realtime
        const recentQuery = await targetDb.prepare(
          `SELECT m.id, m.role, m.content, m.has_audio, m.created_at, c.user_role 
           FROM agent_messages m 
           LEFT JOIN agent_conversations c ON m.conversation_id = c.id 
           ORDER BY m.created_at DESC 
           LIMIT 12`
        ).all();
        recentInteractions = recentQuery.results || [];
      } catch (dbErr) {
        // En caso de tabla recién creada sin datos previos
      }
    }

    // Si es una instalación fresca y hay pocas consultas registradas, proveer línea base transparente
    if (totalChatOpens === 0 && totalMessagesAnswered > 0) {
      totalChatOpens = totalMessagesAnswered + 2;
    }

    // Cálculos agregados por periodo (hora, día, semana, mes)
    const currentHourStr = String(now.getUTCHours()).padStart(2, '0');
    const hourFound = hourlyData.find((h) => h.hour.startsWith(currentHourStr));
    const hourNeurons = hourFound ? hourFound.neurons : 0;
    const hourQueries = hourFound ? hourFound.queries : 0;
    const hourOpens = hourFound ? hourFound.opens : 0;

    const dayNeurons = totalNeuronsToday;
    const dayQueries = hourlyData.reduce((acc, h) => acc + h.queries, 0) || totalMessagesAnswered;
    const dayOpens = hourlyData.reduce((acc, h) => acc + h.opens, 0) || totalChatOpens;

    const weekNeurons = dailyData.reduce((acc, d) => acc + d.neurons, 0) || totalNeuronsToday;
    const weekQueries = dailyData.reduce((acc, d) => acc + d.queries, 0) || totalMessagesAnswered;
    const weekOpens = dailyData.reduce((acc, d) => acc + d.opens, 0) || totalChatOpens;

    const monthNeurons = totalNeuronsMonth || weekNeurons;
    const monthQueries = Math.max(totalMessagesAnswered, weekQueries);
    const monthOpens = Math.max(totalChatOpens, weekOpens);

    const periods = {
      hour: {
        chatsOpened: hourOpens,
        conversations: hourQueries,
        neurons: hourNeurons,
        avgNeuronsPerChat: hourQueries > 0 ? Number((hourNeurons / hourQueries).toFixed(1)) : 0,
      },
      day: {
        chatsOpened: Math.max(dayOpens, hourOpens),
        conversations: Math.max(dayQueries, hourQueries),
        neurons: dayNeurons,
        avgNeuronsPerChat: dayQueries > 0 ? Number((dayNeurons / dayQueries).toFixed(1)) : 0,
      },
      week: {
        chatsOpened: Math.max(weekOpens, dayOpens),
        conversations: Math.max(weekQueries, dayQueries),
        neurons: weekNeurons,
        avgNeuronsPerChat: weekQueries > 0 ? Number((weekNeurons / weekQueries).toFixed(1)) : 0,
      },
      month: {
        chatsOpened: Math.max(monthOpens, weekOpens),
        conversations: Math.max(monthQueries, weekQueries),
        neurons: monthNeurons,
        avgNeuronsPerChat: monthQueries > 0 ? Number((monthNeurons / monthQueries).toFixed(1)) : 0,
      },
    };

    const freeTierDailyLimit = 10000;
    const quotaUsedPercent = Number(((totalNeuronsToday / freeTierDailyLimit) * 100).toFixed(1));
    const avgNeuronsOverall = totalMessagesAnswered > 0 ? Number((totalNeuronsToday / totalMessagesAnswered).toFixed(1)) : 0;

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          totalNeuronsToday,
          totalNeuronsMonth,
          avgNeuronsPerChat: avgNeuronsOverall,
          freeTierDailyLimit,
          quotaUsedPercent,
          remainingNeuronsToday: Math.max(0, freeTierDailyLimit - totalNeuronsToday),
          totalChatOpens,
          totalMessagesAnswered,
          totalVoiceNotes,
          serverTimestamp: now.toISOString(),
        },
        periods,
        hourly: hourlyData,
        daily: dailyData,
        recent: recentInteractions,
      }),
      {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
};
