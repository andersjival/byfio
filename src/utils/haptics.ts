// Utilidad de Respuesta Háptica y Vibración Suave y Corta para PWA y Navegación Web
// Diseñada para feedback táctil ultra-rápido en botones, enlaces y controles interactivos.

const STORAGE_KEY_ENABLED = 'byfio_pwa_vibration_enabled_v1';
const STORAGE_KEY_INTENSITY = 'byfio_pwa_vibration_intensity_v1';
const EVENT_NAME = 'byfio-haptics-changed';

let lastVibrationTimestamp = 0;
const HAPTIC_DEBOUNCE_MS = 50; // Evita doble vibración si coinciden múltiples eventos en el mismo frame

let hapticAudioCtx: AudioContext | null = null;

/**
 * Emite un micro-golpe táctil sintetizado mediante Web Audio API.
 * Garantiza respuesta acústico-háptica inmediata en PCs, Macs y dispositivos iOS (iPhone)
 * donde navigator.vibrate no está disponible por restricciones del sistema operativo.
 */
export const playTactileAudioFeedback = (intensity = 4): void => {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    if (!hapticAudioCtx) {
      hapticAudioCtx = new AudioCtx();
    }
    if (hapticAudioCtx.state === 'suspended') {
      hapticAudioCtx.resume();
    }
    const ctx = hapticAudioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Frecuencia baja percusiva que simula un toque mecánico / Taptic Engine
    const baseFreq = 120 + intensity * 6;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.04);

    const volume = Math.min(0.35, 0.12 + intensity * 0.02);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch {}
};

/**
 * Comprueba si el hardware y navegador actual admiten la API física de vibración.
 */
export const isVibrationSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

/**
 * Calcula la duración exacta en milisegundos para una intensidad dada (1 a 10).
 * Calibrada para superar la inercia de los micromotores de vibración móvil (ERM/LRA):
 * - Nivel 1: ~30ms (micro-tap sutil)
 * - Nivel 5: ~60ms (tap háptico nítido estándar)
 * - Nivel 10: ~96ms (vibración firme y contundente)
 */
export const calculateHapticDuration = (intensity: number): number => {
  const clamped = Math.min(10, Math.max(1, Math.round(intensity)));
  return Math.round(22 + clamped * 7.4);
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
 * Por defecto es 4 (~52ms de duración corta y nítida).
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
 * @param force Ignora la comprobación de habilitado y el debounce (vital para botones de prueba)
 */
export const triggerHapticFeedback = (overrideIntensity?: number, force = false): void => {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  // El debounce NUNCA bloquea las pruebas forzadas directas
  if (!force && now - lastVibrationTimestamp < HAPTIC_DEBOUNCE_MS) {
    return;
  }

  if (!force && !isHapticVibrationEnabled()) {
    return;
  }

  const intensity = overrideIntensity !== undefined ? overrideIntensity : getHapticVibrationIntensity();
  const duration = calculateHapticDuration(intensity);
  const hasVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  // 1. Vibración en hardware móvil compatible (Android, tablets, PWAs móviles)
  if (hasVibrate) {
    try {
      if (force) {
        // En modo de prueba emitir un doble tap inconfundible y enérgico
        navigator.vibrate([duration, 45, duration]);
      } else {
        navigator.vibrate(duration);
      }
      lastVibrationTimestamp = now;
    } catch {
      // Silencioso ante restricciones de permisos del dispositivo
    }
  }

  // 2. Respuesta táctil acústica (para feedback en PC, Mac y iPhone sin motor de vibración web)
  // Al probar directamente con force = true, o si el hardware no tiene motor accesible
  if (force || !hasVibrate) {
    playTactileAudioFeedback(intensity);
    lastVibrationTimestamp = now;
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

      // Si es un botón de prueba de vibración, no interferir con la prueba directa
      if (interactive && !interactive.closest('[data-haptic-test]')) {
        triggerHapticFeedback();
      }
    } catch {}
  };

  document.addEventListener('click', handleClick, { capture: true, passive: true });

  return () => {
    document.removeEventListener('click', handleClick, { capture: true });
  };
};
