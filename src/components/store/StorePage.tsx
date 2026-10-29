import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product, AppRoute } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { TreeNavigation } from '../common/TreeNavigation';
import {
  ShoppingBag, Search, Sparkles, Heart,
  Check, AlertCircle, Flower2, SlidersHorizontal, Plus, Minus
} from 'lucide-react';

const CATEGORIES: ('Todas' | ProductCategory)[] = [
  'Todas',
  'Agendas Personalizadas',
  'Libros de Vacunas',
  'Artículos Sublimados',
  'Stickers y Papelería',
  'Kits e Insumos',
];

interface StorePageProps {
  onNavigate: (route: AppRoute) => void;
}

export const StorePage: React.FC<StorePageProps> = ({ onNavigate }) => {
  const { products, addToCart, setIsCartOpen } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ProductCategory>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [customTextInputs, setCustomTextInputs] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const getQty = (id: string) => quantities[id] || 1;

  const handleQtyChange = (id: string, delta: number, maxStock: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, Math.min(maxStock, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCustom = !onlyCustomizable || p.isCustomizable;
    return matchesCategory && matchesSearch && matchesCustom;
  });

  const handleCustomTextChange = (prodId: string, val: string) => {
    setCustomTextInputs((prev) => ({ ...prev, [prodId]: val }));
  };

  const handleAdd = (product: Product) => {
    const customText = customTextInputs[product.id] || '';
    const qty = getQty(product.id);
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
    setAddedAnimationId(product.id);
    setIsCartOpen(true);
    setTimeout(() => setAddedAnimationId(null), 1400);
  };

  const breadcrumbs = [
    { label: 'by.fio', route: 'home' as AppRoute },
    { label: 'tienda', route: 'store' as AppRoute },
    ...(selectedCategory !== 'Todas' ? [{ label: selectedCategory }] : []),
  ];

  return (
    <div className="py-2 sm:py-4 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Encabezado Editorial Estilo Neumorphic Soft UI con Árbol Integrado */}
      <div className="relative text-center py-6 sm:py-8 px-6 rounded-[36px] bg-[#F1F2F6] border border-white/90 shadow-neuCard overflow-hidden">
        {/* Glows interiores */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#D4AEFA]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#FFF07C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          {/* Árbol de Navegación Compacto Directo Dentro del Cuadro Neumórfico */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60">
            <TreeNavigation nodes={breadcrumbs} onNavigate={onNavigate} />
            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-[11px] text-slate-500 font-sans tracking-wide bg-[#ECEEF2] px-2.5 py-1 rounded-xl shadow-neuInset border border-white/60">
              <Flower2 className="w-3.5 h-3.5 text-fio-500" />
              <span>{filteredProducts.length} artículo{filteredProducts.length !== 1 ? 's' : ''} disponibles</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-white/90 text-fio-800 text-[11px] font-bubble font-bold tracking-widest uppercase shadow-neuBtn">
            <Sparkles className="w-3 h-3 text-fio-pink" />
            <span>Tienda Online &amp; Personalizados</span>
          </div>

          <h1 className="font-bubble text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight font-bold">
            TIENDA CREATIVA
          </h1>

          <p className="font-sans text-xs sm:text-sm text-slate-500 uppercase tracking-[0.25em] font-medium max-w-lg mx-auto">
            Make room for creativity • Papelería &amp; detalles con alma
          </p>

          <p className="text-xs sm:text-sm text-slate-600 font-sans pt-1 leading-relaxed">
            Cada libreta, agenda y regalo es diseñado, impreso y ensamblado artesanalmente en nuestro taller en San José.
          </p>
        </div>
      </div>

      {/* Barra de Filtros Neumórfica (Cajas y Botones Táctiles) */}
      <div className="p-4 sm:p-5 rounded-[28px] bg-[#F1F2F6] border border-white/90 shadow-neuCard flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Categorías como Botones Neumórficos Grandes y Táctiles */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 w-full lg:w-auto">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bubble font-bold tracking-wide transition-all duration-200 ${
                  isSelected
                    ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.02]'
                    : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-slate-900 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Buscador y Toggle de Personalizados */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setOnlyCustomizable(!onlyCustomizable)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bubble font-bold transition-all ${
              onlyCustomizable
                ? 'neu-btn-amber text-white shadow-neuBtnHover'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalizables</span>
          </button>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar por nombre o SKU…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#ECEEF2] rounded-2xl text-xs text-slate-800 placeholder-slate-400 border border-white/60 shadow-neuInset focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid de Productos — "Cajitas Bonitas" Estilo Neumórfico Suave */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-[32px] bg-white/60 border border-white/80 shadow-sm space-y-3">
          <Flower2 className="w-8 h-8 text-fio-300 mx-auto" />
          <h3 className="font-serif text-xl text-slate-700 tracking-wider">No se encontraron productos</h3>
          <p className="text-xs text-slate-500">Intenta con otra búsqueda o selecciona otra categoría.</p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('Todas'); setSearchQuery(''); setOnlyCustomizable(false); }}
            className="mt-2 px-4 py-2 rounded-2xl bg-fio-800 text-white text-xs font-semibold shadow-sm"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stock <= 0;
            const isLowStock = p.stock > 0 && p.stock <= p.minStock;
            const isAdded = addedAnimationId === p.id;

            return (
              <div
                key={p.id}
                className="group flex flex-col bg-[#F1F2F6] rounded-[30px] p-4 sm:p-5 border border-white/90 shadow-neuCard hover:shadow-neuCardHover transition-all duration-300"
              >
                {/* Contenedor de Imagen con Marco Neumórfico Rehundido */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#ECEEF2] shadow-neuInset border border-white/80">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Pastilla de Categoría */}
                  <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-700 shadow-neuBtn border border-white/60">
                    {p.category}
                  </span>

                  {/* Pastilla de Stock */}
                  {isOutOfStock ? (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-neuBtn">
                      Agotado
                    </span>
                  ) : isLowStock ? (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bold shadow-neuBtn flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{p.stock} disponibles</span>
                    </span>
                  ) : (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-emerald-700 text-[10px] font-bold shadow-neuBtn border border-white/60">
                      Stock: {p.stock}
                    </span>
                  )}
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="pt-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{p.sku}</span>
                      <span className="text-slate-500 font-sans">{p.unit}</span>
                    </div>

                    <h3 className="font-bubble text-lg text-slate-900 font-bold leading-snug line-clamp-1 group-hover:text-fio-800 transition-colors">
                      {p.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-sans">
                      {p.description}
                    </p>

                    {/* Input Rehundido de Personalización si Aplica */}
                    {p.isCustomizable && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-fio-800 mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-fio-pink" />
                          <span>Personalizar (nombre o frase):</span>
                        </label>
                        <input
                          type="text"
                          placeholder={p.customizationPlaceholder || 'Ej: Sofía / Letra S'}
                          value={customTextInputs[p.id] || ''}
                          onChange={(e) => handleCustomTextChange(p.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#ECEEF2] text-xs text-slate-800 placeholder-slate-400 border border-white/60 shadow-neuInset focus:outline-none transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Fila Inferior: Precio Dinámico + Selector [ - 1 + ] + Botón Agregar */}
                  {(() => {
                    const currentQty = getQty(p.id);
                    const currentTotalPrice = p.price * currentQty;

                    return (
                      <div className="pt-3 border-t border-slate-200/60 space-y-2.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                              {currentQty > 1 ? `Total (${currentQty} un.)` : 'Precio'}
                            </span>
                            <p className="font-bubble text-xl sm:text-2xl font-bold text-slate-900">
                              {formatCRC(currentTotalPrice)}
                            </p>
                          </div>

                          {/* Selector de Cantidad: [-] 1 [+] Neumórfico */}
                          {!isOutOfStock && (
                            <div className="flex items-center gap-1.5 bg-[#ECEEF2] p-1 rounded-xl border border-white/60 shadow-neuInset">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(p.id, -1, p.stock)}
                                disabled={currentQty <= 1}
                                className="w-7 h-7 neu-btn-circle text-slate-700 hover:text-fio-800 disabled:opacity-35 disabled:cursor-not-allowed shadow-neuBtn transition-all active:scale-95"
                                title="Reducir cantidad"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <span className="w-6 text-center text-xs font-bold text-slate-900 select-none">
                                {currentQty}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleQtyChange(p.id, 1, p.stock)}
                                disabled={currentQty >= p.stock}
                                className="w-7 h-7 neu-btn-circle text-slate-700 hover:text-fio-800 disabled:opacity-35 disabled:cursor-not-allowed shadow-neuBtn transition-all active:scale-95"
                                title="Aumentar cantidad"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Botón Agregar al Carrito Neumórfico - Estilo Pill Lila a Fucsia Suave */}
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => handleAdd(p)}
                          aria-label={`Agregar ${p.name} al carrito`}
                          className={`w-full relative flex items-center justify-center gap-2 py-3 px-5 rounded-full text-xs sm:text-sm font-bubble font-bold transition-all duration-200 ${
                            isOutOfStock
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : isAdded
                              ? 'bg-emerald-600 text-white shadow-neuBtn'
                              : 'neu-btn-cart text-white shadow-neuBtn active:scale-95'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>¡Agregado al Carrito!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 text-white" />
                              <span>Agregar al Carrito {currentQty > 1 ? `(${currentQty})` : ''}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Frase Calm & Artisanal al Pie */}
      <div className="text-center py-6 text-xs text-slate-400 font-sans tracking-widest uppercase">
        • Cada pieza es creada individualmente con materiales de primera calidad •
      </div>
    </div>
  );
};
