import { LayawaySelectionModal } from './LayawaySelectionModal';
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { formatCRC, getWhatsAppLink } from '../../utils/formatters';
import { isProductLayawayEligible, getProductLayawayDetails } from '../../utils/layaway';
import {
  X, ChevronLeft, ChevronRight, ShoppingBag, MessageCircle,
  Sparkles, Check, AlertCircle, Plus, Minus, Tag, MapPin, BookmarkCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number, customText?: string) => void;
  initialCustomText?: string;
  onCustomTextChange?: (text: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  initialCustomText = '',
  onCustomTextChange,
}) => {
  const { addToCart, cart, inventoryMode, setIsCheckoutOpen } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState(initialCustomText);
  const [isAddedAnim, setIsAddedAnim] = useState(false);
  const [isLayawayAddedAnim, setIsLayawayAddedAnim] = useState(false);
  const [isLayawayModalOpen, setIsLayawayModalOpen] = useState(false);

  // Lista de imágenes: si tiene `images` con elementos las usa, si no hace fallback a `[product.image]`
  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      const real = product.images.filter((img) => typeof img === 'string' && !img.includes('placeholder-new-product'));
      if (real.length > 0) return real;
      return product.images;
    }
    if (product.sku === 'FIO-TAZ-03' || product.id === 'prod-3') {
      return [
        '/images/products/taza-stitch-ohana.jpg',
        '/images/products/taza-dragonball-super.jpg',
        '/images/products/taza-ariel-sirenita.jpg',
        '/images/products/taza-lilo-stitch-princess.jpg',
        '/images/products/taza-looney-tunes-bugs.jpg',
      ];
    }
    return [product.image];
  }, [product]);

  // Resetear estados al cambiar de producto
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);
      setCustomText(initialCustomText);
      setIsAddedAnim(false);
    }
  }, [product?.id, initialCustomText]);

  // Teclado: Escape para cerrar, Flechas para navegar imágenes
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, images.length, onClose]);

  if (!product) return null;

  const isOutOfStock = inventoryMode === 'availability' ? false : product.stock <= 0;
  const isLowStock = inventoryMode === 'availability' ? false : (product.stock > 0 && product.stock <= product.minStock);
  const maxStockLimit = inventoryMode === 'availability' ? 99 : Math.max(1, product.stock);
  const isLayaway = isProductLayawayEligible(product);
  const lay = isLayaway ? getProductLayawayDetails(product) : null;

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleCustomTextUpdate = (val: string) => {
    setCustomText(val);
    if (onCustomTextChange) {
      onCustomTextChange(val);
    }
  };

  const handleAdd = () => {
    if (isOutOfStock) return;

    if (onAddToCart) {
      onAddToCart(product, quantity, product.isCustomizable ? customText : undefined);
    } else {
      addToCart({
        type: 'product',
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        quantity,
        image: images[activeImageIndex] || product.image,
        shelfLocation: product.shelfLocation,
        customText: product.isCustomizable ? customText : undefined,
      });
    }

    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 2000);
  };

  const handleAddLayaway = () => {
    if (isOutOfStock || !product) return;
    setIsLayawayModalOpen(true);
  };

  const handleConfirmLayaway = (prod: Product, downPaymentAmount: number, customTxt?: string) => {
    const lay = getProductLayawayDetails(prod);
    const remaining = Math.max(0, prod.price - downPaymentAmount);
    const daysTotal = (lay.months || 1) * 30;
    const dueDate = new Date(Date.now() + daysTotal * 24 * 60 * 60 * 1000).toISOString();

    addToCart({
      type: 'product',
      id: prod.id,
      sku: prod.sku,
      name: prod.name,
      price: downPaymentAmount,
      quantity: 1,
      image: images[activeImageIndex] || prod.image,
      shelfLocation: prod.shelfLocation,
      customText: customTxt || (prod.isCustomizable ? customText : undefined),
      isLayaway: true,
      layawayMonths: lay.months,
      layawayPaymentsCount: lay.paymentsCount,
      layawayDownPaymentPercent: Math.round((downPaymentAmount / prod.price) * 100),
      layawayTotalAmount: prod.price,
      layawayDownPaymentAmount: downPaymentAmount,
      layawayRemainingAmount: remaining,
      layawayDueDate: dueDate,
      layawayDaysTotal: daysTotal,
    });

    setIsLayawayModalOpen(false);
    onClose();
    setIsCheckoutOpen(true);
  };

  const generateWhatsAppInquiryMessage = () => {
    let msg = `¡Hola by.fio! 🌸 Me encantó este producto de la tienda y quiero más detalles o pedirlo:\n\n`;
    msg += `📦 *Producto:* ${product.name}\n`;
    msg += `🏷️ *Código SKU:* ${product.sku}\n`;
    msg += `🔢 *Cantidad:* ${quantity}\n`;
    msg += `💰 *Precio:* ${formatCRC(product.price * quantity)}\n`;
    if (product.isCustomizable && customText.trim()) {
      msg += `✨ *Personalización deseada:* "${customText.trim()}"\n`;
    }
    msg += `\n¿Tienen disponibilidad para envío o retiro? ¡Muchas gracias! 💕`;
    return msg;
  };

  const currentImage = images[activeImageIndex] || product.image;
  const safeCart = Array.isArray(cart) ? cart.filter(Boolean) : [];
  const isAlreadyInCart = safeCart.some((it) => it && it.id === product.id);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-5 md:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-white/80 overflow-hidden flex flex-col md:flex-row max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón flotante para cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 shadow-md flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================
            COLUMNA IZQUIERDA: GALERÍA DE FOTOS
            ======================================================== */}
        <div className="w-full md:w-1/2 bg-slate-100 flex flex-col justify-between relative shrink-0 p-3 sm:p-4 border-b md:border-b-0 md:border-r border-slate-200">
          {/* Contenedor de la Imagen Principal con Ambient Blur de Fondo */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-inner group flex items-center justify-center">
            {/* Fondo difuminado sutil para evitar letterboxes */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-40 scale-110"
              style={{ backgroundImage: `url(${currentImage})` }}
            />

            {/* Imagen Principal Nítida */}
            <img
              src={currentImage}
              alt={`${product.name} - foto ${activeImageIndex + 1}`}
              className="relative z-10 w-full h-full object-contain p-1.5 transition-transform duration-300"
            />

            {/* SKU Badge en la esquina inferior */}
            <span className="absolute bottom-2.5 left-2.5 z-20 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white font-mono font-bold text-[10px] shadow-sm flex items-center gap-1">
              <Tag className="w-3 h-3 text-fio-yellow" />
              <span>SKU: {product.sku}</span>
            </span>

            {/* Contador de Imágenes */}
            {images.length > 1 && (
              <span className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 font-bubble font-bold text-[10px] shadow-sm">
                {activeImageIndex + 1} / {images.length}
              </span>
            )}

            {/* Flechas de Navegación (solo si hay más de 1 foto) */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                  title="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                  title="Foto siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Carrusel de Miniaturas (Thumbnails) */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-fio-800 ring-2 ring-fio-400 scale-105 shadow-md'
                      : 'border-slate-300/80 opacity-70 hover:opacity-100 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================
            COLUMNA DERECHA: INFORMACIÓN, PERSONALIZACIÓN Y COMPRA
            ======================================================== */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-none scrollbar-none">
          <div className="space-y-3.5">
            {/* Etiquetas de Categoría y Disponibilidad */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 text-xs font-bold font-bubble">
                {product.category}
              </span>

              {inventoryMode === 'availability' ? (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>Disponible para pedido</span>
                </span>
              ) : isOutOfStock ? (
                <span className="px-2.5 py-1 rounded-xl bg-red-100 text-red-800 text-[11px] font-bold">
                  Agotado
                </span>
              ) : isLowStock ? (
                <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>¡Últimas {product.stock} unidades!</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{product.stock} en stock</span>
                </span>
              )}

              {isAlreadyInCart && (
                <span className="px-2.5 py-1 rounded-xl bg-fio-100 text-fio-800 text-[11px] font-bold flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-fio-pink" />
                  <span>En tu carrito</span>
                </span>
              )}
            </div>

            {/* Nombre y Precio */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bubble font-bold text-fio-900 leading-tight">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-2xl sm:text-3xl font-bubble font-bold text-fio-800">
                  {formatCRC(product.price * quantity)}
                </span>
                {quantity > 1 && (
                  <span className="text-xs text-slate-500 font-medium">
                    ({formatCRC(product.price)} c/u)
                  </span>
                )}
              </div>
            </div>

            {/* Descripción Completa */}
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <p>{product.description || 'Producto artesanal elaborado con amor y dedicación en Costa Rica por el equipo de by.fio.'}</p>
              {product.shelfLocation && (
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-fio-pink shrink-0" />
                  <span>Ubicación en taller: <strong>{product.shelfLocation}</strong></span>
                </div>
              )}
            </div>

            {/* Tarjeta Informativa de Sistema de Apartados */}
            {lay && (
              <div className="p-3.5 bg-gradient-to-r from-amber-50 via-white to-pink-50/40 rounded-2xl border-2 border-amber-300 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bubble font-bold text-amber-950 text-xs sm:text-sm">
                    <BookmarkCheck className="w-4 h-4 text-amber-600" />
                    <span>Sistema de Apartados Disponible</span>
                  </div>
                  <span className="text-[10px] bg-amber-200/90 text-amber-950 px-2.5 py-0.5 rounded-full font-bold">
                    {lay.downPaymentPercent}% Inicial
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-0.5">
                  <div className="p-2 rounded-xl bg-white border border-amber-200 shadow-2xs">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase">1ª Cuota Hoy</span>
                    <span className="font-bubble font-bold text-xs sm:text-sm text-amber-900">
                      {formatCRC(lay.downPaymentAmount * quantity)}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-amber-200 shadow-2xs">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase">Cuotas Restantes</span>
                    <span className="font-bubble font-bold text-xs sm:text-sm text-slate-800">
                      {lay.remainingPaymentsCount}x {formatCRC(lay.installmentAmount * quantity)}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-amber-200 shadow-2xs">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase">Plazo Máximo</span>
                    <span className="font-bubble font-bold text-xs sm:text-sm text-slate-800">
                      {lay.months} {lay.months === 1 ? 'mes' : 'meses'}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-600 text-center leading-tight">
                  Aparta este equipo abonando la 1ª cuota de <strong className="text-amber-900">{formatCRC(lay.downPaymentAmount * quantity)}</strong> y te reservamos la unidad de inmediato.
                </p>
              </div>
            )}

            {/* Input de Personalización si el Producto lo Permite */}
            {product.isCustomizable && (
              <div className="p-3 bg-pink-50/70 rounded-2xl border border-pink-200 space-y-1.5">
                <label className="text-xs font-bold text-fio-pink flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-fio-pink fill-current" />
                  <span>Personalización Especial:</span>
                </label>
                <input
                  type="text"
                  placeholder={product.customizationPlaceholder || 'Ej: Nombre Sofía / Letra S en lila'}
                  value={customText}
                  onChange={(e) => handleCustomTextUpdate(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-pink-300 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-fio-400 placeholder-slate-400"
                />
                <p className="text-[10px] text-slate-500">
                  Indica el nombre, inicial o detalles con los que deseas que elaboremos tu producto.
                </p>
              </div>
            )}
          </div>

          {/* Acciones de Compra y Carrito */}
          <div className="pt-4 mt-4 border-t border-slate-200 space-y-2.5 shrink-0">
            {/* Selector de Cantidad */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Cantidad:</span>
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bubble font-bold text-base text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= maxStockLimit || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(maxStockLimit, q + 1))}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* BOTÓN REALIZAR APARTADO (si aplica) */}
            {lay && (
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddLayaway}
                className={`w-full py-3 px-4 rounded-2xl font-bubble font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : isLayawayAddedAnim
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/25'
                }`}
              >
                {isLayawayAddedAnim ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3] text-white" />
                    <span>¡Apartado Agregado al Carrito! 🎉</span>
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="w-5 h-5 text-amber-100" />
                    <span>Realizar Apartado (Pagar 1ª Cuota: {formatCRC(lay.downPaymentAmount * quantity)})</span>
                  </>
                )}
              </button>
            )}

            {/* Botón Comprar de Contado */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAdd}
              className={`w-full py-2.5 px-4 rounded-2xl font-bubble font-bold transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                lay
                  ? 'border-2 border-slate-300 hover:bg-slate-100 text-slate-700 text-xs'
                  : isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none text-sm'
                  : isAddedAnim
                  ? 'bg-emerald-600 text-white text-sm'
                  : 'bg-fio-800 hover:bg-fio-900 text-white text-sm shadow-md'
              }`}
            >
              {isAddedAnim ? (
                <>
                  <Check className="w-5 h-5 stroke-[3] text-white" />
                  <span>¡Agregado al Carrito! 🎉</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-fio-yellow" />
                  <span>
                    {lay
                      ? `Comprar de Contado (${formatCRC(product.price * quantity)})`
                      : `Agregar ${quantity > 1 ? `${quantity} unidades ` : ''}al Carrito`}
                  </span>
                </>
              )}
            </button>

            {/* Botón Directo WhatsApp */}
            <a
              href={getWhatsAppLink('64004640', generateWhatsAppInquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bubble font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Consultar o Pedir por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>


      {/* Modal Interactivo de Selección de Monto de Apartado */}
      <LayawaySelectionModal
        product={product}
        isOpen={isLayawayModalOpen}
        onClose={() => setIsLayawayModalOpen(false)}
        onConfirmLayaway={handleConfirmLayaway}
        initialCustomText={product?.isCustomizable ? customText : ''}
      />
    </div>
  );
};
