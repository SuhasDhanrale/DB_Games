import { MUSIC_TRACKS, canonicalMusicId, musicTrackUrl } from './music-tracks.js';

function holdGain(param, now) {
  if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
  else {
    const current = param.value;
    param.cancelScheduledValues(now);
    param.setValueAtTime(current, now);
  }
}

/* Stream one locally hosted recording. Web Audio supplies smooth fades while
   the browser handles decoding and looping; no synthesized melody is used. */
export class MusicPlayer {
  constructor(context, onChange = () => {}) {
    this.context = context;
    this.onChange = onChange;
    this.run = null;
    this.volume = 0.18;
    this.state = 'idle';
    this.positions = new Map();
  }

  setState(state) { this.state = state; this.onChange(); }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, Number(value) || 0));
    if (this.run && this.state === 'playing') {
      holdGain(this.run.gain.gain, this.context.currentTime);
      this.run.gain.gain.setTargetAtTime(this.volume * this.run.track.level, this.context.currentTime, 0.04);
    }
  }

  play(id) {
    id = canonicalMusicId(id);
    const track = MUSIC_TRACKS[id];
    if (!track) { this.stop(); return; }
    if (this.run?.id === id) return;
    this.stop();
    const element = new Audio(musicTrackUrl(track));
    element.loop = true;
    element.preload = 'none';
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, this.context.currentTime);
    const source = this.context.createMediaElementSource(element);
    source.connect(gain);
    gain.connect(this.context.destination);
    const run = { id, track, element, source, gain };
    this.run = run;
    this.setState('loading');
    element.addEventListener('loadedmetadata', () => {
      const position = this.positions.get(id) || 0;
      if (this.run === run && Number.isFinite(element.duration) && position < element.duration) element.currentTime = position;
    }, { once: true });
    const fail = () => {
      if (this.run !== run) return;
      this.stop();
      this.setState('error');
    };
    element.addEventListener('error', fail, { once: true });
    element.play().then(() => {
      if (this.run !== run) { element.pause(); return; }
      gain.gain.setValueAtTime(0, this.context.currentTime);
      gain.gain.linearRampToValueAtTime(this.volume * track.level, this.context.currentTime + 0.8);
      this.setState('playing');
    }).catch(fail);
  }

  stop() {
    const run = this.run;
    if (!run) return;
    this.run = null;
    this.positions.set(run.id, run.element.currentTime || 0);
    const now = this.context.currentTime;
    holdGain(run.gain.gain, now);
    run.gain.gain.setTargetAtTime(0, now, 0.035);
    setTimeout(() => {
      run.element.pause();
      run.element.removeAttribute('src');
      run.element.load();
      run.source.disconnect();
      run.gain.disconnect();
    }, 220);
    this.setState('idle');
  }
}
