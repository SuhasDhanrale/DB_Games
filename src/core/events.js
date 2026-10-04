/* ============================================================
   EventBus — Lightweight pub/sub for decoupled communication
   ============================================================ */

class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this._listeners = new Map();
  }

  /**
   * Subscribe to an event.
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} unsubscribe function
   */
  on(event, callback) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  /**
   * Subscribe once — auto-removes after first fire.
   */
  once(event, callback) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      callback(...args);
    };
    return this.on(event, wrapper);
  }

  /**
   * Unsubscribe from an event.
   */
  off(event, callback) {
    const set = this._listeners.get(event);
    if (set) {
      set.delete(callback);
      if (set.size === 0) this._listeners.delete(event);
    }
  }

  /**
   * Emit an event with optional data.
   */
  emit(event, data) {
    const set = this._listeners.get(event);
    if (set) {
      for (const cb of set) {
        try {
          cb(data);
        } catch (err) {
          console.error(`[EventBus] Error in listener for "${event}":`, err);
        }
      }
    }
  }

  /**
   * Remove all listeners (for cleanup).
   */
  clear() {
    this._listeners.clear();
  }
}

/** Singleton global event bus */
export const bus = new EventBus();

/* ---- Well-known event names ---- */
export const Events = {
  // Language
  LANG_CHANGED:       'lang:changed',

  // Navigation
  NAVIGATE:           'nav:navigate',
  SCREEN_ENTERED:     'nav:screen:entered',
  SCREEN_EXITED:      'nav:screen:exited',

  // Game lifecycle
  GAME_LOADED:        'game:loaded',
  GAME_STARTED:       'game:started',
  GAME_PAUSED:        'game:paused',
  GAME_RESUMED:       'game:resumed',
  GAME_ENDED:         'game:ended',
  GAME_SCORE_UPDATE:  'game:score:update',

  // Progression
  STREAK_UPDATED:     'progression:streak',
  XP_GAINED:          'progression:xp',
  LEVEL_UP:           'progression:levelup',
  DAILY_COMPLETED:    'progression:daily:complete',

  // Leaderboard
  LB_SCORE_SUBMITTED: 'leaderboard:submitted',
  LB_REFRESHED:       'leaderboard:refreshed',

  // Engagement
  ACHIEVEMENT_UNLOCK: 'engagement:achievement',
  SHARE_RESULT:       'engagement:share',

  // UI
  TOAST_SHOW:         'ui:toast:show',
  MODAL_OPEN:         'ui:modal:open',
  MODAL_CLOSE:        'ui:modal:close',
};

export default EventBus;
