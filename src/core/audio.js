/* ============================================================
   Audio — Sound effect & music manager
   Lightweight, uses Web Audio API
   ============================================================ */

import storage from './storage.js';

const STORAGE_KEY_SFX   = 'audio:sfx';
const STORAGE_KEY_MUSIC = 'audio:music';

let audioCtx = null;
let sfxEnabled = true;
let musicEnabled = true;

/** Pre-defined sound effects (generated via oscillator, no files needed) */
const SFX_DEFS = {
  tap:        { freq: 600,  duration: 0.06, type: 'sine',     gain: 0.15 },
  success:    { freq: 880,  duration: 0.15, type: 'sine',     gain: 0.2, sweep: 1200 },
  error:      { freq: 200,  duration: 0.2,  type: 'sawtooth', gain: 0.1  },
  levelup:    { freq: 523,  duration: 0.3,  type: 'sine',     gain: 0.2, sweep: 1046 },
  score:      { freq: 700,  duration: 0.08, type: 'sine',     gain: 0.12 },
  streak:     { freq: 440,  duration: 0.25, type: 'sine',     gain: 0.18, sweep: 880 },
  gameover:   { freq: 400,  duration: 0.4,  type: 'triangle', gain: 0.15, sweep: 150 },
  click:      { freq: 1000, duration: 0.04, type: 'square',   gain: 0.08 },
};

/**
 * Initialize audio system.
 */
export function initAudio() {
  sfxEnabled  = storage.get(STORAGE_KEY_SFX, true);
  musicEnabled = storage.get(STORAGE_KEY_MUSIC, true);
}

/**
 * Ensure AudioContext is created (must be called after user gesture).
 */
function ensureContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a named sound effect.
 * @param {keyof SFX_DEFS} name
 */
export function playSfx(name) {
  if (!sfxEnabled) return;
  const def = SFX_DEFS[name];
  if (!def) return;

  try {
    const ctx = ensureContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = def.type;
    osc.frequency.setValueAtTime(def.freq, ctx.currentTime);

    if (def.sweep) {
      osc.frequency.linearRampToValueAtTime(def.sweep, ctx.currentTime + def.duration);
    }

    gainNode.gain.setValueAtTime(def.gain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + def.duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + def.duration + 0.05);
  } catch {
    // Silently fail if audio doesn't work
  }
}

/**
 * Trigger haptic feedback (if available).
 * @param {'light'|'medium'|'heavy'} intensity
 */
export function haptic(intensity = 'light') {
  if (!navigator.vibrate) return;
  const durations = { light: 10, medium: 25, heavy: 50 };
  navigator.vibrate(durations[intensity] || 10);
}

// ---- Settings ----

export function isSfxEnabled()   { return sfxEnabled; }
export function isMusicEnabled() { return musicEnabled; }

export function setSfxEnabled(enabled) {
  sfxEnabled = enabled;
  storage.set(STORAGE_KEY_SFX, enabled);
}

export function setMusicEnabled(enabled) {
  musicEnabled = enabled;
  storage.set(STORAGE_KEY_MUSIC, enabled);
}

export default {
  initAudio, playSfx, haptic,
  isSfxEnabled, isMusicEnabled,
  setSfxEnabled, setMusicEnabled,
};
