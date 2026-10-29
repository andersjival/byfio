import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { ShoppingBag, Search, Sparkles, AlertCircle } from 'lucide-react';

const CATEGORIES: ('Todas' | ProductCategory)[] = [
  'Todas',
  'Agendas Personalizadas',
  'Libros de Vacunas',
  'Artículos Sublimados',
  'Stickers y Papelería',
  'Kits e Insumos',
];

export const ProductsSection: React.FC = () => {
  const { products, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ProductCategory>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [customTextInputs, setCustomTextInputs] = useState<Record<string, string>>({});

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
  };

  return (
    <section id="products-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-fio-pink text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>Tienda Creativa & Insumos</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bubble font-bold text-fio-900">
          Productos Hechos con Amor e Insumos
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Inventario en tiempo real sincronizado con nuestro taller para envíos rápidos y seguros.
        </p>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Pills de Categorías */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 w-full md:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-fio-800 text-white shadow-claySm scale-105'
                  : 'bg-white text-gray-700 border border-fio-200 hover:bg-fio-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Búsqueda */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar producto o SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-2xl border border-fio-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fio-400 shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((p) => {
          const isOutOfStock = p.stock <= 0;
          const isLowStock = p.stock > 0 && p.stock <= p.minStock;

          return (
            <div
              key={p.id}
              className="flex flex-col bg-[#F1F2F6] rounded-3xl overflow-hidden border border-white/90 shadow-neuCard hover:shadow-neuCardHover transition-all duration-300 group"
            >
              {/* Imagen y Estado de Stock */}
              <div className="relative h-44 bg-fio-100 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[10px] font-bold text-gray-700 shadow-sm">
                  {p.category}
                </span>

                {isOutOfStock ? (
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm">
                    Agotado
                  </span>
                ) : isLowStock ? (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>¡Últimas {p.stock}!</span>
                  </span>
                ) : (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                    {p.stock} en stock
                  </span>
                )}
              </div>

              {/* Información y Personalización */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-fio-600 bg-fio-100 px-1.5 py-0.5 rounded">
                      {p.sku}
                    </span>
                    <span className="text-[10px] text-gray-400">{p.unit}</span>
                  </div>

                  <h3 className="font-bubble font-bold text-base text-fio-900 line-clamp-1 mb-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.description}</p>

                  {/* Input de Personalización si Aplica */}
                  {p.isCustomizable && (
                    <div className="mb-3">
                      <label className="block text-[11px] font-semibold text-fio-pink mb-1">
                        ✨ Personalizar con nombre o frase:
                      </label>
                      <input
                        type="text"
                        placeholder={p.customizationPlaceholder || 'Ej: Dra. Valeria / Letra S'}
                        value={customTextInputs[p.id] || ''}
                        onChange={(e) => handleCustomTextChange(p.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-fio-300 text-xs bg-fio-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-fio-500"
                      />
                    </div>
                  )}
                </div>

                {/* Precio y Botón Agregar */}
                <div className="pt-3 border-t border-fio-100 flex items-center justify-between gap-2">
                  <p className="text-lg font-bubble font-bold text-fio-900">
                    {formatCRC(p.price)}
                  </p>

                  <button
                    disabled={isOutOfStock}
                    onClick={() => handleAdd(p)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bubble font-bold transition-all ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'neu-btn-primary active:scale-95'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
