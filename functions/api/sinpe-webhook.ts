interface Env {
  DB?: any;
}

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

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), { status: 500 });
    }

    await ensureTableExists(context.env.DB);

    // Puede recibir JSON ({ text, from, subject }) o texto plano directo
    let rawContent = '';
    const contentType = context.request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data: any = await context.request.json();
      rawContent = data.text || data.body || data.content || JSON.stringify(data);
    } else {
      rawContent = await context.request.text();
    }

    if (!rawContent || !/SINPE\s*M[ÓO]VIL/i.test(rawContent)) {
      return new Response(
        JSON.stringify({ error: 'Payload no reconocido como correo de SINPE MÓVIL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extraer campos clave
    const refMatch = rawContent.match(/(?:N[úu]mero\s+de\s+referencia|Referencia|Comprobante)\s*[:=]\s*([A-Za-z0-9\-_]+)/i);
    const referenceNumber = refMatch ? refMatch[1].trim() : `REF-${Date.now()}`;

    const phoneMatch = rawContent.match(/Tel[ée]fono(?:\s+(?:de\s+)?origen)?\s*[:=]\s*([0-9\-\+\s\(\)]{8,16})/i);
    const originPhone = phoneMatch ? phoneMatch[1].trim() : 'Desconocido';

    const nameMatch = rawContent.match(/(?:Nombre(?:\s+del)?\s+cliente(?:\s+origen)?|Cliente\s+origen|De)\s*[:=]\s*([^\n\r]+)/i);
    const originName = nameMatch ? nameMatch[1].trim() : 'Cliente SINPE BCR';

    const bankMatch = rawContent.match(/(?:Entidad(?:\s+de)?\s+origen|Banco(?:\s+de)?\s+origen|Entidad)\s*[:=]\s*([^\n\r]+)/i);
    const originBank = bankMatch ? bankMatch[1].trim() : 'Banco de Costa Rica';

    let amount = 0;
    const amountMatch = rawContent.match(/Monto\s*[:=]\s*(?:₡|CRC|Colones)?\s*([0-9\.,]+)/i);
    if (amountMatch) {
      const rawVal = amountMatch[1].trim();
      amount = parseFloat(rawVal.replace(/,/g, ''));
    }

    const descMatch = rawContent.match(/(?:Motivo|Detalle|Concepto)\s*[:=]\s*([^\n\r]+)/i);
    const description = descMatch ? descMatch[1].trim() : 'Pago SINPE Móvil BCR';

    const dateMatch = rawContent.match(/(?:Fecha(?:\s+y\s+hora)?|Realizada\s+el)\s*[:=]\s*([^\n\r]+)/i);
    const transactionDate = dateMatch ? dateMatch[1].trim() : new Date().toLocaleString('es-CR');

    // Categorización automática
    const fullText = (description + ' ' + rawContent).toLowerCase();
    const isWorkshop = /taller|curso|clase|alumna|inscripci|cupo|encuadernaci|acuarela/i.test(fullText);
    const category = isWorkshop ? 'workshop' : 'store';

    // Verificación de duplicado
    const existing = await context.env.DB.prepare(
      'SELECT id FROM sinpe_transactions WHERE reference_number = ?'
    ).bind(referenceNumber).first();

    if (existing) {
      return new Response(
        JSON.stringify({
          error: `Referencia ${referenceNumber} ya registrada.`,
          duplicate: true,
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const txId = `sinpe-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const nowIso = new Date().toISOString();

    await context.env.DB.prepare(`
      INSERT INTO sinpe_transactions (
        id, reference_number, origin_phone, origin_name, origin_bank,
        amount, description, transaction_date, category, status, raw_email, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      txId,
      referenceNumber,
      originPhone,
      originName,
      originBank,
      amount,
      description,
      transactionDate,
      category,
      'verified',
      rawContent,
      nowIso
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Correo BCR procesado y acreditado automáticamente',
        transaction: {
          id: txId,
          referenceNumber,
          originName,
          originPhone,
          amount,
          category,
          status: 'verified',
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
