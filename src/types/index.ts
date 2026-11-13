export type ViewMode = 'store' | 'admin';

export type InventoryMode = 'stock' | 'availability';

export type AppRoute =
  | 'home'
  | 'store'
  | 'catalogo'
  | 'workshops'
  | 'workshop-detail'
  | 'workshop-waitlist'
  | 'precios'
  | 'admin'
  | 'login'
  | 'metricas'
  | 'propuesta'
  | 'superadmin'
  | 'pedidos-mobile'
  | 'pwa-install'
  | 'inventario-app'
  | 'mi-cuenta'
  | 'cursos-drive';

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
  | 'Máquinas y Equipo'
  | string;

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  shelfLocation: string; // Ej: "Estante A-2", "Gaveta C-1"
  qrCode?: string; // Código QR personalizado o autogenerado por SKU
  supplier?: string; // Proveedor o distribuidor del producto
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
  hasLayaway?: boolean; // Habilitado para Sistema de Apartados
  layawayMonths?: number; // Plazo del apartado en meses (ej: 1, 2, 3, 4, 6)
  layawayPaymentsCount?: number; // Cantidad total de cuotas / pagos (ej: 2, 3, 4, 6)
  layawayDownPaymentPercent?: number; // Porcentaje del pago inicial (ej: 20, 25, 30, 50)
}

export interface WorkshopBenefitItem {
  id: string;
  icon: string;
  text: string;
  enabled: boolean;
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
  hasCoffeeBreak?: boolean;
  coffeeBreakText?: string;
  hasToolsIncluded?: boolean;
  toolsText?: string;
  hasTakeHomeProject?: boolean;
  takeHomeText?: string;
  instructorName?: string;
  instructorSubtitle?: string;
  benefits?: WorkshopBenefitItem[];
  waitlistWhatsappNumber?: string;
  waitlistWhatsappLink?: string;
}

export type WorkshopWaitlistStatus = 'waiting' | 'notified' | 'enrolled' | 'cancelled';

export interface WorkshopWaitlistEntry {
  id: string;
  workshopId: string;
  workshopTitle: string;
  workshopDate: string;
  name: string;
  email: string;
  phone: string;
  idCard?: string;
  address?: string;
  createdAt: string;
  position?: number;
  status: WorkshopWaitlistStatus;
  emailSent: boolean;
  emailProvider?: string;
  emailSentAt?: string;
  notifiedAt?: string;
  spotNotificationSent?: boolean;
}

export interface WorkshopWaitlistSettings {
  whatsappNumber: string;
  whatsappGroupLink: string;
  updatedAt?: string;
}

export interface LayawayPaymentRecord {
  id: string;
  amount: number;
  date: string;
  paymentMethod: 'sinpe' | 'transferencia' | 'tarjeta' | 'efectivo';
  reference?: string;
  notes?: string;
  registeredBy?: string;
}

export interface OrderItem {
  id: string;
  type: 'product' | 'workshop';
  workshopId?: string;
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
  isLayaway?: boolean; // Pedido bajo modalidad de apartado
  isLayawaySale?: boolean;
  saleCategory?: string;
  layawaySourceOrderId?: string;
  layawaySourceOrderNumber?: string;
  layawayGeneratedSaleOrderId?: string;
  layawayGeneratedSaleCreatedAt?: string;
  layawayMonths?: number;
  layawayPaymentsCount?: number;
  layawayDownPaymentPercent?: number;
  layawayTotalAmount?: number;
  layawayDownPaymentAmount?: number;
  layawayRemainingAmount?: number;
  layawayDueDate?: string;
  layawayDaysTotal?: number;
  layawayPayments?: LayawayPaymentRecord[];
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
  lat?: number;
  lng?: number;
  notes?: string;
  createdAt: string;
  createdBy?: string;
  customFields?: { [fieldId: string]: string };
}

export interface Order {
  id: string;
  orderNumber: string; // ej: #FIO-1001
  orderTitle?: string;
  isDirectInvoice?: boolean;
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
  pickedBy?: string;
  pickedAt?: string;
  notes?: string;
  customFields?: { [key: string]: string };
  isLayaway?: boolean;
  layawayMonths?: number;
  layawayPaymentsCount?: number;
  layawayDownPaymentPercent?: number;
  layawayTotalAmount?: number;
  layawayDownPaymentAmount?: number;
  layawayRemainingAmount?: number;
  layawayDueDate?: string;
  layawayDaysTotal?: number;
  layawayReminderEmailSent?: boolean;
  layawayReminderEmailSentAt?: string;
  isLayawaySale?: boolean; // Venta generada al completar el último pago
  saleCategory?: string; // ej: 'Ventas de apartados'
  layawaySourceOrderId?: string;
  layawaySourceOrderNumber?: string;
  layawaySaleOrderId?: string;
  layawayCompletedAt?: string;
  layawayPayments?: LayawayPaymentRecord[];
}

export interface CartItem {
  cartId: string;
  type: 'product' | 'workshop';
  workshopId?: string;
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
  isLayaway?: boolean; // Artículo en modalidad de apartado (1ª cuota)
  layawayMonths?: number;
  layawayPaymentsCount?: number;
  layawayDownPaymentPercent?: number;
  layawayTotalAmount?: number;
  layawayDownPaymentAmount?: number;
  layawayRemainingAmount?: number;
  layawayDueDate?: string;
  layawayDaysTotal?: number;
  layawayPayments?: LayawayPaymentRecord[];
}

export interface UserPermissions {
  orders: boolean;     // Cola de Pedidos y Alisto QR
  layaways?: boolean;  // Gestión de Apartados
  billing: boolean;    // Facturación Rápida
  inventory: boolean;  // Mis Productos
  reports: boolean;    // Caja & Reportería
  sinpe?: boolean;     // Pagos SINPE Móvil
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
  totalLayawaySales?: number; // Ventas de apartados liquidados
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
  phone?: string;
  idCard?: string;
  name: string;
  username?: string;
  clientSlug?: string;
  role: 'admin' | 'staff' | 'customer';
  permissions?: UserPermissions;
  isMasterAdmin?: boolean;
  avatar?: string;
  address?: string;
  lat?: number;
  lng?: number;
  createdAt?: string;
  welcomeShown?: boolean;
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

export interface RegisteredUserLike {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userRole?: 'admin' | 'staff' | 'customer';
  sectionKey: string;
  createdAt: string;
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
  registeredLikes?: RegisteredUserLike[];
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

export interface Supplier {
  id: string;
  name: string;
  phone: string;

  legalId?: string;
  whatsappPhone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt?: string;
}

export interface SupplierOrder {
  id: string;
  orderNumber: string;
  supplierName: string;
  supplierPhone?: string;
  supplierEmail?: string;
  orderType?: 'order' | 'invoice';
  invoiceNumber?: string;
  entryDate?: string;
  supplierId?: string;
  supplierLegalId?: string;
  invoiceAmount?: number;
  discountAmount?: number;
  taxAmount?: number;
  subtotalAmount?: number;
  otherAmount?: number;
  status: SupplierOrderStatus;
  items: SupplierOrderItem[];
  totalUnits: number;
  totalCost: number;
  notes?: string;
  createdAt: string;
  orderedAt?: string;
  receivedAt?: string;
}

export type SweepLoadMode = 'auto' | 'manual';

export type SweepEntryStatus = 'guardado' | 'cargado_inv';

export interface InventorySweepEntry {
  id: string;
  shelfName: string;
  productId: string;
  sku: string;
  productName: string;
  category: string;
  supplier: string;
  shelfLocation: string;
  quantityAdded: number;
  status: SweepEntryStatus;
  userId: string;
  userName: string;
  createdAt: string;
  loadedAt?: string;
}

export type ShelfInventoryStatus = 'pending' | 'in_progress' | 'completed';

export interface ShelfInventoryState {
  shelfName: string;
  status: ShelfInventoryStatus;
  lastCountedAt?: string;
  lastCountedBy?: string;
  itemsCount: number;
  itemsVerified: number;
}

export interface InventoryAdjustmentItem {
  productId: string;
  sku: string;
  name: string;
  category: string;
  shelfLocation: string;
  image?: string;
  previousStock: number;
  countedStock: number;
  difference: number; // countedStock - previousStock (+2, -1, etc.)
  reason?: string;
}

export interface InventoryAdjustmentRecord {
  id: string; // ej: ADJ-1718290000000
  shelfName: string; // ej: "Estante 1" o "Ajuste Directo"
  performedBy: string; // Nombre de usuario (ej: MARÍA, ADMINISTRADORA)
  userRole?: string; // "admin" | "staff"
  createdAt: string; // ISO 8601
  dateFormatted: string; // ej: "Miércoles, 11 de Noviembre 2026"
  timeFormatted: string; // ej: "07:35 AM"
  totalItemsCounted: number;
  totalDifferences: number; // cantidad de productos con diferencia !== 0
  netDifferenceUnits: number; // balance neto de unidades (+2, -3)
  items: InventoryAdjustmentItem[];
  notes?: string;
}

export type { AdminTabType } from '../components/admin/AdminTabs';

export interface DriveCourse {
  id: string;
  title: string;
  tagline?: string;
  price: number;
  description: string;
  whatYouGet: string[];
  driveFolderUrl?: string;
  badge?: string;
  coverImage?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface DriveCoursePurchase {
  id: string;
  courseId: string;
  courseTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentReference: string;
  paymentAmount: number;
  paymentStatus: 'paid' | 'pending';
  driveStatus: 'granted' | 'pending' | 'failed';
  driveFolderUrl?: string;
  composioSent?: boolean;
  createdAt: string;
}

export interface DriveCoursesSettings {
  composioWebhookUrl?: string;
  composioApiKey?: string;
  updatedAt?: string;
}


