import assert from 'node:assert/strict';

const saved = new Map();
globalThis.window = {
  localStorage: {
    getItem: key => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
    removeItem: key => saved.delete(key),
  },
  DBJamDemo: { calendarDate: '2026-10-13', day: 'd1', clearGameState() {} },
};
const progression = await import('../src/systems/progression.js');
const storage = (await import('../src/core/storage.js')).default;
const { recordGamePlay, torchJourney, resetProgression, resetDailyChallenges } = progression;

resetProgression();
for (const [index, id] of ['wordal', 'niti', 'jodo', 'cricket', 'carrom'].entries()) {
  assert.equal(recordGamePlay(id).awarded, true);
  assert.equal(torchJourney().completions, index + 1);
  assert.equal(progression.getProgression().streak, 1);
}
assert.deepEqual(torchJourney(), { completions: 5, level: 2, progress: 0, goal: 5 });
assert.equal(recordGamePlay('neeti').awarded, false, 'Aliases and duplicate completions cannot earn extra bars');
window.DBJamDemo.day = 'd2';
resetDailyChallenges();
assert.equal(recordGamePlay('niti').awarded, false, 'Changing demo edition is not a new daily game');

// Fresh session data must retain earned bars and the same-day duplicate guard.
storage.clearAll();
const fresh = await import('../src/core/mashal-progress.js?fresh-visit');
assert.equal(fresh.getMashalCompletions().length, 5);
assert.equal(recordGamePlay('wordal').awarded, false);
assert.equal(torchJourney().level, 2);

resetProgression();
for (const day of [1, 2, 4, 8, 13]) {
  window.DBJamDemo.calendarDate = `2026-10-${String(day).padStart(2, '0')}`;
  resetDailyChallenges();
  assert.equal(recordGamePlay('wordal').awarded, true);
  assert.equal(recordGamePlay('wordal').awarded, false);
}
assert.deepEqual(torchJourney(), { completions: 5, level: 2, progress: 0, goal: 5 });
assert.equal(progression.getProgression().streak, 1, 'Gaps affect the streak but preserve Mashal progress');
resetProgression();
assert.deepEqual(torchJourney(), { completions: 0, level: 1, progress: 0, goal: 5 });
assert.equal(saved.size, 0);

// Blocked storage still permits progress for the current visit.
window.localStorage.setItem = () => { throw new Error('Blocked'); };
assert.equal(recordGamePlay('wordal').awarded, true);
assert.equal(recordGamePlay('niti').awarded, true);
assert.equal(torchJourney().progress, 2);
assert.equal(recordGamePlay('wordal').awarded, false);
console.log('PASS: five games today, one game across five days, gaps, aliases, replays, demo editions, persistence, reset, storage fallback.');
