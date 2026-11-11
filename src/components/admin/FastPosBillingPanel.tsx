import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { Search, ScanLine, Plus, Minus, Trash2, DollarSign, Smartphone, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { playBubblePopSound } from '../../utils/soundEffects';

const CameraBarcodeScannerModal = React.lazy(() =>
  import('../mobile/CameraBarcodeScannerModal').then((m) => ({
    default: m.CameraBarcodeScannerModal,
  }))
);

interface FastCartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  maxStock: number;
  shelfLocation?: string;
  image?: string;
}

const normCode = (v?: string) => (v || '').trim().toLowerCase().replace(/^fio-/, 'bf-');

const extractToken = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('http')) return trimmed;
  try {
    const u = new URL(trimmed);
    return u.searchParams.get('sku') || u.searchParams.get('scan') || u.searchParams.get('barcode') || trimmed;
  } catch {
    return trimmed;
  }
};

export const FastPosBillingPanel: React.FC<{ focusTick: number }> = ({ focusTick }) => {
  const { products, createDirectInvoiceOrder } = useApp();
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<FastCartItem[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [focusTick]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const nq = normCode(extractToken(q));
    return products
      .filter((p) =>
        p.name.toLowerCase().includes(q) ||
        normCode(p.sku).includes(nq) ||
        (p.qrCode && normCode(p.qrCode).includes(nq))
      )
      .slice(0, 8);
  }, [products, query]);

  const total = useMemo(() => cart.reduce((acc, i) => acc + i.price * i.quantity, 0), [cart]);

  const addProduct = (product: Product) => {
    if (product.stock <= 0) {
      setNotice({ type: 'err', text: `Sin stock disponible para "${product.name}".` });
      return;
    }
    setNotice(null);
    playBubblePopSound();
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === product.id);
      if (idx >= 0) {
        const current = prev[idx];
        if (current.quantity >= product.stock) {
          setNotice({ type: 'err', text: `Stock máximo (${product.stock}) alcanzado para "${product.name}".` });
          return prev;
        }
        return prev.map((it, k) => (k === idx ? { ...it, quantity: it.quantity + 1 } : it));
      }
      return [
        ...prev,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          price: product.price,
          quantity: 1,
          maxStock: product.stock,
          shelfLocation: product.shelfLocation,
          image: product.images?.[0] || product.image,
        },
      ];
    });
    setQuery('');
    inputRef.current?.focus();
  };

  const handleCodeSubmit = (raw: string) => {
    const token = normCode(extractToken(raw));
    if (!token) return;
    const exact = products.find((p) => normCode(p.sku) === token || normCode(p.qrCode) === token);
    if (exact) {
      addProduct(exact);
    } else if (matches.length === 1) {
      addProduct(matches[0]);
    } else {
      setNotice({ type: 'err', text: `Código "${raw.trim()}" no encontrado.` });
    }
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.flatMap((it) => {
        if (it.productId !== productId) return [it];
        const next = Math.min(it.maxStock, it.quantity + delta);
        return next <= 0 ? [] : [{ ...it, quantity: next }];
      })
    );
  };

  const handleQuickPay = (paymentMethod: 'efectivo' | 'sinpe') => {
    if (cart.length === 0) return;
    const order = createDirectInvoiceOrder({
      customerName: 'Cliente Mostrador',
      customerPhone: '0000-0000',
      deliveryMethod: 'retiro',
      paymentMethod,
      items: cart.map(({ sku, name, price, quantity, shelfLocation, image }) => ({
        sku, name, price, quantity, shelfLocation, image,
      })),
      subtotal: total,
      shippingFee: 0,
      total,
    });
    playBubblePopSound();
    setCart([]);
    setQuery('');
    setNotice({
      type: 'ok',
      text: `Factura ${order.orderNumber} cobrada (${paymentMethod === 'efectivo' ? 'Efectivo' : 'SINPE'}).`,
    });
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-[#ECEEF2] dark:bg-[#1C1830] shadow-neu border border-white/60 dark:border-white/10 space-y-4">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-fio-purple absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCodeSubmit(query);
              }
            }}
            placeholder="Buscar producto por nombre o escanear código de barras / QR..."
            className="w-full pl-10 pr-9 py-3 rounded-2xl bg-white dark:bg-[#231F3D] border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-fio-purple/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setScannerOpen(true)}
          className="px-4 py-3 rounded-2xl bg-fio-purple text-white font-bubble font-bold text-sm flex items-center justify-center gap-2 shadow-neuBtn hover:opacity-95 active:scale-95 transition-all shrink-0"
        >
          <ScanLine className="w-4 h-4" />
          <span>Escanear</span>
        </button>
      </div>

      {notice && (
        <div className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
          notice.type === 'ok'
            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
            : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
        }`}>
          {notice.type === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{notice.text}</span>
        </div>
      )}

      {query.trim() !== '' && (
        <div className="rounded-2xl bg-white/90 dark:bg-[#231F3D] border border-slate-200 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
          {matches.length === 0 ? (
            <p className="p-3 text-xs text-slate-500 text-center">Sin productos coincidentes.</p>
          ) : (
            matches.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => addProduct(p)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-fio-purple/5 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{p.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {p.sku} · Stock: {p.stock}{p.shelfLocation ? ` · ${p.shelfLocation}` : ''}
                  </p>
                </div>
                <span className="text-sm font-bubble font-bold text-fio-purple shrink-0">{formatCRC(p.price)}</span>
              </button>
            ))
          )}
        </div>
      )}

      {cart.length > 0 ? (
        <div className="space-y-2.5">
          <div className="divide-y divide-slate-200/70 dark:divide-white/10 rounded-2xl bg-white/80 dark:bg-[#231F3D]/80 border border-white/60 dark:border-white/10">
            {cart.map((it) => (
              <div key={it.productId} className="px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{it.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {it.sku} · {formatCRC(it.price)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button type="button" onClick={() => updateQty(it.productId, -1)} className="w-7 h-7 rounded-xl bg-slate-200/80 dark:bg-white/10 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="w-6 text-center text-sm font-bold">{it.quantity}</span>
                  <button type="button" onClick={() => updateQty(it.productId, 1)} className="w-7 h-7 rounded-xl bg-slate-200/80 dark:bg-white/10 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                  <span className="w-20 text-right text-sm font-bubble font-bold text-slate-800 dark:text-white">{formatCRC(it.price * it.quantity)}</span>
                  <button type="button" onClick={() => updateQty(it.productId, -it.quantity)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Total a Pagar</span>
            <span className="text-2xl font-bubble font-bold text-fio-purple dark:text-white">{formatCRC(total)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleQuickPay('efectivo')}
              className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bubble font-bold text-base flex items-center justify-center gap-2 shadow-neuBtn active:scale-95 transition-all"
            >
              <DollarSign className="w-5 h-5" />
              <span>Pago en Efectivo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPay('sinpe')}
              className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-fio-purple to-fuchsia-600 hover:opacity-95 text-white font-bubble font-bold text-base flex items-center justify-center gap-2 shadow-neuBtn active:scale-95 transition-all"
            >
              <Smartphone className="w-5 h-5" />
              <span>Pago SINPE</span>
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-6">
          Digita el producto o escanea su código para agregarlo y cobrar rápido.
        </p>
      )}

      {scannerOpen && (
        <Suspense fallback={null}>
          <CameraBarcodeScannerModal
            isOpen={scannerOpen}
            onClose={() => setScannerOpen(false)}
            onScan={(code) => {
              setScannerOpen(false);
              handleCodeSubmit(code);
            }}
          />
        </Suspense>
      )}
    </div>
  );
};
