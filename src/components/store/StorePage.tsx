import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product, AppRoute } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { TreeNavigation } from '../common/TreeNavigation';
import {
  ShoppingBag, Search, Sparkles, Heart,
  Check, AlertCircle, Flower2, SlidersHorizontal
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
  const { products, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ProductCategory>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [customTextInputs, setCustomTextInputs] = useState<Record<string, string>>({});
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

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
    addToCart({
      type: 'product',
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      shelfLocation: product.shelfLocation,
      customText: product.isCustomizable ? customText : undefined,
    });
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1400);
  };

  const breadcrumbs = [
    { label: 'by.fio', route: 'home' as AppRoute },
    { label: 'tienda', route: 'store' as AppRoute },
    ...(selectedCategory !== 'Todas' ? [{ label: selectedCategory }] : []),
  ];

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Barra de Árbol con División de Slashes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <TreeNavigation nodes={breadcrumbs} onNavigate={onNavigate} />

        <div className="flex items-center gap-2 text-xs text-slate-500 font-sans tracking-wide self-end sm:self-auto">
          <Flower2 className="w-3.5 h-3.5 text-fio-500" />
          <span>{filteredProducts.length} artículo{filteredProducts.length !== 1 ? 's' : ''} disponibles</span>
        </div>
      </div>

      {/* Encabezado Editorial Estilo SLOW / SPACE */}
      <div className="relative text-center py-8 px-6 rounded-[36px] bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_12px_30px_rgba(180,160,200,0.08)] overflow-hidden">
        {/* Glows interiores */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#D4AEFA]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#FFF07C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5FF] border border-fio-200/60 text-fio-800 text-[11px] font-semibold tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-fio-pink" />
            <span>Tienda Online &amp; Personalizados</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-slate-800 tracking-[0.18em] uppercase font-normal">
            TIENDA / CREATIVA
          </h1>

          <p className="font-sans text-xs sm:text-sm text-slate-500 uppercase tracking-[0.25em] font-medium max-w-lg mx-auto">
            Make room for creativity • Papelería &amp; detalles con alma
          </p>

          <p className="text-xs sm:text-sm text-slate-600 font-sans pt-1 leading-relaxed">
            Cada libreta, agenda y regalo es diseñado, impreso y ensamblado artesanalmente en nuestro taller en San José.
          </p>
        </div>
      </div>

      {/* Barra de Filtros Estilo Zen (Cajitas Suaves) */}
      <div className="p-4 sm:p-5 rounded-[28px] bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_10px_25px_rgba(180,160,200,0.07)] flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Categorías como Pastillas Suaves Rehundidas / Resaltadas */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 w-full lg:w-auto">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] text-white shadow-[0_6px_16px_rgba(192,132,252,0.35),inset_0_1px_2px_rgba(255,255,255,0.7)] scale-[1.03]'
                    : 'bg-[#F5F1EB] text-slate-600 hover:text-slate-900 hover:bg-[#EFEAE2] shadow-[inset_1px_1px_2px_rgba(160,140,190,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.9)]'
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
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all ${
              onlyCustomizable
                ? 'bg-fio-pink text-white shadow-sm'
                : 'bg-[#F5F1EB] text-slate-600 hover:bg-[#EFEAE2]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalizables</span>
          </button>

          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Buscar por nombre o SKU…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F5F1EB] rounded-2xl text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-fio-300 focus:bg-white focus:outline-none shadow-[inset_2px_2px_4px_rgba(160,140,190,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
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
                className="group flex flex-col bg-[#FDFBF9] rounded-[30px] p-4 sm:p-5 border border-white/90 shadow-[10px_14px_28px_rgba(180,160,200,0.1),-8px_-8px_20px_rgba(255,255,255,0.95)] hover:shadow-[14px_18px_36px_rgba(180,160,200,0.18),-10px_-10px_24px_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Contenedor de Imagen con Marco Suave Rehundido */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#F2EDE7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-white/80">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Pastilla de Categoría */}
                  <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-slate-700 shadow-sm border border-white/60">
                    {p.category}
                  </span>

                  {/* Pastilla de Stock */}
                  {isOutOfStock ? (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm">
                      Agotado
                    </span>
                  ) : isLowStock ? (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bold shadow-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{p.stock} disponibles</span>
                    </span>
                  ) : (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-semibold shadow-sm border border-white/60">
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

                    <h3 className="font-serif text-lg text-slate-800 font-semibold leading-snug line-clamp-1 group-hover:text-fio-700 transition-colors">
                      {p.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Input Rehundido de Personalización si Aplica */}
                    {p.isCustomizable && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-semibold text-fio-700 mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-fio-pink" />
                          <span>Personalizar (nombre o frase):</span>
                        </label>
                        <input
                          type="text"
                          placeholder={p.customizationPlaceholder || 'Ej: Sofía / Letra S'}
                          value={customTextInputs[p.id] || ''}
                          onChange={(e) => handleCustomTextChange(p.id, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-[#F4EFEA] text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-fio-300 focus:bg-white focus:outline-none shadow-[inset_1.5px_1.5px_3px_rgba(160,140,190,0.12),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Fila Inferior: Precio + Botón Circular Táctil Estilo Zen */}
                  <div className="pt-3 border-t border-slate-200/50 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                        Precio
                      </span>
                      <p className="font-serif text-xl sm:text-2xl font-bold text-slate-800">
                        {formatCRC(p.price)}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => handleAdd(p)}
                      aria-label={`Agregar ${p.name} al carrito`}
                      className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                        isOutOfStock
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : isAdded
                          ? 'bg-emerald-500 text-white shadow-sm scale-95'
                          : 'bg-gradient-to-r from-[#D4AEFA] to-[#C084FC] hover:from-[#C084FC] hover:to-[#A855F7] text-white shadow-[0_8px_18px_rgba(192,132,252,0.35),inset_0_1px_2px_rgba(255,255,255,0.6)] active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>¡Listo!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Agregar</span>
                        </>
                      )}
                    </button>
                  </div>
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
