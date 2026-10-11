import { BaseGame } from './base-game.js';
import { gameUrl } from './game-assets.js';
import { needsIntro, renderGameIntro } from '../ui/game-intro.js';
import { getLang } from '../i18n/index.js';

export class HtmlIframeGame extends BaseGame {
  constructor(container, config) {
    // These games show their own results; the shell only records the score.
    super(container, { ownsResultScreen: true, ...config });
  }

  async init() {
    await super.init();
    const launch = () => {
      this._introCleanup?.();
      this._introCleanup = null;
      this.start();
      this.onStart();
    };
    if (!needsIntro(this.id)) launch();
    else {
      this._introCleanup = renderGameIntro(this.getGameArea(), this.id, { onPlay: launch, lang: getLang() });
      this._cleanupFns.push(() => this._introCleanup?.());
    }
  }

  onStart() {
    const area = this.getGameArea();
    area.innerHTML = `
      <iframe src="${gameUrl(this.config.htmlFile)}" style="width: 100%; height: 100%; border: none;" id="game-iframe-${this.id}"></iframe>
    `;

    // Expose DBGameLab globally on host window so window.parent.DBGameLab works
    const bridge = {
      startGame: () => { if (!this.isRunning) this.start(); },
      addScore: (points) => this.addScore(points),
      endGame: (score) => this.end(score)
    };
    window.DBGameLab = bridge;

    const iframe = area.querySelector('iframe');
    iframe.onload = () => {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.DBGameLab = bridge;
        }
      } catch (e) {
        console.warn("Could not inject DBGameLab object into iframe:", e);
      }
    };

    // Also listen for postMessage events from child games
    const onMessage = (event) => {
      if (!event.data) return;
      if (event.data.type === 'GAME_COMPLETE' || event.data.type === 'GAME_OVER') {
        const score = typeof event.data.score === 'number' ? event.data.score : 100;
        this.end(score);
      } else if (event.data.type === 'ADD_SCORE') {
        this.addScore(event.data.points || 10);
      }
    };
    window.addEventListener('message', onMessage);

    this._cleanupFns.push(() => {
      window.removeEventListener('message', onMessage);
      if (window.DBGameLab === bridge) {
        delete window.DBGameLab;
      }
    });
  }

  onRulesClick() {
    const area = this.getGameArea();
    if (this._introCleanup) {
      area.querySelector('.gi-play')?.focus();
      return;
    }
    const iframe = area.querySelector('iframe');
    if (iframe) {
      try {
        if (iframe.contentWindow) {
          if (typeof iframe.contentWindow.openHelpModal === 'function') {
            iframe.contentWindow.openHelpModal();
          } else iframe.contentWindow.postMessage({ type: 'OPEN_RULES' }, window.location.origin);
        }
      } catch (e) {
        console.warn("Could not trigger rules in iframe:", e);
      }
    }
  }
}
