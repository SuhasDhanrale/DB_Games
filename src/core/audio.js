/* ============================================================
   Audio — Sound effect & music manager
   Lightweight, uses Web Audio API
   ============================================================ */

import storage from './storage.js';
import { MusicPlayer } from './music-player.js';

const STORAGE_KEY_SFX   = 'audio:sfx';
const STORAGE_KEY_MUSIC = 'audio:music';
const STORAGE_KEY_VOLUME = 'audio:music-volume';

let audioCtx = null;
let sfxEnabled = true;
let musicEnabled = false;
let musicVolume = 0.18;
let musicPlayer = null;
let musicId = null;
let musicPaused = false;
let initialized = false;
let unlocked = false;
const listeners = new Set();

/** Pre-defined sound effects (generated via oscillator, no files needed) */
const SFX_DEFS = {
  completion: [
    { freq: 523.25, duration: 0.18, type: 'sine', gain: 0.24, delay: 0 },
    { freq: 659.25, duration: 0.18, type: 'sine', gain: 0.24, delay: 0.16 },
    { freq: 783.99, duration: 0.18, type: 'sine', gain: 0.24, delay: 0.32 },
    { freq: 1046.5, duration: 0.36, type: 'sine', gain: 0.24, delay: 0.48 },
  ],
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
  musicEnabled = storage.get(STORAGE_KEY_MUSIC, false);
  musicVolume = Math.max(0, Math.min(1, Number(storage.get(STORAGE_KEY_VOLUME, 0.18)) || 0));
  musicPlayer?.setVolume(musicVolume);
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
      if (!event.key || [STORAGE_KEY_MUSIC, STORAGE_KEY_SFX, STORAGE_KEY_VOLUME].some(key => event.key === 'db-games:v1:' + key)) {
        sfxEnabled = storage.get(STORAGE_KEY_SFX, true);
        musicEnabled = storage.get(STORAGE_KEY_MUSIC, false);
        musicVolume = Math.max(0, Math.min(1, Number(storage.get(STORAGE_KEY_VOLUME, 0.18)) || 0));
        musicPlayer?.setVolume(musicVolume);
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
    musicPlayer = new MusicPlayer(audioCtx, () => listeners.forEach(listener => listener()));
    musicPlayer.setVolume(musicVolume);
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
    if (!ctx) return;
    const play = () => {
      if (!sfxEnabled || ctx.state !== 'running') return;
      for (const note of Array.isArray(def) ? def : [def]) {
        const start = ctx.currentTime + (note.delay || 0);
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = note.type;
        osc.frequency.setValueAtTime(note.freq, start);

        if (note.sweep) {
          osc.frequency.linearRampToValueAtTime(note.sweep, start + note.duration);
        }

        gainNode.gain.setValueAtTime(0, start);
        gainNode.gain.linearRampToValueAtTime(note.gain, start + 0.006);
        gainNode.gain.exponentialRampToValueAtTime(0.001, start + note.duration);
        gainNode.gain.linearRampToValueAtTime(0, start + note.duration + 0.03);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + note.duration + 0.05);
        osc.onended = () => { osc.disconnect(); gainNode.disconnect(); };
      }
    };
    if (ctx.state === 'suspended') ctx.resume().then(play).catch(() => {});
    else play();
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
export function getMusicVolume() { return musicVolume; }
export function getMusicStatus() { return musicPlayer?.state || 'idle'; }
export function setMusicVolume(value) {
  musicVolume = Math.max(0, Math.min(1, Number(value) || 0));
  storage.set(STORAGE_KEY_VOLUME, musicVolume);
  musicPlayer?.setVolume(musicVolume);
  listeners.forEach(listener => listener());
}

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
  getMusicVolume, setMusicVolume, getMusicStatus,
};
