/* ============================================================
   Leaderboard Screen — Shows global/daily rankings
   ============================================================ */

import { t } from '../i18n/index.js';
import { getLeaderboard, getPlayerRank } from '../systems/leaderboard.js';
import { getAllGames } from '../games/registry.js';
import { renderHeader, attachHeaderListeners, renderBottomNav, attachBottomNavListeners } from '../ui/components.js';
import { navigate } from '../core/router.js';

export function renderLeaderboard(container) {
  const games = getAllGames();
  const selectedGameId = games[0]?.id || '';
  const period = 'daily'; // default

  // We could add tabs for 'daily', 'weekly', 'alltime' and a game selector dropdown
  // For now, keeping it simple: showing the first game's daily leaderboard

  const entries = getLeaderboard(selectedGameId, period);
  const playerRank = getPlayerRank(selectedGameId, period);

  container.innerHTML = `
    ${renderHeader({ title: t('lb.title') })}
    
    <div class="screen-body" style="padding-top: var(--space-2); display: flex; flex-direction: column;">
      
      <!-- Period Selector -->
      <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4);">
        <button class="btn btn--primary btn--sm" style="flex: 1;">${t('lb.daily')}</button>
        <button class="btn btn--secondary btn--sm" style="flex: 1;">${t('lb.weekly')}</button>
        <button class="btn btn--secondary btn--sm" style="flex: 1;">${t('lb.alltime')}</button>
      </div>

      <!-- Game Selector (Placeholder) -->
      <div style="margin-bottom: var(--space-4);">
        <select class="btn btn--secondary" style="width: 100%; text-align: left; padding: var(--space-3); border-radius: var(--radius-md);">
          ${games.map(g => `<option value="${g.id}">${t(g.titleKey)}</option>`).join('')}
        </select>
      </div>

      <!-- Player Rank Banner -->
      ${playerRank ? `
      <div style="margin-bottom: var(--space-4); padding: var(--space-3); background: var(--gradient-brand); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: space-between;">
        <span style="font-weight: var(--weight-bold);">${t('lb.your_rank')}</span>
        <span style="font-size: var(--text-xl); font-weight: var(--weight-black);">#${playerRank}</span>
      </div>
      ` : ''}

      <!-- List -->
      <div class="lb-list" style="flex: 1; overflow-y: auto;">
        ${entries.length > 0 ? entries.map((entry, i) => {
          const rank = i + 1;
          let rankClass = '';
          if (rank === 1) rankClass = 'lb-item__rank--gold';
          else if (rank === 2) rankClass = 'lb-item__rank--silver';
          else if (rank === 3) rankClass = 'lb-item__rank--bronze';

          const isYou = entry.id === 'player';
          
          return `
            <div class="lb-item ${isYou ? 'lb-item--you' : ''}">
              <div class="lb-item__rank ${rankClass}">${rank}</div>
              <div class="lb-item__avatar">${entry.name.charAt(0)}</div>
              <div class="lb-item__name">${entry.name} ${isYou ? '(You)' : ''}</div>
              <div class="lb-item__score">${entry.score} <span style="font-size: var(--text-xs); color: var(--text-tertiary);">${t('lb.points')}</span></div>
            </div>
          `;
        }).join('') : `
          <div class="empty-state">
            <div class="empty-state__icon">🏆</div>
            <div class="empty-state__title">${t('lb.no_scores')}</div>
          </div>
        `}
      </div>
      
      <div style="height: var(--space-8);"></div>
    </div>

    ${renderBottomNav('leaderboard')}
  `;

  attachHeaderListeners(container, {});
  attachBottomNavListeners(container, navigate);
}

export default renderLeaderboard;
