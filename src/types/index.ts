export type ViewMode = 'store' | 'admin';

export type InventoryMode = 'stock' | 'availability';

export type AppRoute =
  | 'home'
  | 'store'
  | 'catalogo'
  | 'workshops'
  | 'workshop-detail'
  | 'precios'
  | 'admin'
  | 'login'
  | 'metricas'
  | 'propuesta'
  | 'superadmin';

export type TypographyTheme = 'bubble' | 'serif' | 'hybrid';

export type ColorTheme = 'vibrant' | 'zen' | 'dark';

export type StarAlertDuration = 'manual' | 5 | 10 | 15 | 20;

export interface ProposalAcceptance {
  id: string;
  clientName: string;
  clientPhone: string;
  notes?: string;
  planName: string;
  monthlyFee: number;
  acceptedAt: string; // ISO date
  status: 'pending' | 'contacted' | 'active';
  readBySuperadmin: boolean;
}

export interface StickerPriceTier {
  id: string;
  quantity: number;
  price: number;
  giftText?: string;
  badge?: string;
}

export interface StickerPriceCategory {
  id: string;
  title: string;
  subtitle: string;
  note?: string;
  tiers: StickerPriceTier[];
}

export interface HowToOrderStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  highlight?: string;
}

export interface PricingSectionData {
  title: string;
  subtitle: string;
  categories: StickerPriceCategory[];
  howToOrderTitle: string;
  howToOrderSubtitle: string;
  howToOrderSteps: HowToOrderStep[];
}

export type ProductCategory =
  | 'Agendas Personalizadas'
  | 'Libros de Vacunas'
  | 'Artículos Sublimados'
  | 'Stickers y Papelería'
  | 'Kits e Insumos'
  | string;

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  shelfLocation: string; // Ej: "Estante A-2", "Gaveta C-1"
  price: number; // en Colones (₡)
  costPrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
  image: string;
  images?: string[];
  isCustomizable: boolean;
  customizationPlaceholder?: string;
  unit: string;
  description: string;
  showInStore?: boolean; // Visible en la Tienda Online (por default true)
  showInCatalog?: boolean; // Visible en el Catálogo Online (por default true)
  isAvailable?: boolean; // Activo/Disponible para venta en modo disponibilidad (default true)
}

export interface Workshop {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  schedule: string;
  modality: 'Presencial' | 'Virtual en Vivo';
  location: string;
  price: number; // en Colones (₡)
  spotsAvailable: number;
  totalSpots: number;
  includes: string[];
  image: string;
  images?: string[];
  description: string;
}

export interface OrderItem {
  id: string;
  type: 'product' | 'workshop';
  sku: string;
  name: string;
  price: number;
  quantity: number;
  shelfLocation?: string;
  customText?: string;
  isPicked?: boolean;
  pickedAt?: string;
  image?: string;
  isMissing?: boolean; // Marcado como faltante durante el alisto
  missingAt?: string;  // Fecha en que se reportó faltante
}

export interface InventoryMissingReport {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  sku: string;
  name: string;
  quantity: number;
  shelfLocation?: string;
  image?: string;
  reportedAt: string;
  resolved: boolean;
  resolvedAt?: string;
}

export type OrderStatus =
  | 'pending' // Pendiente de Alisto
  | 'picking' // En Alisto
  | 'packing' // En Empaque
  | 'packed' // Empacado
  | 'delivered'; // Entregado

export type PaymentMethod = 'sinpe' | 'transferencia' | 'tarjeta' | 'efectivo';
export type DeliveryMethod = 'envio' | 'retiro';

export interface CustomerFieldDef {
  id: string;
  label: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  customFields?: { [fieldId: string]: string };
}

export interface Order {
  id: string;
  orderNumber: string; // ej: #FIO-1001
  orderTitle?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: DeliveryMethod;
  shippingAddress?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  packedAt?: string;
  deliveredAt?: string;
  notes?: string;
  customFields?: { [key: string]: string };
}

export interface CartItem {
  cartId: string;
  type: 'product' | 'workshop';
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  customText?: string;
  image: string;
  images?: string[];
  shelfLocation?: string;
  spotsLeft?: number;
}

export interface UserPermissions {
  orders: boolean;     // Cola de Pedidos y Alisto QR
  billing: boolean;    // Facturación Rápida
  inventory: boolean;  // Inventario & Etiquetas QR
  reports: boolean;    // Caja & Reportería
  workshops: boolean;  // Talleres & Alumnos
  pricing: boolean;    // Precios & Stickers
  users: boolean;      // Gestión de Perfiles
  customers?: boolean; // Directorio de Clientes
  agenda?: boolean;    // Agenda & Organizador de Tareas
  suppliers?: boolean; // Pedidos a Proveedor & Requisiciones
  sales?: boolean;     // Historial de Ventas
}

export type AgendaCategory = 'taller' | 'entrega' | 'produccion' | 'proveedor' | 'recordatorio';
export type AgendaPriority = 'alta' | 'media' | 'baja';
export type AgendaStatus = 'pending' | 'completed';

export interface AgendaItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // Ej: "10:00 AM" o "14:30"
  endTime?: string; // Ej: "12:00 PM" o "16:30" (rango para talleres / bloqueos)
  category: AgendaCategory;
  priority: AgendaPriority;
  status: AgendaStatus;
  notes?: string;
  isAutoWorkshop?: boolean;
  notifyBell?: boolean; // Campanita de notificación push sonora activa
  supplierOrderId?: string; // ID único de la orden de proveedor vinculada
  createdAt: string;
}

export interface DailyClosingRecord {
  id: string;
  closingDate: string; // YYYY-MM-DD
  closedAt: string; // ISO 8601
  closedBy: string; // Nombre de la persona o administradora que cerró
  totalCashGrand: number; // Total general recaudado
  totalStoreSales: number; // Ventas tienda y catálogo
  totalWorkshopSales: number; // Ingresos talleres creativos
  sinpeTotal: number; // Total cobrado por SINPE Móvil (BCR + Web)
  otherTotal: number; // Transferencias y otros medios
  netProfit: number; // Ganancia neta estimada
  ordersCount: number; // Pedidos atendidos hoy
  sinpeCount: number; // Comprobantes SINPE BCR verificados
  pendingCount: number; // Pedidos pendientes en cola
  cashCounted?: number; // Monto físico contado en caja
  difference?: number; // Diferencia entre contado y teórico
  notes?: string; // Observaciones de la jornada
}

export interface UserProfile {
  id: string;
  name: string; // Nombre guardado y leído SIEMPRE EN MAYÚSCULAS
  pin: string;  // Código de acceso numérico de 4 dígitos
  role: 'admin' | 'staff';
  permissions: UserPermissions;
  isActive: boolean;
  createdAt: string;
  note?: string;
}

export interface AuthUser {
  id?: string;
  email?: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
  permissions?: UserPermissions;
  isMasterAdmin?: boolean;
  avatar?: string;
}

export interface TrackedLink {
  id: string;
  name: string; // ej. "Instagram Bio", "WhatsApp Clientes", "Promo Feria"
  slug: string; // ej. "insta-bio", "wa-promo"
  targetRoute: string; // ej. "/", "/catalogo", "/tienda", "/talleres"
  targetLabel?: string; // ej. "Todo el Sitio Web", "Catálogo Digital", etc.
  clicks: number; // Veces que se abrió el link
  pageViews?: number; // Cargas de página generadas por este link
  pcClicks: number; // Clics desde PC / Desktop
  mobileClicks: number; // Clics desde Celular / Móvil
  cartAdditions?: number; // Productos añadidos al carrito desde este link
  sectionsVisited?: Record<string, { views: number; likes: number; timeSpentAvgMinutes: number }>;
  createdAt: string;
  lastClickedAt?: string;
}

export interface SectionMetricData {
  id: string;
  name: string;
  iconName: string;
  route: string;
  views: number;
  likes: number;
  timeSpentAvgMinutes: number;
}

export interface MetricsState {
  totalPageLoads: number;
  uniqueSessions: number;
  totalCartAdditions?: number;
  devices: {
    pc: number;
    mobile: number;
  };
  trackedLinks: TrackedLink[];
  sections: Record<string, { views: number; likes: number; timeSpentAvgMinutes: number }>;
  lastVisitTimestamp?: string;
}

export interface SinpeTransaction {
  id: string; // ID interno único
  referenceNumber: string; // N° de comprobante / referencia bancaria BCR (Estrictamente ÚNICA)
  originPhone: string; // Teléfono de origen (ej: 8888-8888)
  originName: string; // Nombre del cliente origen
  originBank: string; // Entidad bancaria origen (Banco Nacional, BAC, BCR, etc.)
  amount: number; // Monto en Colones (₡)
  description: string; // Motivo o concepto
  transactionDate: string; // Fecha y hora de la transacción
  category: 'store' | 'workshop'; // 'store' (Tienda & Catálogo) | 'workshop' (Talleres Creativos)
  workshopId?: string; // ID del taller si es para un curso
  workshopTitle?: string; // Nombre del taller
  orderId?: string; // ID de orden asociada si aplica
  status: 'verified'; // Estado de verificación (Verificado ✅)
  rawEmail?: string; // Texto original del correo BCR
  createdAt: string; // Fecha y hora de registro en el sistema
}

export interface SinpeSettings {
  forwardingEmail: string; // Correo del administrador para recibir o reenviar comprobantes
  isLinked: boolean; // Estado de vinculación activa
  webhookUrl: string; // URL pública para recepción de webhooks de correo
  autoVerify: boolean; // Auto-verificación de referencias activada
}

export interface SinpeCheckoutValidationResult {
  status: 'valid_exact' | 'invalid_incomplete' | 'invalid_mismatch' | 'already_used' | 'not_found';
  message: string;
  transaction?: SinpeTransaction;
  voucherAmount?: number;
  missingAmount?: number;
  requiredTotal: number;
}

export interface SuperadminSubFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface SuperadminModuleConfig {
  id: string;
  name: string;
  category: 'Operaciones & WMS' | 'Ventas & Caja' | 'Tienda & Catálogo' | 'Configuración & Analítica';
  description: string;
  iconName: string;
  enabled: boolean;
  features: SuperadminSubFeature[];
}

export type SupplierOrderStatus = 'draft' | 'ordered' | 'received';

export interface SupplierOrderItem {
  productId?: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  orderQty: number;
  cost: number;
  subtotal: number;
  shelfLocation?: string;
}

export interface SupplierOrder {
  id: string;
  orderNumber: string;
  supplierName: string;
  supplierPhone?: string;
  supplierEmail?: string;
  status: SupplierOrderStatus;
  items: SupplierOrderItem[];
  totalUnits: number;
  totalCost: number;
  notes?: string;
  createdAt: string;
  orderedAt?: string;
  receivedAt?: string;
}

