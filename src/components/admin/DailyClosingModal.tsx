import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC, getWhatsAppLink, formatShortDate } from '../../utils/formatters';
import {
  X, Printer, MessageCircle, FileSpreadsheet, Landmark,
  ShoppingBag, GraduationCap, CheckCircle2, Save, Calendar,
  Clock, User, DollarSign, AlertCircle, History, Trash2, ArrowLeft
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { DailyClosingRecord } from '../../types';

interface DailyClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

export const DailyClosingModal: React.FC<DailyClosingModalProps> = ({ isOpen, onClose, initialDate }) => {
  const {
    orders, products, sinpeTransactions, currentUser,
    dailyClosings, saveDailyClosing, deleteDailyClosing, getDailyClosingByDate
  } = useApp();

  const todayStr = new Date().toISOString().slice(0, 10);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || todayStr);

  // Campos interactivos del arqueo
  const [cashCounted, setCashCounted] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Filtros para la pestaña de historial
  const [historyFilterDate, setHistoryFilterDate] = useState<string>('');
  const [historyFilterMonth, setHistoryFilterMonth] = useState<string>('');

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('closing-report-open');
      setSavedSuccess(false);
    } else {
      document.body.classList.remove('closing-report-open');
    }
    return () => {
      document.body.classList.remove('closing-report-open');
    };
  }, [isOpen]);

  // Si ya existe un cierre guardado para la fecha seleccionada, precargar notas y efectivo
  useEffect(() => {
    const existing = getDailyClosingByDate(selectedDate);
    if (existing) {
      setNotes(existing.notes || '');
      setCashCounted(existing.cashCounted !== undefined ? String(existing.cashCounted) : '');
    } else {
      setNotes('');
      setCashCounted('');
    }
    setSavedSuccess(false);
  }, [selectedDate, dailyClosings]);

  if (!isOpen) return null;

  // Filtrar órdenes de la fecha seleccionada
  const dateOrders = orders.filter((o) => {
    try {
      const d = new Date(o.createdAt);
      return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === selectedDate;
    } catch {
      return false;
    }
  });

  // Transacciones SINPE BCR de la fecha seleccionada
  const dateSinpe = sinpeTransactions.filter((tx) => {
    const txDateStr = tx.createdAt ? tx.createdAt.slice(0, 10) : (tx.transactionDate || todayStr);
    return txDateStr === selectedDate;
  });

  const sinpeStoreTotal = dateSinpe
    .filter((tx) => tx.category === 'store')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const sinpeWorkshopTotal = dateSinpe
    .filter((tx) => tx.category === 'workshop')
    .reduce((acc, tx) => acc + tx.amount, 0);

  // División de Órdenes Web (Tienda vs Talleres)
  const storeOrdersRevenue = dateOrders
    .filter((o) => o.items.every((it) => it.type !== 'workshop'))
    .reduce((acc, o) => acc + o.total, 0);

  const workshopOrdersRevenue = dateOrders
    .filter((o) => o.items.some((it) => it.type === 'workshop'))
    .reduce((acc, o) => acc + o.total, 0);

  // Totales de Caja Calculados
  const totalStoreSales = storeOrdersRevenue + sinpeStoreTotal;
  const totalWorkshopSales = workshopOrdersRevenue + sinpeWorkshopTotal;
  const totalCashGrand = totalStoreSales + totalWorkshopSales;

  // Costos y ganancia estimada
  const totalCost = dateOrders.reduce((acc, o) => {
    return (
      acc +
      o.items.reduce((iAcc, it) => {
        const prod = products.find((p) => p.sku === it.sku);
        return iAcc + (prod ? prod.costPrice : it.price * 0.4) * it.quantity;
      }, 0)
    );
  }, 0);

  const netProfit = Math.max(0, totalCashGrand - totalCost);

  const sinpeTotal =
    dateOrders.filter((o) => o.paymentMethod === 'sinpe').reduce((acc, o) => acc + o.total, 0) +
    (sinpeStoreTotal + sinpeWorkshopTotal);

  const otherTotal = dateOrders
    .filter((o) => o.paymentMethod !== 'sinpe')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'picking').length;

  const existingClosing = getDailyClosingByDate(selectedDate);

  // Arqueo físico vs teórico
  const parsedCash = cashCounted.trim() !== '' ? Number(cashCounted) : undefined;
  const difference = parsedCash !== undefined ? parsedCash - totalCashGrand : undefined;

  const handleSaveClosing = () => {
    const closedBy = currentUser?.name || 'ADMINISTRACIÓN';
    saveDailyClosing({
      closingDate: selectedDate,
      closedBy,
      totalCashGrand,
      totalStoreSales,
      totalWorkshopSales,
      sinpeTotal,
      otherTotal,
      netProfit,
      ordersCount: dateOrders.length,
      sinpeCount: dateSinpe.length,
      pendingCount,
      cashCounted: parsedCash,
      difference,
      notes: notes.trim() || undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => window.print();

  const generateWhatsAppMessage = () => {
    let msg = `📊 *ACTA OFICIAL DE CIERRE DE CAJA BY.FIO*\n`;
    msg += `📅 Fecha: ${selectedDate}\n`;
    msg += `👤 Responsable: ${currentUser?.name || 'Administración'}\n\n`;
    msg += `💰 *TOTAL EN CAJA:* ${formatCRC(totalCashGrand)}\n`;
    msg += `  🛍️ *Ventas Tienda & Catálogo:* ${formatCRC(totalStoreSales)}\n`;
    msg += `  🎨 *Ingresos Talleres Creativos:* ${formatCRC(totalWorkshopSales)}\n`;
    msg += `✨ *Ganancia Neta Est.:* ${formatCRC(netProfit)}\n\n`;
    msg += `📲 *SINPE Móvil Total (BCR + Web):* ${formatCRC(sinpeTotal)} (${dateSinpe.length} comprobantes BCR)\n`;
    msg += `🏦 *Otros Medios:* ${formatCRC(otherTotal)}\n`;
    if (parsedCash !== undefined) {
      msg += `💵 *Efectivo Contado:* ${formatCRC(parsedCash)}\n`;
      msg += `⚖️ *Diferencia:* ${difference === 0 ? '✓ Cuadrado Exacto' : formatCRC(difference || 0)}\n`;
    }
    msg += `\n📦 Pedidos atendidos: ${dateOrders.length}\n`;
    if (notes.trim()) {
      msg += `📝 Observaciones: ${notes.trim()}\n`;
    }
    msg += `\n¡Excelente jornada creativa! 💜🇨🇷`;
    return msg;
  };

  // Filtrado de cierres para la pestaña de historial
  const filteredHistory = dailyClosings.filter((c) => {
    if (historyFilterDate && c.closingDate !== historyFilterDate) return false;
    if (historyFilterMonth && !c.closingDate.startsWith(historyFilterMonth)) return false;
    return true;
  });

  return (
    <div className="closing-modal-overlay fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="closing-modal-card relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header Fijo con Selector de Pestañas */}
        <div className="no-print p-4 border-b border-slate-200 bg-[#F1F2F6] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-fio-800 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-4 h-4 text-fio-yellow" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm text-fio-900 leading-tight">
                Cierre de Caja Diario
              </h3>
              <p className="text-[10px] text-slate-500 font-sans">
                Genera, guarda y consulta actas oficiales de arqueo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Píldoras de Cambio de Pestaña */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300/60">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`px-3 py-1 rounded-lg text-xs font-bubble font-bold transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-white text-fio-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cierre del Día
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 rounded-lg text-xs font-bubble font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'history'
                    ? 'bg-white text-fio-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3 h-3" />
                <span>Historial ({dailyClosings.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================
            PESTAÑA 1: REALIZAR / EDITAR CIERRE DE CAJA
            ======================================================== */}
        {activeTab === 'create' && (
          <>
            {/* Barra de Selección de Fecha del Cierre */}
            <div className="no-print p-3 sm:p-4 bg-purple-50/60 border-b border-purple-100/80 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-700" />
                <span className="text-xs font-bold text-purple-950">Fecha de Cierre:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-2.5 py-1 bg-white rounded-xl border border-purple-200 text-xs font-semibold text-slate-800 shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayStr)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bubble font-bold transition-all cursor-pointer ${
                    selectedDate === todayStr
                      ? 'bg-fio-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const y = new Date();
                    y.setDate(y.getDate() - 1);
                    setSelectedDate(y.toISOString().slice(0, 10));
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white text-slate-700 hover:bg-purple-100 border border-purple-200 text-[11px] font-bubble font-bold transition-all cursor-pointer"
                >
                  Ayer
                </button>
              </div>
            </div>

            {/* Aviso si ya existe un cierre guardado para la fecha */}
            {existingClosing && (
              <div className="no-print mx-4 sm:mx-6 mt-3 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Cierre guardado el <strong>{formatShortDate(existingClosing.closedAt)}</strong> por <strong>{existingClosing.closedBy}</strong>.
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200/80 px-2 py-0.5 rounded-full text-emerald-900">
                  Guardado
                </span>
              </div>
            )}

            {/* Contenido Imprimible del Acta */}
            <div id="printable-closing-report" className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
              <div className="flex items-start justify-between border-b border-gray-200 pb-3">
                <div>
                  <BrandLogo size="sm" />
                  <p className="text-[11px] text-gray-500 mt-0.5">Talleres Creativos &amp; Tienda • WhatsApp: 6400-4640</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-800 block">Acta de Cierre de Caja</span>
                  <p className="text-xs font-mono font-bold text-purple-900">{selectedDate}</p>
                  <p className="text-[10px] text-gray-400">Responsable: {existingClosing?.closedBy || currentUser?.name || 'Administración'}</p>
                </div>
              </div>

              {/* Tarjetas Principales de Total y Ganancia */}
              <div className="grid grid-cols-2 gap-3 bg-gradient-to-br from-fio-50 via-purple-50/50 to-white p-3.5 rounded-2xl border border-fio-200">
                <div>
                  <p className="text-gray-500 uppercase text-[10px] font-bold">Total en Caja Teórico:</p>
                  <p className="font-bubble font-bold text-xl sm:text-2xl text-fio-900">{formatCRC(totalCashGrand)}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-[10px] font-bold">Ganancia Neta Estimada:</p>
                  <p className="font-bubble font-bold text-xl sm:text-2xl text-emerald-700">{formatCRC(netProfit)}</p>
                </div>
              </div>

              {/* División Tienda y Catálogo vs Talleres */}
              <div className="space-y-1.5 pt-1">
                <p className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">División de Ingresos:</p>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                    Ventas Tienda &amp; Catálogo
                  </span>
                  <span className="font-bold text-gray-900">{formatCRC(totalStoreSales)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-pink-600" />
                    Ingresos Talleres Creativos
                  </span>
                  <span className="font-bold text-gray-900">{formatCRC(totalWorkshopSales)}</span>
                </div>
              </div>

              {/* Desglose por Medio de Pago */}
              <div className="space-y-1.5 pt-1">
                <p className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Desglose por Canal de Cobro:</p>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Landmark className="w-3.5 h-3.5 text-purple-700" />
                    SINPE Móvil (Banco BCR + Web)
                  </span>
                  <span className="font-bold text-purple-900">{formatCRC(sinpeTotal)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Transferencias y Tarjeta</span>
                  <span className="font-bold text-gray-900">{formatCRC(otherTotal)}</span>
                </div>
              </div>

              {/* Estadísticas Operativas */}
              <div className="space-y-1.5 pt-1">
                <p className="font-bold text-gray-700 uppercase text-[10px] tracking-wider">Métricas Operativas del Día:</p>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Pedidos Ingresados en la Fecha</span>
                  <span className="font-bold text-gray-900">{dateOrders.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Comprobantes BCR SINPE Verificados</span>
                  <span className="font-bold text-purple-900">{dateSinpe.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Pedidos Pendientes de Alisto Globales</span>
                  <span className="font-bold text-fio-pink">{pendingCount}</span>
                </div>
              </div>

              {/* Formulario Interactivo de Arqueo Físico (Visible en pantalla y en reporte) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                    Arqueo de Efectivo Físico &amp; Observaciones:
                  </span>
                  {difference !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        difference === 0
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : difference > 0
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {difference === 0
                        ? '✓ Cuadrado Exacto'
                        : difference > 0
                        ? `Sobrante: +${formatCRC(difference)}`
                        : `Faltante: ${formatCRC(difference)}`}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Monto Real Contado en Caja (₡):
                    </label>
                    <input
                      type="number"
                      placeholder="Ej: 45000"
                      value={cashCounted}
                      onChange={(e) => setCashCounted(e.target.value)}
                      className="no-print w-full px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-fio-400"
                    />
                    <p className="only-print font-bold text-slate-900 text-xs">
                      {parsedCash !== undefined ? formatCRC(parsedCash) : 'No ingresado'}
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Responsable del Cierre:
                    </label>
                    <div className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-fio-pink shrink-0" />
                      <span className="truncate">{existingClosing?.closedBy || currentUser?.name || 'ADMINISTRACIÓN'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Notas / Observaciones del Cierre:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Observaciones de la jornada, justificación de diferencias, etc..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="no-print w-full px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-fio-400 font-sans"
                  />
                  {notes && (
                    <p className="only-print text-xs text-slate-700 italic bg-white p-2 rounded-lg border border-slate-200">
                      "{notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] text-gray-400">
                Documento contable oficial generado por sistema by.fio • Tibás, San José
              </div>
            </div>

            {/* Acciones Fijas al Pie */}
            <div className="no-print p-3 sm:p-4 border-t border-slate-200 bg-gray-50 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveClosing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{existingClosing ? 'Actualizar Cierre Guardado' : 'Guardar Cierre de Caja'}</span>
                </button>

                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-700 animate-fadeIn">
                    ✓ Cierre guardado
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-gray-300 text-gray-700 font-bubble text-xs font-bold shadow-sm hover:bg-gray-100 transition-all active:scale-95 cursor-pointer"
                  title="Imprimir acta o exportar en PDF"
                >
                  <Printer className="w-4 h-4 text-gray-500" />
                  <span>Imprimir</span>
                </button>

                <a
                  href={getWhatsAppLink('64004640', generateWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                  title="Enviar resumen contable por WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-fio-yellow" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </>
        )}

        {/* ========================================================
            PESTAÑA 2: HISTORIAL DE CIERRES ANTERIORES
            ======================================================== */}
        {activeTab === 'history' && (
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[80vh]">
            {/* Barra de Filtros por Día y Fecha */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Filtrar Cierres Guardados:
                </span>
                {(historyFilterDate || historyFilterMonth) && (
                  <button
                    type="button"
                    onClick={() => {
                      setHistoryFilterDate('');
                      setHistoryFilterMonth('');
                    }}
                    className="text-[11px] font-bold text-fio-pink hover:underline self-start sm:self-auto"
                  >
                    Limpiar Filtros
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500">Por Día:</span>
                  <input
                    type="date"
                    value={historyFilterDate}
                    onChange={(e) => {
                      setHistoryFilterDate(e.target.value);
                      setHistoryFilterMonth('');
                    }}
                    className="text-xs font-semibold text-slate-800 bg-transparent outline-none flex-1 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500">Por Mes:</span>
                  <input
                    type="month"
                    value={historyFilterMonth}
                    onChange={(e) => {
                      setHistoryFilterMonth(e.target.value);
                      setHistoryFilterDate('');
                    }}
                    className="text-xs font-semibold text-slate-800 bg-transparent outline-none flex-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Listado de Cierres Guardados */}
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="font-bubble font-bold text-sm text-slate-700">
                  No se encontraron cierres guardados para esta fecha
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Guarda el cierre del día actual desde la pestaña "Cierre del Día" para comenzar a acumular el historial.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white hover:bg-purple-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs sm:text-sm text-fio-900 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                          {item.closingDate}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Cerrado: {formatShortDate(item.closedAt)}
                        </span>
                        <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
                          <User className="w-3 h-3 text-fio-pink" />
                          {item.closedBy}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                        <span>Tienda: <strong>{formatCRC(item.totalStoreSales)}</strong></span>
                        <span>• Talleres: <strong>{formatCRC(item.totalWorkshopSales)}</strong></span>
                        <span>• SINPE: <strong>{formatCRC(item.sinpeTotal)}</strong></span>
                        {item.difference !== undefined && (
                          <span className={item.difference === 0 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                            • Arqueo: {item.difference === 0 ? 'Cuadrado' : formatCRC(item.difference)}
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-slate-500 italic truncate max-w-md">
                          "{item.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <div className="text-right mr-2 hidden sm:block">
                        <div className="font-bubble font-bold text-base text-fio-950">
                          {formatCRC(item.totalCashGrand)}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          +{formatCRC(item.netProfit)} ganancia
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate(item.closingDate);
                          setActiveTab('create');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                        title="Abrir este cierre para ver detalle completo o imprimir"
                      >
                        Ver Acta
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`¿Estás seguro de eliminar el registro de cierre del día ${item.closingDate}?`)) {
                            deleteDailyClosing(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Eliminar este cierre"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
