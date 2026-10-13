import { BaseGame } from './base-game.js';
import { gameUrl } from './game-assets.js';
import { needsIntro, renderGameIntro } from '../ui/game-intro.js';
import { getLang } from '../i18n/index.js';
import { openNews } from '../ui/news-reader.js';
import { showTorchCelebration } from '../ui/torch.js';
import audio from '../core/audio.js';

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
      audio,
      startGame: () => { if (!this.isRunning) this.start(); },
      addScore: (points) => this.addScore(points),
      openArticle: (href) => openNews(href),
      endGame: (score, details) => this.end(score, details)
    };
    window.DBGameLab = bridge;

    const iframe = area.querySelector('iframe');
    iframe.onload = () => {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.DBGameLab = bridge;
          iframe.contentDocument.addEventListener('click', event => {
            const link = event.target.closest('a[href]');
            if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            const url = new URL(link.href);
            if (url.origin === window.location.origin && url.pathname.endsWith('/news.html')) {
              event.preventDefault();
              openNews(url.href);
            }
          });
        }
      } catch (e) {
        console.warn("Could not inject DBGameLab object into iframe:", e);
      }
    };

    // Also listen for postMessage events from child games
    const onMessage = (event) => {
      if (event.source !== iframe.contentWindow || event.origin !== window.location.origin || !event.data) return;
      if (event.data.type === 'GAME_COMPLETE' || event.data.type === 'GAME_OVER') {
        const score = typeof event.data.score === 'number' ? event.data.score : 100;
        this.end(score, { ...event.data.details, edition: event.data.edition || event.data.dayId });
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

  showTorchCelebration(celebration) {
    if (!celebration) return;
    const anchors = {
      wordal: '.result-hero-card',
      // The share-card step hides the meaning box immediately after completion.
      // Keep its pending celebration attached to the whole Niti screen.
      niti: '#app',
      cricket: '.news-scorecard',
      carrom: '#modal-desc',
      jodo: '.result-header-minimal',
    };
    const doc = this.getGameArea().querySelector('iframe')?.contentDocument;
    const anchor = doc?.querySelector(anchors[this.theme]);
    this._cleanupFns.push(showTorchCelebration(anchor, celebration));
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
