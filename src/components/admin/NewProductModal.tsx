import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory } from '../../types';
import { X, PlusCircle, Sparkles, Wand2 } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  'Agendas Personalizadas',
  'Libros de Vacunas',
  'Artículos Sublimados',
  'Stickers y Papelería',
  'Kits e Insumos',
];

export const NewProductModal: React.FC = () => {
  const { isNewProductModalOpen, setIsNewProductModalOpen, addProduct } = useApp();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCreatingNewCat, setIsCreatingNewCat] = useState(false);
  const [shelfLocation, setShelfLocation] = useState('Estante A-1');
  const [price, setPrice] = useState('12000');
  const [costPrice, setCostPrice] = useState('4500');
  const [stock, setStock] = useState('10');
  const [minStock, setMinStock] = useState('5');
  const [maxStock, setMaxStock] = useState('20');
  const [unit, setUnit] = useState('Unidad');
  const [isCustomizable, setIsCustomizable] = useState(false);

  if (!isNewProductModalOpen) return null;

  const handleAutoGenerateSku = () => {
    const prefix = name ? name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X') : 'PRD';
    setSku(`FIO-${prefix}-${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) return;

    const finalCategory = (isCreatingNewCat && customCategory.trim() ? customCategory.trim() : category) as ProductCategory;

    addProduct({
      name,
      sku: sku.trim().toUpperCase(),
      category: finalCategory,
      shelfLocation,
      price: Number(price) || 0,
      costPrice: Number(costPrice) || 0,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 0,
      maxStock: Number(maxStock) || 0,
      unit,
      isCustomizable,
      customizationPlaceholder: isCustomizable ? 'Nombre o texto personalizado' : undefined,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
      description: `${name} de alta calidad elaborado artesanalmente por by.fio.`,
    });

    setIsNewProductModalOpen(false);
    setName('');
    setSku('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-clayLg border-2 border-fio-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-fio-200 flex items-center justify-between bg-fio-100/70">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-fio-800" />
            <div>
              <h3 className="font-bubble font-bold text-lg text-fio-900">Agregar Nuevo Producto o Insumo</h3>
              <p className="text-[11px] text-gray-500">Se genera código QR y se activa de inmediato en tienda y alisto.</p>
            </div>
          </div>
          <button onClick={() => setIsNewProductModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Nombre del Producto / Insumo *</label>
              <input
                required
                type="text"
                placeholder="Ej: Libreta Cuero Pastel 2027"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-fio-200 focus:ring-2 focus:ring-fio-400 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-gray-700">Código SKU *</label>
                <button type="button" onClick={handleAutoGenerateSku} className="text-[10px] text-fio-600 hover:text-fio-800 font-bold flex items-center gap-0.5">
                  <Wand2 className="w-3 h-3" /> Auto
                </button>
              </div>
              <input
                required
                type="text"
                placeholder="Ej: FIO-LIB-10"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-fio-200 font-mono font-bold focus:ring-2 focus:ring-fio-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Categoría del Producto *</label>
              {!isCreatingNewCat ? (
                <select
                  value={category}
                  onChange={(e) => e.target.value === '__new__' ? setIsCreatingNewCat(true) : setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-fio-200 bg-white font-semibold text-gray-800"
                >
                  {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  <option value="__new__">✨ + Nueva Categoría...</option>
                </select>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Nueva categoría..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-fio-300 bg-purple-50 font-semibold"
                  />
                  <button type="button" onClick={() => setIsCreatingNewCat(false)} className="px-2 py-1 bg-gray-100 rounded-xl text-[10px] font-bold">Cancelar</button>
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Ubicación en Estante (WMS) *</label>
              <input
                required
                type="text"
                placeholder="Ej: Estante A-2 (Nivel 3)"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-fio-200 focus:ring-2 focus:ring-fio-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Precio Venta (₡) *</label>
              <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-fio-200 font-bold" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Costo (₡) *</label>
              <input required type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-fio-200 text-gray-600" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Stock Inicial *</label>
              <input required type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-fio-200 font-bold text-fio-800" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Unidad</label>
              <input type="text" placeholder="Unidad/Pack" value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-fio-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
            <div>
              <label className="block font-bold text-red-600 mb-1">Stock Mínimo (Alerta)</label>
              <input required type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-purple-200 bg-white font-bold text-red-600" />
            </div>
            <div>
              <label className="block font-bold text-fio-800 mb-1">Stock Máximo (Meta)</label>
              <input required type="number" value={maxStock} onChange={(e) => setMaxStock(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-purple-200 bg-white font-bold text-fio-800" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="isCustomizable" checked={isCustomizable} onChange={(e) => setIsCustomizable(e.target.checked)} className="w-4 h-4 text-fio-600 rounded" />
            <label htmlFor="isCustomizable" className="font-bold text-gray-700 cursor-pointer">
              ¿Permite personalización de nombre o frase por el cliente?
            </label>
          </div>

          <div className="pt-3 border-t border-fio-100 flex items-center justify-end gap-3">
            <button type="button" onClick={() => setIsNewProductModalOpen(false)} className="px-4 py-2.5 rounded-2xl border border-gray-300 text-gray-600 font-bubble font-semibold">Cancelar</button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-semibold shadow-clayBtn active:scale-95">
              <Sparkles className="w-4 h-4 text-fio-yellow" />
              <span>Guardar & Generar QR</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
