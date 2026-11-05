/**
 * Utilidad universal de corrección automática y saneamiento de codificación UTF-8
 * Erradica caracteres de reemplazo (U+FFFD: ) y secuencias mal decodificadas en textos en español
 */
export const healEncoding = (text: string): string => {
  if (typeof text !== 'string') return text;
  if (!text.includes('\uFFFD') && !text.includes('')) return text;

  return text
    // Casos específicos del sistema by.fio
    .replace(/ATENCI[\uFFFD]N/g, 'ATENCIÓN')
    .replace(/Atenci[\uFFFD]n/g, 'Atención')
    .replace(/atenci[\uFFFD]n/g, 'atención')
    .replace(/Tib[\uFFFD]s/g, 'Tibás')
    .replace(/tib[\uFFFD]s/g, 'tibás')
    .replace(/cat[\uFFFD]logo/g, 'catálogo')
    .replace(/Cat[\uFFFD]logo/g, 'Catálogo')
    .replace(/[\uFFFD]rdenes/g, 'órdenes')
    .replace(/[\uFFFD]rden/g, 'orden')
    .replace(/Sof[\uFFFD]a/g, 'Sofía')
    .replace(/Jos[\uFFFD]/g, 'José')
    .replace(/jos[\uFFFD]/g, 'josé')
    .replace(/port[\uFFFD]n/g, 'portón')
    .replace(/cumplea[\uFFFD]os/g, 'cumpleaños')
    .replace(/cumplea[\uFFFD]o/g, 'cumpleaño')
    .replace(/cer[\uFFFD]mica/g, 'cerámica')
    .replace(/cermica/g, 'cerámica')
    .replace(/art[\uFFFD]culo/g, 'artículo')
    .replace(/art[\uFFFD]culos/g, 'artículos')
    .replace(/adici[\uFFFD]n/g, 'adición')
    .replace(/edici[\uFFFD]n/g, 'edición')
    .replace(/c[\uFFFD]digo/g, 'código')
    .replace(/electr[\uFFFD]nico/g, 'electrónico')
    .replace(/telef[\uFFFD]nico/g, 'telefónico')
    .replace(/tel[\uFFFD]fono/g, 'teléfono')
    .replace(/m[\uFFFD]vil/g, 'móvil')
    .replace(/direcci[\uFFFD]n/g, 'dirección')
    .replace(/ubicaci[\uFFFD]n/g, 'ubicación')
    .replace(/descripci[\uFFFD]n/g, 'descripción')
    .replace(/configuraci[\uFFFD]n/g, 'configuración')
    .replace(/informaci[\uFFFD]n/g, 'información')
    .replace(/facturaci[\uFFFD]n/g, 'facturación')
    .replace(/confirmaci[\uFFFD]n/g, 'confirmación')
    .replace(/recepci[\uFFFD]n/g, 'recepción')
    .replace(/devoluci[\uFFFD]n/g, 'devolución')
    .replace(/cancelaci[\uFFFD]n/g, 'cancelación')
    .replace(/promoci[\uFFFD]n/g, 'promoción')
    .replace(/colecci[\uFFFD]n/g, 'colección')
    .replace(/sesi[\uFFFD]n/g, 'sesión')
    .replace(/acci[\uFFFD]n/g, 'acción')
    .replace(/gesti[\uFFFD]n/g, 'gestión')
    .replace(/secci[\uFFFD]n/g, 'sección')
    .replace(/opci[\uFFFD]n/g, 'opción')
    .replace(/producci[\uFFFD]n/g, 'producción')
    .replace(/administraci[\uFFFD]n/g, 'administración')
    .replace(/autenticaci[\uFFFD]n/g, 'autenticación')
    .replace(/notificaci[\uFFFD]n/g, 'notificación')
    .replace(/actualizaci[\uFFFD]n/g, 'actualización')
    .replace(/validaci[\uFFFD]n/g, 'validación')
    .replace(/m[\uFFFD]s/g, 'más')
    .replace(/d[\uFFFD]a/g, 'día')
    .replace(/d[\uFFFD]as/g, 'días')
    .replace(/a[\uFFFD]o/g, 'año')
    .replace(/a[\uFFFD]os/g, 'años')
    .replace(/dise[\uFFFD]o/g, 'diseño')
    .replace(/dise[\uFFFD]os/g, 'diseños')
    .replace(/peque[\uFFFD]o/g, 'pequeño')
    .replace(/peque[\uFFFD]os/g, 'pequeños')
    .replace(/peque[\uFFFD]a/g, 'pequeña')
    .replace(/peque[\uFFFD]as/g, 'pequeñas')
    .replace(/ense[\uFFFD]an/g, 'enseñan')
    .replace(/ense[\uFFFD]o/g, 'enseño')
    .replace(/acompa[\uFFFD]an/g, 'acompañan')
    .replace(/ni[\uFFFD]o/g, 'niño')
    .replace(/ni[\uFFFD]os/g, 'niños')
    .replace(/ni[\uFFFD]a/g, 'niña')
    .replace(/ni[\uFFFD]as/g, 'niñas')
    .replace(/gu[\uFFFD]a/g, 'guía')
    .replace(/gu[\uFFFD]as/g, 'guías')
    .replace(/env[\uFFFD]o/g, 'envío')
    .replace(/env[\uFFFD]os/g, 'envíos')
    .replace(/f[\uFFFD]sico/g, 'físico')
    .replace(/f[\uFFFD]sica/g, 'física')
    .replace(/p[\uFFFD]gina/g, 'página')
    .replace(/p[\uFFFD]ginas/g, 'páginas')
    .replace(/b[\uFFFD]squeda/g, 'búsqueda')
    .replace(/m[\uFFFD]ximo/g, 'máximo')
    .replace(/m[\uFFFD]nimo/g, 'mínimo')
    .replace(/f[\uFFFD]cil/g, 'fácil')
    .replace(/dif[\uFFFD]cil/g, 'difícil')
    .replace(/r[\uFFFD]pido/g, 'rápido')
    .replace(/r[\uFFFD]pida/g, 'rápida')
    .replace(/autom[\uFFFD]tico/g, 'automático')
    .replace(/autom[\uFFFD]tica/g, 'automática')
    .replace(/m[\uFFFD]dulo/g, 'módulo')
    .replace(/m[\uFFFD]dulos/g, 'módulos')
    .replace(/n[\uFFFD]mero/g, 'número')
    .replace(/n[\uFFFD]meros/g, 'números')
    .replace(/[\uFFFD]nico/g, 'único')
    .replace(/[\uFFFD]nica/g, 'única')
    .replace(/[\uFFFD]ltimo/g, 'último')
    .replace(/[\uFFFD]ltima/g, 'última')
    .replace(/est[\uFFFD]/g, 'está')
    .replace(/est[\uFFFD]n/g, 'están')
    .replace(/habr[\uFFFD]/g, 'habrá')
    .replace(/ser[\uFFFD]/g, 'será')
    .replace(/podr[\uFFFD]/g, 'podrá')
    .replace(/despu[\uFFFD]s/g, 'después')
    .replace(/adem[\uFFFD]s/g, 'además')
    .replace(/aqu[\uFFFD]/g, 'aquí')
    .replace(/as[\uFFFD]/g, 'así')
    .replace(/s[\uFFFD]/g, 'sí')
    // Patrones generales de terminación en ción/sión
    .replace(/ci[\uFFFD]n/g, 'ción')
    .replace(/CI[\uFFFD]N/g, 'CIÓN')
    .replace(/si[\uFFFD]n/g, 'sión')
    .replace(/SI[\uFFFD]N/g, 'SIÓN')
    // Limpieza final de cualquier  o \uFFFD residual
    .replace(/[\uFFFD]/g, '');
};

export const deepSanitize = <T>(input: T): T => {
  if (typeof input === 'string') {
    return healEncoding(input) as unknown as T;
  }
  if (Array.isArray(input)) {
    return input.map((item) => deepSanitize(item)) as unknown as T;
  }
  if (input !== null && typeof input === 'object') {
    const res: any = {};
    for (const key of Object.keys(input)) {
      res[key] = deepSanitize((input as any)[key]);
    }
    return res;
  }
  return input;
};
