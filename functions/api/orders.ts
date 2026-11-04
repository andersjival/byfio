interface Env {
  DB?: any;
}

interface OrderDbRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_method: string;
  shipping_address?: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  items_json: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  notes?: string;
  packed_at?: string;
  created_at: string;
}

const normalizeIsoDate = (val: string | undefined): string => {
  if (!val) return new Date().toISOString();
  // Si la fecha guardada en SQLite viene como "YYYY-MM-DD HH:MM:SS" (sin 'Z' ni offset),
  // SQLite datetime('now') la guardó en UTC; agregarle la 'Z' para que el navegador del usuario
  // la convierta exactamente a su hora local real (ej: 15:29 UTC -> 09:29 AM).
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val)) {
    return val.replace(' ', 'T') + 'Z';
  }
  return val;
};

const mapRowToOrder = (r: OrderDbRow) => ({
  id: r.id,
  orderNumber: r.order_number,
  customerName: r.customer_name,
  customerPhone: r.customer_phone,
  customerEmail: r.customer_email,
  deliveryMethod: r.delivery_method,
  shippingAddress: r.shipping_address,
  paymentMethod: r.payment_method,
  paymentStatus: r.payment_status,
  orderStatus: r.order_status,
  items: JSON.parse(r.items_json || '[]'),
  subtotal: r.subtotal,
  shippingFee: r.shipping_fee,
  total: r.total,
  notes: r.notes,
  packedAt: r.packed_at ? normalizeIsoDate(r.packed_at) : undefined,
  createdAt: normalizeIsoDate(r.created_at),
});

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), { status: 500 });
    }

    let { results } = await context.env.DB.prepare(
      'SELECT * FROM orders ORDER BY created_at ASC'
    ).all();

    // Solo si la base de datos de pedidos está completamente vacía, sembrar la orden fundacional #FIO-1001
    if (!results || results.length === 0) {
      try {
        await context.env.DB.prepare(
          `INSERT OR IGNORE INTO orders (
            id, order_number, customer_name, customer_phone, customer_email,
            delivery_method, shipping_address, payment_method, payment_status,
            order_status, items_json, subtotal, shipping_fee, total, notes, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          'ord-1001',
          '#FIO-1001',
          'Sofía Solano Brenes',
          '8845-2190',
          'sofia.solano@gmail.com',
          'envio',
          'Curridabat, San José, de la Pops 200m Sur, Casa 14A con portón blanco.',
          'sinpe',
          'paid',
          'pending',
          JSON.stringify([
            {
              id: 'item-101',
              type: 'product',
              sku: 'FIO-AG-01',
              name: 'Agenda Personalizada 2027 Tapa Dura',
              price: 18500,
              quantity: 1,
              shelfLocation: 'Estante A-1 (Nivel 2)',
              customText: 'Nombre: Sofía Solano / Portada Flores Lavanda',
              isPicked: false,
              image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=500&q=80',
            },
            {
              id: 'item-102',
              type: 'product',
              sku: 'FIO-TAZ-03',
              name: 'Taza Cerámica Sublimada con Inicial & Flores',
              price: 6500,
              quantity: 1,
              shelfLocation: 'Estante B-1 (Nivel 3)',
              customText: 'Letra S en color lila con borde dorado',
              isPicked: false,
              image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
            },
            {
              id: 'item-103',
              type: 'product',
              sku: 'FIO-STK-05',
              name: 'Pack 40 Stickers Holográficos Kawaii & Flores',
              price: 4500,
              quantity: 1,
              shelfLocation: 'Gaveta C-1 (Mostrador)',
              isPicked: false,
              image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=500&q=80',
            },
          ]),
          29500,
          2500,
          32000,
          'Empacar con tarjeta de cumpleaños para Sofi.',
          '2026-10-28T09:15:00.000Z'
        ).run();

        const refetched = await context.env.DB.prepare(
          'SELECT * FROM orders ORDER BY created_at ASC'
        ).all();
        results = refetched.results;
      } catch {}
    }

    const orders = (results as OrderDbRow[]).map(mapRowToOrder);
    return new Response(JSON.stringify(orders), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const order = await context.request.json() as any;

    if (context.env.DB) {
      // 1. Obtener todos los pedidos existentes para calcular el máximo correlativo real y blindar contra colisiones
      const { results: existingRows } = await context.env.DB.prepare(
        "SELECT id, order_number FROM orders WHERE order_number LIKE '#FIO-%'"
      ).all();

      let dbMaxNum = 1000;
      let hasNumberCollision = false;

      if (Array.isArray(existingRows)) {
        for (const row of existingRows as { id: string; order_number: string }[]) {
          const m = row.order_number?.match(/#?FIO-(\d+)/i);
          if (m) {
            const num = parseInt(m[1], 10);
            if (!isNaN(num) && num > dbMaxNum) dbMaxNum = num;
          }
          // Verificar si el número solicitado ya le pertenece a OTRO pedido distinto
          if (row.order_number === order.orderNumber && row.id !== order.id) {
            hasNumberCollision = true;
          }
        }
      }

      // Si no viene número de orden o si colisiona con otro pedido preexistente, asignar nuevo correlativo garantizado
      let safeOrderNumber = order.orderNumber;
      if (!safeOrderNumber || hasNumberCollision) {
        safeOrderNumber = `#FIO-${dbMaxNum + 1}`;
      }

      // 2. Inserción segura con ON CONFLICT(id) para que NUNCA reemplace ni borre pedidos ajenos
      await context.env.DB.prepare(
        `INSERT INTO orders (
          id, order_number, customer_name, customer_phone, customer_email,
          delivery_method, shipping_address, payment_method, payment_status,
          order_status, items_json, subtotal, shipping_fee, total, notes, packed_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          order_number = excluded.order_number,
          customer_name = excluded.customer_name,
          customer_phone = excluded.customer_phone,
          customer_email = excluded.customer_email,
          delivery_method = excluded.delivery_method,
          shipping_address = excluded.shipping_address,
          payment_method = excluded.payment_method,
          payment_status = excluded.payment_status,
          order_status = excluded.order_status,
          items_json = excluded.items_json,
          subtotal = excluded.subtotal,
          shipping_fee = excluded.shipping_fee,
          total = excluded.total,
          notes = excluded.notes,
          packed_at = excluded.packed_at`
      ).bind(
        order.id,
        safeOrderNumber,
        order.customerName,
        order.customerPhone,
        order.customerEmail || null,
        order.deliveryMethod,
        order.shippingAddress || null,
        order.paymentMethod,
        order.paymentStatus,
        order.orderStatus,
        JSON.stringify(order.items || []),
        order.subtotal,
        order.shippingFee,
        order.total,
        order.notes || null,
        order.packedAt || null,
        order.createdAt || new Date().toISOString()
      ).run();

      return new Response(JSON.stringify({ success: true, orderNumber: safeOrderNumber }), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    return new Response(JSON.stringify({ error: 'DB binding not available' }), { status: 500 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestPut = async (context: { request: Request; env: Env }) => {
  try {
    const { id, orderStatus, packedAt, items } = await context.request.json() as any;

    if (context.env.DB && id) {
      await context.env.DB.prepare(
        'UPDATE orders SET order_status = ?, packed_at = ?, items_json = ? WHERE id = ?'
      ).bind(
        orderStatus,
        packedAt || null,
        JSON.stringify(items || []),
        id
      ).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
