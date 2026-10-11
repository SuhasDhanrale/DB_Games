/* ============================================================
   Hub Screen — Main game launcher / home screen (5-Game Bento Grid)
   High Character · Tactile Minimalism · Spacious & Un-cramped
   ============================================================ */

import { t, toggleLang, getLang } from '../i18n/index.js';
import { bus, Events } from '../core/events.js';
import { navigate } from '../core/router.js';
import { playSfx } from '../core/audio.js';
import { getProgression, isDailyCompleted } from '../systems/progression.js';
import { renderBottomNav, attachBottomNavListeners } from '../ui/components.js';

export function renderHub(container) {
  container.classList.add('screen--no-scroll');
  const prog = getProgression();
  const currentLang = getLang();

  // Custom Styles for Responsive, Scalable & No-Scroll Bento Grid
  const bentoStyles = `
    <style>
      .bento-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
        min-height: 0;
        overflow: hidden;
        background: #F8F9FA;
      }

      .bento-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: clamp(8px, 1.4vh, 14px) clamp(14px, 3.5vw, 18px) clamp(4px, 0.8vh, 8px) clamp(14px, 3.5vw, 18px);
        flex-shrink: 0;
      }

      .hub-header-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #FFFFFF;
        padding: clamp(5px, 0.8vh, 7px) clamp(12px, 2.5vw, 16px);
        border-radius: 9999px;
        font-weight: 800;
        font-size: clamp(0.92rem, 1.8vh, 1.05rem);
        color: #EA580C;
        border: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }

      .hub-icon-circle-btn {
        width: clamp(38px, 4.8vh, 44px);
        height: clamp(38px, 4.8vh, 44px);
        border-radius: 50%;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        font-weight: 800;
        font-size: clamp(0.78rem, 1.4vh, 0.85rem);
        color: #0F172A;
        cursor: pointer;
        transition: transform 0.15s, background 0.15s;
      }
      .hub-icon-circle-btn:active {
        transform: scale(0.92);
      }

      /* Weekly Day Tracker Strip */
      .weekly-tracker-wrap {
        padding: 0 clamp(12px, 3vw, 16px) clamp(6px, 1.1vh, 10px) clamp(12px, 3vw, 16px);
        flex-shrink: 0;
      }

      .weekly-tracker-card {
        background: #FFFFFF;
        border-radius: clamp(14px, 1.8vh, 18px);
        padding: clamp(6px, 0.9vh, 10px) clamp(10px, 2.5vw, 14px);
        border: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .weekly-day-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: clamp(3px, 0.5vh, 6px);
        flex: 1;
        cursor: default;
      }

      .weekly-day-label {
        font-size: clamp(0.6rem, 0.95vh, 0.68rem);
        font-weight: 800;
        letter-spacing: 0.04em;
        color: #94A3B8;
        text-transform: uppercase;
        transition: color 0.2s;
      }

      .weekly-day-col.is-today .weekly-day-label {
        color: #0F172A;
        font-weight: 900;
      }

      .weekly-day-dot {
        width: clamp(22px, 3.2vh, 28px);
        height: clamp(22px, 3.2vh, 28px);
        border-radius: 50%;
        background: #E2E8F0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
        position: relative;
      }

      .weekly-day-dot.done {
        background: #16A34A;
        box-shadow: 0 3px 8px rgba(22, 163, 74, 0.4);
      }

      .weekly-day-dot.today-dot {
        background: #FFFFFF;
        border: 2px solid #0F172A;
        box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.15);
      }

      .weekly-day-dot.today-dot::after {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #0F172A;
      }

      .weekly-day-dot.done.today-dot {
        background: #16A34A;
        border: none;
        box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #0F172A, 0 3px 8px rgba(22, 163, 74, 0.4);
      }
      .weekly-day-dot.done.today-dot::after {
        display: none;
      }

      /* 5-Game Bento Grid — Flexible, Responsive & Completely No-Scroll */
      .bento-games-area {
        display: flex;
        flex-direction: column;
        gap: clamp(8px, 1.2vh, 14px);
        padding: 0 clamp(12px, 3vw, 16px) clamp(8px, 1.2vh, 14px) clamp(12px, 3vw, 16px);
        flex: 1;
        min-height: 0;
      }

      .bento-row-top {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(8px, 1.3vw, 14px);
        flex: 1.6;
        min-height: 0;
      }

      .bento-col-left {
        display: flex;
        flex-direction: column;
        gap: clamp(8px, 1.2vh, 14px);
        height: 100%;
        min-height: 0;
      }

      .bento-row-bottom {
        display: grid;
        grid-template-columns: 1.35fr 1fr;
        gap: clamp(8px, 1.3vw, 14px);
        flex: 1;
        min-height: 0;
      }

      /* Base Game Bento Card */
      .game-bento-card {
        position: relative;
        border-radius: clamp(16px, 2.2vh, 22px);
        overflow: hidden;
        border: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: clamp(10px, 1.5vh, 16px);
        transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s;
        user-select: none;
        -webkit-user-select: none;
        min-height: 0;
      }

      .game-bento-card:hover {
        transform: translateY(-2px);
      }

      .game-bento-card:active {
        transform: scale(0.97);
      }

      .card-game-1 {
        flex: 1;
        min-height: 0;
        background: linear-gradient(140deg, #4F46E5 0%, #3730A3 100%);
        box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.35);
      }

      .card-game-2 {
        height: 100%;
        min-height: 0;
        background: linear-gradient(145deg, #F97316 0%, #EA580C 50%, #C2410C 100%);
        box-shadow: 0 8px 20px -4px rgba(234, 88, 12, 0.38);
      }

      .card-game-3 {
        flex: 1;
        min-height: 0;
        background: linear-gradient(140deg, #059669 0%, #047857 50%, #065F46 100%);
        box-shadow: 0 8px 20px -4px rgba(5, 150, 105, 0.35);
      }

      .card-game-4 {
        height: 100%;
        min-height: 0;
        background: linear-gradient(140deg, #E11D48 0%, #BE123C 50%, #9F1239 100%);
        box-shadow: 0 8px 20px -4px rgba(225, 29, 72, 0.35);
      }

      .card-game-5 {
        height: 100%;
        min-height: 0;
        background: linear-gradient(140deg, #2563EB 0%, #1D4ED8 100%);
        box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.35);
      }

      /* Card Top Bar (Status Dot + Subtag Pill) */
      .card-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 3;
        position: relative;
        flex-shrink: 0;
      }

      /* Status Dot in top-left */
      .game-status-dot {
        width: clamp(18px, 2.3vh, 22px);
        height: clamp(18px, 2.3vh, 22px);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, background 0.2s;
        flex-shrink: 0;
      }

      .game-status-dot.dot-done {
        background: #22C55E;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.95), 0 3px 8px rgba(34, 197, 94, 0.5);
      }

      .game-status-dot.dot-left {
        background: rgba(0, 0, 0, 0.25);
        border: 2px solid rgba(255, 255, 255, 0.7);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }
      .game-status-dot.dot-left::after {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.85);
      }

      /* Subtag Pill Tag in top-right */
      .card-genre-pill {
        background: rgba(255, 255, 255, 0.22);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: 9999px;
        padding: clamp(2px, 0.35vh, 4px) clamp(8px, 1.5vw, 11px);
        font-size: clamp(0.58rem, 1vh, 0.68rem);
        font-weight: 800;
        letter-spacing: 0.03em;
        color: #FFFFFF;
        line-height: 1.1;
        flex-shrink: 0;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
      }

      /* Background Pattern Overlay */
      .card-bg-pattern {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }

      /* Floating Accent Art */
      .card-art-float {
        position: absolute;
        right: clamp(10px, 1.8vw, 14px);
        bottom: clamp(6px, 1.2vh, 12px);
        z-index: 2;
        pointer-events: none;
        opacity: 0.92;
        transition: transform 0.2s;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
      }

      .card-art-float svg {
        width: clamp(34px, 4.6vh, 46px);
        height: clamp(34px, 4.6vh, 46px);
      }

      .game-bento-card:hover .card-art-float {
        transform: scale(1.08);
      }

      /* Game 2 (Tall Card) Center Art */
      .card-game-2-center-art {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        min-height: 0;
        z-index: 2;
        pointer-events: none;
        margin: clamp(4px, 1vh, 10px) 0;
        transition: transform 0.2s;
      }

      .card-game-2-center-art svg {
        width: clamp(52px, 8.5vh, 76px);
        height: clamp(52px, 8.5vh, 76px);
      }

      .card-game-2:hover .card-game-2-center-art {
        transform: scale(1.08);
      }

      /* Bottom Labels */
      .card-bottom-info {
        display: flex;
        flex-direction: column;
        z-index: 3;
        position: relative;
        max-width: 82%;
        flex-shrink: 0;
      }

      .card-game-2 .card-bottom-info {
        max-width: 100%;
      }

      .card-game-title {
        font-family: 'Noto Sans Devanagari', 'Inter', system-ui, sans-serif;
        font-size: clamp(0.94rem, 2.1vh, 1.24rem);
        font-weight: 900;
        letter-spacing: -0.01em;
        color: #FFFFFF;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.22);
      }
    </style>
  `;

  // --- Card Background Patterns ---

  // Game 1: Crossword letter matrix
  const g1Pattern = `
    <svg class="card-bg-pattern" viewBox="0 0 200 200" fill="none" preserveAspectRatio="none">
      <rect x="18" y="22" width="22" height="22" rx="5" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <rect x="44" y="22" width="22" height="22" rx="5" fill="rgba(255,255,255,0.14)"/>
      <rect x="70" y="22" width="22" height="22" rx="5" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <rect x="18" y="48" width="22" height="22" rx="5" fill="rgba(255,255,255,0.14)"/>
      <circle cx="160" cy="35" r="2.5" fill="rgba(255,255,255,0.25)"/>
      <path d="M140 22 L143 30 L151 33 L143 36 L140 44 L137 36 L129 33 L137 30 Z" fill="rgba(255,255,255,0.18)"/>
      <text x="185" y="130" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="900" font-size="38" fill="rgba(255,255,255,0.08)" text-anchor="end">शब्द</text>
    </svg>
  `;
  const g1Icon = `
    <svg width="44" height="44" viewBox="0 0 54 54" fill="none">
      <rect x="6" y="8" width="42" height="38" rx="8" fill="rgba(255,255,255,0.18)" stroke="#FFFFFF" stroke-width="2.5"/>
      <rect x="13" y="15" width="12" height="10" rx="3" fill="#FFFFFF"/>
      <rect x="29" y="15" width="12" height="10" rx="3" fill="rgba(255,255,255,0.45)"/>
      <rect x="13" y="29" width="12" height="10" rx="3" fill="rgba(255,255,255,0.45)"/>
      <rect x="29" y="29" width="12" height="10" rx="3" fill="#FFFFFF"/>
    </svg>
  `;

  // Game 2: Neeti (Sacred flame, mandala aura, wisdom rays, and scroll watermark)
  const g2Pattern = `
    <svg class="card-bg-pattern" viewBox="0 0 200 350" fill="none" preserveAspectRatio="none">
      <circle cx="100" cy="110" r="90" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" stroke-dasharray="4 4"/>
      <circle cx="100" cy="110" r="60" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
      <circle cx="100" cy="110" r="30" fill="rgba(255,255,255,0.06)"/>
      <path d="M30 290 Q 100 240 170 290" stroke="rgba(255,255,255,0.14)" stroke-width="2" fill="none"/>
      <path d="M15 320 Q 100 260 185 320" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" fill="none"/>
      <text x="100" y="280" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="900" font-size="44" fill="rgba(255,255,255,0.09)" text-anchor="middle" letter-spacing="4">नीति</text>
    </svg>
  `;
  const g2Icon = `
    <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
      <circle cx="38" cy="38" r="32" fill="rgba(255,255,255,0.12)" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 4"/>
      <circle cx="38" cy="38" r="23" fill="rgba(254,240,138,0.2)"/>
      <path d="M18 48 C 24 44, 32 46, 38 48 C 44 46, 52 44, 58 48 L 56 55 C 50 51, 44 53, 38 55 C 32 53, 26 51, 20 55 Z" fill="#FFFFFF"/>
      <path d="M25 43 C 25 39, 31 35, 38 35 C 45 35, 51 39, 51 43 C 51 47, 43 50, 38 50 C 33 50, 25 47, 25 43 Z" fill="#FEF08A"/>
      <path d="M38 21 C 35 27, 33 30, 33 34 C 33 37, 35 39, 38 39 C 41 39, 43 37, 43 34 C 43 30, 41 27, 38 21 Z" fill="#FFFFFF"/>
      <path d="M38 25 C 36.5 29, 35.5 31, 35.5 34 C 35.5 36, 36.5 37.5, 38 37.5 C 39.5 37.5, 40.5 36, 40.5 34 C 40.5 31, 39.5 29, 38 25 Z" fill="#F59E0B"/>
      <path d="M49 16 Q 43 28 35 40 L 37 42 Q 47 30 53 18 Z" fill="#FFFFFF" opacity="0.95"/>
    </svg>
  `;

  // Game 3: Cricket (Pitch crease, leather ball trajectory & stadium lights)
  const g3Pattern = `
    <svg class="card-bg-pattern" viewBox="0 0 200 200" fill="none" preserveAspectRatio="none">
      <line x1="20" y1="140" x2="180" y2="140" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <line x1="50" y1="125" x2="50" y2="155" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <line x1="150" y1="125" x2="150" y2="155" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <path d="M-10 60 Q 90 10 210 90" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-dasharray="5 5" fill="none"/>
      <circle cx="100" cy="190" r="85" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <text x="180" y="70" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="900" font-size="34" fill="rgba(255,255,255,0.08)" text-anchor="end">सुपर</text>
    </svg>
  `;
  const g3Icon = `
    <svg width="48" height="48" viewBox="0 0 54 54" fill="none">
      <path d="M12 44 L 28 28 L 33 33 L 17 49 Z" fill="#FFFFFF"/>
      <path d="M28 28 L 34 22 L 36 24 L 30 30 Z" fill="#FDE68A"/>
      <line x1="33" y1="23" x2="42" y2="14" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
      <circle cx="38" cy="38" r="10" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M31 38 Q 38 31 45 38" stroke="#FFFFFF" stroke-width="1.8" stroke-dasharray="2 2" fill="none"/>
      <path d="M22 24 L 24 18 L 26 24 L 32 26 L 26 28 L 24 34 L 22 28 L 16 26 Z" fill="#FEF08A"/>
    </svg>
  `;

  // Game 4: Carrom (Concentric circle board pattern, foul lines, pockets)
  const g4Pattern = `
    <svg class="card-bg-pattern" viewBox="0 0 300 200" fill="none" preserveAspectRatio="none">
      <circle cx="150" cy="100" r="55" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <circle cx="150" cy="100" r="30" stroke="rgba(255,255,255,0.2)" stroke-width="1.8"/>
      <circle cx="150" cy="100" r="10" fill="rgba(255,255,255,0.18)"/>
      <line x1="40" y1="30" x2="260" y2="30" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <line x1="40" y1="170" x2="260" y2="170" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <circle cx="30" cy="30" r="14" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      <circle cx="270" cy="30" r="14" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      <text x="240" y="140" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="900" font-size="34" fill="rgba(255,255,255,0.08)" letter-spacing="4">कैरम</text>
    </svg>
  `;
  const g4Icon = `
    <svg width="48" height="48" viewBox="0 0 54 54" fill="none">
      <circle cx="23" cy="31" r="15" fill="#FFFFFF" stroke="#FDE047" stroke-width="2.5"/>
      <circle cx="23" cy="31" r="8" fill="rgba(225,29,72,0.18)" stroke="#E11D48" stroke-width="1.5"/>
      <circle cx="38" cy="19" r="9" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="38" cy="19" r="4" fill="#FEF08A"/>
      <circle cx="17" cy="16" r="6" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5"/>
      <path d="M29 26 L 33 22" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `;

  // Game 5: Jodo (Interconnected constellation network nodes)
  const g5Pattern = `
    <svg class="card-bg-pattern" viewBox="0 0 200 200" fill="none" preserveAspectRatio="none">
      <line x1="30" y1="40" x2="110" y2="70" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="110" y1="70" x2="170" y2="40" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <line x1="110" y1="70" x2="90" y2="150" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <line x1="90" y1="150" x2="160" y2="140" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <circle cx="30" cy="40" r="6" fill="rgba(255,255,255,0.25)"/>
      <circle cx="110" cy="70" r="8" fill="rgba(255,255,255,0.3)"/>
      <circle cx="170" cy="40" r="5" fill="rgba(255,255,255,0.25)"/>
      <circle cx="90" cy="150" r="7" fill="rgba(255,255,255,0.25)"/>
      <circle cx="160" cy="140" r="6" fill="rgba(255,255,255,0.3)"/>
      <text x="180" y="180" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="900" font-size="34" fill="rgba(255,255,255,0.07)" text-anchor="end">जोड़ो</text>
    </svg>
  `;
  const g5Icon = `
    <svg width="46" height="46" viewBox="0 0 54 54" fill="none">
      <circle cx="16" cy="27" r="10" fill="#FFFFFF" stroke="#60A5FA" stroke-width="2.5"/>
      <circle cx="16" cy="27" r="4" fill="#2563EB"/>
      <circle cx="38" cy="27" r="10" fill="#FFFFFF" stroke="#60A5FA" stroke-width="2.5"/>
      <circle cx="38" cy="27" r="4" fill="#2563EB"/>
      <line x1="24" y1="27" x2="30" y2="27" stroke="#FEF08A" stroke-width="4" stroke-linecap="round"/>
      <path d="M27 21 L 28 25 L 32 27 L 28 29 L 27 33 L 26 29 L 22 27 L 26 25 Z" fill="#FEF08A"/>
    </svg>
  `;

  // 5 Games Configuration (Final 5 Games: Aaj Ka Shabd, Aaj Ki Niti, Super Over, Carrom, Jodo)
  const games = [
    {
      num: 1,
      id: 'wordal',
      titleKey: 'game1.title',
      moodKey: 'mood.curiosity',
      cardClass: 'card-game-1',
      bgPattern: g1Pattern,
      artIcon: g1Icon,
    },
    {
      num: 2,
      id: 'niti',
      titleKey: 'game2.title',
      moodKey: 'mood.wisdom',
      cardClass: 'card-game-2',
      bgPattern: g2Pattern,
      artIcon: g2Icon,
    },
    {
      num: 3,
      id: 'cricket',
      titleKey: 'game3.title',
      moodKey: 'mood.excitement',
      cardClass: 'card-game-3',
      bgPattern: g3Pattern,
      artIcon: g3Icon,
    },
    {
      num: 4,
      id: 'carrom',
      titleKey: 'game4.title',
      moodKey: 'mood.focus',
      cardClass: 'card-game-4',
      bgPattern: g4Pattern,
      artIcon: g4Icon,
    },
    {
      num: 5,
      id: 'jodo',
      titleKey: 'game5.title',
      moodKey: 'mood.discovery',
      cardClass: 'card-game-5',
      bgPattern: g5Pattern,
      artIcon: g5Icon,
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
          ${isDone ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Helper to render Card 1, 3, 4, 5 (Spacious with floating right-side art)
  function renderSpaciousCard(game) {
    const isDone = isDailyCompleted(game.id);
    const statusClass = isDone ? 'dot-done' : 'dot-left';

    return `
      <div class="game-bento-card ${game.cardClass}" data-game-id="${game.id}">
        ${game.bgPattern}

        <!-- Top Bar inside Card: Status dot & Subtag Pill -->
        <div class="card-top-bar">
          <div class="game-status-dot ${statusClass}" title="${isDone ? t('hub.done') : t('hub.left')}">
            ${isDone ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
          </div>
          <div class="card-genre-pill">${t(game.moodKey)}</div>
        </div>

        <!-- Floating Art at bottom-right -->
        <div class="card-art-float">
          ${game.artIcon}
        </div>

        <!-- Bottom Labels: Clean Hero Game Title Only -->
        <div class="card-bottom-info">
          <div class="card-game-title">${t(game.titleKey)}</div>
        </div>
      </div>
    `;
  }

  // Helper to render Card 2 (Tall card)
  function renderTallCard(game) {
    const isDone = isDailyCompleted(game.id);
    const statusClass = isDone ? 'dot-done' : 'dot-left';

    return `
      <div class="game-bento-card ${game.cardClass}" data-game-id="${game.id}">
        ${game.bgPattern}

        <!-- Top Bar inside Card: Status dot & Subtag Pill -->
        <div class="card-top-bar">
          <div class="game-status-dot ${statusClass}" title="${isDone ? t('hub.done') : t('hub.left')}">
            ${isDone ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
          </div>
          <div class="card-genre-pill">${t(game.moodKey)}</div>
        </div>

        <!-- Center Arena Graphic -->
        <div class="card-game-2-center-art">
          ${game.artIcon}
        </div>

        <!-- Bottom Labels: Clean Hero Game Title Only -->
        <div class="card-bottom-info">
          <div class="card-game-title">${t(game.titleKey)}</div>
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
        <!-- Profile Avatar -->
        <div id="hub-profile-btn" style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; cursor: pointer; border: 2px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Hanna" style="width:100%; height:100%; object-fit:cover;" />
        </div>
        
        <!-- Streak Pill -->
        <div class="hub-header-pill">
          ${prog.streak} 🔥
        </div>

        <!-- Language Toggle -->
        <button class="hub-icon-circle-btn" id="hub-lang-toggle">
          ${currentLang === 'hi' ? 'EN' : 'हिं'}
        </button>
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
