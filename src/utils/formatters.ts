export const formatCRC = (amount: number): string => {
  const safe = Number(amount) || 0;
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(safe).replace('CRC', '₡');
};

export const formatShortDate = (isoString: string): string => {
  try {
    if (!isoString) return '';
    let clean = String(isoString).trim();
    // Si viene como "YYYY-MM-DD HH:MM:SS" (formato por defecto de SQLite sin Z),
    // se trata como UTC para que se convierta exactamente a la hora local del usuario.
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(clean)) {
      clean = clean.replace(' ', 'T') + 'Z';
    }
    const d = new Date(clean);
    if (isNaN(d.getTime())) return isoString;

    return d.toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
};

export const getWhatsAppLink = (phone: string, text: string): string => {
  const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';
  const prefix = cleanPhone.startsWith('506') ? cleanPhone : `506${cleanPhone}`;
  return `https://wa.me/${prefix}?text=${encodeURIComponent(text || '')}`;
};

/**
 * Web Audio API synthesize real-time beeps for QR picking
 * No external audio files needed; runs 100% reliably in any modern browser!
 */
export const playAudioBeep = (type: 'success' | 'error' | 'finish') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'success') {
      // Pleasant high-pitched double chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'error') {
      // Low buzz error sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'finish') {
      // Fanfare completion melody
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.2);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.22);
      });
    }
  } catch (e) {
    console.warn('Audio context beep error:', e);
  }
};
