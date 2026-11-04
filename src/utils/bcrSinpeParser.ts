/**
 * Parser especializado para Notificaciones de Transacción SINPE MÓVIL del Banco de Costa Rica (BCR)
 * Remitente oficial: mensajero@bancobcr.com
 * Título/Asunto: "SINPE MÓVIL: Notificación de transacción realizada"
 */

import { SinpeTransaction } from '../types';

export interface BcrParsedResult {
  isValidBcrEmail: boolean;
  referenceNumber: string;
  originPhone: string;
  originName: string;
  originBank: string;
  amount: number;
  description: string;
  transactionDate: string;
  category: 'store' | 'workshop';
  detectedWorkshopId?: string;
  errors: string[];
}

export const parseBcrSinpeEmail = (
  rawText: string,
  availableWorkshops: { id: string; title: string }[] = []
): BcrParsedResult => {
  const errors: string[] = [];
  const text = rawText || '';

  // 1. Verificación básica de que corresponda a SINPE MÓVIL del BCR
  const hasSinpeMovil = /SINPE\s*M[ÓO]VIL/i.test(text);
  const isFromBcr = /bancobcr\.com|bcr|banco\s+de\s+costa\s+rica/i.test(text);

  if (!hasSinpeMovil) {
    errors.push('El texto no contiene el encabezado obligatorio "SINPE MÓVIL".');
  }

  // 2. Extracción de Número de Referencia (Único y Obligatorio)
  // Patrones: "Número de referencia: 12345678", "Referencia: 12345678", "N° Referencia: 12345678"
  let referenceNumber = '';
  const refMatch = text.match(/(?:N[úu]mero\s+de\s+referencia|Referencia|N[°º]\s*de\s*referencia|Comprobante)\s*[:=]\s*([A-Za-z0-9\-_]+)/i);
  if (refMatch && refMatch[1]) {
    referenceNumber = refMatch[1].trim();
  } else {
    // Intento fallback: buscar códigos numéricos largos de 8 a 20 dígitos tras la palabra referencia
    const refFallback = text.match(/referencia[^\d]*(\d{6,24})/i);
    if (refFallback && refFallback[1]) {
      referenceNumber = refFallback[1].trim();
    } else {
      errors.push('No se encontró el Número de Referencia de la transacción.');
    }
  }

  // 3. Extracción de Teléfono de Origen
  // Patrones: "Teléfono origen: 8888-8888", "Teléfono de origen: 88888888"
  let originPhone = '';
  const phoneMatch = text.match(/Tel[ée]fono(?:\s+(?:de\s+)?origen)?\s*[:=]\s*([0-9\-\+\s\(\)]{8,16})/i);
  if (phoneMatch && phoneMatch[1]) {
    originPhone = phoneMatch[1].trim().replace(/\s+/g, ' ');
  } else {
    // Fallback: buscar formato costarricense común 8 dígitos (ej: 8888-8888 o 88888888)
    const phoneFallback = text.match(/\b([5-8]\d{3}[-\s]?\d{4})\b/);
    originPhone = phoneFallback ? phoneFallback[1].trim() : 'No especificado';
  }

  // 4. Extracción de Nombre del Cliente Origen
  // Patrones: "Nombre cliente origen: JUAN PEREZ", "Nombre del cliente origen: ...", "Cliente origen: ..."
  let originName = '';
  const nameMatch = text.match(/(?:Nombre(?:\s+del)?\s+cliente(?:\s+origen)?|Cliente\s+origen|De|Ordenante)\s*[:=]\s*([^\n\r]+)/i);
  if (nameMatch && nameMatch[1]) {
    originName = nameMatch[1].trim().replace(/\s{2,}/g, ' ');
  } else {
    originName = 'Cliente SINPE BCR';
  }

  // 5. Extracción de Entidad Origen (Banco)
  // Patrones: "Entidad origen: BANCO NACIONAL", "Entidad de origen: ...", "Banco origen: ..."
  let originBank = '';
  const bankMatch = text.match(/(?:Entidad(?:\s+de)?\s+origen|Banco(?:\s+de)?\s+origen|Instituci[óo]n\s+origen|Entidad)\s*[:=]\s*([^\n\r]+)/i);
  if (bankMatch && bankMatch[1]) {
    originBank = bankMatch[1].trim().replace(/\s{2,}/g, ' ');
  } else {
    originBank = 'Banco de Costa Rica (BCR)';
  }

  // 6. Extracción de Monto (₡)
  // Patrones: "Monto: ₡15,000.00", "Monto: CRC 15,000.00", "Monto: 15000"
  let amount = 0;
  const amountMatch = text.match(/Monto\s*[:=]\s*(?:₡|CRC|Colones)?\s*([0-9\.,]+)/i);
  if (amountMatch && amountMatch[1]) {
    const rawVal = amountMatch[1].trim();
    // Limpieza de formato numérico de Costa Rica / Internacional
    // Si viene como "15,000.00" o "15.000,00" o "15000"
    if (rawVal.includes(',') && rawVal.includes('.')) {
      // Formato standard 15,000.00
      amount = parseFloat(rawVal.replace(/,/g, ''));
    } else if (rawVal.includes(',')) {
      // Podría ser miles "15,000" o decimal "15000,00"
      const parts = rawVal.split(',');
      if (parts[1] && parts[1].length === 2) {
        amount = parseFloat(parts[0].replace(/\./g, '') + '.' + parts[1]);
      } else {
        amount = parseFloat(rawVal.replace(/,/g, ''));
      }
    } else {
      amount = parseFloat(rawVal);
    }
  } else {
    // Fallback: buscar símbolo de colones seguido de cifras
    const colonesMatch = text.match(/[₡]\s*([0-9\.,]+)/);
    if (colonesMatch && colonesMatch[1]) {
      amount = parseFloat(colonesMatch[1].replace(/,/g, ''));
    } else {
      errors.push('No se pudo identificar el Monto de la transferencia.');
    }
  }

  // 7. Extracción de Motivo / Detalle
  // Patrones: "Motivo: Agenda Dra Valeria", "Detalle: ...", "Concepto: ..."
  let description = '';
  const descMatch = text.match(/(?:Motivo|Detalle|Concepto|Descripci[óo]n)\s*[:=]\s*([^\n\r]+)/i);
  if (descMatch && descMatch[1]) {
    description = descMatch[1].trim();
  } else {
    description = 'Pago SINPE Móvil BCR';
  }

  // 8. Extracción de Fecha y Hora
  // Patrones: "Fecha y hora: 04/11/2026 14:35:10", "Fecha: 04/11/2026"
  let transactionDate = '';
  const dateMatch = text.match(/(?:Fecha(?:\s+y\s+hora)?|Realizada\s+el)\s*[:=]\s*([^\n\r]+)/i);
  if (dateMatch && dateMatch[1]) {
    transactionDate = dateMatch[1].trim();
  } else {
    transactionDate = new Date().toLocaleString('es-CR');
  }

  // 9. Detección Inteligente de Categoría (Tienda vs Taller)
  let category: 'store' | 'workshop' = 'store';
  let detectedWorkshopId: string | undefined = undefined;

  const fullSearchText = `${description} ${text}`.toLowerCase();

  // Buscar si coincide con el título o palabras de talleres disponibles
  for (const ws of availableWorkshops) {
    const wsKeywords = ws.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const matchesKeyword = wsKeywords.some((kw) => fullSearchText.includes(kw));
    if (fullSearchText.includes(ws.title.toLowerCase()) || matchesKeyword) {
      category = 'workshop';
      detectedWorkshopId = ws.id;
      break;
    }
  }

  // Palabras clave adicionales que clasifican como Taller Creativo
  if (category === 'store') {
    const workshopKeywords = ['taller', 'curso', 'clase', 'alumna', 'alumno', 'inscripci', 'cupo', 'encuadernaci', 'acuarela', 'lettering', 'scrapbook'];
    if (workshopKeywords.some((kw) => fullSearchText.includes(kw))) {
      category = 'workshop';
    }
  }

  return {
    isValidBcrEmail: hasSinpeMovil && !!referenceNumber && amount > 0,
    referenceNumber,
    originPhone,
    originName,
    originBank,
    amount: isNaN(amount) ? 0 : amount,
    description,
    transactionDate,
    category,
    detectedWorkshopId,
    errors,
  };
};

/**
 * Plantilla de Correo de Ejemplo del Banco BCR para Pruebas Inmediatas
 */
export const SAMPLE_BCR_SINPE_EMAILS = [
  {
    title: 'Ejemplo 1: Pago Tienda (Agenda & Papelería)',
    category: 'store' as const,
    amount: 18500,
    reference: `BCR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-74921`,
    text: `De: mensajero@bancobcr.com
Asunto: SINPE MÓVIL: Notificación de transacción realizada
Para: fiorellajaravargas@gmail.com

Estimado(a) Cliente:

Le informamos que se ha recibido una transferencia a través de SINPE MÓVIL con el siguiente detalle:

Número de referencia: BCR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-74921
Teléfono origen: 8845-2190
Nombre cliente origen: VALERIA MÉNDEZ BRENES
Entidad origen: BANCO DE COSTA RICA
Monto: ₡18,500.00
Motivo: Agenda Personalizada 2027 Dra Valeria
Fecha y hora: ${new Date().toLocaleDateString('es-CR')} 14:22:30

Gracias por utilizar nuestros servicios.
Banco de Costa Rica`,
  },
  {
    title: 'Ejemplo 2: Pago Taller Creativo (Inscripción)',
    category: 'workshop' as const,
    amount: 22000,
    reference: `BCR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-89014`,
    text: `De: mensajero@bancobcr.com
Asunto: SINPE MÓVIL: Notificación de transacción realizada
Para: fiorellajaravargas@gmail.com

Estimado(a) Cliente:

Le informamos que se ha recibido una transferencia a través de SINPE MÓVIL con el siguiente detalle:

Número de referencia: BCR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-89014
Teléfono origen: 7012-9934
Nombre cliente origen: CARLOS ALVARADO MONGE
Entidad origen: BANCO NACIONAL DE COSTA RICA
Monto: ₡22,000.00
Motivo: Taller de Encuadernacion Artesanal Mayo
Fecha y hora: ${new Date().toLocaleDateString('es-CR')} 15:40:15

Gracias por utilizar nuestros servicios.
Banco de Costa Rica`,
  },
];
