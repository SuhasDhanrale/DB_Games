import storage from '../core/storage.js';
import { bus, Events } from '../core/events.js';
import { getMashalCompletions, awardMashalCompletion, resetMashalCompletions } from '../core/mashal-progress.js';

const PROG_KEY = 'progression';
const aliases = { neeti: 'niti', superover: 'cricket', carrom_puzzles: 'carrom' };
export const canonicalGameId = id => aliases[id] || id;
export const todayStr = () => window.DBJamDemo.calendarDate;
const defaults = () => ({ streak: 0, longestStreak: 0, lastPlayDate: '', gamesPlayed: 0, dailyCompleted: {}, dailyHistory: {} });
export function getProgression() {
  return { ...storage.getOrInit(PROG_KEY, defaults()), completions: getMashalCompletions().length };
}
// Levels represent cumulative participation, separate from consecutive-day streaks.
export function torchJourney(data = getProgression()) {
  const completions = data.completions ?? 0;
  return { completions, level: Math.floor(completions / 5) + 1, progress: completions % 5, goal: 5 };
}
function save(data) { storage.set(PROG_KEY, data); }
export function updateStreak() {
  const data = getProgression();
  const today = todayStr();
  if (data.lastPlayDate === today) return data.streak;
  const yesterday = new Date(today + 'T12:00:00Z');
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  data.streak = data.lastPlayDate === yesterday.toISOString().slice(0, 10) ? data.streak + 1 : 1;
  data.longestStreak = Math.max(data.longestStreak, data.streak);
  data.lastPlayDate = today;
  data.dailyHistory[today] = true;
  save(data);
  bus.emit(Events.STREAK_UPDATED, { streak: data.streak, lost: false });
  return data.streak;
}
export function recordGamePlay(gameId) {
  const firstCompletion = getProgression().lastPlayDate !== todayStr();
  updateStreak();
  const data = getProgression();
  const id = canonicalGameId(gameId);
  if (!data.dailyCompleted[id]) data.gamesPlayed += 1;
  data.dailyCompleted[id] = true;
  const awarded = awardMashalCompletion(todayStr(), id);
  save(data);
  bus.emit(Events.DAILY_COMPLETED, { gameId: id });
  return { firstCompletion, awarded, streak: data.streak };
}
export function isDailyCompleted(gameId) { return Boolean(getProgression().dailyCompleted[canonicalGameId(gameId)]); }
export function isDateCompleted(date) { return Boolean(getProgression().dailyHistory[date]); }
export function resetDailyChallenges() {
  const key = todayStr() + ':' + window.DBJamDemo.day;
  if (storage.get('prog:last_daily_reset') !== key) {
    const data = getProgression();
    const yesterday = new Date(todayStr() + 'T12:00:00Z');
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    if (data.lastPlayDate && data.lastPlayDate < yesterday.toISOString().slice(0, 10)) data.streak = 0;
    data.dailyCompleted = Object.fromEntries(storage.get('play-history', []).filter(entry => entry.date === todayStr() && entry.edition === window.DBJamDemo.day && entry.mode === 'daily').map(entry => [entry.gameId, true]));
    save(data);
    storage.set('prog:last_daily_reset', key);
  }
}
export function resetProgression() {
  resetMashalCompletions();
  storage.set(PROG_KEY, defaults());
  storage.remove('play-history');
  storage.remove('torch:pending_hub');
  storage.remove('torch:introduced');
  window.DBJamDemo.clearGameState();
}
export default { getProgression, updateStreak, recordGamePlay, isDailyCompleted, isDateCompleted, resetDailyChallenges, resetProgression, todayStr };
