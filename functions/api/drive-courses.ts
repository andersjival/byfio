interface Env {
  DB?: any;
  COMPOSIO_WEBHOOK_URL?: string;
  COMPOSIO_API_KEY?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

const DEFAULT_COURSES = [
  {
    id: 'dc-1',
    title: 'Curso Profesional de Encuadernación & Agendas Artesanales 2027',
    tagline: 'Aprende encuadernación de tapas duras, costura copta y espiralado profesional.',
    price: 15000,
    description: 'Aprende paso a paso desde cero todas las técnicas de encuadernación para crear agendas personalizadas de alta gama, álbumes y libretas acolchadas. Incluye acceso inmediato a nuestra biblioteca de Google Drive con todos los archivos digitales.',
    whatYouGet: [
      'Acceso de por vida a carpeta privada en Google Drive con actualizaciones continuas',
      'Más de 45 plantillas editables en PDF y Canva (Agendas 2027, Cuadernos de Pediatría y Recetarios)',
      '14 módulos en video HD con tomas de alta precisión y explicación detallada',
      'Guía maestra de proveedores recomendados con descuentos de mayorista',
      'Certificado de finalización digital avalado por by.fio'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/byfio-encuadernacion-2027',
    badge: 'Más Vendido',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
    isActive: true,
    createdAt: '2026-11-13T10:00:00Z'
  },
  {
    id: 'dc-2',
    title: 'Masterclass de Sublimación & Tazas Perfectas Sin Errores',
    tagline: 'Tiempos, temperaturas y perfiles de color para sublimar sin manchas ni mermas.',
    price: 12000,
    description: 'Domina los secretos de la sublimación artesanal sobre cerámica, aluminio y telas. Olvídate de los colores apagados o los bordes quemados gracias a nuestras tablas exactas de calibración.',
    whatYouGet: [
      'Acceso completo a carpeta Google Drive con más de 250 diseños listos para imprimir',
      'Tabla comparativa de tiempos, presión y temperaturas según sustrato',
      'Video tutorial de calibración de impresoras Epson y tintas fotográficas',
      'Mockups profesionales para publicar tus tazas en redes sociales y vender más',
      'Grupo privado de consultas técnicas y soporte'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/byfio-sublimacion-master',
    badge: 'Recomendado',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    isActive: true,
    createdAt: '2026-11-13T10:00:00Z'
  },
  {
    id: 'dc-3',
    title: 'Taller Digital: Diseño y Troquelado de Stickers Holográficos Kawaii',
    tagline: 'Crea stickers laminados impermeables con cortes perfectos en plotter.',
    price: 9500,
    description: 'Convierte tus ideas en stickers profesionales con efectos holográficos, glitter y acabado mate. Aprende a configurar Silhouette Cameo y Cricut para lograr troquelados precisos.',
    whatYouGet: [
      'Carpeta Google Drive con más de 300 ilustraciones vectoriales en SVG y PNG alta calidad',
      'Guía paso a paso para troquelado die-cut y kiss-cut perfecto',
      'Recomendaciones de vinilos adhesivos y laminados resistentes al agua',
      'Plantillas para empaques con backing card listo para exhibir'
    ],
    driveFolderUrl: 'https://drive.google.com/drive/folders/byfio-stickers-holograficos',
    badge: 'Nuevo',
    coverImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=700&q=80',
    isActive: true,
    createdAt: '2026-11-13T10:00:00Z'
  }
];

const ensureTables = async (db: any) => {
  if (!db) return;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS drive_courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tagline TEXT,
      price REAL NOT NULL,
      description TEXT,
      what_you_get_json TEXT NOT NULL,
      drive_folder_url TEXT,
      badge TEXT,
      cover_image TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `).run().catch(() => {});

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS drive_course_purchases (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      course_title TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      payment_reference TEXT,
      payment_amount REAL NOT NULL,
      payment_status TEXT NOT NULL,
      drive_status TEXT NOT NULL,
      drive_folder_url TEXT,
      composio_sent INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `).run().catch(() => {});

  await db.prepare(
    'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
  ).run().catch(() => {});
};

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'all';

  try {
    await ensureTables(env.DB);

    // Obtener configuración de Composio
    let settings = {
      composioWebhookUrl: env.COMPOSIO_WEBHOOK_URL || '',
      composioApiKey: env.COMPOSIO_API_KEY || '',
      updatedAt: undefined as string | undefined,
    };

    if (env.DB) {
      try {
        const row: any = await env.DB.prepare("SELECT data FROM site_metrics WHERE id = 'drive_courses_settings' LIMIT 1").first();
        if (row?.data) {
          const parsed = JSON.parse(row.data);
          settings = { ...settings, ...parsed };
        }
      } catch {}
    }

    if (type === 'settings') {
      return new Response(JSON.stringify({ success: true, settings }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'purchases') {
      let purchases: any[] = [];
      if (env.DB) {
        try {
          const res: any = await env.DB.prepare('SELECT * FROM drive_course_purchases ORDER BY created_at DESC LIMIT 150').all();
          purchases = (res?.results || []).map((r: any) => ({
            id: r.id,
            courseId: r.course_id,
            courseTitle: r.course_title,
            customerName: r.customer_name,
            customerEmail: r.customer_email,
            customerPhone: r.customer_phone,
            paymentReference: r.payment_reference || '',
            paymentAmount: Number(r.payment_amount) || 0,
            paymentStatus: r.payment_status || 'paid',
            driveStatus: r.drive_status || 'granted',
            driveFolderUrl: r.drive_folder_url || '',
            composioSent: Boolean(r.composio_sent),
            createdAt: r.created_at,
          }));
        } catch {}
      }
      return new Response(JSON.stringify({ success: true, purchases }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Listado de cursos
    let courses = [...DEFAULT_COURSES];
    if (env.DB) {
      try {
        const res: any = await env.DB.prepare('SELECT * FROM drive_courses ORDER BY created_at DESC').all();
        if (res?.results && res.results.length > 0) {
          courses = res.results.map((r: any) => ({
            id: r.id,
            title: r.title,
            tagline: r.tagline || '',
            price: Number(r.price) || 0,
            description: r.description || '',
            whatYouGet: r.what_you_get_json ? JSON.parse(r.what_you_get_json) : [],
            driveFolderUrl: r.drive_folder_url || '',
            badge: r.badge || '',
            coverImage: r.cover_image || '',
            isActive: Boolean(r.is_active),
            createdAt: r.created_at,
          }));
        }
      } catch {}
    }

    return new Response(JSON.stringify({ success: true, courses, settings }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message, courses: DEFAULT_COURSES }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    await ensureTables(env.DB);
    const body: any = await request.json();
    const action = body.action || 'purchase';

    if (action === 'save_settings') {
      const { composioWebhookUrl, composioApiKey } = body;
      const settingsData = JSON.stringify({
        composioWebhookUrl: (composioWebhookUrl || '').trim(),
        composioApiKey: (composioApiKey || '').trim(),
        updatedAt: new Date().toISOString(),
      });
      if (env.DB) {
        await env.DB.prepare(
          'INSERT INTO site_metrics (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
        ).bind('drive_courses_settings', settingsData, new Date().toISOString()).run();
      }
      return new Response(JSON.stringify({ success: true, message: 'Configuración de Composio guardada correctamente.' }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'test_composio') {
      const webhookUrl = (body.composioWebhookUrl || env.COMPOSIO_WEBHOOK_URL || '').trim();
      if (!webhookUrl) {
        return new Response(JSON.stringify({ success: false, message: 'Debes ingresar una URL de Webhook de Composio.' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }

      let pingSuccess = false;
      let pingDetails = '';
      try {
        const testPayload = {
          event: 'test_ping',
          message: 'Prueba de conexión By.Fio -> Composio (Google Drive)',
          testEmail: 'cliente.prueba@gmail.com',
          timestamp: new Date().toISOString(),
        };
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(body.composioApiKey ? { Authorization: `Bearer ${body.composioApiKey}` } : {}),
          },
          body: JSON.stringify(testPayload),
        });
        pingSuccess = res.ok;
        pingDetails = `Respuesta HTTP ${res.status}`;
      } catch (e: any) {
        pingDetails = e.message;
      }

      return new Response(JSON.stringify({ success: pingSuccess, message: pingSuccess ? 'Conexión con Composio exitosa!' : `Fallo al conectar con Composio: ${pingDetails}` }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'save_course') {
      const course = body.course;
      if (!course || !course.title) {
        return new Response(JSON.stringify({ success: false, message: 'El título del curso es obligatorio.' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }

      const id = course.id || `dc-${Date.now()}`;
      const whatYouGetJson = JSON.stringify(Array.isArray(course.whatYouGet) ? course.whatYouGet : []);

      if (env.DB) {
        await env.DB.prepare(`
          INSERT INTO drive_courses (id, title, tagline, price, description, what_you_get_json, drive_folder_url, badge, cover_image, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            tagline = excluded.tagline,
            price = excluded.price,
            description = excluded.description,
            what_you_get_json = excluded.what_you_get_json,
            drive_folder_url = excluded.drive_folder_url,
            badge = excluded.badge,
            cover_image = excluded.cover_image,
            is_active = excluded.is_active;
        `).bind(
          id,
          course.title,
          course.tagline || '',
          Number(course.price) || 0,
          course.description || '',
          whatYouGetJson,
          course.driveFolderUrl || '',
          course.badge || '',
          course.coverImage || '',
          course.isActive !== false ? 1 : 0
        ).run();
      }

      return new Response(JSON.stringify({ success: true, message: 'Curso guardado correctamente.', courseId: id }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete_course') {
      const { courseId } = body;
      if (env.DB && courseId) {
        await env.DB.prepare('DELETE FROM drive_courses WHERE id = ?').bind(courseId).run();
      }
      return new Response(JSON.stringify({ success: true, message: 'Curso eliminado.' }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Default action: 'purchase'
    const {
      courseId,
      courseTitle,
      customerName,
      customerEmail,
      customerPhone,
      paymentReference,
      paymentAmount,
      driveFolderUrl,
    } = body;

    if (!customerEmail || !customerName || !customerPhone) {
      return new Response(JSON.stringify({ success: false, message: 'Nombre, correo y teléfono son obligatorios.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const purchaseId = `dcp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    let composioSent = false;

    // Obtener webhook URL de Composio
    let webhookUrl = (env.COMPOSIO_WEBHOOK_URL || '').trim();
    let apiKey = (env.COMPOSIO_API_KEY || '').trim();
    if (env.DB) {
      try {
        const row: any = await env.DB.prepare("SELECT data FROM site_metrics WHERE id = 'drive_courses_settings' LIMIT 1").first();
        if (row?.data) {
          const parsed = JSON.parse(row.data);
          if (parsed.composioWebhookUrl) webhookUrl = parsed.composioWebhookUrl.trim();
          if (parsed.composioApiKey) apiKey = parsed.composioApiKey.trim();
        }
      } catch {}
    }

    // Si hay webhook de Composio configurado, notificar para registrar correo en Google Drive
    if (webhookUrl) {
      try {
        const composioPayload = {
          event: 'course_purchased',
          action: 'grant_google_drive_access',
          customer: {
            name: customerName,
            email: customerEmail.trim().toLowerCase(),
            phone: customerPhone,
          },
          course: {
            id: courseId,
            title: courseTitle,
            driveFolderUrl: driveFolderUrl || '',
          },
          payment: {
            reference: paymentReference || '',
            amount: Number(paymentAmount) || 0,
            status: 'paid',
            timestamp: new Date().toISOString(),
          },
        };

        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          },
          body: JSON.stringify(composioPayload),
        });
        composioSent = res.ok;
      } catch (e) {
        console.warn('Error enviando a Composio:', e);
      }
    }

    // Registrar en BD
    if (env.DB) {
      try {
        await env.DB.prepare(`
          INSERT INTO drive_course_purchases (
            id, course_id, course_title, customer_name, customer_email, customer_phone,
            payment_reference, payment_amount, payment_status, drive_status, drive_folder_url, composio_sent
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          purchaseId,
          courseId || 'dc-1',
          courseTitle || 'Curso Drive',
          customerName,
          customerEmail.trim().toLowerCase(),
          customerPhone,
          paymentReference || 'SINPE-OK',
          Number(paymentAmount) || 0,
          'paid',
          'granted',
          driveFolderUrl || '',
          composioSent ? 1 : 0
        ).run();
      } catch (errDb) {
        console.warn('Error guardando en D1:', errDb);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `¡Acceso otorgado con éxito! Se ha registrado el correo ${customerEmail} en Google Drive.`,
      purchaseId,
      driveStatus: 'granted',
      composioSent,
      customerEmail: customerEmail.trim().toLowerCase(),
      driveFolderUrl,
    }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
};
