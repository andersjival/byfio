import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { ProductBarcodeLabel } from './ProductBarcodeLabel';
import { BrandLogo } from '../common/BrandLogo';
import {
  X, Printer, Search, MapPin, Layers, Tag,
  Building2, ArrowUpDown, FileText, Copy, CheckCircle2,
  Sparkles, SlidersHorizontal, Eye
} from 'lucide-react';
import { playWaterDropSound, playBubblePopSound } from '../../utils/soundEffects';

interface ShelfBarcodeLabelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialShelfLocation?: string;
  initialCategory?: string;
}

const LABELS_PER_SHEET = 21; // Estándar oficial de 21 etiquetas por hoja (3 columnas x 7 filas)

export const ShelfBarcodeLabelsModal: React.FC<ShelfBarcodeLabelsModalProps> = ({
  isOpen,
  onClose,
  initialShelfLocation = 'Todas',
  initialCategory = 'Todas',
}) => {
  const { products, supplierOrders } = useApp();

  const [selectedShelf, setSelectedShelf] = useState<string>(initialShelfLocation);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'shelf' | 'name' | 'category' | 'supplier' | 'sku'>('shelf');
  const [printMode, setPrintMode] = useState<'catalog' | 'single_product'>('catalog');
  const [singleProductId, setSingleProductId] = useState<string>('');
  const [activeSheetIndex, setActiveSheetIndex] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedShelf(initialShelfLocation);
      setSelectedCategory(initialCategory);
      if (products.length > 0 && !singleProductId) {
        setSingleProductId(products[0].id);
      }
    }
  }, [isOpen, initialShelfLocation, initialCategory, products]);

  // Lista única de Estanterías
  const shelfList = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const loc = p.shelfLocation || 'Estante 1 (Principal)';
      map.set(loc, (map.get(loc) || 0) + 1);
    });
    const sortedShelves = Array.from(map.keys()).sort();
    return ['Todas', ...sortedShelves];
  }, [products]);

  // Lista única de Categorías
  const categoryList = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const cat = p.category || 'General';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    const sortedCats = Array.from(map.keys()).sort();
    return ['Todas', ...sortedCats];
  }, [products]);

  // Lista única de Proveedores (obtenidos de productos y órdenes de compra)
  const supplierList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.supplier && p.supplier.trim()) set.add(p.supplier.trim());
    });
    supplierOrders.forEach((so) => {
      if (so.supplierName && so.supplierName.trim()) set.add(so.supplierName.trim());
    });
    // Opciones predeterminadas de referencia en Costa Rica si no hay aún
    if (set.size === 0) {
      set.add('Papelera Costa Rica');
      set.add('SubliCR');
      set.add('Insumos Creativos');
      set.add('Graficentro');
    }
    return ['Todos', ...Array.from(set).sort()];
  }, [products, supplierOrders]);

  // Filtrado de productos para la hoja
  const filteredProducts = useMemo(() => {
    if (printMode === 'single_product') {
      const single = products.find((p) => p.id === singleProductId) || products[0];
      if (!single) return [];
      // Generar exactamente 21 etiquetas del mismo producto para llenar la hoja
      return Array(LABELS_PER_SHEET).fill(single);
    }

    let result = products.filter((p) => {
      // Filtro por estantería (soporta coincidencia con "Estante 1", "Estante 2", etc.)
      let matchesShelf = true;
      if (selectedShelf !== 'Todas') {
        const pLoc = (p.shelfLocation || '').toLowerCase();
        const selLoc = selectedShelf.toLowerCase();
        if (selLoc.includes('estante 1') || selLoc === 'estante 1') {
          matchesShelf = pLoc.includes('estante 1') || pLoc.includes('estante a-1') || pLoc.includes('estante a1') || pLoc === selLoc;
        } else if (selLoc.includes('estante 2') || selLoc === 'estante 2') {
          matchesShelf = pLoc.includes('estante 2') || pLoc.includes('estante a-2') || pLoc.includes('estante a2') || pLoc === selLoc;
        } else {
          matchesShelf = pLoc === selLoc;
        }
      }

      // Filtro por categoría
      const matchesCategory = selectedCategory === 'Todas' || (p.category || 'General') === selectedCategory;

      // Filtro por proveedor
      const matchesSupplier =
        selectedSupplier === 'Todos' ||
        (p.supplier && p.supplier.toLowerCase().includes(selectedSupplier.toLowerCase()));

      // Búsqueda por texto (nombre, SKU, estante)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.shelfLocation && p.shelfLocation.toLowerCase().includes(q)) ||
        (p.supplier && p.supplier.toLowerCase().includes(q));

      return matchesShelf && matchesCategory && matchesSupplier && matchesSearch;
    });

    // Ordenamiento
    result.sort((a, b) => {
      if (sortBy === 'shelf') {
        const shelfA = a.shelfLocation || '';
        const shelfB = b.shelfLocation || '';
        if (shelfA !== shelfB) return shelfA.localeCompare(shelfB);
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'category') {
        const catA = a.category || '';
        const catB = b.category || '';
        if (catA !== catB) return catA.localeCompare(catB);
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'supplier') {
        const supA = a.supplier || '';
        const supB = b.supplier || '';
        if (supA !== supB) return supA.localeCompare(supB);
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.sku.localeCompare(b.sku);
    });

    return result;
  }, [products, printMode, singleProductId, selectedShelf, selectedCategory, selectedSupplier, searchQuery, sortBy]);

  // División estricta en hojas de exactamente 21 etiquetas (3 columnas x 7 filas)
  const sheets = useMemo(() => {
    const chunks: Product[][] = [];
    if (filteredProducts.length === 0) return [];
    for (let i = 0; i < filteredProducts.length; i += LABELS_PER_SHEET) {
      chunks.push(filteredProducts.slice(i, i + LABELS_PER_SHEET));
    }
    return chunks;
  }, [filteredProducts]);

  if (!isOpen) return null;

  const handlePrint = () => {
    playBubblePopSound(0.4);
    window.print();
  };

  const selectedCategoryLabel = selectedCategory === 'Todas' ? 'Todas las Categorías de Producto' : selectedCategory;
  const selectedShelfLabel = selectedShelf === 'Todas' ? 'Todos los Estantes' : selectedShelf;
  const selectedSupplierLabel = selectedSupplier === 'Todos' ? 'Todos los Proveedores' : selectedSupplier;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Impresión de 21 Códigos de Barras por Hoja con Logo y Categoría"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white animate-fadeIn"
    >
      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 6mm 5mm 6mm 5mm;
          }
          body {
            background: #ffffff !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .byfio-print-sheet {
            page-break-after: always !important;
            break-after: page !important;
            height: 268mm !important;
            max-height: 268mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            margin-bottom: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .byfio-print-sheet:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .byfio-sheet-header {
            height: 18mm !important;
            max-height: 18mm !important;
            margin-bottom: 2mm !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            border-bottom: 2px solid #000000 !important;
            padding-bottom: 1.5mm !important;
            box-sizing: border-box !important;
          }
          .byfio-sheet-grid-21 {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            grid-template-rows: repeat(7, 1fr) !important;
            gap: 1.8mm !important;
            height: 246mm !important;
            max-height: 246mm !important;
            box-sizing: border-box !important;
          }
          .byfio-label-cell {
            height: 33mm !important;
            max-height: 33mm !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl bg-[#FAF8F5] rounded-[32px] shadow-2xl border border-white/90 overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:bg-white"
      >
        {/* Encabezado Principal de Control (Oculto en Impresión) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-100/90 via-pink-100/70 to-purple-50 border-b border-fio-200/80 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-fio-pink text-white flex items-center justify-center font-bubble font-black shadow-clayBtn shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bubble font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <span>Hojas de 21 Códigos de Barras ByFio</span>
                <span className="text-xs bg-white text-fio-purple font-mono font-bold px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                  {filteredProducts.length} etiquetas • {sheets.length} {sheets.length === 1 ? 'hoja' : 'hojas'}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Formato estándar de 21 etiquetas por hoja (3×7) con logo ByFio y categoría.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={filteredProducts.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-clayBtn active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir {sheets.length} {sheets.length === 1 ? 'Hoja' : 'Hojas'} (21/hoja)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white text-slate-400 hover:text-slate-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Filtros Multifuncional: Categoría, Estante, Proveedor, Nombre (Oculto en Impresión) */}
        <div className="p-3 sm:p-4 bg-white/95 border-b border-fio-200/80 shrink-0 space-y-3 print:hidden">
          {/* Selector de Modo: Imprimir Lote vs Repetir 1 Producto 21 veces */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700">Modo de Hoja:</span>
              <button
                type="button"
                onClick={() => {
                  setPrintMode('catalog');
                  playWaterDropSound();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                  printMode === 'catalog'
                    ? 'bg-fio-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📋 Catálogo Filtrado (21 distintos por hoja)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrintMode('single_product');
                  playWaterDropSound();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bubble font-bold transition-all cursor-pointer ${
                  printMode === 'single_product'
                    ? 'bg-fio-pink text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ⭐ Llenar Hoja con 1 Solo Producto (21 copias)
              </button>
            </div>

            {/* Accesos rápidos para Estante 1, 2, etc. */}
            {printMode === 'catalog' && (
              <div className="flex items-center gap-1 text-[11px] overflow-x-auto">
                <span className="text-slate-400 font-medium">Accesos rápidos:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShelf('Estante 1 (Principal)');
                    playWaterDropSound();
                  }}
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                    selectedShelf.toLowerCase().includes('estante 1')
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  📍 Estante 1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShelf('Estante A-2 (Nivel 1)');
                    playWaterDropSound();
                  }}
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                    selectedShelf.toLowerCase().includes('estante 2') || selectedShelf.toLowerCase().includes('a-2')
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  📍 Estante 2
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShelf('Todas');
                    setSelectedCategory('Todas');
                    setSelectedSupplier('Todos');
                    setSearchQuery('');
                    playWaterDropSound();
                  }}
                  className="px-2 py-0.5 rounded-lg border bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-200 text-[10px] cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {printMode === 'single_product' ? (
            /* Selector de Producto Único para la Hoja */
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-purple-50/60 p-3 rounded-2xl border border-purple-200">
              <label className="text-xs font-bold text-purple-900 flex items-center gap-1 shrink-0">
                <Sparkles className="w-4 h-4 text-fio-pink" />
                <span>Selecciona el producto a duplicar 21 veces en la hoja:</span>
              </label>
              <select
                value={singleProductId}
                onChange={(e) => {
                  setSingleProductId(e.target.value);
                  playWaterDropSound();
                }}
                className="flex-1 px-3 py-2 rounded-xl border border-purple-200 text-xs font-bold focus:ring-2 focus:ring-fio-400 focus:outline-none bg-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] {p.name} — ({p.category}) — {p.shelfLocation || 'Estante 1'}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            /* Controles de 4 Filtros: Categoría, Estante, Proveedor y Nombre */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* 1. Filtro por Categoría */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>Categoría de Producto:</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    playWaterDropSound();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
                >
                  {categoryList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'Todas' ? '🏷️ Todas las Categorías' : `🏷️ ${cat}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Filtro por Estantería */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-fio-pink" />
                  <span>Por Estante:</span>
                </label>
                <select
                  value={selectedShelf}
                  onChange={(e) => {
                    setSelectedShelf(e.target.value);
                    playWaterDropSound();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
                >
                  {shelfList.map((shelf) => (
                    <option key={shelf} value={shelf}>
                      {shelf === 'Todas' ? '📍 Todas las Estanterías' : `📍 ${shelf}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Filtro por Proveedor */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Por Proveedor:</span>
                </label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => {
                    setSelectedSupplier(e.target.value);
                    playWaterDropSound();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
                >
                  {supplierList.map((sup) => (
                    <option key={sup} value={sup}>
                      {sup === 'Todos' ? '🏢 Todos los Proveedores' : `🏢 ${sup}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Buscador por Nombre o SKU */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Buscar por Nombre o SKU:</span>
                </label>
                <input
                  type="text"
                  placeholder="Nombre, código o modelo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none bg-slate-50/50"
                />
              </div>
            </div>
          )}

          {/* Fila de Ordenamiento y Paginación en Pantalla */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-500 text-[11px]">Ordenar por:</span>
              <button
                type="button"
                onClick={() => setSortBy('name')}
                className={`px-2 py-0.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                  sortBy === 'name' ? 'bg-fio-800 text-white border-fio-800 font-bold' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                🔤 Nombre A-Z
              </button>
              <button
                type="button"
                onClick={() => setSortBy('shelf')}
                className={`px-2 py-0.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                  sortBy === 'shelf' ? 'bg-fio-800 text-white border-fio-800 font-bold' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                📍 Estante
              </button>
              <button
                type="button"
                onClick={() => setSortBy('category')}
                className={`px-2 py-0.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                  sortBy === 'category' ? 'bg-fio-800 text-white border-fio-800 font-bold' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                🏷️ Categoría
              </button>
              <button
                type="button"
                onClick={() => setSortBy('supplier')}
                className={`px-2 py-0.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                  sortBy === 'supplier' ? 'bg-fio-800 text-white border-fio-800 font-bold' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                🏢 Proveedor
              </button>
            </div>

            {sheets.length > 1 && (
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-slate-400 font-medium">Hojas disponibles:</span>
                {sheets.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveSheetIndex(idx);
                      document.getElementById(`byfio-sheet-${idx}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold cursor-pointer ${
                      activeSheetIndex === idx
                        ? 'bg-fio-pink text-white border-fio-pink'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Hoja {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contenedor Visual de Hojas de 21 Etiquetas (Imprimible & Responsive) */}
        <div id="printable-shelf-barcodes" className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-6 print:p-0 print:space-y-0 print:overflow-visible bg-slate-100/60 print:bg-white">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Tag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bubble font-bold text-sm text-slate-700">No se encontraron productos</h3>
              <p className="text-xs text-slate-400">Prueba ajustando los filtros de categoría, estante o proveedor.</p>
            </div>
          ) : (
            sheets.map((sheetProducts, sheetIdx) => {
              // Si la hoja tiene menos de 21 elementos, completar con placeholders para preservar el layout 3x7
              const paddedLabels: (Product | null)[] = [...sheetProducts];
              while (paddedLabels.length < LABELS_PER_SHEET) {
                paddedLabels.push(null);
              }

              return (
                <div
                  key={sheetIdx}
                  id={`byfio-sheet-${sheetIdx}`}
                  className="byfio-print-sheet bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-md max-w-[850px] mx-auto print:max-w-none print:w-full print:border-none print:p-0 print:shadow-none print:rounded-none"
                >
                  {/* Encabezado Oficial de la Hoja Impresa: Logo de ByFio + Categoría de Producto */}
                  <div className="byfio-sheet-header border-b-2 border-slate-800 pb-2 mb-2 flex items-center justify-between text-left">
                    {/* Lado Izquierdo: Logo ByFio Oficial */}
                    <div className="flex items-center gap-2">
                      <div className="scale-75 sm:scale-90 origin-left">
                        <BrandLogo size="sm" showSlogan={false} />
                      </div>
                      <div className="hidden sm:block border-l border-slate-300 pl-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block print:text-black">
                          Control de Inventario
                        </span>
                        <span className="text-xs font-bubble font-black text-slate-800 print:text-black">
                          Talleres Creativos & Tienda
                        </span>
                      </div>
                    </div>

                    {/* Centro: Categoría de Producto Prominente */}
                    <div className="text-center px-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 print:bg-transparent border border-purple-200 print:border-black/40 text-purple-900 print:text-black font-bubble font-bold text-xs sm:text-sm">
                        <Layers className="w-3.5 h-3.5 text-fio-pink print:text-black shrink-0" />
                        <span>Categoría: {selectedCategoryLabel}</span>
                      </div>
                      {(selectedShelf !== 'Todas' || selectedSupplier !== 'Todos') && (
                        <p className="text-[9px] text-slate-500 print:text-black font-mono mt-0.5">
                          {selectedShelf !== 'Todas' && `📍 Estante: ${selectedShelfLabel} `}
                          {selectedSupplier !== 'Todos' && `• 🏢 Proveedor: ${selectedSupplierLabel}`}
                        </p>
                      )}
                    </div>

                    {/* Lado Derecho: Metadatos y Paginación de la Hoja */}
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-xs bg-slate-100 print:bg-transparent px-2 py-0.5 rounded border border-slate-200 print:border-black/30 block print:text-black">
                        Hoja {sheetIdx + 1} de {sheets.length}
                      </span>
                      <span className="text-[9px] text-slate-400 print:text-black block mt-0.5">
                        21 Códigos / Hoja (3×7)
                      </span>
                    </div>
                  </div>

                  {/* Cuadrícula Estricta de 21 Códigos de Barra (3 Columnas × 7 Filas) */}
                  <div className="byfio-sheet-grid-21 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 print:grid-cols-3 print:gap-1.5 flex-1">
                    {paddedLabels.map((prod, cellIdx) => {
                      if (!prod) {
                        return (
                          <div
                            key={`empty-${cellIdx}`}
                            className="byfio-label-cell border border-dashed border-slate-200 rounded-xl p-2 flex items-center justify-center text-slate-300 print:border-slate-200 print:text-transparent text-[10px]"
                          >
                            <span>Espacio {cellIdx + 1} (Vacío)</span>
                          </div>
                        );
                      }

                      return (
                        <div key={`${prod.id}-${cellIdx}`} className="byfio-label-cell">
                          <ProductBarcodeLabel
                            product={prod}
                            compact={true}
                            showPrice={true}
                            className="h-full shadow-2xs hover:shadow-xs transition-shadow"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Barra Inferior de Acciones (Oculta en Impresión) */}
        <div className="p-3.5 sm:p-4 bg-white/95 border-t border-fio-200/80 flex items-center justify-between shrink-0 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              📐 Configuración: <strong>21 códigos por hoja (3×7)</strong> • Tamaño Carta / A4 • 100% Escala
            </span>
          </div>

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
              disabled={filteredProducts.length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fio-pink text-white font-bubble font-bold text-xs shadow-clayBtn active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir {sheets.length} {sheets.length === 1 ? 'Hoja' : 'Hojas'} ({filteredProducts.length} Etiquetas)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
