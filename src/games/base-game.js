/* ============================================================
   BaseGame — Abstract base class all games must extend
   Provides lifecycle hooks, scoring, and platform integration
   ============================================================ */

import { bus, Events } from '../core/events.js';
import { playSfx } from '../core/audio.js';
import { navigate } from '../core/router.js';
import { submitScore, getPlayerBest } from '../systems/leaderboard.js';
import { updateStreak, recordGamePlay } from '../systems/progression.js';
import { checkAchievements, shareResult } from '../systems/engagement.js';
import { getProgression } from '../systems/progression.js';
import { renderGameOver } from '../ui/components.js';
import { t } from '../i18n/index.js';

/**
 * @abstract
 * Base class for all games. Extend this and implement the required methods.
 *
 * Lifecycle:
 *   1. constructor(container, config) — called by router
 *   2. init()       — set up DOM, load assets
 *   3. start()      — begin gameplay
 *   4. pause()      — user switched tabs / opened menu
 *   5. resume()     — user came back
 *   6. end(score)   — game is over, trigger scoring flow
 *   7. destroy()    — clean up everything
 */
export class BaseGame {
  /**
   * @param {HTMLElement} container - The screen element to render into
   * @param {Object} config - Game configuration
   * @param {string} config.id - Unique game identifier
   * @param {string} config.titleKey - i18n key for game title
   * @param {string} config.icon - Emoji icon for the game
   */
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.id = config.id;
    this.titleKey = config.titleKey;
    this.icon = config.icon;

    this.score = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;

    // Create game area
    this._gameArea = document.createElement('div');
    this._gameArea.className = 'game-area';
    this._gameArea.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    `;

    this._cleanupFns = [];
  }

  /**
   * Initialize the game — set up DOM, assets, initial state.
   * @abstract
   */
  async init() {
    // Render the game header (back button + title + score)
    this.container.innerHTML = `
      <div class="screen-header">
        <button class="screen-header__back" id="game-back-btn">←</button>
        <h1 class="screen-header__title">${this.icon} ${t(this.titleKey)}</h1>
        <div class="screen-header__action" id="game-score-display">
          ${t('common.score')}: <strong id="game-score-value">0</strong>
        </div>
      </div>
    `;

    this.container.appendChild(this._gameArea);

    // Back button handler
    const backBtn = this.container.querySelector('#game-back-btn');
    backBtn.addEventListener('click', () => {
      this.destroy();
      navigate('/');
    });

    // Visibility change handler (pause on tab switch)
    const visHandler = () => {
      if (document.hidden && this.isRunning && !this.isPaused) {
        this.pause();
      } else if (!document.hidden && this.isRunning && this.isPaused) {
        this.resume();
      }
    };
    document.addEventListener('visibilitychange', visHandler);
    this._cleanupFns.push(() => document.removeEventListener('visibilitychange', visHandler));

    bus.emit(Events.GAME_LOADED, { gameId: this.id });
  }

  /**
   * Start the game — begin gameplay loop.
   * @abstract
   */
  start() {
    this.score = 0;
    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now();
    this._updateScoreDisplay();

    updateStreak();
    bus.emit(Events.GAME_STARTED, { gameId: this.id });
    playSfx('success');
  }

  /**
   * Pause the game.
   */
  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    bus.emit(Events.GAME_PAUSED, { gameId: this.id });
  }

  /**
   * Resume the game.
   */
  resume() {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    bus.emit(Events.GAME_RESUMED, { gameId: this.id });
  }

  /**
   * End the game and trigger scoring flow.
   * @param {number} [finalScore] - Override score (otherwise uses this.score)
   */
  end(finalScore) {
    if (!this.isRunning) return;

    const score = finalScore ?? this.score;
    this.isRunning = false;
    this.isPaused = false;

    const bestScore = getPlayerBest(this.id);
    const { rank, isNewBest } = submitScore(this.id, 'Player', score);

    recordGamePlay(this.id, score);

    // Check achievements
    const stats = getProgression();
    checkAchievements(stats);

    playSfx(isNewBest ? 'levelup' : 'gameover');
    bus.emit(Events.GAME_ENDED, { gameId: this.id, score, rank, isNewBest });

    // Show game-over modal
    renderGameOver({
      score,
      bestScore: isNewBest ? score : bestScore,
      isNewBest,
      rank,
      gameTitle: t(this.titleKey),
      onPlayAgain: () => {
        this._gameArea.innerHTML = '';
        this.start();
        this.onStart();
      },
      onHome: () => {
        this.destroy();
        navigate('/');
      },
      onShare: () => {
        shareResult({ gameTitle: t(this.titleKey), score });
      },
    });
  }

  /**
   * Add points to the score.
   * @param {number} points
   */
  addScore(points) {
    this.score += points;
    this._updateScoreDisplay();
    bus.emit(Events.GAME_SCORE_UPDATE, { gameId: this.id, score: this.score });
    playSfx('score');
  }

  /**
   * Update the score display in the header.
   */
  _updateScoreDisplay() {
    const el = this.container.querySelector('#game-score-value');
    if (el) el.textContent = this.score;
  }

  /**
   * Get the game area element (where you render game content).
   * @returns {HTMLElement}
   */
  getGameArea() {
    return this._gameArea;
  }

  /**
   * Clean up — remove listeners, cancel timers, etc.
   * Override this but call super.destroy().
   */
  destroy() {
    this.isRunning = false;
    this.isPaused = false;

    for (const fn of this._cleanupFns) {
      try { fn(); } catch {}
    }
    this._cleanupFns = [];
  }

  /**
   * Called when "Play Again" is pressed. Override to reset game state.
   * @abstract
   */
  onStart() {
    // Override in subclass
  }
}

export default BaseGame;
