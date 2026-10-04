import { HtmlIframeGame } from '../base-html-game.js';
import { registerGame } from '../registry.js';

registerGame({
  id: 'deshkipark',
  titleKey: 'game3.title',
  descKey: 'game3.desc',
  icon: '🚗',
  color: '#e74c3c',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'Deshkipark.html',
  create: (container) => new HtmlIframeGame(container, { id: 'deshkipark', titleKey: 'game3.title', icon: '🚗', htmlFile: 'Deshkipark.html' }),
});
