/* ============================================================
   Audio — Sound effect & music manager
   Lightweight, uses Web Audio API
   ============================================================ */

import storage from './storage.js';
import { MusicPlayer } from './music-player.js';

const STORAGE_KEY_SFX   = 'audio:sfx';
const STORAGE_KEY_MUSIC = 'audio:music';

let audioCtx = null;
let sfxEnabled = true;
let musicEnabled = true;
let musicPlayer = null;
let musicId = null;
let musicPaused = false;
let initialized = false;
let unlocked = false;
const listeners = new Set();

/** Pre-defined sound effects (generated via oscillator, no files needed) */
const SFX_DEFS = {
  tap:        { freq: 600,  duration: 0.06, type: 'sine',     gain: 0.15 },
  success:    { freq: 880,  duration: 0.15, type: 'sine',     gain: 0.2, sweep: 1200 },
  error:      { freq: 200,  duration: 0.2,  type: 'sine',     gain: 0.07 },
  levelup:    { freq: 523,  duration: 0.3,  type: 'sine',     gain: 0.2, sweep: 1046 },
  score:      { freq: 700,  duration: 0.08, type: 'sine',     gain: 0.12 },
  streak:     { freq: 440,  duration: 0.25, type: 'sine',     gain: 0.18, sweep: 880 },
  gameover:   { freq: 400,  duration: 0.4,  type: 'triangle', gain: 0.15, sweep: 150 },
  click:      { freq: 700,  duration: 0.06, type: 'sine',     gain: 0.06 },
};

/**
 * Initialize audio system.
 */
export function initAudio() {
  sfxEnabled  = storage.get(STORAGE_KEY_SFX, true);
  musicEnabled = storage.get(STORAGE_KEY_MUSIC, true);
  if (!initialized) {
    initialized = true;
    document.addEventListener('pointerdown', unlockAudio, true);
    document.addEventListener('keydown', unlockAudio, true);
    document.addEventListener('visibilitychange', () => {
      syncMusic();
      if (!document.hidden && unlocked) unlockAudio();
    });
    window.addEventListener('pagehide', stopMusic);
    window.addEventListener('storage', event => {
      if (!event.key || event.key === 'db-games:v1:' + STORAGE_KEY_MUSIC || event.key === 'db-games:v1:' + STORAGE_KEY_SFX) {
        sfxEnabled = storage.get(STORAGE_KEY_SFX, true);
        musicEnabled = storage.get(STORAGE_KEY_MUSIC, true);
        syncMusic();
        listeners.forEach(listener => listener());
      }
    });
  }
  syncMusic();
}

/**
 * Ensure AudioContext is created (must be called after user gesture).
 */
function ensureContext() {
  if (!unlocked && !navigator.userActivation?.isActive) return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    musicPlayer = new MusicPlayer(audioCtx);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().then(syncMusic).catch(() => {});
  }
  return audioCtx;
}

export function unlockAudio() {
  unlocked = true;
  try { ensureContext(); syncMusic(); } catch { /* Audio is optional. */ }
}

function syncMusic() {
  if (!musicPlayer) return;
  if (musicId && musicEnabled && !musicPaused && !document.hidden && audioCtx.state === 'running') musicPlayer.play(musicId);
  else musicPlayer.stop();
}

export function startMusic(gameId) {
  musicId = gameId;
  musicPaused = false;
  syncMusic();
}
export function stopMusic() { musicId = null; musicPlayer?.stop(); }
export function pauseMusic() { musicPaused = true; syncMusic(); }
export function resumeMusic() { musicPaused = false; syncMusic(); }
export function onAudioChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
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
    if (!ctx || ctx.state !== 'running') return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = def.type;
    osc.frequency.setValueAtTime(def.freq, ctx.currentTime);

    if (def.sweep) {
      osc.frequency.linearRampToValueAtTime(def.sweep, ctx.currentTime + def.duration);
    }

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(def.gain, ctx.currentTime + 0.006);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + def.duration);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + def.duration + 0.03);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + def.duration + 0.05);
    osc.onended = () => { osc.disconnect(); gainNode.disconnect(); };
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
  listeners.forEach(listener => listener());
}

export function setMusicEnabled(enabled) {
  musicEnabled = enabled;
  storage.set(STORAGE_KEY_MUSIC, enabled);
  syncMusic();
  listeners.forEach(listener => listener());
}

export default {
  initAudio, playSfx, haptic, unlockAudio,
  startMusic, stopMusic, pauseMusic, resumeMusic, onAudioChange,
  isSfxEnabled, isMusicEnabled,
  setSfxEnabled, setMusicEnabled,
};
