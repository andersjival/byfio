import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory } from '../../types';
import { formatCRC } from '../../utils/formatters';
import {
  X, PlusCircle, Sparkles, Wand2, Image as ImageIcon,
  CheckCircle2, Package, MapPin, DollarSign, Layers, Pencil,
  Store, BookOpen
} from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';

const DEFAULT_CATEGORIES = [
  'Agendas Personalizadas',
  'Libros de Vacunas',
  'Artículos Sublimados',
  'Stickers y Papelería',
  'Kits e Insumos',
];

export const NewProductModal: React.FC = () => {
  const {
    isNewProductModalOpen,
    setIsNewProductModalOpen,
    addProduct,
    updateProduct,
    editingProduct,
    setEditingProduct,
  } = useApp();

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
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [customizationPlaceholder, setCustomizationPlaceholder] = useState('');
  const [showInStore, setShowInStore] = useState(true);
  const [showInCatalog, setShowInCatalog] = useState(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sincronizar formulario según modo edición o creación
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setSku(editingProduct.sku);
      setCategory(editingProduct.category);
      setShelfLocation(editingProduct.shelfLocation);
      setPrice(String(editingProduct.price));
      setCostPrice(String(editingProduct.costPrice));
      setStock(String(editingProduct.stock));
      setMinStock(String(editingProduct.minStock));
      setMaxStock(String(editingProduct.maxStock));
      setUnit(editingProduct.unit || 'Unidad');
      setImage(editingProduct.image || '');
      setDescription(editingProduct.description || '');
      setIsCustomizable(editingProduct.isCustomizable);
      setCustomizationPlaceholder(editingProduct.customizationPlaceholder || '');
      setShowInStore(editingProduct.showInStore !== false);
      setShowInCatalog(editingProduct.showInCatalog !== false);
      setIsCreatingNewCat(false);
      setCustomCategory('');
    } else {
      setName('');
      setSku('');
      setCategory(DEFAULT_CATEGORIES[0]);
      setShelfLocation('Estante A-1');
      setPrice('12000');
      setCostPrice('4500');
      setStock('10');
      setMinStock('5');
      setMaxStock('20');
      setUnit('Unidad');
      setImage('');
      setDescription('');
      setIsCustomizable(false);
      setCustomizationPlaceholder('');
      setShowInStore(true); // Marcado por default
      setShowInCatalog(true); // Marcado por default
      setIsCreatingNewCat(false);
      setCustomCategory('');
    }
  }, [editingProduct, isNewProductModalOpen]);

  if (!isNewProductModalOpen) return null;

  const handleClose = () => {
    setEditingProduct(null);
    setIsNewProductModalOpen(false);
  };

  const handleAutoGenerateSku = () => {
    const prefix = name ? name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X') : 'PRD';
    setSku(`FIO-${prefix}-${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    const finalCategory = (
      isCreatingNewCat && customCategory.trim() ? customCategory.trim() : category
    ) as ProductCategory;

    const finalImage =
      image.trim() ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80';

    const finalDesc = description.trim() || `${name.trim()} de alta calidad elaborado artesanalmente por by.fio.`;

    if (editingProduct) {
      // Modo Edición Completa
      updateProduct(editingProduct.id, {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        category: finalCategory,
        shelfLocation: shelfLocation.trim(),
        price: Number(price) || 0,
        costPrice: Number(costPrice) || 0,
        stock: Number(stock) || 0,
        minStock: Number(minStock) || 0,
        maxStock: Number(maxStock) || 0,
        unit: unit.trim() || 'Unidad',
        image: finalImage,
        description: finalDesc,
        isCustomizable,
        customizationPlaceholder: isCustomizable ? customizationPlaceholder.trim() || 'Texto personalizado' : undefined,
        showInStore,
        showInCatalog,
      });

      setSuccessToast('¡Artículo actualizado y guardado correctamente!');
    } else {
      // Modo Nuevo Producto
      addProduct({
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        category: finalCategory,
        shelfLocation: shelfLocation.trim(),
        price: Number(price) || 0,
        costPrice: Number(costPrice) || 0,
        stock: Number(stock) || 0,
        minStock: Number(minStock) || 0,
        maxStock: Number(maxStock) || 0,
        unit: unit.trim() || 'Unidad',
        image: finalImage,
        description: finalDesc,
        isCustomizable,
        customizationPlaceholder: isCustomizable ? customizationPlaceholder.trim() || 'Texto personalizado' : undefined,
        showInStore,
        showInCatalog,
      });

      setSuccessToast('¡Artículo creado y agregado al inventario!');
    }

    setTimeout(() => {
      setSuccessToast(null);
      handleClose();
    }, 1100);
  };

  const marginColones = (Number(price) || 0) - (Number(costPrice) || 0);
  const marginPct = Number(price) > 0 ? Math.round((marginColones / Number(price)) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-clayLg border border-fio-200 overflow-hidden my-4">
        {/* Header Superior */}
        <div className="p-4 sm:p-5 border-b border-fio-200 flex items-center justify-between bg-gradient-to-r from-fio-100/80 via-white to-purple-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-fio-800 text-white flex items-center justify-center shadow-xs shrink-0">
              {editingProduct ? <Pencil className="w-5 h-5 text-fio-yellow" /> : <PlusCircle className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bubble font-bold text-base sm:text-lg text-fio-900 leading-tight">
                  {editingProduct ? 'Modificar Artículo del Inventario' : 'Agregar Nuevo Producto o Insumo'}
                </h3>
                {editingProduct && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-mono font-bold">
                    {editingProduct.sku}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {editingProduct
                  ? 'Edita fotos, descripción, SKU, precios, ubicación y existencias con guardado permanente.'
                  : 'Registra un nuevo producto, genera su código QR y habilítalo en tienda y pedidos.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all active:scale-95"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificación Toast de Éxito */}
        {successToast && (
          <div className="bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Formulario Completo de Edición */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          {/* Bloque 1: Identidad & Foto */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* Foto con Previsualización en Vivo y Carga Multifuncional (URL, Archivo, Ctrl+V, Drag & Drop) */}
            <div className="md:col-span-4">
              <ImageUploadField
                value={image}
                onChange={setImage}
                label="Fotografía del Producto"
                aspectRatio="square"
                compact
                defaultPlaceholder="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80"
              />
            </div>

            {/* Datos Principales (Nombre, SKU, Categoría, Estante) */}
            <div className="md:col-span-8 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Nombre del Producto / Insumo *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej: Libreta Cuero Pastel 2027"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-fio-200 focus:ring-2 focus:ring-fio-400 focus:outline-none font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700">Código SKU *</label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateSku}
                      className="text-[10px] text-fio-600 hover:text-fio-800 font-bold flex items-center gap-0.5"
                      title="Generar SKU automáticamente"
                    >
                      <Wand2 className="w-3 h-3" /> Auto
                    </button>
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="Ej: FIO-LIB-10"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-fio-200 font-mono font-bold focus:ring-2 focus:ring-fio-400 focus:outline-none text-fio-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Categoría *</label>
                  {!isCreatingNewCat ? (
                    <select
                      value={category}
                      onChange={(e) => (e.target.value === '__new__' ? setIsCreatingNewCat(true) : setCategory(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-fio-200 bg-white font-semibold text-gray-800"
                    >
                      {DEFAULT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
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
                      <button
                        type="button"
                        onClick={() => setIsCreatingNewCat(false)}
                        className="px-2 py-1 bg-gray-100 rounded-xl text-[10px] font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ubicación en Estantería (WMS) *</label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      placeholder="Ej: Estante A-2 (Nivel 3)"
                      value={shelfLocation}
                      onChange={(e) => setShelfLocation(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-fio-200 focus:ring-2 focus:ring-fio-400 focus:outline-none font-semibold text-purple-900"
                    />
                    <MapPin className="w-4 h-4 text-fio-pink absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque 2: Precios, Costos y Margen */}
          <div className="p-4 rounded-2xl bg-fio-50/50 border border-fio-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-fio-800 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-fio-pink" />
                Precios, Costos & Margen de Ganancia
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Margen: {formatCRC(marginColones)} ({marginPct}%)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Precio Venta (₡) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-fio-200 font-bubble font-bold text-fio-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Costo (₡) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="100"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-fio-200 text-gray-600 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Stock Actual *</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-fio-200 font-bubble font-bold text-fio-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Unidad de Medida</label>
                <input
                  type="text"
                  placeholder="Unidad / Pack / Rollo"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-fio-200 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Bloque 3: Alertas de Stock Mínimo y Máximo */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-purple-50/70 rounded-2xl border border-purple-100">
            <div>
              <label className="block font-bold text-red-600 mb-1">Stock Mínimo (Alerta de Reabastecimiento)</label>
              <input
                required
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-purple-200 bg-white font-bold text-red-600"
              />
              <p className="text-[10px] text-gray-500 mt-0.5">Alerta en tabla cuando stock sea menor o igual.</p>
            </div>
            <div>
              <label className="block font-bold text-fio-800 mb-1">Stock Máximo (Capacidad / Meta de Reposición)</label>
              <input
                required
                type="number"
                min="0"
                value={maxStock}
                onChange={(e) => setMaxStock(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-purple-200 bg-white font-bold text-fio-800"
              />
              <p className="text-[10px] text-gray-500 mt-0.5">Calcula la sugerencia automática de compra (+A Reponer).</p>
            </div>
          </div>

          {/* Bloque 4: Descripción */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Descripción del Producto / Insumo</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles sobre materiales, acabados, medidas y recomendaciones de uso..."
              className="w-full px-3 py-2 rounded-xl border border-fio-200 focus:ring-2 focus:ring-fio-400 focus:outline-none"
            />
          </div>

          {/* Bloque 5: Personalización */}
          <div className="p-3.5 bg-white rounded-2xl border border-fio-200 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCustomizable"
                checked={isCustomizable}
                onChange={(e) => setIsCustomizable(e.target.checked)}
                className="w-4 h-4 text-fio-800 rounded border-gray-300 focus:ring-fio-400"
              />
              <label htmlFor="isCustomizable" className="font-bold text-gray-800 cursor-pointer text-xs">
                ¿Permite personalización de nombre, frase o fecha por el cliente?
              </label>
            </div>

            {isCustomizable && (
              <div className="pl-6 pt-1">
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                  Texto indicador en la tienda (Placeholder)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Nombre o frase grabada en foil dorado"
                  value={customizationPlaceholder}
                  onChange={(e) => setCustomizationPlaceholder(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-fio-200 bg-purple-50/40 text-xs focus:ring-2 focus:ring-fio-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Bloque 6: Canales de Publicación (Tienda & Catálogo) */}
          <div className="p-4 bg-gradient-to-r from-purple-50/70 via-white to-pink-50/50 rounded-2xl border border-purple-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bubble font-bold text-slate-800 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-fio-800" />
                <span>Canales de Publicación (Tienda &amp; Catálogo)</span>
              </span>
              <span className="text-[10px] text-fio-800 bg-fio-100 px-2 py-0.5 rounded-full font-bold">
                Marcado por defecto
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Si agregas el producto en la tienda o en el catálogo, aparecerá en ambos de forma predeterminada. Puedes desmarcar cualquiera de forma opcional.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Opción 1: Mostrar en Tienda Online */}
              <label
                htmlFor="showInStore"
                className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                  showInStore
                    ? 'bg-white border-fio-300 shadow-sm text-slate-900'
                    : 'bg-slate-50/80 border-slate-200 text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  id="showInStore"
                  checked={showInStore}
                  onChange={(e) => setShowInStore(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-fio-800 rounded border-gray-300 focus:ring-fio-400 cursor-pointer"
                />
                <div className="text-xs">
                  <div className="flex items-center gap-1 font-bold">
                    <Store className="w-3.5 h-3.5 text-fio-pink" />
                    <span>Mostrar en Tienda</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Visible en la Tienda Online y en Inicio
                  </span>
                </div>
              </label>

              {/* Opción 2: Mostrar en Catálogo Online */}
              <label
                htmlFor="showInCatalog"
                className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                  showInCatalog
                    ? 'bg-white border-fio-300 shadow-sm text-slate-900'
                    : 'bg-slate-50/80 border-slate-200 text-slate-400'
                }`}
              >
                <input
                  type="checkbox"
                  id="showInCatalog"
                  checked={showInCatalog}
                  onChange={(e) => setShowInCatalog(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-fio-800 rounded border-gray-300 focus:ring-fio-400 cursor-pointer"
                />
                <div className="text-xs">
                  <div className="flex items-center gap-1 font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-fio-800" />
                    <span>Mostrar en Catálogo</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Visible en la sección oficial /catalogo
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-3 border-t border-fio-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur-md">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-2xl border border-gray-300 text-gray-600 font-bubble font-semibold text-xs hover:bg-gray-50 active:scale-95 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-semibold text-xs shadow-clayBtn active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-fio-yellow" />
              <span>{editingProduct ? 'Guardar Cambios del Artículo' : 'Guardar & Generar QR'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
