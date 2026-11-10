import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Workshop, WorkshopBenefitItem } from '../../types';
import { formatCRC } from '../../utils/formatters';
import {
  AVAILABLE_BENEFIT_ICONS,
  BenefitIcon,
  getDefaultWorkshopBenefits
} from '../../utils/workshopBenefits';
import {
  X, Plus, Trash2, GraduationCap, Star, Image as ImageIcon,
  Calendar, Clock, MapPin, DollarSign, Users, CheckCircle2, Eye, Link2,
  Heart, Sparkles, Check, Search, ChevronDown, Smile
} from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';

interface WorkshopFormData {
  title: string;
  subtitle: string;
  date: string;
  schedule: string;
  modality: 'Presencial' | 'Virtual en Vivo';
  location: string;
  price: number;
  spotsAvailable: number;
  totalSpots: number;
  includes: string[];
  image: string;
  description: string;
  instructorName: string;
  instructorSubtitle: string;
  benefits: WorkshopBenefitItem[];
}

const EMPTY: WorkshopFormData = {
  title: '',
  subtitle: '',
  date: '',
  schedule: '',
  modality: 'Presencial',
  location: 'Taller Creativo by.fio, 200 sur del parque de Tibás, San José',
  price: 35000,
  spotsAvailable: 10,
  totalSpots: 10,
  includes: [
    'Materiales completos incluidos para cada alumno',
    'Kit de herramientas de uso durante la sesión',
    'Guía y patrones de trabajo paso a paso',
  ],
  image: '',
  description: '',
  instructorName: 'Impartido personalmente por Fio (Fiorella Patricia Jara Gutiérrez)',
  instructorSubtitle: 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.',
  benefits: [
    {
      id: 'ben-coffee',
      icon: 'Coffee',
      text: 'Coffee break artesanal con repostería dulce y bebidas.',
      enabled: true,
    },
    {
      id: 'ben-tools',
      icon: 'ShieldCheck',
      text: 'Uso ilimitado de herramientas de alta precisión durante el taller.',
      enabled: true,
    },
    {
      id: 'ben-project',
      icon: 'Star',
      text: 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
      enabled: true,
    },
  ],
};

const QUICK_INCLUDE_SUGGESTIONS = [
  'Kit de herramientas',
  'Papeles y cartones artesanales',
  'Tazas e insumos de sublimación',
  'Sticker sheets y laminados',
  'Archivos imprimibles 2027',
  'Empaque protector para llevar',
];

const PRESET_BENEFITS = [
  { icon: 'Award', text: 'Certificado oficial de participación by.fio' },
  { icon: 'MessageCircle', text: 'Acceso a grupo VIP de WhatsApp para dudas y seguimiento' },
  { icon: 'Video', text: 'Grabación en video de la sesión con acceso permanente' },
  { icon: 'Folder', text: 'Plantillas y archivos vectoriales editables listos para usar' },
  { icon: 'Gift', text: 'Kit de regalo con muestras sorpresa de materiales' },
  { icon: 'BadgePercent', text: '15% de descuento en tu próxima compra de insumos' },
];

export const NewWorkshopModal: React.FC = () => {
  const {
    isNewWorkshopModalOpen,
    setIsNewWorkshopModalOpen,
    addWorkshop,
    updateWorkshop,
    editingWorkshop,
    setEditingWorkshop,
  } = useApp();

  const [form, setForm] = useState<WorkshopFormData>(EMPTY);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Selector de íconos modal
  const [activeIconPickerBenefitId, setActiveIconPickerBenefitId] = useState<string | null>(null);
  const [iconSearch, setIconSearch] = useState('');
  const [selectedIconCategory, setSelectedIconCategory] = useState<string>('Todos');

  // Sincronizar formulario si estamos en modo edición o creación
  useEffect(() => {
    if (editingWorkshop) {
      setForm({
        title: editingWorkshop.title,
        subtitle: editingWorkshop.subtitle || '',
        date: editingWorkshop.date,
        schedule: editingWorkshop.schedule || '',
        modality: editingWorkshop.modality,
        location: editingWorkshop.location,
        price: editingWorkshop.price,
        spotsAvailable: editingWorkshop.spotsAvailable,
        totalSpots: editingWorkshop.totalSpots,
        includes: editingWorkshop.includes && editingWorkshop.includes.length > 0 ? editingWorkshop.includes : [''],
        image: editingWorkshop.image,
        description: editingWorkshop.description || '',
        instructorName: editingWorkshop.instructorName || 'Impartido personalmente por Fio (Fiorella Patricia Jara Gutiérrez)',
        instructorSubtitle: editingWorkshop.instructorSubtitle || 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.',
        benefits: getDefaultWorkshopBenefits(editingWorkshop),
      });
    } else {
      setForm(EMPTY);
    }
  }, [editingWorkshop, isNewWorkshopModalOpen]);

  if (!isNewWorkshopModalOpen) return null;

  const set = (key: keyof WorkshopFormData, val: any) => setForm((f) => ({ ...f, [key]: val }));

  // Manejo de materiales incluidos
  const handleIncludeChange = (idx: number, val: string) => {
    setForm((f) => {
      const inc = [...f.includes];
      inc[idx] = val;
      return { ...f, includes: inc };
    });
  };

  const addInclude = (customText?: string) => {
    const textToAdd = typeof customText === 'string' ? customText : '';
    setForm((f) => {
      if (textToAdd && f.includes.length === 1 && f.includes[0] === '') {
        return { ...f, includes: [textToAdd] };
      }
      return { ...f, includes: [...f.includes, textToAdd] };
    });
  };

  const removeInclude = (idx: number) =>
    setForm((f) => ({ ...f, includes: f.includes.filter((_, i) => i !== idx) }));

  // Manejo de beneficios destacados
  const handleToggleBenefit = (id: string) => {
    setForm((f) => ({
      ...f,
      benefits: f.benefits.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)),
    }));
  };

  const handleBenefitTextChange = (id: string, text: string) => {
    setForm((f) => ({
      ...f,
      benefits: f.benefits.map((b) => (b.id === id ? { ...b, text } : b)),
    }));
  };

  const handleBenefitIconChange = (id: string, iconName: string) => {
    setForm((f) => ({
      ...f,
      benefits: f.benefits.map((b) => (b.id === id ? { ...b, icon: iconName } : b)),
    }));
    setActiveIconPickerBenefitId(null);
    setIconSearch('');
  };

  const handleAddBenefit = (preset?: { icon: string; text: string }) => {
    const newId = 'ben-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newBenefit: WorkshopBenefitItem = {
      id: newId,
      icon: preset?.icon || 'Sparkles',
      text: preset?.text || '',
      enabled: true,
    };
    setForm((f) => ({
      ...f,
      benefits: [...f.benefits, newBenefit],
    }));
  };

  const handleRemoveBenefit = (id: string) => {
    setForm((f) => ({
      ...f,
      benefits: f.benefits.filter((b) => b.id !== id),
    }));
  };

  // Filtrado de íconos para el selector
  const filteredIcons = useMemo(() => {
    return AVAILABLE_BENEFIT_ICONS.filter((iconDef) => {
      const matchesCategory = selectedIconCategory === 'Todos' || iconDef.category === selectedIconCategory;
      const matchesSearch =
        iconDef.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
        iconDef.label.toLowerCase().includes(iconSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [iconSearch, selectedIconCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) return;

    const imageUrl =
      form.image.trim() ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80';

    const cleanBenefits = form.benefits
      .map((b) => ({ ...b, text: b.text.trim() }))
      .filter((b) => b.text.length > 0);

    const coffeeBen = cleanBenefits.find((b) => b.icon === 'Coffee');
    const toolsBen = cleanBenefits.find((b) => b.icon === 'ShieldCheck');
    const projectBen = cleanBenefits.find((b) => b.icon === 'Star');

    const workshopPayload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      date: form.date.trim(),
      schedule: form.schedule.trim(),
      modality: form.modality,
      location: form.location.trim(),
      price: Number(form.price),
      totalSpots: Number(form.totalSpots),
      spotsAvailable: editingWorkshop
        ? Math.min(Number(form.totalSpots), editingWorkshop.spotsAvailable)
        : Number(form.totalSpots),
      includes: form.includes.map((i) => i.trim()).filter(Boolean),
      image: imageUrl,
      description: form.description.trim(),
      instructorName: form.instructorName.trim(),
      instructorSubtitle: form.instructorSubtitle.trim(),
      benefits: cleanBenefits,
      hasCoffeeBreak: coffeeBen ? coffeeBen.enabled : (form.modality !== 'Virtual en Vivo'),
      coffeeBreakText: coffeeBen ? coffeeBen.text : 'Coffee break artesanal con repostería dulce y bebidas.',
      hasToolsIncluded: toolsBen ? toolsBen.enabled : true,
      toolsText: toolsBen ? toolsBen.text : 'Uso ilimitado de herramientas de alta precisión durante el taller.',
      hasTakeHomeProject: projectBen ? projectBen.enabled : true,
      takeHomeText: projectBen ? projectBen.text : 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
    };

    if (editingWorkshop) {
      updateWorkshop(editingWorkshop.id, workshopPayload);
      setSuccessToast('¡Taller modificado y guardado con éxito!');
    } else {
      const newWs = addWorkshop(workshopPayload);
      const link = `${window.location.origin}/talleres/${newWs.id}`;
      navigator.clipboard.writeText(link).catch(() => {});
      setSuccessToast('¡Taller creado y enlace copiado al portapapeles!');
    }

    setTimeout(() => {
      setSuccessToast(null);
      setEditingWorkshop(null);
      setIsNewWorkshopModalOpen(false);
    }, 1200);
  };

  const handleClose = () => {
    setEditingWorkshop(null);
    setForm(EMPTY);
    setActiveIconPickerBenefitId(null);
    setIsNewWorkshopModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col animate-fadeIn overflow-hidden">
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header Superior Inmersivo a Pantalla Completa */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-fio-200/80 bg-white/95 backdrop-blur-md shrink-0 shadow-xs">
          <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#A855F7] to-[#EC4899] text-white flex items-center justify-center shadow-sm shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bubble font-bold text-base sm:text-xl text-fio-900 leading-tight">
                    {editingWorkshop ? 'Modificar Taller Existente' : 'Crear Nuevo Taller Creativo'}
                  </h2>
                  {editingWorkshop && (
                    <span className="px-2 py-0.5 rounded-full bg-fio-100 text-fio-800 text-[10px] font-mono font-bold">
                      {editingWorkshop.id}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  {editingWorkshop
                    ? 'Actualiza foto, título, descripción de experiencia, materiales o beneficios destacados con íconos personalizados.'
                    : 'Publica un nuevo taller con foto, fechas, experiencia, materiales y beneficios con íconos a elegir.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-2xl bg-[#F5F1EB] hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bubble font-bold text-xs transition-all active:scale-95 cursor-pointer"
              title="Cerrar ventana a pantalla completa"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar</span>
            </button>
          </div>
        </div>

        {/* Notificación de Éxito Flotante */}
        {successToast && (
          <div className="bg-emerald-500 text-white text-xs font-semibold px-4 py-2 text-center animate-in slide-in-from-top duration-200 flex items-center justify-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Formulario a Pantalla Completa con 2 Columnas Editoriales */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* =========================================================
                COLUMNA IZQUIERDA: DATOS CLAVE, FOTO Y LOGÍSTICA
                ========================================================= */}
            <div className="lg:col-span-6 space-y-5">
              {/* Título y Subtítulo */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-fio-800 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-fio-pink fill-fio-pink" />
                  Identidad del Taller
                </span>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Título del Taller <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="Ej: Taller de Encuadernación Artesanal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Subtítulo / Frase Resumen
                  </label>
                  <input
                    value={form.subtitle}
                    onChange={(e) => set('subtitle', e.target.value)}
                    placeholder="Ej: Aprende costura copta y encuadernación japonesa desde cero"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Logística: Fecha, Horario, Modalidad y Ubicación */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-fio-700" />
                  Fecha, Horario y Lugar
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Fecha del Taller <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.date}
                      onChange={(e) => set('date', e.target.value)}
                      placeholder="Ej: Sábado 15 de Noviembre, 2026"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Horario
                    </label>
                    <input
                      value={form.schedule}
                      onChange={(e) => set('schedule', e.target.value)}
                      placeholder="Ej: 9:00 AM — 1:00 PM"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Modalidad
                    </label>
                    <select
                      value={form.modality}
                      onChange={(e) => {
                        const val = e.target.value as 'Presencial' | 'Virtual en Vivo';
                        set('modality', val);
                        if (val === 'Virtual en Vivo') {
                          // Desactivar coffee break en virtual
                          setForm((prev) => ({
                            ...prev,
                            modality: val,
                            benefits: prev.benefits.map((b) =>
                              b.icon === 'Coffee' ? { ...b, enabled: false } : b
                            ),
                          }));
                        } else {
                          set('modality', val);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none bg-white"
                    >
                      <option value="Presencial">Presencial</option>
                      <option value="Virtual en Vivo">Virtual en Vivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Ubicación
                    </label>
                    <input
                      value={form.location}
                      onChange={(e) => set('location', e.target.value)}
                      placeholder="Ej: Taller Creativo by.fio, 200 sur del parque de Tibás, San José"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Inversión y Cupos */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Inversión y Disponibilidad
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Precio por persona (₡ Colones) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={form.price || ''}
                      onChange={(e) => set('price', Number(e.target.value))}
                      placeholder="35000"
                      min={0}
                      step="any"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Vista previa: <strong>{formatCRC(form.price || 0)}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Total de Cupos del Taller
                    </label>
                    <input
                      type="number"
                      value={form.totalSpots}
                      onChange={(e) => set('totalSpots', Number(e.target.value))}
                      min={1}
                      max={100}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Cupos máximos habilitados para este grupo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Foto Principal */}
              <ImageUploadField
                value={form.image}
                onChange={(newUrl) => set('image', newUrl)}
                label="Fotografía Principal del Taller"
                aspectRatio="video"
                defaultPlaceholder="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80"
              />

              {/* Profesor / Acompañamiento Personalizado */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-fio-pink fill-fio-pink" />
                  Sello del Instructor / Acompañamiento
                </span>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nombre o Cargo del Instructor
                  </label>
                  <input
                    value={form.instructorName}
                    onChange={(e) => set('instructorName', e.target.value)}
                    placeholder="Ej: Impartido personalmente por Fio (Fiorella Patricia Jara Gutiérrez)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Frase de Acompañamiento / Dinámica
                  </label>
                  <input
                    value={form.instructorSubtitle}
                    onChange={(e) => set('instructorSubtitle', e.target.value)}
                    placeholder="Ej: Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* =========================================================
                COLUMNA DERECHA: EXPERIENCIA, MATERIALES Y BENEFICIOS
                ========================================================= */}
            <div className="lg:col-span-6 space-y-5">
              {/* ¿De qué trata esta experiencia? */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-fio-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    ¿De qué trata esta experiencia?
                  </span>
                  <span className="text-[10px] text-fio-pink font-semibold bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                    Visible en la web
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Descripción detallada de la experiencia
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    rows={6}
                    placeholder="Describe en qué consiste el taller, las técnicas que se aprenderán paso a paso, el ambiente de la clase y el proyecto con el que cada alumno saldrá terminado... (Puedes separar en varios párrafos)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Todo lo que escribas aquí se mostrará exactamente bajo el título <strong>"¿De qué trata esta experiencia?"</strong> en la página del taller.
                  </p>
                </div>
              </div>

              {/* Materiales y Todo lo que Incluye */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Materiales y Todo lo que Incluye
                  </span>
                  <button
                    type="button"
                    onClick={() => addInclude()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-fio-800 hover:text-fio-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar ítem</span>
                  </button>
                </div>

                {/* Sugerencias Rápidas */}
                <div className="flex flex-wrap gap-1.5 pt-1 pb-1">
                  <span className="text-[10px] text-slate-400 self-center mr-1">Sugerencias:</span>
                  {QUICK_INCLUDE_SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addInclude(sug)}
                      className="text-[10px] bg-slate-100 hover:bg-fio-100 text-slate-600 hover:text-fio-800 px-2 py-0.5 rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                      title="Agregar sugerencia a la lista"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {form.includes.map((inc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-4 text-center text-xs text-slate-400 font-bold">{idx + 1}.</span>
                      <input
                        value={inc}
                        onChange={(e) => handleIncludeChange(idx, e.target.value)}
                        placeholder="Ej: Kit completo de herramientas artesanales"
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                      />
                      {form.includes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInclude(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Eliminar este ítem"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* =========================================================
                  SERVICIOS Y BENEFICIOS DESTACADOS CON CATÁLOGO DE ÍCONOS
                  ========================================================= */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-fio-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-fio-pink" />
                      Servicios &amp; Beneficios Destacados
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Personaliza el texto y el ícono de cada beneficio destacado ({AVAILABLE_BENEFIT_ICONS.length} íconos disponibles).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddBenefit()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-fio-800 hover:text-fio-600 bg-fio-50 hover:bg-fio-100 px-3 py-1.5 rounded-xl border border-fio-200/80 transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Beneficio</span>
                  </button>
                </div>

                {/* Plantillas Rápidas de Beneficios Comunes */}
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                    Plantillas rápidas con ícono integrado:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_BENEFITS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddBenefit(p)}
                        className="text-[10.5px] bg-white hover:bg-purple-100/70 text-slate-700 hover:text-purple-900 px-2 py-1 rounded-lg border border-purple-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Agregar esta plantilla con su ícono"
                      >
                        <BenefitIcon name={p.icon} className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[180px]">{p.text.split(' ')[0]} {p.text.split(' ')[1]} {p.text.split(' ')[2]}...</span>
                        <Plus className="w-2.5 h-2.5 text-purple-600" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lista de Beneficios con Selector de Ícono y Texto */}
                <div className="space-y-2.5">
                  {form.benefits.map((benefit, idx) => {
                    const isIconPickerOpen = activeIconPickerBenefitId === benefit.id;

                    return (
                      <div
                        key={benefit.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          benefit.enabled
                            ? 'bg-slate-50/80 border-slate-200 shadow-xs'
                            : 'bg-slate-100/60 border-slate-200/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Checkbox de Activación */}
                          <input
                            type="checkbox"
                            checked={benefit.enabled}
                            onChange={() => handleToggleBenefit(benefit.id)}
                            className="rounded text-fio-pink focus:ring-fio-pink w-4 h-4 cursor-pointer shrink-0"
                            title={benefit.enabled ? 'Desactivar de la vista' : 'Activar en la vista'}
                          />

                          {/* Botón de Ícono: Muestra el ícono actual y permite cambiarlo */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                if (isIconPickerOpen) {
                                  setActiveIconPickerBenefitId(null);
                                } else {
                                  setActiveIconPickerBenefitId(benefit.id);
                                  setIconSearch('');
                                }
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-fio-50 border border-slate-200 shadow-xs text-xs font-semibold text-slate-700 transition-colors cursor-pointer shrink-0"
                              title="Toca para cambiar el ícono de este beneficio"
                            >
                              <BenefitIcon name={benefit.icon} className="w-4 h-4 shrink-0" />
                              <ChevronDown className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>

                          {/* Campo de Texto */}
                          <input
                            value={benefit.text}
                            onChange={(e) => handleBenefitTextChange(benefit.id, e.target.value)}
                            placeholder="Describe el beneficio (ej: Coffee break con repostería, Grabación en video...)"
                            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none bg-white font-sans"
                          />

                          {/* Botón Eliminar Beneficio */}
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(benefit.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                            title="Eliminar este beneficio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* PANEL DESPLEGABLE: Selector de Íconos para este Beneficio */}
                        {isIconPickerOpen && (
                          <div className="mt-3 p-3.5 rounded-2xl bg-white border border-fio-200 shadow-lg space-y-3 animate-fadeIn">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <span className="text-xs font-bubble font-bold text-slate-800 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-fio-pink" />
                                <span>Elige un ícono ({AVAILABLE_BENEFIT_ICONS.length} disponibles)</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setActiveIconPickerBenefitId(null)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 text-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Buscador de Ícono y Categorías */}
                            <div className="space-y-2">
                              <div className="relative">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  value={iconSearch}
                                  onChange={(e) => setIconSearch(e.target.value)}
                                  placeholder="Buscar ícono (café, certificado, video, regalo...)"
                                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                                />
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {['Todos', 'Experiencia & Servicios', 'Herramientas & Material', 'Digital & Aprendizaje', 'Comunidad & Beneficios'].map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedIconCategory(cat)}
                                    className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                                      selectedIconCategory === cat
                                        ? 'bg-fio-800 text-white border-fio-800 font-bold'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                    }`}
                                  >
                                    {cat === 'Experiencia & Servicios' ? 'Servicios' : cat === 'Herramientas & Material' ? 'Herramientas' : cat === 'Digital & Aprendizaje' ? 'Digital' : cat === 'Comunidad & Beneficios' ? 'Comunidad' : cat}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Rejilla de Íconos Seleccionables */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1 pt-1">
                              {filteredIcons.map((iconDef) => {
                                const isCurrent = benefit.icon === iconDef.name;
                                return (
                                  <button
                                    key={iconDef.name}
                                    type="button"
                                    onClick={() => handleBenefitIconChange(benefit.id, iconDef.name)}
                                    className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                                      isCurrent
                                        ? 'bg-fio-50 border-fio-pink ring-2 ring-fio-pink/30 text-fio-900 font-bold shadow-xs'
                                        : 'bg-slate-50/70 hover:bg-fio-50/60 border-slate-200/80 text-slate-700 hover:border-fio-200'
                                    }`}
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-white shadow-2xs border border-slate-100 flex items-center justify-center shrink-0">
                                      <BenefitIcon name={iconDef.name} className="w-4 h-4" />
                                    </div>
                                    <span className="text-[11px] leading-tight truncate">{iconDef.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guía Rápida */}
              <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-fio-200/60 text-xs text-slate-600 space-y-1.5">
                <p className="font-bold text-fio-900 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-fio-pink fill-fio-pink" />
                  Consejo para tus talleres by.fio
                </p>
                <p className="text-[11px] leading-relaxed">
                  Cada taller genera automáticamente una página propia e independiente con su enlace para compartir en Instagram, TikTok o WhatsApp. Al guardar, los alumnos podrán inscribirse directamente con SINPE Móvil al 6400-4640.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Sticky de Acciones a Pantalla Completa */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-4 border-t border-slate-200 shrink-0">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-fio-800 to-fio-pink hover:from-fio-900 hover:to-pink-600 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn hover:shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingWorkshop ? 'Guardar Cambios del Taller' : 'Crear Taller y Copiar Enlace'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
