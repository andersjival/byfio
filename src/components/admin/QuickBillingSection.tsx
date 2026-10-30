import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, Product, PaymentMethod, DeliveryMethod, Customer } from '../../types';
import { formatCRC, formatShortDate, getWhatsAppLink } from '../../utils/formatters';
import {
  Search, FileText, Printer, MessageCircle, CheckCircle2, Clock,
  Plus, Trash2, User, UserPlus, Phone, Mail, MapPin, Tag,
  ShoppingBag, Star, X, Edit3, Settings, Check, CreditCard,
  DollarSign, ArrowRight, UserCheck, Package, Store, Truck
} from 'lucide-react';

interface DirectItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  shelfLocation?: string;
  image?: string;
  customText?: string;
  maxStock: number;
}

export const QuickBillingSection: React.FC = () => {
  const {
    products,
    orders,
    customers,
    customerFieldDefs,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addCustomerFieldDef,
    deleteCustomerFieldDef,
    createDirectInvoiceOrder,
    setInvoiceOrder,
    updateOrderStatus,
  } = useApp();

  // Sub-vistas del módulo
  const [activeTab, setActiveTab] = useState<'create' | 'search' | 'customers'>('create');

  // ==========================================
  // ESTADO: CREAR FACTURA DIRECTA (POS ÁGIL)
  // ==========================================
  // Paso 1: Productos en la factura
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductForAdd, setSelectedProductForAdd] = useState<Product | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [invoiceItems, setInvoiceItems] = useState<DirectItem[]>([]);

  // Paso 2: Datos del pedido y del cliente (se llenan al final)
  const [orderTitle, setOrderTitle] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('retiro');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sinpe');
  const [orderNotes, setOrderNotes] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<{ [fieldId: string]: string }>({});
  const [saveCustomerInDirectory, setSaveCustomerInDirectory] = useState(true);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // ==========================================
  // ESTADO: BUSCAR PEDIDO EXISTENTE
  // ==========================================
  const [searchInput, setSearchInput] = useState('');
  const [selectedExistingOrder, setSelectedExistingOrder] = useState<Order | null>(null);

  // ==========================================
  // ESTADO: DIRECTORIO Y FICHA DE CLIENTES
  // ==========================================
  const [directorySearch, setDirectorySearch] = useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [custModalName, setCustModalName] = useState('');
  const [custModalPhone, setCustModalPhone] = useState('');
  const [custModalEmail, setCustModalEmail] = useState('');
  const [custModalAddress, setCustModalAddress] = useState('');
  const [custModalNotes, setCustModalNotes] = useState('');
  const [custModalFields, setCustModalFields] = useState<{ [fieldId: string]: string }>({});
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);

  // Filtrado de productos para el buscador rápido de Paso 1
  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products.slice(0, 8);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  // Filtrado de clientes para autocompletado en Paso 2
  const matchedCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return [];
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers, customerSearch]);

  // Cálculos de totales
  const subtotal = invoiceItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const shippingFee = deliveryMethod === 'envio' ? 2500 : 0;
  const total = subtotal + shippingFee;

  // Manejadores de ítems de factura
  const handleSelectProduct = (product: Product) => {
    setSelectedProductForAdd(product);
    setQuantityToAdd(1);
  };

  const handleAddItemToInvoice = () => {
    if (!selectedProductForAdd) return;

    const existingIdx = invoiceItems.findIndex((it) => it.sku === selectedProductForAdd.sku);
    if (existingIdx >= 0) {
      const updated = [...invoiceItems];
      updated[existingIdx].quantity += quantityToAdd;
      setInvoiceItems(updated);
    } else {
      const newItem: DirectItem = {
        productId: selectedProductForAdd.id,
        sku: selectedProductForAdd.sku,
        name: selectedProductForAdd.name,
        price: selectedProductForAdd.price,
        quantity: quantityToAdd,
        shelfLocation: selectedProductForAdd.shelfLocation,
        image: selectedProductForAdd.image,
        maxStock: selectedProductForAdd.stock,
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }

    setSelectedProductForAdd(null);
    setProductSearch('');
    setQuantityToAdd(1);
    setCreateError(null);
  };

  const handleUpdateItemQty = (sku: string, delta: number) => {
    setInvoiceItems((prev) =>
      prev
        .map((it) => {
          if (it.sku !== sku) return it;
          const newQty = it.quantity + delta;
          return newQty > 0 ? { ...it, quantity: newQty } : null;
        })
        .filter((it): it is DirectItem => it !== null)
    );
  };

  const handleRemoveItem = (sku: string) => {
    setInvoiceItems((prev) => prev.filter((it) => it.sku !== sku));
  };

  // Autocompletar datos al seleccionar cliente registrado
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setCustomerEmail(customer.email || '');
    if (customer.address) {
      setShippingAddress(customer.address);
      setDeliveryMethod('envio');
    }
    if (customer.customFields) {
      setCustomFieldValues({ ...customer.customFields });
    }
    setCustomerSearch('');
    setCreateError(null);
  };

  const handleClearSelectedCustomer = () => {
    setSelectedCustomer(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setShippingAddress('');
    setCustomFieldValues({});
  };

  // Crear Factura Directa
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (invoiceItems.length === 0) {
      setCreateError('Debes agregar al menos un producto a la factura en el buscador de arriba.');
      return;
    }

    const cleanName = customerName.trim();
    const cleanPhone = customerPhone.trim();

    if (!cleanName || cleanName.length < 2) {
      setCreateError('Por favor ingresa el nombre del cliente para emitir la factura.');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 6) {
      setCreateError('Por favor ingresa un número de teléfono o WhatsApp válido.');
      return;
    }

    if (deliveryMethod === 'envio' && !shippingAddress.trim()) {
      setCreateError('Por favor ingresa la dirección de envío o selecciona Retiro en Taller.');
      return;
    }

    // Si se marcó guardar cliente y no estaba ya seleccionado
    if (saveCustomerInDirectory) {
      if (selectedCustomer) {
        updateCustomer(selectedCustomer.id, {
          name: cleanName,
          phone: cleanPhone,
          email: customerEmail.trim() || undefined,
          address: shippingAddress.trim() || undefined,
          customFields: customFieldValues,
        });
      } else {
        const existing = customers.find(
          (c) => c.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '') ||
                 c.name.toUpperCase() === cleanName.toUpperCase()
        );
        if (existing) {
          updateCustomer(existing.id, {
            name: cleanName,
            phone: cleanPhone,
            email: customerEmail.trim() || undefined,
            address: shippingAddress.trim() || undefined,
            customFields: { ...existing.customFields, ...customFieldValues },
          });
        } else {
          addCustomer({
            name: cleanName,
            phone: cleanPhone,
            email: customerEmail.trim() || undefined,
            address: shippingAddress.trim() || undefined,
            notes: orderNotes.trim() || undefined,
            customFields: customFieldValues,
          });
        }
      }
    }

    // Crear la orden oficial de la factura
    const newOrder = createDirectInvoiceOrder({
      orderTitle: orderTitle.trim() || undefined,
      customerName: cleanName,
      customerPhone: cleanPhone,
      customerEmail: customerEmail.trim() || undefined,
      deliveryMethod,
      shippingAddress: deliveryMethod === 'envio' ? shippingAddress.trim() : undefined,
      paymentMethod,
      notes: orderNotes.trim() || undefined,
      customFields: customFieldValues,
      items: invoiceItems.map((it) => ({
        sku: it.sku,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        shelfLocation: it.shelfLocation,
        image: it.image,
      })),
      subtotal,
      shippingFee,
      total,
    });

    // Resetear formulario para siguiente factura
    setInvoiceItems([]);
    setSelectedCustomer(null);
    setOrderTitle('');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setShippingAddress('');
    setOrderNotes('');
    setCustomFieldValues({});
    setCreateSuccess(`¡Factura ${newOrder.orderNumber} emitida con éxito por ${formatCRC(total)}!`);
    setTimeout(() => setCreateSuccess(null), 4000);
  };

  // Buscar pedido existente
  const handleSearchExisting = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    if (!query) return;

    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.orderNumber.replace(/[^0-9]/g, '').includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.customerPhone.includes(query)
    );

    if (found) {
      setSelectedExistingOrder(found);
    } else {
      alert(`No se encontró ningún pedido con "${searchInput}". Verifica el número.`);
    }
  };

  const handleBillAndOpenExisting = (order: Order) => {
    if (order.orderStatus === 'pending' || order.orderStatus === 'picking') {
      updateOrderStatus(order.id, 'packed');
      setSelectedExistingOrder({ ...order, orderStatus: 'packed' });
    }
    setInvoiceOrder(order);
  };

  // Ficha de cliente: abrir modal
  const handleOpenAddCustomerModal = () => {
    setEditingCustomerId(null);
    setCustModalName('');
    setCustModalPhone('');
    setCustModalEmail('');
    setCustModalAddress('');
    setCustModalNotes('');
    setCustModalFields({});
    setIsCustomerModalOpen(true);
  };

  const handleOpenEditCustomerModal = (customer: Customer) => {
    setEditingCustomerId(customer.id);
    setCustModalName(customer.name);
    setCustModalPhone(customer.phone);
    setCustModalEmail(customer.email || '');
    setCustModalAddress(customer.address || '');
    setCustModalNotes(customer.notes || '');
    setCustModalFields(customer.customFields ? { ...customer.customFields } : {});
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomerModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custModalName.trim() || !custModalPhone.trim()) {
      alert('Por favor completa al menos el nombre y teléfono del cliente.');
      return;
    }

    if (editingCustomerId) {
      updateCustomer(editingCustomerId, {
        name: custModalName.trim(),
        phone: custModalPhone.trim(),
        email: custModalEmail.trim() || undefined,
        address: custModalAddress.trim() || undefined,
        notes: custModalNotes.trim() || undefined,
        customFields: custModalFields,
      });
    } else {
      addCustomer({
        name: custModalName.trim(),
        phone: custModalPhone.trim(),
        email: custModalEmail.trim() || undefined,
        address: custModalAddress.trim() || undefined,
        notes: custModalNotes.trim() || undefined,
        customFields: custModalFields,
      });
    }
    setIsCustomerModalOpen(false);
  };

  // Facturar directo a un cliente desde el directorio
  const handleBillToCustomerDirect = (customer: Customer) => {
    handleSelectCustomer(customer);
    setActiveTab('create');
  };

  // Agregar nuevo campo a la ficha
  const handleAddNewField = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newFieldLabel.trim();
    if (!clean) return;
    addCustomerFieldDef(clean);
    setNewFieldLabel('');
    setIsAddFieldOpen(false);
  };

  return (
    <div className="bg-white dark:bg-[#25203d] rounded-3xl border border-fio-200 dark:border-white/10 shadow-clay p-4 sm:p-6 mb-8 transition-colors">
      {/* Encabezado y Selector de Pestañas del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200/70 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-purple-600 to-fio-pink text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="font-bubble font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
              Módulo de Facturación &amp; POS
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Crea facturas rápidas con buscador de productos y clientes registrados, o procesa pedidos existentes.
          </p>
        </div>

        {/* Botones de Navegación entre Sub-vistas */}
        <div className="flex items-center p-1 rounded-2xl bg-[#ECEEF2] dark:bg-[#1C1830] shadow-neuInset border border-white/60 dark:border-white/10 self-start md:self-auto shrink-0 flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all ${
              activeTab === 'create'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-102'
                : 'text-slate-600 dark:text-slate-300 hover:text-fio-purple hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <Plus className="w-4 h-4 text-fio-yellow shrink-0" />
            <span>Crear Factura Directa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all ${
              activeTab === 'search'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-102'
                : 'text-slate-600 dark:text-slate-300 hover:text-fio-purple hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span>Facturar Pedido Existente</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all ${
              activeTab === 'customers'
                ? 'neu-btn-primary text-white shadow-neuBtnHover scale-102'
                : 'text-slate-600 dark:text-slate-300 hover:text-fio-purple hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span>Ficha de Clientes ({customers.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          PESTAÑA 1: CREAR FACTURA DIRECTA (FLUJO ÁGIL POS)
          ======================================================== */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          {createSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-500 text-white font-bubble font-bold text-xs sm:text-sm flex items-center justify-between shadow-md animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{createSuccess}</span>
              </div>
              <span className="text-[11px] opacity-90">Comprobante generado</span>
            </div>
          )}

          {createError && (
            <div className="p-3 rounded-2xl bg-rose-500 text-white font-bubble font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md animate-fadeIn">
              <X className="w-4 h-4 shrink-0" />
              <span>{createError}</span>
            </div>
          )}

          {/* PASO 1: SELECCIÓN Y BÚSQUEDA DE PRODUCTOS (PRIMER PLANO) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#F8FAFC] dark:bg-[#1E1932] border border-slate-200/80 dark:border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  Buscar &amp; Agregar Productos
                </h3>
              </div>
              <span className="text-[11px] text-fio-purple dark:text-purple-300 font-bold">
                Elige cantidad y presiona agregar para sumar a la factura
              </span>
            </div>

            {/* Buscador de Productos con Autocompletado */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Escribe el nombre del producto, SKU (ej. FIO-AG-01) o categoría..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#2A2444] border border-slate-300/80 dark:border-white/15 text-xs sm:text-sm font-bubble font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-2xs"
                />
                {productSearch && (
                  <button
                    type="button"
                    onClick={() => setProductSearch('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Selector de Producto y Cantidad */}
              {selectedProductForAdd ? (
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedProductForAdd.image}
                      alt={selectedProductForAdd.name}
                      className="w-12 h-12 rounded-xl object-cover border border-purple-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bubble font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {selectedProductForAdd.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300 font-mono">
                        SKU: {selectedProductForAdd.sku} • Stock: {selectedProductForAdd.stock} unidades
                      </p>
                      <p className="text-xs font-bold text-fio-purple dark:text-purple-300 font-bubble">
                        {formatCRC(selectedProductForAdd.price)} c/u
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Control de Cantidad */}
                    <div className="flex items-center border border-purple-300 dark:border-purple-500/40 rounded-xl bg-white dark:bg-[#2A2444] overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))}
                        className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-purple-100 font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={selectedProductForAdd.stock}
                        value={quantityToAdd}
                        onChange={(e) => setQuantityToAdd(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center text-xs font-bold font-mono bg-transparent text-slate-900 dark:text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantityToAdd(Math.min(selectedProductForAdd.stock, quantityToAdd + 1))}
                        className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-purple-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddItemToInvoice}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink text-white font-bubble font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar ({formatCRC(selectedProductForAdd.price * quantityToAdd)})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedProductForAdd(null)}
                      className="p-2 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      title="Cancelar selección"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Resultados Rápidos de Productos */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                  {filteredProducts.slice(0, 4).map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleSelectProduct(prod)}
                      className="p-2.5 rounded-2xl bg-white dark:bg-[#2A2444] hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-slate-200 dark:border-white/10 text-left transition-all flex items-center gap-2.5 shadow-2xs group"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bubble font-bold text-xs text-slate-900 dark:text-white truncate">
                          {prod.name}
                        </h5>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {prod.sku} • Stock: {prod.stock}
                        </p>
                        <p className="text-[11px] font-bold text-fio-purple dark:text-purple-300 font-bubble">
                          {formatCRC(prod.price)}
                        </p>
                      </div>
                      <Plus className="w-4 h-4 text-slate-300 group-hover:text-fio-pink shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* LISTADO DE ÍTEMS EN LA FACTURA */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bubble font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Detalle de la Factura ({invoiceItems.length} ítems)
                </span>
                {invoiceItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setInvoiceItems([])}
                    className="text-[11px] text-rose-500 hover:underline font-bold"
                  >
                    Vaciar Factura
                  </button>
                )}
              </div>

              {invoiceItems.length > 0 ? (
                <div className="divide-y divide-slate-200/80 dark:divide-white/10 bg-white dark:bg-[#2A2444] rounded-2xl border border-slate-200/80 dark:border-white/10 p-2 sm:p-3 shadow-2xs">
                  {invoiceItems.map((it) => (
                    <div key={it.sku} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {it.image && (
                          <img
                            src={it.image}
                            alt={it.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-bubble font-bold text-slate-900 dark:text-white truncate">
                            {it.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {it.sku} • {formatCRC(it.price)} c/u
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center border border-slate-200 dark:border-white/20 rounded-lg overflow-hidden bg-slate-50 dark:bg-[#1E1932]">
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQty(it.sku, -1)}
                            className="px-2 py-0.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-slate-900 dark:text-white">
                            {it.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQty(it.sku, 1)}
                            className="px-2 py-0.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-bubble font-bold text-slate-900 dark:text-white w-20 text-right">
                          {formatCRC(it.price * it.quantity)}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(it.sku)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Resumen Financiero */}
                  <div className="pt-3 mt-2 border-t border-slate-200 dark:border-white/10 space-y-1 text-right">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Subtotal Productos:</span>
                      <span className="font-bold font-mono">{formatCRC(subtotal)}</span>
                    </div>
                    {deliveryMethod === 'envio' && (
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Tarifa de Envío (Correos de CR):</span>
                        <span className="font-bold font-mono">{formatCRC(shippingFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm sm:text-base font-bubble font-extrabold text-slate-900 dark:text-white pt-1 border-t border-slate-100 dark:border-white/10">
                      <span>Total de la Factura:</span>
                      <span className="text-fio-purple dark:text-pink-400">{formatCRC(total)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center rounded-2xl border-2 border-dashed border-purple-200/80 dark:border-white/10 bg-white/80 dark:bg-[#2A2444]/60">
                  <ShoppingBag className="w-7 h-7 mx-auto mb-2 text-fio-purple/50 dark:text-purple-300" />
                  <p className="text-xs sm:text-sm font-bubble font-bold text-slate-700 dark:text-slate-200">
                    Ningún producto agregado a la factura todavía
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Escribe en el buscador de arriba para seleccionar productos y sumarlos al pedido.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PASO 2: DATOS DEL CLIENTE Y ENVÍO (AL FINAL PARA AGILIZAR) */}
          <form onSubmit={handleCreateInvoice} className="p-4 sm:p-5 rounded-3xl bg-[#F8FAFC] dark:bg-[#1E1932] border border-slate-200/80 dark:border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <h3 className="font-bubble font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  Datos del Pedido, Cliente &amp; Envío (Paso Final)
                </h3>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                Llénalos de último para máxima agilidad en el mostrador
              </span>
            </div>

            {/* Buscador de Cliente Registrado */}
            <div className="p-3 rounded-2xl bg-white dark:bg-[#2A2444] border border-purple-200 dark:border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-fio-purple" />
                  <span>¿Cliente ya registrado? Buscar en el sistema:</span>
                </label>
                {selectedCustomer && (
                  <button
                    type="button"
                    onClick={handleClearSelectedCustomer}
                    className="text-[10px] text-rose-500 font-bold hover:underline"
                  >
                    Deseleccionar
                  </button>
                )}
              </div>

              {selectedCustomer ? (
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-purple-900 dark:text-purple-200">
                      Cliente: {selectedCustomer.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-300 ml-2">
                      Tel: {selectedCustomer.phone}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Ficha Jalada ✅
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Escribe nombre, teléfono (ej. 8823-9911) o correo..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E1932] border border-slate-200 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />

                  {matchedCustomers.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#2A2444] rounded-2xl border border-purple-200 dark:border-purple-500/40 shadow-lg z-20 max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-white/10 animate-fadeIn">
                      {matchedCustomers.map((cust) => (
                        <button
                          key={cust.id}
                          type="button"
                          onClick={() => handleSelectCustomer(cust)}
                          className="w-full p-2.5 text-left hover:bg-purple-50 dark:hover:bg-purple-900/40 flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <span className="font-bubble font-bold text-slate-900 dark:text-white block">
                              {cust.name}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-300 font-mono">
                              {cust.phone} {cust.email ? `• ${cust.email}` : ''}
                            </span>
                          </div>
                          <span className="text-[10px] text-fio-purple font-bold">Seleccionar &rarr;</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Formulario de Ficha del Pedido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Nombre del Pedido */}
              <div>
                <label className="text-[11px] font-bubble font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Nombre del Pedido (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej: Pedido Agendas Fio, Stickers..."
                  value={orderTitle}
                  onChange={(e) => setOrderTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-semibold focus:ring-1 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              {/* Nombre del Cliente */}
              <div>
                <label className="text-[11px] font-bubble font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Nombre del Cliente: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-semibold focus:ring-1 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Teléfono / WhatsApp */}
              <div>
                <label className="text-[11px] font-bubble font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Teléfono / WhatsApp: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 8823-9911"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-semibold focus:ring-1 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="text-[11px] font-bubble font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Correo Electrónico (Opcional):
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="cliente@correo.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-semibold focus:ring-1 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Método de Entrega */}
              <div>
                <label className="text-[11px] font-bubble font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Tipo de Entrega:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('retiro')}
                    className={`px-2 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all border flex items-center justify-center gap-1 ${
                      deliveryMethod === 'retiro'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-white dark:bg-[#2A2444] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Retiro en Taller</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('envio')}
                    className={`px-2 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all border flex items-center justify-center gap-1 ${
                      deliveryMethod === 'envio'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-white dark:bg-[#2A2444] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Envío (+₡2,500)</span>
                  </button>
                </div>
              </div>

              {/* Método de Pago */}
              <div>
                <label className="text-[11px] font-bubble font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Método de Pago:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-bubble font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-purple-400 focus:outline-none"
                >
                  <option value="sinpe">SINPE Móvil</option>
                  <option value="efectivo">Efectivo en Tienda</option>
                  <option value="tarjeta">Tarjeta Débito / Crédito</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                </select>
              </div>
            </div>

            {/* Dirección de Envío (si aplica) */}
            {deliveryMethod === 'envio' && (
              <div className="animate-fadeIn">
                <label className="text-[11px] font-bubble font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Dirección Exacta de Envío: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Provincia, cantón, distrito y señas exactas para Correos de Costa Rica..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-semibold focus:ring-1 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Campos Personalizables de la Ficha del Cliente (Configurados por el Admin) */}
            {customerFieldDefs.length > 0 && (
              <div className="p-3 rounded-2xl bg-white dark:bg-[#2A2444] border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300">
                    Datos Adicionales de la Ficha del Cliente:
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('customers')}
                    className="text-[10px] text-fio-purple dark:text-purple-300 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Modificar Campos</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {customerFieldDefs.map((field) => (
                    <div key={field.id}>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                        {field.label}:
                      </label>
                      <input
                        type="text"
                        placeholder={`Ingresa ${field.label.toLowerCase()}`}
                        value={customFieldValues[field.id] || ''}
                        onChange={(e) =>
                          setCustomFieldValues({ ...customFieldValues, [field.id]: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#1E1932] border border-slate-200 dark:border-white/10 text-xs font-semibold focus:ring-1 focus:ring-purple-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notas del Pedido & Casilla de Guardar Cliente */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bubble font-semibold text-slate-700 dark:text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={saveCustomerInDirectory}
                  onChange={(e) => setSaveCustomerInDirectory(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-400 w-4 h-4"
                />
                <span>Guardar o actualizar este cliente en el directorio para futuras compras</span>
              </label>

              {/* Botón Principal para Emitir Factura Oficial */}
              <button
                type="submit"
                disabled={invoiceItems.length === 0}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fio-pink to-purple-700 text-white font-bubble font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <Printer className="w-4 h-4 text-fio-yellow" />
                <span>Crear Pedido &amp; Emitir Factura ({formatCRC(total)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          PESTAÑA 2: FACTURAR PEDIDO EXISTENTE (BÚSQUEDA Y JALE)
          ======================================================== */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <form onSubmit={handleSearchExisting} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ingresa número de orden (ej: #FIO-1001, 1001), nombre o teléfono..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-fio-50/70 dark:bg-[#1E1932] rounded-2xl border border-fio-200 dark:border-white/10 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-fio-400 focus:outline-none text-slate-900 dark:text-white"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-fio-800 hover:bg-fio-900 text-white rounded-2xl font-bubble font-semibold text-xs sm:text-sm shadow-clayBtn transition-all active:scale-95 cursor-pointer"
            >
              Jalar Datos de Pedido
            </button>
          </form>

          {/* Píldoras Rápidas de Pedidos Recientes */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Cargar reciente:</span>
            {orders.slice(0, 6).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSelectedExistingOrder(o);
                  setSearchInput(o.orderNumber);
                }}
                className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-fio-200 text-fio-900 dark:text-purple-200 text-xs font-mono font-bold transition-all border border-purple-200 dark:border-purple-500/30 cursor-pointer"
              >
                {o.orderNumber} ({o.customerName.split(' ')[0]})
              </button>
            ))}
          </div>

          {/* Vista del Pedido Jalado */}
          {selectedExistingOrder ? (
            <div className="p-5 bg-fio-50/60 dark:bg-[#1E1932] rounded-3xl border-2 border-fio-300 dark:border-purple-500/40 animate-fadeIn space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-fio-200 dark:border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-fio-900 bg-white px-3 py-1 rounded-xl border border-fio-200">
                      {selectedExistingOrder.orderNumber}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      Datos Cargados Correctamente ✅
                    </span>
                  </div>
                  <h3 className="font-bubble font-bold text-xl text-gray-800 dark:text-white mt-2">
                    {selectedExistingOrder.customerName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-300">
                    Tel: {selectedExistingOrder.customerPhone} • {formatShortDate(selectedExistingOrder.createdAt)}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-[11px] text-gray-500 dark:text-slate-400 uppercase font-bold">Total Facturable</span>
                  <p className="text-2xl font-bubble font-bold text-fio-900 dark:text-pink-400">
                    {formatCRC(selectedExistingOrder.total)}
                  </p>
                  <p className="text-xs text-gray-400">Método: {selectedExistingOrder.paymentMethod.toUpperCase()}</p>
                </div>
              </div>

              {/* Desglose de Productos */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-fio-800 dark:text-purple-300 uppercase tracking-wider">
                  Productos en esta Factura:
                </p>
                <div className="divide-y divide-fio-100 dark:divide-white/10 bg-white dark:bg-[#2A2444] rounded-2xl p-3 border border-fio-200 dark:border-white/10">
                  {selectedExistingOrder.items.map((it) => (
                    <div key={it.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-gray-800 dark:text-white">
                          {it.quantity}x {it.name}
                        </span>
                        <span className="font-mono text-[10px] text-fio-600 dark:text-purple-300 ml-2">({it.sku})</span>
                      </div>
                      <span className="font-bubble font-bold text-gray-900 dark:text-white">
                        {formatCRC(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de Emisión */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleBillAndOpenExisting(selectedExistingOrder)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-fio-800 hover:bg-fio-900 text-white rounded-2xl font-bubble font-semibold text-xs sm:text-sm shadow-clayBtn transition-all active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-fio-yellow" />
                  <span>Generar &amp; Imprimir Factura Oficial</span>
                </button>

                <a
                  href={getWhatsAppLink(
                    selectedExistingOrder.customerPhone,
                    `¡Hola ${selectedExistingOrder.customerName}! Te adjunto el comprobante oficial de tu pedido ${selectedExistingOrder.orderNumber} por ${formatCRC(selectedExistingOrder.total)} en by.fio.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bubble font-semibold text-xs sm:text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Factura por WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 bg-fio-50/30 dark:bg-[#1E1932]/50 rounded-2xl border border-dashed border-fio-200 dark:border-white/10">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-fio-600" />
              <p className="font-bubble text-sm text-gray-600 dark:text-slate-300">Ningún pedido seleccionado para facturar</p>
              <p className="text-xs text-gray-400 mt-0.5">Escribe el número de orden arriba o toca uno de los pedidos recientes.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          PESTAÑA 3: FICHA DE CLIENTES & CONFIGURACIÓN DE CAMPOS
          ======================================================== */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          {/* SECCIÓN 1: MODIFICAR QUÉ DATOS PEDIR O AGREGAR A LA FICHA */}
          <div className="p-4 sm:p-5 rounded-3xl bg-purple-50/60 dark:bg-[#1E1932] border border-purple-200 dark:border-purple-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/60 dark:border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-fio-purple" />
                <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Campos Personalizables de la Ficha del Cliente
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                El admin puede agregar o quitar qué datos adicionales se piden en la ficha del cliente.
              </p>
            </div>

            {/* Listado de Campos Actuales */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-white dark:bg-[#2A2444] border border-slate-200 text-xs font-bold text-slate-500 dark:text-slate-400">
                Nombre (Obligatorio)
              </span>
              <span className="px-3 py-1 rounded-xl bg-white dark:bg-[#2A2444] border border-slate-200 text-xs font-bold text-slate-500 dark:text-slate-400">
                Teléfono / WhatsApp (Obligatorio)
              </span>
              <span className="px-3 py-1 rounded-xl bg-white dark:bg-[#2A2444] border border-slate-200 text-xs font-bold text-slate-500 dark:text-slate-400">
                Correo Electrónico
              </span>
              <span className="px-3 py-1 rounded-xl bg-white dark:bg-[#2A2444] border border-slate-200 text-xs font-bold text-slate-500 dark:text-slate-400">
                Dirección de Envío
              </span>

              {/* Campos Dinámicos Creados por el Admin */}
              {customerFieldDefs.map((def) => (
                <div
                  key={def.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-500/50 text-xs font-bubble font-bold text-purple-900 dark:text-purple-200 shadow-2xs"
                >
                  <Tag className="w-3 h-3 text-fio-pink" />
                  <span>{def.label}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Eliminar el campo "${def.label}" de la ficha de clientes?`)) {
                        deleteCustomerFieldDef(def.id);
                      }
                    }}
                    className="hover:text-rose-600 transition-colors ml-1 p-0.5"
                    title="Eliminar este campo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Botón para Abrir Formulario de Nuevo Campo */}
              {!isAddFieldOpen ? (
                <button
                  type="button"
                  onClick={() => setIsAddFieldOpen(true)}
                  className="px-3 py-1 rounded-xl border-2 border-dashed border-purple-300 text-fio-purple dark:text-purple-300 hover:bg-purple-100 text-xs font-bubble font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Agregar Campo a la Ficha</span>
                </button>
              ) : (
                <form onSubmit={handleAddNewField} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Nombre del nuevo campo (ej. Cédula Jurídica, Instagram, Empresa)..."
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    className="px-3 py-1 text-xs rounded-xl bg-white dark:bg-[#2A2444] border border-purple-300 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded-xl bg-purple-600 text-white font-bubble text-xs font-bold"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddFieldOpen(false);
                      setNewFieldLabel('');
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* SECCIÓN 2: DIRECTORIO DE CLIENTES */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar en el directorio de clientes (nombre, teléfono o correo)..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1E1932] border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenAddCustomerModal}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fio-pink text-white font-bubble font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Agregar Cliente</span>
              </button>
            </div>

            {/* Listado de Tarjetas de Clientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {customers
                .filter((c) => {
                  const q = directorySearch.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    c.name.toLowerCase().includes(q) ||
                    c.phone.includes(q) ||
                    (c.email && c.email.toLowerCase().includes(q)) ||
                    (c.address && c.address.toLowerCase().includes(q))
                  );
                })
                .map((cust) => (
                  <div
                    key={cust.id}
                    className="p-4 rounded-3xl bg-white dark:bg-[#1E1932] border border-slate-200 dark:border-white/10 shadow-neuCard flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bubble font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                            {cust.name}
                          </h4>
                          <span className="text-[11px] font-mono text-fio-purple dark:text-purple-300 font-bold">
                            Tel: {cust.phone}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCustomerModal(cust)}
                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-purple-900 text-slate-400 hover:text-purple-600"
                            title="Editar ficha de cliente"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`¿Eliminar a ${cust.name} del directorio?`)) {
                                deleteCustomer(cust.id);
                              }
                            }}
                            className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                            title="Eliminar cliente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {cust.email && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{cust.email}</span>
                        </p>
                      )}

                      {cust.address && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 line-clamp-2">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span>{cust.address}</span>
                        </p>
                      )}

                      {/* Campos Dinámicos de su Ficha */}
                      {cust.customFields && Object.keys(cust.customFields).length > 0 && (
                        <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-1">
                          {Object.entries(cust.customFields).map(([fId, val]) => {
                            const def = customerFieldDefs.find((d) => d.id === fId);
                            const label = def ? def.label : fId;
                            if (!val) return null;
                            return (
                              <p key={fId} className="text-[11px] text-slate-600 dark:text-slate-300">
                                <span className="font-bold text-slate-400">{label}:</span> {val}
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBillToCustomerDirect(cust)}
                      className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/70 text-fio-purple dark:text-purple-200 font-bubble font-bold text-xs flex items-center justify-center gap-1.5 border border-purple-200 dark:border-purple-500/30 transition-all active:scale-95 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Facturar a este Cliente &rarr;</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: AGREGAR O EDITAR CLIENTE EN EL DIRECTORIO
          ======================================================== */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-[#1E1932] rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-fio-purple" />
                <h3 className="font-bubble font-bold text-lg text-slate-900 dark:text-white">
                  {editingCustomerId ? 'Editar Ficha de Cliente' : 'Registrar Nuevo Cliente'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomerModal} className="space-y-3">
              <div>
                <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre Completo: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sofía Brenes Mora"
                  value={custModalName}
                  onChange={(e) => setCustModalName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Teléfono / WhatsApp: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 8823-9911"
                    value={custModalPhone}
                    onChange={(e) => setCustModalPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Correo Electrónico:
                  </label>
                  <input
                    type="email"
                    placeholder="cliente@correo.com"
                    value={custModalEmail}
                    onChange={(e) => setCustModalEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Dirección de Envío:
                </label>
                <input
                  type="text"
                  placeholder="Provincia, cantón y señas exactas..."
                  value={custModalAddress}
                  onChange={(e) => setCustModalAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              {/* Campos Dinámicos de la Ficha */}
              {customerFieldDefs.map((def) => (
                <div key={def.id}>
                  <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {def.label}:
                  </label>
                  <input
                    type="text"
                    placeholder={`Ingresa ${def.label.toLowerCase()}...`}
                    value={custModalFields[def.id] || ''}
                    onChange={(e) =>
                      setCustModalFields({ ...custModalFields, [def.id]: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-bubble font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Notas Internas del Cliente:
                </label>
                <textarea
                  rows={2}
                  placeholder="Preferencias de productos, pedidos habituales..."
                  value={custModalNotes}
                  onChange={(e) => setCustModalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#2A2444] border border-slate-200 dark:border-white/15 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink text-white font-bubble font-bold text-xs shadow-xs"
                >
                  Guardar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
