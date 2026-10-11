import { HtmlIframeGame } from '../base-html-game.js';
import { registerGame } from '../registry.js';

registerGame({
  id: 'cricket',
  titleKey: 'game3.title',
  descKey: 'game3.desc',
  icon: '🏏',
  color: '#059669',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'Superover.html',
  create: (container) => new HtmlIframeGame(container, { id: 'cricket', titleKey: 'game3.title', icon: '🏏', htmlFile: 'Superover.html' }),
});

// Alias for 'superover' URL route support
registerGame({
  id: 'superover',
  titleKey: 'game3.title',
  descKey: 'game3.desc',
  icon: '🏏',
  color: '#059669',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'Superover.html',
  create: (container) => new HtmlIframeGame(container, { id: 'superover', titleKey: 'game3.title', icon: '🏏', htmlFile: 'Superover.html' }),
});
