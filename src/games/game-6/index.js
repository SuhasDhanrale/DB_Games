import { HtmlIframeGame } from '../base-html-game.js';
import { registerGame } from '../registry.js';

class SuperOverGame extends HtmlIframeGame {
  async init() {
    await super.init();
    // Cricket runs already appear in the match; a second points counter is distracting.
    this.container.querySelector('#game-score-display')?.remove();
    this.container.querySelector('.screen-header__title').textContent = '🏏 आज का ओवर';
    const help = this.container.querySelector('#game-rules-btn');
    help.textContent = 'ℹ️ नियम';
    help.title = 'नियम';
  }
}

registerGame({
  id: 'superover',
  titleKey: 'game6.title',
  descKey: 'game6.desc',
  icon: '🏏',
  color: '#e23a28',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'Superover.html',
  create: (container) => new SuperOverGame(container, { id: 'superover', titleKey: 'game6.title', icon: '🏏', htmlFile: 'Superover.html' }),
});
