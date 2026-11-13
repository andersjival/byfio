/**
 * Generador de slug/username para clientes web registrados en by.fio
 * Formato requerido: maria21-ax (nombre base + número + sufijo corto)
 */
export const generateClientSlug = (name?: string, email?: string): string => {
  const rawBase = (name ? name.trim().split(/\s+/)[0] : (email ? email.split('@')[0] : 'cliente')).toLowerCase();
  const cleanBase = rawBase
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 10) || 'cliente';

  const matchNum = (email?.split('@')[0] || name || '').match(/\d{2,}/);
  const numPart = matchNum ? matchNum[0].slice(0, 2) : Math.floor(10 + Math.random() * 90).toString();

  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let suffix = '';
  for (let i = 0; i < 2; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const baseWithoutDigits = cleanBase.replace(/\d+$/, '');
  return `${baseWithoutDigits}${numPart}-${suffix}`;
};
