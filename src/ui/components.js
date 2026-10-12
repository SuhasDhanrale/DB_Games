/* ============================================================
   UI Components — Programmatic UI builders
   Toast system, modals, shared render helpers
   ============================================================ */

import { bus, Events } from '../core/events.js';
import { t } from '../i18n/index.js';
import { playSfx } from '../core/audio.js';
import { openNews } from './news-reader.js';
import { showTorchCelebration } from './torch.js';

// ---- Toast System ----

let toastContainer = null;

export function initToastSystem() {
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  bus.on(Events.TOAST_SHOW, showToast);
}

/**
 * Show a toast notification.
 * @param {{ message: string, icon?: string, duration?: number }} opts
 */
export function showToast({ message, icon = 'ℹ️', duration = 3000 }) {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast__icon">${icon}</span>
    <span class="toast__message">${message}</span>
  `;

  toastContainer.appendChild(toast);
  playSfx('tap');

  setTimeout(() => {
    toast.classList.add('exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}


// ---- Modal System ----

let modalOverlay = null;
let modalCloseCallback = null;

export function initModalSystem() {
  modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="modal" id="global-modal">
      <div class="modal__handle"></div>
      <div class="modal__header">
        <h3 class="modal__title" id="modal-title"></h3>
        <button class="modal__close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal__body" id="modal-body"></div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Close on backdrop click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Close button
  modalOverlay.querySelector('#modal-close-btn').addEventListener('click', closeModal);

  bus.on(Events.MODAL_OPEN, openModal);
  bus.on(Events.MODAL_CLOSE, closeModal);
}

/**
 * Open a modal.
 * @param {{ title: string, content: string|HTMLElement, onClose?: Function }} opts
 */
export function openModal({ title, content, onClose, theme }) {
  if (!modalOverlay) return;

  const modal = modalOverlay.querySelector('#global-modal');
  if (theme) modal.dataset.gameTheme = theme;
  else delete modal.dataset.gameTheme;

  document.getElementById('modal-title').textContent = title;
  const body = document.getElementById('modal-body');
  body.innerHTML = '';

  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }

  modalCloseCallback = onClose || null;
  modalOverlay.classList.add('open');
  playSfx('tap');
}

/**
 * Close the modal.
 */
export function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  if (modalCloseCallback) {
    modalCloseCallback();
    modalCloseCallback = null;
  }
}


// ---- Render Helpers ----

/**
 * Create a screen header.
 * @param {{ title: string, showBack?: boolean, onBack?: Function, action?: { label: string, onClick: Function } }} opts
 * @returns {string} HTML string
 */
export function renderHeader({ title, showBack = false, onBack, action }) {
  const backBtn = showBack
    ? `<button class="screen-header__back" data-action="back">←</button>`
    : '';
  const actionBtn = action
    ? `<button class="screen-header__action" data-action="header-action">${action.label}</button>`
    : '';

  return `
    <div class="screen-header">
      ${backBtn}
      <h1 class="screen-header__title">${title}</h1>
      ${actionBtn}
    </div>
  `;
}

/**
 * Attach header event listeners (call after rendering).
 */
export function attachHeaderListeners(container, { onBack, action }) {
  const backBtn = container.querySelector('[data-action="back"]');
  if (backBtn && onBack) {
    backBtn.addEventListener('click', () => {
      playSfx('tap');
      onBack();
    });
  }

  const actionBtn = container.querySelector('[data-action="header-action"]');
  if (actionBtn && action?.onClick) {
    actionBtn.addEventListener('click', () => {
      playSfx('tap');
      action.onClick();
    });
  }
}

/**
 * Create a bottom navigation bar.
 * @param {string} activeTab
 * @returns {string} HTML string
 */
export function renderBottomNav(activeTab = 'home') {
  const icons = {
    home: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    leaderboard: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    profile: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    settings: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  };

  const tabs = [
    { id: 'home',        icon: icons.home,        labelKey: 'nav.home',        route: '/' },
    { id: 'leaderboard', icon: icons.leaderboard, labelKey: 'nav.leaderboard', route: '/leaderboard' },
    { id: 'profile',     icon: icons.profile,     labelKey: 'nav.profile',     route: '/profile' },
    { id: 'news', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 7h10M7 11h4v5H7zM14 11h3M14 15h3M7 19h10"/></svg>`, labelKey: 'nav.news', route: './news.html' },
  ];

  const items = tabs.map(tab => `
    <button class="bottom-nav__item ${tab.id === activeTab ? 'active' : ''}"
            data-nav-route="${tab.route}" data-nav-id="${tab.id}">
      <span class="bottom-nav__icon">${tab.icon}</span>
      <span data-i18n="${tab.labelKey}">${t(tab.labelKey)}</span>
    </button>
  `).join('');

  return `<nav class="bottom-nav">${items}</nav>`;
}

/**
 * Attach bottom nav event listeners.
 */
export function attachBottomNavListeners(container, navigateFn) {
  const buttons = container.querySelectorAll('[data-nav-route]');
  for (const btn of buttons) {
    btn.addEventListener('click', () => {
      playSfx('click');
      if (btn.dataset.navId === 'news') {
        openNews();
      } else {
        navigateFn(btn.dataset.navRoute);
      }
    });
  }
}

/**
 * Render a game-over screen overlay.
 */
export function renderGameOver({
  score,
  bestScore,
  isNewBest,
  rank,
  gameTitle,
  theme,
  torchCelebration,
  onPlayAgain,
  onHome,
  onShare,
}) {
  const content = document.createElement('div');
  content.style.textAlign = 'center';
  content.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: var(--space-4);">
      ${isNewBest ? '🏆' : '🎉'}
    </div>
    <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-black); margin-bottom: var(--space-2);">
      ${t('gameover.title')}
    </h2>
    <p style="color: var(--text-secondary); margin-bottom: var(--space-6);">${t('gameover.great')}</p>

    <div class="stats-row" data-result-summary style="margin-bottom: var(--space-6);">
      <div class="stat-item">
        <div class="stat-item__value text-gradient-warm">${score}</div>
        <div class="stat-item__label">${t('gameover.score')}</div>
      </div>
      <div class="stat-item">
        <div class="stat-item__value text-gradient">${bestScore}</div>
        <div class="stat-item__label">${t('gameover.best_score')}</div>
      </div>
      ${rank ? `
      <div class="stat-item">
        <div class="stat-item__value" style="color: var(--color-accent-warm);">#${rank}</div>
        <div class="stat-item__label">${t('common.rank')}</div>
      </div>
      ` : ''}
    </div>

    ${isNewBest ? `
    <div class="badge badge--warning" style="margin-bottom: var(--space-4); padding: var(--space-2) var(--space-4); font-size: var(--text-base);">
      ${t('gameover.new_best')}
    </div>
    ` : ''}

    <div style="display: flex; flex-direction: column; gap: var(--space-3);">
      <button class="btn btn--primary btn--full btn--lg" id="go-play-again">${t('gameover.play_again')}</button>
      <div style="display: flex; gap: var(--space-3);">
        <button class="btn btn--secondary" style="flex:1;" id="go-home">${t('gameover.home')}</button>
        <button class="btn btn--secondary" style="flex:1;" id="go-share">📤 ${t('common.share')}</button>
      </div>
    </div>
  `;

  openModal({ title: '', content, theme });
  modalCloseCallback = showTorchCelebration(content.querySelector('[data-result-summary]'), torchCelebration);

  // Attach listeners
  content.querySelector('#go-play-again')?.addEventListener('click', () => {
    closeModal();
    onPlayAgain?.();
  });
  content.querySelector('#go-home')?.addEventListener('click', () => {
    closeModal();
    onHome?.();
  });
  content.querySelector('#go-share')?.addEventListener('click', () => {
    onShare?.();
  });
}

export default {
  initToastSystem, showToast,
  initModalSystem, openModal, closeModal,
  renderHeader, attachHeaderListeners,
  renderBottomNav, attachBottomNavListeners,
  renderGameOver,
};
