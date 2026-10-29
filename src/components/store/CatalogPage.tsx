import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, AppRoute } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { TreeNavigation } from '../common/TreeNavigation';
import {
  ShoppingBag, Search, Sparkles, Share2, Link2, CheckCircle2,
  Plus, Minus, MessageCircle, Pencil, Filter, Layers, Check,
  ExternalLink, Package, HeartHandshake, PhoneCall
} from 'lucide-react';

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
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedItemAnim, setAddedItemAnim] = useState<string | null>(null);

  // Categorías dinámicas a partir de productos actuales
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

  const handleCopyCatalogLink = () => {
    const link = `${window.location.origin}/catalogo`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  const handleShareWhatsApp = () => {
    const link = `${window.location.origin}/catalogo`;
    const message = encodeURIComponent(
      `¡Hola! Te comparto el Catálogo Oficial de by.fio con toda nuestra colección de papelería bonita, agendas artesanales y artículos listos para pedir: ${link}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
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
    <div className="py-2 sm:py-4 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Navegación por Árbol */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <TreeNavigation nodes={breadcrumbs} onNavigate={onNavigate} />

        {/* Botones para Compartir el Catálogo Online */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCopyCatalogLink}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-semibold border transition-all ${
              copiedLink
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white/90 hover:bg-white text-slate-700 border-slate-200/80 shadow-xs active:scale-95'
            }`}
            title="Copiar enlace directo del catálogo para compartir"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>¡Link de Catálogo Copiado!</span>
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5 text-fio-pink" />
                <span>Copiar Link del Catálogo</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all active:scale-95 shadow-xs"
            title="Compartir catálogo completo por WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Compartir por WhatsApp</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          BANNER FOTOGRÁFICO EN GRANDE & DESCRIPCIÓN DEL CATÁLOGO
          ========================================================================= */}
      <div className="relative rounded-[36px] overflow-hidden shadow-clayLg border-2 border-white/90 bg-gradient-to-r from-purple-900 via-fio-900 to-pink-900 text-white">
        {/* Imagen de Fondo Editorial */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80"
            alt="Papelería by.fio"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Gradientes Ambientales */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AEFA]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFF07C]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Contenido del Banner */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-fio-yellow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Colección &amp; Catálogo Comercial Oficial</span>
          </div>

          <h1 className="font-bubble font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            Catálogo Online by.fio
          </h1>

          <p className="text-sm sm:text-base text-purple-100/95 leading-relaxed font-sans max-w-3xl">
            Explora toda nuestra papelería bonita, agendas personalizadas con grabado en foil, libros pediátricos de vacunas, libretas de cuero y artículos artesanales hechos a mano en Costa Rica por Fiorella Carballo. Todos los precios están en colones costarricenses (₡), con entrega en todo el país y pago directo mediante SINPE Móvil al 6400-4640.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-white/90 font-medium">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Package className="w-4 h-4 text-fio-yellow" />
              <span>{products.length} Productos Disponibles</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <HeartHandshake className="w-4 h-4 text-pink-300" />
              <span>Personalización Artesanal</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <PhoneCall className="w-4 h-4 text-emerald-300" />
              <span>SINPE Móvil 6400-4640</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECCIÓN ESPECIAL DE CATEGORÍAS CON BOTONES, SELECTOR & BUSCADOR
          ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-fio-800 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-fio-pink" />
              Explora por Categorías
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Selecciona una categoría o utiliza el buscador para localizar artículos específicos.
            </p>
          </div>

          {/* Buscador en Tiempo Real */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-white focus:bg-white rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Botones de Categorías (Pills) */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const count = cat === 'Todas' ? products.length : products.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 ${
                  isSelected
                    ? 'bg-fio-800 text-white shadow-clayBtn scale-[1.02]'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selector Desplegable para Móviles & Filtro de Personalizables */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
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

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyCustomizable}
              onChange={(e) => setOnlyCustomizable(e.target.checked)}
              className="w-4 h-4 text-fio-800 rounded border-slate-300 focus:ring-fio-400"
            />
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-fio-pink" />
              Solo artículos personalizables con nombre
            </span>
          </label>
        </div>
      </div>

      {/* =========================================================================
          LISTA DE PRODUCTOS DEL CATÁLOGO (VISTA EN LISTA EDITORIAL)
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold text-slate-600">
            Mostrando <span className="text-fio-900">{filteredProducts.length}</span> artículos en catálogo
          </p>

          <button
            type="button"
            onClick={() => onNavigate('store')}
            className="text-xs font-bold text-fio-800 hover:text-fio-600 flex items-center gap-1 transition-colors"
          >
            <span>Ver modo Tienda en cuadrícula</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-white/70 border border-slate-200/80 space-y-2">
            <p className="font-bubble font-bold text-lg text-slate-700">No hay productos que coincidan</p>
            <p className="text-xs text-slate-500">Prueba ajustando la búsqueda o seleccionando otra categoría.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const currentQty = getQty(product.id);
              const customVal = customTextInputs[product.id] || '';
              const isAdded = addedItemAnim === product.id;

              return (
                <div
                  key={product.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white/95 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-stretch gap-4 sm:gap-6 group"
                >
                  {/* FOTOGRAFÍA EN GRANDE */}
                  <div className="relative w-full md:w-52 h-48 sm:h-52 md:h-auto rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white font-mono font-bold text-[10px]">
                      {product.sku}
                    </span>

                    {product.stock <= product.minStock && (
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-red-500 text-white font-bold text-[10px]">
                        ¡Últimas unidades!
                      </span>
                    )}
                  </div>

                  {/* INFORMACIÓN Y DESCRIPCIÓN DEL PRODUCTO */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-fio-100 text-fio-800 text-[11px] font-semibold">
                          {product.category}
                        </span>

                        {product.isCustomizable && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-semibold border border-purple-200/60">
                            <Sparkles className="w-3 h-3 text-fio-pink" />
                            Personalizable
                          </span>
                        )}

                        {/* Botón Admin para Editar Precio y Datos */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsNewProductModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition-colors ml-auto"
                          title="Editar precio, foto o descripción de este producto como administrador"
                        >
                          <Pencil className="w-3 h-3 text-fio-pink" />
                          <span>Editar Artículo</span>
                        </button>
                      </div>

                      <h2 className="font-bubble font-bold text-lg sm:text-xl text-fio-900 group-hover:text-fio-800 transition-colors">
                        {product.name}
                      </h2>

                      {/* DESCRIPCIÓN EXTENSA DEL PRODUCTO */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                        {product.description || `${product.name} de alta calidad elaborado artesanalmente por by.fio.`}
                      </p>
                    </div>

                    {/* Campo de Personalización si Aplica */}
                    {product.isCustomizable && (
                      <div className="p-3 rounded-2xl bg-[#FAF5FF] border border-purple-200/70 space-y-1">
                        <label className="block text-[11px] font-bold text-fio-900">
                          Personalización con nombre o frase:
                        </label>
                        <input
                          type="text"
                          placeholder={product.customizationPlaceholder || 'Ej: María José (Foil dorado)'}
                          value={customVal}
                          onChange={(e) => handleCustomTextChange(product.id, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-purple-200 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* PANEL DERECHO DE PRECIO, CANTIDAD Y ACCIONES DE PEDIDO */}
                  <div className="w-full md:w-60 flex flex-col justify-between shrink-0 p-4 rounded-2xl bg-fio-50/60 border border-fio-100/80 space-y-3">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Precio Unitario</p>
                      <p className="font-bubble font-bold text-xl sm:text-2xl text-fio-900">
                        {formatCRC(product.price * currentQty)}
                      </p>
                      {currentQty > 1 && (
                        <p className="text-[11px] text-slate-500 font-sans">
                          {formatCRC(product.price)} c/u × {currentQty}
                        </p>
                      )}
                    </div>

                    {/* Selector Dinámico de Cantidad [-] 1 [+] */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cantidad:</span>
                      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, -1, product.stock)}
                          disabled={currentQty <= 1}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
                          title="Restar cantidad"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bubble font-bold text-sm text-fio-900 w-8 text-center">
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, 1, product.stock)}
                          disabled={currentQty >= product.stock}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
                          title="Sumar cantidad"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Botones de Acción de Pedido */}
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bubble font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gradient-to-r from-fio-800 to-fio-pink hover:from-fio-900 hover:to-pink-600 text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>¡Agregado al Carrito!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Agregar al Pedido</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDirectWhatsAppOrder(product)}
                        className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-bubble font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                        title="Pedir directamente por WhatsApp con SINPE Móvil"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pedir por WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          BARRA RESUMEN DE PEDIDO FLOTANTE (SI HAY PRODUCTOS EN CARRITO)
          ========================================================================= */}
      {totalCartCount > 0 && (
        <div className="sticky bottom-4 z-30 p-3 sm:p-4 rounded-3xl bg-white/95 backdrop-blur-md border border-fio-200/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-fio-800 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5 text-fio-yellow" />
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-fio-800 to-fio-pink hover:from-fio-900 hover:to-pink-600 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Ver Pedido &amp; Finalizar Compra</span>
              <CheckCircle2 className="w-4 h-4 text-fio-yellow" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
