import React, { useState } from 'react';
import { Heart, X, User, Clock, RefreshCw, Sparkles } from 'lucide-react';
import { RegisteredUserLike } from '../../types';
import { formatShortDate } from '../../utils/formatters';

const SECTION_LABELS: Record<string, string> = {
  site: 'Tienda by.fio (General)',
  home: 'Portada / Inicio',
  store: 'Tienda Online',
  catalogo: 'Catálogo Digital',
  workshops: 'Talleres Creativos',
  'workshop-detail': 'Detalle de Taller',
  precios: 'Precios / Stickers',
  'mi-cuenta': 'Mi Cuenta',
  propuesta: 'Propuesta',
};

interface RegisteredLikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredLikes: RegisteredUserLike[];
  onRefresh: () => Promise<void>;
}

export const RegisteredLikesModal: React.FC<RegisteredLikesModalProps> = ({
  isOpen,
  onClose,
  registeredLikes,
  onRefresh,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  if (!isOpen) return null;

  const uniqueUsers = new Set(
    registeredLikes.map((l) => (l.userId || l.userEmail || l.userName).toLowerCase())
  ).size;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Me Gusta de usuarios registrados"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-[#25203D] rounded-3xl border border-pink-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="bg-gradient-to-r from-purple-700 via-fio-purple to-fio-pink px-5 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h3 className="font-bubble font-black text-base leading-tight">
                Me Gusta de Usuarios Registrados
              </h3>
              <p className="text-[11px] text-pink-100">
                {uniqueUsers} usuario(s) registrado(s) han dado Me Gusta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
              title="Actualizar desde base de datos"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          {registeredLikes.length === 0 ? (
            <div className="py-10 text-center space-y-2 text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto text-pink-300" />
              <p className="text-sm font-bubble font-bold text-slate-600">
                Aún no hay Me Gusta de usuarios registrados
              </p>
              <p className="text-xs text-slate-400">
                Cuando un usuario registrado presione Me Gusta aparecerá aquí al instante.
              </p>
            </div>
          ) : (
            registeredLikes.map((like) => (
              <div
                key={like.id}
                className="p-3 rounded-2xl bg-pink-50/50 dark:bg-white/5 border border-pink-100 dark:border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-fio-pink text-white flex items-center justify-center font-bubble font-black text-xs shrink-0">
                    {(like.userName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white truncate flex items-center gap-1.5">
                      <User className="w-3 h-3 text-purple-500 shrink-0" />
                      <span>{like.userName}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {like.userEmail || 'Usuario registrado'} ·{' '}
                      <span className="font-bold text-fio-pink">
                        {SECTION_LABELS[like.sectionKey] || like.sectionKey}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-extrabold">
                    <Heart className="w-2.5 h-2.5 fill-pink-500 text-pink-500" />
                    Me gusta
                  </span>
                  <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {formatShortDate(like.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
