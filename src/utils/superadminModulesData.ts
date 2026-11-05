import { SuperadminModuleConfig } from '../types';

export const SUPERADMIN_CREDENTIALS = {
  username: 'superadmin@byfio.com',
  secondaryUsername: 'superadmin',
  password: 'SuperAdmin2026!',
};

export const SUPERADMIN_STORAGE_KEY = 'byfio_superadmin_modules_v1';
export const SUPERADMIN_AUTH_KEY = 'byfio_superadmin_auth_v1';

export const INITIAL_SUPERADMIN_MODULES: SuperadminModuleConfig[] = [
  {
    id: 'orders',
    name: 'Cola de Pedidos & Alisto WMS',
    category: 'Operaciones & WMS',
    description: 'Gestión de flujo de pedidos, alisto manual por pasos, escaneo QR y control de empaque.',
    iconName: 'QrCode',
    enabled: true,
    features: [
      {
        id: 'orders_queue',
        name: 'Cola de Pedidos FIFO',
        description: 'Visualización de pedidos en orden de llegada con estados pendiente, en alisto y empacado.',
        enabled: true,
      },
      {
        id: 'code_picking',
        name: 'Alisto con Código',
        description: 'Alisto guiado paso a paso con lector láser o código QR y confirmación auditiva.',
        enabled: true,
      },
      {
        id: 'manual_picking',
        name: 'Alisto Manual',
        description: 'Alisto guiado producto por producto con botones táctiles de acción Listo y Faltante.',
        enabled: true,
      },
      {
        id: 'missing_reporting',
        name: 'Botón de Faltante en Alisto',
        description: 'Permite marcar ítems sin stock para excluirlos de factura y derivarlos a faltantes.',
        enabled: true,
      },
      {
        id: 'order_export',
        name: 'Exportar Lista de Pedidos en Formato Formal',
        description: 'Generación de documento limpio con líneas, cantidades y totales sin diseño de captura.',
        enabled: true,
      },
    ],
  },
  {
    id: 'billing',
    name: 'Facturación Rápida POS',
    category: 'Ventas & Caja',
    description: 'Búsqueda inmediata de órdenes, facturación rápida de mostrador y emisión de comprobantes.',
    iconName: 'Receipt',
    enabled: true,
    features: [
      {
        id: 'billing_search',
        name: 'Búsqueda Instantánea por Orden / Teléfono',
        description: 'Filtro ultrarrápido para localizar pedidos listos y cobrar en mostrador.',
        enabled: true,
      },
      {
        id: 'direct_invoicing',
        name: 'Emisión e Impresión de Factura Formal',
        description: 'Generación de recibo detallado con desglose de IVA, subtotal y método de pago.',
        enabled: true,
      },
      {
        id: 'counter_orders',
        name: 'Creación de Órdenes Directas en Mostrador',
        description: 'Registro inmediato de ventas presenciales sin pasar por el carrito web.',
        enabled: true,
      },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventario & Etiquetas QR',
    category: 'Operaciones & WMS',
    description: 'Catálogo de existencias, ubicaciones en estante, alertas de stock mínimo y etiquetas QR.',
    iconName: 'Boxes',
    enabled: true,
    features: [
      {
        id: 'product_crud',
        name: 'Gestión Completa de Productos (Crear / Editar / Eliminar)',
        description: 'Control de precios de venta, costos, SKU y fotos de productos.',
        enabled: true,
      },
      {
        id: 'inventory_stock_mode',
        name: 'Desactivar / Activar Stock de Inventario',
        description: 'Permite alternar el control exacto con columna de existencias numéricas y alertas de stock.',
        enabled: true,
      },
      {
        id: 'product_availability_mode',
        name: 'Activar / Desactivar Disponibilidad de Producto',
        description: 'Permite alternar el modo de disponibilidad rápida para activar o pausar productos en tienda.',
        enabled: true,
      },
      {
        id: 'stock_alerts',
        name: 'Alertas de Stock Crítico y Mínimo',
        description: 'Detección visual automática de productos por agotarse.',
        enabled: true,
      },
      {
        id: 'qr_labels',
        name: 'Generación e Impresión de Etiquetas QR',
        description: 'Impresión de etiquetas con código QR y ubicación de estante para escaneo.',
        enabled: true,
      },
      {
        id: 'supplier_list',
        name: 'Lista de Compras Automatizada a Proveedores',
        description: 'Resumen descargable con cálculo de reposición según faltantes y stock mínimo.',
        enabled: true,
      },
    ],
  },
  {
    id: 'missing_inventory',
    name: 'Faltantes de Inventario',
    category: 'Operaciones & WMS',
    description: 'Sección administrativa de productos no encontrados durante el alisto para reposición urgente.',
    iconName: 'AlertTriangle',
    enabled: true,
    features: [
      {
        id: 'missing_records',
        name: 'Registro Central de Faltantes Reportados',
        description: 'Historial de productos reportados con botón faltante durante el proceso de alisto.',
        enabled: true,
      },
      {
        id: 'restock_notification',
        name: 'Acceso Rápido a Pedido de Reposición',
        description: 'Integración directa con la lista de compras del proveedor.',
        enabled: true,
      },
    ],
  },
  {
    id: 'reports',
    name: 'Caja & Reportería Diaria',
    category: 'Ventas & Caja',
    description: 'Arqueo de caja en tiempo real, desglose por métodos de pago y cierre diario.',
    iconName: 'DollarSign',
    enabled: true,
    features: [
      {
        id: 'cash_register',
        name: 'Arqueo de Caja en Tiempo Real',
        description: 'Monitoreo de ingresos en efectivo, SINPE Móvil y tarjetas bancarias.',
        enabled: true,
      },
      {
        id: 'daily_closing',
        name: 'Cierre de Caja Diario Formal',
        description: 'Generación de acta de cierre con sobrantes, faltantes y firma del responsable.',
        enabled: true,
      },
      {
        id: 'category_breakdown',
        name: 'Desglose Separado: Tienda vs Talleres',
        description: 'División clara entre ingresos por venta de artículos e inscripciones a talleres.',
        enabled: true,
      },
    ],
  },
  {
    id: 'sinpe',
    name: 'Pagos SINPE Móvil BCR',
    category: 'Ventas & Caja',
    description: 'Validación automatizada de comprobantes Banco BCR con redirección de correo y verificación de monto.',
    iconName: 'Landmark',
    enabled: true,
    features: [
      {
        id: 'email_redirect',
        name: 'Redirección de Correo BCR (mensajero@bancobcr.com)',
        description: 'Configuración del correo receptor para sincronización y lectura de pagos SINPE.',
        enabled: true,
      },
      {
        id: 'single_use_validation',
        name: 'Validación de Comprobante Único (Anti-Reutilización)',
        description: 'Bloqueo inmediato si un número de referencia SINPE ya fue utilizado previamente.',
        enabled: true,
      },
      {
        id: 'amount_crosscheck',
        name: 'Verificación Cruzada Exacta de Monto vs Correo',
        description: 'Comprobación de que el monto pagado en el comprobante coincida con el total del carrito.',
        enabled: true,
      },
      {
        id: 'missing_voucher_window',
        name: 'Ventana de Comprobante Faltante (Pagos Parciales)',
        description: 'Permite ingresar un segundo comprobante si el primer pago fue insuficiente.',
        enabled: true,
      },
      {
        id: 'sinpe_admin_tab',
        name: 'Módulo Dedicado Independiente en Admin',
        description: 'Página exclusiva para buscar comprobantes, teléfonos, clientes y exportar auditorías.',
        enabled: true,
      },
    ],
  },
  {
    id: 'workshops',
    name: 'Talleres Creativos & Alumnos',
    category: 'Tienda & Catálogo',
    description: 'Programación de cursos presenciales/virtuales, lista de alumnos y cupos pagados.',
    iconName: 'GraduationCap',
    enabled: true,
    features: [
      {
        id: 'workshop_crud',
        name: 'Gestión y Creación de Talleres',
        description: 'Configuración de fechas, horas, cupos máximos, precios y temarios.',
        enabled: true,
      },
      {
        id: 'enrollment_list',
        name: 'Registro de Alumnos e Inscripciones',
        description: 'Lista completa de inscritos con estado de pago y confirmación de asistencia.',
        enabled: true,
      },
      {
        id: 'paid_slots_counter',
        name: 'Contador de Cupos Pagados y Confirmados',
        description: 'Indicador en tiempo real de cuántos cupos han sido cancelados y confirmados en caja.',
        enabled: true,
      },
    ],
  },
  {
    id: 'pricing',
    name: 'Precios & Calculador de Stickers',
    category: 'Tienda & Catálogo',
    description: 'Tabla de escalas por volumen de stickers, regalos y editor de listas de precios.',
    iconName: 'Tag',
    enabled: true,
    features: [
      {
        id: 'price_tiers_calculator',
        name: 'Calculador Interactivo de Escalas y Tiers',
        description: 'Cálculo dinámico de precios por cantidad de stickers para clientes.',
        enabled: true,
      },
      {
        id: 'pricing_editor',
        name: 'Editor Administrativo de Precios',
        description: 'Permite modificar valores de escalas, promociones y pasos de pedido.',
        enabled: true,
      },
    ],
  },
  {
    id: 'users',
    name: 'Perfiles de Usuarios & Accesos',
    category: 'Configuración & Analítica',
    description: 'Control de acceso mediante PIN de 4 dígitos y asignación granular de permisos a colaboradores.',
    iconName: 'Users',
    enabled: true,
    features: [
      {
        id: 'user_profiles_crud',
        name: 'Gestión de Perfiles y Colaboradores',
        description: 'Alta y desactivación rápida de perfiles de cajero, alisto y administración.',
        enabled: true,
      },
      {
        id: 'pin_authentication',
        name: 'Autenticación Rápida por PIN de 4 Dígitos',
        description: 'Inicio de sesión ágil en el mostrador sin necesidad de contraseñas largas.',
        enabled: true,
      },
      {
        id: 'granular_permissions',
        name: 'Matriz de Permisos por Rol',
        description: 'Habilitar o restringir acceso por cada pestaña del panel administrativo.',
        enabled: true,
      },
    ],
  },
  {
    id: 'metricas',
    name: 'Métricas & Rastreo de Enlaces',
    category: 'Configuración & Analítica',
    description: 'Seguimiento de visitas, clics en enlaces de campaña de Instagram/WhatsApp y dispositivos.',
    iconName: 'BarChart3',
    enabled: true,
    features: [
      {
        id: 'tracked_links',
        name: 'Generador y Monitor de Enlaces Rastreados',
        description: 'Creación de URLs con parámetros UTM/Ref para medir conversiones.',
        enabled: true,
      },
      {
        id: 'device_breakdown',
        name: 'Analítica de Dispositivos (PC vs Móvil)',
        description: 'Diferenciación de audiencia y tiempo promedio de permanencia por sección.',
        enabled: true,
      },
      {
        id: 'likes_views_stats',
        name: 'Estadísticas de Likes y Vistas',
        description: 'Conteo de interacciones del usuario en cada categoría de producto.',
        enabled: true,
      },
    ],
  },
  {
    id: 'catalogo',
    name: 'Catálogo Digital Online',
    category: 'Tienda & Catálogo',
    description: 'Vista limpia y profesional de artículos para clientes mayoristas y redes sociales.',
    iconName: 'BookOpen',
    enabled: true,
    features: [
      {
        id: 'catalog_view',
        name: 'Vista Comercial en Lista con Filtros',
        description: 'Exploración por categorías con imágenes de alta definición y precios actualizados.',
        enabled: true,
      },
      {
        id: 'whatsapp_orders',
        name: 'Generación de Pedidos Directos a WhatsApp',
        description: 'Botón para enviar cotización estructurada al WhatsApp comercial de by.fio.',
        enabled: true,
      },
    ],
  },
  {
    id: 'store',
    name: 'Tienda Online & E-Commerce',
    category: 'Tienda & Catálogo',
    description: 'Portal de compras para clientes, carrito dinámico y pasarela de pago.',
    iconName: 'ShoppingBag',
    enabled: true,
    features: [
      {
        id: 'online_storefront',
        name: 'Navegación de Productos y Categorías',
        description: 'Filtros interactivos de papelería, agendas, termos y stickers.',
        enabled: true,
      },
      {
        id: 'interactive_cart',
        name: 'Carrito Lateral Dinámico (Drawer)',
        description: 'Gestión en vivo de cantidades, cálculo de envío y botón de checkout.',
        enabled: true,
      },
      {
        id: 'sinpe_checkout_flow',
        name: 'Pasarela de Pago SINPE Móvil con Verificación',
        description: 'Flujo de pago integrado con validación BCR de referencia y monto.',
        enabled: true,
      },
    ],
  },
];
