interface Env {
  DB?: any;
}

interface SinpeDbRow {
  id: string;
  reference_number: string;
  origin_phone: string;
  origin_name: string;
  origin_bank: string;
  amount: number;
  description: string;
  transaction_date: string;
  category: string;
  workshop_id?: string;
  workshop_title?: string;
  order_id?: string;
  status: string;
  raw_email?: string;
  created_at: string;
}

const mapRowToTransaction = (r: SinpeDbRow) => ({
  id: r.id,
  referenceNumber: r.reference_number,
  originPhone: r.origin_phone,
  originName: r.origin_name,
  originBank: r.origin_bank,
  amount: r.amount,
  description: r.description,
  transactionDate: r.transaction_date,
  category: (r.category === 'workshop' ? 'workshop' : 'store') as 'store' | 'workshop',
  workshopId: r.workshop_id || undefined,
  workshopTitle: r.workshop_title || undefined,
  orderId: r.order_id || undefined,
  status: 'verified' as const,
  rawEmail: r.raw_email || undefined,
  createdAt: r.created_at,
});

const ensureTableExists = async (db: any) => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS sinpe_transactions (
      id TEXT PRIMARY KEY,
      reference_number TEXT UNIQUE NOT NULL,
      origin_phone TEXT NOT NULL,
      origin_name TEXT NOT NULL,
      origin_bank TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      transaction_date TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'store',
      workshop_id TEXT,
      workshop_title TEXT,
      order_id TEXT,
      status TEXT NOT NULL DEFAULT 'verified',
      raw_email TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), { status: 500 });
    }

    await ensureTableExists(context.env.DB);

    const { results } = await context.env.DB.prepare(
      'SELECT * FROM sinpe_transactions ORDER BY created_at DESC'
    ).all();

    const transactions = (results || []).map(mapRowToTransaction);
    return new Response(JSON.stringify(transactions), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), { status: 500 });
    }

    await ensureTableExists(context.env.DB);

    const body: any = await context.request.json();
    const {
      id,
      referenceNumber,
      originPhone,
      originName,
      originBank,
      amount,
      description,
      transactionDate,
      category = 'store',
      workshopId = null,
      workshopTitle = null,
      orderId = null,
      status = 'verified',
      rawEmail = null,
    } = body;

    if (!referenceNumber || !amount) {
      return new Response(
        JSON.stringify({ error: 'Número de referencia y monto son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Verificación Estricta de No Duplicidad
    const existing = await context.env.DB.prepare(
      'SELECT id, reference_number FROM sinpe_transactions WHERE reference_number = ?'
    ).bind(referenceNumber).first();

    if (existing) {
      return new Response(
        JSON.stringify({
          error: 'Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.',
          duplicate: true,
          existingId: existing.id,
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const txId = id || `sinpe-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const nowIso = new Date().toISOString();

    await context.env.DB.prepare(`
      INSERT INTO sinpe_transactions (
        id, reference_number, origin_phone, origin_name, origin_bank,
        amount, description, transaction_date, category,
        workshop_id, workshop_title, order_id, status, raw_email, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      txId,
      referenceNumber,
      originPhone || 'Desconocido',
      originName || 'Cliente SINPE BCR',
      originBank || 'Banco de Costa Rica',
      amount,
      description || 'Pago SINPE Móvil BCR',
      transactionDate || nowIso,
      category,
      workshopId,
      workshopTitle,
      orderId,
      status,
      rawEmail,
      nowIso
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Transacción SINPE BCR acreditada con éxito.',
        transaction: {
          id: txId,
          referenceNumber,
          originPhone,
          originName,
          originBank,
          amount,
          description,
          transactionDate: transactionDate || nowIso,
          category,
          workshopId,
          workshopTitle,
          orderId,
          status,
          createdAt: nowIso,
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestDelete = async (context: { env: Env; request: Request }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), { status: 500 });
    }

    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID es requerido' }), { status: 400 });
    }

    await context.env.DB.prepare('DELETE FROM sinpe_transactions WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
