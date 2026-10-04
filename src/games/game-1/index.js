import { HtmlIframeGame } from '../base-html-game.js';
import { registerGame } from '../registry.js';

registerGame({
  id: 'wordal',
  titleKey: 'game1.title',
  descKey: 'game1.desc',
  icon: '🔤',
  color: '#6aaa64',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'wordal.html',
  create: (container) => new HtmlIframeGame(container, { id: 'wordal', titleKey: 'game1.title', icon: '🔤', htmlFile: 'wordal.html' }),
});
