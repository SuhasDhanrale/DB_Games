import assert from 'node:assert/strict';

const nodes = [];
class Param {
  setValueAtTime() {}
  linearRampToValueAtTime() {}
  exponentialRampToValueAtTime() {}
}
class Node {
  frequency = new Param();
  gain = new Param();
  connect() {}
  disconnect() {}
  start(time) { this.startTime = time; }
  stop(time) { this.stopTime = time; }
}
class Context {
  static instance;
  currentTime = 10;
  state = 'suspended';
  destination = {};
  constructor() { Context.instance = this; }
  createGain() { return new Node(); }
  createOscillator() { const node = new Node(); nodes.push(node); return node; }
  async resume() { await Promise.resolve(); this.state = 'running'; }
}
globalThis.document = { hidden: false, addEventListener() {} };
globalThis.window = { AudioContext: Context, addEventListener() {} };
Object.defineProperty(globalThis, 'navigator', {
  value: { userActivation: { isActive: true } }, configurable: true,
});

const audio = await import('../src/core/audio.js');
audio.initAudio();
assert.equal(audio.isMusicEnabled(), false);
audio.playSfx('completion');
await new Promise(resolve => setImmediate(resolve));
assert.equal(nodes.length, 4, 'First sound waits for context resume and plays all four notes');
assert.deepEqual(nodes.map(node => node.startTime), [10, 10.16, 10.32, 10.48]);
assert.ok(nodes.at(-1).stopTime > 10.8, 'Jingle lasts long enough to be distinct from a tap');
assert.equal(audio.getMusicStatus(), 'idle', 'Completion does not enable background music');
audio.setSfxEnabled(false);
audio.playSfx('completion');
assert.equal(nodes.length, 4, 'Mute prevents the completion jingle');
audio.setSfxEnabled(true);
audio.playSfx('tap');
assert.equal(nodes.length, 5, 'Existing tap still plays one note');
Context.instance.state = 'suspended';
audio.playSfx('completion');
audio.setSfxEnabled(false);
await new Promise(resolve => setImmediate(resolve));
assert.equal(nodes.length, 5, 'Muting during resume prevents queued playback');
console.log('Completion audio passed: four notes, context resume, mute, existing taps, background music off.');
