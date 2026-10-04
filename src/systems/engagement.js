/* ============================================================
   Engagement System
   Achievements, sharing, notification hooks
   ============================================================ */

import storage from '../core/storage.js';
import { bus, Events } from '../core/events.js';
import { t } from '../i18n/index.js';

const ACH_KEY = 'achievements';

/**
 * @typedef {Object} Achievement
 * @property {string} id
 * @property {string} icon
 * @property {string} titleKey   - i18n key for title
 * @property {string} descKey    - i18n key for description
 * @property {Function} check    - (stats) => boolean
 */

/** Achievement definitions */
const ACHIEVEMENTS = [
  {
    id: 'first_game',
    icon: '🎮',
    titleKey: 'ach.first_game',
    descKey: 'ach.first_game_desc',
    check: (stats) => stats.gamesPlayed >= 1,
  },
  {
    id: 'streak_3',
    icon: '🔥',
    titleKey: 'ach.streak_3',
    descKey: 'ach.streak_3_desc',
    check: (stats) => stats.longestStreak >= 3,
  },
  {
    id: 'streak_7',
    icon: '⚡',
    titleKey: 'ach.streak_7',
    descKey: 'ach.streak_7_desc',
    check: (stats) => stats.longestStreak >= 7,
  },
  {
    id: 'streak_30',
    icon: '👑',
    titleKey: 'ach.streak_30',
    descKey: 'ach.streak_30_desc',
    check: (stats) => stats.longestStreak >= 30,
  },
  {
    id: 'level_5',
    icon: '⭐',
    titleKey: 'ach.level_5',
    descKey: 'ach.level_5_desc',
    check: (stats) => stats.level >= 5,
  },
  {
    id: 'level_10',
    icon: '🌟',
    titleKey: 'ach.level_10',
    descKey: 'ach.level_10_desc',
    check: (stats) => stats.level >= 10,
  },
  {
    id: 'games_10',
    icon: '🏅',
    titleKey: 'ach.games_10',
    descKey: 'ach.games_10_desc',
    check: (stats) => stats.gamesPlayed >= 10,
  },
  {
    id: 'games_50',
    icon: '🏆',
    titleKey: 'ach.games_50',
    descKey: 'ach.games_50_desc',
    check: (stats) => stats.gamesPlayed >= 50,
  },
  {
    id: 'score_1000',
    icon: '💎',
    titleKey: 'ach.score_1000',
    descKey: 'ach.score_1000_desc',
    check: (stats) => stats.totalScore >= 1000,
  },
  {
    id: 'score_10000',
    icon: '💰',
    titleKey: 'ach.score_10000',
    descKey: 'ach.score_10000_desc',
    check: (stats) => stats.totalScore >= 10000,
  },
  {
    id: 'all_daily',
    icon: '✨',
    titleKey: 'ach.all_daily',
    descKey: 'ach.all_daily_desc',
    check: (stats) => {
      const completed = Object.keys(stats.dailyCompleted || {});
      return completed.length >= 5;
    },
  },
];

// Achievement translations (added dynamically to avoid circular deps)
const ACH_TRANSLATIONS = {
  en: {
    'ach.first_game':       'First Steps',
    'ach.first_game_desc':  'Play your first game',
    'ach.streak_3':         'On Fire',
    'ach.streak_3_desc':    '3-day playing streak',
    'ach.streak_7':         'Week Warrior',
    'ach.streak_7_desc':    '7-day playing streak',
    'ach.streak_30':        'Monthly Master',
    'ach.streak_30_desc':   '30-day playing streak',
    'ach.level_5':          'Rising Star',
    'ach.level_5_desc':     'Reach Level 5',
    'ach.level_10':         'Veteran',
    'ach.level_10_desc':    'Reach Level 10',
    'ach.games_10':         'Dedicated',
    'ach.games_10_desc':    'Play 10 games',
    'ach.games_50':         'Champion',
    'ach.games_50_desc':    'Play 50 games',
    'ach.score_1000':       'High Scorer',
    'ach.score_1000_desc':  'Earn 1,000 total points',
    'ach.score_10000':      'Legend',
    'ach.score_10000_desc': 'Earn 10,000 total points',
    'ach.all_daily':        'Daily Devotee',
    'ach.all_daily_desc':   'Complete all 5 daily challenges',
  },
  hi: {
    'ach.first_game':       'पहला कदम',
    'ach.first_game_desc':  'अपना पहला गेम खेलें',
    'ach.streak_3':         'जोश में',
    'ach.streak_3_desc':    '3 दिन की लगातार स्ट्रीक',
    'ach.streak_7':         'हफ़्ते का योद्धा',
    'ach.streak_7_desc':    '7 दिन की लगातार स्ट्रीक',
    'ach.streak_30':        'महीने का मास्टर',
    'ach.streak_30_desc':   '30 दिन की लगातार स्ट्रीक',
    'ach.level_5':          'उभरता सितारा',
    'ach.level_5_desc':     'लेवल 5 तक पहुँचें',
    'ach.level_10':         'अनुभवी',
    'ach.level_10_desc':    'लेवल 10 तक पहुँचें',
    'ach.games_10':         'समर्पित',
    'ach.games_10_desc':    '10 गेम खेलें',
    'ach.games_50':         'चैंपियन',
    'ach.games_50_desc':    '50 गेम खेलें',
    'ach.score_1000':       'शीर्ष स्कोरर',
    'ach.score_1000_desc':  '1,000 कुल अंक अर्जित करें',
    'ach.score_10000':      'लीजेंड',
    'ach.score_10000_desc': '10,000 कुल अंक अर्जित करें',
    'ach.all_daily':        'दैनिक भक्त',
    'ach.all_daily_desc':   'सभी 5 दैनिक चुनौतियाँ पूरी करें',
  },
};

/**
 * Get achievement translations (for merging into i18n).
 */
export function getAchievementTranslations() {
  return ACH_TRANSLATIONS;
}

/**
 * Get all achievement definitions.
 */
export function getAchievementDefs() {
  return ACHIEVEMENTS;
}

/**
 * Get unlocked achievement IDs.
 * @returns {Set<string>}
 */
export function getUnlockedAchievements() {
  const unlocked = storage.get(ACH_KEY, []);
  return new Set(unlocked);
}

/**
 * Check and unlock achievements based on current stats.
 * @param {Object} stats - progression data
 * @returns {Achievement[]} newly unlocked
 */
export function checkAchievements(stats) {
  const unlocked = getUnlockedAchievements();
  const newlyUnlocked = [];

  for (const ach of ACHIEVEMENTS) {
    if (!unlocked.has(ach.id) && ach.check(stats)) {
      unlocked.add(ach.id);
      newlyUnlocked.push(ach);
      bus.emit(Events.ACHIEVEMENT_UNLOCK, { achievement: ach });
    }
  }

  if (newlyUnlocked.length > 0) {
    storage.set(ACH_KEY, [...unlocked]);
  }

  return newlyUnlocked;
}

/**
 * Share game result via Web Share API or clipboard fallback.
 * @param {Object} params
 * @param {string} params.gameTitle
 * @param {number} params.score
 * @param {string} [params.url]
 */
export async function shareResult({ gameTitle, score, url = window.location.href }) {
  const text = t('gameover.share_text', { score, game: gameTitle });

  if (navigator.share) {
    try {
      await navigator.share({ title: 'Dainik Bhaskar Game Lab', text, url });
      bus.emit(Events.SHARE_RESULT, { gameTitle, score, method: 'native' });
      return true;
    } catch {
      // User cancelled or error
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    bus.emit(Events.SHARE_RESULT, { gameTitle, score, method: 'clipboard' });
    bus.emit(Events.TOAST_SHOW, {
      message: 'Copied to clipboard! 📋',
      icon: '📋',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Reset all engagement data.
 */
export function resetEngagement() {
  storage.set(ACH_KEY, []);
}

export default {
  getAchievementDefs, getUnlockedAchievements,
  checkAchievements, shareResult, resetEngagement,
  getAchievementTranslations,
};
