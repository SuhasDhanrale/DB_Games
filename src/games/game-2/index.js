import { HtmlIframeGame } from '../base-html-game.js';
import { registerGame } from '../registry.js';

registerGame({
  id: 'niti',
  titleKey: 'game2.title',
  descKey: 'game2.desc',
  icon: '📜',
  color: '#D35400',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'niti.html',
  create: (container) => new HtmlIframeGame(container, { id: 'niti', titleKey: 'game2.title', icon: '📜', htmlFile: 'niti.html' }),
});

// Alias for 'neeti' URL route support
registerGame({
  id: 'neeti',
  titleKey: 'game2.title',
  descKey: 'game2.desc',
  icon: '📜',
  color: '#D35400',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'niti.html',
  create: (container) => new HtmlIframeGame(container, { id: 'neeti', titleKey: 'game2.title', icon: '📜', htmlFile: 'niti.html' }),
});
