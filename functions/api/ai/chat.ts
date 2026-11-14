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

interface FAQItem {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
}

const FAQS_KNOWLEDGE_BASE: FAQItem[] = [
  {
    id: 'horarios_tienda',
    keywords: ['horario', 'hora', 'abierto', 'cerrado', 'donde estan', 'ubicacion', 'tibas', 'tienda fisica', 'direccion'],
    question: '¿Cuál es el horario y ubicación de la tienda física?',
    answer: 'Nuestra tienda y taller se ubica en Tibás, San José, Costa Rica. Atendemos de Lunes a Viernes de 9:00 am a 6:00 pm, y Sábados con talleres programados.',
  },
  {
    id: 'envios_cr',
    keywords: ['envio', 'envios', 'costo envio', 'correos', 'costa rica', 'gam', 'provincia', 'cuanto tarda', 'llegar', 'mensajeria'],
    question: '¿Cómo funcionan los envíos y cuánto tardan?',
    answer: 'Enviamos a TODO Costa Rica por medio de Correos de Costa Rica (1 a 3 días hábiles) y mensajería express para el GAM. La tarifa oscila entre ₡2.500 y ₡3.500 según tu cantón o provincia.',
  },
  {
    id: 'metodos_pago',
    keywords: ['pago', 'pagar', 'sinpe', 'sinpe movil', 'transferencia', 'tarjeta', 'banco', 'efectivo', 'como pago'],
    question: '¿Cuáles son los métodos de pago aceptados?',
    answer: 'Aceptamos SINPE Móvil al 6400-4640 (a nombre de by.fio), transferencias bancarias directas y pagos en línea seguros.',
  },
  {
    id: 'registro_usuarios',
    keywords: ['registrar', 'registro', 'cuenta', 'inscribir', 'crear cuenta', 'crear mi cuenta', 'abrir cuenta', 'nuevo usuario'],
    question: '¿Cómo me registro o creo mi cuenta en by.fio?',
    answer: 'Puedes registrarte directamente en esta pantalla. Al solicitarlo se abre una tarjeta que te pide tus datos de dos en dos (Nombre y WhatsApp, Correo y Dirección, y tu Contraseña). Con esa cuenta tendrás acceso directo a tus compras y beneficios.',
  },
  {
    id: 'talleres_cursos',
    keywords: ['taller', 'talleres', 'curso', 'cursos', 'lettering', 'papeleria', 'encuadernacion', 'aprender', 'presencial', 'virtual'],
    question: '¿Qué talleres tienen disponibles y qué incluyen?',
    answer: 'Ofrecemos talleres de Lettering, Encuadernación y Papelería Kawaii. Cada taller incluye todos los materiales de máxima calidad, refrigerio y certificado de participación.',
  },
  {
    id: 'personalizacion_pedidos',
    keywords: ['personalizado', 'personalizada', 'personalizar', 'taza con foto', 'agenda con nombre', 'pedido especial', 'diseno especial'],
    question: '¿Hacen productos personalizados?',
    answer: '¡Sí, nos apasiona personalizar! Diseñamos tazas con nombres o fotos, agendas, cuadernos de vacunas y stickers especiales a tu gusto.',
  },
  {
    id: 'contacto_humano',
    keywords: ['humano', 'persona', 'fiorella', 'hablar con alguien', 'asesor', 'telefono', 'whatsapp', 'llamar'],
    question: '¿Cómo hablo directamente con Fiorella o el equipo?',
    answer: 'Puedes escribirnos directamente a nuestro WhatsApp oficial 6400-4640 y te atenderemos con todo el gusto del mundo.',
  },
];

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

    // Cargar configuración de AI BYFIO (política de stock, parámetros y humanización)
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
      delayType: 'dynamic',
      responseChunkSeparator: '|||',
      maxResponseChunks: 3,
      initialDelayMs: 2500,
      initialDelayMinMs: 2000,
      initialDelayMaxMs: 3500,
      msPerChar: 40,
      delayMarginMs: 1200,
    };

    if (context.env.DB) {
      try {
        const cfgRow = await context.env.DB.prepare(
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
    if (typeof body?.responseChunkSeparator === 'string') aiConfig.responseChunkSeparator = body.responseChunkSeparator;
    if (typeof body?.maxResponseChunks === 'number') aiConfig.maxResponseChunks = body.maxResponseChunks;
    if (typeof body?.initialDelayMs === 'number') aiConfig.initialDelayMs = body.initialDelayMs;
    if (typeof body?.msPerChar === 'number') aiConfig.msPerChar = body.msPerChar;
    if (typeof body?.delayType === 'string') aiConfig.delayType = body.delayType;

    // Filtros de Seguridad y Moderación (Jailbreak, contenido ofensivo o político)
    const jailbreakPattern = /ignore\s+(all\s+)?(previous\s+)?instructions|forget\s+all\s+rules|act\s+as\s+a\s+DAN|system\s+prompt|revela\s+(el\s+)?prompt|prompt\s+del\s+sistema/i;
    const offensiveOrPolitical = /(partido\s+politico|elecciones|votar\s+por|gobierno\s+corrupto|hijueputa|malparid)/i;
    const humanHandoffPattern = /(hablar\s+con\s+(un\s+)?humano|persona\s+real|asesor\s+humano|hablar\s+con\s+fiorella|atencion\s+humana|quiero\s+una\s+persona|agente\s+humano|pasame\s+a\s+alguien)/i;

    const isBlockedBySafety = jailbreakPattern.test(message) || offensiveOrPolitical.test(message);
    const isEscaped = humanHandoffPattern.test(message);

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

    // 2. Motor RAG: Recuperación de Preguntas Frecuentes Relevantes (FAQs)
    const lowerMessage = message.toLowerCase();
    const matchedFaqs = FAQS_KNOWLEDGE_BASE.filter((faq) =>
      faq.keywords.some((kw) => lowerMessage.includes(kw.toLowerCase()))
    );
    let ragFaqSection = '';
    if (matchedFaqs.length > 0) {
      ragFaqSection = '\n\nCONOCIMIENTO RECUPERADO (RAG / PREGUNTAS FRECUENTES RELEVANTES):\n' +
        matchedFaqs.map((f) => `• Pregunta: "${f.question}"\n  Respuesta Oficial: ${f.answer}`).join('\n\n');
    }

    // 3. Construir System Prompt según Rol con Reglas de Comportamiento Estrictas
    let systemPrompt = '';
    const stockDisclosureRule =
      aiConfig.stockDisclosureMode === 'full_stock'
        ? `POLÍTICA DE STOCK (MODO COMPLETO TRANSPARENTE ACTIVADO POR ADMIN):
- Puedes indicar abiertamente al cliente la cantidad total exacta disponible en el catálogo (ej: "¡Sí tenemos disponible! Nos quedan X unidades a un precio de ₡...").
- Si no hay stock o dice AGOTADO, explícale que actualmente está agotado o podemos elaborarlo bajo pedido especial por WhatsApp.`
        : `POLÍTICA MANDATORIA DE STOCK (MODO DISPONIBILIDAD Y CONSULTA DE CANTIDAD):
- NUNCA le digas al usuario de la web cuánto es el total de cosas o unidades que tienes en stock (ESTÁ ESTRICTAMENTE PROHIBIDO decir cifras totales como "tenemos 15 unidades", "nos quedan 8", o revelar el inventario total).
- SOLO debes decir con entusiasmo que SÍ hay disponible y preguntarle de inmediato cuántas unidades necesita o le gustaría llevarse (ejemplo: "¡Hola! Sí, tenemos disponible a ₡[precio] ✨ ¿Cuántas unidades te gustaría llevarte?").
- Si el usuario te indica cuántas unidades quiere o necesita:
  * Si la cantidad que pide es MENOR O IGUAL al stock: Confírmale alegremente que sí tenemos esa cantidad lista para entrega o pedido.
  * Si el usuario requiere MÁS de las que hay: Explícale amablemente cuántas podemos apartar hoy (ejemplo: "¡Por el momento solo tenemos X unidades disponibles! ✨ ¿Deseas llevarte esas X unidades o te gustaría encargar las restantes bajo pedido especial por WhatsApp?").
- Si el producto tiene stock 0 o dice AGOTADO: Explícale con dulzura que por ahora no hay disponibles o que podemos elaborarlo bajo pedido especial al WhatsApp 6400-4640.`;

    if (role === 'staff' || role === 'admin') {
      systemPrompt = `Eres la asistente interna y de inventario del equipo de by.fio (colaboradoras y Fiorella).
${userName ? `Atendiendo a la compañera: ${userName}.` : ''}

ROL, TONO Y ESTRUCTURA:
1. Rol: Eficiente, directa, ágil, precisa, amable y profesional. Cero rodeos corporativos ni textos largos.
2. Longitud y Estructura: Responde SIEMPRE en frases cortas y directas. Cero párrafos extensos.
3. Separación en Múltiples Mensajes: Divide tu respuesta en 1 a 3 mensajes cortos usando '|||' como separador obligatorio.
4. Lista Negra: JAMÁS menciones modelos de IA (Llama, Gemma, GPT, OpenAI, Cloudflare). No especules datos fuera del sistema.

DATOS EN TIEMPO REAL DEL SISTEMA (BASE DE DATOS BYFIO):
${inventoryContext}${ragFaqSection}`;
    } else {
      systemPrompt = `Eres la asesora comercial y compañera de atención al cliente de by.fio (tienda creativa, papelería bonita y talleres en San José, Costa Rica).
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

CONTEXTO EN TIEMPO REAL:
${inventoryContext}${ragFaqSection}

INFORMACIÓN CLAVE DEL NEGOCIO:
- Envíos: A todo Costa Rica por Correos de CR (1 a 3 días) y mensajería express GAM. Tarifa aproximada ₡2.500 a ₡3.500.
- Pagos: SINPE Móvil al 6400-4640 (by.fio) y transferencias bancarias.
- Contacto directo por WhatsApp: 6400-4640.

${stockDisclosureRule}
${aiConfig.customInstructions ? `\nINSTRUCCIONES ESPECIALES DE ADMINISTRACIÓN:\n${aiConfig.customInstructions}\n` : ''}`;
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

    // 3. Ejecutar inferencia o filtros de escape / seguridad
    let assistantReply = '';
    const chosenModel = role === 'staff' || role === 'admin' ? MODEL_STAFF : MODEL_CUSTOMER;
    const fallbackModel = role === 'staff' || role === 'admin' ? MODEL_STAFF_FALLBACK : MODEL_CUSTOMER_FALLBACK;
    let consumedNeurons = role === 'customer' ? 22.0 : 18.0;

    // A. Filtro de Seguridad / Jailbreak
    if (isBlockedBySafety) {
      assistantReply =
        'Como parte del equipo de by.fio, estoy para ayudarte con nuestros productos, papelería y talleres creativos ✨🌸|||¿Te gustaría consultar algo de nuestra tienda?';
    } else if (isEscaped) {
      // B. Protocolo de Escape directo
      assistantReply =
        '¡Con mucho gusto! Te paso directamente con Fiorella a nuestro WhatsApp oficial 6400-4640 para coordinar con todo detalle ✨🌸|||También puedes tocar el enlace de WhatsApp para escribirnos de inmediato.';
    } else if (context.env.AI) {
      // C. Inferencia con Parámetros Calibrados (Temperatura 0.1 a 0.4, Top-P, Top-K, Tokens 60 a 120)
      const temp = Math.min(Math.max(Number(aiConfig.temperature ?? 0.3), 0.1), 0.4);
      const maxTok = Math.min(Math.max(Number(aiConfig.maxTokens ?? 120), 60), 200);
      const topP = Math.min(Math.max(Number(aiConfig.topP ?? 0.85), 0.1), 1.0);
      const topK = Math.min(Math.max(Number(aiConfig.topK ?? 40), 1), 100);

      try {
        const aiResponse: any = await context.env.AI.run(chosenModel, {
          messages: messagesForModel,
          max_tokens: maxTok,
          temperature: temp,
          top_p: topP,
          top_k: topK,
        });
        assistantReply = (aiResponse?.response || aiResponse?.choices?.[0]?.message?.content || '').trim();
        if (aiResponse?.usage?.neurons) {
          consumedNeurons = Number(aiResponse.usage.neurons);
        }
      } catch (err: any) {
        try {
          const fallbackResp: any = await context.env.AI.run(fallbackModel, {
            messages: messagesForModel,
            max_tokens: maxTok,
            temperature: temp,
            top_p: topP,
            top_k: topK,
          });
          assistantReply = (fallbackResp?.response || fallbackResp?.choices?.[0]?.message?.content || '').trim();
          if (fallbackResp?.usage?.neurons) {
            consumedNeurons = Number(fallbackResp.usage.neurons);
          }
        } catch {
          assistantReply =
            '¡Hola! En este instante no pude conectar con el catálogo ✨|||Escríbenos directamente a nuestro WhatsApp oficial 6400-4640 y con gusto te atenderemos 🌸';
        }
      }
    } else {
      assistantReply =
        '¡Hola! Gracias por consultar en by.fio ✨|||Tenemos hermosas tazas personalizadas, libretas y talleres disponibles 🌸|||¿Buscabas algún producto en especial?';
    }

    if (!assistantReply) {
      assistantReply = '¡Hola! ¿En qué puedo ayudarte hoy en by.fio? ✨';
    }

    // 4. Dinámica de Conversación y Retrasos (Chunking & Simulación Humana)
    const separator = (aiConfig.responseChunkSeparator || '|||').trim() || '|||';
    const maxChunks = Math.min(Math.max(Number(aiConfig.maxResponseChunks || 3), 1), 6);
    const delayType = aiConfig.delayType || 'dynamic';

    let rawChunks = assistantReply
      .split(separator)
      .map((c: string) => c.replace(/^[\s\r\n\-,•]+|[\s\r\n]+$/g, '').trim())
      .filter((c: string) => c.length > 0);

    if (rawChunks.length === 0) {
      rawChunks = [assistantReply.trim()];
    }

    // Si el modelo no usó el separador pero generó bloques con saltos dobles, fragmentar
    if (rawChunks.length === 1 && rawChunks[0].includes('\n\n')) {
      rawChunks = rawChunks[0]
        .split('\n\n')
        .map((c: string) => c.trim())
        .filter((c: string) => c.length > 0);
    }

    // Limitar a la cantidad máxima de fragmentos configurados
    const messageChunks = rawChunks.slice(0, maxChunks);

    // Retraso Inicial (Primer Mensaje)
    let initialDelayMs = 2500;
    if (typeof aiConfig.initialDelayMs === 'number' && aiConfig.initialDelayMs > 0) {
      initialDelayMs = Math.min(Math.max(aiConfig.initialDelayMs, 800), 5000);
    } else {
      const initialMin = Math.min(Math.max(Number(aiConfig.initialDelayMinMs ?? 2000), 1000), 3000);
      const initialMax = Math.min(Math.max(Number(aiConfig.initialDelayMaxMs ?? 3500), initialMin + 500), 4500);
      initialDelayMs = Math.floor(Math.random() * (initialMax - initialMin + 1)) + initialMin;
    }

    // Simulación de tipeo y retraso intermedio
    const msPerChar = Math.min(Math.max(Number(aiConfig.msPerChar ?? 40), 20), 80);
    const delayMarginMs = Math.min(Math.max(Number(aiConfig.delayMarginMs ?? 1200), 800), 2000);

    let cumulativeTyping = 0;
    const chunkObjects = messageChunks.map((chunk, index) => {
      let typingMs = 1500;
      if (delayType === 'fixed') {
        typingMs = 2000;
      } else if (delayType === 'natural') {
        const jitter = Math.floor(Math.random() * 400) - 200;
        typingMs = Math.min(6500, Math.max(1000, Math.round(chunk.length * msPerChar) + delayMarginMs + jitter));
      } else {
        // dynamic (por defecto recomendado)
        typingMs = Math.min(6500, Math.max(1000, Math.round(chunk.length * msPerChar) + delayMarginMs));
      }
      cumulativeTyping += typingMs;
      return {
        index,
        text: chunk,
        typingMs,
        delayBeforeMs: index === 0 ? initialDelayMs : delayMarginMs,
      };
    });

    // 5. Guardar conversación y neuronas en AGENT_DB si está disponible
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
          ).bind(`msg_${Date.now()}_a`, conversationId, 'assistant', messageChunks.join('\n\n')),
          context.env.AGENT_DB.prepare(
            'INSERT INTO agent_neuron_logs (id, date_str, hour_str, model, role, neurons, action_type) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)'
          ).bind(`nlog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, dateStr, hourStr, chosenModel, role, consumedNeurons, 'chat'),
        ]);
      } catch {}
    }

    return new Response(
      JSON.stringify({
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
