import React, { createContext, useContext, useState, useEffect } from 'react';
import { ViewMode, Product, Workshop, Order, CartItem, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_WORKSHOPS, INITIAL_ORDERS } from '../utils/seedData';
import { playAudioBeep } from '../utils/formatters';

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  products: Product[];
  workshops: Workshop[];
  orders: Order[];
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
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
  deleteProduct: (productId: string) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'byfio_products_v1',
  ORDERS: 'byfio_orders_v1',
  CART: 'byfio_cart_v1',
  VIEW_MODE: 'byfio_view_mode_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as ViewMode) || 'store';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [workshops] = useState<Workshop[]>(INITIAL_WORKSHOPS);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activePickingOrder, setActivePickingOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [qrModalProduct, setQrModalProduct] = useState<Product | null>(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

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
    setIsCartOpen(true);
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

    setProducts((prev) =>
      prev.map((prod) => {
        const inCart = cart.find((c) => c.sku === prod.sku);
        if (inCart) {
          const newStock = Math.max(0, prod.stock - inCart.quantity);
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
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: newStatus,
              packedAt: newStatus === 'packed' ? new Date().toISOString() : o.packedAt,
            }
          : o
      )
    );
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
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
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
        deleteProduct,
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
