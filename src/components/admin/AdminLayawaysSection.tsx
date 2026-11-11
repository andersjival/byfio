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
  ChevronUp,
  X,
  CreditCard,
  Building2,
  Banknote,
  Smartphone,
  Sparkles,
  Printer,
  User,
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
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // 1. Filtrar solo pedidos que son apartados
  const layawayOrders = useMemo(() => {
    return orders.filter(
      (o) => o.isLayaway || (Array.isArray(o.items) && o.items.some((it) => it.isLayaway))
    );
  }, [orders]);

  // Función matemática precisa para calcular los saldos reales de un apartado
  const getOrderFinancials = (order: Order) => {
    const layItem = (order.items && order.items.find((i) => i.isLayaway)) || (order.items && order.items[0]);
    const matchedProduct = layItem
      ? products.find((p) => p.id === layItem.id || (layItem.sku && p.sku === layItem.sku))
      : undefined;
    const catalogPrice = matchedProduct ? matchedProduct.price * (layItem?.quantity || 1) : 0;

    const payments: LayawayPaymentRecord[] = Array.isArray(order.layawayPayments) && order.layawayPayments.length > 0
      ? order.layawayPayments
      : (Array.isArray(layItem?.layawayPayments) ? (layItem.layawayPayments as LayawayPaymentRecord[]) : []);

    const sumOfAbonos = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const initialCheckoutPayment = Number(order.total) || 0;

    const downPayment = payments.length > 0
      ? initialCheckoutPayment + sumOfAbonos
      : ((order.layawayDownPaymentAmount && order.layawayDownPaymentAmount > 0 ? Number(order.layawayDownPaymentAmount) : 0) ||
         (layItem?.layawayDownPaymentAmount && layItem.layawayDownPaymentAmount > 0 ? Number(layItem.layawayDownPaymentAmount) : 0) ||
         initialCheckoutPayment);

    let totalAmount =
      (order.layawayTotalAmount && Number(order.layawayTotalAmount) > 0 ? Number(order.layawayTotalAmount) : 0) ||
      (layItem?.layawayTotalAmount && Number(layItem.layawayTotalAmount) > 0 ? Number(layItem.layawayTotalAmount) : 0) ||
      catalogPrice ||
      (Number(layItem?.price) > initialCheckoutPayment ? Number(layItem.price) : 0);

    if (!totalAmount) {
      totalAmount = downPayment + (Number(order.layawayRemainingAmount) || 0);
    }
    if (totalAmount < downPayment) {
      totalAmount = downPayment;
    }

    const remainingDebt = Math.max(0, totalAmount - downPayment);
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
      payments,
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
  }, [layawayOrders, products]);

  // Filtrado de la lista
  const filteredOrders = useMemo(() => {
    return layawayOrders.filter((ord) => {
      const f = getOrderFinancials(ord);

      if (statusFilter === 'active' && f.isFullyPaid) return false;
      if (statusFilter === 'completed' && !f.isFullyPaid) return false;
      if (statusFilter === 'near_expiry' && (f.isFullyPaid || !f.countdown.isNearExpiry)) return false;
      if (statusFilter === 'expired' && (f.isFullyPaid || !f.countdown.isExpired)) return false;

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
  }, [layawayOrders, statusFilter, searchTerm, products]);

  const toggleExpand = (orderId: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
    playWaterDropSound();
  };

  const handleOpenPaymentModal = (order: Order) => {
    const f = getOrderFinancials(order);
    setSelectedOrderForPayment(order);
    setPaymentAmount(Math.min(5000, f.remainingDebt));
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
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Encabezado Principal Compacto */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#E6D4FB] via-[#F3D9FA] to-[#FBD5E8] border border-purple-200/90 text-purple-950 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/75 backdrop-blur-xs border border-purple-200/70 flex items-center justify-center text-fio-pink shrink-0 shadow-2xs">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bubble font-bold text-base sm:text-lg text-purple-950">
                Gestión de Apartados
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-purple-900 border border-purple-200/80 uppercase">
                {metrics.activeCount} Activos
              </span>
            </div>
            <p className="text-[11px] text-purple-800/90 font-sans">
              Control de cuotas, saldos pendientes y registro de abonos.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas Ejecutivas Compactas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 rounded-2xl bg-white border border-amber-200 shadow-2xs flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block truncate">
              Apartados Activos
            </span>
            <span className="font-bubble font-bold text-base sm:text-lg text-slate-800 block">
              {metrics.activeCount}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-emerald-200 shadow-2xs flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block truncate">
              Recaudado Abonos
            </span>
            <span className="font-bubble font-bold text-sm sm:text-base text-emerald-700 block truncate">
              {formatCRC(metrics.totalCollected)}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-orange-200 shadow-2xs flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block truncate">
              Saldo Pendiente
            </span>
            <span className="font-bubble font-bold text-sm sm:text-base text-amber-900 block truncate">
              {formatCRC(metrics.totalPending)}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-rose-200 shadow-2xs flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block truncate">
              Por Vencer (≤ 5d)
            </span>
            <span className="font-bubble font-bold text-base sm:text-lg text-rose-700 block">
              {metrics.nearExpiryCount}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda Compacta */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente, teléfono, #FIO o producto..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 font-sans text-xs text-slate-800 outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
          {[
            { id: 'active', label: 'Activos' },
            { id: 'near_expiry', label: 'Por Vencer' },
            { id: 'expired', label: 'Vencidos' },
            { id: 'completed', label: 'Liquidados' },
            { id: 'all', label: `Todos (${layawayOrders.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id as any);
                playWaterDropSound();
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bubble font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Apartados con Etiquetas Chiquitas y Compactas */}
      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-white border border-slate-200 p-6 space-y-2">
          <BookmarkCheck className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-bubble font-bold text-sm text-slate-800">
            No se encontraron apartados
          </h3>
          <p className="text-xs text-slate-400">
            {searchTerm ? 'No hay resultados con esa búsqueda.' : 'No hay pedidos en este filtro.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredOrders.map((order) => {
            const f = getOrderFinancials(order);
            const isExpanded = expandedCards.has(order.id);
            const clientPhoneClean = (order.customerPhone || '').replace(/\D/g, '');

            const reminderWhatsApp = encodeURIComponent(
              `¡Hola ${order.customerName || 'estimado cliente'}! 🌸 Te saludamos de by.fio.\n\n` +
                `Te recordamos que tu apartado *${f.cleanOrderNumber}* de *${f.layItem?.name || 'artículo'}* tiene fecha límite el *${f.countdown.dueDateFormatted}* (${f.countdown.daysRemaining} días restantes).\n\n` +
                `💰 *Saldo pendiente:* ${formatCRC(f.remainingDebt)}\n` +
                `📱 *SINPE Móvil:* 64004640 (Fiorella Barahona)\n\n` +
                `¡Muchas gracias! 💕`
            );

            return (
              <div
                key={order.id}
                className="rounded-2xl bg-white border border-amber-200 hover:border-amber-400/80 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
              >
                {/* Fila Principal Compacta (Barra compacta en una sola vista) */}
                <div className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Bloque Izquierdo: Foto y Datos del Cliente */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    {f.layItem?.image ? (
                      <img
                        src={f.layItem.image}
                        alt={f.layItem.name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bubble font-bold text-sm text-slate-800">
                          Apartado {f.cleanOrderNumber}
                        </span>

                        {f.isFullyPaid ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            ✓ 100% Pagado
                          </span>
                        ) : f.countdown.isExpired ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                            Vencido
                          </span>
                        ) : f.countdown.isNearExpiry ? (
                          <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-bold animate-pulse">
                            ¡Por vencer! ({f.countdown.daysRemaining}d)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Activo • {f.countdown.daysRemaining}d
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                        <span className="font-medium text-slate-700 truncate">
                          {order.customerName}
                        </span>
                        {clientPhoneClean && (
                          <span className="font-mono text-[11px] text-slate-400">
                            • {order.customerPhone}
                          </span>
                        )}
                        <span className="text-slate-400 truncate">
                          • {f.layItem?.name || 'Artículo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bloque Central y Derecho: Píldoras Financieras y Acciones Compactas */}
                  <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Píldoras de Montos */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 font-sans text-[11px] hidden sm:inline" title="Precio total de contado">
                        Total: <strong>{formatCRC(f.totalAmount)}</strong>
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium text-[11px]" title="Total abonado a la fecha">
                        Abonado: <strong>{formatCRC(f.downPayment)}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-bubble font-bold text-xs" title="Saldo pendiente que debe">
                        Debe: {f.isFullyPaid ? '₡0' : formatCRC(f.remainingDebt)}
                      </span>
                    </div>

                    {/* Botones de Acción Chiquitos */}
                    <div className="flex items-center gap-1">
                      {!f.isFullyPaid && (
                        <button
                          type="button"
                          onClick={() => handleOpenPaymentModal(order)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bubble font-bold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                          title="Registrar abono de dinero"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Abonar</span>
                        </button>
                      )}

                      {clientPhoneClean && (
                        <a
                          href={`https://wa.me/506${clientPhoneClean}?text=${reminderWhatsApp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all"
                          title="Contactar o recordar por WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {setInvoiceOrder && (
                        <button
                          type="button"
                          onClick={() => setInvoiceOrder(order)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all cursor-pointer"
                          title="Ver Factura"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Botón para desplegar detalles */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 transition-all cursor-pointer"
                        title={isExpanded ? 'Ocultar detalles' : 'Ver detalles e historial'}
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sección Desplegable Opcional: Historial y Barra de Tiempo */}
                {isExpanded && (
                  <div className="p-3 bg-amber-50/40 border-t border-amber-100 space-y-2 text-xs animate-in slide-in-from-top-1">
                    {/* Barra de Tiempo Compacta */}
                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        <span>Vencimiento: <strong>{f.countdown.dueDateFormatted}</strong></span>
                      </span>
                      <span className="font-bold text-amber-800">
                        {f.countdown.isExpired ? 'Plazo expirado' : `${f.countdown.daysRemaining} días restantes`}
                      </span>
                    </div>

                    <div className="w-full bg-white rounded-full h-1.5 overflow-hidden border border-amber-200">
                      <div
                        className={`h-full rounded-full ${
                          f.countdown.isExpired ? 'bg-red-500' : f.countdown.isNearExpiry ? 'bg-orange-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.max(5, Math.min(100, f.countdown.progressPercent))}%` }}
                      />
                    </div>

                    {/* Historial de Abonos si existen */}
                    {f.payments.length > 0 ? (
                      <div className="pt-1.5 border-t border-amber-200/60 space-y-1">
                        <span className="font-bubble font-bold text-slate-700 text-[11px] block">
                          Historial de Pagos ({f.payments.length}):
                        </span>
                        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                          {f.payments.map((p, idx) => (
                            <div
                              key={p.id || idx}
                              className="flex items-center justify-between py-1 px-2 rounded-lg bg-white border border-amber-200/70 text-[11px]"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bubble font-bold text-emerald-700">{formatCRC(p.amount)}</span>
                                <span className="px-1 py-0.2 rounded-sm bg-slate-100 text-slate-600 font-mono text-[9px] uppercase">
                                  {p.paymentMethod}
                                </span>
                                {p.reference && <span className="text-slate-400 font-mono text-[10px]">Ref: #{p.reference}</span>}
                                {p.registeredBy && <span className="text-slate-400 italic text-[10px]">({p.registeredBy})</span>}
                              </div>
                              <span className="text-slate-400">{formatShortDate(p.date)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 pt-1">
                        No hay abonos adicionales registrados aún (solo el anticipo inicial de {formatCRC(order.total)}).
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Compacto de Registro de Abono Manual */}
      {selectedOrderForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4" />
                <h3 className="font-bubble font-bold text-sm sm:text-base">
                  Registrar Abono Manual
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForPayment(null)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleRecordManualPayment} className="p-4 space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-slate-500 block">Cliente:</span>
                <span className="font-bubble font-bold text-slate-800 text-sm block">
                  {selectedOrderForPayment.customerName} ({getOrderFinancials(selectedOrderForPayment).cleanOrderNumber})
                </span>
                <span className="text-amber-900 font-bold block mt-0.5">
                  Saldo actual: {formatCRC(getOrderFinancials(selectedOrderForPayment).remainingDebt)}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Monto a Abonar (₡): *
                </label>
                <input
                  type="number"
                  min="1"
                  max={getOrderFinancials(selectedOrderForPayment).remainingDebt}
                  value={paymentAmount || ''}
                  onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 font-mono font-bold text-sm outline-hidden"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Saldo resultante: <strong>{formatCRC(Math.max(0, getOrderFinancials(selectedOrderForPayment).remainingDebt - paymentAmount))}</strong>
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Método de Pago:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'efectivo', label: 'Efectivo', icon: Banknote },
                    { id: 'sinpe', label: 'SINPE', icon: Smartphone },
                    { id: 'transferencia', label: 'Transferencia', icon: Building2 },
                    { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-bubble font-bold cursor-pointer text-xs ${
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
                <label className="block font-bold text-slate-700 mb-1">
                  Comprobante / Referencia:
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Ej: Recibo 12 o SINPE 849204"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs outline-hidden"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForPayment(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bubble font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment || paymentAmount <= 0}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bubble font-bold shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
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
