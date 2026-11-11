import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCRC, formatShortDate, getWhatsAppLink } from '../../utils/formatters';
import { Order, OrderStatus } from '../../types';
import {
  LAYAWAY_SALE_CATEGORY,
  isLayawayReservationOrder,
  isLayawaySaleOrder,
  getOrderSaleCategory,
  formatPaymentMethodLabel,
} from '../../utils/layaway';
import {
  ShoppingBag, Calendar, Search, Eye, X, Phone,
  Truck, Store, CheckCircle2, Clock, MessageCircle,
  Printer, Package, CreditCard, ChevronRight,
  User, DollarSign, Layers, ArrowUpRight,
  FileSpreadsheet, Mail
} from 'lucide-react';

type DateFilterType = 'day' | 'week' | 'month' | 'all';
type DaySubFilter = 'today' | 'yesterday' | 'custom';
type WeekSubFilter = 'current' | 'last7' | 'previous';
type MonthSubFilter = 'current' | 'previous' | 'custom';

export const SalesHistorySection: React.FC = () => {
  const { orders, setInvoiceOrder } = useApp();

  // Estados de Filtros Temporales
  const [filterType, setFilterType] = useState<DateFilterType>('day');
  const [daySubFilter, setDaySubFilter] = useState<DaySubFilter>('today');
  const [customDay, setCustomDay] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const [weekSubFilter, setWeekSubFilter] = useState<WeekSubFilter>('current');

  const [monthSubFilter, setMonthSubFilter] = useState<MonthSubFilter>('current');
  const [customMonth, setCustomMonth] = useState<string>(() => new Date().toISOString().slice(0, 7));

  // Estados de Filtros de Contenido
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'store' | 'layaway_sale' | 'workshop'>('all');

  // Estado del Pedido Seleccionado para Ver Detalle
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Parseo seguro de fechas
  const parseDate = (isoString: string): Date => {
    if (!isoString) return new Date();
    let clean = String(isoString).trim();
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(clean)) {
      clean = clean.replace(' ', 'T') + 'Z';
    }
    const d = new Date(clean);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  // Filtrado de pedidos según período seleccionado
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    // Lunes de la semana actual
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    // Lunes de la semana pasada
    const startOfPrevWeek = new Date(startOfWeek);
    startOfPrevWeek.setDate(startOfWeek.getDate() - 7);
    const endOfPrevWeek = new Date(startOfWeek);
    endOfPrevWeek.setDate(startOfWeek.getDate() - 1);
    endOfPrevWeek.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevYearMonth = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

    return orders.filter((order) => {
      if (isLayawayReservationOrder(order)) return false;

      if (categoryFilter === 'layaway_sale' && !isLayawaySaleOrder(order)) return false;
      if (categoryFilter === 'workshop' && (isLayawaySaleOrder(order) || !order.items.some((it) => it.type === 'workshop'))) return false;
      if (categoryFilter === 'store' && (isLayawaySaleOrder(order) || order.items.some((it) => it.type === 'workshop'))) return false;
      const orderDate = parseDate(order.createdAt);
      const orderDateStr = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;
      const orderMonthStr = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;

      // 1. Filtro Temporal
      if (filterType === 'day') {
        if (daySubFilter === 'today' && orderDateStr !== todayStr) return false;
        if (daySubFilter === 'yesterday' && orderDateStr !== yesterdayStr) return false;
        if (daySubFilter === 'custom' && orderDateStr !== customDay) return false;
      } else if (filterType === 'week') {
        if (weekSubFilter === 'current' && orderDate < startOfWeek) return false;
        if (weekSubFilter === 'last7' && orderDate < sevenDaysAgo) return false;
        if (weekSubFilter === 'previous' && (orderDate < startOfPrevWeek || orderDate > endOfPrevWeek)) return false;
      } else if (filterType === 'month') {
        if (monthSubFilter === 'current' && orderMonthStr !== currentYearMonth) return false;
        if (monthSubFilter === 'previous' && orderMonthStr !== prevYearMonth) return false;
        if (monthSubFilter === 'custom' && orderMonthStr !== customMonth) return false;
      }

      // 2. Filtro de Pago
      if (paymentFilter === 'paid' && order.paymentStatus !== 'paid') return false;
      if (paymentFilter === 'pending' && order.paymentStatus !== 'pending') return false;

      // 3. Filtro de Estado de Pedido
      if (orderStatusFilter !== 'all' && order.orderStatus !== orderStatusFilter) return false;

      // 4. Búsqueda por texto (orden, cliente, teléfono, productos)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchNumber = order.orderNumber.toLowerCase().includes(query);
        const matchCustomer = order.customerName.toLowerCase().includes(query);
        const matchPhone = (order.customerPhone || '').includes(query);
        const matchItems = order.items.some((it) => it.name.toLowerCase().includes(query) || it.sku.toLowerCase().includes(query));
        if (!matchNumber && !matchCustomer && !matchPhone && !matchItems) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, filterType, daySubFilter, customDay, weekSubFilter, monthSubFilter, customMonth, paymentFilter, orderStatusFilter, categoryFilter, searchQuery]);

  // Cálculos de métricas del período
  const metrics = useMemo(() => {
    const totalSales = filteredOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const totalOrdersCount = filteredOrders.length;
    const avgTicket = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;
    const totalItemsCount = filteredOrders.reduce(
      (acc, o) => acc + o.items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0),
      0
    );
    const paidOrdersCount = filteredOrders.filter((o) => o.paymentStatus === 'paid').length;

    const layawaySaleOrders = filteredOrders.filter((o) => isLayawaySaleOrder(o));
    const layawaySalesTotal = layawaySaleOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const layawaySalesCount = layawaySaleOrders.length;

    return { totalSales, totalOrdersCount, avgTicket, totalItemsCount, paidOrdersCount, layawaySalesTotal, layawaySalesCount };
  }, [filteredOrders]);

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>Terminado</span>
          </span>
        );
      case 'packed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Package className="w-3 h-3 text-emerald-600" />
            <span>Empacado</span>
          </span>
        );
      case 'packing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>En Empaque</span>
          </span>
        );
      case 'picking':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 animate-pulse">
            <Clock className="w-3 h-3 text-purple-600" />
            <span>En Alisto QR</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>Pendiente</span>
          </span>
        );
    }
  };

  const exportToCSV = () => {
    if (filteredOrders.length === 0) return;
    const headers = ['Número Orden', 'Categoría', 'Fecha', 'Cliente', 'Teléfono', 'Entrega', 'Método Pago', 'Estado Pago', 'Estado Pedido', 'Artículos', 'Total'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      `"${getOrderSaleCategory(o)}"`,
      formatShortDate(o.createdAt),
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone || ''}"`,
      o.deliveryMethod === 'envio' ? 'Envío' : 'Retiro en Taller',
      formatPaymentMethodLabel(o.paymentMethod),
      o.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente',
      o.orderStatus,
      o.items.reduce((sum, it) => sum + it.quantity, 0),
      o.total,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `historial-ventas-byfio-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Encabezado del Módulo con Título y Botón de Exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-white border border-fio-200/80 shadow-claySm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white flex items-center justify-center shadow-xs shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bubble font-bold text-lg sm:text-xl text-fio-900 leading-tight">
                Historial de Ventas
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {filteredOrders.length} ventas encontradas
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Consulta de pedidos filtrados por día, semana o mes con desglose completo del pedido del cliente.
            </p>
          </div>
        </div>

        {filteredOrders.length > 0 && (
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-fio-50 hover:bg-fio-100 text-fio-900 border border-fio-200/80 font-bubble font-semibold text-xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
            title="Descargar reporte en formato Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Exportar CSV</span>
          </button>
        )}
      </div>

      {/* 2. Pestañas de Filtro Temporal: DÍA, SEMANA, MES, TODO */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#FDFBF9] border border-fio-200/80 shadow-claySm space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Selector de Nivel: Día / Semana / Mes / Todo */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100/90 border border-slate-200/70 shadow-inner self-start">
            <button
              type="button"
              onClick={() => setFilterType('day')}
              className={`px-3.5 py-1.5 rounded-xl font-bubble font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                filterType === 'day'
                  ? 'bg-white text-fio-900 shadow-xs scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Día
            </button>
            <button
              type="button"
              onClick={() => setFilterType('week')}
              className={`px-3.5 py-1.5 rounded-xl font-bubble font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                filterType === 'week'
                  ? 'bg-white text-fio-900 shadow-xs scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Semana
            </button>
            <button
              type="button"
              onClick={() => setFilterType('month')}
              className={`px-3.5 py-1.5 rounded-xl font-bubble font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                filterType === 'month'
                  ? 'bg-white text-fio-900 shadow-xs scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Mes
            </button>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bubble font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-fio-900 shadow-xs scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todo
            </button>
          </div>

          {/* Sub-filtros dinámicos según el tipo seleccionado */}
          <div className="flex flex-wrap items-center gap-2">
            {filterType === 'day' && (
              <>
                <button
                  type="button"
                  onClick={() => setDaySubFilter('today')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                    daySubFilter === 'today'
                      ? 'bg-fio-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-pink-50 border border-slate-200'
                  }`}
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => setDaySubFilter('yesterday')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                    daySubFilter === 'yesterday'
                      ? 'bg-fio-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-pink-50 border border-slate-200'
                  }`}
                >
                  Ayer
                </button>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500">Fecha:</span>
                  <input
                    type="date"
                    value={customDay}
                    onChange={(e) => {
                      setCustomDay(e.target.value);
                      setDaySubFilter('custom');
                    }}
                    className="text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
                  />
                </div>
              </>
            )}

            {filterType === 'week' && (
              <>
                <button
                  type="button"
                  onClick={() => setWeekSubFilter('current')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                    weekSubFilter === 'current'
                      ? 'bg-fio-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-pink-50 border border-slate-200'
                  }`}
                >
                  Esta Semana
                </button>
                <button
                  type="button"
                  onClick={() => setWeekSubFilter('last7')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                    weekSubFilter === 'last7'
                      ? 'bg-fio-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-pink-50 border border-slate-200'
                  }`}
                >
                  Últimos 7 Días
                </button>
                <button
                  type="button"
                  onClick={() => setWeekSubFilter('previous')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                    weekSubFilter === 'previous'
                      ? 'bg-fio-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-pink-50 border border-slate-200'
                  }`}
                >
                  Semana Pasada
                </button>
              </>
            )}

            {filterType === 'month' && (
              <>
                <button
                  type="button"
                  onClick={() => setMonthSubFilter('current')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                    monthSubFilter === 'current'
                      ? 'bg-fio-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-pink-50 border border-slate-200'
                  }`}
                >
                  Este Mes
                </button>
                <button
                  type="button"
                  onClick={() => setMonthSubFilter('previous')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                    monthSubFilter === 'previous'
                      ? 'bg-fio-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-pink-50 border border-slate-200'
                  }`}
                >
                  Mes Pasado
                </button>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500">Mes:</span>
                  <input
                    type="month"
                    value={customMonth}
                    onChange={(e) => {
                      setCustomMonth(e.target.value);
                      setMonthSubFilter('custom');
                    }}
                    className="text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Buscador Rápido y Filtros Secundarios (Pago y Estado) */}
        <div className="pt-2 border-t border-fio-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por # orden, cliente, teléfono o producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-fio-400 focus:outline-none text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Categoría: Todas</option>
              <option value="store">Tienda &amp; Catálogo</option>
              <option value="layaway_sale">{LAYAWAY_SALE_CATEGORY}</option>
              <option value="workshop">Talleres Creativos</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Pago: Todos</option>
              <option value="paid">Solo Pagados</option>
              <option value="pending">Solo Pendientes</option>
            </select>

            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Estado: Todos</option>
              <option value="pending">Pendientes</option>
              <option value="picking">En Alisto QR</option>
              <option value="packing">En Empaque</option>
              <option value="packed">Empacados</option>
              <option value="delivered">Terminados</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Tarjetas de Resumen Financiero del Período */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 shadow-claySm">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ventas Totales</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-bubble font-bold text-xl sm:text-2xl text-emerald-950">
            {formatCRC(metrics.totalSales)}
          </div>
          <p className="text-[10px] text-emerald-700 mt-0.5 font-sans">
            {metrics.paidOrdersCount} pedidos cobrados
            {metrics.layawaySalesCount > 0 && (
              <span className="block text-[10px] font-bold text-purple-800 mt-0.5">
                Incluye {formatCRC(metrics.layawaySalesTotal)} en {LAYAWAY_SALE_CATEGORY} ({metrics.layawaySalesCount})
              </span>
            )}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-50 via-fio-50/50 to-white border border-purple-200/80 shadow-claySm">
          <div className="flex items-center justify-between text-fio-900 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Pedidos</span>
            <ShoppingBag className="w-4 h-4 text-fio-pink" />
          </div>
          <div className="font-bubble font-bold text-xl sm:text-2xl text-fio-950">
            {metrics.totalOrdersCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
            En el período filtrado
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/40 to-white border border-amber-200/80 shadow-claySm">
          <div className="flex items-center justify-between text-amber-900 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ticket Promedio</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-bubble font-bold text-xl sm:text-2xl text-amber-950">
            {formatCRC(metrics.avgTicket)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
            Promedio por venta
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-br from-sky-50 via-blue-50/40 to-white border border-sky-200/80 shadow-claySm">
          <div className="flex items-center justify-between text-sky-900 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Artículos Vendidos</span>
            <Package className="w-4 h-4 text-sky-600" />
          </div>
          <div className="font-bubble font-bold text-xl sm:text-2xl text-sky-950">
            {metrics.totalItemsCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
            Productos y talleres
          </p>
        </div>
      </div>

      {/* 4. Lista de Ventas / Pedidos del Período */}
      <div className="rounded-3xl bg-white border border-fio-200/80 shadow-claySm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-fio-100 flex items-center justify-between bg-[#FDFBF9]">
          <h3 className="font-bubble font-bold text-sm sm:text-base text-fio-900">
            Pedidos del Período ({filteredOrders.length})
          </h3>
          <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
            Haz clic en "Ver Pedido" para inspeccionar todos los artículos y datos del cliente
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h4 className="font-bubble font-bold text-base text-slate-700">
              No se encontraron ventas para este período
            </h4>
            <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
              Prueba cambiando el filtro de fecha o limpiando el buscador para ver ventas anteriores.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterType('all');
                setSearchQuery('');
                setPaymentFilter('all');
                setOrderStatusFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-fio-800 text-white font-bubble font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Ver Todo el Historial
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((order) => {
              const totalItems = order.items.reduce((sum, it) => sum + (it.quantity || 1), 0);

              return (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 hover:bg-pink-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3.5"
                >
                  {/* Columna Izquierda: Número de Orden, Fecha, Cliente y Entrega */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-fio-800 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-purple-200/80">
                      #{order.orderNumber.replace(/[^0-9]/g, '').slice(-3) || 'FIO'}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs sm:text-sm text-fio-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          • {formatShortDate(order.createdAt)}
                        </span>
                        {getOrderStatusBadge(order.orderStatus)}
                        {isLayawaySaleOrder(order) && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                            🏷️ {LAYAWAY_SALE_CATEGORY}
                            {order.layawaySourceOrderNumber ? ` (${order.layawaySourceOrderNumber})` : ''}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-700">
                        <span className="font-semibold text-slate-900 truncate">
                          {order.customerName}
                        </span>
                        {order.customerPhone && (
                          <span className="text-slate-400">
                            ({order.customerPhone})
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                          {order.deliveryMethod === 'envio' ? (
                            <>
                              <Truck className="w-3 h-3 text-fio-pink" />
                              <span>Envío Correos CR</span>
                            </>
                          ) : (
                            <>
                              <Store className="w-3 h-3 text-purple-600" />
                              <span>Retiro en Taller</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Resumen de Artículos de la Orden */}
                      <p className="text-[11px] text-slate-500 truncate max-w-xl">
                        <span className="font-bold text-slate-700">{totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}: </span>
                        {order.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Columna Derecha: Pago, Total y Botón Ver Pedido */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right space-y-0.5">
                      <div className="font-bubble font-bold text-base sm:text-lg text-emerald-950">
                        {formatCRC(order.total)}
                      </div>
                      <div className="flex items-center md:justify-end gap-1.5">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {formatPaymentMethodLabel(order.paymentMethod)}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[9.5px] font-bold ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-semibold text-xs shadow-clayBtn hover:shadow-claySm transition-all active:scale-95 cursor-pointer shrink-0"
                      title="Ver todos los productos y detalles de este pedido"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Pedido</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. MODAL INTERACTIVO: "VER EL PEDIDO QUE EL CLIENTE REALIZÓ" */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-5 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Cabecera del Modal */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-gradient-to-r from-purple-50 via-white to-pink-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-fio-800 text-white flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-5 h-5 text-fio-yellow" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bubble font-bold text-base sm:text-lg text-fio-900">
                      Pedido {selectedOrder.orderNumber}
                    </h3>
                    {getOrderStatusBadge(selectedOrder.orderStatus)}
                    {isLayawaySaleOrder(selectedOrder) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                        🏷️ {LAYAWAY_SALE_CATEGORY}
                        {selectedOrder.layawaySourceOrderNumber ? ` (${selectedOrder.layawaySourceOrderNumber})` : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Realizado el {formatShortDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar detalle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido Scrolleable del Pedido */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
              {/* Bloque: Información del Cliente y Entrega */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-[#FDFBF9] border border-fio-200/70">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Datos del Cliente
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                    <User className="w-4 h-4 text-fio-pink shrink-0" />
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{selectedOrder.customerPhone}</span>
                      <a
                        href={getWhatsAppLink(
                          selectedOrder.customerPhone,
                          `¡Hola ${selectedOrder.customerName}! Te escribimos de by.fio en relación a tu pedido ${selectedOrder.orderNumber}:`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold transition-colors"
                        title="Abrir chat en WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}
                  {selectedOrder.customerEmail && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedOrder.customerEmail}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Método de Entrega
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
                    {selectedOrder.deliveryMethod === 'envio' ? (
                      <>
                        <Truck className="w-4 h-4 text-fio-pink shrink-0" />
                        <span>Envío por Correos de Costa Rica</span>
                      </>
                    ) : (
                      <>
                        <Store className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Retiro Personal en Taller</span>
                      </>
                    )}
                  </div>
                  {selectedOrder.shippingAddress && (
                    <p className="text-xs text-slate-600 font-sans leading-snug">
                      <span className="font-semibold text-slate-700">Dirección: </span>
                      {selectedOrder.shippingAddress}
                    </p>
                  )}
                  {selectedOrder.notes && (
                    <p className="text-xs text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200 leading-snug">
                      <span className="font-bold">Nota del cliente: </span>
                      {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Bloque: Desglose Detallado de Artículos que el Cliente Realizó */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bubble font-bold text-xs sm:text-sm text-fio-900 uppercase tracking-wider">
                    Artículos del Pedido ({selectedOrder.items.reduce((s, it) => s + (it.quantity || 1), 0)})
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Subtotal: {formatCRC(selectedOrder.subtotal)}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 sm:p-3.5 bg-white flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate">
                            {item.name}
                          </h5>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                            <span>SKU: {item.sku || 'N/A'}</span>
                            {item.shelfLocation && <span>• Estante: {item.shelfLocation}</span>}
                            <span>• Cantidad: <strong className="text-slate-900">x{item.quantity}</strong></span>
                          </div>

                          {/* Personalización en foil si el cliente lo indicó */}
                          {item.customText && (
                            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-pink-50 border border-pink-200 text-fio-pink text-[10px] font-bold">
                              <span>✨ Grabado personalizado:</span>
                              <span className="italic">"{item.customText}"</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bubble font-bold text-xs sm:text-sm text-slate-900">
                          {formatCRC(item.price * item.quantity)}
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans">
                          {formatCRC(item.price)} c/u
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloque: Resumen de Totales y Pago */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-[#FDFBF9] border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal de productos:</span>
                  <span className="font-semibold text-slate-800">{formatCRC(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Costo de envío:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedOrder.shippingFee > 0 ? formatCRC(selectedOrder.shippingFee) : '₡0 (Gratis / Retiro)'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Total Cobrado
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Método: {formatPaymentMethodLabel(selectedOrder.paymentMethod)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bubble font-bold text-xl sm:text-2xl text-emerald-900">
                      {formatCRC(selectedOrder.total)}
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedOrder.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedOrder.paymentStatus === 'paid' ? '✓ Pago Acreditado' : '⏳ Pago Pendiente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie del Modal con Acciones */}
            <div className="p-4 border-t border-slate-200/80 bg-[#FDFBF9] flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setInvoiceOrder(selectedOrder);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Ver Comprobante</span>
              </button>

              <div className="w-full sm:w-auto flex items-center justify-end gap-2">
                {selectedOrder.customerPhone && (
                  <a
                    href={getWhatsAppLink(
                      selectedOrder.customerPhone,
                      `¡Hola ${selectedOrder.customerName}! ✨ Tu pedido ${selectedOrder.orderNumber} en by.fio está registrado.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bubble font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bubble font-bold text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
