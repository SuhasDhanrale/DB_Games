/* ============================================================
   Progression System
   Streaks, XP, Levels, Daily Challenges
   ============================================================ */

import storage from '../core/storage.js';
import { bus, Events } from '../core/events.js';

const PROG_KEY = 'progression';

/**
 * @typedef {Object} ProgressionData
 * @property {number} xp             - Total XP earned
 * @property {number} level          - Current level
 * @property {number} streak         - Current daily streak
 * @property {number} longestStreak  - Longest ever streak
 * @property {string} lastPlayDate   - ISO date of last play (YYYY-MM-DD)
 * @property {number} gamesPlayed    - Total games played
 * @property {number} totalScore     - Cumulative score
 * @property {Object<string, boolean>} dailyCompleted - gameId → completed today
 */

/** XP required per level (cumulative) */
const LEVEL_THRESHOLDS = [
  0,      // Level 1 (start)
  100,    // Level 2
  300,    // Level 3
  600,    // Level 4
  1000,   // Level 5
  1500,   // Level 6
  2200,   // Level 7
  3000,   // Level 8
  4000,   // Level 9
  5200,   // Level 10
  6600,   // Level 11
  8200,   // Level 12
  10000,  // Level 13
  12000,  // Level 14
  14500,  // Level 15
  17500,  // Level 16
  21000,  // Level 17
  25000,  // Level 18
  30000,  // Level 19
  36000,  // Level 20
];

/** XP reward rules */
const XP_REWARDS = {
  GAME_PLAYED:        10,
  GAME_COMPLETED:     25,
  DAILY_COMPLETED:    50,
  HIGH_SCORE:         40,
  STREAK_BONUS_BASE:  15,  // ×streak count
};

/**
 * Get default progression data.
 * @returns {ProgressionData}
 */
function getDefaults() {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    lastPlayDate: '',
    gamesPlayed: 0,
    totalScore: 0,
    dailyCompleted: {},
  };
}

/**
 * Load progression data.
 * @returns {ProgressionData}
 */
export function getProgression() {
  return storage.getOrInit(PROG_KEY, getDefaults());
}

/**
 * Save progression data.
 * @param {ProgressionData} data
 */
function saveProgression(data) {
  storage.set(PROG_KEY, data);
}

/**
 * Get today's date string (YYYY-MM-DD).
 */
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get yesterday's date string.
 */
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

/**
 * Update streak based on current play.
 * Should be called when a game session begins.
 */
export function updateStreak() {
  const data = getProgression();
  const today = todayStr();

  if (data.lastPlayDate === today) {
    // Already played today, streak is current
    return data.streak;
  }

  if (data.lastPlayDate === yesterdayStr()) {
    // Played yesterday — continue streak
    data.streak += 1;
  } else if (data.lastPlayDate && data.lastPlayDate !== today) {
    // Missed a day — reset streak
    bus.emit(Events.STREAK_UPDATED, { streak: 0, lost: true });
    data.streak = 1;
  } else {
    // First play ever
    data.streak = 1;
  }

  data.lastPlayDate = today;
  data.longestStreak = Math.max(data.longestStreak, data.streak);

  saveProgression(data);
  bus.emit(Events.STREAK_UPDATED, { streak: data.streak, lost: false });

  return data.streak;
}

/**
 * Award XP and check for level-up.
 * @param {number} amount
 * @param {string} [reason]
 */
export function awardXP(amount, reason = '') {
  const data = getProgression();
  data.xp += amount;

  // Check level up
  const oldLevel = data.level;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (data.xp >= LEVEL_THRESHOLDS[i]) {
      data.level = i + 1;
      break;
    }
  }

  saveProgression(data);
  bus.emit(Events.XP_GAINED, { amount, total: data.xp, reason });

  if (data.level > oldLevel) {
    bus.emit(Events.LEVEL_UP, { level: data.level, prevLevel: oldLevel });
  }

  return { xp: data.xp, level: data.level, leveledUp: data.level > oldLevel };
}

/**
 * Record a game play session.
 * @param {string} gameId
 * @param {number} score
 * @param {boolean} [isDaily=false]
 */
export function recordGamePlay(gameId, score, isDaily = false) {
  const data = getProgression();

  data.gamesPlayed += 1;
  data.totalScore += score;

  saveProgression(data);

  // Award XP
  awardXP(XP_REWARDS.GAME_PLAYED, 'game_played');
  awardXP(XP_REWARDS.GAME_COMPLETED, 'game_completed');

  // Streak bonus
  if (data.streak > 1) {
    awardXP(XP_REWARDS.STREAK_BONUS_BASE * data.streak, 'streak_bonus');
  }

  // Daily challenge completion
  if (isDaily && !data.dailyCompleted[gameId]) {
    data.dailyCompleted[gameId] = true;
    saveProgression(data);
    awardXP(XP_REWARDS.DAILY_COMPLETED, 'daily_completed');
    bus.emit(Events.DAILY_COMPLETED, { gameId });
  }
}

/**
 * Check if a game's daily challenge is completed.
 * @param {string} gameId
 * @returns {boolean}
 */
export function isDailyCompleted(gameId) {
  const data = getProgression();
  return !!data.dailyCompleted[gameId];
}

/**
 * Get XP needed for next level.
 * @returns {{ current: number, next: number, progress: number }}
 */
export function getLevelProgress() {
  const data = getProgression();
  const currentThreshold = LEVEL_THRESHOLDS[data.level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[data.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 5000;

  const progress = (data.xp - currentThreshold) / (nextThreshold - currentThreshold);

  return {
    current: data.xp - currentThreshold,
    next: nextThreshold - currentThreshold,
    progress: Math.min(Math.max(progress, 0), 1),
  };
}

/**
 * Reset daily challenges (call at midnight).
 */
export function resetDailyChallenges() {
  const data = getProgression();
  const today = todayStr();
  const lastReset = storage.get('prog:last_daily_reset', '');

  if (lastReset !== today) {
    data.dailyCompleted = {};
    saveProgression(data);
    storage.set('prog:last_daily_reset', today);
  }
}

/**
 * Get time until next daily reset (midnight).
 * @returns {string} formatted time string
 */
export function getTimeUntilDailyReset() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  return `${hours}h ${minutes}m`;
}

/**
 * Full reset (for settings).
 */
export function resetProgression() {
  storage.set(PROG_KEY, getDefaults());
}

export default {
  getProgression, updateStreak, awardXP, recordGamePlay,
  isDailyCompleted, getLevelProgress, resetDailyChallenges,
  getTimeUntilDailyReset, resetProgression,
};
