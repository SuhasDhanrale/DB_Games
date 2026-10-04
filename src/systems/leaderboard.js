/* ============================================================
   Leaderboard System
   LocalStorage-backed with API-ready interface
   ============================================================ */

import storage from '../core/storage.js';
import { bus, Events } from '../core/events.js';

const LB_KEY = 'leaderboard';

/**
 * @typedef {Object} LeaderboardEntry
 * @property {string} id       - Unique player identifier
 * @property {string} name     - Display name
 * @property {number} score    - Score value
 * @property {string} gameId   - Which game the score is from
 * @property {string} date     - ISO date string
 * @property {'daily'|'weekly'|'alltime'} period
 */

/**
 * Generate dummy leaderboard data for a game.
 * @param {string} gameId
 * @returns {LeaderboardEntry[]}
 */
function generateDummyEntries(gameId) {
  const names = [
    'Aarav', 'Priya', 'Rohan', 'Sneha', 'Vikram',
    'Ananya', 'Arjun', 'Kavya', 'Rajesh', 'Meera',
    'Siddharth', 'Pooja', 'Aditya', 'Nisha', 'Kiran',
    'Rahul', 'Deepika', 'Amit', 'Sunita', 'Varun',
  ];

  return names.map((name, i) => ({
    id: `dummy-${i}`,
    name,
    score: Math.floor(Math.random() * 800 + 200) * (names.length - i),
    gameId,
    date: new Date().toISOString(),
    period: 'daily',
  })).sort((a, b) => b.score - a.score);
}

/**
 * Get leaderboard data for a game.
 * @param {string} gameId
 * @param {'daily'|'weekly'|'alltime'} [period='daily']
 * @param {number} [limit=20]
 * @returns {LeaderboardEntry[]}
 */
export function getLeaderboard(gameId, period = 'daily', limit = 20) {
  const allData = storage.get(LB_KEY, {});
  const key = `${gameId}:${period}`;
  let entries = allData[key];

  // If no entries exist, generate dummies
  if (!entries || entries.length === 0) {
    entries = generateDummyEntries(gameId);
    allData[key] = entries;
    storage.set(LB_KEY, allData);
  }

  return entries.slice(0, limit);
}

/**
 * Submit a score to the leaderboard.
 * @param {string} gameId
 * @param {string} playerName
 * @param {number} score
 * @returns {{ rank: number, isNewBest: boolean }}
 */
export function submitScore(gameId, playerName, score) {
  const allData = storage.get(LB_KEY, {});
  const periods = ['daily', 'weekly', 'alltime'];
  let bestRank = Infinity;
  let isNewBest = false;

  for (const period of periods) {
    const key = `${gameId}:${period}`;
    if (!allData[key]) {
      allData[key] = generateDummyEntries(gameId);
    }

    // Check if this is a new personal best
    const existingPlayerEntry = allData[key].find(e => e.id === 'player');
    if (!existingPlayerEntry || score > existingPlayerEntry.score) {
      isNewBest = true;
    }

    // Remove existing player entry
    allData[key] = allData[key].filter(e => e.id !== 'player');

    // Add new entry
    allData[key].push({
      id: 'player',
      name: playerName,
      score,
      gameId,
      date: new Date().toISOString(),
      period,
    });

    // Sort descending
    allData[key].sort((a, b) => b.score - a.score);

    // Find player rank
    const rank = allData[key].findIndex(e => e.id === 'player') + 1;
    bestRank = Math.min(bestRank, rank);
  }

  storage.set(LB_KEY, allData);

  bus.emit(Events.LB_SCORE_SUBMITTED, {
    gameId,
    playerName,
    score,
    rank: bestRank,
    isNewBest,
  });

  return { rank: bestRank, isNewBest };
}

/**
 * Get player's rank for a specific game.
 * @param {string} gameId
 * @param {'daily'|'weekly'|'alltime'} [period='daily']
 * @returns {number|null}
 */
export function getPlayerRank(gameId, period = 'daily') {
  const entries = getLeaderboard(gameId, period, 100);
  const idx = entries.findIndex(e => e.id === 'player');
  return idx >= 0 ? idx + 1 : null;
}

/**
 * Get player's best score for a game.
 * @param {string} gameId
 * @returns {number}
 */
export function getPlayerBest(gameId) {
  const entries = getLeaderboard(gameId, 'alltime', 100);
  const playerEntry = entries.find(e => e.id === 'player');
  return playerEntry ? playerEntry.score : 0;
}

/**
 * Reset daily leaderboards (call at midnight).
 */
export function resetDailyLeaderboards() {
  const allData = storage.get(LB_KEY, {});
  for (const key of Object.keys(allData)) {
    if (key.endsWith(':daily')) {
      delete allData[key];
    }
  }
  storage.set(LB_KEY, allData);
}

/**
 * Check and reset daily if the date has changed.
 */
export function checkDailyReset() {
  const lastReset = storage.get('lb:last_daily_reset', '');
  const today = new Date().toISOString().split('T')[0];
  if (lastReset !== today) {
    resetDailyLeaderboards();
    storage.set('lb:last_daily_reset', today);
  }
}

export default {
  getLeaderboard, submitScore, getPlayerRank,
  getPlayerBest, resetDailyLeaderboards, checkDailyReset,
};
