export type ViewMode = 'store' | 'admin';

export type AppRoute = 'home' | 'store' | 'catalogo' | 'workshops' | 'workshop-detail' | 'precios' | 'admin' | 'login';

export type TypographyTheme = 'bubble' | 'serif' | 'hybrid';

export type ColorTheme = 'vibrant' | 'zen' | 'dark';

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
  isCustomizable: boolean;
  customizationPlaceholder?: string;
  unit: string;
  description: string;
  showInStore?: boolean; // Visible en la Tienda Online (por default true)
  showInCatalog?: boolean; // Visible en el Catálogo Online (por default true)
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
}

export type OrderStatus =
  | 'pending' // Pendiente de Alisto
  | 'picking' // En Alisto
  | 'packed' // Empacado / Facturado
  | 'delivered'; // Entregado

export type PaymentMethod = 'sinpe' | 'transferencia' | 'tarjeta';
export type DeliveryMethod = 'envio' | 'retiro';

export interface Order {
  id: string;
  orderNumber: string; // ej: #FIO-1001
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
  notes?: string;
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

