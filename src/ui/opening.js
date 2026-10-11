import wordal from '../assets/intro/wordal.svg?raw';
import niti from '../assets/intro/niti.svg?raw';
import cricket from '../assets/intro/cricket.svg?raw';
import carrom from '../assets/intro/carrom.svg?raw';
import jodo from '../assets/intro/jodo.svg?raw';
import { t } from '../i18n/index.js';
import '../styles/opening.css';

export function openingMarkup() {
  const games = [wordal, niti, cricket, carrom, jodo];
  return `<div class="opening-brand">${t('opening.brand')}</div>
    <h1 class="opening-slogan">${t('opening.slogan')}</h1>
    <div class="opening-games" aria-hidden="true">${games.map((svg, i) => `<div class="opening-game">${svg}<span>${t(`game${i + 1}.title`)}</span></div>`).join('')}</div>
    <p class="opening-caption">${t('opening.caption')}</p>`;
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
  root.innerHTML = `<div class="opening-content">${openingMarkup()}<button class="opening-skip" type="button">${t('opening.start')} →</button></div>`;
  root.querySelector('button').addEventListener('click', finish);
  timer = setTimeout(finish, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 800 : 2600);
}
