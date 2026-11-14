interface Env {
  DB?: any;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

const DEFAULT_CONFIG = {
  stockDisclosureMode: 'availability_only',
  agentName: 'Estrellita',
  welcomeMessage:
    '¡Hola! ✨🌸 Soy la Estrellita de by.fio. Estoy aquí para contarte si tenemos productos en stock, fechas de talleres o ayudarte con lo que necesites.',
  customInstructions: '',
  isEnabled: true,
  // 1. Parámetros Técnicos del Modelo
  temperature: 0.3, // 0.1 a 0.4
  topP: 0.85,
  topK: 40,
  maxTokens: 200, // 60 a 250 tokens por mensaje corto
  securityFilters: true,
  // 2. Instrucciones de Sistema y Directrices
  agentRoleTone:
    'Asesora amable, ágil, profesional, cercana y cálida, sin sonar corporativa o robótica. Trato tierno, dulce y kawaii (✨, 🌸, 💖).',
  lengthStructure:
    'Responder en frases cortas, directas y al grano, sin párrafos extensos ni bloques pesados de texto.',
  strictBlacklist:
    '• Prohibido decir que es una IA, un bot o un modelo de lenguaje.\n• Prohibido prometer descuentos o condiciones que no estén en el catálogo.\n• Prohibido hablar de competidores o temas fuera del negocio.\n• Prohibido usar frases de relleno ("¡Excelente pregunta!", "Con mucho gusto te asisto", "¿Hay algo más en lo que te pueda colaborar hoy?").',
  escapeProtocol:
    'Solo derivar a Fiorella (WhatsApp oficial 6400-4640) cuando el cliente lo pida expresamente ("quiero hablar con un humano / Fiorella") o si requiere un encargo personalizado fuera de catálogo. Si el producto o cantidad consultada existe en inventario, o si el cliente desea pagar por SINPE, o si aclara que NO quiere hablar con nadie más, atiéndelo y concreta la compra directamente aquí sin derivarlo a WhatsApp.',
  systemPromptOverride: '',
  // 3. Simulación humana y tiempos
  enableHumanSimulation: true,
  enableChunking: true,
  delayType: 'dynamic',
  responseChunkSeparator: '|||',
  maxResponseChunks: 3,
  initialDelayMs: 2500,
  initialDelayMinMs: 2000,
  initialDelayMaxMs: 3500,
  msPerChar: 40, // 30 a 50 ms por carácter
  delayMarginMs: 1200, // 1000 a 2000 ms
  updatedAt: new Date().toISOString(),
};

export const onRequestOptions = async () => new Response(null, { headers: CORS_HEADERS });

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify(DEFAULT_CONFIG), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    await context.env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
    ).run().catch(() => {});

    const row = await context.env.DB.prepare(
      "SELECT data FROM site_metrics WHERE id = 'app_ai_settings'"
    ).first();

    if (row && row.data) {
      let parsed = {};
      try {
        parsed = JSON.parse(row.data as string);
      } catch {}
      return new Response(JSON.stringify({ ...DEFAULT_CONFIG, ...parsed }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    return new Response(JSON.stringify(DEFAULT_CONFIG), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ...DEFAULT_CONFIG, error: err?.message }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = (await context.request.json().catch(() => ({}))) as Record<string, any>;
    const nowIso = new Date().toISOString();

    // Obtener configuración previa para mezclar
    let previousConfig = { ...DEFAULT_CONFIG };
    if (context.env.DB) {
      await context.env.DB.prepare(
        'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
      ).run().catch(() => {});

      const row = await context.env.DB.prepare(
        "SELECT data FROM site_metrics WHERE id = 'app_ai_settings'"
      ).first();
      if (row && row.data) {
        try {
          previousConfig = { ...previousConfig, ...JSON.parse(row.data as string) };
        } catch {}
      }
    }

    const updatedConfig = {
      ...previousConfig,
      ...body,
      updatedAt: nowIso,
    };

    if (context.env.DB) {
      await context.env.DB.prepare(
        `INSERT INTO site_metrics (id, data, updated_at)
         VALUES ('app_ai_settings', ?, ?)
         ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
      ).bind(JSON.stringify(updatedConfig), nowIso).run();
    }

    return new Response(JSON.stringify({ success: true, config: updatedConfig }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
};
