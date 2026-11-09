import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus, OrderItem, AppRoute, UserProfile } from '../../types';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import {
  PackageCheck, Search, CheckCircle2, Clock, Phone, MapPin,
  Bell, BellRing, Volume2, Smartphone,
  CreditCard, Shield, ShieldCheck, KeyRound, LogOut, RefreshCw,
  Store, Boxes, ChevronDown, ChevronUp, Copy, MessageCircle,
  Check, Truck, Tag, Calendar, AlertCircle, Sparkles, X, User, UserCheck,
  Scan, Edit3, Home
} from 'lucide-react';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';
import {
  getPushPermission,
  requestPushNotificationPermission,
  testPushAndSoundAlert,
  isPushSupported
} from '../../utils/pushNotifications';
import { AdminMobileDock } from '../admin/AdminMobileDock';

interface MobileOrdersViewProps {
  onNavigate: (route: AppRoute, tab?: any) => void;
}

export const MobileOrdersView: React.FC<MobileOrdersViewProps> = ({ onNavigate }) => {
  const {
    orders,
    updateOrderStatus,
    markItemPicked,
    unmarkItemPicked,
    markAllItemsPicked,
    updateOrderItemQuantity,
    currentUser,
    loginWithPin,
    logoutUser,
    userProfiles,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'packing' | 'packed' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedAddressId, setCopiedAddressId] = useState<string | null>(null);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(() => getPushPermission());
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [scanNotification, setScanNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editingItemData, setEditingItemData] = useState<{ orderId: string; itemSku: string; itemName: string; currentQty: number } | null>(null);
  const [tempQty, setTempQty] = useState<number>(1);

  // Soporte de Escaneo de Códigos de Barra / SKU en la vista móvil de pedidos
  const handleProcessBarcodeScan = (scannedText: string) => {
    const rawSku = scannedText.trim();
    if (!rawSku) return;

    // Buscar primero en el pedido actualmente abierto o en pedidos pendientes
    let targetOrder = orders.find(
      (o) => o.id === expandedOrderId && o.items?.some((it) => it.sku.toLowerCase() === rawSku.toLowerCase() && !it.isPicked)
    );

    if (!targetOrder) {
      targetOrder = orders.find(
        (o) => !isOrderFullyAlistado(o) && o.items?.some((it) => it.sku.toLowerCase() === rawSku.toLowerCase() && !it.isPicked)
      );
    }

    if (targetOrder) {
      const res = markItemPicked(targetOrder.id, rawSku, currentUser?.name);
      if (res && res.error) {
        setScanNotification({ message: res.error, type: 'error' });
      } else {
        playBubblePopSound();
        setScanNotification({ message: `¡Correcto! ${rawSku} alistado en orden ${targetOrder.orderNumber}`, type: 'success' });
        setExpandedOrderId(targetOrder.id);
      }
    } else {
      const alreadyPickedOrder = orders.find((o) => o.items?.some((it) => it.sku.toLowerCase() === rawSku.toLowerCase() && it.isPicked));
      if (alreadyPickedOrder) {
        setScanNotification({ message: `El producto ${rawSku} ya fue alistado previamente.`, type: 'error' });
      } else {
        setScanNotification({ message: `SKU "${rawSku}" no encontrado en pedidos pendientes.`, type: 'error' });
      }
    }

    setTimeout(() => setScanNotification(null), 3500);
  };

  // Procesar escaneo automático si llega por parámetro URL (?sku=... o ?scan=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const skuParam = params.get('sku') || params.get('scan') || params.get('barcode');
      if (skuParam) {
        handleProcessBarcodeScan(skuParam);
        const url = new URL(window.location.href);
        url.searchParams.delete('sku');
        url.searchParams.delete('scan');
        url.searchParams.delete('barcode');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [orders]);

  const handleSaveQuantity = () => {
    if (!editingItemData) return;
    const res = updateOrderItemQuantity(editingItemData.orderId, editingItemData.itemSku, tempQty);
    if (res.success) {
      playBubblePopSound();
      setScanNotification({ message: `Cantidad de "${editingItemData.itemName}" actualizada a ${tempQty}.`, type: 'success' });
      setEditingItemData(null);
    } else {
      setScanNotification({ message: res.error || 'Error al actualizar cantidad', type: 'error' });
    }
    setTimeout(() => setScanNotification(null), 3000);
  };

  const handleEnablePush = async () => {
    const granted = await requestPushNotificationPermission();
    setPushPermission(getPushPermission());
  };

  const handleTestPush = async () => {
    setIsTestingPush(true);
    await testPushAndSoundAlert();
    setPushPermission(getPushPermission());
    setTimeout(() => setIsTestingPush(false), 1200);
  };

  // Rol del usuario actual
  const isAdmin = currentUser?.role === 'admin' || !!currentUser?.isMasterAdmin;
  const isStaffAlistoOnly =
    currentUser?.role === 'staff' &&
    currentUser?.permissions?.orders &&
    !currentUser?.permissions?.billing &&
    !currentUser?.permissions?.reports;

  // Refrescar pedidos desde Cloudflare D1 en segundo plano
  const handleRefresh = async () => {
    setIsRefreshing(true);
    playWaterDropSound();
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        // AppContext ya maneja la sincronización interna
      }
    } catch {}
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Determinar si un pedido está 100% completado en alisto
  const isOrderFullyAlistado = (order: Order) => {
    return (
      Array.isArray(order.items) &&
      order.items.length > 0 &&
      order.items.every((it) => it.isPicked || it.isMissing)
    );
  };

  // Contadores por estado
  const counts = useMemo(() => {
    const pending = orders.filter((o) => !isOrderFullyAlistado(o)).length;
    const packing = orders.filter((o) => isOrderFullyAlistado(o) && (o.orderStatus === 'packing' || o.orderStatus === 'pending' || o.orderStatus === 'picking')).length;
    const packed = orders.filter((o) => isOrderFullyAlistado(o) && o.orderStatus === 'packed').length;
    const delivered = orders.filter((o) => isOrderFullyAlistado(o) && o.orderStatus === 'delivered').length;
    return { all: orders.length, pending, packing, packed, delivered };
  }, [orders]);

  // Filtrado y ordenamiento de pedidos (cronológico descendente)
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        // Filtro por estado
        if (activeFilter === 'pending' && isOrderFullyAlistado(o)) return false;
        if (activeFilter === 'packing' && (!isOrderFullyAlistado(o) || (o.orderStatus !== 'packing' && o.orderStatus !== 'pending' && o.orderStatus !== 'picking'))) return false;
        if (activeFilter === 'packed' && (!isOrderFullyAlistado(o) || o.orderStatus !== 'packed')) return false;
        if (activeFilter === 'delivered' && (!isOrderFullyAlistado(o) || o.orderStatus !== 'delivered')) return false;

        // Búsqueda por texto
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchNum = o.orderNumber?.toLowerCase().includes(q);
          const matchClient = o.customerName?.toLowerCase().includes(q);
          const matchPhone = o.customerPhone?.toLowerCase().includes(q);
          const matchItem = o.items?.some((it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q));
          return matchNum || matchClient || matchPhone || matchItem;
        }

        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, activeFilter, searchQuery]);

  // Toggle checklist de items
  const handleToggleItem = (orderId: string, item: OrderItem) => {
    playWaterDropSound();
    if (item.isPicked) {
      unmarkItemPicked(orderId, item.sku);
    } else {
      markItemPicked(orderId, item.sku, currentUser?.name);
    }
  };

  // Copiar dirección
  const handleCopyAddress = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddressId(id);
      setTimeout(() => setCopiedAddressId(null), 2000);
    });
  };

  // Manejo de PIN rápido
  const handleKeypadPress = (digit: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + digit;
      setEnteredPin(next);
      setPinError(null);
      if (next.length === 4) {
        handleConfirmPin(next);
      }
    }
  };

  const handleConfirmPin = (pinToTest = enteredPin) => {
    const res = loginWithPin(pinToTest, selectedProfileName || undefined);
    if (res.success) {
      playBubblePopSound();
      setIsPinModalOpen(false);
      setEnteredPin('');
      setPinError(null);
      setSelectedProfileName(null);
    } else {
      setPinError(res.error || 'Código PIN incorrecto.');
      setEnteredPin('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white pb-20">
      {/* Header Dedicado Móvil */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 shadow-lg">
        {/* Identidad de la App Móvil */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bubble font-bold text-sm shadow-md shrink-0">
            FIO
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-sm sm:text-base font-bubble font-bold text-white tracking-tight truncate">
                Gestión de Pedidos
              </h1>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold uppercase tracking-wider">
                Móvil
              </span>
            </div>
          </div>
        </div>

        {/* Acciones de Cabecera: Perfil, PIN y Tienda */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Perfil de Usuario */}
          <button
            type="button"
            onClick={() => setIsPinModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-xs font-bubble font-bold text-slate-200 transition-all cursor-pointer active:scale-95"
            title="Cambiar perfil con código PIN"
          >
            <User className="w-3.5 h-3.5 text-purple-400" />
            <span className="max-w-[80px] truncate">
              {currentUser?.name || 'Cambiar PIN'}
            </span>
            <KeyRound className="w-3 h-3 text-amber-400" />
          </button>

          {/* Refresco Manual */}
          <button
            type="button"
            onClick={handleRefresh}
            className={`p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/70 transition-all active:scale-95 cursor-pointer ${
              isRefreshing ? 'animate-spin text-purple-400' : ''
            }`}
            title="Refrescar lista desde la base de datos"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Botón Volver al Menú Principal */}
          <button
            type="button"
            onClick={() => onNavigate('admin', 'hub')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-700/70 text-xs font-bubble font-bold transition-all active:scale-95 cursor-pointer"
            title="Ir al Menú Principal"
          >
            <Home className="w-3.5 h-3.5 text-purple-300" />
            <span>Menú</span>
          </button>

          {/* Botón Salir a Tienda Pública */}
          <button
            type="button"
            onClick={() => onNavigate('store')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bubble font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            title="Ir a la Tienda Pública"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Tienda</span>
          </button>
        </div>
      </header>

      {/* Banner de Perfil y Permisos Activos */}
      <div className="bg-slate-900/50 border-b border-slate-800/50 px-3 py-2 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[11px] font-bold text-slate-400">Modo:</span>
          {isAdmin ? (
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold">
              👑 Administración (Acceso Total y Financiero)
            </span>
          ) : isStaffAlistoOnly ? (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
              📦 Operario de Alisto (Vista Segura sin Finanzas)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-bold">
              Colaborador: {currentUser?.name || 'Equipo'}
            </span>
          )}
        </div>

        {currentUser && (
          <button
            type="button"
            onClick={logoutUser}
            className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <LogOut className="w-3 h-3" />
            <span>Salir</span>
          </button>
        )}
      </div>

      {/* Barra de Notificaciones Push y Alerta Sonora en Tiempo Real */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-3 py-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {pushPermission === 'granted' ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <BellRing className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notificaciones Push y Sonido en Celular: Activos 🔔</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Sonido y Push en Celular: Pendiente</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {pushPermission !== 'granted' ? (
            <button
              type="button"
              onClick={handleEnablePush}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bubble font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <BellRing className="w-3.5 h-3.5 text-slate-950" />
              <span>Activar Notificaciones</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleTestPush}
            disabled={isTestingPush}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bubble font-bold active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            title="Probar sonido de campana y vibración en celular"
          >
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>{isTestingPush ? 'Sonando...' : 'Probar Alerta'}</span>
          </button>
        </div>
      </div>

      {/* Banner flotante de feedback de escaneo / alisto */}
      {scanNotification && (
        <div className="px-3 pt-2">
          <div className={`p-3 rounded-2xl flex items-center justify-between text-xs font-bubble font-bold shadow-lg animate-fadeIn ${
            scanNotification.type === 'success'
              ? 'bg-emerald-950/90 border border-emerald-500/80 text-emerald-200'
              : 'bg-rose-950/90 border border-rose-500/80 text-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              {scanNotification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{scanNotification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setScanNotification(null)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Barra de Búsqueda y Escáner */}
      <div className="px-3 pt-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                handleProcessBarcodeScan(searchQuery);
                setSearchQuery('');
              }
            }}
            placeholder="Buscar o escanear SKU / código de barras..."
            className="w-full pl-9 pr-16 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                const manualSku = prompt('Ingresa el código SKU del producto escaneado:');
                if (manualSku) handleProcessBarcodeScan(manualSku);
              }}
              className="p-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/80 text-purple-300 hover:text-white border border-purple-700/50 transition-all cursor-pointer"
              title="Escanear o ingresar SKU manual"
            >
              <Scan className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Píldoras Deslizables de Filtros por Estado */}
      <div className="px-3 pt-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Todos ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900 text-amber-400/80 hover:text-amber-300 border border-slate-800'
            }`}
          >
            Por Alistar ({counts.pending})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('packing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'packing'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-indigo-400/80 hover:text-indigo-300 border border-slate-800'
            }`}
          >
            En Empaque ({counts.packing})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('packed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'packed'
                ? 'bg-fio-pink text-white shadow-md'
                : 'bg-slate-900 text-pink-400/80 hover:text-pink-300 border border-slate-800'
            }`}
          >
            Empacados ({counts.packed})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('delivered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'delivered'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-emerald-400/80 hover:text-emerald-300 border border-slate-800'
            }`}
          >
            Terminados ({counts.delivered})
          </button>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <main className="px-3 pt-3 space-y-3 flex-1">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800/60 p-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
              <Boxes className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bubble font-bold text-slate-300">
              No se encontraron pedidos
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto font-sans">
              No hay órdenes en esta categoría o no coinciden con la búsqueda actual.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isFullyAlistado = isOrderFullyAlistado(order);
            const pickedCount = order.items?.filter((it) => it.isPicked || it.isMissing).length || 0;
            const totalItemsCount = order.items?.length || 0;
            const progressPercent = totalItemsCount > 0 ? Math.round((pickedCount / totalItemsCount) * 100) : 0;
            const isExpanded = expandedOrderId === order.id;

            return (
              <article
                key={order.id}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                  order.orderStatus === 'delivered'
                    ? 'bg-slate-900/60 border-emerald-900/30'
                    : order.orderStatus === 'packed'
                    ? 'bg-slate-900/80 border-purple-900/40'
                    : isFullyAlistado
                    ? 'bg-slate-900/90 border-indigo-900/40'
                    : 'bg-slate-900/90 border-amber-900/40 shadow-md'
                }`}
              >
                {/* Cabecera de la Tarjeta */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-4 cursor-pointer flex items-start justify-between gap-2 border-b border-slate-800/60 hover:bg-slate-850/40 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wide">
                        {order.orderNumber}
                      </span>
                      {order.deliveryMethod === 'envio' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold">
                          <Truck className="w-3 h-3" />
                          <span>Envío</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                          <Store className="w-3 h-3" />
                          <span>Retiro</span>
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : order.orderStatus === 'packed'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : isFullyAlistado
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                        }`}
                      >
                        {order.orderStatus === 'delivered'
                          ? 'Terminado ✅'
                          : order.orderStatus === 'packed'
                          ? 'Empacado 📦'
                          : isFullyAlistado
                          ? 'En Empaque 🏷️'
                          : 'Alisto Pendiente ⏳'}
                      </span>
                    </div>

                    <h4 className="font-bubble font-bold text-sm sm:text-base text-slate-100 truncate">
                      {order.customerName}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-sans">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{formatShortDate(order.createdAt)}</span>
                      <span>•</span>
                      <span>{totalItemsCount} productos</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Botón Expansor */}
                    <div className="p-1.5 rounded-xl bg-slate-800 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Indicador del Perfil que Alistó el Pedido */}
                {(order.pickedBy || isOrderFullyAlistado(order)) && (
                  <div className="px-4 py-1.5 bg-purple-950/60 border-b border-purple-800/40 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-purple-300 font-bubble font-bold text-[11px]">
                      <UserCheck className="w-3.5 h-3.5 text-fio-pink" />
                      <span>Alistado por: <strong className="text-white underline decoration-fio-pink">{order.pickedBy || currentUser?.name || 'Administración'}</strong></span>
                    </span>
                    {(order.pickedAt || order.packedAt) && (
                      <span className="text-[10px] text-purple-400 font-mono">
                        {new Date(order.pickedAt || order.packedAt!).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                )}

                {/* Barra de Progreso de Alisto */}
                <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/40 flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className={progressPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}>
                        {progressPercent === 100 ? 'Alisto 100% Completo' : `Progreso de Alisto: ${pickedCount} de ${totalItemsCount}`}
                      </span>
                      <span className="text-slate-400">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          progressPercent === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-indigo-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sección de Datos Administrativos / Contacto (Solo visible para Admin o desplegado) */}
                {isAdmin && (
                  <div className="p-4 bg-slate-900/90 border-b border-slate-800/60 space-y-2.5 text-xs">
                    {/* Contacto y WhatsApp */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-purple-400" />
                        <span className="font-mono">{order.customerPhone || 'Sin teléfono'}</span>
                      </div>

                      {order.customerPhone && (
                        <a
                          href={`https://wa.me/506${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `¡Hola ${order.customerName}! Te saludamos de By.Fio respecto a tu pedido ${order.orderNumber}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bubble font-bold text-[11px] transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>

                    {/* Dirección de Envío */}
                    {order.deliveryMethod === 'envio' && order.shippingAddress && (
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-slate-300 leading-relaxed font-sans">
                            {order.shippingAddress}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(order.id, order.shippingAddress || '')}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 cursor-pointer"
                          title="Copiar dirección"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Totales y Estado de Pago */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Total:</span>
                        <span className="font-bubble font-bold text-sm text-emerald-400">
                          {formatCRC(order.total)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">
                          {order.paymentMethod === 'sinpe' ? 'SINPE Móvil' : order.paymentMethod}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Pagado ✅' : 'Pendiente ⏳'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de Items a Alistar (Checklist Táctil) */}
                <div className="p-4 space-y-2 bg-slate-950/20">
                  <div className="text-[11px] font-bubble font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between pb-1">
                    <span>Lista de Alisto ({order.items.length})</span>
                    {!isFullyAlistado && (
                      <button
                        type="button"
                        onClick={() => markAllItemsPicked(order.id, currentUser?.name)}
                        className="text-[10px] text-purple-400 hover:text-purple-300 cursor-pointer font-bold"
                      >
                        Alistar todos
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        onClick={() => handleToggleItem(order.id, item)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          item.isPicked
                            ? 'bg-slate-900/40 border-emerald-800/40 opacity-70'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xs'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                              {item.quantity}x
                            </span>
                            <span className={`text-xs font-bold ${item.isPicked ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                              {item.name}
                            </span>
                            {!item.isPicked && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingItemData({
                                    orderId: order.id,
                                    itemSku: item.sku,
                                    itemName: item.name,
                                    currentQty: item.quantity,
                                  });
                                  setTempQty(item.quantity);
                                }}
                                className="ml-auto px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[10px] font-bubble font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                                title="Modificar cantidad de productos encontrados"
                              >
                                <Edit3 className="w-3 h-3 text-amber-400" />
                                <span>Modificar</span>
                              </button>
                            )}
                          </div>

                          {/* Ubicación en Estante */}
                          {item.shelfLocation && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                              <Tag className="w-3 h-3" />
                              <span>{item.shelfLocation}</span>
                            </div>
                          )}

                          {/* Personalización solicitada */}
                          {item.customText && (
                            <div className="p-1.5 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[10px] font-sans">
                              <strong>Personalizado:</strong> {item.customText}
                            </div>
                          )}
                        </div>

                        {/* Checkbox Táctil */}
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                            item.isPicked
                              ? 'bg-emerald-500 border-emerald-400 text-white shadow-md'
                              : 'bg-slate-800 border-slate-700 text-transparent'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botones de Acción de Estado (Regla: no pasar sin 100% de alisto) */}
                <div className="p-3 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                  {!isFullyAlistado ? (
                    <div className="w-full flex items-center justify-between text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Completa el alisto ({pickedCount}/{totalItemsCount}) para habilitar empaque.</span>
                      </div>
                    </div>
                  ) : order.orderStatus === 'delivered' ? (
                    <div className="w-full flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded-xl">
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Pedido finalizado y entregado</span>
                      </span>
                    </div>
                  ) : order.orderStatus === 'packed' ? (
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-xs text-purple-300 font-bold">
                        📦 Listo para entrega
                      </span>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'delivered', currentUser?.name)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bubble font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          Marcar como Entregado ✅
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-xs text-indigo-300 font-bold">
                        ✅ Alisto al 100%
                      </span>
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'packed', currentUser?.name)}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bubble font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        Pasar a Empacado 📦
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </main>

      {/* Modal / Keypad Rápido de PIN */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-2xl text-center animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="font-bubble font-bold text-base text-white">
                Acceso de Equipo por PIN
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsPinModalOpen(false);
                  setEnteredPin('');
                  setPinError(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              Digita tu PIN de 4 dígitos (ej: 7777 Admin, 1234 María, 1001 Alisto):
            </p>

            {/* Display de PIN */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    enteredPin.length > idx
                      ? 'bg-purple-500 border-purple-400 scale-110'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-sans font-bold">
                {pinError}
              </p>
            )}

            {/* Teclado Numérico */}
            <div className="grid grid-cols-3 gap-2 pt-2 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-lg border border-slate-700/80 active:scale-95 transition-all cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setEnteredPin('')}
                className="h-12 rounded-2xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 font-bubble text-xs active:scale-95 transition-all cursor-pointer"
              >
                Borrar
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-lg border border-slate-700/80 active:scale-95 transition-all cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setEnteredPin((p) => p.slice(0, -1))}
                className="h-12 rounded-2xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 font-bubble text-xs active:scale-95 transition-all cursor-pointer"
              >
                ←
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Modificar Cantidad de Ítem en Alisto */}
      {editingItemData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setEditingItemData(null)}
        >
          <div
            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-scaleUp text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="font-bubble font-bold text-sm text-white">
                  Modificar Cantidad en Alisto
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItemData(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-slate-300 font-sans">
                Producto: <strong className="text-white">{editingItemData.itemName}</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                Cantidad solicitada: <strong className="text-purple-300">{editingItemData.currentQty} unidades</strong>
              </p>
              <p className="text-[11px] text-amber-300/90 font-sans leading-relaxed">
                Si encontraste menos existencias en estante, ajusta la cantidad real y presiona Aceptar:
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 py-2">
              <button
                type="button"
                onClick={() => setTempQty((prev) => Math.max(0, prev - 1))}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center border border-slate-700 active:scale-95 cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                max={editingItemData.currentQty}
                value={tempQty}
                onChange={(e) => setTempQty(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 text-center py-2 rounded-xl bg-slate-950 border border-purple-500 font-mono font-bold text-lg text-white"
              />
              <button
                type="button"
                onClick={() => setTempQty((prev) => Math.min(editingItemData.currentQty, prev + 1))}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center border border-slate-700 active:scale-95 cursor-pointer"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItemData(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bubble text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveQuantity}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bubble font-bold text-xs shadow-md active:scale-95 cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dock Táctil Inferior para Navegación Móvil */}
      <AdminMobileDock
        activeTab="orders"
        onSelectTab={(tab) => {
          onNavigate('admin', tab);
        }}
      />
    </div>
  );
};
