interface Env {
  DB?: any;
}

interface WorkshopDbRow {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  schedule: string;
  modality: string;
  location: string;
  price: number;
  spots_available: number;
  total_spots: number;
  includes_json: string;
  image?: string;
  description?: string;
  benefits_json?: string;
}

const DEFAULT_WORKSHOPS = [
  {
    id: 'ws-1',
    title: 'Taller de Encuadernación Artesanal',
    subtitle: 'Aprende costura copta y encuadernación japonesa desde cero',
    date: 'Sábado 15 de Noviembre, 2026',
    schedule: '9:00 AM — 1:00 PM',
    modality: 'Presencial',
    location: 'Taller Creativo by.fio, 200 sur del parque de Tibás, San José',
    price: 35000,
    spotsAvailable: 4,
    totalSpots: 10,
    includes: [
      'Técnicas de cosido tradicional',
      'Kit completo de herramientas (hueso, punzón, hilos)',
      'Papeles artesanales y cartón prensado',
      'Acompañamiento 1 a 1 y coffee break dulce',
    ],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
    description: 'Crea tu primer cuaderno de pasta dura con acabados profesionales. No requieres experiencia previa.',
    hasCoffeeBreak: true,
    coffeeBreakText: 'Coffee break artesanal con repostería dulce y bebidas.',
    hasToolsIncluded: true,
    toolsText: 'Uso ilimitado de herramientas de alta precisión durante el taller.',
    hasTakeHomeProject: true,
    takeHomeText: 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
    instructorName: 'Fiorella Patricia Jara Gutiérrez (Fio)',
    instructorSubtitle: 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.',
  },
  {
    id: 'ws-2',
    title: 'Taller de Agendas Personalizadas 2027',
    subtitle: 'Diseña, imprime, plastifica y arma tu propia agenda anual',
    date: 'Domingo 23 de Noviembre, 2026',
    schedule: '1:30 PM — 5:30 PM',
    modality: 'Presencial',
    location: 'Taller Creativo by.fio, 200 sur del parque de Tibás, San José',
    price: 38000,
    spotsAvailable: 2,
    totalSpots: 10,
    includes: [
      'Archivos editables e imprimibles 2027',
      'Técnicas de laminado holográfico y soft-touch',
      'Espiralados metálicos y esquineros dorados',
      'Tips de costeo y venta para emprender',
    ],
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=700&q=80',
    description: 'El taller favorito para iniciar un negocio rentable de papelería en temporada de fin de año.',
    hasCoffeeBreak: true,
    coffeeBreakText: 'Coffee break artesanal con repostería dulce y bebidas.',
    hasToolsIncluded: true,
    toolsText: 'Uso ilimitado de herramientas de alta precisión durante el taller.',
    hasTakeHomeProject: true,
    takeHomeText: 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
    instructorName: 'Fiorella Patricia Jara Gutiérrez (Fio)',
    instructorSubtitle: 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.',
  },
  {
    id: 'ws-3',
    title: 'Taller de Libros de Vacunas & Recuerdos',
    subtitle: 'Creación de portadas acolchadas para bebés y mascotas',
    date: 'Sábado 29 de Noviembre, 2026',
    schedule: '9:00 AM — 1:00 PM',
    modality: 'Presencial',
    location: 'Taller Creativo by.fio, 200 sur del parque de Tibás, San José',
    price: 32000,
    spotsAvailable: 5,
    totalSpots: 8,
    includes: [
      'Estructura de tapas acolchadas antipolvo',
      'Bolsillos interiores plastificados y elásticos',
      'Formatos oficiales CCSS y veterinarios',
      'Materiales de alta durabilidad y foil',
    ],
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80',
    description: 'Un producto con altísima demanda durante todo el año para mamás y amantes de las mascotas.',
    hasCoffeeBreak: true,
    coffeeBreakText: 'Coffee break artesanal con repostería dulce y bebidas.',
    hasToolsIncluded: true,
    toolsText: 'Uso ilimitado de herramientas de alta precisión durante el taller.',
    hasTakeHomeProject: true,
    takeHomeText: 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
    instructorName: 'Fiorella Patricia Jara Gutiérrez (Fio)',
    instructorSubtitle: 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.',
  },
  {
    id: 'ws-4',
    title: 'Masterclass de Sublimación Creativa',
    subtitle: 'Domina tiempos, temperaturas y calibración de color',
    date: 'Sábado 6 de Diciembre, 2026',
    schedule: '2:00 PM — 6:00 PM',
    modality: 'Presencial',
    location: 'Laboratorio de Impresión by.fio, CR',
    price: 42000,
    spotsAvailable: 3,
    totalSpots: 8,
    includes: [
      'Sublimado en tazas mágicas, botellas y textiles',
      'Ajustes de perfiles de color ICC',
      'Insumos para practicar (3 piezas para llevar)',
      'Guía de proveedores verificados en Costa Rica',
    ],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    description: 'Aprende a evitar fantasmas, impresiones opacas y errores costosos en tus productos sublimados.',
    hasCoffeeBreak: true,
    coffeeBreakText: 'Coffee break artesanal con repostería dulce y bebidas.',
    hasToolsIncluded: true,
    toolsText: 'Uso ilimitado de herramientas de alta precisión durante el taller.',
    hasTakeHomeProject: true,
    takeHomeText: 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
    instructorName: 'Fiorella Patricia Jara Gutiérrez (Fio)',
    instructorSubtitle: 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.',
  },
  {
    id: 'ws-5',
    title: 'Taller de Stickers & Papelería Creativa',
    subtitle: 'Corte digital con Cameo / Cricut y laminados especiales',
    date: 'Domingo 14 de Diciembre, 2026',
    schedule: '10:00 AM — 2:00 PM',
    modality: 'Virtual en Vivo',
    location: 'Transmisión interactiva vía Zoom + Grabación',
    price: 26000,
    spotsAvailable: 8,
    totalSpots: 15,
    includes: [
      'Pack de 100+ ilustraciones vectoriales listas',
      'Corte de sticker sheets y die-cut troquelados',
      'Laminado contra agua y rayos UV',
      'Acompañamiento en grupo VIP de WhatsApp',
    ],
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=700&q=80',
    description: 'Aprende desde tu casa con materiales que puedes conseguir fácilmente o recibir en kit.',
    hasCoffeeBreak: false,
    coffeeBreakText: '',
    hasToolsIncluded: false,
    toolsText: '',
    hasTakeHomeProject: true,
    takeHomeText: 'Tus proyectos terminados listos para comercializar o regalar.',
    instructorName: 'Fiorella Patricia Jara Gutiérrez (Fio)',
    instructorSubtitle: 'Sesión virtual en vivo con asesoría directa y resolución de dudas en tiempo real.',
  },
];

const mapRowToWorkshop = (r: WorkshopDbRow) => {
  let includes: string[] = [];
  try {
    includes = JSON.parse(r.includes_json || '[]');
  } catch {
    includes = [];
  }

  let benefits: any = {};
  if (r.benefits_json) {
    try {
      benefits = JSON.parse(r.benefits_json);
    } catch {}
  }

  const isVirtual = r.modality === 'Virtual en Vivo';
  const hasCoffeeBreak = benefits.hasCoffeeBreak !== undefined
    ? Boolean(benefits.hasCoffeeBreak)
    : !isVirtual;

  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || '',
    date: r.date,
    schedule: r.schedule,
    modality: r.modality,
    location: r.location,
    price: Number(r.price) || 0,
    spotsAvailable: Number(r.spots_available) || 0,
    totalSpots: Number(r.total_spots) || 0,
    includes,
    image: r.image || '',
    description: r.description || '',
    hasCoffeeBreak,
    coffeeBreakText: benefits.coffeeBreakText !== undefined ? benefits.coffeeBreakText : 'Coffee break artesanal con repostería dulce y bebidas.',
    hasToolsIncluded: benefits.hasToolsIncluded !== undefined ? Boolean(benefits.hasToolsIncluded) : true,
    toolsText: benefits.toolsText !== undefined ? benefits.toolsText : 'Uso ilimitado de herramientas de alta precisión durante el taller.',
    hasTakeHomeProject: benefits.hasTakeHomeProject !== undefined ? Boolean(benefits.hasTakeHomeProject) : true,
    takeHomeText: benefits.takeHomeText !== undefined ? benefits.takeHomeText : 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
    instructorName: benefits.instructorName || 'Fiorella Patricia Jara Gutiérrez (Fio)',
    instructorSubtitle: benefits.instructorSubtitle || 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.',
    waitlistWhatsappNumber: benefits.waitlistWhatsappNumber || '',
    waitlistWhatsappLink: benefits.waitlistWhatsappLink || '',
    benefits: Array.isArray(benefits.benefits) && benefits.benefits.length > 0 ? benefits.benefits : [
      {
        id: 'ben-coffee',
        icon: 'Coffee',
        text: benefits.coffeeBreakText !== undefined ? benefits.coffeeBreakText : 'Coffee break artesanal con repostería dulce y bebidas.',
        enabled: hasCoffeeBreak,
      },
      {
        id: 'ben-tools',
        icon: 'ShieldCheck',
        text: benefits.toolsText !== undefined ? benefits.toolsText : 'Uso ilimitado de herramientas de alta precisión durante el taller.',
        enabled: benefits.hasToolsIncluded !== undefined ? Boolean(benefits.hasToolsIncluded) : true,
      },
      {
        id: 'ben-project',
        icon: 'Star',
        text: benefits.takeHomeText !== undefined ? benefits.takeHomeText : 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
        enabled: benefits.hasTakeHomeProject !== undefined ? Boolean(benefits.hasTakeHomeProject) : true,
      },
    ],
  };
};

const ensureWorkshopsTable = async (db: any) => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS workshops (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      date TEXT NOT NULL,
      schedule TEXT NOT NULL,
      modality TEXT NOT NULL,
      location TEXT NOT NULL,
      price REAL NOT NULL,
      spots_available INTEGER NOT NULL,
      total_spots INTEGER NOT NULL,
      includes_json TEXT NOT NULL,
      image TEXT,
      description TEXT,
      benefits_json TEXT
    );
  `).run().catch(() => {});

  await db.prepare('ALTER TABLE workshops ADD COLUMN benefits_json TEXT').run().catch(() => {});
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify(DEFAULT_WORKSHOPS), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    await ensureWorkshopsTable(context.env.DB);

    const { results } = await context.env.DB.prepare(
      'SELECT * FROM workshops'
    ).all();

    if (!results || results.length === 0) {
      // Auto-sembrar talleres por defecto si la tabla está vacía
      for (const ws of DEFAULT_WORKSHOPS) {
        const benefitsJson = JSON.stringify({
          hasCoffeeBreak: ws.hasCoffeeBreak,
          coffeeBreakText: ws.coffeeBreakText,
          hasToolsIncluded: ws.hasToolsIncluded,
          toolsText: ws.toolsText,
          hasTakeHomeProject: ws.hasTakeHomeProject,
          takeHomeText: ws.takeHomeText,
          instructorName: ws.instructorName,
          instructorSubtitle: ws.instructorSubtitle,
        });

        await context.env.DB.prepare(`
          INSERT OR REPLACE INTO workshops (
            id, title, subtitle, date, schedule, modality, location,
            price, spots_available, total_spots, includes_json, image, description, benefits_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          ws.id,
          ws.title,
          ws.subtitle,
          ws.date,
          ws.schedule,
          ws.modality,
          ws.location,
          ws.price,
          ws.spotsAvailable,
          ws.totalSpots,
          JSON.stringify(ws.includes),
          ws.image,
          ws.description,
          benefitsJson
        ).run().catch(() => {});
      }

      return new Response(JSON.stringify(DEFAULT_WORKSHOPS), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    const workshops = (results as WorkshopDbRow[]).map(mapRowToWorkshop);
    return new Response(JSON.stringify(workshops), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify(DEFAULT_WORKSHOPS), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const data = (await context.request.json()) as any;
    const id = data.id || `ws-${Date.now()}`;

    const benefits = {
      benefits: Array.isArray(data.benefits) ? data.benefits : [],
      hasCoffeeBreak: data.hasCoffeeBreak !== undefined ? Boolean(data.hasCoffeeBreak) : (data.modality !== 'Virtual en Vivo'),
      coffeeBreakText: data.coffeeBreakText || 'Coffee break artesanal con repostería dulce y bebidas.',
      hasToolsIncluded: data.hasToolsIncluded !== undefined ? Boolean(data.hasToolsIncluded) : true,
      toolsText: data.toolsText || 'Uso ilimitado de herramientas de alta precisión durante el taller.',
      hasTakeHomeProject: data.hasTakeHomeProject !== undefined ? Boolean(data.hasTakeHomeProject) : true,
      takeHomeText: data.takeHomeText || 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
      instructorName: data.instructorName || 'Fiorella Patricia Jara Gutiérrez (Fio)',
      instructorSubtitle: data.instructorSubtitle || 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.',
      waitlistWhatsappNumber: data.waitlistWhatsappNumber || '',
      waitlistWhatsappLink: data.waitlistWhatsappLink || '',
    };

    if (context.env.DB) {
      await ensureWorkshopsTable(context.env.DB);

      await context.env.DB.prepare(`
        INSERT OR REPLACE INTO workshops (
          id, title, subtitle, date, schedule, modality, location,
          price, spots_available, total_spots, includes_json, image, description, benefits_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        data.title,
        data.subtitle || '',
        data.date,
        data.schedule,
        data.modality || 'Presencial',
        data.location,
        Number(data.price) || 0,
        Number(data.spotsAvailable) || 0,
        Number(data.totalSpots) || 0,
        JSON.stringify(Array.isArray(data.includes) ? data.includes : []),
        data.image || '',
        data.description || '',
        JSON.stringify(benefits)
      ).run();
    }

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestPut = async (context: { request: Request; env: Env }) => {
  try {
    const data = (await context.request.json()) as any;
    if (!data.id) {
      return new Response(JSON.stringify({ error: 'Workshop ID is required' }), { status: 400 });
    }

    const benefits = {
      benefits: Array.isArray(data.benefits) ? data.benefits : [],
      hasCoffeeBreak: data.hasCoffeeBreak !== undefined ? Boolean(data.hasCoffeeBreak) : (data.modality !== 'Virtual en Vivo'),
      coffeeBreakText: data.coffeeBreakText !== undefined ? data.coffeeBreakText : 'Coffee break artesanal con repostería dulce y bebidas.',
      hasToolsIncluded: data.hasToolsIncluded !== undefined ? Boolean(data.hasToolsIncluded) : true,
      toolsText: data.toolsText !== undefined ? data.toolsText : 'Uso ilimitado de herramientas de alta precisión durante el taller.',
      hasTakeHomeProject: data.hasTakeHomeProject !== undefined ? Boolean(data.hasTakeHomeProject) : true,
      takeHomeText: data.takeHomeText !== undefined ? data.takeHomeText : 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
      instructorName: data.instructorName || 'Fiorella Patricia Jara Gutiérrez (Fio)',
      instructorSubtitle: data.instructorSubtitle || 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.',
      waitlistWhatsappNumber: data.waitlistWhatsappNumber || '',
      waitlistWhatsappLink: data.waitlistWhatsappLink || '',
    };

    if (context.env.DB) {
      await ensureWorkshopsTable(context.env.DB);

      await context.env.DB.prepare(`
        UPDATE workshops SET
          title = ?,
          subtitle = ?,
          date = ?,
          schedule = ?,
          modality = ?,
          location = ?,
          price = ?,
          spots_available = ?,
          total_spots = ?,
          includes_json = ?,
          image = ?,
          description = ?,
          benefits_json = ?
        WHERE id = ?
      `).bind(
        data.title,
        data.subtitle || '',
        data.date,
        data.schedule,
        data.modality || 'Presencial',
        data.location,
        Number(data.price) || 0,
        Number(data.spotsAvailable) || 0,
        Number(data.totalSpots) || 0,
        JSON.stringify(Array.isArray(data.includes) ? data.includes : []),
        data.image || '',
        data.description || '',
        JSON.stringify(benefits),
        data.id
      ).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const isReset = url.searchParams.get('reset') === 'true';

    if (context.env.DB) {
      await ensureWorkshopsTable(context.env.DB);

      if (isReset) {
        await context.env.DB.prepare('DELETE FROM workshops').run();
        for (const ws of DEFAULT_WORKSHOPS) {
          const benefitsJson = JSON.stringify({
            hasCoffeeBreak: ws.hasCoffeeBreak,
            coffeeBreakText: ws.coffeeBreakText,
            hasToolsIncluded: ws.hasToolsIncluded,
            toolsText: ws.toolsText,
            hasTakeHomeProject: ws.hasTakeHomeProject,
            takeHomeText: ws.takeHomeText,
            instructorName: ws.instructorName,
            instructorSubtitle: ws.instructorSubtitle,
          });

          await context.env.DB.prepare(`
            INSERT INTO workshops (
              id, title, subtitle, date, schedule, modality, location,
              price, spots_available, total_spots, includes_json, image, description, benefits_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            ws.id,
            ws.title,
            ws.subtitle,
            ws.date,
            ws.schedule,
            ws.modality,
            ws.location,
            ws.price,
            ws.spotsAvailable,
            ws.totalSpots,
            JSON.stringify(ws.includes),
            ws.image,
            ws.description,
            benefitsJson
          ).run().catch(() => {});
        }
        return new Response(JSON.stringify({ success: true, reset: true }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (id) {
        await context.env.DB.prepare('DELETE FROM workshops WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true, deleted: id }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Missing id parameter' }), { status: 400 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
