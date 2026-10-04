/* ============================================================
   Profile Screen — Player stats and achievements
   ============================================================ */

import { t } from '../i18n/index.js';
import { getProgression, getLevelProgress } from '../systems/progression.js';
import { getAchievementDefs, getUnlockedAchievements, getAchievementTranslations } from '../systems/engagement.js';
import { renderHeader, attachHeaderListeners, renderBottomNav, attachBottomNavListeners } from '../ui/components.js';
import { navigate } from '../core/router.js';

export function renderProfile(container) {
  const prog = getProgression();
  const levelProg = getLevelProgress();
  const achDefs = getAchievementDefs();
  const unlocked = getUnlockedAchievements();
  const achTrans = getAchievementTranslations(); // We use t() normally, this is just to ensure they exist

  container.innerHTML = `
    ${renderHeader({ title: t('profile.title') })}
    
    <div class="screen-body" style="padding-top: var(--space-4); display: flex; flex-direction: column;">
      
      <!-- User Profile Header -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-3); margin-bottom: var(--space-8);">
        <div class="avatar avatar--xl" style="box-shadow: var(--shadow-glow);">P</div>
        <div style="text-align: center;">
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold);">Player</h2>
          <div class="badge badge--primary" style="margin-top: var(--space-1);">${t('profile.level')} ${prog.level}</div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-8);">
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-accent-warm);">${prog.longestStreak}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">Max Streak (${t('profile.days')})</div>
          </div>
        </div>
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-primary-light);">${prog.gamesPlayed}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">${t('profile.games_played')}</div>
          </div>
        </div>
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-success);">${prog.xp}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">Total ${t('profile.xp')}</div>
          </div>
        </div>
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-info);">${prog.totalScore}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">${t('profile.total_score')}</div>
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="section-header">
        <h3 class="section-header__title">${t('profile.achievements')} <span style="font-size: var(--text-base); color: var(--text-secondary); font-weight: normal;">(${unlocked.size}/${achDefs.length})</span></h3>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        ${achDefs.map(ach => {
          const isUnlocked = unlocked.has(ach.id);
          return `
            <div style="display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3) var(--space-4); background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); opacity: ${isUnlocked ? '1' : '0.4'}; filter: ${isUnlocked ? 'none' : 'grayscale(1)'};">
              <div style="font-size: 2rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-raised); border-radius: var(--radius-full); flex-shrink: 0;">
                ${ach.icon}
              </div>
              <div>
                <div style="font-size: var(--text-base); font-weight: var(--weight-bold);">${t(ach.titleKey)}</div>
                <div style="font-size: var(--text-xs); color: var(--text-secondary);">${t(ach.descKey)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="height: var(--space-8);"></div>
    </div>

    ${renderBottomNav('profile')}
  `;

  attachHeaderListeners(container, {});
  attachBottomNavListeners(container, navigate);
}

export default renderProfile;
