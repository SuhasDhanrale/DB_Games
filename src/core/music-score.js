/* Authored, original ABAC phrases. Numbers after ':' are beats; r is a rest.
   Each section is four bars. Two quiet bars let the full arrangement breathe. */
export const MUSIC_SCORES = {
  wordal: {
    bpm: 66, tone: 'bell',
    A: ['E4:1 G4:1 A4:1 r:1', 'G4:2 E4:1 r:1', 'D4:1 E4:1 G4:1 r:1', 'E4:2 C4:1 r:1'],
    B: ['G4:1 A4:1 C5:1 r:1', 'A4:2 G4:1 r:1', 'E4:1 G4:1 D4:1 r:1', 'G4:2 r:2'],
    C: ['D4:1 E4:1 G4:1 r:1', 'A4:1 G4:1 E4:1 r:1', 'D4:2 E4:1 r:1', 'C4:2 r:2'],
    chords: [[48, 55], [45, 52], [41, 48], [48, 55]],
  },
  niti: {
    bpm: 60, tone: 'warm',
    A: ['D4:2 F#4:1 r:1', 'E4:1 D4:2 r:1', 'A3:1 D4:1 E4:1 r:1', 'F#4:2 r:2'],
    B: ['A4:2 F#4:1 r:1', 'E4:2 D4:1 r:1', 'F#4:1 A4:1 B4:1 r:1', 'A4:2 r:2'],
    C: ['F#4:1 E4:1 D4:1 r:1', 'B3:2 D4:1 r:1', 'E4:1 F#4:1 E4:1 r:1', 'D4:2 r:2'],
    chords: [[50, 57], [47, 54], [43, 50], [50, 57]],
  },
  jodo: {
    bpm: 76, tone: 'pluck',
    A: ['F4:1 A4:0.5 C5:0.5 A4:1 r:1', 'G4:1 F4:2 r:1', 'A4:1 C5:1 D5:1 r:1', 'C5:1 A4:1 r:2'],
    B: ['G4:1 A4:0.5 C5:0.5 D5:1 r:1', 'C5:2 A4:1 r:1', 'G4:1 A4:1 F4:1 r:1', 'G4:2 r:2'],
    C: ['A4:1 G4:0.5 F4:0.5 C4:1 r:1', 'F4:1 G4:1 A4:1 r:1', 'C5:1 A4:1 G4:1 r:1', 'F4:2 r:2'],
    chords: [[53, 60], [50, 57], [46, 53], [53, 60]],
  },
  carrom: {
    bpm: 68, tone: 'warm',
    A: ['G3:1 r:1 B3:1 D4:1', 'E4:1 D4:1 r:2', 'B3:1 A3:1 G3:1 r:1', 'D4:2 r:2'],
    B: ['B3:1 D4:1 E4:1 r:1', 'D4:1 B3:1 A3:1 r:1', 'G3:1 A3:1 B3:1 r:1', 'A3:2 r:2'],
    C: ['E4:1 D4:1 B3:1 r:1', 'A3:1 G3:1 r:2', 'D4:1 B3:1 A3:1 r:1', 'G3:2 r:2'],
    chords: [[43, 50], [40, 47], [36, 43], [43, 50]],
  },
  cricket: {
    bpm: 84, tone: 'pluck',
    A: ['D4:1 A3:0.5 D4:0.5 F#4:1 r:1', 'E4:1 D4:1 A3:1 r:1', 'D4:1 F#4:0.5 A4:0.5 F#4:1 r:1', 'E4:1 D4:1 r:2'],
    B: ['A4:1 F#4:0.5 E4:0.5 D4:1 r:1', 'F#4:1 A4:1 B4:1 r:1', 'A4:1 F#4:1 E4:1 r:1', 'A4:2 r:2'],
    C: ['F#4:1 E4:0.5 D4:0.5 A3:1 r:1', 'B3:1 D4:1 E4:1 r:1', 'F#4:1 E4:1 A3:1 r:1', 'D4:2 r:2'],
    chords: [[50, 57], [47, 54], [43, 50], [50, 57]],
  },
};

export const MUSIC_FORM = ['A', 'B', 'A', 'C'];
export const canonicalMusicId = id => ({ neeti: 'niti', superover: 'cricket', carrom_puzzles: 'carrom' }[id] || id);
const semitones = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export const midiFrequency = midi => 440 * 2 ** ((midi - 69) / 12);

export function parseBar(bar) {
  let beat = 0;
  const notes = bar.split(' ').map(token => {
    const [pitch, length] = token.split(':');
    const duration = Number(length);
    const match = /^([A-G])(#?)([3-5])$/.exec(pitch);
    if (!(duration > 0) || (pitch !== 'r' && !match)) throw new Error(`Invalid music note: ${token}`);
    const midi = match ? (Number(match[3]) + 1) * 12 + semitones[match[1]] + (match[2] ? 1 : 0) : null;
    const note = { beat, duration, midi };
    beat += duration;
    return note;
  });
  if (beat !== 4) throw new Error(`Music bar must contain four beats: ${bar}`);
  return notes;
}

export function createMusicCycle(id, cycle = 0) {
  const score = MUSIC_SCORES[canonicalMusicId(id)];
  if (!score) return null;
  const secondsPerBeat = 60 / score.bpm;
  const events = [];
  MUSIC_FORM.forEach((section, sectionIndex) => {
    score[section].forEach((bar, barIndex) => {
      const start = (sectionIndex * 4 + barIndex) * 4;
      parseBar(bar).forEach(({ beat, duration, midi }) => {
        if (midi !== null) events.push({ time: (start + beat) * secondsPerBeat, duration: duration * secondsPerBeat, midi, voice: 'melody', tone: score.tone, level: cycle % 2 ? 0.9 : 1 });
      });
      const chord = score.chords[barIndex];
      events.push({ time: start * secondsPerBeat, duration: 2.6 * secondsPerBeat, midi: chord[0], voice: 'backing', tone: 'warm', level: 1 });
      // Alternate the accompaniment, while keeping the authored tune intact.
      if ((barIndex + cycle) % 2 === 0) events.push({ time: (start + 2) * secondsPerBeat, duration: 1.4 * secondsPerBeat, midi: chord[1], voice: 'backing', tone: 'warm', level: 0.8 });
    });
  });
  return { events: events.sort((a, b) => a.time - b.time), duration: 72 * secondsPerBeat };
}
