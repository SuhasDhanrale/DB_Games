/* ============================================================
   Game Registry — Central registry of all available games
   Each game registers itself here
   ============================================================ */

/**
 * @typedef {Object} GameRegistration
 * @property {string} id        - Unique game ID
 * @property {string} titleKey  - i18n key for title
 * @property {string} descKey   - i18n key for description
 * @property {string} icon      - Emoji icon
 * @property {string} color     - Primary color for the game card
 * @property {boolean} hasDailyChallenge
 * @property {boolean} comingSoon
 * @property {Function} create  - Factory: (container) => BaseGame instance
 */

/** @type {Map<string, GameRegistration>} */
const registry = new Map();

/**
 * Register a game.
 * @param {GameRegistration} config
 */
export function registerGame(config) {
  registry.set(config.id, config);
}

/**
 * Get a game registration by ID.
 * @param {string} id
 * @returns {GameRegistration|undefined}
 */
export function getGame(id) {
  return registry.get(id);
}

/**
 * Get all registered games.
 * @returns {GameRegistration[]}
 */
export function getAllGames() {
  return [...registry.values()];
}

/**
 * Get available (non-coming-soon) games.
 * @returns {GameRegistration[]}
 */
export function getAvailableGames() {
  return [...registry.values()].filter(g => !g.comingSoon);
}

export default { registerGame, getGame, getAllGames, getAvailableGames };
