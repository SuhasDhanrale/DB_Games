import { HtmlIframeGame } from '../base-html-game.js';
import { registerGame } from '../registry.js';

registerGame({
  id: 'superover',
  titleKey: 'game6.title',
  descKey: 'game6.desc',
  icon: '🏏',
  color: '#e23a28',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'Superover.html',
  create: (container) => new HtmlIframeGame(container, { id: 'superover', titleKey: 'game6.title', icon: '🏏', htmlFile: 'Superover.html' }),
});
