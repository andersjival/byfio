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
          temperature: 0.3,
          topP: 0.85,
          topK: 40,
          maxTokens: 120,
          enableHumanSimulation: true,
          enableChunking: true,
          initialDelayMinMs: 2000,
          initialDelayMaxMs: 3500,
          msPerChar: 40,
          delayMarginMs: 1200,
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
        if (typeof body?.temperature === 'number') aiConfig.temperature = body.temperature;
        if (typeof body?.maxTokens === 'number') aiConfig.maxTokens = body.maxTokens;
        if (typeof body?.topP === 'number') aiConfig.topP = body.topP;
        if (typeof body?.topK === 'number') aiConfig.topK = body.topK;

        // Filtros de Seguridad y Moderación (Jailbreak, ofensas, política o solicitud de agente humano)
        const jailbreakPattern = /ignore\s+(all\s+)?(previous\s+)?instructions|forget\s+all\s+rules|act\s+as\s+a\s+DAN|system\s+prompt|revela\s+(el\s+)?prompt|prompt\s+del\s+sistema/i;
        const offensiveOrPolitical = /(partido\s+politico|elecciones|votar\s+por|gobierno\s+corrupto|hijueputa|malparid)/i;
        const humanHandoffPattern = /(hablar\s+con\s+(un\s+)?humano|persona\s+real|asesor\s+humano|hablar\s+con\s+fiorella|atencion\s+humana|quiero\s+una\s+persona|agente\s+humano|pasame\s+a\s+alguien)/i;

        const isBlockedBySafety = jailbreakPattern.test(message) || offensiveOrPolitical.test(message);
        const isEscaped = humanHandoffPattern.test(message);

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

        // Prompts del Sistema según el Rol con Reglas de Comportamiento Estrictas
        let systemPrompt = '';
        if (role === 'staff' || role === 'admin') {
          systemPrompt = `Eres la asistente interna y de inventario del equipo de by.fio (colaboradoras y Fiorella).
${userName ? `Atendiendo a: ${userName}.` : ''}

ROL, TONO Y ESTRUCTURA:
1. Rol: Eficiente, directa, ágil, precisa, amable y profesional. Cero rodeos corporativos ni textos largos.
2. Longitud y Estructura: Responde SIEMPRE en frases cortas y directas. Cero párrafos extensos.
3. Separación en Múltiples Mensajes: Divide tu respuesta en 1 a 3 mensajes cortos usando '|||' como separador obligatorio.
4. Lista Negra: JAMÁS menciones modelos de IA (Llama, Gemma, GPT, OpenAI, Cloudflare). No especules datos fuera del sistema.

DATOS EN TIEMPO REAL DEL SISTEMA:
${inventoryContext}
${workshopsContext}`;
        } else {
          const stockDisclosureRule =
            aiConfig.stockDisclosureMode === 'full_stock'
              ? `POLÍTICA DE STOCK (MODO COMPLETO TRANSPARENTE ACTIVADO POR ADMIN):
- Puedes indicar abiertamente al cliente la cantidad total exacta disponible en el catálogo (ejemplo: "¡Sí tenemos disponible! Nos quedan X unidades a un precio de ₡...").
- Si no hay stock o dice AGOTADO, explícale que actualmente está agotado o es bajo pedido especial por WhatsApp.`
              : `POLÍTICA MANDATORIA DE STOCK (MODO DISPONIBILIDAD Y CONSULTA DE CANTIDAD):
- NUNCA le digas al usuario de la web cuánto es el total de cosas o unidades que tienes en stock (ESTÁ ESTRICTAMENTE PROHIBIDO decir de entrada números totales como "tenemos 15 unidades", "nos quedan 8", o revelar la cifra total del inventario).
- SOLO debes decir con entusiasmo que SÍ hay disponible y preguntarle de inmediato cuántas unidades necesita o le gustaría llevarse (ejemplo: "¡Hola! Sí, tenemos disponible a ₡[precio] ✨ ¿Cuántas unidades te gustaría llevarte / necesitas?").
- Si el usuario te indica cuántas unidades quiere o necesita:
  * Si la cantidad que pide es MENOR O IGUAL al stock disponible: Confírmale alegremente que sí tenemos esa cantidad lista para su entrega o pedido.
  * Si el usuario requiere MÁS de las que hay en stock: Explícale amablemente cuántas unidades tenemos disponibles hoy (ejemplo: "¡Por el momento solo tenemos X unidades disponibles! ✨ ¿Deseas llevarte esas X unidades o te gustaría encargar las restantes bajo pedido especial por WhatsApp?").
- Si el producto tiene stock 0 o dice AGOTADO: Explícale con dulzura que por el momento no hay disponibles o que podemos elaborarlo bajo pedido especial al WhatsApp 6400-4640.`;

          systemPrompt = `Eres la asesora comercial y compañera de atención al cliente de by.fio (tienda creativa, papelería y talleres en Costa Rica).
${userName ? `Estás conversando con: ${userName}.` : ''}

1. ROL, TONO Y PERSONALIDAD:
- Tu identidad es de asesora cercana, amable, ágil, profesional, cálida y tierna (kawaii).
- Cero tono corporativo o robótico. Usa lenguaje natural, cálido y emojis suaves (✨, 🌸, 💖).

2. LONGITUD Y ESTRUCTURA (OBLIGATORIO):
- Responde SIEMPRE en frases cortas, directas y sin párrafos extensos de texto.
- Prohibido escribir bloques pesados de texto.

3. LISTA NEGRA ESTRICTA ("LO QUE NO DEBES DECIR NUNCA"):
- PROHIBIDO decir que eres una IA, un bot, un modelo de lenguaje o un asistente virtual. Eres parte del equipo humano de atención de by.fio (la Estrellita).
- PROHIBIDO prometer descuentos, regalías o condiciones que no estén en la base de conocimiento oficial.
- PROHIBIDO hablar de competidores o marcas ajenas a by.fio.
- PROHIBIDO usar frases de relleno como "¡Excelente pregunta!", "Con mucho gusto te asisto", "¿Hay algo más en lo que te pueda colaborar hoy?", "Es un placer atenderte". Ve al grano con naturalidad.

4. PROTOCOLO DE ESCAPE (DERIVACIÓN A HUMANO):
- Si no tienes el dato exacto o si el cliente solicita una persona real, no inventes nada ni des largas: derívalo directamente con Fiorella al WhatsApp oficial 6400-4640.

5. DINÁMICA DE CONVERSACIÓN (CHUNKING WHATSAPP):
- Divide tu respuesta en 1 a 3 mensajes cortos independientes usando el separador exacto '|||' entre cada fragmento.
- Ejemplo: "¡Hola! Con gusto te cuento ✨|||Tenemos tazas personalizadas desde ₡4.500 y agendas hermosas 🌸|||¿Buscabas algún diseño en especial?"

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
${aiConfig.customInstructions ? `\nINSTRUCCIONES ESPECIALES DE ADMINISTRACIÓN:\n${aiConfig.customInstructions}\n` : ''}`;
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

        // Seleccionar modelo y ejecutar inferencia calibrada
        const chosenModel = role === 'staff' || role === 'admin' ? MODEL_STAFF : MODEL_CUSTOMER;
        const fallbackModel = role === 'staff' || role === 'admin' ? MODEL_STAFF_FALLBACK : MODEL_CUSTOMER_FALLBACK;

        let assistantReply = '';
        if (isBlockedBySafety) {
          assistantReply =
            'Como parte del equipo de by.fio, estoy para ayudarte con nuestros productos, papelería y talleres creativos ✨🌸|||¿Te gustaría consultar algo de nuestra tienda?';
        } else if (isEscaped) {
          assistantReply =
            '¡Con mucho gusto! Te paso directamente con Fiorella a nuestro WhatsApp oficial 6400-4640 para coordinar con todo detalle ✨🌸|||También puedes tocar el enlace de WhatsApp para escribirnos de inmediato.';
        } else {
          const temp = Math.min(Math.max(Number(aiConfig.temperature ?? 0.3), 0.1), 0.4);
          const maxTok = Math.min(Math.max(Number(aiConfig.maxTokens ?? 120), 60), 200);
          const topP = Math.min(Math.max(Number(aiConfig.topP ?? 0.85), 0.1), 1.0);
          const topK = Math.min(Math.max(Number(aiConfig.topK ?? 40), 1), 100);

          try {
            const aiResponse: any = await env.AI.run(chosenModel, {
              messages: messagesForModel,
              max_tokens: maxTok,
              temperature: temp,
              top_p: topP,
              top_k: topK,
            });
            assistantReply = (aiResponse?.response || aiResponse?.choices?.[0]?.message?.content || '').trim();
          } catch (primaryErr: any) {
            try {
              const aiFallback: any = await env.AI.run(fallbackModel, {
                messages: messagesForModel,
                max_tokens: maxTok,
                temperature: temp,
                top_p: topP,
                top_k: topK,
              });
              assistantReply = (aiFallback?.response || aiFallback?.choices?.[0]?.message?.content || '').trim();
            } catch (secErr: any) {
              assistantReply = '¡Hola! En este instante estoy consultando el catálogo para ti ✨|||Por favor escríbenos directamente a nuestro WhatsApp oficial 6400-4640 y con gusto te atenderemos 🌸';
            }
          }
        }

        if (!assistantReply) {
          assistantReply = '¡Hola! ¿En qué puedo ayudarte hoy en by.fio? ✨';
        }

        // Dinámica de Conversación y Retrasos (Chunking & Simulación Humana)
        let rawChunks = assistantReply
          .split('|||')
          .map((c: string) => c.replace(/^[\s\r\n\-,•]+|[\s\r\n]+$/g, '').trim())
          .filter((c: string) => c.length > 0);

        if (rawChunks.length === 0) {
          rawChunks = [assistantReply.trim()];
        }

        if (rawChunks.length === 1 && rawChunks[0].includes('\n\n')) {
          rawChunks = rawChunks[0]
            .split('\n\n')
            .map((c: string) => c.trim())
            .filter((c: string) => c.length > 0);
        }

        const messageChunks = rawChunks;

        // Retraso Inicial (Primer Mensaje): 2 a 4 segundos
        const initialMin = Math.min(Math.max(Number(aiConfig.initialDelayMinMs ?? 2000), 1000), 3000);
        const initialMax = Math.min(Math.max(Number(aiConfig.initialDelayMaxMs ?? 3500), initialMin + 500), 4500);
        const initialDelayMs = Math.floor(Math.random() * (initialMax - initialMin + 1)) + initialMin;

        // Simulación de tipeo: 30 a 50 ms/char con margen de 1 a 2 seg
        const msPerChar = Math.min(Math.max(Number(aiConfig.msPerChar ?? 40), 30), 50);
        const delayMarginMs = Math.min(Math.max(Number(aiConfig.delayMarginMs ?? 1200), 1000), 2000);

        let cumulativeTyping = 0;
        const chunkObjects = messageChunks.map((chunk, index) => {
          const typingMs = Math.min(6500, Math.max(1000, Math.round(chunk.length * msPerChar) + delayMarginMs));
          cumulativeTyping += typingMs;
          return {
            index,
            text: chunk,
            typingMs,
            delayBeforeMs: index === 0 ? initialDelayMs : delayMarginMs,
          };
        });

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
            ).bind(`msg_${Date.now()}_a`, conversationId, 'assistant', messageChunks.join('\n\n'), 0),
          ]);
        } catch (dbErr) {
          // No romper la respuesta si falla el log
        }

        return jsonResponse({
          success: true,
          response: messageChunks.join('\n\n'),
          messages: messageChunks,
          chunks: chunkObjects,
          humanSimulation: {
            initialDelayMs,
            isChunked: messageChunks.length > 1,
            totalTypingMs: cumulativeTyping,
            msPerChar,
            delayMarginMs,
          },
          isEscaped,
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
