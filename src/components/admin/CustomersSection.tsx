import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Customer } from '../../types';
import {
  Users, UserPlus, Search, Phone, Mail, MapPin, FileText, Edit2, User, Clock,
  Trash2, X, Check, ShoppingBag, MessageCircle, CreditCard,
  Calendar, CheckCircle2, AlertCircle, Building2, Crown, Trophy,
  History, ArrowDownWideNarrow, Minus, Plus, Copy, ExternalLink
} from 'lucide-react';
import { formatShortDate, formatCRC, formatDateTime } from '../../utils/formatters';
import {
  CUSTOMER_VIP_THRESHOLD_STORAGE_KEY,
  DEFAULT_VIP_MIN_PURCHASES,
  clampVipThreshold,
  buildCustomerPurchaseMap,
} from '../../utils/customerPurchases';
import { CustomerPurchaseHistoryModal } from './CustomerPurchaseHistoryModal';
import { InteractiveMapPicker } from '../common/InteractiveMapPicker';

interface CustomersSectionProps {
  onSelectCustomerForBilling?: (customer: Customer) => void;
}

export const CustomersSection: React.FC<CustomersSectionProps> = ({ onSelectCustomerForBilling }) => {
  const confirm = useConfirm();
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    syncRegisteredUsers,
    customerFieldDefs,
    orders,
    isFeatureEnabled,
    setInvoiceOrder,
    currentUser,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'top' | 'vip'>('all');
  const [sortMode, setSortMode] = useState<'default' | 'most' | 'least'>('default');
  const [vipMinPurchases, setVipMinPurchases] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_VIP_THRESHOLD_STORAGE_KEY);
      return saved ? clampVipThreshold(saved) : DEFAULT_VIP_MIN_PURCHASES;
    } catch {
      return DEFAULT_VIP_MIN_PURCHASES;
    }
  });
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [copiedWazeCustomerId, setCopiedWazeCustomerId] = useState<string | null>(null);

  const getWazeUrl = (address?: string, lat?: number, lng?: number) => {
    if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
      return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    }
    if (!address || !address.trim()) return '';
    const cleanAddr = address.trim();
    const coordsMatch = cleanAddr.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (coordsMatch) {
      return `https://waze.com/ul?ll=${coordsMatch[1]},${coordsMatch[2]}&navigate=yes`;
    }
    const query = cleanAddr.toLowerCase().includes('costa rica') || cleanAddr.toLowerCase().includes('cr')
      ? cleanAddr
      : `${cleanAddr}, Costa Rica`;
    return `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
  };

  const handleCopyWazeLink = (customerId: string, address?: string, lat?: number, lng?: number) => {
    const url = getWazeUrl(address, lat, lng);
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedWazeCustomerId(customerId);
    setTimeout(() => {
      setCopiedWazeCustomerId((current) => (current === customerId ? null : current));
    }, 2000);
  };

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [customerLat, setCustomerLat] = useState<number | undefined>(undefined);
  const [customerLng, setCustomerLng] = useState<number | undefined>(undefined);
  const [cedula, setCedula] = useState('');
  const [notes, setNotes] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [createdAtDisplay, setCreatedAtDisplay] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<{ [id: string]: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    syncRegisteredUsers();
  }, [syncRegisteredUsers]);

  useEffect(() => {
    let active = true;
    fetch('/api/customer-settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && typeof data.vipMinPurchases === 'number') {
          const clamped = clampVipThreshold(data.vipMinPurchases);
          setVipMinPurchases(clamped);
          try { localStorage.setItem(CUSTOMER_VIP_THRESHOLD_STORAGE_KEY, String(clamped)); } catch {}
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const handleVipThresholdChange = (rawVal: number) => {
    const clamped = clampVipThreshold(rawVal);
    setVipMinPurchases(clamped);
    try { localStorage.setItem(CUSTOMER_VIP_THRESHOLD_STORAGE_KEY, String(clamped)); } catch {}
    fetch('/api/customer-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vipMinPurchases: clamped }),
    }).catch(() => {});
  };

  const purchaseMap = useMemo(
    () => buildCustomerPurchaseMap(customers, orders, vipMinPurchases),
    [customers, orders, vipMinPurchases]
  );

  const buyersCount = useMemo(
    () => customers.filter((c) => (purchaseMap.get(c.id)?.count || 0) > 0).length,
    [customers, purchaseMap]
  );

  const vipCount = useMemo(
    () => customers.filter((c) => purchaseMap.get(c.id)?.isVip).length,
    [customers, purchaseMap]
  );

  // Filtrado reactivo en tiempo real + filtro de más comprados / VIP + ordenamiento por compras
  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = customers.filter((c) => {
      const summary = purchaseMap.get(c.id);
      if (filterMode === 'top' && (!summary || summary.count === 0)) return false;
      if (filterMode === 'vip' && !summary?.isVip) return false;
      if (!q) return true;
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = (c.phone || '').toLowerCase().includes(q);
      const matchEmail = (c.email || '').toLowerCase().includes(q);
      const matchAddress = (c.address || '').toLowerCase().includes(q);
      const matchCedula = (c.customFields?.['field-cedula'] || '').toLowerCase().includes(q);
      const matchNotes = (c.notes || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchEmail || matchAddress || matchCedula || matchNotes;
    });

    const effectiveSort = filterMode === 'top' && sortMode === 'default' ? 'most' : sortMode;
    if (effectiveSort === 'default') return list;

    return [...list].sort((a, b) => {
      const sA = purchaseMap.get(a.id);
      const sB = purchaseMap.get(b.id);
      const cA = sA?.count || 0;
      const cB = sB?.count || 0;
      const tA = sA?.totalSpent || 0;
      const tB = sB?.totalSpent || 0;
      if (effectiveSort === 'most') {
        return cB !== cA ? cB - cA : tB - tA;
      }
      return cA !== cB ? cA - cB : tA - tB;
    });
  }, [customers, searchTerm, filterMode, sortMode, purchaseMap]);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setCustomerLat(undefined);
    setCustomerLng(undefined);
    setCedula('');
    setNotes('');
    setCreatedBy(currentUser?.name || 'Administración (Fio)');
    setCreatedAtDisplay(new Date().toISOString());
    setCustomFieldValues({});
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setPhone(customer.phone || '');
    setEmail(customer.email || '');
    setAddress(customer.address || '');
    setCustomerLat(customer.lat);
    setCustomerLng(customer.lng);
    setCedula(customer.customFields?.['field-cedula'] || '');
    setNotes(customer.notes || '');
    setCreatedBy(customer.createdBy || currentUser?.name || 'Administración (Fio)');
    setCreatedAtDisplay(customer.createdAt || '');
    setCustomFieldValues(customer.customFields ? { ...customer.customFields } : {});
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setFormError('Por favor ingresa el nombre completo del cliente.');
      return;
    }
    if (!cleanPhone) {
      setFormError('Por favor ingresa un número de teléfono o WhatsApp de contacto.');
      return;
    }

    const mergedCustomFields: { [id: string]: string } = {
      ...customFieldValues,
    };
    if (cedula.trim()) {
      mergedCustomFields['field-cedula'] = cedula.trim();
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: cleanName,
        phone: cleanPhone,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        lat: customerLat,
        lng: customerLng,
        notes: notes.trim() || undefined,
        createdBy: createdBy.trim() || editingCustomer.createdBy || currentUser?.name || 'Administración',
        customFields: Object.keys(mergedCustomFields).length > 0 ? mergedCustomFields : undefined,
      });
      setSuccessToast(`Cliente "${cleanName}" actualizado con éxito.`);
    } else {
      addCustomer({
        name: cleanName,
        phone: cleanPhone,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        lat: customerLat,
        lng: customerLng,
        notes: notes.trim() || undefined,
        createdAt: createdAtDisplay || new Date().toISOString(),
        createdBy: createdBy.trim() || currentUser?.name || 'Administración (Fio)',
        customFields: Object.keys(mergedCustomFields).length > 0 ? mergedCustomFields : undefined,
      });
      setSuccessToast(`¡Cliente "${cleanName}" guardado con éxito para futuros pedidos!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (await confirm(`¿Seguro que deseas eliminar a "${customer.name}" del directorio de clientes?`, { title: 'Eliminar Cliente', confirmLabel: 'Eliminar' })) {
      deleteCustomer(customer.id);
      setSuccessToast(`Cliente "${customer.name}" eliminado del directorio.`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Toast Flotante */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 font-bubble font-bold text-xs animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Encabezado Principal del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#F1F2F6] border border-white/80 shadow-neuCard">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bubble font-bold text-lg sm:text-xl text-slate-900 leading-tight">
                Directorio de Clientes Registrados
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shadow-2xs">
                {customers.length} clientes
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Crea y administra la base de datos de clientes con cédula, teléfono y dirección para generar pedidos futuros en 1 clic.
            </p>
          </div>
        </div>

        {isFeatureEnabled('customers', 'customers_create') && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble font-bold text-xs sm:text-sm shadow-neuBtnHover active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Nuevo Cliente</span>
          </button>
        )}
      </div>

      {/* Barra de Búsqueda Rápida */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar cliente por nombre, cédula, teléfono, correo o dirección de entrega..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#ECEEF2] border border-white/80 text-xs sm:text-sm font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-neuInset transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filtros de Compradores, Etiquetas VIP y Ordenamiento por Compras */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F1F2F6] border border-white/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Todos ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('top')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
              filterMode === 'top'
                ? 'bg-fio-purple text-white shadow-xs'
                : 'bg-white text-purple-800 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Más han comprado ({buyersCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('vip')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
              filterMode === 'vip'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-[#2C2746] text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-[#352F54] border border-amber-200 dark:border-amber-500/30'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Solo VIP ({vipCount})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
            <ArrowDownWideNarrow className="w-3.5 h-3.5 text-fio-purple shrink-0" />
            <span className="text-[11px] font-bold text-slate-500">Orden:</span>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as 'default' | 'most' | 'least')}
              className="text-xs font-bubble font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="default">Recientes</option>
              <option value="most">Mayores compras &rarr; Menores</option>
              <option value="least">Menores compras &rarr; Mayores</option>
            </select>
          </div>

          <div
            className="flex items-center gap-1.5 bg-amber-50/90 dark:bg-[#282245] px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-500/30"
            title="Elige cuántas compras debe tener un cliente para ser VIP"
          >
            <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 whitespace-nowrap">VIP mín:</span>
            <button
              type="button"
              onClick={() => handleVipThresholdChange(vipMinPurchases - 1)}
              className="w-5 h-5 rounded-md bg-white dark:bg-[#352F54] hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-500/40 flex items-center justify-center text-amber-800 dark:text-amber-200 cursor-pointer"
              aria-label="Disminuir compras para VIP"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              min={1}
              max={999}
              value={vipMinPurchases}
              onChange={(e) => handleVipThresholdChange(parseInt(e.target.value, 10) || 1)}
              className="w-11 text-center text-xs font-mono font-black text-amber-950 dark:text-white bg-white dark:bg-[#1E1A30] rounded-md border border-amber-200 dark:border-amber-500/40 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={() => handleVipThresholdChange(vipMinPurchases + 1)}
              className="w-5 h-5 rounded-md bg-white dark:bg-[#352F54] hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-500/40 flex items-center justify-center text-amber-800 dark:text-amber-200 cursor-pointer"
              aria-label="Aumentar compras para VIP"
            >
              <Plus className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300">compras</span>
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas de Clientes */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-[#F1F2F6] border border-dashed border-slate-300">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-bubble font-bold text-base text-slate-700">
            {searchTerm || filterMode !== 'all' ? 'No se encontraron clientes con ese criterio' : 'Aún no hay clientes registrados'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {searchTerm || filterMode !== 'all'
              ? 'Prueba limpiando los filtros o ajustando la meta mínima VIP.'
              : 'Haz clic en "Registrar Nuevo Cliente" para guardar el primer contacto y reutilizarlo en futuras ventas.'}
          </p>
          {!searchTerm && filterMode === 'all' && isFeatureEnabled('customers', 'customers_create') && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bubble font-bold text-xs hover:bg-emerald-700 transition-all cursor-pointer shadow-md"
            >
              + Agregar Primer Cliente
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => {
            const summary = purchaseMap.get(cust.id) || { orders: [], count: 0, totalSpent: 0, isVip: false };
            const cedulaVal = cust.customFields?.['field-cedula'];
            const phoneClean = (cust.phone || '').replace(/\D/g, '');

            return (
              <div
                key={cust.id}
                className={`rounded-3xl p-5 bg-[#F1F2F6] shadow-neuCard hover:shadow-neuCardHover transition-all flex flex-col justify-between border ${
                  summary.isVip ? 'border-amber-300 ring-1 ring-amber-200/80' : 'border-white/90'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Fila Superior: Avatar + Nombre + Etiquetas + Compras */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200/60">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fio-purple to-fio-pink text-white font-bubble font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {getInitials(cust.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 truncate" title={cust.name}>
                          {cust.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1 mt-0.5">
                          {summary.isVip && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bubble font-black bg-amber-400 text-amber-950 shadow-2xs">
                              <Crown className="w-2.5 h-2.5" /> VIP
                            </span>
                          )}
                          {summary.topRank && (
                            <span
                              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bubble font-bold ${
                                summary.topRank === 1
                                  ? 'bg-purple-700 text-fio-yellow'
                                  : 'bg-pink-100 text-pink-800 border border-pink-200'
                              }`}
                            >
                              <Trophy className="w-2.5 h-2.5" />
                              {summary.topRank === 1 ? 'Top #1 Más Compras' : `Top #${summary.topRank}`}
                            </span>
                          )}
                          {cedulaVal && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500 bg-white/70 px-1.5 py-0.5 rounded-lg border border-slate-200">
                              <CreditCard className="w-2.5 h-2.5 text-slate-400" />
                              <span>{cedulaVal}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setHistoryCustomer(cust)}
                      className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200 shrink-0 text-right transition-colors cursor-pointer"
                      title="Ver historial completo de compras del cliente"
                    >
                      <div>{summary.count} compra(s)</div>
                      {summary.totalSpent > 0 && (
                        <div className="text-[9px] font-mono text-emerald-700">{formatCRC(summary.totalSpent)}</div>
                      )}
                    </button>
                  </div>

                  {/* Datos de Contacto y Envío */}
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-bold font-mono text-slate-900">{cust.phone || 'Sin teléfono'}</span>
                      {phoneClean && (
                        <a
                          href={`https://wa.me/506${phoneClean}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold transition-colors"
                          title="Escribir por WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>

                    {cust.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-fio-purple shrink-0" />
                        <span className="truncate">{cust.email}</span>
                      </div>
                    )}

                    {(cust.address || (typeof cust.lat === 'number' && typeof cust.lng === 'number')) && (
                      <div className="pt-1 space-y-1.5">
                        <div className="flex items-start gap-2 text-[11px] text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-fio-pink shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <span className="line-clamp-2 leading-relaxed">{cust.address || 'Ubicación fijada con pin en mapa GPS'}</span>
                            {typeof cust.lat === 'number' && typeof cust.lng === 'number' && (
                              <span className="block text-[9px] font-mono text-emerald-700 font-semibold">
                                GPS Pin: {cust.lat.toFixed(5)}, {cust.lng.toFixed(5)}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Botones Waze y Copiar Link para mensajero */}
                        <div className="flex items-center gap-1.5 pl-5">
                          <a
                            href={getWazeUrl(cust.address, cust.lat, cust.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#33CCFF] hover:bg-[#1EBEF5] text-slate-950 font-bubble font-bold text-[11px] shadow-2xs active:scale-95 transition-all cursor-pointer"
                            title="Abrir ubicación en Waze directamente en el navegador"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.34 10.04C18.67 6.59 15.64 4 12 4c-4.41 0-8 3.59-8 8 0 1.25.29 2.43.8 3.49L3.5 19.5l4.31-1.15c1.23.64 2.64 1.01 4.19 1.01 4.41 0 8-3.59 8-8 0-.45-.04-.89-.11-1.32h-.55zM9 13a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
                            </svg>
                            <span>Waze</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleCopyWazeLink(cust.id, cust.address, cust.lat, cust.lng)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bubble font-bold border transition-all active:scale-95 cursor-pointer shadow-2xs ${
                              copiedWazeCustomerId === cust.id
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                            title="Copiar link de Waze para enviárselo a un mensajero"
                          >
                            {copiedWazeCustomerId === cust.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-500" />
                                <span>Copiar link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {cust.notes && (
                      <div className="p-2.5 rounded-xl border mt-1 shadow-2xs customer-notes-pastel-card customer-notes-card bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60">
                        <p className="font-bold flex items-center gap-1 text-[10px] uppercase customer-notes-pastel-title customer-notes-title text-purple-800 dark:text-purple-300">
                          <span>📌 Notas del Cliente:</span>
                        </p>
                        <p className="mt-0.5 font-sans italic font-medium customer-notes-pastel-text customer-notes-text text-purple-950 dark:text-purple-100">{cust.notes}</p>
                      </div>
                    )}

                    {/* Metadatos de Registro: Fecha/Hora y Creado por */}
                    <div className="pt-2 mt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-1.5 text-[10px] text-slate-500">
                      <span className="inline-flex items-center gap-1" title="Fecha y hora de registro del cliente">
                        <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{formatDateTime(cust.createdAt)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-slate-600" title="Usuario o colaborador que registró a este cliente">
                        <User className="w-3 h-3 text-purple-600 shrink-0" />
                        <span>Creado por: <strong className="text-slate-800 font-bold">{cust.createdBy || 'Administración'}</strong></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones al Pie */}
                <div className="pt-3.5 mt-3.5 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  {onSelectCustomerForBilling && isFeatureEnabled('customers', 'customers_quick_order') && (
                    <button
                      type="button"
                      onClick={() => onSelectCustomerForBilling(cust)}
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bubble font-bold text-xs flex items-center justify-center gap-1.5 shadow-neuBtnHover transition-all cursor-pointer"
                      title="Abrir facturación rápida con los datos de este cliente cargados"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-fio-yellow" />
                      <span>Facturar &rarr;</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setHistoryCustomer(cust)}
                      className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs text-[11px] font-bubble font-bold transition-colors cursor-pointer"
                      title="Ver historial de compras del cliente"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Historial</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cust)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-fio-purple border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                      title="Editar ficha del cliente"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomer(cust)}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                      title="Eliminar cliente del sistema"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Registro / Edición de Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-fio-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
            {/* Header Modal */}
            <div className="px-5 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bubble font-bold text-base leading-tight">
                    {editingCustomer ? 'Editar Ficha de Cliente' : 'Registrar Nuevo Cliente'}
                  </h3>
                  <p className="text-[11px] text-emerald-100 font-sans">
                    Quedará guardado en el sistema para futuros pedidos y facturación.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario con scroll independiente y footer fijo */}
            <form onSubmit={handleSaveCustomer} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 space-y-3 sm:space-y-3.5 overflow-y-auto flex-1">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bubble font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Bloque Informativo de Auditoría: Fecha/Hora y Creado por */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-slate-50 border border-emerald-200/70 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-100/80 pb-2">
                    <span className="text-[11px] font-bubble font-bold text-emerald-950 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{editingCustomer ? 'Detalles de Creación de la Ficha' : 'Registro de Nueva Ficha'}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {editingCustomer ? 'Cliente Registrado' : 'Nuevo Ingreso'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Fecha y Hora de Creación */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Fecha y Hora de Creación</span>
                      </label>
                      <div className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-medium text-slate-700 shadow-2xs flex items-center justify-between">
                        <span className="truncate">{formatDateTime(editingCustomer ? editingCustomer.createdAt : createdAtDisplay)}</span>
                        {!editingCustomer && (
                          <span className="text-[9px] text-emerald-700 font-sans font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 ml-1">
                            En vivo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Usuario Creador (Creado por) */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-purple-600" />
                        <span>Creado por</span> <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={createdBy}
                        onChange={(e) => setCreatedBy(e.target.value)}
                        placeholder="Usuario responsable"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-sans font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Nombre Completo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Mariela Chaves Quesada"
                    className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Teléfono y Cédula */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Teléfono / WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: 8899-7711"
                      className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cédula / Identificación
                    </label>
                    <input
                      type="text"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                      placeholder="Ej: 1-1244-0899"
                      className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                {/* Correo Electrónico */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico (opcional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Dirección de Entrega */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dirección de Entrega / Envío (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Provincia, cantón, distrito y señas exactas..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  />
                </div>

                {/* Pin GPS en Mapa Interactivo para Waze */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#1E1A30] border border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-fio-pink" />
                      <span>Ubicación Exacta en el Mapa (Pin GPS para Waze)</span>
                    </label>
                    {typeof customerLat === 'number' && typeof customerLng === 'number' ? (
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                        Pin fijado ({customerLat.toFixed(4)}, {customerLng.toFixed(4)})
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full font-medium">
                        Sin pin en mapa
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Arrastra el pin o toca el mapa para ubicar la casa o negocio. El enlace de Waze llevará al mensajero directamente a este punto.
                  </p>
                  <InteractiveMapPicker
                    lat={typeof customerLat === 'number' ? customerLat : 9.9575}
                    lng={typeof customerLng === 'number' ? customerLng : -84.0818}
                    height="210px"
                    showGpsButton={true}
                    onChange={(coords) => {
                      setCustomerLat(coords.lat);
                      setCustomerLng(coords.lng);
                      if (coords.addressSuggestion && !address.trim()) {
                        setAddress(coords.addressSuggestion);
                      }
                    }}
                  />
                </div>

                {/* Notas del Cliente */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notas / Observaciones de Pedidos (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Preferencias de productos, detalles de entrega, etc..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  />
                </div>
              </div>

              {/* Botones del Modal Fijos en Footer */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 sm:py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bubble font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bubble font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>{editingCustomer ? 'Guardar Cambios' : 'Guardar Cliente'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CustomerPurchaseHistoryModal
        customer={historyCustomer}
        summary={historyCustomer ? purchaseMap.get(historyCustomer.id) || { orders: [], count: 0, totalSpent: 0, isVip: false } : null}
        vipMinPurchases={vipMinPurchases}
        onClose={() => setHistoryCustomer(null)}
        onViewInvoice={(order) => setInvoiceOrder(order)}
        onSelectForBilling={onSelectCustomerForBilling}
      />
    </div>
  );
};
