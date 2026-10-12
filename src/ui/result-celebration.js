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

// Praise follows real results; attempts and hints never imply a flawless solve.
export function resultCopy(game, details = {}, lang = 'hi') {
  const en = lang === 'en';
  const message = (titleHi, bodyHi, titleEn, bodyEn, success = true) => ({
    title: en ? titleEn : titleHi, body: en ? bodyEn : bodyHi, success,
  });
  if (game === 'wordal') {
    if (!details.solved) return details.attempts > 0
      ? message('आपकी कोशिश मायने रखती है', 'आज शब्द नहीं मिला। रंगों के संकेत से अगली बार नया तरीका आज़माएँ।', 'Your effort matters', 'The word stayed hidden today. Use the colour clues to try a new approach next time.', false)
      : message('आज का शब्द जानें', 'शब्द और उसका अर्थ पढ़ें। अगली पहेली में खुद आज़माएँ।', 'Discover today’s word', 'Read the word and its meaning. Try the next puzzle yourself.', false);
    if (details.attempts === 1) return message('कमाल!', 'पहली कोशिश में शब्द खोज लिया।', 'Amazing!', 'You found the word on your first try.');
    if (details.attempts > 3) return message('शानदार!', 'कोशिश जारी रखी और शब्द खोज लिया। अभ्यास से हुनर निखरता है।', 'Well done!', 'You kept trying and found the word. Practice helps you build your skill.');
    return message('शानदार!', 'शब्द खोज लिया।', 'Well done!', 'You found the word.');
  }
  if (game === 'niti') return details.correct
    ? message('शानदार!', 'विचार सही पूरा किया। अब उसका अर्थ जानें।', 'Well done!', 'You completed the thought correctly. Explore its meaning below.')
    : message('सीखने का एक मौका', 'सही उत्तर और उसका अर्थ देखें। यह सीख आगे काम आ सकती है।', 'A chance to learn', 'Read the correct answer and its meaning. Take this lesson into your next try.', false);
  if (game === 'cricket') return details.won
    ? message('शानदार!', 'आपने मैच जीत लिया।', 'Well played!', 'You won the match.')
    : message('आपकी कोशिश मायने रखती है', 'इस बार जीत नहीं मिली। फिर खेलें—अभ्यास से हुनर निखरता है।', 'Your effort matters', 'No win this time. Play again—practice helps you build your skill.', false);
  if (game === 'carrom') return details.shots === 1
    ? message('कमाल!', 'एक ही शॉट में लक्ष्य पूरा किया।', 'Amazing!', 'You completed the challenge in one shot.')
    : message('शानदार!', 'कोशिश जारी रखी और लक्ष्य पूरा किया। अभ्यास से निशाना निखरता है।', 'Well done!', 'You kept trying and completed the challenge. Practice helps you refine your aim.');
  if (game === 'jodo') {
    if (details.wrongMatches === 0 && details.assistedPairs === 0) return message('एकदम सही!', 'बिना गलती और बिना संकेत चारों जोड़ियाँ खोज लीं।', 'Perfect!', 'You found all four pairs without mistakes or hints.');
    if (details.assistedPairs > 0) return message('बढ़िया!', 'संकेत की मदद से चारों जोड़ियाँ पूरी कीं। अब उनके संबंध जानें।', 'Good work!', 'You completed all four pairs with a hint. Explore their connections below.');
    return message('शानदार!', 'कोशिश जारी रखी और चारों जोड़ियाँ खोज लीं।', 'Well done!', 'You kept trying and found all four pairs.');
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
  card.querySelector('p').textContent = copy.body;
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
      control !== skip && control.tabIndex >= 0 && control.checkVisibility() &&
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
    if (copy.success) {
      if (window.DBGameAudio) window.DBGameAudio.playSfx('success');
      else { initAudio(); playSfx('success'); }
    }
  }
}

// Embedded and standalone HTML games call the same component after their intro.
window.DBResultCelebration = { show: showResultCelebration, clear: clearResultCelebration };
