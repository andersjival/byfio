interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  BREVO_API_KEY?: string;
  BREVO_SENDER_EMAIL?: string;
  MAILCHANNELS_API_KEY?: string;
  EMAIL_WEBHOOK_URL?: string;
}

interface WaitlistDbRow {
  id: string;
  workshop_id: string;
  workshop_title: string;
  workshop_date?: string;
  name: string;
  email: string;
  phone: string;
  id_card?: string;
  address?: string;
  created_at: string;
  status: string;
  email_sent: number;
  email_provider?: string;
  email_sent_at?: string;
  notified_at?: string;
  spot_notification_sent: number;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

const DEFAULT_SETTINGS = {
  whatsappNumber: '64004640',
  whatsappGroupLink: '',
};

const ensureWaitlistTables = async (db: any) => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS workshop_waitlist (
      id TEXT PRIMARY KEY,
      workshop_id TEXT NOT NULL,
      workshop_title TEXT NOT NULL,
      workshop_date TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      id_card TEXT,
      address TEXT,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'waiting',
      email_sent INTEGER NOT NULL DEFAULT 0,
      email_provider TEXT,
      email_sent_at TEXT,
      notified_at TEXT,
      spot_notification_sent INTEGER NOT NULL DEFAULT 0
    );
  `).run().catch(() => {});

  await db.prepare(
    'CREATE TABLE IF NOT EXISTS site_metrics (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)'
  ).run().catch(() => {});
};

const mapRow = (r: WaitlistDbRow) => ({
  id: r.id,
  workshopId: r.workshop_id,
  workshopTitle: r.workshop_title,
  workshopDate: r.workshop_date || '',
  name: r.name,
  email: r.email,
  phone: r.phone,
  idCard: r.id_card || '',
  address: r.address || '',
  createdAt: r.created_at,
  status: (r.status || 'waiting') as 'waiting' | 'notified' | 'enrolled' | 'cancelled',
  emailSent: Boolean(r.email_sent),
  emailProvider: r.email_provider || '',
  emailSentAt: r.email_sent_at || '',
  notifiedAt: r.notified_at || '',
  spotNotificationSent: Boolean(r.spot_notification_sent),
});

const loadSettings = async (db: any) => {
  if (!db) return { ...DEFAULT_SETTINGS };
  try {
    const row: any = await db
      .prepare("SELECT data FROM site_metrics WHERE id = 'app_workshop_waitlist_settings' LIMIT 1")
      .first();
    if (row?.data) {
      const parsed = JSON.parse(row.data);
      return {
        whatsappNumber: String(parsed?.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber).trim(),
        whatsappGroupLink: String(parsed?.whatsappGroupLink || '').trim(),
        updatedAt: parsed?.updatedAt,
      };
    }
  } catch {}
  return { ...DEFAULT_SETTINGS };
};

const buildWaitlistEmail = (params: {
  kind: 'joined' | 'spot_opened';
  name: string;
  workshopTitle: string;
  workshopDate: string;
  position: number;
  whatsappUrl: string;
}) => {
  const { kind, name, workshopTitle, workshopDate, position, whatsappUrl } = params;
  const isOpened = kind === 'spot_opened';

  const subject = isOpened
    ? `🎉 ¡Se liberó un cupo en ${workshopTitle}! - by.fio`
    : `✅ Lista de espera confirmada: ${workshopTitle} (Turno #${position}) - by.fio`;

  const headline = isOpened
    ? '¡Se liberó un cupo para el taller!'
    : '¡Estás en la Lista de Espera Oficial!';

  const bodyCopy = isOpened
    ? `Tenemos excelentes noticias: se acaba de liberar un cupo para <strong>${workshopTitle}</strong>${workshopDate ? ` (${workshopDate})` : ''}. Ingresa cuanto antes al taller o escríbenos al grupo de WhatsApp para asegurar tu espacio.`
    : `Hemos registrado tus datos correctamente en el turno <strong>#${position}</strong> para <strong>${workshopTitle}</strong>${workshopDate ? ` (${workshopDate})` : ''}. Mantente pendiente de tu correo electrónico y únete al grupo de WhatsApp de lista de espera para enterarte al instante cuando se libere un cupo.`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background:#FAF5FF; padding:24px; color:#1E293B; margin:0;">
  <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:24px; border:1px solid #E9D5FF; overflow:hidden;">
    <div style="background:linear-gradient(135deg,#8E54E9,#FF7597); padding:26px 24px; text-align:center; color:#ffffff;">
      <h1 style="margin:0; font-size:21px;">by.fio • Talleres Creativos</h1>
      <p style="margin:6px 0 0 0; font-size:13px; opacity:0.95;">${headline}</p>
    </div>
    <div style="padding:26px 24px; font-size:14px; line-height:1.6;">
      <p style="margin-top:0;">Hola <strong>${name}</strong>,</p>
      <p>${bodyCopy}</p>
      ${
        whatsappUrl
          ? `<div style="text-align:center; margin:24px 0;">
               <a href="${whatsappUrl}" style="display:inline-block; background:#16A34A; color:#ffffff; text-decoration:none; font-weight:bold; padding:12px 24px; border-radius:14px;">
                 Agregarse al Grupo de WhatsApp
               </a>
             </div>`
          : ''
      }
      <p style="font-size:12px; color:#64748B; margin-bottom:0;">
        También puedes consultar tu estado en la sección <strong>Mi Cuenta</strong> de nuestra tienda web.
      </p>
    </div>
  </div>
</body>
</html>`;

  const text = `Hola ${name},\n\n${
    isOpened
      ? `¡Se liberó un cupo para el taller "${workshopTitle}" (${workshopDate})!`
      : `Confirmamos tu ingreso en la lista de espera (Turno #${position}) para "${workshopTitle}" (${workshopDate}).`
  }\nMantente pendiente de tu correo y del grupo de WhatsApp: ${whatsappUrl}\n\nEquipo by.fio`;

  return { subject, html, text };
};

const dispatchEmail = async (
  env: Env,
  to: string,
  email: { subject: string; html: string; text: string }
): Promise<{ sent: boolean; provider: string; error?: string }> => {
  if (!to || !to.includes('@')) {
    return { sent: false, provider: 'none', error: 'Correo inválido' };
  }

  if (env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL || 'BYFIO Talleres <onboarding@resend.dev>',
          to: [to],
          subject: email.subject,
          html: email.html,
          text: email.text,
        }),
      });
      if (res.ok) return { sent: true, provider: 'resend' };
      const errTxt = await res.text().catch(() => '');
      return { sent: false, provider: 'resend', error: `HTTP ${res.status}: ${errTxt.slice(0, 120)}` };
    } catch (err: any) {
      return { sent: false, provider: 'resend', error: err?.message || 'Error Resend' };
    }
  }

  if (env.BREVO_API_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'by.fio Talleres', email: env.BREVO_SENDER_EMAIL || 'fio@byfiocr.com' },
          to: [{ email: to }],
          subject: email.subject,
          htmlContent: email.html,
          textContent: email.text,
        }),
      });
      if (res.ok) return { sent: true, provider: 'brevo' };
      return { sent: false, provider: 'brevo', error: `HTTP ${res.status}` };
    } catch (err: any) {
      return { sent: false, provider: 'brevo', error: err?.message || 'Error Brevo' };
    }
  }

  if (env.EMAIL_WEBHOOK_URL) {
    try {
      const res = await fetch(env.EMAIL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, ...email }),
      });
      if (res.ok) return { sent: true, provider: 'webhook' };
      return { sent: false, provider: 'webhook', error: `HTTP ${res.status}` };
    } catch (err: any) {
      return { sent: false, provider: 'webhook', error: err?.message || 'Error Webhook' };
    }
  }

  if (env.MAILCHANNELS_API_KEY) {
    try {
      const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
          'X-Api-Key': env.MAILCHANNELS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: 'notificaciones@byfiocr.pages.dev', name: 'by.fio Talleres' },
          subject: email.subject,
          content: [
            { type: 'text/plain', value: email.text },
            { type: 'text/html', value: email.html },
          ],
        }),
      });
      if (res.ok) return { sent: true, provider: 'mailchannels' };
      return { sent: false, provider: 'mailchannels', error: `HTTP ${res.status}` };
    } catch (err: any) {
      return { sent: false, provider: 'mailchannels', error: err?.message || 'Error MailChannels' };
    }
  }

  return { sent: false, provider: 'unconfigured', error: 'Sin proveedor SMTP/API configurado en Cloudflare' };
};

export const onRequestOptions = async () => new Response(null, { status: 204, headers: CORS_HEADERS });

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    const workshopId = url.searchParams.get('workshopId');
    const emailFilter = url.searchParams.get('email')?.trim().toLowerCase();

    if (!context.env.DB) {
      return new Response(JSON.stringify({ entries: [], settings: DEFAULT_SETTINGS }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    await ensureWaitlistTables(context.env.DB);
    const settings = await loadSettings(context.env.DB);

    let query = 'SELECT * FROM workshop_waitlist ORDER BY created_at ASC';
    const bindings: string[] = [];
    if (workshopId && emailFilter) {
      query = 'SELECT * FROM workshop_waitlist WHERE workshop_id = ? AND LOWER(email) = ? ORDER BY created_at ASC';
      bindings.push(workshopId, emailFilter);
    } else if (workshopId) {
      query = 'SELECT * FROM workshop_waitlist WHERE workshop_id = ? ORDER BY created_at ASC';
      bindings.push(workshopId);
    } else if (emailFilter) {
      query = 'SELECT * FROM workshop_waitlist WHERE LOWER(email) = ? ORDER BY created_at ASC';
      bindings.push(emailFilter);
    }

    const stmt = bindings.length > 0 ? context.env.DB.prepare(query).bind(...bindings) : context.env.DB.prepare(query);
    const { results } = await stmt.all();
    const entries = ((results || []) as WaitlistDbRow[]).map(mapRow);

    return new Response(JSON.stringify({ entries, settings }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ entries: [], settings: DEFAULT_SETTINGS, error: err?.message }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body: any = await context.request.json().catch(() => ({}));
    const action = body?.action || 'join';

    if (context.env.DB) {
      await ensureWaitlistTables(context.env.DB);
    }

    if (action === 'save_settings') {
      const whatsappNumber = String(body?.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber).trim();
      const whatsappGroupLink = String(body?.whatsappGroupLink || '').trim();
      const updatedAt = new Date().toISOString();
      const nextSettings = { whatsappNumber, whatsappGroupLink, updatedAt };

      if (context.env.DB) {
        await context.env.DB.prepare(
          'INSERT INTO site_metrics (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
        ).bind('app_workshop_waitlist_settings', JSON.stringify(nextSettings), updatedAt).run();
      }

      return new Response(JSON.stringify({ success: true, settings: nextSettings }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'notify_spot_opened') {
      const workshopId = String(body?.workshopId || '').trim();
      const targetEntryId = body?.entryId ? String(body.entryId).trim() : null;
      const settings = await loadSettings(context.env.DB);
      const whatsappUrl = String(body?.whatsappUrl || settings.whatsappGroupLink || '').trim() || `https://wa.me/506${settings.whatsappNumber.replace(/\D/g, '')}`;
      const nowIso = new Date().toISOString();
      const notifiedIds: string[] = [];
      let emailSentCount = 0;

      if (context.env.DB && workshopId) {
        const sql = targetEntryId
          ? "SELECT * FROM workshop_waitlist WHERE id = ? AND status != 'cancelled' ORDER BY created_at ASC"
          : "SELECT * FROM workshop_waitlist WHERE workshop_id = ? AND status = 'waiting' ORDER BY created_at ASC";
        const { results } = await context.env.DB.prepare(sql).bind(targetEntryId || workshopId).all();
        const rows = (results || []) as WaitlistDbRow[];

        for (let i = 0; i < rows.length; i++) {
          const r = rows[i];
          const emailPayload = buildWaitlistEmail({
            kind: 'spot_opened',
            name: r.name,
            workshopTitle: body?.workshopTitle || r.workshop_title,
            workshopDate: body?.workshopDate || r.workshop_date || '',
            position: i + 1,
            whatsappUrl,
          });
          const dispatch = await dispatchEmail(context.env, r.email, emailPayload);
          if (dispatch.sent) emailSentCount++;

          await context.env.DB.prepare(
            "UPDATE workshop_waitlist SET status = 'notified', notified_at = ?, spot_notification_sent = 1 WHERE id = ?"
          ).bind(nowIso, r.id).run();
          notifiedIds.push(r.id);
        }
      }

      return new Response(
        JSON.stringify({ success: true, notifiedCount: notifiedIds.length, emailSentCount, notifiedIds, notifiedAt: nowIso }),
        { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // Default action: 'join'
    const workshopId = String(body?.workshopId || '').trim();
    const workshopTitle = String(body?.workshopTitle || 'Taller Creativo by.fio').trim();
    const workshopDate = String(body?.workshopDate || '').trim();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const phone = String(body?.phone || '').trim();
    const idCard = String(body?.idCard || '').trim();
    const address = String(body?.address || '').trim();

    if (!workshopId || !name || !email || !phone) {
      return new Response(JSON.stringify({ success: false, error: 'Nombre, correo y teléfono son requeridos.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const settings = await loadSettings(context.env.DB);
    const whatsappUrl = String(body?.whatsappUrl || settings.whatsappGroupLink || '').trim() ||
      `https://wa.me/506${(settings.whatsappNumber || '64004640').replace(/\D/g, '')}`;

    let entry: ReturnType<typeof mapRow> = {
      id: body?.id || `wl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      workshopId,
      workshopTitle,
      workshopDate,
      name,
      email,
      phone,
      idCard,
      address,
      createdAt: body?.createdAt || new Date().toISOString(),
      status: 'waiting' as const,
      emailSent: false,
      emailProvider: '',
      emailSentAt: '',
      spotNotificationSent: false,
    };

    let position = 1;

    if (context.env.DB) {
      const existing: any = await context.env.DB.prepare(
        "SELECT * FROM workshop_waitlist WHERE workshop_id = ? AND LOWER(email) = ? AND status IN ('waiting', 'notified') LIMIT 1"
      ).bind(workshopId, email).first();

      if (existing) {
        entry = mapRow(existing as WaitlistDbRow);
      } else {
        await context.env.DB.prepare(`
          INSERT INTO workshop_waitlist (
            id, workshop_id, workshop_title, workshop_date, name, email, phone, id_card, address, created_at, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          entry.id, entry.workshopId, entry.workshopTitle, entry.workshopDate,
          entry.name, entry.email, entry.phone, entry.idCard, entry.address, entry.createdAt, 'waiting'
        ).run();
      }

      const { results: activeRows } = await context.env.DB.prepare(
        "SELECT id FROM workshop_waitlist WHERE workshop_id = ? AND status != 'cancelled' ORDER BY created_at ASC"
      ).bind(workshopId).all();
      const idx = (activeRows || []).findIndex((row: any) => row.id === entry.id);
      position = idx >= 0 ? idx + 1 : Math.max(1, (activeRows || []).length);
    }

    const emailPayload = buildWaitlistEmail({
      kind: 'joined',
      name: entry.name,
      workshopTitle: entry.workshopTitle,
      workshopDate: entry.workshopDate,
      position,
      whatsappUrl,
    });
    const emailDispatch = await dispatchEmail(context.env, entry.email, emailPayload);

    if (context.env.DB) {
      const sentAt = new Date().toISOString();
      entry.emailSent = emailDispatch.sent;
      entry.emailProvider = emailDispatch.provider;
      entry.emailSentAt = sentAt;
      await context.env.DB.prepare(
        'UPDATE workshop_waitlist SET email_sent = ?, email_provider = ?, email_sent_at = ? WHERE id = ?'
      ).bind(emailDispatch.sent ? 1 : 0, emailDispatch.provider, sentAt, entry.id).run().catch(() => {});
    }

    return new Response(JSON.stringify({ success: true, entry, position, settings, emailDispatch }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message || 'Error en lista de espera' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  try {
    const id = new URL(context.request.url).searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Missing id' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    if (context.env.DB) {
      await ensureWaitlistTables(context.env.DB);
      await context.env.DB.prepare('DELETE FROM workshop_waitlist WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, id }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
};
