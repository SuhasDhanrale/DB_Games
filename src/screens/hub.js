/* ============================================================
   Hub Screen — Main game launcher / home screen (5-Game Bento Grid)
   Matte game artwork, compact header, and responsive bento layout
   ============================================================ */

import { t, toggleLang, getLang } from '../i18n/index.js';
import '../styles/hub.css';
import nitiFace from '../assets/intro/niti.svg?raw';
import { navigate } from '../core/router.js';
import { playSfx } from '../core/audio.js';
import { getProgression, isDailyCompleted } from '../systems/progression.js';
import { renderBottomNav, attachBottomNavListeners } from '../ui/components.js';
import { playOpening } from '../ui/opening.js';
import { getGame } from '../games/registry.js';
import { prefetchGame } from '../games/game-assets.js';

export function renderHub(container) {
  container.classList.add('screen--no-scroll', 'hub-screen');
  const prog = getProgression();
  const currentLang = getLang();


  // Flat, game-specific corner illustrations. Decorative SVGs stay out of the accessibility tree.
  const svg = (body, viewBox = '0 0 140 140') => '<svg viewBox="' + viewBox + '" fill="none" aria-hidden="true">' + body + '</svg>';
  const g1Icon = svg('<g transform="rotate(-12 70 70)"><rect x="20" y="35" width="49" height="49" rx="6" fill="#faf8f1" stroke="#827391" stroke-width="2"/><rect x="76" y="35" width="49" height="49" rx="6" fill="#c1b3d1" stroke="#827391" stroke-width="2"/><rect x="20" y="91" width="49" height="49" rx="6" fill="#c1b3d1" stroke="#827391" stroke-width="2"/><rect x="76" y="91" width="49" height="49" rx="6" fill="#faf8f1" stroke="#827391" stroke-width="2"/><g fill="#51415e" font-family="Noto Sans Devanagari, sans-serif" font-size="30" text-anchor="middle"><text x="44" y="72">अ</text><text x="100" y="72">क</text><text x="44" y="129">र</text><text x="100" y="129">म</text></g></g>');
  const g2Icon = nitiFace;
  const g3Icon = svg('<path d="M19 110 Q37 43 117 33" stroke="#849d7c" stroke-width="2" stroke-dasharray="5 6"/><g transform="rotate(35 75 77)"><rect x="66" y="14" width="13" height="44" rx="3" fill="#526f5c"/><rect x="57" y="51" width="31" height="71" rx="6" fill="#d9bb83" stroke="#846d48" stroke-width="2"/><path d="M63 58 L63 110 M82 58 L82 110" stroke="#baa071" stroke-width="2"/><rect x="61" y="70" width="23" height="15" fill="#526f5c"/></g><circle cx="109" cy="107" r="24" fill="#a94b3f" stroke="#733e36" stroke-width="2"/><path d="M96 87 Q95 109 120 127 M100 85 Q100 109 124 123" stroke="#f0d6bc" stroke-width="2" stroke-dasharray="3 3"/>');
  const g4Icon = svg('<g transform="rotate(-12 75 80)"><rect x="15" y="15" width="132" height="132" rx="8" fill="#ae7f59" stroke="#795c43" stroke-width="3"/><rect x="25" y="25" width="112" height="112" rx="3" fill="#f4e4c2"/><circle cx="35" cy="35" r="10" fill="#473c32"/><circle cx="127" cy="35" r="10" fill="#473c32"/><circle cx="35" cy="127" r="10" fill="#473c32"/><path d="M48 42 L114 42 M42 48 L42 114" stroke="#9c604b" stroke-width="2"/><circle cx="81" cy="81" r="20" stroke="#9c604b" stroke-width="2"/><circle cx="81" cy="81" r="8" fill="#b95c4c"/><circle cx="55" cy="104" r="12" fill="#fff9e9" stroke="#a8906d" stroke-width="2"/><circle cx="110" cy="91" r="8" fill="#473c32"/><circle cx="104" cy="112" r="8" fill="#b95c4c"/></g>');
  const g5Icon = svg('<g transform="rotate(-8 70 70)"><path d="M44 49 C91 49 49 105 96 105" stroke="#597762" stroke-width="5"/><path d="M44 105 C91 105 49 49 96 49" stroke="#647e9e" stroke-width="5"/><g fill="#faf8f1" stroke="#8394aa" stroke-width="2"><rect x="7" y="30" width="37" height="38" rx="8"/><rect x="96" y="30" width="37" height="38" rx="8"/><rect x="7" y="86" width="37" height="38" rx="8"/><rect x="96" y="86" width="37" height="38" rx="8"/></g><path d="m25 40 9 9-9 9-9-9Z" fill="#597762"/><path d="m114 96 9 9-9 9-9-9Z" fill="#597762"/><circle cx="25" cy="105" r="9" fill="#647e9e"/><circle cx="114" cy="49" r="9" fill="#647e9e"/></g>');

  // 5 Games Configuration (Final 5 Games: Aaj Ka Shabd, Aaj Ki Niti, Super Over, Carrom, Jodo)
  const games = [
    {
      num: 1,
      id: 'wordal',
      titleKey: 'game1.title',
      moodKey: 'mood.curiosity',
      cardClass: 'card-game-1',
      artIcon: g1Icon,
    },
    {
      num: 2,
      id: 'niti',
      titleKey: 'game2.title',
      moodKey: 'mood.wisdom',
      cardClass: 'card-game-2',
      artIcon: g2Icon,
    },
    {
      num: 3,
      id: 'cricket',
      titleKey: 'game3.title',
      moodKey: 'mood.excitement',
      cardClass: 'card-game-3',
      artIcon: g3Icon,
    },
    {
      num: 4,
      id: 'carrom',
      titleKey: 'game4.title',
      moodKey: 'mood.focus',
      cardClass: 'card-game-4',
      artIcon: g4Icon,
    },
    {
      num: 5,
      id: 'jodo',
      titleKey: 'game5.title',
      moodKey: 'mood.discovery',
      cardClass: 'card-game-5',
      artIcon: g5Icon,
    },
  ];

  // Weekly Days (Mon to Sun as shown in wireframe)
  const weekDays = [
    { key: 'day.mon', en: 'MON', hi: 'सोम' },
    { key: 'day.tue', en: 'TUE', hi: 'मंगल' },
    { key: 'day.wed', en: 'WED', hi: 'बुध' },
    { key: 'day.thu', en: 'THU', hi: 'गुरु' },
    { key: 'day.fri', en: 'FRI', hi: 'शुक्र' },
    { key: 'day.sat', en: 'SAT', hi: 'शनि' },
    { key: 'day.sun', en: 'SUN', hi: 'रवि' },
  ];

  const now = new Date(window.DBJamDemo.date);
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
          ${isDone ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
        </div>
      </div>
    `;
  }).join('');

  const descriptions = currentLang === 'hi'
    ? ['शब्द पहचानें', 'सोचें और चुनें', 'छह गेंदों का रोमांच', 'निशाना लगाएं', 'कड़ियां खोजें']
    : ['Find the word', 'Think and choose', 'Six balls. Your shot.', 'Aim your striker', 'Find the connections'];

  function renderSpaciousCard(game) {
    const isDone = isDailyCompleted(game.id);
    return `
      <button type="button" class="game-bento-card ${game.cardClass}" data-game-id="${game.id}" aria-label="${t(game.titleKey)}${isDone ? ' — ' + t('hub.done') : ''}">
        <span class="card-bottom-info">
          <span class="card-game-title">${t(game.titleKey)}</span>
          <span class="card-description">${descriptions[game.num - 1]}</span>
        </span>
        <span class="card-art-float">${game.artIcon}</span>
        ${isDone ? '<span class="game-status-dot" title="' + t('hub.done') + '"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg></span>' : ''}
      </button>
    `;
  }
  const renderTallCard = renderSpaciousCard;

  // Find games
  const g1 = games.find(g => g.num === 1);
  const g2 = games.find(g => g.num === 2);
  const g3 = games.find(g => g.num === 3);
  const g4 = games.find(g => g.num === 4);
  const g5 = games.find(g => g.num === 5);

  container.innerHTML = `
    <div class="bento-container">
      <div class="bento-header">
        <h1 class="hub-tagline">${t('hub.daily_tagline')}</h1>
        <div class="hub-header-pill" title="${t('hub.torch_hint')}" aria-label="${currentLang === 'hi' ? prog.streak + ' दिन की स्ट्रीक। ' : prog.streak + ' day streak. '}${t('hub.torch_hint')}">
          <svg viewBox="0 0 24 36" fill="none" aria-hidden="true"><path d="M13 1 C18 8 10 9 18 12 C23 17 19 23 12 23 C4 23 1 16 6 11 C6 17 12 12 13 1Z" fill="#bc6238"/><path d="M12 12 C14 16 17 16 15 20 C13 23 8 21 9 18Z" fill="#f1c773"/><path d="M6 23 H18 L15 27 H9Z" fill="#8a7150"/><path d="M9 27 H15 L14 35 H10Z" fill="#62533f"/></svg>
          ${prog.streak}
        </div>
        <button type="button" class="hub-replay" id="hub-replay" aria-label="${t('opening.replay')}" title="${t('opening.replay')}">↻</button>
        <button type="button" class="hub-icon-circle-btn" id="hub-lang-toggle" aria-label="${currentLang === 'hi' ? 'Switch to English' : 'हिन्दी में बदलें'}">${currentLang === 'hi' ? 'EN' : 'हिं'}</button>
      </div>

      <!-- Weekly Day Tracker (MON - SON) -->
      <div class="weekly-tracker-wrap">
        <div class="weekly-tracker-card">
          ${daysHtml}
        </div>
      </div>

      <!-- 5 Games Bento Grid Area -->
      <div class="bento-games-area">
        <!-- Top Section (Left: Game 1 & Game 3 stacked, Right: Game 2 tall) -->
        <div class="bento-row-top">
          <div class="bento-col-left">
            ${renderSpaciousCard(g1)}
            ${renderSpaciousCard(g3)}
          </div>
          ${renderTallCard(g2)}
        </div>

        <!-- Bottom Section (Left: Game 4 wide, Right: Game 5) -->
        <div class="bento-row-bottom">
          ${renderSpaciousCard(g4)}
          ${renderSpaciousCard(g5)}
        </div>
      </div>
    </div>
    ${renderBottomNav('home')}
  `;

  // Attach card click handlers
  const cards = container.querySelectorAll('.game-bento-card');
  cards.forEach((card) => {
    const warmGame = () => prefetchGame(getGame(card.dataset.gameId)?.htmlFile);
    card.addEventListener('pointerenter', warmGame, { once: true });
    card.addEventListener('pointerdown', warmGame, { once: true, passive: true });
    card.addEventListener('click', () => {
      playSfx('tap');
      navigate('/game/' + card.dataset.gameId);
    });
  });

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
  container.querySelector('#hub-replay').addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'loading-screen';
    container.appendChild(overlay);
    playOpening(overlay, () => container.querySelector('#hub-replay')?.focus());
  });
  attachBottomNavListeners(container, navigate);
}

export default renderHub;
