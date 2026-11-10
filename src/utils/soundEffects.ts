import { triggerHapticFeedback, isHapticVibrationEnabled } from './haptics';
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
 * Desbloquea el contexto de audio tras interacción del usuario en teléfonos móviles
 */
export const unlockAudioContext = () => {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  } catch {}
};

/**
 * Sonido orgánico de burbuja estallando / pop (Bubble Pop)
 * Simula la liberación instantánea de presión acústica de una burbuja al reventar.
 */
export const playBubblePopSound = (volume = 0.3) => {
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('byfio_sound_bubble_v1');
      if (saved === 'false') return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    // Vibración háptica en teléfonos móviles al sonar un nuevo pedido
    // Respuesta háptica táctil corta y suave calibrada
    triggerHapticFeedback();

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
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('byfio_sound_buttons_v1');
      if (saved === 'false') return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    // Vibración háptica en teléfonos móviles al sonar un nuevo pedido
    // Respuesta háptica táctil corta y suave calibrada
    triggerHapticFeedback();

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
 * Sonido melodioso y placentero para la llegada de un nuevo pedido (Chime / Campanilla Celesta)
 * Secuencia armónica ascendente cristalina (E5, G#5, B5, E6) con decaimiento suave y cálido.
 */
export const playNewOrderChimeSound = (volume = 0.35) => {
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('byfio_sound_new_order_v1');
      if (saved === 'false') return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    // Vibración háptica en teléfonos móviles al sonar un nuevo pedido
    // Respuesta háptica táctil corta y suave calibrada
    triggerHapticFeedback();

    // Acorde arpegiado brillante en Mi Mayor (E Major) con timbre tipo marimba / celesta
    const notes = [
      { freq: 659.25, time: 0.00, dur: 0.32 }, // E5
      { freq: 830.61, time: 0.08, dur: 0.36 }, // G#5
      { freq: 987.77, time: 0.16, dur: 0.40 }, // B5
      { freq: 1318.51, time: 0.24, dur: 0.58 }, // E6 (resolución cristalina sostenida)
    ];

    const startTime = ctx.currentTime + 0.02;

    notes.forEach(({ freq, time, dur }) => {
      const noteStart = startTime + time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteStart);

      // Envolvente acústica: ataque ultra rápido de 12ms y decaimiento exponencial suave
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(volume, noteStart + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + dur);
    });
  } catch {
    // Silencioso ante restricciones de autoplay
  }
};

/**
 * Sonido armónico y resonante de campanita de agenda (Bell Ring / Chime)
 * Simula el tintineo dorado de una campana de recepción o templo con doble armónico y decaimiento cristalino.
 */
export const playAgendaBellSound = (volume = 0.35) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Vibración háptica en teléfonos móviles al sonar un nuevo pedido
    // Respuesta háptica táctil corta y suave calibrada
    triggerHapticFeedback();

    const now = ctx.currentTime;

    // Doble golpe de campanita armónica tipo boutique ("Ding - Dong" cristalino)
    const bellStrikes = [
      {
        time: 0.00,
        partials: [
          { freq: 1174.66, gain: 0.85, decay: 1.3 }, // D6 (fundamental)
          { freq: 2349.32, gain: 0.35, decay: 0.85 }, // D7 (octava)
          { freq: 3520.00, gain: 0.18, decay: 0.55 }, // A7 (quinta brillante)
          { freq: 4698.64, gain: 0.09, decay: 0.35 }, // D8 (brillo metálico suave)
        ],
      },
      {
        time: 0.18,
        partials: [
          { freq: 1760.00, gain: 0.9, decay: 1.6 }, // A6 (armónico dulce)
          { freq: 3520.00, gain: 0.28, decay: 0.95 }, // A7
          { freq: 5274.04, gain: 0.12, decay: 0.45 }, // E8 (chispa de cristal)
        ],
      },
    ];

    bellStrikes.forEach((strike) => {
      const strikeStart = now + strike.time;

      strike.partials.forEach((part) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(part.freq, strikeStart);

        // Ataque instantáneo de campana (2.5ms) y decaimiento exponencial natural
        gain.gain.setValueAtTime(0.0001, strikeStart);
        gain.gain.exponentialRampToValueAtTime(volume * part.gain, strikeStart + 0.0025);
        gain.gain.exponentialRampToValueAtTime(0.0001, strikeStart + part.decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(strikeStart);
        osc.stop(strikeStart + part.decay + 0.02);
      });
    });
  } catch {
    // Silencioso ante restricciones de autoplay
  }
};

/**
 * Disparador universal de Notificación Push del Navegador
 */
export const sendBrowserPushNotification = async (title: string, options?: NotificationOptions): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'granted') {
      new Notification(title, {
        icon: '/assets/logo-byfio-lila-HD.png',
        badge: '/assets/logo-byfio.svg',
        ...options,
      });
      return true;
    }
  } catch (e) {
    console.warn('Browser push notification error:', e);
  }
  return false;
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


/**
 * Beep característico de pistola lectora de código de barras industrial (éxito)
 * Frecuencia aguda de 2450Hz rápida con vibración táctil corta.
 */
export const playBarcodeSuccessSound = (volume = 0.35) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    triggerHapticFeedback();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(2450, now);

    gain.gain.setValueAtTime(volume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch {}
};

/**
 * Tono de alerta cuando el código de barras escaneado no corresponde al producto
 * Doble tono descendente tipo advertencia con vibración táctil larga.
 */
export const playBarcodeErrorSound = (volume = 0.35) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([180, 80, 180]);
      } catch {}
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.setValueAtTime(220, now + 0.12);

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.29);
  } catch {}
};
