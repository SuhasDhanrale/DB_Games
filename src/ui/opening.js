import wordal from '../assets/intro/wordal.svg?raw';
import niti from '../assets/intro/niti.svg?raw';
import cricket from '../assets/intro/cricket.svg?raw';
import carrom from '../assets/intro/carrom.svg?raw';
import jodo from '../assets/intro/jodo.svg?raw';
import { t } from '../i18n/index.js';
import '../styles/opening.css';

export function openingMarkup() {
  const games = [wordal, niti, cricket, carrom, jodo];
  return `<h1 class="opening-brand">${t('opening.brand')}</h1>
    <div class="opening-games" aria-hidden="true">${games.map((svg, i) => `<div class="opening-game" style="--intro-order:${i}">${svg}</div>`).join('')}</div>
    <p class="opening-caption">${t('opening.caption')}</p>`;
}

export function finishOpening(root) {
  if (!root) return;
  // The router activates its first screen on the second animation frame.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.setAttribute('aria-busy', 'false');
    root.classList.add('fade-out');
    setTimeout(() => root.remove(), 350);
  }));
}

export function playOpening(root, onComplete) {
  if (!root) { onComplete(); return; }
  let finished = false;
  let timer;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    root.classList.add('fade-out');
    setTimeout(() => root.remove(), 350);
    onComplete();
  };
  root.classList.add('opening-screen');
  root.innerHTML = `<div class="opening-content">${openingMarkup()}</div>`;
  timer = setTimeout(finish, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 800 : 2600);
}
