import { HtmlIframeGame } from '../base-html-game.js';
import { registerGame } from '../registry.js';

registerGame({
  id: 'carrom',
  titleKey: 'game4.title',
  descKey: 'game4.desc',
  icon: '🎯',
  color: '#BE123C',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'Carrom_Puzzles.html',
  create: (container) => new HtmlIframeGame(container, { id: 'carrom', titleKey: 'game4.title', icon: '🎯', htmlFile: 'Carrom_Puzzles.html', ownsResultScreen: true }),
});

// Alias for 'carrom_puzzles'
registerGame({
  id: 'carrom_puzzles',
  titleKey: 'game4.title',
  descKey: 'game4.desc',
  icon: '🎯',
  color: '#BE123C',
  hasDailyChallenge: true,
  comingSoon: false,
  htmlFile: 'Carrom_Puzzles.html',
  create: (container) => new HtmlIframeGame(container, { id: 'carrom_puzzles', titleKey: 'game4.title', icon: '🎯', htmlFile: 'Carrom_Puzzles.html', ownsResultScreen: true }),
});
