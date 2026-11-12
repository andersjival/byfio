import { calculateLayawayDaysRemaining, checkAndSendLayawayReminders } from '../services/layawayReminderService';
import { LAYAWAY_SALE_CATEGORY, isLayawaySaleOrder } from '../utils/layaway';
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  ViewMode, InventoryMode, Product, Workshop, Order, CartItem, OrderStatus, LayawayPaymentRecord,
  TypographyTheme, ColorTheme, StarAlertDuration, PricingSectionData, AuthUser,
  UserProfile, UserPermissions, PaymentMethod, Customer, CustomerFieldDef, OrderItem,
  SinpeTransaction, SinpeSettings, InventoryMissingReport, SinpeCheckoutValidationResult,
  SuperadminModuleConfig, SuperadminSubFeature, AgendaItem, AgendaStatus,
  Supplier, SupplierOrder, SupplierOrderStatus, DailyClosingRecord, ProposalAcceptance,
  InventoryAdjustmentRecord, ShelfInventoryState, ShelfInventoryStatus,
  SweepLoadMode, SweepEntryStatus, InventorySweepEntry,
  WorkshopWaitlistEntry, WorkshopWaitlistSettings
} from '../types';
import {
  DEFAULT_WAITLIST_SETTINGS,
  resolveWaitlistWhatsappTarget,
  sortWaitlistFifo,
} from '../utils/workshopWaitlist';
import { INITIAL_PRODUCTS, INITIAL_WORKSHOPS, INITIAL_ORDERS, INITIAL_SINPE_TRANSACTIONS, INITIAL_SINPE_SETTINGS } from '../utils/seedData';
import { INITIAL_PRICING_DATA } from '../utils/pricingSeedData';
import { INITIAL_AGENDA_ITEMS, AGENDA_STORAGE_KEY } from '../utils/agendaData';
import {
  SUPERADMIN_CREDENTIALS,
  SUPERADMIN_STORAGE_KEY,
  SUPERADMIN_AUTH_KEY,
  INITIAL_SUPERADMIN_MODULES
} from '../utils/superadminModulesData';
import { playAudioBeep, formatInternalProductCode } from '../utils/formatters';
import { playNewOrderChimeSound } from '../utils/soundEffects';
import { sendOrderPushNotification } from '../utils/pushNotifications';
import { isHomeLocation } from '../utils/routeHelpers';
import { metricsTracker } from '../services/metricsTracker';
import { deepSanitize } from '../utils/sanitizeText';
import { safeSessionStorage, safeLocalStorage } from '../utils/safeStorage';
import { getClientDeviceInfo } from '../utils/deviceDetection';
import { pushStoreConfig, applyCloudCatalogTaxonomies, getLastBlockedPushAt } from '../utils/storeConfigSync';
import {
  AppScope,
  detectInitialAppScope,
  readScopedAuthUser,
  writeScopedAuthUser,
  clearScopedAuthUser,
} from '../utils/appScope';

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
    id: 'prof-admin',
    name: 'ADMINISTRACIÓN (FIO)',
    pin: '7777',
    role: 'admin',
    isActive: true,
    createdAt: '2026-10-30T00:00:00.000Z',
    note: 'Administración general, gerencia y control total del sistema',
    permissions: {
      orders: true,
      billing: true,
      inventory: true,
      reports: true,
      workshops: true,
      pricing: true,
      users: true,
      customers: true,
      agenda: true,
      suppliers: true,
    },
  },
  {
    id: 'prof-maria',
    name: 'MARÍA',
    pin: '1234',
    role: 'staff',
    isActive: true,
    createdAt: '2026-10-30T00:00:00.000Z',
    note: 'Colaboradora de ventas, mostrador, facturación y pedidos',
    permissions: {
      orders: true,
      billing: true,
      inventory: true,
      reports: true,
      workshops: true,
      pricing: true,
      users: false,
      customers: true,
      agenda: true,
      suppliers: true,
    },
  },
  {
    id: 'prof-alisto',
    name: 'ALISTO DE PEDIDOS',
    pin: '1001',
    role: 'staff',
    isActive: true,
    createdAt: '2026-10-30T10:00:00-06:00',
    note: 'Operario de alisto, picking y empaque de órdenes',
    permissions: {
      orders: true,
      billing: false,
      inventory: false,
      reports: false,
      workshops: false,
      pricing: false,
      users: false,
      customers: false,
      agenda: true,
      suppliers: true,
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
      customers: true,
      agenda: true,
      suppliers: true,
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

const RESERVED_WEB_EMAILS = new Set(['fio@byfiocr.com', 'fio', 'superadmin@byfio.com']);

const mergeRegisteredUsersIntoCustomers = (baseCustomers: Customer[], regUsers: any[]): Customer[] => {
  if (!Array.isArray(regUsers) || regUsers.length === 0) return baseCustomers;

  let changed = false;
  const result = baseCustomers.map((c) => ({
    ...c,
    customFields: c.customFields ? { ...c.customFields } : undefined,
  }));

  for (const raw of regUsers) {
    if (!raw || typeof raw !== 'object' || !raw.email) continue;
    const cleanEmail = String(raw.email).trim().toLowerCase();
    if (!cleanEmail || RESERVED_WEB_EMAILS.has(cleanEmail)) continue;

    const webName = String(raw.name || '').trim() || cleanEmail.split('@')[0];
    const webPhone = String(raw.phone || '').trim();
    const webAddress = String(raw.address || '').trim();
    const webIdCard = String(raw.idCard || '').trim();
    const regId = `reg-${cleanEmail}`;

    const existingIdx = result.findIndex(
      (c) => c.id === regId || (c.email && c.email.trim().toLowerCase() === cleanEmail)
    );

    if (existingIdx !== -1) {
      const curr = result[existingIdx];
      const nextPhone = curr.phone?.trim() ? curr.phone : webPhone;
      const nextAddress = curr.address?.trim() ? curr.address : (webAddress || undefined);
      const nextEmail = curr.email?.trim() ? curr.email : cleanEmail;
      const currCedula = curr.customFields?.['field-cedula'];
      const nextCustomFields =
        webIdCard && !currCedula
          ? { ...(curr.customFields || {}), 'field-cedula': webIdCard }
          : curr.customFields;

      if (
        nextPhone !== curr.phone ||
        nextAddress !== curr.address ||
        nextEmail !== curr.email ||
        nextCustomFields !== curr.customFields
      ) {
        result[existingIdx] = {
          ...curr,
          email: nextEmail,
          phone: nextPhone,
          address: nextAddress,
          customFields: nextCustomFields,
        };
        changed = true;
      }
    } else {
      result.push({
        id: regId,
        name: webName,
        phone: webPhone,
        email: cleanEmail,
        address: webAddress || undefined,
        notes: 'Cliente registrado en la página web',
        createdAt: typeof raw.createdAt === 'string' && raw.createdAt ? raw.createdAt : new Date().toISOString(),
        createdBy: 'Registro Web (Cliente)',
        customFields: webIdCard ? { 'field-cedula': webIdCard } : undefined,
      });
      changed = true;
    }
  }

  return changed ? result : baseCustomers;
};

export interface CartToastInfo {
  productName: string;
  quantity?: number;
  image?: string;
  price?: number;
}

export interface NewOrderAlertInfo {
  orderNumber?: string;
  customerName?: string;
  total?: number;
  isWorkshop?: boolean;
  workshopTitle?: string;
  isLayaway?: boolean;
}

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  products: Product[];
  workshops: Workshop[];
  orders: Order[];
  deleteOrder: (id: string) => Promise<void>;
  clearAllOrders: () => Promise<void>;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  cartToast: CartToastInfo | null;
  showCartSuccessToast: (info: CartToastInfo) => void;
  closeCartToast: () => void;
  newOrderAlert: NewOrderAlertInfo | null;
  showNewOrderAlert: (info?: NewOrderAlertInfo) => void;
  closeNewOrderAlert: () => void;
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
  pickingMode: 'barcode' | 'manual';
  setPickingMode: (mode: 'barcode' | 'manual') => void;
  startPicking: (orderId: string, mode?: 'barcode' | 'manual') => void;
  markItemPicked: (orderId: string, itemSku: string, pickerName?: string) => { isComplete: boolean; error?: string };
  unmarkItemPicked: (orderId: string, itemSku: string) => void;
  markAllItemsPicked: (orderId: string, pickerName?: string) => { isComplete: boolean };
  markItemMissing: (orderId: string, itemSku: string) => { isComplete: boolean; error?: string };
  updateOrderItemQuantity: (orderId: string, itemSku: string, newQuantity: number) => { success: boolean; error?: string };
  missingInventoryReports: InventoryMissingReport[];
  resolveMissingReport: (reportId: string) => void;
  deleteMissingReport: (reportId: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, pickerName?: string) => void;
  addLayawayPayment: (
    orderId: string,
    payment: {
      amount: number;
      paymentMethod: 'sinpe' | 'transferencia' | 'tarjeta' | 'efectivo';
      reference?: string;
      notes?: string;
      registeredBy?: string;
    }
  ) => Promise<boolean>;
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
  resetWorkshopsToDefaults: () => Promise<void>;
  workshopWaitlist: WorkshopWaitlistEntry[];
  workshopWaitlistSettings: WorkshopWaitlistSettings;
  joinWorkshopWaitlist: (payload: {
    workshop: Workshop;
    name: string;
    email: string;
    phone: string;
    idCard?: string;
    address?: string;
  }) => Promise<{ entry: WorkshopWaitlistEntry; position: number; emailDispatch?: { sent: boolean; provider: string; error?: string } }>;
  saveWorkshopWaitlistSettings: (settings: WorkshopWaitlistSettings) => Promise<void>;
  notifyWorkshopWaitlistSpotOpened: (workshopId: string, entryId?: string) => Promise<{ notifiedCount: number; emailSentCount: number }>;
  removeWorkshopWaitlistEntry: (entryId: string) => void;
  refreshWorkshopWaitlist: () => Promise<void>;
  editingWorkshop: Workshop | null;
  setEditingWorkshop: (ws: Workshop | null) => void;
  bookWorkshopDirect: (
    workshop: Workshop,
    quantity: number,
    customerInfo: { name: string; phone: string; email?: string; notes?: string; paymentStatus?: 'pending' | 'paid' }
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
  starAlertDuration: StarAlertDuration;
  setStarAlertDuration: (duration: StarAlertDuration) => void;
  welcomeStarModal: { isOpen: boolean; userName: string; email: string } | null;
  triggerWelcomeStarModal: (userName: string, email: string) => void;
  closeWelcomeStarModal: () => void;
  isMyAccountOpen: boolean;
  setIsMyAccountOpen: (open: boolean) => void;
  updateCurrentUserData: (updates: Partial<AuthUser>) => void;
  currentUser: AuthUser | null;
  loginUser: (email: string, pass: string) => { success: boolean; error?: string; user?: AuthUser };
  loginWithPin: (pin: string, targetProfileName?: string) => { success: boolean; error?: string; user?: AuthUser };
  registerUser: (
    email: string,
    pass: string,
    name?: string,
    phone?: string,
    idCard?: string,
    address?: string,
    lat?: number,
    lng?: number,
    options?: { skipWelcomeModal?: boolean; province?: string; deviceType?: 'pc' | 'mobile' | 'tablet'; deviceModel?: string }
  ) => { success: boolean; error?: string; user?: AuthUser };
  resetPassword: (email: string, newPass: string) => { success: boolean; error?: string };
  logoutUser: () => void;
  isLogoutTransitionOpen: boolean;
  appScope: AppScope;
  setAppScope: (scope: AppScope) => void;
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
  addCustomer: (data: Omit<Customer, 'id' | 'createdAt'> & { createdAt?: string; createdBy?: string }) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  syncRegisteredUsers: () => Promise<void>;
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
  validateSinpeReference: (ref: string) => {
    isValid: boolean;
    isUsed: boolean;
    message: string;
    transaction?: SinpeTransaction;
  };
  verifySinpePaymentForCheckout: (
    ref: string,
    requiredTotal: number,
    isSecondVoucher?: boolean,
    firstVoucherRef?: string
  ) => Promise<SinpeCheckoutValidationResult>;
  markSinpeTransactionUsed: (referenceNumber: string, orderId: string) => void;
  simulateBcrEmailNotification: (
    referenceNumber: string,
    amount: number,
    clientName?: string
  ) => SinpeTransaction;
  deleteSinpeTransaction: (id: string) => void;
  updateSinpeSettings: (settings: Partial<SinpeSettings>) => void;
  isSinpeModalOpen: boolean;
  setIsSinpeModalOpen: (open: boolean) => void;
  superadminModules: SuperadminModuleConfig[];
  isSuperAdminAuthenticated: boolean;
  loginSuperAdmin: (user: string, pass: string) => { success: boolean; error?: string };
  logoutSuperAdmin: () => void;
  toggleSuperadminModule: (moduleId: string, enabled?: boolean) => void;
  toggleSuperadminFeature: (moduleId: string, featureId: string, enabled?: boolean) => void;
  deactivateSuperadminModuleComplete: (moduleId: string) => void;
  activateSuperadminModuleComplete: (moduleId: string) => void;
  resetSuperadminModules: () => void;
  setAllSuperadminModules: (enabled: boolean) => void;
  isModuleEnabled: (moduleIdOrAlias: string) => boolean;
  isFeatureEnabled: (moduleId: string, featureId: string) => boolean;
  agendaItems: AgendaItem[];
  addAgendaItem: (item: Omit<AgendaItem, 'id' | 'createdAt'> & { id?: string }) => AgendaItem;
  updateAgendaItem: (id: string, updates: Partial<AgendaItem>) => void;
  deleteAgendaItem: (id: string) => void;
  toggleAgendaItemStatus: (id: string) => void;
  supplierOrders: SupplierOrder[];
  addSupplierOrder: (order: Omit<SupplierOrder, 'id' | 'createdAt'>) => SupplierOrder;
  updateSupplierOrder: (id: string, updates: Partial<SupplierOrder>) => void;
  deleteSupplierOrder: (id: string) => void;
  updateSupplierOrderStatus: (id: string, newStatus: SupplierOrderStatus) => void;
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => Supplier;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  dailyClosings: DailyClosingRecord[];
  saveDailyClosing: (closingData: Omit<DailyClosingRecord, 'id' | 'closedAt'> & { id?: string; closedAt?: string }) => DailyClosingRecord;
  deleteDailyClosing: (id: string) => void;
  getDailyClosingByDate: (dateStr: string) => DailyClosingRecord | undefined;
  proposalAcceptances: ProposalAcceptance[];
  acceptProposal: (acceptanceData?: {
    clientName?: string;
    clientPhone?: string;
    notes?: string;
    planName?: string;
    monthlyFee?: number;
  }) => ProposalAcceptance;
  markProposalAcceptanceAsRead: (id: string) => void;
  updateProposalAcceptanceStatus: (id: string, status: 'pending' | 'contacted' | 'active') => void;
  deleteProposalAcceptance: (id: string) => void;
  inventoryAdjustments: InventoryAdjustmentRecord[];
  addInventoryAdjustment: (adj: Omit<InventoryAdjustmentRecord, 'id' | 'createdAt' | 'dateFormatted' | 'timeFormatted'>) => Promise<InventoryAdjustmentRecord>;
  deleteInventoryAdjustment: (id: string) => void;
  collaboratorInventoryEnabled: boolean;
  toggleCollaboratorInventoryEnabled: (enabled?: boolean) => void;
  shelfInventoryStates: Record<string, ShelfInventoryState>;
  updateShelfInventoryStatus: (shelfName: string, status: ShelfInventoryStatus, verifiedCount?: number) => void;
  resetShelvesInventoryStatus: () => void;
  sweepEntries: InventorySweepEntry[];
  sweepLoadMode: SweepLoadMode;
  setSweepLoadMode: (mode: SweepLoadMode) => void;
  registerSweepEntry: (
    entryData: Omit<InventorySweepEntry, 'id' | 'createdAt' | 'status' | 'userId' | 'userName'>
  ) => { entry: InventorySweepEntry; autoLoadedCount: number };
  loadSweepEntriesToInventory: (entryIds?: string[]) => Promise<number>;
  updateSweepEntryStatus: (entryId: string, nextStatus: SweepEntryStatus) => void;
  deleteSweepEntry: (entryId: string) => void;
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
  STAR_ALERT_DURATION: 'byfio_star_alert_duration_v1',
  AUTH_USER: 'byfio_auth_user_v1',
  REGISTERED_USERS: 'byfio_registered_users_v1',
  USER_PROFILES: 'byfio_user_profiles_v1',
  CUSTOMERS: 'byfio_customers_v1',
  CUSTOMER_FIELDS: 'byfio_customer_fields_v1',
  INVENTORY_MODE: 'byfio_inventory_mode_v1',
  SINPE_TRANSACTIONS: 'byfio_sinpe_transactions_v1',
  SINPE_SETTINGS: 'byfio_sinpe_settings_v1',
  MISSING_INVENTORY: 'byfio_missing_inventory_v1',
  SUPERADMIN_MODULES: SUPERADMIN_STORAGE_KEY,
  AGENDA_ITEMS: AGENDA_STORAGE_KEY,
  SUPPLIER_ORDERS: 'byfio_supplier_orders_v1',
  SUPPLIERS: 'byfio_suppliers_directory_v1',
  DAILY_CLOSINGS: 'byfio_daily_closings_v1',
  PROPOSAL_ACCEPTANCES: 'byfio_proposal_acceptances_v1',
  INVENTORY_ADJUSTMENTS: 'byfio_inventory_adjustments_v1',
  COLLABORATOR_INVENTORY_ENABLED: 'byfio_collaborator_inventory_enabled_v1',
  SHELF_INVENTORY_STATES: 'byfio_shelf_inventory_states_v1',
  SWEEP_ENTRIES: 'byfio_inventory_sweep_entries_v1',
  SWEEP_LOAD_MODE: 'byfio_sweep_load_mode_v1',
  WORKSHOP_WAITLIST: 'byfio_workshop_waitlist_v1',
  WORKSHOP_WAITLIST_SETTINGS: 'byfio_workshop_waitlist_settings_v1',
};

// Canal de difusión en tiempo real entre pestañas del navegador (0ms latencia para inventario y pedidos)
const syncChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('byfio_realtime_sync')
    : null;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appScope, setAppScopeState] = useState<AppScope>(() => detectInitialAppScope());
  const appScopeRef = useRef<AppScope>(appScope);
  appScopeRef.current = appScope;

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return appScope === 'admin' ? 'admin' : 'store';
  });

  const [inventoryMode, setInventoryModeState] = useState<InventoryMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY_MODE);
    return saved === 'availability' || saved === 'stock' ? (saved as InventoryMode) : 'stock';
  });

  const setInventoryMode = (mode: InventoryMode) => {
    setInventoryModeState(mode);
    localStorage.setItem(STORAGE_KEYS.INVENTORY_MODE, mode);
    lastLocalConfigUpdateRef.current.inventoryMode = Date.now();
    pushStoreConfig({ inventoryMode: mode });
    syncChannel?.postMessage({ type: 'SYNC_UPDATE', inventoryMode: mode });
  };

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = safeLocalStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const initial = JSON.parse(saved);
        if (Array.isArray(initial) && initial.length > 0) {
          const sanitized = deepSanitize(initial)
            .filter((p: any) => p && p.id)
            .map((p: any) => ({
              ...p,
              sku: formatInternalProductCode(p.sku, p.sku),
              qrCode: p.qrCode ? formatInternalProductCode(p.qrCode, p.qrCode) : p.qrCode,
            }));
          if (sanitized.length > 0) {
            const existingIds = new Set(sanitized.map((p: any) => p.id));
            const missingSeed = INITIAL_PRODUCTS.filter((ip) => !existingIds.has(ip.id));
            if (missingSeed.length > 0) {
              return [...sanitized, ...missingSeed];
            }
            return sanitized;
          }
        }
      }
    } catch (e) {
      console.warn('Error al restaurar productos de storage:', e);
    }
    return deepSanitize(INITIAL_PRODUCTS);
  });

  const [workshops, setWorkshops] = useState<Workshop[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKSHOPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return deepSanitize(parsed);
        }
      }
    } catch {}
    const initial = deepSanitize(INITIAL_WORKSHOPS);
    try { localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(initial)); } catch {}
    return initial;
  });

  const [workshopWaitlist, setWorkshopWaitlist] = useState<WorkshopWaitlistEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKSHOP_WAITLIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return sortWaitlistFifo(deepSanitize(parsed));
      }
    } catch {}
    return [];
  });

  const [workshopWaitlistSettings, setWorkshopWaitlistSettings] = useState<WorkshopWaitlistSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKSHOP_WAITLIST_SETTINGS);
      if (saved) return { ...DEFAULT_WAITLIST_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return { ...DEFAULT_WAITLIST_SETTINGS };
  });

  // Serializador ligero para almacenamiento local de pedidos (evita cuota excedida omitiendo base64 gigantes)
  const serializeOrdersForStorage = (ordersList: Order[]): string => {
    try {
      const light = ordersList.slice(0, 50).map((ord) => ({
        ...ord,
        items: Array.isArray(ord.items)
          ? ord.items.map((it) => ({
              ...it,
              image: typeof it.image === 'string' && it.image.startsWith('data:') ? undefined : it.image,
            }))
          : [],
      }));
      return JSON.stringify(light);
    } catch {
      return '[]';
    }
  };

  const sanitizeOrderList = (orderList: any[]): Order[] => {
    return deepSanitize(orderList).map((o: Order) => {
      const hasItems = Array.isArray(o.items) && o.items.length > 0;
      const isAllAlistado =
        hasItems &&
        o.items.every((it) => it.isPicked || it.isMissing);

      // Si todo el alisto está al 100% y sigue en pending o picking, avanzar a packing
      if (isAllAlistado && (o.orderStatus === 'pending' || o.orderStatus === 'picking')) {
        return {
          ...o,
          orderStatus: 'packing' as OrderStatus,
          pickedBy: o.pickedBy || 'Administración',
          pickedAt: o.pickedAt || o.packedAt || o.createdAt,
        };
      }
      if (isAllAlistado && !o.pickedBy) {
        return {
          ...o,
          pickedBy: 'Administración',
          pickedAt: o.pickedAt || o.packedAt || o.createdAt,
        };
      }

      // BLINDAJE ESTRICTO: Un pedido NO puede estar en packing, packed o delivered si su alisto NO está al 100%
      if (!isAllAlistado && (o.orderStatus === 'packing' || o.orderStatus === 'packed' || o.orderStatus === 'delivered')) {
        const hasAnyPicked = hasItems && o.items.some((it) => it.isPicked);
        o = {
          ...o,
          orderStatus: (hasAnyPicked ? 'picking' : 'pending') as OrderStatus,
          packedAt: undefined,
          deliveredAt: undefined,
        };
      }

      // Sanitización del número de pedido (evitar dobles ##)
      const rawNum = (o.orderNumber || '').replace(/^#+/, '');
      if (rawNum) {
        o.orderNumber = `#${rawNum}`;
      }

      // Identidad persistente de ventas generadas por liquidación de apartados
      const laySaleItem = hasItems
        ? o.items.find((it) => it.isLayawaySale || it.saleCategory === LAYAWAY_SALE_CATEGORY)
        : undefined;
      if (o.isLayawaySale || laySaleItem) {
        o = {
          ...o,
          isLayaway: false,
          isLayawaySale: true,
          saleCategory: o.saleCategory || laySaleItem?.saleCategory || LAYAWAY_SALE_CATEGORY,
          orderTitle: o.orderTitle || LAYAWAY_SALE_CATEGORY,
          layawaySourceOrderId: o.layawaySourceOrderId || laySaleItem?.layawaySourceOrderId,
          layawaySourceOrderNumber: o.layawaySourceOrderNumber || laySaleItem?.layawaySourceOrderNumber,
        };
      }

      // Reconstrucción e integridad matemática automática de apartados
      const layItem = !o.isLayawaySale && hasItems ? o.items.find((it) => it.isLayaway) : undefined;
      if (layItem) {
        const paymentsList: LayawayPaymentRecord[] = Array.isArray(o.layawayPayments) && o.layawayPayments.length > 0
          ? o.layawayPayments
          : (Array.isArray(layItem.layawayPayments) ? layItem.layawayPayments : []);

        const sumOfAbonos = paymentsList.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
        const initialPayment = Number(o.total) || 0;

        const totalPaid = paymentsList.length > 0
          ? initialPayment + sumOfAbonos
          : (Number(o.layawayDownPaymentAmount) || Number(layItem.layawayDownPaymentAmount) || initialPayment);

        let itemTotal =
          (o.layawayTotalAmount && Number(o.layawayTotalAmount) > 0 ? Number(o.layawayTotalAmount) : 0) ||
          (layItem.layawayTotalAmount && Number(layItem.layawayTotalAmount) > 0 ? Number(layItem.layawayTotalAmount) : 0) ||
          (Number(layItem.price) > initialPayment ? Number(layItem.price) : 0);

        if (!itemTotal) {
          itemTotal = totalPaid + (Number(o.layawayRemainingAmount) || Number(layItem.layawayRemainingAmount) || 0);
        }
        if (itemTotal < totalPaid) {
          itemTotal = totalPaid;
        }

        const calculatedRemaining = Math.max(0, itemTotal - totalPaid);

        o = {
          ...o,
          isLayaway: true,
          layawayMonths: o.layawayMonths || layItem.layawayMonths || 1,
          layawayPaymentsCount: o.layawayPaymentsCount || layItem.layawayPaymentsCount || 3,
          layawayDownPaymentPercent: o.layawayDownPaymentPercent || layItem.layawayDownPaymentPercent || 20,
          layawayTotalAmount: itemTotal,
          layawayDownPaymentAmount: totalPaid,
          layawayRemainingAmount: calculatedRemaining,
          layawayPayments: paymentsList,
          layawayDueDate: o.layawayDueDate || layItem.layawayDueDate,
          layawayDaysTotal: o.layawayDaysTotal || layItem.layawayDaysTotal,
          layawaySaleOrderId: o.layawaySaleOrderId || layItem.layawayGeneratedSaleOrderId,
          layawayCompletedAt: o.layawayCompletedAt || layItem.layawayGeneratedSaleCreatedAt,
        };
      }

      return o;
    });
  };

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = safeLocalStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        const initial = JSON.parse(saved);
        if (Array.isArray(initial)) {
          const sanitized = sanitizeOrderList(initial);
          return Array.isArray(sanitized)
            ? [...sanitized].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
            : [];
        }
      }
    } catch (e) {
      console.warn('Error al restaurar pedidos de storage:', e);
    }
    return [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = safeLocalStorage.getItem(STORAGE_KEYS.CART);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return deepSanitize(parsed).filter((it: any) => it && it.id);
        }
      }
    } catch {}
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
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

  const [newOrderAlert, setNewOrderAlert] = useState<NewOrderAlertInfo | null>(null);

  const closeNewOrderAlert = () => {
    setNewOrderAlert(null);
  };

  const [activePickingOrder, setActivePickingOrder] = useState<Order | null>(null);
  const [pickingMode, setPickingMode] = useState<'barcode' | 'manual'>('barcode');
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [qrModalProduct, setQrModalProduct] = useState<Product | null>(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewWorkshopModalOpen, setIsNewWorkshopModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [typographyTheme, setTypographyThemeState] = useState<TypographyTheme>(() => {
    return (localStorage.getItem(STORAGE_KEYS.TYPOGRAPHY_THEME) as TypographyTheme) || 'hybrid';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return (localStorage.getItem(STORAGE_KEYS.COLOR_THEME) as ColorTheme) || 'vibrant';
  });

  const [pricingData, setPricingData] = useState<PricingSectionData>(() => {
    try {
      const saved = safeLocalStorage.getItem(STORAGE_KEYS.PRICING_DATA);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRICING_DATA;
  });

  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isLogoutTransitionOpen, setIsLogoutTransitionOpen] = useState(false);

  // Estados para Redirección y Verificación de Pagos SINPE Móvil Banco BCR
  const [sinpeTransactions, setSinpeTransactions] = useState<SinpeTransaction[]>(() => {
    try {
      const saved = safeLocalStorage.getItem(STORAGE_KEYS.SINPE_TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SINPE_TRANSACTIONS;
  });

  const [sinpeSettings, setSinpeSettings] = useState<SinpeSettings>(() => {
    try {
      const saved = safeLocalStorage.getItem(STORAGE_KEYS.SINPE_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SINPE_SETTINGS;
  });

  const [isSinpeModalOpen, setIsSinpeModalOpen] = useState(false);

  // Reportes de Faltantes de Inventario detectados al Alistar Pedido
  const [missingInventoryReports, setMissingInventoryReports] = useState<InventoryMissingReport[]>(() => {
    try {
      const saved = safeLocalStorage.getItem(STORAGE_KEYS.MISSING_INVENTORY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Web Intro Video Overlay state: Solo carga y se reproduce en la portada / home en la primera visita de sesión
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(() => {
    if (!isHomeLocation()) return false;
    const hasSeen = safeSessionStorage.getItem('byfio_seen_web_intro');
    return hasSeen !== '1';
  });

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

  const syncSiteDesignToCloud = (overrides: {
    typographyTheme?: TypographyTheme;
    colorTheme?: ColorTheme;
    starAlertDuration?: StarAlertDuration;
    soundBubbleEnabled?: boolean;
    soundButtonsEnabled?: boolean;
    soundNewOrderEnabled?: boolean;
  }) => {
    lastLocalConfigUpdateRef.current.siteDesignSettings = Date.now();
    const payload = {
      typographyTheme: overrides.typographyTheme ?? typographyTheme,
      colorTheme: overrides.colorTheme ?? colorTheme,
      starAlertDuration: overrides.starAlertDuration ?? starAlertDuration,
      soundBubbleEnabled: overrides.soundBubbleEnabled ?? soundBubbleEnabled,
      soundButtonsEnabled: overrides.soundButtonsEnabled ?? soundButtonsEnabled,
      soundNewOrderEnabled: overrides.soundNewOrderEnabled ?? soundNewOrderEnabled,
      updatedAt: new Date().toISOString(),
    };
    pushStoreConfig({ siteDesignSettings: payload });
    try {
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', siteDesignSettings: payload });
    } catch {}
  };

  const setTypographyTheme = (theme: TypographyTheme) => {
    setTypographyThemeState(theme);
    localStorage.setItem(STORAGE_KEYS.TYPOGRAPHY_THEME, theme);
    syncSiteDesignToCloud({ typographyTheme: theme });
  };

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem(STORAGE_KEYS.COLOR_THEME, theme);
    if (appScope === 'admin' || viewMode === 'admin') {
      syncSiteDesignToCloud({ colorTheme: theme });
    } else {
      try { localStorage.setItem('byfio_user_color_override_v1', theme); } catch {}
    }
  };

  const setSoundBubbleEnabled = (enabled: boolean) => {
    setSoundBubbleEnabledState(enabled);
    localStorage.setItem(STORAGE_KEYS.SOUND_BUBBLE, String(enabled));
    syncSiteDesignToCloud({ soundBubbleEnabled: enabled });
  };

  const setSoundButtonsEnabled = (enabled: boolean) => {
    setSoundButtonsEnabledState(enabled);
    localStorage.setItem(STORAGE_KEYS.SOUND_BUTTONS, String(enabled));
    syncSiteDesignToCloud({ soundButtonsEnabled: enabled });
  };

  const setSoundNewOrderEnabled = (enabled: boolean) => {
    setSoundNewOrderEnabledState(enabled);
    localStorage.setItem(STORAGE_KEYS.SOUND_NEW_ORDER, String(enabled));
    syncSiteDesignToCloud({ soundNewOrderEnabled: enabled });
  };

  // Configuración de duración de la alerta estrellita (manual por defecto, o 5, 10, 15, 20 segundos)
  const [starAlertDuration, setStarAlertDurationState] = useState<StarAlertDuration>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAR_ALERT_DURATION);
    if (saved === '5' || saved === '10' || saved === '15' || saved === '20') {
      return Number(saved) as 5 | 10 | 15 | 20;
    }
    return 'manual';
  });

  const setStarAlertDuration = (duration: StarAlertDuration) => {
    setStarAlertDurationState(duration);
    localStorage.setItem(STORAGE_KEYS.STAR_ALERT_DURATION, String(duration));
    syncSiteDesignToCloud({ starAlertDuration: duration });
  };

  // Rastreo de pedidos conocidos para emitir campanilla únicamente ante nuevos pedidos reales
  const knownOrderIdsRef = useRef<Set<string>>(
    new Set((() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
        const list: Order[] = saved ? JSON.parse(saved) : [];
        return Array.isArray(list) ? list.map((o) => o.id) : [];
      } catch {
        return [];
      }
    })())
  );
  const isInitialOrdersLoadRef = useRef(true);
  // Registro de marcas de tiempo de modificaciones locales de productos, talleres y config para evitar rebote de polling
  const lastLocalProductUpdateRef = useRef<Map<string, number>>(new Map());
  const lastLocalWorkshopUpdateRef = useRef<Map<string, number>>(new Map());
  const lastLocalConfigUpdateRef = useRef<Record<string, number>>({});

  const applyCloudWorkshopUpdates = (updates: { id: string; spotsAvailable: number; totalSpots?: number }[] | undefined) => {
    if (!Array.isArray(updates) || updates.length === 0) return;
    const updMap = new Map(updates.map((u) => [String(u.id).toLowerCase(), u]));
    setWorkshops((prev) => {
      const next = prev.map((w) => {
        const matched = updMap.get(String(w.id).toLowerCase());
        return matched ? { ...w, spotsAvailable: matched.spotsAvailable } : w;
      });
      try { localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(next)); } catch {}
      try { syncChannel?.postMessage({ type: 'SYNC_UPDATE', workshops: next }); } catch {}
      return next;
    });
  };

  const checkAndNotifyNewOrders = (incomingOrders: Order[]) => {
    if (isInitialOrdersLoadRef.current) {
      incomingOrders.forEach((o) => knownOrderIdsRef.current.add(o.id));
      isInitialOrdersLoadRef.current = false;
      return;
    }

    incomingOrders
      .filter((o) =>
        isLayawaySaleOrder(o) ||
        Boolean(o.isDirectInvoice) ||
        Boolean(o.orderTitle?.includes('Facturación Rápida')) ||
        Boolean(o.orderTitle?.includes('Factura Directa')) ||
        Boolean(o.notes?.includes('Facturación Rápida POS'))
      )
      .forEach((o) => knownOrderIdsRef.current.add(o.id));
    const newOrders = incomingOrders.filter((o) => !knownOrderIdsRef.current.has(o.id));
    if (newOrders.length > 0) {
      newOrders.forEach((o) => knownOrderIdsRef.current.add(o.id));
      const firstNew = newOrders[0];
      const isWorkshop = firstNew.items?.some((it) => it.type === 'workshop') || firstNew.id?.startsWith('ord-ws-') || firstNew.orderNumber?.startsWith('#WS');
      const wsItem = firstNew.items?.find((it) => it.type === 'workshop');
      const isLayaway = Boolean(firstNew.isLayaway || firstNew.items?.some((it) => it.isLayaway));

      // Solo reproducir sonido de campana y desplegar alerta si hay un usuario logueado con permiso adecuado
      if (canReceiveOrderNotifications(Boolean(isWorkshop), isLayaway)) {
        playNewOrderChimeSound(0.85);
        showNewOrderAlert({
          orderNumber: firstNew.orderNumber,
          customerName: firstNew.customerName,
          total: firstNew.total,
          isWorkshop: Boolean(isWorkshop),
          workshopTitle: wsItem?.name,
          isLayaway,
        });
        sendOrderPushNotification({
          orderNumber: firstNew.orderNumber,
          customerName: firstNew.customerName,
          total: firstNew.total,
          isWorkshop: Boolean(isWorkshop),
          workshopTitle: wsItem?.name,
          isLayaway,
        });
      }
    }
  };

  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map<string, UserProfile>();
          DEFAULT_USER_PROFILES.forEach((p) => map.set(p.id, deepSanitize(p)));
          parsed.forEach((p: UserProfile) => {
            const sanitized = deepSanitize(p);
            map.set(p.id, {
              ...sanitized,
              permissions: {
                ...sanitized.permissions,
                suppliers: sanitized.permissions?.suppliers !== false,
              },
            });
          });
          const merged = deepSanitize(Array.from(map.values()));
          if (JSON.stringify(merged) !== JSON.stringify(parsed)) {
            try { localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(merged)); } catch {}
          }
          return merged;
        }
      }
    } catch {}
    return deepSanitize(DEFAULT_USER_PROFILES);
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

  const broadcastAndSaveProfiles = (updated: UserProfile[]) => {
    const sanitized = deepSanitize(updated);
    setUserProfiles(sanitized);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(sanitized));
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        userProfiles: sanitized,
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('byfio_user_profiles_updated', { detail: sanitized })
        );
      }
    } catch {}
    syncProfilesToCloud(sanitized);
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
    broadcastAndSaveProfiles(updated);
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
    broadcastAndSaveProfiles(updated);
  };

  const deleteUserProfile = (id: string) => {
    const updated = userProfiles.filter((p) => p.id !== id);
    broadcastAndSaveProfiles(updated);
  };

  const toggleUserProfileStatus = (id: string) => {
    const updated = userProfiles.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    broadcastAndSaveProfiles(updated);
  };

  const [customers, setCustomers] = useState<Customer[]>(() => {
    let base: Customer[] = deepSanitize(INITIAL_CUSTOMERS);
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = deepSanitize(parsed);
          if (JSON.stringify(sanitized) !== JSON.stringify(parsed)) {
            try { localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(sanitized)); } catch {}
          }
          base = sanitized;
        }
      }
    } catch {}
    try {
      const regRaw = safeLocalStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      const regParsed = regRaw ? JSON.parse(regRaw) : [];
      const merged = mergeRegisteredUsersIntoCustomers(base, regParsed);
      if (merged !== base) {
        try { localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(merged)); } catch {}
      }
      return merged;
    } catch {}
    return base;
  });

  const [customerFieldDefs, setCustomerFieldDefs] = useState<CustomerFieldDef[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER_FIELDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = deepSanitize(parsed);
          if (JSON.stringify(sanitized) !== JSON.stringify(parsed)) {
            try { localStorage.setItem(STORAGE_KEYS.CUSTOMER_FIELDS, JSON.stringify(sanitized)); } catch {}
          }
          return sanitized;
        }
      }
    } catch {}
    return deepSanitize(DEFAULT_CUSTOMER_FIELDS);
  });

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'> & { createdAt?: string; createdBy?: string }): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      name: customerData.name.trim(),
      phone: customerData.phone.trim(),
      createdAt: customerData.createdAt || new Date().toISOString(),
      createdBy: customerData.createdBy?.trim() || currentUser?.name || 'Administración (Fio)',
    };
    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
    lastLocalConfigUpdateRef.current.customers = Date.now();
    pushStoreConfig({ customers: updated });
    syncChannel?.postMessage({ type: 'SYNC_UPDATE', customers: updated });
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCustomers(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
    lastLocalConfigUpdateRef.current.customers = Date.now();
    pushStoreConfig({ customers: updated });
    syncChannel?.postMessage({ type: 'SYNC_UPDATE', customers: updated });
  };

  const deleteCustomer = (id: string) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
    lastLocalConfigUpdateRef.current.customers = Date.now();
    pushStoreConfig({ customers: updated });
    syncChannel?.postMessage({ type: 'SYNC_UPDATE', customers: updated });
  };

  const syncWebUsersToCustomers = useCallback((regUsers: any[]) => {
    if (!Array.isArray(regUsers) || regUsers.length === 0) return;
    setCustomers((prev) => {
      const merged = mergeRegisteredUsersIntoCustomers(prev, regUsers);
      if (merged === prev) return prev;
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(merged));
      } catch {}
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', customers: merged });
      return merged;
    });
  }, []);

  const syncRegisteredUsers = useCallback(async () => {
    try {
      const localRaw = JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
      const map = new Map<string, any>();
      if (Array.isArray(localRaw)) {
        for (const u of localRaw) {
          if (u && u.email) map.set(String(u.email).trim().toLowerCase(), u);
        }
      }
      const res = await fetch('/api/registered-users', { cache: 'no-store' });
      const data = res.ok ? await res.json() : null;
      if (data && Array.isArray(data.users)) {
        for (const u of data.users) {
          if (u && u.email) {
            const k = String(u.email).trim().toLowerCase();
            map.set(k, { ...(map.get(k) || {}), ...u });
          }
        }
      }
      const mergedUsers = Array.from(map.values());
      if (mergedUsers.length > 0) {
        safeLocalStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(mergedUsers));
        syncWebUsersToCustomers(mergedUsers);
      }
    } catch {}
  }, [syncWebUsersToCustomers]);

  const addCustomerFieldDef = (label: string): CustomerFieldDef => {
    const newDef: CustomerFieldDef = {
      id: `field-${Date.now()}`,
      label: label.trim(),
    };
    const updated = [...customerFieldDefs, newDef];
    setCustomerFieldDefs(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_FIELDS, JSON.stringify(updated));
    lastLocalConfigUpdateRef.current.customerFields = Date.now();
    pushStoreConfig({ customerFields: updated });
    syncChannel?.postMessage({ type: 'SYNC_UPDATE', customerFieldDefs: updated });
    return newDef;
  };

  const deleteCustomerFieldDef = (id: string) => {
    const updated = customerFieldDefs.filter((f) => f.id !== id);
    setCustomerFieldDefs(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_FIELDS, JSON.stringify(updated));
    lastLocalConfigUpdateRef.current.customerFields = Date.now();
    pushStoreConfig({ customerFields: updated });
    syncChannel?.postMessage({ type: 'SYNC_UPDATE', customerFieldDefs: updated });
  };

  // -------------------------------------------------------------
  // ESTADO Y MÉTODOS DE AGENDA Y ORGANIZADOR DE TAREAS
  // -------------------------------------------------------------
  const deduplicateAgendaItems = (items: AgendaItem[]): AgendaItem[] => {
    if (!Array.isArray(items)) return [];
    const seenIds = new Set<string>();
    const seenContent = new Set<string>();
    const result: AgendaItem[] = [];

    for (const item of items) {
      if (!item || !item.id) continue;
      const title = (item.title || '').trim().toLowerCase();
      const date = (item.date || '').trim();
      const contentKey = `${title}:::${date}`;

      if (seenIds.has(item.id)) continue;
      if (title && seenContent.has(contentKey)) continue;

      seenIds.add(item.id);
      if (title) seenContent.add(contentKey);
      result.push(item);
    }
    return result;
  };

  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AGENDA_ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const deduplicated = deduplicateAgendaItems(deepSanitize(parsed));
          if (saved && JSON.stringify(deduplicated) !== JSON.stringify(parsed)) {
            try { localStorage.setItem(STORAGE_KEYS.AGENDA_ITEMS, JSON.stringify(deduplicated)); } catch {}
          }
          return deduplicated;
        }
      }
    } catch {}
    return deduplicateAgendaItems(deepSanitize(INITIAL_AGENDA_ITEMS));
  });

  const saveAgendaItems = (items: AgendaItem[]) => {
    const deduplicated = deduplicateAgendaItems(deepSanitize(items));
    setAgendaItems(deduplicated);
    try {
      localStorage.setItem(STORAGE_KEYS.AGENDA_ITEMS, JSON.stringify(deduplicated));
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', agendaItems: deduplicated });
    } catch {}
    // Sincronización en la nube Cloudflare D1
    try {
      fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: deduplicated }),
      }).catch(() => {});
    } catch {}
  };

  const addAgendaItem = (itemData: Omit<AgendaItem, 'id' | 'createdAt'> & { id?: string }): AgendaItem => {
    const titleNorm = itemData.title.trim().toLowerCase();
    const dateNorm = (itemData.date || '').trim();

    // Detección y actualización si ya existe por ID o supplierOrderId
    const existing = agendaItems.find(
      (it) =>
        (itemData.id && it.id === itemData.id) ||
        (itemData.supplierOrderId && it.supplierOrderId === itemData.supplierOrderId) ||
        (it.title.trim().toLowerCase() === titleNorm && (it.date || '').trim() === dateNorm)
    );
    if (existing) {
      if (itemData.id || itemData.supplierOrderId) {
        const updated = agendaItems.map((it) =>
          it.id === existing.id ? { ...it, ...itemData } : it
        );
        saveAgendaItems(updated);
        return { ...existing, ...itemData };
      }
      return existing;
    }

    const newItem: AgendaItem = {
      ...itemData,
      id: itemData.id || `agenda-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    saveAgendaItems([newItem, ...agendaItems]);
    return newItem;
  };

  const updateAgendaItem = (id: string, updates: Partial<AgendaItem>) => {
    const updated = agendaItems.map((item) => (item.id === id ? { ...item, ...updates } : item));
    saveAgendaItems(updated);
  };

  const deleteAgendaItem = (id: string) => {
    const updated = agendaItems.filter((item) => item.id !== id);
    saveAgendaItems(updated);
  };

  const toggleAgendaItemStatus = (id: string) => {
    const updated = agendaItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: (item.status === 'completed' ? 'pending' : 'completed') as AgendaStatus,
        };
      }
      return item;
    });
    saveAgendaItems(updated);
  };

  // -------------------------------------------------------------
  // ESTADO Y MÉTODOS DE PEDIDOS A PROVEEDOR
  // -------------------------------------------------------------
  const DEFAULT_SUPPLIER_ORDERS: SupplierOrder[] = [];
  const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIER_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return deepSanitize(parsed);
        }
      }
    } catch {}
    return deepSanitize(DEFAULT_SUPPLIER_ORDERS);
  });

  const saveSupplierOrders = (ordersList: SupplierOrder[]) => {
    const sanitized = deepSanitize(ordersList);
    setSupplierOrders(sanitized);
    try {
      localStorage.setItem(STORAGE_KEYS.SUPPLIER_ORDERS, JSON.stringify(sanitized));
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', supplierOrders: sanitized });
    } catch {}
    try {
      fetch('/api/supplier-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: sanitized }),
      }).catch(() => {});
    } catch {}
  };

  const addSupplierOrder = (orderData: Omit<SupplierOrder, 'id' | 'createdAt'>): SupplierOrder => {
    const newOrder: SupplierOrder = {
      ...orderData,
      id: `supp-ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    saveSupplierOrders([newOrder, ...supplierOrders]);
    return newOrder;
  };

  const updateSupplierOrder = (id: string, updates: Partial<SupplierOrder>) => {
    const updated = supplierOrders.map((ord) => (ord.id === id ? { ...ord, ...updates } : ord));
    saveSupplierOrders(updated);
  };

  const deleteSupplierOrder = (id: string) => {
    const updated = supplierOrders.filter((ord) => ord.id !== id);
    saveSupplierOrders(updated);

    // Eliminar también cualquier evento de agenda vinculado a esta orden
    const nextAgenda = agendaItems.filter(
      (it) => it.supplierOrderId !== id && it.id !== `agenda-supp-${id}` && !it.notes?.includes(`RefID: ${id}`)
    );
    if (nextAgenda.length !== agendaItems.length) {
      saveAgendaItems(nextAgenda);
    }
  };

  const updateSupplierOrderStatus = (id: string, newStatus: SupplierOrderStatus) => {
    const now = new Date().toISOString();
    const updated = supplierOrders.map((ord) => {
      if (ord.id === id) {
        return {
          ...ord,
          status: newStatus,
          orderedAt: newStatus === 'ordered' ? (ord.orderedAt || now) : ord.orderedAt,
          receivedAt: newStatus === 'received' ? (ord.receivedAt || now) : (newStatus === 'draft' ? undefined : ord.receivedAt),
        };
      }
      return ord;
    });
    saveSupplierOrders(updated);
  };

  // -------------------------------------------------------------
  // ESTADO Y MÉTODOS DE DIRECTORIO DE PROVEEDORES
  // -------------------------------------------------------------
  const DEFAULT_SUPPLIERS_LIST: Supplier[] = [
    {
      id: 'supp-1',
      name: 'Papelera Internacional',
      phone: '2222-1111',
      whatsappPhone: '22221111',
      email: 'ventas@papeleraint.cr',
      address: 'San José Centro, 200m oeste de La Merced',
      notes: 'Papelería, cartulinas importadas y sobres especiales',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'supp-2',
      name: 'Sublimaciones CR',
      phone: '2440-2222',
      whatsappPhone: '24402222',
      email: 'pedidos@sublimacionescr.com',
      address: 'Alajuela, El Coyol',
      notes: 'Tazas, botellas térmicas y blanks para sublimar',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'supp-3',
      name: 'Insumos Creativos',
      phone: '8888-3333',
      whatsappPhone: '88883333',
      email: 'contacto@insumoscreativos.cr',
      address: 'Heredia Centro',
      notes: 'Cintas, adhesivos de encuadernación y pegamentos libres de ácido',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'supp-4',
      name: 'Distribuidora FIO',
      phone: '6400-4640',
      whatsappPhone: '64004640',
      email: 'taller@byfio.com',
      address: 'Tibás, San José',
      notes: 'Insumos propios de taller y encuadernación',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'supp-5',
      name: 'Proveedor Local',
      phone: '2233-4455',
      whatsappPhone: '22334455',
      email: 'local@proveedores.cr',
      address: 'San José, Tibás',
      notes: 'Materiales varios y papelería rápida',
      createdAt: new Date().toISOString(),
    },
  ];

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return deepSanitize(parsed);
        }
      }
    } catch {}
    return deepSanitize(DEFAULT_SUPPLIERS_LIST);
  });

  const saveSuppliers = (suppliersList: Supplier[]) => {
    const sanitized = deepSanitize(suppliersList);
    setSuppliers(sanitized);
    try {
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(sanitized));
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', suppliers: sanitized });
    } catch {}
    try {
      fetch('/api/supplier-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suppliers: sanitized }),
      }).catch(() => {});
    } catch {}
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt'>): Supplier => {
    const newSupp: Supplier = {
      ...supplierData,
      id: `supp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    saveSuppliers([...suppliers, newSupp]);
    return newSupp;
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    const updated = suppliers.map((s) => (s.id === id ? { ...s, ...updates } : s));
    saveSuppliers(updated);
  };

  const deleteSupplier = (id: string) => {
    const updated = suppliers.filter((s) => s.id !== id);
    saveSuppliers(updated);
  };

  const [dailyClosings, setDailyClosings] = useState<DailyClosingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_CLOSINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return deepSanitize(parsed);
        }
      }
    } catch {}
    return [];
  });

  const saveDailyClosings = (closingsList: DailyClosingRecord[]) => {
    const sanitized = deepSanitize(closingsList);
    setDailyClosings(sanitized);
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_CLOSINGS, JSON.stringify(sanitized));
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', dailyClosings: sanitized });
    } catch {}
    try {
      fetch('/api/daily-closings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ closings: sanitized }),
      }).catch(() => {});
    } catch {}
  };

  const saveDailyClosing = (closingData: Omit<DailyClosingRecord, 'id' | 'closedAt'> & { id?: string; closedAt?: string }): DailyClosingRecord => {
    const existingIndex = dailyClosings.findIndex((c) => c.closingDate === closingData.closingDate);
    const record: DailyClosingRecord = {
      ...closingData,
      id: closingData.id || (existingIndex >= 0 ? dailyClosings[existingIndex].id : `closing-${closingData.closingDate}-${Date.now()}`),
      closedAt: closingData.closedAt || new Date().toISOString(),
    };

    let nextList: DailyClosingRecord[];
    if (existingIndex >= 0) {
      nextList = dailyClosings.map((c, idx) => (idx === existingIndex ? record : c));
    } else {
      nextList = [record, ...dailyClosings].sort((a, b) => b.closingDate.localeCompare(a.closingDate));
    }

    saveDailyClosings(nextList);
    return record;
  };

  const deleteDailyClosing = (id: string) => {
    const updated = dailyClosings.filter((c) => c.id !== id);
    saveDailyClosings(updated);
  };

  const getDailyClosingByDate = (dateStr: string): DailyClosingRecord | undefined => {
    return dailyClosings.find((c) => c.closingDate === dateStr);
  };

  // ESTADO Y MÉTODOS DE ACEPTACIONES DE PROPUESTA (EXCLUSIVO SUPERADMIN)
  const [proposalAcceptances, setProposalAcceptances] = useState<ProposalAcceptance[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPOSAL_ACCEPTANCES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return deepSanitize(parsed);
      }
    } catch {}
    return [];
  });

  const saveProposalAcceptances = (list: ProposalAcceptance[]) => {
    const sanitized = deepSanitize(list);
    setProposalAcceptances(sanitized);
    try {
      localStorage.setItem(STORAGE_KEYS.PROPOSAL_ACCEPTANCES, JSON.stringify(sanitized));
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', proposalAcceptances: sanitized });
    } catch {}
    try {
      fetch('/api/proposal-acceptances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptances: sanitized }),
      }).catch(() => {});
    } catch {}
  };

  const acceptProposal = (acceptanceData?: {
    clientName?: string;
    clientPhone?: string;
    notes?: string;
    planName?: string;
    monthlyFee?: number;
  }): ProposalAcceptance => {
    const newRecord: ProposalAcceptance = {
      id: `prop-acc-${Date.now()}`,
      clientName: acceptanceData?.clientName?.trim() || 'Fiorella Jara / By.Fio',
      clientPhone: acceptanceData?.clientPhone?.trim() || '6400-4640',
      notes: acceptanceData?.notes?.trim() || 'Aceptación formal de la propuesta Partner By.Fio.',
      planName: acceptanceData?.planName || 'Plan Partner By.Fio (11 Módulos Base + 3 Regalías)',
      monthlyFee: acceptanceData?.monthlyFee || 40000,
      acceptedAt: new Date().toISOString(),
      status: 'pending',
      readBySuperadmin: false,
    };

    const nextList = [newRecord, ...proposalAcceptances];
    saveProposalAcceptances(nextList);

    try {
      window.dispatchEvent(new CustomEvent('byfio_proposal_accepted', { detail: newRecord }));
    } catch {}

    return newRecord;
  };

  const markProposalAcceptanceAsRead = (id: string) => {
    const updated = proposalAcceptances.map((item) =>
      item.id === id ? { ...item, readBySuperadmin: true } : item
    );
    saveProposalAcceptances(updated);
  };

  const updateProposalAcceptanceStatus = (id: string, status: 'pending' | 'contacted' | 'active') => {
    const updated = proposalAcceptances.map((item) =>
      item.id === id ? { ...item, status, readBySuperadmin: true } : item
    );
    saveProposalAcceptances(updated);
  };

  const deleteProposalAcceptance = (id: string) => {
    const updated = proposalAcceptances.filter((item) => item.id !== id);
    saveProposalAcceptances(updated);
  };

  // =========================================================================
  // SISTEMA DE TOMA DE INVENTARIO POR ESTANTES, AJUSTES Y REPORTES
  // =========================================================================
  const [inventoryAdjustments, setInventoryAdjustments] = useState<InventoryAdjustmentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY_ADJUSTMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return deepSanitize(parsed);
      }
    } catch {}
    return [];
  });

  const [collaboratorInventoryEnabled, setCollaboratorInventoryEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLLABORATOR_INVENTORY_ENABLED);
      if (saved !== null) return saved === 'true';
    } catch {}
    return false;
  });

  const [shelfInventoryStates, setShelfInventoryStates] = useState<Record<string, ShelfInventoryState>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHELF_INVENTORY_STATES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const saveInventoryAdjustmentsList = (list: InventoryAdjustmentRecord[]) => {
    const sanitized = deepSanitize(list);
    setInventoryAdjustments(sanitized);
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY_ADJUSTMENTS, JSON.stringify(sanitized));
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', inventoryAdjustments: sanitized });
    } catch {}
    try {
      fetch('/api/inventory-adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustments: sanitized }),
      }).catch(() => {});
    } catch {}
  };

  const toggleCollaboratorInventoryEnabled = (enabled?: boolean) => {
    const nextState = enabled !== undefined ? enabled : !collaboratorInventoryEnabled;
    setCollaboratorInventoryEnabled(nextState);
    try {
      localStorage.setItem(STORAGE_KEYS.COLLABORATOR_INVENTORY_ENABLED, String(nextState));
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', collaboratorInventoryEnabled: nextState });
    } catch {}
    try {
      fetch('/api/inventory-adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collaboratorInventoryEnabled: nextState }),
      }).catch(() => {});
    } catch {}
  };

  const updateShelfInventoryStatus = (shelfName: string, status: ShelfInventoryStatus, verifiedCount?: number) => {
    setShelfInventoryStates((prev) => {
      const current = prev[shelfName] || {
        shelfName,
        status: 'pending',
        itemsCount: 0,
        itemsVerified: 0,
      };
      const next: Record<string, ShelfInventoryState> = {
        ...prev,
        [shelfName]: {
          ...current,
          status,
          lastCountedAt: new Date().toISOString(),
          lastCountedBy: currentUser?.name || 'Administración ByFio',
          itemsVerified: verifiedCount !== undefined ? verifiedCount : current.itemsVerified,
        },
      };
      try {
        localStorage.setItem(STORAGE_KEYS.SHELF_INVENTORY_STATES, JSON.stringify(next));
        syncChannel?.postMessage({ type: 'SYNC_UPDATE', shelfInventoryStates: next });
        fetch('/api/inventory-adjustments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shelfStates: next }),
        }).catch(() => {});
      } catch {}
      return next;
    });
  };

  const resetShelvesInventoryStatus = () => {
    setShelfInventoryStates({});
    try {
      localStorage.removeItem(STORAGE_KEYS.SHELF_INVENTORY_STATES);
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', shelfInventoryStates: {} });
      fetch('/api/inventory-adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shelfStates: {} }),
      }).catch(() => {});
    } catch {}
  };

  const addInventoryAdjustment = async (
    adjData: Omit<InventoryAdjustmentRecord, 'id' | 'createdAt' | 'dateFormatted' | 'timeFormatted'>
  ): Promise<InventoryAdjustmentRecord> => {
    const now = new Date();
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dateFormatted = `${dayNames[now.getDay()]}, ${now.getDate()} de ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    const timeFormatted = now.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newRecord: InventoryAdjustmentRecord = {
      ...adjData,
      id: `ADJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: now.toISOString(),
      dateFormatted,
      timeFormatted,
      performedBy: adjData.performedBy || currentUser?.name || 'ADMINISTRACIÓN (FIO)',
    };

    // Actualizar el stock de cada producto en el sistema (local + D1 batch)
    const stockUpdates: { id: string; stock: number; isAvailable?: boolean }[] = [];
    adjData.items.forEach((item) => {
      if (item.productId) {
        updateProductStock(item.productId, item.countedStock);
        stockUpdates.push({
          id: item.productId,
          stock: item.countedStock,
          isAvailable: item.countedStock > 0,
        });
      }
    });

    if (stockUpdates.length > 0) {
      try {
        fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stockUpdates),
        }).catch(() => {});
      } catch {}
    }

    const nextAdjustments = [newRecord, ...inventoryAdjustments];
    saveInventoryAdjustmentsList(nextAdjustments);
    return newRecord;
  };

  const deleteInventoryAdjustment = (id: string) => {
    const updated = inventoryAdjustments.filter((item) => item.id !== id);
    saveInventoryAdjustmentsList(updated);
  };

  // =========================================================================
  // SISTEMA DE INVENTARIO POR BARRIDO (LOTES DE 10 AUTO/MANUAL Y HISTORIAL)
  // =========================================================================
  const [sweepEntries, setSweepEntries] = useState<InventorySweepEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SWEEP_ENTRIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return deepSanitize(parsed);
      }
    } catch {}
    return [];
  });

  const [sweepLoadMode, setSweepLoadModeState] = useState<SweepLoadMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SWEEP_LOAD_MODE);
      if (saved === 'manual' || saved === 'auto') return saved;
    } catch {}
    return 'auto';
  });

  const sweepEntriesRef = useRef<InventorySweepEntry[]>(sweepEntries);
  sweepEntriesRef.current = sweepEntries;
  const sweepLoadModeRef = useRef<SweepLoadMode>(sweepLoadMode);
  sweepLoadModeRef.current = sweepLoadMode;

  const saveSweepEntriesList = (list: InventorySweepEntry[]) => {
    const sanitized = deepSanitize(list);
    sweepEntriesRef.current = sanitized;
    setSweepEntries(sanitized);
    try {
      localStorage.setItem(STORAGE_KEYS.SWEEP_ENTRIES, JSON.stringify(sanitized));
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', sweepEntries: sanitized });
    } catch {}
    try {
      fetch('/api/inventory-adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sweepEntries: sanitized }),
      }).catch(() => {});
    } catch {}
  };

  const applySweepStockDeltas = (deltas: Record<string, number>) => {
    const hasChanges = Object.values(deltas).some((d) => d !== 0);
    if (!hasChanges) return;

    const stockUpdates: { id: string; stock: number; isAvailable?: boolean }[] = [];
    let nextSnapshot: Product[] = [];

    setProducts((prev) => {
      nextSnapshot = prev.map((p) => {
        const delta = deltas[p.id];
        if (!delta) return p;
        lastLocalProductUpdateRef.current.set(p.id, Date.now());
        const nextStock = Math.max(0, Number(p.stock || 0) + delta);
        const avail = nextStock > 0;
        stockUpdates.push({ id: p.id, stock: nextStock, isAvailable: avail });
        return {
          ...p,
          stock: nextStock,
          isAvailable: avail,
          showInStore: avail,
          showInCatalog: avail,
        };
      });
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(nextSnapshot));
      } catch {}
      return nextSnapshot;
    });

    setTimeout(() => {
      if (stockUpdates.length > 0) {
        fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stockUpdates),
        }).catch(() => {});
      }
      try {
        syncChannel?.postMessage({ type: 'SYNC_UPDATE', products: nextSnapshot });
      } catch {}
    }, 250);
  };

  const loadSweepEntriesToInventory = async (entryIds?: string[]): Promise<number> => {
    const currentList = sweepEntriesRef.current;
    const idSet = entryIds ? new Set(entryIds) : null;
    const pendingToLoad = currentList.filter(
      (e) => e.status === 'guardado' && (!idSet || idSet.has(e.id))
    );
    if (pendingToLoad.length === 0) return 0;

    const deltas: Record<string, number> = {};
    const loadedIdSet = new Set<string>();
    pendingToLoad.forEach((e) => {
      loadedIdSet.add(e.id);
      deltas[e.productId] = (deltas[e.productId] || 0) + Number(e.quantityAdded || 0);
    });

    applySweepStockDeltas(deltas);

    const nowIso = new Date().toISOString();
    const updatedList: InventorySweepEntry[] = currentList.map((e) =>
      loadedIdSet.has(e.id) ? { ...e, status: 'cargado_inv', loadedAt: nowIso } : e
    );
    saveSweepEntriesList(updatedList);
    return pendingToLoad.length;
  };

  const setSweepLoadMode = (mode: SweepLoadMode) => {
    sweepLoadModeRef.current = mode;
    setSweepLoadModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEYS.SWEEP_LOAD_MODE, mode);
      syncChannel?.postMessage({ type: 'SYNC_UPDATE', sweepLoadMode: mode });
    } catch {}
    try {
      fetch('/api/inventory-adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sweepLoadMode: mode }),
      }).catch(() => {});
    } catch {}
    if (mode === 'auto') {
      const pending = sweepEntriesRef.current.filter((e) => e.status === 'guardado');
      if (pending.length >= 10) {
        loadSweepEntriesToInventory(pending.map((e) => e.id));
      }
    }
  };

  const registerSweepEntry = (
    entryData: Omit<InventorySweepEntry, 'id' | 'createdAt' | 'status' | 'userId' | 'userName'>
  ): { entry: InventorySweepEntry; autoLoadedCount: number } => {
    const nowIso = new Date().toISOString();
    const newEntry: InventorySweepEntry = {
      ...entryData,
      id: `SWP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: nowIso,
      status: 'guardado',
      userId: currentUser?.id || 'admin-fio',
      userName: currentUser?.name || 'ADMINISTRACIÓN (FIO)',
    };

    const nextList: InventorySweepEntry[] = [newEntry, ...sweepEntriesRef.current];
    const pendingList = nextList.filter((e) => e.status === 'guardado');

    if (sweepLoadModeRef.current === 'auto' && pendingList.length >= 10) {
      const deltas: Record<string, number> = {};
      const loadedIdSet = new Set<string>();
      pendingList.forEach((e) => {
        loadedIdSet.add(e.id);
        deltas[e.productId] = (deltas[e.productId] || 0) + Number(e.quantityAdded || 0);
      });
      applySweepStockDeltas(deltas);

      const loadedList: InventorySweepEntry[] = nextList.map((e) =>
        loadedIdSet.has(e.id) ? { ...e, status: 'cargado_inv', loadedAt: nowIso } : e
      );
      saveSweepEntriesList(loadedList);
      return {
        entry: { ...newEntry, status: 'cargado_inv', loadedAt: nowIso },
        autoLoadedCount: pendingList.length,
      };
    }

    saveSweepEntriesList(nextList);
    return { entry: newEntry, autoLoadedCount: 0 };
  };

  const updateSweepEntryStatus = (entryId: string, nextStatus: SweepEntryStatus) => {
    const currentList = sweepEntriesRef.current;
    const target = currentList.find((e) => e.id === entryId);
    if (!target || target.status === nextStatus) return;

    const delta =
      target.status === 'guardado' && nextStatus === 'cargado_inv'
        ? Number(target.quantityAdded || 0)
        : target.status === 'cargado_inv' && nextStatus === 'guardado'
        ? -Number(target.quantityAdded || 0)
        : 0;

    if (delta !== 0) {
      applySweepStockDeltas({ [target.productId]: delta });
    }

    const nowIso = new Date().toISOString();
    const updatedList: InventorySweepEntry[] = currentList.map((e) =>
      e.id === entryId
        ? {
            ...e,
            status: nextStatus,
            loadedAt: nextStatus === 'cargado_inv' ? nowIso : undefined,
          }
        : e
    );
    saveSweepEntriesList(updatedList);
  };

  const deleteSweepEntry = (entryId: string) => {
    const updated = sweepEntriesRef.current.filter((e) => e.id !== entryId);
    saveSweepEntriesList(updated);
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
    const firstLayItem = cart.find((i) => i.isLayaway);
    const isLayawayOrder = Boolean(firstLayItem);
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
      isDirectInvoice: true,
    };

    const updatedOrders = [newOrder, ...orders.filter((o) => o.id !== newOrder.id)].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(updatedOrders);
    safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, serializeOrdersForStorage(updatedOrders));
    knownOrderIdsRef.current.add(newOrder.id);
    // Nota: Facturación Rápida POS y Factura Directa no disparan alerta visual ni sonido chime;
    // son ventas presenciales en mostrador que se liquidan al instante.

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
        if (Array.isArray(data?.workshopUpdates) && data.workshopUpdates.length > 0) {
          applyCloudWorkshopUpdates(data.workshopUpdates);
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
          const isZero = newStock <= 0;
          batchUpdates.push({ id: prod.id, stock: newStock, ...(isZero ? { isAvailable: false } : {}) });
          return {
            ...prod,
            stock: newStock,
            ...(isZero ? { isAvailable: false, showInStore: false, showInCatalog: false } : {}),
          };
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

  // -------------------------------------------------------------
  // ESTADO Y MÉTODOS DE SUPERADMINISTRADOR (GESTIÓN MODULAR GLOBAL)
  // -------------------------------------------------------------
  const mergeSuperadminModules = (loaded: any[]): SuperadminModuleConfig[] => {
    if (!Array.isArray(loaded) || loaded.length === 0) return INITIAL_SUPERADMIN_MODULES;
    return INITIAL_SUPERADMIN_MODULES.map((initialMod) => {
      const found = loaded.find((p) => p.id === initialMod.id);
      if (!found) return initialMod;
      return {
        ...initialMod,
        enabled: typeof found.enabled === 'boolean' ? found.enabled : initialMod.enabled,
        features: initialMod.features.map((feat) => {
          const foundFeat = found.features?.find((f: any) => f.id === feat.id);
          return foundFeat && typeof foundFeat.enabled === 'boolean'
            ? { ...feat, enabled: foundFeat.enabled }
            : feat;
        }),
      };
    });
  };

  const [superadminModules, setSuperadminModules] = useState<SuperadminModuleConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPERADMIN_MODULES);
      if (saved) {
        const parsed: SuperadminModuleConfig[] = JSON.parse(saved);
        return mergeSuperadminModules(parsed);
      }
    } catch {}
    return INITIAL_SUPERADMIN_MODULES;
  });

  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SUPERADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const saveSuperadminModules = (newModules: SuperadminModuleConfig[]) => {
    setSuperadminModules(newModules);
    try {
      localStorage.setItem(STORAGE_KEYS.SUPERADMIN_MODULES, JSON.stringify(newModules));
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        superadminModules: newModules,
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('byfio_superadmin_modules_updated', { detail: newModules })
        );
      }
    } catch {}

    // Sincronización en la nube D1 para que se propague a todos los dispositivos en vivo
    try {
      fetch('/api/superadmin-modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modules: newModules }),
      }).catch(() => {});
    } catch {}
  };

  const toggleSuperadminModule = (moduleId: string, enabled?: boolean) => {
    const updated = superadminModules.map((m) => {
      if (m.id === moduleId) {
        const nextState = enabled !== undefined ? enabled : !m.enabled;
        return { ...m, enabled: nextState };
      }
      return m;
    });
    saveSuperadminModules(updated);
  };

  const toggleSuperadminFeature = (moduleId: string, featureId: string, enabled?: boolean) => {
    let nextFeatureState = false;
    const updated = superadminModules.map((m) => {
      if (m.id === moduleId) {
        return {
          ...m,
          features: m.features.map((f) => {
            if (f.id === featureId) {
              const nextState = enabled !== undefined ? enabled : !f.enabled;
              nextFeatureState = nextState;
              return { ...f, enabled: nextState };
            }
            return f;
          }),
        };
      }
      return m;
    });
    saveSuperadminModules(updated);

    // Sincronización instantánea del modo de inventario (Stock vs Disponibilidad Rápida)
    if (moduleId === 'inventory') {
      if (featureId === 'product_availability_mode') {
        const targetMode = nextFeatureState ? 'availability' : 'stock';
        setInventoryModeState(targetMode);
        localStorage.setItem(STORAGE_KEYS.INVENTORY_MODE, targetMode);
      } else if (featureId === 'inventory_stock_mode') {
        const targetMode = nextFeatureState ? 'stock' : 'availability';
        setInventoryModeState(targetMode);
        localStorage.setItem(STORAGE_KEYS.INVENTORY_MODE, targetMode);
      }
    }
  };

  const deactivateSuperadminModuleComplete = (moduleId: string) => {
    const updated = superadminModules.map((m) => {
      if (m.id === moduleId) {
        return {
          ...m,
          enabled: false,
          features: m.features.map((f) => ({ ...f, enabled: false })),
        };
      }
      return m;
    });
    saveSuperadminModules(updated);
  };

  const activateSuperadminModuleComplete = (moduleId: string) => {
    const updated = superadminModules.map((m) => {
      if (m.id === moduleId) {
        return {
          ...m,
          enabled: true,
          features: m.features.map((f) => ({ ...f, enabled: true })),
        };
      }
      return m;
    });
    saveSuperadminModules(updated);
  };

  const resetSuperadminModules = () => {
    saveSuperadminModules(INITIAL_SUPERADMIN_MODULES);
  };

  const setAllSuperadminModules = (enabled: boolean) => {
    const updated = superadminModules.map((m) => ({
      ...m,
      enabled,
      features: m.features.map((f) => ({ ...f, enabled })),
    }));
    saveSuperadminModules(updated);
  };

  const normalizeModuleId = (id: string): string => {
    const clean = String(id || '').trim().toLowerCase();
    if (clean === 'pedidos' || clean === 'orders') return 'orders';
    if (clean === 'facturacion' || clean === 'billing') return 'billing';
    if (clean === 'inventario' || clean === 'inventory') return 'inventory';
    if (clean === 'faltantes' || clean === 'missing_inventory' || clean === 'missing-inventory') return 'missing_inventory';
    if (clean === 'caja' || clean === 'reportes' || clean === 'reports') return 'reports';
    if (clean === 'sinpe') return 'sinpe';
    if (clean === 'talleres' || clean === 'workshops') return 'workshops';
    if (clean === 'precios' || clean === 'stickers' || clean === 'pricing') return 'pricing';
    if (clean === 'usuarios' || clean === 'perfiles' || clean === 'users') return 'users';
    if (clean === 'metricas') return 'metricas';
    if (clean === 'catalogo' || clean === 'catalog-view' || clean === 'catalog_view') return 'catalogo';
    if (clean === 'tienda' || clean === 'store') return 'store';
    return clean;
  };

  const isModuleEnabled = (moduleIdOrAlias: string): boolean => {
    if (moduleIdOrAlias === 'hub') return true;
    const normalized = normalizeModuleId(moduleIdOrAlias);
    const mod = superadminModules.find((m) => m.id === normalized);
    return mod ? mod.enabled : true;
  };

  const isFeatureEnabled = (moduleId: string, featureId: string): boolean => {
    const normalized = normalizeModuleId(moduleId);
    const mod = superadminModules.find((m) => m.id === normalized);
    if (!mod) return true;
    if (!mod.enabled) return false;
    if (!Array.isArray(mod.features)) return true;
    const feat = mod.features.find((f) => f.id === featureId);
    if (!feat) return true;
    return feat.enabled;
  };

  const loginSuperAdmin = (user: string, pass: string) => {
    const trimmedUser = user.trim().toLowerCase();
    const trimmedPass = pass.trim();

    const validUsers = [
      'superadmin@byfio.com',
      'superadmin@byfiocr.com',
      'superadmin',
      'super admin',
      'super',
      'admin@byfio.com',
      'admin',
      'fio@byfiocr.com',
      'fio@byfio.com',
      'fio',
    ];

    const validPasswords = [
      'SuperAdmin2026!',
      'superadmin2026!',
      'Superadmin2026!',
      'SuperAdmin2026',
      'superadmin2026',
      'Superadmin2026',
      'superadmin',
      'admin2026',
      'admin',
      'fio777',
      'Fio777',
    ];

    const isMatchUser = validUsers.includes(trimmedUser);
    const isMatchPass = validPasswords.some(
      (p) => p === trimmedPass || p.toLowerCase() === trimmedPass.toLowerCase()
    );

    if (isMatchUser && isMatchPass) {
      const superAdminUser: AuthUser = {
        email: 'superadmin@byfio.com',
        name: 'SUPERADMIN MAESTRO',
        role: 'admin',
        isMasterAdmin: true,
        permissions: {
          orders: true,
          billing: true,
          inventory: true,
          reports: true,
          workshops: true,
          pricing: true,
          users: true,
        },
      };
      setCurrentUser(superAdminUser);
      setIsSuperAdminAuthenticated(true);
      writeScopedAuthUser(appScope, superAdminUser);
      if (appScope !== 'admin') writeScopedAuthUser('admin', superAdminUser);
      try {
        localStorage.setItem(SUPERADMIN_AUTH_KEY, 'true');
      } catch {}
      return { success: true };
    }
    return {
      success: false,
      error: 'Usuario o contraseña incorrectos. Usuario: superadmin@byfio.com (o superadmin) | Clave: SuperAdmin2026!',
    };
  };

  const logoutSuperAdmin = () => {
    setIsSuperAdminAuthenticated(false);
    try {
      localStorage.removeItem(SUPERADMIN_AUTH_KEY);
    } catch {}
  };

  const [welcomeStarModal, setWelcomeStarModal] = useState<{ isOpen: boolean; userName: string; email: string } | null>(null);
  const [isMyAccountOpen, setIsMyAccountOpen] = useState(false);

  const triggerWelcomeStarModal = (userName: string, email: string) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const key = 'byfio_welcome_star_' + cleanEmail;
    if (!localStorage.getItem(key)) {
      setWelcomeStarModal({ isOpen: true, userName, email: cleanEmail });
    }
  };

  const closeWelcomeStarModal = () => {
    if (welcomeStarModal?.email) {
      const cleanEmail = welcomeStarModal.email.toLowerCase();
      try {
        localStorage.setItem('byfio_welcome_star_' + cleanEmail, 'true');
        const registered = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
        const idx = registered.findIndex((u: any) => u.email && u.email.toLowerCase() === cleanEmail);
        if (idx !== -1) {
          registered[idx].welcomeShown = true;
          localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered));
        }
      } catch {}
    }
    setWelcomeStarModal(null);
  };

  const readSavedAdminContact = (key: string): { email?: string; phone?: string } => {
    try {
      const all = JSON.parse(localStorage.getItem('byfio_admin_contact_v1') || '{}');
      return all?.[key] || {};
    } catch {
      return {};
    }
  };

  const buildProfileAuthUser = (profile: UserProfile): AuthUser => {
    const isAdmin = profile.role === 'admin';
    const saved = isAdmin ? readSavedAdminContact(profile.id || 'prof-admin') : {};
    return {
      id: profile.id,
      name: profile.name.toUpperCase(),
      role: profile.role,
      permissions: {
        ...profile.permissions,
        suppliers: profile.permissions?.suppliers !== false,
      },
      isMasterAdmin: isAdmin,
      createdAt: profile.createdAt || '2026-10-30T10:00:00-06:00',
      ...(isAdmin ? { email: saved.email || 'fio@byfiocr.com', phone: saved.phone || '6400-4640' } : {}),
    };
  };

  const buildSuperAdminUser = (permissions: UserPermissions): AuthUser => {
    const saved = readSavedAdminContact('superadmin');
    return {
      email: saved.email || 'superadmin@byfio.com',
      phone: saved.phone || '6400-4640',
      name: 'SUPERADMIN MAESTRO',
      role: 'admin',
      isMasterAdmin: true,
      createdAt: '2026-10-30T10:00:00-06:00',
      permissions,
    };
  };

  const updateCurrentUserData = (updates: Partial<AuthUser>) => {
    if (!currentUser) return;
    const updated: AuthUser = {
      ...currentUser,
      ...updates,
    };
    setCurrentUser(updated);
    writeScopedAuthUser(appScope, updated);
    if (updated.role === 'admin') {
      try {
        const key = updated.id || (updated.name?.toUpperCase().includes('SUPER') ? 'superadmin' : 'admin');
        const prev = JSON.parse(localStorage.getItem('byfio_admin_contact_v1') || '{}');
        prev[key] = { email: updated.email || '', phone: updated.phone || '' };
        localStorage.setItem('byfio_admin_contact_v1', JSON.stringify(prev));
      } catch {}
    }
    if (updated.email) {
      try {
        const cleanEmail = updated.email.trim().toLowerCase();
        const registered = JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
        const idx = registered.findIndex((u: any) => u.email && u.email.trim().toLowerCase() === cleanEmail);
        if (idx !== -1) {
          registered[idx] = {
            ...registered[idx],
            ...updates,
            name: updated.name,
            phone: updated.phone ?? registered[idx].phone,
            idCard: updated.idCard ?? registered[idx].idCard,
            address: updated.address ?? registered[idx].address,
            lat: updated.lat ?? registered[idx].lat,
            lng: updated.lng ?? registered[idx].lng,
          };
          safeLocalStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered));
          fetch('/api/registered-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: registered[idx] }),
          }).catch(() => {});
        }
        if (updated.role !== 'admin' && !RESERVED_WEB_EMAILS.has(cleanEmail)) {
          setCustomers((prev) => {
            const regId = `reg-${cleanEmail}`;
            const existingIdx = prev.findIndex(
              (c) => c.id === regId || (c.email && c.email.trim().toLowerCase() === cleanEmail)
            );
            let nextList: Customer[];
            if (existingIdx !== -1) {
              nextList = prev.map((c, i) => {
                if (i !== existingIdx) return c;
                const nextCedula = updated.idCard ?? c.customFields?.['field-cedula'];
                return {
                  ...c,
                  name: updated.name || c.name,
                  phone: updated.phone ?? c.phone,
                  address: updated.address ?? c.address,
                  customFields: nextCedula ? { ...(c.customFields || {}), 'field-cedula': nextCedula } : c.customFields,
                };
              });
            } else {
              nextList = [
                ...prev,
                {
                  id: regId,
                  name: updated.name || cleanEmail.split('@')[0],
                  phone: updated.phone || '',
                  email: cleanEmail,
                  address: updated.address || undefined,
                  notes: 'Cliente registrado en la página web',
                  createdAt: updated.createdAt || new Date().toISOString(),
                  customFields: updated.idCard ? { 'field-cedula': updated.idCard } : undefined,
                },
              ];
            }
            try {
              localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(nextList));
            } catch {}
            syncChannel?.postMessage({ type: 'SYNC_UPDATE', customers: nextList });
            return nextList;
          });
        }
      } catch {}
    }
  };

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const parsed = readScopedAuthUser(appScope);
      if (parsed && typeof parsed === 'object') {
        if (parsed.email && parsed.role === 'customer') {
          const emailLower = parsed.email.toLowerCase();
          try {
            const regList = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
            const matched = regList.find((u: any) => u.email && u.email.toLowerCase() === emailLower);
            if (matched) {
              return {
                ...parsed,
                address: matched.address ?? parsed.address ?? '',
                lat: matched.lat ?? parsed.lat,
                lng: matched.lng ?? parsed.lng,
                createdAt: matched.createdAt ?? parsed.createdAt,
                welcomeShown: matched.welcomeShown ?? parsed.welcomeShown,
                phone: matched.phone ?? parsed.phone,
                name: matched.name ?? parsed.name,
              };
            }
          } catch {}
        }
        return {
          ...parsed,
          permissions: parsed.permissions
            ? ({ suppliers: true, ...parsed.permissions } as UserPermissions)
            : undefined,
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const setAppScope = useCallback((nextScope: AppScope) => {
    if (appScopeRef.current === nextScope) return;
    appScopeRef.current = nextScope;
    setAppScopeState(nextScope);
    setCurrentUser(readScopedAuthUser(nextScope));
    setViewMode(nextScope === 'admin' ? 'admin' : 'store');
  }, []);

  const hasPermission = (tab: string) => {
    // Si el módulo está desactivado globalmente por el Superadmin, se oculta para todos en el panel
    if (!isModuleEnabled(tab)) return false;
    if (!currentUser) return false;
    if (currentUser.role === 'admin' || currentUser.isMasterAdmin) return true;
    if (tab === 'hub') return true;

    // Sincronización dinámica instantánea con el perfil activo en userProfiles
    const matchingProfile = userProfiles.find(
      (p) => (p.id && currentUser.id && p.id === currentUser.id) || Boolean(p.name && currentUser?.name && p.name.toUpperCase() === currentUser.name.toUpperCase())
    );
    if (matchingProfile) {
      if (!matchingProfile.isActive) return false;
      const livePerms = matchingProfile.permissions as unknown as Record<string, boolean | undefined> | undefined;
      if (tab === 'sinpe') {
        return Boolean(livePerms?.sinpe ?? livePerms?.reports);
      }
      if (tab === 'catalog-view') {
        return isModuleEnabled('catalogo');
      }
      if (tab === 'layaways') {
        return Boolean(livePerms?.layaways ?? livePerms?.orders ?? true);
      }
      if (tab === 'suppliers' || tab === 'sales') {
        if (currentUser.role === 'staff' && livePerms) {
          return livePerms[tab] !== false;
        }
        return true;
      }
      if (currentUser.role === 'staff' && livePerms) {
        return Boolean(livePerms[tab]);
      }
    }

    const perms = currentUser.permissions as Record<string, boolean | undefined> | undefined;
    if (tab === 'sinpe') {
      return Boolean(perms?.sinpe ?? perms?.reports);
    }
    if (tab === 'suppliers' || tab === 'sales') {
      if (currentUser.role === 'staff' && perms) {
        return perms[tab] !== false;
      }
      return true;
    }
    if (currentUser.role === 'staff' && perms) {
      return Boolean(perms[tab]);
    }
    return false;
  };

  const canReceiveOrderNotifications = (isWorkshop?: boolean, isLayaway?: boolean) => {
    if (isSuperAdminAuthenticated) return true;
    if (
      typeof window !== 'undefined' &&
      (window.location.pathname.includes('/pedidos') ||
       window.location.hash.includes('pedidos') ||
       window.location.pathname.includes('/apartados') ||
       window.location.hash.includes('apartados'))
    ) {
      return true;
    }
    if (!currentUser) return false;
    if (currentUser.role === 'admin' || currentUser.isMasterAdmin) return true;
    return hasPermission(isWorkshop ? 'workshops' : 'orders') || (Boolean(isLayaway) && hasPermission('layaways'));
  };

  const showNewOrderAlert = (info?: NewOrderAlertInfo) => {
    // Control estricto de visibilidad:
    // NUNCA disparar la alerta ni mostrar la estrellita si no hay usuario logueado con permiso adecuado.
    if (!canReceiveOrderNotifications(info?.isWorkshop, info?.isLayaway)) {
      return;
    }
    setNewOrderAlert(info || {});
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
      customers: true,
      agenda: true,
      suppliers: true,
      sales: true,
    };

    // 1. Si se especificó un perfil concreto en la pantalla de selección
    if (targetProfileName) {
      if (targetProfileName.toUpperCase().includes('SUPER') && (cleanPin === '7777' || cleanPin === '9999' || cleanPin === '0777')) {
        const superAdminUser = buildSuperAdminUser(fullPermissions);
        setCurrentUser(superAdminUser);
        setIsSuperAdminAuthenticated(true);
        writeScopedAuthUser(appScope, superAdminUser);
        if (appScope !== 'admin') writeScopedAuthUser('admin', superAdminUser);
        try {
          localStorage.setItem(SUPERADMIN_AUTH_KEY, 'true');
        } catch {}
        return { success: true, user: superAdminUser };
      }

      const expected = userProfiles.find(
        (p) => p.isActive && p.name.toUpperCase() === targetProfileName.trim().toUpperCase()
      );
      if (expected) {
        if (expected.pin !== cleanPin && cleanPin !== '7777' && cleanPin !== '9999') {
          return { success: false, error: 'Código PIN incorrecto para este perfil.' };
        }
        const userObj = buildProfileAuthUser(expected);
        setCurrentUser(userObj);
        writeScopedAuthUser(appScope, userObj);
        if (userObj.role === 'admin') writeScopedAuthUser('admin', userObj);
        if (userObj.role === 'staff') writeScopedAuthUser('collaborator', userObj);
        return { success: true, user: userObj };
      }
    }

    // 2. Si no se especificó perfil, buscar primero entre los perfiles creados por su PIN exacto
    const matchedProfile = userProfiles.find((p) => p.isActive && p.pin === cleanPin);
    if (matchedProfile) {
      const userObj = buildProfileAuthUser(matchedProfile);
      setCurrentUser(userObj);
      writeScopedAuthUser(appScope, userObj);
      if (userObj.role === 'admin') writeScopedAuthUser('admin', userObj);
      if (userObj.role === 'staff') writeScopedAuthUser('collaborator', userObj);
      return { success: true, user: userObj };
    }

    // 3. Códigos maestros globales de Superadmin (7777, 0777, 9999)
    if (cleanPin === '7777' || cleanPin === '0777' || cleanPin === '9999') {
      const superAdminUser = buildSuperAdminUser(fullPermissions);
      setCurrentUser(superAdminUser);
      setIsSuperAdminAuthenticated(true);
      writeScopedAuthUser(appScope, superAdminUser);
      if (appScope !== 'admin') writeScopedAuthUser('admin', superAdminUser);
      try {
        localStorage.setItem(SUPERADMIN_AUTH_KEY, 'true');
      } catch {}
      return { success: true, user: superAdminUser };
    }

    return { success: false, error: 'Código PIN incorrecto o no asignado a ningún perfil de usuario activo.' };
  };

  const loginUser = (emailInput: string, passwordInput: string) => {
    const cleanEmail = emailInput.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
    const cleanEmailLower = cleanEmail.toLowerCase();
    const cleanPass = passwordInput.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');

    const fullPermissions: UserPermissions = {
      orders: true,
      billing: true,
      inventory: true,
      reports: true,
      workshops: true,
      pricing: true,
      users: true,
      customers: true,
      agenda: true,
      suppliers: true,
      sales: true,
    };

    // 0. Cuenta Superadmin Global (superadmin@byfio.com / SuperAdmin2026!)
    const isSuperUser =
      cleanEmailLower === 'superadmin@byfio.com' ||
      cleanEmailLower === 'superadmin@byfiocr.com' ||
      cleanEmailLower === 'superadmin' ||
      cleanEmailLower === 'super admin' ||
      cleanEmailLower === 'super';

    const isSuperPass =
      cleanPass === 'SuperAdmin2026!' ||
      cleanPass.toLowerCase() === 'superadmin2026!' ||
      cleanPass === 'SuperAdmin2026' ||
      cleanPass.toLowerCase() === 'superadmin2026' ||
      cleanPass.toLowerCase() === 'superadmin' ||
      cleanPass.toLowerCase() === 'fio777';

    if (isSuperUser && isSuperPass) {
      const superAdminUser = buildSuperAdminUser(fullPermissions);
      setCurrentUser(superAdminUser);
      setIsSuperAdminAuthenticated(true);
      writeScopedAuthUser(appScope, superAdminUser);
      if (appScope !== 'admin') writeScopedAuthUser('admin', superAdminUser);
      try {
        localStorage.setItem(SUPERADMIN_AUTH_KEY, 'true');
      } catch {}
      return { success: true, user: superAdminUser };
    }

    // 1. Cuenta Maestra Oficial: fio@byfiocr.com / Fio777 (insensible a mayúsculas)
    if (
      (cleanEmailLower === 'fio@byfiocr.com' || cleanEmailLower === 'fio' || cleanEmailLower === 'fio@byfio.com') &&
      cleanPass.toLowerCase() === 'fio777'
    ) {
      const savedAdmin = readSavedAdminContact('admin');
      const adminUser: AuthUser = {
        email: savedAdmin.email || 'fio@byfiocr.com',
        phone: savedAdmin.phone || '6400-4640',
        name: 'Fiorella (Fio)',
        role: 'admin',
        isMasterAdmin: true,
        createdAt: '2026-10-30T10:00:00-06:00',
        permissions: fullPermissions,
      };
      setCurrentUser(adminUser);
      writeScopedAuthUser(appScope, adminUser);
      if (appScope !== 'admin') writeScopedAuthUser('admin', adminUser);
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
        createdAt: profileMatch.createdAt || '2026-10-30T10:00:00-06:00',
      };
      setCurrentUser(staffUser);
      writeScopedAuthUser(appScope, staffUser);
      if (appScope !== 'collaborator') writeScopedAuthUser('collaborator', staffUser);
      return { success: true, user: staffUser };
    }

    // 4. Cuentas de clientes registradas (localStorage y Cloudflare D1)
    try {
      const registered = JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
      const found = registered.find((u: any) => {
        if (!u || !u.email) return false;
        const uEmail = String(u.email).trim().toLowerCase();
        const uPass = String(u.password || '').trim();
        return uEmail === cleanEmailLower && uPass === cleanPass;
      });
      if (found) {
        const normalUser: AuthUser = {
          email: found.email,
          name: found.name || found.email.split('@')[0],
          phone: found.phone || '',
          idCard: found.idCard || '',
          role: 'customer',
          address: found.address || '',
          lat: found.lat,
          lng: found.lng,
          createdAt: found.createdAt || new Date().toISOString(),
          welcomeShown: Boolean(found.welcomeShown),
        };
        setCurrentUser(normalUser);
        writeScopedAuthUser('web', normalUser);
        if (appScope !== 'web') writeScopedAuthUser(appScope, normalUser);
        syncWebUsersToCustomers([found]);
        const welcomeKey = 'byfio_welcome_star_' + found.email.toLowerCase();
        if (!found.welcomeShown && !safeLocalStorage.getItem(welcomeKey)) {
          setWelcomeStarModal({
            isOpen: true,
            userName: normalUser.name,
            email: normalUser.email || '',
          });
        }
        return { success: true, user: normalUser };
      }
    } catch {}

    return { success: false, error: 'Credenciales incorrectas. Verifica tu correo, contraseña o PIN de 4 dígitos.' };
  };

  const registerUser = (
    emailInput: string,
    passwordInput: string,
    nameInput?: string,
    phoneInput?: string,
    idCardInput?: string,
    addressInput?: string,
    latInput?: number,
    lngInput?: number,
    options?: { skipWelcomeModal?: boolean; province?: string; deviceType?: 'pc' | 'mobile' | 'tablet'; deviceModel?: string }
  ) => {
    const cleanEmail = emailInput.trim().toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
    const cleanPass = passwordInput.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Por favor completa todos los campos requeridos.' };
    }
    if (cleanEmail === 'fio@byfiocr.com' || cleanEmail === 'fio' || cleanEmail === 'superadmin@byfio.com') {
      return { success: false, error: 'Este correo está reservado para la administración.' };
    }
    try {
      const registered = JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
      if (registered.some((u: any) => u && u.email && String(u.email).trim().toLowerCase() === cleanEmail)) {
        return { success: false, error: 'Ya existe una cuenta con este correo electrónico.' };
      }
      const clientDevice = getClientDeviceInfo();
      const record = {
        email: cleanEmail,
        password: cleanPass,
        name: nameInput?.trim() || cleanEmail.split('@')[0],
        phone: phoneInput?.trim() || '',
        idCard: idCardInput?.trim() || '',
        address: addressInput?.trim() || '',
        province: options?.province || '',
        deviceType: options?.deviceType || clientDevice.deviceType,
        deviceModel: options?.deviceModel || clientDevice.deviceModel,
        lat: typeof latInput === 'number' ? latInput : undefined,
        lng: typeof lngInput === 'number' ? lngInput : undefined,
        createdAt: new Date().toISOString(),
        welcomeShown: false,
      };
      registered.push(record);
      safeLocalStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered));
      syncWebUsersToCustomers([record]);

      // Sincronizar de inmediato con Cloudflare D1 y guardar IP devuelta
      fetch('/api/registered-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: record }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.users)) {
            safeLocalStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(data.users));
          }
        })
        .catch(() => {});

      const customer: AuthUser = {
        email: record.email,
        name: record.name,
        phone: record.phone,
        idCard: record.idCard,
        address: record.address,
        lat: record.lat,
        lng: record.lng,
        createdAt: record.createdAt,
        role: 'customer',
        welcomeShown: false,
      };
      setCurrentUser(customer);
      writeScopedAuthUser('web', customer);
      if (appScope !== 'web') writeScopedAuthUser(appScope, customer);
      if (!options?.skipWelcomeModal) {
        setWelcomeStarModal({
          isOpen: true,
          userName: customer.name,
          email: customer.email || '',
        });
      }
      return { success: true, user: customer };
    } catch {
      return { success: false, error: 'Error al registrar usuario.' };
    }
  };

  const resetPassword = (emailInput: string, newPasswordInput: string): { success: boolean; error?: string } => {
    const cleanEmail = emailInput.trim().toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
    const cleanPass = newPasswordInput.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Por favor ingresa tu correo y la nueva contraseña.' };
    }

    if (cleanPass.length < 6) {
      return { success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' };
    }

    if (cleanEmail === 'fio@byfiocr.com' || cleanEmail === 'superadmin@byfio.com') {
      return { success: false, error: 'Para credenciales administrativas, solicita acceso al Superadmin.' };
    }

    try {
      const registered = JSON.parse(safeLocalStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
      const userIndex = registered.findIndex((u: any) => u && u.email && String(u.email).trim().toLowerCase() === cleanEmail);

      if (userIndex === -1) {
        return { success: false, error: 'No encontramos ninguna cuenta registrada con este correo electrónico.' };
      }

      registered[userIndex].password = cleanPass;
      registered[userIndex].updatedAt = new Date().toISOString();
      safeLocalStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered));

      fetch('/api/registered-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: registered[userIndex] }),
      }).catch(() => {});

      return { success: true };
    } catch {
      return { success: false, error: 'Error al actualizar la contraseña.' };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsMyAccountOpen(false);
    setWelcomeStarModal(null);
    clearScopedAuthUser(appScope);
    setIsLogoutTransitionOpen(true);
  };

  // Sincronización inmediata online de la sesión del colaborador ante cambios en userProfiles
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'staff') return;
    const matchingProfile = userProfiles.find(
      (p) => (p.id && currentUser.id && p.id === currentUser.id) || Boolean(p.name && currentUser?.name && p.name.toUpperCase() === currentUser.name.toUpperCase())
    );

    // Si el perfil fue desactivado o eliminado por el administrador, expulsar inmediatamente
    if (!matchingProfile || !matchingProfile.isActive) {
      logoutUser();
      return;
    }

    // Si los permisos o datos fueron modificados, sincronizar currentUser en memoria y localStorage al instante
    const permsChanged = JSON.stringify(currentUser.permissions) !== JSON.stringify(matchingProfile.permissions);
    const nameChanged = currentUser.name !== matchingProfile.name;
    const roleChanged = currentUser.role !== matchingProfile.role;

    if (permsChanged || nameChanged || roleChanged) {
      const updatedUser: AuthUser = {
        ...currentUser,
        name: matchingProfile.name,
        role: matchingProfile.role,
        permissions: matchingProfile.permissions,
        isMasterAdmin: matchingProfile.role === 'admin',
        createdAt: matchingProfile.createdAt || currentUser.createdAt || '2026-10-30T10:00:00-06:00',
      };
      setCurrentUser(updatedUser);
      writeScopedAuthUser(appScope, updatedUser);
    }
  }, [userProfiles, currentUser]);

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
    lastLocalConfigUpdateRef.current.pricingData = Date.now();
    pushStoreConfig({ pricingData: newData });
    syncChannel?.postMessage({ type: 'SYNC_UPDATE', pricingData: newData });
  };

  const resetPricingData = () => {
    setPricingData(INITIAL_PRICING_DATA);
    localStorage.setItem(STORAGE_KEYS.PRICING_DATA, JSON.stringify(INITIAL_PRICING_DATA));
    lastLocalConfigUpdateRef.current.pricingData = Date.now();
    pushStoreConfig({ pricingData: INITIAL_PRICING_DATA });
    syncChannel?.postMessage({ type: 'SYNC_UPDATE', pricingData: INITIAL_PRICING_DATA });
  };

  // Apply typography theme to document body (strictly skip Collaborator PWA so Web/Admin themes never alter it)
  useEffect(() => {
    if (appScope === 'collaborator') {
      document.body.removeAttribute('data-font-theme');
      return;
    }
    document.body.setAttribute('data-font-theme', typographyTheme);
    localStorage.setItem(STORAGE_KEYS.TYPOGRAPHY_THEME, typographyTheme);
  }, [typographyTheme, appScope]);

  // Apply color theme to document body (strictly skip Collaborator PWA so Web/Admin dark mode never bleeds into Collaborator UI)
  useEffect(() => {
    if (appScope === 'collaborator') {
      document.body.removeAttribute('data-color-theme');
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      return;
    }
    document.body.setAttribute('data-color-theme', colorTheme);
    if (colorTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.COLOR_THEME, colorTheme);
  }, [colorTheme, appScope]);

  // Escucha del canal de difusión para sincronización en tiempo real (0ms) entre pestañas
  useEffect(() => {
    if (!syncChannel) return;
    const handleSync = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_UPDATE') {
        if (Array.isArray(event.data.orders)) {
          const cleanOrders = sanitizeOrderList(event.data.orders);
          setOrders((prev) => {
            const map = new Map<string, Order>();
            prev.forEach((o) => map.set(o.id, o));
            cleanOrders.forEach((o: Order) => map.set(o.id, o));
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          checkAndNotifyNewOrders(cleanOrders);
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
        if (Array.isArray(event.data.superadminModules)) {
          setSuperadminModules(mergeSuperadminModules(event.data.superadminModules));
        }
        if (Array.isArray(event.data.agendaItems)) {
          setAgendaItems(deduplicateAgendaItems(deepSanitize(event.data.agendaItems)));
        }
        if (Array.isArray(event.data.supplierOrders)) {
          setSupplierOrders(deepSanitize(event.data.supplierOrders));
        }
        if (Array.isArray(event.data.dailyClosings)) {
          setDailyClosings(deepSanitize(event.data.dailyClosings));
        }
        if (Array.isArray(event.data.proposalAcceptances)) {
          setProposalAcceptances(deepSanitize(event.data.proposalAcceptances));
        }
        if (Array.isArray(event.data.userProfiles)) {
          const cleanProfiles: UserProfile[] = deepSanitize(event.data.userProfiles);
          setUserProfiles(cleanProfiles);
          try {
            localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(cleanProfiles));
          } catch {}
        }
        if (Array.isArray(event.data.inventoryAdjustments)) {
          setInventoryAdjustments(deepSanitize(event.data.inventoryAdjustments));
        }
        if (Array.isArray(event.data.customers)) {
          const syncedCustomers: Customer[] = deepSanitize(event.data.customers);
          setCustomers(syncedCustomers);
          try {
            localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(syncedCustomers));
          } catch {}
        }
        if (typeof event.data.collaboratorInventoryEnabled === 'boolean') {
          setCollaboratorInventoryEnabled(event.data.collaboratorInventoryEnabled);
        }
        if (event.data.shelfInventoryStates && typeof event.data.shelfInventoryStates === 'object') {
          setShelfInventoryStates(event.data.shelfInventoryStates);
        }
        if (Array.isArray(event.data.sweepEntries)) {
          const cleanSweep = deepSanitize(event.data.sweepEntries);
          sweepEntriesRef.current = cleanSweep;
          setSweepEntries(cleanSweep);
        }
        if (event.data.sweepLoadMode === 'auto' || event.data.sweepLoadMode === 'manual') {
          sweepLoadModeRef.current = event.data.sweepLoadMode;
          setSweepLoadModeState(event.data.sweepLoadMode);
        }
        if (event.data.pricingData) {
          setPricingData(deepSanitize(event.data.pricingData));
        }
        if (event.data.sinpeSettings) {
          setSinpeSettings(deepSanitize(event.data.sinpeSettings));
        }
        if (Array.isArray(event.data.missingInventoryReports)) {
          setMissingInventoryReports(deepSanitize(event.data.missingInventoryReports));
        }
        if (Array.isArray(event.data.customerFieldDefs)) {
          setCustomerFieldDefs(deepSanitize(event.data.customerFieldDefs));
        }
        if (event.data.inventoryMode === 'stock' || event.data.inventoryMode === 'availability') {
          setInventoryModeState(event.data.inventoryMode);
        }
        if (event.data.siteDesignSettings) {
          const ds = event.data.siteDesignSettings;
          if (ds.typographyTheme) setTypographyThemeState(ds.typographyTheme);
          if (ds.starAlertDuration !== undefined) setStarAlertDurationState(ds.starAlertDuration);
        }
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.SUPERADMIN_MODULES && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setSuperadminModules(mergeSuperadminModules(parsed));
          }
        } catch {}
      }
      if (e.key === STORAGE_KEYS.PROPOSAL_ACCEPTANCES && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setProposalAcceptances(deepSanitize(parsed));
          }
        } catch {}
      }
      if (e.key === STORAGE_KEYS.USER_PROFILES && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setUserProfiles(deepSanitize(parsed));
          }
        } catch {}
      }
    };

    const handleLocalUpdate = (e: any) => {
      if (Array.isArray(e.detail)) {
        setSuperadminModules(mergeSuperadminModules(e.detail));
      }
    };

    const handleLocalProfilesUpdate = (e: any) => {
      if (Array.isArray(e.detail)) {
        setUserProfiles(deepSanitize(e.detail));
      }
    };

    syncChannel.addEventListener('message', handleSync);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('byfio_superadmin_modules_updated', handleLocalUpdate);
    window.addEventListener('byfio_user_profiles_updated', handleLocalProfilesUpdate);

    return () => {
      syncChannel.removeEventListener('message', handleSync);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('byfio_superadmin_modules_updated', handleLocalUpdate);
      window.removeEventListener('byfio_user_profiles_updated', handleLocalProfilesUpdate);
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

              const now = Date.now();
              const prevMap = new Map(prev.map((p) => [p.id, p]));
              let hasFieldChanges = false;
              const merged = data.map((cloudProd: Product) => {
                const local = prevMap.get(cloudProd.id);
                const lastLocalUpdate = lastLocalProductUpdateRef.current.get(cloudProd.id) || 0;
                const isRecentlyUpdatedLocally = now - lastLocalUpdate < 15000;

                const baseStock = isRecentlyUpdatedLocally && local ? local.stock : cloudProd.stock;
                const isZeroStock = Number(baseStock) <= 0;

                let isAvail: boolean;
                if (isZeroStock) {
                  isAvail = false; // Deshabilitado automático cuando está en cero
                } else if (isRecentlyUpdatedLocally && local && typeof local.isAvailable === 'boolean') {
                  isAvail = local.isAvailable; // Respetar cambio manual reciente
                } else if (typeof cloudProd.isAvailable === 'boolean') {
                  isAvail = cloudProd.isAvailable;
                } else if (local && typeof local.isAvailable === 'boolean') {
                  isAvail = local.isAvailable;
                } else {
                  isAvail = true;
                }

                const inStore = typeof cloudProd.showInStore === 'boolean' && !isRecentlyUpdatedLocally
                  ? cloudProd.showInStore
                  : isAvail;
                const inCat = typeof cloudProd.showInCatalog === 'boolean' && !isRecentlyUpdatedLocally
                  ? cloudProd.showInCatalog
                  : isAvail;

                const effectiveImages = isRecentlyUpdatedLocally && local && local.images && local.images.length > 0
                  ? local.images
                  : cloudProd.images;
                const effectiveImage = isRecentlyUpdatedLocally && local && local.image
                  ? local.image
                  : cloudProd.image;

                if (
                  !local ||
                  local.stock !== baseStock ||
                  local.isAvailable !== isAvail ||
                  local.price !== cloudProd.price ||
                  local.name !== cloudProd.name
                ) {
                  hasFieldChanges = true;
                }

                return {
                  ...cloudProd,
                  stock: baseStock,
                  isAvailable: isAvail,
                  showInStore: inStore,
                  showInCatalog: inCat,
                  images: effectiveImages,
                  image: effectiveImage,
                };
              });

              if (idsChanged || hasFieldChanges || merged.length !== prev.length) {
                try {
                  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(merged));
                } catch (e) {
                  console.warn('LocalStorage lleno al sincronizar productos', e);
                }
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
          if (Array.isArray(data)) {
            const cleanData: Order[] = sanitizeOrderList(data);
            checkAndNotifyNewOrders(cleanData);
            setOrders((prev) => {
              const sorted = [...cleanData].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              if (JSON.stringify(sorted) !== JSON.stringify(prev)) {
                try {
                  safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, serializeOrdersForStorage(sorted));
                } catch {}
                return sorted;
              }
              return prev;
            });
          }
        })
        .catch(() => {})
        .finally(() => {
          isInitialOrdersLoadRef.current = false;
        });

      // 2b. Sincronizar talleres creativos en tiempo real desde D1
      fetch('/api/workshops', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setWorkshops((prev) => {
              const sanitized = deepSanitize(data);
              const now = Date.now();
              const prevMap = new Map(prev.map((w) => [w.id, w]));
              const merged = sanitized.map((cloudWs: Workshop) => {
                const localWs = prevMap.get(cloudWs.id);
                const lastLocal = lastLocalWorkshopUpdateRef.current.get(cloudWs.id) || 0;
                if (localWs && now - lastLocal < 10000) {
                  return { ...cloudWs, spotsAvailable: localWs.spotsAvailable };
                }
                return cloudWs;
              });
              if (JSON.stringify(prev) !== JSON.stringify(merged)) {
                try {
                  localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(merged));
                } catch {}
                return merged;
              }
              return prev;
            });
          }
        })
        .catch(() => {});

      // 2c. Sincronizar lista de espera y configuración de WhatsApp desde D1
      fetch('/api/workshop-waitlist')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data?.entries)) {
            const ordered = sortWaitlistFifo(deepSanitize(data.entries));
            setWorkshopWaitlist(ordered);
            try { localStorage.setItem(STORAGE_KEYS.WORKSHOP_WAITLIST, JSON.stringify(ordered)); } catch {}
          }
          if (data?.settings) {
            const merged = { ...DEFAULT_WAITLIST_SETTINGS, ...deepSanitize(data.settings) };
            setWorkshopWaitlistSettings(merged);
            try { localStorage.setItem(STORAGE_KEYS.WORKSHOP_WAITLIST_SETTINGS, JSON.stringify(merged)); } catch {}
          }
        })
        .catch(() => {});

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
              safeLocalStorage.setItem(STORAGE_KEYS.SINPE_TRANSACTIONS, JSON.stringify(merged));
              return merged;
            });
          }
        })
        .catch(() => {});

      // 4. Sincronizar estado global de módulos del Superadmin en la nube con fusión defensiva
      fetch('/api/superadmin-modules')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data?.modules) && data.modules.length > 0) {
            const merged = mergeSuperadminModules(data.modules);
            setSuperadminModules((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(merged)) {
                try {
                  localStorage.setItem(STORAGE_KEYS.SUPERADMIN_MODULES, JSON.stringify(merged));
                } catch {}
                return merged;
              }
              return prev;
            });
          }
        })
        .catch(() => {});

      // 5. Sincronizar agenda de actividades y tareas en la nube
      fetch('/api/agenda')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data?.items) && data.items.length > 0) {
            setAgendaItems((prev) => {
              const deduplicated = deduplicateAgendaItems(deepSanitize(data.items));
              if (JSON.stringify(prev) !== JSON.stringify(deduplicated)) {
                try {
                  localStorage.setItem(STORAGE_KEYS.AGENDA_ITEMS, JSON.stringify(deduplicated));
                } catch {}
                return deduplicated;
              }
              return prev;
            });
          }
        })
        .catch(() => {});

      // 5b. Sincronizar pedidos a proveedor y directorio de proveedores en la nube
      fetch('/api/supplier-orders')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data?.orders) && data.orders.length > 0) {
            setSupplierOrders((prev) => {
              const sanitized = deepSanitize(data.orders);
              if (JSON.stringify(prev) !== JSON.stringify(sanitized)) {
                try {
                  localStorage.setItem(STORAGE_KEYS.SUPPLIER_ORDERS, JSON.stringify(sanitized));
                } catch {}
                return sanitized;
              }
              return prev;
            });
          }
          if (Array.isArray(data?.suppliers) && data.suppliers.length > 0) {
            setSuppliers((prev) => {
              const sanitized = deepSanitize(data.suppliers);
              if (JSON.stringify(prev) !== JSON.stringify(sanitized)) {
                try {
                  localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(sanitized));
                } catch {}
                return sanitized;
              }
              return prev;
            });
          }
        })
        .catch(() => {});
      // 5c. Sincronizar cierres de caja diarios en la nube
      fetch('/api/daily-closings')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data?.closings) && data.closings.length > 0) {
            setDailyClosings((prev) => {
              const sanitized = deepSanitize(data.closings);
              if (JSON.stringify(prev) !== JSON.stringify(sanitized)) {
                try {
                  localStorage.setItem(STORAGE_KEYS.DAILY_CLOSINGS, JSON.stringify(sanitized));
                } catch {}
                return sanitized;
              }
              return prev;
            });
          }
        })
        .catch(() => {});

      // 5d. Sincronizar aceptaciones de propuesta en la nube (Exclusivo Superadmin)
      fetch('/api/proposal-acceptances')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data?.acceptances) && data.acceptances.length > 0) {
            setProposalAcceptances((prev) => {
              const sanitized = deepSanitize(data.acceptances);
              if (JSON.stringify(prev) !== JSON.stringify(sanitized)) {
                try {
                  localStorage.setItem(STORAGE_KEYS.PROPOSAL_ACCEPTANCES, JSON.stringify(sanitized));
                } catch {}
                return sanitized;
              }
              return prev;
            });
          }
        })
        .catch(() => {});

      // 5e. Sincronizar ajustes de inventario y configuración de colaboradores en la nube
      fetch('/api/inventory-adjustments')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data?.adjustments)) {
            setInventoryAdjustments((prev) => {
              const sanitized = deepSanitize(data.adjustments);
              if (JSON.stringify(prev) !== JSON.stringify(sanitized)) {
                try {
                  localStorage.setItem(STORAGE_KEYS.INVENTORY_ADJUSTMENTS, JSON.stringify(sanitized));
                } catch {}
                return sanitized;
              }
              return prev;
            });
          }
          if (typeof data?.collaboratorInventoryEnabled === 'boolean') {
            setCollaboratorInventoryEnabled(data.collaboratorInventoryEnabled);
            try {
              localStorage.setItem(STORAGE_KEYS.COLLABORATOR_INVENTORY_ENABLED, String(data.collaboratorInventoryEnabled));
            } catch {}
          }
          if (data?.shelfStates && typeof data.shelfStates === 'object') {
            setShelfInventoryStates((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(data.shelfStates)) {
                try {
                  localStorage.setItem(STORAGE_KEYS.SHELF_INVENTORY_STATES, JSON.stringify(data.shelfStates));
                } catch {}
                return data.shelfStates;
              }
              return prev;
            });
          }
          if (Array.isArray(data?.sweepEntries)) {
            setSweepEntries((prev) => {
              const sanitized = deepSanitize(data.sweepEntries);
              if (JSON.stringify(prev) !== JSON.stringify(sanitized)) {
                sweepEntriesRef.current = sanitized;
                try {
                  localStorage.setItem(STORAGE_KEYS.SWEEP_ENTRIES, JSON.stringify(sanitized));
                } catch {}
                return sanitized;
              }
              return prev;
            });
          }
          if (data?.sweepLoadMode === 'auto' || data?.sweepLoadMode === 'manual') {
            sweepLoadModeRef.current = data.sweepLoadMode;
            setSweepLoadModeState(data.sweepLoadMode);
            try {
              localStorage.setItem(STORAGE_KEYS.SWEEP_LOAD_MODE, data.sweepLoadMode);
            } catch {}
          }
        })
        .catch(() => {});

      // 6. Sincronizar perfiles de usuario en tiempo real con bypass de caché
      const cacheBuster = `?_t=${Date.now()}`;
      fetch(`/api/users${cacheBuster}`, { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.profiles?.length) {
            handleLoadedProfiles(data);
          } else {
            fetch(`/api/user-profiles${cacheBuster}`, { cache: 'no-store' })
              .then((res) => (res.ok ? res.json() : null))
              .then((d) => d?.profiles?.length && handleLoadedProfiles(d))
              .catch(() => {});
          }
        })
      // 6b. Sincronizar configuraciones globales, precios, SINPE, clientes y reportes faltantes desde D1
      fetch('/api/store-config', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((cfg) => {
          if (!cfg || typeof cfg !== 'object') return;
          const now = Date.now();
          const recentlyEdited = (key: string) => now - (lastLocalConfigUpdateRef.current[key] || 0) < 10000;

          if (cfg.pricingData && typeof cfg.pricingData === 'object' && !recentlyEdited('pricingData')) {
            const cleanPricing = deepSanitize(cfg.pricingData);
            setPricingData((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(cleanPricing)) {
                try { localStorage.setItem(STORAGE_KEYS.PRICING_DATA, JSON.stringify(cleanPricing)); } catch {}
                return cleanPricing;
              }
              return prev;
            });
          }

          if (cfg.sinpeSettings && typeof cfg.sinpeSettings === 'object' && !recentlyEdited('sinpeSettings')) {
            const cleanSinpe = deepSanitize(cfg.sinpeSettings);
            setSinpeSettings((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(cleanSinpe)) {
                try { localStorage.setItem(STORAGE_KEYS.SINPE_SETTINGS, JSON.stringify(cleanSinpe)); } catch {}
                return cleanSinpe;
              }
              return prev;
            });
          }

          if (Array.isArray(cfg.customers) && !recentlyEdited('customers')) {
            const cleanCustomers = deepSanitize(cfg.customers);
            setCustomers((prev) => {
              let mergedCloud = cleanCustomers;
              try {
                const regRaw = safeLocalStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
                const regParsed = regRaw ? JSON.parse(regRaw) : [];
                mergedCloud = mergeRegisteredUsersIntoCustomers(cleanCustomers, regParsed);
              } catch {}
              if (JSON.stringify(prev) !== JSON.stringify(mergedCloud)) {
                try { localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(mergedCloud)); } catch {}
                return mergedCloud;
              }
              return prev;
            });
          }

          if (Array.isArray(cfg.customerFields) && !recentlyEdited('customerFields')) {
            const cleanFields = deepSanitize(cfg.customerFields);
            setCustomerFieldDefs((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(cleanFields)) {
                try { localStorage.setItem(STORAGE_KEYS.CUSTOMER_FIELDS, JSON.stringify(cleanFields)); } catch {}
                return cleanFields;
              }
              return prev;
            });
          }

          if (Array.isArray(cfg.missingInventoryReports) && !recentlyEdited('missingInventoryReports')) {
            const cleanReports = deepSanitize(cfg.missingInventoryReports);
            setMissingInventoryReports((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(cleanReports)) {
                try { localStorage.setItem(STORAGE_KEYS.MISSING_INVENTORY, JSON.stringify(cleanReports)); } catch {}
                return cleanReports;
              }
              return prev;
            });
          }

          if ((cfg.inventoryMode === 'stock' || cfg.inventoryMode === 'availability') && !recentlyEdited('inventoryMode')) {
            setInventoryModeState((prev) => {
              if (prev !== cfg.inventoryMode) {
                try { localStorage.setItem(STORAGE_KEYS.INVENTORY_MODE, cfg.inventoryMode); } catch {}
                return cfg.inventoryMode;
              }
              return prev;
            });
          }

          if (cfg.siteDesignSettings && typeof cfg.siteDesignSettings === 'object' && !recentlyEdited('siteDesignSettings')) {
            const ds = cfg.siteDesignSettings;
            if (ds.typographyTheme) {
              setTypographyThemeState((prev) => {
                if (prev !== ds.typographyTheme) {
                  try { localStorage.setItem(STORAGE_KEYS.TYPOGRAPHY_THEME, ds.typographyTheme); } catch {}
                  return ds.typographyTheme;
                }
                return prev;
              });
            }
            if (ds.starAlertDuration !== undefined) {
              setStarAlertDurationState((prev) => {
                if (prev !== ds.starAlertDuration) {
                  try { localStorage.setItem(STORAGE_KEYS.STAR_ALERT_DURATION, String(ds.starAlertDuration)); } catch {}
                  return ds.starAlertDuration;
                }
                return prev;
              });
            }
            if (typeof ds.soundBubbleEnabled === 'boolean') {
              setSoundBubbleEnabledState(ds.soundBubbleEnabled);
              try { localStorage.setItem(STORAGE_KEYS.SOUND_BUBBLE, String(ds.soundBubbleEnabled)); } catch {}
            }
            if (typeof ds.soundButtonsEnabled === 'boolean') {
              setSoundButtonsEnabledState(ds.soundButtonsEnabled);
              try { localStorage.setItem(STORAGE_KEYS.SOUND_BUTTONS, String(ds.soundButtonsEnabled)); } catch {}
            }
            if (typeof ds.soundNewOrderEnabled === 'boolean') {
              setSoundNewOrderEnabledState(ds.soundNewOrderEnabled);
              try { localStorage.setItem(STORAGE_KEYS.SOUND_NEW_ORDER, String(ds.soundNewOrderEnabled)); } catch {}
            }
            if (ds.colorTheme) {
              const hasVisitorOverride = appScope !== 'admin' && Boolean(localStorage.getItem('byfio_user_color_override_v1'));
              if (!hasVisitorOverride) {
                setColorThemeState((prev) => {
                  if (prev !== ds.colorTheme) {
                    try { localStorage.setItem(STORAGE_KEYS.COLOR_THEME, ds.colorTheme); } catch {}
                    return ds.colorTheme;
                  }
                  return prev;
                });
              }
            }
          }

          if (cfg.catalogTaxonomies) {
            applyCloudCatalogTaxonomies(cfg.catalogTaxonomies);
          }

          if (Array.isArray(cfg.calendarBlockedSpaces) && now - getLastBlockedPushAt() > 10000) {
            try {
              const localRaw = localStorage.getItem('byfio_agenda_blocked_spaces_v1');
              const cloudStr = JSON.stringify(cfg.calendarBlockedSpaces);
              if (localRaw !== cloudStr) {
                localStorage.setItem('byfio_agenda_blocked_spaces_v1', cloudStr);
                window.dispatchEvent(new CustomEvent('byfio_store_config_updated', { detail: { calendarBlockedSpaces: cfg.calendarBlockedSpaces } }));
              }
            } catch {}
          }
        })
        .catch(() => {});
    };

    // Carga de perfiles de usuario garantizando el perfil maestro prof-admin
    const handleLoadedProfiles = (data: any) => {
      if (data && Array.isArray(data.profiles) && data.profiles.length > 0) {
        const cloudProfiles: UserProfile[] = deepSanitize(data.profiles);
        setUserProfiles((prev) => {
          const map = new Map<string, UserProfile>();
          DEFAULT_USER_PROFILES.forEach((p) => {
            if (p.id === 'prof-admin') map.set(p.id, deepSanitize(p));
          });
          cloudProfiles.forEach((p) => map.set(p.id, deepSanitize(p)));
          const merged = deepSanitize(Array.from(map.values()));
          if (JSON.stringify(prev) !== JSON.stringify(merged)) {
            try {
              localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(merged));
            } catch {}
            return merged;
          }
          return prev;
        });
      }
    };

    // Carga inicial inmediata
    fetchLatestData();

    // Temporizador inteligente: 4s únicamente si la pestaña está activa y visible
    let pollingTimer: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (pollingTimer === null && typeof document !== 'undefined' && !document.hidden) {
        pollingTimer = setInterval(() => {
          if (!document.hidden) {
            fetchLatestData();
          }
        }, 4000);
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

  // viewMode ahora depende exclusivamente del scope activo de la app (sin sobreescribir otras pestañas o PWAs vía localStorage)

  useEffect(() => {
    safeLocalStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    try {
      safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, serializeOrdersForStorage(orders));
    } catch {}
  }, [orders]);

  // Sincronizar cuentas registradas desde Cloudflare D1 hacia POS/Clientes
  useEffect(() => {
    syncRegisteredUsers();
  }, [syncRegisteredUsers]);

  // Chequeo proactivo de recordatorios de apartados proximos a vencer (<= 5 dias restantes)
  useEffect(() => {
    if (orders && orders.length > 0) {
      checkAndSendLayawayReminders(orders, (updatedOrder) => {
        setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
      });
    }
  }, [orders]);

  useEffect(() => {
    try {
      safeLocalStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      safeLocalStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(workshops));
    } catch {}
  }, [workshops]);

  const addToCart = (item: Omit<CartItem, 'cartId'>) => {
    try {
      if (!item || !item.id) return;

      // Si el producto está en cero o desactivado, bloquear la adición al carrito
      if (item.type === 'product') {
        const prod = products.find((p) => p && p.id === item.id);
        if (prod && (prod.stock <= 0 || prod.isAvailable === false || prod.showInStore === false || prod.showInCatalog === false)) {
          return;
        }
      }

      const isLayaway = Boolean(item.isLayaway);
      const cartId = `${item.id}-${isLayaway ? 'layaway' : 'normal'}-${item.customText || 'standard'}-${Date.now()}`;
      setCart((prev) => {
        const safePrev = Array.isArray(prev) ? prev.filter((i) => i && i.id) : [];
        const existing = safePrev.find(
          (i) => i.id === item.id && (i.customText || '') === (item.customText || '') && Boolean(i.isLayaway) === isLayaway
        );
        if (existing) {
          return safePrev.map((i) =>
            i.cartId === existing.cartId ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) } : i
          );
        }
        return [...safePrev, { ...item, cartId, quantity: item.quantity || 1 }];
      });
      // No abrir el carrito automáticamente; mostrar cartel de confirmación que auto-desaparece
      showCartSuccessToast({
        productName: item.name || 'Producto',
        quantity: item.quantity || 1,
        image: item.image,
        price: Number(item.price) || 0,
      });

      // Registrar en analítica de métricas (global y atribuida al enlace de origen si existe)
      try {
        metricsTracker.recordCartAddition(item.name, item.quantity, item.price);
      } catch (e) {
        console.warn('Error registrando producto en métricas de carrito', e);
      }
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
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

    const firstLayItem = cart.find((i) => i.isLayaway);
    const isLayawayOrder = Boolean(firstLayItem);
    const orderNumber = getNextOrderNumber(orders);

    const orderItems = cart.map((item, idx) => ({
      id: `ord-item-${Date.now()}-${idx}`,
      type: item.type,
      ...(item.type === 'workshop' ? { workshopId: item.workshopId || item.id } : {}),
      sku: item.sku,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      shelfLocation: item.shelfLocation,
      customText: item.customText,
      isPicked: item.type === 'workshop',
      image: item.image,
      isLayaway: item.isLayaway,
      layawayMonths: item.layawayMonths,
      layawayPaymentsCount: item.layawayPaymentsCount,
      layawayDownPaymentPercent: item.layawayDownPaymentPercent,
      layawayTotalAmount: item.layawayTotalAmount,
      layawayDownPaymentAmount: item.layawayDownPaymentAmount,
      layawayRemainingAmount: item.layawayRemainingAmount,
      layawayDueDate: item.layawayDueDate,
      layawayDaysTotal: item.layawayDaysTotal,
    }));

    const isAllInitiallyPicked = orderItems.length > 0 && orderItems.every((it) => it.isPicked);

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
      orderStatus: isAllInitiallyPicked ? 'packing' : 'pending',
      items: orderItems,
      subtotal,
      shippingFee,
      total,
      createdAt: new Date().toISOString(),
      notes: orderInfo.notes,
      isLayaway: isLayawayOrder,
      layawayMonths: firstLayItem?.layawayMonths,
      layawayPaymentsCount: firstLayItem?.layawayPaymentsCount,
      layawayDownPaymentPercent: firstLayItem?.layawayDownPaymentPercent,
      layawayTotalAmount: firstLayItem?.layawayTotalAmount,
      layawayDownPaymentAmount: firstLayItem?.layawayDownPaymentAmount,
      layawayRemainingAmount: firstLayItem?.layawayRemainingAmount,
      layawayDueDate: firstLayItem?.layawayDueDate || (firstLayItem ? new Date(Date.now() + (firstLayItem.layawayMonths || 1) * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined),
      layawayDaysTotal: firstLayItem?.layawayDaysTotal || (firstLayItem ? (firstLayItem.layawayMonths || 1) * 30 : undefined),
      layawayReminderEmailSent: false,
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
        if (Array.isArray(data?.workshopUpdates) && data.workshopUpdates.length > 0) {
          applyCloudWorkshopUpdates(data.workshopUpdates);
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
          const isZero = newStock <= 0;
          batchUpdates.push({ id: prod.id, stock: newStock, ...(isZero ? { isAvailable: false } : {}) });
          return {
            ...prod,
            stock: newStock,
            ...(isZero ? { isAvailable: false, showInStore: false, showInCatalog: false } : {}),
          };
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
          (c) => c.type === 'workshop' && (c.id === w.id || c.workshopId === w.id || c.sku === `WS-${w.id.toUpperCase()}`)
        );
        if (inCartWs) {
          lastLocalWorkshopUpdateRef.current.set(w.id, Date.now());
          return { ...w, spotsAvailable: Math.max(0, w.spotsAvailable - inCartWs.quantity) };
        }
        return w;
      });
      localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(updatedWorkshops));
      if (updatedWorkshops.some((w) => lastLocalWorkshopUpdateRef.current.has(w.id))) {
        try { syncChannel?.postMessage({ type: 'SYNC_UPDATE', workshops: updatedWorkshops }); } catch {}
      }
      return updatedWorkshops;
    });

    const updatedOrders = [newOrder, ...orders.filter((o) => o.id !== newOrder.id)].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(updatedOrders);
    safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, serializeOrdersForStorage(updatedOrders));
    knownOrderIdsRef.current.add(newOrder.id);
    const isWsOrder = newOrder.items?.some((it) => it.type === 'workshop') || newOrder.id?.startsWith('ord-ws-') || newOrder.orderNumber?.startsWith('#WS');
    const wsItemInOrder = newOrder.items?.find((it) => it.type === 'workshop');
    const isLayOrder = Boolean(newOrder.isLayaway || newOrder.items?.some((it) => it.isLayaway));
    if (canReceiveOrderNotifications(Boolean(isWsOrder), isLayOrder)) {
      playNewOrderChimeSound(0.85);
      showNewOrderAlert({
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        total: newOrder.total,
        isWorkshop: Boolean(isWsOrder),
        workshopTitle: wsItemInOrder?.name,
        isLayaway: isLayOrder,
      });
      sendOrderPushNotification({
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        total: newOrder.total,
        isWorkshop: Boolean(isWsOrder),
        workshopTitle: wsItemInOrder?.name,
        isLayaway: isLayOrder,
      });
    }

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

  const startPicking = (orderId: string, mode: 'barcode' | 'manual' = 'barcode') => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    setPickingMode(mode);
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

  const markItemPicked = (orderId: string, itemSku: string, pickerName?: string) => {
    let completed = false;
    let found = false;
    let updatedActiveOrder: Order | null = null;
    const actorName = pickerName || currentUser?.name || 'Administración';
    const nowIso = new Date().toISOString();

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedItems = [...order.items];
        const normPickSku = (v: string) => (v || '').trim().toUpperCase().replace(/^FIO-/, 'BF-');
        const cleanSku = normPickSku(itemSku);
        let unpickedIdx = updatedItems.findIndex(
          (it) => !it.isPicked && !it.isMissing && (
            (it.sku && normPickSku(it.sku) === cleanSku) ||
            (it.id && it.id === itemSku)
          )
        );

        // Al alistar pedido, si no coincide por SKU exacto, alistar el primer producto pendiente
        if (unpickedIdx === -1 && pickingMode === 'manual') {
          unpickedIdx = updatedItems.findIndex((it) => !it.isPicked && !it.isMissing);
        }

        if (unpickedIdx !== -1) {
          found = true;
          updatedItems[unpickedIdx] = {
            ...updatedItems[unpickedIdx],
            isPicked: true,
            pickedAt: nowIso,
          };
        }

        const allPicked = updatedItems.every((it) => it.isPicked || it.isMissing);
        if (allPicked) completed = true;

        const resolvedPickedBy = order.pickedBy || actorName;
        const resolvedPickedAt = order.pickedAt || nowIso;

        const updatedOrder: Order = {
          ...order,
          items: updatedItems,
          orderStatus: allPicked ? 'packing' : 'picking',
          packedAt: allPicked ? (order.packedAt || nowIso) : order.packedAt,
          pickedBy: resolvedPickedBy,
          pickedAt: resolvedPickedAt,
        };

        updatedActiveOrder = updatedOrder;

        // Sync with D1 Database
        fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: orderId,
            orderStatus: updatedOrder.orderStatus,
            packedAt: updatedOrder.packedAt,
            pickedBy: updatedOrder.pickedBy,
            pickedAt: updatedOrder.pickedAt,
            items: updatedItems,
          }),
        }).catch(() => {});

        return updatedOrder;
      })
    );

    if (updatedActiveOrder) {
      setActivePickingOrder(updatedActiveOrder);
    }

    if (!found) {
      // Solo emitir error si estamos en modo código/QR
      if (pickingMode === 'barcode') {
        playAudioBeep('error');
        return { isComplete: false, error: `El código "${itemSku}" no coincide con el producto requerido en este paso.` };
      }
      return { isComplete: false };
    }

    if (completed) {
      playAudioBeep('finish');
    } else {
      playAudioBeep('success');
    }

    return { isComplete: completed };
  };

  const unmarkItemPicked = (orderId: string, itemSku: string) => {
    let updatedActiveOrder: Order | null = null;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const updatedItems = order.items.map((it) =>
          it.sku === itemSku ? { ...it, isPicked: false, pickedAt: undefined, isMissing: false } : it
        );
        const updatedOrder: Order = {
          ...order,
          items: updatedItems,
          orderStatus: 'picking',
        };
        updatedActiveOrder = updatedOrder;
        fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: orderId,
            orderStatus: 'picking',
            items: updatedItems,
          }),
        }).catch(() => {});
        return updatedOrder;
      })
    );
    if (updatedActiveOrder) {
      setActivePickingOrder(updatedActiveOrder);
    }
  };

  const markAllItemsPicked = (orderId: string, pickerName?: string) => {
    let completedOrder: Order | null = null;
    const now = new Date().toISOString();
    const actorName = pickerName || currentUser?.name || 'Administración';
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const updatedItems = order.items.map((it) => ({
          ...it,
          isPicked: true,
          pickedAt: it.pickedAt || now,
          isMissing: false,
        }));
        completedOrder = {
          ...order,
          items: updatedItems,
          orderStatus: 'packing',
          packedAt: now,
          pickedBy: order.pickedBy || actorName,
          pickedAt: order.pickedAt || now,
        };
        if (activePickingOrder?.id === orderId) {
          setActivePickingOrder(completedOrder);
        }
        fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: orderId,
            orderStatus: 'packing',
            packedAt: now,
            pickedBy: completedOrder.pickedBy,
            pickedAt: completedOrder.pickedAt,
            items: updatedItems,
          }),
        }).catch(() => {});
        return completedOrder;
      })
    );
    playAudioBeep('finish');
    return { isComplete: true };
  };

  const markItemMissing = (orderId: string, itemSku: string) => {
    let completed = false;
    let found = false;
    let updatedActiveOrder: Order | null = null;

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
            lastLocalConfigUpdateRef.current.missingInventoryReports = Date.now();
            pushStoreConfig({ missingInventoryReports: nextReports });
            try { syncChannel?.postMessage({ type: 'SYNC_UPDATE', missingInventoryReports: nextReports }); } catch {}
            return nextReports;
          });
        }

        const allProcessed = updatedItems.every((it) => it.isPicked || it.isMissing);
        if (allProcessed) completed = true;

        const updatedOrder: Order = {
          ...order,
          items: updatedItems,
          orderStatus: allProcessed ? 'packing' : 'picking',
          packedAt: allProcessed ? (order.packedAt || new Date().toISOString()) : order.packedAt,
        };

        updatedActiveOrder = updatedOrder;

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

    if (updatedActiveOrder) {
      setActivePickingOrder(updatedActiveOrder);
    }

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

  const updateOrderItemQuantity = (
    orderId: string,
    itemSku: string,
    newQuantity: number
  ) => {
    const cleanQty = Math.max(0, Math.floor(newQuantity));
    let updatedActiveOrder: Order | null = null;
    let found = false;

    setOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedItems = order.items.map((it) => {
          if (it.sku === itemSku) {
            found = true;
            return {
              ...it,
              quantity: cleanQty,
            };
          }
          return it;
        });

        const subtotal = updatedItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
        const total = subtotal + (order.shippingFee || 0);
        const allProcessed = updatedItems.length > 0 && updatedItems.every((it) => it.isPicked || it.isMissing);

        const updatedOrder: Order = {
          ...order,
          items: updatedItems,
          subtotal,
          total,
          orderStatus: allProcessed ? 'packing' : order.orderStatus,
          packedAt: allProcessed ? (order.packedAt || new Date().toISOString()) : order.packedAt,
        };

        updatedActiveOrder = updatedOrder;

        fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: orderId,
            orderStatus: updatedOrder.orderStatus,
            packedAt: updatedOrder.packedAt,
            items: updatedItems,
            subtotal,
            total,
          }),
        }).catch(() => {});

        return updatedOrder;
      });

      safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, serializeOrdersForStorage(updated));

      try {
        syncChannel?.postMessage({
          type: 'SYNC_UPDATE',
          orders: updated,
        });
      } catch {}

      return updated;
    });

    if (updatedActiveOrder) {
      setActivePickingOrder(updatedActiveOrder);
    }

    if (!found) {
      return { success: false, error: `No se encontró el producto ${itemSku} en este pedido.` };
    }

    playAudioBeep('success');
    return { success: true };
  };

  const resolveMissingReport = (reportId: string) => {
    setMissingInventoryReports((prev) => {
      const next = prev.map((rep) => (rep.id === reportId ? { ...rep, resolved: true, resolvedAt: new Date().toISOString() } : rep));
      localStorage.setItem(STORAGE_KEYS.MISSING_INVENTORY, JSON.stringify(next));
      lastLocalConfigUpdateRef.current.missingInventoryReports = Date.now();
      pushStoreConfig({ missingInventoryReports: next });
      try { syncChannel?.postMessage({ type: 'SYNC_UPDATE', missingInventoryReports: next }); } catch {}
      return next;
    });
  };

  const deleteMissingReport = (reportId: string) => {
    setMissingInventoryReports((prev) => {
      const next = prev.filter((rep) => rep.id !== reportId);
      localStorage.setItem(STORAGE_KEYS.MISSING_INVENTORY, JSON.stringify(next));
      lastLocalConfigUpdateRef.current.missingInventoryReports = Date.now();
      pushStoreConfig({ missingInventoryReports: next });
      try { syncChannel?.postMessage({ type: 'SYNC_UPDATE', missingInventoryReports: next }); } catch {}
      return next;
    });
  };

  const addLayawayPayment = async (
    orderId: string,
    payment: {
      amount: number;
      paymentMethod: 'sinpe' | 'transferencia' | 'tarjeta' | 'efectivo';
      reference?: string;
      notes?: string;
      registeredBy?: string;
    }
  ): Promise<boolean> => {
    try {
      let targetOrder = orders.find((o) => o.id === orderId);
      if (!targetOrder) {
        const saved = safeLocalStorage.getItem(STORAGE_KEYS.ORDERS);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            targetOrder = Array.isArray(parsed) ? parsed.find((o: Order) => o.id === orderId) : undefined;
          } catch {}
        }
      }

      if (!targetOrder) return false;

      const layItem = (targetOrder.items && targetOrder.items.find((i) => i.isLayaway)) || (targetOrder.items && targetOrder.items[0]);
      const payAmount = Number(payment.amount) || 0;
      if (payAmount <= 0) return false;

      const initialCheckoutPayment = Number(targetOrder.total) || 0;
      const existingPayments: LayawayPaymentRecord[] = Array.isArray(targetOrder.layawayPayments) && targetOrder.layawayPayments.length > 0
        ? [...targetOrder.layawayPayments]
        : (Array.isArray(layItem?.layawayPayments) ? [...layItem.layawayPayments] : []);

      const newRecord: LayawayPaymentRecord = {
        id: `laypay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        amount: payAmount,
        date: new Date().toISOString(),
        paymentMethod: payment.paymentMethod,
        reference: payment.reference ? payment.reference.trim() : undefined,
        notes: payment.notes ? payment.notes.trim() : undefined,
        registeredBy: payment.registeredBy || currentUser?.name || 'Cliente',
      };

      const updatedPayments = [...existingPayments, newRecord];
      const sumOfAllAbonos = updatedPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
      const totalPaidSoFar = initialCheckoutPayment + sumOfAllAbonos;

      let itemTotal =
        (targetOrder.layawayTotalAmount && Number(targetOrder.layawayTotalAmount) > 0 ? Number(targetOrder.layawayTotalAmount) : 0) ||
        (layItem?.layawayTotalAmount && Number(layItem.layawayTotalAmount) > 0 ? Number(layItem.layawayTotalAmount) : 0) ||
        (Number(layItem?.price) > initialCheckoutPayment ? Number(layItem?.price) : 0);

      if (!itemTotal || itemTotal < totalPaidSoFar) {
        const prevRemaining = Number(targetOrder.layawayRemainingAmount) || 0;
        itemTotal = Math.max(totalPaidSoFar, totalPaidSoFar - payAmount + prevRemaining);
      }

      const newRemainingDebt = Math.max(0, itemTotal - totalPaidSoFar);
      const sourceCleanNum = `#${(targetOrder.orderNumber || '').replace(/^#+/, '') || 'FIO'}`;
      let storedOrdersSnapshot: Order[] = [];
      try {
        const rawOrders = safeLocalStorage.getItem(STORAGE_KEYS.ORDERS);
        if (rawOrders) {
          const parsed = JSON.parse(rawOrders);
          if (Array.isArray(parsed)) storedOrdersSnapshot = parsed;
        }
      } catch {}

      const knownAllOrders = [...orders, ...storedOrdersSnapshot];
      const hasGeneratedSaleAlready = Boolean(
        targetOrder.layawaySaleOrderId ||
          targetOrder.items?.some((it) => Boolean(it.layawayGeneratedSaleOrderId)) ||
          knownAllOrders.some(
            (o) =>
              o.layawaySourceOrderId === orderId ||
              o.items?.some((it) => it.layawaySourceOrderId === orderId)
          )
      );

      const shouldGenerateLayawaySale = newRemainingDebt <= 0 && !hasGeneratedSaleAlready;
      const completionIso = newRecord.date;
      const generatedSaleId = shouldGenerateLayawaySale
        ? `ord-layaway-sale-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
        : undefined;

      const updatedItems = (targetOrder.items || []).map((it) => {
        if (it.isLayaway || it.id === layItem?.id) {
          return {
            ...it,
            layawayTotalAmount: itemTotal,
            layawayDownPaymentAmount: totalPaidSoFar,
            layawayRemainingAmount: newRemainingDebt,
            layawayPayments: updatedPayments,
            ...(shouldGenerateLayawaySale && generatedSaleId
              ? {
                  layawayGeneratedSaleOrderId: generatedSaleId,
                  layawayGeneratedSaleCreatedAt: completionIso,
                }
              : {}),
          };
        }
        return it;
      });

      const updatedOrder: Order = {
        ...targetOrder,
        layawayTotalAmount: itemTotal,
        layawayDownPaymentAmount: totalPaidSoFar,
        layawayRemainingAmount: newRemainingDebt,
        layawayPayments: updatedPayments,
        items: updatedItems,
        ...(shouldGenerateLayawaySale && generatedSaleId
          ? {
              layawaySaleOrderId: generatedSaleId,
              layawayCompletedAt: completionIso,
            }
          : {}),
      };

      let generatedSaleOrder: Order | null = null;
      if (shouldGenerateLayawaySale && generatedSaleId) {
        const baseItems = targetOrder.items || [];
        const nonLaySum = baseItems
          .filter((it) => !it.isLayaway && it.id !== layItem?.id)
          .reduce((acc, it) => acc + (Number(it.price) || 0) * Math.max(1, Number(it.quantity) || 1), 0);
        const layTargets = baseItems.filter((it) => it.isLayaway || it.id === layItem?.id);
        const layTargetTotal = Math.max(0, itemTotal - nonLaySum);
        const layQtySum = layTargets.reduce((acc, it) => acc + Math.max(1, Number(it.quantity) || 1), 0);

        const saleItems: OrderItem[] = baseItems.map((it, idx) => {
          const isTargetLay = Boolean(it.isLayaway || it.id === layItem?.id);
          const qty = Math.max(1, Number(it.quantity) || 1);
          const fullUnitPrice = isTargetLay
            ? layTargets.length <= 1
              ? Math.round(layTargetTotal / qty)
              : Math.round(layTargetTotal / Math.max(1, layQtySum))
            : Number(it.price) || 0;

          return {
            id: `ord-laysale-item-${Date.now()}-${idx}`,
            type: it.type || 'product',
            sku: it.sku,
            name: it.name,
            price: fullUnitPrice,
            quantity: qty,
            shelfLocation: it.shelfLocation,
            customText: it.customText,
            image: it.image,
            isPicked: true,
            pickedAt: completionIso,
            isLayaway: false,
            isLayawaySale: true,
            saleCategory: LAYAWAY_SALE_CATEGORY,
            layawaySourceOrderId: targetOrder.id,
            layawaySourceOrderNumber: sourceCleanNum,
          };
        });

        generatedSaleOrder = {
          id: generatedSaleId,
          orderNumber: getNextOrderNumber(knownAllOrders),
          orderTitle: LAYAWAY_SALE_CATEGORY,
          saleCategory: LAYAWAY_SALE_CATEGORY,
          isLayaway: false,
          isLayawaySale: true,
          layawaySourceOrderId: targetOrder.id,
          layawaySourceOrderNumber: sourceCleanNum,
          customerName: targetOrder.customerName,
          customerPhone: targetOrder.customerPhone,
          customerEmail: targetOrder.customerEmail,
          deliveryMethod: targetOrder.deliveryMethod,
          shippingAddress: targetOrder.shippingAddress,
          paymentMethod: payment.paymentMethod,
          paymentStatus: 'paid',
          orderStatus: 'delivered',
          items: saleItems,
          subtotal: itemTotal,
          shippingFee: 0,
          total: itemTotal,
          createdAt: completionIso,
          packedAt: completionIso,
          deliveredAt: completionIso,
          pickedBy: payment.registeredBy || currentUser?.name || 'Administración',
          pickedAt: completionIso,
          notes: `[VENTAS DE APARTADOS] Liquidación completa de apartado ${sourceCleanNum} • Último abono: ₡${payAmount.toLocaleString('es-CR')}`,
        };
        knownOrderIdsRef.current.add(generatedSaleOrder.id);
      }

      let nextOrders: Order[] = [];
      setOrders((prev) => {
        const mapped = prev.map((o) => (o.id === orderId ? updatedOrder : o));
        const hasSaleInPrev = generatedSaleOrder
          ? mapped.some(
              (o) =>
                o.id === generatedSaleOrder!.id ||
                o.layawaySourceOrderId === orderId ||
                o.items?.some((it) => it.layawaySourceOrderId === orderId)
            )
          : true;
        nextOrders = generatedSaleOrder && !hasSaleInPrev
          ? [generatedSaleOrder, ...mapped].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          : mapped;
        safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, serializeOrdersForStorage(nextOrders));
        try {
          syncChannel?.postMessage({ type: 'SYNC_UPDATE', orders: nextOrders });
        } catch {}
        return nextOrders;
      });

      // Transmitir actualización del apartado a Cloudflare D1 en segundo plano
      fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          items: updatedItems,
        }),
      }).catch((e) => console.warn('[D1 Layaway Payment PUT warn]:', e));

      // Registrar la venta generada ("Ventas de apartados") en Cloudflare D1 el día del último pago
      if (generatedSaleOrder) {
        const createdSale = generatedSaleOrder;
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createdSale),
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.orderNumber && data.orderNumber !== createdSale.orderNumber) {
              setOrders((prev) => {
                const updatedWithNum = prev.map((o) =>
                  o.id === createdSale.id ? { ...o, orderNumber: data.orderNumber } : o
                );
                safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, serializeOrdersForStorage(updatedWithNum));
                return updatedWithNum;
              });
            }
          })
          .catch((e) => console.warn('[D1 Layaway Sale POST warn]:', e));
      }

      return true;
    } catch (err) {
      console.error('[addLayawayPayment error]:', err);
      return false;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, customPickerName?: string) => {
    // BLINDAJE ESTRICTO: Un pedido NO puede pasar a packing, packed o delivered si su alisto NO está al 100%
    const currentOrder = orders.find((o) => o.id === orderId);
    if (newStatus === 'packing' || newStatus === 'packed' || newStatus === 'delivered') {
      const hasItems = Array.isArray(currentOrder?.items) && currentOrder.items.length > 0;
      const isComplete = hasItems && currentOrder.items.every((it) => it.isPicked || it.isMissing);
      if (!isComplete) {
        console.warn(`[Blindaje Alisto] El pedido ${orderId} no puede avanzar a '${newStatus}' sin completar el 100% de alisto.`);
        return;
      }
    }

    const nowIso = new Date().toISOString();
    const packedAt = (newStatus === 'packing' || newStatus === 'packed') ? nowIso : undefined;
    const deliveredAt = (newStatus === 'delivered') ? nowIso : undefined;
    const actorName = customPickerName || currentUser?.name || 'Administración';

    let updatedOrders: Order[] = [];
    setOrders((prev) => {
      // Verificación defensiva contra datos desactualizados en closure
      const targetInPrev = prev.find((o) => o.id === orderId);
      if (newStatus === 'packing' || newStatus === 'packed' || newStatus === 'delivered') {
        const hasItems = Array.isArray(targetInPrev?.items) && targetInPrev.items.length > 0;
        const isComplete = hasItems && targetInPrev.items.every((it) => it.isPicked || it.isMissing);
        if (!isComplete) {
          return prev;
        }
      }

      updatedOrders = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: newStatus,
              packedAt: packedAt || o.packedAt,
              deliveredAt: deliveredAt || o.deliveredAt,
              pickedBy: o.pickedBy || (newStatus !== 'pending' ? actorName : undefined),
              pickedAt: o.pickedAt || (newStatus !== 'pending' ? nowIso : undefined),
            }
          : o
      );
      safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, serializeOrdersForStorage(updatedOrders));
      return updatedOrders;
    });

    const targetOrder = orders.find((o) => o.id === orderId);
    const resolvedPickedBy = targetOrder?.pickedBy || actorName;
    const resolvedPickedAt = targetOrder?.pickedAt || nowIso;

    fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: orderId,
        orderStatus: newStatus,
        packedAt,
        deliveredAt,
        pickedBy: resolvedPickedBy,
        pickedAt: resolvedPickedAt,
        items: targetOrder?.items,
      }),
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
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    lastLocalProductUpdateRef.current.set(productId, Date.now());

    const isZero = stock <= 0;
    const restoredStock = stock > 0 && target.stock <= 0;
    const updatedProduct: Product = {
      ...target,
      stock,
      minStock: minStock !== undefined ? minStock : target.minStock,
      maxStock: maxStock !== undefined ? maxStock : target.maxStock,
      ...(isZero
        ? { isAvailable: false, showInStore: false, showInCatalog: false }
        : restoredStock
        ? { isAvailable: true, showInStore: true, showInCatalog: true }
        : {}),
    };

    let updatedProducts: Product[] = [];
    setProducts((prev) => {
      updatedProducts = prev.map((p) => (p.id === productId ? updatedProduct : p));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    if (isZero) {
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
      body: JSON.stringify({
        id: productId,
        stock,
        minStock: updatedProduct.minStock,
        maxStock: updatedProduct.maxStock,
        ...(isZero ? { isAvailable: false } : {}),
      }),
    }).catch(() => {});

    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        products: products.map((p) => (p.id === productId ? updatedProduct : p)),
      });
    } catch {}
  };

  const toggleProductAvailability = (productId: string) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    lastLocalProductUpdateRef.current.set(productId, Date.now());

    const nextAvailable = targetProduct.isAvailable === false;
    // Si se habilita manualmente pero el stock estaba en cero o menor, asignar al menos 5 unidades o minStock para que quede activo al 100%
    const nextStock = nextAvailable && targetProduct.stock <= 0
      ? Math.max(1, targetProduct.minStock || 5)
      : targetProduct.stock;

    const updatedProduct: Product = {
      ...targetProduct,
      stock: nextStock,
      isAvailable: nextAvailable,
      showInStore: nextAvailable,
      showInCatalog: nextAvailable,
    };

    let updatedProducts: Product[] = [];
    setProducts((prev) => {
      updatedProducts = prev.map((p) => (p.id === productId ? updatedProduct : p));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    // Si se desactiva el producto, eliminarlo de inmediato del carrito
    if (!nextAvailable) {
      setCart((prevCart) => prevCart.filter((it) => it.type !== 'product' || it.id !== productId));
    }

    // Sincronizar estado completo en D1
    fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    }).catch(() => {});

    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        products: products.map((p) => (p.id === productId ? updatedProduct : p)),
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
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      } catch (e) {
        console.warn('LocalStorage lleno al agregar producto', e);
      }
      return updatedProducts;
    });

    // Guardar en base de datos D1
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    }).then(async (res) => {
      if (!res.ok) {
        const txt = await res.text();
        console.error('Error al crear producto en D1:', res.status, txt);
      }
    }).catch((err) => {
      console.error('Error de red al crear producto en D1:', err);
    });

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
    const existing = products.find((p) => p.id === productId);
    if (!existing) return;

    lastLocalProductUpdateRef.current.set(productId, Date.now());

    // Regla: si el nuevo stock es <= 0, se deshabilita automáticamente
    // Pero si el stock es > 0, se respeta 100% lo que el usuario haya seleccionado en isAvailable
    const newStock = updatedData.stock !== undefined ? updatedData.stock : existing.stock;
    const isAutoDisabled = newStock <= 0;

    const mergedData = { ...updatedData };
    if (isAutoDisabled) {
      mergedData.isAvailable = false;
      mergedData.showInStore = false;
      mergedData.showInCatalog = false;
    }

    const updatedTarget: Product = {
      ...existing,
      ...mergedData,
    };

    let updatedProducts: Product[] = [];
    setProducts((prev) => {
      updatedProducts = prev.map((p) => (p.id === productId ? updatedTarget : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
      } catch (e) {
        console.warn('LocalStorage lleno al actualizar producto', e);
      }
      return updatedProducts;
    });

    if (updatedTarget.isAvailable === false) {
      setCart((prevCart) => prevCart.filter((it) => it.type !== 'product' || it.id !== productId));
    }

    // Sincronizar cambios en D1 garantizado
    fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTarget),
    }).then(async (res) => {
      if (!res.ok) {
        const txt = await res.text();
        console.error('Error al guardar producto en D1:', res.status, txt);
      }
    }).catch((err) => {
      console.error('Error de red al sincronizar con D1:', err);
    });

    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        products: products.map((p) => (p.id === productId ? updatedTarget : p)),
      });
    } catch {}
  };

  const addWorkshop = (wsData: Omit<Workshop, 'id'>): Workshop => {
    const newWs: Workshop = { ...wsData, id: `ws-${Date.now()}` };
    lastLocalWorkshopUpdateRef.current.set(newWs.id, Date.now());
    setWorkshops((prev) => {
      const next = [...prev, newWs];
      try { localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(next)); } catch {}
      try { syncChannel?.postMessage({ type: 'SYNC_UPDATE', workshops: next }); } catch {}
      return next;
    });
    try {
      fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWs),
      }).catch(() => {});
    } catch {}
    return newWs;
  };

  const deleteWorkshop = (wsId: string) => {
    lastLocalWorkshopUpdateRef.current.set(wsId, Date.now());
    setWorkshops((prev) => {
      const next = prev.filter((w) => w.id !== wsId);
      try { localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(next)); } catch {}
      try { syncChannel?.postMessage({ type: 'SYNC_UPDATE', workshops: next }); } catch {}
      return next;
    });
    try {
      fetch(`/api/workshops?id=${encodeURIComponent(wsId)}`, {
        method: 'DELETE',
      }).catch(() => {});
    } catch {}
  };

  const notifyWorkshopWaitlistSpotOpened = async (workshopId: string, entryId?: string) => {
    const ws = workshops.find((w) => w.id === workshopId);
    const whatsappTarget = resolveWaitlistWhatsappTarget(ws, workshopWaitlistSettings);
    const nowIso = new Date().toISOString();

    setWorkshopWaitlist((prev) => {
      const next = prev.map((entry) => {
        if (entryId ? entry.id === entryId : entry.workshopId === workshopId && entry.status === 'waiting') {
          return { ...entry, status: 'notified' as const, notifiedAt: nowIso, spotNotificationSent: true };
        }
        return entry;
      });
      try { localStorage.setItem(STORAGE_KEYS.WORKSHOP_WAITLIST, JSON.stringify(next)); } catch {}
      return next;
    });

    try {
      const res = await fetch('/api/workshop-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'notify_spot_opened',
          workshopId,
          entryId,
          workshopTitle: ws?.title,
          workshopDate: ws?.date,
          whatsappUrl: whatsappTarget.url,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          notifiedCount: Number(data?.notifiedCount) || 0,
          emailSentCount: Number(data?.emailSentCount) || 0,
        };
      }
    } catch {}
    return { notifiedCount: 0, emailSentCount: 0 };
  };

  const refreshWorkshopWaitlist = useCallback(async () => {
    try {
      const res = await fetch('/api/workshop-waitlist');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data?.entries)) {
        const ordered = sortWaitlistFifo(deepSanitize(data.entries));
        setWorkshopWaitlist(ordered);
        try { localStorage.setItem(STORAGE_KEYS.WORKSHOP_WAITLIST, JSON.stringify(ordered)); } catch {}
      }
      if (data?.settings) {
        const merged = { ...DEFAULT_WAITLIST_SETTINGS, ...deepSanitize(data.settings) };
        setWorkshopWaitlistSettings(merged);
        try { localStorage.setItem(STORAGE_KEYS.WORKSHOP_WAITLIST_SETTINGS, JSON.stringify(merged)); } catch {}
      }
    } catch {}
  }, []);

  const joinWorkshopWaitlist = async (payload: {
    workshop: Workshop;
    name: string;
    email: string;
    phone: string;
    idCard?: string;
    address?: string;
  }) => {
    const cleanEmail = payload.email.trim().toLowerCase();
    const whatsappTarget = resolveWaitlistWhatsappTarget(payload.workshop, workshopWaitlistSettings);
    const localEntry: WorkshopWaitlistEntry = {
      id: `wl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      workshopId: payload.workshop.id,
      workshopTitle: payload.workshop.title,
      workshopDate: payload.workshop.date,
      name: payload.name.trim(),
      email: cleanEmail,
      phone: payload.phone.trim(),
      idCard: payload.idCard?.trim() || '',
      address: payload.address?.trim() || '',
      createdAt: new Date().toISOString(),
      status: 'waiting',
      emailSent: false,
      spotNotificationSent: false,
    };

    try {
      const res = await fetch('/api/workshop-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          ...localEntry,
          whatsappUrl: whatsappTarget.url,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const finalEntry: WorkshopWaitlistEntry = deepSanitize(data?.entry || localEntry);
        const position = Number(data?.position) || 1;
        setWorkshopWaitlist((prev) => {
          const deduped = prev.filter(
            (e) =>
              e.id !== finalEntry.id &&
              !(e.workshopId === finalEntry.workshopId && e.email.toLowerCase() === finalEntry.email.toLowerCase())
          );
          const next = sortWaitlistFifo([...deduped, finalEntry]);
          try { localStorage.setItem(STORAGE_KEYS.WORKSHOP_WAITLIST, JSON.stringify(next)); } catch {}
          return next;
        });
        if (data?.settings) {
          const merged = { ...DEFAULT_WAITLIST_SETTINGS, ...deepSanitize(data.settings) };
          setWorkshopWaitlistSettings(merged);
          try { localStorage.setItem(STORAGE_KEYS.WORKSHOP_WAITLIST_SETTINGS, JSON.stringify(merged)); } catch {}
        }
        return { entry: finalEntry, position, emailDispatch: data?.emailDispatch };
      }
    } catch {}

    const activeList = sortWaitlistFifo(
      workshopWaitlist.filter((e) => e.workshopId === localEntry.workshopId && e.status !== 'cancelled')
    );
    const exists = activeList.find((e) => e.email.toLowerCase() === cleanEmail);
    if (exists) {
      const pos = Math.max(1, activeList.findIndex((e) => e.id === exists.id) + 1);
      return { entry: exists, position: pos };
    }
    const next = sortWaitlistFifo([...workshopWaitlist, localEntry]);
    setWorkshopWaitlist(next);
    try { localStorage.setItem(STORAGE_KEYS.WORKSHOP_WAITLIST, JSON.stringify(next)); } catch {}
    return { entry: localEntry, position: activeList.length + 1 };
  };

  const saveWorkshopWaitlistSettings = async (settings: WorkshopWaitlistSettings) => {
    const clean: WorkshopWaitlistSettings = {
      whatsappNumber: (settings.whatsappNumber || DEFAULT_WAITLIST_SETTINGS.whatsappNumber).trim(),
      whatsappGroupLink: (settings.whatsappGroupLink || '').trim(),
      updatedAt: new Date().toISOString(),
    };
    setWorkshopWaitlistSettings(clean);
    try { localStorage.setItem(STORAGE_KEYS.WORKSHOP_WAITLIST_SETTINGS, JSON.stringify(clean)); } catch {}
    try {
      await fetch('/api/workshop-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_settings', ...clean }),
      });
    } catch {}
  };

  const removeWorkshopWaitlistEntry = (entryId: string) => {
    setWorkshopWaitlist((prev) => {
      const next = prev.filter((e) => e.id !== entryId);
      try { localStorage.setItem(STORAGE_KEYS.WORKSHOP_WAITLIST, JSON.stringify(next)); } catch {}
      return next;
    });
    try {
      fetch(`/api/workshop-waitlist?id=${encodeURIComponent(entryId)}`, { method: 'DELETE' }).catch(() => {});
    } catch {}
  };

  const updateWorkshop = (wsId: string, updatedData: Partial<Workshop>) => {
    let spotJustOpened = false;
    lastLocalWorkshopUpdateRef.current.set(wsId, Date.now());
    setWorkshops((prev) => {
      const previous = prev.find((w) => w.id === wsId);
      const updated = prev.map((w) => (w.id === wsId ? { ...w, ...updatedData } : w));
      try { localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(updated)); } catch {}
      try { syncChannel?.postMessage({ type: 'SYNC_UPDATE', workshops: updated }); } catch {}
      const target = updated.find((w) => w.id === wsId);
      if (target) {
        if (previous && previous.spotsAvailable <= 0 && target.spotsAvailable > 0) {
          spotJustOpened = true;
        }
        try {
          fetch('/api/workshops', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(target),
          }).catch(() => {});
        } catch {}
      }
      return updated;
    });
    if (spotJustOpened) {
      setTimeout(() => { notifyWorkshopWaitlistSpotOpened(wsId); }, 100);
    }
  };

  const resetWorkshopsToDefaults = async () => {
    const clean = deepSanitize(INITIAL_WORKSHOPS);
    setWorkshops(clean);
    try {
      localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(clean));
      await fetch('/api/workshops?reset=true', { method: 'DELETE' });
    } catch {}
  };

  const bookWorkshopDirect = (
    workshop: Workshop,
    quantity: number,
    customerInfo: { name: string; phone: string; email?: string; notes?: string; paymentStatus?: 'pending' | 'paid' }
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
      paymentStatus: customerInfo.paymentStatus || 'pending',
      orderStatus: 'packing',
      items: [
        {
          id: `ord-item-${Date.now()}-0`,
          type: 'workshop',
          workshopId: workshop.id,
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
        if (Array.isArray(data?.workshopUpdates) && data.workshopUpdates.length > 0) {
          applyCloudWorkshopUpdates(data.workshopUpdates);
        }
      })
      .catch(() => {});

    lastLocalWorkshopUpdateRef.current.set(workshop.id, Date.now());
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

    const updatedOrders = [newOrder, ...orders.filter((o) => o.id !== newOrder.id)].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(updatedOrders);
    safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, serializeOrdersForStorage(updatedOrders));
    knownOrderIdsRef.current.add(newOrder.id);
    const isWsOrder = newOrder.items?.some((it) => it.type === 'workshop') || newOrder.id?.startsWith('ord-ws-') || newOrder.orderNumber?.startsWith('#WS');
    const wsItemInOrder = newOrder.items?.find((it) => it.type === 'workshop');
    const isLayOrder = Boolean(newOrder.isLayaway || newOrder.items?.some((it) => it.isLayaway));
    if (canReceiveOrderNotifications(Boolean(isWsOrder), isLayOrder)) {
      playNewOrderChimeSound(0.85);
      showNewOrderAlert({
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        total: newOrder.total,
        isWorkshop: Boolean(isWsOrder),
        workshopTitle: wsItemInOrder?.name,
        isLayaway: isLayOrder,
      });
      sendOrderPushNotification({
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        total: newOrder.total,
        isWorkshop: Boolean(isWsOrder),
        workshopTitle: wsItemInOrder?.name,
        isLayaway: isLayOrder,
      });
    }

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
      (tx) => tx.referenceNumber.trim().toLowerCase() === cleanRef.toLowerCase()
    );

    if (alreadyExists) {
      return {
        success: false,
        duplicate: true,
        message: 'Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.',
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

    // Si es para un taller, descontar 1 cupo disponible local y en D1
    if (newTx.category === 'workshop' && newTx.workshopId) {
      const wsId = newTx.workshopId;
      lastLocalWorkshopUpdateRef.current.set(wsId, Date.now());
      setWorkshops((prev) => {
        const updated = prev.map((w) =>
          w.id === wsId ? { ...w, spotsAvailable: Math.max(0, w.spotsAvailable - 1) } : w
        );
        localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(updated));
        try { syncChannel?.postMessage({ type: 'SYNC_UPDATE', workshops: updated }); } catch {}
        return updated;
      });
      fetch('/api/workshops', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: wsId, title: newTx.workshopTitle, deductSpots: 1 }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((resData) => {
          if (Array.isArray(resData?.workshops)) {
            applyCloudWorkshopUpdates(resData.workshops);
          }
        })
        .catch(() => {});
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

  const validateSinpeReference = (ref: string) => {
    const clean = ref.trim().toLowerCase();
    if (!clean) {
      return { isValid: false, isUsed: false, message: 'Digite el número de referencia de la transferencia.' };
    }
    const existing = sinpeTransactions.find(
      (tx) => tx.referenceNumber.trim().toLowerCase() === clean
    );
    if (existing) {
      return {
        isValid: false,
        isUsed: true,
        message: 'Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.',
        transaction: existing,
      };
    }
    return {
      isValid: true,
      isUsed: false,
      message: 'Comprobante válido y disponible para registrar.',
    };
  };

  const verifySinpePaymentForCheckout = async (
    ref: string,
    requiredTotal: number,
    isSecondVoucher: boolean = false,
    firstVoucherRef?: string
  ): Promise<SinpeCheckoutValidationResult> => {
    const cleanRef = ref.trim().toLowerCase();
    if (!cleanRef) {
      return {
        status: 'not_found',
        message: 'Por favor digite el número de referencia de la transferencia.',
        requiredTotal,
      };
    }

    if (isSecondVoucher && firstVoucherRef && cleanRef === firstVoucherRef.trim().toLowerCase()) {
      return {
        status: 'already_used',
        message: 'Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.',
        requiredTotal,
      };
    }

    // 1. Buscar en la lista local de notificaciones BCR
    let foundTx = sinpeTransactions.find(
      (tx) => tx.referenceNumber.trim().toLowerCase() === cleanRef
    );

    // 2. Si no se encontró localmente, consultar la base de datos de correos en Cloudflare D1
    if (!foundTx) {
      try {
        const res = await fetch(`/api/sinpe-transactions?ref=${encodeURIComponent(cleanRef)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            foundTx = data.find((t: any) => t.referenceNumber.trim().toLowerCase() === cleanRef);
            if (foundTx) {
              setSinpeTransactions((prev) => [foundTx!, ...prev.filter((p) => p.referenceNumber !== foundTx!.referenceNumber)]);
            }
          }
        }
      } catch {}
    }

    // 3. Si no existe en las notificaciones
    if (!foundTx) {
      return {
        status: 'not_found',
        message: `⚠️ No se encontró ninguna notificación con el comprobante #${ref.trim()}. Verifica tu número de comprobante bancario.`,
        requiredTotal,
      };
    }

    // 4. Si ya fue utilizado por una orden previa (solo si single_use_validation está habilitado)
    if (isFeatureEnabled('sinpe', 'single_use_validation')) {
      if (foundTx.orderId) {
        return {
          status: 'already_used',
          message: 'Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.',
          transaction: foundTx,
          requiredTotal,
        };
      }

      const alreadyUsedInOrders = orders.some(
        (o) => o.notes && o.notes.toLowerCase().includes(cleanRef)
      );
      if (alreadyUsedInOrders) {
        return {
          status: 'already_used',
          message: 'Este pago ya fue utilizado, digite correctamente el número de referencia de la transferencia.',
          transaction: foundTx,
          requiredTotal,
        };
      }
    }

    const voucherAmount = foundTx.amount;

    // 5. Comparación de montos (si amount_crosscheck está deshabilitado, se aprueba de inmediato):
    if (!isFeatureEnabled('sinpe', 'amount_crosscheck') || voucherAmount === requiredTotal) {
      return {
        status: 'valid_exact',
        message: `Pago verificado con éxito, comprobante número #${foundTx.referenceNumber} y monto confirmado de ₡${voucherAmount.toLocaleString('es-CR')}.`,
        transaction: foundTx,
        voucherAmount,
        missingAmount: 0,
        requiredTotal,
      };
    }

    if (voucherAmount < requiredTotal) {
      const missingAmount = requiredTotal - voucherAmount;
      return {
        status: 'invalid_incomplete',
        message: `⚠️ Comprobante con monto incompleto. El comprobante #${foundTx.referenceNumber} registra ₡${voucherAmount.toLocaleString('es-CR')}, pero el total a pagar es ₡${requiredTotal.toLocaleString('es-CR')}. Te faltó por pagar ₡${missingAmount.toLocaleString('es-CR')}. Por favor realiza otra transferencia SINPE Móvil y digita el comprobante del faltante.`,
        transaction: foundTx,
        voucherAmount,
        missingAmount,
        requiredTotal,
      };
    }

    return {
      status: 'invalid_mismatch',
      message: `⚠️ Monto inválido. El comprobante #${foundTx.referenceNumber} registra ₡${voucherAmount.toLocaleString('es-CR')}, pero el total a pagar es ₡${requiredTotal.toLocaleString('es-CR')}. El monto y el número de referencia tienen que coincidir exactamente.`,
      transaction: foundTx,
      voucherAmount,
      missingAmount: 0,
      requiredTotal,
    };
  };

  const markSinpeTransactionUsed = (referenceNumber: string, orderId: string) => {
    const cleanRef = referenceNumber.trim().toLowerCase();
    const updated = sinpeTransactions.map((tx) =>
      tx.referenceNumber.trim().toLowerCase() === cleanRef
        ? { ...tx, orderId }
        : tx
    );
    setSinpeTransactions(updated);
    localStorage.setItem(STORAGE_KEYS.SINPE_TRANSACTIONS, JSON.stringify(updated));

    fetch('/api/sinpe-transactions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referenceNumber, orderId }),
    }).catch(() => {});

    try {
      syncChannel?.postMessage({
        type: 'SYNC_UPDATE',
        sinpeTransactions: updated,
      });
    } catch {}
  };

  const simulateBcrEmailNotification = (
    referenceNumber: string,
    amount: number,
    clientName: string = 'Cliente SINPE Móvil BCR'
  ): SinpeTransaction => {
    const newTx: SinpeTransaction = {
      id: `sinpe-sim-${Date.now()}`,
      referenceNumber: referenceNumber.trim(),
      originPhone: '8888-4444',
      originName: clientName.toUpperCase(),
      originBank: 'BANCO DE COSTA RICA',
      amount,
      description: `Pago SINPE notificado por mensajero@bancobcr.com`,
      transactionDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category: 'store',
      status: 'verified',
      rawEmail: `De: mensajero@bancobcr.com\nAsunto: SINPE MÓVIL: Notificación de transacción realizada\nMonto: ₡${amount}\nReferencia: ${referenceNumber}\nOrigen: ${clientName}`,
      createdAt: new Date().toISOString(),
    };

    const nextTxs = [newTx, ...sinpeTransactions.filter(t => t.referenceNumber.trim().toLowerCase() !== referenceNumber.trim().toLowerCase())];
    setSinpeTransactions(nextTxs);
    localStorage.setItem(STORAGE_KEYS.SINPE_TRANSACTIONS, JSON.stringify(nextTxs));

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

    return newTx;
  };

  const updateSinpeSettings = (updates: Partial<SinpeSettings>) => {
    setSinpeSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.SINPE_SETTINGS, JSON.stringify(next));
      lastLocalConfigUpdateRef.current.sinpeSettings = Date.now();
      pushStoreConfig({ sinpeSettings: next });
      try { syncChannel?.postMessage({ type: 'SYNC_UPDATE', sinpeSettings: next }); } catch {}
      return next;
    });
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, serializeOrdersForStorage(updated));
      return updated;
    });
    knownOrderIdsRef.current.delete(orderId);
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`, { method: 'DELETE' });
      const data = res.ok ? await res.json().catch(() => null) : null;
      if (Array.isArray(data?.workshopUpdates) && data.workshopUpdates.length > 0) {
        applyCloudWorkshopUpdates(data.workshopUpdates);
      }
    } catch {}
  };

  const clearAllOrders = async () => {
    setOrders([]);
    safeLocalStorage.setItem(STORAGE_KEYS.ORDERS, "[]");
    knownOrderIdsRef.current.clear();
    try {
      await fetch('/api/orders?all=true', { method: 'DELETE' });
    } catch {}
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
        deleteOrder,
        clearAllOrders,
        cart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
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
        starAlertDuration,
        setStarAlertDuration,
        welcomeStarModal,
        triggerWelcomeStarModal,
        closeWelcomeStarModal,
        isMyAccountOpen,
        setIsMyAccountOpen,
        updateCurrentUserData,
        currentUser,
        loginUser,
        loginWithPin,
        registerUser,
        resetPassword,
        logoutUser,
        isLogoutTransitionOpen,
        appScope,
        setAppScope,
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
        syncRegisteredUsers,
        addCustomerFieldDef,
        deleteCustomerFieldDef,
        createDirectInvoiceOrder,
        cartToast,
        showCartSuccessToast,
        closeCartToast,
        newOrderAlert,
        showNewOrderAlert,
        closeNewOrderAlert,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        pickingMode,
        setPickingMode,
        startPicking,
        markItemPicked,
        unmarkItemPicked,
        markAllItemsPicked,
        markItemMissing,
        updateOrderItemQuantity,
        missingInventoryReports,
        resolveMissingReport,
        deleteMissingReport,
        updateOrderStatus,
        addLayawayPayment,
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
        resetWorkshopsToDefaults,
        workshopWaitlist,
        workshopWaitlistSettings,
        joinWorkshopWaitlist,
        saveWorkshopWaitlistSettings,
        notifyWorkshopWaitlistSpotOpened,
        removeWorkshopWaitlistEntry,
        refreshWorkshopWaitlist,
        bookWorkshopDirect,
        resetToDefaults,
        sinpeTransactions,
        sinpeSettings,
        registerSinpeTransaction,
        validateSinpeReference,
        verifySinpePaymentForCheckout,
        markSinpeTransactionUsed,
        simulateBcrEmailNotification,
        deleteSinpeTransaction,
        updateSinpeSettings,
        isSinpeModalOpen,
        setIsSinpeModalOpen,
        superadminModules,
        isSuperAdminAuthenticated,
        loginSuperAdmin,
        logoutSuperAdmin,
        toggleSuperadminModule,
        toggleSuperadminFeature,
        deactivateSuperadminModuleComplete,
        activateSuperadminModuleComplete,
        resetSuperadminModules,
        setAllSuperadminModules,
        isModuleEnabled,
        isFeatureEnabled,
        agendaItems,
        addAgendaItem,
        updateAgendaItem,
        deleteAgendaItem,
        toggleAgendaItemStatus,
        supplierOrders,
        addSupplierOrder,
        updateSupplierOrder,
        deleteSupplierOrder,
        updateSupplierOrderStatus,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        dailyClosings,
        saveDailyClosing,
        deleteDailyClosing,
        getDailyClosingByDate,
        proposalAcceptances,
        acceptProposal,
        markProposalAcceptanceAsRead,
        updateProposalAcceptanceStatus,
        deleteProposalAcceptance,
        inventoryAdjustments,
        addInventoryAdjustment,
        deleteInventoryAdjustment,
        collaboratorInventoryEnabled,
        toggleCollaboratorInventoryEnabled,
        shelfInventoryStates,
        updateShelfInventoryStatus,
        resetShelvesInventoryStatus,
        sweepEntries,
        sweepLoadMode,
        setSweepLoadMode,
        registerSweepEntry,
        loadSweepEntriesToInventory,
        updateSweepEntryStatus,
        deleteSweepEntry,
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
