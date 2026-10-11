import { HtmlIframeGame } from '../base-html-game.js';
import { registerGame } from '../registry.js';

registerGame({
  id: 'jodo',
  titleKey: 'game5.title',
  descKey: 'game5.desc',
  icon: '🧩',
  color: '#2563EB',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'jodo.html',
  create: (container) => new HtmlIframeGame(container, { id: 'jodo', titleKey: 'game5.title', icon: '🧩', htmlFile: 'jodo.html', ownsResultScreen: true }),
});
