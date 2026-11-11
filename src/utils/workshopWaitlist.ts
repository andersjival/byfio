import { AuthUser, Workshop, WorkshopWaitlistEntry, WorkshopWaitlistSettings } from '../types';
import { getWhatsAppLink } from './formatters';

export const DEFAULT_WAITLIST_SETTINGS: WorkshopWaitlistSettings = {
  whatsappNumber: '64004640',
  whatsappGroupLink: '',
};

/** Normaliza enlaces de grupo de WhatsApp para asegurar protocolo válido */
export const normalizeWhatsappGroupLink = (raw?: string): string => {
  const clean = (raw || '').trim();
  if (!clean) return '';
  if (/^https?:\/\//i.test(clean)) return clean;
  if (/^(chat\.whatsapp\.com|wa\.me|whatsapp\.com)/i.test(clean)) {
    return `https://${clean}`;
  }
  return clean;
};

/** Resuelve la URL final de WhatsApp (link de grupo configurado o fallback a chat por número) */
export const resolveWaitlistWhatsappTarget = (
  workshop?: Pick<Workshop, 'title' | 'waitlistWhatsappLink' | 'waitlistWhatsappNumber'> | null,
  settings?: WorkshopWaitlistSettings | null,
  customMessage?: string
): { url: string; isGroupLink: boolean; whatsappNumber: string } => {
  const groupLink = normalizeWhatsappGroupLink(
    workshop?.waitlistWhatsappLink || settings?.whatsappGroupLink
  );
  const whatsappNumber = (
    workshop?.waitlistWhatsappNumber ||
    settings?.whatsappNumber ||
    DEFAULT_WAITLIST_SETTINGS.whatsappNumber
  ).trim();

  if (groupLink) {
    return { url: groupLink, isGroupLink: true, whatsappNumber };
  }

  const msg =
    customMessage ||
    `¡Hola Fio! 👋 Me acabo de anotar en la lista de espera del taller "${
      workshop?.title || 'Talleres Creativos by.fio'
    }" y quisiera agregame al grupo de lista de espera.`;

  return {
    url: getWhatsAppLink(whatsappNumber || '64004640', msg),
    isGroupLink: false,
    whatsappNumber,
  };
};

/** Compara si un registro de lista de espera pertenece al usuario autenticado (por correo o teléfono) */
export const matchesUserWaitlistEntry = (
  entry: WorkshopWaitlistEntry,
  user?: AuthUser | null
): boolean => {
  if (!user) return false;
  if (entry.status === 'cancelled' || entry.status === 'enrolled') return false;

  const userEmail = (user.email || '').trim().toLowerCase();
  const entryEmail = (entry.email || '').trim().toLowerCase();
  if (userEmail && entryEmail && userEmail === entryEmail) return true;

  const uDigits = (user.phone || '').replace(/\D/g, '');
  const eDigits = (entry.phone || '').replace(/\D/g, '');
  if (uDigits.length >= 8 && eDigits.length >= 8) {
    return uDigits.slice(-8) === eDigits.slice(-8);
  }
  return false;
};

/** Ordena entradas activas de un taller en orden cronológico de llegada (FIFO) y retorna la posición */
export const sortWaitlistFifo = (entries: WorkshopWaitlistEntry[]): WorkshopWaitlistEntry[] =>
  [...entries].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

export const getWaitlistTurnNumber = (
  entries: WorkshopWaitlistEntry[],
  workshopId: string,
  entryId: string
): number => {
  const ordered = sortWaitlistFifo(
    entries.filter(
      (e) => e.workshopId === workshopId && e.status !== 'cancelled'
    )
  );
  const idx = ordered.findIndex((e) => e.id === entryId);
  return idx >= 0 ? idx + 1 : ordered.length;
};
