interface Env {
  AI?: any;
  AGENT_DB?: any;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

const MODEL_WHISPER = '@cf/openai/whisper';

export const onRequestOptions = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestGet = async () => {
  return new Response(
    JSON.stringify({ status: 'online', service: 'byfio-assistant-transcribe' }),
    { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
  );
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const audioBuffer = await context.request.arrayBuffer();
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Audio no recibido o vacío' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    if (!context.env.AI) {
      return new Response(
        JSON.stringify({ success: false, error: 'Motor de transcripción no disponible' }),
        { status: 503, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const uint8Array = new Uint8Array(audioBuffer);
    const result: any = await context.env.AI.run(MODEL_WHISPER, {
      audio: [...uint8Array],
    });

    const transcribedText = (result?.text || '').trim();

    if (context.env.AGENT_DB) {
      try {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const hourStr = String(now.getUTCHours()).padStart(2, '0');
        await context.env.AGENT_DB.prepare(
          'INSERT INTO agent_neuron_logs (id, date_str, hour_str, model, role, neurons, action_type) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)'
        ).bind(`nlog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, dateStr, hourStr, MODEL_WHISPER, 'user', 18.5, 'audio').run();
      } catch {}
    }

    return new Response(
      JSON.stringify({
        success: true,
        text: transcribedText,
      }),
      { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Error en transcripción' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
};
