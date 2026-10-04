import { HtmlIframeGame } from '../base-html-game.js';
import { registerGame } from '../registry.js';

registerGame({
  id: 'penfight',
  titleKey: 'game2.title',
  descKey: 'game2.desc',
  icon: '🖊️',
  color: '#3498db',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'Penfight.html',
  create: (container) => new HtmlIframeGame(container, { id: 'penfight', titleKey: 'game2.title', icon: '🖊️', htmlFile: 'Penfight.html' }),
});
