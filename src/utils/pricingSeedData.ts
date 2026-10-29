import { PricingSectionData } from '../types';

export const INITIAL_PRICING_DATA: PricingSectionData = {
  title: 'LISTA DE PRECIOS • STICKERS & PERSONALIZADOS',
  subtitle: 'Calidad prémium, acabados resistentes y regalitos especiales en cada paquete ✨',
  categories: [
    {
      id: 'cat-5x5',
      title: 'STICKERS 5X5',
      subtitle: 'Medida 5x5 cm — Ideales para empaques, vasitos, cajas y termos',
      note: 'Las regalías son de tamaño 3x3',
      tiers: [
        { id: 't-5x5-1', quantity: 15, price: 1000, giftText: '4–5 regalías (3x3)' },
        { id: 't-5x5-2', quantity: 75, price: 5000, giftText: '20–25 regalías (3x3)', badge: 'Más Vendido' },
        { id: 't-5x5-3', quantity: 105, price: 7500, giftText: '28–35 regalías (3x3)' },
        { id: 't-5x5-4', quantity: 150, price: 9500, giftText: '40–50 regalías (3x3)', badge: 'Mejor Ahorro' },
      ],
    },
    {
      id: 'cat-4x4',
      title: 'STICKERS 4X4',
      subtitle: 'Medida 4x4 cm — Ideales para sellos de empaque, bolsas y etiquetas circulares',
      note: 'Pregunta por nuestros servicios de diseño',
      tiers: [
        { id: 't-4x4-1', quantity: 24, price: 1000 },
        { id: 't-4x4-2', quantity: 120, price: 5000, badge: 'Popular' },
        { id: 't-4x4-3', quantity: 168, price: 7500 },
        { id: 't-4x4-4', quantity: 240, price: 9500, badge: 'Máximo Rendimiento' },
      ],
    },
  ],
  howToOrderTitle: '¿CÓMO REALIZAR EL PEDIDO?',
  howToOrderSubtitle: 'Paso a paso para personalizar tus stickers o artículos',
  howToOrderSteps: [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Envía tu logo o producto deseado',
      description: 'Escríbenos al WhatsApp 6400-4640 con tu logo listo o pregúntanos por nuestros servicios de diseño personalizado.',
      highlight: 'WhatsApp 6400-4640',
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Afina todos los detalles',
      description: 'Elige la medida, cantidad y acabados. Bríndanos tu nombre completo y datos para registrar tu pedido.',
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Depósito de adelanto del 50%',
      description: 'Haz el depósito del 50% de adelanto para asegurar tu espacio de producción (si es con envío por Correos de Costa Rica se cancela el 100%).',
      highlight: '50% o 100% envío',
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Envía el comprobante de pago',
      description: 'Envía la foto o captura del comprobante por SINPE Móvil (6400-4640) o transferencia bancaria BCR para confirmar tu orden.',
      highlight: 'SINPE 6400-4640',
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'Revisión y aprobación final',
      description: 'Recibirás el trabajo realizado para revisarlo y comunicarnos si quieres alguna modificación (se pueden realizar hasta 2 cambios).',
      highlight: 'Hasta 2 cambios',
    },
  ],
};
