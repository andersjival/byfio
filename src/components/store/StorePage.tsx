import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product, AppRoute } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { TreeNavigation } from '../common/TreeNavigation';
import { ProductDetailModal } from './ProductDetailModal';
import {
  ShoppingBag, Search, Star, Heart,
  Check, AlertCircle, Flower2, Plus, Minus,
  Pencil, PlusCircle, Sparkles, Layers,
  Scissors, Cog, X, ArrowRight, Package
} from 'lucide-react';

export type StoreDepartment = 'papeleria' | 'dtf' | 'personalizables' | 'maquinaria';

export interface DepartmentConfig {
  id: StoreDepartment;
  title: string;
  shortTitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  subcategories: string[];
}

export const STORE_DEPARTMENTS: DepartmentConfig[] = [
  {
    id: 'papeleria',
    title: 'Papelería e Insumos',
    shortTitle: 'Papelería',
    badge: 'Taller & Creación',
    icon: Scissors,
    description: 'Stickers de vinil impermeable, kits de encuadernación, papeles especiales e insumos creativos.',
    subcategories: [
      'Todas',
      'Stickers y Papelería',
      'Kits e Insumos',
      'Papeles y Cartulinas',
      'Herramientas Manuales',
    ],
  },
  {
    id: 'dtf',
    title: 'DTF',
    shortTitle: 'DTF',
    badge: 'Textil & UV',
    icon: Layers,
    description: 'Transfers DTF textil de alta resolución, láminas adhesivas DTF UV y poliamidas de fijación.',
    subcategories: [
      'Todas',
      'DTF Textil',
      'DTF UV',
      'Láminas y Transfers',
      'Insumos DTF',
    ],
  },
  {
    id: 'personalizables',
    title: 'Personalizables',
    shortTitle: 'Personalizados',
    badge: 'Hecho a tu Gusto',
    icon: Sparkles,
    description: 'Agendas artesanales fechadas, libros de vacunas acolchados, tazas sublimadas y detalles con tu nombre.',
    subcategories: [
      'Todas',
      'Agendas Personalizadas',
      'Libros de Vacunas',
      'Artículos Sublimados',
      'Detalles con Nombre',
    ],
  },
  {
    id: 'maquinaria',
    title: 'Maquinaria',
    shortTitle: 'Maquinaria',
    badge: 'Equipos & Prensas',
    icon: Cog,
    description: 'Prensas térmicas multifuncionales, plotters de corte digital, laminadoras y repuestos para producción.',
    subcategories: [
      'Todas',
      'Máquinas y Equipo',
      'Prensas Térmicas',
      'Plotters de Corte',
      'Repuestos y Accesorios',
    ],
  },
];

export const getProductDepartment = (p: Product): StoreDepartment => {
  if (!p) return 'papeleria';
  const cat = (p.category || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const sku = (p.sku || '').toLowerCase();
  const fullText = `${cat} ${name} ${desc} ${sku}`;

  // 1. DTF (prioridad para transfer dtf, dtf uv, poliamida, etc)
  if (
    cat.includes('dtf') ||
    fullText.includes('dtf') ||
    fullText.includes('transfer textil') ||
    fullText.includes('poliamida') ||
    fullText.includes('film textil')
  ) {
    return 'dtf';
  }

  // 2. Maquinaria
  if (
    cat.includes('máquina') ||
    cat.includes('maquina') ||
    cat.includes('equipo') ||
    fullText.includes('prensa térmica') ||
    fullText.includes('prensa termica') ||
    fullText.includes('plotter') ||
    fullText.includes('cameo') ||
    fullText.includes('cricut') ||
    fullText.includes('laminadora')
  ) {
    return 'maquinaria';
  }

  // 3. Personalizables
  if (
    p.isCustomizable ||
    cat.includes('agenda') ||
    cat.includes('vacuna') ||
    cat.includes('sublimad') ||
    fullText.includes('personaliz') ||
    fullText.includes('libro de vacuna') ||
    fullText.includes('agenda 202') ||
    fullText.includes('taza cerámica') ||
    fullText.includes('tote bag')
  ) {
    return 'personalizables';
  }

  // 4. Default: Papelería e insumos
  return 'papeleria';
};

export const isProductInSubcategory = (
  p: Product,
  dept: StoreDepartment,
  subcat: string
): boolean => {
  if (subcat === 'Todas') return true;
  if (p.category === subcat) return true;

  const cat = (p.category || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const fullText = `${cat} ${name} ${desc}`;
  const sLower = subcat.toLowerCase();

  switch (dept) {
    case 'papeleria':
      if (sLower === 'stickers y papelería') {
        return fullText.includes('sticker') || fullText.includes('memo pad') || fullText.includes('papeler');
      }
      if (sLower === 'kits e insumos') {
        return fullText.includes('kit') || fullText.includes('insumo') || fullText.includes('tazas blancas');
      }
      if (sLower === 'papeles y cartulinas') {
        return ['papel', 'cartulina', 'opalina', 'resma', 'hojas'].some((k) => fullText.includes(k));
      }
      if (sLower === 'herramientas manuales') {
        return ['plegadera', 'punzón', 'punzon', 'herramienta', 'tijera', 'cúter', 'cuter'].some((k) =>
          fullText.includes(k)
        );
      }
      break;

    case 'dtf':
      if (sLower === 'dtf textil') {
        return fullText.includes('textil') || fullText.includes('ropa') || fullText.includes('prenda');
      }
      if (sLower === 'dtf uv') {
        return fullText.includes('uv') || fullText.includes('rígido') || fullText.includes('rigido');
      }
      if (sLower === 'láminas y transfers') {
        return ['lámina', 'lamina', 'transfer', 'metro'].some((k) => fullText.includes(k));
      }
      if (sLower === 'insumos dtf') {
        return ['poliamida', 'tinta', 'polvo', 'film', 'insumo'].some((k) => fullText.includes(k));
      }
      break;

    case 'personalizables':
      if (sLower === 'agendas personalizadas') {
        return fullText.includes('agenda');
      }
      if (sLower === 'libros de vacunas') {
        return fullText.includes('vacuna');
      }
      if (sLower === 'artículos sublimados') {
        return ['sublimad', 'taza', 'tote'].some((k) => fullText.includes(k));
      }
      if (sLower === 'detalles con nombre') {
        return Boolean(p.isCustomizable) || ['nombre', 'frase', 'inicial'].some((k) => fullText.includes(k));
      }
      break;

    case 'maquinaria':
      if (sLower === 'máquinas y equipo') {
        return cat.includes('máquinas y equipo') || cat.includes('equipo');
      }
      if (sLower === 'prensas térmicas') {
        return fullText.includes('prensa') || fullText.includes('sublimadora');
      }
      if (sLower === 'plotters de corte') {
        return ['plotter', 'cameo', 'cricut'].some((k) => fullText.includes(k));
      }
      if (sLower === 'repuestos y accesorios') {
        return ['repuesto', 'accesorio', 'cuchilla', 'teflón', 'teflon', 'tapete'].some((k) =>
          fullText.includes(k)
        );
      }
      break;
  }

  return fullText.includes(sLower);
};

interface StorePageProps {
  onNavigate: (route: AppRoute) => void;
}

export const StorePage: React.FC<StorePageProps> = ({ onNavigate }) => {
  const { products, addToCart, cart, setIsCartOpen, setIsNewProductModalOpen, setEditingProduct, inventoryMode } = useApp();
  const [activeDepartment, setActiveDepartment] = useState<StoreDepartment>('papeleria');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [customTextInputs, setCustomTextInputs] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const currentDeptConfig = useMemo(() => {
    return STORE_DEPARTMENTS.find((d) => d.id === activeDepartment) || STORE_DEPARTMENTS[0];
  }, [activeDepartment]);

  const getQty = (id: string) => quantities[id] || 1;

  const handleQtyChange = (id: string, delta: number, maxStock: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const maxLimit = inventoryMode === 'availability' ? 99 : Math.max(1, maxStock);
      const next = Math.max(1, Math.min(maxLimit, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const safeProducts = useMemo(() => {
    return Array.isArray(products) ? products.filter(Boolean) : [];
  }, [products]);

  // Filtro de productos del departamento activo
  const filteredProducts = useMemo(() => {
    return safeProducts.filter((p) => {
      if (!p) return false;
      // Si el producto está en cero o se desactiva, desaparece automáticamente de la tienda
      if ((p.stock ?? 0) <= 0 || p.isAvailable === false || p.showInStore === false) return false;

      // 1. Debe pertenecer al departamento activo
      if (getProductDepartment(p) !== activeDepartment) return false;

      // 2. Filtro de subcategoría
      if (!isProductInSubcategory(p, activeDepartment, selectedCategory)) return false;

      // 3. Buscador inteligente
      const q = (searchQuery || '').toLowerCase().trim();
      if (q) {
        const matchesSearch =
          (p.name || '').toLowerCase().includes(q) ||
          (p.sku || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // 4. Toggle personalizable
      if (onlyCustomizable && !p.isCustomizable) return false;

      return true;
    });
  }, [safeProducts, activeDepartment, selectedCategory, searchQuery, onlyCustomizable]);

  // Coincidencias inteligentes en otros departamentos cuando el usuario busca algo
  const otherDeptMatches = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return [];

    return STORE_DEPARTMENTS.filter((d) => d.id !== activeDepartment)
      .map((d) => {
        const matches = safeProducts.filter((p) => {
          if (!p) return false;
          if ((p.stock ?? 0) <= 0 || p.isAvailable === false || p.showInStore === false) return false;
          if (getProductDepartment(p) !== d.id) return false;
          return (
            (p.name || '').toLowerCase().includes(q) ||
            (p.sku || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q) ||
            (p.category || '').toLowerCase().includes(q)
          );
        });
        return {
          department: d,
          count: matches.length,
        };
      })
      .filter((res) => res.count > 0);
  }, [searchQuery, activeDepartment, safeProducts]);

  const handleCustomTextChange = (prodId: string, val: string) => {
    setCustomTextInputs((prev) => ({ ...prev, [prodId]: val }));
  };

  const handleAdd = (product: Product, overrideQty?: number, overrideText?: string) => {
    try {
      if (!product || !product.id) return;
      const customText = overrideText !== undefined ? overrideText : (customTextInputs[product.id] || '');
      const qty = overrideQty !== undefined ? overrideQty : getQty(product.id);
      addToCart({
        type: 'product',
        id: product.id,
        sku: product.sku || '',
        name: product.name || 'Producto',
        price: Number(product.price) || 0,
        quantity: Math.max(1, Number(qty) || 1),
        image: product.image || '',
        shelfLocation: product.shelfLocation,
        customText: product.isCustomizable ? customText : undefined,
      });
      setAddedAnimationId(product.id);
      setTimeout(() => setAddedAnimationId(null), 1400);
    } catch (err) {
      console.error('Error al agregar al carrito desde StorePage:', err);
    }
  };

  const breadcrumbs = [
    { label: 'by.fio', route: 'home' as AppRoute },
    { label: 'tienda', route: 'store' as AppRoute },
    { label: currentDeptConfig.title },
    ...(selectedCategory !== 'Todas' ? [{ label: selectedCategory }] : []),
  ];

  return (
    <div className="py-2 sm:py-4 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Encabezado Editorial con Árbol Integrado */}
      <div className="relative text-center py-6 sm:py-8 px-6 rounded-[36px] bg-[#F1F2F6] border border-white/90 shadow-neuCard overflow-hidden">
        {/* Glows interiores suaves */}
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
            <Star className="w-3 h-3 text-fio-pink fill-fio-pink" />
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

      {/* Banner Ilustrado Oficial: Tienda Online */}
      <div className="rounded-[32px] overflow-hidden shadow-neuCard border border-white/90 bg-[#FAF5FF] group">
        <img
          src="/assets/imagen-tienda-online.jpeg"
          alt="Tienda Online by.fio"
          className="w-full h-44 sm:h-64 md:h-80 object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
        />
      </div>

      {/* Selector Compacto de Departamentos (Macro-Categorías) — Reducido ~60% */}
      <div className="py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-2xl sm:rounded-[24px] bg-[#F1F2F6] border border-white/90 shadow-neuCard">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 max-w-4xl mx-auto">
          {STORE_DEPARTMENTS.map((dept) => {
            const isActive = activeDepartment === dept.id;
            const Icon = dept.icon;
            const deptCount = safeProducts.filter(
              (p) =>
                (p.stock ?? 0) > 0 &&
                p.isAvailable !== false &&
                p.showInStore !== false &&
                getProductDepartment(p) === dept.id
            ).length;

            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => {
                  setActiveDepartment(dept.id);
                  setSelectedCategory('Todas');
                }}
                className={`group flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl sm:rounded-2xl transition-all duration-200 select-none ${
                  isActive
                    ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.01] ring-1 ring-fio-purple/30 z-10'
                    : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-slate-900 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover active:scale-95'
                }`}
              >
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                    isActive
                      ? 'bg-white/20 text-white shadow-inner'
                      : 'bg-white text-fio-700 shadow-xs border border-white/90'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>

                <span className="font-bubble text-[11px] sm:text-xs font-bold tracking-tight truncate">
                  {dept.title}
                </span>

                <span
                  className={`text-[9px] sm:text-[10px] font-sans font-semibold px-1.5 py-0.2 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-[#ECEEF2] text-slate-500 shadow-neuInset'
                  }`}
                >
                  {deptCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de Filtros Rápidos Dinámica y Buscador Inteligente */}
      <div className="p-4 sm:p-5 rounded-[28px] bg-[#F1F2F6] border border-white/90 shadow-neuCard flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Subcategorías como Botones Neumórficos Táctiles Dinámicos */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 w-full lg:w-auto">
          {currentDeptConfig.subcategories.map((subcat) => {
            const isSelected = selectedCategory === subcat;
            return (
              <button
                key={subcat}
                type="button"
                onClick={() => setSelectedCategory(subcat)}
                className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bubble font-bold tracking-wide transition-all duration-200 ${
                  isSelected
                    ? 'neu-btn-primary text-white shadow-neuBtnHover scale-[1.02]'
                    : 'neu-btn bg-[#F1F2F6] text-slate-700 hover:text-slate-900 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
                }`}
              >
                {subcat}
              </button>
            );
          })}
        </div>

        {/* Buscador Inteligente, Toggle de Personalizados y Agregar Producto */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setOnlyCustomizable(!onlyCustomizable)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bubble font-bold transition-all ${
              onlyCustomizable
                ? 'neu-btn-amber text-white shadow-neuBtnHover'
                : 'neu-btn bg-[#F1F2F6] text-slate-700 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-fio-pink fill-fio-pink" />
            <span>Personalizables</span>
          </button>

          {/* Buscador Inteligente con botón de limpiar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={`Buscar en ${currentDeptConfig.shortTitle} o SKU…`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#ECEEF2] rounded-2xl text-xs text-slate-800 placeholder-slate-400 border border-white/60 shadow-neuInset focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Botón Admin: Agregar Producto Directo desde Tienda */}
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setIsNewProductModalOpen(true);
            }}
            className="neu-btn-primary flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bubble font-bold text-white shadow-neuBtn active:scale-95 transition-all shrink-0 w-full sm:w-auto"
            title="Crear un nuevo producto para la tienda y catálogo"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>+ Agregar Producto</span>
          </button>
        </div>
      </div>

      {/* Sugerencia Inteligente Multi-Departamento (Si hay coincidencias en otras secciones) */}
      {otherDeptMatches.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-fio-50 to-pink-50 border border-fio-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <span className="p-1.5 rounded-xl bg-white shadow-sm text-fio-600">💡</span>
            <div>
              <p className="font-bubble font-bold text-slate-800">
                ¿Buscabas en otro departamento?
              </p>
              <p className="text-slate-600 text-[11px] font-sans">
                Encontramos coincidencias para <span className="font-semibold text-fio-900">"{searchQuery}"</span> en:{' '}
                {otherDeptMatches.map((m) => `${m.department.title} (${m.count})`).join(', ')}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {otherDeptMatches.map((m) => (
              <button
                key={m.department.id}
                type="button"
                onClick={() => {
                  setActiveDepartment(m.department.id);
                  setSelectedCategory('Todas');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-fio-purple hover:text-white text-fio-800 text-xs font-bubble font-bold border border-fio-200 shadow-sm transition-all active:scale-95"
              >
                <span>Ir a {m.department.shortTitle} ({m.count})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Productos — "Cajitas Bonitas" Estilo Neumórfico Suave */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-14 px-6 rounded-[32px] bg-white/70 border border-white/90 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ECEEF2] text-fio-700 mx-auto flex items-center justify-center shadow-neuInset">
            <currentDeptConfig.icon className="w-6 h-6" />
          </div>
          <h3 className="font-bubble text-xl text-slate-800 font-bold">
            {searchQuery
              ? `No encontramos "${searchQuery}" en ${currentDeptConfig.title}`
              : `Aún no hay productos disponibles en ${currentDeptConfig.title}`}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? 'Prueba con otra palabra clave o revisa las sugerencias de otros departamentos arriba.'
              : 'Los productos nuevos que registres en esta sección aparecerán aquí automáticamente.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {(searchQuery || selectedCategory !== 'Todas' || onlyCustomizable) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todas');
                  setOnlyCustomizable(false);
                }}
                className="px-4 py-2 rounded-2xl bg-slate-800 text-white text-xs font-bubble font-bold shadow-sm hover:bg-slate-700 transition-all"
              >
                Ver todos en {currentDeptConfig.shortTitle}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setIsNewProductModalOpen(true);
              }}
              className="px-4 py-2 rounded-2xl neu-btn-primary text-white text-xs font-bubble font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Agregar Producto a {currentDeptConfig.shortTitle}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((p) => {
            const isOutOfStock = inventoryMode === 'availability' ? false : p.stock <= 0;
            const isLowStock = inventoryMode === 'availability' ? false : (p.stock > 0 && p.stock <= p.minStock);
            const isAdded = addedAnimationId === p.id;
            const safeCart = Array.isArray(cart) ? cart.filter(Boolean) : [];
            const cartItem = safeCart.find((it) => it && it.id === p.id);
            const isInCart = !!cartItem;
            const cartQty = cartItem ? cartItem.quantity : 0;

            return (
              <div
                key={p.id}
                className="group flex flex-col bg-[#F1F2F6] rounded-[30px] p-4 sm:p-5 border border-white/90 shadow-neuCard hover:shadow-neuCardHover transition-all duration-300"
              >
                {/* Contenedor de Imagen con Marco Neumórfico Rehundido */}
                <div
                  onClick={() => setDetailProduct(p)}
                  className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#ECEEF2] shadow-neuInset border border-white/80 cursor-pointer group/img"
                  title="Toca para ver galería de fotos y detalles"
                >
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

                  {/* Etiqueta Sin Bordes: Producto Agregado */}
                  {isInCart && (
                    <span className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] sm:text-[11px] font-bubble font-bold shadow-md border-0 flex items-center gap-1.5 z-10 animate-fadeIn">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Producto Agregado{cartQty > 1 ? ` (${cartQty})` : ''}</span>
                    </span>
                  )}

                  {/* Pastilla de Stock o Disponibilidad */}
                  {inventoryMode === 'availability' ? (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-neuBtn flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>Disponible</span>
                    </span>
                  ) : isOutOfStock ? (
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

                  {/* Indicador de múltiples fotos si aplica */}
                  {Array.isArray(p.images) && p.images.filter(img => typeof img === 'string' && !img.includes('placeholder-new-product')).length > 1 && (
                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bubble font-bold shadow-md flex items-center gap-1.5 z-10 border border-white/20 pointer-events-none">
                      <span>📷 {p.images.filter(img => !img.includes('placeholder-new-product')).length} fotos</span>
                    </span>
                  )}
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="pt-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{p.sku}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-sans">{p.unit}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(p);
                            setIsNewProductModalOpen(true);
                          }}
                          className="p-1 rounded-md bg-white hover:bg-slate-100 text-slate-500 hover:text-fio-pink transition-colors shadow-xs"
                          title="Editar producto como admin"
                        >
                          <Pencil className="w-3 h-3 text-fio-pink" />
                        </button>
                      </div>
                    </div>

                    <h3
                      onClick={() => setDetailProduct(p)}
                      className="font-bubble text-lg text-slate-900 font-bold leading-snug line-clamp-1 group-hover:text-fio-800 transition-colors cursor-pointer"
                      title="Toca para ver características y fotos"
                    >
                      {p.name}
                    </h3>

                    <p
                      onClick={() => setDetailProduct(p)}
                      className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-sans cursor-pointer hover:text-slate-700 transition-colors"
                      title="Toca para ver características y fotos"
                    >
                      {p.description}
                    </p>

                    {/* Input Rehundido de Personalización si Aplica */}
                    {p.isCustomizable && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-fio-800 mb-1 flex items-center gap-1">
                          <Heart className="w-3 h-3 text-fio-pink fill-fio-pink" />
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
                                disabled={inventoryMode === 'availability' ? false : currentQty >= p.stock}
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
                              <Check className="w-4 h-4 stroke-[2.5]" />
                              <span>¡Agregado con éxito!</span>
                            </>
                          ) : isInCart ? (
                            <>
                              <ShoppingBag className="w-4 h-4 text-white" />
                              <span>Agregar Más ({cartQty} en Carrito)</span>
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

      {/* Modal Detallado con Galería de Fotos y Características */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        initialCustomText={detailProduct ? (customTextInputs[detailProduct.id] || '') : ''}
        onCustomTextChange={(text) => {
          if (detailProduct) {
            handleCustomTextChange(detailProduct.id, text);
          }
        }}
        onAddToCart={(prod, qty, text) => {
          if (text !== undefined) {
            handleCustomTextChange(prod.id, text);
          }
          if (qty !== undefined) {
            setQuantities((prev) => ({ ...prev, [prod.id]: qty }));
          }
          handleAdd(prod, qty, text);
          setDetailProduct(null);
        }}
      />

      {/* Frase Calm & Artisanal al Pie */}
      <div className="text-center py-6 text-xs text-slate-400 font-sans tracking-widest uppercase">
        • Cada pieza es creada individualmente con materiales de primera calidad •
      </div>
    </div>
  );
};
