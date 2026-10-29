// Utilidad de efectos de sonido sintetizados mediante Web Audio API
// Cero dependencias externas, cero latencia de red y sonido orgánico fluido

let sharedAudioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
};

/**
 * Sonido orgánico de burbuja estallando / pop (Bubble Pop)
 * Simula la liberación instantánea de presión acústica de una burbuja al reventar.
 */
export const playBubblePopSound = (volume = 0.3) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frecuencia inicial con barrido ascendente ultrarrápido y caída resonante
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.035);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.08);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // Silencioso ante restricciones de autoplay
  }
};

/**
 * Sonido orgánico de gota de agua / bloop (Water Drop)
 * Simula el tono líquido resonante característico de una gota de agua cayendo en agua.
 */
export const playWaterDropSound = (volume = 0.22) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Curva física de una gota de agua ("bloop / plink")
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(1650, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(1180, now + 0.11);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  } catch {
    // Silencioso ante restricciones de autoplay
  }
};

/**
 * Listener global para reproducir sonido de gota de agua en todos los botones
 */
export const initWaterDropButtonSounds = () => {
  if (typeof window === 'undefined') return () => {};

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Detectar si el clic fue en un botón, enlace estilo botón o disparador interactivo
    const btn = target.closest('button, [role="button"], .neu-btn, .neu-btn-primary, .btn-login, a.btn-water-drop');
    if (btn) {
      playWaterDropSound(0.2);
    }
  };

  document.addEventListener('click', handleClick, { passive: true });
  return () => {
    document.removeEventListener('click', handleClick);
  };
};

