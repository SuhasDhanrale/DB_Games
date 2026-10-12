import storage from '../core/storage.js';
import { t, getLang } from '../i18n/index.js';
import { todayStr } from '../systems/progression.js';
import torchStyles from '../styles/torch.css?inline';

// The same mashal identifies the daily streak on the hub and in results.
export const torchIcon = `<svg viewBox="0 0 24 36" fill="none" aria-hidden="true"><path d="M13 1 C18 8 10 9 18 12 C23 17 19 23 12 23 C4 23 1 16 6 11 C6 17 12 12 13 1Z" fill="#bc6238"/><path d="M12 12 C14 16 17 16 15 20 C13 23 8 21 9 18Z" fill="#f1c773"/><path d="M6 23 H18 L15 27 H9Z" fill="#8a7150"/><path d="M9 27 H15 L14 35 H10Z" fill="#62533f"/></svg>`;

export function prepareTorchCelebration(streak) {
  storage.set('torch:pending_hub', todayStr());
  return {
    streak,
    lang: getLang(),
    showHint: !storage.get('torch:introduced', false),
    title: t('torch.title'),
    count: t('torch.count', { count: streak }),
    hint: t('hub.torch_hint'),
  };
}

export function consumeTorchPulse() {
  const pending = storage.get('torch:pending_hub');
  storage.remove('torch:pending_hub');
  return pending === todayStr();
}

/** Reveal within the existing result, one second after it becomes visible. */
export function showTorchCelebration(anchor, celebration) {
  if (!anchor || !celebration) return () => {};
  const doc = anchor.ownerDocument;
  let timer = null;
  let card = null;
  let stopped = false;
  const cleanup = () => {
    stopped = true;
    clearTimeout(timer);
    observer.disconnect();
    card?.remove();
  };
  const isVisible = () => anchor.isConnected && anchor.checkVisibility({ checkVisibilityCSS: true });
  const check = () => {
    if (stopped) return;
    if (!isVisible()) {
      clearTimeout(timer);
      timer = null;
      // Leaving results also removes the card from subsequent practice rounds.
      if (card) cleanup();
      return;
    }
    if (timer || card) return;
    timer = setTimeout(() => {
      timer = null;
      if (stopped || !isVisible()) return;
      if (!doc.querySelector('[data-torch-styles]')) {
        const style = doc.createElement('style');
        style.dataset.torchStyles = '';
        style.textContent = torchStyles;
        doc.head.appendChild(style);
      }
      card = doc.createElement('aside');
      card.className = 'torch-card';
      card.lang = celebration.lang;
      card.setAttribute('role', 'status');
      card.setAttribute('aria-live', 'polite');
      card.innerHTML = `${torchIcon}<div class="torch-card__copy"><h3 class="torch-card__title">${celebration.title}</h3><p class="torch-card__count">${celebration.count}</p>${celebration.showHint ? `<p class="torch-card__hint">${celebration.hint}</p>` : ''}</div>`;
      anchor.after(card);
      storage.set('torch:introduced', true);
    }, 1000);
  };
  const observer = new doc.defaultView.MutationObserver(check);
  // Watch only result ancestors, including the modal/view that hides on replay.
  for (let node = anchor; node; node = node.parentElement) {
    observer.observe(node, { attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
  }
  check();
  return cleanup;
}
