import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Workshop } from '../../types';
import { formatCRC } from '../../utils/formatters';
import {
  X, Plus, Trash2, GraduationCap, Sparkles, Image as ImageIcon,
  Calendar, Clock, MapPin, DollarSign, Users, CheckCircle2, Eye, Link2
} from 'lucide-react';

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
}

const EMPTY: WorkshopFormData = {
  title: '',
  subtitle: '',
  date: '',
  schedule: '',
  modality: 'Presencial',
  location: 'Taller Creativo by.fio, San José, CR',
  price: 35000,
  spotsAvailable: 10,
  totalSpots: 10,
  includes: ['Materiales completos incluidos', 'Herramientas de uso en clase', 'Coffee break dulce artesanal'],
  image: '',
  description: '',
};

export const NewWorkshopModal: React.FC = () => {
  const {
    isNewWorkshopModalOpen,
    setIsNewWorkshopModalOpen,
    addWorkshop,
    updateWorkshop,
    editingWorkshop,
    setEditingWorkshop,
  } = useApp();

  const [form, setForm] = useState(EMPTY);
  const [successToast, setSuccessToast] = useState<string | null>(null);

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
        includes: editingWorkshop.includes.length > 0 ? editingWorkshop.includes : [''],
        image: editingWorkshop.image,
        description: editingWorkshop.description || '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [editingWorkshop, isNewWorkshopModalOpen]);

  if (!isNewWorkshopModalOpen) return null;

  const set = (key: string, val: string | number) => setForm((f) => ({ ...f, [key]: val }));

  const handleIncludeChange = (idx: number, val: string) => {
    setForm((f) => {
      const inc = [...f.includes];
      inc[idx] = val;
      return { ...f, includes: inc };
    });
  };

  const addInclude = () => setForm((f) => ({ ...f, includes: [...f.includes, ''] }));
  const removeInclude = (idx: number) =>
    setForm((f) => ({ ...f, includes: f.includes.filter((_, i) => i !== idx) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) return;

    const imageUrl =
      form.image.trim() ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80';

    if (editingWorkshop) {
      // Modo Edición / Modificación de Taller Existente
      updateWorkshop(editingWorkshop.id, {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        date: form.date.trim(),
        schedule: form.schedule.trim(),
        modality: form.modality,
        location: form.location.trim(),
        price: Number(form.price),
        totalSpots: Number(form.totalSpots),
        spotsAvailable: Math.min(Number(form.totalSpots), editingWorkshop.spotsAvailable),
        includes: form.includes.map((i) => i.trim()).filter(Boolean),
        image: imageUrl,
        description: form.description.trim(),
      });
      setSuccessToast('¡Taller modificado y guardado con éxito!');
    } else {
      // Modo Creación de Nuevo Taller
      const newWs = addWorkshop({
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        date: form.date.trim(),
        schedule: form.schedule.trim(),
        modality: form.modality,
        location: form.location.trim(),
        price: Number(form.price),
        totalSpots: Number(form.totalSpots),
        spotsAvailable: Number(form.totalSpots),
        includes: form.includes.map((i) => i.trim()).filter(Boolean),
        image: imageUrl,
        description: form.description.trim(),
      });

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

  const previewImage =
    form.image.trim() ||
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80';

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
                    ? 'Actualiza foto, título, descripción, cupos o precio. Los cambios se guardarán de inmediato.'
                    : 'Publica un nuevo taller con foto, fechas, temario y materiales incluidos.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-2xl bg-[#F5F1EB] hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bubble font-bold text-xs transition-all active:scale-95"
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
            <div className="lg:col-span-7 space-y-5">
              {/* Título y Subtítulo */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-fio-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-fio-pink" />
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
                    Subtítulo / Frase Corta
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
                      onChange={(e) => set('modality', e.target.value)}
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
                      placeholder="Ej: Taller Creativo by.fio, San José, CR"
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

              {/* Foto / Imagen con Preview en Vivo */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-fio-pink" />
                  Fotografía Principal del Taller
                </span>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    URL de la Foto (Unsplash, Cloudflare, etc.)
                  </label>
                  <input
                    value={form.image}
                    onChange={(e) => set('image', e.target.value)}
                    placeholder="https://images.unsplash.com/... (o dejar vacío para foto artesanal por defecto)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none"
                  />
                </div>

                {/* Preview de la imagen */}
                <div className="relative h-40 sm:h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={previewImage}
                    alt="Vista previa del taller"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] backdrop-blur-xs font-semibold">
                    Vista previa de imagen
                  </span>
                </div>
              </div>
            </div>

            {/* =========================================================
                COLUMNA DERECHA: DESCRIPCIÓN Y MATERIALES INCLUIDOS
                ========================================================= */}
            <div className="lg:col-span-5 space-y-5">
              {/* Descripción Extensa */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Descripción &amp; Experiencia del Alumno
                </span>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ¿De qué trata este taller?
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    rows={6}
                    placeholder="Describe las técnicas que aprenderán, el proyecto con el que saldrán terminado, a quién va dirigido y por qué es una experiencia única..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Esta descripción se mostrará de forma destacada en la página individual del taller.
                  </p>
                </div>
              </div>

              {/* Lista Dinámica de ¿Qué Incluye? */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Materiales y Todo lo que Incluye
                  </span>
                  <button
                    type="button"
                    onClick={addInclude}
                    className="inline-flex items-center gap-1 text-xs font-bold text-fio-800 hover:text-fio-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar ítem</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
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
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                          title="Eliminar este ítem"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Guía Rápida */}
              <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-fio-200/60 text-xs text-slate-600 space-y-1.5">
                <p className="font-bold text-fio-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-fio-pink" />
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
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-fio-800 to-fio-pink hover:from-fio-900 hover:to-pink-600 text-white font-bubble font-bold text-xs sm:text-sm shadow-clayBtn hover:shadow-lg active:scale-98 transition-all"
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
