import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PricingSectionData, StickerPriceCategory, StickerPriceTier, HowToOrderStep } from '../../types';
import {
  X, Save, RotateCcw, Plus, Trash2, Tag, HelpCircle,
  CheckCircle2, Sparkles, Gift, Edit3, ArrowUp, ArrowDown
} from 'lucide-react';

export const AdminPricingModal: React.FC = () => {
  const { isPricingModalOpen, setIsPricingModalOpen, pricingData, updatePricingData, resetPricingData } = useApp();

  const [formData, setFormData] = useState<PricingSectionData>(() => JSON.parse(JSON.stringify(pricingData)));
  const [activeTab, setActiveTab] = useState<'categories' | 'steps' | 'general'>('categories');
  const [saveToast, setSaveToast] = useState(false);

  // Sync state if modal opens
  React.useEffect(() => {
    if (isPricingModalOpen) {
      setFormData(JSON.parse(JSON.stringify(pricingData)));
    }
  }, [isPricingModalOpen, pricingData]);

  if (!isPricingModalOpen) return null;

  const handleSave = () => {
    updatePricingData(formData);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      setIsPricingModalOpen(false);
    }, 900);
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas restablecer todos los precios y pasos a los valores de diseño originales?')) {
      resetPricingData();
      setIsPricingModalOpen(false);
    }
  };

  // Category Helpers
  const handleUpdateCategory = (catIndex: number, field: keyof StickerPriceCategory, value: any) => {
    setFormData((prev) => {
      const copy = { ...prev };
      copy.categories[catIndex] = { ...copy.categories[catIndex], [field]: value };
      return copy;
    });
  };

  const handleAddCategory = () => {
    const newCat: StickerPriceCategory = {
      id: `cat-${Date.now()}`,
      title: 'NUEVO TAMAÑO DE STICKERS',
      subtitle: 'Descripción del nuevo formato',
      note: 'Nota especial o regalías',
      tiers: [
        { id: `t-${Date.now()}-1`, quantity: 20, price: 1500, giftText: '5 regalías' },
        { id: `t-${Date.now()}-2`, quantity: 100, price: 6000, badge: 'Popular' },
      ],
    };
    setFormData((prev) => ({ ...prev, categories: [...prev.categories, newCat] }));
  };

  const handleDeleteCategory = (catIndex: number) => {
    if (window.confirm('¿Seguro que deseas eliminar esta categoría de precios?')) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((_, idx) => idx !== catIndex),
      }));
    }
  };

  // Tier Helpers
  const handleUpdateTier = (catIndex: number, tierIndex: number, field: keyof StickerPriceTier, value: any) => {
    setFormData((prev) => {
      const copy = { ...prev };
      const currentTier = { ...copy.categories[catIndex].tiers[tierIndex], [field]: value };
      copy.categories[catIndex].tiers[tierIndex] = currentTier;
      return copy;
    });
  };

  const handleAddTier = (catIndex: number) => {
    const newTier: StickerPriceTier = {
      id: `tier-${Date.now()}`,
      quantity: 50,
      price: 3500,
      giftText: '10 regalías',
    };
    setFormData((prev) => {
      const copy = { ...prev };
      copy.categories[catIndex].tiers.push(newTier);
      return copy;
    });
  };

  const handleDeleteTier = (catIndex: number, tierIndex: number) => {
    setFormData((prev) => {
      const copy = { ...prev };
      copy.categories[catIndex].tiers = copy.categories[catIndex].tiers.filter((_, idx) => idx !== tierIndex);
      return copy;
    });
  };

  // Steps Helpers
  const handleUpdateStep = (stepIndex: number, field: keyof HowToOrderStep, value: any) => {
    setFormData((prev) => {
      const copy = { ...prev };
      copy.howToOrderSteps[stepIndex] = { ...copy.howToOrderSteps[stepIndex], [field]: value };
      return copy;
    });
  };

  const handleAddStep = () => {
    const newStep: HowToOrderStep = {
      id: `step-${Date.now()}`,
      stepNumber: formData.howToOrderSteps.length + 1,
      title: 'Nuevo Paso',
      description: 'Describe este nuevo paso del pedido...',
    };
    setFormData((prev) => ({ ...prev, howToOrderSteps: [...prev.howToOrderSteps, newStep] }));
  };

  const handleDeleteStep = (stepIndex: number) => {
    setFormData((prev) => {
      const filtered = prev.howToOrderSteps.filter((_, idx) => idx !== stepIndex);
      // Re-index steps
      const reindexed = filtered.map((st, i) => ({ ...st, stepNumber: i + 1 }));
      return { ...prev, howToOrderSteps: reindexed };
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Cabecera Fija del Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#F1F2F6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white shadow-neuBtn flex items-center justify-center text-amber-500">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bubble font-bold text-sm sm:text-base text-slate-900 leading-tight">
                Editor de Precios de Stickers &amp; Pasos de Pedido
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                Modifica precios, cantidades, bonificaciones de regalías y textos que se ven en la web
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 font-bubble text-xs font-bold border border-slate-200 shadow-neuBtn flex items-center gap-1 active:scale-95 transition-all"
              title="Restablecer a valores de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPricingModalOpen(false)}
              className="w-8 h-8 neu-btn-circle text-slate-500 hover:text-slate-800 transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de Sub-Pestañas */}
        <div className="px-5 pt-3 border-b border-slate-200 bg-white flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bubble font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'border-fio-800 text-fio-800 bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Categorías &amp; Paquetes de Precios ({formData.categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bubble font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'steps'
                ? 'border-fio-800 text-fio-800 bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pasos: "¿Cómo Realizar el Pedido?" ({formData.howToOrderSteps.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bubble font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'general'
                ? 'border-fio-800 text-fio-800 bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Títulos de la Sección</span>
          </button>
        </div>

        {/* Cuerpo del Formulario con Scroll */}
        <div className="p-4 sm:p-6 bg-slate-50/50 flex-1 overflow-y-auto space-y-6">
          {/* =========================================================================
              PESTAÑA 1: CATEGORÍAS & PAQUETES DE PRECIOS
              ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bubble font-bold text-sm text-slate-800">
                    Grupos de Medidas y Precios de Stickers
                  </h4>
                  <p className="text-xs text-slate-500 font-sans">
                    Edita precios, cantidades, regalitos o agrega nuevos tamaños
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3.5 py-1.5 rounded-xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Categoría</span>
                </button>
              </div>

              {formData.categories.map((cat, catIdx) => (
                <div
                  key={cat.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4"
                >
                  {/* Cabecera de Categoría */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Título de la Categoría
                        </label>
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => handleUpdateCategory(catIdx, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bubble font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Subtítulo o Detalles
                        </label>
                        <input
                          type="text"
                          value={cat.subtitle || ''}
                          onChange={(e) => handleUpdateCategory(catIdx, 'subtitle', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(catIdx)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors self-end sm:self-center"
                      title="Eliminar esta categoría"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Niveles / Tiers de Precios */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Paquetes de Unidades y Precios
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddTier(catIdx)}
                        className="text-xs text-fio-800 hover:text-fio-900 font-bubble font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir renglón</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {cat.tiers.map((tier, tierIdx) => (
                        <div
                          key={tier.id}
                          className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        >
                          {/* Cantidad */}
                          <div className="col-span-3 sm:col-span-2">
                            <label className="text-[9px] uppercase font-bold text-slate-400 block">Cant.</label>
                            <input
                              type="number"
                              value={tier.quantity}
                              onChange={(e) => handleUpdateTier(catIdx, tierIdx, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 font-mono font-bold text-slate-800 text-xs"
                            />
                          </div>

                          {/* Precio en Colones */}
                          <div className="col-span-4 sm:col-span-3">
                            <label className="text-[9px] uppercase font-bold text-slate-400 block">Precio (₡)</label>
                            <input
                              type="number"
                              value={tier.price}
                              onChange={(e) => handleUpdateTier(catIdx, tierIdx, 'price', parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 font-mono font-bold text-slate-800 text-xs"
                            />
                          </div>

                          {/* Regalías */}
                          <div className="col-span-5 sm:col-span-4">
                            <label className="text-[9px] uppercase font-bold text-slate-400 block">Regalías</label>
                            <input
                              type="text"
                              placeholder="Ej: 4-5 regalías (3x3)"
                              value={tier.giftText || ''}
                              onChange={(e) => handleUpdateTier(catIdx, tierIdx, 'giftText', e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 text-slate-800 text-xs"
                            />
                          </div>

                          {/* Badge / Etiqueta */}
                          <div className="col-span-10 sm:col-span-2">
                            <label className="text-[9px] uppercase font-bold text-slate-400 block">Etiqueta</label>
                            <input
                              type="text"
                              placeholder="Popular"
                              value={tier.badge || ''}
                              onChange={(e) => handleUpdateTier(catIdx, tierIdx, 'badge', e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 text-slate-800 text-xs"
                            />
                          </div>

                          {/* Eliminar Tier */}
                          <div className="col-span-2 sm:col-span-1 text-right pt-3 sm:pt-0">
                            <button
                              type="button"
                              onClick={() => handleDeleteTier(catIdx, tierIdx)}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                              title="Quitar este precio"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nota al Pie de Categoría */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Nota o Aclaración al Pie (ej: "Las regalías son de tamaño 3x3")
                    </label>
                    <input
                      type="text"
                      value={cat.note || ''}
                      onChange={(e) => handleUpdateCategory(catIdx, 'note', e.target.value)}
                      placeholder="Ej: Pregunta por nuestros servicios de diseño"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =========================================================================
              PESTAÑA 2: PASOS "¿CÓMO REALIZAR EL PEDIDO?"
              ========================================================================= */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bubble font-bold text-sm text-slate-800">
                    Pasos de la Sección "¿Cómo Realizar el Pedido?"
                  </h4>
                  <p className="text-xs text-slate-500 font-sans">
                    Personaliza cada instrucción que ve el cliente antes de pedir
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-3.5 py-1.5 rounded-xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-xs shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Paso</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.howToOrderSteps.map((step, stepIdx) => (
                  <div
                    key={step.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-fio-100 text-fio-800 font-bubble font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                      {step.stepNumber}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            Título del Paso
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => handleUpdateStep(stepIdx, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bubble font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            Píldora Destacada (opcional)
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: WhatsApp 6400-4640"
                            value={step.highlight || ''}
                            onChange={(e) => handleUpdateStep(stepIdx, 'highlight', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Descripción Detallada
                        </label>
                        <textarea
                          rows={2}
                          value={step.description}
                          onChange={(e) => handleUpdateStep(stepIdx, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteStep(stepIdx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      title="Eliminar este paso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              PESTAÑA 3: TÍTULOS GENERALES DE LA SECCIÓN
              ========================================================================= */}
          {activeTab === 'general' && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-bubble font-bold text-sm text-slate-800">
                Títulos y Encabezados Globales
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Título Principal de la Sección de Precios
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Subtítulo de la Sección de Precios
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Título de la Sección "¿Cómo Realizar el Pedido?"
                  </label>
                  <input
                    type="text"
                    value={formData.howToOrderTitle}
                    onChange={(e) => setFormData({ ...formData, howToOrderTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Subtítulo de la Sección "¿Cómo Realizar el Pedido?"
                  </label>
                  <input
                    type="text"
                    value={formData.howToOrderSubtitle}
                    onChange={(e) => setFormData({ ...formData, howToOrderSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-fio-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barra Inferior de Acciones */}
        <div className="p-4 border-t border-slate-200 bg-[#F1F2F6] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-sans hidden sm:inline">
            Todos los cambios se aplican en vivo en la tienda y catálogo.
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setIsPricingModalOpen(false)}
              className="px-4 py-2 rounded-xl neu-btn text-slate-700 font-bubble text-xs font-bold active:scale-95 transition-all"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl neu-btn-primary text-white font-bubble text-xs font-bold shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              {saveToast ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Precios</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
