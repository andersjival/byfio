import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, Image as ImageIcon, Link2, Clipboard, Trash2, CheckCircle2,
  Loader2, AlertCircle, Plus, X, Star, Sparkles
} from 'lucide-react';

interface MultiImageUploadFieldProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  defaultPlaceholder?: string;
  label?: string;
}

export const MultiImageUploadField: React.FC<MultiImageUploadFieldProps> = ({
  images,
  onChange,
  maxImages = 10,
  defaultPlaceholder = '/images/placeholder-new-product.jpg',
  label = 'Fotografías del Producto',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Compresión client-side de una imagen individual
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Formato no válido'));
      }
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
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(dataUrl);
          }
        };
        img.onerror = () => reject(new Error('Error al cargar imagen'));
        img.src = dataUrl;
      };
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsDataURL(file);
    });
  };

  // Procesar uno o varios archivos seleccionados (hasta el límite de maxImages)
  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      showFeedback('Por favor selecciona archivos de imagen válidos (JPG, PNG, WebP)', 'error');
      return;
    }

    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      showFeedback(`Ya alcanzaste el límite máximo de ${maxImages} fotos`, 'error');
      return;
    }

    const filesToProcess = fileArray.slice(0, availableSlots);
    setIsProcessing(true);

    try {
      const compressedUrls = await Promise.all(filesToProcess.map((f) => compressImage(f)));
      const nextImages = [...images, ...compressedUrls];
      onChange(nextImages);

      if (fileArray.length > availableSlots) {
        showFeedback(
          `Se agregaron ${availableSlots} fotos (límite de ${maxImages} alcanzado)`,
          'success'
        );
      } else {
        showFeedback(
          `¡${compressedUrls.length} foto${compressedUrls.length > 1 ? 's' : ''} agregada${compressedUrls.length > 1 ? 's' : ''} con éxito!`,
          'success'
        );
      }
    } catch {
      showFeedback('Hubo un error al procesar algunas fotos', 'error');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [images, maxImages, onChange]);

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Manejo de pegar imágenes con Ctrl+V
  const handlePasteEvent = useCallback((e: ClipboardEvent) => {
    if (!e.clipboardData) return;
    const items = e.clipboardData.items;
    const pastedFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) {
      e.preventDefault();
      processFiles(pastedFiles);
    }
  }, [processFiles]);

  useEffect(() => {
    window.addEventListener('paste', handlePasteEvent);
    return () => window.removeEventListener('paste', handlePasteEvent);
  }, [handlePasteEvent]);

  // Pegar desde botón de portapapeles
  const handlePasteFromClipboardBtn = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        showFeedback('Usa Ctrl+V para pegar directamente tu imagen', 'error');
        return;
      }
      const clipboardItems = await navigator.clipboard.read();
      const files: File[] = [];
      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          files.push(new File([blob], 'clipboard-image.png', { type: imageType }));
        }
      }
      if (files.length > 0) {
        processFiles(files);
      } else {
        showFeedback('No hay ninguna imagen en tu portapapeles. Cópiala y prueba de nuevo o usa Ctrl+V', 'error');
      }
    } catch {
      showFeedback('Presiona Ctrl+V para pegar la imagen directamente', 'error');
    }
  };

  // Agregar por URL
  const handleAddUrl = () => {
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) return;
    if (images.length >= maxImages) {
      showFeedback(`Límite máximo de ${maxImages} fotos alcanzado`, 'error');
      return;
    }
    onChange([...images, cleanUrl]);
    setUrlInput('');
    showFeedback('¡Foto añadida desde enlace!');
  };

  // Eliminar una foto específica
  const handleRemovePhoto = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    onChange(next);
  };

  // Establecer como Principal (mover a posición 0)
  const handleMakePrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const remaining = images.filter((_, i) => i !== index);
    onChange([target, ...remaining]);
    showFeedback('¡Foto establecida como portada principal!');
  };

  const hasPhotos = images.length > 0;
  const primaryDisplay = hasPhotos ? images[0] : defaultPlaceholder;

  return (
    <div className="space-y-3">
      {/* Encabezado y Contador */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-fio-pink" />
          <span>{label}</span>
        </label>
        <span className={`text-[11px] font-bubble font-bold px-2 py-0.5 rounded-full border ${
          images.length >= maxImages
            ? 'bg-rose-100 text-rose-800 border-rose-300 font-black'
            : hasPhotos
            ? 'bg-purple-100 text-purple-900 border-purple-200'
            : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          {images.length} / {maxImages} fotos
        </span>
      </div>

      {/* Zona de Vista Previa Principal / Portada */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative aspect-square w-full rounded-2xl overflow-hidden border-2 transition-all shadow-neuCard flex items-center justify-center bg-slate-50 ${
          isDragging
            ? 'border-fio-pink bg-pink-50/50 scale-[1.01]'
            : 'border-fio-200/80 hover:border-fio-300'
        }`}
      >
        <img
          src={primaryDisplay}
          alt="Vista previa del producto"
          className="w-full h-full object-cover transition-transform duration-300"
        />

        {/* Overlay con estado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Insignia Superior */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          {hasPhotos ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-fio-pink text-white font-bubble font-bold text-[10px] shadow-sm">
              <Star className="w-3 h-3 fill-white" />
              <span>Foto Portada Principal</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-700 text-white font-bubble font-bold text-[10px] shadow-sm">
              <Sparkles className="w-3 h-3 text-fio-yellow" />
              <span>Foto de Referencia Provisional</span>
            </span>
          )}

          {hasPhotos && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[10px] font-bold text-white hover:text-rose-200 bg-black/50 hover:bg-rose-600/90 px-2 py-0.5 rounded-full transition-all cursor-pointer backdrop-blur-xs flex items-center gap-1"
              title="Quitar todas las fotos y volver a la referencia"
            >
              <Trash2 className="w-3 h-3" />
              <span>Quitar todas</span>
            </button>
          )}
        </div>

        {/* Banner Inferior cuando es foto de referencia */}
        {!hasPhotos && (
          <div className="absolute bottom-2.5 inset-x-2.5 p-2 rounded-xl bg-white/95 backdrop-blur-md border border-purple-200 text-center shadow-sm">
            <p className="text-[10px] text-purple-900 font-bold leading-tight">
              Sube tus fotos abajo (hasta 10). Al subirlas, esta referencia se eliminará automáticamente.
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
            <Loader2 className="w-7 h-7 text-fio-pink animate-spin" />
            <span className="text-xs font-bold text-fio-900 font-bubble">Optimizando fotos...</span>
          </div>
        )}
      </div>

      {/* Botones de Acción Rápida: Subir Múltiples y Pegar */}
      <div className="grid grid-cols-2 gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              processFiles(e.target.files);
            }
          }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxImages}
          className={`py-2 px-3 rounded-xl font-bubble font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer ${
            images.length >= maxImages
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-fio-pink hover:bg-pink-600 text-white shadow-clayPink'
          }`}
          title={`Seleccionar hasta ${maxImages - images.length} foto(s) de tu equipo`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Subir Fotos ({maxImages - images.length} disp.)</span>
        </button>

        <button
          type="button"
          onClick={handlePasteFromClipboardBtn}
          disabled={images.length >= maxImages}
          className={`py-2 px-3 rounded-xl font-bubble font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer ${
            images.length >= maxImages
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200'
          }`}
          title="Pegar imagen copiada con Ctrl+V"
        >
          <Clipboard className="w-3.5 h-3.5 text-fio-pink" />
          <span>Pegar (Ctrl+V)</span>
        </button>
      </div>

      {/* Campo para Pegar Enlace Web Directo */}
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            disabled={images.length >= maxImages}
            placeholder={
              images.length >= maxImages
                ? `Límite de ${maxImages} fotos alcanzado`
                : 'https://... o pega enlace de foto'
            }
            className="w-full pl-7 pr-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-fio-300 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-400"
          />
          <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={!urlInput.trim() || images.length >= maxImages}
          className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-slate-200 text-white font-bubble font-bold text-xs transition-all active:scale-95 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-2xs"
        >
          + Añadir
        </button>
      </div>

      {/* Galería de Miniaturas (1 a 10 fotos) */}
      {hasPhotos && (
        <div className="p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold px-0.5">
            <span>Galería ({images.length} de {maxImages}):</span>
            <span className="text-[10px] text-fio-pink font-bold">Haz clic en una para hacerla Principal</span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1">
            {images.map((imgUrl, idx) => {
              const isPrimary = idx === 0;
              return (
                <div
                  key={idx}
                  onClick={() => handleMakePrimary(idx)}
                  className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-2xs ${
                    isPrimary
                      ? 'border-fio-pink ring-2 ring-fio-pink/30 shadow-xs'
                      : 'border-slate-200 hover:border-purple-300 opacity-90 hover:opacity-100 hover:scale-105'
                  }`}
                  title={isPrimary ? 'Foto de Portada' : 'Haz clic para hacerla Portada'}
                >
                  <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />

                  {/* Número o Insignia */}
                  <span className={`absolute bottom-0 inset-x-0 text-[8px] font-bold text-center py-0.5 ${
                    isPrimary ? 'bg-fio-pink text-white' : 'bg-black/60 text-white'
                  }`}>
                    {isPrimary ? 'Portada' : `#${idx + 1}`}
                  </span>

                  {/* Botón Eliminar Miniatura */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(idx);
                    }}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                    title="Eliminar esta foto"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}

            {/* Espacio para agregar más si no se ha llegado al límite */}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-purple-300 hover:border-fio-pink bg-white/70 hover:bg-pink-50/50 flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-fio-pink transition-all active:scale-95 cursor-pointer"
                title={`Subir más fotos (${maxImages - images.length} disponibles)`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="text-[9px] font-bold">+{maxImages - images.length}</span>
              </button>
            )}
          </div>
        </div>
      )}

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
