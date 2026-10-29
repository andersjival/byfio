import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2 } from 'lucide-react';

const EMPTY = {
  title: '',
  subtitle: '',
  date: '',
  schedule: '',
  modality: 'Presencial' as const,
  location: 'Taller Creativo by.fio, San José, CR',
  price: 0,
  spotsAvailable: 10,
  totalSpots: 10,
  includes: [''],
  image: '',
  description: '',
};

export const NewWorkshopModal: React.FC = () => {
  const { isNewWorkshopModalOpen, setIsNewWorkshopModalOpen, addWorkshop } = useApp();
  const [form, setForm] = useState(EMPTY);

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
    if (!form.title || !form.price) return;

    const imageUrl =
      form.image ||
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80';

    const ws = addWorkshop({
      ...form,
      image: imageUrl,
      includes: form.includes.filter((i) => i.trim()),
      spotsAvailable: form.totalSpots,
    });

    // Copy shareable link to specific workshop
    const link = `${window.location.origin}/talleres/${ws.id}`;
    navigator.clipboard.writeText(link).catch(() => {});

    setForm(EMPTY);
    setIsNewWorkshopModalOpen(false);
  };

  const close = () => {
    setForm(EMPTY);
    setIsNewWorkshopModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bubble font-bold text-lg text-fio-900">Crear Nuevo Taller</h2>
          <button type="button" onClick={close} className="p-1 rounded-full hover:bg-fio-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Nombre */}
        <div>
          <label className="text-xs font-semibold text-gray-600">Nombre del taller *</label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Ej: Taller de Encuadernación"
            className="w-full mt-1 px-3 py-2 rounded-xl border border-fio-200 text-sm focus:ring-2 focus:ring-fio-300 outline-none"
            required
          />
        </div>

        {/* Subtítulo */}
        <div>
          <label className="text-xs font-semibold text-gray-600">Subtítulo / Tagline</label>
          <input
            value={form.subtitle}
            onChange={(e) => set('subtitle', e.target.value)}
            placeholder="Ej: Aprende costura copta desde cero"
            className="w-full mt-1 px-3 py-2 rounded-xl border border-fio-200 text-sm focus:ring-2 focus:ring-fio-300 outline-none"
          />
        </div>

        {/* Fecha y Horario */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600">Fecha *</label>
            <input
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              placeholder="Ej: Sábado 15 Nov, 2026"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-fio-200 text-sm focus:ring-2 focus:ring-fio-300 outline-none"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Horario</label>
            <input
              value={form.schedule}
              onChange={(e) => set('schedule', e.target.value)}
              placeholder="Ej: 9:00 AM — 1:00 PM"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-fio-200 text-sm focus:ring-2 focus:ring-fio-300 outline-none"
            />
          </div>
        </div>

        {/* Modalidad y Ubicación */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600">Modalidad</label>
            <select
              value={form.modality}
              onChange={(e) => set('modality', e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-fio-200 text-sm focus:ring-2 focus:ring-fio-300 outline-none"
            >
              <option value="Presencial">Presencial</option>
              <option value="Virtual en Vivo">Virtual en Vivo</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Ubicación</label>
            <input
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-fio-200 text-sm focus:ring-2 focus:ring-fio-300 outline-none"
            />
          </div>
        </div>

        {/* Precio y Cupos */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600">Precio (₡) *</label>
            <input
              type="number"
              value={form.price || ''}
              onChange={(e) => set('price', Number(e.target.value))}
              placeholder="35000"
              min={0}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-fio-200 text-sm focus:ring-2 focus:ring-fio-300 outline-none"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Total de Cupos</label>
            <input
              type="number"
              value={form.totalSpots}
              onChange={(e) => set('totalSpots', Number(e.target.value))}
              min={1}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-fio-200 text-sm focus:ring-2 focus:ring-fio-300 outline-none"
            />
          </div>
        </div>

        {/* URL de imagen */}
        <div>
          <label className="text-xs font-semibold text-gray-600">URL de Imagen / Foto</label>
          <input
            value={form.image}
            onChange={(e) => set('image', e.target.value)}
            placeholder="https://… (dejar vacío usa imagen por defecto)"
            className="w-full mt-1 px-3 py-2 rounded-xl border border-fio-200 text-sm focus:ring-2 focus:ring-fio-300 outline-none"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="text-xs font-semibold text-gray-600">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={2}
            placeholder="Descripción corta del taller…"
            className="w-full mt-1 px-3 py-2 rounded-xl border border-fio-200 text-sm focus:ring-2 focus:ring-fio-300 outline-none resize-none"
          />
        </div>

        {/* Qué incluye */}
        <div>
          <label className="text-xs font-semibold text-gray-600">¿Qué incluye?</label>
          <div className="space-y-2 mt-1">
            {form.includes.map((inc, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={inc}
                  onChange={(e) => handleIncludeChange(idx, e.target.value)}
                  placeholder={`Ej: Kit de materiales`}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-fio-200 text-sm focus:ring-2 focus:ring-fio-300 outline-none"
                />
                {form.includes.length > 1 && (
                  <button type="button" onClick={() => removeInclude(idx)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addInclude}
              className="text-xs text-fio-600 font-semibold flex items-center gap-1 hover:text-fio-800"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar ítem
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-fio-800 hover:bg-fio-900 text-white font-bubble font-bold text-sm shadow-clayBtn active:scale-[0.97] transition-all"
        >
          Crear Taller y Copiar Link 🔗
        </button>
      </form>
    </div>
  );
};
