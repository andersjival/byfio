import { Product } from '../types';

/**
 * Determina si un producto es elegible para el Sistema de Apartados.
 * Aplica si tiene la propiedad hasLayaway activa o si su categoría es "Máquinas y Equipo"
 * (o variantes como maquina, máquina, equipo).
 */
export function isProductLayawayEligible(product: Product | null | undefined): boolean {
  if (!product) return false;
  if (product.hasLayaway) return true;
  const cat = (product.category || '').toLowerCase();
  return cat.includes('maquina') || cat.includes('máquina') || cat.includes('equipo');
}

export interface LayawayCalculation {
  months: number;
  paymentsCount: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  remainingAmount: number;
  remainingPaymentsCount: number;
  installmentAmount: number;
}

/**
 * Calcula con precisión los montos del plan de apartado:
 * - Primera cuota / Pago inicial
 * - Saldo pendiente
 * - Cantidad y monto de cada cuota restante
 */
export function getProductLayawayDetails(product: Product | null | undefined): LayawayCalculation {
  if (!product) {
    return {
      months: 3,
      paymentsCount: 3,
      downPaymentPercent: 30,
      downPaymentAmount: 0,
      remainingAmount: 0,
      remainingPaymentsCount: 2,
      installmentAmount: 0,
    };
  }

  const months = product.layawayMonths && product.layawayMonths > 0 ? Number(product.layawayMonths) : 3;
  const paymentsCount = product.layawayPaymentsCount && product.layawayPaymentsCount > 1 ? Number(product.layawayPaymentsCount) : 3;
  const downPaymentPercent = product.layawayDownPaymentPercent && product.layawayDownPaymentPercent > 0 ? Number(product.layawayDownPaymentPercent) : 30;

  const totalPrice = Number(product.price) || 0;
  const downPaymentAmount = Math.round(totalPrice * (downPaymentPercent / 100));
  const remainingAmount = Math.max(0, totalPrice - downPaymentAmount);
  const remainingPaymentsCount = Math.max(1, paymentsCount - 1);
  const installmentAmount = Math.round(remainingAmount / remainingPaymentsCount);

  return {
    months,
    paymentsCount,
    downPaymentPercent,
    downPaymentAmount,
    remainingAmount,
    remainingPaymentsCount,
    installmentAmount,
  };
}
