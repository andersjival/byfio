import { Customer, Order } from '../types';
import { isLayawayReservationOrder, isLayawaySaleOrder } from './layaway';

export const CUSTOMER_VIP_THRESHOLD_STORAGE_KEY = 'byfio_customer_vip_min_purchases_v1';
export const DEFAULT_VIP_MIN_PURCHASES = 3;

export interface CustomerPurchaseSummary {
  orders: Order[];
  count: number;
  totalSpent: number;
  lastPurchaseAt?: string;
  isVip: boolean;
  topRank?: number;
}

export const clampVipThreshold = (value: unknown): number => {
  const num = Math.floor(Number(value));
  if (!Number.isFinite(num) || num < 1) return DEFAULT_VIP_MIN_PURCHASES;
  return Math.min(999, num);
};

const normDigits = (val?: string): string => (val || '').replace(/\D/g, '');
const normText = (val?: string): string => (val || '').trim().toLowerCase().replace(/\s+/g, ' ');

const phonesMatch = (a: string, b: string): boolean => {
  if (!a || !b) return false;
  if (a === b) return true;
  return a.length >= 8 && b.length >= 8 && a.slice(-8) === b.slice(-8);
};

/**
 * Construye el resumen de compras por cliente (deduplicando reservas de apartados ya liquidadas),
 * calcula el monto total invertido, marca los clientes VIP y etiqueta el Top de mayores compradores.
 */
export const buildCustomerPurchaseMap = (
  customers: Customer[],
  orders: Order[],
  vipMinPurchases: number
): Map<string, CustomerPurchaseSummary> => {
  const liquidatedReservationIds = new Set<string>();
  orders.forEach((o) => {
    if (isLayawaySaleOrder(o)) {
      if (o.layawaySourceOrderId) liquidatedReservationIds.add(o.layawaySourceOrderId);
      o.items?.forEach((it) => {
        if (it.layawaySourceOrderId) liquidatedReservationIds.add(it.layawaySourceOrderId);
      });
    }
  });

  const activeOrders = orders.filter((o) => {
    if (!isLayawayReservationOrder(o)) return true;
    const alreadyLiquidated =
      liquidatedReservationIds.has(o.id) ||
      Boolean(o.layawaySaleOrderId) ||
      Boolean(o.items?.some((it) => Boolean(it.layawayGeneratedSaleOrderId)));
    return !alreadyLiquidated;
  });

  const threshold = clampVipThreshold(vipMinPurchases);
  const map = new Map<string, CustomerPurchaseSummary>();

  customers.forEach((cust) => {
    const cPhone = normDigits(cust.phone);
    const cEmail = normText(cust.email);
    const cName = normText(cust.name);

    const matched = activeOrders
      .filter((o) => {
        const oPhone = normDigits(o.customerPhone);
        const oEmail = normText(o.customerEmail);
        const oName = normText(o.customerName);
        return (
          phonesMatch(cPhone, oPhone) ||
          (cEmail !== '' && oEmail !== '' && cEmail === oEmail) ||
          (cName !== '' && oName !== '' && cName === oName)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const totalSpent = matched.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

    map.set(cust.id, {
      orders: matched,
      count: matched.length,
      totalSpent,
      lastPurchaseAt: matched[0]?.createdAt,
      isVip: matched.length >= threshold,
    });
  });

  // Etiquetar a los clientes que más han comprado (Top 1, 2 y 3 con al menos 1 compra)
  const ranked = Array.from(map.entries())
    .filter(([, s]) => s.count > 0)
    .sort((a, b) => (b[1].count !== a[1].count ? b[1].count - a[1].count : b[1].totalSpent - a[1].totalSpent));

  ranked.slice(0, 3).forEach(([custId, summary], idx) => {
    map.set(custId, { ...summary, topRank: idx + 1 });
  });

  return map;
};
