import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductBarcodeLabel } from './ProductBarcodeLabel';
import {
  X, Printer, Search, Filter, MapPin, Layers, Tag,
  CheckCircle2, ArrowUpDown, Sparkles
} from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface ShelfBarcodeLabelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialShelfLocation?: string;
  initialCategory?: string;
}

export const ShelfBarcodeLabelsModal: React.FC<ShelfBarcodeLabelsModalProps> = ({
  isOpen,
  onClose,
  initialShelfLocation = 'Todas',
  initialCategory = 'Todas',
}) => {
  const { products } = useApp();

  const [selectedShelf, setSelectedShelf] = useState<string>(initialShelfLocation);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'shelf' | 'name' | 'sku'>('shelf');

  React.useEffect(() => {
    if (isOpen) {
      setSelectedShelf(initialShelfLocation);
      setSelectedCategory(initialCategory);
    }
  }, [isOpen, initialShelfLocation, initialCategory]);

  // Lista única de Estanterías con conteo
  const shelfList = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const loc = p.shelfLocation || 'Sin Asignar';
      map.set(loc, (map.get(loc) || 0) + 1);
    });
    const sortedShelves = Array.from(map.keys()).sort();
    return ['Todas', ...sortedShelves];
  }, [products]);

  // Lista única de Categorías con conteo
  const categoryList = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const cat = p.category || 'General';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    const sortedCats = Array.from(map.keys()).sort();
    return ['Todas', ...sortedCats];
  }, [products]);

  // Filtrado y ordenamiento de productos
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesShelf = selectedShelf === 'Todas' || (p.shelfLocation || 'Sin Asignar') === selectedShelf;
      const matchesCategory = selectedCategory === 'Todas' || (p.category || 'General') === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.shelfLocation && p.shelfLocation.toLowerCase().includes(q));

      return matchesShelf && matchesCategory && matchesSearch;
    });

    result.sort((a, b) => {
      if (sortBy === 'shelf') {
        const shelfA = a.shelfLocation || '';
        const shelfB = b.shelfLocation || '';
        if (shelfA !== shelfB) return shelfA.localeCompare(shelfB);
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.sku.localeCompare(b.sku);
    });

    return result;
  }, [products, selectedShelf, selectedCategory, searchQuery, sortBy]);

  if (!isOpen) return null;

  const handlePrint = () => {
    playBubblePopSound(0.4);
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Impresión de Códigos de Barras para Estanterías"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-[32px] shadow-2xl border border-white/90 overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:bg-white"
      >
        {/* Encabezado (Oculto en Impresión) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-100/90 via-pink-100/70 to-purple-50 border-b border-fio-200/80 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-fio-pink text-white flex items-center justify-center font-bubble font-black shadow-clayBtn shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bubble font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <span>Códigos de Barras para Estantes</span>
                <span className="text-xs bg-white text-fio-purple font-mono px-2 py-0.5 rounded-full border border-purple-200">
                  {filteredProducts.length} etiquetas
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Visualiza e imprime en orden los códigos para pegarlos en los estantes del taller.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-clayBtn active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Códigos</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white text-slate-400 hover:text-slate-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Cerrar modal de códigos de barra"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Filtros por Estantería, Categoría y Buscador (Oculto en Impresión) */}
        <div className="p-3 sm:p-4 bg-white/80 border-b border-fio-200/80 shrink-0 space-y-2.5 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Filtro de Estantería */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-fio-pink" />
                <span>Filtrar por Estantería:</span>
              </label>
              <select
                value={selectedShelf}
                onChange={(e) => {
                  setSelectedShelf(e.target.value);
                  playWaterDropSound();
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
              >
                {shelfList.map((shelf) => (
                  <option key={shelf} value={shelf}>
                    {shelf === 'Todas' ? 'Todas las Estanterías' : `📍 ${shelf}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Categoría */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Filtrar por Categoría:</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  playWaterDropSound();
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
              >
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'Todas' ? 'Todas las Categorías' : `🏷️ ${cat}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Buscador */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Buscar Producto o SKU:</span>
              </label>
              <input
                type="text"
                placeholder="Nombre, código o estante..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* Opciones de Ordenamiento Rápido */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold">Ordenar por:</span>
              <button
                type="button"
                onClick={() => setSortBy('shelf')}
                className={`px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  sortBy === 'shelf'
                    ? 'bg-fio-pink text-white border-fio-pink font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                📍 Estantería
              </button>
              <button
                type="button"
                onClick={() => setSortBy('name')}
                className={`px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  sortBy === 'name'
                    ? 'bg-fio-pink text-white border-fio-pink font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                🔤 Nombre A-Z
              </button>
              <button
                type="button"
                onClick={() => setSortBy('sku')}
                className={`px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  sortBy === 'sku'
                    ? 'bg-fio-pink text-white border-fio-pink font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                🏷️ Código SKU
              </button>
            </div>

            <p className="text-[10px] text-slate-400 hidden sm:block">
              Consejo: Configura tu impresora en escala 100% y orientación horizontal o vertical.
            </p>
          </div>
        </div>

        {/* Cuadrícula de Etiquetas para Visualización e Impresión */}
        <div id="printable-shelf-barcodes" className="p-4 sm:p-6 overflow-y-auto flex-1 print:p-2 print:overflow-visible">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Tag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bubble font-bold text-sm text-slate-700">No hay productos que coincidan</h3>
              <p className="text-xs text-slate-400">Prueba cambiando el filtro de estante o categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 print:grid-cols-3 print:gap-2">
              {filteredProducts.map((p) => (
                <ProductBarcodeLabel
                  key={p.id}
                  product={p}
                  showPrice={true}
                  className="shadow-2xs hover:shadow-md transition-shadow"
                />
              ))}
            </div>
          )}
        </div>

        {/* Pie de Página (Oculto en Impresión) */}
        <div className="p-3.5 sm:p-4 bg-white/90 border-t border-fio-200/80 flex items-center justify-between shrink-0 text-xs print:hidden">
          <span className="text-[11px] text-slate-500">
            Formato listo para recortar y pegar en el estante by.fio • <strong>{filteredProducts.length}</strong> códigos listos
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl neu-btn text-slate-700 font-bubble font-bold text-xs cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink text-white font-bubble font-bold text-xs shadow-clayBtn active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir {filteredProducts.length} Etiquetas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
