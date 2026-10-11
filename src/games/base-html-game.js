import { BaseGame } from './base-game.js';

export class HtmlIframeGame extends BaseGame {
  constructor(container, config) {
    super(container, config);
  }

  async init() {
    await super.init();
    this.start();
    this.onStart();
  }

  onStart() {
    const area = this.getGameArea();
    area.innerHTML = `
      <iframe src="/${this.config.htmlFile}" style="width: 100%; height: 100%; border: none;" id="game-iframe-${this.id}"></iframe>
    `;

    // Expose DBGameLab globally on host window so window.parent.DBGameLab works
    const bridge = {
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
    const iframe = area.querySelector('iframe');
    if (iframe) {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'OPEN_RULES' }, '*');
          if (typeof iframe.contentWindow.openHelpModal === 'function') {
            iframe.contentWindow.openHelpModal();
          }
        }
      } catch (e) {
        console.warn("Could not trigger rules in iframe:", e);
      }
    }
  }
}
