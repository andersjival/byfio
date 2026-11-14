export interface Env {
  AI: any;
  AGENT_DB: D1Database;
  STORE_DB: D1Database;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

// Modelos según perfil
const MODEL_CUSTOMER = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const MODEL_CUSTOMER_FALLBACK = '@cf/meta/llama-3.1-8b-instruct-fp8';
const MODEL_STAFF = '@cf/google/gemma-4-26b-a4b-it';
const MODEL_STAFF_FALLBACK = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const MODEL_WHISPER = '@cf/openai/whisper';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === '/' || url.pathname === '/health') {
      return jsonResponse({
        status: 'online',
        service: 'byfio-assistant-engine',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });
    }

    try {
      // 1. Endpoint de Transcripción de Audio
      if (url.pathname === '/api/transcribe' && request.method === 'POST') {
        const audioBuffer = await request.arrayBuffer();
        if (!audioBuffer || audioBuffer.byteLength === 0) {
          return jsonResponse({ success: false, error: 'Audio vacío o no recibido' }, 400);
        }

        try {
          const uint8Array = new Uint8Array(audioBuffer);
          const transcription: any = await env.AI.run(MODEL_WHISPER, {
            audio: [...uint8Array],
          });

          return jsonResponse({
            success: true,
            text: (transcription?.text || '').trim(),
          });
        } catch (whisperErr: any) {
          return jsonResponse(
            { success: false, error: 'Inconveniente al procesar audio', detail: whisperErr?.message },
            500
          );
        }
      }

      // 2. Endpoint de Chat / Consulta del Asistente
      if (url.pathname === '/api/chat' && request.method === 'POST') {
        const body: any = await request.json();
        const message: string = (body?.message || '').trim();
        const role: 'customer' | 'staff' | 'admin' = body?.role === 'staff' || body?.role === 'admin' ? body.role : 'customer';
        const rawHistory: Array<{ role: 'user' | 'assistant'; content: string }> = Array.isArray(body?.history) ? body.history : [];
        const userName: string = (body?.userName || '').trim();
        const conversationId = body?.conversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        if (!message) {
          return jsonResponse({ success: false, error: 'Mensaje requerido' }, 400);
        }

        let aiConfig = {
          stockDisclosureMode: 'availability_only',
          isEnabled: true,
          customInstructions: '',
        };

        if (env.STORE_DB) {
          try {
            const cfgRow = await env.STORE_DB.prepare(
              "SELECT data FROM site_metrics WHERE id = 'app_ai_settings'"
            ).first();
            if (cfgRow && cfgRow.data) {
              aiConfig = { ...aiConfig, ...JSON.parse(cfgRow.data as string) };
            }
          } catch {}
        }

        if (body?.stockDisclosureMode === 'full_stock' || body?.stockDisclosureMode === 'availability_only') {
          aiConfig.stockDisclosureMode = body.stockDisclosureMode;
        }

        // Obtener inventario en tiempo real de STORE_DB (solo lectura)
        let inventoryContext = 'Catálogo actual en tienda:\n';
        try {
          const productsQuery = await env.STORE_DB.prepare(
            'SELECT id, name, category, price, stock FROM products WHERE is_active = 1 LIMIT 80'
          ).all();
          const items = (productsQuery.results || []) as Array<{ id: string; name: string; category: string; price: number; stock: number }>;
          if (items.length > 0) {
            inventoryContext += items
              .map((p) => `- ${p.name} (Categoría: ${p.category || 'General'}, Precio: ₡${Number(p.price || 0).toLocaleString('es-CR')}, Stock disponible: ${p.stock ?? 0} unidades)`)
              .join('\n');
          } else {
            inventoryContext += 'No hay productos activos listados en este instante.\n';
          }
        } catch (e: any) {
          inventoryContext += 'Consulta de productos en catálogo general activa.\n';
        }

        let workshopsContext = '\nTalleres activos:\n';
        try {
          const wsQuery = await env.STORE_DB.prepare(
            'SELECT id, title, price, spots_total, spots_taken, date FROM workshops WHERE is_active = 1 LIMIT 20'
          ).all();
          const workshops = (wsQuery.results || []) as Array<{ id: string; title: string; price: number; spots_total: number; spots_taken: number; date: string }>;
          if (workshops.length > 0) {
            workshopsContext += workshops
              .map((w) => {
                const total = w.spots_total || 0;
                const taken = w.spots_taken || 0;
                const available = Math.max(0, total - taken);
                return `- ${w.title} (Fecha: ${w.date || 'Por confirmar'}, Precio: ₡${Number(w.price || 0).toLocaleString('es-CR')}, Cupos libres: ${available} de ${total})`;
              })
              .join('\n');
          } else {
            workshopsContext += 'No hay talleres activos actualmente.\n';
          }
        } catch (e: any) {
          workshopsContext += '';
        }

        // Prompts del Sistema según el Rol
        let systemPrompt = '';
        if (role === 'staff' || role === 'admin') {
          systemPrompt = `Eres la Estrellita de by.fio en modo Asistente de Colaboradoras y Administración.
Tu propósito es dar respuestas directas, rápidas, precisas y amables al equipo interno de by.fio (colaboradoras y Fiorella).
${userName ? `Estás atendiendo a: ${userName}.` : ''}

DATOS EN TIEMPO REAL DEL SISTEMA:
${inventoryContext}
${workshopsContext}

REGLAS DE RESPUESTA INTERNA:
1. Sé concisa y exacta con cantidades de stock, precios y cupos de talleres.
2. Si preguntan por un producto y tiene 0 stock, indícalo claramente como agotado.
3. Si preguntan cuántos hay, responde la cifra exacta sin rodeos.
4. Tono: Eficiente, servicial, cálido y profesional.
5. PROHIBICIÓN ABSOLUTA: JAMÁS menciones nombres de modelos de IA, proveedores tecnológicos ni términos como Llama, Gemma, GPT, OpenAI o Cloudflare. Si te preguntan quién eres, responde que eres la Estrellita de by.fio para el equipo.`;
        } else {
          const stockDisclosureRule =
            aiConfig.stockDisclosureMode === 'full_stock'
              ? `POLÍTICA DE STOCK (MODO COMPLETO TRANSPARENTE ACTIVADO POR ADMIN):
- Puedes indicar abiertamente al cliente la cantidad total exacta disponible en el catálogo (por ejemplo: "¡Sí tenemos disponible! Nos quedan X unidades a un precio de ₡...").
- Si no hay stock o dice AGOTADO, explícale que actualmente está agotado o es bajo pedido especial por WhatsApp.`
              : `POLÍTICA MANDATORIA DE STOCK (MODO DISPONIBILIDAD Y CONSULTA DE CANTIDAD):
- NUNCA le digas al usuario de la web cuánto es el total de cosas o unidades que tienes en stock (ESTÁ ESTRICTAMENTE PROHIBIDO decir de entrada números totales como "tenemos 15 unidades", "nos quedan 8", o revelar la cifra total del inventario).
- SOLO debes decir con entusiasmo que SÍ hay disponible y preguntarle de inmediato cuántas unidades necesita o le gustaría llevarse (ejemplo: "¡Hola! Sí, tenemos disponible a ₡[precio] ✨ ¿Cuántas unidades te gustaría llevarte / necesitas?").
- Si el usuario te indica cuántas unidades quiere o necesita:
  * Si la cantidad que pide es MENOR O IGUAL al stock disponible: Confírmale alegremente que sí tenemos esa cantidad lista para su entrega o pedido.
  * Si el usuario requiere MÁS de las que hay en stock: Explícale amablemente que por el momento solo contamos con la cantidad que tenemos (ejemplo: "¡Por el momento solo tenemos X unidades disponibles! ✨ ¿Deseas llevarte esas X unidades o te gustaría encargar las restantes bajo pedido especial por WhatsApp?").
- Si el producto tiene stock 0 o dice AGOTADO: Explícale con dulzura que por el momento no hay disponibles o que podemos elaborarlo bajo pedido especial al WhatsApp 6400-4640.`;

          systemPrompt = `Eres la Estrellita de by.fio, la mascota y asistente de servicio al cliente de by.fio (tienda creativa, papelería y talleres en Costa Rica).
${userName ? `Estás conversando con: ${userName}.` : ''}

CONTEXTO EN TIEMPO REAL DE LA TIENDA:
${inventoryContext}
${workshopsContext}

INFORMACIÓN CLAVE DEL NEGOCIO:
- Envíos: Hacemos envíos a todo Costa Rica por medio de Correos de Costa Rica y mensajería express.
- Productos: Tazas personalizadas, libretas, agendas, libros de vacunas, stickers kawaii, souvenirs y kits creativos.
- Talleres: Talleres presenciales y virtuales de lettering, papelería creativa y encuadernación.
- Pagos: Aceptamos SINPE Móvil y transferencias bancarias.
- Contacto directo por WhatsApp: 6400-4640.

${stockDisclosureRule}
${aiConfig.customInstructions ? `\nINSTRUCCIONES ESPECIALES DE ADMINISTRACIÓN:\n${aiConfig.customInstructions}\n` : ''}
REGLAS DE ATENCIÓN:
1. Responde siempre en español con un tono dulce, alegre, cercano, tierno (kawaii) y respetuoso. Usa emojis suaves (✨, 🌸, 💖, 🎀).
2. Respuestas breves y fáciles de leer en pantalla de celular (1 a 3 párrafos cortos).
3. REGLA ESTRICTA DE CONFIDENCIALIDAD: NUNCA digas que eres una inteligencia artificial, ni menciones modelos (Llama, Gemma, OpenAI, etc.). Si te preguntan, di: "¡Soy la Estrellita de by.fio! Tu compañera para ayudarte a encontrar todo lo lindo que buscas en la tienda ✨🌸".`;
        }

        const messagesForModel: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
          { role: 'system', content: systemPrompt },
        ];

        // Añadir últimos 6 mensajes del historial para memoria de conversación
        for (const item of rawHistory.slice(-6)) {
          if (item && item.content && (item.role === 'user' || item.role === 'assistant')) {
            messagesForModel.push({ role: item.role, content: item.content });
          }
        }
        messagesForModel.push({ role: 'user', content: message });

        // Seleccionar modelo
        const chosenModel = role === 'staff' || role === 'admin' ? MODEL_STAFF : MODEL_CUSTOMER;
        const fallbackModel = role === 'staff' || role === 'admin' ? MODEL_STAFF_FALLBACK : MODEL_CUSTOMER_FALLBACK;

        let assistantReply = '';
        try {
          const aiResponse: any = await env.AI.run(chosenModel, {
            messages: messagesForModel,
            max_tokens: 600,
            temperature: 0.7,
          });
          assistantReply = (aiResponse?.response || aiResponse?.choices?.[0]?.message?.content || '').trim();
        } catch (primaryErr: any) {
          // Fallback resiliente
          try {
            const aiFallback: any = await env.AI.run(fallbackModel, {
              messages: messagesForModel,
              max_tokens: 600,
              temperature: 0.7,
            });
            assistantReply = (aiFallback?.response || aiFallback?.choices?.[0]?.message?.content || '').trim();
          } catch (secErr: any) {
            assistantReply = '¡Hola! En este instante estoy teniendo un pequeño inconveniente de conexión. Por favor escríbenos directamente a nuestro WhatsApp oficial 6400-4640 y con gusto te atenderemos con todo el cariño ✨🌸';
          }
        }

        if (!assistantReply) {
          assistantReply = '¡Hola! ¿En qué puedo ayudarte hoy en by.fio? ✨';
        }

        // Guardar en AGENT_DB de forma asíncrona / sin bloquear
        try {
          await env.AGENT_DB.batch([
            env.AGENT_DB.prepare(
              'INSERT INTO agent_conversations (id, user_id, user_role, updated_at) VALUES (?1, ?2, ?3, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP'
            ).bind(conversationId, userName || 'anon', role),
            env.AGENT_DB.prepare(
              'INSERT INTO agent_messages (id, conversation_id, role, content, has_audio) VALUES (?1, ?2, ?3, ?4, ?5)'
            ).bind(`msg_${Date.now()}_u`, conversationId, 'user', message, 0),
            env.AGENT_DB.prepare(
              'INSERT INTO agent_messages (id, conversation_id, role, content, has_audio) VALUES (?1, ?2, ?3, ?4, ?5)'
            ).bind(`msg_${Date.now()}_a`, conversationId, 'assistant', assistantReply, 0),
          ]);
        } catch (dbErr) {
          // No romper la respuesta si falla el log
        }

        return jsonResponse({
          success: true,
          response: assistantReply,
          conversationId,
        });
      }

      return jsonResponse({ error: 'Ruta no encontrada' }, 404);
    } catch (err: any) {
      return jsonResponse(
        { success: false, error: 'Error interno en el asistente', message: err?.message },
        500
      );
    }
  },
};
