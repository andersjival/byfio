import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory, SweepEntryStatus } from '../../types';
import { formatInternalProductCode, formatCRC } from '../../utils/formatters';
import { saveExtraShelf } from '../../utils/inventoryShelves';
import {
  MapPin, Tag, Building2, PackageCheck, PlusCircle, Plus, Minus,
  Check, AlertTriangle, X, Sparkles
} from 'lucide-react';

const FALLBACK_CATEGORIES = [
  'Resina Epóxica',
  'Moldes de Silicona',
  'Pigmentos y Tintes',
  'Escarchas y Glitters',
  'Flores Secas',
  'Accesorios y Herrajes',
  'Sublimación y Vinil',
  'Herramientas',
  'Kits',
  'Papelería',
  'Otros',
];

const FALLBACK_SUPPLIERS = [
  'Papelera Internacional',
  'Sublimaciones CR',
  'Importadora Artística',
  'Proveedor General',
];

const isLocationMissing = (loc?: string): boolean => {
  const clean = (loc || '').trim().toLowerCase();
  return (
    !clean ||
    clean === 'sin asignar' ||
    clean === 'sin ubicación' ||
    clean === 'sin ubicacion' ||
    clean === 'ninguna'
  );
};

interface InventorySweepProductPanelProps {
  activeShelf: string;
  matchedProduct: Product | null;
  unmatchedCode: string | null;
  availableShelves: string[];
  onCancel: () => void;
  onRegistered: (info: {
    entryName: string;
    qty: number;
    autoLoadedCount: number;
    status: SweepEntryStatus;
  }) => void;
}

export const InventorySweepProductPanel: React.FC<InventorySweepProductPanelProps> = ({
  activeShelf,
  matchedProduct,
  unmatchedCode,
  availableShelves,
  onCancel,
  onRegistered,
}) => {
  const {
    products,
    suppliers,
    addProduct,
    updateProduct,
    registerSweepEntry,
  } = useApp();

  // Listas dinámicas reales de categorías y proveedores
  const categoryOptions = useMemo(() => {
    const set = new Set<string>(FALLBACK_CATEGORIES);
    products.forEach((p) => p.category && set.add(p.category));
    try {
      const custom = JSON.parse(localStorage.getItem('byfio_custom_categories_v1') || '[]');
      if (Array.isArray(custom)) custom.forEach((c: string) => c && set.add(c));
    } catch {}
    return Array.from(set);
  }, [products]);

  const supplierOptions = useMemo(() => {
    const set = new Set<string>(FALLBACK_SUPPLIERS);
    suppliers.forEach((s) => s.name && set.add(s.name.trim()));
    products.forEach((p) => p.supplier && set.add(p.supplier.trim()));
    try {
      const custom = JSON.parse(localStorage.getItem('byfio_custom_suppliers_v1') || '[]');
      if (Array.isArray(custom)) custom.forEach((s: string) => s && set.add(s));
    } catch {}
    return Array.from(set);
  }, [suppliers, products]);

  // Estado para producto existente
  const [existingLocation, setExistingLocation] = useState(activeShelf);
  const [existingSupplier, setExistingSupplier] = useState('');
  const [existingQty, setExistingQty] = useState<number>(1);

  // Estado para producto nuevo (en orden: Ubicación, Categoría, Proveedor, Descripción, Cantidad al final)
  const [newSku, setNewSku] = useState('');
  const [newLocation, setNewLocation] = useState(activeShelf);
  const [newCategory, setNewCategory] = useState(categoryOptions[0] || 'Otros');
  const [customCategory, setCustomCategory] = useState('');
  const [newSupplier, setNewSupplier] = useState(supplierOptions[0] || 'Proveedor General');
  const [customSupplier, setCustomSupplier] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<string>('0');
  const [newQty, setNewQty] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setFormError(null);
    if (matchedProduct) {
      const missing = isLocationMissing(matchedProduct.shelfLocation);
      setExistingLocation(missing ? activeShelf : matchedProduct.shelfLocation);
      setExistingSupplier(matchedProduct.supplier || '');
      setExistingQty(1);
    } else if (unmatchedCode !== null) {
      const fallbackSku = `bf-SWP-${String(Date.now()).slice(-4)}`;
      setNewSku(unmatchedCode.trim() || fallbackSku);
      setNewLocation(activeShelf);
      setNewCategory(categoryOptions[0] || 'Otros');
      setCustomCategory('');
      setNewSupplier(supplierOptions[0] || 'Proveedor General');
      setCustomSupplier('');
      setNewName('');
      setNewPrice('0');
      setNewQty(1);
    }
  }, [matchedProduct, unmatchedCode, activeShelf]);

  const handleSaveExisting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedProduct) return;
    const qty = Math.max(1, Math.floor(Number(existingQty) || 1));
    const finalLocation = existingLocation.trim() || activeShelf;
    const finalSupplier = existingSupplier.trim() || matchedProduct.supplier || '';

    saveExtraShelf(finalLocation);

    const needsProductUpdate =
      finalLocation !== matchedProduct.shelfLocation ||
      finalSupplier !== (matchedProduct.supplier || '');

    if (needsProductUpdate) {
      updateProduct(matchedProduct.id, {
        shelfLocation: finalLocation,
        supplier: finalSupplier || undefined,
      });
    }

    const res = registerSweepEntry({
      shelfName: activeShelf,
      productId: matchedProduct.id,
      sku: matchedProduct.sku,
      productName: matchedProduct.name,
      category: matchedProduct.category,
      supplier: finalSupplier || 'General',
      shelfLocation: finalLocation,
      quantityAdded: qty,
    });

    onRegistered({
      entryName: matchedProduct.name,
      qty,
      autoLoadedCount: res.autoLoadedCount,
      status: res.entry.status,
    });
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const cleanName = newName.trim();
    if (!cleanName) {
      setFormError('Ingresa la descripción o nombre del producto.');
      return;
    }

    const finalLocation = newLocation.trim() || activeShelf;
    const finalCategory = (newCategory === '__CUSTOM__' ? customCategory : newCategory).trim() || 'Otros';
    const finalSupplier = (newSupplier === '__CUSTOM__' ? customSupplier : newSupplier).trim() || 'Proveedor General';
    const finalSku = formatInternalProductCode(newSku.trim() || `bf-SWP-${String(Date.now()).slice(-4)}`);
    const qty = Math.max(1, Math.floor(Number(newQty) || 1));

    saveExtraShelf(finalLocation);

    // Guardar categorías/proveedores custom si se escribieron nuevos
    if (newCategory === '__CUSTOM__' && customCategory.trim()) {
      try {
        const prev = JSON.parse(localStorage.getItem('byfio_custom_categories_v1') || '[]');
        localStorage.setItem('byfio_custom_categories_v1', JSON.stringify(Array.from(new Set([...(Array.isArray(prev) ? prev : []), finalCategory]))));
      } catch {}
    }
    if (newSupplier === '__CUSTOM__' && customSupplier.trim()) {
      try {
        const prev = JSON.parse(localStorage.getItem('byfio_custom_suppliers_v1') || '[]');
        localStorage.setItem('byfio_custom_suppliers_v1', JSON.stringify(Array.from(new Set([...(Array.isArray(prev) ? prev : []), finalSupplier]))));
      } catch {}
    }

    // Se crea en BD real con stock 0; su cantidad del barrido pasa a stock cuando cargue el lote
    const created = addProduct({
      name: cleanName,
      sku: finalSku,
      qrCode: finalSku,
      category: finalCategory as ProductCategory,
      shelfLocation: finalLocation,
      supplier: finalSupplier,
      price: Number(newPrice) || 0,
      costPrice: 0,
      stock: 0,
      minStock: 1,
      maxStock: 50,
      unit: 'Unidad',
      image: '/images/placeholder-new-product.jpg',
      images: ['/images/placeholder-new-product.jpg'],
      description: cleanName,
      isCustomizable: false,
      isAvailable: false,
      showInStore: false,
      showInCatalog: false,
    });

    const res = registerSweepEntry({
      shelfName: activeShelf,
      productId: created.id,
      sku: created.sku,
      productName: created.name,
      category: created.category,
      supplier: finalSupplier,
      shelfLocation: finalLocation,
      quantityAdded: qty,
    });

    onRegistered({
      entryName: created.name,
      qty,
      autoLoadedCount: res.autoLoadedCount,
      status: res.entry.status,
    });
  };

  if (matchedProduct) {
    const missingLoc = isLocationMissing(matchedProduct.shelfLocation);
    return (
      <form
        onSubmit={handleSaveExisting}
        className="bg-white rounded-3xl border-2 border-emerald-300 shadow-md p-4 sm:p-5 space-y-4 animate-fade-in"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Producto Detectado en Base de Datos
              </span>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                {matchedProduct.name}
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                Código: {matchedProduct.sku} · Stock actual: <strong className="text-slate-800">{matchedProduct.stock}</strong>
                {matchedProduct.price > 0 ? ` · ${formatCRC(matchedProduct.price)}` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {missingLoc && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            Este producto no tiene ubicación registrada. Asígnala aquí mismo antes de guardar.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Ubicación */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-600" /> Ubicación
            </label>
            <select
              value={existingLocation}
              onChange={(e) => setExistingLocation(e.target.value)}
              className={`w-full px-3 py-2 text-xs font-bold rounded-xl border focus:outline-none ${
                missingLoc
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {Array.from(new Set([activeShelf, existingLocation, ...availableShelves].filter(Boolean))).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {existingLocation !== activeShelf && (
              <button
                type="button"
                onClick={() => setExistingLocation(activeShelf)}
                className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer"
              >
                Mover a {activeShelf}
              </button>
            )}
          </div>

          {/* Categoría */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-pink-500" /> Categoría
            </label>
            <div className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800">
              {matchedProduct.category || 'General'}
            </div>
          </div>

          {/* Proveedor */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-500" /> Proveedor
            </label>
            <select
              value={existingSupplier}
              onChange={(e) => setExistingSupplier(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
            >
              <option value="">{matchedProduct.supplier ? matchedProduct.supplier : 'Sin proveedor asignado'}</option>
              {supplierOptions.map((sup) => (
                <option key={sup} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cantidad a ingresar */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-extrabold text-slate-700">Cantidad a ingresar:</label>
            <div className="flex items-center gap-1 bg-purple-50 p-1 rounded-xl border border-purple-200">
              <button
                type="button"
                onClick={() => setExistingQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white text-purple-800 flex items-center justify-center shadow-2xs cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min={1}
                value={existingQty}
                onChange={(e) => setExistingQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-16 text-center text-sm font-black bg-transparent text-purple-950 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setExistingQty((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white text-purple-800 flex items-center justify-center shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {[5, 10].map((inc) => (
              <button
                key={inc}
                type="button"
                onClick={() => setExistingQty((q) => q + inc)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-xs font-extrabold text-slate-700 cursor-pointer"
              >
                +{inc}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-extrabold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Guardar en Barrido (+{existingQty})
          </button>
        </div>
      </form>
    );
  }

  if (unmatchedCode !== null) {
    return (
      <form
        onSubmit={handleSaveNewProduct}
        className="bg-white rounded-3xl border-2 border-purple-300 shadow-md p-4 sm:p-5 space-y-4 animate-fade-in"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Producto Nuevo (No existe en BD)
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-purple-950 mt-0.5">
                Registrar producto nuevo directamente en el barrido
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {formError && (
          <div className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Código / SKU */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Código / SKU</label>
            <input
              type="text"
              value={newSku}
              onChange={(e) => setNewSku(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* 1. Ubicación */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-600" /> 1. Ubicación *
            </label>
            <select
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold bg-purple-50/70 border border-purple-200 rounded-xl text-purple-950 focus:outline-none"
            >
              {Array.from(new Set([activeShelf, ...availableShelves])).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Categoría */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-pink-500" /> 2. Categoría *
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__CUSTOM__">+ Escribir nueva categoría...</option>
            </select>
            {newCategory === '__CUSTOM__' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Nombre de categoría"
                className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-purple-300 rounded-xl focus:outline-none"
              />
            )}
          </div>

          {/* 3. Proveedor */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-500" /> 3. Proveedor *
            </label>
            <select
              value={newSupplier}
              onChange={(e) => setNewSupplier(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
            >
              {supplierOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="__CUSTOM__">+ Escribir nuevo proveedor...</option>
            </select>
            {newSupplier === '__CUSTOM__' && (
              <input
                type="text"
                value={customSupplier}
                onChange={(e) => setCustomSupplier(e.target.value)}
                placeholder="Nombre de proveedor"
                className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-purple-300 rounded-xl focus:outline-none"
              />
            )}
          </div>

          {/* 4. Descripción */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-600">
              4. Descripción / Nombre del producto *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej. Molde silicón corazón grande..."
                className="flex-1 px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400"
                autoFocus
              />
              <input
                type="number"
                min={0}
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Precio ₡"
                title="Precio de venta opcional (₡)"
                className="w-24 px-2.5 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 5. Cantidad a ingresar (de último) */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-extrabold text-purple-950">
              5. Cantidad a ingresar:
            </label>
            <div className="flex items-center gap-1 bg-purple-50 p-1 rounded-xl border border-purple-200">
              <button
                type="button"
                onClick={() => setNewQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white text-purple-800 flex items-center justify-center shadow-2xs cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min={1}
                value={newQty}
                onChange={(e) => setNewQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-16 text-center text-sm font-black bg-transparent text-purple-950 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setNewQty((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white text-purple-800 flex items-center justify-center shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {[5, 10].map((inc) => (
              <button
                key={inc}
                type="button"
                onClick={() => setNewQty((q) => q + inc)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-xs font-extrabold text-slate-700 cursor-pointer"
              >
                +{inc}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs sm:text-sm font-extrabold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Crear y Guardar en Barrido (+{newQty})
          </button>
        </div>
      </form>
    );
  }

  return null;
};
