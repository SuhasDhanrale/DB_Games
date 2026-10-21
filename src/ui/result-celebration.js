import '../styles/result-celebration.css';
import { initAudio, playSfx } from '../core/audio.js';

const active = new WeakMap();
const symbols = {
  wordal: '<rect x="8" y="8" width="24" height="24" rx="5"/><path d="M14 16h12m-6 0v11m-5-5h10"/>',
  niti: '<path d="M20 12c-4-3-9-3-13-2v20c4-1 9-1 13 2m0-20c4-3 9-3 13-2v20c-4-1-9-1-13 2V12Z"/>',
  cricket: '<circle cx="20" cy="20" r="13"/><path d="M15 8c10 7 10 17 0 24m5-23c9 7 9 15 0 22" stroke-dasharray="2 3"/>',
  carrom: '<circle cx="20" cy="20" r="13"/><circle cx="20" cy="20" r="8"/><circle cx="20" cy="20" r="2"/>',
  jodo: '<rect x="6" y="13" width="11" height="14" rx="3"/><rect x="23" y="13" width="11" height="14" rx="3"/><path d="M17 20h6"/>',
};

// One factual outcome owns the result; extra copy is reserved for useful detail.
export function resultCopy(game, details = {}, lang = 'hi') {
  const en = lang === 'en';
  const message = (titleHi, bodyHi, titleEn, bodyEn, success = true) => ({
    title: en ? titleEn : titleHi, body: en ? bodyEn : bodyHi, success,
  });
  if (game === 'wordal') {
    const attempts = details.attempts ?? 0;
    const titleHi = details.solved ? `शब्द मिला · ${attempts}/6 प्रयास`
      : attempts >= 6 ? 'शब्द नहीं मिला · 6/6 प्रयास' : 'उत्तर देखा';
    const titleEn = details.solved ? `Word found · ${attempts}/6 tries`
      : attempts >= 6 ? 'Word not found · 6/6 tries' : 'Answer revealed';
    return message(titleHi, details.practice ? 'अभ्यास' : '', titleEn, details.practice ? 'Practice' : '', !!details.solved);
  }
  if (game === 'niti') return details.correct
    ? message('सही उत्तर', '', 'Correct answer', '')
    : message('चुना उत्तर सही नहीं था', details.selectedText ? `आपने चुना: ${details.selectedText}` : '', 'Incorrect answer', details.selectedText ? `You chose: ${details.selectedText}` : '', false);
  if (game === 'cricket') return details.won
    ? message('आप जीत गए!', '', 'You won!', '')
    : message('इस बार हार हुई', '', 'You lost this round', '', false);
  if (game === 'carrom') {
    const comparison = details.practice && details.firstCompletionShots != null && details.bestReplayShots != null;
    return message(`लक्ष्य पूरा · ${details.shots} शॉट`, comparison ? `अभ्यास · पहली बार: ${details.firstCompletionShots} · सर्वश्रेष्ठ: ${details.bestReplayShots}` : '',
      `Target complete · ${details.shots} ${details.shots === 1 ? 'shot' : 'shots'}`, comparison ? `Practice · First: ${details.firstCompletionShots} · Best: ${details.bestReplayShots}` : '');
  }
  if (game === 'jodo') {
    const scored = Number.isFinite(details.score);
    return message(`चारों जोड़ियाँ पूरी${scored ? ` · ${details.score} अंक` : ''}`,
      `${details.practice ? 'अभ्यास · ' : ''}गलत जोड़: ${details.wrongMatches ?? 0} · संकेत: ${details.assistedPairs ?? 0}`,
      `All four pairs complete${scored ? ` · ${details.score} points` : ''}`,
      `${details.practice ? 'Practice · ' : ''}Wrong matches: ${details.wrongMatches ?? 0} · Hints: ${details.assistedPairs ?? 0}`);
  }
  return null;
}

export function clearResultCelebration(slot) {
  if (!slot) return;
  active.get(slot)?.cleanup();
  active.delete(slot);
  slot.replaceChildren();
}

/** An inline result stamp. Skipping finishes motion while the result stays put. */
export function showResultCelebration(slot, { game, details, lang = 'hi', animate = true } = {}) {
  if (!slot) return;
  const copy = resultCopy(game, details, lang);
  if (!copy) return;
  clearResultCelebration(slot);
  const doc = slot.ownerDocument;
  const view = doc.defaultView;
  const reducedMotion = view.matchMedia('(prefers-reduced-motion: reduce)');
  const moving = animate && !reducedMotion.matches;
  const card = doc.createElement('section');
  card.className = 'result-celebration';
  card.lang = lang;
  card.dataset.outcome = copy.success ? 'success' : 'attempt';
  card.innerHTML = `<div class="result-celebration__stamp" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none">${symbols[game]}</svg><span class="result-celebration__rays"></span>${copy.success ? '<span class="result-celebration__check">✓</span>' : ''}</div><div class="result-celebration__copy"><h3 class="result-celebration__title"></h3><p class="result-celebration__body"></p></div><button type="button" class="result-celebration__skip" hidden></button>`;
  card.querySelector('h3').textContent = copy.title;
  if (slot.id) card.querySelector('h3').id = `${slot.id}-heading`;
  card.querySelector('p').textContent = copy.body;
  card.querySelector('p').hidden = !copy.body;
  const skip = card.querySelector('button');
  skip.textContent = lang === 'en' ? 'Skip' : 'छोड़ें';
  skip.setAttribute('aria-label', lang === 'en' ? 'Skip celebration animation' : 'जश्न का एनीमेशन छोड़ें');
  if (animate) {
    const text = card.querySelector('.result-celebration__copy');
    text.setAttribute('role', 'status');
    text.setAttribute('aria-live', 'polite');
  }
  slot.append(card);
  let timer;
  const finish = () => {
    clearTimeout(timer);
    card.classList.remove('is-celebrating');
    // Do not remove a keyboard user's focused control during the short animation.
    if (doc.activeElement !== skip) skip.hidden = true;
    doc.removeEventListener('click', onAction, true);
    reducedMotion.removeEventListener('change', finish);
  };
  const onAction = event => {
    if (event.target.closest('button, a')) finish();
  };
  skip.addEventListener('click', () => {
    finish();
    const nextAction = [...doc.querySelectorAll('button:not(:disabled), a[href]')].find(control =>
      control !== skip && control.tabIndex >= 0 && control.getClientRects().length > 0 && view.getComputedStyle(control).visibility === 'visible' &&
      (skip.compareDocumentPosition(control) & view.Node.DOCUMENT_POSITION_FOLLOWING));
    nextAction?.focus({ preventScroll: true });
    skip.hidden = true;
  });
  skip.addEventListener('blur', () => { if (!card.classList.contains('is-celebrating')) skip.hidden = true; });
  const cleanup = () => {
    finish();
    card.remove();
  };
  active.set(slot, { cleanup });
  if (moving) {
    card.classList.add('is-celebrating');
    skip.hidden = false;
    doc.addEventListener('click', onAction, true);
    reducedMotion.addEventListener('change', finish);
    timer = setTimeout(finish, 1500);
  }
  if (animate && copy.success) {
    if (window.DBGameAudio) window.DBGameAudio.playSfx('completion');
    else { initAudio(); playSfx('completion'); }
  }
}

// Embedded and standalone HTML games call the same component after their intro.
window.DBResultCelebration = { show: showResultCelebration, clear: clearResultCelebration };
