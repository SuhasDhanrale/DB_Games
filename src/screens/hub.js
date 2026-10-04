/* ============================================================
   Hub Screen — Main game launcher / home screen (Bento Grid)
   ============================================================ */

import { t, translateDOM } from '../i18n/index.js';
import { bus, Events } from '../core/events.js';
import { navigate } from '../core/router.js';
import { playSfx } from '../core/audio.js';
import { getProgression, getLevelProgress, getTimeUntilDailyReset } from '../systems/progression.js';
import { getAllGames } from '../games/registry.js';
import { renderBottomNav, attachBottomNavListeners } from '../ui/components.js';

export function renderHub(container) {
  const prog = getProgression();
  const levelProg = getLevelProgress();
  
  // Custom Styles for Bento Box Layout
  const bentoStyles = `
    <style>
      .bento-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        height: 100dvh;
        overflow: hidden;
        background: var(--bg-app);
        padding-bottom: 70px; /* Space for bottom nav */
      }
      .bento-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-4);
        flex-shrink: 0;
      }
      .main-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 0 var(--space-4) var(--space-4) var(--space-4);
        flex: 1;
        overflow-y: auto;
      }
      .stats-strip {
        background: var(--bg-surface);
        border-radius: 40px;
        padding: 12px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--shadow-sm);
      }
      .stat-pill {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .stat-val {
        font-size: 1.1rem;
        font-weight: 800;
      }
      .stat-lbl {
        font-size: 0.65rem;
        text-transform: uppercase;
        color: var(--text-secondary);
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .tall-cards-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .tall-card {
        border-radius: 28px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        color: #111;
        position: relative;
        min-height: 220px;
        cursor: pointer;
        transition: transform 0.2s;
      }
      .tall-card:active {
        transform: scale(0.96);
      }
      .tall-card .icon-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: auto;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      .tall-card-title {
        font-family: 'Georgia', 'Playfair Display', serif;
        font-weight: 800;
        font-size: 1.1rem;
        line-height: 1.2;
        margin-bottom: 2px;
      }
      .tall-card-desc {
        font-size: 0.8rem;
        font-weight: 500;
        opacity: 0.85;
        margin-bottom: 16px;
      }
      .tall-card-btn {
        background: #111;
        color: #fff;
        border-radius: 20px;
        padding: 10px;
        font-weight: 700;
        font-size: 0.8rem;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .section-title {
        font-weight: 700;
        font-size: 1.1rem;
        margin-top: 8px;
        margin-bottom: 2px;
      }

      .pill-cards-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .pill-card {
        background: var(--bg-surface);
        border-radius: 24px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: var(--shadow-sm);
        cursor: pointer;
        transition: transform 0.2s;
      }
      .pill-card:active {
        transform: scale(0.96);
      }
      .pill-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .pill-text {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .pill-title {
        font-weight: 700;
        font-size: 0.9rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .pill-desc {
        font-size: 0.7rem;
        color: var(--text-secondary);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .svg-icon {
        width: 50%;
        height: 50%;
      }
      .tall-card .svg-icon {
        width: 60%;
        height: 60%;
      }
    </style>
  `;

  const khabarSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13h4"></path><path d="M8 17h8"></path></svg>`;
  const baghSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path><path d="M4.9 4.9l14.2 14.2"></path><path d="M4.9 19.1l14.2-14.2"></path></svg>`;
  const lagoriSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#689F38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"></path><path d="M8 17h8"></path><path d="M9 13h6"></path><path d="M10 9h4"></path><circle cx="16" cy="5" r="3"></circle></svg>`;
  const penSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#F57F17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path><path d="M14.5 5.5l4 4"></path></svg>`;
  const cameraSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#3949AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;

  container.innerHTML = `
    ${bentoStyles}
    <div class="bento-container">
      <div class="bento-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #ddd; overflow: hidden;">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Hanna" style="width:100%; height:100%; object-fit:cover;" />
          </div>
          <div>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 2px;">
              ${t('hub.greeting')}
            </p>
            <h1 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary);">
              ${t('hub.title')}
            </h1>
          </div>
        </div>
        <button class="btn btn--icon btn--secondary" id="hub-lang-toggle" style="font-size: 0.8rem; font-weight: bold; width: 36px; height: 36px;">
          ${prog.__lang === 'hi' ? 'EN' : 'हिं'}
        </button>
      </div>

      <div class="main-content">
        <!-- Stats Strip (Like the days tracker) -->
        <div class="stats-strip">
          <div class="stat-pill">
            <span class="stat-val text-gradient">${prog.level}</span>
            <span class="stat-lbl">${t('profile.level')}</span>
          </div>
          <div class="stat-pill">
            <span class="stat-val" style="color: var(--color-accent-warm);">${prog.streak} 🔥</span>
            <span class="stat-lbl">${t('profile.streak')}</span>
          </div>
          <div class="stat-pill">
            <span class="stat-val" style="color: var(--color-secondary);">${prog.gamesPlayed}</span>
            <span class="stat-lbl">${t('profile.games_played')}</span>
          </div>
        </div>

        <!-- 2 Tall Cards Row -->
        <div class="tall-cards-row">
          <div class="tall-card" style="background: #E0C3FC;" data-game-id="wordal">
            <div class="icon-circle">${khabarSvg}</div>
            <div class="tall-card-title">Curiosity</div>
            <div class="tall-card-desc">Khabar Shabd</div>
            <div class="tall-card-btn">PLAY</div>
          </div>
          
          <div class="tall-card" style="background: #FFD194;" data-game-id="baghchal">
            <div class="icon-circle">${baghSvg}</div>
            <div class="tall-card-title">Thinking</div>
            <div class="tall-card-desc">Bagh Bakri</div>
            <div class="tall-card-btn">JOIN</div>
          </div>
        </div>

        <div class="section-title">Quick Plays</div>

        <!-- Grid of Pills -->
        <div class="pill-cards-grid">
          <div class="pill-card" data-game-id="lagori">
            <div class="pill-icon" style="background: #E8F5E9;">${lagoriSvg}</div>
            <div class="pill-text">
              <span class="pill-title">Nostalgia</span>
              <span class="pill-desc">Lagori</span>
            </div>
          </div>

          <div class="pill-card" data-game-id="penfight">
            <div class="pill-icon" style="background: #FFF8E1;">${penSvg}</div>
            <div class="pill-text">
              <span class="pill-title">Excitement</span>
              <span class="pill-desc">Pen Fight</span>
            </div>
          </div>

          <div class="pill-card" data-game-id="deshkipark">
            <div class="pill-icon" style="background: #E8EAF6;">${cameraSvg}</div>
            <div class="pill-text">
              <span class="pill-title">Discovery</span>
              <span class="pill-desc">Desi Parakh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${renderBottomNav('home')}
  `;

  // ---- Event Listeners ----
  const langBtn = container.querySelector('#hub-lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const { toggleLang } = require_i18n();
      toggleLang();
      playSfx('tap');
      renderHub(container);
    });
  }

  container.querySelectorAll('[data-game-id]').forEach(card => {
    card.addEventListener('click', () => {
      const gameId = card.dataset.gameId;
      playSfx('tap');
      navigate(`/game/${gameId}`);
    });
  });

  attachBottomNavListeners(container, navigate);
}

function require_i18n() {
  return import('../i18n/index.js').then ? 
    { toggleLang: () => import('../i18n/index.js').then(m => m.toggleLang()) } :
    { toggleLang: () => {} };
}

export default renderHub;
