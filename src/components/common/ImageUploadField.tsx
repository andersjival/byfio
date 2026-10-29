import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image as ImageIcon, Link2, Clipboard, Trash2, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  defaultPlaceholder?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
  compact?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'Fotografía',
  defaultPlaceholder = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
  aspectRatio = 'video',
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImage = value.trim() || defaultPlaceholder;

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Optimización y compresión client-side de imágenes (Canvas)
  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      showFeedback('Por favor selecciona un archivo de imagen válido', 'error');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();

      img.onload = () => {
        const MAX_DIM = 1200;
        let { width, height } = img;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressed);
          showFeedback('¡Foto cargada y optimizada con éxito!');
        } else {
          onChange(dataUrl);
          showFeedback('¡Foto cargada con éxito!');
        }
        setIsProcessing(false);
      };

      img.onerror = () => {
        setIsProcessing(false);
        showFeedback('No se pudo procesar la imagen', 'error');
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      setIsProcessing(false);
      showFeedback('Error al leer el archivo', 'error');
    };

    reader.readAsDataURL(file);
  }, [onChange]);

  // Manejo de Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  // Manejo de pegado (Ctrl+V) sobre el contenedor
  const handlePaste = useCallback((e: React.ClipboardEvent | ClipboardEvent) => {
    const clipboardData = (e as React.ClipboardEvent).clipboardData || (e as ClipboardEvent).clipboardData;
    if (!clipboardData) return;

    // 1. Revisar si hay un archivo de imagen en el portapapeles
    const items = clipboardData.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file);
            return;
          }
        }
      }
    }

    // 2. Revisar si hay texto con URL de imagen
    const pastedText = clipboardData.getData('text');
    if (pastedText && (pastedText.startsWith('http://') || pastedText.startsWith('https://') || pastedText.startsWith('data:image/'))) {
      onChange(pastedText.trim());
      showFeedback('¡URL de imagen aplicada!');
    }
  }, [onChange, processImageFile]);

  // Pegar foto desde portapapeles con botón interactivo
  const handlePasteFromClipboardBtn = async () => {
    try {
      if (navigator.clipboard?.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find((t) => t.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const file = new File([blob], 'foto-pegada.jpg', { type: imageType });
            processImageFile(file);
            return;
          }
        }
      }

      // Si no hay imagen en formato binario, leer texto
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        onChange(text.trim());
        showFeedback('¡URL pegada desde el portapapeles!');
      } else {
        showFeedback('No se detectó ninguna imagen ni URL en tu portapapeles', 'error');
      }
    } catch {
      showFeedback('Presiona Ctrl+V para pegar la imagen directamente', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
    // Reset para permitir volver a cargar el mismo archivo si se desea
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const heightClass = compact
    ? 'h-32 sm:h-36'
    : aspectRatio === 'video'
    ? 'h-44 sm:h-52'
    : aspectRatio === 'square'
    ? 'h-48 sm:h-56'
    : 'h-40 sm:h-48';

  return (
    <div
      onPaste={handlePaste}
      className={`rounded-2xl transition-all ${
        compact ? 'p-3 bg-fio-50/70 border border-fio-200/80 space-y-2.5' : 'p-4 sm:p-5 bg-white border border-slate-200/80 shadow-xs space-y-3'
      }`}
    >
      {/* Encabezado del Campo */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-fio-pink" />
          {label}
        </span>
        {value.trim() && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              showFeedback('Foto restablecida');
            }}
            className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
            title="Quitar foto"
          >
            <Trash2 className="w-3 h-3" />
            Quitar
          </button>
        )}
      </div>

      {/* Zona Drag & Drop / Preview Visual */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative ${heightClass} rounded-2xl overflow-hidden border-2 cursor-pointer transition-all flex items-center justify-center group ${
          isDragging
            ? 'border-fio-500 bg-fio-100/80 scale-[1.01] shadow-lg ring-4 ring-fio-200'
            : 'border-slate-200 hover:border-fio-300 bg-slate-50'
        }`}
      >
        <img
          src={displayImage}
          alt={label}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isDragging ? 'opacity-40 blur-xs scale-105' : 'group-hover:scale-102'
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultPlaceholder;
          }}
        />

        {/* Overlay al arrastrar sobre la caja */}
        {isDragging ? (
          <div className="absolute inset-0 bg-fio-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center animate-in zoom-in-95">
            <Upload className="w-8 h-8 mb-2 animate-bounce text-yellow-300" />
            <p className="font-bubble font-bold text-sm">¡Soltá tu foto aquí!</p>
            <p className="text-[10px] text-fio-200">Se cargará y optimizará automáticamente</p>
          </div>
        ) : isProcessing ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
            <Sparkles className="w-6 h-6 animate-spin text-fio-pink mb-1" />
            <p className="font-bubble font-bold text-xs">Optimizando imagen...</p>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-3 text-center">
            <Upload className="w-6 h-6 mb-1 text-white" />
            <p className="font-bubble font-bold text-xs">Clic para cambiar o arrastrá una foto</p>
            <p className="text-[9px] text-slate-200">También podés presionar Ctrl+V</p>
          </div>
        )}

        {/* Badge inferior de estado */}
        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1.5 pointer-events-none">
          {value.startsWith('data:image') ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Foto cargada desde dispositivo</span>
            </>
          ) : value.trim() ? (
            <>
              <Link2 className="w-3 h-3 text-fio-200" />
              <span>Foto desde enlace web</span>
            </>
          ) : (
            <span>Foto por defecto</span>
          )}
        </div>
      </div>

      {/* Input oculto para selección nativa de archivo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Botones de Acción Rápida: Subir, Pegar Foto, o Arrastrar */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="py-2 px-3 rounded-xl bg-fio-100/80 hover:bg-fio-200/80 text-fio-900 border border-fio-200 font-bubble font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
        >
          <Upload className="w-3.5 h-3.5 text-fio-800" />
          <span>Subir archivo</span>
        </button>

        <button
          type="button"
          onClick={handlePasteFromClipboardBtn}
          className="py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-fio-800 border border-purple-200 font-bubble font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
          title="Pegar imagen copiada del portapapeles o presiona Ctrl+V"
        >
          <Clipboard className="w-3.5 h-3.5 text-fio-pink" />
          <span>Pegar foto (Ctrl+V)</span>
        </button>
      </div>

      {/* Campo para Pegar URL Web Directa */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Link2 className="w-3 h-3 text-slate-400" />
            O pegar URL directa de internet:
          </span>
        </label>
        <div className="relative">
          <input
            type="url"
            value={value.startsWith('data:image') ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={value.startsWith('data:image') ? 'Foto cargada desde archivo (pega URL para reemplazar)' : 'https://images.unsplash.com/... o enlace web'}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-fio-300 focus:outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Notificación de feedback breve */}
      {feedbackMsg && (
        <div
          className={`p-2 rounded-xl text-[11px] flex items-center gap-1.5 animate-fadeIn ${
            feedbackMsg.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-700'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium'
          }`}
        >
          {feedbackMsg.type === 'error' ? (
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}
    </div>
  );
};
