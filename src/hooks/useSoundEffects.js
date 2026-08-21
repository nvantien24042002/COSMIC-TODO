import { useRef, useCallback, useEffect, useState } from 'react';

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('cosmic_sound_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const audioCtxRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('cosmic_sound_enabled', JSON.stringify(soundEnabled));
    } catch (e) {
      console.warn('Failed to save sound preference', e);
    }
  }, [soundEnabled]);

  const getAudioContext = useCallback(() => {
    if (!soundEnabled) return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, [soundEnabled]);

  // Cosmic Warp - when adding a new task
  const playAddTaskSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.error(e);
    }
  }, [getAudioContext]);

  // Celestial Chime - when completing a task
  const playCompleteSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Cosmic Arpeggio)

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = now + index * 0.06;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch (e) {
      console.error(e);
    }
  }, [getAudioContext]);

  // Cosmic Dissolve / Swoosh - when deleting or unchecking
  const playDeleteSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.error(e);
    }
  }, [getAudioContext]);

  // Soft Glass Click - for UI buttons/toggles
  const playClickSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.error(e);
    }
  }, [getAudioContext]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  return {
    soundEnabled,
    toggleSound,
    playAddTaskSound,
    playCompleteSound,
    playDeleteSound,
    playClickSound,
  };
}
