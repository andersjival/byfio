import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus, OrderItem, AppRoute, UserProfile } from '../../types';
import { formatCRC, formatShortDate } from '../../utils/formatters';
import {
  PackageCheck, Camera, Search, CheckCircle2, Clock, Phone, MapPin,
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

const CameraBarcodeScannerModal = React.lazy(() =>
  import('./CameraBarcodeScannerModal').then((m) => ({ default: m.CameraBarcodeScannerModal }))
);

interface MobileOrdersViewProps {
  onNavigate: (route: AppRoute, tab?: any) => void;
}

export const MobileOrdersView: React.FC<MobileOrdersViewProps> = ({ onNavigate }) => {
  const {
    orders,
    updateOrderStatus,
    startPicking,
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
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);

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
    <div className="min-h-screen bg-[#FAF7F2] text-slate-800 flex flex-col font-sans selection:bg-fio-300 selection:text-fio-900 pb-[calc(env(safe-area-inset-bottom)+5.5rem)]">
      {/* Header Dedicado Móvil */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-purple-200/80 px-3 sm:px-4 pt-[max(0.625rem,env(safe-area-inset-top))] pb-2.5 flex items-center justify-between gap-2 shadow-2xs">
        {/* Identidad de la App Móvil */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-fio-pink text-white flex items-center justify-center font-bubble font-bold text-sm shadow-xs shrink-0">
            FIO
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-sm sm:text-base font-bubble font-bold text-fio-900 tracking-tight truncate">
                Gestión de Pedidos
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-[9.5px] font-bubble font-bold uppercase tracking-wider">
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-purple-50 border border-purple-200/90 text-xs font-bubble font-bold text-fio-900 shadow-2xs transition-all cursor-pointer active:scale-95"
            title="Cambiar perfil con código PIN"
          >
            <User className="w-3.5 h-3.5 text-purple-600" />
            <span className="max-w-[80px] truncate">
              {currentUser?.name || 'Cambiar PIN'}
            </span>
            <KeyRound className="w-3 h-3 text-amber-500" />
          </button>

          {/* Refresco Manual */}
          <button
            type="button"
            onClick={handleRefresh}
            className={`p-2 rounded-xl bg-white hover:bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs transition-all active:scale-95 cursor-pointer ${
              isRefreshing ? 'animate-spin text-fio-pink' : ''
            }`}
            title="Refrescar lista desde la base de datos"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Botón Volver a Inicio */}
          <button
            type="button"
            onClick={() => onNavigate('admin', 'hub')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300/80 text-xs font-bubble font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Ir a Inicio"
          >
            <Home className="w-3.5 h-3.5 text-purple-700" />
            <span>Inicio</span>
          </button>

          {/* Botón Salir a Tienda Pública */}
          <button
            type="button"
            onClick={() => onNavigate('store')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-fio-pink hover:from-purple-600 hover:to-pink-500 text-white text-xs font-bubble font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Ir a la Tienda Pública"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Tienda</span>
          </button>
        </div>
      </header>

      {/* Banner de Perfil y Permisos Activos */}
      <div className="bg-white/70 border-b border-purple-100 px-3 py-2 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[11px] font-bold text-slate-500">Modo:</span>
          {isAdmin ? (
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-[10px] font-bubble font-bold shadow-2xs">
              👑 Administración (Acceso Total y Financiero)
            </span>
          ) : isStaffAlistoOnly ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-bubble font-bold shadow-2xs">
              📦 Operario de Alisto (Vista Segura sin Finanzas)
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-pink-100 border border-pink-200 text-pink-900 text-[10px] font-bubble font-bold shadow-2xs">
              Colaborador: {currentUser?.name || 'Equipo'}
            </span>
          )}
        </div>

        {currentUser && (
          <button
            type="button"
            onClick={logoutUser}
            className="text-[10px] text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer shrink-0 font-medium"
          >
            <LogOut className="w-3 h-3" />
            <span>Salir</span>
          </button>
        )}
      </div>

      {/* Barra de Notificaciones Push y Alerta Sonora en Tiempo Real */}
      <div className="bg-purple-50/60 border-b border-purple-100 px-3 py-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {pushPermission === 'granted' ? (
            <div className="flex items-center gap-1.5 text-xs text-purple-900 font-bubble font-bold">
              <span className="w-2 h-2 rounded-full bg-fio-pink animate-pulse" />
              <BellRing className="w-3.5 h-3.5 text-fio-pink" />
              <span>Notificaciones Push y Sonido en Celular: Activos 🔔</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bubble font-bold">
              <Bell className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              <span>Sonido y Push en Celular: Pendiente</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {pushPermission !== 'granted' ? (
            <button
              type="button"
              onClick={handleEnablePush}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-bubble font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-950" />
              <span>Activar Notificaciones</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleTestPush}
            disabled={isTestingPush}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-900 border border-purple-200/90 text-xs font-bubble font-bold active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Probar sonido de campana y vibración en celular"
          >
            <Volume2 className="w-3.5 h-3.5 text-purple-600" />
            <span>{isTestingPush ? 'Sonando...' : 'Probar Alerta'}</span>
          </button>
        </div>
      </div>

      {/* Banner flotante de feedback de escaneo / alisto */}
      {scanNotification && (
        <div className="px-3 pt-2">
          <div className={`p-3 rounded-2xl flex items-center justify-between text-xs font-bubble font-bold shadow-xs animate-fadeIn ${
            scanNotification.type === 'success'
              ? 'bg-purple-100 border border-purple-300 text-purple-900'
              : 'bg-rose-100 border border-rose-300 text-rose-900'
          }`}>
            <div className="flex items-center gap-2">
              {scanNotification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span>{scanNotification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setScanNotification(null)}
              className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Banner Principal Prominente: Escanear Códigos para Alisto */}
      <div className="px-3 pt-3">
        <button
          type="button"
          onClick={() => {
            playWaterDropSound();
            setIsCameraScannerOpen(true);
          }}
          className="w-full p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fio-pink to-purple-700 hover:from-purple-500 hover:to-pink-500 text-white font-bubble font-bold text-xs sm:text-sm flex items-center justify-between gap-3 shadow-clayBtn active:scale-[0.98] transition-all cursor-pointer border border-white/40"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-xs">
              <Camera className="w-5 h-5 text-fio-yellow animate-pulse" />
            </div>
            <div className="text-left min-w-0">
              <p className="font-bubble font-black text-sm text-white leading-tight">
                Escanear Productos para Alisto
              </p>
              <p className="text-[10px] text-purple-100 font-sans font-medium leading-tight mt-0.5 truncate">
                Toca aquí para abrir la cámara y escanear el código de barras o SKU
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-white text-purple-900 font-bubble font-black text-xs shadow-2xs shrink-0 flex items-center gap-1">
            <Scan className="w-3.5 h-3.5 text-fio-pink" />
            <span>Escanear</span>
          </span>
        </button>
      </div>

      {/* Barra de Búsqueda y Entrada Rápida de SKU */}
      <div className="px-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
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
              placeholder="Buscar o digitar SKU / código de barras..."
              className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-white border border-purple-200/90 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200/50 shadow-2xs transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              playWaterDropSound();
              setIsCameraScannerOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-purple-50 text-purple-900 border border-purple-200/90 font-bubble font-bold text-xs flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
            title="Abrir cámara lectora"
          >
            <Camera className="w-4 h-4 text-fio-pink" />
            <span className="hidden xs:inline">Cámara</span>
          </button>
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
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-purple-700 border border-purple-200/70 shadow-2xs'
            }`}
          >
            Todos ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'pending'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/70 shadow-2xs'
            }`}
          >
            Por Alistar ({counts.pending})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('packing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'packing'
                ? 'bg-indigo-500 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200/70 shadow-2xs'
            }`}
          >
            En Empaque ({counts.packing})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('packed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'packed'
                ? 'bg-fio-pink text-white shadow-xs'
                : 'bg-pink-50 text-pink-800 hover:bg-pink-100 border border-pink-200/70 shadow-2xs'
            }`}
          >
            Empacados ({counts.packed})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('delivered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'delivered'
                ? 'bg-purple-400 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200/70 shadow-2xs'
            }`}
          >
            Terminados ({counts.delivered})
          </button>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {/* Acceso Rápido de Alisto con Cámara en la PWA */}
      {counts.pending > 0 && (
        <div className="px-3 pt-2">
          {(() => {
            const firstPending = orders.find((o) => !isOrderFullyAlistado(o));
            if (!firstPending) return null;
            return (
              <button
                type="button"
                onClick={() => startPicking(firstPending.id, 'barcode')}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-fio-800 to-purple-900 text-white flex items-center justify-between gap-3 shadow-clay active:scale-[0.98] transition-all cursor-pointer border border-purple-400/40"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fio-pink to-purple-500 flex items-center justify-center shrink-0 shadow-xs">
                    <Camera className="w-4 h-4 text-fio-yellow" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[10px] text-fio-yellow font-bold uppercase tracking-wider">
                      Siguiente en Cola de Alisto
                    </p>
                    <p className="font-bubble font-bold text-xs truncate">
                      {firstPending.orderNumber} — {firstPending.customerName}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 px-3 py-1.5 rounded-xl bg-fio-pink hover:bg-pink-600 text-white font-bubble font-black text-xs shadow-xs flex items-center gap-1">
                  <span>Escanear</span>
                  <span>📱</span>
                </span>
              </button>
            );
          })()}
        </div>
      )}

      <main className="px-3 pt-3 space-y-3 flex-1">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-purple-200/80 shadow-clay p-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
              <Boxes className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bubble font-bold text-fio-900">
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
                className={`rounded-3xl border transition-all duration-300 overflow-hidden bg-white shadow-sm ${
                  order.orderStatus === 'delivered'
                    ? 'border-purple-200/90 hover:border-purple-300'
                    : order.orderStatus === 'packed'
                    ? 'border-pink-200 hover:border-pink-300'
                    : isFullyAlistado
                    ? 'border-indigo-200 hover:border-indigo-300'
                    : 'border-amber-200 hover:border-amber-300 shadow-md ring-2 ring-amber-100'
                }`}
              >
                {/* Cabecera de la Tarjeta */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-4 cursor-pointer flex items-start justify-between gap-2 border-b border-purple-100 hover:bg-purple-50/30 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm sm:text-base font-bold text-fio-900 tracking-wide bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200/70">
                        {order.orderNumber}
                      </span>
                      {order.deliveryMethod === 'envio' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold">
                          <Truck className="w-3 h-3" />
                          <span>Envío</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold">
                          <Store className="w-3 h-3" />
                          <span>Retiro</span>
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.orderStatus === 'delivered'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : order.orderStatus === 'packed'
                            ? 'bg-pink-100 text-pink-800 border border-pink-200'
                            : isFullyAlistado
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200 animate-pulse'
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

                    <h4 className="font-bubble font-bold text-sm sm:text-base text-slate-800 truncate">
                      {order.customerName}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-sans">
                      <Calendar className="w-3 h-3 text-purple-400" />
                      <span>{formatShortDate(order.createdAt)}</span>
                      <span>•</span>
                      <span>{totalItemsCount} productos</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isFullyAlistado && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startPicking(order.id, 'barcode');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink hover:from-purple-500 hover:to-pink-500 text-white font-bubble font-bold text-[11px] flex items-center gap-1 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
                        title="Escanear productos de este pedido con la cámara"
                      >
                        <Camera className="w-3.5 h-3.5 text-fio-yellow" />
                        <span>Escanear</span>
                      </button>
                    )}

                    {/* Botón Expansor */}
                    <div className="p-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Indicador del Perfil que Alistó el Pedido */}
                {(order.pickedBy || isOrderFullyAlistado(order)) && (
                  <div className="px-4 py-1.5 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-purple-900 font-bubble font-bold text-[11px]">
                      <UserCheck className="w-3.5 h-3.5 text-fio-pink" />
                      <span>Alistado por: <strong className="text-fio-900 underline decoration-fio-pink">{order.pickedBy || currentUser?.name || 'Administración'}</strong></span>
                    </span>
                    {(order.pickedAt || order.packedAt) && (
                      <span className="text-[10px] text-purple-600 font-mono">
                        {new Date(order.pickedAt || order.packedAt!).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                )}

                {/* Barra de Progreso de Alisto */}
                <div className="px-4 py-2 bg-purple-50/30 border-b border-purple-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className={progressPercent === 100 ? 'text-purple-800' : 'text-amber-800'}>
                        {progressPercent === 100 ? 'Alisto 100% Completo' : `Progreso de Alisto: ${pickedCount} de ${totalItemsCount}`}
                      </span>
                      <span className="text-slate-500 font-mono">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-purple-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          progressPercent === 100 ? 'bg-gradient-to-r from-purple-500 to-fio-pink' : 'bg-gradient-to-r from-amber-400 to-purple-400'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sección de Datos Administrativos / Contacto (Solo visible para Admin o desplegado) */}
                {isAdmin && (
                  <div className="p-4 bg-purple-50/40 border-b border-purple-100 space-y-2.5 text-xs">
                    {/* Contacto y WhatsApp */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-mono">{order.customerPhone || 'Sin teléfono'}</span>
                      </div>

                      {order.customerPhone && (
                        <a
                          href={`https://wa.me/506${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `¡Hola ${order.customerName}! Te saludamos de By.Fio respecto a tu pedido ${order.orderNumber}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 border border-pink-200 font-bubble font-bold text-[11px] transition-all shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>

                    {/* Dirección de Envío */}
                    {order.deliveryMethod === 'envio' && order.shippingAddress && (
                      <div className="p-2.5 rounded-xl bg-white border border-purple-200/80 text-[11px] flex items-start justify-between gap-2 shadow-2xs">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-fio-pink shrink-0 mt-0.5" />
                          <span className="text-slate-700 leading-relaxed font-sans">
                            {order.shippingAddress}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(order.id, order.shippingAddress || '')}
                          className="p-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 shrink-0 cursor-pointer border border-purple-200/60"
                          title="Copiar dirección"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Totales y Estado de Pago */}
                    <div className="flex items-center justify-between pt-1 border-t border-purple-100">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">Total:</span>
                        <span className="font-bubble font-bold text-sm text-fio-900">
                          {formatCRC(order.total)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">
                          {order.paymentMethod === 'sinpe' ? 'SINPE Móvil' : order.paymentMethod}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.paymentStatus === 'paid'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Pagado ✅' : 'Pendiente ⏳'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón Principal: Alisto Guiado con Cámara del Celular (PWA) */}
                {!isFullyAlistado && (
                  <div className="p-3 bg-gradient-to-r from-purple-100/90 via-pink-100/70 to-purple-50 border-b border-purple-200/80">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startPicking(order.id, 'barcode');
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fio-pink to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-bubble font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-clayBtn active:scale-95 transition-all cursor-pointer"
                      title="Abrir la pistola lectora de códigos de barra con la cámara del celular"
                    >
                      <Camera className="w-4 h-4 text-fio-yellow" />
                      <span>📱 Iniciar Alisto con Lector de Cámara</span>
                    </button>
                  </div>
                )}

                {/* Lista de Items a Alistar (Checklist Táctil) */}
                <div className="p-4 space-y-2 bg-purple-50/20">
                  <div className="text-[11px] font-bubble font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between pb-1">
                    <span>Lista de Alisto ({order.items.length})</span>
                    {!isFullyAlistado && (
                      <button
                        type="button"
                        onClick={() => markAllItemsPicked(order.id, currentUser?.name)}
                        className="text-[10px] text-fio-pink hover:text-purple-700 cursor-pointer font-bold"
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
                            ? 'bg-purple-50/40 border-purple-200/50 opacity-75'
                            : 'bg-white border-purple-200/80 hover:border-purple-300 shadow-2xs'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-mono text-xs font-bold border border-purple-200/70">
                              {item.quantity}x
                            </span>
                            <span className={`text-xs font-bold ${item.isPicked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
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
                                className="ml-auto px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bubble font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-2xs"
                                title="Modificar cantidad de productos encontrados"
                              >
                                <Edit3 className="w-3 h-3 text-amber-600" />
                                <span>Modificar</span>
                              </button>
                            )}
                          </div>

                          {/* Ubicación en Estante */}
                          {item.shelfLocation && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                              <Tag className="w-3 h-3 text-amber-600" />
                              <span>{item.shelfLocation}</span>
                            </div>
                          )}

                          {/* Personalización solicitada */}
                          {item.customText && (
                            <div className="p-1.5 rounded-lg bg-pink-50 border border-pink-200 text-pink-800 text-[10px] font-sans">
                              <strong>Personalizado:</strong> {item.customText}
                            </div>
                          )}
                        </div>

                        {/* Botón Escanear y Checkbox Táctil Pastel */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!item.isPicked && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                startPicking(order.id, 'barcode');
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200/90 font-bubble font-bold text-[10px] flex items-center gap-1 active:scale-95 transition-all shadow-2xs cursor-pointer"
                              title={`Escanear código de barras con cámara para ${item.name}`}
                            >
                              <Camera className="w-3.5 h-3.5 text-fio-pink" />
                              <span>Escanear</span>
                            </button>
                          )}

                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                              item.isPicked
                                ? 'bg-gradient-to-tr from-purple-500 to-fio-pink border-purple-400 text-white shadow-2xs'
                                : 'bg-white border-purple-300 text-transparent hover:border-purple-400'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botones de Acción de Estado */}
                <div className="p-3 bg-white border-t border-purple-100 flex items-center justify-between gap-2 flex-wrap">
                  {!isFullyAlistado ? (
                    <div className="w-full flex items-center justify-between text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Completa el alisto ({pickedCount}/{totalItemsCount}) para habilitar empaque.</span>
                      </div>
                    </div>
                  ) : order.orderStatus === 'delivered' ? (
                    <div className="w-full flex items-center justify-between text-xs text-purple-900 bg-purple-50 p-2 rounded-xl border border-purple-200">
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <span>Pedido finalizado y entregado</span>
                      </span>
                    </div>
                  ) : order.orderStatus === 'packed' ? (
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-xs text-purple-800 font-bubble font-bold">
                        📦 Listo para entrega
                      </span>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'delivered', currentUser?.name)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bubble font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          Marcar como Entregado ✅
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-xs text-purple-800 font-bubble font-bold">
                        ✅ Alisto al 100%
                      </span>
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'packed', currentUser?.name)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-fio-pink hover:from-purple-600 hover:to-pink-600 text-white font-bubble font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-purple-200/90 p-5 space-y-4 shadow-clay text-center animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="font-bubble font-bold text-base text-fio-900">
                Acceso de Equipo por PIN
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsPinModalOpen(false);
                  setEnteredPin('');
                  setPinError(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-sans">
              Digita tu PIN de 4 dígitos (ej: 7777 Admin, 1234 María, 1001 Alisto):
            </p>

            {/* Display de PIN */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    enteredPin.length > idx
                      ? 'bg-fio-pink border-purple-400 scale-110 shadow-xs'
                      : 'bg-purple-50 border-purple-200'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 font-sans font-bold">
                {pinError}
              </p>
            )}

            {/* Teclado Numérico Pastel */}
            <div className="grid grid-cols-3 gap-2 pt-2 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="h-12 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-mono font-bold text-lg border border-purple-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setEnteredPin('')}
                className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bubble text-xs active:scale-95 transition-all cursor-pointer"
              >
                Borrar
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-12 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-mono font-bold text-lg border border-purple-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setEnteredPin((p) => p.slice(0, -1))}
                className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bubble text-xs active:scale-95 transition-all cursor-pointer"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
          onClick={() => setEditingItemData(null)}
        >
          <div
            className="w-full max-w-sm bg-white border border-purple-200/90 rounded-3xl p-5 shadow-clay space-y-4 animate-scaleUp text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-500" />
                <h3 className="font-bubble font-bold text-sm text-fio-900">
                  Modificar Cantidad en Alisto
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItemData(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-slate-700 font-sans">
                Producto: <strong className="text-fio-900">{editingItemData.itemName}</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                Cantidad solicitada: <strong className="text-purple-700">{editingItemData.currentQty} unidades</strong>
              </p>
              <p className="text-[11px] text-amber-800 font-sans leading-relaxed">
                Si encontraste menos existencias en estante, ajusta la cantidad real y presiona Aceptar:
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 py-2">
              <button
                type="button"
                onClick={() => setTempQty((prev) => Math.max(0, prev - 1))}
                className="w-10 h-10 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-lg flex items-center justify-center border border-purple-300 active:scale-95 cursor-pointer shadow-2xs"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                max={editingItemData.currentQty}
                value={tempQty}
                onChange={(e) => setTempQty(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 text-center py-2 rounded-xl bg-purple-50 border border-purple-300 font-mono font-bold text-lg text-fio-900"
              />
              <button
                type="button"
                onClick={() => setTempQty((prev) => Math.min(editingItemData.currentQty, prev + 1))}
                className="w-10 h-10 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-lg flex items-center justify-center border border-purple-300 active:scale-95 cursor-pointer shadow-2xs"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItemData(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bubble text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveQuantity}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-fio-pink hover:from-purple-600 hover:to-pink-500 text-white font-bubble font-bold text-xs shadow-neuBtn active:scale-95 cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Escáner de Código de Barras con Cámara */}
      <React.Suspense fallback={null}>
        {isCameraScannerOpen && (
          <CameraBarcodeScannerModal
            isOpen={isCameraScannerOpen}
            onClose={() => setIsCameraScannerOpen(false)}
            onScan={handleProcessBarcodeScan}
          />
        )}
      </React.Suspense>

      {/* Botón Flotante Fijo (FAB) para Escanear en cualquier momento */}
      <button
        type="button"
        onClick={() => {
          playWaterDropSound();
          setIsCameraScannerOpen(true);
        }}
        className="fixed bottom-[max(5.25rem,calc(env(safe-area-inset-bottom)+4.8rem))] right-3 sm:right-5 z-40 py-2.5 px-4 rounded-full bg-gradient-to-r from-purple-600 via-fio-pink to-purple-600 text-white font-bubble font-black text-xs sm:text-sm shadow-[0_8px_25px_rgba(236,72,153,0.55)] border-2 border-white flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
        title="Escanear código de barras o SKU con la cámara"
      >
        <Camera className="w-4 h-4 text-fio-yellow" />
        <span>Escanear</span>
        <Scan className="w-3.5 h-3.5 text-white/90" />
      </button>

      {/* Dock Táctil Inferior para Navegación Móvil */}
      <AdminMobileDock
        activeTab="orders"
        onSelectTab={(tab) => {
          onNavigate('admin', tab);
        }}
        onOpenScanner={() => setIsCameraScannerOpen(true)}
      />
    </div>
  );
};
