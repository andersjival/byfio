import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ViewMode, Product, Workshop, Order, CartItem, OrderStatus,
  TypographyTheme, ColorTheme, PricingSectionData, AuthUser,
  UserProfile, UserPermissions, PaymentMethod, Customer, CustomerFieldDef, OrderItem
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_WORKSHOPS, INITIAL_ORDERS } from '../utils/seedData';
import { INITIAL_PRICING_DATA } from '../utils/pricingSeedData';
import { playAudioBeep } from '../utils/formatters';

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
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
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
  AUTH_USER: 'byfio_auth_user_v1',
  REGISTERED_USERS: 'byfio_registered_users_v1',
  USER_PROFILES: 'byfio_user_profiles_v1',
  CUSTOMERS: 'byfio_customers_v1',
  CUSTOMER_FIELDS: 'byfio_customer_fields_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as ViewMode) || 'store';
  });

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

  // Web Intro Video Overlay state: Auto-plays on app load (initial visit)
  const [isIntroOpen, setIsIntroOpen] = useState(true);

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

  const setSoundBubbleEnabled = (enabled: boolean) => {
    setSoundBubbleEnabledState(enabled);
    localStorage.setItem(STORAGE_KEYS.SOUND_BUBBLE, String(enabled));
  };

  const setSoundButtonsEnabled = (enabled: boolean) => {
    setSoundButtonsEnabledState(enabled);
    localStorage.setItem(STORAGE_KEYS.SOUND_BUTTONS, String(enabled));
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
  };

  const deleteUserProfile = (id: string) => {
    const updated = userProfiles.filter((p) => p.id !== id);
    setUserProfiles(updated);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(updated));
  };

  const toggleUserProfileStatus = (id: string) => {
    const updated = userProfiles.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    setUserProfiles(updated);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(updated));
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
    const nextNumber = 1000 + orders.length + 1;
    const orderNumber = `#FIO-${nextNumber}`;

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

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch(() => {});

    // Descontar inventario
    setProducts((prev) => {
      const updatedProds = prev.map((prod) => {
        const sold = orderData.items.find((it) => it.sku === prod.sku);
        if (sold) {
          const newStock = Math.max(0, prod.stock - sold.quantity);
          fetch(`/api/products/${prod.id}/stock`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: newStock }),
          }).catch(() => {});
          return { ...prod, stock: newStock };
        }
        return prod;
      });
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProds));
      return updatedProds;
    });

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
    // 1. El login se mueve hacia arriba y se esconde
    setLoginIntroStage(1);

    // 1 segundo después: 2. El difuminado de atrás se quita suavemente
    setTimeout(() => {
      setLoginIntroStage(2);
    }, 1000);

    // 1 segundo después (2s total): 3. La barra de menú superior sale de arriba hacia abajo suavemente
    setTimeout(() => {
      setLoginIntroStage(3);
      onComplete();
    }, 2000);

    // 1 segundo después (3s total): 4. Aparece la sección panel de control de izquierda hacia derecha
    setTimeout(() => {
      setLoginIntroStage(4);
    }, 3000);

    // 1 segundo después (4s total): 5. Aparece la sección menú principal de administración de derecha a izquierda
    setTimeout(() => {
      setLoginIntroStage(5);
    }, 4000);

    // 1 segundo después (5s total): 6. Aparece la sección de catálogo comercial online de abajo hacia arriba suavemente
    setTimeout(() => {
      setLoginIntroStage(6);
    }, 5000);

    // 1 segundo después (6s total): Culminación completa de la coreografía
    setTimeout(() => {
      setLoginIntroStage(0);
    }, 6000);
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

  // Sync initial data from Cloud Database
  useEffect(() => {
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});

    fetch('/api/orders')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        }
      })
      .catch(() => {});
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

    const nextNumber = 1000 + orders.length + 1;
    const orderNumber = `#FIO-${nextNumber}`;

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
    }).catch(() => {});

    // Deduct stock locally and in D1
    setProducts((prev) =>
      prev.map((prod) => {
        const inCart = cart.find((c) => c.sku === prod.sku);
        if (inCart) {
          const newStock = Math.max(0, prod.stock - inCart.quantity);
          fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: prod.id, stock: newStock }),
          }).catch(() => {});
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );

    setOrders((prev) => [...prev, newOrder]);
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

        const allPicked = updatedItems.every((it) => it.isPicked);
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

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const packedAt = newStatus === 'packed' ? new Date().toISOString() : undefined;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: newStatus,
              packedAt: packedAt || o.packedAt,
            }
          : o
      )
    );

    fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, orderStatus: newStatus, packedAt }),
    }).catch(() => {});
  };

  const updateProductStock = (
    productId: string,
    stock: number,
    minStock?: number,
    maxStock?: number
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock,
              minStock: minStock !== undefined ? minStock : p.minStock,
              maxStock: maxStock !== undefined ? maxStock : p.maxStock,
            }
          : p
      )
    );

    fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId, stock, minStock, maxStock }),
    }).catch(() => {});
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Save to D1 database
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    }).catch(() => {});

    return newProduct;
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateProduct = (productId: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedData } : p))
    );
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
    const nextNumber = 1000 + orders.length + 1;
    const orderNumber = `#FIO-${nextNumber}`;

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
    }).catch(() => {});

    setWorkshops((prev) =>
      prev.map((w) =>
        w.id === workshop.id
          ? { ...w, spotsAvailable: Math.max(0, w.spotsAvailable - quantity) }
          : w
      )
    );

    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setWorkshops(INITIAL_WORKSHOPS);
    setCustomers(INITIAL_CUSTOMERS);
    setCustomerFieldDefs(DEFAULT_CUSTOMER_FIELDS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.WORKSHOPS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_FIELDS);
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
        updateOrderStatus,
        updateProductStock,
        addProduct,
        updateProduct,
        deleteProduct,
        addWorkshop,
        updateWorkshop,
        deleteWorkshop,
        bookWorkshopDirect,
        resetToDefaults,
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
