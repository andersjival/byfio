import React, { useEffect, useState } from 'react';
import { Trash2, Pause, Play, Send } from 'lucide-react';

interface StarAgentAudioBarProps {
  formattedTime: string;
  isPaused: boolean;
  audioLevel: number;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onSend: () => void;
}

const BASE_BARS = [25, 45, 75, 35, 90, 60, 40, 85, 30, 95, 50, 70, 35, 80, 45, 65, 85, 40];

export const StarAgentAudioBar: React.FC<StarAgentAudioBarProps> = ({
  formattedTime,
  isPaused,
  audioLevel,
  onPause,
  onResume,
  onCancel,
  onSend,
}) => {
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(() => {
      setWaveOffset((prev) => (prev + 1) % BASE_BARS.length);
    }, 110);
    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="flex items-center justify-between gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-gradient-to-r from-pink-50/90 via-purple-50/70 to-pink-50/90 dark:from-purple-950/60 dark:via-[#221838] dark:to-purple-950/60 border border-fio-200/90 dark:border-purple-800/60 shadow-sm animate-in fade-in zoom-in-95 duration-150 w-full">
      {/* Botón Borrar (Izquierda) */}
      <button
        type="button"
        onClick={onCancel}
        title="Borrar audio"
        aria-label="Borrar audio"
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-full transition-all active:scale-90 flex-shrink-0 cursor-pointer"
      >
        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Segundero con punto indicador */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span
          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 ${
            isPaused ? 'opacity-40' : 'animate-pulse'
          }`}
        />
        <span className="font-mono text-xs sm:text-sm font-bold text-slate-700 dark:text-purple-200 min-w-[34px] sm:min-w-[38px] tabular-nums">
          {formattedTime}
        </span>
      </div>

      {/* Línea de tiempo / Onda de audio dinámica en movimiento */}
      <div className="flex-1 flex items-center justify-center gap-0.5 sm:gap-1 h-7 px-1 overflow-hidden min-w-0">
        {BASE_BARS.map((baseH, i) => {
          const shiftIdx = (i + waveOffset) % BASE_BARS.length;
          const shiftH = BASE_BARS[shiftIdx];
          const dynamicMultiplier = isPaused ? 0.25 : Math.max(0.35, Math.min(1.2, 0.4 + audioLevel * 1.4));
          const finalHeight = Math.round(shiftH * dynamicMultiplier);

          return (
            <div
              key={i}
              style={{ height: `${finalHeight}%` }}
              className={`w-0.5 sm:w-1 min-h-[4px] max-h-6 rounded-full transition-all duration-100 ${
                isPaused
                  ? 'bg-slate-300 dark:bg-purple-900/60'
                  : 'bg-gradient-to-t from-purple-600 to-fio-pink'
              }`}
            />
          );
        })}
      </div>

      {/* Botón de Pausar en el centro */}
      <button
        type="button"
        onClick={isPaused ? onResume : onPause}
        title={isPaused ? 'Reanudar grabación' : 'Pausar grabación'}
        aria-label={isPaused ? 'Reanudar grabación' : 'Pausar grabación'}
        className="p-2 text-fio-800 dark:text-purple-200 hover:bg-white dark:hover:bg-purple-900/50 rounded-full transition-all active:scale-90 flex-shrink-0 shadow-xs cursor-pointer"
      >
        {isPaused ? (
          <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-fio-pink dark:text-pink-400" />
        ) : (
          <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-fio-pink dark:text-pink-400" />
        )}
      </button>

      {/* Botón de Enviar (Derecha) */}
      <button
        type="button"
        onClick={onSend}
        title="Enviar nota de voz"
        aria-label="Enviar nota de voz"
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-purple-700 to-fio-pink hover:opacity-95 text-white shadow-clayBtn flex items-center justify-center transition-all active:scale-95 cursor-pointer flex-shrink-0 ml-0.5"
      >
        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
      </button>
    </div>
  );
};
