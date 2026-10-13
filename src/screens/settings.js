import { getLang, setLang, t } from '../i18n/index.js';
import { isSfxEnabled, setSfxEnabled, isMusicEnabled, setMusicEnabled } from '../core/audio.js';
import { openModal, closeModal } from '../ui/components.js';
import { resetProgression } from '../systems/progression.js';
import { navigate } from '../core/router.js';
import { playOpening } from '../ui/opening.js';
import '../styles/support.css';
import { getPlayerName, setPlayerName, escapeHtml } from '../core/player-profile.js';

export function renderSettings(container, { embedded = false, onChange } = {}) {
  const hi = getLang() === 'hi';
  const copy = (h, e) => hi ? h : e;
  container.classList.add(embedded ? 'support-view' : 'support-screen');
  container.innerHTML = `${embedded ? '' : `<header class="support-heading"><button class="support-action" id="settings-back" type="button" aria-label="${t('common.back')}">←</button><h1>${t('settings.title')}</h1></header>`}<div class="${embedded ? '' : 'support-content'} support-view">
    <form class="support-name-form" id="settings-player"><label for="settings-player-name">${copy('मशाल पर आपका नाम', 'Your name on the mashal')}</label><div><input id="settings-player-name" type="text" maxlength="40" autocomplete="nickname" value="${escapeHtml(getPlayerName())}" placeholder="${copy('अपना नाम लिखें', 'Enter your name')}"><button class="support-action" type="submit">${copy('सहेजें', 'Save')}</button></div><span id="settings-name-status" role="status"></span></form>
    <div class="support-settings-row"><label for="settings-language">${t('settings.language')}</label><select id="settings-language"><option value="hi" ${hi ? 'selected' : ''}>हिंदी</option><option value="en" ${hi ? '' : 'selected'}>English</option></select></div>
    ${[['sfx', t('settings.sound'), isSfxEnabled()], ['music', t('settings.music'), isMusicEnabled()]].map(([id, label, enabled]) => `<div class="support-settings-row"><span id="${id}-label">${label}</span><button class="support-toggle" id="settings-${id}" type="button" aria-labelledby="${id}-label" aria-pressed="${enabled}">${enabled ? copy('चालू', 'On') : copy('बंद', 'Off')}</button></div>`).join('')}
    <h3>${copy('खेलने का तरीका', 'Playing at your pace')}</h3><p class="support-muted">${copy('मनपसंद खेल चुनें। हर खेल में “कैसे खेलें” से मदद मिलेगी। एक खेल पूरा करने पर आज का दिन दर्ज होगा। सभी पाँच खेल पूरे करना ज़रूरी नहीं है।', 'Choose a game you enjoy. Each game has a How to play guide. Completing one records your day; you do not need to finish all five.')}</p>
    <div class="support-actions"><button class="support-action" type="button" id="settings-opening">${copy('शुरुआती झलक फिर देखें', 'Replay the opening')}</button><a class="support-action" href="./music-preview.html#credits">${copy('संगीत और कलाकार', 'Music and artists')}</a></div>
    <details><summary>${copy('डेमो और इस सत्र की प्रगति', 'Demo and session progress')}</summary>
      <p class="support-muted">${copy('तीन तैयार नमूना संस्करण हैं। हर रिफ़्रेश पर अगला संस्करण खुलेगा: 1 → 2 → 3 → 1। मशाल का लेवल इस ब्राउज़र में सहेजा जाता है। परिणाम और पसंद केवल इस खुले सत्र तक रहेंगी।', 'Three authored sample editions rotate on every refresh: 1 → 2 → 3 → 1. Your Mashal level is saved in this browser. Results and preferences last only while this page is open.')}</p>
      <div class="support-settings-row"><label for="settings-edition">${copy('डेमो संस्करण', 'Demo edition')}</label><select id="settings-edition">${[1,2,3].map(i => `<option value="d${i}" ${window.DBJamDemo.day === 'd' + i ? 'selected' : ''}>${copy('संस्करण', 'Edition')} ${i}</option>`).join('')}</select></div>
      <p class="support-muted" style="margin:16px 0">${copy('रीसेट से मशाल का सहेजा गया लेवल और इस सत्र के खेल व परिणाम हटेंगे, पसंद रीसेट होंगी और अगला संस्करण खुलेगा।', 'Reset clears your saved Mashal level and this session’s rounds and results, resets preferences and opens the next edition.')}</p>
      <button class="support-action support-danger" type="button" id="settings-reset">${copy('खेल की प्रगति रीसेट करें', 'Reset play progress')}</button>
    </details>
  </div>`;
  container.querySelector('#settings-back')?.addEventListener('click', () => navigate('/'));
  container.querySelector('#settings-player').addEventListener('submit', event => {
    event.preventDefault();
    const input = container.querySelector('#settings-player-name');
    setPlayerName(input.value);
    input.value = getPlayerName();
    container.querySelector('#settings-name-status').textContent = copy('नाम सहेजा गया', 'Name saved');
    onChange?.();
  });
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
    content.innerHTML = `<p>${copy('इस सत्र के सभी खेल व परिणाम और मशाल का सहेजा गया लेवल हट जाएगा और अगला संस्करण खुलेगा।', 'All rounds and results in this session and your saved Mashal level will be cleared and the next edition will open.')}</p><div class="support-actions"><button class="support-action" id="reset-cancel" type="button">${t('common.cancel')}</button><button class="support-action support-danger" id="reset-confirm" type="button">${copy('प्रगति हटाएँ', 'Remove progress')}</button></div>`;
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
