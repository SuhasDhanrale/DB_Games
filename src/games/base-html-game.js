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

    const iframe = area.querySelector('iframe');
    iframe.onload = () => {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.DBGameLab = {
            addScore: (points) => this.addScore(points),
            endGame: (score) => this.end(score)
          };
        }
      } catch (e) {
        console.warn("Could not inject DBGameLab object into iframe:", e);
      }
    };
  }
}
