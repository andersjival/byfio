import { useEffect, useRef } from 'react';

interface SmartPollingOptions {
  intervalMs: number;
  enabled?: boolean;
  runImmediatelyOnFocus?: boolean;
}

/**
 * Hook de Polling Inteligente con Ahorro de Cuota Edge:
 * - Pausa inmediata de peticiones cuando la pestaña está oculta (document.hidden).
 * - Reactivación inmediata al regresar al foco.
 */
export function useSmartPolling(
  callback: () => void | Promise<void>,
  { intervalMs, enabled = true, runImmediatelyOnFocus = true }: SmartPollingOptions
) {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useEffect(() => {
    if (!enabled || intervalMs <= 0) return;

    let timerId: ReturnType<typeof setInterval> | null = null;

    const startTimer = () => {
      if (timerId === null && typeof document !== 'undefined' && !document.hidden) {
        timerId = setInterval(() => {
          if (!document.hidden) {
            savedCallback.current();
          }
        }, intervalMs);
      }
    };

    const stopTimer = () => {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        if (runImmediatelyOnFocus) {
          savedCallback.current();
        }
        startTimer();
      }
    };

    if (typeof document !== 'undefined' && !document.hidden) {
      startTimer();
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleVisibilityChange);
    }

    return () => {
      stopTimer();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleVisibilityChange);
      }
    };
  }, [intervalMs, enabled, runImmediatelyOnFocus]);
}
