import { HtmlIframeGame } from '../base-html-game.js';
import { registerGame } from '../registry.js';

registerGame({
  id: 'baghchal',
  titleKey: 'game4.title',
  descKey: 'game4.desc',
  icon: '🐅',
  color: '#f39c12',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'Baghchal.html',
  create: (container) => new HtmlIframeGame(container, { id: 'baghchal', titleKey: 'game4.title', icon: '🐅', htmlFile: 'Baghchal.html' }),
});
