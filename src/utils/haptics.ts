// Utilidad de Respuesta Háptica y Vibración Suave y Corta para PWA y Navegación Web
// Diseñada para feedback táctil ultra-rápido en botones, enlaces y controles interactivos.

const STORAGE_KEY_ENABLED = 'byfio_pwa_vibration_enabled_v1';
const STORAGE_KEY_INTENSITY = 'byfio_pwa_vibration_intensity_v1';
const EVENT_NAME = 'byfio-haptics-changed';

let lastVibrationTimestamp = 0;
const HAPTIC_DEBOUNCE_MS = 60; // Evita doble vibración si coinciden múltiples eventos en el mismo frame

/**
 * Calcula la duración exacta en milisegundos para una intensidad dada (1 a 10).
 * La vibración es estrictamente CORTA Y SUAVE:
 * - Nivel 1: ~7ms (micro-tap sutil)
 * - Nivel 5: ~18ms (tap suave estándar)
 * - Nivel 10: ~32ms (tap firme pero corto, nunca molesto)
 */
export const calculateHapticDuration = (intensity: number): number => {
  const clamped = Math.min(10, Math.max(1, Math.round(intensity)));
  return Math.round(4 + clamped * 2.8);
};

/**
 * Consulta si la vibración háptica táctil está habilitada.
 * Por defecto está activa.
 */
export const isHapticVibrationEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ENABLED);
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
};

/**
 * Activa o desactiva la vibración háptica en clics e interacciones.
 */
export const setHapticVibrationEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { enabled } }));
  } catch {}
};

/**
 * Obtiene la intensidad configurada (número entero de 1 a 10).
 * Por defecto es 4 (~15ms de duración corta y suave).
 */
export const getHapticVibrationIntensity = (): number => {
  if (typeof window === 'undefined') return 4;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_INTENSITY);
    if (!saved) return 4;
    const val = parseInt(saved, 10);
    return isNaN(val) ? 4 : Math.min(10, Math.max(1, val));
  } catch {
    return 4;
  }
};

/**
 * Configura la intensidad de la vibración táctil (1 a 10).
 */
export const setHapticVibrationIntensity = (intensity: number): void => {
  if (typeof window === 'undefined') return;
  const clamped = Math.min(10, Math.max(1, Math.round(intensity)));
  try {
    localStorage.setItem(STORAGE_KEY_INTENSITY, String(clamped));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { intensity: clamped } }));
  } catch {}
};

/**
 * Ejecuta una pulsación háptica corta y suave según la configuración actual.
 * @param overrideIntensity Nivel opcional para pruebas directas
 * @param force Ignora la comprobación de habilitado (útil para el botón de prueba)
 */
export const triggerHapticFeedback = (overrideIntensity?: number, force = false): void => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  if (!('vibrate' in navigator)) return;

  const now = Date.now();
  if (now - lastVibrationTimestamp < HAPTIC_DEBOUNCE_MS) {
    return;
  }

  if (!force && !isHapticVibrationEnabled()) {
    return;
  }

  const intensity = overrideIntensity !== undefined ? overrideIntensity : getHapticVibrationIntensity();
  const duration = calculateHapticDuration(intensity);

  try {
    navigator.vibrate(duration);
    lastVibrationTimestamp = now;
  } catch {
    // Silencioso ante falta de permisos del dispositivo
  }
};

/**
 * Registra un escucha global en todo el documento para disparar la vibración suave
 * al hacer clic en cualquier elemento interactivo de la web.
 */
export const setupGlobalHapticClickListener = (): (() => void) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const handleClick = (e: MouseEvent) => {
    try {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Buscar si el objetivo o sus ancestros son un elemento interactivo
      const interactive = target.closest<HTMLElement>(
        'button, a, input, select, textarea, [role="button"], label, .cursor-pointer, [data-haptic]'
      );

      if (interactive) {
        triggerHapticFeedback();
      }
    } catch {}
  };

  document.addEventListener('click', handleClick, { capture: true, passive: true });

  return () => {
    document.removeEventListener('click', handleClick, { capture: true });
  };
};
