import { useState, useEffect, useRef, useCallback } from 'react';
import { EnviosTestProduct, EnviosCustomerForm, UberDeliveryState, UberDeliveryStep, UberDirectSettings } from '../types';
import { calculateUberQuote, MOCK_UBER_DRIVERS, getStoredUberSettings } from '../services/uberDirectService';

export const TEST_PRODUCTS: EnviosTestProduct[] = [
  {
    id: 'prod-test-uber-1',
    name: 'Caja de Regalo Artesanal Fio',
    subtitle: 'Edición Especial Papelería & Botánica',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    weightKg: 1.2,
    dimensions: { length: 25, width: 20, height: 12 },
    description: 'Caja con libreta empastada a mano, taza personalizada y set de stickers en papel lino.',
    badge: 'Prueba Uber Direct #1',
  },
  {
    id: 'prod-test-uber-2',
    name: 'Agenda Floral & Set de Papelería',
    subtitle: 'Colección 2027 Tapa Dura con Foil Dorado',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
    weightKg: 0.85,
    dimensions: { length: 22, width: 16, height: 5 },
    description: 'Agenda planificadora anual con espiral dorada, elástico lila y sobre interior para recuerdos.',
    badge: 'Prueba Uber Direct #2',
  },
];

const INITIAL_CUSTOMER: EnviosCustomerForm = {
  fullName: 'Mariana Brenes Castro',
  phone: '+506 8821 5490',
  email: 'mariana.brenes@ejemplo.com',
  province: 'San José',
  canton: 'Escazú',
  district: 'San Rafael',
  addressDetails: 'Condominio Altavista, Casa 14B, 200m oeste de Plaza Rolex.',
  deliveryNotes: 'Por favor llamar al llegar a la caseta del guarda. Tocar timbre 14B.',
};

const STEP_SEQUENCE: UberDeliveryStep[] = [
  'searching_driver',
  'driver_assigned',
  'pickup_in_progress',
  'pickup_complete',
  'dropoff_in_progress',
  'delivered',
];

export const useUberDirectDispatch = (settings: UberDirectSettings) => {
  const [selectedProduct, setSelectedProduct] = useState<EnviosTestProduct>(TEST_PRODUCTS[0]);
  const [customer, setCustomer] = useState<EnviosCustomerForm>(INITIAL_CUSTOMER);
  const [delivery, setDelivery] = useState<UberDeliveryState | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const autoPlayTimer = useRef<any>(null);

  const quote = calculateUberQuote(customer, selectedProduct);

  const startDispatch = useCallback(() => {
    const orderNum = `ORD-UBER-${Math.floor(100000 + Math.random() * 900000)}`;
    const deliveryId = `del_${Math.random().toString(36).substring(2, 11)}`;
    const nowIso = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const rawReq = {
      pickup: {
        store_name: settings.pickupLocation.storeName,
        phone_number: settings.pickupLocation.phoneNumber,
        address: `${settings.pickupLocation.streetAddress}, ${settings.pickupLocation.city}, CR`,
        instructions: settings.pickupLocation.pickupNotes,
      },
      dropoff: {
        name: customer.fullName,
        phone_number: customer.phone,
        address: `${customer.addressDetails}, ${customer.district}, ${customer.canton}, ${customer.province}`,
        instructions: customer.deliveryNotes,
      },
      manifest_items: [
        {
          name: selectedProduct.name,
          quantity: 1,
          price: selectedProduct.price,
          dimensions: selectedProduct.dimensions,
          weight: selectedProduct.weightKg,
        },
      ],
      fee: quote.fee,
      prep_time_minutes: settings.estimatedPrepMinutes,
      test_mode: settings.credentials.environment === 'sandbox',
    };

    const initialDelivery: UberDeliveryState = {
      orderId: orderNum,
      deliveryId,
      trackingUrl: `https://uberdirect.com/orders/${deliveryId}?token=demo_cr`,
      step: 'searching_driver',
      quoteFee: quote.fee,
      estimatedMinutes: quote.etaMinutes,
      driver: undefined,
      timeline: [
        {
          step: 'payment_confirmed',
          title: 'Pago Confirmado',
          timestamp: nowIso,
          description: 'Orden de prueba pagada y confirmada con éxito.',
        },
        {
          step: 'searching_driver',
          title: 'Solicitando Uber Direct',
          timestamp: nowIso,
          description: 'Despacho enviado a la red de repartidores Uber en el área.',
        },
      ],
      rawRequestPayload: rawReq,
      rawResponsePayload: {
        id: deliveryId,
        status: 'pending',
        fee: quote.fee,
        currency: 'CRC',
        tracking_url: `https://uberdirect.com/orders/${deliveryId}`,
        created_at: new Date().toISOString(),
      },
    };

    setDelivery(initialDelivery);
    setIsAutoPlaying(true);
  }, [customer, selectedProduct, quote, settings]);

  const advanceStep = useCallback(() => {
    setDelivery((prev) => {
      if (!prev) return null;
      const curIdx = STEP_SEQUENCE.indexOf(prev.step);
      if (curIdx === -1 || curIdx >= STEP_SEQUENCE.length - 1) return prev;

      const nextStep = STEP_SEQUENCE[curIdx + 1];
      const nowIso = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const driver = prev.driver || MOCK_UBER_DRIVERS[0];

      const stepTitles: Record<UberDeliveryStep, { title: string; desc: string }> = {
        idle: { title: 'Listo', desc: '' },
        quote_ready: { title: 'Cotizado', desc: '' },
        payment_confirmed: { title: 'Pago Aprobado', desc: '' },
        requesting: { title: 'Solicitando', desc: '' },
        searching_driver: { title: 'Buscando Repartidor', desc: 'Buscando conductor cercano en la red Uber Direct...' },
        driver_assigned: { title: 'Conductor Asignado', desc: `${driver.name} aceptó el viaje en ${driver.vehicleModel} (${driver.licensePlate}).` },
        pickup_in_progress: { title: 'En Camino a Tienda By.Fio', desc: `${driver.name} está viajando hacia la tienda para retirar el paquete.` },
        pickup_complete: { title: 'Paquete Recolectado en Tienda', desc: 'El repartidor verificó y retiró los artículos en el mostrador.' },
        dropoff_in_progress: { title: 'En Camino al Cliente', desc: `El repartidor se dirige a ${customer.canton}, ${customer.province}.` },
        delivered: { title: '¡Entrega Completada!', desc: 'El paquete fue entregado exitosamente con confirmación digital.' },
        cancelled: { title: 'Entrega Cancelada', desc: 'La solicitud de entrega fue cancelada.' },
      };

      const info = stepTitles[nextStep] || { title: nextStep, desc: '' };
      return {
        ...prev,
        step: nextStep,
        driver,
        timeline: [...prev.timeline, { step: nextStep, title: info.title, timestamp: nowIso, description: info.desc }],
        rawResponsePayload: { ...prev.rawResponsePayload, status: nextStep, updated_at: new Date().toISOString() },
      };
    });
  }, [customer]);

  useEffect(() => {
    if (!isAutoPlaying || !delivery) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      return;
    }

    if (delivery.step === 'delivered' || delivery.step === 'cancelled') {
      setIsAutoPlaying(false);
      return;
    }

    autoPlayTimer.current = setInterval(() => {
      advanceStep();
    }, 4000);

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isAutoPlaying, delivery?.step, advanceStep]);

  const cancelDelivery = useCallback(() => {
    setIsAutoPlaying(false);
    setDelivery((prev) => {
      if (!prev) return null;
      const nowIso = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return {
        ...prev,
        step: 'cancelled',
        timeline: [...prev.timeline, { step: 'cancelled', title: 'Entrega Cancelada', timestamp: nowIso, description: 'La entrega de Uber Direct fue cancelada por el operador.' }],
      };
    });
  }, []);

  const resetFlow = useCallback(() => {
    setIsAutoPlaying(false);
    setDelivery(null);
  }, []);

  return {
    selectedProduct,
    setSelectedProduct,
    customer,
    setCustomer,
    quote,
    delivery,
    isAutoPlaying,
    setIsAutoPlaying,
    startDispatch,
    advanceStep,
    cancelDelivery,
    resetFlow,
  };
};
