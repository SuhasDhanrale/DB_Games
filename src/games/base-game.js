/* ============================================================
   BaseGame — Abstract base class all games must extend
   Provides lifecycle hooks, scoring, and platform integration
   ============================================================ */

import { bus, Events } from '../core/events.js';
import { playSfx } from '../core/audio.js';
import { navigate } from '../core/router.js';
import { submitScore, getPlayerBest } from '../systems/leaderboard.js';
import { recordGamePlay } from '../systems/progression.js';
import { checkAchievements, shareResult } from '../systems/engagement.js';
import { getProgression } from '../systems/progression.js';
import { renderGameOver } from '../ui/components.js';
import { prepareTorchCelebration } from '../ui/torch.js';
import { t, getLang } from '../i18n/index.js';
import '../styles/game-family.css';

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
    const themes = { neeti: 'niti', superover: 'cricket', carrom_puzzles: 'carrom' };
    this.theme = themes[this.id] || this.id;
    this.container.classList.add('game-player');
    this.container.dataset.gameTheme = this.theme;
    const isHindi = getLang() === 'hi';
    // Every game has the same navigation; counters belong to the game board.
    this.container.innerHTML = `
      <header class="family-header">
        <button type="button" class="family-header__back" id="game-back-btn" aria-label="${t('common.back')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12"/></svg>
        </button>
        <div class="family-header__identity">
          <span class="family-header__brand">${isHindi ? 'भास्कर खेल' : 'Bhaskar Games'}</span>
          <h1 class="family-header__title">${t(this.titleKey)}</h1>
        </div>
        <button type="button" class="family-header__help" id="game-rules-btn" aria-label="${isHindi ? 'कैसे खेलें' : 'How to play'}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.3 2.3 0 0 1 4.5.8c0 1.5-2.3 1.5-2.3 3M12 16h.01"/></svg>
          ${isHindi ? 'कैसे खेलें' : 'How to play'}
        </button>
      </header>
    `;

    this.container.appendChild(this._gameArea);

    // Back button handler
    const backBtn = this.container.querySelector('#game-back-btn');
    backBtn.addEventListener('click', () => {
      this.destroy();
      navigate('/');
    });

    // Rules button handler
    const rulesBtn = this.container.querySelector('#game-rules-btn');
    if (rulesBtn) {
      rulesBtn.addEventListener('click', () => {
        this.showRules();
      });
    }

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
   * Show game rules modal/dialog (can be overridden by subclasses)
   */
  showRules() {
    if (typeof this.onRulesClick === 'function') {
      this.onRulesClick();
    }
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

    const completion = recordGamePlay(this.id, score, true);
    const torchCelebration = completion.firstCompletion
      ? prepareTorchCelebration(completion.streak) : null;

    // Check achievements
    const stats = getProgression();
    checkAchievements(stats);

    if (!this.config.ownsResultScreen) playSfx(isNewBest ? 'levelup' : 'gameover');
    bus.emit(Events.GAME_ENDED, { gameId: this.id, score, rank, isNewBest });

    // Embedded games with their own results still submit scores and award XP.
    if (this.config.ownsResultScreen) {
      this.showTorchCelebration?.(torchCelebration);
      return;
    }

    // Show game-over modal
    renderGameOver({
      score,
      bestScore: isNewBest ? score : bestScore,
      isNewBest,
      rank,
      gameTitle: t(this.titleKey),
      theme: this.theme,
      torchCelebration,
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
