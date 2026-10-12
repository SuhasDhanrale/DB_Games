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
import { consumeTorchPulse, torchIcon } from '../ui/torch.js';
import { openProgress } from './profile.js';
import { openSettings } from './settings.js';
import { openNews } from '../ui/news-reader.js';
import { readRound } from '../systems/play-history.js';
import { getGame } from '../games/registry.js';
import { prefetchGame } from '../games/game-assets.js';

export function renderHub(container) {
  container.classList.add('screen--no-scroll', 'hub-screen');
  const prog = getProgression();
  const currentLang = getLang();
  const pulseTorch = consumeTorchPulse();


  // Flat, game-specific corner illustrations. Decorative SVGs stay out of the accessibility tree.
  const svg = (body, viewBox = '0 0 140 140') => '<svg viewBox="' + viewBox + '" fill="none" aria-hidden="true">' + body + '</svg>';
  const g1Icon = svg('<g transform="rotate(-12 70 70)"><rect x="20" y="35" width="49" height="49" rx="6" fill="#faf8f1" stroke="#827391" stroke-width="2"/><rect x="76" y="35" width="49" height="49" rx="6" fill="#c1b3d1" stroke="#827391" stroke-width="2"/><rect x="20" y="91" width="49" height="49" rx="6" fill="#c1b3d1" stroke="#827391" stroke-width="2"/><rect x="76" y="91" width="49" height="49" rx="6" fill="#faf8f1" stroke="#827391" stroke-width="2"/><g fill="#51415e" font-family="Noto Sans Devanagari, sans-serif" font-size="30" text-anchor="middle"><text x="44" y="72">अ</text><text x="100" y="72">क</text><text x="44" y="129">र</text><text x="100" y="129">म</text></g></g>');
  const g2Icon = nitiFace;
  const g3Icon = svg('<path d="M19 110 Q37 43 117 33" stroke="#849d7c" stroke-width="2" stroke-dasharray="5 6"/><g transform="rotate(35 75 77)"><rect x="66" y="14" width="13" height="44" rx="3" fill="#526f5c"/><rect x="57" y="51" width="31" height="71" rx="6" fill="#d9bb83" stroke="#846d48" stroke-width="2"/><path d="M63 58 L63 110 M82 58 L82 110" stroke="#baa071" stroke-width="2"/><rect x="61" y="70" width="23" height="15" fill="#526f5c"/></g><circle cx="109" cy="107" r="24" fill="#a94b3f" stroke="#733e36" stroke-width="2"/><path d="M96 87 Q95 109 120 127 M100 85 Q100 109 124 123" stroke="#f0d6bc" stroke-width="2" stroke-dasharray="3 3"/>');
  const g4Icon = svg('<g transform="rotate(-12 75 80)"><rect x="15" y="15" width="132" height="132" rx="8" fill="#ae7f59" stroke="#795c43" stroke-width="3"/><rect x="25" y="25" width="112" height="112" rx="3" fill="#f4e4c2"/><circle cx="35" cy="35" r="10" fill="#473c32"/><circle cx="127" cy="35" r="10" fill="#473c32"/><circle cx="35" cy="127" r="10" fill="#473c32"/><path d="M48 42 L114 42 M42 48 L42 114" stroke="#9c604b" stroke-width="2"/><circle cx="81" cy="81" r="20" stroke="#9c604b" stroke-width="2"/><circle cx="81" cy="81" r="8" fill="#b95c4c"/><circle cx="55" cy="104" r="12" fill="#fff9e9" stroke="#a8906d" stroke-width="2"/><circle cx="110" cy="91" r="8" fill="#473c32"/><circle cx="104" cy="112" r="8" fill="#b95c4c"/></g>');
  const g5Icon = svg('<g transform="rotate(-8 70 70)"><path d="M44 49 C91 49 49 105 96 105" stroke="#597762" stroke-width="5"/><path d="M44 105 C91 105 49 49 96 49" stroke="#647e9e" stroke-width="5"/><g fill="#faf8f1" stroke="#8394aa" stroke-width="2"><rect x="7" y="30" width="37" height="38" rx="8"/><rect x="96" y="30" width="37" height="38" rx="8"/><rect x="7" y="86" width="37" height="38" rx="8"/><rect x="96" y="86" width="37" height="38" rx="8"/></g><path d="m25 40 9 9-9 9-9-9Z" fill="#597762"/><path d="m114 96 9 9-9 9-9-9Z" fill="#597762"/><circle cx="25" cy="105" r="9" fill="#647e9e"/><circle cx="114" cy="49" r="9" fill="#647e9e"/></g>');

  // 5 Games Configuration (Final 5 Games: Aaj Ka Shabd, Aaj Ki Niti, Aaj Ka Over, Aaj Ka Nishana, Aaj Ki Jodi)
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

    // Check if this day is marked done in progression
    let isDone = Boolean(prog.dailyHistory && prog.dailyHistory[dateStr]);

    if (isToday) {
      const anyGamePlayed = prog.dailyCompleted && Object.values(prog.dailyCompleted).some(Boolean);
      if (anyGamePlayed || prog.lastPlayDate === dateStr) {
        isDone = true;
      }
    }

    const label = currentLang === 'hi' ? dayInfo.hi : dayInfo.en;

    return `
      <span class="weekly-day-col ${isToday ? 'is-today' : ''}">
        <span class="weekly-day-label">${label}</span>
        <span class="weekly-day-dot ${isDone ? 'done' : ''} ${isToday ? 'today-dot' : ''}">
          ${isDone ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
        </span>
      </span>
    `;
  }).join('');

  const descriptions = currentLang === 'hi'
    ? ['शब्द पहचानें', 'सोचें और चुनें', 'छह गेंदों का रोमांच', 'निशाना लगाएं', 'कड़ियां खोजें']
    : ['Find the word', 'Think and choose', 'Six balls. Your shot.', 'Aim your striker', 'Find the connections'];

  function renderSpaciousCard(game) {
    const isDone = isDailyCompleted(game.id);
    const round = readRound(game.id);
    const inProgress = !isDone && round && !round.isGameOver && !round.confirmed && !round.isCompleted && !round.completed && (round.currentRowTokens?.length || round.boardGuesses?.length || round.selectedOption || round.matchedPairIds?.length || round.started || round.shots);
    const title = t(game.titleKey);
    const titleWords = title.split(' ');
    const gameName = titleWords.pop();
    const dailyPrefix = titleWords.join(' ');
    return `
      <button type="button" class="game-bento-card ${game.cardClass}" data-game-id="${game.id}" aria-label="${title}${isDone ? ' — ' + t('hub.done') : ''}">
        <span class="card-bottom-info">
          <span class="card-game-title"><span class="card-title-prefix">${dailyPrefix}</span> <strong class="card-title-name">${gameName}</strong></span>
          <span class="card-description">${descriptions[game.num - 1]}</span>
          ${inProgress ? `<span class="card-resume">${currentLang === 'hi' ? 'जारी रखें →' : 'Continue →'}</span>` : ''}
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
        <button type="button" id="hub-progress" class="hub-header-pill${pulseTorch ? ' hub-header-pill--celebrate' : ''}" title="${currentLang === 'hi' ? 'मेरे खेल' : 'My play'}" aria-label="${currentLang === 'hi' ? 'मेरे खेल' : 'My play'} · ${t('torch.count', { count: prog.streak })}">
          ${torchIcon}
          ${prog.streak}
        </button>
        <button type="button" class="hub-settings" id="hub-settings" aria-label="${t('settings.title')}" title="${t('settings.title')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--family-paper)"/><circle cx="15" cy="17" r="3" fill="var(--family-paper)"/></svg></button>
        <button type="button" class="hub-icon-circle-btn" id="hub-lang-toggle" aria-label="${currentLang === 'hi' ? 'Switch to English' : 'हिन्दी में बदलें'}">${currentLang === 'hi' ? 'EN' : 'हिं'}</button>
      </div>

      <!-- Weekly Day Tracker (MON - SON) -->
      <div class="weekly-tracker-wrap">
        <button type="button" class="weekly-tracker-card" id="hub-week" aria-label="${currentLang === 'hi' ? 'इस हफ़्ते की प्रगति देखें' : 'View this week’s play'}">
          ${daysHtml}
        </button>
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
      <div class="hub-footer"><span>${currentLang === 'hi' ? 'डेमो · संस्करण' : 'Demo · edition'} ${window.DBJamDemo.index + 1}</span><button type="button" id="hub-stories">${currentLang === 'hi' ? 'खेल और कहानियाँ' : 'Games and stories'} <span aria-hidden="true">↗</span></button></div>
    </div>
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

  container.querySelector('#hub-progress').addEventListener('click', openProgress);
  container.querySelector('#hub-week').addEventListener('click', openProgress);
  container.querySelector('#hub-settings').addEventListener('click', () => openSettings(() => renderHub(container)));
  container.querySelector('#hub-stories').addEventListener('click', () => openNews());
}

export default renderHub;
