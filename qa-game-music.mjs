import assert from 'node:assert/strict';
import { MUSIC_SCORES, MUSIC_FORM, parseBar, createMusicCycle, midiFrequency } from './src/core/music-score.js';
import { MusicPlayer } from './src/core/music-player.js';

assert.deepEqual(MUSIC_FORM, ['A', 'B', 'A', 'C']);
const signatures = new Set();
for (const [id, score] of Object.entries(MUSIC_SCORES)) {
  for (const section of new Set(MUSIC_FORM)) {
    assert.equal(score[section].length, 4);
    assert.ok(score[section].flatMap(parseBar).some(note => note.midi === null), `${id} needs breathing space`);
  }
  assert.notDeepEqual(score.A, score.B);
  assert.notDeepEqual(score.A, score.C);
  const first = createMusicCycle(id);
  const second = createMusicCycle(id, 1);
  assert.notDeepEqual(first.events, second.events, `${id} accompaniment should vary`);
  assert.ok(first.duration >= 50);
  const melodies = first.events.filter(e => e.voice === 'melody');
  signatures.add(JSON.stringify(melodies.map(e => [e.midi, e.time])));
  for (const event of first.events) {
    assert.ok(event.time >= 0 && event.time + event.duration < first.duration);
    assert.ok(midiFrequency(event.midi) >= 60 && midiFrequency(event.midi) < 650);
  }
  const phraseLength = 16 * 60 / score.bpm;
  assert.deepEqual(melodies.filter(e => e.time < phraseLength).map(e => e.midi), melodies.filter(e => e.time >= phraseLength * 2 && e.time < phraseLength * 3).map(e => e.midi), `${id} must return to the A motif`);
  assert.ok(first.duration - Math.max(...first.events.map(e => e.time + e.duration)) >= 8 * 60 / score.bpm);
}
assert.equal(signatures.size, 5);
assert.deepEqual(createMusicCycle('superover'), createMusicCycle('cricket'));
assert.deepEqual(createMusicCycle('neeti'), createMusicCycle('niti'));
assert.deepEqual(createMusicCycle('carrom_puzzles'), createMusicCycle('carrom'));
assert.equal(createMusicCycle('unknown'), null);
assert.throws(() => parseBar('C4:5'));

const timers = new Map();
let timerId = 0;
const originalInterval = globalThis.setInterval;
const originalClear = globalThis.clearInterval;
const originalTimeout = globalThis.setTimeout;
globalThis.setInterval = fn => { timers.set(++timerId, fn); return timerId; };
globalThis.clearInterval = id => timers.delete(id);
globalThis.setTimeout = fn => { fn(); return 0; };

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
  constructor() { this.gain = new Param(); this.frequency = new Param(); this.Q = new Param(); this.stops = []; }
  connect() {}
  disconnect() { this.disconnected = true; }
  setPeriodicWave(wave) { this.wave = wave; }
  start(time) { this.started = time; }
  stop(time) { this.stops.push(time); }
}
class Context {
  constructor() { this.currentTime = 0; this.state = 'running'; this.destination = {}; this.oscillators = []; Context.all.push(this); }
  static all = [];
  createGain() { return new Node(); }
  createBiquadFilter() { return new Node(); }
  createOscillator() { const node = new Node(); this.oscillators.push(node); return node; }
  createPeriodicWave(real, imaginary) { return { real, imaginary }; }
  async resume() { this.state = 'running'; }
}
try {
  const ctx = new Context();
  const player = new MusicPlayer(ctx);
  player.play('wordal');
  const firstRun = player.run;
  assert.equal(timers.size, 1);
  assert.ok(ctx.oscillators.length > 0);
  for (const osc of ctx.oscillators) assert.ok(osc.started >= ctx.currentTime);
  player.play('wordal');
  assert.equal(player.run, firstRun, 'Repeated starts must not double playback');
  player.play('jodo');
  assert.equal(player.run.id, 'jodo');
  assert.equal(timers.size, 1);
  assert.ok(firstRun.master.disconnected);
  assert.ok(firstRun.master.gain.calls.some(call => call[0] === 'hold'));
  const secondRun = player.run;
  ctx.currentTime = 200;
  const before = ctx.oscillators.length;
  [...timers.values()][0]();
  assert.equal(secondRun.cycle, 1);
  assert.ok(ctx.oscillators.length - before <= 2, 'Clock jumps must not dump missed notes');
  player.play('unreleased-game');
  assert.equal(player.run, null);
  assert.equal(timers.size, 0);

  const saved = new Map();
  globalThis.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };
  const documentEvents = new Map();
  const windowEvents = new Map();
  globalThis.document = { hidden: false, addEventListener: (type, fn) => documentEvents.set(type, fn) };
  globalThis.window = { AudioContext: Context, addEventListener: (type, fn) => windowEvents.set(type, fn) };
  Object.defineProperty(globalThis, 'navigator', { value: { userActivation: { isActive: false } }, configurable: true });
  const audio = await import('./src/core/audio.js');
  audio.initAudio();
  const contextsBefore = Context.all.length;
  audio.startMusic('carrom');
  audio.playSfx('success');
  assert.equal(Context.all.length, contextsBefore, 'No context before a gesture');
  documentEvents.get('pointerdown')();
  assert.equal(Context.all.length, contextsBefore + 1);
  assert.equal(timers.size, 1);
  let changes = 0;
  const unsubscribe = audio.onAudioChange(() => changes++);
  audio.setMusicEnabled(false);
  assert.equal(timers.size, 0);
  assert.equal(saved.get('db-games:v1:audio:music'), 'false');
  audio.setMusicEnabled(true);
  assert.equal(timers.size, 1);
  audio.pauseMusic(); assert.equal(timers.size, 0);
  audio.resumeMusic(); assert.equal(timers.size, 1);
  document.hidden = true; documentEvents.get('visibilitychange')(); assert.equal(timers.size, 0);
  document.hidden = false; documentEvents.get('visibilitychange')(); assert.equal(timers.size, 1);
  const audioContext = Context.all.at(-1);
  audio.setSfxEnabled(false);
  const oscCount = audioContext.oscillators.length;
  audio.playSfx('click'); assert.equal(audioContext.oscillators.length, oscCount);
  assert.equal(timers.size, 1, 'SFX mute must leave music playing');
  assert.equal(changes, 3);
  unsubscribe();
  audio.stopMusic(); assert.equal(timers.size, 0);
  documentEvents.get('pointerdown')(); assert.equal(timers.size, 0, 'Leaving game must clear requested music');
  audio.startMusic('wordal');
  windowEvents.get('pagehide')(); assert.equal(timers.size, 0);
  saved.set('db-games:v1:audio:music', 'false');
  audio.initAudio(); audio.startMusic('wordal'); assert.equal(timers.size, 0, 'Saved mute must survive initialization');
} finally {
  globalThis.setInterval = originalInterval;
  globalThis.clearInterval = originalClear;
  globalThis.setTimeout = originalTimeout;
}
console.log('Music checks passed: five distinct ABAC arrangements, rests, pitch bounds, accompaniment variation, no autoplay, single player, clock jumps, gentle stop, independent persisted mute, visibility, pause/resume and page exit.');
