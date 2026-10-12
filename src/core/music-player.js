import { createMusicCycle, midiFrequency, canonicalMusicId, MUSIC_SCORES } from './music-score.js';

/* Schedule a short horizon on the audio clock; never use a timer per note.
   A separate graph per run allows fade-out without leaking scheduled notes. */
export class MusicPlayer {
  constructor(context) {
    this.context = context;
    this.run = null;
  }

  play(id) {
    id = canonicalMusicId(id);
    if (!MUSIC_SCORES[id]) { this.stop(); return; }
    if (this.run?.id === id) return;
    this.stop();
    const ctx = this.context;
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1500;
    filter.Q.value = 0.5;
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 1.2);
    filter.connect(master);
    master.connect(ctx.destination);
    const run = { id, master, filter, voices: new Set(), cycle: 0, index: 0, start: ctx.currentTime + 0.08, score: createMusicCycle(id), timer: null };
    this.run = run;
    const tick = () => {
      if (this.run !== run || ctx.state !== 'running') return;
      // Background throttling must never dump a queue of missed notes at once.
      if (ctx.currentTime > run.start + run.score.duration) {
        run.start = ctx.currentTime + 0.08;
        run.score = createMusicCycle(id, ++run.cycle);
        run.index = 0;
      }
      while (run.index < run.score.events.length && run.start + run.score.events[run.index].time < ctx.currentTime + 0.2) {
        const note = run.score.events[run.index++];
        const when = run.start + note.time;
        if (when >= ctx.currentTime) this.scheduleNote(run, note, when);
      }
    };
    tick();
    run.timer = setInterval(tick, 50);
  }

  scheduleNote(run, note, when) {
    const ctx = this.context;
    const osc = ctx.createOscillator();
    const envelope = ctx.createGain();
    // Smooth sine partials provide colour without a buzzy square/sawtooth edge.
    const harmonics = note.tone === 'bell' ? [0, 1, 0.12, 0.025] : note.tone === 'pluck' ? [0, 1, 0.08, 0.035] : [0, 1, 0.035];
    osc.setPeriodicWave(ctx.createPeriodicWave(new Float32Array(harmonics.length), new Float32Array(harmonics)));
    osc.frequency.setValueAtTime(midiFrequency(note.midi), when);
    const backing = note.voice === 'backing';
    const peak = (backing ? 0.04 : 0.13) * note.level;
    const attack = backing ? 0.18 : note.tone === 'warm' ? 0.08 : 0.035;
    const hold = Math.max(attack + 0.04, note.duration * (note.tone === 'pluck' ? 0.58 : 0.78));
    const end = when + hold + (backing ? 0.5 : 0.28);
    envelope.gain.setValueAtTime(0, when);
    envelope.gain.linearRampToValueAtTime(peak, when + attack);
    envelope.gain.exponentialRampToValueAtTime(peak * 0.4, when + hold);
    envelope.gain.exponentialRampToValueAtTime(0.0001, end - 0.015);
    envelope.gain.linearRampToValueAtTime(0, end);
    osc.connect(envelope);
    envelope.connect(run.filter);
    run.voices.add(osc);
    osc.onended = () => { osc.disconnect(); envelope.disconnect(); run.voices.delete(osc); };
    osc.start(when);
    osc.stop(end);
  }

  stop() {
    const run = this.run;
    if (!run) return;
    this.run = null;
    clearInterval(run.timer);
    const now = this.context.currentTime;
    if (run.master.gain.cancelAndHoldAtTime) run.master.gain.cancelAndHoldAtTime(now);
    else {
      const currentGain = run.master.gain.value;
      run.master.gain.cancelScheduledValues(now);
      run.master.gain.setValueAtTime(currentGain, now);
    }
    run.master.gain.setTargetAtTime(0, now, 0.035);
    for (const osc of run.voices) {
      try { osc.stop(now + 0.18); } catch { /* Already ended. */ }
    }
    setTimeout(() => { run.filter.disconnect(); run.master.disconnect(); }, 220);
  }
}
