/**
 * Subtle sound synthesizer using the Web Audio API for creative spark notifications.
 * No external audio files or dependencies needed.
 */
let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setNotificationSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  try {
    localStorage.setItem('nucleo-lab-sound-enabled', enabled ? 'true' : 'false');
  } catch {}
}

export function isNotificationSoundEnabled(): boolean {
  try {
    const val = localStorage.getItem('nucleo-lab-sound-enabled');
    if (val !== null) {
      soundEnabled = val === 'true';
    }
  } catch {}
  return soundEnabled;
}

export function playSparkChime() {
  if (!soundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    // Harmonic arpeggio (C5, E5, G5)
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, index) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      // Gentle envelope: soft attack and smooth decay
      gain.gain.setValueAtTime(0.0001, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.36);
    });
  } catch {
    // Gracefully ignore audio errors (e.g. strict autoplay)
  }
}
