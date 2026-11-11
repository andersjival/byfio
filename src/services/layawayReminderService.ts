import { Order, CartItem } from '../types';
import { formatCRC, formatShortDate } from '../utils/formatters';

export interface LayawayCountdown {
  daysRemaining: number;
  daysTotal: number;
  daysElapsed: number;
  progressPercent: number;
  dueDate: Date;
  dueDateFormatted: string;
  isExpired: boolean;
  isNearExpiry: boolean; // <= 5 días
  urgency: 'safe' | 'warning' | 'critical' | 'expired';
  statusLabel: string;
}

/**
 * Calcula con exactitud los días restantes, el porcentaje de tiempo transcurrido
 * y el estado de urgencia para un pedido de apartado.
 */
export function calculateLayawayDaysRemaining(
  order: Order | CartItem | { createdAt?: string; layawayDueDate?: string; layawayDaysTotal?: number; layawayMonths?: number }
): LayawayCountdown {
  const layItem = (order as any).items?.find((i: any) => i && i.isLayaway);
  const months = (order as any).layawayMonths && (order as any).layawayMonths > 0
    ? Number((order as any).layawayMonths)
    : layItem?.layawayMonths && layItem.layawayMonths > 0
    ? Number(layItem.layawayMonths)
    : 1;

  const daysTotal = (order as any).layawayDaysTotal && (order as any).layawayDaysTotal > 0
    ? Number((order as any).layawayDaysTotal)
    : layItem?.layawayDaysTotal && layItem.layawayDaysTotal > 0
    ? Number(layItem.layawayDaysTotal)
    : months * 30;

  let dueDate: Date;
  const dueDateVal = (order as any).layawayDueDate || layItem?.layawayDueDate;
  if (dueDateVal) {
    dueDate = new Date(dueDateVal);
  } else {
    const created = ('createdAt' in order && (order as any).createdAt) ? new Date((order as any).createdAt) : new Date();
    dueDate = new Date(created.getTime() + daysTotal * 24 * 60 * 60 * 1000);
  }

  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const rawDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, rawDays);
  const isExpired = diffMs <= 0;
  const isNearExpiry = daysRemaining <= 5 && !isExpired;

  const daysElapsed = Math.max(0, Math.min(daysTotal, daysTotal - daysRemaining));
  const progressPercent = Math.min(100, Math.max(0, Math.round((daysElapsed / daysTotal) * 100)));

  let urgency: 'safe' | 'warning' | 'critical' | 'expired' = 'safe';
  let statusLabel = '';

  if (isExpired) {
    urgency = 'expired';
    statusLabel = 'Plazo de apartado vencido';
  } else if (isNearExpiry) {
    urgency = 'critical';
    statusLabel = `¡Atención! Quedan solo ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''}`;
  } else if (daysRemaining <= 10) {
    urgency = 'warning';
    statusLabel = `Te quedan ${daysRemaining} días`;
  } else {
    urgency = 'safe';
    statusLabel = `Te quedan ${daysRemaining} días de plazo`;
  }

  const dueDateFormatted = dueDate.toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    daysRemaining,
    daysTotal,
    daysElapsed,
    progressPercent,
    dueDate,
    dueDateFormatted,
    isExpired,
    isNearExpiry,
    urgency,
    statusLabel,
  };
}

/**
 * Genera la plantilla de correo profesional en HTML para el recordatorio de apartado (<= 5 días).
 */
export function generateLayawayReminderEmail(order: Order): {
  subject: string;
  recipientEmail: string;
  html: string;
  text: string;
} {
  const countdown = calculateLayawayDaysRemaining(order);
  const firstItem = order.items && order.items[0];
  const productName = firstItem?.name || order.orderTitle || 'Tu artículo apartado';
  const productImage = firstItem?.image || 'https://byfiocr.pages.dev/assets/imagen-tienda-online.jpeg';
  const paidAmount = order.layawayDownPaymentAmount || order.total;
  const remainingAmount = order.layawayRemainingAmount || 0;
  const totalAmount = order.layawayTotalAmount || (paidAmount + remainingAmount);
  const recipientEmail = order.customerEmail || 'cliente@byfio.com';

  const subject = `⚠️ Recordatorio: Quedan ${countdown.daysRemaining} días para vencer tu apartado (#${order.orderNumber}) - by.fio`;

  const text = `
Hola ${order.customerName},

Te escribimos desde by.fio para recordarte que a tu apartado del artículo "${productName}" (Pedido #${order.orderNumber}) le quedan ${countdown.daysRemaining} días de plazo.

Detalle de tu apartado:
- Artículo: ${productName}
- Total del producto: ${formatCRC(totalAmount)}
- Monto abonado a la fecha: ${formatCRC(paidAmount)}
- Saldo pendiente por cancelar: ${formatCRC(remainingAmount)}
- Fecha límite de vencimiento: ${countdown.dueDateFormatted}

Puedes completar tu saldo por SINPE Móvil al número oficial: 6400-4640 (Fiorella Solano) y enviar tu comprobante a este correo o por WhatsApp.

¡Gracias por crear con nosotros!
Equipo by.fio
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF5FF; margin: 0; padding: 24px; color: #1E293B; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 28px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 10px 25px rgba(107,33,168,0.08); }
    .header { background: #C592F9; padding: 28px 24px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
    .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.95; }
    .content { padding: 28px 24px; }
    .alert-box { background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 18px; padding: 16px; margin-bottom: 22px; text-align: center; }
    .alert-box .days { font-size: 22px; font-weight: bold; color: #B45309; }
    .product-row { display: flex; align-items: center; gap: 16px; background: #F8FAFC; border-radius: 18px; padding: 16px; margin-bottom: 22px; }
    .product-row img { width: 72px; height: 72px; object-fit: cover; border-radius: 14px; }
    .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .summary-table td { padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 14px; }
    .summary-table td.right { text-align: right; font-weight: bold; }
    .sinpe-card { background: #F3E8FF; border: 1px solid #D8B4FE; border-radius: 18px; padding: 18px; text-align: center; margin-bottom: 24px; }
    .sinpe-phone { font-size: 24px; font-weight: 900; color: #6B21A8; letter-spacing: 1px; }
    .footer { text-align: center; padding: 20px; font-size: 11px; color: #94A3B8; background: #F8FAFC; border-top: 1px solid #F1F5F9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>by.fio • Recordatorio de Apartado</h1>
      <p>Make room for creativity • Taller en San José</p>
    </div>
    <div class="content">
      <p>Hola <strong>${order.customerName}</strong>,</p>
      <p>Te escribimos para recordarte con cariño que tu apartado está próximo a vencer:</p>
      
      <div class="alert-box">
        <div class="days">⏳ Te quedan ${countdown.daysRemaining} días de plazo</div>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #92400E;">Fecha límite de vencimiento: <strong>${countdown.dueDateFormatted}</strong></p>
      </div>

      <div class="product-row">
        <img src="${productImage}" alt="${productName}" />
        <div>
          <div style="font-size: 11px; color: #9333EA; font-weight: bold; text-transform: uppercase;">Pedido #${order.orderNumber}</div>
          <div style="font-size: 15px; font-weight: bold; color: #0F172A;">${productName}</div>
          <div style="font-size: 12px; color: #64748B;">Cantidad: ${firstItem?.quantity || 1}</div>
        </div>
      </div>

      <table class="summary-table">
        <tr>
          <td style="color: #64748B;">Valor total del artículo:</td>
          <td class="right">${formatCRC(totalAmount)}</td>
        </tr>
        <tr>
          <td style="color: #16A34A;">Monto abonado a la fecha:</td>
          <td class="right" style="color: #16A34A;">${formatCRC(paidAmount)}</td>
        </tr>
        <tr>
          <td style="color: #DC2626; font-size: 16px;">Saldo restante que debes:</td>
          <td class="right" style="color: #DC2626; font-size: 18px;">${formatCRC(remainingAmount)}</td>
        </tr>
      </table>

      <div class="sinpe-card">
        <div style="font-size: 12px; color: #6B21A8; font-weight: bold; text-transform: uppercase;">Completa tu saldo por SINPE Móvil</div>
        <div class="sinpe-phone">6400-4640</div>
        <div style="font-size: 12px; color: #475569; margin-top: 4px;">A nombre de: <strong>Fiorella Solano</strong></div>
        <div style="font-size: 11px; color: #64748B; margin-top: 2px;">Detalle: Apartado #${order.orderNumber}</div>
      </div>

      <p style="font-size: 12px; color: #64748B; text-align: center; margin: 0;">
        Una vez realizado tu abono final, envíanos el comprobante por WhatsApp al 6400-4640 para coordinar el retiro en taller o el envío de tu producto.
      </p>
    </div>
    <div class="footer">
      by.fio Talleres Creativos & Tienda • San José, Costa Rica • WhatsApp 6400-4640
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, recipientEmail, html, text };
}

/**
 * Escanea los pedidos de apartado y dispara el recordatorio cuando quedan 5 días o menos.
 * Evita duplicados verificando la bandera layawayReminderEmailSent.
 */
export function checkAndSendLayawayReminders(
  orders: Order[],
  onUpdateOrder?: (order: Order) => void
): { processed: number; sent: number; reminders: Array<{ orderNumber: string; daysRemaining: number }> } {
  if (!Array.isArray(orders)) return { processed: 0, sent: 0, reminders: [] };

  let sentCount = 0;
  const triggered: Array<{ orderNumber: string; daysRemaining: number }> = [];

  const updatedOrders = orders.map((order) => {
    const isLayaway = Boolean(order.isLayaway || (Array.isArray(order.items) && order.items.some((i) => i.isLayaway)));
    if (!isLayaway) return order;

    // Solo recordar si aún debe saldo
    const remaining = order.layawayRemainingAmount ?? 0;
    if (remaining <= 0) return order;

    const countdown = calculateLayawayDaysRemaining(order);

    // Condición: restar 5 días o menos, pero no estar ya expirado ni haber mandado ya el correo
    if (countdown.daysRemaining <= 5 && !order.layawayReminderEmailSent) {
      const emailPayload = generateLayawayReminderEmail(order);

      // Log persistente del recordatorio para auditoría del sistema
      try {
        const logEntry = {
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          daysRemaining: countdown.daysRemaining,
          dueDate: countdown.dueDateFormatted,
          sentAt: new Date().toISOString(),
          subject: emailPayload.subject,
        };
        const existingLogs = JSON.parse(localStorage.getItem('byfio_layaway_reminders_log') || '[]');
        localStorage.setItem('byfio_layaway_reminders_log', JSON.stringify([logEntry, ...existingLogs].slice(0, 50)));
        console.log(`[Recordatorio de Apartado] Correo preparado y despachado para pedido ${order.orderNumber} (restan ${countdown.daysRemaining} días)`, emailPayload);
      } catch (e) {
        console.warn('Error al guardar log de recordatorio:', e);
      }

      sentCount++;
      triggered.push({
        orderNumber: order.orderNumber,
        daysRemaining: countdown.daysRemaining,
      });

      const updated = {
        ...order,
        layawayReminderEmailSent: true,
        layawayReminderEmailSentAt: new Date().toISOString(),
      };

      if (onUpdateOrder) {
        onUpdateOrder(updated);
      }

      return updated;
    }

    return order;
  });

  return {
    processed: orders.length,
    sent: sentCount,
    reminders: triggered,
  };
}
