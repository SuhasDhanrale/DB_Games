/* ============================================================
   Settings Screen — Audio, Lang, Reset
   ============================================================ */

import { t, toggleLang, getLang } from '../i18n/index.js';
import { isSfxEnabled, setSfxEnabled, isMusicEnabled, setMusicEnabled, playSfx } from '../core/audio.js';
import { renderHeader, attachHeaderListeners, renderBottomNav, attachBottomNavListeners, openModal, closeModal, showToast } from '../ui/components.js';
import { resetProgression } from '../systems/progression.js';
import { resetEngagement } from '../systems/engagement.js';
import { navigate } from '../core/router.js';

export function renderSettings(container) {
  const lang = getLang();
  
  container.innerHTML = `
    ${renderHeader({ title: t('settings.title') })}
    
    <div class="screen-body" style="padding-top: var(--space-4);">
      
      <!-- Language -->
      <div class="card" style="margin-bottom: var(--space-4);">
        <div class="card__body" style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: var(--text-base); font-weight: var(--weight-semibold);">${t('settings.language')}</div>
          </div>
          <div class="lang-switch">
            <button class="lang-switch__option ${lang === 'en' ? 'active' : ''}" data-lang="en">English</button>
            <button class="lang-switch__option ${lang === 'hi' ? 'active' : ''}" data-lang="hi">हिंदी</button>
          </div>
        </div>
      </div>

      <!-- Audio -->
      <div class="card" style="margin-bottom: var(--space-4);">
        <div class="card__body" style="display: flex; flex-direction: column; gap: var(--space-4);">
          
          <div class="toggle" id="toggle-sfx">
            <div style="flex: 1;">
              <div class="toggle__label">${t('settings.sound')}</div>
            </div>
            <div class="toggle__track ${isSfxEnabled() ? 'active' : ''}">
              <div class="toggle__thumb"></div>
            </div>
          </div>
          
          <div class="divider" style="margin: 0;"></div>
          
          <div class="toggle" id="toggle-music">
            <div style="flex: 1;">
              <div class="toggle__label">${t('settings.music')}</div>
            </div>
            <div class="toggle__track ${isMusicEnabled() ? 'active' : ''}">
              <div class="toggle__thumb"></div>
            </div>
          </div>
          
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card" style="margin-bottom: var(--space-6); border-color: rgba(255,107,107,0.3);">
        <div class="card__body">
          <button class="btn btn--danger btn--full" id="btn-reset">
            ⚠️ ${t('settings.reset')}
          </button>
        </div>
      </div>

      <!-- About -->
      <div style="text-align: center; color: var(--text-tertiary); font-size: var(--text-xs);">
        <p>${t('hub.title')} - ${t('settings.about')}</p>
        <p>${t('settings.version')} 1.0.0</p>
      </div>

    </div>

    ${renderBottomNav('settings')}
  `;

  attachHeaderListeners(container, {});
  attachBottomNavListeners(container, navigate);

  // Handlers
  container.querySelectorAll('.lang-switch__option').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.lang;
      if (target !== getLang()) {
        toggleLang();
        playSfx('tap');
        renderSettings(container); // re-render
      }
    });
  });

  const toggleSfx = container.querySelector('#toggle-sfx');
  toggleSfx.addEventListener('click', () => {
    const track = toggleSfx.querySelector('.toggle__track');
    const newState = !track.classList.contains('active');
    setSfxEnabled(newState);
    if (newState) track.classList.add('active'); else track.classList.remove('active');
    if (newState) playSfx('tap');
  });

  const toggleMusic = container.querySelector('#toggle-music');
  toggleMusic.addEventListener('click', () => {
    const track = toggleMusic.querySelector('.toggle__track');
    const newState = !track.classList.contains('active');
    setMusicEnabled(newState);
    if (newState) track.classList.add('active'); else track.classList.remove('active');
    playSfx('tap');
  });

  const btnReset = container.querySelector('#btn-reset');
  btnReset.addEventListener('click', () => {
    playSfx('click');
    openModal({
      title: 'Warning',
      content: `
        <div style="text-align: center;">
          <p style="margin-bottom: var(--space-6);">${t('settings.reset_confirm')}</p>
          <div style="display: flex; gap: var(--space-3);">
            <button class="btn btn--secondary" style="flex:1;" id="reset-cancel">${t('common.cancel')}</button>
            <button class="btn btn--danger" style="flex:1;" id="reset-confirm">${t('settings.reset')}</button>
          </div>
        </div>
      `
    });

    setTimeout(() => {
      document.getElementById('reset-cancel')?.addEventListener('click', () => {
        closeModal();
      });
      document.getElementById('reset-confirm')?.addEventListener('click', () => {
        resetProgression();
        resetEngagement();
        closeModal();
        showToast({ message: 'Progress reset', icon: '🗑️' });
        setTimeout(() => navigate('/'), 1000);
      });
    }, 100);
  });
}

export default renderSettings;
