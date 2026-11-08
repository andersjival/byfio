import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Workshop } from '../../types';
import { formatCRC } from '../../utils/formatters';
import {
  X, Plus, Trash2, GraduationCap, Star, Image as ImageIcon,
  Calendar, Clock, MapPin, DollarSign, Users, CheckCircle2, Eye, Link2,
  Coffee, ShieldCheck, Heart, Sparkles, Check
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
  hasCoffeeBreak: boolean;
  coffeeBreakText: string;
  hasToolsIncluded: boolean;
  toolsText: string;
  hasTakeHomeProject: boolean;
  takeHomeText: string;
  instructorName: string;
  instructorSubtitle: string;
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
  hasCoffeeBreak: true,
  coffeeBreakText: 'Coffee break artesanal con repostería dulce y bebidas.',
  hasToolsIncluded: true,
  toolsText: 'Uso ilimitado de herramientas de alta precisión durante el taller.',
  hasTakeHomeProject: true,
  takeHomeText: 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
  instructorName: 'Impartido personalmente por Fio (Fiorella Patricia Jara Gutiérrez)',
  instructorSubtitle: 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.',
};

const QUICK_INCLUDE_SUGGESTIONS = [
  'Kit de herramientas',
  'Papeles y cartones artesanales',
  'Tazas e insumos de sublimación',
  'Sticker sheets y laminados',
  'Archivos imprimibles 2027',
  'Empaque protector para llevar',
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

  // Sincronizar formulario si estamos en modo edición o creación
  useEffect(() => {
    if (editingWorkshop) {
      const isVirtual = editingWorkshop.modality === 'Virtual en Vivo';
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
        includes: editingWorkshop.includes.length > 0 ? editingWorkshop.includes : [''],
        image: editingWorkshop.image,
        description: editingWorkshop.description || '',
        hasCoffeeBreak: editingWorkshop.hasCoffeeBreak !== undefined ? editingWorkshop.hasCoffeeBreak : !isVirtual,
        coffeeBreakText: editingWorkshop.coffeeBreakText || 'Coffee break artesanal con repostería dulce y bebidas.',
        hasToolsIncluded: editingWorkshop.hasToolsIncluded !== undefined ? editingWorkshop.hasToolsIncluded : true,
        toolsText: editingWorkshop.toolsText || 'Uso ilimitado de herramientas de alta precisión durante el taller.',
        hasTakeHomeProject: editingWorkshop.hasTakeHomeProject !== undefined ? editingWorkshop.hasTakeHomeProject : true,
        takeHomeText: editingWorkshop.takeHomeText || 'Te llevás tu proyecto completo y terminado a casa el mismo día.',
        instructorName: editingWorkshop.instructorName || 'Impartido personalmente por Fio (Fiorella Patricia Jara Gutiérrez)',
        instructorSubtitle: editingWorkshop.instructorSubtitle || 'Cupos estrictamente reducidos para garantizar atención personalizada y corrección técnica individual.',
      });
    } else {
      setForm(EMPTY);
    }
  }, [editingWorkshop, isNewWorkshopModalOpen]);

  if (!isNewWorkshopModalOpen) return null;

  const set = (key: keyof WorkshopFormData, val: any) => setForm((f) => ({ ...f, [key]: val }));

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
      // Si el último está vacío y se pasa un texto, rellenarlo
      if (textToAdd && f.includes.length === 1 && f.includes[0] === '') {
        return { ...f, includes: [textToAdd] };
      }
      return { ...f, includes: [...f.includes, textToAdd] };
    });
  };

  const removeInclude = (idx: number) =>
    setForm((f) => ({ ...f, includes: f.includes.filter((_, i) => i !== idx) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) return;

    const imageUrl =
      form.image.trim() ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80';

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
      hasCoffeeBreak: form.hasCoffeeBreak,
      coffeeBreakText: form.coffeeBreakText.trim(),
      hasToolsIncluded: form.hasToolsIncluded,
      toolsText: form.toolsText.trim(),
      hasTakeHomeProject: form.hasTakeHomeProject,
      takeHomeText: form.takeHomeText.trim(),
      instructorName: form.instructorName.trim(),
      instructorSubtitle: form.instructorSubtitle.trim(),
    };

    if (editingWorkshop) {
      // Modo Edición / Modificación de Taller Existente
      updateWorkshop(editingWorkshop.id, workshopPayload);
      setSuccessToast('¡Taller modificado y guardado con éxito!');
    } else {
      // Modo Creación de Nuevo Taller
      const newWs = addWorkshop(workshopPayload);

      // Copiar enlace al portapapeles
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
                    ? 'Actualiza foto, título, descripción de la experiencia, materiales o beneficios. Los cambios se sincronizan en vivo.'
                    : 'Publica un nuevo taller con foto, fechas, experiencia, materiales y beneficios incluidos.'}
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
                        if (val === 'Virtual en Vivo' && form.hasCoffeeBreak) {
                          set('hasCoffeeBreak', false);
                        } else if (val === 'Presencial' && !form.hasCoffeeBreak) {
                          set('hasCoffeeBreak', true);
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
                    rows={7}
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

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
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

              {/* Beneficios Adicionales: Coffee Break, Herramientas y Proyecto Terminado */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Servicios &amp; Beneficios Destacados
                </span>

                {/* 1. Coffee Break */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.hasCoffeeBreak}
                        onChange={(e) => set('hasCoffeeBreak', e.target.checked)}
                        className="rounded text-fio-pink focus:ring-fio-pink w-4 h-4 cursor-pointer"
                      />
                      <Coffee className="w-4 h-4 text-amber-500" />
                      <span>Incluir Coffee Break</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {form.hasCoffeeBreak ? 'Activado' : 'Desactivado'}
                    </span>
                  </div>
                  {form.hasCoffeeBreak && (
                    <input
                      value={form.coffeeBreakText}
                      onChange={(e) => set('coffeeBreakText', e.target.value)}
                      placeholder="Ej: Coffee break artesanal con repostería dulce y bebidas."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none bg-white"
                    />
                  )}
                </div>

                {/* 2. Herramientas en Clase */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.hasToolsIncluded}
                        onChange={(e) => set('hasToolsIncluded', e.target.checked)}
                        className="rounded text-fio-pink focus:ring-fio-pink w-4 h-4 cursor-pointer"
                      />
                      <ShieldCheck className="w-4 h-4 text-fio-600" />
                      <span>Uso de Herramientas de Precisión en Clase</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {form.hasToolsIncluded ? 'Activado' : 'Desactivado'}
                    </span>
                  </div>
                  {form.hasToolsIncluded && (
                    <input
                      value={form.toolsText}
                      onChange={(e) => set('toolsText', e.target.value)}
                      placeholder="Ej: Uso ilimitado de herramientas de alta precisión durante el taller."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none bg-white"
                    />
                  )}
                </div>

                {/* 3. Proyecto Terminado para Llevar */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.hasTakeHomeProject}
                        onChange={(e) => set('hasTakeHomeProject', e.target.checked)}
                        className="rounded text-fio-pink focus:ring-fio-pink w-4 h-4 cursor-pointer"
                      />
                      <Star className="w-4 h-4 text-fio-pink fill-fio-pink" />
                      <span>Proyecto Terminado para Llevar</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {form.hasTakeHomeProject ? 'Activado' : 'Desactivado'}
                    </span>
                  </div>
                  {form.hasTakeHomeProject && (
                    <input
                      value={form.takeHomeText}
                      onChange={(e) => set('takeHomeText', e.target.value)}
                      placeholder="Ej: Te llevás tu proyecto completo y terminado a casa el mismo día."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none bg-white"
                    />
                  )}
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
