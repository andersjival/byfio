import { Order, EtfOrderData, EtfFileAttachment, EtfProductionStatus } from '../types';

const ETF_TAG_PREFIX = '[ETF_DATA:';
const ETF_TAG_SUFFIX = ']';

export const isEtfOrder = (order: Order): boolean => {
  if (order.etfData?.isEtfOrder) return true;
  if (order.notes && order.notes.includes(ETF_TAG_PREFIX)) return true;
  return order.items?.some(item => {
    const text = `${item.name} ${item.sku || ''}`.toLowerCase();
    return text.includes('etf') || text.includes('dtf');
  }) ?? false;
};

export const extractEtfData = (order: Order): EtfOrderData => {
  if (order.etfData && (order.etfData.requirement || (order.etfData.files && order.etfData.files.length > 0))) {
    return { ...order.etfData, isEtfOrder: true };
  }
  if (order.notes && order.notes.includes(ETF_TAG_PREFIX)) {
    try {
      const start = order.notes.indexOf(ETF_TAG_PREFIX) + ETF_TAG_PREFIX.length;
      const end = order.notes.indexOf(ETF_TAG_SUFFIX, start);
      if (end > start) {
        const parsed = JSON.parse(order.notes.substring(start, end));
        return { ...parsed, isEtfOrder: true };
      }
    } catch {
      // fallback if parse fails
    }
  }
  return {
    isEtfOrder: isEtfOrder(order),
    requirement: order.etfData?.requirement || '',
    files: order.etfData?.files || [],
    productionStatus: order.etfData?.productionStatus || 'pending_files',
  };
};

export const encodeEtfInNotes = (notes: string | undefined, data: EtfOrderData): string => {
  const cleanNotes = (notes || '').replace(/\[ETF_DATA:[^\]]*\]/g, '').trim();
  const serialized = `${ETF_TAG_PREFIX}${JSON.stringify(data)}${ETF_TAG_SUFFIX}`;
  return cleanNotes ? `${cleanNotes}\n${serialized}` : serialized;
};

export const downloadEtfFile = (file: EtfFileAttachment) => {
  const link = document.createElement('a');
  link.href = file.url;
  link.download = file.name || 'archivo_etf';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadAllEtfFiles = async (files: EtfFileAttachment[], orderNumber: string) => {
  if (!files || files.length === 0) return;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    setTimeout(() => {
      downloadEtfFile({
        ...file,
        name: file.name.startsWith(orderNumber) ? file.name : `${orderNumber}_${file.name}`,
      });
    }, i * 350);
  }
};

export const getEtfStatusBadge = (status?: EtfProductionStatus): { label: string; bg: string; text: string; border: string } => {
  switch (status) {
    case 'files_received':
      return { label: 'Archivos Recibidos', bg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-300', border: 'border-blue-400/40' };
    case 'in_production':
      return { label: 'En Impresión / Producción', bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-300', border: 'border-amber-400/40' };
    case 'ready':
      return { label: 'Listo para Entrega', bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-300', border: 'border-emerald-400/40' };
    case 'delivered':
      return { label: 'Entregado al Cliente', bg: 'bg-slate-500/15', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-400/30' };
    case 'pending_files':
    default:
      return { label: 'Pendiente de Archivos', bg: 'bg-rose-500/15', text: 'text-rose-600 dark:text-rose-300', border: 'border-rose-400/40' };
  }
};
