import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ViewMode, InventoryMode, Product, Workshop, Order, CartItem, OrderStatus,
  TypographyTheme, ColorTheme, PricingSectionData, AuthUser,
  UserProfile, UserPermissions, PaymentMethod, Customer, CustomerFieldDef, OrderItem,
  SinpeTransaction, SinpeSettings, InventoryMissingReport
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_WORKSHOPS, INITIAL_ORDERS, INITIAL_SINPE_TRANSACTIONS, INITIAL_SINPE_SETTINGS } from '../utils/seedData';
import { INITIAL_PRICING_DATA } from '../utils/pricingSeedData';
import { playAudioBeep } from '../utils/formatters';
import { playNewOrderChimeSound } from '../utils/soundEffects';
import { isHomeLocation } from '../utils/routeHelpers';
import { metricsTracker } from '../services/metricsTracker';

// Generador de número de orden secuencial garantizado libre de colisiones
export const getNextOrderNumber = (ordersList: Order[]): string => {
  let maxNum = 1000;
  for (const o of ordersList) {
    if (!o.orderNumber) continue;
    const match = o.orderNumber.match(/#?FIO-(\d+)/i);
    if (match) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > maxNum) {
        maxNum = val;
      }
    }
  }
  return `#FIO-${maxNum + 1}`;
};

export const DEFAULT_USER_PROFILES: UserProfile[] = [
  {
    id: 'prof-alisto',
    name: 'ALISTO DE PEDIDOS',
    pin: '1001',
    role: 'staff',
    isActive: true,
    createdAt: '2026-10-30T00:00:00.000Z',
    note: 'Operario de alisto, picking y empaque de órdenes',
    permissions: {
      orders: true,
      billing: false,
      inventory: false,
      reports: false,
      workshops: false,
      pricing: false,
      users: false,
    },
  },
  {
    id: 'prof-mostrador',
    name: 'ATENCIÓN Y TALLERES',
    pin: '2026',
    role: 'staff',
    isActive: true,
    createdAt: '2026-10-30T00:00:00.000Z',
    note: 'Atención presencial en Tibás, inscripciones y catálogo',
    permissions: {
      orders: true,
      billing: true,
      inventory: true,
      reports: false,
      workshops: true,
      pricing: true,
      users: false,
    },
  },
];

export const DEFAULT_CUSTOMER_FIELDS: CustomerFieldDef[] = [
  { id: 'field-cedula', label: 'Cédula / Identificación' },
  { id: 'field-instagram', label: 'Instagram / Red Social' },
  { id: 'field-empresa', label: 'Empresa / Razón Social' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sofía Brenes Mora',
    phone: '8823-9911',
    email: 'sofia.brenes@gmail.com',
    address: 'Curridabat, San José. Condominio El Roble, Casa 14-B',
    notes: 'Cliente frecuente de agendas personalizadas y papelería',
    createdAt: '2026-10-28T09:00:00.000Z',
    customFields: {
      'field-cedula': '1-1589-0432',
      'field-instagram': '@sofibrenes',
    },
  },
  {
    id: 'cust-2',
    name: 'Mariela Chaves Quesada',
    phone: '8712-4499',
    email: 'mariela.chaves@outlook.com',
    address: '200 norte de la Iglesia de Tibás, San José',
    notes: 'Retira pedidos personalmente en el taller',
    createdAt: '2026-10-29T10:00:00.000Z',
    customFields: {
      'field-cedula': '1-1244-0899',
      'field-instagram': '@mari_chaves',
    },
  },
  {
    id: 'cust-3',
    name: 'Carlos Alvarado Rojas',
    phone: '8344-1122',
    email: 'carlos.alvarado@empresa.cr',
    address: 'Heredia Centro, 300m este de la entrada de la UNA',
    notes: 'Facturación corporativa de tazas y kits',
    createdAt: '2026-10-29T14:00:00.000Z',
    customFields: {
      'field-cedula': '3-101-849201',
      'field-empresa': 'Alvarado Creativos S.A.',
    },
  },
];

export interface CartToastInfo {
  productName: string;
  quantity?: number;
  image?: string;
  price?: number;
}

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  products: Product[];
  workshops: Workshop[];
  orders: Order[];
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartToast: CartToastInfo | null;
  showCartSuccessToast: (info: CartToastInfo) => void;
  closeCartToast: () => void;
  activePickingOrder: Order | null;
  setActivePickingOrder: (order: Order | null) => void;
  invoiceOrder: Order | null;
  setInvoiceOrder: (order: Order | null) => void;
  qrModalProduct: Product | null;
  setQrModalProduct: (prod: Product | null) => void;
  isSupplierModalOpen: boolean;
  setIsSupplierModalOpen: (open: boolean) => void;
  isNewProductModalOpen: boolean;
  setIsNewProductModalOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'cartId'>) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (orderInfo: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryMethod: 'envio' | 'retiro';
    shippingAddress?: string;
    paymentMethod: 'sinpe' | 'transferencia' | 'tarjeta';
    notes?: string;
  }) => Order;
  startPicking: (orderId: string) => void;
  markItemPicked: (orderId: string, itemSku: string) => { isComplete: boolean; error?: string };
  markItemMissing: (orderId: string, itemSku: string) => { isComplete: boolean; error?: string };
  missingInventoryReports: InventoryMissingReport[];
  resolveMissingReport: (reportId: string) => void;
  deleteMissingReport: (reportId: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  inventoryMode: InventoryMode;
  setInventoryMode: (mode: InventoryMode) => void;
  toggleProductAvailability: (productId: string) => void;
  updateProductStock: (productId: string, stock: number, minStock?: number, maxStock?: number) => void;
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (productId: string, updatedData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  editingProduct: Product | null;
  setEditingProduct: (p: Product | null) => void;
  addWorkshop: (wsData: Omit<Workshop, 'id'>) => Workshop;
  updateWorkshop: (wsId: string, updatedData: Partial<Workshop>) => void;
  deleteWorkshop: (wsId: string) => void;
  editingWorkshop: Workshop | null;
  setEditingWorkshop: (ws: Workshop | null) => void;
  bookWorkshopDirect: (
    workshop: Workshop,
    quantity: number,
    customerInfo: { name: string; phone: string; email?: string; notes?: string }
  ) => Order;
  isNewWorkshopModalOpen: boolean;
  setIsNewWorkshopModalOpen: (open: boolean) => void;
  typographyTheme: TypographyTheme;
  setTypographyTheme: (theme: TypographyTheme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  pricingData: PricingSectionData;
  updatePricingData: (data: PricingSectionData) => void;
  resetPricingData: () => void;
  isPricingModalOpen: boolean;
  setIsPricingModalOpen: (open: boolean) => void;
  isIntroOpen: boolean;
  playWebIntro: () => void;
  closeWebIntro: () => void;
  soundBubbleEnabled: boolean;
  setSoundBubbleEnabled: (enabled: boolean) => void;
  soundButtonsEnabled: boolean;
  setSoundButtonsEnabled: (enabled: boolean) => void;
  soundNewOrderEnabled: boolean;
  setSoundNewOrderEnabled: (enabled: boolean) => void;
  currentUser: AuthUser | null;
  loginUser: (email: string, pass: string) => { success: boolean; error?: string; user?: AuthUser };
  loginWithPin: (pin: string, targetProfileName?: string) => { success: boolean; error?: string; user?: AuthUser };
  registerUser: (email: string, pass: string, name?: string) => { success: boolean; error?: string; user?: AuthUser };
  logoutUser: () => void;
  isLogoutTransitionOpen: boolean;
  closeLogoutTransition: () => void;
  loginIntroStage: number;
  triggerLoginCinematic: (user: AuthUser, onComplete: () => void) => void;
  userProfiles: UserProfile[];
  addUserProfile: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => UserProfile;
  updateUserProfile: (id: string, updates: Partial<UserProfile>) => void;
  deleteUserProfile: (id: string) => void;
  toggleUserProfileStatus: (id: string) => void;
  hasPermission: (tab: string) => boolean;
  customers: Customer[];
  customerFieldDefs: CustomerFieldDef[];
  addCustomer: (data: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addCustomerFieldDef: (label: string) => CustomerFieldDef;
  deleteCustomerFieldDef: (id: string) => void;
  createDirectInvoiceOrder: (orderData: {
    orderTitle?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryMethod: 'envio' | 'retiro';
    shippingAddress?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    customFields?: { [key: string]: string };
    items: {
      sku: string;
      name: string;
      price: number;
      quantity: number;
      shelfLocation?: string;
      customText?: string;
      image?: string;
    }[];
    subtotal: number;
    shippingFee: number;
    total: number;
  }) => Order;
  resetToDefaults: () => void;
  sinpeTransactions: SinpeTransaction[];
  sinpeSettings: SinpeSettings;
  registerSinpeTransaction: (data: Omit<SinpeTransaction, 'id' | 'createdAt'>) => {
    success: boolean;
    message: string;
    transaction?: SinpeTransaction;
    duplicate?: boolean;
  };
  deleteSinpeTransaction: (id: string) => void;
  updateSinpeSettings: (settings: Partial<SinpeSettings>) => void;
  isSinpeModalOpen: boolean;
  setIsSinpeModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'byfio_products_v1',
  ORDERS: 'byfio_orders_v1',
  CART: 'byfio_cart_v1',
  VIEW_MODE: 'byfio_view_mode_v1',
  WORKSHOPS: 'byfio_workshops_v1',
  TYPOGRAPHY_THEME: 'byfio_typography_theme_v1',
  COLOR_THEME: 'byfio_color_theme_v1',
  PRICING_DATA: 'byfio_pricing_data_v1',
  SOUND_BUBBLE: 'byfio_sound_bubble_v1',
  SOUND_BUTTONS: 'byfio_sound_buttons_v1',
  SOUND_NEW_ORDER: 'byfio_sound_new_order_v1',
  AUTH_USER: 'byfio_auth_user_v1',
  REGISTERED_USERS: 'byfio_registered_users_v1',
  USER_PROFILES: 'byfio_user_profiles_v1',
  CUSTOMERS: 'byfio_customers_v1',
  CUSTOMER_FIELDS: 'byfio_customer_fields_v1',
  INVENTORY_MODE: 'byfio_inventory_mode_v1',
  SINPE_TRANSACTIONS: 'byfio_sinpe_transactions_v1',
  SINPE_SETTINGS: 'byfio_sinpe_settings_v1',
  MISSING_INVENTORY: 'byfio_missing_inventory_v1',
};

// Canal de difusión en tiempo real entre pestañas del navegador (0ms latencia para inventario y pedidos)
const syncChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('byfio_realtime_sync')
    : null;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as ViewMode) || 'store';
  });

  const [inventoryMode, setInventoryModeState] = useState<InventoryMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY_MODE);
    return saved === 'availability' || saved === 'stock' ? (saved as InventoryMode) : 'stock';
  });

  const setInventoryMode = (mode: InventoryMode) => {
    setInventoryModeState(mode);
    localStorage.setItem(STORAGE_KEYS.INVENTORY_MODE, mode);
  };

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [workshops, setWorkshops] = useState<Workshop[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKSHOPS);
    return saved ? JSON.parse(saved) : INITIAL_WORKSHOPS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartToast, setCartToast] = useState<CartToastInfo | null>(null);
  const cartToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showCartSuccessToast = (info: CartToastInfo) => {
    if (cartToastTimeoutRef.current) {
      clearTimeout(cartToastTimeoutRef.current);
    }
    setCartToast(info);
    cartToastTimeoutRef.current = setTimeout(() => {
      setCartToast(null);
    }, 3200);
  };

  const closeCartToast = () => {
    if (cartToastTimeoutRef.current) {
      clearTimeout(cartToastTimeoutRef.current);
    }
    setCartToast(null);
  };

  const [activePickingOrder, setActivePickingOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [qrModalProduct, setQrModalProduct] = useState<Product | null>(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewWorkshopModalOpen, setIsNewWorkshopModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [typographyTheme, setTypographyTheme] = useState<TypographyTheme>(() => {
    return (localStorage.getItem(STORAGE_KEYS.TYPOGRAPHY_THEME) as TypographyTheme) || 'hybrid';
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem(STORAGE_KEYS.COLOR_THEME) as ColorTheme) || 'vibrant';
  });

  const [pricingData, setPricingData] = useState<PricingSectionData>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRICING_DATA);
    return saved ? JSON.parse(saved) : INITIAL_PRICING_DATA;
  });

  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isLogoutTransitionOpen, setIsLogoutTransitionOpen] = useState(false);

  // Estados para Redirección y Verificación de Pagos SINPE Móvil Banco BCR
  const [sinpeTransactions, setSinpeTransactions] = useState<SinpeTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SINPE_TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_SINPE_TRANSACTIONS;
  });

  const [sinpeSettings, setSinpeSettings] = useState<SinpeSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SINPE_SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SINPE_SETTINGS;
  });

  const [isSinpeModalOpen, setIsSinpeModalOpen] = useState(false);

  // Reportes de Faltantes de Inventario detectados durante el Alisto Manual
  const [missingInventoryReports, setMissingInventoryReports] = useState<InventoryMissingReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MISSING_INVENTORY);
    return saved ? JSON.parse(saved) : [];
  });

  // Web Intro Video Overlay state: Solo carga y se reproduce en la portada / home
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(() => isHomeLocation());

  const playWebIntro = () => {
    setIsIntroOpen(true);
  };

  const closeWebIntro = () => {
    setIsIntroOpen(false);
  };

  // Configuración de efectos de sonido interactivos
  const [soundBubbleEnabled, setSoundBubbleEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_BUBBLE);
    return saved !== null ? saved === 'true' : true;
  });

  const [soundButtonsEnabled, setSoundButtonsEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_BUTTONS);
    return saved !== null ? saved === 'true' : true;
  });

  const [soundNewOrderEnabled, setSoundNewOrderEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_NEW_ORDER);
    return saved !== null ? saved === 'true' : true;
  });

  const setSoundBubbleEnabled = (enabled: boolean) => {
    setSoundBubbleEnabledState(enabled);
    localStorage.setItem(STORAGE_KEYS.SOUND_BUBBLE, String(enabled));
  };

  const setSoundButtonsEnabled = (enabled: boolean) => {
    setSoundButtonsEnabledState(enabled);
    localStorage.setItem(STORAGE_KEYS.SOUND_BUTTONS, String(enabled));
  };

  const setSoundNewOrderEnabled = (enabled: boolean) => {
    setSoundNewOrderEnabledState(enabled);
    localStorage.setItem(STORAGE_KEYS.SOUND_NEW_ORDER, String(enabled));
  };

  // Rastreo de pedidos conocidos para emitir campanilla únicamente ante nuevos pedidos reales
  const knownOrderIdsRef = useRef<Set<string>>(
    new Set((() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
        const list: Order[] = saved ? JSON.parse(saved) : INITIAL_ORDERS;
        return Array.isArray(list) ? list.map((o) => o.id) : [];
      } catch {
        return [];
      }
    })())
  );
  const isInitialOrdersLoadRef = useRef(true);

  const checkAndNotifyNewOrders = (incomingOrders: Order[]) => {
    if (isInitialOrdersLoadRef.current) {
      incomingOrders.forEach((o) => knownOrderIdsRef.current.add(o.id));
      isInitialOrdersLoadRef.current = false;
      return;
    }

    let hasNewOrder = false;
    incomingOrders.forEach((o) => {
      if (!knownOrderIdsRef.current.has(o.id)) {
        knownOrderIdsRef.current.add(o.id);
        hasNewOrder = true;
      }
    });

    if (hasNewOrder) {
      playNewOrderChimeSound();
    }
  };

  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_USER_PROFILES;
  });

  const syncProfilesToCloud = (profiles: UserProfile[]) => {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profiles }),
    }).catch(() => {
      fetch('/api/user-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profiles }),
      }).catch(() => {});
    });
  };

  const addUserProfile = (profileData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const newProfile: UserProfile = {
      ...profileData,
      id: `prof-${Date.now()}`,
      name: profileData.name.trim().toUpperCase(),
      pin: profileData.pin.trim().slice(0, 4),
      createdAt: new Date().toISOString(),
    };
    const updated = [newProfile, ...userProfiles];
    setUserProfiles(updated);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(updated));
    syncProfilesToCloud(updated);
    return newProfile;
  };

  const updateUserProfile = (id: string, updates: Partial<UserProfile>) => {
    const updated = userProfiles.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        ...updates,
        name: updates.name ? updates.name.trim().toUpperCase() : p.name,
        pin: updates.pin ? updates.pin.trim().slice(0, 4) : p.pin,
      };
    });
    setUserProfiles(updated);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(updated));
    syncProfilesToCloud(updated);
  };

  const deleteUserProfile = (id: string) => {
    const updated = userProfiles.filter((p) => p.id !== id);
    setUserProfiles(updated);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(updated));
    syncProfilesToCloud(updated);
  };

  const toggleUserProfileStatus = (id: string) => {
    const updated = userProfiles.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    setUserProfiles(updated);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(updated));
    syncProfilesToCloud(updated);
  };

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CUSTOMERS;
  });

  const [customerFieldDefs, setCustomerFieldDefs] = useState<CustomerFieldDef[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER_FIELDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_CUSTOMER_FIELDS;
  });

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      name: customerData.name.trim(),
      phone: customerData.phone.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCustomers(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
  };

  const deleteCustomer = (id: string) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
  };

  const addCustomerFieldDef = (label: string): CustomerFieldDef => {
    const newDef: CustomerFieldDef = {
      id: `field-${Date.now()}`,
      label: label.trim(),
    };
    const updated = [...customerFieldDefs, newDef];
    setCustomerFieldDefs(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_FIELDS, JSON.stringify(updated));
    return newDef;
  };

  const deleteCustomerFieldDef = (id: string) => {
    const updated = customerFieldDefs.filter((f) => f.id !== id);
    setCustomerFieldDefs(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_FIELDS, JSON.stringify(updated));
  };

  const createDirectInvoiceOrder = (orderData: {
    orderTitle?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryMethod: 'envio' | 'retiro';
    shippingAddress?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    customFields?: { [key: string]: string };
    items: {
      sku: string;
      name: string;
      price: number;
      quantity: number;
      shelfLocation?: string;
      customText?: string;
      image?: string;
    }[];
    subtotal: number;
    shippingFee: number;
    total: number;
  }): Order => {
    const orderNumber = getNextOrderNumber(orders);

    const orderItems: OrderItem[] = orderData.items.map((item, idx) => ({
      id: `ord-direct-item-${Date.now()}-${idx}`,
      type: 'product',
      sku: item.sku,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      shelfLocation: item.shelfLocation,
      customText: item.customText,
      isPicked: true,
      image: item.image,
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      orderTitle: orderData.orderTitle,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      deliveryMethod: orderData.deliveryMethod,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'paid',
      orderStatus: 'packed',
      items: orderItems,
      subtotal: orderData.subtotal,
      shippingFee: orderData.shippingFee,
      total: orderData.total,
      createdAt: new Date().toISOString(),
      packedAt: new Date().toISOString(),
      notes: orderData.notes,
      customFields: orderData.customFields,
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    knownOrderIdsRef.current.add(newOrder.id);
    playNewOrderChimeSound();

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.orderNumber && data.orderNumber !== newOrder.orderNumber) {
          setOrders((prev) =>
            prev.map((o) => (o.id === newOrder.id ? { ...o, orderNumber: data.orderNumber } : o))
          );
        }
      })
      .catch(() => {});

    // Rebajar inventario automáticamente y sincronizar con D1
    const deductionsBySku = new Map<string, number>();
    orderData.items.forEach((it) => {
      if (it.sku) {
        deductionsBySku.set(it.sku, (deductionsBySku.get(it.sku) || 0) + it.quantity);
      }
    });

    const batchUpdates: { id: string; stock: number }[] = [];
    let updatedProducts: Product[] = [];

    setProducts((prev) => {
      updatedProducts = prev.map((prod) => {
        const qty = deductionsBySku.get(prod.sku) || 0;
        if (qty > 0) {
          const newStock = Math.max(0, prod.stock - qty);
          batchUpdates.push({ id: prod.id, stock: newStock });
          return { ...prod, stock: newStock };
        }
        return prod;
      });
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    if (batchUpdates.length > 0) {
      fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchUpdates),
      }).catch(() => {});
    }

    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        orders: updatedOrders,
        products: updatedProducts,
      });
    } catch {}

    setInvoiceOrder(newOrder);
    return newOrder;
  };

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const hasPermission = (tab: string) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin' || currentUser.isMasterAdmin) return true;
    if (tab === 'hub') return true;
    if (currentUser.role === 'staff' && currentUser.permissions) {
      return Boolean((currentUser.permissions as any)[tab]);
    }
    return false;
  };

  const loginWithPin = (pinInput: string, targetProfileName?: string) => {
    const cleanPin = pinInput.trim();
    if (!cleanPin || cleanPin.length !== 4) {
      return { success: false, error: 'El código PIN debe tener exactamente 4 dígitos.' };
    }

    const fullPermissions: UserPermissions = {
      orders: true,
      billing: true,
      inventory: true,
      reports: true,
      workshops: true,
      pricing: true,
      users: true,
    };

    // PIN Maestro de Fio (7777 o 0777)
    if (cleanPin === '7777' || cleanPin === '0777') {
      const adminUser: AuthUser = {
        email: 'fio@byfiocr.com',
        name: 'Fiorella (Fio)',
        role: 'admin',
        isMasterAdmin: true,
        permissions: fullPermissions,
      };
      setCurrentUser(adminUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }

    let found = userProfiles.find((p) => p.isActive && p.pin === cleanPin);

    // Si se especificó nombre de perfil, validar que el PIN pertenezca a ese perfil
    if (targetProfileName) {
      const expected = userProfiles.find(
        (p) => p.isActive && p.name.toUpperCase() === targetProfileName.trim().toUpperCase()
      );
      if (expected) {
        if (expected.pin !== cleanPin) {
          return { success: false, error: 'Código PIN incorrecto para este perfil.' };
        }
        found = expected;
      }
    }

    if (!found) {
      return { success: false, error: 'Código PIN incorrecto o no asignado a ningún perfil de usuario activo.' };
    }

    const staffUser: AuthUser = {
      id: found.id,
      name: found.name.toUpperCase(),
      role: found.role,
      permissions: found.permissions,
      isMasterAdmin: found.role === 'admin',
    };
    setCurrentUser(staffUser);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(staffUser));
    return { success: true, user: staffUser };
  };

  const loginUser = (emailInput: string, passwordInput: string) => {
    const cleanEmail = emailInput.trim();
    const cleanEmailLower = cleanEmail.toLowerCase();
    const cleanPass = passwordInput.trim();

    const fullPermissions: UserPermissions = {
      orders: true,
      billing: true,
      inventory: true,
      reports: true,
      workshops: true,
      pricing: true,
      users: true,
    };

    // 1. Cuenta Maestra Oficial: fio@byfiocr.com / Fio777 (insensible a mayúsculas)
    if (
      (cleanEmailLower === 'fio@byfiocr.com' || cleanEmailLower === 'fio' || cleanEmailLower === 'fio@byfio.com') &&
      cleanPass.toLowerCase() === 'fio777'
    ) {
      const adminUser: AuthUser = {
        email: 'fio@byfiocr.com',
        name: 'Fiorella (Fio)',
        role: 'admin',
        isMasterAdmin: true,
        permissions: fullPermissions,
      };
      setCurrentUser(adminUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }

    // 2. Acceso por Código PIN de 4 Dígitos si se introduce en contraseña o usuario
    const pinCandidate = (cleanPass.length === 4 && /^\d{4}$/.test(cleanPass))
      ? cleanPass
      : (cleanEmail.length === 4 && /^\d{4}$/.test(cleanEmail))
      ? cleanEmail
      : null;

    if (pinCandidate) {
      const pinResult = loginWithPin(pinCandidate);
      if (pinResult.success) return pinResult;
    }

    // 3. Acceso por Nombre de Perfil (en Mayúsculas) y PIN de 4 dígitos
    const profileMatch = userProfiles.find(
      (p) => p.isActive && p.name.toUpperCase() === cleanEmail.toUpperCase() && p.pin === cleanPass
    );
    if (profileMatch) {
      const staffUser: AuthUser = {
        id: profileMatch.id,
        name: profileMatch.name.toUpperCase(),
        role: profileMatch.role,
        permissions: profileMatch.permissions,
        isMasterAdmin: profileMatch.role === 'admin',
      };
      setCurrentUser(staffUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(staffUser));
      return { success: true, user: staffUser };
    }

    // 4. Cuentas de clientes registradas localmente
    try {
      const registered = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
      const found = registered.find(
        (u: any) => u.email.toLowerCase() === cleanEmailLower && u.password === cleanPass
      );
      if (found) {
        const normalUser: AuthUser = {
          email: found.email,
          name: found.name || found.email.split('@')[0],
          role: 'customer',
        };
        setCurrentUser(normalUser);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(normalUser));
        return { success: true, user: normalUser };
      }
    } catch {}

    return { success: false, error: 'Credenciales incorrectas. Verifica tu correo, contraseña o PIN de 4 dígitos.' };
  };

  const registerUser = (emailInput: string, passwordInput: string, nameInput?: string) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();
    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Por favor completa todos los campos requeridos.' };
    }
    if (cleanEmail === 'fio@byfiocr.com' || cleanEmail === 'fio') {
      return { success: false, error: 'Este correo está reservado para la administración.' };
    }
    try {
      const registered = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
      if (registered.some((u: any) => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'Ya existe una cuenta con este correo electrónico.' };
      }
      const record = {
        email: cleanEmail,
        password: cleanPass,
        name: nameInput?.trim() || cleanEmail.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      registered.push(record);
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered));

      const customer: AuthUser = {
        email: record.email,
        name: record.name,
        role: 'customer',
      };
      setCurrentUser(customer);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(customer));
      return { success: true, user: customer };
    } catch {
      return { success: false, error: 'Error al registrar usuario.' };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    setIsLogoutTransitionOpen(true);
  };

  const closeLogoutTransition = () => {
    setIsLogoutTransitionOpen(false);
  };

  const [loginIntroStage, setLoginIntroStage] = useState(0);

  const triggerLoginCinematic = (_user: AuthUser, onComplete: () => void) => {
    // Transición inmediata a máxima velocidad: sin pausas de 6 segundos ni ocultamiento de componentes
    setLoginIntroStage(0);
    onComplete();
  };

  const updatePricingData = (newData: PricingSectionData) => {
    setPricingData(newData);
    localStorage.setItem(STORAGE_KEYS.PRICING_DATA, JSON.stringify(newData));
  };

  const resetPricingData = () => {
    setPricingData(INITIAL_PRICING_DATA);
    localStorage.setItem(STORAGE_KEYS.PRICING_DATA, JSON.stringify(INITIAL_PRICING_DATA));
  };

  // Apply typography theme to document body
  useEffect(() => {
    document.body.setAttribute('data-font-theme', typographyTheme);
    localStorage.setItem(STORAGE_KEYS.TYPOGRAPHY_THEME, typographyTheme);
  }, [typographyTheme]);

  // Apply color theme to document body
  useEffect(() => {
    document.body.setAttribute('data-color-theme', colorTheme);
    if (colorTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.COLOR_THEME, colorTheme);
  }, [colorTheme]);

  // Escucha del canal de difusión para sincronización en tiempo real (0ms) entre pestañas
  useEffect(() => {
    if (!syncChannel) return;
    const handleSync = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_UPDATE') {
        if (Array.isArray(event.data.orders)) {
          setOrders((prev) => {
            const map = new Map<string, Order>();
            prev.forEach((o) => map.set(o.id, o));
            event.data.orders.forEach((o: Order) => map.set(o.id, o));
            return Array.from(map.values()).sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
          checkAndNotifyNewOrders(event.data.orders);
        }
        if (Array.isArray(event.data.products)) {
          setProducts(event.data.products);
          if (event.data.deletedProductId) {
            setCart((prev) => prev.filter((it) => it.type !== 'product' || it.id !== event.data.deletedProductId));
          }
        }
        if (Array.isArray(event.data.workshops)) {
          setWorkshops(event.data.workshops);
        }
        if (Array.isArray(event.data.sinpeTransactions)) {
          setSinpeTransactions(event.data.sinpeTransactions);
        }
      }
    };
    syncChannel.addEventListener('message', handleSync);
    return () => {
      syncChannel.removeEventListener('message', handleSync);
    };
  }, []);

  // Sincronización Inteligente Anti-Drain Polling (4s activo en pantalla, 0 peticiones en segundo plano)
  useEffect(() => {
    const fetchLatestData = () => {
      if (typeof document !== 'undefined' && document.hidden) return;

      // 1. Sincronizar productos e inventario actualizado
      fetch('/api/products')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) {
            setProducts((prev) => {
              const cloudIds = new Set(data.map((p: Product) => p.id));
              const prevIds = new Set(prev.map((p) => p.id));

              let idsChanged = cloudIds.size !== prevIds.size;
              if (!idsChanged) {
                for (const id of cloudIds) {
                  if (!prevIds.has(id)) {
                    idsChanged = true;
                    break;
                  }
                }
              }

              const prevMap = new Map(prev.map((p) => [p.id, p]));
              let hasFieldChanges = false;
              const merged = data.map((cloudProd: Product) => {
                const local = prevMap.get(cloudProd.id);
                const isAvail = cloudProd.isAvailable !== undefined 
                  ? cloudProd.isAvailable 
                  : (local?.isAvailable !== undefined ? local.isAvailable : true);
                const inStore = cloudProd.showInStore !== undefined
                  ? cloudProd.showInStore
                  : (local?.showInStore !== undefined ? local.showInStore : isAvail);
                const inCat = cloudProd.showInCatalog !== undefined
                  ? cloudProd.showInCatalog
                  : (local?.showInCatalog !== undefined ? local.showInCatalog : isAvail);

                if (
                  !local ||
                  local.stock !== cloudProd.stock ||
                  local.isAvailable !== isAvail ||
                  local.price !== cloudProd.price ||
                  local.name !== cloudProd.name
                ) {
                  hasFieldChanges = true;
                }

                return {
                  ...cloudProd,
                  isAvailable: isAvail,
                  showInStore: inStore,
                  showInCatalog: inCat,
                };
              });

              if (idsChanged || hasFieldChanges || merged.length !== prev.length) {
                localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(merged));
                // Remover del carrito si fue eliminado de la nube
                setCart((prevCart) => prevCart.filter((item) => item.type !== 'product' || cloudIds.has(item.id)));
                return merged;
              }
              return prev;
            });
          }
        })
        .catch(() => {});

      // 2. Sincronizar pedidos en tiempo real
      fetch('/api/orders')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            checkAndNotifyNewOrders(data);
            setOrders((prev) => {
              const map = new Map<string, Order>();
              prev.forEach((o) => map.set(o.id, o));
              data.forEach((o: Order) => map.set(o.id, o));
              const merged = Array.from(map.values()).sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );
              if (merged.length !== prev.length || JSON.stringify(merged) !== JSON.stringify(prev)) {
                localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(merged));
                return merged;
              }
              return prev;
            });
          }
        })
        .catch(() => {})
        .finally(() => {
          isInitialOrdersLoadRef.current = false;
        });

      // 3. Sincronizar transacciones verificadas SINPE BCR en tiempo real
      fetch('/api/sinpe-transactions')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setSinpeTransactions((prev) => {
              const map = new Map<string, SinpeTransaction>();
              prev.forEach((t) => map.set(t.referenceNumber, t));
              data.forEach((t: SinpeTransaction) => map.set(t.referenceNumber, t));
              const merged = Array.from(map.values()).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              localStorage.setItem(STORAGE_KEYS.SINPE_TRANSACTIONS, JSON.stringify(merged));
              return merged;
            });
          }
        })
        .catch(() => {});
    };

    // Carga inicial inmediata
    fetchLatestData();

    // Carga inicial de perfiles de usuario
    const handleLoadedProfiles = (data: any) => {
      if (data && Array.isArray(data.profiles) && data.profiles.length > 0) {
        const cloudProfiles: UserProfile[] = data.profiles;
        setUserProfiles((prev) => {
          const map = new Map<string, UserProfile>();
          DEFAULT_USER_PROFILES.forEach((p) => map.set(p.id, p));
          prev.forEach((p) => map.set(p.id, p));
          cloudProfiles.forEach((p) => map.set(p.id, p));
          const merged = Array.from(map.values());
          localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(merged));
          return merged;
        });
      }
    };

    fetch('/api/users')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profiles?.length) {
          handleLoadedProfiles(data);
        } else {
          fetch('/api/user-profiles')
            .then((res) => (res.ok ? res.json() : null))
            .then(handleLoadedProfiles)
            .catch(() => {});
        }
      })
      .catch(() => {
        fetch('/api/user-profiles')
          .then((res) => (res.ok ? res.json() : null))
          .then(handleLoadedProfiles)
          .catch(() => {});
      });

    // Temporizador inteligente: 8s únicamente si la pestaña está activa y visible
    let pollingTimer: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (pollingTimer === null && typeof document !== 'undefined' && !document.hidden) {
        pollingTimer = setInterval(() => {
          if (!document.hidden) {
            fetchLatestData();
          }
        }, 8000);
      }
    };

    const stopPolling = () => {
      if (pollingTimer !== null) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchLatestData();
        startPolling();
      }
    };

    if (typeof document !== 'undefined' && !document.hidden) {
      startPolling();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', fetchLatestData);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchLatestData);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(workshops));
  }, [workshops]);

  const addToCart = (item: Omit<CartItem, 'cartId'>) => {
    // Si el producto está en cero o desactivado, bloquear la adición al carrito
    if (item.type === 'product') {
      const prod = products.find((p) => p.id === item.id);
      if (prod && (prod.stock <= 0 || prod.isAvailable === false || prod.showInStore === false || prod.showInCatalog === false)) {
        return;
      }
    }

    const cartId = `${item.id}-${item.customText || 'standard'}-${Date.now()}`;
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && (i.customText || '') === (item.customText || '')
      );
      if (existing) {
        return prev.map((i) =>
          i.cartId === existing.cartId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, cartId }];
    });
    // No abrir el carrito automáticamente; mostrar cartel de confirmación que auto-desaparece
    showCartSuccessToast({
      productName: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
    });

    // Registrar en analítica de métricas (global y atribuida al enlace de origen si existe)
    try {
      metricsTracker.recordCartAddition(item.name, item.quantity, item.price);
    } catch (e) {
      console.warn('Error registrando producto en métricas de carrito', e);
    }
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) => prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setCart([]);

  const createOrder = (orderInfo: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryMethod: 'envio' | 'retiro';
    shippingAddress?: string;
    paymentMethod: 'sinpe' | 'transferencia' | 'tarjeta';
    notes?: string;
  }): Order => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = orderInfo.deliveryMethod === 'envio' ? 2500 : 0;
    const total = subtotal + shippingFee;

    const orderNumber = getNextOrderNumber(orders);

    const orderItems = cart.map((item, idx) => ({
      id: `ord-item-${Date.now()}-${idx}`,
      type: item.type,
      sku: item.sku,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      shelfLocation: item.shelfLocation,
      customText: item.customText,
      isPicked: item.type === 'workshop',
      image: item.image,
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: orderInfo.customerName,
      customerPhone: orderInfo.customerPhone,
      customerEmail: orderInfo.customerEmail,
      deliveryMethod: orderInfo.deliveryMethod,
      shippingAddress: orderInfo.shippingAddress,
      paymentMethod: orderInfo.paymentMethod,
      paymentStatus: 'paid',
      orderStatus: 'pending',
      items: orderItems,
      subtotal,
      shippingFee,
      total,
      createdAt: new Date().toISOString(),
      notes: orderInfo.notes,
    };

    // Update D1 Remote Database in background
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.orderNumber && data.orderNumber !== newOrder.orderNumber) {
          setOrders((prev) =>
            prev.map((o) => (o.id === newOrder.id ? { ...o, orderNumber: data.orderNumber } : o))
          );
        }
      })
      .catch(() => {});

    // Rebajar inventario automáticamente y sincronizar con D1
    const deductionsByProdId = new Map<string, number>();
    const deductionsBySku = new Map<string, number>();

    cart.forEach((c) => {
      if (c.type === 'product') {
        if (c.id) {
          deductionsByProdId.set(c.id, (deductionsByProdId.get(c.id) || 0) + c.quantity);
        }
        if (c.sku) {
          deductionsBySku.set(c.sku, (deductionsBySku.get(c.sku) || 0) + c.quantity);
        }
      }
    });

    const batchUpdates: { id: string; stock: number }[] = [];
    let updatedProducts: Product[] = [];

    setProducts((prev) => {
      updatedProducts = prev.map((prod) => {
        const qtyToDeduct = deductionsByProdId.get(prod.id) || deductionsBySku.get(prod.sku) || 0;
        if (qtyToDeduct > 0) {
          const newStock = Math.max(0, prod.stock - qtyToDeduct);
          batchUpdates.push({ id: prod.id, stock: newStock });
          return { ...prod, stock: newStock };
        }
        return prod;
      });
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    if (batchUpdates.length > 0) {
      fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchUpdates),
      }).catch(() => {});
    }

    // Si hay talleres en el pedido, rebajar cupos automáticamente
    let updatedWorkshops: Workshop[] = [];
    setWorkshops((prev) => {
      updatedWorkshops = prev.map((w) => {
        const inCartWs = cart.find(
          (c) => c.type === 'workshop' && (c.id === w.id || c.sku === `WS-${w.id.toUpperCase()}`)
        );
        if (inCartWs) {
          return { ...w, spotsAvailable: Math.max(0, w.spotsAvailable - inCartWs.quantity) };
        }
        return w;
      });
      localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(updatedWorkshops));
      return updatedWorkshops;
    });

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    knownOrderIdsRef.current.add(newOrder.id);
    playNewOrderChimeSound();

    // Notificación en tiempo real (0ms) a todas las pestañas de administración y clientes
    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        orders: updatedOrders,
        products: updatedProducts,
        workshops: updatedWorkshops,
      });
    } catch {}

    clearCart();
    return newOrder;
  };

  const startPicking = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: 'picking' } : o))
    );
    setActivePickingOrder({ ...target, orderStatus: 'picking' });

    fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, orderStatus: 'picking', items: target.items }),
    }).catch(() => {});
  };

  const markItemPicked = (orderId: string, itemSku: string) => {
    let completed = false;
    let found = false;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedItems = [...order.items];
        const unpickedIdx = updatedItems.findIndex((it) => it.sku === itemSku && !it.isPicked);

        if (unpickedIdx !== -1) {
          found = true;
          updatedItems[unpickedIdx] = {
            ...updatedItems[unpickedIdx],
            isPicked: true,
            pickedAt: new Date().toISOString(),
          };
        }

        const allPicked = updatedItems.every((it) => it.isPicked || it.isMissing);
        if (allPicked) completed = true;

        const updatedOrder: Order = {
          ...order,
          items: updatedItems,
          orderStatus: allPicked ? 'packed' : 'picking',
          packedAt: allPicked ? new Date().toISOString() : order.packedAt,
        };

        if (activePickingOrder?.id === orderId) {
          setActivePickingOrder(updatedOrder);
        }

        // Sync with D1 Database
        fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: orderId,
            orderStatus: updatedOrder.orderStatus,
            packedAt: updatedOrder.packedAt,
            items: updatedItems,
          }),
        }).catch(() => {});

        return updatedOrder;
      })
    );

    if (!found) {
      playAudioBeep('error');
      return { isComplete: false, error: `El código QR "${itemSku}" no coincide con el producto requerido en este paso.` };
    }

    if (completed) {
      playAudioBeep('finish');
    } else {
      playAudioBeep('success');
    }

    return { isComplete: completed };
  };

  const markItemMissing = (orderId: string, itemSku: string) => {
    let completed = false;
    let found = false;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedItems = [...order.items];
        const unhandledIdx = updatedItems.findIndex((it) => it.sku === itemSku && !it.isPicked && !it.isMissing);

        if (unhandledIdx !== -1) {
          found = true;
          const missingItem = updatedItems[unhandledIdx];
          updatedItems[unhandledIdx] = {
            ...missingItem,
            isMissing: true,
            isPicked: false,
            missingAt: new Date().toISOString(),
          };

          // Registrar en faltantes de inventario
          const newReport: InventoryMissingReport = {
            id: `missing_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            sku: missingItem.sku,
            name: missingItem.name,
            quantity: missingItem.quantity,
            shelfLocation: missingItem.shelfLocation,
            image: missingItem.image,
            reportedAt: new Date().toISOString(),
            resolved: false,
          };

          setMissingInventoryReports((mPrev) => {
            const nextReports = [newReport, ...mPrev];
            localStorage.setItem(STORAGE_KEYS.MISSING_INVENTORY, JSON.stringify(nextReports));
            return nextReports;
          });
        }

        const allProcessed = updatedItems.every((it) => it.isPicked || it.isMissing);
        if (allProcessed) completed = true;

        const updatedOrder: Order = {
          ...order,
          items: updatedItems,
          orderStatus: allProcessed ? 'packed' : 'picking',
          packedAt: allProcessed ? new Date().toISOString() : order.packedAt,
        };

        if (activePickingOrder?.id === orderId) {
          setActivePickingOrder(updatedOrder);
        }

        // Sync with D1 Database
        fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: orderId,
            orderStatus: updatedOrder.orderStatus,
            packedAt: updatedOrder.packedAt,
            items: updatedItems,
          }),
        }).catch(() => {});

        return updatedOrder;
      })
    );

    if (!found) {
      playAudioBeep('error');
      return { isComplete: false, error: `No se encontró el producto "${itemSku}" pendiente en este pedido.` };
    }

    if (completed) {
      playAudioBeep('finish');
    } else {
      playAudioBeep('success');
    }

    return { isComplete: completed };
  };

  const resolveMissingReport = (reportId: string) => {
    setMissingInventoryReports((prev) => {
      const next = prev.map((rep) => (rep.id === reportId ? { ...rep, resolved: true, resolvedAt: new Date().toISOString() } : rep));
      localStorage.setItem(STORAGE_KEYS.MISSING_INVENTORY, JSON.stringify(next));
      return next;
    });
  };

  const deleteMissingReport = (reportId: string) => {
    setMissingInventoryReports((prev) => {
      const next = prev.filter((rep) => rep.id !== reportId);
      localStorage.setItem(STORAGE_KEYS.MISSING_INVENTORY, JSON.stringify(next));
      return next;
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const packedAt = newStatus === 'packed' ? new Date().toISOString() : undefined;
    let updatedOrders: Order[] = [];
    setOrders((prev) => {
      updatedOrders = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: newStatus,
              packedAt: packedAt || o.packedAt,
            }
          : o
      );
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
      return updatedOrders;
    });

    fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, orderStatus: newStatus, packedAt }),
    }).catch(() => {});

    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        orders: updatedOrders,
      });
    } catch {}
  };

  const updateProductStock = (
    productId: string,
    stock: number,
    minStock?: number,
    maxStock?: number
  ) => {
    let updatedProducts: Product[] = [];
    setProducts((prev) => {
      updatedProducts = prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock,
              minStock: minStock !== undefined ? minStock : p.minStock,
              maxStock: maxStock !== undefined ? maxStock : p.maxStock,
            }
          : p
      );
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    // Si el stock llega a cero, extraer de inmediato del carrito activo
    if (stock <= 0) {
      setCart((prevCart) => {
        const nextCart = prevCart.filter((it) => it.type !== 'product' || it.id !== productId);
        if (nextCart.length !== prevCart.length) {
          localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(nextCart));
        }
        return nextCart;
      });
    }

    fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId, stock, minStock, maxStock }),
    }).catch(() => {});

    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        products: updatedProducts,
      });
    } catch {}
  };

  const toggleProductAvailability = (productId: string) => {
    let nextAvailable = false;
    let updatedProducts: Product[] = [];
    setProducts((prev) => {
      updatedProducts = prev.map((p) => {
        if (p.id === productId) {
          nextAvailable = p.isAvailable === false ? true : false;
          return {
            ...p,
            isAvailable: nextAvailable,
            showInStore: nextAvailable,
            showInCatalog: nextAvailable,
          };
        }
        return p;
      });

      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    // Si se desactiva el producto, eliminarlo de inmediato del carrito para que nadie lo compre por error
    setCart((prevCart) => prevCart.filter((it) => it.type !== 'product' || it.id !== productId || nextAvailable));

    // Sincronizar estado en la base de datos en la nube D1
    fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId, isAvailable: nextAvailable }),
    }).catch(() => {});

    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        products: updatedProducts,
      });
    } catch {}
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    let updatedProducts: Product[] = [];
    setProducts((prev) => {
      updatedProducts = [newProduct, ...prev];
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    // Guardar en base de datos D1
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    }).catch(() => {});

    // Notificación en vivo (0ms) a todas las pestañas abiertas
    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        products: updatedProducts,
      });
    } catch {}

    return newProduct;
  };

  const deleteProduct = (productId: string) => {
    let updatedProducts: Product[] = [];
    setProducts((prev) => {
      updatedProducts = prev.filter((p) => p.id !== productId);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    // Eliminar también del carrito si algún usuario lo tenía seleccionado
    setCart((prevCart) => {
      const nextCart = prevCart.filter((it) => it.type !== 'product' || it.id !== productId);
      if (nextCart.length !== prevCart.length) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(nextCart));
      }
      return nextCart;
    });

    // Sincronizar eliminación inmediata en D1 en la nube
    fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId }),
    }).catch(() => {});

    // Notificación en vivo (0ms) a todas las pestañas abiertas para que desaparezca en el acto
    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        products: updatedProducts,
        deletedProductId: productId,
      });
    } catch {}
  };

  const updateProduct = (productId: string, updatedData: Partial<Product>) => {
    let updatedProducts: Product[] = [];
    let updatedTarget: Product | null = null;
    setProducts((prev) => {
      updatedProducts = prev.map((p) => {
        if (p.id === productId) {
          updatedTarget = { ...p, ...updatedData };
          return updatedTarget;
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    // Sincronizar cambios en D1
    if (updatedTarget) {
      fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTarget),
      }).catch(() => {});
    }

    // Notificación en vivo (0ms) a todas las pestañas abiertas
    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        products: updatedProducts,
      });
    } catch {}
  };

  const addWorkshop = (wsData: Omit<Workshop, 'id'>): Workshop => {
    const newWs: Workshop = { ...wsData, id: `ws-${Date.now()}` };
    setWorkshops((prev) => [...prev, newWs]);
    return newWs;
  };

  const deleteWorkshop = (wsId: string) => {
    setWorkshops((prev) => prev.filter((w) => w.id !== wsId));
  };

  const updateWorkshop = (wsId: string, updatedData: Partial<Workshop>) => {
    setWorkshops((prev) =>
      prev.map((w) => (w.id === wsId ? { ...w, ...updatedData } : w))
    );
  };

  const bookWorkshopDirect = (
    workshop: Workshop,
    quantity: number,
    customerInfo: { name: string; phone: string; email?: string; notes?: string }
  ): Order => {
    const total = workshop.price * quantity;
    const orderNumber = getNextOrderNumber(orders);

    const newOrder: Order = {
      id: `ord-ws-${Date.now()}`,
      orderNumber,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email,
      deliveryMethod: 'retiro',
      paymentMethod: 'sinpe',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      items: [
        {
          id: `ord-item-${Date.now()}-0`,
          type: 'workshop',
          sku: `WS-${workshop.id.toUpperCase()}`,
          name: workshop.title,
          price: workshop.price,
          quantity,
          isPicked: true,
          image: workshop.image,
        },
      ],
      subtotal: total,
      shippingFee: 0,
      total,
      createdAt: new Date().toISOString(),
      notes: customerInfo.notes || `Inscripción directa al taller: ${workshop.title}`,
    };

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.orderNumber && data.orderNumber !== newOrder.orderNumber) {
          setOrders((prev) =>
            prev.map((o) => (o.id === newOrder.id ? { ...o, orderNumber: data.orderNumber } : o))
          );
        }
      })
      .catch(() => {});

    let updatedWorkshops: Workshop[] = [];
    setWorkshops((prev) => {
      updatedWorkshops = prev.map((w) =>
        w.id === workshop.id
          ? { ...w, spotsAvailable: Math.max(0, w.spotsAvailable - quantity) }
          : w
      );
      localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(updatedWorkshops));
      return updatedWorkshops;
    });

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    knownOrderIdsRef.current.add(newOrder.id);
    playNewOrderChimeSound();

    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        orders: updatedOrders,
        workshops: updatedWorkshops,
      });
    } catch {}

    return newOrder;
  };

  const registerSinpeTransaction = (data: Omit<SinpeTransaction, 'id' | 'createdAt'>) => {
    const cleanRef = data.referenceNumber.trim();
    const alreadyExists = sinpeTransactions.some(
      (tx) => tx.referenceNumber.toLowerCase() === cleanRef.toLowerCase()
    );

    if (alreadyExists) {
      return {
        success: false,
        duplicate: true,
        message: `El número de referencia ${cleanRef} ya fue acreditado previamente en el sistema.`,
      };
    }

    const txId = `sinpe-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newTx: SinpeTransaction = {
      ...data,
      id: txId,
      referenceNumber: cleanRef,
      status: 'verified',
      createdAt: new Date().toISOString(),
    };

    const nextTxs = [newTx, ...sinpeTransactions];
    setSinpeTransactions(nextTxs);
    localStorage.setItem(STORAGE_KEYS.SINPE_TRANSACTIONS, JSON.stringify(nextTxs));

    // Si es para un taller, descontar 1 cupo disponible
    if (newTx.category === 'workshop' && newTx.workshopId) {
      setWorkshops((prev) => {
        const updated = prev.map((w) =>
          w.id === newTx.workshopId ? { ...w, spotsAvailable: Math.max(0, w.spotsAvailable - 1) } : w
        );
        localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(updated));
        return updated;
      });
    }

    // Sincronizar en D1
    fetch('/api/sinpe-transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTx),
    }).catch(() => {});

    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        sinpeTransactions: nextTxs,
      });
    } catch {}

    return {
      success: true,
      message: `¡Pago de ₡${newTx.amount.toLocaleString('es-CR')} acreditado en caja! Ref: ${newTx.referenceNumber}`,
      transaction: newTx,
    };
  };

  const deleteSinpeTransaction = (id: string) => {
    const nextTxs = sinpeTransactions.filter((tx) => tx.id !== id);
    setSinpeTransactions(nextTxs);
    localStorage.setItem(STORAGE_KEYS.SINPE_TRANSACTIONS, JSON.stringify(nextTxs));
    fetch(`/api/sinpe-transactions?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        sinpeTransactions: nextTxs,
      });
    } catch {}
  };

  const updateSinpeSettings = (updates: Partial<SinpeSettings>) => {
    setSinpeSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.SINPE_SETTINGS, JSON.stringify(next));
      return next;
    });
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setWorkshops(INITIAL_WORKSHOPS);
    setCustomers(INITIAL_CUSTOMERS);
    setCustomerFieldDefs(DEFAULT_CUSTOMER_FIELDS);
    setSinpeTransactions(INITIAL_SINPE_TRANSACTIONS);
    setSinpeSettings(INITIAL_SINPE_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.WORKSHOPS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_FIELDS);
    localStorage.removeItem(STORAGE_KEYS.SINPE_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.SINPE_SETTINGS);
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        products,
        workshops,
        orders,
        cart,
        isCartOpen,
        setIsCartOpen,
        activePickingOrder,
        setActivePickingOrder,
        invoiceOrder,
        setInvoiceOrder,
        qrModalProduct,
        setQrModalProduct,
        isSupplierModalOpen,
        setIsSupplierModalOpen,
        isNewProductModalOpen,
        setIsNewProductModalOpen,
        editingProduct,
        setEditingProduct,
        isNewWorkshopModalOpen,
        setIsNewWorkshopModalOpen,
        editingWorkshop,
        setEditingWorkshop,
        typographyTheme,
        setTypographyTheme,
        colorTheme,
        setColorTheme,
        pricingData,
        updatePricingData,
        resetPricingData,
        isPricingModalOpen,
        setIsPricingModalOpen,
        isIntroOpen,
        playWebIntro,
        closeWebIntro,
        soundBubbleEnabled,
        setSoundBubbleEnabled,
        soundButtonsEnabled,
        setSoundButtonsEnabled,
        soundNewOrderEnabled,
        setSoundNewOrderEnabled,
        currentUser,
        loginUser,
        loginWithPin,
        registerUser,
        logoutUser,
        isLogoutTransitionOpen,
        closeLogoutTransition,
        loginIntroStage,
        triggerLoginCinematic,
        userProfiles,
        addUserProfile,
        updateUserProfile,
        deleteUserProfile,
        toggleUserProfileStatus,
        hasPermission,
        customers,
        customerFieldDefs,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addCustomerFieldDef,
        deleteCustomerFieldDef,
        createDirectInvoiceOrder,
        cartToast,
        showCartSuccessToast,
        closeCartToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        startPicking,
        markItemPicked,
        markItemMissing,
        missingInventoryReports,
        resolveMissingReport,
        deleteMissingReport,
        updateOrderStatus,
        inventoryMode,
        setInventoryMode,
        toggleProductAvailability,
        updateProductStock,
        addProduct,
        updateProduct,
        deleteProduct,
        addWorkshop,
        updateWorkshop,
        deleteWorkshop,
        bookWorkshopDirect,
        resetToDefaults,
        sinpeTransactions,
        sinpeSettings,
        registerSinpeTransaction,
        deleteSinpeTransaction,
        updateSinpeSettings,
        isSinpeModalOpen,
        setIsSinpeModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
