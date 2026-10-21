import { BaseGame } from './base-game.js';
import { gameUrl } from './game-assets.js';
import { needsIntro, renderGameIntro } from '../ui/game-intro.js';
import { getLang, t } from '../i18n/index.js';
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
    const isHindi = getLang() === 'hi';
    const rulesButton = this.container.querySelector('#game-rules-btn');
    rulesButton.disabled = true;
    area.setAttribute('aria-busy', 'true');
    area.innerHTML = `
      <section class="game-loading" role="status">
        <p>${isHindi ? 'खेल तैयार हो रहा है…' : 'Getting your game ready…'}</p>
        <div class="loading-bar" role="progressbar" aria-label="${isHindi ? 'लोड हो रहा है…' : 'Loading…'}"></div>
      </section>
      <iframe class="game-frame is-loading" title="${t(this.titleKey)}" aria-hidden="true" tabindex="-1" style="width: 100%; height: 100%; border: none;" id="game-iframe-${this.id}"></iframe>
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
    const loading = area.querySelector('.game-loading');
    let active = true;
    let paintFrame;
    let loadTask;
    const failed = () => {
      if (!active) return;
      area.setAttribute('aria-busy', 'false');
      loading.innerHTML = `<p>${isHindi ? 'खेल नहीं खुल सका। वापस जाकर फिर कोशिश करें।' : 'The game could not load. Go back and try again.'}</p>`;
    };
    iframe.onload = async () => {
      if (!active || iframe.contentDocument?.URL === 'about:blank') return;
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
        if (!iframe.contentWindow?.gameIntroReady) throw new Error('Game initialization unavailable');
        await iframe.contentWindow.gameIntroReady;
        // Let the child's initialization and first canvas frame finish before
        // removing the host's loading screen.
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (!active) return;
        iframe.classList.remove('is-loading');
        iframe.removeAttribute('aria-hidden');
        iframe.removeAttribute('tabindex');
        area.setAttribute('aria-busy', 'false');
        loading.remove();
        rulesButton.disabled = false;
      } catch (e) {
        console.warn('Could not initialize game iframe:', e);
        failed();
      }
    };
    iframe.onerror = failed;

    // Rendering the loader alone does not paint it. Yield through two frames
    // and a task before decoding srcdoc, starting music or loading game scripts.
    const afterActivation = () => {
      if (!active) return;
      // A returning player can skip the intro while the router's new screen is
      // still transparent. Wait for activation before giving the loader a paint.
      if (!this.container.classList.contains('active')) {
        paintFrame = requestAnimationFrame(afterActivation);
        return;
      }
      paintFrame = requestAnimationFrame(() => {
        loadTask = setTimeout(() => {
          if (!active) return;
          try {
            this.start();
            iframe.src = gameUrl(this.config.htmlFile);
          } catch (error) {
            console.warn('Could not load game:', error);
            failed();
          }
        }, 0);
      });
    };
    paintFrame = requestAnimationFrame(afterActivation);

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
      active = false;
      cancelAnimationFrame(paintFrame);
      clearTimeout(loadTask);
      iframe.onload = null;
      iframe.onerror = null;
      iframe.remove();
      window.removeEventListener('message', onMessage);
      if (window.DBGameLab === bridge) {
        delete window.DBGameLab;
      }
    });
  }

  showTorchCelebration(celebration) {
    if (!celebration) return;
    const anchors = {
      wordal: '#viewResult',
      // The share-card step hides the meaning box immediately after completion.
      // Keep its pending celebration attached to the whole Niti screen.
      niti: '#app',
      cricket: '#resultModal',
      carrom: '#modal-backdrop',
      jodo: '#result-panel',
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
