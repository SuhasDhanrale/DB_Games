import storage from '../core/storage.js';
import { t, getLang } from '../i18n/index.js';
import { todayStr, torchJourney } from '../systems/progression.js';
import { getPlayerName, escapeHtml } from '../core/player-profile.js';
import torchStyles from '../styles/torch.css?inline';

// The hub shows the daily streak; the result card shows cumulative completions.
export const torchIcon = `<svg viewBox="0 0 24 36" fill="none" aria-hidden="true"><path d="M13 1 C18 8 10 9 18 12 C23 17 19 23 12 23 C4 23 1 16 6 11 C6 17 12 12 13 1Z" fill="#bc6238"/><path d="M12 12 C14 16 17 16 15 20 C13 23 8 21 9 18Z" fill="#f1c773"/><path d="M6 23 H18 L15 27 H9Z" fill="#8a7150"/><path d="M9 27 H15 L14 35 H10Z" fill="#62533f"/></svg>`;

const profileIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>`;
const mashal = `<div class="torch-card__scene" aria-hidden="true"><span class="torch-card__halo"></span><svg class="torch-card__mashal" viewBox="0 0 88 120" fill="none"><g class="torch-card__flame"><path d="M45 5C62 27 43 34 60 43C76 54 66 77 44 78C23 78 14 58 25 42C24 60 38 49 45 5Z" fill="#d87837"/><path d="M45 27C54 42 44 46 52 53C61 63 53 73 44 73C31 73 27 63 33 53C34 61 42 54 45 27Z" fill="#f4b84e"/><path d="M44 49C49 59 54 62 49 68C44 74 37 69 38 64Z" fill="#fff1b2"/></g><path d="M25 77H63L57 87H31Z" fill="#b28a52"/><path d="M30 80H58" stroke="#e9c383" stroke-width="2"/><path d="M35 87H53L49 115H39Z" fill="#69513b"/><path d="M37 93H51M38 100H50" stroke="#c3a16d" stroke-width="2"/><path d="M40 90V111" stroke="#947657" stroke-width="2"/></svg><i class="torch-card__ember torch-card__ember--one"></i><i class="torch-card__ember torch-card__ember--two"></i><i class="torch-card__ember torch-card__ember--three"></i><span class="torch-card__day">+1</span></div>`;

export function torchCardMarkup({ journey = torchJourney(), lang = getLang(), name = getPlayerName(), celebrate = false, awarded = true, title = '', count = '' } = {}) {
  const hi = lang === 'hi';
  const goal = journey.goal;
  const levelUp = celebrate && awarded && journey.completions > 0 && journey.progress === 0;
  const start = celebrate && awarded ? (levelUp ? goal - 1 : Math.max(0, journey.progress - 1)) : journey.progress;
  const end = levelUp ? goal : journey.progress;
  const rule = celebrate && !awarded
    ? (hi ? 'आज का यह खेल पहले ही गिना गया है.' : 'This game has already counted today.')
    : (hi ? 'हर नया दैनिक खेल एक बार जोड़ता है.' : 'Each new daily game adds once.');
  const next = hi ? `स्तर ${journey.level + 1}` : `Level ${journey.level + 1}`;
  return `<div class="torch-card__identity"><span class="torch-card__avatar">${profileIcon}</span><span class="torch-card__player">${escapeHtml(name || (hi ? 'आपकी मशाल' : 'Your mashal'))}</span><span class="torch-card__level">${hi ? 'स्तर' : 'Level'} <b>${journey.level}</b></span></div>
    <div class="torch-card__main" data-torch-tier="${Math.min(3, journey.level)}">${mashal}<div class="torch-card__copy"><span class="torch-card__eyebrow">${hi ? 'मशाल यात्रा' : 'Mashal journey'}${count ? ` · <span class="torch-card__count">${escapeHtml(count)}</span>` : ''}</span><h3 class="torch-card__title">${escapeHtml(levelUp ? (hi ? 'शानदार! नया स्तर!' : 'Well done! Level up!') : title || (hi ? 'हर खेल से और रोशनी' : 'Brighter with every game'))}</h3></div></div>
    <div class="torch-card__progress" role="progressbar" aria-label="${hi ? 'अगले स्तर की प्रगति' : 'Progress to next level'}" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${journey.progress}" aria-valuetext="${journey.progress} / ${goal} · ${next}" style="--torch-from:${start / goal};--torch-to:${end / goal};--torch-final:${journey.progress / goal}"><span class="torch-card__fill"></span>${Array.from({ length: goal - 1 }, (_, i) => `<i style="left:${(i + 1) / goal * 100}%"></i>`).join('')}</div>
    <div class="torch-card__progress-copy"><span><b>${journey.progress}</b> / ${goal} ${hi ? 'खेल' : 'games'}</span><span>${next} →</span></div>
    ${celebrate ? `<button class="torch-card__skip" type="button" disabled aria-hidden="true">${hi ? 'जारी रखें' : 'Continue'}</button>` : `<p class="torch-card__rule">${rule}</p>`}`;
}

export function prepareTorchCelebration(streak, { awarded = true } = {}) {
  storage.set('torch:pending_hub', todayStr());
  return {
    streak,
    awarded,
    journey: torchJourney(),
    name: getPlayerName(),
    lang: getLang(),
    title: t('torch.title'),
    count: t('torch.count', { count: streak }),
  };
}

export function consumeTorchPulse() {
  const pending = storage.get('torch:pending_hub');
  storage.remove('torch:pending_hub');
  return pending === todayStr();
}

/** Ordinary progress stays inline; only a new level opens the celebration. */
export function showTorchCelebration(anchor, celebration) {
  if (!anchor || !celebration) return () => {};
  const anchorDoc = anchor.ownerDocument;
  const doc = anchorDoc.defaultView.frameElement?.ownerDocument || anchorDoc;
  const journey = celebration.journey;
  const awarded = celebration.awarded !== false;
  const milestone = awarded && journey?.completions > 0 && journey.progress === 0;
  const rows = [];
  const progressSlots = [...anchor.querySelectorAll('[data-mashal-progress]')];
  const ensureStyles = targetDoc => {
    if (targetDoc.querySelector('[data-torch-styles]')) return;
    const style = targetDoc.createElement('style');
    style.dataset.torchStyles = '';
    style.textContent = torchStyles;
    targetDoc.head.appendChild(style);
  };
  const showProgress = () => {
    if (rows.length) return;
    ensureStyles(anchorDoc);
    const hi = celebration.lang === 'hi';
    const slots = [...progressSlots];
    if (!slots.length) slots.push(null);
    for (const slot of slots) {
      const row = anchorDoc.createElement('div');
      row.className = 'torch-result-progress';
      row.lang = celebration.lang;
      row.dataset.awarded = String(awarded);
      row.setAttribute('role', 'status');
      row.innerHTML = `${torchIcon}<span>${hi ? 'मशाल' : 'Mashal'}${awarded ? ' +1' : ''} · ${hi ? 'स्तर' : 'Level'} ${journey.level} · ${journey.progress}/${journey.goal} ${hi ? 'खेल' : 'games'}</span>`;
      rows.push(row);
      if (slot) slot.appendChild(row);
      else anchor.insertAdjacentElement('afterend', row);
    }
  };
  let timer = null;
  let settleTimer = null;
  let skipTimer = null;
  let card = null;
  let popup = null;
  let ready = false;
  let stopped = false;
  const cleanup = () => {
    stopped = true;
    clearTimeout(timer);
    clearTimeout(settleTimer);
    clearTimeout(skipTimer);
    observer.disconnect();
    rows.forEach(row => row.remove());
    if (popup?.open) popup.close();
    popup?.remove();
  };
  // checkVisibility is missing in older browsers/WebViews and blocks every game.
  const isVisible = () => anchor.isConnected && anchor.getClientRects().length > 0
    && anchorDoc.defaultView.getComputedStyle(anchor).visibility === 'visible'
    && (!progressSlots.length || progressSlots.some(slot => !slot.hidden));
  const check = () => {
    if (stopped) return;
    if (!isVisible()) {
      clearTimeout(timer);
      timer = null;
      // Leaving results also removes the card from subsequent practice rounds.
      if (card || rows.length) cleanup();
      return;
    }
    showProgress();
    if (!milestone || timer || card) return;
    timer = setTimeout(() => {
      timer = null;
      if (stopped || !isVisible()) return;
      ensureStyles(doc);
      popup = doc.createElement('dialog');
      popup.className = 'torch-popup';
      popup.lang = celebration.lang;
      popup.setAttribute('aria-label', celebration.lang === 'hi' ? 'मशाल यात्रा' : 'Mashal journey');
      card = doc.createElement('div');
      const animate = !doc.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const awarded = celebration.awarded !== false;
      card.className = `torch-card${animate && awarded ? ' is-feeding' : ''}${awarded && celebration.journey?.completions > 0 && celebration.journey.progress === 0 ? ' is-level-up' : ''}`;
      card.lang = celebration.lang;
      card.tabIndex = -1;
      card.innerHTML = torchCardMarkup({ ...celebration, count: '', celebrate: true });
      card.querySelector('.torch-card__title').id = 'torch-popup-title';
      popup.setAttribute('aria-labelledby', 'torch-popup-title');
      popup.appendChild(card);
      doc.body.appendChild(popup);
      popup.showModal();
      card.focus({ preventScroll: true });
      const journey = celebration.journey;
      const levelUp = animate && awarded && journey?.completions > 0 && journey.progress === 0;
      const progress = card.querySelector('.torch-card__progress');
      const progressNumber = card.querySelector('.torch-card__progress-copy b');
      const progressTarget = card.querySelector('.torch-card__progress-copy > span:last-child');
      const setProgressCopy = (value, target) => {
        const label = `${celebration.lang === 'hi' ? 'स्तर' : 'Level'} ${target}`;
        progress.setAttribute('aria-valuenow', String(value));
        progress.setAttribute('aria-valuetext', `${value} / ${journey.goal} · ${label}`);
        progressNumber.textContent = String(value);
        progressTarget.textContent = `${label} →`;
      };
      // Show the completed milestone while it fills, then start the next level's bar.
      if (levelUp) setProgressCopy(journey.goal, journey.level);
      const settle = () => {
        clearTimeout(settleTimer);
        card?.classList.remove('is-feeding');
        if (levelUp) setProgressCopy(journey.progress, journey.level + 1);
      };
      const dismiss = () => {
        settle();
        clearTimeout(skipTimer);
        popup.close();
        popup.remove();
      };
      popup.addEventListener('click', () => { if (ready) dismiss(); });
      popup.addEventListener('cancel', event => {
        event.preventDefault();
        if (ready) dismiss();
      });
      if (animate) settleTimer = setTimeout(settle, 2600);
      skipTimer = setTimeout(() => {
        if (stopped) return;
        ready = true;
        popup.classList.add('is-ready');
        const skip = card.querySelector('.torch-card__skip');
        skip.disabled = false;
        skip.removeAttribute('aria-hidden');
      }, animate ? 3000 : 0);
    }, 1000);
  };
  const observer = new anchorDoc.defaultView.MutationObserver(check);
  // Watch only result ancestors, including the modal/view that hides on replay.
  for (let node = anchor; node; node = node.parentElement) {
    observer.observe(node, { attributes: true, attributeFilter: ['class', 'style', 'hidden'], childList: true });
  }
  progressSlots.forEach(slot => observer.observe(slot, { attributes: true, attributeFilter: ['hidden'] }));
  check();
  return cleanup;
}
