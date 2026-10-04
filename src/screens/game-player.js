/* ============================================================
   Game Player Screen — Hosts the actual game instance
   ============================================================ */

import { getGame } from '../games/registry.js';
import { navigate } from '../core/router.js';
import { t } from '../i18n/index.js';

let currentGameInstance = null;

export function renderGamePlayer(container, params) {
  const gameId = params.id;
  const gameDef = getGame(gameId);

  if (!gameDef) {
    container.innerHTML = `
      <div class="screen-body empty-state">
        <div class="empty-state__icon">⚠️</div>
        <div class="empty-state__title">Game Not Found</div>
        <button class="btn btn--primary" id="gp-back" style="margin-top: var(--space-4);">${t('common.back')}</button>
      </div>
    `;
    container.querySelector('#gp-back').addEventListener('click', () => navigate('/'));
    return;
  }

  // Clear container
  container.innerHTML = '';

  try {
    currentGameInstance = gameDef.create(container);
    currentGameInstance.init();
  } catch (err) {
    console.error(`[GamePlayer] Error starting game ${gameId}:`, err);
    container.innerHTML = `<div class="screen-body empty-state">Error loading game.</div>`;
  }
}

// Ensure cleanup on route exit
import { bus, Events } from '../core/events.js';
bus.on(Events.SCREEN_EXITED, ({ route }) => {
  if (route.startsWith('/game/') && currentGameInstance) {
    currentGameInstance.destroy();
    currentGameInstance = null;
  }
});

export default renderGamePlayer;
