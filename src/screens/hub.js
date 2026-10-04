/* ============================================================
   Hub Screen — Main game launcher / home screen (Bento Grid)
   ============================================================ */

import { t, translateDOM } from '../i18n/index.js';
import { bus, Events } from '../core/events.js';
import { navigate } from '../core/router.js';
import { playSfx } from '../core/audio.js';
import { getProgression, getLevelProgress, getTimeUntilDailyReset, isDailyCompleted } from '../systems/progression.js';
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
        flex: 1;
        min-height: 0;
        overflow: hidden;
        background: var(--bg-app);
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
        overflow: hidden;
      }
      .stats-strip {
        background: var(--bg-surface);
        border-radius: 40px;
        padding: 12px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--shadow-sm);
        flex-shrink: 0;
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

      .quick-icons-strip {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg-surface);
        border-radius: 40px;
        padding: 8px 16px;
        box-shadow: var(--shadow-sm);
        flex-shrink: 0;
      }
      .quick-icon-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, background 0.2s;
        cursor: pointer;
        background: rgba(0,0,0,0.03);
      }
      .quick-icon-btn.active {
        background: var(--color-primary);
        color: #fff;
      }
      .quick-icon-btn.active .svg-icon {
        stroke: #fff;
      }
      .quick-icon-btn:active {
        transform: scale(0.9);
      }

      .hero-card {
        border-radius: 28px;
        padding: 24px 48px;
        display: flex;
        flex-direction: column;
        color: #111;
        position: relative;
        flex: 1;
        min-height: 0;
        cursor: pointer;
        transition: background 0.4s ease;
        overflow: hidden;
        align-items: center;
        text-align: center;
      }
      .hero-card-inner {
        transition: transform 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 100%;
      }
      .hero-card:active .hero-card-inner {
        transform: scale(0.96);
      }
      .hero-card .icon-circle {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto 0;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      .hero-card-title {
        font-family: 'Georgia', 'Playfair Display', serif;
        font-weight: 800;
        font-size: 1.8rem;
        line-height: 1.2;
        margin-bottom: 4px;
      }
      .hero-card-desc {
        font-size: 0.95rem;
        font-weight: 500;
        opacity: 0.85;
        margin-bottom: 24px;
      }
      .hero-card-btn {
        background: #111;
        color: #fff;
        border-radius: 20px;
        padding: 14px;
        font-weight: 700;
        font-size: 1rem;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        width: 100%;
        margin-top: auto;
      }
      
      .hero-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255,255,255,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        transition: background 0.2s, transform 0.1s;
      }
      .hero-arrow:active {
        background: rgba(255,255,255,0.8);
        transform: translateY(-50%) scale(0.9);
      }
      .hero-arrow.left { left: 8px; }
      .hero-arrow.right { right: 8px; }
      
      .svg-icon {
        width: 50%;
        height: 50%;
      }
      .hero-card .svg-icon {
        width: 50%;
        height: 50%;
      }

      .weekly-streak-container {
        display: flex;
        justify-content: center;
        gap: 6px;
        margin-top: 16px;
        width: 100%;
      }
      .streak-day {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        color: #fff;
      }
      .streak-day.done { background: #4caf50; }
      .streak-day.missed { background: rgba(0,0,0,0.2); }
      .streak-day.future { background: rgba(0,0,0,0.05); color: rgba(0,0,0,0.4); border: 1px dashed rgba(0,0,0,0.2); }
    </style>
  `;

  const khabarSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13h4"></path><path d="M8 17h8"></path></svg>`;
  const baghSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path><path d="M4.9 4.9l14.2 14.2"></path><path d="M4.9 19.1l14.2-14.2"></path></svg>`;
  const lagoriSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#689F38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"></path><path d="M8 17h8"></path><path d="M9 13h6"></path><path d="M10 9h4"></path><circle cx="16" cy="5" r="3"></circle></svg>`;
  const penSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#F57F17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path><path d="M14.5 5.5l4 4"></path></svg>`;
  const cameraSvg = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#3949AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;

  const gamesList = [
    { id: 'wordal', title: 'Curiosity', desc: 'Khabar Shabd · Today\'s News', svg: khabarSvg, bg: '#E0C3FC' },
    { id: 'baghchal', title: 'Thinking', desc: 'Bagh Bakri · Strategy', svg: baghSvg, bg: '#FFD194' },
    { id: 'lagori', title: 'Nostalgia', desc: 'Lagori · Stack & Run', svg: lagoriSvg, bg: '#E8F5E9' },
    { id: 'penfight', title: 'Excitement', desc: 'Pen Fight · Fast Skill', svg: penSvg, bg: '#FFF8E1' },
    { id: 'deshkipark', title: 'Discovery', desc: 'Desi Parakh · Odd One Out', svg: cameraSvg, bg: '#E8EAF6' }
  ];

  let currentHeroIndex = 0;

  function renderWeeklyStreak(gameId) {
    const todayIndex = (new Date().getDay() + 6) % 7; 
    const hash = gameId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    let html = '<div class="weekly-streak-container">';
    for (let i = 0; i < 7; i++) {
      let stateClass = '';
      if (i > todayIndex) {
        stateClass = 'future';
      } else if (i === todayIndex) {
        stateClass = isDailyCompleted(gameId) ? 'done' : 'missed';
      } else {
        stateClass = (hash + i) % 3 !== 0 ? 'done' : 'missed';
      }
      html += `<div class="streak-day ${stateClass}">${i + 1}</div>`;
    }
    html += '</div>';
    return html;
  }

  container.innerHTML = `
    ${bentoStyles}
    <div class="bento-container">
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
            ${prog.__lang === 'hi' ? 'EN' : 'हिं'}
          </button>
        </div>
      </div>

      <div class="main-content">
        <!-- Quick Icons Strip -->
        <div class="quick-icons-strip" id="quick-icons">
          ${gamesList.map((g, i) => `
            <div class="quick-icon-btn ${i === currentHeroIndex ? 'active' : ''}" data-index="${i}">
              ${g.svg}
            </div>
          `).join('')}
        </div>

        <!-- Big Hero Card Carousel -->
        <div class="hero-card" id="hero-card" style="background: ${gamesList[currentHeroIndex].bg};" data-game-id="${gamesList[currentHeroIndex].id}">
          <div class="hero-arrow left" id="hero-prev">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <div class="hero-arrow right" id="hero-next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
          <div class="hero-card-inner" id="hero-inner">
            <div class="icon-circle" id="hero-icon">${gamesList[currentHeroIndex].svg}</div>
            <div class="hero-card-title" id="hero-title">${gamesList[currentHeroIndex].title}</div>
            <div class="hero-card-desc" id="hero-desc">${gamesList[currentHeroIndex].desc}</div>
            <div class="hero-card-btn">PLAY NOW</div>
            <div id="hero-weekly-streak" style="width: 100%;">${renderWeeklyStreak(gamesList[currentHeroIndex].id)}</div>
          </div>
        </div>
      </div>
    </div>
    ${renderBottomNav('home')}
  `;

  const heroCard = container.querySelector('#hero-card');
  const heroInner = container.querySelector('#hero-inner');
  const heroIcon = container.querySelector('#hero-icon');
  const heroTitle = container.querySelector('#hero-title');
  const heroDesc = container.querySelector('#hero-desc');
  const heroWeeklyStreak = container.querySelector('#hero-weekly-streak');
  const quickIcons = container.querySelectorAll('.quick-icon-btn');

  function updateHero(index) {
    currentHeroIndex = index;
    const game = gamesList[index];
    
    heroCard.style.background = game.bg;
    heroCard.dataset.gameId = game.id;
    heroIcon.innerHTML = game.svg;
    heroTitle.textContent = game.title;
    heroDesc.textContent = game.desc;
    heroWeeklyStreak.innerHTML = renderWeeklyStreak(game.id);

    quickIcons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  container.querySelector('#hero-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    playSfx('click');
    const newIdx = (currentHeroIndex - 1 + gamesList.length) % gamesList.length;
    updateHero(newIdx);
  });

  container.querySelector('#hero-next').addEventListener('click', (e) => {
    e.stopPropagation();
    playSfx('click');
    const newIdx = (currentHeroIndex + 1) % gamesList.length;
    updateHero(newIdx);
  });

  quickIcons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSfx('click');
      updateHero(parseInt(btn.dataset.index));
    });
  });

  // ---- Event Listeners ----
  const profileBtn = container.querySelector('#hub-profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      playSfx('click');
      navigate('/profile');
    });
  }

  const langBtn = container.querySelector('#hub-lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const { toggleLang } = require_i18n();
      toggleLang();
      playSfx('tap');
      renderHub(container);
    });
  }

  // Play button click (delegated via hero-card)
  heroCard.addEventListener('click', () => {
    playSfx('tap');
    navigate('/game/' + heroCard.dataset.gameId);
  });

  attachBottomNavListeners(container, navigate);
}

function require_i18n() {
  return import('../i18n/index.js').then ? 
    { toggleLang: () => import('../i18n/index.js').then(m => m.toggleLang()) } :
    { toggleLang: () => {} };
}

export default renderHub;
