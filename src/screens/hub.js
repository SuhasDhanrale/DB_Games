/* ============================================================
   Hub Screen — Main game launcher / home screen (5-Game Bento Grid)
   ============================================================ */

import { t, toggleLang, getLang } from '../i18n/index.js';
import { bus, Events } from '../core/events.js';
import { navigate } from '../core/router.js';
import { playSfx } from '../core/audio.js';
import { getProgression, isDailyCompleted } from '../systems/progression.js';
import { renderBottomNav, attachBottomNavListeners } from '../ui/components.js';

export function renderHub(container) {
  const prog = getProgression();
  const currentLang = getLang();

  // Custom Styles for Bento Box Layout
  const bentoStyles = `
    <style>
      .bento-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        overflow: hidden;
        background: var(--bg-app);
      }

      .bento-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 18px 6px 18px;
        flex-shrink: 0;
      }

      /* Weekly Day Tracker Strip */
      .weekly-tracker-strip {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 18px 12px 18px;
        flex-shrink: 0;
      }

      .weekly-day-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        flex: 1;
        cursor: default;
      }

      .weekly-day-label {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: #71717A;
        text-transform: uppercase;
        transition: color 0.2s;
      }

      .weekly-day-col.is-today .weekly-day-label {
        color: #18181B;
        font-weight: 900;
      }

      .weekly-day-dot {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #CBD5E1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
      }

      .weekly-day-dot.done {
        background: #84A968;
        box-shadow: 0 2px 6px rgba(132, 169, 104, 0.35);
      }

      .weekly-day-dot.today-dot {
        box-shadow: 0 0 0 2px var(--bg-app), 0 0 0 4px #18181B;
      }

      .weekly-day-dot.done.today-dot {
        box-shadow: 0 0 0 2px var(--bg-app), 0 0 0 4px #52A447;
      }

      /* 5-Game Bento Grid */
      .bento-games-area {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 0 16px 14px 16px;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
      }

      .bento-row-top {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        flex: 1.35;
        min-height: 0;
      }

      .bento-col-left {
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: 100%;
        min-height: 0;
      }

      .bento-row-bottom {
        display: grid;
        grid-template-columns: 1.55fr 1fr;
        gap: 12px;
        flex: 1;
        min-height: 0;
      }

      /* Base Game Bento Card */
      .game-bento-card {
        position: relative;
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 16px;
        transition: transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.16s;
        user-select: none;
        -webkit-user-select: none;
      }

      .game-bento-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
      }

      .game-bento-card:active {
        transform: scale(0.97);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      }

      .card-game-1 {
        flex: 1.35;
        min-height: 0;
      }

      .card-game-3 {
        flex: 1;
        min-height: 0;
      }

      .card-game-2 {
        height: 100%;
        min-height: 0;
      }

      .card-game-4 {
        height: 100%;
        min-height: 0;
      }

      .card-game-5 {
        height: 100%;
        min-height: 0;
      }

      /* Status Dot in top-left */
      .game-status-dot {
        position: absolute;
        top: 14px;
        left: 14px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.85);
        z-index: 3;
        transition: background 0.2s, transform 0.2s;
      }

      .game-status-dot.dot-done {
        background: #84A968;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9), 0 2px 6px rgba(132, 169, 104, 0.4);
      }

      .game-status-dot.dot-left {
        background: #CBD5E1;
      }

      /* Card Art / Icon */
      .card-icon-art {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        pointer-events: none;
        transition: transform 0.2s;
      }

      .game-bento-card:hover .card-icon-art {
        transform: scale(1.06);
      }

      .card-icon-art .svg-icon {
        width: 44px;
        height: 44px;
        opacity: 0.85;
      }

      .card-game-2 .card-icon-art .svg-icon {
        width: 62px;
        height: 62px;
      }

      .card-game-4 .card-icon-art .svg-icon {
        width: 52px;
        height: 52px;
      }

      /* Card Bottom Info */
      .card-bottom-info {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 2px;
        z-index: 2;
      }

      .card-game-number {
        font-family: 'Inter', system-ui, sans-serif;
        font-weight: 900;
        font-size: 1.15rem;
        letter-spacing: -0.02em;
        color: #111827;
        line-height: 1.1;
      }

      .card-game-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: #374151;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }

      .card-game-mood {
        font-size: 0.65rem;
        font-weight: 600;
        color: #6B7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        line-height: 1.2;
      }
    </style>
  `;

  // SVGs for the cards
  const khabarSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13h4"></path><path d="M8 17h8"></path></svg>`;
  const penSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path><path d="M14.5 5.5l4 4"></path></svg>`;
  const cameraSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#15803D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><circle cx="11" cy="11" r="3"></circle></svg>`;
  const baghSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#C2410C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path><path d="M4.9 4.9l14.2 14.2"></path><path d="M4.9 19.1l14.2-14.2"></path></svg>`;
  const lagoriSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"></path><path d="M8 17h8"></path><path d="M9 13h6"></path><path d="M10 9h4"></path><circle cx="16" cy="5" r="3"></circle></svg>`;

  // 5 Games Config
  const games = [
    {
      num: 1,
      id: 'wordal',
      titleKey: 'game1.title',
      moodKey: 'mood.curiosity',
      svg: khabarSvg,
      bgGradient: 'linear-gradient(150deg, #F5F1FA 0%, #E8DCF7 100%)',
      cardClass: 'card-game-1',
    },
    {
      num: 2,
      id: 'penfight',
      titleKey: 'game2.title',
      moodKey: 'mood.excitement',
      svg: penSvg,
      bgGradient: 'linear-gradient(150deg, #FFF7ED 0%, #FDE7CC 100%)',
      cardClass: 'card-game-2',
    },
    {
      num: 3,
      id: 'deshkipark',
      titleKey: 'game3.title',
      moodKey: 'mood.discovery',
      svg: cameraSvg,
      bgGradient: 'linear-gradient(150deg, #F0F9F2 0%, #DBEEDB 100%)',
      cardClass: 'card-game-3',
    },
    {
      num: 4,
      id: 'baghchal',
      titleKey: 'game4.title',
      moodKey: 'mood.thinking',
      svg: baghSvg,
      bgGradient: 'linear-gradient(150deg, #FFF3EE 0%, #FCDED2 100%)',
      cardClass: 'card-game-4',
    },
    {
      num: 5,
      id: 'lagori',
      titleKey: 'game5.title',
      moodKey: 'mood.nostalgia',
      svg: lagoriSvg,
      bgGradient: 'linear-gradient(150deg, #EFF6FF 0%, #DBEAFE 100%)',
      cardClass: 'card-game-5',
    },
  ];

  // Weekly Days (Mon to Sun as shown in wireframe)
  const weekDays = [
    { key: 'day.mon', en: 'MON', hi: 'सोम' },
    { key: 'day.tue', en: 'TUS', hi: 'मंगल' },
    { key: 'day.wed', en: 'WED', hi: 'बुध' },
    { key: 'day.thu', en: 'THR', hi: 'गुरु' },
    { key: 'day.fri', en: 'FRI', hi: 'शुक्र' },
    { key: 'day.sat', en: 'SAT', hi: 'शनि' },
    { key: 'day.sun', en: 'SON', hi: 'रवि' },
  ];

  const now = new Date();
  const currentDayIndex = (now.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  const monday = new Date(now);
  monday.setDate(now.getDate() - currentDayIndex);

  const daysHtml = weekDays.map((dayInfo, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === currentDayIndex;
    const isPast = i < currentDayIndex;

    // Check if this day is marked done in progression
    let isDone = Boolean(prog.dailyHistory && prog.dailyHistory[dateStr]);

    if (isToday) {
      const anyGamePlayed = prog.dailyCompleted && Object.values(prog.dailyCompleted).some(Boolean);
      if (anyGamePlayed || prog.lastPlayDate === dateStr) {
        isDone = true;
      }
    } else if (isPast && !isDone && prog.streak > 0) {
      const daysDiff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      if (daysDiff <= prog.streak) {
        isDone = true;
      }
    }

    const label = currentLang === 'hi' ? dayInfo.hi : dayInfo.en;

    return `
      <div class="weekly-day-col ${isToday ? 'is-today' : ''}">
        <span class="weekly-day-label">${label}</span>
        <div class="weekly-day-dot ${isDone ? 'done' : ''} ${isToday ? 'today-dot' : ''}">
          ${isDone ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Helper to render an individual game card
  function renderCard(game) {
    const isDone = isDailyCompleted(game.id);
    const statusClass = isDone ? 'dot-done' : 'dot-left';

    return `
      <div class="game-bento-card ${game.cardClass}" data-game-id="${game.id}" style="background: ${game.bgGradient};">
        <div class="game-status-dot ${statusClass}" title="${isDone ? t('hub.done') : t('hub.left')}">
          ${isDone ? `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
        </div>

        <div class="card-icon-art">
          ${game.svg}
        </div>

        <div class="card-bottom-info">
          <div class="card-game-number">GAME ${game.num}</div>
          <div class="card-game-title">${t(game.titleKey)}</div>
          <div class="card-game-mood">${t(game.moodKey)}</div>
        </div>
      </div>
    `;
  }

  // Find games
  const g1 = games.find(g => g.num === 1);
  const g2 = games.find(g => g.num === 2);
  const g3 = games.find(g => g.num === 3);
  const g4 = games.find(g => g.num === 4);
  const g5 = games.find(g => g.num === 5);

  container.innerHTML = `
    ${bentoStyles}
    <div class="bento-container">
      <!-- Top Bar (Profile avatar, streak, language switch) -->
      <div class="bento-header">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <!-- Profile Icon -->
          <div id="hub-profile-btn" style="width: 44px; height: 44px; border-radius: 50%; background: #ddd; overflow: hidden; cursor: pointer; border: 2px solid var(--color-border); box-shadow: var(--shadow-sm);">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Hanna" style="width:100%; height:100%; object-fit:cover;" />
          </div>
          
          <!-- Streak -->
          <div style="display: flex; align-items: center; gap: 4px; font-weight: 800; font-size: 1.1rem; color: var(--color-accent-warm); background: var(--bg-surface); padding: 6px 16px; border-radius: 20px; box-shadow: var(--shadow-sm);">
            ${prog.streak} 🔥
          </div>

          <!-- Language Toggle -->
          <button class="btn btn--icon btn--secondary" id="hub-lang-toggle" style="font-size: 0.85rem; font-weight: bold; width: 44px; height: 44px; box-shadow: var(--shadow-sm);">
            ${currentLang === 'hi' ? 'EN' : 'हिं'}
          </button>
        </div>
      </div>

      <!-- Weekly Day Tracker (MON - SON) -->
      <div class="weekly-tracker-strip">
        ${daysHtml}
      </div>

      <!-- 5 Games Bento Grid Area -->
      <div class="bento-games-area">
        <!-- Top Section (Left: Game 1 & Game 3 stacked, Right: Game 2 full height) -->
        <div class="bento-row-top">
          <div class="bento-col-left">
            ${renderCard(g1)}
            ${renderCard(g3)}
          </div>
          ${renderCard(g2)}
        </div>

        <!-- Bottom Section (Left: Game 4 wide, Right: Game 5 narrower) -->
        <div class="bento-row-bottom">
          ${renderCard(g4)}
          ${renderCard(g5)}
        </div>
      </div>
    </div>
    ${renderBottomNav('home')}
  `;

  // Attach card click handlers
  const cards = container.querySelectorAll('.game-bento-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      playSfx('tap');
      navigate('/game/' + card.dataset.gameId);
    });
  });

  // Profile Button Click
  const profileBtn = container.querySelector('#hub-profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      playSfx('click');
      navigate('/profile');
    });
  }

  // Language Toggle Click
  const langBtn = container.querySelector('#hub-lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      toggleLang();
      playSfx('tap');
      renderHub(container);
    });
  }

  // Attach Bottom Nav
  attachBottomNavListeners(container, navigate);
}

export default renderHub;
