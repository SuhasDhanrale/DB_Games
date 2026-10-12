import storage from '../core/storage.js';
import { canonicalGameId, todayStr } from './progression.js';

export const getPlayHistory = () => storage.get('play-history', []);

// The first daily result is immutable; replays and spoiled puzzles are practice.
export function recordResult(gameId, score, details = {}) {
  const id = canonicalGameId(gameId);
  const history = getPlayHistory();
  const edition = /^d[123]$/.test(details.edition) ? details.edition : window.DBJamDemo.day;
  const date = todayStr();
  const key = `${date}:${edition}:${id}`;
  const first = history.find(entry => entry.key === key && entry.mode === 'daily');
  // Restoring a completed result must not create a practice attempt.
  if (details.restored && first) return { firstResult: false, mode: 'daily' };
  const mode = details.mode === 'practice' || first ? 'practice' : 'daily';
  const entry = { key, gameId: id, date, edition, score: Number.isFinite(score) ? score : 0, details, mode };
  if (mode === 'daily') history.push(entry);
  else {
    const practice = history.find(item => item.key === key && item.mode === 'practice' && (item.details.role || '') === (details.role || '') && (item.details.matchId || '') === (details.matchId || ''));
    if (practice) {
      const best = practice.bestDetails || practice.details;
      const improved = id === 'carrom' ? details.shots < best.shots : id === 'cricket' ? (details.role === 'BOWLING' ? details.runs < best.runs : details.runs > best.runs) : false;
      Object.assign(practice, entry, { bestDetails: improved ? details : best });
    }
    else history.push(entry);
  }
  storage.set('play-history', history.slice(-180));
  return { firstResult: mode === 'daily', mode };
}

export function readRound(gameId) {
  const keys = { wordal: 'db-jam:v2:wordal:', niti: 'db-jam:v2:niti:', jodo: 'db-jam:v2:jodo:', cricket: 'db-jam:v2:cricket:', carrom: 'db-jam:v2:carrom:' };
  try { return JSON.parse(window.DBJamDemo.getItem(keys[gameId] + window.DBJamDemo.day) || 'null'); } catch { return null; }
}
