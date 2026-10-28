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
  packedAt: r.packed_at,
  createdAt: r.created_at,
});

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), { status: 500 });
    }

    const { results } = await context.env.DB.prepare(
      'SELECT * FROM orders ORDER BY created_at ASC'
    ).all();

    const orders = (results as OrderDbRow[]).map(mapRowToOrder);
    return new Response(JSON.stringify(orders), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const order = await context.request.json() as any;

    if (context.env.DB) {
      await context.env.DB.prepare(
        `INSERT OR REPLACE INTO orders (
          id, order_number, customer_name, customer_phone, customer_email,
          delivery_method, shipping_address, payment_method, payment_status,
          order_status, items_json, subtotal, shipping_fee, total, notes, packed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        order.id,
        order.orderNumber,
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
        order.packedAt || null
      ).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
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
