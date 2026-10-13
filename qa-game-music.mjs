import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MUSIC_TRACKS, canonicalMusicId, musicTrackUrl } from './src/core/music-tracks.js';
import { MusicPlayer } from './src/core/music-player.js';

assert.equal(Object.keys(MUSIC_TRACKS).length, 5);
assert.equal(new Set(Object.values(MUSIC_TRACKS).map(track => track.file)).size, 5);
for (const track of Object.values(MUSIC_TRACKS)) {
  const bytes = fs.readFileSync('public/audio/music/' + track.file);
  assert.ok(bytes.length > 100000, 'Recording must exist, not an HTML error page');
  assert.ok(bytes.subarray(0, 4).toString() === 'OggS' || bytes.subarray(0, 3).toString() === 'ID3' || bytes[0] === 0xff, 'Expected an OGG or MP3 recording');
  assert.ok(track.artist && track.source.startsWith('https://opengameart.org/'));
  assert.ok(['CC0', 'CC BY 4.0'].includes(track.license));
  assert.ok(fs.readFileSync('public/audio/music/CREDITS.md', 'utf8').includes(track.artist.split(' (')[0]));
}
assert.equal(canonicalMusicId('superover'), 'cricket');
assert.equal(canonicalMusicId('neeti'), 'niti');
assert.equal(canonicalMusicId('carrom_puzzles'), 'carrom');
assert.equal(musicTrackUrl(MUSIC_TRACKS.wordal), '/audio/music/wordal-chill-jazz.mp3');

const originalTimeout = globalThis.setTimeout;
const pendingTimers = [];
globalThis.setTimeout = fn => { pendingTimers.push(fn); return pendingTimers.length; };
const finishFades = () => { while (pendingTimers.length) pendingTimers.shift()(); };
const settle = async () => { await Promise.resolve(); await Promise.resolve(); };

class Param {
  constructor() { this.value = 0; this.calls = []; }
  setValueAtTime(...a) { this.calls.push(['set', ...a]); this.value = a[0]; }
  linearRampToValueAtTime(...a) { this.calls.push(['linear', ...a]); this.value = a[0]; }
  exponentialRampToValueAtTime(...a) { this.calls.push(['exponential', ...a]); this.value = a[0]; }
  setTargetAtTime(...a) { this.calls.push(['target', ...a]); }
  cancelScheduledValues(...a) { this.calls.push(['cancel', ...a]); }
  cancelAndHoldAtTime(...a) { this.calls.push(['hold', ...a]); }
}
class Node {
  constructor() { this.gain = new Param(); this.frequency = new Param(); }
  connect() {}
  disconnect() { this.disconnected = true; }
  start() {}
  stop() {}
}
class Context {
  static all = [];
  constructor() { this.currentTime = 0; this.state = 'running'; this.destination = {}; this.oscillators = []; Context.all.push(this); }
  createGain() { return new Node(); }
  createMediaElementSource(element) { const node = new Node(); node.element = element; return node; }
  createOscillator() { const node = new Node(); this.oscillators.push(node); return node; }
  async resume() { this.state = 'running'; }
}
class Media {
  static all = [];
  static deferred = false;
  constructor(src) { this.src = src; this.currentTime = 0; this.duration = 180; this.events = new Map(); Media.all.push(this); }
  addEventListener(type, fn) { this.events.set(type, fn); }
  play() { this.paused = false; return Media.deferred ? new Promise(resolve => { this.resolvePlay = resolve; }) : Promise.resolve(); }
  pause() { this.paused = true; }
  removeAttribute(name) { if (name === 'src') this.src = ''; }
  load() { this.released = true; }
}
globalThis.Audio = Media;
try {
  const ctx = new Context();
  const player = new MusicPlayer(ctx);
  player.play('wordal');
  const first = player.run;
  assert.equal(player.state, 'loading');
  await settle();
  assert.equal(player.state, 'playing');
  assert.equal(first.element.loop, true);
  assert.equal(first.element.preload, 'none');
  assert.ok(first.gain.gain.value <= 0.18);
  player.play('wordal'); assert.equal(player.run, first, 'Repeated starts must not double playback');
  first.element.currentTime = 23;
  player.stop(); finishFades();
  assert.equal(first.element.paused, true);
  assert.equal(first.element.released, true);
  assert.ok(first.source.disconnected && first.gain.disconnected);
  assert.ok(first.gain.gain.calls.some(call => call[0] === 'hold'));
  player.play('wordal'); await settle();
  player.run.element.events.get('loadedmetadata')();
  assert.equal(player.run.element.currentTime, 23, 'Resume should preserve musical progress');
  player.setVolume(0.12);
  assert.ok(player.run.gain.gain.calls.some(call => call[0] === 'target' && Math.abs(call[1] - 0.108) < 0.00001));
  player.play('unknown'); finishFades(); assert.equal(player.run, null);

  Media.deferred = true;
  player.play('niti'); const slow = player.run;
  player.play('jodo'); const latest = player.run;
  slow.element.resolvePlay(); await settle();
  assert.equal(slow.element.paused, true, 'Late loads must never revive an old track');
  latest.element.resolvePlay(); await settle();
  assert.equal(player.run, latest);
  assert.equal(player.state, 'playing');
  latest.element.events.get('error')(); finishFades();
  assert.equal(player.state, 'error');
  assert.equal(player.run, null);
  Media.deferred = false;

  const saved = new Map();
  globalThis.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };
  const documentEvents = new Map();
  const windowEvents = new Map();
  globalThis.document = { hidden: false, addEventListener: (type, fn) => documentEvents.set(type, fn) };
  globalThis.window = { AudioContext: Context, addEventListener: (type, fn) => windowEvents.set(type, fn) };
  Object.defineProperty(globalThis, 'navigator', { value: { userActivation: { isActive: false } }, configurable: true });
  const audio = await import('./src/core/audio.js');
  audio.initAudio();
  const before = Context.all.length;
  const mediaBefore = Media.all.length;
  audio.startMusic('carrom'); audio.playSfx('success');
  assert.equal(Context.all.length, before, 'No context before a gesture');
  assert.equal(Media.all.length, mediaBefore, 'No music fetch before a gesture');
  documentEvents.get('pointerdown')(); await settle();
  assert.equal(Context.all.length, before + 1);
  assert.equal(audio.getMusicStatus(), 'playing');
  audio.setMusicEnabled(false); finishFades(); assert.equal(audio.getMusicStatus(), 'idle');
  assert.equal(saved.get('db-games:v1:audio:music'), 'false');
  audio.setMusicEnabled(true); await settle(); assert.equal(audio.getMusicStatus(), 'playing');
  audio.setMusicVolume(0.1); assert.equal(audio.getMusicVolume(), 0.1);
  assert.equal(saved.get('db-games:v1:audio:music-volume'), '0.1');
  audio.pauseMusic(); finishFades(); assert.equal(audio.getMusicStatus(), 'idle');
  audio.resumeMusic(); await settle(); assert.equal(audio.getMusicStatus(), 'playing');
  document.hidden = true; documentEvents.get('visibilitychange')(); finishFades();
  assert.equal(audio.getMusicStatus(), 'idle');
  document.hidden = false; documentEvents.get('visibilitychange')(); await settle();
  assert.equal(audio.getMusicStatus(), 'playing');
  const audioContext = Context.all.at(-1);
  audio.setSfxEnabled(false);
  const oscCount = audioContext.oscillators.length;
  audio.playSfx('click'); assert.equal(audioContext.oscillators.length, oscCount);
  assert.equal(audio.getMusicStatus(), 'playing', 'SFX mute must leave music playing');
  audio.stopMusic(); finishFades(); assert.equal(audio.getMusicStatus(), 'idle');
  documentEvents.get('pointerdown')(); await settle(); assert.equal(audio.getMusicStatus(), 'idle');
  audio.startMusic('wordal'); await settle();
  windowEvents.get('pagehide')(); finishFades(); assert.equal(audio.getMusicStatus(), 'idle');
  saved.set('db-games:v1:audio:music', 'false');
  audio.initAudio(); audio.startMusic('wordal'); await settle();
  assert.equal(audio.getMusicStatus(), 'idle', 'Saved mute must survive initialization');
  assert.equal(audio.getMusicVolume(), 0.1);
} finally {
  finishFades();
  globalThis.setTimeout = originalTimeout;
}
console.log('Recorded music checks passed: five valid licensed assets, aliases, no autoplay/fetch before a gesture, one track, fades, resume position, stale-load races, errors, persisted independent mute and volume, visibility and page exit.');
