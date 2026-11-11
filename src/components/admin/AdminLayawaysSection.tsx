import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, LayawayPaymentRecord } from '../../types';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import { calculateLayawayDaysRemaining } from '../../services/layawayReminderService';
import {
  BookmarkCheck,
  Search,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Phone,
  MessageCircle,
  PlusCircle,
  ShoppingBag,
  Receipt,
  ChevronDown,
  User,
  X,
  CreditCard,
  Building2,
  Banknote,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface AdminLayawaysSectionProps {
  onNavigate?: (route: any, tab?: any) => void;
}

export const AdminLayawaysSection: React.FC<AdminLayawaysSectionProps> = () => {
  const { orders, products, addLayawayPayment, currentUser, setInvoiceOrder } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'near_expiry' | 'expired' | 'completed'>('active');

  // Modal para registrar abono manual
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'sinpe' | 'transferencia' | 'tarjeta'>('efectivo');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [expandedHistories, setExpandedHistories] = useState<Set<string>>(new Set());

  // 1. Filtrar solo pedidos que son apartados
  const layawayOrders = useMemo(() => {
    return orders.filter(
      (o) => o.isLayaway || (Array.isArray(o.items) && o.items.some((it) => it.isLayaway))
    );
  }, [orders]);

  // Función para obtener los montos financieros reales de un apartado
  const getOrderFinancials = (order: Order) => {
    const layItem = (order.items && order.items.find((i) => i.isLayaway)) || (order.items && order.items[0]);
    const matchedProduct = layItem
      ? products.find((p) => p.id === layItem.id || (layItem.sku && p.sku === layItem.sku))
      : undefined;
    const catalogPrice = matchedProduct ? matchedProduct.price * (layItem?.quantity || 1) : 0;

    const downPayment =
      (order.layawayDownPaymentAmount && order.layawayDownPaymentAmount > 0 ? Number(order.layawayDownPaymentAmount) : 0) ||
      (layItem?.layawayDownPaymentAmount && layItem.layawayDownPaymentAmount > 0 ? Number(layItem.layawayDownPaymentAmount) : 0) ||
      Number(order.total) ||
      0;

    const explicitRemaining =
      order.layawayRemainingAmount !== undefined && order.layawayRemainingAmount !== null && Number(order.layawayRemainingAmount) > 0
        ? Number(order.layawayRemainingAmount)
        : layItem?.layawayRemainingAmount !== undefined && layItem?.layawayRemainingAmount !== null && Number(layItem.layawayRemainingAmount) > 0
        ? Number(layItem.layawayRemainingAmount)
        : undefined;

    let totalAmount =
      (order.layawayTotalAmount && Number(order.layawayTotalAmount) > downPayment ? Number(order.layawayTotalAmount) : 0) ||
      (layItem?.layawayTotalAmount && Number(layItem.layawayTotalAmount) > downPayment ? Number(layItem.layawayTotalAmount) : 0) ||
      catalogPrice;

    if (!totalAmount && explicitRemaining !== undefined) {
      totalAmount = downPayment + explicitRemaining;
    }
    if (!totalAmount) {
      totalAmount = order.total;
    }

    const remainingDebt =
      explicitRemaining !== undefined
        ? explicitRemaining
        : Math.max(0, totalAmount - downPayment);

    const isFullyPaid = remainingDebt <= 0;
    const countdown = calculateLayawayDaysRemaining(order);

    const rawNum = (order.orderNumber || '').replace(/^#+/, '');
    const cleanOrderNumber = rawNum ? `#${rawNum}` : '#FIO';

    return {
      layItem,
      totalAmount,
      downPayment,
      remainingDebt,
      isFullyPaid,
      countdown,
      cleanOrderNumber,
    };
  };

  // Métricas globales
  const metrics = useMemo(() => {
    let activeCount = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let nearExpiryCount = 0;

    layawayOrders.forEach((o) => {
      const f = getOrderFinancials(o);
      totalCollected += f.downPayment;
      totalPending += f.remainingDebt;

      if (!f.isFullyPaid) {
        activeCount++;
        if (f.countdown.isNearExpiry) {
          nearExpiryCount++;
        }
      }
    });

    return {
      activeCount,
      totalCollected,
      totalPending,
      nearExpiryCount,
    };
  }, [layawayOrders]);

  // Filtrado de la lista
  const filteredOrders = useMemo(() => {
    return layawayOrders.filter((ord) => {
      const f = getOrderFinancials(ord);

      // Filtro de estado
      if (statusFilter === 'active' && f.isFullyPaid) return false;
      if (statusFilter === 'completed' && !f.isFullyPaid) return false;
      if (statusFilter === 'near_expiry' && (f.isFullyPaid || !f.countdown.isNearExpiry)) return false;
      if (statusFilter === 'expired' && (f.isFullyPaid || !f.countdown.isExpired)) return false;

      // Filtro de búsqueda
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const numMatch = f.cleanOrderNumber.toLowerCase().includes(query);
        const nameMatch = (ord.customerName || '').toLowerCase().includes(query);
        const phoneMatch = (ord.customerPhone || '').toLowerCase().includes(query);
        const itemMatch = (f.layItem?.name || '').toLowerCase().includes(query);
        const skuMatch = (f.layItem?.sku || '').toLowerCase().includes(query);

        if (!numMatch && !nameMatch && !phoneMatch && !itemMatch && !skuMatch) {
          return false;
        }
      }

      return true;
    });
  }, [layawayOrders, statusFilter, searchTerm]);

  const toggleHistory = (orderId: string) => {
    setExpandedHistories((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const handleOpenPaymentModal = (order: Order) => {
    const f = getOrderFinancials(order);
    setSelectedOrderForPayment(order);
    setPaymentAmount(Math.min(10000, f.remainingDebt));
    setPaymentMethod('efectivo');
    setPaymentReference('');
    setPaymentNotes('');
    playWaterDropSound();
  };

  const handleRecordManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForPayment || paymentAmount <= 0) return;

    setIsSubmittingPayment(true);
    try {
      const ok = await addLayawayPayment(selectedOrderForPayment.id, {
        amount: paymentAmount,
        paymentMethod,
        reference: paymentReference.trim() || undefined,
        notes: paymentNotes.trim() || undefined,
        registeredBy: currentUser?.name || 'Administración (Fio)',
      });

      if (ok) {
        playBubblePopSound();
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}
        setSelectedOrderForPayment(null);
      }
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-xs">
            <BookmarkCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bubble font-bold text-lg sm:text-xl">
                Gestión de Apartados
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-amber-900 uppercase">
                {metrics.activeCount} Activos
              </span>
            </div>
            <p className="text-xs text-amber-100 font-sans mt-0.5">
              Control de cuotas, saldos pendientes, cobros por recibir y vencimientos en tiempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas Ejecutivas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Apartados Activos */}
        <div className="p-4 rounded-3xl bg-white border border-amber-200/80 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block truncate">
              Apartados Activos
            </span>
            <span className="font-bubble font-bold text-lg sm:text-xl text-slate-800 block">
              {metrics.activeCount}
            </span>
          </div>
        </div>

        {/* Total Recaudado en Abonos */}
        <div className="p-4 rounded-3xl bg-white border border-emerald-200/80 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block truncate">
              Recaudado en Abonos
            </span>
            <span className="font-bubble font-bold text-base sm:text-lg text-emerald-700 block truncate">
              {formatCRC(metrics.totalCollected)}
            </span>
          </div>
        </div>

        {/* Saldo Total por Cobrar */}
        <div className="p-4 rounded-3xl bg-white border border-orange-200/80 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block truncate">
              Saldo Pendiente Total
            </span>
            <span className="font-bubble font-bold text-base sm:text-lg text-amber-900 block truncate">
              {formatCRC(metrics.totalPending)}
            </span>
          </div>
        </div>

        {/* Próximos a Vencer */}
        <div className="p-4 rounded-3xl bg-white border border-rose-200/80 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block truncate">
              Por Vencer (≤ 5 días)
            </span>
            <span className="font-bubble font-bold text-lg sm:text-xl text-rose-700 block">
              {metrics.nearExpiryCount}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, teléfono, número #FIO o producto..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 font-sans text-xs text-slate-800 outline-hidden transition-all"
          />
        </div>

        {/* Pestañas de Estado */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setStatusFilter('active');
              playWaterDropSound();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Activos con Saldo
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter('near_expiry');
              playWaterDropSound();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'near_expiry'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ¡Por Vencer!
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter('expired');
              playWaterDropSound();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'expired'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Vencidos
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter('completed');
              playWaterDropSound();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Liquidados
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              playWaterDropSound();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos ({layawayOrders.length})
          </button>
        </div>
      </div>

      {/* Lista de Apartados */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white border border-slate-200/80 p-6 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center">
            <BookmarkCheck className="w-7 h-7" />
          </div>
          <h3 className="font-bubble font-bold text-base text-slate-800">
            No se encontraron apartados
          </h3>
          <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
            {searchTerm
              ? 'No hay apartados que coincidan con los términos de búsqueda ingresados.'
              : 'No hay pedidos en la vista seleccionada.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const f = getOrderFinancials(order);
            const isHistoryOpen = expandedHistories.has(order.id);
            const payments = order.layawayPayments || (f.layItem?.layawayPayments as LayawayPaymentRecord[]) || [];

            const clientPhoneClean = (order.customerPhone || '').replace(/\D/g, '');
            const reminderWhatsApp = encodeURIComponent(
              `¡Hola ${order.customerName || 'estimado cliente'}! 🌸 Te saludamos de parte de by.fio.\n\n` +
                `Te recordamos que tu apartado *${f.cleanOrderNumber}* de *${f.layItem?.name || 'artículo'}* tiene fecha límite el *${f.countdown.dueDateFormatted}* (${f.countdown.daysRemaining} días restantes).\n\n` +
                `💰 *Saldo pendiente de liquidar:* ${formatCRC(f.remainingDebt)}\n` +
                `📱 *SINPE Móvil:* 64004640 (Fiorella Barahona)\n\n` +
                `¡Cualquier consulta estamos a tu entera disposición! 💕`
            );

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-white border-2 border-amber-200/80 hover:border-amber-300 shadow-sm hover:shadow-md transition-all p-5 sm:p-6 space-y-4"
              >
                {/* Cabecera del Apartado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <BookmarkCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bubble font-bold text-base text-slate-800">
                          Apartado {f.cleanOrderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                          Plan en Cuotas
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>Creado: <strong>{formatShortDate(order.createdAt)}</strong></span>
                      </p>
                    </div>
                  </div>

                  {/* Estado Badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    {f.isFullyPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bubble font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>100% Pagado</span>
                      </span>
                    ) : f.countdown.isExpired ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 text-xs font-bubble font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>Plazo Vencido</span>
                      </span>
                    ) : f.countdown.isNearExpiry ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-300 text-xs font-bubble font-bold animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                        <span>¡Por Vencer! ({f.countdown.daysRemaining} días)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bubble font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Apartado Activo ({f.countdown.daysRemaining} días)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Info del Cliente y Artículo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Datos del Cliente */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <span className="font-bubble font-bold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-600" />
                      <span>Información del Cliente</span>
                    </span>
                    <div className="space-y-1 text-slate-600">
                      <p><strong>Nombre:</strong> {order.customerName}</p>
                      <div className="flex items-center justify-between">
                        <p><strong>Teléfono:</strong> {order.customerPhone || 'No indicado'}</p>
                        {clientPhoneClean && (
                          <div className="flex items-center gap-1">
                            <a
                              href={`https://wa.me/506${clientPhoneClean}?text=${reminderWhatsApp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bubble font-bold text-[11px] flex items-center gap-1 transition-all"
                              title="Enviar recordatorio por WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`tel:${clientPhoneClean}`}
                              className="p-1 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
                              title="Llamar al cliente"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                      {order.customerEmail && <p><strong>Correo:</strong> {order.customerEmail}</p>}
                    </div>
                  </div>

                  {/* Datos del Artículo */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center gap-3">
                    {f.layItem?.image ? (
                      <img
                        src={f.layItem.image}
                        alt={f.layItem.name}
                        className="w-14 h-14 rounded-xl object-cover bg-white shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-bubble font-bold text-sm text-slate-800 truncate">
                        {f.layItem?.name || 'Artículo apartado'}
                      </h4>
                      <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                        SKU: {f.layItem?.sku || 'N/A'} • Cantidad: {f.layItem?.quantity || 1}
                      </p>
                      <p className="text-amber-800 font-medium text-[11px] mt-0.5">
                        Valor total: <strong>{formatCRC(f.totalAmount)}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cajas Financieras */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Valor Contado</span>
                    <span className="font-bubble font-bold text-base text-slate-800 block mt-0.5">{formatCRC(f.totalAmount)}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase block">Total Abonado</span>
                    <span className="font-bubble font-bold text-base text-emerald-700 block mt-0.5">{formatCRC(f.downPayment)}</span>
                  </div>

                  <div className={`p-3 rounded-2xl border text-center ${f.isFullyPaid ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
                    <span className="text-[11px] font-bold uppercase block text-slate-600">Saldo Pendiente</span>
                    <span className="font-bubble font-bold text-base block mt-0.5">{f.isFullyPaid ? '₡0 (Pagado)' : formatCRC(f.remainingDebt)}</span>
                  </div>
                </div>

                {/* Barra de Tiempo */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5 font-bubble font-bold">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Vence: {f.countdown.dueDateFormatted}</span>
                    </span>
                    <span className="font-bold text-amber-900">
                      {f.countdown.isExpired ? 'Plazo expirado' : `${f.countdown.daysRemaining} días restantes`}
                    </span>
                  </div>

                  <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-amber-200">
                    <div
                      className={`h-full rounded-full transition-all ${f.countdown.isExpired ? 'bg-red-500' : f.countdown.isNearExpiry ? 'bg-orange-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.max(5, Math.min(100, f.countdown.progressPercent))}%` }}
                    />
                  </div>
                </div>

                {/* Historial de Abonos */}
                {payments.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <button
                      type="button"
                      onClick={() => toggleHistory(order.id)}
                      className="w-full flex items-center justify-between text-slate-700 font-bubble font-bold cursor-pointer hover:text-amber-700"
                    >
                      <span className="flex items-center gap-1.5">
                        <Receipt className="w-3.5 h-3.5 text-amber-600" />
                        <span>Historial de Abonos ({payments.length})</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isHistoryOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isHistoryOpen && (
                      <div className="space-y-1.5 pt-1.5 border-t border-slate-200 animate-in fade-in">
                        {payments.map((p, idx) => (
                          <div
                            key={p.id || idx}
                            className="flex items-center justify-between py-1 px-2.5 rounded-xl bg-white border border-slate-200 text-[11px]"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bubble font-bold text-emerald-700">{formatCRC(p.amount)}</span>
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] uppercase">
                                {p.paymentMethod}
                              </span>
                              {p.reference && <span className="text-slate-500 font-mono text-[10px]">Ref: #{p.reference}</span>}
                              {p.registeredBy && <span className="text-slate-400 italic text-[10px]">({p.registeredBy})</span>}
                            </div>
                            <span className="text-slate-400">{formatShortDate(p.date)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Acciones del Administrador */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-amber-100">
                  <div className="text-xs text-slate-500">
                    {f.isFullyPaid ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Apartado liquidado al 100%. Listo para entrega al cliente.</span>
                      </span>
                    ) : (
                      <span>Pendiente de cobro: <strong>{formatCRC(f.remainingDebt)}</strong></span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 justify-end flex-wrap">
                    {!f.isFullyPaid && (
                      <button
                        type="button"
                        onClick={() => handleOpenPaymentModal(order)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bubble font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Registrar Abono Manual</span>
                      </button>
                    )}

                    {setInvoiceOrder && (
                      <button
                        type="button"
                        onClick={() => setInvoiceOrder(order)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bubble font-bold text-xs transition-all cursor-pointer"
                      >
                        Ver Factura
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Registro de Abono Manual por parte de la Administradora */}
      {selectedOrderForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5" />
                <h3 className="font-bubble font-bold text-base sm:text-lg">
                  Registrar Abono Manual
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForPayment(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordManualPayment} className="p-5 space-y-4">
              <div>
                <span className="text-xs text-slate-500 block">Cliente:</span>
                <span className="font-bubble font-bold text-sm text-slate-800">
                  {selectedOrderForPayment.customerName} ({getOrderFinancials(selectedOrderForPayment).cleanOrderNumber})
                </span>
                <p className="text-xs text-amber-800 mt-0.5">
                  Saldo adeudado: <strong>{formatCRC(getOrderFinancials(selectedOrderForPayment).remainingDebt)}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monto a Abonar (₡): *
                </label>
                <input
                  type="number"
                  min="1"
                  max={getOrderFinancials(selectedOrderForPayment).remainingDebt}
                  value={paymentAmount || ''}
                  onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 font-mono font-bold text-sm outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Método de Pago:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'efectivo', label: 'Efectivo', icon: Banknote },
                    { id: 'sinpe', label: 'SINPE Móvil', icon: Smartphone },
                    { id: 'transferencia', label: 'Transferencia', icon: Building2 },
                    { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bubble font-bold cursor-pointer ${
                          paymentMethod === m.id
                            ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Número de comprobante / Referencia:
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Ej: SINPE 849204 o Recibo #12"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas u Observaciones (opcional):
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Ej: Pago realizado en persona en taller"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-hidden"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForPayment(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bubble font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment || paymentAmount <= 0}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bubble font-bold shadow-md shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Abonar {formatCRC(paymentAmount)}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
