interface Env {
  AI?: any;
  DB?: any;
  AGENT_DB?: any;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

const MODEL_CUSTOMER = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const MODEL_CUSTOMER_FALLBACK = '@cf/meta/llama-3.1-8b-instruct-fp8';
const MODEL_STAFF = '@cf/google/gemma-4-26b-a4b-it';
const MODEL_STAFF_FALLBACK = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

export const onRequestOptions = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestGet = async () => {
  return new Response(
    JSON.stringify({ status: 'online', service: 'byfio-assistant-chat' }),
    { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
  );
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = (await context.request.json()) as any;
    const message: string = (body?.message || '').trim();
    const role: 'customer' | 'staff' | 'admin' =
      body?.role === 'staff' || body?.role === 'admin' ? body.role : 'customer';
    const rawHistory: Array<{ role: 'user' | 'assistant'; content: string }> = Array.isArray(body?.history)
      ? body.history
      : [];
    const userName: string = (body?.userName || '').trim();
    const conversationId: string =
      body?.conversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (!message) {
      return new Response(JSON.stringify({ success: false, error: 'Mensaje requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // 1. Obtener datos de productos en tiempo real desde DB (solo lectura)
    let inventoryContext = 'Catálogo actual en tienda:\n';
    if (context.env.DB) {
      try {
        const prodRows = await context.env.DB.prepare(
          'SELECT name, category, price, stock, is_available FROM products LIMIT 80'
        ).all();
        const items = (prodRows.results || []) as Array<{
          name: string;
          category?: string;
          price?: number;
          stock?: number;
          is_available?: number;
        }>;
        if (items.length > 0) {
          inventoryContext += items
            .map((p) => {
              const stock = Number(p.stock ?? 0);
              const isAvail = p.is_available === 0 ? false : stock > 0;
              const statusStr = isAvail ? `${stock} unidades disponibles` : 'AGOTADO';
              return `- ${p.name} (Categoría: ${p.category || 'General'}, Precio: ₡${Number(p.price || 0).toLocaleString('es-CR')}, Stock: ${statusStr})`;
            })
            .join('\n');
        } else {
          inventoryContext += 'No hay productos registrados en inventario.\n';
        }
      } catch (err: any) {
        inventoryContext += 'Catálogo cargado en modo general.\n';
      }

      // Talleres
      try {
        const wsRows = await context.env.DB.prepare(
          'SELECT title, price, spots_total, spots_taken, date FROM workshops WHERE is_active = 1 LIMIT 20'
        ).all();
        const workshops = (wsRows.results || []) as Array<{
          title: string;
          price?: number;
          spots_total?: number;
          spots_taken?: number;
          date?: string;
        }>;
        if (workshops.length > 0) {
          inventoryContext += '\nTalleres activos:\n';
          inventoryContext += workshops
            .map((w) => {
              const total = w.spots_total || 0;
              const taken = w.spots_taken || 0;
              const free = Math.max(0, total - taken);
              return `- ${w.title} (Fecha: ${w.date || 'Próximamente'}, Precio: ₡${Number(w.price || 0).toLocaleString('es-CR')}, Cupos libres: ${free} de ${total})`;
            })
            .join('\n');
        }
      } catch {}
    }

    // 2. Construir System Prompt según Rol
    let systemPrompt = '';
    if (role === 'staff' || role === 'admin') {
      systemPrompt = `Eres la Estrellita de by.fio en modo Asistente de Colaboradoras y Administración.
Tu propósito es responder de forma directa, rápida, precisa y amable al equipo interno de by.fio (colaboradoras y Fiorella).
${userName ? `Estás atendiendo a la compañera: ${userName}.` : ''}

DATOS EN TIEMPO REAL DEL SISTEMA (BASE DE DATOS BYFIO):
${inventoryContext}

REGLAS DE RESPUESTA INTERNA:
1. Sé concisa y exacta con cantidades de stock, precios y cupos de talleres.
2. Si preguntan por un producto y tiene 0 stock o dice AGOTADO, indícalo claramente sin rodeos.
3. Si preguntan cuántos hay, responde la cifra exacta disponible.
4. Tono: Eficiente, servicial, cálido y profesional.
5. PROHIBICIÓN ABSOLUTA: JAMÁS menciones nombres de modelos de IA, proveedores tecnológicos ni términos como Llama, Gemma, GPT, OpenAI o Cloudflare. Si te preguntan quién eres, responde que eres la Estrellita de by.fio para el equipo.`;
    } else {
      systemPrompt = `Eres la Estrellita de by.fio, la mascota y asistente de servicio al cliente de by.fio (tienda creativa, papelería bonita y talleres en Costa Rica).
${userName ? `Estás conversando con: ${userName}.` : ''}

INVENTARIO Y TALLERES EN TIEMPO REAL:
${inventoryContext}

INFORMACIÓN CLAVE DEL NEGOCIO:
- Envíos: Hacemos envíos a todo Costa Rica por medio de Correos de Costa Rica y mensajería express.
- Productos: Tazas personalizadas, libretas, agendas, libros de vacunas, stickers kawaii, souvenirs y kits creativos.
- Talleres: Talleres presenciales y virtuales de lettering, papelería creativa y encuadernación.
- Pagos: Aceptamos SINPE Móvil y transferencias bancarias.
- Contacto directo por WhatsApp: 6400-4640.

REGLAS DE ATENCIÓN:
1. Responde siempre en español con un tono dulce, alegre, cercano, tierno (kawaii) y respetuoso. Usa emojis suaves (✨, 🌸, 💖, 🎀).
2. Si un cliente pregunta si hay un producto, revisa el stock en los datos anteriores:
   - Si tiene stock disponible (> 0): Confírmale con alegría que sí hay disponible y menciona el precio en colones (₡).
   - Si no hay stock o está agotado: Explícale con amabilidad que actualmente está agotado o que podemos hacerlo bajo pedido especial por WhatsApp.
3. Respuestas breves y fáciles de leer en pantalla de celular (1 a 3 párrafos cortos).
4. REGLA ESTRICTA DE CONFIDENCIALIDAD: NUNCA digas que eres una inteligencia artificial, ni menciones modelos (Llama, Gemma, OpenAI, etc.). Si te preguntan, di: "¡Soy la Estrellita de by.fio! Tu compañera para ayudarte a encontrar todo lo lindo que buscas en la tienda ✨🌸".`;
    }

    const messagesForModel: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    for (const item of rawHistory.slice(-6)) {
      if (item && item.content && (item.role === 'user' || item.role === 'assistant')) {
        messagesForModel.push({ role: item.role, content: item.content });
      }
    }
    messagesForModel.push({ role: 'user', content: message });

    // 3. Ejecutar inferencia en Workers AI
    let assistantReply = '';
    const chosenModel = role === 'staff' || role === 'admin' ? MODEL_STAFF : MODEL_CUSTOMER;
    const fallbackModel = role === 'staff' || role === 'admin' ? MODEL_STAFF_FALLBACK : MODEL_CUSTOMER_FALLBACK;

    let consumedNeurons = role === 'customer' ? 38.5 : 24.2;
    if (context.env.AI) {
      try {
        const aiResponse: any = await context.env.AI.run(chosenModel, {
          messages: messagesForModel,
          max_tokens: 600,
          temperature: 0.7,
        });
        assistantReply = (aiResponse?.response || aiResponse?.choices?.[0]?.message?.content || '').trim();
        if (aiResponse?.usage?.neurons) {
          consumedNeurons = Number(aiResponse.usage.neurons);
        }
      } catch (err: any) {
        try {
          const fallbackResp: any = await context.env.AI.run(fallbackModel, {
            messages: messagesForModel,
            max_tokens: 600,
            temperature: 0.7,
          });
          assistantReply = (fallbackResp?.response || fallbackResp?.choices?.[0]?.message?.content || '').trim();
          if (fallbackResp?.usage?.neurons) {
            consumedNeurons = Number(fallbackResp.usage.neurons);
          }
        } catch {
          assistantReply =
            '¡Hola! En este momento estoy consultando el catálogo para ti. Si gustas una atención personalizada de inmediato, también puedes escribirnos al WhatsApp oficial 6400-4640 ✨🌸';
        }
      }
    } else {
      assistantReply =
        '¡Hola! Gracias por consultar en by.fio. Tenemos disponibles tazas personalizadas, agendas y talleres creativos. ¿Buscas algún producto en especial? ✨🌸';
    }

    // 4. Guardar conversación y neuronas en AGENT_DB si está disponible
    if (context.env.AGENT_DB) {
      try {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const hourStr = String(now.getUTCHours()).padStart(2, '0');

        await context.env.AGENT_DB.batch([
          context.env.AGENT_DB.prepare(
            'INSERT INTO agent_conversations (id, user_id, user_role, updated_at) VALUES (?1, ?2, ?3, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP'
          ).bind(conversationId, userName || 'anon', role),
          context.env.AGENT_DB.prepare(
            'INSERT INTO agent_messages (id, conversation_id, role, content, has_audio) VALUES (?1, ?2, ?3, ?4, 0)'
          ).bind(`msg_${Date.now()}_u`, conversationId, 'user', message),
          context.env.AGENT_DB.prepare(
            'INSERT INTO agent_messages (id, conversation_id, role, content, has_audio) VALUES (?1, ?2, ?3, ?4, 0)'
          ).bind(`msg_${Date.now()}_a`, conversationId, 'assistant', assistantReply),
          context.env.AGENT_DB.prepare(
            'INSERT INTO agent_neuron_logs (id, date_str, hour_str, model, role, neurons, action_type) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)'
          ).bind(`nlog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, dateStr, hourStr, chosenModel, role, consumedNeurons, 'chat'),
        ]);
      } catch {}
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: assistantReply,
        conversationId,
      }),
      {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Error en el asistente' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      }
    );
  }
};
