import { getLang, setLang, t } from '../i18n/index.js';
import { isSfxEnabled, setSfxEnabled, isMusicEnabled, setMusicEnabled } from '../core/audio.js';
import { openModal, closeModal } from '../ui/components.js';
import { resetProgression } from '../systems/progression.js';
import { navigate } from '../core/router.js';
import { playOpening } from '../ui/opening.js';
import '../styles/support.css';

export function renderSettings(container, { embedded = false, onChange } = {}) {
  const hi = getLang() === 'hi';
  const copy = (h, e) => hi ? h : e;
  container.classList.add(embedded ? 'support-view' : 'support-screen');
  container.innerHTML = `${embedded ? '' : `<header class="support-heading"><button class="support-action" id="settings-back" type="button" aria-label="${t('common.back')}">←</button><h1>${t('settings.title')}</h1></header>`}<div class="${embedded ? '' : 'support-content'} support-view">
    <div class="support-settings-row"><label for="settings-language">${t('settings.language')}</label><select id="settings-language"><option value="hi" ${hi ? 'selected' : ''}>हिंदी</option><option value="en" ${hi ? '' : 'selected'}>English</option></select></div>
    ${[['sfx', t('settings.sound'), isSfxEnabled()], ['music', t('settings.music'), isMusicEnabled()]].map(([id, label, enabled]) => `<div class="support-settings-row"><span id="${id}-label">${label}</span><button class="support-toggle" id="settings-${id}" type="button" aria-labelledby="${id}-label" aria-pressed="${enabled}">${enabled ? copy('चालू', 'On') : copy('बंद', 'Off')}</button></div>`).join('')}
    <h3>${copy('खेलने का तरीका', 'Playing at your pace')}</h3><p class="support-muted">${copy('मनपसंद खेल चुनें। हर खेल में “कैसे खेलें” से मदद मिलेगी। एक खेल पूरा करने पर आज का दिन दर्ज होगा। सभी पाँच खेल पूरे करना ज़रूरी नहीं है।', 'Choose a game you enjoy. Each game has a How to play guide. Completing one records your day; you do not need to finish all five.')}</p>
    <div class="support-actions"><button class="support-action" type="button" id="settings-opening">${copy('शुरुआती झलक फिर देखें', 'Replay the opening')}</button></div>
    <details><summary>${copy('डेमो और सहेजा हुआ डेटा', 'Demo and saved data')}</summary>
      <p class="support-muted">${copy('तीन तैयार नमूना संस्करण हैं। संस्करण बदलने से कोई नया दिन या लगातार खेलने का रिकॉर्ड नहीं बनता।', 'Three authored sample editions. Switching editions does not count as another day played.')}</p>
      <div class="support-settings-row"><label for="settings-edition">${copy('डेमो संस्करण', 'Demo edition')}</label><select id="settings-edition">${[1,2,3].map(i => `<option value="d${i}" ${window.DBJamDemo.day === 'd' + i ? 'selected' : ''}>${copy('संस्करण', 'Edition')} ${i}</option>`).join('')}</select></div>
      <p class="support-muted" style="margin:16px 0">${copy('रीसेट से इस ब्राउज़र के खेल और परिणाम हटेंगे। भाषा और ध्वनि की पसंद बनी रहेगी।', 'Reset removes game rounds and results in this browser. Language and sound preferences are kept.')}</p>
      <button class="support-action support-danger" type="button" id="settings-reset">${copy('खेल की प्रगति रीसेट करें', 'Reset play progress')}</button>
    </details>
  </div>`;
  container.querySelector('#settings-back')?.addEventListener('click', () => navigate('/'));
  container.querySelector('#settings-language').addEventListener('change', event => {
    setLang(event.target.value);
    if (embedded) openSettings(onChange); else renderSettings(container);
    onChange?.();
  });
  [['sfx', isSfxEnabled, setSfxEnabled], ['music', isMusicEnabled, setMusicEnabled]].forEach(([id, get, set]) => {
    container.querySelector('#settings-' + id).addEventListener('click', event => {
      const enabled = !get(); set(enabled);
      event.currentTarget.setAttribute('aria-pressed', String(enabled));
      event.currentTarget.textContent = enabled ? copy('चालू', 'On') : copy('बंद', 'Off');
    });
  });
  container.querySelector('#settings-edition').addEventListener('change', event => {
    const url = new URL(location.href); url.searchParams.set('day', event.target.value); url.hash = ''; location.assign(url);
  });
  container.querySelector('#settings-opening').addEventListener('click', () => {
    closeModal();
    const overlay = document.createElement('div'); overlay.className = 'loading-screen'; document.getElementById('app-root').appendChild(overlay);
    playOpening(overlay, () => container.querySelector('#settings-opening')?.focus());
  });
  container.querySelector('#settings-reset').addEventListener('click', () => {
    const content = document.createElement('div'); content.className = 'support-view';
    content.innerHTML = `<p>${copy('इस ब्राउज़र के सभी खेल, परिणाम और मशाल का रिकॉर्ड हट जाएगा।', 'All game rounds, results and torch history in this browser will be removed.')}</p><div class="support-actions"><button class="support-action" id="reset-cancel" type="button">${t('common.cancel')}</button><button class="support-action support-danger" id="reset-confirm" type="button">${copy('प्रगति हटाएँ', 'Remove progress')}</button></div>`;
    openModal({ title: copy('प्रगति रीसेट करें?', 'Reset progress?'), content });
    content.querySelector('#reset-cancel').addEventListener('click', () => embedded ? openSettings(onChange) : closeModal());
    content.querySelector('#reset-confirm').addEventListener('click', () => { resetProgression(); closeModal(); location.reload(); });
  });
}
export function openSettings(onChange) {
  const content = document.createElement('div');
  renderSettings(content, { embedded: true, onChange });
  openModal({ title: t('settings.title'), content });
}
