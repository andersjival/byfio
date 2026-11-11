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
  delivered_at?: string;
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

const healString = (val: string | undefined | null): string => {
  if (!val) return '';
  return val
    .replace(/Sof[\uFFFD]a/g, 'Sofía')
    .replace(/Jos[\uFFFD]/g, 'José')
    .replace(/jos[\uFFFD]/g, 'josé')
    .replace(/port[\uFFFD]n/g, 'portón')
    .replace(/cumplea[\uFFFD]os/g, 'cumpleaños')
    .replace(/cumplea[\uFFFD]o/g, 'cumpleaño')
    .replace(/ci[\uFFFD]n/g, 'ción')
    .replace(/CI[\uFFFD]N/g, 'CIÓN')
    .replace(/si[\uFFFD]n/g, 'sión')
    .replace(/SI[\uFFFD]N/g, 'SIÓN')
    .replace(/m[\uFFFD]s/g, 'más')
    .replace(/d[\uFFFD]a/g, 'día')
    .replace(/a[\uFFFD]o/g, 'año')
    .replace(/a[\uFFFD]os/g, 'años')
    .replace(/dise[\uFFFD]o/g, 'diseño')
    .replace(/[\uFFFD]/g, '');
};

const mapRowToOrder = (r: OrderDbRow) => {
  let items = [];
  try {
    const rawItems = JSON.parse(r.items_json || '[]');
    items = Array.isArray(rawItems)
      ? rawItems.map((it: any) => ({
          ...it,
          name: healString(it.name),
          customText: it.customText ? healString(it.customText) : it.customText,
          shelfLocation: it.shelfLocation ? healString(it.shelfLocation) : it.shelfLocation,
        }))
      : [];
  } catch {
    items = [];
  }

  const rawOrderNum = (r.order_number || '').replace(/^#+/, '');
  const cleanOrderNum = rawOrderNum ? `#${rawOrderNum}` : '#FIO';

  const laySaleItem = items.find((it: any) => it.isLayawaySale || it.saleCategory === 'Ventas de apartados');
  const isLayawaySale = Boolean(laySaleItem);
  const firstLay = isLayawaySale ? undefined : items.find((it: any) => it.isLayaway);
  const isLayaway = Boolean(!isLayawaySale && firstLay);

  const payments = Array.isArray(firstLay?.layawayPayments) ? firstLay.layawayPayments : [];
  const sumOfAbonos = payments.reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);
  const initialCheckoutPayment = Number(r.total) || 0;

  const downPayment = payments.length > 0
    ? initialCheckoutPayment + sumOfAbonos
    : (Number(firstLay?.layawayDownPaymentAmount) || initialCheckoutPayment);

  let totalAmount = Number(firstLay?.layawayTotalAmount) || 0;
  if (!totalAmount) {
    totalAmount = Number(firstLay?.price) > initialCheckoutPayment
      ? Number(firstLay.price)
      : (downPayment + (Number(firstLay?.layawayRemainingAmount) || 0));
  }
  if (totalAmount < downPayment) {
    totalAmount = downPayment;
  }

  const remainingDebt = Math.max(0, totalAmount - downPayment);

  return {
    id: r.id,
    orderNumber: cleanOrderNum,
    customerName: healString(r.customer_name),
    customerPhone: r.customer_phone,
    customerEmail: r.customer_email,
    deliveryMethod: r.delivery_method,
    shippingAddress: r.shipping_address ? healString(r.shipping_address) : undefined,
    paymentMethod: r.payment_method,
    paymentStatus: r.payment_status,
    orderStatus: r.order_status,
    items,
    subtotal: r.subtotal,
    shippingFee: r.shipping_fee,
    total: r.total,
    notes: r.notes ? healString(r.notes) : undefined,
    pickedBy: r.picked_by ? healString(r.picked_by) : undefined,
    pickedAt: r.picked_at ? normalizeIsoDate(r.picked_at) : undefined,
    packedAt: r.packed_at ? normalizeIsoDate(r.packed_at) : undefined,
    deliveredAt: r.delivered_at ? normalizeIsoDate(r.delivered_at) : undefined,
    createdAt: normalizeIsoDate(r.created_at),
    isLayaway,
    layawayMonths: firstLay?.layawayMonths,
    layawayPaymentsCount: firstLay?.layawayPaymentsCount,
    layawayDownPaymentPercent: firstLay?.layawayDownPaymentPercent,
    layawayTotalAmount: totalAmount || undefined,
    layawayDownPaymentAmount: isLayaway ? downPayment : undefined,
    layawayRemainingAmount: isLayaway ? remainingDebt : undefined,
    layawayDueDate: firstLay?.layawayDueDate,
    layawayDaysTotal: firstLay?.layawayDaysTotal,
    layawayPayments: Array.isArray(firstLay?.layawayPayments) ? firstLay.layawayPayments : [],
    ...(isLayawaySale
      ? {
          orderTitle: 'Ventas de apartados',
          isLayawaySale: true,
          saleCategory: laySaleItem?.saleCategory || 'Ventas de apartados',
          layawaySourceOrderId: laySaleItem?.layawaySourceOrderId,
          layawaySourceOrderNumber: laySaleItem?.layawaySourceOrderNumber,
        }
      : (r.notes && r.notes.includes('Facturación Rápida POS')) ||
          (r.customer_name === 'Cliente Mostrador' && r.customer_phone === '0000-0000')
        ? { orderTitle: 'Facturación Rápida POS' }
        : {}),
    ...(firstLay?.layawayGeneratedSaleOrderId
      ? {
          layawaySaleOrderId: firstLay.layawayGeneratedSaleOrderId,
          layawayCompletedAt: firstLay.layawayGeneratedSaleCreatedAt,
        }
      : {}),
  };
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify([]), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    const { results } = await context.env.DB.prepare(
      'SELECT * FROM orders ORDER BY created_at DESC'
    ).all();

    const orders = (results as OrderDbRow[] || []).map(mapRowToOrder);
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
      try { await context.env.DB.prepare('ALTER TABLE orders ADD COLUMN picked_by TEXT').run(); } catch {}
      try { await context.env.DB.prepare('ALTER TABLE orders ADD COLUMN picked_at TEXT').run(); } catch {}
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
      const rawPostNum = (order.orderNumber || '').replace(/^#+/, '');
      let safeOrderNumber = rawPostNum ? `#${rawPostNum}` : '';
      if (!safeOrderNumber || hasNumberCollision) {
        safeOrderNumber = `#FIO-${dbMaxNum + 1}`;
      }

      // 1b. Verificar si la orden es nueva antes de insertar para descontar cupos de talleres de forma atómica (cero doble cobro)
      const existingOrderRow = await context.env.DB.prepare(
        'SELECT id FROM orders WHERE id = ? LIMIT 1'
      ).bind(order.id).first();
      const isBrandNewOrder = !existingOrderRow;

      // 2. Inserción segura con ON CONFLICT(id) para que NUNCA reemplace ni borre pedidos ajenos
      await context.env.DB.prepare(
        `INSERT INTO orders (
          id, order_number, customer_name, customer_phone, customer_email,
          delivery_method, shipping_address, payment_method, payment_status,
          order_status, items_json, subtotal, shipping_fee, total, notes, packed_at, picked_by, picked_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          packed_at = excluded.packed_at,
          picked_by = COALESCE(excluded.picked_by, orders.picked_by),
          picked_at = COALESCE(excluded.picked_at, orders.picked_at)`
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
        order.pickedBy || null,
        order.pickedAt || null,
        order.createdAt || new Date().toISOString()
      ).run();

      let workshopUpdates: { id: string; spotsAvailable: number; totalSpots: number }[] = [];
      if (isBrandNewOrder && Array.isArray(order.items)) {
        const wsItems = order.items.filter((it: any) => it && it.type === 'workshop');
        if (wsItems.length > 0) {
          for (const it of wsItems) {
            const qty = Math.max(1, Math.floor(Number(it.quantity) || 1));
            const rawSkuId = it.sku ? String(it.sku).replace(/^WS-/i, '').trim() : '';
            const candidates = Array.from(new Set([
              it.workshopId ? String(it.workshopId).trim() : '',
              rawSkuId,
              it.id && !String(it.id).startsWith('ord-item-') ? String(it.id).trim() : '',
            ].filter(Boolean)));

            let updated = 0;
            for (const cand of candidates) {
              try {
                const res = await context.env.DB.prepare(
                  'UPDATE workshops SET spots_available = MAX(0, spots_available - ?) WHERE LOWER(id) = LOWER(?)'
                ).bind(qty, cand).run();
                updated = res?.meta?.changes || 0;
                if (updated > 0) break;
              } catch {}
            }
            if (updated === 0 && it.name) {
              try {
                await context.env.DB.prepare(
                  'UPDATE workshops SET spots_available = MAX(0, spots_available - ?) WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))'
                ).bind(qty, String(it.name).trim()).run();
              } catch {}
            }
          }
          try {
            const { results: wsRows } = await context.env.DB.prepare(
              'SELECT id, spots_available, total_spots FROM workshops'
            ).all();
            if (Array.isArray(wsRows)) {
              workshopUpdates = wsRows.map((w: any) => ({
                id: w.id,
                spotsAvailable: Number(w.spots_available) || 0,
                totalSpots: Number(w.total_spots) || 0,
              }));
            }
          } catch {}
        }
      }

      return new Response(JSON.stringify({ success: true, orderNumber: safeOrderNumber, workshopUpdates }), {
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
    const { id, orderStatus, packedAt, deliveredAt, items, subtotal, total, notes, pickedBy, pickedAt } = await context.request.json() as any;
    if (context.env.DB) {
      try { await context.env.DB.prepare('ALTER TABLE orders ADD COLUMN picked_by TEXT').run(); } catch {}
      try { await context.env.DB.prepare('ALTER TABLE orders ADD COLUMN picked_at TEXT').run(); } catch {}
    }

    if (context.env.DB && id) {
      // Blindaje estricto de backend: No permitir avanzar a packing, packed o delivered sin 100% alisto
      if (orderStatus === 'packing' || orderStatus === 'packed' || orderStatus === 'delivered') {
        let checkItems = items;
        if (!checkItems || !Array.isArray(checkItems) || checkItems.length === 0) {
          const { results } = await context.env.DB.prepare('SELECT items_json FROM orders WHERE id = ?').bind(id).all();
          if (results && results.length > 0) {
            try {
              checkItems = JSON.parse((results[0] as any).items_json || '[]');
            } catch {
              checkItems = [];
            }
          }
        }
        const isComplete = Array.isArray(checkItems) && checkItems.length > 0 && checkItems.every((it: any) => it.isPicked || it.isMissing);
        if (!isComplete) {
          return new Response(JSON.stringify({ error: 'Order cannot transition to packing/packed/delivered without 100% picking' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
          });
        }
      }

      if (items !== undefined && Array.isArray(items) && items.length > 0) {
        await context.env.DB.prepare(
          `UPDATE orders SET
            order_status = COALESCE(?, order_status),
            packed_at = COALESCE(?, packed_at),
            delivered_at = COALESCE(?, delivered_at),
            items_json = ?,
            subtotal = COALESCE(?, subtotal),
            total = COALESCE(?, total),
            notes = COALESCE(?, notes),
            picked_by = COALESCE(?, picked_by),
            picked_at = COALESCE(?, picked_at)
          WHERE id = ?`
        ).bind(
          orderStatus || null,
          packedAt || null,
          deliveredAt || null,
          JSON.stringify(items),
          subtotal !== undefined ? subtotal : null,
          total !== undefined ? total : null,
          notes || null,
          pickedBy || null,
          pickedAt || null,
          id
        ).run();
      } else {
        await context.env.DB.prepare(
          `UPDATE orders SET
            order_status = COALESCE(?, order_status),
            packed_at = COALESCE(?, packed_at),
            delivered_at = COALESCE(?, delivered_at),
            subtotal = COALESCE(?, subtotal),
            total = COALESCE(?, total),
            notes = COALESCE(?, notes),
            picked_by = COALESCE(?, picked_by),
            picked_at = COALESCE(?, picked_at)
          WHERE id = ?`
        ).bind(
          orderStatus || null,
          packedAt || null,
          deliveredAt || null,
          subtotal !== undefined ? subtotal : null,
          total !== undefined ? total : null,
          notes || null,
          pickedBy || null,
          pickedAt || null,
          id
        ).run();
      }
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
    const all = url.searchParams.get('all');

    if (!context.env.DB) {
      return new Response(JSON.stringify({ success: true, localOnly: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (id) {
      let workshopUpdates: { id: string; spotsAvailable: number; totalSpots: number }[] = [];
      if (url.searchParams.get('restoreSpots') !== 'false') {
        try {
          const existingOrder: any = await context.env.DB.prepare(
            'SELECT items_json, order_status FROM orders WHERE id = ? LIMIT 1'
          ).bind(id).first();
          if (existingOrder && existingOrder.order_status !== 'delivered') {
            const parsedItems = JSON.parse(existingOrder.items_json || '[]');
            const wsItems = Array.isArray(parsedItems)
              ? parsedItems.filter((it: any) => it && it.type === 'workshop')
              : [];
            if (wsItems.length > 0) {
              for (const it of wsItems) {
                const qty = Math.max(1, Math.floor(Number(it.quantity) || 1));
                const rawSkuId = it.sku ? String(it.sku).replace(/^WS-/i, '').trim() : '';
                const candidates = Array.from(new Set([
                  it.workshopId ? String(it.workshopId).trim() : '',
                  rawSkuId,
                  it.id && !String(it.id).startsWith('ord-item-') ? String(it.id).trim() : '',
                ].filter(Boolean)));
                let restored = 0;
                for (const cand of candidates) {
                  const res = await context.env.DB.prepare(
                    'UPDATE workshops SET spots_available = MIN(total_spots, spots_available + ?) WHERE LOWER(id) = LOWER(?)'
                  ).bind(qty, cand).run();
                  restored = res?.meta?.changes || 0;
                  if (restored > 0) break;
                }
                if (restored === 0 && it.name) {
                  await context.env.DB.prepare(
                    'UPDATE workshops SET spots_available = MIN(total_spots, spots_available + ?) WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))'
                  ).bind(qty, String(it.name).trim()).run();
                }
              }
              const { results: wsRows } = await context.env.DB.prepare(
                'SELECT id, spots_available, total_spots FROM workshops'
              ).all();
              if (Array.isArray(wsRows)) {
                workshopUpdates = wsRows.map((w: any) => ({
                  id: w.id,
                  spotsAvailable: Number(w.spots_available) || 0,
                  totalSpots: Number(w.total_spots) || 0,
                }));
              }
            }
          }
        } catch {}
      }
      await context.env.DB.prepare('DELETE FROM orders WHERE id = ?').bind(id).run();
      if (workshopUpdates.length > 0) {
        return new Response(JSON.stringify({ success: true, deletedId: id, workshopUpdates }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ success: true, deletedId: id }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (all === 'true') {
      await context.env.DB.prepare('DELETE FROM orders').run();
      return new Response(JSON.stringify({ success: true, clearedAll: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Missing id or all=true parameter' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
