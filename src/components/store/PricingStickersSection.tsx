import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppRoute, StickerPriceCategory } from '../../types';
import { formatCRC } from '../../utils/formatters';
import {
  Award, Tag, ShoppingBag, BookOpen, MessageCircle,
  Gift, CheckCircle2, Star, ArrowRight, Palette, HelpCircle, Heart
} from 'lucide-react';

interface PricingStickersSectionProps {
  onNavigate: (route: AppRoute) => void;
  showHowToOrderOnly?: boolean;
}

export const PricingStickersSection: React.FC<PricingStickersSectionProps> = ({
  onNavigate,
  showHowToOrderOnly = false,
}) => {
  const { pricingData, viewMode, setIsPricingModalOpen } = useApp();

  const handleWhatsAppOrder = (catTitle: string, qty: number, price: number, giftText?: string) => {
    let text = `¡Hola Fio! 💜✨ Me gustaría hacer un pedido de *${catTitle}*:\n\n`;
    text += `📦 *Cantidad:* ${qty} unidades\n`;
    text += `💰 *Precio:* ${formatCRC(price)}\n`;
    if (giftText) {
      text += `🎁 *Regalías:* ${giftText}\n`;
    }
    text += `\n¿Me podrías brindar los detalles para enviar mi logo y confirmar el pedido? ¡Muchas gracias! ✨🇨🇷`;
    window.open(`https://wa.me/50664004640?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="seccion-precios" className="space-y-8 animate-fadeIn pt-2">
      {/* =========================================================================
          BLOQUE 1: LISTA DE PRECIOS DE STICKERS (SI NO ES SOLO MODO PASOS)
          ========================================================================= */}
      {!showHowToOrderOnly && (
        <div className="space-y-6">
          {/* Encabezado Neumórfico de la Sección de Precios */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-white/90 text-fio-800 text-[11px] font-bubble font-bold tracking-widest uppercase shadow-neuBtn">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Precios Oficiales de Taller</span>
              </div>
              <h2 className="font-bubble text-2xl sm:text-4xl text-slate-900 tracking-tight font-bold mt-2">
                {pricingData.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1 max-w-2xl">
                {pricingData.subtitle}
              </p>
            </div>

            {/* Botón de Edición Rápida si es Admin */}
            {viewMode === 'admin' && (
              <button
                type="button"
                onClick={() => setIsPricingModalOpen(true)}
                className="neu-btn bg-[#F1F2F6] px-4 py-2 rounded-xl text-xs font-bubble font-bold text-fio-800 border border-white/80 shadow-neuBtn hover:shadow-neuBtnHover flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Palette className="w-3.5 h-3.5 text-fio-pink" />
                <span>Editar Precios &amp; Textos</span>
              </button>
            )}
          </div>

          {/* Grid de Categorías de Stickers (5x5, 4x4 o personalizadas) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {pricingData.categories.map((cat: StickerPriceCategory, idx: number) => {
              const isHighlight = idx === 0;

              return (
                <div
                  key={cat.id}
                  className="bg-[#F1F2F6] rounded-[32px] p-4 sm:p-7 border border-white/90 shadow-neuCard hover:shadow-neuCardHover transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Encabezado de la Tarjeta de Categoría */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-fio-pink to-[#D4AEFA] shadow-xs inline-block" />
                          <h3 className="font-bubble font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                            {cat.title}
                          </h3>
                        </div>
                        {cat.subtitle && (
                          <p className="text-xs text-slate-500 font-sans mt-1">
                            {cat.subtitle}
                          </p>
                        )}
                      </div>

                      <span className="px-3 py-1 rounded-full bg-white text-slate-700 font-bubble font-bold text-[10px] shadow-neuBtn border border-white/80 shrink-0">
                        Acabado Prémium
                      </span>
                    </div>

                    {/* Tabla / Tarjetas de Niveles de Precio */}
                    <div className="space-y-2.5">
                      {cat.tiers.map((tier) => (
                        <div
                          key={tier.id}
                          className="p-2.5 sm:p-3.5 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset flex items-center justify-between gap-2.5 sm:gap-3 group/tier hover:bg-[#E9ECF0] transition-colors"
                        >
                          {/* Cantidad y Regalías */}
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bubble font-bold text-sm sm:text-base text-slate-900">
                                {tier.quantity} unidades
                              </span>
                              {tier.badge && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-bubble font-bold bg-amber-400 text-amber-950 shadow-xs">
                                  {tier.badge}
                                </span>
                              )}
                            </div>
                            {tier.giftText && (
                              <p className="text-[11px] font-bold text-fio-pink flex items-center gap-1 font-sans">
                                <Gift className="w-3 h-3 text-fio-pink shrink-0" />
                                <span>{tier.giftText}</span>
                              </p>
                            )}
                          </div>

                          {/* Precio y Botón de Acción Directo */}
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="font-bubble font-bold text-base sm:text-lg text-slate-900">
                              {formatCRC(tier.price)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleWhatsAppOrder(cat.title, tier.quantity, tier.price, tier.giftText)}
                              className="px-3 py-1.5 rounded-xl neu-btn bg-[#F1F2F6] hover:bg-white text-slate-800 border border-white/80 shadow-neuBtn text-xs font-bubble font-bold flex items-center gap-1 active:scale-95 transition-all"
                              title="Pedir este paquete por WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="hidden sm:inline">Pedir</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nota al Pie de la Categoría */}
                  {cat.note && (
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-600 font-sans italic">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                      <span>{cat.note}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          BLOQUE 2: ¿CÓMO REALIZAR EL PEDIDO? PASO A PASO (CON BOTONES TIENDA/CATÁLOGO)
          ========================================================================= */}
      <div className="bg-[#F1F2F6] rounded-[36px] p-4 sm:p-8 lg:p-10 border border-white/90 shadow-neuCard space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-white/90 text-fio-800 text-[11px] font-bubble font-bold tracking-widest uppercase shadow-neuBtn">
            <HelpCircle className="w-3.5 h-3.5 text-fio-pink" />
            <span>Guía de Compra Fácil</span>
          </div>

          <h3 className="font-bubble text-2xl sm:text-4xl text-slate-900 font-bold tracking-tight">
            {pricingData.howToOrderTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 font-sans">
            {pricingData.howToOrderSubtitle}
          </p>
        </div>

        {/* Los 5 Pasos en Cuadrícula Neumórfica */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pricingData.howToOrderSteps.map((step) => (
            <div
              key={step.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#ECEEF2] border border-white/70 shadow-neuInset flex items-start gap-3.5"
            >
              <div className="w-8 h-8 rounded-full bg-white text-fio-800 font-bubble font-bold text-sm shadow-neuBtn flex items-center justify-center shrink-0 border border-white/80">
                {step.stepNumber}
              </div>

              <div className="space-y-1">
                <h4 className="font-bubble font-bold text-sm text-slate-900 leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {step.description}
                </p>
                {step.highlight && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bubble font-bold bg-white text-fio-800 shadow-xs border border-white/70">
                    {step.highlight}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Tarjeta Extra: Garantía y Apoyo */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-100/60 to-pink-100/60 border border-white/70 shadow-neuInset flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-full bg-white text-fio-pink font-bubble font-bold text-sm shadow-neuBtn flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-fio-pink" />
            </div>
            <div>
              <h4 className="font-bubble font-bold text-sm text-slate-900">
                Atención 1 a 1 de Fio
              </h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Cada detalle se revisa personalmente para garantizar que el resultado supere tus expectativas.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTONES OBLIGATORIOS: TIENDA, CATÁLOGO Y WHATSAPP
            ========================================================================= */}
        <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
          {/* Botón Ir a la Tienda */}
          <button
            type="button"
            onClick={() => onNavigate('store')}
            className="w-full sm:w-auto neu-btn-primary flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bubble font-bold text-sm text-white shadow-neuBtn hover:shadow-neuBtnHover active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>Ir a la Tienda</span>
          </button>

          {/* Botón Ver Catálogo Online */}
          <button
            type="button"
            onClick={() => onNavigate('catalogo')}
            className="w-full sm:w-auto neu-btn bg-[#F1F2F6] hover:bg-white text-slate-800 border border-white/90 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bubble font-bold text-sm shadow-neuBtn hover:shadow-neuBtnHover active:scale-95 transition-all"
          >
            <BookOpen className="w-4 h-4 text-fio-800" />
            <span>Ver Catálogo Online</span>
          </button>

          {/* Botón Directo WhatsApp */}
          <a
            href="https://wa.me/50664004640?text=Hola%20Fio!%20Deseo%20hacer%20un%20pedido%20de%20stickers%20o%20personalizados"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto neu-btn-amber flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bubble font-bold text-sm text-white shadow-neuBtn hover:shadow-neuBtnHover active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Pedir por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
