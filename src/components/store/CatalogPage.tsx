import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, AppRoute } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { TreeNavigation } from '../common/TreeNavigation';
import {
  Search, Plus, Minus, MessageCircle, Pencil, X, Check,
  ExternalLink, CheckCircle2, ChevronRight
} from 'lucide-react';

// Corazoncito azul oficial de by.fio que reemplaza los iconos genéricos de IA
const BlueHeart: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    className={`${className} text-[#38BDF8] fill-current inline-block shrink-0 drop-shadow-2xs`}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

interface CatalogPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onNavigate }) => {
  const {
    products,
    addToCart,
    setIsCartOpen,
    cart,
    setEditingProduct,
    setIsNewProductModalOpen,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customTextInputs, setCustomTextInputs] = useState<Record<string, string>>({});
  const [addedItemAnim, setAddedItemAnim] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Categorías dinámicas
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['Todas', ...Array.from(set)];
  }, [products]);

  const getQty = (id: string) => quantities[id] || 1;

  const handleQtyChange = (id: string, delta: number, maxStock: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, Math.min(Math.max(1, maxStock), current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleCustomTextChange = (id: string, text: string) => {
    setCustomTextInputs((prev) => ({ ...prev, [id]: text }));
  };

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCustom = !onlyCustomizable || p.isCustomizable;
      return matchesCategory && matchesSearch && matchesCustom;
    });
  }, [products, selectedCategory, searchQuery, onlyCustomizable]);

  const handleAddToCart = (product: Product) => {
    const qty = getQty(product.id);
    const customText = customTextInputs[product.id] || '';

    addToCart({
      type: 'product',
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.image,
      shelfLocation: product.shelfLocation,
      customText: product.isCustomizable ? customText : undefined,
    });

    setAddedItemAnim(product.id);
    setIsCartOpen(true);
    setTimeout(() => setAddedItemAnim(null), 1200);
  };

  const handleDirectWhatsAppOrder = (product: Product) => {
    const qty = getQty(product.id);
    const customText = customTextInputs[product.id];
    const total = product.price * qty;

    let message = `¡Hola Fio! Quiero hacer un pedido desde el Catálogo Online:%0A%0A`;
    message += `📦 *Producto:* ${product.name} (SKU: ${product.sku})%0A`;
    message += `🔢 *Cantidad:* ${qty}%0A`;
    message += `💰 *Precio Unitario:* ${formatCRC(product.price)}%0A`;
    message += `💵 *Total:* ${formatCRC(total)}%0A`;
    if (customText) {
      message += `✍️ *Personalización solicitada:* "${customText}"%0A`;
    }
    message += `%0A¿Me confirmas disponibilidad para pagar con SINPE Móvil al 6400-4640? ¡Muchas gracias!`;

    window.open(`https://wa.me/50664004640?text=${message}`, '_blank');
  };

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  const totalCartPrice = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const breadcrumbs = [
    { label: 'by.fio', route: 'home' as AppRoute },
    { label: 'catálogo online', route: 'catalogo' as AppRoute },
    ...(selectedCategory !== 'Todas' ? [{ label: selectedCategory.toLowerCase() }] : []),
  ];

  return (
    <div className="py-2 sm:py-4 max-w-7xl mx-auto space-y-5 sm:space-y-6 animate-fadeIn">
      {/* Navegación por Árbol */}
      <div className="flex items-center justify-between gap-3">
        <TreeNavigation nodes={breadcrumbs} onNavigate={onNavigate} />
      </div>

      {/* =========================================================================
          BANNER FOTOGRÁFICO EN GRANDE & DESCRIPCIÓN DEL CATÁLOGO
          ========================================================================= */}
      <div className="relative rounded-[32px] overflow-hidden shadow-clayLg border-2 border-white/90 bg-gradient-to-r from-purple-900 via-fio-900 to-pink-900 text-white">
        {/* Imagen de Fondo */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80"
            alt="Papelería by.fio"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Gradientes Ambientales Suaves */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AEFA]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFF07C]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Contenido del Banner con Corazoncito Azul */}
        <div className="relative z-10 p-5 sm:p-8 lg:p-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-white">
            <BlueHeart className="w-3.5 h-3.5" />
            <span>Colección &amp; Catálogo Comercial Oficial</span>
          </div>

          <h1 className="font-bubble font-bold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            Catálogo Online by.fio
          </h1>

          <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed font-sans max-w-3xl">
            Explora toda nuestra papelería bonita, agendas personalizadas con grabado en foil, libros pediátricos de vacunas, libretas de cuero y artículos artesanales hechos a mano en Costa Rica por Fiorella Patricia Jara Gutiérrez (Fio). Precios en colones costarricenses (₡), con entrega en todo el país y pago directo por SINPE Móvil al 6400-4640 o transferencia BCR.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-white/90 font-medium">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs">
              <BlueHeart className="w-3 h-3" />
              <span>{products.length} Productos</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs">
              <BlueHeart className="w-3 h-3" />
              <span>Personalización Artesanal</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs">
              <BlueHeart className="w-3 h-3" />
              <span>SINPE Móvil 6400-4640</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECCIÓN DE CATEGORÍAS CON BOTONES, SELECTOR Y BUSCADOR (NEUMÓRFICO TÁCTIL)
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#F1F2F6] border border-white/90 shadow-neuCard space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BlueHeart className="w-4 h-4" />
            <div>
              <span className="text-[10px] font-bubble font-bold uppercase tracking-wider text-fio-800">
                Categorías del Catálogo
              </span>
              <p className="text-xs text-slate-500 font-sans">
                Selecciona una categoría o busca por nombre o código.
              </p>
            </div>
          </div>

          {/* Buscador Neumórfico Rehundido */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar producto o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#ECEEF2] rounded-2xl border border-white/60 text-xs text-slate-800 placeholder-slate-400 shadow-neuInset focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Botones de Categorías Neumórficos */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const count = cat === 'Todas' ? products.length : products.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bubble font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                  isSelected
                    ? 'neu-btn-primary text-white shadow-neuBtnHover'
                    : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-slate-900 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-600 shadow-neuBtn'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selector Rápido para Celular y Filtro Personalizable */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Selector rápido:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filtrar por categoría del catálogo"
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({cat === 'Todas' ? products.length : products.filter((p) => p.category === cat).length})
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyCustomizable}
              onChange={(e) => setOnlyCustomizable(e.target.checked)}
              className="w-4 h-4 text-fio-800 rounded border-slate-300 focus:ring-fio-400"
            />
            <span className="flex items-center gap-1">
              <BlueHeart className="w-3 h-3" />
              Solo personalizables con nombre
            </span>
          </label>
        </div>
      </div>

      {/* =========================================================================
          PRODUCTOS DEL CATÁLOGO: 2 PRODUCTOS POR FILA (50% DE ESPACIO C/U)
          ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <BlueHeart className="w-3 h-3" />
            <span>Mostrando <span className="text-fio-900">{filteredProducts.length}</span> artículos</span>
            <span className="text-slate-400 font-normal hidden sm:inline">(Toca cualquier producto para ver su descripción detallada)</span>
          </p>

          <button
            type="button"
            onClick={() => onNavigate('store')}
            className="text-xs font-bold text-fio-800 hover:text-fio-600 flex items-center gap-1 transition-colors"
          >
            <span>Ver modo Tienda</span>
            <ExternalLink className="w-3.5 h-3.5 text-fio-pink" />
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-white/70 border border-slate-200/80 space-y-2">
            <p className="font-bubble font-bold text-base text-slate-700">No hay productos que coincidan</p>
            <p className="text-xs text-slate-500">Prueba con otra búsqueda o categoría.</p>
          </div>
        ) : (
          /* GRID DE 2 PRODUCTOS POR FILA (50% ANCHO EN CADA ESPACIO CON ESTILO NEUMÓRFICO) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => {
              const currentQty = getQty(product.id);
              const customVal = customTextInputs[product.id] || '';
              const isAdded = addedItemAnim === product.id;

              return (
                <div
                  key={product.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[#F1F2F6] border border-white/90 shadow-neuCard hover:shadow-neuCardHover transition-all flex flex-col justify-between group"
                >
                  {/* Fila Superior: Foto + Información Básica */}
                  <div className="flex items-start gap-3">
                    {/* Foto Clickable que abre descripción detallada */}
                    <div
                      onClick={() => setDetailProduct(product)}
                      className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer border border-slate-100 group/img"
                      title="Toca para ver foto y descripción en grande"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80';
                        }}
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded bg-black/60 text-white font-mono font-bold text-[9px]">
                        {product.sku}
                      </span>
                    </div>

                    {/* Datos del Producto */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-fio-800 text-[10px] font-semibold truncate">
                          {product.category}
                        </span>

                        {/* Botón Admin para Editar Precio */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsNewProductModalOpen(true);
                          }}
                          className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                          title="Editar precio o datos como admin"
                        >
                          <Pencil className="w-3 h-3 text-fio-pink" />
                        </button>
                      </div>

                      {/* Nombre Clickable */}
                      <h3
                        onClick={() => setDetailProduct(product)}
                        className="font-bubble font-bold text-sm sm:text-base text-fio-900 group-hover:text-fio-700 transition-colors line-clamp-1 cursor-pointer"
                        title="Toca para ver descripción detallada"
                      >
                        {product.name}
                      </h3>

                      {/* Botón para Desplegar Descripción Detallada */}
                      <button
                        type="button"
                        onClick={() => setDetailProduct(product)}
                        className="text-[11px] text-fio-800 font-semibold hover:text-fio-600 flex items-center gap-1 transition-colors text-left"
                      >
                        <BlueHeart className="w-2.5 h-2.5" />
                        <span>Ver descripción completa</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      {/* Precio Destacado */}
                      <div className="pt-0.5">
                        <span className="font-bubble font-bold text-base sm:text-lg text-fio-900">
                          {formatCRC(product.price * currentQty)}
                        </span>
                        {currentQty > 1 && (
                          <span className="text-[10px] text-slate-400 ml-1.5">
                            ({formatCRC(product.price)} c/u)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Personalización Rápida si Aplica */}
                  {product.isCustomizable && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <input
                        type="text"
                        placeholder={product.customizationPlaceholder || 'Nombre para personalizar...'}
                        value={customVal}
                        onChange={(e) => handleCustomTextChange(product.id, e.target.value)}
                        className="w-full px-2.5 py-1 rounded-lg border border-purple-200 bg-purple-50/30 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-fio-300"
                      />
                    </div>
                  )}

                  {/* Fila Inferior: Selector de Cantidad + Botones */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                    {/* Selector de Cantidad [-] 1 [+] con Relieve Neumórfico Inset */}
                    <div className="flex items-center bg-[#ECEEF2] rounded-xl border border-white/70 shadow-neuInset p-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(product.id, -1, product.stock)}
                        disabled={currentQty <= 1}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:bg-[#F1F2F6] hover:shadow-neuBtn disabled:opacity-30 transition-all active:scale-95"
                        title="Restar"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bubble font-bold text-xs text-slate-800 w-6 text-center">
                        {currentQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(product.id, 1, product.stock)}
                        disabled={currentQty >= product.stock}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:bg-[#F1F2F6] hover:shadow-neuBtn disabled:opacity-30 transition-all active:scale-95"
                        title="Sumar"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Botón Agregar al Pedido (Neumórfico Táctil) */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl font-bubble font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white shadow-neuBtn'
                          : 'neu-btn-primary'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Listo!</span>
                        </>
                      ) : (
                        <>
                          <BlueHeart className="w-3 h-3" />
                          <span>Agregar</span>
                        </>
                      )}
                    </button>

                    {/* Botón Directo WhatsApp (Neumórfico) */}
                    <button
                      type="button"
                      onClick={() => handleDirectWhatsAppOrder(product)}
                      className="p-1.5 rounded-xl neu-btn text-emerald-700 shrink-0 transition-all active:scale-95"
                      title="Pedir este producto por WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL DETALLADO EN GRANDE AL TOCAR CUALQUIER PRODUCTO (SIN SCROLLBAR)
          ========================================================================= */}
      {detailProduct && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setDetailProduct(null)}
        >
          <div
            className="relative w-full max-w-2xl lg:max-w-3xl bg-white rounded-3xl shadow-2xl border border-white/80 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[92vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar flotante */}
            <button
              type="button"
              onClick={() => setDetailProduct(null)}
              className="absolute top-3 right-3 z-20 p-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 shadow-md transition-all active:scale-95"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Columna Izquierda: Fotografía */}
            <div className="w-full md:w-1/2 h-48 sm:h-56 md:h-auto bg-slate-100 relative shrink-0">
              <img
                src={detailProduct.image}
                alt={detailProduct.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-mono font-bold text-[10px]">
                SKU: {detailProduct.sku}
              </span>
            </div>

            {/* Columna Derecha: Detalles, Descripción y Acciones (Sin Scrollbar) */}
            <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="space-y-3">
                {/* Categoría y Personalizable */}
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-fio-100 text-fio-800 text-xs font-semibold">
                    {detailProduct.category}
                  </span>
                  {detailProduct.isCustomizable && (
                    <span className="text-[11px] text-fio-pink font-semibold flex items-center gap-1">
                      <BlueHeart className="w-2.5 h-2.5" /> Personalizable
                    </span>
                  )}
                </div>

                {/* Nombre y Precio */}
                <div>
                  <h2 className="font-bubble font-bold text-lg sm:text-xl text-fio-900 leading-tight">
                    {detailProduct.name}
                  </h2>
                  <p className="font-bubble font-bold text-xl sm:text-2xl text-fio-800 mt-1">
                    {formatCRC(detailProduct.price * getQty(detailProduct.id))}
                  </p>
                </div>

                {/* Descripción Detallada */}
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-fio-800 flex items-center gap-1">
                    <BlueHeart className="w-3 h-3" />
                    Descripción
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans line-clamp-4 md:line-clamp-none">
                    {detailProduct.description || `${detailProduct.name} elaborado de forma artesanal y personalizada por by.fio en Costa Rica.`}
                  </p>
                </div>

                {/* Personalización si Aplica */}
                {detailProduct.isCustomizable && (
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
                    <label className="block text-[11px] font-bold text-fio-900">
                      Personalización:
                    </label>
                    <input
                      type="text"
                      placeholder={detailProduct.customizationPlaceholder || 'Ej: Nicole (Foil dorado)'}
                      value={customTextInputs[detailProduct.id] || ''}
                      onChange={(e) => handleCustomTextChange(detailProduct.id, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-purple-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-fio-300"
                    />
                  </div>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(detailProduct);
                    setDetailProduct(null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-clayBtn active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <BlueHeart className="w-3.5 h-3.5" />
                  <span>Agregar al Pedido</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleDirectWhatsAppOrder(detailProduct);
                    setDetailProduct(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bubble font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                  title="Pedir por WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          BARRA RESUMEN DE PEDIDO FLOTANTE
          ========================================================================= */}
      {totalCartCount > 0 && (
        <div className="sticky bottom-4 z-30 p-3 sm:p-4 rounded-3xl bg-white/95 backdrop-blur-md border border-fio-200/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-fio-800 text-white flex items-center justify-center shadow-xs">
              <BlueHeart className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bubble font-bold text-sm text-fio-900">
                Tu Pedido ({totalCartCount} {totalCartCount === 1 ? 'artículo' : 'artículos'})
              </p>
              <p className="text-xs text-slate-500 font-sans">
                Total acumulado: <span className="font-bold text-fio-800">{formatCRC(totalCartPrice)}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-fio-800 to-fio-pink hover:from-fio-900 hover:to-pink-600 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Ver Pedido &amp; Proceder al Pago</span>
            <CheckCircle2 className="w-4 h-4 text-fio-yellow" />
          </button>
        </div>
      )}
    </div>
  );
};
