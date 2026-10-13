import { createInteractionGuide, interactionPoint } from './interaction-guide.js';

// Canvas games supply coordinates from their live state and acknowledge gestures
// from their input handlers. DOM games use the same two animation patterns below.
window.DBInteractionGuides = { create: createInteractionGuide, point: interactionPoint };

export async function installGameInteractionGuides(game) {
  await window.gameIntroReady;
  await new Promise(resolve => requestAnimationFrame(resolve));
  const exampleIndex = count => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : Math.floor(performance.now() / 2600) % count;
  const tap = (id, surface, control, label, labelY = 0) => control && surface
    ? { id, surface, from: interactionPoint(surface, control, .75, surface === control ? .15 : .65), label, labelY }
    : null;
  const guide = createInteractionGuide({
    game,
    isActive: () => !document.querySelector('#modalHelp.is-open, #rules-modal.is-open'),
    getSteps: () => {
      if (game === 'wordal') {
        const surface = document.getElementById('keyboardWrapper');
        if (!document.querySelector('#viewGame.is-active .board-row.is-current')) return [];
        const filled = document.querySelectorAll('.board-row.is-current .tile[data-state="tbd"]').length;
        const submit = document.getElementById('btnSubmitGuess');
        if (filled === 5) return [tap('check', submit, submit, 'अब जाँचें पर टैप करें', -.75)].filter(Boolean);
        const keys = [...(surface?.querySelectorAll('.key-btn:not(:disabled)') || [])];
        return [tap('type', surface, keys[exampleIndex(keys.length)], 'अक्षर पर टैप करके खाने भरें', -.25)].filter(Boolean);
      }
      if (game === 'niti') {
        const surface = document.getElementById('options-grid');
        const confirm = document.getElementById('btn-step1-action');
        if (confirm?.classList.contains('is-goto-card')) return [];
        if (surface?.querySelector('[aria-checked="true"]')) return [tap('check', confirm, confirm, 'उत्तर जाँचने के लिए टैप करें', -.65)].filter(Boolean);
        const options = [...(surface?.querySelectorAll('button:not(:disabled)') || [])];
        return [tap('choose', surface, options[exampleIndex(options.length)], 'अपना उत्तर चुनने के लिए टैप करें', -.15)].filter(Boolean);
      }
      if (game === 'jodo') {
        const surface = document.getElementById('board-container');
        if (surface?.classList.contains('is-dragging-active')) return [];
        const selected = surface?.querySelector('.card-btn.is-selected');
        const side = selected ? (selected.dataset.side === 'left' ? 'right' : 'left') : 'left';
        const cards = [...(surface?.querySelectorAll(`.card-btn[data-side="${side}"]:not(.is-matched)`) || [])];
        return [tap(selected ? 'partner' : 'choose', surface, cards[exampleIndex(cards.length)], selected ? 'अब उसका साथी चुनकर टैप करें' : 'एक कार्ड पर टैप करें · या रेखा खींचें', .02)].filter(Boolean);
      }
      return [];
    },
  });
  const onClick = event => {
    if (game === 'niti') {
      if (event.target.closest('.opt-card-btn:not(:disabled)')) guide.used('choose');
      if (event.target.closest('#btn-step1-action:not(:disabled)')) guide.used('check');
    }
  };
  document.addEventListener('click', onClick);
  const onPairAction = event => guide.used(event.detail);
  document.addEventListener('jodo-interaction', onPairAction);
  document.addEventListener('wordal-interaction', onPairAction);
  window.addEventListener('pagehide', () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('jodo-interaction', onPairAction);
    document.removeEventListener('wordal-interaction', onPairAction);
  }, { once: true });
  return guide;
}
