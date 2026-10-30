import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppRoute } from '../../types';
import { HeroDual } from './HeroDual';
import { TreeNavigation } from '../common/TreeNavigation';
import { StudioLocationScheduleCard } from '../common/StudioLocationScheduleCard';
import { PricingStickersSection } from './PricingStickersSection';
import { formatCRC } from '../../utils/formatters';
import { Sparkles, ArrowRight, Calendar, ShoppingBag, Heart, Check } from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { workshops, products, addToCart, cart } = useApp();

  const featuredWorkshops = workshops.slice(0, 3);
  const featuredProducts = products.filter((p) => p.showInStore !== false).slice(0, 4);

  return (
    <div className="space-y-10 sm:space-y-14 animate-fadeIn">
      {/* Hero Dual a Pantalla Completa De Borde a Borde (Full-Bleed, Cero Cortes Laterales) */}
      <HeroDual
        onScrollToWorkshops={() => onNavigate('workshops')}
        onScrollToProducts={() => onNavigate('store')}
        onNavigate={onNavigate}
      />

      {/* Contenido Restante con Contenedor Central Estándar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Sección Destacada: Talleres Creativos */}
        <section className="space-y-6">
          {/* Banner Ilustrado Oficial: Taller Creativo */}
          <div
            onClick={() => onNavigate('workshops')}
            className="rounded-[32px] overflow-hidden shadow-neuCard border border-white/90 bg-[#FAF5FF] group cursor-pointer"
          >
            <img
              src="/assets/imagen-tienda-creativa.jpeg"
              alt="Taller Creativo by.fio"
              className="w-full h-36 sm:h-52 md:h-64 object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/taller-creativo.jpeg';
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5FF] border border-fio-200 text-fio-800 text-[11px] font-semibold tracking-widest uppercase mb-2">
              <Sparkles className="w-3 h-3 text-fio-yellow fill-fio-yellow" />
              <span>Academia Creativa</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-slate-800 tracking-wide font-normal">
              Próximos Talleres Presenciales
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Cupos reducidos y materiales de primera calidad para atención 1 a 1.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('workshops')}
            className="neu-btn bg-[#F1F2F6] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bubble font-bold text-slate-700 hover:text-slate-900 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover flex items-center gap-1.5 self-start sm:self-auto transition-all active:scale-95"
          >
            <span>Ver todos los talleres ({workshops.length})</span>
            <ArrowRight className="w-4 h-4 text-fio-800" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredWorkshops.map((ws) => (
            <div
              key={ws.id}
              className="bg-[#F1F2F6] rounded-[32px] p-4 sm:p-5 border border-white/90 shadow-neuCard hover:shadow-neuCardHover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 rounded-2xl overflow-hidden bg-[#ECEEF2] shadow-neuInset mb-3">
                  <img src={ws.image} alt={ws.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[10px] font-bold text-slate-700 shadow-neuBtn">
                    {ws.modality}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-fio-700 font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ws.date}</span>
                </div>
                <h3 className="font-bubble font-bold text-lg text-slate-900 line-clamp-1">
                  {ws.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {ws.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between mt-3">
                <span className="font-bubble text-lg font-bold text-slate-900">
                  {formatCRC(ws.price)}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('workshops')}
                  className="px-4 py-2 rounded-xl neu-btn-primary text-xs font-bubble font-bold active:scale-95 transition-all"
                >
                  Ver cupos
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección Destacada: Tienda Online */}
      <section className="space-y-6 pt-6">
        {/* Banner Ilustrado Oficial: Tienda Online */}
        <div
          onClick={() => onNavigate('store')}
          className="rounded-[32px] overflow-hidden shadow-neuCard border border-white/90 bg-[#FAF5FF] group cursor-pointer"
        >
          <img
            src="/assets/imagen-tienda-online.jpeg"
            alt="Tienda Online by.fio"
            className="w-full h-36 sm:h-52 md:h-64 object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-fio-pink text-[11px] font-semibold tracking-widest uppercase mb-2">
              <Heart className="w-3 h-3 fill-current" />
              <span>Tienda Creativa</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-slate-800 tracking-wide font-normal">
              Favoritos de la Tienda
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Agendas, libros de vacunas, papelería fina e insumos listos para envío.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('store')}
            className="neu-btn bg-[#F1F2F6] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bubble font-bold text-slate-700 hover:text-slate-900 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover flex items-center gap-1.5 self-start sm:self-auto transition-all active:scale-95"
          >
            <span>Explorar toda la tienda ({products.length})</span>
            <ArrowRight className="w-4 h-4 text-fio-800" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => {
            const cartItem = cart.find((it) => it.id === p.id);
            const isInCart = !!cartItem;
            const cartQty = cartItem ? cartItem.quantity : 0;

            return (
              <div
                key={p.id}
                className="bg-[#F1F2F6] rounded-[32px] p-4 border border-white/90 shadow-neuCard hover:shadow-neuCardHover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-[#ECEEF2] shadow-neuInset mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[10px] font-bold text-slate-700 shadow-neuBtn">
                      {p.category}
                    </span>

                    {/* Etiqueta Sin Bordes: Producto Agregado */}
                    {isInCart && (
                      <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bubble font-bold shadow-md border-0 flex items-center gap-1 z-10 animate-fadeIn">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Producto Agregado{cartQty > 1 ? ` (${cartQty})` : ''}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-bubble font-bold text-base text-slate-900 line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between mt-3">
                  <span className="font-bubble text-lg font-bold text-slate-900">
                    {formatCRC(p.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart({
                        type: 'product',
                        id: p.id,
                        sku: p.sku,
                        name: p.name,
                        price: p.price,
                        quantity: 1,
                        image: p.image,
                        shelfLocation: p.shelfLocation,
                      });
                    }}
                    className={`w-10 h-10 neu-btn-circle ${
                      isInCart
                        ? 'text-emerald-600 bg-emerald-50 shadow-neuBtn'
                        : 'text-slate-700 hover:text-fio-800'
                    } active:scale-90 transition-all`}
                    title={isInCart ? `Ya en carrito (${cartQty}) - Agregar 1 más` : 'Agregar al Carrito'}
                  >
                    {isInCart ? <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> : <ShoppingBag className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN DE PRECIOS DE STICKERS & CÓMO HACER TU PEDIDO (EDITABLE ADMIN)
          ========================================================================= */}
      <PricingStickersSection onNavigate={onNavigate} />

      {/* =========================================================================
          UBICACIÓN Y HORARIOS DE ATENCIÓN (TIBÁS, COSTA RICA)
          ========================================================================= */}
      <StudioLocationScheduleCard />
      </div>
    </div>
  );
};
