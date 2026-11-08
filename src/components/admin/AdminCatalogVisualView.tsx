import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { formatCRC } from '../../utils/formatters';
import { Search, ChevronLeft, ChevronRight, ArrowLeft, MapPin, Eye, X, Image as ImageIcon } from 'lucide-react';

interface AdminCatalogVisualViewProps {
  onBackToHub: () => void;
}

export const AdminCatalogVisualView: React.FC<AdminCatalogVisualViewProps> = ({ onBackToHub }) => {
  const { products } = useApp();
  const [currentSlide, setCurrentSlide] = useState<0 | 1>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // Auto-slider alternando entre Slide 0 (Banner Estrellitas) y Slide 1 (Banner Catálogo ByFio)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Categorías de productos
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['Todas', ...Array.from(set)];
  }, [products]);

  // Filtrado de productos para la cuadrícula
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-7xl mx-auto">
      {/* =========================================================================
          ENCABEZADO MINIMALISTA: SOLO LOGO BYFIO Y "CATÁLOGO DIGITAL ONLINE"
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white/90 border border-fio-200 shadow-neuCard backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <img
            src="/assets/logo-byfio-lila-HD.png"
            alt="by.fio"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-2xl p-1 bg-purple-50 border border-purple-100 shadow-2xs"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/logo-byfio.svg';
            }}
          />
          <div>
            <h1 className="font-bubble font-bold text-lg sm:text-2xl text-fio-900 leading-tight">
              Catálogo Digital Online
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-sans">
              Galería visual de artículos exclusivos y fotos en alta definición
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToHub}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F1F2F6] hover:bg-pink-50 text-slate-700 hover:text-fio-pink border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover font-bubble font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
          title="Regresar al Menú Principal de Administración"
        >
          <ArrowLeft className="w-4 h-4 text-fio-pink" />
          <span>Volver al Menú Principal</span>
        </button>
      </div>

      {/* =========================================================================
          SLIDER DE BANNERS: BANNER DE LAS ESTRELLITAS <-> BANNER CATÁLOGO BYFIO
          ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden shadow-neuCard border border-white/90 bg-gradient-to-tr from-purple-900 via-fio-900 to-pink-900 h-48 sm:h-64 md:h-80 select-none group">
        {/* Slide 0: Banner de las Estrellitas Normal */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <video
            src="/assets/vid-estrellita.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
            poster="/assets/imagen-catalogo-digital.jpeg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex flex-col justify-end p-5 sm:p-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-bubble font-bold uppercase tracking-wider w-fit mb-1 border border-white/30">
              ✨ Alerta Estrellitas by.fio
            </span>
            <h2 className="text-white font-bubble font-bold text-lg sm:text-2xl drop-shadow-md">
              Colección Creativa &amp; Hecha con Amor
            </h2>
          </div>
        </div>

        {/* Slide 1: Banner Catálogo Online ByFio */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src="/assets/imagen-catalogo-digital.jpeg"
            alt="Catálogo Online ByFio"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/30 backdrop-blur-md text-purple-100 text-[10px] sm:text-xs font-bubble font-bold uppercase tracking-wider w-fit mb-1 border border-purple-300/40">
              📖 Catálogo Digital Oficial
            </span>
            <h2 className="text-white font-bubble font-bold text-lg sm:text-2xl drop-shadow-md">
              Catálogo Online By.Fio • Pedidos &amp; Galería
            </h2>
          </div>
        </div>

        {/* Controles de Navegación del Slider */}
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center backdrop-blur-xs shadow-md transition-all active:scale-90"
          title="Banner anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center backdrop-blur-xs shadow-md transition-all active:scale-90"
          title="Siguiente banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicadores de Puntos (Dots) */}
        <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/20">
          <button
            type="button"
            onClick={() => setCurrentSlide(0)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentSlide === 0 ? 'bg-fio-yellow scale-125' : 'bg-white/60 hover:bg-white'
            }`}
            title="Ver banner estrellitas"
          />
          <button
            type="button"
            onClick={() => setCurrentSlide(1)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentSlide === 1 ? 'bg-fio-yellow scale-125' : 'bg-white/60 hover:bg-white'
            }`}
            title="Ver banner catálogo ByFio"
          />
        </div>
      </div>

      {/* =========================================================================
          BARRA DE BÚSQUEDA Y CATEGORÍAS
          ========================================================================= */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-white border border-fio-200 shadow-neuCard flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Categorías */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase mr-1">Categorías:</span>
          {categories.map((cat) => {
            const count = cat === 'Todas' ? products.length : products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bubble font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-fio-800 text-white shadow-2xs'
                    : 'bg-[#F1F2F6] text-slate-700 hover:bg-fio-100 border border-white/80'
                }`}
              >
                {cat} <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o estante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#ECEEF2] rounded-2xl border border-white/60 text-xs text-slate-800 placeholder-slate-400 shadow-neuInset focus:outline-none focus:ring-2 focus:ring-fio-300"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* =========================================================================
          CUADRÍCULA VISUAL DE PRODUCTOS (SOLO FOTOS Y DATOS CLAVE)
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            onClick={() => setPreviewProduct(prod)}
            className="group bg-white rounded-3xl p-3 border border-fio-200 shadow-neuCard hover:shadow-neuCardHover transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Foto Principal */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-fio-50 shadow-neuInset mb-3">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-white/95 text-slate-800 font-bubble font-bold text-xs shadow-md flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-fio-pink" />
                    <span>Ver Foto</span>
                  </span>
                </div>
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-700 shadow-2xs">
                  {prod.category}
                </span>
              </div>

              {/* Título & SKU */}
              <span className="font-mono text-[10px] font-bold text-fio-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 block w-fit mb-1">
                {prod.sku}
              </span>
              <h3 className="font-bubble font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-fio-900 transition-colors">
                {prod.name}
              </h3>
            </div>

            {/* Ubicación en estante & Precio */}
            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between gap-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                <MapPin className="w-3 h-3 text-fio-pink shrink-0" />
                <span>{prod.shelfLocation}</span>
              </span>
              <span className="font-bubble font-bold text-xs sm:text-sm text-fio-900">
                {formatCRC(prod.price)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white border border-fio-200">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-bubble font-bold text-sm text-slate-700">
            No se encontraron productos en esta categoría o búsqueda
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Intenta cambiar el término de búsqueda o selecciona "Todas".
          </p>
        </div>
      )}

      {/* =========================================================================
          MODAL DE VISTA PREVIA EN ALTA DEFINICIÓN AL HACER CLIC EN UN PRODUCTO
          ========================================================================= */}
      {previewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setPreviewProduct(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-fio-200 space-y-4 p-5 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-fio-100 text-fio-800 px-2 py-0.5 rounded">
                  {previewProduct.sku}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {previewProduct.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={previewProduct.image}
                alt={previewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 className="font-bubble font-bold text-base text-slate-900">
                {previewProduct.name}
              </h2>
              {previewProduct.description && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {previewProduct.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
                <MapPin className="w-3.5 h-3.5 text-fio-pink" />
                <span>Estante: {previewProduct.shelfLocation}</span>
              </span>
              <span className="font-bubble font-bold text-lg text-fio-900">
                {formatCRC(previewProduct.price)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
