import { HtmlIframeGame } from '../base-html-game.js';
import { registerGame } from '../registry.js';

registerGame({
  id: 'lagori',
  titleKey: 'game5.title',
  descKey: 'game5.desc',
  icon: '🧱',
  color: '#9b59b6',
  hasDailyChallenge: false,
  comingSoon: false,
  htmlFile: 'Lagori.html',
  create: (container) => new HtmlIframeGame(container, { id: 'lagori', titleKey: 'game5.title', icon: '🧱', htmlFile: 'Lagori.html' }),
});
