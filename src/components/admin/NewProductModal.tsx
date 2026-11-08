import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../context/ConfirmContext';
import { ProductCategory } from '../../types';
import { formatCRC } from '../../utils/formatters';
import {
  X, PlusCircle, Hash, Image as ImageIcon,
  CheckCircle2, Package, MapPin, DollarSign, Layers, Pencil,
  Store, BookOpen, ChevronDown, Plus, RotateCcw, Trash2, Sparkles, Upload
} from 'lucide-react';
import { MultiImageUploadField } from '../common/MultiImageUploadField';

const DEFAULT_PRODUCT_PLACEHOLDER = '/images/placeholder-new-product.jpg';

const DEFAULT_CATEGORIES = [
  'Agendas Personalizadas',
  'Libros de Vacunas',
  'Artículos Sublimados',
  'Stickers y Papelería',
  'Kits e Insumos',
];

const DEFAULT_SHELF_LOCATIONS = [
  'Estante A-1 (Nivel 1)',
  'Estante A-1 (Nivel 2)',
  'Estante A-2 (Nivel 1)',
  'Estante A-2 (Nivel 2)',
  'Estante B-1 (Nivel 1)',
  'Estante B-1 (Nivel 2)',
  'Estante B-1 (Nivel 3)',
  'Estante B-2 (Nivel 1)',
  'Estante B-2 (Nivel 2)',
  'Gaveta C-1 (Mostrador)',
  'Gaveta C-2 (Mostrador)',
  'Estante D-1 (Insumos)',
  'Estante D-2 (Papeles)',
  'Bodega Central - Pallet 1',
  'Bodega Central - Pallet 2',
];

const CUSTOM_LOCATIONS_STORAGE_KEY = 'byfio_custom_shelf_locations_v1';
const DELETED_LOCATIONS_STORAGE_KEY = 'byfio_deleted_shelf_locations_v1';
const CUSTOM_CATEGORIES_STORAGE_KEY = 'byfio_custom_categories_v1';
const DELETED_CATEGORIES_STORAGE_KEY = 'byfio_deleted_categories_v1';

export const NewProductModal: React.FC = () => {
  const {
    products,
    isNewProductModalOpen,
    setIsNewProductModalOpen,
    addProduct,
    updateProduct,
    editingProduct,
    setEditingProduct,
  } = useApp();
  const confirm = useConfirm();

  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationEditName, setLocationEditName] = useState('');
  const [isEditingCat, setIsEditingCat] = useState(false);
  const [categoryEditName, setCategoryEditName] = useState('');
  const [locationsVersion, setLocationsVersion] = useState(0);
  const [categoriesVersion, setCategoriesVersion] = useState(0);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCreatingNewCat, setIsCreatingNewCat] = useState(false);
  const [shelfLocation, setShelfLocation] = useState(DEFAULT_SHELF_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [isCreatingNewLocation, setIsCreatingNewLocation] = useState(false);
  const [price, setPrice] = useState('12000');
  const [costPrice, setCostPrice] = useState('4500');
  const [stock, setStock] = useState('10');
  const [minStock, setMinStock] = useState('5');
  const [maxStock, setMaxStock] = useState('20');
  const [unit, setUnit] = useState('Unidad');
  const [productPhotos, setProductPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [customizationPlaceholder, setCustomizationPlaceholder] = useState('');
  const [showInStore, setShowInStore] = useState(true);
  const [showInCatalog, setShowInCatalog] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Categorías disponibles (por defecto + personalizadas + de productos - eliminadas)
  const availableCategories = useMemo(() => {
    const deletedSet = new Set<string>();
    try {
      const delSaved = localStorage.getItem(DELETED_CATEGORIES_STORAGE_KEY);
      if (delSaved) {
        const parsed: string[] = JSON.parse(delSaved);
        if (Array.isArray(parsed)) parsed.forEach((d) => d && deletedSet.add(d.trim()));
      }
    } catch {}

    const catSet = new Set<string>();
    DEFAULT_CATEGORIES.forEach((c) => {
      if (!deletedSet.has(c.trim())) catSet.add(c.trim());
    });

    try {
      const saved = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((c) => {
            if (c && typeof c === 'string' && c.trim() && !deletedSet.has(c.trim())) {
              catSet.add(c.trim());
            }
          });
        }
      }
    } catch {}

    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p.category && typeof p.category === 'string' && p.category.trim() && !deletedSet.has(p.category.trim())) {
          catSet.add(p.category.trim());
        }
      });
    }

    if (category && category.trim() && !deletedSet.has(category.trim())) {
      catSet.add(category.trim());
    }

    const list = Array.from(catSet).filter(Boolean);
    return list.length > 0 ? list : ['General'];
  }, [products, category, categoriesVersion]);

  // Ubicaciones disponibles combinadas (por defecto + productos existentes + guardadas - eliminadas)
  const availableLocations = useMemo(() => {
    const deletedSet = new Set<string>();
    try {
      const delSaved = localStorage.getItem(DELETED_LOCATIONS_STORAGE_KEY);
      if (delSaved) {
        const parsed: string[] = JSON.parse(delSaved);
        if (Array.isArray(parsed)) parsed.forEach((d) => d && deletedSet.add(d.trim()));
      }
    } catch {}

    const locSet = new Set<string>();
    DEFAULT_SHELF_LOCATIONS.forEach((l) => {
      if (!deletedSet.has(l.trim())) locSet.add(l.trim());
    });

    try {
      const saved = localStorage.getItem(CUSTOM_LOCATIONS_STORAGE_KEY);
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((l) => {
            if (l && typeof l === 'string' && l.trim() && !deletedSet.has(l.trim())) {
              locSet.add(l.trim());
            }
          });
        }
      }
    } catch {}

    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p.shelfLocation && typeof p.shelfLocation === 'string' && p.shelfLocation.trim() && !deletedSet.has(p.shelfLocation.trim())) {
          locSet.add(p.shelfLocation.trim());
        }
      });
    }

    if (shelfLocation && shelfLocation.trim() && !deletedSet.has(shelfLocation.trim())) {
      locSet.add(shelfLocation.trim());
    }

    const list = Array.from(locSet)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base', numeric: true }));

    return list.length > 0 ? list : ['Estante Principal'];
  }, [products, shelfLocation, locationsVersion]);

  // Handlers de Categoría (Editar y Eliminar)
  const handleStartEditCategory = () => {
    setCategoryEditName(category);
    setIsEditingCat(true);
  };

  const handleSaveEditCategory = () => {
    const oldCat = category.trim();
    const newCat = categoryEditName.trim();
    if (!newCat || oldCat === newCat) {
      setIsEditingCat(false);
      return;
    }

    try {
      const saved = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      const list: string[] = saved ? JSON.parse(saved) : [];
      const updatedList = list.filter((c) => c.trim() !== oldCat);
      if (!updatedList.includes(newCat)) updatedList.push(newCat);
      localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(updatedList));

      const delSaved = localStorage.getItem(DELETED_CATEGORIES_STORAGE_KEY);
      const delList: string[] = delSaved ? JSON.parse(delSaved) : [];
      if (!delList.includes(oldCat)) {
        delList.push(oldCat);
        localStorage.setItem(DELETED_CATEGORIES_STORAGE_KEY, JSON.stringify(delList));
      }
    } catch {}

    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p.category === oldCat) {
          updateProduct(p.id, { category: newCat });
        }
      });
    }

    setCategory(newCat);
    setIsEditingCat(false);
    setCategoriesVersion((v) => v + 1);
    setSuccessToast(`¡Categoría renombrada a "${newCat}"!`);
  };

  const handleDeleteCategory = async () => {
    const catToDelete = category.trim();
    const ok = await confirm(
      `¿Deseas eliminar la categoría "${catToDelete}"? Los productos asignados a esta categoría se reasignarán a otra categoría disponible.`,
      {
        title: 'Eliminar Categoría',
        confirmLabel: 'Sí, Eliminar',
        cancelLabel: 'Cancelar',
        variant: 'danger',
      }
    );
    if (!ok) return;

    try {
      const delSaved = localStorage.getItem(DELETED_CATEGORIES_STORAGE_KEY);
      const delList: string[] = delSaved ? JSON.parse(delSaved) : [];
      if (!delList.includes(catToDelete)) {
        delList.push(catToDelete);
        localStorage.setItem(DELETED_CATEGORIES_STORAGE_KEY, JSON.stringify(delList));
      }

      const saved = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      if (saved) {
        const list: string[] = JSON.parse(saved);
        const filtered = list.filter((c) => c.trim() !== catToDelete);
        localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch {}

    const remaining = availableCategories.filter((c) => c !== catToDelete);
    const nextCat = remaining.length > 0 ? remaining[0] : 'General';

    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p.category === catToDelete) {
          updateProduct(p.id, { category: nextCat });
        }
      });
    }

    setCategory(nextCat);
    setIsEditingCat(false);
    setCategoriesVersion((v) => v + 1);
    setSuccessToast(`¡Categoría "${catToDelete}" eliminada correctamente!`);
  };

  // Handlers de Ubicación (Editar y Eliminar)
  const handleStartEditLocation = () => {
    setLocationEditName(shelfLocation);
    setIsEditingLocation(true);
  };

  const handleSaveEditLocation = () => {
    const oldLoc = shelfLocation.trim();
    const newLoc = locationEditName.trim();
    if (!newLoc || oldLoc === newLoc) {
      setIsEditingLocation(false);
      return;
    }

    try {
      const saved = localStorage.getItem(CUSTOM_LOCATIONS_STORAGE_KEY);
      const list: string[] = saved ? JSON.parse(saved) : [];
      const updatedList = list.filter((l) => l.trim() !== oldLoc);
      if (!updatedList.includes(newLoc)) updatedList.push(newLoc);
      localStorage.setItem(CUSTOM_LOCATIONS_STORAGE_KEY, JSON.stringify(updatedList));

      const delSaved = localStorage.getItem(DELETED_LOCATIONS_STORAGE_KEY);
      const delList: string[] = delSaved ? JSON.parse(delSaved) : [];
      if (!delList.includes(oldLoc)) {
        delList.push(oldLoc);
        localStorage.setItem(DELETED_LOCATIONS_STORAGE_KEY, JSON.stringify(delList));
      }
    } catch {}

    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p.shelfLocation === oldLoc) {
          updateProduct(p.id, { shelfLocation: newLoc });
        }
      });
    }

    setShelfLocation(newLoc);
    setIsEditingLocation(false);
    setLocationsVersion((v) => v + 1);
    setSuccessToast(`¡Ubicación renombrada a "${newLoc}"!`);
  };

  const handleDeleteLocation = async () => {
    const locToDelete = shelfLocation.trim();
    const ok = await confirm(
      `¿Deseas eliminar la ubicación "${locToDelete}"? Los productos asignados a este estante se reubicarán automáticamente.`,
      {
        title: 'Eliminar Ubicación',
        confirmLabel: 'Sí, Eliminar',
        cancelLabel: 'Cancelar',
        variant: 'danger',
      }
    );
    if (!ok) return;

    try {
      const delSaved = localStorage.getItem(DELETED_LOCATIONS_STORAGE_KEY);
      const delList: string[] = delSaved ? JSON.parse(delSaved) : [];
      if (!delList.includes(locToDelete)) {
        delList.push(locToDelete);
        localStorage.setItem(DELETED_LOCATIONS_STORAGE_KEY, JSON.stringify(delList));
      }

      const saved = localStorage.getItem(CUSTOM_LOCATIONS_STORAGE_KEY);
      if (saved) {
        const list: string[] = JSON.parse(saved);
        const filtered = list.filter((l) => l.trim() !== locToDelete);
        localStorage.setItem(CUSTOM_LOCATIONS_STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch {}

    const remaining = availableLocations.filter((l) => l !== locToDelete);
    const nextLoc = remaining.length > 0 ? remaining[0] : 'Estante Principal';

    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p.shelfLocation === locToDelete) {
          updateProduct(p.id, { shelfLocation: nextLoc });
        }
      });
    }

    setShelfLocation(nextLoc);
    setIsEditingLocation(false);
    setLocationsVersion((v) => v + 1);
    setSuccessToast(`¡Ubicación "${locToDelete}" eliminada correctamente!`);
  };

  const handleAddCustomCategory = () => {
    const newCat = customCategory.trim();
    if (!newCat) return;
    try {
      const saved = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      const list = saved ? JSON.parse(saved) : [];
      if (!list.includes(newCat)) {
        list.push(newCat);
        localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(list));
      }
    } catch {}
    setCategory(newCat as ProductCategory);
    setCustomCategory('');
    setIsCreatingNewCat(false);
    setCategoriesVersion((v) => v + 1);
    setSuccessToast(`¡Categoría "${newCat}" creada con éxito!`);
  };

  const handleAddCustomLocation = () => {
    const newLoc = customLocation.trim();
    if (!newLoc) return;
    try {
      const saved = localStorage.getItem(CUSTOM_LOCATIONS_STORAGE_KEY);
      const list = saved ? JSON.parse(saved) : [];
      if (!list.includes(newLoc)) {
        list.push(newLoc);
        localStorage.setItem(CUSTOM_LOCATIONS_STORAGE_KEY, JSON.stringify(list));
      }
    } catch {}
    setShelfLocation(newLoc);
    setCustomLocation('');
    setIsCreatingNewLocation(false);
    setLocationsVersion((v) => v + 1);
    setSuccessToast(`¡Ubicación "${newLoc}" creada con éxito!`);
  };

  // Sincronizar formulario según modo edición o creación
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setSku(editingProduct.sku);
      setCategory(editingProduct.category);
      setShelfLocation(editingProduct.shelfLocation || DEFAULT_SHELF_LOCATIONS[0]);
      setIsCreatingNewLocation(false);
      setCustomLocation('');
      setPrice(String(editingProduct.price));
      setCostPrice(String(editingProduct.costPrice));
      setStock(String(editingProduct.stock));
      setMinStock(String(editingProduct.minStock));
      setMaxStock(String(editingProduct.maxStock));
      setUnit(editingProduct.unit || 'Unidad');
      const rawImages = (editingProduct.images && editingProduct.images.length > 0)
        ? editingProduct.images
        : (editingProduct.image ? [editingProduct.image] : []);
      const realImages = rawImages.filter((img) => img && !img.includes('placeholder-new-product'));
      setProductPhotos(realImages.slice(0, 10));
      setDescription(editingProduct.description || '');
      setIsCustomizable(editingProduct.isCustomizable);
      setCustomizationPlaceholder(editingProduct.customizationPlaceholder || '');
      setShowInStore(editingProduct.showInStore !== false);
      setShowInCatalog(editingProduct.showInCatalog !== false);
      const curStock = Number(editingProduct.stock) || 0;
      setIsAvailable(curStock <= 0 ? false : editingProduct.isAvailable !== false);
      setIsCreatingNewCat(false);
      setCustomCategory('');
    } else {
      setName('');
      setSku('');
      setCategory(DEFAULT_CATEGORIES[0]);
      setShelfLocation(DEFAULT_SHELF_LOCATIONS[0]);
      setIsCreatingNewLocation(false);
      setCustomLocation('');
      setPrice('12000');
      setCostPrice('4500');
      setStock('10');
      setMinStock('5');
      setMaxStock('20');
      setUnit('Unidad');
      setProductPhotos([]);
      setDescription('');
      setIsCustomizable(false);
      setCustomizationPlaceholder('');
      setShowInStore(true); // Marcado por default
      setShowInCatalog(true); // Marcado por default
      setIsAvailable(true); // Disponible por default
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

    const finalShelfLocation = (
      isCreatingNewLocation && customLocation.trim()
        ? customLocation.trim()
        : shelfLocation.trim() || DEFAULT_SHELF_LOCATIONS[0]
    );

    // Guardar en la lista persistente de ubicaciones personalizadas
    if (isCreatingNewLocation && customLocation.trim()) {
      try {
        const saved = localStorage.getItem(CUSTOM_LOCATIONS_STORAGE_KEY);
        const list: string[] = saved ? JSON.parse(saved) : [];
        if (!list.includes(customLocation.trim())) {
          list.push(customLocation.trim());
          localStorage.setItem(CUSTOM_LOCATIONS_STORAGE_KEY, JSON.stringify(list));
        }
      } catch {}

    // Guardar en la lista persistente de categorías personalizadas
    if (isCreatingNewCat && customCategory.trim()) {
      try {
        const saved = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
        const list: string[] = saved ? JSON.parse(saved) : [];
        if (!list.includes(customCategory.trim())) {
          list.push(customCategory.trim());
          localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(list));
        }
      } catch {}
    }
    }

    const realPhotos = productPhotos.filter((img) => img && !img.includes('placeholder-new-product'));
    const finalImage = realPhotos.length > 0 ? realPhotos[0] : DEFAULT_PRODUCT_PLACEHOLDER;
    const finalImages = realPhotos.length > 0 ? realPhotos : [DEFAULT_PRODUCT_PLACEHOLDER];

    const finalDesc = description.trim() || `${name.trim()} de alta calidad elaborado artesanalmente por by.fio.`;

    const numStock = Number(stock) || 0;
    const isZero = numStock <= 0;
    const finalIsAvailable = isZero ? false : isAvailable;

    if (editingProduct) {
      // Modo Edición Completa
      updateProduct(editingProduct.id, {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        category: finalCategory,
        shelfLocation: finalShelfLocation,
        price: Number(price) || 0,
        costPrice: Number(costPrice) || 0,
        stock: numStock,
        minStock: Number(minStock) || 0,
        maxStock: Number(maxStock) || 0,
        unit: unit.trim() || 'Unidad',
        image: finalImage,
        images: finalImages,
        description: finalDesc,
        isCustomizable,
        customizationPlaceholder: isCustomizable ? customizationPlaceholder.trim() || 'Texto personalizado' : undefined,
        showInStore: finalIsAvailable ? showInStore : false,
        showInCatalog: finalIsAvailable ? showInCatalog : false,
        isAvailable: finalIsAvailable,
      });

      setSuccessToast('¡Artículo actualizado y guardado correctamente!');
    } else {
      // Modo Nuevo Producto
      addProduct({
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        category: finalCategory,
        shelfLocation: finalShelfLocation,
        price: Number(price) || 0,
        costPrice: Number(costPrice) || 0,
        stock: numStock,
        minStock: Number(minStock) || 0,
        maxStock: Number(maxStock) || 0,
        unit: unit.trim() || 'Unidad',
        image: finalImage,
        images: finalImages,
        description: finalDesc,
        isCustomizable,
        customizationPlaceholder: isCustomizable ? customizationPlaceholder.trim() || 'Texto personalizado' : undefined,
        showInStore: finalIsAvailable ? showInStore : false,
        showInCatalog: finalIsAvailable ? showInCatalog : false,
        isAvailable: finalIsAvailable,
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
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-clayLg border border-fio-200 overflow-hidden my-4">
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
            {/* Foto con Previsualización en Vivo y Carga Multifuncional (hasta 10 fotos) */}
            <div className="md:col-span-4 lg:col-span-3.5">
              <MultiImageUploadField
                images={productPhotos}
                onChange={setProductPhotos}
                maxImages={10}
                defaultPlaceholder={DEFAULT_PRODUCT_PLACEHOLDER}
                label="Fotografías del Producto"
              />
            </div>

            {/* Datos Principales (Nombre, SKU, Categoría, Estante) */}
            <div className="md:col-span-8 lg:col-span-8.5 space-y-3">
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
                      <Hash className="w-3 h-3" /> Auto
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Categoría */}
                <div>
                  <label className="block font-bold text-gray-700 text-xs mb-1.5">Categoría *</label>

                  {isEditingCat ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Nombre de la categoría..."
                        value={categoryEditName}
                        onChange={(e) => setCategoryEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveEditCategory();
                          }
                        }}
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl border-2 border-fio-purple bg-purple-50/50 font-semibold text-gray-900 focus:outline-none text-xs"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleSaveEditCategory}
                        className="px-2.5 py-1.5 bg-fio-purple text-white rounded-xl text-xs font-bold hover:bg-fio-800 transition-all cursor-pointer shadow-2xs shrink-0"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingCat(false)}
                        className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : isCreatingNewCat ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Nueva categoría..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomCategory();
                          }
                        }}
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl border-2 border-fio-pink bg-pink-50/40 font-semibold text-gray-900 focus:outline-none text-xs"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomCategory}
                        className="px-2.5 py-1.5 bg-fio-pink text-white rounded-xl text-xs font-bold hover:bg-pink-600 transition-all cursor-pointer shadow-2xs shrink-0"
                      >
                        Agregar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingNewCat(false)}
                        className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="relative flex-1 min-w-0">
                        <select
                          value={category}
                          onChange={(e) => {
                            if (e.target.value === '__new__') {
                              setIsCreatingNewCat(true);
                              setCustomCategory('');
                            } else {
                              setCategory(e.target.value as ProductCategory);
                            }
                          }}
                          className="w-full px-2.5 pr-6 py-2 rounded-xl border border-fio-200 bg-white font-semibold text-gray-800 focus:ring-2 focus:ring-fio-400 focus:outline-none cursor-pointer text-xs appearance-none truncate"
                        >
                          {availableCategories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                          <option value="__new__" className="text-fio-pink font-bold">✨ + Nueva Categoría...</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Botones compactos: Lápiz, Basurero y Más */}
                      <button
                        type="button"
                        onClick={handleStartEditCategory}
                        className="w-6.5 h-6.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center transition-all shadow-2xs active:scale-95 shrink-0 cursor-pointer"
                        title={`Editar o renombrar categoría "${category}"`}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteCategory}
                        className="w-6.5 h-6.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-all shadow-2xs active:scale-95 shrink-0 cursor-pointer"
                        title={`Eliminar categoría "${category}"`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingNewCat(true);
                          setCustomCategory('');
                        }}
                        className="w-6.5 h-6.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-fio-pink border border-pink-200 flex items-center justify-center transition-all shadow-2xs active:scale-95 shrink-0 cursor-pointer"
                        title="Crear nueva categoría"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Ubicación en Estante */}
                <div>
                  <label className="block font-bold text-gray-700 text-xs mb-1.5">Ubicación en Estante (WMS) *</label>

                  {isEditingLocation ? (
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1 min-w-0">
                        <input
                          type="text"
                          placeholder="Nombre de ubicación..."
                          value={locationEditName}
                          onChange={(e) => setLocationEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveEditLocation();
                            }
                          }}
                          className="w-full pl-7 pr-2.5 py-1.5 rounded-xl border-2 border-fio-purple bg-purple-50/50 font-semibold text-purple-900 focus:outline-none text-xs"
                          autoFocus
                        />
                        <MapPin className="w-3.5 h-3.5 text-fio-purple absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveEditLocation}
                        className="px-2.5 py-1.5 bg-fio-purple text-white rounded-xl text-xs font-bold hover:bg-fio-800 transition-all cursor-pointer shadow-2xs shrink-0"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingLocation(false)}
                        className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : isCreatingNewLocation ? (
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1 min-w-0">
                        <input
                          type="text"
                          placeholder="Ej: Estante E-3 o Cajón #4"
                          value={customLocation}
                          onChange={(e) => setCustomLocation(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomLocation();
                            }
                          }}
                          className="w-full pl-7 pr-2.5 py-1.5 rounded-xl border-2 border-fio-pink bg-pink-50/40 focus:ring-2 focus:ring-fio-400 focus:outline-none font-semibold text-purple-900 placeholder:text-gray-400 text-xs"
                          autoFocus
                        />
                        <MapPin className="w-3.5 h-3.5 text-fio-pink absolute left-2 top-1/2 -translate-y-1/2" />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCustomLocation}
                        className="px-2.5 py-1.5 bg-fio-pink text-white rounded-xl text-xs font-bold hover:bg-pink-600 transition-all cursor-pointer shadow-2xs shrink-0"
                      >
                        Agregar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingNewLocation(false)}
                        className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                        title="Volver a lista de ubicaciones existentes"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="relative flex-1 min-w-0">
                        <select
                          value={shelfLocation}
                          onChange={(e) => {
                            if (e.target.value === '__new__') {
                              setIsCreatingNewLocation(true);
                              setCustomLocation('');
                            } else {
                              setShelfLocation(e.target.value);
                            }
                          }}
                          className="w-full pl-7 pr-6 py-2 rounded-xl border border-fio-200 bg-white font-semibold text-purple-900 focus:ring-2 focus:ring-fio-400 focus:outline-none appearance-none cursor-pointer text-xs truncate"
                        >
                          {availableLocations.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                          <option value="__new__" className="text-fio-pink font-bold">
                            ✨ + Crear nueva ubicación...
                          </option>
                        </select>
                        <MapPin className="w-3.5 h-3.5 text-fio-pink absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Botones compactos: Lápiz, Basurero y Más */}
                      <button
                        type="button"
                        onClick={handleStartEditLocation}
                        className="w-6.5 h-6.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center transition-all shadow-2xs active:scale-95 shrink-0 cursor-pointer"
                        title={`Editar o renombrar ubicación "${shelfLocation}"`}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteLocation}
                        className="w-6.5 h-6.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-all shadow-2xs active:scale-95 shrink-0 cursor-pointer"
                        title={`Eliminar ubicación "${shelfLocation}"`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingNewLocation(true);
                          setCustomLocation('');
                        }}
                        className="w-6.5 h-6.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-fio-pink border border-pink-200 flex items-center justify-center transition-all shadow-2xs active:scale-95 shrink-0 cursor-pointer"
                        title="Crear nueva ubicación"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>
                  )}
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
                  step="any"
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
                  step="any"
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
                  onChange={(e) => {
                    setStock(e.target.value);
                    if (Number(e.target.value) <= 0) {
                      setIsAvailable(false);
                    }
                  }}
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

              {/* Opción 3: Disponibilidad de Producto */}
              <label
                htmlFor="isAvailableProduct"
                className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer sm:col-span-2 ${
                  isAvailable
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-sm text-emerald-950'
                    : 'bg-rose-50/80 border-rose-200 text-rose-800'
                }`}
              >
                <input
                  type="checkbox"
                  id="isAvailableProduct"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-400 cursor-pointer"
                />
                <div className="text-xs">
                  <div className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAvailable ? 'Producto Disponible (Activo)' : 'Producto No Disponible (Desactivado)'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {isAvailable
                      ? 'Aparece activo en la tienda, catálogo y puede ser agregado al carrito'
                      : 'Oculto automáticamente de la tienda y del catálogo'}
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
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{editingProduct ? 'Guardar Cambios del Artículo' : 'Guardar & Generar QR'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
