import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Heart, Navigation, Loader2, ShoppingBag, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playBubblePopSound, playWaterDropSound } from '../../utils/soundEffects';
import { Product } from '../../types';
import { formatCRC } from '../../utils/formatters';

interface StarAgentRegisterCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { name: string; email: string }) => void;
  mode?: 'register' | 'cart';
  onSwitchMode?: (mode: 'register' | 'cart') => void;
  cartProducts?: Array<{ product: Product; quantity: number }>;
  onUpdateCartQuantity?: (productId: string, quantity: number) => void;
  onRemoveCartProduct?: (productId: string) => void;
  onProceedToCheckout?: () => void;
}

export const StarAgentRegisterCard: React.FC<StarAgentRegisterCardProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode = 'register',
  onSwitchMode,
  cartProducts = [],
  onUpdateCartQuantity,
  onRemoveCartProduct,
  onProceedToCheckout,
}) => {
  const { registerUser } = useApp();
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cartSubtotal = cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  const handleChange = (field: string, value: string) => {
    setError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Botón para detectar ubicación GPS del usuario
  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      setError('Tu dispositivo no soporta geolocalización GPS.');
      return;
    }
    setError(null);
    setGpsSuccessMessage(null);
    setIsGpsLoading(true);
    playWaterDropSound();

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = Number(pos.coords.latitude.toFixed(5));
        const longitude = Number(pos.coords.longitude.toFixed(5));
        setCoords({ lat: latitude, lng: longitude });

        let resolvedAddress = '';

        try {
          // Geocodificación inversa mediante OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'es' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const road = addr.road || addr.pedestrian || '';
            const neighborhood = addr.neighbourhood || addr.suburb || addr.village || addr.city_district || '';
            const city = addr.city || addr.town || addr.county || '';
            const state = addr.state || '';

            const parts = [road, neighborhood, city, state].filter(Boolean);
            if (parts.length > 0) {
              resolvedAddress = parts.join(', ');
            } else if (data.display_name) {
              resolvedAddress = data.display_name.split(',').slice(0, 4).join(', ').trim();
            }
          }
        } catch (geoErr) {
          console.warn('Error en reverse geocoding:', geoErr);
        }

        if (!resolvedAddress) {
          resolvedAddress = `Ubicación GPS (${latitude}, ${longitude})`;
        }

        setFormData((prev) => ({ ...prev, address: resolvedAddress }));
        setGpsSuccessMessage('¡Ubicación GPS detectada correctamente! 📍');
        setIsGpsLoading(false);
        playBubblePopSound(0.4);
      },
      (err) => {
        console.warn('GPS Error:', err);
        setIsGpsLoading(false);
        if (err.code === 1) {
          setError('Permiso de GPS denegado. Puedes escribir tu dirección manualmente.');
        } else {
          setError('No pudimos detectar tu ubicación GPS. Por favor escríbela.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  const handleNextStep1 = () => {
    if (!formData.name.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Por favor ingresa tu número de WhatsApp.');
      return;
    }
    playBubblePopSound(0.25);
    setStep(2);
  };

  const handleNextStep2 = () => {
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!formData.address.trim()) {
      setError('Por favor indica tu dirección o usa el botón de GPS.');
      return;
    }
    playBubblePopSound(0.25);
    setStep(3);
  };

  const handleSubmitStep3 = () => {
    if (!formData.password || formData.password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const regResult = registerUser(
      formData.email,
      formData.password,
      formData.name,
      formData.phone,
      '',
      formData.address,
      coords.lat,
      coords.lng,
      { skipWelcomeModal: true }
    );

    if (regResult && !regResult.success) {
      setError(regResult.error || 'Inconveniente al registrar cuenta.');
      return;
    }

    playBubblePopSound(0.4);
    setStep(4);

    // Tras 2 segundos mostrar animación de despedida y cerrar suavemente
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onSuccess({ name: formData.name, email: formData.email });
        onClose();
        setStep(1);
      }, 1500);
    }, 2000);
  };

  const handleClose = () => {
    playWaterDropSound();
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setStep(1);
    }, 1500);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 top-auto sm:relative sm:inset-auto z-30 sm:z-10 sm:self-end transition-all duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
        isVisible
          ? 'w-full sm:w-[360px] sm:max-w-[360px] sm:-ml-4 opacity-100 max-sm:translate-y-0'
          : 'max-sm:w-full sm:w-0 sm:max-w-0 sm:ml-0 opacity-0 pointer-events-none max-sm:-translate-y-[135%]'
      }`}
    >
      <div
        className={`w-full sm:w-[360px] h-[88vh] sm:h-[570px] max-h-[90vh] bg-white/95 dark:bg-[#1f1535]/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl p-5 sm:p-5 sm:pl-7 shadow-2xl border-2 border-fio-300 dark:border-purple-500/50 flex flex-col justify-between overflow-hidden relative transition-all duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-x-0 opacity-100' : 'sm:-translate-x-32 opacity-20'
        }`}
      >
        {/* Sombra de profundidad en el borde izquierdo traslapado */}
        <div className="hidden sm:block absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-black/40 via-purple-950/20 to-transparent pointer-events-none z-20" />

        {/* Fondo Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-fio-pink/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-fio-100 dark:border-purple-900/40 pb-3">
          {mode === 'cart' ? (
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-gradient-to-tr from-purple-700 to-fio-pink text-white shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bubble font-black text-sm text-fio-900 dark:text-purple-100">
                  Carrito Estrellita
                </h4>
                <p className="text-[10px] text-fio-pink font-bold">
                  {cartProducts.length} {cartProducts.length === 1 ? 'producto en lista' : 'productos en lista'} ✨
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-gradient-to-tr from-fio-pink to-purple-600 text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bubble font-black text-sm text-fio-900 dark:text-purple-100">
                  Registro Rápido
                </h4>
                <p className="text-[10px] text-fio-pink font-bold">
                  {step < 4 ? `Paso ${step} de 3` : '¡Completado!'}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido: MODO CARRITO O MODO REGISTRO */}
        {mode === 'cart' ? (
          <div className="relative z-10 flex-1 flex flex-col justify-between py-3 overflow-hidden">
            {/* Lista de productos agregados estilo Carrito */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {cartProducts.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 dark:text-purple-700 animate-bounce" />
                  <p className="text-xs text-slate-500 dark:text-purple-300 font-semibold">
                    Aún no has agregado productos al carrito.
                  </p>
                </div>
              ) : (
                cartProducts.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-2.5 rounded-2xl bg-white dark:bg-purple-950/60 border border-fio-200/90 dark:border-purple-800/50 shadow-xs flex items-center gap-2.5 animate-in fade-in"
                  >
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&q=80'}
                      alt={product.name}
                      className="w-13 h-13 rounded-xl object-cover border border-fio-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bubble font-bold text-xs text-slate-800 dark:text-purple-100 truncate">
                        {product.name}
                      </h5>
                      <p className="text-[11px] font-black text-fio-pink dark:text-pink-300">
                        {formatCRC(product.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center border border-slate-200 dark:border-purple-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-purple-900/40">
                          <button
                            type="button"
                            onClick={() => onUpdateCartQuantity?.(product.id, Math.max(1, quantity - 1))}
                            className="px-2 py-0.5 text-xs font-bold hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateCartQuantity?.(product.id, quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold truncate">
                          Total: {formatCRC(product.price * quantity)}
                        </span>
                      </div>
                    </div>
                    {onRemoveCartProduct && (
                      <button
                        type="button"
                        onClick={() => onRemoveCartProduct(product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                        title="Quitar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Resumen Financiero */}
            <div className="mt-3 p-3 rounded-2xl bg-fio-50/80 dark:bg-purple-950/50 border border-fio-200/80 dark:border-purple-800/40">
              <div className="flex justify-between text-xs text-slate-600 dark:text-purple-300">
                <span>Subtotal ({cartProducts.reduce((s, i) => s + i.quantity, 0)} unidades):</span>
                <span className="font-bold">{formatCRC(cartSubtotal)}</span>
              </div>
              <div className="pt-1 mt-1 border-t border-fio-200/50 flex justify-between items-baseline">
                <span className="font-bubble font-bold text-xs text-slate-800 dark:text-purple-100">
                  Total en Carrito:
                </span>
                <span className="font-bubble font-black text-sm text-fio-pink dark:text-pink-400">
                  {formatCRC(cartSubtotal)}
                </span>
              </div>
            </div>

            {/* Acciones del Carrito */}
            <div className="pt-3 border-t border-fio-100 dark:border-purple-900/40 space-y-2">
              <button
                type="button"
                onClick={() => {
                  playBubblePopSound(0.4);
                  onProceedToCheckout?.();
                }}
                disabled={cartProducts.length === 0}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-fio-pink to-purple-800 hover:opacity-95 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Pagar los Productos 💳</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onSwitchMode && (
                <button
                  type="button"
                  onClick={() => onSwitchMode('register')}
                  className="w-full text-[11px] font-semibold text-center text-purple-700 dark:text-purple-300 hover:underline cursor-pointer"
                >
                  ✨ ¿Aún no tienes cuenta? Registrarme aquí
                </button>
              )}
            </div>
          </div>
        ) : (
          /* MODO REGISTRO TRADICIONAL */
          <div className="relative z-10 flex-1 flex flex-col justify-center py-3">
            {cartProducts.length > 0 && onSwitchMode && (
              <div className="mb-2 text-center">
                <button
                  type="button"
                  onClick={() => onSwitchMode('cart')}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-fio-pink bg-pink-50 dark:bg-pink-950/50 px-3 py-1 rounded-full border border-pink-200 dark:border-pink-800"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Ver mis {cartProducts.length} productos en carrito</span>
                </button>
              </div>
            )}

            {error && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in">
                {error}
              </div>
            )}

            {/* PASO 1: Nombre y Teléfono */}
            {step === 1 && (
              <div className="space-y-3.5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                    1. Tu Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Ej. Fiorella Jara"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                    2. Número de WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="Ej. 8888-8888"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
                  />
                </div>
              </div>
            )}

            {/* PASO 2: Correo y Dirección con GPS */}
            {step === 2 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                    3. Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="tu@correo.com"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                    4. Dirección o Provincia (Envíos)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => {
                        handleChange('address', e.target.value);
                        if (gpsSuccessMessage) setGpsSuccessMessage(null);
                      }}
                      placeholder="Ej. Tibás, San José o activa tu GPS"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50 pr-8"
                    />
                    {coords.lat ? (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" title="Ubicación GPS fijada">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : null}
                  </div>

                  {/* Botón para activar ubicación GPS */}
                  <button
                    type="button"
                    onClick={handleGetGpsLocation}
                    disabled={isGpsLoading}
                    className="mt-2.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-100 via-pink-50 to-fio-100 hover:from-purple-200 hover:to-pink-100 dark:from-purple-900/50 dark:via-pink-900/30 dark:to-purple-900/40 dark:hover:from-purple-900/70 border border-purple-200 dark:border-purple-700/60 text-fio-900 dark:text-purple-100 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-60"
                  >
                    {isGpsLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-fio-pink" />
                        <span className="text-[11px] text-fio-pink font-semibold">Detectando tu ubicación GPS... ✨</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5 text-fio-pink fill-fio-pink/30" />
                        <span className="text-[11px] font-bubble font-bold text-fio-800 dark:text-purple-200">
                          📍 Usar mi ubicación GPS actual
                        </span>
                      </>
                    )}
                  </button>

                  {gpsSuccessMessage && (
                    <p className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{gpsSuccessMessage}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* PASO 3: Contraseña y Confirmación */}
            {step === 3 && (
              <div className="space-y-3.5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                    5. Crea tu Contraseña
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-purple-200 mb-1">
                    6. Confirma tu Contraseña
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/50 border border-slate-200 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-fio-pink/50"
                  />
                </div>
              </div>
            )}

            {/* PASO 4: Pantalla de Bienvenida */}
            {step === 4 && (
              <div className="text-center py-6 space-y-3 animate-in zoom-in-95 duration-400">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <h3 className="font-bubble font-black text-xl sm:text-2xl text-fio-900 dark:text-purple-100 leading-snug">
                  ¡Bienvenido a by.fio! 🌸🎉
                </h3>
                <p className="text-xs text-slate-600 dark:text-purple-200 font-medium max-w-xs mx-auto">
                  Tu cuenta ha sido creada exitosamente. ¡Estamos listos para crear cosas lindas juntos! ✨
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botones Inferiores (Solo en modo registro) */}
        {mode === 'register' && step < 4 && (
          <div className="relative z-10 pt-3 border-t border-fio-100 dark:border-purple-900/40 flex items-center justify-between gap-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  playWaterDropSound();
                  setStep((prev) => (prev - 1) as any);
                }}
                className="p-2.5 rounded-2xl border border-slate-200 dark:border-purple-800 text-slate-600 dark:text-purple-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={step === 1 ? handleNextStep1 : step === 2 ? handleNextStep2 : handleSubmitStep3}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-fio-pink to-purple-800 hover:opacity-95 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{step === 3 ? 'Finalizar Registro 🌸' : 'Siguiente ✨'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
